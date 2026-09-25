# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-25, 04:30 AM → 06:40 PM EST (attended; seven turns)
**Repo version:** v07.51r (five pushes: v07.47r → v07.51r)
**Branch:** `claude/wonderful-johnson-n5spaf`

### What was done

- **Priority 2 items #6 and #7 are closed.** The developer confirmed each live check:
  - Warmth and Reconnect; the brief in Word; Promote to Profiler; booking a meeting; the post-event checklist and Mark held.
  - The Google Calendar `webcal` subscription; the vCard bundle and the QR code.
  - `NETWORK_CORPUS_TOKEN` and `NW_POSTAL_ADDRESS` are set; Script Properties need no redeploy.
  - The E4 sweep is installed; it last ran 9/23 (11 events, 1 signal).
- **Five fixes and features pushed from the live testing:**
  - **v07.47r — Events v01.12w.** "After the show" hung on "Counting the cards…" when the sheet was rebuilt mid-load (a tab return or a reopen). The fix, `evRepaintPlan`, paints whichever Plan box is on screen.
  - **v07.48r — Events v01.13w.** After Mark held, the meeting row showed the raw contact id `c-…`. `evPostMark` now carries the names across from the list already on screen.
  - **v07.49r — Network v01.25w / GAS v01.18g.** The Promote box requires "What did you learn?", and the text leads the Profiler note (` — Context: …`), with a 300-character excerpt in Network's History. Before this, Network had no free-text touch.
  - **v07.50r — Profiler v01.92w.** 🗑 Delete on every note in the ⚙ → Field notes log, so `general` notes can be deleted too. `Profilerhtml.changelog.md` rotated `v01.42w` into its archive.
  - **v07.51r — Events GAS v01.10g.** The #9b decision (exhibitor-only): the registry field `speakersWidget` (`re-plus-2026` = `swapcard`) makes the sweep skip widget-served rosters. `events.ics` was rebuilt.
- **#11 (Scraper versions):** the Project History screenshot shows Version 167 current, from the v07.21r deploy. That is 13 versions to the 180 cleanup line and 33 to the 200 cap. No cleanup is due; the count grows by one per push that changes `Scraper.gs`.
- **Action plan for #8–#12, with Opus 5.5 effort levels:**
  - **Phase A (now to 9/27):** #8 report refresh (High); #12R drafting the discovery Routine prompt (Medium), which the developer then creates in the UI.
  - **Phase B (9/28–10/6):** #9a registry pass filling hours, coordinates and agendas for RE+ and the 35 events through 11/30 (High); the booth-number build (High); optionally the other two aged 9/8 reports.
  - **Phase C (10/15–10/21):** #10 Classroom re-judging after the quarterly guidance Routine (`scenario-capital-objection` due 10/14, `briefing-2026-09-21` due 10/21) (High); #12Q quota review around 10/21 (Medium).
  - **Phase D (11/2–11/9):** `events plan re-plus-2026` from the Plan-tab JSON (High). RE+ runs 11/16–11/19.

### Where we left off

- Everything is committed and pushed (v07.51r).
- **Next is #8**, the refresh of the power-conversion report. Its paste-ready prompt is below.
- **The developer's dated reminders still stand:**
  - Cooling module recheck, from Monday 9/28.
  - The 9/30 Classroom pipeline run check.
  - The neoclouds Profiler pass and the Habitat Energy re-run, from Thursday 10/1.
  - The Dominion reframe, 10/2–10/6.
  - The Megmeet start date is Wednesday 10/7.
- **Soft checks with no action needed:**
  - The `webcal` subscription should pick up the next `events sync` on its own.
  - Events v01.13w should show the contact's name after a mark.

### Key decisions made

- **#9b:** exhibitor-only signals for widget-served rosters. The Swapcard API is declined, and key speakers come in through the sheet's manual signal form.
- **Promote:** a promotion must carry what the developer learned. A promotion that only relays the History summary has no value.
- **Script Properties** take effect without a redeploy.
- **#11:** no cleanup until the count nears 180. It can be computed as 167 plus the pushes changing `Scraper.gs` since v07.21r.
- **R is unblocked:** a scheduled Routine has committed (the earnings desk, v07.16r on 9/22).

