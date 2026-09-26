# Phase F action plan on Opus 5.5 — the remaining 32 companies, the Classroom waves, and the paste-in prompts

**Status (v07.63r, 2026-09-26):** F-H1 landed in v07.62r (row 1 of §3 done). §5 holds the F-N1 prompt, for xhigh.

**Written 2026-09-26 (v07.61r)**, the night the Classroom utilities re-pin landed (v07.60r). The developer asked for three things:
- every company still recommended for Profiler;
- an action plan to implement all of it, **on Opus 5.5**, with an effort level (medium, high or xhigh) per session;
- a paste-in prompt to start the plan.

This file is that answer. It **supersedes the Model column of `PROFILER-COVERAGE-PLAN.md` §11.2**, which assigned Fable 5.1 High to most sessions. Everything else in §7 and §11 still binds, including the §11.3 ledger each session flips and the landscape coupling.

## 1 · Every company still recommended

Source: `PROFILER-COVERAGE-PLAN.md` §11.3, the Phase F list the developer approved on 2026-09-25. It had 37 companies in 13 sessions. **F-U1 and F-U2 are done** (Duke, DTE, WEC, Berkshire Hathaway Energy, Exelon — v07.57r/v07.58r). That leaves **32 companies in 11 sessions**, plus two grid operators held for a decision.

**The ledger's "Why" cells are unverified hypotheses** — every session verifies its own rows. Dossier counts are the existing dossiers that name the company, which is the size of its step-7 reconciliation.

| Session | Companies (proposed slug) | Category · segment hypothesis | Dossiers naming it |
|---|---|---|---|
| **F-H1** | ByteDance / Volcano Engine (`bytedance`) · Alibaba Cloud (`alibaba-cloud`) · Chindata (`chindata`) | hyperscaler ×2, developer · `hyperscalers-and-ai-labs` / `aidc-developers-and-landlords` challengers | 3 · 4 · 3 |
| **F-N1** | Firmus Technologies (`firmus`) · HUMAIN (`humain`) · G42 / Khazna (`g42`) | neocloud · `neoclouds` challengers | 0 · 2 · 2 |
| **F-I1** | BlackRock / GIP / AIP (`blackrock`) · KKR (`kkr`) | investor · `capital` incumbents | 31 · 18 |
| **F-I2** | SoftBank Group (`softbank`) · SB Energy (`sb-energy`) · Blue Owl Capital (`blue-owl`) | investor, developer, investor · `capital`, `aidc-developers-and-landlords` | 9 · 0 · 9 |
| **F-U3** | PPL (`ppl`) · Pinnacle West / APS (`pinnacle-west`) · NiSource / NIPSCO (`nisource`) | utility · `utilities` incumbents | 5 · 12 · 4 |
| **F-U4** | Florida Power & Light (`florida-power-light`) · Salt River Project (`salt-river-project`) · Tennessee Valley Authority (`tva`) | utility · `utilities` incumbents (public power and federal — test the category) | 6 · 11 · 11 |
| **F-N2** | WhiteFiber (`whitefiber`) · 5C / Hypertec (`5c-group`) · TECfusions (`tecfusions`) | neocloud, developer ×2 | 0 · 0 · 0 |
| **F-G1** | Clayco (`clayco`) · Faith Technologies (`faith-technologies`) · EMCOR (`emcor`) | gc, epc ×2 · `epc-and-construction` | 4 · 0 · 0 |
| **F-I3** | Apollo (`apollo`) · Ares (`ares`) · Stonepeak (`stonepeak`) | investor · `capital` | 10 · 8 · 2 |
| **F-I4** | Quinbrook (`quinbrook`) · Energy Capital Partners (`energy-capital-partners`) · CPP Investments (`cpp-investments`) | investor · `capital` | 1 · 3 · 8 |
| **F-A1** | Anza (`anza`) · SemiAnalysis (`semianalysis`) · EPRI (`epri`) | advisor · `software-and-optimization` / none / `assurance` adjacents | 0 · 22 · 3 |
| *held* | ERCOT (`ercot`) · PJM Interconnection (`pjm`) | `other` — grid operators, not companies | 73 · 37 |

**Named elsewhere, not in Phase F and not approved:** Mitsubishi Electric. It is the one candidate the 2026-09-25 reminder names as outside the scope of the AIDC power-conversion report. Raise it with the developer when that report is re-run, not before.

