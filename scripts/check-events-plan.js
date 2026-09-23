#!/usr/bin/env node
// E5 session 1 — the deterministic plan, proved offline.
//
// NETWORK-EVENTS-DESIGN-PLAN.md §13.17 step 4: the REAL plan functions are
// lifted out of Events.gs (the check-events-signals.js idiom) and run in one
// isolated VM context with stubbed UrlFetchApp / SpreadsheetApp /
// PropertiesService / CacheService / Utilities; Network's far side is NOT a
// hand-written stub — Network.gs's real nwPeerAccounts_, nwPeerSignals_ (both
// legs) and the new nwPeerInteraction_ (the pick-list read and the meeting
// write through the real nwInteractionAdd_) run in a second context and the
// Events context's fetch of the peer URL is routed into it. Overpass, the
// Pages site (the registry, the segments, the companies file, two served
// dossiers) and the agenda page are in-memory fixtures; any other URL throws.
// It asserts:
//   · the booth list — one row per account with a plan-kind signal on the
//     event, ranked by the score's own account term (stageWeight × the
//     strongest signal) and a per-account segment term with the Tuning
//     weights, against hand-computed values; the why line VERBATIM from the
//     served dossier (strategyRead[0], else the newest development's
//     headline); a supplier never a booth; a docket row never a booth; the
//     stage on the row; a dossier read for the top booths only
//   · the sessions filter — a title naming a seat segment, a speaker who is a
//     Network contact (a signal row carrying contactId), a speaker who is a
//     dossier decision maker; a session with none of the three dropped; the
//     agenda page fetched once and served from the cache on the second plan
//   · the day plan — the registry's hours on the day that has them and the
//     default frame (said so) on the day that does not, the timed sessions
//     fixed, the ranked visits placed in rank order, the open slots between
//     them, a booked meeting fixed on its day and the slot split around it
//   · the venues — the Overpass stub's three nodes within 600 m answered by
//     distance and the fourth (outside) dropped; the second plan reads the
//     cache with zero Overpass fetches; a failed Overpass answer is an empty
//     list, one audit row, and NOT cached
//   · a booking — the `meeting` Interaction lands in Network's Interactions
//     tab with the mt- id as evidence and the event slug, the Meetings row
//     carries the i- id, the ICS carries DTSTART in UTC from the event's zone
//     and the mt- UID; unbook removes the row and leaves the record; every
//     refusal by name (bad_time · bad_date · contact_not_found ·
//     account_mismatch · not_starred · bad_contact_id) with nothing written
//   · nop=interaction — the six token-boundary cases flat `denied` with zero
//     reads; the write leg's per-row rejections; never a body
//   · not_configured degrades the plan (booths empty, notConfigured true) and
//     the booking (the row written with no interaction id); a non-admin is
//     refused with zero fetches; zero live calls; the D12 / D15 greps
//
// Usage:  node scripts/check-events-plan.js
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
function fakeSheet(name, parent) {
  const rows = [];
  return { name, rows,
    getLastRow: () => rows.length,
    getLastColumn: () => rows.reduce((w, r) => Math.max(w, r.length), 0),
    appendRow: (r) => { rows.push(r.slice()); },
    setFrozenRows() {}, getFrozenRows: () => 1,
    deleteRow: (n) => { rows.splice(n - 1, 1); },
    getParent: () => parent,
    getRange: (r, c, nr, nc) => ({
      getValues: () => { const out = []; for (let i = 0; i < (nr || 1); i++) { const row = rows[r - 1 + i] || []; const o = []; for (let k = 0; k < (nc || 1); k++) o.push(row[c - 1 + k] === undefined ? '' : row[c - 1 + k]); out.push(o); } return out; },
      getValue: () => ((rows[r - 1] || [])[c - 1] === undefined ? '' : rows[r - 1][c - 1]),
      setValues: (vals) => { vals.forEach((v, i) => { while (rows.length < r + i) rows.push([]); const row = rows[r - 1 + i]; v.forEach((x, k) => { row[c - 1 + k] = x; }); }); },
      setValue: (v) => { while (rows.length < r) rows.push([]); rows[r - 1][c - 1] = v; }
    }) };
}
function fakeSpreadsheet() {
  const sheets = {}, ss = { sheets, getSpreadsheetTimeZone: () => 'America/New_York' };
  ss.getSheetByName = (n) => sheets[n] || null;
  ss.insertSheet = (n) => { sheets[n] = fakeSheet(n, ss); return sheets[n]; };
  return ss;
}
function resp(code, text) { return { getResponseCode: () => code, getContentText: () => text }; }
const digest = (s) => Array.from(crypto.createHash('sha256').update(String(s)).digest()).map((b) => (b > 127 ? b - 256 : b));
// Utilities.formatDate for the four patterns the plan code uses, over Intl.
function fmtDate(d, tz, fmt) {
  const parts = {};
  new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
    .formatToParts(d).forEach((p) => { parts[p.type] = p.value; });
  if (parts.hour === '24') parts.hour = '00';
  const ymd = parts.year + '-' + parts.month + '-' + parts.day, hm = parts.hour + ':' + parts.minute;
  if (fmt === 'yyyy-MM-dd') return ymd;
  if (fmt === "yyyy-MM-dd'T'HH:mm") return ymd + 'T' + hm;
  if (fmt === "yyyy-MM-dd'T'HH:mm:ss") return ymd + 'T' + hm + ':' + parts.second;
  if (fmt === "yyyyMMdd'T'HHmmss'Z'") return ymd.replace(/-/g, '') + 'T' + hm.replace(':', '') + parts.second + 'Z';
  throw new Error('stub: unknown pattern ' + fmt);
}

// ── Fixtures ──────────────────────────────────────────────────────────────
const SITE = 'https://lightaisolutions.github.io/Sales/';
const TODAY = '2026-09-23';
const TOKEN = 'k7Qp2mX9vL4sD8wR1nB6yH3tZ0cF5jG8';   // 32 chars, test-only
const OWNER = 'dev@example.com';
const AGENDA_ALPHA = 'https://alpha.example/agenda';
const OVERPASS = 'https://overpass-api.de/api/interpreter';
const ev = (slug, name, series, start, end, extra) => Object.assign({ slug, name, series, organiser: 'Org', kind: 'conference', start, end, tz: 'America/Chicago',
  city: 'Austin', region: 'TX', country: 'US', website: 'https://a.example/' + slug, audience: ['utilities', 'capital'], relevance: 3, status: 'confirmed', mentions: [],
  sources: [{ sourceKey: 'src-a', kind: 'manual', url: 'https://a.example/' + slug, lastConfirmed: '2026-09-01' }] }, extra || {});
const REGISTRY = { schemaVersion: 1, built: '2026-09-23T00:00:00Z', events: [
  ev('alpha-2026', 'Alpha Show 2026', 'Alpha Show', '2026-11-16', '2026-11-17', { venue: 'Austin Convention Center', venueLatLng: [30.2635, -97.7393], agendaUrl: AGENDA_ALPHA,
      hours: [{ date: '2026-11-16', open: '09:00', close: '16:00' }] }),   // starred; hours on day 1 only
  ev('beta-2027', 'Beta Summit 2027', 'Beta Summit', '2027-03-01', '2027-03-03', { audience: ['neoclouds'] }),   // not starred
  ev('delta-2026', 'Delta (past)', 'Delta', '2026-02-09', '2026-02-12', { status: 'past' })
] };
const SEGMENTS = { schemaVersion: 1, seats: {
  'storage-seller': { label: 'The storage seller', segments: ['storage-developers-and-ipps', 'utilities', 'capital', 'assurance'] },
  'aidc-power-seller': { label: 'The AI-data-centre power seller', segments: ['aidc-developers-and-landlords', 'neoclouds', 'utilities'] }
}, segments: [ { id: 'utilities', name: 'Utilities' }, { id: 'storage-developers-and-ipps', name: 'Storage developers and IPPs' }, { id: 'capital', name: 'Capital and finance' },
  { id: 'neoclouds', name: 'Neoclouds' }, { id: 'cells-and-chemistry', name: 'Cells and chemistry' } ] };
