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

N1 session 2 — review, dedupe, save (§4.2, steps 6–10) against the stub: the
editor carries the review block (role, the account block with the D5 stage
gate, source event, met date, consent, do-not-contact) and the company
resolver reads the public Profiler registry (ABB resolves by name and by a
subdomain; Acme Energy does not); Save runs nop=dupcheck → nop=save → the
<Company>/ folder creation → nop=setfolders (accounts) → the Drive MOVE
(files.update addParents/removeParents) → nop=links, in that order, and the
held record leaves IndexedDB while the list row (name · title · company)
appears (network-save-list.png); a second card with the same email gets the
merge sheet, never a silent reject (network-save-merge.png), and Merge sends
mergeInto=<the survivor>; "Keep as a separate contact" sends distinct=; a
row tap fetches the full row (nop=get); Delete → Restore round-trips
(nop=delete / nop=restore) and Save all files the stack. v01.11w: titles,
departments and company names are standardised (nwStdField) and a saved
contact is editable from its row (nop=update). v01.12w: the developer's
own casing calls (RAI, the "Director, X" comma form) and the Tidy button
that re-cases every saved contact through nop=get → nop=update.

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


def gas_stub(role, counter, state=None):
    """Stand in for the deployed Network GAS: counts every data request and
    answers nop=list the way handleNetworkOp_ does for the tier. `state`
    (session 2) holds the rows the save ops wrote so the list answers them."""
    state = state if state is not None else {'contacts': [], 'accounts': [], 'posts': [], 'folders': None}
    def q(post, key):
        import urllib.parse
        return dict(urllib.parse.parse_qsl(post)).get(key, '')
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
                        'contacts': [c for c in state['contacts'] if not c.get('deletedAt')],
                        'accounts': state['accounts'], 'folders': state['folders']}
            elif 'nop=newid' in url:
                body = {'success': True, 'id': 'c-0123456789abc'}
            elif 'nop=folders' in url:
                body = {'success': True, 'folders': None}
            elif 'nop=setfolders' in url:
                import urllib.parse
                qs = dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query))
                accts = (state['folders'] or {}).get('accounts', {}) if state['folders'] else {}
                accts = dict(accts, **json.loads(qs.get('accounts') or '{}'))
                state['folders'] = {'root': 'ROOTFOLDERID000001', 'inbox': 'INBOXFOLDERID00001', 'accounts': accts}
                body = {'success': True, 'folders': state['folders']}
            elif 'nop=dupcheck' in post:
                state['posts'].append(('dupcheck', post))
                c = json.loads(q(post, 'contact') or '{}')
                emails = [e.get('value') for e in c.get('emails', [])]
                dup = next((s for s in state['contacts'] if not s.get('deletedAt') and s['email'] in emails and s['id'] != q(post, 'contactId')), None)
                body = {'success': True, 'contactId': q(post, 'contactId'), 'duplicate': dup and dict(dup['full'], matchedOn='email')}
            elif 'nop=save' in post:
                state['posts'].append(('save', post))
                c = json.loads(q(post, 'contact') or '{}'); a = json.loads(q(post, 'account') or '{}')
                cid = q(post, 'contactId'); merge = q(post, 'mergeInto')
                if a.get('stage', 'none') != 'none' and a.get('relationship') not in ('target', 'customer'):
                    body = {'success': False, 'error': 'STAGE_NEEDS_TARGET_OR_CUSTOMER'}
                else:
                    acc = next((x for x in state['accounts'] if x['name'].lower() == a.get('name', '').lower()), None)
                    created = acc is None
                    if created:
                        acc = {'id': 'a-%013d' % (len(state['accounts']) + 1), 'name': a.get('name', ''), 'slug': a.get('slug', ''),
                               'relationship': a.get('relationship'), 'stage': a.get('stage'), 'updatedAt': '2026-09-21T00:00:00Z'}
                        state['accounts'].append(acc)
                    if merge:
                        surv = next(x for x in state['contacts'] if x['id'] == merge)
                        surv['full'].update(c)
                        body = {'success': True, 'contactId': merge, 'absorbedId': cid, 'merged': True, 'accountId': acc['id'],
                                'accountName': acc['name'], 'accountCreated': created, 'linksTarget': 'contact', 'mergeInteractionId': 'i-0000000000001'}
                    else:
                        state['contacts'].append({'id': cid, 'accountId': acc['id'], 'name': c.get('fullName'), 'title': c.get('title'),
                                                  'role': c.get('role'), 'sourceEvent': c.get('sourceEvent'), 'metDate': c.get('metDate'),
                                                  'updatedAt': '2026-09-21T00:00:%02dZ' % len(state['contacts']),
                                                  'email': (c.get('emails') or [{}])[0].get('value', ''), 'full': dict(c, id=cid, accountId=acc['id'])})
                        body = {'success': True, 'contactId': cid, 'accountId': acc['id'], 'accountName': acc['name'],
                                'accountCreated': created, 'interactionId': 'i-0000000000002', 'linksTarget': 'contact'}
            elif 'nop=update' in post:
                state['posts'].append(('update', post))
                c = json.loads(q(post, 'contact') or '{}'); a = json.loads(q(post, 'account') or '{}')
                row = next(x for x in state['contacts'] if x['id'] == q(post, 'contactId'))
                acc = next((x for x in state['accounts'] if x['name'].lower() == a.get('name', '').lower()), None)
                if acc is None:
                    acc = {'id': 'a-%013d' % (len(state['accounts']) + 1), 'name': a.get('name', ''), 'slug': a.get('slug', ''),
                           'relationship': a.get('relationship'), 'stage': a.get('stage'), 'updatedAt': '2026-09-21T00:00:00Z'}
                    state['accounts'].append(acc)
                changed = row['accountId'] != acc['id']
                row.update({'accountId': acc['id'], 'name': c.get('fullName'), 'title': c.get('title'), 'role': c.get('role')})
                row['full'].update(c, accountId=acc['id'])
                body = {'success': True, 'contactId': row['id'], 'accountId': acc['id'], 'accountName': acc['name'], 'accountCreated': False, 'accountChanged': changed}
            elif 'nop=links' in url:
                body = {'success': True}
            elif 'nop=get' in url:
                cid = url.split('id=')[1].split('&')[0]
                row = next((x for x in state['contacts'] if x['id'] == cid), None)
                body = ({'success': True, 'contact': row['full'], 'account': next(x for x in state['accounts'] if x['id'] == row['accountId']),
                         'interactions': [{'id': 'i-0000000000002', 'kind': 'scan', 'date': '2026-09-21', 'summary': 'Card scanned'}]}
                        if row else {'success': False, 'error': 'not_found'})
            elif 'nop=delete' in url or 'nop=restore' in url:
                cid = url.split('id=')[1].split('&')[0]
                row = next((x for x in state['contacts'] if x['id'] == cid), None)
                if row:
                    row['deletedAt'] = '' if 'nop=restore' in url else '2026-09-21T00:00:00Z'
                body = {'success': True, 'id': cid, 'deletedAt': row and row['deletedAt']}
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
        if request.method == 'PATCH' and 'addParents=' in request.url:
            fid = request.url.split('/files/')[1].split('?')[0]
            body = {'id': fid, 'webViewLink': 'https://drive.google.com/file/d/%s/view?moved=1' % fid}
        elif '/upload/drive/v3/files' in request.url:
            body = {'id': 'FILEID00000000000001', 'webViewLink': 'https://drive.google.com/file/d/FILEID00000000000001/view'}
        elif '/drive/v3/files' in request.url:
            post = request.post_data or ''
            body = {'id': 'ROOTFOLDERID000001' if '"Network App"' in post else 'INBOXFOLDERID00001' if '"_inbox"' in post else 'ACCTFOLDERID000001'}
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
        rowOrder: (function(){ const rows = [...document.querySelectorAll('#nw-capture .nw-toprow, #nw-capture .nw-actions')];
          return rows.map(r => r.querySelector('#nw-cap-btn') ? 'scan' : r.querySelector('#nw-extract-btn') ? 'extract' : r.querySelector('#nw-sides') ? 'sides' : '?').join(','); })(),
        halves: (function(){ const r = document.querySelector('#nw-capture .nw-toprow'); if (!r) return false;
          const a = r.children[0].getBoundingClientRect(), b = r.children[1].getBoundingClientRect();
          return Math.abs(a.width - b.width) < 2 && Math.abs(a.height - b.height) < 2; })(),
        stacked: (function(){ const b = document.getElementById('nw-sides-one'); return !!(b && b.querySelector('small') && b.textContent.replace(/\s/g,'') === 'One-sided'); })(),
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


