#!/usr/bin/env node
// E4 session 1 — the attendance signals, proved offline.
//
// NETWORK-EVENTS-DESIGN-PLAN.md §13.12 step 4: the REAL sweep, parser, matcher
// and manual-signal functions are lifted out of Events.gs (the
// check-events-score.js idiom) and run in one isolated VM context with
// stubbed UrlFetchApp / SpreadsheetApp / PropertiesService / ScriptApp; the
// Network far side is NOT a hand-written stub — Network.gs's real
// nwPeerSignalsWrite_ / nwPeerSignalsRead_ / nwPeerAccounts_ run in a second
// context (the check-peer-bridge.js idiom) and the Events context's fetch of
// the peer URL is routed into it, so the upsert, the rejections and the
// LinkedIn rule are the ones the live app enforces. Fixtures: a Map Your Show
// gallery (the JSON its proxy answers AND the HTML page's cards), an a2z
// exhibitor page, a speaker page with JSON-LD performers and one without
// (HTML cards), a speaker page served by a third-party widget (an iframe —
// yields nothing, says so), one RSS feed with a matching and a non-matching
// item, and two Network accounts. It asserts:
//   · the matcher: Events' evNormaliseCompany_ is byte-identical to Network's
//     nwNormaliseCompany_; the two keys per account (normalised name, slug as
//     words); exact whole-key matches only — a longer name never matches
//   · the three parsers on their fixtures; the three kinds land with their
//     confidences (exhibitor 0.9 · speaker 0.9 with the person's name and
//     title · press-release 0.8), the evidence URL and firstSeen
//   · the newswire rule: <account> AND (booth | exhibit | "will present")
//     AND the event named — the non-matching item writes nothing
//   · the upsert through Network's real write leg: `written` on the first
//     sweep, `updated` on the re-run, no duplicate row; Network's read leg
//     carries the person back and the score's why names them
//   · a LinkedIn URL is never fetched (no fixture serves one; the fetch stub
//     throws on any linkedin host) and is rejected by Network on every kind
//     but linkedin-manual, which the manual op accepts; an attendee-list URL
//     is never fetched (an unknown exhibitor host is skipped and named)
//   · a page that fails writes ONE audit row and no signal; not_configured
//     degrades with nothing written
//   · signalsnow / installsignals / signal are refused to a non-admin session
//     with zero fetches; installsignals is idempotent (one Tuesday trigger)
//   · no audit row names an account, a person, a URL or a token
// E4 SESSION 2 (§13.13 step 4) extends the same run — never a fork — with a
// company newsroom / "meet us at" page naming a target show by its edition
// name and another by its series with the year nearby (kind newsroom 0.7,
// the page as evidence, the person the page names), a target whose page 404s
// (one audit row, retried next run), a customer and a partner whose pages
// are never read (target only), the monthly skip (read today → skipped on
// the re-run; aged past 28 days → read again) parked by account id only; an
// agenda page read with the roster parser (kind agenda 0.9 with the person)
// and an agenda URL equal to the roster URL read once; the Federal Register
// FERC feed — the URL byte for byte the Scraper roster's fedreg-ferc row —
// with a filer that is a watched account (a docket segment from
// profiler-segments.json by name), a filer with no docket segment, and a
// non-filer notice: kind docket 0.7, the item link, NO event slug — accepted
// by Network's real write leg for docket only (bad_slug on any other kind)
// and ignored by the score; and the recording of a talk as a manual row of
// kind agenda with the note prefixed "Recording:".
// Zero live calls — UrlFetchApp is the stub, and it counts.
//
// Usage:  node scripts/check-events-signals.js
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

// ── An in-memory Sheet with the surface both sides touch ──────────────────
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
const digest = (s) => Array.from(crypto.createHash('sha256').update(String(s)).digest()).map((b) => (b > 127 ? b - 256 : b));

// ── Fixtures ──────────────────────────────────────────────────────────────
const SITE = 'https://lightaisolutions.github.io/Sales/';
const TODAY = '2026-09-22';
const TOKEN = 'k7Qp2mX9vL4sD8wR1nB6yH3tZ0cF5jG8';   // 32 chars, test-only
const OWNER = 'dev@example.com';
const MYS_PAGE = 'https://re26.mapyourshow.com/8_0/explore/exhibitor-gallery.cfm?featured=false';
const MYS_PROXY = 'https://re26.mapyourshow.com/8_0/ajax/remote-proxy.cfm?action=search&searchtype=exhibitorgallery&searchsize=5000&start=0';
const A2Z_ALPHA = 'https://s99.a2zinc.net/clients/alpha/alpha2026/Public/Exhibitors.aspx';
const A2Z_OMEGA = 'https://s99.a2zinc.net/clients/omega/omega2026/Public/Exhibitors.aspx';
const ATTENDEE_LIST = 'https://www.gamma.example/attendee-list';          // an unknown host — never fetched
const SPK_REPLUS = 'https://www.re-plus.example/schedule/speakers/';       // a widget page — nothing to read
const SPK_ALPHA = 'https://alpha.example/speakers';                        // JSON-LD performers
const SPK_BETA = 'https://beta.example/speakers';                          // HTML cards
const AGENDA_GAMMA = 'https://www.gamma.example/agenda';                    // session 2: an HTML agenda page (speaker cards months ahead)
const NEWS_FLUENCE = 'https://www.fluence.example/newsroom/events';         // session 2: a target's "meet us at" page
const NEWS_TESLA = 'https://www.tesla.example/events';                      // session 2: a target's page that answers 404
const NEWS_SUNGROW = 'https://www.sungrow.example/events';                  // session 2: a customer's page — never read (target only)
const scraperSrc = P('googleAppsScripts/Scraper/Scraper.gs');
const FERC_URL = /key: 'fedreg-ferc'[\s\S]*?rss: '([^']+)'/.exec(scraperSrc)[1];   // the Scraper roster's row, reused — never a new outlet
const ev = (slug, name, series, start, end, extra) => Object.assign({ slug, name, series, organiser: 'Org', kind: 'conference', start, end, tz: 'America/Chicago',
  city: 'Austin', region: 'TX', country: 'US', website: 'https://a.example/' + slug, audience: ['capital'], relevance: 3, status: 'confirmed', mentions: [],
  sources: [{ sourceKey: 'src-a', kind: 'manual', url: 'https://a.example/' + slug, lastConfirmed: '2026-09-01' }] }, extra || {});
const REGISTRY = { schemaVersion: 1, built: '2026-09-22T00:00:00Z', events: [
  ev('re-plus-2026', 'RE+ 2026', 'RE+', '2026-11-16', '2026-11-19', { audience: ['cells-and-chemistry'], relevance: 1, exhibitorListUrl: MYS_PAGE, speakersUrl: SPK_REPLUS }),   // starred, ranks last
  ev('alpha-2026', 'Alpha Show 2026', 'Alpha Show', '2026-11-16', '2026-11-18', { audience: ['neoclouds'], relevance: 4, exhibitorListUrl: A2Z_ALPHA, speakersUrl: SPK_ALPHA, agendaUrl: SPK_ALPHA }),   // starred; agenda = roster → read once
  ev('omega-2026', 'Omega Expo 2026', 'Omega Expo', '2026-10-05', '2026-10-06', { audience: ['utilities'], relevance: 2, exhibitorListUrl: A2Z_OMEGA }),                          // starred; its page answers 503
  ev('beta-2027', 'Beta Summit 2027', 'Beta Summit', '2027-03-01', '2027-03-03', { audience: ['neoclouds'], relevance: 3, speakersUrl: SPK_BETA }),
  ev('gamma-2026', 'Gamma Forum 2026', 'Gamma Forum', '2026-12-01', '2026-12-02', { audience: ['utilities', 'capital'], relevance: 5, exhibitorListUrl: ATTENDEE_LIST, agendaUrl: AGENDA_GAMMA }),   // ranks first; unknown host; an agenda
  ev('delta-2026', 'Delta (past)', 'Delta', '2026-02-09', '2026-02-12', { status: 'past', exhibitorListUrl: MYS_PAGE })                                                          // never a target
].concat(Array.from({ length: 12 }, (_, i) => ev('filler-' + String(i + 1).padStart(2, '0'), 'Filler ' + (i + 1), 'Filler ' + (i + 1), '2027-0' + (1 + (i % 6)) + '-10', '2027-0' + (1 + (i % 6)) + '-11'))) };
const SEGMENTS = { schemaVersion: 1, seats: {
  'storage-seller': { label: 'The storage seller', segments: ['storage-developers-and-ipps', 'utilities', 'capital', 'assurance', 'insurance-and-risk-transfer'] },
  'aidc-power-seller': { label: 'The AI-data-centre power seller', segments: ['aidc-developers-and-landlords', 'hyperscalers-and-ai-labs', 'epc-and-construction', 'neoclouds', 'utilities'] }
}, segments: [   // session 2: the docket segments are found by NAME (utilities, IPPs, developers), never by a hard-coded id
  { id: 'utilities', name: 'Utilities' }, { id: 'storage-developers-and-ipps', name: 'Storage developers and IPPs' }, { id: 'aidc-developers-and-landlords', name: 'AIDC developers and landlords' },
  { id: 'capital', name: 'Capital' }, { id: 'neoclouds', name: 'Neoclouds' }, { id: 'cells-and-chemistry', name: 'Cells and chemistry' } ] };
