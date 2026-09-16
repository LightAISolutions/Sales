# Landscape — Clean Firm and Nuclear — Analysis & Module Source

**Module:** `landscape-clean-firm-and-nuclear-2026-09` · lane **The Value Chain** · tier **contributor**
**Provenance:** Corpus synthesis over the segment's 16 member dossiers at the versions in the claims ledger; no ingested document and no new research.
**Written:** 2026-09-16 (S2 session 10) · **Tenth landscape, nineteenth guidance module.**

## What this is

The source of truth for the tenth landscape module. It is a **corpus synthesis**: no document was ingested and no new research was run. Every claim traces to a member dossier at the profile version recorded in §8, and the dossiers carry the primary sources. The module JSON lives in `googleAppsScripts/Classroom/Classroom.gs` **below the `// CONTENT END` fence**, registered at the end of `guidanceDocs_()`'s The Value Chain lane.

The segment is **position 7** in the chain and tier **build**. It is the most adjacent-heavy segment any landscape has been written on — **eleven of sixteen members are adjacent** — and its registry `notes` is **empty**, so session 8's route to explaining a lopsided roster is not available. §3 is where that is resolved, and it is resolved by measurement rather than by assertion. §2 is where the curriculum split is resolved, and §2 was written first.

## The segment as measured

Re-measured from `profiler-segments.json` on **16 September 2026**, member for member, against the figure `INTEGRATED-REMEDIATION-PLAN.md` §7.35 carried. **They agree exactly: 16 members — 3 incumbent · 2 challenger · 11 adjacent.** This is the **tenth consecutive S2 session** to re-measure its own segment and confirm its brief. All sixteen carry a dossier — checked file by file — so every ledger row has a `profile:<slug>`.

| Role | Members |
|---|---|
| incumbent (3) | `constellation-energy` · `vistra` · `talen-energy` |
| challenger (2) | `oklo` · `x-energy` |
| adjacent (11) | `form-energy` · `fermi-america` · `nextera-energy-resources` · `southern-company` · `dominion-energy` · `entergy` · `xcel-energy` · `bechtel` · `kiewit` · `black-veatch` · `sargent-lundy` |

**The segment carries no `notes` field.** The explanation for the 69 % adjacent share had to be built from the members' own registry memberships, and it came out as a clean measurement — §3a.

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

| # | Section id | Kind | What it does |
|---|---|---|---|
| 1 | `who-dominates-and-on-what-basis` | prose | Three incumbents, three different answers to the same objection, and why the basis is not a ranking |
| 2 | `who-threatens` | prose | Two challengers, two licensing pathways, and a threat that is not share |
| 3 | `each-players-bet` | table | 5 rows — one per incumbent and challenger, in registry order, every row labelled analysis |
| 4 | `the-indicators` | table | Nine watch items, dated where the record dates them |
| 5 | `the-sellers-play` | callout | §10.10's two paths — the storage seller and the AIDC-power seller |
| 6 | `claims-ledger` | ledger | Every load-bearing claim → `profile:<slug>` at its `profileVersion` + the field |
| 7 | `what-the-record-does-not-say` | callout | Seven absences, each one stated by the dossier that has it |
| 8 | `drill` | flashcards | Eight cards |
| 9 | `check-yourself` | quiz | Five judgment questions at the group level |

## 1. Executive read

**Three sentences.** This is the only segment in the registry whose product is made almost entirely by companies whose main business is something else: **eleven of its sixteen members are adjacent here and ranked — incumbent or challenger — somewhere else**, eleven out of eleven, without exception. The three incumbents do not compete on a product; they sell the **same physical thing** (firm carbon-free megawatt-hours from an operating reactor fleet) under **three different answers to the same objection**, which is whether power that already existed counts as new. The two challengers are the segment's **only pure plays** — the only two of the sixteen that belong to no other segment — and neither has sold a megawatt-hour, so what they threaten is not share but the **price ladder's top rung** in about a decade.

