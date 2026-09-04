# Rolls-Royce Power Systems (mtu) — Technology Lesson Plan

**Purpose:** teach what changes when a battery joins the backup plant, and what changes when the same machine is sold into two regulatory worlds. Starting from high-school STEM. No company trivia: founding dates, executives and share counts stay in the dossier. Generated 2026-09-04 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → Rolls-Royce Power Systems → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Caterpillar plan teaches the gen-set as a machine and the ten-second race. The Cummins plan teaches the gen-set as a purchase — datasheet literacy, the sizing arithmetic, the emissions class as a legal decision. Neither is repeated here. This plan takes the same machine and puts a megawatt-scale battery next to it, then asks the second question a European vendor forces: what does it mean that the identical engine is certified twice and rated twice depending on which grid it is sold into?

**Suggested pacing:** Module 1 in one sitting (~25 min). Module 2 in one sitting (~35 min — the hybrid sequence is the spine of the plan). Module 3 across two short sittings (~40 min — grid-forming is the hardest idea here and repays a second pass). Module 4 in one sitting (~25 min). Module 5 in one sitting (~30 min). Then the flashcard and self-test passes in the app.

## Module 1 — One machine, two rulebooks

**The single idea:** a gen-set maker selling on both sides of the Atlantic is not selling one product in two colours, and both differences reach into the hardware.

**Frequency comes from geometry, not from a setting.** The alternator's rotor carries a number of magnetic poles and output frequency is shaft speed times the number of pole *pairs*. A four-pole machine makes 60 Hz at 1,800 rpm and 50 Hz at 1,500 rpm. Power is torque times speed, so the same engine makes roughly 20% more power at 1,800 rpm — which is why every model's rating table has two columns that are not interchangeable, and why the 50 Hz version runs at lower thermal and mechanical stress with a longer overhaul interval. There is no gearbox to change: the alternator is coupled to the crankshaft. Selling into the other market means a different pole count or rated speed, a re-rated cooling package, and usually a separate emissions certification.

**Emissions floors differ.** In the US, standby fleets are commonly certified EPA Tier 2 in the stationary-emergency class, and anything running for a living needs Tier 4 with SCR and DEF. In Europe, EU Stage V is stricter than Tier 4 on particle *number* and in practice mandates a filter. Different after-treatment, different backpressure, different service regime, separate certification programmes.

**Hours regulation differs too.** RICE NESHAP caps non-emergency running for the US emergency class — commonly ~100 hours a year including testing. European practice ties it to the site's overall permit rather than an engine-class hour cap. That is the difference between steel that can legally earn and steel that can only insure.

**A worked example of what the rulebooks buy.** mtu publishes a five-rating matrix and maps it to certification outcomes: standby (3D), prime for stationary emergency (3E), prime (3B) and grid stability (3G) map to Uptime Tier I and II, while **data center continuous power (3F)** maps to Tier III and IV at a 100% load factor with unlimited annual hours and 10% overload. The company also publishes where its own definitions are *more generous* than ISO 8528-1 — an 85% load factor against ISO's 70% for emergency standby, and 500 annual hours against ISO's 200. Read that table before you compare a European vendor's standby number with an American one.

**Self-check:** a catalogue shows 2,500 kW at 60 Hz and 2,000 kW at 50 Hz for one model. Why? *(1,800 rpm against 1,500 rpm; roughly 20% more speed, roughly 20% more power.)*

## Module 2 — What a battery changes about the start

**The single idea:** the classical chain has an awkward handoff, and a megawatt-scale battery changes the shape of it rather than merely enlarging it.

**The classical chain.** Server capacitors hold for 10–20 ms (hold-up time). The UPS picks the hall up inside that window and holds for minutes. The engine has about ten seconds to start, reach speed and take the whole load in one bite. Every compromise in a standby plant traces to that ten-second gap and to the block load at the end of it.

**With a battery on the bus, three things follow.**

1. **The engine can start gently.** If the battery carries the hall, engines are brought up, synchronized and *soft-loaded* over tens of seconds rather than catching the load in one step. The turbo-lag and load-acceptance problem that forces standby fleets to be diesel is relaxed — which opens the role to gas engines and to smaller, more efficient sets.
2. **The plant can be smaller.** A standby plant is sized for the peak the site can present. If a battery absorbs the peaks and swings, the engines only need to cover the *average*, and in an AI hall the difference is large. The battery is buying engine capacity.
3. **The asset can earn.** An engine certified emergency-only is pure insurance. A battery has no air permit and no hour cap, so it can shave the demand peaks that set the bill, arbitrage price, or hold frequency — all year. That is why microgrid controls are sold as a product rather than an accessory.

