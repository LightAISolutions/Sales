# G42 — Technology Lesson Plan

**Purpose:** teach, starting from high-school STEM, the Gulf group that is at once a data-centre landlord, a campus builder and a neocloud:
- which arm of such a group buys power equipment and which only rents;
- the Gulf wholesale data-centre standard, and how it is cooled in a hot climate;
- what a gigawatt campus means in energy, and how nuclear, solar and gas each serve it;
- why long-lead equipment is bought before the design is finished;
- what 800 VDC is, and what a memorandum about it does and does not commit;
- how US export country groups, approved recipients and a sunset date govern where the chips can go;
- how physical threats change a campus's electrical design;
- the arithmetic of leasing capacity instead of owning it.

No company trivia: founding dates, executives, shareholdings and valuations stay in the dossier. Generated 2026-09-26 from the Profiler dossier (profileVersion 1). The in-app guide (Profiler → G42 → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The HUMAIN plan teaches the Gulf neocloud whose contractor buys its equipment; this one teaches a group whose landlord arm buys its own. The in-app TeraWulf guide teaches the landlord side of the lease in Module 8, and the Chindata plan teaches wholesale landlords in China.

**Suggested pacing (before 7 October 2026):** Module 1 (~15 min — who buys), Module 2 (~15 min — the wholesale standard), Module 3 (~15 min — gigawatts and fuel), Module 4 (~10 min — long-lead equipment), Module 5 (~15 min — 800 VDC and the memorandum; the most important module for an SST seller), Module 6 (~15 min — export groups and the sunset), Module 7 (~10 min — dispersal), Module 8 (~10 min — leasing arithmetic), then the flashcard and self-test passes in the app.

## Module 1 — Landlord, builder and neocloud in one group

**The single idea:** one group can hold a landlord that owns and builds, a neocloud that rents, and a flagship campus built for foreign operators — and only the landlord buys the power chain.

1. **The landlord.** Khazna 'designs, builds and operates wholesale data centers'. It runs 30 live data centres totalling almost 650 MW, claims 73% of the UAE market, and is developing more than 1 GW more at home and abroad. It carries its own debt, buys its own land and appoints its own main contractors. That makes it the equipment buyer.
2. **The neocloud.** Core42 sells sovereign AI cloud: GPU capacity, a sovereign public cloud on Microsoft's regional infrastructure, and private clouds for secret workloads. Its capacity is mostly leased, including 60 MW of critical IT at a New York campus owned by another company. A neocloud that leases buys IT equipment, not power chains.
3. **The flagship.** Stargate UAE is 'a 1-gigawatt compute cluster' that 'will be built by G42 and operated by OpenAI and Oracle'. G42's construction update says it is 'being developed by Khazna', so the landlord arm builds it and the operators run the computing.
4. **The other companies.** The group also holds analytics, satellite, health and cyber-security businesses. None is a power-equipment buyer on the record.
5. **Why this matters.** A seller who calls the group, or the neocloud, reaches people who do not sign power-equipment orders. The engineering organisation of the landlord arm is the door.

**Self-check:** the neocloud arm signs a new 100 MW lease at another company's campus. Who orders the transformers? (The campus owner, the landlord — the neocloud rents the powered space.)

## Module 2 — The Gulf wholesale standard

**The single idea:** a wholesale landlord standardises its halls so it can build them repeatedly, and in a hot climate the cooling design is part of that standard.

1. **Halls and clusters.** Khazna's designs, certified by NVIDIA for its Blackwell generation, offer 'data halls with capacities of up to 50MW, developing individual AI clusters of up to 250MW'. A hall is a room of racks on shared power and cooling; a cluster is several halls whose GPUs are networked together to work as one machine.
2. **Smaller blocks too.** One 100 MW site is built as 20 halls of 5 MW, liquid-cooled. Smaller halls can be energised one at a time as tenants arrive; bigger ones suit a single tenant training one model.
3. **Uptime tiers.** Most of Khazna's UAE facilities hold Tier III certification. Tier III means every power and cooling path can be taken out for maintenance without shutting the IT load down (concurrently maintainable). That is why redundant transformers, UPS strings and generators are standard.
4. **Cooling in the Gulf.** Outside air in summer is hotter than a comfortable coolant, so dry coolers alone struggle at peak. Adiabatic cooling sprays water to pre-cool the air on the hottest days, and runs dry the rest of the year. Liquid-to-liquid designs carry heat from chip cold plates to the building loop without air. Khazna names 'adiabatic free cooling and liquid-to-liquid cooling solutions'.
5. **Modular build.** A 'modular design and construction strategy' means repeated blocks built in factories and assembled on site. That suits factory-built power skids and e-houses, which ship tested and connect quickly.

**Self-check:** why does a Tier III landlord buy more transformers and UPS modules than the load strictly needs? (Concurrent maintainability: any one path can be switched out without dropping the IT load.)

## Module 3 — What a gigawatt campus needs

**The single idea:** a gigawatt of data centres running all year uses the output of large power stations. Nuclear, solar and gas serve it in different ways, and the fuel mix decides the storage and backup it needs.

1. **Scale.** 1 GW running every hour of a year is 1 GW × 8,760 h = 8,760 GWh, about 8.8 TWh. The campus behind Stargate UAE is planned at 5 GW on 10 square miles, and the 1 GW Stargate cluster is one part of it.
2. **Three fuels, three jobs.** Nuclear is baseload: it runs flat out around the clock and is hard to throttle, which matches a flat data-centre load. Solar is cheap by day and absent at night, so it needs storage or another source after dark. Gas is dispatchable: it can follow the load and cover the hours the other two cannot. The campus is described as 'powered by nuclear, solar, and natural gas'.
3. **What the mix implies.** With a large nuclear and gas share, the grid supplies firm power, and batteries serve ride-through and short-term balancing rather than overnight supply. A solar-heavy mix would need hours of storage. The campus's utility counterparty is not named in any first-party source.
4. **Abroad, a different mix.** In Italy, a joint-venture plan would draw on a combined-cycle gas plant designed with carbon capture. A combined-cycle plant runs a gas turbine and uses its hot exhaust to raise steam for a second turbine; carbon capture strips CO2 from the exhaust at the cost of some output.
5. **Where storage still sits.** Whatever the fuel, each hall has UPS batteries for the seconds before generators start, and AI training loads swing fast enough that storage near the racks is increasingly specified. Those purchases belong to whoever builds the halls.

**Self-check:** why does a nuclear-and-gas campus need less battery energy (MWh) than a solar-only one? (Nuclear runs round the clock and gas can follow the load, so storage is needed for seconds to minutes, not for the whole night.)

## Module 4 — Long-lead equipment

**The single idea:** equipment with the longest manufacturing times is ordered before the design is finished, so on a fast project the big electrical orders are placed early — and once placed, they are gone.

1. **What is long-lead.** Large power transformers, switchgear, generators and chillers are built to order in factories with limited capacity and queues of a year or more. A project that waits for its final design to order them waits for the queue as well.
2. **What was said.** G42's October 2025 update on Stargate UAE: 'The project has completed procurement of all long-lead equipment and has already received its first deliveries of mechanical systems.' It also said 'key modular components have entered production' on a 'design-to-build approach'.
3. **What was not said.** No supplier, no equipment category beyond 'long-lead equipment' and 'mechanical systems', and no signing entity. The first 200 MW is bought and its suppliers are unknown.
4. **The open door.** The first 200 MW is one phase of a 1 GW cluster. The remaining 800 MW, and Khazna's wider pipeline of more than 1 GW, are where orders are still to be placed. Siting changes (Module 7) could reopen the design itself.

**Self-check:** a vendor learns in 2026 that a campus's first phase has 'completed procurement of all long-lead equipment'. What should it pursue? (The next phases and the landlord's wider pipeline — the first phase's orders are placed.)

## Module 5 — 800 VDC and the memorandum

**The single idea:** 800 VDC removes conversion stages between the grid and the GPU. A memorandum to 'continue to progress' it is an engineering conversation, not an order.

1. **The problem it solves.** A rack drawing hundreds of kilowatts at low-voltage AC needs very heavy copper, and every AC-to-DC conversion on the way loses a percent or two. At 800 V DC the same power flows with far less current, so copper and losses fall and conversions are removed.
2. **Where an SST fits.** A solid-state transformer takes medium-voltage AC and delivers DC directly, using high-frequency power electronics instead of a 50 Hz iron transformer followed by a rectifier. It is one way to feed an 800 VDC bus; a conventional transformer with a large rectifier is another.
3. **What was signed.** On 15 September 2026 Khazna and Siemens signed a memorandum: 'The companies will continue to progress next-generation 800 VDC power architectures and their potential in AI data centers.' 'Continue' implies earlier joint work. Khazna's designs already promise 'future-proofing for Rubin as standard', NVIDIA's next GPU generation.
4. **What a memorandum is.** A memorandum of understanding records intent to cooperate. It commits neither party to buy or sell anything, and names no site, capacity or product. It is not an award, and no SST, HVDC or battery supplier is named at any Khazna site.
5. **Why it still matters.** Of the Gulf landlords in this corpus, this is the only one with an 800 VDC conversation on the record. For a seller of DC power equipment, a named engineering partner means the specification is being written. The next signal to watch is a pilot hall or an award.

**Self-check:** a news item says a landlord signed an MoU to 'progress 800 VDC architectures' with a large supplier. What has been bought? (Nothing — it is intent to cooperate on design; the order, if any, comes with a pilot or an award.)

## Module 6 — Country groups, approved recipients and a sunset

**The single idea:** US rules decide where advanced chips can go by country group and by named company, and an approval with a sunset date can force a company to restructure.

1. **Country groups.** US export regulations sort countries into lettered groups. On 10 July 2026 the UAE moved from Groups D:3 and D:4, which carry weapons and national-security concerns, to A:5, the close-ally group with the fewest licence requirements.
2. **Named approved recipients.** The same rule listed G42 (including its cloud subsidiary) and Core42 as approved recipients of advanced computing items in a supplement to the regulations. That approval sits with the companies, not with the country, and it does not extend to a wider licence exception.
3. **The sunset.** The approval 'shall automatically expire on April 6, 2027' unless 'the two UAE-based AI companies … become U.S. companies'. A date in the rule itself can drive a sale, a merger or a re-domiciling. Record it and re-check on the date.
4. **What survives.** The approval 'does not overcome the end-use and end-user based license requirements in part 744'. Rules tied to who uses a chip, and for what, still apply. Reviewers have long asked about China links, which the company denies.
5. **Controls built into the site.** Chips deploy inside a 'Regulated Technology Environment', and a separate framework states an 'intent to develop' geolocation verification and cryptographic tracking of US-origin chips. Security and monitoring become part of the facility design.
6. **What it means for equipment sellers.** A restructuring can change which entity owns a site and signs its contracts. Watch for a US-domiciled vehicle before assuming the buyer's name.

**Self-check:** a country moves to Country Group A:5. Can every company in it now receive advanced chips without a licence? (No — end-use and end-user controls still apply, and named approvals can carry conditions and end dates.)

## Module 7 — Dispersal and site hardening

**The single idea:** once data centres become targets, one giant campus becomes several protected sites, and each site needs its own grid connection, substation and backup.

1. **What happened.** On 1 March 2026 Iranian drones struck AWS data centres in the UAE and Bahrain. Reuters (11 September 2026, citing six people familiar) reports that the 5 GW campus 'will now likely comprise a network of data centers spread across the UAE', with air defences and possibly underground construction. G42 says the project is 'subject to continuous review'.
2. **Site hardening.** Blast-resistant structures, protected or buried plant, air defence, and spreading capacity so that no single strike removes it all.
3. **The electrical consequence (general engineering, not a published design).** One 5 GW campus needs a few very large supply points. A network of smaller sites needs many medium-sized connections, each with its own substation, transformers, switchgear and backup generation. That means more units of smaller equipment, and redundancy planned across sites rather than only within one.
4. **Underground plant.** Buried halls must reject their heat and exhaust generator fumes through protected paths, which favours liquid cooling and compact, efficient power conversion over large air-handling and open-air plant.
5. **What to watch.** An energisation announcement for the first 200 MW, or a new site list. Either would show whether the purchases already made still fit the new layout.

**Self-check:** why could dispersal increase the number of transformers bought even if total megawatts stay the same? (Each site needs its own connection and step-down chain with redundancy; many medium sites use more units than one large one.)

## Module 8 — Leasing instead of owning

**The single idea:** a neocloud that leases pays rent per kilowatt of critical IT load each month; the landlord buys the power chain, and the lease's terms show what the capacity is worth.

1. **The lease terms (landlord's filing).** '60 megawatts of critical IT load, which is equivalent to 72.5 megawatts gross, assuming an approximate PUE of 1.25'. The rent is '$125 per kilowatt-month, which equates to $1.5 million per megawatt per year, with a 3% annual escalator'. The initial term is 10 years with two five-year extensions, 'backed by a parent guarantee from G42'.
2. **Critical against gross.** 60 MW × 1.25 = 75 MW; the filing's 72.5 MW implies a PUE nearer 1.21. Rent is quoted on critical IT load, so always check which megawatt a rent is quoted on.
3. **The rent arithmetic.** 60,000 kW × $125 × 12 months = $90M in year one. With 3% a year added, ten years sum to about $1.03B. The landlord puts the contracted revenue at about US$1.1B; the gap is not explained in the sources, so state both.
4. **The parent guarantee.** The tenant is a young subsidiary, so its parent promises to pay if it cannot. That turns the tenant's credit into the parent's credit and lets the landlord borrow against the lease.
5. **Who buys what.** The landlord built and powered the site; the neocloud filled it with more than 9,000 AMD GPUs. The electrical order was the landlord's.

**Self-check:** a lease is 20 MW of critical IT at $150 per kW-month. What is the first year's rent? (20,000 kW × $150 × 12 = $36M.)

## Where the flashcards and self-test point

The in-app drill tests the concept chain above:
- which arm of a group buys the power chain;
- halls, clusters and Tier III;
- cooling in a hot climate;
- the energy in a gigawatt-year, and what nuclear, solar and gas each do;
- long-lead equipment;
- 800 VDC, the SST, and a memorandum against an award;
- country groups, approved recipients, end-use controls and a sunset date;
- dispersal and site hardening;
- critical against gross megawatts, and lease arithmetic.

None tests a date, a name or a shareholding.

Developed by: LightAISolutions
