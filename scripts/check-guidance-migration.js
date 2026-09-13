#!/usr/bin/env node
// C3 session 3 — the guidance progress migration, proved end to end.
//
// PHASE6-CLASSROOM-DESIGN.md -> Verification expectations makes this the
// done-when: "the C3 migration is complete only when ... migrated progress
// ticks verify against a pre-migration export". The six one-shot functions
// that do the migration cannot be run here, so this runs them the way Apps
// Script would: the REAL bodies, lifted out of the two .gs files, in two
// isolated VM contexts with one Script Property store each -- the same
// isolation the two projects have in production.
//
// The fixture is built from the REAL guidanceDocs_() registry, so a module
// or section id that changes is picked up rather than mocked around. It
// covers the cases the brief names as traps: study-<slug> and
// dossier-<slug> ticks sharing the property and staying put, a legacy
// `true`, an unreadable date, a section id that no longer exists, an
// account with no module ticks at all, an unrelated Script Property, and a
// Classroom tick NEWER than the Profiler one for the same section.
//
// Delete this with the one-shot functions, once the migration has run in
// production and the developer has confirmed it -- the same way
// check-guidance-parity.py was deleted with the duplicate window it guarded.
//
// Usage:  node scripts/check-guidance-migration.js
// Exit:   0 when every assertion holds, 1 on the first set that does not.
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = process.argv[2] || path.join(__dirname, "..");
const P = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

function region(src) {
  const m = /^\/\/ PROJECT START.*?\n([\s\S]*?)^\/\/ PROJECT END/m.exec(src);
  if (!m) throw new Error('PROJECT region not found');
  return m[1];
}
function extract(src, name) {
  const m = new RegExp('^function ' + name + '\\(', 'm').exec(src);
  if (!m) throw new Error('missing ' + name);
  let i = src.indexOf('{', m.index), depth = 0, j = i, q = null;
  while (j < src.length) {
    const ch = src[j];
    if (q) { if (ch === '\\') { j += 2; continue; } if (ch === q) q = null; }
    else if (ch === '"' || ch === "'") q = ch;
    else if (ch === '{') depth++;
    else if (ch === '}') { if (--depth === 0) return src.slice(m.index, j + 1); }
    j++;
  }
  throw new Error('unbalanced ' + name);
}
function makeCtx(props) {
  const log = [];
  const ctx = {
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (k) => (Object.prototype.hasOwnProperty.call(props, k) ? props[k] : null),
      setProperty: (k, v) => { props[k] = String(v); },
      deleteProperty: (k) => { delete props[k]; },
      getProperties: () => Object.assign({}, props)
    }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    CacheService: { getScriptCache: () => ({ get: () => null, put() {} }) },
    UrlFetchApp: { fetch() { throw new Error('offline'); }, fetchAll: () => [] },
    Logger: { log: (...a) => log.push(a.join(' ').slice(0, 200)) },
    console, JSON, Object, Date, String, Number, Array, RegExp, Error, parseInt, isNaN
  };
  ctx.__log = log;
  vm.createContext(ctx);
  return ctx;
}

// ── Classroom context: the whole PROJECT region (guidanceDocs_ + the import) ──
const clSrc = P('googleAppsScripts/Classroom/Classroom.gs');
const clProps = {};
const CL = makeCtx(clProps);
vm.runInContext(region(clSrc), CL, { filename: 'Classroom.region.js' });

// ── Profiler context: only the export/prune surface ─────────────────────────
const pfSrc = P('googleAppsScripts/Profiler/Profiler.gs');
const pfProps = {};
const PF = makeCtx(pfProps);
vm.runInContext(
  'var VERSION = ' + JSON.stringify(/^var VERSION = "(.*?)";/m.exec(pfSrc)[1]) + ';\n' +
  /^var GD_PROGRESS_PROP_PREFIX = '.*?';$/m.exec(pfSrc)[0] + '\n' +
  /^var GD_MIGRATED_MODULE_IDS = \[[\s\S]*?\n\];$/m.exec(pfSrc)[0] + '\n' +
  ['gdMigratedIdSet_', 'gdGuidanceProgressScan_', 'exportGuidanceProgress',
   'gdPruneGuidanceProgress_', 'previewGuidanceProgressPrune', 'applyGuidanceProgressPrune']
    .map((n) => extract(pfSrc, n)).join('\n'),
  PF, { filename: 'Profiler.export.js' });

