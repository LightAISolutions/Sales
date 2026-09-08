# Supermicro — Technology Lesson Plan

**Subject:** the engineering and economics of the seam between silicon and building — how servers become racks, what integration levels mean, what liquid cooling demands of a facility, and why this rung of the chain earns what it earns.
**Baseline assumed:** high-school physics. No prior data-centre knowledge.
**Total:** seven modules, about 5 hours 30 minutes with exercises.
**Not covered here:** the company's accounting history, its executives or its litigation. Those are dossier material; this is a technology and industry-structure curriculum.

**Where this sits against other plans in this directory.** `amd/` derives why the rack became the unit of compute and stops at the rack door. `vertiv/` and `delta-electronics/` cover the thermal and conversion plant from the facility side. `flex/` covers electrical distribution and contract manufacturing. This plan is the join: the rack itself, the cooling chain that leaves it, and the economics of assembling other people's components into a working hall.

---

## Module 1 — What a rack actually is (45 min)

**Objective:** read a rack elevation drawing and know why each dimension is what it is.

- The rack unit: 1.75 inches, 42 to 52 per frame, and why every piece of equipment is specified in U. Rack space as a currency.
- Two width standards and why both survive: the 19-inch inheritance from telephone exchanges, and the 21-inch open specification introduced so operators could publish designs anyone could build.
- Three things distributed vertically, each a design decision: power (busbar against cabled distribution), data (and why cable bulk is a real constraint at over a thousand cables per rack), and — newly — coolant.
- **What changes when a rack carries liquid:** it becomes a plumbing assembly with leak detection, quick-disconnect couplings and defined behaviour on server removal. A different manufacturing discipline from bolting servers into a frame.
- Static load, seismic qualification, and why a rack rated for 2,500 kg is a structural product.

*Exercise:* given a 48U frame, a rack power budget and a server that occupies 4U at a stated draw, work out how many fit before power rather than space becomes the binding constraint. Identify which constraint binds first and why.

---

## Module 2 — Integration levels and what each rung sells (50 min)

**Objective:** place any supplier on the integration ladder and state what it is paid for.

- The ladder: components, a built server, a built and tested rack, a tested cluster, and full facility scope.
- What each rung removes from the customer's project, and what it adds to the supplier's balance sheet before payment.
- **The commercial consequence, which is the point of the module:** assembling and testing a cluster means holding the most expensive components in the industry through the build cycle. This is why growth at this rung shows up as inventory and negative operating cash flow rather than as cash profit.
- Where validation value actually lies: catching faults before shipping, and warranting a cluster as one machine rather than as a pile of servers.
- Why this ladder, not the product catalogue, is the useful way to compare suppliers.

*Exercise:* given three suppliers' descriptions of what they deliver, place each on the ladder and predict the shape of its balance sheet — inventory intensity, receivables, cash conversion.

---

## Module 3 — Air, liquid, and the choice a building makes once (55 min)

**Objective:** know where air stops working and what liquid demands in return.

- The density ladder: air works below roughly 20 kW per rack and fails somewhere around 100. Why this is a limit of physics — required airflow and acoustics — rather than of engineering effort.
- Air cooling's real advantages, stated fairly: no new failure modes, no liquid near electronics, works in existing halls, cheap well-understood repairs.
- Its costs: fan power, the chiller and compressor overhead, and floor area consumed for the same computing.
- Direct liquid cooling: cold plates, coolant loops, and the density that follows.
- Its costs, stated equally fairly: the building must supply and accept facility water; leaks, coupling wear, coolant chemistry and filtration are new failure modes; servicing means breaking a fluid circuit; and the hall is locked to a thermal design.
- **The retrofit path:** the rear-door heat exchanger — a radiator in the rack door catching exhaust before it reaches the room, needing facility water but not cold plates. Why this is how most existing buildings actually adopt liquid.

*Exercise:* for a 240 kW rack, estimate the air volume per second that air cooling would demand and state why it is impractical. Then decide, for three buildings (a new build, a ten-year-old colocation hall, a converted industrial shed), which cooling approach fits and why.

---

## Module 4 — The cooling chain from the die to the sky (55 min)

**Objective:** follow the heat all the way out and name every stage.