const COMPANIES = { schemaVersion: 1, companies: [] };
const FLUENCE_WHY = '(High confidence) Fluence is winning the grid-scale integrator layer: Gridstack Pro and the Smartstack platform, backed by a US cell supply, make it the reference bidder for utility-scale storage RFPs.';
const DOSSIER_FLUENCE = { slug: 'fluence-energy', name: 'Fluence Energy', strategyRead: [FLUENCE_WHY, 'A second read'],
  recentDevelopments: [{ date: '2026-08-01', headline: 'Older headline' }, { date: '2026-09-10', headline: 'Newest headline' }],
  decisionMakers: [{ name: 'Julian Nebreda', title: 'CEO' }, { name: 'Ahmed Pasha', title: 'CFO' }] };
const DOSSIER_ACME = { slug: 'acme-storage', name: 'Acme Storage', strategyRead: [],   // no strategy read → the newest development
  recentDevelopments: [{ date: '2026-07-04', headline: 'Acme opens a Texas service hub' }, { date: '2026-09-15', headline: 'Acme wins a 400 MWh utility award' }], decisionMakers: [] };
const ACCOUNTS = [
  { id: 'a-0000000000001', name: 'Fluence Energy', slug: 'fluence-energy', relationship: 'target', stage: 'shortlist', segments: ['storage-developers-and-ipps', 'capital'] },
  { id: 'a-0000000000002', name: 'Sungrow', slug: 'sungrow', relationship: 'customer', stage: 'none', segments: ['cells-and-chemistry'] },   // its dossier answers 404
  { id: 'a-0000000000003', name: 'Bolt Supply', slug: '', relationship: 'supplier', stage: 'none', segments: ['utilities'] },
  { id: 'a-0000000000004', name: 'Acme Storage', slug: 'acme-storage', relationship: 'partner', stage: 'none', segments: ['utilities'] }
];
const C_JANE = 'c-0000000000001', C_OLD = 'c-0000000000002', C_ANN = 'c-0000000000003';
const CONTACTS = [
  { id: C_JANE, accountId: 'a-0000000000001', name: 'Jane Doe', title: 'VP Storage', role: 'decision-maker', deleted: '' },
  { id: C_OLD, accountId: 'a-0000000000001', name: 'Old Timer', title: 'Retired', role: 'other', deleted: '2026-01-01T00:00:00Z' },
  { id: C_ANN, accountId: 'a-0000000000004', name: 'Ann Lee', title: 'Director of Grid', role: 'influencer', deleted: '' }
];
const SIGNALS = [   // written through Network's REAL write leg below
  { accountId: 'a-0000000000001', eventSlug: 'alpha-2026', kind: 'exhibitor', evidenceUrl: 'https://alpha.example/exhibitors', confidence: 0.9, firstSeen: TODAY },
  { accountId: 'a-0000000000001', contactId: C_JANE, eventSlug: 'alpha-2026', kind: 'speaker', evidenceUrl: 'https://alpha.example/speakers', confidence: 0.9, firstSeen: TODAY, personName: 'Jane Doe', personTitle: 'VP Storage' },
  { accountId: 'a-0000000000001', eventSlug: '', kind: 'docket', evidenceUrl: 'https://www.federalregister.example/d/1', confidence: 0.7, firstSeen: TODAY },   // no event — never a booth
  { accountId: 'a-0000000000004', eventSlug: 'alpha-2026', kind: 'exhibitor', evidenceUrl: 'https://alpha.example/exhibitors', confidence: 0.9, firstSeen: TODAY },
  { accountId: 'a-0000000000002', eventSlug: 'alpha-2026', kind: 'agenda', evidenceUrl: AGENDA_ALPHA, confidence: 0.9, firstSeen: TODAY, personName: 'Tom Fox', personTitle: 'Head of Sales' },
  { accountId: 'a-0000000000003', eventSlug: 'alpha-2026', kind: 'exhibitor', evidenceUrl: 'https://alpha.example/exhibitors', confidence: 0.9, firstSeen: TODAY },   // a supplier — the score never reads it
  { accountId: 'a-0000000000002', eventSlug: 'beta-2027', kind: 'exhibitor', evidenceUrl: 'https://beta.example/exhibitors', confidence: 0.9, firstSeen: TODAY }     // another event
];
const ldEvent = (name, start, end, performer, extra) => Object.assign({ '@type': 'Event', name, startDate: start, endDate: end, performer, location: { '@type': 'Place', name: 'Hall B' } }, extra || {});
const AGENDA_HTML = '<html><head><script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'Event', name: 'Alpha Show 2026', startDate: '2026-11-16', subEvent: [
  ldEvent('Grid-scale storage for utilities', '2026-11-16T10:00:00-06:00', '2026-11-16T11:00:00-06:00', [{ '@type': 'Person', name: 'Rita Ng', jobTitle: 'Grid Lead', worksFor: { '@type': 'Organization', name: 'Tesla, Inc.' } }]),   // segment: utilities
  ldEvent('Financing the fleet', '2026-11-16T14:00:00-06:00', '2026-11-16T15:00:00-06:00', [{ '@type': 'Person', name: 'Jane Doe', jobTitle: 'VP Storage', worksFor: { '@type': 'Organization', name: 'Fluence Energy' } }]),   // contact: Jane Doe
  ldEvent('Cell chemistry deep dive', '2026-11-17T09:30:00-06:00', '2026-11-17T10:30:00-06:00', [{ '@type': 'Person', name: 'Bob Ray', jobTitle: 'CTO', affiliation: 'Nobody Corp' }]),   // nothing → dropped
  ldEvent('Keynote: the next decade', '2026-11-17T13:00:00-06:00', '2026-11-17T14:00:00-06:00', [{ '@type': 'Person', name: 'Julian Nebreda', jobTitle: 'CEO', worksFor: { '@type': 'Organization', name: 'Fluence Energy, Inc.' } }])   // decision maker
] }) + '</script></head><body><h1>Agenda</h1></body></html>';
// Overpass — three nodes within 600 m, the fourth ~900 m north (never answered)
const OVERPASS_JSON = JSON.stringify({ version: 0.6, elements: [
  { type: 'node', id: 1, lat: 30.2650, lon: -97.7400, tags: { amenity: 'cafe', name: 'Second Street Cafe' } },
  { type: 'node', id: 2, lat: 30.2620, lon: -97.7370, tags: { amenity: 'restaurant', name: 'Brazos Grill' } },
  { type: 'node', id: 3, lat: 30.2660, lon: -97.7420, tags: { tourism: 'hotel', name: 'Hotel Cesar' } },
  { type: 'node', id: 4, lat: 30.2716, lon: -97.7393, tags: { amenity: 'bar', name: 'Far North Bar' } },   // ~900 m — outside the radius
  { type: 'node', id: 5, lat: 30.2640, lon: -97.7395, tags: { amenity: 'bench' } }   // no name, not a venue
] });

