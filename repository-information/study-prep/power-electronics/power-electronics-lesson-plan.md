# Power Electronics — Technology Lesson Plan

**Purpose:** teach **what the power conversion system actually does, and why the box between the battery and the grid is where a storage plant's obligations are really discharged**. Specifically: how real, reactive and apparent power divide up a machine's rating; how to read a capability curve; what separates a grid-following from a grid-forming inverter once you go past the metaphor; which of two entirely separate American rulebooks governs a given plant; why regulators spent eight years banning a behaviour they had previously required; and what a developer is buying — and giving up — when it buys conversion separately from cells.

**How this plan relates to what you already have.** The **Sinexcel** plan teaches modular versus central conversion and serviceability. The **Sungrow** plan teaches how a solar-plus-storage plant fits together. The **Delta Electronics** plan teaches switch-mode power and the component-to-system margin ladder. **This plan assumes all three and does not repeat them.** Sinexcel's covers grid-forming with the surfer-and-metronome metaphor and mentions IEEE 1547 and UL 1741 once, in a line about certification being the product. That line is correct and it conceals most of the subject. This plan opens it.

**Three ideas carry the plan.** A conversion system is rated in kVA because its limit is current, and every grid-support duty it performs is paid for out of that same current budget. The move from grid-following to grid-forming is a change of electrical identity — current source to voltage source — not a software feature. And the commercial question that decides this company's future is not technical at all: whether the conversion layer survives as an independent purchase, when four independent conversion businesses have been absorbed since 2022.

**One boundary, held throughout.** This plan stops at the DC terminals. Cell chemistry, degradation, round-trip efficiency and augmentation cost curves belong to the battery vendors' plans in this library.

**A second boundary, on the company itself.** Where the plan uses this company's datasheets it is because they are concrete and public, not because they are exemplary. Its grid-forming capability is **named in every datasheet and quantified in none** — no inertia constant, no fault-current contribution, no rate-of-change-of-frequency withstand is published anywhere. And there is **no independent ranking of conversion suppliers in existence**, so no claim about who leads this market can be checked. Both gaps are stated wherever they bear on a lesson.

**Suggested pacing:** Module 1 with a datasheet open (~35 min). Module 2 with the same datasheet and a calculator (~40 min). Module 3 alongside the Sinexcel plan for contrast (~35 min). Module 4 with IEEE 1547 and NERC PRC-029-1 summaries beside it (~45 min). Module 5 with the acquisition timeline (~30 min). Then the flashcards and self-test in the app.

## Module 1 — The power triangle, and why the nameplate is in kVA

**The single idea:** the machine's limit is current, so every duty it performs competes for the same budget.

**Three quantities.** *Real power* (P, watts) does work — it charges the battery, spins the motor, gets billed. *Reactive power* (Q, volt-amperes reactive) is the energy that sloshes in and out of magnetic fields every half-cycle; over a full cycle it transfers nothing, does no work, and is nonetheless what holds network voltage up. *Apparent power* (S, volt-amperes) combines them at right angles: S² = P² + Q².

**Why the rating is S.** The semiconductors, busbars and transformer carry current, and current is set by S. A machine pushing large reactive power carries current that does nothing useful, and the hardware must survive it all the same. So a nameplate in kVA is a statement about survivable current, not about deliverable work.

**Power factor** is P/S — the cosine of the triangle's angle. This company publishes **0.5 leading to 0.5 lagging, four-quadrant**. Leading absorbs reactive power and pulls voltage down; lagging supplies it and props voltage up. At 0.5, half the machine is doing voltage support and half is left for energy.

**Four quadrants** means real power in either direction *and* reactive power in either direction, independently. A storage conversion system that can do all four is simultaneously a controllable load, a controllable generator and a STATCOM. Utilities increasingly buy the third capability as deliberately as the first two.

**The sentence that makes it concrete.** This company's solar inverter datasheets carry **"reactive power injection at night"**. With no sun, P is zero and the whole 5,260 kVA is available as Q. The plant earns nothing from energy and still holds up local voltage — grid support from hardware that would otherwise sit idle. This is why a grid operator cares which inverter you bought even when your plant is generating nothing.

