#!/usr/bin/env node
// N4 session 1 — warmth, the reconnect list and the import panel, proved
// offline (design plan §13.15 step 3; §4.4; D15; NETWORK-SCHEMA.md §5 · §12).
//
// The REAL functions are lifted out of Network.gs (the check-peer-bridge.js
// / check-scraper-people.js idiom) and run in one isolated VM context with
// stubbed PropertiesService / SpreadsheetApp / UrlFetchApp — the warmth and
// cadence helpers, the single touch pass the list op reads, nwListOp_ and
// nwGetOp_ themselves, nwReconnectOp_, the .ics and CSV parsers, nwImportOp_
// and nwImportConfirmOp_ with the same nwInteractionAdd_ the drafts flow
// writes through — so the numbers, the shapes and the refusals are the ones
// the live app enforces. It asserts:
//   · the §5 constants as written (weights, the 90-day half-life, the bands,
//     the cadence table) and the page's mirror of the two the legend reads
//   · warmth against hand-computed values: one touch at each weight today,
//     a call at exactly one half-life = 0.75, three touches summed, the
//     zero-weight kinds and an off-list kind contribute nothing, a future
//     date is clamped, an empty list is 0 / cold; every band edge
//   · cadence(role, relationship) for every relationship and the two key
//     roles; no relationship reads as other
//   · the list row carries warmth + warmthBand beside lastTouch from ONE
//     read of the Interactions tab; the detail's warmth block (score, band,
//     last touch, cadence, since, overdue); neither is stored anywhere
//   · nop=reconnect: only lapsed contacts, most overdue first, the lapse
//     computed from the cadence, a do-not-contact row left out, another
//     owner's rows never answered, a contact with no touch measured from
//     its met date, the minimum row, the audit row counts only
//   · the .ics parser: folded lines, a TZID DTSTART, an all-day DATE, upper
//     and lower-case mailto, ORGANIZER, escaped commas in SUMMARY, the UID
//     as the row's reference, DESCRIPTION never read
//   · the CSV parser: RFC 4180 quoting with commas and doubled quotes, a
//     header matched by name, two addresses in To, a direction column, a
//     Message-ID column, a From-only file read as email-in, M/D/YYYY dates,
//     a tab-separated paste, a missing Date column refused
//   · nop=import: an address that matches no contact is proposed as
//     unmatched and NEVER written; the session's own address is skipped;
//     an already-recorded touch is proposed as duplicate; format detection;
//     the size and emptiness refusals; the audit row carries counts only
//   · nop=importconfirm: only the ticked rows are written, each as one
//     Interaction with the developer's reference (· the row's own ref) as
//     Evidence Link and the one line as Summary — never a body; a row with
//     no contact id, an off-list kind (scan), a bad date, a deleted contact
//     and a re-confirm (duplicate) are refused per row; a view-only scope
//     writes nothing; the audit row carries counts only
//   · the PROJECT region and the served page name no GmailApp, CalendarApp,
//     MailApp or gmail.* scope; zero UrlFetchApp calls
//
// Usage:  node scripts/check-network-warmth.js
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
// ── An in-memory Sheet with the surface the ops touch ─────────────────────
function fakeSheet(name) {
  const rows = [];
  return { name, rows,
    getLastRow: () => rows.length,
    getLastColumn: () => rows.reduce((w, r) => Math.max(w, r.length), 0),
    appendRow: (r) => { rows.push(r.slice()); },
    setFrozenRows() {}, getFrozenRows: () => 1,
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
  const counters = { openById: 0, fetch: 0, audit: [], reads: 0, revs: 0 };
  const ctx = {
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null), setProperty: (k, v) => { props[k] = String(v); } }) },
    SpreadsheetApp: { openById: () => { counters.openById++; return ss; } },
    UrlFetchApp: { fetch: () => { counters.fetch++; throw new Error('offline'); } },
    CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) },
    Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (alg, s) => Array.from(crypto.createHash('sha256').update(String(s)).digest()).map((b) => (b > 127 ? b - 256 : b)),
      formatDate: (d) => new Date(d).toISOString().slice(0, 10) },
    Session: { getScriptTimeZone: () => 'America/New_York' },
    Logger: { log() {} },
    auditLog: (ev, user, op, details) => { counters.audit.push({ ev, user, op, details }); },
    bumpDataRev() { counters.revs++; },
    console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN, encodeURIComponent, decodeURIComponent, Intl
  };
  ctx.__ss = ss; ctx.__counters = counters; ctx.__props = props;
  vm.createContext(ctx);
  return ctx;
}
let failures = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.log('  FAIL  ' + msg); } }
const OWNER = 'dev@example.com', OTHER = 'other@example.com';
const SESS = { email: OWNER, role: 'admin', permissions: ['admin'] };
const VIEW = { email: 'viewer@example.com', role: 'admin', permissions: ['admin'], also: OWNER };   // sees OWNER's rows read-only
// ── SKELETON END ──