const COMPANIES = { schemaVersion: 1, companies: [] };
// Network's Accounts — written into its real tab shape below. Only target ·
// customer · partner rows are watched; the supplier is never matched.
const ACCOUNTS = [   // session 2: a Newsroom URL on the two targets and the customer, docket segments on Fluence (IPP) and Acme (utility) — Tesla has none
  { id: 'a-0000000000001', name: 'Fluence Energy', slug: 'fluence-energy', relationship: 'target', stage: 'shortlist', newsroomUrl: NEWS_FLUENCE, segments: ['storage-developers-and-ipps', 'capital'] },
  { id: 'a-0000000000002', name: 'Sungrow', slug: 'sungrow', relationship: 'customer', stage: 'none', newsroomUrl: NEWS_SUNGROW, segments: ['cells-and-chemistry'] },
  { id: 'a-0000000000003', name: 'Bolt Supply', slug: '', relationship: 'supplier', stage: 'none', newsroomUrl: 'https://www.bolt.example/events', segments: ['utilities'] },
  { id: 'a-0000000000004', name: 'Acme Storage', slug: '', relationship: 'partner', stage: 'none', newsroomUrl: '', segments: ['utilities'] },
  { id: 'a-0000000000005', name: 'Tesla', slug: 'tesla', relationship: 'target', stage: 'prospecting', newsroomUrl: NEWS_TESLA, segments: [] }
];
// The MYS proxy's JSON (the live shape, read 2026-09-22): Tesla matches once,
// the longer "TESLA POWER…" never; Fluence Energy LLC normalises to the key;
// Sungrow's full name does not; Bolt is a supplier.
const MYS_JSON = JSON.stringify({ ERRORMESSAGE: '', ERRORS: [], SUCCESS: true, DATA: { results: { exhibitor: { found: 6, start: 0, hit: [
  { fields: { exhname_t: 'Tesla', exhid_l: '1' } }, { fields: { exhname_t: 'TESLA POWER EQUIPMENTS & PROJECTS LIMITED', exhid_l: '2' } },
  { fields: { exhname_t: 'Fluence Energy LLC', exhid_l: '3' } }, { fields: { exhname_t: 'Sungrow Power Supply Co., Ltd.', exhid_l: '4' } },
  { fields: { exhname_t: 'Bolt Supply Inc.', exhid_l: '5' } }, { fields: { exhname_t: 'Fluence Energy LLC', exhid_l: '3' } }   // a duplicate hit counts once
] } } } });
// The gallery page's own cards — what the parser reads from an HTML fixture
const MYS_HTML = '<!doctype html><html><body><div class="cards"><div class="js-Card card br3 dib float pa3"><h3 class="card-Title break-word f2 mb1 mt0"><a class="bb-0" href="/8_0/exhibitor/exhibitor-details.cfm?exhid=3">Fluence Energy LLC</a></h3></div>'
  + '<div class="js-Card card"><a class="card-Title break-word f2 mb1 mt0" href="/8_0/exhibitor/exhibitor-details.cfm?exhid=1">Tesla</a></div></div></body></html>';
const A2Z_HTML = '<html><body><table class="exhibitor-list"><tr><td class="companyName"><a class="exhibitorName" href="eBooth.aspx?IndexInList=1&amp;BoothID=9">Acme Storage, Inc.</a></td><td>1234</td></tr>'
  + '<tr><td class="companyName"><a class="exhibitorName" href="eBooth.aspx?IndexInList=2&amp;BoothID=10">Fluence Energy</a></td><td>2345</td></tr>'
  + '<tr><td class="companyName"><a class="exhibitorName" href="eBooth.aspx?IndexInList=3&amp;BoothID=11">Nobody Corp</a></td><td>3456</td></tr></table></body></html>';
const SPK_LD_HTML = '<html><head><script type="application/ld+json">' + JSON.stringify({ '@context': 'https://schema.org', '@type': 'Event', name: 'Alpha Show 2026', startDate: '2026-11-16', performer: [
  { '@type': 'Person', name: 'Jane Doe', jobTitle: 'VP Storage', worksFor: { '@type': 'Organization', name: 'Fluence Energy, Inc.' } },
  { '@type': 'Person', name: 'Bob Ray', jobTitle: 'CTO', affiliation: 'Nobody Corp' } ] }) + '</script></head><body></body></html>';
const SPK_HTML = '<html><body><div class="speaker-card"><h3 class="speaker-name">Ann Lee</h3><p class="speaker-title">Director of Grid</p><p class="speaker-company">Acme Storage Inc.</p></div>'
  + '<li class="speaker"><h4>Tom Fox</h4><span>Head of Sales at Sungrow Power Supply Co., Ltd.</span></li></body></html>';
const SPK_WIDGET = '<html><body><iframe id="sc-widget" src="https://connect.example/widget/event/re-26/people/abc?paginationMode=infinite"></iframe></body></html>';
const rssItem = (title, link, desc) => '<item><title>' + title + '</title><link>' + link + '</link><description><![CDATA[' + desc + ']]></description><pubDate>Tue, 22 Sep 2026 12:00:00 +0000</pubDate></item>';
const RSS_PRN = '<?xml version="1.0"?><rss version="2.0"><channel><title>All News Releases</title>'
  + rssItem('Fluence Energy to Exhibit at RE+ 2026', 'https://www.prnewswire.example/news/1', '<p>ARLINGTON, Va. -- Fluence Energy, Inc. will exhibit at RE+ 2026 in Las Vegas &mdash; visit booth 1234.</p>')   // account + cue + event → press-release
  + rssItem('Acme Storage reports quarterly results', 'https://www.prnewswire.example/news/2', 'Acme Storage, Inc. today reported results for the quarter.')          // no cue → nothing
  + rssItem('Sungrow will present at Alpha Show 2026', 'https://www.prnewswire.example/news/3', 'Sungrow will present its latest inverter at Alpha Show 2026.')     // whole-word account key in a longer sentence → press-release
  + rssItem('Bolt Supply exhibits at RE+ 2026', 'https://www.prnewswire.example/news/4', 'Bolt Supply Inc. exhibits at RE+ 2026 booth 99.')                        // a supplier — never watched
  + rssItem('Fluence Energy booth staffing update', 'https://www.prnewswire.example/news/5', 'Fluence Energy staffs its booth with new hires.')                     // account + cue, no event named → nothing
  + '</channel></rss>';
const RSS_EMPTY = '<?xml version="1.0"?><rss version="2.0"><channel><title>Business Wire</title></channel></rss>';
// Session 2 — the agenda page (HTML cards; sessions and times are E5's, only the people are read)
const AGENDA_HTML = '<html><body><h1>Agenda</h1><section class="session"><h2>09:00 Grid-scale storage</h2><div class="speaker"><h4>Rita Ng</h4><span>Grid Lead at Tesla, Inc.</span></div>'
  + '<div class="speaker"><h4>Ivo Kern</h4><span>Analyst, Nobody Corp</span></div></section></body></html>';
// Session 2 — a target's "events / meet us at" page: RE+ 2026 by its edition name; Alpha Show by its series with the year nearby;
// Beta Summit named with no year anywhere near (no hit); one person named on the page (a speaker card at this account)
const NEWS_HTML = '<html><head><title>Events | Fluence</title><script>var x = "Beta Summit 2027";</script><style>.a{}</style></head><body><h1>Meet us at</h1>'
  + '<ul><li><b>RE+ 2026</b> &mdash; Las Vegas, booth 1234. Come and see the new enclosure.</li>'
  + '<li><b>Alpha Show</b> &mdash; Austin, 16&ndash;18 November 2026. Our team will be on the floor.</li>'
  + '<li>Also: watch for us at Beta Summit, details to follow.</li></ul>'
  + '<div class="speaker"><h4>Maria Volt</h4><span>Chief Commercial Officer at Fluence Energy</span></div></body></html>';
// Session 2 — the Federal Register FERC feed (the live shape, read 2026-09-22: the title names the filer; descriptions are empty)
const RSS_FERC = '<?xml version="1.0"?><rss version="2.0"><channel><title>Federal Energy Regulatory Commission</title>'
  + rssItem('Fluence Energy, LLC; Notice of Filing', 'https://www.federalregister.example/documents/2026/09/21/2026-19281/fluence-energy-llc-notice-of-filing', '')                  // a watched IPP → docket
  + rssItem('Combined Notice of Filings #1', 'https://www.federalregister.example/documents/2026/09/21/2026-19246/combined-notice-of-filings-1', '')                              // names no account
  + rssItem('Acme Storage Inc.; Notice of Application Accepted for Filing', 'https://www.federalregister.example/documents/2026/09/21/2026-19245/acme-storage-inc', '')       // a watched utility → docket
  + rssItem('Tesla, Inc.; Notice of Petition for Declaratory Order', 'https://www.federalregister.example/documents/2026/09/21/2026-19240/tesla-inc-notice', '')             // a target with no docket segment → nothing
  + rssItem('Nobody Utility LLC; Notice of Reasonable Period of Time', 'https://www.federalregister.example/documents/2026/09/21/2026-19239/nobody-utility', '')            // not an account
  + '</channel></rss>';

