#!/usr/bin/env node
// N4 session 2 — the pre-meeting brief, promote to field note and the "will
// be at" event names, proved offline (design plan §13.16 step 3; §4.4; D4 ·
// D9 · D15 · D16; NETWORK-SCHEMA.md §8 · §11 · §12).
//
// The REAL functions are lifted out of Network.gs (the check-network-warmth.js
// idiom) and run in one isolated VM context with stubbed PropertiesService /
// SpreadsheetApp / UrlFetchApp — nwBriefOp_, nwPromoteOp_ with the real
// nwProfilerIntake_ and nwInteractionAdd_, nwSignalsOp_ with the real
// nwSignalRows_ / nwSignalEvents_ / nwEventsProxy_ — so the shapes, the
// refusals and the one call each op makes are the ones the live app makes.
// UrlFetchApp is routed to two in-memory stubs (Events' /exec answering
// eop=signals, Profiler's /exec answering action=note nop=submit) and
// anything else is counted as an escaped call. It asserts:
//   · nop=brief: every section present (contact, account, interactions
//     newest first, the account's signals with the event names, the warmth
//     block, the stage), nothing beyond the contact's own account (another
//     account's signals and another owner's rows never answered), the
//     disclosure row written with the op, the count and the id, the audit
//     row ids and counts only; bad_contact_id, not_found, deleted; a view
//     share reads; the uncovered account carries an empty slug
//   · nop=signals: the rows carry eventName / eventStart from Events'
//     eop=signals (one call per read), a slug with no registry name stays a
//     slug, Events not_configured → eventsConfigured:false and the rows
//     still answer, a read with no event rows makes zero calls
//   · nop=promote: the payload posted to Profiler's EXISTING note op —
//     action=note · nop=submit · sourceType=contact · the developer's
//     session · the confidence bounded 0–100 · the i- id (and the row's own
//     evidence) in the note text · the account's slug (general when
//     uncovered); the note Interaction recording it (promoted:<i- id>:<intake
//     id>); a second promote refused as duplicate with zero calls; every
//     refusal by name before any call (bad_interaction_id, bad_confidence ×4,
//     profiler_session_required, not_found for another owner's row, deleted,
//     view_only); Profiler's SESSION_EXPIRED / ADMIN_ONLY / INVALID_INPUT
//     relayed by name with nothing written; the source row's Evidence Link
//     untouched; the audit row ids and a flag only, never the session
//   · D15 and D17 greps on the PROJECT region and the served page; zero
//     calls escape the two stubs
//
// Usage:  node scripts/check-network-brief.js
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
  const counters = { openById: 0, fetch: 0, fetched: [], routes: [], escaped: 0, audit: [], reads: 0, revs: 0, disclosures: [] };
  const ctx = {
    PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null), setProperty: (k, v) => { props[k] = String(v); } }) },
    SpreadsheetApp: { openById: () => { counters.openById++; return ss; } },
    UrlFetchApp: { fetch: (url, opts) => { counters.fetch++; counters.fetched.push({ url: String(url), opts: opts || {} }); const h = counters.routes.find((r) => String(url).indexOf(r.prefix) === 0); if (!h) { counters.escaped++; throw new Error('offline'); } const body = h.answer(String(url), opts || {}); return { getResponseCode: () => (h.status || 200), getContentText: () => (typeof body === 'string' ? body : JSON.stringify(body)) }; } },
    CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) },
    Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' },
      computeDigest: (alg, s) => Array.from(crypto.createHash('sha256').update(String(s)).digest()).map((b) => (b > 127 ? b - 256 : b)),
      formatDate: (d) => new Date(d).toISOString().slice(0, 10) },
    Session: { getScriptTimeZone: () => 'America/New_York' },
    Logger: { log() {} },
    auditLog: (ev, user, op, details) => { counters.audit.push({ ev, user, op, details }); },
    bumpDataRev() { counters.revs++; },
    recordDisclosure: (params) => { counters.disclosures.push(params); },
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
const EVENTS_TOKEN = 'events-peer-token-0123456789';
const NW = makeCtx({ EVENTS_PEER_TOKEN: EVENTS_TOKEN });
vm.runInContext('var SPREADSHEET_ID = "stub";\n' + [
  'NW_RELATIONSHIPS', 'NW_STAGES', 'NW_ROLES', 'NW_INTERACTION_KINDS', 'NW_SIGNAL_KINDS', 'NW_CONSENT', 'NW_ID_RE', 'NW_ID_PREFIXES', 'NW_TABS', 'NW_ROLE_CAPS',
  'NW_STAGE_RELATIONSHIPS', 'NW_DATE_RE', 'NW_WARMTH_WEIGHTS', 'NW_WARMTH_HALF_LIFE_DAYS', 'NW_WARMTH_BANDS', 'NW_CADENCE_DAYS',
  'NW_PEER_TOKEN_PROP', 'NW_EVENTS_TOKEN_PROP', 'EVENTS_PEER_EXEC', 'NW_PEER_SLUG_RE',
  'PROFILER_INTAKE_EXEC', 'NW_PROMOTE_NOTE_MAX', 'NW_PROMOTE_MARK', 'NW_PROMOTE_LEARNED_MAX', 'NW_PROMOTE_EXCERPT_MAX', 'NW_BRIEF_SIGNALS_MAX'
].map((n) => constant(nwSrc, n)).join('\n') + '\n'
  + 'function resolveOwnerSet_(user, forOwner) { var set = {}; set[String(user.email).toLowerCase()] = "own"; if (user.also) set[user.also] = "view"; return { set: set }; }\n'
  + 'function resolveOwnerScope_(user, forOwner, needEdit) { var me = String(user.email).toLowerCase(); var t = String(forOwner || "").toLowerCase(); if (!t || t === me) return { owner: me, scope: "own" }; if (user.also === t) return needEdit ? { error: "view_only" } : { owner: t, scope: "view" }; return { error: "not_shared" }; }\n'
  + ['ensureNetworkTabs_', 'nwListRows_', 'nwSheetRead_', 'nwRowObj_', 'nwFindRow_', 'nwOwned_', 'nwWriteRow_', 'nwArr_', 'nwObj_', 'nwStr_', 'nwNow_', 'nwNewId_', 'nwRandomBase36_',
     'nwInteractionAdd_', 'nwContactPublic_', 'nwAccountPublic_', 'nwRoleOf_',
     'nwCadenceDays_', 'nwDayKey_', 'nwDaysBetween_', 'nwWarmth_', 'nwWarmthBand_', 'nwWarmthDetail_',
     'nwEventsProxy_', 'nwSignalRows_', 'nwSignalEvents_', 'nwSignalsNamed_', 'nwSignalsOp_',
     'nwBriefOp_', 'nwPromoteText_', 'nwProfilerIntake_', 'nwPromoteOp_'
    ].map((n) => extract(nwSrc, n)).join('\n'), NW, { filename: 'Network.brief.js' });
