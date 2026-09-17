# Landscape — Software and Optimization — Analysis & Module Source

> **Not deployed.** This file is the source of truth for the in-app guidance module
> `landscape-software-and-optimization-2026-09`
> (`guidanceDocLandscapeSoftwareAndOptimization_()` in
> `googleAppsScripts/Classroom/Classroom.gs`, lane **The Value Chain**, tier **contributor**).
> Written 2026-09-17 as S2 session 17 — the **seventeenth** landscape and the **twenty-sixth**
> guidance module. Spec: `CLASSROOM-CURRICULUM-PLAN.md` §10.6; brief:
> `INTEGRATED-REMEDIATION-PLAN.md` §7.49.

## What this is

A **corpus-synthesis** landscape: no ingested document and no new research. Every claim traces to
one of the segment's twenty member dossiers at the profile version recorded in §8, to
`profiler-segments.json`, or to the relationship graph. The developer's 2026-09-07 exception
(`INTEGRATED-REMEDIATION-PLAN.md` §7.2, decision 2) is what allows a guidance module to name and
rank covered companies; the guidance is still to a **group** — the BESS or AIDC-power seller
reading it, about the parties who decide what a storage plant earns.

**The mechanism is not taught here.** `the-control-stack` — public, and one of only two lessons
mapped to this segment — already owns the BMS/PCS/EMS layering, the day in dispatch, the re-bidding
cycle and the optimiser-inside-a-warranty-envelope argument. This module owns **who sells that
layer, how they arrived at it, and whether anybody can rank them.** That split is the inverse of the
usual one and is stated here so a later row does not have to guess at it (§10.6 **(jj2)** — write
the destination, not the state).

## The segment as measured

All figures re-derived from the files on **2026-09-17**, not copied from the brief (§10.6 **(aa4)**,
**(jj1)**).