// ── The Network context — its REAL peer far side (check-peer-bridge.js idiom) ─
const nwSrc = P('googleAppsScripts/Network/Network.gs');
const nwProps = { NETWORK_PEER_TOKEN: TOKEN };
const nwSs = fakeSpreadsheet();
const nwCounters = { openById: 0, fetch: 0, audit: [] };
const NW = {
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (Object.prototype.hasOwnProperty.call(nwProps, k) ? nwProps[k] : null), setProperty: (k, v) => { nwProps[k] = String(v); } }) },
  SpreadsheetApp: { openById: () => { nwCounters.openById++; return nwSs; } },
  UrlFetchApp: { fetch: () => { nwCounters.fetch++; throw new Error('Network far side must never fetch'); } },
  Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (a, s) => digest(s),
    formatDate: (d, tz) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(d) },
  Session: { getScriptTimeZone: () => 'America/New_York' }, CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) }, Logger: { log() {} },
  auditLog: (evName, user, op, details) => { nwCounters.audit.push({ ev: evName, user, op, details }); }, bumpDataRev() {},
  console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN, isFinite, encodeURIComponent, Intl
};
vm.createContext(NW);
vm.runInContext([
  'NW_RELATIONSHIPS', 'NW_STAGES', 'NW_SIGNAL_KINDS', 'NW_ID_RE', 'NW_ID_PREFIXES', 'NW_TABS', 'NW_LEGAL_SUFFIX_RE',
  'NW_PEER_TOKEN_PROP', 'NW_EVENTS_TOKEN_PROP', 'EVENTS_PEER_EXEC', 'NW_PEER_RELATIONSHIPS', 'NW_PEER_SLUG_RE'
].map((n) => constant(nwSrc, n)).join('\n') + '\nvar SPREADSHEET_ID = "stub";\n' + [
  'ensureNetworkTabs_', 'nwListRows_', 'nwSheetRead_', 'nwRowObj_', 'nwFindRow_', 'nwOwned_', 'nwWriteRow_', 'nwArr_', 'nwStr_', 'nwNow_', 'nwNewId_', 'nwRandomBase36_',
  'nwNormaliseCompany_', 'nwPeerAuthorised_', 'nwHandlePeer_', 'nwPeerOwner_', 'nwPeerAccounts_', 'nwPeerSignals_', 'nwPeerJsonBody_',
  'nwPeerSignalsRead_', 'nwPeerLinkedIn_', 'nwPeerSignalsWrite_'
].map((n) => extract(nwSrc, n)).join('\n'), NW, { filename: 'Network.peer.js' });
const nwTabs = vm.runInContext('ensureNetworkTabs_', NW)();
const nwHeaders = nwSs.sheets['Accounts'].rows[0];
ACCOUNTS.forEach((a) => {
  const row = {}; nwHeaders.forEach((h) => { row[h] = ''; });
  Object.assign(row, { 'Account ID': a.id, 'Owner': OWNER, 'Name': a.name, 'Normalised Name': vm.runInContext('nwNormaliseCompany_', NW)(a.name), 'Profiler Slug': a.slug,
    'Relationship': a.relationship, 'Stage': a.stage, 'Segment IDs': JSON.stringify(a.segments || []), 'Tags': '[]', 'Newsroom URL': a.newsroomUrl || '', 'Created At': TODAY, 'Updated At': TODAY });
  vm.runInContext('nwWriteRow_', NW)(nwTabs.accounts, nwHeaders, row, 0);
});
const nwPeer = (e) => vm.runInContext('nwHandlePeer_', NW)(e);

// ── The Events context — the real sweep, routed into Network ─────────────
const src = P('googleAppsScripts/Events/Events.gs');
const NW_EXEC = /var NETWORK_PEER_EXEC =\s*\n?\s*'([^']+)'/.exec(src)[1];
const ss = fakeSpreadsheet();
const counters = { openById: 0, fetch: 0, urls: [], headers: [], audit: [], triggers: [], linkedin: 0, attendee: 0 };
const props = { NETWORK_PEER_TOKEN: TOKEN };
const sessions = {
  'admin-token-000000000000000000000000': { email: OWNER, role: 'admin', permissions: ['read', 'write', 'admin'] },
  'analyst-token-0000000000000000000000': { email: 'ana@example.com', role: 'analyst', permissions: ['read'] }
};
let omegaStatus = 503, gnwDown = true;
function parseQuery(url) { const q = {}; (url.split('?')[1] || '').split('&').forEach((kv) => { const i = kv.indexOf('='); if (i > 0) q[decodeURIComponent(kv.slice(0, i))] = decodeURIComponent(kv.slice(i + 1)); }); return q; }
function route(url, opts) {
  const h = (opts && opts.headers) || {};
  if (/linkedin\.com|lnkd\.in/i.test(url)) { counters.linkedin++; throw new Error('LINKEDIN FETCHED: ' + url); }
  if (url === ATTENDEE_LIST) { counters.attendee++; throw new Error('ATTENDEE LIST FETCHED'); }
  if (url === SITE + 'events-data/events.json') return resp(200, JSON.stringify(REGISTRY));
  if (url === SITE + 'profiler-data/profiler-segments.json') return resp(200, JSON.stringify(SEGMENTS));
  if (url === SITE + 'profiler-data/profiler-companies.json') return resp(200, JSON.stringify(COMPANIES));
  if (url.indexOf(NW_EXEC + '?action=peer&') === 0) {
    const e = { parameter: parseQuery(url) };
    if (opts && opts.method === 'post') e.postData = { contents: String(opts.payload || ''), type: 'application/json' };
    return resp(200, JSON.stringify(nwPeer(e)));
  }
  if (url === MYS_PROXY) return h['X-Requested-With'] === 'XMLHttpRequest' ? resp(200, MYS_JSON) : resp(403, '<html>403 - Forbidden</html>');
  if (url === MYS_PAGE) return resp(200, MYS_HTML);
  if (url === A2Z_ALPHA) return resp(200, A2Z_HTML);
  if (url === A2Z_OMEGA) return resp(omegaStatus, omegaStatus === 200 ? A2Z_HTML : '<html>Service Unavailable</html>');
  if (url === SPK_REPLUS) return resp(200, SPK_WIDGET);
  if (url === SPK_ALPHA) return resp(200, SPK_LD_HTML);
  if (url === SPK_BETA) return resp(200, SPK_HTML);
  if (url === AGENDA_GAMMA) return resp(200, AGENDA_HTML);
  if (url === NEWS_FLUENCE) return resp(200, NEWS_HTML);
  if (url === NEWS_TESLA) return resp(404, '<html>Not Found</html>');
  if (url === NEWS_SUNGROW || /bolt\.example/.test(url)) { counters.nonTarget = (counters.nonTarget || 0) + 1; throw new Error('NON-TARGET NEWSROOM FETCHED: ' + url); }
  if (url === FERC_URL) return resp(200, RSS_FERC);
  if (/prnewswire\.com\/rss/.test(url)) return resp(200, RSS_PRN);
  if (/feed\.businesswire\.com/.test(url)) return resp(200, RSS_EMPTY);
  if (/globenewswire\.com/.test(url)) { if (gnwDown) throw new Error('DNS'); return resp(200, RSS_EMPTY); }
  throw new Error('offline: ' + url);
}
const ctx = {
  UrlFetchApp: { fetch: (url, opts) => { counters.fetch++; counters.urls.push(url); counters.headers.push((opts && opts.headers) || {}); return route(url, opts); } },
  SpreadsheetApp: { openById: () => { counters.openById++; return ss; } },
  PropertiesService: { getScriptProperties: () => ({ getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null), setProperty: (k, v) => { props[k] = String(v); } }) },
  ScriptApp: {
    WeekDay: { MONDAY: 'MONDAY', TUESDAY: 'TUESDAY' },
    getProjectTriggers: () => counters.triggers.slice(),
    deleteTrigger: (t) => { counters.triggers = counters.triggers.filter((x) => x !== t); },
    newTrigger: (fn) => { const t = { getHandlerFunction: () => fn, fn, spec: [] }; const b = { timeBased: () => b, onWeekDay: (d) => { t.spec.push(d); return b; }, atHour: (h) => { t.spec.push(h); return b; }, inTimezone: (z) => { t.spec.push(z); return b; }, create: () => { counters.triggers.push(t); return t; } }; return b; }
  },
  Utilities: { getUuid: () => crypto.randomUUID(), DigestAlgorithm: { SHA_256: 'sha256' }, computeDigest: (a, s) => digest(s),
    formatDate: (d, tz) => { new Intl.DateTimeFormat('en-CA', { timeZone: tz }); return TODAY; } },
  Session: { getScriptTimeZone: () => 'America/New_York' }, CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) }, Logger: { log() {} },
  auditLog: (evName, user, op, details) => { counters.audit.push({ ev: evName, user, op, details }); },
  validateSessionForData: (token) => { if (!sessions[token]) throw new Error('SESSION_EXPIRED'); return sessions[token]; },
  resolveOwnerSet_: () => ({ set: {} }), resolveOwnerScope_: () => ({ owner: OWNER }),
  console, JSON, Object, Date, String, Number, Array, RegExp, Error, Math, parseInt, isNaN, isFinite, encodeURIComponent, Intl
};
vm.createContext(ctx);
vm.runInContext(
  'var EMBED_PAGE_URL = "' + SITE + 'Events.html";\nvar SPREADSHEET_ID = "stub";\n' + [
    'EV_ROLE_CAPS', 'EV_ATTENDING', 'EV_SLUG_RE', 'EV_ID_RE', 'EV_ID_PREFIXES', 'EV_TABS', 'EV_REGISTRY_URL', '_evRegistryCache', 'EV_ACCOUNT_ID_RE',
    'EV_PEER_TOKEN_PROP', 'EV_NETWORK_TOKEN_PROP', 'NETWORK_PEER_EXEC', 'EV_POLL_SOURCE_BUDGET_MS', 'EV_POLL_TOTAL_BUDGET_MS', 'EV_POLL_MAX_BODY', 'EV_POLL_TRIGGER_FN', 'EV_POLL_TZ',
    'EV_SEGMENTS_URL', 'EV_COMPANIES_URL', 'EV_SCORE_TERMS', 'EV_TUNING_DEFAULTS', 'EV_STAGE_WEIGHT', 'EV_STAGE_DEFAULT_WEIGHT', 'EV_RELATIONSHIP_WEIGHT', 'EV_SCORE_SIGNAL_CAP', 'EV_SCORE_CONFLICT_ATTENDING',
    'EV_SIGNALS_TRIGGER_FN', 'EV_SIGNALS_TOP_N', 'EV_SIGNALS_LAST_PROP', 'EV_SIGNALS_BATCH', 'EV_SIGNAL_CONFIDENCE', 'EV_SIGNAL_MANUAL_KINDS', 'EV_SIGNAL_RELATIONSHIPS', 'EV_SIGNALS_MAX_NAMES',
    'EV_NEWSWIRE_FEEDS', 'EV_NEWSWIRE_CUE_RE', 'EV_MYS_URL_RE', 'EV_A2Z_HOST_RE', 'EV_SIGNAL_PERSON_MAX', 'EV_LEGAL_SUFFIX_RE',
    'EV_DOCKET_FEEDS', 'EV_DOCKET_SEGMENT_RE', 'EV_NEWSROOM_READ_PROP', 'EV_NEWSROOM_DAYS', 'EV_NEWSROOM_NEAR'
  ].map((n) => constant(src, n)).join('\n') + '\n' + [
    'evRoleOf_', 'evAdmitted_', 'evCan_', 'evRequire_', 'evRandomBase36_', 'evNewId_', 'ensureEventsTabs_', 'evListRows_', 'evStr_', 'evCell_', 'handleEventsOp_',
    'evRegistry_', 'evTodayIn_', 'evPagesJson_', 'evNetworkProxy_', 'evHtmlDecode_', 'evJsonLdBlocks_',
    'evTuning_', 'evSeatSegments_', 'evMentionDates_', 'evStageWeight_', 'evDatesOverlap_', 'evMonthsSince_', 'evRound2_', 'evScoreEvent_', 'evRecommend_',
    'evPollerInstalled_', 'evProposedRowObj_', 'evProposedList_', 'evPollsLatest_',
    'evNormaliseCompany_', 'evAccountKeys_', 'evSignalsMatcher_', 'evTextHasKey_', 'evSignalsFetch_', 'evExhibitorSource_', 'evStripTags_',
    'evParseMysExhibitors_', 'evParseA2zExhibitors_', 'evPersonOrg_', 'evPersonFromLd_', 'evCollectPersons_', 'evParseSpeakers_', 'evParseRss_',
    'evSignalsTargets_', 'evSweepEvent_', 'evSweepFeeds_', 'evMatchPress_', 'evSignalsWrite_', 'evSignalsRun_', 'evSignalsOwners_', 'evSignalsTick',
    'evNewsroomState_', 'evNewsroomSave_', 'evNewsroomFresh_', 'evParseNewsroom_', 'evSweepNewsrooms_', 'evDocketSegments_', 'evSweepDockets_', 'evMatchDockets_',
    'evInstallSignals_', 'evSignalsInstalled_', 'evSignalsState_', 'evSignalManual_'
  ].map((n) => extract(src, n)).join('\n'), ctx, { filename: 'Events.signals.js' });

