# Faith Technologies — Technology Lesson Plan

**Subject:** Faith Technologies Incorporated (FTI), with Excellerate, Excellerate Products and EnTech Solutions · **Written:** 2026-10-04 from the Profiler dossier (profileVersion 1) · **Baseline assumed:** high-school STEM, no construction background.

**Purpose:** teach what an electrical contractor does inside a data hall, why this one moved half of that work into factories, and how to read the product-versus-project question that decides whether a contractor has become a supplier:
- the power path an electrical contractor installs, from the utility fence to the rack whip;
- owner-furnished versus contractor-furnished versus contractor-manufactured equipment;
- prefabrication — modular electrical buildings, e-houses, trestles, skids — and why factory hours beat field hours;
- what a 2 MW power module contains and what evidence would make it a merchant product;
- merit shop versus union shop, and what each ranking actually measures;
- safety metrics owners prequalify on (TRIR, LTIR, EMR);
- the three kinds of 'employee-owned' and how a Form 5500 settles which one applies;
- a microgrid behind a data centre's meter, and when the contractor becomes the battery buyer.

No company trivia: founding dates, executives, plant investments and headcount stay in the dossier. The in-app guide (Profiler → Faith Technologies → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The **Rosendin** dossier is the union, ESOP-owned analogue with its own prefabrication arm; the **EMCOR** plan teaches the mechanical half of the same hall and the public-company reporting around it; the **Schneider Electric** and **Vertiv** dossiers carry the UPS and switchgear that go inside modules like this company's; the **Mortenson** and **Turner Construction** dossiers are the general contractors it works under at Meta Lebanon.

**Suggested pacing (before ENR's 2026 Top 600 publishes on 22 October 2026):** Module 1 (~15 min), Module 2 (~10 min), Module 3 (~15 min), Module 4 (~15 min), Module 5 (~15 min), Module 6 (~10 min), Module 7 (~10 min), Module 8 (~10 min), then the flashcards and self-test in the app.

## Module 1 — The power path an electrical contractor installs

**The single idea:** the manufacturer builds the box; the electrical contractor makes it part of a system that can be energised safely.

1. **At the fence.** Utility power arrives at medium voltage, typically 12–35 kV. The contractor terminates the incoming cable, sets the switchgear that can interrupt a fault, and sets the transformers that step the voltage down to 480 V for the building. Medium-voltage terminations are skilled, repetitive work — this company says it does 'tens of thousands' a year and uses a cable-preparation robot for some of them.
2. **Behind the transformers.** Generators and the paralleling switchgear that lets several of them share a bus; the UPS and its battery strings; distribution by busway or cable to PDUs; branch circuits to each rack. Every piece is set, wired, labelled and torqued by the contractor's crews.
3. **Low voltage too.** Fire alarm, security, building controls, structured cabling — the same contractor, a different licence.
4. **Commissioning.** The system is proven in levels: factory tests of individual pieces (Level 1–2), functional tests of assembled systems (Level 3), site tests of each system (Level 4), and the integrated systems test with generators carrying the building (Level 5). A prefabricator that runs Level 3 in its own plant ships gear that has already passed once.
5. **For a seller.** The contractor is the hands on your product. A UPS that is awkward to set, a battery cabinet whose wiring access is poor, a switchboard whose shipping splits do not match the crane — these cost the contractor hours, and contractors remember.

**Self-check:** a hyperscaler buys its UPS directly from the manufacturer. Who still has to make it work? *(The electrical contractor — receipt, setting, wiring, integration with the switchgear and controls, and commissioning under load.)*

## Module 2 — Who signs the purchase order

**The single idea:** the same transformer can be bought by the owner, by the contractor, or built by the contractor — and the seller's counterparty changes with it.

1. **Owner-furnished.** Hyperscalers buy long-lead gear — transformers, generators, UPS, switchgear — under frame agreements and have it shipped to site. The contractor receives, stores, sets and commissions. This company's Atlanta colocation client 'purchased equipment and FTI stored and installed it'.
2. **Contractor-furnished.** On a lump-sum or guaranteed-maximum-price job the contractor specifies and buys the gear inside its price, and carries the lead-time risk. On a Tennessee battery plant about a fifth of a USD 24m package was 'sourcing and installing the necessary switchgear', with the design optimised alongside a switchgear OEM.
3. **Contractor-manufactured.** The contractor's own factory builds the assembly — a modular electrical building, an e-house, a power module — integrating OEM components it buys.
4. **Design-build and EPC.** One contract for design, procurement and construction puts the OEM choice with the contractor. This company markets 'engineer, procure, construct' under a single contract.
5. **The practical rule.** Before pitching a contractor, find out which model the target campus runs. Under owner-furnished gear the contractor influences but does not buy; under the other three it signs.

**Self-check:** on a hyperscale campus with owner-furnished UPS, what can the electrical contractor still decide about your product? *(Whether it installs cleanly, how it is specified in the field, and whether it is recommended on the next job — influence, not the purchase order.)*

## Module 3 — Prefabrication: why factory hours beat field hours

**The single idea:** the same wiring task done at bench height under a crane, with staged material and no weather, takes fewer hours, fewer injuries, and can be tested before it ships.

1. **The products.** A modular electrical building is a complete electrical room on a steel base; an e-house is the medium-voltage version; skids carry a transformer or distribution panel pre-wired; cable trestles are 50-foot overhead sections that replace buried duct banks; electrical assemblies are the small stuff — conduit racks, hangers, cut-to-length whips.
2. **The arithmetic.** The company's own figures: 'more than 50% of project labor' moved into the factory for modular data-centre power; a duct-bank job with '67% of labor hours offsite' that 'installs three times faster' and roughly USD 1m saved per 10,000 hours moved. Company claims, unaudited — but every hyperscale schedule now assumes this direction.
3. **The constraint prefabrication relieves.** Site supervision. A superintendent can run more work when it arrives as tested modules than when it arrives as reels of cable. EMCOR's chief executive names supervision, not tradespeople, as the industry's bottleneck; prefabrication is the structural answer.
4. **The cost.** Factories are fixed assets. Five plants of about 500,000 sq ft each announced in ten months, plus a municipal-bond-financed expansion, is a bet that hyperscale demand keeps them full for years.
5. **For a seller.** Your UPS or battery cabinet may be installed in a factory in Wisconsin, Texas or Louisiana, not on the campus. Delivery terms, lifting points and factory-acceptance documentation matter as much as site logistics.

**Self-check:** why does a prefabricator want to run Level 3 commissioning in its own plant? *(Faults are found and fixed indoors, before shipment, when the gear is easiest to reach and the site schedule is not waiting.)*

## Module 4 — Inside a 2 MW power module, and the product-versus-project question

**The single idea:** a power module is an electrical room in a box; whether selling it makes a contractor a supplier depends on who buys it.

1. **Contents.** UPS, battery strings, low-voltage switchboards and SCADA/PLC monitoring in one factory-built enclosure rated at 2 MW. Two mirror-image modules side by side form a 2N pair — two independent paths, each able to carry the full load.
2. **Standards.** Built to UL 891 (dead-front low-voltage switchboards), the 2023 NEC and NEMA 3R (rain-tight for outdoor placement). 'Built to' a standard is not the same as carrying a UL listing that others can cite.
3. **What the integrator does not make.** The UPS, the breakers and the batteries come from OEMs — 'we partner with leading OEMs'. The contractor adds integration, testing and schedule. The OEMs inside such modules are often invisible to the end buyer, which is both a threat and an opportunity for the component seller.
4. **The category test.** A contractor becomes a supplier when it sells manufactured product to parties it does not also install for. Evidence: a named outside buyer, an order or shipment count, a distributor or rep agreement, a UL file number cited by others. Buyer terms, a national sales manager and a trade-show booth show intent; they do not show a sale.
5. **Where this company stands.** An OEM brand launched in April 2026 with standalone buyer terms and no named purchaser in any reachable source. The dossier therefore files it as a contractor and records the trigger that would change the call.

**Self-check:** a product page calls a module 'proven, productized' but names no site. What would you need to see before treating it as a shipping product? *(A named customer or installation, an order count, or a third-party citation — a reference the company did not write itself.)*

## Module 5 — Merit shop and union shop

**The single idea:** two labour systems, two trade bodies, two maps of the country — and two kinds of ranking.

1. **Union shop.** Journeymen and apprentices come from an IBEW local under a collective bargaining agreement; wages, benefits and travel terms are set by the agreement; a campus can draw labour from other locals when it needs thousands of hands. Trade body: NECA.
2. **Merit (open) shop.** The contractor hires and trains its own workforce, sets its own wages, and runs its own apprenticeship. Trade body: ABC. Growth is limited by how fast it can train — hence hiring rates above a thousand a year and in-house 'universities'.
3. **The map.** Union contractors dominate Northern Virginia, California and the big Northeastern cities; merit-shop contractors dominate right-to-work states across the South and Midwest — where hyperscalers now site campuses for power and land.
4. **The rankings.** ABC's Top Performers ranks members by hours worked with a safety qualification; EC&M ranks by electrical sales; ENR by construction revenue; Deloitte's state list by sales but publishes no figures. A contractor can be first, ninth and thirty-second at once. A dossier states the basis next to the rank.
5. **For a seller.** The labour system tells you where a contractor can bid and how it prices. Merit-shop firms often win where union density is low; union firms can surge labour where it is high.

**Self-check:** ABC puts a contractor first in data centres while EC&M puts it ninth. Which list should a seller use to size the electrical budget it controls? *(EC&M — dollars of electrical sales; ABC measures hours, which is a labour-volume signal.)*

## Module 6 — Reading safety numbers

**The single idea:** owners prequalify contractors on three figures before they read a price.

1. **TRIR** — recordable injuries per 200,000 hours (100 full-time workers for a year). The specialty-trade average is about 2.4; under 1.0 is strong. Worked example from the dossier: 0.18 on 10.8 million hours.
2. **LTIR** — lost-time injuries per 200,000 hours. Zero means nobody missed a day through injury.
3. **EMR** — the insurer's ratio of actual to expected workers'-compensation losses; 1.0 is average, below 0.5 is rare, and a low EMR lowers insurance cost and opens bid lists. Worked example: 0.37.
4. **Why it matters commercially.** Hyperscalers screen on these; a contractor with a 0.3 EMR gets invited to walk sites that a 1.2 EMR contractor never sees.

**Self-check:** which of the three is set by an insurer rather than counted by the contractor? *(EMR.)*

## Module 7 — Three kinds of 'employee-owned'

**The single idea:** the phrase covers an ESOP, direct shareholding and an ownership trust; a public filing tells you which.

1. **ESOP.** A tax-qualified trust holds shares for all employees and files its own Form 5500 with the Department of Labor, with employer-securities codes. Rosendin and the former Miller Electric are ESOPs.
2. **Direct shareholding.** Managers and selected employees own shares personally, usually in an S corporation that passes income through to them; shares move only by private sale; the shareholder count stays small because the S election requires it.
3. **Employee ownership trust.** A trust holds shares permanently for the workforce; common in the UK, rarer in the US.
4. **How to check.** Form 5500 filings are public bulk data. A company whose only plans are a 401(k), a 401(a) and a welfare plan, with the employer-securities line blank, is not an ESOP whatever a directory says.
5. **Why a seller cares.** Structure decides how a factory is funded — retained earnings and bank debt, municipal bonds, or a share issue — and who can approve a sale of the company. A directly held S corporation has no public liquidity path, so a capital event is a real indicator.

**Self-check:** a company's filings show a 401(k) with assets but no employer stock. What is it not? *(An ESOP.)*

## Module 8 — A microgrid behind a data centre's meter

**The single idea:** solar plus a battery behind the meter trims demand charges and rides through short outages; the contractor that owns the asset is the battery buyer.

1. **The microgrid.** Local generation, storage, loads and a controller that normally run grid-connected but can island and keep running when the utility fails.
2. **At a data centre.** Peak shaving, bridging the seconds before generators start, and utility programme revenue — a supplement to the UPS and generators, not a replacement.
3. **The contractor's role.** EPC: interconnection engineering, procurement of inverters and batteries, installation, commissioning. Under a lease or energy-service agreement the contractor finances and owns the asset, and then it — not the owner — signs the battery purchase order.
4. **For a seller.** This is the one place a contractor's clean-energy arm meets the storage segments as a buyer. Look for owned-asset financing language, not just installation references.

**Self-check:** when does an EPC contractor become your customer for battery cells or containers rather than your installer? *(When it finances and owns the microgrid asset.)*

## Risks to keep in view (from the dossier)

- Customer concentration: one named hyperscale campus behind a 62% growth year.
- Capital: about USD 550m of plants announced in ten months, partly bond-financed, against undisclosed earnings.
- Category drift: the first named outside buyer of a power module changes the dossier's classification and segment seat.
- Labour: a merit-shop model must train its own workforce as fast as the plants fill.

## Sources for the technology and industry content

The company's services, products and project pages (data-centre services, critical power, medium voltage, modular data-centre power, e-houses, Power Module 2 MW, UL 891 switchboards, Excellerate Products terms, the Atlanta data-hall and Clarksville battery-plant projects, the overhead trestle project); EC&M's 2026 Top 50 rankings table and special report; ENR's 2024 Top 600 table; ABC's Top Performers methodology and 2025–2026 lists; Deloitte's Wisconsin 75 methodology; the Department of Labor's Form 5500 bulk files; the Schneider Electric case study on FTI's microgrids; state economic-development releases for the El Paso, Opelika, Pittsboro, Monroe and Olathe plants. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
