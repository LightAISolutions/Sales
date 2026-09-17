# Landscape — Compute and the Rack — Analysis & Module Source

> **Not deployed.** This file is the source of truth for the in-app guidance module
> `landscape-compute-and-the-rack-2026-09` (`guidanceDocLandscapeComputeAndTheRack_()` in
> `googleAppsScripts/Classroom/Classroom.gs`, lane **The Value Chain**, tier **contributor**).
> Written 2026-09-17 as S2 session 16 — the **sixteenth** landscape and the **twenty-fifth**
> guidance module. Spec: `CLASSROOM-CURRICULUM-PLAN.md` §10.6; brief:
> `INTEGRATED-REMEDIATION-PLAN.md` §7.47.

## What this is

A **corpus-synthesis** landscape: no ingested document and no new research. Every claim traces to
one of the segment's four member dossiers at the profile version recorded in §8, to
`profiler-segments.json`, or to `profiler-graph.json`. The developer's 2026-09-07 exception
(`INTEGRATED-REMEDIATION-PLAN.md` §7.2, decision 2) is what allows a guidance module to name and
rank covered companies; the guidance is still to a **group** — the BESS or AIDC-power seller
reading it, about the parties whose product decides how big the power ask is.

## The segment as measured

All figures re-derived from the files on **2026-09-17**, not copied from the brief (§10.6 **(aa4)**).

