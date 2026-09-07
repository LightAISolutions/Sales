# Prevalon — Technology Lesson Plan

**Subject:** Prevalon (private; containerised storage integrator with a gas-turbine heritage, now building hybrid stabilisation systems for AI campuses) · **Written:** 2026-09-06 · **Baseline assumed:** high-school STEM, no storage-integration or fire-engineering background.

**What this teaches.** The storage container as a product and the hybrid site as a system. DC against AC blocks and where the system boundary is drawn; the six layers inside an enclosure and how each one's limit becomes a footnote on the layer above; how to read a storage datasheet honestly, including the two numbers that trade against each other; why battery fire strategy is containment rather than extinguishment, and why the test is run at full scale; how a plant controller assigns work to storage, engines, turbines and the grid, and why transitions are the hard part; why controllers are validated against simulated grids; and what becomes of every asset in this course once permanent transmission arrives.

**Why this gap.** Three gaps in one. The corpus taught cells and it taught revenue, but never the *box between them* — the thermal, conversion and safety layers where most project disappointment actually originates. It had no account of hybrid plant control, which is what makes a mixed-technology site work at all. And nothing anywhere addressed the ending: bridge power is by definition temporary, and the residual-value question was unasked.

**Its place in the bridge-power set.** Sixth of six, and the course's closing argument. It deliberately excludes chemistry, which belongs to REPT and Gotion, and revenue and dispatch, which belong to Eolian and Jupiter Power. It takes grid-forming conversion as given from the ON.energy guide, engines from VoltaGrid and turbines from ProEnergy, and assembles them. Its last module is written to close the whole six-guide course rather than this company's guide alone.

## Module 1 — The container and the plant
Why a storage system on a bridge site exists to supply time rather than energy, and how differently that duty specifies a battery from an arbitrage duty. What is deliberately out of scope and where in the corpus it lives. The observation carried to the last module: storage is the one asset here certain to have a job afterwards.

## Module 2 — Two ways to sell a battery
DC block against AC block as a question of where the system boundary — and therefore the responsibility — is drawn. Maximum energy per enclosure and conversion freedom against a single warranted outcome, fewer site systems and faster commissioning. Why the market moved toward integration for a commercial rather than technical reason, and what optionality the buyer surrenders on the fastest-moving component.

## Module 3 — What is in the box
Six layers: cell, module and string, battery management, thermal system, conversion, safety systems. What each one limits. The pattern worth extracting — each layer's limit appears as a condition on the layer above, so a datasheet is a set of conditional promises and the conditions are where projects go wrong.

## Module 4 — Reading the datasheet honestly
Five headline numbers and the condition qualifying each: energy at what temperature and what age, efficiency at what duration and measured where, cycle life to what state of health under what envelope, density under what fire-driven spacing, response measured from what. The interaction most often missed — cooling harder preserves capacity but lowers delivered efficiency, so a vendor can present either honestly. Fixing the duty as the only fair comparison, and the specification as the highest-value document a buyer produces.

## Module 5 — Why storage safety is tested at full scale
Thermal runaway as self-sustaining because the cell carries its own oxidiser, so water cools neighbours rather than extinguishing. Containment as the entire objective. Fire and deflagration as two hazards with different controls. UL 9540A as a test method producing data rather than a pass mark, and NFPA 855 and the local authority as its consumers. Why megawatt-hours per acre is a fire-testing outcome, and the two complications a hybrid site adds — a combined hazard analysis with the gas plant, and a containment strategy that must coexist with a load that cannot be dropped.

## Module 6 — Making four kinds of machine behave as one plant
The controller as what turns a collection of machines into a power station. The division of labour: storage supplies the first seconds, engines and turbines supply the energy, the grid supplies the base and absorbs surplus. Why transitions — going islanded, and resynchronising to come back — are brief, hazardous and where hybrid plants fail. The controller's second job: allocating several scarce budgets at once, since fuel, warranty life and permitted hours are all inventory. Why vendor controls cannot be assembled into a plant controller, because they optimise locally.

## Module 7 — Testing against a grid that does not exist yet
Why the dangerous behaviours are interactions and therefore invisible to component testing. Hardware-in-the-loop as running the real controller against a real-time simulation it cannot distinguish from reality. The four cases it exists to cover, each rare and severe. Schedule as the commercial argument — commissioning problems found on site are found in the most expensive possible place. The general principle: **where a system's dangerous behaviours are interactions, testing the components is not testing the system** — the same principle that produced full-scale fire testing.

## Module 8 — What is left when the wires arrive
The generation's second life: conversion to backup at a fraction of the installed megawatts, redeployment if it was built to move, and better interconnection terms held permanently — against a site-bound permit and the risk of stranded cost. The storage's: permanent duties that a grid connection expands rather than removes, and inherent portability — against cycles already spent and a duration that may be wrong for the new job. The closing argument: the asymmetry should be priced at the beginning, and the question to ask of any bridge proposal is not the cost per megawatt-hour but *what is each of these assets for, once the thing we are bridging to has arrived?*

## Pacing
Eight modules, roughly 30 minutes each. Modules 2–4 are the equipment half and should be taken together; Module 4 is the one to keep as a working reference when reading any vendor datasheet. Module 5 stands alone and is the most self-contained in the course. Modules 6–8 are the systems half and close the whole six-guide sequence — Module 8 should be read last, after the other five guides, because it settles a question every one of them raises.

## Sources for the technology and industry content
Grounded in the company's dossier and the sources registered there, plus standard storage-integration, fire-testing and plant-control fundamentals. No new research was carried out for this guide. Datasheet values are used only as illustrations of the conventions; no company's claimed density, efficiency, cycle life, certification or contract volume is asserted as fact. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
