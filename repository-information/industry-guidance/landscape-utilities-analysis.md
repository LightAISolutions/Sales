# Landscape — Utilities — Analysis & Module Source

**Provenance:** Corpus synthesis over the segment's member dossiers at the versions in the claims ledger; no ingested document. Compiled 2026-09-14 from `live-site-pages/profiler-data/profiler-segments.json` and the 14 member `<slug>.profile.json` files only — **no new web research, no ingested source**. Nothing under `industry-guidance/sources/` belongs to this module and step 1 of the Industry Guidance Command does not apply. The dossiers already cite their own primary sources; this file cites the dossiers, field by field, in §8. Feeds the in-app module `landscape-utilities-2026-09` in `googleAppsScripts/Classroom/Classroom.gs` (lane: The Value Chain; tier: contributor). This is the fourth module of S2, after `landscape-storage-integrators-and-containers-2026-09` (v05.64r), `landscape-cells-and-chemistry-2026-09` (v05.70r) and `landscape-storage-developers-and-ipps-2026-09` (v05.74r).

> **Current as of the 26 September 2026 re-pin — read §12 and §13 before the body.** §§1–11 are the 14 September authoring text over fourteen members and six franchises. Five franchises joined the segment on 26 September 2026, and §13 records every change that made to the module: 19 members, eleven franchises, thirteen bets and a review date of **2 December 2026**. Where the body and §13 differ, §13 and the module in `Classroom.gs` are current.

## What this is

`CLASSROOM-CURRICULUM-PLAN.md` §10.1 splits the market-structure layer in two. **Layer 3** is the generated segment lesson `segment-utilities` — public, analyst-visible, and carrying no judgment at all: the registry's definition, its six buying criteria, the 14-row player table with each member's role and basis, the normalized figures the dossiers carry, the graph edges among members, the last twelve months of developments, and the policy fence. **Layer 4 is this module**, and it exists because the lesson states the record and stops.

The record, stated, does not answer the question a seller has. It does not say why six incumbents can share one segment while none of them competes with any other. It does not say what "challenger" can possibly mean in a market where the franchise is a statutory monopoly — or why the two companies carrying that label are **larger by revenue than four of the six incumbents**. It does not say what each of the eight ranked players is *trying to do*. Those are judgments, they rest on the `strategyRead[]` field the generator is forbidden to touch (§10.4, "no `strategyRead` — that is analysis, and analysis is the landscape's"), and they belong at the contributor tier because `INTEGRATED-REMEDIATION-PLAN.md` §7.2 decision 2 put them there.

**This is the one module class that names and ranks covered companies.** The 2026-08-29 content-scope directive keeps single-company analysis out of guidance modules; the landscape modules are the developer-approved exception, and the guidance they give is still to a group — the seller reading it, about the players it sells against and to.

**And this is the first landscape that has to state its split against an existing guidance module.** `utility-aidc-procurement-2026-08` is registered, is in a different lane, and covers part of the same franchises. §2 below is the split, written before anything else was drafted, and it is the constraint every other section was written under.

## The segment as measured

Measured 2026-09-14 from `profiler-segments.json` at repo version v05.77r:

| | Count | Note |
|---|---|---|
| Members | **14** | Mid-table: deeper than `compute-and-the-rack` (4), `neoclouds` (7) and `hyperscalers-and-ai-labs` (8); shallower than `storage-developers-and-ipps` (34), `storage-integrators-and-containers` (32) and `aidc-developers-and-landlords` (30) |
| `incumbent` | **6** | `dominion-energy` · `southern-company` · `entergy` · `oncor` · `aep` · `xcel-energy` |
| `challenger` | **2** | `nrg-energy` · `vistra` — both competitive **retail** suppliers, not wires companies |
| `adjacent` | **6** | `engie-north-america` · `tesla` · `nextera-energy-resources` · `invenergy` · `grid-united` · `pattern-energy`. Do not count toward the floor's roles |
| Position | **15 of 19**, tier `demand` | The last of the five demand segments, between `neoclouds` (14, demand) and `capital` (16, services) |
| Buying criteria | **6** | Cost recovery · firmness and resource adequacy · minimum-demand, term, collateral and exit-fee terms · speed of certification and the equipment slot behind it · self-build vs toll vs customer-supply · cost allocation for the substation and the wires |
| Floor | **met** | 14 members, 6 incumbents, 2 challengers, against a floor of 3 / 1 / 1 |

**§7.23's figure is confirmed exactly: 14 members, 6 · 2 · 6.** That brief predicted it would be, and noted that three of the last four S2 sessions had found the registry moved under a written-down figure — so a confirmation is the less common outcome. This is the second S2 session running to confirm rather than correct.

**The adjacency story is ownership, not generation, and the registry says so in its own `notes`.** The reserved adjacent role was filled at V3 (v05.40r, 2026-09-12) by the two transmission developers: "the developers utilities own through (Grid United's utility-owned slices) or buy from (Pattern's Subscriber PTO line and PNM build-own-transfer)." The same `notes` field carries the structural fact that decides this module's shape — **"Regulated franchises have no challenger by construction; the competitive retail suppliers of restructured markets carry that role here."** The registry is telling the reader that `challenger` is a structural placeholder in this segment and not a threat claim. A threat section written to the previous module's proportions would have missed that; §4 is written around it instead.

**The evidence is uniformly thick, which is unusual for this programme.** All 14 members carry a dossier, all 8 incumbents-and-challengers carry `strategyRead`, and — unlike `storage-developers-and-ipps`, where only 7 of 34 carried a normalized revenue figure — **all 8 carry one**, because every one of them is a public filer. This is the first landscape whose bets table and whose comparable numbers rest on the same eight companies. It is also why §3's central comparison (revenue) can be made at all.

## Teaching sequence (mirrors the module sections)

1. `who-dominates-and-on-what-basis` — six franchises that do not compete, five instruments that do
2. `who-threatens` — why `challenger` here is a structural placeholder, and where the real threat sits
3. `each-players-bet` — all eight, the bet labelled as analysis with the dossier's own confidence
4. `the-indicators` — what to watch, dated where the record dates it
5. `the-sellers-play` — the two §10.10 role paths, and the split with the procurement playbook restated at the point of use
6. `claims-ledger` — every load-bearing claim to a dossier field at its `profileVersion`
7. `what-the-record-does-not-say` — the gaps, stated
8. `drill` — eight cards
9. `check-yourself` — five judgment questions

## 1. Executive read

**Six incumbents, and not one of them competes with another.** That is the fact everything else in this module follows from, and it makes "who dominates" the wrong question in the form the other three landscapes asked it. A regulated franchise is a geographic monopoly: Dominion cannot bid for load in Georgia, Southern cannot bid for load in Virginia, and Oncor cannot bid for anything at all because it sells no electricity. Nobody in this segment takes share from anybody else in it. So the section that ranks the incumbents cannot rank them against each other — it has to say what each one dominates, and then say the thing that actually varies.

**What varies is the instrument.** Every one of the six has built a mechanism to convert an AI-load enquiry into a certificated plant or an energised point of delivery, and there are **five such mechanisms across the six franchises** — Southern and Entergy run the same one in two variants, and the five differ in kind rather than in degree. Dominion filters the queue with a four-tranche conversion ladder and a tariff that starts on 1 January 2027. Southern certifies inside a system it balances itself, with no RTO to bid into and no regional queue, and it is the one member that buys its own batteries. Entergy lets the customer's signature decide the plant and has closed the large-frame turbine market for the decade with an exclusivity agreement. AEP wrote the take-or-pay contract the other seven states copied and watched it delete two-fifths of its own stated demand. Oncor takes cash. Xcel bills the customer for its full incremental cost through a charge with the customer's name on it. **A seller who knows which of those six rooms it is standing in knows what the conversation is about; a seller who does not will pitch the wrong thing to five of them.**

**The two "challengers" are bigger than most of the incumbents and are not attacking them.** NRG's FY2025 revenue of US$30,713M is the largest of the fourteen — larger than Southern's US$29,600M and roughly double Dominion's US$16,506M — and Vistra's US$17,738M places it third. The registry's own `notes` field explains why that is not a contradiction: regulated franchises have no challenger by construction, so the role is carried by the competitive retail suppliers of the restructured markets. **`challenger` here is a structural placeholder, not a threat claim**, and the module says so in as many words rather than manufacturing a threat section to fill the slot.

**The sharpest single fact in the segment is that in Texas the challengers are the incumbent's customers.** Oncor's own dossier states that "retailer subsidiaries of Vistra and NRG Energy are the two largest customers, at 25 percent and 21 percent of total operating revenues for 2025; no other customer exceeded 10 percent." **Forty-six per cent of the largest pure-play wires incumbent's revenue is its two challengers**, and all three dossiers state it independently. Where the franchise was abolished, the incumbent and the challenger did not become rivals — they became the two halves of a bill.

**So the threat is structural rather than competitive, and it is carried by the adjacents.** Three routes appear in the record, and each one takes load, assets or the franchise itself away from a utility without any utility competing for it: the load never becomes the franchise's load (co-location and behind-the-meter); the asset arrives already built (build-own-transfer and ownership slices); or the franchise changes hands (the NextEra combination). Four of the six adjacents sell *to* or *through* the incumbents rather than against them, which is exactly what makes them the threat vector — a counterparty is a better disintermediator than a rival.

