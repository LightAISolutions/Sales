# Aon — Technology Lesson Plan

**Purpose:** teach **where the money behind an insurance policy comes from, and what sets its price** — how a regulator and a rating agency decide how much insurance can exist, how a catastrophe model turns weather into a premium and which of its four layers breaks for new technology, how capital-market money ended up paying hurricane claims, and what an underwriter does when the asset in front of them has no loss history at all. Aon is the worked example because it holds no underwriting capital of its own: its 10-K commits it to "capital-light professional services businesses", so everything it sells in this market is other people's balance sheets, assembled. A firm whose entire product is arranging capital is the clearest available lens on how capital gets arranged.

**How this plan relates to what you already have.** The **Marsh McLennan plan**, written in the same session, teaches the broking chain — whose agent each party is, how a placement is built, what a facility is. Read it first; this plan assumes it and goes underneath it to the capital. The **kWh Analytics plan** taught the underwriter's product and the **DNV**, **Sargent & Lundy** and **CSA Group** plans the engineering and certification seats. This plan is the one that explains why a certifier's signature has commercial value at all: because it is a substitute for data an underwriter does not have.

**Three ideas carry the plan.** Capacity is not appetite — it is priced capital, and it goes where it is paid best. A catastrophe price is a model output, so wherever the model has no data the price is a judgment with a decimal point on it. And the deepest structural problem in this corpus is that grid-connected batteries have almost no loss history, which is a *modelling* problem before it is a safety one.

**One boundary, held throughout.** Aon's published market forecasts — energy-transition premiums above USD 9bn by 2030, battery storage above USD 1bn of gross written premium by 2027 — are its own, published in a framework designed to help insurers capture that growth. They may be right; they are not independent estimates. Its only megawatt-scale battery figure comes from a brochure coded June 2018 that also claims a headcount half again its current one. And it publishes no leverage ratio at all, so every leverage figure in the dossier comes from S&P or from third-party reporting of management commentary.

**Suggested pacing:** Module 1 (~30 min). Module 2 (~40 min) — the arithmetic module; work the combined-ratio and rate-on-line examples on paper. Module 3 (~40 min) is the core of the plan; do not skip the vulnerability-layer discussion. Module 4 (~30 min). Module 5 (~30 min). Module 6 (~25 min). Then the flashcards and self-test in the app.

## Module 1 — Capacity is priced capital

**The single idea:** when someone says "the market has no capacity for that", they are never describing courage. They are describing price relative to the capital a regulator makes an insurer hold.

**The three constraints, in order of bite.** Solvency capital: regulators require an insurer to hold capital against everything it writes — more for volatile lines, more for concentrated exposures. Ratings: a lender's counsel will not accept paper below a threshold, so a rating is a licence to participate, which is why Aon advertises "A-rated or higher security through a combination of Lloyd's and company markets" as part of the product. And admitted status: an admitted carrier is licensed where it writes, files rates and forms, and its policyholders have a state guaranty fund behind them. New or volatile risks get refused by admitted markets and go to surplus lines, where the underwriter has freedom of rate and form and **none of those protections apply**. Nearly every genuinely new energy technology is insured this way.

**The economics that follow.** Capital demands a return. If underwriting a class does not earn it, capital leaves the class — and the price of everything in it rises until capital comes back.

**Why alternative capital changed this permanently.** A pension fund buying a catastrophe bond is not seeking an insurer's return on equity; it is seeking a return uncorrelated with its equity book, and will therefore accept a lower risk premium for the same risk. That structural difference is why insurance-linked securities have reached about USD 144.5bn with catastrophe bonds outstanding above USD 63bn — and why brokers can now assemble towers no traditional market could fill.

**Self-check:** a project is told its battery plant can only be insured in the surplus lines market. What has the buyer actually lost, and what should its lender check instead? *(It has lost state guaranty-fund protection and the regulator's review of rates and forms. The lender should check the carrier's financial strength rating, because that is now the only external assurance in the chain.)*

## Module 2 — The arithmetic every rate decision comes from

**The single idea:** four ratios explain almost every pricing behaviour in this market, including ones that look irrational.

**The identity.** Loss ratio — claims over premium. Expense ratio — acquisition costs, broker commission above all, plus administration, over premium. Combined ratio — the two added. Below 100 the insurer made money on underwriting alone.

**The thing that surprises people.** A combined ratio of 103 can still be a good year, because the insurer earns investment income on premium held between collection and claim payment. This is why rate cuts persist longer than intuition suggests, and why rising interest rates make soft markets *softer*.

**Why the expense ratio explains business models.** It is the half of the cost base a carrier controls by choosing its distribution. A managing general agent that brings pre-underwritten flow can be cheaper than a broker relationship — which is the structural argument for delegated authority, and therefore for kWh Analytics existing.

