# Powell Industries — Technology Lesson Plan

**Subject:** the medium-voltage room — what a switchgear lineup is, what arc flash is and why arc-resistant construction exists, how a protection study is actually built, and how a power room gets bought as a product rather than built as a job.

**Baseline assumed:** high-school STEM. Ohm's law, power as voltage times current, and the idea that current through resistance makes heat. Nothing else.

**What this plan deliberately does NOT repeat.** The corpus already teaches a great deal of adjacent material, and repeating it would waste the reader's time:

- **ABB's guide** already teaches *why a campus keeps a medium-voltage tier* (current, and copper), *how a breaker interrupts an arc* (arc chutes, vacuum interrupters, SF6, solid-state), and *what a protection relay is* as a device. This plan starts one level out from the breaker — at the assembly the breaker lives inside — and one level in from the relay — at the study that produces its settings.
- **Eaton's guide** already teaches *selective coordination* as an idea: one fault should trip one breaker. This plan teaches the **deliverable** that makes the idea real, and the property nobody mentions — that it is true only for the one-line it was drawn against.
- **Rehlko's guide** already teaches *paralleling switchgear* as a product and single-line-diagram literacy. This plan covers the utility-service side of the same drawing, which Rehlko's does not: bus topology, the tie breaker, and what each source must be rated for.
- **Hitachi Energy's and GE Vernova's guides** already teach why grid-equipment factories cannot scale. This plan does not re-argue that; it deals with the buyer-side clock instead — the approval-drawing cycle.
- **Schneider's guide** covers prefabricated modular data centres as buildings. This plan's e-house section is narrower and different: it is about **factory acceptance testing** — what can be proven in a shop and what cannot.

---

## Module 1 — What a lineup actually is (60 min)

**Concepts:** assembly vs device; compartmentalisation; metal-clad against metal-enclosed; draw-out mechanics; the three ratings.

1. **The object.** A row of steel sections sharing one horizontal main bus. Each section is a cell; each cell is subdivided by grounded steel barriers into breaker, cable/bus, main-bus and low-voltage instrument compartments. Establish early: *the barriers are the design.* They are what stops a fault in one compartment becoming a fault in all of them.
2. **Metal-clad is a defined term.** IEEE C37.20.2 reserves it for draw-out breakers, grounded barriers between every major part, insulated primary bus, and automatic shutters over the live stabs. Metal-*enclosed* is looser. Teach the reader to ask which one a quote is for, because on a drawing they look alike and during maintenance they do not behave alike.
3. **The three positions.** Connected, test, disconnected. Work the reader through *why* test position exists — control power live, main contacts isolated — because it is the reason a breaker's logic can be proven without energising anything.
4. **The three ratings and what each one buys.** Voltage class sets insulation and clearances. Continuous current sets copper and heat. Withstand rating sets bracing — and here derive the key intuition: magnetic force between parallel conductors goes with **current squared**, so raising a fault rating is a structural redesign, not a paperwork change.

**Check for understanding:** given a spec that names a voltage class and a continuous current but no withstand rating, say what has not yet been specified and why it costs money to change later.

---

## Module 2 — The one-line above the switchgear (45 min)

**Concepts:** radial vs main-tie-main; normally-open tie; source sizing; how a tie changes fault duty.

1. Draw a radial one-line. Name every single point of failure on it. Establish that radial is not a mistake — it is correct below the point where redundancy is provided by duplication.
2. Draw main-tie-main. Walk the tie closing. Then land the sentence the whole module exists for: **each source must be rated for the entire load, because after the tie closes it is carrying all of it.**
3. The consequence nobody expects: closing the tie changes the available fault current on the surviving half, so the coordination study must be correct in **both** configurations.
4. Closed-transition tie schemes briefly parallel two utility sources — which the utility may not permit and which raises fault duty further.

**Reading skill to drill:** on any one-line, find the tie, ask whether it is normally open or closed, then ask what each source is rated for. Two incoming lines are not evidence of redundancy until those questions are answered.

---

## Module 3 — Arc flash and why arc-resistant construction exists (90 min)

This is the module that earns the plan. Nothing in the corpus teaches it.

1. **An arcing fault is not a short circuit.** Bolted short: current through metal, protection sees it, clears it. Arcing fault: current jumps a gap, air becomes plasma at roughly 20,000°C, copper vaporises and expands thousands-fold. It is simultaneously a thermal burn, a pressure blast, a shrapnel launcher and an acoustic injury — and it is *harder* for a relay to see, because arc current is lower and unstable.
2. **Incident energy** in cal/cm², calculated per IEEE 1584. Inputs: available fault current, conductor gap, enclosure geometry, and **clearing time**. Spend time here: clearing time is the only term an engineer readily controls, and it enters roughly linearly. Halve the time, roughly halve the energy.
3. **Three different answers, and they are not substitutes.**
   - *Procedural* — NFPA 70E: justify energised work, assess risk, label the gear, wear clothing rated above the number.
   - *Settings* — a maintenance-mode function making upstream protection temporarily faster and deliberately less selective while someone is at the door.
   - *Equipment* — arc-resistant construction to IEEE C37.20.7.