// ── The Network context — its REAL peer far side (check-peer-bridge.js idiom) ─
const nwSrc = P('googleAppsScripts/Network/Network.gs');
const nwProps = { NETWORK_PEER_TOKEN: TOKEN };
const nwSs = fakeSpreadsheet();
const nwCounters = { openById: 0, fetch: 0, audit: [], revs: 0 };
const NW = {
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (Object.prototype.hasOwnProperty.call(nwProps, k) ? nwProps[k] : null), setProperty: (k, v) => { nwProps[k] = String(v); } }) },
  SpreadsheetApp: { openById: () => { nwCounters.openById++; return nwSs; } },
  UrlFetchApp: { fetch: () => { nwCounters.fetch++; throw new Error('Network far side must never fetch'); } },
  Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (a, s) => digest(s), formatDate: fmtDate },
  Session: { getScriptTimeZone: () => 'America/New_York' }, CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) }, Logger: { log() {} },
  auditLog: (evName, user, op, details) => { nwCounters.audit.push({ ev: evName, user, op, details }); }, bumpDataRev() { nwCounters.revs++; },
  console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN, isFinite, encodeURIComponent, Intl
};
vm.createContext(NW);
vm.runInContext([
  'NW_RELATIONSHIPS', 'NW_STAGES', 'NW_SIGNAL_KINDS', 'NW_INTERACTION_KINDS', 'NW_ID_RE', 'NW_ID_PREFIXES', 'NW_TABS', 'NW_LEGAL_SUFFIX_RE',
  'NW_PEER_TOKEN_PROP', 'NW_EVENTS_TOKEN_PROP', 'EVENTS_PEER_EXEC', 'NW_PEER_RELATIONSHIPS', 'NW_PEER_SLUG_RE', 'NW_CORPUS_KEY_RE',
  'NW_PEER_INTERACTION_KINDS', 'NW_PEER_EVIDENCE_RE'
].map((n) => constant(nwSrc, n)).join('\n') + '\nvar SPREADSHEET_ID = "stub";\n' + [
  'ensureNetworkTabs_', 'nwListRows_', 'nwSheetRead_', 'nwRowObj_', 'nwFindRow_', 'nwOwned_', 'nwWriteRow_', 'nwArr_', 'nwStr_', 'nwNow_', 'nwNewId_', 'nwRandomBase36_',
  'nwNormaliseCompany_', 'nwPeerAuthorised_', 'nwHandlePeer_', 'nwPeerOwner_', 'nwPeerAccounts_', 'nwPeerSignals_', 'nwPeerJsonBody_',
  'nwPeerSignalsRead_', 'nwPeerLinkedIn_', 'nwPeerSignalsWrite_', 'nwSignalKey_', 'nwNameKey_', 'nwInteractionAdd_',
  'nwPeerInteraction_', 'nwPeerContactsRead_', 'nwPeerInteractionWrite_'
].map((n) => extract(nwSrc, n)).join('\n'), NW, { filename: 'Network.peer.js' });
const nwTabs = vm.runInContext('ensureNetworkTabs_', NW)();
const nwWrite = (sheet, obj) => { const headers = sheet.rows[0], row = {}; headers.forEach((h) => { row[h] = ''; }); Object.assign(row, obj); vm.runInContext('nwWriteRow_', NW)(sheet, headers, row, 0); };
ACCOUNTS.forEach((a) => nwWrite(nwSs.sheets['Accounts'], { 'Account ID': a.id, 'Owner': OWNER, 'Name': a.name, 'Normalised Name': vm.runInContext('nwNormaliseCompany_', NW)(a.name), 'Profiler Slug': a.slug,
  'Relationship': a.relationship, 'Stage': a.stage, 'Segment IDs': JSON.stringify(a.segments || []), 'Tags': '[]', 'Created At': TODAY, 'Updated At': TODAY }));
CONTACTS.forEach((c) => nwWrite(nwSs.sheets['Contacts'], { 'Contact ID': c.id, 'Owner': OWNER, 'Account ID': c.accountId, 'Full Name': c.name, 'Title': c.title, 'Role': c.role,
  'Emails': '["private@example.com"]', 'Phones': '["+15550000000"]', 'Created At': TODAY, 'Updated At': TODAY, 'Deleted At': c.deleted }));
const nwPeer = (e) => vm.runInContext('nwHandlePeer_', NW)(e);
const seeded = nwPeer({ parameter: { t: TOKEN, nop: 'signals', owner: OWNER }, postData: { contents: JSON.stringify({ owner: OWNER, signals: SIGNALS }), type: 'application/json' } });
if (!(seeded.success && seeded.written === SIGNALS.length)) { console.log('  FAIL  fixture: Network did not accept the seed signals: ' + JSON.stringify(seeded)); process.exit(1); }

