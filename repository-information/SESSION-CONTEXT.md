# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-26 (F-N1; one attended turn, context compacted mid-session)
**Repo version:** v07.64r
**Branch:** `claude/determined-curie-8zhg3t`
**Model:** Opus 5.5 at xhigh, per the developer's choice for F-N1

### What was done

- **v07.64r — Phase F session F-N1**, the neoclouds and AI-capacity builders that sign for their own campuses:
  - **Three dossiers (v1) and study guides (v2), each with a lesson plan:**
    - `firmus`: neocloud. Firmus Grid Limited, trading as Firmus Technologies; **unlisted** on 26 Sep, so its calendar row follows the private rule.
    - `humain`: neocloud, **not** hyperscaler. Legal name Future Artificial Intelligence Co.; PIF-owned.
    - `g42`: developer + neocloud. One group slug, with Khazna and Core42 in `aka[]`.
  - **Segments:**
    - `neoclouds` · challenger for all three.
    - `aidc-developers-and-landlords`: `g42` challenger (Khazna); `firmus` and `humain` **adjacent** — each builds for its own cloud and leases no shells. Firmus was hypothesised as a challenger there.
  - **Calendar:** all three private, quarterly, core, each with a source and a `watch[]` list.
  - **19 new concepts** (1,539 total), among them `power-train`, `exclusive-supply-agreement`, `work-order`, `early-contractor-involvement`, `bulk-supply-point`, `mva`, `maximum-demand`, `country-group`, `approved-recipient`, `end-use-controls`, `site-hardening`, `nvl72`, `clustermax`.
  - **13 executive photos** (5 Firmus, 8 G42), all company-published.
  - **Step 7:** eight inbound dossiers revised under the Archival Procedure for missing reciprocal edges:
    - `amd` v2, `mgx` v3, `terawulf` v8, `openai` v6, `oracle` v6, `microsoft` v5 and `nvidia` v11: edges added only.
    - `xai` v5: its 'trade reporting also cites a $3B HUMAIN investment' is closed with HUMAIN's own 18 Feb 2026 confirmation.
    - No inbound claim contradicted the new dossiers.
  - **Report pins:** `openai` and `xai` were re-verified on the named-project report.
  - **Ledger and plan:** the three §11.3 rows are flipped and `phase-f-action-plan.md`'s status line updated.