**What it does not change.** The UPS step is untouched: nothing with a crankshaft or a plant breaker acts inside 20 ms. The mental model that keeps it straight: **the UPS buys milliseconds to minutes and is a reliability device; the plant battery buys minutes to hours and is an economic device that improves reliability as a side effect.**

**The sequence, second by second.** 0 s utility lost → 20 ms the UPS inverter carries the critical load → ~0.3 s island detected and the breaker opens, with anti-islanding protection guaranteeing nothing still energizes the utility line → ~0.5 s the battery goes grid-forming and holds the *whole* bus, mechanical plant included → ~3 s engines crank, no longer against a deadline → ~20 s the first engine synchronizes and soft-loads → ~60 s load shared, battery steps back to reserve → ~120 s the battery's steady-state job becomes absorbing load swings so the engines see a smooth load → ~300 s steady island operation, and runtime becomes a fuel-logistics question exactly as before.

**Self-check:** which step of that sequence is identical to a conventional plant, and why is it not optional? *(The UPS carrying the critical load inside hold-up time; nothing else acts fast enough.)*

## Module 3 — Grid-forming, grid-following, and sizing the battery

**The single idea:** an inverter connected to a live grid and one connected to a dead bus solve different problems, and the distinction is the most important classification in power electronics for anyone selling into islanded sites.

**Grid-following** uses a phase-locked loop to watch the existing waveform and inject current in step with it. Simple, cheap, the right answer for most storage on a strong grid, and incapable of destabilising a healthy network. But it needs a reference to exist before it can act: on a dead bus it has nothing to lock to. It contributes no inertia and cannot black-start.

**Grid-forming** imposes a voltage waveform, behaving as a voltage source behind an impedance the way a synchronous machine does, and can be given synthetic inertia and droop. It can energize a dead bus and hold an island alone, and it supplies the fast frequency response that makes an engine's slow load acceptance survivable. The costs are real: two grid-forming sources on one bus must share load without fighting, exactly as two isochronous governors would; and fault-current contribution is limited by the semiconductors, so protection settings that assumed a spinning machine's fault current may no longer coordinate.

In practice a hybrid plant is **both, at different times** — grid-following while the utility is present and the battery is earning, grid-forming the instant the site islands. How fast that switch happens is a specification worth asking a vendor about, and it is where hybrid microgrids most often disappoint.

**Sizing: power and energy are two purchases.** Megawatts is how hard it can push, set by the inverter and cell current limits. Megawatt-hours is how long, set by cell count. The ratio is the C-rate. A **power battery** (high C-rate) suits smoothing load swings, holding frequency and bridging the engine start; it discharges in minutes. An **energy battery** (low C-rate) suits riding a whole outage or shifting energy; it runs for hours. Most real designs land on a power-shaped battery plus engines, because **engines are a far cheaper way to buy hours than cells, and cells are a far cheaper way to buy seconds and steps than an oversized engine.** Each technology is bought for what it is cheap at. Add the degradation term: cells lose capacity with cycles and time, so a system sized exactly to requirement on day one is undersized by year five — handled by augmentation or by oversizing, which is a cost-of-capital decision.

**Where mtu's own battery actually sells.** Worth knowing, because it corrects an easy assumption: every located mtu EnergyPack deployment is grid or utility scale — 582 MWh for a Lithuanian utility, 490 MWh in Latvia, 43 MW in Scotland, systems in the Netherlands — and the company positions itself as the leading battery supplier in the Baltic states. No data-centre EnergyPack installation was found. The division's data-center storage product is the **Kinetic PowerPack**, a diesel *rotary* UPS: an engine, a synchronous machine, a kinetic accumulator and a clutch on one frame, at 40% of the footprint of an equivalent static UPS, with 17× nominal current into a fault. Those are two different machines solving two different problems, and conflating them overstates the data-center franchise.

**Self-check:** a hybrid's battery is specified 5 MW / 20 MWh. Which duty is it clearly *not* sized for? *(Riding a four-hour outage at full power — that leaves no reserve margin, no degradation allowance and no room for the peak-shaving duty it was probably bought for.)*

