# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-29 07:52 PM → 08:45 PM EST (Phase F session F-U3: PPL, Pinnacle West, NiSource — the write thread of a three-thread project row; one attended turn)
**Repo version:** v07.74r → v07.75r (two pushes: the F-U3 landing, then the F-U4 prompt + this hand-off)
**Branch:** `claude/awesome-galileo-8qrhfo`
**Model:** Fable 5.1 at High (per `phase-f-action-plan.md` §3 row 3)

### What was done

- **Three new dossiers (v1) with v2 study guides and lesson plans:** `ppl`, `pinnacle-west`, `nisource` — all `utility`, all `utilities` · incumbent; PPL and NiSource `storage-developers-and-ipps` · adjacent. Written from the hand-off's §5 verified notes only (no research subagents); the six NiSource gaps in its §3.2 were closed one fetch at a time (Quanta, Zachry, the NiSource news archive, EDGAR index + FY2025 10-K, the GenCo explainer). The shell had outbound HTTPS through the proxy, so the fetches ran as `curl` reads, not summarizer calls.
- **Identity finding:** NiSource is a **Delaware** corporation per the 10-K cover (EDGAR's company record shows IN for NIPSCO's own CIK); 801 East 86th Avenue, Merrillville; 7,668 full-time employees. Pinnacle West: Geisler is Chairman, President and CEO since Apr 1, 2025 — no split president found. PPL: FY2025 10-K not read; FY2024 employees used.
- **Step 7:** PPL 8 / Pinnacle West 12 / NiSource 5 dossiers grepped by alias; one change — `quanta-services` v5→v6 ('~3 GW CCGT' → 2 × 1,300 MW CCGT + 400 MW BESS, reciprocal `nisource` edge). One relationships finding accepted (`nisource × ppl`, both `other`).
- **13 concepts** added (`xhlf`, `ring-fencing`, `jurisdictional-declination`, `four-hour-battery`, `reimbursement-agreement`, `default-service`, `emergency-order-202c`, `equity-forward`, `peak-demand`, `pumped-storage`, `service-territory`, `weather-normalized`, `cooling-degree-day`); `stay-out` exists under `rate-freeze`.
- Calendar rows unconfirmed: `ppl` ~11/05, `pinnacle-west` ~11/03, `nisource` ~10/28. §11.3 rows rewritten and flipped; `phase-f-action-plan.md` row 3 landed with the project-threads note. Checkers all clean; Playwright six routes zero errors.
- **No CHANGELOG rotation on either push** — 101 raw / 94 non-exempt with seven 2026-09-29 sections exempt after the hand-off push. **The first push dated 2026-09-30 EST or later rotates the 2026-09-20 group (v06.75r–v06.82r, 8 sections) with SHA enrichment** (full SHAs resolve on the deep clone).

### Where we left off

- **Phase 1 (to Sat 10/3, 7:00 AM ET), remaining in order:** the 9/30 Classroom run check (Opus 5.5 medium, after ~7:30 AM ET Wed); F-U4 (FPL, SRP, TVA — Fable High; the `public-power` and federal-utility category tests); the neoclouds pass + `profiler Habitat Energy` on Thu 10/1 (rebase first); F-I4; F-G1; F-A1.
- **Classroom lessons now stale, by design (`Classroom.gs` untouched):** `landscape-utilities-2026-09` is eight franchises behind (Duke, DTE, WEC, BHE, Exelon, PPL, Pinnacle West, NiSource) plus the three `scenario-utilities-*` rehearsals — wave C (row 16, week 3).
- **For the Megmeet job — MV and DC power equipment.** None of the three buys an SST, 800 VDC or a battery directly today. **NiSource/GenCo is the lead:** four gas turbines and two steam turbines with no named OEM go through the Quanta–Zachry EPC JV (Zachry leads procurement), and GenCo itself buys the 400 MW / 1,600 MWh Mitchell battery (supplier unnamed) due January 1, 2027. **PPL:** the Kentucky RFP (50–400 MW storage, bids Sep 3, 2026) and the E.W. Brown battery (an unread Burns & McDonnell page names Tesla Megapacks — verify); Invitium's batteries may be hyperscaler-owned. **APS:** the account is the developer bidding into the 2025 all-source RFP (awards by year-end), whose toll terms (365 cycles, 50% SOC) are the spec; APS names no OEM anywhere.

### Key decisions made

