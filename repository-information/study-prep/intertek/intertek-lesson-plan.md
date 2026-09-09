# Intertek — Technology Lesson Plan

**Purpose:** teach **assurance as a sampling and measurement problem** — why you can never inspect everything, how a defensible sample size is chosen, and what makes a number admissible to someone who was not there; how a cargo's quantity and quality are physically determined at the point where money changes hands; what a factory audit and inline production monitoring actually look for in a battery plant, and why that catches things no laboratory certificate can; the difference between the number-one and number-two electrical marks in practice rather than in law; and how a testing group's economics and ownership shape what it will and will not invest in. Intertek is the worked example because it does all of this — commodity inspection, consumer testing, electrical certification and battery-factory surveillance — and because it is being taken private in the middle of splitting itself in two.

**How this plan relates to what you already have.** The **CSA Group plan** taught the institutional map of standards, codes and marks. The **UL Solutions plan** (same session) taught the laboratory bench — what a safety test physically does. This plan teaches the third leg neither covers: **inspection**, which is what you do when the thing you must judge is a shipload, a factory or a construction site rather than a sample on a bench. The **DNV** and **Sargent & Lundy** plans teach the independent and owner's engineer; Module 5 here shows Intertek CEA doing that job under a different name. Do CSA first; UL and this one are interchangeable in order.

**Three ideas carry the plan.** You cannot test everything, so every assurance product is a bet about how much sampling is enough — and the sample size is a *risk* decision, not a technical one. A measurement only moves money if its chain of custody survives challenge, which is why independence is a technical property and not a marketing one. And the deepest defect data in this industry comes not from laboratories but from people standing on production lines, because a certificate describes a design and a production line reveals what is actually being built.

**One boundary, held throughout.** `intertek.com` refused every request from the research environment, six attempts across two user agents and two tools, and so did `osha.gov`. Everything here comes from regulatory filings, the company's exchange announcements, the US Federal Register and `intertekcea.com`, which is Intertek-owned and open. There is no company-published photograph of any executive in the dossier, and no verified count of the company's recognised laboratory sites.

**Suggested pacing:** Module 1 (~35 min) — the reasoning module; everything else applies it. Module 2 (~35 min). Module 3 (~25 min). Module 4 (~30 min). Module 5 (~40 min), the one this corpus needs most. Module 6 (~25 min). Then flashcards and self-test in the app.

## Module 1 — You cannot inspect everything

**The single idea:** a sample size is a statement about how much risk the buyer will accept, dressed up as a procedure.

**The problem.** A shipment contains 40,000 modules. Inspecting all of them costs more than the defects would. Inspecting one tells you almost nothing. Between those extremes sits **acceptance sampling**: draw *n* units, count defects, accept the lot if the count is at or below a threshold, reject otherwise.

**What the threshold actually encodes.** Two errors are possible and they trade against each other. You can reject a good lot (the producer's risk) or accept a bad one (the consumer's risk). A sampling plan fixes an **acceptable quality level** — the defect rate at which lots should usually pass — and the sample size and threshold follow from it. Change the tolerable defect rate and the sample size changes; nothing else in the procedure is negotiable. **So when two inspection quotes differ in price, they usually differ in risk, not in diligence.**

**Why bigger lots do not need proportionally bigger samples.** The counter-intuitive result underneath every published sampling table: the confidence a sample gives you depends far more on the *sample* size than on the *lot* size. Doubling the lot barely changes the required sample. This is why inspecting a 40,000-module shipment is affordable at all.

**Chain of custody.** A number is only worth what it can survive. If a sample can be swapped, mislabelled or taken unwitnessed, the measurement is unusable however precise the instrument. Chain of custody is the documented, unbroken record of who held the sample, when, and under what seal — and it is the reason independent inspection exists as an industry rather than as a line item inside the buyer or the seller.

**Independence as a technical property.** The reason a buyer will not accept the seller's own measurement is not that the seller is dishonest; it is that the measurement cannot be *checked*. Third-party inspection converts a contested number into a referable one. That is what is being bought.

**Self-check:** a supplier offers to halve inspection cost by halving the sample size. What has changed? *(The consumer's risk has risen — the probability of accepting a lot with an unacceptable defect rate. Nothing about the product or the inspector's competence has changed.)*

## Module 2 — Measuring a cargo: where the number becomes money

**The single idea:** at the flange, quantity and quality are two separate measurements, both contestable, and the contract says whose number wins.

**Why this exists.** When a tanker discharges, buyer and seller need an agreed answer to "how much, and how good". Payment is calculated from it. Both parties have an incentive to prefer a different answer, so a third party measures.

**Quantity, by displacement.** A **draft survey** determines a vessel's cargo weight by measuring how deep it sits before and after loading. You read the draught marks at six points, correct for trim, list, water density and the vessel's own hydrostatic tables, compute displacement each time, and subtract — after deducting everything aboard that is not cargo: fuel, ballast, fresh water, stores. The precision comes not from the instrument but from the corrections.

