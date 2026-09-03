# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-03 12:10:00 AM EST
**Repo version:** v04.34r (started at v04.32r — two push commits, plus this context write)
**Branch:** `claude/bridge-power-lesson-oajbui` (both pushes merged to `main` by the auto-merge workflow)
**Model:** Opus 5 — an authoring session, by the standing decision that planning runs on Fable and authoring on Opus 5

**What we worked on — two commits: `bridge-power`, then the §2.2 track cut:**

- **Authored `clLessonBridgePower_()`** (`8f557e2`, v04.33r) inside the `// CONTENT START` … `// CONTENT END`
  fence in `googleAppsScripts/Classroom/Classroom.gs`, at position 2 of `aidc-grid-to-chip`. **Nine sections
  across seven kinds** — `why-a-campus-builds-a-power-plant` (prose) · `ways-to-eat-the-same-gas` (proscons,
  four cards) · `fuel-in-electricity-out` (bars) · `the-turbine-queue` (prose) · `prime-backup-n-plus-one`
  (callout) · `four-campuses` (table) · `where-it-fails` (callout, `tone: warn`) · `drill` (6 flashcards) ·
  `check-yourself` (5 quiz items). No two of a kind adjacent; `sales` on four of seven teaching sections
- **Nineteen public inputs, every pin read off the document fetched that session** (G2), every ref resolved
  before writing (G7): seven study guides (`kiewit@2026-08-21`, `wartsila@2026-08-08`,
  `bloom-energy@2026-08-21`, `vantage@2026-08-21`, `crusoe@2026-08-21`, `xai@2026-08-21`,
  `primoris@2026-08-21`), seven dossiers (`voltagrid`, `proenergy`, `enchanted-rock`, `mainspring-energy`,
  `kiewit`, `bloom-energy`, `stack-infrastructure`, all `@2026-08-30`), four projects (`frontier`,
  `jupiter-nm`, `colossus`, `homer-city`, all `@2026-09-02`) and `concepts:profiler-concepts@2026-09-03`.
  Folds to **`tracks`** — analyst and up. **Fifteen lesson-local glossary entries**
- **Executed the plan's §2.2 track cut** (`ddd7c5f`, v04.34r): `the-aidc-power-chain` moved to position 3 of
  `aidc-grid-to-chip`; **`aidc-power-primer` retired, not renamed**; `clTrackAidcCampus_()` created in the
  same commit holding `heat-is-the-constraint` at position 1, with the curriculum's **first `prereqs[]`**
  (`["aidc-grid-to-chip"]`). `clLessons_()` needed **no edit** — registry order already equalled the new
  teaching order. Also corrected a stale header comment ("Five public-stamped modules" → "Six")
- **Verified both commits:** `check-classroom-content.py` — 7 lessons, 3 tracks, 134 gate cases,
  **0 errors / 0 warnings** each time. `check-classroom-pipeline.py --base origin/main` — v04.33r: **1
  finding, P5** on the lesson-registry insertion; v04.34r: **2 findings, both P5** (`track
  'aidc-power-primer' disappeared`, `clTracks_() not append-only`). **No P1, no P3 either time**, so
  `gateDigest` was correctly never touched. `--selftest` 13/0 both times; `node --check` and
  `check-gas-inner-scripts.js` clean. **The gate derivation was run against the real registries**, not the
  checker's fixtures, on both commits
- **Versions:** Classroom GAS `v01.11g` → `v01.12g` → `v01.13g`, each with `Classroomgs.version.txt` in the
  same commit and a generic public changelog entry naming no title, ref or company

**Where we left off:**

- **`aidc-grid-to-chip` holds 3 of its 8 planned lessons** in plan order — `the-fence-line` → `bridge-power`
  → `the-aidc-power-chain` — and its `short` describes the walk as it now reads end to end.
  **`aidc-campus` holds 1 of 4** (`heat-is-the-constraint`), with its prereq attached