def load_as(browser, base, role, query='', state=None):
    counter, errors = [], []
    ctx = browser.new_context(viewport=PHONE, device_scale_factor=2, is_mobile=True, has_touch=True)
    ctx.route('**://script.google.com/**', gas_stub(role, counter, state))
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
                if got['rowOrder'] != 'scan,extract,sides' or not got['halves'] or not got['stacked']:
                    failures.append('%s: control rows wrong — order=%r halves=%s stacked=%s' % (role, got['rowOrder'], got['halves'], got['stacked']))
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
        state = {'contacts': [], 'accounts': [], 'posts': [], 'folders': None}
        ctx, page, reqs, errs = load_as(browser, base, 'admin', '', state)
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
        # Name case rule: ALL CAPS and all lower-case become First-letter caps; mixed case is left alone.
        cases = page.evaluate("""() => ['MOHAMMED S. ALRAI', 'austin york', 'Kamran Moradi, PhD', 'Ronald McDonald', "o'brien-smith",
            'WEI ZHANG (张伟)', 'MARY-ANNE LEE'].map(nwCapName)""")
        want = ['Mohammed S. Alrai', 'Austin York', 'Kamran Moradi, PhD', 'Ronald McDonald', "O'Brien-Smith", 'Wei Zhang (张伟)', 'Mary-Anne Lee']
        if cases != want:
            failures.append('names: nwCapName gave %r' % (cases,))
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
        # ── N1 s2 — review, dedupe, save ─────────────────────────────────
        idb_count = """() => new Promise(res => { const r = indexedDB.open('nw-capture', 1); r.onsuccess = () => {
            const tx = r.result.transaction('pending', 'readonly'); const g = tx.objectStore('pending').count();
            g.onsuccess = () => res(g.result); }; })"""
        # Company resolution against the public registry: name, aka and a subdomain of a listed domain.
        resolved = page.evaluate("""() => Promise.all([nwResolveCompany('ABB Ltd', ''), nwResolveCompany('', 'new.global.abb'),
            nwResolveCompany('Advanced Micro Devices, Inc.', ''), nwResolveCompany('Acme Energy', 'acme.example')])
            .then(r => r.map(x => x && [x.slug, x.segmentIds.length > 0]))""")
        if resolved[0] != ['abb', True] or resolved[1] != ['abb', True] or resolved[2] != ['amd', True] or resolved[3] is not None:
            failures.append('resolve: registry resolution gave %r' % (resolved,))
        # The review block on the editor: defaults, the D5 stage gate, the choices persisted to the held record.
        page.click('#nw-extracted .nw-strip .nw-edit-btn')
        page.wait_for_selector('#nw-extracted .nw-editor select[data-review="role"]', timeout=5000)
        rv = page.evaluate("""() => { const f = document.querySelector('#nw-extracted .nw-editor');
            const v = k => (f.querySelector('[data-review="' + k + '"]') || {}).value;
            const st = f.querySelector('[data-review="stage"]');
            return { role: v('role'), rel: v('relationship'), stage: st.value, stageOn: !st.disabled, consent: v('consent'),
                     dnc: f.querySelector('[data-review="dnc"]').checked, met: v('metDate'), covered: (document.querySelector('#nw-extracted .nw-covered') || {}).textContent || '',
                     lastIsActions: !!(f.lastElementChild && f.lastElementChild.classList.contains('nw-editor-actions')) }; }""")
        today = page.evaluate("() => new Date().toISOString().slice(0, 10)")
        if not (rv['role'] == 'other' and rv['rel'] == 'target' and rv['stage'] == 'none' and rv['stageOn'] and rv['consent'] == 'unknown'
                and rv['dnc'] is False and rv['met'] == today and 'Not in the Profiler record' in rv['covered'] and rv['lastIsActions']):
            failures.append('review: defaults wrong — %r (today %s)' % (rv, today))
        page.select_option('#nw-extracted .nw-editor select[data-review="relationship"]', 'partner')
        if page.evaluate("() => !document.querySelector('#nw-extracted .nw-editor select[data-review=\"stage\"]').disabled"):
            failures.append('review: stage stayed enabled for relationship=partner (D5)')
        page.select_option('#nw-extracted .nw-editor select[data-review="relationship"]', 'target')
        page.select_option('#nw-extracted .nw-editor select[data-review="stage"]', 'discovery')
        page.select_option('#nw-extracted .nw-editor select[data-review="role"]', 'decision-maker')
        page.fill('#nw-extracted .nw-editor input[data-review="sourceEvent"]', 're-plus-2026')
        page.select_option('#nw-extracted .nw-editor select[data-review="consent"]', 'yes')
        page.click('#nw-extracted .nw-editor button[type="submit"]')
        page.wait_for_timeout(400)
        held = page.evaluate("""() => new Promise(res => { const r = indexedDB.open('nw-capture', 1); r.onsuccess = () => {
            const tx = r.result.transaction('pending', 'readonly'); const g = tx.objectStore('pending').getAll();
            g.onsuccess = () => res(g.result.map(o => o.review && [o.review.role, o.review.relationship, o.review.stage, o.review.sourceEvent, o.review.consent])); }; })""")
        if held != [['decision-maker', 'target', 'discovery', 're-plus-2026', 'yes']]:
            failures.append('review: choices not persisted to the held record: %r' % (held,))
        strip = page.evaluate("() => (document.querySelector('#nw-extracted .nw-strip') || {}).textContent || ''")
        if 'Decision maker' not in strip or 'Discovery' not in strip or 're-plus-2026' not in strip:
            failures.append('review: the strip detail does not show the review choices: %r' % strip[:160])
        # Retry extraction re-runs nop=extract with the SAME c- id from the base64 this tab still holds.
        n_extract = len([x for x in state['posts']]) ; before = len([u for u in reqs if 'script.google.com' in u])
        page.click('#nw-extracted .nw-strip .nw-retry-btn')
        page.wait_for_function("() => /Read again/.test((document.getElementById('nw-cap-status') || {}).textContent || '')", timeout=15000)
        if not [u for u in reqs[before:] if 'script.google.com' in u]:
            failures.append('retry: no extract request was issued')
        # Save: dupcheck → save → <Company>/ folder → setfolders(accounts) → the MOVE → links, then the list row.
        mark = len(reqs)
        page.click('#nw-extracted .nw-strip .nw-save-btn')
        page.wait_for_function("() => document.querySelectorAll('#nw-extracted .nw-strip').length === 0", timeout=20000)
        page.wait_for_function("() => document.querySelectorAll('#nw-list .nw-row').length === 1", timeout=10000)
        page.wait_for_timeout(400)
        page.screenshot(path=str(SHOTS / 'network-save-list.png'), full_page=False)
        seq = []
        for u in reqs[mark:]:
            if 'nop=setfolders' in u: seq.append('setfolders')
            elif 'nop=links' in u: seq.append('links')
            elif 'nop=list' in u: seq.append('list')
            elif 'addParents=ACCTFOLDERID000001' in u and 'removeParents=INBOXFOLDERID00001' in u: seq.append('move')
            elif '/drive/v3/files?' in u: seq.append('folder')
        kinds = [k for k, _ in state['posts']]
        if kinds[-2:] != ['dupcheck', 'save'] or seq != ['folder', 'setfolders', 'move', 'links', 'list']:
            failures.append('save: expected dupcheck, save, then folder → setfolders → move → links → list; posts=%r seq=%r' % (kinds, seq))
        save_post = dict(__import__('urllib.parse').parse.parse_qsl(state['posts'][-1][1]))
        sc, sa = json.loads(save_post.get('contact', '{}')), json.loads(save_post.get('account', '{}'))
        if not (sc.get('role') == 'decision-maker' and sc.get('sourceEvent') == 're-plus-2026' and sc.get('consent') == 'yes' and sc.get('metDate') == today
                and sa.get('name') == 'Acme Energy' and sa.get('relationship') == 'target' and sa.get('stage') == 'discovery' and sa.get('slug') == ''
                and 'confidence' in save_post.get('raw', '')):
            failures.append('save: payload wrong — contact=%r account=%r raw=%s' % (sc, sa, 'confidence' in save_post.get('raw', '')))
        if page.evaluate(idb_count) != 0:
            failures.append('save: the held record is still in IndexedDB after save')
        if (state['folders'] or {}).get('accounts') != {'a-0000000000001': 'ACCTFOLDERID000001'}:
            failures.append('save: the account folder id was not parked through setfolders: %r' % (state['folders'],))
        row = page.evaluate("() => (document.querySelector('#nw-list .nw-row') || {}).textContent || ''")
        if 'Jane O’Doe-Smith' not in row or 'Director, Grid Services' not in row or 'Acme Energy' not in row:
            failures.append('list: row should read name · title · company, got %r' % row[:120])
        # The row: tap → the full row (nop=get); Delete → Restore.
        page.click('#nw-list .nw-row .nw-row-main')
        page.wait_for_function("() => /Profiler|Target/.test((document.querySelector('#nw-list .nw-row-detail') || {}).textContent || '')", timeout=8000)
        det = page.evaluate("() => document.querySelector('#nw-list .nw-row.nw-open .nw-row-detail').textContent")
        if 'jane@acme.example' not in det or 'Target' not in det or 're-plus-2026' not in det or not [u for u in reqs if 'nop=get' in u]:
            failures.append('get: the full row did not open on tap: %r' % det[:160])
        page.click('#nw-list .nw-row .nw-row-del')
        page.wait_for_selector('#nw-list .nw-row.nw-deleted .nw-row-restore', timeout=8000)
        if not [u for u in reqs if 'nop=delete' in u] or state['contacts'][0].get('deletedAt') == '':
            failures.append('delete: nop=delete not issued or the stub row not marked deleted')
        page.click('#nw-list .nw-row .nw-row-restore')
        page.wait_for_function("() => !document.querySelector('#nw-list .nw-row.nw-deleted') && document.querySelectorAll('#nw-list .nw-row').length === 1", timeout=8000)
        if not [u for u in reqs if 'nop=restore' in u] or state['contacts'][0].get('deletedAt'):
            failures.append('restore: nop=restore not issued or the stub row still deleted')
        # Standardisation of titles / departments / company names (the developer's rule).
        std = page.evaluate("""() => [['DIRECTOR OF GRID SERVICES', true], ['Senior Vice President, Sales', true], ['Executive Vice President', true],
            ['vice president of business development', true], ['SVP Sales', true], ['HEAD OF IT', true], ['CEO', true], ['Sr Engineer, R&D', true],
            ['Key Account Manager (亚太区)', true], ['AVANTUS', false], ['acme energy', false], ['ABB', false], ['TSMC', false], ['McKinsey & Company', false],
            ['SUNGROW POWER SUPPLY CO., LTD.', false], ['Siemens Energy GMBH', false], ['SALES & MARKETING', false]].map(c => nwStdField(c[0], c[1]))""")
        want_std = ['Director, Grid Services', 'Sr. VP, Sales', 'EVP', 'VP, Business Development', 'Sr. VP Sales', 'Head of IT', 'CEO', 'Sr. Engineer, R&D',
                    'Key Account Manager (亚太区)', 'Avantus', 'Acme Energy', 'ABB', 'TSMC', 'McKinsey & Company', 'Sungrow Power Supply Co., Ltd.',
                    'Siemens Energy GmbH', 'Sales & Marketing']
        if std != want_std:
            failures.append('standardise: nwStdField gave %r' % (std,))
        dev = page.evaluate("""() => [['VICE PRESIDENT, PRE-CONSTRUCTION', 1], ['Vice President', 1], ['Director of Onshore Renewables', 1], ['Senior Manager', 1],
            ['DIRECTOR, STORAGE ENGINEERING', 1], ['AVANTUS', 0], ['SR. MANAGER, STORAGE ENGINEERING', 1], ['DEVELOPMENT COORDINATOR', 1], ['Jupiter POWER', 0],
            ['CYPRESS CREEK RENEWABLES', 0], ['DEPUTY DIRECTOR', 1], ['SR. DIRECTOR, STORAGE ENGINEERING', 1], ['RAI ENERGY', 0], ['Head of IT', 1], ['Chief of Staff', 1]]
            .map(c => nwStdField(c[0], !!c[1]))""")
        want_dev = ['VP, Pre-Construction', 'VP', 'Director, Onshore Renewables', 'Sr. Manager', 'Director, Storage Engineering', 'Avantus', 'Sr. Manager, Storage Engineering',
                    'Development Coordinator', 'Jupiter Power', 'Cypress Creek Renewables', 'Deputy Director', 'Sr. Director, Storage Engineering', 'RAI Energy', 'Head of IT', 'Chief of Staff']
        if dev != want_dev:
            failures.append('standardise: the developer\'s 2026-09-21 cases gave %r' % (dev,))
        # Tidy saved contacts: a row saved with an un-tidied title is re-cased through nop=get → nop=update.
        state['contacts'][0]['full']['title'] = 'SR. DIRECTOR, STORAGE ENGINEERING'; state['contacts'][0]['title'] = 'SR. DIRECTOR, STORAGE ENGINEERING'
        page.evaluate("() => nwAfterWrite()")
        page.wait_for_function("() => /SR\\. DIRECTOR/.test((document.getElementById('nw-list') || {}).textContent || '')", timeout=8000)
        page.click('#nw-list .nw-tidy-btn')
        page.wait_for_function("() => /Tidy — 1 of 1/.test((document.getElementById('nw-cap-status') || {}).textContent || '')", timeout=15000)
        page.wait_for_function("() => /Sr\\. Director, Storage Engineering/.test((document.getElementById('nw-list') || {}).textContent || '')", timeout=8000)
        tp = dict(__import__('urllib.parse').parse.parse_qsl(state['posts'][-1][1]))
        if state['posts'][-1][0] != 'update' or json.loads(tp.get('contact', '{}')).get('title') != 'Sr. Director, Storage Engineering':
            failures.append('tidy: expected one nop=update carrying the re-cased title, got %r' % (state['posts'][-1][0],))
        # Edit a saved contact from its row: the editor opens in the detail pre-filled, the review block too; save → nop=update → the row re-renders.
        page.click('#nw-list .nw-row .nw-row-main')
        page.wait_for_selector('#nw-list .nw-row.nw-open .nw-row-edit', timeout=8000)
        page.click('#nw-list .nw-row.nw-open .nw-row-edit')
        page.wait_for_selector('#nw-list .nw-row-detail .nw-editor select[data-review="role"]', timeout=5000)
        pre = page.evaluate("""() => { const f = document.querySelector('#nw-list .nw-row-detail .nw-editor');
            return [f.querySelector('input[data-field="fullName"]').value, f.querySelector('input[data-field="company"]').value,
                    f.querySelector('[data-review="role"]').value, f.querySelector('[data-review="stage"]').value, f.querySelector('[data-review="sourceEvent"]').value]; }""")
        if pre != ['Jane O’Doe-Smith', 'Acme Energy', 'decision-maker', 'discovery', 're-plus-2026']:
            failures.append('edit saved: editor not pre-filled from the row: %r' % (pre,))
        page.fill('#nw-list .nw-row-detail .nw-editor input[data-field="title"]', 'senior vice president, grid')
        page.select_option('#nw-list .nw-row-detail .nw-editor select[data-review="role"]', 'champion')
        page.click('#nw-list .nw-row-detail .nw-editor button[type="submit"]')
        page.wait_for_function("() => /Saved changes/.test((document.getElementById('nw-cap-status') || {}).textContent || '')", timeout=10000)
        page.wait_for_function("() => /Sr\\. VP, Grid/.test((document.querySelector('#nw-list .nw-row') || {}).textContent || '')", timeout=10000)
        up = dict(__import__('urllib.parse').parse.parse_qsl(state['posts'][-1][1]))
        uc = json.loads(up.get('contact', '{}'))
        if state['posts'][-1][0] != 'update' or up.get('contactId') != 'c-0123456789abc' or uc.get('title') != 'Sr. VP, Grid' or uc.get('role') != 'champion' or uc.get('metDate') != today:
            failures.append('edit saved: nop=update payload wrong: %r' % ({k: uc.get(k) for k in ('title', 'role', 'metDate')},))
        if page.evaluate(idb_count) != 0:
            failures.append('edit saved: editing a saved contact wrote a held record')
        # A second card with the same email: the merge sheet, never a silent reject; Merge sends mergeInto.
        def seed(cid, name, email, back=False):
            page.evaluate("""([cid, name, email, back]) => { const rec = { id: cid, sides: back ? 2 : 1, createdAt: new Date().toISOString(),
                frontLink: 'https://drive.google.com/file/d/FILE' + cid.slice(2) + 'F/view', backLink: back ? 'https://drive.google.com/file/d/FILE' + cid.slice(2) + 'B/view' : '',
                driveError: '', viaQr: false, dismissed: {}, extraction: { fullName: name, firstName: name.split(' ')[0], lastName: name.split(' ')[1] || '',
                title: 'Director of Grid Services', company: 'Acme Energy', department: '', emails: [{ value: email, kind: 'work' }], phones: [], address: '',
                website: 'acme.example', linkedin: '', socials: [], languages: ['en'], rawText: name,
                confidence: { fullName: 0.99, title: 0.9, company: 0.95, emails: 0.97, phones: 0, address: 0, website: 0.9 } } };
                _nwPending.push(rec); return nwPendingPut(rec).then(() => { nwRenderStrip(rec); nwSaveAllRefresh(); }); }""", [cid, name, email, back])
        seed('c-1111111111111', 'Jane Doe', 'jane@acme.example', True)
        page.wait_for_selector('#nw-extracted .nw-strip[data-id="c-1111111111111"] .nw-save-btn', timeout=5000)
        if not page.query_selector('#nw-extracted .nw-strip[data-id="c-1111111111111"] .nw-swap-btn'):
            failures.append('swap: a two-sided card has no Swap pill')
        page.click('#nw-extracted .nw-strip[data-id="c-1111111111111"] .nw-save-btn')
        page.wait_for_selector('#nw-extracted .nw-sheet', timeout=10000)
        page.screenshot(path=str(SHOTS / 'network-save-merge.png'), full_page=False)
        sheet = page.evaluate("() => document.querySelector('#nw-extracted .nw-sheet').textContent")
        radios = page.evaluate("() => [...document.querySelectorAll('#nw-extracted .nw-sheet input[type=radio]:checked')].map(r => r.value)")
        if 'Looks like Jane O’Doe-Smith' not in sheet or 'email address' not in sheet or not page.query_selector('#nw-extracted .nw-sheet .nw-merge-keep') or not radios or set(radios) != {'new'}:
            failures.append('merge: sheet wrong — text=%r checked=%r' % (sheet[:120], radios))
        page.click('#nw-extracted .nw-sheet .nw-merge-go')
        page.wait_for_function("() => !document.querySelector('#nw-extracted .nw-strip[data-id=\"c-1111111111111\"]')", timeout=15000)
        page.wait_for_timeout(300)
        mp = dict(__import__('urllib.parse').parse.parse_qsl(state['posts'][-1][1]))
        if state['posts'][-1][0] != 'save' or mp.get('mergeInto') != 'c-0123456789abc' or json.loads(mp['contact']).get('fullName') != 'Jane Doe':
            failures.append('merge: expected save with mergeInto=c-0123456789abc carrying the chosen fields, got %r' % (mp.get('mergeInto'),))
        if len([x for x in state['contacts'] if not x.get('deletedAt')]) != 1 or state['contacts'][0]['full'].get('fullName') != 'Jane Doe':
            failures.append('merge: the survivor was not updated with the merged fields')
        moved = [u for u in reqs if 'addParents=ACCTFOLDERID000001' in u]
        if len(moved) != 3:
            failures.append('merge: both sides of the second card should move too (3 moves in all), saw %d' % len(moved))
        # "Keep as a separate contact" sends distinct=<the declined match>.
        seed('c-2222222222222', 'Jane Two', 'jane@acme.example')
        page.wait_for_selector('#nw-extracted .nw-strip[data-id="c-2222222222222"] .nw-save-btn', timeout=5000)
        page.click('#nw-extracted .nw-strip[data-id="c-2222222222222"] .nw-save-btn')
        page.wait_for_selector('#nw-extracted .nw-sheet .nw-merge-keep', timeout=10000)
        page.click('#nw-extracted .nw-sheet .nw-merge-keep')
        page.wait_for_function("() => document.querySelectorAll('#nw-list .nw-row').length === 2", timeout=15000)
        kp = dict(__import__('urllib.parse').parse.parse_qsl(state['posts'][-1][1]))
        if kp.get('distinct') != 'c-0123456789abc' or kp.get('mergeInto'):
            failures.append('keep: expected save with distinct=c-0123456789abc, got %r' % (kp.get('distinct'),))
        # Save all: the stack, in order.
        seed('c-3333333333333', 'Ann Three', 'ann@acme.example'); seed('c-4444444444444', 'Bob Four', 'bob@acme.example')
        page.wait_for_selector('#nw-extracted .nw-strip[data-id="c-4444444444444"]', timeout=5000)
        page.click('#nw-saveall-btn')
        page.wait_for_function("() => document.querySelectorAll('#nw-list .nw-row').length === 4 && document.querySelectorAll('#nw-extracted .nw-strip').length === 0", timeout=25000)
        if page.evaluate(idb_count) != 0 or 'Save all' not in page.evaluate("() => document.getElementById('nw-cap-status').textContent"):
            failures.append('save all: held records left=%d' % page.evaluate(idb_count))
        # Delete a held card: confirm, the strip goes, the held record goes, the Drive file is deleted.
        seed('c-5555555555555', 'Del Five', 'del@acme.example')
        page.wait_for_selector('#nw-extracted .nw-strip[data-id="c-5555555555555"] .nw-del-btn', timeout=5000)
        page.once('dialog', lambda d: d.accept())
        page.click('#nw-extracted .nw-strip[data-id="c-5555555555555"] .nw-del-btn')
        page.wait_for_timeout(600)
        left = page.evaluate(idb_count)
        if probe(page)['strips'] != 0 or left != 0:
            failures.append('delete: strip or held record still present (strips=%d records=%d)' % (probe(page)['strips'], left))
        if not [u for u in reqs if '/drive/v3/files/FILE5555555555555F' in u]:
            failures.append('delete: no Drive delete request for the card photo')
        if order[:1] != ['newid'] or 'upload' not in order or order.index('newid') > order.index('upload'):
            failures.append('drain: expected the id minted BEFORE the Drive upload (D8), saw %r' % order)
        real_errs = [e for e in errs if not any(s in e for s in IGNORE)]
        if real_errs:
            failures.append('capture: %d page error(s): %s' % (len(real_errs), real_errs[0][:100]))
        rows.append(('admin+s1+s2', got, len([u for u in reqs if 'action=network' in u or 'op=network' in u]), len(real_errs)))
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
    print('\nScreenshots: %s/network-role-<tier>.png, network-capture-*.png, network-save-list.png, network-save-merge.png (%dx%d)'
          % (SHOTS, PHONE['width'], PHONE['height']))
    if failures:
        print('\nFAILURES (%d):' % len(failures))
        for f in failures:
            print('  ✗', f)
        return 1
    print('\nALL CHECKS PASSED — admin sees the capture card and the empty list; contributor, analyst and viewer are turned away '
          'with zero requests and no capture inputs; preview only subtracts; an offline capture queues and drains on reconnect; '
          'review → save → Drive move → list row, merge on a duplicate, delete → restore and Save all round-trip against the stub.')
    return 0


if __name__ == '__main__':
    sys.exit(run())

# Developed by: LightAISolutions
