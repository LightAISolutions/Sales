#!/usr/bin/env node
// E3 — the recommendation score, proved offline.
//
// NETWORK-EVENTS-DESIGN-PLAN.md §13.11 step 4: the REAL scoring functions are
// lifted out of Events.gs (the check-peer-bridge.js idiom) and run in one
// isolated VM context with stubbed UrlFetchApp, SpreadsheetApp and
// PropertiesService — an in-memory spreadsheet with an empty `Tuning` tab, a
// fixture registry, a fixture profiler-segments.json (with `seats`) and
// profiler-companies.json served from the stubbed fetch, and a stubbed
// Network far side answering nop=accounts and nop=signals. It asserts:
//   · every one of the six terms against a HAND-COMPUTED value on three
//     fixture events (segment fit by audience share, presence capped at 1 and
//     counting one account once, the 12-month half-life on the newest
//     mentioning dossier, region / same-country / abroad, the conflict that
//     excludes the starred event itself, relevance / 5) and the score to two
//     decimals; sorted by score then slug
//   · the empty Tuning tab is seeded ONCE with the six weights and the
//     regions row, and read on every score
//   · changing one weight in the tab reorders the answer on the next call
//   · a malformed weight falls back to its default and is named
//   · a Network side that is not configured degrades — notConfigured true,
//     accountPresence 0, every other term intact, no network fetch
//   · the signal reads stop at the cap and say so
//   · recommend is refused to a non-admin session with zero fetches and zero
//     tab opens
//   · no audit row carries an account name
// Zero live calls — UrlFetchApp is the stub, and it counts.
//
// Usage:  node scripts/check-events-score.js
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

// ── An in-memory Sheet with the surface the score touches ─────────────────
function fakeSheet(name) {
  const rows = [];
  return { name, rows,
    getLastRow: () => rows.length,
    getLastColumn: () => rows.reduce((w, r) => Math.max(w, r.length), 0),
    appendRow: (r) => { rows.push(r.slice()); },
    setFrozenRows() {}, getFrozenRows: () => 1,
    getRange: (r, c, nr, nc) => ({
      getValues: () => { const out = []; for (let i = 0; i < (nr || 1); i++) { const row = rows[r - 1 + i] || []; const o = []; for (let k = 0; k < (nc || 1); k++) o.push(row[c - 1 + k] === undefined ? '' : row[c - 1 + k]); out.push(o); } return out; },
      setValues: (vals) => { vals.forEach((v, i) => { while (rows.length < r + i) rows.push([]); const row = rows[r - 1 + i]; v.forEach((x, k) => { row[c - 1 + k] = x; }); }); },
      setValue: (v) => { while (rows.length < r) rows.push([]); rows[r - 1][c - 1] = v; },
      getValue: () => ((rows[r - 1] || [])[c - 1] === undefined ? '' : rows[r - 1][c - 1])
    }) };
}
function fakeSpreadsheet() {
  const sheets = {};
  return { sheets, getSheetByName: (n) => sheets[n] || null, insertSheet: (n) => { sheets[n] = fakeSheet(n); return sheets[n]; } };
}
function resp(code, text) { return { getResponseCode: () => code, getContentText: () => text }; }