const nw = (name) => vm.runInContext(name, NW);
const NOW = Date.now(), now = new Date(NOW).toISOString();
const ago = (n) => new Date(NOW - n * 86400000).toISOString().slice(0, 10);
const EVENTS_EXEC = nw('EVENTS_PEER_EXEC'), PROFILER_EXEC = nw('PROFILER_INTAKE_EXEC');
ok(/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]{40,}\/exec$/.test(PROFILER_EXEC) && PROFILER_EXEC !== EVENTS_EXEC, 'constants: PROFILER_INTAKE_EXEC is a /exec URL distinct from Events\'');
ok(P('googleAppsScripts/Profiler/Profiler.config.json').indexOf(PROFILER_EXEC.split('/s/')[1].split('/')[0]) > 0, 'constants: PROFILER_INTAKE_EXEC carries Profiler.config.json\'s DEPLOYMENT_ID');
ok(nw('NW_PROMOTE_MARK') === 'promoted:' && nw('NW_PROMOTE_NOTE_MAX') === 4000, 'constants: the promoted: marker and Profiler\'s 4,000-character note ceiling');

// ── The two stubs — Events' and Profiler's /exec ──────────────────────────
const stubs = { events: { mode: 'ok', calls: [] }, profiler: { mode: 'ok', calls: [], seq: 0 } };
const qs = (url) => { const out = {}; (url.split('?')[1] || '').split('&').forEach((kv) => { const i = kv.indexOf('='); out[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1)); }); return out; };
NW.__counters.routes.push({ prefix: EVENTS_EXEC, answer: (url) => {
  const q = qs(url); stubs.events.calls.push(q);
  if (stubs.events.mode === 'not_configured') return { success: false, error: 'not_configured' };
  if (stubs.events.mode === 'html') return '<html>Apps Script exception</html>';
  if (q.t !== EVENTS_TOKEN || q.eop !== 'signals') return { success: false, error: 'denied' };
  const named = { 're-plus-2026': ['RE+ 2026', '2026-09-08'], 'other-expo-2027': ['Other Expo 2027', '2027-03-02'] };
  const rows = (q.accountId === 'a-0000000000001') ? [['re-plus-2026', 'exhibitor'], ['re-plus-2026', 'speaker'], ['unknown-show-2026', 'agenda']] : (q.accountId === 'a-0000000000002' ? [['other-expo-2027', 'exhibitor']] : []);
  return { success: true, signals: rows.map(([slug, kind]) => ({ eventSlug: slug, name: named[slug] ? named[slug][0] : '', start: named[slug] ? named[slug][1] : '', kind, confidence: 0.9, evidenceUrl: 'https://example.com/e' })) };
} });
NW.__counters.routes.push({ prefix: PROFILER_EXEC, answer: (url, opts) => {
  const payload = (opts && opts.payload) || {}; stubs.profiler.calls.push({ url, method: opts.method, payload: Object.assign({}, payload) });
  if (stubs.profiler.mode === 'expired') return { success: false, error: 'SESSION_EXPIRED' };
  if (stubs.profiler.mode === 'admin') return { success: false, error: 'ADMIN_ONLY', role: 'viewer' };
  if (stubs.profiler.mode === 'invalid') return { success: false, error: 'INVALID_INPUT' };
  if (stubs.profiler.mode === 'html') return '<html>exception</html>';
  if (payload.action !== 'note' || payload.nop !== 'submit' || !payload.session || payload.session.length < 32) return { success: false, error: 'SESSION_EXPIRED' };
  stubs.profiler.seq++;
  return { success: true, id: 'note-20260923-0' + stubs.profiler.seq, slug: payload.slug, confidence: Number(payload.confidence), files: 0, canSummarize: false };
} });

