# Firmus — Technology Lesson Plan

**Purpose:** starting from high-school STEM, teach the neocloud that builds and powers its own AI factories. The plan covers what an AI factory is and what a neocloud sells; the three megawatt numbers every campus carries; why AI cooling moved from air to immersion to direct-to-chip; the power train from grid to rack and who supplies it; how UPS batteries earn money by holding grid frequency; and firming — why energy (MWh) and power (MW) are different promises. It ends with where 800 VDC or a solid-state transformer would enter the chain, and why that has not happened yet here. No company trivia: founding dates, executives, funding rounds and valuations stay in the dossier. Generated 2026-09-26 from the Profiler dossier (profileVersion 1). The in-app guide (Profiler → Firmus → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The in-app CoreWeave and IREN guides teach neoclouds that rent or build in North America; this one teaches a neocloud that is also the buyer of its own grid connection and power train. The Chindata guide teaches the opposite model — a landlord that leases space and lets the tenant bring the servers.

**Suggested pacing (before 7 October 2026):** Module 1 (~15 min — AI factory and the three megawatts), Module 2 (~15 min — cooling generations), Module 3 (~30 min — the power train and who signs the order; the most important module), Module 4 (~15 min — UPS batteries on the grid), Module 5 (~20 min — firming, MW against MWh), Module 6 last (~10 min — where 800 VDC would come in), then the flashcard and self-test passes in the app.

## Module 1 — The AI factory and the three megawatts

**The single idea:** a neocloud sells time on GPUs, not floor space, and every campus it builds carries three different megawatt numbers.

1. **What is sold.** A landlord leases a hall and the tenant brings its own servers. A neocloud owns the GPUs and rents computing on them — on demand, reserved, or as dedicated capacity on multi-year contracts. Firmus is the second kind: press contrasts it with a landlord because 'it supplies customers with access to Nvidia chips rather than requiring them to bring their own'.
2. **The AI factory.** A hall designed from the start for one job — training and running AI models — around racks of tightly coupled GPUs. Firmus's building block, the HyperCube, is 'designed to house 32 NVL racks'. An NVL72 rack links 72 GPUs into one computing domain and draws well over 100 kW, so the rack, not the server, is what the building is designed around.
3. **Three megawatts per campus.** *Critical IT load* is what the servers draw. *Maximum demand* adds cooling, conversion losses and building services. *Connection capacity* is what the grid link is sized for, with headroom. Firmus's South Australian campuses show the gap: about 1.0 GW IT against about 1.2 GW of connection at one, and about 1.3 GW against about 1.5 GW at the other.
4. **One site, four figures.** The Tasmanian flagship is 84 MW of critical IT (company), '100MW' in the power-train supplier's filings, 90 MW for Stage 1 in the state's approval, and 104 MW of retail supply. They measure different things, and no source reconciles all four. Ask which megawatt a figure is before comparing it with another.
5. **Contracted is not built.** Firmus reports more than 900 MW of contracted customer capacity against two operating sites. Contracted capacity is a sales figure: megawatts customers have signed for, most of them in buildings not yet finished.

**Self-check:** a campus has 1.0 GW of critical IT load and a 1.2 GW connection. Where does the other 0.2 GW go? (Cooling, conversion losses, building services and headroom — the connection must carry the whole site, not just the servers.)

## Module 2 — Cooling: air, immersion, direct-to-chip

**The single idea:** GPU racks now make too much heat for air, and the industry settled on cold plates on the chips rather than tanks of liquid.

1. **Why air ran out.** Air holds little heat per litre, so cooling a rack drawing well over 100 kW with air means moving huge volumes of it at speed. Liquids carry far more heat per litre, so they carry the heat to the building's cooling plant with far less flow and fan power.
2. **Immersion.** The whole server sits in a tank of electrically insulating fluid that takes heat from every part. Firmus's first generation (2023) was 'multiple modularised 1MW HyperCubes' on single-phase immersion. It removes fans, but it needs tanks, special handling and servers qualified for the fluid.
3. **Direct-to-chip.** Cold plates bolted onto the GPUs and memory carry a coolant loop; a coolant distribution unit (CDU) swaps heat between the rack loop and the building loop. Firmus's current generation is direct-to-chip for GB300 and Vera Rubin, with closed-loop propylene-glycol circuits and dry coolers. An independent rater judged 'the bulk of Firmus's experience with immersion cooling is misguided, and now wasted' as the platform moved to direct-to-chip. NVIDIA's liquid-cooled racks are built around cold plates.
4. **Dry coolers and water.** A dry cooler is a large radiator with fans: it rejects heat to outside air without evaporating water, which works whenever the air is cooler than the coolant. Warm-water liquid cooling makes that most of the year in Tasmania. Firmus says its greenfield campus runs without water for more than 350 days a year.
5. **PUE.** Total facility power divided by IT power: 1.0 would mean zero overhead. Firmus claims 1.1 and targets 1.15 or less against a 5-star national benchmark of 1.40. At 84 MW of IT, a PUE of 1.1 means about 92 MW for the whole facility.

**Self-check:** why did the move to direct-to-chip strand an operator's immersion expertise? (The GPU maker's rack designs standardised on cold plates and CDUs; tank-based servers became the exception, not the platform.)

