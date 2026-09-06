# AES Clean Energy — Technology Lesson Plan

**Purpose:** teach **how a gigawatt of solar and storage is physically built, and why the tax code shapes the schedule more than the weather does**. Specifically: what a utility-scale solar site actually is as an assembly job — a million modules of 25-35 kg lifted, aligned and clamped to rotating torque tubes — and why automating that lift became economic only after module prices collapsed; how to read a construction robot (Maximo) as a service business sold to competing EPC contractors rather than as a gadget; what an investment tax credit is, why a developer usually cannot use one, and how tax-equity partnership flips and post-2023 transferability solve that; why "Adjusted EBITDA with Tax Attributes" can exceed Adjusted EBITDA by more than half; what the 2025 Act's beginning-of-construction, placed-in-service and FEOC rules force a developer to do, and why storage got a six-year longer runway than wind and solar; and the three ways a developer can monetise a project — own it, transfer it construction-ready, or sell the powered land and build a private-use network.

**How this plan relates to what you already have.** Every other developer plan in this library teaches financing or offtake. This one is the **construction and tax** plan. The **ENGIE** plan (same session) teaches the revenue stack inside the hour and the farmdown; the **RWE** plan (same session) teaches repowering and the interconnection-to-peaker conversion; the **Blattner** and **McCarthy** dossiers describe EPC from the contractor's side, but no plan has taught what the crews are actually doing or why a tax credit can be the same size as operating profit.

**Three ideas carry the plan.** Utility-scale solar is a repetitive lifting job whose cost stopped falling when hardware costs did, which is what makes robots worth building. A US renewables developer earns from electricity, from tax attributes and from selling development itself — three businesses with different capital intensity inside one company. And after July 2025 the binding constraint on a wind or solar project is a calendar date, not a market.

**One boundary, held throughout.** aescleanenergy.com returned HTTP 520 throughout the research pass, so every fact here comes from aes.com or SEC filings. AES publishes no consolidated US operating storage MW or MWh (summing the US storage rows in the FY2025 10-K gives approximately 2,290 MW, a computation and not an AES figure), no ISO/RTO for any asset except New York Wind, no cell chemistry for any grid-scale project, and no Fluence-specific procurement figure. There is no named AES Clean Energy chief executive — the top of the line is James Marshall, SVP and Renewables SBU President. Third-party Maximo throughput figures (over 500 installations a day, 180,000 cumulative) are not first-party and are excluded. No AES product named "Atlas" exists in any filing or on aes.com.

**Suggested pacing:** Module 1 with a tracker manufacturer's installation manual open (~30 min). Module 2 with the Maximo page and the October 2024 blog (~30 min). Module 3 with the FY2025 10-K's non-GAAP reconciliation (~40 min — this is the hardest module). Module 4 with the 10-K's policy risk factors (~30 min). Module 5 with the DEFM14A projections (~25 min). Then flashcards and self-test in the app.

## Module 1 — What a utility-scale solar site actually is

**The single idea:** a solar plant is an enormous repetitive assembly job done outdoors on uneven ground, and its cost structure is dominated by the part that has not got cheaper.

**The physical unit.** A modern PV module is roughly 2-2.5 m long and 25-35 kg. A 500 MW plant needs on the order of a million of them. Each is lifted from a pallet, carried to a row, aligned against its neighbour and clamped to a torque tube.

**Why trackers make it harder.** A single-axis tracker is a machine — bearings, dampers, motors, a torque tube that must stay straight under load. Misaligned modules put a twisting load into the tube. The payoff is 15-25% more annual energy from the same modules, which is why tracked mounting is the utility-scale standard.

**The cost crossover.** Module prices fell by roughly an order of magnitude over fifteen years. The cost of a person lifting one did not. As hardware cheapened, labour's share of a project grew — the precondition for automating the lift.

**The other constraints.** Terrain (sand, mud, ruts), consistency of clamping torque across a million fasteners, and the number of people you can safely put on a site.

**Exercise:** for a 500 MW plant, assume 550 W modules, a crew placing 60 modules per person-shift, and a 10-month construction window. Compute the crew size required. Then recompute at 90 and at 120 modules per person-shift and state what each improvement is worth in headcount.