// ── Fixture: a realistic pre-migration gd_progress: store ───────────────────
const docs = vm.runInContext(
  'guidanceDocs_().map(function(d){return {id:d.id, secs:(d.sections||[]).map(function(s){return s.id;})};})',
  CL);
const fail = [];
const ok = (cond, msg) => { if (!cond) fail.push(msg); };
ok(docs.length === 9, 'expected 9 modules, got ' + docs.length);

const DEV = 'dev@example.com', OTHER = 'other@example.com';
// Account 1: ticks in 4 modules (one legacy `true`, one junk value), plus a
// study guide and a dossier that MUST NOT move.
const a1 = {};
a1[docs[0].id] = { [docs[0].secs[0]]: '2026-08-04', [docs[0].secs[1]]: '2026-08-05' };
a1[docs[1].id] = { [docs[1].secs[0]]: true };                       // legacy
a1[docs[2].id] = { [docs[2].secs[0]]: '2026-08-19', [docs[2].secs[1]]: 'garbage' };
a1[docs[3].id] = { [docs[3].secs[0]]: '2026-09-01', 'ghost-section': '2026-09-01' };
a1['study-tesla'] = { 'sec-overview': '2026-08-30' };
a1['dossier-nvidia'] = { '2026-08-22': '2026-08-23' };
// Account 2: one module, plus a dossier tick only.
const a2 = {};
a2[docs[4].id] = { [docs[4].secs[0]]: '2026-07-11' };
a2['dossier-catl'] = { '2026-08-01': true };
// Account 3: NOTHING but study/dossier — must not appear in the export at all.
const a3 = { 'study-abb': { 'sec-what-they-sell': '2026-08-02' } };
pfProps['gd_progress:' + DEV] = JSON.stringify(a1);
pfProps['gd_progress:' + OTHER] = JSON.stringify(a2);
pfProps['gd_progress:third@example.com'] = JSON.stringify(a3);
pfProps['SOME_OTHER_PROP'] = 'not a progress row';
const PRE = JSON.parse(JSON.stringify(pfProps));   // the pre-migration snapshot

// Classroom already holds lesson ticks, and ONE guidance tick made before the
// import — newer than Profiler's for the same section. It must survive.
const clash = docs[0].secs[0];
clProps['cl_progress:' + DEV] = JSON.stringify({
  'bess-what-a-battery-is': { 'sec-intro': '2026-08-01' },
  [docs[0].id]: { [clash]: '2026-09-10' }
});
const CL_PRE = JSON.parse(clProps['cl_progress:' + DEV]);

// ── STEP 1: export (read-only) ──────────────────────────────────────────────
const exp1 = vm.runInContext('exportGuidanceProgress()', PF);
ok(JSON.stringify(pfProps) === JSON.stringify(PRE), 'the export MUTATED Profiler’s store');
ok(Object.keys(exp1.accounts).length === 2,
   'export covered ' + Object.keys(exp1.accounts).length + ' account(s), expected 2 (the study-only account must not appear)');
ok(!('third@example.com' in exp1.accounts), 'a study-only account leaked into the export');
for (const acct of Object.keys(exp1.accounts)) {
  for (const d of Object.keys(exp1.accounts[acct])) {
    ok(exp1.moduleIds.indexOf(d) >= 0, 'export carried non-module doc id ' + d);
  }
}
ok(!JSON.stringify(exp1.accounts).includes('study-'), 'a study- id reached the export');
ok(!JSON.stringify(exp1.accounts).includes('dossier-'), 'a dossier- id reached the export');
// Ticks: 2 + 1 + 2 + 2 (incl. the ghost section) for dev, 1 for other = 8
ok(exp1.counts.ticks === 8, 'export counted ' + exp1.counts.ticks + ' ticks, expected 8');
// Re-running the export must be byte-identical apart from the timestamp.
const exp2 = vm.runInContext('exportGuidanceProgress()', PF);
ok(JSON.stringify(exp1.accounts) === JSON.stringify(exp2.accounts), 'the export is not deterministic');

