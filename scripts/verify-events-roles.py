#!/usr/bin/env python3
"""Verify the Events app's door — the admin-only access matrix (design plan D7).

Serves live-site-pages/ over localhost, seeds a session for each ACL tier,
stubs the Events GAS backend (action=events) and asserts, per tier:

    tier         admitted   surface                                     data requests
    admin         yes       the agenda over the public registry + stars  1 (eop=list)
    contributor    no       the turned-away card, no agenda              0
    analyst        no       the turned-away card, no agenda              0
    viewer         no       the turned-away card, no agenda              0

The page is an auth-template page: the session lives in sessionStorage under
the page-scoped keys, and on load the fetch transport validates the stored
session with a heartbeat before it lets the auth wall down. The harness seeds
the storage the way saveSession() writes it, gives the page a base URL, and
answers that heartbeat the way the real backend would — everything after that
(the resume path → showApp → evRole → evAdmitted → the door → the registry
fetch → the list op) is the real page code.

Also checked: the ?as=<tier> preview keeps only-subtracting semantics — an
admin previewing as viewer is turned away; a viewer previewing as admin stays
turned away and still issues zero requests. For a turned-away tier the public
registry is NOT fetched either — the denied card is the whole of the load.

E1 session 1 — the agenda (design plan §5.3): for the admin the registry
(events-data/events.json, a relative fetch) renders as month → day groups with
a sticky month header, rows carry name · dates · place · kind with a star
toggle, a tentative row says so, the filter card carries the kind / region /
segment / starred pills and the disabled "Signals only (from E4)" pill, and a
row tap opens the detail sheet with the Google Calendar link (dates= / ctz=)
and the .ics download. The stub answers eop=list with an empty Stars set.
E1 session 2 — the phone pass (§13.7 step 7), for the admin: the month header
sticks while its month scrolls, scrolling past a month boundary changes the
month-in-view label, the sheet opens and closes, a star round-trips through a
STATEFUL stub (eop=star → the refetched eop=list carries it → the row and the
Starred count show it → eop=unstar clears it), one event's .ics text parses
under a minimal VEVENT walker and is byte-identical (DTSTAMP aside) to that
event's VEVENT in the published events-data/events.ics, the Google Calendar
href carries dates= / ctz=, the day-plan tab lists the starred event on its
day, the Subscribe pill offers the webcal:// URL of the published file and the
file itself serves as text/calendar. Screenshots: events-month.png,
events-agenda.png, events-detail.png, events-dayplan.png. Zero page errors.
The real-phone Calendar / .ics import is the developer's check, reported in
the hand-off — never asserted here.

E2 (design plan §13.10 step 6) — the Proposed tab: painted for the admin only
(the other tiers still issue zero requests — they never reach the tab strip);
opening it issues exactly one eop=proposed; the stub answers one pending and
one approved row from two sources plus a Polls outcome; the rows group by
source with Before → After; Approve on the pending row sends eop=decide with
status=approved and the panel refreshes; the copy-as-JSON field parses back to
{ schemaVersion: 1, proposals: [the approved rows], polls: [...] }; Mark
applied with a bad version is refused on the page (no request), with a good
one sends eop=applied; Install poller sends eop=installpoller and Poll now
eop=pollnow. Screenshot: events-proposed.png.

E3 (design plan §13.11 step 5) — the Recommended pill on the Mine row, for
the admin: pressing it issues exactly one eop=recommend; the stub answers a
score for three upcoming events (the last of them highest) and the agenda
re-orders into one "Recommended" section by the stub's scores with a score
chip on every scored row and the month-in-view label reading Recommended;
opening the top event shows the why panel — the score, six term bars with
their weights, the stub account by name with its stage and the evidence link,
the matched segments, the mention chips and the starred conflict; pressing
the pill again restores the month groups. The other tiers never reach the
agenda, so they still issue zero requests. Screenshot: events-recommended.png.

Chromium is PRE-INSTALLED in the Claude Code web environment at /opt/pw-browsers;
the bundled Playwright build number does not match, so launch with an explicit
executable_path. Do NOT run `playwright install`.

Usage:
  python3 scripts/verify-events-roles.py

Screenshots land in .playwright-screenshots/events-role-<tier>.png (gitignored),
taken at phone width (390 × 844) because the app is used on a phone.
Exit code is non-zero if any tier's rendered surface disagrees with the matrix
or a turned-away tier issued a data request, so it can gate CI.
"""
import glob, json, re, threading, functools, http.server, socketserver, sys
from urllib.parse import urlparse, parse_qsl
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
LIVE = REPO / 'live-site-pages'
SHOTS = REPO / '.playwright-screenshots'
SHOTS.mkdir(exist_ok=True)

TIERS = ('admin', 'contributor', 'analyst', 'viewer')
EXPECT = {'admin': True, 'contributor': False, 'analyst': False, 'viewer': False}
STUB_BASE = 'https://script.google.com/macros/s/VERIFY-EVENTS-STUB/exec'
PHONE = {'width': 390, 'height': 844}


def find_chrome():
    for pat in ('/opt/pw-browsers/chromium-*/chrome-linux/chrome',
                '/opt/pw-browsers/chromium-*/chrome-linux/headless_shell'):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None


class _Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a, **k):
        pass


def serve(directory):
    handler = functools.partial(_Quiet, directory=str(directory))
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, httpd.server_address[1]


PROPOSED_STUB = [
    {'id': 'pr-0000000000001', 'sourceKey': 'clarion-powergen', 'slug': 'powergen-2027', 'change': 'moved-dates',
     'before': {'start': '2027-01-18', 'end': '2027-01-20'}, 'after': {'start': '2027-01-25', 'end': '2027-01-27'},
     'evidenceUrl': 'https://www.powergen.com/', 'seenAt': '2026-09-22T06:00:00.000Z', 'status': 'pending', 'decidedAt': '', 'appliedIn': ''},
    {'id': 'pr-0000000000002', 'sourceKey': 'ai-infra-summit', 'slug': 'ai-infra-summit-2027', 'change': 'new-edition',
     'before': {'slug': 'ai-infra-summit-2026'}, 'after': {'slug': 'ai-infra-summit-2027', 'name': 'AI Infra Summit 2027', 'start': '2027-09-14', 'end': '2027-09-16', 'status': 'tentative'},
     'evidenceUrl': 'https://ai-infra-summit.com/events/ai-infra-summit', 'seenAt': '2026-09-22T06:00:00.000Z', 'status': 'approved', 'decidedAt': '2026-09-22T06:30:00.000Z', 'appliedIn': ''},
]
def recommend_stub():
    """E3 — eop=recommend over the served registry: the first three upcoming
    confirmed events scored 0.42 / 0.77 / 0.91 in that order (so the ranked
    list is the REVERSE of date order), each with a why; the third carries the
    stub account, a starred conflict and a mention."""
    reg = json.loads((LIVE / 'events-data' / 'events.json').read_text(encoding='utf-8'))
    today = '2026-09-22'
    up = [e for e in reg['events'] if e.get('status') == 'confirmed' and (e.get('end') or e.get('start')) >= today][:3]
    scores = [0.42, 0.77, 0.91]
    events = []
    for i, e in enumerate(up):
        terms = {'segmentFit': 0.5, 'accountPresence': 0.9 if i == 2 else 0, 'corpusSalience': 0.25, 'proximity': 1 if i else 0,
                 'conflict': -1 if i == 2 else 0, 'relevancePrior': (e.get('relevance') or 3) / 5}
        why = {'segments': (e.get('audience') or [])[:1], 'accounts': [], 'mentions': [m['slug'] for m in (e.get('mentions') or [])][:2], 'conflicts': []}
        if i == 2:
            why['accounts'] = [{'id': 'a-0000000000001', 'name': 'Stub Account Co', 'stage': 'shortlist', 'relationship': 'target', 'stageWeight': 1.0,
                                'signal': {'kind': 'exhibitor', 'confidence': 0.9, 'evidenceUrl': 'https://example.com/exhibitors/stub-account'}}]
            why['conflicts'] = [up[0]['slug']]
        events.append({'slug': e['slug'], 'score': scores[i], 'terms': terms, 'why': why})
    events.sort(key=lambda x: (-x['score'], x['slug']))
    return {'success': True, 'today': today, 'weights': {'segmentFit': 0.35, 'accountPresence': 0.35, 'corpusSalience': 0.15, 'proximity': 0.10, 'conflict': 0.25, 'relevancePrior': 0.05},
            'regions': ['TX'], 'defaulted': [], 'seeded': False, 'notConfigured': False, 'accounts': 1, 'accountsRead': 1, 'signals': 1, 'signalsCapped': False,
            'seatSegments': [], 'unavailable': [], 'starred': 1, 'events': events}


