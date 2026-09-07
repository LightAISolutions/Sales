#!/usr/bin/env python3
"""Validate Profiler industry reports against the dossiers they cite.

A report (live-site-pages/profiler-data/reports/<id>.report.json — schema:
repository-information/PROFILER-SCHEMA.md → Report schema) is a snapshot whose
citations are copied verbatim from dossier sources[] and whose figures come
from the profiles' normalized-KPI overlay. This script is the mandatory
verification pass after any report write (sibling of sync-profiler-registry.py
for profile writes):

    python3 scripts/check-profiler-reports.py            # validate everything

Checks per report: schema shape (required fields, type/kind/confidence enums),
citation resolution (slug registered, URL present in that profile's sources[],
party matches the derived tier), inline [c:id] token resolution, bars-figure
verification against the profile KPI overlay, coverage-pin drift, Admin-lens
guidanceOverlays[] anchors (moduleId/sectionId must exist in Profiler.gs's
guidance modules; ps required; no [c:id] tokens), and index reconciliation
(entry per file, counts, status vs supersedes, overlayModules vs overlays).

Severity: structural problems are always ERRORS. Citation/pin mismatches are
ERRORS while the cited profile still sits at the pinned profileVersion, and
WARNINGS once the dossier has moved on — a snapshot is allowed to age, but a
freshly authored report must resolve cleanly. Exit 1 on any error.

Pin drift (schema "Snapshot semantics": a published report is never edited, so
an aged pin is re-verified by reading, never re-pinned) is tracked so that the
warning count is actionable rather than merely nonzero:

  * Superseded reports (any report named in another's `supersedes`) are still
    schema-, citation- and index-checked, but their pin drift is NOT reported —
    they stay on disk by design and would otherwise age forever.
  * repository-information/report-pins-verified.json records, per (report,
    slug), the dossier profileVersion a pin was last re-verified AGAINST. A
    moved pin is quiet while the dossier sits at that version and WARNS again
    once the dossier moves past it — the re-warning is the intended behaviour
    (the pin needs reading again), not a bug. A pin with no entry warns.
  * The verified list is itself validated: an entry must name an existing
    report and a slug that report pins, must not claim a version the dossier
    has not reached, and must not sit at or below the pinned version.

So "0 warnings" now means: every aged pin on every current report was read at
the dossier's current version. It is reachable, and it un-reaches itself the
moment a cited dossier is revised. Record: PROFILER-COVERAGE-PLAN.md §9.3 (X3b).

The provenance classification MIRRORS ovSourceParty in Profiler.html and
sync-profiler-registry.py (registry `domains` match -> company; filing/wire
hosts -> disclosure; per-source `party` overrides). If one changes, change all.
"""
import json, os, re, sys

DATA = 'live-site-pages/profiler-data'
REPORTS = os.path.join(DATA, 'reports')
INDEX = os.path.join(REPORTS, 'reports-index.json')
VERIFIED = 'repository-information/report-pins-verified.json'

TYPES = ('macro', 'competitive', 'risk', 'opportunity')
KINDS = ('prose', 'callout', 'table', 'proscons', 'timeline', 'bars', 'ledger')
CONF = ('high', 'moderate', 'low')

WIRE_HOSTS = ['prnewswire.com', 'businesswire.com', 'globenewswire.com', 'newswire.ca',
              'accesswire.com', 'prnasia.com', 'acnnewswire.com', 'jcnnewswire.com', 'presseportal.de']
FILING_HOSTS = ['sec.gov', 'hkexnews.hk', 'hkex.com.hk', 'sse.com.cn', 'szse.cn',
                'cninfo.com.cn', 'dart.fss.or.kr', 'tdnet.info', 'jpx.co.jp', 'six-group.com',
                'londonstockexchange.com', 'sedar.com', 'asx.com.au']

def host_of(url):
    m = re.match(r'^https?://([^/?#]+)', str(url or ''), re.I)
    if not m: return ''
    h = re.sub(r':\d+$', '', m.group(1).lower())
    return h[4:] if h.startswith('www.') else h

def host_in(host, hosts):
    return any(host == d or host.endswith('.' + d) for d in hosts)

def source_party(src, domains):
    declared = (src or {}).get('party') or ''
    if declared in ('company', 'disclosure', 'independent'): return declared
    h = host_of((src or {}).get('url'))
    if not h: return 'independent'
    if host_in(h, domains): return 'company'
    if host_in(h, FILING_HOSTS) or host_in(h, WIRE_HOSTS): return 'disclosure'
    return 'independent'

CITE_TOKEN = re.compile(r'\[c:([a-z0-9-]+)\]', re.I)

def walk_strings(node):
    if isinstance(node, str):
        yield node
    elif isinstance(node, list):
        for v in node:
            yield from walk_strings(v)
    elif isinstance(node, dict):
        for v in node.values():
            yield from walk_strings(v)

