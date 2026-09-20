#!/usr/bin/env python3
"""Verify the Network app's door — the admin-only access matrix (design plan D7).

Serves live-site-pages/ over localhost, seeds a session for each ACL tier,
stubs the Network GAS backend (action=network) and asserts, per tier:

    tier         admitted   surface                  data requests
    admin         yes       the (empty) contact list  1 (nop=list)
    contributor    no       the turned-away card      0
    analyst        no       the turned-away card      0
    viewer         no       the turned-away card      0

The page is an auth-template page: the session lives in sessionStorage under
the page-scoped keys, and on load the fetch transport validates the stored
session with a heartbeat before it lets the auth wall down. The harness seeds
the storage the way saveSession() writes it, gives the page a base URL, and
answers that heartbeat the way the real backend would — everything after that
(the resume path → showApp → nwRole → nwAdmitted → the door → the list op) is
the real page code.

Also checked: the ?as=<tier> preview keeps only-subtracting semantics — an
admin previewing as viewer is turned away; a viewer previewing as admin stays
turned away and still issues zero requests.

Chromium is PRE-INSTALLED in the Claude Code web environment at /opt/pw-browsers;
the bundled Playwright build number does not match, so launch with an explicit
executable_path. Do NOT run `playwright install`.

Usage:
  python3 scripts/verify-network-roles.py

Screenshots land in .playwright-screenshots/network-role-<tier>.png (gitignored),
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
STUB_BASE = 'https://script.google.com/macros/s/VERIFY-NETWORK-STUB/exec'
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
    """Stand in for the deployed Network GAS: counts every data request and
    answers nop=list the way handleNetworkOp_ does for the tier."""
    def handle(route, request):
        url = request.url
        counter.append(url)
        body = {'success': False, 'error': 'unsupported_in_test'}
        if 'action=heartbeat' in url or 'op=heartbeat' in url:
            # The page validates a stored session with a heartbeat on load and
            # only then calls showApp — answer as the real backend would.
            body = {'type': 'gas-heartbeat-ok', 'expiresIn': 7200, 'absoluteTimeout': 28800}
        elif 'action=network' in url or 'op=network' in url:
            if role != 'admin':
                body = {'success': False, 'error': 'ROLE_DENIED', 'role': role}
            elif 'nop=list' in url:
                body = {'success': True, 'role': 'admin', 'caps': ['contacts'],
                        'contacts': [], 'accounts': [], 'folders': None}
        route.fulfill(status=200, content_type='application/json',
                      headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps(body))
    return handle


def seed_script(role):
    perms = ['read', 'write', 'delete', 'export', 'amend', 'admin'] if role == 'admin' else ['read']
    return ("""
      (function () {
        var s = window.sessionStorage;
        s.setItem('Network_gas_session_token', '%s');
        s.setItem('Network_gas_user_email', '%s@example.com');
        s.setItem('Network_gas_user_role', '%s');
        s.setItem('Network_gas_user_permissions', %s);   // the JSON string saveSession() writes
        // The page only creates #gas-app when a deployment URL is compiled in;
        // give _gasPost a base URL so the page's own resume path (heartbeat
        // validation → showApp) and the admin list op actually leave the page.
        // Appended as soon as <html> exists — at document start there is no
        // element yet, so watch the document for it; this fires before any
        // page script runs.
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
      return {
        header:  vis('#nw-header'),
        denied:  !!document.querySelector('#nw-app .nw-denied'),
        list:    !!document.querySelector('#nw-app #nw-list'),
        empty:   !!document.querySelector('#nw-app .nw-empty'),
        err:     !!document.querySelector('#nw-app .nw-err'),
        wall:    vis('#auth-wall'),
        role:    (document.getElementById('nw-role') || {}).textContent || '',
        stored:  sessionStorage.getItem('Network_gas_user_role'),
        admitted: typeof nwAdmitted === 'function' ? nwAdmitted() : null
      };
    }""")


def load_as(browser, base, role, query=''):
    counter, errors = [], []
    ctx = browser.new_context(viewport=PHONE, device_scale_factor=2, is_mobile=True, has_touch=True)
    ctx.route('**://script.google.com/**', gas_stub(role, counter))
    ctx.route('**://accounts.google.com/**', lambda r, q: r.abort())
    ctx.add_init_script(seed_script(role))
    page = ctx.new_page()
    page.on('pageerror', lambda e: errors.append('PAGEERROR: ' + str(e)))
    page.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    page.goto(base + query, wait_until='networkidle')
    # The page's own resume path validates the seeded session against the
    # (stubbed) backend and calls showApp itself — wait for the wall to drop.
    page.wait_for_function("() => document.getElementById('auth-wall') && "
                           "document.getElementById('auth-wall').classList.contains('hidden')", timeout=15000)
    page.wait_for_timeout(900)
    return ctx, page, counter, errors


IGNORE = ('Failed to load resource', 'accounts.google.com', 'gsi/', 'GSI_LOGGER', 'FedCM',
          'version.txt', 'changelog', 'favicon', 'net::ERR', 'sounds/')


def run():
    chrome = find_chrome()
    if not chrome:
        print('FAIL: no Chromium found under /opt/pw-browsers'); return 1
    httpd, port = serve(LIVE)
    base = 'http://127.0.0.1:%d/Network.html' % port
    failures, rows = [], []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=chrome, args=['--no-sandbox'])
        for role in TIERS:
            ctx, page, reqs, errs = load_as(browser, base, role)
            got = probe(page)
            page.screenshot(path=str(SHOTS / ('network-role-%s.png' % role)), full_page=False)
            real_errs = [e for e in errs if not any(s in e for s in IGNORE)]
            data_reqs = [u for u in reqs if 'action=network' in u or 'op=network' in u]
            exp = EXPECT[role]
            if got['wall']:
                failures.append('%s: sign-in wall still covering the app' % role)
            if got['stored'] != role:
                failures.append('%s: stored tier is %r' % (role, got['stored']))
            if got['admitted'] is not exp:
                failures.append('%s: nwAdmitted() is %r, expected %r' % (role, got['admitted'], exp))
            if exp:
                if not (got['list'] and got['empty']):
                    failures.append('%s: expected the empty list, got list=%s empty=%s err=%s'
                                    % (role, got['list'], got['empty'], got['err']))
                if got['denied']:
                    failures.append('%s: turned-away card rendered for the admitted tier' % role)
                if len(data_reqs) != 1:
                    failures.append('%s: expected exactly one list request, saw %d' % (role, len(data_reqs)))
            else:
                if not got['denied']:
                    failures.append('%s: turned-away card not rendered' % role)
                if got['list'] or got['empty']:
                    failures.append('%s: list surface rendered for a turned-away tier' % role)
                if data_reqs:
                    failures.append('%s: turned-away tier issued %d data request(s)' % (role, len(data_reqs)))
            if real_errs:
                failures.append('%s: %d page error(s): %s' % (role, len(real_errs), real_errs[0][:100]))
            rows.append((role, got, len(data_reqs), len(real_errs)))
            ctx.close()

        # Preview semantics — only subtracting.
        ctx, page, reqs, errs = load_as(browser, base, 'admin', '?as=viewer')
        got = probe(page)
        if not got['denied'] or got['list'] or [u for u in reqs if 'op=network' in u or 'action=network' in u]:
            failures.append('preview: admin ?as=viewer was not turned away (or issued a request)')
        ctx.close()
        ctx, page, reqs, errs = load_as(browser, base, 'viewer', '?as=admin')
        got = probe(page)
        if not got['denied'] or got['list'] or [u for u in reqs if 'op=network' in u or 'action=network' in u]:
            failures.append('preview: viewer ?as=admin gained a surface (or issued a request)')
        ctx.close()
        browser.close()
    httpd.shutdown()

    mark = lambda b: 'yes' if b else 'no '
    print('\nNetwork door — admin-only (D7)\n')
    print('%-12s %-9s %-8s %-8s %-8s %-9s %s' % ('ROLE', 'admitted', 'list', 'empty', 'denied', 'requests', 'errors'))
    print('-' * 70)
    for role, g, n, ne in rows:
        print('%-12s %-9s %-8s %-8s %-8s %-9d %d' % (role, mark(g['admitted']), mark(g['list']),
                                                  mark(g['empty']), mark(g['denied']), n, ne))
    print('\nScreenshots: %s/network-role-<tier>.png (%dx%d)' % (SHOTS, PHONE['width'], PHONE['height']))
    if failures:
        print('\nFAILURES (%d):' % len(failures))
        for f in failures:
            print('  ✗', f)
        return 1
    print('\nALL CHECKS PASSED — admin sees the empty list; contributor, analyst and viewer are turned away with zero requests; preview only subtracts.')
    return 0


if __name__ == '__main__':
    sys.exit(run())

# Developed by: LightAISolutions