**Exercise:** a 5,000 kVA inverter is commanded to 0.5 lagging. How much real power remains? Then: the grid operator asks for 3,000 kvar of voltage support from a 5,360 kVA machine. How much real power can the plant still sell, and what has the reactive request cost in megawatts?

## Module 2 — Reading a capability curve and a derating table

**The single idea:** a datasheet is a set of conditional promises, and the conditions are where the engineering lives.

**The curve.** Plot P against Q and the boundary is a circle of radius S. Any command must land inside it. That is the whole picture, and everything below is a qualification of the radius.

**Derating.** This company's 690 V unit is rated **5,240 / 5,020 / 4,800 / 4,360 kVA at 30 / 35 / 40 / 50 °C**. Semiconductors have a maximum junction temperature; hotter air means less headroom. The same box is a materially smaller machine in Phoenix in August than in Valencia in March, and a plant sized on the 30 °C figure and built somewhere hot has quietly bought less capacity than it thinks. Altitude derates too — thinner air cools worse — which is why the DC/DC datasheet reads "4,000 m, derating above 2,000 m".

**The overload ladder.** **166% for 100 ms · 150% for 5 s · 120% for 8 s · 110% for 15 s.** A tiered permission to exceed the rating, shaped by thermal mass: the shorter the excursion, the more the junction can absorb before it cooks. Remember this ladder — Module 3 shows that it is the same fact as grid-forming, and Module 4 shows it is the same fact as ride-through compliance.

**Two efficiency numbers.** **98.94% maximum against 98.51% CEC weighted.** The weighted figure averages across a realistic load profile and is always lower, because efficiency sags at part load. Compare weighted with weighted; a vendor quoting its peak against a rival's weighted number is not comparing anything.

**Short-circuit withstand, and why it is asymmetric.** The DC/DC converter datasheet rates **500 kA at 1 ms on the storage side against 3 kA on the photovoltaic side**. That asymmetry is the physical reason a battery and an array cannot simply share a DC bus: a large battery is an enormous, very low-impedance source with no inertia to slow a fault, while an array is current-limited by physics. Mediating between the two is precisely what the converter is for.

**Distortion.** **THDi below 3% per IEEE 519.** Switching devices build a sine wave out of steps, and the steps are the distortion. Harmonics heat transformers and trip protection elsewhere on the network, so a distortion limit is a condition of the interconnection agreement rather than a refinement. A **three-level** topology — output sitting at three voltage steps rather than two — is how you get closer to a sine before filtering, which is how 98.94% is reachable at all.

**Exercise:** take the 5,020 kVA figure at 35 °C. The plant is in a location that hits 45 °C in summer. Interpolate the available rating, then state what fraction of the nameplate the developer actually bought. Then: at 166% for 100 ms, how many amps can the 690 V machine deliver into a fault, and why does that number decide whether it can be certified grid-forming?

## Module 3 — Following and forming: a change of electrical identity

**The single idea:** the difference is current source versus voltage source, and it decides where a plant can be built at all.

**A following inverter** carries a phase-locked loop that watches the grid voltage and continuously estimates its frequency and phase. The machine then injects current synchronised to that estimate. It is a **current source**: you command amps, it delivers amps, and the grid's voltage is something it measures rather than something it makes.

**Why that fails in a weak grid.** The loop needs a firm voltage to lock onto, and firmness is measured as the short-circuit ratio — the network's fault capacity at that point divided by the plant's rating. Where conventional generation has retired and inverters have proliferated, the ratio falls, estimates degrade, and inverters begin interacting with one another's control loops in ways that destabilise all of them. No amount of following fixes a location with nothing to follow.

**A forming inverter** imposes a voltage waveform of its own chosen magnitude, frequency and phase and lets current be whatever the network draws. That is what a spinning synchronous machine does, which is why the control mode is called a virtual synchronous generator — VISMA in this company's naming.

**What forming buys.** Synthetic inertia, so the plant opposes the rate of change of frequency in the seconds after a large unit trips rather than watching it. Black start, so it can energise a dead network with nothing else running. Islanded operation for a microgrid. And permission to connect where a following inverter would be refused.