**Excluded on 2026-09-25, and not to be re-proposed** (§11.1 gives the reasons): GIC, Silver Lake, Partners Group; Goldman Sachs, JPMorgan, Morgan Stanley; DigitalBridge (covered through SoftBank); PG&E, SCE, Sempra, CenterPoint, FirstEnergy; Together AI, Vultr, TensorWave, Lightning AI / Voltage Park; Clean Energy Associates; Cupertino Electric.

## 2 · How the effort levels were chosen

The rule comes from `PROFILER-COVERAGE-PLAN.md` §2's own evidence: **effort buys depth of reading, not care.** Premise-checking is prompt-driven — the Medium session F5 caught all three of its wrong premises. Opus's one clear edge in the Xcel head-to-head was reading depth on long first-party filings. So the effort level follows the document the session has to mine, not the importance of the company:

| Effort | Use it for | Sessions |
|---|---|---|
| **xhigh** | A long first-party record to mine, or a heavy step-7 reconciliation: 10-Ks, S-1s, IRPs and rate-case dockets, Chinese-language filings with conflicting figures, 18 or more inbound dossiers. Also a Classroom session that re-authors a landscape whose roster grew | F-H1, F-I1, F-I2, F-U3, F-U4, F-I3, the ERCOT/PJM session, the Megmeet refresh and AIDC power-conversion report, and the four Classroom waves |
| **high** | Private or thin-record subjects, where the dossier's value is inference and there is little long text to mine. Also scenario reframes, refresh passes and count corrections | F-N1, F-N2, F-G1, F-I4, the 10/1 neoclouds + Habitat pass, the Dominion reframe |
| **medium** | Bounded adjudication, where the rule is written and the judgment is whether one record matches another | F-A1, the 9/30 pipeline-run check, the CoolIT cooling recheck |

**Confidence note:** this is judgment, not measurement. The repo has never compared Opus 5.5's effort tiers against one another. If an xhigh session's output reads no better than a high one's, demote the rest of that tier.

**The landscape coupling, restated because it sets the Classroom waves:**
- A Profiler session never edits `Classroom.gs`.
- Every company that joins a segment makes that segment's `landscape-*` module, and the rehearsals pinned to it, stale.
- The fix is a Classroom session: the segment generator, then the G3 test on the landscape, then re-judging and re-pinning the scenarios. v07.60r is the worked example.
- The plan batches those sessions so that each landscape is re-authored once per wave, not once per company.

## 3 · The action plan, in order

Dates are verified weekdays. The plan interleaves the developer's standing reminders, because four of them are date-gated and two sessions (F-N1, F-H1) are timed to them.

**Stage 1 — before the Megmeet start (Saturday 2026-09-26 → Tuesday 2026-10-06)**

| # | When | Session | Effort | Why this slot |
|---|---|---|---|---|
| 1 | **Sat 9/26 or Sun 9/27** | **F-H1** — ByteDance, Alibaba Cloud, Chindata (Profiler) | **xhigh** | The only session tied to the developer's own start date: the China buyer side the `megmeet` dossier lacks, landed a week before 10/7 so it can be read. The record is opaque and partly in Chinese, and the capex figures conflict. **Prompt in §4.** |
| 2 | by **Tue 9/29** | **F-N1** — Firmus, HUMAIN, G42 (Profiler) | high | §11.2 asks for it before the 10/1 neoclouds pass, so `landscape-neoclouds-2026-09` is rewritten once. If it slips, fold it into row 6 |
| 3 | **Mon 9/28** or later | Cooling recheck after CoolIT's CDU launch (Classroom guidance) | medium | The standing reminder; `landscape-cooling-2026-09` has reviewBy 9/28 |
| 4 | **Mon 9/28 – Tue 9/29** | **F-I1** — BlackRock, KKR (Profiler) | xhigh | The most-cited uncovered company (31 dossiers); no date gate. If BlackRock's step 7 outgrows the session, split it off, as §11.2 allows |
| 5 | **Wed 9/30**, after ~7:30 AM ET | Check the 9/30 Classroom pipeline run (read-only) | medium | The standing reminder, re-requested on 9/26. Read the report and check whether a notification arrived |
| 6 | **Thu 10/1** or later | Neoclouds Profiler pass + `profiler Habitat Energy` (one Profiler session) | high | Both wait on filings due 9/30 (Fluidstack, Habitat Energy). **The 10/1 quarterly and monthly Profiler Routines commit that day — rebase first** |
| 7 | **Fri 10/2 – Tue 10/6** | **Classroom wave A** — re-author `landscape-neoclouds-2026-09` (F-N1 + row 6), `landscape-hyperscalers-and-ai-labs-2026-09` and `landscape-aidc-developers-and-landlords-2026-09` (F-H1, plus `tract` v4 and `powerhouse-data-centers` v3, already moved); regenerate segments; re-judge and re-pin their rehearsals | xhigh | Clears the stale modules before the job starts. If it runs long, split neoclouds off first: its module is overdue |
| 8 | **Fri 10/2 – Tue 10/6** | Reframe the Dominion rehearsal (Classroom, its own session) | high | The standing reminder, after the 10/1 solicitation issues. Also check the unverified "all-stock" merger description |

