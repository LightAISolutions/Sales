#!/usr/bin/env node
// B — the bridge between Network.gs and Events.gs, proved offline.
//
// NETWORK-EVENTS-DESIGN-PLAN.md §8's B row makes this the done-when: "the
// harness proves every unauthorised case returns flat `denied` with zero
// upstream calls". The REAL peer functions are lifted out of the two .gs
// files and run in two isolated VM contexts (the check-guidance-migration.js
// idiom) with stubbed PropertiesService, SpreadsheetApp, UrlFetchApp,
// Utilities and Session — one Script Property store and one in-memory
// spreadsheet each. For EACH far side it asserts the six token-boundary cases
// (property unset · wrong token · `t` absent · `t` empty · sub-16 property ·
// unknown op) answer a flat { success:false, error:'denied' } with ZERO
// SpreadsheetApp.openById calls and ZERO UrlFetchApp calls; that a correct
// token reaches the op; and for each NEAR side that a sub-16 property answers
// not_configured, an HTML body at HTTP 200 maps to upstream_not_json with a
// snippet, a non-200 to upstream_http_<code>, and a throw to
// upstream_unreachable. Then the ops themselves against the in-memory tabs
// and the real committed registry. Zero live calls.
//
// Usage:  node scripts/check-peer-bridge.js
// Exit:   0 when every assertion holds, 1 on the first that does not.
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = process.argv[2] || path.join(__dirname, '..');
const P = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

function extract(src, name) {
  const m = new RegExp('^function ' + name + '\\(', 'm').exec(src);
  if (!m) throw new Error('missing ' + name);
  let i = src.indexOf('{', m.index), depth = 0, j = i, q = null;
  while (j < src.length) {
    const ch = src[j];
    if (q) { if (ch === '\\') { j += 2; continue; } if (ch === q) q = null; }
    else if (ch === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); if (j < 0) break; continue; }   // a comment may hold an apostrophe
    else if (ch === '/' && src[j + 1] === '*') { j = src.indexOf('*/', j) + 2; continue; }
    else if (ch === '"' || ch === "'") q = ch;
    else if (ch === '{') depth++;
    else if (ch === '}') { if (--depth === 0) return src.slice(m.index, j + 1); }
    j++;
  }
  throw new Error('unbalanced ' + name);
}
function constant(src, name) {
  // Lazy up to the first `;` that ends a line — allowing a trailing // comment,
  // which would otherwise carry the match on to the next statement.
  const m = new RegExp('^var ' + name + ' =[\\s\\S]*?;[ \\t]*(?://[^\\n]*)?$', 'm').exec(src);
  if (!m) throw new Error('missing var ' + name);
  return m[0];
}

// ── An in-memory Sheet with the surface the .gs helpers touch ────────────
function fakeSheet(name) {
  const rows = [];
  const sh = {
    name, rows,
    getLastRow: () => rows.length,
    getLastColumn: () => rows.reduce((w, r) => Math.max(w, r.length), 0),
    appendRow: (r) => { rows.push(r.slice()); },
    setFrozenRows() {}, getFrozenRows: () => 1, insertCheckboxes() {},
    deleteRow: (n) => { rows.splice(n - 1, 1); },
    getRange: (r, c, nr, nc) => ({
      getValues: () => { const out = []; for (let i = 0; i < (nr || 1); i++) { const row = rows[r - 1 + i] || []; const o = []; for (let k = 0; k < (nc || 1); k++) o.push(row[c - 1 + k] === undefined ? '' : row[c - 1 + k]); out.push(o); } return out; },
      setValues: (vals) => { vals.forEach((v, i) => { while (rows.length < r + i) rows.push([]); const row = rows[r - 1 + i]; v.forEach((x, k) => { row[c - 1 + k] = x; }); }); },
      setValue: (v) => { while (rows.length < r) rows.push([]); rows[r - 1][c - 1] = v; }
    })
  };
  return sh;
}
function fakeSpreadsheet() {
  const sheets = {};
  return { sheets,
    getSheetByName: (n) => sheets[n] || null,
    insertSheet: (n) => { sheets[n] = fakeSheet(n); return sheets[n]; } };
}

