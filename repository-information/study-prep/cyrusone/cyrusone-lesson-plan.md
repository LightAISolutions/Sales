# CyrusOne — Technology Lesson Plan

**Purpose:** teach **how anyone works out what a company is worth, and whether it is safe to lend to, when it publishes no accounts at all**. Specifically: what a take-private changes and what it leaves untouched; how a securitisation collateral table substitutes for an income statement; what a sponsor's hold period does to corporate behaviour; why an operational failure became a financing event; and what a landlord trades away when it puts its buildings on someone else's grid connection.

**How this plan relates to what you already have.** The **Digital Realty** plan is the direct prerequisite — it teaches REIT status, FFO, cap rates, yield on cost and mark-to-market against a company that publishes everything. **This plan is its mirror image**: the same asset class, the same arithmetic, no disclosure. **QTS** and **STACK** already teach perpetual capital and the fund-manager ownership chain; **Compass** teaches reading a private landlord through its listed sponsor; **Switch** teaches the securitisation round-trip; **Prime** teaches the recapitalisation ladder. What none of them does is treat the **bond documents as the accounts**, which is this plan's core technique.

**Three ideas carry the plan.** Going private removes the reporting, not the arithmetic — every valuation tool still applies, you simply have to find the inputs somewhere else. A rating-agency presale is the somewhere else: it must describe the collateral honestly to sell bonds, and in doing so it discloses what the company will not. And contracted revenue is conditional revenue — a long weighted average lease term is only as durable as the cooling plant, which is a lesson this company taught the market at scale in November 2025.

**One boundary, held throughout.** This plan stops at the money and the grid connection. Cooling design, rack density, PUE and electrical topology belong to the guides listed above; Intelliscale's 300 kW per rack appears here only as a specification the company publishes, not as a subject.

**A note on evidence.** More of this plan than usual consists of stating what cannot be known. That is not a gap in the teaching — it *is* the teaching. A student who finishes able to say precisely which questions about a private landlord are unanswerable, and why, has learned the thing this plan exists to convey.

**Suggested pacing:** Module 1 alongside the Digital Realty plan's Module 1 for contrast (~30 min). Module 2 with a securitisation presale summary open — this is the technical core (~50 min). Module 3 with the sponsor timeline (~30 min). Module 4 with the outage reporting (~35 min). Module 5 with the Texas SB 6 summary beside the Calpine releases (~40 min). Then the flashcards and self-test in the app.

---

## Module 1 — What going private changes

**Concepts:** take-private mechanics and deregistration · the distribution of ownership from an anonymous market to a small identified group · leverage as a deliberate feature of buyout equity · what does *not* change.

**The move to make:** insist on the fourth item. Students over-learn that private companies are opaque and under-learn that the underlying asset is unchanged, which makes them think the valuation tools no longer apply. They do apply; only the inputs are hidden.

**Work through:** the March 2022 transaction at about USD 15bn including assumed debt, Nasdaq suspension, and the Form 15 deregistration in April 2022. Then the ownership-language correction: GIP has been part of BlackRock since October 2024, so "GIP-owned" alone is stale, and the company's own current formulation is "Global Infrastructure Partners (GIP), a part of BlackRock, and KKR".

**Exercise:** list five facts a reader had about CyrusOne in February 2022 and lost in April 2022. For each, name a source that might still reveal it.

**Common error to pre-empt:** treating BlackRock as a CyrusOne owner. BlackRock owns GIP; GIP's funds own part of CyrusOne. The distinction matters when describing who decides.

---

## Module 2 — The collateral table as an income statement

**Concepts:** securitisation and the special-purpose issuer · CMBS and single-asset single-borrower structures · the rating-agency presale as a public document · appraised value · weighted average cap rate · tenant count and investment-grade share · WALT · DSCR · over-collateralisation and why the bonds can outrank the company.

**The move to make:** build the technique explicitly, field by field, then have the student assemble a partial balance sheet from a pool they have not seen before.

**Work through, field by field, using CONE 2025-1:** USD 575m of bonds against 13 data centres appraised at USD 4.4bn; 8.0% weighted average cap rate; 98 tenants at 83.5% investment grade; 8.6-year WALT; 1.6× DSCR; rated 'A-'.

**Then the progression**, which is the module's payoff — read across the four deals and watch concentration fall: CONE 2023-1 with one tenant at 41.7% of leased capacity, CONE 2023-2 with one tenant at 56.7% of rent and the top five at 88.3%, and CONE 2025-1 with 98 tenants at 83.5% investment grade. **A real, dated improvement in business quality that no income statement ever disclosed.**

**Exercise:** given a pool with a 7.5% cap rate, 1.35× DSCR and a 5.2-year WALT, state what each figure implies and name the single largest thing you still cannot determine about the company.

**Common error to pre-empt:** treating a deal-level DSCR as company leverage. It covers one pool, at issuance, and says nothing about corporate debt — which for CyrusOne is roughly USD 8.0bn of facilities that no coverage ratio is published against.

---

