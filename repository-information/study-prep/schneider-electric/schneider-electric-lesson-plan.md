# Schneider Electric — Technology Lesson Plan

**Purpose:** teach the UPS at the level **above the machine** — how many machines and in what arrangement, how much of what you bought you can actually use, how the plant is worked on while it runs, what sits between the UPS output and the server's two cords, and how the same four blocks change character from a desk-side box to a megawatt frame. Starting from high-school STEM. No company trivia. Generated 2026-09-04 from the Profiler dossier (profileVersion 6). Companion: the in-app guide (Profiler → Schneider Electric → Study guide 📖) carries the condensed version, the flashcards and the self-test, plus the six software-and-blueprint sections this plan does not repeat.

**How this plan relates to what you already have.** The physics is covered four times over — **Rehlko** (the four blocks, double conversion vs eco-mode, the four clocks, sizing), **Piller** (IEC 62040-3 grades, rotary and DRUPS, the stiff source, the isolated-parallel bus), **Mitsubishi Electric** (three-level inverter, efficiency curve, VRLA vs lithium), **Eaton** (selective coordination, busway, outage choreography). This plan repeats none of it. It is the **paired half of the Vertiv plan**: Vertiv teaches the machine and the transaction (what a module is, what the datasheet says, how it is bought); this one teaches the system and the ladder.

**Suggested pacing:** Module 1 in one sitting with a calculator (~35 min — do the utilisation arithmetic on paper). Module 2 (~25 min). Module 3 with a real one-line in front of you (~30 min). Module 4 (~25 min). Then the flashcards and self-test in the app.

## Module 1 — The arrangement above the machine

**The single idea:** redundancy is a property of the arrangement, not of the equipment. Every machine on the shortlist can be perfect and the arrangement still fail.

| Arrangement | What it is | Usable share of installed capacity | What the money buys |
|---|---|---|---|
| **N** | Exactly enough UPS on one path | All of it, in principle | Conditioning only. Any fault or maintenance puts the load on static bypass |
| **N+1** | One extra unit or module paralleled onto the same bus | N of N+1 — 80% at 4+1, 67% at 2+1 | Survives one unit's failure; allows one out for work. Does **not** survive a fault on the common output bus |
| **2N** | Two complete independent paths feeding dual-corded equipment | Half — each side ≤50% by construction | A whole side can be lost or worked on. Bought for the maintenance day far more often than for the failure |
| **Distributed redundant** | Three or more systems cross-tied so any two carry the load | Two of three — about 67% | Near-2N survivability at less installed capacity, paid for in distribution complexity |
| **Block redundant (catcher)** | Each block has its own UPS plus one shared spare that catches whichever loses its own | N of N+1 at system level | Cheap redundancy across many blocks — at the cost of a transfer event 2N would never have produced |

**The utilisation arithmetic, as installed MW per protected MW:** N = 1.0 · block redundant (4+1) = 1.25 · N+1 at 4+1 = 1.25 · distributed redundant = 1.5 · N+1 at 2+1 = 1.5 · **2N = 2.0**.

Going from N+1 at 4+1 to 2N costs 60% more installed capacity **and** halves the load each machine sees, pushing the whole plant permanently down its efficiency curve (the Mitsubishi Electric plan quantifies the curve). That is the entire reason distributed-redundant and block-redundant arrangements exist.

**And the defeat condition that applies to all five.** Two feeds that share a transformer, a switchboard or an earthing point are one feed with extra copper. Piller's plan adds a sixth arrangement, the isolated-parallel bus, which reaches this kind of redundancy without cross-tied distribution.

**Self-check:** a 2N hall runs at 40% IT utilisation. What load does each UPS see? *(About 20% — 2N halves it by construction. Close to the worst part of the efficiency curve, permanently.)*

## Module 2 — The maintenance day is the design case

**The single idea:** ask why a hall is 2N and you are told "in case the UPS fails"; ask when the redundancy is *used* and the answer is "on a schedule, by a maintenance crew".

Concurrent maintainability — taking any single element out of service for planned work without dropping the critical load — is what most of the money in this layer is really buying, and it is the property the Uptime tier definitions are built around.

**What the arrangement removes.** Servicing a single unit means putting its load on static bypass: raw mains, no store, for a scheduled and repeated window. A system arrangement removes that window — in 2N by working one whole path while the other carries everything, in N+1 by taking one unit out while the spare covers, in a block-redundant scheme by letting the catcher hold the block. The exposure does not vanish; it moves from *every maintenance event* to *the rarer case where a second thing goes wrong during one*.

**The manual bypass and why it is a separate cabinet.** Beneath the automatic static bypass sits a manually operated wrap-around path, often in its own cabinet with a make-before-break interlock sequence, whose purpose is to let the UPS be completely de-energised and opened up. It is the difference between servicing a machine and replacing one — and the interlock sequence is written and executed by humans under pressure, which is the part that fails.

