# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-02 (The drill — Sessions A/B/C of IMPROVEMENT-PLAN.md, v04.29r)

**Date:** 2026-09-02 08:17:50 PM EST
**Repo version:** v04.29r (started at v04.24r — five push commits)
**Branch:** `claude/session-a-earnings-desk-y6ns6e` (all five merged to `main`)

**What we worked on — Sessions A, B and C of `IMPROVEMENT-PLAN.md`, plus a fix:**

- **`7c7e2b6` v04.25r — Session A part 1 (the earnings desk, P3 + R1 + R4).** Created
  `repository-information/profiler-refresh-calendar.json`: 50 rows (29 public with
  `nextReport`/`confirmed`/`source`/`lastRefreshed`/`watch[]`, 21 `cadence: "quarterly"` private),
  seeded by reading **all 22** armed one-shot prompts in full. Schema section added to
  `PROFILER-SCHEMA.md`. Rewrote "Scheduled Refreshes" in `.claude/rules/profiler-app.md` around the
  calendar; deleted the stale "Currently armed" list. Fixed R4 brochure drift (Scraper's retired
  👍/👎 + Calibrate advice; Profiler page 5, which described the convention this commit retired),
  rebuilt both PDFs, re-measured the 1006 px limit — Profiler p5 came back at **1007 px**, trimmed to
  989. Folded in the CHANGELOG entry + README tree row the plan commit had skipped
- **`4b6deda` v04.26r — Session A part 2.** Created the **Profiler earnings desk** Routine
  `trig_01UyH77BMKJnxzBUZJ11ej6A` (weekdays 13:00 UTC, fresh session, push + email) carrying
  `CORPUS_TOKEN` — the first scheduled Profiler session ever to have it, which switches the
  Scraper news-triage bridge on. Hand-fired it as a report-only dry run (5m36s, 10.8M tokens read,
  `main` untouched, no branch), then deleted all 22 one-shots. **Six Routines remain, zero
  per-company one-shots**
- **`b126e33` v04.27r — Session B (completion dates + computed deltas).** Both progress stores moved
  from booleans to `YYYY-MM-DD` completion dates (`Classroom.gs` v01.08g, `Profiler.gs` v01.34g);
  legacy `true` accepted forever, never rewritten, yields no delta. `Profiler.gs` accepts
  `dossier-<slug>` doc ids. `Classroom.html` v01.05w renders the schema's delta exactly (newest
  revision strictly after the completion date whose `changed[]` names the section).
  `Profiler.html` v01.80w adds mark-as-read keyed by the dossier's own `lastUpdated`, a roster
  `✓ read` / `↻ revised` badge, and a computed changed-strip vs the newest archived version.
  `CLASSROOM-SCHEMA.md` Freshness now describes the code
- **`4c77b47` v04.28r — Session C (the drill, C4).** Schema first: "Drill items and history" in
  `CLASSROOM-SCHEMA.md`. `Classroom.gs` v01.09g: `ClassroomDrill` + `ClassroomDrillLog` sheet tabs,
  `cop=drill` / `cop=grade`, SM-2 collapsed to four buttons. `Classroom.html` v01.06w: landing card,
  `#drill` route, reveal-then-grade, source links. `PHASE6-CLASSROOM-DESIGN.md` C4 marked built with
  the C4-before-C3 order note (Decision 6 untouched — no guidance item in the drill until C3)
- **`12555d8` v04.29r — the drill fix.** See "Where we left off"

**Where we left off:**

- **The drill shipped broken in v04.28r and was fixed in v04.29r.** The developer's screenshot showed
  no drill card. Two causes: the page hadn't deployed yet (`v01.05w` next to `GAS v01.09g` in the
  footer pills), **and** the deployed version could not have worked. `cop=drill` had the client send
  its study inventory as a parameter, but the shared `_gasPost` transport carries everything in the
  **query string** — 802 study cards URL-encode to **~39,000 chars**, ~5× what Apps Script accepts.
  The op failed, and a failed sync is indistinguishable from "nothing due" at the UI. Fixed by moving
  the study pool server-side (`clDrillStudyItems_`, `UrlFetchApp.fetchAll`, cached 6h as ids+hashes
  only, ~23 KB); the page now sends nothing and fetches text only for the queue's guides