| What | Measured |
|---|---|
| Members | **20** — **2** incumbents, **3** challengers, **15** adjacent |
| Adjacent share | **75.0 % — the highest of all nineteen segments.** Next: `clean-firm-and-nuclear` 68.8 %, `grid-equipment` 60.0 % |
| Incumbents | `flexgen`, `stem` — **and both reach this segment from an adjacent business**, FlexGen from integration, Stem from solar asset-performance management |
| Challengers | `fluence` (a hardware company's software lines), `habitat-energy`, `gridmatic` — **the last two are the only pure-plays, both private, and one is for sale** |
| Chain position · tier | **18 · services** — 17 segments upstream, **1** downstream |
| Basis field each member is typed on | **16** `productsAndServices` · **3** `ecosystemRole` · **1** registry tagline (§2b) |
| Buying criteria | **5** |
| Criterion rows that resolve to a built lesson | **3 of 5**, and **all three resolve to the same lesson** — one of seven segments whose whole resolved criterion table points at a single lesson, and tied for the most rows resolved among them (§A2) |
| Lessons mapped in `READ_NEXT` | **2** — `the-control-stack`, `contracts-and-revenue`. Joint-smallest in the taxonomy, with four other segments |
| Mapped lessons the criterion table cannot reach | **1 of 2** — `contracts-and-revenue` resolves no row (§A2) |
| Possible member pairs | **190** |
| Member pairs the graph connects | **34 of 190 — 17.9 %** |
| Curated typings | **37** across those 34 pairs |
| `competitor` typings | **30 of 37 — 81 %.** The inverse of `compute-and-the-rack`'s 1 of 7 (§4c) |
| External memberships | **38**, held by **19 of the 20 members** |
| The exception | **`habitat-energy`** — the only member belonging to no other segment |
| Inversions | **15 of 15 bench members ranked higher elsewhere; 4 of the 5 external memberships held by ranked members demote them** (§2c) |
| Direction of every external membership | **Upstream, all 38** — and the module **declines** to read that as a terminus, because position 18 of 19 leaves one segment downstream (§2d) |
| Independent rankings | **Four named third parties publish six measurements near this segment and none of the six ranks the segment** (§2e). The one that would — Wood Mackenzie's *Global BESS software landscape 2026* — is paywalled |
| Policy fence | **71 entries across twenty members** |
| Future day-level dates | **ISO scan 5, word-form scan 13, and the two scans' in-horizon results are DISJOINT** (§10) |
| `reviewBy` | **2027-03-17** — the six-month default, only the **third** of seventeen landscapes to take it, with four rejections in writing (§10) |

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

1. `who-dominates-and-on-what-basis` — two incumbents, both arriving sideways, and what "dominates"
   can mean when nobody publishes a share
2. `who-threatens` — three challengers on three different routes, and the graph underneath them
3. `each-players-bet` — one row per incumbent and challenger, from each company's own strategy read
4. `the-indicators` — what to watch, dated only where the record dates it
5. `the-sellers-play` — §10.10's two paths
6. `claims-ledger` — every load-bearing claim to a dossier field at a profile version
7. `what-the-record-does-not-say` — the boundary, the disagreements, and the empty categories
8. `drill` — flashcards
9. `check-yourself` — five judgment questions

## 1. Executive read

**This segment is defined by a capability that most of its members acquired sideways.** Twenty
members, and sixteen of them are here because a company whose business is something else ships a
software product. Both incumbents arrived from an adjacent business — FlexGen from hardware
integration, Stem from solar asset-performance management — and the registry says so in their own
basis lines. Two companies in the segment do nothing else, and both are private challengers.

**Nobody ranks it.** Four named third parties publish six measurements in the neighbourhood and not
one of the six ranks this segment: a hardware ranking the segment's own incumbent deliberately sits out, a
vendor-written census, a Great Britain contracted-MW table, a monthly per-asset capture-rate
benchmark whose two public months disagree, and a four-year-old award in a solar category. The
source that would settle it is paywalled. **The honest headline is the boundary, not a share.**

**What replaces a share is a testable claim about lanes.** The seller's question is not "who is
biggest" but "which of three things is this company selling": the **controls layer** that runs the
plant whoever built it, the **asset-performance layer** that reports on a fleet, or the **route to
market** — the registration, the forecast, the bid and the desk — sold on a share of what the
battery earns. The two incumbents sit in the first two. The two pure-plays sit in the third. The
vendor-bundled arms of eight hardware companies sit across all three and are sold to protect the
hardware. A conversation that does not first establish which lane the prospect is in will price
every subsequent answer wrong, and the corpus states that mechanism in one of its own members'
files rather than leaving it to be inferred.

## 2. The coverage boundary — written before any other section

Every other section in this file was written after this one, because on this segment the boundary is
not a caveat on the ranking: it **is** the ranking, and it decides what the module may say.

### 2a. The roster is the most adjacent-heavy in the taxonomy, and it is not close

Measured off `profiler-segments.json` on 2026-09-17, not taken from the brief (§10.6 **(jj1)**):

| Role | Members | Share |
|---|---|---|
| incumbent | **2** — `flexgen`, `stem` | 10.0 % |
| challenger | **3** — `fluence`, `habitat-energy`, `gridmatic` | 15.0 % |
| adjacent | **15** | **75.0 %** |

**75.0 % is the highest adjacent share of all nineteen segments.** The next is
`clean-firm-and-nuclear` at 68.8 %, then `grid-equipment` at 60.0 %; three segments carry no adjacent
member at all. The brief's arithmetic was right — and it is recorded here as **measured**, because
**(jj1)** is the finding that a brief's arithmetic about the corpus is a claim about the corpus.

### 2b. Sixteen of the twenty are here on the strength of a product line, not a business

The registry writes each member's `basis` against a named dossier field. Counted:

| Field the basis rests on | Members | What it means |
|---|---|---|
| `productsAndServices › <product>` | **16** | a software product **inside** a company whose business is something else |
| `ecosystemRole` | **3** — `stem`, `habitat-energy`, `gridmatic` | the company's own identity in the corpus |
| registry tagline | **1** — `flexgen` | the segment's software-first integrator |

Of the three whose basis is `ecosystemRole`, one — `stem` — is typed in its own basis line as an
incumbent **of a different market**: "Incumbency is on SOLAR AND HYBRID ASSET-PERFORMANCE
MANAGEMENT, not on merchant storage bidding."

**So exactly two of the twenty are in this segment because merchant storage optimisation is the
whole company: `habitat-energy` and `gridmatic`. Both are private, both are challengers, and one of
them is for sale.** That sentence is the segment, and everything below is a consequence of it.

### 2c. The bench is other segments' ranked players, and the segment's own players are other segments' bench

Across the twenty members there are **38 external memberships** in other segments. Sorted by the
role held here:

| | External memberships | Ranked **higher** elsewhere | Ranked **lower** elsewhere | Same |
|---|---|---|---|---|
| The 5 members this segment **ranks** | **5** | **1** (`fluence`) | **4** (`flexgen` ×2, `stem`, `gridmatic`) | 0 |
| The 15 members this segment **benches** | **33** | **19** | **0** (they cannot go lower) | 14 |

**All fifteen adjacent members are ranked incumbent or challenger in at least one other segment.
Not one of them is adjacent everywhere.** Eleven are an **incumbent** elsewhere — `canadian-solar`,
`dnv`, `enchanted-rock`, `engie-north-america`, `hyperstrong`, `nrg-energy`, `schneider-electric`,
`tesla`, `ul-solutions`, `wartsila`, `zhonhen` — and the other four (`form-energy`,
`hunt-energy-network`, `prevalon`, `rolls-royce-power-systems`) are a **challenger** elsewhere.

This is §10.6 **(aa2)** and **(ee3)** firing together for the third time, and the first time either
has been **total on both sides**: every bench member is somebody else's ranked player, and four of
the five external memberships held by this segment's own ranked players demote them.

One member belongs to **no** other segment: `habitat-energy`. It is the only company in the corpus
whose entire identity is this segment.

### 2d. Direction — and the claim this section declines to make

All 38 external memberships point **upstream** (chain position below this segment's 18). Nine
landscapes have reported a version of that result, and here it carries **almost no information**:
this segment sits at **position 18 of 19**, so there is exactly **one** segment downstream of it.
`compute-and-the-rack` reported the same shape from position 9 with **ten** segments below it, which
is a measurement; from position 18 it is very nearly forced by arithmetic. **This module therefore
does not claim to be a terminus.** What the distribution does say is where the memberships sit:
supply **14**, build **14**, demand **8**, services **2** — so 36 of the 38 reach into the parts of
the chain that build and buy the batteries, and only two stay inside the services tier this segment
belongs to.

### 2e. Four named third parties publish six measurements near this segment, and not one ranks the segment

This is the sharpest correction this session makes to its own brief. §7.49 records that "no third
party reachable in the P3 research ranks any player in storage bidding except Modo Energy." Measured
against the member dossiers, that **understates what exists and overstates what it is worth**:

| Ranking | Independent? | What it actually measures | Parties named that the corpus covers |
|---|---|---|---|
| **Wood Mackenzie**, first Global BESS Integrator Comprehensive Ranking, July 2026 | yes | **AC-block hardware supply** | the four positions the corpus can name — Sungrow #1, Tesla, CATL, Fluence #7 — are **all covered** |
| **Modo Energy**, US battery-optimizer directory, April 2025 (**17 entries**) | **no — vendor-written** | who exists, in each vendor's own words | **7 of the 16 named** |
| **Modo Energy** (via Tamarindo), Great Britain MW optimised, January 2025 | yes | **contracted MW in Great Britain** | **2 of 10** — Tesla 680 MW and Habitat 600 MW; the leader **EDF at 750 MW is uncovered** |
| **Modo Energy**, ERCOT monthly capture-rate benchmark | yes | **one month's capture rate** | Habitat (December 2025, first at 84 % against a 35 % median); **April 2026's leader, Aypa, is uncovered** |
| **Amperical**, ERCOT 60-day settlement leaderboard, Jan–Jul 2026, **308 resources** | yes | **individual batteries**, by revenue per kW-month | Gridmatic's two, at **11th** and **43rd** |
| **Guidehouse Insights**, Solar and Storage Monitoring and Control, August 2022 | yes | a **solar** software category, **four years ago** | AlsoEnergy (Stem), first |

**Read the coverage column against the relevance column and they run in opposite directions.** The
ranking this corpus covers best — every position it can name — is the one that measures AC-block
hardware, a business the segment's own incumbent has deliberately left; and its own dossier reads
its absence from that list as confirmation of the lane it chose, not as a poor showing. The two
rankings that measure what this segment actually sells are covered at **44 %** and **20 %**.

Three further properties of that table matter more than any number in it:

1. **The only source that lists the whole optimiser field is written by the field.** Modo's April
   2025 directory entries are self-supplied — Gridmatic's dossier says so in as many words of its
   own entry. It is a **census**, not a ranking, and this module uses it only to say who exists.
2. **That census quantifies six peers and declines to quantify one of this segment's two
   incumbents.** It records Tesla's Autobidder as number one in Modo's ERCOT rankings for 2022 and
   2023 and gives quantified performance for Habitat, Gridmatic, Equilibrium, Tesla, Tierra and
   Caerus, while listing **Stem in capability-only language**. A directory that quantifies six
   entries and not the seventh is making a statement about the seventh.
3. **The two months of independent ERCOT data on the free record disagree.** December 2025 put
   Habitat first; April 2026's table was led by Aypa and did not name Habitat at all. Habitat's own
   dossier says a single month on a small named fleet is noisy — and cites the company's own August
   2025 argument that leaderboards are noisy. The one firm with a first place published the case
   against reading it.

**Wood Mackenzie's *Global BESS software landscape 2026* is the one source that would settle any of
this, and it is paywalled.** That is why this module ranks nobody by share.

### 2f. What this module may therefore say

It may say who the registry ranks and on what evidence; it may report each independent measurement
with its scope attached; it may state the graph. It may **not** convert Modo's April 2025 directory
into a market share, and it does not. Where a number is a company's own, this module says so on the
same line.

## 3. Who dominates, and on what basis

### 3a. Both incumbents arrived from somewhere else, and the registry says so in their own basis lines

This is the only segment in the taxonomy whose **entire** incumbent set reaches the business
sideways, and neither dossier hides it.

**FlexGen** is typed on the registry tagline: *software-first US BESS integrator (HybridOS EMS);
25+ GWh across 200+ systems under software and services; hardware-agnostic site controls*. Its own
file records the turn explicitly — founded 2009 as a military hybrid-power **hardware** company,
pivoted to utility-scale integration, and after 2023 to a software-and-services model. The proof
points are all acquisitions of other people's fleets and functions: the **USD 36 million
stalking-horse purchase of bankrupt rival Powin's assets** in August 2025 (hardware and software IP,
IT systems, spare parts), the commissioning firm Clean Energy Services in April 2026, and European
operations launched in June 2026 with projects secured in the UK, Finland and Sweden.

**Stem** is typed on `ecosystemRole`, and that line is the single most useful sentence in this
segment's evidence base. It names the mechanism: *"Every other software position in this corpus's
software-and-optimization segment except FlexGen is a division of something else — Fluence's Mosaic
and Nispera, Wartsila's GEMS, Tesla's Autobidder, Canadian Solar's EQ-S, Prevalon's insightOS,
Rolls-Royce's mtu EnergetIQ, Schneider's AVEVA layer — sold with, or to protect, the vendor's own
equipment."* **Seven vendors named, and every one of the products is confirmed in that vendor's own
dossier** — Mosaic 6 mentions, Nispera 4, GEMS 41, Autobidder 14, EQ-S 2, insightOS 7, EnergetIQ 10,
AVEVA 8. That is §10.6 **(dd2)**'s cross-attestation instrument fired **seven for seven**, its widest
positive result: one member's claim about seven others, each confirmed independently in the other's
file.

And Stem's own basis line then applies the same discipline to Stem: *"Incumbency is on SOLAR AND
HYBRID ASSET-PERFORMANCE MANAGEMENT, not on merchant storage bidding."*

### 3b. The numeric ladder that looks like a ranking and is not

The two figures a reader will reach for are **25+ GWh** (FlexGen, under software and services) and
**1.8 GWh** (Stem, storage assets under management at 2026-06-30). That is about a fourteen-fold
gap and it is **not a ranking**, for two independent reasons:

1. **They measure different things.** FlexGen's figure counts every system its software and
   services touch across 200+ systems in 10+ countries. Stem's counts storage assets under
   management inside a suite whose weight is on the **solar** side — 38.3 GW of solar against the
   1.8 GWh of storage.
2. **They are not sourced alike.** FlexGen's is **company-reported** and the company is private;
   Stem's comes out of an SEC filer's own disclosures. A company-reported number and a filed number
   are not two points on one scale.

That is §10.6 **(gg5)** again — a numeric ladder whose defeater is a unit and provenance mismatch
rather than a coverage gap — and it is why this module states both numbers with their basis
attached and ranks neither above the other.

### 3c. What dominance can honestly mean here, and it is three testable things

**One: the largest fleet under management, which is the segment's own fifth buying criterion.**
Stem's PowerTrack suite carries 38.3 GW of solar and 1.8 GWh of storage operating assets at
2026-06-30 and **USD 62.4 million of ARR**. Whatever it is not, it is the largest fleet any member of
this segment discloses — the fleet, and not the revenue, because §4e shows a challenger's
recurring line is larger.

**Two: the retrofit path off an orphaned EMS, which is the segment's first buying criterion.**
FlexGen sells HybridOS **with no battery attached**, claims 65+ hardware configurations from 22
global vendors over fifteen years, and runs an explicit **EMS Retrofit** product for taking over
underperforming or orphaned third-party controls. The Powin purchase turned that from a pitch into
an installed base: it services the ex-Powin fleet and offers migration to HybridOS. When an
integrator fails, somebody has to own the controls, and this is the company whose product line is
built for that day.

**Three: absence from the wrong ranking, read as evidence.** FlexGen does not appear in Wood
Mackenzie's July 2026 global BESS integrator top ten (Sungrow, Tesla, CATL on top). Its own dossier
assesses at **high confidence** that this is "consistent with the chosen software/services position,
not competitive failure" — and its relationship entries repeat the reading three times against three
different rivals. A company that reads its own absence from a hardware league table as confirmation
is making a claim a seller can test.

### 3d. Two things the incumbents' files say that a seller must not skip

**Stem's revenue and Stem's business move in opposite directions.** Total revenue fell from
USD 461.5m in FY2023 to USD 156.3m in FY2025 — but battery **hardware resale** went 360.2 → 31.3 →
14.8 → 0.3 (first half of 2026), a 96 % collapse in the line that was 78 % of FY2023 revenue. Over
the same period the software, edge-hardware and services core grew **76.0 → 111.2**, gross margin
swung **−8 % to 38 %**, and adjusted EBITDA turned positive at **+6.7m** in FY2025 and **+8.2m** in
the first half of 2026. Read the top line alone and the company looks like it is failing; read the
product-line table and it is smaller and better on every operating measure. Against that sits a
**USD 270.0 million stockholders' deficit** and roughly USD 347m of debt principal — which its own
dossier calls a constraint judgment rather than a solvency one, because the Q2 2026 10-Q carries no
going-concern qualification.

**And Stem is not an AI-data-centre story.** Its dossier assesses at **high confidence** that any
framing placing it in the data-centre power trade is wrong: no data-centre product, contract or
revenue exists in any source located, and the single mention anywhere is one exploratory sentence
on the Q1 2026 call that was not repeated on the Q2 call. In a corpus built around the AI power
build-out, one of this segment's two incumbents has told us it is not in it.

## 4. Who threatens — three challengers on three different routes

### 4a. The three are not challenging the same thing, and averaging them misprices all three

**Fluence** is a hardware company's software lines. Its basis is `productsAndServices` — Mosaic
(AI-enabled market bidding) and Nispera (asset performance management, multi-OEM), *sold beyond its
own hardware*. The parent is ranked **#7 in Wood Mackenzie's first Global BESS Integrator
Comprehensive Ranking (July 2026)**, carries 6.8 GW of cumulative deployed capacity and a record
USD 6.4 billion backlog at June 2026, and disclosed **22.0 GW of renewable assets on its digital
offerings** at 2025-09-30. It is by far the largest of the five members this segment ranks — Schneider
Electric and Tesla are larger still and both are bench — and the one whose software is most clearly
an instrument of something else.

**Habitat Energy** sells the route to market and nothing else: the EVOLVE service bundles
probabilistic price forecasting, automated bid construction and a **24/7 human trading desk** with
the registrations an owner would otherwise need itself — Balancing Mechanism Virtual Lead Party in
Great Britain, Level 4 Qualified Scheduling Entity in ERCOT, NEM bidding in Australia — sold mainly
on **revenue share**. Company-stated scale is 5.5 GW under contract across three markets at June
2026. **It is the only member of this segment whose ranking rests on a third party rather than on
its own claim**: third in Great Britain at 600 MW in January 2025 behind EDF's 750 and Tesla's 680,
and first among ERCOT optimisers in Modo's December 2025 capture-rate table at **84 % against a 35 %
fleet median**.

**Gridmatic** monetises one forecasting engine three ways, and the difference from Habitat is
capital. Where Habitat sells a desk on revenue share, Gridmatic puts its own **USD 50 million fund**
behind the battery — a tolling or revenue-floor offtake in which it takes the merchant risk and the
QSE seat — and runs a retail book selling matched power to data centres and miners on the same
forecasts. Named assets: Energy Vault's **Cross Trails** (57 MW / 114 MWh on a ten-year physically
settled revenue floor, COD May 2025), Alpha Omega Power's **Caballero** (100 MW / 400 MWh, CAISO)
and **Endurance Park** (52 MW, ERCOT West).

