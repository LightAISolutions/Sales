# kWh Analytics — Technology Lesson Plan

**Purpose:** teach **how risk that a lender cannot hold is converted into a fee a sponsor can budget** — what property, performance and parametric insurance each do in a project financing, how a managing general agent underwrites on someone else's balance sheet, why hail rather than fire prices utility-scale solar, how a revenue put lets a lender size more debt, and what a battery underwriter actually reads in a submission. kWh Analytics is the worked example because it sits in every one of those seats without holding any risk itself: it prices on Aspen's paper, structures with Munich Re, insures the forecast on Swiss Re's and Everest's capital, and publishes the research that sets the market's vocabulary.

**How this plan relates to what you already have.** The **DNV plan** taught who decides bankability and what the independent engineer tests; the **Sargent & Lundy plan** the owner's engineer and the design-review sequence. This plan is the third chair at financial close — the insurer's — and assumes both. The **Fluence** and **Tesla** plans teach the battery as a machine; this one takes the machine as given and asks what it costs to insure. The **bankability guidance module** covers certification from the seller's side; the **CSA Group plan** (written in the same session) covers the certifier and the fire test the underwriter reads.

**Three ideas carry the plan.** Insurance is a conversion of an unbudgetable risk into a budgetable fee, and each product differs in *what triggers payment*. A managing general agent's product is capacity — the limit its carriers will let it bind — and it earns capacity with data. A revenue put or parametric hedge is a credit enhancement: it changes the lender's downside case, not the plant.

**One boundary, held throughout.** kWh Analytics publishes no revenue, premium, claims or headcount; its scale claims ('over $50 billion insured', '15 global reinsurers', '30% of U.S. solar assets') are the company's own and are treated here as claims. Its own site contradicts itself on dates and limits, and the March 2026 acquisition by Beazley has no published completion, price or terms. Where the plan quotes a number, the dossier records whose number it is.

**Suggested pacing:** Module 1 in one sitting (~30 min). Module 2 with a real property policy summary or broker submission checklist in hand if you can get one (~40 min). Module 3 (~35 min) — the arithmetic module; work the debt-sizing example on paper. Module 4 (~25 min). Module 5 (~20 min). Then flashcards and self-test in the app.

## Module 1 — What insurance does in a financing, and who is in the tower

**The single idea:** a lender sizes debt to a bad-but-plausible year; insurance is how the events that would make a year worse than that are moved off the project's cash flow and onto someone paid to hold them.

**Three things break the repayment promise.** The plant produces less than forecast; the plant is damaged and stops earning; a counterparty fails. The engineer covers the first, the contracts the third. Property insurance covers the second, and performance insurance extends cover to the first.

