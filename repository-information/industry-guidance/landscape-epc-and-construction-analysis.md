# Landscape — EPC and Construction — Analysis & Module Source

> **Not deployed.** This file is the source of truth for the in-app guidance module
> `landscape-epc-and-construction-2026-09` (`guidanceDocLandscapeEpcAndConstruction_()` in
> `googleAppsScripts/Classroom/Classroom.gs`, lane **The Value Chain**, tier **contributor**).
> Written 2026-09-16 as S2 session 14 — the **fourteenth** landscape and the **twenty-third**
> guidance module. Spec: `CLASSROOM-CURRICULUM-PLAN.md` §10.6; brief:
> `INTEGRATED-REMEDIATION-PLAN.md` §7.43.

## What this is

A **corpus-synthesis** landscape: no ingested document and no new research. Every claim traces to
one of the segment's nineteen member dossiers at the profile version recorded in §8, to
`profiler-segments.json`, or to `profiler-graph.json`. The developer's 2026-09-07 exception
(`INTEGRATED-REMEDIATION-PLAN.md` §7.2, decision 2) is what allows a guidance module to name and
rank covered companies; the guidance is still to a **group** — the BESS or AIDC-power seller
reading it, about the parties that decide whether what they sell ever gets installed.

## The segment as measured

All figures re-derived from the files on **2026-09-16**, not copied from the brief (§10.6 **(aa4)**).

| What | Measured |
|---|---|
| Members | **19** — **16** incumbents, **2** challengers, **1** adjacent. The most incumbent-heavy roster in the taxonomy |
| Incumbents | `turner-construction`, `hitt`, `dpr`, `holder-construction`, `whiting-turner`, `mortenson`, `kiewit`, `bechtel`, `black-veatch`, `burns-mcdonnell`, `quanta-services`, `rosendin`, `primoris`, `mastec`, `solv-energy`, `blattner` |
| Challengers | `mccarthy`, `samsung-ct` |
| Adjacent | `strata-clean-energy` |
| Chain position · tier | **10 · build** |
| Registry `notes` | **absent** — as at `clean-firm-and-nuclear` (§10.6 **(aa2)**), `neoclouds` (**(cc1)**) and `capital` (**(dd1)**). Nothing explains a sixteen-incumbent roster, so the shape is measured rather than read |
| Buying criteria | **6** — the joint maximum in the registry |
| Edges among members | **53** — **45 curated**, 8 derived-only. **31 % of the 171 possible pairs**, against `capital`'s 13 edges among 8 |
| Curated typings | **57 across 45 pairs**: `competitor` **39**, `partner` **16**, `investor` 1, `other` 1. Untyped curated pairs: **0** |
| `competitor` edges | **35** — **20.5 %** of all possible pairs. Four are typed `competitor` in **both** directions |
| Shape of the competitor graph | **One component of 18 that is two markets joined by two seams** (§3c). Cut one firm (`mortenson`) and one edge (`mccarthy`↔`strata-clean-energy`) and it falls into **6 + 10 + 1** |
| Members with no edge at all | **1** — `samsung-ct`, a challenger with **zero** links of any kind to the other eighteen |
| ENR 2026 Top 400 rank available | **13 of 19** — 12 of the 16 incumbents, plus one challenger. **6 members are absent from the table entirely** |
| Shared members | **8 of 19**, across **6** other segments, **5** of which have a built landscape |
| Shared memberships · inversions | **11 memberships, 10 inversions (91 %)** — the highest rate any landscape has measured. **9 downward, 1 upward, 1 equal** |
| Shared incumbents | **6 of 16 — and all six are `adjacent` in every other segment they appear in, 6 of 6 with no exception** (§4c) |
| `policyExposure` entries | **21 across 19 members** — **1.1 per member**, the thinnest fence any landscape has met. **10 of the 19 carry none at all** |
| Dated policy entries | **6 of 21**, and **not one is in the future**. Status distribution: **20 `in-effect`, 1 `announced`** |
| Future day-level dates anywhere in the segment | **4**, across two dossiers: 2026-09-21, 2026-11-02, 2027-12-31, 2028-04-30 — every one rejected (§10) |
| Buying criteria with a taught owner | **3 of 6 resolve, 3 print a dash — and the three dashes have three different diagnoses, one of them a mechanism no previous landscape has met** (§3a) |
| `READ_NEXT` | `how-a-storage-project-happens` (**built**, §7 row 10) · `the-campus-as-a-power-project` (**built**, §7 row 9) · `where-the-chain-breaks` (**built**, §7 row 17, v06.22r) — **all three built**, verified by id on the day (one of seven segments whose `READ_NEXT` is now fully built). **And the committed segment lesson renders all three as `(planned)`** — (aa5) at three lessons in one section, the strongest instance the programme has recorded, and the reason this segment was already due |
| Public vs private | Re-counted from the `ownership` field: **5 public** — four US-listed (PWR, PRIM, MTZ, MWH) plus one foreign-listed (`samsung-ct`, KRX) — **2 subsidiaries** (`turner-construction` inside Hochtief, `blattner` inside PWR) and **12 private**. Seven members' files carry an explicit *publishes no …* statement (`dpr`, `holder-construction`, `kiewit`, `mccarthy`, `strata-clean-energy`, `turner-construction`, `whiting-turner`); **four name backlog specifically** (`burns-mcdonnell`, `kiewit`, `mccarthy`, `whiting-turner`) |

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

1. `who-dominates-and-on-what-basis` — prose — one publishable ranking, two markets, and the column that matters
2. `who-threatens` — prose — two challengers, one of them typed against nobody
3. `each-players-bet` — table — eighteen rows, sorted into the two markets
4. `the-indicators` — table — what to watch, dated only where the record dates it
5. `the-sellers-play` — callout — the storage path and the AIDC-power path
6. `claims-ledger` — ledger — every claim to a dossier at its profile version
7. `what-the-record-does-not-say` — callout — the absences, each stated by the dossier that has it
8. `drill` — flashcards
9. `check-yourself` — quiz

## 1. Executive read

