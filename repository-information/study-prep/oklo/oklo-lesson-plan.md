# Oklo — Technology Lesson Plan

**Purpose:** teach **what is actually new about a small modular reactor, as engineering** — the moderator as the fork in the road, the coolant's boiling point as the thing that sets the size of the building, safety that rests on the sign of a coefficient, the fuel that barely exists, two regulators running two clocks, why a reactor follows load badly and what changes it, and a business model in which nobody sells you a reactor. Starting from high-school physics and chemistry. No company trivia. Generated 2026-09-04 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → Oklo → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** Four nuclear-adjacent plans exist and this repeats none of them. **Constellation Energy** covers the operating fleet as a business — merchant power, capacity markets, life extension and uprates, restarting a shut reactor, attribute markets, and why a reactor's cost structure pushes it to run flat out. **Dominion Energy** covers the SMR as a line item in a regulated buyer's programme, and how an integrated resource plan and a certificate of public convenience govern the clock. **Kiewit** gives the constructor's four-bullet summary of advanced reactors. And **GE Vernova, Siemens Energy and Mitsubishi Power** cover the turbines and the grid connection any thermal plant needs. This plan is the **machine** none of them opens.

**Three ideas carry the plan.** The **moderator is the fork in the road** — nearly every other difference follows from removing it. The **coolant's boiling point sets the building**, because pressure is what makes a reactor big. And **the licence, not the construction, is the schedule**.

**A reading discipline the subject demands.** Oklo is pre-commercial: no Aurora has produced a kilowatt-hour, and the announced customer book is non-binding almost throughout. This plan therefore separates four things headlines merge — a design, a regulatory milestone, an announcement, and a delivered megawatt-hour. That discipline is part of the curriculum, not a caveat on it.

**Suggested pacing:** Module 1 in one sitting (~35 min). Module 2 is the one that pays — read it with the fork-in-the-road table open (~40 min). Module 3 (~30 min). Module 4 (~30 min). Module 5 (~25 min). Then flashcards and self-test in the app.

## Module 1 — What a reactor is actually doing

**The single idea:** a reactor is a machine for boiling water with a neutron economy, and everything hard about it follows from the second half of that sentence.

Fission is a neutron transaction. A neutron strikes a heavy nucleus, it splits, and out come energy and **two or three more free neutrons**. If on average exactly one goes on to cause the next fission, the reaction sustains itself. More than one and power climbs; fewer and it falls.

**Why it is controllable at all.** Most fission neutrons appear within about a hundred-millionth of a second — nothing mechanical could chase that. But somewhat under one percent, the **delayed neutrons**, are emitted seconds to minutes later by the decay of certain fission products. A reactor is deliberately operated so that it *depends* on those stragglers to reach criticality, which stretches its response to a human timescale. The entire practicality of nuclear power rests on that sub-one-percent.

**The fact that shapes every safety system: off is not off.** Fission products keep decaying whether or not the chain reaction runs. **Decay heat** is roughly 6–7% of full power at shutdown, falling over hours and days — several megawatts of thermal power for a 75 MWe unit, long after everything is "off". Every serious reactor accident in history has been a failure to remove decay heat, not a failure to stop the reaction.

**Self-check:** a vendor says its design is "inherently safe". What is the one question that turns that into an engineering claim? *(How does it remove decay heat with no electrical power and nobody present — and under which accident, at what power, demonstrated or analysed?)*

## Module 2 — The fork in the road: keeping or removing the moderator

**The single idea:** a neutron's chance of causing fission depends enormously on its energy, and that one fact splits the whole field.

A **moderator** — light water, graphite — slows fast fission neutrons to thermal energies where their cross-section for fission in uranium-235 is far larger. Almost every operating commercial reactor has one. A **fast reactor** does not, and here is the cascade:

| | Thermal spectrum | Fast spectrum |
|---|---|---|
| Fission probability per neutron | High | Low |
| Enrichment needed | ~3–5% U-235 | HALEU: above 5%, below 20% |
| Core | Large, dilute, full of water | Small, dense, compact |
| Coolant may be | Water — it is also the moderator you wanted | Liquid metal, molten salt or gas — **never ordinary water** |
| Spare neutrons can | Little | Breed plutonium from U-238, and fission long-lived heavy elements |
| Xenon sensitivity | High | Much lower |
| Industrial base | Sixty years deep | Thin — the real difficulty |

