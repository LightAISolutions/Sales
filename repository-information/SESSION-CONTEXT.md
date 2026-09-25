# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-24, 09:24 PM → 2026-09-25, 03:01 AM EST (attended; nine turns)
**Repo version:** v07.46r (unchanged; four housekeeping pushes, none version-bumped: the 9/30 reminder, this session context, the Events loose-end closure, and this refresh)
**Branch:** `claude/vibrant-cray-r4spuo`

### What was done

- **Read the 9/23 Classroom pipeline run's report** (Priority 1 item 5). The transcript can't be read from a cloud session, so the repo was checked first and the developer then pasted the report.
  - **Result: `STAND-DOWN`, correct.** It found 4 qualifying items from 1 source (`profile:novonix`), against a bar of 3 items from 2 sources. `coveredThrough` stays 2026-09-21, so the window stays open.
  - **Pre-flight passed.** The gate digest matches the ledger (it still matches today), and schema is v1/v1. The checker found 19 segments due: 17 were pin-only and 2 had real section changes. Segments belong to developer sessions, and v07.37r regenerated five of them on 9/24.
  - **Its two "Needs the developer" items:**
    - No corpus token was supplied, so the Scraper layer was skipped. The contract (§10.6) intends this. It's optional to add one; the trade-off is that the token would appear in every run's transcript.
    - `ups` was broadened to battery-or-flywheel. I checked, and no lesson glossary contradicts it: the only UPS entry is at `Classroom.gs:55772`. No fix is needed.
- **Notifications:** the Routine has push and email on, but no email arrived for the 9/21 or 9/23 run. Other Claude emails do reach the inbox. The likely reason is that only noteworthy runs notify (unconfirmed). The 9/30 run is the first real test.
- **Reminder added:** check the 9/30 Classroom run, including whether a notification arrives.
- **Priority 1 (hard dates 9/28–10/7) is confirmed done:**
  - Item 1: OCP SST v0.3 (v07.39r).
  - Item 2: Classroom review dates (v07.40r/v07.41r). Cooling, neoclouds and the Dominion scenario are left in place on purpose and each has a reminder.
  - Item 3: events sync (v07.42r).
  - Item 4: Habitat and Gridmatic (v07.46r).
  - Item 5: the 9/23 report (this session).

### Where we left off