- Rotation followed the CHANGELOG-archive rule (today's sections exempt) over the hand-off's expectation; recorded in the entry.
- Relationships to counterparties were added one-way (inbound evidence shows in the graph); only `quanta-services` got a reciprocal edge, because it was revised for a contradiction anyway. Corpus-only claims (Invenergy, Tract, Compass, DNV, Talen) carry label sources naming the dossier.
- Two NiSource developments with an unsourced day-of-month (the 202(c) order, the July Alphabet approval) were kept in policy/prose and dropped from `recentDevelopments[]`.

### Known issues

- Pre-existing: the four report pin warnings (`fluence` v10, `jupiter-power` v7, `jinko` v6, `oracle` v6); `verify-profiler-roles.py` (2) and `check-events-plan.js` (2) carried over; `duke-energy` v1 `sources[]` order.
- The PPL EHLF threshold (100 MW per LPM vs 50 MVA on the deck) is stated unreconciled; the PPL FY2025 10-K should be read on the next pass now that sec.gov answers.
- The harness pre-created `claude/awesome-galileo-8qrhfo` on the remote at `origin/main`'s SHA; Pre-Push #5 treated it as safe because it carried no commits.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 196 dossiers, page v01.93w (unchanged). **Classroom:** GAS v01.93g, page v01.16w. **CHANGELOG** `Sections: 101/100` (seven 2026-09-29 sections exempt, 94 non-exempt) — **the next push dated 9/30 or later rotates the 2026-09-20 group.**
- **Active reminders (5):** the neoclouds pass, the Dominion reframe, `profiler Habitat Energy`, the AIDC power-conversion re-run, and the 9/30 run check.

### Recommendation for next session

- **Check the 9/30 Classroom pipeline run first (after ~7:30 AM ET), then run F-U4 (Florida Power & Light, Salt River Project, TVA) on Fable 5.1 High** with the paste-in prompt saved at `PROFILER-COVERAGE-PLAN.md` §11.5 (written at the end of this session, v07.75r); it decides FPL's slug on the record, writes the public-power and federal category tests as schema notes, and carries the rotation due on the first push dated 9/30 or later.

**To continue:** paste `PROFILER-COVERAGE-PLAN.md` §11.5 into a fresh Fable 5.1 High session, or type `run F-U4`.

## Previous Sessions
**Date:** 2026-09-29 04:00 PM → 07:52 PM EST (Phase F session F-N2: WhiteFiber, 5C Group, TECfusions; then the Projects question and this save; three attended turns)
**Repo version:** v07.73r (one push; this save is a no-bump housekeeping commit)
**Branch:** `claude/busy-mendel-eey850`
**Model:** Fable 5.1 at High (per `phase-f-action-plan.md` §3 row 1)

### What was done

- **Three new dossiers (v1) with v2 study guides and lesson plans:** `whitefiber` (`neocloud` · `developer`), `5c-group` (`developer`), `tecfusions` (`developer`). Six research subagents (first-party and third-party per company); EDGAR was reachable, so the WhiteFiber, Nscale and Apex Treasury filings were read directly.
- **Identity findings that moved the brief:**
  - WhiteFiber is a Cayman company on the Nasdaq Capital Market; Bit Digital holds **59.9%** after the Aug 2026 note exchange (was ~70%); NC-1 is owned through Enovum NC-1 Bidco, which holds the Duke Energy Carolinas letter (24/40/99 MW) and the assigned ESA.
  - 5C's legal entity is **5C AI Group Inc.** (Quebec), spun out of Hypertec in April 2025; Hypertec is the largest shareholder, Brookfield the structured-equity investor; one slug, display name '5C Group'. Crusoe is a second Springfield tenant.
  - Keystone Connect is the **former Alcoa/Arconic campus in Upper Burrell, PA**, not Clarion; TECfusions' US$4.0B SPAC with Apex Treasury is signed, not closed (no S-4); its founder's prior convictions are a disclosed risk factor; 2 MW live against 3 GW marketed.
- **Step 7:** 0 inbound for all three (the '5C' hits are C-rates). `nscale` v1→v2 gains the `whitefiber` supplier edge; `duke-energy` v1→v2 gains the `whitefiber` customer edge and its `nscale` edge is retyped to the site's tenant. Tenant mentions (Together AI, Vultr, TensorWave) contradicted nothing; no slug created for them.
- **Segments:** `neoclouds` +whitefiber (challenger), +5c-group (adjacent); `aidc-developers-and-landlords` +all three (challengers); `bridge-and-on-site-generation` +tecfusions (adjacent). Calendar: whitefiber public (`nextReport` 2026-11-12, unconfirmed), the other two private core. 15 concepts added, none edited. §11.3 rows rewritten with verdicts; `phase-f-action-plan.md` marks F-N2 landed.
- **Checkers all clean**; the four report warnings (`fluence`, `jinko`, `jupiter-power`, `oracle`) are pre-existing. Playwright: five dossiers and guides render with only `gis_load_failed`.
- **Projects (beta) evaluated and set aside.** After the push, the developer asked how to move the whole expansion plan into Claude Code Projects. Read from [code.claude.com/docs/en/claude-projects](https://code.claude.com/docs/en/claude-projects): a coordinating conversation that spawns cloud threads sharing repositories, ≤16,000-character instructions and a `MEMORY.md`; threads default to Opus high, open one draft PR each and run in parallel, all overridable by instruction text; permission rules from `.claude/settings.json` reach threads only in a one-repository project. The developer tried it: an Opus 5.5 project thread committed `6586795d` (`WebFetch` and `WebSearch` added to the allow list) and the developer committed `be55df2a` on GitHub.com (about 320 `WebFetch(domain:…)` entries). The threads still stopped for web-fetch permission, so the developer **switched back to individual sessions**.

### Where we left off

- **Both settings commits sit on `main` without a CHANGELOG entry, a version bump or a README timestamp** (they bypassed the claude/* flow). The next push commit should record them under `### Changed` in its version section (`.claude/settings.json` — the allow list now pre-approves `WebFetch`, `WebSearch` and the domain entries). Whether those entries also cut prompts in ordinary sessions is untested.
- **Phase 1 (to Sat 10/3, 7:00 AM ET), remaining in order:** the 9/30 Classroom run check (Opus 5.5 medium, after ~7:30 AM ET Wed); F-U3 and F-U4 (Fable High); the neoclouds pass + `profiler Habitat Energy` on Thu 10/1 (rebase first); F-I4; F-G1; F-A1 (Fable Medium, first to roll).
- **Classroom lessons now stale, by design (`Classroom.gs` untouched):** `landscape-neoclouds-2026-09` (10 → 12 members) and `scenario-neoclouds-discovery`; `landscape-aidc-developers-and-landlords-2026-09` (+3 challengers); `landscape-bridge-and-on-site-generation-2026-09` (+tecfusions adjacent). Wave A (row 9, Sat 10/3 – Tue 10/6) takes the first three; wave D (row 17) takes the fourth. `build-classroom-segments.py --check` reads 19 of 19 due.
- **For the Megmeet job — MV and DC power equipment.** All three sign for medium-voltage gear behind the meter, and none has touched an SST, 800 VDC or a battery. **WhiteFiber is the lead:** it buys switchgear, transformers, UPS, generators and cooling behind a Duke-owned substation, and the one documented failure of that authority is 'certain medium-voltage switchgear components' that pushed its US$865M lease a quarter (supplier unnamed; resolved Q3 2026); its next 60–200 MW (Yadkin County, 2027) is the order book to watch. **5C** owns its 138 kV substation at Springfield, so it buys the step-down transformers as well as the switchgear, plus 19 diesel gensets and 'prefabricated power skids'; an SST would sit inside that customer-owned scope at its next campus. **TECfusions** buys generation, switchgear and UPS directly but has 2 MW live and no vendor named. For an SST seller the realistic door is a retrofit landlord with a demonstrated MV bottleneck (WhiteFiber) or a customer-owned substation (5C), pitched as the step-down stage; nothing in the three records asks for 800 VDC today.

### Key decisions made

- WhiteFiber carries two categories on the record (`neocloud`, `developer`); 5C gets `neoclouds` adjacent for its own cloud line; TECfusions takes the bridge-generation adjacent seat on 'currently powered by turbines'.
- Display name '5C Group', never bare '5C' (collision test). No reciprocal edge on `crusoe` (the tenancy rests on WYSO and a state tax record only); one-way edges elsewhere show as inbound evidence.
- Three colliding concept aliases were dropped rather than existing concepts edited.
- **Developer (07:4x PM):** the expansion plan stays on individual pasted-prompt sessions, not Projects, because project threads could not bypass the web-fetch permission prompts. F-U3 runs next as a fresh Fable 5.1 High session with a prompt the developer pastes.

### Known issues

- Pre-existing: `duke-energy` v1's `sources[]` was already out of date order at one entry (2026-04 before 2026-04-01); left as found.
- The WhiteFiber Q3 2026 date (2026-11-12) is an aggregator estimate; confirm in early November.
- Carried over: `verify-profiler-roles.py` (2) and `check-events-plan.js` (2); `megmeet-briefing-prompt.md` names the 9/8 AIDC edition; `zhonhen-interview-brief.md` calls Panama an SST in two lines; the study-guide PDF renderer is not in the repo; `check-classroom-content.py`'s 8 segment-roster errors wait for waves A/B; report pin warnings `fluence` v10, `jupiter-power` v7, `jinko` v6, `oracle` v6.
- Old row numbers in `REMINDERS.md` (9/26 plan): 9/30 check row 2, neoclouds pass row 5, Dominion row 10, wave B row 15.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 193 dossiers, page v01.93w. **Classroom:** GAS v01.93g, page v01.16w, 19 segment lessons due. **CHANGELOG** `Sections: 99/100` — **the next push commit rotates.**
- **Active reminders (5):** the neoclouds pass, the Dominion reframe, `profiler Habitat Energy`, the AIDC power-conversion re-run, and the 9/30 run check.

### Recommendation for next session

- **Run F-U3 (PPL, Pinnacle West, NiSource) in a new Fable 5.1 High session**, with a prompt adapted from `PROFILER-COVERAGE-PLAN.md` §11.4 (its model line set to Fable 5.1 High, the three F-U3 rows of §11.3 as the hypotheses, and the F-N2 lessons from `phase-f-action-plan.md` §7 carried over). Open with `git fetch origin main` and a rebase: `main` moved twice after v07.73r. The CHANGELOG rotates on that push (99/100).

**To continue:** paste the F-U3 prompt into a new Fable 5.1 High session.