// ── The Events context — the real plan, routed into Network ──────────────
const src = P('googleAppsScripts/Events/Events.gs');
const NW_EXEC = /var NETWORK_PEER_EXEC =\s*\n?\s*'([^']+)'/.exec(src)[1];
const ss = fakeSpreadsheet();
const counters = { openById: 0, fetch: 0, urls: [], audit: [], overpass: 0, agenda: 0, dossiers: 0, escaped: 0 };
const props = { NETWORK_PEER_TOKEN: TOKEN };
const cacheStore = {};
const sessions = {
  'admin-token-000000000000000000000000': { email: OWNER, role: 'admin', permissions: ['read', 'write', 'admin'] },
  'analyst-token-0000000000000000000000': { email: 'ana@example.com', role: 'analyst', permissions: ['read'] }
};
let overpassStatus = 200;
function parseQuery(url) { const q = {}; (url.split('?')[1] || '').split('&').forEach((kv) => { const i = kv.indexOf('='); if (i > 0) q[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1)); }); return q; }
function route(url, opts) {
  if (url === SITE + 'events-data/events.json') return resp(200, JSON.stringify(REGISTRY));
  if (url === SITE + 'profiler-data/profiler-segments.json') return resp(200, JSON.stringify(SEGMENTS));
  if (url === SITE + 'profiler-data/profiler-companies.json') return resp(200, JSON.stringify(COMPANIES));
  if (url === SITE + 'profiler-data/fluence-energy.profile.json') { counters.dossiers++; return resp(200, JSON.stringify(DOSSIER_FLUENCE)); }
  if (url === SITE + 'profiler-data/acme-storage.profile.json') { counters.dossiers++; return resp(200, JSON.stringify(DOSSIER_ACME)); }
  if (url === SITE + 'profiler-data/sungrow.profile.json') { counters.dossiers++; return resp(404, '<html>Not Found</html>'); }
  if (url.indexOf(NW_EXEC + '?action=peer&') === 0) {
    const e = { parameter: parseQuery(url) };
    if (opts && opts.method === 'post') e.postData = { contents: String(opts.payload || ''), type: 'application/json' };
    return resp(200, JSON.stringify(nwPeer(e)));
  }
  if (url === AGENDA_ALPHA) { counters.agenda++; return resp(200, AGENDA_HTML); }
  if (url === OVERPASS) {
    counters.overpass++;
    if (!(opts && opts.method === 'post' && /^data=/.test(String(opts.payload || '')))) throw new Error('OVERPASS NOT A POST');
    if (overpassStatus === 0) throw new Error('timeout');
    return resp(overpassStatus, overpassStatus === 200 ? OVERPASS_JSON : '<html>Too Many Requests</html>');
  }
  counters.escaped++;
  throw new Error('offline: ' + url);
}
const ctx = {
  UrlFetchApp: { fetch: (url, opts) => { counters.fetch++; counters.urls.push(url); return route(url, opts); } },
  SpreadsheetApp: { openById: () => { counters.openById++; return ss; } },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null), setProperty: (k, v) => { props[k] = String(v); }, deleteProperty: (k) => { delete props[k]; } }) },
  CacheService: { getScriptCache: () => ({ get: (k) => (Object.prototype.hasOwnProperty.call(cacheStore, k) ? cacheStore[k] : null), put: (k, v) => { cacheStore[k] = String(v); } }) },
  Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (a, s) => digest(s), formatDate: fmtDate,
    newBlob: (s) => ({ getBytes: () => Array.from(Buffer.from(String(s), 'utf8')) }) },
  Session: { getScriptTimeZone: () => 'America/New_York' }, Logger: { log() {} },
  auditLog: (evName, user, op, details) => { counters.audit.push({ ev: evName, user, op, details }); },
  validateSessionForData: (token) => { if (!sessions[token]) throw new Error('SESSION_EXPIRED'); return sessions[token]; },
  resolveOwnerSet_: () => ({ set: {} }), resolveOwnerScope_: (sess) => ({ owner: String(sess.email).toLowerCase() }),
  console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN, isFinite, encodeURIComponent, Intl
};
vm.createContext(ctx);
vm.runInContext(
  'var EMBED_PAGE_URL = "' + SITE + 'Events.html";\nvar SPREADSHEET_ID = "stub";\n' + [
    'EV_ROLE_CAPS', 'EV_ATTENDING', 'EV_SLUG_RE', 'EV_ID_RE', 'EV_ID_PREFIXES', 'EV_TABS', 'EV_REGISTRY_URL', '_evRegistryCache', 'EV_ACCOUNT_ID_RE',
    'EV_PEER_TOKEN_PROP', 'EV_NETWORK_TOKEN_PROP', 'NETWORK_PEER_EXEC', 'EV_POLL_MAX_BODY',
    'EV_SEGMENTS_URL', 'EV_COMPANIES_URL', 'EV_SCORE_TERMS', 'EV_TUNING_DEFAULTS', 'EV_STAGE_WEIGHT', 'EV_STAGE_DEFAULT_WEIGHT', 'EV_RELATIONSHIP_WEIGHT', 'EV_SCORE_SIGNAL_CAP', 'EV_SCORE_CONFLICT_ATTENDING',
    'EV_SIGNALS_MAX_NAMES', 'EV_SIGNAL_PERSON_MAX',
    'EV_PLAN_VENUES_PROP', 'EV_PLAN_VENUES_DAYS', 'EV_PLAN_VENUE_RADIUS_M', 'EV_PLAN_VENUES_MAX', 'EV_OVERPASS_URL', 'EV_OVERPASS_TIMEOUT_S', 'EV_PLAN_BOOTH_MAX', 'EV_PLAN_DOSSIER_MAX',
    'EV_PLAN_SESSIONS_MAX', 'EV_PLAN_AGENDA_CACHE_S', 'EV_PLAN_DEFAULT_HOURS', 'EV_PLAN_VISIT_MIN', 'EV_PLAN_SLOT_MIN', 'EV_PLAN_VISITS_PER_DAY', 'EV_PLAN_MEETING_MAX_MIN',
    'EV_PLAN_SIGNAL_KINDS', 'EV_PLAN_STOPWORDS', 'EV_PROFILE_URL', 'EV_MEETING_ID_RE', 'EV_CONTACT_ID_RE', 'EV_HHMM_RE', '_evProfileCache'
  ].map((n) => constant(src, n)).join('\n') + '\n' + [
    'evRoleOf_', 'evAdmitted_', 'evCan_', 'evRequire_', 'evRandomBase36_', 'evNewId_', 'ensureEventsTabs_', 'evListRows_', 'evStr_', 'evCell_', 'handleEventsOp_',
    'evRegistry_', 'evTodayIn_', 'evPagesJson_', 'evNetworkProxy_', 'evHtmlDecode_', 'evJsonLdBlocks_', 'evIsEventType_', 'evAddDaysStr_', 'evStripTags_',
    'evTuning_', 'evSeatSegments_', 'evMentionDates_', 'evStageWeight_', 'evDatesOverlap_', 'evMonthsSince_', 'evRound2_', 'evScoreEvent_', 'evRecommend_',
    'evSignalsFetch_', 'evPersonOrg_', 'evPersonFromLd_', 'evCollectPersons_', 'evParseSpeakers_',
    'evMinutes_', 'evHhmm_', 'evNameKey_', 'evDayList_', 'evLocalToUtc_', 'evIcsEsc_', 'evIcsUtc_', 'evIcsFold_', 'evIcsHost_',
    'evDistanceM_', 'evOverpassQuery_', 'evParseOverpass_', 'evPlanVenues_', 'evProfile_', 'evDossierWhy_', 'evDecisionMakers_',
    'evSessionTime_', 'evSessionsFromLd_', 'evParseSessions_', 'evPlanSessions_', 'evPlanBooths_', 'evSegmentKeywords_', 'evPlanSessionsFilter_',
    'evPlanHours_', 'evPlanDays_', 'evWallCell_', 'evPlanMeetings_', 'evPlanMeetingNames_', 'evPlanOp_', 'evPlanContactsOp_', 'evMeetingIcs_', 'evPlanMeetingOp_', 'evPlanUnbookOp_'
  ].map((n) => extract(src, n)).join('\n'), ctx, { filename: 'Events.plan.js' });
// The Stars tab: alpha-2026 starred by the owner (the plan is for a starred event)
const evTabs = vm.runInContext('ensureEventsTabs_', ctx)();
evTabs.stars.appendRow(['st-0000000000001', OWNER, 'alpha-2026', '', 'registered', TODAY, TODAY]);

let failures = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.log('  FAIL  ' + msg); } }
const call = (name, ...args) => vm.runInContext(name, ctx)(...args);
const op = (token, eop, extra) => call('handleEventsOp_', { parameter: Object.assign({ eop, session: token }, extra || {}) });
const ADMIN = 'admin-token-000000000000000000000000', ANALYST = 'analyst-token-0000000000000000000000';
const flatDenied = (r) => !!r && r.success === false && r.error === 'denied' && Object.keys(r).length === 2;
const iRows = () => nwSs.sheets['Interactions'].rows.slice(1);
const iIdx = (() => { const h = nwSs.sheets['Interactions'].rows[0], m = {}; h.forEach((x, i) => { m[x] = i; }); return m; })();
const icol = (row, name) => row[iIdx[name]];
const mRows = () => ss.sheets['Meetings'].rows.slice(1);

// ── 0. Refusals before any read ───────────────────────────────────────────
let f0 = counters.fetch, o0 = counters.openById;
let r = op(ANALYST, 'plan', { slug: 'alpha-2026' });
ok(r.success === false && r.error === 'ROLE_DENIED' && counters.fetch === f0 && counters.openById === o0, 'plan: a non-admin is refused with zero fetches and zero sheet opens');
['plancontacts', 'planmeeting', 'planunbook'].forEach((k) => ok(op(ANALYST, k, {}).error === 'ROLE_DENIED', k + ': refused to a non-admin'));
ok(op(ADMIN, 'plan', { slug: 'Nope Slug!' }).error === 'bad_slug', 'plan: a malformed slug is bad_slug');
ok(op(ADMIN, 'plan', { slug: 'beta-2027' }).error === 'not_starred', 'plan: an unstarred event is not_starred (the plan is for a starred event)');
ok(op(ADMIN, 'plan', { slug: 'ghost-2030' }).error === 'not_starred', 'plan: an unknown slug that is not starred is not_starred');

