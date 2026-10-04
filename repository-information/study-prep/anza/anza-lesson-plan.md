# Anza — Technology Lesson Plan

**Subject:** Anza (Anza RE, LLC; Anza Renewables), with Solar Pro, Energy Storage Pro, Energy Storage DG, Anza Pulse, the Transformer Procurement Service and Anza Exchange · **Written:** 2026-10-04 from the Profiler dossier (profileVersion 1) · **Baseline assumed:** high-school STEM, no energy-procurement background.

**Purpose:** teach what a procurement-intelligence firm does between the equipment factory and the project, why a buyer pays for a comparison it could in principle run itself, and how US tax-credit and tariff rules turned product selection into a compliance exercise:
- price per watt, efficiency, degradation and warranty — and why the cheapest module is rarely the cheapest project;
- the two-sided data exchange: suppliers give, buyers pay, and coverage is the whole game;
- the compliance layer — FEOC, domestic content, Section 232, the FCC Covered List, AD/CVD and UFLPA — as per-product filters;
- scenario modelling for a battery project, and what the engine does not do;
- reading a tariff shock through platform data;
- buying transformers: why one component gets its own procurement service;
- where the model sits against the independent engineer and the testing laboratory.

No company trivia: founding dates, executives, ownership and revenue stay in the dossier. The in-app guide (Profiler → Anza → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The **DNV** and **Sargent & Lundy** plans teach the independent engineer whose report the lender relies on — the step after the comparison this company sells; **kWh Analytics** teaches the insurer's view of the same equipment; the **Fluence**, **Tesla** and **Sungrow** plans teach the products that appear as rows on the platform; the **GridStor** and **Aypa Power** dossiers are named clients.

**Suggested pacing (before the Section 232 polysilicon tariff takes effect on 4 December 2026):** Module 1 (~15 min), Module 2 (~15 min), Module 3 (~20 min), Module 4 (~10 min), Module 5 (~10 min), Module 6 (~10 min), Module 7 (~10 min), then the flashcards and self-test in the app.

## Module 1 — Price per watt, and what it leaves out

**The single idea:** solar and storage equipment is priced per unit of rated capacity, and the sticker price is one of five terms that decide what a project pays over its life.

1. **Nameplate and price per watt.** A module is rated in watts under standard test conditions; a battery in kilowatt-hours. Quotes are dollars per watt or per watt-hour, delivered to the site (DDP) or at the factory gate (FOB) — the two are not comparable until freight and duty are added.
2. **Efficiency.** A higher-efficiency module makes the same power from less area: fewer racks, less cable, less land, less labour. The saving lands in the balance of system, not in the module price.
3. **Degradation.** Modules lose a fraction of a percent of output a year; batteries lose capacity with cycles and age. Slower degradation is more energy sold later, discounted back to today.
4. **Warranty.** A product warranty moves degradation and failure risk to the maker; its value depends on the maker still existing in year fifteen.
5. **Credits and tariffs.** A domestic-content adder raises a project's investment tax credit; a tariff raises an import's delivered price. Both are price terms, not footnotes.

**Self-check:** two modules cost the same per watt; one is two points more efficient. Where does the saving show up? *(In the balance of system — racks, wiring, land, labour — not in the module line.)*

## Module 2 — The two-sided exchange

**The single idea:** suppliers contribute data for free to be seen; buyers pay to see it and to have the firm buy for them.

1. **Supply side.** Monthly meetings with each supplier load current prices, lead times, specifications and compliance documents. The supplier pays nothing and is paid nothing; its return is visibility to every buyer running a comparison, and orders from the firm's managed procurements.
2. **Demand side.** A subscription for the data and tools, and a per-watt fee when the firm negotiates and contracts the purchase — cents per watt on commercial projects, tenths of a cent at utility scale.
3. **Coverage is the product.** A platform that covers most of the supply lets a buyer stop looking elsewhere; a supplier off the platform is invisible to those buyers. Coverage claims are the firm's most important statement and the hardest to verify — they are company figures with changing denominators.
4. **The conflict.** The firm advises buyers while depending on suppliers for data. Its answer is that it takes no supplier money; the buyer's question is whether the shortlist rewards suppliers who keep their data current.
5. **For a seller.** Equipment makers: the platform is a channel — be on it with verified data. Developers' advisers: the platform competes for the comparison step and partners on the order.

**Self-check:** what does a supplier give up by staying off the platform, and what does it avoid? *(Visibility to the platform's buyers; it avoids exposing its prices to monthly comparison.)*

## Module 3 — The compliance layer

**The single idea:** five rule sets now decide which products a US project may buy with full tax credits, and a platform's value is tracking every product against all five.

1. **FEOC.** Tax credits are denied when too much of a product's value came from a prohibited foreign entity. The measure is the material assistance cost ratio, computed per module or battery; the evidence is a legal opinion, a third-party audit or a certificate at module, cell and seller level. A self-reported claim is not treated as compliant.
2. **Domestic content.** A project earns an adder on its investment tax credit when enough of its manufactured content is American-made; the platform scores each product's points and finds blends of domestic and imported modules that clear the threshold.
3. **Section 232.** A proclamation sets minimum import prices for polysilicon, wafers, cells and modules from a stated effective date; imports below the floor pay the difference. It applies to the product class, whoever exports it.
4. **The Covered List and the bulk-power order.** Inverters, batteries and transformers from covered entities, or without equipment authorisation, are excluded from the grid's bulk-power system; the platform tracks authorisation status and covered-entity exposure per supplier and product.
5. **AD/CVD and UFLPA.** Anti-dumping and countervailing duties by exporter and country; forced-labour detention at the border for products without supply-chain traceability. Both appear as risk-rating flags.

**Self-check:** a module passes the FEOC test and earns domestic-content points but comes from a covered entity. May a utility-scale project use it? *(Not on the bulk-power system — the filters stack, and failing one is enough.)*

## Module 4 — Scenario modelling for a battery project

**The single idea:** a storage scenario engine designs the battery to the site and the tariff, then prices every supplier's product against that design.

1. **Inputs.** Location (interconnection, tariff, weather), point-of-interconnection capacity, duration in hours, degradation and augmentation plan, use case.
2. **Sizing.** For each candidate product the engine sizes the DC block and the power-conversion system, applies price, efficiency and warranty, and ranks on lifecycle cost. A developer can add its own quotes confidentially.
3. **The commercial claim.** Weeks of supplier quoting become an afternoon of configuration; smaller developers negotiate like large ones.
4. **The limits.** The engine ranks supplier-supplied data. It does not test the battery, does not run the large-scale fire test a laboratory runs, and does not replace the owner's or independent engineer who signs for the lender.

**Self-check:** who certifies the battery's fire-safety performance? *(A testing laboratory under UL 9540A — not the platform.)*

## Module 5 — Reading a tariff shock

**The single idea:** a platform sees repricing first — supplier by supplier — before any trade statistic does.

1. **Repricing breadth:** the share of active suppliers that changed quotes within a month of the proclamation.
2. **Imported-module median:** delivered price for shipments after the effective date versus before — the new floor.
3. **Domestic-import spread:** whether the domestic premium has narrowed enough to switch.
4. **Pull-forward:** volume contracted before the effective date — demand borrowed from next year.
5. **Caveat:** these are company-published statistics about the suppliers on the platform, not the market.

**Self-check:** imports stop entirely after the effective date. Which signal would have predicted it? *(A post-deadline median at or above the floor with pull-forward volume spiking before it.)*

## Module 6 — Buying transformers

**The single idea:** a built-to-order component with multi-year lead times rewards aggregated, standardised buying.

1. **The component.** Step-up and step-down transformers for every plant, substation and data centre; large power transformers weigh hundreds of tonnes and are made to order.
2. **The shortage.** Data centres, renewables and grid upgrades outran factory capacity; lead times stretched to years and prices rose. Ordering late loses the commercial operation date.
3. **The service.** Pre-qualify many makers, standardise the specification, aggregate orders to win factory slots, manage the contract through factory acceptance.
4. **The target.** Data-centre developers buy the same transformers as utilities on tighter schedules and mostly lack electrical procurement teams. The first named client would confirm the thesis; none is published.

**Self-check:** why does standardising the specification matter more for transformers than for modules? *(Each transformer is custom; without a common specification, bids cannot be compared and slots cannot be pooled.)*

## Module 7 — Where the model sits

**The single idea:** the platform is the market-data layer in front of the engineer and the laboratory, not a substitute for either.

1. **Before the comparison:** the laboratory certifies the product (UL 9540A, UL 1741); the maker warrants it.
2. **The comparison:** the platform ranks, filters and, if engaged, buys.
3. **After the comparison:** the independent engineer reviews the design and the supplier for the lender; the insurer prices the residual risk.
4. **For a seller:** know which of the three steps your counterpart is on; a platform shortlist is not a bankability opinion.

**Self-check:** a lender asks for a bankability report. Which party produces it? *(The independent engineer — the platform's ranking is an input, not the report.)*

## Risks to keep in view (from the dossier)

- Coverage claims with moving denominators: the same share quoted of 'suppliers' and of 'supply' on pages of different dates.
- Supplier dependence: the data comes from the companies the buyer is comparing.
- Opacity: no revenue, subscription price, take rate or post-2023 financing is published.
- Policy concentration: the 2026 product theme is compliance; a rule change is a product change.

## Sources for the technology and industry content

The company's product pages (Solar Pro, Energy Storage Pro, Energy Storage DG, Anza Pulse, Transformer Procurement Service), its quarterly pricing-insight reports and the September 2026 Section 232 and FEOC blogs; pv magazine USA, pv-tech, Solar Builder and Utility Dive coverage of those reports; the Section 232 polysilicon proclamation and Treasury's FEOC guidance as the company describes them; the Clean Power Hour interview on the fee model; OpenCorporates for the registry. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