**The tower.** Sponsor (buys and pays) → broker (assembles the submission, markets it, earns commission) → managing general agent (prices and binds under delegated authority, earns commission) → carrier (issues the policy on its paper, holds the risk) → reinsurer (takes a share of the carrier's risk) → lender (requires the cover, reviews the wording, is loss payee). Draw it once; every product in this plan is a path through it.

**Who works for whom.** The broker works for the insured; the MGA works for the carrier. The lender's insurance adviser works for the lender and reads what the broker placed. kWh's Broker Council — AmWins, McGriff, Renewable Guard, WTW, Aon, CAC, Alliant, Marsh, Brown & Brown — is its sales force, not its competition.

**Self-check:** why does the lender not buy the policy itself? *(Because the sponsor owns the asset and bears the premium; the lender's protection is the loss-payee clause and the covenant requiring cover, both conditions of the loan.)*

## Module 2 — The managing general agent, and the anatomy of a property policy

**The single idea:** an MGA rents a balance sheet, and what it rents it with is knowledge the carrier does not have.

**Delegated authority.** The carrier says: you may bind on my paper up to this limit per location, for these asset classes, at this share of an account. Aspen's 2024 grant to kWh was 'USD 75 million per renewable energy project location', full authority for operational solar and storage, half for wind and construction; the 2026 renewal took it to USD 100 million and added 'minority asset classes'. Each step is a carrier trusting the MGA's judgment with more.

**Surplus lines.** kWh's paper is surplus-lines — non-admitted insurers writing what the admitted market will not — with the consequence its own disclaimer states: no state guaranty fund stands behind the carrier. A lender's counsel reads that sentence and checks the carrier's rating instead.

**The policy, term by term.** Limit per location (the most it pays for one site in one event). Perils (all-risk with exclusions, or named). Deductible (the first slice the insured bears; percentage deductibles on hail can exceed a year's cash flow). Sublimits (a lower cap inside the policy for one peril — where headline limits quietly shrink; sponsors are pushing back on grouping wind and tornado under the hail sublimit). Attachment point and excess layer (where the next layer starts; kWh's USD 20 million storm layer sits above the primary). Term (one year, against a 35-year asset: 'that tension is real'). Paper (whose promise it is).

**Resilience credits.** The MGA's pricing lever: a '72% reduction in the natural catastrophe insurance rate' for hail-hardened glass and a verified 53-degree stow; a deductible cut 50 percent for enabling automatic stow. From April 2026 tracker telemetry feeds the model directly — insurance priced on what the insurer can see.

**Self-check:** what does an MGA lose when a carrier withdraws its authority, and what does it not lose? *(It loses the ability to bind new business — its capacity, its product. It does not lose the policies in force, which stay on the carrier's paper to expiry, because the MGA never held the risk.)*

## Module 3 — Hail, the forecast, and the arithmetic of a revenue put

**The single idea:** the perils that matter are the ones that hit whole fields at once, and the product that matters most to a lender is the one that changes its downside case.

**Hail.** Kinetic energy rises with the cube of stone diameter; damage depends on energy and angle. Two levers: thicker fully tempered glass (kWh: glass/glass modules 'sustain up to 1.7x higher impact energies') and steep stow (75 degrees 'would have reduced damage probability by 87%' against 60 in one 2022 event). Models overstate stow's benefit for very large stones ('by 48% for ~3in hail'), which is why the 2026 report says hardened glass *and* stow. Loss shares are contested — 73 percent of losses (kWh), 54 percent (GCube) — but every book says the same thing: rare, and catastrophic when it comes.

**The forecast.** P50 is the output exceeded half the time; P90 nine years in ten; P99 almost always. Lenders size to the downside. The gap between P50 and P90 is revenue the sponsor expects and the lender ignores.

**The put.** Insure up to 95 percent of P50 for the loan's term; if output falls short for a covered reason, the insurer pays the shortfall within 30 days. The lender can now size to 95 percent of P50 instead of P90 — 'approximately 10% more debt'. Work it: a plant whose P90 is 90 percent of P50 with debt sized at 1.30x coverage on P90 cash flow; move the floor to 95 percent of P50 and recompute the debt the same coverage ratio supports. The increase is the product; the premium is its price.

**Parametric.** The wind hedge pays when measured wind speed falls below a threshold — objective, fast, priceable by a reinsurer without underwriting the plant — and carries basis risk: a broken turbine in a windy year is not covered. 'USD 6', then 'USD 7 of additional debt per dollar of premium' is the same exchange rate in a different currency.

**Self-check:** why is the put called a credit enhancement rather than insurance? *(Because its purpose is to change the borrower's credit — the lender's stress case — not to repair anything; it is insurance in form and a financing tool in function.)*

## Module 4 — Insuring a battery

**The single idea:** a storage underwriter prices thermal runaway, and it prices the enclosure and chemistry before it prices the technology.

**The checklist.** Chemistry and enclosure (indoor legacy NMC carries the loss record; outdoor containerised LFP is priced normally — Moss Landing was 'an impactful but not defining loss'). Propagation data (UL 9540A unit and installation levels; a large-scale fire test showing no unit-to-unit spread). Code compliance (NFPA 855 spacing and explosion control; 'the best submissions will have Hazard Mitigation Analysis reports, and they'll have Emergency Response Plans'). Commissioning (72 percent of failures within two years; 28 percent of system-level defects in fire detection and suppression; 'hot commissioning losses'). Operations data (HVAC and state-of-charge anomalies).

**The rate.** Technology risk 'stable at approximately 30-40 cents per US$100 of insured value' in mid-2025 — the only rate figure in the record, and market commentary rather than a rate card.

**What kWh does not sell.** No storage revenue, availability or degradation product. The revenue-put idea has gone to solar (resource and equipment) and wind (resource, parametrically), never to storage, whose revenue risk is merchant price rather than weather.

**Self-check:** why would an underwriter want a Hazard Mitigation Analysis rather than just a UL 9540 listing? *(The listing certifies the product against a standard's tests; the HMA is the installation-specific analysis of what happens at this site's spacing with this fire service — the question a claim will actually turn on.)*

## Module 5 — Where it fails, and where kWh sits

**Soft markets erode a resilience thesis.** kWh's own 2026 council: rates 'reducing', urgency for resilience 'diminished'. A discount for stow angles is worth most when capacity is scarce.

**The promise is worth the paper.** Surplus lines; no guaranty fund; one-year terms on twenty-year loans; sublimits inside headline limits.

**Claims of scale that nobody audits.** Assets insured, reinsurer counts, data shares, '30 days' — company figures. Treat them as the dossier does.

**Two integrations at once.** Beazley bought kWh in March 2026; Zurich is buying Beazley. Whether the Aspen programme, the reinsurer relationships and the brand survive is the open question; nothing has been published since June 2026.

**Where kWh sits.** Primary property underwriter on Aspen paper (USD 100 million per location); excess storm layer (USD 20 million); solar credit enhancement (the put, Swiss Re and Everest); parametric wind hedge (Munich Re); research and broker convening; no balance sheet of its own. Read the assurance segment's incumbents (DNV, Sargent & Lundy) and this insurer together: the engineer certifies the curve, the underwriter prices it.

Developed by: LightAISolutions