// ── 1. The plan — booths, sessions, days, venues ──────────────────────────
counters.overpass = 0; counters.agenda = 0; counters.dossiers = 0;
const plan = op(ADMIN, 'plan', { slug: 'alpha-2026' });
ok(plan.success === true && plan.slug === 'alpha-2026' && plan.notConfigured === false && plan.event.name === 'Alpha Show 2026' && plan.event.tz === 'America/Chicago' && plan.attending === 'registered',
   'plan: answers for the starred event (' + JSON.stringify({ success: plan.success, error: plan.error, nc: plan.notConfigured }) + ')');
ok(plan.signalsBySlug === undefined && plan.accountsById === undefined, 'plan: the score\'s kept rows never ride the answer');
// the booth list — hand-computed: weights 0.35 / 0.35; audience [utilities, capital]
//   Fluence  target·shortlist 1.0 × 0.9 = 0.90; segments ∩ audience = [capital] → 0.5   → 0.35×0.90 + 0.35×0.5 = 0.49
//   Acme     partner 0.5 × 0.9 = 0.45;          [utilities] → 0.5                       → 0.1575 + 0.175 = 0.33
//   Sungrow  customer 0.5 × 0.9 = 0.45;         [] → 0                                   → 0.16
const booths = plan.booths || [];
ok(booths.map((b) => b.name).join(' > ') === 'Fluence Energy > Acme Storage > Sungrow', 'booths: ranked Fluence > Acme > Sungrow (' + booths.map((b) => b.name + ' ' + b.rank).join(', ') + ')');
ok(booths[0] && booths[0].rank === 0.49 && booths[0].accountTerm === 0.9 && booths[0].segmentTerm === 0.5 && booths[0].stageWeight === 1 && booths[0].stage === 'shortlist' && booths[0].relationship === 'target',
   'booths: Fluence — account term 0.90, segment term 0.5, rank 0.49, the stage on the row');
ok(booths[1] && booths[1].rank === 0.33 && booths[1].accountTerm === 0.45 && booths[1].segmentTerm === 0.5, 'booths: Acme — 0.45 · 0.5 → 0.33 (' + JSON.stringify(booths[1] && [booths[1].rank, booths[1].accountTerm, booths[1].segmentTerm]) + ')');
ok(booths[2] && booths[2].rank === 0.16 && booths[2].segmentTerm === 0 && booths[2].covered === false && booths[2].why === null, 'booths: Sungrow — no segment match, its dossier 404 → uncovered, no why line');
ok(!booths.some((b) => b.name === 'Bolt Supply'), 'booths: a supplier is never a booth (the score never reads it)');
ok(booths[0].signals.length === 2 && booths[0].signals[0].kind === 'exhibitor' && booths[0].signals[1].kind === 'speaker' && booths[0].signals[1].personName === 'Jane Doe' && booths[0].signals[1].contactId === C_JANE
   && !booths[0].signals.some((s) => s.kind === 'docket'), 'booths: every plan-kind signal on the event rides the row with the person and the contact id; the docket row (no event) never');
ok(booths[0].covered === true && booths[0].why && booths[0].why.source === 'strategyRead' && booths[0].why.text === FLUENCE_WHY, 'booths: the why line is strategyRead[0] VERBATIM from the served dossier');
ok(booths[1].covered === true && booths[1].why && booths[1].why.source === 'recentDevelopments' && booths[1].why.text === 'Acme wins a 400 MWh utility award' && booths[1].why.date === '2026-09-15',
   'booths: with no strategy read, the NEWEST development\'s headline verbatim (' + JSON.stringify(booths[1].why) + ')');
ok(counters.dossiers === 3 && plan.dossiersRead === 3 && !counters.urls.some((u) => /script\.google\.com.*action=note|profiler.*exec/i.test(u)), 'booths: three dossiers read from the Pages site (one 404), never Profiler\'s exec');
ok(JSON.stringify(booths[0].seatSegments) === '["capital"]' && JSON.stringify(booths[1].segments) === '["utilities"]', 'booths: the matched segments named on the row');
ok(!JSON.stringify(plan).includes('private@example.com') && !JSON.stringify(plan).includes('+15550000000'), 'D9: no email or phone anywhere in the plan');
// the sessions
const sess = plan.sessions || [];
ok(counters.agenda === 1 && plan.agenda.read === 4 && plan.agenda.cached === false, 'sessions: the agenda page fetched once, four sessions parsed (' + JSON.stringify(plan.agenda) + ')');
ok(sess.map((s) => s.title).join(' | ') === 'Grid-scale storage for utilities | Financing the fleet | Keynote: the next decade', 'sessions: the three matched, in time order; the unmatched one dropped (' + sess.map((s) => s.title).join(' | ') + ')');
ok(sess[0] && sess[0].why.length === 1 && sess[0].why[0].kind === 'segment' && sess[0].why[0].id === 'utilities' && sess[0].date === '2026-11-16' && sess[0].start === '10:00' && sess[0].end === '11:00' && sess[0].room === 'Hall B',
   'sessions: the title naming a seat segment — utilities — with its time and room');
ok(sess[1] && sess[1].why[0].kind === 'contact' && sess[1].why[0].name === 'Jane Doe' && sess[1].why[0].contactId === C_JANE && sess[1].why[0].account === 'Fluence Energy', 'sessions: a speaker who is a Network contact (the signal row\'s contactId)');
ok(sess[2] && sess[2].why[0].kind === 'decision-maker' && sess[2].why[0].name === 'Julian Nebreda' && sess[2].why[0].account === 'Fluence Energy', 'sessions: a speaker who is a dossier decision maker');
ok(JSON.stringify(plan.keywords) === JSON.stringify([{ id: 'utilities', name: 'Utilities' }, { id: 'capital', name: 'Capital and finance' }]), 'sessions: the seat segments the event serves are the keywords (' + JSON.stringify(plan.keywords) + ')');
// the day plan
const days = plan.days || [];
ok(days.length === 2 && days[0].date === '2026-11-16' && days[0].open === '09:00' && days[0].close === '16:00' && days[0].hoursSource === 'registry'
   && days[1].date === '2026-11-17' && days[1].open === '09:00' && days[1].close === '17:00' && days[1].hoursSource === 'default', 'days: the registry hours on day 1, the default frame (said so) on day 2');
const d1 = days[0].items, kinds = (items) => items.map((i) => i.kind + ' ' + i.start + '-' + i.end + (i.title ? ' ' + i.title : '')).join(' | ');
ok(d1.filter((i) => i.kind === 'visit').map((i) => i.title).join(' > ') === 'Fluence Energy > Acme Storage > Sungrow' && d1[0].kind === 'visit' && d1[0].start === '09:00' && d1[0].end === '09:30' && d1[0].rank === 1 && d1[0].stage === 'shortlist',
   'days: the ranked visits placed in rank order from opening, 30 minutes each (' + kinds(d1) + ')');
