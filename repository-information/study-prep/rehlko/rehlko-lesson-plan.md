# Rehlko — Technology Lesson Plan

**Purpose:** teach the whole power room as one drawing — the single-line diagram, what a static UPS is made of, where the UPS ends and the engine begins, and the procurement question a broad catalogue forces. Starting from high-school STEM. No company trivia: founding dates, executives and share counts stay in the dossier. Generated 2026-09-04 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → Rehlko → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** Three gen-set plans now exist and none of them teaches the UPS. Caterpillar covers the machine and the ten-second race; Cummins covers the purchase — datasheet, sizing, emissions class; Rolls-Royce covers the battery beside the engine and the two regulatory worlds. This plan is the one that goes *upstream of the engine and downstream of it at the same time*: the drawing everything sits on, the uninterruptible supply that the corpus has been thinnest on, and the switchgear that makes a yard of engines into a plant. It is deliberately the UPS-heavy plan.

**Suggested pacing:** Module 1 in one sitting (~25 min — get a real single-line diagram in front of you if you can). Module 2 across two sittings (~50 min — the four blocks and eco-mode repay slow reading). Module 3 in one sitting (~30 min — do the timeline arithmetic on paper). Module 4 in one sitting (~30 min). Module 5 last (~30 min). Then the flashcard and self-test passes in the app.

## Module 1 — The power room on one page

**The single idea:** every argument about data-center resilience is, underneath, an argument about one drawing.

A **single-line diagram** shows the whole electrical path as single lines rather than individual conductors. The path, in order: the utility service arrives at medium voltage into a switchgear lineup; transformers step it down for distribution; on the way, transfer switches or paralleling gear decide whether the source is the utility or the generator plant; downstream of that the UPS takes the critical branch; below it sit the PDUs, the busway and the rack whips. Mechanical plant — chillers, pumps, air handlers — hangs off the same generator-backed bus but usually *not* off the UPS, which is why a hall can survive a transfer while its cooling briefly does not.

**Three questions answer most of it.**

1. Where does the drawing branch into A and B feeds — and **where do those branches meet again upstream**? Two feeds sharing a transformer, a switchboard or an earthing point are not two feeds.
2. Which loads are on the UPS and which are only on the generator?
3. On a maintenance day, can each piece be taken out of service with the load still protected? That property is **concurrent maintainability**, and it is the difference between the Uptime tier levels people quote at each other.

**Why one vendor's scope matters here.** The seams on this drawing — generator to switchgear, switchgear to transfer switch, transfer switch to UPS — are where specifications get written by different companies and where commissioning surprises live. A supplier whose scope covers several boxes is selling the elimination of a seam. That is a genuine product even though nothing on a datasheet describes it, and it is the whole of Rehlko's positioning.

**Self-check:** a hall advertises 2N power; both paths trace back to one service transformer. Is the claim correct? *(No — redundancy that meets upstream is a common-mode failure the label conceals.)*

## Module 2 — Inside a static UPS

**The single idea:** four blocks, and almost every specification argument is about one of them.

1. **The rectifier** converts incoming AC to DC. Modern units switch with IGBTs rather than passive diodes, so the UPS draws a near-sinusoidal current at close to unity power factor instead of dumping harmonics back into the building — which matters when the upstream source is a generator rather than a stiff utility, because an alternator heats up on distorted current.
2. **The DC link** is the internal DC bus, and the battery (or flywheel, or supercapacitor) connects *here*. This is the most important architectural fact about double conversion: the store is permanently connected, so when the input fails there is **no transfer and no gap** — energy simply stops arriving from one side and starts arriving from the other.
3. **The inverter** rebuilds a clean AC waveform from the DC link. Because the load is always fed from the inverter and never directly from the mains, the output is isolated from sags, surges, frequency wander and distortion. That is what **double conversion** means and why it is the data-center default.
4. **The static bypass** is a solid-state switch that can connect the load to raw mains in about a quarter of a cycle. It exists for two events: a fault current larger than the inverter's semiconductors can supply (a downstream breaker must be given enough current to trip), and an internal UPS failure. **Bypass is the UPS's confession that it cannot help** — and a load on bypass has no protection at all, which is exactly the state a monthly maintenance window creates.

**Eco-mode, honestly.** Double conversion costs a few percent, continuously, forever. Eco-mode runs the load on the bypass path in normal conditions and jumps to the inverter on a disturbance, recovering most of that. The debate is entirely about *detection*: for a clean total loss the transfer is comfortably inside a server's hold-up time; for an ambiguous disturbance — a slow sag, a distorted waveform, a fault that clears itself — detection takes longer and the margin narrows. Modern implementations are much better than the topology's reputation. The honest position is that eco-mode trades a small, quantified reliability margin for a large, certain energy saving.

