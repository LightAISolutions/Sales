# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-10-07 ~05:24 PM → 2026-10-08 ~01:05 PM EST (one session: the missing 10/7 Morning Digest, diagnosed and fixed)
**Repo version:** v07.99r → v08.00r (this session's one code push); main is now v08.05r from other sessions
**Branch:** `claude/brave-franklin-vqwzwv`

### What we worked on

- **Diagnosis.** Gmail showed no 10/7 digest and no alert, plus earlier silent misses (9/8, 9/16, 10/1, 10/2) and late papers (9/2, 9/3, 9/7, 9/10, 9/29). Issue numbers (9/30 No. 022 → 10/5 No. 023) showed the missed days never saved an edition.
- **Root cause, from the developer's My Executions screenshot:** not the 90 min/day trigger quota (all runs Completed, ~14.5 min over 17 h). The 06:01 hourly tick started the build itself and held the script lock 325.8 s; the 06:04:51 `scDigestMorningRun` lost `tryLock(5000)` and returned silently (7.5 s); the tick then stepped the build ~40 s an hour, never finishing, and the noon `norender` alert was unreachable while a build was in flight.
- **v08.00r — Scraper v02.23g:** lock-miss retry (1 min, ≤8/day); continuation clearing moved after the lock; tick hands due editions to the full-speed chained build (waits for the 06:00 trigger during the 06 hour); noon check runs first in the tick, "still building" vs "never started"; feeds fetched with `fetchAll` plus a per-URL fallback (Google News backstop left sequential); tick works only weekdays 06:00–13:59 ET plus a nightly 03:00 interests sync, heartbeat and run note every hour. **Profiler v01.41g:** transcript watcher hourly Mon–Fri 08:00–20:59 ET. Scraper diagram updated. Both deployments verified live.
- **Confirmed:** the 10/8 digest arrived at 7:01:50 AM ET as No. 025 (which also confirms 10/7 saved no edition).

### Where we left off

- The fix worked on its first morning. Nothing is pending from this session.
- Not done (not requested): a guard against starting a new step near the 6-minute execution cap; the "read My Executions first" note for `gas-scripts-reference.md` (offered, no answer). After 14:00 ET nothing restarts a dead build chain; the noon alert has already gone by then.

### Key decisions made

- The tick keeps its `everyHours(1)` trigger and gates in the handler, so no trigger migration or editor step was needed; off-window ticks still write the run note, so the "Last scheduled run" tile never shows overdue.
- Routine lock misses go to the run note and execution log, not the error trail; only exhausting the 8 retries counts as an error.
- Manual "Run intake now" builds left in flight keep one step per tick, because continuations would race the app's lock-free step loop.
- The developer works on Pacific time (My Executions shows PT); ET stays the desk time zone.

### Active context

- Branch `claude/brave-franklin-vqwzwv`; main at v08.05r (v08.01r Applied Digital earnings refresh; v08.02r–v08.05r ACL-health snapshot work, with the ACL health Routine now at 05:50 and 17:50 ET). Scraper GAS v02.23g; Profiler GAS v01.43g after other sessions. CHANGELOG `99/100`, so the next push rotates.
- Reminders: the Dominion reframe reminder is still open, but the reframe itself ran on 10/4 (v07.91r: solicitation not yet issued, `reviewBy` moved to 2026-12-02). The developer may want to dismiss it. The Megmeet / AIDC re-run is due by 10/31. TODO: no items.
- Toggles unchanged (START On, BOOKENDS Off, TIMING On, END On).

### Recommendation for next session

- **Paste `phase-f-action-plan.md` §16 into a fresh Fable 5.1 xhigh session.** That runs ERCOT: schema note and `grid-operator` category, dossier, guide, the Profiler page change with its changelog rotation, and the 78-dossier reconciliation. It is still unrun since it was written on 10/5, and PJM (row 14) is waiting on its schema.

**To continue:** type `run the ERCOT prompt in phase-f-action-plan.md §16` (or paste §16 directly).

## Previous Sessions

**Date:** 2026-10-08 ~12:42 PM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v08.02r

### What was done

- Events + Network: ACL health probe now reads the real last-known-good snapshot under `aclSnapshotKey_()` and reports Receipts' `{ enabled, users, ageSec, usable }` grace shape (v08.02r)

### Where we left off

All changes committed and merged to main. ERCOT (`phase-f-action-plan.md` §16) still has not run.

### Active context

- TODO: no items
- Active reminders: reframe the Dominion rehearsal (window was 10/2–10/6, now past); re-run the AIDC power-conversion report after Megmeet's Q3 filing (due by 10/31)
- Toggles: START_OF_RESPONSE_BLOCK On, CHAT_BOOKENDS Off, TIMING_ESTIMATES On, END_OF_RESPONSE_BLOCK On
