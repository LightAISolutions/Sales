# Jupiter Power — Technology Lesson Plan

**Subject:** Jupiter Power (private; BlackRock-owned standalone storage IPP with an in-house trading desk) · **Written:** 2026-09-06 · **Baseline assumed:** high-school STEM, no trading or optimisation background.

**What this teaches.** Why the same battery in two different hands is two different assets. Stored energy as inventory with an option attached; how an offer curve is built and what each of its four inputs contributes; what a cycle actually costs and why a well-run battery declines spreads that look profitable; what changes when a market clears energy and reserves together; and the choice between operating the asset and selling the right to dispatch it.

**Why this gap.** Grid batteries are close to commodities, so nothing on the supply side explains why two owners with identical hardware at the same node earn materially different returns. The answer is entirely in the control layer, and no guide in the corpus covered it.

**Its place in the buyer set.** Fourth of five, and the natural sequel to the Eolian guide's closing module. Apex Clean Energy covers the project lifecycle, Arevon the contract, Eolian the revenue stack, this one the dispatch decision, Key Capture Energy the regulated purchase. Chemistry stays with REPT and Gotion.

## Module 1 — Inventory, not generation
Why a generator's operating decision is a price threshold and a battery's is not. State of charge as a stock refillable only by buying at another hour, so every dispatch exercises an option on the rest of the day. State-of-charge policy as the place operators differ most. Nodal rather than regional price forecasting, and why congestion makes that distinction expensive.

## Module 2 — Day-ahead against real-time
Two markets, two roles. Why a day-ahead commitment is financially binding and therefore a hedge, why real-time is where the volatility lives, and why managing the relationship between the two is a separate skill from forecasting either.

## Module 3 — Building an offer curve
The four inputs — nodal price forecast, degradation cost, round-trip efficiency including auxiliary load, and state-of-charge policy — and the specific failure that follows from getting each one wrong. Why they interact, and why optimisation is therefore a joint problem judged over seasons rather than days.

## Module 4 — What a cycle costs
Warranty as a usage envelope rather than a period of years: cycles per year, temperature range, depth-of-discharge and rate limits. Battery life as a budget denominated in throughput, and degradation cost as that budget priced per megawatt-hour moved. Why deeper cycles cost disproportionately more, so the degradation cost used in a bid is itself a function of how the asset is being run. Why every tolling agreement contains cycle limits — they are the transfer price for battery life.

## Module 5 — Co-optimisation
What changes when energy and ancillary services clear together in the same short interval, and what changes again when the clearing engine tracks state of charge. Both directions of the consequence: more efficient and less gameable awards, but a narrower advantage for a sophisticated desk and an honest assessment of short-duration deliverability. The general lesson — market design is a capital-allocation input, and reading proposed rules is technical due diligence.

## Module 6 — Who holds the button
Operating the asset against selling the dispatch right. Retained optimisation margin and compounding fleet learning against predictable revenue, cheaper debt and narrower obligations. Why large owners do both project by project, and why a fleet's contracted proportion is a readable signal of its owner's current market view.

## Module 7 — Where the performance gap comes from
Five decisions, none about hardware: price forecasting, state-of-charge policy, the energy-against-reserves split, cycling depth and outage timing. The naive version of each against what a good desk does instead. Why owners describe dispatch software as intellectual property, and why third-party optimisation is a real market.

## Pacing
Seven modules, roughly 35 minutes each. Modules 1–3 are one continuous argument and should be taken in a single sitting. Module 4 is the one to re-read: cycle cost is the concept most often left out of intuitive reasoning about storage. Modules 5–7 can be taken singly.

## Sources for the technology and industry content
Grounded in the company's dossier and the sources registered there, plus the market-design and battery-warranty fundamentals the corpus already teaches. No new research was carried out for this guide. Dispatch mechanics are taught structurally — no figures for prices, spreads or returns are asserted, because those move faster than a study guide can track. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
