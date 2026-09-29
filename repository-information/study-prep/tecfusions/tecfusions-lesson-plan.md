# TECfusions — Technology Lesson Plan

**Purpose:** starting from high-school STEM, teach the landlord that says it generates its own power: what 'space, power and cooling' priced per kilowatt means, how on-site gas generation works (turbines against engines, continuous against standby duty, islanded against dual-utility), which permits make generation real and which do not, why legacy industrial sites with old transmission lines are the asset, how to read a SPAC and its projections, and where the corpus's equipment (transformers, switchgear, UPS, chillers, and one day an SST or a battery) fits in a bring-your-own-baseload world. No company trivia: the founder's history, the deal dates and the share counts stay in the dossier. Generated 2026-09-29 from the Profiler dossier (profileVersion 1). The in-app guide (Profiler → TECfusions → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Fermi America guide teaches the generation-first campus at gigawatt scale with turbines landed; TECfusions is the same thesis at 2 MW with no permit trail, so the two are a matched pair on module 3. The VoltaGrid, Enchanted Rock and ProEnergy guides teach the vendors who sell bridge power; here the landlord is the buyer and owner of it.

**Suggested pacing (before 7 October 2026):** Module 1 (~10 min — space, power and cooling as a product), Module 2 (~25 min — on-site gas generation; the most important module), Module 3 (~20 min — the permits that make generation real), Module 4 (~10 min — adaptive reuse and old wires), Module 5 (~20 min — reading a SPAC), Module 6 last (~15 min — where the equipment fits), then the flashcard and self-test passes in the app.

## Module 1 — Space, power and cooling as a product

**The single idea:** a landlord that refuses to own GPUs sells three things, priced per kilowatt for a decade or more.

1. **The product.** 'We're the space, power, and cooler provider … it's limited to the space, power, and cool', the founder said. The deck: 'Avoid providing the volatile, expensive and high-risk GPU/compute capacity layer'. The tenant owns the servers and their risk; the landlord owns the hall and the power.
2. **Priced per kW.** Fees are 'based on the quantum of power per client at a fixed price per kW, with annual escalators and subject to multi-year contractual obligations'. A tenant reserving 10 MW pays for 10,000 kW whether its GPUs are busy or idle. Compare a neocloud, paid per GPU-hour used.
3. **Term.** 'Our shortest remaining term is 12 years, maybe 13 years.' Power is locked with '15-year power contracts'. Long terms are what lenders finance against, as the WhiteFiber plan's module 1 shows from the listed side.
4. **Shell, colocation, turnkey.** A powered shell is the building with power and cooling brought to the hall wall; colocation is a rack, suite or cage inside a shared hall; turnkey is a finished hall built to the tenant's specification. TECfusions offers all three; TensorWave's phases are turnkey.
5. **Speed as the pitch.** 'Contract to deployment in less than 6 months'; a 10.5 MW hall built in three months in 2024; 14.4 MW delivered in Tucson 'in under 4 months'. Speed comes from re-used buildings with existing feeds (module 4) and from buying equipment ahead of contracts ('Advance equipment purchases enabled rapid deployment').
6. **Live against leased.** 'Fully leased' does not mean built: 37 MW live at Clarksville with 42 MW more under contract; 16 MW live at Tucson with 12 MW contracted; 2 MW live at Keystone Connect with 10 MW contracted. Read the live column.

**Self-check:** a landlord's flyer says '1 GW leased today' and its deck says 2 MW live at the same site. What is each number? (A tenant's capacity commitment, restated as an anchor tenant with a right of first refusal; and the energised megawatts. Only the second has a meter on it.)

## Module 2 — On-site gas generation

**The single idea:** a data centre can be its own power plant, and the choices are the machine, the duty rating and whether the grid is a partner or a backup.

