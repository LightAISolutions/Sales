# Sunwoda — Technology Lesson Plan

**Subject:** Sunwoda (listed; a high-volume consumer and vehicle battery manufacturer that is simultaneously a merchant storage-cell supplier and a system integrator) · **Written:** 2026-09-06 · **Baseline assumed:** high-school STEM, no manufacturing-quality or statistics background.

**What this teaches.** Why a storage product is a statistics problem before it is an engineering one: an enclosure holds thousands of cells, a project holds tens of enclosures, and at that scale 'we tested it and it worked' stops being a claim anyone can make. The arithmetic that makes sampling hopeless against rare defects, and the substitution the industry makes instead — proving the process was in control rather than proving the output is good. The cell factory step by step, with each step's characteristic latent defect. Process control, yield read as both a cost and a quality signal, and why a new cell format restarts the learning curve. Traceability as the difference between a bounded and an unbounded problem. The two acceptance tests and what each structurally cannot prove. The bathtub curve read diagnostically. And transport, where a battery is regulated freight and arrival damage is a quality-system failure rather than a logistics accident.

**Why this gap.** The corpus had a gigafactory concept and a learning-curve concept but no account of what a battery factory actually does, why its defects are latent, or why manufacturing evidence rather than inspection is what a serious buyer audits. Without that, a supplier's quality claim was unreadable — and quality claims are one of the two inputs that size a twenty-year warranty reserve.

**Its place in the integrator set.** Fifth of seven. It supplies the manufacturing half of what the HyperStrong guide called qualifying a line rather than a company, gives the Envision guide's fleet-data loop its factory-side counterpart, and hands the defect-rate assumption forward to the Trina guide, where it becomes half of the warranty reserve calculation. Its transport module hands the manufacturing-footprint question to the closing structure guide.

## Module 1 — The arithmetic of rare defects
Thousands of cells per enclosure and what a hundred-parts-per-million rate means for a hundred-enclosure project against a one-part-per-million rate. Why detecting a rare event by sampling requires testing essentially the whole run. The substitution to process evidence, and its consequence that the factory's data systems are part of the product. Epidemic failure as the non-random case that the arithmetic cannot see coming.

## Module 2 — Inside a cell plant
Seven steps and their latent failures: electrode coating and uneven current density; calendering and the density trade; cutting and stacking or winding, with edge defects as the classic internal-short precursor; dry-room assembly and moisture ingress; electrolyte fill and sealing; formation as the most consequential and slowest step; ageing and grading as what keeps a string's distribution narrow from day one. Why formation and ageing dominate a plant's capital and explain the gap between nameplate and early output.

## Module 3 — Yield as two signals at once
Statistical process control as measuring the process rather than the product, its earliness advantage and its blindness to uninstrumented failure modes. First-pass yield against escaped defects per million, and why quoting one without the other chooses a story. Why an aggressive new format is genuinely more expensive per kilowatt-hour at first. Root-cause analysis tested by whether corrective actions ever change a design rather than adding an inspection. Failure-mode analysis as the discipline of thinking about undetectable failures in advance.

## Module 4 — Knowing exactly which ones
Reconstructing a unit's history from material lot to installed site. The two commercial outcomes when something goes wrong, with and without it. Traceability as a compliance instrument for origin-conditioned eligibility as well as an engineering one. Why it cannot be added afterwards: the links are destroyed at assembly unless captured then, so it is a production-line design decision.

## Module 5 — Proving it twice
Works testing as catching wiring, configuration and logic errors while they are cheap, and structurally unable to present the real grid, environment or duty. Site testing as proving the installation and starting the warranty clock, and structurally unable to summon rare conditions or say anything about the following twenty years. The recurring principle that testing components is not testing a system.

## Module 6 — When failures happen tells you what caused them
Infant mortality as a manufacturing signal answered by process control and burn-in; the flat middle as the only region where a mean-time-between-failures figure means anything, with the caution that it describes a fleet and ignores repair time; wear-out as a design and materials signal and the region a twenty-year guarantee is written across. What an integrator is really watching for in its fleet.

## Module 7 — A battery is regulated freight
Dangerous-goods classification and what it governs. The transport abuse-test sequence as a shipping qualification wholly separate from installation listing. Partial state of charge at shipment and the calendar ageing that begins at manufacture rather than at commissioning. The journey as an unscheduled mechanical test. The framing that arrival damage is a quality-system outcome, and the connection from manufacturing footprint to transport cost, transit ageing, tariff exposure and origin eligibility.

## Pacing
Seven modules, roughly 25 minutes each. Module 1 sets up everything and should not be skimmed. Module 2 is reference material and rewards a second pass alongside the cell-maker guides. Modules 3 and 4 are the practical heart for anyone auditing a supplier. Module 7 is short and should be read immediately before the closing structure guide, whose jurisdiction argument it sets up.

## Sources for the technology and industry content
Grounded in the company's dossier and the sources registered there, plus standard cell-manufacturing, quality-systems and dangerous-goods fundamentals. No new research was carried out for this guide. Defect rates and the failure-rate shape in Module 6 are illustrative, and no company's claimed yield, quality record, shipment volume or certification is asserted as fact. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