### 4b. The two pure-plays are measured in opposite ways, and both measurements should be quoted with their scope

Habitat's position is **independently measured and its own dossier discounts it**: two months of
free Modo ERCOT data exist, they point in different directions (December 2025 Habitat first; April
2026 led by Aypa with Habitat unnamed), and the company itself published an argument in August 2025
that single-month leaderboards are noisy.

Gridmatic's position is **self-asserted and independently contradicted in scope**: every scale claim
is the company's own — "most profitable participant in ERCOT's wholesale market", "1000+ C&I
customers", "300 MW / 1 GWh under management" — while the one independent leaderboard that can be
read, **Amperical's, built from ERCOT's 60-day settlement disclosures across 308 resources for
January–July 2026**, places its two ERCOT batteries **11th** and **43rd**. Its own dossier is
explicit that capture rate and revenue rank measure different things and both readings can be true.

**And the audited picture of the segment's independently-ranked leader is small.** Habitat's UK
entity booked **GBP 1.99 million of turnover** and a **GBP 5.0 million loss** in FY2024, with net
liabilities of GBP 12.7 million carried by GBP 37.2 million of parent loans and an average of 57
employees; the group line consolidating all three countries' optimisation fees was **GBP 4.17
million, up 80 %**. The company that tops an independent ERCOT table is a loss-making subsidiary
with a four-million-pound fee base — and **it is for sale**: Quinbrook engaged JLL and Boston
Consulting Group in March 2026, ten weeks after selling its sister platform Flexitricity to Drax for
GBP 36 million, and as of 2026-09-12 no buyer, signing, completion or withdrawal is on the record.