**The honest summary: "small modular reactor" is a category of commerce, not of physics.** The designs under that label include smaller light-water plants, gas-cooled pebble beds, molten-salt machines and sodium-cooled fast reactors. They share a *business* model — build in a factory, licence once, repeat — far more than a technology. When a source says a company is building an SMR, ask: **thermal or fast, and cooled with what?** Those two answers predict nearly everything else.

**Self-check:** why can a fast reactor not be cooled with ordinary water? *(Water is a moderator. Using it would slow the neutrons back down and turn the machine into a thermal reactor, undoing the choice that defines it.)*

## Module 3 — The coolant's boiling point sets the size of the building

**The single idea:** a reactor is pressurised not because the reaction needs pressure, but because water boils at 100 °C and you need it liquid at 300 °C.

A pressurised light-water reactor holds water liquid at about 320 °C with roughly **155 bar**. Everything must hold that pressure: a thick forged vessel, thick piping, and a containment building sized for the steam released if that piping fails. **That is where much of a nuclear plant's cost and size actually goes.** The defining accident is a loss of coolant — depressurise and the water flashes to steam and leaves.

**Sodium melts at 98 °C and boils near 880 °C.** It stays liquid across the whole operating range at essentially atmospheric pressure. Remove the pressure and you remove the thick vessel and the large-break accident with it — the single largest architectural saving in the field, and the reason a small unit can be genuinely small. You also gain hundreds of degrees of thermal margin and enough thermal inertia to make natural circulation of decay heat plausible.

**What it costs you:** sodium burns in air and reacts violently with water, which is why an **intermediate loop** sits between the radioactive primary sodium and the water/steam side. It is opaque, so refuelling and inspection are done by instrument rather than by eye. It freezes at 98 °C, so every pipe and valve needs trace heating for the plant's life. And the supply chain for hot-sodium pumps, valves and seals is a speciality rather than a catalogue.

**Where the heritage claim comes from.** EBR-II ran at Idaho from 1964 to 1994, and in 1986 was deliberately subjected to a loss of flow and a loss of heat sink at full power **with safety systems disabled and no operator action** — and shut itself down and cooled itself in both. That is the experiment the modern passive-safety claim points back at. What it demonstrates is real. What it does not demonstrate is a commercial supply chain, a licensed design, or a cost.

**Self-check:** why is passive safety a *claim* rather than a property? *(Because it holds under stated conditions, on a stated machine, for a stated accident. A design sharing the physics is not the same machine — which is precisely what a regulator's review exists to establish, and precisely what the US regulator said was missing when it denied Oklo's first application in 2022.)*

## Module 4 — The fuel, the licence, and the load

**The single idea:** three separate clocks govern an advanced reactor, and none of them is construction.

**Fuel.** HALEU is uranium enriched above ~5% and below 20%. A compact fast core needs it because fast neutrons fission less readily. Only one US enricher is producing it, at pilot scale — a 900 kg delivery to the Department of Energy in January 2026. Nine hundred kilograms, against a fleet ambition measured in gigawatts. So near-term fuel comes from an inheritance rather than a market: roughly five metric tons recovered from used EBR-II fuel, government-owned throughout. Above enrichment sits fabrication (metal fuel is not made by the oxide-pellet makers), and beneath everything sit material control and accounting, certified transport packages, and conversion capacity almost nobody has.

**Licence.** Two genuinely different routes now run in parallel in the United States. The **NRC route** produces a licence usable anywhere — construction permit then operating licence, or a combined licence, with design certification available so a standard design is approved once; and since March 2026 a technology-inclusive framework, Part 53, exists for designs that are not large light-water plants. The **DOE authorization route** applies only on DOE sites or under DOE authority, and runs six gates of its own from an Other Transaction Agreement to startup authorization. Its advantage is that engineering, construction and safety review advance **in parallel**. Its limitation is decisive: a DOE-authorised reactor at a national laboratory is not a template for one at a customer's campus.