// ── Fixtures ──────────────────────────────────────────────────────────────
const tabs = nw('ensureNetworkTabs_')();
const H = (t) => tabs[t].rows[0];
const put = (t, obj) => { const h = H(t); tabs[t].appendRow(h.map((k) => (obj[k] === undefined ? '' : obj[k]))); };
put('accounts', { 'Account ID': 'a-0000000000001', Owner: OWNER, Name: 'Acme Storage', 'Normalised Name': 'acme storage', 'Profiler Slug': 'acme-storage', Relationship: 'target', Stage: 'discovery', 'Segment IDs': '["utilities"]', Tags: '["priority","hvdc"]', HQ: 'Denver, US', Notes: 'Account note — never a card field in an audit row', 'Created At': now, 'Updated At': now });
put('accounts', { 'Account ID': 'a-0000000000002', Owner: OWNER, Name: 'Bolt Supply', 'Normalised Name': 'bolt supply', 'Profiler Slug': '', Relationship: 'partner', Stage: 'none', 'Segment IDs': '[]', Tags: '[]', 'Created At': now, 'Updated At': now });
put('accounts', { 'Account ID': 'a-0000000000004', Owner: OTHER, Name: 'Theirs', 'Normalised Name': 'theirs', 'Profiler Slug': 'theirs', Relationship: 'target', Stage: 'none', 'Segment IDs': '[]', Tags: '[]', 'Created At': now, 'Updated At': now });
const contact = (id, owner, acc, name, role, extra) => put('contacts', Object.assign({ 'Contact ID': id, Owner: owner, 'Account ID': acc, 'Full Name': name, First: name.split(' ')[0], Last: name.split(' ')[1] || '', Title: 'VP Storage', Role: role,
  Emails: JSON.stringify([{ value: name.split(' ')[0].toLowerCase() + '@x.example', kind: 'work' }]), Phones: '[{"number":"+1 555 0100","kind":"mobile"}]', Socials: '[]', Languages: '[]', 'Source Event': 're-plus-2026', 'Met Date': ago(40),
  'Consent Marketing': 'unknown', 'Do Not Contact': 'false', Tags: '["met-at-booth"]', Notes: 'Likes HVDC', 'Raw Extraction': '{"secret":"raw"}', 'Card Front Link': 'https://drive.example/front', 'Created At': now, 'Updated At': now }, extra || {}));
