# The Grid-Equipment Shortage — GOES, Bushings, Test Bays, Lead Times — Analysis & Study Source

**Provenance:** research-based synthesis over public sources plus already-verified internal material — **neither a document ingest nor a pure internal synthesis**. Compiled 2026-09-04 from primary public sources (DOE, *Large Power Transformer Resilience: Report to Congress*, July 2024; EPRI, *Transformer Bushing Failure Investigation*, August 2023; IEC 60076-2:2011 and IEC 60076-3:2013; Cleveland-Cliffs / DOE OCED Butler Works project disclosures; Siemens Energy's own US manufacturing disclosures), from dated analyst and trade reporting (Wood Mackenzie lead-time surveys, relayed by POWER Magazine; PTR Inc.; Fastmarkets), and from already-verified internal material (the Grid Technologies spine in `siemens-energy.study.json`, plus `hitachi-energy`, `ge-vernova`, `mitsubishi-electric` and `powell-industries` study guides). **No source document was ingested** — nothing under `industry-guidance/sources/` belongs to this module, and step 1 of the Industry Guidance Command does not apply. Feeds the in-app module `grid-equipment-shortage-2026-09` in `Profiler.gs` (lane: The AI Data-Center Wave). Every quantitative claim carries a source in §7; anything that could not be traced to a source is in §8 rather than hedged into the module.

## What this is

The supply-side half of a story this corpus already teaches from the demand side. `utility-aidc-procurement-2026-08` explains how utilities became the gatekeepers of compute and how a large load buys its way through a queue. This module explains why the **equipment** that queue depends on is late — and it does so by treating the shortage as a supply *system* with four named constraints rather than as a news story with a headline number.

The four nouns in the title are the spine, and they are deliberately in causal order:

1. **GOES** — grain-oriented electrical steel, the core material. A concentrated, structurally unprofitable input whose producers cannot be conjured by price.
2. **Bushings** — the transformer's most common failure point *and* a separate component queue. The only item on this list that is simultaneously a reliability problem and a supply problem.
3. **Test bays** — the constraint nobody sees. A transformer that cannot be tested cannot ship, and for units above 72.5 kV the dielectric gate is a **routine** test on every single unit.
4. **Lead times** — the output, not the cause. A lead time is what the first three produce, and quoting one without saying what it is measured from is the most common error a buyer makes.

Two more topics are required by §5 of `CLASSROOM-CURRICULUM-PLAN.md` (the failure map) and are treated as first-class here:

5. **Queue and slot mechanics** — how a lead time becomes a *schedule risk*, which is a different thing.
6. **What a buyer can actually do** — the instruments, each with its real cost stated.

## Teaching sequence (mirrors the module sections)

1. Why this is a supply system, not a shortage
2. GOES: the material that will not respond to price
3. Bushings: the failure point that is also a queue
4. Test bays: the gate at the exit
5. Lead times: the number and what it is measured from
6. Slots: how a lead time becomes a schedule risk
7. What a buyer can do — six instruments, honestly priced
8. What the record does NOT say
9. Flashcards, self-test, claims ledger

---

## 1. Executive read

**The shortage is not a demand spike meeting a fixed supply. It is a demand spike meeting a supply chain with four independent bottlenecks, any one of which alone would be enough.** That is why several years of very high prices — normally the cure for a shortage — have not cured it.

- **The input is concentrated and structurally unprofitable.** One US company makes grain-oriented electrical steel, meets 12–20% of domestic demand, and DOE says it "has been unable to meet domestic demand at quality and prices comparable to imports" and is "not currently profitable" (DOE, July 2024). The highest grade, PDR, comes from **one manufacturer on earth** — Nippon Steel — and is not made in the US at all. Meanwhile domestic EV production consumes *non*-oriented electrical steel from the same mills, and DOE states plainly that NOES demand "crowds out the less profitable domestic production of GOES." A shortage whose input is loss-making does not resolve by paying more for the output.
- **The component queue is a second, separate queue.** High-voltage bushings and on-load tap changers are the two components most consistently flagged as build-schedule bottlenecks (PTR Inc., March 2026). A factory's throughput is its slowest component supplier's throughput, not its own.
- **The exit is gated by a test.** For transformers with Um above 72.5 kV, the full-wave lightning impulse test on line terminals is a **routine** test under IEC 60076-3:2013 — every unit, not a sample. The temperature-rise test under IEC 60076-2:2011 is a **type** test on the first unit of an order and takes the bay for days. A test bay is a single-occupancy, capital-intensive, permitted facility, and it is the last thing a unit passes before it becomes a shippable asset.
- **Capacity is measured in slots, and slots do not expand.** DOE's language is exact and worth memorising: *"Manufacturing facilities have a certain number of build slots… capacity cannot easily be expanded except by building a new facility."* New factory construction takes 1–3 years, and the specialty equipment inside it — winding machines, core tables — takes 1–2 years to obtain.
- **The announced fix is real, and it is small against the hole.** Siemens Energy's $150M Charlotte plant will make **24 large power transformers initially, rising to 57 units per year at full capacity**. US demand for units above 60 MVA was about 750/year in 2019 and DOE expects ~900/year by 2027. One flagship domestic plant is therefore roughly **6% of national demand**, arriving in 2027. Nearly $1.8bn of North American OEM investment has been announced since 2023; it changes the trajectory over years, not the schedule of any project being planned today.

**The one sentence a seller should carry:** the equipment shortage and the OEM's expanding margins are the same fact seen from two sides — when a factory is sold out for years, new orders enter at current prices while old cheaply-priced ones deliver first.

**The one question a buyer should ask:** *"What is that lead time measured from — order placement, drawing approval, or release to manufacture?"* Those differ by many months, and the difference is usually the buyer's own review cycle.

---

## 2. Known-vs-new against the current curriculum

| Already in the corpus | Where | What this module adds |
|---|---|---|
| Why one large transformer takes years to build (GOES laminations, hand-laid windings, weeks of vacuum drying, bushings as a component queue, testing as the delivery gate) | `hitachi-energy.study.json` → *Inside a transformer factory* | The **numbers and the sources** behind each of those steps, and the distinction between a per-unit gate and a per-design gate at the test bay |
| Why grid-equipment factories cannot simply scale up (people-limited before machine-limited; GOES as the material chokepoint; test bays gate the exit) | `ge-vernova.study.json` → *Why grid-equipment factories can't just scale up* | Why GOES specifically resists a price signal — the profitability and NOES-crowd-out mechanism — which is what makes this a *structural* rather than *cyclical* shortage |
| The buyer's six instruments against a three-year transformer (slot reservation, standardisation, mobile substation, re-using a connection, generating on site, waiting) | `siemens-energy.study.json` → *What a three-year transformer does to a project* | The supply-side reason each instrument exists, plus the sparing and sharing layer (STEP, SpareConnect, Grid Assurance) that the guides do not cover |
| The ordering sequence inverting; impedance as the specification line that ripples furthest; the spare as a real decision; GOES as the reason the constraint does not resolve quickly; what a lead time is measured from | `mitsubishi-electric.study.json` → *The transformer is the schedule* | Independent corroboration of the impedance point from DOE's account of Grid Assurance — impedance is the parameter its standardisation programme found hardest, "because of their impacts on the rest of the system (e.g., downstream system protection)" |
| Bushings as row 2 of the failure map; the transformer as the project | `CLASSROOM-CURRICULUM-PLAN.md` §5 rows 1–4; `siemens-energy.study.json` → *Where it fails* | The failure **share** with a real source (EPRI/CIGRE), the failure **mechanism** (moisture through leaks, PD, the test tap), and the fact that bushings appear in Grid Assurance's spares inventory *alongside* transformers — i.e. the industry treats them as an independent long-lead item |
| Switchgear lineups, arc flash, protection studies going stale | `powell-industries.study.json`, `abb.study.json` | Switchgear's own lead-time and price series (44 weeks average; breakers +47%, MV switchgear +50% since 2021), so the shortage is not read as a transformer-only story |

**The gap this closes is named in the corpus itself.** `siemens-energy.study.json` ends its lead-time section by saying: *"What this app does not yet have is a proper treatment of the supply side of that shortage — GOES availability, bushings, test bays and the people who wind coils — which remains an open gap in the curriculum's own register."* That is `CLASSROOM-CURRICULUM-PLAN.md` §6 row **G4**, third ask, and this module is written to close it.

---

## 3. GOES — the material that will not respond to price

**What it is.** Grain-oriented electrical steel is a silicon steel rolled and annealed so that its magnetic grains align with the rolling direction, which is what makes core loss low enough for a transformer to be efficient. It is made in grades: conventional (CGO), high-permeability (HI-B), domain-refined (PDR) and an intermediate grade (MOH). Transformer makers want HI-B domain-refined because low core loss lets the unit be smaller and lighter for the same rating.

**Why the capacity is what it is.** Three facts, all from DOE's July 2024 report to Congress, explain more than any market forecast:

1. **One domestic producer.** Cleveland-Cliffs, through its 2020 acquisition of AK Steel, is the sole active domestic GOES supplier. It can meet **12–20% of domestic GOES demand**, and it "is not currently profitable."
2. **The top grade has one global source.** PDR — the highest grade — "is only available from a single manufacturer, Nippon Steel in Japan, and is not manufactured in the U.S." US-made MOH-equivalent exists but is "more expensive with no efficiency benefit and is therefore not commonly used by U.S. LPT manufacturers."
3. **The domestic mill's better business competes with it.** EV production consumes *non*-oriented electrical steel (NOES) from the same production capacity, so "domestic NOES demand crowds out the less profitable domestic production of GOES."

Add the historical evidence that exit is easy and re-entry is not: ATI shut down GOES production in 2016 on unprofitability, and GOES imports rose **155%** the following year.

**Where the world's GOES actually comes from.** China's GOES output was **620,000 tonnes in 2023 — 56% of global production** — with Baosteel alone at 500,000 tonnes (Fastmarkets, September 2024). That implies a world market on the order of 1.1 Mt/yr. Against that, ~80% of the GOES used in US LPT manufacture was imported as of 2019. A US policy instrument that restricts foreign equipment (see the `eo14420-bulk-power-2026-08` module) therefore lands on a supply chain whose *material* is majority-foreign well before the finished unit is.

**Why it matters commercially.** GOES and continuously-transposed (CTC) copper wire **each account for roughly 25% of final LPT production cost** (2020 US Department of Commerce industry survey, cited by DOE). Half the cost of a large power transformer is two commodities, one of which is structurally short. GOES commodity prices doubled between January 2020 and 2024 (Wood Mackenzie); US GOES prices are up 60–70% since 2020 (PTR Inc., March 2026).

### Advantages and disadvantages of the GOES position

| | |
|---|---|
| **What works in the buyer's favour** | Domestic capacity is being funded rather than merely discussed — the Butler Works project (up to $75M federal cost share; Phase 1 OCED award $19,074,900) replaces two gas-fired slab reheat furnaces with four induction reheat furnaces, expected complete **2029**. Grade substitution is technically possible: a lower grade buys availability at the price of a larger, lossier, heavier core, which is a real option when schedule dominates. And because GOES is a commodity with published price series, it is one of the few parts of the shortage a buyer can actually track. |
| **What works against** | Price does not fix it, because the domestic producer loses money at the price that clears. The top grade has a single global source, so "diversify suppliers" is not available at the quality tier that matters. Capacity added downstream — winding shops, test bays, trained winders — does nothing if the steel is short. And the substitute demand (NOES for EVs) is growing faster and pays better, so the domestic mill's incentive points away from GOES. |

---

## 4. Bushings — the failure point that is also a queue

**What a bushing is.** A bushing carries an energised conductor through a grounded barrier — the transformer tank wall — without connecting to it. It is therefore the single highest-stress dielectric interface on the machine, and it is on the outside where weather, ice and contamination reach it. The common construction is oil-impregnated paper (OIP): a condenser body of kraft paper with foil electrode layers, dried under heat, vacuumed and impregnated with oil, held between porcelain sheds by springs, with a **test tap** on the mounting flange that brings the outermost foil electrode out for measurement.

**Why it is the most common failure point.** EPRI's August 2023 white paper puts bushing failures at **roughly 18% of transformer failures**, citing CIGRE SC A2.37 Technical Brochure 642, *Transformer Reliability Survey* — and notes that IEEE, CIGRE and IEC reports together put the contribution at **~17–20% globally**, rising to **30% of generator step-up transformer failures**. The mechanisms are moisture intrusion through leaks, partial discharge, surface tracking and thermal ageing; the test tap that exists to diagnose the bushing is itself a documented failure site when its cap is not properly grounded.

**Why the consequence is out of proportion to the share.** Bushing failures do not fail quietly. EPRI's cases include ruptured tanks, expelled oil, fires and porcelain scattered across the yard — so a bushing failure frequently *becomes* a transformer failure and an environmental incident. That is why a component worth a low single-digit percentage of the machine's cost drives a disproportionate share of its outage risk.

**Why it is also a supply bottleneck.** Bushings are a specialised product line built by a small set of makers, not a part the transformer factory produces. PTR Inc. (March 2026) names high-voltage bushings and on-load tap changers as "the components most consistently flagged as build-schedule bottlenecks." The arithmetic is unforgiving: a plant with the floor space and crews to build twenty units a month builds fifteen if its bushing supplier ships fifteen. The clearest institutional evidence that the industry treats bushings as an independent long-lead item is that **Grid Assurance's strategic spares inventory holds bushings and circuit breakers alongside the transformers themselves** (DOE, July 2024) — you do not warehouse a commodity you can buy when you need it.

### Advantages and disadvantages of the bushing position

| | |
|---|---|
| **What works in the buyer's favour** | Bushings are the one long-lead item on this list that is genuinely **stockable** — small enough to warehouse, standard enough to be fungible across several transformer designs, and cheap enough relative to a transformer that a spare set is an easy approval. Condition monitoring is mature: offline power-factor/capacitance measurement at the test tap, and online partial-discharge monitoring for critical units, both give real warning. Replacing a bushing is a field operation measured in days, not a factory rebuild. |
| **What works against** | A bushing spare only helps if it matches — voltage class, current rating, creepage, flange and mounting geometry, and the transformer OEM's acceptance of a third-party part. The failure mode is fast and destructive, so "we will replace it when the tan-delta drifts" only works if someone is actually reading the trend. And the queue for new bushings sits *inside* the transformer's own lead time, which means it is invisible on the buyer's schedule until it is the reason the schedule moved. |

---

## 5. Test bays — the gate at the exit

**The claim in one line: a transformer that cannot be tested cannot ship.** Everything the factory does — core stacking, winding, drying, tanking, oil processing — produces an object that is not yet a saleable asset. It becomes one when it passes its factory test sequence in a high-voltage test bay.

**Why the bay is a per-unit gate and not a per-order one.** This is the fact that makes the test bay a *throughput* constraint rather than an engineering formality, and the standards are explicit about it:

- **IEC 60076-3:2013** — for transformers with Um above 72.5 kV, the full-wave lightning impulse test on the line terminals (LI) is a **routine** test. Every unit. Below 72.5 kV it is a type test; between 72.5 and 170 kV LI is routine and the chopped-wave test (LIC) is special; above 170 kV the requirements tighten further. Since a large power transformer is by definition above that line, **the impulse test is a per-unit gate on the entire LPT population.**
- **IEC 60076-2:2011** — the temperature-rise ("heat run") test is a **type** test, normally performed on the first unit of an order, with current maintained until top-oil temperature reaches the type-test value and for a minimum of four hours, and with all coolers connected. On a large unit the full heat run occupies the bay for days.

So the bay serves two queues at once: a short, unavoidable one that every unit joins, and a long, occasional one that the first unit of each new design joins. A factory that wins a large order of a new design pays for it in bay-days before it ships anything.

**What a bay physically is.** A screened hall large enough for the assembled unit with dielectric clearance, a crane to place it, an impulse generator that produces a standard steep-fronted surge, a variable-frequency source for the induced-voltage test, partial-discharge instrumentation with a noise floor low enough to be meaningful, and a loss-measurement system accurate enough that a fraction of a percent of measured loss is worth real money in a contract with loss penalties. It is one of the most capital-intensive rooms in the plant and it holds one unit at a time.

**Why it is the constraint nobody sees.** It appears on no purchase order and in no quotation. A buyer sees a lead time; the bay is inside it. And of all the factory tests, the impulse test is the one most likely to reveal a defect — which means a failure there sends a nearly finished unit back into the shop and puts it back at the end of a queue it had almost cleared. The test bay is the only stage in the process where months of work can be undone in microseconds.

### Advantages and disadvantages of the testing gate

| | |
|---|---|
| **What works in the buyer's favour** | The gate exists for the buyer's benefit — it is what makes a delivered unit trustworthy, and factory acceptance testing is the buyer's one genuine opportunity to inspect the machine before it is theirs. Attending the FAT and reading the test report line by line is free leverage that most buyers do not use. Standard designs pass faster because the design has already been through a type test. |
| **What works against** | Bay capacity cannot be bought quickly — it is a construction project inside a construction project, and adding one does not shorten the queue for a year or more. Because it sits at the exit, any bay delay lands on units that are otherwise complete, which is the worst possible place in the schedule for a delay to appear. A first-of-design order carries a heat-run penalty that a repeat order does not, so bespoke design has a schedule cost that is invisible at specification time. And the buyer has essentially no visibility into it: no public register of test-bay capacity exists (see §8). |

---

## 6. Lead times — the number and what it is measured from

**The series, dated and sourced.** Never quote a single remembered number; quote a dated figure with its measurement basis.

| Date | Class | Figure | Source |
|---|---|---|---|
| Pre-2020 | Large power transformer | 7–14 months typical | PTR Inc., Mar 2026 |
| 2021 | Power transformer | ~50 weeks | Wood Mackenzie |
| 2024 | Power transformer, average | ~120 weeks | Wood Mackenzie |
| 2024 | Large transformers (substation + GSU), range | 80–210 weeks | Wood Mackenzie |
| Jul 2024 | Large power transformer | "up to and exceeding 36 months" | DOE, Report to Congress |
| Q2 2025 | Power transformer, average | 128 weeks | Wood Mackenzie, via POWER |
| Q2 2025 | Generator step-up transformer | 144 weeks | Wood Mackenzie, via POWER |
| Q2 2025 | Switchgear | 44 weeks | Wood Mackenzie, via POWER |
| Mar 2026 | LPT, most major markets | "well beyond 24 months" | PTR Inc. |
| Mar 2026 | Specialised units | 36–48 months | PTR Inc. |

**The reading skill that matters more than the number.** A quoted lead time may be measured from order placement, from drawing approval, or from release to manufacture. Those can differ by many months, and the difference is usually the **buyer's own review cycle** — the one part of the schedule the buyer controls and the one most often left out of their own plan. A buyer who negotiates the lead-time number without fixing the measurement basis has negotiated nothing.

**Prices moved with the lead times, and not uniformly.** Since 2019: power transformers +77%, GSUs +45%, some distribution classes +95% (Wood Mackenzie, Aug 2025). Since 2021: circuit breakers +47%, medium-voltage switchgear +50%. Since Jan 2020: transformer prices +60–80% on average, GOES doubled, copper +50% (Wood Mackenzie, 2024). **The spread across classes is the useful signal** — a category whose price is up 95% is capacity-limited in a different way from one up 45%.

**Demand growth is the other half of the ratio.** Between 2019 and 2025: power-transformer demand +119%, generator step-up units +274%, substation power transformers +116%, distribution transformers +34%; T&D equipment overall 35–274% depending on type (Wood Mackenzie, Sep 2025). Against that, Wood Mackenzie's August 2025 read put the national shortfall at **~30% for power transformers and ~10% for distribution units**.

**And the installed base is old, which puts a replacement floor under all of it.** Intended LPT service life is about 40 years and the average age of installed US units is about 40 years; a 2014 estimate found more than 70% aged over 25 years (DOE, July 2024). On the distribution side, Wood Mackenzie's August 2025 read holds that more than half of US distribution transformers — roughly 40 million units — are already beyond expected service life. Replacement demand does not wait for the AI buildout to finish.

---

## 7. Slots — how a lead time becomes a schedule risk

A lead time is a duration. A **slot** is a position in a finite production schedule. Confusing the two is what turns a manageable procurement into a project delay, because durations can be planned around and positions can be lost.

**DOE's formulation is the one to memorise:** *"Manufacturing facilities have a certain number of build slots: each slot can be used for an LPT, a smaller transformer, or a refurbishment of a transformer core, but capacity cannot easily be expanded except by building a new facility."*

Three consequences follow directly.

1. **Slots are substitutable across products, so you are bidding against smaller units too.** A slot spent refurbishing a core or building a medium unit is a slot not spent on your LPT. When distribution and substation demand rises, it competes for the same floor.
2. **Expansion is slow at both levels.** New factory construction takes 1–3 years, and the specialty equipment inside it — winding machines, core tables — takes 1–2 years to obtain. Minor purchases (cranes, air pallets, space reallocation) expand capacity only marginally.
3. **Utilisation figures understate the problem.** The Department of Commerce estimated ~40% LPT capacity utilisation in 2019 against a derived maximum of ~343 LPTs/year — while 617 units (82%) were imported. Nameplate capacity that is not staffed, tooled and bay-served is not capacity.

**How big is the announced fix, honestly?** Nearly **$1.8bn** of OEM manufacturing investment has been announced across North America since 2023 (PTR Inc., Mar 2026). The flagship numbers:

| Investment | What it adds | When |
|---|---|---|
| Siemens Energy, Charlotte NC — **$150M** | **24 LPTs/yr initially → 57/yr at full capacity**, plus 12→24 repair/refurb units | production start **early 2027** |
| Hitachi Energy, South Boston VA — **$457M** (part of >$1bn NA) | intended to be the nation's largest LPT plant; 825 jobs | operational **2028** |
| Eaton, South Carolina — **$340M** | three-phase transformers | targeting **2027** |
| Prolec GE — **>$300M** across sites | medium-power and pad-mount | staged |
| Virginia Transformer, Georgia — **$40M** | +70% output at that site | staged |
| Cleveland-Cliffs, Butler Works PA | four induction reheat furnaces (GOES) | complete **2029** |

**The arithmetic that makes the point.** US demand for transformers above 60 MVA was ~750 units in 2019 and DOE expects ~900/year by 2027. The single flagship domestic LPT plant coming online first adds **57 units/year at full capacity** — roughly **6%** of that demand, arriving in 2027 and ramping thereafter. This is what "supply answers shortage in years, not quarters" means numerically. It is also why a project planned in 2026 should assume the shortage, not assume relief.

**And the last mile is its own queue.** Even a finished, tested, paid-for transformer has to get there. LPTs typically require 18- or 20-axle Schnabel rail cars; DOE reports that **only about three of these specialised transport cars are available in North America**, that the route clearance process "can take nine months to complete," and that rental ran up to $2,500/day plus fees as of 2014. By contrast, once a matched unit is physically on hand, DOE's expedited replacement sequence — site prep, transport, assembly, vacuum, oil fill, settling, commissioning — totals **3–4 weeks**. The gap between "3–4 weeks" and "128 weeks" is the entire subject of this module.

---

## 8. What a buyer can actually do

The `siemens-energy` guide already teaches six instruments from the buyer's side (slot reservation, standardisation, mobile substation, re-using an existing connection, generating on site, waiting). This section adds the layer that guide does not cover — **sparing and sharing** — and states the supply-side reason each instrument works.

### The sparing and sharing layer

| Mechanism | What it is | Honest assessment |
|---|---|---|
| **Self-supply** | The utility keeps its own spare | Most transmission operators do this. DOE notes spares are "costly, infrequently utilized, and must be maintained and protected while producing no revenue," and that many self-supplied spares are stored **in the same substations as the in-service units** — exposing the spare to the same event as the asset it protects |
| **STEP** (Spare Transformer Equipment Program, EEI, 2006) | A collective agreement among investor-owned utilities to sell spares to each other on a trigger | >50 member companies; $10,000 enrollment, $7,500/year. Trigger requires a **presidentially-declared terrorist attack or state of emergency** — so stringent that **STEP has never been used**. It also adds no incremental capacity; it only reallocates existing assets |
| **SpareConnect** | A less formal voluntary mutual-assistance initiative under EEI | Lower friction than STEP, correspondingly weaker guarantee |
| **Grid Assurance** | A private entity that buys, warehouses and maintains spares for subscribers | Inventory covers five transformer classes and seven ratings sets, sized by ICF Monte Carlo over 10,000+ events to a **98% likelihood** of meeting anticipated need; units held up to **25 years** in "like-new" condition with an assignable 12-month OEM warranty; also stocks **circuit breakers and bushings**. As of DOE's July 2024 report, GA **had not yet actually provided a replacement LPT** |

**The standardisation lesson hidden in Grid Assurance.** GA standardises voltage, MVA rating, tertiary winding ratings, tap-changer configuration, basic impulse level, losses, cooling design and transport dimensions — but reports that **impedance** is among the hardest parameters to standardise "because of their impacts on the rest of the system (e.g., downstream system protection)." That is exactly the point `mitsubishi-electric.study.json` teaches from the buyer's side: a transformer substitution is never only a transformer substitution, because impedance sets the fault current the switchgear behind it must interrupt. Two independent sources, one conclusion — that is the strongest form of corroboration this corpus can offer.

### The instruments, ranked by what they actually cost

1. **Standardise the rating.** The single largest lever, and it is an engineering concession made for schedule: a slightly oversized or less-optimal unit in exchange for a place in a repeat production run — and, because the design has already passed its type tests, a shorter path through the test bay.
2. **Reserve the slot early and fix the measurement basis.** Money at risk on a project that may not happen, and a specification frozen before the design is ready. In a shortage, *the queue position is the thing being bought.* Negotiate what the lead time is measured from at the same time.
3. **Buy the components separately where you can.** Bushings are stockable and fungible in a way transformers are not. A matched spare set is cheap insurance against the failure mode that causes ~18% of transformer failures.
4. **Decide the spare explicitly.** Either there is a physical spare somewhere, or a transformer failure is a multi-year outage of that capacity. Naming which of the two has been chosen is more useful than any reliability statistic.
5. **Buy schedule, not assets, where possible.** Mobile substations, re-using an existing connection, on-site generation — each converts a queue problem into a different problem (lower rating, inherited condition, permitting risk) that may be the cheaper problem.
6. **Attend the factory acceptance test.** Free leverage, rarely used.

---

## 9. What it means for the active engagement (Hithium US, grid-scale storage)

**Content-scope note.** Per the developer directive of 2026-08-29, the in-app module gives guidance to supplier and buyer **groups**, never to a single named company. This section of the analysis is the internal read; the module states the group-level version of it. Company-specific analysis belongs in a report's `guidanceOverlays[]`, not in module content.

1. **The shortage is a demand driver, not just a headwind.** Every instrument in §8 that converts a queue problem into an on-site problem — mobile substation, re-using a connection, generating on site — increases the value of anything that firms a weak or delayed grid connection. A storage seller's most credible line in a transformer-constrained market is not "our battery is cheaper" but "our battery is what lets you energise before your transformer arrives." That is the same argument the corpus already teaches from the ride-through side (`NOGRR 282`, curtailable-to-firm conversion); the equipment shortage is a second, independent reason for it.
2. **BESS is not exempt from the same supply system.** A grid-scale storage plant needs its own step-up transformer, its own MV switchgear and its own protection — and those sit in the same queue and carry the same lead-time and price series (switchgear averaging 44 weeks; MV switchgear prices +50% since 2021). A supplier who quotes a container lead time without the balance-of-plant lead time has quoted half a schedule. **This is the single most useful correction this module makes for a storage seller.**
3. **Standardisation is a joint sales argument.** The largest lever a buyer has is repeating a design. A supplier whose product line composes into repeatable blocks — standard ratings, standard interconnection configuration, standard impedance assumption — is selling schedule optionality, and schedule is what the buyer is short of. This is the same argument the NVIDIA 800 VDC module makes about standardised power blocks, arriving from a different direction.
4. **Impedance is a shared trap.** A late substitution of the step-up transformer changes the fault current available at the storage plant's own switchgear and invalidates the coordination study the settings came from. Both `mitsubishi-electric.study.json` and DOE's account of Grid Assurance's standardisation programme land on impedance as the parameter that ripples furthest. A seller who raises it before the buyer does is credible on the whole chain.
5. **The policy overlay stacks.** `eo14420-bulk-power-2026-08` names substation transformers, reactors and capacitors as in-scope equipment under a live IEEPA emergency, and this module shows that the *material* underneath them is majority-imported and that its highest grade has one global source. A restriction that lands on a supply chain already short is a different instrument from a restriction that lands on a comfortable one. Neither module should be read without the other.
6. **The margin story is the same fact from the other side.** When a factory is sold out for years, new orders enter at current prices while older cheaply-priced ones deliver first, so reported OEM margins improve mechanically for years. A seller who understands this does not mistake an equipment maker's expanding margin for evidence that the shortage is easing.

---

## 10. Claims ledger

Every load-bearing quantitative claim, with its source. Claims not traceable to a source are in §11, not here and not in the module.

### GOES

| Claim | Source |
|---|---|
| Cleveland-Cliffs (via its 2020 AK Steel acquisition) is the sole active domestic GOES supplier; meets 12–20% of domestic demand; "not currently profitable" | DOE, *Large Power Transformer Resilience: Report to Congress*, Jul 2024, p.15 |
| GOES and CTC copper wire each ≈25% of final LPT production cost | 2020 US Dept. of Commerce industry survey, cited DOE Jul 2024, p.13 |
| ~80% of GOES used in US LPT manufacture was imported (2019) | DOE Jul 2024, p.15 |
| Highest grade GOES (PDR) available only from Nippon Steel, Japan; not made in the US | DOE Jul 2024, p.15 |
| ATI exited GOES in 2016; GOES imports rose 155% the following year | DOE Jul 2024, p.15 |
| Domestic NOES (EV) demand "crowds out the less profitable domestic production of GOES" | DOE Jul 2024, p.14 |
| DOE 2022: domestic GOES production "is a major weak link in the LPT supply chain" | DOE Jul 2024, p.14, quoting its 2022 assessment |
| China GOES output 620,000 t in 2023 = 56% of global production; Baosteel alone 500,000 t | Fastmarkets, 20 Sep 2024 |
| GOES commodity prices doubled since Jan 2020 | Wood Mackenzie (2024) |
| US GOES prices +60–70% since 2020 | PTR Inc. (A. Fayyaz), 17 Mar 2026 |
| Butler Works GOES project: federal cost share up to $75M, Phase 1 OCED award $19,074,900, four induction reheat furnaces replacing two gas-fired slab reheat furnaces, expected completion 2029 | Cleveland-Cliffs / DOE OCED project page |

### Bushings

| Claim | Source |
|---|---|
| Bushing failures ≈18% of transformer failures | EPRI, *Transformer Bushing Failure Investigation*, Aug 2023, p.2, Figure 1 (source: CIGRE SC A2.37 TB 642, *Transformer Reliability Survey*) |
| IEEE/CIGRE/IEC reports put bushing contribution at ~17–20% of transformer failures globally | EPRI Aug 2023, p.3 |
| 30% of generator step-up transformer failures caused by bushing malfunction | EPRI Aug 2023, p.3 |
| Failure mechanisms: moisture intrusion via leaks, partial discharge, tracking, thermal ageing; test tap is both diagnostic port and failure site | EPRI Aug 2023, pp.3–4 |
| Consequences include tank rupture, expelled oil, fire, scattered porcelain | EPRI Aug 2023, p.2 |
| HV bushings and OLTCs "the components most consistently flagged as build-schedule bottlenecks" | PTR Inc., 17 Mar 2026 |
| Grid Assurance strategic inventory includes LPTs **and associated circuit breakers and bushings** | DOE Jul 2024, p.24 |
| Ice accumulation on bushings can cause flashovers; bushing issues contribute a significant portion of LPT forced outages | DOE Jul 2024, p.6 |

### Testing

| Claim | Source |
|---|---|
| For Um > 72.5 kV the full-wave lightning impulse test on line terminals is a **routine** test (every unit); type test at or below 72.5 kV; LIC special in the 72.5–170 kV band | IEC 60076-3:2013 |
| Temperature-rise test is a **type** test, normally on the first unit of an order; current maintained to steady top-oil and for a minimum of 4 hours, all coolers connected | IEC 60076-2:2011 |

### Lead times, prices and demand

| Claim | Source |
|---|---|
| LPT lead times 7–14 months pre-pandemic; "well beyond 24 months" in most major markets; 36–48 months for specialised units; nearly doubled on average since 2021 | PTR Inc., 17 Mar 2026 |
| LPT lead times "up to and exceeding 36 months" | DOE Jul 2024, p.12 |
| ~50 weeks in 2021 → ~120 weeks average in 2024; large transformers 80–210 weeks; only ~20% of US transformer demand met by domestic supply; up to 25% of global renewable projects at risk of delay | Wood Mackenzie (2024) |
| Q2 2025: power transformers 128 weeks, GSUs 144 weeks, switchgear 44 weeks | Wood Mackenzie Q2 2025 survey, via POWER Magazine |
| Aug 2025: ~30% shortfall for power transformers, ~10% for distribution | Wood Mackenzie, via POWER Magazine |
| Demand 2019–2025: power transformers +119%, GSUs +274%, substation power transformers +116%, distribution +34%; T&D overall 35–274% | Wood Mackenzie Sep 2025 report, via POWER Magazine |
| Prices since 2019: power transformers +77%, GSUs +45%, some distribution classes +95% | Wood Mackenzie Aug 2025, via POWER Magazine |
| Prices since 2021: circuit breakers +47%, MV switchgear +50% | Wood Mackenzie, via POWER Magazine |
| Transformer prices +60–80% and copper +50% since Jan 2020 | Wood Mackenzie (2024) |
| >50% of US distribution transformers (~40 million units) beyond expected service life; ~55% more than 33 years old | Wood Mackenzie Aug 2025, via POWER Magazine |

### Capacity, slots and logistics

| Claim | Source |
|---|---|
| "Manufacturing facilities have a certain number of build slots… capacity cannot easily be expanded except by building a new facility" | DOE Jul 2024, p.14 |
| New factory construction takes 1–3 years; winding machines and core tables take 1–2 years to obtain | DOE Jul 2024, pp.14–15 |
| 2019: 137 LPTs (18%) built domestically for domestic use, 617 (82%) imported; ~40% capacity utilisation; derived max ~343 LPTs/year | US Dept. of Commerce, cited DOE Jul 2024, p.14 |
| 2019 US demand for transformers >60 MVA ≈750 units; expected ~900/year by 2027; manufacturers reported YoY demand jumps as much as 70% | DOE Jul 2024, p.13 |
| LPT intended service life ~40 years; average installed age ~40 years; >70% aged over 25 years (2014 estimate) | DOE Jul 2024, p.14 |
| Siemens Energy Charlotte: $150M; 24 LPTs/yr initially → 57/yr at full capacity; 12→24 repair/refurb units; 82% of US LPTs imported | Siemens Energy, US manufacturing expansion page |
| Siemens Energy Charlotte production start "by early 2027" | Siemens Energy / trade coverage, Aug 2025 |
| Hitachi Energy South Boston VA: $457M, 825 jobs, operational 2028, part of >$1bn North American investment | Trade coverage (ENR, Utility Dive, TD World), 2025–26 |
| Eaton $340M South Carolina facility targeting 2027; Prolec GE >$300M; Virginia Transformer $40M Georgia expansion at +70% output; ERMCO $70M+; Central Moloney $50M Florida; HD Hyundai Electric +30% US production by 2026 | POWER Magazine, *Transformers in 2026*, citing company announcements |
| ~$1.8bn of OEM manufacturing investment announced across North America since 2023 | PTR Inc., 17 Mar 2026; POWER Magazine ("nearly $1.8 billion") |
| Only about three Schnabel-type specialised transport cars available in North America; route clearance can take nine months; rental up to $2,500/day plus fees (as of 2014); LPTs typically need 18–20 axle cars | DOE Jul 2024, p.19 |
| Expedited replacement of an available LPT totals 3–4 weeks (site prep → transport → assemble → vacuum → oil fill → 5-day settle → commissioning) | DOE Jul 2024, Table 1, pp.21–22 |
| >90% of US electricity consumed passes through a large power transformer | DOE Office of Electricity, via TD World |

### Sparing and sharing

| Claim | Source |
|---|---|
| STEP initiated by EEI in 2006; >50 member companies; $10,000 enrollment, $7,500 annual fee; trigger requires a presidentially-declared terrorist attack or state of emergency; **never used to date**; adds no incremental capacity | DOE Jul 2024, pp.22–23 |
| Grid Assurance: five transformer classes, seven ratings sets; ICF Monte Carlo over 10,000+ events sized to 98% likelihood of meeting need; units held up to 25 years in "like-new" condition with assignable 12-month OEM warranty; had **not yet provided a replacement LPT** as of the report | DOE Jul 2024, pp.24–25 |
| GA standardises voltage, MVA, tertiary ratings, tap-changer config, BIL, losses, cooling and transport dimensions, but **impedance is among the hardest** "because of their impacts on the rest of the system (e.g., downstream system protection)" | DOE Jul 2024, p.25 |
| Many self-supplied utility spares are stored in the same substations as the in-service units | DOE Jul 2024, p.22 |

---

## 11. What the record does NOT say

The strongest discipline in a shortage topic is naming what could not be verified. Every item below was searched for and either not found in a primary source or found only in sources that do not meet this repo's bar. **None of it appears in the module, hedged or otherwise.**

1. **There is no public count of high-voltage test bays.** Not in the US, not globally, not by OEM. The test bay's role as the exit gate is well established from the standards (the impulse test is routine above 72.5 kV; the heat run is a multi-day type test) and is asserted in this corpus by `ge-vernova.study.json`. But **no published register of bay capacity, bay utilisation, or testing queue time exists**, and none of the announced factory expansions in §7 discloses how many bays it adds. The module therefore teaches the test bay as a *mechanism* with a sourced standards basis, and says explicitly that the queue behind it is not measurable from public data. The "multimillion-dollar lab" characterisation in `ge-vernova.study.json` is a reasonable order-of-magnitude statement, not a sourced figure, and is not repeated as a number.
2. **Bushing lead-time numbers circulate without a primary source.** Figures such as "bushings run up to 130 weeks" and "230 kV bushings took 40 weeks to a year before 2020" appear on vendor and reseller blogs with no attribution and no survey behind them. They may well be right. They are not citable, and they are not in the module. What *is* citable is the qualitative finding (PTR Inc., Mar 2026) that bushings and OLTCs are the most consistently flagged component bottlenecks, and the institutional evidence that Grid Assurance warehouses bushings as strategic spares.
3. **The claim that there is a single US on-load tap changer producer, with the rest from Germany and Switzerland, could not be verified.** It appears in secondary write-ups without attribution. The direction is consistent with DOE's general finding that fabricated subcomponents are largely imported, but the specific supplier-count claim is unsourced and is omitted.
4. **The share of bushing failures varies enormously by source and population.** Published figures span roughly 15% to 50%, depending on whether GSUs are separated out, which voltage classes are included, and whether "bushing-initiated" or "bushing-attributed" is being counted. The module uses the EPRI/CIGRE band (≈18%, ~17–20% globally, 30% for GSUs) and says the band is a band. Anyone who quotes a single precise figure for this is over-claiming.
5. **No source found gives a current national count of GOES tonnes consumed by US transformer manufacture.** Capacity figures for Cleveland-Cliffs' electrical-steel output circulate at both ~200,000 and ~250,000 tonnes per year in secondary sources and are not separated cleanly between grain-oriented and non-oriented product. The module uses DOE's *share of demand met* framing (12–20%) rather than a tonnage, because that is what the primary source actually supports.
6. **Wood Mackenzie's quarterly lead-time series is relayed here, not read directly.** The Q2 2025, August 2025 and September 2025 figures come via POWER Magazine's *Transformers in 2026*, which attributes each to Wood Mackenzie by date. The underlying surveys are subscription products. The relay is a trade journal of record and the attribution is explicit, but this is second-hand and the ledger says so.
7. **The Butler Works completion date is inconsistent across sources.** The Cleveland-Cliffs / DOE OCED project page says 2029; trade coverage has reported 2028 alongside a ~$170M project value that does not match the page's "up to $75 million" federal cost share (which is a cost *share*, not a project total). The module uses the primary page's 2029 and does not state a project total.
8. **No source quantifies the winder/tester labour gap.** "People-limited before machine-limited" is well supported qualitatively — DOE lists "appropriately skilled labor" among the inputs manufacturers struggle to obtain, and `ge-vernova.study.json` teaches it — but there is no published headcount, vacancy rate or training-pipeline figure. The module teaches the mechanism and does not invent a number.
9. **Nothing here forecasts when the shortage ends.** The module states the announced capacity, its dated start, and the arithmetic against demand. It does not extrapolate a crossover year, because doing so would require assuming a demand path that nobody has published with confidence.

---

## 12. Freshness gate

**`reviewBy: 2027-03-31`.**

The gate is this module's own nearest dated event: **Siemens Energy's Charlotte, NC plant beginning large power transformer production, reported as "by early 2027."** It is the first of the ~$1.8bn of announced North American capacity additions scheduled to actually produce a unit, and it is the module's central arithmetic (24 units initially → 57/year at full capacity against ~900/year of national demand). Whether it starts on time, and at what initial rate, is the first real evidence of whether the announced fix behaves as announced. If it slips, the "supply answers in years, not quarters" thesis gains a year and the module's numbers need restating; if it starts, the ramp figures become measurable rather than projected.

The alternatives were considered and rejected as the primary gate: Hitachi Energy's South Boston plant (2028) and Eaton's South Carolina facility (2027, month unspecified) are later or less precisely dated; Cleveland-Cliffs' Butler Works GOES project (2029) is the furthest out and its date is itself disputed across sources; Wood Mackenzie's lead-time survey is quarterly and continuous rather than a dated gate. Setting the review to a fixed six months would have been a cadence, not a gate, which is exactly what step 10 of the Industry Guidance Command forbids.

---

**Module:** `grid-equipment-shortage-2026-09` · lane **The AI Data-Center Wave** · registered in `guidanceDocs_()` immediately after `utility-aidc-procurement-2026-08`, its demand-side counterpart.
**Scraper seed:** `topic-grid-equipment-shortage`, `source: guidance:grid-equipment-shortage-2026-09`.
**Closes:** `CLASSROOM-CURRICULUM-PLAN.md` §6 row **G4**, third ask.

Developed by: LightAISolutions
