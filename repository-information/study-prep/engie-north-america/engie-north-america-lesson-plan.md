# ENGIE North America — Technology Lesson Plan

**Purpose:** teach **what a merchant battery fleet actually sells inside an hour, and where the money comes from to build the next one** — the two questions that decide whether the largest battery owner in ERCOT is a good business. Specifically: why a one-hour battery competes on equal terms with a four-hour battery for reserve products and what that design choice costs when the reserve market saturates; how ERCOT ancillary-services revenue fell about 90% while the fleet nearly doubled, and why those two facts are the same fact; what a 49.5% minority sell-down to an infrastructure fund is, what "retains a controlling share and will continue to operate and manage the assets" buys the seller, and why capital recycling has become the primary funding engine for US growth; the three commercially distinct things that all look like "selling clean power to a data centre"; and why co-locating compute at a West Texas wind farm is a generator's solution to curtailment and basis risk being sold as a buyer's solution to a queue.

**How this plan relates to what you already have.** The **Aypa** plan teaches what a buyer of a storage platform pays for; **Gridstor** teaches the storage specialist a bank built; **Spearmint** and **Jupiter** teach merchant development; **Hunt Energy Network** teaches the owner who runs its own trading desk; **esVolta** and **Strata** teach the contracted book. None of them teaches the **revenue stack inside the hour** or the **farmdown as a funding model**, and this plan is built on those two.

**Three ideas carry the plan.** Ancillary services pay for readiness measured in megawatts, not energy measured in megawatt-hours, which is why a one-hour fleet was rational in 2021 and is a liability in 2026. A minority sell-down is not a sale — it is a way of converting an operating asset into construction capital while keeping control, operations and the fee stream. And the three data-centre products a developer sells have order-of-magnitude different capital intensity, so "has a hyperscaler deal" is not one fact.

**One boundary, held throughout.** ENGIE publishes an energy figure for exactly one of its 31 named North American batteries (Sun Valley, 100 MW / 100 MWh) and names no cell, module or integrator supplier anywhere in North America. It publishes no North American EBIT — the IFRS 8 geographic note (EUR 5,807m of revenue and EUR 11,051m of industrial capital employed for FY2025) is the ceiling of regional disclosure — and its own pages disagree on employees, retail customers and US tenure. Where this plan gives a market figure it names the measurement house, and where two houses disagree (Enverus at $17/kW projected for 2025 against Modo at $43/kW for 2024-25) it carries both.

**Suggested pacing:** Module 1 with ERCOT's ancillary-services product definitions open (~35 min). Module 2 with the CBRE IM and two Ares releases side by side (~30 min). Module 3 with the QTS, Meta and Microsoft releases open together (~30 min). Module 4 with the Cipher Mining release and an ERCOT congestion map (~25 min). Module 5 with the Modo and Enverus revenue series (~20 min). Then flashcards and self-test in the app.

## Module 1 — What a battery sells, minute by minute

**The single idea:** a grid-scale battery earns from the fact that it can change output in milliseconds, and most of what it earns is for readiness rather than for energy.

**The three revenue lines.** *Energy arbitrage* — buy low, sell high, minus round-trip losses of 10-15%. *Ancillary services* — Responsive Reserve Service (RRS) pays you to hold a state of charge from which you could inject within seconds; ERCOT Contingency Reserve Service (ECRS) pays for a slightly slower version; Regulation pays you to follow a signal continuously. *Capacity* — not an ERCOT product, but the reason duration matters in PJM, ISO-NE and CAISO.

**Why readiness is priced on MW.** A 100 MW battery can sell 100 MW of reserve without discharging a megawatt-hour. Duration does not affect eligibility, only cell cost — so a one-hour system competes with a four-hour system at a quarter of the energy capital. This is the whole explanation for ERCOT's one-hour build-out.

**Why it broke.** Ancillary demand is set by the grid operator's reliability requirement and is inelastic to supply. The ERCOT fleet went 7.8 GW (start 2025) → 13.9 GW (start 2026) → 14.96 GW / 24.6 GWh (end Q1 2026). Ancillary revenues fell about 90%; their share of BESS income halved from 84% to 48%.

**What ENGIE's fleet is.** 1.8 GWh dispatchable against 1.8 GW installed (September 2024) — an approximately one-hour average. 29 of 31 published storage projects in ERCOT; two in CAISO. Modo recorded five 50+ MW two-hour units commissioned in Q3 2025 (788 MW) — the first departure.

**Exercise:** for a 100 MW battery, compute the annual revenue at 1-hour and 4-hour duration under (a) $150/kW of ancillary revenue with no arbitrage and (b) $20/kW of ancillary revenue plus a $40/MWh average daily spread. State at which duration each scenario favours.

## Module 2 — Capital recycling: funding the next asset from the last one

**The single idea:** a developer whose assets earn less each year can still grow if it sells part of what it owns to build what it does not.

**The mechanics.** CBRE Investment Management took **49.5%** of a 2.4 GW, 31-project operating BESS portfolio in ERCOT and CAISO (May 2025), in tranches of USD 291m, USD 221m and about USD 70m. Ares took 49% of 905 MW for USD 430m (March 2025) and a further 730 MW (January 2026), reaching 4.3 GW cumulatively.

**What the seller keeps, in three parts.** *Control* — consolidation, dispatch, augmentation and refinancing decisions. *Operations* — a continuing O&M contract, which is fee income surviving the sale. *Governance* — staying just under 50% is deliberate, not incidental.