### 4c. The graph — rivalrous, and mostly about somebody else's business

**34 of 190 possible member pairs carry an edge (17.9 %) and they carry 37 curated typings, of which
30 read `competitor` — 81 %.** That is the inverse of the previous landscape in this lane, where one
typing of seven read competitor. This is a field of rivals, not a supply chain.

But the rivalry is not mostly this segment's:

| | Count |
|---|---|
| `competitor` typings between two members this segment **ranks** | **9** |
| `competitor` typings involving at least one member it **benches** | **21** |

**Seven in ten of this segment's recorded rivalries involve a company the segment itself does not
rank**, and the bench edges are overwhelmingly about AC-block hardware — SolBank against Megapack,
HD5 against Megablock, Quantum3 against Megapack, HyperBlock in the 6+ MWh race. Those are real
rivalries in `storage-integrators-and-containers`, read through a roster that happens to overlap.
The adjacency problem of §2 is visible in the graph as well as in the registry.

### 4d. The two missing edges are not random — they share an endpoint

Five ranked members give ten possible pairs. **Eight are connected; the two that are not are
`flexgen` ↔ `habitat-energy` and `flexgen` ↔ `gridmatic`.** Both missing edges have the same
endpoint: the segment's software-first incumbent has **no recorded relationship of any kind with
either pure-play optimiser**, while the other incumbent, Stem, connects to both.

That silence sits exactly on the seam this module is about. FlexGen sells the controls layer on the
asset; Habitat and Gridmatic sell the desk that bids the same asset. They are adjacent layers on one
battery and the corpus connects neither pair — not competitor, not partner, not supplier. §9 states
it as a gap rather than explaining it away.

### 4e. The recurring-revenue comparison the registry did not make, and why it did not

Two members publish a recurring-revenue figure for the software business, and they are not
like-for-like — but both are the company's own framing and the direction is not in doubt:

| Company | Role here | Figure | As at | What it counts |
|---|---|---|---|---|
| Stem | **incumbent** | **USD 62.4m ARR** | 2026-06-30 | the whole company's annual recurring revenue |
| Fluence | **challenger** | **USD 148m digital and recurring ARR**, against a USD 180m FY2026 target | 2025-09-30 (FY2025 end) | the digital and recurring line inside a hardware business |

**The challenger's software-and-recurring line is more than twice the incumbent's entire ARR**, on
figures nine months apart and on definitions that do not match — Fluence's line sits inside a
company whose backlog is USD 6.4 billion of hardware, and "digital and recurring" is broader than
"software subscription". The registry typed Stem incumbent on **fleet under management**, which is
this segment's fifth buying criterion, and not on revenue. That is the right basis and this module
keeps it. But a seller who says "the incumbent" in a room where somebody has read Fluence's
FY2025 results needs to know which measure the word is standing on.

Fluence's own software reach is the other number worth carrying: **17 GW of wind, solar and storage
optimised or contracted through Mosaic at 2025-12-31**, and 22.0 GW of renewable assets on the
digital offerings at 2025-09-30.

## 5. Each player's bet

Five rows — one per incumbent and challenger, which is **exactly §10.6's shape** on a roster of two
and three. No addition was needed and none was made; the previous two landscapes in this lane both
added rows and both had to argue for them. Each bet is drawn from that company's **own** strategy
read and is **analysis, not fact**; the risk column is the file's own, not this module's.

| Player | Arrived from / role | The bet, and what its own file says about the risk |
|---|---|---|
| **FlexGen** | incumbent, from hardware integration | **Be the controls layer on everybody else's hardware, and inherit the fleets when integrators fail.** Its file assesses at high confidence that it deliberately exited the hardware lane and reads its absence from Wood Mackenzie's top ten as confirmation. **Risk, in its own words:** it is private, and the headline scale claims — #2 US provider, ~80 % Texas share — are **2022 company statements**, flagged at low confidence as unverified until updated. |
| **Stem** | incumbent, from solar asset-performance management | **Become the hardware-agnostic application layer for a multi-vendor fleet, and let the hardware line die.** The software core grew while total revenue fell two-thirds. **Risk, in its own words:** ARR has stalled at the moment the pivot was supposed to pay — 15.7 % growth in FY2025, then ~2 % sequentially twice — against year-end guidance of USD 65–70m; and the binding constraint is a USD 270.0m stockholders' deficit rather than the product. |
| **Fluence** | challenger, from AC-block hardware | **Sell the bidding and asset-performance layers beyond its own hardware, and let the digital line become the recurring business under a lumpy one.** USD 148m of digital and recurring ARR at FY2025-end against a USD 180m FY2026 target. **Risk, in its own words:** the binding constraint is execution of the new manufacturing footprint, not demand — the FY2025 tariff-driven guidance collapse is what a supply-chain slip does to this company. |
| **Habitat Energy** | challenger, pure-play | **Sell the route to market, not software** — the registration, the forecast, the bid and the desk, on a share of what the battery earns. Its file assesses at high confidence that this is why owners who could buy software keep buying the service. **Risk, in its own words:** the floors, tolls and swaps that answer the tolling wave **raise balance-sheet risk** — a revenue-share optimiser carries no market risk and a floor originator does — and no source quantifies the book. |
| **Gridmatic** | challenger, pure-play | **Monetise one forecasting engine three ways** — proprietary trading, fund-backed tolling and floors, and a retail book for flexible load — using the fund rather than venture equity to finance the last two. **Risk, in its own words:** the offtake business is **smaller than its rhetoric** (about 200 MW named against a 500 MW fund target), and the retail book is where growth and risk now sit, with collateral posting named as a new hire's first responsibility. |

## 6. The indicators

What to watch, dated **only where the record dates it**. This segment's policy fence is large — 71
entries across twenty members — and contributes **nothing** to the timing, because every future
day-level date in it belongs to an adjacent member's business in another segment (§10). So every
dated row below is a corporate or reporting event, and a row the record leaves open is marked
undated rather than given a plausible quarter.

