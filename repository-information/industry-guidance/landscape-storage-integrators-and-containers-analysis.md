# Landscape — Storage Integrators and Containers — Analysis & Module Source

**Provenance:** Corpus synthesis over the segment's member dossiers at the versions in the claims ledger; no ingested document. Compiled 2026-09-14 from `live-site-pages/profiler-data/profiler-segments.json` and the 32 member `<slug>.profile.json` files only — **no new web research, no ingested source**. Nothing under `industry-guidance/sources/` belongs to this module and step 1 of the Industry Guidance Command does not apply. The dossiers already cite their own primary sources; this file cites the dossiers, field by field, in §8. Feeds the in-app module `landscape-storage-integrators-and-containers-2026-09` in `googleAppsScripts/Classroom/Classroom.gs` (lane: The Value Chain; tier: contributor). This is the first module of S2 — the layer-4 judgment layer of `CLASSROOM-CURRICULUM-PLAN.md` §10.1.

## What this is

`CLASSROOM-CURRICULUM-PLAN.md` §10.1 splits the market-structure layer in two. **Layer 3** is the generated segment lesson `segment-storage-integrators-and-containers` — public, analyst-visible, and containing no judgment at all: the registry's definition, its seven buying criteria, the 32-row player table with each member's role and basis, the normalized figures the dossiers carry, the graph edges among members, the last twelve months of developments, and the policy fence. **Layer 4 is this module**, and it exists because the lesson deliberately states the record and stops.

The record, stated, does not answer the question a seller actually has. It does not say which of the five rankers to believe when they disagree about who is #1. It does not say whether a top-ten placement earned on a bankability scorecard means the same thing as one earned on gigawatt-hours shipped. It does not say what each of the eighteen ranked players is *trying to do*. Those are judgments, they rest on the `strategyRead[]` field the generator is forbidden to touch (§10.4, "no `strategyRead` — that is analysis, and analysis is the landscape's"), and they belong at the contributor tier because `INTEGRATED-REMEDIATION-PLAN.md` §7.2 decision 2 put them there.

**This is the one module class that names and ranks covered companies.** The 2026-08-29 content-scope directive keeps single-company analysis out of guidance modules; the landscape modules are the developer-approved exception, and the guidance they give is still to a group — the seller reading it, about the players it sells against and to.

## The segment as measured

Measured 2026-09-14 from `profiler-segments.json` at repo version v05.63r:

| | Count | Note |
|---|---|---|
| Members with a dossier | **32** | The largest supply segment in the registry |
| `incumbent` | **10** | BYD · Canadian Solar · CATL · CRRC Zhuzhou · Envision · Fluence · HyperStrong · Sungrow · Tesla · Wärtsilä |
| `challenger` | **8** | Hithium · Jinko · LG Energy Solution · LS-ES · Prevalon · Samsung SDI · Sunwoda · Trina Storage |
| `adjacent` | **14** | CALB · Caterpillar · Cornex · Cummins · Eaton · FlexGen · GE Vernova · Great Power · Huawei Digital Power · Narada · ON.energy · Rolls-Royce Power Systems · Sinexcel · Vertiv |
| Floor met (§10.2) | **yes**, far above it | Three members including one incumbent and one challenger is the floor; this segment holds ten and eight |
| Members carrying `strategyRead[]` | **32 of 32** | Including **all 18** incumbents and challengers — the `each-players-bet` row set |

**§10.2's S0 table is stale and should be read as such.** It records 29 members (10 · 8 · 11), measured 2026-09-07. Three adjacent members arrived with S3's cell-maker fill after that date — `calb`, `cornex` and `great-power` — taking the adjacent count from 11 to 14. The incumbent and challenger counts are unchanged, so **the floor arithmetic and the `each-players-bet` row count are unaffected**; only the total moves. The lesson to carry forward is the one §10.4 already learned about the regeneration backlog: re-measure from the registry, never from a recorded table.

**Eighteen rows is a large table and all eighteen belong.** §10.6 specifies one row per incumbent and challenger. Every one of the eighteen carries a `strategyRead[]`, so there is no thin-evidence argument for trimming the table to the interesting players, and trimming it would silently convert a complete roster into an editor's shortlist. The table is long because the segment is.

## Teaching sequence (mirrors the module sections)

1. Who dominates, and on what basis — the ranking problem first, because it is the buying criterion
2. Who threatens — the four routes of attack, and the one coming from outside the segment
3. Each player's bet — eighteen rows, analysis labelled as analysis
4. The indicators — what to watch, dated where the record dates it
5. The seller's play — the two paths of §10.10
6. Claims ledger — every claim to a dossier field at its profile version
7. What the record does NOT say
8. Flashcards, self-test

---

## 1. Executive read

**The segment's first buying criterion is a ranking, and the rankings do not agree.** `profiler-segments.json` lists bankability — "Wood Mackenzie / BNEF ranking and independent-engineer acceptance" — as criterion one of seven. For the 2025 assessment year, five ranking houses appear across the member dossiers and at least three answer "who is number one" differently: Wood Mackenzie's 2026 comprehensive ranking puts **Sungrow** first, the first vendor to take the integrator crown from Tesla; Benchmark puts **BYD** first at roughly 60 GWh and 13% share; InfoLink puts **Tesla** first with Sungrow second and BYD third. Wood Mackenzie's own two 2025 instruments disagree with each other — BYD is #3 on market share and #4 on the ten-criteria scorecard. The BYD dossier states the reason plainly and it is the most useful sentence in the segment: **none of the rankers states its metric precisely enough — shipments versus installations versus contracted volume is never nailed down, and no source reconciles them.**

**There are therefore two different kinds of top-ten placement in this segment, and they are not interchangeable.** One is earned on volume: Tesla's 46.7 GWh deployed in 2025, Sungrow's 43 GWh shipped, BYD's ~60 GWh. The other is earned on a scorecard: Canadian Solar's e-STORAGE ranks in Wood Mackenzie's 2026 global top-10 **on bankability while sitting outside the volume top-5**; Trina Storage is Grade A and tied #5 on comprehensive scoring at roughly 8 GWh against Tesla's ~47 GWh; Envision is tied #5 on the ten-criteria method while absent from InfoLink's 2025 shipment top tier; Wärtsilä holds a global top-ten placement on an order book that fell 60% that year. A buyer applying criterion one and a buyer applying criterion two are reading different leagues, and a seller who quotes "top five" without naming the instrument is quoting nothing.

