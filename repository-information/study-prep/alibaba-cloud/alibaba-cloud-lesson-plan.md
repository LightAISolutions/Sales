# Alibaba Cloud — Technology Lesson Plan

**Purpose:** teach what a hyperscale cloud buys when it buys power, starting from high-school STEM — why China's internet companies moved server power to 240 V DC a decade before the 800 V conversation, what Alibaba's Panama design folds into one factory-built lineup and why it is a transformer-rectifier rather than a solid-state transformer, what 350 kW supernode racks do to the voltage argument, how PUE counts conversion losses, and how the equipment is actually bought (framework procurement, project awards, landlord tenders from the tenant's list). No company trivia: founding dates, executives, share prices and segment revenue stay in the dossier. Generated 2026-09-26 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → Alibaba Cloud → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Zhonhen and Delta guides teach Panama from the supplier's side; this one teaches it from the buyer's side — why Alibaba specified it, how it bought it, and what an SST would have to beat to displace it. Read it with the Chindata guide, which teaches the one Chinese SST in commercial operation, and the ByteDance guide, which teaches the other large Chinese buyer.

**Suggested pacing (before 7 October 2026):** Module 1 in one sitting (~20 min — the chain and 240 VDC), Module 2 in one sitting (~30 min — Panama and the classification line; the most important module), Module 3 (~20 min — racks, current and PUE), Module 4 (~20 min — how capacity is obtained and how equipment is bought), Module 5 last (~15 min — where an SST enters), then the flashcard and self-test passes in the app.

## Module 1 — The chain from 10 kV to the chip

**The single idea:** a data centre is a chain of conversions between the grid and the chip, and every stage costs energy, floor space and a failure point.

1. **Voltage levels.** China distributes medium voltage at 10 kV. A building's equipment runs at 400 V AC (three-phase). A server board runs at 12 V or 48 V, and the chip itself below 1 V. Each step down is a conversion.
2. **The conventional four stages.** 10 kV switchgear (protection) → distribution transformer (10 kV to 400 V AC) → UPS (ride-through from batteries) → low-voltage distribution (panels, busway, PDUs) → the server's own power supply.
3. **Double conversion.** A standard online UPS rectifies AC to DC to charge its batteries, then inverts back to AC for the load; the server rectifies again. Two avoidable conversions, each a few percent.
4. **240 VDC.** China's carriers and internet companies standardised 240 V DC (and 336 V) for servers in the 2010s: a rectifier charges batteries on a DC bus and feeds servers that accept DC. The UPS inverter disappears. Chinese vendors call it HVDC (高压直流) — high next to the 48 V of a telephone exchange, not next to 800 V.

**Self-check:** why is a Chinese hyperscaler's move to 800 V less of a leap than a US one's? (It is already on DC; the question is the voltage and the source between the 10 kV grid and the DC bus, not AC versus DC.)

## Module 2 — Panama, and the line between a transformer-rectifier and an SST

**The single idea:** Panama collapses the four stages into one factory-built lineup, but its isolation is still a 50 Hz iron transformer — so it is a transformer-rectifier, not a solid-state transformer.

1. **What Panama is.** Launched November 2019 by Alibaba with Delta and Zhonhen: 10 kV AC in, 240 V DC out (336 V offered; Zhonhen now offers 400 and 800 V outputs). Integrates 10 kV distribution, the transformer, the uninterruptible supply and output distribution — 'the traditional four-stage chain compressed into one'. Claimed savings: 40% of the equipment and construction work, half the floor space.
2. **How it works.** A phase-shifting transformer — one primary, several secondaries displaced in phase — feeds groups of rectifier modules. The groups draw current at staggered moments, so their harmonics largely cancel at the 10 kV side: the 12-pulse idea taken further. Broker research describes no separate PFC stage.
3. **Two efficiency numbers.** 98.5% for the power modules (2019) and above 97.5% for the whole system (Zhonhen, 2025). A module figure excludes the transformer's loss; never compare the two as if they were the same measurement.
4. **The classification test.** An SST does isolation and voltage change in a high-frequency stage (a medium-frequency transformer switched by SiC transistors at thousands of hertz). A transformer-rectifier does them in a 50 Hz iron transformer and puts rectifiers behind it. Panama is the second; NVIDIA's 2026 800 VDC execution paper names the Panama Architecture as a transformer-rectifier implementation.
5. **Transformer-rectifier versus SST.** Iron is large, heavy, passive, cheap and nearly failure-free. An SST is small, controllable (regulates output, balances phases, runs power both ways, hosts storage and DC sources) and newer — medium-voltage SiC and high-frequency insulation are still maturing and cost more.

**Self-check:** a colleague says 'Alibaba's fleet is SST experience'. What is wrong? (Panama's isolation is a 50 Hz transformer; the fleet is an installed transformer-rectifier base, which an SST would displace, not extend.)

## Module 3 — Racks, current and PUE