**Stage 2 — October**

| # | When | Session | Effort | Why this slot |
|---|---|---|---|---|
| 9 | once the DigitalBridge close is confirmed (expected about the end of September) | **F-I2** — SoftBank, SB Energy, Blue Owl (Profiler) | xhigh | SB Energy's S-1 is a long first-party record; SoftBank's dossier should be written once, after the close brings Vantage and Switch under it |
| 10 | by **Wed 10/14** | **Classroom wave B** — `landscape-capital-2026-09` (BlackRock, KKR, SoftBank, Blue Owl) and `scenario-capital-objection` | xhigh | `scenario-capital-objection` has reviewBy 10/14; re-author capital once, with four new members |
| 11 | mid-October | **F-U3** — PPL, Pinnacle West, NiSource (Profiler) | xhigh | Utilities are regulatory synthesis: IRPs, rate cases and tariffs. Pinnacle West's XHLF decision and RFP awards fall in December |
| 12 | mid-October | **F-U4** — Florida Power & Light, Salt River Project, TVA (Profiler) | xhigh | FPL must be tested against `nextera-energy-resources` under the one-slug rule. SRP and TVA test the category for public and federal power; TVA's large-load charge is effective 10/1 |
| 13 | after row 12 | **Classroom wave C** — `landscape-utilities-2026-09` (six more franchises) and the three `scenario-utilities-*` rehearsals | xhigh | The v07.60r pattern again, with seventeen franchises. The utilities module's reviewBy is **2 December** |
| 14 | after Megmeet's Q3 filing (due by **Sat 10/31**) | `profiler Megmeet`, then `profiler report competitive: AIDC power conversion` | xhigh | The standing reminder. Raise Mitsubishi Electric's scope question here |

**Stage 3 — November**

| # | Session | Effort | Note |
|---|---|---|---|
| 15 | **F-N2** — WhiteFiber, 5C (Hypertec), TECfusions | high | Establish 5C's legal entity (5C Group or Hypertec) at step 1a |
| 16 | **F-G1** — Clayco, Faith Technologies, EMCOR | high | Decide Faith Technologies' category (epc or supplier) on the record |
| 17 | **F-I3** — Apollo, Ares, Stonepeak | xhigh | Public records (10-Ks); Ares ties to `apex-clean-energy`, Apollo to Stream |
| 18 | **F-I4** — Quinbrook, Energy Capital Partners, CPP Investments | high | Quinbrook is `habitat-energy`'s parent; ECP is `proenergy`'s |
| 19 | **F-A1** — Anza, SemiAnalysis, EPRI | medium | SemiAnalysis may carry no segment; record it as unassigned if so |
| 20 | **Classroom wave D** — `landscape-epc-and-construction`, `landscape-in-hall-power`, `landscape-capital` (count correction), `landscape-neoclouds` and `landscape-aidc-developers` (count corrections), `landscape-software-and-optimization`, `landscape-assurance`; regenerate segments; re-pin rehearsals | xhigh | Closes §11.2's "done when" |
| 21 | **ERCOT and PJM** — decide, then one session | xhigh | See below |

**ERCOT and PJM — the one decision the developer owns.** **Recommendation: add both, in the unused `other` category, in one final session.**
- **Why:** they are the two most-cited uncovered entities in the corpus (73 and 37 dossiers). Curating them converts roughly 110 derived mentions into real edges, and their rules (Batch Zero and SB 6; the capacity auction) are what half the utilities and developers in the corpus are exposed to.
- **The cost:** the dossier schema fits a grid operator loosely. It has no product line or revenue expectation in the usual sense, and its ownership is member-governed. So the session should open with a one-paragraph schema note — `ownership.type`, a `financials` stance, no segment or an adjacent seat — written into `PROFILER-SCHEMA.md` before either dossier.
- **If you decline**, record the decision in §11.1 so it stops being re-proposed.

