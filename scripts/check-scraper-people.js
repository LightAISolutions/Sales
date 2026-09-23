#!/usr/bin/env node
// E4 session 3 — the people route, proved offline (design plan §13.14 step 3;
// D17; NETWORK-SCHEMA.md §3 · §8 · §9).
//
// The REAL functions are lifted out of the two .gs files (the
// check-peer-bridge.js idiom) and run in two isolated VM contexts with
// stubbed PropertiesService / SpreadsheetApp / UrlFetchApp / CacheService —
// Scraper's far side (scHandleCorpus_ → scHandlePeople_ → scPeopleScan_, and
// the summarise pass's scPeopleParse_ / scSignalsMerge_) in one, Network's
// near side (nwPeopleProxy_ · nwPeopleOp_ · nwPeopleAcceptOp_ and the write
// leg nwPeerSignalsWrite_ with its corpus: branch) in the other, and the
// Network context's fetch of SCRAPER_CORPUS_EXEC routed INTO the Scraper
// context — so the token boundary, the answer shape and the upsert are the
// ones the live apps enforce. It asserts:
//   · scPeopleParse_: the shaped list (≤ SCRAPER_PEOPLE_MAX, a name required,
//     an off-list role → named, duplicates collapsed, bounds), [] on junk
//   · the summarise merge stores `ppl` in the row's Signals blob beside evt
//     and figs; an oversized blob drops xs · ms · figs before ppl
//   · cop=people is gated by NETWORK_CORPUS_TOKEN ALONE: property unset ·
//     sub-16 · wrong · absent · empty · CORPUS_TOKEN's value → flat denied
//     with zero sheet opens and nothing audited; the NETWORK token never
//     reaches timeline or candidates; the timeline answer carries no people
//   · the far side: slug_required; only rows whose blob carries ppl (no
//     back-fill), the slug's rows only, since honoured, one row per article
//     key, archive rows counted, the §9 shape, limit bounded; the audit row
//     carries the slug and counts and never a name
//   · the near side: not_configured under 16 characters with no fetch,
//     upstream_http_<code>, upstream_unreachable, upstream_not_json; the
//     URL shape; a mismatched secret between the projects → denied through
//   · nop=people: bad id, not found, an uncovered account answers
//     covered:false with no fetch, a covered one lists the Scraper's answer
//     with `accepted` per person
//   · nop=peopleaccept: bad_key · name_required · read_only_scope; one
//     press-quote row (0.7, corpus:<key>, Source scraper, the person's name
//     and title, no event slug, First Seen the item's date, Contact ID when
//     a live contact at that account has the same name); a re-accept
//     refreshes (updated:1); a second person on the same article is its
//     own row; the write leg refuses corpus: evidence on any other kind and
//     a press quote with no person
//   · nothing fetches from the Scraper context, no LinkedIn host is ever
//     fetched, no audit row carries a token or a person's name
// Zero live calls — every UrlFetchApp is a stub, and it counts.
//
// Usage:  node scripts/check-scraper-people.js
// Exit:   0 when every assertion holds, 1 on the first that does not.
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const ROOT = process.argv[2] || path.join(__dirname, '..');
const P = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

function extract(src, name) {
  const m = new RegExp('^function ' + name + '\\(', 'm').exec(src);
  if (!m) throw new Error('missing ' + name);
  let i = src.indexOf('{', m.index), depth = 0, j = i, q = null;
  while (j < src.length) {
    const ch = src[j];
    if (q) { if (ch === '\\') { j += 2; continue; } if (ch === q) q = null; }
    else if (ch === '/' && src[j + 1] === '/') { j = src.indexOf('\n', j); if (j < 0) break; continue; }
    else if (ch === '/' && src[j + 1] === '*') { j = src.indexOf('*/', j) + 2; continue; }
    else if (ch === '"' || ch === "'") q = ch;
    else if (ch === '{') depth++;
    else if (ch === '}') { if (--depth === 0) return src.slice(m.index, j + 1); }
    j++;
  }
  throw new Error('unbalanced ' + name);
}
function constant(src, name) {
  const m = new RegExp('^var ' + name + ' =[\\s\\S]*?;[ \\t]*(?://[^\\n]*)?$', 'm').exec(src);
  if (!m) throw new Error('missing var ' + name);
  return m[0];
}
// ── SKELETON END ──