| Indicator | Dated | Whose | Why it moves this landscape |
|---|---|---|---|
| **Whether Habitat Energy's sale completes, and to whom** | **undated** | Quinbrook / Habitat | The segment's only independently top-ranked optimiser is for sale with no outcome on the record since March 2026. A Companies House PSC filing shows it before any release, and the buyer decides whether the segment's leading independent stays independent. |
| **Habitat's FY2025 accounts at Companies House** | **due 30 September 2026** | Habitat Energy Limited | The only audited view of an independently-ranked optimiser. **Treat the date as a deadline rather than an event**: the FY2024 accounts, for a year ended 31 December 2024, were filed on **4 January 2026** — more than twelve months after the year end. §10 is why this date is not this module's review clock. |
| **Whether Stem's ARR reaches its own USD 65–70m year-end guide** | **Q4 2026 result** | Stem | Two consecutive quarters of ~2 % sequential growth do not reach it. ARR is the measure on which the segment's fleet-scale incumbent is an incumbent of anything at all. |
| **Whether Fluence's digital and recurring ARR reaches USD 180m** | **FY2026, ended 30 September 2026** | Fluence | If it does, the challenger's software line is roughly three times the incumbent's entire ARR, and the word "incumbent" in this segment will be carrying even more weight on fleet scale alone. |
| **Modo's and Amperical's full-year 2026 ERCOT tables** | **undated — monthly and annual** | Modo Energy, Amperical | The only independent performance measures this segment has. Two free months disagree; a full year would say whether December 2025's lead was a regime-change effect or a durable edge. |
| **Whether Gridmatic raises the debt and equity its own postings anticipate** | **undated** | Gridmatic | The fund is what makes it an offtaker rather than only an optimiser. An outside round would also end the "without venture capital" framing its file records. |
| **Whether the ex-Powin fleet actually migrates to HybridOS, and what Europe books** | **undated** | FlexGen | The retrofit path is this segment's first buying criterion, and the Powin purchase is the largest test of it anyone has run. The company is private, so this shows up as customer announcements or not at all. |
| **Whether any of the nine uncovered parties in Modo's directory enters this corpus** | **undated** | the segment registry | Ascend Analytics, Caerus, CES, Equilibrium, GridBeyond, Intelligent Generation, Tenaska, Tierra Climate and Tyba have no dossier. Until one lands, §2's arithmetic stands as written. |

## 7. The seller's play — §10.10's two paths

**For the BESS seller: the software question decides who you are selling against, and you will get
it wrong if you ask it second.** Three lanes exist and the corpus names them: the **controls layer**
that runs the plant whoever built it, the **asset-performance layer** that reports on a fleet, and
the **route to market** — registration, forecast, bid and desk — sold on a share of revenue. Ask
which one the prospect has already bought before you position anything. A site on a vendor-bundled
EMS has a switching decision in front of it; a site on a hardware-agnostic controls layer has
already made it; a site with a third-party optimiser has an owner who has decided **not** to build
a desk, and Habitat's own file puts the threshold at about **2 GW** before in-house optimisation
pays.

**The orphaned-EMS conversation is the one with a named product behind it.** When an integrator
fails, the controls are stranded and somebody has to own them. FlexGen bought Powin's assets out of
bankruptcy for USD 36 million and sells EMS Retrofit as a product line. If your prospect's site runs
software from a vendor that no longer exists, that is not an objection to work around — it is the
segment's first buying criterion, written into the registry.

**For the AIDC-power seller, three things follow.**

**One: do not assume this segment sells into your build.** The clearest statement in the corpus is
Stem's, at high confidence: it has no data-centre product, contract or revenue, and any framing
placing it in the data-centre power trade is wrong. Fluence is the opposite — roughly **USD 850
million of data-centre orders through July 2026** and master supply agreements with two
hyperscalers — and Gridmatic's retail book was built explicitly on data-centre and miner load. The
segment does not have one posture towards your market; it has three.

**Two: the certification question has no lesson behind it and two members have answers.** Buying
criterion four is cybersecurity certification — IEC 62443 and NERC CIP. Wartsila's dossier records
the **first IEC 62443 certification in the industry**; Prevalon's records **IEC 62443-4-1** on
insightOS; FlexGen's own file notes it publishes **no** certification list. Nothing in the
curriculum teaches this criterion (§A2), so there is no shared vocabulary to fall back on and the
answer has to come from the vendor.

**Three: price the desk, not the licence.** The two pure-plays in this segment do not sell software
at a price; they take a percentage of what the asset earns, or they take the asset's merchant risk
outright on a toll or a floor. If your commercial model assumes a per-site software licence, it is
calibrated to the vendor-bundled arms, which is sixteen of the twenty members and **none** of the
two companies whose whole business this is.

**For both: open with what is not known.** The measurement at the top of this module — four named
third parties publish six measurements near this segment and not one of them ranks it — is the most useful
sentence in it. The one source that would settle it is paywalled; the one that lists everybody is
written by everybody. A seller who says that out loud, early, is a seller the buyer trusts with the
next claim.

## 8. Claims ledger

**Provenance:** corpus synthesis over the segment's twenty member dossiers at the versions below;
no ingested document, no new research. Every load-bearing claim above traces to a dossier field, to
the segment registry, or to the relationship graph. Dossiers already cite their own sources, so
this ledger cites dossiers — a claim whose only support is this module is an opinion and is written
as one in the prose.