// ── Fixtures ──────────────────────────────────────────────────────────────
const SITE = 'https://lightaisolutions.github.io/Sales/';
const TODAY = '2026-09-22';
const NW_EXEC = 'https://script.google.com/macros/s/AKfycbxuayBnl0pM0upSFEoqUkaW4bbXbVCKGKeGVdcgKiBM5FBj_ykQn30BINHyJMvc0_U8/exec';
const TOKEN = 'k7Qp2mX9vL4sD8wR1nB6yH3tZ0cF5jG8';   // 32 chars, test-only
const REGISTRY = { schemaVersion: 1, built: '2026-09-22T00:00:00Z', events: [
  { slug: 'alpha-2026', name: 'Alpha Show 2026', start: '2026-11-16', end: '2026-11-18', region: 'TX', country: 'US', relevance: 5, status: 'confirmed',
    audience: ['storage-developers-and-ipps', 'utilities', 'cells-and-chemistry'],
    mentions: [{ slug: 'co-a', where: 'sources' }, { slug: 'co-b', where: 'strategy' }, { slug: 'co-c', where: 'sources' }, { slug: 'co-d', where: 'developments' }, { slug: 'co-a', where: 'products' }] },
  { slug: 'beta-2027', name: 'Beta Summit 2027', start: '2027-03-01', end: '2027-03-03', region: 'NV', country: 'US', relevance: 3, status: 'confirmed',
    audience: ['neoclouds'], mentions: [] },
  { slug: 'gamma-2026', name: 'Gamma Forum 2026', start: '2026-11-17', end: '2026-11-19', region: '', country: 'DE', relevance: 4, status: 'tentative',
    audience: ['capital', 'assurance'],
    mentions: ['co-e', 'co-f', 'co-g', 'co-h', 'co-i', 'co-j', 'co-k', 'co-l', 'co-m'].map((s) => ({ slug: s, where: 'sources' })) },
  { slug: 'delta-2026', name: 'Delta (past)', start: '2026-02-09', end: '2026-02-12', region: 'AZ', country: 'US', relevance: 5, status: 'past', audience: ['capital'], mentions: [] },
  { slug: 'epsilon-2027', name: 'Epsilon (cancelled)', start: '2027-05-01', end: '2027-05-02', region: 'TX', country: 'US', relevance: 5, status: 'cancelled', audience: ['utilities'], mentions: [] },
  { slug: 'zeta-2026', name: 'Zeta (ended, still confirmed)', start: '2026-09-01', end: '2026-09-03', region: 'TX', country: 'US', relevance: 5, status: 'confirmed', audience: ['utilities'], mentions: [] }
] };
const SEGMENTS = { schemaVersion: 1, seats: {
  'storage-seller': { label: 'The storage seller', segments: ['storage-developers-and-ipps', 'utilities', 'capital', 'assurance', 'insurance-and-risk-transfer'] },
  'aidc-power-seller': { label: 'The AI-data-centre power seller', segments: ['aidc-developers-and-landlords', 'hyperscalers-and-ai-labs', 'epc-and-construction', 'neoclouds', 'utilities'] }
}, segments: [] };
// co-a is the newest of alpha's four dossiers (this month → 0 months → no decay);
// gamma's nine (eight distinct count, capped) newest is co-i at 12 months → halved.
const COMPANIES = { schemaVersion: 1, companies: [
  { slug: 'co-a', name: 'Co A', lastUpdated: '2026-09-04' }, { slug: 'co-b', name: 'Co B', lastUpdated: '2026-06-01' },
  { slug: 'co-c', name: 'Co C', lastUpdated: '2025-01-15' }, { slug: 'co-d', name: 'Co D', lastUpdated: '2026-08-30' },
  { slug: 'co-e', name: 'Co E', lastUpdated: '2025-09-30' }, { slug: 'co-f', name: 'Co F', lastUpdated: '2025-03-01' },
  { slug: 'co-g', name: 'Co G', lastUpdated: '2025-03-01' }, { slug: 'co-h', name: 'Co H', lastUpdated: '2025-03-01' },
  { slug: 'co-i', name: 'Co I', lastUpdated: '2025-09-30' }, { slug: 'co-j', name: 'Co J', lastUpdated: '2025-03-01' },
  { slug: 'co-k', name: 'Co K', lastUpdated: '2025-03-01' }, { slug: 'co-l', name: 'Co L', lastUpdated: '2025-03-01' },
  { slug: 'co-m', name: 'Co M', lastUpdated: '2024-12-01' }
] };
// alpha's dossiers: co-a 2026-09 (0 months), co-b, co-c, co-d — newest is 2026-09 → decay 1
// gamma's dossiers: newest 2025-09-30 → 12 calendar months → 0.5
const ACCOUNTS = [
  { id: 'a-0000000000001', name: 'Acme Storage', slug: '', relationship: 'target', stage: 'shortlist', segments: [], tags: [] },     // 1.0
  { id: 'a-0000000000002', name: 'Bolt Utility', slug: '', relationship: 'target', stage: 'none', segments: [], tags: [] },          // 0.4
  { id: 'a-0000000000003', name: 'Cust Corp', slug: '', relationship: 'customer', stage: 'negotiation', segments: [], tags: [] },    // 0.5 (customer, any stage)
  { id: 'a-0000000000004', name: 'Chan Partners', slug: '', relationship: 'channel', stage: 'won', segments: [], tags: [] }          // 0.5, no signals
];
let SIGNALS = {
  'a-0000000000001': [
    { eventSlug: 'alpha-2026', kind: 'exhibitor', confidence: 0.9, evidenceUrl: 'https://alpha.example/exhibitors/acme' },
    { eventSlug: 'alpha-2026', kind: 'speaker', confidence: 0.7, evidenceUrl: 'https://alpha.example/speakers/acme' },   // same account — counts once, at 0.9
    { eventSlug: 'gamma-2026', kind: 'exhibitor', confidence: 0.5, evidenceUrl: 'https://gamma.example/acme' },
    { eventSlug: 'delta-2026', kind: 'exhibitor', confidence: 0.9, evidenceUrl: 'https://delta.example/acme' }             // past — never scored
  ],
  'a-0000000000002': [{ eventSlug: 'alpha-2026', kind: 'press-release', confidence: 0.8, evidenceUrl: 'https://wire.example/bolt' }],
  'a-0000000000003': [{ eventSlug: 'beta-2027', kind: 'linkedin-manual', confidence: 0.8, evidenceUrl: 'https://www.linkedin.com/posts/cust' }],
  'a-0000000000004': []
};
// Hand-computed (default weights .35 .35 .15 .10 .25(−) .05):
//   alpha  segmentFit 2/3 (storage-devs, utilities of 3)   presence min(1, 1.0×.9 + .4×.8 = 1.22) = 1
//          salience min(1, 4/8) × 0.5^(0/12) = 0.5          proximity 1 (TX preferred)
//          conflict −1 (gamma, starred registered, 17–19 Nov overlaps 16–18)   prior 5/5 = 1
//          score = .35×.6667 + .35×1 + .15×.5 + .10×1 − .25 + .05×1 = .23333+.35+.075+.10−.25+.05 = 0.55833 → 0.56
//   beta   fit 1/1   presence .5×.8 = .4   salience 0   proximity .5 (NV not preferred, US is TX's country)   conflict 0   prior .6
//          score = .35 + .14 + 0 + .05 + 0 + .03 = 0.57
//   gamma  fit 2/2   presence 1.0×.5 = .5   salience min(1, 8/8) × 0.5^(12/12) = .5   proximity 0 (DE)   conflict 0 (its own star)   prior .8
//          score = .35 + .175 + .075 + 0 + 0 + .04 = 0.64
const EXPECT = {
  'alpha-2026': { segmentFit: 2 / 3, accountPresence: 1, corpusSalience: 0.5, proximity: 1, conflict: -1, relevancePrior: 1, score: 0.56 },
  'beta-2027':  { segmentFit: 1, accountPresence: 0.4, corpusSalience: 0, proximity: 0.5, conflict: 0, relevancePrior: 0.6, score: 0.57 },
  'gamma-2026': { segmentFit: 1, accountPresence: 0.5, corpusSalience: 0.5, proximity: 0, conflict: 0, relevancePrior: 0.8, score: 0.64 }
};

