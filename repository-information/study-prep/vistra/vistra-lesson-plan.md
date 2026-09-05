# Vistra — Technology Lesson Plan

**Purpose:** teach how an **operating fleet** earns, as distinct from a development pipeline — the merit order and who sets the price, the spark spread as a gas plant's gross margin, what a capacity market actually buys and why it buys accredited rather than nameplate megawatts, why an energy-only market and a capacity market produce completely different behaviour inside one company, the four different things a data centre can buy from a plant that already exists and which of them survives the additionality question, what a retail book does to a generator's hedging, and what owning an asset for twenty years costs when one of them burns down. Starting from high-school STEM. No company trivia: founding dates, executives and share counts stay in the dossier. Generated 2026-09-05 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → Vistra → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**Prerequisite.** The nine buyer-side plans in this corpus (Aypa, Spearmint, Intersect, Invenergy, GridStor, Available Power, esVolta, Strata, Hunt Energy Network) all teach a **developer** whose asset is a pipeline. Read at least Aypa and Spearmint first, so the contrast lands: this plan starts from 43,641 megawatts that already exist. The Classroom owns tolling agreements, ancillary-service stacking and battery duration-and-degradation, and does not repeat them here.

**Suggested pacing:** Module 1 in one sitting (~35 min — merit order, spark spread, dispatch), Module 2 (~35 min — capacity markets and accreditation), Module 3 (~30 min — the two market designs inside one company), Module 4 (~40 min — what a data centre can buy, and additionality), Module 5 last (~35 min — the natural hedge from the generation side, and what owning an asset costs), then the flashcard and self-test passes in the app.

## Module 1 — How a fleet earns in an hour

**The single idea:** fuel cost decides how often a plant runs; the *last* plant needed decides what every plant is paid.

1. **The merit order.** Every few minutes the operator ranks available units by the cost of their next megawatt-hour and works down the list until demand is met. The last unit needed sets the price, and every cleared unit receives it — uniform clearing.
2. **Where the technologies sit.** Nuclear and renewables at the bottom, marginal fuel cost near zero, so they run nearly always: baseload. Efficient combined-cycle gas in the middle. Peakers at the top, running a few hundred hours a year when nothing cheaper is left.
3. **Spark spread.** The gap between the power price and the cost of the gas to make it at a stated efficiency — the gross margin of a gas plant. A merchant gas fleet's earnings are approximately the spark spread times the hours it is economic to run.
4. **Two consequences.** A nuclear plant's economics are about *price*, not volume: it will run regardless, so what matters is what the marginal gas plant costs. A peaker's economics are about *scarcity*: it earns almost nothing for most of the year, which is why an offer cap is a decision about whether peakers get built at all.
5. **Capacity factor is not availability.** A 6,448 MW nuclear fleet produces far more megawatt-hours than a 26,989 MW gas fleet that runs part-time. Capacity is a rating; energy is what gets sold.

**Self-check:** a combined-cycle plant's efficiency improves by 5 percent. What happens to its position in the merit order and to its earnings? (It moves down the stack, so it clears in more hours; its spark spread widens at every price, so both volume and margin per unit improve.)

## Module 2 — What a capacity market actually buys

**The single idea:** a capacity auction buys an *option* — the right to call on a plant on a future day — and it buys it in accredited megawatts, not nameplate.

1. **The instrument.** The operator forecasts the peak it must cover plus a reserve margin, then buys that quantity of capacity in an auction typically three years ahead. Plants bid; a clearing price per megawatt-day emerges; every cleared plant is paid it.
2. **Unforced capacity.** What is bought is nameplate discounted for expected unavailability, using the unit's forced outage rate. This is the same idea as ELCC for a battery or solar farm, applied to thermal plants — the mechanism that makes a megawatt of one technology comparable with a megawatt of another.
3. **Reliability is revenue.** Improving availability raises accredited capacity, which raises saleable megawatts at a price the owner did not have to negotiate. An operator quoting "commercial availability of 97 percent or greater" during a heatwave is making a financial statement.
4. **The capital-allocation consequence.** Equipment that raises availability has a return computable directly from the accreditation gain times the clearing price. Equipment that only raises efficiency competes against that, and must argue on spark spread instead.
5. **The price collar.** Three consecutive auctions cleared at an administratively set ceiling. When that happens the cap, not the supply-demand balance, sets the price — so the revenue depends on whether regulators extend the collar. A market outcome has become a policy decision.

**Self-check:** two 500 MW plants bid into the same auction. One has a 4 percent forced outage rate, the other 12 percent. What does each sell? (Roughly 480 MW and 440 MW of accredited capacity — the difference is worth about $4.7 million a year at $325 per megawatt-day.)

## Module 3 — Two market designs inside one company

**The single idea:** almost every apparent inconsistency in how a multi-market merchant talks about its business comes from operating in both designs at once.