**The finding a reader should leave with:** in this segment, market share is fixed by statute and the only thing that moves is *who is inside the meter*. Read a utility not by its size but by its instrument, and read the threat not as a competitor but as a boundary — the edge of the franchise, and what is crossing it.

## 2. The split with `utility-aidc-procurement-2026-08` — decided before anything else was drafted

`utility-aidc-procurement-2026-08` was authored in August 2026, sits in the lane **The AI Data-Center Wave**, and is registered ahead of this module in `guidanceDocs_()`. It covers five of these fourteen companies. §7.23 named the predictable failure here — "a landscape that re-tells the procurement playbook" — and named the precedent for avoiding it: `vertiv` and `schneider-electric`'s UPS spines were made to state their split in each other's opening callout. So this module's `who-dominates-and-on-what-basis` opens by stating the split, and the playbook is named by title in the module rather than left for the reader to find.

**The playbook owns the process. This landscape owns the parties.**

| The playbook module answers | This landscape answers |
|---|---|
| What are the four moves a utility makes against AI load? (large-load tariff classes, gas procurement, storage procurement, flexible interconnection) | Which of the six franchises am I in front of, and which instrument has it actually built? |
| What do the large-load tariffs say — thresholds, terms, minimum take, exit? | Why is the 85% minimum take a *filter* rather than a price, and what did it delete? |
| Where does BESS enter — the five channels, and who signs the PO? | Which franchise buys the battery itself, and which one never sees the cell brand? |
| What is on the regulatory calendar I should build an account plan around? | Which dated gate moves a **structural** claim in this segment, and which ones are procedural noise? |
| — (does not cover) | What is `challenger` doing in a segment of statutory monopolies, and what is it not doing? |
| — (does not cover) | Xcel, both challengers, and all six adjacents |
| — (does not cover) | Who is disintermediating the franchise, and by which of three routes |

