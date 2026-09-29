# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-29 03:19 PM → 03:51 PM EST (the Phase F position check, the model question, the Fable-first re-plan, the F-N2 prompt; five attended turns)
**Repo version:** v07.72r (two pushes: v07.71r the Fable-first re-plan; v07.72r the phase names, the F-N2 prompt and this save)
**Branch:** `claude/brave-franklin-2qiehm`
**Model:** Opus 5.5 at xhigh

### What was done

- **"Run F-I1" was stale.** F-I1 had already landed at v07.66r on 9/26 (`blackrock` and `kkr` v1, 28 inbound dossiers revised). Nothing was re-run.
- **Model per session, corrected mid-session.** My first answer (Fable at high for every heavy session) came from Anthropic's general docs. The repo's own Xcel head-to-head (`PROFILER-COVERAGE-PLAN.md` §2) points the other way for filing-heavy work: Opus read the 10-K more deeply, and Fable had a narrow edge on sourcing and relationship discipline. The plan now follows that evidence.
- **v07.71r — `phase-f-action-plan.md` re-planned Fable-first by budget week.**
  - §2 restores the Opus/Fable split with a model and effort per session, and records measured session values from `get_session`'s `usage.cost_usd`:
    - New dossiers cost $28–$52 a company (F-H1 $102, F-N1 $84, F-I1 $104 on Opus 5.5; F-U1 + F-U2 $222 for five on Fable).
    - A light refresh costs about $7 a company (Habitat Energy + Gridmatic, $13).
    - A deep refresh can cost more than a whole session (Megmeet v8, $129).
  - **The Fable half is about $1,200 a week**, a floor: the week of 9/19–9/26 spent about $1,180 across 25 Fable sessions before the weekly warning. That is about seven heavy Fable sessions a week. The week resets **Saturday 7:00 AM ET**. The 50% share of one shared limit is re-verified against the help centre.
  - §3 is 18 sessions (14 Fable, 4 Opus), with new dossiers ahead of the Classroom waves. Everything except the Megmeet refresh lands by 10/17, not late November.
  - `PROFILER-COVERAGE-PLAN.md` §11.2 records the reversal, and the ERCOT/PJM Model cells are filled in.
- **v07.72r — the five phases are named in §3, and the F-N2 prompt is written as §7** (Fable 5.1 High). Inbound was measured on 9/29: no dossier names WhiteFiber, 5C, Hypertec or TECfusions. The only "5C" hits are a battery C-rate in seven cell-maker dossiers.

### Where we left off

- **Phase 1 (to Sat 10/3, 7:00 AM ET), in order:**
  1. **F-N2** on Fable 5.1 High, tonight or Wed. The prompt is in `phase-f-action-plan.md` §7.
  2. The 9/30 Classroom run check on Opus 5.5 medium, after about 7:30 AM ET Wed.
  3. F-U3, then F-U4 (Fable High).
  4. The neoclouds pass + Habitat Energy on Thu 10/1 (Fable High; rebase after the 10/1 Routines commit).
  5. F-I4, then F-G1 (Fable High).
  6. F-A1 (Fable Medium), the first to roll into week 2.
- **Phase 2 (Sat 10/3 – Tue 10/6):** wave A (Fable xhigh) and the Dominion reframe (Fable High), before the Megmeet start on Wed 10/7.
- **Phase 3 (to Sat 10/10):**
  - F-I2 (Opus xhigh) by 10/7 either way. As of 9/29 no DigitalBridge completion notice was found; if it is still pending, the dossier records the deal as pending.
  - F-I3 (Opus xhigh), ERCOT (Fable xhigh) and PJM (Fable High).
- **Phase 4 (to Sat 10/17):** waves B (by 10/14), C and D, all Fable xhigh.
- **Phase 5:** the Megmeet refresh and AIDC report (Opus xhigh), after the Q3 filing (due by 10/31).
- **Prompts:** only F-N2 has one. Each later session adapts the nearest prompt, per the §3 note, with the row's model line.

### Key decisions made

- **Developer:** spend the weekly Fable allowance in full. The 9/26 all-Opus rule is withdrawn.
- F-U3, F-U4 and PJM run at High, not xhigh, as F-U1/F-U2 did.
- F-I2 may be written before the DigitalBridge close, and a targeted refresh adds the close later. The approved wave-B fallback (move the scenario's reviewBy to 11/6 if the deal hasn't closed by 10/7) is kept unchanged.
- Profiler sessions run one at a time; `MULTI_SESSION_MODE` stays Off.

