#!/usr/bin/env node
// E2 — the Events poller, proved offline.
//
// NETWORK-EVENTS-DESIGN-PLAN.md §13.10 step 5: the REAL poller functions are
// lifted out of Events.gs (the check-peer-bridge.js idiom) and run in one
// isolated VM context with stubbed UrlFetchApp, SpreadsheetApp,
// PropertiesService, ScriptApp and Utilities — an in-memory spreadsheet, a
// fixture roster and registry served from the stubbed fetch, one JSON-LD
// page, one ICS feed built by scripts/build-events-ics.py's own calendar()
// (so the reader accepts what the writer emits), one blocked row, one manual
// row, one html row, one robots-disallowed row and one 403. It asserts:
//   · the six diff kinds each produce exactly ONE Proposed row with the right
//     Before · After, a pr- id, Status pending and the fetched page as evidence
//   · a second run writes ZERO new rows (dedup on source · slug · change · after)
//   · the blocked, manual, html and robots-disallowed rows are NEVER fetched
//   · the 403 writes no proposal — one Polls row with the status and one audit row
//   · a new-event and a new-edition whose dates have already passed are never
//     proposed (E4 s1's developer-approved guard) — counted, not queued
//   · pollnow / decide / applied / installpoller are refused to a non-admin
//     session with zero fetches and zero tab opens
//   · decide → approved with Decided At, applied → the version, an applied
//     row can no longer be decided; installpoller is idempotent (one trigger)
// Zero live calls — UrlFetchApp is the stub, and it counts.
//
// Usage:  node scripts/check-events-poller.js
// Exit:   0 when every assertion holds, 1 on the first that does not.
const fs = require('fs'), vm = require('vm'), path = require('path'), crypto = require('crypto');
const { execFileSync } = require('child_process');
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

