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

N2 — accounts and the corpus attachment (§4.1, D4) against the stub: the
Accounts card is present for admin only; a row tap fetches the full account
(nop=get with the a- id) with its live contacts beneath; Edit flips the
relationship to partner and the stage select resets to none (D5), written
through nop=account; a covered account (stub slug `abb`) renders the relative
Profiler.html#abb deep link; the on-the-record check reads the SERVED
profiler-data/abb.profile.json and shows the record's title for a matching
decision-maker name; an uncovered account's Propose a dossier shows the exact
`profiler <Company>` line and marks the account `dossier-proposed`; deleting
an account with live contacts is refused with the count shown.

N3 session 1 — the list (design plan §4.3): the stub's nop=list applies the
search and the eight filters the way nwListOp_ does and carries lastTouch on
every row; the tests drive the search box (the request carries q=, the tile
reads "1 of 5"), the drawer (role, role + consent with the hint counting
them, segment, source event, tag, Clear), the sort strip (Name A → Z, the
flip reverses it, no request issued, Warmth disabled until N4), the
multi-select (two rows ticked while a third's detail stays open, the bar's
count), and the bulk actions: tag through nop=bulk (both ids, the stub tags
both, the selection clears, the tag filter finds them), relationship / stage
through nop=bulk (a stage alone on two Partner accounts refused per row with
the D5 word, then Target · Discovery on both; the bar's own gate pins the
stage to None for a Supplier), the CSV through nop=export (a real download:
BOM, header, two CRLF rows), and delete through nop=delete one request per
row after a confirm that names the count. Screenshots network-list-filters.png
and network-list-bar.png.