- **The next cut-line item is `the-800-vdc-shift`** (§7 item 3), which lands at **position 6** of
  `aidc-grid-to-chip`. Positions 4 and 5 (`redundancy-by-the-numbers`, `inside-the-rack`) are second-wave,
  so it is appended to the end of the current `lessons[]` — **append-only, no reorder, so it should be the
  first commit in this sequence to produce zero P5 findings**
- **The retired track id `aidc-power-primer` must never be reused** (plan §4 item 2). Asking for it now
  answers `UNKNOWN_TRACK`, which was verified rather than assumed
- The five pre-existing lessons still pin `concepts:profiler-concepts` at the stale **`2026-08-31`** —
  untouched again, still a one-line correction whenever the developer wants it
- The earnings desk Routine (weekdays 13:00 UTC) and the weekly C2 pipeline (Wed 11:00 UTC) remain live and
  unreviewed across five sessions; neither was touched. Sessions D and E of `IMPROVEMENT-PLAN.md` not started

**Key decisions and positions taken:**

- **`aidc-power-primer` was retired rather than retitled, and the reasoning is the one that generalises.**
  The retitle was the conservative option and §2.2 explicitly allows it. It was rejected because the only
  thing a permanent track id protects is progress keyed on it — and Classroom keys progress on **lesson id
  + section id, never on track id**, so the rollup is reconstructed from the lessons wherever they sit.
  **Had track-level progress been stored, or had any analyst account existed, the retitle would have been
  correct.** The removal was surfaced in chat before it was made, per the Chesterton's Fence gate
- **Retiring a track and creating its replacement must happen in one commit**, so no registered lesson is
  ever in no track. A lesson outside every track still appears in the lesson index (`clLessonIndexFor_`
  walks the lesson registry, not the tracks), so that failure would have been quiet rather than visible
- **Three §3.3 deviations on `bridge-power`, all reported before writing.** (a) `three-ways-to-eat-the-same-gas`
  became **four** ways with a count-free id `ways-to-eat-the-same-gas` — the Mainspring dossier positions the
  linear generator as an explicit fourth category, and teaching three while pinning that dossier would have
  made the pin ornamental. (b) `four-campuses` **lost its "grid posture" column** — stated for only two of
  four rows; it became "who builds and supplies it" and the two known postures moved to the `note`, which
  says plainly the other two are not stated. (c) `where-it-fails` carries §5 row 4 in full but only the
  **paralleling half** of row 5 — the transfer-switch specifics belong to `study:eaton` / `study:rosendin`
  and to `the-aidc-power-chain`, so the section names them as the next lesson's material instead
- **One section was added that the outline omits** — a `bars` on the efficiency ladder, with four
  source-stated figures. **The fuel cell is deliberately absent from that chart**: its guide gives
  efficiency as a relationship ("nearly scale-free"), not a class figure, and §8 note 6 forbids inventing
  the proportion. The `note` says so. **This is the pattern for `bars` under note 6**
- **`reviewBy` is `2026-12-31` — a real dated gate, not the ~6-month default**, unlike `the-fence-line`.
  Frontier's first building (H2 2026) and Project Jupiter's initial operations (Q4 2026) both close on that
  date, and both are taught in `four-campuses`, so two flagship rows change state when they land
- **The sales lines were written to what the sources actually say, which is uncomfortable.** All four pinned
  supplier dossiers describe platforms with no storage in the product line, and one advertises prime power
  with "zero reliance on battery storage". So the lesson teaches that this cohort is where storage is being
  **designed out**, and that the openings are narrow and specific — the bring-up, the transient/ride-through
  duty, and the conversion at the end of a bridge. "A battery rides along" was the comfortable read and the
  wrong one
- **Three inputs the plan's §3.3 list does not name were added** because the lesson genuinely drew on them:
  `profile:kiewit`, `profile:bloom-energy`, `profile:stack-infrastructure`. The plan's own list would have
  left two of the four campus rows unsourced. **The plan is a specification; the corpus is the authority**

