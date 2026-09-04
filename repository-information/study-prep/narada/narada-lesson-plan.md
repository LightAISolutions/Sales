# Narada — Technology Lesson Plan

**Purpose:** teach the **backup battery from the cell's side** — why a backup cell is a sprinter and a grid cell a distance runner, why it is specified in watts rather than amp-hours, what lead-carbon actually changed, why a string is only as good as its worst cell, and what the AI rack asks of a cell that no previous duty did. Starting from high-school STEM. No company trivia. Generated 2026-09-04 from the Profiler dossier (profileVersion 3). Companion: the in-app guide (Profiler → Narada → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** Four battery plans exist and this repeats none of them. **Hithium** and **CATL** cover the cell in sixty seconds, how cells become a grid DC block, the big-cell bet, sodium and long duration. **Samsung SDI** covers high-nickel cathodes, solid-state as a chemistry programme, and breaking the thermal-runaway chain. **Mitsubishi Electric** covers VRLA against lithium as a *purchasing* decision under a large static UPS — start there if that is the question you have. **Rehlko** covers battery against flywheel, the prior question of how long you need to ride. And **Vicor** covers the BBU shelf on a rack's DC bus from the **converter's** side — hold-up, ORing, precharge, living on a shared bus. This plan is the **cell** inside that shelf, and the cell inside the UPS room downstairs, and why they are different part numbers even when both say LFP.

**Three ideas carry the plan.** A backup battery is a **sprinter**. It is specified in **watts, not amp-hours**. And the **string is only as good as its worst cell**.

**Suggested pacing:** Module 1 in one sitting (~30 min). Module 2 with a real battery datasheet if you can get one (~35 min — the module that pays). Module 3 (~25 min). Module 4 (~25 min). Then flashcards and self-test in the app.

## Module 1 — The sprinter and the distance runner

**The single idea:** a grid battery is asked *how much*; a backup battery is asked *how hard*. Almost every other difference follows.

The grid battery charges slowly over four hours, discharges slowly over four hours, and does that once or twice a day for fifteen years — an **energy battery**. The backup battery sits fully charged and untouched for years, then delivers everything it has in five minutes, or in a rack, half a second — a **power battery**.

**C-rate is the number that separates them.** 1C empties a cell in an hour, 0.25C in four hours, 10C in six minutes. Narada's own published catalogue spans essentially the whole scale, which makes it an unusually good teaching example:

| Rung | Product | Duty |
|---|---|---|
| 0.25C | Center L Ultra 20-ft container on 587/783 Ah cells | Four-hour grid duty |
| 0.5C | 565/752 Ah cell variants | Shorter grid duty |
| 1C | AIOn platform, low rate model | Long-runtime UPS autonomy |
| 2C | 512 V lithium cabinet | Conventional data-hall autonomy |
| 5C / 6C | 512 V lithium cabinet, high-rate models | Short autonomy, generator start assumed |
| 10C | AIOn X-Rate, 55 Ah AIDC cell, >600 kW per cabinet | Rack-level AI backup and buffering |

A **fortyfold span** in the one number that governs cell design, inside one catalogue.

**Why the ratio changes the cell physically.** Active material is coated onto thin metal foils, and **electrode thickness** resolves the whole argument. A thick coating stores much more energy per litre and makes every lithium ion travel further — fine at 0.25C, hopeless at 10C, because the interior of the coating cannot keep up with the surface and usable capacity collapses. A thin coating has far more surface, foil and tab area per amp-hour: it delivers current hard and stores much less. That is why a power cell costs more per stored kilowatt-hour, and why nobody builds a grid container from one.

**Different figures of merit, different warranties.** The grid cell is judged on **energy density** (Narada publishes 390 Wh/L on its 314 Ah cell, above 430 Wh/L on the 783 Ah) and on **cycle life** in thousands of full cycles. The backup cell is judged on **specific power** — above 1,900 W/kg claimed on the X-Rate cell — and its life metric is not cycles at all but **pulse cycles**: above 200,000 discharges of 500 ms, on the company's own numbers.

**Self-check:** a vendor has strong grid-storage credentials. What does that tell you about its backup products? *(Very little. They share a chemistry name, a factory and a brand — and differ in electrode design, cell format, failure modes, standards, channel and service model.)*

## Module 2 — How a backup battery is actually specified

**The single idea:** the number on the front of the datasheet is almost never the number that matters.