**Totals:**
- 32 companies in 11 Profiler sessions, plus one ERCOT/PJM session.
- 4 Classroom waves, plus the three standing Classroom and Profiler reminders.
- Effort mix across the 21 rows: **12 xhigh, 6 high, 3 medium**.

## 4 · Paste-in prompt — session 1, F-H1 (Opus 5.5 · xhigh)

**Run it in a fresh session on Opus 5.5 at xhigh.** Paste everything inside the block. It follows the §7 template and the §11.4 F-U prompt, with F-H1's substitutions.

```text
Picking up from my last session, run Phase F session F-H1 of
repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: ByteDance (Volcano Engine), Alibaba
Cloud and Chindata — the China buyer side the megmeet dossier lacks. This session runs on Opus 5.5 at
xhigh: on 2026-09-26 I decided Phase F runs on Opus 5.5, and repository-information/phase-f-action-plan.md
supersedes the Model column of §11.2. Write "Opus 5.5 xhigh" into your §11.3 Model cells.

WHY NOW: I start at Megmeet (Senior Sales Manager — SST Solutions) on Wednesday 2026-10-07. Land this
before then, with time for me to read it.

READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/phase-f-action-plan.md;
PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the three F-H1 rows of §11.3 are yours);
.claude/rules/profiler-app.md (Profiler Command including step 1a identity and step 7 reconciliation,
Profiler Prep Command, Scheduled Refreshes); repository-information/PROFILER-SCHEMA.md (Naming and
renames, Segments registry, Refresh calendar); repository-information/PROFILER-STYLES.md (active style).
Read the megmeet, zhonhen, delta-electronics and sinexcel dossiers and study guides — the supply side
these three buyers face — and the parts of
repository-information/study-prep/megmeet/megmeet-sst-briefing-print.html that name Chinese buyers.
Those are context only: cite primary sources, never the briefing.

THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
profileVersion 1) and study guide (schema v2) with its lesson plan under
repository-information/study-prep/<slug>/. Category hypotheses: bytedance ["hyperscaler"],
alibaba-cloud ["hyperscaler"], chindata ["developer"]. Populate aka[] BEFORE the step-7 grep, including
the Chinese names: ByteDance / Volcano Engine / 字节跳动 / 火山引擎; Alibaba Cloud / Alibaba Cloud
Intelligence / Aliyun / 阿里云; Chindata / 秦淮数据 / Bridge Data Centres. Assign segments in
live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis:
hyperscalers-and-ai-labs · challenger for the two hyperscalers; aidc-developers-and-landlords ·
challenger for Chindata). Then the registry sync, the graph build, a calendar row per company under the
Refresh calendar rules (Alibaba reports publicly — research its next results date; follow the private
rule for the others), README tree entries, and rewrite and flip your §11.3 rows.

IDENTITY (step 1a) — establish each of these, do not assume it:
- Alibaba Cloud: one slug for the cloud unit, or for Alibaba Group? Decide under Naming and renames and
  say why.
- ByteDance vs Volcano Engine: which entity buys data-centre power equipment.
- Chindata: current ownership (Bain Capital's 2023 take-private and anything after it), the reported
  Bridge Data Centres sale process (Bloomberg, 29 Jul 2026), and which entity operates Huailai.

THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
budget ran out partway, and nobody has read the underlying articles. Verify against first-party sources
(Alibaba's results filings, company releases, Chinese exchange and tender records where reachable),
record a premise verdict per clause, and rewrite the cells. Run these checks hardest:
- ByteDance's 2026 capex: three reports differ about 2x (RMB 160B / more than RMB 200B / up to $70B).
  State the conflict unless a primary source resolves it.
- Alibaba's Panama (10 kV to 240 VDC) is a line-frequency transformer-rectifier, not an SST. The zhonhen
  dossier already draws this line; keep it. Zhonhen's "~70% share" is secondary-source only.
- Chindata at Huailai (2 Jul 2026, for Meituan; HEC and Delta; 10 kV to 800 VDC): verify that it is a
  solid-state transformer and who supplied what.
- ByteDance's early-2026 HVDC tender and its 800 V pilot: the named suppliers (Kehua, Zhonhen — Kehua has
  no dossier) and whether any 800 V award is public.

RECONCILIATION (step 7) — expected inbound: ByteDance 3 (mgx, narada, zhonhen), Alibaba 4 (narada,
nscale, sungrow, zhonhen), Chindata 3 (amperesand, dg-matrix, stack-infrastructure). Grep again with the
full aka[], including the Chinese names. Check that megmeet, zhonhen, delta-electronics and sinexcel
agree with the new dossiers on every supplier and customer edge, and record the reciprocal types.

DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The three new members make
landscape-hyperscalers-and-ai-labs-2026-09 and landscape-aidc-developers-and-landlords-2026-09 stale,
and the scenario-hyperscalers-and-ai-labs-* and scenario-aidc-developers-and-landlords-* rehearsals with
them. Record that in the CHANGELOG entry and the SESSION-CONTEXT hand-off (§11.2, the landscape
coupling); Classroom wave A in the action plan re-authors them.

FOR THE MEGMEET START: in the SESSION-CONTEXT hand-off, write one short paragraph on what the three
dossiers change about the megmeet dossier's missing customer side. Do not edit the briefing files.

VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
warnings read; every new dossier and guide renders under Playwright with zero page errors. CHANGELOG
rotation only if non-exempt sections reach 100. Normal Pre-Commit and Pre-Push checklists; one commit;
push on a claude/* branch.
```