// ── An in-memory Sheet with the surface both sides touch ──────────────────
function fakeSheet(name) {
  const rows = [];
  return { name, rows,
    getLastRow: () => rows.length,
    getLastColumn: () => rows.reduce((w, r) => Math.max(w, r.length), 0),
    appendRow: (r) => { rows.push(r.slice()); },
    setFrozenRows() {}, getFrozenRows: () => 1,
    deleteRow: (n) => { rows.splice(n - 1, 1); },
    getDataRange: () => ({ getValues: () => rows.map((r) => r.slice()) }),
    getRange: (r, c, nr, nc) => ({
      getValues: () => { const out = []; for (let i = 0; i < (nr || 1); i++) { const row = rows[r - 1 + i] || []; const o = []; for (let k = 0; k < (nc || 1); k++) o.push(row[c - 1 + k] === undefined ? '' : row[c - 1 + k]); out.push(o); } return out; },
      getValue: () => ((rows[r - 1] || [])[c - 1] === undefined ? '' : rows[r - 1][c - 1]),
      setValues: (vals) => { vals.forEach((v, i) => { while (rows.length < r + i) rows.push([]); const row = rows[r - 1 + i]; v.forEach((x, k) => { row[c - 1 + k] = x; }); }); },
      setValue: (v) => { while (rows.length < r) rows.push([]); rows[r - 1][c - 1] = v; }
    }) };
}
function fakeSpreadsheet() {
  const sheets = {};
  return { sheets, getSheetByName: (n) => sheets[n] || null, insertSheet: (n) => { sheets[n] = fakeSheet(n); return sheets[n]; } };
}
function makeCtx(props) {
  const ss = fakeSpreadsheet();
  const counters = { openById: 0, fetch: 0, audit: [], urls: [] };
  let fetchImpl = () => { throw new Error('offline'); };
  const ctx = {
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null),
      setProperty: (k, v) => { props[k] = String(v); } }) },
    SpreadsheetApp: { openById: () => { counters.openById++; return ss; } },
    UrlFetchApp: { fetch: (url, opts) => { counters.fetch++; counters.urls.push(url); if (/linkedin\.com|lnkd\.in/i.test(url)) throw new Error('LINKEDIN FETCHED'); return fetchImpl(url, opts); } },
    CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) },
    Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (alg, s) => Array.from(crypto.createHash('sha256').update(String(s)).digest()).map((b) => (b > 127 ? b - 256 : b)) },
    Session: { getScriptTimeZone: () => 'America/New_York' },
    Logger: { log() {} },
    auditLog: (ev, user, op, details) => { counters.audit.push({ ev, user, op, details }); },
    bumpDataRev() {},
    console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN, encodeURIComponent, decodeURIComponent, Intl
  };
  ctx.__ss = ss; ctx.__counters = counters; ctx.__props = props;
  ctx.__setFetch = (fn) => { fetchImpl = fn; };
  vm.createContext(ctx);
  return ctx;
}
function resp(code, text) { return { getResponseCode: () => code, getContentText: () => text }; }
let failures = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.log('  FAIL  ' + msg); } }
function flatDenied(r) { return !!r && r.success === false && r.error === 'denied' && Object.keys(r).length === 2; }
const TOKEN = 'k7Qp2mX9vL4sD8wR1nB6yH3tZ0cF5jG8';        // 32 chars, test-only — NETWORK_CORPUS_TOKEN
const PROFILER_TOKEN = 'p1Rofiler2Token3Never4Shared5X';  // CORPUS_TOKEN's value — never opens cop=people
const OWNER = 'dev@example.com';
const param = (obj) => ({ parameter: obj });

// ── Scraper context ───────────────────────────────────────────────────────
const scSrc = P('googleAppsScripts/Scraper/Scraper.gs');
const scProps = {};
const SC = makeCtx(scProps);
vm.runInContext('var SPREADSHEET_ID = "stub";\nvar _scTabsChecked = false;\n'
  + 'var SCRAPER_TAB_HEADERS = { DigestIntake: ["Digest ID", "URL", "Title", "Source", "Published At", "Snippet", "Score", "Signals", "Summary", "Section", "Backstop", "Analysis"] };\n'
  + ['SCRAPER_TABS', 'SCRAPER_ARCHIVE_SCAN_ROWS', 'SCRAPER_SIGNALS_CELL_MAX', 'SCRAPER_PEOPLE_MAX', 'SCRAPER_PEOPLE_ROLES',
     'SCRAPER_PEOPLE_SCAN_MAX', 'SCRAPER_NETWORK_CORPUS_TOKEN_PROP'].map((n) => constant(scSrc, n)).join('\n') + '\n'
  + ['scStr_', 'scraperSs_', 'ensureScraperTabs_', 'scSignalsJson_', 'scSignalsMerge_', 'scPeopleParse_', 'scArticleKey_',
     'scHandleCorpus_', 'scHandlePeople_', 'scPeopleScan_', 'scTimelineScan_'].map((n) => extract(scSrc, n)).join('\n'), SC, { filename: 'Scraper.people.js' });
const sc = (name) => vm.runInContext(name, SC);

// 1. scPeopleParse_ — the shape the summarise pass stores
let r = sc('scPeopleParse_')([
  { name: '  Jane   Doe ', title: 'VP Storage', company: 'Acme Storage', role: 'Quoted', context: 'said the plant doubles capacity' },
  { name: 'Bob Ray', role: 'columnist', title: '', company: '' },                 // off-list role → named
  { name: 'jane doe', title: 'again', role: 'named' },                           // duplicate (case) collapsed
  { title: 'no name at all', role: 'quoted' },                                    // no name → skipped
  { name: 'X', role: 'author' },                                                  // one character → skipped
  'a string, not an object', null,
  { name: 'A'.repeat(200), title: 'T'.repeat(200), company: 'C'.repeat(200), role: 'author', context: 'K'.repeat(400) }
]);
ok(r.length === 3 && r[0].name === 'Jane Doe' && r[0].role === 'quoted' && r[0].title === 'VP Storage' && r[0].context === 'said the plant doubles capacity',
   'scPeopleParse_: whitespace collapsed, role lower-cased, fields kept (' + JSON.stringify(r[0]) + ')');