| Claim | Source |
|---|---|
| Segment holds 20 members — 2 incumbents, 3 challengers, 15 adjacent; chain position 18, tier services; five buying criteria | `profiler-segments.json` — `segments[].members[]`, `.position`, `.tier`, `.buyingCriteria` |
| 75.0 % adjacent is the highest share of all nineteen segments; next is clean-firm-and-nuclear at 68.8 % | `profiler-segments.json` — computed over `segments[].members[].role` for all nineteen |
| 16 members are typed on `productsAndServices`, 3 on `ecosystemRole`, 1 on the registry tagline | `profiler-segments.json` — `segments[].members[].basis`, counted |
| Both incumbents reach the segment from an adjacent business; the pure-play optimisers are private; the landscape hold was released 2026-09-12 | `profiler-segments.json` — `segments[].notes` |
| No third party reachable in the research ranks storage bidding except Modo, whose 2025 directory does not quantify Stem; Wood Mackenzie's *Global BESS software landscape 2026* is paywalled | `profiler-segments.json` — `segments[].notes` |
| FlexGen: software-first integrator, HybridOS, 25+ GWh across 200+ systems under software and services, hardware-agnostic site controls | profile:flexgen @ v7 — `ecosystemRole`; registry tagline |
| FlexGen: Powin asset purchase USD 36m stalking-horse (Aug 2025), Clean Energy Services (Apr 2026), European launch (Jun 2026) | profile:flexgen @ v7 — `summary`, `recentDevelopments` |
| FlexGen: 65+ hardware configurations from 22 vendors over 15 years; EMS Retrofit product; sold with no battery attached | profile:flexgen @ v7 — `productsAndServices` › HybridOS, HybridOS Analyze, EMS Retrofit |
| FlexGen: deliberate exit from the hardware lane; absence from Wood Mackenzie's top ten read as confirmation, at high confidence | profile:flexgen @ v7 — `strategyRead[0]`; `recentDevelopments[0]` |
| FlexGen: #2 US provider and ~80 % Texas share are 2022 company claims, flagged unverified at low confidence | profile:flexgen @ v7 — `strategyRead[3]`, `ecosystemRole` |
| FlexGen: no published cybersecurity certification list (IEC 62443 / NERC CIP not documented) | profile:flexgen @ v7 — `productsAndServices` › HybridOS Control BMS, `positioning` |
| Stem: every other software position in the segment except FlexGen is a division of something else — seven vendors named | profile:stem @ v1 — `ecosystemRole` |
| Stem: 38.3 GW solar and 1.8 GWh storage under management at 2026-06-30; USD 62.4m ARR; storage flat at 1.7–1.8 GWh for two years | profile:stem @ v1 — `productsAndServices` › PowerTrack Software; `strategyRead[1]`, `[3]` |
| Stem: revenue 461.5 → 156.3 while hardware resale 360.2 → 31.3 → 14.8 → 0.3; software core 76.0 → 111.2; margin −8 % → 38 %; adj. EBITDA +6.7m then +8.2m | profile:stem @ v1 — `summary`; `strategyRead[0]` |
| Stem: USD 270.0m stockholders' deficit, ~USD 347m debt principal, no going-concern qualification in the Q2 2026 10-Q | profile:stem @ v1 — `strategyRead[4]`; `summary` |
| Stem: not a data-centre story — no product, contract or revenue; one exploratory sentence on the Q1 2026 call, not repeated | profile:stem @ v1 — `strategyRead[5]` |
| Stem: only third-party rank is Guidehouse Insights' August 2022 first place for AlsoEnergy in Solar and Storage Monitoring and Control | profile:stem @ v1 — `strategyRead[1]`; `recentDevelopments[2]` |
| Modo's April 2025 directory lists seventeen US optimizers, quantifies Habitat, Gridmatic, Equilibrium, Tesla, Tierra and Caerus, and lists Stem in capability-only language | profile:stem @ v1 — `relationships` › tesla, `strategyRead[1]` |
| Fluence: Mosaic and Nispera sold beyond its own hardware; #7 in Wood Mackenzie's July 2026 integrator ranking; 6.8 GW cumulative; USD 6.4bn backlog | profile:fluence @ v9 — `ecosystemRole`; registry `basis` |
| Fluence: 17 GW optimised or contracted through Mosaic at 2025-12-31; digital and recurring ARR USD 148m at FY2025-end against a USD 180m FY2026 target; FY ends 30 September | profile:fluence @ v9 — `productsAndServices` › Mosaic, Fluence OS & Fluence IQ; `financials.periods[]` |
| Fluence: ~USD 850m of data-centre orders through July 2026 and master supply agreements with two hyperscalers; execution of the manufacturing footprint is the binding constraint | profile:fluence @ v9 — `strategyRead[1]`, `[2]` |
| Habitat: EVOLVE bundles forecasting, automated bidding and a 24/7 desk with BM Virtual Lead Party, ERCOT Level 4 QSE and NEM registrations, sold mainly on revenue share; 5.5 GW under contract (June 2026, company-stated) | profile:habitat-energy @ v1 — `summary`; `productsAndServices` › EVOLVE |
| Habitat: third in Great Britain at 600 MW, January 2025, behind EDF 750 MW and Tesla 680 MW (Modo via Tamarindo); first among ERCOT optimisers December 2025 at 84 % capture against a 35 % median; April 2026's table led by Aypa without naming Habitat | profile:habitat-energy @ v1 — `productsAndServices[0].highlights[0]`; `recentDevelopments[4]` |
| Habitat: Modo's monthly rankings paywalled beyond two months, which point in different directions; the company's own August 2025 insight argues leaderboards are noisy | profile:habitat-energy @ v1 — `technicalSpecs[2].notes` |
| Habitat: FY2024 UK turnover GBP 1.99m, loss after tax GBP 5.0m, net liabilities GBP 12.7m, GBP 37.2m owed to group, 57 average employees; group optimisation line GBP 4.17m, +80 % | profile:habitat-energy @ v1 — `financials.periods[0].metrics[]` |
| Habitat: FY2024 accounts for the year ended 31 December 2024 were filed 4 January 2026; FY2025 accounts due by 30 September 2026 | profile:habitat-energy @ v1 — `financials.periods[0].metrics[0].result`; `strategyRead[6]` |
| Habitat: Quinbrook engaged JLL and BCG in March 2026; Flexitricity sold to Drax for GBP 36m ten weeks earlier; no outcome on the record at 2026-09-12 | profile:habitat-energy @ v1 — `summary`; `strategyRead[1]` |
| Habitat: about 2 GW is the stated threshold before in-house optimisation pays | profile:habitat-energy @ v1 — `strategyRead[0]` |
| Gridmatic: USD 50m fund behind tolling and revenue-floor offtake plus the QSE seat, and a retail book on the same forecasts; Cross Trails 57 MW/114 MWh ten-year floor, Caballero 100 MW/400 MWh CAISO, Endurance Park 52 MW | profile:gridmatic @ v1 — `summary`; `ecosystemRole`; `strategyRead[0]` |
| Gridmatic: Amperical's ERCOT settlement leaderboard, January–July 2026, 308 resources, places Endurance Park 11th at USD 3.49/kW-month and Cross Trails 43rd | profile:gridmatic @ v1 — `productsAndServices[0].highlights[0]`; `technicalSpecs[2]` |
| Gridmatic: every scale claim is its own; the Modo directory entry is self-written; the offtake book is ~200 MW named against a 500 MW fund target | profile:gridmatic @ v1 — `ecosystemRole`; `productsAndServices[0].highlights[4]`; `strategyRead[3]` |
| Gridmatic: August 2026 postings reference upcoming debt and equity raises; collateral posting named as a capital-markets hire's first responsibility | profile:gridmatic @ v1 — `strategyRead[1]`, `[4]` |
| Wartsila records the first IEC 62443 certification in the industry; Prevalon records IEC 62443-4-1 on insightOS | `profiler-segments.json` — `members[].basis` for wartsila and prevalon; profile:wartsila @ v7, profile:prevalon @ v5 |
| The seven vendor-bundled products Stem names are each confirmed in that vendor's own dossier | profile:fluence @ v9, profile:wartsila @ v7, profile:tesla @ v7, profile:canadian-solar @ v4, profile:prevalon @ v5, profile:rolls-royce-power-systems @ v1, profile:schneider-electric @ v9 — term counts in each file |
| 38 external memberships, all upstream; 15 of 15 bench members ranked higher elsewhere; 4 of 5 ranked members' memberships demote them; habitat-energy belongs to no other segment | `profiler-segments.json` — computed across all nineteen `segments[].members[]` |
| 34 of 190 member pairs connected, 37 typings, 30 `competitor`; 9 of the 30 are between two ranked members; flexgen ↔ habitat-energy and flexgen ↔ gridmatic are the two missing ranked pairs | `relationships[]` across the twenty member dossiers at the versions in this ledger |
| Eight of the twenty dossiers are at profileVersion 1; the spread runs v1 to v9 | the twenty `*.profile.json` files — `profileVersion` |

**Profile versions used:** flexgen v7 · stem v1 · fluence v9 · habitat-energy v1 · gridmatic v1 ·
tesla v7 · wartsila v7 · hunt-energy-network v3 · enchanted-rock v4 · engie-north-america v2 ·
nrg-energy v1 · schneider-electric v9 · zhonhen v8 · form-energy v1 · dnv v1 · prevalon v5 ·
canadian-solar v4 · rolls-royce-power-systems v1 · hyperstrong v4 · ul-solutions v1.

## 9. What the record does NOT say

**No source ranks this segment, and six near-misses from four named parties is a different problem
from none.** §2e sets out all six. The one that covers the segment's own business best is vendor-written; the one the
corpus covers completely measures AC-block hardware; a third measures contracted megawatts in Great
Britain; the two independent performance measures are a single month and a per-asset revenue table;
the sixth is four years old and about solar. **Wood
Mackenzie's *Global BESS software landscape 2026* would settle it and is paywalled.** Nothing in
this module converts any of them into a share, and a reader who wants one is being asked to accept
that it does not exist.

