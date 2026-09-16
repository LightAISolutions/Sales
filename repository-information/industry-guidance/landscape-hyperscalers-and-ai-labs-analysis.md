# Landscape — Hyperscalers and AI Labs — Analysis & Module Source

**Module:** `landscape-hyperscalers-and-ai-labs-2026-09` · lane **The Value Chain** · tier **contributor**
**Provenance:** Corpus synthesis over the segment's 8 member dossiers at the versions in the claims ledger; no ingested document and no new research.
**Written:** 2026-09-16 (S2 session 11) · **Eleventh landscape, twentieth guidance module.**

## What this is

The source of truth for the eleventh landscape module. It is a **corpus synthesis**: no document was ingested and no new research was run. Every claim traces to a member dossier at the profile version recorded in §8, and the dossiers carry the primary sources. The module JSON lives in `googleAppsScripts/Classroom/Classroom.gs` **below the `// CONTENT END` fence**, registered at the end of `guidanceDocs_()`'s The Value Chain lane.

The segment is **position 13** in the chain and tier **demand**. It is the **smallest** segment any landscape has been written on — eight members against the previous smallest of fourteen — and the **first written on a closed segment**: zero adjacents, and not one of the eight belongs to any other segment. §2 is where the curriculum split is resolved, and §2 was written first.

## The segment as measured

Re-measured from `profiler-segments.json` on **16 September 2026**, member for member, against the figure `INTEGRATED-REMEDIATION-PLAN.md` §7.37 carried. **They agree exactly: 8 members — 5 incumbent · 3 challenger · 0 adjacent.** All eight carry a dossier and a study guide — checked file by file — so every ledger row has a `profile:<slug>`.

| Role | Members |
|---|---|
| incumbent (5) | `amazon` · `google` · `microsoft` · `meta` · `oracle` |
| challenger (3) | `openai` · `anthropic` · `xai` |
| adjacent (0) | *none* |

**The closure, measured across all nineteen segments rather than asserted.** Three segments carry zero adjacent members — `hyperscalers-and-ai-labs`, `neoclouds` and `insurance-and-risk-transfer`. Of those, only **two are closed**: zero adjacents *and* not one member belonging to any other segment. This is one, at **8 of 8 pure plays**; `insurance-and-risk-transfer` (3 members) is the other. `neoclouds` has no adjacents but only 3 of its 7 members are pure, so it is open.

**The segment carries no `notes` field.** §3a is where that is resolved, and it is resolved by measurement.

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

| # | Section id | Kind | What it does |
|---|---|---|---|
| 1 | `who-dominates-and-on-what-basis` | prose | Five incumbents who bought five different instruments for the same thing, and why that is not a ranking |
| 2 | `who-threatens` | prose | Three challengers who are not taking share because they *are* the demand — and the two directions the disintermediation runs |
| 3 | `each-players-bet` | table | 8 rows — one per incumbent and challenger, in registry order, every row labelled analysis |
| 4 | `the-indicators` | table | Eight watch items, dated where the record dates them |
| 5 | `the-sellers-play` | callout | §10.10's two paths — the storage seller and the AIDC-power seller |
| 6 | `claims-ledger` | ledger | Every load-bearing claim → `profile:<slug>` at its `profileVersion` + the field |
| 7 | `what-the-record-does-not-say` | callout | Seven absences, each one stated by the dossier that has it |
| 8 | `drill` | flashcards | Eight cards |
| 9 | `check-yourself` | quiz | Five judgment questions at the group level |

## 1. Executive read

**Three sentences.** This is the **chain's terminus** — the only segment other than `insurance-and-risk-transfer` whose members belong to nothing else, eight of eight pure plays with no adjacents, because no other business makes end demand as a sideline. Its five incumbents do **not** compete on one axis: each has bought a **different instrument** for the same thing — firm power at a date — and the instruments are not comparable, so a league table across them would be a fiction. Its three challengers are not taking share from the incumbents at all; they **are** the demand the incumbents' order books are made of, and the threat they carry runs in **two directions at once**.

**The judgment.** In this segment the role labels invert the money. Three challengers whose commitments *fund* five incumbents' backlogs — one incumbent's remaining performance obligations are press-attributed roughly half to a single challenger's contract — while the same challengers have, since mid-2026, begun signing twenty-year leases, buying generation and pledging to pay grid upgrades **in their own names**, which is what the incumbents were for. The binding constraint for all eight is not chips and not capital: it is **firm power at a date**, and the segment's most measurable fact is the **gap between commitment and delivery** — roughly 30 GW committed against roughly 0.3 GW operational at the largest challenger's flagship campus. That gap is what the module's review date watches.

## 2. The split — ELEVEN neighbours, and the closure disables two standing instruments

Eleven neighbours ties session 7's record. Scanned at v06.10r: the nineteen registered modules were searched for all eight members' names (`Amazon`/`AWS`, `Google`, `Microsoft`/`Azure`, `Meta`, `Oracle`, `OpenAI`, `Anthropic`, `xAI`), and so were all twenty-six hand-authored lessons.