### Known issues

- **Old row numbers:** `REMINDERS.md` (the 9/30 check says "row 5") and the older entry below cite the 9/26 plan's rows. The re-plan's numbers: 9/30 check row 2, neoclouds pass row 5, Dominion row 10, wave B row 15. The reminders were left untouched.
- **Budget:** the $1,200 is inferred from one week, since the warning threshold is not published. On F-U1/F-U2, $183 of the $222 was uncached input on Fable; the cause is unexplained. Check it first if Fable runs short.
- **Carried over:**
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2).
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.
  - `zhonhen-interview-brief.md` calls Panama an SST in two lines.
  - The study-guide PDF renderer is not in the repo.
  - `check-classroom-content.py` has 8 segment-roster errors, waiting for waves A/B.
  - Pin warnings: `fluence` v10, `jupiter-power` v7, `jinko` v6, `oracle` v6.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 190 dossiers, page v01.93w. **Classroom:** GAS v01.93g, page v01.16w, 19 segment lessons due. **CHANGELOG** `Sections: 98/100`.
- **Budget:** as of 9/29 3:30 PM, about $41 of Fable used this week (another project).
- **Active reminders (5):** the neoclouds pass, the Dominion reframe, `profiler Habitat Energy`, the AIDC power-conversion re-run, and the 9/30 run check.

### Recommendation for next session

- **Run F-N2 (WhiteFiber, 5C, TECfusions) in a new Fable 5.1 High session with the prompt in `phase-f-action-plan.md` §7**, tonight or Wed 9/30 before the 9/30 check. It is row 1 of phase 1 and must land before Classroom wave A on 10/3.

**To continue:** paste the §7 prompt of `phase-f-action-plan.md` into a new Fable 5.1 High session.

## Previous Sessions

### Session — 2026-09-29 07:19 AM → 03:13 PM EST (the cooling recheck and the CoolIT refresh, v07.69r–v07.70r)

**Date:** 2026-09-29 07:19 AM → 03:13 PM EST (the cooling recheck, then the CoolIT refresh; three attended turns)
**Repo version:** v07.70r (two pushes: v07.69r the cooling recheck; v07.70r the CoolIT refresh and the reminder dismissal). This save is housekeeping, with no version bump
**Branch:** `claude/friendly-cori-mm3leo`
**Model:** Opus 5.5

### What was done

- **v07.69r — the cooling recheck** (row 3 of `phase-f-action-plan.md`). **CoolIT's next-gen CDU did not launch on 28 Sep, and there is no new date.** Read on 9/29:
  - CoolIT's news feed has no launch post.
  - Its CDU catalogue still tops out at the 2 MW CHx2000.
  - The teaser page, last modified 25 Sep, now offers an undated "official unveiling".
  - Its OCP 13–15 Oct page shows only "the proven CHx2000".
  - The developer chose **revise now** (my recommendation, over "wait until 9/30" or "reviewBy 19 Oct"). `landscape-cooling-2026-09` changed as follows:
    - reviewBy 9/28 → **10/27**, Ecolab's Q3 results before market open (22 Sep release). It is the nearest dated gate on this subject and no other module uses it.
    - Indicators row 1 is now undated, and row 3 is the review date.
    - The ledger and drill card teach the slip.
    - The indicators sales note now names both regulatory rows inside twelve months: the November tariff and the **1 Jan 2027 data-centre refrigerant limit**. That was a contradiction left by the 9/24 review.
    - Classroom GAS moved to **v01.93g**, and the analysis file gained a "29 September 2026 recheck" section.
