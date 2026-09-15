# Landscape — Power Conversion and Rack-Power Silicon — Analysis & Module Source

**Module id:** `landscape-power-conversion-and-rack-power-silicon-2026-09` · lane **The Value Chain** · tier **contributor**
**Authored:** 2026-09-15 (S2 session 5) · **Provenance:** corpus synthesis over the segment's member dossiers at the versions in the claims ledger; no ingested document

## What this is

The fifth **landscape module** (S2 session 5) and the fifteenth guidance module. It is the judgment layer over `profiler-segments.json`'s `power-conversion-and-rack-power-silicon` segment: who dominates the conversion layer and on what basis, who threatens it and on which route, what each ranked player is betting, what to watch, and what a BESS or AIDC-power seller does with it.

It is **corpus synthesis only** — the twenty member dossiers and the segments registry, at the versions the claims ledger pins. No ingested document, no web research, no new primary sourcing. Where a claim is analysis rather than fact it is labelled as such, because more than half of this segment's interesting content lives in `strategyRead[]`, which the dossiers already mark as assessment.

It is also the second landscape to land on a segment an existing guidance module covers — see §2, which was written before anything else in this file.

## The segment as measured

Re-measured from `live-site-pages/profiler-data/profiler-segments.json` on **2026-09-15**, the authoring day. The brief's figure was confirmed exactly, member for member — the fourth consecutive S2 session in which that has happened.

- **20 members — 9 incumbent · 3 challenger · 8 adjacent**
- **Position 3, tier `supply`**
- **Six `buyingCriteria`** — efficiency at the operating point; grid-forming and ride-through (utility scale) or NVIDIA platform qualification (rack scale); power density in kW per shelf, kW per rack, MW per skid; manufacturing location under the FCC inverter rule and EO 14420; second-source status and roadmap alignment (800 VDC, Vera Rubin); patent position on bus conversion and vertical power delivery
- **`notes`: none.** Unlike `utilities` — where §10.6 (l) records that the registry's `notes` field pre-explained the challenger role — this segment's registry says nothing extra, so the roles have to be read off the twenty `basis` lines and the dossiers themselves.

| Role | Members |
|---|---|
| **incumbent** (9) | `sungrow` · `huawei-digital-power` · `delta-electronics` · `liteon` · `infineon` · `sinexcel` · `power-electronics` · `zhonhen` · `vicor` |
| **challenger** (3) | `megmeet` · `flex` · `heron-power` |
| **adjacent** (8) | `ge-vernova` · `abb` · `eaton` · `schneider-electric` · `hitachi-energy` · `nvidia` · `tesla` · `ls-energy-solutions` |

Twenty members puts the `each-players-bet` table at **twelve rows** (one per incumbent and challenger, per §10.6) — between the utilities landscape's eight and the cells landscape's fifteen, and well short of the developers-and-IPPs landscape's twenty-seven. §10.6 (m) says section proportions follow the segment rather than the last module; twelve is what this roster is.

**The structural fact the roster states and the role labels hide.** The nine "incumbents" are not nine vendors of one thing. They occupy *different stages of one chain* — utility-scale PCS (`sungrow`, `sinexcel`, `power-electronics`), the integrated Eastern AIDC power stack (`huawei-digital-power`), the NVIDIA rack power shelf (`delta-electronics`, `liteon`), the hall-edge HVDC block (`zhonhen`), the last centimetre at the die (`vicor`), and the silicon every one of those is built from (`infineon`). Two of them barely compete with each other at all. That is unusual among the five landscapes built so far, and it is the single fact that most shapes how the `who-dominates-and-on-what-basis` section has to be written: **stage by stage, not one ranked list.**

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

1. `who-dominates-and-on-what-basis` — prose, stage by stage
2. `who-threatens` — prose, three challengers on three different routes
3. `each-players-bet` — table, twelve rows, `strategyRead[]`-derived and labelled analysis
4. `the-indicators` — table, what to watch, dated where the record dates it
5. `the-sellers-play` — callout, the two §10.10 paths
6. `claims-ledger` — ledger, every load-bearing claim → dossier field at its `profileVersion`
7. `what-the-record-does-not-say` — callout
8. `drill` — flashcards
9. `check-yourself` — quiz, judgment at the group level

## 1. Executive read

**One chain, nine incumbents, and a voltage change that deletes a stage.** This segment converts power at every voltage between the medium-voltage room and the processor die. The AI build-out is pushing it through the largest architectural change it has had in decades — the move to an 800 VDC distribution bus — and the effect on the *parties* is not uniform. It creates a stage (the hall-edge MV-to-800 VDC block), compresses a stage (the in-rack conversion chain), and threatens to delete a stage (the discrete AC/DC front end in every rack). Who wins depends less on who is best at conversion than on **which stage each player's revenue currently sits in**.

**The position is not decided by engineering in the US market — it is decided by an origin test.** Two 2026 instruments — the FCC's inverter Covered List entry (28 July, refined 20 August) and Executive Order 14420 (26 August) — turn on *where equipment is manufactured*, not on who owns the manufacturer. On the corpus record that has already re-sorted this roster: it closes the US to the corpus's largest single inverter importer, and it catches a Spanish manufacturer that reads itself as a US business on identical terms. The second-order effect matters more to a seller than the first: it is a durable share subsidy to whoever can pass the domestic-end-product or §45X test.

**The rack-power fight is a three-name fight with contested evidence, and the corpus says so.** Delta is first-qualified in the NVIDIA rack and publishes the only complete grid-to-chip 800 VDC stack. LITEON is the leading second source with the BBU franchise. Megmeet is the only mainland vendor NVIDIA has named for GB200 NVL72 power. Chinese trade press reports Megmeet displacing LITEON at #2; three dossiers record that report and **all three mark it unsourced or contested**, and Megmeet's own 238-page interim names no competitor and claims no rank. A seller who repeats the displacement claim as fact is repeating a rumour the corpus has already flagged twice.

**The most defensible individual position in the segment is not a shipment share — it is a patent.** Vicor is absent from every published NVIDIA 800 VDC partner list and is nevertheless the one member whose conversion economics improved fastest, because an ITC exclusion order turned its bus-converter patents into a licensing business: royalty revenue 3.9 % → 13.0 % → 14.1 % of net revenues across 2023–2025. The segment's sixth buying criterion — "patent position on bus conversion and vertical power delivery" — exists because of this, and it is the criterion no competitor can close by building a better product.