**The roster invites a ranking and the registry gives it sixteen incumbents on four incompatible
kinds of claim.** Session 12's `neoclouds` was one incumbent against six challengers; session 13's
`capital` was four incumbents whose bases named four different instruments. This is the inverse of
both: **sixteen of nineteen members are typed incumbent, the registry carries no `notes` field, and
the bases divide into third-party rankings on named scales (ENR #1/#2/#4/#5/#6/#7, BD+C #1, `#1 US
electrical contractor at 3.7× the runner-up`, `#2 US BESS builder 2024 at 4.6 GWh`), gigawatt and
megawatt volumes (11 GW of gas EPC, 15+ GW of data-centre power, >21 GW built, 75,000+ MW),
dollar volumes ($13B on an 82 % mission-critical mix, a record $21.4B backlog), and role claims
carrying no number at all** (*the craft-labor chokepoint*, *the interconnection specialist*, *the
single largest procurement channel*). Ranking sixteen firms across four scales would be choosing a
publisher rather than reading the record.

**But unlike `capital`, a ranking here IS publishable — on exactly one basis, for exactly 13 of the
19, and only if the column that carries the information is published with it.** The ENR 2026 Top
400 Contractors table gives a rank to **thirteen** members: Turner #1, Bechtel #2, Kiewit #4,
Whiting-Turner #5, MasTec #6, DPR #7, HITT #8, Mortenson #10, Holder #12, McCarthy #22, Burns &
McDonnell #35, Black & Veatch #49, SOLV #66. **Six members are absent from that table entirely** —
Quanta, Rosendin, Primoris, Blattner, Samsung C&T and Strata. And the level is the least
informative column in it, because **the Top 400 as a whole grew 11.8 % in FY2025 while the
telecom/data-centre category inside it grew 86.4 %**: one table, two populations, moving at seven
times different speeds. That is why Whiting-Turner **fell** from #4 to #5 while adding USD 1.4bn of
revenue, and why Mortenson rose twelve places, Clune thirteen and Fortis eleven in the same edition.
**The movement is the signal; the level is the noise** — and a member says so about itself: *"In a
league table of self-reported revenue, relative position is the only comparable measure, and it is
moving the wrong way."*

**Two members put the list-dependence beyond argument.** Burns & McDonnell is **#1 in ENR Power
design revenue for eleven consecutive years** and **#35** on the Top 400 Contractors. Black & Veatch
is **#1 Hydrogen, #1 O&M, #6 Power, #8 Water, #14 design — and #49** on the Top 400. **Two different
members both carry "#6"**, on two different lists: MasTec #6 Top 400 Contractors, Black & Veatch #6
Power. HITT is **#1** on ENR's 2025 telecom/data-centre list and **#8** on the Top 400. The corpus
states the rule in its own words, in a member's own dossier, about its own rank: *"ENR publishes
several revenue bases across different lists, so 'ENR rank' is meaningless without naming the
list."*

**And then the graph says the one publishable ranking mixes two markets in a single column.** Fifty-
three edges connect the nineteen, forty-five curated, carrying fifty-seven typings of which
**thirty-nine read `competitor`** — a density `capital` never approached. The competitor subgraph is
one component of eighteen, and it is **two neighbourhoods joined by exactly two seams**: cut one
firm and one edge and it falls into a **six-firm data-hall general-contracting market** (DPR, HITT,
Holder, Turner, Whiting-Turner, McCarthy) and a **ten-firm power-and-energy EPC market** (Bechtel,
Black & Veatch, Burns & McDonnell, Kiewit, MasTec, Primoris, Quanta, Rosendin, SOLV, Strata), with
Blattner hanging off the second by one edge. The two seams are **Mortenson**, the only member typed
`competitor` on both sides, and the single edge **McCarthy↔Strata**. The Top 400 order runs straight
across that boundary — #1 and #5 are in the first market, #2, #4 and #6 in the second — so the one
ranking the record supports is measuring two different contests at once.

**The nineteenth member is the sharpest fact in the file.** `samsung-ct` is a registered challenger
with **zero edges of any kind** to the other eighteen — not a curated typing, not a derived
cross-mention. A challenger the graph cannot see challenging anybody.

**What a seller should take from this, in one line.** In the data-hall market you are selling to a
construction manager that will not buy your equipment — the owner furnishes it — so the decision you
are competing for is *constructability*, and the relationship that carries it is *repeat*. In the
power market you are selling to an EPC that may hold the purchase order itself, and the decision is
*allocation* — turbine slots, transformer capacity, craft hours. Establish which market a
counterparty is in before you establish anything else, because **Mortenson is the only one of the
nineteen that is credibly in both.**

## 2. The split — decided and written before any other section, per §10.6 (j)

This landscape has **nine** neighbours with a claim on part of its ground: three built public
`READ_NEXT` lessons, five built landscape modules sharing a member, and one registered guidance
module whose subject is the constraint this segment sells around. That is the joint record with
session 6's `aidc-developers-and-landlords`. The split was drawn against each before any other
section of the module was written.

### 2a. `how-a-storage-project-happens` — the lesson that teaches three of this segment's six buying criteria, and the reason one of the dashes is a NEW mechanism

The lesson is **built** (§7 row 10), **public**, and sits first in this segment's `READ_NEXT`. It
teaches, in its own words and naming nobody:

- **`percentage-of-completion` revenue recognition on a cost-to-cost basis** — as a `{{term}}`, with
  the argument that *"revenue is recognised against an estimate, so the estimate is the whole
  game"*, and that backlog *"is not one number, and its mix inverts the intuition"*
- **the performance bond** as the place risk transfer stops beyond the liquidated-damages cap
- **owner-furnished equipment** — *"On grid-storage sites the cells are usually owner-furnished: the
  builder installs what the owner already bought"* — and, from the builder's side,
  *"Compatibility, not selection"*
- **craft labour as the one un-procurable input** — *"Every other input can be procured; craft labour
  cannot, because it is already employed somewhere and the training pipeline takes years"*
- **commissioning** as *"the theatre of deliberate failure"*, through the capacity test

**That is criterion 2, criterion 3, criterion 4 and half of criterion 5 — taught vendor-blind, in a
lesson this segment already names.** §10.6 **(t)** therefore fires, and §7.23's test holds exactly
where it held at rows 13 and 16: the lesson teaches the *instrument* naming nobody, and the module
says **who holds it, at what size, and on which of the two markets it is measured**. The module
carries no lifecycle timeline, no overrun mechanics, no bond-and-cap explanation and no
commissioning ladder. It says which four of the nineteen self-perform craft at scale, which one has
built the largest craft platform in the country, and which six publish no backlog at all.

**And the same measurement produces the session's sharpest finding.** The public segment lesson
prints a **dash** against criteria 4 and 5 — while the lesson in its own `READ_NEXT` teaches
`percentage-of-completion`, the performance bond and `owner-furnished` explicitly. That is neither
**(y3)**'s real curriculum gap nor **(cc3)**'s disjoint-set keyword artefact. It is a **fourth
mechanism: a lexicon coverage failure** (§3a).

### 2b. `the-campus-as-a-power-project` — the lesson that owns the campus, and leaves the builders unnamed

Built (§7 row 9), public, second in `READ_NEXT`. It teaches the campus development lifecycle on
three clocks, the named projects as worked examples, who is in the room at each stage, and how to
read an announcement. Its `the-named-projects` table already carries the *shape* this segment's
firms occupy — *"A standing generation venture of a turbine maker, an EPC contractor and a merchant
generator, holding reserved turbine slots against years of backlog. **Not named in this corpus.**"*
That parenthetical is this module's cue: the venture is NRG + GE Vernova + **Kiewit**, and the
reserved slots are the moat Kiewit's own file calls *"the scarcest capability set in the AI-power
complex"*. So session 6's **(s)** generalises once more, in session 9's **(z2)** form — **the lesson
names the archetype and declines the party; the module supplies the party** — and the module does
not re-teach the lifecycle, the shell-versus-turnkey ladder, or the `{{powered shell}}` rungs.

### 2c. `where-the-chain-breaks` — built one session ago, and the reason this segment was already due

Built at §7 row 17 (v06.22r), public, third in `READ_NEXT`. It owns the twelve weak points, the four
physical causes, who owns each failure and where the warranties stop. This module takes **none** of
it. What matters here is mechanical rather than editorial: registering that lesson changed what this
segment's `read-next` renders without regenerating the segment, so `epc-and-construction` has been
**due** since v06.22r on a stale `lesson_ref` — open item **(v)** at a sixth segment, and the reason
this session's `--check` forecast is the *clear* case rather than the *enter* case (§12).

### 2d. Five built landscape neighbours, 91 % inversion — the highest any landscape has measured

`clean-firm-and-nuclear` (3 shared, 3 inversions), `storage-developers-and-ipps` (2, 2),
`aidc-developers-and-landlords` (2, 1), `grid-equipment` (1, 1) and `in-hall-power` (1, 1) — plus
`assurance` (2, 2), whose landscape is **not** built. **Eleven shared memberships, ten inversions
(91 %), nine downward, one upward, one equal.** The direction is the finding, not the rate, and it
is §4c's new instrument. Each module's own ground is declined here: `clean-firm-and-nuclear` owns
the reactor and the restart, `grid-equipment` the transformer queue, `in-hall-power` the UPS room
and the room's accessories, `storage-developers-and-ipps` the developer's own book, and
`aidc-developers-and-landlords` the landlord's shell. This module owns **only** the act of building
them, and the twenty-two omissions it accepts are enumerated in §2g.

### 2e. `grid-equipment-shortage-2026-09` — the constraint this segment sells around, and a registered module owns it

The module owns the long-lead equipment shortage: the transformer and switchgear queue, the lead
times, the allocation mechanics. Quanta is the sharpest collision in the file, because its own
dossier records a **$500-700M programme to nearly double HV transformer manufacturing capacity by
2028** and a **Hyosung HICO JV making 800 kV-class breakers in Pennsylvania** — a contractor moving
into the shortage module's subject. The split: the registered module keeps **why the queue exists
and what it costs**; this landscape keeps **which contractor decided to become its own supplier, and
what that does to its bids**. No lead-time table, no allocation mechanics, no queue arithmetic enters
here.

### 2f. The lane opener, and the two markets it cannot see

`reading-the-graph` (S1, public) teaches what an edge is, the seven types and their inverses, and
that a role and an edge type are different axes. This module is the strongest confirmation the lane
has produced of that last claim — **sixteen members share one role and the graph splits them into
two markets** — and it says so in `who-dominates-and-on-what-basis` by pointing at the opener rather
than re-teaching it.

### 2g. The omissions, enumerated so a later revision cannot import them

Twenty-two things this module deliberately does not carry, each owned by a named neighbour:

1. The eight-stage storage project lifecycle — `how-a-storage-project-happens`
2. `percentage-of-completion` as a mechanism — same
3. The liquidated-damages cap and the performance bond — same
4. How an overrun hides and why it arrives at once — same
5. Backlog mix quality as an analytical instrument — same
6. Commissioning and the capacity test — same
7. Craft labour as the un-procurable input — same
8. The campus lifecycle on three clocks — `the-campus-as-a-power-project`
9. The powered-shell / turnkey ladder — same
10. How to read a campus announcement — same
11. The twelve weak points of the chain — `where-the-chain-breaks`
12. The four recurring physical causes — same
13. Where the warranties stop — same
14. The transformer and switchgear queue and its lead times — `grid-equipment-shortage-2026-09`
15. The reactor, the restart and the SMR licensing path — `landscape-clean-firm-and-nuclear-2026-09`
16. The UPS room and the room's accessories — `landscape-in-hall-power-2026-09`
17. The developer's own book and the toll — `landscape-storage-developers-and-ipps-2026-09`
18. The landlord's shell and the fence line — `landscape-aidc-developers-and-landlords-2026-09`
19. The transformer manufacturers' own competitive field — `landscape-grid-equipment-2026-09`
20. What an edge is and the seven types — `reading-the-graph`
21. What the independent engineer tests — `bess-bankability-2026-08`
22. Interconnection study procedure for large loads — `large-load-interconnection-2026-09`

## 3. Who dominates, and on what basis

### 3a. First, the curriculum measurement — THREE dash rows, THREE diagnoses, and one mechanism no previous landscape has met

Measured programmatically against the parsed `CRITERION_LEXICON` and `READ_NEXT` blocks of
`scripts/build-classroom-segments.py`, not asserted. `READ_NEXT` for this segment is
`{how-a-storage-project-happens, the-campus-as-a-power-project, where-the-chain-breaks}` and the
generator's eligibility guard admits a lexicon hit only when the mapped lesson is in that set.

| # | Criterion | All lexicon hits | Renders | Diagnosis |
|---|---|---|---|---|
| 1 | Schedule certainty and speed benchmarks | `the-fence-line`(*energiz*) ✗ · **`how-a-storage-project-happens`(*schedule*) ✓** · `how-a-utility-buys`(*commission*) ✗ | *From Site Control to Commercial Operation* | genuine intersection, built |
| 2 | Self-perform craft labour and prefabrication share | **`how-a-storage-project-happens`(*labour*, *craft*) ✓** | same | genuine intersection, built |
| 3 | Commissioning record (L1–L5) and reliability engineering | `bridge-power`(*engine*) ✗ · **`how-a-storage-project-happens`(*commissioning*) ✓** · `how-a-utility-buys`(*commission*) ✗ | same | genuine intersection, built — and the *engine*↔*engineering* false positive the guard drops, exactly as at `capital` |
| 4 | Bonding capacity, backlog quality and project-controls record (percentage-of-completion) | `the-control-stack`(*control*) ✗ · `reading-the-numbers`(*backlog*) ✗ | **—** | **NEW: lexicon coverage failure** |
| 5 | Owner-furnished vs contractor-furnished equipment and the procurement model (open-book OEM sourcing) | `contracts-and-revenue`(*contract*) ✗ · `how-a-utility-buys`(*procure*) ✗ | **—** | **half NEW, half (cc3)** |
| 6 | Safety record (TRIR) and repeat-relationship share | **none** | **—** | **(y3) — a real curriculum gap, and total** |

**The fourth mechanism, and why it is not a variant of the first.** §10.6 **(dd4)** settled that
*mapped-but-unbuilt* is a variant of **(y3)** because both pass the same guard and reach the same
`lesson_ref()`. This is different in kind: **the material of criterion 4 is taught, by a lesson that
is in this segment's `READ_NEXT`, and that lesson is built** — and the row still renders a dash,
because `CRITERION_LEXICON`'s entry for that lesson is
`("epc", "schedule", "construction", "commissioning", "labor", "labour", "craft")` and criterion 4
contains none of those seven words. Verified across all 48 registered lessons:
`percentage-of-completion` appears in **four** lessons, one of which is
`how-a-storage-project-happens`; `performance bond` appears in **exactly one**, the same lesson. The
intersection did not fail. **The keyword table did.** That is a fixable generator gap rather than a
curriculum gap or an artefact, and it is the first dash row in fourteen landscapes whose cause sits
in neither the curriculum nor the segment.

**Criterion 5 splits down the middle**, which is worth keeping separately: `owner-furnished` **is**
taught by `how-a-storage-project-happens` (the same new mechanism), while `open-book` appears in only
one lesson in the corpus — `who-buys-storage` — which is **not** in this segment's `READ_NEXT`, so
that half is **(cc3)**'s disjoint-set artefact exactly.

**Criterion 6 is the cleanest (y3) case the programme has recorded, because the gap is total.**
Across all 48 lessons: `TRIR` appears **zero** times, `recordable` **zero**, `incident rate`
**zero**, `experience modification` **zero**, `surety` **zero**. `bonding` appears only inside
generated segment lessons printing a criterion back. **Nothing in the curriculum teaches contractor
safety metrics or repeat-relationship share at all** — and for a segment whose registry names TRIR
as a buying criterion, that is a gap a future Phase 4 row could close. Scope is unchanged: this
module teaches none of the six, and it says which diagnosis produced each dash in its own honesty
section.

### 3b. The bases, sorted — and the one ranking the record supports

Four kinds of claim, counted from the registry's `basis` lines:

| Kind of basis | Members | Example, verbatim |
|---|---|---|
| Third-party rank on a named scale | 13 | `ENR's #1 US contractor six years running`; `BD+C's #1 data-center contractor in 2023–24`; `#1 US electrical contractor at 3.7x the runner-up` |
| Gigawatt / megawatt volume | 6 | `~11 GW of gas EPC`; `15+ GW of data-center power built`; `75,000+ MW` |
| Dollar volume | 4 | `$13B on an 82 % mission-critical mix`; `record $21.4B backlog`; `ENR #7 at $14.0B` |
| Role claim with no number | 5 | `the craft-labor chokepoint of the AIDC buildout`; `the interconnection specialist of the AI buildout`; `the single largest procurement channel into the AI-infrastructure supply chain` |

Members appear in more than one row where their basis line carries more than one kind — which is
itself the point: **the registry does not hold one axis for this segment, and no amount of care
makes four axes into one.**

**What survives the test is one table and one column.** The ENR 2026 Top 400 Contractors rank exists
for **13 of 19** members (12 of the 16 incumbents plus one challenger) and is the only measure any
two of them share:

| Rank | Member | 2025 revenue as ENR counted it | Move | Note from its own file |
|---|---|---|---|---|
| 1 | Turner Construction | $28.3B (from $20.2B) | held, 6th consecutive year | ~42 % of a record $48.9B backlog is data centres |
| 2 | Bechtel | $19.5B (from $15.9B) | retook #2 | Kiewit briefly held #2 in 2024 |
| 4 | Kiewit | $15.3B ENR-counted ($18.2B company-stated) | **down from #3** | passed by a data-centre surge at a firm outside this roster |
| 5 | Whiting-Turner | $14,675.9m (+USD 1.4bn) | **down from #4** | grew 10.4 % against the list's 11.8 % and telecom's 86.4 % |
| 6 | MasTec | $14.3B | — | record $21.4B backlog at Q2 2026 |
| 7 | DPR | $14.0B | **up from #8** | $26.1B of new contracts booked, ~1.9× revenue |
| 8 | HITT | $13.0B | **up from #10** | 82 % of revenue in the data-centre category |
| 10 | Mortenson | $10.85B (from $4.9B in 2023) | **up twelve** | largest single-year move in the top ten |
| 12 | Holder Construction | ~$10.2B | up from #15 (from #30) | **its own file rates this low confidence** — one secondary aggregator against a paywalled original; Forbes reports $8.5B |
| 22 | McCarthy | not published | **down from #20** | 19 → 20 → 20 → 22 across four editions |
| 35 | Burns & McDonnell | $8.6B (+19 %) | up seven from #42 | **and #7 on the Top 500 Design Firms, #1 in Power design eleven years running** |
| 49 | Black & Veatch | ~$5.0–5.1B | — | **and #14 design, #6 Power, #8 Water, #1 Hydrogen, #1 O&M** |
| 66 | SOLV Energy | $951.2M in Q2 2026 alone | — | **and #2 solar contractor per ENR** |

**Absent from the table entirely: Quanta Services, Rosendin, Primoris, Blattner, Samsung C&T,
Strata Clean Energy** — six of nineteen, including the two largest electrical contractors in the
United States. Quanta is #1 on EC&M's 2025 electrical-contractor list at **$13.5B of electrical
revenue, roughly 3.7× #2 Rosendin**, and neither appears on the general-contractor table at all.
**A table that omits the #1 and #2 in the trade that installs the load is not a ranking of this
segment.**

**So the rank is publishable with two conditions attached, and the corpus states both.** First, the
list must be named — *"ENR publishes several revenue bases across different lists, so 'ENR rank' is
meaningless without naming the list"*, from a member's own dossier about its own rank, after a
secondary source called it the *"15th largest domestic builder"* in the same year the Top 400 put it
at 20. Second, the movement must be published with the level, because the level mixes two
populations: **11.8 % growth for the list against 86.4 % for the telecom category inside it.** Read
that way the table says something real and specific — three firms climbed hard on hyperscale books
(Mortenson +12, DPR +1, HITT +2), two fell while growing (Kiewit −1, Whiting-Turner −1), and one
fell twice while calling itself an entrant (McCarthy 20 → 22, in the year the category grew 86.4 %).

### 3c. And then the graph says the ranking covers two markets, not one

**Fifty-three edges connect the nineteen members; forty-five are curated and carry fifty-seven
typings. Zero curated pairs are untyped.** The typings: **`competitor` 39**, `partner` 16,
`investor` 1, `other` 1 — and **thirty-five distinct edges** read `competitor`, four of them typed
that way from both ends. Against `capital`'s thirteen edges and six competitor typings among eight
members, this is a different order of density: **31 % of all 171 possible pairs carry an edge, and
20.5 % carry a rivalry.**

The competitor subgraph is a **single component of eighteen** — so a first reading says one market.
**Cut one node and one edge and it is two:**

| Cut | Result |
|---|---|
| nothing | one component of 18 |
| the edge `mccarthy`↔`strata-clean-energy` | still one component of 18 |
| the node `mortenson` | 16 + `blattner` alone |
| **both** | **10 + 6 + `blattner`** |

The two neighbourhoods are legible without any interpretation:

- **The data-hall general-contracting market — six firms**: `dpr`, `hitt`, `holder-construction`,
  `mccarthy`, `turner-construction`, `whiting-turner`. **Twelve competitor edges among six members — four-fifths of
  every possible pair.** Every one of the six is a CM or design-builder whose product is a
  building; five of the six are in the ENR Top 400 top twelve; and the market's own tell is that
  hyperscalers **dual-source** it, which Turner's file states outright: *"no single builder, even
  the largest, gets an AI gigacampus alone."*
- **The power-and-energy EPC market — ten firms**: `bechtel`, `black-veatch`, `burns-mcdonnell`,
  `kiewit`, `mastec`, `primoris`, `quanta-services`, `rosendin`, `solv-energy`,
  `strata-clean-energy`. **Fifteen competitor edges of forty-five possible pairs — a third**, and the rivalries run along
  *capability* lines rather than revenue: Bechtel↔Kiewit (*"megaproject EPC arch-rival"*, typed from both ends),
  Black & Veatch↔Burns & McDonnell (both directions), Quanta↔Rosendin (both directions), Rosendin↔SOLV,
  Primoris↔Quanta, MasTec↔Primoris.
- **`blattner` is inside the second market by one edge only** — its single competitor typing is to
  Mortenson — because it is a **subsidiary of Quanta**, and its edge to its own parent is typed
  `investor`/`other`, not `competitor`. A wholly-owned arm does not compete with its owner, and the
  graph records that correctly.

**Mortenson is the seam, and the registry cannot say so.** It is typed `competitor` with **three**
members of the GC market (HITT, Holder, Whiting-Turner) and **four** of the power market (Blattner,
Kiewit, MasTec, Primoris). No other member of the nineteen is typed `competitor` on both sides. Its
own file states why in one sentence — *"the only US contractor at scale holding both a hyperscale
data-center building franchise and a fleet-scale power-EPC franchise"* — and the graph is the
independent confirmation: the boundary this module draws is not the module's invention, it is where
the curated typings stop.

**The second seam is one edge and it is the challenger's.** `mccarthy`↔`strata-clean-energy`, typed
`competitor`, dated 2026 — a GC-market challenger against a power-market adjacent, both of them
solar-and-storage contractors in the part of their books that is not the thing their segment role
describes. Remove it and the two markets are disjoint but for Mortenson.

**And the isolate is the other challenger.** `samsung-ct` has **no edge of any kind** to the other
eighteen — the only member of nineteen with a degree of zero. Its dossier explains it without
needing interpretation: the partnership the corpus holds is with its **E&C group** while its US
position sits in a **Trading & Investment** develop-and-sell platform, so the firm appears in this
corpus as an EPC with no US EPC book and a US platform that is *"a developer, not an EPC"* — the
registry's own basis line says exactly that. **A challenger typed against nobody is not a challenge
the record can measure**, and §4 says so rather than sizing it.

## 4. Who threatens — two challengers, and a bench that runs the wrong way

### 4a. `mccarthy` — the challenger the graph believes, and the one whose own file argues its role

Twelve edges inside the segment, the joint-highest degree of the nineteen, four of them typed
`competitor` — and the registry's `challenger` is earned rather than placed. Its own file makes the
case in its first judgment: **418 MW of data centres delivered against more than 2 GW in planning,
design and preconstruction** — a five-to-one ratio ahead of it — *"entering the hyperscale
data-centre market rather than competing in it as an incumbent."* Every named hyperscale client on
its site is one company, and its largest engagement (468 MW at the Lighthouse campus) is reached
**through a joint venture with the #1 firm on the table**, which its dossier calls the mechanism by
which it reached a gigawatt campus at all: *"McCarthy is the smaller partner by ENR rank — 22 against
1 in the 2026 Top 400."* The route it is attacking on is the one the ranking cannot see: a 100 %
employee-owned self-perform stack across concrete, full MEP and civil, a century of healthcare work
in occupied facilities, and a renewables group scaled *from $20M to more than $2B* whose builder was
made president and COO of the holding company in August 2026. **The renewables group, not the
data-centre group, is the business the record says it bet on.**

### 4b. `samsung-ct` — a registered challenger with zero edges, and the honest thing to do is say so

No curated typing, no derived cross-mention, degree zero out of eighteen possible counterparties.
The registry's own basis line contains the reason: *"top-tier global EPC with BESS execution in
Australia and the Middle East; **the US platform is a developer, not an EPC**."* The dossier's
sharpest fact is a negative: a **~10 GWh global cooperation agreement** signed with the E&C group in
January 2025 that, nineteen months on, has *"produced no publicly attributed project anywhere"* —
and the US value pool sits with a different group of the same parent, whose develop-and-sell model
hands battery procurement to the buyer **after** the sale. The corpus records the consequence
concretely: a Texas pipeline this member originated was bought by someone else, whose owner then
signed **503 MWh** of supply with a different supplier entirely. **So the threat section does not
size this challenger. It says what the record holds — a paper relationship, an unconverted volume,
and no edge the graph can draw — and names the two events that would change it** (the LS ELECTRIC JV's
500 MW Texas BESS supplier decision, and any first attributed E&C project).

Session 4's **(l)** wanted a registry `notes` field to explain a structural placeholder; there is
none here, so the measurement substitutes for it, as at **(aa2)**: a challenger with degree zero is a
*legibility* fact about the corpus's reach into a Korean conglomerate, not a market structure — which
is session 12's finding applied to a single member rather than to a whole roster.

### 4c. The bench inverts DOWNWARD, six of six, and that is a new instrument

**Eight of the nineteen belong to another segment. Eleven memberships, ten inversions — 91 %, the
highest rate any landscape has measured** (the previous high was **(aa2)**'s 74 %). But the rate is
not the finding. **The direction is uniform and it runs the opposite way from every previous
landscape's.**

| Member | Here | Elsewhere | Direction |
|---|---|---|---|
| `bechtel` | incumbent | `clean-firm-and-nuclear` adjacent | **down** |
| `black-veatch` | incumbent | `assurance` adjacent · `clean-firm-and-nuclear` adjacent | **down** ×2 |
| `burns-mcdonnell` | incumbent | `assurance` adjacent | **down** |
| `kiewit` | incumbent | `clean-firm-and-nuclear` adjacent | **down** |
| `quanta-services` | incumbent | `grid-equipment` adjacent | **down** |
| `rosendin` | incumbent | `in-hall-power` adjacent | **down** |
| `samsung-ct` | challenger | `aidc-developers-and-landlords` adjacent · `storage-developers-and-ipps` adjacent | **down** ×2 |
| `strata-clean-energy` | adjacent | `aidc-developers-and-landlords` adjacent · `storage-developers-and-ipps` **challenger** | equal · **up** |

**Every one of the six shared incumbents is `adjacent` in every other segment it appears in — six of
six, with no exception.** Session 10's **(aa2)** established the converse instrument: *when a
segment's adjacents are 100 % ranked elsewhere, the segment is a **product** other industries make
rather than a **layer** other industries sell into.* This is its mirror, and it reads:

> **When a segment's incumbents are demoted to `adjacent` in every other segment they touch, the
> segment is the services layer the rest of the chain borrows a builder from.**

That is what the registry looks like from the build tier's side, and the lone upward inversion is the
exception that confirms it: `strata-clean-energy` is a **developer** with a self-perform EPC arm, so
it is ranked where it develops (a `challenger` in `storage-developers-and-ipps`) and demoted where it
builds (an `adjacent` here). **The direction tracks where the firm's balance sheet is, not where its
crews are.**

### 4d. Where the pressure actually comes from, and it is not either challenger

Neither challenger is taking anything from the sixteen on this record. The pressure the corpus
documents is **vertical**, and it runs in both directions:

- **Upward into the equipment layer.** Quanta — a contractor — is spending **$500–700M to nearly
  double HV transformer manufacturing capacity by 2028** and making 800 kV-class breakers in a JV in
  Pennsylvania. Its own file states the consequence plainly: *"if the #1 buyer of grid equipment
  self-supplies from 2028, the scarcity rents currently flowing to Hitachi/Siemens Energy/GE Vernova
  erode at the margin, and Quanta's EPC bids gain a schedule weapon competitors can't match."*
- **Upward into the procurement layer.** Turner's SourceBlue runs an **open-book OEM buying desk at
  roughly $1B a year** on the long-lead electrical and mechanical packages, and its own file calls
  the procurement-and-engineering layer *"the durable advantage, not construction labor."*
- **Downward from the owners.** Hyperscalers dual-source GC capacity by design — three GCs on one
  Meta campus, four buildings split across three GC entities on another — which Turner's and DPR's
  files both record, DPR's as *"hyperscalers are deliberately maintaining a bench of substitutable
  top-tier GCs."*
- **And sideways, from a firm that is in both markets.** Mortenson's own file names its rivals on
  each side and the gap it is exploiting: *"Renewables rivals lack a hyperscale building book;
  building rivals subcontract most gigawatt-class power scope."*

**The module's own judgment, labelled as analysis: the competitive question in this segment is not
share, it is whether a firm holds the scarce input or rents it.** Three scarce inputs are named in
the corpus — **craft hours** (Quanta at 69,500 employees, >80 % self-perform, ~$250M a year of
training; DPR at ~6,000 in-house craft; Rosendin's 7,000+ MW of annual prefabrication capacity),
**turbine and transformer allocation** (Kiewit inside GE Vernova's slot allocation; Quanta becoming
its own supplier), and **the owner relationship** (Holder at >90 % repeat, HITT inside the world's
largest data-centre market). Everything else on this roster can be subcontracted.

## 5. Each player's bet — eighteen rows, sorted into the two markets

One row per incumbent and challenger, grouped by the market the graph puts it in, then in registry
order. **Every row is analysis**, read off that dossier's own `strategyRead` and labelled as
judgment. Eighteen rows — sixteen established positions and two challengers — which is the inverse
of `neoclouds`' one-against-six and a scale no previous landscape's bet table has carried.

The table as authored in the module is reproduced in the module JSON; the ordering decision is
recorded here: **the market grouping comes before the registry role**, because two incumbents in
different markets are not comparable and a reader sorting by role would conclude they are. Mortenson
is placed in a third group of one, labelled as the seam.

## 6. The indicators

What to watch, dated **only where the record dates it**. The constraint this section runs into is
§10's: **the corpus holds four future day-level dates for nineteen members, and the segment's
`policyExposure` fence holds none at all.** So the indicators are mostly *events with owners* rather
than *dates*, and the section says so in its own first line rather than implying precision it does
not have.

| Indicator | Dated | Owner | Why it moves this module |
|---|---|---|---|
| The next ENR Top 400 edition | **annual, late May** (the 2026 edition published 2026-05-22) | ENR | The one publishable ranking, and the *movement* column is the whole signal |
| Quanta's transformer programme reaching production | **by 2028** (company-stated) | `quanta-services` | A contractor becoming its own supplier changes what an EPC bid can promise |
| The first attributed Samsung C&T E&C project | undated | `samsung-ct` | The only thing that would give the segment's second challenger an edge |
| The LS ELECTRIC JV's 500 MW Texas BESS supplier decision | **2026–2028** (window, not a date) | `samsung-ct` | The first US battery purchase order this member could itself issue |
| Primoris's third overrun disclosure, or its absence | Q3 2026 results, **estimated ~2026-11-02 and explicitly unconfirmed** | `primoris` | Whether the renewables-EPC control failure is contained |
| The OBBBA placed-in-service cliff | **2027-12-31** | `mccarthy`, and five others by exposure | Decides the renewables half of the power market's post-2027 book |
| Mortenson's Hermantown re-entitlement | undated, in litigation | `mortenson` | Whether the seam firm gains an origination channel no GC peer has |
| Holder's absence from the newest mega-campus awards | undated | `holder-construction` | Its own file cannot distinguish lost share from NDA-bound share |
| A named hyperscaler or gas project at Strata | undated | `strata-clean-energy` | The test of the segment's only adjacent's 2026 repositioning |
| Whether Kiewit's Key Bridge off-ramp repeats | 2026-04-30 (**past**) | `kiewit` | Priced discipline or lost work — the file reads it as the former |

## 7. The seller's play — §10.10's two paths

**The organising measurement, and it decides everything below: on this roster the builder almost
never holds the purchase order, and five dossiers say so in their own words.** Blattner:
*"install infrastructure, not a procurement door: owners furnish the batteries on its sites."* SOLV:
*"a constructability and services channel, not a procurement principal: every verified flagship BESS
was owner-furnished."* MasTec: *"most equipment is owner-furnished."* Rosendin is the ecosystem's
*"build-side"* — the company that *"physically installs what the app's suppliers sell."*
Whiting-Turner *"self-performs nothing"* and holds its MEP expertise *"as a coordination and
commissioning function."* **So this landscape is a map of who can refuse you, not a target list** —
and the refusal is technical rather than commercial.

**What the builder decides instead is whether your hardware is buildable, and it decides it once.**
The `how-a-storage-project-happens` lesson states the principle vendor-blind — *"Compatibility, not
selection"* — and this roster is where it has a size: Blattner has installed **3,300+ storage
containers** and its own file names the qualification list exactly — *"container handling, foundation
and spacing standards, termination and commissioning interfaces"*. SOLV runs the industry's largest
solar O&M fleet at **~22 GWdc across ~155 plants**, and its file names the reason that matters more
than new-build: **augmentation and repowering purchases recur for decades and are less FEOC-visible
than new-build ITC procurement.**

**Path one — the BESS or storage seller.** Six members are real storage builders and the doors are
different sizes:

1. **The two genuine EPC-procured lanes.** MasTec Professional Services has a documented
   **design-procure-install** BESS credential (a 65 MW / 260 MWh Georgia package) and takes delegated
   turnkey CE&I scopes — its own file calls it *"the only firm in the batch with a documented
   design-procure-install BESS credential."* Rosendin holds **~10 GWh of installed BESS EPC** in
   house and a partnership putting utility-scale storage in place of data-centre UPS and diesel.
2. **The compatibility-qualification targets.** Blattner (3,300+ containers, 5.4+ GWh) and SOLV (#2
   US BESS builder 2024 at 4,586 MWh, a 35× ramp from 2022) buy nothing and decide everything about
   whether an owner's choice is cheap to install. Both files say the same thing: **clear the
   qualification by documentation and training, not by a sales pursuit.**
3. **The precedent that settles the China question at the EPC level.** MasTec's file names it and
   Blattner's confirms it from the other side: **a Chinese-headquartered supplier rides owner
   selection through a top-tier US EPC** — *"there is no blanket China refusal at the EPC level, only
   owner-level economics and politics."* The constraint is the owner's tax-credit arithmetic, not the
   contractor's policy.
4. **And the one member here whose own procurement is live.** Strata Clean Energy is a repeat battery
   buyer across four different suppliers with a stated factory-audit programme — and it is the
   segment's **adjacent**, not one of its sixteen incumbents, which is the whole shape of this
   section in one row.

**Path two — the AIDC-power seller.** The door depends entirely on which of the two markets you are
in front of:

- **In the data-hall market, you are selling into a procurement desk, and one of them is enormous.**
  Turner's SourceBlue runs **open-book OEM procurement on the long-lead electrical and mechanical
  packages** — transformers, switchgear, generators, chillers — against a data-centre order book at
  **€18–22B a year**, and its file names the moment that matters: *"Turner's preconstruction stage is
  where equipment gets specified and reserved."* **Preconstruction, not construction, is the sales
  cycle.** HITT's franchise is speed (a 22.5 MW facility in 180 days) inside the world's largest
  data-centre market. Holder's is **>90 % repeat relationships** and a CEO on a utility's board.
  DPR's is self-perform craft and prefabrication on **>90 % of new work**. Whiting-Turner
  subcontracts every trade — so the specification conversation there is with a subcontractor it
  prequalifies, not with the CM.
- **In the power market, you may be selling to the party that actually signs.** Kiewit self-performs
  **>80 %** of its work and sits inside GE Vernova's turbine-slot allocation — so the scarce thing it
  controls is a schedule, and the conversation is about whether your equipment fits one. Quanta is
  simultaneously **channel, competitor and customer intelligence**: its EPC pulls your equipment, it
  is building its own transformer and breaker capacity, and its backlog is the best leading indicator
  of US grid construction there is. Black & Veatch and Burns & McDonnell are **design authorities** —
  the specification is written there, and Burns & McDonnell's own file names the asymmetry: **#1 in
  Power design for eleven years, #35 as a contractor.** Getting specified by a designer is worth more
  than winning a bid from a builder.
- **And on the seam, one firm buys both.** Mortenson delivers the building **and** its substation,
  medium-voltage distribution and on-site generation, and has bought the grid-interface controls
  layer rather than renting it. It is the only counterparty on this roster where one specification
  decision can travel across both markets.

**The cross-cutting instruction, and it is the single most useful thing in this module.** Before you
price, establish **which of the two markets the counterparty is in, and whether it self-performs the
scope you are selling into.** A construction manager that self-performs nothing will hand your
package to a prequalified subcontractor and never hold your paper. A self-perform EPC may take your
equipment onto its own balance sheet. Those are different sales, different diligence and different
timelines — and the tell is in the file: the firms that publish a self-perform page have one, and the
ones that publish trade-contractor *selection* among their own services do not.

**What this module does not teach, on purpose.** How a project gets from site control to commercial
operation, where an overrun hides, what the bond covers past the damages cap, and why craft labour
cannot be procured are all taught by the public lesson this segment names first. **Read that lesson
for the mechanism; read this module for who holds it and at what size.**

## 8. Claims ledger

Every load-bearing claim traces to a dossier at its profile version and the field it rests on, to the
segment registry, or to the graph. The nineteen profile versions, read off the fetched files on
2026-09-16:

| Member | Version | `lastUpdated` |
|---|---|---|
| `turner-construction` | v8 | 2026-09-06 |
| `hitt` | v5 | 2026-09-05 |
| `dpr` | v6 | 2026-09-06 |
| `holder-construction` | v5 | 2026-09-05 |
| `whiting-turner` | v1 | 2026-09-06 |
| `mortenson` | v7 | 2026-09-05 |
| `kiewit` | v7 | 2026-09-05 |
| `bechtel` | v4 | 2026-08-30 |
| `black-veatch` | v7 | 2026-09-05 |
| `burns-mcdonnell` | v5 | 2026-09-05 |
| `quanta-services` | v5 | 2026-09-05 |
| `rosendin` | v7 | 2026-09-06 |
| `primoris` | v4 | 2026-08-30 |
| `mastec` | v3 | 2026-08-30 |
| `solv-energy` | v3 | 2026-08-30 |
| `blattner` | v5 | 2026-09-06 |
| `mccarthy` | v5 | 2026-09-06 |
| `samsung-ct` | v4 | 2026-09-05 |
| `strata-clean-energy` | v2 | 2026-09-06 |

Registry inputs: `profiler-segments.json` at its last commit date on the base revision;
`profiler-graph.json` at `built` **2026-09-13**.

## 9. What the record does NOT say

Ten absences, each stated by the dossier that has it rather than inferred:

1. **No comparable revenue exists for twelve of the nineteen.** Twelve are private, and seven members'
   files carry an explicit *publishes no …* statement — four of them naming backlog. Whiting-Turner's
   file is explicit about the consequence: *"almost everything hard in this dossier reaches the record because a counterparty was
   compelled to speak."*
2. **No MW-delivered figure is published by the largest firm on the table.** Turner's ~3 GW is
   **Blackridge's estimate**, and its own file says so.
3. **Holder's rank and revenue are single-source.** Its own sixth judgment rates the ~$10.2B and the
   #12 rank **low confidence** — one secondary aggregator against a paywalled ENR original, with
   Forbes reporting $8.5B on a different fiscal cutoff.
4. **Sector-revenue precision is survey-derived everywhere it exists.** HITT's implied ~$10.7B
   data-centre revenue and DPR's implied ~$8B both come from ENR survey mix data, and both dossiers
   say to treat the precision as indicative.
5. **Two members' revenue cannot be reconciled at all.** Kiewit reports $18.2B against ENR's $15.3B;
   Bechtel $20.6B against ENR's $15.9B for 2024. Both files call it methodology rather than
   contradiction, and neither reconciles it.
6. **No company-wide current-year TRIR or EMR exists for the challenger whose criterion it is.**
   McCarthy's file states it as a collection gap: the figures that exist are *"undated and
   market-scope"* — for a segment whose registry lists safety record as buying criterion 6.
7. **A widely repeated ownership claim is false and the file says which kind of source carries it.**
   Whiting-Turner is not employee-owned; every instance traces to *"a network of AI-generated content
   farms"* that also assert a mutually exclusive fact on the same page.
8. **The segment's second challenger has produced no attributed delivery in nineteen months.**
   Samsung C&T's ~10 GWh agreement has *"no named project, no volume drawdown, anywhere."*
9. **Two framework namings are optionality, not backlog, and both files say so.** The US–Japan
   AI-infrastructure framework names Bechtel and Kiewit as delivery contractors with **no projects
   assigned**; both dossiers rate it *directional* rather than bankable.
10. **The fence is nearly empty and that is a fact about the record, not the regime.** Twenty-one
    `policyExposure` entries across nineteen members, **ten members carrying none at all**, six dated
    and **none in the future**. A segment this exposed to prevailing-wage, apprenticeship-ratio,
    domestic-content and safety regimes should have a denser fence than 1.1 entries per member; what
    the corpus holds is thinner than the industry is.

## 10. Freshness gate — the `reviewBy` judgment, resolved

**Read, not sorted, for the fifteenth consecutive session — and this is the first landscape of
fourteen to take the six-month default.** All thirteen previous landscape modules found a dated gate
in their own material. This one does not, and the reason is measured rather than assumed.

**The mechanical sort returns nothing at all.** The segment's `policyExposure[]` fence holds
**21 entries across 19 members** — 1.1 per member, the thinnest any landscape has met — of which
**6 carry a date and not one of those is in the future.** The status distribution explains it: **20
`in-effect`, 1 `announced`, 0 with a future effective date.** Construction regimes date differently
from equipment ones, exactly as §7.43 predicted: prevailing wage (2021-08-25, in effect),
Davis-Bacon (2024-06-24, in effect), Title VII enforcement (2023-05-04, in effect), the OBBBA credit
termination (effective 2025-07-04, in effect), ITC/45X (2023-01, in effect). **A regime already in
force has no future date to ring.** This is session 3's **(g)** case for the fifth time, and it is
the *empty-set* version rather than row 18's *distant-set* version: row 18's sort returned four
genuine future dates all at least twenty-seven months out, so its default was taken **despite** a
non-empty result; here the result is empty.

**The whole corpus of nineteen dossiers holds exactly four future day-level dates, and every one is
rejected:**

| Candidate | Where | Rejected because |
|---|---|---|
| **2026-09-21** | `primoris` — securities class-action **lead-plaintiff deadline** | Off-subject: a procedural deadline in a shareholder suit clocks a litigation calendar, not a construction market. It is also five days out, which would put this module inside its own 30-day horizon and make the curriculum checker report **4** items due rather than 3 — a cost paid for a date that says nothing about the segment |
| **2026-11-02** | `primoris` — estimated Q3 2026 earnings date | **Not a stated date.** The dossier itself calls it *"estimated ~2026-11-02 (MarketBeat; Investing.com says Nov 9; not company-scheduled as of late August)"*. Two sources disagree by a week and the company has scheduled nothing. Taking it would fabricate precision the record refuses — §5.2's spirit |
| **2027-12-31** | `mccarthy` — OBBBA placed-in-service cliff for wind and solar | **Later than the six-month default**, so not the *nearest* gate; and it is **already carried twice** in the repo as a `reviewBy`. It is genuinely on-subject for the renewables half of the power market and it is kept — as **indicators row 6**, per **(u)** |
| **2028-04-30** | `primoris` — buyback authorization expiry | Off-subject and nineteen months out: a capital-allocation programme, not a gate on anything this module claims |

**Six further candidates considered and rejected, all month- or window-level:** the next ENR Top 400
edition (**annual, late May**; the only thing that genuinely clocks this module's central claim, and
the corpus states no publication date — kept as **indicators row 1**); Quanta's transformer capacity
**by 2028** (a company-stated target year, no day); the LS ELECTRIC JV supplier decision
(**2026–2028**, a window); Strata's White Tank construction start (**October 2026**, month-level, and
an adjacent's project rather than the segment's claim); GridStor's in-service date (**first half of
2027**, a half-year); and Kiewit's Aurora commissioning (**2027–28**, a two-year band).

**So the gate is `updated` + 6 months.** The judgment this records: a module whose central claim is a
*market boundary* is not clocked by a policy effective date at all — it is clocked by the next
edition of the one table that ranks its members, and that table publishes annually on no announced
day. Inventing a day for it would be worse than defaulting, and defaulting is what the guidance
discipline's step 10 prescribes for *slow-moving fundamentals*. **Recorded rather than quietly
absorbed, because thirteen landscapes in a row found a read date and a fourteenth that does not is a
fact about this segment's fence, not a lapse in the search.**

The curriculum checker's three items due for review — `landscape-utilities-2026-09` and
`landscape-in-hall-power-2026-09` at 2026-10-01, `landscape-neoclouds-2026-09` at 2026-09-30 — are
by design and were not touched. This module's date sits well outside the 30-day horizon, so the count
stays at **3**.

## 11. The Scraper interest seed — ADDED, and the check produced a result no previous S2 seed has

`industry-guidance.md` step 9 requires one `SCRAPER_INTEREST_TOPIC_SEEDS` entry per registered module.
Key `topic-landscape-epc-and-construction`, source `guidance:landscape-epc-and-construction-2026-09`.

**Denominator re-measured against BOTH arrays on the day, per §10.6 (bb5):**
`SCRAPER_INTEREST_TOPIC_SEEDS` **39 seeds, 248 terms** and `SCRAPER_SEGMENT_SEEDS` **29 lenses, 249
terms** — **497 raw, 472 distinct**, which reconciles with session 13's 462 plus its own ten terms.

**THE RESULT: essentially the entire construction vocabulary scores zero, and the reason is that the
roster has never held a construction seed at all.** Forty-nine candidates were scored. **Forty-five
scored zero.** The four that did not are instructive precisely because they are not construction
terms: `interconnection queue` (exact duplicate), `substation EPC` and `transmission EPC`
(superstrings of the existing `substation` and `transmission`), and `EPC` itself (the existing
`epc contract` is a superstring). **The roster is an equipment, power, project, site, policy and — since
session 13 — finance vocabulary. Nothing in it describes how the thing gets built.** Session 13
recorded the highest zero rate any S2 seed check had produced and explained it by the absence of a
finance seed; this is the same mechanism one layer down, and it means the drops below are **entirely
editorial** rather than duplication-driven.

**TAKEN — ten terms, audited for exact, substring and near-duplicate collision against all 472:**

| Term | Criterion it serves | Why it discriminates |
|---|---|---|
| `self-perform` | 2 | The single most discriminating word in this segment's vocabulary — the line between a construction manager and an EPC, and the thing five dossiers use to describe themselves |
| `craft labor` | 2 | The scarce input; ENR's own 2026 headline is a craft ceiling straining under the AI boom |
| `prefabrication` | 2 | The second half of criterion 2, and the strategy three members name as their answer to the craft ceiling |
| `ENR Top 400` | — (the ranking) | A proper noun, annual, and this module's own indicators row 1. The one publishable ranking the segment has |
| `percentage-of-completion` | 4 | An accounting term that appears verbatim in overrun and guidance-cut coverage — the vocabulary of the segment's live credibility crisis |
| `bonding capacity` | 4 | Construction-only; no other industry uses it |
| `owner-furnished` | 5 | The term that decides whether a builder is a procurement door at all |
| `TRIR` | 6 | Unambiguous in industry text, and the criterion **nothing in the 48-lesson curriculum teaches** (§3a) |
| `electrical contractor` | — (the trade) | The trade whose #1 and #2 are both absent from the Top 400 table; precise and construction-scoped |
| `prevailing wage` | the fence | The most common regime in this segment's `policyExposure`, carried by two members, and construction-specific rather than cross-segment |

**DROPPED, with the ground for each:**

- **Criterion 1 is COVERED by the segment one link up, so this is a (v) half-and-half.** `days to
  energize` is the **registry's** wording rather than the market's — session 13's ground for dropping
  `fund-to-fund` — and its market form, `speed to power`, is **already seeded** in
  `topic-landscape-hyperscalers-and-ai-labs`, because the hyperscalers are the counterparties in the
  same articles. Seeding it here would mis-band the same article twice.
- **Criterion 3 is BLOCKED IN BOTH DIRECTIONS** — session 12's class, and this is its third
  appearance. The precise forms (`Level 5 commissioning`, `commissioning agent`) score zero but carry
  almost no article volume; the broad form (`commissioning`) also scores zero but is used of ships,
  power plants, artworks and public buildings, so it would mis-band heavily. **No admissible term
  exists**, and criterion 3 is recorded unseeded rather than served badly.
- **Eleven as too generic:** `design-build` and `construction manager at risk` (every school, bridge
  and hospital), `general contractor`, `turnkey`, `backlog`, `craft`, `commissioning`,
  `mission critical` (an IT phrase as often as a construction one), `preconstruction`, `data hall`
  (the landlord's and cooling segments' word), `safety record`.
- **Four as near-duplicates or superstrings:** `substation EPC` and `transmission EPC` (superstrings
  of terms already held), `interconnection queue` (exact duplicate), `EPC` (the held `epc contract` is
  a superstring).
- **Three as too rare in article text:** `guaranteed maximum price`, `progressive design-build` (one
  firm's one project), `experience modification rate` — and `craft ceiling`, which is ENR's coinage
  for one edition rather than a durable term.
- **Two on SPLIT grounds to `topic-bess-bankability`:** `contractor-furnished` and `total recordable
  incident rate` in its long form — the first because criterion 5's procurement half belongs to the
  buying-side module, the second because its short form `TRIR` is taken here and seeding both would
  double-score one article.
- **One on split grounds to `topic-grid-equipment-shortage`:** nothing about transformer lead times
  enters here, per §2e.

**THE TWO STANDING RESERVATION DEBTS, re-checked and both still open.** (1) **`restart` still scores
zero across all 472** and is still `topic-landscape-clean-firm-and-nuclear`'s word for that module's
next revision — **five sessions unseeded**. (2) Session 12's six terms assigned "on split grounds to
`topic-aidc-landlords`" (`tenant of record`, `credit backstop`, `recognition agreement`,
`bankruptcy-remote`, `triple-net lease`, `penny warrant`) — re-checked here: **still none of the six is
in that seed and all six still score zero**, a second consecutive session confirming that a term
*assigned* to another seed's territory is not a term *seeded* there. Neither is taken here. The
GPU-residual-value gap is unchanged and still wants a developer decision on the scorer.

**A new candidate for the same list, recorded not taken.** `apprenticeship ratio` and
`project labor agreement` both score zero and are genuinely this segment's regimes (McCarthy carries
the IRA prevailing-wage-and-apprenticeship exposure). They are dropped as too rare in article text at
present, but they are the two terms to reconsider if a future session finds prevailing-wage coverage
arriving without them.

