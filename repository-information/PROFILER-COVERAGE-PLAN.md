# Profiler Coverage Plan — closing Classroom's gap register

**Approved by the developer on 2026-09-03 (v04.39r → v04.40r).** This is the working plan for the Profiler coverage expansion that Classroom's curriculum plan (`CLASSROOM-CURRICULUM-PLAN.md` §6, the gap register) asked for. It is ordered by **model**, not by tier, because that is how the developer will run it: every Fable 5.1 xhigh session first, then every Fable 5.1 High session, then every Opus 5 xhigh session, then back to the Classroom build. Read §2 for the model rule, §3–§6 for the phases, §7 for what every session does, §8 for the status ledger — the one table that says what is done — and **§9 for Phase X, the cross-reference integrity work**, which runs alongside Phases B and C and must close before Phase D.

**How to use this file.** A session that lands a dossier or study guide flips the company's row in §8 in the same commit (`—` → `v1` for a dossier, `—` → `✓` for a guide, with the repo version). A row is not done until its files exist on `main`. When a phase completes, re-run the register checks in `CLASSROOM-CURRICULUM-PLAN.md` §6 and date them there — that register, not this ledger, is what the Classroom backfill reads.

---

## 1 · Where coverage stood when this was approved (verified 2026-09-03, v04.39r)

89 dossiers, 62 study guides, 8 projects, 490 graph edges, 112 concepts, 7 guidance modules, 4 reports. The shape of the gap, by category:

| Category | Dossiers | With guide | What was missing |
|----------|----------|------------|------------------|
| supplier | 39 | 27 | No gen-set OEM, no rotary/large UPS, no MV switchgear beyond ABB, no 800 VDC silicon, only two of three turbine OEMs, no PCS specialist, no long-duration vendor |
| developer | 12 | 12 | All AIDC landlords plus Constellation; no BESS developer carries the label |
| ipp | 9 | **0** | The whole BESS buyer side was dossier-only — no lesson could pin it |
| epc / gc | 12 / 5 | 8 / 5 | Adequate; two data-center GCs optional |
| integrator | 10 | 4 | Adequate for the Hithium competitive set |
| hyperscaler / neocloud | 7 / 5 | 7 / 5 | No AI lab besides OpenAI, no tenant-of-record neocloud, no miner-pivot landlords |
| utility · investor · advisor | 0 | 0 | Nothing — the two latter categories exist in the schema and had never been used |

Two facts shaped the list. **Classroom pins study guides, not dossiers, for every equipment lesson** (the §5 failure map is built from guides only), so every company below is a dossier *plus* a `profiler prep` pass. And a mention count across the corpus — how often an uncovered company is already named inside covered dossiers and guides — surfaced gaps the register never listed: Digital Realty (13 docs), Blackstone (12), AEP (11 + 25 guidance hits), Anthropic (10 docs, 97 hits), MGX (10), Fluidstack (6), Intersect Power (6), Mitsubishi Power (6). Powin (13 docs) was the most-mentioned uncovered name and is deliberately **not** on the list: defunct, and already told inside FlexGen's dossier.

---

## 2 · The model rule

Three models are in play and the developer has fixed their order. What each one is *for*:

| Model | Use it for | Why |
|-------|-----------|-----|
| **Fable 5.1 xhigh** | The four **anchor** companies a future Classroom lesson will pin as its primary source, run as **dossier + study guide in one session** | The study guide's concept chain, section design and drill items are the quality-sensitive layer, and a lesson will hang on them. xhigh is the exception, not the default — running the thirty-company developer roster at xhigh is where the weekly Fable cap dies |
| **Fable 5.1 High** | **Private or opaque subjects** where the dossier's value is inference from a thin public record and the strategy read has to reason across the ecosystem — plus the **utilities**, whose value is regulatory synthesis (IRPs, rate cases, large-load tariffs, PUC dockets) | The research subagents inherit the parent model, so the synthesis and the source-weighing both run on Fable. Anthropic's own guidance is to start at high and step up only when evals show headroom |
| **Fable 5.1 Medium** | **Rule-bound bookkeeping and bounded adjudication** — work where the rule is already written and the judgment is "does this record match that record, yes or no": source registration, reciprocal-type reconciliation, report re-pinning, ledger flips. Also viable for a **full dossier + guide session** on a private subject when the Fable budget is tight | Session F5 ran three companies end to end on Medium — all research, both dossiers and guides, and the lesson plans — and shipped at v04.62r with the registry, graph and study checkers clean and **all three premises caught and corrected**. Premise-checking turned out to be prompt-driven, not effort-driven. Medium's weakness is reading depth on long filings, which bounded adjudication does not need |
| **Opus 5 xhigh** | **Public companies with a deep first-party record**, where the schema and the checkers do the work and the two research subagents do the finding — and all **study-guide work on existing dossiers** | Half the rate against the weekly limit, no weekly cap, and the one batch this repo explicitly authored on Fable 5 (v02.20r) is indistinguishable in the CHANGELOG from the Opus batches |

**Confidence note.** This is judgment, not measurement — the repo has never compared dossier quality by model. Phase A doubles as the cheapest possible test: if Caterpillar's guide on xhigh reads no better than a High-effort guide, the developer can demote Piller, Dominion and Vicor to High before running them.

**Head-to-head evidence (2026-09-04, v04.57r).** The rule was tested once, on the Xcel Energy dossier: the Opus 5 xhigh v1 (v04.46r) was archived and a Fable 5.1 High session re-ran `profiler Xcel Energy` blind, writing v2 from its own research before opening v1. Differences were classed as *same fact, different treatment* (weighted) or *search luck* (discounted). Verdict on the claim that Fable is better at the judgments and the relationship discipline: **inconclusive**. On relationship and sourcing discipline Fable had a narrow edge on the (a)-class evidence — it recorded the unapproved Google ESA as `announced` where Opus wrote `active`, dated the Meta link to the 2023 MPUC approval where Opus wrote 2026 from a trade-association list and asserted a collection gap Xcel's own newsroom contradicts, withheld a Moody's negative-outlook claim that Opus asserted without a resolvable source, and stated the SPS-presidency gap that Opus's decision-maker list omits without comment. On the judgments there was no gap in either direction: five of seven judgments are the same call at similar confidence, Opus's set read the company's own pipeline slide more closely (the flat contracted block, the one-year slip, the redacted fifth row) and found a structural point Fable missed (PSCo belongs to no RTO, so the commission is the effective buyer in the largest state), while Fable's set added the ownership-ratio judgment and a dated indicator list. Opus's 10-K extraction was materially deeper (risk factors, credit-transfer cash, insurance repricing, capex actuals) — the same document was available to both, so this is reading depth rather than search luck, and it cuts against Fable on thoroughness. Consequence: no Fable make-good is warranted for the Oncor and AEP substitutions, and the Phase B remainder can go to either model without regret; the one lapse worth a checker rule is an unsourced rating-outlook assertion, which is model-independent. Full section-by-section report in the v04.57r CHANGELOG entry's session chat.