| # | Neighbour | Kind | What it names | What it owns |
|---|---|---|---|---|
| 1 | `utility-aidc-procurement-2026-08` | module | Meta ×7, Google ×2 | The procurement process **from the utility's side** — the four moves, the tariff terms, the energy services agreement, the demand-response instrument, the buyer map |
| 2 | `nvidia-800vdc-2026-08` | module | Google ×4, Microsoft ×4 | The **reference architecture** — and therefore this segment's buying criterion 6 outright |
| 3 | `power-infra-aidc-2026-08` | module | Meta ×1 | The chain, and the ESA glossary entry |
| 4 | `landscape-aidc-developers-and-landlords-2026-09` | landscape | Microsoft ×1, xAI ×1 | **The landlords these companies lease from** — the segment directly beneath this one |
| 5 | `landscape-utilities-2026-09` | landscape | Meta ×1 | The franchise and its instrument |
| 6 | `landscape-storage-developers-and-ipps-2026-09` | landscape | Google ×1 | The developers who own the storage assets these buyers sign PPAs against |
| 7 | `reading-the-graph` | **public lesson — the lane opener** | Google ×15, Anthropic ×2 | How to read an edge — **worked on this segment's own credit-substitution chain** |
| 8 | `bridge-power` | **public lesson** | Oracle ×1, OpenAI ×1, xAI ×1 | The three ways out of a factory queue |
| 9 | `the-aidc-power-chain` | public lesson (`READ_NEXT`) | none | Service-to-rack, selective coordination, the UPS dial |
| 10 | `the-campus-as-a-power-project` | public lesson (`READ_NEXT`) | none | The campus lifecycle — **reads this segment's own campuses and names not one of its parties** |
| 11 | `utility-procurement-meets-ai-load` | `READ_NEXT`, **UNBUILT** | — | The gatekeeper. Nobody holds it |

**§10.6 (j)'s full form does not fire, and the measurement is why.** No module covers this segment's parties as parties. The three modules that name members name them as *evidence for something else*: a tariff proceeding, a joint architecture position, a glossary example. The three landscape neighbours name a member once each, in passing. So there is no module to split against on subject — but there are two neighbours close enough that the boundary has to be stated anyway, and one of them is the segment directly beneath this one in the chain.

### 2a. The boundary against the landlord landscape — session 4's direction, one position down the chain

`landscape-aidc-developers-and-landlords-2026-09` is the nearest neighbour and the line is one sentence: **that module owns who builds and leases the hall; this one owns who signs the lease and sets the capex.** It ranks thirty landlords on powered land, energised interconnections and the price of borrowed credit. This module ranks the eight companies whose signatures make that credit worth borrowing against. The landlord module carries **no capex figure for any tenant**, **no clean-energy portfolio**, **no nuclear contract** and **no compute commitment**; this module carries **no lease economics, no basis-point spread, no pre-leased share and no landlord ranking**.

### 2b. §7.23's test — the one number both cite, doing a different job in each

The shared number is **7.125 per cent**, the coupon on Cipher Mining's campus notes.

- In the landlord module it is a **price**: one rung on a four-rung credit ladder (6.125 % with an investment-grade parent guaranteeing rent directly · 6.192 % with a triple-B-minus rating behind a technology-company backstop · **7.125 %** a step further from the tenant · 9.875 % unrated with no enhancement disclosed), a spread of about 375 basis points that measures *what a tenant's credit is worth to a landlord*.
- In this module it is a **ruler**. Google's backstop at that campus is capped at USD 1.733 bn, which matches the 7.125 % notes almost exactly — as USD 3.2 bn matches TeraWulf's 7.750 % notes and USD 1.3 bn matches the Abernathy 7.250 % notes. The coupon is not a cost to Google at all; the *note it prices* is the thing the cap was sized to. That is the evidence for this module's judgment that **the backstops are debt-sized, not lease-sized** — the buyer wrote the instrument to what the lenders needed, not to the rent.

A price there, a measuring stick here. The test holds.

### 2c. THE CLOSURE DISABLES TWO STANDING INSTRUMENTS, AND THAT IS THE FINDING RATHER THAN A GAP

Two instruments earlier sessions built cannot be run on this segment, and both are disabled by the same property:

1. **Session 10's (aa2) adjacency instrument** — *when a segment's adjacents are 100 % ranked elsewhere, the segment is a PRODUCT other industries make rather than a LAYER other industries sell into* — is computed over adjacents. **There are none.** It returns nothing here, and no amount of care makes it return something.
2. **Session 7's (x2), session 8's (y1) and session 9's (z3) role-inversion instruments** — shared members carrying different roles in two landscapes, read for direction and for the straddle-versus-cross rate — need shared members. **There are none.** All eight are pure plays, so the overlap with every one of the ten built landscapes is exactly zero. This is the **first landscape-against-landscape pairing in the programme with no shared member at all.**

What the closure means instead is worth stating on its own terms rather than borrowed: **this segment is the chain's terminus.** It buys from every segment above it and sells into none of them. Nobody arrives here as an adjacent because there is no other business that makes this one as a sideline; nobody leaves because these companies' centre of gravity is nowhere else in the corpus. The two closed segments in the taxonomy are this one and `insurance-and-risk-transfer` — the end of the chain and the thing wrapped around it.

### 2d. §10.6 (t) fires, on the strongest pre-declaration in the corpus so far

`the-campus-as-a-power-project` (Phase 4 row 9, **public**, built) reads nine named campuses across six columns — and **Colossus, Frontier, Hyperion, Jupiter and Lighthouse are this segment's own projects**. It names not one of their parties. Its rows say *"One cloud company holds the lease; the AI lab behind the programme is the end user"* and *"It began as its own tenant and stopped being one. The first phase's whole capacity was later contracted to a rival lab, and a second lab signed a month after that."* Its fourth tile reads **"0 league tables — no ranking of these landlords exists in this corpus and this lesson does not invent one."**