**Quantity, by geometry.** For liquids in tanks, **tank calibration** does the equivalent: a certified table converts a measured liquid depth into a volume for that specific tank, then temperature corrections convert observed volume to a standard temperature, because oil expands measurably in the sun.

**Quality, by assay.** Separate measurements on a sampled portion, each mapping to a contract term:
- **Calorific value** — energy per unit mass, which is what a coal or gas buyer is actually purchasing.
- **Flash point** — the lowest temperature at which vapour above a liquid will ignite; a safety and classification property that determines how a cargo may be carried.
- **Octane rating** — resistance to pre-ignition in a spark engine, measured against reference fuels in a standardised variable-compression engine.
- **Moisture and ash** — non-product mass the buyer would otherwise pay for.

**The general shape.** Every one of these is a *comparison against a defined reference under defined conditions*. That is what makes them arguable in a contract and reproducible in a dispute, and it is the same logical structure as the electrical bench in the UL Solutions plan.

**Self-check:** why is a cargo's temperature recorded alongside its volume? *(Because volume is temperature-dependent; without correcting to a standard temperature, the same cargo measures differently in the morning and the afternoon.)*

## Module 3 — Consumer-goods testing: chemistry as supply-chain insurance

**The single idea:** a retailer does not buy testing to learn about the product; it buys testing to bound a liability.

**What is measured.** Restricted-substance testing looks for specific chemicals against specific limits: heavy metals in surface coatings, plasticisers in flexible plastics, dyes that can break down into regulated aromatic amines, formaldehyde in textile finishes. Each limit is set by a regulation somewhere, and the test is a defined extraction followed by an instrumental measurement.

**Migration, not content.** The subtlety that catches people out. For many consumer products the regulated quantity is not how much of a substance the material *contains* but how much *migrates out* under defined conditions — a simulated saliva, sweat or food contact for a set time at a set temperature. A material can be over the content threshold and pass, or under it and fail, depending on how tightly the substance is bound.

**Physical and mechanical safety.** The other half: small-parts testing against a defined cylinder for choking, sharp-edge and sharp-point tests, tension and torque tests that mimic a child pulling, flammability of fabrics.

**Why the retailer is the buyer.** The manufacturer makes the product but the retailer carries the brand and, in most regimes, meaningful legal exposure for what it sells. So the testing programme is usually specified by the retailer, paid for by the supplier and used as evidence of due diligence. This is why the biggest consumer-testing businesses are cyclical with retail volumes rather than with manufacturing volumes.

**Self-check:** a factory's material certificate shows a phthalate content above a regulatory limit, yet the finished product passes. Contradiction? *(No — if the limit that applies is a migration limit, the bound substance may not migrate at a measurable rate. Two different quantities.)*

## Module 4 — The number-two mark, in law and in practice

**The single idea:** two marks can be legally equivalent and commercially unequal, and knowing which gap you are looking at is the whole skill.

**What recognition confers.** In the United States, a laboratory is recognised by the regulator to certify products against specific safety standards, at specific sites. Recognition is **not** a delegation of government authority — the regulator says so in its own notices. What it does is let an employer rely on a product bearing that laboratory's mark to satisfy a workplace requirement that the product be tested and certified.

**Therefore the marks are equivalent in law.** A product certified by any recognised laboratory satisfies the same requirement. There is no legal preference between them.

**And unequal in practice.** Independent compliance literature reports the number-two mark at 25 to 50 per cent below the leader's pricing, at up to half the turnaround, and records that manufacturers move between them for identical products as price and schedule change. What the leader's mark buys is recognition speed: the inspector, the insurer and the retail buyer who recognise one label without hesitation. **That premium is a habit, not a rule** — and habits are measurable in nobody's published data, which is why every share figure in circulation for these marks comes from a consultancy with an interest in the answer.

**Recognition is granular, and it is dated.** This is the trap. Recognition attaches standard by standard, and a laboratory may hold it for one battery standard and not another. Intertek applied in February 2021 to add the grid-scale energy-storage system standard to its recognised scope and was granted it in **August 2025** — four and a half years, with an on-site review at its battery laboratory in between that found nonconformances the company then addressed. Before that grant it could and did issue its own mark against that standard, but not as a *recognised* certification. Two parties complained to the regulator about exactly that; the regulator established that the certifications had never claimed recognition, found no misrepresentation, and closed the matter.

**And one standard can never be in scope at all.** The thermal-runaway propagation *test method* is a method, not a certification standard, so no laboratory holds recognition for it. Anyone claiming recognised status for running it has misread the system.

**Self-check:** "Our containers are certified by a recognised laboratory to the energy-storage standard." What should you ask? *(Since when — recognition is dated and granular — and whether the certificate says so, since a laboratory can issue its own mark against a standard that is outside its recognised scope.)*

## Module 5 — Standing on the production line

**The single idea:** a certificate describes a design; only surveillance reveals what is being built this week.

