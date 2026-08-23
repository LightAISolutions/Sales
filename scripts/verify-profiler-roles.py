#!/usr/bin/env python3
"""Verify the Profiler app's Role + Access matrix and capture a screenshot per tier.

Serves live-site-pages/ over localhost, stubs the Profiler GAS backend (whoami +
guidance ops), signs the page in as each ACL tier in turn, and asserts which of
the four gated surfaces actually render. The tier is never written to
localStorage directly — it arrives from the stubbed whoami and passes through
ovNormalizeRole, so the test exercises the real sign-in path.

The matrix under test (developer directive, 2026-08-22):

    tier          Field Note   Versions   Industry Guidance   Export dossier
    admin              yes        yes            yes               yes
    contributor         no         no            yes               yes
    analyst             no         no             no               yes
    viewer              no         no             no                no

Chromium is PRE-INSTALLED in the Claude Code web environment at /opt/pw-browsers;
the bundled Playwright build number does not match, so launch with an explicit
executable_path. Do NOT run `playwright install`.

Usage:
  python3 scripts/verify-profiler-roles.py

Screenshots land in .playwright-screenshots/profiler-role-<tier>.png (gitignored).
Exit code is non-zero if any tier's rendered surfaces disagree with the matrix,
so it can gate CI.
"""
import glob, json, threading, functools, http.server, socketserver, sys
from pathlib import Path
from playwright.sync_api import sync_playwright

REPO = Path(__file__).resolve().parent.parent
LIVE = REPO / 'live-site-pages'
SHOTS = REPO / '.playwright-screenshots'
SHOTS.mkdir(exist_ok=True)

# Expected matrix — the developer's directive, encoded as the test oracle.
EXPECT = {
    'admin':       {'fieldNote': True,  'versions': True,  'guidance': True,  'export': True},
    'contributor': {'fieldNote': False, 'versions': False, 'guidance': True,  'export': True},
    'analyst':     {'fieldNote': False, 'versions': False, 'guidance': False, 'export': True},
    'viewer':      {'fieldNote': False, 'versions': False, 'guidance': False, 'export': False},
}
GUIDANCE_ALLOWED = {'admin', 'contributor'}   # mirrors guidanceAllowed_ in Profiler.gs


def find_chrome():
    for pat in ('/opt/pw-browsers/chromium-*/chrome-linux/chrome',
                '/opt/pw-browsers/chromium-*/chrome-linux/headless_shell'):
        hits = sorted(glob.glob(pat))
        if hits:
            return hits[-1]
    return None


def serve(directory):
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=str(directory))
    socketserver.TCPServer.allow_reuse_address = True
    httpd = socketserver.TCPServer(('127.0.0.1', 0), handler)
    threading.Thread(target=httpd.serve_forever, daemon=True).start()
    return httpd, httpd.server_address[1]


def gas_stub(role):
    """Stand in for the deployed GAS: whoami reports the tier, guidance enforces it."""
    def handle(route, request):
        url = request.url
        body = {'success': False, 'error': 'unsupported_in_test'}
        if 'nop=whoami' in url:
            body = {'success': True, 'email': role + '@example.com',
                    'role': role, 'isAdmin': role == 'admin'}
        elif 'action=guidance' in url or 'op=guidance' in url:
            if role in GUIDANCE_ALLOWED:
                body = {'success': True, 'docs': [{'id': 'nvidia-800vdc', 'title': 'Test module',
                                                   'short': 'stub', 'sections': 1}]}
            else:
                body = {'success': False, 'error': 'ROLE_DENIED', 'role': role}
        route.fulfill(status=200, content_type='application/json',
                      headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps(body))
    return handle


def probe(page):
    """Read the four gated surfaces out of the live DOM."""
    return page.evaluate("""() => {
      const vis = id => {
        const el = document.getElementById(id);
        if (!el) return false;
        const cs = getComputedStyle(el);
        return cs.display !== 'none' && cs.visibility !== 'hidden';
      };
      return {
        fieldNote: vis('ov-note-btn') || vis('ov-qn'),
        noteBtn:   vis('ov-note-btn'),
        noteBox:   vis('ov-qn'),
        versions:  vis('ov-vers-btn'),
        guidance:  vis('ov-guide-btn'),
        export:    vis('ov-export-btn'),
        wall:      vis('ov-authwall'),
        role:      localStorage.getItem('ov_note_role')
      };
    }""")


def run():
    chrome = find_chrome()
    if not chrome:
        print('FAIL: no Chromium found under /opt/pw-browsers'); return 1
    httpd, port = serve(LIVE)
    base = 'http://127.0.0.1:%d/Profiler.html' % port
    failures, rows = [], []

    with sync_playwright() as pw:
        browser = pw.chromium.launch(executable_path=chrome, args=['--no-sandbox'])
        for role in ('admin', 'contributor', 'analyst', 'viewer'):
            ctx = browser.new_context(viewport={'width': 1440, 'height': 1000})
            ctx.route('**://script.google.com/**', gas_stub(role))
            ctx.route('**://accounts.google.com/**', lambda r, q: r.abort())
            # Seed only the session token — the tier must come from the stubbed
            # whoami through ovNormalizeRole, exactly as it does in production.
            ctx.add_init_script(
                "localStorage.setItem('ov_note_session','%s');"
                "localStorage.removeItem('ov_note_role');" % ('t' * 48))
            page = ctx.new_page()

            page.goto(base + '#zhonhen', wait_until='networkidle')
            page.wait_for_function("() => !!localStorage.getItem('ov_note_role')", timeout=15000)
            page.wait_for_timeout(1200)          # let the post-auth repaint settle
            got = probe(page)

            page.screenshot(path=str(SHOTS / ('profiler-role-%s.png' % role)), full_page=False)

            # The field-notes log cog lives on the roster, not the dossier view
            page.goto(base + '#', wait_until='networkidle')
            page.wait_for_timeout(800)
            got['cog'] = page.evaluate(
                "() => { const e = document.getElementById('ov-notes-cog');"
                " return !!e && getComputedStyle(e).display !== 'none'; }")

            exp = EXPECT[role]
            for cap in ('fieldNote', 'versions', 'guidance', 'export'):
                if got[cap] != exp[cap]:
                    failures.append('%s: %s expected %s, got %s' % (role, cap, exp[cap], got[cap]))
            if got['cog'] != exp['fieldNote']:
                failures.append('%s: notes cog expected %s, got %s' % (role, exp['fieldNote'], got['cog']))
            if got['role'] != role:
                failures.append('%s: stored tier is %r' % (role, got['role']))
            if got['wall']:
                failures.append('%s: sign-in wall still covering the app' % role)

            rows.append((role, got))
            ctx.close()
        browser.close()
    httpd.shutdown()

    mark = lambda b: 'shown ' if b else 'hidden'
    print('\n%-12s %-8s %-8s %-8s %-8s %-8s %-8s' %
          ('ROLE', 'NoteBtn', 'NoteBox', 'Cog', 'Versions', 'Guidance', 'Export'))
    print('-' * 66)
    for role, g in rows:
        print('%-12s %-8s %-8s %-8s %-8s %-8s %-8s' % (
            role, mark(g['noteBtn']), mark(g['noteBox']), mark(g['cog']),
            mark(g['versions']), mark(g['guidance']), mark(g['export'])))
    print()
    if failures:
        print('MATRIX MISMATCHES (%d):' % len(failures))
        for f in failures:
            print('  ✗', f)
        return 1
    print('MATRIX VERIFIED — all four tiers match the directive.')
    return 0


if __name__ == '__main__':
    sys.exit(run())

# Developed by: ShadowAISolutions