// ── The context: one spreadsheet, one property store, counted calls ───────
const src = P('googleAppsScripts/Events/Events.gs');
const ss = fakeSpreadsheet();
const counters = { openById: 0, fetch: 0, urls: [], audit: [] };
const props = { NETWORK_PEER_TOKEN: TOKEN };
const sessions = {
  'admin-token-000000000000000000000000': { email: 'dev@example.com', role: 'admin', permissions: ['read', 'write', 'admin'] },
  'analyst-token-0000000000000000000000': { email: 'ana@example.com', role: 'analyst', permissions: ['read'] }
};
let accountsAnswer = () => ({ success: true, built: TODAY, accounts: ACCOUNTS });
function route(url) {
  if (url === SITE + 'events-data/events.json') return resp(200, JSON.stringify(REGISTRY));
  if (url === SITE + 'profiler-data/profiler-segments.json') return resp(200, JSON.stringify(SEGMENTS));
  if (url === SITE + 'profiler-data/profiler-companies.json') return resp(200, JSON.stringify(COMPANIES));
  if (url.indexOf(NW_EXEC + '?action=peer&nop=accounts&t=' + TOKEN + '&owner=dev%40example.com') === 0) return resp(200, JSON.stringify(accountsAnswer()));
  const m = new RegExp('^' + NW_EXEC.replace(/[.?+]/g, '\\$&') + '\\?action=peer&nop=signals&t=' + TOKEN + '&owner=dev%40example\\.com&accountId=(a-[0-9a-z]{13})$').exec(url);
  if (m) return resp(200, JSON.stringify({ success: true, built: TODAY, signals: SIGNALS[m[1]] || [] }));
  throw new Error('offline: ' + url);
}
const ctx = {
  UrlFetchApp: { fetch: (url) => { counters.fetch++; counters.urls.push(url); return route(url); } },
  SpreadsheetApp: { openById: () => { counters.openById++; return ss; } },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null) }) },
  Utilities: { formatDate: (d, tz) => { new Intl.DateTimeFormat('en-CA', { timeZone: tz }); return TODAY; } },
  Session: { getScriptTimeZone: () => 'America/New_York' },
  Logger: { log() {} },
  auditLog: (evName, user, op, details) => { counters.audit.push({ ev: evName, user, op, details }); },
  validateSessionForData: (token) => { if (!sessions[token]) throw new Error('SESSION_EXPIRED'); return sessions[token]; },
  resolveOwnerSet_: () => ({ set: {} }),
  console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN, isFinite, encodeURIComponent, Intl
};
vm.createContext(ctx);
vm.runInContext(
  'var EMBED_PAGE_URL = "' + SITE + 'Events.html";\nvar SPREADSHEET_ID = "stub";\n' + [
    'EV_ROLE_CAPS', 'EV_TABS', 'EV_REGISTRY_URL', '_evRegistryCache', 'EV_PEER_TOKEN_PROP', 'EV_NETWORK_TOKEN_PROP', 'NETWORK_PEER_EXEC',
    'EV_SEGMENTS_URL', 'EV_COMPANIES_URL', 'EV_SCORE_TERMS', 'EV_TUNING_DEFAULTS', 'EV_STAGE_WEIGHT', 'EV_STAGE_DEFAULT_WEIGHT',
    'EV_RELATIONSHIP_WEIGHT', 'EV_SCORE_SIGNAL_CAP', 'EV_SCORE_CONFLICT_ATTENDING'
  ].map((n) => constant(src, n)).join('\n') + '\n' + [
    'evRoleOf_', 'evAdmitted_', 'evCan_', 'evRequire_', 'ensureEventsTabs_', 'evListRows_', 'evStr_', 'evCell_', 'handleEventsOp_',
    'evRegistry_', 'evTodayIn_', 'evPagesJson_', 'evNetworkProxy_',
    'evTuning_', 'evSeatSegments_', 'evMentionDates_', 'evStageWeight_', 'evDatesOverlap_', 'evMonthsSince_', 'evRound2_', 'evScoreEvent_', 'evRecommend_'
  ].map((n) => extract(src, n)).join('\n'), ctx, { filename: 'Events.score.js' });