let failures = 0, checks = 0;
function ok(cond, msg) { checks++; if (!cond) { failures++; console.log('  FAIL  ' + msg); } }
const call = (name, ...args) => vm.runInContext(name, ctx)(...args);
const op = (token, eop, extra) => call('handleEventsOp_', { parameter: Object.assign({ eop, session: token }, extra || {}) });
const ADMIN = 'admin-token-000000000000000000000000', ANALYST = 'analyst-token-0000000000000000000000';
const sigRows = () => nwSs.sheets['Signals'].rows.slice(1);
const nwIdx = (() => { const h = nwSs.sheets['Signals'].rows[0], m = {}; h.forEach((x, i) => { m[x] = i; }); return m; })();
const col = (row, name) => row[nwIdx[name]];

// ── 0. The matcher — Network's key, mirrored byte for byte ────────────────
const body = (s, name) => extract(s, name).replace(new RegExp('^function ' + name), 'function X');
ok(body(src, 'evNormaliseCompany_') === body(nwSrc, 'nwNormaliseCompany_').replace('NW_LEGAL_SUFFIX_RE', 'EV_LEGAL_SUFFIX_RE'), 'matcher: evNormaliseCompany_ is byte-identical to Network\'s nwNormaliseCompany_ (the dedupe key), the constant renamed');
ok(constant(src, 'EV_LEGAL_SUFFIX_RE').replace('EV_', 'NW_') === constant(nwSrc, 'NW_LEGAL_SUFFIX_RE'), 'matcher: the legal-suffix pattern is the same on both sides');
ok(call('evNormaliseCompany_', 'Fluence Energy, Inc.') === 'fluence energy' && call('evNormaliseCompany_', 'Sungrow Power Supply Co., Ltd.') === 'sungrow power supply' && call('evNormaliseCompany_', 'TESLA POWER EQUIPMENTS & PROJECTS LIMITED') === 'tesla power equipments and projects',
   'matcher: suffixes stripped, & → and, case folded');
ok(JSON.stringify(call('evAccountKeys_', { name: 'Fluence Energy', slug: 'fluence-energy' })) === '["fluence energy"]' && JSON.stringify(call('evAccountKeys_', { name: 'Acme Storage, Inc.', slug: '' })) === '["acme storage"]'
   && JSON.stringify(call('evAccountKeys_', { name: 'ABB Inc.', slug: 'abb-ltd' })) === '["abb","abb ltd"]'.replace('"abb ltd"', '"abb"').replace('["abb","abb"]', '["abb"]'),
   'matcher: two exact keys per account — the normalised name and the slug as words, deduplicated');
const matcher = call('evSignalsMatcher_', ACCOUNTS);
ok(matcher.list.length === 4 && !matcher.list.some((a) => a.relationship === 'supplier') && Object.keys(matcher.byKey).sort().join(',') === 'acme storage,fluence energy,sungrow,tesla',
   'matcher: target · customer · partner only, four keys (' + Object.keys(matcher.byKey).sort().join(',') + ')');
ok(!matcher.byKey['sungrow power supply'] && !matcher.byKey['tesla power equipments and projects'], 'matcher: a longer exhibitor name is never a key — exact match only');
ok(call('evTextHasKey_', 'sungrow will present at alpha show 2026', 'sungrow') && !call('evTextHasKey_', 'sungrower will present', 'sungrow') && !call('evTextHasKey_', '', 'x'), 'matcher: whole-word containment for the newswire text');

// ── 1. The parsers, on their fixtures ─────────────────────────────────────
let src1 = call('evExhibitorSource_', MYS_PAGE);
ok(src1.kind === 'mys' && src1.fetchUrl === MYS_PROXY && src1.headers['X-Requested-With'] === 'XMLHttpRequest', 'exhibitors: a Map Your Show gallery URL is rewritten to its JSON proxy with the XHR header (' + src1.fetchUrl + ')');
ok(call('evExhibitorSource_', A2Z_ALPHA).kind === 'a2z' && call('evExhibitorSource_', A2Z_ALPHA).fetchUrl === A2Z_ALPHA, 'exhibitors: an a2z URL is fetched as the page');
ok(call('evExhibitorSource_', ATTENDEE_LIST).kind === '' && call('evExhibitorSource_', 'https://www.linkedin.com/company/x').kind === '', 'exhibitors: an unknown host (an attendee list, a LinkedIn page) gets no parser');
ok(JSON.stringify(call('evParseMysExhibitors_', MYS_JSON)) === JSON.stringify(['Tesla', 'TESLA POWER EQUIPMENTS & PROJECTS LIMITED', 'Fluence Energy LLC', 'Sungrow Power Supply Co., Ltd.', 'Bolt Supply Inc.']),
   'Map Your Show JSON: five distinct names from hit[].fields.exhname_t (the duplicate hit once)');
ok(JSON.stringify(call('evParseMysExhibitors_', MYS_HTML)) === JSON.stringify(['Fluence Energy LLC', 'Tesla']), 'Map Your Show HTML: the gallery cards\' titles');
ok(JSON.stringify(call('evParseA2zExhibitors_', A2Z_HTML)) === JSON.stringify(['Acme Storage, Inc.', 'Fluence Energy', 'Nobody Corp']), 'a2z: the exhibitorName cells');
let thrown = false; try { call('evParseMysExhibitors_', '{not json'); } catch (e) { thrown = /mys_not_json/.test(String(e.message)); }
ok(thrown, 'Map Your Show: a broken JSON body is a named parse failure, not a silent empty list');
const ldPeople = call('evParseSpeakers_', SPK_LD_HTML);
ok(ldPeople.length === 2 && ldPeople[0].name === 'Jane Doe' && ldPeople[0].title === 'VP Storage' && ldPeople[0].company === 'Fluence Energy, Inc.' && ldPeople[1].company === 'Nobody Corp',
   'speakers (JSON-LD): performer[] with name, jobTitle and worksFor / affiliation (' + JSON.stringify(ldPeople) + ')');
const htmlPeople = call('evParseSpeakers_', SPK_HTML);
ok(htmlPeople.length === 2 && htmlPeople[0].name === 'Ann Lee' && htmlPeople[0].title === 'Director of Grid' && htmlPeople[0].company === 'Acme Storage Inc.'
   && htmlPeople[1].name === 'Tom Fox' && htmlPeople[1].title === 'Head of Sales' && htmlPeople[1].company === 'Sungrow Power Supply Co., Ltd.',
   'speakers (HTML): the classed card and the "Title at Company" line (' + JSON.stringify(htmlPeople) + ')');
