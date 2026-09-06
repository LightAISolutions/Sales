#!/usr/bin/env python3
"""Probe whether the DISCLOSURE-TIER source hosts are reachable from this session,
and measure how much the corpus actually leans on them.

Why this exists (v04.92r). The Profiler's Source Priority Protocol treats filings
as the durable route, and PROFILER-SCHEMA.md classifies any source on a filing
host as `disclosure` tier. But reachability is an ENVIRONMENT condition, not a
repo invariant: at v04.91r `data.sec.gov` served SEC's "Your Request Originates
from an Undeclared Automated Tool" page under a correctly declared non-personal
User-Agent, and the block was network-keyed rather than a User-Agent defect. That
was discovered twenty minutes into a refresh, after the research had been planned
around EDGAR. One command should say so in three seconds instead.

The second half is the part a probe alone would miss. When filings are
unreachable a session silently substitutes company newsrooms — first-party but
CURATED, where filings are not — and nothing in the toolchain notices the shift.
So this also measures the corpus's provenance mix from the committed dossiers:
overall, and for dossiers written recently. No new state file, no log to go
stale; the record is the data that is already in the repo.

    python3 scripts/check-source-reachability.py             # probe + corpus mix
    python3 scripts/check-source-reachability.py --no-net    # corpus mix only
    python3 scripts/check-source-reachability.py --days 60   # widen the recent window
    python3 scripts/check-source-reachability.py --json      # machine-readable

ALWAYS EXITS 0 (2 only on a broken input). A blocked government host is not a
repo defect and must never fail a commit or a pre-commit sweep. This script
reports a condition; it does not assert an invariant. That is the whole reason
it is separate from sync-profiler-registry.py, which asserts invariants, runs
after every profile write, and must stay fast and offline.

Run it BEFORE planning research for a `profiler <Company>` or a scheduled
refresh — not at commit time, when the answer is too late to be useful.
"""
import json, sys, os, re, importlib.util
from urllib import request, error

DATA = 'live-site-pages/profiler-data'
REG_PATH = os.path.join(DATA, 'profiler-companies.json')
SYNC_PATH = 'scripts/sync-profiler-registry.py'

# SEC asks that automated traffic declare itself with company information and a
# contact. NEVER put a personal email address here — this string is sent to
# third-party hosts on every run. A role address on an org domain only.
USER_AGENT = 'LightAISolutions Profiler Research admin@lightaisolutions.github.io'
TIMEOUT = 12

# Two SEC endpoints, because www.sec.gov and data.sec.gov sit behind different
# infrastructure and have been observed blocking independently. Two more filing
# hosts so a SEC-only block is distinguishable from a whole-tier block. And one
# CONTROL on a company host already proven reachable by the corpus — without it,
# "sec.gov unreachable" cannot be told apart from "this session has no network",
# and a null on one host would be read as a null on the route.
PROBES = [
    ('sec.gov',                'disclosure', 'https://www.sec.gov/files/company_tickers.json'),
    ('data.sec.gov',           'disclosure', 'https://data.sec.gov/submissions/CIK0001045810.json'),
    ('asx.com.au',             'disclosure', 'https://www.asx.com.au/'),
    ('londonstockexchange.com','disclosure', 'https://www.londonstockexchange.com/'),
    ('nvidianews.nvidia.com',  'control',    'https://nvidianews.nvidia.com/news'),
]

# SEC's block page is a 403 whose BODY names the reason. The status code alone
# cannot distinguish it from an egress-policy denial, and the two need different
# advice, so match the body.
SEC_BLOCK_MARK = 'Undeclared Automated Tool'


def die(msg):
    """Broken input. Exits 2, NOT 1 — 1 is reserved by the other checkers for
    'findings present', and this script never has findings in that sense."""
    sys.stderr.write('check-source-reachability: %s\n' % msg)
    raise SystemExit(2)