- Everything is committed and merged to main.
- **Item 3's loose end is closed (12:37 AM on 9/25).** The developer confirmed in the Events app's Proposed tab that no proposals are waiting and that the 7 v07.42r rows are marked applied. The other 17 of the poller's 33 were decided in the app, and no sync is outstanding. **Priority 1 is fully complete.**
- **Active reminders (the developer's), in date order:**
  - Cooling recheck from 9/28.
  - 9/30 Classroom run check.
  - Neoclouds pass and Habitat re-run from 10/1 (they can share a Profiler session).
  - Dominion reframe 10/2–10/6.

### Key decisions made

- **A pin-only segment is not work for the run.** When a segment's inputs moved but no section differs, G3 leaves it alone, so "19 due" on 9/23 did not mean the run failed.
- **The corpus token stays out for now.** The 9/30 window has three repo sources (NOVONIX, Gridmatic, Habitat), which should clear the bar without it.
- **Notification silence isn't treated as a fault yet.** The first committing run (likely 9/30) decides it. If it commits and nothing arrives, raise it with Claude support rather than changing the Routine.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Classroom ledger:** `coveredThrough` 2026-09-21. `lastRun` is 2026-09-21 COMMIT (v07.03r). The gate digest is `sha256:3d0970…`.
- **Routine:** "Classroom curriculum pipeline (C2) - weekly", Wednesdays at 4:00 AM PDT, next run 9/30. Push and email are on. Runs as Claude HQ · Opus 5.
- **Tooling gap:** this environment can't read another session's transcript (only `get_session` metadata is available), so a run's report has to be pasted in.

### Recommendation for next session

- On or after Monday 2026-09-28, recheck `landscape-cooling-2026-09` against what CoolIT actually launched (capacity, ship date, form factor) and place it on the CDU ladder, which Schneider's 3.5 MW WCDU now tops. Move `reviewBy` only if the gate has passed; if the launch slipped, set it to the new date. It's the first of the dated reminders; the 9/30 Classroom run check follows.

**To continue:** type `recheck the cooling module after CoolIT`

## Previous Sessions

### Session — 2026-09-24 08:50 PM EST (Habitat Energy and Gridmatic v2, v07.46r)

**Date:** 2026-09-24, 08:34 PM → 08:50 PM EST (attended; four turns)
**Repo version:** v07.46r (one push), plus a reminder push and this session-context write, all on `claude/dazzling-mayer-r2n493` and all merged
**Branch:** `claude/dazzling-mayer-r2n493`

### What was done

- **Habitat Energy and Gridmatic dossiers refreshed to profileVersion 2 (v07.46r).** Source: the developer's open-action-items Priority 1 list. Both v1 files are archived. Both dossiers were only 13 days old, so the pass focused on what had changed and re-read ownership, using two parallel research agents (about 32 sources each).
  - **Habitat: the Quinbrook sale is unchanged.** No buyer, bidder, signing or withdrawal is on the record through 2026-09-24; New Project Media's 17 March report is still the only source. FY2025 accounts (for Habitat and its parent) are due 9/30 and were not filed.
  - **Habitat additions:**
    - The parent's May 2026 PSC07/PSC08 register correction (not a transfer).
    - General Counsel Jason Dillingham and Chief People Officer Lois Stamps.
    - Quinbrook's "Operational & Expanding" page, re-weighted as weak evidence because it has not been edited since August 2025.
  - **Gridmatic: no raise found.** There is no Form D, named investor or credit facility, and the "upcoming debt and equity raises" posting is still live. Ownership now reads "founder-led": the company has existing investors, a board and stock options.
  - **Gridmatic additions:**
    - The company's own claim of ~$100M retail revenue for 2026.
    - Amperical data showing the ERCOT book is 2 sites / 110 MW (Endurance Park 11th of 312, Cross Trails 38th).
    - Energy Vault's lenders waiving Cross Trails' debt-service-coverage test for Q1 and Q2 2026.
    - The CCO's interview, the Ohio residential add-on amendment, and VP Finance Yojna Verma.
  - **Also updated:** registry tagline and synced fields, the graph, calendar `lastRefreshed` (both stay `watch` tier) and the watch notes.
  - **Checks:** all clean (sync, relationships, cross-references 0, study guides). Five inbound mentions reviewed; none changed.
- **Reminder added:** re-run `profiler Habitat Energy` on or after Thu 10/1, once its FY2025 accounts post.

### Where we left off

- Everything is committed and merged to main. The screenshot's action item 4 ("decide before 10/1") is closed for Gridmatic. For Habitat, only the FY2025 accounts remain, and they are now tracked by a reminder.
- **Active reminders (the developer's):**
  - Cooling recheck from 9/28.
  - Neoclouds pass and Habitat re-run from 10/1. Both wait on 9/30 accounts filings, so they can share one Profiler session.
  - Dominion reframe 10/2–10/6.

### Key decisions made

- **Manual run over tier promotion.** The developer chose `profiler <Company>` by hand rather than moving either company to the `core` tier, so both stay `watch`. The consequence, spelled out in Habitat's refresh notes: the 10/1 sweep skips them, and the accounts must be folded in by hand.
- **Research-prompt hints are not findings.** The Habitat agent's "CEO is Luers, not Irons" came from a wrong hint in my own research prompt. The dossier was already right, so nothing changed.
- **Change-focused revision.** A dossier under a month old gets a pass on what changed (plus the identity re-check), not a full rebuild.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Profiler page unchanged:** v01.91w; data-only changes.
- **sec.gov is still blocked from this environment.** efts.sec.gov full-text search works; Companies House works.
- **Dates:**
  - CoolIT launch 9/28
  - Habitat and Fluidstack accounts 9/30
  - Dominion solicitation 10/1
  - quarterly sweep 10/1
  - Megmeet start 10/7
  - Energy Vault Q3 10-Q in November (Cross Trails waivers)

### Recommendation for next session

- On or after Monday 2026-09-28, recheck `landscape-cooling-2026-09` against what CoolIT actually launched (capacity, ship date, form factor) and place it on the CDU ladder, which Schneider's 3.5 MW WCDU now tops. Move `reviewBy` only if the gate has passed; if the launch slipped, set it to the new date.

**To continue:** type `recheck the cooling module after CoolIT`
