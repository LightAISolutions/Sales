# Cummins — Technology Lesson Plan

**Purpose:** teach the generator set as a *purchase* — how to read the datasheet, how to size the plant, what the emissions certification actually permits, and where the order stops being an engine and starts being a power system. Starting from high-school STEM. No company trivia: founding dates, executives and share counts stay in the dossier. Generated 2026-09-04 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → Cummins → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Caterpillar plan teaches the gen-set as a *machine* — the ten-second race, block load, paralleling, load shed, black start, the air permit from the engine's side. This plan does not repeat any of that. It sits one step earlier, with the buyer: what the numbers on the page promise, what the arithmetic between them is, and which of the decisions are legal rather than technical. Read Caterpillar's plan first if you have not; this one assumes you know what a transfer switch does.

**Suggested pacing:** Module 1 in one sitting (~25 min). Module 2 across two sittings (~50 min — datasheet literacy is where the vocabulary lives and it repays slow reading). Module 3 in one sitting (~40 min — do the arithmetic on paper). Module 4 in one sitting (~30 min). Module 5 in one sitting (~30 min — the permit module is the one people skip and should not). Module 6 last (~25 min), then the flashcard and self-test passes in the app.

## Module 1 — Five things bolted to one frame

**The single idea:** a generator set is five separately-specified products sold as one part number, and a buyer who reads only the kilowatt number has read one line of a five-page contract.

1. **The prime mover** — the engine. It sets start time, how much load can arrive in one bite, what leaves the stack, and how often a technician is needed. Displacement, cylinder count and injection system are not trivia: two sets with identical kilowatt ratings behave differently when a hall lands on them.
2. **The alternator** — where shaft power becomes volts and amps. Winding pitch, insulation class and subtransient reactance decide how far voltage sags when a large motor starts and how much fault current reaches a downstream breaker so that breaker trips instead of the plant collapsing. A larger alternator on the same engine is a standard fix for a voltage-dip problem, and you can only ask for it if you know the two are specified separately.
3. **The controls** — two loops arguing in real time. The governor holds engine speed, and therefore frequency. The automatic voltage regulator (AVR) holds output voltage by adjusting the alternator's field current. Published recovery figures are statements about those two loops, not about the engine's brute strength.
4. **Cooling** — a radiator sized for a 40 °C day is a different radiator from one sized for 50 °C, and the difference decides whether the set fits where the drawing puts it.
5. **The fuel system** — day tank, transfer pumps, bulk storage. This is what turns a machine that runs for hours into a plant that runs for days.

**Worked example.** Cummins builds all five in-house — engine, alternator (STAMFORD, AvK, MARKON), controls (PowerCommand), cooling and fuel. It also *sells* the alternators to competitors' packagers, which means one vendor supplies part of its own competitive set. Hold that thought for Module 6.

**Self-check:** a plant cannot start a large chiller without an unacceptable voltage dip. Which of the five is the problem, and what is the fix? *(The alternator; order a larger one on the same engine.)*

## Module 2 — Reading the datasheet

**The single idea:** most of the confusion in a power-room conversation comes from four or five lines on a spec sheet being read as if they meant something else.

| What the sheet says | What it means | The trap |
|---|---|---|
| **ekW** (or kWe) | Electrical kilowatts at the alternator terminals | Engine makers sometimes quote **bkW** (brake kilowatts at the shaft), a larger number for the same machine |
| **kVA** beside kW | Apparent power; kW = kVA × power factor, conventionally 0.8 for gen-sets | A set rated 2,500 kW / 3,125 kVA cannot deliver 3,125 kW |
| **Standby / prime / continuous** | Three promises about *hours per year and average load* | Standby is the biggest number and carries no overload allowance. Sizing a bridge plant off it is the classic error |
| **With fan / without fan** | Whether the radiator fan's parasitic load is subtracted | Often 100 kW or more on a multi-megawatt set — enough to eat a redundancy margin |
| **50 Hz / 60 Hz** | A four-pole alternator turns 1,500 rpm for 50 Hz and 1,800 rpm for 60 Hz | The same block makes roughly 20% more power at 1,800 rpm. Cummins' QSK95 is 3,010 ekW standby at 50 Hz and 3,500 ekW at 60 Hz |
| **Load acceptance / block load** | How much of the rating arrives in one step, and the recovery band | "100% in one step" and "100% in three steps" are different machines for a data hall |
| **Emissions certification** | The regulatory class — see Module 5 | "Stationary emergency" is a legal limit on *use*, not a description of capability |
| **Ambient / altitude reference** | The conditions the rating was measured at, typically 25 °C at sea level | Every real site is worse — see Module 4 |