ok(d1.some((i) => i.kind === 'session' && i.start === '10:00' && i.end === '11:00' && i.title === 'Grid-scale storage for utilities') && d1.some((i) => i.kind === 'session' && i.start === '14:00'), 'days: the timed sessions are fixed on their day');
ok(d1.filter((i) => i.kind === 'open').map((i) => i.start + '-' + i.end).join(',') === '11:30-14:00,15:00-16:00', 'days: the open slots between the fixed items (' + d1.filter((i) => i.kind === 'open').map((i) => i.start + '-' + i.end).join(',') + ')');
const d2 = days[1].items;
ok(!d2.some((i) => i.kind === 'visit') && d2.some((i) => i.kind === 'session' && i.start === '13:00') && d2.filter((i) => i.kind === 'open').map((i) => i.start + '-' + i.end).join(',') === '09:00-13:00,14:00-17:00',
   'days: day 2 — no visits left, the keynote fixed, two open slots (' + kinds(d2) + ')');
// the venues
const venues = plan.venues || [];
ok(counters.overpass === 1 && venues.length === 3 && venues.map((v) => v.name).join(' | ') === 'Second Street Cafe | Brazos Grill | Hotel Cesar' && venues.every((v) => v.distanceM <= 600) && plan.venuesCached === false,
   'venues: one Overpass POST, three within 600 m by distance, the fourth outside dropped, the unnamed node dropped (' + venues.map((v) => v.name + ' ' + v.distanceM + 'm ' + v.kind).join(', ') + ')');
ok(venues[0].kind === 'cafe' && venues[1].kind === 'restaurant' && venues[2].kind === 'hotel', 'venues: the kind from amenity / tourism');
const cacheKey = 'EV_PLAN_VENUES:alpha-2026';
ok(props[cacheKey] && JSON.parse(props[cacheKey]).venues.length === 3, 'venues: cached in the script property keyed by slug');
ok(plan.meetings.length === 0, 'meetings: none booked yet');
const planAudit = counters.audit.filter((a) => a.op === 'events_plan').pop();
ok(planAudit && planAudit.details.slug === 'alpha-2026' && planAudit.details.booths === 3 && planAudit.details.sessions === 3 && planAudit.details.venues === 3 && Object.keys(planAudit.details).every((k) => k === 'slug' || typeof planAudit.details[k] === 'number'),
   'audit: the plan row is the slug and counts only');

// ── 2. The second plan — the caches ───────────────────────────────────────
counters.overpass = 0; counters.agenda = 0;
const plan2 = op(ADMIN, 'plan', { slug: 'alpha-2026' });
ok(plan2.success && counters.overpass === 0 && plan2.venuesCached === true && plan2.venues.length === 3, 'venues: the second plan reads the cache — zero Overpass fetches');
ok(counters.agenda === 0 && plan2.agenda.cached === true && plan2.sessions.length === 3, 'sessions: the agenda served from the cache — the page is not fetched twice');
// a failed Overpass answer: empty, one audit row, not cached
delete props[cacheKey]; overpassStatus = 429; counters.overpass = 0;
const plan3 = op(ADMIN, 'plan', { slug: 'alpha-2026' });
ok(plan3.success && plan3.venues.length === 0 && plan3.venuesError === 'http_429' && counters.overpass === 1 && !props[cacheKey], 'venues: a failed Overpass answer is an empty list and not cached');
ok(counters.audit.filter((a) => a.op === 'events_plan_venues_failed').length === 1, 'venues: one audit row for the failure');
overpassStatus = 0; counters.overpass = 0;
ok(op(ADMIN, 'plan', { slug: 'alpha-2026' }).venuesError === 'fetch_failed' && counters.overpass === 1, 'venues: a slow / thrown Overpass answer is fetch_failed, still an empty list');
overpassStatus = 200;
op(ADMIN, 'plan', { slug: 'alpha-2026' });
ok(!!props[cacheKey], 'venues: the next healthy answer is cached again');

// ── 3. The pick list — nop=interaction's read leg over the bridge ─────────
r = op(ADMIN, 'plancontacts', { accountId: 'a-0000000000001' });
ok(r.success && r.contacts.length === 1 && r.contacts[0].id === C_JANE && r.contacts[0].name === 'Jane Doe' && r.contacts[0].title === 'VP Storage' && r.contacts[0].role === 'decision-maker' && Object.keys(r.contacts[0]).sort().join(',') === 'id,name,role,title',
   'plancontacts: the live contact under the account — id · name · title · role and nothing else; the deleted one never (' + JSON.stringify(r) + ')');
ok(op(ADMIN, 'plancontacts', { accountId: 'x' }).error === 'bad_account_id' && op(ADMIN, 'plancontacts', { accountId: 'a-0000000000009' }).error === 'account_not_found', 'plancontacts: a bad id and an unknown account refused by name');

// ── 4. A booking — the Interaction, the row, the ICS ──────────────────────
const bookP = { slug: 'alpha-2026', contactId: C_JANE, accountId: 'a-0000000000001', date: '2026-11-16', start: '15:00', end: '15:30', place: 'Hall B café', note: 'Gridstack Pro pricing; bring the RFP timeline', contactName: 'Jane Doe', accountName: 'Fluence Energy' };
ok(op(ADMIN, 'planmeeting', Object.assign({}, bookP, { end: '14:30' })).error === 'bad_time', 'planmeeting: end before start is bad_time');
ok(op(ADMIN, 'planmeeting', Object.assign({}, bookP, { end: '19:30' })).error === 'bad_time', 'planmeeting: over four hours is bad_time');
ok(op(ADMIN, 'planmeeting', Object.assign({}, bookP, { date: '2026-11-18' })).error === 'bad_date', 'planmeeting: a day outside the event is bad_date');
ok(op(ADMIN, 'planmeeting', Object.assign({}, bookP, { contactId: 'nope' })).error === 'bad_contact_id', 'planmeeting: a malformed contact id is bad_contact_id');
ok(op(ADMIN, 'planmeeting', Object.assign({}, bookP, { slug: 'beta-2027', date: '2027-03-01' })).error === 'not_starred', 'planmeeting: an unstarred event is not_starred');
let n0 = iRows().length;
r = op(ADMIN, 'planmeeting', Object.assign({}, bookP, { contactId: C_OLD }));
ok(r.error === 'contact_not_found' && iRows().length === n0 && mRows().length === 0, 'planmeeting: a deleted contact is contact_not_found from Network\'s leg — nothing written on either side');
r = op(ADMIN, 'planmeeting', Object.assign({}, bookP, { contactId: C_ANN }));
ok(r.error === 'account_mismatch' && iRows().length === n0 && mRows().length === 0, 'planmeeting: a contact at another account is account_mismatch — nothing written');
const booked = op(ADMIN, 'planmeeting', bookP);
ok(booked.success === true && /^mt-[0-9a-z]{13}$/.test(booked.meeting.id) && /^i-[0-9a-z]{13}$/.test(booked.interactionId) && booked.notConfigured === false && booked.filename === booked.meeting.id + '.ics',
   'planmeeting: booked — an mt- id, the i- id from Network, the filename (' + JSON.stringify({ s: booked.success, e: booked.error, id: booked.meeting && booked.meeting.id, i: booked.interactionId }) + ')');
