# 5C Group — Technology Lesson Plan

**Purpose:** starting from high-school STEM, teach the private AI-data-centre landlord: what a landlord sells when the tenant brings the GPUs, what a customer-owned substation is and why it decides who buys the switchgear, how a utility's capacity charge and a transmission owner's approvals gate a campus, why nineteen diesel generators sit beside a 75 MW hall and why a town writes a moratorium about them, how direct-to-chip cooling turns a 300,000-gallon water permit into a tenth of that, and how structured equity, private credit and tax abatements finance a company with no published revenue. It ends with where an SST, 800 VDC or a battery would enter. No company trivia: family names, funding dates and site codes stay in the dossier. Generated 2026-09-29 from the Profiler dossier (profileVersion 1). The in-app guide (Profiler → 5C Group → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Tract and PowerHouse guides teach the land-and-entitlement end of the landlord chain; 5C is the next step, a landlord that converts vacant corporate buildings and owns the substation. The WhiteFiber guide teaches the same retrofit model at a listed company with a utility-owned substation, which makes the two a matched pair on module 2.

**Suggested pacing (before 7 October 2026):** Module 1 (~15 min — the AI landlord and its two delivery models), Module 2 (~25 min — the customer-owned substation; the most important module), Module 3 (~15 min — capacity charges, approvals and the capacity ladder), Module 4 (~15 min — standby generators, air permits and moratoria), Module 5 (~15 min — liquid cooling and water), Module 6 last (~15 min — the capital stack and where new power technology would enter), then the flashcard and self-test passes in the app.

## Module 1 — The AI landlord and its two delivery models

**The single idea:** an AI landlord sells a hall with power and cooling, the tenant brings the GPUs, and the line between the two can move.

1. **Landlord against neocloud.** A neocloud owns GPUs and rents time on them. A landlord owns the building, the substation, the cooling plant and the standby power, and rents the hall for years. At 5C's Ohio site the tenant announced 'more than US$900 million' of its own investment in GPUs while the landlord spends up to US$1.3 billion on the building and power. Same campus, two balance sheets.
2. **Turnkey.** 5C's first delivery model: 'core/shell construction, MEP installation, operations, and data hall fit-out'. MEP is mechanical, electrical and plumbing, the power train and cooling loops. The tenant gets a finished hall and racks it.
3. **Turnkey+.** The same hall plus 'cluster deployment': GPU nodes, InfiniBand or Ethernet networking and storage, 'accelerating the path from megawatts to tokens to profit'. The landlord installs and operates the tenant's compute. Where the line sits decides who signs the equipment orders.
4. **Adaptive reuse.** 5C's campuses are vacant corporate buildings with big feeds: a former LexisNexis data centre in Ohio, a former retailer's headquarters in Memphis (about 950,000 square feet on 58 acres, bought for US$25 million). Existing structure, existing utility relationship, a shorter path to the first hall than a greenfield.
5. **The AI factory.** A hall designed around racks of tightly coupled GPUs, NVL72-class systems drawing well over 100 kW each, with direct-to-chip liquid cooling. 5C's Phoenix design allows up to 132 kW per cabinet. The rack, not the server, sets the power and cooling design.
6. **Who the tenants are.** Neoclouds and AI labs that were excluded from this corpus because they buy compute, not power equipment. The landlord is where the equipment orders live.

**Self-check:** a tenant invests US$900 million in a landlord's building. What did the tenant buy? (GPUs and networking, not the building, the substation or the generators; those are the landlord's, and so are their equipment orders.)

## Module 2 — The customer-owned substation

**The single idea:** when the customer owns the substation, the customer buys the high-voltage transformers and breakers, and the utility's job ends at a tap on its line.

1. **Two ways to connect.** Utility-owned: the utility builds the substation and transformers, owns them and recovers the cost through a monthly facilities charge; the customer's scope starts at the medium-voltage switchgear. Customer-owned: the utility builds a short tap from its transmission line, and the customer builds and owns the substation.
2. **5C's record.** The transmission owner's filing for Ohio describes 'approximately 115-foot-long (0.02 mile) 138-kV transmission line tap from the existing East Springfield-North Titus 138-kV transmission line to the new 5C Data Center USA, Inc. substation', and adds 'The customer will own the Benjamin Substation'.
3. **What the customer then buys.** The 138 kV breakers and disconnects, the step-down transformers (138 kV to a medium voltage such as 34.5 or 13.8 kV), the medium-voltage switchgear, protection and metering, and the civil works. A customer-owned substation is a multi-year procurement of the largest items in the corpus's equipment list.
4. **Why a landlord chooses it.** Speed and control: the utility's queue for building substations is long, and a customer that builds its own can size it for later phases. The cost: the customer carries the capital and the lead times, and large power transformers have run two to four years.
5. **The matched pair.** WhiteFiber's North Carolina site is the other model: the utility owns the 'Extra Facilities (including overhead lines, substations, transformers, breakers, and metering equipment)'. Same corpus, same month, opposite property lines. Always ask which one before asking who buys the transformers.
6. **The state's role.** The tap needed an Ohio Power Siting Board case; the 5C substation did not. Customer-owned substations sit outside the utility's rate base, which is one reason utilities and their regulators accept them.