def load_sync():
    """Import sync-profiler-registry.py for its provenance classifier.

    The classifier is deliberately NOT reimplemented here. sync-profiler-registry.py
    already carries the comment that it MIRRORS ovSourceParty in Profiler.html and
    that changing one means changing both; a third copy would make it three places
    that drift apart silently. The filename has a hyphen, so it is loaded by path.
    """
    spec = importlib.util.spec_from_file_location('sync_profiler_registry', SYNC_PATH)
    if spec is None or spec.loader is None:
        die('cannot load %s' % SYNC_PATH)
    mod = importlib.util.module_from_spec(spec)
    try:
        spec.loader.exec_module(mod)
    except (OSError, SyntaxError, ImportError) as e:
        # spec_from_file_location happily returns a spec for a path that does not
        # exist, so the `spec is None` guard above never fires for a missing file
        # — exec_module is where it actually surfaces. Without this the script
        # exits 1 with a traceback instead of 2 with a message. (Found by testing.)
        die('cannot load %s: %s' % (SYNC_PATH, e))
    return mod


def probe(url):
    """One GET. Returns (status, verdict, detail). Never raises.

    Request() is built INSIDE the try on purpose: it raises ValueError on a
    malformed URL before any network call, so building it outside would let a
    typo in PROBES crash the whole report instead of producing one bad row.
    (Found by testing with a malformed URL; it could not fire from the current
    PROBES list, which is exactly why it would have survived to the first edit.)
    """
    try:
        req = request.Request(url, headers={
            'User-Agent': USER_AGENT,
            'Accept-Encoding': 'identity',
            'Accept': '*/*',
        })
        with request.urlopen(req, timeout=TIMEOUT) as r:
            r.read(2048)
            return r.status, 'reachable', ''
    except error.HTTPError as e:
        try:
            body = e.read(4096).decode('utf-8', 'replace')
        except Exception:
            body = ''
        if e.code == 403 and SEC_BLOCK_MARK in body:
            return e.code, 'blocked', ('SEC undeclared-automated-tool page — the block is keyed to this '
                                       'network, not to the User-Agent; retrying is pointless load')
        if e.code in (401, 403, 407):
            return e.code, 'blocked', 'denied (%s) — egress policy or host bot rule; do not retry' % e.reason
        if e.code == 429:
            return e.code, 'throttled', 'rate limited — back off, the host is otherwise reachable'
        return e.code, 'error', str(e.reason)
    except error.URLError as e:
        return None, 'unreachable', str(getattr(e, 'reason', e))
    except Exception as e:                       # timeouts, TLS, malformed URL
        return None, 'unreachable', '%s: %s' % (type(e).__name__, e)


def run_probes():
    out = []
    for host, tier, url in PROBES:
        status, verdict, detail = probe(url)
        out.append({'host': host, 'tier': tier, 'url': url,
                    'status': status, 'verdict': verdict, 'detail': detail})
    return out


def read_verdict(results):
    """Turn the probe rows into one sentence a session can act on.

    The control row is what makes this honest: with the control down, nothing can
    be concluded about the filing hosts, so say that instead of blaming them.
    """
    ctrl = [r for r in results if r['tier'] == 'control']
    disc = [r for r in results if r['tier'] == 'disclosure']
    ok_ctrl = [r for r in ctrl if r['verdict'] == 'reachable']
    ok_disc = [r for r in disc if r['verdict'] == 'reachable']
    if ctrl and not ok_ctrl:
        return 'inconclusive', ('the control host is unreachable too, so this session may have no outbound '
                                'network at all — nothing can be concluded about the filing hosts')
    if not ok_disc:
        return 'tier-blocked', ('NO disclosure-tier host answered while the control did — filings are '
                                'unavailable from this session; source from company and independent hosts '
                                'and say so in the dossier')
    if len(ok_disc) < len(disc):
        down = ', '.join(r['host'] for r in disc if r['verdict'] != 'reachable')
        return 'partial', ('some filing hosts are blocked (%s) while others answered — a null from a '
                           'blocked host bounds that host, not the filing route' % down)
    return 'ok', 'every probed disclosure-tier host answered'