## Module 2 — Maximo: reading a construction robot as a business

**The single idea:** the interesting thing about Maximo is not the arm, it is that AES sells it to its competitors' EPC contractors.

**The five engineering problems.** *Lifting and placing* — a high-speed robotic arm; the easy half, well-solved in factories. *Localisation* — cameras, sensors and a neural-network spatial model, because a construction site has no known geometry; this is the hard half and the reason it is called AI-enabled. *Attachment* — a lower arm auto-tightens clamps, which improves consistency, not just speed. *Mobility* — a tracked base for sandy, muddy and rutted ground, working across torque-tube heights. *Power* — a mobile microgrid with lithium-iron-phosphate batteries plus inverters and phase converters for three-phase power, because there is no grid on site. *Safety* — personnel-detection sensors halt operation.

**AES's claims.** 50% less time and 50% of the cost of standard mechanical installation. About 10 MW installed as of an October 2024 blog; 100 MW projected by end-2025; a target of up to 5 GW of AES backlog and pipeline over three years. Five units in operation at 31 December 2025, all at Bellefield, with fleet expansion expected in 2026.

**The two design choices that reveal the business.** *Technology-agnostic* across modules, clamps, rails and trackers — only necessary if you intend to work on other owners' sites. *Revenue model* — AES states results are driven by "module installation service revenue" and "profit margins on customer contracts with solar EPC companies", serving demand "from AES and other leading owners".

**Where it sits.** Maximo is in the New Energy Technologies SBU, not in AES Clean Energy. It serves AES Clean Energy projects but is a separate segment.

**Exercise:** state the conditions under which selling installation to a competitor's EPC is better for AES than keeping the machine exclusive. Then state the conditions under which it is worse.

## Module 3 — Tax attributes: why a third of the earnings measure is not electricity

**The single idea:** for a US renewables owner the tax credit is roughly the same size as operating earnings, so a change in the credit regime does not trim the business — it re-founds it.

**Two credit forms.** An investment tax credit is a one-time credit worth a percentage of capital cost; a production credit pays a fixed amount per MWh for ten years. The owner elects. Storage generally takes investment; wind historically took production.

**Why the owner usually cannot use it.** A developer spending billions has large depreciation and little taxable income. Credits accumulate unused.

**Tax equity and the flip.** A bank or insurer with a large tax bill invests, takes most tax attributes plus a slice of cash until a target return is met, then its share drops sharply — the flip. AES states "the majority of solar projects under AES Clean Energy have been financed with tax equity structures".

**Transferability.** From 2023 the IRA allowed credits to be sold outright for cash to any taxpayer. AES began monetising this way in 2023 and notes it reduces the GAAP effective tax rate. Simpler than a partnership: no flip, no partnership accounting, a sale at a discount.

**The scale, in AES's own numbers.** FY2025: Adjusted EBITDA USD 2,871m; Adjusted EBITDA with Tax Attributes USD 4,411m; the USD 1,540m gap includes USD 1,374m realised by US renewables. Inside the Renewables SBU: segment Adjusted EBITDA USD 932m against USD 2,306m with tax attributes. FY2024 comparatives USD 2,639m / USD 3,952m and, as revised, USD 612m / USD 1,905m.

**A disclosure warning.** AES stopped presenting segment-level Adjusted EBITDA with Tax Attributes in its 2026 10-Qs — the term survives in the glossary, the metric does not — so 2026 quarters cannot be compared to 2025 on that measure.

**Exercise:** for a 100 MW solar project costing USD 1.1m/MW, compute the investment tax credit at 30%. Then state what it is worth to (a) an owner with no taxable income, (b) a tax-equity partner at a 7% target return, and (c) a corporate buyer purchasing the credit at 92 cents on the dollar.

## Module 4 — The clock: what "begun construction" means after July 2025

**The single idea:** the 2025 Act replaced an open-ended credit with a race against fixed dates, and the dates differ by technology.

**Wind and solar.** Full credit if construction begins within twelve months of enactment (4 July 2025), without the 2027 placed-in-service deadline, provided the project operates within four calendar years of the year construction began. Begin later and it must be in service by end-2027.