**The vocabulary that makes vendor sheets legible.** IEC 62040-3 classifies topologies as **VFI** (output independent of input voltage and frequency — double conversion), **VI** (voltage independent — line-interactive) and **VFD** (voltage and frequency dependent — offline). A data center specifies VFI, and "VFI" on a datasheet is the compact way of asserting everything above.

**Self-check:** a load dropped during a scheduled UPS maintenance window. Most likely explanation? *(It was on static bypass — raw mains, no protection — when a disturbance arrived.)*

## Module 3 — Three clocks on one bus, and sizing

**The single idea:** four different time constants get quoted in the same conversation and mean different things; confusing them creates a gap nobody budgeted for.

| Term | Whose property | Order of magnitude | What it decides |
|---|---|---|---|
| **Hold-up time** | The server's own power supply | 10–20 ms | How long the IT load coasts on its capacitors with no supply. The hard deadline everything upstream designs around |
| **Ride-through** | The UPS, and increasingly the facility | Cycles to seconds | Whether a disturbance is absorbed rather than escalated. Free in double conversion; a detection budget in eco-mode |
| **Autonomy** | The UPS battery or flywheel | Seconds (flywheel) to minutes (battery) | How long the critical load is held with no generator — the budget the whole start-and-load sequence must fit inside |
| **Transfer time** | The ATS and generator plant | Up to ~10 s for the standard emergency class | Loss of supply to load on the engine. NFPA 110 classes systems by exactly this |

**The design relationship in one sentence: autonomy must exceed transfer time with enough margin to survive a failed start and a restart attempt.** Five minutes against ten seconds looks generous until the first engine fails, the sequence times out, the second is called, and the mechanical plant is restored in stages behind it — each restoration another block load on running machines.

**Three sizing numbers people get wrong.**

- **kVA is not kW.** kW = kVA × power factor. Historically the kW rating was 0.8 or 0.9 of kVA; modern IT loads run near unity so most current units are rated 1.0. Comparing a unity-rated unit with a 0.9-rated one on kVA mis-sizes the plant by ten percent or more. Always compare kW.
- **Autonomy is a battery decision, and batteries are the maintenance liability.** VRLA strings are cheap with a service life of a few years; lithium costs more, lasts longer, weighs far less, tolerates warmth and reports its own state of health — which is why it has taken over new builds. A flywheel stores seconds rather than minutes, has no chemistry to age, and is entirely adequate when the generator start sequence is trusted and entirely inadequate when it is not.
- **Redundancy is bought at a level, and the level must be named.** N+1 of *modules* inside one frame, of *frames* inside one system, or of *whole systems* on independent A and B paths are three different amounts of money surviving three different failures.

**And the part-load trap.** A UPS is most efficient near its design load. A plant sized for a hall's eventual capacity and running at a quarter of it — which is every new hall for its first year or two — sits well down its efficiency curve, and redundancy pushes it further down by construction, because a spare unit's purpose is to be under-used. It shows up in PUE, and it is the real argument behind both modular architectures and eco-mode.

**Monolithic or modular.** Monolithic gives the lowest cost per kilowatt and the highest efficiency at the design point, with fewer parts and a simpler drawing — at the price of repair measured in hours with the load on bypass, capacity bought in large indivisible steps, and one unit being a large share of the block. Modular collapses repair time to minutes without dropping the load and lets capacity and redundancy be bought a module at a time — at the price of cost per kilowatt, control complexity, more connectors, and a hot-swap promise that depends on disciplined procedure. In practice modular has taken the incremental and colocation build where capacity arrives with tenants; monolithic holds where a single owner builds a full block at once. **Both are correct answers to different financing structures**, which is a more useful way to hear the argument than as a technical one.

## Module 4 — Paralleling switchgear, and gas for continuous duty

**The single idea:** individual generators do not add up to a generating plant; the thing that makes them one is a lineup of switchgear and a hand-written control sequence — and that sequence, not the engines, is where most multi-megawatt plants actually fail.

**What it does.** Starts the machines on a signal and watches each reach speed and voltage. Synchronization-checks each set against the bus — voltage, frequency, phase angle and rotation all matched — before closing its breaker, because closing out of phase can wreck a crankshaft. Shares load in proportion to rating. Sheds load in priority order if the plant is short of capacity, and restores it in priority order as capacity arrives. Manages the return to utility as an open or closed transition depending on what the utility has permitted.