def corpus_mix(sync, days):
    """Classify every source in every dossier by provenance tier.

    Returns (overall, recent, cutoff, n_recent). `recent` covers dossiers whose
    lastUpdated falls in the last `days` — the window where a reachability change
    would show up first. A tier share that drops in `recent` while `overall` holds
    is the drift this script exists to make visible.
    """
    try:
        reg = json.load(open(REG_PATH, encoding='utf-8'))
    except (OSError, ValueError) as e:
        die('cannot read %s: %s' % (REG_PATH, e))

    import datetime
    cutoff = (datetime.date.today() - datetime.timedelta(days=days)).isoformat()
    overall = {'company': 0, 'disclosure': 0, 'independent': 0}
    recent = {'company': 0, 'disclosure': 0, 'independent': 0}
    n_recent = n_total = 0

    for c in reg['companies']:
        path = os.path.join(DATA, '%s.profile.json' % c['slug'])
        try:
            prof = json.load(open(path, encoding='utf-8'))
        except (OSError, ValueError):
            continue
        n_total += 1
        is_recent = str(c.get('lastUpdated') or '') >= cutoff
        if is_recent:
            n_recent += 1
        for src in prof.get('sources') or []:
            party = sync.source_party(src, c.get('domains') or [])
            overall[party] = overall.get(party, 0) + 1
            if is_recent:
                recent[party] = recent.get(party, 0) + 1
    return overall, recent, cutoff, n_recent, n_total


def pct(counts):
    t = sum(counts.values()) or 1
    return {k: round(100.0 * v / t) for k, v in counts.items()}


def main(argv):
    days = 30
    if '--days' in argv:
        try:
            days = int(argv[argv.index('--days') + 1])
        except (IndexError, ValueError):
            die('--days needs an integer')
    sync = load_sync()
    overall, recent, cutoff, n_recent, n_total = corpus_mix(sync, days)
    # The window is only a measurement while it excludes something. The corpus is
    # refreshed in sweeps, so a 30-day window has repeatedly contained every
    # dossier — printing "+0 pt" there reports arithmetic as if it were a finding.
    degenerate = n_recent >= n_total
    results = [] if '--no-net' in argv else run_probes()
    verdict, why = read_verdict(results) if results else ('skipped', '--no-net')

    if '--json' in argv:
        print(json.dumps({'verdict': verdict, 'why': why, 'probes': results,
                          'overall': overall, 'overallPct': pct(overall),
                          'recent': recent, 'recentPct': pct(recent),
                          'recentSince': cutoff, 'recentDossiers': n_recent,
                          'totalDossiers': n_total, 'windowDegenerate': degenerate},
                         indent=1))
        return 0

    print('=' * 72)
    print('DISCLOSURE-TIER REACHABILITY  —  condition report, never a failure')
    print('=' * 72)
    for r in results:
        st = r['status'] if r['status'] is not None else '---'
        print('  %-9s %-26s %-4s %s' % (r['verdict'].upper(), r['host'], st, r['detail']))
    if results:
        print('-' * 72)
        print('  VERDICT: %s — %s' % (verdict.upper(), why))
    print('-' * 72)
    o, rc = pct(overall), pct(recent)
    print('  corpus provenance mix (%d sources):        company %d%% · disclosure %d%% · independent %d%%'
          % (sum(overall.values()), o['company'], o['disclosure'], o['independent']))
    print('  dossiers updated since %s (%d of %d):  company %d%% · disclosure %d%% · independent %d%%'
          % (cutoff, n_recent, n_total, rc['company'], rc['disclosure'], rc['independent']))
    if degenerate:
        print('  NO COMPARISON: the %d-day window covers every dossier, so the two lines are the same' % days)
        print('                 measurement and the delta is zero by construction, not by finding.')
        print('                 Narrow it with --days once the corpus has an update spread.')
    else:
        delta = rc['disclosure'] - o['disclosure']
        print('  disclosure-tier share in the recent window is %+d pt vs the corpus%s'
              % (delta, ' — worth a look if filings are blocked' if delta <= -5 else ''))
    print('=' * 72)
    return 0


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))

# Developed by: LightAISolutions