contact('c-0000000000001', OWNER, 'a-0000000000001', 'Jane Doe', 'champion');
contact('c-0000000000002', OWNER, 'a-0000000000002', 'Sam Pen', 'point-of-contact');
contact('c-0000000000003', OWNER, 'a-0000000000001', 'Gone Row', 'other', { 'Deleted At': now });
contact('c-0000000000007', OTHER, 'a-0000000000004', 'Their Person', 'champion');
const ix = (id, owner, cid, aid, kind, date, summary, evidence, slug) => put('interactions', { 'Interaction ID': id, Owner: owner, 'Contact ID': cid, 'Account ID': aid, Kind: kind, Date: date, Summary: summary, 'Evidence Link': evidence || '', 'Event Slug': slug || '', 'Created At': now });
ix('i-0000000000001', OWNER, 'c-0000000000001', 'a-0000000000001', 'scan', ago(40), 'Card scanned', 'https://drive.example/front', 're-plus-2026');
ix('i-0000000000002', OWNER, 'c-0000000000001', 'a-0000000000001', 'meeting', ago(10), 'Booth chat — wants a 34.5 kV quote', '', 're-plus-2026');
ix('i-0000000000003', OWNER, 'c-0000000000001', 'a-0000000000001', 'email-out', ago(3), 'Follow-up sent: Quote', 'd-0000000000001');
ix('i-0000000000004', OWNER, 'c-0000000000002', 'a-0000000000002', 'note', ago(200), 'Met at a dinner');
ix('i-0000000000005', OWNER, 'c-0000000000003', 'a-0000000000001', 'meeting', ago(5), 'On a deleted contact');
ix('i-0000000000006', OTHER, 'c-0000000000007', 'a-0000000000004', 'meeting', ago(1), 'Theirs');
const sig = (id, owner, aid, cid, slug, kind, person, title, url, conf, note) => put('signals', { 'Signal ID': id, Owner: owner, 'Account ID': aid, 'Contact ID': cid || '', 'Event Slug': slug, Kind: kind, 'Person Name': person || '', 'Person Title': title || '', 'Evidence URL': url, 'First Seen': now, 'Last Seen': now, Confidence: conf, Note: note || '', Source: 'events' });
sig('s-0000000000001', OWNER, 'a-0000000000001', '', 're-plus-2026', 'exhibitor', '', '', 'https://example.com/exhibitors', 0.9);
sig('s-0000000000002', OWNER, 'a-0000000000001', 'c-0000000000001', 're-plus-2026', 'speaker', 'Jane Doe', 'VP Storage', 'https://example.com/speakers', 0.9);
sig('s-0000000000003', OWNER, 'a-0000000000001', '', '', 'press-quote', 'Pat Ledger', 'CFO', 'corpus:abc123', 0.7, 'quoted on tariffs');
sig('s-0000000000004', OWNER, 'a-0000000000001', '', 'unknown-show-2026', 'agenda', '', '', 'https://example.com/agenda', 0.9);
sig('s-0000000000005', OWNER, 'a-0000000000002', '', 'other-expo-2027', 'exhibitor', '', '', 'https://example.com/other', 0.9);
sig('s-0000000000006', OTHER, 'a-0000000000004', '', 're-plus-2026', 'exhibitor', '', '', 'https://example.com/theirs', 0.9);
const ixRows = () => tabs.interactions.rows.length - 1;
const audits = (op) => NW.__counters.audit.filter((a) => a.op === op);

// 1. nop=signals — the event names
let f0 = NW.__counters.fetch;
let r = nw('nwSignalsOp_')(SESS, { accountId: 'a-0000000000001' });
ok(r.success && r.signals.length === 4 && r.eventsConfigured === true && NW.__counters.fetch === f0 + 1 && stubs.events.calls.length === 1 && stubs.events.calls[0].eop === 'signals' && stubs.events.calls[0].accountId === 'a-0000000000001' && stubs.events.calls[0].owner === OWNER,
   'signals: the four rows of the account, ONE eop=signals call for the owner and the account (saw ' + (NW.__counters.fetch - f0) + ')');
const byId = {}; r.signals.forEach((s) => { byId[s.id] = s; });
ok(byId['s-0000000000001'].eventName === 'RE+ 2026' && byId['s-0000000000001'].eventStart === '2026-09-08' && byId['s-0000000000002'].eventName === 'RE+ 2026' && byId['s-0000000000002'].personName === 'Jane Doe',
   'signals: rows naming an event carry eventName / eventStart from Events; the person rides where the row names one');