**The Western/Chinese split in this segment is a policy artifact, not a capability one.** Chinese integrators captured roughly 76% of a market that passed 100 GW of annual installs. The domestic price floor is set by a state-owned enterprise — CRRC Zhuzhou's consistent CNY 0.46–0.53/Wh winning bids to fellow central-SOE generators, across four consecutive tender cycles. What separates the field in the United States is not engineering: the Fluence dossier states that **Fluence and Tesla hold the only two at-scale FEOC-compliant Western supply chains**, and the most capable Chinese systems in the segment — CRRC's 35 kV transformerless grid-forming line, Envision's Gen 8 and SST/800 VDC work, HyperStrong's grid-forming blocks — are excluded from the US tax-credit-linked market by ownership tests rather than by specification.

**The consequence for anyone selling here: provenance has become a product feature, and it is being sold as one.** Prevalon's differentiation is "provenance engineering rather than product scale" — US-built IEC 62443 controls, CSA large-scale fire testing, IEEE 693 seismic qualification, and 10 GWh of US-made AESC cells. Canadian Solar restructured its corporate ownership (CS PowerTech, 75.1% parent-held) explicitly against the OBBBA tests. LG Energy Solution's advantage is stated by its own dossier as "regulatory, not technical". And the counter-example proves the point: LS-ES has the cleanest structural FEOC story in the US mid-tier — Korean parent, Korean tier-1 cells, US-engineered PCS — and its dossier calls its failure to market it "a real commercial anomaly", with no FEOC or non-Chinese-supply-chain page, white paper or press release anywhere on its site.

## 2. Known-vs-new against the current curriculum

| The reader already has | Where | This module adds |
|---|---|---|
| What the segment is, its seven buying criteria, all 32 members with role and basis | `segment-storage-integrators-and-containers` sections 1–4 (public) | Which of the criteria actually decides a deal, and why criterion one is unstable |
| The comparable normalized figures the dossiers carry | Same lesson, `the-numbers` | Nothing — the module deliberately does not restate figures the lesson owns |
| Which members the graph connects, and how | Same lesson, `who-is-connected` | What the supplier/customer edges *mean* competitively — CRRC as Hithium's largest cell customer and direct systems rival; Sunwoda content inside competitors' systems |
| The policy regimes bearing on the segment and on whom | Same lesson, `the-fence` | Which of them is a market-access question and which is a price question, and the one date that resets the field |
| How a battery and a container work | `bess-foundations` track | Nothing — mechanism stays where it is taught |
| Bankability, UL 9540A, NFPA 855, warranty structures | `bess-bankability-2026-08` guidance module | Nothing — that module owns certification; this one owns who is ranked and by whom |
| FEOC, Section 301, the tariff stack | `china-policy-stack-2026-08` guidance module | Nothing on the law itself; only its competitive effect inside this one segment |

---

## 3. Who dominates, and on what basis

Ten members carry the `incumbent` role. The role is the registry's, and the registry's `basis` line for each says what earned it. Grouped by the *kind* of dominance rather than by rank, because the kind is what a buyer is actually choosing between:

**Dominance on volume, disputed at the top.** **Sungrow** is No. 1 in Wood Mackenzie's 2026 comprehensive ranking — and simultaneously No. 1 in its PV inverter ranking, the first vendor to hold both crowns at once — on 43 GWh of 2025 storage shipments, with a sixth BloombergNEF inverter-bankability ranking alongside. **Tesla** is #2 in the same 2026 ranking, having been #1 for 2024 at 15% global and 39% North American share, on a record 46.7 GWh deployed in 2025. **BYD** is Benchmark's #1 for 2025 at ~60 GWh and 13% share, InfoLink's and Wood Mackenzie's #3, and Benchmark's and InfoLink's #1 for H1 2026 — where InfoLink calls BYD and Sungrow "extremely similar" in utility-scale. **CATL** is the segment's cell superpower reaching downstream: No. 1 in energy-storage batteries for five consecutive years, ESS battery sales 93 GWh (2024) → 121 GWh (2025), and the sole BESS supplier for the largest single BESS order on record (19 GWh of TENER into Masdar's 5.2 GW round-the-clock project).

**Dominance on a scorecard, at a fraction of the volume.** **Canadian Solar**'s e-STORAGE ranks in the 2026 global top-10 on bankability while outside the volume top-5, on 3.9 GWh of 2025 US deliveries. **Envision** is tied 5th on Wood Mackenzie's ten-criteria methodology while absent from InfoLink's 2025 shipment top tier — its own dossier's phrase is "capability-tier-1 but volume-tier-2". **Fluence** is #7 in the same ranking on 6.8 GW cumulative deployed and a record $6.4B backlog. **Wärtsilä** holds a global top-ten placement on >19 GWh deployed or contracted across 130+ sites, and an early first-in-industry IEC 62443 certification for its GEMS platform.

**Dominance inside one market, by construction.** **CRRC Zhuzhou** dominates the world's largest domestic market with no US office, no US channel and no FEOC workaround attempted — its dossier calls it "the ecosystem's control case". Its moat is the rail-traction power-electronics stack: in-house IGBT/SiC through Times Electric feeding a grid-forming, 35 kV transformerless family that its dossier says only Sungrow and Huawei match in-house. **HyperStrong** is the integrator-without-cells case — domestic #1 cumulative, top-5 by shipments through mid-2025, ~86% of volume still Chinese, and completely absent from Wood Mackenzie's and Benchmark's 2025 global top-10s. Its dossier's own defensible statement is exactly that hedged one, which is the honest form of a ranking claim in this segment.

**The basis question, put once.** Bankability is criterion one, and "bankable" in this segment means "a named house put you in a table". Four instruments are in play across the dossiers — Wood Mackenzie's comprehensive ten-criteria scorecard, Wood Mackenzie's market-share table, Benchmark's integrator ranking, InfoLink's shipment league — plus BloombergNEF's Tier 1 designation at the cell and inverter level and S&P's installed-base view. They rank different things, they publish on different clocks, and the dossiers carry all of them rather than picking one. **The seller's move is to name the instrument before the number.**

