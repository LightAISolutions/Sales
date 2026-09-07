# REPT BATTERO — Technology Lesson Plan

**Subject:** REPT BATTERO Energy Co., Ltd. (HKEX: 0666, Wenzhou) · **Written:** 2026-09-06 · **Baseline assumed:** high-school STEM, no battery background.

**What this teaches.** The battery cell as an engineered object, and the chain from its physics to a purchase order. Why the capacity numbers on cells keep climbing, what a specification sheet is and is not telling you, why cooling decides service life, and how the same physics turns into a commercial argument about land, cranes and installation hours.

**Why this gap.** The corpus has many cell makers and no guide that teaches the cell itself. This is also the cleanest available subject for it: a company whose product ladder runs visibly from a 280Ah cell to a 648Ah one over four years, in a container whose external dimensions never change.

## Module 1 — Cell, module, pack, container
The four nested levels and the packaging penalty each one imposes. Why grid storage converged on very large prismatic cells rather than cylinders or pouches, and what cell-to-pack designs delete and why. Ends with the DC block as the commercial unit — energy sold by the container, inverter left to the buyer.

## Module 2 — The capacity ladder
Ampere-hours, volts and watt-hours, and how to move between them. The ladder from 280Ah to 648Ah as a worked example. Exercise: given cell capacity and nominal voltage, compute container energy and check it against the vendor's claim.

## Module 3 — Reading a specification honestly
The four numbers on every datasheet and the three that are conditional. Gravimetric against volumetric energy density and which one governs which application. Cycle life as a function of depth of discharge and temperature. C-rate as the difference between an energy cell and a power cell. Round-trip efficiency and the parasitic load of cooling. Exercise: given two cells whose datasheets favour different metrics, argue which is better for a four-hour grid project and say what would change your mind.

## Module 4 — Thermal management
Why the useful figure is temperature spread rather than average temperature: series-connected cells age at the rate of the hottest one. Air against liquid cooling, parallel against series coolant paths, and how thermal runaway starts and is contained.

## Module 5 — From physics to a purchase order
Why a denser container wins on installed cost rather than on battery price. Foundations, crane lifts, cabling, commissioning and land all scale with unit count, not with energy — so cutting the number of boxes by a quarter cuts all of them. This module explains why the capacity race is real competition and not specification vanity.

## Module 6 — Two duties wearing one name
Grid storage against data-centre backup: four hours daily for twenty years, against seconds of very high power almost never. Why they demand different cells, and how to tell from a datasheet which market a manufacturer is entering.

## Module 7 — Why rankings disagree
Cells against systems, front-of-meter against all segments, shipped against installed. Why a tenth of a gigawatt-hour separates fifth from sixth and both houses are right. The transferable rule: cite the house, the metric and the period together, or the rank means nothing.

## Pacing
Seven modules, roughly 35 minutes each. Modules 1–3 are foundational and must be taken in order; 4 and 5 build directly on 3. Modules 6 and 7 are independent and can be taken in either order.

## Sources for the technology and industry content
The company's own cell catalogue, Wending technology pages and Powtrix product materials for the ladder and the container specifications; its HKEX annual and interim results for shipments, capacity and segment structure; SNE Research, InfoLink, TrendForce and Wood Mackenzie coverage for the ranking methodology comparison. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