// ── A context: one property store, one spreadsheet, counted upstream calls ─
function makeCtx(props) {
  const ss = fakeSpreadsheet();
  const counters = { openById: 0, fetch: 0, audit: [] };
  let fetchImpl = () => { throw new Error('offline'); };
  const ctx = {
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null),
      setProperty: (k, v) => { props[k] = String(v); } }) },
    SpreadsheetApp: { openById: () => { counters.openById++; return ss; } },
    UrlFetchApp: { fetch: (url, opts) => { counters.fetch++; return fetchImpl(url, opts); } },
    Utilities: { formatDate: (d, tz, fmt) => {
      if (fmt !== 'yyyy-MM-dd') throw new Error('stub: only yyyy-MM-dd');
      return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d);
    } },
    Session: { getScriptTimeZone: () => 'America/New_York' },
    CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) },
    Logger: { log() {} },
    // The template helpers the peer code calls: audited but never asserted on
    // content beyond "ids and counts only" (check-network-schema.py owns that).
    auditLog: (ev, user, op, details) => { counters.audit.push({ ev, op, details }); },
    bumpDataRev() {},
    console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN,
    encodeURIComponent, Intl
  };
  ctx.__ss = ss; ctx.__counters = counters;
  ctx.__setFetch = (fn) => { fetchImpl = fn; };
  vm.createContext(ctx);
  return ctx;
}
function resp(code, text) { return { getResponseCode: () => code, getContentText: () => text }; }

let failures = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.log('  FAIL  ' + msg); } }
function flatDenied(r) { return !!r && r.success === false && r.error === 'denied' && Object.keys(r).length === 2; }

// ── Network context ───────────────────────────────────────────────────────
const nwSrc = P('googleAppsScripts/Network/Network.gs');
const nwProps = {};
const NW = makeCtx(nwProps);
vm.runInContext([
  'NW_RELATIONSHIPS', 'NW_STAGES', 'NW_SIGNAL_KINDS', 'NW_ID_RE', 'NW_ID_PREFIXES', 'NW_TABS',
  'NW_PEER_TOKEN_PROP', 'NW_EVENTS_TOKEN_PROP', 'EVENTS_PEER_EXEC', 'NW_PEER_RELATIONSHIPS', 'NW_PEER_SLUG_RE',
  'NW_CORPUS_KEY_RE'   // E4 s3: the write leg's corpus: branch reads it
].map((n) => constant(nwSrc, n)).join('\n') + '\nvar SPREADSHEET_ID = "stub";\n' + [
  'ensureNetworkTabs_', 'nwListRows_', 'nwSheetRead_', 'nwRowObj_', 'nwFindRow_', 'nwOwned_', 'nwWriteRow_', 'nwArr_',
  'nwStr_', 'nwNow_', 'nwNewId_', 'nwRandomBase36_',
  'nwPeerAuthorised_', 'nwHandlePeer_', 'nwPeerOwner_', 'nwPeerAccounts_', 'nwPeerSignals_', 'nwPeerJsonBody_',
  'nwPeerSignalsRead_', 'nwPeerLinkedIn_', 'nwPeerSignalsWrite_', 'nwSignalKey_', 'nwNameKey_'   /* E4 s3: the upsert key helper and the name key it uses for press-quote rows */, 'nwEventsProxy_'
].map((n) => extract(nwSrc, n)).join('\n'), NW, { filename: 'Network.peer.js' });

