# DNV — Technology Lesson Plan

**Purpose:** teach **what makes a battery project financeable and who decides it** — why "bankable" is a lender's word rather than an engineer's, what the independent engineer (IE) is hired to test on the lender's behalf, why degradation is the line where a storage financing leaks money, where the test data behind a warranty curve comes from, what a certificate, a recommended practice and a bankability report each prove and fail to prove, how reliance and liability actually work, and the eight ways an IE fails a project. DNV is the worked example because it occupies every seat at once: it writes the recommended practice (DNVGL-RP-0043), runs the laboratory (the Battery Scorecard, the Rochester and Texas facilities), certifies the OEM's product (Trina Storage, Huawei), witnesses the burn test (Sungrow, Prevalon) and sits as lender's engineer (Akaysha, Zenobē, TotalEnergies).

**How this plan relates to what you already have.** This is the first half of a two-part lesson. The **Sargent & Lundy plan** is the second half: the owner's engineer against the independent engineer against the EPC, the 30/60/90 percent design-review sequence, how engineering firms are paid, and campus power for data centres. Nothing here repeats it. The **bankability guidance module** in the Profiler app (role-gated) covers the same ground from the seller's side — how a supplier gets past the IE; this plan is written from the lender's chair. The **Fluence** and **Tesla** plans teach the battery as a machine and its warranty as a product; this plan takes the warranty as given and asks who checks it.

**Three ideas carry the plan.** Bankability is a property of the *package*, decided by the people putting money in. The IE's independence is the *product* — it is worth nothing if the party paying for it can shape it. And every claim about a battery is a claim about a *curve*, so the questions that matter are about conditions, not numbers.

**One boundary, held throughout.** DNV's own website could not be read while this plan was researched (a bot challenge fronts every page). The company facts here come from its Annual Report 2025 as hosted by a third party, from its releases on news wires and from client and trade-press statements; dnv.com pages are cited by title only. The mechanism of the IE, the tests and the documents is drawn from project-finance counsel, national-laboratory financing studies, the RP-0043 text itself and the record of named deals.

**Suggested pacing:** Module 1 in one sitting (~30 min). Module 2 with a real OEM warranty in hand if you can get one — it is the module that pays (~40 min). Module 3 (~30 min). Module 4 (~25 min). Module 5 (~20 min). Then flashcards and self-test in the app.

## Module 1 — What "bankable" means, and who is in the room

**The single idea:** a project is bankable when a credit committee will lend against it, which means every question the committee asks has a defensible answer from someone it trusts.

**The three tests, in order.** Does the technology perform as claimed, for as long as claimed? Will the counterparties still be standing when the guarantee is needed? Do the contracts allocate the risks the way the model assumes? A "top-tier cell" answers the first partly and the other two not at all.

**The ring of advisers.** Legal counsel on enforceability; an insurance adviser on what is insurable and at what premium; a market consultant on what merchant revenue is worth; the independent engineer on whether the machine and the plan are sound. The IE report is the one the others lean on because every other question eventually reduces to whether the plant performs.

**The date.** Financial close is when the loan agreement's conditions precedent are satisfied and money can flow. The IE report is almost always a condition. The engineer is clearing a gate on a calendar, and everyone knows the date.

**Who appoints, who pays.** The lender selects the IE from a panel it trusts; the developer pays the fee. The party bearing the risk chooses the adviser; the party wanting the money bears the cost. This is what makes independence enforceable: a firm that pleased its paymaster would fall off the panels that hire it.

