# Stem — Technology Lesson Plan

**Subject:** the technology under Stem's products — how you find out what a solar or storage plant is actually doing, how the control hierarchy from cell to fleet is layered, what a plant controller does to satisfy a grid operator, and how software decides what a battery earns.
**Baseline assumed:** high-school physics and mathematics. No prior electrical-engineering or power-market knowledge.
**Total:** eight modules, about 6 hours 15 minutes with exercises.
**Not covered here:** Stem's corporate history, executives, listing history, reverse split or financial results. Those belong in the dossier, not in a technology curriculum.

**Where this sits against other plans in this directory.** `fluence/` and `flexgen/` cover storage integration and the hardware the software controls. `sungrow/`, `sinexcel/` and `delta-electronics/` cover power conversion — the equipment that actually moves the current when this software issues a setpoint. `dnv/` covers independent assurance of the same assets. This plan is the **control and information layer** over all of them: it starts at the sensor and ends at the market bid, and it deliberately treats the battery and the inverter as things that already exist.

---

## Module 0 — The question the whole plan answers (20 min)

**Objective:** see why a built plant needs software at all, and why that software is a separate business from the plant.

- A solar plant is a field of panels wired to inverters. It has no moving parts to speak of and no fuel. So what is there to manage?
- Three answers, each of which becomes a module: **you cannot see it** (Module 1), **you must control it to be allowed to connect** (Modules 3–4), and **what it earns depends on decisions made every few seconds** (Modules 5–6).
- A battery adds a fourth: it is a **finite, depleting resource within each day**, so every discharge is a choice not to discharge later. That single property is why storage software is harder than solar software.
- The vocabulary introduced and used throughout: **asset owner**, **operator**, **fleet**, **site**, **point of interconnection**, **grid operator**.

*Exercise:* list every decision a 100 MW solar plant's owner makes in a day, then mark which ones a human could plausibly make and which must be automated. Discuss where the line falls and why.

---

## Module 1 — Telemetry: how you know what a plant is doing (55 min)

**Objective:** understand the measurement chain from sensor to database, and why the boring parts decide everything downstream.

- What is physically measured at a site: irradiance (how much sunlight is arriving), module and ambient temperature, wind, AC and DC current and voltage, inverter status codes, meter readings, and for storage, cell voltages, temperatures and state of charge.
- **The meter is special.** A *revenue-grade* meter is the one whose reading money changes hands on. Accuracy class, calibration and tamper-evidence are why it costs more than an ordinary sensor.
- **The data logger / gateway**: a small industrial computer at the site that polls devices, timestamps readings, buffers them when the network drops, and forwards them. Why buffering matters — a communications outage must not become a data hole, because a data hole becomes an unbillable period.
- **Protocols**, and why there are several: Modbus (simple, old, ubiquitous), DNP 3.0 (utility-oriented, built for unreliable links), IEC 61850 (substation-native, self-describing), IEC 60870, OPC-UA (modern, typed, secure). A device speaks one or two; the logger has to speak all of them.
- **Point maps and drivers.** Every make and model of inverter exposes its data at different register addresses with different scaling. A *driver* is the translation. This is unglamorous and it is the actual moat — a vendor with eight thousand of them can monitor a fleet nobody else can.
- **Polling rate and what it costs.** Sub-second data for control; minute data for performance; fifteen-minute data for settlement. Faster data is more bandwidth, more storage and more money.
- Edge compute: doing arithmetic at the site instead of in the cloud, and the two reasons to bother — latency for control loops, and surviving a lost link.

*Exercise:* a site reports 12% less energy than the meter says was exported. Enumerate the possible causes in the measurement chain, in the order you would check them.

---

## Module 2 — Solar asset performance: what "underperforming" means (55 min)

**Objective:** learn the metrics that turn raw telemetry into a judgment, and why fault detection is a statistics problem before it is an engineering one.

