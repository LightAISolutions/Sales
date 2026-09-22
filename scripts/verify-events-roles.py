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
The star round-trip, the ICS walk and the month-boundary scroll are session
2's Playwright pass (§13.7 step 7).

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
import glob, json, threading, functools, http.server, socketserver, sys
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


def gas_stub(role, counter):
    """Stand in for the deployed Events GAS: counts every data request and
    answers eop=list the way handleEventsOp_ does for the tier."""
    def handle(route, request):
        url = request.url
        counter.append(url)
        body = {'success': False, 'error': 'unsupported_in_test'}
        if 'action=heartbeat' in url or 'op=heartbeat' in url:
            body = {'type': 'gas-heartbeat-ok', 'expiresIn': 7200, 'absoluteTimeout': 28800}
        elif 'action=events' in url or 'op=events' in url:
            if role != 'admin':
                body = {'success': False, 'error': 'ROLE_DENIED', 'role': role}
            elif 'eop=list' in url:
                body = {'success': True, 'role': 'admin', 'caps': ['calendar'], 'stars': []}
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
      const sig = document.querySelector('#ev-f-mine .ev-pill[aria-disabled="true"]');
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
        signalsPill: sig ? sig.textContent : '',
        nowmonth: (document.getElementById('ev-nowmonth') || {}).textContent || '',
        err:     !!document.querySelector('#ev-app .ev-err'),
        wall:    vis('#auth-wall'),
        role:    (document.getElementById('ev-role') || {}).textContent || '',
        stored:  sessionStorage.getItem('Events_gas_user_role'),
        admitted: typeof evAdmitted === 'function' ? evAdmitted() : null
      };
    }""")


def load_as(browser, base, role, query=''):
    counter, errors, registry = [], [], []
    ctx = browser.new_context(viewport=PHONE, device_scale_factor=2, is_mobile=True, has_touch=True)
    ctx.route('**://script.google.com/**', gas_stub(role, counter))
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


IGNORE = ('Failed to load resource', 'accounts.google.com', 'gsi/', 'GSI_LOGGER', 'FedCM',
          'version.txt', 'changelog', 'favicon', 'net::ERR', 'sounds/')


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
            ctx, page, reqs, errs, reg = load_as(browser, base, role)
            got = probe(page)
            page.screenshot(path=str(SHOTS / ('events-role-%s.png' % role)), full_page=False)
            real_errs = [e for e in errs if not any(s in e for s in IGNORE)]
            data_reqs = [u for u in reqs if 'action=events' in u or 'op=events' in u]
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
                if not got['filters'] or 'from E4' not in got['signalsPill']:
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
            else:
                if not got['denied']:
                    failures.append('%s: turned-away card not rendered' % role)
                if got['agenda'] or got['rows']:
                    failures.append('%s: agenda rendered for a turned-away tier' % role)
                if data_reqs:
                    failures.append('%s: turned-away tier issued %d data request(s)' % (role, len(data_reqs)))
                if reg:
                    failures.append('%s: turned-away tier fetched the registry' % role)
            if real_errs:
                failures.append('%s: %d page error(s): %s' % (role, len(real_errs), real_errs[0][:100]))
            rows.append((role, got, len(data_reqs), len(real_errs)))
            ctx.close()

        # Preview semantics — only subtracting.
        ctx, page, reqs, errs, reg = load_as(browser, base, 'admin', '?as=viewer')
        got = probe(page)
        if not got['denied'] or got['agenda'] or [u for u in reqs if 'op=events' in u or 'action=events' in u] or reg:
            failures.append('preview: admin ?as=viewer was not turned away (or issued a request)')
        ctx.close()
        ctx, page, reqs, errs, reg = load_as(browser, base, 'viewer', '?as=admin')
        got = probe(page)
        if not got['denied'] or got['agenda'] or [u for u in reqs if 'op=events' in u or 'action=events' in u] or reg:
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
    print('\nScreenshots: %s/events-role-<tier>.png + events-detail.png (%dx%d)' % (SHOTS, PHONE['width'], PHONE['height']))
    if failures:
        print('\nFAILURES (%d):' % len(failures))
        for f in failures:
            print('  ✗', f)
        return 1
    print('\nALL CHECKS PASSED — admin sees the agenda over the registry with exactly one list request and one registry fetch; '
          'contributor, analyst and viewer are turned away with zero requests; preview only subtracts; the sheet opens with the Calendar link and the .ics.')
    return 0


if __name__ == '__main__':
    sys.exit(run())

# Developed by: LightAISolutions
