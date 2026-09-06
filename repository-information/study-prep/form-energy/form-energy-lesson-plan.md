# Form Energy — Technology Lesson Plan

**Purpose:** teach **what it takes to manufacture and sell a battery that is deliberately bad at almost everything a lithium battery is good at**. Specifically: the four physical loss mechanisms inside an iron-air cell and why efficiency is intrinsic rather than fixable; how you actually build one at scale and why the factory sits on a steel site; why cost per kilowatt-hour and cost per kilowatt give opposite answers about the same system; and what a regulated utility is really buying when it procures a hundred hours of duration — which is not arbitrage.

**How this plan relates to what you already have.** The **RWE** plan already teaches iron-air at the level a portfolio owner needs: reversible rusting, cheap and abundant materials, bulky and slow, multi-day rather than daily, and the 50 MW-beside-1,500 MW hedge at Planet Rock. **This plan assumes all of that and does not repeat it.** It goes three places RWE's does not: inside the cell's electrochemistry, inside the factory, and inside the rate case. The **Crusoe** and **Google** dossiers give the buyer's view; the **Xcel Energy** dossier gives the utility's.

**Three ideas carry the plan.** Iron-air's weaknesses are physical consequences of using iron and air, not engineering debt to be paid down. The binding constraint on this company is manufacturing throughput, not chemistry. And because no merchant market prices a hundred hours, the product is sold into regulatory proceedings — which makes commission calendars, not sales cycles, the growth rate.

**One boundary, held throughout.** **Google is a customer, not an investor.** It agreed to pay a reported $1bn for the 300 MW / 30 GWh Pine Island system, routed through an Xcel Energy tariff. No Alphabet, GV or CapitalG entity appears in any funding round from Series A to the August 2026 Series G, on Form's investor wall, or in the investor list Form filed to ISO New England. Several outlets nonetheless describe Form as "Google-backed" and one headline reads "Google Invests $1 Billion in Form Energy". Both are loose language for an offtake. Second boundary: **formenergy.com serves an empty stub to automated fetches**, so every first-party page behind this plan was read from dated Wayback captures of the canonical URLs.

**Suggested pacing:** Module 1 with an electrochemistry primer open (~40 min). Module 2 with the ISO New England deck (~30 min). Module 3 with a lithium cost curve beside it (~30 min). Module 4 with the Minnesota PUC docket (~35 min). Module 5 with the project ledger (~20 min). Then flashcards and self-test in the app.

## Module 1 — Inside the cell: four ways to lose half your energy

**The single idea:** the low efficiency is a physical consequence of the chemistry, not a defect anyone can engineer away.

**The reaction.** Discharging, the cell breathes in oxygen and converts iron to rust. Charging, current converts rust back to iron and the cell breathes out oxygen. Water-based alkaline electrolyte, iron and air electrodes.

**Loss one — the hydrogen evolution reaction.** In an alkaline aqueous electrolyte the iron electrode has a competitor: some charging current splits water into hydrogen rather than reducing iron oxide. That current stores nothing. It is the dominant loss, drives coulombic efficiency to roughly 45–60% in prototypes, and is intrinsic to alkaline iron electrodes.

**Loss two — the bifunctional air electrode.** The positive electrode must reduce oxygen on discharge and evolve it on charge, on the same surface. Both reactions are kinetically poor, so there is a voltage penalty each way, and repeated oxygen evolution degrades the electrode.

**Loss three — passivation.** Discharging grows hydroxide and oxide layers on the iron's own surface, impeding electron transfer and raising internal resistance. It thickens with cycling.

**Loss four — carbonation.** A cell that breathes ambient air also inhales carbon dioxide, which forms carbonates in the alkaline electrolyte and degrades it. A sealed lithium cell has no equivalent failure mode.

**Plus self-discharge** of roughly 1–3% a day — material for an asset whose purpose is holding energy for days.

**Where the independent evidence sits.** A 2026 review in *Advanced Sustainable Systems* frames iron-anode redox kinetics as the unsolved problem. Fraunhofer UMSICHT and Holland High Tech run public programmes whose stated purpose is improving iron-air efficiency. Independent estimates of round-trip efficiency cluster at 35–50%, best point estimate about 40%, against 85–90% for lithium-ion. **Form publishes no efficiency figure anywhere** — not on its site, and not in the thirty-slide deck it filed to a grid operator, which does carry costs, footprints, cell dimensions, cycle counts and certifications.