// ── The Network context ───────────────────────────────────────────────────
const nwSrc = P('googleAppsScripts/Network/Network.gs');
const region = nwSrc.slice(nwSrc.indexOf('// PROJECT START'), nwSrc.indexOf('// PROJECT END'));
const NW = makeCtx({});
vm.runInContext('var SPREADSHEET_ID = "stub";\n' + [
  'NW_RELATIONSHIPS', 'NW_STAGES', 'NW_ROLES', 'NW_INTERACTION_KINDS', 'NW_CONSENT', 'NW_ID_RE', 'NW_ID_PREFIXES', 'NW_TABS', 'NW_ROLE_CAPS',
  'NW_STAGE_RELATIONSHIPS', 'NW_LIST_FILTER_KEYS', 'NW_DATE_RE', 'NW_WARMTH_WEIGHTS', 'NW_WARMTH_HALF_LIFE_DAYS', 'NW_WARMTH_BANDS', 'NW_CADENCE_DAYS',
  'NW_IMPORT_KINDS', 'NW_IMPORT_TEXT_MAX', 'NW_IMPORT_ROWS_MAX', 'NW_RECONNECT_MAX', 'NW_CSV_COLS'
].map((n) => constant(nwSrc, n)).join('\n') + '\n'
  // The session scope, as the template resolves it: the session owns its rows; VIEW sees OWNER's read-only.
  + 'function resolveOwnerSet_(user, forOwner) { var set = {}; set[String(user.email).toLowerCase()] = "own"; if (user.also) set[user.also] = "view"; return { set: set }; }\n'
  + 'function resolveOwnerScope_(user, forOwner, needEdit) { var me = String(user.email).toLowerCase(); var t = String(forOwner || "").toLowerCase(); if (!t || t === me) return { owner: me, scope: "own" }; if (user.also === t) return needEdit ? { error: "view_only" } : { owner: t, scope: "view" }; return { error: "not_shared" }; }\n'
  + 'function nwFoldersGet_() { return { root: "", inbox: "", accounts: {} }; }\n'
  + ['ensureNetworkTabs_', 'nwListRows_', 'nwSheetRead_', 'nwRowObj_', 'nwFindRow_', 'nwOwned_', 'nwWriteRow_', 'nwArr_', 'nwObj_', 'nwStr_', 'nwNow_', 'nwNewId_', 'nwRandomBase36_',
     'nwEmailKey_', 'nwNameKey_', 'nwInteractionAdd_', 'nwContactPublic_', 'nwAccountPublic_', 'nwRoleOf_', 'nwListFilters_', 'nwLastTouch_', 'nwListMatch_', 'nwListOp_', 'nwGetOp_',
     'nwCadenceDays_', 'nwDayKey_', 'nwDaysBetween_', 'nwWarmth_', 'nwWarmthBand_', 'nwTouchPass_', 'nwWarmthDetail_', 'nwReconnectOp_',
     'nwIcsUnfold_', 'nwIcsUnescape_', 'nwIcsDay_', 'nwIcsParse_', 'nwIcsRows_', 'nwCsvParse_', 'nwCsvHeaderKey_', 'nwCsvColumns_', 'nwCsvDay_', 'nwCsvEmails_', 'nwCsvDirection_', 'nwCsvRows_',
     'nwEmailIndex_', 'nwImportExisting_', 'nwImportOp_', 'nwImportConfirmOp_'
    ].map((n) => extract(nwSrc, n)).join('\n'), NW, { filename: 'Network.warmth.js' });
const nw = (name) => vm.runInContext(name, NW);
const r2 = (x) => Math.round(x * 100) / 100;
const NOW = Date.now();
const ago = (n) => new Date(NOW - n * 86400000).toISOString().slice(0, 10);   // n days ago, as a day — the op's own floor makes the age exactly n

// 1. The §5 constants as written, and the page's mirror
const W = nw('NW_WARMTH_WEIGHTS');
ok(W.meeting === 2 && W.call === 1.5 && W['email-out'] === 1 && W['email-in'] === 1.2 && W.calendar === 1.5 && W.scan === 1 && W.note === 0.3 && W.linkedin === 0.5 && W['account-change'] === 0 && W.merge === 0
   && nw('NW_INTERACTION_KINDS').every((k) => Object.prototype.hasOwnProperty.call(W, k)), 'constants: the §5 weights, one per interaction kind');
ok(nw('NW_WARMTH_HALF_LIFE_DAYS') === 90 && JSON.stringify(nw('NW_WARMTH_BANDS')) === '[["hot",2],["warm",0.75],["cool",0.2]]', 'constants: the 90-day half-life and the three band edges');
const page = P('live-site-pages/Network.html');
const pageMirror = (name) => { const m = new RegExp('^var ' + name + ' = (.*?);[ \\t]*(?://.*)?$', 'm').exec(page); return m ? m[1] : null; };
ok(pageMirror('NW_WARMTH_WEIGHTS') === /^var NW_WARMTH_WEIGHTS = (.*?);/m.exec(nwSrc)[1] && pageMirror('NW_WARMTH_HALF_LIFE_DAYS') === '90' && pageMirror('NW_WARMTH_BANDS') === /^var NW_WARMTH_BANDS = (.*?);/m.exec(nwSrc)[1],
   'constants: the page mirrors the weights, the half-life and the bands byte for byte (the legend reads them; the page never computes a score)');