// ── An in-memory Sheet with the surface the poller touches ────────────────
function fakeSheet(name) {
  const rows = [];
  return { name, rows,
    getLastRow: () => rows.length,
    getLastColumn: () => rows.reduce((w, r) => Math.max(w, r.length), 0),
    appendRow: (r) => { rows.push(r.slice()); },
    setFrozenRows() {}, getFrozenRows: () => 1,
    deleteRow: (n) => { rows.splice(n - 1, 1); },
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
function resp(code, text) { return { getResponseCode: () => code, getContentText: () => text }; }

// ── Fixtures ──────────────────────────────────────────────────────────────
const SITE = 'https://lightaisolutions.github.io/Sales/';
const ev = (slug, name, series, start, end, extra) => Object.assign({
  slug, name, series, organiser: 'Org', kind: 'conference', start, end, tz: 'America/Chicago',
  city: 'Austin', region: 'TX', country: 'US', venue: 'Austin Convention Center', website: 'https://a.example/' + slug,
  audience: ['capital'], relevance: 3, status: 'confirmed', lastUpdated: '2026-09-01',
  sources: [{ sourceKey: 'src-a', kind: 'jsonld', url: 'https://a.example/events', lastConfirmed: '2026-09-01' }]
}, extra || {});
const REGISTRY = { schemaVersion: 1, built: '2026-09-22T00:00:00Z', events: [
  ev('re-plus-2026', 'RE+ 2026', 'RE+', '2026-09-08', '2026-09-10'),                                   // untouched — confirms
  ev('distributech-2026', 'DISTRIBUTECH International 2026', 'DISTRIBUTECH', '2026-03-24', '2026-03-26'),  // 2027 edition arrives → new-edition
  ev('gone-con-2026', 'Gone Con 2026', 'Gone Con', '2026-11-02', '2026-11-04'),                        // feed marks it cancelled
  ev('old-venue-2026', 'Old Venue Summit 2026', 'Old Venue Summit', '2026-10-05', '2026-10-06'),        // venue changes
  ev('url-change-2026', 'URL Change Expo 2026', 'URL Change Expo', '2026-10-19', '2026-10-21'),         // website changes
  ev('seven-summit-2026', 'Seven Summit 2026', 'Seven Summit', '2026-12-01', '2026-12-03',                // ICS source moves the dates
     { sources: [{ sourceKey: 'src-b', kind: 'ics', url: 'https://b.example/cal.ics', lastConfirmed: '2026-09-01' }] })
] };
const roster = (key, feedKind, cadence, extra) => Object.assign({ key, name: key, url: 'https://' + key + '.example/feed', feedKind, robots: 'allowed', cadence,
  lastProbe: { at: '2026-09-21', status: 200, itemCount: 1, newestItem: '' }, notes: '' }, extra || {});
const ROSTER = { schemaVersion: 1, built: '2026-09-22T00:00:00Z', sources: [
  roster('src-a', 'jsonld', 'weekly', { url: 'https://a.example/events' }),
  roster('src-b', 'ics', 'weekly', { url: 'https://b.example/cal.ics' }),
  roster('src-blocked', 'jsonld', 'weekly', { blocked: 'cloudflare-challenge 2026-09-21' }),
  roster('src-manual', 'jsonld', 'manual'),
  roster('src-html', 'html', 'weekly'),
  roster('src-robots', 'jsonld', 'weekly', { robots: 'disallowed' }),
  roster('src-403', 'jsonld', 'weekly', { url: 'https://c.example/events' })
] };
const ld = (name, start, end, venue, city, url, status) => ({ '@context': 'https://schema.org', '@type': 'Event', name, startDate: start + 'T09:00:00-05:00', endDate: end + 'T17:00:00-05:00',
  location: { '@type': 'Place', name: venue, address: { '@type': 'PostalAddress', addressLocality: city, addressRegion: 'TX', addressCountry: 'US' } }, url, eventStatus: status || 'https://schema.org/EventScheduled' });
const JSONLD_PAGE = '<!doctype html><html><head><title>Events</title>\n'
  + '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Org' }) + '</script>\n'
  + '<script type="application/ld+json">' + JSON.stringify([ld('RE+ 2026', '2026-09-08', '2026-09-10', 'Austin Convention Center', 'Austin', 'https://a.example/re-plus-2026')]) + '</script>\n'
  + '<script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@graph': [
      Object.assign(ld('DISTRIBUTECH International 2027', '2027-02-09', '2027-02-11', 'Kay Bailey Hutchison Convention Center', 'Dallas', 'https://a.example/distributech-2027'), { '@type': 'ExhibitionEvent' }),
      ld('Gone Con 2026', '2026-11-02', '2026-11-04', 'Austin Convention Center', 'Austin', 'https://a.example/gone-con-2026', 'https://schema.org/EventCancelled'),
      ld('Old Venue Summit 2026', '2026-10-05', '2026-10-06', 'Hilton Austin', 'Austin', 'https://a.example/old-venue-2026'),
      ld('URL Change Expo 2026', '2026-10-19', '2026-10-21', 'Austin Convention Center', 'Austin', 'https://a.example/expo/2026/new-home'),
      ld('Grid Futures Forum 2027', '2027-05-04', '2027-05-05', 'Omni Houston', 'Houston', 'https://a.example/grid-futures-2027'),
      // two rows a feed that still lists last year's show would propose — both dated in the past, both skipped by the guard
      ld('Bygone Expo 2025', '2025-05-06', '2025-05-07', 'Omni Houston', 'Houston', 'https://a.example/bygone-2025'),
      Object.assign(ld('DISTRIBUTECH International 2025', '2025-02-11', '2025-02-13', 'Kay Bailey Hutchison Convention Center', 'Dallas', 'https://a.example/distributech-2025'), { '@type': 'ExhibitionEvent' })
    ] }) + '</script>\n<script type="application/ld+json">{not json</script></head><body></body></html>';
// The ICS feed comes from the writer: build-events-ics.py's calendar() over
// a moved Seven Summit row, so the reader is proved against the real emitter.
const movedSeven = Object.assign({}, REGISTRY.events[5], { start: '2026-12-07', end: '2026-12-09', website: 'https://a.example/seven-summit-2026' });
const ICS_FEED = execFileSync('python3', ['-c', [
  'import sys, json, importlib.util',
  'spec = importlib.util.spec_from_file_location("bei", sys.argv[1]); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)',
  'sys.stdout.write(m.calendar(json.loads(sys.argv[2]), "20260922T060000Z"))'
].join('\n'), path.join(ROOT, 'scripts', 'build-events-ics.py'), JSON.stringify([movedSeven])], { encoding: 'utf8' });

