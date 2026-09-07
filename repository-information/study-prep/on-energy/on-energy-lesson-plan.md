# ON.energy — Technology Lesson Plan

**Subject:** ON.energy (private; developer of medium-voltage battery-based power conditioning for AI campuses, and a legacy merchant storage owner) · **Written:** 2026-09-06 · **Baseline assumed:** high-school STEM physics, no electrical-engineering background.

**What this teaches.** The electrical boundary between a very large campus and the grid. Why past a certain size a data centre stops being something the grid serves and becomes something the grid must be protected from; the voltage ladder and why moving equipment up it changes what it can solve; the transient travelling in both directions; ride-through as a specification with a shape, and why surviving a near-zero dip requires stored energy; grid-forming against grid-following inverters and why that choice is architectural; how accepting curtailment buys an earlier connection; and the five protection questions a low-voltage product never had to answer.

**Why this gap.** The corpus covered storage as a revenue asset thoroughly and as a protective asset not at all. It also had no account of the obligations now attaching to very large loads — that a campus can destabilise a grid, and that grid operators have responded with connection conditions rather than advice. Both are new enough that they are widely described and rarely explained.

**Its place in the bridge-power set.** Fifth of six, and the only guide about the interface rather than about a machine. It owns voltage levels, power quality, ride-through obligations, inverter behaviour and protection. The physical container and the plant controller are held back for the Prevalon guide; revenue and dispatch stay with Eolian and Jupiter Power; cell chemistry stays with REPT and Gotion. Its Module 6 completes an argument begun in the Enchanted Rock guide's last module.

## Module 1 — A campus as a grid participant
Why size changes the relationship in kind rather than degree. Obligations running in both directions. Why power conditioning has migrated upstream from inside the building to the site boundary, and what that migration is really about.

## Module 2 — The voltage ladder
Transmission, medium voltage, low voltage and the rack as four rungs, each a candidate location for protection and conditioning. What can be solved at each. The duplication argument for moving up, the fault-consequence argument against — and the observation that this is the same trade the engine guide made about many small machines against one large one, running in the opposite direction.

## Module 3 — The disturbance travels both ways
Accelerators working in lock-step and the sub-second block load a single customer can impose. The grid operator's remedies as conditions of connection. Then the familiar direction: voltage sags as the largest cause of unplanned industrial disruption, and over-reaction as the real hazard — if every large load trips at the first dip, a local fault becomes a system event. Why one piece of equipment at the boundary can serve both directions, and why storage appears here as a protective rather than a revenue asset.

## Module 4 — Staying connected when the voltage disappears
Ride-through as a curve rather than a capability: depth against duration. Low-voltage against zero-voltage cases. Why a near-zero dip can only be met with stored energy — nothing can pass through power that is not arriving. Double conversion as the topology that never lets the load see the input, and what it costs continuously. Why applying it at medium voltage is a change of scope rather than a scaling exercise, and why a low-voltage UPS cannot meet a grid-facing obligation.

## Module 5 — Two ways an inverter can behave
Grid-following as simpler, cheaper and adequate on a strong grid, but unable to start an island, contributing no inertia, and liable to back away during a disturbance. Grid-forming as establishing voltage and frequency itself, supporting islanding, synthetic inertia and black start, at the cost of harder control, fault-current duty and a less mature protection practice. Why the choice decides which asset holds a hybrid campus together during transitions.

## Module 6 — Connecting sooner by promising to be interruptible
Why interconnection studies assume the worst case, and what changes when that assumption is relaxed. Flexible load interconnection as the conversion of a construction problem into an operational agreement. Which workloads can genuinely pause and which cannot. Why on-site generation is what makes the commitment credible — and the reframing that follows: the plant is not only a bridge, it is why the connection came earlier. The division of labour the whole course returns to: **generation supplies energy, storage supplies time.**

## Module 7 — What changes at medium voltage
Five protection questions: available fault current and withstand ratings; device coordination across the campus; arc-flash energy and why architectures that limit fault contribution are valued beyond their electrical merits; the single-point-of-failure consequence of anything in series with the whole site, and the full-load bypass it demands; and clean island detection and separation. Why these five *are* the content of "medium-voltage" as a product claim.

## Pacing
Seven modules, roughly 30 minutes each. Modules 1–3 are one argument and should be taken together. Module 4 is the technical core and the one most worth re-reading. Module 5 is short but load-bearing for the Prevalon guide that follows. Module 6 is the course's most consequential commercial idea and pairs with Module 7 of the Enchanted Rock guide. Module 7 is reference material rather than narrative and can be skimmed first, returned to later.

## Sources for the technology and industry content
Grounded in the company's dossier and the sources registered there, plus standard power-quality, protection and interconnection fundamentals. No new research was carried out for this guide. Ride-through and interconnection requirements are described structurally rather than by citing a particular market's current rule text, which changes faster than a study guide can track. No company's deployment size, patent claim or test result is used as teaching material. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