ok(call('evParseSpeakers_', SPK_WIDGET).length === 0, 'speakers (widget): an iframe-served roster yields nothing');
const items = call('evParseRss_', RSS_PRN);
ok(items.length === 5 && items[0].link === 'https://www.prnewswire.example/news/1' && items[0].text.indexOf('fluence energy') >= 0 && items[0].text.indexOf('booth 1234') >= 0 && items[0].text.indexOf('<') < 0 && items[0].text.indexOf('mdash') < 0,
   'RSS: five items, CDATA and tags stripped, text normalised (' + items[0].text.slice(0, 80) + '…)');
ok(call('evParseRss_', RSS_EMPTY).length === 0 && call('evParseRss_', '<rss><channel><item><title>no link</title></item></channel></rss>').length === 0, 'RSS: an empty channel and an item without a link read as nothing');

// ── 2. The refusals: zero fetches, zero tab opens ─────────────────────────
for (const eop of ['signalsnow', 'installsignals', 'signal']) {
  const r = op(ANALYST, eop, { accountId: 'a-0000000000001', slug: 're-plus-2026', kind: 'linkedin-manual', evidenceUrl: 'https://www.linkedin.com/posts/x', confidence: 0.8 });
  ok(r.success === false && r.error === 'ROLE_DENIED' && r.role === 'analyst', eop + ': refused to an analyst session (' + JSON.stringify(r) + ')');
}
ok(counters.fetch === 0 && counters.openById === 0 && nwCounters.fetch === 0, 'refusals: zero UrlFetchApp, zero SpreadsheetApp.openById (saw ' + counters.fetch + ' / ' + counters.openById + ')');
ok(counters.audit.length === 3 && counters.audit.every((a) => a.ev === 'security_alert' && a.op === 'events_not_admitted'), 'refusals: one security_alert audit row each, nothing else');
ok(op('no-such-token-0000000000000000000000', 'signalsnow').error === 'SESSION_EXPIRED', 'signalsnow: an unknown session is SESSION_EXPIRED before the door');

// ── 3. not_configured degrades — nothing written, nothing swept ───────────
delete props.NETWORK_PEER_TOKEN;
let r = op(ADMIN, 'signalsnow');
ok(r.success === true && r.notConfigured === true && r.written === 0 && r.found === 0 && r.events === 0 && r.owners === 1, 'not_configured: success with notConfigured true, nothing swept or written (' + JSON.stringify({ nc: r.notConfigured, w: r.written, e: r.events }) + ')');
ok(counters.urls.every((u) => u.indexOf(SITE) === 0), 'not_configured: only the Pages registry was fetched — no organiser page, no feed, no peer call (' + counters.urls.length + ')');
r = op(ADMIN, 'signal', { accountId: 'a-0000000000001', slug: 're-plus-2026', kind: 'registrant-mail', evidenceUrl: 'https://mail.example/preview', confidence: 0.7 });
ok(r.success === false && r.error === 'not_configured', 'manual signal while not configured: not_configured passed through, never a throw');
props.NETWORK_PEER_TOKEN = TOKEN;

// ── 4. The first sweep as the admin ───────────────────────────────────────
const tabs = call('ensureEventsTabs_');
tabs.stars.appendRow(['st-0000000000001', OWNER, 're-plus-2026', '', 'registered', TODAY, TODAY]);
tabs.stars.appendRow(['st-0000000000002', OWNER, 'alpha-2026', '', 'planning', TODAY, TODAY]);
tabs.stars.appendRow(['st-0000000000003', OWNER, 'omega-2026', '', 'planning', TODAY, TODAY]);
tabs.stars.appendRow(['st-0000000000004', OWNER, 'delta-2026', '', 'attended', TODAY, TODAY]);       // past — never a target
tabs.stars.appendRow(['st-0000000000005', 'other@example.com', 'gamma-2026', '', 'planning', TODAY, TODAY]);
const before4 = { fetch: counters.fetch, audit: counters.audit.length };
r = op(ADMIN, 'signalsnow');
ok(r.success === true && r.notConfigured === false && r.owners === 1 && r.stopped === false, 'sweep: ran for the pressing admin only (' + JSON.stringify({ o: r.owners, nc: r.notConfigured, s: r.stopped, err: r.error }) + ')');
// Alpha is starred but ranks low (its dates conflict with the registered RE+ star), so the top ten are ten other events → 13 targets
ok(r.starred === 3 && r.ranked === 10 && r.events === 13, 'sweep: the three upcoming starred events (the past star dropped) plus the top ten ranked → 13 targets (' + JSON.stringify({ st: r.starred, rk: r.ranked, e: r.events }) + ')');
const bySlug = Object.fromEntries((r.results || []).map((x) => [x.slug, x]));
ok(r.results.length === 13 && r.results[0].slug === 're-plus-2026' && r.results[1].slug === 'alpha-2026' && r.results[3].slug === 'gamma-2026' && !bySlug['delta-2026'], 'sweep: starred first (in Stars order), the past edition never swept, the ranked ones after (gamma first)');
ok(bySlug['re-plus-2026'].exhibitors.kind === 'mys' && bySlug['re-plus-2026'].exhibitors.names === 5 && bySlug['re-plus-2026'].exhibitors.matched === 2,
   'RE+: the Map Your Show proxy read — five names, two matched (Tesla, Fluence Energy) (' + JSON.stringify(bySlug['re-plus-2026'].exhibitors) + ')');
ok(bySlug['re-plus-2026'].speakers.people === 0 && bySlug['re-plus-2026'].speakers.note === 'no_roster_found' && !bySlug['re-plus-2026'].speakers.error, 'RE+: the widget-served roster reads as no_roster_found, not a failure');
ok(bySlug['alpha-2026'].exhibitors.kind === 'a2z' && bySlug['alpha-2026'].exhibitors.matched === 2 && bySlug['alpha-2026'].speakers.people === 2 && bySlug['alpha-2026'].speakers.matched === 1,
   'Alpha: a2z two matched (Acme, Fluence), JSON-LD roster one matched (Jane Doe at Fluence) (' + JSON.stringify(bySlug['alpha-2026']) + ')');
ok(bySlug['beta-2027'].speakers.people === 2 && bySlug['beta-2027'].speakers.matched === 1 && !bySlug['beta-2027'].exhibitors, 'Beta: the HTML roster — Ann Lee at Acme matched, Tom Fox at Sungrow Power Supply not');
ok(bySlug['omega-2026'].exhibitors.error === 'http_503' && bySlug['omega-2026'].exhibitors.matched === 0, 'Omega: the 503 page is a status and nothing else');
ok(bySlug['gamma-2026'].exhibitors.skipped === 'unknown_host' && counters.attendee === 0, 'Gamma: the attendee-list host is skipped and named — never fetched');
ok(bySlug['gamma-2026'].agenda.people === 2 && bySlug['gamma-2026'].agenda.matched === 1 && !bySlug['gamma-2026'].agenda.error, 'Gamma (s2): the agenda page read with the roster parser — two people, Rita Ng at Tesla matched (' + JSON.stringify(bySlug['gamma-2026'].agenda) + ')');
ok(bySlug['alpha-2026'].agenda.skipped === 'same_as_speakers' && counters.urls.filter((u) => u === SPK_ALPHA).length === 1, 'Alpha (s2): an agenda URL equal to the roster URL is read once and marked same_as_speakers');
ok(r.pages === 7 && r.pagesFailed === 2, 'sweep: seven pages read (five + the agenda + one newsroom), two failed (the 503 gallery, the 404 newsroom) (' + r.pages + ' / ' + r.pagesFailed + ')');
ok(r.feeds.length === 4 && r.feeds[0].key === 'prnewswire' && r.feeds[0].items === 5 && r.feeds[1].items === 0 && r.feeds[2].error === 'fetch_failed' && r.feeds[3].key === 'fedreg-ferc' && r.feeds[3].items === 5,
   'feeds: PR Newswire five items, Business Wire empty, GlobeNewswire unreachable and named, the FERC feed five items (' + JSON.stringify(r.feeds) + ')');
ok(JSON.stringify(r.newsrooms) === JSON.stringify({ accounts: 2, read: 1, skipped: 0, failed: 1, matched: 2 }), 'newsrooms (s2): two targets with a URL — one read and matched twice, one failed; the customer and the partner never counted (' + JSON.stringify(r.newsrooms) + ')');
ok(r.dockets.accounts === 2 && r.dockets.items === 5 && r.dockets.found === 2 && r.dockets.note === '', 'dockets (s2): two watched accounts (an IPP and a utility), five items, two filings matched (' + JSON.stringify(r.dockets) + ')');
ok(bySlug['re-plus-2026'].press === 1 && bySlug['alpha-2026'].press === 1 && bySlug['beta-2027'].press === 0, 'press: Fluence + booth + RE+ and Sungrow + will present + Alpha Show — the no-cue, no-event and supplier items write nothing');
ok(r.found === 13 && r.written === 13 && r.updated === 0 && r.rejected === 0 && !r.writeError, 'sweep: thirteen signals found and written through Network — eight from session 1, an agenda person, two newsroom shows, two dockets (' + JSON.stringify({ f: r.found, w: r.written, u: r.updated, rj: r.rejected }) + ')');
// Network's Signals tab — the real far side wrote them
let rows = sigRows();
ok(rows.length === 13 && rows.every((x) => /^s-[0-9a-z]{13}$/.test(col(x, 'Signal ID')) && col(x, 'Owner') === OWNER && col(x, 'Source') === 'events' && /^\d{4}-\d{2}-\d{2}T/.test(col(x, 'First Seen'))),
   'Network Signals: thirteen rows, s- ids, Source events, First Seen ISO');