**What this module therefore does not carry, deliberately:** no tariff-terms comparison table (the playbook's `tariffs` section), no five-channel BESS entry list (its `channels`), no buyer map naming who signs the purchase order (its `buyermap`), no four-move playbook table (its `playbook`), and no named-procurement award list (its `awards`). Where a reader needs any of those, the module points at the playbook by name instead of restating it. **What the playbook does not carry and this module does:** every `strategyRead[]` judgment, the revenue comparison, the challenger-is-a-placeholder finding, the Oncor customer-concentration fact, the three disintermediation routes, the adjacency layer, and the six-instrument reading of dominance.

**The reader's rule, stated in the module itself:** if the question is *"what do I have to do to sell into this"*, the playbook answers it. If the question is *"who is this and what are they trying to do"*, this module answers it. Neither restates the other, and a seller working a utility account needs both.

One overlap is real and is handled rather than denied: both modules state that AEP Ohio's tariff cut roughly 30 GW of requests to about 5.6 GW. The playbook uses it as evidence that tariffs work; this module uses it as evidence about **what an incumbent's instrument is for**, and cites AEP's own PUCO figure (17,861 MW contracted against 30,000 MW of pre-tariff requests) rather than the playbook's rounded pair. The same number, doing two different jobs, with different arithmetic behind it — which is the test for whether a split is genuine.

## 3. Who dominates, and on what basis

The registry's `incumbent` definition is "the established leading set — ranked top-tier by a third party, or described by the dossier as the incumbent, the benchmark, the reference, or the leader for what the segment makes or does." Applied to six regulated franchises it produces a true statement that is useless on its own: each is the leader of its own territory, absolutely, because no other member is permitted to serve it. **The basis for ranking has to move from share to instrument**, and the dossiers support that move because each one is organised around the mechanism its company built.

**The five instruments, and the six franchises that run them.**

**(i) The filter — Dominion.** A four-tranche conversion ladder is the whole disclosure: of 53.8 GW of data-center capacity contracted, 12.0 GW sits under electric service agreements that "include revenue requirement whether customer takes service or not", 9.4 GW under construction authorizations with full cost reimbursement on walk-away, and 32.4 GW at the engineering stage. Against that, the February 2026 SCC filing counted about 70,000 MW of requests against a 24,678 MW peak, with 45,000 MW carrying no connection date — and connections have run at 11 to 15 a year for a decade against 118 requests in 2025 alone. **The instrument is the GS-5 minimums from 1 January 2027 plus the deposit and reimbursement clauses**, and the measure of throughput is the annual connection count, not the gigawatt headline. Its binding constraint is wires rather than generation through at least 2028 and in places 2032, which is why behind-the-meter bridge power persists on its system for the rest of the decade.

**(ii) The certificate — Southern, and Entergy in a variant.** Georgia Power plans, certifies and builds inside a system it balances itself: there is no capacity auction to bid into and no regional queue, so the certificate is the instrument. 9,885 MW was certified in a single December 2025 order, five votes to nothing; reconsideration was denied three to two two months later after two commission seats changed hands on affordability. Contracted large load rose from 8 GW to 17 GW in three quarters against a 75 GW prospective figure the company never counts as load. **And Southern is the one member that buys the battery itself**: the December 2025 certificate added 3,022.5 MW of owned stand-alone storage, against a 500 MW storage RFP that is the developer lane — smaller than the owned lane by an order of magnitude. Entergy runs the same instrument with the customer's name on it: a phase-one Louisiana order certified 2,262 MW for a named Meta subsidiary on an ESA whose minimum charges are designed to recover the annual revenue requirement, and 15.5 GW of executed ESAs was ranked the largest disclosed block among nineteen utilities in April 2026. Its second instrument closes a market: a turbine exclusivity agreement with a quarterly manufacturing slot for frames above 400 MW, the minimum order raised from 15 to 21 to 27 power-island sets as the campus filings multiplied.

**(iii) The contract — AEP.** Large-load tariffs approved in six of eight states by August 2026, all carrying take-or-pay minimum billing demand between 80 and 90 per cent, terms of twelve to twenty years, ramp periods, collateral and exit fees. The result is 69 GW contracted reported separately from roughly 195 GW of queue activity — two numbers, never blended — and AEP Ohio's own PUCO filing shows 17,861 MW contracted against 30,000 MW of original pre-tariff requests. **The instrument deleted roughly two-fifths of its own stated demand, on purpose.** The second moat is physical and less replicable: nearly 90 per cent of the national 765 kV network, a US$33B transmission plan inside a US$78B capital plan, and a supplier agreement aimed at expanding domestic manufacturing of extra-high-voltage transformers and breakers — the company treats the supply chain rather than the permit as the binding constraint.

**(iv) The collateral — Oncor.** The narrowest and most absolute instrument in the segment, because Oncor certifies no generation, is not a seller of electricity, and holds no capacity obligation — in an energy-only market there is none to hold. It decides whether and when a customer gets a transmission-voltage point of delivery, at what contribution in aid of construction, against what collateral, and in what batch sequence. It publishes three figures every quarter and never blends them: 737 requests totalling 298 GW at 30 June 2026, approximately 44 GW eligible in ERCOT's Batch Zero, and approximately 8 GW already energised. **Collateral held rose from about US$2.8B in November 2025 to US$3.5B in February 2026, US$4.0B in May and US$5.9B in August — more than doubling in nine months while the request queue's growth decelerated from 24 per cent to 15 per cent year over year.** Money posted is the only commitment test in the segment a customer cannot walk away from for free, and it is the number to watch.

**(v) The customer-specific charge — Xcel.** The first utility to put a hyperscaler's full incremental cost into a charge with the customer's name on it: 1,400 MW of wind, 200 MW of solar and a 300 MW / 30 GWh iron-air battery under the Google Clean Energy Accelerator Charge. Large-load tariffs are filed in three states with published minimum-demand, term and exit-fee parameters, and only Minnesota's is approved. The consequence is visible in the numbers: about 2 GW contracted against more than 20 GW of pipeline, with roughly 1 GW expected to be signed in 2026 and the contracted figure unmoved between the Q1 and Q2 2026 decks. **Xcel's growth is gated by commission decisions rather than by demand or by equipment** — and its supply was reserved first, with twelve gas-turbine reservations and a 2 GW joint development agreement executed before any tariff outside Minnesota was approved.

**Reading the six as a set.** Three things separate them that a seller can act on. **How far along the instrument is** — AEP's is approved in six states and already litigated at the Supreme Court of Ohio; Xcel's is approved in one. **Whether the utility owns what it buys** — Southern owns its batteries and reserved ten gigawatts of equipment under fixed-price turnkey EPCs before the certificate; AEP has no named battery supplier on any project in any source reviewed, and neither does Entergy on any owned system. **And what the instrument is denominated in** — a certificate (Southern, Entergy), a contract (AEP, Dominion), cash (Oncor) or a bill line (Xcel). None of those three is visible in the segment lesson's player table, and none of them is what the procurement playbook is about.

## 4. Who threatens, and on which route

**Start by reading the label honestly.** The registry's `notes` for this segment states that "regulated franchises have no challenger by construction; the competitive retail suppliers of restructured markets carry that role here." That is the registry saying, in its own words, that the `challenger` role in this segment is a **structural placeholder**. The two companies carrying it are not insurgents and are not smaller: NRG's FY2025 revenue of US$30,713M is the largest figure in the segment and Vistra's US$17,738M is third, ahead of Entergy (US$12,947M), Xcel (US$14,669M), Dominion (US$16,506M) and Oncor (US$6,778M). Only Southern (US$29,600M) and AEP (US$21,876M) sit above Vistra. **Two of the eight ranked players are labelled challenger and rank first and third by revenue** — a shape none of the three previous landscapes produced.

**And in ERCOT the challenger is the incumbent's customer.** Oncor's dossier records that retailer subsidiaries of Vistra and NRG Energy are its two largest customers at 25 per cent and 21 per cent of 2025 total operating revenues, with no other customer above 10 per cent. Vistra's and NRG's own dossiers state the same relationship from their side. **Forty-six per cent of Oncor's revenue comes from the two companies the registry calls its challengers**, and the relationship's `type` in the graph is `other`, not `competitor`. Where restructuring split the franchise, it did not create rivals — it created a wires company and the two retailers that bill through it.

**What the two challengers are actually doing is converting a customer book into generation, in opposite directions.** NRG started with the customers and bought the generation to match them: retail was US$29.5B of US$30.7B of FY2025 revenue, and the LS Power acquisition closed on 30 January 2026 for US$10,583M of consideration plus roughly US$3.2B of assumed debt, adding about 13 GW across nine states and doubling the fleet to about 25 GW. Vistra started with the plants and owns the customers to hedge them — and every signed large-load agreement it has is **nuclear**, not gas: 1,200 MW to Amazon from Comanche Peak and 2,609 MW to Meta from Perry, Davis-Besse and the uprate programme, while its own language for the gas fleet is unchanged across four consecutive filings ("we continue to engage in discussions with various counterparties"). Neither is attacking a regulated franchise. Both are building the thing a regulated franchise already has.

**The real threat is disintermediation, it runs on three routes, and the adjacents carry all three.**

**Route 1 — the load never becomes the franchise's load.** ENGIE frames co-location of compute at its own generation and storage sites in market-structure terms rather than sustainability terms: relieving congestion, offsetting basis risk, mitigating curtailment, under a preliminary agreement with Cipher Mining of up to 300 MW and a collaboration with Prometheus Hyperscale. Neither discloses MW under contract, and no third party has verified Prometheus's construction progress or load commitment — so this is the least proven route as well as the most direct. Tesla runs the retail-side version, operating as a Texas retail electricity provider aggregating Powerwalls. And NRG's own record shows the asymmetry sharply: when Texas paused data-centre grid interconnections in August 2026, its signed 445 MW were grid-served and therefore exposed **while behind-the-meter generation was exempt** — the pause priced the route in.

**Route 2 — the asset arrives already built.** Invenergy created a dedicated unit in April 2026 to oversee its growing natural gas and data-centre development, and the model is build-and-transfer at commissioning rather than merchant gas: a 918 MW plant filed by AEP's Indiana Michigan Power, two more filed by We Energies at about US$2.3B combined, and another 1.95 GW planned. Grid United sells utilities ownership slices of interregional lines they would not have planned themselves — ALLETE under development agreements at roughly 35 per cent as operator, and seven utilities on non-binding MOUs for 2,550 MW of North Plains Connector — and its founder's testimony is unambiguous: "these electric companies will be the ultimate owners — with each owning a slice." Pattern Energy has already executed the template, transferring Western Spirit Transmission to PNM for US$285 million in 2021, and now runs the merchant version as the first Subscriber Participating Transmission Owner scheduled into CAISO. **The franchise still owns the asset and still earns on it. It did not plan, develop or build it** — and it is not the party a supplier sells to.

**Route 3 — the franchise changes hands.** NextEra's US$67B combination with Dominion is the largest structural event in the segment. Dominion's own reading is that it "changes the buyer more than the docket": the merger release keeps Dominion Energy Virginia's president in place and the SCC, NCUC, South Carolina, FERC and NRC approvals leave Virginia's rate proceedings, IRP cycle and RFP calendar intact — **but capital allocation, supplier qualification and framework agreements would sit with NextEra**, whose merchant subsidiary is the largest developer of storage in this corpus. NEER's own dossier describes a procurement doctrine of self-integration, long-dated domestic locks and vendor-borne tariff risk, buying cells and DC blocks direct so that a containerised-system vendor has no integrator channel to ride. If that doctrine migrates to Virginia after the expected second-half-2027 close, the largest regulated procurement machine in the country changes what it will buy without any docket changing at all.

**The honest summary, and it is the section's point:** nothing in this segment threatens an incumbent's *share*, because share is fixed by statute. What is under threat is the **scope of the franchise** — how much of the load sits inside the meter, how much of the asset base the utility originated, and who decides what the utility buys. A threat section written to `storage-developers-and-ipps`'s proportions would have produced eight paragraphs about two retailers and missed all three routes.

## 5. Each player's bet — the eight

§10.6 sets the rule: one row per incumbent and challenger, the bet drawn from `strategyRead[]` and **labelled as analysis, never blended with fact**. That is eight rows here — the shortest bets table of the four landscapes, against 18, 15 and 27. §7.23 said to let the section proportions follow the segment rather than the last module, and eight is what the segment has. Each row carries the dossier's own confidence word, because `strategyRead[]` states one and dropping it would upgrade a moderate judgment to a flat claim.

| Player | Role | The bet (analysis) | Confidence the dossier states |
|---|---|---|---|
| Dominion Energy | incumbent | That the pipeline is firm in its smallest tranche and speculative in its largest, and that its own instruments are built to keep it that way — the ESA tranche converts, the engineering tranche does not, and the annual connection count is the real measure | High |
| Southern Company | incumbent | That owning the battery and reserving the equipment before the certificate beats bidding for both — and that the political body reading the ladder is the exposure, not the ladder | High on the instrument; Moderate on the political guarantee |
| Entergy | incumbent | That the single-customer certificate is the operating model, and that a turbine exclusivity agreement is worth more than a competitive solicitation for 2028–2031 in-service dates | High |
| Oncor | incumbent | That refusing to forecast is the strategy — publish three unblended figures, take cash before construction, and let collateral rather than the queue be the commitment metric | High |
| AEP | incumbent | That the durable advantage is contractual rather than physical: the take-or-pay obligation, not the queue position, is what a data centre actually buys — with the 765 kV franchise as the second and less replicable moat | High |
| Xcel Energy | incumbent | That the tariff design is the product — be the utility that writes the template hyperscalers accept, and reserve the turbines before the commissions rule | High on the gating; Low on the template becoming a standard |
| NRG Energy | challenger | That the natural hedge runs better from the customer end — start with the retail book and buy the generation to match it, and let behind-the-meter supply route around the grid-served pause | High |
| Vistra | challenger | That owning both the plants and the customers is the differentiator, and that the large-load contracts worth signing are nuclear — the gas fleet earns from capacity and scarcity whether or not a data centre signs | High on the integration; Moderate on buying gas faster than it contracts it |

Two properties of this table are worth naming because they do not recur in the other landscapes. **First, six of the eight bets are about an instrument rather than a product** — no row describes a technology position, because none of these companies sells a technology. **Second, the two challengers' bets are the only two that are about a book of customers**, which is the same finding §4 reaches from the other direction.

## 6. The indicators

Dated where the record dates it. Everything below is stated by a member dossier; nothing here is a forecast of this module's own. The three undated rows are at the bottom and are marked as such rather than given a guessed date — a window is not a date, which is the test S2 sessions 2 and 3 both applied and both wrote down.

| Date | What | Why it matters | Whose record |
|---|---|---|---|
| 1 October 2026 | Alabama's 2026 statute takes effect — a 150 MW threshold extending Georgia's contract model to Alabama Power | The threshold-contract instrument spreads to a second state inside one holding company, at a **higher** threshold than Georgia's 100 MW. **This is the module's `reviewBy` gate** (§10) | `profile:southern-company` @ v2 — `policyExposure[]` prose |
| 7 October 2026 | LPSC hearing on Entergy's phase-two application (5,278 MW), with the commission's vote expected December 2026 | Approval with the company's terms intact confirms the single-customer certificate as a repeatable model rather than one order | `profile:entergy` @ v2 — `strategyRead[7]` |
| ~29 October 2026 | Dominion's amended line-extension policy with mandatory contributions in aid of construction, due 90 days after the 31 July 2026 Rider T-1 order | Direct assignment of transmission cost is the instrument's second half; the filter is not complete until this lands | `profile:dominion-energy` @ v1 — `strategyRead[7]` |
| 3 November 2026 | Georgia PSC general election, Districts 3 and 5 | The body that certified 9,885 MW five to nothing and denied reconsideration three to two is elected; two more seats are on the ballot with data-centre overbuilding a stated issue | `profile:southern-company` @ v2 — `strategyRead[0]`, `strategyRead[7]` |
| 17 November 2026 | SCC evidentiary hearing on the Dominion–NextEra merger (Case PUR-2026-00112); Arkansas PSC hearing on Entergy's Google contract cost allocation the same day | Route 3 of §4: conditions on data-centre cost allocation would show the docket outlasting the buyer | `profile:dominion-energy` @ v1 — `policyExposure[]`; `profile:entergy` @ v2 — `strategyRead[7]` |
| 8 December 2026 | South Carolina PSC hearings on the merger | The second of five approvals the combination needs | `profile:dominion-energy` @ v1 — `policyExposure[]` prose |
| 10 December 2026 | ERCOT / PUCT data-centre verification report due under the August 2026 audit directive | Governs every grid-served large load in ERCOT — Oncor's Batch Zero, AEP's 45 GW tranche and NRG's signed 445 MW alike | `profile:aep` @ v1 — `policyExposure[]` prose; `profile:nrg-energy` @ v1 — `strategyRead[7]` |
| 18 December 2026 | Dominion's Dispatchable Generation RFP bids due | A storage or hybrid winner opens a third procurement lane on the largest data-centre system | `profile:dominion-energy` @ v1 — `strategyRead[7]` |
| 1 January 2027 | Dominion's GS-5 class effective | The sorted answer to `reviewBy`, and the instrument that decides the economics of every behind-the-meter project on that system | `profile:dominion-energy` @ v1 — `policyExposure[].effectiveDate` |
| January 2027 | Southern's 500 MW storage RFP contracts; SCC final order on the merger expected 29 January 2027 | A developer winner other than the existing EPCs would widen the one battery lane Southern leaves open | `profile:southern-company` @ v2 — `strategyRead[7]`; `profile:dominion-energy` @ v1 — `policyExposure[]` prose |
| 19 April 2027 | Texas Attorney General trial against Xcel's SPS subsidiary (Smokehouse Creek) | A judgment barring customer recovery of fire costs changes the SPS credit story more than any mitigation spend | `profile:xcel-energy` @ v4 — `strategyRead[7]` |
| 1 June 2027 | PJM's Interim Resource Adequacy Service, which electric distribution utilities must administer for certain new large loads | The first time an RTO makes the franchise the administrator of someone else's adequacy obligation | `profile:aep` @ v1 — `policyExposure[]` prose |
| Mid-2027 | Southern's certification filing for the 2032–2033 solicitation (2,000–6,000 MW, opened June 2026) | A self-build share above two-thirds confirms the owned lane; a PPA-heavy filing indicates the commission has begun preferring purchases | `profile:southern-company` @ v2 — `strategyRead[1]`, `strategyRead[7]` |
| *Undated* | Supreme Court of Ohio decision in case 2025-1458 on AEP Ohio's data-centre tariff | The template the other seven states copied; a reversal removes the instrument without voiding signed contracts | `profile:aep` @ v1 — `strategyRead[3]` |
| *Undated* | PUCT decisions on Oncor's four pending 765 kV certificate applications | Opposed by state officials in July 2026 while Oncor has already reserved over 2,000 breakers and transformers through 2030 | `profile:oncor` @ v1 — `strategyRead[2]`, `strategyRead[5]` |
| *Undated, expected late 2026* | Vistra's Cogentrix close (5,496 MW, FERC-approved and unclosed), taking the fleet to about 50 GW | The challenger book keeps growing on capacity-market economics rather than on a signed AI load | `profile:vistra` @ v3 — `strategyRead[4]`, `strategyRead[7]` |

## 7. What it means for the active engagement — the seller's play

§10.10 puts `utilities` on the **storage seller's** path and not the AIDC power seller's: the storage seller reaches it through Value Chain III after `market-access`, while the AIDC power seller reaches the same franchises through `interconnection-for-large-loads` and the procurement playbook. Both readers end up in front of the same six companies; they arrive with different questions, and the module's callout is written for both.

**1 — Identify the instrument before you build the account plan.** The six franchises convert load into plant by five different mechanisms, and the sales motion follows the mechanism, not the logo. Southern buys the battery itself under supply agreements and named EPCs, so the work is approved-vendor qualification before the next solicitation. AEP and Entergy have no named battery supplier on any project in any source reviewed, so the entry point is the developer bidding their RFPs. Dominion's own strategy read puts the addressable Virginia market as "the developer bidding the October 2026 PPA RFP and the utility's approved-vendor list — in that order". Oncor buys no generation at all and is never the counterparty for it. **Pitching a container to Oncor is a category error the segment lesson's player table will not warn you about.**

**2 — Read the collateral, not the queue.** Every incumbent here publishes a large number it does not believe. Oncor's 298 GW of requests against 8 GW energised, AEP's 195 GW of queue against 69 GW contracted, Dominion's 70,000 MW against 11–15 connections a year, Southern's 75 GW prospective against 17 GW contracted, Xcel's 20 GW pipeline against 2 GW. In each case the smaller number is the one with money or a signature behind it. Oncor makes the point most cleanly because it publishes the money: **collateral more than doubled in nine months while the queue's growth rate fell.** The playbook module's first sales implication says the same thing in procurement terms ("sell where the money is certified, not where the queue is loud"); this module says it in structural terms, because the ratio between the two numbers is what tells you which instrument a franchise has actually built.

**3 — Know which side of the meter your opportunity is on, because the policy risk is not symmetric.** When Texas paused grid interconnections in August 2026, behind-the-meter generation was exempt and grid-served load was not. That single asymmetry is the whole disintermediation thesis in one event: the regulated route carries the regulatory risk, and the routes around it do not. A seller with a behind-the-meter or co-location product is selling against the franchise's timeline, not into it — a different call sheet, a different buyer, and quarters rather than regulatory years.

**4 — Watch who the buyer will be, not just who it is.** Route 3 is live on the largest regulated system in the country: the Dominion–NextEra combination leaves Virginia's dockets intact and moves supplier qualification to a platform whose merchant arm self-integrates, buying cells and DC blocks direct. A vendor qualified with Dominion today is not thereby qualified with the combined company after an expected second-half-2027 close. **Qualification is an asset with an expiry date, and this is the segment where it can expire without the customer doing anything.**

**5 — Two of the three largest revenue lines in this segment are not utilities, and they buy differently.** NRG and Vistra are merchant integrated companies with retail books. They sign for generation on commercial timescales, not certificate timescales, and Vistra's signed large-load agreements are nuclear rather than gas. They are also, in ERCOT, the parties that actually pay Oncor. A seller who treats the segment as six regulated accounts is ignoring the two largest counterparties in it.

## 8. Claims ledger

Every load-bearing claim above traces to a dossier, at that dossier's `profileVersion` **on 14 September 2026**, and to the field inside it. **The dossiers carry the primary sources; this ledger carries the dossiers** — that is the whole provenance chain for a corpus-synthesis module, and it is why no publisher appears in the Source column. In the in-app module the same ledger is rendered with the refs in **plain text**, never backticks: `clFmt` resolves `**bold**`, `*italic*` and `{{term}}` and nothing else, so a backtick would render literally to the reader (§10.6 (b)).

| Claim | Source |
|---|---|
| Segment holds 14 members — 6 incumbent, 2 challenger, 6 adjacent; six buying criteria; chain position 15 of 19, tier demand | `profiler-segments.json` @ v05.77r — `segments[].members[]`, `.buyingCriteria[]`, `.definition`, `.position`, `.tier` |
| Regulated franchises have no challenger by construction; the competitive retail suppliers of restructured markets carry that role here; the reserved adjacent role was filled at V3 by the two transmission developers | `profiler-segments.json` @ v05.77r — `segments[].notes` |
| The registry's own definitions of incumbent, challenger and adjacent | `profiler-segments.json` @ v05.77r — `roles` |
| Segment depths used for the mid-table comparison (34 / 32 / 30 / 14 / 8 / 7 / 4) | `profiler-segments.json` @ v05.77r — all nineteen `segments[].members[]`, counted 2026-09-14 |
| FY2025 revenue: NRG US$30,713M · Southern US$29,600M · AEP US$21,876M · Vistra US$17,738M · Dominion US$16,506M · Xcel US$14,669M · Entergy US$12,947M · Oncor US$6,778M | the eight `<slug>.profile.json` files — `financials.periods[]` FY2025 annual, `metrics[].kpi = revenue`, `usdMillions` |
| Dominion: 53.8 GW contracted split 12.0 GW ESA / 9.4 GW construction authorization / 32.4 GW engineering; ESAs "include revenue requirement whether customer takes service or not" | `profile:dominion-energy` @ v1 — `strategyRead[0]` |
| Dominion: ~70,000 MW of requests against a 24,678 MW peak, 45,000 MW with no connection date; connections at 11–15 a year against 118 requests in 2025 | `profile:dominion-energy` @ v1 — `strategyRead[0]` |
| Dominion: wires rather than generation is the binding constraint through at least 2028 and in places 2032, sustaining behind-the-meter bridge power on its system | `profile:dominion-energy` @ v1 — `strategyRead[1]` |
| Dominion: the addressable Virginia storage market is the developer bidding the 1 October 2026 PPA RFP and the approved-vendor list, in that order | `profile:dominion-energy` @ v1 — `strategyRead[2]` |
| Dominion: the NextEra combination changes the buyer more than the docket — dockets and RFP calendar intact, capital allocation and supplier qualification move to NextEra, close expected H2 2027 | `profile:dominion-energy` @ v1 — `strategyRead[5]` |
| Dominion: GS-5 class effective 1 January 2027; the 31 July 2026 Rider T-1 order requires direct assignment through mandatory contributions in aid of construction | `profile:dominion-energy` @ v1 — `policyExposure[].effectiveDate` and its `exposure` |
| Dominion: merger hearings — SCC 17 November 2026 (PUR-2026-00112), South Carolina 8 December 2026, SCC final order expected 29 January 2027; Dispatchable Generation RFP bids due 18 December 2026; amended line-extension policy ~90 days after 31 July | `profile:dominion-energy` @ v1 — `policyExposure[]` prose and `strategyRead[7]` |
| Southern: no capacity auction to bid into and no regional queue — Georgia Power plans, certifies and builds inside a system it balances itself | `profile:southern-company` @ v2 — `ecosystemRole` |
| Southern: 17 GW contracted against 75 GW prospective; contracted rose from 8 GW in three quarters and prospective was never counted as load | `profile:southern-company` @ v2 — `ecosystemRole`, `strategyRead[0]` |
| Southern: 9,885 MW certified five to nothing in December 2025; reconsideration denied three to two two months later after two seats changed hands; two more seats on the 3 November 2026 ballot | `profile:southern-company` @ v2 — `strategyRead[0]` |
| Southern: 3,022.5 MW of owned stand-alone storage certified in December 2025; the 500 MW storage RFP is the developer lane and is smaller by an order of magnitude; equipment for the ten-gigawatt build reserved under fixed-price turnkey EPCs | `profile:southern-company` @ v2 — `strategyRead[2]`, `strategyRead[1]` |
| Southern: Alabama's 2026 statute, 150 MW threshold, **effective 1 October 2026**, extends the Georgia contract model to Alabama Power | `profile:southern-company` @ v2 — `policyExposure[]` prose (the entry's own `effectiveDate` field carries the earlier Georgia step, 2025-02-01) |
| Southern: 2032–2033 solicitation of 2,000–6,000 MW opened June 2026 with certification mid-2027; storage RFP contracts January 2027 | `profile:southern-company` @ v2 — `strategyRead[1]`, `strategyRead[7]` |
| Entergy: phase-one order certified 2,262 MW for a named Meta subsidiary on an ESA whose minimum charges recover the annual revenue requirement; phase two repeats it for 5,278 MW on a 20-year term | `profile:entergy` @ v2 — `strategyRead[0]` |
| Entergy: 15.5 GW of executed ESAs ranked the largest disclosed block among nineteen utilities in April 2026 | `profile:entergy` @ v2 — `strategyRead[0]` |
| Entergy: turbine exclusivity agreement — a quarterly manufacturing slot for frames above 400 MW, minimum order raised 15 → 21 → 27 power-island sets, 10 fulfilled by June 2026 | `profile:entergy` @ v2 — `strategyRead[1]` |
| Entergy: no battery supplier is named on any owned project in any source found; the storage lane is the one channel a new supplier can enter and is small against roughly 8 GW of approved gas | `profile:entergy` @ v2 — `strategyRead[4]` |
| Entergy: LPSC phase-two hearing 7 October 2026, vote December 2026; Arkansas PSC hearing on the Google contract 17 November 2026 | `profile:entergy` @ v2 — `strategyRead[7]` |
| Oncor: certifies no generation, is not a seller of electricity, holds no capacity obligation because ERCOT's energy-only market creates none; decides point of delivery, contribution in aid of construction, collateral and batch sequence | `profile:oncor` @ v1 — `ecosystemRole`, `strategyRead[3]` |
| Oncor: 737 requests totalling 298 GW at 30 June 2026; ~44 GW eligible in Batch Zero; ~8 GW energised — three figures reported separately and never blended | `profile:oncor` @ v1 — `strategyRead[0]` |
| Oncor: collateral held rose ~US$2.8B (Nov 2025) → US$3.5B (Feb 2026) → US$4.0B (May) → US$5.9B (Aug) while queue growth decelerated 24% → 15% year over year; over US$2B relates to Batch Zero | `profile:oncor` @ v1 — `strategyRead[1]` |
| Oncor: retailer subsidiaries of Vistra and NRG Energy are its two largest customers at 25% and 21% of 2025 total operating revenues; no other customer exceeded 10% | `profile:oncor` @ v1 — `productsAndServices › targetSegments` |
| Oncor: four 765 kV certificate applications pending and publicly opposed by state officials in July 2026, against over 2,000 breakers and transformers already reserved through 2030 | `profile:oncor` @ v1 — `strategyRead[2]`, `strategyRead[5]` |
| AEP: large-load tariffs approved in six of eight states by August 2026, take-or-pay minimum billing demand 80–90%, terms 12–20 years, ramps, collateral, exit fees | `profile:aep` @ v1 — `ecosystemRole`, `strategyRead[0]` |
| AEP: 69 GW contracted reported separately from roughly 195 GW of queue activity; AEP Ohio's PUCO filing shows 17,861 MW contracted against 30,000 MW of pre-tariff requests | `profile:aep` @ v1 — `strategyRead[0]` |
| AEP: nearly 90% of the national 765 kV network; US$33B transmission inside a US$78B capital plan; a 2025 agreement to expand domestic manufacture of EHV transformers and breakers | `profile:aep` @ v1 — `ecosystemRole`, `strategyRead[1]` |
| AEP: no named battery supplier or integrator on any project in any source reviewed; approved-but-not-in-service renewables and storage of 1,808 MW containing a single 224 MW battery project | `profile:aep` @ v1 — `strategyRead[5]` |
| AEP: the Ohio tariff is on appeal at the Supreme Court of Ohio (case 2025-1458); the other seven states' tariffs were argued from the same premise | `profile:aep` @ v1 — `strategyRead[3]`, `policyExposure[]` prose |
| AEP: ERCOT verification report due 10 December 2026; PJM's Interim Resource Adequacy Service administered by distribution utilities from 1 June 2027 | `profile:aep` @ v1 — `policyExposure[]` prose |
| Xcel: first utility to put a hyperscaler's full incremental cost into a customer-specific charge — 1,400 MW wind, 200 MW solar, 300 MW / 30 GWh iron-air under the Google Clean Energy Accelerator Charge; large-load tariffs filed in three states | `profile:xcel-energy` @ v4 — `ecosystemRole` |
| Xcel: ~2 GW contracted against >20 GW pipeline, ~1 GW expected signed in 2026, contracted unmoved between the Q1 and Q2 2026 decks; growth gated by commissions rather than demand or equipment | `profile:xcel-energy` @ v4 — `strategyRead[0]` |
| Xcel: twelve gas-turbine reservations (five GE Vernova F-class), ten Siemens Energy turbines at 2,088 MW and a 2 GW NextEra joint development agreement all executed before any tariff outside Minnesota was approved | `profile:xcel-energy` @ v4 — `strategyRead[1]` |
| Xcel: Texas Attorney General trial 19 April 2027 on Smokehouse Creek; a judgment barring customer recovery would change the SPS credit story more than any mitigation spend | `profile:xcel-energy` @ v4 — `strategyRead[7]`, `policyExposure[]` |
| NRG: started with the customers and bought the generation to match; retail was US$29.5B of US$30.7B of FY2025 revenue; integration reduces actual and contingent collateral | `profile:nrg-energy` @ v1 — `ecosystemRole`, `strategyRead[3]` |
| NRG: LS Power closed 30 January 2026 for US$10,583M of consideration plus ~US$3.2B of assumed debt, adding ~13 GW across nine states and doubling the fleet to about 25 GW | `profile:nrg-energy` @ v1 — `strategyRead[1]` |
| NRG: the only one of the four large merchants with no named hyperscaler counterparty; 445 MW of signed retail power agreements with an unnamed counterparty | `profile:nrg-energy` @ v1 — `strategyRead[2]` |
| NRG: the August 2026 Texas pause left its signed 445 MW exposed because they are grid-served, **while behind-the-meter generation was exempt** | `profile:nrg-energy` @ v1 — `strategyRead[6]` |
| Vistra: owns both the generation and the customers so that a price move hurting one side helps the other; Oncor's single largest customer group at 25% of 2025 revenue | `profile:vistra` @ v3 — `ecosystemRole`, `strategyRead[2]` |
| Vistra: **every** signed large-load agreement is nuclear — 1,200 MW to Amazon from Comanche Peak, 2,609 MW to Meta from Perry, Davis-Besse and the uprate programme; the gas-fleet language is unchanged across four consecutive filings | `profile:vistra` @ v3 — `strategyRead[1]` |
| Vistra: Cogentrix at 5,496 MW clears to roughly 50,000 MW pro forma, FERC-approved and unclosed, expected late 2026 | `profile:vistra` @ v3 — `strategyRead[4]`, `strategyRead[7]` |
| ENGIE: frames co-location of compute at its own generation and storage sites in market-structure terms — Cipher Mining up to 300 MW, Prometheus Hyperscale — with no MW disclosed and no third-party verification of Prometheus | `profile:engie-north-america` @ v2 — `strategyRead[4]` |
| ENGIE: ENGIE Resources sells commercial and industrial retail supply in deregulated markets since 2002; ranked second in US operating battery storage at 3.662 GW on 30 June 2026 | `profiler-segments.json` @ v05.77r — `members[].basis`; `profile:engie-north-america` @ v2 — `strategyRead[0]` |
| Tesla: operates as a Texas retail electricity provider aggregating Powerwalls (Tesla Electric / virtual power plants) | `profile:tesla` @ v7 — `productsAndServices`; `profiler-segments.json` @ v05.77r — `members[].basis` |
| NextEra Energy Resources: the US$67B Dominion merger; the single largest AIDC energy counterparty; self-integrates, buying cells and DC blocks direct so a containerised-system vendor has no integrator channel to ride | `profile:nextera-energy-resources` @ v4 — `ecosystemRole`, `strategyRead[2]`, `strategyRead[3]` |
| Invenergy: created a dedicated unit in April 2026 for natural gas and data-centre development; build-and-transfer at commissioning — 918 MW filed by Indiana Michigan Power, two plants at ~US$2.3B combined by We Energies, another 1.95 GW planned | `profile:invenergy` @ v3 — `strategyRead[2]` |
| Grid United: sells utilities ownership slices of interregional lines they would not have planned themselves — ALLETE at ~35% as operator, seven utilities on non-binding MOUs for 2,550 MW of North Plains Connector; "these electric companies will be the ultimate owners — with each owning a slice" | `profile:grid-united` @ v1 — `ecosystemRole`, `strategyRead[0]`; `profiler-segments.json` @ v05.77r — `members[].basis` |
| Pattern Energy: build-own-transfer of Western Spirit Transmission to PNM for US$285 million in 2021; first Subscriber Participating Transmission Owner scheduled into CAISO; the developer Entergy Mississippi opposes at the state commission | `profile:pattern-energy` @ v1 — `ecosystemRole`, `strategyRead[0]`, `strategyRead[3]`; `profiler-segments.json` @ v05.77r — `members[].basis` |