**Modo's April 2025 directory quantifies six entries and declines to quantify one of this segment's
two incumbents.** It records Tesla's Autobidder as number one in Modo's ERCOT rankings for 2022 and
2023, gives quantified performance for Habitat, Gridmatic, Equilibrium, Tesla, Tierra and Caerus,
and lists **Stem in capability-only language**. A census that quantifies six and not the seventh is
saying something; what it is saying is not on the record.

**Nine of the sixteen parties named in that directory have no dossier here** — Ascend Analytics,
Caerus, CES, Equilibrium, GridBeyond, Intelligent Generation, Tenaska, Tierra Climate and Tyba. And
in the Great Britain table the corpus covers **two of ten**: the leader, **EDF at 750 MW, is
uncovered**, as are Statkraft, Arenko, Shell, SMS, Flexitricity, Centrica and Conrad. In the ERCOT
monthly table, **April 2026's leader, Aypa, is uncovered.** In every case the corpus holds the
number only because a covered member reports it.

**The two members that do the adjacent halves of one job are not connected.** `flexgen` sells the
controls layer on the asset; `habitat-energy` and `gridmatic` sell the desk that bids the same
asset. Eight of the ten possible pairs among the five ranked members carry an edge and **the two
that do not are both FlexGen ↔ a pure-play optimiser** — not competitor, not partner, not supplier.
Stem connects to both. The silence is stated here rather than explained.

**No member publishes a revenue line for "storage optimisation software" as such.** Stem's USD
62.4m is whole-company ARR across solar and storage; Fluence's USD 148m is a digital and recurring
line inside a hardware business; Habitat's audited GBP 4.17m is a three-country optimisation-fee
line inside a fund's group accounts; FlexGen is private and publishes nothing; Gridmatic publishes
no financial statements at all. **Four different definitions and one silence — so the segment cannot
be sized, only described.**

**Every performance claim by the two pure-plays is either the company's own or a single month.**
Gridmatic's "most profitable participant in ERCOT's wholesale market", "#1 trader in the ERCOT
day-ahead market" and "300 MW / 1 GWh under management" are all self-asserted, and its own file
records that the figure is stated on three different bases. Habitat's "87 % of achievable revenues"
and the LCP Enact leaderboard claim are company deck material, and **the LCP table itself was not
located**. What is independent is: two Modo months that disagree, one Great Britain share table,
and Amperical's 11th and 43rd of 308.

**The evidence base is unevenly deep and the depth runs against the ranking.** Eight of the twenty
dossiers are at **profileVersion 1**, and they include **Stem — an incumbent — and both pure-play
challengers**. The two deepest files in the segment, at v9, are Fluence and Schneider Electric: one
challenger and one bench member. The corpus knows the companies that arrived sideways better than
the companies that are actually in this business, which is a direct consequence of the pure-plays
having landed on 2026-09-12, five days before this module was written.

**Two of the twenty have no named software product in their own file under the name the registry
uses.** Zhonhen's basis points to "power digitalization software (Beijing Zhonhen Borui)" and
HyperStrong's to an "AI operations stack (HyperStrong AI Platform, HyperGenie)" — both are confirmed
in the dossiers under those names, but neither company's file carries an EMS product line of the
kind the other eighteen do. They are on this roster for a software business that sits beside their
hardware incumbency elsewhere, not for one this corpus has examined.

**Nothing in the curriculum teaches this segment's fourth buying criterion.** Cybersecurity
certification — IEC 62443, NERC CIP — resolves to no lesson, and the reason is not a missing
mapping: the criterion's only lexicon hit is `certif` → `the-certification-stack`, which is about UL
9540 fire testing and is not mapped to this segment (§A2). The fifth criterion is worse: **no key in
the entire 27-entry lexicon fires on it at all.** The corpus has no vocabulary for fleet scale under
management or the scheduling-entity service behind it — which is, on the registry's own typing, the
basis on which one of this segment's two incumbents is an incumbent.

## 10. Freshness gate — the `reviewBy` judgment, resolved

**Result: `reviewBy` = 2027-03-17, the six-month default from `updated` = 2026-09-17.** Only the
**third** of seventeen landscapes to take the default — fourteen of the sixteen before it found a
dated gate — and the decision is written out below because the nearest candidate is thirteen days
away and was rejected on evidence rather than on scope.

### 10a. Both scans were run, and their in-horizon results are DISJOINT

§10.6 **(jj5)** says to run an ISO-date regex and a word-form scan because one finds dates the other
cannot see. On this segment the finding goes further: **neither scan is a superset of the other, and
inside the six-month horizon their results do not intersect at all.**

| Scan | Future day-level dates found | Inside the horizon (≤ 2027-03-17) |
|---|---|---|
| ISO `20\d\d-\d\d-\d\d` | **5** | **1** — `zhonhen` 2026-10-31 |
| Word-form (`30 September 2026`, `December 31, 2027`) | **13** | **2** — `habitat-energy` 2026-09-30; `hunt-energy-network` 2027-02-01 |

The ISO scan cannot see Habitat's 30 September 2026 and the word-form scan cannot see Zhonhen's
2026-10-31. **Taking either scan alone would have produced a different candidate set and possibly a
different review date.** Run both, every time.

A second, narrower result: scanning only `policyExposure[]` and `recentDevelopments` — the scope
§10.6 specifies — returns **0 ISO and 5 word-form**, and **none of the five is inside the horizon**.
The nearest candidate is only visible when the scan is widened to the whole dossier. The scope of a
scan matters as much as its form.

### 10b. Four rejections, in writing

1. **2026-09-30 — Habitat Energy's FY2025 accounts, due at Companies House.** The nearest candidate,
   thirteen days out, and a real gate on evidence this module leans on: §4b's audited GBP 1.99m
   turnover and GBP 12.7m net liabilities are FY2024 figures. **Rejected on the filer's own
   cadence.** Habitat's FY2024 accounts, for a year ended 31 December 2024, were filed on
   **4 January 2026** — more than twelve months after the year end. A review clock set on a deadline
   this filer has already run twelve months past would fire on a day the record predicts nothing
   lands. This is a **new rejection class**: not scope, not subject, not provenance, but the gate's
   own compliance history. The date is carried into **§6's indicators table**, which is where a date
   that matters but does not gate the module belongs.
2. **2026-10-31 — Zhonhen's Q3 2026 report, due at the CSRC deadline.** **Rejected on subject.** A
   quarterly-reporting deadline for an adjacent member whose relevance to this segment is a
   power-digitalisation line beside its power-conversion and in-hall-power incumbency. Nothing this
   module asserts about software and optimisation turns on it.
3. **2027-02-01 — Hunt Energy Network's Coyote Springs unit, planned in service per EIA.**
   **Rejected on subject.** Hunt is on this roster for TraDER, its QSE and optimisation platform. An
   oil-fired peaker's commercial operation date gates nothing about the optimiser business.
4. **Everything else — rejected on horizon.** The remaining ISO dates (`stem` 2028-12-01,
   2030-04-01, 2030-12-30 debt maturities; `ul-solutions` 2031-04-16 sunset) and word-form dates
   (`nrg-energy` 2027-05-31 and 2029-06-01; `rolls-royce-power-systems` 2027-11-14 and 2028-02-29
   executive contracts; `gridmatic` 2027-12-31 office lease; `stem` 2027-12-31 Section 48E solar
   cliff) all fall beyond 2027-03-17. Several are not gates at all — an office lease and two
   executive contracts are calendar facts, not events this module depends on.

