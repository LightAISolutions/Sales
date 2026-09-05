# Anthropic — Technology Lesson Plan

**Purpose:** teach **the frontier lab as a compute buyer** — what it means to run a compute book across three silicon suppliers (Amazon Trainium under a commitment of "more than $100 billion over the next ten years", Google TPUs at "well over a gigawatt" in 2026 and "multiple gigawatts" from 2027, and NVIDIA through Azure, CoreWeave, Lambda and SpaceX's Colossus 1), how take-or-pay, prepayment and milestone money look from the buyer's chair rather than the seller's, the six ways a buyer can get a megawatt and why in 2026 this buyer moved down the ladder to sign a 20-year, 401 MW lease at Hawesville in its own name, why it bought 470 MW of generation instead of a power contract, who owns the chips when a lessor vehicle with residual-value support holds them, and the delivery window — 2H 2026 to early 2028 — in which the whole book is supposed to arrive. Anthropic is the worked example because its suppliers, landlords and investors are public or filing companies whose disclosures print the buyer's contracts from the other side: Amazon's 10-Qs on the convertible notes and the USD 20 billion milestone facility, TeraWulf's 8-K on the Hawesville lease, ERock's equipment order, Aker's and the landlords' filings on the Fluidstack and Nscale chains.

**How this plan relates to what you already have.** The **OpenAI guide** teaches scaling laws, training against inference, the compute offtake as project finance and the model-lab business model; the **xAI guide** teaches own-the-data-centre-or-rent-the-cloud, compressing the build, air permits and grid power against your own plant. This plan repeats neither: it does not teach why a lab needs compute, how scaling works, or how to build a Colossus — it teaches what the buyer signs, with whom, in what order, and where each contract's risk sits. The **Amazon, Google and Microsoft guides** own the sellers' economics (ASICs against GPUs, the compute-for-equity structure, buying power that does not exist yet); the **Fluidstack and Nscale plans** own the intermediary and the anchored neocloud. Here the same contracts are read from the buyer's side of the table, once.

**Three ideas carry the plan.** Three silicons is a hedge on architecture, not on counterparty — the suppliers are also the investors, the clouds and, through Google's backstops, the credit behind the landlords. In 2026 the buyer became a direct infrastructure counterparty without becoming an owner: it rents the building, buys the power and lets a lessor hold the silicon. And power, not chips, is the binding constraint, so the buyer is paying to remove it — grid upgrades, on-site generation, islanded campuses.

**One boundary, held throughout.** Anthropic is a private Delaware public benefit corporation with a confidential draft S-1 filed on 1 June 2026 and nothing public from it. Run-rate revenue (USD 9 billion at end-2025, USD 47 billion in May 2026) is the company's own statement; the Series H (USD 65 billion at a USD 965 billion post-money valuation) is announced; Google's holding of about 14% comes from court records via Fortune; the Nscale (about USD 45 billion, 460 MW) and Lambda (about USD 35 billion) contracts are reported and unconfirmed by either party; the dollar value of the Hawesville lease (about USD 19 billion) is TeraWulf's. The plan says so at each point, and leaves out what no filing states: the price per TPU-hour, the Trainium prepayment schedule, the terms of the Colossus 1 deal beyond "all of" more than 300 MW.

**Suggested pacing:** Module 1 in one sitting (~35 min). Module 2 with Amazon's latest 10-Q open (~40 min). Module 3 (~40 min) — it is the one that pays. Module 4 (~30 min). Module 5 (~30 min). Then flashcards and self-test in the app.

## Module 1 — The buyer's side of the table: three silicons, three kinds of contract

**The single idea:** each silicon comes with a different contract, a different counterparty and a different thing the buyer gives up.

**Trainium.** Bought as cloud capacity from Amazon — "primary cloud provider and training partner" — under a ten-year commitment of more than USD 100 billion for up to 5 GW; paid for, in part, with the investor's own money (USD 8 billion of convertible notes 2023–2025, USD 10 billion of Series G and H preferred in 2026, a USD 20 billion facility released "as we reach certain delivery milestones of compute capacity"). The buyer gives up portability: Trainium runs only on Amazon.

**TPUs.** Bought from Google as capacity ("well over a gigawatt" in 2026, "multiple gigawatts" from 2027, recapped by the buyer as 5 GW) and, through the Fluidstack chain and the Broadcom–Apollo–Blackstone chip vehicle, as leased hardware in halls the buyer subleases. Google holds about 14% of the buyer and guarantees its landlords' rent. The buyer gives up a second architecture's worth of engineering and takes a shareholder as its guarantor.

**NVIDIA.** Bought everywhere else — USD 30 billion of Azure with up to 1 GW of Grace Blackwell and Vera Rubin, CoreWeave, Lambda, all of Colossus 1 — on the shortest contracts and the most counterparties. The buyer gives up price and takes optionality.

**Self-check:** a buyer with three silicons loses one supplier. Which workloads move? *(Only the ones written for the other two — the hedge is on architecture, and moving a training stack between silicons is a project, not a switch.)*

## Module 2 — Take-or-pay, prepayment and milestone money, from the buyer's chair

**The single idea:** the seller's guaranteed revenue is the buyer's fixed cost, and the investor's cash is contingent on the supplier's deliveries.

**Take-or-pay.** The buyer pays for the capacity whether or not it is used; the CoreWeave guide teaches why the seller wants it. From the buyer's side it is a bet that demand will fill the book, funded by run-rate revenue that rose from USD 9 billion to USD 47 billion in five months — the only reason a ten-figure annual commitment is affordable, and the number that must keep rising for it to stay so.

**Prepayment.** Cash up front for capacity later, which funds the seller's build and gives the buyer priority in the queue; it turns the buyer into an unsecured creditor of the seller until delivery. Read every prepayment against the seller's balance sheet, not the buyer's.

**Milestone money.** Amazon's USD 20 billion facility pays out as compute is delivered: the investor's cash arrives when the supplier — the same company — ships. The circularity is contractual, not rhetorical: a late delivery is a late investment, and the buyer's plan absorbs both.

**Self-check:** run-rate revenue flattens for two quarters. Which contracts hurt first? *(The take-or-pay ones — the capacity fee is due regardless; prepayments were already spent, and milestone money simply stops arriving with the deliveries.)*

## Module 3 — The counterparty ladder: six ways to get a megawatt, and why sign the lease yourself

**The single idea:** each rung down the ladder trades a supplier's margin for the buyer's own credit and balance sheet.

**The rungs.** A cloud contract (Azure, AWS — the seller owns everything, the buyer owns a bill). A neocloud contract (CoreWeave, Lambda, Nscale — stated in GPUs and monthly fees, the seller's lender lends on the buyer's name). An intermediary tenant (Fluidstack — the buyer subleases halls a shell company leases on a guarantor's credit). A direct lease with a landlord (the 401 MW, 20-year Hawesville lease with TeraWulf, about USD 19 billion, "supported by an investment-grade credit", no Fluidstack entity in it). A build-to-suit in the buyer's name (Riot's 191 MW, the buyer as tenant). An owned campus — which this buyer has not done, and which the xAI guide teaches.

**Why sign the 401 MW yourself.** By mid-2026 the buyer's own paper could carry a lease that a landlord's bondholders would price; the intermediary's credit-substitution half was no longer needed, and its margin was the buyer's to keep. What the buyer takes on is a 20-year obligation on one campus and every clause the Fluidstack plan teaches — pass-throughs, escalators, construction-period risk — now in its own name.

**Why not own.** Owning the campus means owning the interconnection queue, the permit, the construction and the residual value of a building designed for one chip generation; the buyer's answer is to rent the building, buy the power and let a lessor hold the silicon — Module 4 and Module 5.

**Self-check:** a buyer moves from an intermediary sublease to a direct lease on the same campus. What did it gain and what did it accept? *(It gained the intermediary's margin and control of the clauses; it accepted a two-decade liability on its own balance sheet and the construction risk the guarantor no longer stands behind.)*

## Module 4 — Power before chips: why buy 470 MW of generation instead of a power contract

**The single idea:** the buyer's binding constraint is the wire, and it is paying to be first in a queue it cannot skip.

**The order.** A 470 MW equipment purchase order with ERock for on-site gas generation — gensets the buyer owns and a landlord installs — is a purchase of delivery certainty: an islanded or bridging plant does not wait for a utility's large-load process. Monarch's 2 GW of Caterpillar gas, bought by Nscale for a campus the buyer reportedly anchors, is the same answer at the neocloud's expense.

**The pledge.** "Build AI in America" — 50 GW by 2028, 2 GW per training run in 2027, 5 GW in 2028 — and the February 2026 pledge to pay "100% of the grid upgrades" are the buyer volunteering costs that utilities' large-load tariffs (the AEP and Entergy guides) are only beginning to require: transformers, switchgear, the consumer price effect. Data Center Frontier's flag that transformers, switchgear and chillers are the choke point on the Hawesville schedule is the reason.

**What it does not solve.** Owning generation solves the sites the buyer controls; most of the book sits in landlords' and clouds' interconnection queues, and a genset order cannot shorten those. Islanded campuses carry fuel, permits and heat — the Crusoe guide's material — which this plan only names.

**Self-check:** the buyer owns 470 MW of gensets at a landlord's campus. Who holds the air permit? *(The landlord, or the site company — the permit runs with the site, not the equipment owner; check before assuming the megawatts are the buyer's to move.)*

## Module 5 — Who owns the chips, when they arrive, and where the buyer fails

**The single idea:** the silicon is a lessor's asset with a residual-value promise attached, and every rung of the book lands in one window.

**The lessor vehicle.** A chip-leasing vehicle — Broadcom, Apollo and Blackstone in the reported structure — buys the TPUs, leases them to the halls the buyer uses, and carries the risk that the chips are worth less at lease end than the model assumed; residual-value support from the chip's designer is what makes a lender fund a five-year lease on a two-year product cycle. The buyer pays a capacity fee and never owns a chip; the vehicle's lenders are one more counterparty whose comfort depends on the buyer's run-rate.

**The delivery window.** Trainium "nearly 1 GW" by end-2026; Fluidstack sites "throughout 2026" with CB-5 already at early 2027; Barber Lake September 2026; River Bend Q2 2027; Hawesville 2H 2027; Rockdale December 2027; Monarch late 2027; TPUs "starting in 2027". No filing read reports a missed milestone; the May 2026 rate limits the company attributed to a compute shortage show what a shortfall costs.

**Where the buyer fails.** Supplier concentration measured in gigawatts per counterparty — the four largest suppliers are also the largest investors — is the number an S-1 will have to show. Delivery-date risk clusters in late 2027, when transformers are late for everyone at once. Power before chips, again: a lab can buy gensets and fund grid upgrades and still be rationed by queues its landlords sit in. And every contract above is funded by a revenue line that has to keep compounding.

**Self-check:** the buyer's book is 60 percent contracted through parties that are also shareholders. Is that diversification? *(Of architecture, yes; of counterparty, no — a shareholder-supplier that delivers late is also an investor whose milestone money is late.)*

Developed by: LightAISolutions