const kinds = rows.map((x) => col(x, 'Kind') + ':' + col(x, 'Confidence')).sort().join(',');
ok(kinds === 'agenda:0.9,docket:0.7,docket:0.7,exhibitor:0.9,exhibitor:0.9,exhibitor:0.9,exhibitor:0.9,newsroom:0.7,newsroom:0.7,press-release:0.8,press-release:0.8,speaker:0.9,speaker:0.9',
   'Network Signals: the six kinds with their confidences — agenda 0.9, docket 0.7, newsroom 0.7 beside session 1\'s (' + kinds + ')');
const jane = rows.find((x) => col(x, 'Person Name') === 'Jane Doe'), ann = rows.find((x) => col(x, 'Person Name') === 'Ann Lee');
ok(jane && col(jane, 'Person Title') === 'VP Storage' && col(jane, 'Account ID') === 'a-0000000000001' && col(jane, 'Event Slug') === 'alpha-2026' && col(jane, 'Evidence URL') === SPK_ALPHA
   && ann && col(ann, 'Person Title') === 'Director of Grid' && col(ann, 'Account ID') === 'a-0000000000004' && col(ann, 'Event Slug') === 'beta-2027' && col(ann, 'Evidence URL') === SPK_BETA,
   'Network Signals: the speaker rows carry the person, title, account, event and the roster URL as evidence');
const tesla = rows.find((x) => col(x, 'Account ID') === 'a-0000000000005');
ok(tesla && col(tesla, 'Kind') === 'exhibitor' && col(tesla, 'Event Slug') === 're-plus-2026' && col(tesla, 'Evidence URL') === MYS_PAGE && /Listed as an exhibitor: Tesla$/.test(col(tesla, 'Note')),
   'Network Signals: the exhibitor row cites the gallery page (not the proxy) and notes the listed name');
const press = rows.filter((x) => col(x, 'Kind') === 'press-release');
ok(press.length === 2 && press.some((x) => col(x, 'Account ID') === 'a-0000000000001' && col(x, 'Event Slug') === 're-plus-2026' && col(x, 'Evidence URL') === 'https://www.prnewswire.example/news/1')
   && press.some((x) => col(x, 'Account ID') === 'a-0000000000002' && col(x, 'Event Slug') === 'alpha-2026' && col(x, 'Evidence URL') === 'https://www.prnewswire.example/news/3'),
   'Network Signals: the press rows cite the item link and carry the account and event the item named');
ok(!rows.some((x) => col(x, 'Account ID') === 'a-0000000000003'), 'Network Signals: the supplier never gets a row');
// the audit: one row for the failed page, one for the failed feed, counts only
const pageFail = counters.audit.filter((a) => a.op === 'events_signals_page_failed'), feedFail = counters.audit.filter((a) => a.op === 'events_signals_feed_failed');
ok(pageFail.length === 2 && pageFail[0].details.slug === 'omega-2026' && pageFail[0].details.source === 'exhibitors' && pageFail[0].details.status === 503
   && pageFail[1].details.source === 'newsroom' && pageFail[1].details.status === 404 && pageFail[1].details.slug === '' && !('accountId' in pageFail[1].details),
   'audit: exactly two page-failed rows (omega exhibitors 503; a newsroom 404 with no slug and no account id)');
ok(feedFail.length === 1 && feedFail[0].details.feed === 'globenewswire', 'audit: exactly one feed-failed row (globenewswire)');
const runAudit = counters.audit.filter((a) => a.op === 'events_signals_run').pop();
ok(runAudit && runAudit.user === OWNER && runAudit.details.found === 13 && runAudit.details.written === 13 && runAudit.details.newsrooms === 1 && runAudit.details.dockets === 2 && Object.values(runAudit.details).every((v) => typeof v === 'number'), 'audit: the run row carries counts only (newsrooms and dockets included), as the admin who pressed it');
const auditText = JSON.stringify(counters.audit.slice(before4.audit)).toLowerCase();
const leaks = ['fluence', 'jane', 'tesla', 'acme', '://', 'prnewswire', TOKEN.toLowerCase(), 'a-0000000000001', 'linkedin'].filter((w) => auditText.indexOf(w) >= 0);
ok(leaks.length === 0, 'audit: no account, person, URL, id or token in any row (leaked: ' + leaks.join(',') + ')');
// the fetches: the proxy with its header, never LinkedIn or the attendee list, never a GitHub host
const mysIdx = counters.urls.indexOf(MYS_PROXY);
ok(mysIdx >= 0 && counters.headers[mysIdx]['X-Requested-With'] === 'XMLHttpRequest' && counters.urls.indexOf(MYS_PAGE) < 0, 'fetches: the Map Your Show proxy was called with the XHR header, the gallery page itself never');
ok(counters.linkedin === 0 && counters.attendee === 0 && !counters.urls.some((u) => /linkedin|lnkd\.in|10times|attendee|github\.com|githubusercontent/i.test(u)), 'fetches: no LinkedIn, no listing site, no attendee list, no GitHub host');
ok(counters.urls.filter((u) => /prnewswire|businesswire|globenewswire/.test(u)).length === 3 && counters.urls.filter((u) => u === FERC_URL).length === 1, 'fetches: each feed once per run, the FERC feed too, not once per event or per account');
// the parked state for the panel
const parked = JSON.parse(props.EV_SIGNALS_LAST);
ok(parked.written === 13 && parked.events === 13 && parked.pagesFailed === 2 && parked.newsrooms === 1 && parked.dockets === 2 && !('results' in parked) && JSON.stringify(parked).toLowerCase().indexOf('fluence') < 0, 'last-run state: counts only (with the newsroom and docket counts), parked for the panel');
const state = call('evSignalsState_');
ok(state.installed === false && state.last.found === 13 && /Tuesday 06:00/.test(state.schedule), 'evSignalsState_: not installed, the last run\'s counts, the Tuesday schedule');

// ── 5. The re-run: written → updated, no duplicate row ────────────────────
ctx._evRegistryCache = null;
r = op(ADMIN, 'signalsnow');
ok(r.success && r.found === 11 && r.written === 0 && r.updated === 11 && sigRows().length === 13, 're-run: eleven found (the newsroom read this month is skipped), all updated, none written, still thirteen rows (' + JSON.stringify({ f: r.found, w: r.written, u: r.updated, rows: sigRows().length }) + ')');
ok(r.newsrooms.skipped === 1 && r.newsrooms.read === 0 && r.newsrooms.failed === 1 && counters.urls.filter((u) => u === NEWS_FLUENCE).length === 1 && counters.urls.filter((u) => u === NEWS_TESLA).length === 2,
   're-run (s2): the page read today is skipped — fetched once across two runs; the failed page is retried (' + JSON.stringify(r.newsrooms) + ')');
ok(counters.audit.filter((a) => a.op === 'events_signals_page_failed').length === 4, 're-run: the two failing pages audited once per run each');

// ── 6. The score reads them back — the why names the person ──────────────
ctx._evRegistryCache = null;
r = op(ADMIN, 'recommend');
const scored = Object.fromEntries(r.events.map((e) => [e.slug, e]));
ok(r.success && scored['beta-2027'].why.accounts.length === 1 && scored['beta-2027'].why.accounts[0].name === 'Acme Storage' && scored['beta-2027'].why.accounts[0].signal.kind === 'speaker'
   && scored['beta-2027'].why.accounts[0].signal.personName === 'Ann Lee' && scored['beta-2027'].why.accounts[0].signal.personTitle === 'Director of Grid',
   'recommend: Beta\'s why names Acme Storage through Ann Lee, Director of Grid (' + JSON.stringify(scored['beta-2027'].why.accounts) + ')');
ok(scored['re-plus-2026'].why.accounts.map((a) => a.name).sort().join(',') === 'Fluence Energy,Tesla' && scored['re-plus-2026'].terms.accountPresence > 0 && !('personName' in scored['re-plus-2026'].why.accounts[0].signal),
   'recommend: RE+\'s why names the two exhibiting accounts, no person on a company-level signal');
ok(scored['alpha-2026'].why.accounts.map((a) => a.name).sort().join(',') === 'Acme Storage,Fluence Energy,Sungrow', 'recommend: Alpha\'s why names the a2z, roster and press accounts once each');
ok(scored['gamma-2026'].why.accounts.length === 1 && scored['gamma-2026'].why.accounts[0].name === 'Tesla' && scored['gamma-2026'].why.accounts[0].signal.kind === 'agenda' && scored['gamma-2026'].why.accounts[0].signal.personName === 'Rita Ng',
   'recommend (s2): Gamma\'s why names Tesla through the agenda\'s Rita Ng (' + JSON.stringify(scored['gamma-2026'].why.accounts) + ')');
ok(!r.events.some((e) => (e.why.accounts || []).some((a) => a.signal && a.signal.kind === 'docket')) && r.signals === 11, 'recommend (s2): the two docket rows (no event slug) never reach a score — eleven signals read, none of them a docket');