Six nouns that are not synonyms: *application, acceptance, docketing, approval, permit, licence*. Only the last two let you build or run anything. And a **materials licence** — permission to possess a couple of curies of a radioisotope — is not a reactor licence, however the headline reads.

**Load.** Constellation's plan gives the economics of running flat out. The physical reason is **xenon-135**: a fission product with an enormous thermal-neutron cross-section. Reduce power and its production from iodine decay continues while the flux destroying it collapses, so it builds to a peak hours later and can prevent a return to full power. A **fast** spectrum is largely free of that trap, because the appetite is a thermal-neutron phenomenon. The other route to the same end is a thermal store — molten salt — between reactor and turbine: run the reactor flat and let the store follow the grid.

**Self-check:** an AI campus load is described as "flat, so it suits nuclear". What is missing from that? *(It steps, hard and rhythmically. A reactor is the least suitable machine in the corpus for millisecond steps, which is why every serious campus design has storage, engines or a thermal buffer between the reactor and the racks.)*

## Module 5 — Modularity, the business model, and how to read an announcement

**The single idea:** the modular argument is a claim about the tenth unit, made while building the first.

**Scale versus series.** The old argument is economies of scale: material grows more slowly than volume, so one large unit is cheaper per megawatt. The modular argument is economies of **series**: unit cost falls a roughly constant percentage each time cumulative output doubles, so many identical factory-built units get cheap through repetition. You give up the first to buy the second. If the series never materialises you have the worst of both.

**The constraint nobody advertises** is the shipping envelope. "All components can be transported by truck and can be lifted by typical cranes" is a real engineering boundary: road and rail clearances cap module size, which caps how much can be assembled before shipping, which caps how much site labour the factory displaces. The honest question about any modular claim is **what fraction of the labour hours moved indoors** — and nobody publishes it.

**Nobody sells you a reactor.** In a build-own-operate model the vendor finances, builds, owns, licenses and runs the plant and sells the output under PPAs. The customer buys power and takes no nuclear risk; the vendor carries all the capital before any revenue, which is why such a company is funded by equity issuance rather than by product sales — and why its balance sheet, not its order book, limits how many units it can build.

**Which makes reading announcements a skill.** In ascending strength: a **memorandum of understanding** (we will talk), a **letter of intent** (we intend to transact, non-binding), a **master agreement** (a framework under which binding contracts *may* later be signed), a **prepayment** (money has moved), a **notice of intent to award** (a government means to contract, often conditional on a licence), a **definitive PPA** (an obligation to buy at a price). A pipeline quoted in gigawatts may consist almost entirely of the first three — and where a single non-binding instrument accounts for most of a headline order book, the number describes interest, not sales.

**Self-check:** a company announces first criticality while also stating no unit of its flagship product is operating. Contradiction? *(No. A small non-power test reactor on entirely different technology can reach criticality while the flagship power reactor is still under construction. Reading which machine a milestone belongs to is the core discipline in this sector.)*

## Where it fails — the checklist

Drawn from `CLASSROOM-CURRICULUM-PLAN.md` §5 rows 1, 4 and 12, plus the reactor-specific modes:

1. **Decay heat with no power and nobody present** — the failure every reactor accident reduces to, and the reason the passive-safety claim is the claim that matters.
2. **A licence clock treated as a construction clock** — roughly the first three years contain no construction at all.
3. **HALEU that does not exist yet** — a first core can come from a government allocation; a fleet cannot.
4. **First-of-a-kind cost read as nth-of-a-kind cost** — the gap between them is the entire investment case.
5. **A non-binding pipeline read as an order book** — has money moved, and is there a price?
6. **The interconnection, which is not nuclear at all** — §5 row 1: the study models the grid as it will be, and the grid keeps changing.
7. **A load that steps, met by a machine that cannot** — §5 row 12.
8. **Community consent on a site chosen for its convenience** — former enrichment sites offer land, grid and workforce, and a population with direct memory of contamination.

Developed by: LightAISolutions
