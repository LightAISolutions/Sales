# NRG Energy — Technology Lesson Plan

**Purpose:** teach the **demand side** of an integrated merchant — why a retail electricity supplier is structurally short and why shape, not volume, is its real problem; what a natural hedge is and the one thing it saves that a financial hedge cannot; the collateral arithmetic that has historically destroyed merchant generators; the four numbers that decide whether a retail book creates or consumes value; how customers become a dispatchable resource through demand response and virtual power plants; and the vocabulary that separates a signed contract from a reserved turbine slot. Starting from high-school STEM. No company trivia: founding dates, executives and share counts stay in the dossier. Generated 2026-09-05 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → NRG Energy → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**Prerequisite.** The Vistra lesson plan (`study-prep/vistra/`) teaches the supply side of the same structure — merit order, capacity accreditation, and what a data centre can buy from an operating fleet. Do that first; this plan assumes it. The Oncor plan teaches the wires company that delivers all of this and the energy-only market it sits inside. The Talen plan teaches co-location and what the federal regulator decided.

**Suggested pacing:** Module 1 in one sitting (~35 min — the retail book as a position), Module 2 (~30 min — collateral, and how merchant generators actually fail), Module 3 (~35 min — the four numbers that decide whether a retail book earns), Module 4 (~35 min — demand response and virtual power plants), Module 5 last (~35 min — two ways to sell a data centre power, and the vocabulary of pipelines), then the flashcard and self-test passes in the app.

## Module 1 — The retail book is a short position

**The single idea:** a supplier sells electricity it does not own, at a price it cannot change, in a quantity it will not know until the period ends.

1. **Long and short.** A generator with unsold output is long: it owns power it has not sold. A retailer with signed customers is short: it owes power it has not bought. The two together are a company's net position, and an integrated merchant is deliberately trying to make them cancel.
2. **Shape, not volume.** A household uses very little at 4am and a great deal at 6pm in a heatwave — and the hours it uses most are the hours power is dearest. Buying a flat block does not cover a peaky load; the residual between the block bought and the shape served is a cost discovered after the fact.
3. **Weather is the dominant risk on both sides.** A mild season means the supplier sells surplus back into a market that is also mild, and therefore cheap. A hot season means buying the shortfall at the top of the market. This is why retail earnings swing so violently between quarters — in one recent year, $68 million of segment operating earnings in the first quarter and $773 million in the second.
4. **What generation does to the problem.** The heatwave shortfall can be met from the company's own units instead of bought at the peak. In its own words, integration "reduces the need to sell electricity to, and buy electricity from, other institutions and intermediaries, resulting in more stable earnings and cash flows, lower transaction costs and less credit exposure."
5. **The direction of travel matters.** This company began with customers and bought generation to match them: 96 percent of revenue is retail. Its peer began with plants and built a retail book to hedge them. The same structure, assembled from opposite ends, produces different instincts about which half is the business.

**Self-check:** a supplier hedges its expected annual volume perfectly with a flat forward purchase and the year comes in exactly on forecast. Can it still lose money? (Yes — if consumption arrives in a different *shape* than the block it bought, it buys the peaks at spot and sells the troughs back cheap.)

## Module 2 — Collateral: how merchant generators actually fail

**The single idea:** hedging with a third party consumes liquidity, and liquidity is what runs out first.

1. **The mechanism.** Sell power forward to a bank; the market moves against the trade; the bank asks for margin — cash or letters of credit posted against a position that has not settled. The bigger the book and the sharper the move, the larger the call.
2. **The disclosed scale.** A fifty-cent change in gas per million British thermal units moves the net value of this company's derivative contracts by roughly **$1.1 billion**; a fifty-cent *fall* would raise posted margin collateral by roughly **$1.4 billion**. That is working capital, needed quickly, in exactly the conditions that make funding hardest.
3. **What integration saves.** Every megawatt-hour that moves from the company's own plants to its own customers is a trade that never happens — no margin posted, no counterparty limit consumed, no credit line drawn. The company describes integration as producing "a reduction in actual and contingent collateral through offsetting transactions." That is the concrete content of the phrase "natural hedge."
4. **The alternative instrument.** A first-lien programme lets a generator grant liens on its assets to hedge counterparties instead of posting cash — no volume limit and no stated maturity. It converts a liquidity problem into a security-interest problem, which is cheaper but not free.
5. **The historical warning.** A peer in this corpus entered Chapter 11 in 2022 after "increased collateral posting requirements caused by rapid and sustained increases to wholesale natural gas and power prices" left it without cash to operate. The hedge that protects earnings can take the liquidity.

**Self-check:** why is a *fall* in gas prices the direction that raises this company's collateral posting? (Because it is short gas-linked power through forward sales; a price fall makes those positions valuable to the company and the counterparty asks for security against the mark, but the company's own hedges that lost value require posting. The point to internalise is that either direction can trigger a call depending on the book's sign — always ask which way the position points.)

## Module 3 — Does a retail customer earn its keep?

**The single idea:** a retail book is not valuable because it is large; it is valuable when lifetime margin exceeds acquisition cost plus uncollected revenue.