**The judgment.** In this segment the licence is the schedule and the *contract* is the product. The incumbents' scarcity is not reactors — it is **uncontracted existing output**, and roughly 30 % of one incumbent's clean baseload is already spoken for. The gating variable for the next wave of deals is not capacity, not fuel and not price: it is a **rulebook still being written** at FERC, which all three incumbents' dossiers name as the origin case and which one of them filed the complaint that opened. The challengers are gated on something else entirely — a **licensing pathway choice** the two of them have made differently, and a fuel supply chain that is pre-commercial for both.


## 2. The split — EIGHT neighbours, and the line is drawn by a lesson that DOES NOT EXIST YET

*Written first, before any other section of this file and before a line of the module, per §10.6 (j).*

This segment has **eight** neighbours bearing on it: **four built landscape modules** (`landscape-utilities-2026-09`, `landscape-storage-developers-and-ipps-2026-09`, `landscape-aidc-developers-and-landlords-2026-09`, `landscape-cells-and-chemistry-2026-09`), **two registered guidance modules** (`utility-aidc-procurement-2026-08`, `large-load-interconnection-2026-09`), and **two public mechanism lessons in this segment's own `READ_NEXT`** — of which **one is built and one is not**.

**The organising fact, and the reason this split is unlike any of the nine before it: the curriculum has already assigned this segment's physics to a lesson that has not been written.** `contracts-and-revenue` — Phase 4 row 11, public, built, and stamped on all three of this segment's incumbents — carries a section called `clean-firm-and-the-restart` whose opening sentence is a handoff:

> *"This section is the **instrument** view of clean power: what the contracts are, who signs them and what each one proves. The physics — why a reactor follows load badly, what a small modular reactor changes, what* clean firm *admits — belongs to* Clean Firm Power *in the campus track, and is deliberately not repeated here."*