let failures = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.log('  FAIL  ' + msg); } }
const near = (a, b) => Math.abs(a - b) < 1e-9;
const call = (name, ...args) => vm.runInContext(name, ctx)(...args);
const op = (token, eop, extra) => call('handleEventsOp_', { parameter: Object.assign({ eop, session: token }, extra || {}) });
const ADMIN = 'admin-token-000000000000000000000000', ANALYST = 'analyst-token-0000000000000000000000';
const byslug = (r) => Object.fromEntries((r.events || []).map((e) => [e.slug, e]));

// ── 0. The helpers, on their own ──────────────────────────────────────────
ok(call('evMonthsSince_', '2025-09-30', TODAY) === 12 && call('evMonthsSince_', '2026-09-04', TODAY) === 0 && call('evMonthsSince_', '2027-01-01', TODAY) === 0 && call('evMonthsSince_', '', TODAY) === 0,
   'months since: calendar months, never negative, 0 when undated');
ok(call('evDatesOverlap_', '2026-11-16', '2026-11-18', '2026-11-18', '2026-11-20') && !call('evDatesOverlap_', '2026-11-16', '2026-11-18', '2026-11-19', '2026-11-20') && call('evDatesOverlap_', '2026-11-16', '', '2026-11-16', ''),
   'overlap: inclusive ranges, a one-day event has end = start');
ok(call('evStageWeight_', { relationship: 'target', stage: 'shortlist' }) === 1 && call('evStageWeight_', { relationship: 'target', stage: 'rfp' }) === 0.8
   && call('evStageWeight_', { relationship: 'target', stage: 'prospecting' }) === 0.6 && call('evStageWeight_', { relationship: 'target', stage: 'none' }) === 0.4
   && call('evStageWeight_', { relationship: 'target', stage: 'won' }) === 0.4 && call('evStageWeight_', { relationship: 'customer', stage: 'negotiation' }) === 0.5
   && call('evStageWeight_', { relationship: 'channel', stage: 'none' }) === 0.5 && call('evStageWeight_', { relationship: 'supplier', stage: 'shortlist' }) === 0,
   'stage weight: the §6 table, customer / partner / channel 0.5 at any stage, an unscored relationship 0');

