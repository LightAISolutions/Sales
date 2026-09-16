# Landscape — Grid Equipment — Analysis & Module Source

**Module:** `landscape-grid-equipment-2026-09` · lane **The Value Chain** · tier **contributor**
**Provenance:** Corpus synthesis over the segment's 15 member dossiers at the versions in the claims ledger; no ingested document and no new research.
**Written:** 2026-09-15 (S2 session 8, repo v05.97r) · **Eighth landscape, seventeenth guidance module.**

## What this is

The source of truth for the eighth landscape module. It is a **corpus synthesis**: no document was ingested and no new research was run. Every claim traces to a member dossier at the profile version recorded in §8, and the dossiers carry the primary sources. The module JSON lives in `googleAppsScripts/Classroom/Classroom.gs` **below the `// CONTENT END` fence**, registered at the end of `guidanceDocs_()`'s The Value Chain lane.

The segment is **position 4** in the chain and tier **build**, and it is the first landscape S2 has written on a segment with a **built landscape module on both sides of it** — position 3 upstream and position 5 downstream. §2 is where that is resolved, and §2 was written first.

## The segment as measured

Re-measured from `profiler-segments.json` on **15 September 2026**, member for member, against the figure `INTEGRATED-REMEDIATION-PLAN.md` §7.31 carried. **They agree exactly: 15 members — 5 incumbent · 1 challenger · 9 adjacent.** This is the **eighth consecutive S2 session** to re-measure its own segment and confirm its brief.

| Role | Members |
|---|---|
| incumbent (5) | `hitachi-energy` · `siemens-energy` · `ge-vernova` · `abb` · `mitsubishi-electric` |
| challenger (1) | `powell-industries` |
| adjacent (9) | `eaton` · `schneider-electric` · `flex` · `quanta-services` · `ls-energy-solutions` · `zhonhen` · `invenergy` · `grid-united` · `pattern-energy` |

**The floor rule (§10.2) is met — three members including an incumbent and a challenger — but only just, on the challenger axis.** One named challenger is the thinnest bench any landscape has faced: sessions 1–7 had eight, eleven, eight, two, three, thirteen and seven. §4 is where that is handled honestly, and the handling is not to pad the section.

**S0's table recorded this segment at 13 members (5 · 1 · 7).** It is now 15, and the registry's own `notes` field says exactly why — which is the first thing §4 reads, per §10.6 (l):

> Reserved adjacent role filled at V3 (v05.40r, 2026-09-12): the two transmission developers (grid-united, pattern-energy) sit here as adjacent — buyers of HVDC converter capacity — alongside Invenergy's Grain Belt Express; the segment's incumbents are unchanged.

**So the adjacent bench is nine deep because the registry deliberately put BUYERS in it.** Three of the nine — `invenergy`, `grid-united`, `pattern-energy` — are customers, not suppliers. That splits the adjacents two ways and it is the key that makes a one-challenger threat section writable.

**The definition, verbatim:**

> The transformers, medium- and high-voltage switchgear, HVDC converters, protection relays and grid-stability machines (synchronous condensers, STATCOMs) that connect a campus or a storage plant to the bulk grid and hold it up. The segment whose delivery calendar sets energization dates for everyone else.

**The six buying criteria, verbatim:**

1. Lead time and the manufacturing slot (transformers 30–40 months; test-bay availability)
2. Voltage and MVA class; GIS vs AIS; SF6-free options
3. Domestic manufacture under EO 14420 and the tariff stack
4. Protection and automation integration (IEC 61850) and the coordination study
5. Service, spares and the bushing supply chain
6. Custom-engineered speed (ten-week MV switchgear from a domestic plant)

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

| # | Section id | Kind | What it does |
|---|---|---|---|
| 1 | `who-dominates-and-on-what-basis` | prose | The split stated first; then the five incumbents read against the **five product families** the definition names — because no two of them cover the same set |
| 2 | `who-threatens` | prose | One challenger, read honestly; then the six supplier-adjacents who carry the actual routes, and the three buyer-adjacents who are not threats at all |
| 3 | `each-players-bet` | table | **6 rows** — the shortest bets table in the corpus, and the segment reported honestly |
| 4 | `the-indicators` | table | 10 dated rows, including **six gates rejected** for `reviewBy` under §10.6 (r) and (v) |
| 5 | `the-sellers-play` | callout | §10.10's two paths |
| 6 | `claims-ledger` | ledger | Every load-bearing claim → `profile:<slug> @ vN — field` |
| 7 | `what-the-record-does-not-say` | callout | Eight absences, one of them a contradiction *inside* the corpus |
| 8 | `drill` | flashcards | 10 cards, first one on the split |
| 9 | `check-yourself` | quiz | 5 judgment questions at the group level |

## 1. Executive read

**The five incumbents are ranked on five non-comparable bases, and the segment's own definition is what exposes it.** The definition names five product families — transformers, MV/HV switchgear, HVDC converters, protection relays, grid-stability machines. **No two incumbents cover the same set.** Two cover all five (Hitachi Energy, Siemens Energy). One covers most of it and owns the deepest American footprint through an acquisition (GE Vernova, with Prolec GE's five US plants). **One sold the two families the definition leads with** — ABB's own dossier says it cannot supply the transformers and HVDC its customers' connections need, because it sold that business to Hitachi before the supercycle. And **one has no published market share in any of the three markets it is named in** (Mitsubishi Electric). The number-one claim is contested inside a single sentence of a single dossier: Hitachi Energy is first in transformers **by installed base** while MarketsandMarkets puts Siemens Energy ahead **on power-transformer revenue share**. Two measures, two leaders, one market.

**The single challenger is the only member of these fifteen that is nothing else.** Every other member sits in at least one other segment of the registry — five of them in three or more. `powell-industries` sits in this one alone. **So the company whose whole identity is grid equipment is also the only one attacking it**, and what it attacks with is not price or technology but **schedule**: ten-week custom switchgear from a Texas plant, in a market where the top five hold 55–60% of North American medium-voltage volume. It is also, by its own product design, a **customer** of four of the five companies its 10-K names as principal competitors.

**The real contest is being carried by adjacent members, and every route is a domestic-manufacturing route.** The craft contractor that is the largest buyer of critical-path grid equipment is spending USD 500–700 million to nearly double its own high-voltage transformer capacity by 2028 and making 800 kV-class breakers in a Pennsylvania joint venture. A contract manufacturer owns branded medium-voltage switchgear and substation protection and is separating that business into its own public company. A Korean parent sells switchgear and transformers out of a Texas campus. **Capacity is entering this segment from outside it, faster than share is moving inside it** — and criterion 3 is what sorts the entrants.

**And the module's own assessment, stated as analysis rather than as a finding of the record: in this segment the scarce thing is not a product, it is a position in a queue — and positions are bought before projects exist.** The proof is in the roster: an adjacent member with no operating asset, no published financials and not one permit reserved this segment's number-one supplier's HVDC converter capacity portfolio-wide in March 2024, and signed a converter specification agreement in October 2025. That is the segment's own sentence — *the delivery calendar sets energization dates for everyone else* — made concrete, and it is why §2's split against the shortage module holds.

## 2. The split — six neighbours, and the line runs in THREE directions

*Written **before** the module, per §10.6 (j). This section was the first thing in this file.*

Session 7 met eleven neighbours and called that the record. **This segment has six — and the split is harder, not easier**, because of what the six are. One is a guidance module about **this exact segment's scarcity**, whose subject *is* this segment's first buying criterion. Two are landscape modules, one on **each side** of this segment in the chain — the first time S2 has met that. And of the four public lessons the generator's `READ_NEXT` names, **only two are built**. Fewer neighbours, deeper overlap per neighbour: the omissions in §2e come to **thirty-five**, against session 7's nineteen across eleven.

