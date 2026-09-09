# CALB — Technology Lesson Plan

**Subject:** the prismatic lithium-iron-phosphate storage cell — what it has to do, why it has grown enormous, how it is stopped from burning its neighbours, and why the same factory can be strong in one market and ordinary in another.
**Assumed starting point:** high-school STEM. The Albemarle plan covers the cathode raw material and the NOVONIX plan the anode; this one starts at the finished cell and works outward to the container and the market. None depends on the others.
**What this is not:** a company crib sheet.

**Suggested pacing.** Seven modules. Modules 1–4 are the cell itself and hold together as one sitting of about ninety minutes. Modules 5–7 are systems, durability and market structure, and are the more transferable half.

**The one sentence to hold onto:** in cars you sell energy per kilogram; in grid storage you sell energy per dollar, and the kilograms barely matter.

---

## Module 1 — Two duty cycles, one chemistry

**Concepts:** intercalation · gravimetric and volumetric energy density · LFP against NMC.

Open with the asymmetry. A car battery and a grid battery are both lithium-ion and both work by intercalation, but they are optimised against opposite constraints.

A vehicle must carry its battery, so the figure of merit is watt-hours per kilogram, and it needs burst power for acceleration. A grid battery sits on a pad and never moves, so weight is nearly free; what it must do is cycle once or twice a day for twenty years at the lowest cost per unit of energy delivered.

**The consequence to install:** that reversal is why LFP took grid storage almost completely while nickel chemistries held on longer in vehicles. LFP stores less per kilogram but is cheaper, cobalt- and nickel-free, tolerates more cycles and is thermally more stable. On a concrete pad those trade-offs are not arguable.

**Exercise:** give the learner three datasheets — an eVTOL cell at 360 Wh/kg, a storage cell at 440 Wh/L, and a container at 424 kWh/m². Ask which buyer each was written for, and why none of the three quotes the others' unit.

---

## Module 2 — Why cells got enormous

**Concepts:** ampere-hour against watt-hour · fixed overhead per cell · the 280→314→587→684 Ah progression.

Establish the unit first: an amp-hour measures charge, not energy. Multiply by voltage — about 3.2 V for LFP — to get watt-hours. A 314Ah cell is roughly 1.0 kWh.

Then the real question: why not use more small cells? Because every cell carries fixed overhead that does not shrink with it — a case, two terminals, a vent, a safety device, welds, a module slot, busbar connections and a BMS channel. Doubling capacity roughly halves the count of all of them per megawatt-hour.

Have the learner trace the gains: fewer welds, fewer failure points, less inactive mass, less assembly labour, more energy in the same 20-foot box. This is why moving a container from 5 MWh to 6.25 MWh is an economic event, not a product refresh.

**Then the counterweight:** heat generated at the centre of a large cell has further to travel to a surface, electrode sheets get longer so coating defects have more chances to appear, and a failure releases more energy in one place.

**The detail that shows how tight this market is:** CALB, Ganfeng and REPT push 588Ah; Great Power and CATL push 587Ah. One amp-hour is not physics — it is two groups optimising against slightly different system constraints and then differentiating on the label.

---

## Module 3 — Stacking and winding

**Concepts:** electrode assembly · volume utilisation · internal resistance · yield.

Two ways to arrange electrodes and separator inside a prismatic case. Winding rolls one continuous sheet into a flattened coil: fast, cheap, mature, high-yield, but the tight bends at each end are mechanically stressed and thermally awkward and waste case volume. Stacking cuts sheets and lays them flat: better volume utilisation, lower and more uniform internal resistance, no stressed bends, and it scales better to very large formats — but it is slower and needs new equipment.

**The reading rule to install:** neither is better. A maker's choice tells you which constraint binds on it. CALB calls its 684Ah a stacked cell; Great Power chose winding for its 587Ah line and said so in terms, citing yield, cost control and line speed. A company with capital to deploy buys stacking lines; one protecting its balance sheet extends the winding lines it already owns.

---

## Module 4 — Thermal runaway, and the thing that actually matters

**Concepts:** thermal runaway · thermal propagation · aerogel · thermo-electric separation · nail penetration · UL 9540A.

Runaway first: above roughly 130–200 °C the electrolyte and electrode materials begin reacting exothermically, the heat accelerates the reaction, and the process becomes self-sustaining. It cannot be stopped, only contained.