**Two claims in this module are the module's own and are labelled as such wherever they appear**, because no dossier states them: that the six incumbents are best read by **instrument** rather than by size, and that the segment's threat runs on **three disintermediation routes**. Both are syntheses over the ledgered claims above, and both are written in the module as an assessment rather than as a fact.

## 9. What the record does NOT say

Stated as gaps, not inferred around. Six of these are supplier-facing and are the reason a seller cannot work this segment from the dossiers alone.

- **No battery supplier is named on any Entergy-owned project, and no battery supplier or integrator appears on any AEP project, in any source either dossier reviewed.** Two of the six incumbents run open storage solicitations and neither's vendor is discoverable from the record. Southern is the exception that shows the shape: its owned fleet names Wärtsilä, a trade-press Tesla attribution and two EPCs.
- **Invenergy names no battery integrator, cell supplier, PCS vendor or storage EPC anywhere** — its own dossier calls that absence the finding for a supplier reading it. The only chemistry statement is "lithium iron phosphate".
- **The contracted megawatts, minimum-bill percentages and termination formulas in Georgia's and Entergy's large-load contracts are filed under seal or redacted.** The commercial terms that decide the economics of every campus in those franchises are not on the public record at all, and both dossiers say so in their own collection gaps.
- **Oncor names no large-load customer anywhere** — no hyperscaler, colocation developer, engineering contractor or transformer manufacturer in its 10-K, its 2026 quarterlies, any earnings release, its investor presentation, its sustainability report or 151 newsroom items. The composition of the 298 GW is therefore not determinable from its own materials.
- **No independent, dated ranking of these six franchises against each other exists**, and none could: they do not compete for the same customer. Every ordering in §3 is by instrument, stated as a judgment. The one third-party ranking the segment touches is a storage-ownership table, and it ranks an adjacent (ENGIE, second at 3.662 GW), not an incumbent.
- **NRG publishes no net leverage ratio in any filing and its investor site returned 403 and 503**, so the percentage of expected generation hedged — a figure Vistra and Talen both publish — is unobtainable. Vistra, symmetrically, **discloses storage in MW only**, with no MWh figure for any asset in any filing, deck or sustainability report.
- **Prometheus Hyperscale's construction progress, financing and load commitment are unverified by any third party**, and neither it nor the Cipher Mining agreement discloses MW under contract — so Route 1's most direct example is an announced intent, not a delivered one.
- **The turbine OEM is unstated for most of the gas build this segment is certifying.** Southern's dossier infers one J-class supplier at low confidence and says no source states it; Entergy's infers Mitsubishi at low confidence on the same basis. A supplier reading either as fact would be reading an inference the dossier explicitly flagged.
- **Whether any Invenergy gas plant is contractually tied to a named hyperscaler campus beyond the utility filings' references is not established.** Route 2's clearest example stops one link short of the customer.
- **Xcel states that further supply-chain partnerships exist but are undisclosed for confidentiality**, so the supplier map for the one franchise most openly designing tariffs is necessarily incomplete — the dossier says so itself.