PROFILER_GS = 'googleAppsScripts/Profiler/Profiler.gs'

def guidance_anchors():
    """Map of guidance module id -> set of section ids, parsed from Profiler.gs.

    Each guidanceDoc<Name>_() returns an object literal whose first "id" string
    is the module id and whose remaining "id" strings are section ids (tiles,
    glossary, quiz, and timeline entries use other keys). Returns None when the
    file is unreadable so callers can degrade to a warning instead of erroring.
    """
    try:
        src = open(PROFILER_GS, encoding='utf-8').read()
    except OSError:
        return None
    anchors = {}
    chunks = re.split(r'^function guidanceDoc\w+_\(\) \{', src, flags=re.M)[1:]
    for chunk in chunks:
        ids = re.findall(r'"id":\s*"([^"]+)"', chunk)
        if ids:
            anchors[ids[0]] = set(ids[1:])
    return anchors

def check_overlays(rep, anchors, err, warn):
    for i, o in enumerate(rep.get('guidanceOverlays') or []):
        tag = f'overlay {i} ({o.get("moduleId")!r} → {o.get("sectionId")!r})'
        ps = o.get('ps')
        if not (isinstance(ps, list) and ps and all(isinstance(p, str) and p.strip() for p in ps)):
            err(f'{tag}: ps must be a non-empty list of non-empty strings')
        for p in ps or []:
            if isinstance(p, str) and CITE_TOKEN.search(p):
                err(f'{tag}: [c:id] citation tokens are not allowed in overlay ps '
                    '(the lens renderer does not resolve them — the report link is the citation path)')
        if anchors is None:
            warn(f'{tag}: {PROFILER_GS} unreadable — anchor not verified'); continue
        if o.get('moduleId') not in anchors:
            err(f'{tag}: moduleId not among guidance modules {sorted(anchors)}')
        elif o.get('sectionId') not in anchors[o['moduleId']]:
            # The renderer falls back to end-of-module, so a stale anchor is
            # survivable at view time — but a fresh report must anchor cleanly.
            err(f'{tag}: sectionId not among sections {sorted(anchors[o["moduleId"]])}')

def load_verified(errors):
    """Map (report id, slug) -> entry from VERIFIED; shape errors are ERRORS."""
    try:
        doc = json.load(open(VERIFIED))
    except FileNotFoundError:
        return {}
    except json.JSONDecodeError as e:
        errors.append(f'{VERIFIED}: invalid JSON — {e}'); return {}
    out = {}
    for i, e in enumerate(doc.get('verified') or []):
        key = (e.get('report'), e.get('slug'))
        tag = f'{VERIFIED} entry {i} ({key[0]!r} / {key[1]!r})'
        if not (key[0] and key[1]):
            errors.append(f'{tag}: report and slug are required'); continue
        if key in out:
            errors.append(f'{tag}: duplicate — one entry per (report, slug)'); continue
        if not isinstance(e.get('verifiedAt'), int):
            errors.append(f'{tag}: verifiedAt must be an integer profileVersion'); continue
        if not (e.get('when') and e.get('why')):
            errors.append(f'{tag}: when and why are required')
        out[key] = e
    return out