- **Constant-power rating — watts per cell, for a stated time, to a stated end voltage, at a stated temperature.** This is the real specification, and all four qualifiers are load-bearing. Sizing from the amp-hour figure instead is the single most common error in the subject: amp-hours describe a slow discharge, and at UPS rates the usable capacity is materially lower, so the string comes up short in exactly the event it was bought for.
- **End-of-discharge voltage.** Set by the inverter's input window, not by the chemistry. Lowering it wins minutes on a comparison and shortens life — so the string that quoted best may be the one that ages fastest.
- **Autonomy, and the rate it implies.** Runtime plus load fixes the C-rate, which fixes the cell type. Specifying runtime without a load profile is specifying nothing: five minutes at a swinging AI load is not five minutes at a flat one.
- **Design life — and the service life it is not.** Narada's HRL and HRXL lead series are published at a fifteen-year design life. That is years at float under ideal conditions. Temperature dominates: the standard rule of thumb is that every 10 °C above the design point roughly **halves** the life, so a battery room a few degrees warm consumes years silently.
- **Float voltage and temperature compensation.** Almost all of the battery's life is spent here. Set high "to be safe" it cooks the string; set low it never fully recharges.
- **Recharge time and charge-current limit.** The second outage. A string that takes many hours to refill is not available for a repeat event — and the charger's limit, a *UPS* datasheet line, often sets this rather than the battery.
- **Ripple current tolerance.** Alternating current superimposed on the DC, heating the cell from inside. It never appears as a fault, only as a string that ages faster than its siblings.
- **Cell count and string voltage.** Narada's high-voltage lithium line is built at 512 V, against long strings of 2 V or 12 V lead blocks. More cells means more connections and more monitoring points; fewer, larger blocks means less granular information about what is failing.
- **Footprint, weight, floor loading.** Narada publishes roughly 60% less weight and 50% less footprint for its 512 V lithium line against lead, and 70% less footprint for the X-Rate cabinet. In a rack, floor loading is replaced by rack units, which are scarcer still.
- **Fire, code and listing.** UL 1973 listing, UL 9540A test data, NFPA 855 installation rules, IEC 62619 for international cell certification. The authority having jurisdiction decides — and a product with **no named certification at launch**, which the X-Rate cabinet had none published at announcement, is not yet specifiable for many buyers.

**A worked example.** A published channel product is rated **352 kW for 5 minutes**. That is roughly 29 kWh actually delivered — trivial by grid standards, from a cabinet that must supply a third of a megawatt while doing it. Read the two numbers together and the discipline is obvious: **you are buying a rate; the energy is whatever the rate times the runtime happens to require.**

**Self-check:** why does an amp-hour-sized string come up short? *(Amp-hours describe a slow discharge. At the rates a UPS actually uses, usable capacity falls — which is why the specification is watts per cell with four qualifiers attached.)*

## Module 3 — Lead did not die, and the string's worst cell

**The single idea (a):** lead survived because of carbon, and because of what a lead battery's death actually is.

**What "sealed" means.** A flooded lead cell loses water — charging splits some, hydrogen leaves one plate and oxygen the other. The **AGM** construction holds the electrolyte in a glass-fibre mat with just enough gas space that oxygen made at the positive plate recombines at the negative instead of escaping. That is why a VRLA cell is *valve-regulated* rather than sealed: there is still a valve, it opens under abuse, and the room still needs ventilation because recombination is efficient rather than perfect.

**How it dies.** Discharge converts plate material to lead sulphate; charge converts it back. Leave a lead cell partly discharged and the crystals coarsen into a hard form that does not convert back — **sulphation**, permanent capacity loss. In classic float duty this barely matters. In **partial-state-of-charge** duty — telecom, off-grid, solar hybrid — it is fatal in a year or two.

**What carbon changed.** Adding carbon to the negative plate gives it a far larger effective surface and a conductive network through it, suppressing the coarsening and letting the plate accept charge faster. **Lead-carbon** is not a lithium substitute; it is the reason lead survived in exactly the applications where it looked most vulnerable, and it is the technical basis of the telecom backup business.

**Where lead still wins, honestly:** lower capital cost; a genuinely mature recycling route with real scrap value; no BMS required, so simple and familiar failure modes; a shorter permitting conversation than lithium; decades of float-duty field experience. Where it loses: weight, footprint, temperature tolerance, C-rate performance, and knowing anything about its own condition. **The lead-to-lithium transition in backup power is a space, weight and instrumentation argument that lithium won in buildings where those are expensive** — which is why data halls moved first and telecom cabinets moved slowly.

**The single idea (b):** the string delivers what its weakest cell allows, and no more.