**Then the distinction that governs all the engineering:** one cell venting is a contained industrial incident. Propagation to neighbours and across containers is a fire that destroys a substation. The design target is the heat path between cells, not the failure itself.

Two mechanisms to teach properly. Thermo-electric separation routes electrical connections and the hot-gas venting path away from each other, so a venting cell does not use its own busbars as a bridge to its neighbours. Aerogel — a solid so porous it is among the best insulators known — breaks the conductive path.

**How it is proved:** nail penetration forces an internal short in one cell. UL 9540A does it at system scale, with the doors closed and suppression disabled, and asks only whether the fire spreads.

**Worked example.** In a UL 9540A:2026 test on a competitor's 5 MWh container, certified by TÜV Rheinland and published 8 September 2026, the initiating unit burned sixteen hours and self-extinguished, adjacent cells stayed below 70 °C, and no adjacent container ignited. Ask the learner why that result, and not any datasheet number, is what a project financier reads.

---

## Module 5 — From cell to container

**Concepts:** cell, module, rack, container · liquid cooling · areal energy density.

Nobody buys cells. They buy a factory-assembled box, and each level up adds function and inactive mass.

Walk the four levels: the cell holds the energy; the module clamps cells together with thermal barriers, sensing and a cold plate; the rack stacks modules to system voltage with fusing and a BMS; the container adds cooling, fire detection and suppression, and environmental sealing, and is the unit that ships and is warranted.

**The detail worth pausing on:** container specifications quote kWh per square metre, not per kilogram. That single choice of unit tells you the buyer is optimising land and footprint. Send the learner back to Module 1 to see the same principle from the other end.

---

## Module 6 — Reading durability claims

**Concepts:** cycle life qualifiers · prelithiation · calendar life.

Three claims, three ways to be misled.

**Cycle life.** A count is meaningless without an end-of-life threshold, a depth of discharge, and a temperature and rate. The same cell honestly rated at 15,000 shallow cycles at 25 °C may deliver a third of that cycled deeply, hot and fast. Have the learner compute: 15,000 cycles at one a day is forty-one years, against a container designed for twenty — so the cell is not the life-limiting component.

**Zero degradation.** Taken literally this is impossible; every cycle consumes lithium into the growing interface layer. The mechanism is prelithiation — extra lithium loaded at manufacture specifically to be consumed. Capacity holds flat while the reserve lasts, then declines normally. A real achievement, and not an absence of ageing.

**Calendar life.** Degradation with time regardless of cycling, driven by temperature and by resting at high state of charge. A battery sitting fully charged in a hot climate ages on days it does nothing — which makes the container's cooling a life-extension system, not only a safety system.

**The rule to install:** to what threshold, at what depth, at what temperature. If the datasheet does not say, the number is marketing.

---

## Module 7 — Two markets, and why research houses disagree

**Concepts:** shipments against installations · market definition · scope.

Close on market structure, because it is where most misreading happens.

**Two markets.** EV traction is decided by an OEM engineering team, model by model, on multi-year qualification, with very high switching costs, and is measured in installed volume — energy in vehicles actually sold. Grid storage is decided project by project, largely on price and bankability, with low switching costs, and is measured in shipments — energy leaving the factory. The two metrics are different quantities; installations lag shipments and exclude inventory. **Conflating them is the most common error made about Chinese battery makers.**

**Then the denominator problem.** For the same half-year, the stated size of the global storage-cell market runs from 461.3 GWh (SNE) to 467.8 (InfoLink) to 490 (Benchmark) to 507.8 (ICC) — a 10% spread, with growth rates diverging further because the houses disagree about the prior-year base more than the current period.

The causes are definitional: shipped, invoiced or installed; captive cells in or out; residential and telecom in or out; global, China-only or utility-scale-only. Those choices move ranks by several places. One company in this market is ranked fifth by three houses, sixth by a fourth, seventh by a fifth, fourth on one house's utility-scale-only cut, and left out of a sixth house's top ten altogether — on a market that house sizes 6% larger.

**The transferable rule:** a market-share number is a claim about a definition as much as about a company. Before comparing two ranks, check they measure the same thing over the same scope in the same period. And when a company quotes a rank without naming the house — as CALB's own results do in claiming fourth place globally — you cannot check it, so you should not repeat it.

---

*Sources for every factual claim above are the citations in `live-site-pages/profiler-data/calb.profile.json`. The in-app rendering of this curriculum is `calb.study.json`.*

Developed by: LightAISolutions