ok(!('eventName' in byId['s-0000000000003']) && !('eventName' in byId['s-0000000000004']) && byId['s-0000000000004'].eventSlug === 'unknown-show-2026', 'signals: a press quote with no event and a slug Events does not know stay unnamed (the chip shows the slug)');
ok(JSON.stringify(r.events) === JSON.stringify({ 're-plus-2026': { name: 'RE+ 2026', start: '2026-09-08' } }), 'signals: the events map carries only the named slugs');
let au = audits('network_signals').pop();
ok(au && Object.keys(au.details).sort().join(',') === 'accountId,contactId,events,signals' && au.details.signals === 4 && au.details.events === 1, 'signals: the audit row carries the ids and two counts');
r = nw('nwSignalsOp_')(SESS, { contactId: 'c-0000000000001' });
ok(r.success && r.accountId === 'a-0000000000001' && r.signals.length === 4 && r.signals.some((s) => s.eventName === 'RE+ 2026'), 'signals: a contactId resolves to its account and is named the same way');
stubs.events.mode = 'not_configured';
r = nw('nwSignalsOp_')(SESS, { accountId: 'a-0000000000001' });
ok(r.success && r.signals.length === 4 && r.eventsConfigured === false && !r.signals.some((s) => s.eventName) && JSON.stringify(r.events) === '{}', 'signals: Events not configured → the rows still answer on their slugs, eventsConfigured:false');
stubs.events.mode = 'html';
r = nw('nwSignalsOp_')(SESS, { accountId: 'a-0000000000001' });
ok(r.success && r.signals.length === 4 && r.eventsConfigured === true && !r.signals.some((s) => s.eventName), 'signals: an upstream_not_json answer from Events degrades to slugs — never a failure');
stubs.events.mode = 'ok';
NW.__props.EVENTS_PEER_TOKEN = 'short'; f0 = NW.__counters.fetch;
r = nw('nwSignalsOp_')(SESS, { accountId: 'a-0000000000001' });
ok(r.success && r.eventsConfigured === false && NW.__counters.fetch === f0, 'signals: a sub-16-character Events token is not_configured with zero calls');
NW.__props.EVENTS_PEER_TOKEN = EVENTS_TOKEN;
put('accounts', { 'Account ID': 'a-0000000000003', Owner: OWNER, Name: 'Grid Co', 'Normalised Name': 'grid co', Relationship: 'supplier', Stage: 'none', 'Segment IDs': '[]', Tags: '[]', 'Created At': now, 'Updated At': now });
sig('s-0000000000007', OWNER, 'a-0000000000003', '', '', 'press-quote', 'Dee Enn', '', 'corpus:zzz', 0.7);
f0 = NW.__counters.fetch;
r = nw('nwSignalsOp_')(SESS, { accountId: 'a-0000000000003' });
ok(r.success && r.signals.length === 1 && NW.__counters.fetch === f0 && r.eventsConfigured === true, 'signals: rows naming no event make zero calls to Events');
ok(nw('nwSignalsOp_')(SESS, { accountId: 'a-0000000000004' }).signals.length === 0, 'signals: another owner\'s account answers no rows');

// 2. nop=brief
f0 = NW.__counters.fetch; const d0 = NW.__counters.disclosures.length;
r = nw('nwBriefOp_')(SESS, { contactId: 'c-0000000000001', session: 'sess-token' });
ok(r.success && r.contact && r.account && r.interactions && r.signals && r.warmth && r.stage === 'discovery' && r.built && r.events, 'brief: every section present — contact, account, interactions, signals, events, warmth, stage');
ok(r.contact.id === 'c-0000000000001' && r.contact.fullName === 'Jane Doe' && r.contact.emails.length === 1 && r.contact.tags[0] === 'met-at-booth' && r.contact.notes === 'Likes HVDC' && r.contact.metDate === ago(40) && r.contact.sourceEvent === 're-plus-2026' && r.contact.dnc === false,
   'brief: the contact — name, title, emails, tags, notes, met date and event, the do-not-contact flag');
ok(!('frontLink' in r.contact) && !('backLink' in r.contact) && JSON.stringify(r.contact).indexOf('drive.example') < 0 && JSON.stringify(r).indexOf('"secret"') < 0 && !('rawExtraction' in r.contact), 'brief: the raw extraction and the card links never leave the server (the scan row keeps its own evidence link)');
ok(r.account.id === 'a-0000000000001' && r.account.slug === 'acme-storage' && r.account.stage === 'discovery' && r.account.tags.join(',') === 'priority,hvdc' && r.account.notes.indexOf('Account note') === 0 && r.account.hq === 'Denver, US' && r.account.segmentIds[0] === 'utilities',
   'brief: the account — slug, stage, tags, notes, HQ, segments');
ok(r.interactions.length === 3 && r.interactions.map((i) => i.id).join(',') === 'i-0000000000003,i-0000000000002,i-0000000000001' && r.interactions[0].evidence === 'd-0000000000001' && r.interactions[2].eventSlug === 're-plus-2026',
   'brief: the contact\'s three Interactions newest first with kind, summary, evidence and event — the deleted contact\'s and another owner\'s never');
ok(r.signals.length === 4 && r.signals.every((s) => s.accountId === 'a-0000000000001') && r.signals.filter((s) => s.eventName === 'RE+ 2026').length === 2 && r.events['re-plus-2026'].name === 'RE+ 2026' && NW.__counters.fetch === f0 + 1,
   'brief: the account\'s four signals named by ONE eop=signals call — Bolt\'s and Theirs\' rows never');
ok(r.warmth.band === 'hot' && r.warmth.score === Math.round((2 * Math.pow(0.5, 10 / 90) + Math.pow(0.5, 3 / 90) + Math.pow(0.5, 40 / 90)) * 100) / 100 && r.warmth.cadenceDays === 30 && r.warmth.lastTouch === ago(3),
   'brief: the warmth block — score, band, cadence and last touch from the rows just read');
const disc = NW.__counters.disclosures.slice(d0);
ok(disc.length === 1 && disc[0].purpose === 'network_brief' && disc[0].phiDescription === 'network_brief rows=1 ids=c-0000000000001' && disc[0].sessionToken === 'sess-token' && disc[0].individualEmail === OWNER && disc[0].dataCategory === 'Network',
   'brief: ONE disclosure row through recordDisclosure — the op, the count and the id, never a field (' + JSON.stringify(disc[0] && disc[0].phiDescription) + ')');
