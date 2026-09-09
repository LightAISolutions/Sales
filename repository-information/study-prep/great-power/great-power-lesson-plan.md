# Great Power — Technology Lesson Plan

**Subject:** the parts of battery technology that a storage-only company never has to explain — disposable cells, sodium-ion, high-rate backup, and the certification machinery that decides who is allowed to sell a home battery.
**Assumed starting point:** high-school STEM. The CALB plan covers what happens when a storage cell gets very large; this one covers the rest of the map. Neither depends on the other, and they are complementary rather than sequential.
**What this is not:** a company crib sheet.

**Suggested pacing.** Seven modules. Modules 1–3 are chemistry and form factor and hold together as one sitting of about ninety minutes. Modules 4–7 are duty cycles, market access and how to read a manufacturer's numbers; module 7 is the most transferable and is worth a separate sitting.

**The one sentence to hold onto:** the cell is rarely the hard part — the hard parts are the duty cycle it must survive and the paperwork that lets it be sold.

---

## Module 1 — The battery that only works once

**Concepts:** primary against secondary cells · zinc-air · shelf life · self-discharge.

Start where almost no battery course starts, because it isolates the idea of reversibility.

A secondary (rechargeable) cell uses reactions that reverse cleanly. Lithium-ion manages this by intercalation: ions slide into and out of host structures and neither electrode is consumed or rebuilt, so the cycle repeats thousands of times. A primary cell uses reactions that do not reverse — an electrode dissolves, or a metal oxidises, and no practical current puts it back.

Teach zinc-air as the elegant case: it does not carry its own oxidant at all, but breathes oxygen from the air and oxidises zinc against it, so most of the cell's volume is fuel rather than packaging. Have the learner connect that to two everyday observations — why hearing-aid batteries are tiny yet long-lasting, and why they start running down the moment you peel off the tab.

**Then the commercial question:** why does anyone still buy a battery that works once? Because low-drain devices need years of shelf life, very low self-discharge, and low cost per unit of energy for a trickle load — not cycling. A smoke alarm, a water meter, a remote sensor and a hearing aid all want a cell that still works in a decade and never needs recharging.

**The point to install:** the battery industry is much wider than the storage and vehicle markets that dominate the news, and a company carrying a primary-battery line has a different cost structure and a different customer base from a pure storage maker.

---

## Module 2 — Four shapes and what each is for

**Concepts:** cylindrical · prismatic · pouch · coin · volume utilisation.

A cell's shape determines how heat leaves it, how it is manufactured, and how efficiently a pack of them fills a box.

Work through the four: cylindrical, wound into a metal can, cheapest and most robust, the round case resisting internal pressure without bracing; prismatic, flat and rectangular, filling a rectangular pack most efficiently and hence the grid-storage standard; pouch, sealed in flexible laminated foil, lightest and thinnest, conforming to awkward spaces; coin, miniature and usually primary.

**The trade-off to draw out:** the more rigid the case, the better it handles internal pressure and the worse it fills odd spaces. Ask the learner to predict what a swollen pouch cell does compared with a swollen prismatic cell — the pouch deforms visibly, the prismatic vents. That prediction, made from first principles, is the test that the module landed.

---

## Module 3 — Sodium-ion, and why cheap lithium killed its argument

**Concepts:** group 1 chemistry · hard carbon · layered oxide against polyanion · substitute economics.

The appeal is the periodic table. Sodium sits directly below lithium in group 1 and behaves similarly, but it is about the sixth most abundant element in the crust, available from salt and seawater, while lithium is scarce, concentrated and price-volatile. Sodium-ion also uses aluminium current collectors on both electrodes, because sodium does not alloy with aluminium at low voltage the way lithium does — a real bill-of-materials saving.

**The penalty is also the periodic table.** A sodium ion is larger and about three times heavier, at a less favourable potential: roughly 100–160 Wh/kg against LFP's 160–200. And the larger ion does not fit graphite's galleries, so the anode must be hard carbon, storing sodium in pores and between misaligned layers.

**Two cathode families.** Layered oxide stacks transition-metal oxide sheets with sodium between them — higher energy, more moisture- and over-discharge-sensitive. Polyanion locks the metal in a rigid phosphate framework — less energy, but almost no shape change as sodium moves, hence very long cycle life. Have the learner predict which route gives longer life *before* showing them the disclosed figures; they match the prediction exactly.

**Where sodium genuinely wins:** low temperature, and the ability to be discharged to zero volts and stored there safely, which makes shipping and long idle periods far less hazardous.

**Then the punchline, which is economics rather than chemistry.** Sodium's case rested mainly on escaping expensive lithium. Lithium prices collapsed, and the saving largely evaporated. **The general rule to install: a substitute technology justified on input cost is hostage to the price of the thing it substitutes for.** This generalises far beyond batteries — ask the learner for two other examples.

---

## Module 4 — Ninety seconds of power

**Concepts:** C-rate · internal resistance · high-rate design · UPS duty.

C-rate first: at 1C a cell delivers its rated capacity in an hour; at 10C in six minutes, at ten times the current.

