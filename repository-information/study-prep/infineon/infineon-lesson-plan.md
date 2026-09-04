# Infineon Technologies — Technology Lesson Plan

**Subject:** the power switch itself — what a MOSFET, an IGBT, a SiC MOSFET and a GaN transistor actually are, why the choice between them falls out of three numbers rather than a preference, where the watts physically go between the room and the die, and why a converter is being pushed under the processor.

**Baseline assumed:** high-school STEM. Ohm's law, power as voltage times current, current through resistance makes heat, and the idea that a magnetic field stores energy. Nothing else.

**What this plan deliberately does NOT repeat.** The corpus already teaches the rack power chain from four angles, and repeating any of them would waste the reader's time:

- **Vicor's guide** already teaches why the voltage climbs (I²R), the 48-volt bus and the 60-volt SELV line, the 800 → 48 → one-volt stage list, the last centimetre and the power delivery network, and lateral against vertical layout as a **geometry** argument. This plan starts one level below all of it, at the transistor, and returns to vertical delivery only from the **package and thermal** side, which Vicor's guide does not cover.
- **Megmeet's and Zhonhen's guides** already teach the legacy AC chain, the Chinese 240/336 V precedent and what each new box replaces. This plan does not re-argue why 800; it asks what 800 does to the **device selection**, which is a different question with a different answer.
- **Delta's guide** already teaches switch-mode conversion in principle and the design-and-build supply chain. This plan's manufacturing module is about **fab and wafer** economics, not assembly economics.
- **LITEON's guide** already teaches server supplies, redundancy, hot-swap, the SMT line and design-win economics. This plan touches design-win only as a **timing** fact — that revenue was decided years ago — not as a business model.

---

## Module 1 — What a power switch is, and the compromise inside it (60 min)

**Concepts:** chopping vs dividing; the drift region; breakdown voltage against on-resistance; avalanche.

1. **Why converters chop.** Establish the core intuition first: a fully-on switch has almost no voltage across it, a fully-off switch has almost no current through it, and power is the product. Both steady states are nearly free. Everything that follows is about the imperfections of those two states and the journey between them.
2. **The drift region is the whole design.** The lightly-doped layer that holds off the voltage when the device is off is the same layer the current crosses when it is on. Twice the voltage needs roughly twice the thickness, and doping must fall as thickness rises, so resistance grows with the voltage rating raised to a power between two and two and a half in plain silicon. **Derive this qualitatively rather than stating it** — the reader should be able to explain why a 1200 V silicon MOSFET is a bad device without being told.
3. **On-resistance is a temperature statement.** Quoted at 25 °C, typically half again higher hot. Work the loop: more loss → hotter → more resistance → more loss. This is the mechanism behind the first failure mode in Module 7.
4. **The rating is not an operating point.** Bus voltage plus switching overshoot, derated to 70–80%. Beyond it the device avalanches — conducts anyway and absorbs the energy.

**Check for understanding:** given two datasheets at the same current rating but different voltage classes, say which will have the higher on-resistance and why, without looking at the number.

---

## Module 2 — The two losses, and why anyone wants to switch faster (45 min)

**Concepts:** conduction loss; switching loss; body diode and reverse recovery; tail current; the frequency-versus-magnetics trade; soft switching.

1. **Conduction loss** — current squared times resistance for a MOSFET, current times a fixed drop for an IGBT. Draw the two curves crossing. That crossing is the whole reason both technologies exist.
2. **Switching loss** — the overlap of falling voltage and rising current, paid per event, proportional to frequency.
3. **Two device-specific taxes.** Reverse recovery (a MOSFET's body diode must be swept clear, at full bus voltage) and tail current (an IGBT's stored charge drains for microseconds while the bus voltage is already across it). These are not details; they are why materials matter.
4. **The counter-intuitive question, and the module's payoff:** if switching costs energy, why switch faster? Because magnetics shrink almost in proportion to frequency, and in a data centre the binding constraint is watts per litre. **Every power-semiconductor product is a bid to move the crossover point** where switching loss overtakes what the smaller magnetics saved.
5. Two ways to move it: a better figure of merit (device physics), or arranging the circuit so the device switches at near-zero voltage (soft switching, the LLC converter).

**Check for understanding:** a designer doubles frequency and the transformer halves. Name what went up, what stayed the same, and what has to be true for the trade to be worth taking.

---

## Module 3 — Four switches on one table (60 min)

**Concepts:** unipolar vs bipolar conduction; wide bandgap; superjunction; the voltage-class gate.

1. Build the comparison **from Module 1's compromise** rather than as a list of features. Silicon MOSFET (unipolar, resistive, cheap, runs out around 900 V even with superjunction). IGBT (bipolar, fixed drop, huge current, slow because of the tail). SiC (wide bandgap, ten times the field, a tenth the drift thickness, three times silicon's thermal conductivity, expensive because of the crystal). GaN (lateral, on silicon wafers, the lowest switching charge, no body diode, and a voltage ceiling).
2. **The one insight to land:** GaN is the fastest and yet the 800 V architecture leans on SiC, because **speed does not help a device that cannot block the bus.** Voltage class is a gate you pass before frequency is even an argument.
3. Superjunction as the reason silicon has not been displaced below 900 V — buried columns of opposite doping let the drift layer be doped harder without losing the rating.