- **Nameplate versus delivered.** Why a plant never produces its rated power, and why that is not a fault.
- **Performance ratio (PR)**: measured output divided by the output the available sunlight should have produced, after temperature correction. The single most-used number in solar operations, and its weaknesses.
- **Availability** versus **performance**: a plant can be fully available and badly underperforming. Contracts usually guarantee the first and not the second.
- The loss mechanisms, each with a signature in the data: **soiling** (dirt, gradual, weather-correlated), **shading** (periodic, time-of-day locked), **clipping** (the inverter refuses to pass more than its rating — looks like a flat top on a sunny day, and is often *by design*), **degradation** (slow, seasonal-noise-buried), **tracker faults**, **string outages**, **combiner failures**.
- **Why clipping is the instructive one:** it looks like a loss and is usually an economic choice, because oversizing the panel field relative to the inverter buys more energy in the mornings and evenings than it loses at midday. A monitoring system that flags it as a fault is wrong.
- **Automated fault detection**: comparing a string against its neighbours rather than against a model, because neighbours share the weather. Why this reduces false alarms, and why a threshold that is too sensitive is worse than no alarm at all — alarm fatigue is a real failure mode with a body count in missed real faults.
- **Forecasting** solar generation: from irradiance forecasts to expected output, and why the forecast horizon that matters depends on what you are going to do with it.

*Exercise:* given four output curves, identify soiling, clipping, a tracker stuck at one angle, and a single failed string. State the evidence for each.

---

## Module 3 — The control hierarchy, from cell to fleet (60 min)

**Objective:** place every product category in this industry on one ladder, so no acronym is ever ambiguous again.

The ladder, bottom to top. Each layer only talks to its neighbours:

1. **Cell and module** — the electrochemistry. Not controlled directly by anything in this plan.
2. **BMS (battery management system)** — supplied with the battery. Keeps cells inside their safe voltage, current and temperature envelope; balances them; estimates state of charge and state of health. **It has veto power over everything above it** and will refuse a command that would hurt the cells.
3. **PCS (power conversion system) / inverter** — converts DC to AC and back, and is what actually delivers real and reactive power. Executes a setpoint; does not decide one.
4. **EMS (energy management system)** — the site brain. Decides what the site should be doing right now and issues setpoints to the PCS, within limits the BMS allows.
5. **PPC (power plant controller)** — enforces what the *grid* requires at the point of interconnection: voltage, frequency response, power factor, ramp limits, curtailment. Module 4 is entirely about this.
6. **SCADA (supervisory control and data acquisition)** — the operator's window and hands: visualisation, alarms, manual override.
7. **Fleet / portfolio application** — the layer above the site, spanning many plants: performance analytics, reporting, and the optimisation in Modules 5–6.

- **Why the boundaries move between vendors,** and why that is the single most confusing thing about this market. Some suppliers sell layers 2–5 as one box; others sell layer 4 only; others sell 6 only. The same acronym means a different scope depending on who is selling it.
- **Vendor lock-in, concretely.** If layer 4 only speaks to layer 3 from the same manufacturer, replacing the inverters means replacing the controller. An **orphaned EMS** — one whose vendor has exited, been acquired or stopped supporting it — strands the plant. This is why "hardware-agnostic" is a purchasing criterion and not marketing.

*Exercise:* draw the ladder for a hybrid site with two inverter brands and one battery brand. Mark every interface where a protocol translation must happen.

---

## Module 4 — What a power plant controller actually does (55 min)

**Objective:** understand grid-code compliance as an engineering requirement with a control mode for each obligation.

- **Real and reactive power**, from first principles: why alternating current lets you push energy (real, measured in watts) and separately support voltage (reactive, in volt-amperes reactive) with the same hardware, and why the grid operator cares about both.
- **The point of interconnection** is the boundary. Everything the grid operator specifies applies *there*, not at any individual inverter — so the controller's job is to co-ordinate many devices to produce one behaviour at one point.
- **Frequency** is the shared heartbeat of the grid, and it falls when demand exceeds supply. Hence the frequency family of control modes:
  - **Fast frequency response / frequency containment** — respond within seconds or less to arrest a fall. Batteries are extraordinarily good at this, which is why it was storage's first real market.
  - **Frequency-watt** — change output as a defined function of measured frequency.
  - **Power oscillation damping** — actively counteract inter-area oscillations.