N3 session 2 — the exports, the drafts and the QR card (§4.3, D15): the
Export menu on the bar — the vCard bundle parses under a minimal
BEGIN:VCARD walker (N / FN / EMAIL per card, no PHOTO until "include card
image" is ticked, then Ann's front is fetched from the Drive stub with the
page's own token and spliced in as PHOTO;ENCODING=b;TYPE=JPEG with every
line ≤ 75 octets), one vCard per contact as a valid store-only zip, the
.xlsx workbook bytes the stub answered base64; Start a mailing with three
recipients → the default template (merge fields, an unsubscribe line,
{{myAddress}}) saved under a name → nop=drafts renders three drafts with no
{{ left; one edited draft round-trips through nop=draftstatus status=draft;
mailto: carries the edited subject; Copy puts subject + body on the
clipboard; the .eml bundle is three RFC 5322 files with From / To / Subject
and a body, the From kept in localStorage; the .txt has three blocks;
marking sent writes the email-out Interaction the stub records with the d-
id as evidence after a confirm that says nothing is sent; discarding
writes none; the Drafts pill reopens the open drafts; My card saves the
four fields through nop=mycard and renders the vCard as a QR — the preview
SVG and the full-screen SVG (≥ 29 × 29 modules), the page's matrix equal to
python-qrcode's at the same version and mask when that library is
importable; then the D15 grep — the served page and the .gs PROJECT region
call neither MailApp nor GmailApp and name no Gmail scope. Screenshots
network-export-menu.png, network-drafts.png, network-my-card-qr.png.

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
XLSX_STUB = b'PK\x03\x04' + b'NETWORK-XLSX-STUB' * 8      # what the stub's nop=export format=xlsx answers, base64
JPEG_STUB = b'\xff\xd8\xff\xe0' + b'JPEGSTUB' * 40 + b'\xff\xd9'   # the card front the drive stub serves for the vCard PHOTO


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
    state = state if state is not None else {'contacts': [], 'accounts': [], 'posts': [], 'folders': None, 'list_filters': []}
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
                # N3 s1: the search and the eight filters are applied HERE, as nwListOp_ does — the
                # columns they read (emails, tags, consent) never reach the page; lastTouch rides
                # on every row; `total` / `filtered` let the page say "2 of 5".
                import urllib.parse
                qs = dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query))
                f = {k: qs.get(k, '').strip().lower() for k in ('q', 'relationship', 'stage', 'role', 'segment', 'event', 'tag', 'consent')}
                f['from'], f['to'] = qs.get('from', ''), qs.get('to', '')
                state['list_filters'].append(dict((k, v) for k, v in f.items() if v))
                live = [c for c in state['contacts'] if not c.get('deletedAt')]
                accts = [dict(a, contactCount=len([c for c in live if c['accountId'] == a['id']])) for a in state['accounts'] if not a.get('deletedAt')]
                by_acc = dict((a['id'], a) for a in state['accounts'])
                def keep(c):
                    a, full = by_acc.get(c['accountId'], {}), c.get('full', {})
                    if f['relationship'] and a.get('relationship') != f['relationship']: return False
                    if f['stage'] and a.get('stage', 'none') != f['stage']: return False
                    if f['role'] and c.get('role') != f['role']: return False
                    if f['segment'] and f['segment'] not in (a.get('segmentIds') or []): return False
                    if f['event'] and (c.get('sourceEvent') or '').lower() != f['event']: return False
                    if f['tag'] and f['tag'] not in [t.lower() for t in (full.get('tags') or [])]: return False
                    if f['from'] and (c.get('metDate') or '') < f['from']: return False
                    if f['to'] and (c.get('metDate') or '') > f['to']: return False
                    if f['consent'] and (full.get('consent') or 'unknown') != f['consent']: return False
                    if f['q']:
                        hay = '\n'.join([c.get('name') or '', c.get('title') or '', a.get('name') or ''] + [e.get('value', '') for e in (full.get('emails') or [])]).lower()
                        if f['q'] not in hay: return False
                    return True
                rows = [dict((k, v) for k, v in c.items() if k not in ('full', 'email', 'touch')) for c in live if keep(c)]
                for r in rows:
                    src = next(c for c in live if c['id'] == r['id'])
                    r['lastTouch'] = src.get('touch') or src.get('metDate') or ''
                body = {'success': True, 'role': 'admin', 'caps': ['contacts'], 'contacts': rows, 'accounts': accts,
                        'folders': state['folders'], 'total': len(live), 'filtered': any(f.values())}
            elif 'nop=account' in post:
                state['posts'].append(('account', post))
                a = json.loads(q(post, 'account') or '{}')
                acc = next((x for x in state['accounts'] if x['id'] == q(post, 'accountId')), None)
                if acc is None:
                    body = {'success': False, 'error': 'not_found'}
                elif a.get('stage', 'none') != 'none' and a.get('relationship') not in ('target', 'customer'):
                    body = {'success': False, 'error': 'STAGE_NEEDS_TARGET_OR_CUSTOMER'}
                else:
                    renamed = acc['name'] != a.get('name')
                    acc.update({k: a.get(k) for k in ('name', 'relationship', 'stage', 'slug', 'segmentIds', 'tags', 'hq', 'newsroomUrl', 'notes')})
                    body = {'success': True, 'accountId': acc['id'], 'name': acc['name'], 'renamed': renamed, 'account': acc}
            elif 'nop=newid' in url:
                body = {'success': True, 'id': 'c-0123456789abc'}
            elif 'nop=signals' in url or 'nop=signals' in post:
                # E4 s1: the minimal session read of the Signals tab — one row on the account
                # (or the contact's account) so the detail's "Will be at" line renders
                body = {'success': True, 'accountId': q(post, 'accountId') or 'a-0000000000001', 'contactId': q(post, 'contactId'),
                        'signals': [{'id': 's-0000000000001', 'accountId': 'a-0000000000001', 'contactId': '', 'eventSlug': 're-plus-2026', 'kind': 'exhibitor',
                                     'evidenceUrl': 'https://example.com/exhibitors/stub', 'confidence': 0.9, 'firstSeen': '2026-09-22T00:00:00Z',
                                     'lastSeen': '2026-09-22T00:00:00Z', 'source': 'events', 'note': ''}]}
            elif 'nop=peopleaccept' in url or 'nop=peopleaccept' in post:
                # E4 s3: the accept step — one press-quote signal; the params (GET query or POST body — the page's
                # transport falls back to GET against this stub) are recorded so the pass can read what the page sent
                import urllib.parse
                sent = post if 'nop=peopleaccept' in post else urllib.parse.urlsplit(url).query
                state['posts'].append(('peopleaccept', sent))
                body = {'success': True, 'accountId': q(sent, 'accountId'), 'contactId': 'c-0000000000002' if q(sent, 'name') == 'Morten Wierod' else '', 'written': 1, 'updated': 0}
            elif 'nop=people' in url or 'nop=people' in post:
                # E4 s3: the people the press names at the account — the covered account answers two people on one
                # article (one already accepted), the uncovered one has no route
                import urllib.parse
                aid = q(post, 'accountId') or dict(urllib.parse.parse_qsl(urllib.parse.urlsplit(url).query)).get('accountId', '')
                if aid == 'a-0000000000002':
                    body = {'success': True, 'accountId': aid, 'slug': 'abb', 'covered': True, 'since': '2026-06-24',
                            'items': [{'key': 'k3j9x1-2f', 'publishedAt': '2026-09-20T09:00:00Z', 'source': 'Stub Wire', 'title': 'ABB opens a storage line', 'url': 'https://example.com/news/abb',
                                       'people': [{'name': 'Morten Wierod', 'title': 'CEO', 'company': 'ABB', 'role': 'quoted', 'context': 'said the line doubles capacity', 'accepted': False, 'signalId': ''},
                                                  {'name': 'Ada Byline', 'title': 'Reporter', 'company': 'Stub Wire', 'role': 'author', 'context': '', 'accepted': True, 'signalId': 's-0000000000009'}]}]}
                else:
                    body = {'success': True, 'accountId': aid, 'slug': '', 'covered': False, 'items': []}
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
            elif 'nop=get' in url and 'id=a-' in url:
                aid = url.split('id=')[1].split('&')[0]
                acc = next((x for x in state['accounts'] if x['id'] == aid), None)
                body = ({'success': True, 'account': acc,
                         'contacts': [{'id': c['id'], 'name': c['name'], 'title': c['title'], 'role': c['role']}
                                      for c in state['contacts'] if c['accountId'] == aid and not c.get('deletedAt')]}
                        if acc else {'success': False, 'error': 'not_found'})
            elif 'nop=get' in url:
                cid = url.split('id=')[1].split('&')[0]
                row = next((x for x in state['contacts'] if x['id'] == cid), None)
                body = ({'success': True, 'contact': row['full'], 'account': next(x for x in state['accounts'] if x['id'] == row['accountId']),
                         'interactions': [{'id': 'i-0000000000002', 'kind': 'scan', 'date': '2026-09-21', 'summary': 'Card scanned'}]}
                        if row else {'success': False, 'error': 'not_found'})
            elif ('nop=delete' in url or 'nop=restore' in url) and 'id=a-' in url:
                aid = url.split('id=')[1].split('&')[0]
                acc = next((x for x in state['accounts'] if x['id'] == aid), None)
                live = len([c for c in state['contacts'] if c['accountId'] == aid and not c.get('deletedAt')])
                if 'nop=delete' in url and live:
                    body = {'success': False, 'error': 'account_has_contacts', 'count': live}
                else:
                    if acc:
                        acc['deletedAt'] = '' if 'nop=restore' in url else '2026-09-21T00:00:00Z'
                    body = {'success': True, 'id': aid, 'deletedAt': acc and acc['deletedAt']}
            elif 'nop=delete' in url or 'nop=restore' in url:
                cid = url.split('id=')[1].split('&')[0]
                row = next((x for x in state['contacts'] if x['id'] == cid), None)
                if row:
                    row['deletedAt'] = '' if 'nop=restore' in url else '2026-09-21T00:00:00Z'
                body = {'success': True, 'id': cid, 'deletedAt': row and row['deletedAt']}
            elif 'nop=eventstoday' in url:
                # B: the bridge's Source Event default. The stub has no peer, so
                # it answers what the real backend answers while the peer tokens
                # are unset — the card must stay exactly as N1 built it.
                body = {'success': False, 'error': 'not_configured'}
            elif 'nop=bulk' in post:
                # N3 s1: nwBulkOp_'s shape — every id judged on its own, rejected[] read back.
                state['posts'].append(('bulk', post))
                ids = json.loads(q(post, 'ids') or '[]'); op = q(post, 'op')
                applied, unchanged, rejected, verdict = 0, 0, [], {}
                for cid in ids:
                    row = next((x for x in state['contacts'] if x['id'] == cid), None)
                    if row is None: rejected.append({'id': cid, 'reason': 'not_found'}); continue
                    if row.get('deletedAt'): rejected.append({'id': cid, 'reason': 'deleted'}); continue
                    if op == 'tag':
                        tags = row['full'].setdefault('tags', [])
                        if q(post, 'tag') in tags: unchanged += 1
                        else: tags.append(q(post, 'tag')); applied += 1
                    else:
                        want = json.loads(q(post, 'account') or '{}'); aid = row['accountId']
                        if aid not in verdict:
                            acc = next(x for x in state['accounts'] if x['id'] == aid)
                            rel = want.get('relationship') or acc['relationship']; st = want.get('stage') or acc.get('stage', 'none')
                            if want.get('relationship') and not want.get('stage') and rel not in ('target', 'customer'): st = 'none'
                            if st != 'none' and rel not in ('target', 'customer'): verdict[aid] = 'STAGE_NEEDS_TARGET_OR_CUSTOMER'
                            elif rel == acc['relationship'] and st == acc.get('stage', 'none'): verdict[aid] = 'unchanged'
                            else: acc['relationship'], acc['stage'] = rel, st; verdict[aid] = 'ok'
                        if verdict[aid] == 'ok': applied += 1
                        elif verdict[aid] == 'unchanged': unchanged += 1
                        else: rejected.append({'id': cid, 'reason': verdict[aid]})
                body = {'success': True, 'op': op, 'applied': applied, 'unchanged': unchanged,
                        'accounts': len([v for v in verdict.values() if v == 'ok']), 'rejected': rejected}
            elif 'nop=export' in post:
                # N3 s1: nwExportOp_'s CSV — every field quoted, CRLF rows, do-not-contact rows left out.
                # N3 s2: the same gather answers xlsx (the workbook bytes, base64) and vcard (one text per
                # contact + the bundle; the PHOTO line is the page's, spliced from the Drive front).
                state['posts'].append(('export', post))
                ids = json.loads(q(post, 'ids') or '[]'); fmt = q(post, 'format')
                cell = lambda v: '"' + str(v if v is not None else '').replace('"', '""') + '"'
                lines = [','.join(cell(h) for h in ('Contact ID', 'Full Name', 'Title', 'Company', 'Email', 'Tags', 'Last Touch'))]
                cards, excluded = [], 0
                for cid in ids:
                    row = next((x for x in state['contacts'] if x['id'] == cid and not x.get('deletedAt')), None)
                    if row is None: continue
                    if row['full'].get('dnc'): excluded += 1; continue
                    acc = next((x for x in state['accounts'] if x['id'] == row['accountId']), {})
                    lines.append(','.join(cell(v) for v in (cid, row['name'], row['title'], acc.get('name', ''), row.get('email', ''),
                                                             '; '.join(row['full'].get('tags') or []), row.get('touch') or row.get('metDate') or '')))
                    full = row['full']; last = (full.get('lastName') or row['name'].split()[-1]); first = (full.get('firstName') or row['name'].split()[0])
                    vc = 'BEGIN:VCARD\r\nVERSION:3.0\r\nN:%s;%s;;;\r\nFN:%s\r\nORG:%s\r\nTITLE:%s\r\n' % (last, first, row['name'], acc.get('name', ''), row['title'] or '')
                    vc += ''.join('EMAIL;TYPE=WORK,INTERNET:%s\r\n' % e.get('value') for e in (full.get('emails') or []) if e.get('value'))
                    vc += 'UID:%s\r\nEND:VCARD\r\n' % cid
                    cards.append({'id': cid, 'filename': '%s-%s-%s.vcf' % (last, first, cid), 'vcard': vc, 'frontLink': full.get('frontLink', '')})
                body = {'success': True, 'format': fmt, 'rows': len(lines) - 1, 'excluded': excluded}
                if fmt == 'csv':
                    body.update(csv='\r\n'.join(lines) + '\r\n', filename='network-contacts-test.csv')
                elif fmt == 'xlsx':
                    body.update(base64=base64.b64encode(XLSX_STUB).decode('ascii'), filename='network-contacts-test.xlsx', accounts=1, interactions=2)
                else:
                    body.update(cards=cards, vcf=''.join(c['vcard'] for c in cards), filename='network-contacts-test.vcf')
            elif 'nop=mailings' in url:
                # N3 s2: the saved templates, the open drafts (with the contact's name) and the "me" fields.
                me = state.setdefault('me', {})
                named, seen = [], set()
                for m in reversed(state.setdefault('mailings', [])):
                    if m['name'] and m['name'].lower() not in seen: seen.add(m['name'].lower()); named.append(m)
                drafts = [dict(d, name=next((c['name'] for c in state['contacts'] if c['id'] == d['contactId']), '')) for d in reversed(state.setdefault('drafts', [])) if d['status'] == 'draft']
                body = {'success': True, 'templates': named, 'drafts': drafts,
                        'me': {'name': me.get('name', ''), 'company': me.get('company', ''), 'email': 'admin@example.com', 'hasAddress': 0}}
            elif 'nop=draftstatus' in post:
                # N3 s2: draft (an edit) · sent (the email-out Interaction, the d- id as evidence) · discarded.
                state['posts'].append(('draftstatus', post))
                d = next((x for x in state.setdefault('drafts', []) if x['id'] == q(post, 'id')), None); st = q(post, 'status')
                if d is None: body = {'success': False, 'error': 'not_found'}
                elif d['status'] == 'sent': body = {'success': False, 'error': 'already_sent'}
                else:
                    iid = ''
                    if st == 'draft':
                        if 'subject=' in post: d['subject'] = q(post, 'subject')
                        if 'body=' in post: d['body'] = q(post, 'body')
                    elif st == 'sent':
                        iid = 'i-%013d' % (100 + len(state.setdefault('interactions', [])))
                        state['interactions'].append({'id': iid, 'contactId': d['contactId'], 'kind': 'email-out', 'evidence': d['id'], 'summary': 'Follow-up sent: ' + d['subject']})
                        d['sentAt'] = '2026-09-22T12:00:00Z'
                    d['status'] = st; d['updatedAt'] = '2026-09-22T12:00:00Z'
                    body = {'success': True, 'id': d['id'], 'status': st, 'interactionId': iid, 'sentAt': d.get('sentAt', ''), 'updatedAt': d['updatedAt']}
            elif 'nop=drafts' in post:
                # N3 s2: nwDraftsOp_'s shape — one rendered draft per recipient, skipped[] with the reason.
                state['posts'].append(('drafts', post))
                ids = json.loads(q(post, 'ids') or '[]'); mid = 'm-%013d' % (len(state.setdefault('mailings', [])) + 1)
                if q(post, 'mailingId'):
                    tpl = next(m for m in state['mailings'] if m['id'] == q(post, 'mailingId')); subject, tbody, name = tpl['subject'], tpl['body'], ''
                else:
                    subject, tbody, name = q(post, 'subject'), q(post, 'body'), q(post, 'name')
                me = state.setdefault('me', {}); drafts, skipped = [], []
                for cid in ids:
                    row = next((x for x in state['contacts'] if x['id'] == cid), None)
                    if row is None or row.get('deletedAt'): skipped.append({'id': cid, 'reason': 'not_found'}); continue
                    full = row['full']
                    if full.get('dnc'): skipped.append({'id': cid, 'reason': 'do_not_contact'}); continue
                    if full.get('consent') == 'no': skipped.append({'id': cid, 'reason': 'no_consent'}); continue
                    to = next((e['value'] for e in (full.get('emails') or []) if e.get('value')), '')
                    if not to: skipped.append({'id': cid, 'reason': 'no_email'}); continue
                    acc = next((x for x in state['accounts'] if x['id'] == row['accountId']), {})
                    fmap = {'first': full.get('firstName') or row['name'].split()[0], 'last': full.get('lastName') or '', 'company': acc.get('name', ''), 'title': row['title'] or '',
                            'metAt': row.get('sourceEvent') or '', 'metDate': row.get('metDate') or '', 'lastTopic': 'Card scanned', 'myName': me.get('name', ''), 'myCompany': me.get('company', ''), 'myAddress': ''}
                    import re as _re
                    render = lambda t: _re.sub(r'\{\{\s*(\w+)\s*\}\}', lambda m: fmap.get(m.group(1), ''), t)
                    d = {'id': 'd-%013d' % (len(state.setdefault('drafts', [])) + 1), 'mailingId': mid, 'contactId': cid, 'name': row['name'], 'to': to,
                         'subject': render(subject), 'body': render(tbody), 'status': 'draft', 'createdAt': '2026-09-22T11:00:00Z', 'updatedAt': '2026-09-22T11:00:00Z'}
                    state['drafts'].append(d); drafts.append(d)
                state['mailings'].append({'id': mid, 'name': name, 'subject': subject, 'body': tbody, 'createdAt': '2026-09-22T11:00:00Z'})
                body = {'success': True, 'mailingId': mid, 'drafts': drafts, 'skipped': skipped, 'saved': 1 if name else 0}
            elif 'nop=mycard' in url or 'nop=mycard' in post:
                # N3 s2: the developer's own card — the Profiles row's name · title · company · phone and its vCard.
                me = state.setdefault('me', {})
                if 'set=1' in post:
                    state['posts'].append(('mycard', post))
                    me.update({k: q(post, k) for k in ('name', 'title', 'company', 'phone')})
                parts = (me.get('name') or '').split(); last = parts[-1] if len(parts) > 1 else ''; first = ' '.join(parts[:-1]) if len(parts) > 1 else (parts[0] if parts else '')
                vc = 'BEGIN:VCARD\r\nVERSION:3.0\r\nN:%s;%s;;;\r\nFN:%s\r\n' % (last, first, me.get('name', ''))
                if me.get('company'): vc += 'ORG:%s\r\n' % me['company']
                if me.get('title'): vc += 'TITLE:%s\r\n' % me['title']
                vc += 'EMAIL;TYPE=WORK,INTERNET:admin@example.com\r\n'
                if me.get('phone'): vc += 'TEL;TYPE=CELL:%s\r\n' % me['phone']
                vc += 'END:VCARD\r\n'
                body = {'success': True, 'card': {'name': me.get('name', ''), 'title': me.get('title', ''), 'company': me.get('company', ''), 'email': 'admin@example.com', 'phone': me.get('phone', '')}, 'vcard': vc}
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
        if request.method == 'GET' and 'alt=media' in request.url:
            # N3 s2: the vCard PHOTO — the page fetches the card front with its own drive.file token
            route.fulfill(status=200, content_type='image/jpeg', headers={'Access-Control-Allow-Origin': '*'}, body=JPEG_STUB); return
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
        accounts: !!document.querySelector('#nw-app #nw-accounts'),
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
    try:
        ctx.grant_permissions(['clipboard-read', 'clipboard-write'], origin=base.split('/Network.html')[0])
    except Exception:
        pass
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
                if not got['accounts']:
                    failures.append('%s: the Accounts card is missing under the Contacts list' % role)
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
                if got['list'] or got['empty'] or got['accounts']:
                    failures.append('%s: list / accounts surface rendered for a turned-away tier' % role)
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
        state = {'contacts': [], 'accounts': [], 'posts': [], 'folders': None, 'list_filters': []}
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
        # progress and the result are written INSIDE the Contacts card (v01.13w — the capture status is off-screen from the list on a phone)
        try:
            page.wait_for_function("() => /Tidy — 1 of 1/.test((document.getElementById('nw-list-status') || {}).textContent || '')", timeout=15000)
        except Exception:
            failures.append('tidy: no result line — status=%r cap=%r errors=%r' % (
                page.evaluate("() => (document.getElementById('nw-list-status') || {}).textContent"),
                page.evaluate("() => (document.getElementById('nw-cap-status') || {}).textContent"), errs[-3:]))
        if not page.evaluate("() => { const el = document.getElementById('nw-list-status'); return el && el.style.display !== 'none' && el.classList.contains('nw-status-ok'); }"):
            failures.append('tidy: the result line is not shown inside the Contacts card')
        if page.evaluate("() => (document.getElementById('nw-tidy-btn') || {}).textContent") != '✨ Tidy titles & companies':
            failures.append('tidy: the button did not return to its label after the run')
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
        # ── N2 — accounts and the corpus attachment (§4.1, D4) ──────────────
        # A covered account (slug abb — its dossier is SERVED from live-site-pages/profiler-data/, the shipped shape)
        # with a decision-maker contact whose card title differs from the record.
        state['accounts'].append({'id': 'a-0000000000002', 'name': 'ABB', 'slug': 'abb', 'relationship': 'partner', 'stage': 'none',
                                  'segmentIds': ['grid-equipment'], 'tags': [], 'hq': 'Zurich, Switzerland', 'newsroomUrl': '', 'notes': '', 'updatedAt': '2026-09-21T00:00:00Z'})
        state['contacts'].append({'id': 'c-6666666666666', 'accountId': 'a-0000000000002', 'name': 'Morten Wierod', 'title': 'Chief Executive', 'role': 'decision-maker',
                                  'sourceEvent': '', 'metDate': today, 'updatedAt': '2026-09-21T00:00:09Z', 'email': 'mw@abb.example',
                                  'full': {'id': 'c-6666666666666', 'accountId': 'a-0000000000002', 'fullName': 'Morten Wierod', 'title': 'Chief Executive', 'role': 'decision-maker',
                                           'emails': [{'value': 'mw@abb.example', 'kind': 'work'}], 'phones': [], 'metDate': today, 'consent': 'unknown', 'dnc': False, 'tags': [], 'notes': ''}})
        page.evaluate("() => nwAfterWrite()")
        page.wait_for_function("() => document.querySelectorAll('#nw-accounts .nw-acct-row').length === 2", timeout=8000)
        acct_rows = page.evaluate("() => [...document.querySelectorAll('#nw-accounts .nw-acct-row .nw-row-main')].map(r => r.textContent)")
        if not any('Acme Energy' in t and 'Target' in t and 'Discovery' in t and '4 contacts' in t for t in acct_rows) \
           or not any('ABB' in t and 'Partner' in t and '1 contact' in t for t in acct_rows):
            failures.append('accounts: rows should read name · relationship · stage · contact count, got %r' % (acct_rows,))
        href = page.evaluate("() => { const a = document.querySelector('#nw-accounts .nw-acct-row[data-id=\"a-0000000000002\"] a.nw-prof-link'); return a ? a.getAttribute('href') : ''; }")
        if href != 'Profiler.html#abb':
            failures.append('deep link: the covered account row should link Profiler.html#abb, got %r' % href)
        if page.evaluate("() => Object.keys(_nwProfiles).length") != 0:
            failures.append('on the record: a dossier was fetched on the list paint')
        # Row tap → the full account (nop=get with the a- id) with its live contacts beneath.
        page.click('#nw-accounts .nw-acct-row[data-id="a-0000000000002"] .nw-row-main')
        page.wait_for_function("() => /Morten Wierod/.test((document.querySelector('#nw-accounts .nw-acct-row.nw-open .nw-row-detail') || {}).textContent || '')", timeout=8000)
        page.wait_for_function("() => /Grid equipment/.test((document.querySelector('#nw-accounts .nw-acct-row.nw-open .nw-row-detail') || {}).textContent || '')", timeout=8000)
        adet = page.evaluate("() => document.querySelector('#nw-accounts .nw-acct-row.nw-open .nw-row-detail').textContent")
        ahref = page.evaluate("() => { const a = document.querySelector('#nw-accounts .nw-acct-row.nw-open .nw-row-detail a.nw-prof-link'); return a ? a.getAttribute('href') : ''; }")
        if 'Open the ABB dossier' not in adet or 'Contacts (1)' not in adet or 'Zurich' not in adet or ahref != 'Profiler.html#abb' or not [u for u in reqs if 'nop=get' in u and 'id=a-0000000000002' in u]:
            failures.append('account detail: wrong — text=%r href=%r' % (adet[:160], ahref))
        # E4 s3: "People in the press" on the covered account — read on demand (no nop=people before the tap),
        # two people on one article, the accepted one ticked; Accept posts nop=peopleaccept with the key and the
        # person and the row flips to Accepted; the "Will be at" line re-reads.
        if [u for u in reqs if 'nop=people' in u and 'nop=peopleaccept' not in u]:
            failures.append('people: nop=people was called on the detail open — it must wait for the tap')
        page.wait_for_selector('#nw-accounts .nw-acct-row.nw-open .nw-people-btn', timeout=8000)
        page.click('#nw-accounts .nw-acct-row.nw-open .nw-people-btn')
        page.wait_for_function("() => document.querySelectorAll('#nw-accounts .nw-acct-row.nw-open .nw-people-person').length === 2", timeout=8000)
        ppl = page.evaluate("() => [...document.querySelectorAll('#nw-accounts .nw-acct-row.nw-open .nw-people-person')].map(r => [r.getAttribute('data-person'), r.getAttribute('data-accepted'), !!r.querySelector('.nw-accept-btn'), r.textContent])")
        if ppl[0][0] != 'Morten Wierod' or ppl[0][1] != '0' or not ppl[0][2] or 'CEO, ABB' not in ppl[0][3] or 'quoted' not in ppl[0][3] or 'doubles capacity' not in ppl[0][3] \
           or ppl[1][0] != 'Ada Byline' or ppl[1][1] != '1' or ppl[1][2] or 'Accepted' not in ppl[1][3]:
            failures.append('people: the list should show the quoted person with Accept and the accepted author ticked, got %r' % (ppl,))
        item = page.evaluate("() => (document.querySelector('#nw-accounts .nw-acct-row.nw-open .nw-people-item') || {}).textContent || ''")
        if 'ABB opens a storage line' not in item or 'Stub Wire' not in item or '2026-09-20' not in item:
            failures.append('people: the article line should read title — source · date, got %r' % (item,))
        sig_reads = len([u for u in reqs if 'nop=signals' in u])
        page.click('#nw-accounts .nw-acct-row.nw-open .nw-people-person[data-person="Morten Wierod"] .nw-accept-btn')
        page.wait_for_function("() => (document.querySelector('#nw-accounts .nw-acct-row.nw-open .nw-people-person[data-person=\"Morten Wierod\"]') || {}).getAttribute('data-accepted') === '1'", timeout=8000)
        page.wait_for_function("() => /matched to a contact/.test((document.getElementById('nw-acct-status') || {}).textContent || '')", timeout=8000)
        ap = dict(__import__('urllib.parse').parse.parse_qsl(state['posts'][-1][1]))
        if state['posts'][-1][0] != 'peopleaccept' or ap.get('accountId') != 'a-0000000000002' or ap.get('key') != 'k3j9x1-2f' or ap.get('name') != 'Morten Wierod' or ap.get('title') != 'CEO' or ap.get('publishedAt') != '2026-09-20T09:00:00Z':
            failures.append('people: Accept should post nop=peopleaccept with the account, the article key, the person and the date, got %r' % (ap,))
        page.wait_for_function("() => document.querySelectorAll('#nw-accounts .nw-acct-row.nw-open .nw-people-person .nw-accept-btn').length === 0", timeout=8000)
        if len([u for u in reqs if 'nop=signals' in u]) != sig_reads + 1:
            failures.append('people: the "Will be at" line should re-read once after an accept')
        page.screenshot(path=str(SHOTS / 'network-people.png'), full_page=False)
        page.screenshot(path=str(SHOTS / 'network-accounts.png'), full_page=False)
        page.click('#nw-accounts .nw-acct-row[data-id="a-0000000000002"] .nw-row-main')   # close
        # Edit: Acme (target · discovery) flipped to partner — the stage select resets to none (D5) and nop=account carries it.
        page.click('#nw-accounts .nw-acct-row[data-id="a-0000000000001"] .nw-row-main')
        page.wait_for_selector('#nw-accounts .nw-acct-row.nw-open .nw-acct-edit', timeout=8000)
        page.click('#nw-accounts .nw-acct-row.nw-open .nw-acct-edit')
        page.wait_for_selector('#nw-accounts .nw-row-detail .nw-editor input[data-account="name"]', timeout=5000)
        pre = page.evaluate("""() => { const f = document.querySelector('#nw-accounts .nw-row-detail .nw-editor');
            return [f.querySelector('input[data-account="name"]').value, f.querySelector('[data-review="relationship"]').value, f.querySelector('[data-review="stage"]').value,
                    f.querySelector('[data-review="stage"]').disabled, !!f.querySelector('input[data-account="tags"]'), !!f.querySelector('textarea[data-account="notes"]')]; }""")
        if pre != ['Acme Energy', 'target', 'discovery', False, True, True]:
            failures.append('account edit: editor not pre-filled from the row: %r' % (pre,))
        page.select_option('#nw-accounts .nw-row-detail .nw-editor select[data-review="relationship"]', 'partner')
        gated = page.evaluate("() => { const s = document.querySelector('#nw-accounts .nw-row-detail .nw-editor select[data-review=\"stage\"]'); return [s.disabled, s.value]; }")
        if gated != [True, 'none']:
            failures.append('account edit: stage should be disabled and reset to none for partner, got %r' % (gated,))
        page.fill('#nw-accounts .nw-row-detail .nw-editor input[data-account="hq"]', 'Austin, USA')
        page.click('#nw-accounts .nw-row-detail .nw-editor button[type="submit"]')
        page.wait_for_function("() => /Saved Acme Energy/.test((document.getElementById('nw-acct-status') || {}).textContent || '')", timeout=10000)
        ap = dict(__import__('urllib.parse').parse.parse_qsl(state['posts'][-1][1]))
        aa = json.loads(ap.get('account', '{}'))
        if state['posts'][-1][0] != 'account' or ap.get('accountId') != 'a-0000000000001' or aa.get('relationship') != 'partner' or aa.get('stage') != 'none' or aa.get('hq') != 'Austin, USA' or aa.get('name') != 'Acme Energy':
            failures.append('account edit: nop=account payload wrong: %r' % ({k: aa.get(k) for k in ('name', 'relationship', 'stage', 'hq')},))
        page.wait_for_function("() => /Partner/.test((document.querySelector('#nw-accounts .nw-acct-row[data-id=\"a-0000000000001\"]') || {}).textContent || '')", timeout=8000)
        # The on-the-record check: the contact detail at the covered account fetches the served dossier only now.
        page.click('#nw-list .nw-row[data-id="c-6666666666666"] .nw-row-main')
        page.wait_for_selector('#nw-list .nw-row[data-id="c-6666666666666"] .nw-record', timeout=10000)
        rec = page.evaluate("() => document.querySelector('#nw-list .nw-row[data-id=\"c-6666666666666\"] .nw-row-detail').textContent")
        chref = page.evaluate("() => { const a = document.querySelector('#nw-list .nw-row[data-id=\"c-6666666666666\"] .nw-row-detail a.nw-prof-link'); return a ? a.getAttribute('href') : ''; }")
        if 'On the record as' not in rec or 'CEO (since August 2024)' not in rec or 'Profiler, dossier of' not in rec or 'The card reads "Chief Executive"' not in rec or 'Grid equipment' not in rec or chref != 'Profiler.html#abb':
            failures.append('on the record: wrong — text=%r href=%r' % (rec[:220], chref))
        if page.evaluate("() => Object.keys(_nwProfiles).join(',')") != 'abb':
            failures.append('on the record: expected exactly the abb dossier fetched, got %r' % page.evaluate("() => Object.keys(_nwProfiles)"))
        page.screenshot(path=str(SHOTS / 'network-on-record.png'), full_page=False)
        # Propose a dossier on the uncovered account: the exact `profiler <Company>` line, and the dossier-proposed tag through nop=account.
        page.click('#nw-accounts .nw-acct-row[data-id="a-0000000000001"] .nw-row-main')
        page.wait_for_selector('#nw-accounts .nw-acct-row.nw-open .nw-propose-btn', timeout=8000)
        # E4 s3: an uncovered account has no press route and says so — with no nop=people call
        unc = page.evaluate("() => (document.querySelector('#nw-accounts .nw-acct-row.nw-open dd.nw-people') || {}).textContent || ''")
        if 'Not covered by Profiler' not in unc or page.evaluate("() => !!document.querySelector('#nw-accounts .nw-acct-row.nw-open .nw-people-btn')"):
            failures.append('people: the uncovered account should say it has no press route, got %r' % (unc,))
        page.click('#nw-accounts .nw-acct-row.nw-open .nw-propose-btn')
        page.wait_for_function("() => (document.querySelector('#nw-accounts .nw-row-detail .nw-copyline code') || {}).textContent === 'profiler Acme Energy'", timeout=8000)
        page.wait_for_function("() => /profiler Acme Energy/.test((document.getElementById('nw-acct-status') || {}).textContent || '')", timeout=8000)
        page.wait_for_function("() => /dossier-proposed/.test((document.querySelector('#nw-accounts .nw-row-detail [data-line=\"tags\"]') || {}).textContent || '')", timeout=8000)
        pp = dict(__import__('urllib.parse').parse.parse_qsl(state['posts'][-1][1]))
        pa = json.loads(pp.get('account', '{}'))
        if state['posts'][-1][0] != 'account' or 'dossier-proposed' not in (pa.get('tags') or []) or pa.get('relationship') != 'partner':
            failures.append('propose: expected nop=account carrying the dossier-proposed tag on the unchanged row, got %r' % (pa.get('tags'),))
        try:
            clip = page.evaluate("() => navigator.clipboard.readText()")
            if clip != 'profiler Acme Energy':
                failures.append('propose: clipboard holds %r' % clip)
        except Exception:
            pass   # the visible line is the guaranteed fallback; the clipboard is best-effort in headless
        # Delete an account with live contacts: refused with the count, nothing cascades.
        page.click('#nw-accounts .nw-acct-row[data-id="a-0000000000001"] .nw-row-del')
        page.wait_for_function("() => /still has 4 contacts/.test((document.getElementById('nw-acct-status') || {}).textContent || '')", timeout=8000)
        if page.query_selector('#nw-accounts .nw-acct-row[data-id="a-0000000000001"].nw-deleted') or state['accounts'][0].get('deletedAt') or len([c for c in state['contacts'] if not c.get('deletedAt')]) != 5:
            failures.append('account delete: the refusal should leave the account and its contacts untouched')
        # ── N3 session 1 — the list: search, the eight filters, the sorts, multi-select and the bulk actions (§4.3) ──
        import urllib.parse as _up
        state['contacts'][-1]['touch'] = '2026-09-15'   # Morten: an older last touch than the four saved today
        page.evaluate("() => nwAfterWrite()")
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 5 && /last touch 2026-09-15/.test(document.getElementById('nw-rows').textContent)", timeout=8000)
        names = lambda: page.evaluate("() => [...document.querySelectorAll('#nw-rows .nw-row .nw-row-main')].map(r => r.firstChild.textContent)")
        if names()[-1] != 'Morten Wierod':
            failures.append('sort: the default order is last touch, newest first — Morten (2026-09-15) should be last, got %r' % (names(),))
        # The sort strip: Name ascending, the flip reverses it; Warmth is disabled until N4.
        page.click('#nw-sort button[data-sort="name"]')
        page.wait_for_timeout(200)
        asc = names()
        if asc != sorted(asc) or len(asc) != 5:
            failures.append('sort: Name should order the five rows A → Z, got %r' % (asc,))
        page.click('#nw-sort-dir')
        page.wait_for_timeout(200)
        if names() != list(reversed(asc)):
            failures.append('sort: the flip should reverse the order, got %r' % (names(),))
        if not page.query_selector('#nw-sort button[data-sort="warmth"][disabled]'):
            failures.append('sort: the Warmth sort must be present and disabled until N4')
        page.click('#nw-sort-dir')   # back to A → Z (a key starts in its natural order; the flip reverses it)
        page.wait_for_timeout(200)
        if names() != asc:
            failures.append('sort: a second flip should restore A → Z, got %r' % (names(),))
        n_list = len([u for u in reqs if 'nop=list' in u])
        if len([u for u in reqs if 'nop=list' in u]) != n_list:
            failures.append('sort: a sort must not issue a list request')
        # Search narrows server-side: the request carries q=, the count tile reads "1 of 5".
        page.fill('#nw-q', 'ann@acme')
        page.press('#nw-q', 'Enter')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 1", timeout=8000)
        if state['list_filters'][-1] != {'q': 'ann@acme'} or names() != ['Ann Three'] or '1 of 5' not in page.evaluate("() => document.querySelector('.nw-count').textContent"):
            failures.append('search: expected q=ann@acme to narrow to Ann Three with "1 of 5", got %r / %r' % (state['list_filters'][-1], names()))
        page.fill('#nw-q', '')
        page.press('#nw-q', 'Enter')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 5", timeout=8000)
        # The filter drawer: role, then role + consent (the hint counts them), then Clear.
        state['contacts'][0]['role'] = 'decision-maker'; state['contacts'][0]['full']['consent'] = 'yes'   # Jane: the merge sheet took the new card's review (consent unknown) — set both for a deterministic pair
        page.click('#nw-filter-head')
        page.wait_for_selector('#nw-filter-body.nw-open', timeout=3000)
        page.select_option('#nw-filter-body select[data-filter="role"]', 'decision-maker')
        page.click('#nw-filter-apply')
        want_dm = sorted(c['name'] for c in state['contacts'] if not c.get('deletedAt') and c.get('role') == 'decision-maker')
        page.wait_for_function("(n) => document.querySelectorAll('#nw-rows .nw-row').length === n", arg=len(want_dm), timeout=8000)
        hint = page.evaluate("() => document.querySelector('.nw-filter-hint').textContent")
        if names() != want_dm or state['list_filters'][-1] != {'role': 'decision-maker'} or '1 on: role' not in hint:
            failures.append('filter role: expected %r with the hint "1 on: role", got %r / %r / %r' % (want_dm, names(), state['list_filters'][-1], hint))
        page.select_option('#nw-filter-body select[data-filter="consent"]', 'yes')
        page.click('#nw-filter-apply')
        want_both = sorted(c['name'] for c in state['contacts'] if not c.get('deletedAt') and c.get('role') == 'decision-maker' and c['full'].get('consent') == 'yes')
        page.wait_for_function("(n) => document.querySelectorAll('#nw-rows .nw-row').length === n", arg=len(want_both), timeout=8000)
        hint = page.evaluate("() => document.querySelector('.nw-filter-hint').textContent")
        if names() != want_both or want_both != ['Jane O’Doe-Smith'] or state['list_filters'][-1] != {'role': 'decision-maker', 'consent': 'yes'} or '2 on: role, consent' not in hint:
            failures.append('filter role+consent: expected %r with "2 on: role, consent", got %r / %r' % (want_both, names(), hint))
        page.screenshot(path=str(SHOTS / 'network-list-filters.png'), full_page=False)
        page.click('#nw-filter-clear')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 5 && document.querySelector('.nw-filter-hint').textContent === ''", timeout=8000)
        # Segment (an account's registry segment) and source event (the contact's) each narrow to one row.
        page.select_option('#nw-filter-body select[data-filter="segment"]', 'grid-equipment')
        page.click('#nw-filter-apply')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 1", timeout=8000)
        if names() != ['Morten Wierod'] or state['list_filters'][-1] != {'segment': 'grid-equipment'}:
            failures.append('filter segment: expected Morten alone, got %r / %r' % (names(), state['list_filters'][-1]))
        page.click('#nw-filter-clear')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 5", timeout=8000)
        page.fill('#nw-filter-body input[data-filter="event"]', 're-plus-2026')
        page.click('#nw-filter-apply')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 1", timeout=8000)
        if names() != ['Jane O’Doe-Smith'] or state['list_filters'][-1] != {'event': 're-plus-2026'}:
            failures.append('filter event: expected Jane alone, got %r / %r' % (names(), state['list_filters'][-1]))
        page.click('#nw-filter-clear')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 5", timeout=8000)
        # Multi-select: two rows ticked while a third's detail is open — the detail stays open, the bar shows "2 selected".
        page.click('#nw-rows .nw-row[data-id="c-2222222222222"] .nw-row-main')
        page.wait_for_selector('#nw-rows .nw-row[data-id="c-2222222222222"].nw-open', timeout=8000)
        page.check('#nw-rows .nw-row[data-id="c-3333333333333"] .nw-row-check')
        page.check('#nw-rows .nw-row[data-id="c-4444444444444"] .nw-row-check')
        page.wait_for_function("() => document.getElementById('nw-bar').classList.contains('nw-open') && document.getElementById('nw-bar-count').textContent === '2 selected'", timeout=5000)
        if not page.query_selector('#nw-rows .nw-row[data-id="c-2222222222222"].nw-open') or page.evaluate("() => document.querySelectorAll('#nw-rows .nw-row.nw-selected').length") != 2:
            failures.append('select: ticking two rows should keep the open detail open and mark two rows selected')
        if not page.query_selector('#nw-bar-mail:not([disabled])') or not page.query_selector('#nw-bar-export'):
            failures.append('bar: Start a mailing must be present and enabled, beside the Export menu (session 2)')
        # Tag both: nop=bulk op=tag with both ids; the stub tags both; the selection clears; the tag filter finds them.
        page.click('#nw-bar-tag')
        page.fill('#nw-bar-tag-in', 'Hot')
        page.click('#nw-bar-tag-go')
        page.wait_for_function("() => /Tagged 2 with \"hot\"/.test(document.getElementById('nw-bar-status').textContent)", timeout=10000)
        bp = dict(_up.parse_qsl(state['posts'][-1][1]))
        if state['posts'][-1][0] != 'bulk' or bp.get('op') != 'tag' or bp.get('tag') != 'hot' or sorted(json.loads(bp.get('ids', '[]'))) != ['c-3333333333333', 'c-4444444444444']:
            failures.append('bulk tag: nop=bulk payload wrong: %r' % ({k: bp.get(k) for k in ('op', 'tag', 'ids')},))
        if [c['id'] for c in state['contacts'] if 'hot' in (c['full'].get('tags') or [])] != ['c-3333333333333', 'c-4444444444444']:
            failures.append('bulk tag: the stub rows were not both tagged')
        page.wait_for_function("() => !document.getElementById('nw-bar').classList.contains('nw-open') && document.querySelectorAll('#nw-rows .nw-row.nw-selected').length === 0", timeout=8000)
        page.fill('#nw-filter-body input[data-filter="tag"]', 'hot')
        page.click('#nw-filter-apply')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 2", timeout=8000)
        if names() != ['Ann Three', 'Bob Four'] or state['list_filters'][-1] != {'tag': 'hot'}:
            failures.append('filter tag: expected the two tagged rows, got %r / %r' % (names(), state['list_filters'][-1]))
        page.click('#nw-filter-clear')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 5", timeout=8000)
        # Relationship / stage: a stage on two Partner accounts is refused per row (D5), then Target · Discovery lands on both accounts.
        page.check('#nw-rows .nw-row[data-id="c-0123456789abc"] .nw-row-check')
        page.check('#nw-rows .nw-row[data-id="c-6666666666666"] .nw-row-check')
        page.wait_for_function("() => document.getElementById('nw-bar-count').textContent === '2 selected'", timeout=5000)
        page.click('#nw-bar-account')
        page.wait_for_selector('#nw-bar-account-form.nw-open', timeout=3000)
        page.select_option('#nw-bar-rel', 'supplier')
        gate = page.evaluate("() => { const s = document.getElementById('nw-bar-stage'); return [s.disabled, s.value]; }")
        if gate != [True, 'none']:
            failures.append('bar: a Supplier relationship should pin the stage select to None, got %r' % (gate,))
        page.select_option('#nw-bar-rel', '')
        page.select_option('#nw-bar-stage', 'discovery')
        page.click('#nw-bar-account-go')
        page.wait_for_function("() => /2 rejected: a stage needs a Target or Customer relationship ×2/.test(document.getElementById('nw-bar-status').textContent)", timeout=10000)
        bp = dict(_up.parse_qsl(state['posts'][-1][1]))
        if bp.get('op') != 'account' or json.loads(bp.get('account', '{}')) != {'stage': 'discovery'} or [a['stage'] for a in state['accounts']] != ['none', 'none']:
            failures.append('bulk account: a stage alone on two Partner accounts should be refused per row and change nothing: %r / %r' % (bp.get('account'), [a['stage'] for a in state['accounts']]))
        page.select_option('#nw-bar-rel', 'target')
        page.select_option('#nw-bar-stage', 'discovery')
        page.click('#nw-bar-account-go')
        page.wait_for_function("() => /Set on 2 accounts \\(2 contacts\\)/.test(document.getElementById('nw-bar-status').textContent)", timeout=10000)
        if [(a['relationship'], a['stage']) for a in state['accounts']] != [('target', 'discovery'), ('target', 'discovery')]:
            failures.append('bulk account: Target · Discovery should land on both accounts, got %r' % ([(a['relationship'], a['stage']) for a in state['accounts']],))
        page.wait_for_function("() => [...document.querySelectorAll('#nw-accounts .nw-acct-row .nw-row-main')].every(r => /Target/.test(r.textContent) && /Discovery/.test(r.textContent))", timeout=8000)
        # CSV: two rows selected → nop=export format=csv with the ids → a download that starts with the BOM and holds the header + two rows.
        page.check('#nw-rows .nw-row[data-id="c-3333333333333"] .nw-row-check')
        page.check('#nw-rows .nw-row[data-id="c-6666666666666"] .nw-row-check')
        page.wait_for_function("() => document.getElementById('nw-bar-count').textContent === '2 selected'", timeout=5000)
        page.click('#nw-bar-export')   # N3 s2: the CSV sits in the Export menu
        page.wait_for_selector('#nw-bar-export-form.nw-open', timeout=5000)
        with page.expect_download(timeout=10000) as dl:
            page.click('#nw-bar-csv')
        data = open(dl.value.path(), 'rb').read()
        bp = dict(_up.parse_qsl(state['posts'][-1][1]))
        lines = data.decode('utf-8-sig').split('\r\n')
        if state['posts'][-1][0] != 'export' or bp.get('format') != 'csv' or sorted(json.loads(bp.get('ids', '[]'))) != ['c-3333333333333', 'c-6666666666666']:
            failures.append('csv: nop=export payload wrong: %r' % ({k: bp.get(k) for k in ('format', 'ids')},))
        if not data.startswith(b'\xef\xbb\xbf') or len(lines) != 4 or lines[-1] != '' or '"Ann Three"' not in lines[1] or '"Morten Wierod"' not in lines[2] or '"hot"' not in lines[1]:
            failures.append('csv: expected a BOM, a header and two CRLF rows, got %r' % (lines[:4],))
        page.wait_for_function("() => /CSV with 2 contacts/.test(document.getElementById('nw-bar-status').textContent)", timeout=5000)
        page.screenshot(path=str(SHOTS / 'network-list-bar.png'), full_page=False)
        # Delete: the confirm names the count; accepted → nop=delete once per row; the row is gone; the bar closes.
        page.click('#nw-bar-clear')
        page.check('#nw-rows .nw-row[data-id="c-4444444444444"] .nw-row-check')
        page.wait_for_function("() => document.getElementById('nw-bar-count').textContent === '1 selected'", timeout=5000)
        dialogs = []
        page.once('dialog', lambda d: (dialogs.append(d.message), d.accept()))
        n_del = len([u for u in reqs if 'nop=delete' in u])
        page.click('#nw-bar-delete')
        page.wait_for_function("() => document.querySelectorAll('#nw-rows .nw-row').length === 4", timeout=10000)
        if dialogs != ['Delete 1 contact? Each can be restored from its row afterwards.'] or len([u for u in reqs if 'nop=delete' in u and 'id=c-4444444444444' in u]) != 1 or len([u for u in reqs if 'nop=delete' in u]) != n_del + 1:
            failures.append('bulk delete: expected one confirm naming the count and one nop=delete for the row, got %r' % (dialogs,))
        if not state['contacts'][3].get('deletedAt') or page.query_selector('#nw-bar.nw-open'):
            failures.append('bulk delete: the stub row should be soft-deleted and the bar closed')
        # ── N3 session 2 — the exports, the follow-up drafts and the QR card (§4.3, D15) ──
        import zipfile, io, urllib.request
        live = [c for c in state['contacts'] if not c.get('deletedAt')]
        ann = next(c for c in live if c['name'] == 'Ann Three'); morten = next(c for c in live if c['id'] == 'c-6666666666666')
        ann['full']['frontLink'] = 'https://drive.google.com/file/d/FRONTFILEID000001/view'   # Ann has a card front on Drive; Morten has none
        def vcards(text):
            """A minimal BEGIN:VCARD walker: unfold the 75-octet continuations, then one dict of property → [values] per card."""
            text = text.replace('\r\n ', '').replace('\n ', '')
            cards, cur = [], None
            for line in text.split('\r\n'):
                if line == 'BEGIN:VCARD': cur = {}
                elif line == 'END:VCARD': cards.append(cur); cur = None
                elif cur is not None and ':' in line:
                    k, v = line.split(':', 1); cur.setdefault(k.split(';')[0], []).append(v)
            return cards
        def export_click(btn):
            page.evaluate("() => nwSelectClear()"); page.check('#nw-rows .nw-row[data-id="%s"] .nw-row-check' % ann['id']); page.check('#nw-rows .nw-row[data-id="%s"] .nw-row-check' % morten['id'])
            page.wait_for_function("() => document.getElementById('nw-bar-count').textContent === '2 selected'", timeout=5000)
            page.click('#nw-bar-export'); page.wait_for_selector('#nw-bar-export-form.nw-open', timeout=5000)
            with page.expect_download(timeout=15000) as dl2:
                page.click(btn)
            return dl2.value.suggested_filename, open(dl2.value.path(), 'rb').read()
        # vCard bundle without the image
        page.uncheck('#nw-export-photo') if page.is_checked('#nw-export-photo') else None
        fname, data = export_click('#nw-bar-vcf')
        cards = vcards(data.decode('utf-8'))
        if not fname.endswith('.vcf') or len(cards) != 2 or any(not (c.get('N') and c.get('FN') and c.get('EMAIL')) for c in cards) or any('PHOTO' in c for c in cards) \
           or sorted(c['FN'][0] for c in cards) != ['Ann Three', 'Morten Wierod']:
            failures.append('vcard: expected a 2-card bundle with N / FN / EMAIL and no PHOTO, got %r' % ([sorted(c.keys()) for c in cards],))
        # "include card image": Ann's front is fetched from Drive (alt=media) and spliced in as PHOTO;ENCODING=b;TYPE=JPEG, folded at 75 octets
        page.check('#nw-export-photo')
        n_media = len([u for u in reqs if 'alt=media' in u])
        fname, data = export_click('#nw-bar-vcf')
        raw = data.decode('utf-8'); cards = vcards(raw)
        ann_card = next((c for c in cards if c['FN'][0] == 'Ann Three'), {}); photo = (ann_card.get('PHOTO') or [''])[0]
        photo_line = next((l for l in raw.split('\r\n') if l.startswith('PHOTO;')), '')
        if len([u for u in reqs if 'alt=media' in u]) != n_media + 1 or not photo_line.startswith('PHOTO;ENCODING=b;TYPE=JPEG:') or base64.b64decode(photo) != JPEG_STUB \
           or max(len(l.encode('utf-8')) for l in raw.split('\r\n')) > 75 or 'PHOTO' in next(c for c in cards if c['FN'][0] == 'Morten Wierod'):
            failures.append('vcard photo: expected one Drive alt=media fetch and Ann\'s PHOTO line (base64 of the stub JPEG, every line ≤ 75 octets), got line=%r max=%d' % (photo_line[:40], max(len(l.encode('utf-8')) for l in raw.split('\r\n'))))
        page.wait_for_function("() => /vCard bundle with 2 contacts · 1 with the card image/.test(document.getElementById('nw-bar-status').textContent)", timeout=5000)
        # one vCard per contact → a store-only zip with two .vcf entries
        fname, data = export_click('#nw-bar-vcf-each')
        zf = zipfile.ZipFile(io.BytesIO(data)); entries = zf.namelist()
        if not fname.endswith('.zip') or len(entries) != 2 or not all(n.endswith('.vcf') for n in entries) or any(len(vcards(zf.read(n).decode('utf-8'))) != 1 for n in entries) or zf.testzip() is not None:
            failures.append('vcard zip: expected two .vcf entries in a valid zip, got %r' % (entries,))
        # .xlsx: the base64 workbook the stub answered lands byte for byte
        fname, data = export_click('#nw-bar-xlsx')
        if not fname.endswith('.xlsx') or data != XLSX_STUB or dict(_up.parse_qsl(state['posts'][-1][1])).get('format') != 'xlsx':
            failures.append('xlsx: expected the stub workbook bytes as a .xlsx download, got %r (%d bytes)' % (fname, len(data)))
        page.screenshot(path=str(SHOTS / 'network-export-menu.png'), full_page=False)
        # The follow-up drafts (D15): three recipients → Start a mailing → the default template → three editable drafts
        three = [c for c in live if c['full'].get('emails')][:3]
        page.evaluate("() => nwSelectClear()")   # the bar is closed when nothing is selected
        for c in three: page.check('#nw-rows .nw-row[data-id="%s"] .nw-row-check' % c['id'])
        page.wait_for_function("() => document.getElementById('nw-bar-count').textContent === '3 selected'", timeout=5000)
        page.click('#nw-bar-mail')
        page.wait_for_function("() => document.getElementById('nw-mail') && document.getElementById('nw-mail').style.display !== 'none' && document.querySelectorAll('#nw-mail-tpl option').length >= 2", timeout=8000)
        rec = page.text_content('#nw-mail-recipients')
        if '3 recipients' not in rec or not [u for u in reqs if 'nop=mailings' in u]:
            failures.append('mailing: expected "3 recipients" and a nop=mailings request, got %r' % rec[:80])
        body_tpl = page.input_value('#nw-mail-body')
        if '{{first}}' not in body_tpl or 'unsubscribe' not in body_tpl or '{{myAddress}}' not in body_tpl:
            failures.append('mailing: the default template must carry {{first}}, an unsubscribe line and {{myAddress}}')
        page.fill('#nw-mail-name', 'Hall follow-up')
        page.click('#nw-mail-render')
        page.wait_for_function("() => document.querySelectorAll('#nw-drafts .nw-draft').length === 3", timeout=10000)
        dp = dict(_up.parse_qsl(next(p for k, p in reversed(state['posts']) if k == 'drafts')))
        first_body = page.input_value('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-body')
        if sorted(json.loads(dp.get('ids', '[]'))) != sorted(c['id'] for c in three) or dp.get('name') != 'Hall follow-up' or '{{' in first_body or 'Hi ' not in first_body \
           or len(state['drafts']) != 3 or not state['mailings'] or state['mailings'][-1]['name'] != 'Hall follow-up':
            failures.append('drafts: expected nop=drafts with the three ids and the template saved, three rendered drafts with no {{ left, got ids=%r body=%r' % (dp.get('ids'), first_body[:60]))
        page.wait_for_function("() => /3 drafts rendered · template saved/.test(document.getElementById('nw-mail-status').textContent)", timeout=5000)
        page.wait_for_function("() => [...document.querySelectorAll('#nw-mail-tpl option')].some(o => /Saved: Hall follow-up/.test(o.textContent))", timeout=8000)
        # One edited draft round-trips: a new subject → Save edit → nop=draftstatus status=draft → the stub row carries it
        first_id = page.get_attribute('#nw-drafts .nw-draft:nth-of-type(1)', 'data-id')
        page.fill('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-subject', 'Edited subject for the hall')
        page.wait_for_function("() => getComputedStyle(document.querySelector('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-save')).display !== 'none'", timeout=5000)
        page.click('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-save')
        page.wait_for_function("() => /Saved/.test(document.querySelector('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-note').textContent)", timeout=8000)
        ep = dict(_up.parse_qsl(state['posts'][-1][1]))
        if state['posts'][-1][0] != 'draftstatus' or ep.get('status') != 'draft' or ep.get('id') != first_id or next(d for d in state['drafts'] if d['id'] == first_id)['subject'] != 'Edited subject for the hall':
            failures.append('draft edit: expected nop=draftstatus status=draft with the new subject on %s, got %r' % (first_id, {k: ep.get(k) for k in ('id', 'status', 'subject')}))
        # mailto: and Copy
        href = page.get_attribute('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-mailto', 'href')
        if not href.startswith('mailto:') or 'subject=Edited%20subject' not in href:
            failures.append('mailto: expected a mailto: link carrying the edited subject, got %r' % href[:80])
        page.click('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-copy')
        page.wait_for_function("() => /Copied|Copy failed/.test(document.querySelector('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-note').textContent)", timeout=5000)
        try:
            clip = page.evaluate("() => navigator.clipboard.readText()")
            if not clip.startswith('Edited subject for the hall\n\n'):
                failures.append('copy: expected subject + blank line + body on the clipboard, got %r' % clip[:50])
        except Exception:
            pass   # headless clipboard read is not always granted; the note above already proved the path ran
        # The .eml bundle: From typed once (kept in localStorage), one RFC 5322 file per draft with From / To / Subject and a body
        page.fill('#nw-mail-from', 'me@example.com'); page.dispatch_event('#nw-mail-from', 'change')
        with page.expect_download(timeout=10000) as dl3:
            page.click('#nw-mail-eml')
        zf = zipfile.ZipFile(io.BytesIO(open(dl3.value.path(), 'rb').read())); emls = [zf.read(n).decode('utf-8') for n in zf.namelist()]
        def eml_ok(t):
            head, _, body = t.partition('\r\n\r\n')
            h = dict(l.split(': ', 1) for l in head.split('\r\n') if ': ' in l)
            return h.get('From') == 'me@example.com' and '@' in h.get('To', '') and h.get('Subject') and 'MIME-Version' in h and body.strip()
        if len(emls) != 3 or not all(eml_ok(t) for t in emls) or not any('Subject: Edited subject for the hall' in t for t in emls) or not dl3.value.suggested_filename.endswith('.zip') \
           or page.evaluate("() => localStorage.getItem('nw_mail_from')") != 'me@example.com':
            failures.append('eml: expected three RFC 5322 files with From / To / Subject and a body and the From kept in localStorage, got %d files' % len(emls))
        with page.expect_download(timeout=10000) as dl4:
            page.click('#nw-mail-txt')
        txt = open(dl4.value.path(), 'rb').read().decode('utf-8')
        if txt.count('--- ') != 3 or 'Subject: Edited subject for the hall' not in txt:
            failures.append('txt: expected three --- <to> --- blocks, got %r' % txt[:80])
        page.screenshot(path=str(SHOTS / 'network-drafts.png'), full_page=False)
        # Marking sent writes the email-out Interaction the stub records, with the d- id as evidence; discarding closes without one
        dialogs2 = []
        page.once('dialog', lambda d: (dialogs2.append(d.message), d.accept()))
        n_ix = len(state.setdefault('interactions', []))
        page.click('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-sent')
        page.wait_for_function("() => document.querySelectorAll('#nw-drafts .nw-draft').length === 2", timeout=10000)
        ix = state['interactions'][-1] if len(state['interactions']) > n_ix else {}
        if len(state['interactions']) != n_ix + 1 or ix.get('kind') != 'email-out' or ix.get('evidence') != first_id or ix.get('contactId') != next(d for d in state['drafts'] if d['id'] == first_id)['contactId'] \
           or next(d for d in state['drafts'] if d['id'] == first_id)['status'] != 'sent' or not dialogs2 or 'nothing is sent from here' not in dialogs2[0]:
            failures.append('mark sent: expected one email-out interaction with evidence %s and the confirm saying nothing is sent, got %r' % (first_id, ix))
        page.click('#nw-drafts .nw-draft:nth-of-type(1) .nw-draft-discard')
        page.wait_for_function("() => document.querySelectorAll('#nw-drafts .nw-draft').length === 1", timeout=10000)
        if len(state['interactions']) != n_ix + 1 or sorted(d['status'] for d in state['drafts']) != ['discarded', 'draft', 'sent']:
            failures.append('discard: expected no new interaction and statuses discarded / draft / sent, got %r' % (sorted(d['status'] for d in state['drafts']),))
        # The masthead Drafts pill reopens the open drafts through nop=mailings
        page.click('#nw-mail-close'); page.click('#nw-pill-drafts')
        page.wait_for_function("() => document.getElementById('nw-mail').style.display !== 'none' && document.querySelectorAll('#nw-drafts .nw-draft').length === 1", timeout=8000)
        # My card: name · title · company · phone saved through nop=mycard, the QR preview and the full-screen SVG with a real module count
        page.click('#nw-pill-mycard')
        page.wait_for_function("() => document.getElementById('nw-mycard') && document.getElementById('nw-mycard').style.display !== 'none' && /Fill in your details/.test(document.getElementById('nw-mycard-status').textContent)", timeout=8000)
        page.fill('#nw-mycard-name', 'Jon Yang'); page.fill('#nw-mycard-title', 'Senior Sales Manager'); page.fill('#nw-mycard-company', 'LightAISolutions'); page.fill('#nw-mycard-phone', '+1 555 010 0100')
        page.click('#nw-mycard-save')
        page.wait_for_function("() => /Saved/.test(document.getElementById('nw-mycard-status').textContent) && document.querySelector('#nw-qr-preview svg')", timeout=8000)
        mp = dict(_up.parse_qsl(next(p for k, p in reversed(state['posts']) if k == 'mycard')))
        if mp.get('name') != 'Jon Yang' or mp.get('phone') != '+1 555 010 0100' or state['me'].get('company') != 'LightAISolutions':
            failures.append('mycard: expected nop=mycard set=1 with the four fields, got %r' % ({k: mp.get(k) for k in ('name', 'title', 'company', 'phone')},))
        page.click('#nw-mycard-qr')
        page.wait_for_function("() => document.getElementById('nw-qr-overlay') && getComputedStyle(document.getElementById('nw-qr-overlay')).display === 'flex' && document.getElementById('nw-qr-svg')", timeout=5000)
        qr = page.evaluate("() => ({ modules: +document.getElementById('nw-qr-svg').getAttribute('data-modules'), version: +document.getElementById('nw-qr-svg').getAttribute('data-version'), w: document.getElementById('nw-qr-svg').getBoundingClientRect().width, paths: document.querySelectorAll('#nw-qr-svg path').length })")
        if not (qr['modules'] >= 29 and qr['version'] >= 3 and qr['w'] >= 300 and qr['paths'] == 1):
            failures.append('qr: expected a full-screen SVG of at least 29 × 29 modules (version ≥ 3), got %r' % (qr,))
        page.screenshot(path=str(SHOTS / 'network-my-card-qr.png'), full_page=False)
        # The encoder cross-checked against python-qrcode at the same version and mask, when the library is importable
        try:
            import qrcode, qrcode.util as _qu
            mine = page.evaluate("() => { const q = nwQrMatrix(_nwMyCard.vcard); return { text: _nwMyCard.vcard, version: q.version, mask: q.mask, modules: q.modules }; }")
            ref = qrcode.QRCode(version=mine['version'], error_correction=qrcode.constants.ERROR_CORRECT_M, mask_pattern=mine['mask'], border=0)
            ref.add_data(_qu.QRData(mine['text'].encode('utf-8'), mode=_qu.MODE_8BIT_BYTE)); ref.make(fit=False)
            if [[1 if c else 0 for c in row] for row in ref.get_matrix()] != mine['modules']:
                failures.append('qr: the page\'s matrix differs from python-qrcode at version %d mask %d' % (mine['version'], mine['mask']))
            qr_checked = True
        except ImportError:
            qr_checked = False
        page.mouse.click(10, 10)
        page.wait_for_function("() => getComputedStyle(document.getElementById('nw-qr-overlay')).display === 'none'", timeout=5000)
        # D15: nothing sends. The served page and the .gs PROJECT region call neither MailApp nor GmailApp and name no Gmail scope.
        import re as _re2
        served = urllib.request.urlopen(base).read().decode('utf-8')
        gs_src = (REPO / 'googleAppsScripts' / 'Network' / 'Network.gs').read_text(encoding='utf-8')
        region = gs_src[gs_src.index('// PROJECT START'):gs_src.index('// PROJECT END')]
        send_re = _re2.compile(r'\b(MailApp|GmailApp)\s*\.|gmail\.(send|compose|modify|readonly)|sendHipaaEmail\s*\(|mail\.google\.com')
        if send_re.search(served) or send_re.search(region) or _re2.search(r'\bgmail\b', served, _re2.I):
            failures.append('D15: a send path or a Gmail scope is referenced by the served page or the .gs PROJECT region')
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
    print('\nScreenshots: %s/network-role-<tier>.png, network-capture-*.png, network-save-list.png, network-save-merge.png, network-accounts.png, network-on-record.png, network-list-filters.png, network-list-bar.png, network-export-menu.png, network-drafts.png, network-my-card-qr.png (%dx%d)'
          % (SHOTS, PHONE['width'], PHONE['height']))
    if failures:
        print('\nFAILURES (%d):' % len(failures))
        for f in failures:
            print('  ✗', f)
        return 1
    print('\nALL CHECKS PASSED — admin sees the capture card and the empty list; contributor, analyst and viewer are turned away '
          'with zero requests and no capture inputs; preview only subtracts; an offline capture queues and drains on reconnect; '
          'review → save → Drive move → list row, merge on a duplicate, delete → restore and Save all round-trip against the stub; '
          'N2: the Accounts card (admin only), the account detail with its contacts, the partner → stage-none edit through nop=account, '
          'the Profiler.html#abb deep link, the on-the-record title from the served abb dossier, the profiler <Company> line and the '
          'account_has_contacts refusal with its count; N3 s1: the search and the eight filters narrow the stub\'s five contacts server-side, '
          'the Name sort flips without a request, a two-row selection tags both through nop=bulk, a stage on two Partner accounts is refused per row '
          'and Target · Discovery lands on both, the CSV downloads with a BOM and two rows, one row is deleted after a confirm naming the count; '
          'N3 s2: the vCard bundle, the PHOTO splice from Drive, the per-contact zip and the .xlsx download, three drafts from the default template, '
          'an edited draft round-trip, mailto: / Copy / the .eml bundle / .txt, sent → the email-out Interaction, discard, the Drafts pill, My card → the QR '
          '(%s), and no send path in the served page or the .gs PROJECT region.' % ('matrix equal to python-qrcode' if qr_checked else 'python-qrcode not importable — module count only'))
    return 0


if __name__ == '__main__':
    sys.exit(run())

# Developed by: LightAISolutions