ok(r[1].name === 'Bob Ray' && r[1].role === 'named' && r[1].title === '' && r[1].company === '', 'scPeopleParse_: an off-list role collapses to named, empty strings stay empty');
ok(r[2].name.length === 80 && r[2].title.length === 80 && r[2].company.length === 80 && r[2].context.length === 120, 'scPeopleParse_: name/title/company 80, context 120');
ok(sc('scPeopleParse_')(Array.from({ length: 9 }, (_, i) => ({ name: 'Person ' + i, role: 'named' }))).length === sc('SCRAPER_PEOPLE_MAX'), 'scPeopleParse_: capped at SCRAPER_PEOPLE_MAX');
ok(sc('scPeopleParse_')('nope').length === 0 && sc('scPeopleParse_')(null).length === 0 && sc('scPeopleParse_')({ name: 'obj' }).length === 0, 'scPeopleParse_: a non-array is []');

// 2. the merge into the row's Signals blob — beside evt and figs, dropped last but for mt and s
const intake = SC.__ss.insertSheet('DigestIntake');
intake.appendRow(['Digest ID', 'URL', 'Title', 'Source', 'Published At', 'Snippet', 'Score', 'Signals', 'Summary', 'Section', 'Backstop', 'Analysis']);
const blob = (o) => sc('scSignalsJson_')(o);
const row = (id, url, title, src, at, sig, section) => [id, url, title, src, at, 'snippet', 40, sig, 'summary', section || 'market', '', 'analysis'];
const people = [{ name: 'Jane Doe', title: 'VP Storage', company: 'Acme Storage', role: 'quoted', context: 'doubles capacity' }, { name: 'Sam Pen', title: '', company: 'Trade Wire', role: 'author', context: '' }];
intake.appendRow(row('d1', 'https://www.tradewire.example/a1?utm=x', 'Acme doubles Texas plant', 'Trade Wire', '2026-09-20T09:00:00Z',
  blob({ s: { company: 3, topic: 2 }, mc: ['Acme Storage'], mcs: ['acme-storage'], mt: ['bess'], ms: ['utilities'], xs: [], g: 0, ak: sc('scArticleKey_')('https://www.tradewire.example/a1?utm=x'), ev: 2, sup: 1, gf: 1 })));
sc('scSignalsMerge_')(intake, 2, { evt: 'project', figs: ['212 MW'], ppl: people });
let cell = JSON.parse(intake.rows[1][7]);
ok(cell.evt === 'project' && cell.figs[0] === '212 MW' && cell.ppl.length === 2 && cell.ppl[0].name === 'Jane Doe' && cell.mcs[0] === 'acme-storage' && cell.ak, 'merge: ppl stored beside evt and figs, the rubric keys kept (' + Object.keys(cell).join(',') + ')');
const big = JSON.parse(blob({ s: { c: 1 }, mc: ['A'], mcs: ['a'], mt: ['t'], ms: ['m'], xs: Array.from({ length: 300 }, (_, i) => 'excluded-segment-' + i), figs: ['1 MW'], ppl: people, ak: 'k' }));
ok(!('xs' in big) && 'ppl' in big && 'figs' in big && 'mt' in big && big.ppl.length === 2, 'merge: an oversized blob drops xs before ppl (ppl survives with figs, mt, s)');
ok(sc('scSignalsJson_')({ s: 'x'.repeat(3000) }).length <= sc('SCRAPER_SIGNALS_CELL_MAX'), 'blob: never above SCRAPER_SIGNALS_CELL_MAX');
// ── PART 2 END ──

// 3. The far side — NETWORK_CORPUS_TOKEN alone, every boundary case flat with zero opens
intake.appendRow(row('d1', 'https://www.tradewire.example/a2', 'Acme names a CFO', 'Trade Wire', '2026-09-21T09:00:00Z',
  blob({ mc: ['Acme Storage'], mcs: ['acme-storage'], ak: sc('scArticleKey_')('https://www.tradewire.example/a2'), evt: 'other', ppl: [{ name: 'Pat Ledger', title: 'CFO', company: 'Acme Storage', role: 'named', context: 'appointed' }] }), 'archive'));   // corpus-only row counts
intake.appendRow(row('d1', 'https://www.tradewire.example/a3', 'Acme quarterly note', 'Trade Wire', '2026-09-19T09:00:00Z',
  blob({ mc: ['Acme Storage'], mcs: ['acme-storage'], ak: sc('scArticleKey_')('https://www.tradewire.example/a3'), evt: 'results', figs: ['$4M'] })));   // summarised before E4 s3 — no ppl, never answered (no back-fill)
intake.appendRow(row('d1', 'https://www.tradewire.example/b1', 'Bolt hires', 'Trade Wire', '2026-09-20T09:00:00Z',
  blob({ mc: ['Bolt Supply'], mcs: ['bolt-supply'], ak: sc('scArticleKey_')('https://www.tradewire.example/b1'), ppl: [{ name: 'Nobody Else', role: 'quoted' }] })));   // another company
