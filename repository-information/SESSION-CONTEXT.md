# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-24 08:31 PM EST (Events mentions refresh + sync fixes, v07.43r–v07.45r)

**Date:** 2026-09-24, 07:55 PM → 08:31 PM EST (attended; six turns)
**Repo version:** v07.45r, three pushes on `claude/awesome-brahmagupta-7cmzsc` (v07.43r, v07.44r, v07.45r; all merged), plus this session-context write
**Branch:** `claude/awesome-brahmagupta-7cmzsc`

### What was done

- **`mentions[]` refreshed (v07.43r).** Ran `extract-corpus-events.py`. Only the Megmeet dossier had drifted, since its v8 cut at v07.32r:
  - `computex-2027` lost megmeet/strategy.
  - `ai-infra-summit-2027` gained megmeet/sources.
  - Still 256 rows across 33 corpus events. `--check` and `check-events-registry.py` both exit 0.
- **Events Sync hand-off fixed (v07.44r).** The v07.42r "mark 7 applied, reject 9" instruction could not be carried out in the panel:
  - **Mark applied** stamps every approved row at once (`Events.html` `ev-prop-applied`).
  - An applied row can't be rejected afterwards (`already_applied`).
  - The queue now reads 0 pending · 0 approved · 17 rejected · 16 applied, so the 9 skipped misreads carry `applied`.
  - Step 8 of `.claude/rules/events-app.md` now orders it: Reject the skipped rows first, then Mark applied. `EVENTS-SCHEMA.md` §7 has a one-line note.
- **ACP RECHARGE 2026 flipped to `past` (v07.45r).** The registry check failed once the UTC date rolled to 25 Sep. Fixed with `--fix-past` and an `events.ics` rebuild (68 confirmed). Registry check exit 0.

### Where we left off

- Everything is committed and merged to main. The Events registry action item is closed: the registry check passes, `mentions[]` is current and the Proposed queue is empty.
- **Optional, the developer's:** in the Events spreadsheet's Proposed tab, relabel the 9 skipped rows' Status from `applied` to `rejected`. The ids are in the v07.42r CHANGELOG under "Skipped". This only fixes the labels: the poller's dedup counts every row whatever its status, so the misreads won't be re-proposed either way.
- **Active reminders (the developer's):**
  - Cooling recheck from 28 Sep.
  - Neoclouds pass from 1 Oct.
  - Dominion reframe 2–6 Oct.

### Key decisions made

- **No per-id Mark applied.** The session describes the panel as it is, with no per-id marking, and never hands off an order the panel can't carry out. I verified the claims against `Events.gs` `evPollApplied_` / `evPollDecide_` / `evProposedKeys_`.
- **A past-date flip is data-only.** It gets its own push (repo version, CHANGELOG, README) with no page or GAS bump, following the v07.42r precedent.
- **The earlier heads-up was retracted.** I had said the AI Infra Summit misread would recur on the next poll. It won't: dedup blocks the identical proposal, and past-dated editions are skipped.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Events page unchanged:** Events.html v01.11w; only data and the rule text changed.
- **The UTC rollover will recur:** `check-events-registry.py` compares against the UTC date, so each confirmed event trips it at 8 PM Eastern on its last day. The fix is a one-line `--fix-past` push, and no Routine automates it.
- **Dates:**
  - CoolIT launch 9/28
  - Fluidstack accounts 9/30
  - Dominion solicitation 10/1
  - ESIG DER webinar 10/1
  - Megmeet start 10/7
  - Battery Show NA 10/12–15
  - ESIG large-loads webinar 10/15
  - RE+ 11/16–19

### Recommendation for next session

- On or after Monday 2026-09-28, recheck `landscape-cooling-2026-09` against what CoolIT actually launched (capacity, ship date, form factor) and place it on the CDU ladder, which Schneider's 3.5 MW WCDU now tops. Move `reviewBy` only if the gate has passed; if the launch slipped, set it to the new date.

**To continue:** type `recheck the cooling module after CoolIT`