**Self-check:** why does the IE not opine on power prices? *(Because that is the market consultant's question; the IE validates every technical input to the model and stops at the commercial ones — which is also why DNV sells both services separately, and in Chile sold the market role three times in a year.)*

## Module 2 — Degradation: the curve the whole financing sits on

**The single idea:** a battery is the only power plant that gets smaller every year by design, so a battery financing rests on a curve, not a number.

**Two clocks.** Cycle fade — capacity lost per charge and discharge — and calendar fade — loss with time at rest, faster when warm and at high state of charge. A grid battery that idles full in a hot climate can lose more to the calendar than to its cycling. A useful curve separates the two.

**The warranty is a curve with conditions.** The OEM guarantees a retention path only inside an envelope: cycles per year, depth-of-discharge window, temperature band, sometimes a resting state of charge. Outside the envelope the guarantee is void. The IE's most valuable single sentence is usually *the revenue model cycles this plant more than the warranty permits*.

**Augmentation buys the curve back — at three costs.** Money (a capital line in the augmentation years), room (spare rack positions, inverter and transformer headroom, a fire-code layout drawn for it) and supply (a compatible product still on sale a decade later). A model that assumes augmentation and a site plan with nowhere to put it is a quiet contradiction; the test is the drawing.

**Where the independent curve comes from.** Standardised cell testing — fixed depth of discharge, rates, temperatures, rest periods and measurement method — so that different manufacturers' cells sit on one chart. DNV's public statement of the method is its recommended practice on standardised cell testing; its anonymised results are the Battery Scorecard (editions 2018, 2019, 2020 with "5 million hours across 40 examinations" of 22 batteries, 2022 with 19 cell types, 2024 with "dozens"). Its safety half is the abuse test — overheat, nail, overcharge — that found onset temperatures "vastly different across cells" that all carry the same certificate.

**What the lab cannot tell you.** Batch variation, BMS calibration, cooling behaviour and the operator's real dispatch move the curve after the lab is done. The IE treats test data as evidence to weigh against the warranty, not as a forecast — which is why the same firm sells operating monitoring for the years after close.

**Self-check:** a plant is guaranteed 70 percent retention at 6,000 cycles, and the model shows augmentation in year 7. What three documents do you ask for? *(The warranty's full conditions page, the site layout with augmentation positions marked, and the inverter and transformer ratings against the augmented battery.)*

## Module 3 — Three documents that are not the same, and what an IE report contains

**Certificate, practice, bankability report.** A product certification (UL 1973, UL 9540, IEC 62619) proves a sample met a standard's tests on the day; it says nothing about degradation, field reliability or this project's use case. A recommended practice (RP-0043) is a whole-system, whole-lifecycle checklist a tender can cite and a diligence can follow; it stamps nothing. A bankability report is about the *seller* — financial strength, factory, service network, track record — commissioned and paid for by the seller; Trina Storage bought two at once, from DNV and UL Solutions. Only the IE report is about *this* project, and only the IE report is written for the lender.

**Why a practice exists at all.** Standards stop at boundaries on purpose so that they can be tested and enforced. RP-0043's stated aim was to "cover a broad range of energy storage technologies, instead of one or more battery types", to "have a system-level approach", and to be "comprehensive and structured"; its 2017 update added cyber security, warranties, decommissioning, tendering, bankability and residual value — the table of contents of a buyer's due diligence, published as a document. It is used three ways: as employer's requirements in a tender, as a diligence checklist, and as the basis DNV certifies against. No regulator mandates it, and this research found no RFP, tariff or insurer document that cites it.

**Inside the report, in order.** Technology review (proven or first-of-a-kind?); design review against the use case; contract review (EPC, supply and warranty, LTSA, interconnection, offtake or tolling — are the risks the model assigns to others actually theirs on paper?); financial-model inputs (capacity, efficiency, degradation, availability, O&M, augmentation cost and timing); permitting and safety (NFPA 855, UL 9540A data and what it does and does not show); schedule and budget (long-lead items, contingency, queue position); construction monitoring (monthly visits, drawdown certification — "no drawdown certificate, no disbursement"); commissioning and operations (witnessing the capacity and efficiency tests; annual reviews against guarantees).

**Fire testing, level by level.** Cell tests give onset temperature and gas; module tests show cell-to-cell propagation; unit tests show module-to-module propagation and what suppression does; installation-scale burn tests — Sungrow's 20 MWh test at real spacing, supervised by DNV — show unit-to-unit propagation and the heat exposure of neighbours. None gives a probability of a field event. A witness attests to the conduct of a test, not to the safety of a product; the reputational asymmetry runs one way.

**Self-check:** a data room contains a UL 9540 listing, a 2023 bankability report on the OEM and a witnessed burn-test video. Which lender question is still unanswered? *(All three: whether this project's design, contracts and model hold together — the IE report. The three documents are about the product and the seller, not the project.)*

## Module 4 — Reliance, liability and why you cannot see the work

**The single idea:** a report is only useful to the people it is addressed to.

**Reliance letters.** The engineer's duty of care runs to its client. Anyone else — a tax-equity investor joining later, a bond trustee, a buyer in year five — needs a reliance letter extending that duty, usually under the same conditions and cap. No letter, no legal right to rely. Buyers of operating portfolios therefore commission fresh technical due diligence, as the buyer of TotalEnergies' 789 MW German portfolio did in 2026.

**Caps.** Engineering firms cap liability at a multiple of fee or a fixed sum; a marine type-approval certificate in the record states USD 300,000 on its face. Against a financing of several hundred million the engineer's exposure is a rounding error. The report's value is information, not insurance.

**Confidentiality.** IE reports are lender deliverables under non-disclosure and reliance letters name banks. That is why a large IE firm's US storage work can be invisible in the press while it is busy — and why absence of publicity is not evidence of absence of mandates. The public record is the client's release ("DNV as technical advisor", Zenobē 2023) or the engineer's own, when both agree to say so.

**The sequence, in months.** IE appointed about a year before close; technology, design and contract review through the middle months; draft report and validated model inputs two quarters out; conditions precedent cleared; financial close and first drawdown; monthly construction monitoring; commissioning witnessed around month eighteen; commercial operation and conversion to a term loan around month twenty; annual operating reviews thereafter.

**Self-check:** why does the lender care that the IE also sells monitoring software? *(Because the use case drifts after close — merchant markets change, operators chase new revenue — and the plant stops being the plant that was diligenced. The annual review's first question is the cycle count.)*

## Module 5 — Where it fails, and where DNV sits

**Eight failure modes.** The scope gap (the engagement letter, negotiated by a sponsor minimising fees, omits the item that later fails). The use case that drifted. Augmentation on paper only. Reliance the reader does not have. The witnessed test taken for a safety record. The contested root cause (McMicken 2019: the utility's investigator found an internal cell defect; the cell supplier's experts pointed elsewhere — forensic engineering ends in a report, not a verdict). The first-of-a-kind dressed as proven. Independence eroded by proximity — the firm that certifies the product, witnesses its test, wrote the practice the tender cites and then sits as IE has four fee relationships around one decision; each is legitimate, the accumulation is the risk, disclosure and panel rotation are the check.

**DNV's seats, with the evidence.** Practice author (RP-0043, RP-0577); independent test data (Scorecard, Rochester, Texas); certifier and witness for the OEM (Trina, Sungrow, Huawei's grid-code certificates); lender's engineer (Akaysha Orana AUD 650m, Zenobē £235m, TotalEnergies sell-side); market consultant on merchant revenue (Grenergy Elena and Central Oasis, Zelestra Aurora); owner's engineer (Abydos 2 in Egypt, 1 GW with 600 MWh, "from feasibility and design review through to construction supervision and commissioning oversight"); operating monitoring (GreenPowerMonitor, more than 100 GW under management). What the record does not show: a named US BESS or data-centre IE mandate with any company in this corpus, while DNV's own accounts record its largest energy market, North America, contracting about 12 percent in 2025.

**The competitor set.** Sargent & Lundy (ENR's No. 2 battery-storage design firm, 2026), Black & Veatch, Burns & McDonnell, Leidos, UL Solutions, TÜV Rheinland on the witness seat, SgurrEnergy. Technical-adviser league tables exist but are paywalled; no public market share for IE mandates was found.

**Self-check:** a lender's panel shows the same firm as IE on nine of its last ten battery deals. Is that a comfort or a warning? *(Both — consistency and institutional knowledge on one side, concentration and an author-examiner structure on the other. The answer is disclosure of every other relationship the firm has with the OEMs and sponsors in those deals.)*

Developed by: LightAISolutions