Then the interesting claim. Pushing current ten times harder does not normally return the same energy — internal resistance turns some of it into heat and voltage sags, so the cell hits cut-off early. A cell retaining more than 97.5% of capacity at 10C has had its resistance engineered down hard: thicker collectors, more tabs, thinner electrodes, higher-conductivity electrolyte. **All of that costs energy density**, which is why a high-rate cell is a different design and not a tuned storage cell.

**Why a data centre needs it.** When mains power fails, standby generators need ten seconds to a couple of minutes to start and take load, and the UPS must carry the whole hall through that window. Enormous power, trivial energy.

**Then the comparison that makes the module land.** A grid cell discharges at 0.25–0.5C for hours, thousands of times, optimised for energy per dollar. A backup cell discharges at 10C for ninety seconds, perhaps a handful of times in its life, sitting fully charged and idle for years in between — so calendar life matters more than cycle life, the exact reverse of the grid case.

**The rule:** ask what the duty cycle is before comparing two cells, because the duty cycle decides which specifications are even relevant.

---

## Module 5 — A home battery is not a small grid battery

**Concepts:** scale and installation context · standards at the small end · channel structure.

A grid installation is megawatt-hours in a container on a fenced pad, liquid-cooled, professionally commissioned, under a maintenance contract. A home system is five to twenty kilowatt-hours on a garage wall, air-cooled, installed by an electrician who will not return, operated by someone who will never read the manual.

**That inverts the priorities.** Grid buyers optimise cost per kilowatt-hour over twenty years and a fraction of a cent per watt-hour decides a tender. Home buyers cannot evaluate any of that; they and their installers care about physical size, inverter compatibility, noise, appearance and certified safety in an occupied building.

**And note the counterintuitive part:** safety standards are stricter at the small end, precisely because the battery is inside a home and nobody is monitoring it.

**Finally the channel.** A cell maker in this segment typically sells cells and packs to residential brands and inverter makers who assemble and sell the finished product — so its end demand can be overwhelmingly European and Australian while its booked revenue is domestic, because the export happens one step downstream in someone else's accounts. Have the learner reconcile "70% overseas demand" with "15% overseas revenue" using only that fact.

**The reading rule:** when a maker's rank differs sharply between segments, look for a channel difference before assuming a technology difference.

---

## Module 6 — The barrier to entry is a filing cabinet

**Concepts:** market-access certification · lead times · witness laboratories.

Enumerate the wall: VDE 2510-50 and IEC 62619 for the EU at six to twelve months; UL 1973 and UL 9540A for the US at six to ten; AS/NZS 62619 for Australia at four to eight; JIS C 8715 and PSE for Japan at eight to twelve. Each must be repeated for a material design change.

**Two consequences to draw out.** First, a new entrant with an excellent cell is still about a year from selling it in four markets — which is why residential-cell rankings are unusually stable. Second, a move that looks like housekeeping is competitive: obtaining witness-testing-laboratory status with a certification body lets a maker's own laboratory generate data the body accepts directly, instead of queueing for its bench. Great Power obtained TÜV Rheinland witness status on 13 May 2026, and four months later a full UL 9540A:2026 fire test on its 5 MWh container was published, certified by TÜV Rheinland.

**Ask the learner:** is that a compliance function or a commercial one? In a market where certification lead time is the entry barrier, it is unambiguously commercial.

---

## Module 7 — How to read a manufacturer's numbers

**Concepts:** ampere-hours against gigawatt-hours · capacity utilisation denominators · commissioned research.

Three habits, each of which generalises.

**Convert before believing.** Ampere-hours measure charge and watt-hours measure energy; converting needs voltage, which depends on chemistry (LFP about 3.2 V, nickel about 3.7, sodium-ion about 3.0). A plant making several chemistries genuinely cannot state one meaningful GWh figure without disclosing its mix. Have the learner convert 10.121 billion Ah at 3.2 V — about 32 GWh — and compare it with the same company's website claim of more than 100 GWh. **Where an audited filing and a marketing page disagree by a factor of three, the filing is the number.**

**Find the denominator.** Capacity utilisation moving 68% → 126% → 166% looks impossible. It is not: utilisation measured against annualised *opening* capacity, while new lines are commissioned throughout the period, counts output from lines that did not exist in January. It is a real and bullish signal — capacity added fast and filled immediately — but it is not a productivity figure and cannot be compared across companies without checking the convention.

**Ask who paid.** A company may cite a research house ranking it first in a segment while two uncommissioned houses rank it second and third. Commissioning an expert market section for a listing prospectus is standard, disclosed practice and does not make the work wrong — but the scope was defined where one company's position was the point. The honest treatment states the range every source supports and notes which claim rests on the commissioned study alone.

**The ten-second test to install:** when a company cites a favourable ranking, ask which house, over what scope and period, and who commissioned it. If any of the three is missing, treat the rank as a marketing claim until you can supply the answer yourself.

---

*Sources for every factual claim above are the citations in `live-site-pages/profiler-data/great-power.profile.json`. The in-app rendering of this curriculum is `great-power.study.json`.*

Developed by: LightAISolutions
