# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-02 (Classroom curriculum design — planning, v04.30r)

**Date:** 2026-09-02 09:36:11 PM EST
**Repo version:** v04.30r (started at v04.29r — one push commit)
**Branch:** `claude/classroom-curriculum-design-woh4a7` (merged to `main` by the auto-merge workflow)
**Model:** Fable 5.1 — a planning session, by the standing decision that planning runs on Fable and authoring on Opus 5

**What we worked on — the Classroom curriculum design (`3cf0254` v04.30r, docs only):**

- **Confirmed the drill card renders** on the redeployed Classroom GAS (v01.10g) — the v04.29r fix held
- **Wrote `repository-information/CLASSROOM-CURRICULUM-PLAN.md`** (474 lines). Re-verified every corpus
  number from the files (89 dossiers · 62 study guides / 802 flashcards · 8 projects · 490 graph edges ·
  44 concepts · 7 guidance modules · 4 reports) and mapped fourteen topic clusters to a public /
  guidance / thin verdict. Argued the two existing tracks are the right *lanes* and the wrong *cut*, and
  proposed **five tracks in three lanes**: `bess-foundations` extended to 6 lessons; new
  `electrical-foundations` (5); `aidc-grid-to-chip` replacing `aidc-power-primer` (8 — the equipment
  walk in physical order); new `aidc-campus` (4); new `market-access` (7). **25 new lessons, 23 public
  and 7 guidance-gated, none report-derived**, each with a permanent id, `short`, `group`, the
  `provenance.inputs[]` it would pin, the folded gate, a section-by-section outline and a rationale
- **Teaching order** fixed against how `clStudyNext_` actually walks (tracks in `clTracks_()` order,
  then each track's `lessons[]`), with a note that a developer session may re-sequence registries
  (P5 binds only pipeline runs)
- **A 14-row grid-to-chip failure-point map** (stage · failure · why there · owner · source guide) as
  the spec for the `where-the-chain-breaks` capstone; every equipment lesson carries a `where-it-fails`
  section
- **A 12-entry gap register** (G1–G12): the cheapest lever is ~30 concepts-registry entries; the ones
  that matter most are dossiers for a gen-set OEM, a UPS vendor, a switchgear vendor and four utilities;
  two guidance modules (large-load interconnection; the grid-equipment shortage)
- **The cut line:** first five = `the-fence-line`, `bridge-power`, `the-800-vdc-shift`,
  `the-control-stack`, `where-bess-plugs-in`; second and third waves listed; **reasoned recommendation
  against report-derived modules** (point-in-time, trivia-prone, already readable in the lens)
- Pre-Commit/Pre-Push run in full: README tree row + timestamp, CHANGELOG v04.30r with the verbatim
  prompt (`Sections: 83/100`), repo version bump. No GAS or page version touched; REPO-ARCHITECTURE
  needed no change (individual docs are not diagrammed)
- **Answered "which model for the next step":** Opus 5 Extra (the standing build directive; the task is
  voice-matching authoring, not judgment-limited; Fable is 2× the per-token price)

**Where we left off:**

- The plan is merged to `main` and is the spec for every Classroom authoring session from here. Nothing
  in it is built: `Classroom.gs` untouched, no lesson JSON, no track changes, no concepts entries
- **Three calls the plan leaves to the developer** (§8 item 11): keep or retire the track id
  `aidc-power-primer` (naming only); whether G5 (four utility dossiers) is worth commissioning before
  track 5's guidance lessons; whether the first five lessons come before or after G1
- **Heads-up carried in the plan:** `bess-bankability-2026-08` has `reviewBy` **2026-10-01**, so any
  lesson stamped on it goes "⚠ review due" within a month — one reason the two bankability lessons are
  third-wave; the quarterly guidance review should land first
- The earnings desk Routine's first real run (weekdays 13:00 UTC) and the weekly C2 pipeline
  (Wed 11:00 UTC) are both live and unreviewed since the last session's notes; neither was touched here
- Sessions D and E of `IMPROVEMENT-PLAN.md` remain not started

**Key decisions and positions taken:**

- **Planning on Fable 5.1, authoring on Opus 5 Extra** — restated and applied; one lesson per authoring
  session is the safe unit (the five existing lessons average ~290 lines of strict JSON)
- **Lanes kept, tracks re-cut** — the `group` vocabulary (Technology Foundations · The AI Data-Center
  Wave · Market Access & Bankability) stays; the *tracks* are re-cut into five because track length is a
  learning-design number and both markets share an untaught electrical floor
- **No report-derived modules** — reports belong in the weekly briefing feed, not in modules
- **Technologies turned down as lessons** (solar PV physics, hydrogen, wind, nuclear/SMR, EV charging,
  roadmap chemistries, flywheels, HVDC) are kept as sections where they answer a specific question
- Section-kind variety treated as a check: no lesson runs two `prose` sections back to back; `bars` only
  where the source states numbers; `ledger` not planned for any lesson

**Active context:**

- Repo **v04.30r** · Classroom **v01.07w / v01.10g** (deployed, drill confirmed) · Profiler
  **v01.80w / v01.34g** · Scraper **v01.71w / v01.99g**
- Capacity: repo CHANGELOG **83/100**; `Profilerhtml` 48/50; `Scrapergs` 46/50
- Curriculum today: still 5 lessons / 2 tracks in `Classroom.gs`; the plan proposes 30 / 5
- Routines unchanged (6): earnings desk, C2 pipeline, daily ACL, monthly drift, quarterly guidance
  review, quarterly private sweep. Ledger `coveredThrough` `2026-09-01`
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md empty

**Recommendation for next session:**

- **Run gap G1 on Opus 5 Extra:** add the ~30 concepts listed in `CLASSROOM-CURRICULUM-PLAN.md` §6 G1
  to `live-site-pages/profiler-data/profiler-concepts.json` in the registry's existing voice (two
  sentences, high-school-STEM baseline, industry context), then run
  `python3 scripts/check-classroom-content.py` to confirm no `{{term}}` warnings, bump nothing but the
  repo version, and push. It is one session, needs no schema change, and removes a lesson-local glossary
  from every track-2 and track-3 lesson before any of them is written. The first authored lesson
  (`the-fence-line`, plan §3.3) follows in its own Opus 5 session

**To continue:** type `implement gap G1 from CLASSROOM-CURRICULUM-PLAN.md`

Developed by: LightAISolutions