// ── Events context ────────────────────────────────────────────────────────
const evSrc = P('googleAppsScripts/Events/Events.gs');
const evProps = {};
const EV = makeCtx(evProps);
vm.runInContext(
  'var EMBED_PAGE_URL = "https://lightaisolutions.github.io/Sales/Events.html";\nvar SPREADSHEET_ID = "stub";\n' + [
    'EV_TABS', 'EV_ID_RE', 'EV_PEER_TOKEN_PROP', 'EV_NETWORK_TOKEN_PROP', 'NETWORK_PEER_EXEC', 'EV_REGISTRY_URL',
    '_evRegistryCache', 'EV_ACCOUNT_ID_RE'
  ].map((n) => constant(evSrc, n)).join('\n') + '\n' + [
    'ensureEventsTabs_', 'evListRows_', 'evNewId_', 'evRandomBase36_',
    'evPeerAuthorised_', 'evHandlePeer_', 'evPeerOwner_', 'evRegistry_', 'evTodayIn_', 'evPeerToday_', 'evPeerSignals_',
    'evNetworkProxy_'
  ].map((n) => extract(evSrc, n)).join('\n'), EV, { filename: 'Events.peer.js' });

// The id helpers hash a UUID; give both contexts the same entropy surface.
const crypto = require('crypto');
for (const C of [NW, EV]) {
  C.Utilities.getUuid = () => crypto.randomUUID();
  C.Utilities.DigestAlgorithm = { SHA_256: 'sha256' };
  C.Utilities.computeDigest = (alg, s) => Array.from(crypto.createHash('sha256').update(String(s)).digest()).map((b) => (b > 127 ? b - 256 : b));
}
vm.runInContext(constant(evSrc, 'EV_ID_PREFIXES'), EV);
// The calendar is pinned so the today/starred split is the same on every run;
// the zone is still resolved through Intl so a bad IANA name would throw.
const FIXED_TODAY = '2026-09-22';
EV.Utilities.formatDate = (d, tz) => { new Intl.DateTimeFormat('en-CA', { timeZone: tz }); return FIXED_TODAY; };

const TOKEN = 'k7Qp2mX9vL4sD8wR1nB6yH3tZ0cF5jG8';   // 32 chars, test-only
function param(obj) { return { parameter: obj }; }

// ── 1. The six token-boundary cases, each far side ────────────────────────
function boundary(label, C, handler, prop, opKey) {
  const c = C.__counters; const before = { o: c.openById, f: c.fetch };
  const run = (e) => vm.runInContext(handler, C)(e);
  delete C.__props[prop];
  const cases = [
    ['property unset', param({ [opKey]: 'accounts', t: TOKEN })],
  ];
  ok(flatDenied(run(cases[0][1])), label + ': ' + cases[0][0]);
  C.__props[prop] = 'short-token';                       // < 16 characters
  ok(flatDenied(run(param({ [opKey]: 'accounts', t: 'short-token' }))), label + ': sub-16 property (even with a matching t)');
  C.__props[prop] = TOKEN + '\n';                        // pasted with a trailing newline — trimmed
  ok(flatDenied(run(param({ [opKey]: 'accounts', t: 'wrong-' + TOKEN }))), label + ': wrong token');
  ok(flatDenied(run(param({ [opKey]: 'accounts' }))), label + ': t absent');
  ok(flatDenied(run(param({ [opKey]: 'accounts', t: '' }))), label + ': t empty');
  ok(flatDenied(run(param({ [opKey]: 'nosuchop', t: TOKEN }))), label + ': unknown op with the right token');
  ok(flatDenied(run({})), label + ': no parameters at all');
  ok(c.openById === before.o, label + ': zero SpreadsheetApp.openById across the boundary cases (saw ' + (c.openById - before.o) + ')');
  ok(c.fetch === before.f, label + ': zero UrlFetchApp.fetch across the boundary cases (saw ' + (c.fetch - before.f) + ')');
  ok(c.audit.length === 0, label + ': nothing audited on a refusal');
}
NW.__props = nwProps; EV.__props = evProps;
boundary('Network far side', NW, 'nwHandlePeer_', 'NETWORK_PEER_TOKEN', 'nop');
boundary('Events far side', EV, 'evHandlePeer_', 'EVENTS_PEER_TOKEN', 'eop');