So the mechanism curriculum reads this segment's own evidence and anonymises this segment's own companies, by construction, across a whole section. Session 9's (z1) found a public lesson reserving layer 4's job across four sections; this is a public lesson reserving it **on the landscape's own project list**. The line: **the lesson teaches how to read a campus announcement; the module says which company is which party in it, at what size, and on what the record dates.**

`reading-the-graph` — the Value Chain **lane opener**, public, the lesson every reader meets before any segment lesson — is a second and different pre-declaration. Its worked example is **this segment's credit-substitution chain**: Google backstopping Fluidstack's rent at Hut 8 and TeraWulf, with Anthropic as the end user behind the lease. It names Google fifteen times and Anthropic twice, and it names this segment out loud — *"Google is **incumbent** in Hyperscalers and AI labs."* It teaches the *method* on this segment's parties and asserts nothing about their positions. **A landscape can be pre-empted by the lesson that teaches people to read it** — new at session 11, and the cleanest possible statement of where layer 3 stops.

### 2e. The omissions, enumerated so a later revision cannot import them

**Nineteen** things the neighbours own, which this module deliberately does not carry:

- **FROM `the-campus-as-a-power-project` (4):** the three clocks; the five-rung land→operating ladder; the four-parties-one-lease structure; the nine-project table and its "read the kind column first" rule.
- **FROM `reading-the-graph` (4):** what a curated edge is and how the chips read; the seven relationship types and their inverses; the three-typings worked example; what a segment role is and how it differs from an edge type.
- **FROM `landscape-aidc-developers-and-landlords-2026-09` (3):** the credit ladder in basis points; the pre-leased-share gauge; any ranking of landlords.
- **FROM `utility-aidc-procurement-2026-08` (3):** the four procurement moves; the tariff terms and the ESA instrument; the buyer map and the calendar.
- **FROM `nvidia-800vdc-2026-08` (2):** what the voltage change is and what it deletes; the phased AC/DC coexistence roadmap. **This is criterion 6 in its entirety** — the module says only which members signed the joint position, never what it says.
- **FROM `bridge-power` (2):** the three ways out of a factory queue; the machine classes and the permit ceiling.
- **FROM `utility-procurement-meets-ai-load` (1), UNBUILT:** the gatekeeper test itself. Named as unowned in §3, not filled.

### 2f. Why the split matters more here than a subject boundary

Because five of the eleven neighbours are **public** and this module is **contributor**. Material drifting from the module into a public lesson's territory is material an analyst can already read for free; material drifting the other way raises a gate on something the curriculum has deliberately published. The campus lesson's tile is the sharpest case: it declines a ranking *in public*, which is precisely the judgment this module is licensed to make *behind a gate*. Collapsing the two would either give away the judgment or hide the method.

## 3. Who dominates, and on what basis

### 3a. First, the shape — and it is a measurement, not a story

The segment carries **no `notes` field**, so session 4's (l) route to explaining a roster is unavailable, and session 10's (aa2) measurement route is unavailable too because it is computed over adjacents. What is available is the closure itself, measured across all nineteen segments (§2c): **8 of 8 pure plays, zero adjacents, one of only two closed segments.**

A second measurement, read off the generator rather than guessed. The segment's `what-is-bought-and-on-what` table prints a dash against **all six** buying criteria, and the reason is structural rather than incidental: the generator intersects its criterion lexicon with the segment's own `READ_NEXT` list, and this segment's three mapped lessons — *The AI Data-Center Power Chain*, *Reading the Named Projects* and *The Gatekeeper* — **appear nowhere in that lexicon at all**, so the intersection is empty by construction. Session 8's (y3) segment had two of six criteria unowned; session 10's had five of six; **this one has six of six, and would still have six of six if every mapped lesson were built.** One of the three is not built anyway.

So the module owns **none of the six tests**, and it says so. It is the sharpest form of (y3): a landscape that started teaching a criterion here would be teaching six, which is a curriculum, not a landscape.

### 3b. Five incumbents, five instruments, and why that is not a ranking

Each of the five has bought firm power, and each bought a **different instrument**. The dossiers state the instrument in each case; none of them states a comparison, and no third party ranks across them.

- **Amazon — the portfolio, and the precedent it triggered.** The largest corporate clean-energy portfolio on earth: 40+ GW across 700+ projects, ranked first by BloombergNEF since 2020, including **eleven utility-scale battery projects**. Bellefield alone targets 1 GW solar plus 1 GW/4,000 MWh, with Phase 1 (500 MW solar + 1 GWh) completed June 2025. The nuclear half is the Talen Susquehanna PPA ramping to **1,920 MW through 2042** — restructured front-of-meter after the regulator rejected the behind-the-meter version, **a precedent Amazon itself triggered and every other member now structures around.**
- **Google — ownership, and a credit instrument nobody else runs.** It bought its developer (Intersect Power, final purchase price USD 5,868 m) and now co-develops "energy parks" that put generation and storage behind the fence to bypass the interconnection queue; it signed **1 GW of data-centre demand response across five utilities**; and it anchors first-of-kind storage (a 300 MW/30 GWh iron-air battery at Pine Island). Separately it runs the **Fluidstack backstop programme** — its own dossier reads it as *capacity procurement wearing the clothes of credit support*: Google obtains first call on gigawatts of capacity without the leases, the land or the project debt touching its balance sheet.
- **Microsoft — firmness bought upstream, and the machine deleted inside the hall.** The Fairwater Atlanta design deliberately runs on resilient grid power with **no on-site generators and no UPS** — four-nines availability at three-nines cost — so the resilience spend moves above the fence line: the ~835 MW Three Mile Island (Crane) restart on a twenty-year PPA, a record **10.5 GW Brookfield framework**, a ~40 GW clean portfolio and the world's first fusion PPA. Its dossier records that **no major 2025–26 standalone battery-storage procurement has surfaced.**
- **Meta — make the utility build it, and move the campus off the balance sheet.** More than 30 GW contracted and ~7.7 GW of nuclear, but the distinguishing instrument is the **energy services agreement**: Entergy Louisiana building seven new gas plants plus three grid-scale batteries and nuclear uprates for Hyperion, funded by Meta — the biggest single-customer utility arrangement the corpus records. The financing instrument is the twin: ~$41 bn of announced development cost moved into Blue Owl and BlackRock joint ventures at 80/20, with four-year leases and a sixteen-year residual guarantee.
- **Oracle — publish the menu, and pay your own way.** It does not just buy campuses, it publishes how each is powered: a genset microgrid at Shackelford (115 MW already live), Bloom fuel cells at Doña Ana (up to 2.45 GW, replacing planned turbines), GE Vernova turbines plus grid at Abilene, utility grid plus new battery storage at Saline Township, ~70 % renewables-plus-battery at Port Washington — codified in a January 2026 policy post committing to on-site generation or Oracle-funded grid upgrades with no ratepayer pass-through. Its own dossier calls this **the single richest observable menu of behind-the-fence power choices** in the corpus.