**The single idea:** current is power divided by voltage, conductor loss grows with the square of current, and at 350 kW per rack that arithmetic forces higher distribution voltages.

1. **The supernode.** Alibaba's Panjiu AL128 puts 128–144 GPUs in a double-width rack rated for up to 350 kW of power and 500 kW of heat removal, with about 2 kW of liquid cooling per chip, a centralised in-rack busbar and power nodes decoupled from compute nodes. The busbar voltage is not published.
2. **The arithmetic.** At 350 kW: 54 V → ~6,480 A; 240 V → ~1,460 A; 336 V → ~1,040 A; 400 V → ~875 A; 800 V → ~440 A. Cutting current fifteen-fold cuts I²R loss in the same copper about two-hundred-fold. 240 V DC was designed for 5–15 kW racks.
3. **PUE.** Total facility energy ÷ IT energy. Alibaba's self-built average was 1.187 in FY2026. Conversion losses between the meter and the server input sit in the overhead above 1.0 — and so does the cooling needed to remove them.
4. **What a point is worth.** At 1 GW of IT load, 97.5% → 98.5% chain efficiency saves ~10 MW of continuous draw (1,000 ÷ 0.975 − 1,000 ÷ 0.985). At Alibaba's 20 GW-by-2032 target, one point is ~200 MW.
5. **Chips set the envelope.** US export controls limit imported accelerators; domestic chips (T-Head Zhenwu) are, by management's own account, less efficient per unit of work, which raises watts per service. Lower-precision formats (FP8, FP4) cut energy per operation. Decoupling power from compute lets the power chain outlive chip generations.

**Self-check:** why does a PUE improvement in a new hall barely move the published fleet number? (PUE is an annual fleet average; old halls dilute a new hall's gain.)

## Module 4 — How capacity is obtained and how equipment is bought

**The single idea:** where a megawatt sits decides who buys its power equipment, and in China the instruments are framework procurement, project awards and landlord tenders from the tenant's list.

1. **Build, lease, co-build.** Alibaba reports separate PUE series for self-built and leased halls and said in May 2026 it would secure some capacity by leasing and co-building. Self-build: the cloud specifies and buys (capex). Lease: the landlord buys (operating expense), at best from the tenant's approved list. Co-build: two parties decide.
2. **Framework procurement.** A buyer tenders a year's or several years' volume, awards shares to several winners at fixed prices, and draws down by orders. Zhonhen disclosed an RMB 800 million Panama framework for Alibaba's data centres (November 2021). A winner holds a price and a share, not a quantity.
3. **Project awards.** Named campus or phase — Zhonhen's 2017 wins at Zhangbei are the early example.
4. **Landlord tenders.** A wholesale landlord (Chindata's filing states the rule for UPS) tenders among makers on the tenant's qualified-vendor list; the supplier must convince both.
5. **Joint innovation.** Sungrow and Alibaba Cloud's Green Token Joint Innovation Center (H1 2026), unveiled at Sungrow's SST launch, covers green-power direct supply, 800 V DC supply and compute-power coordination per trade coverage. It is a design conversation; no SST purchase is disclosed.
6. **Capex is not the compute bill.** Leases and rented capacity sit in operating expense; a cloud's capex understates its compute spending.

**Self-check:** a supplier 'won the framework'. What should you ask next? (What share, at what price, drawn down by which projects — a framework is not a quantity.)

## Module 5 — Where a solid-state transformer could enter

**The single idea:** an SST cannot win at Alibaba on efficiency alone; it has to sell what the iron cannot do.

1. **The incumbent.** Panama: proven since 2019, framework-bought from qualified suppliers, above 97.5% system efficiency. The first commercial SSTs claim ~98.5% — about one point better.
2. **The openings.** Footprint (a megawatt in about a square metre, per Delta); output control and two-way power; storage and renewables on a common DC bus; grid support; 800 V delivered directly (Zhonhen's Panama range now offers 800 V too, but still behind a 50 Hz transformer).
3. **Reading Alibaba's signals.** 'Fully compatible with HVDC power supply architectures up to 800V' (ESG 2026) means the hall and IT gear are ready for the voltage, not that an 800 V SST source is installed. The Sungrow centre is the visible SST conversation.
4. **The path.** Joint specification → qualification → a share of a framework. Panama took that path; a newcomer will too.

**Self-check:** name two things an SST can do that Panama cannot. (Regulate and reverse power flow with storage on its own DC bus; deliver the same power in a fraction of the footprint — any two of footprint, controllability, storage/renewable integration, grid support.)

## Where the flashcards and self-test point

The in-app guide's drill items test the concept chain above — the four-stage chain and double conversion, 240 V DC, Panama's phase-shifting transformer and rectifiers, the transformer-rectifier/SST line, current and I²R loss at 350 kW, PUE and what a point of efficiency is worth, framework procurement, capex versus operating expense, and the openings an SST must sell against an efficient incumbent. None tests a date, a name or a share count.

Developed by: LightAISolutions
