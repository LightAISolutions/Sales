# Siemens Energy — Technology Lesson Plan

**Purpose:** teach **the network as a system** — why the wire rather than the plant is usually what limits how much power a load can get, what physically connects a generator to a transmission line, what a high-voltage substation is made of and why it is increasingly a sealed box, why anyone builds a DC link at all, what inertia and system strength actually are, and what a three-year transformer lead time does to a project. Starting from high-school STEM. No company trivia. Generated 2026-09-04 from the Profiler dossier (profileVersion 5). Companion: the in-app guide (Profiler → Siemens Energy → Study guide 📖) carries the condensed version, the flashcards and the self-test, plus the six turbine-and-policy sections this plan does not repeat.

**How this plan relates to what you already have.** Four grid plans exist and this one sits in the gaps between them. **Hitachi Energy** teaches the transformer factory, the HVDC converter's internals (thyristors vs transistors), grid-forming inverters and the geography of heavy manufacturing. **GE Vernova** teaches the power-OEM business model, the installed-base flywheel, why grid factories cannot scale up, and generator physics from shaft to current. **ABB** teaches medium vs low voltage, arc interruption inside a breaker, and protection relays. **Powell Industries** teaches the switchgear lineup, main-tie-main, arc flash and the protection study. None of them teaches the **network** — the limits, the connection, the DC decision, the stability machines, or the buyer's response to the shortage. That is this plan.

**One idea holds it together:** a grid does not fail by running out of generation. It fails by running out of the ability to **move** power, **hold it steady**, or **connect to it**. Every product in the Grid Technologies catalogue answers one of those three.

**Suggested pacing:** Module 1 in one sitting (~30 min — do the I²R arithmetic yourself). Module 2 (~25 min). Module 3 (~30 min). Module 4 (~25 min). Then flashcards and self-test in the app.

## Module 1 — Why the wire is the constraint

**The single idea:** power is volts times amps, and loss is current *squared* times resistance. Everything follows.

Move a given amount of power at ten times the voltage and you need a tenth of the current and lose a hundredth of the power. That single relationship is why transmission exists, why it runs at hundreds of kilovolts, and why every stage of a power system is a voltage change. Siemens Energy's own transformer range runs from 10 kV to 800 kV and up to 1,300 MVA.

**Three different things can limit a line, and which one binds depends on the line.**

1. **Thermal.** Current heats the conductor, it expands and sags, and clearance to the ground is a legal limit. This is ampacity, and it binds on short lines.
2. **Voltage.** Pushing power along a long line drops voltage at the far end; past a point the drop runs away and the system collapses. A reactive-power problem, not a heat problem. It binds on long or weak corridors.
3. **Stability.** The machines at each end must stay in step. Push too much and a disturbance leaves them unable to re-synchronise.

The real number is the **transfer limit** — whichever binds first — and it sits well below the sum of the lines' thermal ratings.

**Then subtract one of everything.** The **N-1** rule says the network must survive losing any single element without shedding load, so the usable limit is what the corridor carries with its largest element *out*. That is why transmission looks over-built on an ordinary day and why one outage makes a region's apparent spare capacity vanish at once.

**Congestion is what this feels like from the market.** When the cheapest generation cannot reach the load because the wires are full, most US markets price rather than ration. For a data-centre developer it shows up as a *location* decision long before an engineering one: two sites twenty miles apart can differ by years of connection date and a large multiple in interconnection cost.

**Self-check:** a region has ample generating capacity and still cannot connect a 500 MW load quickly. Why? *(The transfer limit under N-1, plus multi-year lead times on the transformers, bays and lines needed to raise it. Generation and delivery are different problems.)*

## Module 2 — From the generator's terminals to the line

**The single idea:** "connecting generation to load" is a specific sequence of separately procured objects, each with its own lead time. GE Vernova's plan stops at the terminals; this picks up there.

| Element | What it is | What it decides |
|---|---|---|
| **Generator terminals** | The machine's output at its own voltage — tens of kV for large plant | Nothing on the network runs at this voltage, which is why the next object exists |
| **Generator circuit breaker** | A breaker between machine and step-up, rated for the enormous currents available at a generator's terminals | Whether one unit can be taken off and returned without switching the whole HV bay |
| **Generator step-up transformer** | Dedicated to one machine, lifting terminal voltage to transmission voltage. Custom, shipped in pieces | Frequently the whole plant's schedule — years of lead time, and useless to another project |
| **Auxiliary transformer** | Station service for the plant's own pumps, fans and controls | How the plant starts, and whether it can restart itself — the practical content of black start |
| **The bay** | One complete switching position: breaker, disconnects, earthing switches, instrument transformers and protection | The unit in which substations are counted, priced and extended |
| **The switchyard** | The whole fenced arrangement of bays and busbars | Where the plant meets everyone else. Its layout is a redundancy decision made for the same reason as in a data hall: to work on it while it runs |
| **Point of interconnection** | The exact spot where the owner's equipment ends and the network's begins | Every study, tariff, protection setting and argument about who pays refers to it |

**Read the table twice** — once for a power plant, once for a 500 MW data-centre campus. The objects are identical and only the direction of power differs, which is exactly why the two are competing for the same factory slots. Siemens Energy's Eaton alliance makes that explicit: a standard 500 MW on-site block pairs the generation with the whole electrical stack, because delivering one without the other delivers nothing.

**Self-check:** why is a generator step-up transformer a worse thing to have on order than a turbine? *(It is custom, dedicated to one machine, has years of lead time, and cannot be resold into another project if this one is cancelled.)*