const irow = iRows().find((x) => icol(x, 'Interaction ID') === booked.interactionId);
ok(irow && icol(irow, 'Kind') === 'meeting' && icol(irow, 'Contact ID') === C_JANE && icol(irow, 'Account ID') === 'a-0000000000001' && icol(irow, 'Date') === '2026-11-16' && icol(irow, 'Evidence Link') === booked.meeting.id
   && icol(irow, 'Event Slug') === 'alpha-2026' && icol(irow, 'Owner') === OWNER && icol(irow, 'Summary') === 'Meeting at Alpha Show 2026 · 15:00–15:30 · Hall B café' && !/\n/.test(icol(irow, 'Summary')),
   'Network: the `meeting` Interaction — the mt- id as evidence, the event slug, the day, one line (never the note)');
ok(!JSON.stringify(iRows()).includes('Gridstack Pro pricing'), 'Network: the note never crosses the bridge');
const mrow = mRows()[0];
ok(mRows().length === 1 && mrow[0] === booked.meeting.id && mrow[1] === OWNER && mrow[2] === 'alpha-2026' && mrow[3] === C_JANE && mrow[4] === 'a-0000000000001' && mrow[5] === '2026-11-16T15:00' && mrow[6] === '2026-11-16T15:30'
   && mrow[7] === 'Hall B café' && mrow[8] === 'Gridstack Pro pricing; bring the RFP timeline' && mrow[9] === booked.meeting.id + '@events.lightaisolutions.github.io' && mrow[10] === booked.interactionId,
   'Meetings row: the §5 columns — the i- id in Network Interaction ID, the UID from the mt- id (' + JSON.stringify(mrow) + ')');
const ics = booked.ics || '', flat = ics.replace(/\r\n /g, '');   // unfolded for the content checks
ok(/\r\nDTSTART:20261116T210000Z\r\n/.test(ics) && /\r\nDTEND:20261116T213000Z\r\n/.test(ics), 'ICS: DTSTART / DTEND in UTC from 15:00 America/Chicago (CST, −6) → 21:00Z');
ok(flat.indexOf('UID:' + booked.meeting.id + '@events.') > 0 && /SUMMARY:Meeting with Jane Doe \(Fluence Energy\) — Alpha Show 2026/.test(flat) && /LOCATION:Hall B café\\, Austin Convention Center\\, Austin/.test(flat)
   && flat.indexOf('DESCRIPTION:Gridstack Pro pricing\\; bring the RFP timeline') > 0 && flat.indexOf('Network interaction ' + booked.interactionId) > 0 && /^BEGIN:VCALENDAR\r\n/.test(ics) && /END:VCALENDAR\r\n$/.test(ics),
   'ICS: the UID, the summary with the contact and the account, the escaped location and description naming the i- id, CRLF ends');
ok(ics.split('\r\n').every((l) => Buffer.byteLength(l, 'utf8') <= 75), 'ICS: every line folded at 75 octets');
const bookAudit = counters.audit.filter((a) => a.op === 'events_planmeeting').pop();
ok(bookAudit && bookAudit.details.ok === 1 && bookAudit.details.meetingId === booked.meeting.id && !('place' in bookAudit.details) && !('note' in bookAudit.details), 'audit: the booking row carries ids and flags — never the place or the note');
// the meeting on the next plan: fixed on its day, the open slot split, the contact named from one read
counters.fetch = 0; counters.urls = [];
const plan4 = op(ADMIN, 'plan', { slug: 'alpha-2026' });
const mItem = plan4.days[0].items.find((i) => i.kind === 'meeting');
ok(plan4.meetings.length === 1 && plan4.meetings[0].id === booked.meeting.id && plan4.meetings[0].contactName === 'Jane Doe' && plan4.meetings[0].accountName === 'Fluence Energy' && plan4.meetings[0].interactionId === booked.interactionId,
   'plan: the booked meeting on the answer with the contact named (' + JSON.stringify(plan4.meetings[0]) + ')');
ok(mItem && mItem.start === '15:00' && mItem.end === '15:30' && mItem.meetingId === booked.meeting.id && mItem.title === 'Meeting · Jane Doe' && mItem.place === 'Hall B café', 'plan: the meeting is a fixed item on its day');
ok(plan4.days[0].items.filter((i) => i.kind === 'open').map((i) => i.start + '-' + i.end).join(',') === '11:30-14:00,15:30-16:00', 'plan: the open slot split around the meeting (the 15:00 slot gone, the half hour after it offered) (' + plan4.days[0].items.filter((i) => i.kind === 'open').map((i) => i.start + '-' + i.end).join(',') + ')');
ok(counters.urls.filter((u) => /nop=interaction/.test(u)).length === 1, 'plan: one pick-list read for the meeting\'s account');
// unbook
ok(op(ADMIN, 'planunbook', { id: 'mt-nope' }).error === 'bad_meeting_id' && op(ADMIN, 'planunbook', { id: 'mt-0000000000009' }).error === 'not_found', 'planunbook: a bad id and an unknown id refused by name');
r = op(ADMIN, 'planunbook', { id: booked.meeting.id });
ok(r.success && r.removed === true && r.interactionId === booked.interactionId && mRows().length === 0 && iRows().some((x) => icol(x, 'Interaction ID') === booked.interactionId), 'planunbook: the row removed, the Network record kept (D15: the Interaction is the record)');
ok(op(ADMIN, 'plan', { slug: 'alpha-2026' }).meetings.length === 0, 'plan: no meeting after the unbook');

// ── 5. nop=interaction — the six token-boundary cases, the write leg's rows ─
const nwOpen0 = nwCounters.openById;
const peerCases = [
  ['property unset', () => { const save = nwProps.NETWORK_PEER_TOKEN; delete nwProps.NETWORK_PEER_TOKEN; const x = nwPeer({ parameter: { t: TOKEN, nop: 'interaction', owner: OWNER, accountId: 'a-0000000000001' } }); nwProps.NETWORK_PEER_TOKEN = save; return x; }],
  ['wrong token', () => nwPeer({ parameter: { t: 'x'.repeat(32), nop: 'interaction', owner: OWNER, accountId: 'a-0000000000001' } })],
  ['t absent', () => nwPeer({ parameter: { nop: 'interaction', owner: OWNER, accountId: 'a-0000000000001' } })],
  ['t empty', () => nwPeer({ parameter: { t: '', nop: 'interaction', owner: OWNER, accountId: 'a-0000000000001' } })],
  ['sub-16 property', () => { const save = nwProps.NETWORK_PEER_TOKEN; nwProps.NETWORK_PEER_TOKEN = 'short'; const x = nwPeer({ parameter: { t: 'short', nop: 'interaction', owner: OWNER, accountId: 'a-0000000000001' } }); nwProps.NETWORK_PEER_TOKEN = save; return x; }],
  ['unknown nop', () => nwPeer({ parameter: { t: TOKEN, nop: 'interactions', owner: OWNER } })]
];
peerCases.forEach(([name, fn]) => { const x = fn(); ok(flatDenied(x), 'nop=interaction boundary — ' + name + ': flat denied (' + JSON.stringify(x) + ')'); });
ok(nwCounters.openById === nwOpen0 && nwCounters.fetch === 0, 'nop=interaction boundary: zero sheet opens and zero fetches across the six cases');
ok(nwPeer({ parameter: { t: TOKEN, nop: 'interaction' } }).error === 'owner_required', 'nop=interaction: no owner is owner_required');
const wr = (rows, extra) => nwPeer({ parameter: Object.assign({ t: TOKEN, nop: 'interaction', owner: OWNER }, extra || {}), postData: { contents: JSON.stringify({ owner: OWNER, interactions: rows }), type: 'application/json' } });
const good = { contactId: C_JANE, accountId: 'a-0000000000001', kind: 'meeting', date: '2026-11-17', summary: 'Meeting at Alpha Show 2026 · 09:00–09:30', evidence: 'mt-0000000000042', eventSlug: 'alpha-2026' };
n0 = iRows().length;
r = wr([
  good,
  Object.assign({}, good, { kind: 'scan' }),                        // 1 bad_kind — only meeting · calendar
  Object.assign({}, good, { date: '2026-13-40' }),                  // 2 bad_date
  Object.assign({}, good, { summary: '' }),                         // 3 summary_required
  Object.assign({}, good, { evidence: 'promoted:i-x:y' }),          // 4 bad_evidence — an mt- / pl- id or a URL only
  Object.assign({}, good, { eventSlug: 'Bad Slug' }),               // 5 bad_slug
  Object.assign({}, good, { contactId: 'c-0000000000099' }),        // 6 contact_not_found
  Object.assign({}, good, { contactId: C_ANN }),                    // 7 account_mismatch
  Object.assign({}, good, { kind: 'calendar', evidence: 'https://calendar.example/ev/1', eventSlug: '', summary: 'Line one\nLine two — a body is collapsed' })   // 8 written
]);
ok(r.success && r.written === 2 && r.rejected.map((x) => x.index + ':' + x.reason).join(',') === '1:bad_kind,2:bad_date,3:summary_required,4:bad_evidence,5:bad_slug,6:contact_not_found,7:account_mismatch' && r.ids.length === 9 && /^i-/.test(r.ids[0]) && r.ids[1] === '' && /^i-/.test(r.ids[8]),
   'nop=interaction write: two written, seven rejected by index and name, the ids in row order (' + JSON.stringify(r) + ')');