**Why this is not a league table.** The five bases are a BloombergNEF ranking, a closed acquisition, a design decision, a utility docket and a set of published site pages. They are not measures of one thing. The only figure published for all five — capex — measures the *size of the buyer*, not its position in this segment, and three of the five have moved it twice in a year. The module therefore states the instrument and declines the ordering, which is what §10.6 asks a landscape to do when the bases do not compare (C8).

## 4. Who threatens — three challengers who are the demand, and a threat that runs both ways

The registry's `challenger` label here means something it has not meant in any previous landscape. Session 4's (l) found `challenger` used as a **structural placeholder** for a segment where regulation forbids competition; this is the opposite case — the three challengers are **larger sources of demand than most of the incumbents' own customers**, and they are labelled challengers because they are new buyers scaling up, which the plan's §10.11 says in as many words.

**Direction one — upward, into the incumbents' order books.** OpenAI's commitments are the incumbents' backlog. Its dossier states the per-counterparty tally: roughly $300 bn to Oracle (press-attributed as about half of a $638 bn RPO), $250 bn of Azure, $38 bn to AWS with a reported $100 bn expansion — plus 10 GW letters with NVIDIA, 6 GW with AMD, 10 GW with Broadcom and 750 MW with Cerebras. Anthropic's is the mirror: up to 5 GW of Trainium at more than $100 bn over ten years, "well over a gigawatt" of TPUs in 2026 and multiple gigawatts from 2027, $30 bn of Azure and up to 1 GW of NVIDIA. **The five incumbents' AI order books are, to a first approximation, three companies' signatures.**

**Direction two — downward, past the incumbents entirely.** This is the newer half and it is what makes the label defensible. Since mid-2026 Anthropic **signs the leases and the generation orders itself**: a twenty-year 401 MW lease at Hawesville in its own name (~$19 bn), a 470 MW equipment purchase order for on-site generation, a 191 MW build-to-suit at Rockdale, an anchor-tenant platform with Macquarie and GIC, and a February 2026 pledge to pay **100 % of the grid upgrades** and cover demand-driven price effects — voluntarily assuming what utility tariffs are only beginning to require. Its own file is precise about what this is: *rent the building, buy the power, let a lessor hold the silicon and a hyperscaler hold the credit* — an infrastructure counterparty that never becomes an owner.

xAI is the extreme form and it is a **third** direction. It proved a gigawatt-class campus can bypass the grid queue entirely — ~1.0 GW of nameplate compute draw by March 2026 from zero in 2023, powered almost entirely by self-deployed generation buffered by the world's largest Megapack fleet, with grid allocations covering only a fraction of campus load. And it now sells that capacity **back up the chain**: one incumbent pays $920 m per month for ~110,000 GPUs at xAI sites from October 2026, and a fellow challenger pays $1.25 bn per month for all of Colossus 1. **A challenger in this segment is simultaneously an incumbent's largest customer, a landlord's tenant and an incumbent's supplier.**

**What the threat actually is, and what it is not.** It is not share: none of the three is trying to sell cloud against the five. It is **disintermediation of the procurement function** — the thing the incumbents' five instruments exist to perform. If a lab can sign a twenty-year lease, order 470 MW of generation and pay for the grid upgrades itself, the hyperscaler's balance sheet stops being the scarce input. The counter-evidence is in the same files and is why this is a threat rather than a fact: **every one of the three is financed by the five**. Amazon holds about $190 bn of one challenger's paper and Google about 14 % of its equity, hard-capped at 15 %; Microsoft holds ~27 % of another; the third was acquired by a sister company and is IPO-dependent on its own filing. The circularity is contractual rather than rhetorical — one investor's $20 bn facility releases against the *supplier's* delivery milestones.

## 5. Each player's bet — the eight

Eight rows, one per incumbent and challenger, in registry order. **Every row is analysis**, read off each dossier's own `strategyRead` and labelled as judgment. There are no adjacents to omit — the first landscape for which that sentence is trivially true. §10.6 (m) applies in the small direction: eight rows because the ranked roster is eight, and padding it would be inventing a field.

