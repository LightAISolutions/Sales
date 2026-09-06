# Cipher Digital — Technology Lesson Plan

**Purpose:** teach **the economics of bitcoin mining, and the specific, scheduled way in which they strand a fleet**. Five guides in this library already teach what a converted miner's landlord business looks like; every one of them begins after the decision to convert has been taken. This plan supplies the missing prerequisite — why the decision is compelled rather than opportunistic, and why it cannot be reversed.

**How this plan relates to what you already have.** **TeraWulf** teaches brownfield power and credit enhancement for a thin-credit tenant. **IREN** teaches the vertical-integration spectrum and GPU financing. **Core Scientific** teaches the four-stage power funnel and the take-or-pay colocation contract. **Applied Digital** teaches the AI-factory landlord model and unnamed-tenant concentration. **Crusoe** teaches energy-first siting. Read any of them for the destination. This plan is the departure.

**Three ideas carry it.** A bitcoin miner's revenue per machine falls automatically over time by design, through two independent mechanisms that never run the other way for long. The machines cannot be repurposed — a SHA-256 chip does no part of an AI workload — but the power position underneath them can, and is worth more to a GPU hall than to a mining shed. And the conversion is a one-way door: a fifteen-year lease cannot be paused when the bitcoin price recovers.

**One boundary, held throughout.** This plan stops where the lease is signed. Cooling design, rack density, PUE, tenancy structures and construction risk belong to the five guides above; the $9-11m per critical IT MW build cost appears here only as a figure to contrast with a mining shed's, not as a subject.

**A note on the fourth module.** Distinguishing contracted revenue from total contract value from NOI from capex is the most transferable thing in this plan. It is not accounting pedantry: it is the reason a widely repeated "over $19 billion combined" claim about two of these companies collapsed on inspection, its own components summing to $26.1bn.

**Suggested pacing:** Module 1 in one sitting with a difficulty chart open (~40 min). Module 2 with a hashprice series beside it — this is the technical core (~50 min). Module 3 with Cipher's FY2025 10-K disposal and impairment lines (~35 min). Module 4 with two lease press releases side by side (~45 min). Module 5 last, as synthesis (~30 min). Then the flashcards and self-test in the app.

---

## Module 1 — What a miner sells, and why a rival's spending is a cut in your pay

**Concepts:** proof of work · SHA-256 as a one-way function · ASICs and single-purpose silicon · hashrate, terahash, exahash · network difficulty · the 2,016-block retarget · the halving and the block subsidy.

**The move to make:** get the student to state, unprompted, that a competitor's capital expenditure reduces their revenue with no action on their part. Most people's model of competition is share-of-market; this is share-of-a-fixed-prize, recalculated fortnightly.

**Work through:** the mechanics of guessing against a target; why the payout is proportional and why no cleverness improves the odds; then the retarget arithmetic — world hashrate up 20%, difficulty up 20%, your unchanged fleet down about 17%.

**Exercise:** a miner holds 1.5% of world hashrate. Over a year, world hashrate rises 40% and one halving occurs. Ignoring the bitcoin price, what fraction of its starting revenue remains? (Answer: 1/1.4 × 0.5 ≈ 36%.)

**Common error to pre-empt:** treating a rising bitcoin price as unambiguously good for miners. It attracts capital, capital raises hashrate, the retarget raises difficulty, and the benefit leaks away within months.

---

## Module 2 — Hashprice, efficiency and the point where a fleet strands

**Concepts:** hashprice as the bundled revenue signal · joules per terahash · delivered power cost · all-in cost to mine versus cash cost versus electricity cost · fleet stranding.

**The move to make:** collapse the whole competitive question into two numbers, then show that everything else a miner says about strategy is one of those two numbers in disguise.

**Work through, with the 2026 series:** hashprice at $33.25 on 13 April, a trough of $27.66 in late June, $38 by late August — a 40% range in four months with no company doing anything. Then Hashrate Index's own note that $33 is at or below breakeven for many miners. Then efficiency: 15 J/TH against 30 J/TH is the same as 3c/kWh against 6c/kWh, and a student should be able to see that immediately.

**Then the payoff:** stranding is an arrival time, not a risk. Estimate it from efficiency, power price and the halving calendar.

**Exercise:** given a fleet at 25 J/TH on 4.5c/kWh power and a hashprice of $31/PH/day, is it cash-profitable? Then re-run it after a halving with difficulty unchanged.

