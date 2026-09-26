# Chindata — Technology Lesson Plan

**Purpose:** teach the wholesale data-centre landlord and the one solid-state transformer in commercial operation in a Chinese data centre, starting from high-school STEM — what a wholesale landlord sells and how its capacity ladder reads, who picks the equipment in a leased hall, what the Sangyuan SST does and how a medium-voltage SST is built, why it is an SST and Panama is not, why 'first', 'live' and 'commercial' are different claims, where storage sits in an AI hall, and how policy (hub rules, PUE ceilings, direct green power) and ownership shape the bill of materials. No company trivia: founding dates, executives, deal values and shareholdings stay in the dossier. Generated 2026-09-26 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → Chindata → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Delta guide teaches the SST from the maker's side; this one teaches it from the site that specified it. The Alibaba Cloud plan (Module 2) teaches Panama — the transformer-rectifier this SST is measured against. The ByteDance plan (Module 2) teaches the same landlord from the tenant's side.

**Suggested pacing (before 7 October 2026):** Module 1 (~20 min — the landlord and its ladder), Module 2 (~15 min — who picks the equipment), Module 3 (~35 min — the Sangyuan SST and how an SST is built; the most important module), Module 4 (~15 min — storage), Module 5 last (~20 min — policy, energy and the owner), then the flashcard and self-test passes in the app.

## Module 1 — The wholesale landlord

**The single idea:** a wholesale landlord sells megawatts of reliable, cooled power to racks the tenant fills, on long leases, and its capacity figures are a ladder of different promises.

1. **The product.** Chindata leases whole modules or campuses, 'with customised technical solutions and equipment selection'; the tenant brings its servers and is billed monthly by racks or billed capacity. Wholesale is 97.7% of revenue. Contracts are mostly ten years.
2. **The ladder (28 Feb 2026).** Long-term pipeline 3,821 MW; under construction or starting by 2028 2,289 MW; signed but undelivered 886 MW (548 binding, 338 reserved); in service 800 MW; billed 733 MW. Only the billed rung pays today.
3. **Utilisation.** Billed ÷ in service = 91.66%. The gap is capacity built and energised but still ramping. It was 95.89% at end-2024 and 91.25% at end-2025 as new capacity came online.
4. **Concentration.** 'Customer A' took about 90% of revenue in 2024–2026 — tenant concentration: cheap debt while the tenant is strong, and a renewal negotiation (the first contract expires November 2027) in which the tenant holds the leverage.
5. **Geography.** Mostly the 'capital ring' west of Beijing (Huailai, Hebei; Lingqiu, Shanxi, with its own 220 kV substation), with small Yangtze Delta and Greater Bay Area sites and new northwest campuses.

**Self-check:** a landlord reports 800 MW in service. How much of it is earning? (The billed rung — 733 MW; the rest is energised but not yet taken up.)

## Module 2 — Who picks the equipment

**The single idea:** in a leased hall the landlord places the order, but the tenant can decide who is allowed to win it.

1. **The landlord's buying.** The acquirer's filings list Chindata's top equipment suppliers by spend — power modules and UPS, generator sets, batteries — and equipment spending of RMB 2.14 billion (2024), 0.67 billion (2025) and 0.22 billion (Jan–Feb 2026).
2. **The tenant's list.** For UPS, the filing states the rule: a tender among makers on the customer's qualified-vendor list, then purchase from the winner. Whether HVDC systems and power modules follow the same rule is not disclosed.
3. **Two sales.** A supplier must be qualified by the tenant (get on the list) and chosen by the landlord (win the tender) — two relationships for one hall.
4. **The third route.** At Sangyuan the landlord wrote a new specification itself and a tenant agreed to take the hall: the landlord as specifier, not just as buyer.

