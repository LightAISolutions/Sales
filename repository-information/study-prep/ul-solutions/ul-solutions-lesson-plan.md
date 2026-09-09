# UL Solutions — Technology Lesson Plan

**Purpose:** teach **what a safety test physically does to a product, and why a mark is worth paying for** — the sampling logic that makes type testing possible at all; the four measurements that decide whether an electrical product is safe (dielectric withstand, creepage and clearance, temperature rise, ingress protection) and the flammability classification behind the plastics; how a battery is deliberately driven into thermal runaway and what data comes off each level of that test; why the recurring inspection behind a mark is worth more than the test that earned it; and what it means that the organisation publishing the standards is also the controlling shareholder. UL Solutions is the worked example because it owns the mark, does not own the standards, and pays the standards body $22 million a year for access to them.

**How this plan relates to what you already have.** The **CSA Group plan** taught the *institutional* map — standard against code against mark, and the five seats of the North American conformity system. This plan goes to the **bench**: what the laboratory actually does once the institutional question is settled. Do CSA first if you have not. The **DNV plan** teaches what a certificate proves from the lender's chair; the **kWh Analytics plan** teaches the underwriter who reads the fire-test report. The cell-maker plans (**CATL**, **EVE**, **Hithium**) teach thermal runaway inside the cell; Module 3 here starts one level up and asks how you *provoke* it on purpose. The **Intertek plan** (same session) teaches the sampling and measurement science from the inspection side and is the natural sequel.

**Three ideas carry the plan.** You cannot test the thing you are selling, so you test a *representative sample* under *deliberately abnormal* conditions and infer the rest — every safety standard is an argument about which abnormal conditions matter. A certificate is a photograph of one moment; the recurring factory inspection is what makes it a claim about tomorrow, which is why the annuity is worth more than the test. And a mark is worth exactly what the person reading it believes, which is why the fire marshal, not the manufacturer, is the real customer.

**One boundary, held throughout.** UL Solutions publishes capability, not capacity. There are no chamber counts, no kilowatt-hour test ratings and no throughput figures anywhere in its published material, so this plan teaches what the tests *are* and never how many the company can run.

**Suggested pacing:** Module 1 in one sitting (~30 min) — it is the reasoning module and everything else assumes it. Module 2 (~40 min) with a datasheet open. Module 3 (~45 min), the longest and the one this corpus needs most. Module 4 (~30 min). Module 5 (~25 min). Then the flashcards and self-test in the app.

## Module 1 — Why you cannot test a product by using it

**The single idea:** safety testing is a sampling argument wearing a laboratory coat.

**The problem.** A manufacturer ships a million units. You can test ten. Using them normally tells you almost nothing, because the failures that matter are rare, and rare events do not show up in small samples within a useful time. So safety testing does not sample *failures*; it samples *products* and then applies conditions severe enough that a latent weakness becomes a present one.

**Type testing** is the resulting compromise: you test a small number of units representative of production, to a written standard, once — and then you control the thing that would otherwise invalidate the result, which is the factory changing. That control is the follow-up inspection in Module 4, and it is why a certificate without surveillance is close to meaningless.

**The single-fault principle.** The core move in almost every electrical safety standard: assume any one component fails, in the worst plausible way, and require that the product still not injure anyone. Not that it still works — that is reliability, a different discipline — but that it does not electrocute, ignite or eject anything. Two simultaneous unrelated faults are usually out of scope, and that boundary is a judgement, not a law of nature.

**Abnormal operation testing** applies the same logic to use rather than components: block the ventilation, stall the motor, short the output, run it at the wrong voltage, leave it on for a week. The standard writes down which abuses count.

**Why the sample must be "representative".** If the tested unit differs from production, the inference breaks. This is also where an incentive lives: a module built with a deliberately weak point may propagate less in a fire test than one built well, and the standard's requirement that the sample be representative is the only thing standing against that.

**Self-check:** a supplier says its product "passed all safety tests". What have you not been told? *(Which standard, which edition, which laboratory, whether the certification carries surveillance, and whether the tested sample matches what you will be shipped.)*

## Module 2 — The electrical bench: four measurements and a plastic

**The single idea:** almost all electrical product safety reduces to keeping current where it belongs and heat below where things ignite.

**Dielectric withstand** (the "hipot" test). Apply a voltage far above normal operating voltage — often 1,000 V plus twice the working voltage — between conductors and the enclosure, for a fixed time, and require that essentially no current flows. You are not testing whether the insulation works today; you are testing whether it has enough margin to still work after years of heat, vibration and contamination.

**Creepage and clearance.** Two different distances that people conflate. **Clearance** is the shortest distance through *air* between two conductors; it governs whether a spark can jump. **Creepage** is the shortest distance along the *surface* of the insulating material; it governs whether a conductive track can gradually form across that surface as dust and moisture accumulate. Creepage is always at least clearance, usually more, and depends on the material's resistance to tracking and on the pollution expected in the environment. This is why a rated part fails in a dirty installation it would have survived in a clean one.

