# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-25 11:11 PM → 2026-09-26 01:25 AM EST (attended; two turns)
**Repo version:** v07.61r (two pushes: v07.60r the Classroom re-pin; v07.61r the Phase F action plan and this save)
**Branch:** `claude/wonderful-planck-ufx3aq`

### What was done

- **v07.60r — the Classroom re-pin**, run from `classroom-utilities-repin-prompt.md`:
  - **Part A could not run.** The 9/30 C2 Routine had not fired yet (`next_run_at` 2026-09-30T11:02Z).
  - **Segments:** the generator regenerated the 17 segment lessons `--check` listed with section changes; the 2 pin-only ones were left alone.
  - **`landscape-utilities-2026-09`**, revised under G3: eleven franchises read as variants of five instruments; NRG second and Vistra seventh by revenue behind Duke; thirteen bets and nine new indicators; the seller's play now two questions (the instrument, and who owns the asset under it). `reviewBy` 2027-01-01 → **2026-12-02**, the PUCN's statutory decision on NV Energy's IRP and LLESA.
  - **`landscape-storage-developers-and-ipps-2026-09`:** count-only correction (38 members, 11 adjacent, twelve ownership events).
  - **Rehearsals:** all five resting on the two landscapes were re-judged (every beat holds) and re-pinned; `scenario-utilities-discovery-aidc` `reviewBy` → 2026-12-02.
  - **Versions:** Classroom GAS v01.92g; the CHANGELOG rotated (9/18 + 9/19 groups, 26 sections, SHA-enriched). The push was held past midnight EST so it was dated 9/26.
- **v07.61r — this turn:**
  - A reminder to check the 9/30 run.
  - **`repository-information/phase-f-action-plan.md`:** the 32 remaining Phase F companies in 11 sessions, plus ERCOT and PJM held; an Opus 5.5 effort level per session; a 21-row dated order interleaving the standing reminders and four Classroom waves; and the paste-in prompt for session 1, F-H1.
  - A pointer at `PROFILER-COVERAGE-PLAN.md` §11.2 marking its Model column superseded.

### Where we left off

- **Status:** v07.60r is merged and v07.61r pushed at close; the tree is clean.
- **Next:** session 1 of the action plan, **F-H1** (ByteDance, Alibaba Cloud, Chindata), on xhigh. The prompt is §4 of the action plan.
- **Dated items:**
  - CoolIT cooling recheck on or after Mon 9/28.
  - 9/30 run check after ~7:30 AM ET on Wed 9/30.
  - Neoclouds pass + `profiler Habitat Energy` on or after Thu 10/1. The 10/1 Profiler Routines commit that day, so rebase first.
  - Dominion reframe Fri 10/2 – Tue 10/6, and Classroom wave A by Tue 10/6.
  - Megmeet start Wed 10/7.
- **Stale and not yet re-authored:**
  - `landscape-aidc-developers-and-landlords-2026-09`: `tract` v4 and `powerhouse-data-centers` v3 moved beneath it; not examined.
  - The capital, neoclouds, hyperscalers, epc, in-hall, software and assurance landscapes go stale as their Phase F members land; the Classroom waves in the action plan re-author them.

### Key decisions made

- **Phase F runs on Opus 5.5** (the developer, 2026-09-26). Effort follows reading depth:
  - **xhigh** for long first-party records, heavy reconciliation and landscape re-authoring.
  - **high** for thin-record private subjects, reframes and refresh passes.
  - **medium** for bounded adjudication: F-A1, the run check and the CoolIT recheck.
- **F-H1 runs first**: it is the only session tied to the developer's own 10/7 start. F-N1 can fold into the 10/1 neoclouds pass if it slips.
- **ERCOT and PJM:** recommended to add both in `other` after a one-paragraph schema note. **This awaits the developer's decision.**
- **The utilities review date** is the first dated decision that fixes an instrument's terms. Hearings, elections, filing deadlines, month-part windows and deliverables are not.

### Known issues

