# Vertiv — Technology Lesson Plan

**Purpose:** teach the UPS as a **purchasable object and a transaction** — what a power module physically is, how a frame is populated over years, what every line of a datasheet commits you to, and the eleven-step sequence by which a UPS becomes a load-carrying asset. Starting from high-school STEM. No company trivia: founding dates, executives and share counts stay in the dossier. Generated 2026-09-04 from the Profiler dossier (profileVersion 6). Companion: the in-app guide (Profiler → Vertiv → Study guide 📖) carries the condensed version, the flashcards and the self-test, plus the six cooling sections this plan does not repeat.

**How this plan relates to what you already have.** Four UPS plans already exist and this one deliberately teaches none of their material again. **Rehlko** opens the machine (four blocks, double conversion vs eco-mode, the four clocks, monolithic vs modular, three sizing numbers). **Piller** teaches the IEC 62040-3 grades, rotary and DRUPS, the stiff source and the isolated-parallel bus. **Mitsubishi Electric** teaches the three-level inverter, the efficiency curve and the redundancy tax, and VRLA vs lithium. **Eaton** teaches selective coordination, busway and the outage choreography. This plan is the one about **buying** one — and it is paired with the Schneider Electric plan, which takes the level *above* the machine (topologies, utilisation, distribution to the rack, the scale ladder).

**Suggested pacing:** Module 1 in one sitting (~25 min). Module 2 with a real datasheet open in front of you (~40 min — this is the module that pays). Module 3 in one sitting (~30 min). Module 4 (~20 min). Then the flashcards and self-test in the app. If you already read the Vertiv cooling material, skip straight to Module 1.

## Module 1 — What a UPS power module actually is

**The single idea:** modularity is not packaging. A power module is a complete small UPS in a drawer.

Inside one module: its own rectifier, its own DC-link capacitors, its own inverter, its own control processor, its own fans and its own protection. It shares only the frame's busbars, the frame's input and output breakers, and a supervisory controller that tells it what share of the load to take. Pull one and the others do not reconfigure — they each simply carry a slightly larger fraction of the same load.

**Three things have to be engineered into the slot for a live exchange to be possible.**

1. **Current sharing.** Every module must take its share of a common bus without any of them trying to drive the others. This is done by giving each a slight droop, so a module running high naturally backs off.
2. **Decoupling.** Removing a module must not present the remaining bus with a transient it cannot absorb, so the connection is made and broken through a defined precharge and isolation sequence rather than a plug.
3. **Touch safety.** The frame stays live, so the module's connections must be shrouded well enough that a hand can be inside the frame while several hundred kilowatts flow centimetres away.

Vendors brand this ("Live Swap" and similar). The underlying property is that **hot-swap belongs to the slot, not to the module**.

**Fix the vocabulary before reading any quotation.** Five levels, five different purchases:

| Level | What it is | What buying one commits you to |
|---|---|---|
| **Power module** | A complete small UPS in a chassis, tens to a couple of hundred kW | The granularity of every future capacity and redundancy decision |
| **Frame** | The cabinet: busbars, breakers, controls, a fixed slot count | The permanent maximum capacity of that position in the room |
| **Unit / block** | One complete UPS with one output breaker | One point of common failure and one maintenance event |
| **System** | Several units paralleled with load sharing and a common control | A vendor parallel limit (commonly four to eight) and a shared control layer |
| **Plant / path** | A whole A or B side, own board to own distribution | Genuine independence — only if the paths do not meet upstream |

**Self-check:** a vendor quotes "N+1". What is the one question that makes the claim mean something? *(N+1 of what — modules in a frame, frames in a system, or systems on independent paths? Each is an order of magnitude apart in cost and survives a different class of failure.)*

## Module 2 — Reading a UPS datasheet

**The single idea:** a UPS datasheet has about thirty lines, of which four get read, and the surprises come from the other twenty-six.

Skip the two the other plans cover — the kVA-against-kW trap (Rehlko) and the efficiency curve (Mitsubishi Electric). Here is what the rest actually decides.

- **Overload rating.** How far above nameplate, and for how long. This is the line that decides whether a downstream fault clears: an inverter that folds back to its rating to protect its semiconductors starves the branch breaker of the current it needs to trip, so the fault stays and the *bus* is lost instead of the circuit.
- **Short-circuit contribution.** The fault current available into a bolted fault, which is far less than the transformer upstream. The coordination study is run against this number.
- **THDi and input power factor.** How cleanly the machine draws its own supply. A modern active front end looks like a plain resistor to the generator; older 12-pulse designs do not, and the engine has to be oversized for a load it never sees as real power.
- **Input voltage window and frequency tolerance.** How far the supply may wander before the machine starts spending the battery. Narrow windows on weak supplies produce discharges during events that were never outages.
- **Battery interface.** DC voltage window, block count, charge-current limit and acceptable ripple. The charge-current limit decides recharge time — and a plant that recharges slowly is unprotected against the repeat event, which is the likeliest one.
- **Footprint, weight and floor loading.** Kilograms per square metre is a *building* property. In a retrofit it settles more selections than price does. Schneider quotes 1,042 kW/m² on the Galaxy VXL precisely because plant room is displaced white space.
- **Ambient range, altitude derating, ingress rating.** The conditions under which every other number on the page is true. Vertiv publishes −20 °C to 55 °C on OneCore for exactly this reason.
- **Acoustic level.** A planning and labour-law matter on urban sites, discovered late because nobody reads it.
- **IEC 62040-3 class and safety listing.** The honest version of the marketing claim (see the Piller plan for the grades).
- **IEC 62443 certification level.** What the machine's own network defences were audited to — not a statement about the network it is put on.

