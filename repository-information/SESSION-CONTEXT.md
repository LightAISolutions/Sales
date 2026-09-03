# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-02 (Classroom concepts registry — gap G1, v04.31r)

**Date:** 2026-09-02 10:17:40 PM EST
**Repo version:** v04.31r (started at v04.30r — one push commit)
**Branch:** `claude/gap-g1-profiler-concepts-nflhuk` (merged to `main` by the auto-merge workflow)
**Model:** Opus 5 — an authoring session, by the standing decision that planning runs on Fable and authoring on Opus 5

**What we worked on — gap G1 from the curriculum plan (`5c66534` v04.31r, data only):**

- **Added all 31 concepts named in `CLASSROOM-CURRICULUM-PLAN.md` §6 G1** to
  `live-site-pages/profiler-data/profiler-concepts.json`, taking the registry from **44 to 75 entries**.
  Merged alphabetically by slug as a **pure insertion** — 266 additions, zero deletions, no existing
  entry moved or changed
- **The definitions are corpus-derived, not model-derived.** Before writing anything, the mechanics were
  pulled from the material the lessons will cite: Eaton (selective coordination, hold-up time, the ATS
  outage choreography, arc-flash studies, IEEE 519 at the point of common coupling), Sinexcel (reactive
  power / power factor / THD), Vertiv (CDU, cold plate), Black & Veatch (synchronous condenser,
  inertia), Bechtel (GOES as the transformer chokepoint), the `nvidia-800vdc` guidance module (SSCB,
  BBU, busway, VRM, TRU/SST), and the procurement + bankability modules (IRP, LTSA, independent
  engineer, NOGRR 282, SB 6, large-load tariff). For the regulatory terms this mattered — NOGRR 282's
  ≥75 MW threshold and its "load rule, not a storage standard" distinction come from the module's own
  glossary, not from memory
- **Voice matched to the registry:** one to three sentences, expansion → mechanism → why it matters to a
  seller, high-school-STEM baseline, no figures needing their own citation, US spelling, em dashes only.
  The file round-trips byte-identically against `json.dumps(indent=1, ensure_ascii=False)`, same as
  before the write
- **Aliases cover the forms a lesson will actually write** — `THD`, `scale-out`, `Tier III`/`Tier IV`,
  `IE`, `minimum take`, `reactive power`, `point of common coupling`, `automatic transfer switch`, and
  every acronym expansion. Checked against all 44 pre-existing terms and aliases: **zero collisions**
- **Verified:** `check-classroom-content.py` — 5 lessons, 2 tracks, 134 gate cases, **0 errors /
  0 warnings** (no `{{term}}` resolves to nothing); `check-profiler-study.py` — 62 study guides +
  registry at 75 concepts, **0 errors / 0 warnings** (shape, slug pattern, collisions, alphabetical
  order all clean)
- **Bumped only the repo version** (v04.30r → v04.31r) as instructed. No page or GAS version bump —
  `profiler-data/` writes are data-only by rule; `Profiler.html` and `Classroom.html` are **indirect
  affects** (both fetch `profiler-concepts.json` at runtime for their `{{term}}` tooltips)

**Where we left off:**

- **G1 is done and merged.** The vocabulary exists but nothing yet *uses* it — no lesson or study guide
  writes `{{transformer}}` or `{{GOES}}` today. The payoff is entirely forward-looking and lands the
  moment `the-fence-line` is authored
- **The concepts layer date moved twice in two days** (2026-09-02 for the plan commit, then again for
  this one). The five existing lessons still pin `concepts:profiler-concepts` at **2026-08-31**, so all
  five now show input drift. That is the refresh pipeline working as designed, **not** a checker
  failure — P7 only fails on a pin moving *backwards*. The pins were deliberately left alone: rewriting
  them is a `Classroom.gs` write with a GAS version bump, outside the session's scope and inside what
  the `the-fence-line` session touches anyway
- **`check-classroom-pipeline.py` was deliberately not run.** It judges the *unattended committer's*
  write set; `CHANGELOG.md`, `README.md` and `repository.version.txt` sit outside it, so it reports P1
  findings on any developer-session commit. Plan §8 note 9 scopes it to `Classroom.gs` writes
- **Three calls the plan still leaves to the developer** (§8 item 11), all untouched: keep or retire the
  track id `aidc-power-primer` (naming only); whether G5 (four utility dossiers) is worth commissioning
  before track 5's guidance lessons; the first-five ordering now that G1 has landed
- The earnings desk Routine (weekdays 13:00 UTC) and the weekly C2 pipeline (Wed 11:00 UTC) remain live
  and unreviewed across the last three sessions; neither was touched here
- Sessions D and E of `IMPROVEMENT-PLAN.md` remain not started

**Key decisions and positions taken:**

- **Two G1 rows are one concept each, not two.** `harmonics/THD` is a single entry (THD as an alias) and
  `scale-up/scale-out` is a single entry (scale-out as an alias) — the plan writes them slash-joined and
  the corpus teaches each pair as one idea. That lands the count at 31, matching the plan's "~30"
- **`reactive power` is an alias of `power-factor`, not its own entry.** The corpus teaches them in one
  breath (Sinexcel's flashcard is literally "What is reactive power, and what does power factor
  measure?"), so one tooltip covers both. Flagged to the developer as a veto-able call — if a track-2
  lesson ever needs reactive power on its own terms, promote the alias to an entry then
- **Definitions are grounded in the corpus, never authored from model memory** — established here as the
  working method for registry writes, and the reason the regulatory entries (NOGRR 282, SB 6,
  large-load tariff, IRP, LTSA, IE) are safe to state without a web check
- **Planning on Fable 5.1, authoring on Opus 5** — restated and applied; one unit of work per session

**Active context:**

- Repo **v04.31r** · Classroom **v01.07w / v01.10g** · Profiler **v01.80w / v01.34g** · Scraper
  **v01.71w / v01.99g** — no page or GAS version moved this session
- Concepts registry now **75 entries** (was 44); capacity: repo CHANGELOG **84/100**; `Profilerhtml`
  48/50; `Scrapergs` 46/50
- Curriculum still **5 lessons / 2 tracks** in `Classroom.gs`; the plan proposes 30 / 5
- Routines unchanged (6): earnings desk, C2 pipeline, daily ACL, monthly drift, quarterly guidance
  review, quarterly private sweep
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md empty

**Recommendation for next session:**

- **Author `the-fence-line` on Opus 5** (`CLASSROOM-CURRICULUM-PLAN.md` §3.3, first on the cut line). It
  is the missing front half of the grid-to-chip chain, every later AIDC lesson assumes it, five deep
  public guides support it, and its entire front-half vocabulary (`transformer`, `switchgear`, `GOES`,
  `large-load tariff`, `NOGRR 282`, `SB 6`, `IRP`, `interconnection queue`) now resolves from the shared
  registry with nothing lesson-local to carry. Re-fetch and re-pin every input off the fetched document
  (§8 note 2) — do not carry the plan's dates or the existing lessons' stale `2026-08-31` concepts pin

**To continue:** type `author the-fence-line from CLASSROOM-CURRICULUM-PLAN.md §3.3`
