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
verification against the profile KPI overlay, coverage-pin drift, and index
reconciliation (entry per file, counts, status vs supersedes).

Severity: structural problems are always ERRORS. Citation/pin mismatches are
ERRORS while the cited profile still sits at the pinned profileVersion, and
WARNINGS once the dossier has moved on — a snapshot is allowed to age, but a
freshly authored report must resolve cleanly. Exit 1 on any error.

The provenance classification MIRRORS ovSourceParty in Profiler.html and
sync-profiler-registry.py (registry `domains` match -> company; filing/wire
hosts -> disclosure; per-source `party` overrides). If one changes, change all.
"""
import json, os, re, sys

DATA = 'live-site-pages/profiler-data'
REPORTS = os.path.join(DATA, 'reports')
INDEX = os.path.join(REPORTS, 'reports-index.json')

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

def check_report(rep, reg_by_slug, errors, warnings):
    rid = rep.get('id', '?')
    def err(msg): errors.append(f'{rid}: {msg}')
    def warn(msg): warnings.append(f'{rid}: {msg}')

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
        moved[slug] = p.get('profileVersion') != pin.get('profileVersion')
        if moved[slug]:
            warn(f'{slug} dossier now at v{p.get("profileVersion")} (report pinned v{pin.get("profileVersion")}) — snapshot has aged')
        elif p.get('lastUpdated') != pin.get('lastUpdated'):
            err(f'{slug} pin lastUpdated {pin.get("lastUpdated")!r} != profile {p.get("lastUpdated")!r} at the same profileVersion')

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
                vals = [m.get('usdMillions') for per in (p.get('financials') or {}).get('periods') or []
                        for m in per.get('metrics') or []
                        if m.get('kpi') == kpi and isinstance(m.get('usdMillions'), (int, float))]
                if not vals:
                    (warn if moved.get(slug) else err)(f'bars item {it.get("label")!r}: {slug} has no {kpi} overlay figure')
                elif it.get('v') not in vals:
                    (warn if moved.get(slug) else err)(f'bars item {it.get("label")!r}: v={it.get("v")} not among {slug} {kpi} overlay values {vals}')
    for j in rep.get('keyJudgments') or []:
        if j.get('confidence') not in CONF: err(f'judgment confidence {j.get("confidence")!r} not in {CONF}')

def main():
    reg = json.load(open(os.path.join(DATA, 'profiler-companies.json')))
    reg_by_slug = {c['slug']: c for c in reg['companies']}
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

    reports = {}
    for rid in sorted(files):
        try:
            rep = json.load(open(os.path.join(REPORTS, f'{rid}.report.json')))
        except json.JSONDecodeError as e:
            errors.append(f'{rid}: invalid JSON — {e}'); continue
        if rep.get('id') != rid: errors.append(f'{rid}: file name and id {rep.get("id")!r} disagree')
        reports[rid] = rep
        check_report(rep, reg_by_slug, errors, warnings)
    superseded = {r.get('supersedes') for r in reports.values() if r.get('supersedes')}
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

    for w in warnings: print(f'  WARN  {w}')
    for e in errors: print(f'  ERROR {e}')
    print(f'{len(reports)} report(s) checked — {len(errors)} error(s), {len(warnings)} warning(s)')
    sys.exit(1 if errors else 0)

if __name__ == '__main__':
    main()
# Developed by: LightAISolutions