**Why the fund buys.** An operating asset with a production record has no development risk left. The fund is buying proven cash flow; the developer is buying the ability to start again. Compare the structure to a tax-equity partnership flip: the same logic of allocating a risk to whoever is set up to hold it, applied to operating economics rather than tax attributes.

**The number that proves it.** North American industrial capital employed **fell** EUR 808m across FY2025 while regional revenue rose 5.1%. Group net growth capex fell in FY2025 "mainly due to project delays in the US" — ENGIE's own words.

**Exercise:** model a 1 GW portfolio at a notional USD 1.2m/MW of enterprise value. Sell 49.5%. State the cash raised, the megawatts the seller still controls, and how many megawatts of new build the proceeds fund at USD 0.9m/MW of equity. Then state what happens when you want to do it a second time.

## Module 3 — Three products that all look like "selling clean power"

**The single idea:** the capital intensity, margin and counterparty risk of a data-centre energy deal depend entirely on which of three structures it is.

**Project PPA / environmental attribute purchase agreement.** The buyer takes the output of one named plant. Meta takes 100% of Swenson Ranch (600 MW, USD 900m, operational 2027) and holds more than 1.3 GW across four Texas projects; Google takes 90 MW of Chillingham. This underwrites construction and delivers additionality — and consumes the developer's capital.

**Retail supply and hourly matching.** ENGIE Resources sells the customer their actual electricity and matches consumption hour by hour against a portfolio. Microsoft's 24x7 programme (2023), AstraZeneca's nine-year agreement to 2034, Aker BioMarine at approximately 90% hourly matching. Almost no capital; thinner margin; only viable in the 14 deregulated states ENGIE serves.

**Intermediated resale.** ENGIE holds a PPA on ABEI Energy's Lubio Solar and passes 48 MWac to QTS with supply and management bundled. Fastest to signature, lowest margin, and — the point most often missed — **adds no generation to ENGIE's fleet**.

**Exercise:** take the four named ENGIE data-centre counterparties (Meta, Google, Microsoft, QTS) and classify each. Then state which of the four, if any, caused a new power plant to exist.

## Module 4 — Co-location: whose problem is actually being solved

**The single idea:** siting load at generation fixes the generator's economics at least as much as the buyer's schedule.

**The buyer's problem.** Interconnecting a large new load takes years. A developer holding interconnection rights secured in 2020 has something that cannot now be bought.

**The generator's problems.** *Curtailment* — being told to stop producing because the grid cannot absorb output. *Basis risk* — the gap between the price at the plant's load zone and the hub price the PPA settles against, which in West Texas can be sharply negative. *Congestion* — the physical reason for both.

**ENGIE's own framing.** The Cipher Mining release (May 2025, up to 300 MW) says co-location "alleviat[es] transmission congestion, offset[s] basis risk, and mitigat[es] curtailment challenges in West Texas". Every item is the generator's.

**What is unproven.** Neither the Cipher agreement nor the Prometheus Hyperscale collaboration (September 2025, Texas I-35 corridor, liquid-cooled, Conduit supplying bridging generation) discloses contracted megawatts. No third party has verified Prometheus's construction, financing or load commitment. The group's advanced-stage data-centre pipeline moved 0.8 GW → 4 GW in six months.

**Exercise:** for a 300 MW wind farm curtailed 12% of the time with an average basis of −$8/MWh, estimate the annual revenue recovered by co-locating a 100 MW constant load. State which of the two effects dominates.

## Module 5 — Reading the numbers a European parent publishes about America

**The single idea:** when the business you care about is a region rather than a segment, you must know which disclosure exists and which does not.

**What ENGIE does not publish.** No North America EBIT, EBITDA or net income. No NA operating GW split by technology. No NA development pipeline. No MWh for 30 of 31 storage projects. No supplier for anything.

**What it does publish.** The IFRS 8 geographic note: FY2025 North America revenue EUR 5,807m (8.1% of group) and industrial capital employed EUR 11,051m (15.5%) — a capital-intensive, low-revenue-intensity region, which is the signature of an asset owner rather than a supply business. FY2024 comparatives EUR 5,525m and EUR 11,859m.

**The one US-specific operating figure.** ENGIE SA's FY2025 release: of 6.2 GW of group renewables and BESS additions, **2.4 GW was in the United States** — the largest single contributor at 39%.

**Where independent measurement fills the gap.** Modo Energy for ERCOT ownership (2,524 MW at Q3 2025; ~2.8 GW and 20% share entering 2026). S&P Global Commodity Insights for US ownership (3.662 GW at 30 June 2026, second nationally). BloombergNEF for corporate PPA sales (3.6 GW in 2025, first globally). Cleanview for pipeline — with the caution that it published three different totals for ENGIE in one research session and dates none of them.

**Exercise:** list every ENGIE storage capacity figure in circulation (3.5+ GW company; ~2.5 GW summed from project pages; 2.8 GW Modo ERCOT; 3.662 GW S&P US; 4.4 GW US including pumped hydro; 10.7 GW global operating-or-building). For each, state the definitional basis. Then state why none of them is "5.6 GW".

## Where to go next

- The **AES Clean Energy** plan (same session) teaches the construction and tax-credit side of the same industry — how a gigawatt is physically built and why a third of the earnings measure is tax credits.
- The **RWE Clean Energy** plan (same session) teaches repowering, the safe-harbour clock, and how an interconnection right converts into a gas peaker.
- The **Hunt Energy Network** plan teaches the sub-10 MW distributed resource ENGIE competes with at Sweeny.

Developed by: LightAISolutions