### 10c. The policy fence contributes nothing, and that is worth saying

**71 policyExposure entries across twenty members** — a large fence, though only the seventh-largest
in the taxonomy, behind `storage-developers-and-ipps` at 142 — and **not one future day-level date
in it bears on this segment's business.** The fence is
large because the roster is large and fifteen of the twenty are ranked players in other segments
carrying those segments' policy exposure. A big fence with no relevant clock is the adjacency
problem once more, in the one instrument built to measure timing.

## 11. The Scraper interest seed

`topic-landscape-software-and-optimization`, added to `SCRAPER_INTEREST_TOPIC_SEEDS` in
`Scraper.gs`. **Every candidate was scored against both arrays before selection** — 282 terms in
`SCRAPER_INTEREST_TOPIC_SEEDS` and 249 in `SCRAPER_SEGMENT_SEEDS`, **506 distinct**.

**The zero rate was essentially total: 33 of 35 candidates scored zero against all 506.** That is
this corpus having almost no vocabulary for a segment it has carried since S0.

### 11a. The thirteen terms, and the balance they were chosen for

§10.6 **(ii9)** found the previous landscape's roster tilted toward the incumbent it exists to
measure. This segment has **two** incumbents whose vocabulary comes from **two different adjacent
businesses**, plus a merchant-desk vocabulary that belongs to neither. The seed is deliberately
spread across all three:

| Lane | Terms |
|---|---|
| Controls / EMS — FlexGen's vocabulary | `HybridOS`, `EMS retrofit`, `hardware-agnostic` |
| Asset performance — Stem's vocabulary | `PowerTrack`, `asset performance management` |
| The merchant desk — Habitat's and Gridmatic's | `QSE`, `capture rate`, `revenue floor`, `optimizers`, `optimisers` |
| The vendor-bundled rivals | `Autobidder`, `Nispera` |
| The criterion no lesson teaches | `IEC 62443` |

### 11b. Six drops, each with its ground

1. **`state of health`** — **EXACT** term already held by `topic-storage-degradation`. Taking it
   would broaden another topic's word.
2. **`tolling`** — **NEAR**: `topic-storage-offtake` holds `tolling agreement`. The bare form would
   widen an existing seed rather than add a new signal.
3. **`Mosaic`** — **ambiguity.** The Mosaic Company is a major listed fertiliser producer and
   *mosaic* is a common noun. The matcher's word-boundary guard does not help here, because the
   false positives are the standalone word.
4. **`GEMS`** — **ambiguity**, same shape: *gems* is an ordinary English word. Wartsila's platform is
   real and is named in §3a; it is simply not seedable as a bare token.
5. **`EMS`** (bare) — **ambiguity.** Emergency Medical Services, and the longer forms carry the
   meaning without the risk.
6. **`Qualified Scheduling Entity`** (long form) — **redundant** beside `QSE`, which the trade uses
   far more often and which is boundary-safe.

### 11c. An open item found while scoring: the matcher is blind to its own plurals

`scTermsHit_()` requires a non-alphanumeric character on **both** sides of a match — a guard that
exists so `ABB` does not fire inside `RABBIT`. The same guard means a singular term can never match
its own plural: `executive order` cannot fire on "executive orders", `tariff` cannot fire on
"tariffs", `interconnection` cannot fire on "interconnections".

Measured across the 506 distinct held terms: **447 of the 451 singular-form terms (99 %) have no
plural counterpart seeded**, and only **4** do. This is corpus-wide, pre-existing, and **not this
session's to fix** — an S2 session may only add `topic-landscape-<segment>`. It is recorded as open
item **(xiv)** for the developer.

It did change this seed: the segment's own class noun was seeded as **`optimizers` and `optimisers`
— both plurals, both spellings** — because the trade writes it as a class ("battery storage
optimizers and operators" is Modo's own title) and the matcher cannot stem. The singular forms are
knowingly foregone, which is a documented trade rather than an oversight.

No sheet row exists for a new key, so no `tv` marker applies and no existing seed's `terms` array
was edited. No outlet was added to `SCRAPER_SOURCE_ROSTER`.

## 12. Verification

- `node --check` on `.js` copies of `Classroom.gs` and `Scraper.gs`
- `scripts/check-gas-inner-scripts.js`
- `scripts/check-classroom-content.py` — pristine HEAD baseline captured **before** any edit at
  **0 errors / 0 warnings, 51 lessons / 8 tracks / 142 gate cases**, module assertion **25**; after,
  0/0 at 51 lessons with the assertion moved to **26** in the same commit
- `scripts/check-classroom-curriculum.py --strict` — no structural findings; the 28 stale pins and
  the four items due for review are pre-existing and none is this module's
- `scripts/check-classroom-pipeline.py --selftest` (13 fixtures, 0 failures) and `--base origin/main`
- `scripts/build-classroom-segments.py --check` before and after, with the forecast recorded first
- `scripts/check-readme-tree.py` after the version bumps
- Playwright render of the module at **contributor** with zero page errors, and **analyst denied at
  the server**
- Recount pass and screenshot pass, in that order, per §10.6 **(jj6)**

## Appendix A2 — the criterion table, measured against the generator rather than asserted

Running `build-classroom-segments.py`'s own `READ_NEXT` ∩ `CRITERION_LEXICON` test on this segment's
five buying criteria:

| # | Criterion | Resolves to | What happened |
|---|---|---|---|
| 1 | Hardware-agnostic control across vendors and the retrofit path off an orphaned EMS | `the-control-stack` | fires on `ems` and `control` |
| 2 | Forecast and bidding performance in the market the asset lives in | `the-control-stack` | fires on `forecast` |
| 3 | Warranty-aware dispatch — the cycle budget and state-of-health visibility | `the-control-stack` | fires on `dispatch`. Note that `cycle life` does **not** fire on "cycle budget" |
| 4 | Cybersecurity certification (IEC 62443, NERC CIP) | **—** | The lexicon **does** fire: `certif` → `the-certification-stack`, which is **built**. It is suppressed because that lesson is not in this segment's `READ_NEXT`. The eligibility gate is right on the merits — `the-certification-stack` is about UL 9540 fire testing, not cyber — and the effect is that a criterion with no lesson anywhere shows as a dash |
| 5 | Fleet scale under management and the QSE or scheduling-entity service behind it | **—** | **Not one key in the entire 27-entry lexicon fires, with eligibility ignored.** A true vocabulary void, and the only one of its kind measured on this segment |

**Three resolve, and all three resolve to the same lesson.** Seven of the nineteen segments have a
criterion table that points entirely at one lesson, and this one ties `epc-and-construction` and
`storage-developers-and-ipps` for the most rows resolved among them (three).

**`contracts-and-revenue` — one of only two lessons mapped to this segment — resolves no row.**
Across the taxonomy 33 mapped lessons are unreachable from their own segment's criterion table, so
the phenomenon is common; what is specific here is the **ratio**: one of two, on the joint-smallest
`READ_NEXT` in the taxonomy.

**The two dashes have different mechanisms**, which is why both are recorded. Row 4 is §10.6
**(ee4)**'s class inverted — the lexicon fires and eligibility suppresses it, correctly, onto an
absence. Row 5 is not an (ee4) case at all: the words simply do not exist in the lexicon. That
distinction matters to the developer, because row 4 is answered by writing a cyber lesson and row 5
is answered by adding a lexicon entry — two different fixes, and neither is this session's.

---

Developed by: LightAISolutions