- The cold plate: a precision part clamped to the package. Why contact quality determines everything downstream.
- Manifolds and the rack-height coolant distribution.
- **The coolant distribution unit as the pivot:** two loops kept separate — a clean controlled loop touching the servers and the facility loop touching the building — with heat transferred and not mixed, and with flow, pressure and temperature controlled for the servers. Rack-scale units at a few hundred kilowatts, row-scale units at a megawatt or more.
- Heat rejection outdoors: cooling towers (evaporative, effective, thirsty) against dry coolers (no water, degrading as ambient rises). Why the choice is usually decided by water permitting rather than by engineering.
- **The two governing numbers:** approach temperature, and the facility-water temperature the silicon permits. Why accepting warm water at around 45 °C can remove mechanical refrigeration entirely.
- Why efficiency claims are quoted as facility savings: the saving is mostly outside the rack.

*Exercise:* draw the full chain for one 1.8 MW row, labelling every component and both loops, and mark the two points where a temperature specification determines whether a chiller is needed.

---

## Module 5 — Who does what in a delivered rack (45 min)

**Objective:** separate the roles that a finished rack conflates, and know what each is paid for.

- The chain: silicon designer, foundry and packaging, rack OEM or system integrator, ODM, contract manufacturer, cooling and power specialists, colocation landlord.
- What each contributes, how each competes, and where the margin comes from at each rung.
- **The structural squeeze:** the integration rung is pressed from above by the silicon designer holding the scarce input and from below by ODMs doing the same assembly at two to three per cent for hyperscalers who do not want the service wrapper.
- Why an OEM at this rung expands into cooling plant, power subsystems and deployment services — it is the only way to sell something the ODM does not.
- Related-party and affiliated manufacturing as a structural pattern in this industry: what it is, why it is disclosed, and how to record it as fact without characterising it.

*Exercise:* take a delivered accelerator rack and attribute its bill of materials and its value-add across the roles. Identify which components the integrator makes, which it buys, and which it merely passes through.

---

## Module 6 — Reading an integrator's economics (50 min)

**Objective:** acquire three analytical habits that the headline figures will not give you.

- **Habit one: read gross margin against revenue growth, never alone.** Why pass-through of expensive bought-in components makes margin fall arithmetically as revenue multiplies, with no operational failure. Revenue growing five-fold while margin falls several hundred basis points is the integrator signature.
- **Habit two: read the cash-flow statement before the income statement.** Why substantial net income can coexist with billions of cash consumption, why that is what growth looks like at this rung, and why it means continuous external financing and dilution.
- **Habit three: distrust single-quarter margin.** Revenue lumpiness, deployment timing, and the difference between a recurring mix shift and a timing artefact. What to look for in management's own attribution.
- Putting them together: revenue growth tells you about demand for the silicon being resold; margin tells you how much of the rack is the vendor's own work; cash flow tells you who is financing the growth.
- Order, recognised revenue and cash received — three different events, and the gap between them is where the risk lives.

*Exercise:* given four quarters of revenue, gross margin, inventory and operating cash flow for an unnamed integrator, write a one-paragraph assessment of what changed and what did not. Then identify which single additional disclosure would most improve the assessment.

---

## Module 7 — Where it fails (40 min)

**Objective:** recognise the recurring errors in reading this rung, including in published commentary.

- Reading pass-through revenue as market power.
- Treating a vendor's own efficiency claims as measurements — what they are useful for and what they cannot support.
- Confusing selling a subsystem with leading its market, and why independent share data is the only settlement of that question.
- Assuming manufacturing-capacity figures are comparable when the same company publishes several with different scopes.
- Mistaking an order for revenue, and the effect of customer-requested configuration changes on recognition.
- **Compliance as a commercial variable:** for export-controlled equipment, a buyer's confidence in a supplier's controls is a purchasing criterion, so governance problems appear as cancelled orders rather than only as legal exposure.

*Exercise:* take five published claims about a rack vendor — a capacity figure, an efficiency percentage, a market-position statement, an order announcement and a margin comment — and for each state what evidence would be needed to accept it and whether that evidence exists.

---

## Suggested pacing

| If you have | Do this |
|---|---|
| One hour | Modules 2 and 6. The integration ladder and the economics that follow from it are the two ideas that make this rung legible. |
| Half a day | Modules 1–4. Ends with the complete cooling chain, which is the physical content most transferable to other companies in the corpus. |
| Two evenings | Evening one: Modules 1–4 (the physical product). Evening two: Modules 5–7 (industry structure, economics, error-spotting). |
| Before a meeting about a rack deployment | Modules 3 and 4, then Module 7's exercise. Cooling approach and what the building must supply are the questions that decide the project. |

Developed by: LightAISolutions