// ── 7. LinkedIn: never fetched; rejected on every kind but linkedin-manual ─
const li = 'https://www.linkedin.com/posts/fluence-at-replus-123';
r = op(ADMIN, 'signal', { accountId: 'a-0000000000001', slug: 're-plus-2026', kind: 'registrant-mail', evidenceUrl: li, confidence: 0.8 });
ok(r.success === true && r.written === 0 && r.rejected.length === 1 && r.rejected[0].reason === 'linkedin_not_fetched' && sigRows().length === 13, 'manual (registrant-mail + a LinkedIn link): Network rejects it linkedin_not_fetched, no row');
r = op(ADMIN, 'signal', { accountId: 'a-0000000000001', slug: 're-plus-2026', kind: 'linkedin-manual', evidenceUrl: li, note: 'Their VP posted the booth number  and a demo slot', confidence: 0.8, personName: 'Sam Post', personTitle: 'VP Sales' });
ok(r.success === true && r.written === 1 && r.updated === 0 && r.rejected.length === 0 && sigRows().length === 14, 'manual (linkedin-manual + a LinkedIn link): accepted — the only LinkedIn entry (' + JSON.stringify(r) + ')');
const manual = sigRows().find((x) => col(x, 'Kind') === 'linkedin-manual');
ok(manual && col(manual, 'Evidence URL') === li && col(manual, 'Confidence') === 0.8 && col(manual, 'Note') === 'Their VP posted the booth number and a demo slot' && col(manual, 'Person Name') === 'Sam Post' && col(manual, 'Source') === 'events',
   'manual row: the link kept as evidence, the line collapsed to one, the person, Source events');
ok(counters.linkedin === 0 && !counters.urls.some((u) => /linkedin/i.test(u)), 'manual: the LinkedIn link was never fetched');
r = op(ADMIN, 'signal', { accountId: 'a-0000000000001', slug: 're-plus-2026', kind: 'linkedin-manual', evidenceUrl: li, confidence: 0.9 });
ok(r.success && r.written === 0 && r.updated === 1 && sigRows().length === 14 && col(sigRows().find((x) => col(x, 'Kind') === 'linkedin-manual'), 'Confidence') === 0.9, 'manual again: the same link updates the row (confidence re-rated), never duplicates');
ok(op(ADMIN, 'signal', { accountId: 'c-0000000000001', slug: 're-plus-2026', kind: 'linkedin-manual', evidenceUrl: li, confidence: 0.8 }).error === 'bad_account_id'
   && op(ADMIN, 'signal', { accountId: 'a-0000000000001', slug: 'Bad Slug', kind: 'linkedin-manual', evidenceUrl: li, confidence: 0.8 }).error === 'bad_slug'
   && op(ADMIN, 'signal', { accountId: 'a-0000000000001', slug: 're-plus-2026', kind: 'exhibitor', evidenceUrl: li, confidence: 0.8 }).error === 'bad_kind'
   && op(ADMIN, 'signal', { accountId: 'a-0000000000001', slug: 're-plus-2026', kind: 'linkedin-manual', evidenceUrl: 'not a url', confidence: 0.8 }).error === 'evidence_required'
   && op(ADMIN, 'signal', { accountId: 'a-0000000000001', slug: 're-plus-2026', kind: 'linkedin-manual', evidenceUrl: li, confidence: 7 }).error === 'bad_confidence',
   'manual: bad_account_id / bad_slug / bad_kind (only the two manual kinds) / evidence_required / bad_confidence, each before any write');
r = op(ADMIN, 'signal', { accountId: 'a-0000000000009', slug: 're-plus-2026', kind: 'registrant-mail', evidenceUrl: 'https://mail.example/x', confidence: 0.6 });
ok(r.success && r.rejected.length === 1 && r.rejected[0].reason === 'account_not_found', 'manual: an unknown account is Network\'s account_not_found, relayed');
// Network's read leg carries the person back; a company-level row stays ids and evidence
const read = nwPeer({ parameter: { nop: 'signals', t: TOKEN, owner: OWNER, accountId: 'a-0000000000004' } });
ok(read.success && read.signals.length === 3 && read.signals.some((s) => s.kind === 'speaker' && s.personName === 'Ann Lee' && s.personTitle === 'Director of Grid') && read.signals.some((s) => s.kind === 'exhibitor' && !('personName' in s))
   && read.signals.some((s) => s.kind === 'docket' && s.eventSlug === '' && /acme-storage-inc$/.test(s.evidenceUrl)),
   'Network read leg: the person on the roster row, no person key on the exhibitor row, the docket row with its empty slug and the filing as evidence');

// ── 8. installsignals is idempotent — one Tuesday trigger ─────────────────
counters.triggers.push({ getHandlerFunction: () => 'evSignalsRun_', fn: 'evSignalsRun_' });   // a stale trigger on the private name
counters.triggers.push({ getHandlerFunction: () => 'evPollTick', fn: 'evPollTick' });          // the poller's — untouched
let inst = op(ADMIN, 'installsignals');
ok(inst.success && inst.installed && inst.removed === 1 && counters.triggers.length === 2 && counters.triggers.some((t) => t.fn === 'evPollTick') && counters.triggers.find((t) => t.fn === 'evSignalsTick').spec.join(',') === 'TUESDAY,6,America/New_York',
   'installsignals: the stale trigger removed, the poller\'s kept, one Tuesday 06:00 America/New_York trigger on evSignalsTick');
inst = op(ADMIN, 'installsignals');
ok(inst.removed === 1 && counters.triggers.filter((t) => t.fn === 'evSignalsTick').length === 1, 'installsignals twice: still exactly one sweep trigger');
ok(call('evSignalsState_').installed === true && op(ADMIN, 'proposed').signals.installed === true, 'proposed: the panel\'s answer reports the sweep installed');
// the trigger handler sweeps every owner with a Stars row, as 'signals'
ctx._evRegistryCache = null;
const tick = call('evSignalsTick');
ok(tick.success && tick.owners === 2 && counters.audit.filter((a) => a.op === 'events_signals_run').pop().user === 'signals', 'evSignalsTick: sweeps both owners on the Stars tab (the other owner has no accounts → nothing written), audited as signals');

// ── 9. The time budget stops the run cleanly ──────────────────────────────
vm.runInContext('EV_POLL_TOTAL_BUDGET_MS = 1', ctx);
ctx._evRegistryCache = null;
r = op(ADMIN, 'signalsnow');
ok(r.success && r.stopped === true && r.pages === 0 && r.found === 0 && r.feeds.length === 0, 'budget: a run that would overrun stops before the first page, sweeps nothing, says so');
vm.runInContext('EV_POLL_TOTAL_BUDGET_MS = 270000', ctx);

// ── 10. Nothing live ──────────────────────────────────────────────────────
ok(counters.urls.every((u) => u.indexOf(SITE) === 0 || u.indexOf(NW_EXEC) === 0 || u === MYS_PROXY || u === A2Z_ALPHA || u === A2Z_OMEGA || u === SPK_REPLUS || u === SPK_ALPHA || u === SPK_BETA
   || u === AGENDA_GAMMA || u === NEWS_FLUENCE || u === NEWS_TESLA || u === FERC_URL || /prnewswire|businesswire|globenewswire/.test(u)),
   'every fetch went to a stubbed URL — zero live calls (' + counters.fetch + ' fetches)');
ok(nwCounters.fetch === 0, 'Network far side: no UrlFetchApp call anywhere');
ok(!counters.nonTarget && !counters.urls.some((u) => u === NEWS_SUNGROW || /bolt\.example/.test(u)), 'newsrooms (s2): a customer\'s or a supplier\'s page is never read — target accounts only');

// ── 11. Session 2 · the newsroom page — the parser, the skip, the rows ────
const nrHits = call('evParseNewsroom_', NEWS_HTML, REGISTRY.events);
ok(nrHits.length === 2 && nrHits[0].slug === 're-plus-2026' && nrHits[0].key === 're 2026' && nrHits[1].slug === 'alpha-2026' && nrHits[1].key === 'alpha show',
   'newsroom parser: RE+ 2026 by its edition name, Alpha Show by its series with the year within reach; Beta Summit (no year near — the script tag is stripped) not (' + JSON.stringify(nrHits) + ')');
ok(call('evParseNewsroom_', '<p>See you at Alpha Show in Austin.</p>', REGISTRY.events).length === 0 && call('evParseNewsroom_', '<p>Alpha Show, 2026 edition.</p>', REGISTRY.events).length === 1,
   'newsroom parser: a series with no year nearby is not a signal; with the year it is');
ok(call('evParseNewsroom_', '<p>Gamma Forum 2026 for sure. Our gamma forums are great.</p>', REGISTRY.events).map((h) => h.slug).join(',') === 'gamma-2026', 'newsroom parser: whole-key matches only, one hit per event');
ok(call('evNewsroomFresh_', '2026-09-22', TODAY) && call('evNewsroomFresh_', '2026-08-26', TODAY) && !call('evNewsroomFresh_', '2026-08-25', TODAY) && !call('evNewsroomFresh_', '', TODAY) && !call('evNewsroomFresh_', 'never', TODAY) && !call('evNewsroomFresh_', '2026-10-01', TODAY),
   'monthly skip: read today or 27 days ago → skipped; 28 days ago, never, garbage or a future day → read');
const nrState = JSON.parse(props.EV_SIGNALS_NEWSROOM);
ok(JSON.stringify(nrState) === JSON.stringify({ 'a-0000000000001': TODAY }) && JSON.stringify(nrState).toLowerCase().indexOf('fluence') < 0 && JSON.stringify(nrState).indexOf('http') < 0,
   'monthly skip: the parked state holds the read day by account id only — the failed page is not marked (' + JSON.stringify(nrState) + ')');