`clean-firm-power` is **§7 row 16 and unbuilt**. So a built public lesson has pre-declared a handoff **to a lesson that does not exist**, and the material it declined is sitting in nobody's hands. That is the gap, and naming it rather than filling it is the whole of this module's discipline. **A landscape that starts teaching a criterion because nobody else does stops being a landscape** (session 8's (y3)) — and here the temptation is at its strongest, because the missing lesson is the *nuclear* lesson and this is the *nuclear* segment.

**A second §7.35 measurement that did not survive the check.** The brief says *"four of the six buying criteria (licensing path, the price ladder, capacity factor and firmness, HALEU supply) have no built owner at all."* Run against the generator, the count is different and worse: `what-is-bought-and-on-what` prints a **dash against five** — the licensing path, capacity factor and firmness, fuel security, additionality and the sponsor's balance sheet — and the **sixth** (the price ladder) points at `clean-firm-power`, which is unbuilt. So **five of six have no owner at all and six of six have no *built* owner.** The module states the measured figure, not the brief's.

### 2a. The three-way split, one party of which has not been born

| Owns | Who | Built? |
|---|---|---|
| The **instruments** of clean firm — hourly matching, the corporate PPA, additionality, the uprate, the restart, the green tariff | `contracts-and-revenue` (public, analyst-visible) | **yes** |
| The **physics** — why a reactor follows load badly, what an SMR changes, what *clean firm* admits | `clean-firm-power` (public, campus track) | **NO — §7 row 16** |
| The **parties** — who dominates and on what basis, who threatens and on which route, each player's bet | **this module** (contributor) | this commit |

The module therefore:

- **Does not restate the instruments.** No definition of hourly matching, of a virtual PPA, of additionality, of a green tariff, of what a restart is. Those are `contracts-and-revenue`'s, taught vendor-blind and public, and the module's own opening says so by name.
- **Does not teach the physics.** No reactor-type tutorial, no capacity-factor derivation, no load-following explanation, no HALEU chemistry. That is `clean-firm-power`'s, and the module says out loud that it is unbuilt so the reader knows where the gap is rather than mistaking this module for the answer.
- **Does say who sits where.** Which of the three incumbents sells which instrument, which of the two challengers is on which licensing pathway, and why eleven of sixteen members are adjacent.

### 2b. §7.23's test — the one number both cite, doing a different job in each

The shared number is **the uprate attached to a supply agreement**. `contracts-and-revenue` uses it as an *arithmetic worked example* of additionality: *"A 433 MW uprate programme attached to a 2,609 MW supply agreement is the seller buying an answer to the additionality question and the buyer paying for it — read that pairing whenever you see an uprate appear inside a power deal."* It names nobody.

This module uses the same pairing as a **position marker**: it is Vistra's, it is what distinguishes Vistra's PJM book from Talen's Susquehanna book and from Constellation's Crane restart, and it sorts the three incumbents into three different answers to the same objection. Same number; a *test* there, a *sorting mechanism* here. §7.23's test holds.

### 2c. The second pre-declaration — §10.6 (t), on a tile, for the seventh time

`the-campus-as-a-power-project` — the one **built** entry in this segment's `READ_NEXT` — carries a tile reading **0 league tables** *("no ranking of these landlords exists in this corpus and this lesson does not invent one; the lifecycle is the transferable thing and the projects are only the evidence for it")*, and its `who-is-in-the-room` section names *"the power partner"* as a role rather than a company: *"a utility, a microgrid operator …, a fuel-cell supplier …, or a merchant generator selling powered land."* Read in full before drafting. It declines the ranking; this module supplies it — for the generators, not for the landlords.

### 2d. The omissions, enumerated so a later revision cannot import them

Written down per session 5's (n), because a split that is not enumerated collapses at the first refresh. **Twenty-two** across the eight neighbours.

**`contracts-and-revenue` (public, built) owns — 7:** hourly vs annual matching and what each buys · the corporate/virtual PPA and the strike-price settlement · additionality as the quality test · the uprate as the middle answer · what a restart physically involves and the interconnection-rights inheritance · the green tariff in a regulated territory · the eleven-instrument table and the price of a tenant's credit.

**`clean-firm-power` (public, UNBUILT) is assigned — 4:** why a reactor follows load badly · what an SMR changes · what *clean firm* admits as a category · the licensing path as a physical schedule. **Nobody holds these today.** The module states the gap and points at the planned lesson.

**`the-campus-as-a-power-project` (public, built) owns — 4:** the three clocks · the five-rung ladder and which rung a figure was counted at · the four-parties-one-lease structure · the five campus failure modes including the co-location curtailment trade.

**`landscape-utilities-2026-09` owns — 3:** the regulated franchise's instrument, the disintermediation routes, and the four utilities' rate-case machinery. Four of this segment's adjacents are that module's incumbents.

**`landscape-storage-developers-and-ipps-2026-09` owns — 2:** the IPP's development pipeline and the merchant-versus-contracted ownership split. Two of this segment's incumbents are that module's incumbents too.

**`utility-aidc-procurement-2026-08` and `large-load-interconnection-2026-09` own — 2:** the tariff terms and the buyer map; the rulebook above the fence, including the FERC co-location docket's *procedure*. This module takes only the docket's *effect on who can sell what*.

### 2e. Why the split matters more here than a subject boundary

Three of the eight neighbours are **public** and this module is **contributor**. Material drifting from the module into `contracts-and-revenue`'s or `the-campus-as-a-power-project`'s territory is material an analyst can already read — a restatement, not a leak. Material drifting the other way is a gate raised on something already public. Session 6's (s) line holds and sharpens: **the lesson teaches the test, the module applies it to named parties** — except that here one of the two lessons that should teach the test has not been written, so the module's third posture is **to say the test is unowned and decline to own it**.

## 3. Who dominates, and on what basis — three incumbents, three answers to one objection

### 3a. First, the shape — and it is a measurement, not a story

The registry's `notes` is empty, so the 69 % adjacent share had to be explained from the members' own memberships. Cross-referencing all nineteen segments gives an unusually clean answer:

> **Eleven of the eleven adjacents are ranked — incumbent or challenger — in another segment. Eleven out of eleven, no exceptions.**

| Adjacent here | Ranked there |
|---|---|
| `southern-company` · `dominion-energy` · `entergy` · `xcel-energy` | **incumbent** in `utilities` |
| `bechtel` · `kiewit` · `black-veatch` | **incumbent** in `epc-and-construction` |
| `sargent-lundy` | **incumbent** in `assurance` |
| `nextera-energy-resources` | **incumbent** in `storage-developers-and-ipps` |
| `form-energy` | **challenger** in `cells-and-chemistry` |
| `fermi-america` | **challenger** in `aidc-developers-and-landlords` |

And the converse is just as clean: **the two challengers are the segment's only pure plays** — `oklo` and `x-energy` are the only two of the sixteen that belong to **no** other segment. Every one of the three incumbents is ranked elsewhere too (`constellation-energy` adjacent in developers-and-IPPs; `vistra` incumbent there and challenger in `utilities`; `talen-energy` incumbent there and adjacent in landlords).

**So the shape is not a gap in the roster — it is the product.** Firm carbon-free power is sold by people whose main business is something else (a regulated franchise, an EPC, an engineering firm, a renewables IPP, a battery maker, a landlord), plus two companies that exist only to sell it and have never sold any. That is the segment in one sentence, and it is the thing a seller most needs to know before walking into the room.

**The inversion instrument, advanced.** Across seven neighbouring segments there are **19 shared memberships and 14 inversions — 74 %**, the highest rate any landscape has measured. But the finding is not the rate: it is that the direction is **uniform**. Session 8's (y1) found direction depending on which side of the chain a neighbour sits; session 9's (z3) found a bimodal rate measuring whether a business crosses or straddles a boundary. Here there is **no bimodality and no dependence on position**: every adjacent is demoted *into* this segment from a higher rank elsewhere, because this segment is a **product line** rather than a chain position. **The new instrument: when a segment's adjacents are 100 % ranked elsewhere, the segment is a product that other industries make, not a layer other industries sell into.**

### 3b. The three incumbents, and why the basis is not a ranking

No ranked table of clean-firm sellers exists in this corpus and this module does not invent one. What the record supports is a statement of **what each incumbent's dominance rests on**, and the three rest on three non-comparable things:

- **`constellation-energy` — price-setting.** Its own dossier's `ecosystemRole` calls it *the price-setter for firm carbon-free power in the AI buildout*, and the basis is an analyst-estimated ladder its deals created: **~$112/MWh** for restart nuclear, **~$70/MWh** for existing-reactor output, and a management-stated **$20–50/MWh** premium band. **None of those prices is company-disclosed.** ~22 GW across 15 sites, 94.7 % uptime in 2025, and roughly **30 % of clean baseload under long-term contract**. It also filed the FERC complaint that produced the December 2025 co-location order — the only member that moved the rulebook itself.
- **`vistra` — the uprate answer, and an integrated book behind it.** 6,448 MW across six units at four sites, of which roughly **3.8 GW is sold to Amazon and Meta on twenty-year agreements**. What distinguishes it is the **433 MW uprate programme inside the 2,609 MW Meta agreement** — additionality bought and paid for inside the deal — and a five-million-customer retail book that hedges the generation side mechanically. Its own dossier records that **not one signed large-load agreement exists at any of its gas plants**.
- **`talen-energy` — the precedent, lost and then won commercially.** 90 % of Susquehanna, 2,245 MW owned, 2025 output ~17 TWh at an all-in cost of about **$27/MWh**. FERC **rejected** the behind-the-meter structure on 1 November 2024; the up-to-1,920 MW Amazon arrangement that replaced it runs **front-of-the-meter through a pre-existing Pennsylvania retail supplier licence and needed no FERC approval at all**. The whole FERC record now governing co-location traces back to that docket.

**The honest note the module carries:** three incumbents rated on a price ladder nobody disclosed, a contracted share, and a docket outcome are three different kinds of evidence. C8 applies — the basis is stated per company rather than blended into a rank.

## 4. Who threatens — two challengers, two pathways, and a threat that is not share

The bench is two names, the joint second-smallest in the registry. Session 8's (y4) showed a thin bench is writable when the registry's `notes` explains it; **here `notes` is empty**, so the explanation is §3a's measurement: the bench is small because the segment's challengers are the only companies in it that do nothing else.

**Neither has sold a megawatt-hour of power.** That is the fact the section is proportioned to, and it means the threat is **not displacement**. What the two challengers actually threaten is the **top rung of the price ladder in about a decade** — the restart and new-build column that the incumbents currently price alone.

**The route each is on is a *licensing pathway*, and the two chose differently — which is the segment's own criterion 1 stated as a strategy.**

- **`oklo` — the regulatory route.** Its dossier's own first judgment is that *the decisive strategic move was regulatory rather than technical*: routing first reactors onto the **DOE authorization pathway** created by Executive Order 14301 rather than waiting for an NRC licence. Its 2020 combined licence application was **denied without prejudice in January 2022** and no updated application had been submitted as of the 7 August 2026 filing. First Aurora (75 MWe, sodium-cooled) targeted **late 2027 to early 2028**. The customer book is *a pipeline of options rather than an order book* — not one definitive PPA appears anywhere in its public record, and the only binding commercial contract named is a turbine supply agreement.
- **`x-energy` — the licence route.** Part 50 construction permit for Dow's Long Mott under an **18-month NRC schedule** set consistent with EO 14300, final safety evaluation targeted **November 2026** and the permit guided to **Q1 2027**. Its own dossier's second judgment: *the order book is an options book, and the binding portion is four reactors* — roughly 11.5 GWe *assuming full customer exercise of contingent rights*, with Dow's four units the only project inside a construction permit application. First power has **slipped roughly four to six years** from the ARDP goal, to 2031–2033, and the dossier's read is that **the sponsor rather than the regulator is the pacing item**.

**The constraint that binds both, and it is not the reactor.** Both dossiers independently name **HALEU** as the binding external constraint: US enrichment is at pilot scale, DOE's first allocation round in April 2025 went to five developers, and both companies' commercial supply rests on pre-commercial counterparties. X-energy's own answer is initial cores on LEU with HALEU *for the second core and beyond*; Oklo's first core is a fixed **five metric tons of government-owned legacy EBR-II material**. **Criterion 4 is where the challenger half actually fails or does not.**

**One more thing the record shows and a reader would not guess:** the challengers are not the only new capacity. **Four of the eleven adjacents are building or restarting nuclear** — `fermi-america` (four AP1000s under the first large light-water COLA accepted since 2009), `nextera-energy-resources` (the Duane Arnold 615 MW restart, Q1 2029, on a 25-year Google PPA), `southern-company` (Vogtle 3 and 4 delivered, plus uprates) and `dominion-energy` (North Anna SMR development). **The segment's new capacity is coming mostly from its adjacents, not from its challengers** — which is the sharpest consequence of §3a's shape.

## 5. Each player's bet — the five

One row per incumbent and challenger in registry order, drawn from each dossier's `strategyRead[]` and labelled analysis. Five rows: the **shortest bets table in the corpus**, against session 3's twenty-seven — and honest, because three incumbents and two challengers is the entire ranked roster. Session 4's (m) rule: section proportions follow the segment, never the last module.

## 6. The indicators

Nine watch items. Where the record dates them the date is carried; where it does not, the row says so rather than inventing one.

## 7. The seller's play — §10.10's two paths

- **The storage seller.** The honest answer on this segment is mostly *no*, and the module says so: a nuclear PPA signed by a hyperscaler **reduces near-term appetite for firming storage at that load**, which is `constellation-energy`'s own dossier's statement, not an inference. The two places a storage seller does have a door are the **uprate-and-addition column** (storage beside a plant that already holds a connection is the one unambiguously additional addition) and the **multi-day alternative** (`form-energy` is in this segment precisely because its product is sold against the same *clean firm* line).
- **The AIDC-power seller.** The play is to read which of the three incumbent answers a counterparty is using, because it decides what else the campus still needs. A **grid-delivered PPA** leaves the whole on-site chain open. A **co-location** attaches the campus to a docket that is still being written. A **restart** puts the whole thing on a three-to-four-year clock with inherited interconnection rights — and the seller's window is that clock, not the reactor.

## 8. Claims ledger

Every load-bearing claim in the module → `profile:<slug>` at its `profileVersion`, plus the dossier field it rests on. **The dossiers carry the primary sources; the ledger cites the dossiers** (§10.6). In the module JSON the source column is written as **plain text** (`profile:vistra @ v3 — productsAndServices`) — backticks render literally through `clFmt`, which is finding (b) from session 1.

**Profile versions pinned this run**, read off each fetched `<slug>.profile.json`:

| Member | `profileVersion` | `lastUpdated` |
|---|---|---|
| `constellation-energy` | v5 | 2026-09-06 |
| `vistra` | v3 | 2026-09-06 |
| `talen-energy` | v2 | 2026-09-05 |
| `oklo` | v2 | 2026-09-05 |
| `x-energy` | v1 | 2026-09-05 |
| `form-energy` | v1 | 2026-09-06 |
| `fermi-america` | v1 | 2026-09-05 |
| `nextera-energy-resources` | v4 | 2026-09-05 |
| `southern-company` | v2 | 2026-09-05 |
| `dominion-energy` | v1 | 2026-09-03 |
| `entergy` | v2 | 2026-09-06 |
| `xcel-energy` | v4 | 2026-09-06 |
| `bechtel` | v4 | 2026-08-30 |
| `kiewit` | v7 | 2026-09-05 |
| `black-veatch` | v7 | 2026-09-05 |
| `sargent-lundy` | v2 | 2026-09-05 |

The module's ledger section carries **47 rows** at these versions. All sixteen members appear.

## 9. What the record does NOT say

Seven absences, each stated by the dossier that has it rather than asserted by this module:

1. **No ranked table of clean-firm sellers exists** in this corpus. `vistra`'s own dossier makes the general point in its own lane: *no independent, dated ranking … exists — Wood Mackenzie and ACP's US Energy Storage Monitor and the EIA both decline to publish one.* The module names three incumbents and declines to order them.
2. **No incumbent discloses a PPA price.** The whole ladder — ~$112, ~$70, the $20–50 premium band — is analyst-estimated or management-stated in aggregate. `constellation-energy`'s `strategyRead[0]` says so in terms: *none of the prices company-disclosed, all market-defining.*
3. **Neither challenger has a definitive power purchase agreement.** `oklo`'s `strategyRead[1]`: *not one definitive power purchase agreement appears anywhere in the company's public record.* `x-energy`'s `strategyRead[1]`: the binding portion of an 11.5 GWe book is **four reactors**.
4. **No Aurora has ever produced power**, and no Xe-100 has a construction permit. Both dossiers' summaries say so.
5. **No independent laboratory validation of iron-air at 100-hour duration exists** — `form-energy`'s own collection gap, and the reason the storage-firmed alternative is carried as a position rather than a proven product.
6. **`vistra` discloses storage in MW only** — no MWh figure in any filing — so every megawatt-hour figure in circulation for its fleet is third-party.
7. **Two members carry no `policyExposure` array at all** (`bechtel`, `black-veatch`), so the policy fence for the EPC half of this segment is a gap in the record rather than an absence of exposure.

## 10. Freshness gate — the `reviewBy` judgment, resolved

**`reviewBy` = 2026-12-31.** Read, not sorted, for the tenth consecutive session — and this segment produced a **new failure mode for the sort**, described below.

**What the sort returns.** Across all sixteen members there are **67 `policyExposure[]` entries, 49 of them dated, and exactly ONE in the future**: `dominion-energy`'s *Virginia large-load cost allocation (GS-5 …)* at **2027-01-01**. That is a Virginia data-centre **rate class** — squarely `landscape-utilities-2026-09`'s and `utility-aidc-procurement-2026-08`'s subject — and it is **already the `reviewBy` of four registered modules**. So the mechanical sort returns something, and what it returns would clock a clean-firm module on a utility tariff: session 9's (z4) trap in a new shape.

**The date taken** is read out of `fermi-america`'s **`policyExposure[0].exposure`** — an entry carrying **no `effectiveDate` at all**, the (x4) pattern — and corroborated four more times in the same dossier (`productsAndServices[3].description` and `.roadmap`, `technicalSpecs[1].specs[4]`, `strategyRead[6]`'s indicator list). On **31 December 2026** four of this segment's gates land at once on its only large light-water new-build applicant: the **Part 3 site-specific portion of the combined licence application**, the NRC's **final environmental impact statement** target, the credit facility's **approved-customer-agreement deadline**, and the **$9 million Texas Tech escrow**. The first two are criterion 1; the last two are criterion 6, and both are hard contractual obligations rather than targets.