**Self-check:** a utility filing says 'the customer will own the substation'. Who buys the step-down transformers? (The customer, the landlord, along with the high-voltage breakers and the medium-voltage switchgear; the utility supplies the tap.)

## Module 3 — Capacity charges, approvals and the capacity ladder

**The single idea:** a campus's megawatts arrive in rungs, each gated by someone else's approval, and a public utility can charge for the rung before it exists.

1. **The upfront capacity charge.** Memphis's municipal utility charges data centres 'US$1.52 million per MW upfront capacity charge': a one-time fee for reserving distribution and transmission capacity, separate from the monthly demand charge. Fifty megawatts costs US$76 million before a kilowatt-hour is used.
2. **Two approvals.** The municipal utility distributes; the federal power authority behind it generates and transmits. 5C's next 50 MW at Memphis 'requires Tennessee Valley Authority approvals' and 'won't advance' before 2027. A landlord can own the building and still not control the date of its power.
3. **The ladder.** Announced (a 2 GW roadmap), committed (161 MW 'fully committed' in the 2026 column of the capacity table), approved (9 MW more at Memphis), energised (about 110 MW operational in September 2026), leased (Vultr's 50 MW). Each is a different megawatt.
4. **Same building, five numbers.** 5C's Ohio site is 200 MW in a 2024 release, 150 MW in the city's FAQ, 75 MW in the 2026 column, 25 MW by the end of September 2026 in the local press, and 50 MW in the tenant's announcement. None is wrong; each measures a different rung.
5. **Slippage as information.** 'Operational by early 2026' became 25 MW by September; Memphis 'this summer' (2025) became 20 MW in 2026; the roadmap fell from 'over 2 GW' to 'over 1.5 gigawatts' unexplained. Track the delta between rungs over time, not the top rung.
6. **What it means for a seller.** Equipment is ordered against the approved rung, not the announced one. At 5C the approved rungs are 25 MW in Ohio and 29 MW in Memphis; the announced ones are 350 MW and 64 MW.

**Self-check:** a utility approves 9 MW and the company's table shows 64 MW for next year. Which number should an equipment vendor size an offer on? (The 9 MW approved, plus whatever the utility's next approval adds; the 64 MW is a target that waits on a federal authority.)

## Module 4 — Standby generators, air permits and moratoria

**The single idea:** every large hall carries a fleet of diesel generators that almost never run, and those engines, not the servers, are what a town regulates.

1. **Why nineteen generators.** Standby generators carry the site when the grid fails, sized to the whole load plus redundancy. Springfield's FAQ counts 3 existing units and 16 more in the first phase; the local press says 19. At roughly 2 to 3 MW each, that is a 75 MW hall's worth.
2. **Standby against continuous duty.** A standby-rated engine runs a few hundred hours a year, mostly in tests; its air permit reflects that. A continuous-rated engine or a turbine that runs all year is a power plant and needs a plant's permit. The same iron, two very different permits.
3. **The permit.** Emergency generators get a minor-source air permit with hour limits and fuel rules (ultra-low-sulfur diesel, monthly or fortnightly testing). Behind-the-meter turbines that run for days need a construction permit under federal and state rules before they run. Memphis's health department is litigating exactly that question over another operator's turbines.
4. **What 5C shows and does not show.** Its capacity table codes Memphis 'GRID / BTM'; drone footage in January 2026 showed 'what appeared to be turbines' under construction; no air permit naming 5C or the address was found. On the public record the generation is unpermitted.
5. **Moratoria.** Springfield passed a six-month pause on data centres above 25 MW (5C exempt); the county limited them to a conditional industrial use with four public meetings; residents petitioned to cap them at 7.5 MW. The stated concerns were electric rates, water and generator emissions. The next 350 MW at the site will be permitted in that climate.
6. **The vendor's angle.** Standby fleets are the one equipment category every landlord buys in bulk and early. Battery storage that replaces part of a diesel fleet solves a permitting problem as much as an energy one, which is the pitch a storage seller makes to a landlord facing a moratorium.

**Self-check:** a site has 19 diesel generators and a permit that limits them to emergency use. What changes if the landlord runs them through a summer peak? (The permit class: sustained running makes them a power plant, with a different permit and emission limits, and it is the kind of thing a moratorium is written about.)

