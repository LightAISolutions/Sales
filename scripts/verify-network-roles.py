#!/usr/bin/env python3
"""Verify the Network app's door — the admin-only access matrix (design plan D7).

Serves live-site-pages/ over localhost, seeds a session for each ACL tier,
stubs the Network GAS backend (action=network) and asserts, per tier:

    tier         admitted   surface                                 data requests
    admin         yes       the capture card + the (empty) list     1 (nop=list)
    contributor    no       the turned-away card, no capture inputs  0
    analyst        no       the turned-away card, no capture inputs  0
    viewer         no       the turned-away card, no capture inputs  0

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

N1 session 1 — the capture card (design plan §4.2, steps 1–5): for the admin
the card is mounted with its front / back toggle, the two hidden inputs
(capture="environment" single, multiple batch) and the queued count; for the
other three tiers none of it is in the DOM. Then the offline path: with the
context offline, a generated card photo is staged and Extract is tapped — the
pair lands in the IndexedDB queue and the count reads 1 (screenshot
network-capture-queued.png). Back online, the drain runs the same pipeline
against the stub (nop=newid → Drive upload → nop=extract) and the extracted
strip appears with the count back at 0 (network-capture-extracted.png) under the green
Filed signal, with its photo link and, on a tap, its field detail (network-capture-detail.png);
the low-confidence note's Fix opens the editor, and saving clears the note, marks the field verified
and persists the edit in IndexedDB (network-capture-edited.png).

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
import base64, glob, json, threading, functools, http.server, socketserver, sys
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
        elif 'action=network' in url or 'op=network' in url or 'action=network' in (request.post_data or ''):
            post = request.post_data or ''
            if role != 'admin':
                body = {'success': False, 'error': 'ROLE_DENIED', 'role': role}
            elif 'nop=list' in url:
                body = {'success': True, 'role': 'admin', 'caps': ['contacts'],
                        'contacts': [], 'accounts': [], 'folders': None}
            elif 'nop=newid' in url:
                body = {'success': True, 'id': 'c-0123456789abc'}
            elif 'nop=folders' in url:
                body = {'success': True, 'folders': None}
            elif 'nop=setfolders' in url:
                body = {'success': True, 'folders': {'root': 'ROOTFOLDERID000001', 'inbox': 'INBOXFOLDERID00001', 'accounts': {}}}
            elif 'nop=extract' in post:
                # body-POST only: the images travel in the form body, not the URL
                assert 'front=' in post and 'contactId=c-0123456789abc' in post
                body = {'success': True, 'contactId': 'c-0123456789abc', 'model': 'stub',
                        'extraction': {'fullName': 'jane o’doe-smith', 'firstName': 'jane', 'lastName': 'o’doe-smith',
                                       'title': 'Director of Grid Services', 'company': 'Acme Energy',
                                       'department': '', 'emails': [{'value': 'jane@acme.example', 'kind': 'work'}],
                                       'phones': [], 'address': '', 'website': 'acme.example', 'linkedin': '', 'socials': [],
                                       'languages': ['en'], 'rawText': 'Jane Doe',
                                       'confidence': {'fullName': 0.98, 'title': 0.9, 'company': 0.95, 'emails': 0.97,
                                                      'phones': 0, 'address': 0, 'website': 0.4}}}
        route.fulfill(status=200, content_type='application/json',
                      headers={'Access-Control-Allow-Origin': '*'}, body=json.dumps(body))
    return handle


def drive_stub(counter):
    """Stand in for the Drive API the browser calls with the user's own
    drive.file token: folder creation and the multipart upload."""
    def handle(route, request):
        counter.append(request.url)
        if request.method == 'DELETE':
            route.fulfill(status=204, body=''); return
        if '/upload/drive/v3/files' in request.url:
            body = {'id': 'FILEID00000000000001', 'webViewLink': 'https://drive.google.com/file/d/FILEID00000000000001/view'}
        elif '/drive/v3/files' in request.url:
            body = {'id': 'ROOTFOLDERID000001' if '"Network App"' in (request.post_data or '') else 'INBOXFOLDERID00001'}
        else:
            body = {'error': 'unsupported_in_test'}
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
        capture: !!document.querySelector('#nw-app #nw-capture'),
        inputs:  document.querySelectorAll('#nw-cap-input, #nw-batch-input').length,
        toggle:  !!document.querySelector('#nw-capture #nw-side-front[aria-pressed]'),
        sidesToggle: !!document.querySelector('#nw-capture #nw-sides-one[aria-pressed]') && !!document.querySelector('#nw-sides-two'),
        scanLabel: (document.getElementById('nw-cap-btn') || {}).textContent || '',
        scanBeside: !!document.querySelector('#nw-capture .nw-toprow .nw-seg + #nw-cap-btn'),
        queued:  (document.getElementById('nw-queue-count') || {}).textContent || '',
        strips:  document.querySelectorAll('#nw-extracted .nw-strip').length,
        progress: !!document.querySelector('#nw-capture #nw-progress .nw-progress-bar'),
        progressOn: !!document.querySelector('#nw-progress.nw-on'),
        progressOk: !!document.querySelector('#nw-progress.nw-ok'),
        statusOk: !!document.querySelector('#nw-cap-status.nw-status-ok'),
        photoLinks: document.querySelectorAll('#nw-extracted .nw-strip .nw-strip-photos a[href]:not(.nw-edit-btn)').length,
        notes:   document.querySelectorAll('#nw-extracted .nw-strip .nw-note-check').length,
        editor:  !!document.querySelector('#nw-extracted .nw-strip .nw-editor'),
        detailRows: document.querySelectorAll('#nw-extracted .nw-strip .nw-strip-detail dd').length,
        stored:  sessionStorage.getItem('Network_gas_user_role'),
        admitted: typeof nwAdmitted === 'function' ? nwAdmitted() : null
      };
    }""")