intake.appendRow(row('d0', 'https://www.tradewire.example/old', 'Acme last spring', 'Trade Wire', '2026-03-01T09:00:00Z',
  blob({ mc: ['Acme Storage'], mcs: ['acme-storage'], ak: sc('scArticleKey_')('https://www.tradewire.example/old'), ppl: [{ name: 'Old Quote', role: 'quoted' }] })));   // before `since`
intake.appendRow(row('d2', 'http://tradewire.example/a1/', 'Acme doubles Texas plant', 'Trade Wire', '2026-09-20T10:00:00Z',
  blob({ mc: ['Acme Storage'], mcs: ['acme-storage'], ak: sc('scArticleKey_')('http://tradewire.example/a1/'), ppl: people })));   // the same story in another edition — one key
const corpus = (e) => sc('scHandleCorpus_')(e);
const c0 = { o: SC.__counters.openById, a: SC.__counters.audit.length };
delete scProps.NETWORK_CORPUS_TOKEN; scProps.CORPUS_TOKEN = PROFILER_TOKEN;
ok(flatDenied(corpus(param({ cop: 'people', t: TOKEN, slug: 'acme-storage' }))), 'far side: property unset → denied');
ok(flatDenied(corpus(param({ cop: 'people', t: PROFILER_TOKEN, slug: 'acme-storage' }))), 'far side: CORPUS_TOKEN\'s value never opens cop=people (different peers, different secret)');
scProps.NETWORK_CORPUS_TOKEN = 'short-token';
ok(flatDenied(corpus(param({ cop: 'people', t: 'short-token', slug: 'acme-storage' }))), 'far side: sub-16 property → denied even with a matching t');
scProps.NETWORK_CORPUS_TOKEN = TOKEN + '\n';   // pasted with a trailing newline — trimmed
ok(flatDenied(corpus(param({ cop: 'people', t: 'wrong-' + TOKEN, slug: 'acme-storage' }))), 'far side: wrong token → denied');
ok(flatDenied(corpus(param({ cop: 'people', slug: 'acme-storage' }))), 'far side: t absent → denied');
ok(flatDenied(corpus(param({ cop: 'people', t: '', slug: 'acme-storage' }))), 'far side: t empty → denied');
ok(flatDenied(corpus(param({ cop: 'timeline', t: TOKEN, slug: 'acme-storage' }))), 'far side: the NETWORK token never reaches timeline');
ok(flatDenied(corpus(param({ cop: 'candidates', t: TOKEN }))), 'far side: the NETWORK token never reaches candidates');
ok(SC.__counters.openById === c0.o && SC.__counters.audit.length === c0.a, 'far side: zero sheet opens and nothing audited across the boundary cases');
// 4. the correct token reaches the op
r = corpus(param({ cop: 'people', t: TOKEN }));
ok(r.success === false && r.error === 'slug_required', 'far side: reaches the op — slug_required');
r = corpus(param({ cop: 'people', t: ' ' + TOKEN + ' ', slug: 'Acme-Storage', since: '2026-06-01' }));
ok(r.success === true && r.slug === 'acme-storage' && r.count === 2 && r.items.length === 2, 'far side: two items for the slug (' + JSON.stringify(r.items && r.items.map((i) => i.title)) + ')');
// Last stored first — the timeline's own order (the intake is walked from its last row); the a1 story was stored by two editions and its later row wins
ok(r.items[0].key === sc('scArticleKey_')('https://www.tradewire.example/a1?utm=x') && r.items[0].url === 'http://tradewire.example/a1/' && r.items[0].people.length === 2 && r.items[0].source === 'Trade Wire' && r.items[0].publishedAt === '2026-09-20T10:00:00Z',
   'far side: the §9 shape — key · publishedAt · source · title · url · people; last stored first, the later edition\'s row for a shared key (' + JSON.stringify(r.items[0]).slice(0, 200) + ')');
ok(r.items[1].title === 'Acme names a CFO' && r.items[1].people[0].name === 'Pat Ledger' && r.items[1].people[0].title === 'CFO', 'far side: the archive (corpus-only) row counted with its person');
const keys = r.items.map((i) => i.key);
ok(keys.length === new Set(keys).size && !r.items.some((i) => i.title === 'Acme quarterly note') && !r.items.some((i) => i.title === 'Acme last spring') && !r.items.some((i) => i.title === 'Bolt hires'),
   'far side: one row per article key; the un-summarised row (no back-fill), the pre-since row and the other company never answered');