au = audits('network_brief').pop();
ok(au && au.ev === 'data_export' && Object.keys(au.details).sort().join(',') === 'contactId,events,interactions,signals' && au.details.interactions === 3 && au.details.signals === 4 && JSON.stringify(au.details).indexOf('Jane') < 0,
   'brief: the audit row is a data_export with the id and counts only');
r = nw('nwBriefOp_')(SESS, { contactId: 'c-0000000000002', session: 'sess-token' });
ok(r.success && r.account.slug === '' && r.signals.length === 1 && r.signals[0].eventName === 'Other Expo 2027' && r.stage === 'none' && r.warmth.band === 'cold', 'brief: an uncovered contact — the account carries an empty slug (the page writes "not covered"), the stage none, its own account\'s one signal named');
ok(nw('nwBriefOp_')(SESS, { contactId: 'x' }).error === 'bad_contact_id' && nw('nwBriefOp_')(SESS, { contactId: 'a-0000000000001' }).error === 'bad_contact_id' && nw('nwBriefOp_')(SESS, { contactId: 'c-0000000000007' }).error === 'not_found' && nw('nwBriefOp_')(SESS, { contactId: 'c-0000000000003' }).error === 'deleted',
   'brief: bad_contact_id, another owner\'s contact not_found, a deleted contact deleted');
const dBefore = NW.__counters.disclosures.length;
ok(nw('nwBriefOp_')(VIEW, { contactId: 'c-0000000000001', session: 'v' }).success && NW.__counters.disclosures.length === dBefore + 1, 'brief: a view share reads the brief and writes its own disclosure row');
ok(NW.__counters.disclosures.length === dBefore + 1 && audits('network_brief').length === 3, 'brief: refusals write no disclosure row and no export audit');

// 3. nop=promote
const PSESS = 'profiler-session-token-abcdefghijklmnop';
const LEARNED = 'Their 2027 tender opens in Q1; procurement moved to Austin.';
const promote = (sess, p) => nw('nwPromoteOp_')(sess, Object.assign({ learned: LEARNED }, p));
f0 = NW.__counters.fetch; let n0 = ixRows();
ok(promote(SESS, { interactionId: 'nope', confidence: 70, profilerSession: PSESS }).error === 'bad_interaction_id' && promote(SESS, { interactionId: 'c-0000000000001', confidence: 70, profilerSession: PSESS }).error === 'bad_interaction_id', 'promote: bad_interaction_id');
ok(['-1', '101', 'x', ''].every((c) => promote(SESS, { interactionId: 'i-0000000000002', confidence: c, profilerSession: PSESS }).error === 'bad_confidence'), 'promote: the confidence is bounded 0–100 (−1, 101, x, empty refused)');
ok(['', '   ', null].every((t) => promote(SESS, { interactionId: 'i-0000000000002', confidence: 70, learned: t, profilerSession: PSESS }).error === 'learned_required'), 'promote: what was learned is required (empty, blank and missing refused)');
ok(promote(SESS, { interactionId: 'i-0000000000002', confidence: 70, learned: 'x'.repeat(3001), profilerSession: PSESS }).error === 'learned_too_long' && nw('NW_PROMOTE_LEARNED_MAX') === 3000, 'promote: what was learned is bounded at 3,000 characters');
ok(promote(SESS, { interactionId: 'i-0000000000002', confidence: 70 }).error === 'profiler_session_required' && promote(SESS, { interactionId: 'i-0000000000002', confidence: 70, profilerSession: 'short' }).error === 'profiler_session_required', 'promote: no or a short Profiler session is refused by name');
ok(promote(SESS, { interactionId: 'i-0000000000006', confidence: 70, profilerSession: PSESS }).error === 'not_found' && promote(SESS, { interactionId: 'i-0000000000009', confidence: 70, profilerSession: PSESS }).error === 'not_found', 'promote: another owner\'s row and an unknown id answer not_found');
ok(promote(SESS, { interactionId: 'i-0000000000005', confidence: 70, profilerSession: PSESS }).error === 'deleted', 'promote: a row on a deleted contact is refused');
ok(promote(VIEW, { owner: OWNER, interactionId: 'i-0000000000002', confidence: 70, profilerSession: PSESS }).error === 'view_only', 'promote: a view-only share writes nothing');
ok(NW.__counters.fetch === f0 && ixRows() === n0 && stubs.profiler.calls.length === 0, 'promote: every refusal above made zero calls and wrote nothing');
r = promote(SESS, { interactionId: 'i-0000000000002', confidence: '72.4', profilerSession: PSESS });
ok(r.success && r.intakeId === 'note-20260923-01' && r.interactionId === 'i-0000000000002' && r.contactId === 'c-0000000000001' && r.slug === 'acme-storage' && r.confidence === 72 && /^i-[0-9a-z]{13}$/.test(r.noteInteractionId),
   'promote: the meeting is promoted — the intake id, the slug, the rounded confidence, the note Interaction id (' + JSON.stringify(r) + ')');