// ── The context: one spreadsheet, one property store, counted calls ───────
const src = P('googleAppsScripts/Events/Events.gs');
const ss = fakeSpreadsheet();
const counters = { openById: 0, fetch: 0, urls: [], audit: [], triggers: [] };
const props = {};
const sessions = {   // token → the session validateSessionForData would answer
  'admin-token-000000000000000000000000': { email: 'dev@example.com', role: 'admin', permissions: ['read', 'write', 'admin'] },
  'analyst-token-0000000000000000000000': { email: 'ana@example.com', role: 'analyst', permissions: ['read'] }
};
const routes = {
  [SITE + 'events-data/events.json']: () => resp(200, JSON.stringify(REGISTRY)),
  [SITE + 'events-data/events-sources.json']: () => resp(200, JSON.stringify(ROSTER)),
  'https://a.example/events': () => resp(200, JSONLD_PAGE),
  'https://b.example/cal.ics': () => resp(200, ICS_FEED),
  'https://c.example/events': () => resp(403, '<html>Forbidden</html>')
};
const ctx = {
  UrlFetchApp: { fetch: (url) => { counters.fetch++; counters.urls.push(url); if (!routes[url]) throw new Error('offline: ' + url); return routes[url](); } },
  SpreadsheetApp: { openById: () => { counters.openById++; return ss; } },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null), setProperty: (k, v) => { props[k] = String(v); } }) },
  ScriptApp: {
    WeekDay: { MONDAY: 'MONDAY' },
    getProjectTriggers: () => counters.triggers.slice(),
    deleteTrigger: (t) => { counters.triggers = counters.triggers.filter((x) => x !== t); },
    newTrigger: (fn) => { const t = { getHandlerFunction: () => fn, fn, spec: [] }; const b = { timeBased: () => b, onWeekDay: (d) => { t.spec.push(d); return b; }, atHour: (h) => { t.spec.push(h); return b; }, inTimezone: (z) => { t.spec.push(z); return b; }, create: () => { counters.triggers.push(t); return t; } }; return b; }
  },
  Utilities: {
    getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' },
    computeDigest: (alg, s) => Array.from(crypto.createHash('sha256').update(String(s)).digest()).map((b) => (b > 127 ? b - 256 : b)),
    formatDate: (d, tz, fmt) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
  },
  Session: { getScriptTimeZone: () => 'America/New_York' },
  CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) },
  Logger: { log() {} },
  auditLog: (evName, user, op, details) => { counters.audit.push({ ev: evName, user, op, details }); },
  validateSessionForData: (token) => { if (!sessions[token]) throw new Error('SESSION_EXPIRED'); return sessions[token]; },
  resolveOwnerSet_: () => ({ set: {} }), resolveOwnerScope_: () => ({ owner: 'dev@example.com' }), evNetworkProxy_: () => ({ success: false, error: 'not_configured' }),
  console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN, encodeURIComponent, Intl
};
vm.createContext(ctx);
vm.runInContext(
  'var EMBED_PAGE_URL = "' + SITE + 'Events.html";\nvar SPREADSHEET_ID = "stub";\n' + [
    'EV_ROLE_CAPS', 'EV_ATTENDING', 'EV_SLUG_RE', 'EV_ID_RE', 'EV_ID_PREFIXES', 'EV_TABS', 'EV_REGISTRY_URL', '_evRegistryCache',
    'EV_ROSTER_URL', 'EV_POLL_FEED_KINDS', 'EV_POLL_CHANGES', 'EV_PROPOSED_STATUS', 'EV_POLL_SOURCE_BUDGET_MS', 'EV_POLL_TOTAL_BUDGET_MS',
    'EV_POLL_MAX_BODY', 'EV_POLL_TRIGGER_FN', 'EV_POLL_TZ', 'EV_VERSION_RE', '_evRosterCache', 'EV_SIGNALS_TRIGGER_FN', 'EV_SIGNALS_LAST_PROP'
  ].map((n) => constant(src, n)).join('\n') + '\n' + [
    'evRoleOf_', 'evAdmitted_', 'evCan_', 'evRequire_', 'evRandomBase36_', 'evNewId_', 'ensureEventsTabs_', 'evListRows_', 'evStr_', 'evCell_',
    'evStarOp_', 'handleEventsOp_', 'evRegistry_', 'evTodayIn_',
    'evPagesJson_', 'evRoster_', 'evPollSkipReason_', 'evSlugify_', 'evSeriesBase_', 'evDeriveSlug_', 'evSlugBase_', 'evDateOnly_', 'evAddDaysStr_',
    'evNormUrl_', 'evNormText_', 'evHtmlDecode_', 'evJsonLdBlocks_', 'evIsEventType_', 'evCollectEvents_', 'evAddressField_', 'evNormaliseJsonLd_',
    'evParseJsonLd_', 'evIcsUnescape_', 'evParseIcs_', 'evMatchRegistry_', 'evProposedRow_', 'evDiffItem_', 'evCanonical_', 'evProposedKey_',
    'evProposedKeys_', 'evPollSource_', 'evPollRun_', 'evPollTick', 'evInstallPoller_', 'evPollerInstalled_', 'evProposedRowObj_', 'evProposedList_',
    'evPollsLatest_', 'evPollDecide_', 'evPollApplied_', 'evSignalsInstalled_', 'evSignalsState_'   // E4: the panel's answer carries the sweep's state
  ].map((n) => extract(src, n)).join('\n'), ctx, { filename: 'Events.poller.js' });