POLLS_STUB = [{'sourceKey': 'ai-infra-summit', 'ranAt': '2026-09-22T06:00:00.000Z', 'status': '200', 'items': 2, 'newest': '2027-09-14'},
              {'sourceKey': 'clarion-powergen', 'ranAt': '2026-09-22T06:00:00.000Z', 'status': '200', 'items': 1, 'newest': '2027-01-25'},
              {'sourceKey': 'esig-events', 'ranAt': '2026-09-22T06:00:00.000Z', 'status': '403', 'items': 0, 'newest': ''}]


def gas_stub(role, counter, stars, proposed=None, signals=None):
    """Stand in for the deployed Events GAS: records every data request as
    'events:<eop>' and answers the four Stars ops the way handleEventsOp_ /
    evStarOp_ do for the tier, against an in-memory Stars set so a star
    round-trips (star → list → unstar → list). E2: answers eop=proposed from
    an in-memory queue and applies decide / applied / pollnow / installpoller
    to it the way the poller ops do."""
    proposed = [] if proposed is None else proposed
    signals = [] if signals is None else signals     # E4: every eop=signal write the page sends
    def params_of(request):
        q = dict(parse_qsl(urlparse(request.url).query))
        if request.method == 'POST' and request.post_data:
            q.update(dict(parse_qsl(request.post_data)))
        return q

    def handle(route, request):
        p = params_of(request)
        action, op = p.get('action', ''), p.get('op', '')
        body = {'success': False, 'error': 'unsupported_in_test'}
        if action == 'heartbeat' or op == 'heartbeat':
            counter.append('heartbeat')
            body = {'type': 'gas-heartbeat-ok', 'expiresIn': 7200, 'absoluteTimeout': 28800}
        elif action == 'events' or op == 'events':
            eop = p.get('eop', '')
            counter.append('events:' + eop)
            if role != 'admin':
                body = {'success': False, 'error': 'ROLE_DENIED', 'role': role}
            elif eop == 'list':
                body = {'success': True, 'role': 'admin', 'caps': ['calendar'], 'stars': list(stars.values())}
            elif eop in ('star', 'note'):
                slug = p.get('slug', '')
                row = stars.get(slug) or {'id': 'st-' + ('%013d' % (len(stars) + 1)), 'slug': slug, 'attending': 'planning',
                                          'note': '', 'updatedAt': '2026-09-22T00:00:00.000Z'}
                if p.get('attending'):
                    row['attending'] = p['attending']
                if eop == 'note' and 'note' in p:
                    row['note'] = p['note']
                stars[slug] = row
                body = {'success': True, 'created': True, 'star': dict(row)}
            elif eop == 'unstar':
                removed = p.get('slug', '') in stars
                stars.pop(p.get('slug', ''), None)
                body = {'success': True, 'removed': removed, 'slug': p.get('slug', '')}
            elif eop == 'proposed':
                counts = {k: len([r for r in proposed if r['status'] == k]) for k in ('pending', 'approved', 'rejected', 'applied')}
                body = {'success': True, 'proposals': [dict(r) for r in proposed if r['status'] in ('pending', 'approved')],
                        'counts': counts, 'polls': POLLS_STUB, 'pollerInstalled': False,
                        'signals': {'installed': False, 'last': None, 'schedule': 'weekly, Tuesday 06:00 America/New_York'}}
            elif eop == 'decide':
                row = next((r for r in proposed if r['id'] == p.get('id')), None)
                if row is None or p.get('status') not in ('approved', 'rejected'):
                    body = {'success': False, 'error': 'not_found' if row is None else 'bad_status'}
                else:
                    row['status'] = p['status']; row['decidedAt'] = '2026-09-22T07:00:00.000Z'
                    body = {'success': True, 'id': row['id'], 'status': row['status'], 'decidedAt': row['decidedAt']}
            elif eop == 'applied':
                ids = [x for x in p.get('ids', '').split(',') if x]
                done = [r['id'] for r in proposed if r['id'] in ids and r['status'] == 'approved']
                for r in proposed:
                    if r['id'] in done:
                        r['status'] = 'applied'; r['appliedIn'] = p.get('version', '')
                body = {'success': True, 'applied': done, 'skipped': [], 'version': p.get('version', '')}
            elif eop == 'pollnow':
                body = {'success': True, 'ranAt': '2026-09-22T07:05:00.000Z', 'sources': 58, 'fetched': 11, 'skipped': 47, 'failed': 1,
                        'proposed': 0, 'duplicates': 2, 'stopped': False, 'results': []}
            elif eop == 'installpoller':
                body = {'success': True, 'installed': True, 'removed': 0, 'schedule': 'weekly, Monday 06:00 America/New_York'}
            elif eop == 'recommend':
                body = recommend_stub()
            # E4 session 1 — the manual signal form, the pill and the sweep controls
            elif eop == 'netaccounts':
                body = {'success': True, 'built': '2026-09-22T00:00:00Z', 'accounts': [
                    {'id': 'a-0000000000001', 'name': 'Stub Account Co', 'slug': 'stub-account', 'relationship': 'target', 'stage': 'shortlist', 'segments': [], 'tags': []},
                    {'id': 'a-0000000000002', 'name': 'Other Partner', 'slug': '', 'relationship': 'partner', 'stage': 'none', 'segments': [], 'tags': []}]}
            elif eop == 'signal':
                signals.append({k: p.get(k, '') for k in ('accountId', 'slug', 'kind', 'evidenceUrl', 'note', 'confidence')})
                body = {'success': True, 'written': 1, 'updated': 0, 'rejected': [], 'kind': p.get('kind', ''), 'slug': p.get('slug', '')}
            elif eop == 'installsignals':
                body = {'success': True, 'installed': True, 'removed': 0, 'schedule': 'weekly, Tuesday 06:00 America/New_York'}
            elif eop == 'signalsnow':
                body = {'success': True, 'ranAt': '2026-09-22T07:10:00.000Z', 'owners': 1, 'events': 3, 'starred': 1, 'ranked': 2, 'pages': 4, 'pagesFailed': 1,
                        'feeds': [{'key': 'prnewswire', 'status': 200, 'items': 20}, {'key': 'businesswire', 'status': 200, 'items': 812}, {'key': 'globenewswire', 'status': 0, 'error': 'fetch_failed', 'items': 0}],
                        'found': 2, 'written': 2, 'updated': 0, 'rejected': 0, 'notConfigured': False, 'stopped': False, 'results': []}
        else:
            counter.append('other')
        route.fulfill(status=200, content_type='application/json',
                      headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps(body))
    return handle


