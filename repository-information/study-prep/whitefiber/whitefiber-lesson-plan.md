# WhiteFiber — Technology Lesson Plan

**Purpose:** starting from high-school STEM, teach the small listed company that is both a neocloud and a data-centre landlord, and use its record to teach three things the corpus keeps meeting: what a contracted backlog is and why a lease is worth more to lenders than a cloud, where the utility's equipment ends and the customer's begins at a data-centre meter, and why a medium-voltage switchgear supply issue can delay an US$865 million lease. It ends with the financing stack of a controlled company and where an SST, 800 VDC, batteries or fuel cells would enter. No company trivia: executives, share counts and IPO dates stay in the dossier. Generated 2026-09-29 from the Profiler dossier (profileVersion 1). The in-app guide (Profiler → WhiteFiber → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Nscale guide teaches the anchored neocloud from the tenant's side; this one teaches the same lease from the landlord's side. The Firmus guide teaches a neocloud that builds its own substations; WhiteFiber takes an existing factory feed instead. The Duke Energy guide teaches the utility's tariff; module 3 here is the customer's end of the same wire.

**Suggested pacing (before 7 October 2026):** Module 1 (~15 min — two businesses, one backlog), Module 2 (~15 min — the retrofit and the three megawatts), Module 3 (~25 min — the meter as a property line; the most important module), Module 4 (~20 min — medium-voltage switchgear and why it delays a lease), Module 5 (~15 min — the financing stack), Module 6 last (~10 min — where new power technology would enter), then the flashcard and self-test passes in the app.

## Module 1 — Two businesses, one backlog

**The single idea:** a company can rent GPUs and rent halls at the same time, and the contracted backlog tells you which of the two the lenders are paying for.

1. **What a neocloud sells.** Time on GPUs it owns: reserved instances, managed private clouds, bespoke clusters. WhiteFiber's cloud lists GB300, B300, H100 and VR200 systems on a 3.2 Tb/s fabric and claims 99.95% average uptime. Its revenue is recognised as the hours are used, and a customer that stops using them stops paying: the customer that was 70.7% of 2025 revenue was terminated in 2026.
2. **What a landlord sells.** Powered, cooled space under a lease of years. The tenant brings the servers. WhiteFiber's Enovum arm leases MTL-3 to one chip company for five years and NC-1 to Nscale for ten. Rent is owed whether or not the tenant's GPUs are busy.
3. **Remaining performance obligations.** Accounting's name for contracted revenue not yet earned. At 30 June 2026 WhiteFiber carried about US$1,008 million of it: US$933 million from colocation and US$75 million from cloud. One lease is 93% of the backlog; the cloud, which is most of today's revenue, is 7% of tomorrow's.
4. **Why lenders read the backlog, not the revenue.** A ten-year lease to a tenant with an investment-grade offtake behind it can be borrowed against as if it were a bond. A sell-side analyst values NC-1 alone at US$1.56 billion, more than twice the whole company's market value. The cloud, rated 'Underperforming' by the only independent benchmark, gets no such multiple.
5. **The tenant's side of the same lease.** Nscale's own filing shows a US$1.2 billion GPU loan for 'the applicable data center' in North Carolina, rated investment grade. The landlord finances the building; the tenant finances the servers; the hyperscaler behind the tenant is the credit both of them borrow on.

**Self-check:** a company reports US$29 million of quarterly revenue, four-fifths of it cloud, and a US$1.0 billion backlog, 93% of it colocation. Which business is the balance sheet built on? (The colocation: the backlog is what can be financed, and it is almost entirely one lease.)

## Module 2 — The retrofit and the three megawatts

**The single idea:** the fastest data centre is a building that already has a big electrical feed, and the three megawatt figures every site carries measure different things.

1. **Adaptive reuse.** WhiteFiber does not build shells on farmland. It bought a yarn plant (NC-1, about 1,000,000 square feet on 96 acres), a mattress factory (MTL-3) and two more textile buildings (NC-2/NC-3). The company says a retrofit takes 'approximately six months' at 'approximately $8 to $10 million' per gross megawatt, against an industry average it puts at US$13 million.
2. **Why the feed matters more than the floor.** A factory that once ran spinning lines already has a utility service agreement, a substation and a transmission tap. NC-1 inherited the plant's electric service agreement by assignment, which is why 54 gross MW could arrive within a year of purchase without a new large-load interconnection.
3. **Gross MW.** What the utility delivers to the site: the whole building's draw, cooling and losses included. Duke's letter for NC-1 promises 24, then 40, then 99 gross MW; 54 gross MW had been delivered by May 2026.
4. **IT MW.** What the servers draw, the number a lease is written on. The Nscale lease is 40 MW of critical IT load in two 20 MW phases. At a target PUE of 1.3, 40 MW of IT needs about 52 gross MW, which is why the first 54 gross MW map onto one 40 MW tenant.
5. **Contracted MW.** What customers have signed for, built or not. WhiteFiber counts about 65 gross MW online in Q3 2026 and a pipeline of 1.3 to 1.5 GW; NC-2/NC-3 come with 'a combined minimum of 60 MW' and a potential 200 MW, subject to closing, financing and leasing.
6. **The earn-out as a megawatt meter.** The seller of NC-1 gets US$8 million more if the utility delivers or contracts at least 99 MW within two years, US$5 million within three, and US$200,000 for each megawatt over 99. The price of the building was written in megawatts.

**Self-check:** a lease says 40 MW of IT and the utility letter says 99 MW. Are they the same megawatt? (No: IT against gross. At PUE 1.3 the 40 MW of IT needs about 52 gross MW, and the 99 gross MW would carry roughly 76 MW of IT.)

## Module 3 — The meter as a property line

**The single idea:** at a data centre the utility owns the equipment on one side of the meter and the customer owns everything on the other, and the documents that fix the line are a letter, a service agreement and a tariff.

1. **The chain, grid to rack.** Transmission line → utility substation (transformers step down to a distribution voltage, here 24 kV) → the customer's medium-voltage switchgear → the customer's transformers to low voltage → UPS and batteries → distribution to the racks. Backup generators sit beside the UPS. The meter sits between the utility's substation and the customer's switchgear.
2. **'Extra Facilities'.** Duke's assigned service agreement for NC-1 names the 'overhead lines, substations, transformers, breakers, and metering equipment' as Duke-owned Extra Facilities, built at Duke's cost of about US$1.14 million and recovered through a US$11,405 monthly charge. The customer pays for them over time; it does not buy them.
3. **The customer's scope.** WhiteFiber's own filings list what it buys: 'power distribution equipment, generators, and cooling systems', 'power distribution units', battery storage systems that transit Mexico. That is the medium-voltage switchgear and everything downstream. A power-equipment seller's customer is the party on this side of the line.
4. **A letter agreement is not a service agreement.** Duke's 16 May 2025 letter promises 'commercially reasonable efforts' to deliver 24, 40 and 99 gross MW on a schedule and states that Duke 'does not guarantee timelines can be met'. The executed service agreement is the one inherited from the yarn plant. The 10-K says no agreement for more than 99 MW has been received. The 200 and 300 MW figures are the company's belief.
5. **The tariff behind both.** Every term defers to 'Duke Energy tariffs and schedules approved by the North Carolina Utilities Commission'. North Carolina is writing a large-load tariff in a separate proceeding to finish before 2027 rates take effect; whatever minimum bill and term it sets will govern the next phases at NC-1.
6. **Contrast: the customer-owned substation.** At 5C's Ohio site the transmission owner records that 'the customer will own' the substation. Same wire, different property line: there the customer buys the transformers and breakers too. Ask which model a site uses before asking who buys what.

**Self-check:** a landlord says its utility has 'secured 99 MW'. What three documents would prove it, and which one does WhiteFiber have? (A letter of intent, an executed electric service agreement for that load, and the tariff it sits under; WhiteFiber has a letter for 99 MW and an executed agreement inherited at a smaller load.)

## Module 4 — Medium-voltage switchgear: the item that delays a lease

**The single idea:** medium-voltage switchgear is the first thing the customer owns after the meter, it is built to order, and when it is late or fails commissioning nothing downstream can be energised.

1. **What it is.** A lineup of metal-enclosed cabinets at 5 to 35 kV (NC-1 is served at 24 kV) holding circuit breakers, disconnects, protection relays and metering. It takes the utility's feed, protects the site against faults, and splits the power into feeders for the transformers that step it down to the 480 V the UPS and racks use. It is the site's main fuse box, at the scale of a building.
2. **Why it is on the critical path.** Every downstream item, transformers, UPS, generators, cooling plant, is tested against a live medium-voltage bus. No switchgear, no bus, no commissioning. Lead times for medium-voltage gear have run 12 to 18 months in the current cycle, and the relays and breakers inside come from a short list of makers.
3. **What WhiteFiber said.** On 14 May 2026: 'a recently identified supply-chain-related issue affecting certain medium-voltage switchgear components'. On the call: 'not a broad equipment availability issue', and delivery would be 'a scaled ramp-up type delivery instead of a one lump sum on day one'. On 12 August: 'The pace of the ramp was affected by delivering and commissioning issues involving certain switchgear equipment. Those issues have since been resolved.'
4. **What it cost.** The two 20 MW phases were due 30 April and 30 May 2026. Initial billing began in the third quarter and the full 40 MW run rate was expected in August. Roughly a quarter of rent on a lease worth about US$7 million a month, and a cut to the sell side's 2026 estimates. The supplier is not named anywhere.
5. **'Components', not 'switchgear'.** The wording points at parts inside the lineup, breakers, relays, bushings, rather than the cabinets themselves, and at commissioning rather than delivery. That is the pattern of the current shortage: the enclosure arrives, the protection package does not, or fails its tests.
6. **Why it matters for a power-equipment seller.** This is the one place on WhiteFiber's record where its buying authority was exercised and failed. A vendor that can deliver medium-voltage gear on a retrofit schedule of six months is selling into a demonstrated pain. The utility side of the meter, Duke's substation and transformers, was on time.

**Self-check:** the utility finished its substation in May and the tenant's rent started in August. Where did the three months go? (Inside the customer's scope: medium-voltage switchgear components that arrived late or failed commissioning, so the bus downstream could not be energised.)