// ── STEP 2-3: hand it over, dry run ─────────────────────────────────────────
clProps['GUIDANCE_PROGRESS_IMPORT'] = JSON.stringify(exp1);
const before = JSON.parse(JSON.stringify(clProps));
const dry = vm.runInContext('previewGuidanceProgressImport()', CL);
ok(JSON.stringify(clProps) === JSON.stringify(before), 'the DRY RUN wrote to the store');
ok(dry.imported === 6, 'dry run planned ' + dry.imported + ' imports, expected 6 (8 ticks − 1 kept − 1 ghost section)');
ok(dry.kept === 1, 'dry run kept ' + dry.kept + ', expected 1 (the newer Classroom tick)');
ok(dry.skipped.length === 1 && /ghost-section/.test(dry.skipped[0]),
   'dry run skipped ' + JSON.stringify(dry.skipped) + ', expected exactly the ghost section');

// ── STEP 4: apply ───────────────────────────────────────────────────────────
const run1 = vm.runInContext('applyGuidanceProgressImport()', CL);
ok(run1.imported === 6, 'apply imported ' + run1.imported + ', expected 6');
const dev1 = JSON.parse(clProps['cl_progress:' + DEV]);
ok(JSON.stringify(dev1['bess-what-a-battery-is']) === JSON.stringify(CL_PRE['bess-what-a-battery-is']),
   'the import disturbed an existing LESSON tick');
ok(dev1[docs[0].id][clash] === '2026-09-10',
   'the newer Classroom tick was overwritten with the older Profiler one (' + dev1[docs[0].id][clash] + ')');
ok(dev1[docs[0].id][docs[0].secs[1]] === '2026-08-05', 'a dated module tick did not carry its date');
ok(dev1[docs[1].id][docs[1].secs[0]] === true, 'a legacy `true` tick was rewritten');
ok(dev1[docs[2].id][docs[2].secs[1]] === true, 'an unreadable date did not normalise to true');
ok(!('ghost-section' in (dev1[docs[3].id] || {})), 'a section id that does not exist was imported');
ok(!JSON.stringify(clProps).includes('"study-'), 'a study- id reached Classroom’s store');
ok(!JSON.stringify(clProps).includes('"dossier-'), 'a dossier- id reached Classroom’s store');
ok(!('cl_progress:third@example.com' in clProps), 'the study-only account got a Classroom property');

// ── STEP 5: verify against the pre-migration export ─────────────────────────
const rep = vm.runInContext('verifyGuidanceProgressImport()', CL);
ok(rep.ok === true, 'verify FAILED: ' + JSON.stringify(rep.missing));
ok(rep.missing.length === 0, 'verify reported missing ticks: ' + JSON.stringify(rep.missing));
ok(rep.matched === 6, 'verify matched ' + rep.matched + ', expected 6 (an unreadable date normalised to true counts as matched, not kept)');
ok(rep.kept.length === 1 && /2026-09-10/.test(rep.kept[0]),
   'verify did not name exactly the kept-by-Classroom tick: ' + JSON.stringify(rep.kept));
// Per account, EVERY exported tick is accounted for exactly once: matched,
// kept, missing or skipped — nothing falls between the buckets.
for (const acct of Object.keys(exp1.accounts)) {
  let want = 0;
  for (const d of Object.keys(exp1.accounts[acct])) want += Object.keys(exp1.accounts[acct][d]).length;
  const row = rep.accounts.filter((r) => r.account === acct)[0];
  const skipped = rep.skipped.filter((x) => x.indexOf(acct + ' ') === 0).length;
  ok(row && row.matched + row.kept + row.missing + skipped === want,
     'account ' + acct + ': ' + want + ' exported tick(s) but matched=' + (row && row.matched) +
     ' kept=' + (row && row.kept) + ' missing=' + (row && row.missing) + ' skipped=' + skipped);
}