let failures = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.log('  FAIL  ' + msg); } }
const call = (name, ...args) => vm.runInContext(name, ctx)(...args);
const op = (token, eop, extra) => call('handleEventsOp_', { parameter: Object.assign({ eop, session: token }, extra || {}) });

// ── 0. The readers, on their own ──────────────────────────────────────────
ok(call('evDeriveSlug_', 'RE+ 2026', '2026-09-08') === 're-plus-2026', 'slug rule: "RE+ 2026" → re-plus-2026');
ok(call('evDeriveSlug_', 'DISTRIBUTECH International', '2027-02-09') === 'distributech-international-2027', 'slug rule: a name without a year gets the start year');
ok(call('evSlugBase_', 'imasons-texas-energy-update-2026-11') === 'imasons-texas-energy-update', 'slug base strips a -YYYY-MM suffix');
const ldItems = call('evParseJsonLd_', JSONLD_PAGE, 'https://a.example/events');
ok(ldItems.length === 8, 'JSON-LD: eight Event objects across an array block, a @graph and a subtype; the Organization and the broken block ignored (' + ldItems.length + ')');
ok(ldItems[0].name === 'RE+ 2026' && ldItems[0].start === '2026-09-08' && ldItems[0].end === '2026-09-10' && ldItems[0].venue === 'Austin Convention Center' && ldItems[0].city === 'Austin', 'JSON-LD: dates are the local calendar date, venue and city from the Place');
ok(ldItems.some((i) => i.cancelled && i.name === 'Gone Con 2026'), 'JSON-LD: EventCancelled is read');
const icsItems = call('evParseIcs_', ICS_FEED, 'https://b.example/cal.ics');
ok(icsItems.length === 1 && icsItems[0].name === 'Seven Summit 2026' && icsItems[0].start === '2026-12-07' && icsItems[0].end === '2026-12-09', 'ICS: the writer\'s VEVENT reads back with the exclusive DTEND moved back one day (' + JSON.stringify(icsItems[0]) + ')');
ok(icsItems[0] && icsItems[0].venue === 'Austin Convention Center' && icsItems[0].city === 'Austin' && icsItems[0].url === 'https://a.example/seven-summit-2026' && /@events\./.test(icsItems[0].uid), 'ICS: LOCATION splits to venue · city, URL and UID carried');
const folded = 'BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nUID:x\r\nDTSTART;VALUE=DATE:20270301\r\nDTEND;VALUE=DATE:20270302\r\nSUMMARY:A very long summary line that the writer would have folded at seventy-fi\r\n ve octets\\, with an escaped comma\r\nLOCATION:Venue\; Hall 2\\, City\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n';
const fi = call('evParseIcs_', folded, '');
ok(fi.length === 1 && fi[0].name === 'A very long summary line that the writer would have folded at seventy-five octets, with an escaped comma' && fi[0].end === '2027-03-01' && fi[0].venue === 'Venue; Hall 2', 'ICS: unfolding, escapes and a one-day VALUE=DATE event');

