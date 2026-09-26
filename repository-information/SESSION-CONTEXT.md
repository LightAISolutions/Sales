# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-25, 09:07 PM → 10:53 PM EST (unattended; one prompt, two pushes; context compacted once mid-session)
**Repo version:** v07.58r (two pushes: v07.57r wave 1, v07.58r wave 2)
**Branch:** `claude/magical-cerf-hwm62m`
**Model:** Fable 5.1 High (no substitution)

### What was done

- **Phase F sessions F-U1 + F-U2 — the five utilities — complete.** Five schema v7 dossiers, five v2 study guides and five lesson plans; `utility` is now 11 of 182 dossiers.
  - **v07.57r (wave 1):** `duke-energy` (116 sources), `dte-energy` (106), `wec-energy` (80). Brookfield's first Duke Energy Florida closing is **confirmed** (2026-03-03, 9.2%, $2.8B) — the §11.3 cell was wrong. The DTE Saline figure is stated both ways (1,383 MW approved vs the 332 MW the corpus carried). WEC's VLC docket is 6630-TE-113; Meta Beaver Dam is Alliant's.
  - **v07.58r (wave 2):** `berkshire-hathaway-energy` (88 sources; display name decided on the Southern Company precedent, NV Energy in `aka[]`) and `exelon` (106; seven photos). BHE's ">9 GW" is the FY2024 figure — the March 2026 presentation says ~11,000 MW. Exelon's 25-vs-36 GW conflict is definitional (36 = 4 TSA + 7 high-probability + 25 under study).
  - **Step 7:** `tract` v3→v4 (PUCN approved Fleet's 362 MW of gas plants 2026-09-17, not "scheduled 8 September"; the Morris ComEd TSA accepted 2026-03-10) and `powerhouse-data-centers` v2→v3 (FERC rejected ComEd's Joliet cancellation 2026-09-22). No other dossier changed.
  - **§11.3** F-U1 and F-U2 rows rewritten with premise verdicts; 13 + 13 concepts added; calendar rows for all five (WEC confirmed 10/29; the rest unconfirmed patterns or tracker estimates).

### Where we left off

- **Everything is pushed; wave 2's branch is in the auto-merge workflow.** The tree is clean after the push.
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

- Run a **Classroom session to re-pin `landscape-utilities-2026-09` and the three `scenario-utilities-*` lessons** against the eleven utility dossiers — the five new ones make the "six franchises" landscape and its rehearsals stale, and the 9/30 Classroom run is already on the reminders. Phase F's next Profiler session (F-U3, or F-I1 in parallel) can follow.

**To continue:** type `re-pin the utilities landscape and scenarios against the five new dossiers`

## Previous Sessions

### Session — 2026-09-25 07:59 PM → 09:02 PM EST (Phase F approved, the F-U1 + F-U2 prompt written, v07.56r)

**Date:** 2026-09-25, 07:59 PM → 09:02 PM EST (attended; three turns)
**Repo version:** v07.56r (one push; this save is unversioned)
**Branch:** `claude/brave-ritchie-un2qt1`

### What was done

- **A deep analysis of the corpus to fill the thin Profiler categories** (turn 1, research only, no commit). The categories stood at investor 5 · utility 6 · neocloud 7 · gc 7 · advisor 8 · hyperscaler 8, out of 177 dossiers.
  - **Corpus pull:** a word-bounded, alias-aware count of ~300 uncovered names across every dossier, study guide, report and `Classroom.gs`. The most-cited were ERCOT 73 dossiers, PJM 37, BlackRock/GIP 31, Exelon/ComEd 19, NV Energy/BHE 18 and KKR 18.
  - **Four parallel web-research subagents** checked candidate identity and buying authority. All four ran out of the session's 200-call search budget partway through.
- **The developer approved every recommended company.** v07.56r recorded them as **Phase F** in `PROFILER-COVERAGE-PLAN.md` §11:
  - 37 companies in 13 sessions: 11 utilities, 11 capital, 6 neocloud and landlord, 3 China hyperscaler, 3 GC/electrical, 3 advisor;
  - its own ledger in §11.3, with `Why` cells marked unverified;
  - the paste-in prompt for **F-U1 + F-U2** in §11.4: Duke, DTE, WEC, then Berkshire Hathaway Energy (NV Energy) and Exelon, run as two pushes on Fable 5.1 High.

### Where we left off

- **Everything is merged; the tree is clean.** The developer has the F-U1 + F-U2 prompt and is about to start it in a new session.
- **Suggested in parallel:** F-I1, BlackRock and KKR, on Opus 5.5 xhigh. It touches different dossiers. Its prompt is not yet written — ask for `give me the F-I1 prompt`.
- **Timed rows in §11.2:**
  - **F-N1** (Firmus, HUMAIN, G42/Khazna) — fold into the 10/1 neoclouds pass.
  - **F-H1** (ByteDance, Alibaba Cloud, Chindata) — before the 10/7 Megmeet start.
  - **F-I2** — after SoftBank's DigitalBridge close.
- **The Phase B Events work (#9a) and all dated reminders still stand**, unchanged by this session.

### Key decisions made

- **Ranking tests:** corpus pull, then buying authority (who signs for batteries, MV gear, generation or SSTs), then seat fit. `utilities` is the only segment in both sales seats, so utilities run first.
- **Tenants are replaced by their landlords.** Together AI, Vultr, TensorWave and Lightning were dropped for 5C/Hypertec and TECfusions. Most GCs were dropped for Clayco and the electrical integrators Faith Technologies and EMCOR.
- **ERCOT and PJM are held.** They are grid operators, and adding them would mean first using the empty `other` category. That is the developer's decision.
- **Excluded, with the reasons in §11.1:** GIC, Silver Lake, Partners Group, the banks, DigitalBridge, PG&E, SCE, Sempra, CenterPoint and FirstEnergy. Clean Energy Associates is already inside `intertek`.
- **Landscape coupling:** new members make `landscape-utilities-2026-09`, `landscape-capital-2026-09` and `landscape-neoclouds-2026-09` stale. A Profiler session records this and never edits `Classroom.gs`.

### Known issues

- **Drift candidates in existing dossiers** — agent-reported, unread, and carried in the utility prompt:
  - `powerhouse-data-centers`: FERC rejected ComEd's Joliet TSA cancellation on 22 Sep;
  - `tract`: the PUCN conditionally approved its gas plants, around 19 Sep;
  - `stack-infrastructure` / `oracle` / `jupiter-nm`: Oracle's force-majeure notice on Project Jupiter, 24 Sep.
- **Carried over:** `megmeet-briefing-prompt.md` names the 9/8 AIDC edition; `verify-profiler-roles.py` (2) and `check-events-plan.js` (2); the two aged 9/8 reports.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **CHANGELOG:** `Sections: 108/100`, 10 dated 9/25 and exempt. **The first push dated 9/26 or later must rotate** (after `git fetch --unshallow`).

### Recommendation for next session

- Run **Phase F sessions F-U1 + F-U2**, the five utilities, on **Fable 5.1 High** using the prompt in `PROFILER-COVERAGE-PLAN.md` §11.4. Utilities feed both sales seats, and three of the five buy batteries directly.

**To continue:** paste the prompt in `PROFILER-COVERAGE-PLAN.md` §11.4 into a fresh Fable 5.1 High session