// ── IDEMPOTENCY: run the whole import again ─────────────────────────────────
const snapshot = JSON.stringify(clProps);
const run2 = vm.runInContext('applyGuidanceProgressImport()', CL);
ok(run2.imported === 0, 'the second import wrote ' + run2.imported + ' tick(s) — it is NOT idempotent');
ok(JSON.stringify(clProps) === snapshot, 'the second import CHANGED the store');
const rep2 = vm.runInContext('verifyGuidanceProgressImport()', CL);
ok(rep2.ok === true && rep2.matched === rep.matched && rep2.kept.length === rep.kept.length,
   'the verify report moved between identical runs');

// ── STEPS 6-7: the prune, and what it must leave behind ─────────────────────
const pdry = vm.runInContext('previewGuidanceProgressPrune()', PF);
ok(JSON.stringify(pfProps) === JSON.stringify(PRE), 'the prune DRY RUN mutated the store');
ok(pdry.ticksDropped === 8, 'prune dry run would drop ' + pdry.ticksDropped + ' ticks, expected 8');
const papply = vm.runInContext('applyGuidanceProgressPrune()', PF);
const devAfter = JSON.parse(pfProps['gd_progress:' + DEV]);
ok(Object.keys(devAfter).sort().join(',') === 'dossier-nvidia,study-tesla',
   'the prune left ' + Object.keys(devAfter) + ' — study and dossier ticks must survive, modules must not');
ok(!('gd_progress:' + OTHER in pfProps) || !JSON.stringify(JSON.parse(pfProps['gd_progress:' + OTHER])).includes(docs[4].id),
   'the prune left a module tick behind for the second account');
ok(JSON.parse(pfProps['gd_progress:' + OTHER])['dossier-catl']['2026-08-01'] === true,
   'the prune destroyed a legacy dossier tick');
ok(pfProps['gd_progress:third@example.com'] === PRE['gd_progress:third@example.com'],
   'the prune touched a study-only account');
ok(pfProps['SOME_OTHER_PROP'] === 'not a progress row', 'the prune touched an unrelated Script Property');
// A second prune is a no-op.
const after = JSON.stringify(pfProps);
vm.runInContext('applyGuidanceProgressPrune()', PF);
ok(JSON.stringify(pfProps) === after, 'the prune is not idempotent');

// ── Report ──────────────────────────────────────────────────────────────────
console.log('modules            ' + docs.length);
console.log('export             ' + exp1.counts.accounts + ' account(s), ' + exp1.counts.modules +
            ' module(s), ' + exp1.counts.ticks + ' tick(s); ' + exp1.counts.keptDocs + ' non-module doc(s) left in Profiler');
console.log('import run 1       ' + run1.imported + ' imported, ' + run1.kept + ' already present, ' + run1.skipped.length + ' skipped');
console.log('import run 2       ' + run2.imported + ' imported (idempotent: store byte-identical)');
console.log('verify             ok=' + rep.ok + '  matched=' + rep.matched + '  kept=' + rep.kept.length +
            '  missing=' + rep.missing.length + '  skipped=' + rep.skipped.length);
console.log('kept by Classroom  ' + (rep.kept[0] || '—'));
console.log('prune              ' + papply.ticksDropped + ' tick(s) / ' + papply.docsDropped +
            ' doc(s) dropped across ' + papply.accounts.length + ' account(s)');
console.log('profiler leftovers ' + Object.keys(devAfter).sort().join(', '));
console.log(fail.length ? '\nFAILURES:\n  ' + fail.join('\n  ') : '\nALL ASSERTIONS PASSED (' + (44 - fail.length) + ' checks)');
process.exit(fail.length ? 1 : 0);

// Developed by: LightAISolutions