// 2. warmth against hand-computed values
const warmth = (t) => nw('nwWarmth_')(t, NOW);
ok(warmth([{ kind: 'meeting', date: ago(0) }]) === 2 && warmth([{ kind: 'call', date: ago(0) }]) === 1.5 && warmth([{ kind: 'note', date: ago(0) }]) === 0.3 && warmth([{ kind: 'email-in', date: ago(0) }]) === 1.2,
   'warmth: a touch today counts its full weight');
ok(warmth([{ kind: 'call', date: ago(90) }]) === 0.75 && warmth([{ kind: 'scan', date: ago(180) }]) === 0.25 && warmth([{ kind: 'meeting', date: ago(270) }]) === 0.25, 'warmth: one half-life halves (call 1.5 → 0.75 at 90 days; scan 1 → 0.25 at 180; meeting 2 → 0.25 at 270)');
ok(warmth([{ kind: 'meeting', date: ago(100) }]) === r2(2 * Math.pow(0.5, 100 / 90)) && warmth([{ kind: 'meeting', date: ago(100) }]) === 0.93, 'warmth: 2 × 0.5^(100/90) = 0.93');
ok(warmth([{ kind: 'call', date: ago(0) }, { kind: 'email-out', date: ago(10) }, { kind: 'note', date: ago(30) }]) === r2(1.5 + Math.pow(0.5, 10 / 90) + 0.3 * Math.pow(0.5, 30 / 90)), 'warmth: three touches sum');
ok(warmth([{ kind: 'account-change', date: ago(0) }, { kind: 'merge', date: ago(0) }, { kind: 'bogus', date: ago(0) }, { kind: 'meeting', date: 'not a day' }]) === 0, 'warmth: zero-weight kinds, an off-list kind and a row with no day weigh nothing');
ok(warmth([{ kind: 'meeting', date: new Date(NOW + 5 * 86400000).toISOString().slice(0, 10) }]) === 2, 'warmth: a future-dated touch is clamped to full weight, never above');
ok(warmth([]) === 0 && nw('nwWarmthBand_')(0) === 'cold' && nw('nwWarmthBand_')(0.19) === 'cold' && nw('nwWarmthBand_')(0.2) === 'cool' && nw('nwWarmthBand_')(0.74) === 'cool' && nw('nwWarmthBand_')(0.75) === 'warm' && nw('nwWarmthBand_')(1.99) === 'warm' && nw('nwWarmthBand_')(2) === 'hot',
   'warmth: empty is 0 / cold; every band edge is inclusive at its threshold');
ok(warmth([{ kind: 'meeting', date: new Date(NOW - 100 * 86400000) }]) === 0.93, 'warmth: a Date cell is read as its day');
// 3. cadence(role, relationship)
const cad = nw('nwCadenceDays_');
ok(cad('champion', 'target') === 30 && cad('decision-maker', 'customer') === 30 && cad('procurement', 'target') === 60 && cad('other', 'customer') === 60, 'cadence: 30 for a champion or decision maker at a target / customer, 60 for any other role there');
ok(cad('champion', 'partner') === 90 && cad('peer', 'channel') === 90 && cad('champion', 'supplier') === 180 && cad('decision-maker', 'competitor') === 180 && cad('other', 'other') === 180, 'cadence: partner / channel 90, supplier / competitor / other 180 whatever the role');
ok(cad('champion', '') === 180 && cad('', 'nonsense') === 180 && cad('CHAMPION', 'Target') === 30, 'cadence: no or unknown relationship reads as other; case is ignored');
// 4. The tabs, the list row and the detail — from one read of the Interactions tab
const tabs = nw('ensureNetworkTabs_')();
const now = new Date(NOW).toISOString();
const A = (id, owner, name, rel, del) => tabs.accounts.appendRow([id, owner, name, name.toLowerCase(), '', '', rel, 'none', '[]', '[]', '', '', '', now, now, del || '']);
const C = (id, owner, acct, name, role, email, met, dnc, del) => tabs.contacts.appendRow([id, owner, acct, name, name.split(' ')[0], name.split(' ')[1] || '', 'VP', '', role,
  JSON.stringify(email ? [{ value: email, kind: 'work' }] : []), '[]', '', '', '', '[]', '[]', 'Stub Expo', met || ago(3), 'unknown', dnc ? 'true' : 'false', '[]', '', '', '', '', now, now, del || '']);