- **Voltage** family: automatic voltage regulation, volt-VAR (adjust reactive power as a function of measured voltage), and fixed power factor.
- **Power** family: active power limiting and curtailment (deliberately producing less, on instruction or to respect a constraint), and ramp-rate limits.
- **System** family, and the one unique to storage: **state-of-charge management** — day-ahead targeting and waypoint scheduling, so the battery is at the right charge level when it is needed.
- **Why speed is specified in cycles.** A 60 Hz cycle is about 16.7 milliseconds. A controller that acts "in under a cycle" is acting faster than the waveform repeats — necessary for the fast frequency products, and the reason the control loop runs at the edge rather than in a data centre.
- **Reserve products by name and timescale**, since these are the terms European and North American documents differ on: FCR / primary (seconds), aFRR / secondary (seconds to minutes, automatic), mFRR / tertiary (minutes, dispatched). Learn the ladder once and the regional names map onto it.

*Exercise:* the grid operator requires a plant to hold voltage at the point of interconnection within a band while exporting maximum real power. Explain what the controller does and what physical limit it will hit first.

---

## Module 5 — The revenue stack: what a battery is paid for (50 min)

**Objective:** understand why the same battery earns different amounts under different market designs, and why that makes the software valuable.

- **Energy arbitrage** — buy low, sell high, within the day. The intuitive one, and usually not the largest.
- **Ancillary services** — being *available* to respond, paid whether or not you are called. Frequency products dominate; they were where storage economics began and they saturate as more storage arrives.
- **Capacity** — being counted on to exist at peak. Paid per unit of firm capability, with an accreditation process that discounts a short-duration battery.
- **Demand charge management and tariff optimisation** — for a battery behind a customer's meter, reducing the customer's own bill rather than selling into a market.
- **Value stacking** and its central constraint: **you cannot sell the same megawatt-hour twice**. Committing capacity to a reserve product forecloses arbitrage with it. Optimisation is precisely the allocation of one finite resource across competing claims.
- **Day-ahead versus real-time**, and why a commitment made yesterday must be honoured today at whatever today's prices are.
- **Locational pricing and congestion** — why the same energy is worth different amounts at different places on the network.
- **The saturation dynamic:** the first battery into a frequency market earns extraordinary returns; the twentieth earns very little. Revenue stacks migrate, and software that cannot follow them ages badly.

*Exercise:* given a day of prices and a two-hour battery, allocate its capacity across arbitrage and a reserve product by hand. Then state what information you would have needed at 10 a.m. yesterday to do it well.

---

## Module 6 — Optimisation and bidding: turning forecasts into instructions (55 min)

**Objective:** see the actual decision problem, its constraints, and why forecast quality dominates cleverness.