**Storage.** No tighter timeline. Full ITC or PTC if construction begins by **2033** — about six more years of runway than wind or solar, which should show up in portfolio mix at the margin.

**What counts as beginning construction.** Physical work of a significant nature, or historically 5% of total cost. IRS Notice 2025-42 (15 August 2025) generally removed the 5% route for wind and for solar above 1.5 MW. A federal district court vacated the Notice in full on 6 June 2026; the ruling is under appeal, so positions taken under the restored rule are reversible.

**FEOC.** Projects beginning construction after 31 December 2025 lose credits if they receive material assistance from a prohibited foreign entity, with permitted Chinese-content percentages varying by year and technology. Projects beginning after 31 December 2024 are barred if such an entity owns or effectively controls them. AES notes Treasury "has not yet issued comprehensive guidance", and that further guidance "may be material".

**AES's mitigation, stated.** A programme designed to ensure the US backlog satisfies safe-harbor requirements; all 2026 and 2027 battery needs contracted "with almost all of such batteries coming from U.S. or South Korean suppliers"; all 2026 wind turbines contracted and delivered, 2027 fully contracted with US suppliers. The merger proxy's standalone case assumes safe harbour secures credits for all megawatts through 2030.

**The tariff overlay.** Section 301 on Chinese lithium-ion for storage rising 7.5% → 25% from 1 January 2026; Section 201's solar safeguard (latterly 14%) expired February 2026; Section 232 steel and aluminium at 50% from 4 June 2025; AD/CVD orders on Cambodia, Malaysia, Thailand and Vietnam issued 24 June 2025; graphite AD/CVD determinations expected Q1 2026 and "could result in price increases".

**Exercise:** you hold a 400 MW solar project at 60% permitted and a 400 MW storage project at the same stage, both un-started, on 1 January 2026. State the deadline each faces, what you must evidence and by when, and which you would start first.

## Module 5 — Three ways to monetise a project

**The single idea:** owning generation is only one of three businesses, and in 2025-26 the least capital-intensive one became a visible earnings driver.

**Develop-to-own.** Build and keep; earnings compound over 25-35 years; captures the tax attributes; consumes enormous capital. AES Clean Energy's construction budget exceeds USD 12bn and the merger proxy's standalone case shows the unit consuming cash until 2029.

**Develop-transfer agreement.** AES manages permitting, engineering and procurement and transfers the project construction-ready to a utility or corporate buyer. Fee income, almost no capital held, and it monetises the scarcest skill. US development services added USD 91m to Renewables segment operating margin in FY2025 and USD 62m in Q2 2026 alone.

**Powered land and private-use networks.** July 2025: a development framework agreement to build "a private-use network structure to support the customer's planned data center in Texas", transaction price about USD 481m over roughly two years, USD 105m recognised in 2025, USD 245m of contract liability at year-end. The customer is unnamed.

**The reporting trap.** AES Clean Energy is not a reportable segment. Four layers: The AES Corporation (consolidated), Renewables SBU (the segment, spanning ten countries), AES Clean Energy (a sub-unit), and AES Indiana / AES Ohio (Utilities SBU — their solar and storage, including a 200 MW / 800 MWh battery on a retired coal site, is *not* AES Clean Energy).

**Exercise:** from the DEFM14A projections, compare the standalone case (Adjusted EBITDA USD 661m in 2026 to USD 1,285m in 2030, levered free cash flow negative until 2029) with the acquisition case (USD 703m in 2026 to USD 1,084m in 2029, free cash flow positive from year one). State the single assumption that produces the difference and why it lowers EBITDA while raising cash.

## Where to go next

- The **ENGIE North America** plan (same session) teaches what a battery sells inside an hour and how a minority sell-down funds the next one.
- The **RWE Clean Energy** plan (same session) teaches repowering, the safe-harbour clock from a European parent's side, and iron-air long-duration storage.
- The **Fluence** dossier is the counterparty on the other side of AES's storage procurement, and its own accounts size the dependence AES does not disclose.

Developed by: LightAISolutions