const I = (id, owner, cid, aid, kind, date, summary, evidence) => tabs.interactions.appendRow([id, owner, cid, aid, kind, date, summary, evidence || '', '', now]);
A('a-0000000000001', OWNER, 'Acme Storage', 'target'); A('a-0000000000002', OWNER, 'Bolt Supply', 'partner'); A('a-0000000000003', OWNER, 'Grid Co', 'supplier'); A('a-0000000000004', OTHER, 'Theirs', 'target');
C('c-0000000000001', OWNER, 'a-0000000000001', 'Jane Doe', 'champion', 'jane@acme.example');            // meeting 100 days ago → 0.93 warm; cadence 30 → 70 overdue
C('c-0000000000002', OWNER, 'a-0000000000001', 'Pat Ledger', 'procurement', 'pat@acme.example');        // call today + email-out 10 days ago → hot; cadence 60 → inside
C('c-0000000000003', OWNER, 'a-0000000000002', 'Sam Pen', 'point-of-contact', 'sam@bolt.example');       // note 200 days ago → cold; cadence 90 → 110 overdue
C('c-0000000000004', OWNER, 'a-0000000000003', 'Dee Enn', 'other', 'dee@grid.example', ago(400), true);  // do-not-contact — lapsed but left out
C('c-0000000000005', OWNER, 'a-0000000000003', 'No Touch', 'peer', 'notouch@grid.example', ago(400));    // no Interaction at all → measured from the met date; cadence 180 → 220 overdue
C('c-0000000000006', OWNER, 'a-0000000000002', 'Fresh Face', 'champion', 'fresh@bolt.example');          // calendar 5 days ago → warm; cadence 90 → inside
C('c-0000000000007', OTHER, 'a-0000000000004', 'Their Person', 'champion', 't@theirs.example');           // another owner — never answered to SESS
C('c-0000000000008', OWNER, 'a-0000000000001', 'Gone Row', 'other', 'gone@acme.example', ago(3), false, now);   // soft-deleted
I('i-0000000000001', OWNER, 'c-0000000000001', 'a-0000000000001', 'meeting', ago(100), 'Booth chat');
I('i-0000000000002', OWNER, 'c-0000000000002', 'a-0000000000001', 'call', ago(0), 'Pricing call');
I('i-0000000000003', OWNER, 'c-0000000000002', 'a-0000000000001', 'email-out', ago(10), 'Follow-up sent: Quote', 'd-0000000000001');
I('i-0000000000004', OWNER, 'c-0000000000003', 'a-0000000000002', 'note', ago(200), 'Met at a dinner');
I('i-0000000000005', OWNER, 'c-0000000000006', 'a-0000000000002', 'calendar', ago(5), 'Site visit');
I('i-0000000000006', OTHER, 'c-0000000000007', 'a-0000000000004', 'meeting', ago(400), 'Theirs');
const pass = nw('nwTouchPass_')(tabs, NOW);
ok(pass.touch['c-0000000000002'] === ago(0) && pass.warmth['c-0000000000002'] === r2(1.5 + Math.pow(0.5, 10 / 90)) && pass.warmth['c-0000000000001'] === 0.93 && pass.warmth['c-0000000000003'] === r2(0.3 * Math.pow(0.5, 200 / 90)) && !('c-0000000000005' in pass.warmth),
   'touch pass: lastTouch and warmth per contact from one walk (' + JSON.stringify(pass.warmth) + ')');
ok(nw('nwLastTouch_')(tabs)['c-0000000000001'] === ago(100), 'touch pass: nwLastTouch_ still answers the newest day (the export op reads it)');
let r = nw('nwListOp_')(SESS, {});
const row = (id) => r.contacts.find((c) => c.id === id);
ok(r.success && r.contacts.length === 6 && row('c-0000000000002').warmth === r2(1.5 + Math.pow(0.5, 10 / 90)) && row('c-0000000000002').warmthBand === 'hot' && row('c-0000000000002').lastTouch === ago(0)
   && row('c-0000000000001').warmthBand === 'warm' && row('c-0000000000003').warmthBand === 'cold' && row('c-0000000000005').warmth === 0 && row('c-0000000000005').warmthBand === 'cold' && row('c-0000000000006').warmthBand === 'warm',
   'nop=list: every row carries warmth + warmthBand beside lastTouch; a contact with no touch is 0 / cold (' + r.contacts.map((c) => c.name + ':' + c.warmthBand).join(', ') + ')');
ok(!('_emails' in row('c-0000000000001')) && Object.keys(row('c-0000000000001')).sort().join(',') === 'accountId,id,lastTouch,metDate,name,owner,role,sourceEvent,title,updatedAt,warmth,warmthBand', 'nop=list: warmth and warmthBand are the only widening of the row (' + Object.keys(row('c-0000000000001')).sort().join(',') + ')');
ok(!tabs.contacts.rows[0].some((h) => /warm|cadence/i.test(String(h))) && !tabs.interactions.rows[0].some((h) => /warm|cadence/i.test(String(h))) && !nw('NW_TABS').hasOwnProperty('warmth'), 'never stored: no tab and no column holds a warmth or a cadence');
r = nw('nwGetOp_')(SESS, { id: 'c-0000000000001' });
ok(r.success && r.warmth && r.warmth.score === 0.93 && r.warmth.band === 'warm' && r.warmth.lastTouch === ago(100) && r.warmth.cadenceDays === 30 && r.warmth.sinceDays === 100 && r.warmth.overdueDays === 70,
   'nop=get: the detail\'s warmth block — score, band, last touch, cadence (champion at a target = 30), since, overdue (' + JSON.stringify(r.warmth) + ')');