**The gap.** Certification samples a representative unit, once. A gigawatt-hour order is manufactured over months, across shifts, with material substitutions, tooling wear and staff turnover. Nothing in the certificate speaks to any of that. The buyer's exposure is in the gap.

**What a factory audit actually examines.** Not the product — the *system that makes* the product. Quality policy and whether anyone follows it; facility certifications; research and development capability; laboratory management and whether the factory's own measurements are traceable; incoming raw-material control; process control at each station; and logistics. Intertek CEA runs this as a checklist of more than four hundred points for a battery-storage factory.

**Inline production process monitoring.** The step beyond an audit: an inspector present while the line runs, working through a couple of hundred inspection points, reporting weekly with findings ranked by severity, at a cadence the buyer chooses and can push to continuous. An audit is a photograph; monitoring is a film.

**Factory acceptance testing, and witnessing it.** Before shipment the manufacturer runs the system through functional and performance tests. **Witnessing** means a third party watches, verifies the procedure was followed and the instruments were calibrated, and records the result. Thermal imaging appears here for a specific reason: a poor electrical connection is invisible and cool until it carries current, and a thermal camera under load finds it when a visual inspection cannot.

**Then the boring, decisive steps.** Pre-shipment inspection on a statistically selected sample. Container loading monitoring, which records every container, seal and pallet number with photographs — unglamorous, and the thing that makes a later dispute resolvable. Then shipment tracking through customs to site.

**Why this produces better data than any laboratory.** Because it is a census of real production rather than a sample of a design. Intertek CEA's 2026 survey of the units it inspected found **more than one in eight carried a safety-critical issue** in the battery management system, thermal management or water ingress. Read that carefully: it is not a market defect rate, because the population is projects whose buyers cared enough to commission an inspection. It is a statement about what surveillance finds when it looks.

**Whose engineer is this?** The laboratory is engaged by the seller; the surveillance is engaged by the buyer. That is a different seat entirely — technical and acquisition due diligence, design review, installation audit, performance forensics — and it is the independent engineer's job under another name, even where the contractual title is not used.

**Self-check:** a supplier offers a full certification package and objects to production monitoring as duplicative. Is it? *(No. The certificate is about the design; monitoring is about the units you will receive. They answer different questions, and only one of them is about your shipment.)*

## Module 6 — Reading the company: margin, mix and who owns it

**The single idea:** in a business whose only asset is trust, the ownership question is a technical question.

**Reading the growth line.** Testing groups report **like-for-like growth at constant currency** — stripping out acquisitions, disposals and exchange-rate movement to isolate what the existing business did. It is the honest number and it is always the smallest one quoted. Intertek's FY2025: revenue up 1.1 per cent as reported, 4.3 per cent at constant currency, 3.9 per cent like-for-like. Three figures, one year, all true.

**Where margin comes from.** Not from all divisions equally. Intertek's consumer-products division earns about a 30 per cent operating margin; its energy division earns about 9 per cent and falling. Group margin is a weighted average of very different businesses, which is why a group figure tells you almost nothing about any part of it — and why a company reporting one number can be worth more as two.

**The break-up arithmetic.** Intertek's own proposal in April 2026 split it into a testing-and-assurance half at £1,844m revenue and a 25.0 per cent margin, and an energy-and-infrastructure half at £1,587m and 10.0 per cent. Roughly equal revenue, wildly unequal profit. **That gap is simultaneously the case for the demerger and the case for the buyout** — and the private-equity buyer has said it intends to revisit the split about a year after completing.

**What a scheme of arrangement is.** The UK mechanism for taking a listed company private. Shareholders vote; a court then sanctions the arrangement; only then does it bind everyone including those who voted against. It has a fixed shape — a court meeting, a general meeting, a sanction hearing, then suspension and delisting on a published day-count — and it is conditional on regulatory clearances that can take longer than the court.

**How to read a premium.** Intertek's offer was struck at a 59 per cent premium to the undisturbed price, which sounds decisive until you learn the undisturbed price had fallen about 18 per cent five weeks earlier on cut guidance. Three independent checks say the price was fair rather than generous: it equalled the most bullish published analyst target exactly, beat the four-bank average sum-of-the-parts by about 3.5 per cent, and priced the company about two turns of EBITDA below its sector's ten-year average. **Premium-to-undisturbed and premium-to-value are different measurements**, and only one of them is about worth.

**And the governance signal that inverts the usual story.** Shareholders holding close to 10 per cent publicly pressed the board to *engage with* the bidder rather than to hold out for more — attacking the break-up plan as a defence announced two working days after the first approach. No public shareholder said the price was too low. No rival bidder appeared.

**Self-check:** why might a certification business be worth more to a private owner than to the public market? *(Because the value is in recurring surveillance revenue and a slow-moving reputation, both of which reward patience, while the public market was discounting the group for holding two businesses with a fifteen-point margin gap.)*

Developed by: LightAISolutions
