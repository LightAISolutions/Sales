# Profiler Coverage Plan — closing Classroom's gap register

**Approved by the developer on 2026-09-03 (v04.39r → v04.40r).** This is the working plan for the Profiler coverage expansion that Classroom's curriculum plan (`CLASSROOM-CURRICULUM-PLAN.md` §6, the gap register) asked for. It is ordered by **model**, not by tier, because that is how the developer will run it: every Fable 5.1 xhigh session first, then every Fable 5.1 High session, then every Opus 5 xhigh session, then back to the Classroom build. Read §2 for the model rule, §3–§6 for the phases, §7 for what every session does, and §8 for the status ledger — the one table that says what is done.

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
| **Opus 5 xhigh** | **Public companies with a deep first-party record**, where the schema and the checkers do the work and the two research subagents do the finding — and all **study-guide work on existing dossiers** | Half the rate against the weekly limit, no weekly cap, and the one batch this repo explicitly authored on Fable 5 (v02.20r) is indistinguishable in the CHANGELOG from the Opus batches |

**Confidence note.** This is judgment, not measurement — the repo has never compared dossier quality by model. Phase A doubles as the cheapest possible test: if Caterpillar's guide on xhigh reads no better than a High-effort guide, the developer can demote Piller, Dominion and Vicor to High before running them.

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

**Why these are Fable and not Opus.** Every company in Phase B is private, unit-level, or (for the utilities) public but regulatory-dense. The dossier's value is the strategy read and the confidence-tagged judgments, which is exactly the layer where the research subagents cannot help and the authoring model can.

---

## 5 · Phase C — Opus 5 xhigh (32 companies + 30 study guides)

Thirty-two companies with deep first-party records, **up to three per session, dossier + study guide each**, plus the guide work on existing dossiers. Roughly eleven dossier sessions and seven guide sessions. Run the register closers first (C1–C3), because they finish G2, G3, G4 and the turbine gap; then the power partners; then the public BESS and AIDC names; then the money; then the low-priority tail; and the guide backfill whenever a session has room.

| Group | Session | Companies | Category | Why |
|-------|---------|-----------|----------|-----|
| C-R | C1 | **Cummins** · **Rolls-Royce Power Systems (mtu)** · **Rehlko (Kohler Energy)** | supplier | Completes G2: #2 gen-set share (~16%, six dossiers name it); the hyperscale AI-hall gainer with its own BESS line; the fourth OEM |
| C-R | C2 | **Mitsubishi Electric** · **Powell Industries** · **Mitsubishi Power** | supplier | Large static UPS plus transformers and switchgear (G3); the MV switchgear specialist with a >$400M single data-center order and a $1.8B backlog (G4); the third gas-turbine OEM and Prevalon's former parent — bridge-power lessons cite only two of three today |
| C-R | C3 | **Infineon** · **Flex** | supplier | SiC/GaN for the 800 VDC chain, already tied to Delta in the corpus (G9); the NVIDIA GB300 power-shelf partner named in six dossiers — completes the rack-power set beside Delta, LITEON and Megmeet |
| C-P | C4 | **Talen Energy** · **Vistra** · **NRG Energy** | ipp | The Amazon nuclear-PPA precedent (six dossiers); the largest merchant BESS owner in the country with a growing data-center gas book; the third merchant with gas-for-AIDC deals |
| C-D | C5 | **ENGIE North America** · **AES Clean Energy** · **RWE Clean Energy** | developer | 5.6 GW of storage operating or building, absorbed Broad Reach, sold a 2.4 GW stake to CBRE IM; one of the biggest hyperscaler PPA counterparties (five dossiers); ~931 MW of US storage under construction |
| C-D | C6 | **Clearway Energy** · **Recurrent Energy** · **Form Energy** | developer · developer · supplier | Public yieldco with a large CAISO storage fleet; Canadian Solar's development arm (four dossiers); the long-duration reference `where-batteries-stop` needs — Google-backed, ~80 GWh reported backlog |
| C-D | C7 | **Power Electronics** | supplier | The leading US utility-scale PCS specialist (six dossiers) — pair with C6 if the session has room |
| C-A | C8 | **Digital Realty** · **CyrusOne** | developer | The largest missing AIDC landlord (13 dossiers; 2 GW Kansas City energy-service agreement); KKR/GIP-owned with a 760 MW Fairfield campus |
| C-A | C9 | **Cipher Mining** · **Hut 8** · **Galaxy Digital** | developer | The miner-pivot landlords: 300 MW AWS lease; $7B Anthropic/Fluidstack River Bend plus a $9.8B 352 MW Texas lease; 800 MW CoreWeave at Helios — >$19B of leases combined |
| C-I | C10 | **Blackstone** · **Brookfield** · **Macquarie** | investor | Owns QTS, seeded Aypa and VoltaGrid (12 dossiers); owns Compass and is buying Aypa; sold Aligned for $40B (8 dossiers) |
| C-L | C11 | **Oklo** · **Trane Technologies** · **McCarthy** | supplier · supplier · gc | The most-mentioned SMR vendor (5 dossiers, 35 hits) for G8; the chiller OEM for G7 (Motivair and Boyd Thermal already live inside Schneider's and Eaton's dossiers); the data-center GC the corpus names most |
| C-L | C12 | **Whiting-Turner** · **Gotion** · **REPT** | gc · supplier · supplier | Second DC general contractor; two FEOC case studies that complete the Chinese cell roster |