| What | Measured |
|---|---|
| Members | **4** — **1** incumbent, **2** challengers, **1** adjacent. **Exactly the floor, and the smallest roster S2 has covered** (cooling's eleven was the previous smallest) |
| Incumbent | `nvidia` |
| Challengers | `amd`, `supermicro` |
| Adjacent | `flex` |
| Chain position · tier | **9 · build** |
| Registry `notes` | **present, and the longest in the taxonomy** — it records the below-floor history, the developer's fill-not-fold decision, the evidence behind both challenger typings, and, in its last sentence, **who is still uncovered** |
| Buying criteria | **5** |
| Criterion rows that resolve to a built lesson | **3 of 5** — 8th of 19 by ratio, tied with three other segments. Both dash rows are **near-misses of a literal substring test**, not coverage gaps (§10.6 **(ii6)**, and §A2 below) |
| Possible member pairs | **6** (K4) |
| Edges among members | **5 of 6 — 83 %.** The densest roster S2 has measured by ratio; cooling's was 26 of 55 (47 %) |
| Curated typings | **7** across the five edges — two edges typed from both sides |
| `competitor` typings | **1 of 7.** The segment has **one** rivalry in it and four trade relations |
| The missing pair | **`flex` ↔ `supermicro`** — the two members that both build racks to somebody else's design. The two most alike, and the only pair the graph does not connect |
| Shared members | **3 of 4.** `amd` belongs to this segment and to no other |
| Memberships elsewhere | **6**, across **4** other segments |
| Inversions | **4 of 6**, and **perfectly sorted by role held here**: the incumbent and one challenger are each ranked **lower** elsewhere in 2 of 2 chances; the adjacent is ranked **higher** in 2 of 4 and level in 2, and **lower in none** |
| Direction of every external membership | **Upstream. All six.** Positions 3, 4, 5 and 8 against this segment's 9; **not one member of this segment appears in any of the ten segments downstream of it** |
| Independent rankings of this segment | **None named.** Two ranges in two files, sourced only to "IDC-cited estimates" and "independent estimates", which **disagree** (§3a); one named series (IDC) measuring the adjacent server market, **three of whose four named parties have no dossier** (§2b) |
| Policy fence | **19 entries across four members, 10 dated, and NOT ONE in the future.** The `reviewBy` sort returns the empty set (§10) |
| Future day-level dates anywhere in the four dossiers | **Four, and an ISO-date scan finds none of them** — all four are written in words, and only one falls inside six months (§10) |

### A2. The two dash rows, measured against the generator rather than asserted

Run `build-classroom-segments.py`'s own `READ_NEXT` ∩ `CRITERION_LEXICON` test on this segment's five
criteria and both misses are literal-substring accidents:

| # | Criterion | Eligible hit | What actually happened |
|---|---|---|---|
| 1 | Performance per watt and per dollar across a generation | `inside-the-rack` on `per watt` | resolves |
| 2 | Allocation and delivery against a sold-out roadmap | `inside-the-rack` on `allocation` | resolves |
| 3 | Rack density (kW) and the NVLink domain the rack forms | `heat-is-the-constraint` on `density`; `inside-the-rack` on `rack density`, `nvlink` | resolves, two lessons |
| 4 | Reference architecture and the qualified power and cooling vendor set | **none** | The lexicon's key for this segment's own lesson is `qualified vendor`; the registry wrote **`qualified power and cooling vendor set`**, interposing three words inside the phrase. Two *ineligible* entries hit instead — `the-cooling-plant-and-water` on `cooling`, which is correct and blocked, and `breakers-relays-and-faults` on **`arc`, a substring of `architecture`**, which is noise and blocked. **The eligibility gate suppresses one correct answer and one piece of nonsense in the same row** |
| 5 | Cooling requirement (direct-to-chip, facility-water temperature) | **none** | `heat-is-the-constraint` is eligible, is built and plainly teaches this — and its lexicon keys are `heat`, `thermal`, `density`, `kw per rack`, `cold plate`, none of which the registry's wording uses. The entry that *does* match (`cooling`, `water` → `the-cooling-plant-and-water`) is not in this segment's `READ_NEXT` |

That is §10.6 **(ee4)** — a criterion an eligible built lesson already teaches with no lexicon entry to
say so — extended: here **both** dash rows are of that class, and row 4 shows the gate doing its two
opposite jobs simultaneously. Neither is a gap in the curriculum; both are gaps in a keyword table,
and both are the developer's to close or leave.

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

| # | Section id | Kind | What it carries |
|---|---|---|---|
| 1 | `who-dominates-and-on-what-basis` | prose | The segment has no ranking of itself. What the basis actually is, why two files disagree about it, and why the disagreement does not move the typing |
| 2 | `who-threatens` | prose | Two challengers attacking on two unrelated routes, and a terminus: every external membership is upstream |
| 3 | `each-players-bet` | table | Four rows — the §10.6 default for once, because the roster is the floor |
| 4 | `the-indicators` | table | Seven rows, dated only where the record dates them; the fence is empty of future dates and says so |
| 5 | `the-sellers-play` | callout | §10.10's two paths: the BESS seller and the AIDC-power seller |
| 6 | `claims-ledger` | ledger | 34 rows, every load-bearing claim to a dossier field at a pinned version |
| 7 | `what-the-record-does-not-say` | callout | The four uncovered parties by name and size; the missing edge; the absent revenue line |
| 8 | `drill` | flashcards | 13 cards |
| 9 | `check-yourself` | quiz | 7 items, answer indices varied per §10.6 **(ff4)** |

## 1. Executive read

**This is the load's own segment, and it is the only one in the taxonomy whose members all face
backwards.** Positions 1 through 8 make, convert, move, back up and cool the electricity; position 9
is the thing that consumes it and decides how much of it there is. Four companies sit here — one
incumbent whose architecture decisions set the power ask for every segment upstream, two challengers
attacking on two unrelated routes, and one contract manufacturer that builds other people's designs
and is three months from splitting itself in two.

**Four things a seller should take away, in the order the module presents them.**

1. **The corpus can see this segment's parties and cannot see its market.** One member, three
   uncovered parties, and the only named independent series puts the uncovered ones first and second
   (§2b). Say that before you say anything else about who is winning.
2. **Dominance here is not a share, it is a specification.** The incumbent's basis line in the
   registry does not mention revenue: it says the company "does not sell power or storage, but its
   architecture decisions create the market for both." That is the correct basis and it is testable —
   the incumbent publishes a named vendor slate for the power layer, and the two challengers publish
   none (§3).
3. **The two challengers are not challenging the same thing.** One is a merchant second source of
   silicon that has deliberately refused to build racks; the other builds racks and is losing share
   to a channel that undercuts it. Treating them as one "challenger bench" is the error this section
   exists to prevent (§4).
4. **The segment is a supply chain with one rivalry in it.** Five of six possible pairs are connected
   and only one of the seven typings reads `competitor`. Everybody else in the room buys from, builds
   for, or partners with somebody else in the room (§4c).

## 2. The coverage boundary — written before any other section

**Drafted first, deliberately.** §7.47 asked for it and the reason turned out to be stronger than the
brief knew: on this segment the coverage boundary is not a caveat attached to the analysis, it **is**
the analysis. Every other section below had to be written around the measurement in this one.

### 2a. The registry states the gap, and it states it in the same field that states the floor

`profiler-segments.json`'s `notes` on this segment is the longest in the taxonomy and it ends on a
sentence no other segment's `notes` carries — a list of who is **not** here:

> "Dell and HPE, the named alternates, were not needed and remain uncovered — the segment still has
> no dossier for the two largest OEM competitors, and no ODM (Foxconn, Quanta, Wiwynn) is covered
> even though ODM Direct is now above 50% of the server market."

That sentence was written on 2026-09-08 when S3 P1 landed AMD and Supermicro and took the segment
from below the floor to at it. It has been true and unread for nine days. It is the opening problem.

### 2b. The only independent ranking this segment has names four parties and the corpus covers one

Cooling had **three** named third-party rankings of itself — ABI Research, Global Market Insights and
Dell'Oro — and the interesting work was reconciling them. This segment has **none of its own**. Search
the four dossiers for a named, dated, quantified ranking of AI accelerators and what comes back is two
ranges in two different files, neither naming a publication (§3a). What the segment does have is exactly one named
series, and it measures the **server** market rather than the accelerator one:

| IDC worldwide server revenue share, 1Q26 | Share | Dossier in this corpus? |
|---|---|---|
| **ODM Direct** (Foxconn, Quanta, Wiwynn and peers, selling straight to hyperscalers) | **50.2 %** | **No** |
| **Dell Technologies** | **16.5 %** | **No** |
| **Supermicro** | **7.6 %** | **Yes** — segment member, challenger |
| **HPE** | **3.0 %** | **No** |

**One of the four. 7.6 points of the 77.3 the series names — 9.8 per cent of the named share.** The
single rank order this segment can cite puts an uncovered channel first, an uncovered company second,
and the one covered party third. Every figure in that table is read out of `supermicro`'s own dossier,
which is to say: **the segment's own member is the source for the fact that the segment is mostly
uncovered.** That is the honest form of the boundary, and it is better guidance than a silent table
of four members would be.

### 2c. The boundary is visible in the curriculum's own vocabulary, and the collision is measurable

Session 15's reverse-(t) discipline says to sweep the corpus for your own material even when you
expect the null result, because the sweep finds collisions. It did:

| Token | Occurrences in `Classroom.gs` | What it means here |
|---|---|---|
| `Dell` | **10** | **Nine are `Dell'Oro`**, the market-research firm the cooling landscape cites four times. **Exactly one** is Dell Technologies — a share figure inside the generated `segment-compute-and-the-rack` player table, with no prose anywhere explaining it |
| `Quanta` | **42** | **Forty-two are `Quanta Services`**, the covered EPC contractor. `Quanta Computer`, the ODM, appears **zero** times |
| `ODM`, `Foxconn`, `Wiwynn`, `Sanmina`, `Wistron`, `Inventec`, `HPE`, `rack OEM`, `contract manufacturer` | **0 each** | Not in the curriculum at all |

So a reader who searches this curriculum for the company with the second-largest server share finds a
ranking publisher, and a reader who searches for the ODM that builds a large share of the world's
servers finds a Texas transmission-line contractor. **The gap is not merely an absence — it is an
absence with two homonyms sitting in it**, which is the shape session 15's `interlock` finding
(§10.6 **(hh3)**) took, fired twice on one segment and pointing at the coverage boundary rather than
at a teaching hazard.

### 2d. What the module does about it

Three things, all of them stated in the module itself rather than here:

1. **The tile grid leads with `1 of 4`** — the covered fraction of the only ranking — so a contributor
   meets the boundary in the first six seconds rather than in section three.
2. **`who-dominates-and-on-what-basis` opens on the absence of a ranking**, not on a ranking. The
   section's first job is to say what cannot be said.
3. **`what-the-record-does-not-say` carries the four uncovered parties by name**, with the share figure
   the corpus does hold for each, so a seller who meets one in a room knows the corpus is silent on it
   and knows roughly how big it is anyway.

**What the module does NOT do:** invent a rank order for the accelerator market, rank the uncovered
firms against the covered ones, or treat Supermicro's 7.6 per cent as a segment share. The registry's
floor rule exists to stop a landscape ranking a field the corpus cannot see, and four members at the
floor is precisely the case it was written for.

## 3. Who dominates, and on what basis

### 3a. There is no ranking, and the two files that come closest disagree with each other

The first honest sentence about this segment is that **nobody in the corpus ranks it**. What exists is
two ranges in two different member files, neither naming a publication, and they do not agree:

| File | What it says about the incumbent's accelerator share | Attribution |
|---|---|---|
| `nvidia` @ v10 | **about 80–85 %** of AI-accelerator revenue, **down from about 92 % in 2023** | "per IDC-cited estimates" — no publication named |
| `amd` @ v1 | **75–92 %**, against its own **5–10 %** | "independent estimates" — no publication named, and the file adds that **no named tier-one house publishes** the split |

The incumbent's own file gives a point-in-time figure with the 92 marked explicitly as a **2023**
number; the challenger's file gives a range that spans the whole history and is therefore not a
measurement of today at all. **The registry's `notes` took the challenger's version** when it typed
AMD, quoting "5-10% of accelerator revenue against NVIDIA's 75-92%".

**This is worth publishing and it does not move the typing.** Five to ten per cent against eighty to
eighty-five is exactly as decisive as five to ten against seventy-five to ninety-two, so the role
survives. What changes is what a seller may say out loud: **cite the range and you are citing an
artefact that includes a three-year-old peak.** Cite 80–85 and you are citing the incumbent's own
file, which is at least dated and at least marked.

It is also the inverse of the instrument §10.6 **(dd2)** and **(gg2)** established. Those found two
member dossiers stating the same cut about each other independently, in almost the same words, neither
citing the other — a **cross-attestation**, and strong evidence. Here the same instrument, run the same
way, returns a **cross-disagreement**: two files, independently, on the same quantity, not reconciled
anywhere. The instrument is worth running for both outcomes, and a landscape that only reports the
agreements is reporting half of what it measured.

### 3b. The basis that does hold is a specification, not a share

The registry's basis line for the incumbent is unusual and it is right:

> "the ecosystem's gravitational center — does not sell power or storage, but its architecture
> decisions create the market for both; GB200/GB300 NVL72, Vera Rubin"

Three things in the member files make that testable rather than rhetorical.

**First, the incumbent publishes the power architecture and names the vendors who will build to it.**
Its 800 VDC initiative redesigns facility power for megawatt-class racks — 13.8 kV AC to 800 VDC
distribution, single-stage conversion at the node, replacing 415/480 VAC three-phase plus in-rack 54 V
conversion — with published claims of about 157 per cent more power through the same copper, up to 45
per cent less copper, up to 5 per cent end-to-end efficiency and a 30 per cent total-cost reduction.
Its own ecosystem list names Delta, LITEON, Megmeet and Flex among power-system components and Vertiv,
Eaton, Schneider, Siemens, ABB, GE Vernova and Hitachi Energy at the grid tier. **Four of those names
are members of other segments in this taxonomy, and one is a member of this one.**

**Second, it prescribes where storage sits.** The file records a two-tier hierarchy the company itself
states: supercapacitors at the rack for millisecond transients, facility-level BESS at the utility
interconnection for second-to-minute smoothing — and a productized rack-level smoothing feature in
GB300 NVL72 claiming up to 30 per cent peak-grid-demand reduction. A company that specifies where the
battery goes is setting this corpus's agenda whether or not it sells one.

**Third, the roadmap is the power ask.** About 120–150 kW GB300 racks today, Vera Rubin NVL72/NVL144
in production in 2H 2026 at 100 per cent liquid-cooled, Rubin Ultra NVL576 in Kyber racks at about
**600 kW per rack** in 2H 2027, and an announced Feynman generation at **1 MW-class**. Every segment
from position 1 to position 8 is designing against that ladder.

### 3c. What the challengers publish instead, and why the contrast is the measurement

**The first challenger prescribes nothing.** Its own file states, at high confidence, that no statement
on 800 VDC or higher-voltage rack power appears in any of its 2024–2026 releases or filings reviewed;
that it adopted the Open Rack Wide specification another company contributed to the Open Compute
Project rather than publishing an architecture of its own; and that it **names no power-conversion
vendor roster**. Its only published power figures are a 50 V DC busbar, a 400 W default CPU power for
one part, and comparative claims normalised to a 100 kW rack envelope.

**The second challenger prescribes nothing either, and it is an integrator by its own margin.** Revenue
grew 5.5× from FY2023 to FY2026 while gross margin fell **719 basis points to 10.8 per cent** — the file
calls that "the arithmetic of an integrator winning volume on price" — and the one quarter that broke
the pattern, Q4 FY2026 at 17.5 per cent, is explained by its own CFO as about 75 per cent driven by
contracts deferred into the next quarter, with the following quarter guided back to 10.4–10.8 per cent.

**So the basis for incumbency here is that one company writes the specification and the other three
build to somebody's.** That is a cleaner statement of dominance than any share table this segment
could produce, and it is the one the registry already made.

## 4. Who threatens — two challengers typed on evidence, and a terminus

### 4a. The two challengers are attacking different things and must not be averaged

§7.47 asked that both typings be tested against the dossiers as they read on the day rather than
inherited. Both survive, and the test produces the section's organising fact: **they are not the same
kind of challenger.**

| | First challenger | Second challenger |
|---|---|---|
| What it sells | Merchant accelerator silicon and server CPUs | Assembled, factory-tested racks |
| Where it is strong | **34.5 % of x86 server units** (Mercury Research, Q2 2026, up 7.2 points year on year) — an incumbent co-leader's share **in a different market** | Nothing the record ranks it first in |
| Where it is the challenger | **5–10 % of data-centre accelerator revenue**; the incumbent's data-centre revenue alone is **more than thirteen times** this company's entire Data Center segment | **7.6 % of worldwide server revenue** in 1Q26, down from an **8.0 %** peak in 4Q23 |
| Its own file's warning | "The position is asymmetric and the dossier should not average it" | "a challenger rather than an incumbent, and the evidence is its own margin" |
| The binding constraint | **Software and internal cluster capacity, not silicon** — one assessment upgraded its chances of breaking the incumbent's software moat to "a great chance of success" while documenting internal development clusters more than an order of magnitude smaller | **Working capital, not demand** — FY2026 cash from operations was **negative $6,809.9m** against $2,230.5m of net income, with $7.0bn raised in June 2026 to fund components for about $39bn of recent orders |
| The structural choice | **Refuses to manufacture the rack.** Bought a systems company for $4.9bn and sold its manufacturing arm for about $3bn within seven months, keeping the design IP; its 10-Q states it does not manufacture or sell the completed rack | **Is the manufacturing arm** — and buys about **94.4 %** of its power supplies and **95.3 %** of its chassis from two related parties controlled by the chief executive's brothers |

**The asymmetry is the point.** One challenger is an incumbent in the socket and a challenger in the
accelerator; the other is a challenger everywhere and an adjacent member in cooling. A seller who reads
"two challengers" as "two firms doing the same thing to the incumbent" will price both wrong.

### 4b. The threat is not on the roster — it is the channel the roster cannot see

**The pressure on the second challenger comes from above and below rather than from the incumbent.**
Its own file says so, and quantifies it: ODM Direct — vendors selling straight to hyperscalers at
roughly **2–3 per cent margins** — reached **59.4 per cent** of the server market in 3Q25 and **50.2
per cent** in 1Q26; Dell grew **244.1 per cent** year on year in 1Q26 against this member's **128.9 per
cent**; HPE drifted from 6.8 to 3.0 per cent. The reading in the file is exact: *"Supermicro comfortably
beats its nearest OEM peers and still loses share."*

That sentence is the whole coverage problem in one line. **The channel taking the share and the branded
OEM outgrowing it are both uncovered** (§2b) — and so is the peer this member comfortably beats, which
is a third uncovered party rather than a third threat — so the corpus holds all three numbers only
because the covered member reports them.

### 4c. Five of six pairs, one rivalry, and the one pair that is missing

The relationship graph carries **five edges among the four members** — five of the six pairs a
four-node roster can have, the densest ratio S2 has measured — with **seven curated typings**, and only
**one** of the seven reads `competitor`.

| Pair | Typing(s) | What the evidence says |
|---|---|---|
| challenger 1 ↔ incumbent | **`competitor`** (one side) | The challenger's own 10-K names the incumbent a primary Data Center competitor, and every headline claim is benchmarked against an incumbent part |
| challenger 1 ↔ adjacent | `supplier` | The adjacent member manufactures the challenger's eight-GPU platform in Austin; the challenger owns the product and the adjacent assembles it |
| challenger 1 ↔ challenger 2 | `customer` / `supplier`, **both sides** | The second challenger is a named OEM for the first's accelerator systems and for its rack, shipping air- and liquid-cooled platforms |
| adjacent ↔ incumbent | `partner` / `partner`, **both sides agreeing** | The incumbent names the adjacent in its own published 800 VDC components tier; the adjacent has shipped a 33 kW shelf at 97.5 per cent peak half-load efficiency and then a 110 kW shelf and an 800 VDC rack |
| incumbent ↔ challenger 2 | `supplier` (one side) | The incumbent is the silicon the second challenger's AI business is built on; its 10-K names it first among vendors it works closely with |
| **adjacent ↔ challenger 2** | **none — no edge of any kind** | — |

**Two readings follow and both are structural.**

**First, this segment is a supply chain with one rivalry in it.** Cooling's competitor subgraph was one
connected component of ten and 36 of 39 typings read `competitor`; here **one of seven** does. Four of
the five edges are vertical trade relations: everybody in the room buys from, builds for, or partners
with somebody else in the room. A seller who walks in expecting four rivals will misread every
conversation in it.

**Second, the missing pair is the two members that do the same job.** The adjacent member and the second
challenger are both contract builders of racks designed elsewhere — one builds the first challenger's
accelerator platforms and wafer-scale systems for a third party, the other turns the incumbent's
reference designs into delivered racks. They are the two most alike members of the segment, and **the
graph records no relationship between them at all.** That is the segment's most conspicuous silence and
it belongs in §9 rather than being explained away here.

### 4d. Every external membership is upstream — the segment is a terminus

Three of the four members belong to another segment; one belongs only here.

| Member | Role here | Elsewhere | Direction |
|---|---|---|---|
| incumbent | **incumbent** | `power-conversion-and-rack-power-silicon` (pos 3) — **adjacent** | **down** |
| challenger 1 | **challenger** | *(nowhere else)* | — |
| challenger 2 | **challenger** | `cooling` (pos 8) — **adjacent** | **down** |
| adjacent | **adjacent** | `power-conversion-and-rack-power-silicon` (3) — **challenger**; `in-hall-power` (5) — **challenger**; `grid-equipment` (4) — adjacent; `cooling` (8) — adjacent | **up ×2, level ×2** |

**Four of six memberships invert, and the direction sorts perfectly by the role held here.** Not one
member ranked incumbent or challenger here is ranked higher anywhere else, in two chances; the adjacent
member is ranked lower nowhere, in four. That is §10.6 **(aa2)** and **(ee3)** firing together on one
roster for the **second** time — session 15's **(gg4)** was the first — and here it is complete rather
than merely dominant.

**And the new measurement is the direction of the memberships themselves.** Positions 3, 4, 5 and 8 are
all **upstream** of position 9. **Not one of the four members appears in any of the ten segments
downstream of this one** — not in EPC, not among developers, landlords, hyperscalers, neoclouds,
utilities, capital, assurance, software or insurance. This segment's members reach backwards into the
chain they consume and never forwards into the chain that buys them.

**That is what being the load means, expressed as a graph property**, and it explains the inversion
without any judgment being added: a firm that is an incumbent at the end of the chain is a component
supplier in the middle of it, and a firm that merely assembles at the end is a branded challenger in
the layers where it also sells its own product.

## 5. Each player's bet

**Four rows - three the spec asks for and one added.** §10.6's shape is one row per incumbent and challenger, which on a roster of one and two is **three**. Session 15's **(gg8)**
recorded a bets table carrying eleven rows against the five its incumbent-and-challenger set would
give, because six of eleven members were somebody else's incumbent and a five-row table would have
omitted the finding. Here the roster **is** the floor: one incumbent, two challengers, one adjacent,
and the §10.6 shape — one row per incumbent and challenger — would give three. The fourth row is the
adjacent member, added for the same reason session 15 added six: it is a challenger in two other
segments, it is the only other party in the room that builds a rack, and leaving it out would leave
the missing edge of §4c unexplained. **Four rows on a four-member roster is proportion, not expansion.**

| Player | Arrived from · role | The bet, and what its own file says about the risk |
|---|---|---|
| **NVIDIA** | the architecture · incumbent | **That specifying the whole stack is more durable than selling the best part of it.** Publish 800 VDC, name the qualified vendor slate, prescribe where the battery sits, and the roadmap becomes every other segment's design constraint. **Its own file's risk:** the circular-financing critique — up to $100bn invested in one customer as it buys systems, reported discussions of guaranteeing up to $250bn of that customer's lease payments, and **four direct customers at 61 per cent of revenue**. And China is now "regulatory downside only": guidance assumes zero China data-centre compute revenue |
| **AMD** | the silicon · challenger | **That being the merchant second source is worth more than being a rack vendor.** Bought a systems company for $4.9bn, sold its manufacturing arm for about $3bn seven months later, kept the design IP, and licenses the rack rather than building it. **Its own file's risk:** the constraint is software and internal cluster capacity, not silicon — and the demand book is concentrated and reflexive, with three of the four largest commitments carrying equity consideration between the parties and **$4.1bn of maximum gross exposure from guarantees on partners' data-centre leases** |
| **Supermicro** | the factory · challenger | **That owning the seam between the chip and the building is a position rather than a margin.** Sell the GPU system, then the coolant distribution unit, the rear-door heat exchanger, the power shelf and a 1.5 MW / 3.1 MWh battery system around it. **Its own file's risk:** the margin says integrator — 719 basis points of gross margin given up in three years — and the cooling standing is a product line, not a rank: the leading independent liquid-cooling assessment **does not name it at all**. Governance has also stopped being reputational: a customer cancelled 300–400 racks worth an estimated $1.05–1.40bn |
| **Flex** | the contract factory · adjacent | **That a contract manufacturer can buy its way into owning the power train — and then leave with it.** About **$6.3bn** across six acquisitions, two thirds committed in the sixteen months after the build-out began, and on 5 May 2026 the board approved separating the whole data-centre business out, targeted for 1Q calendar 2027. **Its own file's risk:** the growth is funded rather than harvested — Q1 FY2027 produced record adjusted EPS on $7,928m of revenue and only **$41m of free cash flow**, with FY2027 conversion guidance cut to about 40 per cent from about 60 — and its visibility inside the incumbent's own communications has **fallen**: it is absent from the May 2026 partner release and from an independent rundown of the incumbent's GTC 2026 ecosystem |

## 6. The indicators

**The fence has nothing to contribute and the module says so.** Nineteen `policyExposure[]` entries
across four members, ten dated, and **not one in the future** — the first landscape whose policy fence
has no forward date at all (§10). So every dated row below comes from the members' own developments and
roadmaps, and the undated rows are marked undated rather than given a plausible quarter.

| Indicator | Dated | Whose | Why it moves this landscape |
|---|---|---|---|
| **Whether the second challenger's server share stops falling** — 8.0 % peak in 4Q23, 7.6 % in 1Q26 against an uncovered 16.5 % and an uncovered channel above 50 % | quarterly, **undated** | IDC series, read through `supermicro` | The only independent series the segment has. If the covered member's share keeps falling, the segment's covered fraction (§2b) falls with it |
| **Whether the first challenger's rack ships in volume, not just on time** | **Q4 2026 into Q1 2027** | `amd` | Launch-date parity was achieved on 23 July 2026; volume parity is not demonstrated. Guidance puts initial volume in Q3 2026 and significant ramp in Q4 into Q1 2027, against documented production-engineering risk of 1,728 cables and more than 550 retimers per rack |
| **Whether the second challenger's gross margin returns to the 10.4–10.8 % guide or holds the 17.5 % spike** | **Q1 FY2027 result** | `supermicro` | The integrator thesis rests on the margin. Its own CFO attributes about 75 % of the spike to deferral and calls it non-recurring |
| **Whether the adjacent member's separation completes, and what the separated business discloses** | **1Q calendar 2027** | `flex` | The segment's only adjacent member has about two quarters left in its present shape. No revenue line has ever been published for any of its branded power or cooling businesses |
| **Whether the EPC Power acquisition closes** | **Q4 calendar 2026** | `flex` | $4.4bn agreed on 3 September 2026, debt- and equity-funded, landing immediately before the separation |
| **Whether the incumbent's next rack generation lands at its published power** | **2H 2027** | `nvidia` | About 600 kW per rack for Kyber against 120–150 kW today, with a 1 MW-class generation announced behind it. Every upstream segment designs against this ladder |
| **Whether an ODM or an uncovered OEM enters this corpus** | **undated** | `profiler-segments.json` `notes` | The named alternates were not needed to reach the floor and remain uncovered. Until one lands, three of the four parties in the segment's only ranking have no dossier |

## 7. The seller's play — §10.10's two paths

**For the BESS seller.** This segment is the reason your product exists and it is also the reason your
product may be specified out of the rack. The incumbent prescribes a **two-tier** storage hierarchy —
supercapacitors at the rack for millisecond transients, facility-level BESS at the interconnection for
second-to-minute smoothing — and has productized rack-level smoothing claiming up to 30 per cent
peak-grid-demand reduction. Read that as the segment's own boundary line: **the millisecond layer is
being internalised and the second-to-minute layer is being legitimised.** Sell into the second. And
when a customer cites the incumbent's slate as a qualification requirement, check which tier the slate
covers — the published lists name power-system components and grid-tier equipment, not storage.

**For the AIDC-power seller.** Three things follow.

1. **The specification is published and the qualification is public.** One member of this segment names
   the vendor slate for the power layer; the other three name none. If you are selling into an 800 VDC
   build, the list you must be on is the incumbent's and the conversation about it is a product
   conversation, not a commercial one.
2. **Do not sell "to the segment" — sell to the seam.** Two of the four members build racks to other
   people's designs and the graph records no relationship between them. The power shelf, the busbar and
   the CDU are bought by whoever is assembling, and on this roster that is the adjacent member for one
   challenger's platforms and the second challenger for the incumbent's.
3. **Price the channel you cannot see.** Half the servers in the market are sold by parties with no
   dossier here, at roughly 2–3 per cent margins. If your pricing assumes an OEM's margin structure,
   it is calibrated to the smaller half of the market: the three branded OEMs the corpus can name hold
   27.1 points between them against ODM Direct's 50.2.

**For both.** Lead with what is not known (§2b, §9). A seller who opens by saying *the only independent
ranking of this market covers one of the four parties it names* is a seller the buyer trusts with the
second sentence.

## 8. Claims ledger

Every load-bearing claim above and in the module traces to a dossier field at the version below, to
`profiler-segments.json`, or to `profiler-graph.json`. **Pins read off the fetched files on
2026-09-17**, not carried from the brief (§8 item 2):

| Input | Version | `lastUpdated` |
|---|---|---|
| `profile:nvidia` | **v10** | 2026-09-06 |
| `profile:amd` | **v1** | 2026-09-08 |
| `profile:supermicro` | **v1** | 2026-09-08 |
| `profile:flex` | **v1** | 2026-09-04 |
| `profiler-segments.json` | — | last commit 2026-09-13 |
| `profiler-graph.json` | — | `built` 2026-09-13 |

The module's `claims-ledger` section carries **35 rows**, one per load-bearing claim, each naming the
dossier and the field it rests on. The rule §10.6 fixes is that dossiers already cite sources, so the
ledger cites dossiers — a claim whose only support is this analysis is not a claim, it is an opinion,
and belongs in the prose as one.

## 9. What the record does NOT say

Seven things, and the first four are the coverage boundary restated where a reader meets it rather
than where an author would prefer to put it.

1. **There is no dossier for Dell Technologies**, which holds **16.5 per cent** of worldwide server
   revenue in 1Q26 — more than twice the covered member's 7.6 — and which grew **244.1 per cent** year
   on year against the covered member's 128.9. Every one of those figures is read out of the covered
   member's own file.
2. **There is no dossier for HPE**, at **3.0 per cent**, down from 6.8.
3. **No ODM is covered at all** — not Foxconn, not Quanta Computer, not Wiwynn — although **ODM Direct
   reached 59.4 per cent of the server market in 3Q25 and 50.2 per cent in 1Q26**. The first challenger's
   own file names Sanmina, Wiwynn, Wistron and Inventec as the route its rack reaches site by; none of
   the four is in this corpus.
4. **So the corpus can name the parties in this segment and cannot rank its market.** One of the four
   parties in the only named independent series has a dossier (§2b). A landscape's job is to rank what
   the corpus can see, and the floor rule exists so that it does not rank what it cannot.
5. **No named tier-one house publishes the accelerator revenue split**, and the first challenger's own
   file says so in as many words. The two ranges the corpus carries name no publication between them and
   they disagree (§3a).
6. **The graph records no relationship of any kind between the two members that both build racks to
   other companies' designs** — the one missing pair of six. They are the segment's most similar
   members and the corpus is silent on whether they compete, supply each other or have never met.
7. **No member publishes a revenue line for the thing this segment is defined as.** The four fiscal
   years end on **four different dates inside a six-month window** — 2025-12-27, 2026-01-25, 2026-03-31
   and 2026-06-30, which in a market where the leader's own revenue rose 65 per cent in a year is a
   material offset by itself — and the four headline figures ($215,900m, $34,639m, $39,063.1m, $27,914m) measure
   four different businesses, only a minority of each being the rack. **The apparent ladder those
   figures make happens to agree with the registry's role order, and that agreement is a coincidence,
   not a corroboration** — read it as a rank order and you have ranked a chip company, a server
   company and a contract manufacturer on revenue lines that mostly are not this segment.

## 10. Freshness gate — the `reviewBy` judgment, resolved

**Taken: `2027-03-17` — `updated` plus six months, the §10.6 default.** The second landscape of sixteen
to take it, after session 14's. Here is the sort, and the seven rejections.

### 10a. The `policyExposure[]` sort returns the empty set, and the empty set is total

**Nineteen entries across the four members, ten carrying an `effectiveDate`, and not one of the ten is
in the future.** The latest is 2026-07-24, already 55 days past on the day of writing.

| Member | Entries | Dated | Future |
|---|---|---|---|
| `nvidia` | 2 | 0 | 0 |
| `amd` | 6 | 4 | 0 |
| `supermicro` | 5 | 3 | 0 |
| `flex` | 6 | 3 | 0 |
| **Total** | **19** | **10** | **0** |

This is §10.6 **(ee5)**'s shape — the sort returning an empty set rather than a distant answer — on the
thinnest fence any landscape has faced. It is **not** **(bb4)**'s or **(dd5)**'s: there is no single
future entry to be rejected as the generator's own, because there is no future entry.

### 10b. The ISO-date scan and the word-form scan disagree, and the disagreement is the finding

A regular-expression sweep of all four dossiers for `YYYY-MM-DD` day-level dates later than 2026-09-17
returns **nothing at all** — not in `policyExposure[]`, not in `recentDevelopments[]`, not anywhere in
the files. A sweep for the same dates written in **words** returns **four**:

| Date | Where it lives | Verdict |
|---|---|---|
| **2026-11-10** | `flex` — **a `sources[]` entry's label only**: "Q1 FY2027 results and the announcement of an Investor Day on 10 November 2026" | **Rejected — provenance.** It is the only future day-level date inside six months in the whole segment, it is genuinely on-subject, and it is held by no other artefact. It is rejected anyway because it appears **only in a bibliography line**: the dossier carries no `recentDevelopments` entry for it, never says what will be disclosed, and never analyses it. Pinning a module's clock to a source label asserts a significance the record does not |
| **2030-08-15** | `flex` — an Amazon warrant expiry | **Rejected — horizon and subject.** Three and a half years past the default; a warrant expiry is a dilution clock |
| **2030-10-05** | `amd` — an OpenAI warrant exercisable through | **Rejected — same class** |
| **2031-02-23** | `amd` — a Meta warrant exercisable through | **Rejected — same class, and worse.** That file's own lowest-confidence judgment cannot reconcile whether this is a second grant or a restatement of the first, and calls it "the largest unresolved quantitative question in this file". A clock cannot be pinned to an unresolved number |

**The generalisation worth carrying:** a `reviewBy` sort implemented as an ISO-date scan would have
reported "empty" on this segment and been **right about the fence and wrong about the file**. Run both
scans. The second one found a real candidate — and then the provenance test, not the scan, is what
rejected it.

### 10c. The remaining rejections

5. **Quarter-level candidates, five of them, all on-subject and none a day**: the adjacent member's
   separation (1Q calendar 2027), its EPC Power close (Q4 calendar 2026), the first challenger's Helios
   volume ramp (Q4 2026 into Q1 2027), the incumbent's Vera Rubin production (2H 2026) and Kyber
   (2H 2027). Every one of them is an indicator row in §6; none is a gate, because §10.6's rule is a
   **dated** gate and a quarter is not a date.
6. **The segment lesson's own `reviewBy` — and it ends up **identical**, by construction.** Checked
   per **(bb4)**, which requires a landscape to check its own generated sibling's clock and not only
   other modules'. At the moment of checking it read **2027-03-14**, the generator's six-month default
   from its 2026-09-14 generation. **Then this session regenerated that lesson on 2026-09-17 and the
   generator recomputed it to 2027-03-17 — the same day this module takes.** That is not an accident
   and it is not avoidable: when the fence is empty the generator applies `updated` + 6 months and so
   does §10.6, and an S2 session regenerates its segment on the day it writes its module, so **the two
   defaults are the same arithmetic on the same date**. It is **(dd5)**'s tautology in a third
   sub-shape — the earlier two fired on a *sorted gate* the generator had already taken, this one fires
   on the *default* and fires by construction — and it is harmless for the reason that matters: a
   default is the absence of a bell, so two artefacts sharing one are not ringing the same bell twice.
7. **`2027-03-17` is already `how-a-cell-is-made`'s `reviewBy`** — recorded and **not** treated as a
   ground for rejection. **(r)**, **(u)**, **(aa3)** and **(bb4)** reject a shared date when the date is a
   *sorted gate*, because two artefacts then ring the same bell for the same reason. A six-month default
   is the absence of a bell; session 14's own default (2027-03-16) is shared by five hand-authored
   lessons and three segment lessons, and nothing was wrong with it.

**Consequence for the checker:** 2027-03-17 is 181 days out, so this module adds **nothing** to
`check-classroom-curriculum.py`'s 30-day horizon. The four items it reports stay four, and all four
remain by design.

## 11. The Scraper interest seed

**Added: `topic-landscape-compute-and-the-rack`, twelve terms.** And the gap it fills is not a residue
— it is the same asymmetry the module is about, reproduced inside the scraper's own roster.

### 11a. The denominator, counted against both arrays per §10.6 (bb5)

`SCRAPER_INTEREST_TOPIC_SEEDS` holds **41 seeds / 270 terms**; `SCRAPER_SEGMENT_SEEDS` holds **29
lenses / 249 terms**. **519 raw, 494 distinct** — and it reconciles exactly: 267 distinct in the topic
array plus 227 the lens array adds is 494. Counting one array alone would read 270 and mis-score every
term the lenses already hold.

### 11b. The label says covered and the score says otherwise

Two lenses look like coverage — `seg-gpu-silicon` (`gpu`, `accelerator`, `blackwell`, `rubin`, `hbm`,
`tpu`, `ai chip`, `xpu`, `nvlink`) and `seg-rack-power` (`rack pdu`, `busway`, `bus bar`, `busbar`,
`power distribution unit`, `remote power panel`, `starline`, `whip`). §10.6 **(gg9)** is the standing
warning against the label-level glance, and here is what the score returns:

| Vocabulary | Held? |
|---|---|
| The incumbent's roadmap — `blackwell`, `rubin`, `nvlink` | **all exact** |
| The first challenger's — `instinct`, `helios`, `rocm`, `epyc`, `mi355x` | **all zero** |
| The channel — `odm`, `odm direct`, `white box`, `contract manufacturer`, `server oem`, `rack oem` | **all zero** |
| The standards body — `open compute project`, `ocp` | **zero** (`open rack` is held, as a power-shelf form factor) |
| The unit of competition — `rack-scale`, `reference architecture`, `performance per watt` | **all zero** |
| The incumbent's *next* generation — `kyber` | **zero**, while the previous two are exact |

**So the roster is not merely thin here — it is biased in the same direction as the market it observes.**
A digest scored on this seed set bands the incumbent's product news and is blind to the challenger's,
on a segment whose registry typed that challenger on measured evidence. **A scraper that can only see
the incumbent will keep confirming the incumbency it was meant to help measure.** That is a new class
beyond (gg9)'s half-seeded metric pair: not a missing half of one pair, but a systematic tilt across a
whole roster, and it is the sharpest reason yet that the seed audit must be run at term level.

### 11c. Twelve terms taken

`ODM` · `contract manufacturer` · `server OEM` · `rack-scale` · `Instinct` · `Helios` · `ROCm` · `CUDA`
· `Kyber` · `Open Compute Project` · `performance per watt` · `reference architecture`

Three of the twelve exist to correct the tilt directly: `Instinct`, `Helios` and `ROCm` give the
challenger the three axes the incumbent already has in `blackwell`, `rubin` and `nvlink`. `CUDA` and
`ROCm` are taken **together** on purpose — seeding one without the other is exactly the half-seeded
pair (gg9) recorded, and this pair is the segment's actual software contest.

### 11d. Eight drops, each with its reason

| Dropped | Reason |
|---|---|
| `ODM Direct` | **Near-duplicate.** `ODM` catches it, and the roster's own convention for this shape is the bare acronym — `psu`, `bbu`, `tpu`, `xpu`, `ors` are all seeded bare |
| `white box` | **Same channel, one layer of jargon down.** Seeding both bands one story twice |
| `Vera Rubin` | **Roster consistency.** `rubin` is already exact in `seg-gpu-silicon`; the two-word form double-counts against a convention the roster set |
| `EPYC` | **Wrong market.** It names the socket where that member is an incumbent co-leader at 34.5 per cent, not the accelerator where it is the challenger. This segment is defined as the rack and its power ask |
| `MI355X` | **Superstring churn.** A part number inside `Instinct`; part numbers change every generation and the line name does not |
| `qualified vendor` | **Already held** as `pre-qualified vendor`, which contains it |
| `allocation` | **Generic and partially held** (`cost allocation`). A `GPU allocation` form would double-count the held `gpu` |
| `NVL72` | **Superstring.** Contained by `rack-scale` and adjacent to the held `nvlink`; a rack part number rather than a market term |

### 11e. The standing debts, re-checked

- **`restart` still scores zero across all 494 distinct terms** — a **ninth** consecutive session
  unseeded. An S2 session may only add its own `topic-landscape-<segment>` seed, so it stays the
  developer's.
- **Session 12's six terms assigned on split grounds to `topic-aidc-landlords`** are still not in that
  seed, which has not been edited since session 6 — a **fifth** session. Same jurisdiction, same answer.
- **The `topic-landscape-*` shortfall**: **eight** seeds against **fifteen** built landscapes before this
  session, counted as quoted `key:` literals. This session makes it nine against sixteen, so the
  shortfall is unchanged at seven. It needs one developer pass, not seven S2 sessions.

## 12. Verification

**Pristine HEAD baselines captured before any edit**, and the after column measured on the finished
commit.

| Check | Baseline (v06.35r, pristine) | After |
|---|---|---|
| `node --check` on `.js` copies of `Classroom.gs` and `Scraper.gs` | OK / OK | **OK / OK** |
| `scripts/check-gas-inner-scripts.js` | 9 files, 86 blocks, all clean | **unchanged** |
| `scripts/check-classroom-content.py` | **0 errors / 0 warnings**, 50 lessons, 8 tracks, 142 gate cases, module assertion **24** | **0 / 0**, 50 lessons, 8 tracks, 142 gate cases, assertion **25** |
| `scripts/check-classroom-curriculum.py --strict` | no structural findings, 28 stale pins, **4** items due for review | **no structural findings**, 28 stale pins, **4** due — this module at 2027-03-17 adds none |
| `scripts/check-classroom-pipeline.py --selftest` | 13 fixtures, 0 failures | **13 / 0** |
| `scripts/check-classroom-pipeline.py --base origin/main` | — | **P1 x 4** (the two plan files, the analysis markdown, the content checker, `Scraper.gs` and its version file) and **P2 x 9** (the below-the-fence module and the registration line). **No P3, no P5, no P7, no P8, no P12** |
| `scripts/build-classroom-segments.py --check` | **6 due**, this segment among them differing in `read-next` **and** `what-is-bought-and-on-what` | **5 due** — predicted as 5 before the run and confirmed by it (`changed: read-next, what-is-bought-and-on-what; no pin moved`) |
| `scripts/check-readme-tree.py` | 0 findings | 2 drifted displays after the two GAS bumps, synced with `--fix`, **0 findings** |

### 12a. Pre-splice simulations, all run before the module entered the file

| Simulation | Result |
|---|---|
| Section ids and order against §10.6 | **exact match**, nine ids in the spec's order |
| Micro-markup in plain fields (the content checker's own `PLAIN_DOC_FIELDS` / `PLAIN_DOC_LISTS` rule) | **0 findings** |
| Every `glossary[]` entry actually used as a `{{term}}` | **8 of 8 used**, and **no `{{term}}` emitted that the glossary or the concepts registry lacks** |
| Pure ASCII across the whole literal | **100 %** |
| Strict JSON round-trip | OK, 532 lines |
| Quiz answer indices in range and varied | **3, 1, 2, 0, 3, 1, 2** |

### 12b. The render, at both tiers, through the real serving path

A single Node process serves the scratch site and the `/__gas` route on one port (the page's CSP
`connect-src` is `'self'` plus Google hosts, so a shim on a second port is refused), with the
`PROJECT` region of `Classroom.gs` loaded into a `vm` context and the handlers called through the
context object.

- **Contributor: 9 of 9 sections, 43,782 rendered characters, ZERO page errors**, zero unresolved
  `{{…}}`, zero literal asterisks, zero backticks. The only non-ASCII characters in the whole rendered
  DOM are the page's own `·`, `—` and back-arrow — §10.6 **(hh7)**'s class retired by construction.
- **Analyst: denied at the server on both ops** (`gop=index` and `gop=doc` return `ROLE_DENIED`), and
  **0 of 9 section nodes in the DOM** at 66 characters total.
- **Both counters moved across the fix round, as §7.47 demands**: the `PROJECT` region went
  **3,559,602 → 3,560,190 bytes** and the render **43,179 → 43,782 characters**.

### 12c. The screenshots caught SEVEN defects, for a tenth consecutive session

Every checker above passed 0/0 **before** these were found, and no checker can reach any of them.
Five are the recount-or-enumeration class **(ee7)** / **(ff6)** named; two are the sharper **(hh7)**
class, where the prose asserts something the content beside it refutes.

| # | Section | The defect | The fix |
|---|---|---|---|
| 1 | `who-dominates…` and `what-the-record…` | Both called the two share ranges **"unattributed"** — and the very next paragraph, plus **ledger row 5**, says one of them is sourced to *IDC-cited estimates*. The module refuted itself twice | Say what they are actually sourced to, and that neither names a publication |
| 2 | `who-threatens` | *"The three parties doing the threatening are the three with no dossier here"* — but the sentence immediately before shows **HPE drifting from 6.8 per cent to 3.0**. It is the peer being beaten, not a threat | Name the two that threaten and the one that does not, separately |
| 3 | `each-players-bet` (sales) | *"Three of these four bets are about where a company chooses to stop"* — then enumerates **four** | "All four" |
| 4 | `each-players-bet` (intro) | *"four rows, which for once is the shape the spec asks for"* — the spec's shape is one row per incumbent and challenger, which on this roster is **three**, and the next two sentences say so | State three-plus-one, which is what the table is |
| 5 | `the-indicators` (sales) | *"Only two of these seven have a date you could put in a diary, and both belong to the same company"* — **not one of the seven does**. Every dated cell in the table is a quarter or a half-year, the two Flex rows included | "Not one of these seven carries a date you could put in a diary", with the kinds of quarter enumerated |
| 6 | `the-sellers-play` | *"calibrated to under a fifth of the market"* — **no figure in the module supports it**. The measured split is 27.1 points across the three branded OEMs the corpus can name against the channel's 50.2 | Use the measured numbers |
| 7 | `what-the-record…` and a drill card | *"four different dates spanning fourteen months"* — 27 December 2025 to 30 June 2026 is **just over six** | Six-month window, with the growth rate that makes even six months material |

Developed by: LightAISolutions