**What forming costs, and the connection worth making.** A voltage source must supply whatever current the network demands during a disturbance. That is a claim on the overload ladder from Module 2, not on new hardware. **The 166%-for-100-milliseconds line and the grid-forming claim are the same engineering fact seen twice**: a machine that cannot briefly exceed its rating will hit its current limit mid-fault and revert to behaving like a current source at exactly the moment forming mattered.

**The commercial layer.** This company lists grid forming and black start as **Standard** on the Multi PCSK, HEM and HEMK datasheets rather than as a priced option. As grid codes move from permitting forming to requiring it, standard-fit is a stronger position than an upsell. **The caveat is real and should be stated in any customer conversation:** the capability is named in every datasheet and quantified in none. Ask for the inertia constant, the fault-current contribution and the RoCoF withstand, and treat their absence as an open question rather than a defect.

**Exercise:** a developer has two candidate sites, one with a short-circuit ratio of 8 and one with a ratio of 1.5. Which needs grid-forming, and what would you ask the vendor to prove before signing? Then: explain why "grid-forming is a software licence" is both commonly said and misleading.

## Module 4 — The two rulebooks

**The single idea:** the United States has two separate, non-interchangeable regimes for inverter-based resources, and which applies depends on where you connect.

**First, a distinction that trips everyone.** IEEE 1547 is a *requirement* — what a resource must do. UL 1741 is a *test and listing* — proof that a given product does it. They are not alternatives.

**Distribution.** **IEEE 1547-2018** governs. State rules adopt it: California Rule 21, Hawaii Rule 14H. Resources are sorted into **Categories A and B** for reactive capability, and **Categories I, II and III** for how far and how long they must ride through disturbances, higher numbers subsuming lower. Compliance is demonstrated by a **UL 1741** listing: **Supplement SA** certifies to Rule 21's first phase using test methods UL defined itself; **Supplement SB** certifies to IEEE 1547-2018 using the **IEEE 1547.1-2020** conformance procedures. The move from SA to SB is the laboratory ceasing to invent tests and running the ones the requirement specifies.

**Transmission.** **IEEE 2800-2022** governs, and is voluntary as an IEEE document. It gets its teeth from **NERC PRC-029-1**, which made ride-through mandatory and enforceable, adopted in response to **FERC Order 901**. Obligations are framed as **must-ride-through zones** in voltage and duration, with momentary cessation prohibited inside them. There is no listing mark to buy; compliance runs through the interconnection study, model validation and performance testing.

**What this company certifies to.** Its datasheets list **UL 1741 SA and SB, IEEE 1547.1**, and on the medium-voltage units **Rule 21 and Rule 14H** explicitly. It claims no transmission listing, because none exists to claim — that is normal and is not a gap. Outside the United States the same machine carries IEC 62109-1/-2 for safety and IEC 62116, G99, VDE 4110/4120/4130, CEI 0-16, NTS 2.1 and EN 50549 for interconnection, plus Terna Annex A79 in Italy.

**Why certification is the moat.** Every approval is a separate laboratory campaign with a queue measured in months. A vendor's certification portfolio is years of accumulated work a new entrant cannot buy, which is why grid codes rather than product roadmaps set the pace in this industry.

**Ride-through, and the reversal.** Early rules were written when distributed generation was rare and the worry was anti-islanding — a small generator energising a line a crew believed dead. Under that logic, disconnecting fast was correct, and **momentary cessation** — stopping injection for the duration of a disturbance while staying nominally connected — was the polite version of it. Once inverter-based resources became a large share of generation, the arithmetic inverted: a fault making a large fraction of them cease simultaneously looked to the system like losing an enormous power station at the worst moment, and could turn a survivable fault into a cascade. The safe behaviour and the compliant behaviour had come apart. IEEE 1547-2018 replaced must-trip with graded ride-through; PRC-029-1 banned momentary cessation inside must-ride-through zones; PRC-030-1 requires resources to record unexplained losses of output so the next event can be diagnosed.

**The practical consequence.** Riding through means continuing to inject into a fault — another draw on the overload ladder. It also means equipment certified against the older posture is not merely less capable; it is certified to do the wrong thing. When someone says a plant is compliant, the useful question is always *compliant with which vintage*.