**Active context:**

- Repo **v04.34r** · Classroom **v01.07w / v01.13g** · Profiler **v01.80w / v01.34g** · Scraper
  **v01.71w / v01.99g** — no page version moved this session (content-only, GAS side)
- Curriculum now **7 lessons / 3 tracks** (`bess-foundations` 3, `aidc-grid-to-chip` 3, `aidc-campus` 1);
  the plan proposes 30 / 5. Concepts registry unchanged at 75 entries
- Capacity: repo CHANGELOG **87/100**; `Classroomgs` changelog **13/50**
- `classroom-pipeline-ledger.json` untouched — `gateDigest`, `coveredThrough` and `lastRun` all unchanged
- Routines unchanged (6): earnings desk, C2 pipeline, daily ACL, monthly drift, quarterly guidance review,
  quarterly private sweep
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md empty
- Plan §8 item 11's open developer calls are now **two**, not three: G5 (four utility dossiers) and whether
  G1's second wave should precede the remaining cut-line lessons. The `aidc-power-primer` naming question
  is **closed**

**Recommendation for next session:**

- **Author `the-800-vdc-shift` on Opus 5** (`CLASSROOM-CURRICULUM-PLAN.md` §3.3, cut-line item 3), appended
  to the end of `aidc-grid-to-chip`'s `lessons[]`. It is the topic every customer conversation drifts to,
  `study:zhonhen` and `study:megmeet` carry the whole public thesis between them, and — because positions 4
  and 5 are second-wave — it is a pure append that needs no registry reorder, making it the first commit in
  this sequence that should come back with **zero P5 findings**. Its `bars`/`table` split is the live
  judgement call: the three-chain comparison has stated stage counts and efficiency bands, but "the new
  boxes" gives shape without figures and must be a `table` under §8 note 6.

**To continue:** type `author the-800-vdc-shift from CLASSROOM-CURRICULUM-PLAN.md §3.3`

## Previous Sessions

### 2026-09-02 — `the-fence-line` (v04.32r)

**Date:** 2026-09-02 10:42:26 PM EST
**Repo version:** v04.32r (started at v04.31r — one push commit, plus this context write)
**Branch:** `claude/fence-line-lesson-authoring-950vj0` (merged to `main` by the auto-merge workflow)
**Model:** Opus 5 — an authoring session, by the standing decision that planning runs on Fable and authoring on Opus 5

**What we worked on — `the-fence-line`, the first lesson off the curriculum plan's cut line (`31d704e` v04.32r):**

- **Authored `clLessonTheFenceLine_()`** inside the `// CONTENT START` … `// CONTENT END` fence in
  `googleAppsScripts/Classroom/Classroom.gs` — 343 lines of strict JSON, at its position in the walk
  (between `clLessonSpecSheet_` and `clLessonAidcPowerChain_`). **Eight sections across six kinds**:
  `nothing-connects-unstudied` (prose) · `the-three-studies` (timeline) · `load-is-not-generation`
  (callout) · `what-arrives-at-the-fence` (prose) · `megawatts-that-differ` (table) · `where-it-fails`
  (callout, `tone: "warn"` — the first use of that field in the curriculum, deliberately establishing the
  convention for the seven `where-it-fails` sections that follow in this track) · `drill` (6 flashcards)
  · `check-yourself` (5 quiz items). No two sections of the same kind adjacent; `sales` on three of the
  six teaching sections
- **Created `clTrackAidcGridToChip_()`** (`aidc-grid-to-chip`, The AI Data-Center Wave) holding
  `the-fence-line` alone, and **re-sequenced both registries by insertion** so registry order stays
  teaching order for `clStudyNext_`: the lesson between `spec-sheet-decoded` and `the-aidc-power-chain`,
  the track between `bess-foundations` and `aidc-power-primer`. `prereqs[]` omitted rather than pointing
  at the unregistered `electrical-foundations`