## 4. Who threatens

Four routes of attack, and the fourth comes from outside the segment's own ranking tables.

**1 — The cell makers coming downstream, on price and without standing.** CALB, Cornex and Great Power all build and sell factory-assembled containers, and all three sit at `adjacent` rather than `challenger` for one stated reason: no third-party integrator ranking names them. CALB's ZHIJIU line runs 20-foot 5 MWh and 6.25 MWh+ liquid-cooled containers; Cornex's M5 (5,015 kWh) has been in mass production since February 2024 with CSA Group UL 1973/9540A/9540 and TÜV SÜD certificates and the M6 (6,262 kWh) enters mass production in 2026; Great Power ships MAX-20HC containers with named deployments at 500 MWh and 428 MWh scale. Their system business is, in the registry's own words for Cornex, "a route to market for the cell". **The threat is to price and to the mid-tier's volume, not yet to the ranked incumbents' standing** — and the registry's role assignment says exactly that, which is why the roles are worth reading before the revenue.

**2 — The FEOC-clean mid-tier, attacking on provenance.** Prevalon, LS-ES, Samsung SDI and LG Energy Solution are all selling a supply chain rather than a container. LG Energy Solution is the structurally strongest of the four: five North American ESS sites targeting ~50 GWh of NA cell output by end-2026, a 140 GWh backlog, H1 2026 ESS shipments +357% year on year with ~86% going to North America, and its own claim to be the only supplier serving all three AI-data-center storage applications — BESS, UPS and BBU — on a non-FEOC chain. Samsung SDI attacks a narrower seam: small global share (#12 in H1 2026 at 1.4%) but high-power NCA/LMO for data-center UPS and BBU guided to grow >70% in 2026, a world-first UL indoor large-scale fire-test pass for UPS batteries, and 1.6 GWh of H1 2026 ESS shipments into AI data centers.

**3 — Vertical integration squeezing the integrator-without-cells model.** BYD's cost position derives from the Blade LFP platform shared with its vehicle business across planned capacity above 500 GWh; CATL's from being the cell superpower already. Against that, HyperStrong owns no cells and has locked ≥200 GWh from CATL and 50 GWh from EVE at undisclosed terms — from two suppliers who sell competing systems. CRRC has the same entanglement in the other direction: ≥120 GWh from Hithium and 20 GWh from CATL through 2030, where Hithium is simultaneously its anchor cell supplier and a rival in systems. Trina Storage's dossier makes the cycle argument explicitly — the 2025–26 cell market flipped from glut to tightness, and "in a tight cell market the wrap plus the cell is the margin story."

**4 — The reframing from outside: the AI-data-center power buffer as its own category.** ON.energy sits `adjacent` in this segment because its pivot product is an AI UPS, not a grid container — and its dossier argues the category's US terms are being set there rather than by any ranked integrator: a medium-voltage, NOGRR 282 ride-through-certified, FEOC-clean-by-design stack anchored by a 5 GW Crusoe deployment. Prevalon is attacking the same problem from inside the segment with the Hybrid Power Stabilizer, validated against GPU load profiles at a US DOE national laboratory. Both are selling to a buyer who does not appear in any BESS integrator ranking.

**And the counter-current: three of the eighteen are retreating, not attacking.** Trina Storage completed the sale of its Wilmer, Texas plant to T1 Energy in December 2025 and cut its stake to 10% in May 2026 explicitly to ease T1's FEOC alignment, leaving no owned US manufacturing. Wärtsilä is moving its storage business into an RCT-led joint venture after a 60% collapse in 2025 order intake, to EUR 455M. LS-ES has announced no new US project win in over a year and a half. A segment where the incumbents are this concentrated still has a mid-tier that is thinning.

---

## 5. Each player's bet — the eighteen

**Everything in the "bet" column is analysis, not fact.** Each is a reading of that member's `strategyRead[]` entries, and the dossier's own confidence label travels with it. `strategyRead[]` is itself analytical — the generator is forbidden to touch it for exactly that reason (§10.4) — so a bet is a judgment resting on a judgment, and this table says so rather than letting it read as a datum. No figure in this column should be quoted as a fact about a company; the figures live in the dossiers and in the segment lesson.

| Player | Role | The bet — analysis, not fact | Dossier's own confidence |
|---|---|---|---|
| **Sungrow** | incumbent | Hold both Wood Mackenzie crowns while storage becomes the revenue centre without becoming the profit centre, and treat the US as structurally lost rather than temporarily disrupted — Europe's PowerTitan 3.0 volume and the EnerNeo medium-voltage-to-800 VDC stage are the growth, not America | High on position and on the US impairment; Moderate on the AIDC line being commercial |
| **Tesla** | incumbent | Answer Chinese density leadership with standardization plus software — Megablock site-level cost and schedule, plus the Autobidder fleet-optimization layer — rather than competing on container density | High on Energy being the execution bright spot; Moderate on the standardization answer |
| **BYD** | incumbent | Amortize a >500 GWh Blade LFP platform across vehicles and storage, then follow tender demand into local assembly market by market (Brazil after the Chile sequence) | High on the cost position; Moderate on the Latin America template |
| **CATL** | incumbent | Defend a narrowing ESS lead with chemistry rather than price — sodium-ion as the post-lithium hedge — and *buy* into the data-centre power chain rather than build into it | High on the narrowing lead; Moderate on sodium and on the Zhonhen route |
| **Fluence** | incumbent | Make domestic content the product: AESC Tennessee cells and Utah module assembly qualifying customers for the ITC bonus, converting AI/data-centre demand into a contracted channel rather than pipeline talk | High on both |
| **Envision** | incumbent | "Arm the compliant competition" — statutorily fenced out of direct US sales, convert the US cell asset into influence through the Fixx structure and keep a minority stake plus licensing income | High on the strategy; Moderate on whether the structure survives Treasury's final rules |
| **Canadian Solar** (e-STORAGE) | incumbent | Run the FEOC-adaptation playbook to completion — Western listing, the CS PowerTech restructuring, a US cell plant, a captive developer arm — and let the storage arm carry a loss-making module business | High on the playbook and on storage as the profit engine; Moderate on the AIDC exposure |
| **Wärtsilä** | incumbent | Exit merchant storage integration into a joint venture while keeping the engine business's data-centre book, and keep cybersecurity-first positioning as the durable differentiator | High on the managed retreat; Moderate on the cybersecurity moat surviving the ownership change |
| **HyperStrong** | incumbent | Prove that integration skill alone crosses the Pacific — no cells, no PCS fab, no US manufacturing, so the US lane is tax-credit-indifferent buyers while Europe and MEA carry the margin | High on the ranking being methodology-dependent; Moderate on the US position and on the AIDC narrative running ahead of the book |
| **CRRC Zhuzhou** | incumbent | Accept permanent US exclusion as a fact and price for domestic share — SOE-enabled floor pricing, a rail-grade power-electronics moat, and expansion through Europe, MEA, Central Asia and Australia | High on exclusion being structural and on floor pricing; Moderate on AIDC relevance being inferential |
| **LG Energy Solution** | challenger | Convert EV overcapacity into an ESS franchise faster than any peer, and sell a regulatory advantage rather than a technical one — the default non-Chinese North American chain | High on both; Moderate on profitability quality |
| **Hithium** | challenger | Win on cell scale and duration as a stationary-only specialist — the large-cell ladder feeding 6+ MWh blocks with 8-hour-native LDES — and use US and EU plants to insulate the order book | High on the scale achieved and on the AIDC line being marketing rather than business; Moderate on the plants and on financing being the constraint |
| **Samsung SDI** | challenger | Make AI data-centre power the recovery vector through high-power UPS/BBU chemistry and safety certification, not price | High on AIDC being the chosen vector; Moderate on the US LFP conversion and on profit quality |
| **Prevalon** | challenger | Sell provenance engineering rather than scale, and bet the company on the AI-data-centre buffer product | High on both |
| **Trina Storage** | challenger | Sell trust and vertical integration rather than volume — Grade A bankability plus captive cells — and treat the US retreat as structural | High on the bankability/volume split, the US retreat and vertical integration |
| **Sunwoda** | challenger | Wear two hats — merchant cell supplier to integrators it competes with, and a ~#9 integrator — accepting that the conflict caps how far partners let it climb | High on the two-hat conflict, on the US market being closed, and on the financial base being the fragility |
| **Jinko** | challenger | Treat storage as a survival strategy rather than a diversification, with an integrated solar-plus-storage sell and a demand-side AIDC hedge it owns | High on storage being survival; Moderate on the margin story and the AIDC moves |
| **LS-ES** | challenger | Hold the cleanest FEOC structure in the US mid-tier — and, on its own dossier's reading, fail to market it; re-weight toward PCS and components under the parent brand while waiting for BESS attach to the parent's data-centre franchise | High on the position and the anomaly, and on the PCS re-weighting; Moderate on the attach thesis and on pipeline opacity |

**What the eighteen rows say when read together.** Only three of the eighteen bets are primarily about the container — density, cost, duration. The other fifteen are about *access*: a supply chain's ownership, a certification, a tax credit, a ranking, a parent's order book, or an exit. In a segment whose first buying criterion is a third-party ranking and whose fourth is prohibited-foreign-entity exposure, that is the coherent outcome rather than a surprising one — but it is not what a product datasheet suggests, and it is the single most useful thing this table tells a seller.

---

## 6. The indicators

Dated where the record dates it. A date in the "on the record" column is the dossier's own; an entry with no date is a condition to watch rather than an event to diary.

| What to watch | Whose | On the record | Why it moves the segment |
|---|---|---|---|
| Treasury's **final FEOC regulations** and whether continuing licence and IP ties taint effective control | Envision · Prevalon · Fluence | due late 2026 | The single largest open question in the US market. If the Fixx structure fails the test, the domestic-content halo comes off the Smyrna cells and **two** integrators' supply narratives take damage at once — a systemic event for the US mid-tier, not a single-company one |
| **Shelbyville, Kentucky** cell and module output confirmed by an independent source | Canadian Solar | no third-party confirmation through August 2026 | Until Kentucky cells ship at volume, e-STORAGE's US sales carry the same tariff and material-assistance exposure as its Chinese peers — the FEOC-adaptation playbook is unproven at its most expensive step |
| **StarPlus Indiana** LFP conversion | Samsung SDI | October 2026 | Both billion-dollar-class US ESS deals and the claimed through-2029 order book depend on it landing on time |
| The **Wärtsilä storage JV** closing and the counterparty transition | Wärtsilä | ~Q3 2026 | After closing, the sales counterpart may be the RCT-led JV rather than Wärtsilä; contract and service continuity is the live item for anyone holding an LTSA |
| The **LEAG 1.6 GWh** EPC completing | HyperStrong | completes 2026 | Its largest Western reference; a slip damages the European franchise that carries the margin story |
| **Navarre, Spain** €400M cell + BESS gigafactory | Hithium | target 2027 | The pacing item for EU content insulation; the capex is committed against three failed listing attempts |
| The **∞Power 8-hour block** first deliveries | Hithium | Q4 2026 | The AIDC line has had two launches, four SKUs and zero named customers; first deliveries are when the marketing position becomes a business or does not |
| **Masdar / HaoHan** RTC delivery schedule | BYD · CATL | 2027 | The verification point for field-performance credibility at gigascale, on the largest single BESS order on record |
| **Brazil capacity auctions** against the forced-labour listing | BYD | auctions December 2026; listing since April 2026 | BYD is building a US$98M BESS line for that market while sitting on a list that blocks government loans and triggers bank credit review |
| The **1.3 GW hyperscaler contract book** being named or corroborated | Prevalon | claimed, uncorroborated | Its own dossier calls it the single most important unverified number in the profile. If real, the largest disclosed data-centre storage book of any integrator; if inflated, the AIDC story is a product launch plus a DOE test |
| The **A+H listing** clearing CSRC, SFC and HKEX | Sungrow | refiled 24 April 2026, still pending | Would fund international expansion; the October 2025 application lapsed and the H1 2026 interim does not discuss it |
| The **Hong Kong IPO** | Sunwoda | execution-critical | Core ex-NRI profit near zero, cell gross margin under 5%, operating cash flow down 95% — the storage expansion is funded from a barely profitable core |
| The **next ranking editions** | all ten incumbents | Wood Mackenzie 2026 edition assessed 2025; Benchmark H1 2026 | Criterion one is a published table. Every edition re-cuts the field, and the module's dominance ordering is only as current as the edition it names |
| **NDAA §154** Department of Defense procurement ban | CATL · Envision · BYD | 2027-10 (BYD's stated as 2027-10-01) | Not an import ban and not a market-access event for commercial projects — but it is the segment's one hard shared date, and it names three of the ten incumbents |

## 7. What it means for the active engagement — the seller's play

§10.10 defines two implicit reader paths, and this segment sits differently on each.

**The storage seller** reaches this landscape after Value Chain I and `market-access`. The play is: **name the instrument before the number.** A claim of "top-five integrator" is unfalsifiable until the ranker and the metric are named, and in this segment naming them usually helps rather than hurts — a Grade A scorecard placement at 8 GWh is a *different and defensible* claim from a volume placement, and an independent engineer reads them differently. Second: **treat provenance as a spec line, not a compliance footnote.** Four of the eight challengers are selling supply-chain ownership as the product, one of them (LS-ES) has the cleanest structure in the mid-tier and does not market it at all, and the buyer's fourth criterion is literally "domestic content and prohibited-foreign-entity exposure of the cell inside". Third: **read the role before the revenue.** Three cell makers in this segment build and sell containers and are still `adjacent`, because no ranking house names them as integrators — which is the registry stating, in one field, exactly what a bankability-driven buyer will conclude.

**The AIDC power seller** reaches it from Value Chain II and III. The play is: **the AI-campus buffer is a different category from the grid container, and the ranked integrators do not own it yet.** The clearest US position in that category is held by a member the registry places `adjacent` (ON.energy, on a 5 GW deployment and a ride-through certification), and the most specific product from inside the segment is a challenger's (Prevalon's HPS, validated at a national laboratory against GPU load profiles). Meanwhile the two Chinese vendors with the deepest AIDC engineering — Envision's SST and 800 VDC work, CRRC's 35 kV transformerless grid-forming line — are, on their own dossiers' readings, China-proven and US-excluded. Second: **the UPS/BBU seam is where the non-Chinese cell makers are strongest**, and it is a different sale from a container: Samsung SDI's high-power chemistry and UL indoor fire-test pass, LG Energy Solution's claim to cover BESS, UPS and BBU on one non-FEOC chain.

**Common to both paths:** the segment's shared date is 2027-10, and the shared open question is Treasury's final FEOC rules. Everything else on the indicator list is one company's execution.

---

## 8. Claims ledger

Every load-bearing claim above, to the dossier it rests on, at that dossier's `profileVersion` on 2026-09-14, and the field inside it. **The dossiers carry the primary sources; this ledger carries the dossiers** — that is the whole of the provenance chain for a corpus-synthesis module, and it is why no web citation appears anywhere in this file. A claim that could not be placed on a dossier field is not in the module; see §9.

| Claim | Dossier at its version | Field |
|---|---|---|
| Segment holds 32 members — 10 incumbent, 8 challenger, 14 adjacent; seven buying criteria with bankability first | `profiler-segments.json` @ v05.63r | `segments[].members[]`, `.buyingCriteria[]`, `.definition` |
| Sungrow No. 1 in Wood Mackenzie's 2026 BESS integrator and PV inverter rankings; first to take the integrator top spot from Tesla; 43 GWh 2025 storage shipments; sixth BNEF inverter-bankability ranking | `profile:sungrow` @ v9 | `ecosystemRole`; `strategyRead[0]` |
| Sungrow ESS 41.8% of FY2025 revenue at 36.5% gross margin, 50.00% of H1 2026 revenue at 32.43% against inverters' 42.72% | `profile:sungrow` @ v9 | `strategyRead[1]`; `ecosystemRole` |
| Sungrow's US position structurally impaired by category rather than by name; own guidance a gradual pullback | `profile:sungrow` @ v9 | `strategyRead[2]`; `policyExposure[]` "FCC Covered List (power inverters)" |
| Sungrow EnerNeo medium-voltage-AC to 800 VDC stage; small-batch trials through 2026, batch orders from 2027 | `profile:sungrow` @ v9 | `strategyRead[3]` |
| Sungrow A+H refiling 24 April 2026 still pending; ~10 GWh European PowerTitan 3.0 target for 2026 | `profile:sungrow` @ v9 | `strategyRead[5]` |
| Tesla #1 global integrator for 2024 (15% global, 39% North America), #2 in the 2026 ranking; Chinese integrators ~76% of a >100 GW market | `profile:tesla` @ v7 | `ecosystemRole` |
| Tesla 46.7 GWh deployed in 2025 (+49%); Brookshire 16 months groundbreaking to production | `profile:tesla` @ v7 | `strategyRead[0]`; `ecosystemRole` |
| Tesla's answer to Chinese density leadership is standardization plus software (Megablock, Autobidder) | `profile:tesla` @ v7 | `strategyRead[1]` |
| BYD Benchmark #1 for 2025 (~60 GWh, 13% share); Wood Mackenzie and InfoLink #3; Wood Mackenzie #3 on share and #4 on the scorecard; Benchmark and InfoLink #1 for H1 2026 | `profile:byd` @ v9 | `ecosystemRole`; `strategyRead[1]` |
| No ranker states its metric precisely enough — shipments vs installations vs contracted volume never nailed down; no source reconciles them | `profile:byd` @ v9 | `strategyRead[1]` |
| BYD planned cell capacity above 500 GWh; Blade LFP shared with the vehicle business | `profile:byd` @ v9 | `ecosystemRole`; `strategyRead[0]` |
| BYD Brazil US$98M BESS line ahead of December 2026 capacity auctions; forced-labour listing since April 2026 | `profile:byd` @ v9 | `strategyRead[5]`; `policyExposure[]` "Brazil forced-labour registry" |
| NDAA §154 DoD battery procurement ban from October 2027 (BYD stated 2027-10-01) | `profile:byd` @ v9 | `policyExposure[]` "NDAA §154 Department of Defense procurement ban" |
| CATL No. 1 in energy-storage batteries five consecutive years; ESS share 30.4% in 2025 from 36.5%; ESS battery sales 93 → 121 GWh | `profile:catl` @ v7 | `ecosystemRole`; `strategyRead[0]` |
| CATL sole BESS supplier, 19 GWh of TENER, for Masdar's 5.2 GW round-the-clock project — the largest single BESS order to date | `profile:catl` @ v7 | `ecosystemRole` |
| CATL sodium-ion (Naxtra, TENER Sodium) as a post-lithium hedge; the Zhonhen route into data-centre power | `profile:catl` @ v7 | `strategyRead[1]`; `strategyRead[4]` |
| CATL NDAA §154 exposure dated 2027-10 | `profile:catl` @ v7 | `policyExposure[]` "NDAA §154" |
| Fluence #7 in Wood Mackenzie's first Global BESS Integrator Comprehensive Ranking (July 2026); 6.8 GW cumulative deployed; record $6.4B backlog | `profile:fluence` @ v9 | `ecosystemRole` |
| Fluence and Tesla hold the only two at-scale FEOC-compliant Western supply chains; ~half of Fluence's US cell supply from Smyrna | `profile:fluence` @ v9 | `policyExposure[]` "FEOC restrictions" |
| Fluence AESC Tennessee cells + Utah module assembly as ITC domestic-content differentiation; ~$850M data-centre orders through July 2026 | `profile:fluence` @ v9 | `strategyRead[0]`; `strategyRead[1]` |
| Envision tied 5th on Wood Mackenzie's ten-criteria methodology, absent from InfoLink's 2025 shipment top tier; "capability-tier-1 but volume-tier-2" | `profile:envision-energy` @ v3 | `strategyRead[0]` |
| Envision's "arm the compliant competition" strategy; Smyrna supplies ~50% of Fluence's US LFP and 10 GWh to Prevalon; no Envision-branded system sells into the US | `profile:envision-energy` @ v3 | `strategyRead[1]` |
| Whether the Fixx structure survives Treasury's final FEOC regulations (due late 2026) is the single biggest open question | `profile:envision-energy` @ v3 | `strategyRead[2]` |
| Envision NDAA §154 exposure dated 2027-10 | `profile:envision-energy` @ v3 | `policyExposure[]` "NDAA §154" |
| Canadian Solar e-STORAGE in the 2026 global top-10 on bankability while outside the volume top-5; 3.9 GWh 2025 US deliveries; 2.5 GWh March 2026 data-centre-demand order through a utility procurement | `profile:canadian-solar` @ v4 | `ecosystemRole` |
| CS PowerTech 75.1% restructuring with explicit OBBBA framing; Shelbyville cell plant; FY2026 guidance 4.5–5.5 GWh into the US | `profile:canadian-solar` @ v4 | `strategyRead[0]` |
| No independent confirmation of Shelbyville cell or module output through August 2026 | `profile:canadian-solar` @ v4 | `strategyRead[1]` |
| Storage carrying a loss-making module business — FY2025 storage revenue $1.37B (~24% of group) against a $104M group net loss | `profile:canadian-solar` @ v4 | `strategyRead[2]` |
| Wärtsilä >19 GWh deployed or contracted across 130+ sites; global top-ten in Wood Mackenzie's inaugural ranking; first-in-industry IEC 62443 certification for GEMS | `profile:wartsila` @ v7 | `ecosystemRole` |
| Wärtsilä 2025 storage order intake −60% to EUR 455M (2,677 MWh, −52%); the JV as a managed retreat; closing ~Q3 2026 with counterparty transition the near-term risk | `profile:wartsila` @ v7 | `ecosystemRole`; `strategyRead[0]`; `strategyRead[1]` |
| HyperStrong domestic #1 cumulative, top-5 by shipments through mid-2025, ~86% of volume Chinese, absent from Wood Mackenzie's and Benchmark's 2025 global top-10s | `profile:hyperstrong` @ v4 | `strategyRead[0]`; `ecosystemRole` |
| HyperStrong owns no cells; ≥200 GWh CATL pact and 50 GWh EVE agreement at undisclosed terms, both suppliers selling competing systems | `profile:hyperstrong` @ v4 | `strategyRead[1]`; `ecosystemRole` |
| HyperStrong's US lane is tax-credit-indifferent buyers; the AIDC narrative is ahead of the AIDC book; LEAG 1.6 GWh EPC completes 2026 | `profile:hyperstrong` @ v4 | `strategyRead[2]`; `strategyRead[3]`; `strategyRead[4]` |
| CRRC Zhuzhou's US exclusion structural and permanent (1260H, TIVSA since 2020, automatic specified-foreign-entity status); no US office, channel or workaround | `profile:crrc-zhuzhou` @ v3 | `strategyRead[0]`; `ecosystemRole`; `policyExposure[]` |
| CRRC floor pricing CNY 0.46–0.53/Wh across four consecutive tender cycles; domestic price-setter | `profile:crrc-zhuzhou` @ v3 | `strategyRead[1]` |
| CRRC in-house IGBT/SiC via Times Electric feeding a grid-forming, 35 kV transformerless family only Sungrow and Huawei match in-house | `profile:crrc-zhuzhou` @ v3 | `strategyRead[2]` |
| CRRC ≥120 GWh from Hithium and 20 GWh from CATL through 2030; Hithium simultaneously anchor supplier and systems rival | `profile:crrc-zhuzhou` @ v3 | `strategyRead[3]`; `ecosystemRole` |
| LG Energy Solution five North American ESS sites, ~50 GWh NA cell output targeted by end-2026, 140 GWh backlog, H1 2026 ESS +357% with ~86% to North America; own claim to cover BESS, UPS and BBU on a non-FEOC chain | `profile:lg-energy-solution` @ v6 | `ecosystemRole`; `strategyRead[0]`; `strategyRead[3]` |
| LGES's durable advantage is regulatory, not technical | `profile:lg-energy-solution` @ v6 | `strategyRead[1]` |
| Hithium Top 2 in 2025 ESS cell shipments; cumulative past 100 GWh August 2025; Mesquite TX 10 GWh module+system plant; €400M Navarre gigafactory targeting 2027 | `profile:hithium` @ v13 | `ecosystemRole`; `strategyRead[0]`; `strategyRead[2]` |
| Hithium's large-cell ladder (587→650→1175→1300Ah) feeding 6+ MWh blocks with 8-hour-native LDES | `profile:hithium` @ v13 | `strategyRead[1]` |
| Hithium's AIDC line is a product-marketing position rather than a business as of Aug 2026 — zero named customers, flagship 8h block deliveries begin Q4 2026 | `profile:hithium` @ v13 | `strategyRead[4]` |
| Samsung SDI #12 in H1 2026 at 1.4%; UPS/BBU guided >70% growth in 2026; world-first UL indoor large-scale fire-test pass for UPS batteries; 1.6 GWh of H1 2026 ESS shipments to AI data centres | `profile:samsung-sdi` @ v5 | `ecosystemRole`; `strategyRead[0]` |
| Samsung SDI's StarPlus Indiana LFP conversion in October 2026 as the pivotal execution item | `profile:samsung-sdi` @ v5 | `strategyRead[1]` |
| Prevalon differentiates on provenance engineering rather than scale — US-built IEC 62443 controls, CSA large-scale fire testing, IEEE 693 seismic, 10 GWh of US-made AESC cells | `profile:prevalon` @ v5 | `strategyRead[0]`; `ecosystemRole` |
| Prevalon's HPS validated against GPU load profiles at a US DOE national laboratory; the 1.3 GW hyperscaler book is the single most important unverified number in the profile | `profile:prevalon` @ v5 | `strategyRead[1]`; `strategyRead[4]` |
| Trina Grade A / tied #5 on comprehensive scoring while absent from every volume top-5 (~8 GWh 2025 against Tesla's ~47 GWh) | `profile:trina-storage` @ v4 | `strategyRead[0]` |
| Trina's US retreat structural — Wilmer plant sold to T1 Energy December 2025, stake cut to 10% May 2026 framed around T1's FEOC alignment | `profile:trina-storage` @ v4 | `strategyRead[1]`; `policyExposure[]` "FEOC restrictions" |
| The 2025–26 cell market flipped from glut to tightness; in a tight cell market the wrap plus the cell is the margin story | `profile:trina-storage` @ v4 | `strategyRead[2]` |
| Sunwoda's two-hat model — top-10 merchant cell supplier and ~#9 integrator — caps how far partners let it climb; US containerized BESS effectively closed | `profile:sunwoda` @ v4 | `strategyRead[0]`; `strategyRead[1]`; `ecosystemRole` |
| Sunwoda core ex-NRI profit near zero, cell gross margin under 5%, operating cash flow down 95%; the HK IPO execution-critical | `profile:sunwoda` @ v4 | `strategyRead[3]` |
| Jinko a BNEF Tier-1 ESS maker absent from top-10 integrator rankings; storage a survival strategy at 2.2% FY2025 module gross margin | `profile:jinko` @ v5 | `ecosystemRole`; `strategyRead[0]` |
| LS-ES has the cleanest structural FEOC story in the US mid-tier and does not market it — no FEOC page, white paper or release anywhere; no new US project win in over a year and a half | `profile:ls-energy-solutions` @ v3 | `strategyRead[0]`; `strategyRead[3]`; `ecosystemRole` |
| LS-ES's 2026 re-weighting toward PCS and components under the parent brand | `profile:ls-energy-solutions` @ v3 | `strategyRead[1]` |
| CALB ZHIJIU 20-ft 5 MWh and 6.25 MWh+ liquid-cooled containers, sold as a route to market for its own cells; adjacent because no integrator ranking names it | `profile:calb` @ v1 | registry `basis`; `ecosystemRole` |
| Cornex M5 (5,015 kWh) in mass production since February 2024 with CSA Group UL 1973/9540A/9540 and TÜV SÜD certificates; M6 (6,262 kWh) entering mass production 2026; no third-party integrator ranking names it | `profile:cornex` @ v1 | registry `basis`; `ecosystemRole` |
| Great Power MAX-20HC containers with named deployments at 500 MWh and 428.48 MWh; appears in no third-party BESS integrator ranking | `profile:great-power` @ v1 | registry `basis`; `ecosystemRole` |
| ON.energy's AI UPS is medium-voltage, NOGRR 282 ride-through-certified, FEOC-clean by design, anchored by a 5 GW Crusoe deployment | `profile:on-energy` @ v4 | `ecosystemRole` |
| Cummins' EPA 2027 on-highway emissions rules, `proposed`, dated 2027-01 | `profile:cummins` @ v1 | `policyExposure[]` "EPA 2027 on-highway emissions rules" |
| Sungrow's EU high-risk inverter phase-out, `announced`, dated 2027-04, scoped to EU-funded projects | `profile:sungrow` @ v9 | `policyExposure[]` "EU high-risk inverter phase-out" |

---

## 9. What the record does NOT say

1. **There is no agreed ranking of this segment, and this module does not invent one.** It reports which house put whom where, and it never states a single "the #1 integrator is X" without the instrument attached. Anyone who does is quoting one table and hiding the other four.
2. **No revenue figure exists for BYD's storage business.** Its own dossier records that storage sits inside "automobiles and related products" and that no standalone energy-storage revenue line has ever been disclosed. Any BESS revenue attributed to BYD is a third-party estimate; only shipment volumes and ranks exist.
3. **The module contains no financial comparison across the segment.** The normalized KPI overlay is the segment lesson's `the-numbers` section and is owned there. Repeating it here would duplicate a generated table that regenerates on its own clock, and the two would drift.
4. **No web source was consulted for this module.** Every claim traces to a dossier field, and each dossier carries its own citations. If a dossier is wrong, this module is wrong in the same way and at the same version — which is the point of pinning `profileVersion` in the ledger rather than a date.
5. **Prevalon's 1.3 GW hyperscaler contract book is uncorroborated and is presented as such.** No customer is named and no third party has confirmed it. It appears in the indicators as a thing to watch, never in the dominance section as a fact.
6. **No US data-centre storage deal is documented for CRRC Zhuzhou in any English source**, and its AIDC relevance is explicitly inferential on its own dossier's reading. HyperStrong's disclosed data-centre wins are pilots with unnamed operators. Neither appears here as an AIDC position.
7. **Several relationships in the segment are supplier-and-rival at once, and none of them is resolved.** CRRC buys Hithium's cells and competes with Hithium's systems. HyperStrong buys CATL's and EVE's cells and competes with theirs. Sungrow gave Sunwoda a strategic-partner award while fielding rival containers. The record states the entanglement; it does not state how any of them ends.
8. **The three cell makers at `adjacent` may be under-rated by the roles rather than correctly placed.** The registry's stated reason is the absence of a third-party integrator ranking — an evidentiary test, not a capability one. Cornex's own `basis` line records the one contrary data point (CNESA ranking Great Power second among Chinese companies for C&I system shipments) and dismisses it as a national sub-segment. That is a defensible call and it is a call; a future ranking edition could move all three.
9. **`reviewBy` rests on a judgment, not on an arithmetic.** §10 sets it out in full rather than letting the date stand unexplained.
10. **This module does not forecast.** It states what each player is betting, sourced to that player's own `strategyRead[]`, and what is dated on the record. It does not predict who will be first next year, whether Treasury's rules will void the Fixx structure, or whether any of the fourteen indicators resolves the way its owner hopes.

---

## 10. Freshness gate — the `reviewBy` judgment, resolved

**`reviewBy: 2027-01-01`.** §10.6 sets `reviewBy` from "the nearest dated gate among the members' `policyExposure[]` and the developments the module leans on, else six months from `updated`". Both halves of that instruction were tested here, and the answer needed a judgment rather than a sort, so it is written down.

**The candidate set, measured 2026-09-14 across all 32 members.** Exactly five `policyExposure[]` entries carry a future `effectiveDate`, and **no** `recentDevelopments[]` entry anywhere in the segment is future-dated:

| Date on the record | Resolves to | Member | Role | Regime | Status |
|---|---|---|---|---|---|
| `2027-01` | 2027-01-01 | Cummins | **adjacent** | EPA 2027 on-highway emissions rules | **proposed** |
| `2027-04` | 2027-04-01 | Sungrow | incumbent | EU high-risk inverter phase-out | announced |
| `2027-10` | 2027-10-01 | CATL | incumbent | NDAA §154 | announced |
| `2027-10` | 2027-10-01 | Envision | incumbent | NDAA §154 | in-effect |
| `2027-10-01` | 2027-10-01 | BYD | incumbent | NDAA §154 (DoD procurement ban) | announced |

**Two of the five are partial dates and resolve to the first of the month.** `2027-01` → 2027-01-01 and `2027-04` → 2027-04-01. BYD's entry states the NDAA §154 date in full as `2027-10-01`, and the two partial `2027-10` entries resolve to the same day, so the three agree — which is a useful confirmation that first-of-month is the right resolution for this regime rather than an assumption about it.

**The judgment, in three steps.**

1. **The nearest date is Cummins' and it should not, on its own merits, set this module's clock.** Cummins sits at `adjacent`, and its basis for membership is its battery-energy-storage catalogue and 5 MWh data-centre block — not its engine line. The EPA 2027 on-highway rule governs highway engine emissions and bears on nothing this module says. It is also `proposed`, the weakest of the three statuses in the corpus's vocabulary. A module that set its review date from it would be reviewing for a reason it does not carry.
2. **But rejecting it does not buy a later review — it buys a worse one.** `updated` + 6 months is **2027-03-14**, and the next candidate after Cummins is Sungrow's EU phase-out at **2027-04-01**, which is *later* than that default. So the real choice is between a dated 2027-01-01 and an undated 2027-03-14 ten weeks after it. Between a date that means something on the record and a cadence that means nothing, step 10 of the Industry Guidance Command is explicit that the dated one wins — "set from the module's own nearest dated gate … rather than a fixed cadence".
3. **And there is a segment-relevant reason to review at the turn of the year, which is what makes 2027-01-01 the module's own gate rather than Cummins'.** This module's dominance ordering rests entirely on published ranking editions — Wood Mackenzie's *2026 edition, assessing 2025*, Benchmark's *H1 2026* integrator table, InfoLink's *2025* shipment league. Those edition labels are themselves the record's statement that the instruments republish annually and semi-annually. A module whose first section is a ranking ages on the ranking's clock, and the turn of the year is where that clock ticks. **Cummins' date is the coincidence; the ranking cycle is the reason.**

**One divergence, recorded rather than smoothed: the segment lesson below this module reviews on a different date, and that is correct.** `build-classroom-segments.py`'s `review_by()` takes the earliest future `effectiveDate` among the members' policy fence **that matches a full `YYYY-MM-DD`** — `DATE_RE.match(eff)` — so all three partial dates are invisible to it and the generated lesson's `reviewBy` is **2027-10-01**, BYD's fully-stated NDAA §154 date. That is the generator being conservative in the way a deterministic script should be: a partial date is not a date it can order safely, so it does not try. A hand-authored module may resolve `2027-01` to 2027-01-01 and say why; a generator that did the same silently would be inventing precision on every run. **The two dates are produced by two different rules for two different artefacts** — §10.3 for the lesson, §10.6 for the module — and the ten-month gap between them is the honest output of both, not drift between them.

**What a reviewer should re-check, in order.** (1) Whether new ranking editions have published and whether the incumbent ordering in §3 still holds — this is the section most likely to be wrong first. (2) Whether Treasury's final FEOC regulations have issued and what they did to the Fixx structure — the single indicator that moves three members at once. (3) Whether Shelbyville, StarPlus and Navarre hit their dates. (4) Whether the Wärtsilä JV closed and who the counterparty now is. (5) Whether Prevalon's 1.3 GW book has been named or has quietly disappeared. (6) Whether the segment's membership or any role has changed in `profiler-segments.json` — if it has, the segment lesson regenerates and the `each-players-bet` row set may need a row added or removed. (7) Re-measure the future-gate table above from scratch; do not trust this one.

Developed by: LightAISolutions