**The four that most often surprise on site:** overload rating, short-circuit contribution, floor loading, and the battery charge-current limit. None appears in a headline comparison.

**Self-check:** two 1,000 kW quotes differ mainly in overload rating. Why is the lower one riskier? *(It may not feed a downstream fault hard enough for the branch breaker to clear — so a circuit fault becomes a bus outage.)*

## Module 3 — How a UPS is actually bought

**The single idea:** each step's output is the next step's input, and the failures are almost always a step that finished *late* rather than one that finished wrong.

1. **Basis of design** — the owner's engineer fixes architecture, redundancy and ratings, usually with a product in mind. Whoever writes it has largely chosen the vendor.
2. **Specification and or-equal** — the named product plus the alternatives permitted to compete. An or-equal clause written around one vendor's unique feature is a sole-source spec with a fig leaf.
3. **Tender and award** — usually decided on price and headline efficiency, the two lines least likely to differ meaningfully.
4. **Slot reservation** — a payment that holds a place in the factory schedule, often before the design is finished. In a shortage the queue position *is* the purchase.
5. **Submittal and approval** — drawings, ratings and protection data to the engineer of record. **Manufacturing starts on approval, not on the purchase order.** This is the most common silent schedule killer in the whole sequence, because the delay accrues on somebody else's desk.
6. **Manufacture** — to the approved submittal; any change afterwards is a variation and often re-enters the approval queue.
7. **Factory acceptance test** — run at the works under load bank with the customer present: full load, step loads, transfers, alarms. A wiring or logic error found here costs a day; the same error on site costs a week and a crane.
8. **Delivery, rigging and installation** — route survey, crane, floor loading, cabling, battery. The route is a design input nobody owns, and a frame that will not fit the lift is discovered at the lift.
9. **Site acceptance test** — proves the *installation*, in its final configuration. It does not re-prove the machine.
10. **Integrated systems test** — the whole plant failed on purpose under load banks: utility dropped, engines started, transfers made, cooling recovered, UPS on battery and back. The only step that tests the **seams**, and the first one cut when the schedule slips.
11. **Service contract and the mid-life battery** — response times, preventive maintenance, spares, and the battery replacement that lands inside the machine's life. It is a project, not a maintenance task: the plant runs with reduced or absent autonomy while it happens.

**Two structural observations.** The buyer's leverage is spent between steps 1 and 3 and never returns — after award every conversation is about variations. And steps 7, 9 and 10 are three different tests routinely all called "commissioning": the works test proves the machine, the site test proves the installation, the integrated test proves the system. A project that ran only the first two has never once seen its plant fail.

**Self-check:** a delivery slips ten weeks with no factory problem reported. Most likely cause? *(Submittal approval sat in a queue — manufacturing had not started.)*

## Module 4 — Pay now or pay later, and the threat to the category

**The single idea:** capacity-on-demand defers about a third of the cost, not most of it.

Buying the megawatts on day one gives one design, one submittal cycle, one commissioning programme, prices and slots locked at today's terms, and a plant proven once at full rating. It costs idle capital for one to three years, a forecast that is usually wrong, and battery design life consumed protecting nothing.

Buying the frame and adding modules tracks capital to revenue, makes N+1 cheap in a lightly loaded hall, and keeps the plant nearer its efficient band. It costs live work on an energised frame every time, future prices on a captive frame — and it defers only the modules. **Frames, breakers, cabling, the battery room, the electrical-room cooling and the floor loading are all sized for the end state on day one.**

The question that settles it is not technical: *who signs the lease, and when?* An owner-operator with committed load has already sold the capacity. A colocation provider filling over three years is buying an option, and the frame is the option.

**And the category's own risk.** Vertiv sells both sides of the argument that may end the room UPS: Trinergy in 1,500–2,500 kVA-kW blocks to about 20 MW, and PowerDirect Rack — an ORv3 shelf at 50 V DC, 33–132 kW per rack, N+N, accepting AC or high-voltage DC input. Moving the store into the rack distributes three things a room UPS concentrated: **the stored energy** (hundreds of small BBU shelves rather than one battery room), **the fault duty** (onto a DC bus with no zero crossing, which is why solid-state breakers appear), and **the maintenance action** (per rack, rather than one action protecting a hall). Read the Vicor plan for the converter's side of that bus and the Narada plan for the cell's side.

**Self-check:** why would a company ship a product that undercuts its own thirty-year franchise? *(Because the installed base guarantees the service annuity either way, and the marginal megawatt in new AI halls is where the architecture question is genuinely open. It is a hedge, not a prediction.)*

Developed by: LightAISolutions