1. **Retail gross margin.** What the supplier collects minus what the power and its delivery cost to procure. It widens when wholesale prices fall faster than retail prices — which flatters a book that may actually be shrinking.
2. **Customer acquisition cost.** Marketing, commission and onboarding per customer signed. It is capitalised and amortised, so a growth push looks cheaper in the year it happens than it is: this company's amortisation of customer acquisition costs was $295 million in one year against $204 million the year before — past growth landing later.
3. **Churn.** The share of customers who leave. Watch for a retention rate quoted on a favourable base, or churn measured against total customers rather than the segment that is actually leaving. Here the retail energy count fell from 5,748 to 5,632 thousand in a year while smart-home subscribers rose from 2,226 to 2,419 thousand.
4. **Bad debt.** Billed revenue never collected. It rises after price spikes and in recessions — precisely when margin is already squeezed, so the two risks arrive together. The provision for credit losses ran $272 million, $314 million and $251 million across three years.
5. **The mix question.** Eight million customers here is two businesses moving in opposite directions. The subscription business carries about a quarter of adjusted operating earnings on 7 percent of revenue and 70 percent of the goodwill. A count without a mix is not a number.
6. **The regulator.** Millions of household contracts means supervision in every state served. One commission approved a $71 million consumer settlement in 2026 covering nine of this company's brands and roughly 278,000 customers. Retail scale brings retail regulation.

**Self-check:** a supplier reports 90 percent retention and record customer additions, and its energy customer count falls. How? (Retention quoted on the subscription segment while the energy segment churns; or gross adds counted against a larger gross loss. Ask which base each number uses.)

## Module 4 — Customers as a power plant

**The single idea:** from the operator's point of view a megawatt not consumed is indistinguishable from a megawatt generated.

1. **Demand response.** A customer is paid to reduce draw when the system is stressed. Sometimes by shedding load, sometimes by switching to on-site generation — in which case the permit, not the machine, decides whether it may participate.
2. **The virtual power plant.** Thousands of small distributed things — home batteries, thermostats, water heaters, commercial chillers, industrial processes — operated together so the grid sees one dispatchable resource. It sells the same products a power station sells, without any single plant existing.
3. **Two different businesses inside one company.** A commercial and industrial platform with roughly **6 GW** across more than 2,000 customers in every deregulated market — large sites with real processes to shed. And a residential programme built on smart thermostats and home batteries, whose 2025 target rose from 20 MW to 150 MW, was exceeded, passed 200 MW by early 2026, and targets 650 MW by 2030 and 1 GW by 2035.
4. **Why a retailer is unusually well placed.** The hard parts are customer access, a billing relationship and a reason to say yes. A supplier that already bills the household, already owns smart-home hardware in 2.4 million of them, and can offer a cheaper tariff in exchange for control has all three — which is why the partners are a thermostat maker, a home-solar company and a cloud provider rather than an equipment vendor.
5. **Why it matters more in an energy-only market.** With nobody paid to hold spare capacity, the system runs closer to its margin and the largest loads are treated as part of the reserve. A resource that turns demand down sells the same reliability a peaker sells, at a fraction of the capital cost — and it can be built in months.

**Self-check:** what does a virtual power plant sell, and to whom? (Capacity, energy and ancillary services, to the same grid operator that buys them from power stations — the product is identical; only the physical arrangement differs.)

## Module 5 — Two ways to sell a data centre power, and the vocabulary of pipelines

**The single idea:** existing-fleet sales are fast and contested; customer-funded new build is slow and durable — and most published pipeline numbers mix four different states of commitment.

1. **Sell from the existing fleet.** Fast, no construction risk, premium priced, and it fails the additionality test — the megawatt-hours existed already. Increasingly constrained: one state now conditions preferential permitting for large data centres on sourcing from new in-zone supply.
2. **Build new capacity the customer underwrites.** Additional by construction and politically durable. Paid for availability rather than consumption — this company states about 95 percent of the free cash flow rests on capacity payments, so utilisation is the customer's risk. But slow (a late-2029 target for a 2026 discussion), capital-intensive (about $3.2 billion, roughly $2,700 per kilowatt) and dependent on turbine slots that are reserved rather than ordered.
3. **The four states of commitment, in order.** *Signed* — 445 MW of long-term retail power agreements with one counterparty. *Aligned on principal commercial terms* — a 1.2 GW project explicitly "subject to final documentation and approvals." *Reserved* — 3.6 GW of turbine slots, which the manufacturer accounts for separately from firm backlog. *Up to* — a 5.4 GW development-agreement ceiling, an upper bound rather than a plan. Plus letters of intent with a "potential to scale to 6.5 GW" figure never repeated in a later filing.
4. **Development agreement versus joint venture.** Under a development agreement one party owns and operates the resulting plants while the others supply turbines and construction. In a joint venture the parties share equity and risk. This distinction decides who takes the loss if a site is never built — and the company's own filings never use "joint venture" for the arrangement widely described as one.
5. **A discount rate for any pipeline.** The grid operator in this market reported a queue of roughly 410 GW of large-load requests against about 9 GW with approval to energize — roughly a 2 percent conversion. Its own planning vice-president: "We don't expect all of those will materialize." Apply that funnel to any developer's gigawatt figure, including this one's.

**Self-check:** a chart stacks 445 MW signed, 1,200 MW at terms-agreed, 3,600 MW reserved and 5,400 MW of ceiling into a single "pipeline" bar. What is wrong with the bar? (It sums four different verbs. Only the first is a contract; the rest are, in order, a negotiation, an option on manufacturing slots and an upper bound.)

## Whole-plan self-test

1. Explain why a retail supplier is structurally short and why shape is harder than volume.
2. Define a natural hedge and name the one thing it saves that a financial hedge cannot.
3. Explain how collateral calls, rather than operating losses, have historically destroyed merchant generators.
4. Name the four numbers that decide whether a retail book creates value and give the failure mode of each.
5. Explain why a retailer is better placed than an equipment vendor to build a residential virtual power plant.
6. Distinguish "signed", "aligned on principal commercial terms", "reserved" and "up to".
7. State the difference between a project development agreement and a joint venture, and why it matters.
8. Give the additionality advantage of customer-funded new build over selling existing output.

Developed by: LightAISolutions