**Exercise:** a 30 GWh system charges on surplus renewable energy at an assumed $5/MWh and discharges at $80/MWh. Compute the gross spread per delivered MWh at 40% round-trip efficiency and at 90%. Then state how many cycles a year each would need to cover $2,000/kW of capital at a 7% cost of money — and why the answer explains the business model rather than condemning it.

## Module 2 — Making one

**The single idea:** a chemistry becomes a product only when someone can make it by the million, and that is where this company's real risk sits.

**The site.** 55 acres of the former Weirton Steel tin mill in West Virginia. About 550,000 square feet today, targeted at roughly 850,000 by 2028.

**What Form actually makes.** The iron anodes and the discharge air cathodes, in house — the two components carrying the intellectual property. Everything else is deliberately ordinary: an alkaline water-based electrolyte the company compares to an AA battery's, and enclosures the size of a shipping container.

**The unit hierarchy, and why it matters.** Cell ≈ 0.15 kW / 15 kWh — divide and you get 100 hours, so duration is built into the cell and not configured at the site. 30 cells → a module ≈ 4.5 kW / 450 kWh. 10 modules → an enclosure ≈ 45 kW / 4,500 kWh. Four enclosures plus inverter and auxiliary skid → a 2.5 MW power block, in ~200-foot runs at about 2 MW per acre.

**Why a steel site.** The input is iron and **ArcelorMittal is both the Series D lead investor and a non-exclusive iron supplier** — backer and raw material are the same company. A former mill brings heavy power, rail and structure. And West Virginia put up a **$290m incentive package** against **$760m** of investment, $75m committed and $215m to be secured, collateralised by state ownership of the land and buildings.

**The governing number.** At least **500 MW a year by 2028** — about **50 GWh** at 100-hour duration — plus a DOE-cofunded line at up to 20 GWh a year by 2027. Against a stated backlog of about 80 GWh, that is roughly 1.6 years of eventual full-rate output, and full rate is 2028.

**Read the slippage honestly.** Production was described to a grid operator as starting "late 2024"; first grid delivery was October 2025. The 2028 floor-area target fell from more than one million square feet to about 850,000. Headcount has been roughly flat at about 1,000 for two years while the stated backlog quadrupled.

**Exercise:** at 45 kW / 4,500 kWh per enclosure, how many enclosures does the 300 MW / 30 GWh Pine Island system need? At about 2 MW per acre, how many acres? Then, at 500 MW a year of nameplate, how long does that one project occupy the entire factory?

## Module 3 — The denominator problem

**The single idea:** the same system looks cheap or expensive depending on which unit you divide by, and the industry sells on one while getting paid on the other.

**The comparison, from Form's own deck.** Iron-air at 100 h: about $20/kWh and about $2,000/kW. Four-hour lithium: about $250/kWh and about $1,000/kW. Twelve-hour flow: about $150/kWh and $2,000/kW.

**Why the two diverge.** Duration is energy divided by power. Buying a hundred hours of iron and air is cheap per kilowatt-hour precisely because the active materials cost about $6/kWh against $50–80 for lithium. But to deliver one megawatt you must build a hundred hours of hardware behind it, so cost per kilowatt goes the other way.

**The sharpest published criticism attacks the $/kW.** Capacity markets pay for kilowatts. At $2,000–3,333/kW, iron-air is dearer per kilowatt than a gas peaker and roughly double four-hour lithium; one analysis computes about sixteen years of record capacity revenue to return capital before financing and operations.

**Form's answer** is that it is not selling into a capacity market: it is selling a rate-based reliability asset and, since 2026, a data-centre firming product. Whether that market exists at scale is the open question, not a settled one.

**Footprint has the same trap.** About 2 MW per acre is worse than lithium's 5–10 MW per acre — but at 100 hours that acre holds about 200 MWh against 20–40 MWh. Worse per megawatt, better per megawatt-hour. A bare "footprint" claim is uninterpretable without the denominator.