1. **Why generate on site.** The grid queue is years long; a gas plant beside the hall can be running in months if the gas and the permits are there. TECfusions' deck sorts the market into 'Slow + Grid-Dependent' developers, 'Fast + Power-Only' behind-the-meter vendors, and itself: 'Fast + Vertically Integrated … On-site power'.
2. **Turbines against engines.** A gas turbine burns fuel continuously in a compressor-combustor-turbine, spins a generator, and suits tens of megawatts per unit with fast ramping and hot exhaust that can be recovered ('we are able to repurpose the steam and heat from the turbines … to lower the PUE'). A reciprocating engine is a large piston engine, 1 to 20 MW per unit, more efficient at part load, slower to build up in fleets. TECfusions says 'turbines' and names no maker, model or size.
3. **Continuous against standby duty.** 'We use continuous duty-rated equipment … We're not doing emergency or standby equipment.' A continuous rating means the machine is built and warranted to run all year at full output; a standby rating means a few hundred hours. The rating changes the machine, the price, the maintenance contract and the air permit (module 3).
4. **Islanded against dual utility.** An islanded microgrid runs with no grid connection; 'Operating 100% off-grid when needed'. Dual utility keeps a grid feed as one of two sources: 'dual utility and on-site microgrid generation'. TECfusions markets both, and the local press says the first building runs on the grid today.
5. **Gas supply.** A plant needs fuel every hour. The company cites 'two fracking pads and a gas-drying plant' on the campus and 'on-site wells accessing Marcellus Shale'. A drying plant removes water from wellhead gas before combustion. Who owns the wells is disputed on the record; no pipeline or supplier is named.
6. **The economics.** Gas power 'as low as 4 cents per kWh' under 15-year agreements and 'under 5 cents per kWh' for hyperscalers, against grid tariffs with demand charges and capacity fees (the 5C plan's module 3). The price depends on the gas price, the machine's efficiency and running it at high load factor.

**Self-check:** a landlord buys 'continuous duty-rated' turbines instead of standby generators. What has it decided? (To be a power plant: run all year, carry the fuel contract and the maintenance, and take a plant's air permit rather than an emergency-generator permit.)

## Module 3 — The permits that make generation real

**The single idea:** a gas plant exists on the public record when its air permit does, and everything before that is a plan.

1. **Air first.** In Pennsylvania a new combustion source needs a plan approval from the environmental department before construction, or a general permit for small units, and a Title V operating permit once large enough. The application states the machines, their size and their emissions. None in TECfusions' name has been found in the state bulletin.
2. **What was found.** A wastewater discharge permit and two water-quality permits transferred to the site company in 2025. Those are the campus's plumbing, inherited from the research centre that was there before. They say nothing about generation.
3. **Zoning.** The township treats the site as a permitted research-and-technology use and issued a building permit with 'zoning permits deemed unnecessary'. Residents appealed in county court, arguing a special exception was required. The township 'does not have an ordinance regulating power plants'.
4. **The moratorium and the draft rule.** A 180-day pause to November 2026 with the existing permits grandfathered, and a draft ordinance that would make every new data centre 'supply its own baseload power', with setbacks and a noise cap. A rule that mandates the company's model for everyone after it.
5. **The third-party estimate.** An environmental group modelled a 2,700 MW 'TECfusions Keystone Connect Power Plant' from the announced capacity: 15.7 million tons of carbon dioxide a year. It is a calculation from a press release, not a permit, and it is now quoted in the township debate.
6. **The test to apply.** Announced megawatts (3 GW), contracted (12 MW), permitted for generation (none found), energised (2 MW). Fermi America, the corpus's other generation-first landlord, has 1.5 GW of turbines physically landed; that is what the same test looks like further along.

**Self-check:** a company says its campus is 'currently powered by turbines' and the state bulletin shows only water permits in its name. What can you conclude? (Either the turbines run under someone else's permit or a permit exemption, or they do not run; the claim is unverified until an air permit or a plan approval names the machines.)

## Module 4 — Adaptive reuse and old wires

**The single idea:** the asset in a legacy industrial site is its electrical history, and a landlord buys the wires as much as the land.

1. **Legacy sites.** A 1,395-acre former aluminium research campus near Pittsburgh with over a million square feet of buildings and its own gas wells; a 1989 data centre in Tucson built for a software company; a Virginia site beside a decommissioned coal plant. Each came with feeds, substations or transmission lines sized for a previous industrial life.
2. **Old lines as new capacity.** At Clarksville the plan is to 'repurpose abandoned 138kV transmission lines from a decommissioned coal plant', in discussion with the utility and the county. A line that once carried a plant's output can carry a campus's input without a new interconnection study, if the utility agrees.
3. **Building J.** The first live hall at Keystone Connect 'formerly housed Arconic's data center operations': a building that already had a data-centre feed, which is why 2 MW could be live in 2026 while the 3 GW is a drawing.
4. **Tenant or owner.** Tucson is rented from a real-estate fund on a 15-year absolute net lease (the tenant pays taxes, insurance and maintenance); Keystone Connect and Clarksville are owned. A landlord that rents its building can still buy the generators and switchgear inside it; it cannot pledge the building.
5. **The same thesis elsewhere in the corpus.** WhiteFiber converts a yarn plant and a mattress factory; 5C converts a retailer's headquarters and a decommissioned data centre. TECfusions adds the generation layer, which is what makes its sites need gas as well as wires.

**Self-check:** why is an abandoned 138 kV line worth more to a data-centre developer than a new one? (It exists: no interconnection queue, no years-long study, only the utility's consent to re-energise it.)

## Module 5 — Reading a SPAC

**The single idea:** a SPAC merger prices a private company by agreement, not by auction, and the deck's projections are the price of that agreement, not guidance.

1. **The vehicle.** A special-purpose acquisition company raises cash in an IPO, holds it in trust, and has about two years to merge with a private business. The private business becomes listed without its own IPO. Here the trust held about US$353 million.
2. **The terms.** A US$4.0 billion 'pre-money' value: the private company's owners receive 400 million new shares at a notional US$10.00. A PIPE (private investment in public equity) of US$35 million from one investor. A minimum-cash condition of US$45 million. Pro forma, the founder's side owns 89%.
3. **Redemptions.** SPAC shareholders may take their trust cash back at the vote instead of holding the merged company. The cash that stays is what the company actually raises; the CFO-designate hoped to 'retain a lot of that trust money'. Recent SPACs have often kept little.
4. **The filings.** The signed agreement was announced in July 2026; the registration statement (an S-4) that carries audited financials and lets shareholders vote had not been filed by the end of September. Until it is, the financials are the company's own, 'unaudited', with an audit 'in process'.
5. **Projections.** Revenue of US$110 million in 2026, US$289 million in 2027 and US$2.14 billion in 2028; capex of US$1.4 billion, US$16.9 billion and US$16.1 billion 'assumed to be debt financed' at 6 to 13%. A twentyfold revenue rise on US$34 billion of borrowed capex. Read them as the story the equity is sold on, with the deck's own footnote: 'subject to significant risks of change'.
6. **The risk factor.** The deck discloses the founder's 'prior criminal convictions and alleged misconduct' and allows him to sell up to US$100 million inside the lock-up. Governance disclosures in a SPAC deck are part of the price too.

**Self-check:** a SPAC has US$353 million in trust, a US$35 million PIPE and a US$45 million minimum-cash condition. What is the least the merged company could raise and still close? (About US$45 million: the PIPE plus enough non-redeemed trust cash to reach the minimum.)

## Module 6 — Where the equipment fits

**The single idea:** a landlord that generates its own power buys the whole chain, and its own blog lists the items it waits longest for.

1. **The list.** The company's supply-chain post names transformers ('up to four years for medium and high voltage units'), switchgear (12 to 18 months), chillers (12 months or more), generators and UPS as the bottlenecks it buys around. The state grant scope adds 'generation, UPS, switchgear, cabling'. The deck adds 'domestic sourcing of Transformers, HVAC, immersion cooling'.
2. **Who signs.** The site company (Tecfusions Keystone LLC holds the permits) or the parent; no EPC or general contractor is named, and the founder describes buying 'a different market segment for equipment' by taking continuous-duty machines. A vendor sells to the company directly.
3. **Scale today.** 55 MW live across three sites; 12 MW contracted at the flagship. The 3 GW would be the largest single-owner generation build in the corpus; the 2 MW is the order book.
4. **Where an SST or 800 VDC would enter.** Nowhere on the record. The company's electrical language is conventional: transformers, switchgear, UPS, 'high- and medium-voltage power generation and distribution' in the engineering chief's biography. A solid-state transformer would sit between the generation bus and the hall distribution at a campus designed for it; nothing says this one is.
5. **Batteries.** One generic blog on federal rules that let 'backup generators, battery storage, and demand response' sell into wholesale markets. No project, no site. A landlord running turbines all year has the same reason to want a battery as a utility does: to ride through a trip and to shave the peaks the machines are sized for.
6. **Bring your own baseload.** If the township's draft rule passes, every later data centre in it must self-supply. That would make TECfusions' model the local law, and every entrant a buyer of generation and the switchgear behind it.

**Self-check:** a landlord's blog says medium-voltage transformers take 'up to four years'. What does that tell an equipment seller about the 3 GW plan by 2031? (That the transformer orders would have to be placed years ahead of any permit, and that no such order is on the record.)

## Where the flashcards and self-test point

The in-app guide's flashcards and self-test drill only the concepts above: space, power and cooling priced per kilowatt; live against leased; turbines against engines, continuous against standby duty, islanded against dual utility; air permits against water permits and the announced-permitted-energised test; adaptive reuse and old transmission lines; how a SPAC prices a company, redemptions, the S-4 and projections; the equipment list and its lead times; where an SST, 800 VDC or a battery would enter. None tests a founder's history, a deal date or a share count.

Developed by: LightAISolutions