// ── 2. Network: a correct token reaches the ops ───────────────────────────
nwProps.NETWORK_PEER_TOKEN = ' ' + TOKEN + '\n';   // whitespace both sides, trimmed on read
const nwPeer = (e) => vm.runInContext('nwHandlePeer_', NW)(e);
let r = nwPeer(param({ nop: 'accounts', t: TOKEN }));
ok(r.success === false && r.error === 'owner_required', 'Network accounts: reaches the op (owner_required, not denied)');
r = nwPeer(param({ nop: 'accounts', t: TOKEN, owner: 'dev@example.com' }));
ok(r.success === true && Array.isArray(r.accounts) && r.accounts.length === 0 && r.built, 'Network accounts: empty spreadsheet answers []');
ok(NW.__counters.openById === 1, 'Network accounts: the tab handle opened once the token matched (openById=1)');
const now = new Date().toISOString();
const acc = NW.__ss.sheets['Accounts'];
const A = (id, owner, name, rel, del) => [id, owner, name, name.toLowerCase(), '', name.toLowerCase(), rel, rel === 'target' ? 'prospecting' : 'none',
  '["storage-developers-and-ipps"]', '["seed"]', 'Austin', '', 'private notes never returned', now, now, del || ''];
acc.appendRow(A('a-0000000000001', 'dev@example.com', 'Acme', 'target'));
acc.appendRow(A('a-0000000000002', 'dev@example.com', 'Bolt', 'supplier'));          // not a scored relationship
acc.appendRow(A('a-0000000000003', 'dev@example.com', 'Gone', 'customer', now));     // soft-deleted
acc.appendRow(A('a-0000000000004', 'other@example.com', 'Theirs', 'partner'));       // another owner
r = nwPeer(param({ nop: 'accounts', t: TOKEN, owner: 'Dev@Example.com' }));
ok(r.success && r.accounts.length === 1 && r.accounts[0].id === 'a-0000000000001', 'Network accounts: only the owner\'s live scored account (' + JSON.stringify(r.accounts.map((a) => a.id)) + ')');
ok(r.accounts[0] && !('owner' in r.accounts[0]) && !('notes' in r.accounts[0]) && !('hq' in r.accounts[0]), 'Network accounts: no owner, notes or HQ on the row');
ok(r.accounts[0] && Array.isArray(r.accounts[0].segments) && r.accounts[0].segments[0] === 'storage-developers-and-ipps' && r.accounts[0].tags[0] === 'seed', 'Network accounts: segments and tags parsed');