**Rejections, in writing — eight:**

| Candidate | Why rejected |
|---|---|
| **2027-01-01** — Virginia GS-5 class (the only future `effectiveDate`) | Wrong lane (a utility rate class), **and** already four modules' `reviewBy` |
| **2026-09-29** — Entergy's Babel–Webre transmission hearing | A transmission-siting hearing, `utilities`' subject; also inside the 30-day horizon |
| **2026-09-30** — Fermi/TensorWave lease closing | The **nearest date in the whole fence** and the wrong gate: a neocloud tenant's lease-financing condition on a data-centre campus. Session 7's (x4) class |
| **2026-10-01** — Alabama SB 270 effective; Dominion's PPA RFP | Rejected twice over: already **two** modules' `reviewBy` ((r)/(u)), and a large-load tariff gate |
| **2026-10-07 / 10-29 / 11-03 / 11-04 / 11-17** — LPSC and PSC hearings, a PSC election, rate cases, the Dominion–NextEra merger hearing | All utility ratemaking, governance or M&A; none is a clean-firm gate |
| **November 2026** — X-energy's NRC final safety evaluation for Long Mott | Rejected twice over: it is a **tell rather than a gate** (an NRC *staff document* target, which the dossier itself frames as *confirming or reopening* a judgment — the permit is the gate), **and** converting the month to its last day lands on **2026-11-30**, already `nvidia-800vdc-2026-08`'s |
| **Q1 2027** — the Long Mott construction permit decision | The right gate and the best one, but quarter-level; its last day, **2027-03-31**, is already `grid-equipment-shortage-2026-09`'s |
| **2027-07-01** — Fermi's first 210 MW available | Right company, **wrong product line** — Fermi's first power is turbines, not the AP1000s. Session 7's truck-engine class |