**Load shedding is the underestimated part.** During a start sequence, capacity arrives in steps while the load is already present. Something must decide, in order, what gets dropped and what comes back — critical distribution first, then chillers, then air handlers, then everything else, and each restoration is another block load the running machines must absorb. The priority table is site-specific, written by hand, and **ages badly**: a hall re-tenanted or re-cooled since the table was written will shed the wrong things.

**Why it is a genuine seam.** The switchgear must agree with each engine's governor and AVR about droop settings, with the protection relays about coordination, and with the building-management system about what an emergency looks like. When engines and switchgear come from one supplier, that agreement is the supplier's problem. When they do not, it is the commissioning agent's — and it is why commissioning a paralleled plant is measured in weeks. Commercially: switchgear looks like a commodity enclosure and is in fact a software product with a long service tail.

**Gas for continuous duty — a different machine for a different job.** A lean-burn gas engine burns a carefully controlled fuel–air mixture, so a sudden step means getting fuel and air right before the energy is released; its step-load acceptance is a fraction of a comparable diesel's, which disqualifies it from catching a falling hall. But once a machine runs thousands of hours a year rather than tens, **fuel cost dominates capital cost and the arithmetic inverts** — gas arrives by pipeline continuously rather than by truck into tanks that degrade. Add cogeneration, where jacket water and exhaust heat are recovered for process heat, hot water or an absorption chiller, and combined efficiency goes far above either output alone. And note the regulatory line: a machine that runs continuously is not an emergency generator in any regulatory sense — it needs an air permit written for continuous operation, Tier 4-equivalent controls, and it counts fully toward whether the site is a major source. **The permit, not the equipment, usually sets a bridge-power project's schedule.**

**Self-check:** why can a lean-burn gas engine not replace a standby diesel in the backup role, and what makes it the right machine for bridge power? *(It cannot swallow a large step; but over thousands of running hours fuel cost dominates and pipeline gas beats a degrading tank farm.)*

## Module 5 — One vendor or best-of-breed, and where this catalogue sits

**The single idea:** a supplier that can quote generation, transfer, UPS and switchgear is proposing something structurally different from one that quotes the best box in a category — and the decision belongs to the buyer's engineering capacity, not to the equipment.

**Single-source** puts the seams inside one company: control-sequence disagreements between engine, switchgear and transfer become a warranty matter rather than a dispute; one commissioning programme, one service agreement, one number to call during an event; and materially less engineering effort on the owner's side. The costs are real: price leverage is lost once the architecture is committed, so later phases of a campus are captive; the buyer inherits the supplier's *weakest* category, and very few vendors are best in class at engines, UPS and switchgear simultaneously; and a supplier that de-prioritises a product line strands part of the installed base.

**Best-of-breed** gives each box on its merits, keeps every category competitively tendered across phases, avoids architectural lock-in, and contains a supplier failure to one layer. The costs: the owner owns every seam — and the seams are where paralleled plants fail; commissioning is longer; and during an incident, responsibility is genuinely ambiguous until someone proves where the fault was.

**The pattern worth recognising:** hyperscalers, who employ large in-house power-engineering teams and build the same design dozens of times, overwhelmingly buy best-of-breed and own the seams deliberately — the repetition amortises the engineering. Enterprise and smaller colocation buyers, who build once and staff thinly, are the natural market for a single-source power room. Vendors position themselves against exactly this split.

**Where Rehlko's catalogue sits on the drawing.** It reaches *up* into medium-voltage metal-clad paralleling switchgear (PD-4000 to 15 kV) — a row very few gen-set OEMs carry at all — and *across* into a three-phase static UPS, which none of the other three gen-set OEMs manufactures. It stops short of the row the others have crossed: there is no Rehlko-manufactured battery storage. Heila is microgrid control software; Clarke Energy integrates third-party batteries as an EPC; the UPS resells nickel-zinc cells. Meanwhile the gas prime-power route runs through Clarke Energy's INNIO Jenbacher distributorship rather than through engines Rehlko builds, and the KD Series engines above 700 kW are built by Liebherr at Colmar.

**Read that as a shape, not a scorecard.** Cummins fills the generation side almost completely and stops at the UPS. Rolls-Royce fills the widest span but with a *rotary* UPS and no standalone switchgear line. Rehlko crosses into the static UPS and medium-voltage switchgear and has no battery. Three vendors, three different places to draw the line — and where each line falls is a better guide to what each is really selling than any product datasheet.

**Self-check:** a colocation operator wants to add UPS capacity in 250 kW steps as tenants arrive, and employs no power engineers. Which two decisions does that determine? *(Modular rather than monolithic UPS; and a bias toward single-source scope, because there is nobody in-house to own the seams.)*

Developed by: LightAISolutions