// nop=signals — the write leg (JSON body), then the read leg (GET)
const sigBody = { owner: 'dev@example.com', signals: [
  { accountId: 'a-0000000000001', eventSlug: 're-plus-2026', kind: 'exhibitor', evidenceUrl: 'https://www.re-plus.com/exhibitors/acme', confidence: 0.9, firstSeen: '2026-09-01T00:00:00Z' },
  { accountId: 'a-0000000000001', eventSlug: 're-plus-2026', kind: 'speaker', evidenceUrl: 'https://www.linkedin.com/posts/acme-123', confidence: 0.8 },
  { accountId: 'a-0000000000001', eventSlug: 're-plus-2026', kind: 'telepathy', evidenceUrl: 'https://example.com/x', confidence: 0.5 },
  { accountId: 'a-0000000000009', eventSlug: 're-plus-2026', kind: 'exhibitor', evidenceUrl: 'https://example.com/y', confidence: 0.5 },
  { accountId: 'a-0000000000002', eventSlug: 'Bad Slug', kind: 'exhibitor', evidenceUrl: 'https://example.com/z', confidence: 0.5 }
] };
const post = (obj, extra) => ({ parameter: Object.assign({ nop: 'signals', t: TOKEN, owner: 'dev@example.com' }, extra || {}), postData: { contents: JSON.stringify(obj), type: 'application/json' } });
r = nwPeer(post(sigBody));
ok(r.success === true && r.written === 1 && r.updated === 0, 'Network signals write: one row written (' + JSON.stringify(r) + ')');
const reasons = (r.rejected || []).map((x) => x.index + ':' + x.reason).join(',');
ok(reasons === '1:linkedin_not_fetched,2:bad_kind,3:account_not_found,4:bad_slug', 'Network signals write: per-row rejections indexed (' + reasons + ')');
const sig = NW.__ss.sheets['Signals'];
ok(sig.rows.length === 2 && sig.rows[1][13] === 'events' && /^s-[0-9a-z]{13}$/.test(sig.rows[1][0]) && sig.rows[1][9] === '2026-09-01T00:00:00Z', 'Network signals write: Source = events, an s- id, First Seen kept');
r = nwPeer(post(sigBody));
ok(r.success === true && r.written === 0 && r.updated === 1 && sig.rows.length === 2, 'Network signals write: a re-run refreshes Last Seen instead of duplicating');
ok(nwPeer(post({ owner: 'other@example.com', signals: sigBody.signals })).error === 'owner_mismatch', 'Network signals write: body owner must match the query owner');
ok(nwPeer({ parameter: { nop: 'signals', t: TOKEN, owner: 'dev@example.com' }, postData: { contents: '{not json' } }).error === 'bad_json', 'Network signals write: a broken body is bad_json, not a throw');
r = nwPeer(param({ nop: 'signals', t: TOKEN, owner: 'dev@example.com', accountId: 'a-0000000000001' }));
ok(r.success && r.signals.length === 1 && r.signals[0].kind === 'exhibitor' && r.signals[0].source === 'events' && !('personName' in r.signals[0]), 'Network signals read: the one live row for the account, ids and evidence only');
ok(nwPeer(param({ nop: 'signals', t: TOKEN, owner: 'dev@example.com', accountId: 'c-0000000000001' })).error === 'bad_account_id', 'Network signals read: a c- id is refused');
ok(NW.__counters.fetch === 0, 'Network far side: no UrlFetchApp call anywhere (saw ' + NW.__counters.fetch + ')');

// ── 3. Network near side: nwEventsProxy_ ──────────────────────────────────
const nwProxy = (eop, params) => vm.runInContext('nwEventsProxy_', NW)(eop, params);
delete nwProps.EVENTS_PEER_TOKEN;
r = nwProxy('today', { owner: 'dev@example.com' });
ok(r.error === 'not_configured' && NW.__counters.fetch === 0, 'Network near side: property unset → not_configured, no fetch');
nwProps.EVENTS_PEER_TOKEN = 'tooshort';
ok(nwProxy('today', {}).error === 'not_configured' && NW.__counters.fetch === 0, 'Network near side: sub-16 property → not_configured, no fetch');
nwProps.EVENTS_PEER_TOKEN = TOKEN + '\n';
let seenUrl = '';
NW.__setFetch((url) => { seenUrl = url; return resp(200, '<!DOCTYPE html><html><body><div class="error">ScriptError: Exception page</div></body></html>'); });
r = nwProxy('today', { owner: 'dev@example.com' });
ok(r.error === 'upstream_not_json' && typeof r.detail === 'string' && r.detail.length <= 160 && /ScriptError/.test(r.detail), 'Network near side: HTML at HTTP 200 → upstream_not_json with a snippet');
ok(/\?action=peer&eop=today&t=k7Qp2mX9vL4sD8wR1nB6yH3tZ0cF5jG8&owner=dev%40example\.com$/.test(seenUrl) && seenUrl.indexOf('%0A') < 0, 'Network near side: the URL carries the op, the trimmed token and the params');
NW.__setFetch(() => resp(500, 'boom'));
ok(nwProxy('today', {}).error === 'upstream_http_500', 'Network near side: non-200 → upstream_http_<code>');
NW.__setFetch(() => { throw new Error('DNS'); });
ok(nwProxy('today', {}).error === 'upstream_unreachable', 'Network near side: a throw → upstream_unreachable');
NW.__setFetch(() => resp(200, JSON.stringify({ success: true, today: FIXED_TODAY, events: [{ slug: 'x' }] })));
r = nwProxy('today', {});
ok(r.success === true && r.events[0].slug === 'x', 'Network near side: JSON passes through');

