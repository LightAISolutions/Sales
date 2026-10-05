# SB Energy — Technology Lesson Plan

**Subject:** SB Energy, Inc. (proposed Nasdaq: SBE; SoftBank-controlled), its Data Centers, Standalone Power and Solutions segments · **Written:** 2026-10-04 from the Profiler dossier (profileVersion 1) · **Baseline assumed:** high-school STEM, no finance background.

**Purpose:** teach what a developer that is both a power producer and a data-centre landlord actually builds and buys:
- how a power purchase agreement and a triple-net data-centre lease each turn a construction bill into long-term income;
- why a campus has two sizes — IT load and total load — and how to read the gap;
- what 'delivered to the rack' means, layer by layer, and who buys each layer's equipment;
- why an owner buys transformers, switchgear and batteries itself and pays contractors only to install them;
- the four ways to power a campus, and who pays for the transmission when the load is enormous;
- what makes a 20-year lease bankable, and the pre-IPO instruments around it;
- energy against power in a battery, and the rules that decide which suppliers are allowed.

No company trivia: founding dates, executives, share counts and project names beyond the examples stay in the dossier. The in-app guide (Profiler → SB Energy → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The **SoftBank** plan, written the same day, explains the parent and why SB Energy is the one SoftBank company that buys equipment; read it first. The **AEP** plan covers the utility side of customer-funded transmission, and the battery-integrator plans (Fluence, Tesla) cover what goes inside the storage projects.

**Suggested pacing (about two hours):** Module 1 (~15 min), Module 2 (~15 min), Module 3 (~15 min), Module 4 (~20 min — the most important for a seller), Module 5 (~20 min), Module 6 (~15 min), Module 7 (~15 min), then the flashcard and self-test passes in the app.

## Module 1 — Two ways to sell a big asset for decades

**The single idea:** a power plant and a data centre both cost a great deal up front and are paid for by long contracts that lenders can lend against.

1. **The power purchase agreement (PPA).** SB Energy builds solar and battery plants and sells their output at a fixed price for 10 to 25 years — NV Energy buys Libra's output for 25 years, San Diego Community Power buys Pelicans Jaw's for 15. Fixed revenue is what makes the plant financeable. This business produces 'substantially all' of SB Energy's revenue today.
2. **The triple-net lease.** On a data-centre campus the tenant rents the buildings for 15 to 20 years and also pays running costs, taxes and insurance. SB Energy sets rent with a yield-on-cost formula — a target return on what the building cost — escalating 2% to 3% a year.
3. **The shared risk is cost.** Both the PPA price and the rent are fixed before every item is bought. SB Energy's leases say cost overruns above an agreed cap are 'generally borne by us'.

**Self-check:** A transformer's price rises 30% after a lease is signed. Who pays, under SB Energy's lease terms? *(SB Energy, above the agreed cap — which is why it buys long-lead equipment early and directly.)*

## Module 2 — IT load and total load

**The single idea:** a data centre is leased by the power its computers use, but the grid must deliver more.

1. **Critical IT load.** The power drawn by servers, chips and network gear, in megawatts of IT (MW-IT). Tenants lease it and rent is priced on it.
2. **Everything else.** Cooling, losses in power conversion, lighting and offices add to the bill. Total power divided by IT power is the PUE (power usage effectiveness): at 1.25, a 100 MW-IT hall needs about 125 MW from the grid.
3. **Reading SB Energy's numbers.** PORTS-Pike is about 8.0 GW-IT but about 10 GW of gross power load. Milam County is about 753 MW-IT in the S-1, while OpenAI's announcements called it 1.2 GW; its initial campus load is about 660 MW, supplied first from the neighbouring Orion solar projects at 34.5 kV and 345 kV. No source reconciles 753 MW-IT with 1.2 GW — the gap is consistent with IT load against a larger site figure, but that is an inference.

**Self-check:** Two reports give a campus as 8 GW and 10 GW. Which is more likely the lease figure? *(8 GW — leases are written in IT load; 10 GW is what the utility must deliver.)*

## Module 3 — Delivered 'to the rack'

**The single idea:** the landlord builds and equips everything up to the server rack; the tenant brings the computers; the utility brings the wires.

1. **The landlord's scope.** SB Energy's S-1: 'land, power, fiber, water, building shells and the critical internal systems … including mechanical, electrical and plumbing (MEP) systems, power distribution and cooling'.
2. **The tenant's scope.** 'Customers bring their own racks and semiconductors.'
3. **The utility's scope.** Transmission to the site — at PORTS-Pike, AEP Ohio's new 765 kV lines, paid for by SB Energy.
4. **The power EPC split.** SB Energy divides power construction into three packages: solar and battery installation; the high-voltage switchyard and interconnection facilities; and battery balance of plant.
5. **A different owner for the gas plant.** The roughly 9.2 GW of gas generation planned beside PORTS-Pike is being developed by a SoftBank affiliate that is not SB Energy's subsidiary.

**Self-check:** Who buys the medium-voltage switchgear inside a PORTS-Pike data hall? *(SB Energy, as landlord — power distribution is inside its scope.)*

## Module 4 — Why the owner buys the big equipment

**The single idea:** a developer that carries the cost risk buys the long-lead items itself and pays contractors to install them.

1. **Turnkey EPC.** One contractor engineers, procures and builds for a fixed price and carries the schedule risk. SB Energy uses this model with Turner, DPR, Kiewit and SOLV Energy on data centres and with SOLV, Blattner, Dashiell, CSI Electrical and Rosendin on power.
2. **Owner-furnished equipment.** The exception: SB Energy buys solar modules, battery components, high-voltage transformers, switchgear and inverters directly and hands them over for installation. It gets the supply contract and the warranty directly, reserves factory slots before construction contracts exist, and avoids the contractor's mark-up.
3. **Long-lead lists.** At PORTS-Pike the S-1 names gas turbines, transformers, power electronics, cooling systems and modular data-centre elements as long-lead items.
4. **What the contractors give back.** Liquidated damages for delay or missing capacity, two-to-three-year warranties, serial-defect replacement and parent-company guarantees.

**Self-check:** You sell switchgear. Should you call SB Energy's EPC contractor or SB Energy? *(SB Energy first — switchgear is owner-furnished; the contractor installs it.)*

## Module 5 — Powering a gigawatt campus, and who pays for the wires

**The single idea:** a load the size of a city must often fund its own transmission and accept being cut off first.

1. **Four configurations.** SB Energy's S-1 chooses per site between *grid-only* (all power from the utility), *hybrid* (grid plus the developer's own generation), *behind-the-meter* (generation feeding the campus directly, without the utility's meter) and *bridge* (temporary generation until the grid connection is ready). Each shifts who buys generation, storage and protection equipment.
2. **The electric service agreement (ESA).** The utility contract that fixes megawatts, term, minimum bill and collateral. AEP Ohio's covers the first 0.8 GW at PORTS-Pike; the remaining 9.2 GW awaits definitive agreements and approvals from the Ohio Power Siting Board, FERC and the Public Utilities Commission of Ohio.
3. **Who pays.** AEP says SB Energy is committed to paying USD 4.2bn for new 765 kV transmission; the S-1 says AEP expects about USD 5.1bn of capital costs, passed on to SB Energy with a regulated return. The two may cover different scopes; no source reconciles them.
4. **Texas by statute.** SB 6 makes a large load pay for its interconnection and shed load first in an emergency; SB Energy's Milam County site says it will do both.

**Self-check:** Why might a utility require a data-centre developer to fund new transmission? *(So that other customers do not carry the cost of lines built for one load — and in case the load never arrives.)*

## Module 6 — Making a lease bankable, and the pre-IPO instruments

**The single idea:** lenders value a lease by who stands behind the rent; investors who buy in before an IPO use instruments that deliver shares later.

1. **Credit support.** NVIDIA guarantees the OpenAI tenant's obligations on the first nine PORTS-Pike buildings (about 4.25 GW-IT) up to USD 105bn, moving credit risk from a loss-making tenant to a profitable chipmaker.
2. **The tenant's rights.** OpenAI holds consent and participation rights over 'specified materially important design contracts' — the tenant can shape a specification the landlord signs.
3. **Preferred equity.** Ranks ahead of common shares. OpenAI put USD 500m into SB Energy's preferred equity in January 2026; Ares's preferred is to be redeemed at the IPO.
4. **Warrants.** Rights to buy shares later at a fixed price, vesting on milestones. Re-measured each period, OpenAI's warrants produced a USD 2.57bn non-cash charge in the first half of 2026.
5. **Prepaid forward.** NVIDIA paid USD 1.5bn in August 2026 for shares to be delivered at 90% of the IPO price, and committed USD 1.5bn more alongside the offering.
6. **The IPO itself.** Registration statement filed 1 September 2026 and amended twice; no price range filed; trade press reported a delay. After listing, SoftBank expects to keep more than half the votes — a controlled company.

**Self-check:** A company reports a USD 2.6bn loss but its cash balance barely moves. What could explain it? *(A non-cash charge such as the re-measurement of warrants.)*

## Module 7 — Batteries, and the rules on suppliers

**The single idea:** a battery's energy is its power times its hours, and four rules can rule a supplier out before price.

1. **Energy against power.** Athos Storage is about 402 MW for four hours, roughly 1,600 MWh. Pelicans Jaw is 239 MW and 954 MWh; Libra 700 MW and 2,800 MWh. Divide MWh by MW to get duration.
2. **The security agreement.** Since 2019 SoftBank and SB Energy have operated under a CFIUS National Security Agreement imposing 'restrictions on vendors', including approval for certain vendor relationships.
3. **FEOC rules.** Projects starting construction after 2025 must meet foreign-entity-of-concern rules to keep US clean-energy tax credits.
4. **The DOE emergency order.** From 26 August 2026 the Department of Energy may prohibit buying or installing foreign-produced bulk-power equipment involving a covered foreign entity; SB Energy does 'not yet know the impact'.
5. **The tenant.** OpenAI's consent rights can reach design contracts.

**Self-check:** A battery is quoted at 300 MW / 1,200 MWh. What is its duration? *(Four hours.)*

## Sources for the technology and industry content

SB Energy's Form S-1 (1 September 2026) and S-1/A No. 2 (21 September 2026); SB Energy's releases on Orion, NVIDIA at PORTS-Pike and the OpenAI and SoftBank investments; its Athos Storage page and the Milam campus microsite; AEP's 20 March 2026 release; the California Energy Commission's Athos grant record; IFR's report on the IPO delay. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