- **Six public inputs, every pin read off the document fetched this session** (G2):
  `study:burns-mcdonnell@2026-08-21` · `study:mortenson@2026-08-21` · `study:stack-infrastructure@2026-08-22`
  · `study:nebius@2026-08-21` · `study:terawulf@2026-08-21` · `concepts:profiler-concepts@2026-09-03`.
  The stamp folds to **`tracks`** — analyst and up
- **Seven lesson-local glossary entries only**, all for meanings the 75-entry registry does not carry:
  `interconnection study`, `network upgrades`, `energization`, `front-of-meter`, `brownfield`,
  `power banking`, `entitlement`. Everything else (`{{transformer}}`, `{{GOES}}`, `{{medium voltage}}`,
  `{{large-load tariff}}`, `{{NOGRR 282}}`, `{{SB 6}}`, `{{take-or-pay}}`, `{{PUE}}`, `{{ERCOT}}`,
  `{{commissioning}}`, `{{switchgear}}`, `{{behind-the-meter}}`) resolves from the registry — **G1's payoff
  landed exactly as predicted, zero duplication, zero `{{term}}` warnings**
- **Verified:** `check-classroom-content.py` — 6 lessons, 3 tracks, 134 gate cases, **0 errors / 0 warnings**;
  `check-classroom-pipeline.py --base origin/main` — six paths changed, **2 findings, both P5** on the
  registry insertions (the documented cost of a curriculum reorder, plan §4). **P1 did not fire** — all six
  paths sit inside the contract's write set — and **no P3**, so `gateDigest` was correctly left untouched;
  `--selftest` 13 fixtures / 0 failures; `node --check` and `check-gas-inner-scripts.js` clean
- **Ran the gate derivation against the real content**, not just the checker's fixtures: `the-fence-line`
  → gate `tracks`, viewer not admitted, analyst reads it, `aidc-grid-to-chip` lists it with `withheld=0`
- **Bumped `VERSION` + `Classroomgs.version.txt` together to `v01.11g`**, generic `v01.11g` changelog entry
  (no refs, no company names), `v04.32r` CHANGELOG section, repo version, README. **The live GAS deploy was
  confirmed after merge** — `?action=api&op=deploy` returns `Already up to date (v01.11g)`

**Where we left off:**

- **The track exists and holds one lesson.** `aidc-grid-to-chip` is real, opens with `the-fence-line`, and
  its `short` describes what it actually teaches today rather than the eight-lesson outcome in §3.3 — each
  later authoring session extends both the list and the `short`
- **Two things deliberately left alone, both reversible developer calls.** (a) The five pre-existing lessons
  still pin `concepts:profiler-concepts` at **2026-08-31**. Re-pinning them is not required by this lesson,
  and a pin that moves with no contradiction behind it is the write G3 tells a pipeline run not to make.
  (b) `the-aidc-power-chain` stays in `aidc-power-primer` rather than moving into the new track — moving it
  now would half-dismantle a working track to open a hole at position 2 where `bridge-power` goes
- **Three §3.3 outline deviations were reported, not written around**, per the developer's standing
  instruction to say so rather than stamp a section on material the sources do not carry — see "Key
  decisions" below
- The earnings desk Routine (weekdays 13:00 UTC) and the weekly C2 pipeline (Wed 11:00 UTC) remain live and
  unreviewed across the last four sessions; neither was touched here
- Sessions D and E of `IMPROVEMENT-PLAN.md` remain not started
- The three developer calls from plan §8 item 11 are still open, and one has moved: keeping or retiring the
  track id `aidc-power-primer` is now a *live* question rather than a hypothetical, because a second AIDC
  track exists beside it

**Key decisions and positions taken:**

- **The section id is `megawatts-that-differ`, not the plan's `four-megawatts-that-differ`.** The plan's own
  outline lists five quantities in that row (gross · critical IT · contracted · connected · active). Ids are
  permanent, so one that miscounts its own rows would be permanent too