**No `tv` marker applies** — this is a new key with no sheet row, and **no existing seed's `terms`
array was edited**, so `scraper-sources.md`'s terms-edit gate does not fire. **No outlet was added to
`SCRAPER_SOURCE_ROSTER`**, so the roster gate does not fire either.

## 12. Verification

| Check | Baseline (pristine HEAD, before any edit) | Required after |
|---|---|---|
| `node --check` on a `.js` copy of `Classroom.gs` | clean | clean |
| `node --check` on a `.js` copy of `Scraper.gs` | clean | clean |
| `scripts/check-gas-inner-scripts.js` | 9 files, 86 blocks, all parse | unchanged |
| `scripts/check-classroom-content.py` | **0 errors / 0 warnings — 48 lessons, 8 tracks, 142 gate cases**, module assertion **22** | **0/0**, lessons still **48**, module assertion **23** |
| `scripts/check-classroom-curriculum.py --strict` | no structural findings · **28** stale pins · **3** items due for review | unchanged on all three |
| `scripts/check-classroom-pipeline.py --selftest` | **13 fixtures, 0 failures** | unchanged |
| `scripts/check-classroom-pipeline.py --base origin/main` | — | **P1** on the two plan files and the analysis file (outside the committer's write set); **no P3** (no gate symbol moves); **no P5** (no registry reorder — the module appends and the segment lesson is replaced in place); **no P8**; **no P12** provided `VERSION` moves exactly one step |
| `build-classroom-segments.py --check` | **19 segments, 8 due** — `epc-and-construction` among them, `inputs moved: none`, `sections differing: read-next, what-is-bought-and-on-what` | **8** after the module (a module registration moves no `lesson_ref`), **7** after the regeneration |
| `scripts/check-readme-tree.py` | clean | clean after both GAS bumps |
| Playwright render at **contributor** | — | all nine sections, **zero page errors**, zero unresolved `{{…}}`, zero literal asterisks or backticks, every section's screenshot read individually |
| Real serving path at **analyst** | — | `ROLE_DENIED` on `gop=doc` — the tier that proves a contributor module's gate |

**The three-number forecast, recorded before the generator was run:** `--check` **8 → 8 → 7**. Eight at
the start (measured), eight after the module is written and registered because registering a guidance
module changes no `lesson_ref` and this segment's two differing sections predate this session, and
seven at the end because this segment clears on its own regeneration. **This is the clear case** — the
segment was already due when the session opened, so the count falls rather than holds, which is the
opposite of row 18's enter case.

**Version bumps.** Classroom GAS `v01.58g` → `v01.59g` in both `Classroom.gs` `VERSION` and
`live-site-pages/gs-versions/Classroomgs.version.txt`. Scraper GAS `v02.14g` → `v02.15g` in both
`Scraper.gs` `VERSION` and `live-site-pages/gs-versions/Scrapergs.version.txt`. No page version moves
— no renderer change. Public changelog lines stay generic per `changelog-security.md`: the module's
subject, the segment name and every member name stay out of both GAS changelogs.

Developed by: LightAISolutions

