# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-07 02:13:52 AM EST
**Repo version:** v01.90r

**What we worked on:**
- **Overview → Profiler rename** (v01.89r): `Profiler.html` (v01.03w), `profiler-data/` with `<slug>.profile.json` + `profiler-companies.json`, `PROFILER-SCHEMA.md`, `.claude/rules/profiler-app.md`, CLAUDE.md "Profiler Command" (trigger phrase now "profiler \<Company\>"), README tree, REPO-ARCHITECTURE flowchart node `PROFILER_PAGE` with regenerated + decompression-verified pako URL
- **Dossier archival system** (v01.89r): `profiler-data/archive/` + `archive-index.json` (currently `{}`); Archival Procedure in `profiler-app.md` — archive-before-edit as `<slug>.profile.v<N>.json`, index update, best-effort mirror to `lightaisolutions/bess-aidc-library`
- **Scheduled refreshes armed for all 9 covered companies** (v01.90r): 7 self-re-arming one-shot triggers (post-earnings, fresh sessions) + 1 quarterly private-company cron; pre-existing Sinexcel trigger prompt upgraded to the improved template
- Session recovered from a mid-flight context compaction (trigger creation was interrupted; state reconstructed from git + staged renames)

**Where we left off:**
- Everything committed, pushed, and auto-merged to `main` (v01.90r). Nothing in flight — the refresh system runs autonomously from here

**Key decisions made:**
- BYD trigger staggered +2h after Sungrow (both report 2026-08-29) so two fresh sessions don't collide on shared repo state files
- Estimate-based triggers (Tesla, Fluence) verify publication first and re-schedule themselves to the confirmed date if the report isn't out
- Trigger-fired sessions carry no MCP connectors → every prompt has fallbacks: in-repo archive alone is acceptable; if `create_trigger` is unavailable, leave a REMINDERS.md note for manual re-arming
- `profiler-data/archive/` deploys publicly with the site — acceptable, profiles contain only public-sourced data

**Active context:**
- Branch `claude/corporate-overview-app-1i1fzb` (deleted from remote after each auto-merge; recreated per push)
- Repo v01.90r · 9 tracked pages, all 🟢; Profiler at v01.03w
- Armed triggers (all fire fresh sessions): Sinexcel 08-12 13:00Z (`trig_01KcsGWtyHTq5j4ySXZddg5b`) · Sungrow 08-30 13:00Z (`trig_01TJcC525KKrtVmm1bAdyoW3`) · BYD 08-30 15:00Z (`trig_015mXU6ModiBdHnuhuWmxA9K`) · Tesla 10-22 13:00Z (`trig_01Y3Pt7xQ8oHDppbwDUero5V`) · Wärtsilä 10-28 13:00Z (`trig_014VoHBq1JXCxtzBwieHL2oN`) · CATL 11-01 13:00Z (`trig_01JWQ7grg4QpT7tBmu7FR43J`) · Fluence 11-25 14:00Z (`trig_01LhRd2YGZNUi4AhBLrfYvFP`) · Hithium & FlexGen quarterly cron, next fire 2026-10-01 (`trig_01UVzjF6Y91Gb2MzKdDAznd9`)
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders

**Recommendation for next session:**
- The first scheduled refresh (Sinexcel) fires 2026-08-12 in an autonomous fresh session — after it runs, review it end-to-end: the refreshed dossier's quality, the archival flow (`sinexcel.profile.v1.json` in `profiler-data/archive/` + `archive-index.json` entry + `bess-aidc-library` mirror), and that it re-armed the next Sinexcel trigger
- **To continue:** type `verify the Sinexcel refresh`

## Previous Sessions

**Date:** 2026-08-06 09:17:38 PM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v01.82r

**What was done:**
- Scraper feedback loop: 👍/👎 article verdicts feeding scoring exemplars, deploy-flap-safe verdict saves, rating status log panel (v01.58r–v01.61r)
- Scraper preference learning: AI distillation into learned notes + suggested keywords, calibration rating mode, re-score collection, learned-keyword fetch widening, optimistic batched suggestion adds with undo (v01.60r–v01.66r)
- Scraper scoring quality: five-band rubric anchors, title-only fairness, feedback rebalance (v01.67r)
- Scraper corpus tools: chunked Enrich abstract harvest + poison-URL stall fix, score-distribution stats panel, archive-junk flow (v01.68r–v01.71r)
- Scraper fetch breadth: query planner, AI pre-filter at fetch time, Claude web-search deep backfill, real-time add-keyword-to-plan (lock-guarded, manual adds preserved on Rebuild) (v01.72r–v01.73r, v01.76r–v01.77r)
- Scraper scheduler: hourly phase-stepped compile→analyze→brief→email pipeline; scriptapp-scope root cause, poison-loop abandon + failure email, heartbeat-based health with amber unverified banner (v01.63r, v01.76r–v01.78r)
- Scraper robustness/perf: API-first doGet + cached tab ensures, sticky GET transport, 90s fetch watchdog, next-step guidance on every action, notification history panel with unread badge, offline-tolerant batched verdict queue fixing the http_404 storm (v01.74r–v01.75r, v01.79r–v01.80r)
- Receipts: Pivot Builder export wizard (rows × columns × values + sheet include-toggles) with server-side Pivot sheet; latent ownerEmail export crash fixed (v01.81r)
- Receipts: export Preview step, commercial-invoice extraction calibration, Business category + six subcategories (v01.82r)

**Where we left off:**
- All changes committed and merged to main

**Active context:**
- 8 tracked pages; Scraper at v01.32w · v01.29g, Receipts at v01.30w · v01.18g as of v01.82r
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off

Developed by: ShadowAISolutions
