# Mitsubishi Electric — Technology Lesson Plan

**Subject:** the inside of a large static UPS — inverter topology and where the losses actually go — plus the two decisions that surround it (transformer or no transformer, which battery), the UPS as a load on its own generator, and the transformer lead time read from the buyer's side.

**Baseline assumed:** high-school STEM. Ohm's law, AC as a waveform, and the idea that a switch that is neither fully on nor fully off is dissipating power.

**What this plan deliberately does NOT repeat.** The UPS is now the best-covered product in the corpus, and repeating it would be worthless:

- **Rehlko's guide** teaches the four blocks of a static UPS (rectifier, DC link, inverter, static bypass), the four clocks (hold-up, ride-through, autonomy, transfer time), monolithic against modular, sizing, and single-source against best-of-breed. This plan assumes all of it and **opens the inverter**, which Rehlko's does not.
- **Piller's guide** teaches the three grades of UPS, static against rotary, DRUPS, the stiff source, and 2N against the isolated-parallel ring. This plan does not revisit rotary at all.
- **Eaton's guide** teaches double conversion against eco-mode as an efficiency-protection dial. This plan treats eco-mode only as one row in a loss-budget table, and spends its time on the loss budget itself.
- **Hitachi Energy's and GE Vernova's guides** teach why one large transformer takes years and why grid factories cannot scale. This plan does not re-argue the factory; it teaches the **procurement inversion** those lead times force on a buyer.
- **ABB's guide** teaches why a campus keeps a medium-voltage tier. Not repeated.

---

## Module 1 — Inside the inverter (75 min)

**Concepts:** two-level vs three-level; switching loss vs conduction loss; what SiC changes; why a percentage point is worth money.

1. **Two-level, and why it costs twice.** Each output phase switched between the top and bottom of the DC link thousands of times a second; a filter smooths the square edges. Two costs: every device must block the full DC-link voltage, and the raw waveform is far from a sine, so the filter is large.
2. **Three-level.** Split the DC link, add a path to the midpoint. Each device now blocks half the voltage — cheaper, faster, lower-loss devices become usable — and the waveform starts closer to a sine, so the filter shrinks.
3. **The two losses, taught separately because they behave oppositely.** *Switching loss*: burned at each transition, when the device carries current and holds voltage simultaneously; scales with switching frequency. *Conduction loss*: burned while fully on, because a real transistor still drops a small voltage; scales with current, the same I²R idea as any conductor. A designer trades one against the other; three-level relaxes both.
4. **SiC.** Faster switching with lower loss at the same voltage, which buys either efficiency at the same frequency, or a higher frequency — smaller filter, faster control loop — at the same efficiency.
5. **Why a point matters.** At 2 MW, one point of efficiency is 20 kW burned continuously — roughly 175 MWh a year plus the cooling to remove it, forever. That is why UPS datasheets quote efficiency to one decimal and gen-set datasheets do not: a standby engine runs hours a year, a UPS runs all of them.

---

## Module 2 — The efficiency curve, and why nobody is on its peak (60 min)

1. Peak efficiency is one point on a curve, typically 50–75% load. Fixed losses — controls, fans, magnetics, standing semiconductor losses — do not scale with load, so light load is worse.
2. **Two structural reasons every plant is light.** A hall is sized for eventual capacity and fills over one to three years. And redundancy is achieved by installing more than the load needs, so N+1 or 2N puts every unit below rating *by construction*. Work the arithmetic: 2N at 40% IT utilisation puts each unit near 20% load, permanently.
3. **Eco-mode as the usual answer, and the refusal as the interesting one.** Eco-mode buys back most of the double-conversion loss and introduces a detection-and-transfer event. One vendor publishes no eco-mode figure at all and argues SiC plus three-level makes double conversion efficient enough to leave the load permanently on the inverter. Teach this as a coherent but narrow position — it removes a failure mode, and it depends on the remaining efficiency gap staying small.
4. **kVA against kW.** Modern units are often unity power factor so the two are equal; an older specification assuming 0.8 or 0.9 is describing a different product.

**Datasheet drill:** given two quotes, find efficiency at the load the plant will actually run at, establish whether the curve is double conversion or eco-mode, and confirm whether kVA equals kW.

---

## Module 3 — Transformer-based or transformerless (60 min)

The decision most likely to surprise someone who has not read a one-line closely.

1. **What the transformer was doing — three jobs.** Galvanic isolation as a physical property. Deriving the output neutral, defining a separately derived system and settling downstream earthing. Contributing substantial fault current, which made downstream coordination straightforward.
2. **What removing it buys.** Smaller, lighter, more efficient, cheaper per kilowatt, and practical to build in modular hot-swappable form.
3. **What removing it costs — and to whom.** All three jobs move to the system designer. Isolation, if needed, becomes a transformer elsewhere at someone else's cost. The neutral and earthing question moves upstream. And fault-current contribution is now limited by semiconductor ratings — **which is precisely why the static bypass exists**: a downstream breaker may need more current to trip than the inverter can supply, so the machine hands the load to raw mains for that moment.
4. **The commercial sentence to carry:** a transformerless UPS is a better machine and a slightly harder system. When two quotes differ by a transformer, they are not quoting the same scope.

