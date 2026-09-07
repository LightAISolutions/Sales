# Envision Energy — Technology Lesson Plan

**Subject:** Envision Energy (private group; wind turbine manufacturer, storage integrator and industrial software platform, with an affiliated cell business) · **Written:** 2026-09-06 · **Baseline assumed:** high-school STEM, no control-systems or estimation background.

**What this teaches.** The fact that organises the whole control layer: the two numbers a storage system exists to report — how full it is and how healthy it is — cannot be measured, only inferred. Charge counting and rest-voltage methods and how their weaknesses are complementary, with the flat-voltage chemistry that dominates grid storage being the worst case for the second. The management system as a four-level hierarchy with authority increasing downward and scope increasing upward, and a different failure mode at each level. Passive against active balancing. Usable capacity understood as a distribution rather than a number, and how operating decisions widen or narrow it. The control stack above the battery and who owns each layer. And why, when competitors buy the same cells and ship the same boxes, the fleet-data feedback loop is the difference that survives.

**Why this gap.** Every commercial promise in the corpus — capacity guarantees, availability guarantees, dispatch decisions, warranty models — is written against numbers the corpus had never explained the provenance of. It had treated state of charge and state of health as though they were readings. They are estimates, and the quality of the estimate is a competitive variable with money attached.

**Its place in the integrator set.** Third of seven. It takes the cell-to-cell variance problem from the Canadian Solar guide and attacks it electronically rather than thermally. It defers hybrid-plant source assignment to Prevalon, market dispatch to Jupiter Power, and grid-forming behaviour to ON.energy. It hands remote software updates forward to the certification guide as a compliance problem, and the fleet feedback loop forward to the Trina guide, where it becomes the input that prices a warranty reserve.

## Module 1 — You cannot measure how full a battery is
Why the quantity of interest is not observable from outside the can. Coulomb counting as an integral whose sensor bias accumulates without correction. Open-circuit voltage as an absolute reading that requires genuine rest, and why a flat voltage curve makes it weakest exactly where grid plants spend their lives. Fusion of the two, with a cell model tying them together, as an invisible differentiator. State of health as the slow signal beneath the fast one, and why an optimistic health estimator is not contradicted until a performance test fails.

## Module 2 — The management system as a hierarchy
Four levels — cell and module, rack or string, system, independent protection — with what each measures, decides and protects. The four different failure modes: silent, containable, expensive, catastrophic. The architectural principle that authority increases downward while scope increases upward, and why a supplier's answer to 'what happens when this layer fails' is more informative than any accuracy claim.

## Module 3 — Two ways to stop the cells diverging
Passive balancing as cheap, predictable and wasteful, generating heat exactly where the thermal design least wants it and levelling down to the weakest cell. Active balancing as charge-moving rather than charge-discarding, correcting larger divergence with less heat but with more components, a less benign failure surface and its main benefit arriving at end of life. Balancing and cooling as two attacks on one enemy.

## Module 4 — Capacity as a distribution
The cell population as a spread that widens with age, with the tails rather than the centre setting what the plant delivers. The unifying reading of the whole product: qualification buys a narrow distribution, manufacturing avoids widening it, thermal design stops the environment widening it, balancing corrects it electronically, and the software operates so as not to make it worse. How dwell at extremes, rate and temperature change the widening rate — so the control layer is continuously spending or preserving the asset.

## Module 5 — The control stack
Six layers with their timescales and owners: battery management, converter control, energy management, plant controller, supervisory telemetry, and the fleet platform. Why the energy-management row is the contested one, and what an owner gains and gives up by running its own.

## Module 6 — Why the software is the moat
Two competitors with near-identical bills of materials. The four things that differ and appear on no datasheet. The feedback loop and its three products — pricing the warranty, finding failures early, informing the next design — which is why an installed base is a technical asset. The counter-pressure of interoperability and the mature position of standard protocols at the boundary with proprietary logic inside. Remote updates as a compliance question requiring formal change control.

## Pacing
Six modules, roughly 25–30 minutes each. Module 1 must come first and is worth re-reading; everything else in the guide depends on accepting that the central numbers are estimates. Modules 3 and 4 are best taken in one sitting with the Canadian Solar thermal module fresh. Module 6 reads best after the Trina guide has shown what the fleet data is ultimately for.

## Sources for the technology and industry content
Grounded in the company's dossier and the sources registered there, plus standard battery-management, estimation and industrial-control fundamentals. No new research was carried out for this guide. No company's claimed efficiency, cycle life, platform capability or certification is asserted as fact. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