**Medium evidence (2026-09-05, v04.70r).** The one Medium data point is F5, and it is a strong one: a three-company Fable 5.1 Medium session produced dossiers and guides indistinguishable in the ledger from its High siblings, and its premise-verdict record (**all three wrong, all three caught**) matches what C4 achieved on Opus 5 xhigh. Read against the §2 head-to-head — where Opus's one clear edge was **10-K reading depth** — the rule that falls out is: **effort buys depth of reading, not care.** Spend it where a long first-party document has to be mined; save it where the work is comparing two records the repo already holds. That is why §9's integrity items are assigned to Medium and the Phase C public companies are not.

**If the weekly Fable cap binds mid-phase**, Opus 5 xhigh is acceptable for any Phase B company; record the substitution in the §8 ledger's Model column so the record stays honest.

---

## 3 · Phase A — Fable 5.1 xhigh (4 anchors, one company per session)

Each anchor is one session: `profiler <Company>` then `profiler prep <Company>`, both landing in the **same push commit**. Order is the order the Classroom lessons need them.

| # | Company | Category | Register row | The lesson it anchors | Why it is the anchor |
|---|---------|----------|--------------|-----------------------|----------------------|
| A1 | **Caterpillar** | supplier | G2 | `backup-generation` (track `aidc-grid-to-chip`) | Largest data-center gen-set share (~18%); Solar Turbines subsidiary already sits in three dossiers as a bridge-power prime mover; the gen-set / ATS / paralleling story has been taught only through Eaton's choreography and Rosendin's walk |
| A2 | **Piller Power Systems** | supplier | G3 | `the-ups-room` (track `aidc-grid-to-chip`) | Rotary and diesel-rotary UPS to 50 MW — the only home the rotary/flywheel story can have; Vertiv's guide has zero UPS content and Schneider's has none |
| A3 | **Dominion Energy** | utility (`other` until a `utility` category is added — see §7) | G5 | `how-a-utility-buys` (track `market-access`, the first **public** utility lesson) | Data Center Alley's utility; 30 hits inside the guidance modules and none in a public source, so the entire regulated-procurement story is invisible below contributor today |
| A4 | **Vicor** | supplier | G9 | `inside-the-rack` and the battery side of `the-800-vdc-shift` | Point-of-load silicon for the 800 VDC rack; G9 is the row two September lessons had to state the thinness of in their own text rather than teach around |