| Player | Role | The bet (analysis) |
|---|---|---|
| Amazon | incumbent | That **the complete machine wins** — paired solar-and-storage PPAs at GWh scale, ~2 GW of front-of-meter nuclear, SMR construction plans and eleven named battery projects — and that the dual-silicon hedge (its own accelerator for one lab, NVIDIA for the rest) converts compute supply into balance-sheet gains no rival replicates at scale. The cost is stated in its own file: trailing free cash flow swung from +$38.2 bn to negative while capex guidance rose to ~$220 bn |
| Google | incumbent | That **owning beats procuring** — buying its developer, co-developing energy parks behind the fence, anchoring first-of-kind storage — and that the backstop programme buys first call on gigawatts without the debt appearing anywhere. Its own file is explicit that the equity strip is **negotiated, not structural**, and that it was negotiated away: ~14 % of one landlord, ~5.4 % of the next, and **nothing at all** on the largest and latest lease |
| Microsoft | incumbent | That **resilience belongs upstream of the fence line** — a flagship design with no generators and no UPS, four-nines availability at three-nines cost, paid for with nuclear, a 10.5 GW renewables framework and a fusion option. The demand case is the best-documented of the five (a $678 bn backlog growing faster than capex), and the exposure is a single restart date: its file reads slippage as pushing firming demand toward gas and storage across the whole sector |
| Meta | incumbent | That **the highest-beta position is the right one** — no cloud revenue absorbs the spend, so the capex and the 6.6 GW nuclear package inside a roughly 7.7 GW nuclear book are a bet that the products monetise. The instrument is to make the utility build the generation and the private-capital JV hold the campus; the file reads the resulting ratepayer proceeding as the sector's regulatory bellwether, with a judge compelling demand-evidence disclosure and a commissioner dissenting on fifteen-year contracts against thirty-year plant lives |
| Oracle | incumbent | That **a concentrated landlord bet is worth its funding cost** — $638 bn of remaining performance obligations, roughly half press-attributed to one counterparty, funded by debt and equity at a scale that made its credit default swaps a market-wide barometer. The power half is deliberate and is the one thing it publishes in full: five simultaneously active architectures across five campuses, codified as *pay our own way* |
| OpenAI | challenger | That **commitment is the instrument** — ~$1.4 tn and ~30 GW acknowledged, which reprice every counterparty's order book on announcement. Its own file states the fragility in the same breath: the financing is circular by construction, the same dollars appear as vendor revenue, its funding and counterparty backlog, and the gap between ~$25 bn annualised and $750 bn of planned compute is bridged by serial mega-raises and an IPO |
| Anthropic | challenger | That **the buyer should remove its own binding constraint** — three-silicon hedging on suppliers who are also shareholders, and then, from mid-2026, leases, generation orders and a pledge to pay 100 % of the grid upgrades in its own name. Its file calls the answer to make-versus-lease *neither*: rent the building, buy the power, let a lessor hold the silicon. The exposure it names is **delivery-date risk larger than allocation risk**, with startup counterparties carrying the execution |
| xAI | challenger | That **speed-to-power beats model quality as a differentiator** — behind-the-meter gas plus battery buffering skipping the queue entirely, 64-to-91-day cluster bring-ups, and turbine procurement that made it one of the largest mobile-turbine buyers anywhere. The same playbook is the risk template: a federal Clean Air Act suit, four different turbine counts with different evidentiary statuses, and a self-recorded $399 m accrual. Related-party procurement is structural, not incidental |

## 6. The indicators

Eight rows. **Where the record dates something only to a month, a quarter or a year, the row says so** rather than supplying a day — and that is the dominant case here, which is itself the finding recorded under §10.

| Watch | When the record dates it | Why it moves the segment |
|---|---|---|
| The delivery checkpoint — one lab's own "nearly 1 GW" of custom silicon, and its landlord programme's sites "online throughout 2026" | **End-2026.** The dossier calls these *the first hard delivery tests* | The whole segment's book is priced on commitments. This is the first date on which a commitment either became megawatts or did not — **and it is this module's review date** |
| A frontier lab's public registration statement | **Q4 2026 expected**, filed confidentially 1 June 2026 | It would replace every press-sourced revenue and commitment figure in this module and name the credit provider behind two leases that nobody has named |
| The flagship campus's announced-to-operational gap | **Q4 2026 for 1.2 GW**, against ~0.3 GW live; >9 GW projected by 2029 | The single most load-bearing ratio in the segment. Two separate dossiers state it independently, and one flagship expansion has already been reversed |
| A nuclear restart reaching commercial operation | **2027, year only** — no month stated anywhere | The best-documented firm-power bet of the five incumbents. Its own file reads slippage as pushing firming demand toward gas and storage sector-wide |
| A ratepayer commission's second phase on ~5.2 GW of customer-funded gas | **Open, no date stated.** Phase 1 (~2.3 GW) approved | The template argument for every multi-GW campus. A judge has already compelled demand-evidence disclosure and a commissioner has dissented on contract-versus-plant-life mismatch |
| Mobile turbines coming off a self-built campus under an environmental agreed order | **August 2026 – July 2027**, a removal window rather than a date | Whether the fastest behind-the-fence build in the corpus converts to permanent permitted plant, or whether the permit path is the constraint the queue was |
| An incumbent paying a challenger for compute | **From October 2026**, month only, ~$920 m per month to June 2029 | The clearest single instance of the role inversion this module is about: the segment's demand renting capacity from the segment's demand |
| Custom-silicon delivery against three separate accelerator programmes | **End-2026 initial deployment for one; 2027 for another; and for the third the record says only "starting in 2027"** | Each is a gigawatt-denominated commitment whose power draw lands in somebody's hall. Where the silicon slips, the power schedule slips with it |

