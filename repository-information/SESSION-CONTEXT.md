# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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



## Previous Sessions

### Session — 2026-09-23 03:15 AM EST (E5 session 2, v07.25r)


**Date:** 2026-09-23 03:15 AM EST (the session ran ~02:40 → 03:15 AM EST)
**Repo version:** v07.25r — one push on `claude/compassionate-ritchie-q8bgj1` (E5 session 2), plus a second push for this session-context write and the X brief
**Branch:** `claude/compassionate-ritchie-q8bgj1`
**Model:** Opus 5 (E5 session 2 — the post-event checklist, the ROI line and the `events plan` command; **E5 is Done**)

### What was done

- **E5 session 2 landed, closing E5** (`Network.gs` v01.17g · `Events.gs` v01.09g · `Events.html` v01.10w; §11's E5 row → **Done**; §13.19 written — the X brief with its paste-in prompt):
  - `Network.gs`: `nop=interaction`'s read leg widened with **`eventSlug=`** — the live contacts whose `Source Event` is the slug (with `accountName`, the account's `stage` at read time and **one** `mailable` boolean instead of the two consent columns) and the `meeting` Interactions on the slug, each carrying an inferred `held` (a later `note` / `email-out` on the same contact within 14 days) and the developer's explicit `mark`. Both derived on Network's side — a boolean and a three-value word are strictly less data than the rows behind them. Mark rows are excluded from the touches that feed the inference, or a "not held" mark would read as a later touch and invert itself. `NW_PEER_INTERACTION_KINDS` gained `note` for the mark write; the two mark phrases are mirrored byte for byte in `Events.gs` and the mirror is asserted
  - `Events.gs`: `eop=postevent` (the checklist + the ROI line written **once** into the event's `Plans` row; `not_over` before the day after `end`; the booth accounts from the score run once with the past slug's signals kept via a new `extraSlug` argument — no dossier read, no agenda, no Overpass), `eop=posteventmark` (the verdict as a `note` Interaction with the `mt-` id as evidence; an explicit mark beats the inference both ways; refreshes the row over one read-leg call, never a second score), `eop=plannarrative` (the Drive URL onto the row; the audit carries a flag, never the URL), and the score's seventh term **`priorRoi`** — `min(1, (cards + 3·held + 5·moves) / 40)` from an earlier edition of the same series, seeded at 0.05
  - `Events.html`: the **Post-event** section at the top of the Plan tab once today > `end`, with Mark held / not held per meeting, the follow-up link, the ROI line as recorded, a Narrative link field, and **Copy plan as JSON**
  - The **`events plan <event>` command rule** in `.claude/rules/events-app.md` + its CLAUDE.md pointer, and the **first narrative plan** for **RE+ 2026** at `repository-information/plans/re-plus-2026-narrative-plan.md` and in the developer's Drive
- **A real bug caught by a sibling harness**: the new past-slug filter kept rows with an **empty** event slug (a docket, a press quote) when no extra slug was named. `check-events-signals.js` failed on it; fixed with an explicit guard and an assertion added
- `scripts/check-events-plan.js` **100 → 151 checks**; `verify-events-roles.py` gained a post-event pass (screenshot `events-postevent.png`, 390×844, zero page errors); `check-events-score.js` / `check-events-signals.js` updated for the seventh term; `check-network-schema.py`'s audit allow-list gained two count keys
- `EVENTS-SCHEMA.md` §5 / §6 / §8 / §10 and `NETWORK-SCHEMA.md` §8 updated; CHANGELOG `Sections: 96/100`

### Where we left off

**The developer's live check is next** (reported, not asserted): redeploy Events (`v01.09g`) and Network (`v01.17g`), open a **past** starred event's Plan tab, read the checklist and the ROI line, mark one meeting held and find the note on that contact in Network, then press **Copy plan as JSON** and paste it back with `events plan <slug>` for a real narrative plan (the RE+ one was written from the public half only). **Then X** with the §13.19 paste-in prompt — Fable 5.1 xhigh, decide before building.

### Open findings carried forward

- **`Network.html` has no hash router**, so the checklist's `Network.html#drafts?sourceEvent=<slug>` deep link opens the app without pre-filtering. The page says so beside the link; a small Network-side route would close it — left out rather than widen this session into `Network.html`
- **The four live-state brackets in the §13.18 prompt were pasted unfilled**, so E5 session 1's live check remains unconfirmed by a session. This is now the second prompt in a row where that happened
- **`scripts/check-guidance-migration.js` fails on clean `origin/main`** ("expected 9 modules, got 28") — pre-existing, unrelated to this session, and nobody has picked it up
- `check-classroom-pipeline.py` reports P1 findings against any non-Classroom diff; by its own docstring it is "the judge a C2 pipeline run is held to", so that is correct behaviour and not a defect
- The ROI line is **written once** and only a *mark* refreshes it — cards scanned after the first close-out open never raise the recorded `cards`. Faithful to the brief; worth revisiting if it bites
- Carried from E5 s1: no booth numbers on the day plan (an E4 parser follow-up); only two registry rows carry `hours[]`; a plan build costs the full score and the close-out costs another
- From E4: RE+ 2026's roster is a Swapcard widget (`no_roster_found`); GlobeNewswire's feed unverified until a live sweep is read
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- **`lost` is not a stage move** although `NW_STAGES` orders it past `prospecting` — a terminal negative would let a show that produced only losses read as productive in next year's prior. `EV_ROI_STAGES_MOVED` is an explicit list and the departure is documented in `EVENTS-SCHEMA.md` §6
- **`held` and `mark` are computed on Network's side**, not shipped as rows — the minimum-necessary reading of D9, and the only way the checklist counts cards *and* meetings without a second op
- **Copy plan as JSON sits in the plan head as well as the Post-event section.** The brief placed it only in the close-out, but the narrative plan is most use *before* a show — and the brief's own step 4 asks for a plan for RE+ 2026, which is upcoming and has no Post-event section
- **Network's audit rows stay counts-only** — the slug was dropped from `peer_interaction_event_read` to match the app's own convention; the Events side already audits it
- The narrative plan was written from the **public half** because no JSON was pasted, and says so throughout rather than guessing at booths

### Active context

- **Repo version v07.25r.** `CHANGELOG.md` `Sections: 96/100` — no rotation due until 100
- **Live versions:** `Events.html` v01.10w · `Events.gs` v01.09g · `Network.html` v01.24w · `Network.gs` v01.17g · `Scraper.gs` v02.22g
- **D13's deferral condition is met** — all 58 rows of `events-sources.json` carry a `lastProbe` dated 2026-09-21, so X is runnable
- **Reminders still open** (developer's own — untouched): close out "Repo access denied" and rebuild the committing Routines (**C2 fires today, Wed 2026-09-23 04:00 PDT**); the Megmeet briefing before 2026-10-07 — **the Network/Events build is now down to X, so its sequencing condition is nearly met**
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **X** with the §13.19 paste-in prompt on Fable 5.1 xhigh — it is D16's last row, it is a decision before it is a build, and a reasoned "no" closes it just as completely as a build does.
- **To continue:** type `run X from §13.19`