## Module 5 — Liquid cooling and water

**The single idea:** direct-to-chip liquid cooling moves heat with far less air and far less water than the old way, and the water permit is written for the worst day.

1. **Why liquid.** A rack drawing 130 kW cannot be cooled by air at a sane fan speed. Cold plates on the GPUs carry a coolant loop; a coolant distribution unit swaps heat between the rack loop and the building loop. 5C's Phoenix design is direct-to-chip with 'adiabatic trim cooling'; Ohio is 'direct-to-chip liquid cooling, closed loop'.
2. **Closed loop.** The building loop is sealed and re-used; it does not consume water. Heat leaves through dry coolers (radiators with fans) most of the year.
3. **Where water enters.** On hot days a dry cooler cannot reject enough heat, so an adiabatic or evaporative stage sprays water to cool the air first. 5C says it draws water only above 80°F. The permit is sized for that day: 300,000 gallons a day in Ohio.
4. **Permit against use.** 'It's a very common practice in the data center world to apply for a permit for the worst case scenario', 5C's product lead told the local station; expected use is 'around 10% of that'. An on-site reservoir is planned. The permit figure is what opponents quote; the use figure is what the meter shows.
5. **PUE.** Total facility power divided by IT power. Liquid cooling at warm water temperatures pushes PUE toward 1.1 to 1.3, which is tens of megawatts saved at a 350 MW campus. 5C publishes no PUE; its sibling in this corpus, WhiteFiber, targets 1.3.
6. **Immersion.** Hypertec, 5C's largest shareholder, makes immersion-cooled servers. 5C lists immersion as an option in its Turnkey model, but no tenant site on the record uses it; the industry standardised on cold plates for NVL72-class racks.

**Self-check:** a permit allows 300,000 gallons a day and the landlord expects to use 30,000. Which number goes in the moratorium debate, and which on the water bill? (The permit in the debate; the use on the bill. Both are true; they answer different questions.)

## Module 6 — The capital stack, and where new power technology would enter

**The single idea:** a private landlord with no published revenue is financed campus by campus with structured equity, private credit and tax abatements, and the next round decides how much of the roadmap is real.

1. **Structured equity.** Brookfield led the equity in 5C's US$835 million raise 'through its Infrastructure Structured Solutions strategy': preferred or convertible instruments that behave like debt in bad times and equity in good ones. The borrower on that deal was the Ohio campus holding company, not the parent.
2. **Private credit.** Deutsche Bank led the debt in 2025; Brookfield led US$605 million of debt in 2026. The lender looks to the campus's leases and the tenant's credit, as in module 1 of the WhiteFiber plan.
3. **Public money.** A 15-year, 100% city property-tax abatement worth about US$95 million in Ohio; a state job-creation credit worth about US$32 million to the tenant's parent; a Memphis tax freeze applied for and then abandoned. Abatements are part of the return, which is why moratoria and petitions target them.
4. **The next round.** 'An incremental $5 billion or $6 billion in a combination of debt and equity', and an IPO 'absolutely' considered. Against US$1.4 billion raised, that is the price of moving from about 110 MW to 1.5 GW.
5. **Where an SST or 800 VDC would enter.** Nowhere on the record: nothing on 5C's or Hypertec's channels mentions solid-state transformers, 800 VDC or batteries, and the AMD reference-design work is at rack level. The customer-owned substation makes 5C a buyer of conventional transformers and switchgear; a solid-state transformer would replace the step-down stage inside that scope, so the opening exists in principle at the next campus.
6. **The vendor's map.** Substation and transformers (customer-owned in Ohio), medium-voltage switchgear, 19 standby generators, UPS, cooling loops and 'prefabricated power skids' for each phase; behind-the-meter turbines at Memphis without a permit; a 300 MW mystery project in the same utility's queue. No vendor of any of it is named.

**Self-check:** a landlord has raised US$1.4 billion and says its roadmap is 1.5 GW. At the corpus's US$8 to 13 million per megawatt, how much of the roadmap does the money cover? (Roughly 110 to 175 MW of build, which is about what is operational; the next US$5 to 6 billion is the roadmap's actual price.)

## Where the flashcards and self-test point

The in-app guide's flashcards and self-test drill only the concepts above: landlord against neocloud and the Turnkey/Turnkey+ line; utility-owned against customer-owned substations and who buys the transformers; the upfront capacity charge and the two-utility approval; the capacity ladder from announced to leased; standby against continuous duty and the permit each needs; moratoria and what they are written about; closed-loop direct-to-chip cooling, permit against use, PUE; structured equity, private credit and abatements; where an SST would sit inside a customer-owned substation. None tests a family name, a funding date or a site code.

Developed by: LightAISolutions