ok(Object.keys(r.items[0]).sort().join(',') === 'key,people,publishedAt,source,title,url' && !('summary' in r.items[0]) && !('score' in r.items[0]), 'far side: minimum necessary — no summary, score, analysis or figs on the people route');
ok(corpus(param({ cop: 'people', t: TOKEN, slug: 'acme-storage' })).count === 3, 'far side: no since → the old row too (3)');
ok(corpus(param({ cop: 'people', t: TOKEN, slug: 'acme-storage', limit: 1 })).count === 1 && corpus(param({ cop: 'people', t: TOKEN, slug: 'acme-storage', limit: 9999 })).count === 3, 'far side: limit bounds the answer');
ok(corpus(param({ cop: 'people', t: TOKEN, slug: 'nobody' })).count === 0, 'far side: an unknown slug answers an empty list, not an error');
const aud = SC.__counters.audit[SC.__counters.audit.length - 1];
ok(aud && aud.op === 'corpus_people' && aud.details.slug === 'nobody' && aud.details.items === 0 && typeof aud.details.people === 'number' && JSON.stringify(SC.__counters.audit).indexOf('Pat Ledger') < 0 && JSON.stringify(SC.__counters.audit).indexOf(TOKEN) < 0,
   'far side: the audit row carries the slug and counts, never a name or the token');
scProps.CORPUS_TOKEN = PROFILER_TOKEN;
r = corpus(param({ cop: 'timeline', t: PROFILER_TOKEN, slug: 'acme-storage' }));
ok(r.success && r.items.length >= 2 && !r.items.some((i) => 'people' in i), 'timeline (CORPUS_TOKEN): unchanged — no people key on its items');
ok(SC.__counters.fetch === 0, 'Scraper context: zero UrlFetchApp calls (saw ' + SC.__counters.fetch + ')');

// ── Network context ───────────────────────────────────────────────────────
const nwSrc = P('googleAppsScripts/Network/Network.gs');
const nwProps = {};
const NW = makeCtx(nwProps);
vm.runInContext('var SPREADSHEET_ID = "stub";\n' + [
  'NW_RELATIONSHIPS', 'NW_STAGES', 'NW_SIGNAL_KINDS', 'NW_ID_RE', 'NW_ID_PREFIXES', 'NW_TABS',
  'NW_PEER_TOKEN_PROP', 'NW_EVENTS_TOKEN_PROP', 'EVENTS_PEER_EXEC', 'NW_PEER_RELATIONSHIPS', 'NW_PEER_SLUG_RE',
  'NW_CORPUS_TOKEN_PROP', 'SCRAPER_CORPUS_EXEC', 'NW_CORPUS_KEY_RE', 'NW_PRESS_QUOTE_CONFIDENCE', 'NW_PEOPLE_DEFAULT_DAYS'
].map((n) => constant(nwSrc, n)).join('\n') + '\n'
  // The session scope: the test session owns its rows; a `view` session sees another owner's read-only
  + 'function resolveOwnerSet_(user, forOwner) { var set = {}; set[String(user.email).toLowerCase()] = user.scope || "own"; if (user.also) set[user.also] = "view"; return { set: set }; }\n'
  + ['ensureNetworkTabs_', 'nwListRows_', 'nwSheetRead_', 'nwRowObj_', 'nwFindRow_', 'nwOwned_', 'nwWriteRow_', 'nwArr_', 'nwStr_', 'nwNow_', 'nwNewId_', 'nwRandomBase36_', 'nwNameKey_',
     'nwPeerLinkedIn_', 'nwPeerSignalsWrite_', 'nwSignalKey_', 'nwPeopleProxy_', 'nwScopedAccount_', 'nwPeopleOp_', 'nwPeopleAcceptOp_', 'nwSignalsOp_', 'nwEventsProxy_', 'nwSignalRows_', 'nwSignalEvents_', 'nwSignalsNamed_'
    ].map((n) => extract(nwSrc, n)).join('\n'), NW, { filename: 'Network.people.js' });
const nw = (name) => vm.runInContext(name, NW);
const SESS = { email: OWNER, role: 'admin', permissions: ['admin'] };
ok(/^https:\/\/script\.google\.com\/macros\/s\/AKfycby8nOR0AqLsDlZPcrTX9dWIInY48R9Jrl8oBDtN5t0emC06j7iwidEMdXttrD1zXnjUIg\/exec$/.test(nw('SCRAPER_CORPUS_EXEC')) && nw('SCRAPER_CORPUS_EXEC').indexOf(JSON.parse(P('googleAppsScripts/Scraper/Scraper.config.json')).DEPLOYMENT_ID) > 0,
   'near side: SCRAPER_CORPUS_EXEC is the Scraper config\'s deployment');
ok(nw('NW_CORPUS_TOKEN_PROP') === 'NETWORK_CORPUS_TOKEN' && nw('NW_CORPUS_TOKEN_PROP') !== nw('NW_PEER_TOKEN_PROP') && nw('NW_CORPUS_TOKEN_PROP') !== nw('NW_EVENTS_TOKEN_PROP') && nwSrc.indexOf("'CORPUS_TOKEN'") < 0 && nwSrc.indexOf('GUIDANCE_PEER_TOKEN') < 0,
   'near side: a third token namespace — never CORPUS_TOKEN, never a peer token, never Profiler\'s');