**Two quotes are comparable only when they agree on five things:** rating class, power factor, fan, frequency and reference ambient. Getting those aligned is most of what a technical evaluation of gen-set bids consists of.

**The proprietary rating worth knowing.** Cummins publishes a **Data Center Continuous (DCC)™** rating: *"applicable for supplying power continuously to a constant or varying electrical load for unlimited hours in a data center application."* Its stated purpose is Uptime Institute Tier III and IV compliance, and its commercial consequence is real — Cummins' own white paper works an example where **four 2,500 kW DCC-rated sets** meet a demand that would need **five 2,500 kW ISO Prime sets**. Note the honesty in the same document: ISO added a "Data Centre Power" rating in 2018 which Cummins says *"is not appropriate for Uptime Institute Tier III or Tier IV certification"* because it references a reliable utility and prohibits prolonged parallel operation. The proprietary rating exists because the standard one does not do the job.

**Self-check:** bid A quotes 3,000 ekW standby, no fan, 25 °C at sea level. Bid B quotes 3,000 ekW prime, with fan, at 45 °C and 1,200 m. Which is the larger machine? *(B, by a wide margin — three penalties stacked.)*

## Module 3 — The arithmetic

**The single idea:** sizing is four multiplications and one decision, and the order matters.

1. **Connected load.** Add everything the generators must carry: IT, mechanical plant, lighting, life safety. Always the largest number, never the one you buy against.
2. **Diversity factor.** Loads do not peak together, so a designer can buy less than the arithmetic sum. **This is the step an AI hall attacks:** thousands of accelerators executing a synchronized job step rise and fall in lockstep, pushing diversity toward one and swinging load by tens of percent in seconds.
3. **Derating.** Correct the laboratory rating for the site — Module 4.
4. **Redundancy.** Divide derated load by derated per-machine rating to get N, then choose N+1 or 2N. **Apply redundancy to the derated capacity, not the nameplate.** Reversing steps 3 and 4 silently eats the spare, and it only shows on the first outage that lands on a design-day afternoon.

**The leftover decision: how many machines?** The same 20 MW is five 4 MW sets or ten 2 MW sets. Fewer and larger costs less per kilowatt and needs fewer maintenance visits, but N+1 on five buys 25% spare while N+1 on ten buys 11%. More and smaller is more forgiving of a failure and of a phased build. Neither is right in general; the answer follows the campus's growth plan.

**Self-check:** 18 MW of derated demand, N+1. Which build carries more margin — five 4.5 MW sets or ten 2 MW sets? *(Five: the spare is 25% of requirement rather than 11%.)*

## Module 4 — Derating

**The single idea:** published ratings are laboratory numbers, and the corrections multiply rather than add.

| Condition | Why it costs power | Rough behaviour |
|---|---|---|
| **Altitude** | Thinner air, less oxygen per stroke, so less fuel can be burned. A turbocharger recovers some of it — until it runs out of margin itself | Often negligible to ~1,000 m on a turbocharged set, then a stated percentage per increment |
| **Ambient temperature** | Hot intake air is less dense, and a hot ambient makes the radiator less effective — the engine hits a coolant-temperature limit before a power limit | Free to a stated ambient, then a percentage per degree. The **design day**, not the average day |
| **Fuel** | Ratings assume a reference energy content and cetane number | Small for like-for-like diesel; potentially significant for gas, where heat rate depends on composition |
| **Backpressure / intake restriction** | The engine has to push exhaust out and pull air in | Stated as a maximum allowable backpressure; exceeding it costs power and life |

Derating is why a set specified for Phoenix at 4,000 feet is physically bigger than one for Dublin at sea level, for the same delivered kilowatts. It is also why "we will add another one later" is often cheaper than buying margin up front: the margin must survive the worst hour of the worst day and is idle for every other hour of the machine's life.

## Module 5 — The emissions class is a purchase decision

**The single idea:** the same engine block is sold into different regulatory classes, and the class — not the hardware — usually decides price, lead time and what the machine is legally allowed to do.