def seed_script(role):
    perms = ['read', 'write', 'delete', 'export', 'amend', 'admin'] if role == 'admin' else ['read']
    return ("""
      (function () {
        var s = window.sessionStorage;
        s.setItem('Events_gas_session_token', '%s');
        s.setItem('Events_gas_user_email', '%s@example.com');
        s.setItem('Events_gas_user_role', '%s');
        s.setItem('Events_gas_user_permissions', %s);   // the JSON string saveSession() writes
        function addBase() {
          if (!document.documentElement || document.getElementById('gas-app')) return false;
          var d = document.createElement('div');
          d.id = 'gas-app'; d.style.display = 'none';
          d.dataset.baseUrl = '%s';
          document.documentElement.appendChild(d);
          return true;
        }
        if (!addBase()) {
          var mo = new MutationObserver(function () { if (addBase()) mo.disconnect(); });
          mo.observe(document, { childList: true, subtree: true });
        }
      })();""" % ('t' * 48, role, role, json.dumps(json.dumps(perms)), STUB_BASE))


def probe(page):
    return page.evaluate("""() => {
      const vis = sel => { const el = document.querySelector(sel); if (!el) return false;
        const cs = getComputedStyle(el); return cs.display !== 'none' && cs.visibility !== 'hidden'; };
      const months = [...document.querySelectorAll('#ev-agenda .ev-month')].map(h => h.textContent);
      const sig = document.getElementById('ev-f-signals');
      return {
        header:  vis('#ev-header'),
        denied:  !!document.querySelector('#ev-app .ev-denied'),
        agenda:  !!document.querySelector('#ev-app #ev-agenda'),
        rows:    document.querySelectorAll('#ev-agenda .ev-row').length,
        days:    document.querySelectorAll('#ev-agenda .ev-day').length,
        months:  months,
        sticky:  months.length ? getComputedStyle(document.querySelector('#ev-agenda .ev-month')).position : '',
        tentative: document.querySelectorAll('#ev-agenda .ev-row .ev-tent').length,
        strayDot: [...document.querySelectorAll('#ev-agenda .ev-meta')].filter(m => /·\\s*$/.test(m.textContent) || /^\\s*·/.test(m.textContent)).length,
        filters: !!document.querySelector('#ev-f-kind') && !!document.querySelector('#ev-f-region') && !!document.querySelector('#ev-f-segment'),
        signalsPill: sig ? sig.textContent + (sig.getAttribute('aria-disabled') === 'true' ? ' (disabled)' : '') : '',
        nowmonth: (document.getElementById('ev-nowmonth') || {}).textContent || '',
        err:     !!document.querySelector('#ev-app .ev-err'),
        wall:    vis('#auth-wall'),
        role:    (document.getElementById('ev-role') || {}).textContent || '',
        stored:  sessionStorage.getItem('Events_gas_user_role'),
        admitted: typeof evAdmitted === 'function' ? evAdmitted() : null
      };
    }""")


def load_as(browser, base, role, query='', stars=None, proposed=None, signals=None):
    counter, errors, registry = [], [], []
    stars = {} if stars is None else stars
    ctx = browser.new_context(viewport=PHONE, device_scale_factor=2, is_mobile=True, has_touch=True)
    ctx.route('**://script.google.com/**', gas_stub(role, counter, stars, proposed, signals))
    ctx.route('**://accounts.google.com/**', lambda r, q: r.abort())
    ctx.add_init_script(seed_script(role))
    page = ctx.new_page()
    page.on('pageerror', lambda e: errors.append('PAGEERROR: ' + str(e)))
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.on('request', lambda r: registry.append(r.url) if 'events-data/events.json' in r.url else None)
    page.goto(base + query, wait_until='networkidle')
    page.wait_for_function("() => document.getElementById('auth-wall') && "
                           "document.getElementById('auth-wall').classList.contains('hidden')", timeout=15000)
    page.wait_for_timeout(1200)
    return ctx, page, counter, errors, registry


def walk_vevent(text):
    """Minimal RFC 5545 walker for one calendar: CRLF line ends, no line over
    75 octets, unfold, one VCALENDAR with ≥ 1 VEVENT carrying UID / DTSTART /
    DTEND / SUMMARY. Returns (findings, [vevent field dicts])."""
    findings, events = [], []
    if '\r\n' not in text or text.replace('\r\n', '').count('\n'):
        findings.append('line ends are not all CRLF')
    for n, line in enumerate(text.split('\r\n'), 1):
        if len(line.encode('utf-8')) > 75:
            findings.append('line %d is %d octets' % (n, len(line.encode('utf-8'))))
            break
    lines = re.sub(r'\r?\n[ \t]', '', text).split('\r\n')
    lines = [l for l in lines if l != '']
    if not lines or lines[0] != 'BEGIN:VCALENDAR' or lines[-1] != 'END:VCALENDAR':
        findings.append('not wrapped in BEGIN:VCALENDAR … END:VCALENDAR')
    depth, fields = 0, None
    for line in lines:
        if line == 'BEGIN:VEVENT':
            if depth:
                findings.append('nested VEVENT')
            depth, fields = 1, {}
        elif line == 'END:VEVENT':
            if not depth:
                findings.append('END:VEVENT without BEGIN')
            for req in ('UID', 'DTSTART', 'DTEND', 'SUMMARY'):
                if req not in (fields or {}):
                    findings.append('VEVENT without ' + req)
            events.append(fields or {})
            depth, fields = 0, None
        elif depth and ':' in line:
            name, value = line.split(':', 1)
            fields[name.split(';', 1)[0].upper()] = value
    if depth:
        findings.append('a VEVENT is never closed')
    if not events:
        findings.append('no VEVENT')
    return findings, events


def published_vevent(uid):
    """The VEVENT block for a UID in the published events-data/events.ics, DTSTAMP line dropped."""
    path = LIVE / 'events-data' / 'events.ics'
    if not path.exists():
        return None
    text = path.read_bytes().decode('utf-8')
    for block in re.findall(r'BEGIN:VEVENT\r\n.*?END:VEVENT', text, flags=re.S):
        if ('UID:' + uid + '\r\n') in block:
            return '\r\n'.join(l for l in block.split('\r\n') if not l.startswith('DTSTAMP:'))
    return None


