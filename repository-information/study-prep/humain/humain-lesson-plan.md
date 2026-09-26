# HUMAIN — Technology Lesson Plan

**Purpose:** teach the sovereign neocloud, starting from high-school STEM. A sovereign neocloud is a state-owned builder that rents GPU capacity to foreign labs and platforms. The plan covers:
- the three routes by which such a company gets capacity;
- who signs what when the owner, the engineering-procurement-construction contractor and a work order stand between the owner and the equipment;
- how power reaches a rack from a 380 kV transmission line, and why substations are rated in MVA rather than MW;
- what GPU-as-a-service sells, and how a revenue-sharing deal differs from a lease;
- how to read a capacity ladder that runs from one megawatt energised to six gigawatts announced;
- why export licences for chips behave like a supply chain.

It closes on the buying process a power-equipment seller has to enter. No company trivia: founding dates, executives, investments and valuations stay in the dossier. Generated 2026-09-26 from the Profiler dossier (profileVersion 1). The in-app guide (Profiler → HUMAIN → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Firmus plan teaches a neocloud that buys its own power train. This one teaches a neocloud whose contractor buys it. The G42 plan teaches its Gulf rival, which holds the stronger US export position and a landlord arm of its own.

**Suggested pacing (before 7 October 2026):** Module 1 (~15 min — the sovereign neocloud), Module 2 (~25 min — owner, EPC and work order; the most important module), Module 3 (~25 min — from 380 kV to the rack), Module 4 (~15 min — GPU-as-a-service), Module 5 (~15 min — reading the ladder), Module 6 (~15 min — licences as a supply chain), then the flashcard and self-test passes in the app.

## Module 1 — The sovereign neocloud

**The single idea:** a sovereign neocloud is a state-owned company that builds AI computing capacity at home and rents most of it to foreign customers, so its customers are labs and platforms and its supplier relationships run through contractors and partners.

1. **What it sells.** HUMAIN sells GPU capacity to others: named customers and partners include xAI, Together AI, Adobe, Luma and an AWS 'AI Zone'. Its chief executive said in 2025 that it served 130 international clients, with Saudi Arabia 'just 1% of usage'. That is export-oriented computing, the way a country with spare energy exports the energy.
2. **Not a hyperscaler.** A hyperscaler runs a giant cloud of its own services. HUMAIN's own cloud launched at 1.1 MW, and its models and apps are small beside the capacity it builds and lets to others. That is why the corpus types it as a neocloud rather than a hyperscaler.
3. **Three routes to capacity.** (a) *Owner-built*: an engineering-procurement-construction (EPC) contractor designs and builds a private AI data centre for HUMAIN. (b) *Its own campus*: a large site in east Riyadh whose grid infrastructure HUMAIN tendered. (c) *Partner-led*: another developer builds and runs the site — DataVolt at Oxagon, AirTrunk, AWS's AI Zone. HUMAIN also leases colocation space when it needs capacity sooner.
4. **Why the route matters to a seller.** In route (a) the contractor buys the equipment, against designs the owner approves. In route (b) the owner specifies the grid equipment through its advisers. In route (c) the partner buys. One company, three buyers.
5. **The mandate.** Its launch brief was to 'streamline various data center initiatives, procure hardware', and one chip partner's release says HUMAIN 'will oversee end-to-end delivery, including hyperscale data center, sustainable power systems'. It is the owner of record even where it is not the purchaser of record.

**Self-check:** on a partner-led campus, who is the first call for a transformer maker? (The partner that builds it; the sovereign owner shapes demand but does not issue that purchase order.)

## Module 2 — Owner, EPC and work order

**The single idea:** a framework contract is a ceiling and a work order is money; being selected to help design is not being awarded the build; and the equipment order comes from the contractor, inside a design the owner has accepted.

1. **Design-build, then EPC.** HUMAIN's first owner-built programme began as a 50 MW, 12-month design-build contract (March 2026, about SAR 1.88B). In September 2026 it became a 250 MW EPC agreement worth about SAR 8.76B. In design-build, one party is responsible for both design and construction. EPC adds procurement: the contractor also buys the equipment and hands over a working plant.
2. **Work orders.** The EPC works are 'carried out under work orders issued by HUMAIN'. The agreement sets prices and rules, but only a work order commits a phase and the money for it. Read the headline value as a ceiling, not as money already spent.
3. **Per-megawatt arithmetic.** SAR 8.76B ÷ 250 MW ≈ SAR 35M per MW, about US$9M at 3.75 riyals to the dollar; the first contract works out at about SAR 38M per MW. Neither filing says whether IT equipment is included, so compare these figures with other projects only after checking the scope.
4. **A tender is not an award.** For the east-Riyadh campus, HUMAIN tendered the grid infrastructure on an early-contractor-involvement (ECI) basis. The trade press that reported a contractor 'selected' called it 'an early contractor involvement role, not a definitive construction award'. ECI puts a contractor at the design table before the price is fixed, and the construction contract comes later.
5. **Who writes the specification.** The campus had three client advisers: an engineering firm, an infrastructure consultancy and a real-estate adviser. Advisers like these write the specifications a contractor then prices. The seller's job therefore has two steps: get the product accepted into the design the owner approves, then win the contractor's purchase order.

**Self-check:** a news story says a contractor was 'selected' for a campus's infrastructure under ECI. Can a supplier book that as an order pipeline? (No — ECI is a design-stage appointment; the construction award, and the purchase orders under it, come later.)

## Module 3 — From 380 kV to the rack

**The single idea:** power reaches a rack by stepping down through voltage levels, each with its own substation. Every one of those substations is rated in MVA, and the rating caps the megawatts behind it.

1. **Why transmission is high voltage.** Power is voltage times current, and line losses grow with the square of the current. Carrying power at 380 kV rather than 33 kV needs about a twelfth of the current, which cuts losses on long lines. Voltage then has to come down in stages before it reaches equipment people can safely work beside.
2. **The chain as tendered for the east-Riyadh campus.** The tender covered a '380kV/132kV/33kV electrical distribution network, two substations with a capacity of 500MVA and 200MVA, bulk supply point (2,000MVA)'. Step by step: the bulk supply point takes 380 kV from the transmission grid and steps it to 132 kV; the 132 kV substations step it to 33 kV; 33 kV feeds the data halls, where transformers step it to low voltage for the UPS and the racks.
3. **MVA against MW.** Transformers and substations are rated in apparent power (MVA): volts times amps, whether or not the current does useful work. Real power (MW) is MVA times the power factor. At a power factor of 0.95, 2,000 MVA carries about 1,900 MW. Equipment is sized on MVA because heat in the windings depends on current, not on how useful that current is.
4. **Firm capacity is less than nameplate.** Substations are usually built with one transformer more than the load needs, so that losing any one still leaves full supply. A substation's firm capacity is therefore below the sum of its transformer ratings. This is general practice; the tender's redundancy scheme is not published.
5. **Arithmetic on the tender.** A 2,000 MVA bulk supply point carries at most about 2 GW. The campus is described as six 1 GW plots, up to 6 GW. The tendered supply point is therefore a first phase, and later phases would need more transmission capacity. That is an inference from the figures, not a published plan.
6. **The grid contract.** On 2 September 2026 the national grid company and HUMAIN signed an agreement covering 'the provision of electricity to the AI data centers project in Riyadh'. No megawatts or dates were disclosed. HUMAIN is the grid counterparty — the owner, not the contractor, signs for the power.

**Self-check:** a substation is rated 500 MVA and the load's power factor is 0.9. What is the most real power it can deliver? (About 450 MW — and less as firm capacity if one transformer is held in reserve.)

## Module 4 — GPU-as-a-service and the revenue share

**The single idea:** a neocloud can be paid three ways — rent for space and power, a price per GPU-hour, or a share of what its partner's customers pay. Each puts the risk in a different place.

1. **Training and inference.** Training builds a model by running huge batches of data through thousands of tightly coupled GPUs for weeks. Inference runs the finished model to answer requests, which is spread out, sensitive to delay and grows with users. The GPU-as-a-service that went live in August 2026 on AMD MI355X systems covers use cases 'from model training to inferencing'.
2. **Three ways to be paid.** A *lease* charges rent per kilowatt-month, and the tenant owns the servers and the demand risk. *GPU-as-a-service* charges per GPU-hour or for reserved capacity; the provider owns the GPUs and carries the risk of idle hours. A *revenue share* splits what end customers pay between the capacity owner and the partner that sells to them, so neither party earns unless the end demand arrives.
3. **An example of the third.** HUMAIN and Together AI plan a new 250 MW data centre plus 55 MW of dedicated capacity that Together resells to its customers. The partnership is 'expected to yield over $5 billion in gross annualized revenue in its first year' — a projection for an unbuilt facility, shared under a revenue-sharing arrangement.
4. **Who pays when the seller is also the investor.** Two of HUMAIN's anchor customers are companies it invested in before they took capacity. For a supplier this matters: the credit behind a campus's demand sits partly with the state-owned seller itself rather than with an independent tenant.
5. **What the physical build must deliver.** Training halls need dense, liquid-cooled racks and very fast networks inside a building. Inference can be spread across sites and closer to users. A capacity seller that serves both designs halls for the harder case.

**Self-check:** in which payment model does the capacity owner earn nothing if its partner fails to find end customers? (A revenue share — a lease pays regardless, and GPU-as-a-service on a reserved contract pays for the reservation.)

## Module 5 — Reading a ladder from 1 MW to 6 GW

**The single idea:** when announced capacity is a thousand times the energised capacity, read the ladder rung by rung and ask what stands behind each rung.

1. **The rungs (company and trade-press figures).** Energised: an NVIDIA cloud launched at 1.1 MW, plus an AMD cluster live since August 2026 of undisclosed size. Contracted to build: 250 MW under the EPC agreement. Frameworks: an xAI facility starting at 50 MW and expanding to 500 MW; 250 MW with Together AI; a chip-maker joint venture's next phase of up to 250 MW from 2027, within a 1 GW-by-2030 target. Targets: 1.9 GW by 2030 and more than 6 GW by 2034. Campus: 'up to 6 gigawatts'.
2. **Orders of magnitude.** 1.9 GW ÷ 1.1 MW ≈ 1,700 — about three orders of magnitude. A bar chart on a straight scale cannot show the energised rung at all. That is the point: most of the ladder is promises of different strengths.
3. **Strength of each rung.** Energised capacity bills today. A signed EPC with work orders is capital committed. A framework or memorandum is intent. A target is a plan. A campus maximum is a site limit. Weigh each figure by its rung before adding it to anything.
4. **Figures that do not reconcile.** For the campus's first phase, the company is relayed as saying it 'will deliver 1GW of capacity by or in 2027', while another report gives 250 MW by the start of 2027. No source reconciles the two, so state both and do not pick one.
5. **An outside test.** An independent rater of GPU clouds lists HUMAIN as 'Unavailable' because it could not get a login and a working cluster to test. That is not a verdict on quality, but it means no one outside has verified the energised rung.

**Self-check:** you are forecasting equipment demand for 2027. Which rungs belong in the forecast? (The signed EPC under work orders, with its phasing; frameworks and targets are scenarios, not demand.)

## Module 6 — Export licences as a supply chain

**The single idea:** outside the closest US allies, every advanced GPU shipment needs a US licence, so the licensed chip count caps how much of a campus can ever be filled.

1. **Country groups.** US export rules sort countries into lettered groups. The UAE was moved to Country Group A:5 on 10 July 2026, the group with the fewest licence requirements. Saudi Arabia was not moved, so shipments of advanced chips there still need licences.
2. **The licence as a supply cap.** The only disclosed US authorisation for HUMAIN covers up to 35,000 GB300-equivalent chips. Its NVIDIA plan runs to 'up to 600,000' GPUs over three years across Saudi Arabia and the United States, and 120,000 chips are promised to one partner's build alone. Chips are counted in performance-equivalent units, so a licence behaves like a quota.
3. **Chips to megawatts.** A rack of 72 top-end GPUs draws well over 100 kW, roughly 2 kW per GPU at the rack. At that rate 35,000 GPUs need about 70 MW of IT, and 600,000 need about 1.2 GW. These are order-of-magnitude estimates, not disclosed figures. They show why an unlicensed campus is stranded capacity: a building powered and cooled with nothing to run.
4. **End-use and end-user controls.** Even in a favourable country group, rules tied to who uses a chip, or what it is used for, still apply. Reviewers look for links to restricted parties. One of HUMAIN's models was built by a Chinese company, which gives reviewers a question to ask.
5. **What this means for power equipment.** Grid and power equipment is ordered years ahead; chips are licensed tranche by tranche. A campus's electrical build can run ahead of its licences. That favours phased, modular power equipment that can be energised as licences arrive, over one-shot builds.

**Self-check:** why is a second US licence for HUMAIN a leading indicator for power-equipment demand at its campuses? (It raises the number of chips that can be deployed, and so the number of megawatts worth energising.)

## Where the flashcards and self-test point

The in-app drill tests the concept chain above:
- the sovereign neocloud against the hyperscaler, and the three routes to capacity with a different buyer on each;
- framework against work order, and ECI against award;
- the 380/132/33 kV chain and the bulk supply point;
- MVA against MW, and firm capacity against nameplate;
- lease, GPU-as-a-service and revenue share;
- reading a ladder by rung strength;
- licences as a cap on megawatts.

None tests a date, a name or an investment.

Developed by: LightAISolutions