r = nw('nwGetOp_')(SESS, { id: 'c-0000000000005' });
ok(r.success && r.warmth.score === 0 && r.warmth.band === 'cold' && r.warmth.lastTouch === ago(400) && r.warmth.cadenceDays === 180 && r.warmth.overdueDays === 220, 'nop=get: a contact with no Interaction is measured from its met date');
r = nw('nwGetOp_')(SESS, { id: 'c-0000000000002' });
ok(r.success && r.warmth.band === 'hot' && r.warmth.cadenceDays === 60 && r.warmth.sinceDays === 0 && r.warmth.overdueDays === -60, 'nop=get: inside the cadence reads as a negative lapse');
// 5. nop=reconnect
const a0 = NW.__counters.audit.length;
r = nw('nwReconnectOp_')(SESS, {});
ok(r.success && r.contacts.map((c) => c.id).join(',') === 'c-0000000000005,c-0000000000003,c-0000000000001' && r.count === 3 && r.lapsed === 3 && r.total === 6 && /^\d{4}-\d{2}-\d{2}$/.test(r.today),
   'reconnect: the three lapsed contacts, most overdue first — No Touch (220), Sam (110), Jane (70) (' + r.contacts.map((c) => c.name + ' ' + c.overdueDays).join(', ') + ')');
ok(r.contacts[2].cadenceDays === 30 && r.contacts[2].sinceDays === 100 && r.contacts[2].overdueDays === 70 && r.contacts[2].lastTouch === ago(100) && r.contacts[2].warmthBand === 'warm' && r.contacts[2].accountName === 'Acme Storage' && r.contacts[2].relationship === 'target' && r.contacts[2].role === 'champion',
   'reconnect: each row carries the cadence, the lapse, the last touch, the warmth and the account\'s name / relationship');
ok(!r.contacts.some((c) => c.id === 'c-0000000000004') && !r.contacts.some((c) => c.id === 'c-0000000000007') && !r.contacts.some((c) => c.id === 'c-0000000000008') && !r.contacts.some((c) => c.id === 'c-0000000000002'),
   'reconnect: a do-not-contact row, another owner\'s row, a deleted row and a contact inside its cadence are never listed');
ok(Object.keys(r.contacts[0]).sort().join(',') === 'accountId,accountName,cadenceDays,id,lastTouch,name,overdueDays,relationship,role,sinceDays,stage,title,warmth,warmthBand', 'reconnect: the minimum row — no email, phone, address, notes or tags (' + Object.keys(r.contacts[0]).sort().join(',') + ')');
const ra = NW.__counters.audit.slice(a0).find((a) => a.op === 'network_reconnect');
ok(ra && Object.keys(ra.details).sort().join(',') === 'contacts,excluded,total' && ra.details.contacts === 3 && ra.details.excluded === 1 && JSON.stringify(ra.details).indexOf('Jane') < 0, 'reconnect: the audit row carries counts only');
r = nw('nwReconnectOp_')(VIEW, {});
ok(r.success && r.contacts.length === 3 && r.contacts.every((c) => c.owner === undefined), 'reconnect: a view-only share of OWNER sees the same lapsed list (read-only)');
// ── PART 2 END ──

// 6. The .ics parser
const ICS = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Stub//EN',
  'BEGIN:VEVENT', 'UID:evt-1@stub.example', 'DTSTART;TZID=America/New_York:' + ago(2).replace(/-/g, '') + 'T100000', 'DTEND;TZID=America/New_York:' + ago(2).replace(/-/g, '') + 'T110000',
  'SUMMARY:Site visit\\, Texas plant — long title that keeps going and going so the', '  line is folded by the exporter at seventy five octets', 'DESCRIPTION:The body of the invite must never be read\\nJane said nothing here',
  'ORGANIZER;CN="Dev Person":mailto:' + OWNER, 'ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;CN=Jane Doe;X-NUM-GUESTS=0:MAILTO:Jane@Acme.example',
  'ATTENDEE;CN="Stranger, Sam":mailto:stranger@nowhere.example', 'END:VEVENT',
  'BEGIN:VEVENT', 'UID:evt-2@stub.example', 'DTSTART;VALUE=DATE:' + ago(7).replace(/-/g, ''), 'SUMMARY:Trade dinner', 'ATTENDEE:mailto:sam@bolt.example', 'ATTENDEE:mailto:jane@acme.example', 'END:VEVENT',
  'BEGIN:VEVENT', 'UID:evt-3@stub.example', 'DTSTART:' + ago(1).replace(/-/g, '') + 'T090000Z', 'SUMMARY:Solo focus block', 'END:VEVENT',
  'END:VCALENDAR'].join('\r\n') + '\r\n';
let ev = nw('nwIcsParse_')(ICS);
ok(ev.length === 3 && ev[0].uid === 'evt-1@stub.example' && ev[0].date === ago(2) && ev[0].summary === 'Site visit, Texas plant — long title that keeps going and going so the line is folded by the exporter at seventy five octets'.slice(0, 120)
   && ev[0].emails.join(',') === OWNER + ',jane@acme.example,stranger@nowhere.example' && ev[1].date === ago(7) && ev[1].emails.length === 2 && ev[2].emails.length === 0,
   'ics: three events — a folded, escaped SUMMARY, a TZID DTSTART and an all-day DATE as days, ORGANIZER and upper-case MAILTO lower-cased, the UID kept (' + JSON.stringify(ev[0]).slice(0, 160) + ')');