## 7. The seller's play — §10.10's two paths

**The storage seller.** The headline finding is a measurement and it is uncomfortable: **not one of the five incumbents buys behind-the-meter storage at its own campus, and the only on-campus battery fleet in the whole segment belongs to a challenger.** Read member by member —

- Amazon's own file splits its storage demand into three layers and says Layer 2 (behind-the-meter at the campus) has **no announced deployments**, a contrast it draws explicitly against the challenger with the Megapack fleet. Layer 1 is utility-scale PPAs where **the developer owns the asset and chooses the cells**, so the OEM decision sits with the developer, not with Amazon.
- Meta's file states its BESS exposure runs through **utility-side tolled storage** and finds **no evidence of behind-the-meter BESS** at either flagship campus; the sales channel is named outright as Meta's utility counterparties.
- Microsoft's file records **no major standalone battery procurement in 2025–26** at all, and a flagship design that deletes the UPS. The one door it leaves open is its own stated intent to replicate a grid-interactive UPS pilot worldwide.
- Google's storage is real and large but sits at the **energy park** — generation-side, behind its own developer's fence — and at the utility, not in the white space.
- Oracle's batteries appear on two of its five published site architectures and in both cases belong to the utility or the renewables package.

So the storage channel into this segment is **the members' counterparties**, not the members: the developers who own Layer 1, the utilities who own the tolled fleets, and — for the one on-campus case — a related party the file says gets first look at any storage scope. The **third** layer is the interesting one and it is not measurable yet: rack-level backup inside the white space, which one dossier calls *where AI-specific battery demand actually lands*, is reported only through unnamed sources naming the same cell maker in parallel talks with three of these five. Qualify it as reporting, not as a win.

**The AIDC-power seller.** The opposite posture. This is the segment that **sets the architecture** — one buying criterion is reference-architecture control passed down to landlords and vendors, and two of the five incumbents co-signed the joint position that defines it. It is also the segment that **pays for the grid**: one challenger has pledged 100 % of grid upgrades, one incumbent has codified self-funded energy as doctrine, and one incumbent funds a utility's entire new gas fleet. The practical consequences: the specification is written above you and arrives through the landlord; the buying centre for firm power is the tenant's own energy team rather than the landlord's; and the clock you are selling against is a **delivery date**, not a price. The one member that buys generation equipment outright has placed a 470 MW order and its file says **no sites and no dates are disclosed**.

**Both paths, one caution.** The segment's own definition calls these the most institutionalised energy buyers in the ecosystem, and the record supports it. But the credit behind a campus is routinely **not** the company in the headline — the lane opener lesson teaches this on this segment's own chain — so confirm which of the four parties in a lease you are actually contracting with before pricing anything.

## 8. Claims ledger

**Provenance:** corpus synthesis over the segment's member dossiers at the versions below; no ingested document, no new research. Every load-bearing claim traces to a dossier at its profile version on 16 September 2026 and to the field inside it. The dossiers carry the primary sources; this ledger carries the dossiers.

**Member versions, re-read off the fetched files rather than taken from the brief (G2, G7):**

| Member | Version | `lastUpdated` | devs | policy | strategy |
|---|---|---|---|---|---|
| `amazon` | v10 | 2026-09-06 | 9 | 1 | 8 |
| `google` | v9 | 2026-09-07 | 22 | 1 | 8 |
| `meta` | v9 | 2026-09-06 | 11 | 1 | 5 |
| `microsoft` | v4 | 2026-08-30 | 10 | 1 | 5 |
| `oracle` | v4 | 2026-08-30 | 10 | 1 | 5 |
| `anthropic` | v3 | 2026-09-06 | 45 | 7 | 9 |
| `openai` | v5 | 2026-09-05 | 10 | **0** | 5 |
| `xai` | v4 | 2026-08-30 | 12 | **0** | 5 |

**They agree with §7.37 member for member and version for version** — the eleventh consecutive S2 session to confirm its brief's member measurement. The `recentDevelopments` distribution is as lopsided as the brief said (45 against 9), and the policy fence is **eleven entries across eight members with two members carrying none** — the thinnest any landscape has had.

**Four claims in this module are the module's own** and are labelled as analysis wherever they appear: that the closure makes this segment the chain's terminus; that the five incumbents hold five non-comparable instruments rather than five ranks; that the challengers' threat is disintermediation of the procurement function rather than share; and every row of the bets table.

## 9. What the record does NOT say

Seven absences, each one stated by the dossier that has it rather than inferred from silence:

1. **No PPA price, anywhere, for any of the eight.** Not one dossier publishes a $/MWh for a nuclear, renewable or firm contract. The segment's second buying criterion is priced in no source it holds.
2. **No behind-the-meter campus BESS for four of the five incumbents**, stated as an absence by three of them in their own files — and in one case named explicitly as *a genuine structural contrast* with the challenger that has one.
3. **No battery vendor named anywhere in the utility-scale layer.** One dossier says its renewables disclosures name developers but never battery vendors, and refuses an inference from a developer's corporate stake as *an untested inference, not a sourced fact*.
4. **No rack-level backup supply agreement is confirmed by anybody.** The only reporting rests on unnamed sources at trade outlets, names the same supplier in parallel talks with three of these members, and is confirmed by neither side.
5. **No customer split for the largest backlog in the segment.** The company has never disclosed it; the "roughly half" attribution is press reporting, and analysts openly handicap collectability.
6. **No consolidated capacity total, fiscal-year revenue, compute spend, burn or headcount** for the largest challenger by developments — its own file lists these as collection gaps — and the credit-support provider behind two of its leases is **unnamed in every source read**.
7. **No league table of these eight exists in this corpus**, and the public campus lesson says so for the layer below. This module states five instruments and declines to rank them (C8).