## Module 4 — Drop-in fuel: what HVO changes and what it does not

**The single idea:** HVO converts a fleet's carbon problem into a procurement problem and leaves its air-quality problem exactly where it was.

| Question | Answer | Why |
|---|---|---|
| Engine modification needed? | Usually not, where the family is approved for EN 15940 paraffinic diesel | HVO is made by hydrogen-treating fats and oils, producing hydrocarbons chemically close to fossil diesel — unlike biodiesel (FAME), an ester that brings storage and material-compatibility problems |
| Does it cut carbon? | Substantially, on a lifecycle basis | The molecules still produce CO₂ at the stack; the saving is that the carbon came from recent biomass. It is an accounting property of the supply chain |
| Does it cut what the air permit regulates? | Only modestly, and it does not change the emissions certification | NOx comes from burning anything hot in air; particulates fall somewhat on a cleaner paraffinic fuel; the permit is written against the certified engine class |
| Does it store better? | Generally yes — better oxidation stability, no water-attracting ester content | This matters more for standby fleets than the carbon claim, because standby fuel sits for years |
| The catch? | Price premium and feedstock supply, competed for by aviation and road transport | Availability, not engineering, is the binding constraint — which is why HVO commitments are supply contracts rather than engineering changes |

mtu states that fuels to EN 15940 are approved for **all** Series 4000 system configurations and emission calibrations, and that no hardware or software adaptation is needed with standard warranty conditions applying. It also published the first Environmental Product Declarations for data-centre emergency gen-sets in December 2025 — a *procurement* credential, since an EPD is what a customer's own carbon disclosure requires.

## Module 5 — The controller is the product, and where the catalogue stops

**The single idea:** in a plant with engines, a battery, possibly solar and a utility connection, no individual machine knows what the site should do — and the layer that decides is where the value has moved.

**What it arbitrates.** At any moment: hold enough state of charge to ride an outage; discharge to shave the peak that sets the demand charge; absorb the hall's swings so engines stay near their efficient point; charge when energy is cheap. Maximise savings and you drain the reserve; maximise reliability and you never earn. The tuning is a business decision expressed as software — and a hybrid that spent its charge on arbitrage is less reliable than the dumb diesel plant it replaced.

**Why the seams are hard.** The controller must talk to gen-set governors, the inverter, the paralleling switchgear, the protection relays and the building-management system, each with its own protocol and its own idea of what an emergency is. mtu's EnergetIQ Manager lists eleven — OPC-UA, Modbus TCP and RTU, Profibus DP, ProfiNet, DNP3, IEC 60870-5-101/103/104 and IEC 61850 — and is certified to IEC 62443-4-1 ML2. Most real-world hybrid disappointments are integration failures at these seams, not battery or engine failures.

**Anti-islanding, and why grid-parallel is a privilege.** The moment a site's generation can push power onto the utility's wires, a new category of protection appears: the plant must detect that the utility has gone and disconnect fast enough that no line worker meets an energized conductor they believe is dead. That is why grid-parallel operation needs an interconnection agreement, why peak shaving costs more in relaying than emergency-only operation, and why the simplest standby plants deliberately use open transition and never touch the grid. mtu inverts this into a selling point: its sets are certified to the German grid code VDE-AR-N 4110 and marketed as *"suitable for grid parallel operation… to gain additional revenues through grid services such as frequency control reserve."*

**Where this catalogue stops.** mtu fills more rows of the single-line diagram than any other vendor in this corpus — diesel, gas, rotary UPS, battery, microgrid controller, and prefabricated 10/20/30 MW plant modules with a published 12–18 month lead time. It does *not* carry a static UPS, a standalone switchgear or transfer-switch line, or transformers. Compare with Rehlko, which carries medium-voltage paralleling switchgear and a static UPS but manufactures no battery, and with Cummins, which carries switchgear, transfer switches and a battery but no UPS at all. **Where a vendor's catalogue stops is where the buyer's integration work starts** — and that, rather than any datasheet, is the real question behind "single vendor or best-of-breed".

**Self-check:** what is the strongest argument for buying engines, battery and controller from one supplier, and what does it cost? *(The integration risk at the control seams becomes the supplier's warranty problem rather than the owner's engineering problem; the cost is lost leverage on later phases and inheriting the vendor's weakest category.)*

Developed by: LightAISolutions