**Rate on line, and the two loss statistics.** Rate on line is premium divided by limit, the way to compare catastrophe pricing across layers and years. Average annual loss is the expected loss per year over a long simulated record — the technical core of a catastrophe premium, and silent about whether the loss lands this year. Probable maximum loss is the largest loss expected from a defined event under stated assumptions: an engineering estimate, not an observation. Marsh's own council representative noted that solar "insurance limits are sized well above the stowed PMLs" — buyers paying for limit the engineering says they do not need.

**Read the 2026 market from the identity.** Insurers earned near-record returns; capital flowed in; capacity rose; prices fell for eight consecutive quarters. Nothing about batteries or data centres got safer. The price moved because the capital moved.

**Self-check:** a carrier tells you its combined ratio improved from 101 to 97 while its loss ratio was unchanged. What happened? *(Its expense ratio fell four points — almost certainly a distribution change: less commission, more direct or delegated business. Nothing about the risk it underwrites has changed at all.)*

## Module 3 — How a catastrophe price is made, and where it breaks

**The single idea:** a catastrophe model has four layers, and knowing which one is weak tells you exactly how much to trust the number that comes out.

**The four layers.** *Hazard*: simulate tens of thousands of years of events. *Exposure*: what is where, and worth what. *Vulnerability*: for a given intensity at a given location, what fraction of value is destroyed. *Financial*: apply deductibles, sublimits and limits.

**What comes out.** A loss distribution, from which the quoted numbers are drawn: average annual loss, and the exceedance probability curve. A "1-in-100-year loss" is a point on that curve — **a 1 percent chance each year, not a schedule.** Two can arrive in consecutive years with nothing wrong with the model.

**Where new technology breaks it.** Hazard science is shared; everyone models hail the same way. Exposure is bookkeeping. But a vulnerability curve is built from observed damage to a population of assets that have actually been hit. For grid-connected battery storage that population barely exists — Aon states it plainly: "there is little in the way of claims data for BESS that are plugged into the grid, unlike comparable renewable technologies such as wind or solar."

**Even where data exists the models have been wrong, in a knowable direction.** kWh Analytics' research finds physics-based models overestimate the benefit of hail stow by 48 percent for three-inch hail. And peers disagree on the peril's size: kWh puts hail at 73 percent of solar losses by amount, GCube at 54 percent of losses from 1.4 percent of claims, VDE Americas at 2 percent of claims. The direction agrees; the shares do not.

**What substitutes for a model.** Engineering judgment applied as binary conditions. Aon asks for three metres or more of enclosure spacing where developers specify two. It requires wind-turbine "fleet leaders" to show substantial problem-free operating hours before treating a new model as insurable. It warns that "the current fire protection systems can do more damage and cause more losses in BESS than a fire itself." None of that is actuarial: it is a rule standing in for a distribution, with a charge for the uncertainty that remains.

**And the finding that connects this plan to the assurance segment.** Neither incumbent broker names a standard. Across every Aon battery and renewables publication reviewed and seven Marsh documents, no UL 9540A, NFPA 855, DNV, CSA, TÜV or IEC reference appears — Aon's single cited standard is SCOR's 2022 handbook. NFPA 855 specifies the separation both firms ask for. The brokers state the requirement and leave the code unnamed, which is exactly the gap a certification body exists to fill.

**Self-check:** an underwriter quotes a battery portfolio at a confident-looking rate. Which layer of the model would you interrogate, and what would you ask for? *(Vulnerability. Ask what loss population the curve was fitted to, and how many grid-connected storage losses are in it. If the answer is a handful, the number is a judgment and should be treated as one.)*

## Module 4 — Indemnity, parametric, and the risk hiding in the cheaper one

**The single idea:** the two ways of paying a claim fail in opposite directions, and choosing the trigger is the entire design problem.

**Indemnity** pays the assessed loss after adjustment. No basis risk; lenders understand it; it scales to the actual loss. But it is slow — Aon's own figures put average renewable construction claim duration at 11 to 13 months and complex claims beyond 24 — it is contestable, and it needs a loss history to price.

**Parametric** pays a fixed amount when a measured index crosses a threshold. Fast, uncontestable on causation, and writable even with no vulnerability curve. But **basis risk** is the whole problem: the index can fail to trigger while the asset is destroyed. A tight trigger pays reliably and costs more; a loose one is cheap and may not pay when it matters.

**The efficiency argument, quantified.** kWh Analytics' chief executive on its wind hedge: "For every dollar of premium paid, the project realized approximately six dollars in additional loan proceeds." Parametric cover here is a credit enhancement — it changes the lender's downside case, not the plant.

**Who is actually doing it.** Aon publishes parametric outage triggers as one of seven categories it expects the transition to need; this research found no independent source naming it on a parametric renewables or battery structure in 2025 or 2026. Marsh's current parametrics page names no renewables application. The challenger writes the contracts. That is the difference between publishing a category and selling a product.