def phone_pass(page, base, reqs, stars, failures):
    """§13.7 step 7 — the phone pass, on the admin's already-loaded page."""
    tag = 'phone'
    nowmonth = lambda: page.evaluate("() => (document.getElementById('ev-nowmonth') || {}).textContent || ''")

    # ── the sticky month header and the month boundary ─────────────────────
    groups = page.evaluate("""() => [...document.querySelectorAll('#ev-agenda .ev-monthgroup')].map(g => {
        const r = g.getBoundingClientRect();
        return { month: g.dataset.month, top: r.top + window.pageYOffset, height: r.height, label: g.querySelector('.ev-month').textContent }; })""")
    if len(groups) < 2:
        failures.append('%s: fewer than two month groups (%d) — no boundary to cross' % (tag, len(groups)))
        return
    first_label = nowmonth()
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(300)
    page.screenshot(path=str(SHOTS / 'events-month.png'), full_page=False)
    tall = max(groups, key=lambda g: g['height'])
    if tall['height'] < 200:
        failures.append('%s: no month group tall enough (%.0fpx) to scroll within' % (tag, tall['height']))
    else:
        page.evaluate("y => window.scrollTo(0, y)", tall['top'] + 160)
        page.wait_for_timeout(500)
        st = page.evaluate("""m => { const h = document.querySelector('#ev-agenda .ev-monthgroup[data-month="' + m + '"] .ev-month');
            const r = h.getBoundingClientRect(), cs = getComputedStyle(h);
            return { top: r.top, pin: parseFloat(cs.top) || 0, clear: (parseFloat(cs.top) || 0) + (parseFloat(cs.paddingTop) || 0),
                     position: cs.position, label: h.textContent, now: (document.getElementById('ev-nowmonth') || {}).textContent }; }""", tall['month'])
        # pinned at its declared `top`, not scrolled away, and the month name clears the template's fixed user pill (≈ 30px)
        if st['position'] != 'sticky' or abs(st['top'] - st['pin']) > 1 or st['clear'] < 30:
            failures.append('%s: the month header did not stick clear of the user pill while its month scrolled (top=%.1f, pin=%.0f, clear=%.0f)' % (tag, st['top'], st['pin'], st['clear']))
        if st['now'] != tall['label']:
            failures.append('%s: month-in-view label %r while %r is pinned' % (tag, st['now'], tall['label']))
    second = groups[1]
    page.evaluate("y => window.scrollTo(0, y)", second['top'] + 24)
    page.wait_for_timeout(600)
    after = nowmonth()
    if after != second['label'] or after == groups[0]['label']:
        failures.append('%s: scrolling past the month boundary left the label at %r (expected %r, started %r)'
                        % (tag, after, second['label'], first_label))
    page.screenshot(path=str(SHOTS / 'events-agenda.png'), full_page=False)
    page.evaluate("() => window.scrollTo(0, 0)")
    page.wait_for_timeout(300)

    # ── one confirmed, upcoming event: the sheet, the ICS text, the Calendar href ──
    slug = page.evaluate("() => (_evEvents.filter(e => e.status === 'confirmed' && !evIsPast(e))[0] || {}).slug || ''")
    if not slug:
        failures.append('%s: no confirmed upcoming event to test with' % tag)
        return
    row_sel = '#ev-agenda .ev-row[data-slug="%s"]' % slug
    page.evaluate("s => document.querySelector('#ev-agenda .ev-row[data-slug=\"' + s + '\"]').scrollIntoView({ block: 'center' })", slug)
    page.wait_for_timeout(200)
    page.click(row_sel)
    page.wait_for_timeout(400)
    sheet = page.evaluate("""() => {
        const g = document.getElementById('ev-gcal'), i = document.getElementById('ev-ics');
        return { open: getComputedStyle(document.getElementById('ev-sheet')).display !== 'none',
                 title: (document.getElementById('ev-sheet-title') || {}).textContent || '',
                 gcal: g ? g.href : '', ics: i ? (i.getAttribute('download') || '') : '' }; }""")
    if not sheet['open']:
        failures.append('%s: the sheet did not open for %s' % (tag, slug))
    m = re.search(r'[?&]dates=(\d{8})/(\d{8})', sheet['gcal'])
    if not m or 'ctz=' not in sheet['gcal'] or not sheet['gcal'].startswith('https://calendar.google.com/calendar/render?action=TEMPLATE'):
        failures.append('%s: Google Calendar href lacks dates= / ctz= or the template action: %r' % (tag, sheet['gcal'][:120]))
    page.screenshot(path=str(SHOTS / 'events-detail.png'), full_page=False)
    ics_text = page.evaluate("s => evIcs(_evBySlug[s])", slug)
    findings, vevents = walk_vevent(ics_text)
    if findings:
        failures.append('%s: the per-event .ics text does not parse: %s' % (tag, '; '.join(findings[:3])))
    else:
        ve = vevents[0]
        if ve.get('UID') != slug + '@events.lightaisolutions.github.io' or ve.get('DTSTART') != m.group(1) or ve.get('DTEND') != m.group(2):
            failures.append('%s: VEVENT fields disagree with the Calendar href: %r vs %r' % (tag, ve, m.groups()))
    page_block = page.evaluate("s => evVevent(_evBySlug[s], 'X')", slug)
    page_block = '\r\n'.join(l for l in page_block.split('\r\n') if not l.startswith('DTSTAMP:'))
    pub_block = published_vevent(slug + '@events.lightaisolutions.github.io')
    if pub_block is None:
        failures.append('%s: %s has no VEVENT in the published events.ics' % (tag, slug))
    elif pub_block != page_block:
        failures.append('%s: the published VEVENT for %s is not byte-identical to the page\'s evVevent()' % (tag, slug))
    page.keyboard.press('Escape')
    page.wait_for_timeout(200)
    if page.evaluate("() => getComputedStyle(document.getElementById('ev-sheet')).display") != 'none':
        failures.append('%s: Escape did not close the sheet' % tag)

    # ── the star round-trip through the stateful stub ──────────────────────
    lists_before = len([r for r in reqs if r == 'events:list'])
    page.click(row_sel + ' .ev-star')
    try:
        page.wait_for_function("s => { const b = document.querySelector('#ev-agenda .ev-row[data-slug=\"' + s + '\"] .ev-star');"
                               " return b && b.getAttribute('aria-pressed') === 'true' && !b.dataset.busy; }", arg=slug, timeout=6000)
    except Exception:
        failures.append('%s: the star did not light after eop=star' % tag)
    page.wait_for_timeout(500)
    if slug not in stars:
        failures.append('%s: eop=star never reached the stub (stub holds %r)' % (tag, sorted(stars)))
    if 'events:star' not in reqs or len([r for r in reqs if r == 'events:list']) <= lists_before:
        failures.append('%s: star did not round-trip (ops seen: %r)' % (tag, [r for r in reqs if r.startswith('events:')]))
    count = page.evaluate("() => { const c = document.querySelectorAll('#ev-counts div b'); return c.length > 1 ? c[1].textContent : ''; }")
    if count != '1':
        failures.append('%s: the Starred count reads %r after one star' % (tag, count))

    # ── the day-plan tab: the starred event on its first day ───────────────
    start = page.evaluate("s => _evBySlug[s].start", slug)
    page.click('#ev-tab-day')
    page.wait_for_timeout(300)
    page.evaluate("d => { const i = document.getElementById('ev-day-pick'); i.value = d; i.dispatchEvent(new Event('change')); }", start)
    page.wait_for_timeout(300)
    day = page.evaluate("""s => ({
        agendaHidden: getComputedStyle(document.getElementById('ev-agenda')).display === 'none',
        shown: getComputedStyle(document.getElementById('ev-dayplan')).display !== 'none',
        item: !!document.querySelector('#ev-tl .ev-tl-item[data-slug="' + s + '"]'),
        items: document.querySelectorAll('#ev-tl .ev-tl-item').length,
        strip: document.querySelectorAll('#ev-day-strip .ev-pill').length,
        selected: (document.getElementById('ev-tab-day') || {}).getAttribute('aria-selected') })""", slug)
    if not (day['agendaHidden'] and day['shown'] and day['item'] and day['strip'] and day['selected'] == 'true'):
        failures.append('%s: day-plan tab incomplete: %r' % (tag, day))
    page.screenshot(path=str(SHOTS / 'events-dayplan.png'), full_page=False)
    page.click('#ev-tab-agenda')
    page.wait_for_timeout(300)
    if page.evaluate("() => getComputedStyle(document.getElementById('ev-agenda')).display") == 'none':
        failures.append('%s: the Agenda tab did not come back' % tag)

    # ── unstar ─────────────────────────────────────────────────────────────
    page.evaluate("s => document.querySelector('#ev-agenda .ev-row[data-slug=\"' + s + '\"]').scrollIntoView({ block: 'center' })", slug)
    page.click(row_sel + ' .ev-star')
    try:
        page.wait_for_function("s => { const b = document.querySelector('#ev-agenda .ev-row[data-slug=\"' + s + '\"] .ev-star');"
                               " return b && b.getAttribute('aria-pressed') === 'false' && !b.dataset.busy; }", arg=slug, timeout=6000)
    except Exception:
        failures.append('%s: the star did not clear after eop=unstar' % tag)
    page.wait_for_timeout(400)
    if slug in stars or 'events:unstar' not in reqs:
        failures.append('%s: eop=unstar did not reach the stub' % tag)
    count = page.evaluate("() => { const c = document.querySelectorAll('#ev-counts div b'); return c.length > 1 ? c[1].textContent : ''; }")
    if count != '0':
        failures.append('%s: the Starred count reads %r after unstar' % (tag, count))

    # ── the Subscribe pill and the published file ──────────────────────────
    page.evaluate("() => window.scrollTo(0, 0)")
    page.click('#ev-subscribe')
    page.wait_for_timeout(300)
    sub = page.evaluate("""() => { const a = document.getElementById('ev-webcal'), u = document.getElementById('ev-webcal-url');
        return { href: a ? a.getAttribute('href') : '', value: u ? u.value : '', expanded: document.getElementById('ev-subscribe').getAttribute('aria-expanded') }; }""")
    expect_tail = '/events-data/events.ics'
    if not (sub['href'].startswith('webcal://') and sub['href'].endswith(expect_tail) and sub['value'] == sub['href'] and sub['expanded'] == 'true'):
        failures.append('%s: Subscribe pill did not offer the webcal:// URL: %r' % (tag, sub))
    page.click('#ev-copy-webcal')
    page.wait_for_timeout(300)
    status = page.evaluate("() => (document.getElementById('ev-subscribe-status') || {}).textContent || ''")
    if not status:
        failures.append('%s: Copy URL left no status line (neither copied nor the by-hand fallback)' % tag)
    resp = page.request.get(sub['href'].replace('webcal://', 'http://', 1))
    body = resp.text() if resp.ok else ''
    if not resp.ok or not body.startswith('BEGIN:VCALENDAR') or 'X-WR-CALNAME:' not in body:
        failures.append('%s: the published events.ics did not serve (%s)' % (tag, resp.status))
    else:
        pf, pv = walk_vevent(body)
        if pf:
            failures.append('%s: the published events.ics does not parse: %s' % (tag, '; '.join(pf[:3])))
    page.click('#ev-subscribe')
    page.wait_for_timeout(200)
    if page.evaluate("() => !!document.getElementById('ev-subcard')"):
        failures.append('%s: the Subscribe card did not close on a second tap' % tag)