// 5. the proxy's invariants
const proxy = (slug, since) => nw('nwPeopleProxy_')(slug, since);
delete nwProps.NETWORK_CORPUS_TOKEN;
ok(proxy('acme-storage', '2026-06-01').error === 'not_configured' && NW.__counters.fetch === 0, 'near side: property unset → not_configured, no fetch');
nwProps.NETWORK_CORPUS_TOKEN = 'tooshort';
ok(proxy('acme-storage').error === 'not_configured' && NW.__counters.fetch === 0, 'near side: sub-16 property → not_configured, no fetch');
nwProps.NETWORK_CORPUS_TOKEN = ' ' + TOKEN + '\n';
NW.__setFetch(() => resp(200, '<!DOCTYPE html><html><body>ScriptError: Exception page</body></html>'));
r = proxy('acme-storage', '2026-06-01');
ok(r.error === 'upstream_not_json' && /ScriptError/.test(r.detail) && r.detail.length <= 160, 'near side: HTML at HTTP 200 → upstream_not_json with a snippet');
ok(/\?action=corpus&cop=people&t=k7Qp2mX9vL4sD8wR1nB6yH3tZ0cF5jG8&slug=acme-storage&since=2026-06-01$/.test(NW.__counters.urls[0]) && NW.__counters.urls[0].indexOf(nw('SCRAPER_CORPUS_EXEC')) === 0 && NW.__counters.urls[0].indexOf('%0A') < 0,
   'near side: the URL is the Scraper exec + cop=people, the trimmed token, the slug and since (' + NW.__counters.urls[0].slice(-80) + ')');
NW.__setFetch(() => resp(500, 'boom'));
ok(proxy('acme-storage').error === 'upstream_http_500', 'near side: non-200 → upstream_http_<code>');
NW.__setFetch(() => { throw new Error('DNS'); });
ok(proxy('acme-storage').error === 'upstream_unreachable', 'near side: a throw → upstream_unreachable');
// Route the Network context's fetch INTO the Scraper context — the real far side answers
NW.__setFetch((url) => {
  const qs = {}; url.split('?')[1].split('&').forEach((kv) => { const [k, v] = kv.split('='); qs[decodeURIComponent(k)] = decodeURIComponent(v || ''); });
  if (qs.action !== 'corpus') return resp(404, 'not the corpus route');
  return resp(200, JSON.stringify(corpus(param(qs))));
});
scProps.NETWORK_CORPUS_TOKEN = 'a-different-secret-on-the-scraper';
r = proxy('acme-storage', '2026-06-01');
ok(flatDenied(r), 'through the bridge: a mismatched secret between the projects is the far side\'s flat denied, passed through');
scProps.NETWORK_CORPUS_TOKEN = TOKEN;
r = proxy('acme-storage', '2026-06-01');
ok(r.success === true && r.count === 2 && r.items[1].people[0].name === 'Pat Ledger', 'through the bridge: the real far side answers the two items');
// ── PART 3 END ──

// 6. nop=people over the in-memory tabs — the account's slug names the route
const now = new Date().toISOString();
const A = (id, owner, name, slug, del) => [id, owner, name, name.toLowerCase(), '', slug, 'target', 'prospecting', '["utilities"]', '[]', 'Austin', '', 'private', now, now, del || ''];
const tabs = nw('ensureNetworkTabs_')();
tabs.accounts.appendRow(A('a-0000000000001', OWNER, 'Acme Storage', 'acme-storage'));
tabs.accounts.appendRow(A('a-0000000000002', OWNER, 'Bolt Supply', ''));                       // uncovered — no route
tabs.accounts.appendRow(A('a-0000000000003', OWNER, 'Gone Corp', 'gone', now));                // soft-deleted
tabs.accounts.appendRow(A('a-0000000000004', 'other@example.com', 'Theirs', 'theirs'));        // another owner, read-only to a sharing session
const C = (id, owner, acct, name, del) => [id, owner, acct, name, name.split(' ')[0], name.split(' ')[1] || '', 'VP', '', 'champion', '[]', '[]', '', '', '', '[]', '[]', '', '2026-09-01', 'unknown', 'FALSE', '[]', '', '', '', '', now, now, del || ''];
tabs.contacts.appendRow(C('c-0000000000001', OWNER, 'a-0000000000001', 'Jane Doe'));                  // the quoted person IS a contact at Acme
tabs.contacts.appendRow(C('c-0000000000002', OWNER, 'a-0000000000001', 'Pat Ledger', now));           // deleted — never matched
tabs.contacts.appendRow(C('c-0000000000003', OWNER, 'a-0000000000002', 'Sam Pen'));                   // at another account — never matched
const peopleOp = (sess, p) => nw('nwPeopleOp_')(sess, p);
const fetches = () => NW.__counters.fetch;
let f0 = fetches();
ok(peopleOp(SESS, { accountId: 'c-0000000000001' }).error === 'bad_account_id' && peopleOp(SESS, { accountId: 'a-0000000000009' }).error === 'not_found' && peopleOp(SESS, { accountId: 'a-0000000000003' }).error === 'not_found' && peopleOp(SESS, { accountId: 'a-0000000000004' }).error === 'not_found',
   'nop=people: a c- id, an unknown, a deleted and another owner\'s account are refused');