- The re-pin brief's OEM line was wrong (Duke names GE Vernova turbines); recorded in v07.60r.
- A pre-existing CHANGELOG blank-line irregularity above v07.14r was left as is.
- Carried over: the two aged 9/8 reports still warn; `verify-profiler-roles.py` (2) and `check-events-plan.js` (2); `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **CHANGELOG** `Sections: 87/100`; `Classroomgs.changelog.md` 44/50.
- **Classroom:** content checker 0 errors / 0 warnings at 71 lessons; `build-classroom-segments.py --check` shows 2 due, both pin-only.

### Recommendation for next session

- Run **session 1 of the Phase F action plan — F-H1 (ByteDance, Alibaba Cloud, Chindata)** in a fresh Opus 5.5 session at **xhigh**, using the prompt in §4 of `repository-information/phase-f-action-plan.md`, on Saturday 9/26 or Sunday 9/27. It is the only Profiler session tied to the Megmeet start on Wednesday 10/7.

**To continue:** paste the prompt in §4 of `repository-information/phase-f-action-plan.md` into a fresh Opus 5.5 session set to xhigh

## Previous Sessions

### Session — 2026-09-25 09:07 PM → 11:09 PM EST (Phase F F-U1 + F-U2, the five utilities; the Classroom re-pin prompt, v07.57r–v07.59r)

**Date:** 2026-09-25, 09:07 PM → 11:09 PM EST (one unattended prompt with two pushes, then one attended turn; context compacted once mid-session)
**Repo version:** v07.59r (three pushes: v07.57r wave 1, v07.58r wave 2, v07.59r the Classroom re-pin prompt + this save)
**Branch:** `claude/magical-cerf-hwm62m`
**Model:** Fable 5.1 High (no substitution)

### What was done

- **Phase F sessions F-U1 + F-U2 — the five utilities — complete.** Five schema v7 dossiers, five v2 study guides and five lesson plans; `utility` is now 11 of 182 dossiers.
  - **v07.57r (wave 1):** `duke-energy` (116 sources), `dte-energy` (106), `wec-energy` (80). Brookfield's first Duke Energy Florida closing is **confirmed** (2026-03-03, 9.2%, $2.8B) — the §11.3 cell was wrong. The DTE Saline figure is stated both ways (1,383 MW approved vs the 332 MW the corpus carried). WEC's VLC docket is 6630-TE-113; Meta Beaver Dam is Alliant's.
  - **v07.58r (wave 2):** `berkshire-hathaway-energy` (88 sources; display name decided on the Southern Company precedent, NV Energy in `aka[]`) and `exelon` (106; seven photos). BHE's ">9 GW" is the FY2024 figure — the March 2026 presentation says ~11,000 MW. Exelon's 25-vs-36 GW conflict is definitional (36 = 4 TSA + 7 high-probability + 25 under study).
  - **Step 7:** `tract` v3→v4 (PUCN approved Fleet's 362 MW of gas plants 2026-09-17, not "scheduled 8 September"; the Morris ComEd TSA accepted 2026-03-10) and `powerhouse-data-centers` v2→v3 (FERC rejected ComEd's Joliet cancellation 2026-09-22). No other dossier changed.
  - **§11.3** F-U1 and F-U2 rows rewritten with premise verdicts; 13 + 13 concepts added; calendar rows for all five (WEC confirmed 10/29; the rest unconfirmed patterns or tracker estimates).

- **Turn 2 (v07.59r):** the paste-in prompt for the Classroom re-pin session, `repository-information/classroom-utilities-repin-prompt.md` — Part A the 9/30 C2 run check (the standing reminder, now carrying a fold-in pointer), Part B segment regeneration by the generator, Part C the landscape module under G3 with the five new bets and gates, Part D the three rehearsals re-judged and re-pinned (the Dominion room reframe stays its own 10/2–10/6 reminder), Part E checkers, GAS bump, CHANGELOG rotation.

### Where we left off

- **Everything is merged through v07.58r; v07.59r is pushed.** The tree is clean after the push.
- **Classroom is now stale, by design:** `landscape-utilities-2026-09` was built on "six franchises" and there are eleven; the three `scenario-utilities-*` rehearsals cite it. `Classroom.gs` was not touched. A Classroom session should re-pin them against the five new dossiers.
- **Unreconciled figures left loud:** Oracle "~$300M" vs DTE "nearly $2B"; MasTec's "$4.2B Greenlink West" vs BHE's $4.2B combined; Exelon's TSA-backed load ~8 GW → 4 GW with collateral flat at ~$1B; Compass Hoffman Estates energization.
- **CHANGELOG did not rotate:** both pushes were dated 2026-09-25 EST (110 sections, 12 exempt, 98 non-exempt). The next push after midnight EST must rotate the 2026-09-18 and 2026-09-19 groups (26 sections) after `git fetch --unshallow`.

### Key decisions made

- **BHE display name:** "Berkshire Hathaway Energy", `ownership.type: subsidiary`, `financials.type: private`, calendar row dated from the 10-Q pattern (2026-11-06, unconfirmed).
- **Segments:** all five `utilities` · incumbent; `storage-developers-and-ipps` · adjacent for Duke, DTE, WEC and BHE (utility-owned or tolled storage is material); **not** for Exelon (owns none; revisit on ACE Pittsgrove's ~Feb 2027 decision).
- **Photos:** none for Duke (site 403) or BHE (site blocked); DTE's Paul dropped after two 502s.
- **Three concepts dropped** on checker collisions (their terms were already aliases of `capacity-market`, `planning-reserve-margin`, `vertically-integrated-utility`).

### Known issues

- The two aged 9/8 reports (`jinko`, `oracle` pins) still warn; `verify-profiler-roles.py` (2) and `check-events-plan.js` (2) carried over; `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.
- Not found for any of the five: a battery or turbine OEM (except Reid Gardner's BYD/Energy Vault and DTE's LG Energy Solution); PacifiCorp's Utah SB 132 counterparty; PECO's large-load tariff filing; Maryland's PC72 terms.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **CHANGELOG:** `Sections: 110/100`, 12 dated 9/25 and exempt — rotation due on the first push dated 9/26 or later.
- **Phase F remaining (§11.2):** F-U3 onward for utilities, F-I1 (BlackRock, KKR) suggested in parallel on Opus 5.5 xhigh, F-N1 folded into the 10/1 neoclouds pass, F-H1 before the 10/7 Megmeet start.

### Recommendation for next session

- On or after Wednesday 9/30 (after ~7 AM ET), run the **Classroom re-pin session** from `repository-information/classroom-utilities-repin-prompt.md` in a fresh Opus 5.5 xhigh session — it re-pins `landscape-utilities-2026-09` and the three `scenario-utilities-*` rehearsals against the eleven utility dossiers and folds in the 9/30 C2 run check. `build-classroom-segments.py --check` already reads `utilities` and `storage-developers-and-ipps` due with section changes. Phase F's next Profiler session (F-U3, or F-I1 in parallel) can follow.

**To continue:** paste `repository-information/classroom-utilities-repin-prompt.md` (everything below its rule) into a fresh Opus 5.5 xhigh session on or after 9/30