**Session shape.** One company. Read `SESSION-CONTEXT.md`, this file (§2, §7, the company's §8 row), `.claude/rules/profiler-app.md` (Profiler Command, Profiler Prep Command, Scheduled Refreshes), `PROFILER-SCHEMA.md`, `PROFILER-STYLES.md` (active style `intel-briefing`), then run the two commands. The paste-in prompt template is in §7.

---

## 4 · Phase B — Fable 5.1 High (29 companies)

Twenty-nine companies, **up to three per session, dossier + study guide each**, grouped so a session's three share a research frame. Ten sessions. Run the groups in the order below — utilities first because they close G5, the expensive row that matters most for the team case; then the BESS buyers the developer asked for; then the AIDC landlords, neoclouds and lab; then the money and the engineers.

| Group | Session | Companies | Category | Why together |
|-------|---------|-----------|----------|--------------|
| B-U | B1 | **Southern Company** (with Georgia Power) · **Entergy** | utility | Southeast AIDC load; Entergy is Meta Hyperion's utility (20 guidance hits) |
| B-U | B2 | **Oncor** · **AEP** · **Xcel Energy** | utility | ERCOT wires against a 474 GW large-load queue; AEP the most-cited utility in the corpus (11 dossiers, 25 guidance hits); Xcel the Midwest/Mountain AIDC utility |
| B-D | B3 | **Aypa Power** · **Spearmint Energy** · **Intersect Power** | developer | Largest standalone BESS platform in North America (~6.5 GW, Blackstone → Brookfield); ERCOT merchant with 15 GWh in development; Google-owned since 2026 with the co-located energy-park model — the clearest BESS-attaches-to-AIDC case |
| B-D | B4 | **Invenergy** · **Gridstor** · **Available Power** | developer | Largest private US developer (4 dossiers name it); two CAISO/ERCOT merchant storage specialists |
| B-D | B5 | **esVolta** · **Strata Clean Energy** · **Hunt Energy Network** | developer | Contracted and merchant mid-size BESS owners across CAISO, PJM and ERCOT |
| B-D | B6 | **Excelsior Energy Capital** | investor / developer | Fluence's 2.2 GWh US-made supply customer — pair with B5 if a session has room |
| B-A | B7 | **Compass Datacenters** · **EdgeCore** · **PowerHouse Data Centers** | developer | Brookfield-owned hyperscale builder; 1.8 GW delivered or under development on $16.1B planned; Joliet 1.8 GW campus |
| B-A | B8 | **Fermi America** · **Tract** · **Prime Data Centers** | developer | Amarillo multi-GW behind-the-fence campus; land-and-power entitlement developer; hyperscale build-to-suit |
| B-A | B9 | **Fluidstack** · **Nscale** · **Anthropic** | neocloud · neocloud · hyperscaler | Tenant-of-record in the TeraWulf, Hut 8 and Cipher leases (6 dossiers); Microsoft-anchored neocloud; the AI lab already named in ten dossiers (97 hits) with a 470 MW Enchanted Rock order and a 401 MW TeraWulf lease — the OpenAI-shaped hole |
| B-I | B10 | **MGX** · **DNV** · **Sargent & Lundy** | investor · advisor · advisor | Stargate and Aligned money (10 dossiers); the two independent engineers G10 names — first entries in the `investor` and `advisor` categories |
| B-L | B10 | **CoolIT** · **X-energy** | supplier | Fold into B10 or run as B11: the CDU specialist for G7 and Amazon's SMR partner for G8 |

**Regrouping (2026-09-04, recorded by session F1 at v04.58r).** The Phase B remainder was regrouped in chat on 2026-09-04 (v04.56r session) into eight Fable 5.1 High sessions **F1–F8**, ordered so the register closers and the most opaque subjects run first: **F1** DNV · Sargent & Lundy · CoolIT (closes G10 and G7; first `advisor` chip) · **F2** Fluidstack · Nscale · Anthropic · **F3** Aypa · Spearmint · Intersect · **F4** Invenergy · Gridstor · Available Power · **F5** esVolta · Strata · Hunt · **F6** MGX · Excelsior Energy Capital · X-energy (first `investor` chips; Excelsior moved here from B6, and B10 was split — MGX and X-energy moved to F6, DNV, Sargent & Lundy and CoolIT became F1) · **F7** Compass · EdgeCore · PowerHouse · **F8** Fermi America · Tract · Prime Data Centers. The B-group table above is kept as the original grouping; the §8 `Group` column records `B10 → F1` for the three rows F1 landed.

**Why these are Fable and not Opus.** Every company in Phase B is private, unit-level, or (for the utilities) public but regulatory-dense. The dossier's value is the strategy read and the confidence-tagged judgments, which is exactly the layer where the research subagents cannot help and the authoring model can.

---

## 5 · Phase C — Opus 5 xhigh (32 companies + 30 study guides)

Thirty-two companies with deep first-party records, **up to three per session, dossier + study guide each**, plus the guide work on existing dossiers. Roughly eleven dossier sessions and seven guide sessions. Run the register closers first (C1–C3), because they finish G2, G3, G4 and the turbine gap; then the power partners; then the public BESS and AIDC names; then the money; then the low-priority tail; and the guide backfill whenever a session has room.

> **⚠️ The `Why (hypothesis)` column is UNVERIFIED PROMPT MATERIAL, not fact.**
> It was written at plan-approval time from unattributed market knowledge — not from filings, not from
> the corpus. **Do not cite it, carry it into a dossier, or treat it as a finding.** Its only job is to
> tell a session where to start looking.
>
> **Every session rewrites its own row.** After the research pass, replace the `Why (hypothesis)` cell
> with what the sources actually showed and fill in `Checked` with the verdict and the repo version. A
> row that has run and still carries its original wording is an unfinished row. §5 is a **record**, not
> a wish.
>
> **The evidence for the demotion.** Where a session checked its premises, they failed: **C4 — all three
> wrong** (v04.63r) and, in Phase B, **B5 — all three wrong** (v04.62r). C1, C2, C3 and C11 shipped
> without recording a verdict either way, so those rows are **unknown, not correct**. One of five Phase C
> sessions checked; that one went nought for three.
> *(Demoted 2026-09-05, v04.69r, on the developer's action plan.)*

| Group | Session | Companies | Category | Why (hypothesis — unverified) | Checked |
|-------|---------|-----------|----------|-------------------------------|---------|
| C-R | C1 | **Cummins** · **Rolls-Royce Power Systems (mtu)** · **Rehlko (Kohler Energy)** | supplier | Completes G2: #2 gen-set share (~16%, six dossiers name it); the hyperscale AI-hall gainer with its own BESS line; the fourth OEM | Shipped v04.47r — **premise verdict not recorded** |
| C-R | C2 | **Mitsubishi Electric** · **Powell Industries** · **Mitsubishi Power** | supplier | Large static UPS plus transformers and switchgear (G3); the MV switchgear specialist with a >$400M single data-center order and a $1.8B backlog (G4); the third gas-turbine OEM and Prevalon's former parent — bridge-power lessons cite only two of three today | Shipped v04.48r (v2 v04.50r) — **verdict not recorded** |
| C-R | C3 | **Infineon** · **Flex** | supplier | SiC/GaN for the 800 VDC chain, already tied to Delta in the corpus (G9); the NVIDIA GB300 power-shelf partner named in six dossiers — completes the rack-power set beside Delta, LITEON and Megmeet | Shipped v04.50r — **verdict not recorded** |
| C-P | C4 | **Talen Energy** · **Vistra** · **NRG Energy** | ipp | The Amazon nuclear-PPA precedent (six dossiers); the largest merchant BESS owner in the country with a growing data-center gas book; the third merchant with gas-for-AIDC deals | **All three wrong; corrected v04.63r.** FERC *rejected* the Talen behind-the-meter arrangement (ER24-2172, 1 Nov 2024) — today's deal is a later front-of-the-meter supply agreement; Vistra is **second, not largest**, and its storage fleet fell 1,024 → 624 MW; NRG's GE Vernova/TIC arrangement is a **Project Development Agreement, not a JV**, with slot reservations and no firm order |
| C-D | C5 | **ENGIE North America** · **AES Clean Energy** · **RWE Clean Energy** | developer | 5.6 GW of storage operating or building, absorbed Broad Reach, sold a 2.4 GW stake to CBRE IM; one of the biggest hyperscaler PPA counterparties (five dossiers); ~931 MW of US storage under construction | Not yet run |
| C-D | C6 | **Clearway Energy** · **Recurrent Energy** · **Form Energy** | developer · developer · supplier | Public yieldco with a large CAISO storage fleet; Canadian Solar's development arm (four dossiers); the long-duration reference `where-batteries-stop` needs — Google-backed, ~80 GWh reported backlog | Not yet run |
| C-D | C7 | **Power Electronics** | supplier | The leading US utility-scale PCS specialist (six dossiers) — pair with C6 if the session has room | Not yet run |
| C-A | C8 | **Digital Realty** · **CyrusOne** | developer | The largest missing AIDC landlord (13 dossiers; 2 GW Kansas City energy-service agreement); KKR/GIP-owned with a 760 MW Fairfield campus | Not yet run |
| C-A | C9 | **Cipher Mining** · **Hut 8** · **Galaxy Digital** | developer | The miner-pivot landlords: 300 MW AWS lease; $7B Anthropic/Fluidstack River Bend plus a $9.8B 352 MW Texas lease; 800 MW CoreWeave at Helios — >$19B of leases combined | Not yet run |
| C-I | C10 | **Blackstone** · **Brookfield** · **Macquarie** | investor | Owns QTS, seeded Aypa and VoltaGrid (12 dossiers); owns Compass and is buying Aypa; sold Aligned for $40B (8 dossiers) | Not yet run |
| C-L | C11 | **Oklo** · **Trane Technologies** · **McCarthy** | supplier · supplier · gc | The most-mentioned SMR vendor (5 dossiers, 35 hits) for G8; the chiller OEM for G7 (Motivair and Boyd Thermal already live inside Schneider's and Eaton's dossiers); the data-center GC the corpus names most | Shipped v04.52r — **verdict not recorded** |
| C-L | C12 | **Whiting-Turner** · **Gotion** · **REPT** | gc · supplier · supplier | Second DC general contractor; two FEOC case studies that complete the Chinese cell roster | Not yet run |

**Study-guide work (Opus 5 xhigh, 4–5 guides per session, `profiler prep <Company>`):**

- **Three revisions that close half of G3 and G4** — re-run prep on **Vertiv** and **Schneider Electric** so each carries a UPS section, and on **Siemens Energy** so it carries a grid-technology section instead of turnarounds and hydrogen. Prep overwrites in place; git history keeps the prior guide
- **Twenty-seven backfills, IPPs first** because the BESS buyer side has no guides at all: `apex-clean-energy`, `arevon`, `eolian`, `jupiter-power`, `key-capture-energy`, `lightsource-bp`, `nextera-energy-resources`, `plus-power`, `terra-gen` · then the six bridge-power suppliers `voltagrid`, `proenergy`, `enchanted-rock`, `mainspring-energy`, `on-energy`, `prevalon` · then `narada` (the G9 guide) with the integrators `canadian-solar`, `crrc-zhuzhou`, `envision-energy`, `hyperstrong`, `ls-energy-solutions`, `sunwoda`, `trina-storage` · then the EPCs `blattner`, `mastec`, `solv-energy`, `samsung-ct`

---

## 6 · Phase D — back to Classroom

When §8 shows every row done **and §9's Phase X ledger is clear**, the developer returns to the Classroom build — **backfill first, then continue**. In order:

1. **Re-run every register check and date it** in `CLASSROOM-CURRICULUM-PLAN.md` §6. Expected result: G2, G3, G4, G5, G7, G8, G9 and G10 close; G6 stays open (it wants a guidance module, not a dossier — commission it in the same pass if the developer wants the contributor-gated interconnection lesson); G11 and G12 unchanged
2. **Author the lessons the closures unlock**, one per Opus 5 session per the standing decision: `backup-generation` (A1 + C1), `the-ups-room` (A2 + Vertiv/Schneider revisions), `how-a-utility-buys` (A3 + B1/B2 — the first public utility lesson), a deepened `inside-the-rack` and `the-800-vdc-shift` battery side (A4 + C3 + the Narada guide), `the-transformer-and-the-substation` and `breakers-relays-and-faults` with a second and third vendor (C2 + the Siemens Energy revision), `who-buys-storage` and `how-a-storage-project-happens` on the new buyer guides (B3–B6, C5–C7), and `clean-firm-power` (C4 + C11)
3. **Then resume the cut line** at `redundancy-by-the-numbers` and the rest of the second wave, with the corpus now able to stamp them

---

## 7 · What every session does

The commands and their rules live in `.claude/rules/profiler-app.md` and `PROFILER-SCHEMA.md`; nothing here repeats them. What this plan adds is the **order** and the **bookkeeping** that every session in this program owes:

- **Dossier then guide, same commit.** `profiler <Company>` (two parallel research subagents, first-party exhaustive then third-party, ~50–70 sources) followed by `profiler prep <Company>` (lesson plan under `repository-information/study-prep/<slug>/` plus `<slug>.study.json` at schema v2). One push commit per session
- **After every profile write:** `python3 scripts/sync-profiler-registry.py`, `python3 scripts/build-profiler-graph.py`, `python3 scripts/check-profiler-study.py`, `python3 scripts/check-profiler-relationships.py`. The roster, the graph, the study validator and the relationships checker are four separate things that go stale separately — the fourth (X1, v04.71r) fails on a dangling slug, an incoherent reciprocal type, a relationship URL the dossier never registered in `sources[]`, or an unregistered project pin; exceptions go on `repository-information/profiler-relationships-accepted.json` with a reason
- **Calendar row.** Every new company gets a row in `repository-information/profiler-refresh-calendar.json`: public companies carry a researched `nextReport` / `confirmed` / `source` / `watch[]`; private and unit-level companies carry `cadence: "quarterly"`. The earnings desk is capped at three companies a day and this program adds ~65 rows, so expect the desk's queue to lengthen — that is by design, the calendar is the queue
- **README tree.** One entry per new `<slug>.profile.json` and `<slug>.study.json`, in the existing format
- **§5 of this file — rewrite your own row.** The `Why (hypothesis — unverified)` cell is prompt material, not a finding. After the research pass, **replace it with what the sources actually showed** and fill in `Checked` with the verdict and the repo version — including "premise held" when it did, so a confirmed row is distinguishable from an unexamined one. Never leave a shipped row carrying its original wording, and never record a verdict you did not check. This is what turns §5 from a wish into a record.
- **§8 of this file.** Flip the row in the same commit. Record a model substitution if the Fable cap forced one
- **Register checks.** At the end of each *phase* (not each session), re-run the §6 checks in `CLASSROOM-CURRICULUM-PLAN.md` and date them — a row is not closed until someone re-runs its check
- **The `utility` category exists — added by A3 (Dominion), verified 2026-09-05 at v04.69r.** `profiler-companies.json` now declares `supplier · developer · integrator · epc · gc · ipp · utility · investor · hyperscaler · neocloud · advisor · other` and **six** companies carry `utility` (Dominion, Southern, Entergy, Oncor, AEP, Xcel). Do not file utilities under `ipp` or `other`. *(This bullet read "does not exist yet" until v04.70r — it had been stale since v04.43r.)*
- **`advisor` now holds two companies; `investor` still holds none** (verified 2026-09-05 at v04.69r). F1 landed DNV and Sargent & Lundy at v04.58r, so the `advisor` chip has been exercised. The **first session to put data behind `investor` is now F6** (MGX · Excelsior Energy Capital), not B10 — include a visual check of the chip label, `.ov-tag` colour and the compare peer group when it runs. *(This bullet named B10 until v04.70r.)*
- **CHANGELOG capacity — rotation has already fired once and will fire again inside this program.** It stood at 92/100 at approval, hit 100/100 and rotated (oldest whole date group moved to `CHANGELOG-archive.md` with SHA enrichment), and sits at **86/100 as of v04.69r — 14 pushes of headroom**. The remaining program is ~18 push commits (see §9), so **rotation is due around the fourteenth**, which lands in the guide-backfill block. Budget an extra ~10 minutes in whichever session crosses 100

**Paste-in prompt template** (fill the bracketed fields; the Caterpillar version was handed to the developer at approval):

```text
Picking up from my last session, run Phase [A/B/C] of repository-information/PROFILER-COVERAGE-PLAN.md on
[Fable 5.1 xhigh | Fable 5.1 High | Opus 5 xhigh] as a fresh session: [Company 1][, Company 2][, Company 3].
READ FIRST: repository-information/SESSION-CONTEXT.md; PROFILER-COVERAGE-PLAN.md §2, §7 and the companies' §8
rows; .claude/rules/profiler-app.md (Profiler Command, Profiler Prep Command, Scheduled Refreshes);
repository-information/PROFILER-SCHEMA.md; repository-information/PROFILER-STYLES.md (active style: intel-briefing).
THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7, profileVersion 1,
categories per the §8 row) and study guide (schema v2) — then the registry sync, the graph build, the study
validator, a calendar row, README tree entries, and flip the §8 row. One push commit. [Session-specific notes.]
THE §5 ROW IS A HYPOTHESIS, NOT A BRIEF: treat every claim in its `Why` cell as unverified, and
rewrite that cell plus the `Checked` column with what you actually found before you commit.
VERIFY: sync-profiler-registry.py --check clean, check-profiler-study.py clean, the dossier and guide render
(Playwright), zero page errors. Normal Pre-Commit and Pre-Push checklists; push on a claude/* branch.
```

---

## 8 · Status ledger

**65 new companies** (4 on Fable 5.1 xhigh · 29 on Fable 5.1 High · 32 on Opus 5 xhigh) and **30 study-guide passes on existing dossiers** (3 revisions · 27 backfills). Slugs are proposals resolved per PROFILER-SCHEMA.md's slug rules at authoring time. `Dossier` and `Guide` read `—` until a session lands the file and writes the repo version in its place.

### New companies

| Session | Slug | Company | Categories | Model | Closes | Dossier | Guide |
|---------|------|---------|------------|-------|--------|---------|-------|
| A1 | `caterpillar` | Caterpillar | supplier | Fable 5.1 xhigh | G2 | v1 · v04.41r → v2 · v04.47r | ✓ · v04.41r |
| A2 | `piller` | Piller Power Systems | supplier | Fable 5.1 xhigh | G3 | v1 · v04.42r → v2 · v04.48r | ✓ · v04.42r |
| A3 | `dominion-energy` | Dominion Energy | utility (new) | Fable 5.1 xhigh | G5 | v1 · v04.43r | ✓ · v04.43r |
| A4 | `vicor` | Vicor | supplier | Fable 5.1 xhigh | G9 | v1 · v04.44r → v2 · v04.50r | ✓ · v04.44r |
| B1 | `southern-company` | Southern Company (Georgia Power) | utility | Fable 5.1 High | G5 | v1 · v04.45r | ✓ · v04.45r |
| B1 | `entergy` | Entergy | utility | Fable 5.1 High | G5 | v1 · v04.45r | ✓ · v04.45r |
| B2 | `oncor` | Oncor | utility | Fable 5.1 High → **Opus 5 xhigh** (weekly Fable cap bound mid-session; §2 substitution) | G5 | v1 · v04.46r | ✓ · v04.46r |
| B2 | `aep` | AEP | utility | Fable 5.1 High → **Opus 5 xhigh** (weekly Fable cap bound mid-session; §2 substitution) | G5 | v1 · v04.46r | ✓ · v04.46r |
| B2 | `xcel-energy` | Xcel Energy | utility | Fable 5.1 High → **Opus 5 xhigh** (weekly Fable cap bound mid-session; §2 substitution); v2 re-run on **Fable 5.1 High** (head-to-head, 2026-09-04 — verdict in the §2 confidence note) | G5 | v1 · v04.46r → v2 · v04.57r | ✓ · v04.46r |
| B3 → F3 | `aypa-power` | Aypa Power | developer · ipp | Fable 5.1 High | buyer side | v1 · v04.60r | ✓ · v04.60r |
| B3 → F3 | `spearmint-energy` | Spearmint Energy | developer · ipp | Fable 5.1 High | buyer side | v1 · v04.60r | ✓ · v04.60r |
| B3 → F3 | `intersect-power` | Intersect Power | developer · ipp | Fable 5.1 High | buyer side | v1 · v04.60r | ✓ · v04.60r |
| B4 → F4 | `invenergy` | Invenergy | developer · ipp | Fable 5.1 High | buyer side | v1 · v04.61r | ✓ · v04.61r |
| B4 → F4 | `gridstor` | Gridstor | developer · ipp | Fable 5.1 High | buyer side | v1 · v04.61r | ✓ · v04.61r |
| B4 → F4 | `available-power` | Available Power | developer · ipp | Fable 5.1 High | buyer side | v1 · v04.61r | ✓ · v04.61r |
| B5 → F5 | `esvolta` | esVolta | developer · ipp | Fable 5.1 High → **Medium** (measured Medium test, §2 substitution; all research, dossiers, guides and lesson plans) → **Opus 5 xhigh** (developer switch, bookkeeping tail only) | buyer side | v1 · v04.62r | ✓ · v04.62r |
| B5 → F5 | `strata-clean-energy` | Strata Clean Energy | developer · ipp | Fable 5.1 High → **Medium** (measured Medium test, §2 substitution; all research, dossiers, guides and lesson plans) → **Opus 5 xhigh** (developer switch, bookkeeping tail only) | buyer side | v1 · v04.62r | ✓ · v04.62r |
| B5 → F5 | `hunt-energy-network` | Hunt Energy Network | developer · ipp | Fable 5.1 High → **Medium** (measured Medium test, §2 substitution; all research, dossiers, guides and lesson plans) → **Opus 5 xhigh** (developer switch, bookkeeping tail only) | buyer side | v1 · v04.62r | ✓ · v04.62r |
| B6 | `excelsior-energy-capital` | Excelsior Energy Capital | investor · developer | Fable 5.1 High | buyer side | — | — |
| B7 | `compass-datacenters` | Compass Datacenters | developer | Fable 5.1 High | AIDC developers | — | — |
| B7 | `edgecore` | EdgeCore Digital Infrastructure | developer | Fable 5.1 High | AIDC developers | — | — |
| B7 | `powerhouse-data-centers` | PowerHouse Data Centers | developer | Fable 5.1 High | AIDC developers | — | — |
| B8 | `fermi-america` | Fermi America | developer | Fable 5.1 High | AIDC developers | — | — |
| B8 | `tract` | Tract | developer | Fable 5.1 High | AIDC developers | — | — |
| B8 | `prime-data-centers` | Prime Data Centers | developer | Fable 5.1 High | AIDC developers | — | — |
| B9 → F2 | `fluidstack` | Fluidstack | neocloud | Fable 5.1 High | AIDC developers | v1 · v04.59r | ✓ · v04.59r |
| B9 → F2 | `nscale` | Nscale | neocloud | Fable 5.1 High | AIDC developers | v1 · v04.59r | ✓ · v04.59r |
| B9 → F2 | `anthropic` | Anthropic | hyperscaler | Fable 5.1 High | AIDC developers | v1 · v04.59r | ✓ · v04.59r |
| B10 | `mgx` | MGX | investor | Fable 5.1 High | ecosystem | — | — |
| B10 → F1 | `dnv` | DNV | advisor | Fable 5.1 High | G10 | v1 · v04.58r | ✓ · v04.58r |
| B10 → F1 | `sargent-lundy` | Sargent & Lundy | advisor | Fable 5.1 High | G10 | v1 · v04.58r | ✓ · v04.58r |
| B10 → F1 | `coolit` | CoolIT Systems | supplier | Fable 5.1 High | G7 | v1 · v04.58r | ✓ · v04.58r |
| B10 | `x-energy` | X-energy | supplier | Fable 5.1 High | G8 | — | — |
| C1 | `cummins` | Cummins | supplier | Opus 5 xhigh | G2 | v1 · v04.47r | ✓ · v04.47r |
| C1 | `rolls-royce-power-systems` | Rolls-Royce Power Systems (mtu) | supplier | Opus 5 xhigh | G2 | v1 · v04.47r | ✓ · v04.47r |
| C1 | `rehlko` | Rehlko (Kohler Energy) | supplier | Opus 5 xhigh | G2 | v1 · v04.47r | ✓ · v04.47r |
| C2 | `mitsubishi-electric` | Mitsubishi Electric | supplier | Opus 5 xhigh | G3 | v1 · v04.48r → v2 · v04.50r | ✓ · v04.48r |
| C2 | `powell-industries` | Powell Industries | supplier | Opus 5 xhigh | G4 | v1 · v04.48r → v2 · v04.50r | ✓ · v04.48r |
| C2 | `mitsubishi-power` | Mitsubishi Power | supplier | Opus 5 xhigh | turbine gap | v1 · v04.48r | ✓ · v04.48r |
| C3 | `infineon` | Infineon | supplier | Opus 5 xhigh | G9 | v1 · v04.50r | ✓ · v04.50r |
| C3 | `flex` | Flex | supplier | Opus 5 xhigh | rack power | v1 · v04.50r | ✓ · v04.50r |
| C4 | `talen-energy` | Talen Energy | ipp | Opus 5 xhigh | power partners | v1 · v04.63r | ✓ · v04.63r |
| C4 | `vistra` | Vistra | ipp | Opus 5 xhigh | power partners | v1 · v04.63r | ✓ · v04.63r |
| C4 | `nrg-energy` | NRG Energy | ipp | Opus 5 xhigh | power partners | v1 · v04.63r | ✓ · v04.63r |
| C5 | `engie-north-america` | ENGIE North America | developer · ipp | Opus 5 xhigh | buyer side | — | — |
| C5 | `aes-clean-energy` | AES Clean Energy | developer · ipp | Opus 5 xhigh | buyer side | — | — |
| C5 | `rwe-clean-energy` | RWE Clean Energy | developer · ipp | Opus 5 xhigh | buyer side | — | — |
| C6 | `clearway-energy` | Clearway Energy | developer · ipp | Opus 5 xhigh | buyer side | — | — |
| C6 | `recurrent-energy` | Recurrent Energy | developer · ipp | Opus 5 xhigh | buyer side | — | — |
| C6 | `form-energy` | Form Energy | supplier | Opus 5 xhigh | long duration | — | — |
| C7 | `power-electronics` | Power Electronics | supplier | Opus 5 xhigh | PCS | — | — |
| C8 | `digital-realty` | Digital Realty | developer | Opus 5 xhigh | AIDC developers | — | — |
| C8 | `cyrusone` | CyrusOne | developer | Opus 5 xhigh | AIDC developers | — | — |
| C9 | `cipher-mining` | Cipher Mining | developer | Opus 5 xhigh | AIDC developers | — | — |
| C9 | `hut-8` | Hut 8 | developer | Opus 5 xhigh | AIDC developers | — | — |
| C9 | `galaxy-digital` | Galaxy Digital | developer | Opus 5 xhigh | AIDC developers | — | — |
| C10 | `blackstone` | Blackstone | investor | Opus 5 xhigh | ecosystem | — | — |
| C10 | `brookfield` | Brookfield | investor | Opus 5 xhigh | ecosystem | — | — |
| C10 | `macquarie` | Macquarie | investor | Opus 5 xhigh | ecosystem | — | — |
| C11 | `oklo` | Oklo | supplier | Opus 5 xhigh | G8 | v1 · v04.52r | ✓ · v04.52r |
| C11 | `trane-technologies` | Trane Technologies | supplier | Opus 5 xhigh | G7 | v1 · v04.52r | ✓ · v04.52r |
| C11 | `mccarthy` | McCarthy Building Companies | gc | Opus 5 xhigh | GC completeness | v1 · v04.52r | ✓ · v04.52r |
| C12 | `whiting-turner` | Whiting-Turner | gc | Opus 5 xhigh | GC completeness | — | — |
| C12 | `gotion` | Gotion High-Tech | supplier | Opus 5 xhigh | FEOC roster | — | — |
| C12 | `rept` | REPT Battero | supplier | Opus 5 xhigh | FEOC roster | — | — |

### Study guides on existing dossiers (Opus 5 xhigh)

| Kind | Slug | Company | Why | Guide |
|------|------|---------|-----|-------|
| revision | `vertiv` | Vertiv | add a UPS section (G3) | ✓ · v04.51r — the machine and the transaction |
| revision | `schneider-electric` | Schneider Electric | add a UPS section (G3) | ✓ · v04.51r — the system and the ladder |
| revision | `siemens-energy` | Siemens Energy | add a grid-technology section (G4) | ✓ · v04.51r — the network as a system |
| backfill | `apex-clean-energy` | Apex Clean Energy | IPP — buyer side has no guides | — |
| backfill | `arevon` | Arevon | IPP — buyer side has no guides | — |
| backfill | `eolian` | Eolian | IPP — buyer side has no guides | — |
| backfill | `jupiter-power` | Jupiter Power | IPP — buyer side has no guides | — |
| backfill | `key-capture-energy` | Key Capture Energy | IPP — buyer side has no guides | — |
| backfill | `lightsource-bp` | Lightsource bp | IPP — buyer side has no guides | — |
| backfill | `nextera-energy-resources` | NextEra Energy Resources | IPP — buyer side has no guides | — |
| backfill | `plus-power` | Plus Power | IPP — buyer side has no guides | — |
| backfill | `terra-gen` | Terra-Gen | IPP — buyer side has no guides | — |
| backfill | `voltagrid` | VoltaGrid | bridge-power supplier | — |
| backfill | `proenergy` | ProEnergy | bridge-power supplier | — |
| backfill | `enchanted-rock` | Enchanted Rock | bridge-power supplier | — |
| backfill | `mainspring-energy` | Mainspring Energy | bridge-power supplier | — |
| backfill | `on-energy` | ON.energy | bridge-power supplier | — |
| backfill | `prevalon` | Prevalon | bridge-power supplier | — |
| backfill | `narada` | Narada | G9 — the backup-power incumbent | ✓ · v04.51r — the cell, not the shelf |
| backfill | `canadian-solar` | Canadian Solar | integrator | — |
| backfill | `crrc-zhuzhou` | CRRC Zhuzhou | integrator | — |
| backfill | `envision-energy` | Envision Energy | integrator | — |
| backfill | `hyperstrong` | HyperStrong | integrator | — |
| backfill | `ls-energy-solutions` | LS Energy Solutions | integrator | — |
| backfill | `sunwoda` | Sunwoda | integrator | — |
| backfill | `trina-storage` | Trina Storage | integrator | — |
| backfill | `blattner` | Blattner | EPC | — |
| backfill | `mastec` | MasTec | EPC | — |
| backfill | `solv-energy` | SOLV Energy | EPC | — |
| backfill | `samsung-ct` | Samsung C&T | EPC | — |

---

## 9 · Phase X — cross-reference integrity

**Added 2026-09-05 (v04.70r) on the developer's instruction to check every existing cross-reference for accuracy before the coverage program resumes.** Phase X runs **alongside** Phases B and C and **closes before Phase D**. It is numbered 9 rather than inserted as a new §6 on purpose: `§2`, `§5`, `§7` and `§8` are referenced by the prompt template, by `.claude/rules/profiler-app.md` and by `SESSION-CONTEXT.md`, and renumbering them would create the exact class of defect this phase exists to remove.

### 9.1 · The surface, measured

Every cross-reference surface in the repo was enumerated and counted on 2026-09-05 at v04.69r. **This table is the scope of Phase X.** Nothing was estimated; each row is a script run or a query over the live corpus.

| # | Surface | Size | Guarded by | State at v04.69r |
|---|---------|------|-----------|------------------|
| S1 | Dossier ↔ dossier factual claims | **260** mutually-mentioning pairs (of ~870–1,130 total pairs) | `check-profiler-crossrefs.py` | **Clean** — exit 0, 6 accepted candidates, 16 scopes reported not-examined. Blind by construction to **categorical mischaracterisation** (the `invenergy` class) |
| S2 | `relationships[]` curated edges | **853** entries · **678** distinct pairs | **nothing** | **0 dangling slugs.** 503 one-sided; **15** reciprocal type conflicts after filtering correct inverses; **119** entries cite a URL absent from that dossier's own `sources[]`; **77** cite nothing |
| S3 | Report → dossier citations | 4 reports · ~31 version pins | `check-profiler-reports.py` | 0 errors, **31 aged pins** — warning-only by design. Concentrated on `hithium` (2 reports, 50 mentions), `catl` (3, 52), `byd` (2, 38) |
| S4 | Study guide → dossier / concepts | 101 guides · 811 concepts | `check-profiler-study.py` | **Clean** — 0 errors, 0 warnings |
| S5 | Classroom → corpus (provenance stamps, `gateDigest`) | 10 lessons · 3 tracks · 134 gate cases | `check-classroom-content.py` · `check-classroom-pipeline.py` | **Clean** — 0 errors; pipeline checker reports nothing to judge against `origin/main` |
| S6 | Registry ↔ dossiers | 127 entries | `sync-profiler-registry.py --check` | **Clean** — 0 of 127 out of sync |
| S7 | Repo documentation pointers (`` `path/to/file` `` references in CLAUDE.md, `.claude/rules/**`, `repository-information/**`) | **406** backticked repo-path references | nothing | **Clean** — every unresolvable path is either a deliberate placeholder (`NEW.html`, `PAGENAME`, `my-project/`) or a historical `CHANGELOG-archive.md` entry naming a since-deleted file. **Zero real dangling pointers** |

**The finding that shapes this phase: five of seven surfaces are already clean, and one of the two that are not is warning-only.** A general "sweep everything" pass would spend most of its budget re-confirming green. The unguarded accuracy risk is concentrated in **S2**, which no checker has ever looked at.

### 9.2 · What Phase X deliberately does not do

**It does not run the retroactive 870–1,130-pair sweep** the v04.64r session proposed. Three reasons, in order of weight:

1. **The sweep is perishable and the corpus is not finished.** 27 companies remain. C4 landed into ~30 inbound mentions and four of them were wrong — every new dossier manufactures new cross-references. A sweep run now would need re-running after C12. Step 7 of the Profiler Command already reconciles the corpus against each new dossier as it lands, so the *forward* direction is covered by rule.
2. **One-sidedness is a weak signal.** Of the 503 one-sided edges, **421** are silent in both directions — and the type histogram says why that is mostly correct: 165 are `competitor` (a large company has no reason to name a small rival) and the rest are largely small-vendor-names-large-customer. Adjudicating 421 items to find a handful of real conflicts is precisely the over-calling failure the v04.64r session flagged, where a checker rewrites accurate dossiers.
3. **The one class that would justify the spend cannot be detected statically.** Categorical mischaracterisation — every number right, the business model wrong — is out of scope for any comparator, as `check-profiler-crossrefs.py`'s own docstring says. It is read work, and read work is better spent on the 27 dossiers still to be written than on re-reading 127 that step 7 will revisit anyway.

**What replaces the sweep** is a durable checker over S2's mechanical invariants (X1), a bounded fix of the decidable defects it finds (X2), and **one** integrity close-out after the corpus is complete (X3).

### 9.3 · The work items

| # | Item | Model | Size | Done when |
|---|------|-------|------|-----------|
| **X1** | Build **`scripts/check-profiler-relationships.py`** — the sixth checker, run after every profile write beside the registry sync, graph build and study validator. Four mechanical invariants only: (a) every `relationships[].slug` resolves in the registry, (b) reciprocal edges carry coherent types (`customer`↔`supplier`, `investor`↔`portfolio`, symmetric types matching themselves) with an accept list for the legitimately-both cases, (c) `relationships[].source` that is a **URL** resolves inside that dossier's `sources[]`, (d) `relationships[].project` resolves in `profiler-projects.json`. **No semantic detectors** — the semantic layer is `check-profiler-crossrefs.py` and it already exists | **Fable 5.1 High** | 1 session | The script exits non-zero on the current corpus with the 15 + 119 defects listed, `--json` and an accept list work, and `PROFILER-CROSSREF-CALIBRATION.md` gains a section describing it |
| **X2** | Clear what X1 reports: adjudicate the **15** reciprocal type conflicts (several — `microsoft`/`openai`, `google`/`terawulf` — are legitimately both `partner` and `investor` and belong on the accept list, not in a rewrite), and register the **119** out-of-band relationship URLs into their dossiers' `sources[]` with the correct party tier, or replace them with an already-registered equivalent. Leave the **77** absent-source entries alone unless the note asserts a hard fact — the schema's derived-link fallback covers them | **Fable 5.1 Medium** | 1 session | `check-profiler-relationships.py` exits 0; every accept-list entry carries a one-line reason |
| **X3** | **Integrity close-out, after C12 and the guide backfills land.** Re-run all six checkers; re-pin all four reports to the current `profileVersion`s and re-verify each citation's figure against the dossier it now points at (31 pins aged at v04.69r and the number will have grown); re-run `check-profiler-crossrefs.py` over the completed 154-company corpus and adjudicate what it surfaces; then re-run the `CLASSROOM-CURRICULUM-PLAN.md` §6 register checks and date them | **Opus 5 xhigh** | 1–2 sessions | All six checkers exit 0, `check-profiler-reports.py` reports **0 warnings**, and §6's register rows carry a fresh date |

**Why X1 is High and not Opus.** The v04.64r session recorded "build the checker on Opus 5 xhigh" for `check-profiler-crossrefs.py`, and that was right — that checker's hard problem was an adversarial false-positive design over free text with four ground-truth cases to calibrate against. X1 has no such problem: its four invariants are structural, the defect set is already enumerated above, and there is nothing to tune. The precedent does not transfer.

**Why X2 is Medium.** Registering a URL into `sources[]` is lookup-and-classify against a party-tier rule that is already written in `PROFILER-SCHEMA.md` → Source provenance. Per §2's Medium note, effort buys reading depth, and this work needs none.

### 9.4 · Status ledger

| Item | Model | Status |
|------|-------|--------|
| X1 · `check-profiler-relationships.py` | Fable 5.1 High | **Done — v04.71r.** Reproduces §9.1 exactly (853 / 678 · 82 naive → **15** · **119** · 0 dangling); (d) measured at 51 pins, 0 unregistered. Exits 1 on the live corpus with 134 findings for X2 |
| X2 · clear the 15 + 119 | Fable 5.1 Medium | **Done — v04.72r.** Exits 0: 10 of the 15 reciprocal pairs accepted with written reasons, 5 `type`s corrected (Kiewit→Bechtel `competitor`; NVIDIA→Flex/Infineon/LITEON/Megmeet `partner`); of the 119 URLs, **104** were truncated prefixes of a URL the dossier already registered (string fix), **15** registered into `sources[]` with label and date. 49 dossiers revised and archived |
| X3 · integrity close-out | Opus 5 xhigh | — |

### 9.5 · Where Phase X sits in the run order

Phase X does not displace coverage. The whole remaining program, in the order the developer will run it:

| Order | Sessions | Model | What |
|-------|----------|-------|------|
| 1 | X1, X2 | Fable High, then Medium | Close S2 while the Fable budget is fresh — these are the only unguarded surfaces, and both are bounded |
| 2 | F6 · F7 · F8 | Fable 5.1 High | The 9 remaining private subjects — §4's own rule assigns them to Fable, and F6 is the **first session to put data behind the `investor` chip** |
| 3 | C5 · C6 · C7 · C8 · C9 · C10 · C12 | Opus 5 xhigh | The 18 remaining public deep-record companies |
| 4 | 6 guide sessions | Opus 5 xhigh | The 26 backfills, 4–5 per session. **CHANGELOG rotation falls in this block** |
| 5 | X3 | Opus 5 xhigh | Integrity close-out |
| 6 | Phase D | Opus 5 xhigh | §6 — register re-checks, then the lessons the closures unlock |

**G6 is independent of all of the above** and is blocked on the developer, not on a model: it wants a guidance module, which needs a developer-supplied industry document run through the `industry guidance:` command. It can be handed over at any point without disturbing the order.

Developed by: LightAISolutions