// ── 4. Events: a correct token reaches the ops, over the committed registry ─
const registry = P('live-site-pages/events-data/events.json');
const regEvents = JSON.parse(registry).events;
const todayEv = regEvents.find((e) => e.status === 'confirmed' && e.start <= FIXED_TODAY && FIXED_TODAY <= (e.end || e.start));
const laterEv = regEvents.find((e) => e.status === 'confirmed' && e.start > FIXED_TODAY);
ok(!!todayEv && !!laterEv, 'registry: a confirmed event on ' + FIXED_TODAY + ' and a later one exist');
evProps.EVENTS_PEER_TOKEN = TOKEN;
const evPeer = (e) => vm.runInContext('evHandlePeer_', EV)(e);
ok(evPeer(param({ eop: 'today', t: TOKEN })).error === 'owner_required', 'Events today: reaches the op (owner_required, not denied)');
EV.__setFetch((url) => { EV.__lastUrl = url; return resp(200, registry); });
r = evPeer(param({ eop: 'today', t: TOKEN, owner: 'dev@example.com' }));
ok(r.success === true && r.today === FIXED_TODAY && r.events.length === 0, 'Events today: nothing starred answers [] with today (' + JSON.stringify(r) + ')');
ok(/^https:\/\/lightaisolutions\.github\.io\/Sales\/events-data\/events\.json$/.test(EV.__lastUrl), 'Events registry: fetched from the Pages site, never a GitHub API host (' + EV.__lastUrl + ')');
ok(EV.__counters.openById === 1, 'Events today: the tab handle opened once the token matched');
const stars = EV.__ss.sheets['Stars'];
stars.appendRow(['st-0000000000001', 'dev@example.com', todayEv.slug, 'booth 12', 'registered', now, now]);
stars.appendRow(['st-0000000000002', 'dev@example.com', laterEv.slug, '', 'planning', now, now]);
stars.appendRow(['st-0000000000003', 'dev@example.com', 'no-such-event-2099', '', 'planning', now, now]);
stars.appendRow(['st-0000000000004', 'other@example.com', todayEv.slug, '', 'planning', now, now]);
const fetchesBefore = EV.__counters.fetch;
r = evPeer(param({ eop: 'today', t: TOKEN, owner: 'dev@example.com' }));
ok(r.success && r.events.length === 1 && r.events[0].slug === todayEv.slug && r.events[0].name === todayEv.name && r.events[0].city === todayEv.city && !('attending' in r.events[0]) && !('note' in r.events[0]),
   'Events today: the owner\'s starred event dated today, registry fields only (' + JSON.stringify(r.events) + ')');
ok(EV.__counters.fetch === fetchesBefore, 'Events today: the registry is fetched once per execution — this context already holds it from the empty call, so no second fetch');
r = evPeer(param({ eop: 'starred', t: TOKEN, owner: 'dev@example.com' }));
ok(r.success && r.events.length === 2 && r.events[0].slug === todayEv.slug && r.events[0].attending === 'registered' && r.events[1].slug === laterEv.slug && !('today' in r),
   'Events starred: both live stars with attending, the unknown slug skipped, sorted by start');