def proposed_pass(page, reqs, proposed, failures):
    """E2 — the Proposed tab on the admin's page, against the stateful stub."""
    tag = 'proposed'
    page.evaluate("() => window.scrollTo(0, 0)")
    before = len([r for r in reqs if r == 'events:proposed'])
    if not page.evaluate("() => !!document.getElementById('ev-tab-proposed')"):
        failures.append('%s: the Proposed tab is not in the strip for the admin' % tag); return
    page.click('#ev-tab-proposed')
    try:
        page.wait_for_function("() => document.querySelectorAll('#ev-proposed .ev-prop').length >= 2", timeout=6000)
    except Exception:
        failures.append('%s: the queue did not render after opening the tab' % tag)
    page.wait_for_timeout(300)
    if len([r for r in reqs if r == 'events:proposed']) - before != 1:
        failures.append('%s: expected exactly one eop=proposed on opening the tab, saw %d' % (tag, len([r for r in reqs if r == 'events:proposed']) - before))
    got = page.evaluate("""() => ({
        shown: getComputedStyle(document.getElementById('ev-proposed')).display !== 'none',
        agendaHidden: getComputedStyle(document.getElementById('ev-agenda')).display === 'none',
        groups: [...document.querySelectorAll('#ev-proposed .ev-propgroup')].map(g => g.dataset.source),
        rows: [...document.querySelectorAll('#ev-proposed .ev-prop')].map(r => r.dataset.id + ':' + r.dataset.change + ':' + r.dataset.status),
        diff: [...document.querySelectorAll('#ev-proposed .ev-prop[data-id="pr-0000000000001"] .ev-diff dd')].map(d => d.textContent.replace(/\\s+/g, ' ').trim()),
        polls: document.querySelectorAll('#ev-polls li').length,
        pollFail: !!document.querySelector('#ev-polls li[data-source="esig-events"] .ev-status-err'),
        install: !!document.getElementById('ev-poll-install'), now: !!document.getElementById('ev-poll-now'),
        approveBtns: document.querySelectorAll('#ev-proposed .ev-prop-approve').length,
        json: (document.getElementById('ev-prop-json') || {}).value || '' })""")
    if not (got['shown'] and got['agendaHidden']):
        failures.append('%s: the tab did not swap the agenda for the panel: %r' % (tag, {k: got[k] for k in ('shown', 'agendaHidden')}))
    if sorted(got['groups']) != ['ai-infra-summit', 'clarion-powergen'] or len(got['rows']) != 2 or 'pr-0000000000001:moved-dates:pending' not in got['rows']:
        failures.append('%s: rows not grouped by source as expected: groups=%r rows=%r' % (tag, got['groups'], got['rows']))
    if not any('2027-01-18' in d and '2027-01-25' in d for d in got['diff']):
        failures.append('%s: the moved-dates row does not show Before → After: %r' % (tag, got['diff']))
    if got['polls'] != 3 or not got['pollFail'] or not got['install'] or not got['now']:
        failures.append('%s: poller card incomplete (polls=%s fail-marked=%s install=%s now=%s)' % (tag, got['polls'], got['pollFail'], got['install'], got['now']))
    if got['approveBtns'] != 1:
        failures.append('%s: expected one Approve button (the pending row), saw %d' % (tag, got['approveBtns']))
    try:
        doc = json.loads(got['json'])
        ids = [p['id'] for p in doc.get('proposals', [])]
        if doc.get('schemaVersion') != 1 or ids != ['pr-0000000000002'] or len(doc.get('polls', [])) != 3 or doc['proposals'][0]['after'].get('slug') != 'ai-infra-summit-2027':
            failures.append('%s: the JSON field does not carry the approved rows and the polls: %r' % (tag, {k: doc.get(k) for k in ('schemaVersion', 'polls')} | {'ids': ids}))
    except (ValueError, KeyError, IndexError, TypeError) as exc:
        failures.append('%s: the JSON field does not parse (%s): %r' % (tag, exc, got['json'][:80]))
    page.screenshot(path=str(SHOTS / 'events-proposed.png'), full_page=False)
    # Approve the pending row → eop=decide, the panel refreshes, the JSON now carries two ids
    page.click('#ev-proposed .ev-prop[data-id="pr-0000000000001"] .ev-prop-approve')
    try:
        page.wait_for_function("() => document.querySelectorAll('#ev-proposed .ev-prop-approve').length === 0", timeout=6000)
    except Exception:
        failures.append('%s: the Approve button did not clear after eop=decide' % tag)
    page.wait_for_timeout(300)
    row = next((r for r in proposed if r['id'] == 'pr-0000000000001'), {})
    if 'events:decide' not in reqs or row.get('status') != 'approved':
        failures.append('%s: Approve did not reach the stub as decide/approved (stub row: %r)' % (tag, row.get('status')))
    after = page.evaluate("() => JSON.parse(document.getElementById('ev-prop-json').value).proposals.map(p => p.id)")
    if sorted(after) != ['pr-0000000000001', 'pr-0000000000002']:
        failures.append('%s: after approval the JSON does not carry both approved rows: %r' % (tag, after))
    # Mark applied — a bad version is refused on the page, a good one is stamped
    applied_before = len([r for r in reqs if r == 'events:applied'])
    page.fill('#ev-prop-version', '7.15')
    page.click('#ev-prop-applied')
    page.wait_for_timeout(300)
    if len([r for r in reqs if r == 'events:applied']) != applied_before:
        failures.append('%s: a bad version reached the server' % tag)
    page.fill('#ev-prop-version', 'v07.15r')
    page.click('#ev-prop-applied')
    try:
        page.wait_for_function("() => /Marked 2 rows applied/.test((document.getElementById('ev-applied-status') || {}).textContent || '')", timeout=6000)
    except Exception:
        failures.append('%s: Mark applied did not report two rows stamped (%r)' % (tag, page.evaluate("() => (document.getElementById('ev-applied-status') || {}).textContent")))
    page.wait_for_timeout(300)
    if 'events:applied' not in reqs or any(r['status'] != 'applied' or r['appliedIn'] != 'v07.15r' for r in proposed):
        failures.append('%s: eop=applied did not stamp the stub rows: %r' % (tag, [(r['status'], r['appliedIn']) for r in proposed]))
    if not page.evaluate("() => !!document.getElementById('ev-prop-empty')"):
        failures.append('%s: the empty state did not appear once every row was applied' % tag)
    # Install poller and Poll now
    page.click('#ev-poll-install'); page.wait_for_timeout(500)
    page.click('#ev-poll-now'); page.wait_for_timeout(500)
    if 'events:installpoller' not in reqs or 'events:pollnow' not in reqs:
        failures.append('%s: Install poller / Poll now did not reach the stub (ops: %r)' % (tag, sorted(set(r for r in reqs if r.startswith('events:')))))
    st = page.evaluate("() => (document.getElementById('ev-poll-status') || {}).textContent || ''")
    if 'Polled 11 sources' not in st:
        failures.append('%s: Poll now did not report the run (%r)' % (tag, st))
    page.click('#ev-tab-agenda'); page.wait_for_timeout(200)
    if page.evaluate("() => getComputedStyle(document.getElementById('ev-proposed')).display") != 'none':
        failures.append('%s: the panel did not hide on the Agenda tab' % tag)