- **⚠️ The Classroom GAS still needs redeploying** — v01.10g is merged but not deployed. Until it is,
  the drill card will not appear and it will look like the fix failed. **This is the first thing to
  check next session**
- **Every checker passed on the broken version.** `node --check`, both Classroom checkers, Playwright
  "no page errors" — none of them exercise a signed-in session against the live deployment. Worth
  remembering before trusting a green board on anything session-gated
- **Delivered in chat, not committed:** a full copy/paste handoff prompt for a **fresh Fable 5.1
  session** to design the Classroom curriculum (see Recommendation below). It is in the transcript
  only — if it is wanted again, it can be regenerated from the corpus inventory below

**Key decisions and positions taken:**

- **Opus 5 for every remaining build phase** (developer directive — no Sonnet anywhere). My earlier
  Sonnet suggestion for S3/S4 and the Session E audit was a cost note, not a capability one
- **Fable 5.1 recommended for curriculum *planning* only**, in a *fresh* session; authoring returns to
  Opus 5 where the schema, checkers and stamp discipline are the actual work
- **Checkers were edited twice, both times to strengthen.** Session B: two assertions pinned `is True`
  on the progress value — the contract this session replaced — so they now accept a date or legacy
  `true`, plus a **new** assertion that new writes must be dated. Session C: +12 drill gate cases,
  **mutation-tested** (disabling `clLessonVisible_` produced exactly the leaks the assertion names).
  Editing the checker is closed to the pipeline committer, open to a developer session
- **`gateDigest` refreshed in every commit that touched a gate symbol** — four times total, including
  once where the first refresh went stale because a later edit re-touched `Classroom.gs`. A stale
  digest is silent until the next Wednesday pipeline run blocks on "the ground moved"
- **The corpus token is in this transcript.** The developer pasted it; it is in the desk Routine's
  prompt and no repo file. Rotating it in both Script Properties and re-pasting is a 5-minute job if
  wanted

**Active context:**

- Repo **v04.29r** · Classroom **v01.07w / v01.10g** · Profiler **v01.80w / v01.34g** ·
  Scraper **v01.71w / v01.99g**
- **Routines (6, no per-company one-shots):** Profiler earnings desk `trig_01UyH77BMKJnxzBUZJ11ej6A`
  (weekdays 13:00 UTC — **first real run fires tomorrow with 7 overdue rows**: NVIDIA, IREN, Sungrow,
  BYD, Sinexcel, EVE, Jinko, three per run); weekly C2 pipeline `trig_017pcCGpj1fkNYcUyCXPY3Wd`
  (Wed 11:00 UTC, stood down cleanly on its first real run this morning); daily ACL check; monthly
  drift check; quarterly guidance review; quarterly private sweep
- Ledger: `coveredThrough` `2026-09-01`, `lastRun` `null`, `gateDigest` `sha256:83d1d03d…`
- Capacity: repo CHANGELOG **82/100**; `Profilerhtml` **48/50** (rotated this session at 50/50 —
  needed `git fetch --unshallow` for SHA enrichment); `Scrapergs` **46/50**; Classroom logs 7 and 10
- **Corpus for curriculum work:** 89 dossiers · 62 study guides (802 flashcards) · 44 concepts ·
  8 named projects · 7 guidance modules · 5 lessons across 2 tracks (`bess-foundations`,
  `aidc-power-primer`)
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md empty
- **Not started:** Sessions D (S1 notes route, S3 cross-links, S4 report seeds) and E (the R2 audit)

**Recommendation for next session:**

- **Redeploy the Classroom GAS to v01.10g and confirm the drill card appears**, then use the drill for
  a few days before building anything else — its caps (`CL_DRILL_SESSION_CAP` 20, `CL_DRILL_NEW_CAP`
  10) are single constants worth tuning from real use rather than from a guess. The curriculum
  planning run on Fable 5.1 can happen in parallel in its own session; Session D waits.

**To continue:** type `redeploy check — confirm the drill card renders`

Developed by: LightAISolutions