**The silicon layer underneath is one company's to lose, and its nearest dated risk is a Chinese export licence.** Infineon is the only vendor in NVIDIA's 800 VDC silicon tier publishing across the entire chain in all three materials, and Gartner's "company to beat". It is also downstream of gallium, whose export the Chinese Ministry of Commerce controls and has banned before; the current suspension of that ban in favour of licensing **expires 27 November 2026**, which is this module's `reviewBy` (§10).

## 2. The split with `nvidia-800vdc-2026-08` — decided and written before any other section

*Written first, per the rule §7.23 established at the utilities landscape and §10.6 (j) records: when a landscape lands on a segment an existing guidance module already covers, the split is settled before the module is drafted. This is the second time the rule has fired and the overlap is far sharper than the first — `utility-aidc-procurement-2026-08` covered a **process** that ran over the utilities segment, whereas `nvidia-800vdc-2026-08` covers the **architecture of the exact layer this segment is defined as**. The segment's own one-sentence definition names "the solid-state transformer and MV-to-800 VDC sidecar, the power shelf, PSU and BBU shelf in the rack, the bus converter and point-of-load regulator at the die" — and that string is a table of contents for the other module.*

### The line

**`nvidia-800vdc-2026-08` owns the architecture. This landscape owns the parties.**

The other module answers *what the voltage change is, why it happens, and what it deletes*: the four deployment architectures (the AC baseline, Option A's rack-level Power Rack, Option B's cluster-level Power Center, Option C's hall-edge DC Power Block and its MV-direct successor), the TRU-versus-SST device-class comparison, the four grounding schemes, the two protection zones and the interlock, the SSCB target ratings against the Day-1 MCCB, the certification strategy and the twelve-month plan. It is an engineering-execution document and it is **deliberately vendor-blind** — its own `what-the-paper-does-NOT-say` section states that it carries "no power-equipment vendor names beyond the Siemens chart credit and UL Solutions" and that "Panama" names an architecture, not a company.

This landscape answers *who is standing where along that architecture*: which nine incumbents hold which stage of the conversion chain and on what third-party or dossier basis, which three challengers are attacking and on which route, what each of the twelve is betting, and what the eight adjacents — the buyer who prescribes the architecture, the five facility-power OEMs hedged across it, and two captive converters — do to the competitive shape of the layer.

### The test §7.23 set, applied

**The split is genuine when the one number both documents cite does a different job in each.** The number here is **~2029 — the next-generation SST launch**.

- In `nvidia-800vdc-2026-08` it is a **roadmap gate**. It sits in the `roadmap` timeline's ecosystem lane and in the `trusst` table's Timing row, and it answers a buildability question: *when does 34.5 kV-direct conversion become an option I can specify?* The module's own `sales` note on that section exists to stop a reader over-reading it — the date "belongs to next-gen SST specifically", and TRU-based blocks are being specified now.
- In this landscape the same date is a **position clock**. It dates how long the TRU-based incumbents hold the first-deployed block slot; it dates the survival requirement on the one challenger whose entire product is the post-2029 device (Heron Power's own dossier reads mass production at late 2027 and calls a one-year slip "fatal to the data-center thesis"); and it dates the hedge that five of the eight adjacents are carrying across both the TRU bridge and the SST target at once. It answers *who is exposed, and for how long.*

Same figure, two jobs: one tells a buyer what is buildable, the other tells a seller who is exposed. A second shared figure behaves the same way — **4.8 MW**, which is a *design standard* in the other module (the standardized block, the 6000 A switchboard, the 1250 A busways) and an *entry barrier* here, the composition test that sorts vendors by whether their lineup parallels into it.

### What this landscape therefore does not carry, by construction

Six things the other module owns and this one omits on purpose, listed so a later revision does not quietly import them:

| Omitted here | Owned by `nvidia-800vdc-2026-08` |
|---|---|
| The four deployment architectures (A / B / C / C next-gen) | its `options` section |
| The TRU-versus-SST device-class comparison | its `trusst` section |
| The four grounding schemes (HRMG / HRRG / floating / solid) | its `grounding` section |
| Protection zones, the interlock sequence, SSCB ratings | its `zones` section |
| The rack-power ladder 145 → 330 → 570 → ~1,000 kW | its `roadmap` and `power` sections |
| Certification strategy and the twelve-month plan | its `cert` section |

The module names `nvidia-800vdc-2026-08` by title in its opening section and closes `check-yourself` on the distinction, exactly as the utilities landscape does with the procurement playbook.

### The second and third overlaps — the two policy modules

The segment's registry carries six `buyingCriteria`, and one of them — **"Manufacturing location under the FCC inverter rule and EO 14420"** — is a criterion two existing modules already teach as instruments.

- **`eo14420-bulk-power-2026-08` owns the instrument.** It is the module that defines "foreign-produced" under §5(c) as *not manufactured, produced, or assembled in the United States*, that records the FCC's inverter Covered List using the same phrase for the same named equipment with a **different** test — neither §45X-eligible nor a domestic end product under 48 CFR 25.101(a) — and that states the two can therefore disagree about a single unit. None of that mechanism is restated here.
- **`china-policy-stack-2026-08` owns the four federal machines** — tax FEOC/PFE, tariff, the defence §154 / NDAA phase-in, and the domestic-content adder — plus the effective-control licensing indicia. None of that is restated here either.
- **This landscape owns the re-sorting.** It states which members sit which side of the origin test and what each built in response, and points at the two modules for the tests themselves.

That division is not a formality on this segment, because the origin test re-orders the roster in a way no reading of the instrument alone predicts. The vivid case is **Power Electronics España**: a Spanish manufacturer at roughly 70 % US revenue, covered by the FCC rule on **exactly the same footing as a Chinese vendor**, because the test is where the hardware is made rather than who owns the maker — while its own dossier reads it as "a United States business that happens to manufacture in Spain". A landscape that deferred the whole criterion to the policy modules would lose that; a landscape that re-taught the two definitions would be duplicating them. Stating the sorting and citing the instrument is the line.

## 3. Who dominates, and on what basis — stage by stage

The roster's nine incumbents do not rank against each other on one axis, so the module's `who-dominates-and-on-what-basis` section is organised by **stage of the chain** rather than as a league table. Each stage names the incumbent and the third-party or dossier basis for the claim.

**Utility-scale PCS and inverters.** `sungrow` is the only member holding two Wood Mackenzie crowns simultaneously — No. 1 in the Global PV Inverter Manufacturer ranking and No. 1 in the Global BESS Integrator ranking (2026 edition, assessing 2025) — plus a sixth BloombergNEF inverter-bankability ranking, on 143 GW of company-reported 2025 inverter shipments. `huawei-digital-power` holds the other global #1 claim at the franchise level (FusionSolar, 176 GWac shipped in 2024) and is the benchmark Western vendors are measured against outside NATO geographies, while being a structural non-factor in the US. `sinexcel` is a third-party PCS supplier whose position the corpus deliberately leaves unresolved: BloombergNEF named it a Tier 1 power-inverter manufacturer for Q1 2026, and CNESA's 2025 China PCS shipment Top 10 does not list it at all — a bankability tier and a shipment ranking measure different things, and its disclosed strength is C&I and microgrid rather than utility-scale GW. `power-electronics` is the layer itself rather than a ranked competitor: it makes no cells and sells no turnkey system, which is **why** Wood Mackenzie's integrator ranking structurally cannot contain it, and its own dossier records the C7 verdict that no independent US conversion ranking exists to place it in.

**The NVIDIA rack power shelf.** `delta-electronics` is the incumbent standard — first-qualified power-shelf supplier for GB200/GB300 NVL72, TrendForce's named primary beneficiary of the 800 V HVDC shift, and the only vendor publishing a complete grid-to-chip 800 VDC stack from solid-state transformer through DC-DC brick to liquid-cooled busbar. `liteon` is the leading second source, differentiated by a battery-backup-unit franchise it has invested in since 2010 and by PSU-BBU firmware co-design, with its own 800 V power rack reaching mass production Q1 2027 — about a step behind Delta, and routed to ASIC customers first.

**The hall-edge HVDC block.** `zhonhen` leads China's data-centre HVDC market at 31 % share on independent data (Kezhi Consulting, 2025; CR3 72 %), lead-authored the national 240 V/336 V DC standard, and co-developed the Panama architecture with Alibaba — the one-stage 10 kV-to-DC conversion that NVIDIA's August 2026 execution paper names as a transformer-rectifier-unit implementation of its own data-hall block. Architectural endorsement and commercial inclusion are separate questions and only the first has been answered: exports are 4.1 % of revenue and it is absent from every published NVIDIA partner roster.

**The last centimetre.** `vicor` is the corpus's reference for taking an 800 V or 400 V rack bus to 48 V and then to about one volt at a thousand amps beside the processor — fixed-ratio bus converters, current multipliers, 128 patents. It is absent from NVIDIA's May 2025, October 2025 and March 2026 partner lists, and its route into those racks is the module socket at the contract manufacturer plus the patent, not a listing.

**The silicon.** `infineon` supplies the switches, drivers, controllers and protection devices every box above is built from — silicon, silicon carbide and gallium nitride, from the solid-state transformer to the point of load. Gartner named it "the company to beat" in AI data-centre power semiconductors on 18 May 2026, and it is the only vendor in NVIDIA's 800 VDC silicon tier publishing across the whole chain in all three materials. The same Gartner report pairs that with the observation that its lead is being tested at the compute-board level, where it is one of five rather than first — and NVIDIA's own roster names thirteen other silicon providers, so no sole-source reading survives.

**The honest caveat the section carries (C8).** Four of these nine stage-leadership claims rest on a ranking somebody publishes; three rest on a qualification set reported by trade press; one (`power-electronics`) rests on the *absence* of a ranking, stated as such; and one (`vicor`) rests on an ITC determination rather than any market measure. The bases are not commensurable, and the module says so rather than flattening them into an ordering.

## 4. Who threatens, and on which route

Three challengers, and — as at `utilities`, though for a different reason — they are **not a smaller version of the incumbents**. Each is attacking on a different route, and only one of the three is attacking the same stage it would eventually occupy.

**`megmeet` — the qualified-but-unranked mainland entrant, attacking on architecture timing.** Its H1 2026 interim states in the company's own words that it is one of NVIDIA's designated recommended data-centre power suppliers, participating in the Blackwell and Vera Rubin power and HVDC programmes. That is **membership of a set, not a position within it** — the interim names no competitor in 238 pages and makes no share or rank claim. It publishes the full grid-to-GPU chain (edge cabinets rectifying 380–480 VAC directly to 800 VDC at over 1 MW per rack, an SST still in development, power/BBU/supercapacitor shelves, CRPS with 800 VDC input). Its wedge is assessed as *moving first among mainland vendors on the 800 VDC sidecar-plus-SST full chain*, not price, and it is funding the pivot out of a declining appliance-controls business — FY2025 profit ex-non-recurring items fell 93 % concurrent with the 800 VDC build-out.

**`flex` — the challenger that bought its way up the chain, attacking on scope.** NVIDIA's roster places Flex Power in the same power-system-components tier as Delta, LITEON and Megmeet, but Flex also owns the switchgear (Anord Mardix, Crown Technical Systems, Electrical Power Products) and the cooling (JetCool), so it can quote a buyer from the medium-voltage room to the cold plate. Roughly **$6.3 bn of acquisitions**, two thirds committed in the sixteen months after the AI build-out began, culminating in the **$4.4 bn EPC Power** agreement of 3 September 2026. The complication a seller must know: the board approved separating Cloud and Power Infrastructure on 5 May 2026, targeted for Q1 calendar 2027 — so the entity being competed against is being reconstituted mid-fight.

**`heron-power` — the pre-production specialist, attacking the stage that does not exist yet.** A 34.5 kV-to-800 V DC solid-state transformer whose specification maps one-to-one onto the MV-direct block the architecture reserves for its next generation. It has **no shipped unit, no independently checkable datasheet, no UL listing on the record**, and two named customer engagements (an Intersect Power quote, a Crusoe letter of intent). It is the only startup on NVIDIA's facility-tier roster. Its own dossier states the exposure plainly: mass production begins late 2027 against an architecture that attaches MV-direct SSTs to "toward 2029", which is survivable if the factory holds schedule and **fatal to the data-center thesis if it slips a year** — because the five adjacent incumbents it sells against are hedged across both the TRU bridge and the SST target.

**What the three have in common, and it is not size.** None of them is attacking an incumbent's ranking. Megmeet is attacking a *qualification slot*, Flex a *scope boundary*, Heron a *device generation*. The threat to this segment's incumbents is therefore not share loss to a cheaper rival — it is **stage obsolescence**: the architecture removes conversion stages, and whoever's revenue sits in a removed stage loses regardless of how well they execute.

## 5. Each player's bet — the twelve

One row per incumbent and challenger, per §10.6. Every bet is drawn from the dossier's `strategyRead[]` and is **labelled as analysis** in the module, never blended with the fact rows. The adjacents get no row — they are not ranked players in this segment — but §4's closing paragraph and §6's indicators carry what they do to it.

| Player | Role | The bet (analysis, from `strategyRead[]`) |
|---|---|---|
| `sungrow` | incumbent | That two Wood Mackenzie crowns and a sixth BNEF bankability ranking travel outside the US faster than the US closes — while conceding the US by gradual pullback, and accepting that storage now carries the revenue at the lower margin (50.00 % of H1 2026 revenue at 32.43 % against the inverter line's 42.72 %) |
| `huawei-digital-power` | incumbent | That the integrated-solution tier (PowerPOD prefab blocks, 18-week delivery) wins the geographies it can still sell into, and that engineering leadership in grid-forming ESS eventually travels — accepting that regulation, not engineering, sets its ceiling |
| `delta-electronics` | incumbent | That first-qualification compounds: own the rack power shelf through the architecture change, lock the silicon supply, publish the only complete grid-to-chip stack, and let BOM-per-watt growth do the rest — while conceding that the margin narrative has peaked near-term |
| `liteon` | incumbent | That the battery-backup franchise becomes non-discretionary as BBUs move from optional to standard, and that routing the 800 V ramp through ASIC customers first is a better trade than racing Delta to the GPU slot |
| `infineon` | incumbent | That portfolio breadth across silicon, SiC and GaN — from the solid-state transformer to the point of load — beats any single device, and that the profit follows the revenue eventually rather than immediately |
| `sinexcel` | incumbent | That overseas utility PCS margin (61.3 % FY2025 gross margin on the storage export line) plus grid certifications used as tender queue-jumps sustain a differentiated niche, with AI data-centre power as optionality rather than revenue |
| `power-electronics` | incumbent | That being the conversion layer itself — no cells, no turnkey system — is a durable position for developers who want to unbundle, and that grid-forming as standard is the feature that matters; against an origin rule that treats its Spanish plant exactly as it treats a Chinese one |
| `zhonhen` | incumbent | That an architecture China has run at scale for six years is now globally validated, and that a Singapore-brand JV structure buys speed into the West with minimal listco capital at risk — while the interim converts none of the validation into a disclosed order |
| `vicor` | incumbent | That the patent is the product: exclusion orders bring OEMs to the licensing table, and licensing is the faster-growing, higher-margin half of the company — a position no competitor closes by building a better converter |
| `megmeet` | challenger | That architecture timing, not price, is the wedge into a Delta-dominated market — funded out of a declining industrial base, and packaged geographically (Thailand, a Dallas test lab, India, an HK listing) to be buyable by American AI-infrastructure buyers |
| `flex` | challenger | That owning switchgear plus cooling plus rack power lets it quote grid-to-chip scope no component vendor can match — bought rather than built, and about to be separated into its own company mid-fight |
| `heron-power` | challenger | That the second wave of the 800 V transition is worth more than the first, and that being the only startup on the facility-tier roster converts into the MV-direct slot — on a schedule with no shipped unit behind it |

**A note on the shape of this table.** Nine of the twelve bets are defensive in the specific sense that they protect a stage the architecture is changing; three (`vicor`, `flex`, `heron-power`) are bets on a *different* basis of competition entirely — a patent, a scope boundary, a device generation. That is the ratio worth carrying into a room, and it is the reason the table is not sorted by revenue.

## 6. The indicators

What to watch, dated where the record dates it. Drawn from `recentDevelopments[]` and `policyExposure[]` across the roster; the module renders this as a table with the date, the indicator and what a move in it would mean.

| Date on record | Indicator | What a move means |
|---|---|---|
| 2026-11-27 | China's gallium/germanium export **licensing regime expires** — the suspension of the outright US ban lapses | The input to gallium nitride. A lapse without renewal re-prices the GaN half of the silicon layer and reaches every box above it. **This module's `reviewBy`** |
| 2026-12-24 | **DOE must publish EO 14420 implementing rules** — the rules define the covered countries and companies | Until they land, which members are actually caught is unknowable; the corpus says so explicitly rather than guessing |
| 2026-Q4 | **Flex/EPC Power closes** ($4.4 bn, agreed 2026-09-03) | Removes the fourth independent US conversion business in four years — after EKS Energy → Hitachi Energy (2023), Dynapower → Sensata (2022), Gamesa Electric → ABB (2025) |
| 2027-Q1 | **Flex separates** Cloud and Power Infrastructure (board-approved 2026-05-05) | The grid-to-chip scope argument either survives as a focused company or fragments |
| 2027-Q1 | **LITEON's 800 V power rack reaches mass production**, ASIC customers first | The second-source position either lands a step behind Delta as planned, or slips |
| 2027-04 | **EU high-risk inverter phase-out** — new EU-funded contracts fully incorporate the restrictions | The only future `effectiveDate` in any member's `policyExposure[]` field; scoped to EU-funded projects, not the European market at large |
| late 2027 | **Heron Power mass production begins** | The one challenger with no shipped unit; its own dossier calls a one-year slip fatal to the data-center thesis |
| 2027 | **Vicor's second ITC case reaches final determination**; the CFO ties the next licence tranche to it | Tests whether the patent-as-product bet is repeatable or was a one-off |
| ~2029 | **Next-generation SST launch** unlocks 34.5 kV MV-direct | The position clock of §2 — how long the TRU incumbents hold the first-deployed block slot |
| standing | **The Delta / LITEON / Megmeet rack-shelf ranking** | Contested and unsourced on the record. A *sourced* ranking appearing is itself the news |

**Three of these ten are policy dates and two of those are not yet knowable in their effect** — which is the honest state of this segment's regulatory exposure and is stated that way rather than smoothed.

## 7. What it means for the active engagement — the seller's play

Per §10.10's two implicit role paths, written for a BESS seller and an AIDC-power seller respectively.

**For a BESS seller.** The conversion layer is now a *separable purchase*. `power-electronics` exists as a covered company precisely because a developer can unbundle conversion from storage, and `sinexcel` sells a modular version around the integrators. That means two things in a room: first, when a buyer asks about grid-forming or ride-through, the answer belongs to the PCS and can be sourced independently of the battery — do not let an integrator's bundle foreclose the question. Second, the origin test cuts through the bundle: an AC block whose PCS fails the domestic-end-product or §45X test carries the whole system's exposure, so **ask which entity manufactured the conversion stage**, not who badged the container.

**For an AIDC-power seller.** Three moves. (1) **Know which stage you are selling into**, because the architecture creates one stage, compresses one and deletes one — and the twelve bets in §5 are all bets about which. (2) **Do not repeat the rack-shelf displacement claim.** Three dossiers record it and all three mark it contested; a seller who states it as fact is handing the room a correction. Say what is sourced: Delta first-qualified, LITEON the leading second source, Megmeet the only mainland vendor NVIDIA named for GB200 NVL72 power. (3) **The 4.8 MW composition question is the qualifying question**, and it is the one number in §2 that does a different job here than in the architecture module: a vendor whose module rating sits below the standard block has to answer how the lineup parallels into it, and how it meets the busway and tap-can interfaces. A vendor who cannot answer is not yet in the segment, whatever the datasheet says.

**What the seller should not try to do with this module.** It does not teach the architecture — send the reader to `nvidia-800vdc-2026-08` for that — and it does not teach the two origin tests, which are `eo14420-bulk-power-2026-08`'s and `china-policy-stack-2026-08`'s. Its job is the parties.

## 8. Claims ledger

Every load-bearing claim above traces to a dossier, at that dossier's `profileVersion` **read on 15 September 2026**, and to the field inside it. **The dossiers carry the primary sources; this ledger carries the dossiers** — that is the whole provenance chain for a corpus-synthesis module, and it is why no publisher appears in the Source column. In the in-app module the same ledger is rendered with the refs in **plain text**, never backticks: `clFmt` resolves `**bold**`, `*italic*` and `{{term}}` and nothing else, so a backtick would render literally to the reader (§10.6 (b)).

The registry is cited at the repo version of its **last change** (v05.41r, 2026-09-13), not at this session's version — the file did not move this session and citing it at v05.83r would imply it had.

| # | Claim | Source |
|---|---|---|
| 1 | Segment holds 20 members — 9 incumbent, 3 challenger, 8 adjacent; chain position 3, tier supply | `profiler-segments.json` @ v05.41r — `segments[].members[]`, `.position`, `.tier` |
| 2 | The segment's definition names PCS/inverters, the SST and MV-to-800 VDC sidecar, the power/PSU/BBU shelf, the bus converter and point-of-load regulator, and the SiC/GaN silicon | `profiler-segments.json` @ v05.41r — `segments[].definition` |
| 3 | The six buying criteria, including manufacturing location under the FCC inverter rule and EO 14420, and patent position on bus conversion and vertical power delivery | `profiler-segments.json` @ v05.41r — `segments[].buyingCriteria[]` |
| 4 | The segment's `notes` field is empty — no registry guidance on the role labels | `profiler-segments.json` @ v05.41r — `segments[].notes` |
| 5 | Segment depths used for the table-size comparison (27 / 15 / 12 / 8 rows across the four built landscapes) | the four built landscape modules' `each-players-bet` sections, counted 2026-09-15 |
| 6 | Sungrow: No. 1 in both Wood Mackenzie 2026 rankings (BESS integrator and PV inverter), first to take the integrator top spot from Tesla, sixth BNEF inverter-bankability ranking | `profile:sungrow` @ v9 — `ecosystemRole`, `strategyRead[0]` |
| 7 | Sungrow 2025 company-reported shipments: 43 GWh storage (+53.5 %), 143 GW inverters | `profile:sungrow` @ v9 — `ecosystemRole` |
| 8 | Sungrow ESS at 50.00 % of H1 2026 revenue at 32.43 % gross margin against the inverter line's 42.72 %; overseas 73.40 % of H1 2026 revenue | `profile:sungrow` @ v9 — `ecosystemRole`, `strategyRead[1]` |
| 9 | Sungrow identified by PV Tech Research as the largest single importer of solar PV inverters into the US; its own guidance is a gradual pullback from that market | `profile:sungrow` @ v9 — `ecosystemRole`, `strategyRead[2]` |
| 10 | The FCC test is a Buy American origin standard and neither determination names a company; §45X-eligible US manufacture is the only route back in | `profile:sungrow` @ v9 — `strategyRead[2]`; `profile:huawei-digital-power` @ v8 — `strategyRead[4]` |
| 11 | Sungrow's EnerNeo SST gives it an MV-AC-to-800 V-DC stage, stated in an audited interim as launched; its own curve is small-batch trials through 2026, batch orders 2027, scale 2028 | `profile:sungrow` @ v9 — `strategyRead[3]` |
| 12 | Huawei Digital Power: global #1 PV inverter franchise, FusionSolar, 176 GWac shipped 2024 | `profile:huawei-digital-power` @ v8 — `productsAndServices` |
| 13 | Huawei is the benchmark Western AIDC power vendors are measured against outside NATO geographies and a structural non-factor in the US; PowerPOD 2.4–3.2 MW containerized blocks, 18-week delivery | `profile:huawei-digital-power` @ v8 — `ecosystemRole`, `strategyRead[1]` |
| 14 | Huawei's AIDC ceiling is set by regulation rather than engineering — Entity List, NDAA 889, the FCC entry, and EU-funded projects closing April 2027 | `profile:huawei-digital-power` @ v8 — `strategyRead[0]`, `policyExposure[]` |
| 15 | Delta is the first-qualified power-shelf supplier for GB200/GB300 NVL72 and TrendForce's named primary beneficiary of the 800 V HVDC shift | `profile:delta-electronics` @ v5 — `ecosystemRole`, `strategyRead[0]` |
| 16 | Delta publishes the only complete grid-to-chip 800 VDC stack (SST → DC-DC brick → liquid-cooled busbar) and has a reported $2bn SiC supply lock with Infineon | `profile:delta-electronics` @ v5 — `ecosystemRole`, `strategyRead[0]` |
| 17 | Delta's own guidance: H2 2026 gross margins will not exceed ~35.6 % against Q1's record 37.0 % — the margin narrative has peaked near-term | `profile:delta-electronics` @ v5 — `strategyRead[1]` |
| 18 | The Megmeet-displaces-LITEON rack-shelf report is Chinese-press, directionally corroborated but of unverified precision | `profile:delta-electronics` @ v5 — `strategyRead[2]` |
| 19 | The same report conflicts with LITEON's record shipments and two new North American CSP additions; both can be true if the market grows faster than share shifts | `profile:liteon` @ v6 — `strategyRead[2]` |
| 20 | The same report is **unsourced** and now weaker, not stronger: Megmeet's H1 2026 interim names no competitor in 238 pages and claims no rank; two independent supplier notes name Delta and LITEON without mentioning Megmeet | `profile:megmeet` @ v7 — `ecosystemRole`, `strategyRead[1]` |
| 21 | LITEON is the leading second source in NVIDIA-class rack power; BBU franchise invested in since 2010, first large cloud adoption 2017; PSU-BBU firmware co-design | `profile:liteon` @ v6 — `ecosystemRole`, `strategyRead[0]` |
| 22 | LITEON's 800 V power rack reaches mass production Q1 2027, ASIC customers first, GPU clients potentially Q2 2027 — about a step behind Delta | `profile:liteon` @ v6 — `ecosystemRole`, `strategyRead[1]` |
| 23 | BBUs move from optional (GB200) to standard (GB300/Rubin); 2025 BBU shipments ~30× the prior year against acknowledged capacity constraints | `profile:liteon` @ v6 — `strategyRead[0]` |
| 24 | Infineon is the silicon layer from the SST to the point of load in silicon, SiC and GaN; NVIDIA's roster places it in the silicon tier, Delta/Flex/LITEON/Megmeet in power system components, and ABB/Eaton/Schneider/Vertiv/Hitachi Energy/GE Vernova/Mitsubishi in data-centre power systems | `profile:infineon` @ v1 — `ecosystemRole` |
| 25 | Gartner named Infineon "the company to beat" in AI data-centre power semiconductors on 18 May 2026, while observing its lead is tested at the compute-board level where it is one of five | `profile:infineon` @ v1 — `ecosystemRole`, `strategyRead[0]` |
| 26 | The NVIDIA relationship is real, product-level and **not exclusive** — the same roster names thirteen other silicon providers | `profile:infineon` @ v1 — `strategyRead[1]` |
| 27 | Infineon's reported AI data-centre revenue moved from €250m in FY2024 to above €700m | `profile:infineon` @ v1 — `strategyRead[0]` |
| 28 | Gallium is the input to gallium nitride; China's export ban on gallium and germanium to the US is **suspended in favour of a licensing regime until 27 November 2026**, military-end-user prohibition still in force; Infineon acquired GaN Systems in 2023 and its GaN bus converters are a named part of the 800 VDC portfolio | `profile:infineon` @ v1 — `policyExposure[]` (regime: China gallium and germanium export controls; `effectiveDate` 2023-08-01 holds the earlier step) |
| 29 | Sinexcel: BNEF Tier 1 power-inverter manufacturer for Q1 2026, but absent from CNESA's 2025 China PCS shipment Top 10 — a bankability tier and a volume ranking measure different things and the corpus carries both | `profile:sinexcel` @ v8 — `ecosystemRole` |
| 30 | Sinexcel's margin engine is overseas utility PCS — 61.3 % FY2025 gross margin on the storage export line; StellaON grid certifications function as tender queue-jumps | `profile:sinexcel` @ v8 — `strategyRead[0]` |
| 31 | Sinexcel's AI data-centre power line is optionality, pre-revenue as of early 2026 | `profile:sinexcel` @ v8 — `strategyRead[2]` |
| 32 | Power Electronics is the conversion layer itself — no cells, no turnkey system — which is why Wood Mackenzie's integrator ranking structurally cannot contain it, and no independent US PCS ranking exists (the C7 verdict) | `profile:power-electronics` @ v1 — `ecosystemRole`, `strategyRead[2]` |
| 33 | Power Electronics is a US business manufacturing in Spain: ~70 % of group revenue from the US, 600+ US employees; the FCC rule covers hardware assembled in Llíria exactly as it covers hardware assembled in China | `profile:power-electronics` @ v1 — `strategyRead[0]`, `policyExposure[]` |
| 34 | Four independent conversion businesses absorbed in four years: EKS Energy → Hitachi Energy (2023), Dynapower → Sensata (2022), Gamesa Electric → ABB (2025), EPC Power → Flex | `profile:power-electronics` @ v1 — `strategyRead[2]` |
| 35 | DOE must publish EO 14420 implementing rules by **24 December 2026**, and those rules define the covered countries and companies; any assessment before that date is speculation | `profile:power-electronics` @ v1 — `policyExposure[]` (regime: Executive Order 14420) |
| 36 | Zhonhen is #1 in China's data-centre HVDC market at 31 % share (Kezhi Consulting 2025, CR3 72 %), lead author of the national 240 V/336 V DC standard, MIIT single champion, Alibaba Panama co-developer | `profile:zhonhen` @ v8 — `strategyRead[0]`, registry tagline |
| 37 | NVIDIA's August 2026 execution paper names the Panama Architecture as a TRU implementation of its data-hall DC power block; architectural endorsement and commercial inclusion are separate and only the first is answered | `profile:zhonhen` @ v8 — `ecosystemRole`, `strategyRead[1]` |
| 38 | Zhonhen exports are 4.1 % of revenue, no US entity on record, absent from NVIDIA's published partner rosters; H1 2026 data-centre power +98.48 % at a falling margin with no 800 VDC order disclosed | `profile:zhonhen` @ v8 — `ecosystemRole`, `strategyRead[1]`, `recentDevelopments[]` 2026-08-27 |
| 39 | Vicor is the corpus's reference for the last centimetre — fixed-ratio bus converters and current multipliers, 128 patents — and is absent from every NVIDIA 800 VDC partner list (May 2025, October 2025, March 2026) | `profile:vicor` @ v2 — `ecosystemRole`, `strategyRead[2]` |
| 40 | Vicor royalty revenue: $15.9M / 3.9 % of net revenues (2023) → $46.6M / 13.0 % (2024) → $57.4M / 14.1 % (2025); $45.4M in H1 2026; consolidated gross margin 51.2 % (2024) → 58.0 % (Q2 2026) | `profile:vicor` @ v2 — `strategyRead[0]` |
| 41 | The ITC exclusion order rather than the datasheet brought OEMs to the licensing table; the CFO ties the next tranche to the second ITC case's final determination in 2027 | `profile:vicor` @ v2 — `strategyRead[1]`, `policyExposure[]` (Section 337) |
| 42 | Megmeet is one of NVIDIA's designated recommended data-centre power suppliers in its own words, participating in Blackwell and Vera Rubin power and HVDC programmes — membership of a set, not a position within it | `profile:megmeet` @ v7 — `ecosystemRole` |
| 43 | Megmeet is the only mainland-China power vendor NVIDIA has named for GB200 NVL72 power, and publishes the full grid-to-GPU chain including edge cabinets rectifying 380–480 VAC to 800 VDC at over 1 MW per rack | `profile:megmeet` @ v7 — `ecosystemRole` |
| 44 | Megmeet is running an incumbent-funded pivot: appliance controls 38 % of revenue and declining, FY2025 ex-non-recurring profit −93 % concurrent with the 800 VDC build-out; the wedge is architecture timing, not price | `profile:megmeet` @ v7 — `strategyRead[0]`, `strategyRead[1]` |
| 45 | NVIDIA's roster places Flex Power in the power-system-components tier with Delta, LITEON and Megmeet; Flex also owns Anord Mardix, Crown Technical Systems, Electrical Power Products and JetCool | `profile:flex` @ v1 — `ecosystemRole` |
| 46 | Flex acquisitions total roughly $6.3bn, two thirds committed in the sixteen months after the AI build-out began, culminating in EPC Power at $4.4bn agreed 3 September 2026, expected to close Q4 calendar 2026 | `profile:flex` @ v1 — `strategyRead[2]`, `recentDevelopments[]` 2026-09-03 |
| 47 | The Flex board approved separating Cloud and Power Infrastructure on 5 May 2026, targeted for Q1 calendar 2027 | `profile:flex` @ v1 — `strategyRead[0]` |
| 48 | Heron Power's SST specification maps one-to-one onto NVIDIA's Option C block; it has no shipped unit, no independently checkable datasheet, no UL listing on the record, and two named customer engagements | `profile:heron-power` @ v1 — `ecosystemRole`, `strategyRead[0]` |
| 49 | Heron is the only startup on NVIDIA's facility-tier roster, pre-production; mass production begins late 2027 against an architecture attaching 34.5 kV-direct SSTs to "toward 2029" — survivable if the factory holds, fatal to the data-center thesis if it slips a year | `profile:heron-power` @ v1 — `ecosystemRole`, `strategyRead[2]` |
| 50 | Five adjacent incumbents are hedged across both the TRU bridge and the SST target: GE Vernova (a hyperscaler's conditional 1,000-unit commitment from 2027), ABB, Eaton, Siemens, Hitachi Energy | `profile:heron-power` @ v1 — `strategyRead[2]` |
| 51 | GE Vernova sells solid-state transformers and NVIDIA 800 VDC reference designs, and holds turbine and transformer capacity that sets campus energization dates | `profile:ge-vernova` @ v6 — `productsAndServices`, `ecosystemRole` |
| 52 | ABB's HiPerGuard is the industry's first static MV UPS and the centrepiece of NVIDIA-ecosystem 800 VDC architecture work, with SACE Infinitus the first IEC-certified solid-state breaker; third-party rankings put the top five at ~41–43 % of the $35bn data-centre power market | `profile:abb` @ v7 — `ecosystemRole`, `strategyRead[0]` |
| 53 | Eaton's bet is delivered power systems rather than components — 800 VDC architecture, NVIDIA platform alignment, Resilient Power solid-state transformers, assembled inorganically in 14 months | `profile:eaton` @ v8 — `productsAndServices`, `ecosystemRole`, `strategyRead[0]` |
| 54 | Schneider's edge is the design layer rather than the hardware layer — NVIDIA reference designs and AI-factory blueprints spanning grid to chip; a design franchise, not a converter line | `profile:schneider-electric` @ v9 — `productsAndServices`, `ecosystemRole`, `strategyRead[0]` |
| 55 | Hitachi Energy's data-centre offering carries Grid-eXpand, 800 VDC and e-mesh BESS, and its transformer delivery calendar is the binding constraint on energization timelines | `profile:hitachi-energy` @ v5 — `productsAndServices`, `strategyRead[0]` |
| 56 | NVIDIA is the buyer that prescribes the architecture and names the vendors — its 800 VDC ecosystem list names Delta, LITEON, Megmeet and Flex among components and Vertiv, Eaton, Schneider, Siemens, ABB, GE Vernova and Hitachi Energy at the grid tier | `profile:nvidia` @ v10 — `productsAndServices`, `ecosystemRole`, `strategyRead[0]` |
| 57 | Tesla's Megapack 3 carries a silicon-carbide integrated inverter and the Megablock MV block — captive conversion rather than a merchant sale | `profile:tesla` @ v7 — `productsAndServices` |
| 58 | LS Energy Solutions' String PCS (AiON-SIS, MSSP GEN 2.0, in-house with Parker heritage) sits inside its own AC block; its 2026 re-weighting moves toward PCS, components and services under the parent brand | `profile:ls-energy-solutions` @ v3 — `productsAndServices`, `strategyRead[1]` |
| 59 | The EU high-risk inverter phase-out takes full effect for new EU-funded contracts from **April 2027**, scoped to EU-funded projects rather than the European market at large | `profile:sungrow` @ v9 — `policyExposure[]` (the only future `effectiveDate` across the roster's 40 entries) |
| 60 | Across the twenty members, `policyExposure[]` holds 40 entries, 17 with an `effectiveDate`, of which exactly **one** is in the future | the twenty `<slug>.profile.json` files — `policyExposure[]`, counted 2026-09-15 |

## 9. What the record does NOT say

- **No independent ranking of the segment as a whole exists**, and two of the nine incumbents are explicitly unrankable on the record: `power-electronics` because no US conversion ranking exists at all (its dossier records this as the C7 verdict), and `sinexcel` because the two available readings — a BNEF bankability tier and a CNESA shipment table that omits it — point different ways and the corpus carries both rather than resolving them.
- **The Delta / LITEON / Megmeet rack-shelf ordering is not established.** Three dossiers carry the displacement report and all three qualify it; Megmeet's own interim names no competitor and claims no rank. There is no sourced #2.
- **Zhonhen has disclosed no 800 VDC order, backlog or named data-centre customer**, despite the architectural endorsement. The corpus states the endorsement and the commercial silence as two separate facts.
- **Delta's NVIDIA exposure is not quantified by anyone** — no third-party source gives NVIDIA as a share of Delta revenue, and the dossier calls that a transparency gap rather than filling it.
- **Flex's data-centre revenue is not publicly knowable.** The segment blends what Flex owns with systems it builds to customers' designs, and no revenue line has ever been published for Anord Mardix, JetCool or Crown.
- **Heron Power has no shipped unit and no UL listing on the record**, and no vendor had completed data-centre SST certification as of the most recent third-party read in the corpus.
- **The reach of EO 14420 is not knowable yet** — DOE's implementing rules, due 24 December 2026, define the covered countries and companies. Two dossiers say so in as many words.
- **Huawei's sub-segment momentum is unverifiable from company channels** — no product-line revenue split is disclosed, and the dossier treats the opacity itself as the finding.
- **Nothing in this module ranks the adjacents against each other.** Five of the eight are facility-power OEMs that compete fiercely one tier up; that contest belongs to `in-hall-power` and to `grid-equipment`, not here.
- **No figure in this module was sourced outside the corpus.** Where a number's only trace is a company's own release or an aggregator, the dossier says so and this module inherits the qualification rather than laundering it.

## 10. Freshness gate — the `reviewBy` judgment, resolved

**Resolved: `reviewBy` = 2026-11-27**, seventy-three days after `updated`. It is read out of a member's `policyExposure[]` **prose**, not sorted out of the fence — the fourth consecutive S2 session in which the read beats the sort, and the third distinct failure mode for a sort.

**The gate.** China's Ministry of Commerce controls the export of gallium, the input to gallium nitride. It announced an outright ban on exports to the United States in December 2024; that ban is **currently suspended in favour of a licensing regime until 27 November 2026**, with the military-end-user prohibition still in force. The entry's own `effectiveDate` field holds **2023-08-01** — the date the original controls took effect — so the field carries the first step of a multi-step schedule and the prose carries the next one, exactly the pattern §10.6 (d) records. GaN is one of the two wide-bandgap materials this segment is defined by, and Infineon, an incumbent member, acquired GaN Systems in 2023 and names GaN bus converters as part of its 800 VDC portfolio.

**Four candidates rejected, in writing:**

1. **2026-11-10 or -11 — Infineon's Q4 FY2026 print.** Rejected: an earnings date is not a *dated gate*. Nothing in the segment's structure changes when it lands; a figure is disclosed. §10.6 says gate, and a consensus print is a measurement, not a gate.
2. **2026-12-24 — DOE's EO 14420 implementing rules.** A genuine gate, twenty-seven days later, and the one that most directly re-sorts the roster. Rejected on two grounds: it is not the nearest, and it is already `eo14420-bulk-power-2026-08`'s own `reviewBy` — taking it here would duplicate that module's clock rather than set this one's, and §2's split says the instrument is that module's. It is carried in `the-indicators` instead, which is where a gate this module watches but does not own belongs.
3. **2027-04 — the EU high-risk inverter phase-out.** The **only future `effectiveDate` in any field across the roster's forty `policyExposure[]` entries**, and therefore what a sort of the fence returns. Rejected as four months further out than a real gate the prose carries — the identical shape to `cells-and-chemistry` at §10.6 (d).
4. **2028-01-01 — ERCOT NOGRR 282's stricter voltage ride-through.** A real dated gate on one challenger's claimed capability, but fifteen months out.

**And the default rejected too:** six months from `updated` is 2027-03-15, which is later than candidates 1, 2 and 3 and would have been wrong by nearly four months.

**What this means in the app.** At 73 days out, `clReviewChip` renders the module **plain**, not gold — unlike `landscape-utilities-2026-09`, which shipped inside its own 30-day horizon at seventeen days and renders gold immediately. This module enters the 30-day window on **28 October 2026** and `check-classroom-curriculum.py` will begin listing it then. That is the rule working normally rather than at its edge, and it is worth recording that the two outcomes look different in the UI even though the same rule produced both.

## 11. The Scraper interest seed — asked from scratch, and ADDED

Step 9 of `.claude/rules/industry-guidance.md` requires the question. The brief's prior was that the answer would be **no**, on the ground that `topic-bess-technology` and the existing 800 VDC coverage already score this layer. **The check does not support that prior, and one seed is added** — narrowly, to the residue those terms genuinely leave.

**The check, run the way §10.6 (i) and session 4's precedent require — against every existing *term*, not every seed *label*.** Both arrays were read: `SCRAPER_INTEREST_TOPIC_SEEDS` (163 terms) and `SCRAPER_SEGMENT_SEEDS` (249 terms), **390 distinct terms**. Results:

| Candidate term | Verdict |
|---|---|
| `power conversion system` | **already scored** — `seg-power-electronics` |
| `inverter` | **already scored** — `seg-power-electronics`, and `grid-connected inverter` in `topic-bps-security` |
| `converter` | **already scored** — `seg-inverters` |
| `power shelf` · `BBU` · `battery backup unit` | **already scored** — existing segment-seed terms |
| `sidecar power rack` · `solid-state transformer` · `800 VDC` | **already scored** — `topic-800vdc-power` |
| `semiconductor` · `chip` · `chips` · `wafer` · `foundry` | **already scored** — `seg-semiconductors` |
| `export control` · `FEOC` · `tariff` | **already scored** — `topic-china-policy` |
| **`silicon carbide`** | **zero matches** |
| **`gallium nitride`** | **zero matches** |
| **`wide-bandgap`** | **zero matches** |
| **`point of load`** | **zero matches** |
| **`vertical power delivery`** | **zero matches** |

**The gap this fills, stated so nobody merges it into a neighbour.** `topic-800vdc-power` owns the **architecture** (its five terms are all architecture words); `seg-power-electronics` owns the **box** (inverter, rectifier, UPS, busway); `seg-semiconductors` owns **compute silicon** (chip, wafer, foundry, accelerator); `topic-china-policy` owns the **trade instrument**. None of them scores the **wide-bandgap power-semiconductor layer or the last centimetre** — so a headline like *"Infineon doubles silicon carbide and GaN capacity at Dresden"*, *"gallium licensing regime lapses 27 November"* or *"NVIDIA names vertical power delivery a Gen 4 requirement"* matched **no seed at all**, in the two sub-layers this segment's own one-sentence definition names and in which one of its nine incumbents entirely lives. Two of the segment's six buying criteria — roadmap alignment and **patent position on bus conversion and vertical power delivery** — sit here, and the module's own `reviewBy` gate is a gallium date.

**Re-scoped once before landing, exactly as session 3's (i) warns.** The first draft included `bus converter` and `power semiconductor`; both collide (`converter` in `seg-inverters`, `semiconductor` in `seg-semiconductors`) and were dropped. `MOSFET` and `IGBT` are also clear of all 390 terms but were **left out deliberately** — they are legacy-device words that would pull general power-electronics news the `seg-power-electronics` lens already carries, and a near-duplicate seed double-counts an article in the digest's topic band (§10.6 (e)).

**The seed as added:**

```
key:    'topic-power-semiconductors'
label:  'Power semiconductors & the last centimetre: SiC, GaN, point-of-load conversion'
terms:  'silicon carbide', 'gallium nitride', 'wide-bandgap', 'point of load', 'vertical power delivery'
source: 'guidance:landscape-power-conversion-and-rack-power-silicon-2026-09'
```

**No `tv` marker.** `tv` guards edits to an **existing** seed's terms and lives on `SCRAPER_SEGMENT_SEEDS`; this is a new key with no sheet row, so none is needed — the same reasoning session 4 recorded.

Developed by: LightAISolutions