r = peopleOp(SESS, { accountId: 'a-0000000000002' });
ok(r.success === true && r.covered === false && r.slug === '' && r.items.length === 0 && fetches() === f0, 'nop=people: an uncovered account has no route and says so — no fetch');
r = peopleOp(SESS, { accountId: 'a-0000000000001', since: '2026-06-01' });
ok(r.success === true && r.covered === true && r.slug === 'acme-storage' && r.since === '2026-06-01' && r.items.length === 2 && fetches() === f0 + 1, 'nop=people: the covered account lists the Scraper\'s two items in one fetch (' + JSON.stringify(r).slice(0, 160) + ')');
const acmeItem = r.items.find((i) => i.people.length === 2), cfoItem = r.items.find((i) => i.title === 'Acme names a CFO');
ok(acmeItem && acmeItem.people.every((p) => p.accepted === false && p.signalId === '') && acmeItem.people[0].name === 'Jane Doe' && acmeItem.people[0].role === 'quoted' && acmeItem.people[1].role === 'author',
   'nop=people: nobody accepted yet — accepted:false on every person, roles carried');
r = peopleOp(SESS, { accountId: 'a-0000000000001', since: 'not-a-date' });
ok(r.success && /^\d{4}-\d{2}-\d{2}$/.test(r.since) && r.since >= new Date(Date.now() - (nw('NW_PEOPLE_DEFAULT_DAYS') + 1) * 86400000).toISOString().slice(0, 10), 'nop=people: a malformed since falls back to the default window');
let pa = NW.__counters.audit.filter((a) => a.op === 'network_people');
ok(pa.length >= 2 && pa.every((a) => Object.keys(a.details).sort().join(',').replace(',error', '') === 'accountId,covered,items,people') && JSON.stringify(pa).indexOf('Jane') < 0 && JSON.stringify(pa).indexOf('acme-storage') < 0,
   'nop=people: audit rows carry the account id and counts only — no slug, no name');

// 7. nop=peopleaccept — one press-quote row through the real write leg
const accept = (sess, p) => nw('nwPeopleAcceptOp_')(sess, p);
ok(accept(SESS, { accountId: 'a-0000000000001', key: 'bad key!', name: 'Jane Doe' }).error === 'bad_key' && accept(SESS, { accountId: 'a-0000000000001', key: '' , name: 'Jane Doe' }).error === 'bad_key', 'accept: a key outside the corpus charset is bad_key');
ok(accept(SESS, { accountId: 'a-0000000000001', key: acmeItem.key, name: '  ' }).error === 'name_required', 'accept: no name → name_required');
ok(accept({ email: 'viewer@example.com', role: 'admin', permissions: ['admin'], also: OWNER }, { accountId: 'a-0000000000001', key: acmeItem.key, name: 'Jane Doe' }).error === 'read_only_scope', 'accept: a view-only share cannot write');
r = accept(SESS, { accountId: 'a-0000000000001', key: acmeItem.key, name: 'Jane Doe', title: 'VP Storage', company: 'Acme Storage', context: 'doubles capacity', publishedAt: acmeItem.publishedAt });
ok(r.success === true && r.written === 1 && r.updated === 0 && r.contactId === 'c-0000000000001', 'accept: one row written, the person matched to the live contact at this account (' + JSON.stringify(r) + ')');
const sig = tabs.signals, H = sig.rows[0], col = (n) => H.indexOf(n);
let srow = sig.rows[1];
ok(sig.rows.length === 2 && srow[col('Kind')] === 'press-quote' && Number(srow[col('Confidence')]) === 0.7 && srow[col('Evidence URL')] === 'corpus:' + acmeItem.key && srow[col('Source')] === 'scraper'
   && srow[col('Person Name')] === 'Jane Doe' && srow[col('Person Title')] === 'VP Storage' && srow[col('Event Slug')] === '' && srow[col('Contact ID')] === 'c-0000000000001' && srow[col('First Seen')] === acmeItem.publishedAt && srow[col('Note')] === 'doubles capacity' && srow[col('Owner')] === OWNER,
   'accept: kind press-quote · 0.7 · corpus:<key> · Source scraper · the person · no event slug · First Seen the item\'s date · the context as the note');
r = accept(SESS, { accountId: 'a-0000000000001', key: acmeItem.key, name: 'Jane Doe', title: 'VP Storage', publishedAt: acmeItem.publishedAt });
ok(r.success && r.written === 0 && r.updated === 1 && sig.rows.length === 2, 'accept: a second accept of the same person on the same article refreshes the row, never duplicates');
r = accept(SESS, { accountId: 'a-0000000000001', key: acmeItem.key, name: 'Sam Pen', title: '', company: 'Trade Wire', publishedAt: acmeItem.publishedAt });
ok(r.success && r.written === 1 && r.contactId === '' && sig.rows.length === 3 && sig.rows[2][col('Person Name')] === 'Sam Pen' && sig.rows[2][col('Contact ID')] === '' && sig.rows[2][col('Note')] === '(Trade Wire)',
   'accept: a second person on the same article is its own row; a same-named contact at ANOTHER account is not matched; the outlet rides the note when it is not this account');