**THE NEW FINDING.** This is the first segment where the two standing rejection classes — *month-level-only* and *already another module's day* — **intersect to exhaust the field**. Every genuinely on-subject gate here is either stated only to the month (X-energy's FSE, Entergy's Waterford 3 uprate, Crane's restart, Clinton's ZEC expiry) or falls on a day another module already holds. **2026-12-31 is therefore the third module to carry that calendar day** (`china-policy-stack-2026-08` and `landscape-bridge-and-on-site-generation-2026-09` hold it too). Session 9's (z5) permits a shared day when the alternative is fabrication; here the alternative was a *differently* shared day, which is not better. Recorded rather than quietly absorbed — and the module's own bell is different from both: a licensing filing deadline, not a tariff expiry and not a fuel-and-permit convergence.

**One arithmetic consequence, chosen knowingly:** 2026-12-31 sits **outside** this module's own 30-day horizon, so `check-classroom-curriculum.py` still reports **2 items due for review** (`landscape-utilities-2026-09` and `landscape-in-hall-power-2026-09`, both 2026-10-01, both by design) rather than 3.

## 11. The Scraper interest seed — asked from scratch, and ADDED

**The brief stated its prior as a prior** and told this session to score rather than trust it. Scored against **all 431 distinct terms across both seed arrays** (35 topic seeds + 29 segment seeds, 456 term entries), per session 3's (i) — every *term*, not every seed label.