**Exercise:** using Form's own figures, compute total system cost for (a) 100 MW / 10 GWh of iron-air and (b) 100 MW / 400 MWh of four-hour lithium. Then compute the cost of buying enough lithium to deliver 10 GWh at 100 hours, and state in one sentence why nobody does that.

## Module 4 — What a utility is buying

**The single idea:** with no merchant market for 100 hours, the product is sold into a regulatory proceeding — and that changes both the buyer's question and the seller's growth rate.

**What the utility is buying.** Accredited capacity and avoided cost. A regulated utility must show its commission it can meet peak plus a reserve margin, and **ELCC** decides how much of a resource counts. A four-hour battery is credited well below nameplate because at hour five it is empty; a hundred-hour resource is credited very differently in a system whose binding risk is a multi-day cold, still, dark stretch.

**And it is buying it into rate base**, earning a regulated return and recovering the cost from customers. That is why commission calendars set this company's growth rate.

**How the commissions actually behaved.** Minnesota approved the 10 MW / 1,000 MWh Sherco system in July 2023 — with a **cost cap** unless overruns are shown prudent and beyond the utility's control, recovered through a rider at about **30 cents a month** per residential customer. A regulator saying yes and hedging.

**Now look for the cost, and notice it is absent.** Xcel filed the Sherco cost as a **trade secret** under Minnesota law. Dominion's Darbytown pilot is $70.6m for a Form system *and* an Eos zinc-hybrid together, unsplit. Georgia and Colorado disclose nothing. **No public rate filing anywhere states a cost per kilowatt-hour for 100-hour iron-air.** The best available figure — about $33/kWh — is arithmetic on a reported $1bn Google purchase, sourced to a paywalled outlet and confirmed by nobody.

**The Google structure is the interesting variation.** At Pine Island the battery is not spread across all ratepayers: Google pays all costs of its new service and any new grid infrastructure through a **Clean Energy Accelerator Charge** inside its Electric Service Agreement. If a novel technology underperforms, the damage lands on Google's carbon accounting, not on Minnesota bills. It still needs approval — docket E002/M-26-170, filed April 2026, pending with the Attorney General and ratepayer advocates objecting on cost.

**Two dockets that do not exist as usually described:** the PG&E Mendocino project is a **California Energy Commission grant**, not a CPUC rate proceeding; the New York system is a **NYSERDA award**, not a PSC proceeding.

**Exercise:** write the three questions a commission staffer should ask about a 100-hour battery that a staffer reviewing a four-hour battery would not. Then say which of them the Sherco cost cap was an answer to.

## Module 5 — Reading a private company's order book

**The single idea:** a backlog you cannot itemise is still information, provided you say how much of it you can see.

**The claim.** Form states its backlog grew from about 20 GWh to about 80 GWh during 2026, tracked through the year: >65 GWh in March, >75 GWh later that month, ~80 GWh by August.

**The count.** Eleven named agreements sum to about **55.7 GWh** — Pine Island 30, Crusoe 12, Lincoln Maine 8.5, Georgia Power 1.5, Sherco 1, Comanche 1, NYSERDA 1, Ireland 1, Mendocino 0.5, Great River Energy 0.15, plus Darbytown whose size Form does not publish.

**The gap and its explanation.** About 24 GWh is not individually announced. Form's wording is that the growth "includes" the named deals, never that it consists of them. An independent analyst reached the same wall from the other direction.

**Two facts that matter more than the gap.** 74% of the itemisable total is two counterparties signed in the same year, both AI data centres, neither delivering before 2027. And exactly **one** project is operating: Great River Energy's 1.5 MW / 150 MWh system.

**Five projects have gone dark.** Comanche, Georgia Power, Darbytown, Mendocino and the New York system have had no first-party update since 2023, all with 2025–2026 targets. Unknown, not known to be bad — but a company that went fourteen months without a press release has not made it easy to tell.

**Exercise:** write the sentence you would use in a research note to state an 80 GWh backlog honestly in under thirty words. Then write the sentence you would use if you could only cite what is itemisable, and say which you would publish.

Developed by: LightAISolutions