def check_report(rep, reg_by_slug, anchors, errors, warnings, verified=None, track_drift=True, stats=None):
    """Check one report. track_drift=False (superseded reports) suppresses the
    aged-pin warning only; every other check still runs. `verified` is the
    (report, slug) -> entry map from load_verified(); `stats` collects counts."""
    rid = rep.get('id', '?')
    verified = verified or {}
    stats = stats if stats is not None else {}
    def err(msg): errors.append(f'{rid}: {msg}')
    def warn(msg): warnings.append(f'{rid}: {msg}')
    check_overlays(rep, anchors, err, warn)

    for f in ('schemaVersion', 'id', 'title', 'type', 'topic', 'generated', 'style',
              'scope', 'coverage', 'bluf', 'keyJudgments', 'sections', 'limitations', 'citations'):
        if f not in rep: err(f'missing required field {f!r}')
    if rep.get('type') not in TYPES: err(f'type {rep.get("type")!r} not in {TYPES}')
    if not re.match(r'^[a-z0-9-]+$', str(rep.get('id', ''))): err('id must be lowercase slug characters')

    # Load the cited profiles once; note which have moved past their pins.
    profiles, moved = {}, {}
    for pin in (rep.get('coverage') or {}).get('companies') or []:
        slug = pin.get('slug')
        if slug not in reg_by_slug:
            err(f'coverage pins unregistered slug {slug!r}'); continue
        try:
            p = json.load(open(os.path.join(DATA, f'{slug}.profile.json')))
        except FileNotFoundError:
            err(f'coverage pins {slug!r} but no profile file exists'); continue
        profiles[slug] = p
        cur, pinned = p.get('profileVersion'), pin.get('profileVersion')
        moved[slug] = cur != pinned
        v = verified.get((rid, slug))
        if not moved[slug]:
            if p.get('lastUpdated') != pin.get('lastUpdated'):
                err(f'{slug} pin lastUpdated {pin.get("lastUpdated")!r} != profile {p.get("lastUpdated")!r} at the same profileVersion')
            if v is not None:
                err(f'{slug}: {VERIFIED} carries an entry but the pin has not aged (still v{cur}) — remove it')
            continue
        if not track_drift:
            stats['superseded_pins'] = stats.get('superseded_pins', 0) + 1
            continue
        if v is None:
            warn(f'{slug} dossier now at v{cur} (report pinned v{pinned}) — snapshot has aged; not yet re-verified')
            continue
        va = v.get('verifiedAt')
        if not isinstance(cur, int) or not isinstance(pinned, int):
            err(f'{slug}: profileVersion must be an integer on both the pin ({pinned!r}) and the profile ({cur!r})')
        elif va <= pinned:
            err(f'{slug}: {VERIFIED} verifiedAt v{va} is not past the pinned v{pinned} — an entry must record a re-verification after drift')
        elif va == cur:
            stats['verified'] = stats.get('verified', 0) + 1
        elif va < cur:
            warn(f'{slug} dossier now at v{cur} (report pinned v{pinned}, last re-verified at v{va}) — moved past its verification; read it again')
        else:
            err(f'{slug}: {VERIFIED} records verification at v{va} but the dossier is only at v{cur}')

    # Citations: unique ids; resolve against the cited profile's sources[].
    cites = {}
    for c in rep.get('citations') or []:
        cid = c.get('id')
        if cid in cites: err(f'duplicate citation id {cid!r}')
        cites[cid] = c
        slug = c.get('slug')
        if slug not in reg_by_slug: err(f'citation {cid}: unregistered slug {slug!r}'); continue
        report_or_warn = warn if moved.get(slug) else err
        p = profiles.get(slug)
        if p is None:
            try: p = profiles[slug] = json.load(open(os.path.join(DATA, f'{slug}.profile.json')))
            except FileNotFoundError: err(f'citation {cid}: no profile file for {slug!r}'); continue
        src = next((s for s in p.get('sources') or [] if s.get('url') == c.get('url')), None)
        if src is None:
            report_or_warn(f'citation {cid}: url not found in {slug} sources[] — {c.get("url")}')
            continue
        for f in ('label', 'date'):
            if f in src or f in c:
                if src.get(f) != c.get(f):
                    report_or_warn(f'citation {cid}: {f} {c.get(f)!r} != profile source {src.get(f)!r}')
        want = source_party(src, reg_by_slug[slug].get('domains') or [])
        if c.get('party') != want:
            err(f'citation {cid}: party {c.get("party")!r} != derived {want!r}')

    # Inline tokens and cites[] arrays must resolve; citations should be used.
    used = set()
    for s in walk_strings({'b': rep.get('bluf'), 's': rep.get('sections'),
                           'j': rep.get('keyJudgments'), 'i': rep.get('indicators'),
                           'l': rep.get('limitations'), 'g': rep.get('coverage')}):
        for tok in CITE_TOKEN.findall(s):
            used.add(tok)
            if tok not in cites: err(f'inline token [c:{tok}] has no citation entry')
    for coll, lbl in ((rep.get('keyJudgments') or [], 'judgment'), (rep.get('sections') or [], 'section')):
        for it in coll:
            for cid in it.get('cites') or []:
                used.add(cid)
                if cid not in cites: err(f'{lbl} cites unknown citation {cid!r}')
    for cid in cites:
        if cid not in used: warn(f'citation {cid} is never referenced')

    # Sections: kinds, judgment confidences, bars-figure verification.
    for sec in rep.get('sections') or []:
        if sec.get('kind') not in KINDS: err(f'section {sec.get("id")!r}: kind {sec.get("kind")!r} not in {KINDS}')
        if sec.get('kind') == 'bars':
            for it in sec.get('items') or []:
                slug, kpi = it.get('slug'), it.get('kpi')
                if not (slug and kpi): continue
                p = profiles.get(slug)
                if p is None: err(f'bars item {it.get("label")!r}: slug {slug!r} not in coverage'); continue
                # Currency KPIs carry usdMillions; physical KPIs (gwh-shipped,
                # backlog-gwh, mw-energized, mw-contracted — schema v7) carry qty.
                vals = [v for per in (p.get('financials') or {}).get('periods') or []
                        for m in per.get('metrics') or []
                        if m.get('kpi') == kpi
                        for v in (m.get('usdMillions'), m.get('qty'))
                        if isinstance(v, (int, float))]
                if not vals:
                    (warn if moved.get(slug) else err)(f'bars item {it.get("label")!r}: {slug} has no {kpi} overlay figure')
                elif it.get('v') not in vals:
                    (warn if moved.get(slug) else err)(f'bars item {it.get("label")!r}: v={it.get("v")} not among {slug} {kpi} overlay values {vals}')
    for j in rep.get('keyJudgments') or []:
        if j.get('confidence') not in CONF: err(f'judgment confidence {j.get("confidence")!r} not in {CONF}')