## 10. Freshness gate — the `reviewBy` judgment, resolved

§10.6 sets `reviewBy` as "the nearest dated gate among the members' `policyExposure[]` and the developments the module leans on, else six months from `updated`". The three prior S2 sessions each left a test behind, and all three were applied here.

**The measurement.** The fourteen members carry **76 `policyExposure[]` entries**, of which **64 carry an `effectiveDate`**. Sorted, exactly **one** of those 64 is in the future: **2027-01-01**, on `dominion-energy`'s "Virginia large-load cost allocation (GS-5; Rider T-1 direct assignment; HB 1393; 2026 budget consumption tax)". A generator implementing "earliest future `effectiveDate`, else `updated` + 6 months" would therefore return **2027-01-01**.

**The taken value is 2026-10-01, and the three-month difference is this session's transferable finding.** Session 2's rule — `reviewBy` is **read, not sorted**, because a dated gate can sit inside a `policyExposure[]` entry's `exposure` prose rather than in its `effectiveDate` field when one entry carries a two-step schedule — fires here for the third time, and for the first time it produces an answer **nearer** than the sort rather than differently shaped. `southern-company`'s entry is titled "Georgia PSC large-load rule (contracts above 100 MW)" and its `effectiveDate` field carries the Georgia first step, **2025-02-01**. Its last sentence carries the second step: *"Alabama's 2026 statute (150 MW threshold, effective October 1, 2026) and generic docket extend the model to Alabama Power."*