**Self-check:** why did under 1 percent of a record USD 11.3bn of catastrophe-bond issuance in one quarter use a parametric trigger, when parametric is supposed to be the capital-markets-friendly form? *(Because investors price basis risk too. An indemnity or industry-loss trigger ties the payout to real losses, which investors can model; a parametric trigger transfers basis risk to whichever side accepts it, and neither side accepts it cheaply.)*

## Module 5 — How capital-market money ends up paying a claim

**The single idea:** a catastrophe bond is a reinsurance contract wearing a security's clothing, and the collateral trust is what makes it different from a promise.

**The sequence.** Decide what layer to transfer. Choose the trigger — indemnity, industry-loss index, parametric or modelled loss — trading basis risk against investor comfort. An independent modelling firm produces the expected loss, and that number is the price. A bankruptcy-remote special purpose vehicle issues notes and writes reinsurance to the sponsor. Book-building sets a spread as a multiple of expected loss. **Proceeds go into a collateral trust** — which is why there is no counterparty credit question, unlike a reinsurance recoverable. Cover runs multi-year, typically three, against an annually renewed policy. Either the trigger is breached and principal is written down, or investors keep the coupon.

**The scale.** Alternative capital USD 144.5bn; catastrophe-bond issuance USD 24.9bn in a year with outstanding notional above USD 63.4bn; sidecars USD 23bn; 78 sponsors including 16 first-timers; investor return 12.5 percent. This is a permanent second market.

**Why it matters here, and where it stops.** Data centres have a *limit* problem — no single insurer can take a USD 20bn site. Aon's statement that it can support individual projects to USD 13-15bn "using alternative capital sources" is this machinery pointed at a new asset class, and its first-ever data-centre reinsurance treaty aligns up to USD 5bn behind a single insurer so that carrier can afford to lead. What this capital will not yet do is price a warehouse of batteries with no loss history: it needs a modelled, definable trigger, which is precisely what storage lacks.

**Self-check:** a sponsor is choosing between a three-year catastrophe bond and annual reinsurance at the same expected cost. Name two reasons to prefer the bond and one to prefer the reinsurance. *(Bond: multi-year price certainty against an annually repriced market, and collateral rather than a credit promise. Reinsurance: a reinsurer may renew after taking a loss because it is pricing a relationship, whereas investors simply reprice or leave.)*

## Module 6 — Reading the arranger's own balance sheet

**The single idea:** a firm that arranges everyone else's capital still has capital of its own, and in 2026 Aon rearranged it dramatically — which is a live lesson in leverage that the dossier can teach with real numbers.

**The sequence.** Aon levered up for NFP in April 2024; total debt peaked at USD 17,016m and S&P recorded leverage peaking at 3.7x. It then repaid USD 1.9bn across 2025, sold the majority of NFP's wealth business for more than USD 2bn of proceeds and a USD 1,199m gain, and reached 2.5x pro forma. On 14 November 2025 S&P revised the outlook to stable at A-/A-2, **with a stated downgrade trigger of leverage sustained at about 3x**. On 30 August 2026 it agreed to buy USI for USD 17.0bn in cash, funded entirely with new debt, taking leverage to about **4.8x** — with buybacks paused, accretion deferred to 2028, about USD 710m of integration cost plus up to USD 400m of retention incentives, and an interim chief financial officer in post since 17 August.

**The discipline this teaches.** The company expects to maintain Baa2 and A-. An expectation is not a verdict, and as at nine days after announcement neither agency had published one. Recording both — the company's expectation and the agency's silence — without collapsing them into a prediction is the habit this whole corpus runs on.

**A second discipline: watch the adjusted line.** FY2025 net income rose 39 percent and GAAP EPS 36 percent, but adjusted EPS rose 9 percent, and the difference is the disposal gain. Aon has also beaten adjusted EPS by a hair while missing revenue in three consecutive prints, and free cash flow fell 34 percent in Q2 2026 against full-year guidance of double-digit growth. None of that is deterioration on its own; all of it means the adjusted line is doing more work than usual.

**And a third: check which criticism is actually true.** The common complaint that Aon lags Marsh McLennan on organic growth is **false** — FY2025 was 6 percent against 4 percent. The real weakness is in Health (2 percent for FY2025) and Wealth (1 percent in Q1 2026 against 2.9 percent expected). A criticism aimed at the consolidated number misses; the same criticism aimed at Human Capital lands.

**Self-check:** why does it matter to this corpus whether a broker's leverage rises? *(Because the broker is the counterparty assembling capacity for projects that will be built over three to five years. A ratings downgrade would not stop it broking, but it changes the cost of the debt funding its acquisitions, and a firm paying down USD 17bn is a firm with less to spend on building the next facility.)*

Developed by: LightAISolutions
