# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-25, 06:47 PM → 07:20 PM EST (attended; three turns)
**Repo version:** v07.53r (two pushes: v07.52r, v07.53r; this save is unversioned)
**Branch:** `claude/quirky-faraday-avb5pv`

### What was done

- **#8 closed — the AIDC power-conversion report was refreshed twice on 9/25:**
  - **v07.52r:** `aidc-power-conversion--competitive--2026-09-25` superseded the 9/8 edition. It re-pins Megmeet v8, Delta v6 and LITEON v7, and the rack order is now sourced: Delta, LITEON, Megmeet third. It dates Megmeet's SST as pre-research with no class, corrects the 9/8 reading of Sungrow ("supplying" by filing; batch orders from 2027), and adds a Megmeet first-week section and a cross-reference to the SST rev2 report.
  - **v07.53r (developer decision):** `aidc-power-conversion-rev2--competitive--2026-09-25` added `power-electronics` to Layer 3 (AIPCS, medium voltage to 800 VDC, TRU-class). That makes 16 vendors and 66 citations. The FCC paragraph now says the inverter rule reaches Power Electronics' Spanish-built storage inverters. **rev2 is current.**
  - `check-profiler-reports.py` reports 0 errors and no warning on rev2.
- **New reminder:** re-run the report once Megmeet's Q3 is filed (due by Sat 10/31), refreshing the Megmeet dossier first. Zhonhen and Sinexcel report by the same deadline.
- **The #12R prompt was drafted** (below). It hands the discovery Routine's prompt and the UI steps to a Medium session.

### Where we left off

- **Everything is merged; the tree is clean.** Next is #12R, then Phase B (#9a registry pass and the booth-number build, 9/28–10/6).
- **Dated reminders stand:**
  - The cooling recheck, from 9/28.
  - The 9/30 Classroom run.
  - The neoclouds pass and Habitat Energy, from 10/1.
  - The Dominion reframe, 10/2–10/6.
  - The AIDC re-run, after 10/31.
  - The Megmeet start is Wed 10/7.

### Key decisions made

- **Power Electronics went in now rather than at the Q3 re-run.** It is a fresh dossier and a clear Layer 3 product, and it is the US-footprint comparison for the first week. The only cost was a same-day third edition, named with `-rev2` per the SST precedent.
- **Mitsubishi Electric** stays a named candidate for the next edition.
- **Archive rotation is not due on 9/25:** 105 sections, 7 exempt, 98 non-exempt. **The first push dated 9/26 or later rotates the 2026-09-18 group (8 sections), SHA-enriched after `git fetch --unshallow`.**

### Known issues

- The two older aged 9/8 reports still warn (grid-scale-bess: Jinko; named-project-bess-attach: Oracle). Nothing in this refresh touched what they depend on; they are optional Phase B work.
- `repository-information/megmeet-briefing-prompt.md` still names the 9/8 edition as current. Its own row says to re-check the index after 10/1, which will find rev2.
- From before this session: `verify-profiler-roles.py` (2) and `check-events-plan.js` (2, stale fixture dates).

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **CHANGELOG:** `Sections: 105/100`.
- **Pages:** Profiler v01.92w (unchanged — reports are data-only).
- **Working files:** the report builder scripts were scratchpad-only, not committed.

### Recommendation for next session

- Run #12R in a fresh Opus 5.5 Medium session by pasting this prompt:

> Run action #12R — draft the discovery Routine's prompt and give me step-by-step instructions to create it in the claude.ai UI (**R** in `repository-information/NETWORK-EVENTS-DESIGN-PLAN.md`).
>
> Read first, in this order:
> 1. `repository-information/SESSION-CONTEXT.md` → Latest Session.
> 2. `NETWORK-EVENTS-DESIGN-PLAN.md`: §5.3's **Discovery Routine** bullet, the **R** rows in §8 and §11, and the note headed "**R — the developer.**" Its blocker, Monday's earnings-desk proof, is cleared: the desk landed the first Routine commit on 9/22 (v07.16r).
> 3. `repository-information/ROUTINES-OPERATIONS.md`:
>    - the current **STEP 0** text — copy it verbatim, not from memory;
>    - the settled findings that a fired session can push only when the repository is attached on the "New routine" form, and that a Routine's repository cannot be edited afterwards;
>    - the 2026-09-21 model evaluation;
>    - the prompts under "The rebuild prompts", as the shape to follow.
> 4. `.claude/rules/events-app.md` (the Events Sync command and its never-list); `repository-information/EVENTS-SCHEMA.md` (the registry, the roster and the `Proposed` shape); and `live-site-pages/events-data/events.json` and `events-sources.json`.
>
> Settle these before drafting, and give me each answer with its reason:
> - **Where proposals go.** A fired session cannot write the Events spreadsheet's `Proposed` tab, and it must never call the deployed app or widen a peer token. Decide the repo-side queue a run writes candidates to (§8's "calendar-file-as-queue"), and how `events sync` or I promote a candidate out of it. If that file or its schema doesn't exist, create it in this session and make `scripts/check-events-registry.py` (or a sibling checker) validate it.
> - **What counts as a candidate:** the source classes; the relevance bar against the segments and the dossier corpus; dedup against `events.json`; a per-run cap; and the stand-down rule (a quiet run commits nothing and reports why).
> - **Cadence and model:** quarterly, with the cron written in `CRON_TZ=America/New_York` and a jittered minute. Give me the first fire date and recommend a model with the reason.
> - **Budget:** list my existing Routines and say whether one more fits before the #12Q quota review (~10/21).
>
> Deliverables:
> 1. The complete Routine prompt in one copyable block: STEP 0 verbatim, then identity, the queue, the cap, the stand-down rule and the report shape.
> 2. That prompt saved as a new subsection under "The rebuild prompts" in `ROUTINES-OPERATIONS.md`, so it can be recreated. Mark the plan's R row "prompt written — awaiting UI creation", add a CHANGELOG entry, and commit and push under the normal checklists.
> 3. Numbered, click-by-click steps for claude.ai's "New routine" form: name, prompt, repository picker (confirm the **Runs with** card shows `LightAISolutions/Sales` before saving), environment, model, schedule, connectors (none unless the prompt needs one), notifications, then one **Run now**. Check the live docs with `read_documentation` rather than memory.
> 4. What a good first run looks like (§8: it proposes at least one event and commits, or stands down with a report), and how I verify it: the session report, a commit on `main`, and the queue file.
>
> Do not create the Routine yourself. `create_trigger` cannot attach a repository, and a Routine without one cannot push.
>
> Done when: the prompt is committed in `ROUTINES-OPERATIONS.md`, the push has merged, and I have the UI steps.

**To continue:** paste the #12R prompt above into a new Opus 5.5 Medium session

## Previous Sessions

### Session — 2026-09-25 04:30 AM → 06:40 PM EST (Priority 2 #6 and #7 closed, five live-test fixes, v07.51r)

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
