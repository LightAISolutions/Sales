# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-02 (Three-app architecture review — IMPROVEMENT-PLAN.md, v04.24r)

**Date:** 2026-09-02 04:58:20 AM EST
**Repo version:** v04.24r *(unchanged — this session's plan commit was documentation-only by instruction, no version bump)*
**Branch:** `claude/three-app-architecture-review-e1on3o`

**What we worked on (one docs-only push, commit `25b279c`, merged to `main` — the three-app architecture review):**

- **`repository-information/IMPROVEMENT-PLAN.md`** (296 lines, §0–§9) — the improvement plan for Profiler · Scraper · Classroom, written from a full read of all six app source files, the four rules files, both schemas, the Phase 6 design + committer contract, the brochures, every file in `profiler-data/`, and the **live Routine inventory including prompts** (27 active, 33 completed). §0 is a measured ground-truth table; §1 the diagnosis; §2 the three flagship proposals; §3 second tier; §4 stop/remove/freeze; §5 the C3→C6 sequencing verdict; **§6 a collision register** naming every rule or recorded decision a proposal touches and the argument for reconsidering it; **§7 a session-by-session build order (A–E)**; §8 what was examined and left alone; **§9 facts to verify before building**
- **The three flagship proposals:** **P1** build the retention loop now — pull **C4 ahead of C3** (SM-2 drill over the 802 study-guide flashcards + 53 lesson items, sheet-backed history in a `ClassroomDrill` tab, a "due today" landing card; prerequisite: both progress stores change from booleans to **completion dates** so the schema-promised "changed since you learned this" delta can render); **P2** deltas not documents — Profiler adopts Classroom's revision discipline (computed "what changed in vN" strip from the archive, a per-account mark-as-read stamp + roster badge, optional authored `revisions[]` at schema v8); **P3** one **earnings desk** Routine driven by `repository-information/profiler-refresh-calendar.json`, replacing the 21 hand-armed one-shot refreshes and carrying the corpus token once
- **Second tier:** S1 token-gated **notes route** on Profiler.gs (`pending` / `triage` / `recent`) so unattended refreshes can weigh field notes — Classroom pipeline explicitly *not* a consumer (contract §4.3 intact); S2 corpus token in the C2 prompt, decided after 2–3 measured runs; S3 cross-links (digest → dossier, all mastheads ↔ Scraper); S4 report `indicators[]` as Scraper topic seeds; S5 quizzes only via `profiler prep`. **Removals/freezes:** R1 stop hand-arming one-shots; R2 audit-then-remove Scraper's legacy Projects machinery (~1,900 GAS + ~1,700 HTML lines, three AI-spend paths); R3 a one-quarter freeze on production-side building; R4 doc/prompt drift
- **Evidence the plan stands on** (all measured 2026-09-02): the **seven August post-earnings triggers fired — six `SUCCEEDED`, IREN `ABANDONED` — and none re-armed a successor or wrote the fallback reminder**; `profiler-app.md` still lists them as armed. **0 of 21 armed refresh prompts mention the corpus bridge** (they predate it); the Tesla prompt says "schema-v2" and "mirror via add_repo" (both superseded). The **C2 prompt states "CORPUS TOKEN: none is supplied"**. Both progress stores hold `{sec: true}`. All 89 dossiers carry `lastUpdated` 2026-08-30 (mass pass). 62 study guides, 0 quiz sections. The Scraper brochure teaches 👍/👎 rating and Calibrate, retired by `SCRAPER_FEEDBACK_UI_ENABLED = false` (D3, 2026-08-27)
- **Delivered in chat, not committed:** the copy/paste Opus 5 prompt for Session A of the plan

**Where we left off:**

- `25b279c` merged to `main` by the auto-merge workflow; `main` at `7a451ba`. This Remember-session commit is the branch's second push
- **Deliberately skipped for the plan commit, per the developer's "that file and nothing else":** Pre-Commit [PC-CHANGELOG] #6 (no CHANGELOG entry for `IMPROVEMENT-PLAN.md`), [PC-README-TREE] #7 (no README tree row), [PC-README-TIMESTAMP] #10, [PC-REPO-VERSION] #15. **The next push commit should fold these in** — the plan's Session A is the natural place
- **Classroom's first real pipeline run (today 11:06 UTC / 07:06 ET) is still unreviewed** — carried over from two sessions now; §9 item 1 of the plan predicts a `STAND-DOWN`
- Nothing else pending

**Key positions taken (proposals, not decisions — the developer decides):**

- **Documentation only.** No code, schema, rules file, changelog, README or version file changed; every collision with a recorded decision is named in §6 with its argument, never made silently
- **Order of build:** Session A = P3 (small, operational, stops a failure already happening) before P1 (the flagship); then B = completion dates + computed dossier deltas; C = the drill; D = seams (S1, S3, S4); E = the R2 audit; then C3 as designed
- **Decision 6 honoured:** guidance items stay out of the drill until C3 — no interim Profiler→Classroom guidance route
- **S1 respects M3's purpose** (notes never in repo or on Pages) and argues from the corpus-token precedent; the Classroom pipeline is excluded as a consumer

**Active context:**

- Repo **v04.24r** · Classroom **v01.04w** / **v01.07g** · Scraper **v01.71w** / **v01.99g** · Profiler **v01.79w** / **v01.33g** — **no app code changed this session**
- Capacity unchanged: repo CHANGELOG **77/100**; `Scrapergs.changelog.md` **46/50**; `Classroomgs.changelog.md` **7/50**; `Profilerhtml.changelog.md` **50/50** — the next Profiler page change forces its rotation
- Ledger `coveredThrough` `2026-09-01`, `lastRun` `null`. Routines: 21 one-shot refreshes (2026-10-15 → 11-25) + quarterly private sweep + monthly drift check + quarterly guidance review + daily ACL check + weekly C2
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Still flagged, not fixed:** README tree root line shows `v01.03r`; `ENTERPRISE-SETUP.md` token record stale; the template-wide first-sign-in self-denial (Setup Step 14 trap)

**Recommendation for next session:**

- Run **Session A of `IMPROVEMENT-PLAN.md` §7 (the earnings desk)** on Opus 5: first verify §9 items 1–3 (today's pipeline report; what the seven August refresh sessions did and why IREN was abandoned; whether the 08-30 dossiers carry the H1/Q2 figures), then seed `repository-information/profiler-refresh-calendar.json` from the 21 armed prompts + the 7 fired ones, create the one desk Routine with the corpus token pasted at creation and nowhere else, hand-fire it on a no-due day to confirm a silent stand-down, retire the 21 one-shots, rewrite "Scheduled Refreshes" in `profiler-app.md` around the calendar, fix the R4 drift, and fold in the CHANGELOG entry + README tree row the plan commit skipped. No app code in that session

**To continue:** type `implement Session A of IMPROVEMENT-PLAN.md`

Developed by: LightAISolutions