IGNORE = ('Failed to load resource', 'accounts.google.com', 'gsi/', 'GSI_LOGGER', 'FedCM',
          'version.txt', 'changelog', 'favicon', 'net::ERR', 'sounds/')


def recommended_pass(page, reqs, failures):
    """E3 — the Recommended pill, the ranked agenda and the why panel, on the admin's page."""
    tag = 'recommended'
    page.evaluate("() => { if (typeof evShowTab === 'function') evShowTab('agenda'); window.scrollTo(0, 0); }")
    page.wait_for_timeout(200)
    stub = recommend_stub()
    want = [e['slug'] for e in stub['events']]
    if not page.evaluate("() => !!document.getElementById('ev-f-rec')"):
        failures.append('%s: the Recommended pill is not on the Mine row for the admin' % tag); return
    before = len([r for r in reqs if r == 'events:recommend'])
    page.click('#ev-f-rec')
    try:
        page.wait_for_function("() => document.querySelectorAll('#ev-agenda .ev-ranked .ev-row').length >= 3", timeout=6000)
    except Exception:
        failures.append('%s: the ranked section did not render after pressing the pill' % tag)
    page.wait_for_timeout(300)
    seen = len([r for r in reqs if r == 'events:recommend']) - before
    if seen != 1:
        failures.append('%s: expected exactly one eop=recommend on pressing the pill, saw %d' % (tag, seen))
    got = page.evaluate("""() => ({
        pressed: (document.getElementById('ev-f-rec') || {}).getAttribute('aria-pressed'),
        order: [...document.querySelectorAll('#ev-agenda .ev-ranked .ev-row')].map(r => r.dataset.slug),
        chips: [...document.querySelectorAll('#ev-agenda .ev-ranked .ev-row')].map(r => (r.querySelector('.ev-score') || {}).textContent || ''),
        ranks: [...document.querySelectorAll('#ev-agenda .ev-ranked .ev-row')].map(r => r.dataset.rank),
        months: document.querySelectorAll('#ev-agenda .ev-monthgroup').length,
        header: (document.querySelector('#ev-agenda .ev-ranked .ev-month') || {}).textContent || '',
        nowmonth: (document.getElementById('ev-nowmonth') || {}).textContent || '',
        status: (document.getElementById('ev-stars-status') || {}).textContent || ''
    })""")
    if got['pressed'] != 'true' or got['order'] != want:
        failures.append('%s: the agenda did not re-order by the stub\'s scores: %r (wanted %r)' % (tag, got['order'], want))
    if got['chips'] != ['0.91', '0.77', '0.42'] or got['ranks'] != ['1', '2', '3']:
        failures.append('%s: score chips / ranks wrong: %r %r' % (tag, got['chips'], got['ranks']))
    if got['months'] != 1 or got['header'] != 'Recommended' or got['nowmonth'] != 'Recommended':
        failures.append('%s: expected one "Recommended" section and label, got months=%s header=%r label=%r' % (tag, got['months'], got['header'], got['nowmonth']))
    if 'Ranked 3' not in got['status']:
        failures.append('%s: the status line does not report the ranking: %r' % (tag, got['status']))
    # the top event's why panel
    page.click('#ev-agenda .ev-ranked .ev-row >> nth=0')
    page.wait_for_timeout(400)
    why = page.evaluate("""() => {
        const w = document.getElementById('ev-why'); if (!w) return null;
        return { score: (w.querySelector('.ev-why-score b') || {}).textContent || '',
                 bars: [...w.querySelectorAll('.ev-bar')].map(b => b.dataset.term + ':' + (b.querySelector('.ev-bar-lab small') || {}).textContent),
                 widths: [...w.querySelectorAll('.ev-bar-fill')].map(f => f.style.width),
                 account: (w.querySelector('.ev-why-accounts li b') || {}).textContent || '',
                 accountLine: (w.querySelector('.ev-why-accounts li') || {}).textContent || '',
                 evidence: (w.querySelector('.ev-why-accounts li a') || {}).href || '',
                 segs: (w.querySelector('.ev-why-segs') || {}).textContent || '',
                 mentions: w.querySelectorAll('.ev-why-mentions .ev-chip').length,
                 conflicts: w.querySelectorAll('.ev-why-conflicts li').length,
                 foot: (w.querySelector('.ev-why-foot') || {}).textContent || '',
                 placeholder: [...document.querySelectorAll('#ev-sheet .ev-netnote')].some(n => /arrives with E3/.test(n.textContent)) };
    }""")
    page.evaluate("() => { const w = document.getElementById('ev-why'); if (w) w.scrollIntoView({ block: 'start' }); }")
    page.wait_for_timeout(150)
    page.screenshot(path=str(SHOTS / 'events-recommended.png'), full_page=False)
    top = stub['events'][0]
    if not why:
        failures.append('%s: no why panel on the top event\'s sheet' % tag)
    else:
        if why['score'] != '0.91' or why['placeholder']:
            failures.append('%s: the panel does not lead with the score (or the E3 placeholder is still there): %r' % (tag, why['score']))
        if [b.split(':')[0] for b in why['bars']] != ['segmentFit', 'accountPresence', 'corpusSalience', 'proximity', 'conflict', 'relevancePrior'] \
                or why['bars'][0] != 'segmentFit: × 0.35' or why['bars'][4] != 'conflict: × 0.25':
            failures.append('%s: six term bars with weights expected, got %r' % (tag, why['bars']))
        if why['widths'][1] != '90%' or why['widths'][4] != '100%':
            failures.append('%s: bar widths do not follow the terms (presence 0.9 → 90%%, conflict −1 → 100%%): %r' % (tag, why['widths']))
        if why['account'] != 'Stub Account Co' or 'shortlist' not in why['accountLine'] or 'exhibitor' not in why['accountLine'] \
                or why['evidence'] != 'https://example.com/exhibitors/stub-account':
            failures.append('%s: the account line does not name the stub account with its stage, signal and evidence link: %r / %r' % (tag, why['accountLine'], why['evidence']))
        if not why['segs'] or why['mentions'] != len(top['why']['mentions']) or why['conflicts'] != 1:
            failures.append('%s: segments / mention chips / conflicts incomplete: %r' % (tag, {k: why[k] for k in ('segs', 'mentions', 'conflicts')}))
        if 'Tuning' not in why['foot'] or 'TX' not in why['foot']:
            failures.append('%s: the Tuning line is missing or lacks the preferred regions: %r' % (tag, why['foot']))
    page.keyboard.press('Escape')
    page.wait_for_timeout(200)
    # unpress → the month groups come back, no request
    before = len([r for r in reqs if r == 'events:recommend'])
    page.click('#ev-f-rec')
    page.wait_for_timeout(300)
    back = page.evaluate("() => ({ months: document.querySelectorAll('#ev-agenda .ev-monthgroup').length, ranked: !!document.querySelector('#ev-agenda .ev-ranked'), pressed: document.getElementById('ev-f-rec').getAttribute('aria-pressed') })")
    if back['months'] < 2 or back['ranked'] or back['pressed'] != 'false' or len([r for r in reqs if r == 'events:recommend']) != before:
        failures.append('%s: unpressing did not restore the month groups without a request: %r' % (tag, back))