## Module 5 — The financing stack of a controlled company

**The single idea:** a small listed company with a big lease finances the building with a mix of convertibles, a parent's loan and project debt, and its parent's control shrinks with every share it issues.

1. **A carve-out with a parent.** Bit Digital formed the business, floated 25% of it and kept 27 million shares. A 'controlled company' under Nasdaq rules is one where a single holder has more than half the votes; it may skip some board-independence rules, and WhiteFiber says it does not currently do so.
2. **Convertible notes.** Debt that the holder may swap for shares at a set price. WhiteFiber issued US$230 million at 4.5% in January 2026 (convertible at US$25.91) and US$310 million at 5.0% in August (at US$33.84), using part of the second to retire most of the first. Cheaper than straight debt because the option is worth something; costly in dilution if the shares rise.
3. **Dilution and control.** The August exchange issued about 6.3 million shares. Bit Digital's fixed 27 million went from about 70% to about 59.9% without selling one share. Two more such issues and the parent is below half.
4. **The related-party loan.** The parent lent the NC-1 project company US$100 million at 9.5% plus a 1.1x minimum return, funded by its own borrowing against Ethereum at 5.45%. Two independent committees and two fairness opinions were needed because the lender and borrower share a chief executive. It bridges to a project financing 'with a consortium of lenders' that was in exclusivity in August 2026.
5. **Project finance.** Debt secured on one asset's contracted cash flow rather than on the company. The NC-1 lease, with an investment-grade offtake behind the tenant, is the collateral; the lender looks through WhiteFiber to Nscale and through Nscale to its hyperscaler.
6. **Reading the numbers.** IPO proceeds of about US$183 million were spent within the year; six-month capex in 2026 was US$345 million on US$51 million of revenue. The cash comes from the stack above, and the stack rests on one lease.