const nrRows = sigRows().filter((x) => col(x, 'Kind') === 'newsroom');
ok(nrRows.length === 2 && nrRows.every((x) => col(x, 'Account ID') === 'a-0000000000001' && col(x, 'Evidence URL') === NEWS_FLUENCE && col(x, 'Confidence') === 0.7 && col(x, 'Person Name') === 'Maria Volt' && col(x, 'Person Title') === 'Chief Commercial Officer')
   && nrRows.map((x) => col(x, 'Event Slug')).sort().join(',') === 'alpha-2026,re-plus-2026' && nrRows.every((x) => /^Named on the company's events page: /.test(col(x, 'Note'))),
   'Network Signals: the two newsroom rows — the target, the two shows, the page as evidence, 0.7, the person the page names (' + JSON.stringify(nrRows.map((x) => [col(x, 'Event Slug'), col(x, 'Note')])) + ')');
// aged past the month, the page is read again on the next run — an upsert, so no new row
props.EV_SIGNALS_NEWSROOM = JSON.stringify({ 'a-0000000000001': '2026-08-20' });
ctx._evRegistryCache = null;
const rowsBefore = sigRows().length;
r = op(ADMIN, 'signalsnow');
ok(r.success && r.newsrooms.read === 1 && r.newsrooms.skipped === 0 && r.found === 13 && r.written === 0 && r.updated === 13 && sigRows().length === rowsBefore && JSON.parse(props.EV_SIGNALS_NEWSROOM)['a-0000000000001'] === TODAY,
   'monthly skip: a page read 33 days ago is read again, its rows updated (never duplicated), the day re-parked (' + JSON.stringify(r.newsrooms) + ')');

// ── 12. Session 2 · the docket watch — the roster\'s feed, the segments, no slug ─
ok(vm.runInContext('EV_DOCKET_FEEDS', ctx)[0][2] === FERC_URL && vm.runInContext('EV_DOCKET_FEEDS', ctx).length === 1 && /federalregister\.gov/.test(FERC_URL),
   'docket feed: the one URL is the Scraper roster\'s fedreg-ferc row byte for byte — no new outlet (' + FERC_URL.slice(0, 60) + '…)');
ok(!/ferc\.gov\/|elibrary/i.test(JSON.stringify(vm.runInContext('EV_DOCKET_FEEDS', ctx))) && /'src-ferc-gov'[\s\S]{0,120}status: 'blocked'/.test(scraperSrc) && !counters.urls.some((u) => /ferc\.gov/i.test(u)),
   'docket feed: FERC\'s own site is never fetched — the Scraper roster retires it as blocked');
const segs = call('evDocketSegments_');
ok(!segs.error && Object.keys(segs.set).sort().join(',') === 'aidc-developers-and-landlords,storage-developers-and-ipps,utilities', 'docket segments: found by name in profiler-segments.json — utilities, IPPs, developers; capital and neoclouds not (' + Object.keys(segs.set).sort().join(',') + ')');
const dkItems = call('evParseRss_', RSS_FERC), dkSink = [];
const dk = call('evMatchDockets_', dkItems, matcher, segs.set, dkSink, '2026-09-22T00:00:00Z');
ok(dk.accounts === 2 && dk.found === 2 && dkSink.every((x) => x.kind === 'docket' && x.confidence === 0.7 && x.eventSlug === '' && /federalregister\.example\/documents/.test(x.evidenceUrl))
   && dkSink.map((x) => x.accountId).sort().join(',') === 'a-0000000000001,a-0000000000004' && dkSink.some((x) => /^Fluence Energy, LLC; Notice of Filing$/.test(x.note)),
   'docket matcher: the IPP and the utility named as filers; Tesla (no docket segment), the combined notice and the unknown utility never (' + JSON.stringify(dkSink.map((x) => [x.accountId, x.note])) + ')');
const dkRows = sigRows().filter((x) => col(x, 'Kind') === 'docket');
ok(dkRows.length === 2 && dkRows.every((x) => col(x, 'Event Slug') === '' && col(x, 'Source') === 'events' && col(x, 'Confidence') === 0.7 && /^https:\/\/www\.federalregister\.example\/documents\//.test(col(x, 'Evidence URL'))),
   'Network Signals: the two docket rows landed through the real write leg with an empty Event Slug and the filing as evidence');
let wr = nwPeer({ parameter: { nop: 'signals', t: TOKEN, owner: OWNER }, postData: { contents: JSON.stringify({ owner: OWNER, signals: [
  { accountId: 'a-0000000000001', eventSlug: '', kind: 'exhibitor', evidenceUrl: 'https://www.gallery.example/x', confidence: 0.9, firstSeen: '2026-09-22T00:00:00Z' },
  { accountId: 'a-0000000000001', eventSlug: '', kind: 'newsroom', evidenceUrl: 'https://www.fluence.example/x', confidence: 0.7, firstSeen: '2026-09-22T00:00:00Z' },
  { accountId: 'a-0000000000001', eventSlug: 'Bad Slug', kind: 'docket', evidenceUrl: 'https://www.federalregister.example/y', confidence: 0.7, firstSeen: '2026-09-22T00:00:00Z' } ] }), type: 'application/json' } });
ok(wr.success && wr.written === 0 && wr.rejected.length === 3 && wr.rejected.every((x) => x.reason === 'bad_slug'), 'Network write leg: an empty slug is bad_slug on every kind but docket, and a malformed slug is bad_slug on docket too (' + JSON.stringify(wr.rejected) + ')');
const acctAnswer = nwPeer({ parameter: { nop: 'accounts', t: TOKEN, owner: OWNER } });
const fl = acctAnswer.accounts.find((a) => a.id === 'a-0000000000001'), ac = acctAnswer.accounts.find((a) => a.id === 'a-0000000000004');
ok(acctAnswer.success && fl.newsroomUrl === NEWS_FLUENCE && !('newsroomUrl' in ac) && JSON.stringify(fl.segments) === JSON.stringify(['storage-developers-and-ipps', 'capital']) && !('notes' in fl) && !('contacts' in fl),
   'nop=accounts: carries newsroomUrl only when set and the segments; still no notes, no contacts (' + JSON.stringify(fl) + ')');

// ── 13. Session 2 · a recording of a talk — a manual row of kind agenda ────
const yt = 'https://www.youtube.example/watch?v=ocp-keynote-2026';
r = op(ADMIN, 'signal', { accountId: 'a-0000000000002', slug: 'alpha-2026', kind: 'agenda', evidenceUrl: yt, note: 'watched their CTO\'s keynote on cell-to-pack', confidence: 0.7, personName: 'Lin Zhou', personTitle: 'CTO' });
ok(r.success === true && r.written === 1 && r.rejected.length === 0 && r.kind === 'agenda', 'recording (manual, kind agenda): accepted — the link kept as evidence, never fetched (' + JSON.stringify(r) + ')');
const rec = sigRows().find((x) => col(x, 'Evidence URL') === yt);
ok(rec && col(rec, 'Kind') === 'agenda' && col(rec, 'Event Slug') === 'alpha-2026' && col(rec, 'Note') === 'Recording: watched their CTO\'s keynote on cell-to-pack' && col(rec, 'Person Name') === 'Lin Zhou' && col(rec, 'Confidence') === 0.7 && col(rec, 'Source') === 'events',
   'recording row: kind agenda, the note prefixed "Recording:", the person, the rated confidence');
r = op(ADMIN, 'signal', { accountId: 'a-0000000000002', slug: 'alpha-2026', kind: 'agenda', evidenceUrl: yt, note: 'Recording of the same keynote, second viewing', confidence: 0.8 });
ok(r.success && r.updated === 1 && r.written === 0 && col(sigRows().find((x) => col(x, 'Evidence URL') === yt), 'Note') === 'Recording of the same keynote, second viewing', 'recording again: the same link updates the row; a note already starting with Recording is not prefixed twice');
ok(op(ADMIN, 'signal', { accountId: 'a-0000000000002', slug: 'alpha-2026', kind: 'agenda', evidenceUrl: yt, note: '', confidence: 0.8 }).success && col(sigRows().find((x) => col(x, 'Evidence URL') === yt), 'Note') === 'Recording',
   'recording with no line: the note is "Recording" alone — carried, so Network\'s upsert refreshes the row\'s note with it (the write leg\'s rule)');
ok(counters.urls.indexOf(yt) < 0 && op(ADMIN, 'signal', { accountId: 'a-0000000000002', slug: 'alpha-2026', kind: 'docket', evidenceUrl: yt, confidence: 0.8 }).error === 'bad_kind', 'recording: the link was never fetched; docket is not a manual kind');

console.log('check-events-signals: ' + checks + ' checks, ' + failures + ' failure(s)');
if (failures) process.exit(1);
console.log('ALL CHECKS PASSED — the matcher is Network\'s key byte for byte; the Map Your Show, a2z, JSON-LD and HTML roster and RSS parsers read their fixtures; '
  + 'the sweep writes exhibitor 0.9, speaker 0.9 (with the person) and press-release 0.8 through Network\'s real write leg, updates on the re-run, and the score names the person; '
  + 'a LinkedIn link is never fetched and is rejected on every kind but linkedin-manual; an attendee list is never fetched; a failed page is one audit row and nothing else; '
  + 'not_configured degrades; the ops are refused to a non-admin with zero fetches; installsignals is idempotent. '
  + 'Session 2: a newsroom page names two shows (0.7, the person), is read once a month by account id and retried when it fails; an agenda page yields its people (0.9); '
  + 'the Federal Register FERC feed — the Scraper roster\'s row — names two filers among the watched IPP / utility accounts (docket 0.7, no event slug — accepted by Network for docket only, never scored); '
  + 'a recording is a manual agenda row. Zero live calls.');

// Developed by: LightAISolutions