## Module 3 — The sponsor's clock

**Concepts:** fund life and hold period · MOIC versus IRR and why timing separates them · the three exits — trade sale, continuation vehicle, IPO · reading a limited partner's mark · how to weigh single-source transaction reporting.

**The move to make:** teach the difference between a *preparation* and a *decision*, using a live example, and make the sourcing assessment part of the analysis rather than an afterthought.

**Work through:** March 2022 to 2026 is year four of a typical four-to-seven-year window. Pantheon Infrastructure's 1.7× MOIC mark on about GBP 21m of NAV — the only quantified equity data point in existence. Then the Reuters report of 10 August 2026: an IPO as early as 2027, about USD 5bn, Goldman Sachs and Morgan Stanley pitching.

**The set-piece:** have the student argue both sides. *For credibility* — named banks, a named year, a size, from a wire service. *Against* — every named party declined to comment, no size or valuation decided even on the reporting's own terms, effectively one outlet. Then require the conclusion to be stated as "credible reporting of a preparation", not as a fact. Finally, note the CEO change eleven days earlier and the outage eight months before, and require the student to **decline** to connect them, because no source does.

**Exercise:** a fund returns 1.7× after three years and another returns 1.7× after nine. Compute nothing; explain in two sentences why the sponsors would regard these as entirely different outcomes.

**Common error to pre-empt:** treating one limited partner's NAV mark as a valuation of the company. It is one investor's carrying value of one slice.

---

## Module 4 — Why an outage is a financing event

**Concepts:** the failure chain from procedure to trading halt · concentration inside a collateral pool · deal pause and repricing · lease termination clauses · spread widening as a market-level consequence.

**The move to make:** get the student to trace the causal chain in order — procedure, cooling, tenant, collateral, bond, spread — rather than treating the outage and the financing as two separate stories.

**Work through:** 28 November 2025; a cooling failure at Aurora takes CME Group's markets down for more than ten hours. The stated cause is that staff and contractors "failed to follow standard procedures for draining cooling towers ahead of freezing temperatures", with outdated architecture and absent automated controls cited in follow-up reporting. Within a week Goldman Sachs pauses a USD 1.3bn CMBS secured on that same campus, where CME was about 14% of underwritten rent. The deal returns at USD 1.25bn. Market-wide, AAA single-borrower data-centre CMBS spreads widen from 153 to 168 basis points over the year to July 2026.

**The idea to land:** data-centre leases commonly carry termination rights for multiple recurring outages. Therefore contracted revenue is conditional revenue, and an 8.6-year WALT is 8.6 years *while the halls stay cold*. Uptime is a financial input, not merely an operational metric.

**Exercise:** you are underwriting a data-centre bond. Write three diligence questions about operations that you would not previously have asked, and say which collateral field each one bears on.

**Common error to pre-empt:** filing this as reputational damage. The measurable consequence was a repriced bond and a wider market spread.

---

## Module 5 — Powered land and the curtailment bargain

**Concepts:** interconnection queues as the binding constraint · powered land as a product · monetising an existing connection · Texas SB 6 and the 75 MW threshold · thirty-minute curtailment without compensation · interruptibility as a priced feature.

**The move to make:** present it as a trade with two halves and refuse to let the student keep only the attractive half.

**Work through:** Freestone County at 380 MW signed plus an exclusive further 380 MW beside Calpine's Freestone Energy Center; Bosque County at 400 MW beside the Thad Hill Energy Center; Fort Worth at 200 MW on Eolian's Chisholm Grid battery. Then the distinction that makes the Fort Worth deal interesting: Eolian is monetising the battery's **existing interconnection**, not primarily its stored energy.

**Then the price.** Texas SB 6, effective June 2025: loads at or above 75 MW must curtail fully within thirty minutes of an ERCOT emergency instruction, without compensation, with remote-disconnect equipment on new large loads. Every CyrusOne Texas flagship is both co-located and far above the threshold. The parties describe this as coordination — "curtailing in times of need" — and the company's own community page tells residents the utility will require it.

**Exercise:** a tenant training a large model is offered two sites — one two years away in an interconnection queue, one available next year but interruptible within thirty minutes. Argue each side, then state what information would settle it.

**A closing caution to teach explicitly.** CyrusOne withdrew its own tax-abatement request in Freestone County in June 2026, and the county judge observed that the county consequently "no longer ha[s] any say". In Yorkville, Illinois, where no such withdrawal occurred, the city extracted a USD 15m payment, a water cap cut from 500,000 to 40,000 gallons a day, and continuous noise monitoring. **Same company, two levels of local leverage, two very different outcomes** — and the abatement is the variable. Consent is a negotiation whose currency is the incentive.

---

## Where to go next

Read the **Digital Realty** plan first if you have not; the two are designed as a pair and the contrast is the point. After both, the **Compass**, **EdgeCore** and **PowerHouse** plans show three further variations on private landlord capital, and the **Eolian** dossier shows the Fort Worth arrangement from the battery owner's side.

Developed by: LightAISolutions