**Temperature rise.** Run the product at its rated load until temperatures stabilise, and measure how far each part rose above ambient. Every limit is a *rise* above ambient rather than an absolute temperature, because the standard has to hold in Phoenix and in Helsinki. The limits are set by the materials: an insulation class, a plastic's softening point, the temperature at which a surface burns skin.

**Ingress protection (the IP code).** Two digits: the first is solids, the second is liquids. IP65 means dust-tight and protected against low-pressure water jets. The number is a test result, not a promise about a specific installation — IP67 is tested with a defined immersion, not with your particular pressure washer.

**Flammability classification (UL 94).** The plastics grade that runs underneath all of it. A bar of the material is held vertically or horizontally and a defined flame applied for a defined time; the grade records how long it burns after the flame is removed and whether it drips flaming particles. V-0 is the common demanding grade: burning stops within ten seconds and drips do not ignite cotton below. When a datasheet quotes a UL 94 rating it is quoting a material property tested to a standard the manufacturer's material supplier paid for, not a property of the finished product.

**Self-check:** why does a standard specify temperature *rise* rather than a maximum temperature? *(Because the same product must be safe in different ambient conditions; the rise is the property of the design, the absolute temperature is a property of the room.)*

## Module 3 — The battery bench: provoking a fire on purpose

**The single idea:** a battery safety test is not asking whether a cell can fail — it is asking what the *neighbours* do when one does.

**The premise.** Lithium-ion cells fail. That is assumed, not tested. The question every code cares about is **propagation**: when one cell goes into thermal runaway, does it take the module, the rack, the container and the building with it? So the test method deliberately drives a cell into runaway and instruments everything around it.

**How you initiate runaway.** You need a repeatable trigger that mimics a real failure without being one: typically a film heater bonded to a cell, sometimes nail penetration or overcharge. The choice matters, because the initiation method shapes the energy and gas release, and a test is only comparable with another test that initiated the same way.

**The ladder, and what each rung answers.** The UL 9540A test method (published by UL Standards & Engagement, run by UL Solutions and others) is built as a sequence in which each level's output decides whether the next is needed.

- **Cell level** — drive one cell into runaway in a controlled chamber. Outputs: the temperature at which runaway begins, the total energy released, and crucially the **composition and volume of the vent gas**. That gas composition is the input to every explosion calculation downstream.
- **Module level** — does runaway in one cell propagate to its neighbours inside the module? Outputs: propagation yes or no, heat release rate, gas release rate, and whether the released gas can deflagrate.
- **Unit level** — does fire spread between modules inside one enclosure? Same measurements at enclosure scale.
- **Installation level** — the large-scale fire test. Multiple enclosures at the spacing you actually intend to build, and the question is whether fire crosses the gap, and for indoor installations whether the building's own suppression system copes.

**What changed in 2026, and why it matters.** The sixth edition of UL 9540A (published 2026-03-13) restructures this. It drops the unit level for most cases and makes the **installation-level large-scale fire test** the third and decisive rung — retaining the unit test only for residential systems and for non-residential systems carrying an active thermal-runaway propagation prevention system. It also assumes a **post-deflagration condition** and introduces intentional ignition of the vented gases. Read plainly: the industry spent years arguing whether the mandatory test was really a large-scale fire test, and the sixth edition settled it by making it one.

**The residential fork.** UL 9540B exists because authorities having jurisdiction decided UL 9540A alone did not satisfy the 2022 California Fire Code for home batteries. It applies **only to residential systems of 20 kWh or less**, drops the module test, keeps the cell test and adds a fire-propagation test with purposeful ignition of vented gases. It is an **Outline of Investigation**, not a consensus standard. If you meet it in a grid-scale context, someone has cited the wrong document.

**Where the test stops.** UL 9540A is a **test method**, so it produces a report, not a certificate — nobody is "UL 9540A certified", and no laboratory holds regulatory recognition to run it, because recognition attaches to certifying against safety standards. UL 9540 is the certification standard for the system; NFPA 855 is the installation rule that consumes both. Three documents, three jobs, and tenders confuse them constantly.

**Self-check:** a developer says its containers are "9540A tested, no propagation". What have you still not learned? *(At which level, initiated how, at what spacing, to which edition — and whether the installation-level test was run at the spacing you are actually building.)*

## Module 4 — The mark as a business: why the annuity beats the test

**The single idea:** the test is the customer acquisition cost; the inspection is the product.

**Two revenue lines, one relationship.** Certification testing earns a fee once. **Ongoing certification services** — periodic unannounced factory inspections, follow-up audits, sample testing, control of how the label is applied — earn a fee every year, for as long as the manufacturer wants to keep using the mark. At UL Solutions the recurring line is the larger of the two, about a third of all revenue. That ratio is the business model in one number.