const call = stubs.profiler.calls[0];
ok(stubs.profiler.calls.length === 1 && call.url === PROFILER_EXEC && call.method === 'post' && call.payload.action === 'note' && call.payload.nop === 'submit' && call.payload.session === PSESS && call.payload.sourceType === 'contact' && call.payload.slug === 'acme-storage' && call.payload.confidence === '72',
   'promote: ONE post to Profiler\'s existing note op — action=note · nop=submit · the developer\'s session · sourceType=contact · the slug · the confidence');
ok(call.payload.note.indexOf(LEARNED + ' — Context: Meeting with Jane Doe (VP Storage, Acme Storage) on ' + ago(10)) === 0 && call.payload.note.indexOf('Booth chat — wants a 34.5 kV quote') > 0 && call.payload.note.indexOf('[Network interaction i-0000000000002 · event re-plus-2026]') > 0 && call.payload.note.length <= 4000,
   'promote: the note text — what was learned first, then the context: the kind, the person and account, the day, the summary, the i- id as evidence and the event (' + JSON.stringify(call.payload.note) + ')');
ok(ixRows() === n0 + 1 && NW.__counters.revs === 1, 'promote: exactly one Interaction appended, the data revision bumped once');
const last = tabs.interactions.rows[tabs.interactions.rows.length - 1], col = (n) => H('interactions').indexOf(n);
ok(last[col('Kind')] === 'note' && last[col('Contact ID')] === 'c-0000000000001' && last[col('Account ID')] === 'a-0000000000001' && last[col('Evidence Link')] === 'promoted:i-0000000000002:note-20260923-01' && last[col('Summary')] === 'Promoted to a Profiler field note (confidence 72/100): ' + LEARNED && last[col('Event Slug')] === 're-plus-2026' && last[col('Date')] === now.slice(0, 10),
   'promote: the note Interaction — kind note, the contact and account, promoted:<i- id>:<intake id> as its evidence, the source row\'s event');
const src = tabs.interactions.rows.find((x) => x[0] === 'i-0000000000002');
ok(src[col('Evidence Link')] === '' && src[col('Summary')] === 'Booth chat — wants a 34.5 kV quote', 'promote: the source Interaction is untouched (§3 — its Evidence Link keeps its own evidence)');
au = audits('network_promote').pop();
ok(au && Object.keys(au.details).sort().join(',') === 'contactId,interactionId,ok' && au.details.ok === 1 && JSON.stringify(NW.__counters.audit).indexOf(PSESS) < 0, 'promote: the audit row carries the two ids and a flag — never the Profiler session or the note');
f0 = NW.__counters.fetch; n0 = ixRows();
r = promote(SESS, { interactionId: 'i-0000000000002', confidence: 90, profilerSession: PSESS });
ok(r.error === 'duplicate' && r.intakeId === 'note-20260923-01' && NW.__counters.fetch === f0 && ixRows() === n0, 'promote: a second promote of the same row is refused as duplicate with zero calls and nothing written');
r = promote(SESS, { interactionId: 'i-0000000000003', confidence: 55, profilerSession: PSESS });
ok(r.success && stubs.profiler.calls[1].payload.note.indexOf(LEARNED + ' — Context: Email out with Jane Doe') === 0 && stubs.profiler.calls[1].payload.note.indexOf('· evidence d-0000000000001') > 0 && !/· event/.test(stubs.profiler.calls[1].payload.note), 'promote: a row with its own evidence carries it into the note; no event when the row names none');
r = promote(SESS, { interactionId: 'i-0000000000004', confidence: 40, profilerSession: PSESS });
ok(r.success && r.slug === 'general' && stubs.profiler.calls[2].payload.slug === 'general' && stubs.profiler.calls[2].payload.note.indexOf(LEARNED + ' — Context: Note with Sam Pen (VP Storage, Bolt Supply)') === 0, 'promote: an uncovered account goes to the intake\'s general slug with the company named in the text');
ix('i-0000000000010', OWNER, 'c-0000000000001', 'a-0000000000001', 'call', ago(1), 'Pricing call');
n0 = ixRows();
stubs.profiler.mode = 'expired'; r = promote(SESS, { interactionId: 'i-0000000000010', confidence: 70, profilerSession: PSESS });
ok(r.error === 'profiler_session_expired' && ixRows() === n0, 'promote: Profiler\'s SESSION_EXPIRED is relayed as profiler_session_expired and nothing is written');
stubs.profiler.mode = 'admin'; r = promote(SESS, { interactionId: 'i-0000000000010', confidence: 70, profilerSession: PSESS });
ok(r.error === 'profiler_admin_only' && ixRows() === n0, 'promote: ADMIN_ONLY → profiler_admin_only');
stubs.profiler.mode = 'invalid'; r = promote(SESS, { interactionId: 'i-0000000000010', confidence: 70, profilerSession: PSESS });
ok(r.error === 'profiler_rejected' && r.detail === 'INVALID_INPUT' && ixRows() === n0, 'promote: any other Profiler refusal → profiler_rejected with the word');
stubs.profiler.mode = 'html'; r = promote(SESS, { interactionId: 'i-0000000000010', confidence: 70, profilerSession: PSESS });
ok(r.error === 'upstream_not_json' && ixRows() === n0, 'promote: an HTML exception page from Profiler is upstream_not_json');
au = audits('network_promote').pop();
ok(au && au.details.ok === 0 && Object.keys(au.details).sort().join(',') === 'contactId,error,interactionId,ok', 'promote: a relayed refusal is audited with ok:0 and the error name');
stubs.profiler.mode = 'ok';
r = promote(SESS, { interactionId: 'i-0000000000010', confidence: 70, profilerSession: PSESS });
ok(r.success && ixRows() === n0 + 1, 'promote: the same row promotes once Profiler answers');
ix('i-0000000000011', OWNER, 'c-0000000000001', 'a-0000000000001', 'note', ago(1), 'x'.repeat(5000), 'y'.repeat(900));
r = promote(SESS, { interactionId: 'i-0000000000011', confidence: 1, profilerSession: PSESS });
const longNote = stubs.profiler.calls[stubs.profiler.calls.length - 1].payload.note;
ok(r.success && longNote.length <= 4000 && longNote.indexOf('x'.repeat(2000)) > 0 && longNote.indexOf('x'.repeat(2001)) < 0 && longNote.indexOf('y'.repeat(300)) > 0 && longNote.indexOf('y'.repeat(301)) < 0, 'promote: the summary is bounded at 2,000, the evidence at 300, the note under Profiler\'s 4,000-character ceiling (' + longNote.length + ')');

