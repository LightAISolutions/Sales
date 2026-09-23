# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-23 06:50 AM EST (the session ran ~06:34 → 06:50 AM EST)
**Repo version:** v07.27r — one push on `claude/classroom-event-provenance-1gehnk` (the X decision), plus a second push for this session-context write
**Branch:** `claude/classroom-event-provenance-1gehnk`
**Model:** Fable 5.1 xhigh (X — the Classroom hook: **decided no**; **D16's build order is complete**)

### What was done

- **X decided — no** (v07.27r). Nothing built, no gate surface touched, no GAS bump, no file added. The decision is written into `NETWORK-EVENTS-DESIGN-PLAN.md` §3's D13 row and §11's X row (flipped from *Proposed — deferred behind E0 stability* to **Decided — no, v07.27r, 2026-09-23**), with the three reasons, the four reopen conditions, and what remains outside the plan
- **Why no, in three lines:** the pre-event briefing already exists as E5's `events plan <event>` narrative (private half included; `repository-information/plans/re-plus-2026-narrative-plan.md`) and its public half is dossier material Classroom already stamps as `profile:` / `study:`; the fact with teaching value — who exhibits — is a Network `Signals` row that never crosses, `mentions[]` is not attendance, and what a registry row adds on its own is calendar, not mechanism, expiring with the edition, which a permanent `tracks` lesson (P5) cannot; the true cost of a tenth prefix is the map + mirror + `gateDigest` **plus** a G7 resolution rule (else every weekly run freezes the lesson as unknown), the committer contract's "exactly the nine prefixes", and the P11 guard in `check-classroom-pipeline.py` whose prefix tuple is hard-coded to the nine and which X may not edit — P4 would fire on the adding commit itself
- **What would change the answer** (any one reopens X): a *series-level* evergreen lesson once E0's next verification pass fills `hours[]` (2 of 96 upcoming rows), `editions[]` and the agenda structure; a G7 resolution rule for `event:` written into `classroom-app.md` first; one applied `events sync` cycle; or the developer asking for it. `contact:` stays never
- **The deferral condition, verified on the live file:** all 58 roster rows carry `lastProbe.at = 2026-09-21`, **but those are E0's own build-time probes** — `git log` shows `events-sources.json` written once (v06.95r) and never since, `events.json` touched only by E4 s2's manual agenda rows (v07.20r), and **no `events sync` has ever applied a diff**. The registry has stood under one poller cycle, not survived a change from one. Recorded in the X row and the CHANGELOG; it did not decide X
- `CLASSROOM-SCHEMA.md` gained one paragraph beside the *no `note:` prefix* rule recording that there is no `event:` prefix either (declined, dated, with the pointer); `EVENTS-SCHEMA.md` §11's D13 sentence updated. The prefix table still mirrors `CL_PROVENANCE_REF_KINDS` byte for byte
- **All six checkers passed on the untouched code** before and after: content 71 / 8 / 220 with 0 / 0, curriculum no structural findings, pipeline `--selftest` 15 / 0 (and 3 × P1 on the diff — the expected developer-commit noise, no P3 / P4), events-plan 151 / 0, registry OK, README tree 22 / 0

### Where we left off

**X is closed and D16's order is complete** — Gate → N0 → Q0 → N1 → N2 → E0–E1 → B → N3 → E2–E3 → E4 → N4 → E5 → X, every row Done or decided. Nothing from X is pending. **The Megmeet briefing's sequencing condition (the Network / Events build) is now met.**

### What remains — outside D16's order

- **Inside the ledger:** **R**, the discovery Routine — not started; its stated blocker (a scheduled Routine landing a commit) has evidence since the earnings desk's 2026-09-22 fire committed v07.16r, and the rebuilt C2 Routine's first fire today at 11:07Z is the next proof to read. The developer flips the row. **Q**, the quota review — one Fable 5.1 Medium session with a month of counter data
- **Outside the plan:** the E0 verification pass that fills `hours[]` / `venueLatLng` / `agendaUrl` (the biggest lever left on the Plan tab — coverage 2 / 26 / 16 of 96 upcoming rows per v07.26r); a hash router in `Network.html` for the post-event `#drafts?sourceEvent=` deep link; `scripts/check-guidance-migration.js` failing on clean `origin/main` ("expected 9 modules, got 28"); the standing E4 / E5 papercuts (no booth numbers on the day plan, RE+ 2026's Swapcard roster, the ROI line written once, `pullAndDeployFromGitHub` never logging its outcome)

### Key decisions made

- **A reasoned no is the deliverable.** The brief said so, the developer said not to force it, and the analysis found the teaching value already delivered elsewhere at the right gate (E5's narrative, admin-only) with the only novel input (attendance) forbidden by D9 / D13
- **The cost was measured, not taken from the brief** — three items became six (G7 rule, contract count, P11 guard), and the P11 point is decisive on its own: the one prefix the deployed-changelog leak guard cannot see would be the one X added, and X may not edit the checker
- **The brief's evidence was checked and corrected in writing** — the `lastProbe` stamps are E0's, not the poller's. That did not change the answer but is on the record so the next reader does not inherit it
- **Housekeeping commits take no version bump** (the reminders / session-context precedent) — only the X push bumped `repository.version.txt`, to v07.27r

### Active context

- **Repo version v07.27r.** `CHANGELOG.md` **`Sections: 98/100`** — **rotation becomes mandatory above 100**, two pushes away; read the live counter rather than this line
- **Live versions unchanged:** `Classroom.gs` v01.87g · `Classroom.html` v01.16w · `Events.html` v01.11w · `Events.gs` v01.09g · `Network.html` v01.24w · `Network.gs` v01.17g · `Scraper.gs` v02.22g. **No `.gs` changed this session — no redeploy needed**
- **The Routine fleet is six, all enabled** (verified last session): the C2 Classroom weekly `0 11 * * 3` **fired today at 11:07Z — its report is the first of the rebuilt Routine and worth reading**; Profiler earnings desk weekdays; Profiler quarterly and monthly drift (next 2026-10-01); Industry Guidance quarterly (next 2026-10-15); ACL health daily
- **One reminder remains active** — the **Megmeet SST briefing** before the 2026-10-07 start; its sequencing condition is now met, so it is the next thing to run, in a **new Opus 5 xhigh session** per the reminder
- **Playwright is not preinstalled in a fresh container** — `pip install playwright` only; the Chromium is already there, never run `playwright install`
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run the **Megmeet SST briefing** from the active reminder in a **new Opus 5 xhigh session** — X closing D16's order was its sequencing condition, the 2026-10-07 start date is two weeks out, and it is the one deliverable with an external deadline; run its two pre-flight checks (dossier freshness on the scoped slugs, whether the monthly drift check superseded `aidc-power-conversion--competitive--2026-09-08`) before the research.
- **To continue:** type `run the Megmeet briefing`


## Previous Sessions

### Session — 2026-09-23 06:30 AM EST (Events filter-pill fix + reminder close-out, v07.26r)

**Date:** 2026-09-23 06:30 AM EST (the session ran ~05:50 → 06:30 AM EST)
**Repo version:** v07.26r — three pushes on `claude/gracious-archimedes-57nfn5` (the Events filter-pill fix; the reminder close-out; this session-context write)
**Branch:** `claude/gracious-archimedes-57nfn5`
**Model:** Opus 5 (a short maintenance session between E5 and X — **no design-plan row moved**)

### What was done

- **The Events filter pills now paint the state they filter on** (`Events.html` v01.10w → **v01.11w**, v07.26r). The developer reported that **★ Starred** filtered the agenda but stayed unfilled. Root cause: `evRender()` rebuilds `#ev-agenda` and `#ev-counts` but **deliberately leaves the filters card alone** — rebuilding it would drop the segment row's horizontal scroll position and the `data-busy` flag an in-flight score fetch sets — and `aria-pressed` is the whole of what paints a pill accent-filled (`.ev-pill[aria-pressed="true"]`). E3's **Recommended** and E4's **Signals only** each set their own pill by hand inside their toggle and so looked right; **Starred** and the three option rows never got that treatment and went on filtering while reading `false`
  - New **`evSyncPills()` / `evSyncPillRow()`** re-derive every filter pill's `aria-pressed` from `_evFilters` / `_evRecMode` **in place**, called at the top of `evRender()`. The two hand-set calls in `evRecToggle` / `evSignalsToggle` **stay** — they are the immediate feedback before their fetch returns and the rollback on a failed one, not duplication
  - **A second, latent bug from the same root cause**: `evPillRow()` captured `current` at build time, and since the card is built once that snapshot never moved — so pressing an option pill a second time **re-picked** the same value instead of clearing it, and only **All** could undo a choice. The row now takes the `_evFilters` **key** and reads the live value for both the pressed state and the un-toggle; each pill carries `data-ev-val` for the sync to match on. Fixed in the same commit because the new blue fill would otherwise have made a dead second press visible
- **`scripts/verify-events-roles.py` gained a filter-pill pass** (+43 lines, after the star round-trip): Starred presses to `aria-pressed="true"` with a **computed background that differs from an untouched pill's** and the agenda down to the one starred row, presses again to clear; a Kind pill paints pressed with `_evFilters.kind` agreeing with its `data-ev-val`, and a second press clears it back to All. The assertion is on the **paint**, not the attribute alone. **Verified both ways** — with `evSyncPills()` commented out it fails with `pressed: 'false'`, the untouched background and `rows: 1` (the reported symptom exactly) and passes with it restored
- **The Plan-tab screenshots were diagnosed, not fixed** — see "Open findings"
- **The "Repo access denied" reminder was closed out** at the developer's explicit dismissal: moved to `## Completed Reminders` with a `2026-09-23 06:06:46 AM EST` completion stamp. The Routine fleet was **listed and verified against the reminder's plan before the entry moved**, and the evidence written into the completed entry

### Where we left off

**Both of the developer's items are closed and all three pushes merged.** The developer confirmed live that the Starred pill now fills blue. **Next is X** — D16's last row — with the §13.19 paste-in prompt; it is a decision before it is a build, and a reasoned "no" closes it as completely as a build does. Nothing from this session is pending.

### Open findings carried forward

- **The registry is thin, and that is what the Plan tab was showing.** Both events the developer screenshotted (`acp-recharge-2026`, `ocp-global-summit-2026`) read `0 booths · 0 sessions · 0 venues` because **neither row carries `venueLatLng`, `agendaUrl` or `hours[]`** and no Network signal names either slug. Coverage across the **96 upcoming rows: `venueLatLng` 26, `agendaUrl` 16, `hours[]` 2** (also `venue` 31, `exhibitorListUrl` 13, `speakersUrl` 10, `floorPlanUrl` 3). Every empty line names the input it is missing, so the tab renders a thin row faithfully rather than failing — **no code change**; the counts are recorded in CHANGELOG v07.26r under **Notes** so the next enrichment pass has them. This is an **E0/E4 parser pass**, the single biggest lever left on the Plan tab's usefulness
- **A dossier mention is not an attendance signal.** `ocp-global-summit-2026` carries nine Profiler `mentions[]` (amd, amperesand, flex, heron-power, megmeet, nvidia, vicor) and still lists no booths: `evPlanBooths_` reads only `rec.signalsBySlug[slug]`, i.e. Network signals. Behaving as designed under D9 / D16 — recorded because it reads as a bug and is not
- **E5's live check is now confirmed by the screenshots** — the Plan tab renders, the day plan frames each day, the open slots and **Book a meeting** are present, and ACP RECHARGE (Sep 22–24, today Sep 23) correctly shows **no Post-event section** because `not_over` holds until the day after `end`. The §13.18 brackets were never filled, but the tab has now been seen working
- **`Network.html` has no hash router**, so the post-event checklist's `Network.html#drafts?sourceEvent=<slug>` deep link opens the app without pre-filtering (the page says so beside the link)
- **`scripts/check-guidance-migration.js` fails on clean `origin/main`** ("expected 9 modules, got 28") — pre-existing, unrelated, still unpicked-up
- `check-classroom-pipeline.py` reports P1 findings against any non-Classroom diff — correct behaviour by its own docstring, not a defect
- The ROI line is **written once**; only a *mark* refreshes it — cards scanned after the first close-out never raise the recorded `cards`
- From E5 s1: no booth numbers on the day plan (an E4 parser follow-up); a plan build costs the full score and the close-out costs another
- From E4: RE+ 2026's roster is a Swapcard widget (`no_roster_found`); GlobeNewswire's feed unverified until a live sweep is read
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- **Fixed the root cause, not the reported symptom.** Copying the hand-set `aria-pressed` onto the Starred pill would have closed the ticket and left Kind / Region / Segment broken plus a fourth hand-maintained copy of the same logic. One `evSyncPills()` called from `evRender()` covers all five controls from one source of truth
- **The two hand-set calls were kept** (Chesterton's Fence): they are not redundant with the sync — they paint the pill *before* the async score fetch returns, and un-paint it when the fetch fails
- **The un-toggle bug was fixed in the same commit** even though it was not reported: with the pill now visibly filled, a dead second press would have become a *new* visible defect
- **The harness asserts the computed background, not `aria-pressed` alone** — the attribute is only a proxy for what the developer sees, and the pre-existing coverage gap was exactly that only `ev-f-rec` and `ev-f-signals` were ever asserted (which is why those two never drifted)
- **The reminder was moved to `## Completed Reminders`, not deleted** — the repo's documented form for a dismissal, which keeps the trail; the developer was told and can ask for a hard delete
- **Housekeeping commits take no version bump** (the reminders / session-context precedent): only the Events fix bumped `repository.version.txt`, to v07.26r

### Active context

- **Repo version v07.26r.** `CHANGELOG.md` **`Sections: 97/100`** — **rotation becomes mandatory above 100**, so it is roughly three pushes away; read the live counter rather than this line
- **Live versions:** `Events.html` **v01.11w** · `Events.gs` v01.09g · `Network.html` v01.24w · `Network.gs` v01.17g · `Scraper.gs` v02.22g. **No `.gs` changed this session — no redeploy needed**
- **The Routine fleet is six, all enabled, and was verified this session**: `trig_01TiCXzEjowZGbS7aB2e6gQS` Classroom C2 weekly `0 11 * * 3` (**fires 2026-09-23 11:07Z — first fire of the rebuilt Routine, its report is worth reading**); `trig_01HkrwpCULei8Gje6RGqcp1B` Profiler earnings desk weekdays (ran SUCCEEDED 2026-09-22); `trig_01FB8gN2Lb1cKqqq2rpnxJez` Profiler quarterly and `trig_01NCMufdiV7WcsXodUoimi7H` Profiler monthly drift, both next 2026-10-01; `trig_014KXj2GeUt9b46ycfZnffkj` Industry Guidance quarterly, next 2026-10-15; `trig_01GeTqB8xp5nG8FCC139Bgr9` ACL health daily (read-only, not rebuilt by design). The old desk `trig_01UyH77BMKJnxzBUZJ11ej6A` is **deleted**
- **One reminder remains active** — the **Megmeet SST briefing** before 2026-10-07. Its sequencing condition is the Network/Events build, which is **down to X alone**, so running X clears the last gate on the one deliverable with an external deadline
- **D13's deferral condition is still met** — all 58 rows of `events-sources.json` carry a `lastProbe` of 2026-09-21, so X is runnable
- **Playwright is not preinstalled in a fresh container** — `pip install playwright` only; the Chromium is already there, never run `playwright install`
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **X** with the §13.19 paste-in prompt on Fable 5.1 xhigh — it is D16's last row, its deferral condition is met, and closing it also clears the Megmeet briefing's sequencing condition with two weeks of slack before the 2026-10-07 start date.
- **To continue:** type `run X from §13.19`

Developed by: LightAISolutions
