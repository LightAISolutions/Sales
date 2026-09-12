# Gridmatic — Technology Lesson Plan

**Subject:** Gridmatic (private, founder-owned; AI forecasting company running a day-ahead trading desk, a fund-backed battery offtake business in ERCOT and CAISO, and a retail supplier in Texas, Ohio and Pennsylvania) · **Written:** 2026-09-12 · **Baseline assumed:** high-school STEM, no power-markets background.

**What this teaches.** Why electricity prices are partly forecastable and where the forecast runs out; how a probabilistic forecast becomes a bid and how a battery adds a memory to the problem; the menu of battery contracts — fee, toll, floor — and who carries the risk and posts the collateral under each; what one SEC-filed revenue-floor offtake shows about bankability and counterparty credit; retail supply as a forecasting business, including hourly-matched clean power and the bidding of flexible load; how to read a battery leaderboard built from ERCOT's public disclosures; and the industry map in which one company holds three seats.

**Why this gap.** The Habitat Energy guide teaches the pure-play optimiser that sells a desk for a share. This guide teaches the variant that puts capital behind the battery — the toller and floor provider — and joins it to a retail book, so the reader sees where the segment's forecasting skill meets balance-sheet risk. It is also the corpus's first guide to treat convergence bidding, retail supply and load flexibility as applications of one forecast.

**Its place in the segment set.** Beside the Habitat guide on the route-to-market layer, and adjacent to the storage-developers guides on the offtake side: Gridmatic is the counterparty an owner meets when it wants a floor. The Hunt Energy Network guide covers the owner who trades for itself; the Stem and FlexGen guides cover the software layer below.

## Module 1 — Why prices move, and why they are partly forecastable
Marginal pricing; weather as the driver of renewable output and demand; nodal prices and congestion; negative pricing; the day-ahead auction as the market's own forecast; the DART spread and convergence bidding.

## Module 2 — From forecast to bid
Point versus probabilistic forecasts; scenario optimisation over a day's look-ahead; state of charge and degradation cost as constraints; energy versus reserves under real-time co-optimisation; the offer curve and the qualified scheduling entity; full automation as the design choice.

## Module 3 — The offtake menu
Fee or share, tolling agreement, floor agreement with upside: who carries the price risk, who posts collateral, what a lender will size debt against, and why a fund is the enabling structure for the last two.

## Module 4 — One filed offtake
Cross Trails as the worked example: asset, contract, what backed the floor, what the floor bought the owner, how a lender rated the counterparty, and what is and is not disclosed.

## Module 5 — Retail supply as a forecasting business
Retail choice and the load-serving entity's hourly risk; fixed, block-and-index and index products; hourly matching and the T-EAC; bidding flexible load into the day-ahead market and Emergency Response Service; collateral and daily settlement.

## Module 6 — Reading a leaderboard
TBx capture rate, revenue per kW-month, 'most profitable trader' and fleet-size claims: what each is built from, what it proves, what it hides; why Texas rankings exist and California's are thinner.

## Module 7 — Three seats in one chain
Optimiser and QSE, offtaker, load-serving entity and forecasting desk mapped to who normally holds them; what the company does not hold.

## Module 8 — The industry map
Two unrelated customers (owners needing floors; loads that can flex); competitors in every seat; why collateral, not the algorithm, is the scarce input, and what a debt or equity raise would change.

## Pacing
Eight modules of roughly 30 minutes. Modules 1–2 are the technical core. Modules 3–4 pair with the Habitat guide's contract section and should be read together. Module 5 is self-contained and useful for any conversation with a data-centre or miner customer. Modules 6–8 read in one sitting.

## Sources for the technology and industry content
Grounded in the company's dossier and the sources registered there — its own site and reports, the SEC Form Ds, Energy Vault's filings on Cross Trails, the Texas and FERC regulatory records, and Amperical's and Modo Energy's benchmarks — plus the corpus's existing optimisation guides. No company performance claim is used as teaching material except as an example of how to test such claims against public data. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