def main():
    reg = json.load(open(os.path.join(DATA, 'profiler-companies.json')))
    reg_by_slug = {c['slug']: c for c in reg['companies']}
    anchors = guidance_anchors()
    errors, warnings = [], []
    try:
        idx = json.load(open(INDEX))
    except FileNotFoundError:
        print(f'ERROR  missing {INDEX}'); sys.exit(1)
    files = {f[:-len('.report.json')] for f in os.listdir(REPORTS) if f.endswith('.report.json')}
    idx_ids = [e.get('id') for e in idx.get('reports') or []]
    for rid in idx_ids:
        if rid not in files: errors.append(f'index lists {rid!r} but reports/{rid}.report.json is missing')
    for rid in sorted(files):
        if rid not in idx_ids: errors.append(f'reports/{rid}.report.json is not in the index')
    if len(set(idx_ids)) != len(idx_ids): errors.append('index contains duplicate ids')

    # Pass 1: load every report so `superseded` is known before any pin check.
    reports = {}
    for rid in sorted(files):
        try:
            rep = json.load(open(os.path.join(REPORTS, f'{rid}.report.json')))
        except json.JSONDecodeError as e:
            errors.append(f'{rid}: invalid JSON — {e}'); continue
        if rep.get('id') != rid: errors.append(f'{rid}: file name and id {rep.get("id")!r} disagree')
        reports[rid] = rep
    superseded = {r.get('supersedes') for r in reports.values() if r.get('supersedes')}

    # The verified-pins list must point at real, current reports and real pins.
    verified = load_verified(errors)
    for (vrid, vslug), e in verified.items():
        rep = reports.get(vrid)
        if rep is None:
            errors.append(f'{VERIFIED}: entry for {vrid!r} / {vslug!r} names a report that does not exist'); continue
        if vrid in superseded:
            errors.append(f'{VERIFIED}: entry for {vrid!r} / {vslug!r} — report is superseded; its pin drift is not tracked, remove the entry'); continue
        if vslug not in {c.get('slug') for c in (rep.get('coverage') or {}).get('companies') or []}:
            errors.append(f'{VERIFIED}: entry for {vrid!r} / {vslug!r} — the report does not pin that slug')

    # Pass 2: check every report; pin drift is reported for current reports only.
    stats = {}
    for rid, rep in sorted(reports.items()):
        check_report(rep, reg_by_slug, anchors, errors, warnings, verified,
                     track_drift=rid not in superseded, stats=stats)
    for e in idx.get('reports') or []:
        rep = reports.get(e.get('id'))
        if not rep: continue
        want_status = 'superseded' if e.get('id') in superseded else 'current'
        if e.get('status') != want_status:
            errors.append(f'index {e.get("id")}: status {e.get("status")!r} should be {want_status!r}')
        for f, want in (('type', rep.get('type')), ('date', rep.get('generated')),
                        ('companies', len((rep.get('coverage') or {}).get('companies') or [])),
                        ('citations', len(rep.get('citations') or []))):
            if e.get(f) != want:
                errors.append(f'index {e.get("id")}: {f} {e.get(f)!r} != report {want!r}')
        want_ov = sorted({o.get('moduleId') for o in rep.get('guidanceOverlays') or [] if o.get('moduleId')})
        if sorted(e.get('overlayModules') or []) != want_ov:
            errors.append(f'index {e.get("id")}: overlayModules {e.get("overlayModules")!r} '
                          f'!= report overlay modules {want_ov!r}')

    for w in warnings: print(f'  WARN  {w}')
    for e in errors: print(f'  ERROR {e}')
    print(f'{len(reports)} report(s) checked ({len(superseded & set(reports))} superseded, pin drift not tracked'
          f'{", " + str(stats["superseded_pins"]) + " aged pin(s) skipped" if stats.get("superseded_pins") else ""}) — '
          f'{len(errors)} error(s), {len(warnings)} warning(s); '
          f'{stats.get("verified", 0)} aged pin(s) verified at the current dossier version and quiet')
    sys.exit(1 if errors else 0)

if __name__ == '__main__':
    main()
# Developed by: LightAISolutions