- The problem stated plainly: choose a charge/discharge schedule that maximises expected revenue, subject to physics (power and energy limits, round-trip efficiency), chemistry (the BMS's envelope), contract (guarantees, curtailment obligations) and market rules (bid formats, gate closure times).
- **Round-trip efficiency** as an economic parameter: if you lose 12% of every stored unit, the price spread must exceed that before a cycle is worth doing at all.
- **Warranty-aware dispatch** — the constraint that surprises people. A battery warranty limits cycles or throughput per year. An optimiser that maximises this month's revenue by cycling hard can void the warranty and destroy more value than it created. **Degradation cost is a real term in the objective function**, not an afterthought.
- **State of charge as the coupling variable** — the reason this is not a series of independent hourly decisions. Today's last discharge sets tomorrow's starting point.
- **Forecast error is the dominant term.** Price forecasting is hard, and an optimiser fed a poor forecast makes confident wrong decisions. Most measurable performance difference between optimisers is forecast quality, not solver sophistication.
- **Bidding mechanics**: bid curves rather than single numbers, gate closure, settlement, and imbalance charges for failing to deliver what you offered.
- **Who is allowed to bid.** In many markets a registered entity — a scheduling co-ordinator or qualified scheduling entity — must submit on the asset's behalf. Whether an optimiser holds that registration itself or partners for it is a real commercial distinction.

*Exercise:* an optimiser's forecast is systematically 10% low on evening prices. Trace the consequences through the schedule, the state of charge, and the following day.

---

## Module 7 — Hybridisation: adding storage to a plant that already exists (45 min)

**Objective:** understand why retrofitting storage onto an operating solar plant is its own engineering problem, and why it is currently the most active one.

- Why retrofit at all: the expensive, slow things — the land, the grid connection, the permits, the substation — are already there. Adding storage reuses them.
- **The shared point of interconnection is a hard ceiling.** If the connection is rated for 60 MW, solar plus battery must respect 60 MW at that point regardless of what each could do alone. The controller now has to arbitrate between two sources against one limit.
- **Clipping recapture**: an oversized panel field that was throwing away midday energy can now store it. This is often the single largest value item in a retrofit and is invisible in a greenfield analysis.
- **AC-coupled versus DC-coupled**: whether the battery sits on its own inverter beside the plant, or shares the DC bus with the panels. The trade-off in efficiency, control granularity and tax treatment.
- **What changes in the control layer:** the site now needs an EMS where it previously needed only a monitoring platform, the plant controller acquires storage-specific modes, and the SCADA displays two asset classes.
- **What changes commercially:** the plant moves from a price-taking generator to a participant that can choose when to deliver — which is the moment the optimisation in Modules 5 and 6 starts to matter for an asset that never needed it before.

*Exercise:* a 60 MWp solar plant on a 40 MW connection adds a 40 MW / 80 MWh battery. State what the plant controller must now prevent, and identify the hours when the constraint binds.

---

## Module 8 — The industry map: who buys this, who competes, and why it is a hard business (45 min)

**Objective:** place the whole technology stack in its commercial context.

- **Who buys**: asset owners and independent power producers, developers, utilities, commercial and industrial hosts, and the operations-and-maintenance contractors working for them. Note that the buyer of monitoring software is often not the buyer of control software even at the same plant.
- **Two structurally different sellers**, and this is the key distinction in the segment:
  - The **equipment maker's software arm** — bundled with the vendor's own batteries or inverters, sold to make the hardware more valuable and to keep the customer.
  - The **independent platform** — sold on the promise of working across everyone's hardware, whose entire value proposition is that it does not care what you bought.
  - Each has a real advantage. Bundled software is tested against its own hardware and supported by one throat to choke. Independent software survives the vendor changing, and is the only option for a fleet assembled over ten years from six manufacturers.
- **Why fleet scale compounds — and where the argument runs out.** More assets under management means more observed behaviour, better fault signatures and better forecasts. But it is not an unlimited moat: forecasts saturate, and a competitor with less data and a better model can beat more data with a worse one. Treat "data network effect" as a claim to be tested, not a law.
- **The recurring-revenue shape.** Software of this kind is sold as a subscription per site or per unit of capacity. The metrics that follow — annual recurring revenue, contracted-but-not-yet-operating revenue, assets under management — measure a base that is slow to build and slow to lose. That inertia cuts both ways: it protects an incumbent and it means a decline is visible long before it is fatal.
- **The uncomfortable structural point:** this software is a small fraction of a project's capital cost while determining a large fraction of its revenue. That mismatch is why the business is simultaneously strategically important and commercially hard to price.
- Where each of Stem's product lines sits on the ladder from Module 3, mapped explicitly, and which layer each of its named competitors occupies.

*Exercise:* you own 40 solar plants from five manufacturers and are adding batteries to eight of them. Specify what you need at each layer of the ladder, and decide for each whether you would buy bundled or independent — and say why.

---

## Suggested pacing

| If you have | Do this |
|---|---|
| **One evening (90 min)** | Modules 0, 3 and 8. You will understand the ladder and the market shape, which is most of what a conversation needs. |
| **A weekend (4 hrs)** | Add Modules 1, 4 and 5. You can now follow a technical discussion about grid compliance and revenue. |
| **A full pass (6¼ hrs)** | All nine, in order. Module 2 before 1 works if you care more about solar than storage. |
| **Storage-only focus** | 0, 3, 4, 5, 6 — skip 1, 2 and 7. |
| **Solar-only focus** | 0, 1, 2, 3, 8 — skip 5 and 6. |

**Do Module 3 before anything else if you only read one.** Every acronym in this industry is ambiguous until you have the ladder, and most confusion in vendor conversations is two people using "EMS" to mean different layers.

Developed by: LightAISolutions