**Self-check:** why is 'we supply Chindata' not enough for a UPS maker to win a hall built for a hyperscale tenant? (The tenant's list gates the tender.)

## Module 3 — The Sangyuan SST

**The single idea:** the Sangyuan system converts 10 kV AC to 800 V DC in one step with high-frequency silicon-carbide power electronics — the defining trait of a solid-state transformer.

1. **Who did what.** Chindata wrote the specification 'from 0 to 1' and led the design and 34 performance and safety tests; Delta supplied the indoor SST; Chindata's owner (HEC) supplied custom stacked-foil capacitor banks; Meituan leases the hall long-term. Formal commercial operation: 2 July 2026.
2. **What it does.** 10 kV AC → 800 V DC in one step, no 50 Hz transformer, rectifier or UPS inverter. Chindata: it integrates voltage conversion, electrical isolation and power-quality control, 'from line frequency to high frequency'. Delta: SiC high-frequency conversion, solid insulation, 240/400/800 V DC outputs, up to 1 MW per cabinet in about one square metre. Both: 98.5% efficiency.
3. **Delta connection.** The SST is connected to 10 kV in delta: each of its three branches sits between two phase lines and sees the full 10 kV line-to-line voltage (in star it would see 10 ÷ √3 ≈ 5.8 kV); no neutral is needed, at the cost of more stacked cells per branch. Chindata calls the connection mode a first.
4. **How a medium-voltage SST is generally built** (the class of device — the Sangyuan unit's topology is unpublished): cascaded H-bridge cells in series on each phase, each rectifying a slice of the medium voltage; in each cell a dual active bridge switching at thousands of hertz through a medium-frequency transformer (isolation and step-down); the cells' outputs paralleled onto one DC bus; control that regulates output, balances phases and manages two-way power.
5. **Why it is an SST and Panama is not.** Panama's isolation is a 50 Hz phase-shifting iron transformer with rectifiers behind it; Sangyuan's is a high-frequency stage. Output voltage, prefabrication and efficiency do not decide the class — the isolation frequency does. (Neither Chindata nor Delta states Sangyuan's isolation frequency.)
6. **'First', 'live', 'commercial'.** Unveiled 20 November 2025; 'went live' February 2026 per a supplier to the project; 'formally implemented' per Delta's February 2026 issue; formal commercial operation 2 July 2026 — four milestones, not a contradiction. Another operator has run an SST pilot since late 2024, so the defensible claim is the first in commercial operation.
7. **What is not disclosed.** The hall's megawatts, the isolation frequency, and a consistent footprint saving (70% in November 2025, more than 50% in July 2026).

**Self-check:** Panama also delivers 800 V and is factory-built. Why is it still not an SST? (Its isolation is a 50 Hz iron transformer; an SST's is a high-frequency stage.)

## Module 4 — Storage at three levels

**The single idea:** an AI hall needs storage that answers three different time scales, and an SST's DC bus can host the first of them directly.

1. **Grid entry (hours).** Outages and the daily price cycle: charge on cheap night power, discharge at the peak (energy arbitrage). At Sangyuan the storage is integrated with the SST, switching among grid, battery and combined supply.
2. **Room distribution (minutes).** Ride-through until the generator sets start and carry the load; UPS or DC-system batteries.
3. **Rack end (seconds and below).** AI training makes thousands of accelerators switch between computing and communicating in unison, so a hall's draw swings within fractions of a second; battery backup shelves and supercapacitors at the rack absorb it before it reaches the grid. Chindata's design places storage at all three levels.

**Self-check:** why can't the grid-entry battery alone smooth an AI training load swing? (It sits too far up the chain and is sized and controlled for minutes-to-hours; the sub-second swing has to be caught near the rack.)

## Module 5 — Policy, energy and the owner

**The single idea:** national hub rules and PUE ceilings, the cost of energy, and an owner that makes components all shape which power chain a landlord builds.

1. **East Data West Computing.** New large data centres should in principle be built in national hub regions with PUE no higher than 1.25. All Chindata's long-term projects sit in hubs; its PUE averaged 1.21 in 2025 and 1.18 in February 2026.
2. **Energy is the big running cost.** 4.968 TWh bought in 2025 for about RMB 2.51 billion (~RMB 0.51/kWh) — nearly four times that year's equipment spending. One percentage point of efficiency ≈ 50 GWh ≈ RMB 25 million a year.
3. **Direct green power supply.** A wind or solar plant feeding the campus over a dedicated line; Ulanqab is planned as a gigawatt-scale direct-green-power zone. A DC bus that accepts storage and renewable sources directly is an SST strength.
4. **The owner in the BOM.** Since January 2026 the China business is controlled by an HEC-led consortium; HEC's listed arm is buying the rest. HEC makes capacitors, fluorinated coolants and liquid-cooling components; about RMB 4.75 billion of mechanical and electrical equipment is earmarked across three campuses; Chindata says it will work with domestic makers on the SST's core components to speed localisation.
5. **Foreign ownership and the licence.** Running an internet data centre in China needs a value-added telecom licence, of which foreign investors may hold at most half — why the US-listed Chindata used VIE structures, terminated at the sale to domestic owners. Bridge Data Centres, the overseas business, is a separate company.

**Self-check:** where is an outside supplier's opening in an SST whose landlord's owner makes capacitors? (The power semiconductors, the medium-frequency transformer and the converter itself — and the owner's stated wish for domestic sources.)

## Where the flashcards and self-test point

The in-app guide's drill items test the concept chain above — the wholesale model and utilisation, the tenant's approved vendor list, what makes the Sangyuan system an SST, delta connection, the stages of a medium-voltage SST, storage at three levels, the PUE ceiling and what a point of efficiency is worth, the owner in the bill of materials, and the milestone words. None tests a date, a name or a share count.

Developed by: LightAISolutions