r = accept(SESS, { accountId: 'a-0000000000001', key: cfoItem.key, name: 'Pat Ledger', title: 'CFO', publishedAt: cfoItem.publishedAt });
ok(r.success && r.written === 1 && r.contactId === '', 'accept: a deleted contact with the same name is never matched');
r = peopleOp(SESS, { accountId: 'a-0000000000001', since: '2026-06-01' });
const acme2 = r.items.find((i) => i.people.length === 2);
ok(acme2.people.every((p) => p.accepted === true && /^s-[0-9a-z]{13}$/.test(p.signalId)) && r.items.find((i) => i.title === 'Acme names a CFO').people[0].accepted === true, 'nop=people: after the accepts every person carries accepted:true with its signal id');
r = nw('nwSignalsOp_')(SESS, { accountId: 'a-0000000000001' });
ok(r.success && r.signals.length === 3 && r.signals.every((s) => s.kind === 'press-quote' && s.source === 'scraper' && s.eventSlug === '' && /^corpus:/.test(s.evidenceUrl)) && r.signals.some((s) => s.personName === 'Jane Doe' && s.contactId === 'c-0000000000001'),
   'nop=signals: the "Will be at" line reads the three press-quote rows with the person');
r = nw('nwSignalsOp_')(SESS, { contactId: 'c-0000000000001' });
ok(r.success && r.signals.length === 3 && r.accountId === 'a-0000000000001', 'nop=signals: by the matched contact → its account\'s rows');
// 8. the write leg's corpus: branch is for press-quote only
const write = (rows) => nw('nwPeerSignalsWrite_')(tabs, OWNER, { signals: rows });
r = write([
  { accountId: 'a-0000000000001', eventSlug: 're-plus-2026', kind: 'exhibitor', evidenceUrl: 'corpus:' + acmeItem.key, confidence: 0.9 },      // corpus: on another kind → evidence_required
  { accountId: 'a-0000000000001', eventSlug: '', kind: 'exhibitor', evidenceUrl: 'https://example.com/e', confidence: 0.9 },                 // empty slug on another kind → bad_slug
  { accountId: 'a-0000000000001', eventSlug: '', kind: 'press-quote', evidenceUrl: 'corpus:' + acmeItem.key, confidence: 0.7 },             // no person → person_required
  { accountId: 'a-0000000000001', eventSlug: '', kind: 'press-quote', evidenceUrl: 'https://www.linkedin.com/in/jane', personName: 'Jane Doe', confidence: 0.7 },   // LinkedIn on press-quote → rejected
  { accountId: 'a-0000000000001', eventSlug: 're-plus-2026', kind: 'press-quote', evidenceUrl: 'https://www.trade.example/x', personName: 'Ann Lee', confidence: 0.7 }   // an https press quote with an event still writes (Source events)
]);
const reasons = (r.rejected || []).map((x) => x.index + ':' + x.reason).join(',');
ok(r.success && r.written === 1 && reasons === '0:evidence_required,1:bad_slug,2:person_required,3:linkedin_not_fetched', 'write leg: corpus: evidence for press-quote only, the empty slug for docket and press-quote only, a person required, LinkedIn still refused (' + reasons + ')');
ok(sig.rows[sig.rows.length - 1][col('Source')] === 'events' && sig.rows[sig.rows.length - 1][col('Person Name')] === 'Ann Lee', 'write leg: the bridge\'s default writer is still events');
r = write([{ accountId: 'a-0000000000001', eventSlug: '', kind: 'press-quote', evidenceUrl: 'corpus:' + acmeItem.key, personName: 'JANE  DOE', confidence: 0.7 }]);
ok(r.success && r.updated === 1 && r.written === 0, 'write leg: the press-quote key is by name key — a re-cased name refreshes the same row');

// 9. never
ok(SC.__counters.fetch === 0, 'Scraper context: still zero UrlFetchApp calls');
ok(!NW.__counters.urls.some((u) => /linkedin\.com|lnkd\.in|10times|attendee/i.test(u)), 'Network context: no LinkedIn, 10times or attendee-list host was ever fetched');
const everything = JSON.stringify([SC.__counters.audit, NW.__counters.audit]);
ok(everything.indexOf(TOKEN) < 0 && everything.indexOf(PROFILER_TOKEN) < 0 && everything.indexOf('Jane') < 0 && everything.indexOf('Ledger') < 0 && everything.indexOf('Sam Pen') < 0, 'no audit row on either side carries a token or a person\'s name');

console.log('check-scraper-people: ' + checks + ' checks, ' + failures + ' failure(s)');
if (failures) process.exit(1);
console.log('ALL CHECKS PASSED — the summarise pass stores a bounded people list in the item\'s Signals blob; cop=people is gated by NETWORK_CORPUS_TOKEN alone and refuses every boundary case flat with zero reads; '
  + 'the far side answers the §9 shape for the slug\'s summarised items only (no back-fill, one row per key, since and limit honoured); the near side names not_configured / upstream_http_<code> / upstream_unreachable / upstream_not_json and routes into the real far side; '
  + 'an uncovered account has no route; Accept writes one press-quote row at 0.7 with corpus:<key>, Source scraper, the person and the matched contact, refreshes on a re-accept, and the write leg takes corpus: evidence for press-quote only. Zero live calls.');

// Developed by: LightAISolutions