## 10. Freshness gate — the `reviewBy` judgment, resolved

**Taken: `2026-12-31`.** Read, not sorted, for the twelfth consecutive session — and this fence produced a **seventh distinct failure mode**.

**What a sort returns.** Eleven `policyExposure[]` entries across eight members; nine carry an `effectiveDate`; **exactly one is in the future — 2027-01-01, the New York RAISE Act.** A day-level scan of all eight dossiers for *any* future date confirms it: 2027-01-01 is **the only day-level future date in the entire eight-member corpus.** Everything else the record dates forward is a month, a quarter or a year.

**Why that one date is rejected, three times over.** (a) It is **off-subject**: a frontier-model transparency statute binding a developer's disclosure obligations, not an energy gate, in a module whose six buying criteria are all power. (b) It is **already four modules' `reviewBy`** — `bess-bankability-2026-08` and three built landscapes. (c) **It is already this segment's own generated lesson's `reviewBy`**, set by the generator from the very same entry. That third ground is new: sessions 5, 6 and 10 rejected a day another *module* held; here the nearest and only future date is the clock of **the artefact directly below this one on the same subject**, so taking it would have the judgment layer and the generated layer ringing at the same instant about the same segment — which defeats the purpose of reading the gate by hand.

**What is taken instead, and why it is a gate rather than a tell.** The record converges on **end-2026** from seven independent directions: one lab's custom-silicon programme reaching "nearly 1 GW"; its landlord programme's sites "online throughout 2026"; a second lab's first custom inference ASIC at "initial deployment by end-2026"; that lab's flagship campus at **1.2 GW projected by Q4 2026 against ~0.3 GW live**; a second campus in the same programme with initial operations targeted Q4 2026; a public registration statement expected in Q4 2026; and one dossier's own indicator list naming end-2026 as **"the first hard delivery tests"**. That phrase is the deciding evidence — the dossier calls it a test, not a signal, which is what separates a gate from session 10's (aa3) tell. Session 9's (z4) took a date on a four-way convergence; this is a **seven-way** one.

**The shared-day disclosure.** 2026-12-31 is already carried by `china-policy-stack-2026-08`, `landscape-bridge-and-on-site-generation-2026-09` and `landscape-clean-firm-and-nuclear-2026-09`. **This module makes four.** Per (z5) a shared day is accepted when the alternative is fabrication, and per (aa3) a *differently* shared day is not better — both apply here: the only alternatives were 2027-01-01 (shared five ways and off-subject) or inventing a December day the record does not state. The bells are distinct: a tariff expiry, a fuel-and-permit convergence, a licensing filing deadline and — here — **a delivery checkpoint**. Four bells, one day, recorded rather than absorbed.

**Rejections in writing (six).**

1. `2027-01-01` — the only future `effectiveDate` in the fence. Off-subject, four modules' day, and the segment lesson's own clock. Rejected three ways.
2. `2026-10-31` — an incumbent's compute payments to a challenger beginning October 2026. A real month-level event and squarely this module's subject, but it is a **commercial start date rather than a gate**: nothing about the module's reading changes when the first invoice is paid, and the identity it marks is already in the record. It is `the-indicators` row 7 instead. Also `landscape-grid-equipment-2026-09`'s day.
3. `2027-07-31` — the mobile-turbine removal deadline under an environmental agreed order. A genuine dated regulatory gate on the segment's own criterion 3 and a unique day — but it is a **removal window** (August 2026 to July 2027) rather than a point, and it is later than the six-month default, so taking it would mean a review date chosen for being convenient rather than nearest. `the-indicators` row 6.
4. **A nuclear restart in 2027** — the best-documented firm-power bet in the segment, dated to the **year only** in every source read. Supplying a month would be fabrication. `the-indicators` row 4.
5. **A ratepayer commission's Phase 2 proceeding** — the sector's regulatory bellwether by its own dossier's framing, and the single most consequential open item for one incumbent. **No date is stated anywhere**, so it cannot be a review gate. `the-indicators` row 5.
6. **A search-antitrust cross-appeal "argued late 2026/early 2027"** — the nearest thing to a dated legal gate on an incumbent, rejected as both imprecise and off-subject: it bears on distribution, not on power.

**Horizon arithmetic, checked before committing.** Today is 2026-09-16 and the curriculum checker's horizon runs to 2026-10-16. 2026-12-31 sits **outside** it, so `check-classroom-curriculum.py` continues to report **2** items due for review — `landscape-utilities-2026-09` and `landscape-in-hall-power-2026-09`, both by design — rather than 3. Chosen knowingly, as §7.37 required.

## 11. The Scraper interest seed — asked from scratch, and ADDED

**The roster, counted against BOTH arrays — and a correction to this session's own first reading.** `Scraper.gs` holds **two** seed arrays, not one: `SCRAPER_INTEREST_TOPIC_SEEDS` (36 seeds, 220 terms) and `SCRAPER_SEGMENT_SEEDS` (29 business-segment lenses, 249 terms). Together: **469 terms, 444 distinct case-folded** — and 444 is the denominator §10.6 (i) asks for. **A first pass here counted only the topic array, read 220, and was about to record the previously logged figures as irreconcilable.** They reconcile exactly: session 9 logged **444** *after* adding its own terms, session 10 logged **431** *before* adding thirteen, and 431 + 13 = 444. The error was mine and it is recorded because it is (aa4)'s own trap running the other way — a session almost publishing a "correction" to a measurement that was right.

