# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-07 10:21:51 PM EST
**Repo version:** v01.93r

**What we worked on:**
- Verified the Sinexcel scheduled refresh pre-fire (v01.91r research portion): trigger `trig_01KcsGWtyHTq5j4ySXZddg5b` enabled for 2026-08-12 13:00 UTC with the full upgraded prompt; `sinexcel.profile.json` (profileVersion 1) in sync with the registry; empty `archive-index.json` ready for the first archival — no changes needed
- Profiler logo (v01.91r, page v01.04w): created `images/profiler-logo.svg` (dossier-card emblem in the app's ink/paper/gold palette) and pointed `SPLASH_LOGO_URL` at it; Playwright-verified on all three splash screens
- Made Profiler an installable PWA (v01.92r, page v01.05w): `profiler.webmanifest`, 192/512 icons (512 = `any maskable`, emblem at 80% on full-bleed ink), manifest/theme/Apple tags + `manifest-src 'self'` PROJECT OVERRIDE in `Profiler.html`
- Fixed standalone install (v01.93r): the installed Receipts app claimed scope `./` (whole site), which per documented Chrome behavior blocks installing a second PWA in that scope — narrowed both manifests to per-app scopes (`./Profiler.html`, `./Receipts.html`) and added stable `id`s. Developer reinstalled both and confirmed they now run standalone

**Where we left off:**
- Everything committed, pushed, and auto-merged (v01.93r). Both PWAs verified working on the developer's phone. Nothing in flight

**Key decisions made:**
- Only `SPLASH_LOGO_URL` carries an app's logo — `DEVELOPER_LOGO_URL`/`YOUR_ORG_LOGO_URL` stay on the placeholder (they're developer/org branding, and the page doesn't consume them)
- Multi-PWA-on-one-origin pattern: each installable page's manifest scopes to exactly its own page with a stable `id` — apply this to any future installable page
- Maskable icon convention: composite the emblem at 80% on a full-bleed background so icon masks can't clip it

**Active context:**
- Branch `claude/profiler-sinexcel-logo-87ub0e` · Repo v01.93r · 9 tracked pages, all 🟢; Profiler at v01.05w
- Armed refresh triggers unchanged from last session (Sinexcel 08-12 · Sungrow 08-30 · BYD 08-30 · Tesla 10-22 · Wärtsilä 10-28 · CATL 11-01 · Fluence 11-25 · Hithium/FlexGen quarterly)
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders

**Recommendation for next session:**
- The Sinexcel refresh fires autonomously on 2026-08-12 13:00 UTC — after it runs, review it end-to-end: the refreshed dossier's quality, the archival flow (`sinexcel.profile.v1.json` in `profiler-data/archive/` + `archive-index.json` entry + `bess-aidc-library` mirror), and that it re-armed the next Sinexcel trigger
- **To continue:** type `review the Sinexcel refresh results`

## Previous Sessions

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

Developed by: ShadowAISolutions