def signals_pass(page, reqs, signals, failures):
    """E4 session 1 — the manual signal form on the sheet (one eop=netaccounts,
    the write through eop=signal), the "Signals only" pill over the cached
    score, and the sweep card's controls on the Proposed tab."""
    tag = 'signals'
    page.evaluate("() => { if (typeof evShowTab === 'function') evShowTab('agenda'); window.scrollTo(0, 0); }")
    page.wait_for_timeout(200)
    stub = recommend_stub()
    top = stub['events'][0]                       # the one event whose why names the stub account
    # the form, on the top event's sheet
    page.evaluate("(slug) => evOpenSheet(slug)", top['slug'])
    try:
        page.wait_for_function("() => document.querySelectorAll('#ev-sig-account option').length >= 3", timeout=6000)
    except Exception:
        failures.append('%s: the account list did not fill from eop=netaccounts' % tag)
    page.wait_for_timeout(200)
    form = page.evaluate("""() => ({
        form: !!document.getElementById('ev-sigform'),
        accounts: [...document.querySelectorAll('#ev-sig-account option')].map(o => o.value + ':' + o.textContent),
        kinds: [...document.querySelectorAll('#ev-sig-kind option')].map(o => o.value),
        conf: (document.getElementById('ev-sig-conf') || {}).value,
        url: !!document.getElementById('ev-sig-url'), note: !!document.getElementById('ev-sig-note'), add: !!document.getElementById('ev-sig-add')
    })""")
    if not form['form'] or not form['url'] or not form['note'] or not form['add']:
        failures.append('%s: the signal form is incomplete on the sheet: %r' % (tag, form)); return
    if form['kinds'] != ['linkedin-manual', 'registrant-mail'] or form['conf'] != '0.8':
        failures.append('%s: kinds / default confidence wrong: %r %r' % (tag, form['kinds'], form['conf']))
    if not any(a.startswith('a-0000000000001:Stub Account Co') for a in form['accounts']):
        failures.append('%s: the stub account is not in the picker: %r' % (tag, form['accounts']))
    if len([r for r in reqs if r == 'events:netaccounts']) != 1:
        failures.append('%s: expected exactly one eop=netaccounts, saw %d' % (tag, len([r for r in reqs if r == 'events:netaccounts'])))
    page.select_option('#ev-sig-account', 'a-0000000000001')
    page.select_option('#ev-sig-kind', 'linkedin-manual')
    page.fill('#ev-sig-url', 'https://www.linkedin.com/posts/stub-account-at-the-show-1')
    page.fill('#ev-sig-note', 'Their VP posted the booth number')
    page.select_option('#ev-sig-conf', '0.9')
    page.click('#ev-sig-add')
    try:
        page.wait_for_function("() => /Saved/.test((document.getElementById('ev-sig-status') || {}).textContent || '')", timeout=6000)
    except Exception:
        failures.append('%s: the signal did not report Saved (%r)' % (tag, page.evaluate("() => (document.getElementById('ev-sig-status') || {}).textContent")))
    page.wait_for_timeout(300)
    if len(signals) != 1 or signals[0]['accountId'] != 'a-0000000000001' or signals[0]['kind'] != 'linkedin-manual' or signals[0]['slug'] != top['slug'] \
            or signals[0]['evidenceUrl'] != 'https://www.linkedin.com/posts/stub-account-at-the-show-1' or signals[0]['confidence'] != '0.9' or 'booth' not in signals[0]['note']:
        failures.append('%s: eop=signal did not reach the stub with the typed row: %r' % (tag, signals))
    cleared = page.evaluate("() => ({ url: document.getElementById('ev-sig-url').value, note: document.getElementById('ev-sig-note').value, why: !!document.getElementById('ev-why') })")
    if cleared['url'] or cleared['note']:
        failures.append('%s: the form did not clear after the write: %r' % (tag, cleared))
    page.evaluate("() => { const f = document.getElementById('ev-sigform'); if (f) f.scrollIntoView({ block: 'start' }); }")
    page.wait_for_timeout(150)
    page.screenshot(path=str(SHOTS / 'events-signals.png'), full_page=False)
    page.keyboard.press('Escape')
    page.wait_for_timeout(200)
    # the pill — filters to the events whose cached why names an account
    if not page.evaluate("() => !!document.getElementById('ev-f-signals') && document.getElementById('ev-f-signals').getAttribute('aria-disabled') !== 'true'"):
        failures.append('%s: the Signals only pill is missing or still disabled' % tag); return
    before = len([r for r in reqs if r == 'events:recommend'])
    page.click('#ev-f-signals')
    try:
        page.wait_for_function("() => document.querySelectorAll('#ev-agenda .ev-row').length === 1", timeout=6000)
    except Exception:
        failures.append('%s: the pill did not narrow the agenda to the signalled event (%d rows)' % (tag, page.evaluate("() => document.querySelectorAll('#ev-agenda .ev-row').length")))
    got = page.evaluate("""() => ({
        pressed: document.getElementById('ev-f-signals').getAttribute('aria-pressed'),
        rows: [...document.querySelectorAll('#ev-agenda .ev-row')].map(r => r.dataset.slug),
        status: (document.getElementById('ev-stars-status') || {}).textContent || '' })""")
    if got['pressed'] != 'true' or got['rows'] != [top['slug']] or 'Signals on 1' not in got['status']:
        failures.append('%s: the filtered agenda is wrong: %r' % (tag, got))
    if len([r for r in reqs if r == 'events:recommend']) - before > 1:
        failures.append('%s: the pill issued more than one eop=recommend' % tag)
    page.click('#ev-f-signals')
    page.wait_for_timeout(300)
    if page.evaluate("() => document.querySelectorAll('#ev-agenda .ev-row').length") < 2 or page.evaluate("() => document.getElementById('ev-f-signals').getAttribute('aria-pressed')") != 'false':
        failures.append('%s: unpressing the pill did not restore the agenda' % tag)
    # the sweep card on the Proposed tab
    page.click('#ev-tab-proposed')
    try:
        page.wait_for_function("() => !!document.getElementById('ev-sigcard') && /Not swept yet/.test((document.getElementById('ev-sig-last') || {}).textContent || '')", timeout=6000)
    except Exception:
        failures.append('%s: the sweep card or its last-swept line did not render' % tag); return
    card = page.evaluate("() => ({ badge: (document.querySelector('#ev-sigcard .ev-badge') || {}).textContent || '', install: !!document.getElementById('ev-sig-install'), now: !!document.getElementById('ev-sig-now') })")
    if card['badge'] != 'sweep not installed' or not card['install'] or not card['now']:
        failures.append('%s: the sweep card is incomplete: %r' % (tag, card))
    page.click('#ev-sig-install')
    try:
        page.wait_for_function("() => /Installed/.test((document.getElementById('ev-sig-cardstatus') || {}).textContent || '')", timeout=6000)
    except Exception:
        failures.append('%s: Install signals did not report back' % tag)
    page.click('#ev-sig-now')
    try:
        page.wait_for_function("() => /Swept 3 events/.test((document.getElementById('ev-sig-cardstatus') || {}).textContent || '')", timeout=6000)
    except Exception:
        failures.append('%s: Signals now did not report the sweep (%r)' % (tag, page.evaluate("() => (document.getElementById('ev-sig-cardstatus') || {}).textContent")))
    if 'events:installsignals' not in reqs or 'events:signalsnow' not in reqs:
        failures.append('%s: Install signals / Signals now did not reach the stub' % tag)
    page.evaluate("() => { const c = document.getElementById('ev-sigcard'); if (c) c.scrollIntoView({ block: 'start' }); }")
    page.wait_for_timeout(150)
    page.screenshot(path=str(SHOTS / 'events-signals-card.png'), full_page=False)
    page.evaluate("() => { if (typeof evShowTab === 'function') evShowTab('agenda'); }")
    page.wait_for_timeout(200)