A UPS needs a few hundred volts, and a cell makes about two (lead) or a little over three (LFP), so cells are wired in series — dozens or hundreds. The same current passes through all of them, so one cell that has lost half its capacity does not cut runtime by its own share: it ends the discharge for everyone when it hits its end-of-discharge voltage first. And nothing in the terminal voltage reveals it while the string floats.

Two measurements, routinely confused:

- **Conductance testing** measures each cell's internal resistance quickly, on a live string. It reliably finds cells that have *already* failed. It does **not** say how many minutes remain — it is screening, and treating its output as a capacity figure is a consequential mistake.
- **A capacity test** is a real timed discharge into a load bank. It is the only measurement that answers the real question; it is disruptive, and it consumes a little of the life it measures. The IEEE stationary-battery practices set the method and interval, and the convention is to retire a string at **80% of rated capacity**, because degradation accelerates past that point.

Lithium changes this partly: a BMS is intrinsic, so cell-level state is known continuously — a real advance, and not a complete substitute, because a BMS reports what it measures and models, and the model was built from new cells.

**Self-check:** a site replaced annual capacity testing with quarterly conductance screening. What did it give up? *(Any measurement of how many minutes the string will actually deliver.)*

## Module 4 — The cell behind the BBU, and making it earn

**The single idea:** the rack store's duty is a **pulse**, not a discharge — and that quietly changed it from backup into a buffer.

A rack-level store is not there to carry the load until a generator starts; the machine downstairs does that. It covers a transfer, absorbs a step, or holds the bus for the fraction of a second before something upstream reacts. Narada publishes its X-Rate cell life as **more than 200,000 pulse cycles at 500 ms** — a life metric meaningless for any other kind of battery, and a description of a component exercised as part of normal operation.

**Why the AI load creates this.** A training cluster draws a rhythm, not a flat load: tens of megawatts appearing and disappearing in milliseconds as steps synchronise across thousands of accelerators. From the grid this is a stability problem (see the Siemens Energy plan). From the rack it is a cycling duty imposed on what used to be a passive insurance policy.

**What that demands of the cell.** Thin electrodes, very high specific power, minimal internal resistance so it does not cook itself during the pulse, and a chemistry that tolerates constant work rather than float. Narada's answer is a small 55 Ah cell on a hybrid solid-liquid (semi-solid) electrolyte — the reason to reach for an unusual electrolyte in a small cell is that internal resistance dominates everything at 10C. The tradeoff is stored energy: hundreds of kilowatts, and minutes rather than hours.

**Why it goes in the rack.** Distance — a half-second response is only useful if the store is electrically next to the load, on the DC bus already there. Architecture — with an 800 VDC rack there may be no room UPS to fall back on, so the store *is* the ride-through (the Vertiv plan treats what that does to the room-UPS product category). And commerce — a shelf is designed into a rack at volume, not sold to a facilities organisation over two years.

**The honest limit.** Distributing the store distributes the problem: one battery room with one monitoring system, one fire strategy and one procedure becomes hundreds of small stores inside occupied racks, each with its own state of health, each in the airflow of equipment it must not heat, each a fire-code object in a room with people in it. Genuinely harder, and not yet solved — which is why both architectures are being built at once.

**Making a backup store earn — two answers.** Letting the existing store work (peak shaving, demand response, buffering) needs no new asset and puts the energy exactly where the hall's own swings are; it consumes cycle life the backup warranty counted on, turns the honest autonomy figure into the reserve floor, and asks a power cell to do an energy cell's job. Buying a **separate** BESS puts the right cell on each duty and keeps the uptime risk and the arbitrage risk in separate assets, at the cost of duplicated capital and a whole new permitting conversation. **Operators buy the second and talk about the first** — for governance reasons rather than engineering ones, because uptime and the energy bill are owned by different people. The exception is the rack, where the store is already being cycled by the workload whether anyone decided that or not.

**A labelling caution to carry out of this plan.** "Solid-state" on a large-format cell frequently means **semi-solid** — a hybrid solid-liquid electrolyte — which is a real and useful technology and not the thing the phrase implies. Narada's own descriptions place its largest "solid-state" cells there, with only a 30 Ah all-solid-state prototype shown. Ask what the electrolyte physically is; the Samsung SDI plan covers what genuine solid-state would change.

**Self-check:** a rack cell is published at 200,000 pulse cycles of 500 ms. What does that tell you about how it is expected to be used? *(Constantly — as a buffer, not as an insurance policy. It consumes a life budget priced against a different duty, and it is invisible unless somebody counts pulses.)*

Developed by: LightAISolutions