// eop=signals — read-through to Network's read leg
delete evProps.NETWORK_PEER_TOKEN;
r = evPeer(param({ eop: 'signals', t: TOKEN, owner: 'dev@example.com', accountId: 'a-0000000000001' }));
ok(r.error === 'not_configured', 'Events signals: Network token unset → not_configured passed through');
ok(evPeer(param({ eop: 'signals', t: TOKEN, owner: 'dev@example.com', accountId: 'st-0000000000001' })).error === 'bad_account_id', 'Events signals: a non a- id is refused');
evProps.NETWORK_PEER_TOKEN = TOKEN;
EV.__setFetch((url) => {
  if (/events-data\/events\.json$/.test(url)) return resp(200, registry);
  EV.__lastUrl = url;
  return resp(200, JSON.stringify({ success: true, signals: [{ eventSlug: todayEv.slug, kind: 'exhibitor', confidence: 0.9, evidenceUrl: 'https://example.com/e', source: 'events' }] }));
});
r = evPeer(param({ eop: 'signals', t: TOKEN, owner: 'dev@example.com', accountId: 'a-0000000000001' }));
ok(r.success && r.signals.length === 1 && r.signals[0].name === todayEv.name && r.signals[0].start === todayEv.start && r.signals[0].kind === 'exhibitor', 'Events signals: Network\'s rows joined to the registry (' + JSON.stringify(r.signals) + ')');
ok(/\?action=peer&nop=signals&t=k7Qp2mX9vL4sD8wR1nB6yH3tZ0cF5jG8&owner=dev%40example\.com&accountId=a-0000000000001$/.test(EV.__lastUrl), 'Events signals: asked Network\'s read leg with the owner and account');

// ── 5. Events near side: evNetworkProxy_ (GET and the JSON POST leg) ─────
const evProxy = (nop, params, body) => vm.runInContext('evNetworkProxy_', EV)(nop, params, body);
evProps.NETWORK_PEER_TOKEN = 'short';
ok(evProxy('accounts', {}).error === 'not_configured', 'Events near side: sub-16 property → not_configured');
evProps.NETWORK_PEER_TOKEN = TOKEN;
EV.__setFetch(() => resp(200, '<html><title>Google Apps Script</title>TypeError: Cannot read property</html>'));
r = evProxy('accounts', { owner: 'dev@example.com' });
ok(r.error === 'upstream_not_json' && /TypeError/.test(r.detail) && r.detail.length <= 160, 'Events near side: HTML at HTTP 200 → upstream_not_json with a snippet');
EV.__setFetch(() => { throw new Error('offline'); });
ok(evProxy('accounts', {}).error === 'upstream_unreachable', 'Events near side: a throw → upstream_unreachable');
EV.__setFetch(() => resp(403, 'no'));
ok(evProxy('accounts', {}).error === 'upstream_http_403', 'Events near side: non-200 → upstream_http_<code>');
let seenOpts = null;
EV.__setFetch((url, opts) => { seenOpts = opts; EV.__lastUrl = url; return resp(200, JSON.stringify({ success: true, written: 1, updated: 0, rejected: [] })); });
r = evProxy('signals', { owner: 'dev@example.com' }, { owner: 'dev@example.com', signals: [] });
ok(r.success && r.written === 1 && seenOpts.method === 'post' && seenOpts.contentType === 'application/json' && JSON.parse(seenOpts.payload).signals.length === 0 && seenOpts.muteHttpExceptions === true,
   'Events near side: a body turns the call into a JSON POST with muteHttpExceptions');
ok(/&nop=signals&t=/.test(EV.__lastUrl), 'Events near side: the token rides the query on a POST too');

// ── 6. Nothing ever echoes a token ────────────────────────────────────────
const everything = JSON.stringify([NW.__counters.audit, EV.__counters.audit]);
ok(everything.indexOf(TOKEN) < 0, 'no audit row carries the token');

console.log('check-peer-bridge: ' + checks + ' checks, ' + failures + ' failure(s)');
if (failures) process.exit(1);
console.log('ALL CHECKS PASSED — both far sides refuse every token-boundary case flat with zero reads and zero fetches; '
  + 'both near sides name not_configured, upstream_http_<code>, upstream_unreachable and upstream_not_json; the four ops answer over the in-memory tabs and the committed registry.');

// Developed by: LightAISolutions