**Exercise:** a 250 MW battery connects at 230 kV. Name the governing standard, the enforceable instrument and the party that checks. Then explain why a UL 1741 SB listing, on its own, does not discharge that plant's obligations.

## Module 5 — Buying conversion separately from cells

**The single idea:** the technical question in this dossier is settled and the commercial one is not — whether the conversion layer survives as an independent purchase at all.

**What this company is.** It makes no cells and sells no turnkey battery system. It sells conversion — inverters, DC/DC converters, medium-voltage skids, plant controllers — plus the service estate around them. That is why Wood Mackenzie's storage integrator ranking cannot contain it: the ranking's published scope is factory-assembled AC-integrated systems bundling battery, conversion, management and controls, so a conversion-only vendor is out of scope by definition rather than by performance.

**The case for unbundling.** Equipment-only procurement is routinely reported 15–25% below turnkey. Nine or ten selectable DC voltage windows mean chemistry independence — match whichever cells you buy this year and different ones next. A bidirectional DC/DC converter allows **augmentation without oversizing**: voltage-balance new strings against degraded ones and add capacity in phases across a twenty-year life instead of buying it all on day one and leaving it idle. AC-coupled, DC-coupled and hybrid become a design choice rather than a vendor constraint. And service continuity becomes a purchasable term — this company publishes a twenty-five-year spare-parts guarantee, a dedicated factory building parts for discontinued generations, and a service network stated across 49 US states.

**The case against.** The industry's own figure is that conversion is **roughly 15% of a battery project's cost and a disproportionate share of its commissioning and operating problems**. Unbundling moves that share of the trouble to you. Worse, nobody wraps the performance guarantee: the cell vendor blames the conversion vendor and vice versa, and the availability guarantee the lender wanted has no single signatory.

**The market has been voting.** Four independent conversion businesses absorbed since 2022 — **EKS Energy into Hitachi Energy** (2023), **Dynapower into Sensata** (2022), **Gamesa Electric into ABB** (2025), and **EPC Power into Flex for $4.4bn** (September 2026). The acquirers' stated rationale is consistent: own the service strategy on the part that causes the trouble. Meanwhile the **AC block** — a factory-assembled unit bundling conversion in with the battery — removes the separate purchase decision altogether.

**Why the EPC Power price matters to this conversation.** EPC Power is a US-domiciled conversion pure-play at roughly $800m of 2026 revenue with 27 GW of South Carolina capacity — single-product revenue about two thirds of this company's *entire group* revenue across solar, storage, EV charging and drives, and American capacity in a market that has just made manufacturing location decisive.

**Which brings the plan to its real ending.** On 28 July 2026 the FCC added all foreign-produced grid inverters and conversion systems with remote-communication capability to its Covered List, barring new authorisation, import, marketing and sale. The test is the Buy American domestic-end-product standard — **where the hardware is assembled, not who owns the brand** — so Spanish-built equipment is covered exactly as Chinese-built equipment is. The one durable remedy is US manufacturing, and this company's Houston plant was announced in September 2023 at $300m across 45 acres with 20 GW of capacity, then reported in November 2025 as switching from building to renting, and in March 2026 as about 20,000 m² with the investment postponed. Everything technical in Modules 1 to 4 is real and well-engineered. Whether it can be sold in its largest market turns on a factory.

**Exercise:** you are a developer choosing between a turnkey AC block and split procurement with this company's conversion layer. List the three questions whose answers would decide it, and say which of the three you could not answer from public information today.

## Where to go next

- **Sinexcel's plan** for modular versus central architecture from the smaller end of the same business.
- **Sungrow's plan** for the integrator's view — the company that appears beside this one in the only independent US ranking, and that sells the turnkey product this one does not.
- **Delta Electronics' plan** for the component-to-system margin ladder, which is the same strategic climb this company is attempting from conversion into data-centre power with AIPCS.
- **Flex's dossier** for what a $4.4bn acquisition of a conversion pure-play looks like from the acquirer's side.

Developed by: LightAISolutions