**Common error to pre-empt:** accepting a company's published "cost to mine". It is usually electricity only. CoinShares put Hut 8's Q4 2025 all-in cost at $160,402 per bitcoin against a cash cost of $50,332 — the gap being largely stock-based compensation.

---

## Module 3 — What converts and what is scrap

**Concepts:** the interconnection queue as the binding constraint · substation and shell reuse · liquid cooling and rack density as the real retrofit · ASIC write-downs · curtailment and demand-response revenue · firm power as the price of an AI tenant.

**The move to make:** separate the asset from the business. The student should finish able to say that a miner's balance sheet is a power position with a depreciating lottery ticket bolted to it.

**Work through:** Cipher's own numbers — about 85% of Black Pearl's infrastructure repurposed; $96.1m written down on miners held for sale, $45.3m impaired at Odessa, $29.4m lost on disposals; the WindHQ joint-venture fleet sold to a rig manufacturer. Then the Odessa power contract as the counter-example: a 66.7% minimum take with supplier curtailment rights is workable for mining and not for a training cluster.

**Exercise:** list, for a 200 MW mining site, which line items survive conversion and which do not, and say which single item you would value the site on.

**Common error to pre-empt:** assuming curtailment revenue survives the pivot. It does not — flexibility is exactly what an AI tenant will not buy, and the forgone option premium is a real, rarely quantified cost of conversion.

---

## Module 4 — Four kinds of dollar figure

**Concepts:** contracted revenue over the base term · total contract value including unexercised renewals · net operating income and what a triple-net lease does to it · capital expenditure per critical IT MW · gross MW against critical IT load.

**The move to make:** build the taxonomy explicitly, then hand the student two real announcements and have them classify every number before drawing any conclusion.

**Work through, using Cipher's own inconsistency as the teaching material:** the same $5.5bn is "Estimated Contract Value" in November 2025 and "Contracted Revenue" in February 2026; the Fluidstack figure is "contracted revenue" in a headline, "contract value" in the same release's bullets and "minimum contracted revenue" in the deck; the pair is "approximately $8.5 billion in lease payments" in a third document; and the Stingray slide carries "~$2.0Bn of Contracted Revenue" and "~$2.0 - $5.7 Bn Contracted Lease Payments" together.

**Then the megawatt half:** Cipher publishes gross and critical IT for Barber Lake (300/207) and Stingray (100/70) and **only gross for Black Pearl** — so its largest lease cannot be compared with its other two on the same basis.

**Exercise:** given three landlords' headline figures over terms of 10, 15 and 20 years, restate them on a common basis and say what you still cannot know.

**Common error to pre-empt:** adding two companies' headline figures. That is precisely the error behind the "$19 billion combined" claim, whose own components summed to $26.1bn.

---

## Module 5 — The one-way door

**Concepts:** market risk against credit risk · counterparty concentration · guarantees that begin at rent commencement · the irreversibility of a long lease.

**The move to make:** frame the pivot as a risk transformation rather than a growth story. Mining revenue comes from an anonymous global market that cannot default but falls by design; lease revenue comes from one named tenant that can default but does not fall.

**Work through:** Cipher's concentration — two of three leases with Amazon, estimated at 48% of revenue by one analyst and about 66% of backlog by another, unreconciled. Then the 10-K's own qualification: guarantees are "only effective following the rent commencement date", are capped, and a delayed completion may let a tenant terminate without the guarantee ever triggering.

**Exercise:** write the two-sentence case for and against a miner converting its last operating site, given a hashprice of $38 and a fifteen-year lease at a 3% escalator on the table.

**Common error to pre-empt:** treating a signed lease as revenue. Cipher had recognised none at 30 June 2026 — the 10-Q says the leases "have not commenced and no revenue has been recognized" — while carrying $6,016m of debt against them.

---

## Where to go next

The five landlord guides, in the order that builds fastest: **TeraWulf** for credit enhancement, **Core Scientific** for the colocation contract, **Applied Digital** for tenant concentration, **IREN** for vertical integration, **Crusoe** for siting. Then **Hut 8** in this library for the consolidation boundary and non-recourse project finance, and **Galaxy Digital** for what happens when the owner is a securities firm rather than a miner.

Developed by: LightAISolutions