// ── 1. The refusal: zero fetches, zero tab opens ───────────────────────────
let r = op(ANALYST, 'recommend');
ok(r.success === false && r.error === 'ROLE_DENIED' && r.role === 'analyst', 'recommend: refused to an analyst session (' + JSON.stringify(r) + ')');
ok(counters.fetch === 0 && counters.openById === 0, 'recommend refusal: zero UrlFetchApp and zero SpreadsheetApp.openById (saw ' + counters.fetch + ' / ' + counters.openById + ')');
ok(counters.audit.length === 1 && counters.audit[0].ev === 'security_alert' && counters.audit[0].op === 'events_not_admitted' && JSON.stringify(counters.audit).indexOf('Acme') < 0, 'recommend refusal: one security_alert audit row (not admitted), no account name');
ok(op('no-such-token-0000000000000000000000', 'recommend').error === 'SESSION_EXPIRED', 'recommend: an unknown session is SESSION_EXPIRED');

// ── 2. The first admin score — seeds Tuning, every term hand-checked ──────
// gamma is starred as registered (the conflict input); alpha is starred as planning (not a conflict)
const seeded = call('ensureEventsTabs_');
seeded.stars.appendRow(['st-0000000000001', 'dev@example.com', 'gamma-2026', '', 'registered', TODAY, TODAY]);
seeded.stars.appendRow(['st-0000000000002', 'dev@example.com', 'alpha-2026', '', 'planning', TODAY, TODAY]);
seeded.stars.appendRow(['st-0000000000003', 'other@example.com', 'beta-2027', '', 'registered', TODAY, TODAY]);   // another owner — never a conflict
ok(seeded.tuning.rows.length === 1, 'Tuning: created empty by ensureEventsTabs_ (header only)');
// preferred regions: TX — set AFTER the seed so the seed itself is proven, then edited the way the admin would
const fetchBefore = counters.fetch;
r = op(ADMIN, 'recommend');
ok(r.success === true && r.seeded === true, 'recommend: the first score seeds Tuning (' + JSON.stringify({ success: r.success, seeded: r.seeded, error: r.error }) + ')');
const tun = ss.sheets['Tuning'];
ok(tun.rows.length === 8 && tun.rows.slice(1).map((x) => x[0]).join(',') === 'segmentFit,accountPresence,corpusSalience,proximity,conflict,relevancePrior,regions'
   && tun.rows[1][1] === 0.35 && tun.rows[2][1] === 0.35 && tun.rows[3][1] === 0.15 && tun.rows[4][1] === 0.10 && tun.rows[5][1] === 0.25 && tun.rows[6][1] === 0.05 && tun.rows[7][1] === '' && tun.rows.slice(1).every((x) => String(x[2]).length > 10),
   'Tuning: seeded with the six §6 weights, the regions row (empty) and a Note per row');
ok(JSON.stringify(r.weights) === JSON.stringify({ segmentFit: 0.35, accountPresence: 0.35, corpusSalience: 0.15, proximity: 0.1, conflict: 0.25, relevancePrior: 0.05 }) && r.regions.length === 0 && r.defaulted.length === 0,
   'recommend: the answer carries the weights, an empty regions list, nothing defaulted (' + JSON.stringify(r.weights) + ')');
ok(r.events.length === 3 && !byslug(r)['delta-2026'] && !byslug(r)['epsilon-2027'] && !byslug(r)['zeta-2026'], 'recommend: past, cancelled and already-ended rows are not scored (' + r.events.map((e) => e.slug).join(',') + ')');
ok(r.notConfigured === false && r.accounts === 4 && r.accountsRead === 4 && r.signals === 5 && r.signalsCapped === false && r.starred === 1,
   'recommend: four accounts read, five in-scope signals (the past one dropped), one registered star (' + JSON.stringify({ a: r.accounts, ar: r.accountsRead, s: r.signals, st: r.starred }) + ')');
