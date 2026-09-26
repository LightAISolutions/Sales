# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-26 01:26 AM → ~03:10 AM EST (one attended prompt, run unattended; context compacted once mid-session)
**Repo version:** v07.62r (one push)
**Branch:** `claude/relaxed-shannon-q4fc02`
**Model:** Opus 5.5 at xhigh, per the developer's 2026-09-26 decision

### What was done

- **v07.62r — Phase F session F-H1**, the China buyer side the `megmeet` dossier lacks:
  - **Three dossiers (v1) and study guides (v2), each with a lesson plan:** `bytedance` (hyperscaler; Volcano Engine in `aka[]`), `alibaba-cloud` (hyperscaler; the cloud unit, not the Group — the `nextera-energy-resources` precedent), `chindata` (developer; Chindata China under HEC since 2026-01-16 — Bridge Data Centres is Bain's separate company).
  - **Segments:** the two hyperscalers → `hyperscalers-and-ai-labs` · challenger; Chindata → `aidc-developers-and-landlords` · challenger.
  - **Calendar:** `alibaba-cloud` 2026-11-24 (unconfirmed — no results date announced); the other two private, quarterly, core.
  - **17 new concepts** (1,520 total), among them `panama-power`, `phase-shifting-transformer`, `line-frequency-transformer`, `240vdc`, `delta-connection`, `approved-vendor-list`, `framework-procurement`.
  - **Reciprocal edges:** `zhonhen` v8→v9 (customers Alibaba Cloud, ByteDance) and `delta-electronics` v6→v7 (customers Alibaba Cloud, Chindata — v6 named neither, nor Panama). Both report pins re-verified.
  - **`zhonhen.study.json`:** one bullet that called Panama an SST corrected to transformer-rectifier.
  - **§11.3:** the three F-H1 rows flipped (Opus 5.5 xhigh, Checked v07.62r, Dossier v1, Guide v2) with a premise verdict per clause.
- **Premise verdicts, in one line each:**
  - ByteDance capex — **about 3×, not 2×**, and unresolved (RMB 160B / >RMB 200B / up to US$70B).
  - The 30–40% HVDC share and tens-of-MW 800 V pilot — **not supported** (one unattributed expo post); **no 800 V or SST award is public**; Kehua is **not** named in ByteDance's chain, Zhonhen is (precision distribution).
  - Panama — **a transformer-rectifier, not an SST** (held); Zhonhen's ~70% — **unverifiable**.
  - Chindata's Sangyuan SST — **a true SST** on its makers' description; 'first' holds only as **first in commercial operation** (Eaton/VNET pilot since end-2024).
- **Verification:** registry sync clean; study, relationships, crossrefs and README-tree checkers clean; reports checker shows only the two old warnings; Playwright renders all three new dossiers and guides plus revised Zhonhen and Delta with zero console errors (only the sandbox's `gis_load_failed`).

### What the three dossiers change about Megmeet's missing customer side

The `megmeet` dossier names no Chinese customer, and these three do not supply one: no ByteDance, Alibaba or Chindata record — and no Megmeet, Sinexcel or Kehua filing — links Megmeet to any of them. What they add is the map of the doors. **ByteDance** buys its own Volcano Engine campuses' chain from domestic distribution, UPS and substation makers (Kstar, TGOOD, Mingyang, Jinpan, Sifang, Far East, Zhonhen), rents most of its capacity from landlords who tender UPS from its qualified-vendor list, and its 800 V move is still a tender with no award — the open door, if anyone's. **Alibaba** specifies Panama, a 50 Hz transformer-rectifier bought by framework from Zhonhen and Delta; its halls are only 'compatible' with 800 V, and its one SST conversation is Sungrow's joint innovation centre — an incumbent to displace, not an SST base. **Chindata** is China's one SST reference in commercial operation (Delta's SST at Sangyuan, for Meituan), writes its own specifications, says it will localise SST core components with domestic makers, and has a new owner (HEC) that puts its own capacitors and coolants into the bill of materials, with about RMB 4.75B of M&E earmarked — the landlord-as-specifier door a domestic SST maker would knock on first.

### Where we left off

- **Status:** v07.62r pushed at close; the tree is clean.
- **Next (action plan):** F-N1 (Firmus, HUMAIN, G42) at high by Tue 9/29; F-I1 (BlackRock, KKR) at xhigh Mon 9/28 – Tue 9/29. No paste-in prompt exists for either yet — §4 of `phase-f-action-plan.md` holds only F-H1's, which is the template.
- **Dated items:**
  - CoolIT cooling recheck on or after Mon 9/28.
  - 9/30 Classroom run check after ~7:30 AM ET on Wed 9/30.
  - Neoclouds pass + `profiler Habitat Energy` on or after Thu 10/1 (rebase first — the 10/1 Profiler Routines commit that day).
  - Dominion reframe and **Classroom wave A** Fri 10/2 – Tue 10/6.
  - Megmeet start Wed 10/7 — read the three new guides before then.
- **Stale and not yet re-authored (Classroom.gs untouched, by design):**
  - `landscape-hyperscalers-and-ai-labs-2026-09` (+ByteDance, +Alibaba Cloud) and `landscape-aidc-developers-and-landlords-2026-09` (+Chindata, on top of `tract` v4 and `powerhouse-data-centers` v3), and the `scenario-hyperscalers-and-ai-labs-*` and `scenario-aidc-developers-and-landlords-*` rehearsals. Classroom wave A re-authors them.
  - `build-classroom-segments.py --check`: **12 due** — those two segments with real section changes, nine with only the `where-it-sits` roster count, `insurance-and-risk-transfer` pin-only.

### Key decisions made

- **Alibaba's slug is the cloud unit** (`alibaba-cloud`), not the Group: it is the only data-centre-buying part and a reported segment; Group names live in `aka[]`.
- **ByteDance is one group slug**; Volcano Engine is the name its campuses are bought under, not a separate buyer.
- **Chindata means Chindata China** under HEC; Bridge Data Centres is out of scope except as context.
- **A tender is not an award.** Unattributed figures (the HVDC share, the 800 V pilot, Zhonhen's share of Panama) are stated as unverified, never as fact.

### Known issues

- **Not edited:** `study-prep/zhonhen/zhonhen-interview-brief.md` still calls Panama's device class an SST in two lines (92, 177). It is a private file, outside the scope; the in-app guide was corrected.
- **README archive tree:** about 60 archive files that predate this session (e.g. `zhonhen.profile.v4`/`v7`, `delta-electronics.profile.v2`) are not listed. This session added only its own two.
- **Carried over:**
  - The ERCOT/PJM decision still awaits the developer.
  - The two aged 9/8 reports still warn.
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2).
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 185 dossiers, 185 guides, 1,520 concepts, 1,583 graph edges. **CHANGELOG** `Sections: 88/100`.

### Recommendation for next session

- Run **F-N1 (Firmus, HUMAIN, G42)** on Opus 5.5 at high before Tue 9/29, so `landscape-neoclouds-2026-09` is re-authored only once in Classroom wave A. First ask for its paste-in prompt, written from the F-H1 prompt in §4 of `phase-f-action-plan.md`.

**To continue:** type `write the F-N1 prompt`

## Previous Sessions

### Session — 2026-09-25 11:11 PM → 2026-09-26 01:25 AM EST (the Classroom re-pin and the Phase F action plan, v07.60r–v07.61r)

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
