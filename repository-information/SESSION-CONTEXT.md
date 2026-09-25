# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-24 07:53 PM EST (Events sync, v07.42r)

**Date:** 2026-09-24, 07:42 PM → 07:53 PM EST (attended; two turns)
**Repo version:** v07.42r, one push on `claude/optimistic-mccarthy-plgmod` (merged), plus this session-context write
**Branch:** `claude/optimistic-mccarthy-plgmod`

### What was done

- **The first `events sync` to reach the registry (v07.42r).** The developer pasted the Proposed tab's export: 16 approved proposals and 10 polls.
  - **7 applied:**
    - `datacloud-usa-2027`: start moved to 30 Aug 2027; venue changed to Austin Marriott Downtown with `city` kept as "Austin"; the stale `venueLatLng` removed.
    - Three website updates: ESIG Large Loads, iMasons at Yotta, Data Center World.
    - Two new ESIG webinars (1 Oct, 15 Oct), both `tentative`. Their remaining fields came from the evidence pages, read 2026-09-24.
  - **9 skipped, at the developer's choice**, because they were poller misreads:
    - AI Infra Summit ×3: the organiser's JSON-LD still carries the finished 2026 edition.
    - MWC: street address in `city`.
    - Yotta: the event name read as the venue.
    - Four duplicates of existing rows under new slugs: Battery Show NA, ESIG Fall Workshop, iMasons Cascadia, iMasons Texas.
  - `lastProbe` updated on 10 roster rows. `uptime-network-americas-fall-2026` flipped to `past` with `--fix-past`.
  - `events.ics` rebuilt. `check-events-registry.py` exit 0: 102 events, 69 confirmed.
  - The CHANGELOG section lists every applied and skipped `pr-` id.

### Where we left off

- Everything is committed and merged to main.
- **The developer's panel follow-up, not a session task:**
  - Enter `v07.42r` in **Mark applied** for the 7 applied ids.
  - **Reject** the 9 skipped ids.
- **`mentions[]` is stale on main.** `extract-corpus-events.py --check` fails, and it failed before this sync too, after recent dossier edits (v07.41r's Trane and Narada revisions, among others). The sync never writes `mentions[]`, so it was left alone.
- **Active reminders (the developer's):**
  - Cooling recheck from 28 Sep.
  - Neoclouds pass from 1 Oct.
  - Dominion reframe 2–6 Oct.

### Key decisions made

- **An approved proposal is not applied blindly.** When a row would write data that is visibly wrong and the checker cannot see it (street address in `city`, event name as venue, a duplicate under a new slug, a year-crossed edition), the session names the rows and asks. The developer chose "apply the good ones, skip the rest, list the ids to reject".
- **A partly-right `changed-venue` keeps the good half.** Datacloud's venue name was taken and the address-in-city was not. `venueLatLng` is dropped when the venue changes, rather than left pinned to the old venue.
- **A `new-event` row's `series` is its name**, because the name carries no year (the rule's "name without its year").

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Events page unchanged:** Events.html v01.11w; only the data changed.
- **Poller weaknesses seen:**
  - It writes a JSON-LD `address` string into `city`.
  - It takes `location.name` as the venue even when that is the event name.
  - It proposes `new-event` rows for events the registry already holds under a different slug, with no name/date match.
  - It diffs an organiser page's stale previous edition against the current-edition row.
- **The checker's duplicate test is slug-only.**
- **Dates:**
  - CoolIT launch 9/28
  - Fluidstack accounts and C2 Routine 9/30
  - Dominion solicitation 10/1
  - ESIG DER webinar 10/1
  - Megmeet start 10/7
  - Battery Show NA 10/12–15
  - ESIG large-loads webinar 10/15
  - RE+ 11/16–19

### Recommendation for next session

- Run `python3 scripts/extract-corpus-events.py` to refresh the stale `mentions[]` in `events.json`, then `python3 scripts/check-events-registry.py` (exit 0) and `--check`. Commit it as a data-only push: it feeds the score's `corpusSalience` term, and it has been stale since the recent dossier revisions.

**To continue:** type `refresh the events mentions index`