**It passes all three prior sessions' tests, which is why it was taken.**

- **Session 1's Cummins test** — reject a gate on a topic no section of the module teaches. The Alabama statute is taught: §3 uses it as the evidence that the threshold-contract instrument is spreading inside one holding company at a *higher* threshold than Georgia's, and §6 lists it. It is not a date imported to justify itself.
- **Session 2's read-don't-sort test** — the gate is in the prose, the field holds the earlier step. Confirmed by direct inspection of all 76 entries.
- **Session 3's window test** — reject a window rather than a date, and reject a procedural step rather than a rule taking effect. "Effective October 1, 2026" is a date, and a statutory threshold coming into force is a rule taking effect.

**Nearer and competing candidates, rejected in writing.**

1. **7 October 2026** (Entergy's LPSC phase-two hearing), **3 November 2026** (the Georgia PSC election), **17 November 2026** (the SCC merger hearing and the Arkansas cost-allocation hearing) and **8 December 2026** (the South Carolina hearings) — **hearings and an election are not rules taking effect.** This is the class session 3 rejected explicitly ("a procedural step in a docket, not a rule taking effect"). All four are in §6's indicators table, which is where a procedural date belongs.
2. **10 December 2026** — the ERCOT / PUCT data-centre verification report due under the August 2026 audit directive. This is the date the procurement playbook's own regulatory calendar leads with, and it is the one a careless read would take. It is **a deliverable due inside an audit**, not a rule commencing: nothing changes on the day the report lands, and the tariff or order it may lead to carries no date anywhere in the record. Rejected on the same test as (1).
3. **~29 October 2026** — Dominion's amended line-extension policy with mandatory contributions in aid of construction, due 90 days after the 31 July 2026 order. This is the closest call: it *is* a tariff provision taking effect, and it is nearer than 1 October is far. It was rejected because the record states it as **"about" a date derived from a 90-day clock** rather than as a stated effective date — a computed approximation, which is a window by another name. Recorded here so the next session sees the reasoning rather than the omission.
4. **1 January 2027** — the sorted answer. Real, load-bearing and taught in §3, but not nearest once the prose is read.

**Consequence, stated plainly because it is new to the corpus.** `updated` is 2026-09-14 and `reviewBy` is 2026-10-01 — **seventeen days**. This is the first module in the guidance corpus to ship inside its own 30-day review horizon: `clReviewChip` will render it **gold** on the library card and the module header immediately, and red once the date passes. That is the freshness discipline working, not a defect — the Alabama threshold coming into force genuinely changes a structural claim this module makes, and a module that said so and then set `reviewBy` six months out would be lying with a date field. `scripts/check-classroom-curriculum.py` will report it under section 5 ("review dates within 30 days or passed"); that section never calls `strict()`, so `--strict` still exits 0 with "no structural findings". The baseline it moves is **0 items due for review → 1**, and the item is this module.

**A note for whoever picks it up on 1 October.** The re-read is small and bounded: confirm the Alabama statute took effect as stated, check whether Alabama Power has filed or executed anything under it, and reset `reviewBy` to the next gate — which on today's record is 1 January 2027, the Dominion GS-5 class.

## 11. The Scraper interest seed — asked from scratch, and ADDED

Step 9 of `.claude/rules/industry-guidance.md` makes the seed conditional, and §10.6 (e) and (i) record that the answer has gone both ways: session 1 added `topic-bess-integrators`, session 2 correctly declined because `topic-bess-technology` already owned its layer, session 3 added `topic-storage-owners` only after its first draft had to be cut back against terms `topic-storage-offtake` and `topic-capacity-markets` already carried. §7.23 warned that "the utility layer is well covered by existing rate-case and procurement seeds" and that the answer is not obviously yes.

**The check was run the way session 3's finding requires — against every existing *term*, not against seed labels.** The two arrays hold **58 seeds and 404 term strings, 381 distinct**. Five seeds touch this segment and were read in full:

| Seed | Its terms | What it owns |
|---|---|---|
| `topic-utility-procurement` (source: `guidance:utility-aidc-procurement-2026-08`) | interconnection · large load · tariff filing · ERCOT · PJM · co-location · behind-the-meter | The **procurement process** — planted by the playbook module this landscape splits from |
| `topic-federal-interconnection` (source: `guidance:large-load-interconnection-2026-09`) | Order No. 2023 · show cause order · section 206 · co-located load · cluster study · withdrawal penalty · RM26-4 · High Impact Large Load · Contract Demand · behind the meter generation | The **federal docket** |
| `topic-capacity-markets` | interconnection queue · capacity market · capacity auction · pjm · ercot · caiso · miso · queue reform | The **queue and the auction** |
| `topic-grid-infrastructure` (source: `guidance:power-infra-aidc-2026-08`) | grid capacity · transformer shortage · gas turbine · transmission · NOGRR 282 · SB 6 | The **physical chain** |
| `topic-federal-action` | executive order · national emergency · Federal Register · notice of proposed rulemaking · Department of Energy · FERC order · Treasury guidance · Federal Acquisition Regulation | **Federal** rulemaking only |

**The gap, named.** Not one of the 381 distinct terms is a **state ratemaking** word. `rate case`, `rate base`, `integrated resource plan`, `certificate`, `cost allocation`, `ratepayer`, `commission`, `prudence`, `recovery`, `rider` and `securitization` all return **zero matches across both arrays**. The venue that decides whether an AI-load plant is built, who pays for it and at what allocation — the venue six of this segment's fourteen dossiers are organised around — is invisible to the digest's topic band. An article headlined *"Georgia PSC approves a rate freeze through 2028"* or *"Virginia SCC orders direct assignment of transmission costs to data centers"* matches nothing: `topic-utility-procurement`'s seven terms are all interconnection-process words and `topic-federal-action`'s eight are federal-only.

**The separate filing class behind it**, which is session 1's bar for a new seed: state commission dockets are a distinct and enumerable class — the rate case, the integrated resource plan, the certificate of public convenience, the cost-allocation proceeding, the prudence review — separate from FERC's dockets (`topic-federal-interconnection`) and from the interconnection queue (`topic-capacity-markets`). Every incumbent in this segment is measured by it in its own dossier, and three of the module's §6 indicators are proceedings of exactly this class.

**The seed added:**

```js
{ key: 'topic-utility-ratemaking',
  label: 'State ratemaking: rate cases, IRPs, certificates & cost allocation',
  terms: ['rate case', 'rate base', 'integrated resource plan', 'certificate of public convenience',
          'cost allocation', 'ratepayer', 'public utility commission', 'prudence review'],
  source: 'guidance:landscape-utilities-2026-09' },
```

All eight terms were checked individually against the 381 and all eight are absent. **No `tv` marker** — `tv` guards edits to an *existing* seed's terms and lives on `SCRAPER_SEGMENT_SEEDS`; this is a new key in `SCRAPER_INTEREST_TOPIC_SEEDS` with no sheet row (§10.6 (i)).

**Array correction, recorded so it does not propagate.** §7.23's prompt says to check candidates against "`SCRAPER_SEGMENT_SEEDS`". Step 9 of `industry-guidance.md` specifies `SCRAPER_INTEREST_TOPIC_SEEDS` with `key: 'topic-<slug>'` and `source: 'guidance:<module-id>'`, and every guidance-derived seed in the file — `topic-utility-procurement`, `topic-federal-interconnection`, `topic-grid-equipment-shortage`, `topic-bess-integrators`, `topic-storage-owners` — is in that array. **The rule and the precedent agree; the brief's array name was the slip.** The duplicate check was run against **both** arrays regardless, which is what session 3's finding actually requires, so the slip cost nothing.

**Two sub-layers considered and deliberately left out**, so a later session does not re-litigate them: `retail electricity provider` and `restructured market` (the challenger layer's own vocabulary — real, unscored, but the digest already reaches those companies through `seg-aidc` and the covered-company signal, and a seed for two companies is a poor trade), and `build-own-transfer` / `ownership slice` (Route 2's vocabulary — genuinely unscored, but it names a transaction shape rather than a filing class, and no ranking table or docket series stands behind it). Both are recorded here and left for a session that touches `Scraper.gs` for its own reason.

## 12. Revision — 24 September 2026 review

A freshness review ahead of the 1 October gate. The Alabama threshold statute is enacted and takes effect on 1 October 2026 as taught, so it no longer bounds the module. `reviewBy` moves to the next effective date in the record, **2027-01-01** (Dominion's new large-load class). That is the date the fence sort returns, and it keeps §10's rule that a hearing, an election or a deliverable is not a review date. Two taught claims had moved:

- **The Texas asymmetry.** The August pause did exempt behind-the-meter generation. On 21 September 2026, though, the governor directed TCEQ to halt all permits sought by data centres until the ERCOT audit completes, with a compliance update due 19 October (Office of the Texas Governor). TCEQ is the body that issues the air permits on-site generation needs, so the route around the grid now waits on a permit. The difference between the routes is timing rather than exemption. These were corrected: route one, the sales line, seller's play 3, the NRG bet row and quiz item 3. A new indicator row was added.
- **The merger calendar.** 17 November is **Virginia's** evidentiary hearing (SCC case PUR-2026-00112). 8 December and the final order expected 29 January 2027 are **South Carolina's**.
- **Not changed, and flagged:**
  - AEP's own 30 July release counts **five** approved large-load tariffs with three pending, while the dossier's "six of eight" rests on an August investor handout this review could not reach. It is unverified rather than contradicted, and left for the AEP dossier.
  - The "all-stock" description of the Dominion combination was not re-verified.
- **Scenarios re-judged**, and all nine beats hold:
  - `scenario-utilities-objection`: merger calendar corrected; review date stays 1 October.
  - `scenario-utilities-discovery`: pin only; review date 3 November.
  - `scenario-utilities-discovery-aidc`: Texas premise corrected; review date 10 December.

## 13. Revision — 26 September 2026 re-pin (five franchises added)

Five franchises joined `utilities` as incumbents on 26 September 2026 (Profiler Phase F, v07.57r and v07.58r): `duke-energy`, `dte-energy`, `wec-energy`, `berkshire-hathaway-energy` and `exelon`, each at `profileVersion` 1 with `lastUpdated` 2026-09-26. **The fourteen original dossiers had not moved** — every one is still at the version §8 cites — so each change below is a G3 contradiction: a claim the module taught that the new record states differently. The five dossiers, the segments registry at v07.58r and the F-U1/F-U2 premise verdicts in `PROFILER-COVERAGE-PLAN.md` §11.3 are the only new inputs. No web research was run.

### The segment re-measured

| | 14 September | 26 September | Note |
|---|---|---|---|
| Members | 14 | **19** | registry at v07.58r |
| `incumbent` | 6 | **11** | + Duke, DTE, WEC, Berkshire Hathaway Energy, Exelon |
| `challenger` / `adjacent` | 2 / 6 | 2 / 6 | unchanged |
| Policy entries / dated / future | 76 / 64 / 1 | **103 / 85 / 1** | the one future `effectiveDate` is still Dominion's 2027-01-01 |
| Franchises the procurement playbook covers | 5 of 6 | **5 of 11** | Dominion, Southern, Entergy, Oncor, AEP; none of the five newcomers |
| FY2025 revenue carriers among the 13 ranked | 8 of 8 | **12 of 13** | DTE's dossier states no full-year revenue (10-K host blocked) |

**Revenue order (USD M, FY2025, `financials` overlay):** Duke 32,237 · NRG 30,713 · Southern 29,600 · Berkshire Hathaway Energy 26,200 (about 22,000 of it energy, the balance HomeServices) · Exelon 24,258 · AEP 21,876 · Vistra 17,738 · Dominion 16,506 · Xcel 14,669 · Entergy 12,947 · WEC 9,800 · Oncor 6,778.

### Section by section — the G3 sentences

- **`who-dominates-and-on-what-basis`** taught "six incumbents", a playbook covering "the same franchises plus four", "Southern is the one member that buys the battery itself" and "one of five machines". The registry now holds eleven franchises and the playbook covers five of them. Duke, DTE and WEC own utility batteries (`productsAndServices`), NV Energy owns two, and DTE names its supplier. **Revised:**
  - The opening, the Southern sentence and the closing "Reading the eleven as a set" paragraph are corrected.
  - Three paragraphs are added. They read the five newcomers as variants of the existing five instruments: Duke runs the contract, DTE, WEC and NV Energy the customer-specific charge, and Exelon the collateral.
  - **That mapping is the module's own analysis, not a claim any dossier makes.** It is labelled as analysis in the ledger intro. The split with the playbook held: no tariff table, no channel list and no buyer map entered.
- **`who-threatens`** taught NRG first and Vistra third by revenue, both ahead of four incumbents. Duke's 32,237M now leads: NRG is second and Vistra seventh of twelve. The label's meaning is unchanged. **The wires-only and PPA-side test, decided from the record:**
  - Exelon owns no generation, so routes one and two cannot shrink it. Its record shows the franchise trying to widen its scope again, and even then the ACE petition's battery arrives by route two: Invenergy develops it, builds it and picks the battery (`exelon` SR[2]).
  - NV Energy's entire new battery build sits with PPA developers (`berkshire-hathaway-energy` SR[0]). Nevada also gives route one its first commission-approved instance: 362 MW of temporary gas for Tract, conditionally approved on 17 September 2026 (SR[1], SR[2]).
  - **The three routes stand.** The newcomers put two of them inside a franchise's own record.
- **`each-players-bet`** grows from eight rows to thirteen. The new bets come from `strategyRead[]`, and the confidence labels are carried over:
  - Duke: SR[1] High, SR[3] and SR[5] Moderate.
  - DTE: SR[0] and SR[1] High, SR[4] Moderate.
  - WEC: SR[0] and SR[1] High, SR[2] Moderate.
  - BHE: SR[0] and SR[1] High, SR[4] Moderate.
  - Exelon: SR[0]–SR[2] High.
- **`the-indicators`** taught 76 entries and a 1 January 2027 review date. Nine rows are added:
  - Florida's 1 October compliant-tariff deadline.
  - The Oregon Supreme Court argument on 3 November.
  - North Carolina's mid-November rate orders, the expedited large-load tariff and the 31 December resource-plan order.
  - **The Nevada commission's 2 December statutory decision.**
  - The Illinois grid-plan order on 15 December.
  - WEC's Q4 certificate decisions and ER26-3265.
  - The NJ BPU decision on ACE Pittsgrove, about February 2027.
  - Michigan's undated decision on U-22058.
  - The undated PowerHouse credit-clause case in the Northern District of Illinois.

  The sales line's "three of these sixteen" ratemaking count becomes eight of twenty-six, five of them new.
- **`the-sellers-play`** taught three things that no longer hold:
  - Five mechanisms across six franchises. Revised: the instrument-first play becomes two questions — which instrument, and who owns the asset under it — because the charge design routes the battery three ways (DTE purchase order, WEC build-transfer, NV Energy PPA).
  - "Every incumbent publishes a large number it does not believe." Revised to "most", with Exelon's 36→4 GW and NV Energy's 22→6 GW added. Duke is the exception: it publishes no inquiry figure (`duke-energy` SR[0], `ecosystemRole`).
  - "Two of the three largest revenue lines are not utilities." Now one: NRG is second behind Duke.
- **`claims-ledger`**:
  - 21 rows added for the five newcomers at v1, by field.
  - The count, revenue and fence rows are re-measured.
  - The intro now marks `strategyRead[]`/`ecosystemRole` rows as the dossier's analysis and the other fields as fact, and names the module's third own claim (the variant mapping).
- **`what-the-record-does-not-say`**:
  - Item 1 now counts the eleven: most of the owned lane names no supplier, DTE names LGES Vertech, and NV Energy names BYD cells for Reid Gardner only.
  - Item 3 becomes "the Texas wires incumbent", since Exelon names its TSA holders.
  - Item 4 is re-counted to eleven.
  - Item 5 records that Duke names GE Vernova (26 turbines) while DTE, WEC and BHE name no turbine OEM.
  - Item 7 adds Nevada's approval: approved, not delivered.
  - A new item 9 lists the newcomers' own gaps: DTE's revenue, PacifiCorp's Utah counterparty, PECO's tariff filing, Maryland's PC72 terms and the U-22058 order.
- **`drill`** cards 1, 2, 3 and 7 and **`check-yourself`** items 1, 2 and 5 carried the old counts and rankings, and are corrected. No correct answer changed.
- **Outside the sections:**
  - `short`, tiles 1 and 4 and `source.doc` are updated.
  - `updated` is 2026-09-26 and `reviewBy` 2026-12-02.
  - The function's header comment in `Classroom.gs` is updated too. It still said "reviewBy is 2026-10-01" (stale since v07.40r) and "the eight bets".

### The review date, resolved again — 2 December 2026

A sort still returns 1 January 2027: none of the 21 dated entries the newcomers add is in the future. Read in prose, the five dossiers carry nearer dates. Each was tested against §10's three tests and §10.6 (r):

1. **1 October 2026 — rejected.**
   - Florida SB 484's compliant-tariff deadline (`duke-energy` PE[1]) is a **filing deadline**, and Duke Energy Florida has told the commission its rate schedule comes in its next rate case.
   - The same day's DTE Gas rate step (`dte-energy` recentDevelopments[3]) fails session 1's Cummins test: no section teaches a gas rate.
   - The Pennsylvania PUC's tentative curtailment order is a procedural step.
   - Maryland's PC 74 window (1–31 October) is a solicitation window.
   - Exelon's CFO change on 5 October is not a policy gate.
2. **3 November 2026 — rejected.** The Oregon Supreme Court argument in *James* is a hearing.
3. **Mid-November 2026 — rejected.** The NCUC rate orders and the FERC show-cause responses (`exelon` PE[1]) are month-part windows, and the responses are deliverables.
4. **15 November 2026 — rejected.** Illinois's first statewide IRP filing is a deliverable.
5. **2 December 2026 — taken.** This is the PUCN's statutory deadline to rule on NV Energy's 2026 IRP (Docket 26-05007) and the form LLESA, whose minimum-demand, minimum-energy and generation-charge terms every filing customer reserved for the commission (`berkshire-hathaway-energy` PE[1], SR[0], SR[1]). It passes all four tests:
   - **Taught.** The LLESA is in `who-dominates`, the bets and the indicators, and on the day it is decided the claim "left for the commission" changes.
   - **In prose.** It sits in the entry's text, while the entry's `effectiveDate` field carries 2026-05-07.
   - **A stated day.** It is a decision that fixes an instrument's terms, not a procedural step.
   - **Unclaimed.** No other module carries 2026-12-02.

   §10's own rejection of 10 December foreshadowed this: that candidate failed because "the tariff or order it may lead to carries no date anywhere in the record". This order carries one.
6. **Later, and not needed:** the ICC order on 15 December, Duke's resource-plan order by 31 December, and 1 January 2027 (Dominion's GS-5 and Duke's Carolinas rates).

**Consequence for the scenarios** (design §6: a scenario never outlives its landscape): `scenario-utilities-discovery-aidc`'s `reviewBy` moves from 2026-12-10 to 2026-12-02.

### Scenarios re-judged (design D6 — a developer session)

- **`scenario-utilities-objection`** (Dominion): all three beats hold.
  - Changed: `what-the-record-does-not-say`. "Two of the six franchises" becomes the eleven-franchise disclosure read.
  - Pin 2026-09-24 → 2026-09-26. `reviewBy` stays **2026-10-01**, the reframe's gate; the reframe is its own reminder, 2–6 October.
- **`scenario-utilities-discovery`** (Southern): all three beats hold.
  - Changed: `claims-ledger`. "Every incumbent" becomes "most incumbents".
  - Pin 2026-09-24 → 2026-09-26. `reviewBy` stays 2026-11-03.
- **`scenario-utilities-discovery-aidc`** (AEP): all three beats hold.
  - Changed: `the-position` and `claims-ledger`. "Most incumbents" is applied, and the review-date row is rewritten.
  - Pin 2026-09-24 → 2026-09-26. `reviewBy` 2026-12-10 → 2026-12-02.
- **Counterparty pins are unchanged:** `dominion-energy` v1 @2026-09-03, `southern-company` v2 @2026-09-05 and `aep` v1 @2026-09-03 are still the registry's current versions. `project:stargate` is also unchanged.

### Flagged, not changed

- **The brief's OEM claim is wrong.** The brief said no battery or turbine OEM is named by any of the five except DTE's LG Energy Solution and Reid Gardner's BYD. Duke's record names **GE Vernova** as its turbine supplier (26 units secured; `summary`, `ecosystemRole`), and the module follows the record. The coverage plan's "no OEM" line for Duke concerns batteries only.
- **The Profiler session's unreconciled figures are not taught here:** Oracle ~$300M vs DTE's "nearly $2B", MasTec's $4.2B vs BHE's, Exelon's TSA-backed ~8→4 GW with collateral flat, and Compass Hoffman Estates.
- **Carried from §12, unchanged:** AEP's "six of eight" and Dominion's "all-stock" description. The latter is for the Dominion reframe session.
- **`landscape-storage-developers-and-ipps-2026-09` received a count-only correction in the same push.** Duke, DTE, WEC and BHE joined it as adjacents. Its analysis file records the correction.

Developed by: LightAISolutions