ok(counters.fetch - fetchBefore === 1 + 1 + 4 + 1 + 1, 'recommend: registry + accounts once + four signal reads + segments + companies = 8 fetches (saw ' + (counters.fetch - fetchBefore) + ')');
ok(r.seatSegments.join(',') === 'aidc-developers-and-landlords,assurance,capital,epc-and-construction,hyperscalers-and-ai-labs,insurance-and-risk-transfer,neoclouds,storage-developers-and-ipps,utilities',
   'recommend: seatSegments is the union of both seats from the segments file (utilities once)');
// with no regions row set, proximity is 0 everywhere — every other term already final
let got = byslug(r);
ok(near(got['alpha-2026'].terms.proximity, 0) && near(got['beta-2027'].terms.proximity, 0) && near(got['gamma-2026'].terms.proximity, 0), 'proximity: an empty regions row scores 0 for every event');
// now the admin types TX into the regions row and presses again
tun.rows[7][1] = ' tx ';
const fetchBefore2 = counters.fetch;
r = op(ADMIN, 'recommend');
ok(r.success && r.seeded === false && tun.rows.length === 8, 'Tuning: the second score does not re-seed');
ok(r.regions.join(',') === 'TX', 'Tuning: the regions row is trimmed and upper-cased (' + JSON.stringify(r.regions) + ')');
ok(counters.fetch - fetchBefore2 === 7, 'recommend: the registry is cached per execution — 7 fetches on the second score (saw ' + (counters.fetch - fetchBefore2) + ')');
got = byslug(r);
for (const slug of Object.keys(EXPECT)) {
  const e = got[slug], want = EXPECT[slug];
  ok(!!e, slug + ': scored');
  if (!e) continue;
  for (const t of ['segmentFit', 'accountPresence', 'corpusSalience', 'proximity', 'conflict', 'relevancePrior']) {
    ok(near(e.terms[t], want[t]), slug + ' ' + t + ': ' + e.terms[t] + ' (hand-computed ' + want[t] + ')');
  }
  ok(e.score === want.score, slug + ' score: ' + e.score + ' (hand-computed ' + want.score + ')');
}
ok(r.events.map((e) => e.slug).join(',') === 'gamma-2026,beta-2027,alpha-2026', 'recommend: sorted by score then slug — ' + r.events.map((e) => e.slug + ' ' + e.score).join(' · '));
// the why
const alpha = got['alpha-2026'];
ok(alpha.why.segments.join(',') === 'storage-developers-and-ipps,utilities', 'alpha why: the two matched segments in audience order');
ok(alpha.why.accounts.length === 2 && alpha.why.accounts[0].id === 'a-0000000000001' && alpha.why.accounts[0].name === 'Acme Storage' && alpha.why.accounts[0].stage === 'shortlist'
   && alpha.why.accounts[0].stageWeight === 1 && alpha.why.accounts[0].signal.kind === 'exhibitor' && alpha.why.accounts[0].signal.confidence === 0.9
   && alpha.why.accounts[0].signal.evidenceUrl === 'https://alpha.example/exhibitors/acme' && alpha.why.accounts[1].name === 'Bolt Utility' && alpha.why.accounts[1].stageWeight === 0.4,
   'alpha why: two accounts by name with stage, stage weight and the strongest signal (exhibitor 0.9, not the speaker 0.7): ' + JSON.stringify(alpha.why.accounts));
ok(alpha.why.mentions.join(',') === 'co-a,co-b,co-c,co-d', 'alpha why: four distinct dossiers (co-a named twice counts once)');
ok(alpha.why.conflicts.join(',') === 'gamma-2026', 'alpha why: the starred registered event it overlaps');
ok(got['gamma-2026'].why.conflicts.length === 0 && got['gamma-2026'].why.mentions.length === 9, 'gamma why: its own star is not a conflict; nine dossiers listed, eight counted (cap)');
ok(got['beta-2027'].why.accounts.length === 1 && got['beta-2027'].why.accounts[0].relationship === 'customer' && got['beta-2027'].why.accounts[0].stageWeight === 0.5, 'beta why: the customer account at 0.5 whatever its stage');