- **Premise verdicts, in one line each:**
  - Firmus: 900 MW contracted — **a sales figure**, against two operating sites. Owns its campuses — **in part** (Melbourne sits in CDC's building). 'Builds the electrical content' — **refined**: Maas Group's JLE is 'the exclusive supplier of power train units for Firmus' Australian pipeline'. Benmax — **not closed** by 26 Sep. Gunvor 1.5 GWh — **held**. IPO 22 Oct — **as reported**.
  - HUMAIN: MIS design-build — **superseded** by a 250 MW EPC under HUMAIN work orders (20 Sep). Al-Saad 1 GW by 2027 — **unreconciled** against the NYT's 250 MW. The rest held as targets or frameworks.
  - G42: Stargate UAE long-lead equipment — **held**, with no supplier or signing entity named. The A:5 move — **held, with the rider the hypothesis missed**: the named approval expires 6 Apr 2027 unless G42 and Core42 become US companies.
- **Verification:**
  - The registry sync, study, relationships, crossrefs and README-tree checkers are all clean.
  - The reports checker shows only the two pre-existing pin warnings (`jinko`, `oracle`).
  - Playwright results are in the CHANGELOG entry.

### Does any of the three sign for MV or DC power equipment? (the Megmeet paragraph)

None of the three has signed for an SST, 800 VDC or HVDC equipment on the record, and only Firmus names a power-equipment supplier at all (JLE for its Australian power trains; Eaton's EnergyAware platform under its UPS). The nearest thing to a DC opening is **G42's Khazna**, the group's buyer, which signed a memorandum with Siemens on 15 Sep 2026 to 'continue to progress next-generation 800 VDC power architectures'. That is engineering intent, not an award, and the one recorded conversation belongs to an incumbent. Stargate UAE's first-phase long-lead equipment is already bought, so the door is the next 800 MW, Khazna's more-than-1 GW pipeline, and any redesign the reported dispersal across the UAE forces. **HUMAIN** buys through its EPC contractor (MIS, under HUMAIN work orders) and through partners, to 'robotic, modular' lowest-total-cost designs. An SST seller has to be accepted into the design by HUMAIN and its advisers, then win the contractor's purchase order, and US chip licences, not power, pace how fast that demand arrives. **Firmus**'s Australian power train is locked to JLE, so the entries there are as a tier-2 supplier to JLE, the Wesley Vale behind-the-meter battery trial (the DC side of a backup design), and the Batam and Malaysian Vera Rubin sites, which the exclusivity does not reach. Net for an SST seller: no reference customer among the three yet; one live 800 VDC conversation, held by Siemens; and two buyers whose doors run through intermediaries.

### Where we left off

- **Status:** v07.64r pushed at close as one commit; the tree is clean.
- **Next (action plan):** F-I1 (BlackRock, KKR) at xhigh, Mon 9/28 – Tue 9/29. It has no paste-in prompt yet; §4 and §5 of `phase-f-action-plan.md` are the templates. BlackRock is the most-cited uncovered company (31 dossiers), so its step-7 reconciliation is the heavy part.
- **Dated items:**
  - CoolIT cooling recheck on or after Mon 9/28.
  - 9/30 Classroom run check after ~7:30 AM ET on Wed 9/30.
  - Neoclouds pass + `profiler Habitat Energy` on or after Thu 10/1 (rebase first — the 10/1 Profiler Routines commit that day).
  - Dominion reframe and **Classroom wave A** Fri 10/2 – Tue 10/6.
  - Megmeet start Wed 10/7.
  - Firmus prospectus 8 Oct and listing 22 Oct (reported). On listing, its calendar row moves to the public rule.
- **Stale and not yet re-authored (Classroom.gs untouched, by design):**
  - `landscape-neoclouds-2026-09`: the roster went from seven to ten (+Firmus, +HUMAIN, +G42), and `scenario-neoclouds-discovery` goes stale with it.
  - `landscape-aidc-developers-and-landlords-2026-09`, further: +G42 as a challenger, +Firmus and +HUMAIN as adjacent. This is on top of Chindata, `tract` v4, `powerhouse-data-centers` v3 and the `terawulf` v8 edge. Its two `scenario-aidc-developers-and-landlords-*` rehearsals were already stale.
  - Classroom wave A re-authors them.
  - `build-classroom-segments.py --check`: **14 due**, 12 with section changes and 2 pin-only (`capital`, from `mgx` v3; `insurance-and-risk-transfer`). `neoclouds` now differs in eight sections.

### Key decisions made

- **G42 is one group slug.** G42 controls Khazna, the BIS approval and Stargate UAE sit at group level, and the corpus uses the names interchangeably; Khazna and Core42 live in `aka[]`.
- **HUMAIN is a neocloud, not a hyperscaler.** Its own cloud is 1.1 MW; it builds capacity and lets it to others.
- **Firmus is private** until it lists; its category is neocloud.
- **§11.1 buying authority:**
  - **Firmus:** buys its own chain — it owns its connection substations, applies for its generators, and runs UPS and batteries through Synert. In Australia the power train is exclusive to JLE.
  - **HUMAIN:** owner and grid counterparty. The EPC contractor, or the partner, places the equipment orders.
  - **G42:** Khazna is the buyer; Core42 leases.
- **The `revenue-share` concept was left alone.** Its definition is BESS-optimiser-specific, so HUMAIN's guide defines 'revenue-sharing arrangement' in its own glossary rather than editing a shared entry that Classroom lessons may pin.
- **The `oracle` pin on the named-project report was left loud.** It is pinned at v4, and v5 was an earlier session's substantive refresh (summary, developments, strategy, financials) that a pin note cannot vouch for. This session's v6 only added the G42 edge and its source.

### Known issues

- **Dates to re-check, because these rows flip rather than drift:**
  - Firmus's Benmax completion (expected by end-September) and its listing.
  - HUMAIN's Aramco stake (EC-cleared, not completed).
  - G42's 6 Apr 2027 sunset, and any US vehicle.
- **One-way edges:** the new dossiers point at `eaton`, `supermicro`, `blackstone`, `coreweave`, `iren` and `amazon`, which do not point back. They show as inbound evidence in the graph and were not revised this session.
- **Two pin warnings** on the 9/8 reports (`jinko` v6, `oracle` v6), read and left loud.
- **Pre-existing:** NVIDIA's Relationships tab shows four literal `**`. They come from other dossiers' inbound curated contexts, not from this session's edges; the graph holds 127 `**` both before and after this session. Not fixed here.
- **README archive tree:** the older unlisted archive files (about 60) are still missing. This session added only its own eight.
- **Carried over:**
  - The ERCOT/PJM decision still awaits the developer.
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2).
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.
  - `study-prep/zhonhen/zhonhen-interview-brief.md` still calls Panama an SST in two lines.
  - The study-guide PDF renderer is not in the repo.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 188 dossiers, 188 guides, 1,539 concepts, 1,610 graph edges (1,217 curated). **CHANGELOG** `Sections: 90/100`.

### Recommendation for next session

- Write the **F-I1 paste-in prompt** (BlackRock/GIP/AIP and KKR, Opus 5.5 at xhigh) as §6 of `repository-information/phase-f-action-plan.md`, on the §4/§5 template with F-N1's lessons, and run it by Tue 9/29. BlackRock's 31 inbound dossiers make its step-7 reconciliation the session's main cost.

**To continue:** type `write the F-I1 prompt`

## Previous Sessions

### Session — 2026-09-26 01:26 AM → 03:25 AM EST (F-H1 and the F-N1 prompt, v07.62r–v07.63r)

**Date:** 2026-09-26 01:26 AM → 03:25 AM EST (two attended turns; context compacted once mid-session)
**Repo version:** v07.63r (two pushes: v07.62r F-H1; v07.63r the write-size rule fix, the F-N1 prompt and this save)
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
- **v07.63r — the follow-up turn:**
  - **The write-size rule fix, approved by the developer:** the Incremental Writing gate in `.claude/rules/behavioral-rules.md` now lists lesson plans as item (d) of the content types that always run over 50 lines. F-H1 had written a 75-line lesson plan in one call.
  - **The three new study guides as PDFs**, sent to the developer as files (11–15 pages each: every section kind, an answer key, a glossary for the tooltip terms). They are **not** in the repo; the renderer lived in the session scratchpad.
  - **The F-N1 paste-in prompt**, saved as **§5 of `phase-f-action-plan.md`** for Opus 5.5 xhigh. It carries F-H1's lessons: back-source every named counterparty, check inbound dossiers for missing reciprocal edges, write lesson plans incrementally. It also flags the two alias collisions (`hyperstrong`'s HyperCube, `dg-matrix`'s Inception) and adds a Megmeet paragraph ask.

### What the three dossiers change about Megmeet's missing customer side

The `megmeet` dossier names no Chinese customer, and these three do not supply one: no ByteDance, Alibaba or Chindata record — and no Megmeet, Sinexcel or Kehua filing — links Megmeet to any of them. What they add is the map of the doors. **ByteDance** buys its own Volcano Engine campuses' chain from domestic distribution, UPS and substation makers (Kstar, TGOOD, Mingyang, Jinpan, Sifang, Far East, Zhonhen), rents most of its capacity from landlords who tender UPS from its qualified-vendor list, and its 800 V move is still a tender with no award — the open door, if anyone's. **Alibaba** specifies Panama, a 50 Hz transformer-rectifier bought by framework from Zhonhen and Delta; its halls are only 'compatible' with 800 V, and its one SST conversation is Sungrow's joint innovation centre — an incumbent to displace, not an SST base. **Chindata** is China's one SST reference in commercial operation (Delta's SST at Sangyuan, for Meituan), writes its own specifications, says it will localise SST core components with domestic makers, and has a new owner (HEC) that puts its own capacitors and coolants into the bill of materials, with about RMB 4.75B of M&E earmarked — the landlord-as-specifier door a domestic SST maker would knock on first.

### Where we left off

- **Status:** v07.62r is merged and v07.63r pushed at close; the tree is clean.
- **Next (action plan):** F-N1 (Firmus, HUMAIN, G42) at **xhigh** by Tue 9/29, prompt in §5; then F-I1 (BlackRock, KKR) at xhigh Mon 9/28 – Tue 9/29, which has no prompt yet (§4 and §5 are the templates).
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
- **F-N1 runs at xhigh**, not the plan's high (the developer, 2026-09-26).
- **Same-session save:** 'remember session' extended this Latest entry in place rather than moving it down, because it was already this session's hand-off. Moving it would have pushed out the v07.60r–v07.61r entry to make room for a duplicate.

### Known issues

- **Not edited:** `study-prep/zhonhen/zhonhen-interview-brief.md` still calls Panama's device class an SST in two lines (92, 177). It is a private file, outside the scope; the in-app guide was corrected.
- **The study-guide PDFs are not reproducible from the repo:** the renderer was a scratchpad script. Ask to commit it as a script if PDFs for future guides are wanted.
- **README archive tree:** about 60 archive files that predate this session (e.g. `zhonhen.profile.v4`/`v7`, `delta-electronics.profile.v2`) are not listed. This session added only its own two.
- **Carried over:**
  - The ERCOT/PJM decision still awaits the developer.
  - The two aged 9/8 reports still warn.
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2).
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **Profiler:** 185 dossiers, 185 guides, 1,520 concepts, 1,583 graph edges. **CHANGELOG** `Sections: 89/100`.

### Recommendation for next session

- Run **F-N1 (Firmus, HUMAIN, G42)** in a fresh Opus 5.5 session at **xhigh** by Tue 9/29, using the prompt in **§5 of `repository-information/phase-f-action-plan.md`**, so `landscape-neoclouds-2026-09` is re-authored only once in Classroom wave A.

**To continue:** paste the prompt in §5 of `repository-information/phase-f-action-plan.md` into a fresh Opus 5.5 session set to xhigh