**The answer is yes, and decisively.** A `seg-nuclear` seed already exists — but it carries **four generic words**: `nuclear`, `reactor`, `small modular reactor`, `uranium`. That is the broad technology band. **The segment's licensing, fuel and contracting vocabulary scores zero across all 431 terms** — which is criteria 1, 2 and 4 in their entirety. The label-level glance the rule forbids would have returned "covered".

**Thirteen terms seeded** as `topic-landscape-clean-firm-and-nuclear`:

`combined license` · `construction permit` · `DOE authorization` · `subsequent license renewal` (criterion 1) · `uprate` (criterion 3) · `clean firm` · `zero emission credit` · `45U` (criterion 2) · `HALEU` · `TRISO` · `fuel fabrication` (criterion 4) · `additionality` (criterion 5) · `AP1000` (the product class the SMR words miss).

**Dropped, with the ground:**

- **Superstrings of existing terms (9):** `reactor pilot program`, `nuclear restart`, `reactor restart`, `nuclear PPA`, `nuclear production tax credit`, `advanced reactor`, `microreactor`, `fast reactor`, `nuclear fuel` — each contains `reactor` or `nuclear`, both exact terms in `seg-nuclear`.
- **Already exact (4):** `co-location` and `behind-the-meter` (`topic-utility-procurement`), `co-located load` (`topic-federal-interconnection`), `iron-air` (`seg-bess-longduration`).
- **Too generic (6):** `capacity factor`, `baseload`, `license renewal`, `first-of-a-kind`, `carbon-free energy`, `enrichment` — each would band articles across the whole energy corpus. `capacity factor` is criterion 3's own phrase and the loss is recorded: `uprate` carries that criterion instead.
- **Company name (1):** `Centrus`.
- **Ambiguous token (3):** `SMR` (the abbreviation of an exact existing term), `ZEC`, `Part 53`.
- **Split grounds, per session 6's (v) (3):** `multi-day storage` and `long duration storage` belong to `seg-bess-longduration` — `form-energy` is adjacent *here* precisely because its centre of gravity is *there*; and **`front-of-the-meter`**, whose mirror `front-of-meter` already sits in `seg-bess-utility` and whose partner `behind-the-meter` sits in `topic-utility-procurement`. Seeding it here would band the same co-location articles into two topics and blur exactly the line §2 draws.
- **Not in the segment's record (1):** `early site permit` — a real instrument, but no member's dossier uses it, and a term is seeded because the record uses it.
- **Duplication with `seg-nuclear` (2):** `pebble bed`, `sodium-cooled` — per-vendor design resolution the topic band does not need.
- **Fragile match (2):** `24/7 carbon-free` (digits and a slash), `NRC licensing` (a wrapper for three instruments already seeded).