### 2a. The hardest one — a module about this segment's own scarcity

`grid-equipment-shortage-2026-09` — *The Grid-Equipment Shortage: GOES, Bushings, Test Bays, Lead Times*, lane The AI Data-Center Wave, `updated` 2026-09-04. This segment's **buying criterion 1** reads *"Lead time and the manufacturing slot (transformers 30–40 months; test-bay availability)"*. That is the other module's title.

**§7.23's test, applied first and before anything else was written.** The shared number is the **transformer lead time**. In that module it appears as a *dated series with a measurement basis* — ~50 weeks in 2021, ~120 in 2024, 128 in Q2 2025, "well beyond 24 months" in March 2026, 36–48 for specialised units — under an instruction never to quote a single remembered number, and it is the **output of four independent constraints**: a structurally unprofitable core-steel input, a component queue, a test bay that holds one unit at a time, and build slots that cannot stretch. It is a **market condition**, and it is deliberately vendor-blind.

Here the same number does a different job. It is **one named vendor's own quoted wait**, and it travels with that vendor's own **rationing instrument**: Hitachi Energy's dossier puts its large-transformer lead times at 30–40 months, *"up to 4 years without a reservation"*, with capacity allocated through reservation agreements on the E.ON framework template — up to USD 700 million, 20,000-plus transformers. The number is not a condition of the market here; it is **the price of a position in one company's queue**. **Different job in each. The test holds.**

**And the neighbour pre-declared the handoff — in a module rather than a lesson, which is new for §10.6 (t).** That module's buyer callout, item 2, reads: *"Reserve the slot early… In a shortage **the queue position is the thing being bought**, not the transformer."* It teaches the instrument and names no holder. **This module names the holders**, and adds the fact the instrument makes possible: a developer with no operating asset, no published financials and not one permit reserved HVDC converter capacity from this segment's number one — portfolio-wide, in March 2024, with a converter specification agreement following in October 2025.

### 2b. The first segment with a built landscape on BOTH sides — and both splits are ROLE INVERSIONS with a DIRECTION

Session 7 recorded the first landscape-against-landscape split and found the line was a role inversion the registry drew itself. **This segment has one on each side, and the inversions point in opposite directions.**

**Upstream, position 3 — `landscape-power-conversion-and-rack-power-silicon-2026-09`.** Eight members sit in both segments and **five carry a different role in each**. Three of this segment's five incumbents — `hitachi-energy`, `ge-vernova`, `abb` — are **adjacent** there. `zhonhen` is adjacent here and **incumbent** there; `flex` is adjacent here and **challenger** there.

**Downstream, position 5 — `landscape-in-hall-power-2026-09`.** Six members sit in both and **four invert** — the mirror image. `eaton`, `schneider-electric` and `zhonhen` are adjacent here and **incumbent** there; `flex` is adjacent here and **challenger** there.

**The direction is the finding, and no previous session could have seen it.** The members this segment ranks highest are *downgraded upstream*; the members it ranks as adjacent are *upgraded downstream*. The registry is not disagreeing with itself — it is describing a chain, and **each landscape ranks the members whose centre of gravity sits at its own position**. Session 7's (x2) said to look at the roles before the subjects when the neighbour is another landscape. With a landscape on both sides, the roles do more than draw a line: **they orient it.**

**Two members are incumbent on both sides of the fence line.** `abb` and `mitsubishi-electric` are the only companies the registry ranks as established in both `grid-equipment` and `in-hall-power` — outside the property line and inside it. Both facts are used in §3, and neither is re-derived from the neighbour module.

**§7.23 against the conversion landscape.** The shared object is the **solid-state transformer**. There it is the architecture the segment is defined around — Delta's grid-to-chip stack, Heron Power's route, the rack-shelf fight. Here it appears exactly once, and as a **hedge against one's own franchise**: GE Vernova is the only grid-equipment incumbent with a disclosed hyperscaler SST purchase commitment — 1,000 units from 2027 if the spec is met — and an SST at the perimeter deletes part of the AC chain this segment sells. A product line there; an option on this segment's own disintermediation here. **The test holds.**

**§7.23 against the in-hall landscape.** The shared fact is that **ABB sold its grid and transmission business to Hitachi before the supercycle**. That module uses it as a *counterparty-diligence flag on a UPS vendor* — the company cannot supply the transformers its customers' connections need. Here it is a **structural fact about this segment's own roster**: an incumbent ranked in grid equipment that cannot supply two of the five product families the segment's definition leads with. Same sentence in the same dossier, two different jobs. **The test holds.**

### 2c. The two modules that own a criterion and the chain

`eo14420-bulk-power-2026-08` owns **criterion 3** — *"Domestic manufacture under EO 14420 and the tariff stack"*. Its §5(b) scope table names this segment's products on the face of the order: *substation transformers, reactors, capacitors*; *protective relaying, HV circuit breakers, metering*; *ICS/DCS — RTUs, PLCs, IEDs*. **That module owns the instrument** — what the order is, the four definitions that decide everything, what counts as covered equipment, the dated rulemaking gates. **This one owns the sorting**: which members sit which side of it, and the finding that the sort does not follow the role labels. That is §10.6 (o)'s *instrument versus sorting* line, firing a second time on a different statute.

`power-infra-aidc-2026-08` owns **the chain** — how the grid is organised and paid, the two market designs, what a grid battery earns, grid-to-GPU, the three BESS sockets, the 2026–28 gates. Nothing below re-teaches any of it.

### 2d. The public side — four named, only TWO built, and one pre-declares the handoff

The generator's `READ_NEXT` map points this segment at four mechanism lessons. **Two are built and two are not**: `the-transformer-and-the-substation` (*Why Electricity Changes Clothes*, §7 row 5) and `the-fence-line` (*The Fence Line: Interconnection and the Substation*) exist; `breakers-relays-and-faults` (row 13 — the very next session's subject) and `grid-stability-and-the-generator` (row 14) do not.

**This is the first landscape written against a curriculum half of which is unbuilt, and it has a consequence the module states rather than hides.** Session 7's segment had all six of its buying criteria taught by a neighbour. Here the count is different and it is worth being exact about it:

| # | Buying criterion | Where its mechanism is taught today |
|---|---|---|
| 1 | Lead time and the manufacturing slot | `the-transformer-and-the-substation` **and** `grid-equipment-shortage-2026-09` |
| 2 | Voltage and MVA class; GIS vs AIS; SF6-free | **nowhere built** — the segment lesson's own table reads `—` |
| 3 | Domestic manufacture under EO 14420 and the tariff stack | `eo14420-bulk-power-2026-08` (the segment lesson's table reads `—`, because no *lesson* teaches it) |
| 4 | Protection and automation (IEC 61850) and the coordination study | `the-fence-line` in part; `breakers-relays-and-faults` **not built** |
| 5 | Service, spares and the bushing supply chain | `the-transformer-and-the-substation` **and** `grid-equipment-shortage-2026-09` |
| 6 | Custom-engineered speed (ten-week MV switchgear) | `the-transformer-and-the-substation` |

**So two of the six tests have no complete owner, and the module does not appoint itself to teach them.** It names the gap, points at the planned lesson, and says who sits where — which is still layer 4's job. A landscape that started teaching criterion 2 because nobody else does would stop being a landscape.

**`the-transformer-and-the-substation` pre-declares the handoff twice, in the same callout, and §10.6 (t) pays again.** Its `the-biggest-lines-run-dc` section closes a worked example with *"**A worked example rather than an answer.** … Read it for the shape of the decision, **not for the company**"* — a declined company-level reading, which is the cleanest possible statement of where the boundary runs. And earlier in the same callout it names the differentiator and refuses to say who holds it: *"What the manufacturers actually differentiate on is neither — it is the control platform coordinating thousands of switching events per cycle across both ends, where decades of accumulated tuning rather than the semiconductors is the moat."* **This module's contribution is to say whose control platform**, and to note that a buyer's dossier names it as a supplied component.

**`the-fence-line` pre-declares differently, and it is a mechanism rather than a refusal.** Its `where-it-fails` callout says: *"**The slot nobody reserved.** Transformers, switchgear and chillers run multi-year order books across the entire industry… This is the mechanism under most slipped energization dates."* The lesson names no vendor and no reservation holder. This module names both. **Read the neighbours' callouts, not only their tiles** — session 7's (x3), holding on a two-lesson neighbourhood as well as on a six-lesson one.

### 2e. The thirty-five omissions — do not import them in a later revision

Enumerated here and in the function's header comment, so a later revision cannot quietly collapse the split.

**From `grid-equipment-shortage-2026-09` (eleven).** (1) The four constraints as a *system* and why price has not cured them. (2) GOES, the single domestic producer, its unprofitability and the single global source for the top grade. (3) The bushing failure band and the component queue behind the build schedule. (4) The test bay as the exit gate, and IEC 60076-3's routine-versus-type distinction. (5) The dated lead-time series and its measurement bases. (6) The slot-versus-duration distinction and why a position can be lost. (7) The announced-capacity arithmetic against demand. (8) The buyer's six instruments. (9) The sparing and sharing layer. (10) The Schnabel-car transport queue. (11) The price spread by equipment category.

**From `eo14420-bulk-power-2026-08` (four).** (12) What the order is and the IEEPA authority it rests on. (13) The §5(b) covered-equipment list. (14) The four definitions that decide everything. (15) The dated rulemaking and FAR gates.

**From `power-infra-aidc-2026-08` (three).** (16) How the grid is organised and paid, and the two market designs. (17) What a grid battery earns. (18) The grid-to-GPU chain and the three BESS sockets.

**From the conversion landscape (four).** (19) Its nine conversion stages. (20) The rack-shelf fight and the second-source ladder. (21) The origin test as a re-sorting of *that* roster. (22) The positions of the eight shared members **in that segment**.

**From the in-hall landscape (four).** (23) Its three groups of incumbents and its seventeen-row bets table. (24) The three routes that delete the room machine. (25) The storage-layer origin of six of its seven challengers. (26) The positions of the six shared members **in that segment**.

**From `the-transformer-and-the-substation` (five).** (27) The voltage ladder and the current each rung implies. (28) What is inside the tank, and why one unit takes three years and more. (29) The AC-versus-DC decision and what is inside a converter station. (30) Its where-it-fails table. (31) The Grain Belt Express worked example read as the shape of a decision.

**From `the-fence-line` (four).** (32) The three studies and the queue they form. (33) Load-versus-generation rules — the large-load tariff, SB 6, NOGRR 282. (34) What actually arrives at the property line. (35) The five numbers all called megawatts.

### 2f. One thing the split does not mean

It does not mean the module is thin. **Not one of the six neighbours ranks a named vendor in this segment.** The shortage module is vendor-blind by construction and names plants only as the addresses of tonnage; the two public lessons anonymise by construction; the policy module defines a test and sorts nobody; and the two landscapes rank the *adjacent* layers, where three of this segment's five incumbents carry a different role. **The ranking of this segment exists nowhere in the corpus until this module.** That is what layer 4 is for.

## 3. Who dominates, and on what basis

**The organising move is to read the five incumbents against the five product families the definition names**, rather than as a league table — because the record does not contain a ranking that covers all five, and the two nearest things to one disagree.

| | transformers | MV/HV switchgear | HVDC converters | protection relays | grid-stability machines |
|---|---|---|---|---|---|
| Hitachi Energy | ✔ #1 installed base | ✔ PASS hybrid 72.5–420 kV, IGA modular GIS | ✔ #1, ~15.3 % | ✔ protection & control IEDs | ✔ STATCOM, hybrid synchronous condensers |
| Siemens Energy | ✔ 10 kV–800 kV, 10–1,300 MVA | ✔ GIS/AIS incl. SF6-free "Blue", DC-GIS ±550 kV | ✔ HVDC PLUS | — | ✔ E-STATCOM, synchronous condensers |
| GE Vernova | ✔ Prolec GE, seven Americas plants, five US | ✔ GIS/AIS 50–800 kV, HV breakers | ✔ six consecutive 2 GW bipoles | — | ✔ STATCOM, synchronous condensers, SVC |
| ABB | **sold** | ✔ (MV, plus the first IEC-certified solid-state breaker) | **sold** | — | ✔ 62 flywheel synchronous condensers on order |
| Mitsubishi Electric | ✔ to 765 kV | ✔ GIS and breakers to 800 kV | — | — | — |

**Two cover the definition; the other three do not, and the gaps are the interesting part.**

**Hitachi Energy's incumbency is the installed base and the queue that rations access to it.** First by installed base and footprint, with a track record of 20-plus units at 800 kV UHVDC and 500-plus at 735–765 kV AC; first in HVDC converter stations at roughly 15.3 % share, having supplied about half the world's HVDC projects since pioneering the technology. Its financial trajectory is what scarcity monetisation looks like executed cleanly: FY25 orders USD 32.8 billion against USD 12.4 billion four years earlier, backlog USD 57.9 billion at about 2.9 × revenue, revenue USD 19.8 billion up 26 %, adjusted EBITA margin from 6.1 % to 13.4 %. **And the mechanism that turns that into position is the reservation agreement** — capacity allocated ahead of orders on the E.ON framework template, up to USD 700 million and 20,000-plus transformers. Its dossier's own high-confidence read is that anyone selling power equipment into this market is selling into, or around, this company's calendar.

**Siemens Energy's is the only one that can write a gigawatt campus from a single book, and the grid half is the more durable half.** Grid Technologies took €5.4 billion of orders in Q3 FY26, up 28 %, on 19.9 % margin and a €51 billion backlog with transformers named as the biggest growth driver — inside a group backlog of €162 billion. Its dossier's own moderate-confidence read is explicit that the grid side outlasts any single generation cycle. Its US answer is domestic capacity: a USD 150 million Charlotte large-power-transformer plant and a new Mississippi high-voltage switchgear plant, with about a third of a €6 billion FY26–28 capital programme going to transformers and switchgear and a €220 million Nuremberg transformer factory beside it. **And the one measure that covers it and Hitachi together puts it first**: MarketsandMarkets on power-transformer revenue share.

**GE Vernova's is American weight, bought.** Prolec GE — roughly 10,000 employees and seven Americas plants, five of them in the United States — became wholly owned in February 2026 for USD 5.275 billion, and its dossier's phrase for the result is that the company **owns the bottleneck's American toll booth**. Data-centre Electrification orders ran about USD 0.7 billion in 2024, above USD 2 billion in 2025 and **above USD 5 billion in the first half of 2026 alone**, with about USD 1 billion of Prolec capital expenditure planned for 2026–28. It is also the only incumbent here holding a **disclosed hyperscaler commitment to buy 1,000 solid-state transformers from 2027** if the specification is met — which is an option on the deletion of part of its own AC chain, and is read that way in §2b rather than as a product line.

**ABB's is one voltage class and one machine, and its own dossier states the hole.** It sold the grid and transmission business to Hitachi before the supercycle, **so it cannot supply the transformers and HVDC its customers' connections need** — two of the five families, gone. What it holds instead is medium voltage and stability: SACE Infinitus, the first IEC-certified solid-state breaker, and 62 flywheel synchronous condensers ordered by one behind-the-meter developer across two years, which its dossier calls the strongest independent validation that AI load volatility is now a purchasable product category. The Electrification order book is the hottest of any diversified electrical — Q2 2026 orders USD 7.2 billion, up 60 %, Americas up 114 %, backlog USD 13.7 billion. **And two structural facts travel with it into any counterparty relationship, both stated by its own dossier**: the divested grid business, and a three-time record of United States bribery settlements that large customers' compliance teams know.

**Mitsubishi Electric's is a marketing position the revenue does not sit under, and it answers no criterion with a number.** It is consistently named in the leading vendor set for data-centre UPS, power transformers and gas-insulated switchgear — and **no firm reachable in the research publishes a market-share percentage for it in any of the three**, with sources that rank rather than list placing it below the top five in transformers. Its own quarterly numbers put the exposure in transmission and distribution: Energy Systems orders up **80 %** year on year in the quarter ended 30 June 2026, attributed to North American transformer business expansion — **while its dossier records that the company has been narrowing rather than broadening that footprint**, closing a Memphis high-voltage transformer plant, which its own author leaves as the outstanding question. Its domestic answer is an USD 86 million Pennsylvania switchgear factory with USD 6.75 million of state grants, which its dossier reads as a tariff and lead-time hedge rather than a bid for share — against Hitachi's USD 155 million across three North American plants inside a USD 9 billion global programme.

**The honesty note this section owes the reader.** An installed base, a revenue-share percentage, a segment backlog, an absence of any published share, a divested product line and a count of flywheel machines are not measures of one thing. **Flattening them into an ordering would misrepresent all of them**, and the corpus does not contain the ordering to flatten. **The module's own assessment, stated as analysis: in this segment the useful question is not who is biggest but which parts of the definition each incumbency actually covers — because the buyer of a converter station and the buyer of arc-resistant switchgear are not shopping the same list, and only two of the five vendors can answer both.**

## 4. Who threatens, and on which route — with exactly ONE challenger

**The craft problem this session was set, and how it was solved: by reading the registry's `notes` first, per §10.6 (l).** The note says the adjacent role here was *reserved* and then *filled with buyers*. That is the permission to read the threat structure off the adjacents — and it is a statement by the registry, not an inference of convenience.

**First, the challenger, at its real size and no larger.** `powell-industries` is a Houston engineer-to-order maker of medium-voltage switchgear and factory-built power rooms. Three facts, all from its own dossier:

- **It has been repriced by one order rather than by a trend.** Roughly USD 800 million of data-centre awards across the first nine months of FY2026, including a **single order above USD 400 million** it calls the largest in its history — more than 16 % of a USD 2.4 billion backlog on its own, that backlog up 69 % year on year at 30 June 2026 on a 3.0 × book-to-bill in the quarter. Commercial and other industrial moved from 15 % to 40 % of backlog in three quarters. Powell itself frames the order as phase one of a multi-phase behind-the-meter campus whose later phases depend on executing the first, **and it names no customer in any filing**.
- **Its advantage is schedule, and that is an attack on criterion 1 rather than on any incumbent's product.** Mordor places the top five — ABB, Siemens, Schneider Electric, Eaton and GE Vernova — at 55–60 % of North American medium-voltage switchgear volume and names Powell's differentiator explicitly: **tailored switchgear in ten weeks from its Texas facility**, credited with multiple 2025 data-centre awards. Its own 10-K concedes competitors may have lower cost structures.
- **And it buys the interrupting element from the companies it competes with.** FlexGear low-voltage switchgear is engineered to accept Eaton Magnum DS, Siemens WL or Schneider Masterpact MTZ draw-out elements; FlexTrol accepts Eaton draw-out or Allen-Bradley contactors. **The one challenger in this segment is a customer of four of the five companies its own filings name as principal competitors**, and it monetises the engineered part rather than the catalogue part.

**The threat inside the challenger's own file is to the margin that justified the re-rating.** Its Q3 FY2026 filing introduces new risk-factor language that data-centre work will likely require **less** custom engineered-to-order equipment — precisely the content on which gross margin expanded from 27.0 % to 29.4 % to 30.6 %. The differentiator and the dilution are the same mix.

**Second, and this is where the section's weight actually sits: the six supplier-adjacents carry the routes, and every one of them is a domestic-capacity route.**

- **`quanta-services` — the customer becoming the maker.** The largest buyer of critical-path grid equipment in the corpus is vertically integrating into the bottleneck: a **USD 500–700 million programme to nearly double high-voltage transformer manufacturing capacity by 2028**, and a Hyosung HICO joint venture making **800 kV-class breakers in Pennsylvania**. Its dossier's own words for the result: *a direct response to the transformer/breaker bottleneck that turns Quanta into a partial competitor of Hitachi Energy, Siemens Energy and GE Vernova on critical-path gear.* It also states the capital-stack arithmetic nobody else publishes — high-voltage transformers and substations are 10–15 % of a load-centre budget against about USD 13.5 million of craft-led spend per megawatt.
- **`flex` — bought scope, about to become its own company.** It owns Crown Technical Systems (relay panels, medium-voltage switchgear, turn-key power-control enclosures, acquired November 2024 for USD 319 million) and Electrical Power Products (substation control and protection, about USD 1 billion), plus Anord Mardix switchgear, busway and power pods. **That is criterion 4's product line and criterion 6's, owned by a contract manufacturer** — and the whole segment is being separated into an independent public company in the first calendar quarter of 2027, with a USD 4.4 billion acquisition agreed on 3 September 2026 landing inside it weeks before. Two limits its own dossier states: **no revenue line has ever been published** for Anord Mardix or Crown, and busway researchers categorise its brand as an *other player* against the named leaders.
- **`ls-energy-solutions` — a parent's Texas campus.** LS ELECTRIC opened Bastrop, Texas in April 2025 with a further USD 240 million committed by 2030, and has booked a string of US data-centre power orders (USD 115 million, USD 70 million, USD 64 million, a USD 34 million repeat order in Wyoming) on a backlog above KRW 7 trillion. Its dossier's own note on the most recent one is the useful detail: **the order went switchgear-only.**
- **`eaton` — a third US transformer site.** Jonesville, South Carolina, hiring from 2027, beside a new Bellevue, Nebraska medium-voltage switchgear plant, inside more than USD 1 billion invested in North American electrical manufacturing since 2023.
- **`schneider-electric` — named in the medium-voltage switchgear top five**, with more than USD 700 million of US expansion through 2027 across eight sites including an El Paso switchgear plant.
- **`zhonhen` — the same products at the other end of the world**: AC low-voltage switchgear and substation DC systems for State Grid and Southern Grid, plus relay-protection setting-calculation software. Its position in the *conversion* segment is that landscape's subject and is not re-derived here.

**Third — and this is the finding that makes a one-challenger section honest rather than padded: three of the nine adjacents are not threats at all. They are the demand, and between them they name only two suppliers.**

- `pattern-energy` owns SunZia, the one long-haul voltage-source HVDC corridor in the United States to reach commercial operation — 550 miles, ±525 kV, 3,000 MW — and its supplier list names **Hitachi Energy** (HVDC Light converters and the MACH control platform) and Quanta for the line.
- `invenergy` is building Grain Belt Express, 800 miles of ±600 kV and USD 11 billion, privately financed after the federal loan guarantee was terminated, with **Siemens Energy** as the HVDC technology partner and Quanta and Kiewit on EPC.
- `grid-united` holds no operating asset, publishes no financials and has filed no Form D — and it **reserved Hitachi Energy's HVDC converter capacity portfolio-wide in March 2024 and signed a converter specification agreement in October 2025, before holding a single permit.** Its dossier calls that reservation the company's most valuable commercial asset after its land.

**So the demand side of this segment's most concentrated product names exactly two of the five incumbents — and the one contractor all three share is the adjacent that is becoming a maker.**

**The module's own assessment, stated as analysis rather than as a finding of the record: the threat here is not share moving inside the segment, it is capacity entering it from outside — and criterion 3 is the sorting mechanism, because every entering route is a domestic-manufacturing route.** A contractor's transformer plant, a Korean parent's Texas campus, an electronics manufacturer's bought switchgear brands and a challenger's ten-week Texas line are the same bet made four ways: that the scarce thing is a domestic slot, and that whoever adds one sells a power-on date the incumbents' calendars cannot offer. **That bet is testable and this module says where to watch it** — §6.

## 5. Each player's bet — the six

**Six rows: five incumbents and one challenger, in registry order. This is the shortest bets table in the corpus** — against utilities' eight, the conversion layer's twelve, cells' fifteen, in-hall power's seventeen, the landlords' twenty-two and developers' twenty-seven. §10.6 (m) says the table shrinks as honestly as it grows; six is what six ranked players is. **Every row is that member's own `strategyRead`, which its dossier already marks as an assessment carrying a confidence level, restated in one line and labelled analysis — never blended with the fact rows above.** The nine adjacents get no row: what they do to this segment is in §4 and §6.

| Player | Role | The bet (analysis) |
|---|---|---|
| Hitachi Energy | incumbent | That **the queue is the product** — scarcity monetised through a reservation system that rations access years ahead while a USD 9 billion capacity programme lands in 2027–28. Its own dossier's back-loaded risk is that the whole industry's announced US investment arrives in the same window, and that a contrarian reading — procurement inefficiency rather than shortage — already exists |
| Siemens Energy | incumbent | That **one book beats four** — turbines, transformers, switchgear, HVDC and stability equipment for a gigawatt campus from one supplier — with a deliberate +30–50 % rather than maximal expansion, so the scarcity is managed rather than spent. The price is a multiple near seventy times earnings that fell on a 21 % beat |
| GE Vernova | incumbent | That **the American toll booth beats the global installed base** — five wholly-owned US transformer plants plus turbine slots selling against 2031 — while hedging its own AC chain with a hyperscaler-funded solid-state-transformer commitment that leapfrogs the switchboard incumbents if the specification lands and hands the market to challengers if it slips |
| ABB | incumbent | That **the medium-voltage and 800 VDC transition resets a leaderboard it does not lead** — pushing UPS and stability functions up to a voltage class where it has no direct static competitor at scale — accepting that it cannot supply the two product families it sold to the company now ranked first here |
| Mitsubishi Electric | incumbent | That **vertical integration into its own power semiconductors is the durable differentiator**, and that a defensive domestic footprint suffices — a switchgear plant its own dossier reads as a tariff and lead-time hedge rather than a bid for share |
| Powell Industries | challenger | That **schedule is a product** — ten-week engineered-to-order switchgear sold as a power-on date the oligopoly cannot quote — accepting that the data-centre mix now entering the backlog needs less of the custom content the margin was built on, which its own risk factors say in as many words |

## 6. The indicators

Ten dated rows. **Six of them were considered for this module's `reviewBy` and rejected** — under §10.6 (r) when a gate is already another module's clock, and under §10.6 (v) when it belongs to a neighbour on split grounds. The rejections are marked, because the rejection is part of the reading. §10 works them in full.

| On record | Indicator | Why it matters |
|---|---|---|
| **31 Oct 2026** | The record of decision and the federal grid-programme finalisation on a 420-mile, ±525 kV, 3,000 MW interregional line, expected together around October 2026 | **This module's review date.** It is the dated test of the segment's own defining claim: whether a converter-capacity reservation taken *before any permit* converts into an order |
| 31 Oct 2026 | An adjacent member's Q3 filing deadline under its home regulator | **Rejected for `reviewBy` on split grounds** — its open question is commercial traction for an architecture the *conversion* landscape ranks it on. Same calendar day as the date taken, different event |
| 5 Oct 2026 | Comment deadline on an environmental scoping notice for a second corridor | **Rejected twice over** — a comment deadline is not a decision, and corridor siting is not an equipment gate |
| 24 Dec 2026 | Implementing rules due under the bulk-power-system emergency order — covered-entity designations and licensing procedures | Criterion 3's operational moment for the whole roster. **Rejected for `reviewBy`: it is already that module's own review date** |
| End of 2026 | One incumbent expected "largely sold out of 2030 deliveries" | **Rejected for `reviewBy`: right company, wrong product line** — that is its gas-turbine book, not its transformer book |
| Q1 cal 2027 | A contract manufacturer's electrical business separates into an independent public company, with a USD 4.4 billion acquisition closing into it | The competitor is reconstituted mid-fight. **Rejected on split grounds** — the in-hall landscape already carries it |
| Early / full production 2027 | The first new US large-power-transformer line reaches production | The most on-point supply gate in the segment. **Rejected twice**: it is the shortage module's own review gate, **and the corpus states it two ways** (see §9) |
| 2027 | A third US transformer site hiring; a fourth domestic facility targeting the same year | Whether the domestic-capacity bet of §4 is a plan or a plant |
| 2H 2027 | Larger high-voltage programmes "stack more meaningfully" for the craft contractor | The contractor's own phasing language — the leading indicator of US grid construction, from the company with the best view of it |
| 2028 | The contractor's doubled high-voltage transformer capacity lands; the largest announced US transformer plant becomes operational; the capped 15 % rate for specified electrical-grid equipment rises to 25 % from 1 Jan 2028 | Three separate things converging on one year. **This is when the segment's ranking can actually change**, and it is beyond any six-month horizon — which is why it is here and not in `reviewBy` |

## 7. The seller's play — §10.10's two paths

**If you sell storage.** This segment is not your socket and the module says so plainly — the three sockets belong to the chain module and the public lesson, and none of them is here. **What this segment is for a storage seller is a lesson in instruments, and a short list of counterparties.** Three things:

1. **The reservation agreement is the transferable idea.** The scarce thing here is a position in a queue, bought years before the project that needs it, and the segment's own buyers do it: one holds a portfolio-wide converter reservation with no permit. If your cells or your containers ever go short, this is the instrument the market reaches for, and this segment is where it is already priced.
2. **Criterion 3 sorts this roster the same way it sorts yours.** The origin test that decides whose transformer can enter a US project is the origin test that decides whose cell can. The roster here re-sorts around domestic plants, not around role labels — and the entrants are a contractor, a Korean parent and a contract manufacturer rather than the incumbents.
3. **Two of the three buyer-adjacents buy utility-scale storage, and one of them names no supplier anywhere.** That dossier's own author flags it: no integrator and no cell supplier appears in the public record for a developer of that size. **An absence that large is a sales finding, not a research gap.**

**If you sell AI data-centre power.** Three moves:

1. **Ask whether the slot is reserved or merely quoted.** A lead time is a duration; a slot is a position. Only one of the two survives somebody else's schedule slipping, and in this segment the difference is a contract term with a name.
2. **Ask which of the five product families the vendor on the project actually makes.** Two of the five incumbents cover all five; one cannot supply transformers or HVDC at all and its own dossier says so. On a campus needing a grid connection **and** in-hall stability, that is not a detail — it is whether the "single-supplier" claim survives the first change order.
3. **Read criterion 4 as an open question rather than a settled one.** The mechanism lesson that teaches protection and coordination **does not exist yet** in this curriculum, and the segment's relay-and-protection products are concentrated in an *adjacent* member that is about to become a different company. An account that cannot say who owns its coordination study has not finished the evaluation.

## 8. Claims ledger

**Provenance:** Corpus synthesis over the segment's member dossiers at the versions below; no ingested document, no new research. Every load-bearing claim above traces to a dossier, at that dossier's profile version on **15 September 2026**, and to the field inside it. **The dossiers carry the primary sources; this ledger carries the dossiers** — that is the whole provenance chain for a corpus-synthesis module, and it is why no publisher appears in the source column. The registry is cited at the repo version of its last change (**v05.41r**, 2026-09-13) rather than at this session's, because it did not move this session.

**Three claims in this module are the module's own** and are labelled as analysis wherever they appear: that the five incumbents cover five different subsets of the definition and cannot be ordered across them; that the threat here is capacity entering from outside the segment rather than share moving inside it; and every row of the bets table.

| Claim | Source |
|---|---|
| Segment holds 15 members — 5 incumbent, 1 challenger, 9 adjacent; chain position 4, tier build | profiler-segments.json @ v05.41r — segments[].members[], .position, .tier |
| The definition names transformers, MV/HV switchgear, HVDC converters, protection relays and grid-stability machines, and closes on the delivery calendar setting energization dates | profiler-segments.json @ v05.41r — segments[].definition |
| The six buying criteria, verbatim | profiler-segments.json @ v05.41r — segments[].buyingCriteria |
| The adjacent role was reserved and filled at V3 with two transmission developers as buyers of HVDC converter capacity; incumbents unchanged | profiler-segments.json @ v05.41r — segments[].notes |
| `powell-industries` is the only one of the fifteen that belongs to no other segment; five members belong to three or more | profiler-segments.json @ v05.41r — segments[].members[] across all nineteen segments |
| First in transformers by installed base and footprint; MarketsandMarkets puts Siemens Energy ahead on power-transformer revenue share | profile:hitachi-energy @ v5 — productsAndServices[0].positioning |
| Track record 20+ units at 800 kV UHVDC, 500+ at 735–765 kV AC | profile:hitachi-energy @ v5 — productsAndServices[0].description |
| Lead times 30–40 months, up to 4 years without a reservation; capacity allocated via reservation agreements on the E.ON framework template (up to USD 700M, 20,000+ transformers) | profile:hitachi-energy @ v5 — productsAndServices[0].positioning |
| ~15.3 % HVDC converter-station share; supplied roughly half the world's HVDC projects | profile:hitachi-energy @ v5 — productsAndServices[1].positioning |
| FY25 orders USD 32.8B (from USD 12.4B in FY21), backlog USD 57.9B ≈2.9× revenue, revenue USD 19.8B +26 %, adj. EBITA margin 6.1 %→13.4 % | profile:hitachi-energy @ v5 — summary; strategyRead[1]; financials.periods[0] |
| USD 9B+ global capacity programme; USD 457M South Boston VA plant operational 2028; USD 155M across three North American plants | profile:hitachi-energy @ v5 — productsAndServices[0].roadmap; profile:mitsubishi-electric @ v3 — strategyRead[3] |
| Anyone selling power equipment into this market is selling into or around this company's calendar | profile:hitachi-energy @ v5 — strategyRead[0] |
| Industry's announced US transformer investment all lands 2027–28; a contrarian "not a shortage" reading exists | profile:hitachi-energy @ v5 — strategyRead[3] |
| Grid Technologies Q3 FY26 orders €5.4B (+28 %), margin 19.9 %, backlog €51B with transformers the biggest growth driver; group backlog €162B | profile:siemens-energy @ v7 — productsAndServices[1].description; summary |
| Transformers 10 kV–800 kV / 10–1,300 MVA; GIS/AIS incl. SF6-free "Blue"; DC-GIS to ±550 kV; HVDC PLUS; E-STATCOM marketed for data-centre load fluctuation | profile:siemens-energy @ v7 — productsAndServices[1].description |
| USD 150M Charlotte LPT plant, "first units early 2026, full production 2027"; new Mississippi HV switchgear plant; €220M Nuremberg; ~⅓ of the €6B FY26–28 capex to transformers/switchgear | profile:siemens-energy @ v7 — productsAndServices[1].positioning and .roadmap |
| The grid side is the more durable franchise than gas turbines | profile:siemens-energy @ v7 — strategyRead[2] |
| Prolec GE ~10,000 employees, seven Americas plants, five in the US; wholly owned for USD 5.275B in February 2026 | profile:ge-vernova @ v6 — productsAndServices[2].description; summary |
| "GEV owns the bottleneck's American toll booth"; data-centre Electrification orders ~USD 0.7B (2024) → >USD 2B (2025) → >USD 5B in 1H 2026; ~USD 1B Prolec capex 2026–28 | profile:ge-vernova @ v6 — productsAndServices[2].positioning and .roadmap |
| Switchgear 50–800 kV; six consecutive 2 GW bipole contracts; STATCOMs, synchronous condensers, SVCs | profile:ge-vernova @ v6 — productsAndServices[2].description |
| An R&D cost-share with a hyperscaler carries a commitment to buy 1,000 SSTs from 2027 if spec is met; the only grid-equipment incumbent with a disclosed one | profile:ge-vernova @ v6 — productsAndServices[3].description and .positioning |
| Expected "largely sold out of 2030 deliveries by end of 2026" | profile:ge-vernova @ v6 — productsAndServices[0].roadmap |
| ABB sold its grid/transmission business to Hitachi before the supercycle and cannot supply the transformers and HVDC its campuses' connections need; three-time US bribery settler | profile:abb @ v7 — strategyRead[4] |
| SACE Infinitus is the first IEC-certified solid-state breaker; 62 flywheel synchronous condensers ordered by one behind-the-meter developer across two years | profile:abb @ v7 — ecosystemRole; strategyRead[1] |
| Q2 2026 Electrification orders USD 7.2B (+60 %), Americas +114 %, backlog USD 13.7B (+57 %) | profile:abb @ v7 — summary |
| Named in the leading vendor set for data-centre UPS, power transformers and GIS, with no published market-share percentage in any of the three, and below the top five where sources rank | profile:mitsubishi-electric @ v3 — ecosystemRole; strategyRead[4] |
| Energy Systems orders +80 % YoY in the quarter ended 2026-06-30, attributed to North American transformer expansion; the Memphis plant closure makes that attribution the dossier's outstanding question | profile:mitsubishi-electric @ v3 — strategyRead[0]; recentDevelopments[13].read |
| Transformers to 765 kV, GIS and breakers to 800 kV; USD 86M Pennsylvania switchgear factory with USD 6.75M of state grants, read as a tariff and lead-time hedge | profile:mitsubishi-electric @ v3 — summary; strategyRead[3] |
| ~USD 800M of data-centre awards in 9M FY2026; a single order above USD 400M, >16 % of a USD 2.4B backlog; backlog +69 % YoY at 2026-06-30 on 3.0× book-to-bill; commercial/other industrial 15 %→40 % of backlog | profile:powell-industries @ v2 — summary; strategyRead[1] |
| Top five hold 55–60 % of North American MV switchgear volume; the differentiator is tailored switchgear in ten weeks from a Texas facility | profile:powell-industries @ v2 — ecosystemRole; strategyRead[0] |
| FlexGear accepts Eaton, Siemens or Schneider draw-out elements; FlexTrol accepts Eaton or Allen-Bradley contactors — it buys the interrupting element from its named competitors | profile:powell-industries @ v2 — strategyRead[3] |
| New risk-factor language that data-centre work will need less custom engineered-to-order equipment, against gross margin 27.0 %→29.4 %→30.6 % on that content; no customer named in any filing | profile:powell-industries @ v2 — strategyRead[2]; summary |
| USD 500–700M programme to nearly double HV transformer capacity by 2028; Hyosung HICO JV making 800 kV-class breakers in Pennsylvania; "a partial competitor of Hitachi Energy, Siemens Energy and GE Vernova on critical-path gear" | profile:quanta-services @ v5 — ecosystemRole; productsAndServices[3].positioning and .roadmap |
| ~USD 13.5M craft-led spend per MW; HV transformers/substations 10–15 % of a load-centre budget | profile:quanta-services @ v5 — ecosystemRole |
| Larger high-voltage programmes "stack more meaningfully in 2H 2027" | profile:quanta-services @ v5 — productsAndServices[0].roadmap |
| Owns Crown Technical Systems (relay panels, MV switchgear; USD 319M, November 2024) and Electrical Power Products (substation control and protection, ~USD 1B), plus Anord Mardix switchgear, busway and power pods | profile:flex @ v1 — productsAndServices[0] and [3]; recentDevelopments[10] |
| The segment separates into an independent public company in the first calendar quarter of 2027; a USD 4.4B acquisition agreed 3 September 2026 lands inside it first | profile:flex @ v1 — summary; strategyRead[0] and [2] |
| No revenue line has ever been published for Anord Mardix, JetCool or Crown; busway researchers categorise its brand as an "other player" | profile:flex @ v1 — strategyRead[9]; productsAndServices[0].positioning |
| Parent opened a Bastrop, Texas campus in April 2025 (+USD 240M by 2030) and booked USD 115M, USD 70M, USD 64M and USD 34M US data-centre power orders on a >KRW 7T backlog; the most recent went switchgear-only | profile:ls-energy-solutions @ v3 — summary; recentDevelopments[0] and [2].read |
| Third US transformer site at Jonesville, SC hiring from 2027; new Bellevue, NE MV switchgear plant; >USD 1B in North American electrical manufacturing since 2023 | profile:eaton @ v8 — productsAndServices[1].description and .roadmap |
| Named in the MV switchgear top five; >USD 700M of US expansion through 2027 across eight sites including an El Paso switchgear plant | profile:schneider-electric @ v9 — productsAndServices[3].description |
| AC low-voltage switchgear and substation DC systems for State Grid and Southern Grid; relay-protection setting-calculation software | profile:zhonhen @ v8 — productsAndServices[3] and [5].description |
| Next report Q3 2026, due by the 2026-10-31 regulator deadline | profile:zhonhen @ v8 — financials.periods[0].commentary |
| SunZia: 550 miles, ±525 kV, 3,000 MW VSC HVDC, the one long-haul US corridor in commercial operation; suppliers Hitachi Energy (HVDC Light and MACH) and Quanta for the line | profile:pattern-energy @ v1 — summary; productsAndServices[0].description |
| BLM EIS scoping on a second corridor opened 2 September 2026 with comments to 5 October 2026 | profile:pattern-energy @ v1 — productsAndServices[2].description |
| Grain Belt Express: 800 miles, USD 11B, privately financed after the federal guarantee was terminated; Siemens Energy the HVDC technology partner; EPC to Quanta and Kiewit | profile:invenergy @ v3 — summary; productsAndServices[3].description and .soldThrough |
| Its storage procurement is invisible in the public record — no integrator or cell supplier named anywhere | profile:invenergy @ v3 — ecosystemRole |
| Holds no operating asset, publishes no financials, has filed no Form D; reserved Hitachi Energy HVDC converter capacity portfolio-wide (March 2024) and signed a converter specification agreement (October 2025) before holding a permit; that reservation is its most valuable commercial asset after its land | profile:grid-united @ v1 — summary; strategyRead[0] and [3] |
| North Plains Connector: 420 miles, ±525 kV, 3,000 MW; final federal EIS 28 August 2026; conditional USD 700M federal grant; cost USD 2.5B (2023) → ~USD 6B (2026); COD 2032 | profile:grid-united @ v1 — summary |
| Indicator: the record of decision and the grid-programme finalisation decision, expected together around October 2026 | profile:grid-united @ v1 — strategyRead[4] |

## 9. What the record does NOT say

**1 — There is no ranking of this segment that covers its own definition.** The two nearest measures disagree about who is first in transformers *and* measure different things — installed base against revenue share — and no source reachable through these dossiers ranks across transformers, switchgear, HVDC converters, protection relays and stability machines together. The module declines to invent the ordering; §3 is organised as a coverage table for exactly that reason.

**2 — One of the five incumbents has no published market-share percentage in any of the three markets it is named in.** Its own dossier says so in as many words and records that where sources rank rather than list, it falls below the top five. A vendor named in a leading set and a vendor holding a measured share are different facts, and only one of them is available here.

**3 — The corpus states this segment's most-cited supply-relief date two different ways, and both statements are in this app.** A member dossier records the flagship domestic transformer line as *"first units early 2026, full production 2027"*; the guidance module on the shortage, working from research sources rather than from that dossier, records production starting *"by early 2027"*. **The module reports the disagreement rather than choosing** — and it is one of the reasons that date was rejected as a `reviewBy` in §10 rather than only because another module owns it.

**4 — No revenue line has ever been published** for the adjacent member's branded switchgear, busway and protection businesses. Its own dossier states this. **Anyone quoting a data-centre revenue figure for that company is quoting something the record does not contain.**

**5 — The challenger names no customer in any filing.** The single order above USD 400 million that repriced the company is attached to an unidentified counterparty in every public source, and the company discloses backlog only to the nearest USD 0.1 billion and gives no numeric guidance.

**6 — No source in this corpus sizes the grid-stability machine market.** Four of the five incumbents sell synchronous condensers or STATCOMs; the only quantity anywhere in these fifteen dossiers is one behind-the-meter developer's 62-unit order, whose dollar value is undisclosed, **so revenue materiality is unproven** — a point that dossier makes itself. That is the fifth product family in the definition, and the record cannot measure it.

**7 — The reservation instrument's terms are not disclosed.** Neither the price, the duration nor the conditions of the portfolio-wide HVDC converter reservation are on the record, which is exactly why the dossier holds that claim at moderate rather than high confidence. **This module treats the reservation as an instrument, never as a valuation.**

**8 — Nothing here forecasts when the delivery calendar loosens.** The announced capacity, its dated starts and the arithmetic against demand belong to the shortage module. This one says who holds which slot, on what basis, and stops.

## 10. Freshness gate — the `reviewBy` judgment, resolved

**`reviewBy` = 2026-10-31.** Read, not sorted — the **ninth consecutive** session on §10.6 (d)/(k).

**A sort of the fence returns NOTHING AT ALL, and that is the headline of this section.** Across the fifteen members there are **41 `policyExposure[]` entries, 25 of them carrying an `effectiveDate`, and not one of those 25 lies in the future.** Five members carry no `policyExposure[]` array at all — including the segment's number one. That is session 3's (g) case firing a **second** time, and on a fence a third the size of the one that produced it: session 3 had 142 entries with 96 dated and none ahead; this has 41 with 25 dated and none ahead.

**The generated segment lesson proves it independently.** `scripts/build-classroom-segments.py` sets a segment lesson's `reviewBy` to the earliest future `effectiveDate` among the members' `policyExposure[]`, else `updated` + six months. `segment-grid-equipment` carried `updated` 2026-09-14 and `reviewBy` **2027-03-14** before this session's regeneration, and **2026-09-15 / 2027-03-15** after it. Both are the six-month default: the generator fell through to it — which is the machine confirming the sweep before a word of this section was written.

**The date taken, and where it was read.** `profile:grid-united @ v1 — strategyRead[4]`:

> *Indicator: the record of decision and the GRIP finalisation decision, expected together around October 2026.*

**This is a new sub-field for a gate.** Sessions have found gates in `policyExposure[].exposure` prose (session 2's (d)), in `policyExposure[].mitigation` (session 7's (x4)), and in developments the module leans on. This one is in a member's own **`strategyRead[]`**, which §10.6 admits explicitly — *"the nearest dated gate among the members' `policyExposure[]` **and the developments the module leans on**"* — and it is legitimate here because the development is the module's central argument made concrete: a developer with no permit reserved this segment's number-one supplier's converter capacity, and this is the dated moment that reservation either converts or does not.

**Why 31 October and not 1 October.** The statement is *"around October 2026"* with no day. **A review that fires on the first of the month fires before the event it watches.** The honest reading of an undated "around October" as a review trigger is the end of that month. It also keeps the module **outside** its own 30-day horizon (which runs to 2026-10-15 from `updated`), so `check-classroom-curriculum.py` continues to report **2** items due rather than 3 — the two pre-existing ones at 2026-10-01, both by design and both the quarterly Routine's.

**Six candidates rejected, in writing.**

1. **24 December 2026 — the bulk-power-system order's implementing rules.** The most consequential gate in the horizon for criterion 3, and it is **`eo14420-bulk-power-2026-08`'s own `reviewBy`, to the day**. §10.6 (r): a gate a module watches but does not own belongs in `the-indicators`. It is row 4 there.
2. **Early / full production 2027 — the first new US large-power-transformer line.** The single most on-point supply gate this segment has. Rejected **twice**: the shortage module's own timeline marks it *"THIS MODULE'S REVIEW GATE"*, and the corpus states it two different ways (§9 item 3). A gate the corpus cannot state consistently is not a clock.
3. **31 October 2026 — an adjacent member's Q3 filing deadline.** The **same calendar day as the date taken**, which is why it has to be named rather than quietly passed over. Rejected on **split grounds** per §10.6 (v): that company's open question is commercial traction for an architecture the *conversion* landscape ranks it on, where it is an incumbent and here it is adjacent. Coincident date, different event, different owner.
4. **End of 2026 — one incumbent expected "largely sold out of 2030 deliveries".** The right company on the **wrong product line**: that is its gas-turbine book, not its transformer book. Session 7 rejected a truck engine's model year for the same reason, and the trap generalises — a conglomerate's nearest date is usually about a business the module is not ranking it on.
5. **First calendar quarter of 2027 — an adjacent member's electrical business separating into an independent public company.** Genuinely material here, and rejected on **split grounds**: the in-hall landscape already carries both the separation and the acquisition closing into it, where that company is a challenger.
6. **5 October 2026 — an environmental scoping comment deadline on a second corridor.** Rejected **twice over**: a comment deadline is not a decision (session 6's rejection class), and corridor siting is not an equipment gate.

**And one class that did not exist to reject.** No member's `policyExposure[]` carries a future-dated entry at all, so unlike every previous landscape there was no dated-fence candidate to weigh against the prose. The nearest thing the fence offers is **31 December 2027**, when the capped 15 % rate for specified electrical-grid equipment rises to 25 % — stated inside two members' `exposure` prose while both entries' `effectiveDate` fields hold the earlier first step, which is pattern (d) exactly. **It is beyond any six-month horizon, so it is indicator row 10 rather than a review date.**

## 11. The Scraper interest seed — asked from scratch, and ADDED

§7.31 stated a prior: *"expect the prior to lean **negative** on the calendar vocabulary and positive only on the machines themselves — but run it, because the label-level glance the rule forbids is exactly what would get this one wrong."* **Run against all 410 distinct terms across `SCRAPER_INTEREST_TOPIC_SEEDS` and `SCRAPER_SEGMENT_SEEDS` (62 seed keys), the prior was right in both halves and precisely so.** That is a new outcome for the rule: sessions 2 and 5 found a brief's prior wrong, session 6 found one half right by accident, and this is the first a brief predicted the *shape* of the halving correctly.

**Already covered, and by five different seeds — which is why a label-level glance would have said "no seed needed".** `transformer`, `switchgear`, `substation`, `hvdc`, `grid equipment` (`seg-grid-equipment` and `seg-transformers`); `large power transformer`, `transformer lead time`, `bushing`, `test bay`, `on-load tap changer`, `GOES`, `grain-oriented electrical steel` (`topic-grid-equipment-shortage`); `transformer shortage`, `transmission` (`topic-grid-infrastructure`); `eo 14420` (`topic-bps-security`); `tariff`, `section 301`, `feoc` (`topic-china-policy`); `circuit breaker`, `gis switchgear`, `tap changer` (`seg-transformers`); `solid-state transformer` (`topic-800vdc-power`). **Every word of criterion 1's vocabulary is watched, five times over.**

**Scoring zero, and the gap is a whole product family plus a whole buying criterion.** The **grid-stability machine** — the fifth family the definition names, sold by four of the five incumbents — is invisible: `synchronous condenser`, `statcom`, `grid stability`, `reactive power` all score zero. So is **criterion 4's** entire vocabulary: `protective relay`, `iec 61850`. So is **criterion 2's** SF6 option, and the challenger's own technical structure: `sf6`, `arc-resistant`, `engineer-to-order`.

**Seeded — `topic-landscape-grid-equipment`, nine terms**: `synchronous condenser`, `statcom`, `grid stability`, `reactive power`, `protective relay`, `iec 61850`, `sf6`, `arc-resistant`, `engineer-to-order`.

**Dropped, with reasons.** As **superstrings or duplicates** of existing terms: `sf6-free` (the substring matcher catches it through `sf6`), `gas-insulated switchgear` (caught by `switchgear`), `power transformer`, `hvdc converter`. As **too generic to score cleanly**: bare `relay`, `inertia`, `power quality`, `svc`. As **too narrow**: `765 kv`, `800 kv`. As a **company name** rather than topic vocabulary: `prolec`. And **three on split grounds** per §10.6 (v), all of which score zero and were still left out:

- `build slot` — the shortage module's own vocabulary; it teaches the slot-versus-duration distinction and seeding it here would blur in the digest exactly the line §2a draws.
- `section 232` — a tariff regime, and the tariff vocabulary belongs to the policy seeds. Recorded here as a **genuine unscored gap** for whichever session next opens the policy modules or `Scraper.gs` for its own reason.
- `energization` — the interconnection module's and `the-fence-line`'s word for the process, not this segment's word for its products.

This touches `Scraper.gs`, so the Scraper GAS version bumps alongside Classroom's, and **two deploy steps fire rather than one**.

## 12. Verification

- `node --check` on a `.js` copy of `Classroom.gs`; `node scripts/check-gas-inner-scripts.js`
- `python3 scripts/check-classroom-content.py` — must return to **0 errors / 0 warnings at 42 lessons / 8 tracks**, with the hard-coded guidance-module assertion moved **16 → 17** in the same commit
- `python3 scripts/check-classroom-curriculum.py --strict` — no structural findings; 28 stale pins and 2 items due for review are pre-existing
- `python3 scripts/check-classroom-pipeline.py --selftest` (13 fixtures, 0 failures) and `--base origin/main` (P1 on the developer files, P2 on the guidance literal, **no P3** — a module below the fence moves no gate symbol, so refreshing `gateDigest` would hide a real signal)
- `python3 scripts/build-classroom-segments.py --check` — **10 → 11 → 10**, this segment joining and leaving on `read-next` alone
- `python3 scripts/check-readme-tree.py` after the version bumps
- Playwright render of `Classroom.html#guidance/landscape-grid-equipment-2026-09` at **contributor**, zero page errors, ops answered by the real serving functions; analyst denied at the server

Developed by: LightAISolutions