// 4. D15 / D17 greps; zero escaped calls
const page = P('live-site-pages/Network.html');
const scopeRe = /\b(MailApp|GmailApp|CalendarApp)\s*\.|gmail\.(send|compose|modify|readonly|metadata)|\bcalendar\.(readonly|events)\b|mail\.google\.com/;
ok(!scopeRe.test(region), 'D15: the .gs PROJECT region calls no MailApp / GmailApp / CalendarApp and names no gmail.* or calendar.* scope');
ok(!/\b(GmailApp|CalendarApp)\b/.test(page) && !/gmail\.(send|compose|modify|readonly)/.test(page) && !/\bgmail\b/i.test(page), 'D15: the page names no GmailApp / CalendarApp, no gmail.* scope and no Gmail');
ok(!/linkedin\.com/i.test(page) && (region.match(/linkedin\.com/gi) || []).length <= 1, 'D17: the page never names linkedin.com; the .gs at most in the manual-kind rule');
ok(!/ScriptApp\.newTrigger|\.timeBased\(\)/.test(region.slice(region.indexOf('N4 session 2'))), 'the N4 s2 section installs no trigger');
ok(page.indexOf("var NW_PROFILER_SESSION_KEY = 'ov_note_session'") > 0 && P('live-site-pages/Profiler.html').indexOf("var OV_NOTE_SESSION_KEY = 'ov_note_session'") > 0, 'the page reads Profiler\'s own session key by name (the same origin)');
ok(page.indexOf("nwApiBody('promote'") > 0 && page.indexOf("nwApi('brief'") > 0, 'the page calls nop=promote as a body-POST and nop=brief as a GET');
ok(NW.__counters.escaped === 0 && NW.__counters.fetched.every((f) => f.url.indexOf(EVENTS_EXEC) === 0 || f.url === PROFILER_EXEC), 'zero live calls — every UrlFetchApp call went to the Events or the Profiler stub (saw ' + NW.__counters.fetch + ')');

console.log((failures ? 'FAILED ' + failures + ' of ' : 'OK — ') + checks + ' checks' + (failures ? '' : ' passed — the signals read named by one eop=signals call and degrading to slugs, the brief\'s every section from the contact\'s own rows with the disclosure row and an ids-and-counts audit, the promote payload to Profiler\'s existing note op (sourceType contact, the confidence bounded, the i- id as evidence) with the note Interaction recording it, the duplicate and every refusal by name with zero calls, no mail or calendar scope, zero live calls'));
process.exit(failures ? 1 : 0);

// Developed by: LightAISolutions
