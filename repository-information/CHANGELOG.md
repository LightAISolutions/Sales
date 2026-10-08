# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 96/100`

## [Unreleased]

*(No changes yet)*

## [v08.02r] — 2026-10-08 11:36:36 AM EST

> **Prompt:** "I woke up to this notification. Arm safety net snapshot for Network and Events. Then, tell me what the safety net snapshot does for them."

### Fixed

- **Events and Network ACL health probe misreported the last-known-good snapshot** (`Events.gs` v01.11g, `Network.gs` v01.19g) — `aclHealthProbe_` read the Script Property `ACL_LAST_GOOD`, which nothing writes (the snapshot lives under `aclSnapshotKey_()` = `ACL_SNAPSHOT_<page>`), and reported `{ armed, ageSeconds }`, a shape `scripts/check-acl-health.sh` does not parse. The daily ACL health Routine therefore printed "NOT armed" for both apps whatever the snapshot held. The grace block is now Receipts' verbatim: it reads `aclSnapshotKey_()` and reports `{ enabled, users, ageSec, usable }`. The snapshot save and the sign-in fallback were already wired correctly and are unchanged.
- Events and Network GAS changelogs `10/50 → 11/50` and `18/50 → 19/50`; README tree GAS displays synced; `Sections: 95/100 → 96/100` (no rotation).

## [v08.01r] — 2026-10-08 09:24:25 AM EST

> **Prompt:** "[Scheduled routine 'Profiler earnings desk': clone the repo, prove push works, read the refresh calendar, take at most three due rows oldest-first, verify each report published, run the Profiler Command including news triage, advance the calendar row, confirm unconfirmed dates within seven days, land one commit. Corpus token omitted — it must never be written to the repo.]"

### Changed

- Refreshed the Applied Digital dossier to profileVersion 5; v4 archived. Fiscal Q1 2027 results (reported 2026-10-07): revenue $341.9M, $3.7B cash against $6.4B debt, backlog unchanged at ~1.41 GW / ~$36B. Added the Polaris Forge 1 250 MW delivery (2026-10-02) and the ~1 GW Finland power agreement (2026-10-06); Delta Forge 1 / 2 site states (Louisiana / Alabama) now recorded.
- Advanced the Applied Digital refresh-calendar row to fiscal Q2 2027 (2027-01-07, unconfirmed) and refreshed its watch list.
- News triage via the Scraper corpus: 15 items reviewed, none promoted (UBS initiation is single-outlet trade-press; the Delta Forge 2 trade-press article could not be fetched and the same facts are first-party in the Q1 release).

## [v08.00r] — 2026-10-07 06:08:24 PM EST

> **Prompt:** "Ok, then I want you to execute the following:
>
> * Make the Scraper recover fast. When the hourly check finds today's build unfinished, it should do what the 6:00 run does: work for 4 minutes and schedule its own next run.
> * News feeds. The Scraper fetches them one at a time. Apps Script can fetch a batch at once (UrlFetchApp.fetchAll), and time spent waiting counts toward the 90 minutes. Change to fetching a batch at once.
> * Profiler's transcript watcher. It runs every 15 minutes (96 times a day) and scans the whole folder each time. change it to hourly during working hours.
> * The Scraper's hourly check. Change it to only on weekday mornings, plus one nightly pass for the interest sync.
>
>
> Also implement your recommended 1-3 fix:
>
> * Retry instead of quitting. When the 6 AM build can't get the lock, it should try again a minute later and log what happened.
> * Finish at full speed. When the hourly check finds today's build unfinished, it should hand it to the full-speed build (4-minute stretches, each scheduling the next) instead of doing one step itself.
> * Always alert at noon. Send the "nothing was built" alert at noon even if a build is still in progress.
>
>
> Let me know if you think I shouldn't implement anything above and I will reconsider. Otherwise, go for it."

Root cause of the missing 2026-10-07 Morning Digest, read from the developer's My Executions page: the 06:01 hourly tick started the build itself and held the script lock for 325.8 s; the 06:04:51 `scDigestMorningRun` waited its 5 s on `tryLock`, returned without logging or retrying (7.5 s run), and from then on the tick advanced the build one ~40 s step per hour — still unfinished at 17:01 ET, so nothing was saved, nothing sent, and the noon `norender` alert (reachable only when nothing was building) never fired. Trigger runtime that day was ~14.5 min across the 17 h shown, nowhere near the 90 min/day cap.

#### `Scraper.gs` — v02.23g

##### Fixed

- **Lock miss retries instead of quitting** — `scDigestMorningRun` (and so every continuation) calls the new `scDigestRetryAfterLockMiss_` when `tryLock(5000)` fails: books a 1-minute continuation, records the miss in the `DIGEST_LAST_RUN` note and the execution log, capped at `SCRAPER_DIGEST_LOCK_RETRY_MAX` (8) per day; only the cap reaching the limit goes to the error trail, so a routine miss does not turn the app's error tile amber. `scDigestClearContinuations_` moved after the lock so a run that loses the lock can no longer delete the continuation keeping a build alive. Each lock-winning stretch stamps `scDigestBuildPulse`
- **The tick hands off instead of stepping** — `scDigestScheduledTick_` now returns `scDigestHandOff_(clock)` for any due scheduled edition: a 1-minute continuation into the full-speed, self-chaining run, skipped while a chain is alive (pulse within `SCRAPER_DIGEST_PULSE_FRESH_MS`, 10 min) and during the 06:00 hour until the 06:00 trigger has run that day (it fires 05:45–06:15; handing off earlier would race it for the lock). A manual "Run intake now" build left in flight keeps the old one-step treatment, since a continuation stepping it every minute would race the app's own lock-free step loop
- **Noon alert regardless of build state** — the inline hard-stop check in `scDigestRepairPass_` became `scDigestNoRenderCheck_`, which the tick now calls first at or after `SCRAPER_DIGEST_HARD_STOP_HOUR`, whatever the build is doing; the text distinguishes "still building" from "never started". Still one `norender` alert per day

##### Changed

- **Feeds fetched as one batch** — `scDigestFetchStep_` gathers its ≤6 enabled roster feeds and fetches them with the new `scFetchAllTolerant_` (`UrlFetchApp.fetchAll`), falling back to one-at-a-time for that batch if the batch call throws, so one unreachable host costs only itself. The Google News backstop stays sequential: all twelve queries go to one host, which throttles bursts
- **Tick windows** — `scSchedulerTick` still fires hourly and always stamps its heartbeat, but works only in `scTickWindow_`'s two windows: weekday 06:00–13:59 ET (`SCRAPER_TICK_LAST_HOUR` 13, one tick past the hard stop) and the nightly 03:00 ET hour (`SCRAPER_TICK_NIGHTLY_HOUR`), which runs the interests sync (now forced, the hour being the throttle) and the subscriber-milestone check. Off-window ticks write a `DIGEST_LAST_RUN` note so the "Last scheduled run" tile does not go overdue; legacy schedules, if ever re-enabled, keep their round-the-clock cadence
- Comments describing the tick as "one step per tick" updated

#### `Profiler.gs` — v01.41g

##### Changed

- **Transcript watcher hourly in working hours** — `installTranscriptWatcher` arms `everyHours(1)`; `transcriptWatcherTick(e)` works only Mon–Fri 08:00–20:59 ET and at most once per clock hour (`TRANSCRIPT_WATCHER_LAST_HOUR` property), which also throttles a watcher armed before this change to hourly without re-arming. Editor runs (no event object) are never gated. Not running on this account per the 10/7 My Executions page, so this saves nothing today

### Changed

- **`repository-information/diagrams/Scraper-diagram.md`** — nightly-pass sync loop, the 06:00 chained build with lock retry and tick hand-off, the batched feed fetch, and the noon alert; mermaid.live link regenerated and verified
- `Sections: 93/100 → 94/100` (no rotation); Scraper GAS changelog `43/50 → 44/50`; Profiler GAS changelog `40/50 → 41/50`

## [v07.99r] — 2026-10-07 09:18:44 AM EST

> **Prompt:** "Profiler earnings desk (scheduled): take up to three due rows from the refresh calendar; confirm unconfirmed dates within seven days."

### Changed

- **`profiler-refresh-calendar.json`** — nothing was due. Applied Digital's fiscal Q1 2027 date confirmed from the company's call notice: Wednesday 2026-10-07 after the close, call 5:00 p.m. ET (was 2026-10-14, unconfirmed). The row falls due on the next run. No dossier written.

## [v07.98r] — 2026-10-07 07:15:11 AM EST

> **Prompt:** "You are one run of the Classroom curriculum pipeline (C2) in LightAISolutions/Sales. Nobody is watching this session and you cannot ask anyone anything. STEP 0 — clone the repo, unshallow, and prove push works with `git push --dry-run` before the pre-flight; a failure there is `BLOCKED` with nothing authored. READ FIRST: `repository-information/CLASSROOM-COMMITTER-CONTRACT.md`, `repository-information/CLASSROOM-SCHEMA.md`, `.claude/rules/classroom-app.md` — they do not auto-load in a Routine-fired session. Then run the contract's own pre-flight (§5.1) — repo identity, a clean tree, a fresh `claude/classroom-pipeline-<YYYY-MM-DD>` branch off a just-fetched `origin/main` (a pre-existing remote branch of that name is `BLOCKED`), a green `check-classroom-content.py` baseline with its warning count recorded, the gate-surface digest matching the ledger's `gateDigest`, and schema versions still v1/v1. CORPUS TOKEN: <no corpus token> — per §5.1 step 5, skip corpus reads entirely; refresh only from the Pages-served and repo-resident layers, and do not author a briefing from memory in their place. Undated registries are dated by file commit date. BUDGET: 45 minutes wall-clock and 120 assistant turns, whichever comes first. BEFORE COMMITTING, and again immediately before `git commit`, all of these must pass: `check-classroom-content.py` (zero errors, no new warnings against the baseline), `check-classroom-pipeline.py --base origin/main` (zero findings), `node --check` on a `.js` copy of `Classroom.gs`, and `node scripts/check-gas-inner-scripts.js`. Never edit a checker, its fixtures or its thresholds. END THE RUN with the §5.4 report verbatim."

### Added

- **briefing-2026-10-07** (tracks) — the second registered briefing edition, closing a 16-day window: nine sections over seven dated developments, covering SemiAnalysis's ClusterMAX 3.0 rating round and the neocloud share reaction, Nscale's USD 3.36bn convertible and its postponed roadshow, Lambda's USD 1.008bn rated senior secured term loan, Fluidstack's overdue FY2025 Companies House accounts against its relayed revenue memo, the Barber Lake delivery slip and its cost-overrun split, Oracle's force-majeure notice on Project Jupiter to STACK, SB Energy's IPO roadshow held below a USD 50bn valuation, and the NRC construction permit for TVA's Clinch River BWRX-300; inputs: profile:semianalysis@2026-10-04, profile:nscale@2026-10-05, profile:lambda@2026-10-02, profile:fluidstack@2026-10-05, profile:blue-owl@2026-10-05, profile:sb-energy@2026-10-05, profile:tva@2026-09-29. All-public stamp, so the edition folds to `tracks` — the analyst-visible public-only edition. `reviewBy` 2026-11-15, the mid-November NVIDIA tranche in the Nscale convertible, which is the nearest dated gate among the items.

### Changed

- **No lesson was revised.** `scripts/build-classroom-segments.py --check` reports **15 of 19 segments due, 0 with section changes, 15 pin-only** — every due segment moved only on inputs whose regeneration would rewrite dates and nothing else. Per G3/G4 a source that moved without contradicting a taught claim leaves the lesson untouched, pin included, so no segment was regenerated and no pin advanced. The 15 will re-present next run.

### Notes

```
CLASSROOM PIPELINE — 2026-10-07 — COMMIT
Covered through: 2026-09-21 → 2026-10-07
Sources seen: 353 fetched · 302 unchanged · 51 moved · 0 unknown
Wrote: briefing-2026-10-07 (tracks) — 93 qualifying items across 46 sources, bar is 3/2; nine sections authored from seven of those sources
Skipped at caps: none — one briefing authored against a cap of one; no lesson qualified for revision under G3, so the three-revision cap was not reached
Frozen (unknown source): none
Blocked by: —
Needs the developer:
  - 15 of 19 segment lessons are due pin-only (`build-classroom-segments.py --check`: "0 with section changes, 15 pin-only"); left untouched with pins unmoved per G3, and they will re-present every run until a source contradicts a taught claim
  - the `concepts:profiler-concepts` registry is dated by file commit date (2026-10-05), which marks 52 module lessons due on a whole-file signal that carries no per-entry revision; this is the §10.2 undated-layer decision working as designed, but it is the single largest source of pin-only churn in the due list
  - 9 scenario lessons have a moved `profile:` input and are untouchable by any run under P13 / design D6 (their beats would need re-judging): scenario-aidc-developers-and-landlords-objection ← profile:vantage 2026-09-06→2026-10-05; scenario-capital-objection ← profile:brookfield 2026-09-06→2026-09-26; scenario-epc-and-construction-objection ← profile:turner-construction 2026-09-06→2026-10-04; scenario-hyperscalers-and-ai-labs-discovery ← profile:google 2026-09-07→2026-10-04; scenario-hyperscalers-and-ai-labs-objection ← profile:meta 2026-09-26→2026-10-04; scenario-insurance-and-risk-transfer-objection ← profile:marsh-mclennan 2026-09-09→2026-09-26; scenario-neoclouds-discovery ← profile:fluidstack 2026-10-04→2026-10-05; scenario-utilities-discovery-aidc ← profile:aep 2026-09-03→2026-10-05; scenario-utilities-objection ← profile:dominion-energy 2026-09-03→2026-10-05
  - contract §6.1 and the P4 authoring row still name `Profiler.gs` `guidanceDocs_()` as the read source for `guidance:` module dates, but guidance moved into `Classroom.gs` in Phase 6's C3; this run read the 28 `guidanceDoc*_()` literals in `Classroom.gs` instead. The contract table is stale and only a developer session may correct it (§4.5)
```

Checker results, run after the write and again immediately before the commit (the second run is the one that counts):

- `python3 scripts/check-classroom-content.py` — 72 lesson(s), 8 track(s), 220 gate case(s), **0 errors, 0 warnings**, matching the pre-flight baseline of 0/0 recorded on `main`
- `python3 scripts/check-classroom-pipeline.py --base origin/main` — **0 findings** across P1–P13
- `node --check` on a `.js` copy of `Classroom.gs` — clean; `node scripts/check-gas-inner-scripts.js` — clean
- Pre-flight §5.1: identity `LightAISolutions/Sales`, clean tree, fresh `claude/classroom-pipeline-2026-10-07` off a just-fetched `origin/main` with no pre-existing remote branch of that name; gate-surface digest `sha256:3d09700026…f711a69` equals the ledger's `gateDigest`; schema versions v1/v1
- `Classroom.gs VERSION v02.01g → v02.02g`; `coveredThrough 2026-09-21 → 2026-10-07`; CHANGELOG `Sections: 92/100 → 93/100` (no rotation); Classroom GAS changelog `Sections: 42/50 → 43/50` (no rotation)

## [v07.97r] — 2026-10-06 09:19:00 AM EST

> **Prompt:** "Profiler earnings desk (scheduled): take up to three due rows from the refresh calendar; confirm unconfirmed dates within seven days."

### Changed

- **`profiler-refresh-calendar.json`** — nothing was due. BlackRock's Q3 date confirmed from the company's release notice: Wednesday 2026-10-14, before the open, call 7:30 a.m. ET (was 2026-10-13, unconfirmed). No dossier written.

## [v07.96r] — 2026-10-05 02:32:43 AM EST

> **Prompt:** "give me a prompt to run Section 3 row 13, ERCOT on Fable 5.1 xhigh, then remember session."

The paste-in prompt for §3 row 13, ERCOT (Fable 5.1 xhigh), appended to `phase-f-action-plan.md` as §16. Row 13 now points at it. No dossier, page, GAS or diagram changed.

### Added

- **`repository-information/phase-f-action-plan.md` §16** — the ERCOT prompt, adapted from §15 for the first grid operator. Model line: Fable 5.1 xhigh, the plan's own (§2: the corpus's largest step 7), with §2's Opus fallback if the Fable cap binds. What it adds over §15:
  - **Schema note and category first:** the `grid-operator` category ('Grid operator') and one `PROFILER-SCHEMA.md` note for ERCOT and PJM both, covering `ownership.type`, the `financials` stance (`expected` empty by rule), the default `unassigned[]` seat and the edge convention. It follows the public-power precedent and adds no peer family.
  - **The page change, measured:** four `Profiler.html` edits (`ovSafeCat`, `ovCatLabel`, the CSS tag colour, `OV_REL_CAT_COLORS`), the registry's category order, v01.93w → v01.94w, and a **rotation of `Profilerhtml.changelog.md`, which is at 50/50** (the oldest date group, 2026-08-29, 25 sections). The same bump may fix the "Changed since vN" `undefined` chip found at v07.95r; that is marked optional.
  - **An edge test for a grid operator:** market presence stays the graph's derived evidence. Curated edges are only TDSPs whose large-load work ERCOT studies, ERCOT-procured services, projects named in ERCOT records, and proceedings. They are typed `other` both sides unless ERCOT buys a service, each with an accept that cites the note. It warns that Entergy Texas and Xcel's SPS sit outside ERCOT.
  - **Identity questions:** the entity and its 2021 governance; what ERCOT publishes about its money; SB 6's requirements and their PUCT status; "Batch Zero"; the queue figure with its date and definition; RTC+B; peak and fleet figures.
  - **The `RTO` concept trap:** "grid operator" resolves to a concept that defines FERC-regulated RTOs, and ERCOT is the exception. The guide gets its own glossary entry, and the concept is left unedited.
  - **Inbound counts, re-measured today** (word-bounded, case-sensitive): `\bERCOT\b` 78 dossiers and 1,096 hits against the row's 73, broken down by field, category and heaviest dossier, with a hit-level classification (location, rule claim, relationship, career-only) and a deferral priority (policyExposure claims and the TDSPs first).

### Changed

- **`phase-f-action-plan.md` §3** — row 13 points at §16 and carries the 10/5 count (78) and the rotation; row 14 carries PJM's 10/5 count (48, against 37 planned); the "Prompts for these sessions" paragraph lists §16.
- **README.md** — the action plan's tree description mentions the prompts through §16; timestamp and repo version.
- **`SESSION-CONTEXT.md`** — remember session.

### Notes

- Measured from the corpus, not inferred: 77 of the 78 dossiers have ERCOT hits outside `sources[]`. The `ERCOT`, `SB 6`, `batch study`, `large-load interconnection` and `RTO` concepts already exist and must not be edited. `Classroom.gs` carries 189 ERCOT mentions, which wave C owns.
- CHANGELOG `Sections: 90/100` → 91/100 (no rotation). The developer's reminders were not touched.

## [v07.95r] — 2026-10-04 11:23:08 PM EST

> **Prompt:** "Picking up from my last session, run repository-information/phase-f-action-plan.md §3 row 12 as a fresh
> session: F-I3 — Apollo, Ares and Stonepeak — the last three capital names Phase F adds before Classroom
> wave B. This session runs on Opus 5.5 at xhigh (§2: Apollo's and Ares's 10-Ks are long first-party
> filings to mine, and the §11.3 Model cells already read "Opus 5.5 xhigh" — keep them). Opus draws on the
> shared weekly limit, not the Fable half, and that limit was already at allowed_warning when F-I2 closed
> (seven-day window, resets Sat 10/10 7:00 AM ET) — check Settings → Usage first. If the cap binds
> mid-session, land what is written, record every deferred slug by name in the ledger and the hand-off, and
> stop — never skim a reconciliation to finish.
>
> WHY NOW: no date gate of its own — row 12 follows row 11, which landed at v07.93r. Classroom wave B (§3
> row 15, by Wed 10/14) re-authors landscape-capital-2026-09 and scenario-capital-objection (reviewBy
> 10/14) once, and needs every capital dossier on the record first: the roster is 15 today (9 · 3 · 3) and
> reaches 18 if all three seat. Do NOT run ERCOT or PJM (rows 13–14 follow this one), the
> `profiler Dominion Energy` refresh, or any Classroom wave.
>
> STEP 0 — REBASE FIRST, before any edit: git fetch origin main; git merge-base --is-ancestor origin/main
> HEAD || git rebase origin/main; git fetch --unshallow origin main before any pin read. If the Wednesday
> 10/7 Classroom pipeline run committed before you start, the rebase picks it up. Read the counters after
> the rebase: repository-information/CHANGELOG.md is 89/100 at v07.94r (no rotation expected);
> live-site-pages/gs-changelogs/Classroomgs.changelog.md is 41/50 and Profilergs.changelog.md 40/50.
>
> READ FIRST, in this order: repository-information/SESSION-CONTEXT.md (the F-I2 hand-off);
> phase-f-action-plan.md §2, §3 rows 11–17 and this §15 (§14 is the F-I2 prompt this one adapts, and the
> v07.93r CHANGELOG section is F-I2 as it landed — the latest capital-session pattern);
> PROFILER-COVERAGE-PLAN.md §2, §7, §11.1 (the buying-authority test — an investor passes it through a
> platform it controls and fails it through one it merely funds, lends to or holds a minority of) and
> §11.3 (the three F-I3 rows are yours); .claude/rules/profiler-app.md (Profiler Command — step 1a
> identity, step 5 and its segment sub-rule, step 7 reconciliation; Profiler Prep Command; Scheduled
> Refreshes); repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments registry, Refresh
> calendar); repository-information/PROFILER-STYLES.md (active style). Read softbank, blue-owl,
> blackrock (v2), kkr, cpp-investments (v2), energy-capital-partners and quinbrook as the house pattern for
> an investor that signs for nothing itself, and their registry aka[] lists as the alias pattern. Then the
> dossiers that carry the claims you will test: apex-clean-energy (v1), prime-data-centers (v3) and
> macquarie (v2) for Ares's two covered platforms; x-energy (v1), engie-north-america (v2), sb-energy (v1)
> and softbank (v1) for Ares's other positions; fluidstack (v4), anthropic (v4), exelon (v1),
> stack-infrastructure (v9), blue-owl (v1), flexgen (v7), nscale (v4), nvidia (v13) and xai (v6) for
> Apollo's; dominion-energy (v1) and the Cologix and Montera mentions listed under RECONCILIATION for
> Stonepeak's.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, active style) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/, written skeleton-first and filled by Edit. Proposed slugs:
> apollo, ares, stonepeak; category hypothesis ["investor"] for all three. Populate aka[] BEFORE the
> step-7 grep, on F-I2's rule: an UNCOVERED platform the record puts under the firm's control is an alias
> (softbank lists DataBank and Zayo, kkr ContourGlobal and Zenobē); a COVERED platform is not (Vantage and
> Switch are not in softbank's list) — it takes a reciprocal edge, and the dossiers that name it are its
> own inbound set, not the investor's. Candidates, each to be kept only on the record:
> - Apollo — Apollo Global Management, Inc.; Apollo Asset Management; Athene / Athene Holding; Apollo
>   Infrastructure; Apollo Capital Solutions; Stream Data Centers (if majority-controlled); the European
>   colocation business carved out of STACK in April 2025 (blue-owl and stack-infrastructure record it,
>   "per Apollo") under whatever name it trades as now; and the Broadcom–Apollo–Blackstone chip vehicle or
>   Valor Compute Infrastructure only if the record names either as an Apollo-controlled vehicle. Bare
>   "Apollo" collides: HPE's Apollo servers in coolit, Cipher Mining's Apollo site in cipher-mining.
> - Ares — Ares Management Corporation; Ares Management; Ares Infrastructure and Power; Ares EIF (the
>   former Energy Investors Funds — kwh-analytics uses it); Ares Infrastructure Secondaries; Ares
>   Acquisition Corporation (the terminated X-energy SPAC's sponsor); Ares Japan DC Partners (with CPP);
>   and any data-centre platform that came with the GCP International acquisition, if the 10-K shows one.
>   Apex Clean Energy and Prime Data Centers are covered — reciprocal edges, not aliases. Bare "Ares"
>   collides: delta-electronics names a person, "Ares Chen".
> - Stonepeak — Stonepeak Partners LP; Stonepeak Infrastructure Partners; Cologix; Digital Edge; Montera
>   Infrastructure (only once its ownership is verified as Stonepeak's); AMPYR Distributed Energy; and the
>   Japan BESS platform the row calls "Kingdom", under its legal name — never grep "Kingdom" bare, it
>   returns every "United Kingdom". "AMPYR" may collide too: fluence names AMPYR's Wellington project in
>   Australia; decide whether that is the same group before counting it.
> Assign segments in live-site-pages/profiler-data/profiler-segments.json with a basis line, verified
> against the dossier you wrote and never against the category — hypothesis: all three capital ·
> challenger (§11.2: "second-tier capital, each controlling one real buyer"), unless the dossier records
> control of a buyer at incumbent scale — Apollo through Stream is the candidate; decide on the record. An
> adjacent seat elsewhere only where the dossier records the firm itself developing or operating (the
> Quinbrook precedent, row 6), never through a platform that holds a seat of its own. Then the registry
> sync, the graph build, a calendar row per company (Apollo, NYSE APO, and Ares, NYSE ARES, are listed —
> take each Q3 2026 results date from its own IR site and mark it unconfirmed until announced; Stonepeak
> is private and gets a cadence row), README tree entries, and rewrite and flip your §11.3 rows with a
> premise verdict per clause.
>
> IDENTITY (step 1a) — establish each of these, do not assume it; rows 6, 7, 8 and 11 each found all three
> of their plan rows wrong somewhere:
> - Apollo: the registrant (Apollo Global Management, Inc., NYSE APO — the FY2025 10-K and the Q2 2026
>   10-Q) and how Athene sits inside it since the January 2022 merger: the segment split says which
>   balance sheet funds what. Stream Data Centers — the date, the share (majority or minority) and the
>   powered-land figure ("Nov 2025; 4 GW+", per the row) from Apollo's and Stream's own releases; exelon v1
>   carries Stream's Elk Grove Village campus (260 MW, ComEd substation). The Anthropic–Stream ~1 GW lease
>   is The Information's report of 23 September (fluidstack v4): carry it as reported and unconfirmed
>   unless a party has announced it. The Broadcom–Apollo–Blackstone chip vehicle for Anthropic (June
>   2026, reported at about USD 35bn in fluidstack and anthropic): who announced it, Apollo's role
>   (equity, debt or arranger), and whether the figure is a commitment, a facility size or an asset value.
>   The xAI / Valor GPU financing: Apollo's role and amount from its own release — xai v6 names neither
>   Apollo nor Valor, so either an edge is missing or the row is wrong. The NVIDIA memoranda of 10 August
>   2026 are memoranda, not transactions. The STACK European carve-out (April 2025): closed or signed,
>   and its current name. FlexGen's USD 150m (2021) and Nscale's convertible: investor and lender
>   positions, not control; state each one's current status.
> - Ares: the registrant (Ares Management Corporation, NYSE ARES — FY2025 10-K, Q2 2026 10-Q). Apex Clean
>   Energy — majority-owned since November 2021 by Ares Infrastructure and Power funds (apex-clean-energy
>   v1) — and the minority stake Infralogic reported on 4 December 2025 as marketed through Lazard: sold,
>   signed or still marketed? Prime Data Centers — EC case M.11843 records Ares joining the Macquarie /
>   Data Realty Group joint control, and macquarie v2 records Macquarie's FY26 exit: who controls Prime
>   now, on what record. Vantage's "USD 2.4B facility (Feb 2026)" — arranger, lender or neither; vantage
>   v10 does not name Ares at all. SB Energy — softbank v1 says Ares holds preferred equity redeemed at the
>   IPO and sb-energy v1 does not name Ares: read the S-1 and correct whichever dossier is wrong or
>   incomplete, minimally. X-energy — x-energy v1 records Ares affiliates at 4.9% of Class A and 20.5% of
>   Class B: what that is in votes, and whether a board right goes with it. ENGIE North America's 49%
>   interests (905 MW, March 2025; 730 MW, January 2026) are non-controlling on ENGIE's own account —
>   state them so.
> - Stonepeak: private — there is no 10-K. The record is its own site and releases, its Form ADV (Parts 1
>   and 2A on adviserinfo.sec.gov — an SEC host, so SEC_USER_AGENT applies), its funds' Form D filings and
>   its counterparties' filings. Establish the adviser entity, headquarters and AUM as of a date; then the
>   share and a source for each platform: Cologix, Digital Edge, Montera Infrastructure (is it Stonepeak's
>   at all?), AMPYR Distributed Energy (22 September 2026 — signed or closed, and what it buys), the Japan
>   BESS platform under its real name, and CVOW — dominion-energy v1 records a 50% noncontrolling interest
>   bought in October 2024, with Stonepeak funding 48% of the remaining capital. Dominion builds and
>   operates CVOW, so on that asset Stonepeak fails §11.1 test 2 however large the cheque.
> - For all three: list the platforms each controls or co-controls that sign for batteries, MV gear,
>   generation or SSTs (§11.1 test 2), with the ownership share and a source for each, and keep them apart
>   from lending, preferred equity, minority stakes and fund commitments. None of the three is expected to
>   buy equipment itself; if one does, its productsAndServices and decision makers say so.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. Verify every clause against first-party sources
> (filings and results releases from each company's own IR site, counterparties' filings and releases,
> regulator records), record a premise verdict per clause, and rewrite the cells. sec.gov answers 200 to
> the SEC_USER_AGENT string the probe sends since v07.68r — run check-source-reachability.py before
> planning Stage 2 and say what it read. Every request to any *.sec.gov host, a subagent's included, goes
> through curl with that exact string read from scripts/check-source-reachability.py. WebFetch cannot
> send it — in F-I2 one subagent fetched sec.gov through WebFetch with the default User-Agent — so say
> this in every subagent brief.
>
> RECONCILIATION (step 7) — measured 2026-10-04 by word-bounded grep of the current corpus (the plan rows
> say 10 / 8 / 2). \bApollo\b matches 14 dossiers: anthropic, blackrock, blackstone, blue-owl, brookfield,
> cipher-mining, coolit, flexgen, fluidstack, kkr, mgx, nscale, nvidia and stack-infrastructure. On a
> first read, coolit's hit is HPE's Apollo servers and cipher-mining's is Cipher's Apollo site
> (collisions), and mgx's is a hire from Apollo (career-only). \bAres\b matches 11: apex-clean-energy,
> blackstone, cpp-investments, delta-electronics, engie-north-america, kwh-analytics, macquarie,
> prime-data-centers, quinbrook, softbank and x-energy; delta-electronics' hit is "Ares Chen", a person.
> \bStonepeak\b matches 2: blackstone (a fundraising ranking) and dominion-energy (CVOW).
> The platform names widen the sets. Stonepeak: \bCologix\b 6 (aep, cyrusone, lambda, mitsubishi-electric,
> stack-infrastructure, tract); \bMontera\b 3 (cipher-mining, compass-datacenters, galaxy-digital — all
> three from one Texas governor's list); AMPYR 1 (fluence, possibly a different AMPYR). Apollo: "Stream
> Data Centers" 2 (exelon, fluidstack). The dossiers that name Apex Clean Energy (11) or Prime Data Centers
> are those companies' inbound sets, not Ares's. Grep again with the full aka[] and read every hit against
> the pre-revision copies; classify career-only mentions and collisions. Add the reciprocal edge wherever
> a new dossier curates a counterparty, revising that dossier under the Archival Procedure. Re-verify a
> report pin on it only when your change is edge-only — every pre-existing field identical to the archived
> copy and every cited source unchanged, checked mechanically as F-I2 did; when the change is substantive,
> leave the pin loud and write down why. Expect about thirty substantive reads across the three. If the
> sets outgrow the session: land all three dossiers and guides; reconcile the controlled and co-controlled
> platforms first (apex-clean-energy, prime-data-centers, dominion-energy, and Stream's and Cologix's
> mentions); record every remaining slug by name as deferred.
>
> TWO KNOWN CORRECTIONS RIDE THE STEP 7: (1) sb-energy or softbank on Ares's preferred equity, as above.
> (2) dominion-energy v1 takes the reciprocal Stonepeak edge, and row 10 (v07.91r) verified that it still
> calls the NextEra merger "all-stock". The May 2026 merger 8-K says 0.8138 NextEra shares plus a pro rata
> share of USD 360 million in cash, and the dossier's relationships[8] already carries the cash. Since you
> revise it anyway, correct that line minimally from the 8-K and record it. That makes the revision
> substantive, so leave its pins loud. The full refresh stays with `profiler Dominion Energy`.
>
> LESSONS FROM ROWS 5–11 — apply them:
> - Every counterparty named in prose rests on a source in sources[].
> - A tender, an MOU, "in talks", a marketed stake or a signed-but-not-closed deal is not a completed
>   transaction: type each on the record's own word and state the gap.
> - A press identification of an unnamed party is carried as reported and unconfirmed; an unattributed
>   figure is stated as unverified.
> - An equity cheque, an enterprise value, a fund commitment and a facility size are four different
>   numbers: state each as itself.
> - Lender and indirect links are typed `other` on both sides (the F-I1 and F-I2 precedent).
> - Count inbound hits against the archive copies, so the ledger's counts are exact.
> - Do not edit an existing concept in profiler-concepts.json; check new terms and aliases for collisions
>   before adding them.
> - If an existing study guide contradicts a verified finding, correct it minimally and record it.
> - Write any JSON or shell text containing `$` only through files or quoted heredocs (<<'EOF'). In F-I2 an
>   unquoted heredoc turned `$4` and `$1` into empty strings in a draft dossier.
>
> THE STEP-5 SUB-RULE (developer-approved 2026-09-30): the three memberships make the generated segment
> lessons stale, and the weekly Classroom pipeline may not regenerate them. After the registry writes,
> run python3 scripts/build-classroom-segments.py --check and regenerate exactly the segments it lists
> with sections differing (`--segment <id>` each, or `--all` when every one differs). Expect capital at
> least, plus any segment an adjacent seat lands in. Leave pin-only segments alone (G3): on 10/4 the
> --check listed assurance, software-and-optimization and insurance-and-risk-transfer as due, all three
> pin-only. Never edit a segment-* lesson, a landscape, a scenario or anything else in Classroom.gs by
> hand. Then bump Classroom.gs VERSION v02.00g → v02.01g and
> live-site-pages/gs-versions/Classroomgs.version.txt → |v02.01g| together, add one generic line to
> Classroomgs.changelog.md ("Market-structure lessons updated with the latest company coverage"; 41/50,
> no rotation), and set the README tree's Classroom display to v02.01g (scripts/check-readme-tree.py, 0
> findings). The Classroom page and Profiler.gs are not touched. landscape-capital-2026-09 and
> scenario-capital-objection stay stale by design — they are wave B's. Say so in the CHANGELOG entry and
> the hand-off (§11.2, the landscape coupling), and set §3 row 15's roster count to what you seat.
>
> FOR THE MEGMEET JOB: in the hand-off, one short paragraph on which platforms these three control or
> co-control that buy medium-voltage or DC power equipment (SSTs, 800 VDC, HVDC, batteries, gas turbines)
> — Stream Data Centers (Apollo); Prime Data Centers and Apex Clean Energy (Ares); Cologix, Digital Edge,
> Montera, AMPYR and the Japan BESS platform (Stonepeak) — and who signs at each. Test F-I2's finding
> against them: capital was a door only at SB Energy, which owner-furnishes its own transformers,
> switchgear and inverters; everywhere else it was a directory to the buyers.
>
> VERIFY: check-source-reachability.py before Stage 2; sync-profiler-registry.py --check clean (211 → 214
> in bijection, calendar included); build-profiler-graph.py; check-profiler-study.py,
> check-profiler-relationships.py and check-profiler-crossrefs.py clean (accept reviewed candidates with a
> reason); check-profiler-reports.py warnings read; check-classroom-content.py 0 errors after the
> regeneration (71 lessons / 8 tracks / 220 gate cases on 10/4); node --check on a .js copy of
> Classroom.gs; check-readme-tree.py 0 findings; every new and revised dossier and guide renders under
> Playwright with zero page errors other than the sandbox's gis_load_failed (the guide overlay closes with
> its ✕ button, not Escape). Normal Pre-Commit and Pre-Push checklists; ONE commit; push on your claude/*
> branch once git ls-remote shows it absent. Flip §3 row 12 to landed in the pattern of rows 1–11, write
> the CHANGELOG section with this prompt verbatim as the blockquote, and remember session.
>
> NEVER: edit a Classroom lesson, landscape or scenario by hand; state an equity cheque as an enterprise
> value, or a facility size as money lent, or the reverse; name a deal closed on a press report alone; take
> a fund commitment, a loan or a minority stake as control; run the Dominion refresh beyond the one-line
> correction; close or edit the developer's reminders.
>
> At the end: one line per company (identity verdicts, segments and roles, inbound read/revised counts,
> calendar row); the two known corrections as made; the segments regenerated and the Classroom version
> written; the --check and content-checker final lines; and the session's cost from get_session's
> usage.cost_usd if it exposes one, with the rate-limit status."

§3 row 12, F-I3: three new capital dossiers (`apollo`, `ares`, `stonepeak`), each with a v2 study guide and a lesson plan, identity-verified from first-party records (every `*.sec.gov` request, Form ADV on adviserinfo.sec.gov included, through curl with `SEC_USER_AGENT`). 23 inbound dossiers revised under the Archival Procedure, 10 substantively, including the two known corrections. Four segment lessons regenerated (Classroom v02.01g). `landscape-capital-2026-09` and `scenario-capital-objection` stay stale by design — they are wave B's (§3 row 15; §11.2's landscape coupling), and the `capital` roster wave B seats is now 18 (11 incumbents · 4 challengers · 3 adjacent).

### Added

- **`live-site-pages/profiler-data/apollo.profile.json`** (schema v7, profileVersion 1, intel-briefing; 42 sources) — Apollo Global Management, Inc. (NYSE: APO; Athene a subsidiary since the January 2022 merger). Its funds control Stream Data Centers (majority, closed 3 Nov 2025; more than 4 GW of powered land), Vaultica (STACK's former European colocation business), PowerGrid Services and, pending, Eagle Creek. Apollo leads the **USD 35bn initial tranche** of Broadcom's AI XPV Platform — a commitment drawn over years, with an Apollo-managed purchaser fund, Athene guaranteeing 15% and Broadcom's ~USD 29bn backstop, each stated as itself — and led a USD 3.5bn financing of Valor's USD 5.4bn GB200 lease to an xAI subsidiary. Hornsea 3 and the TotalEnergies Texas portfolio are 50% stakes their partners operate. The Anthropic–Stream lease is carried as reported.
- **`ares.profile.json`** (profileVersion 1; 43 sources) — Ares Management Corporation (NYSE: ARES). Owns **Ada Infrastructure** outright (with GCP International, March 2025; over 1 GW of campuses in flight); its funds control Apex Clean Energy and 80% of an EDPR California solar-and-battery portfolio; joint control of Plenitude from 1 Oct 2026. Elsewhere minority, preferred or lender: ENGIE and EDPR portfolios, SB Energy's parent (preferred, redeemed at the IPO), X-energy (~10% of the vote by our calculation), Vantage (arranged a USD 2.4bn facility, holds ~USD 1.6bn, funded ~USD 330m). Prime Data Centers: joint control cleared in March 2025, unsettled since Macquarie's exit.
- **`stonepeak.profile.json`** (profileVersion 1; 56 sources) — Stonepeak Partners LP, private: Form ADV USD 81.9bn regulatory AUM (7 Apr 2026). Controls or created Cologix (USD 3.0bn equity-value recap, 2022), Digital Edge, Montera (PHX1, 500 MW) and **Kingdom BESS Development** (479 MW in Japan, CATL at Mimasaka). Its largest power cheques sit beside operators: 50% of CVOW (Dominion operates; fails test 2 there) and 40% of Louisiana LNG. Cleco and Castrol are signed, not closed; AMPYR Distributed Energy is announced, stake undisclosed.
- **Study guides** `apollo.study.json` (14 sections), `ares.study.json` (13), `stonepeak.study.json` (14) at schema v2, with concept-only flashcards and quizzes; **lesson plans** under `repository-information/study-prep/{apollo,ares,stonepeak}/`, written skeleton-first.
- **Six concepts** in `profiler-concepts.json`, collision-checked: spread-related earnings, asset-based finance, carrier-neutral data centre, long-term decarbonization auction, merger control, fund commitment. No existing concept edited.
- **25 company-published executive photos** (Apollo 11, Ares 10, Stonepeak 4) in `live-site-pages/images/execs/`.
- **Registry, segments, calendar** — three `profiler-companies.json` entries with `aka[]` populated before the step-7 grep on F-I2's rule (uncovered controlled platforms in; covered platforms out, as are `Peak Energy` and `ACRA` (collisions), `TierPoint` (unverified) and the pending `Cleco` and `Eagle Creek`). Segments: Apollo and Stonepeak `capital` **incumbents** on the record, Ares `capital` **challenger** plus `aidc-developers-and-landlords` **adjacent** for Ada. Calendar: Apollo 3 Nov and Ares 29 Oct, both confirmed by the companies' own releases; Stonepeak a quarterly cadence row, core tier.

### Changed

- **Step 7 — 38 dossier hits by the full `aka[]` grep (Apollo 15 · Ares 12 · Stonepeak 11; 34 distinct)**, read against the pre-revision copies. Apollo: 2 collisions (`coolit`, `cipher-mining`), 1 career-only (`mgx`), 3 accurate (`blackrock`, `brookfield`, `kkr`), 9 revised, plus `xai` for the Valor edge it never carried. Ares: 1 collision (`delta-electronics`), 1 source label (`blackstone`), 3 accurate (`habitat-energy`, `kwh-analytics`, `quinbrook`), 7 revised, plus `sb-energy` and `vantage`. Stonepeak: 8 accurate or career-only (`blackstone`, `cipher-mining`, `compass-datacenters`, `galaxy-digital`, `cyrusone`, `lambda`, `mitsubishi-electric`, `stack-infrastructure`), 3 revised, plus `blue-owl`, `catl`, `cpp-investments` and `macquarie`. `fluence`'s AMPYR is AMPYR Australia, a sister company, not a Stonepeak platform.
- **The two known corrections** — (1) `softbank` v2: Ares's preferred sits in SBE Global and dates from 2022, not a recent addition; `sb-energy` v2 gains the S-1's Ares preferred (USD 800m issued, ~USD 996m liquidation preference, redeemed at the IPO) and the edge. (2) `dominion-energy` v2: three "all-stock" lines corrected from the May 2026 merger 8-K (0.8138 NextEra shares plus a pro rata share of USD 360m in cash per share) and the reciprocal Stonepeak edge added; substantive, so its pins stay loud. The full refresh stays with `profiler Dominion Energy`.
- **Other substantive corrections** — `anthropic` v5 and `fluidstack` v5: the XPV vehicle rewritten from the joint release and both 10-Qs, and the press-only caveat removed. `blackstone` v3: "reported as a participant" → confirmed co-anchor. `blue-owl` v2 and `stack-infrastructure` v10: the STACK colocation carve-out recorded as completed and trading as Vaultica. `engie-north-america` v3: "49%" is on no ENGIE record, so it now reads "minority stake"; the 905 MW and US$430m are confirmed by ENGIE SA's 2025 annual report (Note 16.2.4), now cited. `tract` v5: van Rooyen's Cologix "USD 1.4bn in 2017 and USD 4bn in 2022" → undisclosed 2017 price, USD 3.0bn equity value in 2022.
- **Edge-only revisions** — `nvidia` v14, `xai` v7, `flexgen` v8, `nscale` v5, `exelon` v2, `apex-clean-energy` v2 (text-level edit; the file has no round-trip format), `prime-data-centers` v4, `x-energy` v2, `vantage` v11, `cpp-investments` v3, `macquarie` v3, `aep` v4, `catl` v8. 23 archive files written, and `archive-index.json` updated.
- **Study guides corrected minimally** — `dominion-energy.study.json` ("all-stock"), `engie-north-america.study.json` ("49%", twice), `anthropic.study.json` and `fluidstack.study.json` (the XPV vehicle "per press" → first-party); lesson plans `engie-north-america` and `anthropic` likewise.
- **Report pins** — 6 edge-only revisions re-verified in `report-pins-verified.json` (`aep`, `vantage`, `xai` on named-project-bess-attach; `flexgen` and `catl` on grid-scale-bess; `catl` on s154), each checked mechanically against its archive copy. `anthropic` and `stack-infrastructure` are left loud because their changes are substantive. 11 relationship accepts (lender, indirect and seller–buyer links typed `other` on both sides) and 1 crossref accept (Dominion's 48% of CVOW's remaining capital against Stonepeak's 40% of Louisiana LNG — different things).
- **Classroom (step-5 sub-rule)** — `build-classroom-segments.py --check` listed 19 due: the **4 with section changes regenerated** (`capital`, `aidc-developers-and-landlords`, `storage-developers-and-ipps`, `utilities`), dated `--today 2026-10-05` so no lesson predates its inputs; 15 pin-only left alone (G3). `Classroom.gs` v02.00g → v02.01g with `Classroomgs.version.txt`, one generic GAS changelog line (41/50 → 42/50) and the README display. No lesson, landscape or scenario edited by hand; the Classroom page and Profiler.gs untouched.
- **`PROFILER-COVERAGE-PLAN.md`** — the three §11.3 F-I3 rows rewritten with a verdict per clause and flipped (Dossier v1 · Guide v2); §11.2 row 10 marked landed. **`phase-f-action-plan.md`** — §3 row 12 landed; row 15's `capital` roster set to 18 (11 · 4 · 3).
- **README.md** — tree entries for the six new data files, three study-prep directories and 23 archive files; timestamp and repo version.
- **`SESSION-CONTEXT.md`** — remember session, with the Megmeet paragraph.

### Notes

- Checkers: `check-source-reachability.py` OK (sec.gov and data.sec.gov 200); `sync-profiler-registry.py --check` 0 of 214 out of sync, roster and calendar in bijection; `build-profiler-graph.py` 2,010 edges (1,501 curated); relationships 0 findings (36 accepted); crossrefs 0 candidates (21 accepted); study 214 guides + 1,615 concepts, 0 errors; reports 0 errors, 9 warnings read (`anthropic` and `stack-infrastructure` loud by design, the rest pre-existing); `check-classroom-content.py` 71 lessons / 8 tracks / 220 gate cases, 0 errors; `node --check` on a `.js` copy of `Classroom.gs` and `check-gas-inner-scripts.js` clean; `check-readme-tree.py` 0 findings.
- Playwright: all 26 new and revised dossiers render on `Profiler.html` as admin with no page error other than the sandbox's `gis_load_failed`, and the seven new or corrected guides open and close with ✕. **Pre-existing renderer bug found, not fixed** (`Profiler.html` is out of scope): the computed "Changed since vN" strip shows an "undefined" chip whenever a revision touches overview fields, because `OV_DIFF_TABS` keys the group `overview` while the style label maps key it `snapshot`. It reproduces on `iren` and `abb`, which F-I2 revised.
- Plan-row and prompt facts corrected on the record: Ares's ENGIE stakes have no published percentage; "GCP" is GLP Capital Partners; Cologix's 2022 recap was USD 3.0bn, not 4bn; the Japan BESS platform is Kingdom BESS Development; Vantage's facility was arranged and partly held by Ares; Prime's current control is unsettled.
- No slug deferred. The weekly limit stayed at `allowed_warning` (seven-day window, no overage; resets Sat 10/10 7:00 AM ET). The developer's reminders were not touched.
- CHANGELOG `Sections: 89/100` → 90/100 (no rotation).

## [v07.94r] — 2026-10-04 09:40:01 PM EST

> **Prompt:** "Write the §3 row 12 prompt for F-I3 (Apollo, Ares, Stonepeak; Opus 5.5 xhigh), using §14 as its pattern"

The paste-in prompt for §3 row 12, F-I3 (Apollo, Ares, Stonepeak), appended to `phase-f-action-plan.md` as §15. Row 12 now points at it.

### Added

- **`repository-information/phase-f-action-plan.md` §15** — the F-I3 prompt. Model line: Opus 5.5 xhigh, the plan's own, because Apollo's and Ares's 10-Ks are long first-party filings. It follows §14's structure section for section. It adds what F-I2 taught:
  - **The alias rule.** Only uncovered controlled platforms go in `aka[]`, as in `softbank`'s list (DataBank and Zayo in, Vantage and Switch out). Covered platforms (`apex-clean-energy`, `prime-data-centers`) take reciprocal edges, and the dossiers that name them stay their own inbound sets.
  - **F-I2's two process slips.** An unquoted heredoc expanded `$` amounts, so `$` content goes only through files or `<<'EOF'`. A subagent fetched sec.gov through WebFetch, which cannot send `SEC_USER_AGENT`, so every `*.sec.gov` request goes through curl, Form ADV on adviserinfo.sec.gov included.
  - **Inbound counts, re-measured today** by word-bounded grep against the §11.3 rows' 10 / 8 / 2:
    - `\bApollo\b` 14 dossiers: coolit and cipher-mining are collisions (HPE's Apollo servers, Cipher's Apollo site) and mgx's hit is career-only.
    - `\bAres\b` 11: delta-electronics' hit is a person.
    - `\bStonepeak\b` 2.
    - Platform names: `\bCologix\b` 6 and `\bMontera\b` 3 widen Stonepeak's set, and "Stream Data Centers" 2 adds to Apollo's.
  - **Identity questions per company**, each tied to the dossier that carries the claim:
    - Apollo: Stream's share and date; the Anthropic–Stream lease as reported; the Broadcom–Apollo–Blackstone vehicle's figure type; the xAI / Valor financing, which `xai` v6 does not record; the STACK European carve-out.
    - Ares: the Apex minority-stake sale; who controls Prime after Macquarie's exit; the Vantage facility, which `vantage` v10 does not record; SB Energy's preferred equity; X-energy's voting stake.
    - Stonepeak: private, so Form ADV and counterparties' filings; Cologix, Digital Edge, Montera (ownership unverified), AMPYR, the Japan BESS platform, and CVOW, which is noncontrolling and fails §11.1 test 2.
  - **Two corrections the step-7 pass is to make:**
    - Ares's SB Energy preferred equity: `softbank` v1 records it and `sb-energy` v1 does not.
    - `dominion-energy` v1's "all-stock" description of the NextEra merger, which row 10 found wrong: a minimal fix from the May 2026 merger 8-K, pins left loud, the full refresh left to `profiler Dominion Energy`.
  - **The step-5 sub-rule at today's baselines:** Classroom GAS v02.00g → v02.01g; Classroomgs changelog 41/50; 71 lessons / 8 tracks / 220 gate cases; registry 211 → 214; `capital` 15 → up to 18.
  - **The Megmeet hand-off paragraph**, testing F-I2's "capital is a door only at SB Energy" against these three firms' platforms.

  It forbids ERCOT, PJM, the Dominion refresh and any Classroom wave.

### Changed

- **`phase-f-action-plan.md`** — §3 row 12's Session cell points at §15. Its Why cell now names both 10-K filers and Stonepeak's private record, the covered ties (`apex-clean-energy`, `prime-data-centers`, `dominion-energy`) and the re-measured counts. The "Prompts for these sessions" paragraph adds §15.
- **README.md** — timestamp and repo version.

### Notes

- No dossier, page, GAS or diagram changed, and no inbound count was written into a dossier or the ledger: the §11.3 rows stay the F-I3 session's to rewrite.
- Not verified here: Montera Infrastructure's ownership, the Japan BESS platform's legal name, and whether fluence's AMPYR is Stonepeak's AMPYR. The prompt leaves each to the session's identity check.
- CHANGELOG `Sections: 88/100` → 89/100 (no rotation). The developer's reminders are untouched.

## [v07.93r] — 2026-10-04 08:54:32 PM EST

> **Prompt:** "Picking up from my last session, run repository-information/phase-f-action-plan.md §3 row 11 as a fresh
> session: F-I2 — SoftBank Group, SB Energy and Blue Owl — the three capital-and-developer names the
> corpus cites most and does not yet cover. This session runs on Opus 5.5 at xhigh (§2: SB Energy's S-1 is
> a long first-party record to mine, and the §11.3 Model cells already read "Opus 5.5 xhigh" — keep
> them). Opus draws on the shared weekly limit, not the Fable half; check Settings → Usage first. If the
> weekly cap binds mid-session, land what is written, record every deferred slug by name in the ledger and
> the hand-off, and stop — never skim a reconciliation to finish.
>
> WHY NOW: the gate was the DigitalBridge close. Trade press (DCD, Mobile Europe) reports SoftBank
> completed the ~USD 3.1bn take-private on 30 September 2026 and DigitalBridge delisted from the NYSE —
> VERIFY THAT FIRST from DigitalBridge's completion Form 8-K (CIK 1679688) or SoftBank's own release,
> dated, before any research prompt is written; then write SoftBank's dossier once, with the close as a
> fact and DigitalBridge's platforms as controlled platforms. Classroom wave B (§3 row 15, by Wed 10/14)
> re-authors landscape-capital-2026-09 and scenario-capital-objection (reviewBy 10/14) and needs both
> capital dossiers on the record first. Do NOT run F-I3 (Apollo, Ares, Stonepeak — row 12 follows this
> one), ERCOT, PJM, or any Classroom wave.
>
> STEP 0 — REBASE FIRST, before any edit: git fetch origin main; git merge-base --is-ancestor origin/main
> HEAD || git rebase origin/main; git fetch --unshallow origin main before any pin read. Read the
> counters after the rebase: repository-information/CHANGELOG.md is 87/100 at v07.92r (sections dated the
> push day are exempt; no rotation expected); live-site-pages/gs-changelogs/Classroomgs.changelog.md and
> Profilergs.changelog.md are both 40/50.
>
> READ FIRST, in this order: repository-information/SESSION-CONTEXT.md (the row 10 hand-off);
> phase-f-action-plan.md §2, §3 rows 11–17 and this §14 (§6 is the F-I1 prompt this one adapts, and the
> v07.66r CHANGELOG section is F-I1 as it landed — the capital-session pattern); PROFILER-COVERAGE-PLAN.md
> §2, §7, §11.1 (the buying-authority test — an investor passes it through a platform it controls and
> fails it through one it merely funds) and §11.3 (the three F-I2 rows are yours; the DigitalBridge line
> under "Not covered" says "covered through SoftBank (F-I2)"); .claude/rules/profiler-app.md (Profiler
> Command — step 1a identity, step 5 and its segment sub-rule, step 7 reconciliation; Profiler Prep
> Command; Scheduled Refreshes); repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments
> registry, Refresh calendar); repository-information/PROFILER-STYLES.md (active style). Read blackrock,
> kkr, cpp-investments, energy-capital-partners and quinbrook (the five capital dossiers written in Phase
> F) as the house pattern for an investor that signs for nothing itself; mgx and openai for Stargate;
> vantage (v9) and switch — DigitalBridge's two covered platforms, which now take a reciprocal investor
> edge; stack-infrastructure (v8) — IPI's, hence Blue Owl's; meta (v10), crusoe (v7), iren (v7), oracle
> (v6) and aep (v2) — they carry the Hyperion, Abilene, IREN, Jupiter and PORTS claims you will test.
> `project:stargate` is an entry in profiler-projects.json; link through it, never by a new project.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, active style) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/, written skeleton-first and filled by Edit. Proposed slugs:
> softbank, sb-energy, blue-owl. Category hypotheses: ["investor"] for softbank and blue-owl,
> ["developer"] for sb-energy. Populate aka[] BEFORE the step-7 grep — SoftBank Group Corp., SoftBank
> Vision Fund / SVF, SB Investment Advisers, DigitalBridge and whichever of its platforms the record puts
> under SoftBank's control, Arm, Ampere, and decide whether the listed telco SoftBank Corp. is an alias
> or a distinct subject; for Blue Owl — Blue Owl Capital Inc., Blue Owl Real Estate (formerly Oak
> Street), IPI Partners / IPI, Blue Owl Digital Infrastructure, Dyal, Owl Rock, and the JV vehicles the
> filings name (Beignet Investor for Hyperion); for SB Energy — the S-1 registrant's legal name, SB Energy
> Global and its project entities. Assign segments in live-site-pages/profiler-data/profiler-segments.json
> with a basis line, verified against the dossier you wrote and never against the category — hypotheses:
> softbank capital · incumbent; blue-owl capital · incumbent or challenger (decide on the record; the
> segment holds thirteen members today, 7 · 3 · 3); sb-energy aidc-developers-and-landlords · challenger
> and storage-developers-and-ipps · adjacent. Then the registry sync, the graph build, a calendar row per
> company (SoftBank Group, TSE 9984, and Blue Owl, NYSE OWL, are listed — take each next results date from
> its own IR site and mark it unconfirmed until announced; SB Energy gets a cadence row unless it has
> listed, in which case its row follows the 424B4), README tree entries, and rewrite and flip your §11.3
> rows with a premise verdict per clause.
>
> IDENTITY (step 1a) — establish each of these, do not assume it; every one of rows 6, 7 and 8 found all
> three of its plan rows wrong somewhere:
> - SoftBank: the registrant (SoftBank Group Corp., TSE 9984, its FY ends 31 March — the latest annual
>   report and the Q1 FY2026 results of August); the DigitalBridge completion date, consideration and
>   the governance DigitalBridge keeps (the press says Ganzi stays and the platform is "separately
>   managed" — read the 8-K, not the press); which DigitalBridge platforms (Vantage, Switch, DataBank,
>   Zayo, Landmark) are controlled rather than fund-managed, with the share and a source for each;
>   SoftBank's Stargate position (the January 2026 and later releases — equity funder, operating
>   partner, or both) and its OpenAI stake after the 2025–2026 rounds; Arm's ownership share.
> - SB Energy: the S-1 cover (legal name, state, proposed ticker and exchange), whether the IPO has
>   PRICED OR LISTED since 1 September 2026 (EDGAR: 424B4, 8-A12B, or an amended S-1 with a date), who
>   owns it pre- and post-IPO (SoftBank Group's share), and the one operating fact the plan row rests
>   on — the PORTS campus in Pike County, Ohio (≥9.2 GW of gas on AEP Ohio's 765 kV, per the row) — read
>   off the S-1 and AEP's record, not the row.
> - Blue Owl: Blue Owl Capital Inc. (NYSE: OWL) and its Q2 2026 10-Q; the IPI acquisition date and what
>   it brought (STACK's ownership); the Hyperion JV (80 per cent via Blue Owl-managed funds, ~USD 27bn —
>   read Meta's and Blue Owl's own releases); the Crusoe Abilene JV (1.2 GW); Project Jupiter in New
>   Mexico and what Oracle's 24 September force-majeure notice actually said and to whom; the USD 2.4bn
>   IREN financing of 28 August (read iren v7 and the IREN release); and the share price claim ("~USD 9,
>   down more than 45% in a year") — state it dated or drop it.
> - For all three: list the platforms each controls or co-controls that sign for batteries, MV gear,
>   generation or SSTs (§11.1 test 2), with the ownership share and a source for each. SB Energy is the
>   one direct buyer among the three — substations, gas turbines, solar and batteries — so its
>   productsAndServices and technicalSpecs carry the equipment record, and its decision makers are the
>   people who sign.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. Verify every clause against first-party sources
> (filings and results releases from each company's own IR site, counterparties' filings and releases,
> regulator records), record a premise verdict per clause, and rewrite the cells. sec.gov answers 200 to
> the SEC_USER_AGENT string the probe sends since v07.68r — run check-source-reachability.py before
> planning Stage 2 and say what it read; every subagent request to sec.gov sends that exact string.
>
> RECONCILIATION (step 7) — measured 2026-10-04 by word-bounded grep of the current corpus (the plan rows
> say 9 / 0 / 9): \bSoftBank\b matches 12 dossiers (lambda, whiting-turner, mgx, oracle, anthropic,
> cipher-mining, bytedance, g42, nvidia, abb, form-energy, openai), \bSB Energy\b 4 (aep, stem,
> solv-energy, openai), \bBlue Owl\b 15 (nscale, kkr, energy-capital-partners, clayco, mgx, meta, entergy,
> iren, powerhouse-data-centers, blackrock, brookfield, dte-energy and three more), and \bDigitalBridge\b
> 10 (kkr, tract, mgx, blackstone, vantage, blackrock, edgecore, switch, brookfield,
> stack-infrastructure) — the last group is SoftBank's inbound set now. Grep again with the full aka[]
> and read every hit against the pre-revision copies; classify career-only mentions and collisions ("SB"
> alone collides; "Vision Fund" is SoftBank's but a Vision Fund stake is not control). Add the reciprocal
> edge wherever a new dossier curates a counterparty, revising that dossier under the Archival Procedure
> and re-verifying any report pin on it only when your change is edge-only; when it is substantive, leave
> the pin loud and write down why. Expect about forty substantive reads across the three; if SoftBank's
> set outgrows the session, land all three dossiers and guides, reconcile Blue Owl and SB Energy in full
> and SoftBank's controlled platforms first, and record every remaining slug by name as deferred.
>
> LESSONS FROM ROWS 5–8 — apply them: every counterparty named in prose rests on a source in
> sources[]; a tender, an MOU, "exclusive talks" or a signed-but-not-closed deal is not a completed
> transaction — type each on the record's own word and state the gap; a press identification of an
> unnamed party is carried as reported and unconfirmed; an unattributed figure is stated as unverified;
> count inbound hits against the archive copies so the ledger's counts are exact; do not edit an existing
> concept in profiler-concepts.json, and check new terms and aliases for collisions before adding them;
> if an existing study guide contradicts a verified finding, correct it minimally and record it.
>
> THE STEP-5 SUB-RULE (developer-approved 2026-09-30): the three memberships make the generated segment
> lessons stale, and the weekly Classroom pipeline may not regenerate them. After the registry writes,
> run python3 scripts/build-classroom-segments.py --check and regenerate exactly the segments it lists
> with sections differing (`--segment <id>` each, or `--all` when every one differs) — expect capital,
> aidc-developers-and-landlords and storage-developers-and-ipps at least; leave pin-only segments alone
> (G3). Never edit a segment-* lesson, a landscape, a scenario or anything else in Classroom.gs by hand.
> Then bump Classroom.gs VERSION v01.99g → v02.00g (the +0.01 step crosses the minor boundary — write it
> exactly so) and live-site-pages/gs-versions/Classroomgs.version.txt → |v02.00g| together, add one
> generic line to Classroomgs.changelog.md ("Market-structure lessons updated with the latest company
> coverage"; 40/50, no rotation), and set the README tree's Classroom display to v02.00g
> (scripts/check-readme-tree.py, 0 findings). The Classroom page and Profiler.gs are not touched.
> landscape-capital-2026-09 and scenario-capital-objection stay stale by design — wave B's; the AIDC
> landlords and storage-developers landscapes take SB Energy as a count correction at wave D (§3 row 17).
> Say all of that in the CHANGELOG entry and the hand-off (§11.2, the landscape coupling), and retire the
> DigitalBridge fallback in §3 row 15 if the close is verified.
>
> FOR THE MEGMEET JOB: in the hand-off, one short paragraph on which platforms these three control that
> buy medium-voltage or DC power equipment (SSTs, 800 VDC, HVDC, batteries, gas turbines) — SB Energy
> directly, DigitalBridge's and Blue Owl's platforms through their operators — and whether capital here
> is a door an SST seller can use or only a way to find the buyers.
>
> VERIFY: check-source-reachability.py before Stage 2; sync-profiler-registry.py --check clean (208 → 211
> in bijection, calendar included); build-profiler-graph.py; check-profiler-study.py,
> check-profiler-relationships.py and check-profiler-crossrefs.py clean (accept reviewed candidates with a
> reason); check-profiler-reports.py warnings read; check-classroom-content.py 0 errors after the
> regeneration (71 lessons / 8 tracks / 220 gate cases today); node --check on a .js copy of
> Classroom.gs; check-readme-tree.py 0 findings; every new and revised dossier and guide renders under
> Playwright with zero page errors other than the sandbox's gis_load_failed (the guide overlay closes with
> its ✕ button, not Escape). Normal Pre-Commit and Pre-Push checklists; ONE commit; push on your claude/*
> branch once git ls-remote shows it absent. Flip §3 row 11 to landed in the pattern of rows 1–10, write
> the CHANGELOG section with this prompt verbatim as the blockquote, and remember session.
>
> NEVER: edit a Classroom lesson, landscape or scenario by hand; create a project entry for Stargate;
> state an equity cheque as an enterprise value or the reverse; name a deal closed on a press report
> alone; close or edit the developer's reminders.
>
> At the end: one line per company (identity verdicts, segments and roles, inbound read/revised counts,
> calendar row); the DigitalBridge close as verified, with the document; the segments regenerated and the
> Classroom version written; the --check and content-checker final lines; and the session's cost from
> get_session's usage.cost_usd if it exposes one, with the rate-limit status."

§3 row 11, F-I2: three new dossiers (`softbank`, `sb-energy`, `blue-owl`), each with a v2 study guide and a lesson plan, written after the **DigitalBridge close was verified** from DigitalBridge's completion Form 8-K (CIK 1679688, accession 0001104659-26-112148): the merger completed on **30 September 2026** at USD 16.00 a share in cash, the parent wholly owned by SoftBank Group Overseas GK. SoftBank's dossier is therefore written once, with the close as fact and DigitalBridge's platforms as controlled through its manager. Step 7 then revised 29 inbound dossiers and regenerated the 11 Classroom segment lessons whose sections changed.

### Added

- **`live-site-pages/profiler-data/softbank.profile.json`** (schema v7, profileVersion 1, intel-briefing; 74 sources) — SoftBank Group Corp. (TSE: 9984) as three counterparties under one name: the holding company (NAV ¥72.3tn and LTV 13.0% at 30 June 2026; ~13% of OpenAI after USD 64.6bn; Arm 86.7%), the owner since 30 September of **DigitalBridge, the manager** (USD 40.2bn fee-earning equity; GP commitments 0.03%–0.72% per fund — the platforms' equity stays with the funds), and the parent of **SB Energy, its one equipment buyer**. USD 3.1bn equity value and ~USD 4.0bn enterprise value are stated as each; ABB Robotics is signed, not closed; the France programme is an announced plan.
- **`sb-energy.profile.json`** (profileVersion 1; 32 sources) — SB Energy, Inc. from its S-1/A No. 2: owner-furnished modules, battery components, high-voltage transformers, switchgear and inverters; Milam County ~753 MW-IT and PORTS-Pike ~8.0 GW-IT leased to OpenAI, none operating; the ~9.2 GW of PORTS gas developed by a different SoftBank affiliate; NVIDIA's USD 3.0bn and its guarantee of the first ~4.25 GW-IT; the CFIUS National Security Agreement's vendor restrictions; IPO filed 1 September, **unpriced** (the delay is reported only).
- **`blue-owl.profile.json`** (profileVersion 1; 41 sources) — Blue Owl Capital Inc. (NYSE: OWL): funds own STACK (bought the IPI Partners manager, 3 January 2025), hold 80% of Meta's Hyperion venture (**USD 7.0bn cash** against **~USD 27bn total development cost**), co-sponsor the USD 15bn Abilene JV, and lead GPU loans (IREN USD 2.4bn, signed 25 August). Blue Owl itself has filed nothing on these deals; the record is the counterparties'.
- **Study guides** `softbank.study.json` (15 sections), `sb-energy.study.json` (16), `blue-owl.study.json` (16) at schema v2, concept-only flashcards and quizzes; **lesson plans** under `repository-information/study-prep/{softbank,sb-energy,blue-owl}/`, written skeleton-first.
- **Nine concepts** in `profiler-concepts.json`, collision-checked: business development company, GP stake, margin loan, NAV discount, National Security Agreement, prepaid forward, registration statement, tender offer, warrant. No existing concept edited; the guide-specific 'residual value guarantee' (a building-lease sense the registry's chip-hardware entry does not carry) lives in `blue-owl.study.json`'s glossary.
- **Registry, segments, calendar** — three `profiler-companies.json` entries with full `aka[]` (populated before the step-7 grep); segments: `softbank` and `blue-owl` **capital incumbents** (capital is now 15 members, 9 · 3 · 3), `sb-energy` **challenger in `aidc-developers-and-landlords` and — changed from the hypothesis' 'adjacent' — challenger in `storage-developers-and-ipps`**, because solar and storage produce 'substantially all' its revenue. Calendar: `softbank` 2026-11-10 and `blue-owl` 2026-10-29, both confirmed by their own IR notices; `sb-energy` a quarterly core cadence row until it lists. Notes in `profiler-refresh-notes.json`. 16 exec photos (company-published) in `images/execs/`.

### Changed

- **Step 7 — 66 raw `aka[]` hits (SoftBank 35 · SB Energy 14 · Blue Owl 17)**, read against the pre-revision copies. SoftBank: 3 collisions, 6 career-only, 6 list mentions, 20 substantive; SB Energy: 10 collisions ('Energy Global' the trade publication; Nova SBE), 4 substantive; Blue Owl: 1 career-only, 1 source label, 15 substantive. **29 dossiers revised** under the Archival Procedure (archived, profileVersion +1) with the reciprocal edge for every counterparty the new dossiers curate: `abb`, `aep`, `berkshire-hathaway-energy`, `blackrock`, `blattner`, `coreweave`, `cpp-investments`, `crusoe`, `dpr`, `fluence`, `g42`, `google`, `iren`, `kiewit`, `meta`, `mgx`, `nscale`, `nvidia`, `openai`, `oracle`, `powerhouse-data-centers`, `rosendin`, `schneider-electric`, `solv-energy`, `stack-infrastructure`, `stem`, `switch`, `turner-construction`, `vantage`.
- **Three substantive corrections** — `abb`: Robotics 'sold/divested to SoftBank' → agreed 8 October 2025, not completed as of 1 October 2026 (SoftBank's August deck: 'Planned in 2026'). `iren`: '$2.8B total' → USD 1.2bn term loan + USD 1.2bn notes, ~USD 2.4bn aggregate, as IREN's own FY2026 10-K and the cited release state. `meta`: '$26B PIMCO debt' → the cited release's 'debt issued to PIMCO and select other bond investors'. Two figure pairs stated, not picked: AEP's USD 4.2bn against the S-1's ~USD 5.1bn; OpenAI's 1.2 GW Milam against the S-1's ~753 MW-IT.
- **`vantage.study.json`** — 'STACK (also DigitalBridge-family)' corrected to 'STACK (owned by Blue Owl-managed funds)'; the only contradicting guide found.
- **Report pins** — 11 edge-only revisions re-verified in `report-pins-verified.json` (every cited source byte-identical; earlier verification notes kept); `abb` (two reports) and `meta` left loud because their changes are substantive. Four accepts in `profiler-relationships-accepted.json` (abb×softbank, blackrock×blue-owl, blue-owl×iren, blue-owl×oracle — `other` on both sides by design).
- **Classroom (step-5 sub-rule)** — `build-classroom-segments.py --check` listed 19 due: **11 with section changes regenerated** (`storage-integrators-and-containers`, `in-hall-power`, `clean-firm-and-nuclear`, `epc-and-construction`, `storage-developers-and-ipps`, `aidc-developers-and-landlords`, `hyperscalers-and-ai-labs`, `neoclouds`, `utilities`, `capital`, `software-and-optimization`), **8 pin-only left alone**; nothing hand-edited. `Classroom.gs` v01.99g → **v02.00g** with `Classroomgs.version.txt`, one generic GAS changelog line (`Sections: 41/50`) and the README tree display. `landscape-capital-2026-09` and `scenario-capital-objection` stay stale by design for wave B; the AIDC-landlords and storage landscapes take SB Energy at wave D.
- **`PROFILER-COVERAGE-PLAN.md`** — the three §11.3 F-I2 rows rewritten with a verdict per clause and flipped (Dossier v1 · Guide v2); the DigitalBridge 'Not covered' line records the close. **`phase-f-action-plan.md`** — §3 row 11 landed; **row 15's DigitalBridge fallback retired** (the close is verified, so `scenario-capital-objection` keeps reviewBy 10/14).
- **README.md** — tree entries for the six new data files, three study-prep directories and 34 archive files (29 from this session plus five earlier archives the tree had missed: `firmus` v1, `fluidstack` v3, `iren` v6, `quanta-services` v5, `vertiv` v9); timestamp and repo version.
- **`SESSION-CONTEXT.md`** — remember session.

### Fixed

- Two shell-expansion corruptions in this session's own `sb-energy` draft, caught before commit: an AEP quote reading 'the .2 billion' (restored 'the $4.2 billion') and the backlog-capex spec reading 'approximately 78 billion' (restored verbatim from the S-1: '$178 billion; ~$48 billion … ~$69 billion … ~$61 billion'). Cause: an unquoted heredoc expanded `$4`, `$1`. All later writes used quoted heredocs or files.

### Notes

- Checkers: `check-source-reachability.py` OK (sec.gov and data.sec.gov 200); `sync-profiler-registry.py --check` 0 of 211 out of sync, roster and calendar in bijection; `build-profiler-graph.py` 1,974 edges (1,477 curated); relationships 0 findings (25 accepted); crossrefs 0 candidates; study 211 guides and 1,609 concepts, 0 errors; reports 0 errors, 7 warnings (abb ×2 and meta loud by design; fluence, jinko, jupiter-power and oracle aged before this session); `check-classroom-content.py` 71 lessons · 8 tracks · 220 gate cases, 0 errors; `node --check` and inner scripts clean; `check-readme-tree.py` 0 findings. `check-classroom-pipeline.py` reports its unattended-committer findings (11 lessons against a cap of 3; same-day `updated`), which a developer regeneration session is outside.
- Playwright: all 32 new and revised dossiers render on `Profiler.html` with every tab, no literal `{{` or `**`, and no page error but the sandbox's `gis_load_failed`; the four new or changed guides open and close with ✕. `Profiler.html` is unchanged (data-only).
- Process slip, recorded: one research subagent made a single WebFetch to sec.gov with the default User-Agent instead of `SEC_USER_AGENT`.
- CHANGELOG `Sections: 87/100` → 88/100 (no rotation). The developer's reminders were not touched.

## [v07.92r] — 2026-10-04 05:30:08 PM EST

> **Prompt:** "give me a prompt to paste into a new Opus 5.5 xhigh session to run F-12, then remember session"

The paste-in prompt for §3 row 11 — F-I2: SoftBank, SB Energy, Blue Owl — appended to `phase-f-action-plan.md` as §14 and given in chat, with row 11 pointing at it; then the session context saved. "F-12" is read as F-I2, the plan's row 11 (there is no row or session F-12).

### Added

- **`repository-information/phase-f-action-plan.md` §14** — the F-I2 prompt (Opus 5.5 xhigh, the plan's own model line for a long first-party record — SB Energy's S-1). It adapts §6 (F-I1) with what rows 5–8 added since: the DigitalBridge gate (trade press reports SoftBank completed the ~USD 3.1bn take-private on 30 September 2026 — the prompt makes the session verify that from DigitalBridge's completion 8-K before writing SoftBank once, with DigitalBridge's platforms as controlled platforms and `vantage` and `switch` taking reciprocal investor edges); the step-5 sub-rule (segment lessons regenerated in the same commit, Classroom GAS v01.99g → **v02.00g**, written out because the +0.01 step crosses the minor boundary); the identity-check record of rows 6–8; SEC access through `SEC_USER_AGENT`; the inbound counts re-measured today by word-bounded grep — `\bSoftBank\b` 12 dossiers, `\bSB Energy\b` 4, `\bBlue Owl\b` 15, `\bDigitalBridge\b` 10 — against the §11.3 rows' 9 / 0 / 9; the SB Energy IPO status check (424B4 / 8-A12B since the 1 September S-1); and the Megmeet hand-off paragraph. It forbids F-I3, ERCOT, PJM and any Classroom wave, and leaves `landscape-capital-2026-09` and `scenario-capital-objection` for wave B.

### Changed

- **`phase-f-action-plan.md`** — §3 row 11's When cell notes the reported close and points at §14; the "Prompts for these sessions" paragraph adds §14 as the pattern for F-I3 (row 12).
- **`repository-information/SESSION-CONTEXT.md`** — a new Latest Session (the row 10 hand-off: outcome (c), the all-stock correction, the reviewBy bound, the rotation, the checkers, the render, and the §14 prompt). The wave A entry (v07.88r–v07.90r) moved to Previous Sessions; the F-A1 entry (v07.86r–v07.88r) dropped under the two-session cap.
- **README.md** — timestamp and repo version.

### Notes

- No dossier, page, GAS or diagram changed. CHANGELOG `Sections: 86/100` → 87/100 (sections dated 2026-10-04 EST exempt; no rotation).
- The DigitalBridge close is a press report here (DCD, Mobile Europe), deliberately not written into any dossier or registry entry — the F-I2 session reads the 8-K and records it.
- The reminder for the Dominion reframe is still the developer's to dismiss.

## [v07.91r] — 2026-10-04 05:14:32 PM EST

> **Prompt:** "Picking up from my last session, run repository-information/phase-f-action-plan.md §3 row 10 as a fresh
> session: reframe the Dominion rehearsal — `scenario-utilities-objection` in
> googleAppsScripts/Classroom/Classroom.gs — now that its premise has passed. The room is written two weeks
> BEFORE Dominion's annual Virginia and North Carolina solar-and-storage purchase solicitation "issues on
> 1 October 2026", and it is past 1 October. One session, ONE commit, this scenario only. Fable 5.1 at high
> (§2: scenario reframes and regulatory synthesis run at high — the facts are a regulated utility's calendar,
> not a filing to mine). Check Settings → Usage first: the week-2 Fable allowance resets Sat 10/10 7:00 AM ET
> and wave A ran on it on 10/4 (get_session exposed no cost for that session; status allowed_warning). If
> the Fable cap binds mid-session, finish on Opus 5.5 high and record the substitution in the §3 row 10 cell
> and the CHANGELOG section.
>
> STEP 0 — REBASE FIRST, before any edit: git fetch origin main; git merge-base --is-ancestor origin/main
> HEAD || git rebase origin/main; git fetch --unshallow origin main before any pin read or changelog
> rotation. Read the two counters after the rebase. repository-information/CHANGELOG.md is 85/100 at
> v07.90r — no rotation. live-site-pages/gs-changelogs/Classroomgs.changelog.md is at `Sections: 50/50` —
> AT CAPACITY — so the Classroom GAS bump this session makes (v01.98g → v01.99g) ROTATES it FIRST: move the
> oldest whole date groups to Classroomgs.changelog-archive.md with SHA enrichment per
> .claude/rules/changelogs.md (look each section up by the `— vXX.XXr` cross-reference at the end of its
> header, one `git log --oneline --all` for the batch; `grep '^## \[v' ARCHIVE | grep -v '— \['` must print
> nothing before you commit), until fewer than 50 remain, then add the v01.99g section. Run python3
> scripts/check-classroom-curriculum.py --strict and record its opening lines: it should read "0
> scenario(s) whose landscape has moved since the pin", no structural findings, and
> `scenario-utilities-objection` listed as DUE — reviewBy 2026-10-01 is the reframe's own gate, left in
> place on purpose at v07.60r.
>
> READ FIRST, in this order: repository-information/SESSION-CONTEXT.md (the wave A hand-off);
> repository-information/REMINDERS.md — the first active reminder IS this task; read every sub-bullet (the
> window, the slip rule, the all-stock check, "its own session"); it is the developer's note — never mark
> it complete or move it; report what you did and let the developer dismiss it. phase-f-action-plan.md §2
> and §3 rows 10–17 and this §13. .claude/rules/classroom-app.md — "Authoring a pipeline lesson" for the G3
> contradiction test and the per-section "section <id> teaches X; <ref> now says Y" sentence, the
> `revisions[]` shape {date, note, changed[]} with P8 equality (every id listed differs, every differing id
> is listed, unchanged sections byte for byte), G2 read-before-re-pin, D6/P13 (a scenario is revised by a
> developer session only — this is one), and the content fence: the scenario sits INSIDE it, the gate
> derivation is untouched; if P3 reports, refresh gateDigest per the rule, otherwise leave the ledger alone.
> repository-information/C5-SALES-SIMULATIONS-DESIGN.md §5 (the ten-section template) and §6 (the stamp).
> CLASSROOM-CURRICULUM-PLAN.md §11 row 4. The v07.60r section of CHANGELOG.md (Part D: the room was
> deliberately NOT reframed then — "the reframe's gate") and the v07.89r section (the five scenario re-pins
> this one follows: changed[] names only the sections whose meaning changed; `updated` advances; reviewBy
> follows the nearest dated gate in the new material). Then the literal itself —
> clLessonScenarioUtilitiesObjection_(), every section — and the dossier it is pinned to,
> live-site-pages/profiler-data/dominion-energy.profile.json (v1, lastUpdated 2026-09-03 at the time of
> writing; the pin you write is the fetched file's own value, G2 — the registry is for the sweep, never for
> a pin).
>
> THE PREMISE, AND HOW TO READ IT. The pre-issue framing lives in six sections (grep the literal):
> the-room ("two weeks before this utility's annual purchase solicitation issues", "You are not bidding
> anything today", "issues on 1 October 2026"); what-the-record-says ("1 October"; the "all-stock" row);
> the-position ("the solicitation opens"); beat-1 and beat-3 ("1 October", "solicitation issues");
> claims-ledger (the dated rows and the review-date row). Before touching any of them, establish from the
> primary source whether the solicitation issued: Dominion Energy Virginia's annual solicitation page and
> documents (the 2025 cycle's structure is the model), the SCC docket if a filing accompanies it, and the
> company's newsroom — read first-hand and dated. THREE OUTCOMES, ONE RULE EACH. (a) ISSUED ON 1 OCTOBER —
> reframe the room to the day after issue: the seller has the document in hand; read the capacity sought,
> the eligible technologies, the proposal due date and the key dates OFF THE DOCUMENT and write them into
> what-the-record-says and the ledger as a primary read, cited by document title and date (the 24
> September neoclouds precedent: a primary document read first-hand is cited directly in the ledger when
> the dossier predates it); re-judge the beats against the new framing — the correct answers rest on
> prudence, the instrument and the collateral, which the issue does not change, so expect them to hold, but
> say so beat by beat; reviewBy moves to the nearest dated gate IN THE DOCUMENT (the proposal due date or
> the next calendar step), never earlier than `updated`. (b) ISSUED ON A LATER DATE — as (a), with that
> date. (c) NOT ISSUED — the reminder's own rule: re-date the framing to the new published issue date and
> move reviewBy to it rather than rewriting the room; if no new date is published, say so in the room ("the
> solicitation the record expected on 1 October has not issued") and set reviewBy from the Dispatchable
> Generation RFP's proposal deadline of 18 December 2026 (dominion v1, recentDevelopments 2026-07-01), the
> nearest dated gate the dossier holds. The counterparty is a role, never a person; positions are
> paraphrased from the record.
>
> THE ALL-STOCK CHECK (the reminder's sub-bullet; flagged at v07.40r, left unchanged at v07.60r). The
> dossier and the scenario describe the 15 May 2026 NextEra–Dominion combination as "all-stock" (a fixed
> exchange ratio; shareholder vote 3 September 2026; closing expected in the second half of 2027). Verify
> against the merger agreement and the 8-K of May 2026 and the joint proxy: is the consideration NextEra
> stock at a fixed exchange ratio only, or is there a cash component, an election or a contingent value
> right? Record the 3 September vote result and the status of SCC case PUR-2026-00112 from primary
> sources. If "all-stock" is right, say so in the ledger row's source with the document named. If it is
> wrong, correct the scenario's wording and FLAG the dossier for a `profiler Dominion Energy` refresh in
> your hand-off — a Classroom session NEVER edits a dossier, a registry entry, Profiler.gs or Profiler.html.
>
> WHAT MOVES AND WHAT DOES NOT. Edit only clLessonScenarioUtilitiesObjection_(). Pins:
> `profile:dominion-energy` at the fetched lastUpdated (2026-09-03 unless a refresh landed — read the
> file); `guidance:landscape-utilities-2026-09` stays at 2026-09-26 — the landscape is NOT revised here,
> that is wave C (§3 row 16); note in your hand-off that its the-indicators row dated "1 October 2026" has
> passed, for wave C to carry. `updated` → the run date (P7). Append the third `revisions[]` entry with
> changed[] naming exactly the differing sections and the X→Y notes. Do not touch the other thirteen
> scenarios, any landscape, any segment-* lesson (`build-classroom-segments.py --check` will read 19
> pin-only due on concepts: pins — leave them, G3), any dossier, REMINDERS.md or TODO.md.
>
> VERSIONING ([PC-GS-VERSION] #1, [PC-PAGE-CHANGELOG] #16): Classroom.gs VERSION v01.98g → v01.99g and
> live-site-pages/gs-versions/Classroomgs.version.txt → |v01.99g| together; the GAS changelog ROTATED, then
> one generic public line ("One rehearsal exercise re-timed to its buyer's published calendar" — no names,
> dockets or internals); README tree Classroom display → v01.99g (python3 scripts/check-readme-tree.py); no
> page bump. CHANGELOG: the v07.91r section with this prompt verbatim as the blockquote; the outcome (a, b
> or c) in its first line; the G3 sentence per changed section; the all-stock verdict with its source; the
> --strict and --check final lines; the rotation count; and "Reminder: left for the developer to dismiss".
> Flip §3 row 10 to landed (the pattern of rows 1–9).
>
> VERIFY: node --check on a .js copy of Classroom.gs; node scripts/check-gas-inner-scripts.js; python3
> scripts/check-classroom-content.py (0 errors; 71 lessons / 8 tracks / 220 gate cases, unchanged); python3
> scripts/check-classroom-pipeline.py --base origin/main (P1 on the developer files and P13 on this one
> scenario are expected; no P3 unless you moved a gate symbol, no P7 after the `updated` advance, no P8);
> python3 scripts/check-classroom-curriculum.py --strict (the scenario no longer due; 0 moved); a
> Playwright render of Classroom.html#lesson/scenario-utilities-objection at contributor with zero page
> errors — industry-guidance.md step 7's recipe. Wave A's render script left with its container, so
> rebuild it: serve a scratch copy of live-site-pages over http://127.0.0.1 with `_e = ''` and
> `AUTO_REFRESH = false`, seed sessionStorage AFTER load (`Classroom_gas_session_token`,
> `Classroom_gas_user_email`, `Classroom_gas_user_role` = contributor, `Classroom_gas_user_permissions` =
> ["guidance","tracks"]), override window._gasPost AFTER load with a fake that answers
> cop=index/lesson/progress/drill and gop=index/doc from the parsed literals (wrap the assignment in an
> IIFE — page.evaluate invokes a bare function expression), hide #auth-wall / .splash / #gas-pill /
> #verify-overlay, then clHeaderShow(); clAppMount(); clRoute(); and read the section headings back.
>
> Normal Pre-Commit and Pre-Push checklists; ONE commit; push on the claude/* branch once git ls-remote
> shows it absent (the harness pre-creates the branch at origin/main — that is not an in-flight workflow).
>
> NEVER: mark or move the developer's reminder; edit a dossier, the registry, Profiler.gs or Profiler.html;
> edit a segment-* lesson, another scenario or any landscape; fabricate a provenance input or use a `note:`
> prefix; name a person as the counterparty.
>
> At the end: which outcome (a, b or c) the primary source supported and the document it came from; the
> sections changed with their G3 sentences; the new reviewBy and its gate; the all-stock verdict; the
> --strict and --check final lines; the rotation (sections moved, SHA check clean); and the session's cost
> from get_session's usage.cost_usd if it exposes one, with the rate-limit status."

The Dominion reframe — row 10 of `phase-f-action-plan.md` §3, the standing reminder's own window. **Outcome (c) — the solicitation had not issued on the public record**: on 4 October 2026 Dominion Energy Virginia's own "Solar, Onshore Wind & Energy Storage Proposals" page still reads that the purchase solicitation "is expected to be issued on October 1, 2026", directs bidders to the CE-8 registration portal for its materials, posts the 2026 Development Asset Acquisition RFP and no purchase-solicitation document, and the newsroom's releases since 1 September (14 September, the merger's Virginia benefits package; 1 October, a South Carolina efficiency programme) carry no issue notice; no new date is published anywhere. So the room is re-dated to the slip rather than rewritten, the 2025 purchase solicitation is read first-hand as the model, and the dispatchable-generation solicitation's 18 December deadline is carried as the one published procurement gate. The "all-stock" description is wrong and is corrected. All three beats hold. One commit, Fable 5.1 throughout — no model substitution (launched at xhigh; see Notes).

### Changed

#### `googleAppsScripts/Classroom/Classroom.gs` — `scenario-utilities-objection` (Dominion; developer session, design D6; guidance, unchanged)
- `updated` 2026-09-26 → 2026-10-04; `reviewBy` 2026-10-01 → **2026-12-02**. Pins unchanged and re-read: `profile:dominion-energy` v1 @2026-09-03 (the fetched file's own `lastUpdated`; no refresh has landed), `guidance:landscape-utilities-2026-09` @2026-09-26 (not revised here — wave C's). A third `revisions[]` entry names the seven sections that differ, and P8's equality holds.
- **The primary reads, by document and date** (the 24 September neoclouds precedent — cited directly in the ledger because the dossier predates them):
  - Dominion Energy Virginia, "Solar, Onshore Wind & Energy Storage Proposals" page, read 4 October 2026 — the pre-issue language still standing; the posted documents list.
  - Dominion Energy Virginia and Dominion Energy North Carolina, "Request for Proposals — 2025 Solicitation for New Renewable Generation and Energy Storage", dated 8 October 2025 — the model: intent to bid 20 January 2026, proposals 9 February 2026 (3 pm), up to 100 MW distributed solar, up to 1,000 MW utility-scale solar and onshore wind, up to 500 MWac of storage, twenty-year renewable and fifteen-year storage terms, delivery by 31 December 2029.
  - Dominion Energy Virginia, "Dispatchable Generation Proposals" page — bid form open since 1 July 2026, final submissions due 5 pm 18 December 2026 (confirms `recentDevelopments[7]`).
  - NextEra Energy Form 8-K of May 2026 (the merger agreement) and the Dominion Energy joint proxy statement (DEFM14A, 28 July 2026) — the consideration.
  - Dominion Energy Form 8-K, Item 5.07, 3 September 2026 (671,317,253 for / 8,566,156 against / 2,185,104 abstain; no broker non-votes) and NextEra Energy Form 8-K, Item 5.07, 3 September 2026 (share issuance 1,612,635,616 for / 8,545,037 against).
  - Virginia State Corporation Commission news release of 22 September 2026, Case PUR-2026-00112 — local public hearings 7 October (Newport News) and 9 October (Fairfax), public-witness sessions 5, 9 and 10 November, evidentiary hearing from 17 November in Richmond; and the "Upcoming Public Hearings in Nov. & Dec." notice of 11 August 2026 on South Carolina's utility-consumer site, Docket 2026-186-EG — hearing 8 December 2026 in Columbia.
- **The all-stock verdict: wrong as worded.** Neither the merger 8-K nor the joint proxy uses the phrase; each Dominion share converts into 0.8138 NextEra shares **plus its pro rata share of an aggregate USD 360 million cash payment**, with no election and no contingent value right. The scenario's wording is corrected in `what-the-record-says` and the ledger, with the documents named in the row's source. `dominion-energy` v1 carries the cash in `relationships[8].scale` and `recentDevelopments[10]` yet labels the deal "all-stock" in `summary`, `relationships[8].note` and that headline — **flagged for a `profiler Dominion Energy` refresh**; a Classroom session does not edit a dossier.
- **The G3 sentences, one per changed section (7 of 10):**
  - **`the-room`** taught a meeting two weeks before the purchase solicitation issues on 1 October 2026 and "you are not bidding anything today"; the company's page now says the solicitation is still expected on that date, with its materials behind a portal and no document posted — so the room is three days after a date that passed without an issue, the dispatchable lane and the 3 September votes are on the table, and the seller still bids nothing.
  - **`what-the-record-says`** taught "a purchase solicitation issuing 1 October 2026" and "an all-stock combination"; the page now says expected, the 2025 document says what the model asked for, the 8-K and proxy say stock plus cash, the two 8-Ks say both votes passed, and the two commissions' notices give the hearing calendar. A tenth row carries the dispatchable-generation lane (deadline as fact, the third-lane reading as analysis); the sales line re-points to rows six and nine.
  - **`the-position`** taught "the lane the October solicitation opens"; the page now says it opens when the solicitation issues, which on 4 October it has not — and a late instrument is still the instrument.
  - **`beat-1`** taught, in its strong option and rationale, "the purchase solicitation issuing on 1 October" and "the developer bidding the October solicitation"; now the solicitation the record expected and that has not yet issued, where the developers who will bid it are choosing equipment now. Correct answer unchanged (the lane question).
  - **`beat-3`** taught, in its setup and rationale, "the purchase solicitation issues on 1 October", "five approvals are pending" and "the solicitation issues in a fortnight"; now the slip with no new date, the dispatchable deadline, the votes done with five regulatory approvals pending, the Virginia hearings of 7 and 9 October and 17 November, and a rationale for option 4 that names the windows actually open. Correct answer unchanged (what survives the combination).
  - **`claims-ledger`** taught a review date of 1 October inside a thirty-day horizon; now 2 December with the reason, the solicitation row kept as the dossier states it, seven primary-read rows added by document title and date, and the merger row corrected with its source naming the 8-K, the proxy and the dossier's own inconsistency.
  - **`what-the-record-does-not-say`** taught five gaps; a sixth — what the next purchase solicitation asks for, and when — is opened by the calendar: the 2025 document is a model, not a term sheet.
  - **Unchanged, byte for byte:** `beat-2` (the edition-and-date answer turns on the award-to-energisation gap, not the issue date), `the-mechanism-behind-it`, `debrief`.
- **The beats, re-judged one by one:** beat 1 — the lane question still converts the objection into something the buyer can answer, and the slip only sharpens it (the developer lane is live and dateless, the commission lane unchanged); beat 2 — nothing in the slip, the votes or the consideration touches a prudence finding made on the record at the decision; beat 3 — the dockets and the calendar still survive the combination and supplier qualification still moves, so the written what-carries-over question is still the one only this counterparty can answer. **All three beats hold.**
- **Why 2 December, not 18 December:** the prompt's (c) rule sets `reviewBy` from the dispatchable-generation solicitation's 18 December deadline, the nearest procurement gate the dossier holds. C5 §6 binds a scenario to its landscape's own review date ("a scenario cannot outlive the judgment it rests on"; the content checker warns otherwise), and `landscape-utilities-2026-09` reads 2 December — so the AEP scenario at v07.60r and the Hut 8 scenario at v07.89r were bound the same way. 18 December is carried in the ledger as the scenario's own next gate; wave C re-sorts both together.

#### Versions
- Classroom GAS `VERSION` v01.98g → **v01.99g**; `live-site-pages/gs-versions/Classroomgs.version.txt` → `|v01.99g|`; README tree Classroom display v01.99g (`check-readme-tree.py`: 0 findings). No page bump.
- **`Classroomgs.changelog.md` rotated first** — it stood at `Sections: 50/50`. The oldest whole date group, **2026-09-16 (11 sections, v01.49g–v01.59g)**, moved to `Classroomgs.changelog-archive.md` with SHA enrichment from a deepened clone (1,780 commits; one `git log --oneline --all` resolved 11 of 11 by their `— vXX.XXr` cross-references). `grep '^## \[v' ARCHIVE | grep -v '— \['` prints nothing. Then the v01.99g section with one generic line: counter **40/50**; the archive holds 59.

#### Documents
- **`repository-information/phase-f-action-plan.md`** §3 row 10 flipped to landed, in the pattern of rows 1–9. **`CLASSROOM-CURRICULUM-PLAN.md`** §11 row 4 annotated with the reframe version.

### Notes
- **Checkers (final run, before commit):** `node --check` on a `.js` copy clean; `check-gas-inner-scripts.js` 11 files / 106 blocks clean; `check-classroom-content.py` **71 lessons, 8 tracks, 220 gate cases — 0 errors, 0 warnings** (unchanged); `check-classroom-curriculum.py --strict` — opening lines at session start read **"0 scenario(s) whose landscape has moved since the pin"**, **no structural findings**, and `scenario-utilities-objection` listed under review dates as **reviewBy 2026-10-01 PASSED**; final run **0 moved, no structural findings, the scenario no longer listed** (reviewBy 2026-12-02 is outside the 30-day horizon). `build-classroom-segments.py --check`: **19 segments, 19 due — 0 with section changes, 19 pin-only** (`concepts:profiler-concepts` 2026-09-30 → 2026-10-04) — none regenerated (G3). `check-classroom-pipeline.py --base origin/main`: **P13** on this one scenario (reserved to a developer session by D6) and **P1** on the developer files; **no P3** (gateDigest untouched), **no P7**, **no P8**. `check-readme-tree.py` 0 findings.
- **Render:** Playwright, Chromium at contributor over a scratch copy served on 127.0.0.1 with `_e = ''` and `AUTO_REFRESH = false`, the session seeded and `window._gasPost` overridden after load with a fake answering cop=index/lesson/progress/drill and gop=index/doc from the literals (payloads built by running `Classroom.gs` in a Node sandbox with stubbed GAS services): `Classroom.html#lesson/scenario-utilities-objection` — **0 page errors**, 12 headings rendered (the ten sections, the title and the glossary), no literal `**` or `{{` in the rendered text; the new sentences read back. Two console lines are external-resource loads behind the proxy's certificate, not page errors.
- **Model:** Fable 5.1 (`claude-fable-5-1`) for the whole session, no substitution to Opus 5.5; `get_session` reports the session was launched at effort `xhigh`, not the `high` the row asked for — the developer's launch setting, not changed mid-session. It exposed no `usage.cost_usd`; rate limit `allowed_warning` on the seven-day window, resets Sat 10/10 7:00 AM ET.
- **Reminder: left for the developer to dismiss** — the first active reminder in `REMINDERS.md` is untouched.
- **For the hand-off:** (1) `dominion-energy` v1 (2026-09-03) is a `profiler Dominion Energy` refresh candidate — the "all-stock" label, the 3 September vote result, the SCC hearing calendar, and its "final order expected January 29, 2027 per the Q2 2026 deck" line, which the deck's approval-timeline slide does not show at day level (the SC procedural schedule is the likelier source — not re-sourced here); (2) `landscape-utilities-2026-09`'s `the-indicators` row dated "1 October 2026" (Florida's compliant-tariff deadline) has passed and this session did not touch the landscape — wave C (§3 row 16) carries it, and should also carry that Dominion's purchase solicitation slipped past its own date; (3) the newsroom index at news.dominionenergy.com answers 403 to a plain fetch — the overview page was read through the fetch tool instead.

## [v07.90r] — 2026-10-04 06:09:18 AM EST

> **Prompt:** "give me a prompt to paste into a new session (recommend model and effort level) to continue the action plan, then remember session."

The hand-off after Classroom wave A. The next open row of `phase-f-action-plan.md` §3 is row 10, the Dominion reframe — the standing reminder's window closes Tue 10/6 — and its paste-in prompt is appended as §13 at the plan's own model line, Fable 5.1 High. Session context saved.

### Added

- **`repository-information/phase-f-action-plan.md`** — **§13, the paste-in prompt for §3 row 10** (`scenario-utilities-objection`, Fable 5.1 · high): STEP 0 (rebase, unshallow, the two counters — the Classroom GAS changelog is at 50/50 and must rotate before that session's v01.99g section), the read-first list, the premise and the three outcomes the reminder names (issued on 1 October / issued later / not issued, each with its reviewBy rule), the all-stock check against the merger agreement and proxy with the never-edit-a-dossier rule, what moves and what does not (the landscape is wave C's; the generator's 19 pin-only segments stay), versioning, the verify list including a rebuilt Playwright recipe, and the end report. §3 row 10 now reads "prompt in §13"; the "Prompts for these sessions" paragraph names §13 as the pattern for single-scenario reframes.

### Changed

- **`repository-information/SESSION-CONTEXT.md`** — Latest Session rewritten for the wave A session (what landed at v07.89r, where it left off, the decisions, the known issues, the recommendation to run §13 next); the previous Latest Session moved to Previous Sessions and the older entry dropped (two-session cap).

### Notes

- No code, module, lesson or dossier changed in this push; no GAS or page bump. Repo version v07.89r → v07.90r.
- `get_session` exposed no `usage.cost_usd` for this session in three calls; rate limit `allowed_warning` on the seven-day window, no overage, resets Sat 10/10 7:00 AM ET.

## [v07.89r] — 2026-10-04 04:11:56 AM EST

> **Prompt:** "Picking up from my last session, run repository-information/phase-f-action-plan.md §3 row 9 as a fresh
> session: Classroom wave A — re-author the three AIDC landscape modules `landscape-neoclouds-2026-09`,
> `landscape-hyperscalers-and-ai-labs-2026-09` and `landscape-aidc-developers-and-landlords-2026-09`
> against their enlarged rosters, then re-judge and re-pin the five rehearsal scenarios stamped on them —
> one session, ONE commit. Fable 5.1 at xhigh (§2's anchor rule: lessons hang on this material); check
> Settings → Usage first — week 2's Fable allowance resets Sat 10/10 7:00 AM ET and F-A1 took about $100
> of it. If the Fable cap binds mid-session, finish on Opus 5.5 xhigh and record the substitution in your
> §11.3-equivalent cells (the §3 row 9 cell and the CHANGELOG section).
>
> STEP 0 — REBASE FIRST, before any edit: git fetch origin main; git merge-base --is-ancestor origin/main
> HEAD || git rebase origin/main. Run git fetch --unshallow origin main before any pin read (a shallow
> clone makes every per-file git log return the boundary commit's date — a provenance stamp written off it
> is wrong and no checker sees it). Read the CHANGELOG counter after the rebase (82/100 at v07.88r;
> sections dated the push day are exempt; no rotation is expected). Run python3
> scripts/check-classroom-curriculum.py --strict and record its opening lines: it should read
> "0 scenario(s) whose landscape has moved since the pin" and ONE strict finding — the study pool (2,491)
> exceeds CL_DRILL_INV_CAP (2400), so the drill silently truncates about ninety items. Fix that in this
> session: raise CL_DRILL_INV_CAP in Classroom.gs to 3200, rewrite its comment with today's count, and
> record the line in the CHANGELOG. It sits outside the content fence and is not one of the 32 GATE_SYMBOLS,
> so no gateDigest refresh — confirm that by grepping GATE_SYMBOLS in scripts/check-classroom-pipeline.py
> before you touch it, and if it IS listed, refresh gateDigest in the same commit per classroom-app.md.
>
> READ FIRST, in this order: repository-information/SESSION-CONTEXT.md (the F-A1 hand-off);
> phase-f-action-plan.md §3 rows 9–17 and this §12; .claude/rules/industry-guidance.md in full (the module
> lives in googleAppsScripts/Classroom/Classroom.gs below the `// CONTENT END` fence as a guidanceDoc<Name>_()
> function; the analysis markdown at repository-information/industry-guidance/landscape-<segment>-analysis.md
> is the source of truth and is edited FIRST; versioning is the Classroom GAS version only; the verify list
> is step 7); .claude/rules/classroom-app.md — the G3 contradiction test, the per-section X→Y sentence, the
> `revisions[]` entry shape, G2 read-before-re-pin, the scenario rules (D6/P13), the content fence and the
> gateDigest obligation; CLASSROOM-CURRICULUM-PLAN.md §10.6 (the landscape module — shape, reviewBy from the
> nearest dated gate, the split rule against neighbouring lessons) and §11 (the scenario ledger — rows 2, 5,
> 7, 11 and 14 are yours); the v07.60r section of CHANGELOG.md — the utilities landscape re-pin — which is the
> pattern this wave follows: one G3 sentence per section, the fence counts restated, the indicators table
> extended, reviewBy moved to the nearest NEW gate; and the three analysis markdowns plus the three module
> literals as they stand. Then read every member dossier the module will cite — the registry is for the
> sweep, never for a pin: every `profile:<slug>` date you write is the `lastUpdated` read off the fetched
> <slug>.profile.json (G2).
>
> THE THREE MODULES — what moved, read off profiler-segments.json at v07.87r:
>
> - `landscape-neoclouds-2026-09` (updated 2026-09-24, reviewBy 2026-09-30 — OVERDUE). Written on seven
>   members, 1 · 6 · 0. Today twelve: incumbents coreweave AND nebius (Platinum in ClusterMAX 3.0, 23 Sep
>   2026 — nebius moved from challenger to incumbent in the row-5 pass, v07.81r); challengers lambda, crusoe
>   (Gold → Bronze in 3.0), iren (Underperforming; v7 on 10/4), fluidstack (Unavailable in 3.0; v4 on
>   10/4), nscale (Unavailable; v3 from the S-1), firmus (Silver; v2 on 10/4), humain (Unavailable), g42
>   (Core42 — Participation Ribbon), whitefiber (Underperforming); adjacent 5c-group. The module's
>   incumbency basis is the ClusterMAX rating itself, so re-read `semianalysis.profile.json` (v1, 10/4):
>   its technicalSpecs carry the full 3.0 tier table and its strategyRead the independence record — the
>   landscape should now say what the rating is, who publishes it, and why a tier is a point-in-time
>   judgment by a firm with undisclosed commercial and investment ties to several rated clouds. Do not
>   rank by tier alone; the dossiers' own facts (contracted MW, named tenants, owned sites) are the other
>   basis. Nearest dated gates to weigh for reviewBy: Nscale's S-1 effectiveness/IPO, IREN's Q1 FY27
>   results, the next ClusterMAX edition (~March 2027), Fluidstack Ltd's overdue Companies House accounts.
> - `landscape-hyperscalers-and-ai-labs-2026-09` (updated 2026-09-16, reviewBy 2026-12-31). Written on
>   eight; today ten: incumbents amazon, google, microsoft, meta, oracle; challengers openai, anthropic
>   (v4, 10/2 — Nscale at up to USD 44.6bn, Fluidstack, the Claude Code spend SemiAnalysis names), xai,
>   bytedance and alibaba-cloud (F-H1, 9/26 — the China buyer side, with the China Datacenter Model's
>   'one-fifth of China's capacity' finding now in semianalysis v1). Microsoft, meta, oracle, openai and xai
>   were refreshed 9/26. The module's closure finding (§10.6 (bb1): the smallest segment, which disabled two
>   instruments) must be re-tested at ten members.
> - `landscape-aidc-developers-and-landlords-2026-09` (updated 2026-09-15, reviewBy 2026-12-15). Written
>   on the pre-Phase-F roster; today 38 members, 9 · 18 · 11. New since: chindata, g42, whitefiber,
>   5c-group and tecfusions as challengers; firmus, humain and quinbrook adjacent; equinix v8 (atNorth
>   split), hut-8 v3, tract v4, powerhouse-data-centers v3, iren/crusoe/fluidstack/nscale revised. This is
>   the largest roster any landscape covers; keep the four-neighbour split §10.6 (s) recorded and extend
>   the each-players-bet table from the newcomers' strategyRead[] only, labelled as analysis with the
>   dossier's confidence carried, as v07.60r did.
>
> HOW TO REVISE (the v07.60r pattern, enforced by P7/P8 on lessons and by your own honesty on modules):
> for each module, read each section and write the sentence "section <id> teaches X; <ref> now says Y";
> only a section with such a sentence changes. Update the analysis markdown first, then the module literal
> to match; bump `updated` to the run date; set `reviewBy` from the nearest dated gate in the NEW material
> (never earlier than updated); append one `revisions[]` entry naming the changed section ids and the X→Y
> notes; restate every fence count the module carries (member counts, policy-entry counts, dated-gate
> counts) from the files, not from memory. The claims ledger must cite a dossier for every claim about a
> named company. Content scope: the landscape names and ranks covered companies by construction — the one
> module class that may — and its guidance is still to the seller reading it. Never edit a segment-* lesson
> by hand (the generator owns them), never edit a landscape for another segment, never touch Profiler.gs
> or Profiler.html.
>
> THE FIVE SCENARIOS (CLASSROOM-CURRICULUM-PLAN.md §11): `scenario-neoclouds-discovery` (fluidstack;
> reviewBy 2026-09-30 — overdue; one prior revision), `scenario-aidc-developers-and-landlords-objection`
> (vantage), `scenario-aidc-developers-and-landlords-discovery` (hut-8), `scenario-hyperscalers-and-ai-labs-
> objection` (meta), `scenario-hyperscalers-and-ai-labs-discovery` (google). For each: re-read its beats
> against the revised landscape and the counterparty's current dossier (fluidstack v4, hut-8 v3, meta and
> google at their current versions); re-judge every beat that cites a fact the landscape or dossier now
> states differently; re-pin `guidance:landscape-…` to the module's new `updated` and `profile:<slug>` to the
> fetched lastUpdated; move reviewBy with the landscape's; append a `revisions[]` entry listing the changed
> section ids (P8 equality — an id listed must differ, an id that differs must be listed; copy unchanged
> sections byte for byte). The counterparty is a role, never a person; positions are paraphrased from the
> record. Do not touch the other nine scenarios.
>
> SEGMENTS: after the modules land, run python3 scripts/build-classroom-segments.py --check. Landscapes
> are not segment inputs, so expect 0 due unless a dossier moved; if any is due, regenerate it (`--segment`
> for each, or `--all`), and the Classroom GAS bump below covers it. Do not edit any segment lesson by hand.
>
> VERSIONING: Classroom.gs VERSION v01.97g → v01.98g and live-site-pages/gs-versions/Classroomgs.version.txt
> → |v01.98g| in the same commit; one generic line in live-site-pages/gs-changelogs/Classroomgs.changelog.md
> (`Sections: 49/50` → 50/50 — the NEXT GAS bump after yours rotates that file; say so in the hand-off);
> README tree Classroom display → v01.98g (python3 scripts/check-readme-tree.py, 0 findings). No page bump:
> no renderer change.
>
> VERIFY: node --check on a .js copy of Classroom.gs; node scripts/check-gas-inner-scripts.js; python3
> scripts/check-classroom-content.py (0 errors — 71 lessons, 8 tracks, 220 gate cases today); python3
> scripts/check-classroom-pipeline.py --base origin/main (P1 on your paths and P7/P8 on the five scenarios
> are expected; a P3 means you moved a gate symbol — refresh gateDigest; a P13 means a scenario changed in
> a way only P13 forbids — read it before dismissing it); python3 scripts/check-classroom-curriculum.py
> --strict (the moved-landscape line must read 0 again after the re-pins; the drill-cap finding must be
> gone); Playwright renders of Classroom.html#guidance/<each module id> and #lesson/<each scenario id> with
> zero page errors (the render recipe is industry-guidance.md step 7: scratch copy, `_e = ''`,
> `AUTO_REFRESH = false`, seed sessionStorage after load, override window._gasPost after load, hide the
> walls, clHeaderShow(); clAppMount()). Normal Pre-Commit and Pre-Push checklists; ONE commit; push on your
> claude/* branch once git ls-remote shows it absent. Flip §3 row 9 to landed with the G3 counts (sections
> changed per module, scenarios re-judged, reviewBy moved to what), update CLASSROOM-CURRICULUM-PLAN.md
> §10.6's built-list line for the three modules and §11's five rows with the new versions, and write the
> CHANGELOG section with this prompt verbatim as the blockquote.
>
> At the end: one line per module (sections changed, the new reviewBy and the gate it comes from, the
> roster counts restated); one line per scenario (beats re-judged, re-pinned to what); the --check and
> --strict final lines; whether the drill cap was raised; and the session's cost from get_session's
> usage.cost_usd (it now exposes one — the F-A1 session read USD 100.14) with the rate-limit status."

Classroom wave A — row 9 of `phase-f-action-plan.md` §3. The three AIDC landscape modules are re-authored against their enlarged rosters under the G3 contradiction test, section by section, with every count restated from the files on 4 October 2026; the five rehearsal scenarios stamped on them are re-judged and re-pinned, and all fifteen beats hold; the drill study-pool cap is raised; no segment lesson is regenerated because every one of the nineteen due is pin-only. One commit, Fable 5.1 at xhigh throughout — no model substitution.

### Changed

#### `googleAppsScripts/Classroom/Classroom.gs` — `landscape-neoclouds-2026-09` (guidance, below the fence; contributor, unchanged)
- `updated` 2026-09-24 → 2026-10-04; `reviewBy` 2026-09-30 → **2026-10-08**. **The 30 September gate failed**: Fluidstack Ltd missed the statutory deadline for its FY2025 accounts and Companies House showed `Accounts overdue` on 2 October (`fluidstack` v4). Roster re-measured **7 → 12 (2 · 9 · 1)**: Nebius moved to incumbent on 2 October on its ClusterMAX 3.0 Platinum (registry `notes`, `nebius` v6); Firmus v2, HUMAIN v1, G42 v1 and WhiteFiber v1 join as challengers and 5C Group v1 as the first adjacent; coreweave v5, lambda v6, crusoe v7, iren v7, fluidstack v4 and nscale v3 re-read. The rating the roles rest on is now explained and attributed through `semianalysis` v1 — what ClusterMAX is, who publishes it, and why a tier is a point-in-time judgment by a firm with undisclosed commercial and investment ties to several of the rated — and the module does not rank by tier alone.
- **The G3 sentences, one per section** (9 of 9 changed):
  - **`who-dominates-and-on-what-basis`** taught one incumbent, "the most lopsided roster", three of seven publishing no revenue, and cited the rating as a publisher. Now two incumbents (the second by rating, not by scale), the rating explained with the rater's own dossier's limits, seven of twelve publishing no revenue figure, and Nebius's position from its own file beside CoreWeave's.
  - **`who-threatens`** taught six challengers on four routes, four of seven shared with the landlords segment at a 50 % inversion, 18 edges and one commercial transaction, Crusoe at "about 4.9 GW". Now nine challengers on five routes (the out-compound route's runner became an incumbent; sovereign builders and a landlord-cloud are new), nine of twelve shared with five inversions, 29 edges / 14 typed pairs / 17 typings / three transactions, Crusoe at "6 GW+" gross and "$140B+" TCV, the lab signing the second Barber Lake term itself, Fluidstack breaking ground in its own name.
  - **`each-players-bet`** taught seven rows. Eleven: Nebius as incumbent; Firmus, HUMAIN, G42 and WhiteFiber from `strategyRead[]` with confidence carried; Crusoe (Series F at USD 30.9 bn, Boom order dropped, Bronze), IREN (FY2026 missed on both lines, mining decommissioned by December), Fluidstack (slip, overrun cap, direct second term, Harlingen, accounts overdue), Nscale (filed numbers, NVIDIA note ~16 November, going-concern language alleviated, roadshow expected to be postponed) and Lambda (USD 1.008 bn DDTL, IPO window 2027, the unconfirmed USD 35 bn) corrected where contradicted.
  - **`the-indicators`** taught three future day-level dates all in one file, a 14 / 11 / 0 fence, and 30 September as the review date. Now ten rows: the failed gate as an any-day row, the Firmus prospectus and listing (the new review date), Nscale's NVIDIA note, the Barber Lake amendment, Sweetwater's conditional Batch Zero inclusion, the sovereign licensing clocks and the rating's next edition; fence 35 / 23 / 0 with CoreWeave, Lambda and IREN carrying none.
  - **`the-sellers-play`** taught purchasing authority at four of seven, one battery commitment, three of four owners with a permitting problem. Now eight of eleven ranked members (two of them one step away, through an EPC contractor or a landlord subsidiary) plus Fluidstack at its own-name sites and the adjacent for everything it builds; one utility-scale battery commitment, one UPS programme with a trial, batteries on gensets at one; six of eight owners with a permitting, allocation or licensing problem; the JLE exclusivity and the two-step sovereign door added because they decide who signs.
  - **`claims-ledger`** cited the rating as a publisher. Every row now cites a dossier — `semianalysis` v1 for the rating — and the twelve members at their 4 October versions; registry @ v07.87r; graph built 2026-10-04; 41 rows.
  - **`what-the-record-does-not-say`** restated at twelve, with the rater's undisclosed ties added as the fifth absence.
  - **`drill`** (10 cards) and **`check-yourself`** (6 items) rewritten against the new counts; one item's question changed because its premise did.
  - **Outside the sections:** `short`, four tiles, `source.doc`, three glossary entries, two new glossary terms (`adjacent`, `ClusterMAX`), a second `revisions[]` entry.
- **Review date.** Nearest dated gate in the new material: the Firmus prospectus lodgement on a Reuters-reported term sheet (bookbuild 6–7 Oct, prospectus 8 Oct, listing 22 Oct), which the dossier calls "the first document obliged to carry" a revenue figure — a gate on the module's own seven-of-twelve count. Rejected: 22 Oct (same chain, later), ~16 Nov (Nscale's NVIDIA note, a financing event), 31 Dec (Hydro Tasmania; the Fluidstack instalment), 6 Apr 2027 (G42 sunset), ~March 2027 (ClusterMAX 4.0).

#### `googleAppsScripts/Classroom/Classroom.gs` — `landscape-hyperscalers-and-ai-labs-2026-09` (guidance, below the fence; contributor, unchanged)
- `updated` 2026-09-16 → 2026-10-04; `reviewBy` stays **2026-12-31** — the new material carries no future day-level date before it (`anthropic` v4's roadmap is quarter-level; `bytedance` v1 and `alibaba-cloud` v1 carry none), and the fence's one future date, 2027-01-01, is already four modules' clock. Roster re-measured **8 → 10 (5 · 5 · 0)**: ByteDance v1 and Alibaba Cloud v1 join as challengers the registry calls "a leader elsewhere, not in the established US set"; microsoft v6, meta v10, oracle v6, openai v6, anthropic v4 and xai v6 re-read; amazon v10 and google v9 unchanged. **(bb1) re-tested at ten: the closure holds** (10 of 10 pure plays, zero adjacents), so the adjacency and role-inversion instruments stay disabled; the third zero-adjacent segment of September gained an adjacent, so the zero-adjacent set and the closed set now coincide.
- **The G3 sentences** (8 of 9 sections changed):
  - **`who-dominates-and-on-what-basis`** taught eight members and three challengers; the first paragraph now says ten and five and names the second kind of challenger. The five instruments and the refusal to rank are untouched.
  - **`who-threatens`** taught three challengers, Oracle's contracted revenue at USD 638 bn and "every one of the three is financed by the five". `oracle` v6 says USD 664 bn at the quarter ended 31 August 2026 (the attribution dated to the earlier figure); a fourth direction is added — one newcomer buys through three doors and publishes no accounts, the other writes its own power architecture and buys it by framework tender — with the module's judgment that their threat is to where the architecture is written; the counter-evidence sentence is scoped to the three US labs.
  - **`each-players-bet`** taught eight rows and "the smallest segment any landscape has covered". Ten rows; ByteDance and Alibaba Cloud from `strategyRead[]` with confidence carried; Oracle at USD 664 bn.
  - **`the-indicators`** taught "all eight dossiers"; ten, still exactly one future day-level date; one row added for the newcomers' month- and year-level dates.
  - **`claims-ledger`**: six rows move to new versions where the cited field still holds; six rows added for the newcomers; registry @ v07.87r; fence 18 / 13 / 1; 42 rows.
  - **`what-the-record-does-not-say`**: ten, and two absences the newcomers state about themselves (no accounts, no vendor, no 800 V award; no solid-state transformer in service behind the other's 800 V compatibility).
  - **`drill`** (cards 1, 6, 8) and **`check-yourself`** (items 2, 3) corrected; no correct answer changed.
  - **Outside the sections:** `short`, tiles 1, 2 and 4, `source.doc`, two glossary entries, the first `revisions[]` entry.
- **Not changed:** `the-sellers-play` — nothing in the ten files contradicts it; a hyperscaler that writes its own architecture is an instance of "the specification is written above you", not an exception.

#### `googleAppsScripts/Classroom/Classroom.gs` — `landscape-aidc-developers-and-landlords-2026-09` (guidance, below the fence; contributor, unchanged)
- `updated` 2026-09-15 → 2026-10-04; `reviewBy` 2026-12-15 → **2026-11-02** — the end of the Upper Burrell township's 180-day moratorium, by which the draft "bring your own baseload" ordinance over TECfusions' flagship would be adopted (`tecfusions` v1; its judgment that the township, not the utility, is the binding constraint through 2027). Rejected: 7 Oct (a supervisors' meeting, not a decision), 10 Dec (another module's clock, as in September), 15 Dec (the September date, later — kept as an indicator), 31 Mar / 6 Apr / 1 Jul / Nov / 31 Dec 2027 (later than a six-month default). Roster re-measured **30 → 38 (9 · 18 · 11)**: Chindata v1, G42 v1, WhiteFiber v1, 5C Group v1 and TECfusions v1 join as challengers; Firmus v2, HUMAIN v1 and Quinbrook v1 as adjacents; sixteen dossiers re-read (hut-8 v3, tract v4, powerhouse-data-centers v3, equinix v8, aligned v8, stack-infrastructure v8, compass-datacenters v6, cyrusone v2, terawulf v8, edgecore v2, intersect-power v3, eolian v7, talen-energy v3, iren v7, crusoe v7, fluidstack v4). **(s) kept** — the four-neighbour split; the bets table extended from the newcomers' `strategyRead[]` only, confidence carried.
- **The G3 sentences** (7 of 9 sections changed):
  - **`who-threatens`** taught thirteen challengers on three routes (7 · 2 · 4) and three of eight adjacents hosting without being landlords. Now eighteen on four routes (8 · 3 · 5 · 2): 5C joins route one as the position built rather than inherited; TECfusions joins route two as the landlord running its flagship on its own turbines; WhiteFiber joins route three holding the utility agreement while the utility owns the substation; Chindata and Khazna/G42 are route four, leaders in another market. Eleven adjacents, three of them operators that need no landlord.
  - **`each-players-bet`** taught twenty-two rows, a Tract row contingent on "a regulator's decision it cannot control" and a PowerHouse row "now being tested in federal court". Twenty-seven rows; `tract` v4 says the commission conditionally approved 362 MW of temporary gas on 17 September while the suit continues; `powerhouse-data-centers` v3 says FERC rejected the cancellation on 22 September and sent the credit clause to the Northern District of Illinois.
  - **`the-indicators`** taught six of twenty-two dossiers with an indicators block, two pending rows, a Fermi condition due 30 September, "a hundred and seven policy entries" and 15 December as the review date. Twelve of twenty-seven; the ComEd and Tract rows carry the decisions; the Fermi row records that the date passed with the dossier unrevised and asserts no outcome; a hundred and forty-one entries; four rows added (Upper Burrell 2 Nov 2026, G42 sunset 6 Apr 2027, Chindata's first wholesale expiry Nov 2027, Frederick County 1 Jul 2027); 14 rows.
  - **`claims-ledger`** cited the registry at v05.41r "because it did not move this session". Sixteen rows move to new versions; rows added for Tract's approval, PowerHouse's order, Hut 8's parent revolver and the press identification at Beacon Point, the eight newcomers, the revenue recount (25 of 38; 7 of 9 incumbents) and the fence (141 / 104 / 2; five members with none); 90 rows.
  - **`what-the-record-does-not-say`**: the tenants paragraph carries the Beacon Point report as unconfirmed by all four parties, Chindata's tenant identified only through its self-build list and TECfusions' "1 GW" as a right of first refusal; the revenue paragraph says nine of eighteen challengers and nine of eleven adjacents.
  - **`drill`** (cards 1, 4, 5) and **`check-yourself`** (items 2, 4) corrected; no correct answer changed.
  - **Outside the sections:** `short`, tiles 1 and 2, `source.doc`, the `adjacent` glossary entry, a second `revisions[]` entry.
- **Not changed:** `who-dominates-and-on-what-basis` (nine incumbents, four bases, consent — every cited fact restated at the new versions) and `the-sellers-play` (the newcomers supply instances of "know who signs", not corrections).

#### `googleAppsScripts/Classroom/Classroom.gs` — rehearsal scenarios (developer session, design D6; all fifteen beats hold)
- **`scenario-neoclouds-discovery`** (Fluidstack; `profile:fluidstack` v2 @2026-09-06 → v4 @2026-10-04; guidance 2026-09-24 → 2026-10-04; `reviewBy` 2026-09-30 → 2026-10-08 with the landscape's). Changed: `the-room`, `what-the-record-says`, `the-position`, `beat-1`, `beat-2`, `beat-3`, `debrief`, `claims-ledger`, `what-the-record-does-not-say` — Harlingen as the third own-name site (ground broken 10 September, 1.5 GW reserved, no tenant); Barber Lake's slip to Q4 2026–Q1 2027 with the USD 359.3 M overrun cap and the lab's direct second term ("moved twice" → three times); the statutory accounts overdue rather than due; the landscape's counts quoted in the ledger. `the-mechanism-behind-it` byte-identical; `short` corrected.
- **`scenario-aidc-developers-and-landlords-objection`** (Vantage; `vantage` v9 and `project:lighthouse` unchanged; guidance → 2026-10-04; `reviewBy` 2026-12-15 → 2026-11-02). Changed: `claims-ledger` (read date).
- **`scenario-aidc-developers-and-landlords-discovery`** (Hut 8; `profile:hut-8` v2 → v3 @2026-10-02; guidance → 2026-10-04; `reviewBy` 2026-12-10 → 2026-11-02, the landscape's bound now nearer than its own 10 December gate). Changed: `claims-ledger` (v3 cites; the USD 1.07 bn parent revolver of 28 September; the Beacon Point press report as unconfirmed) and `what-the-record-does-not-say` (gap 5).
- **`scenario-hyperscalers-and-ai-labs-objection`** (Meta; `profile:meta` v9 → v10 @2026-09-26; guidance → 2026-10-04; `reviewBy` stays 2026-12-31). Changed: `claims-ledger` (fourteen version cites; every field index re-verified in v10).
- **`scenario-hyperscalers-and-ai-labs-discovery`** (Google; `google` v9 unchanged; guidance → 2026-10-04; `reviewBy` stays 2026-12-31). Changed: none — re-judged and re-stamped, first `revisions[]` entry.
- Every scenario's `updated` advances to 2026-10-04 (P7). The counterparty is a role throughout; no `note:` prefix, no `report:`/`corpus:`/`briefing:` input.

#### `googleAppsScripts/Classroom/Classroom.gs` — drill study pool
- `CL_DRILL_INV_CAP` **2400 → 3200**, comment rewritten with today's count (2,491 study items, 4 October 2026). The pool had passed the cap and the drill was silently truncating about ninety items (`--strict` baseline finding). Not a `GATE_SYMBOL`, so `gateDigest` is untouched — confirmed by `check-classroom-pipeline.py` reporting no P3.
- `scripts/check-classroom-content.py`: the cap assertion's documented value 2400 → 3200. `repository-information/CLASSROOM-SCHEMA.md`: the `CL_DRILL_INV_CAP` line restated at 3200 with the reason.

#### Versions
- Classroom GAS `VERSION` v01.97g → **v01.98g**; `live-site-pages/gs-versions/Classroomgs.version.txt` → `|v01.98g|`; `Classroomgs.changelog.md` gains a generic section (**50/50 — the next GAS bump rotates it**); README tree Classroom display v01.98g (`check-readme-tree.py`: 0 findings). No page bump.

#### Documents
- **`repository-information/industry-guidance/landscape-neoclouds-analysis.md`** §14, **`landscape-hyperscalers-and-ai-labs-analysis.md`** §13, **`landscape-aidc-developers-and-landlords-analysis.md`** §12 — each: the segment re-measured, the G3 sentence per section, the review-date judgment with every rejected candidate, the scenarios re-judged, and the verification lines.
- **`repository-information/phase-f-action-plan.md`** §3 row 9 flipped to landed with the G3 counts; **`CLASSROOM-CURRICULUM-PLAN.md`** §10.6 built-list line annotated for the three modules and §11 rows 2, 5, 7, 11 and 14 annotated with the re-pin version.

### Notes
- **Segments (G3):** `build-classroom-segments.py --check` — **19 segments, 19 due — 0 with section changes, 19 pin-only** (`concepts:profiler-concepts` 2026-09-30 → 2026-10-04 on every one). None regenerated: regenerating a pin-only segment rewrites dates and nothing else, as the v07.60r session also left them.
- **Checkers:** `node --check` clean; `check-gas-inner-scripts.js` 11 files / 106 blocks clean; `check-classroom-content.py` **0 errors / 0 warnings — 71 lessons, 8 tracks, 220 gate cases**; `check-classroom-curriculum.py --strict` **no structural findings; 0 scenarios whose landscape has moved since the pin**; the drill-cap finding is gone. `check-classroom-pipeline.py --base origin/main`: P1 on the developer files, P2 below the fence, P10 (five revised lessons) and P13 (five scenarios) — all expected of a developer session and reserved to one by D6; **no P3** (gateDigest untouched), **no P7** after the `updated` advance, **no P8** (every `changed[]` matches the differing sections), P12 clean at one step. `--selftest` 15 fixtures / 0 failures. `check-readme-tree.py` 0 findings.
- **Render:** Playwright, Chromium at contributor with a fake transport serving the parsed literals — `Classroom.html#guidance/<id>` for the three modules and `#lesson/<id>` for the five scenarios: **zero page errors on all eight**, every section heading rendered (11 per module, 12 per scenario), no literal `*` or `{{` left in the rendered text.
- **Model:** Fable 5.1 at xhigh for the whole session; no substitution to Opus 5.5.
- **Left for the next session:** the Classroom GAS changelog is at 50/50 — the next GAS bump rotates it. `landscape-neoclouds-2026-09`'s review date is four days out by rule; a slip past 8 October in the Firmus term sheet is itself the finding.

## [v07.88r] — 2026-10-04 02:24:50 AM EST

> **Prompt:** "Evaluate where I am in the overall Profiler expansion plan, tell me which phases are left (with recommended model and effort level between Fable 5.1 and Opus 5.5, Medium, High, Xhigh), give me a prompt to paste into a new session to continue the plan, then remember session."

### Added
- `repository-information/phase-f-action-plan.md` — **§12, the Classroom wave A paste-in prompt** (§3 row 9; Fable 5.1 · xhigh): re-author `landscape-neoclouds-2026-09` (overdue since 2026-09-30, roster 7 → 12), `landscape-hyperscalers-and-ai-labs-2026-09` (8 → 10) and `landscape-aidc-developers-and-landlords-2026-09` (→ 38) under the v07.60r G3 pattern; re-judge and re-pin the five rehearsal scenarios stamped on them (§11 rows 2, 5, 7, 11, 14); raise `CL_DRILL_INV_CAP` (the strict checker reads the study pool at 2,491 against 2400); Classroom GAS v01.98g; the verify list and the end report.

### Changed
- `repository-information/phase-f-action-plan.md` — §3 row 9 points at §12; the "Prompts for these sessions" paragraph names §8–§12 and makes §12 the pattern for waves B–D.
- `repository-information/SESSION-CONTEXT.md` — Latest Session written for the F-A1 session (identity corrections, the first `unassigned[]` entry, step 7, the JSON re-serialisation lesson, the plan position, the §12 decision); the F-G1 entry moved to Previous and the F-I4 entry dropped under the 2-session cap.

### Notes
- Plan position at this version: 8 of the 10 Phase F new-dossier sessions landed (F-I2 and F-I3 remain, Opus 5.5 xhigh); ERCOT and PJM not started; the four Classroom waves not started; the Dominion reframe open until Tue 10/6; Megmeet (row 18) waits on the Q3 filing.
- No dossier, page, GAS or diagram changed. CHANGELOG `Sections: 83/100` (sections dated 2026-10-04 EST exempt; no rotation).

## [v07.87r] — 2026-10-04 01:48:41 AM EST

> **Prompt:** "Picking up from my last session, run repository-information/phase-f-action-plan.md §3 row 8 as a fresh
> session: F-A1 — `profiler Anza`, `profiler SemiAnalysis`, `profiler EPRI` — three new dossiers, one
> session, one commit. Fable 5.1 at High (the plan row said Medium; §11 says why High, and why Opus 5.5
> xhigh is the substitute if the Fable half is short); check Settings → Usage first.
>
> STEP 0 — REBASE FIRST, before any edit: git fetch origin main; git merge-base --is-ancestor origin/main
> HEAD || git rebase origin/main. Read the CHANGELOG counter after the rebase (81/100 at v07.86r — rotate
> the oldest date group only if the NON-EXEMPT count reaches 100; sections dated the day you push are
> exempt; no rotation is expected this session). Run git fetch --unshallow origin main before any pin read.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; phase-f-action-plan.md §3 row 8 and §11 (this
> prompt); PROFILER-COVERAGE-PLAN.md — the three F-A1 rows in §8 (anza · semianalysis · epri) and the F-G1
> rows above them, which show the shape a landed row takes (verified role with its basis, the step-7 tally,
> the premise verdicts naming what the hypothesis row got wrong); the `dnv`, `kwh-analytics` and
> `sargent-lundy` dossiers as the precedent for how an advisor dossier is written (what is sold — ratings,
> data, certification, engineering hours — to whom, and what the firm's independence rests on);
> .claude/rules/profiler-app.md — step 1a (identity), step 2 (two parallel research subagents per company,
> Stage 1 first-party exhaustive, Stage 2 third-party; run check-source-reachability.py before planning
> Stage 2), step 5 including the segment assignment, the `unassigned[]` field and the segment-regeneration
> sub-rule, step 7 (reconciliation by aka[]), the Archival Procedure (no archive — these are new profiles);
> PROFILER-SCHEMA.md (registry schema — the `advisor` category; profile schema v7; Segments registry, its
> evidence rule and `unassigned[]` — `{ "slug", "reason" }`, empty since S0; Refresh calendar: a new company
> gets a calendar row and a notes entry in the same commit — all three are private or non-profit, so
> `cadence` rows); PROFILER-STYLES.md (active style `intel-briefing`); .claude/rules/classroom-app.md (the
> content fence, the verification list, the gateDigest obligation) because the segment sub-rule will fire.
>
> IDENTITY FIRST (step 1a), from a primary source dated within twelve months, before any research prompt:
> - Anza: the plan row has no legal entity. Establish it (the Borrego spin-out of 2022 — confirm the
>   registered name and state, who owns it now, any funding round and investor, and the headcount the
>   company itself states), and what it sells: Energy Storage Pro and the solar module platform as paid
>   data subscriptions, the Transformer Procurement Service (16 December 2025) and commissioning support
>   as services. Category `advisor` unless the evidence is a software product sold on its own terms — then
>   say which and why.
> - SemiAnalysis: the legal entity (confirm the name and state; Dylan Patel's ownership; any outside
>   investor), headcount, and the product set — the Datacenter Industry Model, the Accelerator Model, the
>   China Datacenter Model (25 September 2026), the newsletter, consulting, InferenceMAX and ClusterMAX —
>   and, decisive for how 31 dossiers read it, whether rated companies pay SemiAnalysis for anything and
>   what the ClusterMAX methodology discloses about that. Category `advisor`. The plan row expects NO
>   segment: record `semianalysis` in `unassigned[]` with a one-sentence reason if the dossier's
>   productsAndServices supports no seat — this is the field's first use, so report whether
>   sync-profiler-registry.py, build-profiler-graph.py, build-classroom-segments.py and the checkers
>   handled a populated `unassigned[]` without a change; if one of them needs a fix, make it in the same
>   commit and say so.
> - EPRI: Electric Power Research Institute, Inc. — confirm the 501(c)(3) status, the state of
>   incorporation, the headquarters the current Form 990 and annual report give, the officers, and the
>   revenue and membership-funding figures from the 990 (ProPublica or the IRS copy is primary), not from
>   press; DCFlex (the data-centre flexibility initiative) — its launch date, named members and the
>   demonstrations published; any Open Power AI Consortium facts. Category `advisor`; `ownership` is a
>   non-profit — use the schema's variant and say which.
> Correct the coverage-plan rows in the same commit if any identity fact is stale — in F-I4 and F-G1 every
> row needed correction; expect the same here, starting with the inbound counts (SemiAnalysis 22 on the row
> against 31 by grep today; EPRI 3 against 5).
>
> WHAT THE RECORD ALREADY SAYS — read these dossiers' sentences before writing, because step 7 will hold the
> new dossiers to them (or revise them):
> - SemiAnalysis ← 31 dossiers: alibaba-cloud, amd, amperesand, bytedance, chindata, coolit, coreweave,
>   crusoe, delta-electronics, dg-matrix, firmus, fluidstack, g42, google, heron-power, humain, infineon,
>   iren, lambda, liteon, megmeet, nebius, novos-power, nscale, piller, supermicro, vertiv, vicor,
>   voltagrid, whitefiber, xai. The neocloud dossiers carry ClusterMAX 3.0 (23 September 2026) tiers —
>   CoreWeave and Nebius Platinum, Crusoe Bronze, Lambda Silver, IREN Underperforming, Fluidstack and
>   Nscale 'Unavailable' — and `landscape-neoclouds-2026-09` rests on that rating; the power-conversion
>   and SST dossiers cite SemiAnalysis's 800 VDC and datacenter-model work. The SemiAnalysis dossier must
>   state the rating's method, cadence and independence the way those dossiers rely on it, or name the gap.
>   Expect most hits to be held, not revised, unless a tier or date differs.
> - EPRI ← dominion-energy, kwh-analytics, mitsubishi-power, ppl, wec-energy (DCFlex and research
>   programmes). Anza ← no covered dossier names it (re-check by the full aka[] grep, including 'Anza
>   Renewables' and 'Energy Storage Pro').
>
> RESEARCH: two general-purpose subagents per company (first-party / third-party), ~40–60 sources each
> company (thinner records than F-G1 — do not pad); products-and-services depth first (what each firm
> sells, to whom, at what cadence, and what each publishes free against paid; for SemiAnalysis the
> methodology pages of ClusterMAX and InferenceMAX; for EPRI the programme structure and how members fund
> it; for Anza the data coverage claims — '~95% of the US BESS market' — and how they are substantiated);
> financials — EPRI from the 990 with no `expected`; Anza and SemiAnalysis private — revenue only where the
> company or a named outlet states it, source marked, `expected` empty, never a margin invented. Every
> sec.gov request (there should be few) sends the SEC_USER_AGENT string from
> scripts/check-source-reachability.py. Relationships: curate every covered counterparty the prose names
> (the rated neoclouds, the hyperscalers, the DCFlex members — google, meta, compass-datacenters and the
> utilities — kwh-analytics, dnv, ul-solutions …) with `status`, `since`, `scale` verbatim-short and an exact
> sources[] URL; type advisor↔client edges from the client's side and rating↔rated edges as `other` with
> the tier in `scale` unless the schema names a better type.
>
> SEGMENTS (step 5): decided on each dossier's own evidence under the evidence rule. Anza's plan row
> hypothesises `software-and-optimization` · adjacent — the segment holds flexgen and stem as incumbents,
> fluence, habitat-energy and gridmatic as challengers and fifteen adjacent seats (dnv and ul-solutions
> among them): grant the seat only if the dossier records a software or data product line sold to
> operators or developers; otherwise `unassigned[]`. EPRI's row hypothesises `assurance` · adjacent — the
> segment holds dnv, ul-solutions, intertek and sargent-lundy as incumbents, csa-group as challenger,
> black-veatch and burns-mcdonnell adjacent: grant it only if the dossier records a testing, standards or
> qualification line. SemiAnalysis: none expected — see IDENTITY. Then the sub-rule: python3
> scripts/build-classroom-segments.py --check, regenerate EVERY due segment (--all), bump Classroom.gs
> VERSION v01.96g → v01.97g and live-site-pages/gs-versions/Classroomgs.version.txt, one generic line in
> live-site-pages/gs-changelogs/Classroomgs.changelog.md, the README tree's Classroom display; python3
> scripts/check-classroom-content.py must report 0 errors; node --check on a .js copy of Classroom.gs; node
> scripts/check-gas-inner-scripts.js; python3 scripts/check-classroom-pipeline.py --base origin/main (P1,
> P7, P10 expected; refresh gateDigest only if P3 fires). Do not edit any landscape or scenario lesson —
> `landscape-software-and-optimization` and `landscape-assurance` are wave D's.
>
> CALENDAR: all three take `cadence` rows (`quarterly`) with the tier the private advisors carry (read dnv /
> csa-group / sargent-lundy / kwh-analytics in profiler-refresh-calendar.json — `watch`); no `nextReport`
> row — none is a listed issuer, and say so in the summary. Notes entries with `source` and watch[] (Anza:
> the next data-coverage claim, any funding round, the transformer service's first named data-centre
> client; SemiAnalysis: ClusterMAX 4.0 or the next InferenceMAX, any disclosed commercial relationship with
> a rated company, the China Datacenter Model's next release; EPRI: the next 990, DCFlex demonstration
> results, Open Power AI Consortium membership changes).
>
> STEP 7 by aka[] for all three (populate aka[] first: 'Anza', 'Anza Renewables', 'Energy Storage Pro';
> 'SemiAnalysis', 'ClusterMAX', 'InferenceMAX', 'Dylan Patel' only if the schema allows a person — else
> leave it out; 'EPRI', 'Electric Power Research Institute', 'DCFlex'). Read every hit; revise the other
> dossier where the new research contradicts it (archive + profileVersion +1); state both figures where two
> differ; report counts reviewed and changed. Any neocloud dossier you revise that a current report pins
> must be re-verified by reading in report-pins-verified.json.
>
> VERIFY: check-source-reachability.py first; sync-profiler-registry.py (write, then --check clean);
> build-profiler-graph.py; check-profiler-relationships.py, check-profiler-crossrefs.py, check-profiler-study.py
> clean (accept reviewed candidates with a reason); check-profiler-reports.py — four pre-existing pin
> warnings are expected (fluence v10, jupiter-power v7, jinko v6, oracle v6); check-readme-tree.py 0 findings
> (add the three new profile and study entries and the three curriculum directories); Playwright render of
> the three new dossiers at Profiler.html#<slug> and of Classroom.html#lesson/segment-software-and-optimization
> and #lesson/segment-assurance (if they regenerated), zero page errors other than the sandbox's sign-in
> stubs (the render recipe: serve live-site-pages over 127.0.0.1; for Profiler seed localStorage
> ov_note_session, route script.google.com whoami as admin and abort accounts.google.com; for Classroom
> patch _e='' and AUTO_REFRESH=false on a scratch copy, seed the sessionStorage session after load — the
> boot clears it when whoami fails, so seed it again after load — override window._gasPost after load with
> the lesson literals parsed by check-classroom-content.py's parse_literals, hide
> #auth-wall/.splash/#gas-pill/#verify-overlay, then clHeaderShow(); clAppMount(); set the hash). Study
> guides and study-prep lesson plans for the three new companies per the Profiler Command (lesson plans
> carry the Developed by footer). Normal Pre-Commit and Pre-Push checklists; ONE commit; push on your
> claude/* branch once ls-remote is empty. Before staging, run git diff --stat and re-serialise any JSON
> whose diff is thousands of lines (the originals are 2-space indented).
>
> At the end: one line per company on the identity check (what the plan row got wrong, if anything); the
> segment decisions — Anza's and EPRI's seats granted or withheld with the evidence, and whether
> SemiAnalysis went into `unassigned[]` and how the tooling took it; step-7 counts; the segment count
> regenerated and the content checker's final line; and note that get_session exposes no cost field — give
> the subagent token totals and the rate-limit status instead."

### Added

#### Profiler dossiers (`live-site-pages/profiler-data/`)
- **`anza.profile.json` v1** (116 sources) — Anza RE, LLC (operating as Anza; branded Anza Renewables), Oakland; ECP-led consortium (Energy Transition Opportunities Fund, Angeleno) since the May 2023 separation from Borrego; category `advisor` — the four subscriptions (Energy Storage Pro, Solar Pro, Anza Pulse, Energy Storage DG) are procurement intelligence sold beside a per-watt procurement service, not software on its own terms; eight product lines, five relationships (energy-capital-partners, aypa-power, gridstor, apex-clean-energy, byd), five policy regimes (FEOC, Section 232 polysilicon effective 2026-12-04, FCC Covered List/EO 14421, ITC/45X, AD/CVD), seven decision-makers with four company-published portraits; the coverage claim recorded as a company figure with a moving denominator ('95%' and '85%' on pages of different dates).
- **`semianalysis.profile.json` v1** (116 sources) — SemiAnalysis LLC, a **Florida** LLC (L22000096118), Dylan Patel sole owner as pleaded, no published headquarters; ClusterMAX 1.0/2.0/3.0 editions and the full 3.0 tier table (Platinum CoreWeave and Nebius; Gold Oracle and Google only; Silver Azure, Lambda, TensorWave, Firmus, GMI; Bronze Crusoe, AWS, Together, DigitalOcean, Prime Intellect, Hyperstack; Participation Ribbon Core42, Vultr, Hyperbolic; Underperforming IREN, WhiteFiber, Sharon AI; Unavailable Fluidstack, Nscale, HUMAIN, Alibaba Cloud); 25 relationships — rated↔rater edges typed `other` with the tier in `scale`, anthropic typed `supplier` (Claude Code spend); the fund's four Form D filings read from sec.gov with SEC_USER_AGENT (Fund I USD 400m target, nil sold; SPV I and II fully sold; GCW Access feeder USD 19.8m); the Zhou matters placed in San Francisco Superior Court (arbitration compelled 2026-07-20), not the Northern District; the independence record edition by edition (compensation disclaimer in 1.0 only).
- **`epri.profile.json` v1** (124 sources) — Electric Power Research Institute, Inc., 501(c)(3) scientific research organisation, member-funded; legal domicile **DC** on every Form 990 through FY2024 with a Delaware certificate now posted and a 2026 California foreign registration of the Delaware entity (not California); Palo Alto; FY2024 Form 990 (revenue USD 503,197,591; expenses 516,331,444; 1,475 employees; CEO USD 2,132,369) and FY2025 audited statements (revenues 509,589k; membership 244,374k; supplemental 261,765k) both stated; six product lines (programmes, DCFlex and supplementals with the price list, Open Power AI and SAFERai.power, storage safety and the BESS Failure Incident Database, Powering Intelligence, laboratories); 33 relationships typed from the member's side (`customer` for funders and board seats; `partner` for NVIDIA, Nebius, the DOE safety-plan co-advisors UL Solutions, DNV and CSA Group; `other` for mitsubishi-power's lead-time quote); 28 developments; 12 decision-makers; six policy regimes.
- **Study guides** — `anza.study.json` (10 sections), `semianalysis.study.json` (10), `epri.study.json` (9): technology lessons, not company trivia (price per watt and the compliance layer; how a GPU cloud is tested and what the tiers assert; how a research cooperative is funded and how an incident database becomes a failure rate), each with flashcards and a six-question self-test.
- **Lesson plans** — `repository-information/study-prep/{anza,semianalysis,epri}/<slug>-lesson-plan.md`, six to seven modules each with self-checks, a risk list and sources.
- **Portraits** — four files under `live-site-pages/images/execs/` (anza-mike-hall, anza-aaron-hall, anza-balakrishnan, anza-kline), all company-published.
- **Concepts** — seven registered in `profiler-concepts.json` (Section 232 tariff, UFLPA, MNPI, Form 990, 501(c)(3), demand flexibility, compute benchmark); registry 1,593 → 1,600.

### Changed

#### Profiler registries and step 7
- `profiler-companies.json` — three `advisor` entries (anza, semianalysis, epri) with `aka[]` and `domains[]`; `sync-profiler-registry.py` wrote the denormalised fields and `--check` is clean (208 entries; roster and calendar in bijection). `profiler-graph.json` rebuilt (1,917 edges, 1,444 curated).
- `profiler-segments.json` — `software-and-optimization` += anza adjacent (procurement-side data products, not dispatch/EMS); `grid-equipment` += anza adjacent (the Transformer Procurement Service as a buyer-side channel, no named client); `assurance` += epri adjacent on its testing-and-guidelines line only, the basis stating it issues no certificate; **`unassigned[]` gains its first entry** — semianalysis with a one-sentence reason. `sync-profiler-registry.py`, `build-profiler-graph.py` and `build-classroom-segments.py` all handled the populated field without change; `check-classroom-curriculum.py` prints it; no tool needed a fix.
- `profiler-refresh-calendar.json` / `profiler-refresh-notes.json` — three `quarterly` · `watch` rows (no `nextReport` row: two private firms and a non-profit with fixed April/November disclosure clocks) and three notes entries with `source` and `watch[]`; `lastRefreshed` advanced for the four revised dossiers.
- **Step 7 by `aka[]`** — SemiAnalysis: 31 dossiers reviewed (the plan row said 22), **4 revised** with archives: `iren` v6→v7 (Nebius was Gold in ClusterMAX 2.0/2.1 and Platinum in 3.0 — both stated), `firmus` v1→v2 ('up for the challenge' is Capital Brief's headline; Jordan Nanos's quote restored), `fluidstack` v3→v4 (2.0 Gold was five clouds — Nebius, Oracle, Azure, Crusoe, Fluidstack — among 84 rated), `vertiv` v9→v10 (the ~USD 32bn-by-2030 SST figure is SemiAnalysis's own 26 May 2026 post; third-party summaries carry ~USD 13bn — both stated); amperesand and dg-matrix held against the primary post. EPRI: 5 reviewed (the row said 3), 0 revised — kwh-analytics' 72% held with the known-age nuance, mitsubishi-power's seven-year quote held verbatim, wec-energy's CMBlu pilot held, ppl's past chair held, dominion-energy's board line names Ed Baine and holds. Anza: 0 inbound.
- `report-pins-verified.json` — vertiv pins on `aidc-power-conversion-rev2--competitive--2026-09-25` and `sst-hall-edge-block-rev2--competitive--2026-09-23` re-verified at v10 (cited sources unchanged; neither report carries the SST figure). `profiler-crossref-accepted.json` — iren × semianalysis Prince George candidate accepted (same fact, two tellings; the 'unresolved' marker belongs to the Culper-era class action).

#### Classroom (`googleAppsScripts/Classroom/Classroom.gs` v01.96g → v01.97g)
- `build-classroom-segments.py --check` read 14 segments due (11 with section changes, 3 pin-only); `--all` regenerated them — `assurance`, `software-and-optimization` and `grid-equipment` gained the new adjacent members across their player, numbers, fence and connections sections; the rest re-pinned to the revised dossiers. `check-classroom-content.py`: 71 lessons, 8 tracks, 220 gate cases — 0 errors, 0 warnings. `check-classroom-pipeline.py --base origin/main`: P1 and P10 only (developer-session paths and the 14-lesson count; no P3, so `gateDigest` untouched). No landscape or scenario lesson edited. `Classroomgs.version.txt` → `|v01.97g|`; GAS changelog `Sections: 49/50`.

#### Plans and README
- `PROFILER-COVERAGE-PLAN.md` — the three F-A1 rows in §8 rewritten with roles and bases, step-7 tallies, premise verdicts and `v1` / `✓ v07.87r`; §11.2 row 12 model corrected to Fable 5.1 High.
- `phase-f-action-plan.md` — §3 row 8 marked landed (v07.87r) with the identity corrections; §11.3 ledger gains the F-A1 row; the §1 F-A1 inbound counts corrected to 0 · 31 · 5.
- `README.md` — tree entries for the three profiles, three study guides and three study-prep curricula; Classroom display v01.97g; `check-readme-tree.py` 0 findings.

### Notes
- Verification: `check-source-reachability.py` OK; `check-profiler-relationships.py` 0 findings (21 suppressed); `check-profiler-crossrefs.py` clean after the one accept; `check-profiler-reports.py` 0 errors, the four pre-existing pin warnings (fluence v10, jinko v6, jupiter-power v7, oracle v6); `check-profiler-study.py` 0 errors; Playwright renders of `Profiler.html#anza`, `#semianalysis`, `#epri` and `Classroom.html#lesson/segment-software-and-optimization`, `segment-assurance`, `segment-grid-equipment` — zero page errors beyond the sandbox sign-in stub.
- Formatting: `vertiv.profile.json` and `profiler-concepts.json` re-serialised at their original 1-space indent, `firmus.profile.json` as a textual edit of the original, `report-pins-verified.json` at 2-space — each diff is now the edit alone.
- CHANGELOG `Sections: 82/100` (sections dated 2026-10-04 EST exempt; no rotation).

## [v07.86r] — 2026-10-03 11:05:04 PM EST

> **Prompt:** "give me a prompt to paste into a new session (recommend a model and effort level between Opus 5.5 and Fable 5.1, Medium, High, Xhigh) to run the next row of phase-f-action-plan.md, then remember session."

### Added
- `repository-information/phase-f-action-plan.md` — **§11, the F-A1 paste-in prompt** (`profiler Anza`, `profiler SemiAnalysis`, `profiler EPRI`; §3 row 8). Recommended **Fable 5.1 · High**, raised from the plan's Medium on two facts the row lacked: 31 dossiers cite SemiAnalysis or ClusterMAX today (the row said 22), so step 7 is the session's weight; and SemiAnalysis would be the first entry in the segments registry's `unassigned[]`. Opus 5.5 · xhigh named as the substitute if the Fable half is short (none of the three is a 10-K filer; EPRI's Form 990 is the one long filing). The prompt carries the identity hypotheses, the 31 citing dossiers by slug, the two segments' current shape, `cadence`/`watch` calendar rows, the Classroom bump v01.96g → v01.97g and the render recipe with the seed-after-load fix.

### Changed
- `repository-information/phase-f-action-plan.md` — §3 row 8 re-timed to Sun 10/4 or Mon 10/5, pointed at §11, model cell `high`; §2's effort table moves F-A1 from the medium row to the high row with the reason.
- `repository-information/SESSION-CONTEXT.md` — Latest Session written for the F-G1 session (identity corrections, the Faith category basis, roles, step 7, calendar, Classroom v01.96g, the §11 decision); previous entry rotated down under the 2-session cap.

### Notes
- No dossier, page, GAS or diagram changed. CHANGELOG `Sections: 81/100` (four sections dated 2026-10-03 EST exempt; no rotation).

## [v07.85r] — 2026-10-03 10:30:29 PM EST

> **Prompt:** "Picking up from my last session, run repository-information/phase-f-action-plan.md §3 row 7 as a fresh
> session: F-G1 — `profiler Clayco`, `profiler Faith Technologies`, `profiler EMCOR` — three new dossiers,
> one session, one commit. Fable 5.1 at High; check Settings → Usage first.
> 
> STEP 0 — REBASE FIRST, before any edit: git fetch origin main; git merge-base --is-ancestor origin/main
> HEAD || git rebase origin/main. Read the CHANGELOG counter after the rebase (79/100 at v07.84r after the
> 2026-09-21 group rotated — rotate the oldest date group only if the NON-EXEMPT count reaches 100; sections
> dated the day you push are exempt; no rotation is expected this session). Run git fetch --unshallow origin
> main before any pin read.
> 
> READ FIRST: repository-information/SESSION-CONTEXT.md; phase-f-action-plan.md §3 row 7 and §10 (this
> prompt); PROFILER-COVERAGE-PLAN.md — the three F-G1 rows in §8 (clayco · faith-technologies · emcor) and
> the F-I4 rows directly below them, which show the shape a landed row takes (verified role with its basis,
> the step-7 tally, the premise verdicts naming what the hypothesis row got wrong); the `hitt`, `mccarthy`
> and `rosendin` dossiers as the precedent for how a contractor dossier is written (self-perform scope,
> contractor-furnished equipment, the ranking sources used as evidence); .claude/rules/profiler-app.md — step
> 1a (identity), step 2 (two parallel research subagents per company, Stage 1 first-party exhaustive, Stage 2
> third-party; run check-source-reachability.py before planning Stage 2), step 5 including the segment
> assignment and the segment-regeneration sub-rule, step 7 (reconciliation by aka[]), the Archival Procedure
> (no archive — these are new profiles); PROFILER-SCHEMA.md (registry schema — the `gc` and `epc` categories
> render as "General Contractor" and "EPC"; profile schema v7; Segments registry and its evidence rule; Refresh
> calendar: a new company gets a calendar row and a notes entry in the same commit — `nextReport` for a listed
> issuer, `cadence` for a private one); PROFILER-STYLES.md (active style `intel-briefing`);
> .claude/rules/classroom-app.md (the content fence, the verification list, the gateDigest obligation)
> because the segment sub-rule will fire.
> 
> IDENTITY FIRST (step 1a), from a primary source dated within twelve months, before any research prompt:
> - Clayco: the legal entity (Clayco, Inc., Chicago — confirm the state of incorporation and whether it is
>   still privately held by Bob Clark and management; any ESOP or outside investor), its design-build
>   affiliates (Lamar Johnson Collaborative, Concrete Strategies, Ventana, Treanor — confirm the current set),
>   and what 'Clayco Compute' (announced January 2025) is legally — a division, a subsidiary or a brand.
>   Category `gc`.
> - Faith Technologies: the legal entity (Faith Technologies Incorporated, Menasha, Wisconsin) and its
>   ownership — the plan row says 'private, employee-owned'; confirm whether that is an ESOP, a family
>   holding or management ownership, from the company's own statement or a filing, not from press. DECIDE
>   THE CATEGORY ON THE RECORD: `epc` if the dossier's evidence is contracting revenue and self-performed
>   electrical scope; `supplier` only if Excellerate's manufactured power modules are sold as products to
>   third parties at a scale the dossier can state. Write the decision and its basis in the coverage-plan
>   row's premise verdicts and in the dossier's ecosystemRole. Both categories are allowed if the evidence
>   supports both — say why.
> - EMCOR: EMCOR Group, Inc. (NYSE: EME), a Delaware corporation — the FY2025 10-K, the Q2 2026 10-Q and
>   the Q2 2026 earnings release are first-party; take revenue by segment, the network and communications
>   (data centre) market revenue, remaining performance obligations and the Miller Electric purchase
>   (closed February 2025 — confirm the date and price from the 8-K, not the plan row's 'Feb 2025') from
>   there. Fiscal year ends 31 December. `ownership` public.
> Correct the coverage-plan rows in the same commit if any identity fact is stale — in F-I4 all three rows
> needed correction; expect the same here.
> 
> WHAT THE RECORD ALREADY SAYS — read these dossiers' sentences before writing, because step 7 will hold the
> new dossiers to them (or revise them):
> - Clayco ← `hitt` v5, `holder-construction` v5, `mccarthy` v5, `mortenson` v7, `whiting-turner` v1: each cites BD+C's
>   2025 data-centre ranking with Clayco fourth behind HITT, Holder and DPR (USD 3.64bn of 2024 data-centre
>   revenue per the plan row — verify the figure and the ranking year against BD+C itself). The Clayco
>   dossier must agree with that ranking or state the gap; if a 2026 BD+C ranking has been published since,
>   record both years and set the role on the newer one.
> - Faith Technologies ← no covered dossier names it (plan-row count 0 — re-check by the full aka[] grep,
>   including 'Excellerate' and 'FTI'). Its evidence will be its own: ABC's 2026 top data-centre contractor
>   listing, the 950+ MW of greenfield data-centre work, the Excellerate factory and the 2 MW prefabricated
>   power modules (whose buyers, if any, are named).
> - EMCOR ← no covered dossier names it (plan-row count 0 — re-check, including 'Miller Electric' and the
>   subsidiary brands the 10-K lists). The record is the SEC filings: segment revenue (US electrical and
>   mechanical construction), the network and communications market line (USD 973M electrical and USD 799M
>   mechanical in Q2 2026 per the plan row — verify), RPO (USD 17.14bn per the plan row — verify) and the
>   10-K's own description of what it self-performs and what it procures.
> 
> RESEARCH: two general-purpose subagents per company (first-party / third-party), ~50–70 sources each
> company; products-and-services depth first (what each contractor self-performs — electrical, mechanical,
> prefabrication, commissioning — against what it subcontracts; which equipment it furnishes under its own
> purchase orders and which the owner furnishes; the named hyperscaler and developer customers each will
> state); financials — EMCOR from the filings with `expected` from published consensus where it exists;
> Clayco and Faith are private, so revenue is what ENR or BD+C publish or the company states, each marked
> with its source, and `expected` stays empty — never invent a margin. Every sec.gov request sends the
> SEC_USER_AGENT string from scripts/check-source-reachability.py. Relationships: curate every covered
> counterparty the prose names (hitt, holder-construction, dpr, turner-construction, mccarthy, mortenson,
> whiting-turner, rosendin, schneider-electric, vertiv, eaton, cummins, caterpillar, the hyperscalers and
> developers each names …) with `status`, `since`, `scale` verbatim-short and an exact sources[] URL; type
> contractor↔supplier edges `supplier`/`customer` and contractor↔owner edges from the owner's side.
> 
> SEGMENTS (step 5): all three go in `epc-and-construction`; the role is decided on each dossier's own
> evidence under the evidence rule — the segment holds sixteen incumbents (Turner, HITT, DPR, Holder,
> Whiting-Turner, Mortenson, Kiewit, Bechtel, Black & Veatch, Burns & McDonnell, Quanta, Rosendin, Primoris,
> MasTec, SOLV, Blattner) and two challengers (McCarthy, Samsung C&T). Clayco's plan row leaves incumbent
> or challenger open — decide it against the ranking the incumbents' own dossiers cite. Faith's
> `in-hall-power` adjacent seat is granted only if the dossier records Excellerate's power modules as a
> product line with named third-party buyers — the plan row's hypothesis, not evidence. EMCOR takes no
> adjacent seat unless its dossier records a product line. Then the sub-rule: python3
> scripts/build-classroom-segments.py --check, regenerate EVERY due segment (--all), bump Classroom.gs
> VERSION v01.95g → v01.96g and live-site-pages/gs-versions/Classroomgs.version.txt, one generic line in
> live-site-pages/gs-changelogs/Classroomgs.changelog.md, the README tree's Classroom display; python3
> scripts/check-classroom-content.py must report 0 errors; node --check on a .js copy of Classroom.gs; node
> scripts/check-gas-inner-scripts.js; python3 scripts/check-classroom-pipeline.py --base origin/main (P1,
> P2, P10 expected; refresh gateDigest only if P3 fires). Do not edit any landscape or scenario lesson —
> `landscape-epc-and-construction` and `landscape-in-hall-power` are wave D's.
> 
> CALENDAR: EMCOR takes a `nextReport` row — read its Q3 2026 release date from the company's investor
> calendar or the Q3 2025 precedent and mark it unconfirmed if only inferred; Clayco and Faith take
> `cadence` rows (`quarterly`) with the tier the other private GCs carry (read hitt / mccarthy /
> holder-construction in profiler-refresh-calendar.json); notes entries with `source` and watch[] (Clayco:
> the next BD+C and ENR rankings, Clayco Compute's first named campus, any ownership change; Faith: the
> category decision's trigger — a third-party Excellerate order — and the ABC listing; EMCOR: the Q3 2026
> release, RPO, the network and communications line, any further acquisition). State in the summary why
> EMCOR is the one `nextReport` row.
> 
> STEP 7 by aka[] for all three (populate aka[] first: 'Clayco', 'Clayco Compute', 'Clayco Inc', the
> affiliate names; 'Faith Technologies', 'FTI', 'Excellerate'; 'EMCOR', 'EMCOR Group', 'Miller Electric'
> and the 10-K's subsidiary brands). Read every hit; revise the other dossier where the new research
> contradicts it (archive + profileVersion +1); state both figures where two differ; report counts reviewed
> and changed. Expect the five BD+C-ranking mentions of Clayco to be the bulk — they are held, not revised,
> unless the ranking figure differs.
> 
> VERIFY: check-source-reachability.py first; sync-profiler-registry.py (write, then --check clean);
> build-profiler-graph.py; check-profiler-relationships.py, check-profiler-crossrefs.py, check-profiler-study.py
> clean (accept reviewed candidates with a reason); check-profiler-reports.py — four pre-existing pin
> warnings are expected (fluence v10, jupiter-power v7, jinko v6, oracle v6); any dossier you revise in step 7
> that a current report pins must be re-verified by reading in report-pins-verified.json; check-readme-tree.py
> 0 findings (the README tree lists every profile, study and archive file and every study-prep directory —
> add the three new profile and study entries and the three curriculum directories); Playwright render of
> the three new dossiers at Profiler.html#<slug> and of Classroom.html#lesson/segment-epc-and-construction
> (and segment-in-hall-power if it regenerated), zero page errors other than the sandbox's sign-in stubs
> (the render recipe: serve live-site-pages over 127.0.0.1; for Profiler seed localStorage ov_note_session,
> route script.google.com whoami as admin and abort accounts.google.com; for Classroom patch _e='' and
> AUTO_REFRESH=false on a scratch copy, seed the sessionStorage session after load, override window._gasPost
> after load with the lesson literals parsed by check-classroom-content.py's parse_literals, hide
> #auth-wall/.splash/#gas-pill/#verify-overlay, then clHeaderShow(); clAppMount(); clRoute()). Study guides
> and study-prep lesson plans for the three new companies per the Profiler Command (lesson plans carry the
> Developed by footer). Normal Pre-Commit and Pre-Push checklists; ONE commit; push on your claude/* branch
> once ls-remote is empty.
> 
> At the end: one line per company on the identity check (what the plan row got wrong, if anything); Faith
> Technologies' category decision and its basis; the three epc-and-construction roles and any adjacent
> memberships; step-7 counts; the segment count regenerated and the content checker's final line; and note
> that get_session exposes no cost field — give the subagent token totals and the rate-limit status instead."

F-G1 ran as one session with six research subagents (two per company: first-party, then third-party), 1,940,411 subagent tokens in all. The identity check corrected or sharpened every plan row before research began: Clayco's row named Treanor as an affiliate (it is not — Clayco Design & Engineering merged into Lamar Johnson Collaborative on 8 January 2026) and carried Galaxy's Helios campus as a Clayco win (Phase 2, 260 MW, moved to HITT in 2026); Faith Technologies' row left the category open and assumed an ESOP (Department of Labor Form 5500 filings show a 401(k), a 401(a) and a welfare plan holding no employer securities — an S corporation under direct employee shareholding); EMCOR's row proposed `challenger` and "ENR No. 1" (ENR ranks EMCOR second; Q2 2026 network-and-communications revenue of USD 973m electrical and USD 799m mechanical and USD 17.1bn of remaining performance obligations make it the segment's largest incumbent). Faith Technologies is filed as `epc`, not `supplier`: every revenue figure on the record is contracting revenue and every reachable description of the Excellerate factories' output routes it to FTI's own sites; Excellerate Products (OEM, April 2026) has buyer terms and a sales manager but no named third-party purchaser, so the adjacent `in-hall-power` seat is withheld — the first named outside buyer is the trigger recorded in the refresh note.

### Added

#### Profiler dossiers (`live-site-pages/profiler-data/`)
- **`clayco.profile.json` v1** (75 sources) — Clayco, Inc., Missouri corporation (f/k/a Clayco Construction Company), Chicago since 2013, privately owned (Bob Clark "owns most"; Bloomberg-reported 40% held by executives); category `gc`; Clayco Compute is a business unit, not an entity; BD+C 2025 data-centre No. 4 on USD 3,640,000,000 (publisher CSV: HITT 6.74bn, Holder 6.48bn, DPR 3.65bn, Turner 3.61bn), ENR 2026 Top 400 No. 20 on USD 8.1bn; six product lines, 21 developments, 17 relationships (HITT, Holder, McCarthy, Whiting-Turner and the covered owners), three policy exposures, eight decision-makers with six company-published portraits; financials private, `expected` empty.
- **`faith-technologies.profile.json` v1** (78 sources) — Faith Technologies, Inc., Wisconsin (DFI F033755), S corporation under direct employee shareholding; category `epc`; EC&M 2026 No. 9 on USD 2,283,638,907 of 2025 electrical sales (+62.64%), ABC No. 1 high-tech/data-centre contractor by hours in 2025 and 2026, ENR specialty No. 32 on 2023 revenue; Excellerate's five ~500,000 sq ft plants announced November 2025 to August 2026 and the Excellerate Products OEM line; EnTech Solutions; six product lines, 21 developments, nine relationships (`emcor` competitor, Mortenson and Turner at Meta Lebanon); NEVI and state-incentive exposure.
- **`emcor.profile.json` v1** (67 sources) — EMCOR Group, Inc., Delaware, NYSE: EME; Miller Electric bought from its ESOP trust on 3 February 2025 for USD 865m cash (USD 876.8m after adjustments, per the 8-K and 10-K); public financials with a KPI overlay (revenue, operating profit, net income, EPS, backlog/RPO, `fxBasis` as reported) for Q2 2026, Q1 2026, FY2025 and FY2024 with consensus from Zacks, Nasdaq and GuruFocus; five product lines, 20 developments, seven relationships (`faith-technologies` competitor, `amd` historical), four policy exposures, five portraits.
- **Study guides** — `clayco.study.json` (11 sections), `faith-technologies.study.json` (12), `emcor.study.json` (10): technology lessons, not company trivia (delivery methods and who holds the risk, self-perform, speed to power, bitcoin-to-AI conversion, liens; the electrical power path, owner- against contractor-furnished equipment, prefabrication hours, the 2 MW power module, merit against union shop, three kinds of employee ownership; percentage-of-completion reporting, RPO and backlog conversion, fixed price against GMP and cost-plus, reading a beat). Guide-local glossaries only; no concepts-registry additions.
- **Lesson plans** — `repository-information/study-prep/{clayco,faith-technologies,emcor}/<slug>-lesson-plan.md`, eight modules each with self-checks, a risk list and sources.
- **Portraits** — 12 files under `live-site-pages/images/execs/` (six Clayco, one Faith Technologies, five EMCOR), all company-published.

### Changed

#### Profiler dossiers — step 7 reconciliation by `aka[]`
- 12 raw hits across the corpus (Clayco 9: `hitt` 3, `holder-construction` 1, `mccarthy` 2, `whiting-turner` 3; Faith Technologies 3: `aypa-power` 1 — an FTI Consulting name collision, not Faith — and `mortenson` 2; EMCOR 0); every hit read, **0 dossiers revised**, no archives. The HITT and Whiting-Turner mentions already carry the Helios hand-off and the Mortenson mentions already describe Meta Lebanon as the research found them.
- `profiler-companies.json` — three entries with `aka[]` (Clayco Compute, CRG, LJC, Concrete Strategies, Ventana; FTI, Excellerate, EnTech Solutions, Town & Country Electric, SKC Electric; Miller Electric, Dynalectric, Shambaugh & Son and the other EMCOR brands) and `domains[]` (205 companies); `profiler-segments.json` — `epc-and-construction` gains `clayco` incumbent, `emcor` incumbent and `faith-technologies` challenger, each with its evidence line, no adjacent seats; `profiler-graph.json` rebuilt (1,834 edges, 1,381 curated; 5,467 evidence items).
- `repository-information/profiler-refresh-calendar.json` — `clayco` and `faith-technologies` `cadence: quarterly`, tier `core` (the tier the private GCs carry); `emcor` is the one `nextReport` row (2026-10-29, `confirmed: false` — inferred from the 2025 and 2026 Q2/Q3 release spacing, no investor-calendar date published; a public issuer measured against consensus). `profiler-refresh-notes.json` — one note per slug with `source` and `watch[]` (Faith's first watch item is the category trigger; Clayco's the BD+C 2026 table and the 7.6bn/8.1bn revenue conflict; EMCOR's the Q3 date and RPO).

#### Classroom (`googleAppsScripts/Classroom/Classroom.gs`)
- **All 19 segment lessons regenerated** under the step-5 sub-rule (`build-classroom-segments.py --check` → due; `--all`); 12 changed content — `segment-epc-and-construction` now carries the three new contractors and `segment-in-hall-power`, `segment-capital` and nine others picked up the rebuilt graph — and seven came out identical. `VERSION` v01.95g → v01.96g, `Classroomgs.version.txt` and the README display to match; `Classroomgs.changelog.md` one generic line (`Sections: 48/50`). No landscape or scenario lesson edited.

#### Repository documents
- `repository-information/PROFILER-COVERAGE-PLAN.md` — the three F-G1 rows rewritten with the verified identities, roles and role basis, the Faith category basis, step-7 tallies and premise verdicts; `repository-information/phase-f-action-plan.md` — §3 row 7 marked landed (v07.85r).
- `README.md` — three profile, three study-guide and three curriculum entries added; Classroom GAS display v01.96g.

### Notes
- **Checkers.** `check-source-reachability.py` OK (every disclosure-tier host 200); `sync-profiler-registry.py --check` clean, roster/calendar bijection 0 findings; relationships 0 findings (21 suppressed by the accept list), crossrefs 0 candidates (17 suppressed), study checker 203 guides 0 errors; `check-profiler-reports.py` the four pre-existing pin warnings only (fluence v10, jupiter-power v7, jinko v6, oracle v6; no pinned dossier revised); `check-classroom-content.py`: `71 lesson(s), 8 track(s), 220 gate case(s) — 0 error(s), 0 warning(s)`; `node --check` ok, `check-gas-inner-scripts.js` 106 blocks clean; `check-classroom-pipeline.py --base origin/main` 37 findings, all P1 (paths), P7 (same-day `updated` stamps on regenerated segments) and P10 (12 revised lessons over the cap of 3) — no P3, so no `gateDigest` refresh; `check-readme-tree.py` 0 findings; Playwright: the three dossiers render with BLUF and no auth wall, `segment-epc-and-construction` (10 sections, 187 rows) and `segment-in-hall-power` (10 sections, 300 rows) render; only the sandbox sign-in stubs (`net::ERR_FAILED`, `gis_load_failed`, `ERR_CERT_AUTHORITY_INVALID`) in the console.
- **CHANGELOG counter.** 80/100 after this section with three sections dated 2026-10-03 EST exempt (77 non-exempt) — no rotation.
- **Subagent usage.** Six general-purpose subagents, 1,940,411 tokens (269,709 · 343,727 · 332,313 · 323,699 · 288,910 · 382,053); no rate-limit event during the session. `SEC_USER_AGENT` sent to sec.gov and data.sec.gov only; `CORPUS_TOKEN` not used.
- No page HTML, no diagram changed.

## [v07.84r] — 2026-10-03 09:18:17 PM EST

> **Prompt:** "give me a prompt to paste into a new Fable 5.1 High session to run F-G1, then remember session."

### Added
- `repository-information/phase-f-action-plan.md` — **§10 = the F-G1 paste-in prompt** (Clayco · Faith Technologies · EMCOR, Fable 5.1 High): identity-first with the Faith Technologies category decision (`epc` or `supplier`) to be made on the record; EMCOR as the one listed name taking a `nextReport` calendar row; the five BD+C-ranking dossiers that already name Clayco as the step-7 baseline; the `epc-and-construction` roster (16 incumbents, 2 challengers) and the evidence-rule test for Faith's hypothesised `in-hall-power` adjacent seat; the step-5 sub-rule with Classroom v01.95g → v01.96g; `landscape-epc-and-construction` and `landscape-in-hall-power` reserved for wave D.

### Changed
- `repository-information/phase-f-action-plan.md` — §3 row 7 re-timed to the next session and pointed at §10, with the calendar and segment consequences spelled out.
- `repository-information/SESSION-CONTEXT.md` — Latest Session written for the 10/3 F-I4 pass (remember session); the 10/2 neoclouds entry moves to Previous Sessions and the earnings-desk entry drops under the 2-session cap.

### Notes
- **No page, GAS script or diagram changed.** Counter 79/100 — two sections dated 2026-10-03 are exempt (77 non-exempt), so no rotation.

## [v07.83r] — 2026-10-03 08:54:06 PM EST

> **Prompt:** "Picking up from my last session, run repository-information/phase-f-action-plan.md §3 row 6 as a fresh
> session: F-I4 — `profiler Quinbrook Infrastructure Partners`, `profiler Energy Capital Partners`,
> `profiler CPP Investments` — three new dossiers, one session, one commit. Fable 5.1 at High; check
> Settings → Usage first.
> 
> STEP 0 — REBASE FIRST, before any edit: git fetch origin main; git merge-base --is-ancestor origin/main
> HEAD || git rebase origin/main. Read the CHANGELOG counter after the rebase (100/100 at v07.82r with three
> sections dated 2026-10-02 exempt — rotate the oldest date group only if the NON-EXEMPT count reaches 100;
> sections dated the day you push are exempt). Run git fetch --unshallow origin main before any rotation or
> pin read.
> 
> READ FIRST: repository-information/SESSION-CONTEXT.md; phase-f-action-plan.md §3 row 6 and §9 (this
> prompt); PROFILER-COVERAGE-PLAN.md — the three F-I4 rows in §8 (quinbrook · energy-capital-partners ·
> cpp-investments) and the C-I/C10 row for Blackstone · Brookfield · Macquarie, which is the precedent for
> how investor dossiers go wrong (transaction-value headlines read as equity prices; 'seeded' written for
> 'acquired'; vehicle sets asserted from secondary accounts); .claude/rules/profiler-app.md — step 1a
> (identity), step 2 (two parallel research subagents per company, Stage 1 first-party exhaustive, Stage 2
> third-party; run check-source-reachability.py before planning Stage 2), step 5 including the segment
> assignment and the segment-regeneration sub-rule, step 7 (reconciliation by aka[]), the Archival Procedure
> (no archive — these are new profiles); PROFILER-SCHEMA.md (registry schema — `investor` category; profile
> schema v7; Segments registry; Refresh calendar: a new company gets a calendar row and a notes entry in the
> same commit); PROFILER-STYLES.md (active style `intel-briefing`); .claude/rules/classroom-app.md (the
> content fence, the verification list, the gateDigest obligation) because the segment sub-rule will fire.
> 
> IDENTITY FIRST (step 1a), from a primary source dated within twelve months, before any research prompt:
> - Quinbrook: the legal entity (Quinbrook Infrastructure Partners Limited and its Australian and US
>   affiliates), who owns it (founders David Scaysbrook and Rory Quinlan — confirm), its funds (Quinbrook
>   Renewables Impact Fund (Jersey); Renewables Impact Fund II, GBP 587M oversubscribed close announced
>   8 July 2026; the Net Zero Power Fund; any US fund), and whether it is still independent.
> - Energy Capital Partners: a subsidiary of Bridgepoint Group plc (LSE: BPT) since August 2024 — type
>   `ownership` subsidiary and take the facts from Bridgepoint's annual report and RNS, not from ECP's own
>   'about' page; the ECP legal entity and the funds (ECP V, the continuation vehicles).
> - CPP Investments: the Canada Pension Plan Investment Board, a federal Crown corporation; fiscal year ends
>   31 March; the FY2026 annual report (May 2026) and the quarterly results releases are first-party; net
>   assets and the Real Assets / Sustainable Energies group figures come from there, not from press.
> Correct the coverage-plan rows in the same commit if any identity fact is stale.
> 
> WHAT THE RECORD ALREADY SAYS — read these dossiers' sentences before writing, because step 7 will hold the
> new dossiers to them (or revise them):
> - Quinbrook ← `habitat-energy` v3 (23 mentions): wholly acquired Habitat 30 Nov 2021; the ownership chain
>   Habitat Energy Limited → Renewable and Grid Services Limited → (ceased) Renewables Impact Holding
>   Limited, Jersey → Quinbrook Renewables Impact Fund; the May 2026 PSC07/PSC08 register correction; the
>   JLL/BCG sale mandate (New Project Media, 17 March 2026) with no public step since; the FY2025 accounts of
>   both UK companies OVERDUE at 2 October 2026; Quinbrook's portfolio page still 'Operational & Expanding';
>   Flexitricity sold to Drax (GBP 36M EV, signed 21 Jan 2026). The Quinbrook dossier tells the sale from the
>   seller's side and must agree with Habitat v3 or state the gap — never a second, differing account.
>   Also on the record from the coverage plan: Supernode (Brisbane; stage 2 operational 28 July 2026) and
>   Rowan Digital Infrastructure (a reported Blackstone minority stake, April 2026 — verify).
> - ECP ← `proenergy` v4 (majority owner since 5 Sep 2024), `kkr` v1 (the USD 50bn KKR–ECP partnership;
>   Bosque County with CyrusOne), `cyrusone` v2, `talen-energy` v3 (Cornerstone sold to Talen; ECP took about
>   5% of Talen at the June 2026 close), `vistra` v4 (chairman Scott Helm is an ECP founding partner),
>   `terra-gen` v5 ('ECP is fully OUT' — exited to Masdar, 1 Oct 2024). Calpine → Constellation (closed
>   7 Jan 2026 per the plan row — verify the date and ECP's residual stake); EnergySolutions (pending?).
> - CPP ← `pattern-energy` v1 (majority since the March 2020 take-private; Cordelio folded in 2 Apr 2026,
>   CPP-led ownership ~69%), `grid-united` v1 and `blackrock` v1 (ALLETE/Minnesota Power with GIP, closed
>   Dec 2025), `equinix` v7 (the >USD 15bn US xScale JV, CPP 37.5%; atNorth), `kkr` v1 (45% of Sempra
>   Infrastructure Partners with KKR — signed, check closing), `blackstone` v2 and `macquarie` v2 (12% of
>   AirTrunk alongside Blackstone), `voltagrid` v5 and `mainspring-energy` v4 (earlier-round investor). The
>   plan row adds atNorth ~51% (closed 2 Sep 2026) — verify from CPP's or Partners Group's release.
> 
> RESEARCH: two general-purpose subagents per company (first-party / third-party), ~50–70 sources each
> company; products-and-services depth first (funds, strategies, the AIDC and storage positions as the
> 'product lines'); financials for a manager are AUM/net assets, fund sizes and closes, realised exits —
> never invent a revenue line; `expected` stays empty. Every sec.gov request sends the SEC_USER_AGENT
> string from scripts/check-source-reachability.py. Relationships: curate every covered counterparty the
> prose names (habitat-energy, proenergy, kkr, cyrusone, talen-energy, vistra, terra-gen, pattern-energy,
> grid-united, blackrock, equinix, blackstone, macquarie, voltagrid, mainspring-energy, constellation-energy
> …) with `status`, `since`, `scale` verbatim-short and an exact sources[] URL; type the owner side
> `investor`/`portfolio` correctly (the `portfolio` inverse exists since 2026-09-06).
> 
> SEGMENTS (step 5): all three go in `capital`; the role is decided on each dossier's own evidence — the
> plan row types Quinbrook challenger; ECP and CPP are open (the segment holds six incumbents: Blackstone,
> Brookfield, Macquarie, MGX, BlackRock, KKR). Add `adjacent` memberships only where the dossier records a
> product line or buyer/supplier position in another segment (CPP's Pattern and ALLETE control are
> holdings, not a product line — argue it from the dossier, not the holding). Then the sub-rule: python3
> scripts/build-classroom-segments.py --check, regenerate EVERY due segment (--all), bump Classroom.gs
> VERSION v01.94g → v01.95g and live-site-pages/gs-versions/Classroomgs.version.txt, one generic line in
> live-site-pages/gs-changelogs/Classroomgs.changelog.md, the README tree's Classroom display; python3
> scripts/check-classroom-content.py must report 0 errors; node --check on a .js copy of Classroom.gs; node
> scripts/check-gas-inner-scripts.js; python3 scripts/check-classroom-pipeline.py --base origin/main (P1,
> P2, P10 expected; refresh gateDigest only if P3 fires). Do not edit any landscape or scenario lesson —
> `landscape-capital` is wave B's.
> 
> CALENDAR: three cadence rows (`quarterly`) with the tier the other `capital` investors carry (read
> blackrock/kkr in profiler-refresh-calendar.json) unless the record argues otherwise; notes entries with
> `source` and watch[] (Quinbrook: the Habitat sale, the overdue group accounts, Fund II deployments; ECP:
> Bridgepoint's results, the KKR partnership's next campus, EnergySolutions; CPP: the quarterly results
> cadence, Sempra closing, Pattern's next move). State in the summary why CPP stays a cadence row rather than
> a nextReport row.
> 
> STEP 7 by aka[] for all three (populate aka[] first: 'Quinbrook', 'QIP', fund names; 'ECP', 'Energy
> Capital Partners'; 'CPPIB', 'Canada Pension Plan Investment Board', 'CPP Investments'). Read every hit;
> revise the other dossier where the new research contradicts it (archive + profileVersion +1); state both
> figures where two differ; report counts reviewed and changed.
> 
> VERIFY: check-source-reachability.py first; sync-profiler-registry.py (write, then --check clean);
> build-profiler-graph.py; check-profiler-relationships.py, check-profiler-crossrefs.py, check-profiler-study.py
> clean (accept reviewed candidates with a reason); check-profiler-reports.py — four pre-existing pin
> warnings are expected (fluence v10, jupiter-power v7, jinko v6, oracle v6); any dossier you revise in step 7
> that a current report pins must be re-verified by reading in report-pins-verified.json; check-readme-tree.py
> 0 findings (the README tree lists every profile and archive file — add the three new profile and study
> entries); Playwright render of the three new dossiers at Profiler.html#<slug> and of
> Classroom.html#lesson/segment-capital, zero page errors other than the sandbox's sign-in stubs (the
> render recipe: serve live-site-pages over 127.0.0.1, stub script.google.com whoami as admin for Profiler;
> for Classroom patch _e='' and AUTO_REFRESH=false on a scratch copy, seed the sessionStorage session after
> load, override window._gasPost after load with the lesson literals parsed by
> check-classroom-content.py's parse_literals, hide #auth-wall/.splash/#gas-pill/#verify-overlay, then
> clHeaderShow(); clAppMount()). Study guides for the three new companies per the Profiler Command. Normal
> Pre-Commit and Pre-Push checklists; ONE commit; push on your claude/* branch once ls-remote is empty.
> 
> At the end: one line per company on the identity check (what the plan row got wrong, if anything); the
> three capital roles and any adjacent memberships; step-7 counts; the segment count regenerated and the
> content checker's final line; and note that get_session exposes no cost field — give the subagent token
> totals and the rate-limit status instead."

F-I4 ran as one session with six research subagents (two per company: first-party, then third-party), 2,304,771 subagent tokens in all. The identity check corrected every plan row before research began: Quinbrook's row described The Information's 49% / ~USD 3.8bn Rowan figures as if announced and missed Rory Quinlan's UK-board resignation (TM01, 18 July 2025 — he remains Managing Partner and a control person); ECP's row had EnergySolutions backwards (ECP is the buyer, agreed 6 April 2026) and the brief's 'USD 36.0bn' was Bridgepoint's EUR 36.0bn segment AUM; CPP's row called the Equinix xScale position 'limited partner' when the 8-K exhibit states a 37.5% controlling interest. All three are `investor` dossiers in `capital`: CPP Investments incumbent, Energy Capital Partners and Quinbrook challengers; Quinbrook alone takes adjacent memberships (`storage-developers-and-ipps`, `aidc-developers-and-landlords`) because Primergy, GlidePath, Supernode and Rowan are its own development lines — ECP's and CPP's holdings are not product lines, so no adjacent rows.

### Added

#### Profiler dossiers (`live-site-pages/profiler-data/`)
- **`quinbrook.profile.json` v1** (84 sources) — founder-owned value-add manager (Quinbrook Holdings Limited, Jersey; Form ADV regulatory AUM USD 8.95bn, 28 July 2026); the one capital-segment investor whose own team signs equipment contracts (Supernode with CATL; the Rassau and Thistle synchronous condensers); Rowan Digital Infrastructure with Blackstone's 'significant minority' (9 April 2026, terms undisclosed — the 49% / USD 3.8bn marked reported); Habitat Energy's reported sale (JLL/BCG, March 2026) seven months silent with FY2025 accounts overdue at Companies House on 3 October 2026; Flexitricity sold to Drax (GBP 36m EV, completed 31 March 2026); Quinbrook III in market (USD 4bn target per the UK accounts; Form D USD 30m first sales). Eight decision-makers with company-published portraits (`images/execs/quinbrook-*.jpg`). Relationships: `habitat-energy` portfolio, `blackstone` partner, `catl` and `ge-vernova` suppliers, `brookfield` other.
- **`energy-capital-partners.profile.json` v1** (69 sources) — Bridgepoint Group plc's Infrastructure segment since 20 August 2024 (ownership `subsidiary`, LSE: BPT); Calpine sold to Constellation (closed 7 January 2026, USD 33bn EV) and Cornerstone to Talen; ECP VI final close USD 8.1bn (6 August 2026); majority of ProEnergy (Bloomberg: ~USD 275m for ~60%; IPO at USD 40–50bn weighed), Convergent wholly owned, Atlantica, Grain LNG (ECP VI's first deal), EnergySolutions re-acquisition and the DCC Energy offer with KKR; the USD 50bn KKR–ECP partnership and CyrusOne DFW10 beside Calpine's Thad Hill plant. Financials are the parent's segment figures and the fund table (ECP III–VI) — no revenue invented, every `expected` empty. Relationships: `proenergy`, `talen-energy`, `constellation-energy`, `terra-gen` (historical) portfolio; `kkr`, `cyrusone` partner; `cpp-investments` partner (historical, Calpine); `vistra`, `blackstone`, `nextera-energy-resources` other.
- **`cpp-investments.profile.json` v1** (73 sources) — federal Crown corporation (ownership `public (federal Crown corporation)`), net assets C$863.6bn (Q1 fiscal 2027); majority shareholder of Pattern Energy (69.1% together with other institutions after folding Cordelio in, 2 April 2026); 40% of ALLETE with GIP (closed 15 December 2025); atNorth c. 51% at completion (2 September 2026; 60% at signing); xScale 37.5% controlling; AirTrunk 12%; Inkia 50%; ~13% of Sempra Infrastructure Partners signed, not closed; lender to CoreWeave (USD 250m + USD 150m); the Maple Fund (C$50bn with Brookfield, 15 September 2026) as the voluntary answer to the Senate's domestic-investment mandate talk. Relationships: `pattern-energy`, `constellation-energy`, `voltagrid`, `mainspring-energy`, `vantage` portfolio; `blackrock`, `equinix`, `blackstone` partner; `kkr`, `brookfield` partner (announced); `energy-capital-partners` partner (historical); `macquarie`, `coreweave` other.
- **Study guides** — `quinbrook.study.json` (12 sections), `energy-capital-partners.study.json` (13), `cpp-investments.study.json` (13): technology lessons, not company trivia (tolled batteries and eight-hour storage, synchronous condensers, the continuation fund; the fund clock, EV vs equity value, FERC Section 203, aeroderivative turbines; pension capital without a clock, the control ladder, project finance, lending vs owning). Glossary terms registered in `profiler-concepts.json`.
- **Lesson plans** — `repository-information/study-prep/{quinbrook,energy-capital-partners,cpp-investments}/<slug>-lesson-plan.md`, eight modules each with self-checks, a risk list and sources.

### Changed

#### Profiler dossiers — step 7 reconciliation by `aka[]`
- 24 raw hits across the corpus (Quinbrook 7, ECP 7, CPP 10); 2 dossiers revised, both archived: **`equinix` v7 → v8** (atNorth completion split c. 51% CPP / c. 34% Equinix / c. 10% Partners Group — the signing 60/40 was re-cut by rollover; 2 September 2026 development and source; reciprocal partner edge to `cpp-investments`), **`habitat-energy` v3 → v4** (Flexitricity 0.9 GW per Drax and c. 1.3 GW per Quinbrook stated side by side; RGS accounts name Quinbrook Holdings Limited as ultimate controlling party; `quinbrook` added as `investor`; two sources). `form-energy`'s CPPIB claim (Series E, October 2022) verified correct — a subagent's 'contradiction' was withdrawn; `vistra`'s Helm 'founding partner' left as career history. The rest reviewed, no change.
- `profiler-companies.json` — three entries with `aka[]` and domains (202 companies); `profiler-segments.json` — the three `capital` rows and Quinbrook's two adjacent rows, each with its evidence line; `profiler-graph.json` rebuilt (1,793 edges); `repository-information/profiler-crossref-accepted.json` — three reviewed candidates accepted with reasons.
- `repository-information/profiler-refresh-calendar.json` — three `cadence: quarterly` core rows; `profiler-refresh-notes.json` — one note per slug with source and `watch[]`. **CPP stays a cadence row rather than `nextReport`**: it has no ticker and no consensus, its results are measured against benchmark portfolios, and the schema's `nextReport` fields are built for listed issuers' guidance — the mid-November 2026 Q2 fiscal 2027 release is a watch item, not a report pin.

#### Classroom (`googleAppsScripts/Classroom/Classroom.gs`)
- **All 19 segment lessons regenerated** under the step-5 sub-rule (`build-classroom-segments.py --all`; every lesson due because the graph `built` stamp advanced); `segment-capital` now carries the three new investors. `VERSION` v01.94g → v01.95g, `Classroomgs.version.txt` and the README display to match; `Classroomgs.changelog.md` v01.95g section. `check-classroom-content.py`: 71 lesson(s), 8 track(s), 220 gate case(s) — 0 error(s), 0 warning(s); `check-classroom-pipeline.py --base origin/main`: P1 and P10 only (expected; no P3, so no `gateDigest` refresh); selftest 15 fixtures, 0 failures; `node --check` and `check-gas-inner-scripts.py` clean. Landscape and scenario lessons untouched.

#### Repository documents
- `repository-information/PROFILER-COVERAGE-PLAN.md` — the three F-I4 rows rewritten with the verified roles, step-7 tallies and premise verdicts (what each row got wrong); `repository-information/phase-f-action-plan.md` — §3 row 6 marked landed (v07.83r).
- `README.md` — profile, study-guide, two archive and three curriculum entries added; Classroom GAS display v01.95g.

### Notes
- **Checkers.** `check-source-reachability.py` OK (every disclosure-tier host 200); `sync-profiler-registry.py --check` clean; relationships, crossrefs and study checkers 0 errors; `check-profiler-reports.py` the four pre-existing pin warnings only (fluence v10, jupiter-power v7, jinko v6, oracle v6); `check-readme-tree.py` 0 findings. Playwright renders of `Profiler.html#quinbrook`, `#energy-capital-partners`, `#cpp-investments` (wall none, BLUF present) and `Classroom.html#lesson/segment-capital` (11 sections, 151 rows) with no errors beyond the sandbox stubs.
- **CHANGELOG rotation.** Counter was 100/100 with 100 non-exempt after this section was inserted (no section dated 2026-10-03 existed before it), so the oldest date group (2026-09-21, 23 sections) rotated to `CHANGELOG-archive.md` with SHA enrichment.
- **Subagent usage.** Six general-purpose subagents, 2,304,771 tokens (305,715 · 332,173 · 371,681 · 368,665 · 413,958 · 512,579); no rate-limit event during the session. `SEC_USER_AGENT` sent to SEC hosts only; `CORPUS_TOKEN` not used.
- **Remote branch.** `claude/friendly-johnson-hsmoru` already existed on the remote pointing at `origin/main` (a leftover from the previous session's merged push, not a run in flight) — pushed over per Pre-Push item 5 case B.
- No page HTML, no diagram changed.

## [v07.82r] — 2026-10-02 08:33:24 PM EST

> **Prompt:** "Dismiss the two reminders, then give me a prompt to run F-I4 in a new Fable 5.1 High session, then remember session."

### Changed
- `repository-information/REMINDERS.md` — the 2026-09-24 neoclouds-pass and `profiler Habitat Energy` reminders moved to Completed (dismissed by the developer after v07.81r), each with the gate's outcome: both FY2025 filings missed, 'Accounts overdue' at Companies House on 2 October
- `repository-information/phase-f-action-plan.md` — §3 row 5 marked landed (v07.81r) with its outcome; row 6 re-timed to the next session and pointed at **§9, the new paste-in prompt for F-I4** (Quinbrook · Energy Capital Partners · CPP Investments, Fable 5.1 High): identity-first checks (Bridgepoint subsidiary; Crown corporation), the corpus's existing claims each dossier must agree with, the `capital` segment assignment and the step-5 regeneration (Classroom GAS → v01.95g), calendar rows, step 7 by `aka[]`, the verify list and the Playwright recipe; the Done table gains the row-5 session
- `repository-information/SESSION-CONTEXT.md` — Latest Session written for the 10/2 pass (remember session); the reconstructed earnings-desk entry moves to Previous Sessions and the 9/30 entry drops under the 2-session cap

### Notes
- **No page, GAS script or diagram changed.** Counter 100/100 — three sections dated 2026-10-02 are exempt (97 non-exempt), so no rotation; the next push rotates the 2026-09-21/22 date group only if its non-exempt count reaches 100

## [v07.81r] — 2026-10-02 08:21:12 PM EST

> **Prompt:** "Picking up from my last session, run repository-information/phase-f-action-plan.md §3 row 5 as a fresh session: the neoclouds Profiler pass plus `profiler Habitat Energy`, one session. This session runs on Fable 5.1 at High; check Settings → Usage first. It is Thursday 2026-10-01 after 5:00 PM PT, so the three 10/1 Profiler Routines have fired — the opportunity-report drift check (1:02 PM ET) was predicted to commit a superseding BESS-attach report; the earnings desk and the quarterly sweep were predicted to stand down. STEP 0 — REBASE FIRST, before any edit: git fetch origin main; git merge-base --is-ancestor origin/main HEAD || git rebase origin/main. Then git log origin/main --oneline -8: confirm the drift check's push is there (a `named-project-bess-attach--opportunity--2026-10-01` report). If it is absent, read that Routine's session before assuming anything. Read the CHANGELOG counter after the rebase (96/100 at v07.78r; only sections dated today are exempt — rotate only if the non-exempt count reaches 100). READ FIRST: repository-information/SESSION-CONTEXT.md; phase-f-action-plan.md §3 row 5 and §8 (this prompt); REMINDERS.md — the neoclouds and Habitat Energy reminders, whose "what to pull" lists are the brief; .claude/rules/profiler-app.md — Profiler Command step 1a (identity), step 5 including the NEW segment-regeneration sub-rule (v07.78r), step 7 (reconciliation), the Archival Procedure; PROFILER-SCHEMA.md (Refresh calendar, Segments registry); PROFILER-STYLES.md (active style); .claude/rules/classroom-app.md (the content fence, the verification list, the gateDigest obligation); and the v07.40r and v07.46r sections of CHANGELOG.md — the 9/24 neoclouds re-verification and the Habitat v2 refresh that this pass extends. PART A — THE NEOCLOUDS PASS. Profiler only: the Classroom landscape `landscape-neoclouds-2026-09` and `scenario-neoclouds-discovery` are re-authored by wave A (§3 row 9), not here. Do not edit any landscape or scenario lesson. 1. Fluidstack — `fluidstack`, v2 of 2026-09-06; Fluidstack Ltd, Companies House 10985545. THE GATE: accounts were due Wednesday 30 September 2026. Open the Companies House filing history first (run check-source-reachability.py; if find-and-update.company-information.service.gov.uk is blocked, say so and use the cached filing index). FILED → pull turnover, loss, net assets, headcount, auditor, going-concern language, and any directors'-report or post-balance-sheet note on the Google backstop, the named end customer or the reported round; archive v2 and write v3. NOT FILED → the late filing is itself the finding: record the date checked and the overdue status in the summary, the financials commentary and the indicators. Either way fold in what 9/24 verified but the dossier still lacks: Fluidstack naming its end customer (the dossier has zero "end customer" mentions — cite the counterparty's own document, not the 9/24 module), ClusterMAX 3.0 of 23 September (Fluidstack rated Unavailable), and the watch[] items in profiler-refresh-notes.json (lease commencement dates, any Google publication naming Fluidstack, the reported USD 1.5bn round). 2. Nscale — `nscale`, v2 of 2026-09-29 (that bump only added the WhiteFiber edges; the S-1 is cited twice and not worked through). Re-run the financials from the S-1 of 18 September, the first first-party revenue, backlog and debt disclosure: the Anthropic contract at up to about USD 44.6bn, about 1 GW of 1.37 GW at owned sites, the IPO size, the site-company financing and its rating; ClusterMAX 3.0 rates it Unavailable. Archive v2, write v3. Check whether the IPO has priced or the S-1 has been amended since. 3. ClusterMAX 3.0 across the rest of the segment: CoreWeave (v4), Nebius (v5 — Platinum beside CoreWeave), Crusoe (v6 — dropped to Bronze), Lambda (v5). A rating move is a targeted refresh under the Archival Procedure (archive, profileVersion +1, the rating row and its source, a one-line recent development), not a full research pass — unless step 1a or the row's watch[] shows the record moved further, in which case say so and run the full command for that company. IREN (v5, re-pinned 9/24) stays unless the S-1 or ClusterMAX names it. WhiteFiber, 5C Group, Firmus, HUMAIN and G42 are v1 dossiers from 9/26–9/29: touch them only through step 7. 4. Step 7 for every refreshed dossier, by aka[]. Re-read the neoclouds segment memberships against the revised ecosystemRole and rating (ClusterMAX is a stated basis input, so a role may move). Say in the summary whether any membership or role moved — that is what the step-5 sub-rule keys on. PART B — `profiler Habitat Energy` — `habitat-energy`, v2 of 2026-09-24, watch tier; Habitat Energy Limited 10923911, parent Renewable and Grid Services Limited 13250883; both owed accounts to 31 Dec 2025 by 30 September. Same gate: filing history first. FILED → the group "Optimisation services" line (FY2024 GBP 4.17M, +80%); the UK entity's turnover and loss (FY2024 GBP 1.99M and GBP 5.0M); any directors'-report or post-balance-sheet mention of the Quinbrook sale process (JLL/BCG, New Project Media 17 March 2026, still unresolved at v2); and recheck the PSC and officers pages for a change of control at the same time. NOT FILED → the late filing is the finding (the prior two years filed in late December and early January, so a miss is out of pattern). Archive v2, write v3; move the calendar row's lastRefreshed; update its watch[]. The quarterly sweep skips the watch tier, so nothing else folds these accounts in. PART C — THE SEGMENT CATCH-UP (the step-5 sub-rule's first application). Whether or not a membership moved, this push regenerates every segment the generator reports due — 15 at v07.78r, seven of them red on main (check-classroom-content.py: 14 errors, the cause of the 9/30 pipeline BLOCKED): python3 scripts/build-classroom-segments.py --check, then --all; bump Classroom.gs VERSION v01.93g → v01.94g and live-site-pages/gs-versions/Classroomgs.version.txt; one generic entry in live-site-pages/gs-changelogs/Classroomgs.changelog.md; the README tree's Classroom version display; python3 scripts/check-classroom-content.py must report 0 errors; node --check on a .js copy of Classroom.gs; node scripts/check-gas-inner-scripts.js; python3 scripts/check-classroom-pipeline.py --base origin/main — P1, P2 and P10 are expected on a developer commit; if P3 reports a gate mismatch, refresh gateDigest per classroom-app.md. The goal is main green before the 10/7 07:02 AM ET pipeline run. Do Part C after Parts A and B, since their membership changes are inputs to it. VERIFY: check-source-reachability.py first; sync-profiler-registry.py --check clean; build-profiler-graph.py; check-profiler-relationships.py, check-profiler-crossrefs.py and check-profiler-study.py clean (accept reviewed candidates with a reason); check-profiler-reports.py warnings read (four pre-existing pin warnings — fluence v10, jupiter-power v7, jinko v6, oracle v6 — plus whatever the 10/1 drift check changed); check-readme-tree.py 0 findings; Playwright render of every revised dossier and of the Classroom segments route, zero page errors other than the sandbox's gis_load_failed. Normal Pre-Commit and Pre-Push checklists; ONE commit; push on your claude/* branch once ls-remote is empty. The two reminders (the neoclouds pass, Habitat Energy) are mine: report them as done in the summary and I will dismiss them. At the end: one line each on whether the Fluidstack and Habitat accounts were filed or missed; the segment count regenerated and the content checker's final line; and the session's usage value from get_session for the cost table."

The neoclouds pass and the Habitat Energy refresh ran as one session. Both Companies House gates answered the same way: Fluidstack Ltd, Habitat Energy Limited and its parent Renewable and Grid Services Limited all carried the registrar's **"Accounts overdue"** warning on 2 October 2026 — none filed FY2025 accounts by the 30 September deadline — so the late filing is the finding in all three dossiers. The 10/1 Routines did not commit the predicted BESS-attach report: the drift check measured 8 of 25 pins drifted, under its gate of 10, and stood down; the quarterly sweep found no core row due; the earnings desk re-dated Intertek (v07.80r). Nscale's S-1 was worked through from the filing; ClusterMAX 3.0 was folded into every neocloud dossier it names; the Classroom segment lessons were regenerated and the content checker is back to zero errors on this branch.

### Changed

#### Profiler dossiers (`live-site-pages/profiler-data/`)
- **Fluidstack v2 → v3; v2 archived.** NOT FILED: 'Accounts overdue. Next accounts made up to 31 December 2025 due by 30 September 2026' (checked 2026-10-02) — recorded in the summary, a new FY2025 financials row, the commentary and the indicators. Folded in: Fluidstack's own 12 November 2025 post naming Anthropic (New York and Texas, never a campus); ClusterMAX 3.0 'Not Recommended – Unavailable' ('focus has shifted … to bare-metal TPU deployments at 100K+ chip scale'); Cipher's 24 September Barber Lake amendment (phased delivery Q4 2026–Q1 2027 from September 2026, USD 359.3M overrun framework, a second ten-year term signed directly by 'a leading AI lab'); the June–August SH01 allotments and Destiny Tech100's 424B3 naming the round Series B; the Wall Street Journal's reported USD 5bn Pentagon loan talks; the Cameron County worksite permit (10 September), the USD 4bn Harlingen first phase and 1.5 GW reserved from AEP Texas; the reported Anthropic–Lambda and Anthropic–Stream deals; Dealroom's investor-memo revenue figures labelled as press. 9 developments, 13 sources, a Lambda competitor edge, revised judgments 2–4 and 6, gaps and indicators.
- **Nscale v2 → v3; v2 archived.** Financials rebuilt from the S-1 (KPMG): revenue USD 19.1M (2024), USD 33.0M (2025), USD 140.6M (H1 2026); net loss USD 761.8M and USD 1,020.1M; adjusted EBITDA, cash flow, capex, balance sheet; RPO USD 34.5bn → USD 56.4bn; USD 103.4bn active and contracted TCV at 31 August (USD 2.6bn active); Microsoft up to USD 43.8bn through 2033; **Anthropic PBC named** at up to USD 44.6bn (four Vera Rubin tranches at Monarch, financing not committed); 1 GW of 1.37 GW owned; about USD 6.5bn of committed bank facilities (two 'investment-grade', agency unnamed), USD 2.54bn Dell rent, a minimum USD 3.1bn of convertible notes (USD 1.0bn NVIDIA, closing ~16 November); the going-concern doubt raised and alleviated; customer concentration 73% → 52%; over 1,000 employees. Identity updated (Nscale Limited → plc; NYSE 'NSCL'); no S-1/A or pricing by 2 October; WSJ (via Semafor) roadshow postponement; ClusterMAX 3.0 'Unavailable'; Bloomberg's reported COO hire. KPI overlays set (`kpiNorm` true). OpenAI edge → historical; Anthropic edge → active with the S-1 as source.
- **Habitat Energy v2 → v3; v2 archived.** NOT FILED at both companies; a new FY2025 financials period records it with the filing-pattern context (FY2023 filed 7 Jan 2025, FY2024 4 Jan 2026); PSC, officer and share registers re-read and unchanged since May 2026; the Quinbrook sale still has no public progress since 17 March; Gresham House's 23 September interim names no optimiser. Judgment 2, gaps and indicators revised.
- **CoreWeave v4 → v5, Nebius v5 → v6, Lambda v5 → v6, Crusoe v6 → v7, IREN v5 → v6** (all archived). ClusterMAX 3.0 (23 September) rows, sources and developments: CoreWeave Platinum for a third cycle, now shared; **Nebius Gold → Platinum**; Lambda Silver; **Crusoe Gold → Bronze**; IREN Underperforming (named, so refreshed). Lambda and Crusoe ran the full command because their watch items had moved: Lambda — the press-only USD 35bn Anthropic agreement at Hut 8's Beacon Point (unconfirmed by any party), the 1 October USD 1.008bn fixed-rate facility (A (low) / Baa1), the Mayes County, Oklahoma campus, the ratepayer pledge, the IPO window moving to 2027; Crusoe — the USD 3.9bn Series F at USD 30.9bn post-money (initial close, USD 3.11bn sold per Form D), '6GW+' contracted and '$140B+' TCV, Google named as the Armstrong County customer, the Boom turbine order dropped, three directors, Perplexity and Thinking Machines Lab.
- **Step 7 reconciliation** — Fluidstack, Nscale, Habitat, Nebius, CoreWeave, Crusoe, Lambda and IREN inbound mentions searched by display name and `aka[]` (aka lists populated for all eight). Two dossiers contradicted: **Anthropic v3 → v4** (Nscale's S-1 names it — the relationship moves to active at USD 44.6bn; Barber Lake's slip recorded as the programme's first filed missed milestone; judgment 7 and the indicators revised) and **Hut 8 v2 → v3** (Crusoe's contracted figure; the WSJ-reported Beacon Point tenancy and the USD 1.07bn revolver added). The five Habitat inbound dossiers reviewed on 9/24 cite nothing this refresh changed. Report pins re-verified by reading for crusoe (v7), anthropic (v4) and hut-8 (v3) in `report-pins-verified.json`; the reopened IREN × Microsoft crossref candidate accepted with a reason.
- **`profiler-segments.json`** — **Nebius moves from challenger to incumbent in `neoclouds`** on the ClusterMAX 3.0 Platinum rating (a stated basis input); Fluidstack and Nscale basis lines carry their 'Unavailable' ratings; the segment note records the 3.0 placements. No other membership moved. Registry taglines and `companies[].segments[]` mirror re-synced; graph rebuilt.

#### Classroom (`googleAppsScripts/Classroom/Classroom.gs`)
- **All 19 segment lessons regenerated** (`build-classroom-segments.py --all`, generation date 2026-10-02) — the step-5 sub-rule's first application: the seven lessons red on `main` since the F-H1/F-N1/F-I1/F-N2/F-U3/F-U4 pushes (aidc-developers-and-landlords, bridge-and-on-site-generation, capital, hyperscalers-and-ai-labs, neoclouds, storage-developers-and-ipps, utilities) now match the registry, and the twelve freshness-due lessons are re-pinned. `check-classroom-content.py`: 71 lessons / 8 tracks / 220 gate cases — **0 errors, 0 warnings** (was 14 errors). Classroom GAS v01.93g → v01.94g with a generic changelog line; README tree display updated.

#### Operational files
- `profiler-refresh-calendar.json` — `lastRefreshed` 2026-10-02 for the ten revised rows; `profiler-refresh-notes.json` — Fluidstack, Nscale, Habitat, Crusoe, Lambda, Nebius and CoreWeave watch lists rewritten around the overdue accounts, the S-1 and the ratings.
- `SESSION-CONTEXT.md` — stale entry (v07.79r) auto-reconstructed from CHANGELOG at session start.

### Notes
- **Routines.** The drift check (Sonnet 5, 10/1 17:03 UTC) stood down at 8/25 drifted pins; the quarterly sweep at 0 due; so the four pre-existing report-pin warnings (fluence v10, jupiter-power v7, jinko v6, oracle v6) are unchanged and no 10/1 report exists.
- **Checkers.** `check-source-reachability.py` OK (every disclosure-tier host 200; Companies House reachable); `sync-profiler-registry.py --check` 0 out of sync, calendar in bijection; `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates; `check-profiler-study.py` 0 errors; `check-profiler-reports.py` 0 errors / 4 warnings (the pre-existing four); `check-readme-tree.py` 0 findings; `node --check` clean; `check-gas-inner-scripts.js` 106 blocks parse; `check-classroom-pipeline.py --base origin/main` P1 and P10 only (expected on a developer commit; no P3, so `gateDigest` untouched); `--selftest` 15 fixtures, 0 failures. Playwright (headless Chromium, GAS stubbed): the ten revised dossiers rendered on `Profiler.html#<slug>` and four regenerated segment lessons on `Classroom.html#lesson/segment-*` — 0 page errors, 0 console errors beyond the sandbox's sign-in stubs.
- `verify-profiler-roles.py` reports two pre-existing progress-isolation failures in its headless harness; `Profiler.html` was not touched by this push.
- **Not done here by design:** `landscape-neoclouds-2026-09` and `scenario-neoclouds-discovery` (wave A, §3 row 9); the Dominion reframe (its own session); WhiteFiber, 5C, Firmus, HUMAIN and G42 untouched (step 7 found no contradiction). The CHANGELOG counter is 99/100 with two sections dated 2026-10-02 exempt — no rotation.

## [v07.80r] — 2026-10-02 09:19:04 AM EST

> **Prompt:** Scheduled "Profiler earnings desk" run: take up to three due rows from the refresh calendar, verify each report published, run the Profiler Command, advance the rows.

### Changed
- `repository-information/profiler-refresh-calendar.json` — Intertek watch-window row re-dated from 2026-10-01 to 2026-11-02 and set unconfirmed: the window opened with no Court sanction, no satisfaction-of-condition and no Trading Update on the RNS feed, so no dossier was written
- `repository-information/profiler-refresh-notes.json` — Intertek row source note records the re-date

### Notes
- **No page, GAS script or diagram changed.** Counter 98/100

## [v07.79r] — 2026-09-30 06:41:21 PM EST

> **Prompt:** "give me a prompt to paste into a new Fable 5.1 High session to run the neoclouds pass + profiler Habitat Energy on 10/1 after 5pm PST. Rebase first, and let the new rule's step do the fifteen-segment catch-up in that push. Then, remember session."

### Added
- `repository-information/phase-f-action-plan.md` §8 — the paste-in prompt for §3 row 5 (neoclouds pass + `profiler Habitat Energy`, Fable 5.1 High, Thu 2026-10-01 after 5:00 PM PT). Rebuilt from the v07.40r record (ClusterMAX 3.0 of 23 Sep, Nscale's S-1 of 18 Sep, Fluidstack naming its end customer) and the v07.46r Habitat v2 record plus the two standing reminders. Three parts: A — Fluidstack (Companies House 10985545, accounts due 9/30, filed-or-missed is the finding either way) and Nscale (S-1 financials) to v3, ClusterMAX 3.0 rating rows as targeted refreshes on CoreWeave, Nebius, Crusoe and Lambda; B — Habitat Energy (10923911 / parent 13250883) to v3 with the reminder's pull list; C — the first application of the step-5 segment sub-rule: regenerate all 15 due segment lessons, Classroom GAS v01.93g → v01.94g, content checker to zero errors, so `main` is green before the 10/7 pipeline run. Opens with a rebase because the 10/1 drift-check Routine (1:02 PM ET) is predicted to commit a superseding BESS-attach report

### Changed
- `repository-information/phase-f-action-plan.md` §3 row 5 — timing made concrete (after 5:00 PM PT; the three 10/1 Routines and which one commits), pointer to §8, and the segment catch-up recorded as the row's second job
- `repository-information/SESSION-CONTEXT.md` — Latest Session written for this session (the 9/30 run check, the BLOCKED diagnosis, the v07.77r–v07.79r pushes); F-U4 moved to Previous Sessions; F-U3 kept as the one earlier entry (2-session cap)

### Notes
- **No page, GAS script or diagram changed.** Counter 97/100; three sections dated today are exempt, 94 non-exempt

## [v07.78r] — 2026-09-30 06:09:16 PM EST

> **Prompt:** "Add the rule yourself if possible. If you cannot and need me to do it, give me step by step instructions on how to paste it, making it as easy for me as possible."

### Added
- `.claude/rules/profiler-app.md` — Profiler Command step 5 gains the sub-rule approved at v07.77r: a session that adds or removes a member of `profiler-segments.json` or moves a role regenerates every segment lesson `build-classroom-segments.py --check` reports due (`--segment <id>` / `--all`), bumps the Classroom GAS version, changelog and README tree display per [PC-GS-VERSION] #1 / [PC-README-TREE] #7, and runs `check-classroom-content.py` to zero errors plus `node --check` before committing. Refresh-only sessions (a `profileVersion` bump with no membership change) are exempt, which keeps the Routine-fired earnings desk and quarterly sweep outside the rule. Placed with the Profiler Command because the Profiler session is the one that must adapt (direction-of-responsibility rule in `rule-management.md`); no contradiction found in `classroom-app.md`, which already reserves the generator for developer sessions

### Notes
- The v07.77r note "The approved rule was not written" is now historical: the write was refused by the session's permission classifier from a Bash heredoc, and landed here through the file-edit tool at the developer's explicit direction
- **No page, GAS script or diagram changed**

## [v07.77r] — 2026-09-30 06:02:30 PM EST

> **Prompt:** "I don't fully understand the problem. Explain again why the 9/30 classroom pipeline run was blocked and how I can unblock it. Will adopting the pipeline's own suggestion as a rule resolve everything (I approve by the way)? Dismiss the two 9/30 check reminders.
>
> What is my ideal result after the classroom pipeline run?"

### Changed
- `repository-information/REMINDERS.md` — the 2026-09-26 "Check the 9/30 Classroom pipeline run" reminder moved to Completed at the developer's request; its 2026-09-24 duplicate was already there

### Notes
- **The 9/30 Classroom pipeline run (session `cse_01Er6Rdt6vPQL95C41VR3Qme`, 11:03–11:07 UTC, Opus 5) ended `BLOCKED`** at pre-flight §5.1 step 2: `check-classroom-content.py` reported 14 errors on `main` — seven `segment-*` lessons (aidc-developers-and-landlords, bridge-and-on-site-generation, capital, hyperscalers-and-ai-labs, neoclouds, storage-developers-and-ipps, utilities) no longer matched `profiler-segments.json` after the F-H1, F-N1, F-I1, F-N2, F-U3 and F-U4 pushes added 17 members since the v07.60r regeneration. Gate digest, schema versions and the push path all passed; nothing was written and no branch was left. The lessons are **not** regenerated in this push: the next Profiler session (`phase-f-action-plan.md` §3 row 5, Thu 10/1) regenerates all fifteen due segments, rule landed or not, so the 10/7 run starts green
- **Archive rotation fired.** First push dated 2026-09-30 EST: 103 sections, 1 exempt (today's), 102 non-exempt ≥ 100 → the 2026-09-20 date group (v06.75r–v06.82r, 8 sections) rotated to `CHANGELOG-archive.md` with SHA enrichment (8 of 8 resolved on the deep clone) → 94 non-exempt remain. Counter 95/100
- **The approved rule was not written.** The developer approved adopting the pipeline's own suggestion — a Profiler session that adds or removes a segment member or moves a role regenerates every due `segment-*` lesson (`build-classroom-segments.py --check`, then `--segment <id>` / `--all`), bumps the Classroom GAS version and runs `check-classroom-content.py` to zero errors before committing, with refresh-only sessions exempt. The session's permission classifier refused the write into `.claude/rules/profiler-app.md` (Instruction Poisoning), so the rule text was handed back in chat for the developer to paste under Profiler Command step 5, or to re-run with the write allowed. Until it lands, the segment regeneration is a manual obligation of the 10/1 session
- **No page, GAS script or diagram changed**

## [v07.76r] — 2026-09-29 09:56:07 PM EST

> **Prompt:** "Picking up from my last session, run Phase F session F-U4 of repository-information/PROFILER-COVERAGE-PLAN.md
> as a fresh session: Florida Power & Light, Salt River Project and the Tennessee Valley Authority — NextEra's
> regulated side, a public-power utility and a federal one. This session runs on Fable 5.1 at High, per
> repository-information/phase-f-action-plan.md §3 row 4; write "Fable 5.1 High" into the three §11.3 Model cells.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; phase-f-action-plan.md §3; PROFILER-COVERAGE-PLAN.md §7,
> §11.1 and §11.3 (the three F-U4 rows are yours) and §11.4–§11.5; .claude/rules/profiler-app.md (Profiler Command
> including step 1a identity and step 7 reconciliation, Profiler Prep Command); repository-information/
> PROFILER-SCHEMA.md (Naming and renames, Registry schema and its category list, Segments registry, Refresh calendar);
> PROFILER-STYLES.md (active style intel-briefing). House pattern for a utility: the pinnacle-west, nisource and
> wec-energy dossiers, guides and lesson plans (v07.74r); pinnacle-west is the toll-buyer pattern SRP will resemble.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7, profileVersion 1,
> categories ["utility"]) and study guide (schema v2) with its lesson plan under repository-information/study-prep/
> <slug>/. Populate aka[] BEFORE the step-7 grep (FPL, Florida Power & Light, NextEra Energy, NEE; SRP, Salt River
> Project Agricultural Improvement and Power District; TVA, Tennessee Valley Authority, MLGW as a distributor if the
> record makes it one). Assign segments with a basis line (hypothesis: `utilities` · incumbent for all three;
> `storage-developers-and-ipps` · adjacent only where utility-owned storage is material — SRP's Marigold 400 MW /
> 8-hour and TVA's IRP storage are the candidates; pinnacle-west was left out on that test at v07.74r, so apply it the
> same way). Then the registry sync, the graph build, a dated calendar row per company (FPL/NextEra files with the
> SEC and has an earnings date — mark it unconfirmed until NextEra announces it; SRP and TVA have no earnings clock:
> TVA files 10-Ks with the SEC, so give it a nextReport row on its fiscal-year cadence and say so in the notes; SRP
> follows the private cadence rule), README tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — decide on the record, not the plan:
> - FPL: the one-slug-per-entity rule against `nextera-energy-resources` (NYSE: NEE is the parent's ticker). FPL is
>   a separate SEC registrant (Florida Power & Light Company files its own 10-K with NextEra's) and a separate
>   actor in the ecosystem (the regulated buyer of batteries, the LLCS-1/2 tariffs), which is the schema's test for
>   a subsidiary slug. If you create `florida-power-light`, write the relationship to `nextera-energy-resources`
>   both ways under the Archival Procedure and record the NextEra–Dominion merger's current state (signed 18 May
>   2026 — check for closing, approvals and any change to FPL's position). If you decide one slug covers both, say
>   why and add FPL to `nextera-energy-resources`'s aka[] instead.
> - SRP: the legal entities (the Salt River Project Agricultural Improvement and Power District, a political
>   subdivision of Arizona, and the Salt River Valley Water Users' Association) — one slug, display name "Salt River
>   Project"; ownership.type is the open question. Test the category: `utility` fits; if the schema needs a note
>   that public power has no shareholder return and an elected board, write it into PROFILER-SCHEMA.md's category
>   row in the same commit — do NOT add a category (the developer decided the grid-operator category in its own
>   session; public power stays inside `utility` unless you find the dossier cannot be written that way).
> - TVA: a federal corporation created by the TVA Act, with an SEC-filing 10-K, a presidentially appointed board
>   and no state commission — the rate case, IRP and large-load mechanics all live in TVA's own board process.
>   ownership.type and the financials stance need a one-line schema note the same way. Verify the board's current
>   quorum status — it has mattered for what TVA could approve.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF — web research from 2026-09-25 that nobody has read. Verify
> against first-party sources (FPL's and NextEra's 10-K/10-Q and Q2 2026 deck, FPSC dockets, SRP's board and rate
> filings and its ACC decision, TVA's 10-K, board minutes and the 2026 IRP record of decision), record a premise
> verdict per clause, and rewrite the cells. Check hardest:
> - FPL: LLCS-1/2 large-load tariffs effective 1 Jan 2026 (terms — threshold, minimum bill, term, collateral, exit);
>   "more than 130 GW of large-load opportunities" (whose figure, what rung); FPL's own battery build (MW, OEM if
>   ever disclosed) against NextEra Energy Resources' merchant fleet; the 2025 rate settlement and the return.
> - SRP: 59 large-load customers / ~7 GW (Apr 2026, ACC workshop); the E-67 price plan's terms; Marigold (400 MW
>   8-hour battery, 600 MW solar, 675 MW gas) and the ACC decision expected Nov 2026 — is it an ACC decision at all
>   for a public-power district, or a siting-committee one; the NextEra 3 GW solar + 1 GW storage PPA; the storage
>   counterparties (Aypa, Plus Power, Invenergy, ESS, Energy Dome) — pull each from the counterparty's own record
>   first, since `aypa-power`, `plus-power`, `invenergy` and `pinnacle-west` are covered.
> - TVA: the 2026 IRP approved 20 Aug (1–5 GW storage, 7–26 GW gas — the ranges and the preferred portfolio);
>   the Capacity Commitment Charge for new loads above 5 MW effective 1 Oct 2026 (the day after this session may run
>   — check whether it took effect and on what terms); xAI Memphis served through MLGW (who signs for what); the
>   Plus Power 200 MW / 800 MWh toll; any small-reactor programme (Clinch River) on the record.
> For each, the §11.1 verdict: does it, or a platform it controls, sign for batteries, MV gear, generation or SSTs?
>
> RECONCILIATION (step 7) — measured 2026-09-29 by grep: `SRP` 11 dossiers, `Salt River Project` 4; `TVA` 12,
> `Tennessee Valley Authority` 3; `FPL` 5, `Florida Power & Light` 2; `NextEra Energy` 26 — the last is the
> `nextera-energy-resources` dossier's own neighbourhood and is NOT yours to re-reconcile unless FPL contradicts
> it. Known inbound worth reading first: pinnacle-west (SRP as the neighbouring utility and pipeline co-anchor;
> the Mesa data centres), invenergy (736 MW of SRP storage), aypa-power and plus-power (SRP and TVA tolls), xai
> (Memphis and MLGW), sargent-lundy (TVA as a nuclear-services client). Revise only on a contradiction, under the
> Archival Procedure, with any report pin re-checked.
>
> CHANGELOG: the repo CHANGELOG stands at `Sections: 101/100` with seven sections dated 2026-09-29 EST exempt (94
> non-exempt). If your push lands on 2026-09-30 EST or later, those seven stop being exempt: 102 raw / 101 non-exempt
> exceeds the trigger, so rotate the 2026-09-20 date group (v06.75r–v06.82r, 8 sections) into CHANGELOG-archive.md
> above `## [v06.74r]` with a commit SHA on every header (run `git fetch --unshallow origin main` first; the eight
> SHAs resolve on the deep clone), then add your section. Read CHANGELOG-archive.md §"Rotation Logic" before
> assuming otherwise.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. Three more utilities make landscape-utilities-2026-09
> (now eight franchises behind) staler still; record that in the CHANGELOG entry and the SESSION-CONTEXT hand-off
> (wave C, phase-f-action-plan.md §3 row 16).
>
> MECHANICS that held at v07.74r: sec.gov and data.sec.gov answer when every request carries the SEC_USER_AGENT
> string from scripts/check-source-reachability.py (run that script before planning Stage 2); the shell has
> outbound HTTPS through the proxy, so `curl` reads of a release beat a summariser call; WebFetch refuses a URL
> that no WebSearch result in the session has shown (search-seed first). Never write a dossier figure from memory.
>
> VERIFY: check-source-reachability.py; sync-profiler-registry.py --check clean; build-profiler-graph.py;
> check-profiler-study.py, check-profiler-relationships.py and check-profiler-crossrefs.py clean (accept reviewed
> candidates with a reason); check-profiler-reports.py warnings read; check-readme-tree.py; every new dossier and
> guide renders (Playwright, `pip install playwright`, Chromium at /opt/pw-browsers/chromium) with zero page
> errors. If the Fable weekly cap binds, continue on Opus 5.5 xhigh and record the substitution in the §11.3 Model
> cell. Normal Session Start, Pre-Commit and Pre-Push checklists; one push commit on a claude/* branch restarted
> from origin/main. Then "remember session"."

### Added
- **Three new utility dossiers (schema v7, profileVersion 1), study guides (schema v2) and lesson plans — Phase F row F-U4**, researched in this session by three parallel `general-purpose` subagents (first-party then third-party; about 65, 60 and 60 sources evaluated; every figure carried a URL) and written from their verified notes. `check-source-reachability.py` first: sec.gov and data.sec.gov answered 200 under `SEC_USER_AGENT`; srpnet.com's HTML and tva.com returned 403 to curl and WebFetch (SRP's PDF assets and media site, and TVA's Azure CDN board decks, carried those two sessions).
  - `live-site-pages/profiler-data/florida-power-light.profile.json` (44 sources; four company-published executive photos downloaded to `images/execs/`) + `florida-power-light.study.json` (12 sections) + `repository-information/study-prep/florida-power-light/florida-power-light-lesson-plan.md` — **identity (step 1a): a separate slug on the record**, FPL being a separate SEC registrant (CIK 0000037634, a combined 10-K with NEE), wholly owned with no listed securities, and the regulated buyer of its own batteries and the LLCS counterparty; the relationship to `nextera-energy-resources` is written from FPL's side (`other`, sister subsidiaries). LLCS-1/LLCS-2 effective January 1, 2026 (50 MW at 85% load factor, three 500 kV zones with a 3 GW cap at $11.67/kW, cost of service elsewhere, 20-year term, 70% take-or-pay, exit fee = NPV of the remaining charge, security 5 or 10 years by rating), approved in FPSC Final Order PSC-2026-0022-S-EI with the settlement (+$945M / +$705M, 10.95% ROE, SoBRA, RSM) now under consolidated Florida Supreme Court appeal; Chapter 2026-65 codifying the design; 991 MW of FPL-owned batteries with 7,454 MW planned to 2035 and no OEM ever disclosed; the Dominion merger (signed May 15, announced May 18; both votes September 3; VA SCC hearing November 17; close 2H 2027; FPL unchanged); **Scott Bores FPL CEO since May 18, 2026**.
  - `salt-river-project.profile.json` (54 sources) + `salt-river-project.study.json` (13 sections) + `study-prep/salt-river-project/salt-river-project-lesson-plan.md` — public power **kept inside `utility`** with `ownership.type` `public (public power)`: two legal entities under a landowner-elected Board (8–6 in April 2026, 7–7 in August) that sets prices under A.R.S. 45-1720; E-67 mandatory at 20 MW with an 80%-of-forecast minimum billing demand (November 2025); 59 large-load customers / ~7,000 MW as SRP's own statement at the ACC's April 16 workshop (pipeline, not served, against a 9,072 MW peak); >1,570 MW of batteries under ESAs (Plus Power, Aypa, EDP, Ørsted, NextEra) against 25 MW owned; Marigold (600 MW solar, 400 MW / 8-hour, 675 MW gas; Board September 14, 2026) with the ACC's CEC vote on the gas and lines due November 2026 after siting Cases 267/268; the NextEra 3,000 MW solar agreement (the 1 GW of storage is trade press only); Palo Verde 20.4%; FY2025 revenue $4,559.7M, net revenues $604.0M, Aa1 / AA+.
  - `tva.profile.json` (62 sources) + `tva.study.json` (13 sections, including a two-lane timeline) + `study-prep/tva/tva-lesson-plan.md` — a federal corporation **kept inside `utility`** with `ownership.type` `public (federal corporation)` and the NYSE-listed power bonds TVE/TVC in `ticker`: the 2026 IRP adopted as ranges by Board resolution August 20, 2026 (need 11–32 GW through 2040; gas 7–26 GW; storage 1–5 GW; nuclear up to 5 GW; no NEPA ROD yet); the data-center rate class and Capacity Commitment Charge above 5 MW effective October 1, 2026 (price, term and collateral unpublished; a blocked trade-press dollar figure not carried); the quorum lost April 1, 2025–January 2026 with six of nine seats filled; **Mike Skaggs Interim CEO** after Don Moul's July 1 retirement and the $500,000 pay memorandum; xAI's Colossus 1 through MLGW (150 + 150 MW), Colossus 2 off-grid at Southaven, and MZX Tech (SpaceXAI) approved as a direct customer above 100 MW; Plus Power (200 MW / 800 MWh) and Tenaska (225 MW / 900 MWh) 20-year tolls; **the first U.S. SMR construction permit (Clinch River BWRX-300, NRC, September 29, 2026)**; ratings Aa1 / AA+ / AA+.
- **PROFILER-SCHEMA.md — three notes for publicly owned utilities** (the category row, the `ownership` row and the `financials` line): public power and federal corporations stay inside `utility`; `ownership.type` carries the `public (public power)` / `public (federal corporation)` variant with an optional `notes` string (the renderer prints the string verbatim and the corpus already carries descriptive variants); the `financials` stance names the disclosure actually published and leaves `expected` empty. No category was added.
- **10 concepts** registered in `profiler-concepts.json` (1,583 → 1,593), collision-checked: `base-rate`, `board-quorum`, `capacity-commitment`, `certificate-of-environmental-compatibility`, `federal-corporation`, `local-power-company`, `political-subdivision`, `public-power`, `revenue-bond`, `wholesale-power-contract`; `debt service coverage` added as an alias of the existing `dscr`.
- Registry entries (196 → 199; `aka[]` — including `Gulf Power`, `MLGW` and the two SRP legal names — and `domains[]` populated before the step-7 grep), segment memberships (`utilities` · incumbent for all three; `storage-developers-and-ipps` · adjacent for FPL and SRP on the owned-storage test, none for TVA, which owns 20 MW against 425 MW of tolls — the `pinnacle-west` test applied), calendar rows (`florida-power-light` ~2026-10-27 unconfirmed on NEE's cadence; `tva` ~2026-11-13 unconfirmed on its fiscal-year 10-K cadence, as the notes say; `salt-river-project` on the quarterly sweep, `watch` tier, under the private cadence rule) with notes, README tree entries for six data files and three curricula.

### Changed
- `PROFILER-COVERAGE-PLAN.md` §11.3: the three F-U4 rows rewritten with premise verdicts (FPL: four clauses — one held, three refined, identity corrected; SRP: five — three held, one refined, one partially held; TVA: five — three held, one partially held and outdated, one refined; leadership and ratings corrected) and flipped to v1 / v2. `phase-f-action-plan.md` §3: row 4 marked landed, the Done table extended, and wave C (row 16) now counts eleven new franchises.
- `profiler-crossref-accepted.json`: one pre-existing candidate reviewed and accepted (`powerhouse-data-centers × ppl` — two different campuses, Carlisle PA 300 MW and Louisville KY 400 MW; accurate).

### Verified
- `sync-profiler-registry.py --check` clean (roster and calendar in bijection at 199); `build-profiler-graph.py` 1,712 → 1,749 edges; `check-profiler-study.py` 0/0; `check-profiler-relationships.py` 0 findings (21 accepted); `check-profiler-crossrefs.py` 0 candidates after the accept; `check-profiler-reports.py` the four pre-existing pin warnings (`fluence`, `jinko`, `jupiter-power`, `oracle`); `check-readme-tree.py` 0 findings; Playwright (admin session simulated, local HTTP server): all six routes — three dossiers, three study guides — render with zero page errors, after the FPL executive photos were moved from hotlinks (blocked by the page's CSP) into `images/execs/`.
- Step-7 inbound reads: FPL 7 dossiers grepped by alias (4 substantive, 0 changed); SRP 12 (9 substantive, 0 changed; 1 unreconciled — `prime-data-centers`' 15-year / collateral / 24-to-3 account is not on SRP's public record, stated as such); TVA 14 (9 substantive, 0 changed; 1 unreconciled — `kiewit` lists Cumberland in its reference fleet and TVA names no EPC). The `nextera-energy-resources` neighbourhood was not re-reconciled; nothing in FPL's record contradicts it (its FPL funnel figures are earlier rungs of the same funnel).
- **No rotation.** This push lands on **2026-09-29 EST**: 102 raw / **94 non-exempt** against a 100 trigger with 8 same-day sections; the 2026-09-20 date group (v06.75r–v06.82r, 8 sections) rotates on the first push dated 2026-09-30 EST or later — a dry run in this session resolved all eight SHAs on the deep clone. Counter `Sections: 101/100` → `102/100`.
- **Classroom untouched by design:** `Classroom.gs` was not edited; `landscape-utilities-2026-09` and the three `scenario-utilities-*` rehearsals are now stale by **eleven** new franchises (Duke, DTE, WEC, BHE, Exelon, PPL, Pinnacle West, NiSource, FPL, SRP, TVA) — wave C, `phase-f-action-plan.md` §3 row 16. **No page, GAS script, diagram or rule changed.**

## [v07.75r] — 2026-09-29 08:46:27 PM EST

> **Prompt:** "give me a prompt to paste into a new Fable 5.1 High session to run F-U4, then remember session"

### Added
- `repository-information/PROFILER-COVERAGE-PLAN.md` **§11.5 — the F-U4 paste-in prompt** (Florida Power & Light, Salt River Project, TVA; Fable 5.1 High), §11.4 with F-U3's lessons folded in: FPL's slug decided on the record against `nextera-energy-resources` (a separate SEC registrant), the public-power and federal-utility category tests written as `PROFILER-SCHEMA.md` notes rather than new categories, calendar rules for a public-power district and a federal 10-K filer, the step-7 inbound counts measured today (SRP 11, TVA 12, FPL 5 dossiers by short name), the rotation now due on the first push dated 2026-09-30 EST or later, and the mechanics that held (`sec.gov` with the SEC user agent; `curl` through the proxy; search-seeded fetches).

### Changed
- `repository-information/SESSION-CONTEXT.md` Latest Session: the recommendation now points at §11.5; repo version and counter lines updated. Remember-session hand-off for the F-U3 write thread.
- **No rotation.** This push lands on **2026-09-29 EST**: 101 raw / **94 non-exempt** against a 100 trigger with 7 same-day sections; the 2026-09-20 group (8 sections) rotates on the first push dated 2026-09-30 EST or later. Counter `Sections: 100/100` → `101/100`. **No page, GAS script, diagram or rule changed.**

## [v07.74r] — 2026-09-29 08:41:27 PM EST

> **Prompt:** "@"/root/.claude/uploads/8127051b-4a08-5104-9efc-cfd58f7ccfba/a14e1271-pinnacle-west-verified-notes.md"
> @"/root/.claude/uploads/8127051b-4a08-5104-9efc-cfd58f7ccfba/372ebe92-ppl-verified-notes.md"
> @"/root/.claude/uploads/8127051b-4a08-5104-9efc-cfd58f7ccfba/0aa3333a-F-U3-PROGRESS-HANDOFF.md"
> @"/root/.claude/uploads/8127051b-4a08-5104-9efc-cfd58f7ccfba/6c0ea8b9-nisource-verified-notes.md"
> Run Profiler row F-U3 (PPL, Pinnacle West, NiSource) in LightAISolutions/Sales on Fable 5.1 High.
> Read the attached F-U3-PROGRESS-HANDOFF.md first, along with any attached *-verified-notes.md files,
> and treat its §5 notes as the only research inputs. Finish the six NiSource gaps in §3.2 one fetch
> at a time, with no parallel research agents. Then write the three dossiers, guides and lesson plans,
> and complete the §4 finish sequence as one v07.74r push commit to a claude/* branch."
> *(The same message was sent once before with the earlier upload ids and interrupted before any work; the four files are identical copies.)*

### Added
- **Three new utility dossiers (schema v7, profileVersion 1), study guides (schema v2) and lesson plans — Phase F row F-U3**, written from the hand-off's §5 verified notes only (`F-U3-PROGRESS-HANDOFF.md`, `ppl-verified-notes.md`, `pinnacle-west-verified-notes.md`, `nisource-verified-notes.md`), with the six NiSource gaps in its §3.2 closed one fetch at a time (Quanta's PR Newswire release; Zachry's award via the Yahoo mirror; the NiSource news archive for the Q3 date — none announced, dividend $0.30 declared Sep 10; the EDGAR filing index and the FY2025 10-K main document for identity; the GenCo–Amazon explainer):
  - `live-site-pages/profiler-data/ppl.profile.json` (33 sources) + `ppl.study.json` (13 sections) + `repository-information/study-prep/ppl/ppl-lesson-plan.md` — PPL Electric's 31.8 GW advanced-stage / >11 GW signed-ESA / >6.5 GW under-construction ladder under Pennsylvania's first large-load tariff (≥50 MW, 10-yr, 80% guaranteed, exit fees, security = upgrades; PA PUC order June 4, 2026) and the Sep 14 Customer Protection Transmission Rider; LG&E-KU's Brown 12 and Mill Creek 6 (645 MW each, $2.798B, Oct 28, 2025 order that denied every recovery mechanism), the withdrawn Cane Run battery, the EHLF tariff and the March 2026 rehearing; Invitium (51/49 with Blackstone Infrastructure) with >5 GW of CCGT turbine reservations and no customer; RI's 9% ROE held. Truncated first-party URLs in the notes were resolved from the pplweb.com and lge-ku.com listings and eleven third-party citations by single searches; the E.W. Brown 125 MW / 500 MWh KPSC filing (2022-00402) surfaced with an unread Burns & McDonnell page naming Tesla Megapacks, recorded as an unverified lead in the collection gap.
  - `pinnacle-west.profile.json` (29 sources) + `pinnacle-west.study.json` (13 sections) + `study-prep/pinnacle-west/pinnacle-west-lesson-plan.md` — APS as the corpus's purest toll buyer (~3.6 GW of storage under 20-year tolls with Recurrent, Strata and GridStor against 150 MW owned; the 2023 RFP's 365-cycle / 50% SOC terms as the battery spec), the XHLF schedule (Decision 79293: ≥5,000 kW, ≥92% load factor, ESA, minimum bill, no explicit exit fee) and the subscription model, the 4.5 GW committed / ~20 GW uncommitted queue against an 8.6 GW peak, the rate case ($692M, 10.70% ROE, FRAM; ALJ order late Nov, ACC vote by Dec 31, 2026), Cholla coal-to-gas 380 MW by 2029, Palo Verde SLR to 2065–67.
  - `nisource.profile.json` (22 sources) + `nisource.study.json` (11 sections) + `study-prep/nisource/nisource-lesson-plan.md` — the ring-fenced GenCo affiliate (80.1/19.9 with Blackstone Infrastructure per the 10-K; IURC declination Sep 2025; Cause 46362 order of June 17, 2026 declining CPCN jurisdiction), the Amazon package (2 × 1,300 MW CCGT in 2 x 2 x 1 at Schahfer + 400 MW / 1,600 MWh at Mitchell; up to 3 GW, 2.4 GW by end-2032; 15-yr fixed capacity charge with an Amazon.com guarantee; +400 MW July 2026), Alphabet on a ~340 MW GenCo portfolio, the Quanta–Zachry EPC JV, ~$1.4B of bill credits, the $28.6B plan. **Identity corrected against the 10-K cover: NiSource is a Delaware corporation** (the hand-off's memory note said Delaware; EDGAR's company record shows IN for NIPSCO's own CIK), 801 East 86th Avenue, Merrillville; 7,668 full-time employees.
- **13 concepts** registered in `profiler-concepts.json` (1,570 → 1,583), collision-checked: `cooling-degree-day`, `default-service`, `emergency-order-202c`, `equity-forward`, `four-hour-battery`, `jurisdictional-declination`, `peak-demand`, `pumped-storage`, `reimbursement-agreement`, `ring-fencing`, `service-territory`, `weather-normalized`, `xhlf`. `stay-out` was dropped: `rate stay-out` is already an alias of `rate-freeze`.
- Registry entries (193 → 196; `aka[]` and `domains[]` populated before the step-7 grep), segment memberships (`utilities` · incumbent for all three; `storage-developers-and-ipps` · adjacent for PPL and NiSource, none for Pinnacle West, which owns ~150 MW against ~3.6 GW tolled), calendar rows (`ppl` ~2026-11-05, `pinnacle-west` ~2026-11-03, `nisource` ~2026-10-28, all `confirmed:false`) with notes, README tree entries for six data files and three curricula.

### Changed
- **`quanta-services` dossier v5 → v6 (v5 archived)** — step-7 reconciliation: its '~3 GW CCGT' program is two nominal 1,300 MW combined-cycle units (2.6 GW) plus a 400 MW battery per Zachry's award release and IURC Cause 46362; six strings corrected, the two reconciling sources added and a reciprocal `nisource` customer edge written.
- `PROFILER-COVERAGE-PLAN.md` §11.3: the three F-U3 rows rewritten with premise verdicts (PPL: four held, one partially held; Pinnacle West: four held, one refined; NiSource: three held, two refined, identity corrected) and flipped to v1 / v2. `phase-f-action-plan.md` §3: row 3 marked landed, the Done table extended, and a note that rows now run as project threads (research → hand-off → write).
- `profiler-relationships-accepted.json`: one reviewed finding accepted (`nisource × ppl`, both `other` by design — the shared Blackstone Infrastructure partner, no dealing between them).

### Verified
- `sync-profiler-registry.py --check` clean (roster and calendar in bijection); `build-profiler-graph.py` 1,685 → 1,712 edges; `check-profiler-study.py` 0/0; `check-profiler-relationships.py` 0 findings (21 accepted); `check-profiler-crossrefs.py` 0 candidates on the four dossiers; `check-profiler-reports.py` the four pre-existing pin warnings (`fluence`, `jinko`, `jupiter-power`, `oracle`); `check-readme-tree.py` 0 findings; Playwright: all six routes (three dossiers, three guides) render with zero page errors.
- Step-7 inbound reads: PPL 8 dossiers grepped by alias (5 substantive, 0 changed); Pinnacle West 12 (8 substantive, 0 changed); NiSource 5 (1 changed — `quanta-services`).
- **No rotation.** This push lands on **2026-09-29 EST**: 100 raw / **94 non-exempt** against a 100 trigger with 6 same-day sections, so the 2026-09-20 date group (v06.75r–v06.82r, 8 sections) the hand-off expected to rotate stays; the first push dated 2026-09-30 EST or later will count 100 non-exempt (the six 2026-09-29 sections stop being exempt) and must rotate it with SHA enrichment. Counter `Sections: 99/100` → `100/100`.
- **Classroom untouched by design:** `Classroom.gs` was not edited; `landscape-utilities-2026-09` and the three `scenario-utilities-*` rehearsals are now stale by eight new franchises (wave C, row 16). **No page, GAS script, diagram or rule changed.**

## [v07.73r] — 2026-09-29 04:52:56 PM EST

> **Prompt:** "Picking up from my last session, run Phase F session F-N2 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: WhiteFiber, 5C (Hypertec) and
> TECfusions — the neocloud that owns its site, and the two landlords behind four tenant neoclouds. This
> session runs on Fable 5.1 at High, per repository-information/phase-f-action-plan.md §3 row 1; the §11.3
> Model cells already read "Fable 5.1 High", so keep them.
>
> WHY NOW: phase 1 of the plan lands every remaining new dossier while this week's Fable allowance is
> unspent (it resets Sat 10/3, 7:00 AM ET). F-N2 goes first because Classroom wave A (row 9, Sat 10/3 –
> Tue 10/6) re-authors the neoclouds and AIDC-developer landscapes, and this session's three members should
> be in them. Do only F-N2: not the 10/1 neoclouds pass, not `profiler Habitat Energy`, not F-U3.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; phase-f-action-plan.md §2 and §3;
> PROFILER-COVERAGE-PLAN.md §7 and §11 (the three F-N2 rows of §11.3 are yours; §11.1's buying-authority
> test applies); .claude/rules/profiler-app.md (Profiler Command including step 1a identity and step 7
> reconciliation, Profiler Prep Command, Scheduled Refreshes); repository-information/PROFILER-SCHEMA.md
> (Naming and renames, Segments registry, Refresh calendar); repository-information/PROFILER-STYLES.md
> (active style). House pattern: the nscale and firmus dossiers and guides for a neocloud that builds its
> own sites, and the tract and powerhouse-data-centers ones for a landlord.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Proposed slugs: whitefiber, 5c-group, tecfusions. Category
> hypotheses: whitefiber ["neocloud"]; 5c-group and tecfusions ["developer"] — decide each on the record.
> Populate aka[] BEFORE the step-7 grep (WhiteFiber: WYFI, its Enovum data centres and the NC-1 campus if
> they are its; 5C: Hypertec, 5C Data Centers, whichever names the record uses). Assign segments with a
> basis line (hypothesis: whitefiber neoclouds · challenger; 5c-group aidc-developers-and-landlords ·
> challenger; tecfusions the same, plus bridge-and-on-site-generation · adjacent). Then the registry sync,
> the graph build, a calendar row per company (WhiteFiber is Nasdaq-listed: take its next results date
> from its own IR site and mark it unconfirmed until announced; the other two follow the private rule),
> README tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — establish, do not assume:
> - WhiteFiber: its relationship to Bit Digital after the 2025 IPO (ownership share, control), and which
>   entity owns and signs for NC-1 and the Canadian sites.
> - 5C: the legal entity — 5C Group, 5C Data Centers or Hypertec — and whether one slug covers it under
>   Naming and renames. Say why.
> - TECfusions: the operating entity, and who owns Keystone Connect and signs for its on-site generation.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF — web research from 2026-09-25 that nobody has read.
> Verify against first-party sources (10-K, 10-Q and S-1 via WhiteFiber's IR site; company releases;
> utility and state records; the tenants' own announcements), record a premise verdict per clause, and
> rewrite the cells. Check hardest:
> - WhiteFiber: NC-1 at ≥99 gross MW by 2029, served by Duke; 40 MW to Nscale (~$865M); the disclosed
>   MV switchgear supply issue (Q1 2026, resolved Q2) — what, from whom, and what it delayed;
>   ClusterMAX "Underperforming".
> - 5C: landlord to Together AI (Memphis MEM01; Maryland) and Vultr (Springfield, Ohio, a 150 MW building).
> - TECfusions: TensorWave's landlord (Tucson; Keystone Connect, "capable of 3 GW, primarily on-site
>   generation"; the 1 GW agreement of Oct 2024).
> For each, the §11.1 verdict: does it, or a platform it controls, sign for batteries, MV gear,
> generation or SSTs?
>
> RECONCILIATION (step 7) — measured 2026-09-29: no dossier names WhiteFiber, WYFI, Bit Digital, Enovum,
> 5C Group, Hypertec, TECfusions or Keystone Connect. Known collision, not inbound: "5C" as a battery
> C-rate in cornex, crrc-zhuzhou, cummins, gotion, great-power, narada and sunwoda. Grep again with the
> full aka[]. The work is the counterparty edges: nscale (WhiteFiber's tenant, which does not name it
> today) and duke-energy (NC-1's utility) get the reciprocal edge if the record supports one, revised
> under the Archival Procedure with any report pin re-checked. Together AI, Vultr and TensorWave were
> excluded from coverage on 2026-09-25: name them in prose with sources, but create no slug for them and
> do not re-propose them. Check the dossiers that already mention them (Together AI: crusoe, fluidstack,
> humain, iren, nscale; Vultr: amd, digital-realty; TensorWave: amd, fermi-america, firmus) for a
> contradiction with what you verify; revise only on a contradiction.
>
> LESSONS FROM F-H1, F-N1 AND F-I1 — apply them:
> - Every counterparty named in narrative prose rests on a source in sources[], ideally its own filing.
> - A tender, an MOU, a letter of intent or a signed-but-not-closed deal is not a completed transaction.
>   Type each on the record's own word. An unattributed figure is stated as unverified.
> - sec.gov was blocked from the sandbox before. Run check-source-reachability.py first; if EDGAR is
>   blocked, read the filings from the IR site and say so in the dossier.
> - Do not edit an existing concept in profiler-concepts.json; check new terms for collisions.
> - Write each lesson plan and study guide skeleton-first, then Edit (Incremental Writing, item d).
> - If an existing study guide contradicts a verified finding, correct it minimally and record it.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The new members make landscape-neoclouds-2026-09,
> scenario-neoclouds-discovery and landscape-aidc-developers-and-landlords-2026-09 stale (wave A, row 9),
> and landscape-bridge-and-on-site-generation-2026-09 if TECfusions takes its seat (wave D, row 17). Record
> that in the CHANGELOG entry and the SESSION-CONTEXT hand-off.
>
> FOR THE MEGMEET JOB: in the SESSION-CONTEXT hand-off, one short paragraph on whether any of the three
> signs for medium-voltage or DC power equipment — WhiteFiber's switchgear shortage is the lead — and what
> it means for an SST seller.
>
> VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
> build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new and revised dossier and guide renders under Playwright with zero page errors
> other than the sandbox's gis_load_failed. CHANGELOG rotation only if non-exempt sections reach 100 (it
> reads 98/100 after v07.72r). Normal Pre-Commit and Pre-Push checklists; one commit; push on a claude/*
> branch. At the end, tell me the session's usage value from get_session so the plan's cost table grows."

**Phase F, session F-N2 — WhiteFiber, 5C Group and TECfusions** join the Profiler corpus: the neocloud that owns its site, and the two landlords behind four tenant neoclouds. Three dossiers, each with a v2 study guide and a lesson plan, plus the reciprocal edges on `nscale` and `duke-energy`. Run on Fable 5.1 at High.

### Added

- **Three schema v7 dossiers** (`profileVersion` 1, intel-briefing style), each researched by two parallel subagents under the two-stage protocol. `check-source-reachability.py` ran before Stage 2: **OK** — `sec.gov` and `data.sec.gov` answered 200 with `SEC_USER_AGENT`, so WhiteFiber's 10-K, 10-Qs, prospectus and 8-Ks, Nscale's S-1 and Apex Treasury's 8-K/425 filings were read on EDGAR.
  - **`whitefiber.profile.json`** — `categories: ["neocloud", "developer"]` ('developer' added on the record: the Nscale lease is 93% of a US$1.0B backlog); 84 sources (61% first-party), 25 developments, 4 products, 10 relationships, 12 decision makers (3 with photos), 4 policy entries.
    - **Identity:** WhiteFiber, Inc., a Cayman exempted company on the Nasdaq Capital Market (WYFI) since 7 Aug 2025. Bit Digital holds 27.04M shares: 74.3% at the IPO, 69.6% on 12 Aug 2026 and **59.9%** after the 21 Aug 2026 note exchange (13D/A); a 'controlled company' with a shared CEO and no distribution announced.
    - **NC-1:** 805 Island Drive, Madison, NC, owned through Enovum NC-1 Bidco, LLC, which took the Unifi purchase assignment (US$45M base) and Duke Energy Carolinas' service agreement. Duke's 16 May 2025 letter promises 24/40/99 MW on 'commercially reasonable efforts' by May 2029; 54 gross MW delivered by May 2026.
    - **The switchgear issue:** disclosed 14 May 2026 as 'certain medium-voltage switchgear components'; the CEO said on 12 Aug 2026 the 'delivering and commissioning issues … have since been resolved'. It pushed Nscale's April/May ready-for-service dates into Q3 2026. No supplier is named anywhere.
  - **`5c-group.profile.json`** — `categories: ["developer"]`; 77 sources (49% first-party), 22 developments, 3 products, 4 relationships, 8 decision makers, 4 policy entries.
    - **Identity:** **5C AI Group Inc.** (Saint-Laurent, Quebec), spun out of Hypertec Group on 10 Apr 2025 when Hypertec Cloud acquired 5C Data Centers; Hypertec 'remains largest shareholder', Brookfield holds structured equity. One slug under Naming and renames; display name '5C Group' because bare '5C' fails the collision test.
    - **The substation:** FirstEnergy's OPSB filing records a 138 kV tap 'to the new 5C Data Center USA, Inc. substation … The customer will own the Benjamin Substation'. Crusoe is a second Springfield tenant the brief did not carry (WYSO; an Ohio tax record).
  - **`tecfusions.profile.json`** — `categories: ["developer"]`; 77 sources (45% first-party), 23 developments, 3 products, 2 relationships, 12 decision makers, 4 policy entries.
    - **Identity:** TECfusions, Inc. (Florida), 100% founder-owned via Jeremiah 29:11, LLC. **Keystone Connect is the former Alcoa/Arconic R&D campus in Upper Burrell, PA (New Kensington), not Clarion and not a glass plant.** A US$4.0B SPAC merger with Apex Treasury (APXT → 'TECF') was signed 21 Jul 2026 and is **not closed** (no S-4 by 29 Sep). The deck discloses the founder's prior criminal convictions as a risk factor.
    - **Generation:** 'currently powered by turbines' (company) against 'drawing from existing grid power lines' (TribLive); no turbine OEM and no PA DEP air permit on the record; 2 MW live at the flagship against 3 GW marketed.
- **Three schema v2 study guides**, each with flashcards and a self-test on concepts only: `whitefiber.study.json` (14 sections), `5c-group.study.json` (13), `tecfusions.study.json` (12).
- **Three lesson plans** under `repository-information/study-prep/<slug>/`, six modules each, paced to 7 Oct 2026, written skeleton-first and filled by module (Incremental Writing, item d).
- **15 new concepts** in `profiler-concepts.json` (1,555 → 1,570), each checked for collisions; three aliases that collided (`contracted backlog` → `contracted-capacity`; `SOFC` → `solid-oxide-fuel-cell`; `tax abatement` → `chapter-312-abatement`) were dropped rather than the existing entries edited: `remaining-performance-obligations`, `adaptive-reuse`, `earn-out`, `lead-time`, `related-party-loan`, `fuel-cell`, `customer-owned-substation`, `upfront-capacity-charge`, `enterprise-zone`, `pilot`, `gas-turbine`, `spac`, `pipe-financing`, `redemption`, `s-4`.
- **3 executive photos** in `live-site-pages/images/execs/` (`whitefiber-tabar`, `-zhu`, `-krassakopoulos`), from the IR page's leadership cards (avif converted to jpg; the name mapping verified against the page's alt text).
- **Two archive files**: `nscale.profile.v1.json` and `duke-energy.profile.v1.json`, each with an `archive-index.json` entry.

### Changed

- **Two counterparty dossiers revised under the Archival Procedure** (step 7):
  - `nscale` v1→v2 — gains the `whitefiber` **supplier** edge (its landlord at the Madison site: 10 years, 40 MW IT, ~US$865M) with the two WhiteFiber sources; its own 'partner-run' Madison prose was accurate and is unchanged.
  - `duke-energy` v1→v2 — gains the `whitefiber` **customer** edge (the 24/40/99 MW letter and the assigned ESA), and its `nscale` edge is **retyped from customer to `other`**: Nscale is the site's tenant; the Duke agreements are WhiteFiber's. Both edges say no Duke document names either company.
  - No report pins either dossier, so `report-pins-verified.json` is unchanged.
- **`profiler-companies.json`** — 190 → 193 entries. `aka[]` (Enovum, Bit Digital, NC-1, MTL-1/2/3, WYFI; Hypertec, Hypertec Cloud, 5C Data Centers, CMH01, MEM01; Keystone Connect, Tecfusions Keystone, Apex Treasury, TECF) and `domains[]` populated **before** the step-7 grep.
- **`profiler-segments.json`**, each with a basis line: `neoclouds` +`whitefiber` challenger, +`5c-group` adjacent (ten → twelve members); `aidc-developers-and-landlords` +`whitefiber`, +`5c-group`, +`tecfusions`, all challengers; `bridge-and-on-site-generation` +`tecfusions` adjacent (TECfusions took its seat).
- **`profiler-graph.json`** — rebuilt: 1,685 edges (1,269 curated).
- **`profiler-refresh-calendar.json`** — `whitefiber` public, `nextReport` 2026-11-12 **unconfirmed** (stockanalysis.com's estimate; Q3 2025 was reported 13 Nov 2025; the IR site lists no date); `5c-group` and `tecfusions` private, `cadence: quarterly`, `tier: core`, with a conversion note each (an IPO filing; the SPAC close). **`profiler-refresh-notes.json`** — a source and `watch[]` per slug.
- **`profiler-crossref-accepted.json`** — two reviewed candidates accepted with reasons (`duke-energy × nscale`, `duke-energy × whitefiber`): both flag the same 'unconfirmed from Duke's side' marker, which nothing in either dossier can close.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the three F-N2 rows rewritten as verified cells with a premise verdict per clause and the §11.1 answer; Model **Fable 5.1 High**; `Checked 2026-09-29, v07.73r`; Dossier v1; Guide v2. The verdicts that moved: WhiteFiber's 99 MW is a schedule, not a contract, and the switchgear resolution is Q3, not Q2; 5C's '150 MW building' is one of five figures for the same building; TECfusions' place (Upper Burrell), its '3 GW' (a marketing figure against 2 MW live) and its '1 GW agreement' (a commitment restated as a right of first refusal).
- **`phase-f-action-plan.md`** — F-N2 added to the Done table; §3 row 1 marked landed, with the wave A and wave D seats it adds.
- **README.md** — tree entries for the three profile/study pairs, the three study-prep directories and the two archive files, plus the timestamp and repo version.
- **`SESSION-CONTEXT.md`** — a new Latest Session (the F-N2 hand-off, with the Megmeet paragraph). The v07.72r entry moved to Previous; the cooling-recheck entry dropped under the two-session cap.

### Notes

- **Step-7 reconciliation**, grepped with the full `aka[]` against the pre-revision dossiers: **0 inbound for all three**, as measured on 9/29. The seven '5C' hits are battery C-rates. The tenant mentions (Together AI in `crusoe`, `fluidstack`, `humain`, `iren`, `nscale`; Vultr in `amd`, `digital-realty`; TensorWave in `amd`, `fermi-america`, `firmus`) were read against the verified record: **none contradicts it**, so none was revised. Fermi's 222 MW TensorWave lease became the `fermi-america` competitor edge on `tecfusions`. No slug was created for Together AI, Vultr or TensorWave.
- **§11.1 buying authority:** all three sign for medium-voltage gear behind the meter. **WhiteFiber** buys switchgear, transformers, UPS, generators and cooling behind a Duke-owned substation, and its one documented failure is the switchgear category. **5C** owns the 138 kV substation at Springfield (so the transformers too), 19 diesel gensets and 'prefabricated power skids'; its Memphis behind-the-meter turbines are unpermitted on the public record. **TECfusions** buys generation, UPS, switchgear and 'continuous duty-rated' machines at 2 MW of live flagship capacity. **None has signed for an SST, 800 VDC or a battery**, and none names a vendor or an EPC.
- **Existing study guides checked for contradictions:** no guide names any of the three; the `nscale` guide's Madison material is unaffected. No guide was corrected.
- **Classroom lessons now stale, by design — `Classroom.gs` was not edited:** `landscape-neoclouds-2026-09` (ten members become twelve) and `scenario-neoclouds-discovery`; `landscape-aidc-developers-and-landlords-2026-09` (three more challengers); `landscape-bridge-and-on-site-generation-2026-09` (TECfusions adjacent, for wave D). Wave A (row 9) and wave D (row 17) re-author them. `build-classroom-segments.py --check` reads **19 of 19 due** (17 with section changes, 2 pin-only), unchanged in count from before this session.
- **Checkers:** `sync-profiler-registry.py --check` clean (193 in bijection); `build-profiler-graph.py` rebuilt; `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates after the two accepts (32 over-cap scopes not examined, as before); `check-profiler-study.py` 0 errors (193 guides, 1,570 concepts); `check-readme-tree.py` 0 findings; `check-profiler-reports.py` 0 errors and the same four pre-existing warnings (`fluence` v10, `jinko` v6, `jupiter-power` v7, `oracle` v6), read and left loud.
- **Playwright:** the three new dossiers and the revised `nscale` and `duke-energy` render on `Profiler.html` with every tab and the study guide (opened and closed with ✕), no literal `{{` or `**`, and the only page error is the sandbox's `gis_load_failed`. `Profiler.html` is unchanged (data-only), so no page version bump.
- **Not run here, as instructed:** the 10/1 neoclouds pass, `profiler Habitat Energy` and F-U3.
- **No rotation:** 99 sections, under the trigger.

## [v07.72r] — 2026-09-29 03:51:31 PM EST

> **Prompt:** "Based on the context above, generate a new chronological action plan with different phases, each with a recommended model/effort level (Opus 5.5 or Fable 5.1, Medium, High, Xhigh). Then, give me a prompt to paste into a new Fable 5.1 High session to run F-N2, then remember session."

The v07.71r schedule, now grouped into five named phases, plus the paste-in prompt for its first session, and the session context saved.

### Added

- **`phase-f-action-plan.md` §7 — the F-N2 paste-in prompt (WhiteFiber, 5C/Hypertec, TECfusions) for Fable 5.1 High**, modelled on §5's F-N1 prompt with the F-N1 and F-I1 lessons. It covers:
  - the identity questions: WhiteFiber after the Bit Digital IPO, 5C's legal entity, and who owns Keystone Connect;
  - the §11.3 clauses to verify hardest, led by WhiteFiber's disclosed MV switchgear supply issue;
  - a step-7 scope measured on 9/29. No dossier names any of the three, and "5C" in seven cell-maker dossiers is a battery C-rate collision. The work is the counterparty edges (`nscale`, `duke-energy`), with no slug for the excluded tenants (Together AI, Vultr, TensorWave);
  - the landscape coupling: wave A, plus `landscape-bridge-and-on-site-generation-2026-09` via wave D if TECfusions takes that seat;
  - a closing request to report the session's `get_session` usage value, so §2's cost table grows.

### Changed

- **`phase-f-action-plan.md` §3 — five named phases over the same 18 rows:**
  1. New dossiers while this week's Fable is unspent (rows 1–8, to Sat 10/3).
  2. The stale Classroom modules before the Megmeet start (rows 9–10).
  3. The capital filers and the grid operators (rows 11–14, to Sat 10/10).
  4. The remaining landscapes (rows 15–17, to Sat 10/17).
  5. Megmeet's Q3 (row 18).
  The prompts note now points at §7.
- **`SESSION-CONTEXT.md`** — a new Latest Session covers:
  - the stale "run F-I1" request, and the model question with its correction;
  - the v07.71r re-plan, with its measured costs and the ~$1,200 weekly Fable floor;
  - phase 1's order, and the row numbers that `REMINDERS.md` still cites from the 9/26 plan.
  The cooling-recheck entry moved to Previous, and the 9/26 F-I1 entry dropped under the two-session cap.
- **`README.md`** — the tree entry for `phase-f-action-plan.md` names the phases and the F-N2 prompt.

## [v07.71r] — 2026-09-29 03:39:25 PM EST

> **Prompt:** "I want to efficiently use up all my Fable usage every week and this project has 14 Fable sessions. Can you revise the plan so that I can run heavy sessions that add dossiers earlier? I assume it will require much less tokens to update an existing dossier than to create it from scratch right?"

The Phase F plan, re-planned Fable-first by budget week. Every remaining new-dossier session now runs ahead of the Classroom waves, and each session carries its own model and effort. The cost question was answered from recorded session values rather than assumed.

### Changed

- **`phase-f-action-plan.md` §3 — a week-by-week schedule, 18 sessions, weeks resetting Saturday 7:00 AM ET:**
  - **Week 1 (to Sat 10/3), seven Fable sessions:** F-N2, F-U3, F-U4, the neoclouds + Habitat pass, F-I4, F-G1 and F-A1, plus the 9/30 check on Opus 5.5 medium. F-U3 and F-U4 move up from mid-October; F-N2, F-I4, F-G1 and F-A1 from November.
  - **Week 2 (to Sat 10/10):** wave A and the Dominion reframe before the 10/7 Megmeet start, ERCOT and PJM (from the last row), and F-I2 and F-I3 on Opus 5.5 xhigh. F-I2 runs by 10/7 even if DigitalBridge has not closed: the dossier records the deal as pending, and a targeted refresh adds the close later.
  - **Week 3 (to Sat 10/17):** waves B, C and D. Wave B takes all ten new capital members at once, and wave D loses its capital, neocloud and AIDC count corrections, because every new member now lands before its wave. The approved DigitalBridge fallback is kept unchanged.
  - Row 18, the Megmeet refresh and AIDC report, still waits on the Q3 filing. **All other rows land by 10/17, against late November in the 9/26 plan.**
  - A note on adapting the §4–§6 prompts: replace the hard-coded "Opus 5.5 at xhigh" with the row's model.
- **`phase-f-action-plan.md` §2 — the model and effort rule, and the budget:**
  - The all-Opus rule of 9/26 is withdrawn, and `PROFILER-COVERAGE-PLAN.md` §2's split is restored. **Opus 5.5 xhigh** for long filings (F-I2, F-I3, the Megmeet refresh). **Fable 5.1 xhigh** for the Classroom waves and ERCOT. **Fable 5.1 High** for private, thin-record and regulatory subjects (F-U3, F-U4, F-N2, F-G1, F-I4, PJM, the neoclouds pass, the Dominion reframe). **Fable 5.1 Medium** for F-A1. F-U3, F-U4 and PJM drop from xhigh to High. Totals: 14 Fable and 4 Opus sessions; 8 xhigh, 8 high and 2 medium.
  - **Measured costs, from `get_session`'s `usage.cost_usd` (list-price value, not a charge):**
    - New dossiers: F-U1 + F-U2 $222 on Fable (~$44 a company); F-H1 $102, F-N1 $84 and F-I1 $104 on Opus 5.5 ($28–$52 a company).
    - Refreshes: Habitat Energy + Gridmatic $13 (~$7 a company), and CoolIT with the cooling module $29. Megmeet v8, a deep refresh, cost $129.
    - The answer: **a light refresh costs a fraction of a new company (about $7 against $28–$52), but a deep one costs more than a whole three-company session.** Cost follows research depth and the number of dossiers re-read, not whether the file exists.
  - **The Fable half is about $1,200 a week:** the week of 9/19–9/26 spent about $1,180 of Fable value across 25 sessions before the weekly warning appeared. That is about seven heavy Fable sessions a week, so Phase F's 14 are about two weeks. This is marked as an inference: the warning threshold is not published.
  - The 50% Fable share of the one shared weekly limit is re-verified against the help centre.
- **`phase-f-action-plan.md` header and §1:**
  - The title drops "on Opus 5.5". A re-plan paragraph now leads the file.
  - Status-paragraph row references are labelled by plan (9/26 or the 9/29 re-plan).
  - §1 notes that 24 companies in 8 sessions remain, plus ERCOT and PJM.
- **`PROFILER-COVERAGE-PLAN.md`:**
  - A §11.2 note records the reversal. §11.3's ERCOT and PJM Model cells read Fable 5.1 xhigh and Fable 5.1 High.
  - The ERCOT/PJM note points at §3 rows 13–14.
- **`README.md`** — the tree entry for `phase-f-action-plan.md` describes the re-plan.

## [v07.70r] — 2026-09-29 07:58:32 AM EST

> **Prompt:** "Dismiss the cooling reminders. Then, continue with your recommendation."

The developer dismissed both cooling reminders. The v07.69r recommendation — a `profiler CoolIT` refresh to fix the dossier's seven 28 September launch-date mentions — ran now rather than waiting for Thursday's Profiler session. It depends on no 9/30 filing, and the dossier was stale today.

### Changed

- **`coolit.profile.json` — refreshed to profileVersion 3; v2 archived** (`archive/coolit.profile.v2.json`, archive index updated).
  - **Every 28 September launch mention is corrected.** Affected fields: the summary's bottom line, `productsAndServices[0].highlights[5]` and `.roadmap`, `strategyRead[1]`, `[4]` and `[8]`, and the teaser's source label. Each now says the CDU was announced for 28 September, did not launch on that date and has no new one.
  - **The date's origin is now cited.** CoolIT's LinkedIn post of 22 September says "Launching September 28." The teaser page, last modified 25 September, now offers an undated "official unveiling".
  - **Seven new developments:**
    - The missed launch (28 Sep).
    - The Data Center Frontier Calgary tour (28 Sep): about 950 employees, about 200,000 sq ft across Starfield 1 and 3, a 6 MW test rig, and two-phase work called complementary.
    - The Globe and Mail's Top Growing Companies 2026 (25 Sep): #168 of 375, 156% three-year growth, CAD 250–500M revenue band, 813 employees.
    - A Bank of America estimate via Benzinga (24 Sep), marked as a second-hand analyst figure: more than USD 500M revenue entering 2027, and a possible USD 700M run rate in 2027.
    - The single-phase white paper (21 Sep).
    - The "Future is Fanless" post (14 Sep).
    - Ecolab's Investor Day at SC26 on 17 Nov in Chicago (announced 25 Aug), which the 9/04 dossier missed.
  - **Indicators to watch:**
    - The next-gen CDU is now undated.
    - Ecolab's Q3 is day-level: results before market open on 27 Oct, per its 22 Sep release.
    - Two new venues: the OCP Global Summit (13–15 Oct) and the SC26 Investor Day (17 Nov).
  - **Other fields:**
    - `employees`: adds about 950 (DCF) and 813 (G&M).
    - Ken Lau's title is now **General Manager, APAC** (Data Centre World Asia programme).
    - `relationships[nvidia]`: adds that NVIDIA's first DSX Ready CDUs (September 2026) came from LG, LiquidStack and Vertiv, not CoolIT.
    - `sources[]`: 151 → 162 (11 added).
- **`coolit.study.json`** — one sentence now says the next-gen CDU was announced for 28 September and did not launch on that date. `lastUpdated` → 2026-09-29.
- **`study-prep/coolit/coolit-lesson-plan.md`** — the same correction, in its boundary paragraph.
- **`profiler-refresh-notes.json`** — CoolIT's watch item no longer says the CDU "launched 28 September 2026". **`profiler-refresh-calendar.json`** — `lastRefreshed` → 2026-09-29.
- **`README.md`** — tree entry for `archive/coolit.profile.v2.json`.
- **Registry and graph:** `sync-profiler-registry.py` (`srcTotal` 151 → 162, `srcFirstPct` 65 → 64, `lastUpdated`) and `build-profiler-graph.py` were both run.
- **`REMINDERS.md`** — both cooling reminders (2026-09-24 06:34 PM and 2026-09-26 05:08 PM) moved to Completed Reminders, dismissed by the developer after the v07.69r recheck.
- **`phase-f-action-plan.md`** — the status line records the refresh.

### Notes

- **Identity check (step 1a):** CoolIT is still a private Ecolab subsidiary (NYSE: ECL parent). Its own 24 Sep post calls it "CoolIT, an Ecolab company". The leadership page is unchanged since 28 April. Ecolab has made no 8-K since 28 July, and its only September filing is a director's Form 4.
- **Research:** Stage 1 covered CoolIT's news feed, WordPress API, CDU catalogue, OCP page and LinkedIn, then Ecolab's releases and EDGAR (with `SEC_USER_AGENT`; the probe verdict was OK). Stage 2 was one background agent: trade press, rankings, litigation and NVIDIA lists, about 38 sources evaluated. I spot-checked the load-bearing claims myself: the LinkedIn "Launching September 28." text, the Globe and Mail data row, and Ecolab's Investor Day release.
- **Not found:** a new launch date or venue, a Vera Rubin rating, a named customer since 9/4, leadership changes, and litigation. A vendor blog's claim that CoolIT is on a 2 September NVIDIA CDU list could not be verified and was left out.
- **Step 7 reconciliation:** 4 dossiers mention CoolIT (`dg-matrix`, `flex`, `kkr`, `supermicro`), 13 hits read. All are career history, the Ecolab and KKR transaction, or the recorded Supermicro disagreement. None mentions the launch, and none changed. `check-profiler-crossrefs.py`: 0 candidates.
- **Segments:** `cooling` · incumbent is unchanged. Neither the role basis nor the product lines moved.
- **Checks:**
  - `check-profiler-relationships.py`: 0 findings. `sync-profiler-registry.py --check`: 0 out of sync, calendar in bijection.
  - `check-profiler-study.py`: 0 errors / 0 warnings on 190 guides.
  - `check-profiler-reports.py`: 0 errors, 4 existing warnings. No report pins `coolit`.
  - `check-readme-tree.py`: 0 findings.
- **Classroom impact:** `build-classroom-segments.py --check` reads **19 due (was 17)**, because the graph rebuild moves every segment's graph pin, as after any dossier write. `cooling` was already due; wave A/B regenerates them. The cooling landscape's ledger still cites `profile:coolit @ v1`. Its parenthetical "the dossier still states the 28 September date" is accurate for v1 and now superseded by v3. It is left for the module's next revision rather than making a same-day Classroom bump.
- No page changed, so no page version bump. The CHANGELOG counter is 96/100, so no rotation.

## [v07.69r] — 2026-09-29 07:32:24 AM EST

> **Prompt:** "recheck the cooling module after CoolIT"

This is the cooling recheck from the standing reminder (row 3 of `phase-f-action-plan.md`). **CoolIT's next-generation CDU did not launch on 28 September 2026, and CoolIT has not set a new date.** I offered three options (revise now with reviewBy 27 Oct, wait until 9/30, or revise with 19 Oct). The developer chose **revise now**, which I recommended.

### Changed

#### Classroom.gs — v01.93g

- **`landscape-cooling-2026-09`** (guidance, contributor+) now records that the launch slipped. `updated` moves 2026-09-24 → 2026-09-29. **`reviewBy` moves 2026-09-28 → 2026-10-27**: Ecolab's Q3 results, before market open (Ecolab release, 22 Sep 2026). That is the nearest remaining dated gate on this subject, and no other module uses it. One entry is appended to `revisions[]`. All of the following was read on 29 Sep from CoolIT's own site:
  - The news feed and its WordPress news API show no launch post.
  - The `cdu-product` catalogue still tops out at the 2 MW CHx2000.
  - "The Next Gen AI CDU" page (last modified 25 Sep) now offers an undated "official unveiling".
  - The OCP Global Summit 2026 page (edited 22 Sep) shows only "the proven CHx2000".
- **Corrected in place, section ids unchanged:**
  - `the-indicators`: row 1 is now undated and row 3 names itself the review date. The intro's counts change to four day-level rows (was five) and two undated rows. The sales note now names both regulatory rows inside twelve months: the November tariff and the **1 January 2027 data-centre refrigerant limit**. That contradiction was left by the 24 Sep correction, not caused by the slip.
  - `claims-ledger`: the intro and the launch row now cite CoolIT's own pages. A new row cites Ecolab's 22 Sep release.
  - `drill`: the review-clock card now answers 27 October and explains the slip.
  - `source.doc` and the function's header comment record the recheck.
- **Not changed:** the CDU ladder (Schneider's 3.5 MW WCDU still tops it and CoolIT's rung is still 2.0 MW), the launch's test, and every other section.
- `coolit` moved to v2 on 26 Sep for the KKR edge only. A field diff shows nothing else changed, so its ledger tags stay `@ v1`.

#### Other files

- **`landscape-cooling-analysis.md`** — new section "Revision — 29 September 2026 recheck": the four sources as read, the re-taken `reviewBy` with three candidates rejected in writing, and the four corrections.
- **`phase-f-action-plan.md`** — the status line records row 3 as run.

### Notes

- **Confidence:** the dossier read the teaser page on 4 Sep as "launching 28 September 2026". The page now has no date, and 25 Sep is its last modification. The earlier copy could not be retrieved because the Wayback Machine is blocked here. So the removal is certain, but its exact day is not.
- **Follow-up, not done here:** `coolit.profile.json` still states the 28 Sep date in seven fields. That is a `profiler CoolIT` refresh, outside a guidance recheck.
- **Checks:**
  - `node --check` clean; `check-gas-inner-scripts.js`: 106 blocks clean.
  - `check-classroom-content.py`: 8 errors, 0 warnings, **byte-identical to the pre-edit baseline**. All 8 are known segment-roster regenerations waiting for wave A/B.
  - `check-classroom-curriculum.py --strict`: no structural findings. The only diff from baseline is this module's `PASSED` flag clearing.
  - `check-classroom-pipeline.py --base origin/main`: 9 × P2 (below-the-fence guidance, expected for a developer session), no P3, so the gate digest is untouched.
  - `check-readme-tree.py`: 0 findings.
- No page changed, so no page version bump.

## [v07.68r] — 2026-09-26 05:05:03 PM EST

> **Prompt:** "1. SEC contact: <LightAISolutions Profiler Research> <jonyang92@gmail.com>
> 2. Looks good.
> 3. I approve of your recommendation.
> 4. Good.
> 5. Keep the newer one and dismiss the older one.
> 6. Good."

The developer's answers to v07.67r: the SEC contact supplied, the DigitalBridge fallback approved, and the older 9/30 reminder dismissed.

### Fixed

- **`scripts/check-source-reachability.py` — SEC now answers.** SEC hosts get a new `SEC_USER_AGENT`, `LightAISolutions Profiler Research` plus the contact email the developer supplied for this purpose. Every other probed host keeps the neutral `USER_AGENT`, so the address goes to SEC only. The file's own rule, never to send a personal address to third-party hosts, still holds for them.
  - **Verified:** the probe's verdict is **OK** for the first time since v04.91r: `sec.gov` 200, `data.sec.gov` 200, and the ASX, LSE and NVIDIA control hosts 200.
  - The probe's 403 message no longer blames 'this network'; it points at `SEC_USER_AGENT`. The docstring carries a dated amendment.

### Changed

- **`.claude/rules/profiler-app.md`** (Profiler Command, the probe step) — records that the v04.91r 'block' was SEC refusing a `github.io` contact. Every request to `sec.gov` or `data.sec.gov`, a subagent's curl included, now sends the exact `SEC_USER_AGENT` string read from the script, and only to SEC hosts.
- **`PROFILER-SCHEMA.md`** — the disclosure-tier note carries the same correction.
- **`profiler-refresh-notes.json`** — BlackRock's access note records the fix.
- **`phase-f-action-plan.md`** — row 10's DigitalBridge fallback is marked recommended and approved: move `scenario-capital-objection`'s reviewBy to Fri 11/6 if the close has not happened by Wed 10/7, with the 10/30 backstop.
- **`REMINDERS.md`** — the 2026-09-24 09:54 PM reminder to check the 9/30 Classroom run moved to Completed Reminders, dismissed by the developer. The 2026-09-26 01:21 AM reminder covers the same check and stays active, unchanged.

### Notes

- The paste-in prompts kept 'as run' in `phase-f-action-plan.md` still mention the EDGAR block. They are records of what was sent, so they were not rewritten.
- No page changed, so no page version bump.

## [v07.67r] — 2026-09-26 04:52:03 PM EST

> **Prompt:** "1. What kind of contact address does SEC need? An email or mailing address? Give me the format to give it to you in.
> 2. I approve the small Profiler page fix. Execute.
> 3. If DigitalBridge hasn't happened by 10/7, then move the review date later. Recommend how much later.
> 4. I definitely want to cover ERCOT and PJM as grid operators as they are two of the biggest ones I am familiar with.
> 5. What are the reminders and their differences?
> 6. List the 60 older archive files in a housekeeping pass."

The follow-up to F-I1's evaluation: the approved Profiler bold fix, the README archive backfill, and the developer's decisions on ERCOT/PJM and the DigitalBridge fallback, recorded in the plans.

### Fixed

- **Profiler v01.93w — `**` now renders as bold wherever dossier prose is appended after a label.** Five paths inserted text as a raw text node, so house-style bold printed as literal asterisks:
  - the Relationships tab's 'Mentioned in X's dossier' evidence excerpts;
  - the Capabilities tab's Positioning, Sold through, Target segments and Roadmap rows;
  - the Policy tab's Mitigation lines;
  - the Ecosystem explorer's quote and tie lines.
  - All five now go through one helper, `ovAppendRich`, which reuses `ovSetText` through a document fragment: no wrapper element, no `innerHTML`. An excerpt with an odd number of markers (cut mid-bold) has them stripped rather than bolding the wrong run.
  - **Verified with Playwright:** 16 dossiers that showed literal `**` before (`blackrock`, `kkr`, `cyrusone`, `brookfield`, `macquarie`, `blackstone`, `jupiter-power`, `mgx`, `aligned`, `nvidia`, `vistra`, `compass-datacenters`, `aon`, `clearway-energy`, `eolian`, `meta`) now show none on any tab. BlackRock's evidence shows 4 bold runs, and the explorer shows 0 literal markers and 16 bold runs. Zero page errors; the page reports v01.93w.
  - `Profilerhtml.changelog.md` gains v01.93w. The file sits at its 50-section cap, so the oldest date group (v01.43w, 2026-08-27) moved to `Profilerhtml.changelog-archive.md` with its commit link (`9d8b671`), as the v07.50r rotation did.

### Changed

- **README tree — the 63 unlisted archive files are now listed**, so all 447 archived dossier versions (plus `archive-index.json`) appear. Each sits in version order beside its company's other entries, or alphabetically where the company had none. Eight long legal-name labels were shortened to the dossier's short name, two of them on existing lines (Invenergy, McCarthy). The README tree also shows Profiler at v01.93w.
- **`phase-f-action-plan.md`:**
  - **ERCOT and PJM approved** (developer, 2026-09-26) for coverage as grid operators, in a new `grid-operator` category rather than `other`. Two sessions, ERCOT first, because 73 inbound dossiers is a larger step 7 than all of F-I1. The category change (schema note, category list, Profiler page) is made in the ERCOT session. Row 21 and the note under Stage 3 are rewritten; the totals now count two grid-operator sessions.
  - **DigitalBridge fallback on row 10:** if the close has not happened by Wed 10/7, `scenario-capital-objection`'s reviewBy moves from 10/14 to **Fri 11/6**, the date `landscape-capital-2026-09` already carries, so the two are re-authored together. If it still has not closed by Fri 10/30, wave B runs without SoftBank and Blue Owl.
  - The status line records both decisions.
- **`PROFILER-COVERAGE-PLAN.md` §11** — the 'held for a developer decision' paragraph and the two held ERCOT/PJM ledger rows now read approved, with the new category.

### Notes

- **SEC contact format, from SEC's own 'Accessing EDGAR data' page:** `User-Agent: Sample Company Name AdminContact@<sample company domain>.com`. That is a name and an email address; no mailing address is asked for. Tested on 26 Sep with placeholder mailboxes: a `github.io` contact gets 403 from `data.sec.gov` and `www.sec.gov`, while `gmail.com`, `outlook.com` and `acme.com` contacts get 200. The only place the contact lives is `USER_AGENT` in `scripts/check-source-reachability.py`, which stays unchanged until the developer supplies an address.
- **DigitalBridge, as of 26 Sep:** DigitalBridge announced on Tue 22 Sep that every regulatory approval had been received and that the deal was expected to close within five business days (by Tue 9/29). Completion is not yet confirmed; the fallback applies only if it slips.
- **Reminders were not changed.** They are the developer's; the two overlapping 9/30 entries were described, not edited.
- `Classroom.gs` was not edited; the 11/6 move is conditional and dated 10/7.

## [v07.66r] — 2026-09-26 07:19:39 AM EST

> **Prompt:** "Picking up from my last session, run Phase F session F-I1 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: BlackRock (with GIP, AIP and HPS)
> and KKR — the two most-cited capital names the corpus does not yet cover. This session runs on Opus 5.5
> at xhigh. The §11.3 Model cells already read "Opus 5.5 xhigh"; keep them.
>
> WHY NOW: BlackRock is the most-cited uncovered company in the corpus, and both dossiers must exist
> before Classroom wave B re-authors landscape-capital-2026-09 and scenario-capital-objection (reviewBy
> 10/14). There is no other date gate. Do NOT run F-I2 (SoftBank, SB Energy, Blue Owl) — it waits on the
> DigitalBridge close — and do not run the 10/1 neoclouds pass or `profiler Habitat Energy`.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/phase-f-action-plan.md
> (§5 and the F-N1 outcome are the latest pattern); PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the two
> F-I1 rows of §11.3 are yours; §11.1's buying-authority test applies through the platforms each
> controls); .claude/rules/profiler-app.md (Profiler Command including step 1a identity and step 7
> reconciliation, Profiler Prep Command, Scheduled Refreshes); repository-information/PROFILER-SCHEMA.md
> (Naming and renames, Segments registry, Refresh calendar); repository-information/PROFILER-STYLES.md
> (active style). Read the blackstone, brookfield, macquarie and mgx dossiers and study guides as the
> house pattern for a capital-segment incumbent, and the aligned, cyrusone, stack-infrastructure,
> eolian, vistra and aep dossiers — they carry the platforms these two control or co-own.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Proposed slugs: blackrock, kkr. Category hypothesis:
> ["investor"] for both. Populate aka[] BEFORE the step-7 grep, including the platforms and brands the
> corpus uses: BlackRock — Global Infrastructure Partners / GIP, AI Infrastructure Partnership / AIP, HPS
> Investment Partners, BlackRock Climate Infrastructure, and any controlled developer you establish
> (Akaysha Energy is named in dnv as BlackRock's); KKR — Kohlberg Kravis Roberts, Global Atlantic, and
> its named infrastructure vehicles. Assign segments in
> live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: capital ·
> incumbent for both; the segment has eight members today). Then the registry sync, the graph build, a
> calendar row per company under the Refresh calendar rules (both are NYSE-listed — BLK and KKR — so take
> each next results date from its own IR site, and mark it unconfirmed until it is announced), README
> tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — establish each of these, do not assume it:
> - BlackRock: one slug for BlackRock, Inc. with GIP, AIP and HPS in aka[], or a separate GIP slug?
>   Decide under Naming and renames and say why — GIP is the platform that controls most of the buyers.
>   Establish when the GIP acquisition closed, AIP's current members and legal form, and whether the HPS
>   and Preqin acquisitions have closed.
> - KKR: KKR & Co. Inc.; which KKR vehicles hold its data-centre and power platforms; Global Atlantic's
>   status.
> - For both: list the platforms each controls or co-controls that sign for batteries, MV gear,
>   generation or SSTs (§11.1 test 2), with the ownership share and a source for each. An investor that
>   buys nothing itself passes the test through a platform it controls, and fails it through one it
>   merely funds.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify against first-party sources
> (10-Ks, 10-Qs and results releases from each company's own IR site, counterparties' filings and
> releases, regulator records), record a premise verdict per clause, and rewrite the cells. Run these
> checks hardest:
> - BlackRock: GIP owned since 1 Oct 2024; Aligned bought via AIP with MGX (closed 21 Jul 2026, ~$40B EV,
>   6.4 GW); the AES take-private with EQT (signed 2 Mar 2026, pending) — check who the acquirers are;
>   ALLETE co-control with CPP (closed 15 Dec 2025); Eolian (GIP-backed); exclusive talks for STACK's
>   Asia-Pacific portfolio (~1.1 GW, reported 24 Sep — a report, not a deal); the NVIDIA
>   compute-financing MOU (10 Aug). And the flagged conflict: whether GIP still holds its CyrusOne stake.
> - KKR: CyrusOne 50% with GIP (2022); STT GDC 75% (closed 2 Sep 2026); Helix Digital Infrastructure,
>   more than $10B (Jun 2026, Vistra as preferred power supplier); EDF power solutions North America,
>   $4.2B, pending (5.6 GW including storage); 19.9% of the AEP Ohio and I&M transmission companies. The
>   cell says the ECP $50B partnership was "announced 30 Oct 2024, not 2026" — that correction is itself
>   unverified; read the release and record the date it gives.
> Record the §11.1 buying-authority verdict for each, through its controlled platforms.
>
> RECONCILIATION (step 7) — measured 2026-09-26 by word-bounded alias grep. BlackRock has 40 raw hits, of
> which 7 are known collisions, not inbound: "AIP" is also American Intelligence & Power (caterpillar,
> rehlko, nscale), Palantir's AIP (mccarthy) and AIP Management (rosendin); "GIP" is Infineon's Green
> Industrial Power segment (infineon); "HPS" is Prevalon's Hybrid Power Stabilizer (prevalon). That
> leaves about 33 for BlackRock; KKR has 19. No dossier carries an edge to either slug yet. Grep again
> with the full aka[] and read every hit. Add the reciprocal edge wherever a new dossier curates a
> counterparty, revising that dossier under the Archival Procedure and re-verifying any report pin on it.
> Check microsoft, nvidia and xai for a missing AIP edge — microsoft does not name AIP at all today.
> THIS IS THE HEAVY PART. If BlackRock's reconciliation outgrows the session, land both dossiers and
> guides, reconcile KKR in full and BlackRock's controlled or co-owned platforms first, and record every
> remaining slug by name as deferred in the ledger and the SESSION-CONTEXT hand-off. Defer rather than
> skim (profiler-app.md step 7, scope note).
>
> LESSONS FROM F-H1 AND F-N1 — apply them:
> - Every counterparty named in narrative prose rests on a source in sources[], ideally its own filing.
> - A tender, an MOU, "exclusive talks" or a signed-but-not-closed deal is not a completed transaction.
>   Type each on the record's own word and state the gap. An unattributed figure is stated as unverified.
> - Count inbound hits against the pre-revision copies (the archive), so the ledger's counts are exact.
> - sec.gov and data.sec.gov were blocked from the sandbox in both prior sessions. Run
>   check-source-reachability.py first; if EDGAR is blocked, read the filings from the companies' IR
>   sites and say so in the dossier.
> - Do not edit an existing concept in profiler-concepts.json. Where a registry definition is
>   domain-specific (revenue-share is written for battery optimisers), use a guide glossary term instead.
>   Check new terms and aliases for collisions before adding them.
> - Write each lesson plan and study guide skeleton-first, then Edit (Incremental Writing, item d).
> - Re-verify a report pin on a dossier you revise only if your change is edge-only. When an earlier
>   revision was substantive, leave the pin loud and write down why.
> - If an existing study guide contradicts a verified finding, correct it minimally and record it.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The two new members make landscape-capital-2026-09
> (built on "4 of 8 buy nothing") and scenario-capital-objection (reviewBy 10/14) stale, along with any
> other segment you add them to. Record that in the CHANGELOG entry and the SESSION-CONTEXT hand-off
> (§11.2, the landscape coupling); Classroom wave B re-authors them.
>
> FOR THE MEGMEET JOB: in the SESSION-CONTEXT hand-off, write one short paragraph on which platforms these
> two control that buy medium-voltage or DC power equipment (SSTs, 800 VDC, HVDC, batteries), and whether
> capital is a door an SST seller can use or only a way to find the buyers.
>
> VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
> build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new and revised dossier and guide renders under Playwright with zero page errors
> other than the sandbox's gis_load_failed (the guide overlay closes with its ✕ button, not Escape).
> CHANGELOG rotation only if non-exempt sections reach 100. Normal Pre-Commit and Pre-Push checklists;
> one commit; push on a claude/* branch."

Phase F session F-I1: dossiers, study guides and lesson plans for **BlackRock** (with GIP, AIP and HPS) and **KKR**, the two most-cited capital names the corpus did not cover, and a step-7 reconciliation that revised 28 inbound dossiers.

### Added

- **Two schema v7 dossiers** (`profileVersion` 1, intel-briefing style), each researched by two parallel subagents under the two-stage protocol. `check-source-reachability.py` ran before Stage 2 was planned: **PARTIAL** — `sec.gov` and `data.sec.gov` blocked, the IR sites and the other probed hosts reachable. Filings were read from the companies' IR sites and from EDGAR full-text search (`efts.sec.gov`), which answers.
  - **`blackrock.profile.json`** — `categories: ["investor"]`; 80 sources (54% first-party), 22 developments, 8 product lines, 4 technical specs, 23 relationships, 11 decision makers (all with photos), 4 policy entries.
    - **Identity — one slug.** The registrant is BlackRock, Inc. (NYSE: BLK; CIK 0002012383), the holding company formed on the GIP closing date; the former BlackRock Inc. is now BlackRock Finance, Inc. GIP is Global Infrastructure Management, LLC, a wholly owned subsidiary: it files no separate accounts, BlackRock reports one segment, and the European Commission names GIM 'ultimately controlled by BlackRock'. AIP is a capital partnership that BlackRock, GIP, Microsoft and MGX launched on 17 Sep 2024 (NVIDIA and xAI joined on 19 Mar 2025, the Kuwait Investment Authority in June 2025). On Aligned, the European Commission names GIM and MGX, not AIP, as the acquirers of joint control, so AIP gets no slug of its own. HPS (closed 1 Jul 2025) and Preqin (closed 3 Mar 2025) are wholly owned. All of it sits in `aka[]`.
    - **The read:** BlackRock signs for no equipment itself. Its GIP-branded funds own or co-own Aligned (joint control with MGX, closed 21 Jul 2026), CyrusOne (with KKR), Coravel (with ACS), ALLETE and Minnesota Power (with CPP Investments), Clearway Energy Group (with TotalEnergies), Eolian and Jupiter Power, and lead the AES take-private. **A directory of buyers, not a door.**
  - **`kkr.profile.json`** — `categories: ["investor"]`; 76 sources (49% first-party), 23 developments, 7 product lines, 4 technical specs, 14 relationships, 12 decision makers (all with photos), 3 policy entries.
    - **Identity:** KKR & Co. Inc. (NYSE: KKR; CIK 0001404912). Global Atlantic has been wholly owned since 2 Jan 2024 and is reported as the Insurance segment, so it sits in `aka[]` with Helix, STTGDC, ContourGlobal, Zenobē, Avantus and Encavis. KKR is a controlled company until a Sunset Date no later than 31 Dec 2026.
    - **The read:** KKR signs for no equipment itself either, but its platforms reach every layer this corpus sells into: STTGDC (75%, completed 2 Sep 2026), CyrusOne (co-owned with GIP), Helix Digital Infrastructure (launched 11 Jun 2026), ContourGlobal and Avantus.
- **Two schema v2 study guides**, 14 sections each, with flashcards and a self-test on concepts only: `blackrock.study.json` (plus local glossary terms 'buying-authority test' and 'HSR') and `kkr.study.json` (plus 'first-look right', 'preferred power partner', 'reserved matters' and 'strategic buyer').
- **Two lesson plans** under `repository-information/study-prep/<slug>/`, eight modules each, paced to the 2026-10-07 start. Both were written skeleton-first and filled in by Edit.
- **16 new concepts** in `profiler-concepts.json` (1,555 total), each checked for term and alias collisions against the registry:
  - Funds and markets: `index-fund`, `exchange-traded-fund`, `open-ended-fund`, `core-infrastructure`, `private-credit`, `annuity`.
  - Ownership disclosure: `schedule-13d`, `schedule-13g`.
  - Deals: `consortium`, `exclusive-talks`, `definitive-agreement`, `outside-date`, `deferred-consideration`.
  - Regulation and wires: `ferc-section-203`, `blanket-authorization`, `transmission-company`.
  - No existing entry was edited.
- **23 executive photos** in `live-site-pages/images/execs/` (`blackrock-*` 11, `kkr-*` 12), all company-published leadership-page images, converted to JPEG at 600 px or less.
- **28 archive files** (one per revised dossier, below), each with an `archive-index.json` entry.
- **10 accepted relationship pairs** in `profiler-relationships-accepted.json` (20 total): the other↔other edges between the new dossiers and `amperesand`, `aon`, `edgecore`, `excelsior-energy-capital`, `fluence`, `intersect-power`, `stack-infrastructure` and `talen-energy`, each with its reason.

### Changed

- **28 inbound dossiers revised under the Archival Procedure** (step 7: the reciprocal edge for each counterparty the new dossiers curate). Each gains the edge, plus a source in `sources[]` where the edge needed a new one; no other field changed except where noted:
  - **Both new slugs:** `cyrusone` v1→v2 (investors `kkr` and `blackrock`), `nvidia` v11→v12 (partners), `stack-infrastructure` v7→v8 (other, announced; adds Bloomberg's 24 Sep report of AIP and IFM exclusive talks), `blackstone` v1→v2, `brookfield` v2→v3 and `macquarie` v1→v2 (competitors; `macquarie` adds Infrastructure Investor's 2026 ranking), `fluence` v9→v10 (other).
  - **BlackRock only:** `aligned` v7→v8, `mgx` v3→v4, `microsoft` v5→v6 and `xai` v5→v6 (AIP partners — `microsoft` and `xai` named AIP nowhere before), `clearway-energy` v1→v2, `eolian` v6→v7, `jupiter-power` v6→v7, `aes-clean-energy` v2→v3 (investor, announced), `recurrent-energy` v1→v2, `meta` v9→v10 (partner, announced — the El Paso venture), `talen-energy` v2→v3, `excelsior-energy-capital` v1→v2, `edgecore` v1→v2, `intersect-power` v2→v3, `marsh-mclennan` v1→v2 (customer).
  - **KKR only:** `vistra` v3→v4 (partner — Helix), `aep` v1→v2 (investor — the 19.9% transmission stake), `compass-datacenters` v5→v6, `coolit` v1→v2 (investor, historical), `aon` v1→v2, `amperesand` v2→v3 (other — the STTGDC testbed).
  - **Three corrections, not just edges:**
    - `aes-clean-energy` — the Ohio commission approved the change of control on 17 Sep 2026; the summary, two strategy judgments and one policy entry said it was pending. The open question of which FERC dockets apply is closed (EC26-99, EC25-12-001, EC16-77-005). One development and two sources added.
    - `fluence` — one strategy judgment corrected to match (Ohio approved; FERC and New York outstanding), with the PUCO source.
    - `jupiter-power` — the ownership text said 'backed by GIP' with a quote that no Jupiter page carries; Jupiter's site and 2026 releases name no owner. Reworded, and the GIP link now rests on BlackRock's side of the record.
- **`mgx.study.json`** — one clause corrected: it said AIP 'owns Aligned'. It now says AIP is named as Aligned's buyer, while the EU merger clearance (Case M.12259) names GIP's manager and MGX as the joint controllers — the verified finding, and what the `macquarie` guide already said. `lastUpdated` 2026-09-26.
- **`profiler-companies.json`** — 188 → 190 entries. Taglines, `aka[]` (GIP, AIP, HPS, Preqin, iShares, Aladdin and the platform and legal names for BlackRock; Global Atlantic, Helix, STTGDC, ContourGlobal, Zenobē, Avantus, Encavis and the bid vehicles for KKR) and `domains[]` were populated **before** the step-7 grep. The sync pass reconciled `srcTotal`, `srcFirstPct` and `segments`.
- **`profiler-segments.json`** — `capital`: `blackrock` and `kkr` as incumbents, each with a basis line. The roster goes from eight to ten.
- **`profiler-graph.json`** — rebuilt: 1,656 edges (1,253 curated), 4,923 evidence records.
- **`profiler-refresh-calendar.json`** — both public (NYSE), `cadence: quarterly`: `blackrock` next results **2026-10-13** and `kkr` **2026-10-29**, both `confirmed: false` until each company announces its date. **`profiler-refresh-notes.json`** — a source and a `watch[]` list per slug.
- **`report-pins-verified.json`** — five edge-only revisions re-verified: `aep` (v1→v2), `meta` (v9→v10), `stack-infrastructure` (v7→v8) and `xai` (now at v6) on `named-project-bess-attach--opportunity--2026-09-08`, and `amperesand` (v2→v3) on `sst-hall-edge-block-rev2--competitive--2026-09-23`. Every cited source is unchanged in each.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — both F-I1 rows rewritten as verified cells, with a premise verdict per clause, the inbound count and the §11.1 buying-authority answer; Model **Opus 5.5 xhigh** kept; `Checked 2026-09-26, v07.66r`; Dossier v1; Guide v2. The verdicts:
  - **BlackRock** — eight clauses: 4 held (one as MOUs), 2 refined, 1 reported only, 1 flagged conflict settled.
    - Aligned via AIP — **held on the figures, refined on control**: EC Case M.12259 names GIM and MGX as acquirers of joint control; AIP is not a notifying party.
    - AES 'signed 2 Mar' — **refined**: signed 1 Mar by GIP and EQT Infrastructure VI; GIP-managed vehicles would hold 56.625%; FERC and New York pending, outside date 1 Jun 2027.
    - STACK Asia-Pacific talks — **reported only**: Bloomberg names AIP and IFM, not GIP; no party confirmed.
    - The CyrusOne conflict — **settled: GIP still co-owns it**; no first-party source states 50:50.
  - **KKR** — six clauses: 3 held, 3 refined. CyrusOne 50% **refined** (co-ownership held, the split unstated); Helix **refined** (a company, not a fund; more than USD 10bn of *commitments*); EDF power solutions **refined on scope** (5.6 GW of 'net renewable capacity', storage not stated).
- **`phase-f-action-plan.md`** — the status line records F-I1 as landed and the capital modules as stale.
- **README.md** — tree entries for the two profile/study pairs, the two study-prep directories and the 28 archive files, plus the timestamp and repo version.
- **`SESSION-CONTEXT.md`** — a new Latest Session (the F-I1 hand-off, with the Megmeet paragraph). The F-N1 entry (v07.64r–v07.65r) moved to Previous, and the F-H1 entry (v07.62r–v07.63r) dropped under the two-session cap.

### Notes

- **Step-7 reconciliation**, grepped with the full `aka[]` against the pre-revision copies. Nothing was deferred.
  - **BlackRock: 42 raw hits.**
    - 9 are collisions: 'AIP' as American Intelligence & Power (`caterpillar`, `rehlko`, `nscale`), Palantir's AIP (`mccarthy`) and AIP Management (`rosendin`); 'GIP' as Infineon's segment; 'HPS' as Prevalon's product; and Hut 8's generic 'AI Infrastructure Partnership' headline (`anthropic`, `hut-8`), two the brief did not list.
    - 4 are career-only (`aon`, `aypa-power`, `gridstor`, `iren`).
    - 29 were read: 20 revised, 9 unchanged (`canadian-solar`, `digital-realty`, `dnv`, `galaxy-digital`, `google`, `grid-united`, `hunt-energy-network`, `rwe-clean-energy`, `trina-storage`). `microsoft` and `xai` were revised as well, for the AIP edge they lacked.
  - **KKR: 26 raw hits** (the platform names added 7 to the brief's 19). 4 are career-only (`aypa-power`, `dg-matrix`, `fermi-america`, `strata-clean-energy`). 22 were read: 13 revised, 9 unchanged (`arevon`, `bytedance`, `digital-realty`, `dnv`, `firmus`, `mgx`, `oncor`, `recurrent-energy`, `terra-gen`).
  - No inbound claim contradicted KKR's dossier. One figure is left unreconciled and stated on both sides: Bosque County, where CyrusOne says USD 1.2bn and KKR about USD 4bn.
- **§11.1 buying authority:**
  - **BlackRock, Inc. signs for nothing.** It passes only through the platforms its funds control or co-control (Aligned, CyrusOne, Coravel, ALLETE, Clearway Energy Group, Eolian, Jupiter; AES on closing). It fails through Recurrent (a minority preferred stake), EdgeCore and Intersect (lender), its index stakes, the NVIDIA MOUs and the STACK talks.
  - **KKR** passes the same way, through STTGDC, CyrusOne, ContourGlobal, Avantus and, once closed, EDF power solutions North America. ContourGlobal signed for 3 GWh of CATL batteries (10 Aug 2026) and Avantus bought an 800 MWh Fluence system (July 2026).
  - **The one DC-power programme on record** at either firm is STTGDC's HVDC testbed with LITEON and Amperesand, whose SST deployment STTGDC names as its plan for future Singapore sites. No SST, 800 VDC or HVDC purchase is on record at any BlackRock platform.
- **SEC access, a finding for the probe, not a block:** `www.sec.gov` and `data.sec.gov` return 403 to a User-Agent whose contact address sits on a `*.github.io` domain — the one `check-source-reachability.py` sends — and 200 to the same request with another contact domain. The 'network-keyed EDGAR block' recorded since v04.91r is a User-Agent rejection. The probe was **not** changed: SEC's fair-access policy wants a real, monitored contact address, which only the developer can supply.
- **Report pins left loud, with the reason:**
  - `fluence` v10 on `grid-scale-bess--competitive--2026-09-08` — this revision corrected a strategy judgment (the Ohio approval), which is substantive, so a pin note cannot vouch for it.
  - `jupiter-power` v7 on `named-project-bess-attach--opportunity--2026-09-08` — the ownership text was corrected, also substantive.
  - `jinko` and `oracle` — pre-existing.
- **Existing study guides checked for contradictions:** twelve guides name BlackRock, GIP, AIP, KKR or a KKR platform. Eleven agree with the new dossiers; `cyrusone`'s caution that BlackRock 'is not itself a CyrusOne owner' in the 'GIP-owned' sense matches the funds-managed wording of the new edge. One was corrected (below).
- **Classroom lessons now stale, by design — `Classroom.gs` was not edited:**
  - `landscape-capital-2026-09` was built on '4 of 8 buy nothing'. The `capital` roster is now 10, and both new incumbents buy nothing themselves and pass §11.1 only through platforms they control.
  - `scenario-capital-objection` (reviewBy 10/14) goes stale with it.
  - Classroom wave B re-authors both, after F-I2 adds SoftBank and Blue Owl.
  - `build-classroom-segments.py --check` now shows **17 due**: 15 with section changes (`capital` differs in eight sections) and 2 pin-only (`clean-firm-and-nuclear`, `storage-developers-and-ipps`).
- **Checkers:**
  - `sync-profiler-registry.py --check` — clean (190 in bijection, calendar included).
  - `check-profiler-study.py` — 0 errors, 0 warnings (190 guides, 1,555 concepts).
  - `check-profiler-relationships.py` — 0 findings (20 accepted pairs).
  - `check-profiler-crossrefs.py` — 0 candidates across 529 pairs.
  - `check-readme-tree.py` — 0 findings.
  - `check-profiler-reports.py` — 0 errors and four warnings, read and left loud as above.
- **Playwright:** 30 dossiers (the two new ones and the 28 revised) render on `Profiler.html` with every tab, and the `blackrock`, `kkr` and corrected `mgx` study guides open and close with the ✕ button. **Zero page errors.** The only console lines are resource failures on `script.google.com`, the GAS backend the sandbox cannot reach, the same class as `gis_load_failed`. The harness hides the auth wall and sets the admin UI role in `localStorage` so the tabs and the Study guide button are reachable.
  - **No literal `{{` or `**` in the new guides**, and none in any tab of the new dossiers except the Relationships tab's inbound evidence.
  - **Inbound evidence shows raw `**`.** The 'Mentioned in X's dossier' panel inserts each excerpt as a text node, so the house-style bold labels ('**BOTTOM LINE UP FRONT:**', '**Collection gaps:**') print literally. Rendered against a HEAD checkout, the only differences are on the Relationships tab of seven revised dossiers (`mgx` +4, `aligned` +2, `clearway-energy` +2, `cyrusone` +10, `eolian` +4, `jupiter-power` +4, `meta` +2), all excerpts of the new BlackRock and KKR text. The graph holds 390 `**` against 336 at HEAD. This renderer gap is pre-existing (NVIDIA shows the same). The house style was not changed; the fix belongs in `ovRelEvidList` in `Profiler.html`, a page change outside this session.
  - `Profiler.html` is unchanged (data-only), so there is no page version bump.
- **Not run here, as instructed:** F-I2 (SoftBank, SB Energy, Blue Owl — it waits on the DigitalBridge close), the 10/1 neoclouds pass and `profiler Habitat Energy`.
- **No rotation:** 92 sections, under the trigger.

## [v07.65r] — 2026-09-26 06:03:22 AM EST

> **Prompt:** "give me the prompt to paste into a new Opus 5.5 xhigh session to run F-I1, then remember session"

The follow-up to F-N1: the F-I1 paste-in prompt, with reconciliation counts measured on the current corpus, and the session saved.

### Added

- **`phase-f-action-plan.md` §6 — the F-I1 paste-in prompt** (BlackRock with GIP, AIP and HPS; KKR) for Opus 5.5 **xhigh**. It follows §5's F-N1 prompt:
  - **Identity:** it asks whether GIP gets its own slug or sits in BlackRock's `aka[]`, and asks for the §11.1 verdict **through each firm's controlled platforms**.
  - **Hardest checks:** it names the ledger clauses to verify first, including the flagged CyrusOne conflict. It notes that the ledger's own "ECP announced 30 Oct 2024" correction is unverified.
  - **Reconciliation counts, measured on 2026-09-26** by a word-bounded alias grep. BlackRock has 40 raw hits, 7 of them known collisions:
    - "AIP" is also American Intelligence & Power (`caterpillar`, `rehlko`, `nscale`), Palantir's AIP (`mccarthy`) and AIP Management (`rosendin`).
    - "GIP" is Infineon's Green Industrial Power segment.
    - "HPS" is Prevalon's Hybrid Power Stabilizer.
    - That leaves about 33 for BlackRock; KKR has 19. No dossier has an edge to either slug yet, and `microsoft` does not name AIP at all.
  - **A defer-not-skim rule:** if BlackRock's step 7 outgrows the session, KKR and BlackRock's controlled platforms come first, and every remaining slug is recorded by name.
  - **F-N1's lessons:**
    - Count inbound hits against the archive copies.
    - Check for the EDGAR block and read filings from IR sites.
    - Never edit an existing concept.
    - Re-verify a pin only on an edge-only change; leave a substantive one loud, with the reason written.
    - Close the guide overlay with its ✕ button under Playwright.
  - **A Megmeet paragraph ask:** which controlled platforms buy MV or DC equipment, and whether capital is a door or only a directory.

### Changed

- **`phase-f-action-plan.md`** — the status line records §6. §3 row 4 gives the measured count and points to §6.
- **`SESSION-CONTEXT.md`** — the Latest Session extended in place for v07.65r, as F-H1's save did, since it was already this session's hand-off. The recommendation now points to the §6 prompt.
- **README.md** — the action plan's tree description names all three prompts; timestamp and repo version.

### Notes

- **No dossier, guide, page, GAS script or Classroom content changed.** No rotation: 91 sections.

## [v07.64r] — 2026-09-26 05:27:31 AM EST

> **Prompt:** "Picking up from my last session, run Phase F session F-N1 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: Firmus Technologies, HUMAIN and
> G42 (Khazna) — the neoclouds and AI-capacity builders that sign for their own campuses. This session runs
> on Opus 5.5 at xhigh (the action plan suggested high; I am choosing xhigh). Write "Opus 5.5 xhigh" into
> your §11.3 Model cells.
>
> WHY NOW: §11.2 wants F-N1 landed before the 10/1 neoclouds pass, so landscape-neoclouds-2026-09 is
> re-authored once, in Classroom wave A (Fri 10/2 – Tue 10/6). Do NOT run the neoclouds pass or
> `profiler Habitat Energy` here — both wait on filings due 9/30 — and do not revise fluidstack.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/phase-f-action-plan.md;
> PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the three F-N1 rows of §11.3 are yours; §11.1's
> buying-authority test applies); .claude/rules/profiler-app.md (Profiler Command including step 1a
> identity and step 7 reconciliation, Profiler Prep Command, Scheduled Refreshes);
> repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments registry, Refresh calendar);
> repository-information/PROFILER-STYLES.md (active style). Read the coreweave, nebius, crusoe, fluidstack
> and nscale dossiers and study guides as the house pattern for a neocloud, and the mgx, xai, amd,
> terawulf, openai and oracle dossiers — they already name HUMAIN, G42, Khazna, Core42 or Stargate UAE.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Proposed slugs: firmus, humain, g42. Category hypotheses:
> firmus ["neocloud"]; humain ["neocloud"] or ["hyperscaler"]; g42 ["neocloud"], ["hyperscaler"] or
> ["developer"] — decide each on the record and say why. Populate aka[] BEFORE the step-7 grep, including
> brand and subsidiary names (Firmus: Sustainable Metal Cloud if it is Firmus's, HyperCube; G42: Group 42,
> Khazna, Core42, Stargate UAE; HUMAIN: its Arabic name if it publishes one). Assign segments in
> live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: neoclouds ·
> challenger for all three; aidc-developers-and-landlords · challenger for Firmus and for G42 if Khazna
> owns and builds its campuses). Then the registry sync, the graph build, a calendar row per company under
> the Refresh calendar rules (Firmus: public if its ASX listing has happened by your run date — the ASX is
> reachable from the sandbox — otherwise the private rule; HUMAIN and G42 private), README tree entries,
> and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — establish each of these, do not assume it:
> - Firmus: the operating and listing entity, how Sustainable Metal Cloud relates to it, which company owns
>   and builds the Australian and Malaysian campuses, and the status of the Benmax acquisition.
> - HUMAIN: its ownership (PIF), and which entity signs for data-centre power equipment — HUMAIN itself, a
>   joint venture, or a design-build contractor it appoints. Decide neocloud or hyperscaler.
> - G42: one slug for the group, or a separate one for Khazna? Decide under Naming and renames and say
>   why. Establish Khazna's and Core42's ownership, Microsoft's stake in G42, and who signs for Stargate
>   UAE's power equipment.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify against first-party sources
> (company releases, the ASX, government and regulator records, the counterparties' own filings), record a
> premise verdict per clause, and rewrite the cells. Run these checks hardest:
> - Firmus: >900 MW contracted (8 Sep 2026) with OpenAI as the Malaysian anchor; the Benmax purchase
>   (A$300M); the Gunvor 600 MW supply deal tied to 1.5 GWh of storage; the ASX IPO timing; ClusterMAX 3.0
>   Silver.
> - HUMAIN: 1.9 GW by 2030 and Al Sa'ad 1 GW phase 1 by 2027; xAI 500 MW+ and Together AI 250 MW
>   (31 Aug 2026); the design-build awards to MIS; ClusterMAX "Unavailable".
> - G42: Khazna building Stargate UAE (1 GW inside a 5 GW campus) with long-lead equipment for the first
>   200 MW procured — who procured it, and from whom; Core42 as TeraWulf's 60 MW tenant; the UAE's move to
>   Country Group A:5 (Jul 2026) and what it changed.
> For each company, record the §11.1 buying-authority verdict: does it, or a platform it controls, sign for
> batteries, MV gear, generation or SSTs?
>
> RECONCILIATION (step 7) — expected inbound: Firmus 0; HUMAIN 2 (amd, xai); G42 4 (mgx, terawulf, and
> openai and oracle through "Stargate UAE"). Known alias collisions, not inbound: hyperstrong's "HyperCube"
> is HyperStrong's own product line, and dg-matrix's "Inception" is NVIDIA's startup programme. Grep again
> with the full aka[]. Check every inbound dossier for the reciprocal edge — in F-H1 the delta-electronics
> dossier did not name a customer it had launched a product with — and where one is missing, revise that
> dossier under the Archival Procedure and re-verify any report pins on it. Check microsoft and nvidia for
> a missing G42 or HUMAIN edge too.
>
> LESSONS FROM F-H1 — apply them:
> - Every supplier, customer or partner named in narrative prose rests on a source in sources[], ideally
>   the counterparty's own filing. F-H1 had to back-source two such claims before commit.
> - A tender is not an award. An unattributed figure is stated as unverified, never as fact.
> - Write each lesson plan skeleton-first, then Edit (.claude/rules/behavioral-rules.md, Incremental
>   Writing, item d).
> - If an existing study guide contradicts a verified finding, correct it minimally and record it.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The new members make landscape-neoclouds-2026-09
> and the scenario-neoclouds-discovery rehearsal stale — and landscape-aidc-developers-and-landlords-2026-09
> further, if Firmus or G42 join that segment. Record that in the CHANGELOG entry and the SESSION-CONTEXT
> hand-off (§11.2, the landscape coupling); Classroom wave A re-authors them.
>
> FOR THE MEGMEET JOB: in the SESSION-CONTEXT hand-off, write one short paragraph on whether any of the
> three signs for medium-voltage or DC power equipment (SSTs, 800 VDC, HVDC), and what that means for an
> SST seller.
>
> VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
> build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new dossier and guide renders under Playwright with zero page errors other than the
> sandbox's gis_load_failed. CHANGELOG rotation only if non-exempt sections reach 100. Normal Pre-Commit
> and Pre-Push checklists; one commit; push on a claude/* branch."

**Phase F, session F-N1 — Firmus Technologies, HUMAIN and G42 (Khazna)** join the Profiler corpus: the neoclouds and AI-capacity builders that sign for their own campuses. There are three dossiers, each with a v2 study guide and a lesson plan, plus the reciprocal edges on the eight inbound dossiers that name them. Run on Opus 5.5 at xhigh.

### Added

- **Three schema v7 dossiers** (`profileVersion` 1, intel-briefing style), each researched by two parallel subagents under the two-stage protocol. `check-source-reachability.py` ran before Stage 2 was planned: **PARTIAL** — `sec.gov` and `data.sec.gov` are blocked; the ASX and the other probed hosts are reachable.
  - **`firmus.profile.json`** — `categories: ["neocloud"]`; 67 sources (58% first-party), 24 developments, 5 products, 7 relationships, 13 decision makers (5 with photos), 5 policy entries.
    - **Identity:** Firmus Grid Limited (ACN 638 040 534), trading as Firmus Technologies. It is **unlisted** as of 26 Sep 2026: no ASX record and no lodged prospectus. Sustainable Metal Cloud is its legacy cloud brand (smc.co is held by Firmus Metal International).
    - **Ownership of the campuses:** the South Australian campuses are 'owned and operated by Firmus'. Melbourne sits inside a CDC Data Centres facility.
    - **The power train:** Maas Group's JLE is 'the exclusive supplier of power train units for Firmus' Australian pipeline'.
  - **`humain.profile.json`** — `categories: ["neocloud"]`, decided against hyperscaler; 53 sources (28% first-party), 30 developments, 5 products, 6 relationships, 9 decision makers, 4 policy entries.
    - **Identity:** Future Artificial Intelligence Co. (شركة المستقبل للذكاء الاصطناعي), trading as HUMAIN (هيوماين). PIF-owned; Aramco's minority stake is EC-cleared but not completed.
    - **Why a neocloud:** its own cloud launched at 1.1 MW, and it builds capacity and lets it to xAI, Together AI, Adobe, Luma and an AWS 'AI Zone'.
  - **`g42.profile.json`** — `categories: ["developer", "neocloud"]`; 57 sources (56% first-party), 25 developments, 5 products, 8 relationships, 12 decision makers (8 with photos), 4 policy entries.
    - **Identity:** Group 42 Holding Ltd, kept as **one group slug** under Naming and renames. G42 controls Khazna (majority; MGX and Silver Lake are minorities), and the BIS approval and Stargate UAE sit at group level.
    - **`aka[]`:** Khazna, Core42, Stargate UAE, Presight, Space42, M42, Inception, Jais, Condor Galaxy and the legal entities.
- **Three schema v2 study guides**, each with flashcards and a self-test on concepts only:
  - `firmus.study.json` (15 sections);
  - `humain.study.json` (15 sections, plus one doc-glossary term, 'revenue-sharing arrangement', because the registry's `revenue-share` is BESS-optimiser-specific);
  - `g42.study.json` (16 sections).
- **Three lesson plans** under `repository-information/study-prep/<slug>/` — six, six and eight modules, paced to the 2026-10-07 start. Each was written skeleton-first and then filled in by Edit (the Incremental Writing gate, item d).
- **19 new concepts** in `profiler-concepts.json` (1,539 total), each checked for term and alias collisions against the registry (`EAR`, `Country Group A:5`, `prefabricated` and `standby generator` were already taken):
  - AI factory and compute: `ai-factory`, `nvl72`, `clustermax`, `gpu-as-a-service`, `immersion-cooling`.
  - Power chain: `power-train`, `bulk-supply-point`, `mva`, `maximum-demand`, `backup-generator`, `carbon-capture`, `energy-retailer`.
  - Contracts: `exclusive-supply-agreement`, `work-order`, `early-contractor-involvement`.
  - Export rules and security: `country-group`, `approved-recipient`, `end-use-controls`, `site-hardening`.
  - No existing entry was edited.
- **13 executive photos** in `live-site-pages/images/execs/`, all company-published: `firmus-*` (5) and `g42-*` (8, from G42's and Khazna's leadership pages; the webp originals were converted to jpg).
- **Eight archive files**: `amd.profile.v1`, `mgx.profile.v2`, `microsoft.profile.v4`, `nvidia.profile.v10`, `openai.profile.v5`, `oracle.profile.v5`, `terawulf.profile.v7`, `xai.profile.v4`, each with an `archive-index.json` entry.

### Changed

- **Eight inbound dossiers revised under the Archival Procedure** (step 7: the reciprocal edge for each counterparty the new dossiers name). Each gains the edge plus its source in `sources[]`; no other field changed except where noted:
  - `amd` v1→v2 — customers `humain` (the AMD–Cisco–HUMAIN joint venture, MI355X live 31 Aug 2026) and `g42`.
  - `xai` v4→v5 — supplier `humain` (announced; the '500 MW+' framework). One development read changed: 'trade reporting also cites a $3B HUMAIN investment' now records **HUMAIN's own confirmation** (18 Feb 2026) — an open question closed.
  - `mgx` v2→v3 — portfolio `g42` (the Khazna minority alongside Silver Lake, March 2025).
  - `terawulf` v7→v8 — customer `g42` (Core42's 60 MW critical IT at Lake Mariner, G42 parent guarantee).
  - `openai` v5→v6 — suppliers `g42` (Stargate UAE) and `firmus` (announced; the two Malaysian sites).
  - `oracle` v5→v6 — partner `g42` (Stargate UAE operator).
  - `microsoft` v4→v5 — portfolio `g42` (US$1.5B, April 2024) and partner `humain`.
  - `nvidia` v10→v11 — customers `humain` and `g42`, portfolio `firmus`.
- **`profiler-companies.json`** — 185 → 188 entries. Taglines, `aka[]` (brand, subsidiary, legal and Arabic names) and `domains[]` were populated **before** the step-7 grep. The sync pass reconciled `srcTotal`, `srcFirstPct` and `segments`.
- **`profiler-segments.json`**, each with a basis line:
  - `neoclouds`: all three as challengers — the roster goes from seven to ten.
  - `aidc-developers-and-landlords`: `g42` challenger (Khazna); `firmus` and `humain` **adjacent**. Both build for their own clouds and lease no shells; Firmus's hypothesis had been challenger.
- **`profiler-graph.json`** — rebuilt: 1,610 edges (1,217 curated).
- **`profiler-refresh-calendar.json`** — all three are private, `cadence: quarterly`, `tier: core`. Firmus had not listed by the run date; its reported ASX listing is 22 Oct 2026. **`profiler-refresh-notes.json`** — a source and a `watch[]` list per slug, appended without reordering the file.
- **`report-pins-verified.json`** — `openai` (v5→v6) and `xai` (v4→v5) re-verified on `named-project-bess-attach--opportunity--2026-09-08`: every cited source is unchanged, and the report neither cites the changed xAI development nor mentions HUMAIN.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the three F-N1 rows rewritten as verified cells, with a premise verdict per clause and the §11.1 buying-authority answer; Model **Opus 5.5 xhigh**; `Checked 2026-09-26, v07.64r`; Dossier v1; Guide v2. The verdicts run hardest:
  - **Firmus:**
    - More than 900 MW contracted — **held, as a sales figure**: 'across all customers', against two operating sites.
    - OpenAI as the Malaysian anchor — **held**, for two sites not yet built.
    - 'Owns its Australian campuses' — **held in part**.
    - 'Builds the electrical content' — **refined**: Benmax fabricates the mechanical and cooling modules; the electrical Power Cube is made exclusively by JLE (A$200M and A$855M work orders).
    - Benmax A$300M — **held, not closed** by 26 Sep.
    - Gunvor 600 MW tied to 1.5 GWh — **held**, exactly the energy policy's 2.5 MWh per MW.
    - IPO 22 Oct — **as reported** (a Reuters term sheet; a draft prospectus shows a '$77 million' pro-forma half-year loss).
    - ClusterMAX 3.0 Silver — **held**.
  - **HUMAIN:**
    - 1.9 GW by 2030 — **a CEO target**.
    - Al-Saad 1 GW phase 1 by 2027 — **unreconciled** against the NYT's 250 MW by the start of 2027.
    - xAI 500 MW+ — **a framework**.
    - Together AI 250 MW (31 Aug) — **held**.
    - The MIS design-build — **superseded** by a 250 MW EPC of ~SAR 8.76B, 'carried out under work orders issued by HUMAIN' (20 Sep 2026).
    - ClusterMAX 'Unavailable' — **held**.
  - **G42:**
    - Khazna builds Stargate UAE — **held**.
    - 'Long-lead equipment for the first 200 MW procured' — **held, with a precision**: the October 2025 update says the project 'has completed procurement of all long-lead equipment', naming no supplier, category or signing entity.
    - Core42 as a 60 MW TeraWulf tenant — **held**.
    - The UAE's move to A:5 — **held, with the rider the hypothesis missed**: G42 and Core42 are named approved recipients in Supplement No. 8, an approval that 'shall automatically expire on April 6, 2027' unless they 'become U.S. companies'.
- **`phase-f-action-plan.md`** — the status line records F-N1 as landed. Classroom wave A (row 7) now names F-N1 among the drift it absorbs.
- **README.md** — tree entries for the three profile/study pairs, the three study-prep directories and the eight archive files, plus the timestamp and repo version.
- **`SESSION-CONTEXT.md`** — a new Latest Session (the F-N1 hand-off, with the Megmeet paragraph). The F-H1 entry moved to Previous, and the older v07.60r–v07.61r entry dropped under the two-session cap.

### Notes

- **Step-7 reconciliation**, grepped with the full `aka[]` against the pre-revision dossiers:
  - **Firmus 0.** The only hit was `hyperstrong`'s own 'HyperCube' product line, a collision.
  - **HUMAIN 2** (`amd`, `xai`).
  - **G42 4** (`mgx`, `terawulf`, and `openai` and `oracle` via 'Stargate UAE'). `dg-matrix`'s 'Inception' is NVIDIA's startup programme, a collision.
  - **No inbound claim contradicted the new dossiers**; one open question (xAI's HUMAIN investment) was closed.
  - `microsoft` and `nvidia` named neither company before this session and now carry the edges.
  - The new dossiers' edges to `eaton`, `supermicro`, `blackstone`, `coreweave`, `iren` and `amazon` stay one-way and show as inbound evidence in the graph.
- **§11.1 buying authority:**
  - **Firmus** is the buyer of record for its own chain: it pays for and owns its connection substations, applies for its backup generation, and runs UPS and batteries on Eaton's EnergyAware platform through Synert. In Australia, though, the power train is exclusive to JLE.
  - **HUMAIN** is owner and grid counterparty (the National Grid SA agreement, 2 Sep 2026). On the MIS build the EPC contractor buys under HUMAIN-approved designs, and on partner campuses the partner buys. The Al-Saad 380/132/33 kV package (a 2,000 MVA bulk supply point) was tendered on early contractor involvement, and the reported selection is 'not a definitive construction award'.
  - **G42:** Khazna buys and Core42 leases. The Khazna–Siemens memorandum (15 Sep 2026) to 'continue to progress next-generation 800 VDC power architectures' is a memorandum, not an award.
  - **None of the three has signed for an SST, 800 VDC or HVDC equipment on the record.**
- **Existing study guides checked for contradictions:** only `mgx.study.json` names G42, Khazna or Stargate UAE, and it agrees with the new dossiers. No guide was corrected.
- **Classroom lessons now stale, by design — `Classroom.gs` was not edited:**
  - `landscape-neoclouds-2026-09`: seven members become ten.
  - `scenario-neoclouds-discovery` goes stale with it.
  - `landscape-aidc-developers-and-landlords-2026-09`, further: +`g42` as a challenger, +`firmus` and +`humain` as adjacent, on top of the F-H1 drift. Its `scenario-aidc-developers-and-landlords-*` rehearsals were already stale.
  - Classroom wave A (Fri 10/2 – Tue 10/6) re-authors them.
  - `build-classroom-segments.py --check` now shows **14 due**: 12 with section changes (`neoclouds` differs in eight sections) and 2 pin-only (`capital`, from `mgx` v3; `insurance-and-risk-transfer`).
- **Checkers:**
  - `sync-profiler-registry.py --check` — clean (188 in bijection).
  - `check-profiler-study.py` — 0 errors, 0 warnings (188 guides, 1,539 concepts).
  - `check-profiler-relationships.py` — 0 findings.
  - `check-profiler-crossrefs.py` — 0 candidates (32 over-cap scopes not examined, as before).
  - `check-readme-tree.py` — 0 findings.
  - `check-profiler-reports.py` — 0 errors and two warnings, read and left loud:
    - `jinko` — pre-existing.
    - `oracle` — now v6 against a v4 pin. The v4→v5 step was an earlier session's substantive refresh (summary, developments, strategy, financials), which a pin note cannot vouch for; this session's v6 only added the G42 edge.
- **Playwright:** 11 dossiers (the three new ones and the eight revised) render on `Profiler.html`, with every tab and the study guide, and zero real page errors. The only error is the auth wall's `gis_load_failed`, the Google Identity script the sandbox cannot fetch.
  - No literal `{{` or `**` appears in any new dossier or guide.
  - NVIDIA's Relationships tab shows four literal `**`. They are pre-existing: other dossiers' inbound curated contexts, with the graph's count unchanged at 127.
  - `Profiler.html` is unchanged (data-only), so there is no page version bump.
- **Not run here, as instructed:** the 10/1 neoclouds pass, `profiler Habitat Energy`, and any `fluidstack` revision.
- **No rotation:** 90 sections, under the trigger.

## [v07.63r] — 2026-09-26 03:20:08 AM EST

> **Prompt:** "I approve of your proposed fix for the write-size slip. Output the three new guides as downloadable PDFs. Give me a prompt to paste into a new Opus 5.5 Xhigh session for F-N1, then remember session."

The follow-up to F-H1: the approved rule fix for the write-size slip, the three new study guides as PDFs, the F-N1 paste-in prompt, and the session saved.

### Added

- **`phase-f-action-plan.md` §5 — the F-N1 paste-in prompt** (Firmus Technologies, HUMAIN, G42/Khazna) for Opus 5.5 **xhigh**; §3 had suggested high, and the developer chose xhigh. It follows §4's F-H1 prompt and carries F-H1's lessons:
  - Every counterparty named in prose rests on a source, ideally its own filing.
  - Every inbound dossier is checked for a missing reciprocal edge, and revised under the Archival Procedure where one is missing.
  - Lesson plans are written skeleton-first.
  - It names the expected inbound set (Firmus 0; HUMAIN 2 — `amd`, `xai`; G42 4 — `mgx`, `terawulf`, and `openai` and `oracle` via Stargate UAE) and two known alias collisions (`hyperstrong`'s HyperCube product line; `dg-matrix`'s NVIDIA Inception badge).
  - It asks for the §11.1 buying-authority verdict per company and a Megmeet paragraph in the hand-off.
  - A status line under the plan's title records that F-H1 has landed.

### Changed

- **`.claude/rules/behavioral-rules.md` — Incremental Writing gate, Step 1**: a new item (d) adds `study-prep/<slug>/<slug>-lesson-plan.md` (typically 60–100 lines) to the content types that must be treated as over 50 lines and written skeleton-first. This was the structural fix proposed in v07.62r, after a 75-line lesson plan was written in one call, and the developer approved it. A scan found no conflicting text.
- **`SESSION-CONTEXT.md`** — the Latest Session extended in place for v07.63r. It was already this session's F-H1 hand-off, so moving it down would have pushed out the v07.60r–v07.61r entry to make room for a duplicate. The recommendation now points at §5.
- **README.md** — the action plan's tree description names both prompts; timestamp and repo version.

### Notes

- **The PDFs are deliverables, not repo files.** `ByteDance-`, `Alibaba-Cloud-` and `Chindata-Technology-Study-Guide.pdf` (13, 15 and 11 pages) were rendered with Chromium from each `<slug>.study.json` and sent to the developer:
  - Every section kind is laid out for print.
  - The tooltip terms are underlined and defined in a closing glossary (17, 25 and 19 terms).
  - The self-test answers moved to an answer key.
  - The ByteDance timeline's intro is re-worded for its table form.
  - Checks: a text extraction found no literal `{{` or `**`, the Chinese glyphs rendered, and every page was inspected.
- **No dossier, guide, page, GAS script or Classroom content changed.** No rotation: 89 sections.

## [v07.62r] — 2026-09-26 02:50:43 AM EST

> **Prompt:** "Picking up from my last session, run Phase F session F-H1 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: ByteDance (Volcano Engine), Alibaba
> Cloud and Chindata — the China buyer side the megmeet dossier lacks. This session runs on Opus 5.5 at
> xhigh: on 2026-09-26 I decided Phase F runs on Opus 5.5, and repository-information/phase-f-action-plan.md
> supersedes the Model column of §11.2. Write "Opus 5.5 xhigh" into your §11.3 Model cells.
>
> WHY NOW: I start at Megmeet (Senior Sales Manager — SST Solutions) on Wednesday 2026-10-07. Land this
> before then, with time for me to read it.
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/phase-f-action-plan.md;
> PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the three F-H1 rows of §11.3 are yours);
> .claude/rules/profiler-app.md (Profiler Command including step 1a identity and step 7 reconciliation,
> Profiler Prep Command, Scheduled Refreshes); repository-information/PROFILER-SCHEMA.md (Naming and
> renames, Segments registry, Refresh calendar); repository-information/PROFILER-STYLES.md (active style).
> Read the megmeet, zhonhen, delta-electronics and sinexcel dossiers and study guides — the supply side
> these three buyers face — and the parts of
> repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html that name Chinese buyers.
> Those are context only: cite primary sources, never the briefing.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Category hypotheses: bytedance ["hyperscaler"],
> alibaba-cloud ["hyperscaler"], chindata ["developer"]. Populate aka[] BEFORE the step-7 grep, including
> the Chinese names: ByteDance / Volcano Engine / 字节跳动 / 火山引擎; Alibaba Cloud / Alibaba Cloud
> Intelligence / Aliyun / 阿里云; Chindata / 秦淮数据 / Bridge Data Centres. Assign segments in
> live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis:
> hyperscalers-and-ai-labs · challenger for the two hyperscalers; aidc-developers-and-landlords ·
> challenger for Chindata). Then the registry sync, the graph build, a calendar row per company under the
> Refresh calendar rules (Alibaba reports publicly — research its next results date; follow the private
> rule for the others), README tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — establish each of these, do not assume it:
> - Alibaba Cloud: one slug for the cloud unit, or for Alibaba Group? Decide under Naming and renames and
>   say why.
> - ByteDance vs Volcano Engine: which entity buys data-centre power equipment.
> - Chindata: current ownership (Bain Capital's 2023 take-private and anything after it), the reported
>   Bridge Data Centres sale process (Bloomberg, 29 Jul 2026), and which entity operates Huailai.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify against first-party sources
> (Alibaba's results filings, company releases, Chinese exchange and tender records where reachable),
> record a premise verdict per clause, and rewrite the cells. Run these checks hardest:
> - ByteDance's 2026 capex: three reports differ about 2x (RMB 160B / more than RMB 200B / up to $70B).
>   State the conflict unless a primary source resolves it.
> - Alibaba's Panama (10 kV to 240 VDC) is a line-frequency transformer-rectifier, not an SST. The zhonhen
>   dossier already draws this line; keep it. Zhonhen's "~70% share" is secondary-source only.
> - Chindata at Huailai (2 Jul 2026, for Meituan; HEC and Delta; 10 kV to 800 VDC): verify that it is a
>   solid-state transformer and who supplied what.
> - ByteDance's early-2026 HVDC tender and its 800 V pilot: the named suppliers (Kehua, Zhonhen — Kehua has
>   no dossier) and whether any 800 V award is public.
>
> RECONCILIATION (step 7) — expected inbound: ByteDance 3 (mgx, narada, zhonhen), Alibaba 4 (narada,
> nscale, sungrow, zhonhen), Chindata 3 (amperesand, dg-matrix, stack-infrastructure). Grep again with the
> full aka[], including the Chinese names. Check that megmeet, zhonhen, delta-electronics and sinexcel
> agree with the new dossiers on every supplier and customer edge, and record the reciprocal types.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The three new members make
> landscape-hyperscalers-and-ai-labs-2026-09 and landscape-aidc-developers-and-landlords-2026-09 stale,
> and the scenario-hyperscalers-and-ai-labs-* and scenario-aidc-developers-and-landlords-* rehearsals with
> them. Record that in the CHANGELOG entry and the SESSION-CONTEXT hand-off (§11.2, the landscape
> coupling); Classroom wave A in the action plan re-authors them.
>
> FOR THE MEGMEET START: in the SESSION-CONTEXT hand-off, write one short paragraph on what the three
> dossiers change about the megmeet dossier's missing customer side. Do not edit the briefing files.
>
> VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
> build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new dossier and guide renders under Playwright with zero page errors. CHANGELOG
> rotation only if non-exempt sections reach 100. Normal Pre-Commit and Pre-Push checklists; one commit;
> push on a claude/* branch."

**Phase F, session F-H1 — ByteDance, Alibaba Cloud and Chindata China** join the Profiler corpus: the China buyer side the `megmeet` dossier lacks. Two hyperscalers and one wholesale landlord, each with a v2 study guide and a lesson plan, plus the reciprocal customer edges on the two supplier dossiers that sell to them (`zhonhen` v9, `delta-electronics` v7). Run on Opus 5.5 at xhigh.

### Added

- **Three schema v7 dossiers** (`profileVersion` 1, intel-briefing style), each researched by two parallel subagents under the two-stage protocol (Agent A first-party and exchange records; Agent B third-party). `check-source-reachability.py` ran before Stage 2 was planned: **PARTIAL** — `sec.gov` / `data.sec.gov` blocked, the other probed hosts reachable; the Chinese filing hosts this session needed (cninfo, SZSE, HKEXnews) were read directly.
  - **`bytedance.profile.json`** — `categories: ["hyperscaler"]`; 69 sources (35% first-party), 31 developments, 7 products, 7 relationships, 4 decision makers. Identity: one group slug; Volcano Engine (北京火山引擎科技有限公司) is the name its own campuses are bought under, so it sits in `aka[]` with 字节跳动 / 火山引擎 / 火山云 / BytePlus / Douyin / TikTok / Doubao.
  - **`alibaba-cloud.profile.json`** — `categories: ["hyperscaler"]`; 66 sources (48% first-party), 23 developments, 6 products, 6 relationships, 7 decision makers. Identity: **the cloud unit, not the Group** — on the `nextera-energy-resources` precedent: it is the only data-centre-buying part of Alibaba and a reported segment (AI Cloud and Compute Services from the June 2026 quarter). The Group names, T-Head, Qwen and 阿里云 / 阿里巴巴（中国）有限公司 are in `aka[]`.
  - **`chindata.profile.json`** — `categories: ["developer"]`; 55 sources (40% first-party), 20 developments, 6 products, 6 relationships, 7 decision makers, with a KPI overlay (`mw-energized` 799.34 MW FY2025; `mw-contracted` 886.17 MW). Identity: **Chindata China** — the operating companies Bain's WinTriX DC Group sold to an HEC-led consortium for RMB 28.0B (closed 2026-01-16; the listed HEC Technology holds 30% and is buying the rest); the IDC licence and Huailai sit with 北京秦淮数据有限公司. Bridge Data Centres, the subject of the July 2026 sale reports, is Bain's separate former international arm and appears only in `aka[]` and context.
- **Three schema v2 study guides** — `alibaba-cloud.study.json` (16 sections), `bytedance.study.json` (16), `chindata.study.json` (14) — each with flashcards and a self-test on concepts only, and **three lesson plans** under `repository-information/study-prep/<slug>/`, five or six modules each, paced to the 2026-10-07 start.
- **17 new concepts** in `profiler-concepts.json` (1,520 total): `240vdc`, `approved-vendor-list`, `billed-capacity`, `capex`, `delta-connection`, `direct-green-power`, `east-data-west-computing`, `framework-procurement`, `internet-data-center`, `line-frequency-transformer`, `maas`, `panama-power`, `phase-shifting-transformer` (disambiguated from the transmission device of the same name), `rack-power-density`, `supernode`, `token`, `wholesale-colocation`.
- **One executive photo**, `live-site-pages/images/execs/chindata-wu.jpg`, cropped from Chindata's own captioned news photo.

### Changed

- **`zhonhen.profile.json` v8 → v9** (v8 archived) — two curated customer edges, each the reciprocal of a supplier edge in a new dossier: `alibaba-cloud` (since 2017; the RMB 800M 2021 Panama framework, its contract announcement added as a source) and `bytedance` (since 2025, via precision distribution — the FY2025 annual report already cited). No other field changed.
- **`delta-electronics.profile.json` v6 → v7** (v6 archived) — two customer edges: `alibaba-cloud` (since 2019, Panama co-launch; Delta China's release added as a source) and `chindata` (since 2025-11, the Sangyuan SST; Delta Brand News added as a source). **The v6 dossier did not name Alibaba or Panama at all.** No other field changed.
- **`zhonhen.study.json`** — one bullet corrected: it called Panama's device class 'the solid-state transformer / MV rectifier sidecar'; it now says transformer-rectifier, not SST, as the `zhonhen` dossier, the new `alibaba-cloud` dossier and NVIDIA's 2026 execution paper all do. `lastUpdated` 2026-09-26.
- **`profiler-companies.json`** — 182 → 185 entries, with taglines, `aka[]` (Chinese names included) and `domains[]` populated before the step-7 grep.
- **`profiler-segments.json`** — `bytedance` and `alibaba-cloud` → `hyperscalers-and-ai-labs` · challenger; `chindata` → `aidc-developers-and-landlords` · challenger; a basis line each.
- **`profiler-graph.json`** — rebuilt, 1,583 edges (1,197 curated).
- **`profiler-refresh-calendar.json`** — `alibaba-cloud` dated 2026-11-24 (**unconfirmed**: Alibaba has not announced its September-quarter results date; the date follows its reporting pattern); `bytedance` and `chindata` private, `cadence: quarterly`, `tier: core`. **`profiler-refresh-notes.json`** — a source and a `watch[]` list per slug, inserted without reordering the file.
- **`report-pins-verified.json`** — the two current reports that pin `zhonhen` and `delta-electronics` (`aidc-power-conversion-rev2--competitive--2026-09-25`, `sst-hall-edge-block-rev2--competitive--2026-09-23`) re-verified at the new versions: every cited source is unchanged; only relationships and sources were added.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the three F-H1 rows rewritten from hypotheses into verified cells with a premise verdict per clause; Model **Opus 5.5 xhigh**; `Checked 2026-09-26, v07.62r`; Dossier v1; Guide v2. The verdicts the prompt asked to run hardest:
  - **ByteDance capex — refined, unresolved:** the spread is about **3×**, not 2× — RMB 160B (FT, 2025-12-23), more than RMB 200B (SCMP, 2026-05-09), up to US$70B total under discussion (Bloomberg, 2026-05-27); anonymous-source leaks of different scope, none confirmed. Stated as a range.
  - **ByteDance's HVDC tender and 800 V pilot — not supported:** the 30–40% HVDC share and the tens-of-MW 800 V pilot trace only to one unattributed expo post (2026-01-22); the same site said a week later the 800 V work was 'still out to tender'; 21世纪经济报道 (2026-09-22) confirms only 'first introduced'. **No 800 V or SST award is public.** Zhonhen is named in ByteDance's chain (precision distribution, not HVDC); **Kehua is not** — its filings anonymise customers.
  - **Panama — held:** a line-frequency transformer-rectifier, not an SST (Zhonhen's own description; NVIDIA's 2026 800 VDC execution paper). **Zhonhen's ~70% — unverifiable:** no filing states a share; broker estimates run from about half to above 90%.
  - **Chindata's Huailai SST — held, with a qualifier:** a true SST on its makers' functional description (SiC high-frequency conversion, 'from line frequency to high frequency', 10 kV delta-connected to 800 V DC in one step, 98.5%); Delta supplied the SST, HEC the capacitor banks, Chindata the specification and 34 tests, Meituan is the tenant; formal commercial operation 2026-07-02. 'First' holds only as **first in commercial operation** — Eaton has run an SST pilot at VNET since end-2024.
- **README.md** — tree entries for the three profile/study pairs, the three study-prep directories and the two new archive files, plus the timestamp and repo version.

### Notes

- **Step-7 reconciliation** (grepped with the full `aka[]`, Chinese names included): ByteDance 3 dossiers (`mgx`, `narada`, `zhonhen`), Alibaba Cloud 5 (`narada`, `nscale`, `sungrow`, `zhonhen`, plus `calb`'s career-history line), Chindata 3 (`amperesand`, `dg-matrix`, `stack-infrastructure`). **No inbound claim contradicted the new dossiers**; `amperesand` and `dg-matrix` say the Sangyuan SST went live in February 2026, which is a distinct milestone from the July commercial-operation date and is recorded as such. Reciprocal types recorded: supplier ↔ customer on `zhonhen` (Alibaba Cloud, ByteDance) and `delta-electronics` (Alibaba Cloud, Chindata). **`megmeet` and `sinexcel` carry no edge to any of the three, and none is warranted:** no Megmeet, Sinexcel or Kehua filing names ByteDance, Alibaba or Chindata.
- **Two supplier claims were back-sourced in the ByteDance dossier before commit:** Jinpan's own bond feasibility report (360 data-centre projects including ByteDance) and Far East's Q1 2026 report (the Volcano Engine Yangtze-Delta campus) — both read in research, added to `sources[]` so the named-supplier sentence rests on each supplier's own filing.
- **Classroom lessons now stale, by design — `Classroom.gs` was not edited:** `landscape-hyperscalers-and-ai-labs-2026-09` (two new members) and `landscape-aidc-developers-and-landlords-2026-09` (one new member, on top of the `tract` v4 and `powerhouse-data-centers` v3 drift already recorded), and with them the `scenario-hyperscalers-and-ai-labs-*` and `scenario-aidc-developers-and-landlords-*` rehearsals. `build-classroom-segments.py --check` now shows 12 segment lessons due: the two segments above with real section changes (the-players, the-numbers, who-is-connected and more), nine with only the `where-it-sits` roster count, and `insurance-and-risk-transfer` pin-only. **Classroom wave A** in `phase-f-action-plan.md` (Fri 10/2 – Tue 10/6) re-authors them.
- **Checkers:** `sync-profiler-registry.py --check` clean (roster ↔ calendar bijection holds); `check-profiler-study.py` 0 errors, 0 warnings (185 guides, 1,520 concepts); `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates (none of the new dossiers' scopes exceeds the size cap); `check-readme-tree.py` 0 findings; `check-profiler-reports.py` 0 errors and the two pre-existing warnings (`jinko` v6, `oracle` v5), read and left loud.
- **Playwright:** the three new dossiers and guides, plus the revised `zhonhen` and `delta-electronics` (dossier, Relationships tab and study guide each), render on `Profiler.html` with zero console errors and no literal `{{` or `**`; the only page error is the auth wall's `gis_load_failed`, the Google Identity script the sandbox cannot fetch — the same condition every prior session recorded. `Profiler.html` itself is unchanged (data-only), so no page version bump.
- **No rotation:** 88 sections, under the trigger.

## [v07.61r] — 2026-09-26 01:21:37 AM EST

> **Prompt:** "remind me to check the 9/30 Classroom run after it happens, then list out all the other recommended companies to add to Profiler and recommend me an action plan to implement everything. I would like to use Opus 5.5, but make sure to recommend an effort level from medium to high to xhigh. Then, give me a prompt to paste into a new Opus 5.5 session (with your recommended effort level) to start the action plan, then remember session."

The hand-off after the Classroom re-pin: a reminder for the 9/30 pipeline run, the Phase F action plan on the developer's chosen model with an effort level per session, the paste-in prompt for its first session, and the session context saved.

### Added

- **`repository-information/phase-f-action-plan.md`** (new), in four sections:
  - **§1 — every company still recommended for Profiler.** The 32 remaining Phase F companies in 11 sessions (F-H1, F-N1, F-I1, F-I2, F-U3, F-U4, F-N2, F-G1, F-I3, F-I4, F-A1), each with its slug, category and segment hypothesis, and the count of existing dossiers that name it. ERCOT and PJM are listed as held. Mitsubishi Electric is recorded as named elsewhere but not approved, and the 2026-09-25 exclusions are restated so they are not re-proposed.
  - **§2 — the effort rule.** It comes from `PROFILER-COVERAGE-PLAN.md` §2's own evidence, "effort buys depth of reading, not care":
    - **xhigh** for long first-party records, heavy reconciliation and landscape re-authoring.
    - **high** for thin-record private subjects, reframes and refresh passes.
    - **medium** for bounded adjudication.
    - A confidence note states that this is judgment, not measurement.
  - **§3 — the action plan.** 21 rows in three stages with verified weekdays, interleaving the standing reminders (CoolIT 9/28, the 9/30 run, the neoclouds and Habitat pass on 10/1, the Dominion reframe 10/2–10/6, the Megmeet report by 10/31) with four batched Classroom waves. The effort mix is 12 xhigh, 6 high and 3 medium.
    - **F-H1 is first**: the only session tied to the developer's 10/7 Megmeet start. F-N1 can fold into the 10/1 pass if it slips.
    - **Recommendation:** add ERCOT and PJM in `other` after a one-paragraph schema note. This awaits the developer's decision.
  - **§4 — the F-H1 paste-in prompt** (ByteDance, Alibaba Cloud, Chindata), for xhigh. It follows the §11.4 template, with identity checks, the four premise checks to run hardest, the expected step-7 reconciliation including Chinese aka[] names, the landscape coupling, and a Megmeet hand-off paragraph.
- **`REMINDERS.md`** — a new active reminder, **check the 9/30 Classroom pipeline run once it has happened** (after ~7:30 AM ET on Wed 2026-09-30). It is additive: the developer's 2026-09-24 reminder for the same check is untouched, and the new entry says either can be dismissed once the check is done.

### Changed

- **`PROFILER-COVERAGE-PLAN.md` §11.2** — a pointer above the table recording that its Model column is superseded by the developer's 2026-09-26 decision and by the action plan. The 2026-09-25 table itself is untouched.
- **`SESSION-CONTEXT.md`** — the Latest Session is rewritten for v07.60r and v07.61r. The previous Latest moved down, and the older entry was dropped under the two-session cap.
- **README.md** — a tree entry for the action plan, plus the timestamp and repo version.

### Notes

- **No rotation:** 87 sections, well under the trigger.
- **No page, GAS script, Classroom content or Profiler dossier changed.**

## [v07.60r] — 2026-09-26 12:00:11 AM EST

> **Prompt:** "Run a Classroom session on `LightAISolutions/Sales` to re-pin `landscape-utilities-2026-09` and the three `scenario-utilities-*` rehearsals against the eleven `utility` dossiers, folding in the check of the 9/30 Classroom pipeline run.
>
> READ FIRST, in this order: `repository-information/SESSION-CONTEXT.md` (Latest Session); `.claude/rules/classroom-app.md` (the provenance stamp, Freshness, the content contract, the `gateDigest` obligation, and "Authoring a pipeline lesson" — the G3 contradiction test); `.claude/rules/industry-guidance.md` (Freshness discipline, step 10; step 7's render recipe; the content-scope rule and its landscape exception); `repository-information/CLASSROOM-SCHEMA.md`; `repository-information/CLASSROOM-CURRICULUM-PLAN.md` §10.3–10.6 (the segment-lesson generator; the landscape module; session 4's finding (j), the split between `landscape-utilities-2026-09` and `utility-aidc-procurement-2026-08`: that module owns the procurement process, the landscape owns the parties, and the landscape carries no tariff table) and §11 (the C5 ledger; design D6); `repository-information/C5-SALES-SIMULATIONS-DESIGN.md` §3, §6 and §12; the v07.40r entry in `repository-information/CHANGELOG.md` (the precedent freshness pass on this module and these scenarios); `repository-information/industry-guidance/landscape-utilities-analysis.md` (the source of truth the module JSON mirrors); the five new dossiers at v1 (`live-site-pages/profiler-data/{duke-energy,dte-energy,wec-energy,berkshire-hathaway-energy,exelon}.profile.json`), the `utilities` and `storage-developers-and-ipps` members in `profiler-segments.json`, and the F-U1/F-U2 rows of `PROFILER-COVERAGE-PLAN.md` §11.3 (the premise verdicts). Run `git fetch --unshallow origin main` before any pin read or `--check`.
>
> PART A — THE 9/30 PIPELINE RUN (the standing reminder). Open the session of the weekly Routine "Classroom curriculum pipeline (C2) - weekly" (`trig_01TiCXzEjowZGbS7aB2e6gQS`) and read its final `CLASSROOM PIPELINE — 2026-09-30 — …` report. Expected: a `COMMIT` of a briefing (the 9/23 run stood down with 4 qualifying items across 1 source against a bar of 3/2, at `coveredThrough` 2026-09-21; the 9/24 Gridmatic and Habitat Energy refreshes should supply the second source). A `STAND-DOWN` is fine if the report explains it; a `BLOCKED —` title needs a look. Also say whether a push or email notification arrived (none came for 9/21 or 9/23; if 9/30 committed and nothing arrived, the finding is that notifications do not reach the developer even for committing runs — raise with Claude support, do not change the Routine). If the run committed, `git fetch origin main` and rebase before writing anything: its commit lives inside the `// CONTENT START` … `// CONTENT END` fence you are about to edit. Report the outcome; the reminder itself is the developer's — do not close it.
>
> PART B — THE SEGMENT LESSONS (generator only, never by hand). Run `python3 scripts/build-classroom-segments.py --check`. At v07.58r it reads `utilities` and `storage-developers-and-ipps` due with section changes (`the-players`, `the-numbers`, `the-fence`, `who-is-connected`, `what-moved`, `where-it-sits`, `read-next`, `check-yourself`) from the five added profiles, and several other segments due on `concepts:`/`graph:` pin moves. Regenerate exactly the segments the check lists with sections differing — follow the check, not this sentence — and leave pin-only segments alone (G3: regenerating them rewrites dates and nothing else). Never edit a `segment-*` lesson by hand.
>
> PART C — THE LANDSCAPE MODULE. `landscape-utilities-2026-09` lives in `guidanceDocs_()` in `googleAppsScripts/Classroom/Classroom.gs` below the fence; the analysis markdown is the source of truth and the module mirrors it. Apply the G3 test section by section — for each change, write the sentence "section `<id>` teaches X; the dossiers now say Y" — and revise only where it can be written. What is known to be stale: the tiles ("14 members on record … Six incumbent, two challenger, six adjacent — measured 14 September 2026") and `short` ("Six franchises …") — the segment now holds eleven incumbents; `who-dominates-and-on-what-basis` (six incumbents named); `each-players-bet` (add a row per new member, drawn from its `strategyRead[]` and labelled analysis — Duke's self-build storage and 80-year licences, DTE's customer-funded batteries under a special contract, WEC's bespoke-resource subscription, BHE's PPA-side plan and the 25 MW LLESA, Exelon's wires-only book and the transmission security agreement); `who-threatens` (decide from the record whether a wires-only franchise and a PPA-side one change the disintermediation read); `the-indicators` (the new dated gates: the NCUC rate orders mid-November 2026 and the expedited large-load proceeding before 2027-01-01; the MPSC decision on DTE's Google contract U-22058; WEC's Q4 2026 certificate decisions and the FERC docket ER26-3265; the PUCN's 2026 IRP and LLESA decision by 2026-12-02; the ICC's 2028–2031 grid-plan order 2026-12-15; the NJ BPU on ACE Pittsgrove about February 2027; the Oregon Supreme Court on James 2026-11-03; the PowerHouse credit clause in the Northern District of Illinois); `the-sellers-play` (the instrument-first play now spans five instruments — the minimum-demand tariff, the special contract, the bespoke subscription, the LLESA generation charge, the wires-only TSA — say what that does to "identify the instrument before the account plan"); `claims-ledger` (cite the five dossiers at v1 by section, fact against analysis, as the ledger already does for the fourteen); `what-the-record-does-not-say` (no battery or turbine OEM is named by any of the five except DTE's LG Energy Solution and Reid Gardner's BYD; PacifiCorp's Utah counterparty, PECO's tariff filing and Maryland's PC72 terms are not found). Touch `drill` and `check-yourself` only if a taught claim changed. Keep the split with `utility-aidc-procurement-2026-08`: parties, not process; no tariff table. Append a `revisions[]` entry with `changed[]`, set `updated` to the session date, and re-sort `reviewBy` from the members' nearest dated gate — it is 2027-01-01 today (Dominion's large-load class) and the new members bring earlier gates; read gates in `policyExposure[]` prose as well as `effectiveDate` (§10.6 (d)). Tier stays contributor. Mirror every change into `landscape-utilities-analysis.md` with a revision section. Then check `landscape-storage-developers-and-ipps-2026-09`: Duke, DTE, WEC and BHE became adjacents of that segment; revise it only if a taught claim (a member count, an adjacent list) is contradicted, and say either way.
>
> PART D — THE THREE REHEARSALS (developer session only; the pipeline never touches a `type: "scenario"` lesson, P13; design D6). For `scenario-utilities-objection` (Dominion), `scenario-utilities-discovery` (Southern Company) and `scenario-utilities-discovery-aidc` (AEP): re-judge every beat's correct answer against the revised landscape; re-pin `guidance:landscape-utilities-2026-09` to the module's new `updated`; put in `changed[]` only the sections whose meaning changed, with a `revisions[]` note; leave the counterparty `profile:` pins where they are unless a contradiction moves them (`dominion-energy` v1, `southern-company` v2, `aep` v1 — check the registry's current versions). Do not reframe the Dominion room in this session: "reframe the Dominion rehearsal" is its own reminder for 2026-10-02 to 2026-10-06, after the Virginia and North Carolina storage solicitation issues; if this session runs inside that window, say so and leave the reframe to its own session unless the developer says otherwise. `scenario-utilities-objection`'s `reviewBy` (2026-10-01) is that reframe's gate — leave it.
>
> PART E — VERIFY, VERSION, COMMIT, PUSH. `python3 scripts/check-classroom-content.py` (0 errors, 0 warnings); `python3 scripts/check-classroom-curriculum.py --strict` (no structural findings; 0 scenarios whose landscape moved since the pin, once re-pinned); `python3 scripts/check-classroom-pipeline.py --base origin/main` (content edits do not move the gate surface — refresh `gateDigest` in `repository-information/classroom-pipeline-ledger.json` only if P3 reports a mismatch, and leave `coveredThrough` and `lastRun` alone); `python3 scripts/build-classroom-segments.py --check` (the regenerated segments no longer due with section changes); `node --check googleAppsScripts/Classroom/Classroom.gs`; render the module and the three scenarios with industry-guidance step 7's Playwright recipe, zero page errors. Versioning per CLAUDE.md: [PC-GS-VERSION] #1 — bump `VERSION` in `Classroom.gs` (v01.91g at the time of writing) and `live-site-pages/gs-versions/Classroomgs.version.txt` together, and the README tree display (`python3 scripts/check-readme-tree.py`); [PC-PAGE-CHANGELOG] #16 — a generic line in `live-site-pages/gs-changelogs/Classroomgs.changelog.md` (public: no ids, dockets or internals); [PC-CHANGELOG] #6 — the repo CHANGELOG entry with the G3 sentences per section, the segment regenerations, the scenario re-pins and the 9/30 run outcome; **rotation:** this will be the first push dated 2026-09-26 or later, so after `git fetch --unshallow origin main` move the oldest whole date groups (2026-09-18 and 2026-09-19, 26 sections, SHA-enriched) to `CHANGELOG-archive.md` until fewer than 100 non-exempt sections remain. Normal Pre-Commit and Pre-Push checklists; one commit; push on a `claude/*` branch. The affected page is Classroom (GAS-only, so the label shows the new `g` version).
>
> NEVER: edit any Profiler dossier (the five are read-only inputs at v1); fabricate a `provenance.inputs[]` entry or use a `note:` prefix; give a scenario a `report:`, `corpus:` or `briefing:` input; author or revise a `segment-*` lesson by hand; touch the AUTH region or the gate derivation; close or edit the developer's reminders. If the Fable weekly cap binds, continue on Opus 5.5 xhigh and record the substitution in the CHANGELOG entry."

The Classroom re-pin after Phase F's five utilities. `landscape-utilities-2026-09` is revised section by section under the G3 test against the five new dossiers at v1, and its review date moves to 2 December 2026. `landscape-storage-developers-and-ipps-2026-09` gets a count-only correction, because four of the five joined that segment as adjacents. The generator regenerated the 17 segment lessons `--check` listed with section changes. All five rehearsals resting on the two landscapes were re-judged and re-pinned; every beat holds. **Part A: the 9/30 pipeline run has not happened yet** — this session ran on 25–26 September. See Notes.

### Changed

#### `googleAppsScripts/Classroom/Classroom.gs` — `landscape-utilities-2026-09` (guidance, below the fence; contributor, unchanged)
- `updated` 2026-09-24 → 2026-09-26; `reviewBy` 2027-01-01 → **2026-12-02**. Inputs: `profile:duke-energy`, `profile:dte-energy`, `profile:wec-energy`, `profile:berkshire-hathaway-energy` and `profile:exelon`, all v1 @2026-09-26; `profiler-segments.json` @ v07.58r. The fourteen original dossiers are unchanged at the versions the ledger cites.
- **The G3 sentences, one per section:**
  - **`who-dominates-and-on-what-basis`** taught "six incumbents", a playbook covering "the same franchises plus four", "Southern is the one member that buys the battery itself" and "one of five machines". The five dossiers now say the segment holds eleven franchises, the playbook covers five of them, and four of the newcomers own utility batteries (DTE naming LG Energy Solution Vertech). The five are added as variants of the five instruments, which is labelled as the module's own analysis: Duke the contract, DTE, WEC and NV Energy the customer-specific charge, Exelon the collateral. The split with `utility-aidc-procurement-2026-08` held: no tariff table, channel list or buyer map was added.
  - **`who-threatens`** taught NRG's 30,713M as "the largest figure in the segment" and Vistra's 17,738M as third. `profile:duke-energy` v1 carries 32,237M, so NRG is second and Vistra seventh of twelve (DTE states no full-year revenue). The wires-only (Exelon) and PPA-side (NV Energy) test was decided from the record: **the three routes stand**. Exelon's battery petition still arrives by route two through Invenergy. NV Energy has written route two into its plan, and Nevada's 17 September approval of 362 MW of temporary gas gives route one its first commission-approved instance.
  - **`each-players-bet`** taught eight rows. It now has thirteen: Duke, DTE, WEC, Berkshire Hathaway Energy and Exelon rows are drawn from each dossier's `strategyRead[]`, labelled as analysis, with the dossier's confidence carried.
  - **`the-indicators`** taught 76 policy entries, 64 dated, and the review date of 1 January 2027. The fence is now 103 / 85 / 1 future. Nine rows are added:
    - Florida's compliant-tariff deadline, 1 October.
    - The Oregon Supreme Court argument, 3 November.
    - North Carolina's mid-November rate orders, the expedited tariff due before 1 January, and the 31 December resource-plan order.
    - The PUCN's statutory 2 December decision.
    - The ICC grid-plan order, 15 December.
    - WEC's Q4 certificates and ER26-3265.
    - The NJ BPU decision on ACE Pittsgrove, about February 2027.
    - Michigan's U-22058, undated.
    - The PowerHouse credit clause in the Northern District of Illinois, undated.

    The sales line's ratemaking count goes from three of sixteen to eight of twenty-six.
  - **`the-sellers-play`** taught three claims that the new dossiers contradict:
    - "The six franchises … five different mechanisms": the play is now two questions, **which instrument and who owns the asset under it**, because the charge design routes the battery three ways (DTE purchase order, WEC build-transfer, NV Energy PPA).
    - "Every incumbent publishes a large number it does not believe": now "most". Exelon's 36→4 GW and NV Energy's ~22→~6 GW are added, and Duke is named as the franchise that publishes no inquiry figure.
    - "Two of the three largest revenue lines are not utilities": now one.
  - **`claims-ledger`** adds 21 rows for the five at v1, by field, and re-measures the count, revenue and fence rows. The intro now labels `strategyRead[]`/`ecosystemRole` rows as analysis and the other fields as fact, and names the module's third own claim.
  - **`what-the-record-does-not-say`**:
    - Item 1 taught "two of the six" on supplier disclosure. It now counts eleven franchises: most of the owned lane names no supplier, DTE names LG Energy Solution Vertech in its own release, and NV Energy names BYD cells for one battery. (A first draft called DTE the only incumbent naming its supplier; Xcel's Form Energy battery and Southern's Wärtsilä site were found before commit and the claim was dropped.)
    - Item 3 becomes "the Texas wires incumbent", since Exelon names its security-agreement holders.
    - Item 4 now counts eleven.
    - Item 5 records Duke's named turbine supplier (GE Vernova, 26 units) against DTE, WEC and BHE naming none.
    - Item 7 adds Nevada: approved, not delivered.
    - A new item 9 lists the newcomers' unfound items: DTE's revenue, PacifiCorp's Utah counterparty, PECO's filing, Maryland's PC72 terms and the U-22058 order.
  - **`drill`** (cards 1, 2, 3 and 7) and **`check-yourself`** (items 1, 2 and 5) carried the six-incumbent, eight-player and first-and-third claims. They are corrected; no correct answer changed.
- **Outside the sections:** `short`, tiles 1 and 4, `source.doc` and five read times are updated, and a third `revisions[]` entry is appended. The function's header comment no longer says "reviewBy is 2026-10-01", which had been stale since v07.40r.
- **Why 2 December:** it is the first dated decision in the record that fixes the terms of an instrument the module teaches — the PUCN's statutory deadline on NV Energy's 2026 IRP and the form LLESA, from `berkshire-hathaway-energy` PE[1] prose. The nearer candidates were each rejected: a filing deadline (Florida, 1 October), a hearing (Oregon, 3 November), windows and deliverables (mid-November NCUC and FERC, Illinois's 15 November IRP filing), and one date on a topic the module does not teach (DTE Gas, 1 October). A sort still returns 1 January 2027. Section 13 of the analysis file has the full reasoning.

#### `googleAppsScripts/Classroom/Classroom.gs` — `landscape-storage-developers-and-ipps-2026-09` (guidance, below the fence; contributor, unchanged)
- `updated` 2026-09-14 → 2026-09-26; `reviewBy` stays 2027-01-01, since the fence still has no future effective date. **Revised because taught counts were contradicted.** Duke, DTE, WEC and BHE joined as adjacents; adjacents carry no bet, so only counts moved:

| Where | Was | Now |
|---|---|---|
| Tiles 1 and 2, ledger row 1 | 34 members — 19 · 8 · 7 | 38 — 19 · 8 · 11 |
| Tile 2 | "no other reaches 11" | utilities reaches 11 |
| Fence, in the indicators intro, not-say item 9 and a drill card | 142 / 96 | 163 / 112, latest still 1 Sep 2026 |
| Revenue and operating-KPI carriers, ledger and not-say item 2 | 7 / 3 / 27 of 34 | 10 / 7 / 27 of 38 |
| Ownership events, seller's play and a drill card | ten of thirty-four | twelve of thirty-eight — Duke Energy Florida's Brookfield minority sale and PacifiCorp's Washington sale |
| `check-yourself` rationale | seven adjacents | eleven |

- One ledger row is added. The KPI counts are read on the latest-annual-period basis, which reproduces the 14 September figures exactly. **No adjacent list is taught, so none needed correcting.** No bet, route, gate or move changed.

#### `googleAppsScripts/Classroom/Classroom.gs` — segment lessons (inside the fence; generator only, never by hand)
- `build-classroom-segments.py --segment … --today 2026-09-26` regenerated exactly the 17 segments `--check` listed with sections differing. Every one moved `concepts:profiler-concepts` 2026-09-19 → 2026-09-26 and `graph:profiler-graph` → 2026-09-26.
  - **`utilities`** and **`storage-developers-and-ipps`** changed `the-players`, `the-numbers`, `the-fence`, `who-is-connected`, `what-moved`, `where-it-sits`, `read-next` and `check-yourself`. `utilities` added five profiles @2026-09-26 and `storage-developers-and-ipps` four, plus `gridmatic` 2026-09-12 → 2026-09-24.
  - **`aidc-developers-and-landlords`** changed `what-moved`, `where-it-sits` and `who-is-connected` (`tract` → 2026-09-26, `powerhouse-data-centers` → 2026-09-26).
  - **`software-and-optimization`** changed `what-moved` and `where-it-sits` (`gridmatic`, `habitat-energy` → 2026-09-24).
  - **`epc-and-construction`**, **`neoclouds`** and **`capital`** changed `where-it-sits` and `who-is-connected`.
  - `where-it-sits` only: `cells-and-chemistry` and `storage-integrators-and-containers` (`narada` → 2026-09-24), `power-conversion-and-rack-power-silicon`, `grid-equipment`, `in-hall-power`, `bridge-and-on-site-generation`, `clean-firm-and-nuclear`, `cooling`, `hyperscalers-and-ai-labs` and `assurance`.
- **Pin-only and left alone (G3):** `compute-and-the-rack` and `insurance-and-risk-transfer`. `--check` now reads 2 due, 0 with section changes. The content checker's four `the-players`/registry errors on `segment-utilities` and `segment-storage-developers-and-ipps` are cleared.

#### `googleAppsScripts/Classroom/Classroom.gs` — rehearsal scenarios (developer session, design D6)
- **`scenario-utilities-objection`** (Dominion; guidance, unchanged):
  - Changed: `what-the-record-does-not-say`. It taught "two of the six franchises run open storage solicitations and neither one's battery supplier is discoverable"; the landscape now counts eleven, most of whose owned lane names no supplier. The advice stands.
  - Pin `guidance:landscape-utilities-2026-09` 2026-09-24 → 2026-09-26. `reviewBy` **stays 2026-10-01**, the reframe's gate.
  - The room was not reframed: this session ran before the 2–6 October window.
- **`scenario-utilities-discovery`** (Southern):
  - Changed: `claims-ledger`. "Every incumbent … publishes a large number" becomes "most"; this buyer's 75 GW against 17 GW is unchanged.
  - Pin → 2026-09-26. `reviewBy` stays 2026-11-03.
- **`scenario-utilities-discovery-aidc`** (AEP):
  - Changed: `the-position` and `claims-ledger`. "Every incumbent" becomes "most", and the review-date row is rewritten because the landscape's bound is now nearer than this scenario's own 10 December gate.
  - Pin → 2026-09-26. `reviewBy` 2026-12-10 → **2026-12-02**.
- **`scenario-storage-developers-and-ipps-objection`** and **`scenario-storage-developers-and-ipps-discovery`**: changed none (re-judged and re-stamped). Pin `guidance:landscape-storage-developers-and-ipps-2026-09` 2026-09-14 → 2026-09-26; `reviewBy` stays 2027-01-01. Each gets its first `revisions[]` entry.
- **All fifteen beats hold.** Counterparty pins are unchanged: `dominion-energy` v1 @2026-09-03, `southern-company` v2 @2026-09-05 and `aep` v1 @2026-09-03 are the registry's current versions. `project:stargate`, `aypa-power`, `canadian-solar` and `spearmint-energy` are also unchanged.

#### `repository-information/industry-guidance/`
- **`landscape-utilities-analysis.md`** — a current-state pointer under the provenance line, and **§13, the 26 September 2026 re-pin**. It carries the segment re-measured, the G3 sentence per section, the review-date judgment with every rejected candidate, the scenarios re-judged, and what was flagged but not changed.
- **`landscape-storage-developers-and-ipps-analysis.md`** — a pointer, and **§12, the count correction**, including how the two ownership events were counted.

#### Versions
- Classroom GAS v01.91g → **v01.92g**: `Classroom.gs` `VERSION`, `Classroomgs.version.txt` and the README tree display. `Classroomgs.changelog.md` gets generic lines only.

### Notes
- **Part A — the 9/30 Classroom pipeline run.** This session ran from 11:11 PM on 25 September to the early hours of 26 September (EST), five days before that run.
  - `get_trigger` on `trig_01TiCXzEjowZGbS7aB2e6gQS` returned: enabled, cron `0 11 * * 3`, `last_fired_at` 2026-09-23T11:08Z with `last_run` SUCCEEDED (session `cse_01BrH9eZymwoEYBdFeBFYzjv`, the 9/23 stand-down), `next_run_at` **2026-09-30T11:02Z**, and notifications push and email both on.
  - **There is no 9/30 report to read, no notification to check yet, and no pipeline commit to rebase over.** `origin/main` was fetched before the push and no pipeline commit had landed.
  - The developer's reminder is untouched and stays open for its own date.
  - What the 9/30 run will find from this push: the five scenarios' landscape pins now match their landscapes, so nothing lands under *Needs the developer* for them. `coveredThrough` (2026-09-21) and `lastRun` are untouched.
- **Checkers (final run, before commit):**
  - `check-classroom-content.py`: 71 lessons / 8 tracks / 220 gate cases, **0 errors, 0 warnings**, down from 4 errors at session start.
  - `check-classroom-curriculum.py --strict`: no structural findings; **0 scenarios whose landscape moved since the pin**.
  - `build-classroom-segments.py --check`: 2 due, 0 with section changes.
  - `node --check` on a `.js` copy: clean. `check-gas-inner-scripts.js`: all 106 blocks parse. `check-readme-tree.py`: 0 findings.
  - `check-classroom-pipeline.py --selftest`: 15 fixtures, 0 failures.
  - Playwright render (industry-guidance step 7 recipe, contributor session) of both landscapes and all five rehearsals: **0 page errors**, no literal `**` or `{{` in the rendered text.
- **`check-classroom-pipeline.py --base origin/main`** reports P1, P2, P10 and P13 only, all expected on a developer commit:
  - P1: the two analysis files are outside the committer's write set.
  - P2: two guidance modules are below the fence.
  - P10: 22 revised lessons — 17 regenerated segments and 5 scenarios.
  - P13: design D6 reserves scenario revisions for a developer session.
  - **No P3, so `gateDigest` is untouched.**
- **Flagged, not changed — the brief's OEM line.** It said no battery or turbine OEM is named by any of the five except DTE's LG Energy Solution and Reid Gardner's BYD. `duke-energy` v1 names **GE Vernova** as its turbine supplier (26 units), and the module follows the dossier. The coverage plan's "no OEM" line for Duke concerns batteries.
- **Carried, not taught:** the unreconciled figures the Profiler session left loud (Oracle vs DTE storage dollars, MasTec vs BHE Greenlink, Exelon's TSA-backed GW against flat collateral, Compass Hoffman Estates), AEP's "six of eight" and Dominion's "all-stock" description (the reframe session's).
- **Also moved beneath a landscape this session did not revise:** `tract` v4 and `powerhouse-data-centers` v3 sit under `landscape-aidc-developers-and-landlords-2026-09`. No scenario on it shows as moved, because its `updated` did not change. Not examined here; a candidate for that landscape's next review.
- **Archive rotation performed — the first push dated 2026-09-26 EST.** `TZ=America/New_York date` read 2026-09-26 12:00 AM, after an explicit wait past midnight so the push could not land on 9/25. The count was 112 raw with 1 exempt (this section), so 111 non-exempt.
  - The 2026-09-18 group (8 sections, v06.49r–v06.56r) rotated, leaving 103 — still at or above the trigger.
  - The 2026-09-19 group (18 sections, v06.57r–v06.74r) rotated, leaving **85 non-exempt, below 100**.
  - All 26 are SHA-enriched from a deepened clone, and `git log --all` resolved 26 of 26. Post-rotation verification (`grep '^## \[v' CHANGELOG-archive.md | grep -v '— \['`) returns nothing.
  - The move is byte-exact: the CHANGELOG lost only the rotated tail and the archive gained only it. Two pre-existing blank-line irregularities stay where they were — the missing blank line above v07.14r (not rotated), and a doubled blank line inside the rotated v06.53r section, which moved verbatim.
  - Counter `Sections: 111/100` → **`86/100`**. `Classroomgs.changelog.md` 43/50 → 44/50; no rotation.

## [v07.59r] — 2026-09-25 11:09:11 PM EST

> **Prompt:** "give me a prompt to paste into a new session (Fable 5.1 or Opus 5.5, Medium, High, Xhigh effort) to run a Classroom session to re-pin landscape-utilities-2026-09 and the three scenario-utilities-* lessons against the eleven utility dossiers, folding it into the 9/30 Classroom run already on my reminders. Then, remember session."

The hand-off from Phase F waves 1 and 2: the Classroom session that repairs what five new `utility` dossiers made stale is now a paste-in prompt in the repo, and the session context is saved.

### Added

- **`repository-information/classroom-utilities-repin-prompt.md`** — the paste-in prompt, in five parts, for a fresh Opus 5.5 xhigh session (Fable 5.1 High acceptable) on or after Wednesday 2026-09-30 after about 7 AM ET: **A** the 9/30 C2 pipeline-run check from the standing reminder (expected outcome, the notification question, rebase-if-it-committed); **B** segment-lesson regeneration by `build-classroom-segments.py` only — at v07.58r the check reads `utilities` and `storage-developers-and-ipps` due with eight sections differing; **C** `landscape-utilities-2026-09` under the G3 contradiction test — the "14 members / six franchises" tiles, the bets table's five new rows, the new dated gates (NCUC, MPSC U-22058, WEC's Q4 dockets and ER26-3265, PUCN 2026-12-02, ICC 2026-12-15, NJ BPU ~Feb 2027, the Oregon Supreme Court, the PowerHouse credit clause), the five-instrument seller's play, the claims ledger at v1, `reviewBy` re-sorted from the nearest gate, the analysis markdown mirrored, and a G3 check of `landscape-storage-developers-and-ipps-2026-09`'s member counts; **D** the three `scenario-utilities-*` rehearsals re-judged and re-pinned under D6/P13, with the Dominion room reframe left to its own 10/2–10/6 reminder; **E** the checkers, the Playwright render, the Classroom GAS bump, the public changelog line, and the CHANGELOG archive rotation that push will owe. Recommended model and timing are stated at the top.

### Changed

- **`REMINDERS.md`** — a fold-in pointer added under the developer's 9/30 Classroom-run reminder naming the prompt file (additive; the reminder's own text is untouched).
- **`SESSION-CONTEXT.md`** — the Latest Session extended in place for this turn (repo version, the prompt file, and the recommendation now pointing at it).
- **README.md** — tree entry for the prompt file.

### Notes

- **Archive rotation not performed:** 111 sections, thirteen dated today (EST) and exempt, 98 non-exempt against a trigger of 100. The Classroom re-pin push will be the first dated 2026-09-26 or later and must rotate; the prompt says so.

## [v07.58r] — 2026-09-25 10:53:01 PM EST

> **Prompt:** "Picking up from my last session, run Phase F sessions F-U1 and F-U2 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: Duke Energy, DTE Energy and WEC
> Energy (F-U1), then Berkshire Hathaway Energy (NV Energy) and Exelon (F-U2).
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the
> five F-U1/F-U2 rows of §11.3 are yours); .claude/rules/profiler-app.md (Profiler Command including step
> 1a identity and step 7 reconciliation, Profiler Prep Command, Scheduled Refreshes);
> repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments registry, Refresh calendar);
> repository-information/PROFILER-STYLES.md (active style intel-briefing). Read the dominion-energy,
> southern-company and aep dossiers and study guides as the house pattern for a utility.
>
> TWO WAVES, TWO PUSHES — I am explicitly asking for two separate push commits:
> - Wave 1: Duke Energy, DTE Energy, WEC Energy -> commit and push.
> - Wave 2: Berkshire Hathaway Energy, Exelon -> commit and push once wave 1's branch has merged
>   (Pre-Push #5 push-once).
> If the session runs short, stop cleanly after wave 1 and hand wave 2 back to me as a prompt.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories ["utility"]) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Populate aka[] BEFORE the step-7 grep (operating utilities
> and former names: ComEd, Commonwealth Edison, PECO, BGE, Pepco, Delmarva, Atlantic City Electric; NV
> Energy, Nevada Power, Sierra Pacific, PacifiCorp, MidAmerican; Duke Energy Carolinas / Progress /
> Florida / Indiana / Ohio, Piedmont; DTE Electric; We Energies, Wisconsin Public Service). Assign segments
> in live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: `utilities` ·
> incumbent; `storage-developers-and-ipps` · adjacent only where utility-owned storage is material in the
> dossier). Then the registry sync, the graph build, a dated calendar row per company (all five file with
> the SEC — research each Q3 2026 earnings date), README tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — check at least: Brookfield's 19.7% Duke Energy Florida stake (first closing not
> confirmed); BHE is 100% Berkshire and PacifiCorp is selling its Washington operations to Portland
> General (close 2027); nothing known for DTE, WEC or Exelon — verify anyway. Proposed slugs: duke-energy,
> dte-energy, wec-energy, berkshire-hathaway-energy, exelon. Decide BHE's display name under Naming and
> renames; the precedent for a holding company taught through its lead utility is Southern Company.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify every figure against
> first-party sources (10-K and 10-Q, the Q2 2026 decks, state PUC dockets, and EEI's "Large Load Projects
> and Tariffs" list updated 11 Sep 2026), record a premise verdict per clause, and rewrite the cells.
>
> RECONCILIATION (step 7) — expected inbound: Exelon/ComEd ~19 dossiers, NV Energy/BHE/PacifiCorp ~18,
> Duke ~10, DTE ~9, WEC ~4. Known drift candidates, all agent-reported and unread:
> - powerhouse-data-centers says ComEd's Joliet TSA was lost in July; Utility Dive reported FERC rejected
>   ComEd's cancellation notice on 22 Sep 2026, leaving the dispute in federal court.
> - tract carries NV Energy's July lawsuit and a pending PUCN gas-plant decision; the PUCN reportedly
>   approved the two plants conditionally around 19 Sep 2026.
> - lg-energy-solution carries the DTE 6 GWh LGES Vertech deal — check that both sides agree.
> - DTE's Saline-linked storage is 1.4 GW in one source and 332 MW in the MPSC approval; state both unless
>   a source reconciles them.
> If BHE's or Exelon's reconciliation outgrows the session, say so and defer it per step 7's scope note.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. Five new utilities make landscape-utilities-2026-09
> (built on "six franchises") and the three scenario-utilities-* rehearsals stale; record that in the
> CHANGELOG entry and the SESSION-CONTEXT hand-off instead (§11.2, the landscape coupling).
>
> CHANGELOG: the first push dated 2026-09-26 or later must rotate. Run `git fetch --unshallow origin main`
> first, then move the oldest whole date groups with SHA enrichment until fewer than 100 non-exempt
> sections remain.
>
> VERIFY per wave: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check
> clean; build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new dossier and guide renders (Playwright) with zero page errors. If the Fable weekly
> cap binds, continue on Opus 5.5 xhigh and record the substitution in the §11.3 Model cell. Normal
> Pre-Commit and Pre-Push checklists; push on a claude/* branch."

**Phase F, wave 2 (F-U2) — Berkshire Hathaway Energy and Exelon** join the Profiler corpus as the tenth and eleventh `utility` dossiers, each with a v2 study guide and a lesson plan, as the second of the two pushes the prompt asked for (wave 1 was v07.57r). Step-7 reconciliation revised two existing dossiers — `tract` to v4 and `powerhouse-data-centers` to v3 — against the drift candidates the prompt named.

### Added

- **Two schema v7 dossiers** (`profileVersion` 1, `categories: ["utility"]`, intel-briefing style), each from two parallel subagents under the shared two-stage protocol. SEC hosts refused the sandbox throughout, and both companies' investor sites were unreadable (brkenergy.com WAF-blocked; investors.exeloncorp.com HTTP 503), so filings came from Berkshire's 10-Qs, the annualreports.com and last10k mirrors, transcripts and the 8-K mirror.
  - **`berkshire-hathaway-energy.profile.json`** — 88 sources, 40 developments, 6 products, 18 relationships, 9 decision makers, no photos (brkenergy.com blocked; nvenergy.com renders no server-side content). **Display name decided as "Berkshire Hathaway Energy"** on the Southern Company precedent — the holding company, taught through its lead utility — with NV Energy, Nevada Power, Sierra Pacific, PacifiCorp, Rocky Mountain Power, Pacific Power, MidAmerican, BHE Renewables, BHE Transmission, BHE GT&S, Northern Natural Gas, Northern Powergrid, AltaLink and CalEnergy in `aka[]`. `ownership.type` is `subsidiary` (100% Berkshire; no ticker; an SEC registrant through its debt) and `financials.type` is `private` (no EPS, no consensus, no calls).
  - **`exelon.profile.json`** — 106 sources, 41 developments, 6 products, 19 relationships, 9 decision makers; seven executive photos from exeloncorp.com (Butler, Jones, Quiniones, Innocenzo, Khouzami, Olivier, Honorable), cropped from the company's banner templates to 480 px squares. `aka[]`: ComEd, Commonwealth Edison, PECO, BGE, Pepco, Pepco Holdings, PHI, Delmarva Power, Atlantic City Electric, ACE.
- **Two schema v2 study guides** — `berkshire-hathaway-energy.study.json` and `exelon.study.json` (14 sections each, flashcards and a self-test) — and **two lesson plans** under `repository-information/study-prep/<slug>/`, five modules each.
- **13 new concepts** in `profiler-concepts.json` (1,503 total): `mobile-sierra`, `clean-transition-tariff`, `line-extension-agreement`, `load-commitment-agreement`, `price-collar`, `reliability-backstop`, `energy-imbalance-market`, `sale-leaseback`, `indexed-storage-credit`, `coal-to-gas-conversion`, `show-cause-order`, `utility-owned-generation`, `distribution-only-service`. Three drafted concepts were dropped because the checker found their terms already aliased elsewhere: `base-residual-auction` (an alias of `capacity-market`), `resource-adequacy` (of `planning-reserve-margin`) and `wires-only-utility` (of `vertically-integrated-utility`).
- **Archived dossiers:** `archive/tract.profile.v3.json` and `archive/powerhouse-data-centers.profile.v2.json`, with `archive-index.json` entries and README tree lines.

### Changed

- **`profiler-companies.json`** — 180 → 182 entries. **`profiler-segments.json`** — `berkshire-hathaway-energy`: `utilities` · incumbent and `storage-developers-and-ipps` · adjacent (the tolling counterparty on 5,405 MW of new battery PPAs plus owned Reid Gardner and Sierra Solar); `exelon`: `utilities` · incumbent only — it owns no generation or storage, and ACE's 500 MW Pittsgrove battery is a petition, to be revisited on the ~February 2027 BPU decision. **`profiler-graph.json`** — rebuilt, 1,560 edges.
- **`profiler-refresh-calendar.json`** — `berkshire-hathaway-energy` 2026-11-06 (unconfirmed; the inferred 10-Q date from the Q3 2025 pattern, Berkshire's release the Saturday after) and `exelon` 2026-11-03 (unconfirmed; tracker estimate, no company notice yet). **`profiler-refresh-notes.json`** — a source and a `watch[]` list for each.
- **`tract.profile.json` v3 → v4** — the PUCN's decision on Fleet's 362 MW of temporary gas plants, which the dossier carried as scheduled for 8 September 2026 in six places, is now the conditional approval of 17 September 2026; the Morris ComEd TSA's acceptance date corrected from "April 2026" (Tract's announcement) to 10 March 2026 (ER26-3100) in four places; two developments (the approval; Governor Lombardo's EO 2026-005) and four sources added; two relationships added — `berkshire-hathaway-energy` (NV Energy as the utility and litigant) and `exelon` (ComEd's TSA).
- **`powerhouse-data-centers.profile.json` v2 → v3** — FERC's 22 September 2026 rejection of ComEd's cancellation of the Joliet TSA, with the $1 letter-of-credit question left to the Northern District of Illinois, recorded in the technical specs, policy exposure, financial commentary and the indicator-to-watch it resolves; two developments and three sources added; an `exelon` relationship added.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the two F-U2 rows rewritten with a premise verdict per clause, `Checked 2026-09-26, v07.58r`, Dossier v1, Guide v2. The identity findings the prompt asked for:
  - **BHE:** 100% Berkshire — held. The ">9 GW contracted (Mar 2026)" clause — **superseded**: the March 2026 presentation says approximately 11,000 MW; 9 GW is the FY2024 figure. The Tract approval date refined from ~19 to 17 September; the lawsuit date held (Friday 24 July). PacifiCorp's Washington sale held ($1.9B, agreement 15 February 2026, close H1 2027). Nothing else was found to be for sale.
  - **Exelon:** independent; no re-merger reporting found. The "25 GW vs 36 GW" conflict resolved as definitional (36 GW is the refined queue of 4 + 7 + 25; 25 GW is the under-study rung). Rider DE, the PowerHouse sequence, the ACE battery and the $41.7B plan all held. Stated but unreconciled: TSA-backed load fell from ~8 GW (45% of 18) to 4 GW between Q4 2025 and Q2 2026 while collateral stayed at ~$1B — the decks were unreadable.
- **README.md** — tree entries for the two profile/study pairs, the two study-prep directories and the two archived dossiers.
- **`SESSION-CONTEXT.md`** — Latest Session written for the hand-off (Phase F waves 1 and 2 complete; the stale Classroom lessons; the remaining Phase F sessions).

### Notes

- **Step-7 reconciliation** — BHE: 20 dossiers matched by alias, 13 substantive claims read, 1 dossier changed (`tract`); the MasTec dossier's "$4.2B Greenlink West program" against BHE's $4.2B for Greenlink West and North combined is stated in the relationship context, not reconciled. Exelon: 19 dossiers matched, 12 claims read, 1 dossier changed (`powerhouse-data-centers`), with the Tract Morris date folded into the tract revision; the Compass dossier's mid-2026 Hoffman Estates energization target is stated against the July 2026 rezoning withdrawal, not reconciled. The `powerhouse` dossier's "TSA accepted 11 March" (Utility Dive's publication date) against the order date of 10 March is left as is.
- **Classroom lessons now stale, by design — hand-off item:** `landscape-utilities-2026-09` was built on "six franchises" and there are now eleven `utility` dossiers; the three `scenario-utilities-*` rehearsals cite it. `Classroom.gs` was not edited in either wave — a Profiler session never touches it. A Classroom session should re-pin the landscape and the three scenarios against the five new dossiers.
- **Checkers:** `sync-profiler-registry.py --check` clean (182 in bijection); `check-profiler-study.py` 0 errors after the three concept drops; `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates (exit 0; 32 over-cap scopes not examined, as before); `check-readme-tree.py` 0 findings; `check-profiler-reports.py` the same two pre-existing warnings (`jinko` v6 vs pinned v5; `oracle` v5 vs pinned v4), read and left loud.
- **Playwright:** both new dossiers and guides, and the revised `tract` and `powerhouse-data-centers` dossiers, render on `Profiler.html` with zero console errors and zero unresolved `{{}}` terms; the only page error is the auth-wall's `gis_load_failed`, as in wave 1. `Profiler.html` is unchanged (data-only), so no page version bump.
- **Archive rotation not performed:** 110 sections, of which twelve are dated today (EST) and exempt, leaving 98 non-exempt against a trigger of 100. This push is dated 2026-09-25 EST, so the "first push dated 2026-09-26" rotation the prompt anticipated did not fall due; the next push after midnight EST must rotate the 2026-09-18 and 2026-09-19 date groups (26 sections) — `git fetch --unshallow` first.

## [v07.57r] — 2026-09-25 10:13:13 PM EST

> **Prompt:** "Picking up from my last session, run Phase F sessions F-U1 and F-U2 of
> repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: Duke Energy, DTE Energy and WEC
> Energy (F-U1), then Berkshire Hathaway Energy (NV Energy) and Exelon (F-U2).
>
> READ FIRST: repository-information/SESSION-CONTEXT.md; PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the
> five F-U1/F-U2 rows of §11.3 are yours); .claude/rules/profiler-app.md (Profiler Command including step
> 1a identity and step 7 reconciliation, Profiler Prep Command, Scheduled Refreshes);
> repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments registry, Refresh calendar);
> repository-information/PROFILER-STYLES.md (active style intel-briefing). Read the dominion-energy,
> southern-company and aep dossiers and study guides as the house pattern for a utility.
>
> TWO WAVES, TWO PUSHES — I am explicitly asking for two separate push commits:
> - Wave 1: Duke Energy, DTE Energy, WEC Energy -> commit and push.
> - Wave 2: Berkshire Hathaway Energy, Exelon -> commit and push once wave 1's branch has merged
>   (Pre-Push #5 push-once).
> If the session runs short, stop cleanly after wave 1 and hand wave 2 back to me as a prompt.
>
> THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
> profileVersion 1, categories ["utility"]) and study guide (schema v2) with its lesson plan under
> repository-information/study-prep/<slug>/. Populate aka[] BEFORE the step-7 grep (operating utilities
> and former names: ComEd, Commonwealth Edison, PECO, BGE, Pepco, Delmarva, Atlantic City Electric; NV
> Energy, Nevada Power, Sierra Pacific, PacifiCorp, MidAmerican; Duke Energy Carolinas / Progress /
> Florida / Indiana / Ohio, Piedmont; DTE Electric; We Energies, Wisconsin Public Service). Assign segments
> in live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: `utilities` ·
> incumbent; `storage-developers-and-ipps` · adjacent only where utility-owned storage is material in the
> dossier). Then the registry sync, the graph build, a dated calendar row per company (all five file with
> the SEC — research each Q3 2026 earnings date), README tree entries, and rewrite and flip your §11.3 rows.
>
> IDENTITY (step 1a) — check at least: Brookfield's 19.7% Duke Energy Florida stake (first closing not
> confirmed); BHE is 100% Berkshire and PacifiCorp is selling its Washington operations to Portland
> General (close 2027); nothing known for DTE, WEC or Exelon — verify anyway. Proposed slugs: duke-energy,
> dte-energy, wec-energy, berkshire-hathaway-energy, exelon. Decide BHE's display name under Naming and
> renames; the precedent for a holding company taught through its lead utility is Southern Company.
>
> THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
> budget ran out partway, and nobody has read the underlying articles. Verify every figure against
> first-party sources (10-K and 10-Q, the Q2 2026 decks, state PUC dockets, and EEI's "Large Load Projects
> and Tariffs" list updated 11 Sep 2026), record a premise verdict per clause, and rewrite the cells.
>
> RECONCILIATION (step 7) — expected inbound: Exelon/ComEd ~19 dossiers, NV Energy/BHE/PacifiCorp ~18,
> Duke ~10, DTE ~9, WEC ~4. Known drift candidates, all agent-reported and unread:
> - powerhouse-data-centers says ComEd's Joliet TSA was lost in July; Utility Dive reported FERC rejected
>   ComEd's cancellation notice on 22 Sep 2026, leaving the dispute in federal court.
> - tract carries NV Energy's July lawsuit and a pending PUCN gas-plant decision; the PUCN reportedly
>   approved the two plants conditionally around 19 Sep 2026.
> - lg-energy-solution carries the DTE 6 GWh LGES Vertech deal — check that both sides agree.
> - DTE's Saline-linked storage is 1.4 GW in one source and 332 MW in the MPSC approval; state both unless
>   a source reconciles them.
> If BHE's or Exelon's reconciliation outgrows the session, say so and defer it per step 7's scope note.
>
> DO NOT edit googleAppsScripts/Classroom/Classroom.gs. Five new utilities make landscape-utilities-2026-09
> (built on "six franchises") and the three scenario-utilities-* rehearsals stale; record that in the
> CHANGELOG entry and the SESSION-CONTEXT hand-off instead (§11.2, the landscape coupling).
>
> CHANGELOG: the first push dated 2026-09-26 or later must rotate. Run `git fetch --unshallow origin main`
> first, then move the oldest whole date groups with SHA enrichment until fewer than 100 non-exempt
> sections remain.
>
> VERIFY per wave: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check
> clean; build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
> check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
> warnings read; every new dossier and guide renders (Playwright) with zero page errors. If the Fable weekly
> cap binds, continue on Opus 5.5 xhigh and record the substitution in the §11.3 Model cell. Normal
> Pre-Commit and Pre-Push checklists; push on a claude/* branch."

**Phase F, wave 1 (F-U1) — Duke Energy, DTE Energy and WEC Energy Group** join the Profiler corpus as the seventh, eighth and ninth `utility` dossiers, each with a v2 study guide and a lesson plan. Wave 2 (F-U2, Berkshire Hathaway Energy and Exelon) is researched but not authored — it follows in the next push once this branch has merged, exactly as the prompt asked for two pushes.

### Added

- **Three schema v7 dossiers** (`profileVersion` 1, `categories: ["utility"]`, intel-briefing style), each researched by two parallel subagents under a shared two-stage protocol (first-party filings and decks, then dockets and trade press). The SEC's own host refused the sandbox, so every filing was read from the company's investor mirror.
  - **`duke-energy.profile.json`** — 116 sources (51% first-party), 37 developments, 8 products, 13 relationships, 7 decision makers. No photos: `duke-energy.com` returns 403 to the sandbox. `aka[]`: Duke Energy Carolinas, Duke Energy Progress, Duke Energy Florida, Duke Energy Indiana, Duke Energy Ohio, Duke Energy Kentucky, Piedmont Natural Gas.
  - **`dte-energy.profile.json`** — 106 sources, 29 developments, 5 products, 9 relationships; four executive photos (Harris, Ruud, Lauer, Tomina — Paul's download failed twice on a 502, so the entry carries none). `aka[]`: DTE Electric, DTE Gas, Detroit Edison, DTE Vantage.
  - **`wec-energy.profile.json`** — 80 sources, 32 developments, 7 products, 12 relationships; five photos (Lauber, Liu, Hooper, Krueger, Garvin). `aka[]`: We Energies, Wisconsin Electric, Wisconsin Public Service, WPS, Peoples Gas, North Shore Gas, Wisconsin Gas, Michigan Gas Utilities, Minnesota Energy Resources, Bluewater, Upper Michigan Energy Resources.
- **Three schema v2 study guides** — `duke-energy.study.json` (16 sections), `dte-energy.study.json` (14), `wec-energy.study.json` (13) — each with flashcards and a self-test, and **three lesson plans** under `repository-information/study-prep/<slug>/`, five modules each, at the high-school-STEM baseline.
- **13 new concepts** in `profiler-concepts.json` (1,490 total): `special-contract`, `contested-case`, `ex-parte`, `zonal-resource-credit`, `bespoke-resource`, `minimum-transmission-charge`, `certificate-of-necessity` (the `CON` alias was dropped — it already belongs to `certificate-of-need`), `subsequent-license-renewal`, `letter-agreement`, `compressed-air-energy-storage`, `nuclear-ptc`, `equity-units`, `atm-program`.
- **Nine executive photos** under `live-site-pages/images/execs/` (`dte-energy-*`, `wec-energy-*`), company-published.

### Changed

- **`profiler-companies.json`** — 177 → 180 entries, with taglines, `aka[]` and `domains[]` populated before the step-7 grep.
- **`profiler-segments.json`** — all three assigned `utilities` · incumbent, and `storage-developers-and-ipps` · adjacent with a basis line each (Duke ~4.5 GW of utility-owned batteries by 2031; DTE 1,383 MW customer-funded storage; WEC 2,130 MW bought build-transfer from Invenergy).
- **`profiler-graph.json`** — rebuilt, 1,523 edges.
- **`profiler-refresh-calendar.json`** — three dated rows, each researched: `duke-energy` 2026-11-05 (unconfirmed, pattern), `dte-energy` 2026-10-22 (unconfirmed, pattern), `wec-energy` 2026-10-29 (confirmed). **`profiler-refresh-notes.json`** — a source and a `watch[]` list per slug.
- **`PROFILER-COVERAGE-PLAN.md` §11.3** — the three F-U1 rows rewritten from hypotheses into verified cells with a premise verdict per clause, `Checked 2026-09-26, v07.57r`, Dossier v1, Guide v2. The identity findings the prompt asked for:
  - **Brookfield / Duke Energy Florida — the plan cell was wrong.** The first closing is confirmed: 2026-03-03, 9.2% for $2.8B (8-K), toward 19.7%. Piedmont's Tennessee operations were sold to Spire (closed 2026-03-31).
  - **DTE** — no stake or sale found; the Google Van Buren contract (U-22058) had no MPSC decision through 2026-09-25. The Saline storage figure is stated both ways in the dossier: 1,383 MW approved for the Oracle load, against the 332 MW the earlier corpus carried.
  - **WEC** — no stake or sale found; the VLC docket is `6630-TE-113`, not `5-UR-110`; Meta Beaver Dam is Alliant's load, not WEC's.
- **README.md** — tree entries for the three profile/study pairs and the three study-prep directories.

### Notes

- **Step-7 reconciliation** — inbound claims read against the new dossiers: Duke 8 (0 changed), DTE 6 (0 changed; the Oracle dossier's "~$300M" against DTE's "nearly $2B" is stated in the relationship context, not reconciled), WEC 4 (0 changed). No other dossier was edited, so no archive step ran. The `lg-energy-solution` DTE claim (1.5 GW / 6 GWh, $1.6B) agrees on both sides.
- **Classroom lessons now stale, by design:** `landscape-utilities-2026-09` was built on "six franchises" and there are now nine; the three `scenario-utilities-*` rehearsals cite it. `Classroom.gs` was not edited — a Profiler session never touches it — so those lessons are due for a re-pin in a Classroom session, and the SESSION-CONTEXT hand-off will say so once wave 2 lands.
- **Checkers:** `sync-profiler-registry.py --check` clean (roster ↔ calendar bijection holds); `check-profiler-study.py` 0 errors; `check-profiler-relationships.py` 0 findings; `check-profiler-crossrefs.py` 0 candidates; `check-readme-tree.py` 0 findings; `check-profiler-reports.py` reports two pre-existing warnings (`jinko` v6 against pinned v5, `oracle` v5 against pinned v4), read and left loud.
- **Playwright:** all three dossiers and guides render on `Profiler.html` with zero console errors and zero unresolved `{{}}` terms; the only page error is the auth-wall's `gis_load_failed`, the Google Identity script the sandbox cannot fetch. `Profiler.html` itself is unchanged (data-only), so no page version bump.
- **Archive rotation not performed:** 109 sections, of which eleven are dated today (EST) and exempt, leaving 98 non-exempt against a trigger of 100. The wave-2 push will cross midnight EST and must rotate — the 2026-09-18 and 2026-09-19 date groups (26 sections) are the ones that go.

## [v07.56r] — 2026-09-25 08:38:39 PM EST

> **Prompt:** "I approve of adding all companies you recommended above. Give me a prompt to paste into a new Opus 5.5 or Fable 5.1 Medium, High, or Xhigh session to run the five utility-batch companies."

Recorded the developer's approval of the 2026-09-25 thin-category recommendation as **Phase F** of the Profiler coverage plan, and wrote the paste-in prompt for its first session. No dossier was written.

The recommendation came from the previous turn's research, which committed nothing:
- a word-bounded, alias-aware mention count of ~300 uncovered names across every dossier, study guide, report and `Classroom.gs`;
- four parallel web-research subagents that re-checked each candidate's identity against sources from the last twelve months. All four exhausted the session's 200-call search budget partway through.

### Added

- **`PROFILER-COVERAGE-PLAN.md` §11 — Phase F, the thin-category fill.** 37 companies in 13 sessions; the categories stood at investor 5 · utility 6 · neocloud 7 · gc 7 · advisor 8 · hyperscaler 8 of 177.
  - **§11.1 — how the list was chosen:** corpus pull, buying authority, seat fit and identity. It also lists the excluded candidates with a reason each, so they are not re-proposed: passive investors, the banks, DigitalBridge, PG&E/SCE/Sempra/CenterPoint/FirstEnergy, tenant neoclouds, and Clean Energy Associates, already covered inside `intertek`.
  - **ERCOT and PJM are held for a developer decision.** They are the two most-cited uncovered entities (73 and 37 dossiers), but they are grid operators, and adding them would mean first using the `other` category.
  - **§11.2 — sessions, order and model under the §2 rule:** utilities first, because `utilities` is the only segment in both sales seats. F-N1 is timed to the 10/1 neoclouds pass and F-H1 before the 10/7 Megmeet start. It also records the landscape coupling: new members make `landscape-utilities-2026-09`, `landscape-capital-2026-09` and `landscape-neoclouds-2026-09` stale, and a Profiler session never edits `Classroom.gs`.
  - **§11.3 — the ledger:** one row per company, with proposed slug, categories, segment-role hypothesis, model, and inbound-dossier count. The `Why` cells are marked unverified prompt material, as in §5 and §8.
  - **§11.4 — the paste-in prompt for F-U1 + F-U2:** Duke Energy, DTE Energy, WEC Energy, then Berkshire Hathaway Energy (NV Energy) and Exelon.
    - It runs as two explicitly requested pushes, on Fable 5.1 High, with Opus 5.5 xhigh as the recorded substitution.
    - It names the known drift candidates for step-7 reconciliation, and warns that the first push dated 2026-09-26 must rotate the CHANGELOG.
- **Plan intro:** now points at §11.

## [v07.55r] — 2026-09-25 07:44:52 PM EST

> **Prompt:** "I set the discovery cron in my local terminal. See attached screenshot for the run report. Let me know if this action #12R is closed or not; If not, recommend the next action. If 12R is complete, also confirm if I am completely done with all Phase A tasks."

Closed phase R (#12R). The discovery Routine exists with the repository attached, its quarterly cron is set, and its first run stood down with a full report.

### Changed

- **`NETWORK-EVENTS-DESIGN-PLAN.md` §11, R row** — now **Done**. It records:
  - the Routine as built: "Claude HQ · Sales", Sonnet 5, no connectors;
  - the cron, `CRON_TZ=America/New_York 50 8 8 3,6,9,12 *`, set with `/schedule update` in a local terminal; next fire Tue 2026-12-08;
  - the first run, a STAND-DOWN with 0 candidates and no commit, which §8 accepts;
  - its near-misses: non-US/CA sub-mega shows, and organiser pages the sandbox could not read.
- **`ROUTINES-OPERATIONS.md` → "Events discovery — quarterly"**:
  - heading changed to "live since 2026-09-25";
  - **corrected** the schedule step: the cron is set with `/schedule update` locally, not `update_trigger`;
  - new settled finding, with the verbatim refusal: an agent cannot change a UI-created Routine, schedule included, because agents can only update Routines they created;
  - an "as built" record of the trigger and its first run.

### Notes

- Phase A (#8 report refresh, #12R) is complete.
- **Archive rotation not performed:** 107 sections in total, of which nine are dated today and exempt, leaving 98 non-exempt against a trigger of 100.

## [v07.54r] — 2026-09-25 07:20:11 PM EST

> **Prompt:** "Run action #12R — draft the discovery Routine's prompt and give me step-by-step instructions to create it in the claude.ai UI (R in repository-information/NETWORK-EVENTS-DESIGN-PLAN.md).
> Read first, in this order:
>
> 1. repository-information/SESSION-CONTEXT.md → Latest Session.
> 2. `NETWORK-EVENTS-DESIGN-PLAN.md`: §5.3's Discovery Routine bullet, the R rows in §8 and §11, and the note headed "R — the developer." Its blocker, Monday's earnings-desk proof, is cleared: the desk landed the first Routine commit on 9/22 (v07.16r).
> 3. repository-information/ROUTINES-OPERATIONS.md:
>    * the current STEP 0 text — copy it verbatim, not from memory;
>    * the settled findings that a fired session can push only when the repository is attached on the "New routine" form, and that a Routine's repository cannot be edited afterwards;
>    * the 2026-09-21 model evaluation;
>    * the prompts under "The rebuild prompts", as the shape to follow.
> 4. .claude/rules/events-app.md (the Events Sync command and its never-list); repository-information/EVENTS-SCHEMA.md (the registry, the roster and the `Proposed` shape); and live-site-pages/events-data/events.json and `events-sources.json`.
>
> Settle these before drafting, and give me each answer with its reason:
>
> * Where proposals go. A fired session cannot write the Events spreadsheet's `Proposed` tab, and it must never call the deployed app or widen a peer token. Decide the repo-side queue a run writes candidates to (§8's "calendar-file-as-queue"), and how `events sync` or I promote a candidate out of it. If that file or its schema doesn't exist, create it in this session and make scripts/check-events-registry.py (or a sibling checker) validate it.
> * What counts as a candidate: the source classes; the relevance bar against the segments and the dossier corpus; dedup against `events.json`; a per-run cap; and the stand-down rule (a quiet run commits nothing and reports why).
> * Cadence and model: quarterly, with the cron written in `CRON_TZ=America/New_York` and a jittered minute. Give me the first fire date and recommend a model with the reason.
> * Budget: list my existing Routines and say whether one more fits before the #12Q quota review (~10/21).
>
> Deliverables:
>
> 1. The complete Routine prompt in one copyable block: STEP 0 verbatim, then identity, the queue, the cap, the stand-down rule and the report shape.
> 2. That prompt saved as a new subsection under "The rebuild prompts" in `ROUTINES-OPERATIONS.md`, so it can be recreated. Mark the plan's R row "prompt written — awaiting UI creation", add a CHANGELOG entry, and commit and push under the normal checklists.
> 3. Numbered, click-by-click steps for claude.ai's "New routine" form: name, prompt, repository picker (confirm the Runs with card shows `LightAISolutions/Sales` before saving), environment, model, schedule, connectors (none unless the prompt needs one), notifications, then one Run now. Check the live docs with `read_documentation` rather than memory.
> 4. What a good first run looks like (§8: it proposes at least one event and commits, or stands down with a report), and how I verify it: the session report, a commit on `main`, and the queue file.
>
> Do not create the Routine yourself. `create_trigger` cannot attach a repository, and a Routine without one cannot push.
> Done when: the prompt is committed in `ROUTINES-OPERATIONS.md`, the push has merged, and I have the UI steps."

Wrote phase R's discovery Routine prompt and built the repo-side queue it proposes into. The Routine itself is not created: that happens in the claude.ai UI, where the repository can be attached.

### Added

- **`repository-information/events-discovery-queue.json`** — the discovery queue, following the `profiler-refresh-calendar.json` "calendar-file-as-queue" pattern (§8). It starts empty. It lives outside `live-site-pages/` so that unverified candidates never deploy.
- **`EVENTS-SCHEMA.md` §7.1** — the queue's shape (`slug`, `status` pending/approved/rejected/applied, `sourceClass`, `event`, `sourceKey` plus an optional probed `rosterRow`, `evidence[]`, `corpus[]`, `why`, the decision fields), the candidate bar, and promotion.
- **`scripts/check-events-registry.py` → `check_queue()`** — validates the queue whenever the file exists:
  - slug rule and uniqueness;
  - no pending, approved or rejected candidate duplicates a registry slug, or a registry series and year;
  - an applied candidate's slug is in the registry, and it carries `appliedIn`;
  - no pending candidate starts before its `proposedAt`;
  - enums, timezone, ISO country, 1–5 relevance, segment ids and dossier slugs;
  - the roster link (an existing key, or a full probed `rosterRow`), and never `10times-listings`;
  - at least one evidence URL on the organiser's own site, and no LinkedIn, 10times or Google News host.
  - Fixture-tested: one well-formed candidate, and one candidate violating eight rules, which produced eight findings. It also caught a real duplicate (CLEANPOWER 2027 is already registered).
- **`.claude/rules/events-app.md` → "The discovery run (R) and `events sync discovery`"**:
  - **The run:** five source classes in order (corpus mention, roster organiser, covered company, trade body, grid operator/regulator). The organiser page must be read in the run. It applies the bar, writes candidates, gates on the checker, commits only when at least one candidate was written, and otherwise stands down.
  - **Promotion:** the developer names approvals and rejections. The session re-reads the organiser page and re-probes any new roster row, then appends the event by the `new-event` rule as `tentative`. It stamps the candidate `applied` and gates on the checker.
  - The file's `paths:` now include the queue.
- **`ROUTINES-OPERATIONS.md` → "Events discovery — quarterly"**, under "The rebuild prompts":
  - the full prompt: STEP 0 copied verbatim from the desk's prompt (checked byte-identical), then identity, the queue, the never-list, a cap of five, the gate, the commit rule, the stand-down and the report shape;
  - the creation settings: name, repository, environment, default model (Sonnet 5), no connectors, and the schedule `CRON_TZ=America/New_York 50 8 8 3,6,9,12 *` (first scheduled fire Tue 2026-12-08, after a Run now at creation).

### Changed

- **`NETWORK-EVENTS-DESIGN-PLAN.md`:**
  - §11's R row now reads "Prompt written — awaiting UI creation".
  - §5.3's Discovery Routine bullet is amended: the Routine reads the repo queue, not the `Proposed` tab.
  - The "R — the developer" note records that the blocker cleared at v07.16r.
- **`EVENTS-SCHEMA.md` §7 and §12** — point to §7.1.
- **`CLAUDE.md`, Events Sync Command** — names `events sync discovery`.
- **`README.md`** — tree entry for the queue file.

### Notes

- `check-events-registry.py` exits 0: 102 events, 58 roster rows, 0 queue candidates.
- **Archive rotation not performed:** 106 sections in total, of which eight are dated today and exempt, leaving 98 non-exempt against a trigger of 100.

## [v07.53r] — 2026-09-25 07:06:03 PM EST

> **Prompt:** "Remind me to re-run this report after Megmeet's Q3'26 report (due by 10/31). Refresh the Megmeet dossier first. Zhonhen and Sinexcel report by the same deadline. 
>
> Add power-electronics to scope now unless you have a good reason to wait. If you do, explain the reason to me."

Added `power-electronics` to the AIDC power-conversion report's scope as a same-day second edition. The developer's reminder for the post-Q3 re-run was recorded.

### Added

- **`live-site-pages/profiler-data/reports/aidc-power-conversion-rev2--competitive--2026-09-25.report.json`** — supersedes `aidc-power-conversion--competitive--2026-09-25`, which was published earlier the same day. Reports are immutable, so a scope change needs a new edition; the `-rev2` topic suffix follows the 9/23 SST precedent. The scope grows from 15 to 16 vendors and the citations from 60 to 66, with six new ones copied verbatim from the `power-electronics` v1 `sources[]`:
  - **New Layer 3 row, Power Electronics.** AIPCS takes medium-voltage AC to an 800 VDC bus in one enclosure: up to 3,820 kVA, 98.00% maximum including the MV transformer. It is transformer-based, so it is a TRU-now product rather than an SST. No AIPCS order, customer or input voltage class is published. About 70% of FY2025 revenue comes from the US, and a Houston plant launches production in 2026.
  - **Scale chart:** adds Power Electronics at USD 1,468M, verified against its KPI overlay.
  - **FCC paragraph amended:** the carried "reaches no covered rack-power vendor" line now adds that the newly scoped vendor *is* reached. Its dossier records that its Spanish-built, SCADA-commanded storage inverters are covered, and says nothing about AIPCS.
  - **Megmeet first-week section:** names Power Electronics as the US-footprint comparison a buyer will reach for at the hall edge.
  - **Scope, coverage, gaps, limitations and cross-reference note updated.** Mitsubishi Electric stays a named candidate for the next edition.
- **`repository-information/REMINDERS.md`** — new active reminder: re-run the report once Megmeet's Q3 2026 report is filed (due by Saturday 2026-10-31), refreshing the Megmeet dossier first. Zhonhen and Sinexcel report by the same deadline.

### Changed

- **`reports/reports-index.json`** — rev2 added as `current`; the morning 2026-09-25 edition flipped to `superseded`.
- **`README.md`** — tree entry for rev2, and the morning edition's line now reads superseded.

### Notes

- **`check-profiler-reports.py`:** 0 errors, and no warning on the new edition. The two remaining warnings are the out-of-scope aged 9/8 BESS reports.
- **Archive rotation not performed:** 105 total, of which seven are dated today and exempt, leaving 98 non-exempt against a trigger of 100.

## [v07.52r] — 2026-09-25 06:56:02 PM EST

> **Prompt:** "profiler report competitive: AIDC power conversion — refresh the 2026-09-08 edition against current dossiers (Priority 2 item #8).
>
> Context:
> - The current edition is `live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-08.report.json` ("AIDC Power Conversion — The 800 VDC Race"). `python3 scripts/check-profiler-reports.py` warns that it has aged: it pins megmeet v7, delta-electronics v5 and liteon v6, and those dossiers are now v8, v6 and v7 (all refreshed 2026-09-23). It turns "aging" on 2026-10-23 and no Routine watches it.
> - This is a re-run of a prior topic, not an edit. Reports are immutable, so write a new edition `aidc-power-conversion--competitive--<today>.report.json` with `supersedes` set to the 9/8 edition's id, and flip the old entry in `reports-index.json` to `superseded`. Follow the Profiler report command in `.claude/rules/profiler-app.md`.
> - Keep the 9/8 edition's company scope. If the preflight coverage table shows a covered company that belongs in this race but is missing, propose it in the preflight rather than widening silently.
> - Synthesize from covered dossiers only and cite their sources with provenance tiers. Do not re-research. If a dossier is stale for this report's purpose, record that in `limitations` rather than refreshing it in this session.
> - Read the two 2026-09-23 SST reports (`sst-hall-edge-block--competitive--2026-09-23` and `sst-hall-edge-block-rev2--competitive--2026-09-23`) and keep this report consistent with them where they overlap (Megmeet's position). Cross-reference them; don't duplicate them.
> - Audience: I start at Megmeet on Wednesday 2026-10-07. Write the BLUF and key judgments so they are usable in my first week.
> - Show me the preflight (type, scope, coverage table with freshness tiers), then proceed without waiting unless the scope is ambiguous.
> - Out of scope: the other two aged 9/8 reports (grid-scale-bess: Jinko v5→v6; named-project-bess-attach: Oracle v4→v5). Mention them only if the refresh changes something they depend on.
> - Heads-up for the push: `repository-information/CHANGELOG.md` sat at `Sections: 103/100` on 9/25 with 5 sections dated that day. From 9/26 onward none are exempt, so archive rotation will be due on this push (the oldest date groups, with SHA enrichment, after deepening the clone).
>
> Done when: the new edition is registered, `python3 scripts/check-profiler-reports.py` reports no warning for it, and the push has merged."

Generated the AIDC power-conversion competitive report, 2026-09-25 edition (`aidc-power-conversion--competitive--2026-09-25`), superseding the 9/8 edition. The scope stays at the same 15 vendors across four layers. Coverage is re-pinned to Megmeet v8, Delta Electronics v6 and LITEON v7; the other twelve pins are unchanged.

### Added

- **`live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-25.report.json`** — 10 key judgments, 9 sections, 9 indicators, 60 citations (31 carried from the 9/8 edition, 29 new, all copied verbatim from dossier `sources[]`). What moved:
  - **The rack order is now sourced rather than contested:** Delta, then LITEON, then Megmeet as a qualified third source. The evidence is Megmeet's own account of being late on GB200 and winning GB300 batch orders, Soochow's third-source call, TrendForce naming Delta and LITEON as the leaders, and the rumour origin of the "#2" story.
  - **Megmeet's SST is dated on its own word.** It is in pre-research, has no disclosed input class, and the company expects no volume sales for two to three years.
  - **A correction to the 9/8 reading of Sungrow:** its dossier, unchanged at v9, carries a curve of small-batch trials through 2026, batch orders from 2027 and scale from 2028, which the 9/8 edition did not report. The "shipping" wording is replaced by "productised, not yet volume".
  - **New `megmeet-first-week` section (analysis):** membership versus rank; what the H1 filing measures; how to place the SST; what the Q3 report must show against the RMB 787M consensus; the Richardson versus HKEX-proof footprint question.
  - **New `sst-crossref` section:** points to `sst-hall-edge-block-rev2--competitive--2026-09-23` for the class-by-class hall-edge comparison. It is consistent with that report on Megmeet (rack and sidecar, third source, undisclosed SST class) and does not re-score its venture SST set.
  - **Limitations corrected:** the 9/8 edition said `mitsubishi-electric` and `power-electronics` carried no dossiers. Both were covered before it was written (from 9/4 and 9/6), and Power Electronics' AIPCS is a medium-voltage-to-800 V DC unit. Both are named as next-edition scope candidates rather than added.
  - **Admin-lens overlays** on `nvidia-800vdc-2026-08` (`options`, `trusst`, `suppliers`) carried forward and updated for the third-source and Sungrow-curve findings.

### Changed

- **`reports/reports-index.json`** — the new edition was added as `current` with `overlayModules`; `aidc-power-conversion--competitive--2026-09-08` flipped to `superseded`.
- **`README.md`** — the tree gains the new report. The 9/8 edition's line now reads superseded, and the 23 September morning SST edition's line, which still said "current edition", now reads superseded by its rev2.

### Notes

- **`check-profiler-reports.py`:** 0 errors, and no warnings on the new edition. The two remaining warnings are the out-of-scope aged 9/8 BESS reports (Jinko, Oracle); nothing in this refresh touches what they depend on.
- **Archive rotation not performed.** This push is dated 25 September, so today's six sections are exempt: 104 total, 98 non-exempt against a trigger of 100. The first push dated 26 September or later will rotate the 2026-09-18 group (8 sections).

## [v07.51r] — 2026-09-25 06:39:32 PM EST

> **Prompt:** "See attached screenshot for action #11 (Scraper's Project History). Is this closed now? If not, what do I need to do? Regarding action #9b, I approve your recommendation of exhibitor-only signals. Implement it. Give me a prompt to paste into a new Opus 5.5 High session to run action #8 - Refresh the power conversion report, then remember session."

### Changed

#### `Events.gs` (v01.10g)

- **Exhibitor-only signals for widget-served speaker rosters (the developer's #9b decision).** Some registry rows' `speakersUrl` serves its roster through a third-party widget (RE+ 2026: a Swapcard iframe), which every sweep parsed as `no_roster_found`. A row may now carry `speakersWidget` (`swapcard` · `cvent` · `bizzabo` · `grip`). When it does, `evSweepEvent_` never fetches the roster page, reports `speakers:{ skipped:'widget_roster', widget }` and leaves the page out of `pages`. The exhibitor gallery, agenda and newswire legs are unchanged, `speakersUrl` stays on the row as the sheet's Speakers link, and key speakers still come in through the sheet's manual signal form. The Swapcard API was declined.

#### Registry

- **`events.json`:** `re-plus-2026` carries `"speakersWidget": "swapcard"`, and its `lastUpdated` moves to 2026-09-25.
- **`events.ics`:** rebuilt by `scripts/build-events-ics.py`. RE+'s `LAST-MODIFIED` advances, and every `DTSTAMP` takes the build time as the builder always stamps it. `--check` is OK.

#### Checkers and schema

- **`scripts/check-events-registry.py`:** `speakersWidget` must be one of the four widgets, and only on a row with a `speakersUrl` (`SPEAKERS_WIDGETS`). Exit 0.
- **`scripts/check-events-signals.js`:** the RE+ fixture carries the flag. The RE+ line reads `widget_roster` with the roster URL never fetched, and the pages count drops from 7 to 6. All checks pass.
- **`repository-information/EVENTS-SCHEMA.md`:** the `speakersWidget` row in the §3 field table, and the sweep's roster sentence.

### Notes

- **#11 (Scraper Apps Script versions):** the developer's Project History screenshot shows Version 167 current (22 Sep, the v07.21r deploy); `Scraper.gs` has not changed since. That leaves 13 versions to the 180 cleanup line and 33 to the 200 cap. No cleanup is due, and the count moves only when a push changes `Scraper.gs`.

## [v07.50r] — 2026-09-25 05:49:20 PM EST

> **Prompt:** "6.2 done - everything worked as intended. However, I want to have the ability to delete field notes in Profiler."

### Added

#### `Profiler.html` (v01.92w)

- **🗑 Delete on every note in the ⚙ → Field notes log.** The log (`ovPaintNotes`) offered Copy, Summarize and Recording but no Delete. The only delete was in a dossier's "Add a Field Note" → "Manage existing notes" list, which a `general` note, with no dossier to open, could never reach; that includes notes promoted from Network for an uncovered account. The new button confirms (naming an attached file when there is one), calls the existing `nop=delete` (`deleteFieldNote`: the same owner gate as `list`, the note removed from the Drive log and its attachment trashed, the audit carrying the id only), then drops the row locally and repaints, resetting the company filter to All when the filtered company has no notes left. A failure shows `✕ <error>` on the button and restores it. No backend change.
  - **Verified headless** against a stubbed backend: three notes, three Delete buttons; one delete sends one `nop=delete` with the note's id and leaves two rows.

### Changed

- **`Profilerhtml.changelog.md` archive rotation.** This push took it to 51 sections, 50 of them non-exempt (the 50-section page trigger). The oldest date group, `v01.42w` (2026-08-24, a single section), moved to `Profilerhtml.changelog-archive.md` with its commit link (`v02.93r` → `6a3d0b3`), leaving it at `Sections: 50/50` with 49 non-exempt.

## [v07.49r] — 2026-09-25 06:08:32 AM EST

> **Prompt:** "add the learned-text box to Promote"

### Added

#### `Network.html` (v01.25w)

- **A required "What did you learn?" box in the ⇈ Promote box.** It is a textarea of up to 3,000 characters (`NW_PROMOTE_LEARNED_MAX`), focused when the box opens, and it comes before the confidence field. The page collapses whitespace, refuses an empty or over-long entry before any request, and sends the text as `learned` on `nop=promote`. The box goes read-only once promoted.
  - **Why:** Network has no free-text touch. Every History row's summary is machine-written ("Card scanned", "Meeting at …"), so a promotion sent Profiler's intake the fact of a touch and never the intel.

#### `Network.gs` (v01.18g)

- **`nop=promote` takes `learned`.** It is required, whitespace-collapsed and at most 3,000 characters; the new refusals are `learned_required` and `learned_too_long` (with `max`), both raised before any call.
  - **`nwPromoteText_`** now opens the note with the learned text, then ` — Context: ` and the unchanged context paragraph (kind, person, account, day, summary, `[Network interaction <i- id> · evidence · event]`), still capped at 4,000.
  - **The recording `note` Interaction's Summary** gains `: <excerpt>`, the first 300 characters (`NW_PROMOTE_EXCERPT_MAX`, cut with …), so the intel is visible in Network's History too.
  - **The audit is unchanged:** ids and a flag only, never the text.

### Changed

- **`repository-information/NETWORK-SCHEMA.md`**: the `nop=promote` contract (the `learned` field, the note's order, the Summary excerpt, the two refusals) and the checker line (60 checks).
- **`scripts/check-network-brief.js`**: the learned text is required, bounded and leads the note, and its excerpt is in the Summary. 58 → 60 checks, all passing.
- **`scripts/verify-network-roles.py`**: the Promote pass refuses an empty box with nothing posted, then checks that the whitespace-collapsed text rides the post. Passes.

## [v07.48r] — 2026-09-25 05:59:25 AM EST

> **Prompt:** "6.4 - see attached screenshot. Mark held seems to have worked, but produced something garbled called "c-1fa85fymc4iaj". What is that. Fix it. 6.2 - What's the point of promoting a contact interaction into a field note in Profiler if I can't input any information to the field note?"

### Fixed

#### `Events.html` (v01.13w)

- **After Mark held / not held, the post-event meeting row showed the raw contact ID (`c-1fa85fymc4iaj`) in place of the name, and dropped the account.** `eop=posteventmark` returns `meetings` from `evPostMeetings_` without running `evPlanMeetingNames_`, which `eop=postevent` does. `evPostMark` replaced the cached list wholesale, and the renderer falls back to `contactId` when `contactName` is empty. `evPostMark` now carries `contactName` and `accountName` across from the list already on screen, matched by meeting id. That costs no extra Network reads per mark. Verified headless against a mocked backend whose mark answer has no names: the row reads "Austin York · Acme · … HELD".

## [v07.47r] — 2026-09-25 05:21:48 AM EST

> **Prompt:** "6.2: See attached screenshot. Step 4) Before or after pressing "Promote", I never had a "note" box to input notes in. 6.3: I confirm that booking a meeting works as intended. 6.4: I booked a meeting on ACP's first day (9/22), but it doesn't show up in the "After the show" section. After I refresh the page and reopen the ACP event -> Plan tab, it keeps saying it's counting the cards and stuff but never shows a result. 6.5: I have sucessfully added my Events calendar to my Google calendar and can see the events. I will check events sync later. 7.3: I see a green badge "weekly sweep installed" and the line below reads "Last swept 2026-09-23 * 11 events * 1 signal found * 1 written * 0 updated * 1 page failed." See attached screenshot."

### Fixed

#### `Events.html` (v01.12w)

- **The Plan tab's "After the show" close-out could stay on "Counting the cards…" forever.** The `eop=postevent` and `eop=plan` load callbacks repainted the Plan box they were started from, and did nothing if that box was gone. Two things rebuild the sheet while a load is in flight: returning to the tab (the `visibilitychange` → `evAfterWrite` → `evOpenSheet` path) and closing and reopening the event. Either one detached the box while the cached state still read `loading`, so the new box drew "Counting…" and never sent a request of its own. A new `evRepaintPlan(e)` repaints whichever `#ev-plan` box is on screen when the answer lands, provided the sheet is still on that event and the Plan tab is still selected. Reproduced and verified headless against a mocked backend: before the fix, a reopen during a 3-second load stayed on "Counting…" indefinitely; after it, the close-out fills in when the answer arrives.

## [v07.46r] — 2026-09-24 08:47:30 PM EST

> **Prompt:** "Per the attached screenshot and my open action items Priority 1 list, profiler Habitat Energy and profiler Gridmatic."

### Changed

- **Habitat Energy dossier refreshed to profileVersion 2; v1 archived.** The Quinbrook sale is unchanged: no buyer, bidder, signing, completion or withdrawal is on the record through 2026-09-24. New Project Media's 17 March report is still the only public source.
  - **FY2025 accounts not yet filed.** Neither Habitat Energy Limited nor its parent had filed by 2026-09-24; both are due 30 September. The summary, financials commentary, collection gaps and indicators now say so.
  - **New development (19 May 2026):** a PSC07 and a PSC08 correct the control register above the parent, Renewable and Grid Services Limited. This is not a transfer: Habitat's own PSC and its board are unchanged.
  - **New development (17 July 2026):** General Counsel Jason Dillingham joined the leadership page.
  - **Evidence re-weighted.** Quinbrook's "Operational & Expanding" status page has not been modified since 29 August 2025, so key judgment 2 now treats it as weak evidence. The judgment now rests on the Companies House record.
  - **Other edits:** decision makers gain Dillingham and Chief People Officer Lois Stamps; the ownership line is re-dated; three Companies House sources added (75 in total).
- **Gridmatic dossier refreshed to profileVersion 2; v1 archived.** The raise is still only anticipated. No Gridmatic Inc. Form D, named investor or credit facility exists; the EDGAR full-text index was checked on 2026-09-24 and holds Form Ds as late as 2026-09-23. The Capital Markets posting describing "upcoming debt and equity raises" is still live.
  - **Ownership now reads "founder-led", not "founder-owned".** The posting refers to "existing investors" and "board packages", every posting offers a stock-option loan programme, and a named angel invested before 2022.
  - **Retail revenue claim added:** "on track to hit $100 million in revenue this year" (company LinkedIn, 18 Aug 2026). This is the first revenue figure the company has published, and it is unaudited.
  - **Amperical ERCOT data updated (to 24 Jul):** Endurance Park ranks 11th of 312; Cross Trails moves from 43rd to 38th. The scheduling entity carries "2 sites, 110 MW".
  - **Cross Trails loan waivers.** Energy Vault's lenders waived Cross Trails' debt-service-coverage defaults for Q1 and Q2 2026 (8-K of 1 July; Q2 10-Q). Neither filing names Gridmatic.
  - **Other new developments:** the CCO's 16 September Energy-Storage.news interview, and the March 2026 Ohio residential add-on licence amendment.
  - **Other edits:** VP Finance Yojna Verma added (no CFO is named); strategy read, collection gaps and indicators revised; 7 sources added (77 in total).
- **Registry, calendar and notes.**
  - `profiler-companies.json`: Gridmatic tagline revised; the sync script reconciled `lastUpdated` and source counts for both companies (Habitat 75 sources, 63% first-party; Gridmatic 77, 40%).
  - `profiler-refresh-calendar.json`: `lastRefreshed` moved to 2026-09-24 for both rows. Both stay `watch` tier.
  - `profiler-refresh-notes.json`: watch items updated. Habitat's second watch item flags that the 1 October sweep skips it, so the FY2025 accounts must be folded in by hand once filed.
  - `profiler-graph.json`: rebuilt.
- **Verification.**
  - `sync-profiler-registry.py --check` and `check-profiler-relationships.py`: 0 findings.
  - `check-profiler-crossrefs.py`: 0 candidates.
  - `check-profiler-study.py`: 0 errors.
  - Inbound reconciliation: five substantive mentions across the Fluence, Hunt Energy Network, Stem and Tesla dossiers reviewed, 0 changed.
  - Segment memberships re-read and unchanged: Habitat is challenger in software and optimisation; Gridmatic is challenger there and adjacent in storage developers and IPPs.

## [v07.45r] — 2026-09-24 08:15:30 PM EST

> **Prompt:** "continue with your recommendation"

### Fixed

- **`acp-recharge-2026` flipped to `past`** — ACP RECHARGE 2026 (22–24 Sep, Aurora CO) ended on 24 Sep, and the registry gate failed once its UTC date rolled to 25 Sep.
  - `check-events-registry.py --fix-past` changed that row's `status` and nothing else.
  - `events.ics` was rebuilt: 68 confirmed VEVENTs, down from 69. The only content change is ACP's dropped VEVENT; the rest of the diff is regenerated DTSTAMPs.
  - Verified: `check-events-registry.py` exits 0 (102 events: 68 confirmed, 6 past, 28 tentative), and `extract-corpus-events.py --check` reports `mentions[]` current.
  - Data-only: no page, GAS or schema change.

## [v07.44r] — 2026-09-24 08:11:01 PM EST

> **Prompt:** "continue with your recommendation"

### Fixed

- **Events Sync hand-off order** (`.claude/rules/events-app.md` step 8). The v07.42r hand-off told the developer to "mark 7 applied, reject 9", which the panel cannot do. **Mark applied** stamps every approved row at once, and an applied row can no longer be rejected (`already_applied`). All 16 rows ended up stamped `applied`.
  - **The rule now requires the order the panel supports:** switch skipped rows to Reject first, then click Mark applied.
  - **It also records the fallback:** a row that was stamped by mistake can only be relabelled in the spreadsheet, and the poller's dedup is unaffected by it.
  - **`EVENTS-SCHEMA.md` §7** carries the same one-line ordering note.
  - **Nothing else changed:** no page, GAS or data file.

## [v07.43r] — 2026-09-24 07:55:58 PM EST

> **Prompt:** "Run python3 scripts/extract-corpus-events.py to refresh the stale mentions[] in events.json, confirm with check-events-registry.py (exit 0) and --check, and push it as a data-only commit. It feeds the score's corpusSalience term, and it has been stale since the recent dossier revisions."

### Fixed

- **`events.json` `mentions[]` refreshed from the dossier corpus** — `scripts/extract-corpus-events.py` rewrote the derived index. Only the Megmeet dossier had drifted, which dates to its v8 cut (v07.32r):
  - `computex-2027` loses `megmeet` / `strategy`. The dossier's strategy read no longer names Computex.
  - `ai-infra-summit-2027` gains `megmeet` / `sources`.
  - Totals are unchanged: 256 mention rows across 33 corpus events. The score's `corpusSalience` term reads the corrected counts on the next page load.
  - Verified: `extract-corpus-events.py --check` went from exit 1 to "OK: mentions[] current", and `check-events-registry.py` exits 0 (102 events, 69 confirmed, 256 mentions across 32 events, `events.ics` agrees). This is a data-only change: no page, GAS or schema file touched.

## [v07.42r] — 2026-09-24 07:50:01 PM EST

> **Prompt:** "Picking up from my open action items review, I want to sync my Events registry. Run events sync with the following JSON:
>
> ```json
> {
>   "schemaVersion": 1,
>   "exported": "2026-09-24T23:39:44.059Z",
>   "proposals": [
>     {
>       "id": "pr-011alu3fbhzxh",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2026",
>       "change": "new-edition",
>       "before": {
>         "end": "2027-09-02",
>         "slug": "ai-infra-summit-2027",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "city": "Santa Clara",
>         "country": "US",
>         "end": "2026-09-17",
>         "kind": "conference",
>         "name": "AI Infra Summit 2026",
>         "organiser": "Kisaco Research",
>         "region": "CA",
>         "series": "AI Infra Summit",
>         "slug": "ai-infra-summit-2026",
>         "sources": [
>           {
>             "kind": "jsonld",
>             "lastConfirmed": "",
>             "sourceKey": "ai-infra-summit",
>             "url": "https://www.ai-infra-summit.com"
>           }
>         ],
>         "start": "2026-09-15",
>         "status": "tentative",
>         "tz": "America/Los_Angeles",
>         "venue": "Santa Clara Convention Center",
>         "website": "https://www.ai-infra-summit.com"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-22T20:56:52.474Z"
>     },
>     {
>       "id": "pr-0wf4qdswu9qm4",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2027",
>       "change": "moved-dates",
>       "before": {
>         "end": "2027-09-02",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "end": "2026-09-17",
>         "start": "2026-09-15"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-24T20:55:35.146Z"
>     },
>     {
>       "id": "pr-1ifa3czd71l9h",
>       "sourceKey": "ai-infra-summit",
>       "slug": "ai-infra-summit-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "San Jose",
>         "venue": "San Jose McEnery Convention Center"
>       },
>       "after": {
>         "city": "5001 Great America Parkway, Santa Clara, CA 95054, United States",
>         "venue": "Santa Clara Convention Center"
>       },
>       "evidenceUrl": "https://ai-infra-summit.com/events/ai-infra-summit",
>       "seenAt": "2026-09-22T20:48:51.918Z",
>       "decidedAt": "2026-09-24T20:55:34.788Z"
>     },
>     {
>       "id": "pr-01iw6y3n1ltpd",
>       "sourceKey": "datacloud-usa",
>       "slug": "datacloud-usa-2027",
>       "change": "moved-dates",
>       "before": {
>         "end": "2027-09-02",
>         "start": "2027-08-31"
>       },
>       "after": {
>         "end": "2027-09-02",
>         "start": "2027-08-30"
>       },
>       "evidenceUrl": "https://www.datacloud-usa.com/",
>       "seenAt": "2026-09-22T20:49:06.174Z",
>       "decidedAt": "2026-09-24T20:55:43.747Z"
>     },
>     {
>       "id": "pr-0r71bryoebnp2",
>       "sourceKey": "datacloud-usa",
>       "slug": "datacloud-usa-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "Austin",
>         "venue": "Fairmont Austin"
>       },
>       "after": {
>         "city": "304 E Cesar Chavez St, Austin, Texas, 78701, United Kingdom",
>         "venue": "Austin Marriott Downtown"
>       },
>       "evidenceUrl": "https://www.datacloud-usa.com/",
>       "seenAt": "2026-09-22T20:49:06.174Z",
>       "decidedAt": "2026-09-24T20:55:41.098Z"
>     },
>     {
>       "id": "pr-2f8kg1rgvynrk",
>       "sourceKey": "esig-events",
>       "slug": "esig-large-loads-workshop-2026",
>       "change": "changed-url",
>       "before": {
>         "website": "https://www.esig.energy/events/"
>       },
>       "after": {
>         "website": "https://www.esig.energy/event/esig-large-loads-workshop/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:56:15.848Z"
>     },
>     {
>       "id": "pr-174qj4to6col2",
>       "sourceKey": "esig-events",
>       "slug": "webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-01",
>         "name": "Webinar: Stability and Dynamics Studies of DERs in Weak Distribution Systems: Best Practices for EMT Studies and Utility Applications",
>         "slug": "webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/webinar-stability-and-dynamics-studies-of-ders-in-weak-distribution-systems-best-practices-for-emt-studies-and-utility-applications/"
>           }
>         ],
>         "start": "2026-10-01",
>         "status": "tentative",
>         "website": "https://www.esig.energy/event/webinar-stability-and-dynamics-studies-of-ders-in-weak-distribution-systems-best-practices-for-emt-studies-and-utility-applications/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:57:41.179Z"
>     },
>     {
>       "id": "pr-0imzbnq3kfo98",
>       "sourceKey": "esig-events",
>       "slug": "webinar-a-quantitative-assessment-of-the-impacts-of-large-loads",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-15",
>         "name": "Webinar: A Quantitative Assessment of the Impacts of Large Loads on Electricity Rate",
>         "slug": "webinar-a-quantitative-assessment-of-the-impacts-of-large-loads",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/webinar-a-quantitative-assessment-of-the-impacts-of-large-loads-on-electricity-rate/"
>           }
>         ],
>         "start": "2026-10-15",
>         "status": "tentative",
>         "website": "https://www.esig.energy/event/webinar-a-quantitative-assessment-of-the-impacts-of-large-loads-on-electricity-rate/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:57:39.101Z"
>     },
>     {
>       "id": "pr-2xy3g1xojf4wm",
>       "sourceKey": "esig-events",
>       "slug": "fall-technical-workshop-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "city": "Reston",
>         "country": "United States",
>         "end": "2026-10-29",
>         "name": "2026 Fall Technical Workshop",
>         "region": "VA",
>         "slug": "fall-technical-workshop-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "esig-events",
>             "url": "https://www.esig.energy/event/2026-fall-technical-workshop/"
>           }
>         ],
>         "start": "2026-10-26",
>         "status": "tentative",
>         "venue": "Hyatt Regency Reston, VA",
>         "website": "https://www.esig.energy/event/2026-fall-technical-workshop/"
>       },
>       "evidenceUrl": "https://www.esig.energy/events/",
>       "seenAt": "2026-09-22T20:49:12.076Z",
>       "decidedAt": "2026-09-24T20:56:54.181Z"
>     },
>     {
>       "id": "pr-1fwilm8tj67sn",
>       "sourceKey": "imasons-events",
>       "slug": "imasons-at-yotta-2026",
>       "change": "changed-url",
>       "before": {
>         "website": "https://imasons.org/events/"
>       },
>       "after": {
>         "website": "https://imasons.org/activity/2026-28-09_yotta-2026/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:58:04.031Z"
>     },
>     {
>       "id": "pr-10w2gwwavrkfb",
>       "sourceKey": "imasons-events",
>       "slug": "imasons-cascadia-local-chapter-the-digital-frontier-building-the",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-10-15",
>         "name": "iMasons Cascadia Local Chapter | The Digital Frontier: Building the Infrastructure of Tomorrow",
>         "slug": "imasons-cascadia-local-chapter-the-digital-frontier-building-the",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "imasons-events",
>             "url": "https://imasons.org/activity/2026-10-15_digitalfrontier_cas/"
>           }
>         ],
>         "start": "2026-10-15",
>         "status": "tentative",
>         "website": "https://imasons.org/activity/2026-10-15_digitalfrontier_cas/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:58:34.714Z"
>     },
>     {
>       "id": "pr-1rz0m71444icd",
>       "sourceKey": "imasons-events",
>       "slug": "data-center-energy-industry-update-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "end": "2026-11-02",
>         "name": "Data Center Energy Industry Update",
>         "slug": "data-center-energy-industry-update-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "imasons-events",
>             "url": "https://imasons.org/activity/2026-11-02_datacenterenergyindustryupdate_tx/"
>           }
>         ],
>         "start": "2026-11-02",
>         "status": "tentative",
>         "website": "https://imasons.org/activity/2026-11-02_datacenterenergyindustryupdate_tx/"
>       },
>       "evidenceUrl": "https://imasons.org/events/",
>       "seenAt": "2026-09-22T20:49:41.817Z",
>       "decidedAt": "2026-09-24T20:57:42.089Z"
>     },
>     {
>       "id": "pr-2wpsbsoc5z7j5",
>       "sourceKey": "informa-battery-show",
>       "slug": "the-battery-show-north-america-2026",
>       "change": "new-event",
>       "before": {},
>       "after": {
>         "city": "Detroit",
>         "country": "US",
>         "end": "2026-10-15",
>         "name": "The Battery Show North America",
>         "slug": "the-battery-show-north-america-2026",
>         "sources": [
>           {
>             "kind": "",
>             "lastConfirmed": "",
>             "sourceKey": "informa-battery-show",
>             "url": "https://www.thebatteryshow.com/"
>           }
>         ],
>         "start": "2026-10-12",
>         "status": "tentative",
>         "venue": "Huntington Place",
>         "website": "https://www.thebatteryshow.com/"
>       },
>       "evidenceUrl": "https://www.thebatteryshow.com/en/home.html",
>       "seenAt": "2026-09-22T20:50:09.948Z",
>       "decidedAt": "2026-09-24T20:58:44.533Z"
>     },
>     {
>       "id": "pr-19f00es616r74",
>       "sourceKey": "informa-data-center-world",
>       "slug": "data-center-world-2027",
>       "change": "changed-url",
>       "before": {
>         "website": "https://www.datacenterworld.com/"
>       },
>       "after": {
>         "website": "https://datacenterworld.com/"
>       },
>       "evidenceUrl": "https://www.datacenterworld.com/",
>       "seenAt": "2026-09-22T20:50:13.570Z",
>       "decidedAt": "2026-09-24T20:58:45.815Z"
>     },
>     {
>       "id": "pr-0bywe4src8ygp",
>       "sourceKey": "mwc-barcelona",
>       "slug": "mwc-barcelona-2027",
>       "change": "changed-venue",
>       "before": {
>         "city": "Barcelona",
>         "venue": "Fira Gran Via"
>       },
>       "after": {
>         "city": "Fira Gran Via, Av. Joan Carles I, 64 08908 L'Hospitalet de Llobregat Barcelona",
>         "venue": "Fira Gran Via, Barcelona, Spain"
>       },
>       "evidenceUrl": "https://www.mwcbarcelona.com/",
>       "seenAt": "2026-09-22T20:50:18.044Z",
>       "decidedAt": "2026-09-24T20:58:50.558Z"
>     },
>     {
>       "id": "pr-0gt5wnjye4xvd",
>       "sourceKey": "yotta-event",
>       "slug": "yotta-2026",
>       "change": "changed-venue",
>       "before": {
>         "city": "Las Vegas",
>         "venue": "Caesars Forum"
>       },
>       "after": {
>         "city": "Las Vegas",
>         "venue": "Yotta 2026"
>       },
>       "evidenceUrl": "https://www.yotta-event.com/",
>       "seenAt": "2026-09-22T20:50:22.007Z",
>       "decidedAt": "2026-09-24T20:58:48.048Z"
>     }
>   ],
>   "polls": [
>     {
>       "sourceKey": "ai-infra-summit",
>       "ranAt": "2026-09-22T20:48:51.918Z",
>       "status": "200",
>       "items": 2,
>       "newest": "2026-09-15T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "clarion-powergen",
>       "ranAt": "2026-09-22T20:49:05.599Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-01-18T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "datacloud-usa",
>       "ranAt": "2026-09-22T20:49:06.174Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-08-30T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "esig-events",
>       "ranAt": "2026-09-22T20:49:12.076Z",
>       "status": "200",
>       "items": 12,
>       "newest": "2027-01-26T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "imasons-events",
>       "ranAt": "2026-09-22T20:49:41.817Z",
>       "status": "200",
>       "items": 12,
>       "newest": "2026-11-12T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-battery-show",
>       "ranAt": "2026-09-22T20:50:09.948Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2026-10-12T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-data-center-world",
>       "ranAt": "2026-09-22T20:50:13.570Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-05-24T07:00:00.000Z"
>     },
>     {
>       "sourceKey": "informa-distributech",
>       "ranAt": "2026-09-22T20:50:17.382Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-03-01T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "mwc-barcelona",
>       "ranAt": "2026-09-22T20:50:18.044Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2027-03-01T08:00:00.000Z"
>     },
>     {
>       "sourceKey": "yotta-event",
>       "ranAt": "2026-09-22T20:50:22.007Z",
>       "status": "200",
>       "items": 1,
>       "newest": "2026-09-28T07:00:00.000Z"
>     }
>   ]
> }
> ```
> "

The first `events sync` to reach the registry. Of the 16 proposals the developer approved in the Proposed tab, **7 were applied and 9 were skipped** at the developer's choice. The skipped rows are poller misreads (listed below), and the registry checker could not have caught them, because it checks only for duplicate slugs. All 10 polled roster rows had their `lastProbe` advanced. No app file changed, so no page or GAS version bump.

### Changed

#### `live-site-pages/events-data/events.json`
- **`datacloud-usa-2027`**:
  - Start moved from 31 Aug to **30 Aug 2027**, the organiser's JSON-LD start, which includes the pre-event day the row's tierNote already names (`pr-01iw6y3n1ltpd`).
  - Venue **Fairmont Austin → Austin Marriott Downtown** (`pr-0r71bryoebnp2`). `city` stays "Austin", because the poller wrote a street address ending "United Kingdom". `venueLatLng` was removed because it pinned the old venue; the next E0 verification pass should set it again.
- **Three website updates**: `esig-large-loads-workshop-2026` → the workshop's own ESIG page (`pr-2f8kg1rgvynrk`), `imasons-at-yotta-2026` → its iMasons activity page (`pr-1fwilm8tj67sn`), `data-center-world-2027` → `datacenterworld.com` without the `www` (`pr-19f00es616r74`).
- **Two new ESIG webinars, both tentative**. The session read their evidence pages on 2026-09-24: both are online on WebEx, 4–5 PM ET, organised by ESIG.
  - `webinar-stability-and-dynamics-studies-of-ders-in-weak-distribut` (1 Oct): DER stability and EMT studies. Audience: grid equipment, utilities, software. Relevance 2 (`pr-174qj4to6col2`).
  - `webinar-a-quantitative-assessment-of-the-impacts-of-large-loads` (15 Oct): how large loads move electricity rates. Audience: utilities, AIDC developers, hyperscalers. Relevance 3 (`pr-0imzbnq3kfo98`).
- On every applied row: `lastUpdated` 2026-09-24, and the matching source's `lastConfirmed` set to 2026-09-22 (the poll date).
- `uptime-network-americas-fall-2026` flipped from tentative to **past** through the checker's own `--fix-past`, which changes only status. It ended 23 Sep, and it was the only finding the gate reported before the sync.

#### `live-site-pages/events-data/events-sources.json`
- `lastProbe` advanced to the 2026-09-22 poll on 10 roster rows (all HTTP 200): ai-infra-summit, clarion-powergen, datacloud-usa, esig-events, imasons-events, informa-battery-show, informa-data-center-world, informa-distributech, mwc-barcelona, yotta-event. No row was added, unblocked or re-kinded.

#### `live-site-pages/events-data/events.ics`
- Rebuilt: 69 confirmed of 102 events.

### Skipped — reject these in the Proposed panel
- `pr-011alu3fbhzxh` (new-edition `ai-infra-summit-2026`), `pr-0wf4qdswu9qm4` (moved-dates) and `pr-1ifa3czd71l9h` (changed-venue) on `ai-infra-summit-2027`. The organiser page's JSON-LD still carries the finished Sep 15–17 2026 Santa Clara edition. The poller read it as a new edition whose *previous* edition is 2027, and as a move of the 2027 row back to 2026 dates and the 2026 venue, with a street address in `city`.
- `pr-0bywe4src8ygp` (`mwc-barcelona-2027`): the venue is unchanged; the proposal only puts a street address in `city`.
- `pr-0gt5wnjye4xvd` (`yotta-2026`): the proposed venue "Yotta 2026" is the event's own name.
- Four duplicates of existing rows under new slugs:
  - `pr-2wpsbsoc5z7j5` duplicates `battery-show-na-2026`.
  - `pr-2xy3g1xojf4wm` duplicates `esig-fall-technical-workshop-2026`.
  - `pr-10w2gwwavrkfb` duplicates `imasons-cascadia-digital-frontier-2026`.
  - `pr-1rz0m71444icd` duplicates `imasons-texas-energy-update-2026-11`.

### Verified
- `scripts/check-events-registry.py` exit 0: 102 events (69 confirmed, 5 past, 28 tentative), 58 roster rows, 256 mentions across 32 events; the ICS agrees with the registry.
- `mentions[]` is byte-identical to before the sync. `extract-corpus-events.py --check` reports the file stale **on `main` before this sync as well**, from recent dossier edits. This command never writes `mentions[]`, so that refresh is left to its own script.

## [v07.41r] — 2026-09-24 06:55:02 PM EST

> **Prompt:** "Verify and close out the attached three facts that are still unverified" *(with a screenshot of the three facts flagged at v07.40r: AEP's "six of eight" tariff states against its 30 Jul release's five; Narada's H1 2026 collapse not yet in its v4 dossier; the Trane dossier's policyExposure[1] reading the EPA 2030 relief too broadly)*

All three facts flagged at v07.40r were verified against primary sources and closed. AEP needed no change. Trane and Narada were revised, and the corrections were carried into the two Guidance landscape modules and two segment lessons that repeated them.

### Verified — no change

- **AEP "six of eight"** — both figures are right at their own dates. The 30 Jul 2026 Q2 earnings deck (p. 8) says five of the eight states; the "Aug & Sep 2026 Investor Meetings" handout (p. 7, and the p. 12 table) says six, after Michigan approved in between, with Oklahoma (PSO) and SWEPCO Texas still pending. Every repo mention already dates "six" to the August handout. The matching bullet in the cooling-recheck reminder is struck through as closed.

### Changed

#### `live-site-pages/profiler-data/trane-technologies.profile.json` — profileVersion 1 → 2 (v1 archived)
- **policyExposure[1]** (EPA Technology Transitions rule) corrected from Federal Register 2026-10387 and 40 CFR 84.54 as amended. The 2030 extension covers only chillers and process refrigeration of **100 lb charge or less used in semiconductor manufacturing**; every other industrial process chiller keeps 1 Jan 2026 or 1 Jan 2028. Data-centre, IT-equipment and computer-room cooling keeps its **700-GWP limit from 1 Jan 2027**. The amendments were published 26 May but took effect **27 July 2026**, so `effectiveDate` is corrected too.
- The exposure's conclusion is reversed for data centres: the applied line keeps its near-term forced-transition catalyst. strategyRead #5 and the 26 May development entry are corrected to match, each marked as a v2 correction.
- Two primary sources added: the Federal Register PDF and the eCFR section.

#### `live-site-pages/profiler-data/narada.profile.json` — profileVersion 4 → 5 (v4 archived)
- The **H1 2026 interim** (filed 29 Aug on cninfo) added as its own financial period, read first-hand:
  - Revenue RMB 1.699B (−56.7%). Grid storage RMB 183.8M (−80.6%, gross margin −31.6%), comms and data-centre storage RMB 1.044B (−44.8%, gross margin −4.0%), recycling RMB 470.7M (−56.7%).
  - Net loss RMB 1.111B.
  - Equity attributable to shareholders RMB 290.2M (−79.5%), and total equity RMB 25.1M after negative minority interests. Liabilities are 99.8% of assets.
  - Cash RMB 465.3M, of which about RMB 409.6M is frozen.
  - The court had still not accepted the reorganisation petition.
- **strategyRead[1] revised and its confidence lowered from High to Moderate**: the comms/DC segment grew through FY2025 but not through H1 2026. strategyRead[0], strategyRead[2], the summary, the commentary and a new 29 Aug development updated. No USD overlay is stored for the interim, because no citable FX basis was established.

#### `googleAppsScripts/Classroom/Classroom.gs` — v01.90g → v01.91g
- **`landscape-cells-and-chemistry-2026-09`** (updated → 2026-09-24) and **`landscape-in-hall-power-2026-09`** — every "the segment grew through the collapse" claim is corrected (five passages across indicators, bets, the group-three paragraph and the claims ledgers). The Narada ledger rows are re-pinned at v5 and a dated revision note is added. `reviewBy` is unchanged in both.
- **`segment-in-hall-power`** and **`segment-cooling`** regenerated. These were the only two segments whose sections changed ("what-moved" gains Narada's H1 event; "the-fence" reads Trane's corrected EPA entry). The other pin-only segments were left alone under G3.

#### Other files
- `repository-information/industry-guidance/landscape-cells-and-chemistry-analysis.md` and `landscape-in-hall-power-analysis.md` — mirrored corrections and revision notes. The in-hall-power "flagged, not changed" Narada item is struck through as closed.
- `repository-information/CLASSROOM-CURRICULUM-PLAN.md` — inline correction on the §10.6 cooling-row history that carried the same broad EPA reading and the 26 May date.
- `profiler-companies.json` synced; `profiler-graph.json` rebuilt.
- Profiler checks: relationship checker 0 findings; cross-reference checker 0 candidates. Inbound reconciliation: 3 dossiers mention Narada, none with a financial claim, 0 changed. No other dossier cites the EPA rule.

## [v07.40r] — 2026-09-24 05:34:30 PM EST

> **Prompt:** "Recheck four Classroom Industry Guidance landscape modules whose reviewBy dates fall this week. Read first: .claude/rules/industry-guidance.md (especially the Freshness discipline section and step 7's render recipe), .claude/rules/classroom-app.md, repository-information/CLASSROOM-SCHEMA.md and repository-information/C5-SALES-SIMULATIONS-DESIGN.md §3, §6 and §12. The modules, in guidanceDocs_() in googleAppsScripts/Classroom/Classroom.gs, below the // CONTENT END fence: 1. landscape-cooling-2026-09: reviewBy 2026-09-28 2. landscape-neoclouds-2026-09: reviewBy 2026-09-30 3. landscape-utilities-2026-09: reviewBy 2026-10-01 4. landscape-in-hall-power-2026-09: reviewBy 2026-10-01 For each module: (a) List its dated gates and load-bearing claims: regulatory dates, tariffs, market shares, deployment calendars, capacity numbers, named programmes. (b) Re-check every claim whose gate has passed or is close, using targeted web research against primary sources. Also check which covered dossiers (live-site-pages/profiler-data/<slug>.profile.json) have been revised since the module's `updated` date. (c) Update content that has gone stale. Keep the content-scope rule: the landscape-* modules are the approved exception that may name companies. Bump `updated` and set a new `reviewBy` from the module's next dated gate. A module that is still accurate gets a refreshed `reviewBy` only. Never change a module id. For landscape-in-hall-power specifically: the OCP Solid State Transformer (SST) Specification, Revision 0.3.0 (Google, Microsoft and NVIDIA; effective 22 June 2026; announced by OCP 11 August 2026) is summarised first-hand in repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html, chapter 3.5 and Appendix E. Check the module against it: - two SKUs: 13.8 kV at 5 MW, and 34.5 kV at 5 or 10 MW - 800 V DC unipolar output - at least 98% efficiency from 50–100% load, power-train losses only - recommended overload of 120% for 5 s and 150% for 150 ms - an SST coupled with storage defined as an MV UPS - Modbus TCP/IP as the only communications requirement - BIL of at least 110 kV at 13.8 kV and 150–200 kV at 34.5 kV - the compliance list, with no UL 9540 The source PDF is not in the repo. Cite the specification itself, never the briefing, and state nothing about it beyond what chapter 3.5 records. Rehearsal scenarios: this is an attended developer session, so under design D6 you may re-judge scenario beats. Before editing each landscape, list the type:"scenario" lessons whose provenance names it as a guidance:landscape-* input. Read them off Classroom.gs using the check-classroom-content.py loader (parse_literals(src, 'clLesson')), not from memory. After editing, for every landscape whose `updated` moved: - re-judge each resting scenario's beats against the revised facts - revise the scenario where a beat no longer holds, or re-stamp its pin where it still holds - keep every scenario's `reviewBy` no later than its landscape's new `reviewBy` Two scenarios fall due this week regardless and need the same review: scenario-neoclouds-discovery (9/30) and the three utilities scenarios (10/1). The "6 · Rehearsal coverage" block of check-classroom-curriculum.py must show nothing left under "landscape moved under it" for these four modules. If build-classroom-segments.py --check then shows section changes caused by these edits, regenerate those segments in the same push per G3. Leave pin-only segments alone. Verify, all must pass: - node --check on a .js copy of Classroom.gs - node scripts/check-gas-inner-scripts.js - python3 scripts/check-classroom-content.py (0 errors, no new warnings) - python3 scripts/check-classroom-curriculum.py --strict - python3 scripts/check-classroom-pipeline.py --base origin/main (if it reports P3, meet the gateDigest refresh obligation in classroom-app.md) - python3 scripts/check-readme-tree.py - a Playwright render of each edited module at Classroom.html#guidance/<id> with zero page errors (pip install playwright; use the pre-installed Chromium; never run playwright install) Bookkeeping: bump Classroom.gs VERSION and live-site-pages/gs-versions/Classroomgs.version.txt. Add a generic Classroomgs.changelog.md entry that never names an analysed document. Add a CHANGELOG entry, bump the repo version and update the README timestamp. Use the normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main. Run git fetch --unshallow origin main first. The C2 pipeline Routine fires Wednesday 2026-09-30 11:00 UTC, so push well before it and check git ls-remote first. One push. Close with a per-module verdict table (current / updated / needs deeper refresh), the scenarios you re-judged and what changed in each, and anything left for me."

All four landscape modules due this week were re-verified against primary sources. Four parallel research passes were run, and every changed fact was re-read first-hand before it went in. All four modules were updated. The four scenarios resting on the two modules that carry them were re-judged, and every beat's correct answer holds. Segment lessons pin no guidance input, so `build-classroom-segments.py --check` is unchanged at 13 pin-only and 0 with section changes, and nothing was regenerated.

### Changed

#### `googleAppsScripts/Classroom/Classroom.gs` — guidance modules (below the fence)
- **`landscape-cooling-2026-09`** — `updated` 2026-09-17 → 2026-09-24; `reviewBy` **stays 2026-09-28**, because the CoolIT launch gate is still ahead.
  - The CDU ladder now leads with Schneider's 3.5 MW WCDU (23 Sep), so the adjacent member sits above two of four incumbents, not three.
  - The refrigerant row is narrowed to semiconductor chillers of 100 lb or less for 2030, plus the data-centre 700-GWP limit from 1 Jan 2027 (EPA).
  - The Texas freeze is widened to the 21 Sep TCEQ permit halt.
  - The Ecolab date is now 27 Oct.
  - Delta and LITEON tags are moved to v6 and v7.
- **`landscape-neoclouds-2026-09`** — `updated` 2026-09-16 → 2026-09-24; `reviewBy` **stays 2026-09-30**, because Fluidstack's accounts are not filed. This module needs a deeper refresh.
  - The rating basis is rewritten to ClusterMAX 3.0 (23 Sep): Nebius is Platinum beside CoreWeave, Crusoe drops to Bronze, and Fluidstack and Nscale are Unavailable.
  - Nscale's S-1 (18 Sep) moves the revenue-disclosure count to 3 of 7, confirms the Anthropic contract at up to about USD 44.6 bn, and puts about 1 GW of 1.37 GW at owned sites.
  - Fluidstack names its end customer.
  - IREN is re-pinned at v5.
- **`landscape-utilities-2026-09`** — `updated` 2026-09-14 → 2026-09-24; `reviewBy` 2026-10-01 → **2027-01-01**. The Alabama statute is confirmed, so the date moves to the next effective date.
  - The Texas behind-the-meter asymmetry is corrected for the 21 Sep permit halt, with a new indicator row for the 19 Oct TCEQ update.
  - Merger dates are attributed to Virginia (17 Nov) and South Carolina (8 Dec; 29 Jan order).
- **`landscape-in-hall-power-2026-09`** — `updated` 2026-09-15 → 2026-09-24; `reviewBy` 2026-10-01 → **2026-10-31**, because Samsung SDI's start is month-level.
  - Adds the OCP SST Specification Rev. 0.3.0 in one paragraph, one indicator row and seven ledger rows, each citing the specification.
  - Flex's revenue claim is corrected from its Form 10.
  - Delta is moved to v6.

#### `googleAppsScripts/Classroom/Classroom.gs` — rehearsal scenarios (developer session, design D6)
- **`scenario-neoclouds-discovery`** — changed: `the-room`, `beat-3`, `claims-ledger`, `what-the-record-does-not-say`. The end user is now named by the counterparty itself, the disclosure count is 3 of 7, and beat 3's day count is made date-stable. Pin: `guidance:landscape-neoclouds-2026-09` 2026-09-16 → 2026-09-24. `reviewBy` stays 2026-09-30.
- **`scenario-utilities-objection`** — changed: `what-the-record-says`, `beat-3`, `claims-ledger`. The merger calendar is corrected. Pin: `guidance:landscape-utilities-2026-09` 2026-09-14 → 2026-09-24. `reviewBy` stays 2026-10-01.
- **`scenario-utilities-discovery`** — changed: none. It is re-judged and re-stamped only. Pin 2026-09-14 → 2026-09-24. `reviewBy` 2026-10-01 → 2026-11-03.
- **`scenario-utilities-discovery-aidc`** — changed: `the-position`, `beat-2`, `claims-ledger`. The Texas premise is corrected, and beat 2's answer holds. Pin 2026-09-14 → 2026-09-24. `reviewBy` 2026-10-01 → 2026-12-10.

#### `repository-information/industry-guidance/landscape-{cooling,neoclouds,utilities,in-hall-power}-analysis.md`
- A revision section on each records what moved, the source, and what was flagged but not changed.

#### Versions
- Classroom GAS v01.89g → v01.90g (`Classroom.gs` `VERSION` and `Classroomgs.version.txt`), with generic `Classroomgs.changelog.md` lines.

### Notes
- **Checkers:**
  - `check-classroom-content.py`: 71 lessons / 8 tracks / 220 gate cases — 0 errors, 0 warnings.
  - `check-classroom-curriculum.py --strict`: no structural findings; 0 scenarios whose landscape moved under them; due-for-review 10 → 6.
  - `node --check`: clean.
  - `check-gas-inner-scripts.js`: all blocks parse.
  - `check-readme-tree.py`: 0 findings.
  - Playwright render of all four modules: 0 page errors.
- **`check-classroom-pipeline.py --base origin/main`** reports P1, P2, P10 and P13 only. All are expected on a developer commit: the four analysis files are outside the committer's write set, the modules sit below the fence, the caps bind the unattended committer, and D6 reserves scenario revisions for exactly this session. **No P3, so `gateDigest` is untouched.**

## [v07.39r] — 2026-09-24 05:05:10 PM EST

> **Prompt:** "[attached: Powering_the_Next_Era_of_AI_-_How_Google_Microsoft_and_NVIDIA_Are_Standardizing_and_Accelereating_the_Industry_Transition_to_LVDC.pdf] [attached: OCP_SST_Design_Specification_v0.3_FINAL.pdf] Per the Priority 1 list: 1. See attached for the OCP LVDC SST Spec v03 and the accompanying press release that announced it. Now that you have the spec, make sure to update my Megmeet SST Briefing accordingly and output a downloadable copy for me to read. Highlight all the changes made. Then, give me a prompt to paste into a new Opus 5.5 Medium or High session to recheck the 3 Classroom landscape modules."

The Megmeet SST briefing is updated from the OCP SST Specification, Revision 0.3.0, and OCP's announcement of 11 August 2026. The developer supplied both on 24 September; `opencompute.org` had refused them to this environment. Both were read in full, figures included. Every change in the briefing is highlighted in place, and a new Appendix E indexes them. The PDF goes from 76 to 84 pages.

### Changed

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html` and the rebuilt `MEGMEET-SST-BRIEFING.pdf` (76 → 84 pages)
- **New chapter 3.5, "What the OCP specification actually says"** — the scope (an MV SST coupled with storage functions as an MV UPS); a fifteen-row requirements table with what each row asks of a vendor; what Revision 0.3.0 leaves TBD; what the announcement adds; and an analysis box on what it changes for Megmeet.
- **Corrected second-hand claims** (old text struck through beside the new):
  - The specification's title, dates and authors: *Solid State Transformer (SST) Specification — Medium Voltage to 800 VDC Power Conversion Platform*, effective 22 June 2026, announced 11 August 2026. The first edition had "LVDC SST Specification, July 2026".
  - "More than 80 manufacturers building to it" is corrected to the announcement's wording: more than 80 partners developing 800 VDC-compatible infrastructure.
  - Chapter 8, NVIDIA question 13: the specification names Modbus TCP/IP.
  - Chapter 8, NVIDIA question 15: the specification does set harmonic and power-factor requirements (IEEE 519, IEC 61800-3 C4, IEC 61000-6-2/-4).
  - Week-one question 9 is rewritten around commenting on Revision 0.4.
  - Chapter 16.4 marks the OCP block as resolved.
  - The glossary entry, the flashcard and the chapter 1 term row are rewritten.
- **Added from the specification**:
  - Two SKUs: 13.8 kV at 5 MW, and 34.5 kV at 5 or 10 MW.
  - At least 98% efficiency between 50% and 100% load, counting power-train losses only.
  - Recommended overload of 120% for 5 s and 150% for 150 ms.
  - BIL of at least 110 kV at 13.8 kV and 150–200 kV at 34.5 kV.
  - 800 V DC unipolar output; IT ground floating or high-resistance grounded.
  - A cap of 10 mF of DC-link capacitance per 4 MW.
  - Siting in conditioned grey space or outdoors, NEMA 3R, with a 15+ year design life.
  - The ride-through bands and the state machine.
  - The compliance list, which includes no UL 9540.
  - These are placed on the cover, in I.1, I.2 (twenty-three numbers become twenty-seven), chapters 1, 3, 5, 6, 7, 8 and 13–16.
- **Two new items in chapter 16.3:** the specification plots ERCOT's NOGRR 282 curve with different corner points from the briefing's web-sourced test, and the specification carries three different dates.
- **New Spec citation tier**, references 85–89. They are appended rather than renumbering the document. New highlight CSS: `mark.chg`, `del.chg`, `tr.chg`, `.chg-block`.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`
- The same stale statements are corrected in `obstacles`, `timelines`, `terms`, `weekOne` and `calendar`, and the `dontSay` ±400 V row gains a note.
- Three OCP numbers are added to `numbersToKnow`, a `SPEC` entry is added to `tierVocabulary`, and there is a new `updated` field.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/`
- `mmsst-fig-calendar.svg` (M2) and `mmsst-fig-timelines.svg` (M11) are regenerated from the data file. The other twelve came out identical apart from timestamps and clip ids, and were left as they were.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`
- The data file is re-inlined byte-identically. `tierClass()` learns the `SPEC` prefix, with a matching `.t.s` colour, so Spec tags do not render as analysis.

#### `README.md`
- The `Last updated:` line and the briefing PDF's page count in the tree.

### Notes

- **Neither source PDF is stored in the repository.** The briefing's references 85–89 name them, and chapter 3.5 records what they say.
- **Verification:**
  - Every scripted replacement matched exactly once.
  - The PDF was built with `node scripts/build-megmeet-sst-briefing-pdf.mjs`, and the cover, I.2, I.4, figure M2, 3.5 (both pages), the chapter 8 question table and Appendix E were rendered and read.
  - The companion loads headless from `file://` with no console errors.
- **Not changed:** the chapter 6 ledger and figures M6, M7 and M12 record what vendors have *shown*, and the specification changes none of that. Megmeet's class stays undisclosed.

## [v07.38r] — 2026-09-24 09:08:52 AM EST

> **Prompt:** "[Scheduled Routine \"Profiler earnings desk\", fired 2026-09-24.] STEP 0 — clone, prove push works, before any research. Then: read repository-information/profiler-refresh-calendar.json as the queue. DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run, oldest nextReport first. For each: (1) verify the report actually published, (2) run the Profiler Command end to end including news triage against the Scraper corpus (`CORPUS_TOKEN` supplied in the Routine prompt only, never written to the repo), (3) advance the row's nextReport/confirmed/source/lastRefreshed/watch[]. Also: for any row that is unconfirmed and whose nextReport is within seven days, confirm the date and update the row — that is calendar work, not a refresh, and does not count against the cap. Land one commit per run under the repo's normal Pre-Commit/Pre-Push checklists. Never create/update/delete a Routine or trigger. If nothing is due, stand down."

### Changed

#### `repository-information/profiler-refresh-calendar.json`
- **No row is due.** Read all 177 rows (92 `nextReport`, 85 `cadence`); none of the 92 public rows has `nextReport` on or before 2026-09-23, so no dossier refresh ran and the three-row cap was not exercised.
- **`intertek` confirmed** (the one row unconfirmed with `nextReport` within seven days — 2026-10-01, six days out). This is calendar work, not a refresh: per the row's own note in `profiler-refresh-notes.json`, 2026-10-01 is not an earnings date but the opening of the watch-window for the EQT/ADIA/Mubadala scheme's court-sanction hearing (expected Q4 2026 or Q1 2027, with no fixed date). Verified via web search (Investegate RNS coverage, Reuters/TradingView, SWFInstitute) that the scheme timetable is unchanged since the row was last touched — shareholders approved the scheme 2026-08-06 (~98.7% of votes), court sanction is still pending with completion still guided to Q4 2026/Q1 2027, and no sanction/suspension/delisting announcement has landed. `confirmed` false → true, `lastRefreshed` 2026-09-09 → 2026-09-24. `nextReport` unchanged (still the correct window-open date). No dossier written — none was due.
- **`updated`** 2026-09-23 → 2026-09-24.

### Notes

- **Stand-down accounting**: 177 rows read, 0 taken for refresh (cap of 3 not exercised), 1 row re-confirmed via calendar work, 0 rows re-dated. The earliest `nextReport` in the queue is now `intertek` (2026-10-01), but that date is a watch-window open, not an earnings report — the next actual report due is `abb`, `nextReport` 2026-10-20.

## [v07.37r] — 2026-09-23 10:37:40 PM EST

> **Prompt:** Regenerate the five Classroom segments whose content changed (power-conversion-and-rack-power-silicon, cells-and-chemistry, storage-integrators-and-containers, grid-equipment, hyperscalers-and-ai-labs) and leave the 13 date-only ones alone. Archive old sections of the repo CHANGELOG and the Classroom GAS changelog in the same push.

This closes the regeneration item left open at v07.36r. `build-classroom-segments.py --check` read 18 of 19 segments due, 5 with section changes and 13 pin-only. The five were regenerated, and `--check` now reads 13 due, all pin-only. Both changelogs were rotated in the same push.

### Changed

- **`googleAppsScripts/Classroom/Classroom.gs` v01.88g → v01.89g** — five segment lessons regenerated with `build-classroom-segments.py --segment <id>` (generation date 2026-09-23). Each appends one `revisions[]` entry, and its `changed[]` is exactly the set of differing sections:
  - **`segment-power-conversion-and-rack-power-silicon`** — changed: `the-players`, `what-moved`, `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:delta-electronics` 2026-09-04→2026-09-23, `profile:liteon` 2026-09-05→2026-09-23, `profile:megmeet` 2026-09-08→2026-09-23. This carries the Megmeet v8 basis-line change that v07.33r left due.
  - **`segment-cells-and-chemistry`** — changed: `what-moved`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:novonix` 2026-09-09→2026-09-22.
  - **`segment-storage-integrators-and-containers`** — changed: `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-21→2026-09-23.
  - **`segment-grid-equipment`** — changed: `who-is-connected`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23.
  - **`segment-hyperscalers-and-ai-labs`** — changed: `what-moved`. Re-pinned: `graph:profiler-graph` 2026-09-19→2026-09-23, `profile:oracle` 2026-08-30→2026-09-21.
  - No track changed.
- **The 13 pin-only segments were left alone:** bridge-and-on-site-generation, clean-firm-and-nuclear, cooling, compute-and-the-rack, epc-and-construction, storage-developers-and-ipps, aidc-developers-and-landlords, neoclouds, utilities, capital, assurance, software-and-optimization and insurance-and-risk-transfer. Their inputs moved but no section differs, so G3 keeps both their text and their pins.
- **`live-site-pages/gs-versions/Classroomgs.version.txt`** → `|v01.89g|`, with a generic entry in `Classroomgs.changelog.md`.
- **`README.md`** — the `Last updated:` line and the Classroom GAS version display (synced by `check-readme-tree.py --fix`).

### Notes

- **Archive rotation — both changelogs, at the developer's instruction.** Neither was strictly triggered at 2026-09-23 EST: the repo CHANGELOG had 108 sections with 16 exempt as today's, so 92 non-exempt, and the Classroom GAS changelog had 51 with 2 exempt, so 49. Both were rotated anyway, because the prompt asked for it and the repo CHANGELOG would trigger at the first push after midnight. Each rotation moved exactly one whole date group, the oldest, and left both files below their caps even once today's sections lose their exemption:
  - **`CHANGELOG.md` → `CHANGELOG-archive.md`:** the 2026-09-17 group, 19 sections (`v06.30r`–`v06.48r`). `Sections: 107/100` → `89/100`.
  - **`Classroomgs.changelog.md` → `Classroomgs.changelog-archive.md`:** the 2026-09-15 group, 10 sections (`v01.39g`–`v01.48g`). `Sections: 50/50` → `41/50`.
  - **SHA enrichment:** 29 of 29 resolved on the deepened clone, and none are marked `[SHA unavailable]`. Each file keeps its existing link style: an 8-character short SHA in the repo archive and 7 characters in the GAS archive. Post-rotation verification (`grep '^## \[v' … | grep -v '— \['`) is empty for both archives.
- **Checks:**
  - `build-classroom-segments.py --check`: 13 due, 0 with section changes, 13 pin-only.
  - `check-classroom-content.py`: 71 lessons, 8 tracks, 220 gate cases, 0 errors, 0 warnings.
  - `check-classroom-pipeline.py --selftest`: 15 fixtures, 0 failures.
  - `check-classroom-pipeline.py --base origin/main`: no P3 finding, so `gateDigest` is unchanged. P10 reports 5 revised lessons against the cap of 3, which binds only unattended pipeline runs, and segment lessons are regenerated by developer sessions by design.
  - `node --check` passes, `check-gas-inner-scripts.js` passes (106 inner script blocks), `check-classroom-curriculum.py` has no structural findings, and `check-readme-tree.py` reports 0 findings.

## [v07.36r] — 2026-09-23 09:28:35 PM EST

> **Prompt:** fix the looks-wrong list. Do your own independent research and/or cross-check to determine a conclusion. If you cannot make the call, explain the context and decision to me and I will decide.

The v07.34r rewrite listed six things in the Megmeet SST briefing that looked wrong but left them alone. Each was checked against the primer, the document's own tables, git history or the primary sources, and all six were decided and fixed. None needed the developer's call. The PDF stays at 76 pages with 84 numbered references.

### Fixed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`**
  - **Chapter 7 intro.** It named one owned unsolved obstacle, but its own table has two. The sentence now names both: FERC for the interconnection queue and the NFPA Fire Protection Research Foundation for the DC arc-flash model.
  - **Chapter 16.2.** The bullet saying the NC State / NYPA / EPRI 1 MW feeder voltage was undisclosed is removed. NC State's releases of 18 August give only "up to 1 MW", but POWER Magazine of 8 September, which the primer cites, reports a live 13.2 kV feeder.
  - **Chapter 16.4 box.** It said chapter 7's newsletter-sourced claims were "marked low confidence where they appear". Git history shows no such marking in any version, and the NEC Article 706 "100 V DC default" it warned about appears nowhere in the document. The box now says what can be said: the claims cannot be told apart one by one, so check a web-sourced standards claim against the standard before quoting it.
  - **I.3 item 2.** Primer 7.3 names eight SST developers, so calling Novos Power the "sixth" name was wrong. The heading drops the ordinal and a new first sentence lists the eight.
  - **Appendix D.** The D.3 PDF row and the colophon statistics now say which moment each page count describes: 69 at the first build, 71 after the audit pass, 72 after the v8 amendment and 76 after the rewrite. A follow-up note records the six corrections.
  - **Chapter 9.4.** The note above the v8 table no longer says the data file still lists "the US".
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`**
  - Watchlist item 2's headline drops "fifth". Its "was" field now lists primer 7.3's full roster.
  - The footprint objection answer now matches dossier v8: manufacturing in China and Thailand, contract manufacturing in India, R&D in Germany, and a Richardson base that only the company's website describes.
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`** — the data file is inlined again, byte-identically.
- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/mmsst-fig-watchlist-delta.svg`** — Figure M1 is regenerated with the new headline. The other thirteen figures regenerated identically and were left as they were.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages.

### Notes

- **Scope.** The v07.34r prompt put the data file, the companion and the figures out of bounds for the rewrite. This prompt asked for the looks-wrong list to be fixed, and item 6 sits in the data file.
- **Archive rotation is not due.** The counter reads `107/100`, but 15 sections carry today's date, leaving 92 non-exempt.

## [v07.35r] — 2026-09-23 08:57:20 PM EST

> **Prompt:** *(no new prompt — this version works the fresh-subagent audit that the v07.34r prompt required; that prompt is quoted in full under v07.34r)*

The fresh audit of the Megmeet SST briefing rewrite returned fifteen findings. Most sat in the dossier-v8 corrections. All fifteen were worked: fourteen fixed and one verified correct. The PDF stays at 76 pages with 84 numbered references.

### Fixed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`**
  - **Chapter 13, first objection.** The FCC Covered List sentences carry their web number again. The v8 rewrite had left them in front of a dossier-v8 number, which made them read as v8's. The Dallas-lab and San Jose sentence is also cited to the web again.
  - **Chapter 9.3.** The unsourced lead "larger than the filings show" becomes "the website and the filings differ". The closing line no longer merges the website's 35,000 sq ft base and the licensed 39,200 sq ft renovation into one site.
  - **Chapter 16.2.** The US-plant item keeps its original question: whether the November 2024 plant, the Richardson base and the Dallas lab are the same thing. It no longer implies the plant is the Richardson base, and it restores the caveat that capacity and timeline are unpublished.
  - **Week-one question 6.** The GB300/ODM fact is attributed again to the Goldman Sachs note relayed by Sina, with "neither named".
  - **Chapter 14.** "The story is settled, and it is wrong" becomes "the question is now closed, and the record does not support the story".
  - **Chapter 9.4.** The note above the v8 table now says two things were not rewritten: the first table is annotated rather than changed, and the data file still lists "the US" among the manufacturing locations.
  - **Smaller fixes:**
    - 9.2's added "read from the grid down" is dropped;
    - the Power Brick gloss is dropped;
    - the 6.2 analysis passage carries its gold A;
    - I.2's NOGRR row is back to "meets it by design";
    - question 13 no longer calls DMTF a protocol;
    - chapter 2's EV-charging order is explicit again.
  - **Chapter 10, Heron row.** Megmeet's "manufacturing base across five countries" contradicted the corrected footprint. It is now six bases, five in China and one in Thailand, citing v8.
  - **Appendix D.** The rewrite note lists every extension of the v8 corrections and the one attribution change: the 60.92% growth now belongs to the power-products segment. It also records that figure captions carry numbers and summarises the audit.
  - **Cover.** "overnight" is restored.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages.

### Notes

- **Verified, not changed:** audit finding 7. The chapter 1 walkthrough's DAB/CLLC/MFT bullet cites primer figure 4, which sits in §3.1 and whose caption states exactly that stage.
- **Archive rotation is not due.** The counter reads `106/100`, but 14 sections carry today's date, leaving 92 non-exempt.

## [v07.34r] — 2026-09-23 08:50:50 PM EST

> **Prompt:** "Rewrite the Megmeet SST onboarding briefing for clarity and learning, and convert its citation tags to numbered, colour-coded superscripts. This is an editing pass on a finished document: no new research, no new facts, no lost facts.
>
> ## What you are editing
> - Source: repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html (about 1,030 lines, 72 printed pages, five parts plus appendices A–D).
> - Output: the same file, rebuilt to repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf with `node scripts/build-megmeet-sst-briefing-pdf.mjs` (and `--png` for proof pages).
> - Context, read before you start: repository-information/megmeet-briefing-prompt.md (why the document exists and who it is for), chapter 9.4 in full, Appendix C, and Appendix D (the colophon, which records the design decisions you must not undo by accident).
> - Pre-flight check: chapter 9.4 must contain a second table headed "What dossier v8 records". If it does not, the evening-of-23-September amendment has not reached main. Stop and say so.
>
> ## Who reads it, and what "better" means
> The reader is the developer: a new Senior Sales Manager for SST solutions at Megmeet, starting 2026-10-07. The goal is to learn the technology and the market well enough to hold an engineering conversation, not to skim.
> - Explaining a concept thoroughly beats being concise. Cut words that carry nothing: throat-clearing, repeated caveats, stacked qualifiers, sentences that restate the previous one. Never cut a step in an explanation. If a paragraph assumes something the reader has not been taught yet, add the missing step. Define every term the first time it appears, even when the glossary also has it.
> - Write like a careful human expert explaining to a colleague. Vary sentence length. Use concrete nouns and active verbs. Use a plain-language analogy where it genuinely helps, then give the precise statement. Avoid stock phrasing, chains of em-dashes, bold on every other clause, and rhetorical triplets. Keep technical precision: units, voltage classes, standards numbers and dates stay exact.
> - Keep the structure. Keep the parts, the chapter numbers, the figure numbers and the table columns. A table may be split or a paragraph turned into a list if that is clearer, but no chapter moves and no figure is dropped.
> - Scripted language stays scripted. "The sentence to say it in" (chapter 1) and "the one sentence" (chapter 10) are sales lines. Tighten them, but they must stay sayable aloud.
>
> ## The citation change — from tags to numbered superscripts
> Today every factual sentence ends in a bracketed tag such as <span class="t w">[WEB, verified 2026-09-23]</span> or <span class="t d">[DOSSIER megmeet v7]</span>. There are about 590 tags but only about 89 distinct strings; 245 of the 590 are the identical WEB tag. Replace them as follows.
> 1. One number per distinct source string. Every distinct tag string becomes one numbered reference: [DOSSIER megmeet v7] is one number, [PRIMER ch.6.1] another, [GUIDANCE nvidia-800vdc p17–21] another, [WEB, verified 2026-09-23] another. Number them in order of first appearance in the document, starting at 1. Do not split the WEB tag into per-URL numbers unless the sentence-to-URL mapping is already certain from the text: Appendix C lists the URLs, but which sentence used which URL was not recorded, and a guessed mapping is worse than a shared number.
> 2. The in-text marker is a superscript number coloured by tier, placed after the sentence's final punctuation, for example <sup class="c d">7</sup>. Keep today's five tier colours exactly (.t.p, .t.d, .t.g, .t.r, .t.w map to --s1…--s5). Define sup.c rules that reuse those variables, so the colour still tells the reader the tier at a glance.
> 3. Analysis is not a source, so it gets no number. An inline [ANALYSIS] becomes a gold superscript A (<sup class="c a">A</sup>). The labelled analysis boxes (.an) stay exactly as they are.
> 4. The rule stays one source per sentence. Every factual sentence still carries exactly one superscript. The one relaxation: a table cell or list item drawn wholly from one source carries one superscript at its end, which is already the document's convention for its wide tables.
> 5. Replace the citation-contract table on the "Read this first" page with a short legend: what a superscript number means, the five tier colours each with a one-line description of the tier, the gold A, and a pointer to the numbered list.
> 6. Add the numbered reference list as a new first section of Appendix C, "C.0 Numbered references". Give one row per number with the number (in its tier colour), the tier, and the full pointer: slug and version, chapter or figure, page range, or "web research of 23 September — see the URL list below". Keep the existing tier-grouped URL list under it.
> 7. Out of scope for renumbering: megmeet-sst-briefing-data.json and megmeet-sst-briefing-companion.html keep their tag strings, because the companion inlines the data file byte for byte. Figure captions that say "Composed from megmeet-sst-briefing-data.json" stay as they are.
>
> ## One content change, and only one
> Chapter 9.4's second table lists seven places where Megmeet dossier v8 contradicts the body: week-one question 6, chapter 16.3, the consensus figure, chapter 13's footprint line, chapter 9.3's US-entity paragraph, chapter 14 and question 10 on the LITEON story, and Appendix D.2's 10 kV / 35 kV note.
> Correct the body at each of those places so it reads true, and cite dossier v8 there. Keep both 9.4 tables as the record of what changed and when. Update the sentence above the second table that says the body "has not been changed to match", because after this pass that is no longer true. Apart from those corrections, every fact, number, date, name and source stays as it is. If you find something else that looks wrong, list it in your summary. Do not fix it.
>
> ## How to work
> - Go chapter by chapter, reading each one whole before editing it. Use targeted edits, never a whole-file rewrite, and follow the repository's Incremental Writing rule.
> - Before the first edit, copy the original HTML to your scratchpad. Write a small checker there, not in the repository, that compares the original with the edited file:
>   - every number token (digits with their units and signs) that exists in the original still exists in the edited file, except where the 9.4 corrections deliberately change one;
>   - every distinct original tag string maps to exactly one reference number;
>   - every superscript number resolves to a row in C.0, and every row in C.0 is used;
>   - no sentence ends a factual claim without a superscript or an analysis marker.
>   Run it after every chapter and fix what it reports before moving on.
> - Proof the PDF by looking at it. Build with --png and read every proof page. Then build the PDF and read the pages for the legend, the first chapter, chapter 9, and C.0. Report the page count before and after.
> - Get a fresh audit. When the rewrite is complete, give a fresh subagent no drafting context. Have it compare the original and the rewritten HTML chapter by chapter for three things: a fact that changed, a caveat or limitation that was dropped, and a concept explanation that got harder to follow. Work every finding.
> - Update Appendix D. Add a short note that the document was rewritten for clarity and its citations renumbered on the date of the run. Say what changed in the citation system and what did not. Do not name any AI model anywhere in the document; the colophon records effort and run window only, as it does now.
> - Commit and push under the repository's normal Pre-Commit and Pre-Push checklists. That means a repo CHANGELOG entry and a repo version bump. The study-prep files are not deployed, so there are no page or GAS version bumps.
>
> ## Do not touch
> - Any Profiler dossier, report, registry or segment file.
> - The data file, the companion, the figure script and the figures.
> - The older prep documents: the interview brief, the lesson plan and the study guide.
>
> ## Report at the end
> - Page count before and after, and the number of references in C.0.
> - The chapters where an explanation was expanded rather than cut, with one line each on why.
> - Anything you found that looks wrong but left alone.
> - The audit's findings and what you did with each."

The Megmeet SST onboarding briefing is rewritten for clarity and learning. Its 588 bracketed tier tags are now numbered, tier-coloured superscripts resolved in a new Appendix C.0, and the body is corrected at every place dossier v8 contradicts it. The PDF goes from 72 to 76 pages. The fresh-subagent audit is running against this version; its findings will be worked in the next push.

### Changed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`** — an editing pass, with no new research.
  - **Clarity.** Every term is defined at first use, long sentences are split, and repeated caveats are cut.
  - **Expanded explanations:**
    - chapter 1 gains a four-step walk through one SST, from primer figure 4;
    - I.2 explains the transformer equation and the I = P ÷ V arithmetic behind 18.5 kA;
    - chapter 6.2 works one cell count through the primer's own assumptions (0.935 kV per cell, 31.0 kV phase peak, 35 cells per phase).
  - **Structure.** Parts, chapter numbers, figure numbers and table columns are unchanged. Three paragraphs became lists: the cheat-sheet points, the rack ladder, and 5.5's advantages.
  - **Citations.** One number per distinct source string, 84 in all, numbered by first appearance, with `sup.c` rules reusing `--s1…--s5`.
    - All web research shares one number.
    - Inline `[ANALYSIS]` becomes a gold `A`. This also fixes two tags that carried the web colour.
    - The citation-contract table becomes a source legend.
    - Appendix C gains C.0, generated from the same mapping as the superscripts.
  - **Dossier v8 corrections**, each citing v8:
    - chapter 9.3's US footprint (the Richardson base);
    - chapter 13's footprint answer and its "never infer a class" cell;
    - chapter 14's LITEON row;
    - week-one questions 6 and 10;
    - 16.2's US-plant item and 16.3's greenfield contradiction, now marked resolved;
    - chapter 9.1's contrary-source box and D.2's 10 kV / 35 kV note.
    - Both 9.4 tables stay as the record. The two first-table rows that v8 revised are marked, and the sentence above the second table now says the body was corrected.
  - **Appendices.** A and B are regenerated from the rewritten chapter 1, so all three copies of the term system match.
    - Appendix C's dossier list adds `liteon v7` and `megmeet v8`, which were already cited in 9.4.
    - Appendix D gains a rewrite note, and D.2's pointers to the old citation-contract page are updated.
  - **Cover.** The footer is no longer absolutely positioned, because the longer BLUF overlapped it.
- **`repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`** — rebuilt: 76 pages. The `--png` proofs were read page by page.
- **`README.md`** — the tree descriptions for the briefing PDF (page count) and its source (the citation form) are updated.

### Notes

- **Not touched:** the data file, the companion, the figure script and the figures (their captions keep the original tag strings), the Profiler data, and the older prep documents.
- **Checker (scratchpad only)** compares the original and the edited HTML: number tokens, the tag → number mapping, C.0 coverage and uncited sentences. It is clean. The two number-token exceptions are formatting only (`342 x` → `342 ×`, and `native-800` reworded).
- **Archive rotation is not due.** The counter reads `105/100`, but 13 sections carry today's date, leaving 92 non-exempt.

## [v07.33r] — 2026-09-23 06:59:05 PM EST

> **Prompt:** "[Image attached: the briefing's "The Citation Contract" page — the five colour-coded source tiers (PRIMER, DOSSIER, GUIDANCE, REPORT, WEB) and the ANALYSIS label]
> I want all of the six contradictions to be reflected in briefing chapter 9.4 and want you to issue a superseding edition of the 9/23 report. I also want you to push the in-hall-power adjacent membership by regenerating segment-in-hall-power in Classroom.gs. I also want you to remove the reminder to "paste the Megmeet SST briefing prompt".
>
> Also, I want you to review the entire Megmeet SST brief with [model name withheld] and rewrite anything that could be more concise or clearer since I heard [model name withheld] writes the most like a human. I also want you to simply number the attached Citation sources and add the superscript number after the cited statement. That way, we can cut down on repeated letters and shorten the overall report. It also looks cleaner. I like the color-coded sources though, so keep that. While you are evaluating how to rewrite parts of the report, keep in mind that I will be the one reading the report and my goal is to learn, so write concisely but prioritize explaining concepts thoroughly over concision. I would like this review/rewrite task to be in a separate [model name withheld] session, so give me a prompt to paste into a new [model name withheld] session and recommend an effort level for me to set [model name withheld] to."

Follow-through on dossier v8. Chapter 9.4 of the briefing now records the six contradictions, the 23 September report is superseded by a second edition, Megmeet's `in-hall-power` adjacent membership is restored with its Classroom lesson regenerated, the briefing reminder is closed, and a paste-in prompt is written for a separate clarity-and-citation rewrite of the briefing.

### Added

- **`live-site-pages/profiler-data/reports/sst-hall-edge-block-rev2--competitive--2026-09-23.report.json`** — the superseding edition.
  - The id changes the topic slug rather than the date, because today's date already names the morning edition and the id format is `<topic>--<type>--<date>`.
  - It re-pins Megmeet v8, Delta Electronics v6 and LITEON v7; the other fifteen pins are unchanged.
  - A new first section, "What changed since the morning edition", lists the changes.
  - Key judgement 3 (Megmeet's class) now rests on the full filing search and bounds the 10 kV / 35 kV press lead against the filed IR record.
  - Key judgement 4 corrects "the only segment with an expanding gross margin" to "the only one of the three largest", and replaces the contested number-two account with its rumour origin and the third-source estimate.
  - Key judgement 8 adds the Richardson base.
  - The Megmeet rows in the class and Asia-set tables are updated, and the Megmeet section gains the company's own two-to-three-year SST timing.
  - 13 citations added (c47–c59), copied verbatim from Megmeet v8's `sources[]`, for 59 in total.
- **`repository-information/megmeet-briefing-rewrite-prompt.md`** — the prompt for the separate rewrite session:
  - clarity-first editing for a reader who is learning;
  - one number per distinct citation source (about 89), shown as tier-coloured superscripts, with a gold `A` for inline analysis;
  - a new C.0 numbered reference list, and a legend replacing the citation-contract table;
  - the dossier-v8 corrections applied to the body;
  - a scratchpad fact-preservation checker, PNG proofing and a fresh-subagent audit.
  
  The file names no model.

### Changed

- **`repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html`** and the rebuilt **`MEGMEET-SST-BRIEFING.pdf`** (71 → 72 pages):
  - Chapter 9.4 is retitled "What the dossier now contradicts — v7 in the older prep documents, v8 in this briefing" and gains a second table of seven rows:
    1. The Q1 2026 date covers AIDC delivery generally; North America's batch delivery is H1 2026.
    2. The greenfield-versus-Q1 tension resolves: volume, but no named reference win.
    3. Consensus is RMB 787M, not 832M.
    4. Chapter 13's footprint line overclaims: manufacturing is in China and Thailand, with contract manufacturing in India and R&D in Germany.
    5. The US base is located in Richardson, Texas, but not in the filings.
    6. The LITEON story is closed as rumour, with Megmeet a prospective third source.
    7. The D.2 10 kV / 35 kV lead is now read and bounded.
  - The colophon gains a dated amendment note. The body is otherwise unchanged; the rewrite session applies the corrections to it.
  - The data file and the companion are not touched.
- **`live-site-pages/profiler-data/reports/reports-index.json`** — the new edition is added as `current`, and the morning edition is flipped to `superseded`.
- **`live-site-pages/profiler-data/profiler-segments.json`** — Megmeet is restored to `in-hall-power` as `adjacent`. The basis is the storage-compensation layer named in the H1 2026 interim: BBU and capacitor shelves, and a DC-centre BESS. The registry mirror is synced.
- **`googleAppsScripts/Classroom/Classroom.gs` v01.87g → v01.88g** — `segment-in-hall-power` regenerated with `build-classroom-segments.py --segment in-hall-power`. Seven sections changed: players, connections, numbers, fence, where-it-sits, what-moved and read-next. `power-conversion-and-rack-power-silicon` is still due from the v8 basis-line change and was left for a separate regeneration.
- **`repository-information/REMINDERS.md`** — "Paste the Megmeet SST briefing prompt" moved to Completed Reminders at the developer's instruction; Active Reminders is now `*(none)*`.
- **`README.md`** — tree entries added for the rev2 report and the rewrite prompt; the Classroom GAS version display is updated.

### Notes

- **Checks:**
  - `check-profiler-reports.py`: 0 errors. The morning edition's three aged-pin warnings are gone now that it is superseded.
  - `check-classroom-content.py`: 0 errors.
  - `check-classroom-pipeline.py --selftest`: 15 of 15 pass.
  - Gate digest: `check-classroom-pipeline.py --base origin/main` shows no P3 finding, so `gateDigest` is unchanged. Its P1 write-set findings bind only unattended pipeline runs, not a developer session.
  - `node --check` and `check-gas-inner-scripts.js` pass, and the Profiler registry, relationship and cross-reference checks are clean.
- **Prompt blockquote:** the model name in the prompt is replaced with `[model name withheld]`, because this environment forbids model identifiers in repository files. Everything else is verbatim.
- **Archive rotation not performed:** 92 non-exempt sections, and today's are exempt. The Classroom GAS changelog reaches `50/50`, which matches the Profiler page changelog's precedent of rotating only when it exceeds 50.

## [v07.32r] — 2026-09-23 03:51:59 PM EST

> **Prompt:** "profiler Megmeet
>
> This is a **revision**, not a new profile: `live-site-pages/profiler-data/megmeet.profile.json` is at
> profileVersion 7, dated 2026-09-08, 38 sources. Cut **v8**. Follow the Profiler Command in
> `.claude/rules/profiler-app.md` end to end — archive v7 first, then research, write, register, sync,
> reconcile. Read `repository-information/PROFILER-SCHEMA.md` before writing.
>
> WHY NOW: Megmeet's Q3 2026 report is due at the CSRC statutory deadline **by 31 October 2026**. Cut v8
> before it lands so the delta is legible when it does, and so the September briefing's open questions are
> carried into the dossier rather than living only in a study-prep document.
>
> IDENTITY FIRST (step 1a — do not skip, and do not take these from the registry row):
> - Ticker/exchange: the registry says `SZSE: 002851`. Confirm off a filing cover or an exchange notice
>   dated within twelve months.
> - Legal name vs operating brand: v7's `name` field carries both the English and the native-script name
>   but `legalName` is **null**. Establish the registered legal name and set it.
> - `aka[]` is **null** and must be populated before step 7's reconciliation grep, which consumes it.
>   At minimum: 麦格米特 · Shenzhen Megmeet Electrical Co., Ltd. · Megmeet Welding (megmeet-welding.com) ·
>   Megmeet USA. Add any others you establish.
> - Still independent? Check for any transaction in the last eighteen months, and specifically the status
>   of the **pending Hong Kong listing** — v7 records it as pending and it may have moved.
>
> THE OPEN QUESTIONS TO GO AT. These are the holes the 23 September onboarding briefing named as
> unclosable from the then-current record. Each is a research target, not an assumption — if the record is
> still silent, record the silence and bound it:
> 1. **The SST's service-voltage class.** Zero "kV" mentions across all 38 sources pinned in v7 and zero
>    hits in a four-filing text scan (FY2025 annual, H1 2026 interim, two IR records) for kV, 千伏 or 中压.
>    The converter is described only as "grid HV input to 800 V DC", and the most recent filing narrowed
>    the efficiency claim to *expected*. This is the single most valuable fact in the dossier.
> 2. **What Q1 2026 "volume delivery to North American majors" actually consisted of, and who they were.**
>    v7 records it; the August 2026 interview brief says North America is greenfield with no reference win.
>    Both statements are in the corpus and they are not obviously reconcilable.
> 3. **Whether the US plant Megmeet confirmed in November 2024 is the Dallas facility.** The company
>    confirmed a US factory and never named location, capacity or timeline. The Dallas *laboratory*
>    (360 kW active, 1.5 MW roadmap, June 2026) is separately and firmly evidenced by Megmeet's own
>    English release — the two are not confirmed to be the same thing.
> 4. **Any AI-data-centre revenue line at any granularity.** None is disclosed; the power-products group
>    is the closest published proxy (+60.92% to RMB 1.841bn in H1 2026 at a 25.06% gross margin).
> 5. **FY2025 gross margin by segment beyond the appliance line**, and **absolute R&D spend** for FY2025
>    and H1 2026. Neither was located.
> 6. **Any named US customer for any product line.** None located. (Ericsson, Cisco, Juniper, Arista and
>    Accton are recorded as buying Megmeet power — establish whether any is a *US-entity* relationship.)
> 7. **OCP membership and any role in the LVDC SST specification work.** Not found, but opencompute.org
>    returned HTTP 403 to every attempt, so this is an unverified negative rather than a confirmed one.
>    If the host is reachable from your session, settle it.
> 8. **Any UL or ETL listing number for a data-centre product.** None disclosed; the company claims UL,
>    TÜV and CNAS *laboratory accreditations*, which are an in-house testing credential and not a listed
>    product. Do not let the two be conflated in the prose.
> 9. **The "displaced LITEON as the number-two NVIDIA power-shelf source" claim.** No supporting source was
>    located, the company has never claimed it, and two research houses covering the same market in
>    mid-2026 name Delta and LITEON without mentioning Megmeet. If v8 finds nothing either, say so
>    explicitly rather than omitting it.
>
> SOURCING:
> - Run `python3 scripts/check-source-reachability.py` before planning Stage 2.
> - **v7 has zero sources marked first-party** (`party` is absent on all 38) even though the registry
>   reports 58% first-party. Stage 1 is therefore genuinely under-served: exhaust megmeet.com,
>   megmeet-welding.com, the IR archive, cninfo filings and the product/datasheet pages before any
>   third-party source, and set `party` on every entry so the registry's coverage line means something.
> - Two parallel general-purpose subagents (A first-party, B third-party), ~50–70 evaluated sources.
>
> RECONCILIATION (step 7 — 13 other dossiers mention Megmeet with word boundaries):
> delta-electronics · dg-matrix · flex · huawei-digital-power · infineon · liteon · nvidia ·
> power-electronics · sinexcel · sungrow · vertiv · vicor · zhonhen. Read each hit, classify it, and act.
> Then run `check-profiler-crossrefs.py`, `sync-profiler-registry.py`, `build-profiler-graph.py` and
> `check-profiler-relationships.py`. Re-read the segment membership
> (`power-conversion-and-rack-power-silicon`, role `challenger`) against the revised `ecosystemRole` and
> product lines and move it if the record moved.
>
> DO NOT EDIT the September study-prep files — `MEGMEET-SST-BRIEFING.pdf`, its print HTML, the companion,
> the data file, or `sst-hall-edge-block--competitive--2026-09-23.report.json`. They are dated documents.
> If v8 contradicts any of them, say so in your response summary and let me decide; the briefing's
> chapter 9.4 is where that list belongs, not in this commit.
>
> Normal Pre-Commit and Pre-Push checklists. Note that the repo CHANGELOG counter is at 102/100 with 92
> non-exempt — **archive rotation fires on the first push that is not dated 23 September**, so expect to
> perform it, SHA-enriched, and deepen the clone first with `git fetch --unshallow origin main`."

Megmeet dossier cut to **profileVersion 8** under the Profiler Command, ahead of the Q3 2026 report due by 31 October. Two parallel research agents (A first-party, B third-party) evaluated about 100 sources; v8 cites 81, each with an explicit `party` (29 company · 20 disclosure · 32 independent — 60% first-party). Reconciliation revised the Delta Electronics and LITEON dossiers, where the "Megmeet displaced LITEON at #2" claim had been carried as corroborated.

### Changed

#### `live-site-pages/profiler-data/megmeet.profile.json` — v7 → v8 (v7 archived)

- **Identity verified off filings dated within twelve months.** SZSE: 002851 from the H1 2026 interim cover; registered names 深圳麦格米特电气股份有限公司 / "Shenzhen Megmeet Electrical Co.,Ltd." from the FY2025 annual report and the HKEX A1; former name "Shenzhen Megmeet Electrical Technology Co., Ltd." The legal name stays in `name` — the schema's canonical field, which the renderer already treats as the legal line when it differs from `shortName` — rather than adding the `legalName` variant shape the schema says to normalise away
- **Still independent.** No merger or sale. On **22 September 2026** the board agreed to buy the 46.30% minority of Shenzhen Megmeet Welding Technology for RMB 663.64M cash (announcement 2026-085). The **H-share A1** (filed 26 June; Huatai International and Citi; CICC HK and CMBI added 8 July) has **no hearing and no CSRC filing notice** on record as of 23 September
- **The nine open questions:**
  1. **SST voltage class — still undisclosed, now bounded.** No kV figure appears in any filing, IR record, product page (neither site has an SST page) or the April 2026 brochure. The efficiency wording went from an unqualified "超98.5%" (FY2025 annual) to "expected" (HKEX A1, H1 interim), and the SST is 预研 / 研发中. One press lead, ifeng (1 July 2026), reports "国内10kV/海外35kV" and attributes it to the 20 May call, but **the exchange-filed record of that call contains no kV**. In August the company said SST demand will not ramp for 1–2 years and that sales for 2–3 years will come from existing products
  2. **North America — the v7 wording was imprecise.** The interim dates the start of AIDC batch delivery to Q1 2026 **across its customer chain**. The North America sentence is separate: batch delivery to "部分北美大客户" in **H1 2026**, and by the 29 April annual-report date. No customer is named (NDA). The company says it was **late on GB200** with limited orders and won GB300 batch orders; Goldman (via Sina) says the first GB300 order ran through a US-headquartered ODM. That reconciles the two corpus statements: there is volume but no named reference win
  3. **US plant — located, but not in the filings.** The company's own About pages place a 35,000 sq ft "U.S. manufacturing base" in the Fujitsu Industrial Park in Richardson, Texas, and a Texas TDLR record shows a 39,200 sq ft Megmeet renovation at 2821 Telecom Parkway, Richardson (2024). The HKEX A1 lists six manufacturing bases and none in the US, and the Dallas lab release does not say it is on the same site
  4. **AI-data-centre revenue — none disclosed.** The closest statement is the August IR record: data-centre and network power grew most within the +60.92%
  5. **Found.** FY2025 segment gross margins are appliance controls 22.24% · power 22.33% · NEV 15.30% · automation 27.96% · equipment 38.51% · connection 5.06%. R&D was RMB 1,122.34M in FY2025 and RMB 621.38M in H1 2026 (the latter was already in v7)
  6. **No US-entity customer relationship is disclosed.** The Ericsson/Cisco/Juniper/Arista/Accton list originates in the company's periodic reports and its reply to the exchange inquiry, with no entity or geography given
  7. **OCP — exhibitor only.** The company exhibited at OCP Summit 2024 and 2025 and describes its products as "aligned with ORv3". Membership remains unverifiable because opencompute.org and web.archive.org both returned 403
  8. **UL — marks and lab programmes only.** The datasheets carry UL marks. UL-WTDP and UL-CTF are in-house lab programmes and stay separate from product listings in the prose. No UL or ETL file number is published for any data-centre product
  9. **The "#2 behind LITEON" claim is not supported, and v8 says so explicitly.** It traces to two early-2025 pieces that label it rumour (Sohu 2025-02-10; 产业家 2025-03-13). The company deflected the question in December 2024. Soochow (April 2026) expects Megmeet to be the **third** NVL72 PSU source, and the "~41% Delta" figure appears in no source
- **NVIDIA status sharpened:** the exchange inquiry reply defines it as a place on NVIDIA's recommended list to its downstream customers; NVIDIA's October 2025 post puts Megmeet in power-system components, not in the data-centre power-systems tier where the SST vendors sit
- **Errors in v7 corrected:**
  - The summary said power products was "the only segment with an expanding gross margin". Three of six expanded; it is the only one of the **three largest** to do so
  - The FY2024 commentary carried "~¥8.66B" FY2026 consensus. Current consensus is RMB 787M (15 institutions, 同花顺, 23 Sept), not the RMB 832M v7 recorded
  - The H1 period type `interim` is not a schema value and is now `half`
  - The footprint claim that manufacturing covers Germany is removed. Germany is R&D, and India is contract manufacturing
- **Rewritten in intel-briefing style:** products (FY2025 and H1 2026 segment margins, the three-layer AIDC framing, the welding buy-out); 24 recent developments (+9 new); technical specs (a new SST-status group and a new DC-DC brick group); leadership (shareholdings; Zhang Zhi as COO; Han Longfei as power-BG CTO); financials; strategy read (five judgments, with rank, SST, US footprint and H2 weighting); relationships (NVIDIA, LITEON and Delta re-sourced; Infineon, Vertiv and Zhonhen added); policy exposure (the filed tariff mitigation is Thailand)
- **Sources: 38 → 81**, with `party` on every entry. All 38 v7 URLs are kept with their v7 labels and dates, because the 23 September report copies them verbatim

#### Corpus reconciliation (Profiler Command step 7)

- **13 inbound dossiers reviewed and 2 changed.** The alias grep over the new `aka[]` found no additional dossiers
- **`delta-electronics.profile.json` v5 → v6 (v5 archived):** `ecosystemRole`, `strategyRead[2]` and the Megmeet relationship no longer carry the #2 claim as "directionally corroborated". They now state its rumour origin and Soochow's third-source estimate, with sources added
- **`liteon.profile.json` v6 → v7 (v6 archived):** the same correction to `ecosystemRole`, `strategyRead[2]` and the Megmeet relationship
- The other 11 mentions are roster, tier or contrast statements that v8 leaves accurate, so they are unchanged

#### Registry, segments, calendar

- **`profiler-companies.json`:** Megmeet gains `aka[]` (12 names: 麦格米特 · 深圳麦格米特电气股份有限公司 · Shenzhen Megmeet Electrical · Shenzhen Megmeet Electrical Technology · 麦米电气 · Megmeet Welding · Megmeet Welding Technology · 麦格米特焊接 · MEGMEET USA · Megmeet USA · Altatronic · MEGMEET), `megmeet-welding.com` in `domains`, and a new tagline. Sync: srcTotal 38 → 81, srcFirstPct 58 → 60; Delta 16 → 20 sources; LITEON 15 → 19
- **`profiler-segments.json`:** the `power-conversion-and-rack-power-silicon` membership stays `challenger`, now on the v8 basis line
  - An `in-hall-power` adjacent membership (BBU and capacitor shelves, DC-centre BESS) was drafted and then withdrawn. It would have required regenerating the `segment-in-hall-power` literal in `Classroom.gs`, and that is left for the developer to decide
- **`profiler-graph.json`** rebuilt (1482 edges, 1108 curated)
- **Refresh calendar:** megmeet, delta-electronics and liteon set to `lastRefreshed` 2026-09-23. Megmeet's `nextReport` stays 2026-10-30, unconfirmed: no appointment date is on record, and Q3 2025 was published 2025-10-30
- **Refresh notes:** Megmeet's watch list rewritten around v8's open items

#### `README.md`

- Archive entries added to the tree for `delta-electronics.profile.v5.json`, `liteon.profile.v6.json` and `megmeet.profile.v7.json`, plus the missing `megmeet.profile.v6.json`, which was on disk but absent from the tree

### Notes

- **Checks:** `check-profiler-crossrefs.py` 0 candidates · `check-profiler-relationships.py` 0 findings · `sync-profiler-registry.py --check` in sync, calendar in bijection · `check-classroom-content.py` 0 errors · `check-profiler-study.py` 0/0 · `check-profiler-reports.py` 0 errors (the six new warnings are the expected aged-pin notices on the 8 and 23 September reports)
- **Source reachability:** the SEC hosts, opencompute.org, web.archive.org and UL Product iQ returned 403, and szse.cn failed TLS; cninfo and hkexnews answered. A null from a blocked host bounds that host only
- **Archive rotation not performed:** 92 non-exempt sections against a trigger of 100. This push is dated 23 September, so today's sections are exempt
- **The September study-prep files and the 23 September report were not edited.** The contradictions v8 introduces are listed in the session summary for the developer

## [v07.31r] — 2026-09-23 10:28:38 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phases E and F of the Megmeet SST onboarding briefing run: **D3, the study companion**, and the **audit pass**. A fresh subagent with none of the drafting context audited the finished PDF against the plan's twelve-line rubric and returned thirty-five findings. All thirty-five were worked, the PDF and the figures were rebuilt, and every checker re-run. This closes the run.

### Added

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-companion.html`

- **The study companion: seven drill widgets in one self-contained file** — a conversion-chain explorer that adds up the published stage losses and says why the totals are not an efficiency delta; a service-voltage and cell-count calculator; a loss-chain comparator that **refuses to subtract two figures whose boundaries differ** and says so; a competitor map with four filters and a Megmeet-against-X card; a programme timeline on a date slider; a Leitner flashcard deck over the twenty-six terms and twenty-three numbers, kept in `localStorage` inside try/catch and working without it; and an objection drill.
- **The data file is inlined byte for byte**, so the companion and the briefing's fourteen figures cannot disagree. No CDN, no network call of any kind, no external `src` or `href` — it opens from `file://`. Playwright-tested: every widget driven, **zero console errors, warnings, or failed requests**, screenshots kept in the session scratchpad.

### Fixed

*Thirty-five audit findings. The five that changed what the document says:*

- **"The only expanding gross margin in the company" was false on the document's own data.** Three of Megmeet's six segments expanded their gross margin in H1 2026 — power products 22.2→25.06, magnetics 5.1→8.79 and intelligent equipment 36.0→39.67 — and two pages in Part IV said so in words while the claim was repeated five times elsewhere. It now reads *the only one of the three largest segments to expand*, in the data file and in every instance.
- **The NC State / NYPA / EPRI unit was filed as class-undisclosed when the primer states its class.** The primer gives a 1 MVA unit on a **13.2 kV** feeder, June 2026, 15 kV SiC MOSFETs, energised more than ten times — so the strongest field evidence in the document was sitting in the undisclosed block with its evidence tier reading `undisclosed`, and the `field pilot` tier was empty across the whole ledger. It is now a ledger row at 13.2 kV / 1 MVA / `field pilot`, the ledger is regenerated from the data in the sort order its own intro claims, and the counts that depended on it are corrected.
- **Three figures asserted per-row sourcing they did not print.** The perspective matrix, the calendar and the business-group board now render each row's tier tags, in the tier's colour, exactly as the data file stores them. The perspective matrix was resized so that it and its caption fit one printed page — its caption had been orphaned onto the next page.
- **Part V's scope note promised a tier tag on every fact inside an answer**, which chapters 13 and 15 did not do. The note now states the convention actually used — a fact that appears only in Part V carries its tag there, a fact restated from Parts I–IV carries it where it is established — and the one fact that appeared only in Part V was tagged.
- **The cell-count multiplier appeared as 2.5×, 2.3× and 2.7× on one page.** The primer's 2.5× is the round number for the class step; the counts computed on the primer's own assumptions give 2.3× from 13.8 kV and 2.7× from 12.47 kV. All three are now stated together with which is which, and the week-one question repeats the range rather than the round number.

*And thirty more, including:* the cover's bottom-line-up-front carried fourteen untagged factual sentences on the page that promises every factual sentence carries a tier, and is now tagged sentence by sentence with its judgement moved into a labelled analysis block; four dossier versions listed in Appendix C were never cited and are now separated from the seventeen that are; the line-frequency transformer's efficiency was printed reversed and a point low as "99.0–98.5%"; "eight of the sixteen vendors share two cells" was seven of seventeen; "nine obstacles have no visible owner" was eight of the ten unsolved, with the family split restated; the lineage matrix promised ten scored attributes and scores nine; the calendar listed a quarter out of chronological order; the objection script implied US manufacturing that chapter 9 says is not claimed; the side rack borrowed the sidecar's 1 MW rating; a Heron dossier tag was covering an NVIDIA guidance fact and a single primer tag was covering four sources; a certification cost estimate named no source; `[ANALYSIS]` was used inline without being declared in the citation contract; and the colophon mis-located the hearsay box and overstated what the proof pages covered.

### Changed

#### `README.md`

- Tree entry for the study companion. `check-readme-tree.py` clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation is still not due.** The counter reads `Sections: 102/100` and nine sections carry today's date: 92 non-exempt against a trigger of 100, unchanged across all three pushes in this run.
- The companion is also published as a **private Claude artifact**; the repository file remains the source of truth.
- One CSS bug is worth recording because it was invisible: the companion's widget-panel class was `.w`, which collided with the WEB tier class `.t.w` and set `display:none` on **every** `[WEB, verified …]` tag on the page. The panel class is now `.panel`, and the Playwright test asserts that no tier tag is hidden by CSS.

## [v07.30r] — 2026-09-23 09:27:04 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phase D of the same run: **D2, the sixty-nine-page onboarding briefing PDF**, its source HTML, the data file every figure reads from, fourteen new figures and the two build scripts. The `--png` proof pages were rendered and read page by page before the PDF was called done, and eight defects they exposed were fixed — the largest being a term table blown off the page by an unbreakable URL inside a tier tag. The study companion (D3) and the Phase F audit follow in the next push.

### Added

#### `repository-information/study-prep/megmeet/MEGMEET-SST-BRIEFING.pdf`

- **Sixty-nine pages in five parts with fourteen figures**, on the SST primer's print skin with a running header and page numbers. Part I is the cheat sheet, the twenty-three numbers, the five things that moved since the primer's 12 September watch-list and the calendar to day one; Part II is the technology (the term system, lineage and adjacency, what NVIDIA specifies, the value case as a perspective matrix, and limitations with a mitigation, an owner and a status word); Part III is the market (the pilot-and-test ledger with the 34.5 kV argument in cells and BIL, twenty-five obstacles each with a named owner, and what NVIDIA's and Oracle's engineers will actually ask); Part IV is Megmeet against the field; Part V is the sales layer, analysis throughout, ending with the ten week-one questions ranked by decision leverage and everything that could not be determined named rather than smoothed over.
- **A citation contract enforced sentence by sentence.** Every factual sentence carries exactly one of `[DOSSIER <slug> v<n>]`, `[PRIMER ch.x / fig.n]`, `[REPORT 2026-09-08]`, `[GUIDANCE nvidia-800vdc p<n>]` or `[WEB, verified 2026-09-23]`, or sits inside a block labelled analysis. The reader's hearsay about NVIDIA and Oracle engineering contact is boxed once on the contents page, labelled unverified, and cited nowhere.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-data.json`

- **The single source for every number in a figure or a widget** — 214 tagged records across the class ledger, the cell-count arithmetic, the business mix, twenty-five obstacles, two programme timelines, the watch-list delta, the conversion chains, the competitor map, the six business groups, twenty-six terms, ten perspectives, the lineage matrix, seven objections, ten things not to say, the ten week-one questions, the calendar and twenty-three numbers to know. Written before the figures and before the companion so the two cannot drift.

#### `repository-information/study-prep/megmeet/megmeet-sst-briefing-figures/`

- **Fourteen figures, `mmsst-fig-` prefixed**, generated from the data file on the primer's palette (re-validated against the dataviz skill's six checks on the white print surface — all six pass). No primer figure was copied; where one exists it is referenced by number.

#### `scripts/build-megmeet-sst-briefing-figures.py` and `scripts/build-megmeet-sst-briefing-pdf.mjs`

- Copies of the primer's two build scripts with the paths, the figure prefix and the DevTools port changed. The figure script's one structural difference is that it reads the data file rather than carrying numbers inline.

### Fixed

- **A term table was silently blown off the page by a URL inside a tier tag.** Four tags in chapter 1 carried a full source URL, which has no break opportunity, so the table's minimum width exceeded the page and the fourth column rendered off-paper while the rows grew to half a page each. URLs were moved to Appendix C (all forty-seven were already listed there), `overflow-wrap` was added as a safety net for every table cell, and the status chips were pinned `nowrap` so the net could not break them mid-word instead.
- **Every blended tier tag was split.** Eighty-five tags in the data file and twelve sites in the document carried two tiers; each now carries one tag per sentence, and the two scripted columns — *the sentence to say it in* in chapter 1 and *the one sentence* in chapter 10 — are labelled analysis in their chapter rather than tagged per cell. The convention for the wide reference tables is stated on the contents page.
- **Six figure defects the proof pages exposed**: text overrunning both panels of the watch-list figure; the day-one rule drawn through the next row's heading in the calendar; the class guides crossing the value labels of the 10–13 kV vendors in the class ledger; the 34.5 kV usage note truncated mid-word in the voltage ladder; a falling-margin label printed on top of its own start marker in the business-mix panel; and the two programme lanes bottom-aligned instead of top-aligned in the timelines.
- **A fourteenth figure had been generated and never placed.** The published-chain-loss chart is now Figure M4 in chapter 3, where the efficiency boundary argument is made, and the figures that followed it were renumbered.

### Changed

#### `README.md`

- Tree entries for the PDF, the source HTML, the data file, the figures directory with all fourteen SVGs listed individually, and the two build scripts. `check-readme-tree.py` is clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation was evaluated again and is still not due.** The counter now reads `Sections: 101/100`, but the threshold tests the **non-exempt** count and nine sections carry today's date: 92 non-exempt, unchanged from the previous push and below the trigger. Scenario A in the rotation examples.
- The model identifier was removed from the briefing's colophon; repository artefacts carry the effort and the run window, not the model name.

## [v07.29r] — 2026-09-23 08:03:13 AM EST

> **Prompt:** "Run the Megmeet SST onboarding briefing — the v2 plan in repository-information/megmeet-briefing-prompt.md. Read that file end to end first: §2 is the scope, §3 the deliverables and the table of contents, §5 the phases, the checkpoint pushes and the Phase F rubric you will be checked against. This is an unattended overnight run: no AskUserQuestion, no plan mode — resolve every ambiguity with a stated assumption and record it in the colophon. [CONTEXT, READ FIRST, SCOPE, DELIVERABLES, HARD RULES, PHASES AND PUSHES and FINAL MESSAGE sections follow in the full prompt, which is §6 of the plan file verbatim plus the developer's start-date and hearsay context.]"

Phase C of the Megmeet SST onboarding briefing run: **D1, the Profiler competitive report on the solid-state-transformer and medium-voltage hall-edge block**, authored from covered dossiers only and cut on the axis the 8 September AIDC edition could not score — the service-voltage class each vendor has actually specified. Eighteen dossiers in scope, 46 citations copied verbatim from their `sources[]`, `check-profiler-reports.py` clean. Phases 0, A and B (pre-flight, the corpus read into two scratchpad ledgers, and five bounded web-research subagents) ran before it; the briefing PDF and the study companion follow in later pushes.

### Added

#### `live-site-pages/profiler-data/reports/sst-hall-edge-block--competitive--2026-09-23.report.json`

- **A competitive report scoring eighteen vendors on disclosed service-voltage class** — `megmeet`, the four venture SST vendors (`heron-power`, `amperesand`, `dg-matrix`, `novos-power`), the Asia-headquartered set (`sungrow`, `zhonhen`, `sinexcel`, `delta-electronics`, `liteon`), the incumbents that have declared an 800 V DC position (`abb`, `ge-vernova`, `eaton`, `schneider-electric`, `vertiv`, `hitachi-energy`, `siemens-energy`) and the silicon layer (`infineon`). It **builds on and does not supersede** `aidc-power-conversion--competitive--2026-09-08`: different cut, different question, both current.
- **The finding the cut exists to expose** — the commercial leader and the specification leader are different companies, and the class is why. The only covered vendor a filing describes as supplying an MV-to-800 V DC solid-state transformer is specified 10–13.8 kV and stops there; the two most completely specified 34.5 kV-class products belong to the two smallest balance sheets in the report and neither has shipped; the only orderable solid-state medium-voltage product from an incumbent is a UPS, not a transformer; and the one venture vendor shipping hardware ships a 480 V AC skid whose own datasheet reads 96–97% peak, two to three points below its platform claim.
- **Megmeet's row is the report's own subject and it reads `undisclosed`** — across the thirty-eight sources pinned in its dossier no kV figure appears anywhere for its solid-state transformer. Its disclosed position is the rack and the sidecar (which converts 380–480 VAC, not medium voltage), where the H1 2026 interim measures the power-products group growing 60.92% at the company's only expanding gross margin. The report states the competitive risk as structural rather than commercial: the block above the rack may consolidate before Megmeet's converter has a class to quote.
- **Eight confidence-tagged key judgments, seven sections** (a what-this-adds prose section, the service-voltage class table, the venture-set table, the Asia-set table, a normalized-revenue bars figure and a labelled analysis section on Megmeet's position), **seven indicators** and **ten limitations**, in the registry's active `intel-briefing` style.
- **The honesty block carries eight gaps**, led by Megmeet's undisclosed class and by the fact that the four venture vendors closest to the block carry no normalized revenue at all — so the scale chart omits precisely the companies whose products are nearest to it. That is stated as the finding rather than left as a hole.

### Changed

#### `live-site-pages/profiler-data/reports/reports-index.json`

- Registered the new report newest-first as `current`. No `supersedes` and no status flip on any existing entry — this edition does not replace one.

#### `README.md`

- Tree entry for the new report, and the **missing entry for `aidc-power-conversion--competitive--2026-09-08.report.json`** restored — the current AIDC edition had never been listed, only its superseded 2026-08-29 predecessor. `check-readme-tree.py` is clean.
- `Last updated:` and `Repo version:` refreshed.

### Notes

- **Archive rotation was evaluated and is not due.** The counter reads `Sections: 100/100`, but the threshold in `CHANGELOG-archive.md` steps 1–3 tests the **non-exempt** count, and 8 of the 100 sections carry today's date (2026-09-23) and are exempt: 92 non-exempt is below the trigger. This is Scenario A in the rotation examples — a total at or above 100 does not by itself rotate. The clone was deepened at session start regardless, so a rotation on a later push in this run will resolve its SHAs.
- No Profiler page bump: report JSONs and the index are data-only, so the Profiler page is an indirect affect ([PC-HTML-VERSION] #2 does not fire).

## [v07.28r] — 2026-09-23 07:30:03 AM EST

> **Prompt:** "I want to run the Megmeet SST briefing overnight and wake up to a very robust comprehensive downloadable PDF that carefully considered what information I should know prior to starting a job as their "Senior Sales Manager - SST Solutions". I heard that they are in active communication with NVIDIA and Oracle's engineering teams, so I need to understand SSTs in their entirety: technical terminology, comparison with previous and adjacent technology, value in 800Vdc power infrastructure (shown from different players' perspectives), limitations and what relevant players are doing about it, which players are testing SSTs (preferably 34.5kVac instead of 12.47kVac), what obstacles are blocking its adoption (technical limitations, infrastructure issues, operation & maintenance issues, etc.), and anything else you can think of. I also want to have a good understanding of Megmeet's competitors and how we compare to them (specifically on SSTs, but I also want to know our relative positions in adjacent business units too). I want you to use as many tables, graphs, timelines, charts, diagrams, pictures, and other mechanisms to ensure I properly understand and can memorize this information. If you think interactive widgets would be useful for me to understand a specific concept, feel free to build it and present the widget(s) to me in whichever format you think would be most convenient for me. Fold this context in with the original briefing plan and carefully consider how to plan, execute, and check a comprehensive report for me - I will want you to give me a prompt to paste into a new session. Also consider which AI model and effort level I should use to generate the most cost effective report with practical usefulness and recommend it to me with reasoning. Then, give me the prompt with recommended model/effort level."

The Megmeet SST onboarding briefing plan rewritten as **v2** — the developer's widened scope folded into the deferred v1 prompt: a pre-flight run today, a corpus inventory, an ask-by-ask delta, the deliverables, a model and effort recommendation (Opus 5 `xhigh`, with the alternatives set aside and why), a phased overnight run with three checkpoint pushes and a twelve-line check rubric, the paste-in prompt, a resume prompt and a night-of checklist. Nothing was built or researched beyond the plan; the reminder in `REMINDERS.md` is untouched (developer-owned — its v1 budget line is now superseded by the plan's §4).

### Changed

#### `repository-information/megmeet-briefing-prompt.md`

- **§0 Pre-flight results as of 2026-09-23** — both v1 checks run while writing: the quarterly core queue reads `dueCount: 0`; the SST four are at v1/v2 dated 2026-09-12 → 09-19; Megmeet is v7 (2026-09-08); Oracle v5 (2026-09-21) and NVIDIA v10 carry no SST content (that material lives in the NVIDIA guidance module and the primer); `aidc-power-conversion--competitive--2026-09-08` is still `current`; matplotlib and Playwright are absent from a fresh container; the CHANGELOG counter is one push from the rotation threshold, so the rotation falls due during the overnight run.
- **§1 What the repo already holds** — the 20,000-word, 14-figure SST primer (v05.36r–v05.38r, 2026-09-12) is the technical spine the run extends rather than rebuilds; the 2026-09-08 report, the NVIDIA guidance module, the Megmeet dossier / study guide / interview brief / lesson plan (the last three five dossier versions stale), the SST four's 34.5 kV material (Heron ×12, DG Matrix ×17, Amperesand ×10, Novos ×2; Megmeet's own SST discloses no voltage class), and why neither the Markdown PDF renderer (no image support) nor Classroom (public-safety and the C2 gate surface) is used.
- **§2 The delta** — ten rows, one per ask: the term system with memorisation tables; the lineage and adjacency matrix; the value-by-perspective matrix; limitation → mitigation → who → status; the pilot-and-test ledger by service-voltage class with the 34.5 kV argument and an explicit *undisclosed* rule; the O&M, standards, utility-acceptance and procurement obstacles (the primer's thin spot — one mention of maintenance, none of spares or MTBF); the SST competitor matrix plus the adjacent-BU position table; the NVIDIA / Oracle engineering chapter with the hearsay rule; the figure and widget mechanisms; the "anything else" row.
- **§3 Deliverables** — D1 the Profiler competitive report (dossiers-only, public Pages data, builds on and does not supersede the 2026-09-08 edition); D2 the PDF from a print-HTML source on the primer's skin with `mmsst-fig-` figures and copies of the primer's two build scripts under `study-prep/megmeet/`; D3 the self-contained study companion with seven prioritised widgets, Playwright-tested from `file://`; the shared data file as the single source for every plotted number; the brief's five-part table of contents and the minimum figure set.
- **§4 Model and effort** — Opus 5 `xhigh`, one session, subagents on the same model: the repo's Xcel head-to-head (reading depth is where Opus led), the citation-tier rule and the rubric as the discipline mechanism, half Fable's per-token price and none of the Fable weekly sub-allocation, `xhigh` over `high` and `max`, latency free overnight; Fable 5.1, Sonnet 5 (offered as the Phase B subagent cost lever), Opus 5.5, effort `max` and a two-session split set aside with reasons; a ~3–5 hour, ~$120–250 API-equivalent estimate stated as judgment, not measurement.
- **§5 The run** — phases 0 · A (corpus read into two scratchpad ledgers) · B (five bounded web subagents) · C (D1, push 1) · D (data file → figures → brief chapter by chapter → PDF with proof pages, push 2) · E (companion) · F (a fresh subagent audits the PDF against the twelve-line rubric, push 3); failure handling decided in advance for a stuck branch, a failed PDF build, missing matplotlib, blocked hosts, context pressure and a dead container.
- **§6 The paste-in prompt** (new session, Opus 5, `xhigh`), **§7 the resume prompt**, **§8 the developer's night-of checklist**.

#### `README.md`

- The tree description of `megmeet-briefing-prompt.md` now describes the v2 run plan; timestamp and repo version.

## [v07.27r] — 2026-09-23 06:45:15 AM EST

> **Prompt:** "Run X — the Classroom hook — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.19 is the brief (follow its reading list in order; decide before you build, and the written decision is the deliverable either way), §3's D13 and D16 the design, repository-information/CLASSROOM-SCHEMA.md (the ref-prefix table and the stamp-fixes-the-gate section) and .claude/rules/classroom-app.md (the stamp rule, the freshness pins, the content fence, the gateDigest obligation) the shapes, and repository-information/EVENTS-SCHEMA.md §3 / §11 for what the public registry carries and what is never taught from it. E5 is Done in §11 (v07.25r; Events.gs v01.09g, Events.html v01.10w, Network.gs v01.17g) and D13's deferral condition is met — verify it yourself in live-site-pages/events-data/events-sources.json rather than taking the brief's word. Decide whether an event:<slug> provenance prefix earns its gate-surface cost; a reasoned no that names what would change the answer is a complete X. If yes: event: 'public' in CL_PROVENANCE_REF_KINDS, the CLASSROOM-SCHEMA.md mirror and a recomputed gateDigest in one commit, plus the first pre-event briefing lesson inside the content fence, folding to tracks or guidance and never briefing. Never a contact: prefix, never a Network signal or contact as an input, never a registry count as a taught fact, never a fabricated input, never an edit to check-classroom-pipeline.py or its fixtures. Write the decision and the date into §11's X row and §3's D13 row either way, and say what remains outside this plan once X closes — it is D16's last row. Verify with check-classroom-content.py, check-classroom-curriculum.py, check-classroom-pipeline.py, check-events-plan.js, check-events-registry.py and check-readme-tree.py. Bump per [PC-GS-VERSION] #1 with a changelog entry naming nothing gated; CHANGELOG entry; README tree if a file is added. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first — a shallow clone writes a wrong provenance pin that no checker can see; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then remember session."

X — the Classroom hook (design plan §3 D13, §13.19): **decided no.** Nothing built, no gate surface touched, no GAS bump, no file added. **D16's build order is complete** — Gate → N0 → Q0 → N1 → N2 → E0–E1 → B → N3 → E2–E3 → E4 → N4 → E5 → X, every row Done or decided.

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`

- **§3 D13** carries the decision: `event:` declined, not deferred again; `contact:` stays never. One-line reasoning with a pointer to the §11 row.
- **§11's X row** flipped from *Proposed — deferred behind E0 stability* to **Decided — no, v07.27r, 2026-09-23**: the deferral condition as verified (below), the three reasons, the four reopen conditions, the statement that D16's order is complete, and what remains outside it (R and Q inside the ledger; the E0 verification pass for `hours[]` / `venueLatLng` / `agendaUrl`, the `Network.html` hash router, `check-guidance-migration.js` and the Megmeet briefing outside the plan).

#### `repository-information/CLASSROOM-SCHEMA.md`

- One paragraph after the *no `note:` prefix* rule recording that there is no `event:` prefix either — declined at X with the date, the reason and the pointer to the reopen conditions — so the absence is a decision on the record rather than an omission a later session re-proposes. The prefix table itself is untouched and still mirrors `CL_PROVENANCE_REF_KINDS` byte for byte.

#### `repository-information/EVENTS-SCHEMA.md`

- §11's D13 sentence updated from *stays deferred until the registry has survived one poller cycle* to *declined at X (2026-09-23)*, pointing at the design plan's reopen conditions.

### Notes

- **The deferral condition, verified on the live file.** All 58 rows of `events-sources.json` carry `lastProbe.at = 2026-09-21`, but `git log` shows the roster written once (v06.95r, E0) and never since — those stamps are E0's own build-time probes, not the poller's. `events.json` has been touched only by E4 session 2's manual agenda rows (v07.20r). The poller's first live cycle ran (33 `Proposed` rows pending at E3's start) and no `events sync` has ever applied a diff, so the registry has stood under one poller cycle rather than survived a change from one. Recorded because the brief's evidence is not what it looks like; it did not decide X.
- **Why no, in three lines.** The pre-event briefing already exists as E5's `events plan <event>` narrative, private half included, and its public half is dossier material Classroom already stamps as `profile:` / `study:`. The fact with teaching value — who exhibits — is a Network `Signals` row that never crosses, and `mentions[]` is not attendance; what a registry row adds on its own is calendar, not mechanism, and expires with the edition, which a permanent `tracks` lesson cannot. The true cost of a tenth prefix is the map + mirror + `gateDigest` **plus** a G7 resolution rule (else every weekly run freezes the lesson as unknown), the committer contract's "exactly the nine prefixes", and the P11 guard in `check-classroom-pipeline.py` whose prefix tuple is hard-coded to the nine and which X may not edit; P4 would fire on the adding commit itself.
- **What would change the answer:** a series-level evergreen lesson once `hours[]` (2 of 96 upcoming rows), `editions[]` and the agenda structure are filled; a G7 resolution rule for `event:` written first; one applied `events sync` cycle; or the developer asking for it.
- **R's stated blocker has evidence:** the Profiler earnings desk Routine's 2026-09-22 fire committed v07.16r, so a scheduled Routine has landed a commit; the rebuilt C2 Routine's first fire on 2026-09-23 11:07Z is the next proof to read. R's row is the developer's to flip.
- **Checkers, all on the untouched code:** `check-classroom-content.py` 71 lessons · 8 tracks · 220 gate cases, 0 errors / 0 warnings; `check-classroom-curriculum.py` no structural findings; `check-classroom-pipeline.py --base origin/main` nothing to judge and `--selftest` 15 / 0; `check-events-plan.js` 151 / 0; `check-events-registry.py` OK; `check-readme-tree.py` 22 displays match, 0 findings.

## [v07.26r] — 2026-09-23 05:58:28 AM EST

> **Prompt:** "Picking up from my last session, before I continue on to run phase X, I noticed that I did not fill in the brackets when I pasted the prompt to run E5 session 2. See attached screenshots for what I see in two different starred events' "Plan" tab. I also noticed that when I toggle on the "Starred" filter, it does filter out non-starred events, but does not fill in the button blue - Fix that." (with five screenshots: the Plan tab of `acp-recharge-2026` and `ocp-global-summit-2026`, and the filter card with the Starred pill and the Starred count ringed)

### Fixed

#### `live-site-pages/Events.html`

- The filter pills never repainted their pressed state after a press. `evRender()` rebuilds the agenda and the counts but deliberately leaves the filters card alone — rebuilding it would drop the segment row's horizontal scroll position and the `data-busy` flag an in-flight score fetch sets — and `aria-pressed` is the whole of what paints a pill accent-filled (`.ev-pill[aria-pressed="true"]`). E3's **Recommended** and E4's **Signals only** each set their own pill by hand and so looked right; **★ Starred** and the three option rows never got that treatment and filtered while reading `false`. New `evSyncPills()` re-derives every filter pill's `aria-pressed` from `_evFilters` / `_evRecMode` in place, called at the top of `evRender()`. The two hand-set calls stay — they are the immediate feedback before their fetch returns, including the rollback on a failed one
- A second, latent bug from the same root cause: `evPillRow()` captured `current` at build time, and since the card is built once that snapshot never moved — so pressing an option pill a second time re-picked the same value instead of clearing it, and only **All** could undo a choice. The row now takes the `_evFilters` key and reads the live value for both the pressed state and the un-toggle; each pill carries `data-ev-val` for the sync to match on

#### `scripts/verify-events-roles.py`

- A filter-pill pass in the phone section, after the star round-trip: **★ Starred** presses to `aria-pressed="true"` with a computed background that differs from an untouched pill's and the agenda down to the one starred row, presses again to clear; a **Kind** pill paints pressed with `_evFilters.kind` agreeing with its `data-ev-val`, and a second press clears it back to **All**. The assertion is on the paint, not the attribute alone, because the attribute is only a proxy for what the developer sees. Verified both ways: with `evSyncPills()` commented out it fails with `pressed: 'false'`, the untouched background and `rows: 1` — the reported symptom exactly — and passes with it restored

### Notes

- The two starred events in the screenshots (`acp-recharge-2026`, `ocp-global-summit-2026`) show `0 booths · 0 sessions · 0 venues` because **neither registry row carries `venueLatLng`, `agendaUrl` or `hours[]`**, and no Network signal names either slug. Registry coverage across the 96 upcoming rows: `venueLatLng` 26, `agendaUrl` 16, `hours[]` 2. Every empty line in the Plan tab names the input it is missing, so the tab is rendering a thin row faithfully rather than failing. No code change — recorded so the next enrichment pass has the counts
- `ocp-global-summit-2026` carries nine Profiler `mentions[]` and still lists no booths: booths come only from `rec.signalsBySlug[slug]` — Network attendance signals — and a dossier mention is not attendance evidence (D9 / D16). Behaving as designed

## [v07.25r] — 2026-09-23 03:09:19 AM EST

> **Prompt:** "Run E5 session 2 — the post-event checklist, the ROI line and the events plan command — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.18 is the brief (follow its reading list in order, then its five build steps exactly; this closes E5), §5.6 item (5), §5.4 and §3's D9 / D12 / D15 / D16 the design, repository-information/EVENTS-SCHEMA.md §5 / §6 / §8 / §10 and repository-information/NETWORK-SCHEMA.md §3 / §8 / §10 the shapes. E5 session 1 is done in §11 (v07.24r; Events.gs v01.08g, Events.html v01.09w, Network.gs v01.16g). Live state you cannot see from the repo: the Plan tab [did / did not] open on a starred event, the top five booths [did / did not] read sensibly line by line, one meeting [was / was not] found on the contact in Network and [was / was not] in the downloaded ICS. Build the eventSlug= widening of nop=interaction's read leg in Network.gs, eop=postevent / eop=posteventmark / eop=plannarrative and the priorRoi term in Events.gs (the ROI line written once into the event's Plans row), the Post-event section with Copy plan as JSON on the Plan tab in Events.html, the events plan <event> command rule in .claude/rules/events-app.md with its CLAUDE.md pointer, and write the first narrative plan from the JSON I paste (to Drive if the connector is attached, else as text); extend scripts/check-events-plan.js and the verifier's pass. No in-app AI, no Places API, no new Profiler op, never a gmail.* scope, no second score; the session never calls any app. Verify with the E5 session-1 list and grep the served pages and both .gs for maps.googleapis, places, GmailApp, CalendarApp and linkedin.com. Bump Events.gs / Events.html / Network.gs per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree; EVENTS-SCHEMA.md §5 / §6 / §8 / §10 and NETWORK-SCHEMA.md §8; flip §11's E5 row to Done with the versions. Then hand off in chat: redeploy, open a past event's Plan tab, read the checklist and the ROI line, mark one meeting held, copy the plan JSON and paste it back for the narrative. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for X, and remember session."

E5 session 2 — the post-event close-out, the ROI line and the `events plan <event>` command. **E5 is Done.**

### Added

#### `googleAppsScripts/Network/Network.gs` (v01.16g → v01.17g)

- `nop=interaction`'s read leg widened with **`eventSlug=`** — the live contacts whose `Source Event` is that slug (with their account name, the account's stage at read time, and **one** `mailable` boolean rather than the two consent columns) and the `meeting` Interactions on the slug. One call answers everything the close-out counts, so Events needs no second op
- Each meeting row carries an inferred `held` (a later `note` / `email-out` touch on the same contact within 14 days) and the developer's explicit `mark`, both computed on Network's side because a boolean and a three-value word are strictly less data than the rows behind them. Mark rows are excluded from the touches that feed the inference — otherwise a "not held" mark reads as a later touch and inverts its own verdict
- `NW_PEER_INTERACTION_KINDS` gains `note` for that mark write; the two mark phrases are mirrored byte for byte in `Events.gs` and the mirror is asserted by the harness

#### `googleAppsScripts/Events/Events.gs` (v01.08g → v01.09g)

- **`eop=postevent&slug=`** — the checklist (cards, meetings booked, held and still unconfirmed, the follow-up count over D9's consent rule and its relative deep link) and the **ROI line** `{ cards, meetingsBooked, meetingsHeld, stageMoves }`, written **once** into the event's `Plans` row and re-read on later opens. Allowed only from the day after `end`; `not_over` before that, with the end date and today said
- **`eop=posteventmark`** — `held ∈ yes · no` written as a `note` Interaction with the `mt-` id as evidence; an explicit mark beats the inference in both directions, the newest wins, and the `Plans` row's meetings are refreshed over one read-leg call rather than a second score
- **`eop=plannarrative`** — the narrative plan's Drive URL onto the `Plans` row. The audit row carries the plan id and a flag, never the URL
- The score's seventh term **`priorRoi`**: what an *earlier edition of the same series* returned, `min(1, (cards + 3·held + 5·moves) / 40)`, seeded into `Tuning` at 0.05 so nothing reorders until there is a year of data. `lost` is deliberately not a stage move although the enum orders it past `prospecting` — a terminal negative would inflate next year's prior
- `evRecommend_` gained an `extraSlug` argument so one past event's signals survive the upcoming filter; the booth accounts for the ROI come from those rows with no dossier read, no agenda and no Overpass

#### `live-site-pages/Events.html` (v01.09w → v01.10w)

- The **Post-event** section at the top of the Plan tab once today is past the event's end: the checklist, Mark held / not held per meeting, the follow-up link, the ROI line as recorded, and a Narrative plan link field
- **Copy plan as JSON** — the whole plan plus the close-out, for the `events plan` command. Placed in the plan head **as well as** the Post-event section: the narrative plan is most use *before* a show, and an upcoming plan has no Post-event section to carry the pill

#### Rules and docs

- The **`events plan <event>` command** in `.claude/rules/events-app.md` with its CLAUDE.md pointer — the Plan tab's JSON in, a one-page narrative brief per event day out, to Drive when the connector is attached and otherwise as text. Its never-list: no app call, no spreadsheet read, no peer token, no invented booth or contact, and a plan built from pasted JSON is never committed
- The first narrative plan, for **RE+ 2026**, at `repository-information/plans/re-plus-2026-narrative-plan.md` — written with no JSON pasted, so from the registry row and nine served dossiers only, with every gap named as a gap

### Fixed

- `evRecommend_`'s new past-slug filter kept rows with an **empty** event slug (a docket, a press quote) when no extra slug was named. Caught by `check-events-signals.js` before it left the session

### Changed

- `scripts/check-events-plan.js` → 151 checks (from 100): the widened read leg, `not_over`, the four checklist counts, the ROI row written once and re-read, both mark directions, `priorRoi` 0.275 hand-computed, the empty-slug guard, and the greps over the widened leg
- `scripts/verify-events-roles.py` gained a post-event pass at phone width — screenshot `events-postevent.png`
- `scripts/check-events-score.js` and `scripts/check-events-signals.js` updated for the seventh term
- `repository-information/EVENTS-SCHEMA.md` §5 / §6 / §8 / §10 and `repository-information/NETWORK-SCHEMA.md` §8; §11's E5 row flipped to **Done**

### Known gaps

- `Network.html` has **no hash router**, so the checklist's `Network.html#drafts?sourceEvent=<slug>` deep link opens the app without pre-filtering the list. The page says so beside the link; a small Network-side route would close it, and it was left out rather than widen this session into `Network.html`
- The developer's four live-state brackets in the §13.18 prompt were pasted unfilled, so E5 session 1's live check is **unconfirmed by this session**

## [v07.24r] — 2026-09-23 02:19:54 AM EST

> **Prompt:** "Run E5 session 1 — the deterministic plan: booth list, sessions, day plan and meetings — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.17 is the brief (follow its reading list in order, then its five build steps exactly; session 2 — the post-event checklist, the ROI line and the events plan command — is not this session), §5.6 items (1)–(4), §5.4, §5.5 and §3's D4 / D9 / D12 / D15 / D16 the design, repository-information/EVENTS-SCHEMA.md §3 / §6 / §8 / §9 and repository-information/NETWORK-SCHEMA.md §3 / §8 the shapes. N4 is Done in §11 (v07.23r; Network.gs v01.15g, Network.html v01.24w) and E4 is Done (Events.gs v01.07g, Events.html v01.08w). Live state you cannot see from the repo: one brief [did / did not] open in Word, one promoted interaction [was / was not] found in Profiler's intake, the chips [did / did not] name the events on an account with signals, and the map [did / did not] open. Build eop=plan, eop=planmeeting and eop=planunbook in Events.gs (the booth list ranked by the score's own account and segment terms with a verbatim dossier line read from the served JSON, the sessions filter, the day plan with open slots and Overpass venues within 600 m cached per event — Overpass only, never Places; a booked meeting written as a meeting Interaction over a new Network far-side leg and answered as an ICS download), nop=interaction in Network.gs (peer POST behind NETWORK_PEER_TOKEN, the write leg's shape, never a body), the Plan tab on the event sheet in Events.html; scripts/check-events-plan.js on the two-VM idiom with zero live calls; the verifier's plan pass. No narrative plan, no events plan command, no post-event checklist, no Places API, no new Profiler op, never a gmail.* scope; the session never calls any app. Verify with the E4 list plus node scripts/check-events-plan.js, node scripts/check-network-brief.js and node scripts/check-network-warmth.js, and grep the served pages and both .gs for maps.googleapis, places, GmailApp, CalendarApp and linkedin.com. Bump Events.gs / Events.html / Network.gs per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; EVENTS-SCHEMA.md §3 / §8 / §10 and NETWORK-SCHEMA.md §8; flip §11's E5 row to In progress — session 1 with the versions and write the session-2 brief as §13.18. Then hand off in chat: redeploy Events and Network, open a starred event's Plan tab, judge the top five booths line by line, book one meeting and find it on the contact in Network and in the downloaded ICS. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for E5 session 2, and remember session."

### Added
- **E5 session 1 — the deterministic plan: the booth list, the sessions, the day plan and meetings** (design plan §5.6 items 1–4, D4 / D9 / D12 / D15; §11's E5 row flipped to **In progress — session 1** with the versions; the session-2 brief written as §13.18 with its paste-in prompt). `Events.gs` v01.08g: `eop=plan` (session GET, behind `recommend`) for one **starred** event — `evRecommend_(sess, true)` run once with its signal rows and account map kept (never a second score) → the **booth list** (`evPlanBooths_`: one row per account with a plan-kind signal on the event — a docket or press quote names no event — ranked `accountPresence × stageWeight × strongest confidence + segmentFit × |account.segments ∩ audience| / |audience|` with the Tuning weights, the stage on the row, every signal with its person and `contactId`; the *why* line lifted verbatim from the served `<slug>.profile.json` — `strategyRead[0]`, else the newest `recentDevelopments[].headline` — read over `UrlFetchApp` from the Pages site for the top `EV_PLAN_DOSSIER_MAX` = 15 booths, never Profiler's exec; the dossier's `decisionMakers[]` kept for the filter), the **sessions** (`evParseSessions_` over the agenda page — JSON-LD `Event` / `subEvent[]` with `startDate` / `performer` / `location`, else HTML session blocks with a heading, a time and the roster parser for the speakers — read once and cached six hours in `CacheService`; `evPlanSessionsFilter_` keeps a title naming a seat segment the event serves, a speaker who is a Network contact (a signal row carrying `contactId`), or a speaker who is a dossier decision maker, with the reason on the row), the **day plan** (`evPlanDays_`: one frame per event day from the registry's `hours[]` — `EV_PLAN_DEFAULT_HOURS` 09:00–17:00 and `hoursSource: 'default'` when the row carries none; the booked meetings and the timed sessions fixed, the ranked visits placed in rank order into the earliest free time at `EV_PLAN_VISIT_MIN` = 30 minutes, `EV_PLAN_VISITS_PER_DAY` = 6, the open slots ≥ 30 minutes between them; no booth numbers — the E4 exhibitor parsers keep names only), the **venues** (`evPlanVenues_`: one Overpass POST per event — cafés · restaurants · bars · hotels within 600 m of `venueLatLng`, normalised to `{ name, kind, lat, lng, distanceM }` by distance, ≤ 40 — cached in the script property `EV_PLAN_VENUES:<slug>` for 30 days; a failed, non-2xx or unparseable answer is an empty list, one `events_plan_venues_failed` audit row and **not** cached) and the **meetings** (the owner's `Meetings` rows on the event, the contact named through one pick-list read per account). `eop=plancontacts` — the pick list over Network's new read leg. `eop=planmeeting` (body-POST): `slug` · `contactId` · `accountId` · `date` (a day of the event) · `start` / `end` (`HH:MM`, ≤ 240 min) · `place` · `note` · `contactName` / `accountName` — the `meeting` Interaction written **first** over `nop=interaction` (the mt- id as evidence, the event slug, a one-line summary — never the note), a rejected row books nothing; then the `Meetings` row (Start / End as wall time, `ICS UID` = `<mt- id>@events.<host>`, the i- id in `Network Interaction ID`); the invite answered as RFC 5545 text — `DTSTART` / `DTEND` in UTC from the event's zone (`evLocalToUtc_` over `Utilities.formatDate`, DST-checked), folded at 75 octets, CRLF. `eop=planunbook` removes the row and leaves the Interaction (D15: it is the record). `not_configured` degrades every read and write: the plan answers without booths, a booking writes the row with no interaction id and says so. Audit rows: the slug, ids and counts. `Network.gs` v01.16g: **`nop=interaction`** — two legs on one op behind `NETWORK_PEER_TOKEN` (the session's one widening): GET with `accountId` → the live contacts under one of the owner's accounts (`id` · `name` · `title` · `role`); POST `{ owner, interactions:[ { contactId, accountId?, kind ∈ meeting · calendar, date, summary, evidence, eventSlug? } ] }` → `{ written, rejected:[ { index, reason } ], ids:[] }` through the same `nwInteractionAdd_` every session op uses — `bad_contact_id` · `contact_not_found` (deleted, another owner's) · `account_mismatch` · `bad_kind` · `bad_date` · `summary_required` (collapsed to one line, ≤ 500 — never a body) · `bad_evidence` (an Events `mt-` / `pl-` id or an `https?://` URL) · `bad_slug`; `nwPeerJsonBody_` takes the field name. `Events.html` v01.09w: the **Details | Plan** strip on the sheet (the `recommend` capability's, like the why panel), the Plan tab fetched once per open and never polled — the booths with rank, stage chip, the two terms, the verbatim line and its source, the signal chips linking their evidence; the sessions with their why chips; a day card per event day with the frame (default hours said so) and the timeline (visits, sessions, meetings, open slots); the venues with OpenStreetMap links (a link — no tiles fetched) and the venue itself; the meetings list; **Book a meeting** under an open slot (the account — booths first, then every scored account; the contact from `eop=plancontacts`; the times inside the slot; a place; one line) → `eop=planmeeting`, the `.ics` downloaded from the answer, the meeting fixed on the timeline with the slot split locally; Unbook → `eop=planunbook`; Rebuild refetches
- `scripts/check-events-plan.js` — the two-VM harness (Events' real plan functions in one context, Network's real `nwPeerAccounts_` / `nwPeerSignals_` / `nwPeerInteraction_` with `nwInteractionAdd_` in another, the peer URL routed between them; Overpass, the Pages files, two served dossiers and the agenda page as fixtures): 100 checks, zero live calls — the booth ranking against hand-computed values with the dossier line verbatim, the three session matches and the drop, the frames and open slots, three venues within 600 m and the fourth dropped, the venue cache read with zero fetches and a failure uncached, a booking's Interaction / row / ICS `DTSTART`, unbook, the six token-boundary cases flat `denied`, the write leg's seven rejections by index, `not_configured` degrading, the D12 / D15 greps
- `scripts/verify-events-roles.py` — the plan pass (the strip, one `eop=plan`, five booths with verbatim lines and stage chips, the sessions' why chips, the day cards with open slots, three OpenStreetMap links, a booking through the form with one `eop=plancontacts`, the `.ics` downloaded and read back, the meeting fixed with the slot split, Unbook); ALL CHECKS PASSED at 390 × 844, zero page errors

### Changed
- `evRecommend_` takes a `keep` flag that attaches `signalsBySlug` / `accountsById` to its answer (the plan's input; the page's `eop=recommend` never passes it) and its signal rows now carry `contactId`
- `EVENTS-SCHEMA.md` §3 (hours), §5 (Meetings as built), §8 (the E5 session ops), §10 (venues and the plan as built), §12 (the harness); `NETWORK-SCHEMA.md` §8 (`nop=interaction`), §14 (the harness); `README.md` tree (the harness, the verifier's pass, the three versions)

#### `Events.html` — v01.09w

##### Added
- The Plan tab on the event sheet: booths, sessions, the day plan with open slots, nearby venues, Book a meeting and Unbook

#### `Events.gs` — v01.08g

##### Added
- `eop=plan` · `eop=plancontacts` · `eop=planmeeting` · `eop=planunbook`

#### `Network.gs` — v01.16g

##### Added
- `nop=interaction` — the pick-list read and the meeting write behind the peer token

## [v07.23r] — 2026-09-23 01:20:11 AM EST

> **Prompt:** "Run N4 session 2 — the pre-meeting brief, promote to field note, the network map and the "will be at" chips — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.16 is the brief (follow its reading list in order, then its five build steps exactly; this closes N4), §4.4's last four bullets and §3's D4 / D9 / D15 / D16 the design, repository-information/NETWORK-SCHEMA.md §3 / §5 / §8 / §11 / §12 the shapes. N4 session 1 is done in §11 (v07.22r; Network.gs v01.14g, Network.html v01.23w). Live state you cannot see from the repo: the warmth chips [did / did not] read sensibly against three known contacts, the reconnect list [did / did not] open, and one .ics row [was / was not] confirmed as a calendar touch. Build nop=brief and nop=promote in Network.gs (the brief assembled server-side from the contact's own rows — the dossier pieces fetched by the page as N2 does; promote one-way into Profiler's existing intake path as sourceType: contact with the developer's confidence, never a dossier edit), the event names on the "will be at" read over Events' eop=signals, the 📄 Brief .docx export, the ⇈ Promote action, the "Will be at" chips and the Network map (vanilla SVG over the list payload) in Network.html; scripts/check-network-brief.js on the sandbox idiom with zero live calls; the verifier's four passes. No E5, no Routine, no new scope, no new Profiler op, never a gmail.* scope; the session never calls any app. Verify with the N4 session 1 list plus node scripts/check-network-brief.js, and grep the served page and the .gs for GmailApp, CalendarApp, gmail. and linkedin.com. Bump Network.gs / Network.html per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; NETWORK-SCHEMA.md §8 / §11; flip §11's N4 row to Done with both sessions' versions and write the next brief as §13.17. Then hand off in chat: redeploy Network, export one brief and open it in Word, promote one interaction and find it in Profiler's intake, read the chips on an account with signals, open the map. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for whatever §11 says is next, and remember session."

### Added
- **N4 session 2 — the pre-meeting brief, promote to field note, the network map and the "Will be at" chips** (design plan §4.4's last four bullets, D4 / D9 / D15 / D16; §11's N4 row flipped to **Done** with both sessions' versions; the E5 session-1 brief written as §13.17 with its paste-in prompt). `Network.gs` v01.15g: `nop=brief` (session GET, behind `contacts`) assembles one contact's own rows server-side — the contact minus the raw extraction and the card links, its account, every Interaction newest first, the account's live Signals named by Events, the warmth block, the stage — writes the D9 disclosure row through `recordDisclosure` (`network_brief rows=1 ids=<c- id>`) and a `data_export` audit of ids and counts; `nop=promote` (body-POST, behind `contacts`) copies one Interaction into Profiler's intake **through Profiler's existing note op** (`action=note` · `nop=submit`, `PROFILER_INTAKE_EXEC` from `Profiler.config.json`'s `DEPLOYMENT_ID`) as a `sourceType: contact` note with the developer's 0–100 confidence and the i- id (plus the row's own evidence and event) in the note text, the account's slug or `general` — the developer's own Profiler session read by the page from the shared origin (`ov_note_session`) and relayed once, never stored or audited; the promotion is recorded as a `note` Interaction on the contact whose Evidence Link is `promoted:<i- id>:<intake id>` (§3 keeps the source row's Evidence Link for its own evidence), which is also the duplicate guard; refusals by name before any call (`bad_interaction_id`, `bad_confidence` — the empty string caught by the harness, `profiler_session_required`, `not_found`, `deleted`, `duplicate`, `view_only`) and Profiler's relayed (`profiler_session_expired`, `profiler_admin_only`, `profiler_rejected`, `upstream_*`); the session read `nop=signals` gains `eventName` / `eventStart` per row and an `events` map + `eventsConfigured` from **one** `eop=signals` call per read (only when a row names an event; not_configured or an HTML answer degrades to slugs). `Network.html` v01.24w: the **📄 Brief** button on the contact detail → a real `.docx` (three-part OOXML over the existing store-only zip: the heading, the warmth line, Contact, Account, Timeline, Will be at, the served dossier's `strategyRead[]` and last five `recentDevelopments[]` when covered — read as N2 does, never written — and Pipeline stage); the **⇈ Promote** affordance on every History touch with a 0–100 confidence box that refuses without a Profiler sign-in and links to Profiler; the **"Will be at" chips** (one per event with Events' name and start, the kinds and confidences, the evidence links and a link into Events; "Quoted in press" and "Regulatory filing" for the no-event rows — the `press —` / `?` labels retired); the **🕸 Map** masthead card — vanilla SVG over the list payload already on the page (accounts on a ring, contacts fanned at their account, source events at the centre; account–contact and contact–event edges; drag to pan, tap to focus with the rest dimmed, a second tap on a contact opens its row; the tap decided on `pointerup` because the captured pointer's click never reaches the node)
- `scripts/check-network-brief.js` — the sandbox harness (the real `nwBriefOp_`, `nwPromoteOp_` with `nwProfilerIntake_`, `nwSignalsOp_` with `nwSignalRows_` / `nwSignalEvents_` / `nwEventsProxy_`; `UrlFetchApp` routed to an in-memory Events stub and a Profiler stub, any other call counted as escaped): 58 checks, zero live calls — see its header
- `scripts/verify-network-roles.py` — the chips · brief · promote · map passes (the two chips named by Events with the press quote as "Quoted in press"; the `.docx` download unzipped and its paragraphs read back — every section, the RE+ 2026 chip, the scan, the served `abb` dossier's developments; promote refused without a Profiler sign-in then posted with the i- id · confidence 80 · the session and the note interaction recorded; the map's node count per type against the list payload, focus, the second tap opening the row); the D17 grep on the served page; `network-map.png` — ALL CHECKS PASSED at 390 × 844, zero page errors

### Changed
- `scripts/check-scraper-people.js`: extracts the three signal helpers and `nwEventsProxy_` that `nwSignalsOp_` now calls (zero calls still — the press-quote rows name no event)
- `NETWORK-SCHEMA.md` §8 (`nop=signals` widened; `nop=brief`; `nop=promote`), §11 (the brief export), §12 (the two new audits), §14 (the harness); `README.md` tree (the harness, the verifier's passes, the Network versions)

## [v07.22r] — 2026-09-23 12:41:01 AM EST

> **Prompt:** "Run N4 session 1 — warmth, the reconnect list and the import panel — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.15 is the brief (follow its reading list in order, then its five build steps exactly; session 2 is not this session), §4.4's first two bullets and §3's D15 / D9 the design, repository-information/NETWORK-SCHEMA.md §3 / §4 / §5 / §12 the shapes. E4 is Done in §11 (v07.21r; Network.gs v01.13g, Network.html v01.22w, Events.gs v01.07g, Events.html v01.08w, Scraper.gs v02.22g). Live state you cannot see from the repo: NETWORK_CORPUS_TOKEN [is / is not] set in both projects, and one article's people [did / did not] read on an account in Network with one accepted. Build the warmth score and the cadence table in Network.gs (computed, never stored; carried on the list row beside lastTouch and on the detail), nop=reconnect, the server-side .ics / CSV parse → proposal list → nop=importconfirm writing only the ticked rows as email-in / email-out / calendar Interactions with the developer's own reference as evidence — no Gmail or Calendar scope, no trigger, no consent prompt; the Warmth chip and sort, the Reconnect card and the Import touches panel in Network.html; scripts/check-network-warmth.js on the sandbox idiom with zero live calls; the verifier's three passes. No E5, no Routine, no new scope, never a gmail.* scope; the session never calls any app. Verify with the E4 session 3 list plus node scripts/check-network-warmth.js, and grep the served page and the .gs for GmailApp, CalendarApp, gmail. and linkedin.com. Bump Network.gs / Network.html per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no account or person; CHANGELOG entry; README tree entry for the harness; NETWORK-SCHEMA.md §5; flip §11's N4 row to In progress — session 1 with the versions and write the session-2 brief as §13.16. Then hand off in chat: redeploy Network, read the warmth chips against three contacts you know, open Reconnect, paste one .ics and confirm one row. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push."

### Added
- **N4 session 1 — warmth, the reconnect list and the import panel** (design plan §4.4's first two bullets, D15 / D9; §11's N4 row flipped to **In progress — session 1 done** with the versions; the session-2 brief written as §13.16 with its paste-in prompt). Warmth and cadence are computed on every read and stored nowhere — `NETWORK-SCHEMA.md` §5 rewritten as built (the kind weights, the 90-day half-life, hot ≥ 2 · warm ≥ 0.75 · cool ≥ 0.2, the cadence table per role × relationship, the reconnect list, the import panel's request / answer / refusal shapes); §12 names the three ops' audit keys; §14 the new checker
- `scripts/check-network-warmth.js` — the sandbox harness (the real warmth and cadence helpers, the list op's single touch pass, `nwListOp_` / `nwGetOp_`, `nwReconnectOp_`, the `.ics` and CSV parsers, `nwImportOp_` / `nwImportConfirmOp_` with the real `nwInteractionAdd_` in one VM context): warmth against hand-computed values and every band edge, every cadence cell, warmth on the row and the detail from one read and stored in no tab, the reconnect order and its exclusions, the parsers on fixtures, a proposal that writes nothing with the unmatched address never written, a confirm that writes only the ticked rows with the reference · ref as evidence and refuses the rest per row, the duplicate on a re-confirm, no mail or calendar scope in the PROJECT region or the page, the page's byte-for-byte mirror of the legend constants — 66 checks, zero live calls; README tree entry
- `scripts/verify-network-roles.py` — the warmth · reconnect · import passes (the chip on every row, the Warmth sort hottest first without a request, the detail's cadence and lapse, the Reconnect card most overdue first and its Draft into the drafts flow, a pasted `.ics` → one matched and one unmatched proposal → only the ticked row confirmed with the reference); the D15 grep now names `CalendarApp` and the calendar scopes; two screenshots

### Changed
- `scripts/check-network-schema.py`: `matched` · `unmatched` join the audit-detail allow-list (counts — the checker still refuses an address, a name, a line or the reference)
- The verifier's N3 s1 sort test expects the Warmth sort live (it asserted the disabled placeholder until now)

#### `Network.gs` — v01.14g

##### Added
- `NW_WARMTH_WEIGHTS` · `NW_WARMTH_HALF_LIFE_DAYS` · `NW_WARMTH_BANDS` · `NW_CADENCE_DAYS` (§5; the only tuning surface, not a tab); `nwWarmth_` / `nwWarmthBand_` / `nwCadenceDays_` / `nwWarmthDetail_`; `nwTouchPass_` — one read of the Interactions tab answers `lastTouch` AND warmth (`nwLastTouch_` delegates to it; the export op still reads it)
- `nop=list` rows carry `warmth` + `warmthBand` beside `lastTouch`; `nop=get` answers the `warmth` block (score, band, last touch, cadence, since, overdue)
- `nop=reconnect` — the contacts past their cadence, most overdue first, the minimum row plus the lapse; do-not-contact rows left out; capped at 200; audit counts only
- `nop=import` (body-POST) — the pasted `.ics` (unfolded, VEVENT · UID · SUMMARY · DTSTART · ATTENDEE / ORGANIZER `mailto:`; DESCRIPTION never read) or CSV (RFC 4180, a header matched by name, a direction column, a Message-ID column, tab-separated accepted) parsed server-side, matched to live contacts by email, answered as a proposal list with the unmatched addresses and the already-recorded rows marked — nothing written; `nop=importconfirm` (body-POST) — the ticked rows judged per row and written as `email-in` / `email-out` / `calendar` Interactions with the developer's reference (· the UID or Message-ID) as Evidence Link and the one line as Summary; a write scope required

#### `Network.html` — v01.23w

##### Added
- The warmth chip on every list row and on the detail (with the cadence and the lapse) — the legend from `NW_WARMTH_WEIGHTS` / `NW_WARMTH_HALF_LIFE_DAYS` / `NW_WARMTH_BANDS` mirrored from the `.gs`; the Warmth sort switched on (hottest first)
- The 🔥 **Reconnect** masthead card — the lapsed contacts with the lapse and the cadence, Draft per row and for the ticked into the N3 drafts flow
- The ⇪ **Import touches** masthead panel — format select, the paste, the reference, Propose → the proposal list (a checkbox and a kind select per matched row, unmatched rows shown greyed with the reason) → Record the ticked touches → the list refreshes

## [v07.21r] — 2026-09-22 11:02:50 PM EST

> **Prompt:** "Run E4 session 3 — the Scraper-side `people[]` extraction, the `cop=people` route and Network's proxy — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.14 is the brief (follow its reading list in order, then its five build steps exactly; E4 closes with this session), §3's D17 and D9 and §5.5.1 row 5 the design, `repository-information/NETWORK-SCHEMA.md` §3 / §8 / §9 the shapes. E4 sessions 1 and 2 are done in §11 (v07.20r; `Events.gs` v01.07g, `Events.html` v01.08w, `Network.gs` v01.12g, `Network.html` v01.21w) — the sweep, its six kinds, the manual form, the docket watch and `scripts/check-events-signals.js` (103 checks) exist; extend, do not fork. Live state you cannot see from the repo: both peer tokens are set, the weekly sweep [is / is not] installed, the first live sweep's Signals now answer read [paste the status line here], and the newsroom and docket rows [did / did not] show on an account in Network. Build `people[]` in the Scraper's summarisation schema and stored items (no second model call, no backfill), the `cop=people&slug=&since=` far side behind a new `NETWORK_CORPUS_TOKEN` (`nwHandlePeer_`'s token idiom; never `CORPUS_TOKEN`, never Profiler's proxy), Network's `nwPeopleProxy_` behind `signals`, the account detail's "People in the press" list with an Accept step that writes a `press-quote` signal at 0.7 with `Evidence URL = corpus:<key>` and `Source = scraper` (the write leg gains a `corpus:` branch for that kind only), and `scripts/check-scraper-people.js` on the two-VM idiom with zero live calls. No plans (E5), no discovery Routine (R), no new scope, never widen an existing peer token — the new token is set by hand in both projects and never committed; the session never calls any app. Verify with the E4 session 2 list plus `scripts/verify-network-roles.py`, and grep the served pages and the `.gs` files for `linkedin.com`, `10times` and `attendee`. Bump every `.gs` and page touched per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no token, account or person; CHANGELOG entry; `NETWORK-SCHEMA.md` §8 / §9; flip §11's E4 row to Done with the versions and write the next brief as §13.15. Then hand off in chat: set the new token in both projects, redeploy Scraper and Network, summarise one article, read its people on the account and accept one. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; parallel sessions push, so check `git ls-remote` before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for whatever §11 says is next, and remember session."

### Added
- **E4 session 3 — the people route** (design plan D17, catalogue §5.5.1 row 5; §11's E4 row flipped to **Done** with the three sessions' versions; the N4 session-1 brief written as §13.15 with its paste-in prompt): the Scraper names the people its summarise pass reads, the `cop=people` route answers them behind a **third token namespace**, Network reads them through its own proxy and the developer accepts each one as a `press-quote` signal
- `scripts/check-scraper-people.js` — the two-VM harness (Scraper's real far side in one context, Network's real proxy, people ops and write leg in the other, the Network fetch routed into the Scraper context): **62 checks**, zero live calls
- `NETWORK-SCHEMA.md` §8 (the write leg's `corpus:` branch, the empty slug for `press-quote`, the person in the press-quote upsert key, `Source = scraper`; the session ops `nop=people` and `nop=peopleaccept`), §9 (the route as built — `since`, the default window, no back-fill, the `accepted` flag, the accept step's row) and §14 (the new harness)

### Changed
- **No back-fill** (the brief's decision over D17's "one-time admin job"): only items summarised from `Scraper.gs` v02.22g onward carry people; older items are never re-read and never answered on the route
- `scripts/check-peer-bridge.js` / `scripts/check-events-signals.js`: the Network context extracts the upsert-key helper and the name key it uses, and the corpus-key constant; both still pass (61 · 103 checks)
- `scripts/check-network-schema.py`: `items` · `people` · `covered` join the audit-detail allow-list (counts and a flag — the checker still refuses a name, a slug or a key); `scripts/verify-network-roles.py`: the people pass — read on demand only, the two-person list with the accepted one ticked, Accept posting the key and the person, the "Will be at" line re-read once, the uncovered account's line; ALL CHECKS PASSED at 390 × 844

#### `Scraper.gs` — v02.22g

##### Added
- `people[]` in the summarise call's output schema (`SCRAPER_PEOPLE_MAX` = 5 per item; role ∈ quoted · author · named; name, title, company, one-phrase context) — the same single model call, a few output tokens more, **no second call**; `scPeopleParse_` shapes and bounds the reply, `scSignalsMerge_` stores it as `ppl` in the item's Signals blob beside `evt` and `figs`
- `scHandlePeople_` / `scPeopleScan_` — `cop=people&slug=&since=[&limit=]` behind `NETWORK_CORPUS_TOKEN` (`SCRAPER_NETWORK_CORPUS_TOKEN_PROP`; the property trimmed, sub-16 refuses, every boundary case flat `denied` with zero reads, nothing audited on a refusal): rows whose blob carries `ppl`, the slug's rows, `since` honoured, one row per article key, corpus-only rows counted, ≤ 200; the audit row carries the slug, the window and counts

##### Changed
- `scHandleCorpus_`: `cop=people` is routed to the new gate **before** the `CORPUS_TOKEN` check — Profiler's token never opens it and the Network token never reaches `timeline` or `candidates`
- `SCRAPER_SIGNALS_CELL_MAX` 1500 → 2500 so the people list fits the blob in the common case; `scSignalsJson_`'s drop order gains `ppl` after `figs`

#### `Network.gs` — v01.13g

##### Added
- `NW_CORPUS_TOKEN_PROP` (`NETWORK_CORPUS_TOKEN`), `SCRAPER_CORPUS_EXEC` (the Scraper config's deployment), `NW_CORPUS_KEY_RE`, `NW_PRESS_QUOTE_CONFIDENCE` = 0.7, `NW_PEOPLE_DEFAULT_DAYS` = 90
- `nwPeopleProxy_` — `nwEventsProxy_` (and so `guidanceMentionsProxy_`) verbatim with the Scraper URL and the corpus token: `not_configured` under 16 characters with no fetch, `upstream_http_<code>`, `upstream_unreachable`, `upstream_not_json` with a snippet
- `nop=people` (session GET, behind `signals`) — the account's slug names the route; an uncovered account answers `covered:false` with no fetch; each person carries `accepted` and its signal id when the Signals tab already holds the row; audit: the account id and counts
- `nop=peopleaccept` (behind `signals`) — one `press-quote` row through the bridge's own upsert with `Source = scraper`: 0.7, `corpus:<key>`, the person's name and title, no event slug, the item's date as First Seen, the context as the note, `Contact ID` set when a live contact at that account has the same name; `read_only_scope` on a view-only share; `nwScopedAccount_` resolves the account inside the session's scope
- `nwSignalKey_` — the upsert key adds the person's name key for `press-quote` only (one article quotes several people at one account; each is its own row)

##### Changed
- `nwPeerSignalsWrite_`: a `source` argument (`events` by default, `scraper` from the accept step — never from the body); the empty `eventSlug` accepted for `docket` **and** `press-quote`; `corpus:<key>` evidence accepted for `press-quote` only (`evidence_required` on any other kind); a press quote with no person is `person_required`; the audit op names the writer

#### `Network.html` — v01.22w

##### Added
- **People in the press** on the account detail — read on a tap (never on the detail open, never a poll): per article the title, outlet, date and link; per person the name, title, company, role and context with **Accept**, or the tick when already accepted; an uncovered account's line says the route needs a dossier slug; the error text names a missing token, an unreachable corpus or a non-JSON answer
- Accept → `nop=peopleaccept`, the row flips to accepted, the status line says whether the person matched a contact, and the "Will be at" line re-reads in place (`nwSignalsFill`, split out of `nwSignalsLine`)

##### Changed
- The "Will be at" line labels a press quote `press` instead of `?` when the row has no event

## [v07.20r] — 2026-09-22 10:38:40 PM EST

> **Prompt:** "Run E4 session 2 — newsroom pages, agendas and the FERC docket watch — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.13 is the brief (follow its reading list in order, then its five build steps exactly; session 3 is not this session), §5.5 and the §5.5.1 catalogue rows 4 · 6 · 7 the design, `repository-information/EVENTS-SCHEMA.md` §3 / §8 and `repository-information/NETWORK-SCHEMA.md` §3 / §8 the shapes. E4 session 1 is done in §11 (v07.19r; `Events.gs` v01.06g, `Events.html` v01.07w, `Network.gs` v01.11g, `Network.html` v01.21w) — the sweep `evSignalsRun_`, its parsers and matcher, the manual form, the "Signals only" pill and `scripts/check-events-signals.js` exist; extend them, do not fork them. Live state you cannot see from the repo: both peer tokens are set, the weekly sweep [is / is not] installed and the first live sweep's Signals now answer read [paste the status line here]. Build the monthly newsroom / "meet us at" read per target account over the Account row's Newsroom URL (`kind = newsroom`, 0.7), the agenda read at `agendaUrl` with the roster parser reused (`kind = agenda`, 0.9, the person), recordings by manual link as the brief decides, and the FERC eLibrary RSS watch per utility / IPP account over the Scraper roster's existing feed (`kind = docket`, 0.7, no event slug — check Network's slug rule and the score's indifference); each with a fixture and a harness section in `scripts/check-events-signals.js`; the verifier only if the sheet's form gains a kind. No Scraper `people[]` or `cop=people` (session 3), no plans (E5), no discovery Routine (R), no Swapcard API; no new scope; never widen a peer token — the session never calls the app. Verify with the E4 session 1 list plus `scripts/verify-network-roles.py` if Network changes, and grep the served page and the `.gs` for `linkedin.com`, `10times` and `attendee`. Bump `Events.gs` (and `Events.html` / `Network.gs` only if touched) per [PC-GS-VERSION] #1 / [PC-HTML-VERSION] #2 with changelog entries that name no token, account or person; CHANGELOG entry; `EVENTS-SCHEMA.md` §8; flip §11's E4 row to In progress — session 2 with the versions and write the session-3 brief as §13.14. Then hand off in chat: redeploy, Signals now, read the newsroom and docket rows on an account in Network. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; parallel sessions push, so check `git ls-remote` before pushing. Read the live CHANGELOG counter; no rotation is due unless it reads 100. One push. Then give me a prompt to paste into a new session for E4 session 3, and remember session."

### Added
- **E4 session 2 — newsroom pages, agendas and the docket watch** (design plan §5.5, catalogue §5.5.1 rows 4 · 6 · 7; §11's E4 row flipped to In progress — session 2; the session-3 brief written as §13.14 with its paste-in prompt) on session 1's run, never a fork
- `EVENTS-SCHEMA.md` §8: the session-2 paragraph (the monthly newsroom read and its `EV_SIGNALS_NEWSROOM` skip state, the agenda read, recordings as manual `agenda` rows, the docket watch over the Federal Register FERC feed with no event slug, the run answer's new fields); §3's `agendaUrl` note. `NETWORK-SCHEMA.md` §3 (`Newsroom URL` carried on `nop=accounts`; `Event Slug` empty for a `docket` row), §8 (`newsroomUrl?` on the accounts answer; the empty-slug rule for `docket` only; the upsert refreshing Confidence / Note)
- `scripts/check-events-signals.js` grew from 76 to **103 checks**: a newsroom page naming a show by its edition name and another by its series with the year nearby, a 404 page audited without an account id and retried, the monthly skip (read today → skipped; aged 33 days → read again, rows updated never duplicated), customer and supplier pages never read, an agenda page and the same-URL skip, the Federal Register FERC feed (the URL asserted equal to the Scraper roster's `fedreg-ferc` row) with two watched filers, an unwatched filer and a non-filer, the docket rows through Network's real write leg with the empty slug and `bad_slug` on every other kind, the score ignoring them, `nop=accounts` carrying `newsroomUrl` only when set, the recording rows and their `Recording:` note

### Changed
- **The docket source is the Federal Register's FERC feed, not a FERC eLibrary RSS** — the Scraper roster carries none: FERC's own site is retired there as `blocked` (a browser challenge no server-side reader passes) and the roster's FERC row is the Federal Register feed, where an order or notice takes legal effect and whose item titles name the filer. Live-probed from the session (never the app): 200, 129 items, empty descriptions. Recorded in §11 and §13.14
- `verify-events-roles.py`: the signal form's kinds are `linkedin-manual` · `registrant-mail` · `agenda`
- `live-site-pages/events-data/events.json` / `events.ics`: two iMasons rows that ended 2026-09-22 flipped to `past` by `check-events-registry.py --fix-past` (the checker's own remedy; today is 2026-09-23 UTC) and the `.ics` rebuilt — 69 confirmed of 100

#### `Events.gs` — v01.07g

##### Added
- `evSweepNewsrooms_` / `evParseNewsroom_` / `evNewsroomState_` · `evNewsroomSave_` · `evNewsroomFresh_` (row 4): per `target` account with `newsroomUrl`, read unless read within `EV_NEWSROOM_DAYS` = 28 (the day parked per account id in `EV_NEWSROOM_READ_PROP`), the page text (scripts and styles stripped) matched on each target event's name, or its series with the edition's year within `EV_NEWSROOM_NEAR` = 400 characters → `newsroom` 0.7, the page as evidence, the person the page names (the roster parser over the same page); a failed page one audit row with no account id, retried next run
- `evSweepEvent_`: the agenda at `agendaUrl` through `evParseSpeakers_` → `agenda` 0.9 with the person; `same_as_speakers` when it equals the roster URL
- `EV_DOCKET_FEEDS` (the Scraper roster's `fedreg-ferc` URL), `EV_DOCKET_SEGMENT_RE`, `evDocketSegments_` (the docket segment ids found by name in `profiler-segments.json` — never hard-coded), `evSweepDockets_` (once per run, reported in `feeds[]`), `evMatchDockets_` (every watched account with a docket segment named in an item's title or text → `docket` 0.7, the item link, `eventSlug` empty)
- `EV_SIGNAL_CONFIDENCE` gains `newsroom` 0.7 · `agenda` 0.9 · `docket` 0.7; `EV_SIGNAL_MANUAL_KINDS` gains `agenda` — `evSignalManual_` prefixes the note with `Recording:` on that kind (a note already starting with "Recording" is kept; no line → `Recording`)

##### Changed
- `evSignalsRun_`: the newsroom sweep after the press match, the docket watch after it (event-independent), `pages` / `pagesFailed` counting the agenda and newsroom reads, `newsrooms{}` and `dockets{}` on the answer, `newsrooms` · `newsroomsSkipped` · `dockets` in the parked `EV_SIGNALS_LAST` and the run's audit counts

#### `Events.html` — v01.08w

##### Added
- The signal form's third kind, "Recording of a talk you watched"; the form's note and the link placeholder mention it

#### `Network.gs` — v01.12g

##### Changed
- `nwPeerAccounts_`: `newsroomUrl` on the row when it is an `https?://` value
- `nwPeerSignalsWrite_`: an empty `eventSlug` is accepted for `kind = docket` only; a malformed slug on `docket`, or an empty slug on any other kind, is still `bad_slug`

## [v07.19r] — 2026-09-22 07:50:15 PM EST

> **Prompt:** "Run E4 session 1 — the attendance signals — from `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`: §13.12 is the brief (follow its reading list in order, then session 1's five build steps exactly; sessions 2 and 3 are not this session), §5.5 and the §5.5.1 catalogue the design, `repository-information/NETWORK-SCHEMA.md` §3 / §8 and `repository-information/EVENTS-SCHEMA.md` §3 / §6 / §8 the shapes. B (v07.10r), E2 (v07.15r) and E3 (v07.18r; `Events.html` v01.06w, `Events.gs` v01.05g) are Done in §11. Live state you cannot see from the repo: both peer tokens are set on the live deployments, the developer confirmed the `seats` lists in `profiler-segments.json` on 2026-09-22, and `relevancePrior` in the live `Tuning` tab is 0.2 (the repo's seed stays 0.05 — it only seeds an empty tab). Build the weekly sweep in `Events.gs` (`evSignalsRun_` over every starred event plus the top ten recommended — the Map Your Show and a2z exhibitor parsers, the speaker roster from JSON-LD `performer` or HTML, the three newswire RSS feeds keyword-watched per target / customer / partner account, every hit matched to a Network account by its normalised name and written over the bridge's existing write leg with kind, confidence, evidence URL and `firstSeen`; `eop=installsignals` idempotent, `eop=signalsnow`; a failed page one audit row and nothing else), the manual signal form on the sheet's owner block in `Events.html` (account, kind ∈ linkedin-manual · registrant-mail, URL, one line, a rated confidence — the same write leg), the "Signals only" pill switched on over the cached score's `why.accounts[]` (no new op), the sweep controls and a last-swept line on the poller card, `scripts/check-events-signals.js` (a Node sandbox harness: fixture directory, speaker and RSS pages, the matcher, the three kinds and their confidences, the upsert's written-then-updated on a re-run, a LinkedIn URL never fetched and an attendee list never fetched, the admin refusals with zero fetches; zero live calls) and the verifier's signals pass. Two developer-approved extras ride this session (2026-09-22): (a) the poller's past-date guard — `evPollSource_`'s item loop proposes `new-event` / `new-edition` items whose dates have already passed; skip them and add a harness case to `scripts/check-events-poller.js`; (b) extend `scripts/check-events-registry.py` to validate `profiler-segments.json` → `seats`: both keys `storage-seller` and `aidc-power-seller` present, every `segments[]` id present in `segments[].id`, no duplicates within a seat. No newsroom pages, agendas or FERC (session 2), no Scraper `people[]` or `cop=people` (session 3), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with `node --check` on a `.js` copy of `Events.gs`, `scripts/check-gas-inner-scripts.js`, `node scripts/check-events-signals.js`, `node scripts/check-events-score.js`, `node scripts/check-peer-bridge.js`, `node scripts/check-events-poller.js`, `python3 scripts/check-events-registry.py`, `python3 scripts/check-readme-tree.py` and `scripts/verify-events-roles.py` (zero page errors at phone width; Playwright is `pip install playwright` with the pre-installed Chromium, no `playwright install`), and grep the served page and the `.gs` for `linkedin.com`, `10times` and `attendee`. Bump `Events.html` / `Events.gs` per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, account or person; CHANGELOG entry; README tree entries; `EVENTS-SCHEMA.md` §8; flip §11's E4 row to In progress — session 1 with the versions, note the two extras there, and write the session-2 brief as §13.13. Then hand off in chat: redeploy, Install signals, Signals now, open RE+ 2026 and read its accounts, add one manual signal and find it on the contact in Network. Normal Session Start, Pre-Commit and Pre-Push checklists on a `claude/*` branch restarted from `origin/main`; run `git fetch --unshallow origin main` first; the C2 Routine fires Wednesday 2026-09-23 11:00 UTC and parallel sessions push, so check `git ls-remote` before pushing. The CHANGELOG stands at `Sections: 89/100` — read the live counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E4 session 2, and remember session."

### Added
- **E4 session 1 — attendance signals** (design plan §5.5, catalogue §5.5.1 rows 1 · 2 · 3 · 11 · 13; §11's E4 row flipped to In progress — session 1; the session-2 brief written as §13.13 with its paste-in prompt). `scripts/check-events-signals.js` — 76 checks, zero live calls: the real sweep, parsers, matcher and manual-signal functions of `Events.gs` in one VM context with stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService` / `ScriptApp`, and Network's **real** `nwPeerSignalsWrite_` / `nwPeerSignalsRead_` / `nwPeerAccounts_` in a second context that the peer URL routes into
- `EVENTS-SCHEMA.md` §8 "The E4 session ops" (`eop=installsignals` · `signalsnow` · `signal`, the run's answer shape, the parked `EV_SIGNALS_LAST` state), §5's `Signals` row amended, §12's checker entry; `NETWORK-SCHEMA.md` §8 (the `linkedin-manual` exemption, the person on the read leg, the session `nop=signals` GET); README tree entry for the new harness
- **Developer-approved extra (b):** `scripts/check-events-registry.py` validates `profiler-segments.json` → `seats` — both seat keys present with a non-empty `segments[]`, every id in `segments[].id`, no duplicate within a seat, no unknown seat key; proved to exit 1 on tampered copies

### Changed
- **Developer-approved extra (a):** the poller's past-date guard — `evPollSource_` skips a `new-event` / `new-edition` whose `after` dates have already passed, counted as `pastSkipped` on the source and the run; `scripts/check-events-poller.js` gains the case (two past 2025 rows in the JSON-LD fixture, never queued; 67 checks) and the panel's `signals` state assertion
- Live probes from the session (organiser and newswire pages, never the app): the Map Your Show 8_0 gallery is a client-side app whose exhibitors come from the site's own JSON proxy (`…/ajax/remote-proxy.cfm?action=search&searchtype=exhibitorgallery`), which answers with the `X-Requested-With: XMLHttpRequest` header alone — RE+ 2026 returned all 1,214 exhibitors in one call; RE+'s speakers page is a Swapcard iframe widget (no server-rendered names); PR Newswire's all-releases feed answers RSS; Business Wire's "home" channel answers an error document while the all-news channel `rss=G1QFDERJXkJeEFpRXg==` (found by probing the channel parameter) answers 812 items; GlobeNewswire could not be reached from the session's egress and is landed unverified — the run reports every feed's status
- `verify-events-roles.py`: the stub answers `netaccounts` · `signal` · `installsignals` · `signalsnow` and carries `signals` on `proposed`; the probe expects the enabled pill; a signals pass (the form fills from one `eop=netaccounts`, writes the typed row through `eop=signal` and clears; the pill narrows the agenda to the signalled event over the cached score with ≤ 1 fetch; the sweep card's Install signals / Signals now reach the stub; screenshots `events-signals.png` / `events-signals-card.png`); `verify-network-roles.py`'s stub answers `nop=signals` so the detail line renders — both ALL CHECKS PASSED, zero page errors at 390 × 844

#### `Events.gs` — v01.06g

##### Added
- The E4 block: `evSignalsRun_` (trigger handler `evSignalsTick`; `eop=installsignals` idempotent — every trigger on either name deleted, one weekly **Tuesday 06:00 America/New_York** trigger created; `eop=signalsnow` as the admin who pressed it, that owner only; the trigger sweeps every owner with a `Stars` row as `signals`): targets `evSignalsTargets_` (upcoming starred events + the top `EV_SIGNALS_TOP_N` of `evRecommend_` as the owner, starred first, deduplicated); per event `evSweepEvent_` — `evExhibitorSource_` rewrites a Map Your Show gallery URL to its JSON proxy with the XHR header and routes an a2z host to the page, any other host `unknown_host` and never fetched; `evParseMysExhibitors_` (`hit[].fields.exhname_t`, or the gallery's `card-Title` elements from an HTML fixture; a broken body throws `mys_not_json`), `evParseA2zExhibitors_`, `evParseSpeakers_` (JSON-LD `performer[]` and `Person` nodes with `worksFor` · `affiliation` · `jobTitle` via `evCollectPersons_`, else HTML speaker cards: name · title · company or "Title at Company"); once per run `evSweepFeeds_` over `EV_NEWSWIRE_FEEDS` and `evMatchPress_` (`EV_NEWSWIRE_CUE_RE` + the account key + the event's name or series key, whole-word containment via `evTextHasKey_`); the matcher `evNormaliseCompany_` (`nwNormaliseCompany_` byte for byte — `EV_LEGAL_SUFFIX_RE` mirrored) and `evAccountKeys_` (name + Profiler slug as words), `evSignalsMatcher_` over target · customer · partner; `evSignalsWrite_` in batches of `EV_SIGNALS_BATCH` over the bridge's write leg; a failed page or feed one audit row (`events_signals_page_failed` / `events_signals_feed_failed`), the poller's budgets, `stopped` on overrun; the counts parked in `EV_SIGNALS_LAST` (`evSignalsState_`, answered on `eop=proposed` as `signals`)
- `eop=signal` (`evSignalManual_`): the manual path — `bad_account_id` · `bad_slug` · `bad_kind` (only `linkedin-manual` · `registrant-mail`) · `evidence_required` · `bad_confidence` before any write, `note` collapsed to one line, optional `personName` / `personTitle`, Network's per-row rejections relayed, `not_configured` passed through; audit the kind and counts only
- `evStripTags_` reads any entity the decoder does not name as a space

##### Changed
- `evPollSource_`: the past-date guard (extra a) — `res.pastSkipped`, summed onto the run
- `evRecommend_` / `evScoreEvent_`: the signal read carries `personName` / `personTitle` when present, and the strongest signal's person rides `why.accounts[].signal`; `evPeerSignals_` passes the person through
- `handleEventsOp_`: `installsignals` · `signalsnow` · `signal` behind the `signals` capability

#### `Events.html` — v01.07w

##### Added
- The manual signal form `evSignalForm` on the sheet's owner block (`#ev-sigform`: `#ev-sig-account` from `eop=netaccounts` fetched once per session via `evLoadNetAccounts`, `#ev-sig-kind`, `#ev-sig-url`, `#ev-sig-note`, `#ev-sig-conf` defaulting to 0.8, `#ev-sig-add` → `evApiBody('signal', …)`; the form disables itself with the connect-Network line on `not_configured`; a saved row clears the fields, refetches the score and repaints the sheet's why)
- The "Signals only" pill switched on (`#ev-f-signals`, `evSignalsToggle` / `evHasSignal` over the cached `why.accounts[]`, one `eop=recommend` when nothing is cached, `evSignalsStatusLine`); `evMatches` honours `_evFilters.signals`; `evAfterWrite` refetches while the filter is on
- `evPaintWhy` names the person (`.ev-why-person`) where the signal carries one
- `evSignalsCard` on the Proposed tab (`#ev-sigcard`: the sweep's badge, `#ev-sig-install` / `#ev-sig-now` through `evPollButton` with a per-card status id, `#ev-sig-last`); `evPollButton` takes an optional status id
- `evErrText` texts for `bad_account_id` · `bad_kind` · `evidence_required` · `bad_confidence` · `linkedin_not_fetched` · `account_not_found` · `upstream_*`

#### `Network.gs` — v01.11g

##### Added
- `nwSignalsOp_` — `nop=signals` (session GET, after `validateSessionForData` + `nwRequire_(sess, 'signals')`): `accountId`, or `contactId` resolved to its account; the owner-scoped live rows, newest `Last Seen` first, with `note` and the person where present; audit ids and counts only

##### Changed
- `nwPeerSignalsWrite_`: a LinkedIn host is accepted when `kind === 'linkedin-manual'` (it rejected every kind before — the manual path could not have landed); `nwPeerSignalsRead_` carries `personName` / `personTitle` when non-empty

#### `Network.html` — v01.21w

##### Added
- `nwSignalsLine` — one "Will be at" `dt` / `dd` on the account detail (after Contacts) and the contact detail (after History), read through `nwApi('signals', …)` when the detail opens; each signal with its slug, kind, confidence, the person and the evidence link; `not_configured` / errors as text, never a throw

## [v07.18r] — 2026-09-22 05:29:45 PM EST

> **Prompt:** "Run E3 — the recommendation score — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.11 is the brief (follow its reading list in order, then its five build steps exactly), §5.4 the design, repository-information/EVENTS-SCHEMA.md §5 / §6 / §8 the shapes. B (v07.10r) and E2 (v07.15r; Events.html v01.05w, Events.gs v01.04g) are Done in §11, and E2's first live cycle has run — the weekly trigger is installed and the Proposed queue holds 33 pending rows. Do not touch the poller, the queue or events.json. Build eop=recommend in Events.gs (the six §6 terms computed server-side from Network's scored accounts and their signals over the bridge, the seat segments from profiler-segments.json, mentions[] and the owner's stars; Tuning seeded once with the default weights and a regions row and read on every score; notConfigured degrades, never fails; audit counts only), the Recommended pill and score chips on the agenda and the why panel on the sheet in Events.html (fetched on demand — no poll), scripts/check-events-score.js (a Node sandbox harness proving every term against hand-computed values, a weight change reordering, the not_configured degrade and the non-admin refusal with zero live calls) and the verifier's Recommended pass. No attendance sweeps (E4), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, node scripts/check-events-score.js, node scripts/check-peer-bridge.js, node scripts/check-events-poller.js, python3 scripts/check-events-registry.py, python3 scripts/check-readme-tree.py and scripts/verify-events-roles.py (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token or account; CHANGELOG entry; README tree entries; EVENTS-SCHEMA.md §5 and §6; flip §11's E3 row to Done with the versions and write the E4 brief as §13.12. Then hand off in chat: redeploy, press Recommended, judge the top five line by line, change a weight and press again. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The repo stands at v07.17r and the CHANGELOG at Sections: 88/100 — read the live counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E4 session 1, and remember session."

### Added
- **`Events.gs` v01.05g — `eop=recommend`, the recommendation score (E3, design plan §5.4; `EVENTS-SCHEMA.md` §6).** `evRecommend_` scores every upcoming registry row (`status` ∉ cancelled · past, not yet over) server-side from bridge data — Network's scored accounts once over `evNetworkProxy_('accounts')`, each account's signals over the `nop=signals` read leg capped at 40 (`EV_SCORE_SIGNAL_CAP`, `signalsCapped` says when it stopped), the seats' segment sets from `profiler-segments.json` → `seats` and the dossier `lastUpdated` dates from `profiler-companies.json` (both fetched from the Pages site through `evPagesJson_`), `mentions[]` from the row, the owner's registered / attended Stars for the conflict term. `evScoreEvent_` computes the six terms exactly as §6 writes them — `segmentFit` by audience share, `accountPresence` as Σ stageWeight × confidence capped at 1 with one account counted once at its strongest signal (`EV_STAGE_WEIGHT`; customer / partner / channel 0.5 at any stage), `corpusSalience` with a 12-month half-life over the newest mentioning dossier, `proximity` 1 / 0.5 / 0 from the `Tuning` `regions` row and the registry-derived country set, `conflict` −1 on an overlapping starred registered / attended event **other than the event's own star**, `relevancePrior` = relevance / 5 — and `score = Σ weight × term` to two decimals (never −0), sorted by score then slug. The answer carries the weights, the regions, `defaulted[]`, `seeded`, `notConfigured`, the counts and per event the terms and a `why` (segments matched, accounts by name with stage / stage weight / signal / evidence URL, mention slugs, conflicting starred slugs). Behind the `recommend` capability; audit counts only
- **`Events.gs` v01.05g — `evTuning_`: the `Tuning` tab seeded once and read on every score.** An empty tab receives the six §6 weight rows and a `regions` row (empty by default), each with a Note; a weight that is not a finite number in 0..1, or a term row deleted by hand, falls back to its default and is named under `defaulted[]`; a partially edited tab is never re-seeded. Editing a cell and pressing Recommended again reorders the list — no deploy
- **`Events.gs` v01.05g — degrades, never fails.** A `not_configured` Network side zeroes `accountPresence`, sets `notConfigured: true` and still computes every other term; any other upstream failure is named in `networkError` with the same degrade; an unreadable segments or companies file zeroes its term and is named under `unavailable[]`
- **`Events.html` v01.06w — the Recommended pill and the score chips (E3).** A **Recommended** pill on the Mine row (admin, `recommend` capability): every press fetches `eop=recommend` once and the agenda re-renders as one ranked "Recommended" section — a rank and a score chip on every scored row, the month-in-view label reading Recommended, the status line reporting the ranking (accounts and signals read, or "Network not connected — scored without your accounts", any defaulted weight, any unreadable file); pressing again restores the month groups without a request. Fetched on demand only (D14): on the pill, on a sheet opened before any score, on return to the tab and after a star write while ranked — never polled
- **`Events.html` v01.06w — the *why* panel on the sheet** replaces the E1/B placeholder line: the score and its rank, the six terms as one bar each with its weight and signed contribution (the conflict bar in the gold), the accounts with a signal by name — relationship, stage, stage weight, signal kind, confidence and the evidence link — the segments matched in the developer's seats, the dossiers that name the show as Profiler chips, the starred conflicts as links that open that event, and a Tuning line naming the tab, the preferred regions and any defaulted weight; a `notConfigured` answer paints the "connect Network" line at the top and the terms that do not need Network below it
- **`live-site-pages/profiler-data/profiler-segments.json` — a `seats` block** (`storage-seller` · `aidc-power-seller`, each `{ label, segments[], basis }`, the buyer segments per `C5-SALES-SIMULATIONS-DESIGN.md` §9's inventory). The file carried no seat → segment mapping before, and design plan §12.6 requires the score to read the seats' segments from this file at run time, never from a copy in Events — so the mapping now lives where the plan says it does. Documented in `PROFILER-SCHEMA.md` → Segments registry
- **`scripts/check-events-score.js`** — the E3 sandbox harness (the `check-peer-bridge.js` idiom): the real scoring functions of `Events.gs` in one VM context with stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService`, a fixture registry, segments and companies files and a stubbed Network far side. 70 checks: every term against a hand-computed value on three fixture events and the score to two decimals; the seed once; a weight change reordering; a malformed, an out-of-range and a deleted weight row each defaulted and named; ties broken on slug and no −0; `not_configured` and a sub-16 property degrading with no network fetch; an unreachable Network side named; the 40-account cap; a 503 on the segments file zeroing `segmentFit` and named; `recommend` refused to an analyst with zero fetches and zero tab opens; no audit row carrying an account name, id or token. Zero live calls
- **`scripts/verify-events-roles.py` — the Recommended pass** (§13.11 step 5): the stub answers `eop=recommend` with three scored upcoming events in reverse date order; the pill issues exactly one request, the agenda re-orders into one "Recommended" section with `0.91 / 0.77 / 0.42` chips and ranks 1–3, the label reads Recommended, the top event's *why* leads with the score, six bars with weights and widths following the terms, the stub account with its stage, signal and evidence link, the segments, mention chips and the starred conflict, and unpressing restores the month groups without a request. Screenshot `events-recommended.png`. ALL CHECKS PASSED, zero page errors at 390 × 844

### Changed
- **`EVENTS-SCHEMA.md`** — §5 the `Tuning` row now states the seeded defaults, the `regions` row and the fallback rule; §6 rewritten around the implementation: the seat source (`seats`), one-account-once at its strongest signal, the stage-weight table's edge rows (`channel`, a target past `none`), the calendar-month decay from the dossiers' `lastUpdated`, the derived same-country rule, the self-exclusion on conflict, the 40-account cap, the answer shape and the degrade rules; §12 registers `check-events-score.js`
- **`PROFILER-SCHEMA.md`** — Segments registry: the `seats` row
- **`NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's E3 row flipped to **Done — v07.18r** with the versions and what landed; **§13.12 written** — the E4 brief (three sessions per §5.5.1: session 1 the exhibitor and speaker diffs, the newswire RSS and the manual path; session 2 newsroom pages, agendas and the FERC docket watch; session 3 the Scraper-side `people[]` and the `cop=people` route) with the paste-in prompt for session 1
- **README tree** — the Events entry carries `v01.06w` · `v01.05g` and the E3 line; `check-events-score.js` added under scripts; the verifier's description carries the Recommended pass

### Notes
- **Every verifier green:** `node --check` on the `.js` copy of `Events.gs`; `check-gas-inner-scripts.js` (11 files, 106 blocks); `check-events-score.js` 70/70; `check-peer-bridge.js` and `check-events-poller.js` unchanged and green; `check-events-registry.py` OK; `check-readme-tree.py` 0 findings; `verify-events-roles.py` ALL CHECKS PASSED with the new pass, zero page errors
- **Not touched, as instructed:** the poller, the Proposed queue, `events.json`; no attendance sweep, no plans, no discovery Routine; neither peer token widened; the session never called the app
- **Session context** written in the same commit (the "remember session" of this prompt) so the session stays at one push

## [v07.17r] — 2026-09-22 04:20:59 PM EST

> **Prompt:** "Before I start on E3, I want to close a couple open items:\n\n* I can confirm that \"My Card\" works as intended on Network.\n* When I try to export 2 cards in a vCard bundle (.vcf) with card images included, it works on my PC, but fails on my phone. On my phone, it looks like it's about to ask me to log into my Gmail to verify permissions, but then it quickly switches back to Network and then shows an \"Aw Snap\" error (see attached screenshot). What's going on? Fix it.\n* What should I set \"NW_POSTAL_ADDRESS\" to in my Network Apps Script?\n* How do I redeploy Events.gs from the Apps Script editor?" *(two screenshots attached: the previous session's close-out, and Chrome's "Aw, Snap!" page on Android at the moment of the crash)*

### Fixed
- **`Network.html` v01.20w — the vCard PHOTO splice crashed the mobile renderer (the reported "Aw, Snap!").** Root cause is `nwVcardFold`, not the Drive consent flash the symptom suggested: the original folded by re-slicing a shrinking `line` (`line = ' ' + line.slice(75)`), so every pass had to flatten the cons string the previous pass built — quadratic in the line's length. Property lines are short and were never affected; a PHOTO line is not. The stored card front is the 2,000 px capture (~600 KB), whose base64 is a ~800 KB single line, i.e. ~11,000 passes: **measured at 18.3 s and multiple GB of allocation churn per card on desktop-class V8**, which desktop Chrome absorbs and a phone renderer answers with an OOM kill. Two cards doubled it. `nwVcardFold` is now flat — it indexes the source string and `join`s once — verified byte-for-byte identical to the old output for every length 0–1,200 and at 200,000 chars, and **1,679× faster** on the 800 KB line (18,329 ms → 10.9 ms). A `PROJECT OVERRIDE` comment records why it must not be written back as a loop
- **`Network.html` v01.20w — the front is no longer base64-encoded at capture size.** `nwCardFrontBytes` (raw `arrayBuffer` → `nwBytesToB64`) is replaced by `nwCardFrontPhoto`: fetch as a Blob, `createImageBitmap` → canvas at `NW_VCARD_PHOTO_MAX` 720 px / `NW_VCARD_PHOTO_Q` 0.8, and base64 taken straight out of `toDataURL` — the full-size bytes are never turned into a string, and the canvas backing store is released before it is held. Typical PHOTO line ~40–90 KB (0.2 ms to fold). Falls back to the undecoded bytes only where `createImageBitmap` is absent or the image will not decode, and only under `NW_VCARD_PHOTO_RAW_MAX` (512 KB). Contacts on iOS and Android render the PHOTO at avatar size either way, and oversized PHOTO values are a known iOS import failure, so this is a fidelity-neutral fix
- **`Network.html` v01.20w — `nwBytesToB64` batches at 8 KB, not 32 KB.** `String.fromCharCode.apply` spreads its batch onto the call stack; 32,768 arguments is close enough to the engine limit to fail on a mobile renderer under memory pressure. Also builds through an array rather than `+=`

### Changed
- **`Network.html` v01.20w — the export reports progress through the photo fetches** (`Adding the card image N of M…`), which are serial and were silent
- **`NETWORK-SCHEMA.md` §11** — the PHOTO row records the 720 px re-encode; the N3 s2 paragraph names `nwCardFrontPhoto` and states the fold's flat-form requirement as a rule rather than an implementation detail

### Notes
- **No `Network.gs` change and no redeploy needed** — the PHOTO splice is entirely page-side by design (the card front lives in the developer's own Drive under `drive.file`, which the script cannot read), so the fix ships with the Pages deploy
- **The Gmail-permission flash the report describes is not the fault** and is unchanged: `nwDriveToken` calls the GIS token client with `prompt: ''`, which on an already-granted account opens and closes an auth window without interaction. On Android Chrome that window is full-screen for a moment. The crash followed it because the fold ran immediately after the token returned
- `scripts/verify-network-roles.py` — ALL CHECKS PASSED, zero page errors, 55 requests on the admin+s1+s2 pass, with the PHOTO splice exercised; `check-gas-inner-scripts.js`, `check-network-schema.py` and `check-readme-tree.py` clean; every inline `<script>` in the page re-checked with `node --check`

## [v07.16r] — 2026-09-22 09:27:50 AM EST

> **Prompt:** "[Scheduled Routine \"Profiler earnings desk\", trig_01HkrwpCULei8Gje6RGqcp1B, fired 2026-09-22T13:09:04Z.] STEP 0 — CLONE, THEN PROVE YOU CAN PUSH, BEFORE ANY RESEARCH. This Routine fires into a session with NO repository source. On 2026-09-16 a run completed a full IREN/Jinko/Oracle refresh, committed it locally as a378a96, and was DENIED on push — every minute of that work was thrown away. Do not repeat it. Establish the push path first, while it still costs nothing. [clone + unshallow + dry-run push probe steps, then:] You are a fresh session in the LightAISolutions/Sales repo, running the Profiler earnings desk. Read repository-information/profiler-refresh-calendar.json. It is the queue. DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run, oldest nextReport first. Anything left over is due again tomorrow — do not exceed the cap. For each row you take: 1. Verify the report actually published (the row's source names where to look). If it has not, re-date the row with the real date, set confirmed accordingly, and move on — write no dossier. 2. Run the Profiler Command in .claude/rules/profiler-app.md end to end, INCLUDING the news triage step in \"News Triage — Scraper Corpus Bridge\". Use the row's watch[] as the research priorities. CORPUS_TOKEN: [REDACTED — never committed to a public repo, per the prompt's own instruction]. 3. Advance the row: new nextReport (researched), confirmed, source, lastRefreshed, and refresh watch[] where the picture moved. Also: for any row that is unconfirmed and whose nextReport is within seven days, confirm the date and update the row. That is calendar work, not a refresh, and does not count against the cap. Land one commit per run under the repo's normal Pre-Commit / Pre-Push checklists. NEVER write the corpus token into any file, commit message, CHANGELOG entry or pushed artifact — the repo is public via Pages. It belongs in this prompt only. NEVER create, update or delete a Routine/trigger. The calendar is the only schedule. If you find yourself wanting to arm a follow-up, write the date into the row instead. IF NOTHING IS DUE: stand down. [reporting requirements omitted here, satisfied in-session]"

### Changed
- **Refreshed the NOVONIX (`novonix`) dossier to `profileVersion` 2** (v1 archived to `live-site-pages/profiler-data/archive/novonix.profile.v1.json`) — the sole due row on the Profiler earnings desk queue (`nextReport` 2026-09-14, a Nasdaq minimum-bid-price compliance deadline, not an earnings date). Verified via two parallel research subagents (first-party SEC EDGAR + IR sources, third-party trade press/market-data corroboration) plus the Scraper news corpus: the 2026-09-14 Nasdaq cure deadline passed with the compliance outcome still **unconfirmed by any primary source** as of 2026-09-22 (price data makes mechanical compliance likely but is explicitly not treated as a substitute for a Nasdaq determination); a Yorkville funding-agreement amortisation event triggered 2026-09-10 (ASX VWAP below the A$0.12 floor), obligating a US$7.0m redemption due 2026-09-21 whose payment is not yet independently confirmed; a non-binding MOU with ACP Technologies, LLC (2026-09-16) for a domestic pitch-coated synthetic graphite anode material; interim customer (Panasonic) testing feedback on the June C-sample (2026-09-10): 12 of 14 specification parameters met; and a 2026-09-18 anonymous-source closure claim publicly denied by CEO Mike O'Kronley as "unequivocally false" after the company confirmed dismissing a contractor. Resolved the registered-office address discrepancy flagged in the prior version (71 Eagle Street confirmed current; 66 Eagle Street was stale third-party LEI data). Added 8 new sources; updated `strategyRead` (Yorkville mechanism, collection gaps, indicators to watch), `policyExposure` (Nasdaq regime), and the `panasonic` relationship entry accordingly
- **`profiler-companies.json`** — `novonix` registry entry re-synced via `sync-profiler-registry.py` (`lastUpdated` → 2026-09-22, `srcTotal` 69 → 76) and tagline updated to reflect the Yorkville amortisation event and the still-unresolved Nasdaq deadline
- **`profiler-data/profiler-graph.json`** — rebuilt via `build-profiler-graph.py` (1,482 edges, 1,107 curated)
- **`profiler-data/archive/archive-index.json`** — `novonix` entry added (v1 archived 2026-09-22)
- **`profiler-refresh-notes.json`** / **`profiler-refresh-calendar.json`** — `novonix` row converted from the one-time Nasdaq-deadline date to the ordinary quarterly-activities cadence per the row's own prior instruction: `nextReport` → 2026-10-29 (Q3-2026 quarterly activities report, inferred from the established cadence, `confirmed: false`), `lastRefreshed` → 2026-09-22; `source` and `watch[]` rewritten to record the still-open Nasdaq determination and Yorkville-payment-confirmation items, the two new watch items (ACP Technologies MOU, the closure-rumor denial), and the resolved registered-office item

## [v07.15r] — 2026-09-22 07:40:08 AM EST

> **Prompt:** "Run E2 — the poller and events sync — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.10 is the brief (follow its reading list in order, then its six build steps exactly), §5.3 the design, repository-information/EVENTS-SCHEMA.md §1 / §3 / §4 / §7 the shapes. E0 (v06.95r), E1 (v07.08r), B (v07.10r) and N3 (v07.14r; Events.html v01.04w, Events.gs v01.03g) are Done in §11. Build the weekly no-AI poller in Events.gs (evPollRun_ — the roster and the registry read from their Pages URLs with UrlFetchApp, JSON-LD and ICS sources only, blocked and manual rows never fetched, the six diff kinds written as Proposed rows deduplicated on source · slug · change · after, a failed source an audit row and nothing else), the admin Proposed panel on Events.html (Approve / Reject through eop=decide, Approved → copy as JSON, Mark applied, the Polls tab's last outcome per source, eop=installpoller idempotent), the events sync session command in a new .claude/rules/events-app.md (apply the approved JSON to events.json, advance lastConfirmed and the roster's lastProbe, rebuild events.ics, gate on check-events-registry.py exit 0, list the pr- ids to stamp), and scripts/check-events-poller.js, a Node sandbox harness proving the six diff kinds, the zero-row re-run, the never-fetched rows and the admin refusals with zero live calls. No score (E3), no signals (E4), no plans (E5), no discovery Routine (R); no new scope; never widen a peer token — the session never calls the app. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, node scripts/check-events-poller.js, python3 scripts/check-events-registry.py, python3 scripts/check-readme-tree.py and scripts/verify-events-roles.py (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, spreadsheet id or trigger id; CHANGELOG entry; README tree entries; EVENTS-SCHEMA.md §5 and §7; register the rules file in CLAUDE.md; flip §11's E2 row to Done with the versions and write the E3 brief as §13.11. Then hand off in chat: redeploy, Install poller, Poll now, approve a row, run events sync in a fresh session. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 85/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E3, and remember session."

### Added
- **E2 — the poller and `events sync` (design plan §5.3; §13.10 all six steps; §11's E2 row → Done).** `Events.gs` v01.04g / `Events.html` v01.05w
- **`Events.gs` — the poller** (`evPollRun_`, the block after the bridge): the roster (`EV_ROSTER_URL`) and the registry read once per run from their Pages URLs with `UrlFetchApp` (never a GitHub host); `evPollSkipReason_` keeps every `blocked`, `cadence: manual`, `html` / `manual`-feed, `robots: disallowed` or non-http row from ever being fetched; per source `muteHttpExceptions` + `followRedirects` + a try/catch, a 15-second allowance against a 270-second run budget that stops cleanly before a source that could overrun it (`EV_POLL_SOURCE_BUDGET_MS` / `EV_POLL_TOTAL_BUDGET_MS`), a 2 MB body cap; **JSON-LD** — every `<script type="application/ld+json">` block parsed on its own, arrays / `@graph` / `subEvent` walked, `@type` `Event` or any `…Event` subtype, `eventStatus` `EventCancelled`, the local date from the first ten characters of `startDate` / `endDate`, venue · city · region · country from the `Place` (`evParseJsonLd_`); **ICS** — a minimal RFC 5545 walker (`evParseIcs_`: unfold, `VALUE=DATE` exclusive `DTEND` moved back a day, `TZID` date-times keep their date, `SUMMARY` / `LOCATION` / `URL` / `UID` / `STATUS`, the four text escapes) that accepts what `evVevent()` and `build-events-ics.py` emit; the §1 slug reproduced (`evDeriveSlug_` — the series base plus the year, a year already in the name not doubled); the match (`evMatchRegistry_`: derived slug → same name or URL among the rows citing the key → same series base in another year → new) and the six diffs (`evDiffItem_`: `cancelled` · `moved-dates` · `changed-venue` · `changed-url` · `new-edition` with the §3 row seeded from the previous edition · `new-event` with nothing invented), Before · After as canonical JSON, deduplicated on (Source Key, Event Slug, Change, After) over every existing row whatever its status (`evProposedKeys_`); a failed or non-2xx source writes no proposal — one `Polls` row and one `events_poll_source_failed` audit row (status only); the run audit row counts only
- **`Events.gs` — the ops** (`action=events`, behind `evRequire_(sess, 'roster')`): `eop=proposed` (pending + approved rows with parsed Before / After, counts by status, the newest `Polls` row per source, whether the trigger is installed), `eop=decide` (`approved` / `rejected`, Decided At; reversible until applied — `already_applied` after), `eop=applied` (comma ids + `vXX.XXr` → `applied` with Applied In; a non-approved id skipped as `not_approved`), `eop=pollnow` (the same walk, audited as the admin), `eop=installpoller` (idempotent — every trigger on `evPollTick` or `evPollRun_` deleted, one weekly Monday 06:00 America/New_York created; the handler is the public `evPollTick()` because a time-driven trigger cannot target a `_` function); `Polls` (Source Key · Ran At · Status · Items · Newest Start) added to `EV_TABS`
- **`Events.html` — the Proposed tab** (admin · `roster`; a third tab in the strip, painted only for the admitted tier): the poller card (trigger state badge, Install poller, Poll now, Refresh, the status line, the last outcome per source with a failed status marked), the approved set as the `events sync` JSON (`evSyncJson` — `schemaVersion` 1 · `proposals[]` · `polls[]` — in a field for copying by hand and behind Copy as JSON, the version box and Mark applied → `eop=applied`, the queue counts), the pending and approved rows grouped by source with Before → After (`evDiffList`), Approve / Reject → `eop=decide`, the evidence link; loaded when the tab is opened, on Refresh and after every write — never polled (D14); a write's status survives the reload that follows it (`evReloadWith`)
- **`.claude/rules/events-app.md`** — the `events sync` session command (path-scoped to `Events.html` / `Events.gs` / `events-data/**` / `EVENTS-SCHEMA.md`, user-triggered by "events sync"): the input shape, the nine-step procedure (unshallow → read → apply per change kind → advance the roster's `lastProbe` → sort and stamp → `build-events-ics.py` → `check-events-registry.py` exit 0 as the gate, reverted on a finding → the `pr-` ids and the version to stamp → commit under the checklists), the never-list, the first-live-cycle hand-off; registered in CLAUDE.md as `## Events Sync Command` and in the Reference Files table
- **`scripts/check-events-poller.js`** — the Node sandbox harness: the real poller functions of `Events.gs` under stubbed `UrlFetchApp` / `SpreadsheetApp` / `PropertiesService` / `ScriptApp` / `Utilities`, a fixture registry and roster served from the stub, one JSON-LD page (an Organization block, an array block, a `@graph` with a subtype and a cancellation, a broken block), one ICS feed built by `build-events-ics.py`'s own `calendar()`, a blocked, a manual, an html, a robots-disallowed and a 403 row — **63 checks**: the readers on their own, the six diff kinds one row each with the right Before · After, the zero-row re-run through `evPollTick`, the never-fetched rows, the 403's one `Polls` row + one audit row + no proposal, the five ops refused to an analyst with zero fetches and zero tab opens, decide / applied / already_applied, `installpoller` idempotent (a stale trigger on the old name removed), zero live calls
- **`scripts/verify-events-roles.py`** — the E2 pass on the admin's page against a stateful stub (`PROPOSED_STUB` / `POLLS_STUB`, `eop=proposed` / `decide` / `applied` / `pollnow` / `installpoller`): the tab is admin-only (a turned-away tier has neither the tab nor the panel), opening it issues exactly one `eop=proposed`, the rows group by source with Before → After, Approve reaches `decide` and the panel refreshes, the JSON field parses back to the approved rows and the polls, a bad version is refused on the page, Mark applied stamps both rows and the empty state appears, Install poller and Poll now reach the stub — ALL CHECKS PASSED, zero page errors at 390 × 844; screenshot `events-proposed.png`
- **`repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's E2 row flipped to **Done** (v07.15r, the versions, the first live cycle reported not asserted); **§13.11 written**: the E3 brief (the score, `Tuning`, `eop=recommend`, the Recommended pill and the *why* panel, `scripts/check-events-score.js`, the verifier pass) and its paste-in prompt

### Changed
- **`repository-information/EVENTS-SCHEMA.md`** — §5 gains the `Polls` tab; §7 now records the poller (the never-fetched set, the budget, the two readers, the match, the six diffs, the dedup, the failure path), the five ops and their shapes, the trigger handler, the sync JSON, and the command's apply rules; §12 lists `check-events-poller.js`
- **`CLAUDE.md`** — `## Events Sync Command` section after Industry Guidance; `.claude/rules/events-app.md` in the Reference Files table
- **`README.md`** — `Events.html` v01.05w · v01.04g with the E2 description; `events-app.md` under `.claude/rules/`; `check-events-poller.js` under `scripts/`; the verifier's entry extended
- **`repository-information/SESSION-CONTEXT.md`** — remember session
## [v07.14r] — 2026-09-22 07:15:53 AM EST

> **Prompt:** "Run N3 session 2 — the exports, the drafts and the QR card — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.9 is the brief (steps 5–8 only — session 1's steps 1–4 landed at v07.13r and §11's N3 row reads In progress — session 1), §4.3 the design, repository-information/NETWORK-SCHEMA.md §3 (the Drafts and Mailings tabs and NW_DRAFT_STATUS already exist), §10 / §11 (the hand-off and export formats), §12 / §13 the shapes, and the code you extend: Network.gs nwExportOp_ (session 1's nop=export with format=csv — add xlsx through the Receipts temp-spreadsheet path with Contacts / Accounts / Interactions sheets and vcard hand-rolled, per contact and as one .vcf bundle, PHOTO;ENCODING=b;TYPE=JPEG from the card front only when the user ticks "include card image", base64 folded at 75 octets; every export keeps the D9 do-not-contact exclusion and the recordDisclosure row), nwBulkOp_ / nwListOp_ (the shapes to match), nwInteractionAdd_ (the email-out row a sent draft writes); Network.html nwBar (session 1's action bar — the CSV button becomes an Export menu with the "include card image" tick, the disabled Mailing button becomes Start a mailing), nwEditCard / nwReviewSection (the editor idiom), nwDownloadText (the download helper). Build (6) the follow-up drafts per D15: pick recipients from the selection (Do Not Contact excluded, Consent Marketing = no excluded) → a saved template from the Mailings tab (name, subject, body) or one written now with {{first}}, {{company}}, {{metAt}}, {{lastTopic}} → nop=drafts renders one editable draft per recipient into the Drafts tab (status = draft) → a review list edited in place → hand off by .eml bundle (one RFC 5322 file per draft, From typed once and kept in localStorage, an unsubscribe line and a postal address in the default template), one-column CSV / .txt, per-draft copy (subject + body), or mailto: → nop=draftstatus marks sent (writes the email-out Interaction with the d- id as evidence, sets Sent At) or discarded; the app never sends — no MailApp, GmailApp or Gmail scope anywhere, and the verifier greps the served page and the .gs to assert it. (7) The "My card" panel: the developer's own vCard from the Profiles row, rendered as a QR full-screen — run grep -rn "qrcode\|QRCode\|qr-" live-site-pages/*.html first and reuse an inline generator if one exists, else a minimal byte-mode encoder (version ≤ 10, level M) in the page, no library. (8) scripts/verify-network-roles.py: the vCard bundle parses under a minimal BEGIN:VCARD walker with N / FN / EMAIL per contact, a three-recipient mailing renders three drafts, one edited draft round-trips, marking sent writes the email-out Interaction the stub records, the .eml has From / To / Subject and a body, the QR panel renders a canvas or SVG with a non-trivial module count; zero page errors at 390 × 844. No warmth, no reconnect list, no import panel (N4); no new OAuth scope; never widen a peer token. Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-network-schema.py (extend ALLOWED_KEYS only with count / id keys), python3 scripts/check-readme-tree.py and the verifier (Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Network.html / Network.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries that name no token, template body or address; CHANGELOG entry; README tree descriptions; flip §11's N3 row to Done with the versions and write the E2 brief as §13.10 before closing. The iOS / Android vCard import and the second-phone QR check are reported in the hand-off, not asserted. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 84/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for E2, and remember session."

### Added
- **`Network.gs` v01.10g** — `nwExportOp_` gathers the selection once (`nwExportRows_`: scope, the D9 do-not-contact exclusion, no Raw Extraction) and answers `format=csv` (unchanged), `xlsx` (`nwExportXlsx_` — the Receipts temp-spreadsheet path: Contacts / Accounts / Interactions sheets, JSON columns flattened to `email1…3` / `phone1…3`, Drive links left out, exported through the Drive endpoint, trashed, base64) and `vcard` (`nwVcard_` — hand-rolled 3.0: N / FN / ORG / TITLE / EMAIL;TYPE / TEL;TYPE / ADR / URL / X-SOCIALPROFILE / NOTE / CATEGORIES / REV / UID, RFC 2426 escaping, `nwVcardFold_` at 75 octets; `cards[]` + the `vcf` bundle); every format writes the disclosure row through `recordDisclosure` and audits counts. `nop=mailings` (templates · open drafts · the me fields), `nop=drafts` (`nwDraftsOp_` — a saved template or subject + body, `nwMerge_` over the ten merge fields incl. `{{lastTopic}}` from `nwLastInteraction_` and `{{myAddress}}` from the `NW_POSTAL_ADDRESS` property, one Mailings row per render with the list filter, one Drafts row per recipient, `skipped[]` with `do_not_contact` / `no_consent` / `no_email` / `not_found` / `deleted` / `duplicate` / `bad_id`), `nop=draftstatus` (`draft` = an edit, `sent` = the `email-out` Interaction through `nwInteractionAdd_` with the d- id as evidence + Sent At, `discarded`; `already_sent` afterwards), `nop=mycard` (GET / `set=1` on the Profiles row — Title and Phone columns added to `NW_TABS.profiles`, the header-upgrade idiom appends them). D15 held: no `MailApp` / `GmailApp` / Gmail scope anywhere in the PROJECT region
- **`Network.html` v01.19w** — the bar's CSV button becomes an Export menu (CSV · Excel · vCard bundle · vCards one per contact as a zip · the "include card image" tick — `nwBulkExport`, `nwCardFrontBytes` fetching the front with the user's own drive.file token, `nwVcardWithPhoto` splicing `PHOTO;ENCODING=b;TYPE=JPEG` folded at 75 octets), `nwZip` (a hand-rolled store-only zip with CRC-32) and `nwDownloadBlob`; "Start a mailing" enabled → the follow-up drafts panel (`nwMailPanel` / `nwMailOpen` / `nwMailRender` — recipients from the selection, saved templates + the default template with the unsubscribe line and `{{myAddress}}`, merge-field chips, `nwDraftsPaint` / `nwDraftBlock` edited in place with Save edit, Copy, Mail app (`mailto:`, Copy fallback over 1,800 characters), Mark sent after a confirm that says nothing is sent, Discard; the hand-off row — `.eml` bundle (`nwEmlText`: From / To / Subject (RFC 2047) / Date / MIME-Version / Content-Type / X-Unsent, the From kept in `localStorage`), CSV, `.txt`); the masthead pills Drafts and My card (`nwPillsMount`, admin only); the My card panel (`nwMyCardPanel` — name · title · company · phone through `nop=mycard`, the QR preview) and the full-screen QR overlay; `nwQrMatrix` — a byte-mode QR encoder, versions 1–10 at level M, GF(256) Reed–Solomon, the eight masks scored, format and version information — and `nwQrSvg`; the repo had only QR decoders (`grep -rn "qrcode\|QRCode\|qr-" live-site-pages/*.html`), so no generator was reused
- **`scripts/verify-network-roles.py`** — the stub answers `nop=export` for all three formats, `nop=mailings`, `nop=drafts`, `nop=draftstatus` and `nop=mycard`, and the Drive stub serves a card front for `alt=media`; tests for the vCard bundle under a minimal `BEGIN:VCARD` walker (N / FN / EMAIL per card), the PHOTO splice (one Drive fetch, base64 of the stub JPEG, every line ≤ 75 octets), the per-contact zip, the `.xlsx` bytes, a three-recipient mailing → three drafts with no `{{` left and the template saved, one edited draft round-trip, `mailto:` and Copy, the `.eml` bundle (three RFC 5322 files with From / To / Subject and a body) and the `.txt`, Mark sent → the `email-out` Interaction with the d- id as evidence, Discard, the Drafts pill, My card → the QR (the preview and the full-screen SVG ≥ 29 × 29 modules, the page's matrix equal to python-qrcode's at the same version and mask when importable), and the D15 grep of the served page and the `.gs` PROJECT region; the session-1 CSV test opens the Export menu first; ALL CHECKS PASSED, zero page errors at 390 × 844. Screenshots `network-export-menu.png`, `network-drafts.png`, `network-my-card-qr.png`
- **`repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`** — §11's N3 row flipped to **Done** (v07.13r + v07.14r, the versions, the iOS / Android import and the second-phone QR reported not asserted); **§13.10 written**: the E2 brief (the poller, the `Proposed` panel, `events sync` in a new `.claude/rules/events-app.md`, `eop=installpoller`, `scripts/check-events-poller.js`) and its paste-in prompt

### Changed
- **`repository-information/NETWORK-SCHEMA.md`** — §3 Profiles gains Title · Phone; §10 the three drafts ops, the `.eml` headers and the zip, the template's out-of-region `sendHipaaEmail` noted; §11 the export op's three formats and the QR encoder; §12 the s2 audit keys; §14 the verifier's s2 scope
- **`scripts/check-network-schema.py`** — `ALLOWED_KEYS` + `mailingId`, `draftId`, `skipped`, `saved`, `sent`, `discarded`, `edited`, `templates` (ids and counts only)
- **`README.md`** — `Network.html` v01.19w · v01.10g with the session-2 description; the verifier's entry
- **`repository-information/SESSION-CONTEXT.md`** — remember session

## [v07.13r] — 2026-09-22 06:46:16 AM EST

> **Prompt:** "Run N3 session 1 — the list, the filters and the bulk actions — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.9 is the brief (follow its reading list in order, then session 1's steps 1–4 exactly; session 2's steps 5–8 are a second session), §4.3 the design, repository-information/NETWORK-SCHEMA.md §3 / §4 / §12 / §13 the shapes. N2 (v06.94r) and B (v07.10r, proven live 2026-09-22 with both peer tokens set; Network.html is now v01.17w after two Source Event default fixes at v07.11r–v07.12r, Network.gs v01.08g) are Done in §11. Generalise the Receipts History card into the Contacts list with search, the eight filters, the four sorts (lastTouch computed server-side once per list, the only widening of the list payload) and per-row expand to the existing detail; add multi-select with a sticky action bar — tag, set relationship / stage, export selection (CSV now; the other formats are session 2), start a mailing (session 2), soft-delete — with nop=bulk validating per row and answering rejected[] like B's signals upsert; extend scripts/verify-network-roles.py for the filters, a two-row tag and the sort flip. No warmth, no reconnect list, no import panel (N4); no new OAuth scope; never widen a peer token. Verify with node --check on a .js copy of Network.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-network-schema.py (extend ALLOWED_KEYS only with count / id keys, as N2 and B did), python3 scripts/check-readme-tree.py and the verifier (zero page errors at phone width; Playwright is pip install playwright with the pre-installed Chromium, no playwright install). Bump Network.html / Network.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries; CHANGELOG entry; README tree descriptions; leave §11's N3 row In progress — session 1 with the versions. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG stands at Sections: 83/100 — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for N3 session 2, and remember session."

### Added
- **N3 session 1 — the list, the filters and the bulk actions (design plan §4.3; §13.9 steps 1–4; §11's N3 row → In progress — session 1).** `Network.gs` v01.09g / `Network.html` v01.18w. The Receipts History card generalised into the Contacts list; session 2 (exports beyond CSV, the drafts flow, the QR card) is the next session
- **`Network.gs` — `nwListOp_` replaces the inline list branch**: search over name, title, account name and every email (`q`); the eight filters (`relationship`, `stage`, `role`, `segment` against the account's Segment IDs, `event` against Source Event, `tag`, `from` / `to` on Met Date, `consent`), applied server-side because the columns they read (Emails, Tags, Consent Marketing) are picked by `nwListRows_` under `_`-prefixed keys and **dropped before the answer** — the list payload widens by exactly one field, `lastTouch`, the newest Interaction `Date` per contact from one read of the tab (`nwLastTouch_`), per §12; an off-list enum or a malformed date answers `bad_filter`, never a silently ignored filter; `total` and `filtered` ride on the response so the page can read "2 of 5"; the audit row carries matched / total / accounts / a filtered flag
- **`nop=bulk`** (`nwBulkOp_`, body-POST, ≤ 500 ids): `op=tag` appends a lowercase tag to each contact's Tags (already there → `unchanged`; 20 already → `too_many_tags`); `op=account` sets `relationship` and / or `stage` on the selected contacts' accounts, each account validated once through `nwAccountFromPayload_` (the D5 rule — `STAGE_NEEDS_TARGET_OR_CUSTOMER` refuses that account, never applied half-way; a relationship moved off Target / Customer with no stage asked for resets the stage to None as the editor does) and memoised across its contacts. Every id is judged on its own — `bad_id`, `duplicate`, `not_found` (an unowned row answers not-found, never forbidden), `deleted`, `account_not_found`, the validator's word — and answered in `rejected[]` with its reason, the shape of B's signals upsert; `applied` / `unchanged` / `accounts` are counts; `bumpDataRev()` only when something was written
- **`nop=export`** (`nwExportOp_`, `format=csv` — `.xlsx` and vCard are session 2): the selection's ids (or, with none, every live contact in scope) as RFC 4180 text — every field quoted, CRLF rows, 24 columns (`NW_CSV_COLUMNS`) including the account's name / relationship / stage and Last Touch; a Do Not Contact row is left out (D9) and Raw Extraction never exported; **a disclosure row is written through the template's `recordDisclosure`** naming the op, the row count and the ids (never a field), and the audit row carries `rows` / `excluded` / `ids`. The page prepends the UTF-8 BOM when it builds the download
- **`Network.html` — the list tools** (`nwListTools`): the search box (Enter or Search; the request carries `q=`), the Filters drawer (collapsed until opened, its state kept across refreshes; the hint reads "2 on: role, consent"; relationship / stage / role / consent from `NW_ENUMS`, segment from `profiler-segments.json` through `nwSegments()`, source event with a `datalist` of the events on the rows shown, tag, met from / to; Apply and Clear), the sort strip (Last touch · Name · Company · Warmth — Warmth present and disabled until N4; a key starts in its natural order, newest first or A → Z, and the flip button reverses it; sorting is the page's over what every row carries, so a sort issues no request) and the select-all box. `nwContactRow` gains a checkbox (its click never opens the detail) and the `last touch` line; the count tile reads "N of total · contacts match" while a filter is on; an empty filtered list says so instead of "No contacts yet"
- **The action bar** (`nwBar`, one element fixed to the bottom of the screen, opened by the first tick): "N selected · Clear"; **Tag** (an inline form → `nwBulkTag`), **Relationship** (relationship + stage selects with "keep" options and the D5 gate mirrored — `NW_STAGE_RELS` pins the stage to None off Target / Customer → `nwBulkAccount`), **CSV** (`nwBulkExportCsv` → `nop=export` → `nwDownloadText` with the BOM), **Mailing** (disabled — session 2), **Delete** (`nwBulkDelete`: a confirm naming the count, then the existing `nop=delete` one request per row). Rejected rows are read back as "2 rejected: a stage needs a Target or Customer relationship ×2". The selection is a map pruned to the rows shown on every paint; `nwSelectSync` updates the boxes in place so an open detail stays open while the selection changes; every write refreshes the list (D14) and clears the selection
- **`scripts/verify-network-roles.py`**: the stub's `nop=list` applies the search and the eight filters as `nwListOp_` does and carries `lastTouch` / `total` / `filtered`, and answers `nop=bulk` (per-row `rejected[]`) and `nop=export` (the CSV); the tests drive the search ("1 of 5", `q=` on the request), the drawer (role; role + consent with the hint; segment; source event; tag; Clear), the sort (Name A → Z, the flip reverses it, no request issued, Warmth disabled), the multi-select (two rows ticked while a third's detail stays open), the two-row tag through `nop=bulk`, a stage alone on two Partner accounts refused per row then Target · Discovery on both (the bar's gate pins the stage for a Supplier), a real CSV download (BOM, header, two CRLF rows) and a bulk delete after a confirm naming the count; zero page errors at 390 × 844; screenshots `network-list-filters.png` and `network-list-bar.png`. ALL CHECKS PASSED
- `scripts/check-network-schema.py`: the audit-key allow-list gains five count / flag keys (`total`, `filtered`, `applied`, `unchanged`, `excluded`); exit 0 — 23 `auditLog` calls in the PROJECT region

### Changed
- `NETWORK-EVENTS-DESIGN-PLAN.md` §11: the N3 row → **In progress — session 1** with the versions; `NETWORK-SCHEMA.md` §12 records the N3 list widening, the bulk audit shape and the export disclosure row
- README tree: `Network.html` (v01.18w · v01.09g) description gains N3 s1; `verify-network-roles.py` and `check-network-schema.py` descriptions extended

### Fixed
- **A mid-session finding on the version pair.** With the page's `<meta build-version>` bumped and `Networkhtml.version.txt` not yet, the page's first-load staleness check reloaded once and the aborted list request fell back to GET — the verifier's "exactly one list request" caught it. Both files were bumped together, as [PC-HTML-VERSION] #2 requires; nothing in the page changed

## [v07.12r] — 2026-09-22 06:05:50 AM EST

> **Prompt:** "I see the "Starred today - tap to use" pill underneath "Save Changes". Is that the most logical place to put that? What is it supposed to do or mean?"

### Fixed
- **`Network.html` v01.17w — the Source Event row lands under its field.** `nwSourceEventDefault` appended the row to the form when the `nop=eventstoday` answer arrived, and by then `nwEditCard` had already re-inserted the Save / Cancel actions as the form's last child, so the row rendered below the buttons (the developer's screenshot). `nwReviewSection` now passes the Where-and-when grid as an anchor and the row is inserted directly after it; the `.nw-evdef` rule drops the `grid-column` span (the editor is not a grid) for a plain block with a bottom margin

## [v07.11r] — 2026-09-22 05:56:25 AM EST

> **Prompt:** "pills read v01.08g and v01.03g. However, I am confused about how Step 4: the live check is supposed to happen. I starred an event in Events whose dates include today, but am not sure what to do in Network. Should I click on one of my saved contacts or do I have to scan a new card? If I must scan a new card, that seems illogical and I would like you to resolve that. If my understanding is completely wrong, then give me step by step instructions on what to do here."

### Fixed
- **`Network.html` v01.16w — the Source Event default no longer fills a saved contact's editor.** The developer's question exposed a real flaw in v07.10r: `nwEditCard` serves both a held (freshly scanned) card and a saved contact opened from its detail (`opts.host`), and `nwReviewSection` runs the same default for both — so editing an old contact whose Source event was empty would have had it silently filled with today's show. `nwEditCard` now stamps `form.dataset.saved` when it opens with a host, and `nwSourceEventDefault` reads it: a fresh scan keeps the prefill (one event) / pills (several); a saved contact's editor always gets the offer row ("Starred today — tap to use") with one pill per event and never a fill. This also gives the live check a path that needs no new card: open any saved contact → Edit → the row appears under Source event

### Notes
- Verified with `node scripts/check-gas-inner-scripts.js`, `python3 scripts/check-readme-tree.py` and `scripts/verify-network-roles.py` (the stub still answers `not_configured`, so the editor flow is unchanged); the bridge harness is untouched (no `.gs` change)

## [v07.10r] — 2026-09-22 05:05:03 AM EST

> **Prompt:** "tabs are there, run B from §13.8"

### Added
- **B — the bridge (design plan §6; §13.8 the brief; §11's B row flips to Done).** `Network.gs` v01.08g / `Network.html` v01.15w / `Events.gs` v01.03g / `Events.html` v01.04w. The first private server-to-server route in the program, built as copies of `Profiler.gs` `guidanceMentionsProxy_()` and Classroom's `clHandleGuidancePeer_()`
- **The far sides** — `Network.gs` `nwHandlePeer_` (`?action=peer&t=<NETWORK_PEER_TOKEN>&nop=accounts|signals`) and `Events.gs` `evHandlePeer_` (`?action=peer&t=<EVENTS_PEER_TOKEN>&eop=today|starred|signals`), dispatched in both `doGet` and `doPost` **before** session validation. The property is `.trim()`-ed on read; every one of the six token-boundary cases (property unset, sub-16-character property, `t` absent, `t` empty, wrong token, unknown op) answers the same flat `{ success:false, error:'denied' }` with zero spreadsheet reads — the tab handle is opened only after the token has matched. **`not_configured` is the calling side's word** (its own property under 16 characters), exactly as Classroom's far side reasons: the two refusals are identical on purpose so a probe cannot tell an unconfigured project from a wrong guess. A throw inside an op is answered as JSON `peer_failed` rather than Apps Script's HTML exception page
- **The four ops.** `nop=accounts` (GET): live Accounts with `relationship` ∈ target · customer · partner · channel, scoped to the `owner` as `resolveOwnerSet_` scopes a signed-in user's own rows — id, name, slug, relationship, stage, segments, tags; no contacts, emails, notes, HQ, and the owner column is not echoed. `nop=signals`: **POST with a JSON body** upserts on (`accountId`, `eventSlug`, `kind`, `evidenceUrl`) — a re-run refreshes `Last Seen` / `Confidence` / `Note` instead of duplicating; `kind` against `NW_SIGNAL_KINDS`, the account must be live and the owner's, a LinkedIn or `lnkd.in` evidence host is `linkedin_not_fetched`, rows are written `Source = events` with `s-` ids; per-row indexed `rejected[]`, one bad row never fails the batch; **GET with `accountId`** is the read leg Events' read-through proxies. `eop=today` / `eop=starred`: the owner's Stars joined to the public registry — `Events.gs` fetches `https://lightaisolutions.github.io/Sales/events-data/events.json` once per execution with `UrlFetchApp` (derived from `EMBED_PAGE_URL`; never a GitHub API host), today decided in **each event's own `tz`** via `Utilities.formatDate`; `eop=signals` relays Network's read leg for one account with each row's name and start attached
- **The near sides** — `nwEventsProxy_(eop, params)` and `evNetworkProxy_(nop, params, body)`, `guidanceMentionsProxy_` verbatim with the peer's `/exec` pasted as a constant from the peer's `.config.json` (`EVENTS_PEER_EXEC`, `NETWORK_PEER_EXEC`): `not_configured` under 16 characters, `muteHttpExceptions` with `upstream_http_<code>`, `upstream_unreachable` on a throw, and `upstream_not_json` with a 160-character snippet for an exception page served as HTML at HTTP 200; a `body` on Events' side makes a JSON POST. Called only past the user's own door: `nop=eventstoday` in `handleNetworkOp_` after `validateSessionForData` + `nwRequire_`, `eop=netaccounts` in `handleEventsOp_` after `evRequire_(sess, 'recommend')` (E3's input, wired server-side now)
- **The first use — `Network.html`**: the review section's Source Event field defaults from `nop=eventstoday` (one request per page load, made only when a review section opens — never on load, never polled): prefilled when exactly one starred event is on today, a pill row when several, untouched when none or while not configured; a value already typed is never overwritten; N1's free-text field stays as the fallback and the override. `Events.html`: the one-line "Connect Network to score by account" placeholder on the sheet that E3 replaces, no request of its own; both pages' error text knows `not_configured`
- **`scripts/check-peer-bridge.js`** — a Node sandbox harness over both `.gs` files (the `check-guidance-migration.js` idiom: the real functions lifted by name into two isolated VM contexts with stubbed `PropertiesService`, `SpreadsheetApp` (an in-memory spreadsheet), `UrlFetchApp`, `Utilities`, `Session`): **61 checks, exit 0** — for each far side the six boundary cases (plus no parameters at all) return flat `denied` with zero `openById` and zero `fetch` and nothing audited; a correct token reaches the op; the accounts filter, the signals upsert (written 1 → updated 1, the five rejection reasons indexed, `Source = events`, `First Seen` kept), the read leg, `eop=today` / `starred` over the **committed registry** with the calendar pinned to 2026-09-22, `eop=signals` joined; both near sides map a sub-16 property to `not_configured`, HTML-at-200 to `upstream_not_json` with a snippet, a non-200 to `upstream_http_<code>`, a throw to `upstream_unreachable`, and the JSON POST leg carries the body; no audit row carries the token. The function extractor skips comments (an apostrophe in a comment had ended a "string") and the constant extractor allows a trailing `//` comment
- `scripts/check-network-schema.py`: the audit-key allow-list gains the bridge's five count/flag keys (`written`, `updated`, `rejected`, `events`, `ok`); `scripts/verify-network-roles.py`'s stub answers `nop=eventstoday` as the real backend does while the tokens are unset (`not_configured`), so the editor flow is unchanged
- `NETWORK-EVENTS-DESIGN-PLAN.md`: §11's B row → **Done**; **§13.9 the N3 brief** (two sessions: the list, filters and bulk actions, then exports, drafts and the QR card) with its paste-in prompt

### Notes
- **REPO-ARCHITECTURE.md unchanged** — the flowchart draws no GAS-to-GAS edge for the existing Profiler → Classroom guidance route either, so the bridge adds none
- **Hand-off (the developer's):** set `NETWORK_PEER_TOKEN` and `EVENTS_PEER_TOKEN` to one random 16+ character value each, the same value in **both** projects' Script Properties (never committed, never quoted back); the merge's `Deploy Network` / `Deploy Events` steps pull both scripts (a deployment that predates its first webhook still needs Manage deployments → Edit → New version once); then star an event dated today and open the scan card's editor

## [v07.09r] — 2026-09-22 04:14:18 AM EST

> **Prompt:** "record the Events ids:
> SPREADSHEET_ID=<1MhaF8mdVyOljcswv_vwJ82ZW4Co-U9UHNXG39i5tCOw>
> DEPLOYMENT_ID=<AKfycbyI_SRS7Q3msirnY_UDx6Dz0jK75Onr9P0yocHGovnuIQlpHLIiSmvrpeyruhP3QaG_EQ>"

### Changed
- **Events is deployed — the two ids are recorded the N0 way.** `googleAppsScripts/Events/Events.config.json` now carries the real `SPREADSHEET_ID` and `DEPLOYMENT_ID` (the angle brackets in the prompt were delimiters, not part of the values), synced per [PC-GAS-CONFIG] #14: `Events.gs` v01.02g (`SPREADSHEET_ID` / `DEPLOYMENT_ID` vars — `ensureEventsTabs_()` no longer throws `SPREADSHEET_NOT_CONFIGURED`, and `registerSelfProject()` now writes the real deployment URL into the Global ACL), `Events.html` v01.03w (`var _e` is the reversed-then-base64 `https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec`, so the GAS iframe mounts and the Stars ops reach the backend). The `Deploy Events` workflow step reads the id from the config at merge time — no workflow edit — so this push's merge fires the first self-update webhook against the live deployment
- README tree: the Events page line reads v01.03w · v01.02g
- **B (the bridge, §13.8) is unblocked** — its brief stops on placeholder ids; both are real from this push

### Notes
- The N0 bootstrap lesson still applies: the code deployed by hand before this push cannot repoint its own deployment on the first webhook run — if the merge's `Deploy Events` step warns "self-update unconfirmed", do Manage deployments → Edit → New version once by hand, then later merges self-update
- §13.7 step 8 (the real-phone Calendar / `.ics` check) remains the developer's to report; nothing in this push asserts it

## [v07.08r] — 2026-09-22 02:00:16 AM EST

> **Prompt:** "Before I run E1 session 2, give me step by step instructions on how to deploy Events and get the two ids that you will ask me for in session 2.
>
> Run E1 session 2 — the published calendar and the phone pass — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.7 is the brief (steps 5–8 only — session 1's steps 1–4 landed at v07.07r and §11's E1 row reads In progress — session 1), §5.3 the design, repository-information/EVENTS-SCHEMA.md §9 and §12 the shapes, and live-site-pages/Events.html / googleAppsScripts/Events/Events.gs the code you extend (the evIcs() / evVevent() functions are the per-event RFC 5545 text; the published file must be byte-compatible with them). Build: (5) scripts/build-events-ics.py writing live-site-pages/events-data/events.ics — every confirmed event, X-WR-CALNAME: BESS/AIDC events, the same stable UID:<slug>@events.lightaisolutions.github.io, 75-octet folding, CRLF — run it, wire the .ics walk into scripts/check-events-registry.py (exit 0), and add a Subscribe pill on the masthead offering the webcal:// URL of the published file with a copy fallback; (6) the read-only day-plan tab as a timeline of the starred events on a chosen day (E5 fills it); (7) the Playwright pass at 390 × 844 in scripts/verify-events-roles.py — the month header sticks, the agenda scrolls past a month boundary and the header changes, the sheet opens and closes, a star round-trips through the stub, one event's ICS text parses (a minimal VEVENT walker), the Google Calendar href carries dates= / ctz=, screenshots of month / agenda / detail, zero page errors; (8) the real-phone Calendar / .ics check is reported in the hand-off, not asserted. Keep the Network UI family; no poller, score, signals, plans or bridge. If Events.config.json still carries YOUR_SPREADSHEET_ID / YOUR_DEPLOYMENT_ID, ask me for both before the phone pass and record them the N0 way ([PC-GAS-CONFIG] #14 syncs the .gs and the page's _e); if they are real, leave them. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, the verifier and the registry checker. Bump Events.html / Events.gs per [PC-HTML-VERSION] #2 / [PC-GS-VERSION] #1 with page and GAS changelog entries; CHANGELOG entry, README tree entries for events.ics and build-events-ics.py; flip §11's E1 row to Done with the versions and write the B brief as §13.8. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first; parallel sessions push, so check git ls-remote before pushing. The CHANGELOG rotated at v07.07r (Sections: 78/100) — read the counter, no rotation is due. One push. Then give me a prompt to paste into a new session for B, and remember session."

### Added
- **E1 session 2 — the published calendar and the phone pass** (§13.7 steps 5–8; §11's E1 row flips to **Done**). `Events.html` v01.02w; `Events.gs` untouched at v01.01g (no server change in steps 5–8 — the brief's own rule is "bump only files you edit")
- **`scripts/build-events-ics.py`** → `live-site-pages/events-data/events.ics`: every `confirmed` registry event (72 of 100) as one RFC 5545 `VEVENT`, byte-compatible with the page's `evIcs()` / `evVevent()` — the same header lines (`PRODID`, `METHOD:PUBLISH`, `X-WR-CALNAME: BESS/AIDC events`), field order, `\\ \; \, \n` escaping, 75-octet folding (74 on a continuation line), CRLF, stable `UID:<slug>@events.lightaisolutions.github.io`; `DTSTAMP` is the build time (`--stamp` fixes it), `--check` exits 1 when the file is stale against `events.json`. Rebuilt by `events sync` (E2) after every registry write
- **`.gitattributes`: `*.ics -text`** — the repo normalises every text file to LF on commit, which would have silently turned the calendar's CRLF into LF in the blob; the rule keeps the bytes as written (`git ls-files --eol` reads `attr/-text`)
- **`Events.html` — the Subscribe pill** on the masthead (admitted tier only): a card offering the published file as a `webcal://` URL derived from the page's own location (a relative path on the same Pages site — never a GitHub host, [PC-PRIVATE-REPO] #18), a Copy button through the clipboard with the URL in a read-only field as the by-hand fallback (Android's Google Calendar has no `webcal` handler — it wants the URL pasted under *From URL* on the web), a one-time download of the whole file, and the how-to line
- **`Events.html` — the Day plan tab** (`Agenda | Day plan` strip above the counts): a read-only timeline of the starred events spanning a chosen day — a date picker, a Today pill, a scrolling strip of the upcoming starred days, and per entry the venue's `hours[]` for that date where the registry has them (else *All day*), *day N of M*, name with the attending badge, venue · place · kind, the note; tap opens the sheet. Empty states for "nothing starred on this day" and "nothing starred yet"; the footnote says E5 fills it. The masthead's month label follows the chosen day while the tab shows
- **`scripts/verify-events-roles.py` — the phone pass** at 390 × 844 for the admin, after session 1's checks: the month header sticks (`position: sticky`, pinned at its declared top, its month name clear of the template's fixed user pill) while its tallest month scrolls; scrolling past the boundary into the second month changes the month-in-view label; the sheet opens for the first confirmed upcoming event and Escape closes it; the Google Calendar href is the `action=TEMPLATE` URL with `dates=` / `ctz=`; that event's `evIcs()` text parses under a minimal VEVENT walker in the verifier (CRLF, ≤ 75 octets per line, UID / DTSTART / DTEND / SUMMARY) with DTSTART / DTEND equal to the href's `dates=`; its `evVevent()` block is **byte-identical** (DTSTAMP aside) to the block for that UID in the published `events.ics`; a star **round-trips through a stateful stub** (the stub now parses the POST body and holds a Stars set: `eop=star` → the refetched `eop=list` carries it → the row lights and the Starred count reads 1 → the Day plan lists it on its first day → `eop=unstar` clears it); the Subscribe pill offers the `webcal://` URL of the published file, Copy leaves a status line, the `http://` twin of the URL serves `BEGIN:VCALENDAR` with `X-WR-CALNAME` and parses; screenshots `events-month.png`, `events-agenda.png`, `events-detail.png`, `events-dayplan.png`; zero page errors. Requests are recorded as `events:<eop>` so the session-1 "exactly one list request on load" assertion still holds
- **`NETWORK-EVENTS-DESIGN-PLAN.md` §13.8** — the paste-in brief and prompt for **B, the bridge**: the far sides in both `.gs` files as copies of `guidanceMentionsProxy_()`'s far side (six token-boundary cases → flat `denied` with zero reads, `not_configured` under 16 characters, before session validation), the four ops, the near-side proxies with the `upstream_not_json` distinction, the scan card's Source Event defaulting from `eop=today`, and a Node sandbox harness `scripts/check-peer-bridge.js`; it stops and asks for the two Events ids if they are still placeholders

### Changed
- **`scripts/check-events-registry.py` — the `.ics` walk is live**: the published file is now required (missing is a finding), must end every line in CRLF with none over 75 octets, carry `X-WR-CALNAME`, one `VEVENT` per confirmed event with UID / DTSTART / SUMMARY, its UID set equal to the confirmed slugs, and each `VEVENT`'s DTSTART / STATUS matching its row. Exit 0 on the committed files: 100 events, 58 roster rows, 256 mentions, 72 VEVENTs
- **`Events.html` — the sticky month header** now carries 40px of paper as top padding so it pins at the top with the month name clear of the template's fixed user pill and no row shows through beside the pill (the first phone-pass screenshot had the header hidden under the pill)
- README tree: the Events page line (v01.02w, the session-2 features), `events-data/events.ics`, `scripts/build-events-ics.py`, and the refreshed descriptions of `check-events-registry.py` and `verify-events-roles.py`

### Fixed
- **`Events.html` `evIcsEscape()`** wrote a bare `;` for a semicolon — the JS literal `'\;'` is just `';'` — so a name or description with a semicolon was not RFC 5545-escaped and would not have matched the builder's output; now `'\;'`. The Playwright byte-identity check would have caught the first such row

### Notes
- **`SPREADSHEET_ID` / `DEPLOYMENT_ID` are still placeholders** — the session ran unattended and the developer's ids were not to hand, so [PC-GAS-CONFIG] #14 had nothing to sync; the step-by-step deploy instructions were given in chat (the N0 list from v07.07r's Notes, expanded), and the ids are recorded on the next push. The Deploy Events workflow step no-ops until then; the live page shows the calendar, the Subscribe pill and the day plan with "Stars are not connected yet"
- **The real-phone check (§13.7 step 8) is reported, not asserted**: once deployed — the agenda opens at today's month; a starred event shows ★ on its row and in the Starred count and appears on the Day plan for its dates; the Calendar link opens Google Calendar prefilled with the dates and the event's time zone; the per-event `.ics` imports; Subscribe on an iPhone opens the Calendar subscription dialog for `webcal://lightaisolutions.github.io/Sales/events-data/events.ics`, and on the web Google Calendar's *From URL* accepts the same URL with `https://`
- **Verification this push**: `node --check` on the `.gs` copy and on the page's extracted PROJECT script clean; `scripts/check-gas-inner-scripts.js` — 11 files, 106 inner scripts parse; `python3 scripts/check-readme-tree.py` — 12 page + 10 GAS displays match; `scripts/verify-events-roles.py` — ALL CHECKS PASSED (three runs: the first surfaced the pill overlap and an oversized footnote, both fixed); `python3 scripts/check-events-registry.py` — exit 0 with the `.ics` walk; `scripts/build-events-ics.py --check` — current
- **CHANGELOG counter** 78 → 79/100 — no rotation due

## [v07.07r] — 2026-09-22 01:08:08 AM EST

> **Prompt:** "Run E1 session 1 — Events scaffold + calendar — from repository-information/NETWORK-EVENTS-DESIGN-PLAN.md: §13.7 is the brief (follow its reading list in order, then session 1's four build steps exactly — do NOT start session 2's steps 5–8: the published events.ics, the day-plan tab and the phone pass are the next session's), §5.3 the design, and repository-information/EVENTS-SCHEMA.md §1, §2, §3, §5, §9, §12 the shapes. E0 is Done and merged — events-data/events.json (100 events), events-sources.json (58 probed rows) and scripts/check-events-registry.py are on main and the checker exits 0; re-run it at session start to confirm rather than trusting this line. Scaffold Events.html / Events.gs with scripts/setup-gas-project.sh the way N0 did for Network (auth, hipaa, own spreadsheet, PWA manifest with the manifest-src 'self' override on both CSP tags, no service worker, the admin-only door on both sides per D7 with all four tier keys kept, HEARTBEAT_INTERVAL 600 s, no data poll per D14, quotaProbe_ + op=quota inherited from the shared template region), ensureEventsTabs_() for all five §5 tabs (Stars · Plans · Meetings · Proposed · Tuning — create all five now so E2–E5 edit against them, write only Stars in E1), eop=list / eop=star / eop=unstar / eop=note in the PROJECT regions only, then the vanilla agenda scroller over the public registry — fetched by relative URL, never a GitHub endpoint (PC-PRIVATE-REPO #18) — the filter pills with "signals only" present but disabled and noted "from E4", the detail sheet with mentions[] chips deep-linking Profiler.html#<slug>, Add-to-Google-Calendar and the per-event .ics per §9 byte for byte. Not FullCalendar. Keep the Network UI family (paper-and-ink, pill rows, two-half control rows, no ids or confidence numbers on a card); no poller or events sync (E2), no score (E3), no signals (E4), no plans (E5), no bridge (B) — no EVENTS_PEER_TOKEN and no peer ops. Two things E0 learned that the agenda must not paper over: 27 of the 100 rows are `tentative` and 11 of those are from organisers that block non-browser clients permanently, so surface status in the sheet rather than implying every row is firm; and several rows carry an empty city because the organiser publishes none, so the row renderer must tolerate empty city/region/venue without printing a stray separator. Verify with node --check on a .js copy of Events.gs, scripts/check-gas-inner-scripts.js, python3 scripts/check-readme-tree.py, scripts/verify-events-roles.py (mirror verify-network-roles.py; admin admitted, the other three tiers turned away with zero requests, zero page errors at phone width) and python3 scripts/check-events-registry.py (exit 0; the .ics walk stays dormant until session 2 publishes the file). CHANGELOG entry, README tree entries, REPO-ARCHITECTURE.md plus the per-environment diagram the setup script adds; set §11's E1 row to *In progress — session 1* with the versions and write nothing new in §13 (session 2 flips the row to Done and writes the B brief as §13.8) — then hand off in chat what to check on the phone: the agenda at today's month, a starred event, the Calendar link prefilled. Normal Session Start, Pre-Commit and Pre-Push checklists on a claude/* branch restarted from origin/main; run git fetch --unshallow origin main first. Current state: the repo is at v07.06r and parallel sessions have been pushing, so restart from origin/main and check git ls-remote before pushing. The repo CHANGELOG stands at Sections: 102/100 with one section dated 2026-09-22 — that is 101 non-exempt against the 100 trigger, so ROTATION IS DUE on your push commit: the oldest date group is 2026-09-16 with 25 sections, rotating it leaves 77 raw / 76 non-exempt and one rotation suffices. Re-derive that arithmetic yourself at session start (the exempt group changes at midnight EST) and deepen the clone before any SHA lookup — the sections due are the oldest and are exactly the ones beyond a shallow horizon. One push.
>
> Then, give me a prompt to paste into a new session (recommend model/effort) to continue the action plan, then remember session."

### Added

#### `live-site-pages/Events.html` — v01.01w
- **E1 session 1 scaffold of the Events app** (design plan §13.7 steps 1–4; §5.3). Generated by `scripts/setup-gas-project.sh` from the auth template (`hipaa` preset, `ACL_PAGE_NAME: Events`, `PORTAL_ICON: 📅`, the fleet `CLIENT_ID`; `SPREADSHEET_ID` and `DEPLOYMENT_ID` left as placeholders — see Notes); ten files created, GAS Projects table row, README tree entries, REPO-ARCHITECTURE nodes, `diagrams/Events-diagram.md` and the `Deploy Events` workflow step registered by the script. The fleet Master ACL id `1kG2K…UvE` set by hand in `Events.gs` and `Events.config.json` (Setup GAS Project Command step 3 — the Global ACL config the script defaults from still carries its placeholder)
- **PWA**: `events.webmanifest` on the `network.webmanifest` shape (`id` / `start_url` / `scope` = `./Events.html`, `display: standalone`), `images/events-icon-192.png` + `-512.png` (Pillow-drawn calendar leaf on the app's navy, `any maskable` on the 512), `<link rel="manifest">`, `theme-color`, `apple-touch-icon` and the standalone metas; the **`manifest-src 'self'` PROJECT OVERRIDE on both CSP tags** (template ships `'none'`); `worker-src 'none'` stays — no service worker (D2)
- **The door, client half (D7 — admin-only)**: `EV_ROLE_CAPS` with all four tier keys (admin holds `calendar` · `recommend` · `plans` · `signals` · `roster` · `tuning`, the other three empty — EVENTS-SCHEMA.md §2), `evRole()` / `evPreviewRole()` / `evEffectiveRole()` / `evCan()` / `evAdmitted()` with only-subtracting `?as=` preview semantics; `evRenderDenied()` paints the turned-away card for non-admin tiers **before any request is issued** — neither the registry nor the stars are fetched for a denied tier
- **The agenda scroller (§5.3 — vanilla, not FullCalendar)**: the page fetches `events-data/events.json` by **relative URL** (plus `profiler-segments.json` and `profiler-companies.json` for display labels only, both optional) and renders `status ≠ past` rows in start order grouped month → day under a `position: sticky` month header, with an `IntersectionObserver` naming the month in view in the masthead and a **Today** pill that scrolls to the current day group; past editions sit behind a "Show N past" fold at the bottom; rows carry name · dates · place · kind with a star toggle — **no ids, no relevance or confidence numbers on a card**. `evPlace()` joins only the parts an organiser publishes, so the 18 rows with an empty city (31 with no region, 68 with no venue) print no stray separator; a webinar with no place reads "Online". A `tentative` row says so on the row and on the sheet
- **Filters** as pills across two-half control rows: kind (the registry enum), region (the state codes carrying ≥ 3 events, from the registry itself, plus "Abroad"), audience segment (from `profiler-segments.json`, a horizontally scrolling pill strip), **★ Starred**, and **"Signals only" present but disabled with the "from E4" note**; a counts strip (upcoming · starred · tentative)
- **The detail sheet** (a bottom sheet on a phone, a centred card on a desk): organiser, venue, where, the status badge (`Tentative — not yet confirmed by the organiser` for the 27 rows E0 could not verify, eleven of them from organisers that block non-browser clients permanently), the kind and series badges, `tierNote` (highlighted for a tentative row), website / registration / exhibitor list / agenda / speakers / floor-plan links where published, the audience segments by name, **`mentions[]` as chips deep-linking `Profiler.html#<slug>`** (company names from the registry, one chip per dossier), and the `sources[]` line with `kind` · `lastConfirmed` · `lastUpdated`; Escape and the backdrop close it
- **Add to Google Calendar** — the §9 template URL (`action=TEMPLATE` · `text` · `dates=<start>/<end+1>` · `location` · `details` · `ctz=<tz>`) — and **Download .ics**: one hand-rolled RFC 5545 `VEVENT` per event, byte for byte per §9 (`UID:<slug>@events.lightaisolutions.github.io`, all-day `DTSTART;VALUE=DATE` / exclusive `DTEND`, `SUMMARY`, `LOCATION`, `URL`, `DESCRIPTION` of organiser · kind · tierNote · registration URL, `CATEGORIES` of segment ids, `STATUS` from the row, `DTSTAMP` / `LAST-MODIFIED`, calendar-level `X-WR-CALNAME: BESS/AIDC events`), `\\` `\;` `\,` `\n` escaping, **folding at 75 octets** (multi-byte characters never split), CRLF line ends, served as a `blob:` download named `<slug>.ics`
- **Stars, attending and notes** on the sheet and the row: `evToggleStar()` over `eop=star` / `eop=unstar`, the **Attending** select (`planning` · `registered` · `attended` · `skipped`) and the **Note** field written through `eop=note` — all body-POST via `evApiBody()` (the Network `nwApiBody` idiom, three attempts, then the GET mirror since a note fits a URL); `evApi()` over `_gasPost` for `eop=list`; before the backend is deployed the calendar still renders and the stars report "not connected yet" instead of an error
- **D14 intervals** in `HTML_CONFIG`: `HEARTBEAT_INTERVAL: 600000`, `DATA_POLL_INTERVAL: 0` with a PROJECT OVERRIDE note — the owner's rows refresh on load, on `visibilitychange` and after every write (`evAfterWrite()`); the registry is never refetched in-session (the version poll reloads the page on a deploy) — paired with the `.gs` per [PC-SESSION-SYNC] #20

#### `googleAppsScripts/Events/Events.gs` — v01.01g
- **The door, server half**: `EV_ROLE_CAPS`, `evRoleOf_` / `evAdmitted_` (`role === 'admin'`) / `evCan_` / `evRequire_` on the Network pattern — every turned-away tier writes a `security_alert` audit row carrying op name and tier only
- **Enums and ids (EVENTS-SCHEMA.md §1, §5)**: `EV_ATTENDING`, `EV_SLUG_RE`, `EV_ID_RE` (`^(st|pl|mt|pr)-[0-9a-z]{13}$`), `evRandomBase36_()` (SHA-256 over `Utilities.getUuid()`, first 8 bytes → 13 base36 digits) and `evNewId_(prefix, takenIds)` collision-checked against the tab — never a slug, a name or a date
- **Tabs**: `ensureEventsTabs_()` creating **all five §5 tabs now** — `Stars` · `Plans` · `Meetings` · `Proposed` (§7 columns) · `Tuning` — plus `Shares` and `Profiles`, exactly the schema's columns in order (`EV_TABS`), frozen row 1, in-place header upgrade; E1 writes only `Stars`
- **Ownership**: `getShareScope_`, `resolveOwnerScope_`, `resolveOwnerSet_` and the not-found-not-forbidden convention copied verbatim from `Network.gs` / `Receipts.gs` (the D7 widening path; `Shares` has no UI in v1)
- **Ops**: `handleEventsOp_()` (`action=events`) wired into `doPost` and the `doGet` `action=api` mirror — `eop=list` answers the owner's `Stars` rows as id · slug · attending · note · updatedAt through `evListRows_()` (the note rides on the list row because the sheet shows it and a per-open detail op would cost an execution each time under D14; nothing about people is in this app); `eop=star` creates the row (Attending defaults to `planning`) or sets Attending, `eop=unstar` deletes it (no `Deleted At` on `Stars` — a star is not a record about a person), `eop=note` writes Note and/or Attending and stars an unstarred event; the slug validated against `EV_SLUG_RE` (never against the registry — the page owns that), Attending enum-validated, the note trimmed to 2,000 characters; audit rows carry the star id, the slug and counts only
- **`op=quota` and `op=aclhealth`** ported verbatim from `Network.gs` (the region N0 defined and Q0 rolled to every project) so `scripts/check-quota.sh` and `scripts/check-acl-health.sh` enrol the project; `PROJECT_OVERRIDES.HEARTBEAT_INTERVAL: 600` (paired with the `.html`)
- **Not built, by design**: no `EVENTS_PEER_TOKEN`, no peer ops, no poller, no `events sync`, no score, no signals, no plans — E2–E5 and B

#### `scripts/verify-events-roles.py`
- The four-tier door check on the `verify-network-roles.py` shape: serves `live-site-pages/`, seeds the page-scoped session the way `saveSession()` writes it, gives the page a stub base URL and answers the fetch transport's load-time heartbeat, then asserts per tier — admin: the agenda over the served registry with exactly one `eop=list` request and exactly one registry fetch, the sticky month header, the month-in-view label, the filter card with the disabled "Signals only (from E4)" pill, no stray separator on any row, the sheet opening on a row tap with the Google Calendar `dates=` / `ctz=` href and the `.ics` download and closing on Escape; contributor / analyst / viewer: the turned-away card, **zero** data requests and **no registry fetch**; `?as=viewer` on admin turns away, `?as=admin` on viewer gains nothing; zero page errors. Phone-width (390 × 844) screenshots per tier plus the detail sheet. **Passes** (99 rows rendered for the admin — the registry's 100 less the one `past` row behind the fold)

#### `live-site-pages/events.webmanifest`, `live-site-pages/images/events-icon-192.png`, `events-icon-512.png`
- The PWA manifest and icons described above

### Changed

#### `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`
- §11: **E1 → In progress — session 1, v07.07r** (what landed, the two placeholder ids, and the four session-2 steps still to run). Nothing new written in §13 — session 2 flips the row to Done and writes the B brief as §13.8

#### `repository-information/REPO-ARCHITECTURE.md`
- Flowchart: `EVENTS_PAGE` and `GAS_EVENTS` nodes and their five edges (added by the setup script); the Flowchart's mermaid.live URL regenerated and decompression-verified (9,569 chars). The file carries no `<details>` copy blocks, so none was mirrored; the per-environment diagram row for `Events-diagram.md` added by the script

#### `README.md`
- Tree: the Events page entry's description, `events.webmanifest`, `scripts/verify-events-roles.py`; version displays Events v01.01w · v01.01g (`check-readme-tree.py`: 0 findings); `Last updated` and `Repo version` refreshed

#### `.claude/rules/gas-scripts.md`, `.github/workflows/auto-merge-claude.yml`
- The Events row in the GAS Projects table and the `Deploy Events` webhook step — both by the setup script; the deploy step no-ops until `DEPLOYMENT_ID` is real

#### `repository-information/SESSION-CONTEXT.md`
- Latest Session rewritten at the close of E0 (v06.95r, merged; the repo has since advanced to v07.06r beside it), recording that E1's prerequisite is satisfied and that the CHANGELOG now sits at 101 non-exempt sections with a 25-section 2026-09-16 group due to rotate on the next versioned push; the parallel Opus 5 routines session moved to Previous Sessions and the N2 entry dropped under the two-session cap *(carried from `[Unreleased]` — the "Remember session context" push that wrote it had no version bump)*

### Notes
- **Setup script input** (§13.7 step 1): `PROJECT_ENVIRONMENT_NAME: Events`, auth + `hipaa`, the fleet `CLIENT_ID`, `ACL_PAGE_NAME: Events`. **`SPREADSHEET_ID` and `DEPLOYMENT_ID` are placeholders** — unlike N0, where the developer supplied the spreadsheet id up front, this session was run unattended with no id to hand, so the "own spreadsheet" is the developer's next step: create it (or through the `gas-project-creator` page), paste its id into `Events.config.json` and `Events.gs`, deploy, and record `DEPLOYMENT_ID` the N0 way ([PC-GAS-CONFIG] #14 syncs the `.gs` and the page's `_e`). Until then `ensureEventsTabs_()` throws `SPREADSHEET_NOT_CONFIGURED` and the page says so beside a working calendar
- **Deploy hand-off** (the N0 steps, verbatim for Events): (1) create the Apps Script project and paste `Events.gs`; (2) Project Settings → show `appsscript.json` and set it from `.claude/rules/gas-scripts-reference.md` §"Setup Steps"; (3) link the GCP project and enable the Apps Script API; (4) Deploy → New deployment → Web app → execute as me, access Anyone; (5) record `DEPLOYMENT_ID` and `SPREADSHEET_ID` in `googleAppsScripts/Events/Events.config.json` and sync per [PC-GAS-CONFIG] #14; (6) set `GITHUB_TOKEN` in Script Properties; (7) run any function from the editor and tick every consent checkbox; (8) load `Events.html` once so `registerSelfProject()` creates the `Events` column in the Master ACL's Access tab, tick TRUE for your row, run `clearAllAccessCache`; (9) the N0 bootstrap lesson: code pasted before the deployment exists cannot repoint its own deployment on the first webhook run — Manage deployments → Edit → New version once, by hand
- **What to check on the phone** once deployed: the agenda opens at today's month with the month named in the masthead; a starred event shows ★ on its row and in the Starred pill's count; the Calendar link opens Google Calendar prefilled with the dates and the event's time zone; the `.ics` imports
- **Verification this push**: `node --check` on the `.gs` copy clean; `scripts/check-gas-inner-scripts.js` — 11 files, 106 inner scripts parse; both inline `<script>` blocks of `Events.html` parse; `scripts/check-readme-tree.py` 0 findings; `scripts/verify-events-roles.py` all checks pass with zero page errors (served over localhost at 390 × 844); `scripts/check-events-registry.py` exit 0 (100 events, 58 roster rows; the `.ics` walk stays dormant until session 2 publishes the file)
- **Rotation fired.** 102 sections before this push with one dated today → 101 non-exempt against the 100 trigger; the oldest date group, **2026-09-16 (25 sections, v06.05r–v06.29r)**, moved to `CHANGELOG-archive.md` with all 25 SHAs resolved after the clone was deepened at session start (1,536 commits); 78 raw / 76 non-exempt remain — one rotation sufficed

## [v07.06r] — 2026-09-22 12:08:08 AM EST

> **Prompt:** "fix P9"

### Fixed

#### `scripts/check-classroom-pipeline.py` — the P9 fixture broke on the pipeline’s first watermark advance
- **`--selftest` went 15 fixtures / 1 failure the moment C2 landed its first commit**, and the cause was the fixture, not the check. `mutate_p9` derived its briefing id straight from the ledger: `"briefing-%s" % coveredThrough`. P9’s per-briefing checks key on `new` — the briefings at head absent from base — so once `70a0c488` advanced `coveredThrough` to **2026-09-21**, a date that now carries a **real** `briefing-2026-09-21`, the fixture’s lesson stopped being new. P9’s branch never executed and P5/P7 fired on the section mismatch instead.
- **The fixture had never been wrong before because `lastRun` was `null`** — no run had ever moved the watermark, so the derivation had never landed on an occupied date.
- **Fixed the date derivation, not the assertion.** The fixture only needs to be *at or behind* the watermark, never exactly on it, so it now walks back to a briefing-free date (`2026-09-20` today) under a bounded loop that raises a named `AssertionError` rather than looping forever. Loosening what P9 expects would have retired the check instead of repairing it.
- **Checked whether this was a class rather than an instance:** `mutate_p9` is the only fixture that reads live ledger state, so a targeted fix is the right scope.

### Verified

- `--selftest`: **15 fixture(s), 0 failure(s)** — `ok P9  a briefing at or behind the watermark`, and the positive fixture plus P1–P8 and P10–P13 all still pass.
- C2’s own gates: `check-classroom-content.py` 0 errors / 0 warnings, `node --check`, `check-gas-inner-scripts.js` — all clean, so Wednesday’s run is unaffected.
- `check-classroom-pipeline.py --base origin/main` reports P1 against this working tree, which is **correct**: a developer session edited a path the committer may never touch (§3). A pipeline run diffs its own changes against a `main` that already carries this commit and will not see it — the same shape as the `.github/last-processed-commit.sha` artefact seen while auditing `70a0c488`.

**No rotation:** 102 raw but 78 non-exempt (24 sections dated 2026-09-21 EST).