ok(!('description' in ev[0]) && JSON.stringify(ev).indexOf('body of the invite') < 0, 'ics: DESCRIPTION is never read');
ok(nw('nwIcsParse_')('nothing here').length === 0 && nw('nwIcsParse_')(ICS.replace(/\r\n/g, '\n')).length === 3, 'ics: no VEVENT → no events; LF line ends parse the same');
let rows = nw('nwIcsRows_')(ICS);
ok(rows.length === 3 && rows.every((x) => x.kind === 'calendar') && rows[0].ref === 'evt-1@stub.example' && rows[0].line.length <= 120 && rows[0].emails.length === 3, 'ics rows: one calendar row per event with the UID as its reference');
// 7. The CSV parser
const CSV = 'Subject,To: (Address),From: (Address),Date Sent,Message-ID\r\n"Quote, revised","jane@acme.example; Pat Ledger <pat@acme.example>",' + OWNER + ',' + ago(4) + ' 09:12,<m1@stub>\r\n'
  + '"She said ""hello""",stranger@nowhere.example,' + OWNER + ',9/1/2026,<m2@stub>\r\n"No date at all",sam@bolt.example,' + OWNER + ',,<m3@stub>\r\n';
let parsed = nw('nwCsvParse_')(CSV);
ok(parsed.length === 4 && parsed[1][0] === 'Quote, revised' && parsed[2][0] === 'She said "hello"' && parsed[1].length === 5, 'csv: RFC 4180 — a quoted comma and a doubled quote survive (' + JSON.stringify(parsed[1]) + ')');
let cols = nw('nwCsvColumns_')(parsed[0]);
ok(cols.subject === 0 && cols.to === 1 && cols.from === 2 && cols.date === 3 && cols.ref === 4 && cols.direction === undefined, 'csv: the header matched by name, punctuation and case ignored (' + JSON.stringify(cols) + ')');
let cr = nw('nwCsvRows_')(CSV, '');
ok(!cr.error && cr.rows.length === 3 && cr.rows[0].kind === 'email-out' && cr.rows[0].emails.join(',') === 'jane@acme.example,pat@acme.example' && cr.rows[0].date === ago(4) && cr.rows[0].line === 'Quote, revised' && cr.rows[0].ref === '<m1@stub>'
   && cr.rows[1].date === '2026-09-01' && cr.rows[2].date === '' && cr.rows[2].emails[0] === 'sam@bolt.example',
   'csv rows: To wins for an outgoing file (both addresses of a two-recipient row), M/D/YYYY read, a missing date left empty (' + JSON.stringify(cr.rows[0]) + ')');
const CSV_IN = 'Date\tFrom\tSubject\n' + ago(6) + '\tjane@acme.example\tRe: quote\n';
cr = nw('nwCsvRows_')(CSV_IN, '');
ok(!cr.error && cr.rows.length === 1 && cr.rows[0].kind === 'email-in' && cr.rows[0].emails[0] === 'jane@acme.example' && cr.rows[0].line === 'Re: quote', 'csv rows: a tab-separated From-only file reads as email-in');
const CSV_DIR = 'date,from,to,subject,folder\n' + ago(3) + ',' + OWNER + ',pat@acme.example,Hello,Sent Items\n' + ago(2) + ',pat@acme.example,' + OWNER + ',Re: Hello,Inbox\n';
cr = nw('nwCsvRows_')(CSV_DIR, '');
ok(cr.rows.length === 2 && cr.rows[0].kind === 'email-out' && cr.rows[0].emails[0] === 'pat@acme.example' && cr.rows[1].kind === 'email-in' && cr.rows[1].emails[0] === 'pat@acme.example', 'csv rows: a direction column picks To for a sent row and From for an inbox row');
ok(nw('nwCsvRows_')('subject,to\nx,y\n', '').error === 'csv_columns' && nw('nwCsvRows_')('date,to\n', '').error === 'csv_no_rows' && nw('nwCsvRows_')('', '').error === 'csv_empty', 'csv rows: no Date column, a header alone and an empty paste are refused by name');
ok(nw('nwCsvDay_')('2026-09-22T10:00:00Z') === '2026-09-22' && nw('nwCsvDay_')('2026/9/3') === '2026-09-03' && nw('nwCsvDay_')('junk') === '', 'csv day: ISO, YYYY/M/D and junk');
// 8. nop=import — a proposal list, nothing written
const imp = (sess, p) => nw('nwImportOp_')(sess, p);
const ixRows = () => tabs.interactions.rows.length;
let n0 = ixRows(), a1 = NW.__counters.audit.length;
ok(imp(SESS, { text: '   ' }).error === 'text_required' && imp(SESS, { text: 'x'.repeat(nw('NW_IMPORT_TEXT_MAX') + 1) }).error === 'text_too_long' && imp(SESS, { text: ICS, format: 'xml' }).error === 'bad_format' && imp(SESS, { text: 'BEGIN:VCALENDAR\nEND:VCALENDAR', format: 'auto' }).error === 'ics_no_events',
   'import: an empty, an oversized, an unknown-format and an event-less paste are refused');
r = imp(SESS, { text: ICS, format: 'auto' });
const prop = (f) => r.proposals.filter(f);
ok(r.success && r.format === 'ics' && r.rows === 3 && r.matched === 3 && r.unmatched === 2 && r.proposals.length === 5, 'import: the .ics is detected; 3 matched proposals, 2 unmatched, nothing else (' + JSON.stringify({ rows: r.rows, matched: r.matched, unmatched: r.unmatched, n: r.proposals.length }) + ')');
const jane1 = prop((p) => p.matched && p.contactId === 'c-0000000000001' && p.ref === 'evt-1@stub.example')[0];
ok(jane1 && jane1.contactName === 'Jane Doe' && jane1.accountId === 'a-0000000000001' && jane1.email === 'jane@acme.example' && jane1.kind === 'calendar' && jane1.date === ago(2) && jane1.duplicate === false && /^Site visit, Texas plant/.test(jane1.line),
   'import: a matched proposal names the contact, the day, the kind, the line and the UID (' + JSON.stringify(jane1) + ')');