---

## Module 4 — The UPS is the generator's hardest customer (60 min)

The gen-set guides teach sizing from the engine's side. This is the same problem from the load's side.

1. **Why a rectifier is a non-linear load.** A passive diode bridge conducts only near the voltage peaks, drawing current in gulps. Those gulps are harmonics: current at multiples of line frequency carrying no useful power, heating transformers and neutrals and distorting the voltage every other load sees.
2. **Why the generator feels it and the utility does not.** A utility is a stiff source; a gen-set is one alternator with comparatively high internal impedance, so the same distorted current becomes real voltage distortion at its terminals — which its AVR and the UPS control loop then both react to. This is why the two are commissioned together.
3. **Three generations of answer.** Six-pulse; twelve-pulse (two bridges phase-shifted thirty degrees so distortion partly cancels, at the cost of a transformer); active front end (switching devices under control, near-sinusoidal current at near-unity power factor). Modern large units quote input current distortion around 3% at full load and input power factor above 0.98.
4. **Why that is a commercial number.** A badly behaved front end historically forced the generator to be oversized *for distortion, not for load* — a bigger engine, fuel system, air permit and pad. A quoted generator compatibility ratio near 1.1:1 is a claim that the engine barely has to be oversized at all.
5. **IEEE 519** is where this becomes contractual, at the point of common coupling. The UPS is usually the largest single contributor on the bus.

---

## Module 5 — The battery underneath (45 min)

1. **Reset the intuition first.** A UPS is a *power* application, not an energy one: it discharges hard for minutes. Cycle life, which dominates grid-storage economics, barely matters. Discharge rate, footprint, monitoring and fire code decide it.
2. **The C-rate trap.** Lead-acid usable capacity falls sharply as discharge rate rises, so a published amp-hour figure quoted at a slow rate overstates what the string delivers in a real event. The gap is discovered during the first real discharge.
3. **VRLA against lithium** across service life, footprint and weight, up-front cost, rate capability, monitoring (a BMS is intrinsic to lithium; for lead-acid, cell-level monitoring is an added system and the classic failure is one weak cell nobody could see), and fire code — NFPA 855 governs spacing, enclosure, suppression, detection, sometimes with product-specific test data.
4. **The decision-maker point:** lithium wins on almost every technical axis and is decided by the authority having jurisdiction and the capital-versus-lifecycle split between owner and tenant.

---

## Module 6 — The transformer is the schedule (45 min)

1. **The ordering sequence inverts.** When equipment sets the critical path, the order goes first, against a deliberately coarse specification, and detailed design catches up. Any later change is a factory change order.
2. **Standardisation as procurement strategy.** One rating, impedance and configuration across phases makes units — and slots — fungible. Optimise each phase and every slot becomes single-purpose.
3. **Impedance ripples furthest.** It sets downstream fault current. A larger, lower-impedance unit raises it, can take existing switchgear past its withstand rating, and invalidates the coordination study. A transformer substitution is never only a transformer substitution.
4. **Dry-type against oil-filled**, and the on-load tap changer as the only substantial moving part — and therefore the most common maintenance item and a frequent cause of outages.
5. **The spare is a decision, not a contingency line.** If replacement takes years, redundancy means a physical spare somewhere. Naming which choice was made beats any reliability statistic.
6. **GOES** is why the constraint has outlasted several years of high prices, which normally cure shortages.
7. **The reading skill:** ask what a quoted lead time is measured *from* — order, drawing approval, or release to manufacture. The difference is often the buyer's own review cycle.

---

## Module 7 — Where the catalogue sits, and where it fails (45 min)

Plot the range: 6 kVA single-phase to 2 MW UPS, then medium-voltage vacuum breakers, then gas-insulated switchgear to 550 kV and circuit breakers to 800 kV. The shape to notice is a vendor present on **both sides of the service entrance and absent in between** — no metal-clad switchgear line in the North American catalogue.

Close on the failure map: a UPS parked at the wrong end of its curve permanently; load exposed on bypass while a transformerless machine waits for a specialist; the neutral and earthing question nobody owned; the rectifier that made the generator too small; a battery sized on amp-hours instead of discharge rate; lead time discovered after design freeze; and a vendor claim visible from only one side of the public record.

---

## Suggested pacing

| Session | Modules | Time |
|---|---|---|
| 1 | 1 and 2 | ~2h 15m |
| 2 | 3 and 4 | ~2h |
| 3 | 5 and 6 | ~1h 30m |
| 4 | 7 | ~45m |

If only one session is available, do Modules 1 and 2. Everything else in this plan is a consequence of understanding the loss budget and the efficiency curve.

Developed by: LightAISolutions