def load_as(browser, base, role, query=''):
    counter, errors = [], []
    ctx = browser.new_context(viewport=PHONE, device_scale_factor=2, is_mobile=True, has_touch=True)
    ctx.route('**://script.google.com/**', gas_stub(role, counter))
    ctx.route('**://www.googleapis.com/**', drive_stub(counter))
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
                if not (got['sidesToggle'] and 'Scan' in got['scanLabel'] and got['scanBeside']):
                    failures.append('%s: sides toggle / Scan placement wrong — sides=%s label=%r beside=%s'
                                    % (role, got['sidesToggle'], got['scanLabel'], got['scanBeside']))
                if not (got['capture'] and got['inputs'] == 2 and got['toggle']):
                    failures.append('%s: capture card incomplete — card=%s inputs=%s toggle=%s'
                                    % (role, got['capture'], got['inputs'], got['toggle']))
                if got['queued'] != '0':
                    failures.append('%s: queued count reads %r on a fresh profile, expected 0' % (role, got['queued']))
                if not got['progress'] or got['progressOn']:
                    failures.append('%s: progress bar missing or already showing on an idle card' % role)
            else:
                if not got['denied']:
                    failures.append('%s: turned-away card not rendered' % role)
                if got['list'] or got['empty']:
                    failures.append('%s: list surface rendered for a turned-away tier' % role)
                if got['capture'] or got['inputs']:
                    failures.append('%s: capture card / inputs in the DOM for a turned-away tier' % role)
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

        # N1 s1 — offline capture queues; reconnect drains through the pipeline.
        ctx, page, reqs, errs = load_as(browser, base, 'admin')
        jpeg_b64 = page.evaluate("""() => {
          const c = document.createElement('canvas'); c.width = 700; c.height = 400;
          const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, 700, 400);
          x.fillStyle = '#222'; x.font = '600 34px Georgia'; x.fillText('Jane Doe', 40, 120);
          x.font = '22px Georgia'; x.fillText('Director of Grid Services', 40, 165); x.fillText('Acme Energy', 40, 205);
          x.font = '18px monospace'; x.fillText('jane@acme.example', 40, 300);
          return c.toDataURL('image/jpeg', 0.85).split(',')[1]; }""")
        photo = {'name': 'card.jpg', 'mimeType': 'image/jpeg', 'buffer': base64.b64decode(jpeg_b64)}
        ctx.set_offline(True)
        page.set_input_files('#nw-cap-input', photo)
        page.wait_for_function("() => /Front captured/.test((document.getElementById('nw-cap-status') || {}).textContent || '')", timeout=10000)
        page.click('#nw-extract-btn')
        page.wait_for_function("() => (document.getElementById('nw-queue-count') || {}).textContent === '1'", timeout=10000)
        page.wait_for_timeout(300)
        page.screenshot(path=str(SHOTS / 'network-capture-queued.png'), full_page=False)
        got = probe(page)
        if got['queued'] != '1' or got['strips']:
            failures.append('offline: expected queued=1 and no strip, got queued=%r strips=%d' % (got['queued'], got['strips']))
        if [u for u in reqs if 'nop=newid' in u]:
            failures.append('offline: the pipeline issued a request while offline')
        page.evaluate("() => { _nwDriveToken = 'test-drive-token'; }")   # the drive.file consent, already given
        ctx.set_offline(False)
        page.wait_for_function("() => document.querySelectorAll('#nw-extracted .nw-strip').length === 1", timeout=20000)
        page.wait_for_function("() => (document.getElementById('nw-queue-count') || {}).textContent === '0'", timeout=10000)
        page.wait_for_timeout(600)
        page.screenshot(path=str(SHOTS / 'network-capture-extracted.png'), full_page=False)
        got = probe(page)
        strip = page.evaluate("() => (document.querySelector('#nw-extracted .nw-strip') || {}).textContent || ''")
        order = [('newid' if 'nop=newid' in u else 'upload' if '/upload/drive' in u else 'folder' if '/drive/v3/files' in u else None) for u in reqs]
        order = [o for o in order if o]
        extract_posts = [r for r in reqs if 'script.google.com' in r]
        if got['queued'] != '0' or got['strips'] != 1:
            failures.append('drain: expected queued=0 and one strip, got queued=%r strips=%d' % (got['queued'], got['strips']))
        if 'Jane O’Doe-Smith' not in strip or 'Front' not in strip or 'one side' in strip or 'Missing' in strip:
            failures.append('drain: strip text unexpected (names capitalised, no Missing cue): %r' % strip[:120])
        if 'c-0123456789abc' in strip or 'check:' in strip:
            failures.append('drain: the id or the raw confidence list is shown on the strip')
        if got['notes'] != 1 or 'website looked unclear' not in strip or not page.query_selector('#nw-extracted .nw-note-check .nw-note-rescan'):
            failures.append('drain: expected one low-confidence note for website, got %d' % got['notes'])
        if not (got['progressOk'] and got['statusOk']):
            failures.append('drain: expected the green Filed signal (progress=%s status=%s)' % (got['progressOk'], got['statusOk']))
        if got['photoLinks'] != 1 or got['detailRows'] < 4:
            failures.append('drain: expected one photo link and the field detail, got links=%d rows=%d' % (got['photoLinks'], got['detailRows']))
        page.click('#nw-extracted .nw-strip .nw-strip-head')
        page.wait_for_timeout(200)
        if not page.evaluate("() => !!document.querySelector('#nw-extracted .nw-strip.nw-open')"):
            failures.append('drain: tapping the strip did not open the field detail')
        page.screenshot(path=str(SHOTS / 'network-capture-detail.png'), full_page=False)
        # The note's Fix opens the editor on that field; saving a value marks it verified and clears the note.
        page.click('#nw-extracted .nw-note-check button.nw-note-fix')
        page.wait_for_timeout(200)
        if not probe(page)['editor'] or page.evaluate("() => document.activeElement && document.activeElement.getAttribute('data-field')") != 'website':
            failures.append('edit: Fix did not open the editor focused on the website field')
        page.fill('#nw-extracted .nw-editor input[data-field="website"]', 'https://acme.example')
        page.fill('#nw-extracted .nw-editor input[data-field="phones"]', '+1 555 0100')
        page.click('#nw-extracted .nw-editor button[type="submit"]')
        page.wait_for_timeout(400)
        got = probe(page)
        strip = page.evaluate("() => (document.querySelector('#nw-extracted .nw-strip') || {}).textContent || ''")
        if got['notes'] != 0 or got['editor'] or 'edited' not in strip or '+1 555 0100' not in strip:
            failures.append('edit: after save expected no note, no editor, "edited" and the new phone; got notes=%d editor=%s' % (got['notes'], got['editor']))
        stored = page.evaluate("""() => new Promise(res => { const r = indexedDB.open('nw-capture', 1); r.onsuccess = () => {
            const tx = r.result.transaction('pending', 'readonly'); const g = tx.objectStore('pending').getAll();
            g.onsuccess = () => res(g.result.map(o => [o.extraction.website, o.extraction.confidence.website, o.edited])); }; })""")
        if stored != [['https://acme.example', 1, True]]:
            failures.append('edit: held record not updated in IndexedDB: %r' % (stored,))
        page.screenshot(path=str(SHOTS / 'network-capture-edited.png'), full_page=False)
        # Delete: confirm, the strip goes, the held record goes, the Drive file is deleted.
        page.once('dialog', lambda d: d.accept())
        page.click('#nw-extracted .nw-strip .nw-del-btn')
        page.wait_for_timeout(600)
        left = page.evaluate("""() => new Promise(res => { const r = indexedDB.open('nw-capture', 1); r.onsuccess = () => {
            const tx = r.result.transaction('pending', 'readonly'); const g = tx.objectStore('pending').count();
            g.onsuccess = () => res(g.result); }; })""")
        if probe(page)['strips'] != 0 or left != 0:
            failures.append('delete: strip or held record still present (strips=%d records=%d)' % (probe(page)['strips'], left))
        if not [u for u in reqs if '/drive/v3/files/FILEID' in u]:
            failures.append('delete: no Drive delete request for the card photo')
        if order[:1] != ['newid'] or 'upload' not in order or order.index('newid') > order.index('upload'):
            failures.append('drain: expected the id minted BEFORE the Drive upload (D8), saw %r' % order)
        real_errs = [e for e in errs if not any(s in e for s in IGNORE)]
        if real_errs:
            failures.append('capture: %d page error(s): %s' % (len(real_errs), real_errs[0][:100]))
        rows.append(('admin+capture', got, len([u for u in reqs if 'action=network' in u or 'op=network' in u]), len(real_errs)))
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
    print('\nScreenshots: %s/network-role-<tier>.png, network-capture-queued.png, network-capture-extracted.png (%dx%d)'
          % (SHOTS, PHONE['width'], PHONE['height']))
    if failures:
        print('\nFAILURES (%d):' % len(failures))
        for f in failures:
            print('  ✗', f)
        return 1
    print('\nALL CHECKS PASSED — admin sees the capture card and the empty list; contributor, analyst and viewer are turned away '
          'with zero requests and no capture inputs; preview only subtracts; an offline capture queues and drains on reconnect.')
    return 0


if __name__ == '__main__':
    sys.exit(run())

# Developed by: LightAISolutions