1. **Energy-only.** Generators are paid for energy and ancillary services only. Nobody buys capacity, nobody is obliged to build, and scarcity pricing bounded by an offer cap is the entire investment signal. A data centre arriving raises the number of tight hours.
2. **Capacity market.** The operator buys accredited capacity years ahead. A data centre arriving raises the demand curve in the auction, so it raises the clearing price for everyone — which is why load growth shows up in generator revenue before a single new plant is built.
3. **The split in one fleet.** 19,858 MW in the energy-only market, 22,254 MW across the capacity markets, 1,529 MW in a third design where resource adequacy is procured bilaterally.
4. **What this does to the accounts.** Capacity revenue is knowable years ahead: 10,924 MW cleared at $325.00 per megawatt-day for the 2028/2029 delivery year is a number the company can put in a plan. Energy-only revenue is weather. A reader who does not know which segment a figure comes from cannot interpret it.
5. **The two live policy fights.** In the energy-only market, an audit of a roughly 474 GW interconnection queue that paused new data-centre connections. In the capacity market, a co-located-load rulebook still being written. Both bear on the same commercial question from opposite directions.

**Self-check:** a gigawatt of new data-centre load connects in each market. Where does the generator see the revenue first, and through which mechanism? (In the capacity market, at the next auction, through a higher clearing price on capacity it already owns. In the energy-only market, only when the load actually causes tight hours.)

## Module 4 — What a data centre can buy from an operating fleet

**The single idea:** "a power deal" describes at least five different products, and only one of them is unambiguously additional.

1. **Energy under a long-term contract.** A fixed or escalating price for a stated volume over ten to twenty years. The seller gives up upside; the buyer gets certainty. Invites the additionality objection.
2. **Capacity.** A claim on the plant's availability, and in some structures the accredited capacity itself. The awkward question is who bears the penalty if the plant is unavailable when called.
3. **Clean attributes.** Certificates that let the buyer claim carbon-free consumption. Nothing physical changes. The awkward question is whether they are matched hourly or annually, and in which region.
4. **Firmness and speed.** A connection and a permitted site that already exist, years before a new plant could be built. This is often the real product; the electricity is the delivery mechanism.
5. **New capacity attached to an existing site.** An uprate, a new unit, or storage beside a plant that already has a connection. The only column that is additional by construction — which is why a 433 MW uprate programme keeps appearing attached to a 2,609 MW supply agreement. The buyer is paying for an answer as well as for power.
6. **The additionality objection, precisely.** Moving an existing plant's output to a new customer displaces the previous buyer onto whatever is next in the merit order, usually gas. Note also what these contracts are *not*: grid-delivered agreements, whose own release states that "the electricity generated at the plants will continue to go to the grid for all electricity users," sit outside the co-location rulebook entirely.

**Self-check:** a buyer wants a carbon-free claim, a firm megawatt and additionality. Which of the five products delivers all three, and what does it cost in time? (Only new capacity at an existing site — and it costs years, since an uprate programme here runs from 2026 to 2034.)

## Module 5 — The natural hedge from the generation side, and what ownership costs

**The single idea:** owning customers changes how much of your output you can sell forward; owning assets means you keep every risk for twenty years.

1. **The mechanism.** A generator with a retail book sells its output to its own customers rather than to banks. When prices move, the generation segments and the retail segment book equal and opposite unrealised marks — which is why segment-level reported earnings are meaningless in isolation and only the group's adjusted operating measure is comparable.
2. **The evidence in the hedge ratio.** This company reports roughly 100 percent of expected generation hedged for the prompt year, 94 percent for the next, 72 percent for the one after. A pure-play merchant in the same markets runs 85, 70 and 30 percent. The gap is what having your own customers buys.
3. **The limit the company states itself.** The businesses are countercyclical "to some extent," but a fleet of 43,641 MW against five million customers is still net long, and the residual wholesale position "may be significant."
4. **What ownership costs.** A 300 MW battery array housed *inside a retired power plant's turbine building* burned in January 2025. Roughly $400 million of remaining book value went to depreciation expense; a separate 100 MW building later took a $155 million impairment; only the 350 MW outdoor phase remains a restart candidate, and the filing says "when **or if**." A fleet fell from 1,024 MW to 624 MW without a single megawatt being sold.
5. **The second-order costs a project model omits.** $500 million of combined property and business-interruption insurance, now fully collected, against a remediation estimate that rose from about $110 million to about $175 million. Resource-adequacy contracts attached to the destroyed capacity roll off in 2028, taking roughly three-quarters of that site's contracted revenue. Litigation names the owner, the operating subsidiary, the battery supplier and the neighbouring utility. Nineteen months on, the official cause is still undetermined.
6. **The transferable engineering lessons.** Indoor installation concentrates risk — fewer than one percent of US storage facilities house batteries inside a building. Chemistry matters to consequence as well as cost: the litigation turns on nickel-manganese-cobalt cells rather than iron-phosphate. And a developer that sells at completion transfers all of this at closing; an owner does not.

**Self-check:** why did a 400 MW reduction in a storage fleet not appear as a disposal in the cash-flow statement? (Nothing was sold. One phase was written off to depreciation expense and another impaired; both moved to a closure segment. The capacity is gone, not transferred.)

## Whole-plan self-test

1. Explain uniform clearing and say who sets the price in a given hour.
2. Define spark spread and explain why it is the right measure for a gas fleet and the wrong one for a nuclear fleet.
3. Explain what a capacity auction buys and why it is not nameplate megawatts.
4. Give the mechanism by which new data-centre load raises a generator's revenue before any plant is built.
5. Name the five things a data centre can buy from an operating fleet and say which is additional.
6. Explain why segment-level reported earnings inside an integrated merchant are close to meaningless in one quarter.
7. State three second-order costs of an asset loss that a project financial model typically omits.
8. Explain what it means when three consecutive capacity auctions clear at the administrative price cap.

Developed by: LightAISolutions
