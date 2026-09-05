# Hunt Energy Network — Technology Lesson Plan

*Full-depth curriculum behind the in-app study guide (`live-site-pages/profiler-data/hunt-energy-network.study.json`). Not deployed. Baseline: high-school STEM. Dossier: `hunt-energy-network.profile.json` (schema v7, v1, 2026-09-05).*

## What this plan teaches, and what it leaves to other guides

Hunt Energy Network (HEN) is the **owner-trader**: a fully merchant ERCOT battery owner that is its own qualified scheduling entity, owned by a family company and funded by a life insurer's infrastructure funds through a joint venture. The plan teaches (1) what a QSE is and why an owner would be one, (2) what the desk does every five minutes under real-time co-optimisation, (3) how a family office and an insurer's general account fund a merchant fleet without a bank, (4) why unit classes in a JV matter more than the chart, (5) why an owner-trader adds fuelled peakers, and (6) where the model breaks.

It does **not** re-teach: the sub-10 MW distributed play — why 9.9 MW, the lighter distribution interconnection, siting on leased land, selling at NTP with a turnkey EPC (Available Power guide; HEN is the owner-operator instance); financing a merchant battery with no PPA at transmission scale (Spearmint guide); converting merchant exposure into fixed payments through a desk that sells swaps (GridStor guide); responsive reserve, fast frequency response and hour-by-hour ERCOT revenue (Classroom).

## Module 1 — The QSE (45 min)

- ERCOT deals with resources only through qualified scheduling entities: offers, bids, telemetry, dispatch instructions, settlement. Most owners hire one (Gridmatic, Habitat, Tesla, Equilibrium, Ascend, Caerus, CES); Modo's directory lists HEN/TraDER as 'QSE + DME + Auto-bidder', ERCOT only.
- A 'Level 4' QSE handles full energy and ancillary settlement and carries credit requirements with ERCOT, a compliance function and 24/7 staffing. HEN's resource IDs sit under 'HEN Power Marketing LLC' (Amperical).
- **Why be your own:** margin (the optimiser's fee or share stays home — Faulkner about USD 225,000/MW, 60 percent above Modo's DGR index; Junction the top one-hour site, November 2024); fleet effects ('revenue maximization across 32 unique nodes'); product (TraDER marketed to third-party owners).
- **Check:** what fixed costs does a fleet carry that a single 9.9 MW owner cannot?

## Module 2 — Five minutes at a time (40 min)

- Settlement points and load zones: locational prices every five minutes; a fleet 'in all 4 load zones' diversifies which constraint pays.
- Real-time co-optimisation plus batteries (RTC+B, live 5 December 2025): energy and ancillary services clear together; state of charge tracked inside the clearing — a one-hour unit is paid for what it can hold. HEN commented on NPRR1204 (state of charge) and NPRR1268 (ancillary demand curves) and marketed TraDER as 'Fully RTC-Compliant by Dec 2025'.
- The market backdrop: ERCOT battery revenues about USD 193/kW (2023) → USD 56/kW (2024) → USD 29/kW (2025); arbitrage's share 25 → 76 percent (Modo).
- The desk's other job: 'utility tariff cost mitigation' — the distributed batteries pay wholesale distribution service demand charges to TNMP, Oncor, AEP Texas and South Texas Electric Cooperative; HEN contests them in PUCT Dockets 58315 and 58964.

## Module 3 — A family and an insurer (50 min)

- **The family.** 'A part of the Hunt Energy Company'; 'managed by the Ray L. Hunt family'; one of six Hunt Consolidated divisions; founded 2018 inside Hunt Energy Enterprises. A family office owns outright, funds from the group balance sheet, holds without a fund life.
- **The insurer.** Manulife IM: USD 225 million (March 2021) forming HEN Infrastructure, L.L.C. from John Hancock's general account and managed accounts; USD 250 million (August 2024) from Manulife Infrastructure Fund III, 'wholly distinct'. Why a general account wants batteries: long-dated steady returns matched to policy liabilities.
- **The structure.** PUCT chart: Hunt Consolidated → Hunt Equities / HIC GP → Hunt Investment Company → Hunt Energy Enterprises → Hunt Energy Network → HEN Infrastructure 'A Units'; John Hancock → Manulife Infrastructure II Holdings A, L.P. 'B Units'; labels '100% / 0% Economic Interest' — which class carries the economics is not legible. Lesson: the operating agreement's unit terms decide the cash, not the chart.
- **What is missing.** No loan, tax-equity or credit-transfer counterparty for a 420 MW fleet. Either the insurer and the family fund construction directly, or the financings are private. For a supplier: no lender's adviser or tax-equity investor in the OEM decision.
- Compare: Spearmint (lender lends against the desk), esVolta (banks lend against a bought hedge plus preferred equity), GridStor (contracts and a swap before construction).

## Module 4 — Peakers for a one-hour fleet (30 min)

- The 2024 commitment: 'thermal peaking generation facilities' with 'significant on-site fuel storage', multi-fuel, for 'extreme weather events'. Three 9.9 MW 'AGR' units registered at battery sites (Olney, Coyote Springs, Saddleback); EIA: oil-fired, 2026–2027; first diesel peaker online April 2026 (Wood).
- Why: a one-hour battery empties in the first hour of a multi-hour scarcity event; a fuelled unit at the same node runs through it — firming for the trading strategy at a sunk site and connection.
- The parent's adjacent line: Caterpillar–Hunt Energy Company, L.P. (August 2025), 'up to 1 GW' of data-centre generation, citing HEN's fleet as credentials; Wood: 'working with select customers to power their data centers'. Whether the peakers are Caterpillar units is not stated.

## Module 5 — Scale change (20 min)

- Fort Duncan (100 MW / 200 MWh, Eagle Pass; bought operating from Recurrent Energy, February 2026; '100% merchant'; Canadian Solar e-STORAGE batteries; Burns & McDonnell EPC for the seller; USD 183 million of the seller's financing; price undisclosed; TenOaks advising).
- Fizzle and Nanuluk (180 MW each) in development; Whitetail, Amberjack2 (180 MW) and Kodiak AGR1 (132 MW, oil) in the queue with no interconnection agreement; Modo: 360 MW of transmission-level assets, 2027.
- A desk tuned to 9.9 MW distribution nodes now trades a 100 MW transmission node.

## Module 6 — Where it fails and the industry map (25 min)

Market repricing on a fully merchant fleet; the insurer's appetite as the growth constraint; the wire company as landlord; a one-hour fleet under RTC+B; scale change; a thin record (no per-site MWh or COD, no OEM, no EPC, no debt, inconsistent counts: 33 / 31 / 30). Map: Available Power (same unit, opposite end of the chain), Spearmint, esVolta, GridStor, Jupiter and Plus Power (Modo's July 2024 top-earning owners), Caterpillar (parent-level).

## Corrections to the brief

- ERCOT-only (no CAISO, no PJM); fully merchant (no toll, hedge or offtake in any source, including the PUCT filings); not 'mid-size' — 32 distribution-connected 9.9 MW units plus one 100 MW battery.
- Ownership: Hunt family's Hunt Energy Company; Manulife is the JV equity partner, not an owner.
- The Caterpillar agreement is the parent's (Hunt Energy Company, L.P.), not HEN's.

## Suggested pacing

Two sittings: Modules 1–3 (about 2 h 15 min), then Modules 4–6 (about 1 h 15 min). Read the Available Power guide's 'why 9.9 megawatts' section first; this plan assumes it.

Developed by: LightAISolutions