**Study-guide work (Opus 5 xhigh, 4–5 guides per session, `profiler prep <Company>`):**

- **Three revisions that close half of G3 and G4** — re-run prep on **Vertiv** and **Schneider Electric** so each carries a UPS section, and on **Siemens Energy** so it carries a grid-technology section instead of turnarounds and hydrogen. Prep overwrites in place; git history keeps the prior guide
- **Twenty-seven backfills, IPPs first** because the BESS buyer side has no guides at all: `apex-clean-energy`, `arevon`, `eolian`, `jupiter-power`, `key-capture-energy`, `lightsource-bp`, `nextera-energy-resources`, `plus-power`, `terra-gen` · then the six bridge-power suppliers `voltagrid`, `proenergy`, `enchanted-rock`, `mainspring-energy`, `on-energy`, `prevalon` · then `narada` (the G9 guide) with the integrators `canadian-solar`, `crrc-zhuzhou`, `envision-energy`, `hyperstrong`, `ls-energy-solutions`, `sunwoda`, `trina-storage` · then the EPCs `blattner`, `mastec`, `solv-energy`, `samsung-ct`

---

## 6 · Phase D — back to Classroom

When §8 shows every row done, the developer returns to the Classroom build — **backfill first, then continue**. In order:

1. **Re-run every register check and date it** in `CLASSROOM-CURRICULUM-PLAN.md` §6. Expected result: G2, G3, G4, G5, G7, G8, G9 and G10 close; G6 stays open (it wants a guidance module, not a dossier — commission it in the same pass if the developer wants the contributor-gated interconnection lesson); G11 and G12 unchanged
2. **Author the lessons the closures unlock**, one per Opus 5 session per the standing decision: `backup-generation` (A1 + C1), `the-ups-room` (A2 + Vertiv/Schneider revisions), `how-a-utility-buys` (A3 + B1/B2 — the first public utility lesson), a deepened `inside-the-rack` and `the-800-vdc-shift` battery side (A4 + C3 + the Narada guide), `the-transformer-and-the-substation` and `breakers-relays-and-faults` with a second and third vendor (C2 + the Siemens Energy revision), `who-buys-storage` and `how-a-storage-project-happens` on the new buyer guides (B3–B6, C5–C7), and `clean-firm-power` (C4 + C11)
3. **Then resume the cut line** at `redundancy-by-the-numbers` and the rest of the second wave, with the corpus now able to stamp them

---

## 7 · What every session does

The commands and their rules live in `.claude/rules/profiler-app.md` and `PROFILER-SCHEMA.md`; nothing here repeats them. What this plan adds is the **order** and the **bookkeeping** that every session in this program owes:

- **Dossier then guide, same commit.** `profiler <Company>` (two parallel research subagents, first-party exhaustive then third-party, ~50–70 sources) followed by `profiler prep <Company>` (lesson plan under `repository-information/study-prep/<slug>/` plus `<slug>.study.json` at schema v2). One push commit per session
- **After every profile write:** `python3 scripts/sync-profiler-registry.py`, `python3 scripts/build-profiler-graph.py`, `python3 scripts/check-profiler-study.py`. The roster, the graph and the study validator are three separate things that go stale separately
- **Calendar row.** Every new company gets a row in `repository-information/profiler-refresh-calendar.json`: public companies carry a researched `nextReport` / `confirmed` / `source` / `watch[]`; private and unit-level companies carry `cadence: "quarterly"`. The earnings desk is capped at three companies a day and this program adds ~65 rows, so expect the desk's queue to lengthen — that is by design, the calendar is the queue
- **README tree.** One entry per new `<slug>.profile.json` and `<slug>.study.json`, in the existing format
- **§8 of this file.** Flip the row in the same commit. Record a model substitution if the Fable cap forced one
- **Register checks.** At the end of each *phase* (not each session), re-run the §6 checks in `CLASSROOM-CURRICULUM-PLAN.md` and date them — a row is not closed until someone re-runs its check
- **The `utility` category does not exist yet.** `profiler-companies.json` declares `supplier · developer · integrator · epc · gc · ipp · investor · hyperscaler · neocloud · advisor · other`. Session **A3 (Dominion)** adds `utility`: the registry `categories` array, PROFILER-SCHEMA.md's category table, and `Profiler.html`'s chip label, `.ov-tag` colour, `known` list, compare peer groups and `OV_REL_CAT_COLORS` — a page version bump. Do not file utilities under `ipp` or `other` to avoid the change
- **`investor` and `advisor` have never held a company.** Session B10 (MGX, DNV, Sargent & Lundy) is the first to exercise those roster chips with data — include a visual check
- **CHANGELOG capacity** stood at 92/100 at approval. Archive rotation is mandatory above 100 and will fire around the eighth push of this program; budget for it in that session

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
VERIFY: sync-profiler-registry.py --check clean, check-profiler-study.py clean, the dossier and guide render
(Playwright), zero page errors. Normal Pre-Commit and Pre-Push checklists; push on a claude/* branch.
```

---

## 8 · Status ledger

**65 new companies** (4 on Fable 5.1 xhigh · 29 on Fable 5.1 High · 32 on Opus 5 xhigh) and **30 study-guide passes on existing dossiers** (3 revisions · 27 backfills). Slugs are proposals resolved per PROFILER-SCHEMA.md's slug rules at authoring time. `Dossier` and `Guide` read `—` until a session lands the file and writes the repo version in its place.

### New companies

| Session | Slug | Company | Categories | Model | Closes | Dossier | Guide |
|---------|------|---------|------------|-------|--------|---------|-------|
| A1 | `caterpillar` | Caterpillar | supplier | Fable 5.1 xhigh | G2 | v1 · v04.41r | ✓ · v04.41r |
| A2 | `piller` | Piller Power Systems | supplier | Fable 5.1 xhigh | G3 | v1 · v04.42r | ✓ · v04.42r |
| A3 | `dominion-energy` | Dominion Energy | utility (new) | Fable 5.1 xhigh | G5 | v1 · v04.43r | ✓ · v04.43r |
| A4 | `vicor` | Vicor | supplier | Fable 5.1 xhigh | G9 | v1 · v04.44r | ✓ · v04.44r |
| B1 | `southern-company` | Southern Company (Georgia Power) | utility | Fable 5.1 High | G5 | v1 · v04.45r | ✓ · v04.45r |
| B1 | `entergy` | Entergy | utility | Fable 5.1 High | G5 | v1 · v04.45r | ✓ · v04.45r |
| B2 | `oncor` | Oncor | utility | Fable 5.1 High → **Opus 5 xhigh** (weekly Fable cap bound mid-session; §2 substitution) | G5 | v1 · v04.46r | ✓ · v04.46r |
| B2 | `aep` | AEP | utility | Fable 5.1 High → **Opus 5 xhigh** (weekly Fable cap bound mid-session; §2 substitution) | G5 | v1 · v04.46r | ✓ · v04.46r |
| B2 | `xcel-energy` | Xcel Energy | utility | Fable 5.1 High → **Opus 5 xhigh** (weekly Fable cap bound mid-session; §2 substitution) | G5 | v1 · v04.46r | ✓ · v04.46r |
| B3 | `aypa-power` | Aypa Power | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B3 | `spearmint-energy` | Spearmint Energy | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B3 | `intersect-power` | Intersect Power | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B4 | `invenergy` | Invenergy | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B4 | `gridstor` | Gridstor | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B4 | `available-power` | Available Power | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B5 | `esvolta` | esVolta | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B5 | `strata-clean-energy` | Strata Clean Energy | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B5 | `hunt-energy-network` | Hunt Energy Network | developer · ipp | Fable 5.1 High | buyer side | — | — |
| B6 | `excelsior-energy-capital` | Excelsior Energy Capital | investor · developer | Fable 5.1 High | buyer side | — | — |
| B7 | `compass-datacenters` | Compass Datacenters | developer | Fable 5.1 High | AIDC developers | — | — |
| B7 | `edgecore` | EdgeCore Digital Infrastructure | developer | Fable 5.1 High | AIDC developers | — | — |
| B7 | `powerhouse-data-centers` | PowerHouse Data Centers | developer | Fable 5.1 High | AIDC developers | — | — |
| B8 | `fermi-america` | Fermi America | developer | Fable 5.1 High | AIDC developers | — | — |
| B8 | `tract` | Tract | developer | Fable 5.1 High | AIDC developers | — | — |
| B8 | `prime-data-centers` | Prime Data Centers | developer | Fable 5.1 High | AIDC developers | — | — |
| B9 | `fluidstack` | Fluidstack | neocloud | Fable 5.1 High | AIDC developers | — | — |
| B9 | `nscale` | Nscale | neocloud | Fable 5.1 High | AIDC developers | — | — |
| B9 | `anthropic` | Anthropic | hyperscaler | Fable 5.1 High | AIDC developers | — | — |
| B10 | `mgx` | MGX | investor | Fable 5.1 High | ecosystem | — | — |
| B10 | `dnv` | DNV | advisor | Fable 5.1 High | G10 | — | — |
| B10 | `sargent-lundy` | Sargent & Lundy | advisor | Fable 5.1 High | G10 | — | — |
| B10 | `coolit` | CoolIT Systems | supplier | Fable 5.1 High | G7 | — | — |
| B10 | `x-energy` | X-energy | supplier | Fable 5.1 High | G8 | — | — |
| C1 | `cummins` | Cummins | supplier | Opus 5 xhigh | G2 | — | — |
| C1 | `rolls-royce-power-systems` | Rolls-Royce Power Systems (mtu) | supplier | Opus 5 xhigh | G2 | — | — |
| C1 | `rehlko` | Rehlko (Kohler Energy) | supplier | Opus 5 xhigh | G2 | — | — |
| C2 | `mitsubishi-electric` | Mitsubishi Electric | supplier | Opus 5 xhigh | G3 | — | — |
| C2 | `powell-industries` | Powell Industries | supplier | Opus 5 xhigh | G4 | — | — |
| C2 | `mitsubishi-power` | Mitsubishi Power | supplier | Opus 5 xhigh | turbine gap | — | — |
| C3 | `infineon` | Infineon | supplier | Opus 5 xhigh | G9 | — | — |
| C3 | `flex` | Flex | supplier | Opus 5 xhigh | rack power | — | — |
| C4 | `talen-energy` | Talen Energy | ipp | Opus 5 xhigh | power partners | — | — |
| C4 | `vistra` | Vistra | ipp | Opus 5 xhigh | power partners | — | — |
| C4 | `nrg-energy` | NRG Energy | ipp | Opus 5 xhigh | power partners | — | — |
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
| C11 | `oklo` | Oklo | supplier | Opus 5 xhigh | G8 | — | — |
| C11 | `trane-technologies` | Trane Technologies | supplier | Opus 5 xhigh | G7 | — | — |
| C11 | `mccarthy` | McCarthy Building Companies | gc | Opus 5 xhigh | GC completeness | — | — |
| C12 | `whiting-turner` | Whiting-Turner | gc | Opus 5 xhigh | GC completeness | — | — |
| C12 | `gotion` | Gotion High-Tech | supplier | Opus 5 xhigh | FEOC roster | — | — |
| C12 | `rept` | REPT Battero | supplier | Opus 5 xhigh | FEOC roster | — | — |

### Study guides on existing dossiers (Opus 5 xhigh)

| Kind | Slug | Company | Why | Guide |
|------|------|---------|-----|-------|
| revision | `vertiv` | Vertiv | add a UPS section (G3) | — |
| revision | `schneider-electric` | Schneider Electric | add a UPS section (G3) | — |
| revision | `siemens-energy` | Siemens Energy | add a grid-technology section (G4) | — |
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
| backfill | `narada` | Narada | G9 — the backup-power incumbent | — |
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

Developed by: LightAISolutions