## Module 3 — The sealed substation, and why anyone builds a DC link

**The single idea (a):** at high voltage, insulation is mostly *distance* — so a gas buys land back chemically.

Air is a fairly poor insulator per millimetre, so an air-insulated yard grows with voltage and is measured in hectares. SF6 under pressure in a sealed earthed enclosure insulates several times better and quenches arcs far better, fitting the same rating into a fraction of the footprint. SF6 is also among the most potent greenhouse gases known and persists for millennia, so leak rates are regulated and inventories reported.

**SF6-free is a portfolio, not a substitution.** Clean air replaces the insulating duty acceptably and the arc-quenching duty badly, so the interruption technology has to change too — usually to vacuum. Two changes doing together what one gas did alone, which is why it arrives voltage class by voltage class. Siemens Energy markets this as its "Blue" range, and extends the same idea to DC with a DC-GIS published to ±550 kV and 5 kA.

**The single idea (b):** every DC link pays for two converter stations, so something must be worth that.

1. **Distance.** DC needs fewer conductors and carries no reactive component, so the line is cheaper per km and loses less. Above the **break-even distance**, DC wins.
2. **Cable — not the same as distance.** An AC cable is a long capacitor drawing charging current simply to charge itself. Past roughly 100 km subsea it consumes the whole rating. There is no engineering around this within AC, which is why essentially every long offshore connection is DC.
3. **Control.** An AC line is a pipe — power flows by impedance. A DC link is a **valve**: the converters set exactly how much flows and which way, continuously.
4. **Keeping two systems apart.** An asynchronous tie joins networks that are not in step. Power crosses; disturbances do not.

**What it costs, honestly.** Two converter stations, each a building rather than a bay, each with converter transformers that are themselves large power transformers with their own lead times. Each station loses on the order of a percent. And a DC fault is genuinely harder: there is no zero crossing, so a DC breaker must force the current to zero itself — which is why DC breakers arrived decades after AC ones, and why many links still protect by tripping the converters. **The identical physics appears inside an 800-volt rack**, which is why solid-state breakers show up in the Vicor and Zhonhen plans.

**Self-check:** why must a 200 km subsea wind connection be DC? *(The AC cable's own charging current would consume its entire rating over that length. A hard boundary, not an economic preference.)*

## Module 4 — Holding it up, and what a three-year transformer does

**The single idea:** a synchronous generator gives the grid three things for free while it sells electricity — inertia, system strength, and reactive power on demand. Retire it and all three leave.

**Inertia** is heavy spinning mass resisting sudden frequency change; without it, RoCoF — the rate at which frequency falls after a loss — rises, and protection settings written for the old world mis-trip in the new one. **System strength** is how firmly a point holds its voltage and how much fault current it can supply; protection relays need it to see a fault at all, and converters need it to stay stable.

Two machines answer this, and they answer different words in the same sentence:

- **Synchronous condenser** — a large synchronous machine spinning with no fuel and no turbine, often a converted retired generator. Supplies genuine inertia (physics responds; no control loop, no firmware), real fault current, and reactive power continuously. Costs: bearings, cooling, overhauls, a little power to keep spinning, and a construction project to site.
- **STATCOM** — a converter injecting or absorbing reactive power in milliseconds, with full range available at low voltage where a switched capacitor's output collapses. Compact, containerisable, tunable against a specific disturbance signature. Supplies **no inertia** and almost no fault current — and, being a converter, it needs a reasonably strong grid to stay stable, which is uncomfortable when weakness is why it was bought.

Hitachi Energy's plan covers the third answer, the grid-forming inverter. Note that Siemens Energy markets its E-STATCOM specifically at data-centre load fluctuation — because a large AI campus produces exactly the second problem: tens of megawatts swinging in milliseconds, repetitively. Piller's plan sees that swing from inside the fence; here it appears as flicker and as an interconnection condition.

**And the buyer's side of the shortage.** Context from the company's own published position: US Southeast lead times for large power transformers running past 36 months, roughly four-fifths of US large power transformers imported, a $150M Charlotte transformer plant and a new Mississippi HV switchgear plant, and transformer capacity lifting 30–50% across FY26–28. Given that, a buyer has six instruments:

| Instrument | What it costs you |
|---|---|
| **Slot reservation** | Money at risk on a project that may not happen, and a specification frozen earlier than the design is ready |
| **Standardisation** | A less optimal unit in exchange for a place in a repeat production run — **the single largest lever**, and an engineering concession made purely for schedule |
| **Mobile substation** | Lower rating, higher cost per MVA, a temporary arrangement to unwind |
| **Re-using an existing connection** | You inherit someone else's ratings and condition — fastest route to power, least controllable |
| **Generating on site** | Converts a queue problem into a permitting problem (fuel supply, air permits, the on-site generation risk set) |
| **Waiting** | Often cheapest and almost never chosen, because being early in an AI build cycle is worth more |

**The shortage is upstream of the design** — it shapes what gets specified, not merely when it arrives. It also explains the backlog behaviour: when a factory is sold out for years, new orders enter at today's prices while old cheaply-priced ones deliver first, so reported margins improve mechanically for years. The equipment shortage and the OEM's margin expansion are one fact seen from two sides.

**Self-check:** a network operator must slow the *rate* at which frequency falls after a generator trips. Will a STATCOM do it? *(No. A STATCOM supports voltage and supplies no inertia at all. Slowing a frequency fall needs energy physically stored and released without being asked — spinning mass, or a grid-forming inverter with a store behind it.)*

Developed by: LightAISolutions