### Known issues

- **`scripts/verify-profiler-roles.py`:** 2 failures that predate this session, both in the study-progress checks ("admin tick did not persist" and "lost its own progress after the other account signed in"). They also fail on the code before this session's change.
- **`scripts/check-events-plan.js`:** 2 failures from fixtures whose dates have gone stale (`not_over` for a Nov fixture, and the ROI read date). The logic is fine.
- **`CHANGELOG.md` is at 103/100.** From 9/26, none of its sections are exempt, so the next push must rotate the oldest date groups into the archive.

### Active context

- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Versions:**
  - Pages: Events v01.13w · Network v01.25w · Profiler v01.92w.
  - Apps Script: Events v01.10g · Network v01.18g · Scraper v02.22g.
- **Out-of-date reports:** `check-profiler-reports.py` warns on `aidc-power-conversion` (Megmeet v7→8, Delta v5→6, LITEON v6→7), `grid-scale-bess` (Jinko) and `named-project-bess-attach` (Oracle), all from 9/8.

### Recommendation for next session

- Run #8 in a fresh Opus 5.5 High session by pasting this prompt:

> profiler report competitive: AIDC power conversion — refresh the 2026-09-08 edition against current dossiers (Priority 2 item #8).
>
> Context:
> - The current edition is `live-site-pages/profiler-data/reports/aidc-power-conversion--competitive--2026-09-08.report.json` ("AIDC Power Conversion — The 800 VDC Race"). `python3 scripts/check-profiler-reports.py` warns that it has aged: it pins megmeet v7, delta-electronics v5 and liteon v6, and those dossiers are now v8, v6 and v7 (all refreshed 2026-09-23). It turns "aging" on 2026-10-23 and no Routine watches it.
> - This is a re-run of a prior topic, not an edit. Reports are immutable, so write a new edition `aidc-power-conversion--competitive--<today>.report.json` with `supersedes` set to the 9/8 edition's id, and flip the old entry in `reports-index.json` to `superseded`. Follow the Profiler report command in `.claude/rules/profiler-app.md`.
> - Keep the 9/8 edition's company scope. If the preflight coverage table shows a covered company that belongs in this race but is missing, propose it in the preflight rather than widening silently.
> - Synthesize from covered dossiers only and cite their sources with provenance tiers. Do not re-research. If a dossier is stale for this report's purpose, record that in `limitations` rather than refreshing it in this session.
> - Read the two 2026-09-23 SST reports (`sst-hall-edge-block--competitive--2026-09-23` and `sst-hall-edge-block-rev2--competitive--2026-09-23`) and keep this report consistent with them where they overlap (Megmeet's position). Cross-reference them; don't duplicate them.
> - Audience: I start at Megmeet on Wednesday 2026-10-07. Write the BLUF and key judgments so they are usable in my first week.
> - Show me the preflight (type, scope, coverage table with freshness tiers), then proceed without waiting unless the scope is ambiguous.
> - Out of scope: the other two aged 9/8 reports (grid-scale-bess: Jinko v5→v6; named-project-bess-attach: Oracle v4→v5). Mention them only if the refresh changes something they depend on.
> - Heads-up for the push: `repository-information/CHANGELOG.md` sat at `Sections: 103/100` on 9/25 with 5 sections dated that day. From 9/26 onward none are exempt, so archive rotation will be due on this push (the oldest date groups, with SHA enrichment, after deepening the clone).
>
> Done when: the new edition is registered, `python3 scripts/check-profiler-reports.py` reports no warning for it, and the push has merged.

**To continue:** paste the #8 prompt above into a new Opus 5.5 High session

## Previous Sessions

### Session — 2026-09-24 09:24 PM → 2026-09-25 03:01 AM EST (read the 9/23 C2 report, Priority 1 closed, v07.46r)

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