## Module 3 — The power train and who signs the order

**The single idea:** Firmus buys its own power chain, but in Australia it has given one vendor the whole power train by contract. The questions that matter are who places the purchase order, and for what.

1. **The chain, grid to rack.** Connection substation and switchyard at transmission voltage → transformers down to medium voltage → medium-voltage switchgear → transformers down to low voltage → UPS and batteries → distribution to the rack → the rack's power shelves. Backup generators sit alongside, ready to take the load when the grid fails.
2. **Firmus owns the top of the chain.** 'We are building and paying for our own connection substations up front', it says, and its Tasmanian plans include 'electrical substations (that Firmus will own)'. Owning the substation is common for gigawatt campuses, because the grid operator will not build it quickly enough on its own.
3. **The power train as a product.** The Firmus Power Cube is a modular block of that electrical chain, built in a factory and delivered to site. Its manufacturer's stated scope runs from grid connection, substation and switchyard, through custom transformers and switchgear, to backup power and standby generation.
4. **Exclusivity.** The manufacturer's stock-exchange filings describe a Master Services Agreement making it 'the exclusive supplier of power train units for Firmus' Australian pipeline'. Money moves through work orders under that agreement (A$200M, then A$855M in August 2026). For every other vendor, an exclusive supply agreement closes the category for its term. The open doors are the components inside the Power Cube (the manufacturer sources them), the UPS and batteries, and sites outside Australia.
5. **What it costs.** The manufacturer benchmarks the work at about A$200M per 100 MW, about A$2M per megawatt for the electrical power train alone. By that benchmark, A$855M is roughly 430 MW of capacity; that figure is arithmetic, not a disclosed number.
6. **Removing a layer.** Firmus describes 'rack-level electrical with CDU-fed systems and no PDU overhead' and claims about 15% less power loss per megawatt. Every stage that converts or distributes power wastes a little, so removing one adds up at hundreds of megawatts. The 15% is the company's claim, not an independent measurement.

**Self-check:** a switchgear maker wants to sell into Firmus's next Australian campus. Whom does it call first? (The power-train manufacturer, as a component supplier inside the Power Cube — Firmus has contracted the power train itself exclusively.)

## Module 4 — UPS batteries that hold the grid's frequency

**The single idea:** a data centre's UPS batteries sit idle almost all the time, and a grid-interactive UPS rents part of them to the grid to hold its frequency steady.

1. **Frequency is the grid's balance meter.** Australia's grid runs at 50 Hz. When supply and demand match, the frequency holds. When a large generator trips, demand exceeds supply, the spinning machines slow and the frequency falls. The operator buys fast responses to catch it within seconds.
2. **FCAS.** Frequency control ancillary services are the markets in Australia's National Electricity Market for raising or lowering output to hold frequency. The fastest, fast frequency response, rewards anything that can react in about a second. Batteries, with no moving parts, dominate those markets.
3. **Grid-interactive UPS.** A UPS battery exists to carry the site through the seconds before generators start. A grid-interactive UPS reserves enough charge for that job and offers the rest to FCAS, so the same battery earns money. Firmus's subsidiary runs this on Eaton's EnergyAware UPS platform, and delivered certified fast frequency response into the NEM from a Tasmanian site in April 2025. Firmus says its UPS systems are 'engineered to deliver FCAS, load modulation, and firming capacity'.
4. **Demand response.** The load itself can flex: Firmus's energy policy commits it to curtail for up to 220 hours a year when the grid is short. A large, flexible load is easier to connect, because the grid can count on it stepping back at peak.
5. **Why this wins approvals.** A gigawatt data centre looks to a grid operator like a new city arriving at once. A load that holds frequency and steps back at peak is a better neighbour, and that shortens the argument for a connection.

**Self-check:** why can a UPS battery sell frequency services without weakening its backup role? (It keeps a reserve sized for the ride-through to generators and offers only the charge above that reserve; frequency events are short and mostly small.)