This touches `Scraper.gs`, so the **Scraper GAS version bumps too** ([PC-GS-VERSION] #1) and the merge diff carries **two** `.gs` files and therefore **two** deploy steps.

## 12. Verification

| Check | Result |
|---|---|
| `node --check` on a `.js` copy of `Classroom.gs` and `Scraper.gs` | recorded in the CHANGELOG |
| `node scripts/check-gas-inner-scripts.js` | recorded |
| `python3 scripts/check-classroom-content.py` | must return **0 errors / 0 warnings at 44 lessons / 8 tracks / 142 gate cases**, module assertion moved **18 → 19** |
| `python3 scripts/check-classroom-curriculum.py --strict` | no structural findings; 2 items due for review (pre-existing, by design) |
| `python3 scripts/check-classroom-pipeline.py --selftest` | 13 fixtures, 0 failures |
| `python3 scripts/check-classroom-pipeline.py --base origin/main` | **P1 and P2 expected and structural**; **no P3** (no `GATE_SYMBOLS` member moved, so `gateDigest` is deliberately untouched); P7 checked against the literal's own `updated` |
| `python3 scripts/build-classroom-segments.py --check` | **10 → 10 → 9** (the netting case — this segment was already due) |
| `python3 scripts/check-readme-tree.py` | after the version bumps |
| Playwright | contributor render of all nine sections, zero page errors; analyst `ROLE_DENIED` from the real serving path |

Developed by: LightAISolutions