4. **What arc-resistant construction does and does not do.** It does not stop the arc. It is type-tested with an arc deliberately initiated inside the cell, proving pressure and hot gas vent away from the operator. Grades by which sides are protected and — critically — whether protection holds **with a low-voltage instrument door open**, which is the state a technician is most often in.
5. **The commercial reading.** The buyer is not purchasing a lower probability of a fault; they are purchasing a much better outcome conditional on one. That trade is easy where equipment is operated by people, which is exactly a campus energising halls for years while the first ones run.

---

## Module 4 — How a protection study is actually built (75 min)

**Three studies in a fixed order, each feeding the next.**

1. **Short-circuit study.** Model every source that can push current into a fault — including motors, which briefly act as generators as they spin down. Output: available fault current at every bus. This is the number every breaker's interrupting rating and every assembly's withstand rating must exceed.
2. **Coordination study.** Plot the series devices' time-current curves on one log-log sheet. CT ratios are part of the model — a relay only sees what its CT gives it. Output: relay and trip-unit settings with roughly a 0.2–0.3 s margin between tiers, which covers breaker operating time, relay overtravel and measurement error. Note the trap: curves converge at high fault current, so a scheme that coordinates at moderate currents can lose selectivity exactly when it matters.
3. **Arc-flash study.** Takes fault current from stage 1 and clearing time from stage 2. Output: incident energy, the boundary, and the printed label on the door.
4. **The property that matters most.** The study is true only for the one-line it was built against. Add a tap, energise a hall, close a normally-open tie, swap a transformer for a lower-impedance one — nothing alarms, and the settings now describe a different plant. On a phased campus the study is not finished at first energisation, and whoever owns the re-study should be named in a contract rather than assumed.

---

## Module 5 — Buying the room instead of building it (45 min)

1. **What an e-house is.** The power room built and wired in a factory, shipped as a walk-in enclosure.
2. **What actually moves: labour and risk.** Skilled field electrical labour — scarce, weather-exposed, congested, sequenced last — becomes factory labour under a crane, done in parallel with civil work.
3. **What is bought back at the factory acceptance test.** Relay settings verified by secondary injection, interlocks exercised, breakers racked through all three positions. Finding a reversed CT polarity at the works costs an afternoon; finding it at site commissioning costs a schedule.
4. **What it cannot buy.** A FAT proves what a factory can simulate. It cannot prove the plant — the generators, the UPS, the building management system. Integrated testing at real load on site is still the only thing that proves a power system, and a programme treating a successful FAT as commissioning has skipped the test that matters.
5. **The physical constraints as design inputs from week one:** transport route, permits, crane pad, foundation — and a design frozen far earlier than a field-built room.

---

## Module 6 — Where this vendor's products slot in, and where they stop (30 min)

Trace the utility service to a hall and mark the rows filled: metal-clad at 5–38 kV, arc-resistant to Type 2C, on-board racking, generator-duty bus bracing, low-voltage switchgear built around other makers' breaker elements, motor control that close-couples with no transition section, bus systems, and the factory-built room.

Then mark what is **not** there: no UPS, no transformer above distribution class, no gas-insulated switchgear at transmission voltage. Teach the reader that the missing rows are the commercially interesting ones, because they are the seams — and the seam is where the coordination study, and the argument about who owns it, lives.

---

## Module 7 — Where it fails (30 min)

Drawn from the corpus's failure map, rows 3 and 14. Miscoordination opening a main; relay settings never re-checked after a load change; incident energy treated as a label rather than a design output; a main-tie-main whose sources are each sized for half the load; a factory acceptance test mistaken for commissioning; and the approval-drawing clock treated as the manufacturer's problem when the buyer's own review time is usually the largest controllable delay.

---

## Suggested pacing

| Session | Modules | Time |
|---|---|---|
| 1 | 1 and 2 | ~1h 45m |
| 2 | 3 | ~1h 30m |
| 3 | 4 | ~1h 15m |
| 4 | 5, 6 and 7 | ~1h 45m |

If only one session is available, do Module 3 and Module 4. Arc flash and the protection study are the two things a seller in this market is asked about and the two the corpus could not previously answer.

Developed by: LightAISolutions