// ── 3. A weight change reorders the answer on the next call, no deploy ───
tun.rows[2][1] = 0;      // accountPresence → 0
tun.rows[4][1] = 0.5;    // proximity → 0.5
r = op(ADMIN, 'recommend');
got = byslug(r);
// alpha = .23333 + 0 + .075 + .5 − .25 + .05 = 0.60833 → 0.61 ; beta = .35 + 0 + 0 + .25 + 0 + .03 = 0.63 ; gamma = .35 + 0 + .075 + 0 + 0 + .04 = 0.465 → 0.47
ok(got['alpha-2026'].score === 0.61 && got['beta-2027'].score === 0.63 && got['gamma-2026'].score === 0.47, 'weight change: the three scores recomputed (' + r.events.map((e) => e.slug + ' ' + e.score).join(' · ') + ')');
ok(r.events.map((e) => e.slug).join(',') === 'beta-2027,alpha-2026,gamma-2026' && r.weights.accountPresence === 0 && r.weights.proximity === 0.5, 'weight change: the order is now beta, alpha, gamma');
ok(got['alpha-2026'].why.accounts.length === 2, 'weight change: the why still lists the accounts even at weight 0');

// ── 4. A malformed weight falls back and is named ─────────────────────────
tun.rows[3][1] = 'abc';    // corpusSalience
tun.rows[5][1] = 7;        // conflict — out of 0..1
tun.rows.splice(6, 1);     // relevancePrior row deleted by hand
r = op(ADMIN, 'recommend');
ok(r.success && r.defaulted.join(',') === 'corpusSalience,conflict,relevancePrior' && r.weights.corpusSalience === 0.15 && r.weights.conflict === 0.25 && r.weights.relevancePrior === 0.05,
   'Tuning: a non-number, an out-of-range weight and a missing row each fall back to the default and are named (' + JSON.stringify(r.defaulted) + ')');
ok(tun.rows.length === 7, 'Tuning: a partial tab is not re-seeded (the admin\'s rows are theirs)');
tun.rows.splice(6, 0, ['relevancePrior', 0.05, 'restored']); tun.rows[3][1] = 0.15; tun.rows[5][1] = 0.25; tun.rows[2][1] = 0.35; tun.rows[4][1] = 0.10;

// ── 5. Ties break on slug ─────────────────────────────────────────────────
r = op(ADMIN, 'recommend');
ok(r.events.map((e) => e.slug).join(',') === 'gamma-2026,beta-2027,alpha-2026' && r.defaulted.length === 0, 'restored weights: the default order is back');
tun.rows[1][1] = 0; tun.rows[2][1] = 0; tun.rows[3][1] = 0; tun.rows[4][1] = 0; tun.rows[5][1] = 0; tun.rows[6][1] = 0;
r = op(ADMIN, 'recommend');
ok(r.events.every((e) => e.score === 0) && r.events.map((e) => e.slug).join(',') === 'alpha-2026,beta-2027,gamma-2026', 'all weights 0: every score 0 (never −0) and the tie breaks on slug');
tun.rows[1][1] = 0.35; tun.rows[2][1] = 0.35; tun.rows[3][1] = 0.15; tun.rows[4][1] = 0.10; tun.rows[5][1] = 0.25; tun.rows[6][1] = 0.05;

// ── 6. not_configured degrades, never fails ───────────────────────────────
delete props.NETWORK_PEER_TOKEN;
const fetchBefore3 = counters.fetch;
r = op(ADMIN, 'recommend');
got = byslug(r);
ok(r.success === true && r.notConfigured === true && r.accounts === 0 && r.signals === 0 && !('networkError' in r), 'not_configured: success with notConfigured true, zero accounts');
ok(counters.fetch - fetchBefore3 === 2 && counters.urls.slice(fetchBefore3).every((u) => u.indexOf('script.google.com') < 0), 'not_configured: no network fetch at all — only the two Pages files (saw ' + (counters.fetch - fetchBefore3) + ')');
ok(near(got['alpha-2026'].terms.accountPresence, 0) && near(got['gamma-2026'].terms.accountPresence, 0) && got['alpha-2026'].why.accounts.length === 0, 'not_configured: accountPresence is 0 and the why lists no account');
ok(near(got['alpha-2026'].terms.segmentFit, 2 / 3) && near(got['alpha-2026'].terms.corpusSalience, 0.5) && near(got['alpha-2026'].terms.proximity, 1) && got['alpha-2026'].terms.conflict === -1 && near(got['alpha-2026'].terms.relevancePrior, 1),
   'not_configured: every other term is still computed');