**Self-check:** a parent pledges not to sell any shares in 2026, yet its stake falls ten points. How? (The subsidiary issued new shares, in a convertible-note exchange; control dilutes by issuance as surely as by sale.)

## Module 6 — Where new power technology would enter

**The single idea:** nothing on WhiteFiber's record points at an SST, 800 VDC or a battery project, and the one generation plan is a third party's fuel cells, so the openings are conventional.

1. **Fuel cells behind the meter.** The company says it 'intends to deploy natural gas fuel cell generation technology' behind the meter 'by partnering with third-party energy providers'. A fuel cell converts gas to electricity electrochemically, without combustion, in modular blocks that can be added as load grows; the provider owns and operates them and sells the power. WhiteFiber would be the offtaker, not the buyer of the equipment.
2. **Batteries.** The only mention is a risk factor: battery storage systems used in the North American sites 'are manufactured in or pass through Mexico'. That is UPS battery supply, not a grid-scale project.
3. **Where an SST or 800 VDC would appear.** Nowhere on the company's channels. The retrofit model reuses a 24 kV feed and conventional transformers; the racks are NVL72-class at up to 150 kW per cabinet on standard 480 V distribution. A solid-state transformer or an 800 VDC bus would first make sense at NC-2/NC-3, designed from scratch for 2027, if a tenant asked for it.
4. **What the rating measures.** ClusterMAX tests a cloud's networking, orchestration, monitoring and security attestation. WhiteFiber's networking passed; its Slurm and Kubernetes layer did not work and it lacked a SOC 2 or ISO 27001 attestation. The rating says nothing about the halls, which is why the landlord business can be worth more than the cloud it rates.
5. **The vendor's map.** Utility side: Duke. Customer side today: medium-voltage switchgear (the demonstrated gap), transformers, UPS, generators, direct-to-chip cooling for two 20 MW phases. Customer side next: NC-2/NC-3's 60 to 200 MW and MTL-2's 5 MW. Generation: a fuel-cell provider to be named.

**Self-check:** a company intends fuel-cell generation 'by partnering with third-party energy providers'. Who buys the fuel cells? (The provider; the data centre signs a power contract, not an equipment order.)

## Where the flashcards and self-test point

The in-app guide's flashcards and self-test drill only the concepts above: what remaining performance obligations are and why one lease dominates them; gross against IT megawatts and the earn-out written in megawatts; the utility's Extra Facilities against the customer's scope; a letter agreement against an executed service agreement; what medium-voltage switchgear does and why late components delay rent; convertible notes and dilution by issuance; the related-party loan and project finance; who buys a third party's fuel cells; what a ClusterMAX rating does and does not measure. None tests a date, a name or a share count.

Developed by: LightAISolutions