def run():
    chrome = find_chrome()
    if not chrome:
        print('FAIL: no Chromium found under /opt/pw-browsers'); return 1
    httpd, port = serve(LIVE)
    base = 'http://127.0.0.1:%d/Events.html' % port
    failures, rows = [], []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=chrome, args=['--no-sandbox'])
        for role in TIERS:
            stars = {}
            proposed = [dict(r) for r in PROPOSED_STUB]
            signals = []
            ctx, page, reqs, errs, reg = load_as(browser, base, role, stars=stars, proposed=proposed, signals=signals)
            got = probe(page)
            page.screenshot(path=str(SHOTS / ('events-role-%s.png' % role)), full_page=False)
            real_errs = [e for e in errs if not any(s in e for s in IGNORE)]
            data_reqs = [u for u in reqs if u.startswith('events:')]
            exp = EXPECT[role]
            if got['wall']:
                failures.append('%s: sign-in wall still covering the app' % role)
            if got['stored'] != role:
                failures.append('%s: stored tier is %r' % (role, got['stored']))
            if got['admitted'] is not exp:
                failures.append('%s: evAdmitted() is %r, expected %r' % (role, got['admitted'], exp))
            if exp:
                if not (got['agenda'] and got['rows'] > 0 and got['days'] > 0 and got['months']):
                    failures.append('%s: expected the agenda, got agenda=%s rows=%s days=%s months=%s err=%s'
                                    % (role, got['agenda'], got['rows'], got['days'], got['months'], got['err']))
                if got['sticky'] != 'sticky':
                    failures.append('%s: month header is not position: sticky (%r)' % (role, got['sticky']))
                if not got['filters'] or got['signalsPill'] != 'Signals only':
                    failures.append('%s: filter card incomplete (filters=%s signals=%r)' % (role, got['filters'], got['signalsPill']))
                if got['strayDot']:
                    failures.append('%s: %d row(s) print a stray separator for an empty place' % (role, got['strayDot']))
                if got['denied']:
                    failures.append('%s: turned-away card rendered for the admitted tier' % role)
                if len(data_reqs) != 1:
                    failures.append('%s: expected exactly one list request, saw %d' % (role, len(data_reqs)))
                if len(reg) != 1:
                    failures.append('%s: expected exactly one registry fetch, saw %d' % (role, len(reg)))
                if not got['nowmonth']:
                    failures.append('%s: the month-in-view label is empty' % role)
                # the detail sheet: tap the first row
                page.click('#ev-agenda .ev-row >> nth=0')
                page.wait_for_timeout(400)
                sheet = page.evaluate("""() => {
                  const g = document.getElementById('ev-gcal'), i = document.getElementById('ev-ics');
                  return { open: getComputedStyle(document.getElementById('ev-sheet')).display !== 'none',
                           gcal: g ? g.href : '', ics: i ? (i.getAttribute('download') || '') : '',
                           badge: !!document.querySelector('#ev-sheet .ev-badge'),
                           own: !!document.getElementById('ev-own') };
                }""")
                page.screenshot(path=str(SHOTS / 'events-detail.png'), full_page=False)
                if not sheet['open'] or 'dates=' not in sheet['gcal'] or 'ctz=' not in sheet['gcal'] \
                        or not sheet['ics'].endswith('.ics') or not sheet['badge'] or not sheet['own']:
                    failures.append('%s: detail sheet incomplete: %r' % (role, sheet))
                page.keyboard.press('Escape')
                page.wait_for_timeout(200)
                if page.evaluate("() => getComputedStyle(document.getElementById('ev-sheet')).display") != 'none':
                    failures.append('%s: Escape did not close the sheet' % role)
                # §13.7 step 7 — the phone pass (session 2)
                phone_pass(page, base, reqs, stars, failures)
                # §13.10 step 6 — the Proposed tab (E2)
                proposed_pass(page, reqs, proposed, failures)
                # §13.11 step 5 — the Recommended pill and the why panel (E3)
                recommended_pass(page, reqs, failures)
                # §13.12 step 5 — the signal form, the Signals only pill, the sweep card (E4 s1)
                signals_pass(page, reqs, signals, failures)
            else:
                if not got['denied']:
                    failures.append('%s: turned-away card not rendered' % role)
                if got['agenda'] or got['rows']:
                    failures.append('%s: agenda rendered for a turned-away tier' % role)
                if data_reqs:
                    failures.append('%s: turned-away tier issued %d data request(s)' % (role, len(data_reqs)))
                if reg:
                    failures.append('%s: turned-away tier fetched the registry' % role)
                if page.evaluate("() => !!document.getElementById('ev-tab-proposed') || !!document.getElementById('ev-proposed')"):
                    failures.append('%s: the Proposed tab or panel exists for a turned-away tier' % role)
            if real_errs:
                failures.append('%s: %d page error(s): %s' % (role, len(real_errs), real_errs[0][:100]))
            rows.append((role, got, len(data_reqs), len(real_errs)))
            ctx.close()

        # Preview semantics — only subtracting.
        ctx, page, reqs, errs, reg = load_as(browser, base, 'admin', '?as=viewer')
        got = probe(page)
        if not got['denied'] or got['agenda'] or [u for u in reqs if u.startswith('events:')] or reg:
            failures.append('preview: admin ?as=viewer was not turned away (or issued a request)')
        ctx.close()
        ctx, page, reqs, errs, reg = load_as(browser, base, 'viewer', '?as=admin')
        got = probe(page)
        if not got['denied'] or got['agenda'] or [u for u in reqs if u.startswith('events:')] or reg:
            failures.append('preview: viewer ?as=admin gained a surface (or issued a request)')
        ctx.close()
        browser.close()
    httpd.shutdown()

    mark = lambda b: 'yes' if b else 'no '
    print('\nEvents door — admin-only (D7)\n')
    print('%-12s %-9s %-8s %-6s %-8s %-9s %s' % ('ROLE', 'admitted', 'agenda', 'rows', 'denied', 'requests', 'errors'))
    print('-' * 70)
    for role, g, n, ne in rows:
        print('%-12s %-9s %-8s %-6d %-8s %-9d %d' % (role, mark(g['admitted']), mark(g['agenda']),
                                                  g['rows'], mark(g['denied']), n, ne))
    print('\nScreenshots: %s/events-role-<tier>.png + events-month / events-agenda / events-detail / events-dayplan / events-proposed / events-recommended / events-signals / events-signals-card.png (%dx%d)' % (SHOTS, PHONE['width'], PHONE['height']))
    if failures:
        print('\nFAILURES (%d):' % len(failures))
        for f in failures:
            print('  ✗', f)
        return 1
    print('\nALL CHECKS PASSED — admin sees the agenda over the registry with exactly one list request and one registry fetch; '
          'contributor, analyst and viewer are turned away with zero requests; preview only subtracts; the sheet opens with the Calendar link and the .ics; '
          'the phone pass held: the month header sticks and changes across a boundary, a star round-trips, the ICS parses and matches the published file, the day plan and the Subscribe pill work; '
          'the Proposed tab is admin-only, opens with one request, groups the rows by source with Before → After, approves through decide, its JSON parses back, Mark applied / Install poller / Poll now reach the backend; '
          'the Recommended pill issues one eop=recommend and ranks the agenda by the stub\'s scores with a chip per row, the why panel names the stub account with its stage and evidence link, unpressing restores the month groups; '
          'the signal form fills its accounts with one eop=netaccounts and writes the typed row through eop=signal, the Signals only pill narrows the agenda to the signalled event over the cached score, Install signals and Signals now reach the backend.')
    return 0


if __name__ == '__main__':
    sys.exit(run())

# Developed by: LightAISolutions