## 5 · Paste-in prompt — session 2, F-N1 (Opus 5.5 · xhigh)

**Written 2026-09-26 (v07.63r), after F-H1 landed.** §3 row 2 suggested high; the developer chose **xhigh**. Run it in a fresh session **by Tue 9/29**. It follows §4's F-H1 prompt, with F-N1's substitutions and the lessons F-H1 taught (reciprocal edges, back-sourced counterparties, lesson plans written incrementally).

```text
Picking up from my last session, run Phase F session F-N1 of
repository-information/PROFILER-COVERAGE-PLAN.md as a fresh session: Firmus Technologies, HUMAIN and
G42 (Khazna) — the neoclouds and AI-capacity builders that sign for their own campuses. This session runs
on Opus 5.5 at xhigh (the action plan suggested high; I am choosing xhigh). Write "Opus 5.5 xhigh" into
your §11.3 Model cells.

WHY NOW: §11.2 wants F-N1 landed before the 10/1 neoclouds pass, so landscape-neoclouds-2026-09 is
re-authored once, in Classroom wave A (Fri 10/2 – Tue 10/6). Do NOT run the neoclouds pass or
`profiler Habitat Energy` here — both wait on filings due 9/30 — and do not revise fluidstack.

READ FIRST: repository-information/SESSION-CONTEXT.md; repository-information/phase-f-action-plan.md;
PROFILER-COVERAGE-PLAN.md §2, §7 and §11 (the three F-N1 rows of §11.3 are yours; §11.1's
buying-authority test applies); .claude/rules/profiler-app.md (Profiler Command including step 1a
identity and step 7 reconciliation, Profiler Prep Command, Scheduled Refreshes);
repository-information/PROFILER-SCHEMA.md (Naming and renames, Segments registry, Refresh calendar);
repository-information/PROFILER-STYLES.md (active style). Read the coreweave, nebius, crusoe, fluidstack
and nscale dossiers and study guides as the house pattern for a neocloud, and the mgx, xai, amd,
terawulf, openai and oracle dossiers — they already name HUMAIN, G42, Khazna, Core42 or Stargate UAE.

THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7,
profileVersion 1) and study guide (schema v2) with its lesson plan under
repository-information/study-prep/<slug>/. Proposed slugs: firmus, humain, g42. Category hypotheses:
firmus ["neocloud"]; humain ["neocloud"] or ["hyperscaler"]; g42 ["neocloud"], ["hyperscaler"] or
["developer"] — decide each on the record and say why. Populate aka[] BEFORE the step-7 grep, including
brand and subsidiary names (Firmus: Sustainable Metal Cloud if it is Firmus's, HyperCube; G42: Group 42,
Khazna, Core42, Stargate UAE; HUMAIN: its Arabic name if it publishes one). Assign segments in
live-site-pages/profiler-data/profiler-segments.json with a basis line (hypothesis: neoclouds ·
challenger for all three; aidc-developers-and-landlords · challenger for Firmus and for G42 if Khazna
owns and builds its campuses). Then the registry sync, the graph build, a calendar row per company under
the Refresh calendar rules (Firmus: public if its ASX listing has happened by your run date — the ASX is
reachable from the sandbox — otherwise the private rule; HUMAIN and G42 private), README tree entries,
and rewrite and flip your §11.3 rows.

IDENTITY (step 1a) — establish each of these, do not assume it:
- Firmus: the operating and listing entity, how Sustainable Metal Cloud relates to it, which company owns
  and builds the Australian and Malaysian campuses, and the status of the Benmax acquisition.
- HUMAIN: its ownership (PIF), and which entity signs for data-centre power equipment — HUMAIN itself, a
  joint venture, or a design-build contractor it appoints. Decide neocloud or hyperscaler.
- G42: one slug for the group, or a separate one for Khazna? Decide under Naming and renames and say
  why. Establish Khazna's and Core42's ownership, Microsoft's stake in G42, and who signs for Stargate
  UAE's power equipment.

THE §11.3 WHY CELLS ARE HYPOTHESES, NOT A BRIEF. They come from web research on 2026-09-25 whose search
budget ran out partway, and nobody has read the underlying articles. Verify against first-party sources
(company releases, the ASX, government and regulator records, the counterparties' own filings), record a
premise verdict per clause, and rewrite the cells. Run these checks hardest:
- Firmus: >900 MW contracted (8 Sep 2026) with OpenAI as the Malaysian anchor; the Benmax purchase
  (A$300M); the Gunvor 600 MW supply deal tied to 1.5 GWh of storage; the ASX IPO timing; ClusterMAX 3.0
  Silver.
- HUMAIN: 1.9 GW by 2030 and Al Sa'ad 1 GW phase 1 by 2027; xAI 500 MW+ and Together AI 250 MW
  (31 Aug 2026); the design-build awards to MIS; ClusterMAX "Unavailable".
- G42: Khazna building Stargate UAE (1 GW inside a 5 GW campus) with long-lead equipment for the first
  200 MW procured — who procured it, and from whom; Core42 as TeraWulf's 60 MW tenant; the UAE's move to
  Country Group A:5 (Jul 2026) and what it changed.
For each company, record the §11.1 buying-authority verdict: does it, or a platform it controls, sign for
batteries, MV gear, generation or SSTs?

RECONCILIATION (step 7) — expected inbound: Firmus 0; HUMAIN 2 (amd, xai); G42 4 (mgx, terawulf, and
openai and oracle through "Stargate UAE"). Known alias collisions, not inbound: hyperstrong's "HyperCube"
is HyperStrong's own product line, and dg-matrix's "Inception" is NVIDIA's startup programme. Grep again
with the full aka[]. Check every inbound dossier for the reciprocal edge — in F-H1 the delta-electronics
dossier did not name a customer it had launched a product with — and where one is missing, revise that
dossier under the Archival Procedure and re-verify any report pins on it. Check microsoft and nvidia for
a missing G42 or HUMAIN edge too.

LESSONS FROM F-H1 — apply them:
- Every supplier, customer or partner named in narrative prose rests on a source in sources[], ideally
  the counterparty's own filing. F-H1 had to back-source two such claims before commit.
- A tender is not an award. An unattributed figure is stated as unverified, never as fact.
- Write each lesson plan skeleton-first, then Edit (.claude/rules/behavioral-rules.md, Incremental
  Writing, item d).
- If an existing study guide contradicts a verified finding, correct it minimally and record it.

DO NOT edit googleAppsScripts/Classroom/Classroom.gs. The new members make landscape-neoclouds-2026-09
and the scenario-neoclouds-discovery rehearsal stale — and landscape-aidc-developers-and-landlords-2026-09
further, if Firmus or G42 join that segment. Record that in the CHANGELOG entry and the SESSION-CONTEXT
hand-off (§11.2, the landscape coupling); Classroom wave A re-authors them.

FOR THE MEGMEET JOB: in the SESSION-CONTEXT hand-off, write one short paragraph on whether any of the
three signs for medium-voltage or DC power equipment (SSTs, 800 VDC, HVDC), and what that means for an
SST seller.

VERIFY: check-source-reachability.py before planning Stage 2; sync-profiler-registry.py --check clean;
build-profiler-graph.py; check-profiler-study.py, check-profiler-relationships.py and
check-profiler-crossrefs.py clean (accept reviewed candidates with a reason); check-profiler-reports.py
warnings read; every new dossier and guide renders under Playwright with zero page errors other than the
sandbox's gis_load_failed. CHANGELOG rotation only if non-exempt sections reach 100. Normal Pre-Commit
and Pre-Push checklists; one commit; push on a claude/* branch.
```

Developed by: LightAISolutions