**What the module level changes.** A modular UPS moves the commonest maintenance action — replacing a failed power module — inside the machine, needing no bypass at all. Schneider markets this as a touch-safe live exchange on the Galaxy VXL; the Vertiv plan explains what has to be engineered into the slot for it to be true. It does not remove the need for a system arrangement (frames, breakers, batteries and boards still need work), but it converts the commonest event from a plant procedure into a technician's task — which is most of the practical difference between plants that get maintained and plants that do not.

**Self-check:** what is the honest question to ask instead of "how redundant should we be"? *(What do we need to be able to work on while the hall is live, and how often? A single-tenant training hall that can be scheduled down answers differently from a colocation floor with forty contracts.)*

## Module 3 — Between the UPS and the two cords

**The single idea:** redundancy bought upstream is delivered — or quietly lost — in the last twenty metres. At each element, ask whether A and B are still two things.

- **UPS output switchboard.** In N+1 this board is the common point everything shares; it is why unit-level N+1 and path-level 2N are different purchases.
- **PDU.** A floor-standing cabinet, often with its own transformer, breaking a feeder into branch circuits. Two PDUs fed from one board are two cabinets, not two paths.
- **Remote power panel.** Cheap to add and easy to add badly: a panel spliced into a feeder with no fresh coordination study.
- **Busway and tap-off boxes.** Reconfigurability is the product's virtue and its risk — a tap-off added after commissioning changes the coordination everyone assumed.
- **Static transfer switch.** Picks between A and B in milliseconds so a **single-corded** load can live in a dual-path hall. It solves that problem by *becoming* the point where A and B meet — fine for one appliance, a real exposure when one STS feeds many racks.
- **Rack PDU and whips.** Thousands of terminations proven once, at commissioning.
- **Dual-corded server supplies.** Where the whole arrangement finally pays off — provided each supply is on a genuinely different path and each can carry the machine alone. Two supplies each at half load on one path is common and worthless.

**The discipline that catches most errors:** trace both paths back from one server and find where they first touch. Whatever that element is, that is the true redundancy level of everything downstream of it, whatever the tier claim says.

**Self-check:** during scheduled work on the A path, one cabinet drops. Most likely cause? *(Both of that cabinet's cords were on A — a moved rack, a re-plugged whip, or a single-corded appliance. The maintenance window the 2N was bought for is exactly when it is found.)*

## Module 4 — One idea at four scales, and the battery that earns

**The single idea:** the same machine idea spans four orders of magnitude, and what changes with scale is mostly *who buys it*.

| Scale | What it is | What is genuinely different | How it is sold |
|---|---|---|---|
| **Desk / closet** — hundreds of VA to a few kVA | Single-phase box with a sealed battery inside | Usually line-interactive: the supply passes through while a transformer trims voltage, so the load sees a short break its own hold-up time rides | Retail and distribution; replaced, not serviced |
| **Rack / edge** — a few to tens of kVA | Rack-mount unit with internal or matching battery pack | Online conversion becomes normal; runtime is quoted per pack rather than designed | IT channel; the buyer is an IT manager |
| **Room** — tens to a few hundred kW | Three-phase floor-standing, increasingly modular | The battery leaves the cabinet and becomes a *room* with floor loading, ventilation and fire code | Project procurement; a specification and an or-equal clause exist |
| **Hall** — hundreds of kW to MW | Galaxy VXL: 500–1,250 kW per frame from 125 kW/3U modules, 1,042 kW/m², parallelable to ~5 MW | The machine is one element of a system; footprint density becomes a commercial argument because plant room displaces white space | Full construction procurement — the Vertiv plan walks the sequence |

Intrinsic across all four rows: a store, a converter, a bypass, and a decision about how much break the load can take. Purely scale: whether the battery is in the box or in a room, whether the buyer is a person or a specification. The commercial consequence is that the small end is a **channel** business and the large end a **project** business with a two-year cycle — which is why they are run as different divisions with different brands.

**The battery that earns.** A UPS battery spends its life at float, doing nothing and ageing anyway. Making it work — shaving the coincident peak, answering a demand-response call, holding frequency — requires a genuinely bidirectional front end, revenue-grade metering, export protection including anti-islanding, and a control layer that holds *and can prove* a **reserve floor** of state of charge no market signal may cross. The operator must accept that the store now cycles against warranty cycle life, that the honest autonomy figure becomes the reserve floor rather than the nameplate, and that a battery which discharges deliberately is a different fire-code conversation.

**What actually happens commercially:** operators buy a *separate* BESS instead. Vertiv sells DynaFlex (1.5–6 MW) and EnergyCore Grid (1 MW to 200+ MW) for these duties; Schneider sells the outcome as an energy-as-a-service microgrid. The reason is governance more than engineering — uptime and the energy bill are owned by different people, and separate assets keep the risks separate. The exception is the rack, where the BBU shelf is already on a DC bus and already absorbing load swings; the Narada plan covers what that does to the cell, the Vicor plan what it does to the converter.

**Self-check:** a UPS is made grid-interactive. What is the honest autonomy figure afterwards? *(The runtime available at the reserve floor — not the nameplate. And if the floor is only a configurable setting with no interlock or audit, the backup duty is protected by somebody's memory.)*

Developed by: LightAISolutions