ok(iRows().length === n0 + 2 && icol(iRows()[iRows().length - 1], 'Summary') === 'Line one Line two — a body is collapsed' && icol(iRows()[iRows().length - 1], 'Event Slug') === '' && icol(iRows()[iRows().length - 1], 'Kind') === 'calendar',
   'nop=interaction write: the calendar row lands with the summary collapsed to one line and an empty slug accepted');
ok(wr([]).error === 'interactions_required' && nwPeer({ parameter: { t: TOKEN, nop: 'interaction', owner: OWNER }, postData: { contents: '{not json', type: 'application/json' } }).error === 'bad_json'
   && nwPeer({ parameter: { t: TOKEN, nop: 'interaction', owner: OWNER }, postData: { contents: JSON.stringify({ owner: 'other@example.com', interactions: [good] }), type: 'application/json' } }).error === 'owner_mismatch',
   'nop=interaction write: an empty list, a bad body and a foreign owner refused by name');
const wAudit = nwCounters.audit.filter((a) => a.op === 'peer_interaction_write').pop();
ok(wAudit && Object.keys(wAudit.details).sort().join(',') === 'rejected,written', 'audit: the write row is counts only');
const rAudit = nwCounters.audit.filter((a) => a.op === 'peer_interaction_read').pop();
ok(rAudit && Object.keys(rAudit.details).sort().join(',') === 'accountId,contacts', 'audit: the read row is the account id and a count');
ok(nwPeer({ parameter: { t: TOKEN, nop: 'interaction', owner: OWNER, accountId: 'a-0000000000001', interactions: JSON.stringify([good]) } }).written === 1, 'nop=interaction: a form-encoded caller may carry the rows in an `interactions` field');

// ── 6. not_configured degrades — never fails ──────────────────────────────
delete props.NETWORK_PEER_TOKEN;
counters.fetch = 0; counters.urls = [];
const planNc = op(ADMIN, 'plan', { slug: 'alpha-2026' });
ok(planNc.success === true && planNc.notConfigured === true && planNc.booths.length === 0 && planNc.days.length === 2 && planNc.venues.length === 3 && !counters.urls.some((u) => u.indexOf(NW_EXEC) === 0),
   'not_configured: the plan still answers — no booths, the frames and venues stand, zero Network calls (' + JSON.stringify({ s: planNc.success, nc: planNc.notConfigured, b: planNc.booths.length }) + ')');
ok(planNc.sessions.map((s) => s.title).join('|') === 'Grid-scale storage for utilities', 'not_configured: the segment-keyword sessions still match; the contact and decision-maker matches need Network');
const bookNc = op(ADMIN, 'planmeeting', bookP);
ok(bookNc.success === true && bookNc.notConfigured === true && bookNc.interactionId === '' && mRows().length === 1 && mRows()[0][10] === '' && /DTSTART:20261116T210000Z/.test(bookNc.ics),
   'not_configured: the booking writes the Meetings row with no interaction id, says so, and still answers the ICS');
ok(op(ADMIN, 'plancontacts', { accountId: 'a-0000000000001' }).error === 'not_configured', 'not_configured: the pick list passes it through');
op(ADMIN, 'planunbook', { id: mRows()[0][0] });
props.NETWORK_PEER_TOKEN = TOKEN;

// ── 7. Zero live calls; the D12 / D15 greps ───────────────────────────────
ok(counters.escaped === 0 && nwCounters.fetch === 0, 'zero live calls: every fetch answered by a fixture, the Network far side never fetched');
const planBlock = src.slice(src.indexOf('// PROJECT: ── E5 session 1 — the deterministic plan'), src.indexOf('// PROJECT START — Add your project-specific code here\n// PROJECT END'));
const page = P('live-site-pages/Events.html');
['maps.googleapis', 'places.googleapis', 'PLACES_API_KEY', 'GmailApp', 'CalendarApp', 'MailApp', 'linkedin.com'].forEach((needle) => {
  ok(planBlock.indexOf(needle) < 0, 'D12 / D15 grep: the plan block never names ' + needle);
});
['maps.googleapis', 'places.googleapis', 'GmailApp', 'CalendarApp', 'gmail.', 'linkedin.com'].forEach((needle) => {
  ok(page.indexOf(needle) < 0, 'D12 / D15 grep: the served page never names ' + needle);
});
ok(/overpass-api\.de\/api\/interpreter/.test(planBlock) && !/googleapis|PLACES_API_KEY|Nearby Search/.test(planBlock), 'D12: Overpass is the only venue source — no Google endpoint, no key');
ok(extract(nwSrc, 'nwPeerInteractionWrite_').indexOf('nwInteractionAdd_(') > 0, 'Network: the write leg records through the same nwInteractionAdd_ every session op uses');

console.log('check-events-plan: ' + checks + ' checks, ' + failures + ' failure(s)');
if (failures) process.exit(1);
console.log('ALL CHECKS PASSED — the booth list ranks by the score\'s own account and segment terms against hand-computed values with the dossier line verbatim; '
  + 'the sessions filter keeps a segment title, a Network contact and a dossier decision maker and drops the rest, the agenda read once and cached; '
  + 'the day plan frames each day from the registry (a default frame said so), fixes the sessions and the meeting, places the ranked visits and offers the open slots; '
  + 'Overpass answers three venues within 600 m, the cache serves the second plan with zero fetches, a failure is empty and uncached; '
  + 'a booking writes the meeting Interaction through Network\'s real nop=interaction leg with the mt- id as evidence and answers the ICS with the right DTSTART; unbook keeps the record; '
  + 'the six token-boundary cases are flat denied with zero reads; not_configured degrades every read and write. Zero live calls.');

// Developed by: LightAISolutions