// alpha = .23333 + 0 + .075 + .10 − .25 + .05 = 0.20833 → 0.21 ; beta = .35 + 0 + 0 + .05 + 0 + .03 = 0.43 ; gamma = .35 + 0 + .075 + 0 + 0 + .04 = 0.465 → 0.47
ok(got['alpha-2026'].score === 0.21 && got['beta-2027'].score === 0.43 && got['gamma-2026'].score === 0.47, 'not_configured: the scores without the account term (' + r.events.map((e) => e.slug + ' ' + e.score).join(' · ') + ')');
props.NETWORK_PEER_TOKEN = 'short';
r = op(ADMIN, 'recommend');
ok(r.success && r.notConfigured === true, 'not_configured: a sub-16 property is the same degrade');
props.NETWORK_PEER_TOKEN = TOKEN;

// ── 7. An unreachable Network side is named, the rest computed ────────────
accountsAnswer = () => { throw new Error('offline'); };
r = op(ADMIN, 'recommend');
ok(r.success && r.notConfigured === false && r.networkError === 'upstream_unreachable' && r.accounts === 0 && byslug(r)['gamma-2026'].score === 0.47, 'network down: success, networkError named, scores without the account term');
accountsAnswer = () => ({ success: true, built: TODAY, accounts: ACCOUNTS });

// ── 8. The signal reads stop at the cap ───────────────────────────────────
const many = []; for (let i = 1; i <= 45; i++) many.push({ id: 'a-' + String(i).padStart(13, '0'), name: 'Acct ' + i, relationship: 'target', stage: 'none', segments: [], tags: [] });
accountsAnswer = () => ({ success: true, built: TODAY, accounts: many });
const fetchBefore4 = counters.fetch;
r = op(ADMIN, 'recommend');
ok(r.success && r.accounts === 45 && r.accountsRead === 40 && r.signalsCapped === true, 'cap: 45 accounts, 40 read, capped said (' + JSON.stringify({ a: r.accounts, ar: r.accountsRead, c: r.signalsCapped }) + ')');
ok(counters.fetch - fetchBefore4 === 1 + 40 + 2, 'cap: accounts once + 40 signal reads + two Pages files (saw ' + (counters.fetch - fetchBefore4) + ')');
accountsAnswer = () => ({ success: true, built: TODAY, accounts: ACCOUNTS });

// ── 9. A Pages file that cannot be read zeroes its term and is named ──────
const realRoute = route;
let segDown = true;
ctx.UrlFetchApp.fetch = (url) => { counters.fetch++; counters.urls.push(url); if (segDown && /profiler-segments\.json$/.test(url)) return resp(503, 'down'); return realRoute(url); };
r = op(ADMIN, 'recommend');
got = byslug(r);
ok(r.success && r.unavailable.join(',') === 'segments_unavailable' && r.seatSegments.length === 0 && near(got['alpha-2026'].terms.segmentFit, 0) && got['alpha-2026'].why.segments.length === 0 && near(got['alpha-2026'].terms.accountPresence, 1),
   'segments file down: segmentFit 0, named under unavailable, the other terms intact');
segDown = false;

// ── 10. Nothing audited names an account ──────────────────────────────────
const auditText = JSON.stringify(counters.audit);
ok(counters.audit.filter((a) => a.op === 'events_recommend').length >= 8 && auditText.indexOf('Acme') < 0 && auditText.indexOf('Bolt') < 0 && auditText.indexOf('Cust') < 0 && auditText.indexOf('a-0000000000001') < 0 && auditText.indexOf(TOKEN) < 0,
   'audit: counts only — no account name, id or token in any row');
const last = counters.audit.filter((a) => a.op === 'events_recommend').pop();
ok(last && typeof last.details.events === 'number' && typeof last.details.accounts === 'number' && typeof last.details.signals === 'number' && 'notConfigured' in last.details, 'audit: the recommend row carries the counts (' + JSON.stringify(last.details) + ')');
ok(counters.urls.every((u) => u.indexOf(SITE) === 0 || u.indexOf(NW_EXEC) === 0), 'every fetch went to the Pages site or the Network exec URL — nowhere else');

console.log('check-events-score: ' + checks + ' checks, ' + failures + ' failure(s)');
if (failures) process.exit(1);
console.log('ALL CHECKS PASSED — the six terms match their hand-computed values and the score its two decimals on three fixture events; Tuning seeds once and is read on every score; '
  + 'a weight change reorders the answer; a malformed weight falls back and is named; not_configured degrades with notConfigured true and no network fetch; the signal reads stop at the cap; '
  + 'recommend is refused to a non-admin with zero fetches and zero tab opens; no audit row names an account. Zero live calls.');

// Developed by: LightAISolutions