**Why surveillance is not optional.** Go back to Module 1: type testing infers a million units from ten. That inference only holds while the factory keeps building the same thing. Surveillance is what makes a two-year-old certificate a statement about this month's production. Remove it and the certificate decays into a historical fact.

**Capacity arbitrage.** A laboratory can only run so many tests, which caps a certifier's growth at the rate it can build benches — unless it can borrow someone else's. Data-acceptance programmes solve this: the certifier qualifies a customer's or a third party's laboratory, supervises or witnesses the testing there, audits every submitted result and re-assesses the laboratory annually. UL Solutions runs a family of these, and qualified CATL's own energy-storage laboratory under the witnessed variant to test to UL 9540A. It is neither a franchise nor blind acceptance, and it is how a company with 87 laboratory sites certifies against 4,000-plus standards.

**Who the real customer is.** A manufacturer pays the invoice, but the mark's value is set by whoever has to be convinced: the electrical inspector, the fire marshal, the insurer, the retailer that will not stock an uncertified product. This is why a certifier's standing with code authorities is a commercial asset, and why service launches get co-quoted by fire chiefs.

**And where the premium is vulnerable.** Any recognised laboratory may certify to the same standard, and the alternatives are marketed as equivalent — independent compliance literature reports one competing mark at 25 to 50 per cent below UL pricing, at up to half the turnaround, for the same regulatory outcome. The premium is defended by brand and by the AHJ's habits, not by law. The structural threat is not a cheaper competitor but **mutual recognition**: a regime that forces acceptance of third-party results, or reduces how often re-inspection is required, attacks the annuity rather than the test.

**Self-check:** a manufacturer moves from one recognised mark to another to save 30 per cent. What has it actually lost? *(Nothing legally — the regulatory outcome is the same. What it risks is the reading: retailers, insurers and inspectors who recognise one mark faster than the other.)*

## Module 5 — When the standards writer is your controlling shareholder

**The single idea:** the structure everyone assumes is a conflict is, in the filings, disclosed as a risk running the other way.

**The three entities.** Get these apart before anything else. **UL Solutions Inc.** is the listed company that tests, certifies and sells software. **ULSE Inc.**, operating as UL Standards & Engagement, is the non-profit that publishes the UL standards. **Underwriters Laboratories Inc.**, operating as UL Research Institutes, is the non-profit above it and ULSE's sole member. A source saying "UL" could mean any of the three.

**Who owns what, and it is the reverse of the intuition.** UL Solutions **owns the UL Mark** and licenses it to the two non-profits royalty-free. It does **not** own the standards; it pays ULSE $22 million a year for access to the library it tests against, booked in cost of revenue. So the brand sits in the public company and the rules sit in the charity.

**What a controlled company is.** ULSE holds every Class B share, at ten votes each against one for Class A — about 61.6 per cent of the equity and **94.1 per cent of the votes**. That qualifies UL Solutions for exemptions from several NYSE governance requirements, which it says it has not used. Control lapses on a "sunset date": the earlier of April 2031 or ULSE's holding falling below 35 per cent of its post-IPO stake.

**Why a $1.1 billion share sale moved control by 1.5 points.** In December 2025 ULSE sold 14,375,000 shares at $78.00. Because it held no Class A shares, it had to *convert* Class B into Class A to create them — and Class B converts one-for-one but loses nine votes in the process. Voting power went from 95.6 to 94.1 per cent. **A ten-vote structure lets a holder monetise for years without losing control**, and the filings say so.

**What a secondary offering is, and is not.** In a **secondary**, existing shares change hands and the **company receives nothing**. All three UL Solutions offerings — the April 2024 IPO at $28.00, September 2024 at $49.00 and December 2025 at $78.00 — were sales by ULSE. The company has never raised money from its own listing.

**The conflict question, read honestly in both directions.** The obvious criticism is that a commercial laboratory should not be governed by the body writing the standards it tests to. The obvious defence is that the standards sit in a non-profit precisely so the laboratory cannot own them, that standards panels are balanced across nine interest categories including regulators and authorities having jurisdiction, and that any recognised laboratory may certify to the same documents. Two facts sit on the record and pull opposite ways: the **same person chairs both boards** — UL Solutions' and ULSE's — and previously ran the NFPA; and the company's own risk factors disclose the relationship as a **danger to itself**, warning that ULSE could publish standards forcing customers to redesign products, and that the research institute could publish findings damaging to customers. What is genuinely thin is the evidence: no substantial independent investigation of the relationship has been published since the 2024 listing.

**Self-check:** if a code names a UL standard, who captures the value? *(Not solely the company with the same initials. The mandate accrues to the standard, which any recognised laboratory may certify against; UL Solutions captures the largest share plus the brand rent on the mark it owns.)*

Developed by: LightAISolutions