## Module 5 — Firming: energy against power

**The single idea:** power (MW) is how fast energy flows, and energy (MWh) is how much is stored. A firming promise has to specify both.

1. **MW against MWh.** A 200 MW battery can deliver 200 MW. How long it can keep that up depends on the energy it holds: 800 MWh ÷ 200 MW = 4 hours. That ratio is the battery's duration, and it decides which grid jobs the battery can do — seconds for frequency, hours for the evening peak.
2. **Firming.** Solar and wind do not follow a data centre's flat, round-the-clock load. Firming is adding something controllable — batteries, gas, hydro — so the load is met in the hours renewables cannot cover. Tasmania's grid is mostly hydro, which is firm by nature. South Australia's is mostly wind and solar, so there the firming must be bought.
3. **The 2.5 MWh-per-MW rule.** Firmus's energy policy requires suppliers to deliver 'at least 2.5 MWh of new firming capacity for every 1 MW' of its load. Its South Australian supply deal, 600 MW of firm electricity for 12 years from mid-2027, commits the supplier to underwrite 1.5 GWh of new battery storage by 2032. That matches the rule exactly: 600 MW × 2.5 MWh/MW = 1,500 MWh.
4. **Someone else owns the battery.** The storage is built and owned by third parties. The first is a 200 MW / 800 MWh grid-forming battery, a 4-hour asset. Firmus buys the firmed outcome through a wholesale supply contract rather than buying the batteries, so a battery maker's customer here is the battery developer, not Firmus.
5. **Behind the meter.** One exception is a 26 MW R&D factory in Tasmania that 'will test whether behind-the-meter battery energy storage… can provide a more flexible… approach to backup energy', with Firmus paying all the costs. The question being tested is whether batteries on the customer's side of the meter can replace some of the diesel backup generators a site otherwise installs by the dozen.

**Self-check:** a data centre draws 100 MW all night for 10 hours. How much energy must firming supply if the wind stops? (100 MW × 10 h = 1,000 MWh — a 4-hour, 100 MW battery holds only 400 MWh, which is why firming mixes storage with other sources.)

## Module 6 — Where 800 VDC would come in

**The single idea:** 800 VDC changes the bottom half of the power train, and a solid-state transformer (SST) changes its middle. Neither appears anywhere in Firmus's published designs.

1. **Today's chain converts many times.** AC arrives at medium voltage, a 50 Hz transformer steps it down to low-voltage AC, the UPS converts it to DC and back, and each rack's power shelves rectify it again to the low DC voltage the GPUs use. Every conversion loses a percent or two and takes floor space.
2. **800 VDC.** This architecture distributes direct current at 800 V to the rack instead of low-voltage AC. At the same power, higher voltage means less current, so thinner copper and lower losses — which matters once a rack draws hundreds of kilowatts. NVIDIA has said its 800 VDC architecture arrives with later, higher-power rack generations.
3. **The SST.** A solid-state transformer does the medium-voltage-to-DC step with high-frequency power electronics instead of a 50 Hz iron transformer followed by a rectifier. That removes a stage, shrinks the equipment, and gives a DC bus that batteries and solar can join directly.
4. **What Firmus has said.** Its stated architecture is 'rack-level electrical with CDU-fed systems and no PDU overhead'. Nothing on its own or its energy subsidiary's websites mentions SSTs, 800 VDC or HVDC. That is an inference from absence, and an absence can end with one announcement.
5. **Where it would appear first.** The Australian power train is locked to one vendor. The sites outside Australia — Indonesia and Malaysia, built with a regional developer to NVIDIA's reference designs for Vera Rubin NVL72 — are outside that exclusivity. So is the behind-the-meter battery trial, whose DC side is where a DC-native design would be tested.

**Self-check:** at the same power, what happens to current when distribution voltage rises from 415 V AC to 800 V DC, and why does that matter? (Current falls roughly in proportion, so copper cross-section and resistive losses fall — decisive when one rack draws hundreds of kilowatts.)

## Where the flashcards and self-test point

The in-app drill tests the concept chain above:
- what a neocloud sells, compared with a landlord;
- the three megawatt numbers;
- immersion against direct-to-chip, and dry coolers and PUE;
- the power train and what an exclusive supply agreement closes;
- FCAS and the grid-interactive UPS;
- MW against MWh, duration and the 2.5 MWh-per-MW arithmetic;
- where 800 VDC and an SST would enter.

None tests a date, a name or a funding round.

Developed by: LightAISolutions