- **v07.70r — the CoolIT refresh** (dossier v2 → **v3**, v2 archived), run the same day rather than on Thursday:
  - All seven 28 Sep mentions now record the slip. The date is traced to CoolIT's LinkedIn post of 22 Sep ("Launching September 28.").
  - Seven developments added:
    - the slip
    - the DCF Calgary tour (about 950 staff, about 200,000 sq ft, a 6 MW test rig)
    - the Globe and Mail's Top Growing Companies 2026 (#168 of 375, 156% growth, 813 staff)
    - a BofA estimate via Benzinga (over USD 500M revenue entering 2027), marked second-hand
    - the single-phase white paper and the fanless post
    - Ecolab's **SC26 Investor Day on 17 Nov**, which the 9/04 dossier missed
  - Indicators now include OCP (13–15 Oct), Ecolab Q3 (27 Oct) and SC26 (17 Nov). Ken Lau is **General Manager, APAC**. NVIDIA's first DSX Ready CDUs came from LG, LiquidStack and Vertiv, not CoolIT. Sources went 151 → 162.
  - The same correction went into `coolit.study.json`, the lesson plan and the refresh notes. The calendar's `lastRefreshed` is 9/29.
  - Step 7: 4 dossiers (13 hits) mention CoolIT. All are accurate and none mentions the launch, so none changed.
- **Reminders:** both cooling reminders (24 Sep and 26 Sep) moved to Completed, dismissed by the developer.

### Where we left off

- **Status:** v07.69r and v07.70r are merged; this save is pushed at close.
- **Action plan:** rows 1–4 of §3 are done. Next is **row 5**: check the 9/30 Classroom pipeline run after about 7:30 AM ET on Wed 9/30.
- **Classroom:** `build-classroom-segments.py --check` now reads **19 due**, up from 17. The graph rebuild moves every segment's graph pin, and `cooling` was already due. Wave A/B regenerates them. Expect the 9/30 run's report to list more due items than its reminder predicts.
- **Dated items:**
  - Thu 10/1: the neoclouds pass and `profiler Habitat Energy`. Rebase first, because the 10/1 Profiler Routines commit that day.
  - Fri 10/2 – Tue 10/6: the Dominion reframe and Classroom wave A.
  - Wed 10/7: the Megmeet start, and the DigitalBridge fallback check (row 10).
  - Oct 13–15: OCP. 10/15: the quarterly guidance Routine. 10/27: Ecolab Q3, the cooling module's new reviewBy. 11/17: the SC26 Investor Day.

### Key decisions made

- **A slipped launch with no new date:** the module's reviewBy moves to the nearest dated gate on the same subject (Ecolab Q3), not to a guessed venue. I passed over OCP because tying the launch to it is an inference and CoolIT's page names only the CHx2000. I passed over the Texas 19 Oct update because it is about water permits, not cooling equipment. The 15 Oct Routine is the backstop.
- **One commit per revision:** I held the CoolIT commit through a stop-hook prompt until the research agent returned, rather than landing a partial v3 and then a same-day v4.
- **Left as is:** the cooling module's ledger cites `profile:coolit @ v1` with "the dossier still states the 28 September date". That is accurate for v1. It waits for the module's next revision rather than a second Classroom bump the same day.
- **Kept out:** a vendor blog's claim that CoolIT is on a 2 Sep NVIDIA CDU list was not verifiable and stayed out of the dossier.

### Known issues

- **Undated launch:** CoolIT's next-gen CDU has no date. Nothing flags a surprise launch before the 10/15 Routine; OCP and SC26 are the likely venues.
- **Carried over:**
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2), as before.
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.
  - `zhonhen-interview-brief.md` still calls Panama an SST in two lines.
  - The study-guide PDF renderer is not in the repo.
  - `check-classroom-content.py` has 8 known segment-roster errors, waiting for wave A/B.
  - Pin warnings: `fluence` v10, `jupiter-power` v7, `jinko` v6, `oracle` v6.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 190 dossiers, 190 guides, 1,555 concepts, 1,656 graph edges (1,253 curated); page v01.93w; the reachability probe reads OK.
- **Classroom:** GAS v01.93g, page v01.16w. **CHANGELOG** `Sections: 96/100`.
- **Active reminders (5):** neoclouds pass, Dominion reframe, `profiler Habitat Energy`, the AIDC power-conversion re-run, and the 9/30 run check.

### Recommendation for next session

- **Check the 9/30 Classroom pipeline run after about 7:30 AM ET on Wed 9/30** (row 5 of `phase-f-action-plan.md`; the 2026-09-26 01:21 AM reminder). Open the Routine's session and read the final `CLASSROOM PIPELINE — 2026-09-30 — …` report, and check whether a push or email notification arrived. Expect the due list to include the 19 segment lessons.

**To continue:** type `check the 9/30 Classroom run`
