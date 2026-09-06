#!/usr/bin/env python3
"""Sync denormalized per-company summary fields in profiler-companies.json
from the individual <slug>.profile.json dossiers.

The roster deliberately renders from the registry alone (one fetch, no
per-card profile loads — see "Recall design" in .claude/rules/profiler-app.md),
so anything the roster displays about a dossier must be denormalized here.
Denormalized data drifts; this script is the reconciliation. Run it after any
pass that adds or revises profiles, and any time the roster looks out of step:

    python3 scripts/sync-profiler-registry.py          # write changes
    python3 scripts/sync-profiler-registry.py --check  # report drift, exit 1 if any

Fields synced per company:
    lastUpdated  — copied from the profile
    srcTotal     — number of cited sources
    srcFirstPct  — first-party share (company + disclosure), percent, rounded
    kpiNorm      — true when a schema-v4 normalized annual revenue exists

It also asserts a REFRESH-CALENDAR BIJECTION: every active company on the roster
has a row in repository-information/profiler-refresh-calendar.json, and every row
resolves to a covered company. This lives here rather than in its own checker for
one reason — it is the script sessions already run after every profile write, and
an unscheduled company is a failure that HIDES ITSELF: it simply never appears in
the earnings desk's queue, so nothing surfaces it. The gap had reached 38 of 151
companies before it was noticed by accident (v04.88r).

The calendar is read ONLY — this script never writes it. Under --check a bijection
or row-schema defect is an ERROR and exits 1; in write mode it is a WARNING, because
during normal authoring a company is legitimately registered before its calendar row
is added later in the same session.

The provenance classification below MIRRORS ovSourceParty in Profiler.html
(registry `domains` match -> company; filing/wire hosts -> disclosure;
per-source `party` overrides everything). If one changes, change both.
"""
import json, sys, re

REG_PATH = 'live-site-pages/profiler-data/profiler-companies.json'
PROFILE_PATH = 'live-site-pages/profiler-data/{slug}.profile.json'
CALENDAR_PATH = 'repository-information/profiler-refresh-calendar.json'

WIRE_HOSTS = ['prnewswire.com', 'businesswire.com', 'globenewswire.com', 'newswire.ca',
              'accesswire.com', 'prnasia.com', 'acnnewswire.com', 'jcnnewswire.com', 'presseportal.de']
FILING_HOSTS = ['sec.gov', 'hkexnews.hk', 'hkex.com.hk', 'sse.com.cn', 'szse.cn',
                'cninfo.com.cn', 'dart.fss.or.kr', 'tdnet.info', 'jpx.co.jp', 'six-group.com',
                'londonstockexchange.com', 'sedar.com', 'asx.com.au']

def host_of(url):
    m = re.match(r'^https?://([^/?#]+)', str(url or ''), re.I)
    if not m: return ''
    h = m.group(1).lower()
    h = re.sub(r':\d+$', '', h)
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

def has_norm_revenue(profile):
    for per in (profile.get('financials') or {}).get('periods') or []:
        if per.get('periodType') != 'annual': continue
        for m in per.get('metrics') or []:
            if m.get('kpi') == 'revenue' and isinstance(m.get('usdMillions'), (int, float)):
                return True
    return False

def check_calendar(reg):
    """Assert the roster <-> refresh-calendar bijection and the row schema.

    Returns a list of finding strings; empty means clean. Reads the calendar
    read-only. An absent or unreadable calendar is reported as a single finding
    rather than raised — so it never crashes — but it still counts as a finding
    and therefore still fails --check, because the calendar is a committed file
    and its absence from a real checkout is itself a defect.
    """
    try:
        cal = json.load(open(CALENDAR_PATH))
    except FileNotFoundError:
        return ['calendar not found at %s — bijection not checked' % CALENDAR_PATH]
    except (ValueError, OSError) as e:
        return ['calendar unreadable (%s) — bijection not checked' % e]

    rows = cal.get('companies') or []
    # Archived companies may keep a row but are not required to have one; the
    # desk only queues live coverage.
    active = {c['slug'] for c in reg['companies'] if c.get('status', 'active') == 'active'}
    covered = {c['slug'] for c in reg['companies']}
    listed = [r.get('slug') for r in rows]
    listed_set = set(listed)

    out = []
    for slug in sorted(active - listed_set):
        out.append('%s: covered but has NO refresh-calendar row' % slug)
    for slug in sorted(listed_set - covered):
        out.append('%s: calendar row has no dossier in the registry' % slug)
    for slug in sorted({s for s in listed if listed.count(s) > 1}):
        out.append('%s: duplicate calendar row (%d rows)' % (slug, listed.count(slug)))

    # Row schema (PROFILER-SCHEMA.md -> Refresh calendar). Only rows whose slug
    # is covered are shape-checked; orphans are already reported above.
    for r in rows:
        slug = r.get('slug')
        if slug not in covered:
            continue
        has_next, has_cadence = 'nextReport' in r, 'cadence' in r
        if has_next == has_cadence:
            out.append('%s: must carry exactly one of nextReport or cadence' % slug)
        if has_next:
            if 'confirmed' not in r:
                out.append('%s: public row missing `confirmed`' % slug)
            if not re.fullmatch(r'\d{4}-\d{2}-\d{2}', str(r.get('nextReport', ''))):
                out.append('%s: nextReport %r is not YYYY-MM-DD' % (slug, r.get('nextReport')))
        if has_cadence and r.get('cadence') != 'quarterly':
            out.append('%s: cadence must be "quarterly", got %r' % (slug, r.get('cadence')))
        for f in ('source', 'lastRefreshed', 'watch'):
            if not r.get(f):
                out.append('%s: missing or empty `%s`' % (slug, f))
    return out

def main():
    check = '--check' in sys.argv
    reg = json.load(open(REG_PATH))
    changed = []
    for c in reg['companies']:
        slug = c['slug']
        try:
            p = json.load(open(PROFILE_PATH.format(slug=slug)))
        except FileNotFoundError:
            print(f'  WARN  {slug}: no profile file — skipped')
            continue
        domains = c.get('domains') or []
        srcs = p.get('sources') or []
        fp = sum(1 for s in srcs if source_party(s, domains) in ('company', 'disclosure'))
        want = {
            'lastUpdated': p.get('lastUpdated') or c.get('lastUpdated'),
            'srcTotal': len(srcs),
            'srcFirstPct': round(fp / len(srcs) * 100) if srcs else 0,
            'kpiNorm': has_norm_revenue(p),
        }
        diffs = {k: (c.get(k), v) for k, v in want.items() if c.get(k) != v}
        if diffs:
            changed.append((slug, diffs))
            c.update(want)
    if changed:
        for slug, diffs in changed:
            print(f'  {slug}: ' + ', '.join(f'{k} {a!r} -> {b!r}' for k, (a, b) in diffs.items()))
    print(f'{len(changed)} of {len(reg["companies"])} entries ' + ('out of sync' if check else 'updated'))

    cal_findings = check_calendar(reg)
    label = 'ERROR' if check else 'WARN '
    for f in cal_findings:
        print('  %s calendar: %s' % (label, f))
    print('refresh calendar: %d finding(s)' % len(cal_findings)
          + ('' if cal_findings else ' — roster and calendar in bijection'))

    if check:
        sys.exit(1 if (changed or cal_findings) else 0)
    if changed:
        with open(REG_PATH, 'w') as f:
            json.dump(reg, f, indent=2, ensure_ascii=False)
            f.write('\n')

if __name__ == '__main__':
    main()
# Developed by: LightAISolutions