**What is already covered, and by what.** The segment's own name band is held twice over: `topic-aidc-buildout` holds `data center`, `gigawatt`, `capex`, `hyperscaler`, `power purchase` and `nuclear`, and the `seg-aidc` lens holds `data center`, `hyperscale`, `ai infrastructure`, `colocation` and `compute campus`. Neither was taken. Separately, **seven of the nine project seeds are this segment's own projects** — `topic-colossus`, `topic-hyperion`, `topic-stargate`, `topic-frontier`, `topic-jupiter-nm`, `topic-lighthouse` and `topic-river-bend-campus`. The digest already watches this segment's **sites** and its **name**. What it does not watch is the segment's **commercial instruments**.

**The terms that scored zero across all 444, and were taken (10):**

| Term | Why it is this segment's |
|---|---|
| `remaining performance obligation` | The segment's unit of account: $638 bn at one incumbent, $678 bn at another, a $244 bn backlog at a third. No seed holds it |
| `compute commitment` | What the challengers sign and the incumbents book |
| `24/7 carbon-free` | Buying criterion 2, by name. No seed holds any clean-matching term at all |
| `hourly matching` | Criterion 2's mechanism — the 66 %-matched figure that drives one incumbent's whole storage book |
| `demand response` | 1 GW signed across five utilities by one incumbent; unowned by the utility seeds, which hold rate-case and queue vocabulary instead |
| `energy park` | The buyer-owned co-located generation construct, specific to this segment's vertical-integration route |
| `grid upgrade` | Criterion 4 — the buyer voluntarily paying what tariffs are only beginning to require |
| `speed to power` | Criterion 3, by name |
| `circular financing` | The segment's defining financial structure, stated as such in two dossiers |
| `frontier lab` | The segment's own second half |

**Dropped on split grounds (8)** — §10.6 (v)'s rule, that a term belonging to a neighbour's instrument blurs in the digest exactly the line the module draws in the curriculum:

- `tenant credit`, `anchor tenant`, `credit support`, `backstop` → `topic-aidc-landlords` owns the lease-credit layer and already holds `tenant credit`. It is the same instrument from the other side of the trade.
- `Trainium`, `custom silicon` → `compute-and-the-rack` is one of S2's own remaining segments and its seed is not written yet. Seeding silicon here would pre-empt it. (`TPU` never reached this list — the `seg-gpu-silicon` lens already holds it.)
- `neocloud`, `merchant cloud` → `neoclouds` is the **next** segment in the §7.3 order and the next landscape's seed to take.

**Dropped as too generic (4):** `AI lab`, `IPO`, `S-1`, `joint venture` — each would band a large majority of unrelated technology coverage.

**Dropped as a product name (1):** `Megapack`.

**One term recorded for another seed's owner, not taken here** — (z7)'s pattern, deciding rather than deferring. `restart` scores **zero across all 444** and is unmistakably `topic-landscape-clean-firm-and-nuclear`'s vocabulary — that seed holds `combined license`, `construction permit`, `uprate`, `HALEU`, `TRISO` and `AP1000`, and a restart is the instrument one of this segment's own incumbents bought. It stays out here on split grounds and is recorded so that module's next revision can take it. **Its obvious partner `SMR` is NOT such a gap**: session 10 considered it and dropped it deliberately as an ambiguous token abbreviating `small modular reactor`, which the `seg-nuclear` lens already holds. Checked before claiming otherwise.

**Three candidates that looked like gaps and are not.** `fuel cell` is held by the `seg-fuel-cells` lens; `microgrid` is matched by `seg-bess-datacenter`'s `microgrid storage`; and `TPU` is held by `seg-gpu-silicon`. All three would have been recorded as zero-scoring if only the topic array had been searched — which is the practical reason (i) says *every term*, and the practical reason both arrays have to be read.

**Consequence.** `Scraper.gs` moves from `v02.11g` to `v02.12g`, so this session's merge diff carries **two** `.gs` files, two deploy steps and two logged lines. `Scrapergs.changelog.md` goes from 32 to 33 sections against its cap of 50.

## 12. Verification

- `node --check` on a `.js` copy of `Classroom.gs` — clean.
- `scripts/check-gas-inner-scripts.js` — clean.
- `scripts/check-classroom-content.py` — **0 errors / 0 warnings at 45 lessons, 8 tracks, 142 gate cases**, with the registered-module assertion moved **19 → 20**. The lesson count does not move: a landscape adds no lesson.
- `scripts/check-classroom-curriculum.py --strict` — no structural findings; 28 stale pins (pre-existing, on the hand-authored lessons — a guidance module carries no `provenance`); **2** items due for review, unchanged.
- `scripts/check-classroom-pipeline.py --selftest` — 13 fixtures, 0 failures; `--base origin/main` — **P1** on the developer files, **no P3** (a landscape below the fence moves no gate symbol, so `gateDigest` is untouched), **no P5** (a landscape appends), **no P7** (the segment literal read `updated: 2026-09-14`, so any later EST push date advances it).
- `scripts/build-classroom-segments.py --check` before and after; `--segment hyperscalers-and-ai-labs` run once and only once.
- Playwright render at contributor with zero page errors, every section read from its screenshot; analyst denial confirmed through the real serving path (`handleGuidanceOp_` → `clRequire_`).

Developed by: LightAISolutions