**Reading skill to drill:** given a converter's bus voltage and target frequency, narrow the device technology to one or two candidates before opening any catalogue.

---

## Module 4 — What 800 volts does to the semiconductor (45 min)

**Concepts:** derating arithmetic; DC arc and the solid-state circuit breaker; the ±400 V arrangement; cosmic-ray-induced failure.

1. **Derating arithmetic first.** 800 V bus + overshoot + regulation tolerance, then 70–80% of rating → the 1200 V class. Silicon is out on economics, not on principle. Make the reader do the sum.
2. **Protection cannot be inherited.** No zero crossing on DC, so an arc sustains. The answer is a transistor that turns off in microseconds, not contacts that part in milliseconds — and it must carry full current at low resistance, which is another argument landing on wide-bandgap material.
3. **±400 V about a mid-point** — halves the conductor-to-earth voltage while keeping 800 V between rails, and changes what earth-fault detection has to look for.
4. **The failure mode with no cause you can point at.** A cosmic-ray particle striking a device holding off a large voltage can destroy it; the rate climbs steeply with applied voltage. This is why derating at high voltage is argued in reliability terms, and it is the honest answer to "why not run the 1200 V part at 1000 V?"

**Check for understanding:** state the three distinct engineering consequences of moving a rack bus from 48 V to 800 V, and say which one is a device problem, which is a protection problem, and which is a reliability problem.

---

## Module 5 — Where the watts go, room to chip (45 min)

**Concepts:** compounding efficiency; loss versus current; the deleted stage.

1. Multiply the chain down. Five stages at 97% delivers 86%. The missing 14% is heat in specific components that cooling must then remove and the utility has already billed for.
2. **Rank the stages and explain the ranking:** the final conversion to about one volt and the network between it and the die are the worst, because loss scales with current and current is highest where voltage is lowest.
3. **The cheapest efficiency improvement is a deleted stage** — it wastes nothing and occupies nothing. The price is that the survivor spans a wider ratio and inherits the deleted stage's protective duty. Connect this forward to Module 7's most expensive failure.

**Check for understanding:** given a five-stage chain, say where you would spend an engineering budget and why — and then say what a sixth option (deleting a stage) would cost.

---

## Module 6 — Why a converter ends up under the processor (45 min)

**Concepts:** thermal orphan; height budget; loop inductance; serviceability by design.

1. **Do not re-teach the geometry** — the reader has it from the Vicor guide. Open by naming that and move straight to what the move demands of the part.
2. **Four constraints, all properties of the package rather than the die:** no cooling path on the underside (efficiency becomes a mechanical-feasibility argument), almost no height (so the product becomes an assembly, not a transistor), a very low-inductance loop (or the device destroys itself on overshoot), and no service access (so failure rate must be argued, which pushes toward integration).
3. **The generalisable pattern:** when a converter moves, the constraint moves from efficiency to density to thermal path to package. Each move makes the semiconductor vendor's product larger and less like a transistor — which is the commercial reason every power-semiconductor company is buying packaging and gate-driver capability.

---

## Module 7 — Where it fails (45 min)

Drawn from the corpus failure map rows 9–11, written at device level, each with the owner named: a rating read as an operating point; overshoot eating the derating margin; dead time set by copying; paralleled devices that do not share; a DC bus protected as though it were AC; a stage deleted without its fault duty re-homed; and the statistical high-voltage failure.

**The one to spend most time on** is the deleted stage, because it is the only architectural failure on the list — found in commissioning or later, fixed by redesign rather than by a part change.

---

## Module 8 — The business the physics produces (45 min)

**Concepts:** wafer-dominated cost; crystal growth and defect density; the wafer-diameter transition; two clocks.

1. **Power devices are not processors.** Features are coarse; cost is dominated by the wafer and by how many good die come off it — most extremely in SiC, where crystals grow from vapour over days and defects kill die.
2. Two levers: bigger crystals and cleaner ones. This is why 150 mm → 200 mm is a headline event and not a process detail — about 1.7× the area for broadly similar handling cost per wafer.
3. GaN's structural contrast: grown on ordinary silicon wafers, so it rides existing fab depreciation. Its constraint is the voltage ceiling, not the cost curve.
4. **Two clocks, and the reading skill they produce.** A fab is a three-to-five-year decision; a design win is two-to-three-year revenue. A weak quarter and a capacity announcement on the same day are not contradictory — they are reports from different clocks. Ask which end market each refers to, and whether the design wins that would fill the capacity have been named.

---

## Suggested pacing

Six hours total. Modules 1–3 in one sitting (the physics has to land together). Module 4 and 5 in a second. Modules 6–8 in a third — 6 and 8 are the two that a reader with a commercial rather than an engineering interest will use most.

Developed by: LightAISolutions