ok(prop((p) => !p.matched && p.reason === 'no_contact' && p.email === 'stranger@nowhere.example').length === 1 && prop((p) => !p.matched && p.reason === 'no_email' && p.ref === 'evt-3@stub.example').length === 1 && !r.proposals.some((p) => p.email === OWNER),
   'import: the stranger is proposed as unmatched, the attendee-less event as no_email, the session\'s own address never');
ok(prop((p) => p.matched && p.contactId === 'c-0000000000003').length === 1 && prop((p) => p.matched && p.contactId === 'c-0000000000001').length === 2, 'import: the dinner proposes Sam and Jane — Jane once per event, never twice');
ok(ixRows() === n0 && NW.__counters.revs === 0, 'import: NOTHING is written by a proposal');
const ia = NW.__counters.audit.slice(a1).find((a) => a.op === 'network_import');
ok(ia && Object.keys(ia.details).sort().join(',') === 'matched,rows,unmatched' && ia.details.matched === 3 && JSON.stringify(NW.__counters.audit.slice(a1).map((a) => a.details)).indexOf('@') < 0, 'import: the audit row carries counts only — no address, no name, no line');
r = imp(SESS, { text: CSV, format: 'auto' });
ok(r.success && r.format === 'csv' && r.rows === 3 && r.matched === 2 && r.unmatched === 2 && prop((p) => p.matched && p.contactId === 'c-0000000000002' && p.kind === 'email-out' && p.ref === '<m1@stub>').length === 1 && prop((p) => !p.matched && p.reason === 'no_date').length === 1,
   'import: the CSV is detected; Jane and Pat matched on the two-recipient row, the stranger unmatched, the date-less row flagged');
r = imp(SESS, { text: CSV, format: 'csv', kind: 'email-in' });
ok(r.success && r.proposals.every((p) => p.kind === 'email-in') && r.matched === 0 && r.unmatched >= 2, 'import: kind=email-in on a file with no direction column reads From — the session\'s own address, so nothing matches');
r = imp(VIEW, { text: ICS });
ok(r.success && r.matched === 3, 'import: a view-only share can propose (a read)');
// 9. nop=importconfirm — only the ticked rows, each one Interaction
const confirm = (sess, p) => nw('nwImportConfirmOp_')(sess, p);
const REF = 'Outlook calendar export, Sep 2026';
ok(confirm(SESS, { rows: JSON.stringify([jane1]) }).error === 'reference_required' && confirm(SESS, { reference: REF, rows: '[]' }).error === 'rows_required' && confirm(SESS, { reference: REF, rows: JSON.stringify(Array.from({ length: nw('NW_IMPORT_ROWS_MAX') + 1 }, () => jane1)) }).error === 'too_many_rows',
   'confirm: no reference, no rows and too many rows are refused before any read');
ok(confirm(VIEW, { owner: OWNER, reference: REF, rows: JSON.stringify([jane1]) }).error === 'view_only' && ixRows() === n0, 'confirm: a view-only share of OWNER (the drafts flow\'s owner param) writes nothing');
const ticked = [
  { contactId: 'c-0000000000001', kind: 'calendar', date: ago(2), line: jane1.line, ref: 'evt-1@stub.example' },
  { contactId: 'c-0000000000003', kind: 'calendar', date: ago(7), line: 'Trade dinner', ref: 'evt-2@stub.example' },
  { contactId: '', kind: 'calendar', date: ago(2), line: 'unmatched stranger', ref: '' },            // the unmatched row, sent anyway → refused
  { contactId: 'c-0000000000001', kind: 'scan', date: ago(2), line: 'a scan through the import', ref: '' },   // off-list kind
  { contactId: 'c-0000000000001', kind: 'email-out', date: '22/09/2026', line: 'bad date', ref: '' },
  { contactId: 'c-0000000000008', kind: 'email-in', date: ago(2), line: 'deleted contact', ref: '' },
  { contactId: 'c-0000000000007', kind: 'email-in', date: ago(2), line: 'another owner', ref: '' },
  { contactId: 'c-0000000000002', kind: 'email-out', date: ago(4), line: 'Quote, revised', ref: '<m1@stub>' }
];
a1 = NW.__counters.audit.length;
r = confirm(SESS, { reference: REF, rows: JSON.stringify(ticked) });
ok(r.success && r.written === 3 && r.rejected.map((x) => x.index + ':' + x.reason).join(',') === '2:bad_contact_id,3:bad_kind,4:bad_date,5:deleted,6:not_found' && r.interactionIds.length === 3 && r.interactionIds.every((id) => /^i-[0-9a-z]{13}$/.test(id)),
   'confirm: three written, five refused per row by name (' + JSON.stringify(r.rejected) + ')');