- **One section was added that the outline omits but the lesson's `short` promises** — the substation.
  `what-arrives-at-the-fence` is scoped to what physically arrives at the property line and what set its
  date; the voltage ladder, the inside of the tank and the 40-month lead time are left to
  `the-transformer-and-the-substation` in track 2, so the two lessons do not duplicate
- **Two §5 failure-map claims were cut for want of a source.** "Queue re-pricing" and "an audit that pauses
  a batch" appear only in the plan's own analysis column — no study guide states them — so `where-it-fails`
  teaches only what the five guides carry. An "interconnection agreement" phase was likewise dropped from
  the timeline: the guides name three studies, not a contract stage. **This is the working method: the plan
  is a specification, the corpus is the authority, and the gap gets reported**
- **The `timeline` axis is the phase order, not a calendar.** The renderer prints `Math.floor(x)` in a year
  gutter and no source gives a per-phase duration, so `x` is 1–6 and both the `intro` and the `note` say so
  in the reader's own words. The durations that *are* carried (years in busy regions, 5+ for a new large-load
  request, about a year for a gigawatt substation) are stated where they belong. **Any later lesson using
  `timeline` for a non-calendar sequence should do the same**
- **`reviewBy` is `2027-03-02` — the ~6-month default, chosen after looking for a dated gate and not finding
  one.** §8 note 3 asks this lesson to take the nearest dated gate in its own material. There is none: the
  only dated instrument is Texas SB 6 (2025), already in force and therefore a *past* gate, and the guides
  carry no queue-audit date or Batch Zero target. If gap **G6** (a large-load interconnection guidance
  module) is ever commissioned, a revision drawing on it should inherit that module's `reviewBy`
- **The concepts pin is `2026-09-03`, one day ahead of `updated` (2026-09-02), and that is correct.** It is
  the literal `git log -1 --format=%cs` output — the G1 commit landed 01:47 UTC, just past local midnight.
  Pinning the observed value means the next pipeline run reads *unchanged*; pinning 2026-09-02 would have
  made it read *moved* every week for nothing
- **A developer session inserting into the registries accepts P5 findings** and does not work around them
  (plan §4, "Insertion versus append"). The `--selftest` staying at zero failures is the check that matters

**Active context:**

- Repo **v04.32r** · Classroom **v01.07w / v01.11g** (live deploy confirmed) · Profiler **v01.80w / v01.34g**
  · Scraper **v01.71w / v01.99g** — no page version moved this session
- Curriculum now **6 lessons / 3 tracks** (was 5 / 2); the plan proposes 30 / 5. Concepts registry unchanged
  at 75 entries. Capacity: repo CHANGELOG **85/100**; `Classroomgs` changelog 11/50
- `classroom-pipeline-ledger.json` untouched — `gateDigest`, `coveredThrough` and `lastRun` all unchanged
- Routines unchanged (6): earnings desk, C2 pipeline, daily ACL, monthly drift, quarterly guidance review,
  quarterly private sweep
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md empty

**Recommendation for next session:**

- **Author `bridge-power` on Opus 5** (`CLASSROOM-CURRICULUM-PLAN.md` §3.3, cut-line item 2, position 2 of
  the track just opened). It is the single insertion that turns `aidc-grid-to-chip` from a stub into a walk,
  it is the largest untaught cluster in the corpus (seven study guides, four supplier dossiers, four named
  projects), and `the-fence-line` now sets it up explicitly — the queue that makes on-site generation exist
  is taught, and the engine table stays in `where-batteries-stop` per §8 note 8. Re-fetch and re-pin every
  input off the fetched document; do not carry this lesson's pins or the older lessons' stale `2026-08-31`
  concepts pin.

**To continue:** type `author bridge-power from CLASSROOM-CURRICULUM-PLAN.md §3.3`