| Class | Requires | Permits | Costs |
|---|---|---|---|
| **EPA Tier 2, stationary emergency** | Comparatively loose NOx and particulate limits; usually no after-treatment | Running only during a genuine loss of supply, plus a limited annual allowance — commonly ~100 hours under **RICE NESHAP** (40 CFR 63 Subpart ZZZZ) for maintenance and testing | Cheapest and most common for data-center standby. The cost is the legal ceiling on use |
| **Tier 4 Final** | Selective catalytic reduction with **DEF** dosing, usually a diesel particulate filter | Non-emergency operation: peak shaving, demand response, prime, bridge power | Materially more capital, a DEF supply chain with freeze protection, more backpressure, more maintenance, longer lead time |
| **EU Stage V** | Stricter than Tier 4 on particle *number*, effectively mandating a filter | Sale and operation inside the EU | A separately certified variant — European and US versions of one model are not the same machine |
| **Local overlays** | State or county limits above the federal floor (Northern Virginia's NOx restrictions being the standard example) | Whatever the air permit says | A model variant, different after-treatment, or a cap on total installed generation at the site |

**The strategic point:** emissions class and business model are the same decision. An emergency-only fleet is pure insurance and can never earn. Certifying for unrestricted running turns the same steel into a plant that can shave peaks, sell demand response or bridge a late grid connection. Cummins named "emissions certified aftertreatment solutions" as one of three capabilities it is *adding* for prime power at its 2026 Analyst Day — an explicit acknowledgement that its current large-node catalogue is predominantly Tier 2.

**Fuel is a logistics problem in an engineering costume.** Two tanks, not one: a day tank at each set holds hours and is fed by pumps from bulk storage, a split driven by code limits on fuel near buildings and by surviving a transfer-pump failure. Diesel degrades — water condenses in, microbes grow at the interface, heavy fractions drop out — so **fuel polishing** is a maintenance regime, and the line item that disappears from budgets. And 48 hours of on-site fuel is not a 48-hour runtime; it is a 48-hour window in which tankers must arrive, during the regional event that caused the outage, competing with every other critical facility calling the same suppliers.

## Module 6 — Where the order stops, and the industry map

**The single idea:** "buying generators" is six or seven scopes, and the arguments on a project are about the seams between them.

| Scope | What it is | Who supplies it |
|---|---|---|
| Gen-set package | Engine, alternator, controls, radiator, base tank, enclosure, silencer | The OEM, through a dealer |
| Automatic transfer switch | Senses the failure, calls for a start, moves the load | Sometimes the OEM, sometimes the switchgear vendor, sometimes an electrical OEM — a frequent finger-pointing seam |
| Paralleling switchgear | Synchronizes, shares load, sheds and restores in priority, manages the return to utility | Switchgear specialist or the OEM's switchgear arm; the control sequence is written for the specific site |
| Fuel system | Bulk tanks, pumps, piping, polishing, containment | Mechanical contractor |
| Installation and commissioning | Setting, cable, exhaust, load-bank testing the plant as a system | Electrical contractor and commissioning agent |
| Service | Scheduled maintenance, parts, emergency response, load-bank testing for life | The OEM's dealer network, under a multi-year agreement |

**The industry map.** Four vendors hold most of the data-center standby market. Ordinal rankings are sourced — MarketsandMarkets puts the 2025 field as Caterpillar, Cummins, Rolls-Royce, Rehlko, Mitsubishi. Percentage shares are not: Fortune Business Insights estimates Caterpillar 18% and Cummins 16% on 2026 data, and that estimate should be cited to Fortune Business Insights rather than treated as measured, because vendor market-size estimates for nominally the same market range from $433M to $10.34B across firms.

**What the buyer should take from the map.** The equipment is contestable and the *channel* is not. Cummins' Distribution segment is a $12.4B business of ~15,000 people whose power-generation sales rose from $3,972M to $4,932M in one year, entirely in North America. That is why the company's own "data center revenue" target of ~$5B for 2026 spans Power Systems *and* Distribution and therefore exceeds the whole Power Systems segment's FY2025 revenue. When you compare vendors, compare the twenty-year service relationship as carefully as the kilowatt number.

**Self-check:** why does an OEM guard its dealer network more jealously than a product feature? *(The network converts a one-time equipment sale into decades of service revenue, and unlike a feature it cannot be copied quickly.)*

Developed by: LightAISolutions