ok(ixRows() === n0 + 3 && NW.__counters.revs === 1, 'confirm: exactly three Interactions appended, the data revision bumped once');
const H = tabs.interactions.rows[0], col = (n) => H.indexOf(n), last3 = tabs.interactions.rows.slice(-3);
ok(last3[0][col('Contact ID')] === 'c-0000000000001' && last3[0][col('Account ID')] === 'a-0000000000001' && last3[0][col('Kind')] === 'calendar' && last3[0][col('Date')] === ago(2) && last3[0][col('Summary')] === jane1.line
   && last3[0][col('Evidence Link')] === REF + ' · evt-1@stub.example' && last3[0][col('Event Slug')] === '' && last3[0][col('Owner')] === OWNER,
   'confirm: the row — the contact and its account, the kind, the day, the one line as Summary, the reference · UID as Evidence Link, no event slug');
ok(last3[2][col('Kind')] === 'email-out' && last3[2][col('Evidence Link')] === REF + ' · <m1@stub>' && last3[2][col('Summary')] === 'Quote, revised', 'confirm: an email-out row carries the reference · Message-ID');
ok(JSON.stringify(tabs.interactions.rows).indexOf('body of the invite') < 0 && JSON.stringify(tabs.interactions.rows).indexOf('hello') < 0, 'confirm: no body and no subject beyond the one line reach the tab');
const ca = NW.__counters.audit.slice(a1).find((a) => a.op === 'network_importconfirm');
ok(ca && Object.keys(ca.details).sort().join(',') === 'rejected,rows,written' && ca.details.written === 3 && ca.details.rejected === 5 && JSON.stringify(ca.details).indexOf(REF) < 0, 'confirm: the audit row carries counts only — never the reference or a line');
r = confirm(SESS, { reference: REF, rows: JSON.stringify(ticked.slice(0, 2)) });
ok(r.success && r.written === 0 && r.rejected.length === 2 && r.rejected.every((x) => x.reason === 'duplicate') && ixRows() === n0 + 3, 'confirm: a re-confirm of the same rows is refused as duplicate — nothing appended');
r = imp(SESS, { text: ICS });
ok(r.proposals.filter((p) => p.matched && p.duplicate).length === 2 && r.proposals.filter((p) => p.matched && !p.duplicate).length === 1, 'import: a re-paste proposes the recorded rows as duplicate (the page leaves them unticked)');
r = confirm(SESS, { reference: 'x'.repeat(300), rows: JSON.stringify([{ contactId: 'c-0000000000006', kind: 'calendar', date: ago(5), line: 'y'.repeat(300), ref: 'z'.repeat(300) }]) });
ok(r.success && r.written === 1 && tabs.interactions.rows[tabs.interactions.rows.length - 1][col('Summary')].length === 120 && tabs.interactions.rows[tabs.interactions.rows.length - 1][col('Evidence Link')].length === 200 + 3 + 120, 'confirm: the line is bounded at 120, the reference at 200 and the ref at 120');
r = nw('nwListOp_')(SESS, {});
ok(r.contacts.find((c) => c.id === 'c-0000000000003').lastTouch === ago(7) && r.contacts.find((c) => c.id === 'c-0000000000003').warmthBand === 'warm', 'after the import: Sam\'s last touch and warmth move on the very next list (nothing cached, nothing stored)');
r = nw('nwReconnectOp_')(SESS, {});
ok(!r.contacts.some((c) => c.id === 'c-0000000000003') && !r.contacts.some((c) => c.id === 'c-0000000000001') && r.contacts.length === 1 && r.contacts[0].id === 'c-0000000000005', 'after the import: Sam and Jane have left the reconnect list — only No Touch remains');
// 10. D15 — no mail or calendar scope anywhere; zero live calls
const scopeRe = /\b(MailApp|GmailApp|CalendarApp)\s*\.|gmail\.(send|compose|modify|readonly|metadata)|\bcalendar\.(readonly|events)\b|mail\.google\.com/;   // the verifier's D15 regex + CalendarApp and the calendar scopes
ok(!scopeRe.test(region), 'D15: the .gs PROJECT region calls no MailApp / GmailApp / CalendarApp and names no gmail.* or calendar.* scope');
ok(!/\b(GmailApp|CalendarApp)\b/.test(page) && !/gmail\.(send|compose|modify|readonly)/.test(page), 'D15: the page names no GmailApp / CalendarApp and no gmail.* scope');
ok(!/ScriptApp\.newTrigger|\.timeBased\(\)/.test(region.slice(region.indexOf('N4 session 1'))), 'D15: the N4 section installs no trigger');
ok(NW.__counters.fetch === 0, 'zero UrlFetchApp calls (saw ' + NW.__counters.fetch + ')');

console.log((failures ? 'FAILED ' + failures + ' of ' : 'OK — ') + checks + ' checks' + (failures ? '' : ' passed — warmth and the bands against hand-computed values, the cadence table, the list row and the detail from one read, the reconnect list most overdue first with the excluded rows, the .ics and CSV parsers, a proposal that writes nothing, a confirm that writes only the ticked rows with the reference as evidence, the duplicate refusal, no mail or calendar scope, zero live calls'));
process.exit(failures ? 1 : 0);

// Developed by: LightAISolutions