// ── 1. The first run: six diff kinds, one row each ─────────────────────────
const before = { fetch: counters.fetch, open: counters.openById };
let run = call('evPollRun_', 'poller');
ok(run.success === true && run.sources === 7 && run.fetched === 3 && run.skipped === 4 && run.failed === 1 && run.stopped === false, 'run 1: 7 roster rows — 3 fetched, 4 skipped, 1 failed, not stopped (' + JSON.stringify(run) + ')');
const fetchedUrls = counters.urls.filter((u) => !/events-data\//.test(u));
ok(fetchedUrls.length === 3 && fetchedUrls.every((u) => /^https:\/\/[abc]\.example\//.test(u)), 'run 1: only the jsonld, the ics and the 403 source were fetched (' + fetchedUrls.join(', ') + ')');
ok(!counters.urls.some((u) => /src-(blocked|manual|html|robots)/.test(u)), 'run 1: the blocked, manual, html and robots-disallowed rows were never fetched');
ok(counters.urls.filter((u) => /events-data\/events\.json$/.test(u)).length === 1 && counters.urls.filter((u) => /events-sources\.json$/.test(u)).length === 1
   && counters.urls.every((u) => !/github\.com|api\.github|raw\.githubusercontent/.test(u)), 'run 1: the registry and the roster were read once each from the Pages site, never a GitHub host');
const prop = ss.sheets['Proposed'];
ok(prop && prop.rows[0][0] === 'Proposed ID' && prop.rows.length === 7, 'run 1: six Proposed rows under the schema header (' + (prop ? prop.rows.length - 1 : 'no tab') + ')');
const byChange = {};
prop.rows.slice(1).forEach((r) => { byChange[r[3]] = byChange[r[3]] || []; byChange[r[3]].push(r); });
const kinds = ['new-edition', 'moved-dates', 'changed-venue', 'changed-url', 'cancelled', 'new-event'];
ok(kinds.every((k) => (byChange[k] || []).length === 1), 'run 1: exactly one row per diff kind (' + JSON.stringify(Object.keys(byChange).map((k) => k + ':' + byChange[k].length)) + ')');
ok(run.proposed === 6, 'run 1: the summary counts six proposals');
// E4 s1 — the past-date guard: the 2025 new-event and the 2025 new-edition are counted and never queued
ok(run.pastSkipped === 2 && run.results.find((x) => x.sourceKey === 'src-a').pastSkipped === 2, 'past-date guard: two past rows skipped and counted (' + run.pastSkipped + ')');
ok(!prop.rows.slice(1).some((r) => /2025/.test(r[2]) || /bygone/.test(r[2])), 'past-date guard: no Proposed row for a 2025 edition or event');
ok(!prop.rows.slice(1).some((r) => { try { const a = JSON.parse(r[5]); return (a.end || a.start || '9999') < '2026-09-22'; } catch (e) { return false; } }), 'past-date guard: no proposed After carries a past date');
const J = (s) => JSON.parse(s);
const r1 = (k) => (byChange[k] || [])[0] || [];
ok(r1('moved-dates')[1] === 'src-b' && r1('moved-dates')[2] === 'seven-summit-2026' && JSON.stringify(J(r1('moved-dates')[4])) === '{"end":"2026-12-03","start":"2026-12-01"}' && JSON.stringify(J(r1('moved-dates')[5])) === '{"end":"2026-12-09","start":"2026-12-07"}',
   'moved-dates: from the ICS source, Before the registry dates, After the feed dates (' + r1('moved-dates').slice(1, 6).join(' | ') + ')');
ok(r1('cancelled')[2] === 'gone-con-2026' && J(r1('cancelled')[4]).status === 'confirmed' && J(r1('cancelled')[5]).status === 'cancelled', 'cancelled: Before confirmed, After cancelled');
ok(r1('changed-venue')[2] === 'old-venue-2026' && J(r1('changed-venue')[4]).venue === 'Austin Convention Center' && J(r1('changed-venue')[5]).venue === 'Hilton Austin', 'changed-venue: Before the registry venue, After the feed venue');
ok(r1('changed-url')[2] === 'url-change-2026' && J(r1('changed-url')[4]).website === 'https://a.example/url-change-2026' && J(r1('changed-url')[5]).website === 'https://a.example/expo/2026/new-home', 'changed-url: Before the registry website, After the feed url');
const ne = J(r1('new-edition')[5] || '{}');
ok(r1('new-edition')[2] === 'distributech-2027' && J(r1('new-edition')[4]).slug === 'distributech-2026' && ne.slug === 'distributech-2027' && ne.start === '2027-02-09' && ne.series === 'DISTRIBUTECH' && ne.tz === 'America/Chicago' && ne.status === 'tentative' && ne.sources[0].sourceKey === 'src-a' && ne.sources[0].kind === 'jsonld',
   'new-edition: the known series\' slug base + the new year, the §3 row seeded from the previous edition, tentative (' + JSON.stringify(ne) + ')');
const nw = J(r1('new-event')[5] || '{}');
ok(r1('new-event')[2] === 'grid-futures-forum-2027' && JSON.stringify(J(r1('new-event')[4])) === '{}' && nw.slug === 'grid-futures-forum-2027' && nw.status === 'tentative' && nw.city === 'Houston' && nw.venue === 'Omni Houston' && !('series' in nw),
   'new-event: the derived slug, an empty Before, a tentative §3 row with nothing invented');
ok(prop.rows.slice(1).every((r) => /^pr-[0-9a-z]{13}$/.test(r[0]) && r[8] === 'pending' && /^\d{4}-\d{2}-\d{2}T/.test(r[7]) && r[9] === '' && r[10] === ''), 'every row: a pr- id, Seen At ISO, Status pending, Decided At / Applied In empty');
ok(prop.rows.slice(1).every((r) => (r[1] === 'src-b' ? r[6] === 'https://b.example/cal.ics' : r[6] === 'https://a.example/events')), 'every row: Evidence URL is the fetched page');
ok(new Set(prop.rows.slice(1).map((r) => r[0])).size === 6, 'every row: distinct ids');
ok(!prop.rows.slice(1).some((r) => r[2] === 're-plus-2026'), 'an unchanged edition (RE+ 2026) proposes nothing');
// the 403
const polls = ss.sheets['Polls'];
ok(polls && polls.rows[0].join('|') === 'Source Key|Ran At|Status|Items|Newest Start' && polls.rows.length === 4, 'Polls: the schema header and one row per fetched source (' + (polls ? polls.rows.length - 1 : 'no tab') + ')');
const p403 = polls.rows.find((r) => r[0] === 'src-403');
ok(p403 && p403[2] === 403 && p403[3] === 0 && p403[4] === '', 'the 403 source: one Polls row with the status, no items');
ok(!prop.rows.slice(1).some((r) => r[1] === 'src-403'), 'the 403 source: no proposal');
const failAudit = counters.audit.filter((a) => a.op === 'events_poll_source_failed');
ok(failAudit.length === 1 && failAudit[0].details.sourceKey === 'src-403' && failAudit[0].details.status === 403, 'the 403 source: exactly one audit row naming the status');
const pa = polls.rows.find((r) => r[0] === 'src-a'), pb = polls.rows.find((r) => r[0] === 'src-b');
ok(pa && pa[2] === 200 && pa[3] === 8 && pa[4] === '2027-05-04' && pb && pb[2] === 200 && pb[3] === 1 && pb[4] === '2026-12-07', 'Polls: status 200, item counts (the two past items still counted as read) and the newest start per source');
const runAudit = counters.audit.filter((a) => a.op === 'events_poll_run');
ok(runAudit.length === 1 && runAudit[0].user === 'poller' && runAudit[0].details.proposed === 6 && Object.values(runAudit[0].details).every((v) => typeof v === 'number'), 'the run audit row: counts only, as poller');

// ── 2. The second run writes zero new rows ────────────────────────────────
ctx._evRegistryCache = null; ctx._evRosterCache = null;
run = call('evPollTick');
ok(run.success && run.proposed === 0 && run.duplicates === 6 && prop.rows.length === 7, 'run 2 (through the trigger handler): zero new rows, six duplicates recognised (' + JSON.stringify({ proposed: run.proposed, duplicates: run.duplicates, rows: prop.rows.length - 1 }) + ')');
ok(polls.rows.length === 7, 'run 2: Polls appended again (the outcome log grows, the queue does not)');

// ── 3. The admin refusals ─────────────────────────────────────────────────
const refuse = { fetch: counters.fetch, open: counters.openById, audit: counters.audit.length };
for (const eop of ['pollnow', 'decide', 'applied', 'installpoller', 'proposed']) {
  const r = op('analyst-token-0000000000000000000000', eop, { id: prop.rows[1][0], status: 'approved', ids: prop.rows[1][0], version: 'v07.15r' });
  ok(r.success === false && r.error === 'ROLE_DENIED' && r.role === 'analyst', eop + ': refused to an analyst session (' + JSON.stringify(r) + ')');
}
ok(counters.fetch === refuse.fetch && counters.openById === refuse.open, 'refusals: zero fetches and zero tab opens');
ok(counters.audit.slice(refuse.audit).every((a) => a.ev === 'security_alert' && a.op === 'events_not_admitted'), 'refusals: each one a security_alert audit row, nothing else');
ok(op('no-such-token', 'pollnow').error === 'SESSION_EXPIRED' && op('', 'pollnow').error === 'SESSION_EXPIRED', 'an unknown or empty session is SESSION_EXPIRED before the door');
ok(op('admin-token-000000000000000000000000', 'nosuchop').error === 'unknown_events_op', 'an unknown op is named');

// ── 4. The queue ops as the admin ─────────────────────────────────────────
let list = op('admin-token-000000000000000000000000', 'proposed');
ok(list.success && list.proposals.length === 6 && list.counts.pending === 6 && list.polls.length === 3 && list.pollerInstalled === false, 'proposed: six pending rows, the latest Polls outcome per source, trigger not installed (' + JSON.stringify(list.counts) + ')');
ok(list.signals && list.signals.installed === false && list.signals.last === null, 'proposed: the E4 sweep state rides the same answer (not installed, never run)');
ok(list.proposals.every((p) => typeof p.before === 'object' && typeof p.after === 'object' && p.status === 'pending' && p.decidedAt === ''), 'proposed: Before / After parsed to objects');
const id1 = list.proposals.find((p) => p.change === 'moved-dates').id, id2 = list.proposals.find((p) => p.change === 'cancelled').id;
let d = op('admin-token-000000000000000000000000', 'decide', { id: id1, status: 'approved' });
ok(d.success && d.status === 'approved' && /^\d{4}-/.test(d.decidedAt), 'decide: approved with Decided At');
ok(op('admin-token-000000000000000000000000', 'decide', { id: id2, status: 'rejected' }).status === 'rejected', 'decide: rejected');
ok(op('admin-token-000000000000000000000000', 'decide', { id: id2, status: 'approved' }).status === 'approved', 'decide: a rejection can be reversed before it is applied');
ok(op('admin-token-000000000000000000000000', 'decide', { id: id2, status: 'rejected' }).status === 'rejected', 'decide: and back');
ok(op('admin-token-000000000000000000000000', 'decide', { id: 'pr-0000000000000', status: 'approved' }).error === 'not_found' && op('admin-token-000000000000000000000000', 'decide', { id: id1, status: 'maybe' }).error === 'bad_status' && op('admin-token-000000000000000000000000', 'decide', { id: 'st-x', status: 'approved' }).error === 'bad_id', 'decide: not_found / bad_status / bad_id');
list = op('admin-token-000000000000000000000000', 'proposed');
ok(list.counts.approved === 1 && list.counts.rejected === 1 && list.counts.pending === 4 && list.proposals.length === 5, 'proposed: the rejected row leaves the working set, the approved one stays');
ok(op('admin-token-000000000000000000000000', 'applied', { ids: id1, version: '7.15' }).error === 'bad_version' && op('admin-token-000000000000000000000000', 'applied', { ids: '', version: 'v07.15r' }).error === 'no_ids', 'applied: bad_version / no_ids');
const ap = op('admin-token-000000000000000000000000', 'applied', { ids: id1 + ',' + id2, version: 'v07.15r' });
ok(ap.success && ap.applied.length === 1 && ap.applied[0] === id1 && ap.skipped.length === 1 && ap.skipped[0].reason === 'not_approved', 'applied: the approved id stamped, the rejected one skipped as not_approved');
const rowApplied = prop.rows.find((r) => r[0] === id1);
ok(rowApplied[8] === 'applied' && rowApplied[10] === 'v07.15r' && rowApplied[9] === d.decidedAt, 'applied: Status applied, Applied In the version, Decided At kept');
ok(op('admin-token-000000000000000000000000', 'decide', { id: id1, status: 'rejected' }).error === 'already_applied', 'decide: an applied row can no longer be decided');
ctx._evRegistryCache = null; ctx._evRosterCache = null;
run = op('admin-token-000000000000000000000000', 'pollnow');
ok(run.success && run.proposed === 0 && prop.rows.length === 7, 'pollnow as the admin: still zero new rows — decided and applied rows are never re-proposed');
ok(counters.audit.filter((a) => a.op === 'events_poll_run').pop().user === 'dev@example.com', 'pollnow: audited as the admin who pressed it');

// ── 5. installpoller is idempotent ────────────────────────────────────────
counters.triggers.push({ getHandlerFunction: () => 'evPollRun_', fn: 'evPollRun_' });   // a stale trigger on the old name
let inst = op('admin-token-000000000000000000000000', 'installpoller');
ok(inst.success && inst.installed && inst.removed === 1 && counters.triggers.length === 1 && counters.triggers[0].fn === 'evPollTick', 'installpoller: the stale trigger removed, one weekly trigger on evPollTick');
ok(counters.triggers[0].spec.join(',') === 'MONDAY,6,America/New_York', 'installpoller: Monday 06:00 America/New_York');
inst = op('admin-token-000000000000000000000000', 'installpoller');
ok(inst.removed === 1 && counters.triggers.length === 1, 'installpoller twice: still exactly one trigger');
ok(op('admin-token-000000000000000000000000', 'proposed').pollerInstalled === true, 'proposed: reports the trigger installed');

// ── 6. Nothing live, nothing about people ─────────────────────────────────
ok(counters.urls.every((u) => routes[u]), 'every fetch went to a stubbed URL — zero live calls (' + counters.fetch + ' fetches)');
ok(JSON.stringify(counters.audit).indexOf('@example.com') < 0 || counters.audit.every((a) => !JSON.stringify(a.details).includes('@')), 'no audit details carry an address');

console.log('check-events-poller: ' + checks + ' checks, ' + failures + ' failure(s)');
if (failures) process.exit(1);
console.log('ALL CHECKS PASSED — the six diff kinds each write one Proposed row with the right Before · After; a second run writes zero; '
  + 'the blocked, manual, html and robots-disallowed rows are never fetched; the 403 writes one Polls row and one audit row and no proposal; '
  + 'a past-dated new-event and new-edition are skipped and counted; pollnow / decide / applied / installpoller / proposed are refused to a non-admin with zero reads; installpoller is idempotent. Zero live calls.');

// Developed by: LightAISolutions
