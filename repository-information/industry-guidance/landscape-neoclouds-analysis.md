# Landscape — Neoclouds — Analysis & Module Source

> **Not deployed.** This file is the source of truth for the in-app guidance module
> `landscape-neoclouds-2026-09` (`guidanceDocLandscapeNeoclouds_()` in
> `googleAppsScripts/Classroom/Classroom.gs`, lane **The Value Chain**, tier **contributor**).
> Written 2026-09-16 as S2 session 12 — the **twelfth** landscape and the **twenty-first**
> guidance module. Spec: `CLASSROOM-CURRICULUM-PLAN.md` §10.6; brief:
> `INTEGRATED-REMEDIATION-PLAN.md` §7.39.

## What this is

A **corpus-synthesis** landscape: no ingested document and no new research. Every claim traces to
one of the segment's seven member dossiers at the profile version recorded in §8, to
`profiler-segments.json`, or to `profiler-graph.json`. The developer's 2026-09-07 exception
(`INTEGRATED-REMEDIATION-PLAN.md` §7.2, decision 2) is what allows a guidance module to name and
rank covered companies; the guidance is still to a **group** — the BESS or AIDC-power seller
reading it, about the players it sells against and to.

## The segment as measured

All figures re-derived from the files on **2026-09-16**, not copied from the brief (§10.6 **(aa4)**).

| What | Measured |
|---|---|
| Members | **7** — 1 incumbent, 6 challengers, **0 adjacents** |
| Incumbent | `coreweave` |
| Challengers | `nebius`, `lambda`, `crusoe`, `iren`, `fluidstack`, `nscale` |
| Chain position · tier | 14 · demand |
| Registry `notes` | **absent** — no note explains the shape, as at `clean-firm-and-nuclear` (§10.6 **(aa2)**) |
| Pure plays | **3 of 7** — `coreweave`, `nebius`, `lambda` belong to no other segment |
| Cross-memberships | **4 of 7**, and every one of the four to **exactly one** other segment: `aidc-developers-and-landlords` |
| Built-landscape neighbours sharing a member | **1** (the landlord landscape). Ten of the eleven built landscapes share **nothing** |
| Role inversions | **2 of 4 shared members (50 %)** — the first intermediate rate |
| Edges among members | **18** — 4 curated pairs carrying **5 typings**, 14 derived-only |
| Curated typings among members | **4 of 5 are `competitor`**; the only other is `fluidstack → iren`, **supplier** |
| Top curated counterparties outside the segment | NVIDIA 6 · Microsoft 5 · Anthropic 4 · Galaxy Digital 4 · AMD 3 · Cipher 3 · Google 3 · OpenAI 3 · Hut 8 3 |
| `policyExposure` entries | **14 across 7 members** — and **3 of the 7 carry none at all** (`coreweave`, `lambda`, `iren`) |
| Dated policy entries | 11, of which **zero are in the future at any granularity**; exactly **one** is day-level and it is in the past |
| Future day-level dates anywhere in the segment | **3**, all in **one** dossier (`fluidstack`): 2026-09-30, 2026-12-31, 2027-04-30 |
| Buying criteria with a taught owner | **0 of 5** — and for a reason no previous session has met (§3a) |
| `READ_NEXT` | `the-campus-as-a-power-project` · `bridge-power` · `redundancy-by-the-numbers` — **all built, all public** |
| Public vs private | **3 listed** (CRWV, NBIS, IREN) · **4 private**, none of which publishes revenue |

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

1. `who-dominates-and-on-what-basis` — prose — one incumbent, and the third-party rating that makes it one
2. `who-threatens` — prose — six challengers on four routes, sorted by criterion 3
3. `each-players-bet` — table — seven rows, six of them attacking one position
4. `the-indicators` — table — what to watch, dated only where the record dates it
5. `the-sellers-play` — callout — the storage path and the AIDC-power path
6. `claims-ledger` — ledger — every claim to a dossier at its profile version
7. `what-the-record-does-not-say` — callout — the absences, each stated by the dossier that has it
8. `drill` — flashcards
9. `check-yourself` — quiz

## 1. Executive read

**The roster is the most lopsided S2 has met — one incumbent against six challengers — and the
honest reading is neither "a market that has just formed" nor "a market about to consolidate". It
is a market being sorted by its customers.**

Three measurements carry that.

**One.** The incumbency basis is unusually clean and it is **not size**. A single named third party,
SemiAnalysis's ClusterMAX, rates **six of the seven on one scale**, and CoreWeave holds **the only
Platinum, across both rating cycles**. On the figures that usually decide an incumbency it is not
first: IREN holds **5 GW** of secured power and Crusoe **~4.9 GW** contracted against CoreWeave's
**3.5+ GW**, and Nebius grew **+454 %** year over year against CoreWeave's **+112 %**. CoreWeave is
the incumbent because it is **the public proxy** — its own file says so in as many words: *"the
public numbers every private neocloud gets measured against."* Four of the seven publish no revenue
at all.

**Two.** The six challengers do **not** attack one position from one direction. They run **four
distinct routes**, and the routes sort along the segment's own **third buying criterion** — leased
shell against own-build — on a finer reading of it than the criterion itself states (§2c). Own the shell and sell cloud on top (Crusoe, IREN, Nscale); own
nothing and rent a guarantor's credit (Fluidstack); out-compound on the same model (Nebius); climb
up-market from a developer base (Lambda). The registry proves the sort independently: **the four members ranked in the
landlord segment as well are exactly the ownership route**, and the two of those four that carry
*adjacent* there are the two whose campus position is not a business they sell — one building only
for its own load, one owning almost nothing.

**Three.** The threat is not moving between the seven. **It is arriving from the customers.**
Microsoft anchors four of the seven and declined a reported ~$12 bn CoreWeave expansion while
routing capacity to Nebius. Anthropic contracts through Fluidstack, Nscale and Lambda — and signed
**401 MW at Hawesville directly with the landlord, with no Fluidstack entity in the lease**. NVIDIA
is the segment's single largest curated counterparty and is simultaneously supplier, investor,
customer and certifier to more than one member. So **the incumbent's dominance and its largest risk
are the same number**: Microsoft at ~67 % of FY2025 revenue is both why it is the benchmark and why
it is exposed.

**What that means for a seller.** Do not read the one-incumbent shape as a monopoly to sell through
or a field about to collapse to three names. Read it as **seven buyers whose purchasing authority
sits in four different places** — with the developer at three of them, with a landlord at one, with
a guarantor behind two, and with a single hyperscaler's allocation decision above all of them.

## 2. The split — written first, per §10.6 (j)

**Written before any other section, per §10.6 (j).** Eight neighbours bear on this segment:
one public **lane opener**, three public `READ_NEXT` mechanism lessons, one built **landscape**,
two guidance modules that name members in passing, and this segment's own generated public lesson.
The organising fact is that the heaviest of them is the **lane opener** — and it pre-empts this
module using this segment's own credit chain, in public, before anybody reaches the Value Chain
lane at all.

### 2a. `reading-the-graph` — the lane opener, and the sharpest pre-emption S2 has met

`reading-the-graph` is the **Value Chain lane opener**: public, built, and read before every one of
the nineteen segment lessons. It names **Fluidstack twenty-six times and no other member of this
segment even once** — measured today against all seven. It uses this segment's own
credit-substitution chain as its worked example, and it says so out loud: *"A neocloud signs leases
with data-centre landlords, a hyperscaler backstops the rent so the unrated tenant's covenant
becomes bankable, and an AI lab is the end user of the capacity. It is a credit-substitution chain,
and the segments registry places the tenant in it in exactly those words."*

Session 11's **(bb3)** recorded this as §10.6 **(t)** in a new shape — a landscape pre-empted by the
lesson that teaches people to read it. This session is the segment that lesson was reading. The
line is therefore unusually clean, and it is not a subject line: **the lesson owns the method and
the module owns the positions.** `reading-the-graph` teaches what an edge is, how a chip is read,
what the three registry roles claim, what the floor rule is, and four specific ways to misread a
player table. It names one company's chain because it needs a worked example. It says **nothing**
about where any of the seven stands, what each sells, what each is rated, or who is winning — and
it could not, because ranking is layer 4's job by construction (§10.1).

**§7.23's test — the one number both cite, doing a different job in each.** Take the chips on the
Fluidstack–Hut 8 edge: *245 MW critical IT on 330 MW of utility capacity; USD 7.0bn base term.* In
`reading-the-graph` those figures are **the contents of a chip, shown to demonstrate what a chip
carries** — the lesson's own sentence is that the companies are *"the worked example, not the
material."* Here the same figures are **one of five campuses behind one challenger's ~1.4 GW
position**, and they matter only in aggregate against ~USD 2.6 bn of equity. A demonstration of a
data structure there; a measure of a balance sheet here.

### 2b. The three `READ_NEXT` lessons — all built, all public, and not one names a member

`READ_NEXT` for this segment is `the-campus-as-a-power-project` · `bridge-power` ·
`redundancy-by-the-numbers`. **All three are built and public — the first S2 session in several
whose whole mapped set exists** — and a name scan across all three found **zero mentions of any of
the seven members**. They are entirely vendor-blind on this roster, which is why a crowded
neighbourhood does not make this module thin.

Two of the three pre-declare the handoff in their own tiles, which is §10.6 **(t)** firing twice
more:

- `the-campus-as-a-power-project` carries a tile reading **"0 league tables — no ranking of these
  landlords exists in this corpus and this lesson does not invent one."** It declines to rank the
  **landlords**; this module ranks their **tenants**. The same lesson carries **"4 parties, one
  lease — landlord, tenant of record, credit support and end user are routinely four different
  companies"** — which is exactly this segment's structure, taught vendor-blind, in public.
- `redundancy-by-the-numbers` carries **"0 UPS, deliberately — an owner with a fleet can accept a
  lower target for one building, buy firm power upstream and bank the capital — a bet a single-hall
  operator cannot make."** That is a direct statement about the difference between a hyperscaler and
  a member of this segment, made without naming one.

### 2c. The landlord landscape — one neighbour, four shared members, and a 50 % inversion rate that decomposes

**`landscape-aidc-developers-and-landlords-2026-09` is the only built landscape sharing any member
with this one** — measured across all eleven built landscapes today. Four of the seven sit in both,
and in no other segment anywhere:

| Member | Role here | Role there | Inverted? |
|---|---|---|---|
| Crusoe | challenger | challenger | no — sells campus capacity to others |
| IREN | challenger | challenger | no — sells campus capacity to others |
| Fluidstack | challenger | adjacent | **yes** — owns almost nothing, leases from everybody |
| Nscale | challenger | adjacent | **yes** — owns three campuses, but builds for its own load |

**Four shared, two inverted — 50 %, the first intermediate rate any landscape has measured.**
Session 8's **(y1)** read the rate for direction and session 9's **(z3)** found it bimodal — 0 % when
a shared member's business *straddles* a boundary, 100 % when it *crosses* one. This is neither,
and the reason is that **the rate is not mixed, it is two clean groups** — but the line between them
is finer than "developer against tenant", and getting it wrong was the first draft's error. Crusoe
and IREN **sell campus capacity to others as a business of their own**, so they straddle and hold
the same role in both. Of the two that invert, **Nscale owns three campuses outright** — it is not a
tenant — but it builds them for **its own contracted load**, which is why the registry makes it
adjacent rather than challenger there; **Fluidstack owns almost nothing** and leases from everybody.
**Two different reasons for the same label, and neither is size.**

**The new instrument: the inversion against a single neighbouring landscape can sort a segment's own
roster on whether a member's campus position is a business it SELLS or a book it merely HAS.** That
is a sharper cut than criterion 3 states — *leased shell vs own-build and the power ownership that
comes with it* — and it runs along the same axis. (z3)'s bimodality is not violated; it is what
produces the intermediate rate when a segment contains both kinds of member.

**§7.23's test against the landlord module** held on **IREN's ~$15M per MW against ~$1.4M per MW for
pure landlord colocation**. There it is the argument *for* vertical integration — a landlord's
revenue uplift from climbing into cloud. Here it is **the only per-megawatt price the corpus holds
for anything this segment sells**, which makes it the segment's unit of account.

### 2d. The two modules that name members in passing

`power-infra-aidc-2026-08` names Crusoe three times and `landscape-aidc-developers-and-landlords-2026-09`
names Crusoe five and IREN four. **No guidance module anywhere names CoreWeave, Nebius, Lambda,
Fluidstack or Nscale** — five of the seven, including the incumbent, are unranked in the guidance
layer until this module. That is the measurement that justifies the module existing.

### 2e. The omissions, enumerated so a later revision cannot import them

**Twenty-three things the neighbours own and this module deliberately does not carry.**

From `reading-the-graph` (7): what a curated edge is and how it differs from a derived one; the
seven relationship types and their inverses; how to read a deal chip; what `status`, `since`,
`scale`, `via` and `last` each claim; the definitions of the three registry roles; the floor rule;
and the four named misreads — a cross-mention read as a deal, a `partner` edge taken at face value,
one counterparty read as *the* customer, and `status` read as current.

From `the-campus-as-a-power-project` (5): the five-rung land→entitled→powered→leased→operating
ladder and why a published gigawatt figure means nothing without it; the three parallel clocks; the
four-party lease structure taught as a structure; how to read a campus announcement; and the named
projects as worked examples.

From `bridge-power` (4): the four machine classes that eat the same gas; the permit ceiling and the
minor-source block size; the factory queue; and the prime/backup/N+1 ladder applied to a power
plant.

From `redundancy-by-the-numbers` (4): the N+1 / 2N vocabulary and what each arrangement buys; what a
nine costs; the five commissioning levels; and the vanishing-UPS argument.

From `landscape-aidc-developers-and-landlords-2026-09` (2): the thirteen-challenger landlord roster
and its two routes; and the landlord-side economics of powered land, entitlement and build-to-suit.

From `power-infra-aidc-2026-08` (1): the grid-to-chip power chain itself.

**This module carries none of the twenty-three.** Where one of them is needed to read a sentence
here, the sentence points at the lesson instead of restating it.

### 2f. Why the split is easy here, and what that costs

Every previous landscape had to argue a line. This one does not: **not one neighbour ranks a member
of this segment, and the lane opener explicitly says ranking is layer 4's job.** The cost is that
the module has no mechanism to lean on. Five of five buying criteria print a dash in the public
lesson (§3 below), so **every test in this module is stated as a position, never taught** — which is
(y3) at its strictest, and the only posture available.

## 3. Who dominates, and on what basis

### 3a. First, the curriculum measurement — and it is a NEW mechanism for an empty intersection

The public segment lesson prints a **dash against all five** buying criteria. Sessions 8 **(y3)**,
10 and 11 **(bb2)** each met that, and in every case the cause was a real curriculum gap or a lesson
absent from the generator's criterion index. **Here it is neither, and the mechanism is new.**

Run the §10.6 **(y3)** intersection properly — a criterion maps to a lesson only when that lesson is
in this segment's `READ_NEXT` **and** a `CRITERION_LEXICON` key appears in the criterion's own text.
The result, measured programmatically before the write:

| Criterion | Lexicon key that hits it | Lesson that owns the key | In `READ_NEXT`? | Built? |
|---|---|---|---|---|
| 1 · Time to power, landlord delivering critical IT MW on schedule | `schedule`, `land` | `how-a-storage-project-happens` | **no** | yes |
| 2 · GPU-backed and capacity-backed financing terms | `financ` | `what-bankable-means` | **no** | no |
| 3 · Leased shell vs own-build and power ownership | `ownership` | `the-china-policy-stack` | **no** | no |
| 4 · Backlog quality and customer concentration | `backlog` | `reading-the-numbers` | **no** | no |
| 5 · Rack density and liquid-cooling specification | `cooling`, `liquid`, `density`, `rack density` | `the-cooling-plant-and-water` · `heat-is-the-constraint` · `inside-the-rack` | **no** | 2 of 3 |

**Every one of the five criteria hits a lexicon key. Not one of the matching lessons is in this
segment's `READ_NEXT`.** The mapped set and the lexicon-matching set are **disjoint** — the map
names three campus-and-power lessons while the criteria are written in commercial vocabulary whose
mechanism owners sit elsewhere in the curriculum. Two of the five criteria (1 and 3) are in fact
substantively addressed by lessons that **are** mapped here, and the generator cannot see it because
those lessons share no keyword with the criterion text.

**So this segment's dash row is largely a keyword artefact rather than a curriculum hole** — which
inverts (y3) and (bb2), where the dash was honest. The consequence for scope is unchanged and the
module obeys it: **this module teaches none of the five.** Criterion 3 is the only one it sorts the
roster on, and it sorts on the registry's own role data rather than on a mechanism. The criterion-3
lexicon hit is also a **false positive** worth naming: `the-china-policy-stack`'s `ownership` is
manufacturing ownership, not power ownership.

### 3b. One incumbent, and a basis that is an operational rating rather than a size

There is one incumbent, so there is no ordering to make and no league table to decline. The
question is only **on what basis**, and this segment answers it more cleanly than any landscape so
far: with a **named third-party rating that covers six of the seven members on one scale**.

| Member | ClusterMAX rating | Where the corpus states it |
|---|---|---|
| CoreWeave | **Platinum — the only one, across both cycles** | its own file; corroborated in Lambda's and IREN's |
| Nebius | Gold — *"top of the tier, the most direct competitor to CoreWeave"* | its own file |
| Crusoe | Gold | stated in **Lambda's** file, not its own |
| Fluidstack | Gold — *one of six among 84 providers*, *"the most unique business model"* | its own file |
| Lambda | Silver — *two tiers below*, across both cycles | its own file |
| IREN | **"Underperforming"** — while NVIDIA grants Exemplar Cloud status | its own file |
| Nscale | **not rated in any source read** | — |

Two things follow and both are load-bearing.

**The basis is operational quality, not scale.** CoreWeave's own file says the differentiator is
*"operational quality, not price"*, and the rating is what the segment's own members cite when they
describe their gap: Lambda's file calls the quality gap *"the valuation-relevant execution
question"*; IREN's calls its rating *"the sharpest quality dispute in the cohort"* and says the
Mirantis acquisition is the answer to it. A rating is being used by the rated companies as the
scoreboard. That is as close to a shared basis as this corpus has found in any segment.

**The incumbent is the incumbent because it is legible.** Its file states the role directly — *the
public numbers every private neocloud gets measured against* — and the numbers are real: FY2025
revenue **$5.13 bn (+168 %)**, **1 GW+** active power across **49** data centres, **3.5+ GW**
contracted, a **$99.4 bn** backlog (+284 % YoY) after Meta expanded to $21 bn and OpenAI to
~$22.4 bn, funded by a GPU-collateralised debt ladder of ~**$24.9 bn** whose coupon fell from ~15 %
in 2023 to **investment-grade SOFR+225bps** in March 2026.

**And the same file states the cost of that position without softening it.** Microsoft was
**~67 % of FY2025 revenue**; FY2025 net loss **$1.17 bn**; interest expense **$1.23 bn on $5.13 bn**
of revenue, about **24 cents in the dollar**; and the **$9 bn Core Scientific acquisition — its main
play to own rather than lease power — was voted down** by the target's shareholders in October 2025,
leaving power ownership incomplete and ~$3.5 bn of lease liabilities in its place. A Q3 2025
guidance cut was caused by **a single third-party developer running late**, which is the leased
model's fragility made visible.

**The module's own judgment, labelled as analysis:** in this segment **dominance and exposure are
the same measurement**. Being the proxy requires being public; being public requires an anchor
tenant large enough to fund the build; and that anchor is simultaneously the concentration risk and
the party cultivating the alternatives. No challenger has to take share for the incumbent's position
to weaken — the customer only has to allocate elsewhere, which its own file records it doing.

## 4. Who threatens — six challengers on four routes

Six challengers against one incumbent is the thickest challenger bench any landscape has faced
relative to its incumbency. Padding it would be easy and wrong. **The six run four routes, and the
routes are a measurement rather than a framing** — the registry sorts them itself, through the one
neighbouring landscape that shares members (§2c).

**Route one — own the shell, sell the cloud on top. Three of the six.** *Crusoe*, *IREN* and
*Nscale*. All three are ranked in `aidc-developers-and-landlords` as well as here; Crusoe and IREN
carry `challenger` in **both**, which is what a genuinely straddling business looks like in the
registry.

- *Crusoe* is the time-to-power case: **200+ MW energised at Abilene within a year of
  groundbreaking**, a substation energised **in under six months**, a 91-day-class build cadence,
  and an energy stack the corpus calls its own supplier index — 29 GE Vernova aeroderivatives
  (~1 GW), ~750 MW of Bergen reciprocating engines, **5 GW of ON.energy medium-voltage battery UPS**,
  12 GWh of Form Energy iron-air, and two nuclear plays. Against that: **~4.9 GW contracted on a
  claimed 40+ GW pipeline** — an 8:1 ratio its own file reads as converting *"at well under half"*.
- *IREN* is the vertical-integration case, and the only member that owns land, substations,
  buildings **and** the cloud: **5 GW secured** across three continents, Sweetwater 1's **1.4 GW
  bulk substation energised on schedule in April 2026 with no announced tenant**, a **$9.7 bn
  five-year Microsoft GB300 contract** whose first liquid-cooled hall was **delivered and accepted
  on 13 August 2026**, and **~$15M per MW on newest contracts against ~$1.4M per MW for pure
  landlord colocation**.
- *Nscale* is the anchored-European case: ~200,000 GB300 contracted plus 96,000+ Vera Rubin, a
  **state-certified AI microgrid** at Monarch on a **2 GW Caterpillar** order, and Glomfjord, Narvik
  and Monarch owned outright. Its own file is candid that the ownership claim does not cover the
  contracted volume — **Ward County, Sines, Keflavik and Madison are other people's campuses**, and
  *"the majority of Microsoft's GB300 and Vera Rubin volume sits on other people's campuses."*

**Route two — own nothing, and sell the credit. One of the six.** *Fluidstack* is the corpus's
clearest credit-substitution case and the registry says so in its basis line. **~1.4 GW of
contracted critical IT across five US campuses, none of which it owned until July 2026**, with
**more than USD 6 bn of Google backstops and recognition agreements** making the leases bankable —
about **USD 27 bn of base-term rent standing on roughly USD 2.6 bn of equity**. Its own first
judgment says the product is *"credit substitution plus speed, not compute."*

**Route three — out-compound on the same model. One of the six.** *Nebius* is the only challenger
the incumbent's own file names as the beneficiary of its anchor's diversification. **Q2 2026 revenue
$582.3 M (+454 %), ARR $3.0 B (+56 % QoQ), AI-cloud adjusted-EBITDA margin ~50 %, >$40 bn of
commitments** anchored by Microsoft (~$19.4 bn ceiling) and Meta (up to $27 bn), against FY2026
capex guidance of **$20–25 bn on $3.0–3.4 bn of revenue**. It has travelled the same coupon arc the
incumbent did — **first asset-backed debt at SOFR+250 in July 2026** — a year or two behind.

**Route four — climb up-market from below. One of the six.** *Lambda* is the only member whose
attack is on product rather than capital: developer DNA, colocation-first (EdgeConneX, Cologix,
Prime, Aligned), converting to contracted "Superintelligence Cloud" ahead of a reported H2 2026
listing, with the **first investment-grade-rated Term Loan B by a private neocloud** ($926 M, Baa2,
SOFR+300, August 2026). Its stated target is **3 GW under management by 2030** against a footprint
whose **largest disclosed site is ~100 MW potential** — and it has **never published a company-wide
MW or GPU-fleet figure**, the widest disclosure gap among the majors.

### 4a. The threat that actually moves the segment comes from outside it

**Measured, not asserted.** Among the seven members the graph holds **18 edges but only four curated
pairs, and four of the five typings on them are `competitor`.** The single non-competitor typing is
**`fluidstack → iren`, supplier** — one member buying GPU capacity from another while its own leased
halls are still under construction. **In a seven-member segment the record contains exactly one
commercial transaction between members, and it runs from the member that owns least to the member
that owns most.**

The curated edges that go *outside* the segment are where the volume is: **NVIDIA 6, Microsoft 5,
Anthropic 4, Google 3, OpenAI 3**. So the competitive action is between each member and its
customers, not between members. Three facts make that concrete:

1. **Microsoft is re-allocating across the roster.** It anchors four of the seven, and the
   incumbent's own file records it **declining a ~$12 bn expansion and routing capacity to Nebius**.
2. **Anthropic has already disintermediated the middle.** It signed **401 MW at Hawesville directly
   with TeraWulf**, *"supported by an investment-grade credit"*, **with no Fluidstack entity in the
   lease**, and has since contracted directly or through other operators with Nscale, Lambda, Riot
   and Hut 8.
3. **NVIDIA is on every side of the trade.** Chip supplier, Series D investor and — per The
   Information — Lambda's largest customer through a **$1.5 bn four-year leaseback of ~18,000 of
   Lambda's own GPUs**; a **$3.4 bn customer** of IREN plus a **$2.1 bn share-purchase right**; and
   the certifier whose Exemplar Cloud status contradicts ClusterMAX's rating of the same company.

**The module's judgment, labelled as analysis:** the challenger bench is not competing for the
incumbent's share. Every one of the six is competing for **an allocation decision made inside four
or five customer organisations**, and the incumbent is competing for the same decisions. That is why
the segment looks lopsided and is not consolidating — the shape is a **disclosure artefact plus a
rating**, not a market structure.

## 5. Each player's bet — the seven

One row per incumbent and challenger, registry order. **Every row is analysis**, read off each
dossier's own strategy section and labelled as judgment. **Seven rows because the ranked roster is
seven** — there are no adjacents to omit, and six of the seven rows are attacks on the same
position, which is the section's point rather than a repetition to edit out.

| Player | Role | The bet (analysis) |
|---|---|---|
| CoreWeave | incumbent | That **being the proxy is itself the moat** — the only audited, quarterly, complete set of numbers in the segment, a $99.4 bn backlog at ~5-year weighted duration, and a debt market that repriced GPU collateral from ~15 % to investment grade in three years. Its own file names the two things that would break it: a **GPU useful-life assumption** shorts argue should be 3–4.75 years rather than six, which *"would roughly double D&A and erase margins"*; and **~24 cents of every revenue dollar going to interest** through a 2026 refinancing tower of ~$4.2 bn |
| Nebius | challenger | That **the same model run faster wins** — take-or-pay anchors with ~70 % prepayment and sub-two-year payback at $20–25 M ACV per MW, a full-stack software layer the landlord neoclouds do not have, and owned gigawatt-scale factories rather than leases. The cost is that it stays **capital-markets-dependent through at least 2027** on ~$20 bn raised in ~20 months, and execution risk has migrated *"from GPUs to permits and power"* — two Vineland stop-work orders sit on the Microsoft contract's critical path |
| Lambda | challenger | That **product quality and a listing beat capital scale** — hardware exited, inference sunset, a professional CEO and CFO installed, and the first IG-rated TLB by a private neocloud. The bet is exposed in two places its own file names: **ClusterMAX Silver across both cycles** against ~61 % cloud gross margin versus the incumbent's ~74 %, and an **NVIDIA relationship that is supplier, investor and reportedly largest customer at once** — the circular-financing critique *"with more force"*, because the concentration is undisclosed pending an S-1 |
| Crusoe | challenger | That **energy-first development is a durable business rather than a leveraged construction cycle**, proven on time-to-power no incumbent matched publicly in the same window. Its own file records the fragility twice in one year: Oracle/OpenAI halted the Abilene expansion and **Google managed it off the 1.8 GW Wyoming project**, each a single counterparty decision removing gigawatt-scale work. A ~60× trailing revenue multiple at the discussed $30 bn round assumes a cloud company; the economics *"run through asset flips and JV debt"* |
| IREN | challenger | That **one company can hold both ends of the stack** — landlord-grade ownership of 5 GW on its own substations plus a climbing cloud at ~$15 M per MW — and that **filling Sweetwater's energised 1.4 GW decides whether the integrated model compounds or the power sits as optionality**. The visible costs are a **quarter-by-quarter consensus-miss streak its own file calls structural** (Q3 FY26 revenue by 34 %) and the only **"Underperforming"** rating in the cohort, answered by acquisition rather than by re-rating |
| Fluidstack | challenger | That **credit substitution plus speed is a product** — bankruptcy-remote lessee subsidiaries, recognition agreements making a AA+ guarantor the tenant of last resort, and ~USD 27 bn of base-term rent on ~USD 2.6 bn of equity. Its own second judgment concedes the bet's flaw: **the position is replaceable by its own customer**, demonstrated in July 2026. The answer — buying Abernathy and developing three sites in its own name — is *"a move from tenant to owner-developer that its balance sheet has not yet been shown to carry"* |
| Nscale | challenger | That **an anchor's signature is financeable even when the anchor changes** — investment-grade project debt at SPV level on the strength of contracts, ~$6.1 bn of facilities against roughly $100 M of quarterly revenue. Its own first judgment is the risk: **the anchor has changed twice in a year** (OpenAI → Microsoft → Microsoft walking away from Monarch → Anthropic). And its binding constraint is not capital or chips but **power** — Statnett's May 2026 allocation halt, Loughton slipping to 2027, and a 2 GW Caterpillar order bought to route around both |

## 6. The indicators

What to watch, dated **only where the record dates it**. This segment makes that caveat the rule
rather than the exception: a day-level scan of all seven dossiers found **exactly three future
day-level dates in the entire segment, and all three are in one member's file**. Six of the seven
members supply no future day-level date at all.

| Watch | When the record dates it | Why it moves the segment |
|---|---|---|
| **The only audited number a private member will publish** — Fluidstack Ltd's FY2025 accounts at Companies House, the first audited turnover for the pivot year | **By 30 September 2026** — a statutory filing deadline, day-level, and **this module's own review date** | Four of the seven publish no revenue. This is the single scheduled event that puts an audited figure behind the most leveraged position in the segment |
| A second private member's registration statement | **September–October 2026** — month range only | An S-1 would replace every press-sourced revenue, backlog and contract figure for that member, including whether the reported USD 45 bn Anthropic contract exists on the reported terms |
| The tenant-to-owner test — Abernathy delivery, and the instalments behind the buy-out | **Q4 2026** for delivery; instalments **31 December 2026** and **30 April 2027** | A slip past 180 days would test a termination right, and the guarantor's backstop *"would never trigger"*. It is the only place the record dates the construction-period risk |
| Whether the integrated model fills its own power — an energised 1.4 GW bulk substation with no announced tenant | **Open — no date stated** | The explicit test in that member's own file of whether vertical integration compounds or the power sits as optionality |
| The anchor's next allocation — one hyperscaler anchoring four of seven, having declined one expansion and walked away from one campus | **Open — no date stated** | The segment's structure is an allocation decision inside a small number of customers. This is the mechanism, and it has moved twice already |
| The depreciation argument — a six-year GPU useful-life assumption against a 3–4.75-year bear case | **Open — no date stated** | Its own file says the change *"would roughly double D&A and erase margins"*. It is the largest single variable in the segment's economics and nothing in the corpus dates it |
| Grid allocation in Northern Norway after a May 2026 halt | **Open — "phase 2 is more uncertain"** | The one member whose binding constraint is stated to be power rather than capital or chips |

## 7. The seller's play — §10.10's two paths

**The organising measurement for both paths: in only four of the seven members does the purchasing
authority for power equipment sit with the member at all** — and the four are exactly the ownership
route of §4. For the other three the buyer is the landlord, and selling to the neocloud is selling
to somebody who does not sign.

| Member | Who buys the power plant | Evidence from its own file |
|---|---|---|
| Crusoe | **the member** | 29 GE Vernova aeroderivatives (~1 GW), ~750 MW Bergen engines, 5 GW ON.energy MV battery UPS, 12 GWh Form Energy iron-air, a reported 4.5 GW gas JV |
| IREN | **the member** | Owns its ERCOT substations; energised a 1.4 GW 345/138 kV bulk substation; builds 130–200 kW-rack liquid-cooled halls at 50 MW IT each |
| Nscale | **the member, at one site only** | 2 GW Caterpillar order at Monarch with SCR and battery storage on the gensets; a Schneider Electric customer. Ward County, Sines, Keflavik and Madison are partner-run |
| Nebius | **the member** | $2.6 bn, 10-year Bloom Energy master agreement for behind-the-meter solid-oxide fuel cells; first deployment 328 MW |
| CoreWeave | **the developer** | Leased shells and third-party developers; a Q3 2025 guidance cut caused by one developer running late. The vendor stack it pulls is IT-side |
| Lambda | **the colocation landlord** | Colocation-first footprint; its own file says *"the facility capex mostly belongs to its colocation landlords"* |
| Fluidstack | **the landlord** | Owns almost nothing across five campuses; at one of them the landlord pays for the generators and the substation |

**If you sell storage.** The channel is narrow and it is one name plus the landlords. **Only one of
the seven has a named battery commitment of any size** — Crusoe's **5 GW of ON.energy
medium-voltage battery UPS**, which its own file calls among the largest anywhere, plus **12 GWh of
Form Energy iron-air**. One other has batteries only **on the gensets** at a single site. **The
other five name no battery programme at all.** So the move is to find who owns the **storage**
decision member by member, which is **not** the same list as who owns the power decision: it is the
member itself at the four that buy their own power, and the landlord or the developer at the other
three — a roster you already have from the landlords landscape. Two caveats worth carrying: one member's design
argument runs the other way, because a leased single-hall operator **cannot** make the fleet-owner's
bet to delete the UPS and buy firmness upstream, which is the distinction the public redundancy
lesson states; and this segment's white-space storage question — rack-level backup — has **no
supply agreement confirmed by anyone in this corpus**, so carry it as an open question rather than
as a pipeline.

**If you sell AIDC power.** The posture inverts and this becomes one of the fastest-moving buyer
sets in the corpus, on one condition: **sell to the four that own, and sell through the landlord to
the three that lease.** The four that own buy in unusual shapes and say so — aeroderivatives and
reciprocating engines at gigawatt scale, a ten-year fuel-cell master agreement chosen partly
because fuel cells avoid a permitting review that gas turbines trigger, a two-gigawatt genset order
bought specifically to run independently of the local grid, and self-owned substations. **Three of
the four have a stated permitting or allocation problem** — air permitting under press scrutiny,
stop-work orders on a critical path, and a grid-allocation halt — which is where a supplier who can
move a schedule is worth more than one who can move a price. The rack side is where this segment
sets specification rather than follows it: **130–200 kW racks** liquid-cooled at one member, a
**600 kW rack** build at another, and criterion 5 written into the segment's own definition. Take
the density and cooling mechanism from the public lessons; take the position from this module.

## 8. Claims ledger

**Provenance:** corpus synthesis over the segment's seven member dossiers at the versions below; no
ingested document, no new research. **The dossiers carry the primary sources; this ledger carries
the dossiers.** Profile versions read off the files on 2026-09-16: `coreweave` v4 · `nebius` v5 ·
`lambda` v5 · `crusoe` v6 · `iren` v4 · `fluidstack` v2 · `nscale` v1.

**Four claims in this module are the module's own** and are labelled as analysis wherever they
appear: that the segment is being sorted by its customers rather than forming or consolidating;
that the incumbent's dominance and its largest exposure are the same measurement; that the six
challengers run four routes which sort on the segment's own third buying criterion; and every row
of the bets table.

| Claim | Source |
|---|---|
| 7 members — 1 incumbent, 6 challenger, 0 adjacent; chain position 14, tier demand; registry entry carries **no** `notes` field | profiler-segments.json — segments[].members[], .position, .tier |
| Four of the seven are ranked in exactly one other segment and it is the same one for all four (`aidc-developers-and-landlords`); three are pure plays | profiler-segments.json — every segments[].members[].slug, cross-checked across all 19 |
| The definition's own words: contracted AI compute to labs and hyperscalers, leased or self-built capacity, thin balance sheets, and the tenants carrying most of the corpus's credit-substitution structures | profiler-segments.json — segments[].definition |
| The five buying criteria, verbatim | profiler-segments.json — segments[].buyingCriteria |
| All five criteria print a dash in the public segment lesson, because the lessons matching the criteria's keywords are not in this segment's `READ_NEXT` | scripts/build-classroom-segments.py — READ_NEXT and CRITERION_LEXICON, intersected in sec_what_is_bought |
| 18 edges among members; 4 curated pairs carrying 5 typings; 4 of 5 are `competitor`; the only other is `fluidstack → iren` supplier | profiler-graph.json (built 2026-09-13) — edges[] |
| CoreWeave is the demand-side test case and the public numbers every private neocloud is measured against; 1 GW+ active power | profile:coreweave @ v4 — ecosystemRole |
| FY2025 revenue $5.13 bn (+168 %), 49 data centres, 3.5+ GW contracted, $99.4 bn backlog (+284 %), Meta $21 bn, OpenAI ~$22.4 bn, ~$24.9 bn debt ladder, coupon ~15 % (2023) → SOFR+225bps (March 2026), sole ClusterMAX Platinum twice | profile:coreweave @ v4 — summary |
| Microsoft ~67 % of FY2025 revenue; Microsoft declining a ~$12 bn expansion and routing capacity to Nebius; the $9 bn Core Scientific vote-down leaving power verticalization incomplete; ~$3.5 bn lease liabilities; Q3 2025 guidance cut from one developer running late | profile:coreweave @ v4 — strategyRead, ecosystemRole |
| Interest expense $1.23 bn on $5.13 bn revenue (~24 %); a 6-year GPU useful-life assumption against a 3–4.75-year bear case that would roughly double D&A; ~$4.2 bn 2026 refinancing tower | profile:coreweave @ v4 — strategyRead |
| Nebius Q2 2026 revenue $582.3 M (+454 %), ARR $3.0 B, >$40 bn commitments, Microsoft ~$19.4 bn and Meta up to $27 bn, ClusterMAX Gold, 5 GW contracted-power target | profile:nebius @ v5 — summary |
| $20–25 M ACV per MW with ~70 % prepaid and sub-2-year payback; ~$20 bn raised in ~20 months; first asset-backed debt at SOFR+250 (July 2026); capital-markets-dependent through at least 2027 | profile:nebius @ v5 — strategyRead |
| Two Vineland stop-work orders (August 2026) on the Microsoft contract's critical path; the Bloom fuel-cell strategy as permitting arbitrage against Clean Air Act PSD review; $2.6 bn 10-year Bloom master agreement, first 328 MW | profile:nebius @ v5 — ecosystemRole, strategyRead, policyExposure[0] |
| Lambda ClusterMAX Silver across both cycles; ~61 % cloud gross margin vs CoreWeave's ~74 %; colocation-first footprint with facility capex belonging to its landlords; 3 GW-by-2030 target against a largest disclosed site of ~100 MW potential; no company-wide MW or GPU-fleet figure ever published | profile:lambda @ v5 — summary, ecosystemRole, strategyRead |
| $926 M Term Loan B, Baa2, SOFR+300, the first IG-rated TLB by a private neocloud; NVIDIA as supplier, Series D investor and reportedly largest customer via a $1.5 bn four-year leaseback of ~18,000 GPUs; Crusoe, Nebius and Fluidstack at ClusterMAX Gold | profile:lambda @ v5 — summary, strategyRead |
| Crusoe: 200+ MW energised at Abilene within a year, substation in under six months, 91-day-class cadence; ~4.9 GW contracted on a claimed 40+ GW pipeline converting at well under half; 29 GE Vernova turbines, ~750 MW Bergen engines, 5 GW ON.energy MV-BESS, 12 GWh Form Energy | profile:crusoe @ v6 — summary, ecosystemRole, strategyRead |
| Oracle/OpenAI halting the Abilene expansion and Google managing Crusoe off the 1.8 GW Wyoming project — two single-counterparty decisions in one year; ~60× trailing revenue at the discussed $30 bn round; economics running through asset flips and JV debt | profile:crusoe @ v6 — strategyRead |
| Texas air permitting: minor permit-by-rule instruments under press scrutiny and a pending major permit for 41 more turbines | profile:crusoe @ v6 — policyExposure[0] |
| IREN: 5 GW secured power, $9.7 bn five-year Microsoft GB300 contract, Horizon 1 delivered and accepted 13 August 2026, $3.4 bn NVIDIA contract with a $2.1 bn share-purchase right, YE2026 ARR target above $4 bn (~85 % contracted) | profile:iren @ v4 — summary |
| Owns land, substations, buildings and cloud; Sweetwater 1's 1.4 GW bulk substation energised on schedule April 2026 with no announced tenant; ~$15 M per MW newest contracts against ~$1.4 M per MW pure landlord colocation; 130–200 kW-rack liquid-cooled halls at 50 MW IT | profile:iren @ v4 — ecosystemRole, strategyRead |
| ClusterMAX "Underperforming" against NVIDIA Exemplar Cloud status; every quarter of the trailing year missed consensus, Q3 FY26 revenue by 34 %, and the miss streak read as structural | profile:iren @ v4 — summary, strategyRead |
| Fluidstack is tenant of record, not owner, of ~1.4 GW across five US campuses; more than USD 6 bn of Google backstops and guarantees; ~USD 27 bn of base-term rent on ~USD 2.6 bn of equity; bankruptcy-remote subsidiaries and recognition agreements | profile:fluidstack @ v2 — summary, ecosystemRole, strategyRead |
| The product is credit substitution plus speed, not compute; the tenant-of-record position is replaceable by its own customer, shown when Anthropic signed 401 MW at Hawesville directly with no Fluidstack entity in the lease; construction-period risk is where the chain can break, with a 180-day slip testing a termination right | profile:fluidstack @ v2 — strategyRead |
| ClusterMAX 2.0 Gold, one of six among 84 providers, "the most unique business model"; the company publishes no revenue, backlog, headcount or lease | profile:fluidstack @ v2 — productsAndServices, strategyRead |
| Fluidstack Ltd's FY2025 accounts next due at Companies House by 30 September 2026 — the first audited turnover for the pivot year; the Abernathy buy-out instalments of USD 150 M by 31 December 2026 and ~USD 130 M by 30 April 2027 | profile:fluidstack @ v2 — financials.periods[].metrics, strategyRead indicators |
| Nscale: ~200,000 GB300 contracted plus 96,000+ Vera Rubin; a reported USD 45 bn six-year 460 MW Anthropic contract at Monarch; ~USD 3.7 bn equity and ~USD 6.1 bn of facilities against ~USD 100 M of Q2 2026 revenue; a reported IPO of up to USD 3 bn | profile:nscale @ v1 — summary |
| The anchor changed twice in a year (OpenAI → Microsoft → Anthropic at Monarch); power is the binding constraint at every European site; Statnett's May 2026 allocation halt and Loughton slipping to 2027; the majority of contracted volume sits on other people's campuses | profile:nscale @ v1 — strategyRead, policyExposure[1] |
| Monarch's 2 GW Caterpillar microgrid, state-certified, running independently of the local grid, with SCR controls and battery storage on the gensets; a Schneider Electric customer | profile:nscale @ v1 — ecosystemRole, policyExposure[3] |
| 14 policyExposure entries across seven members; three members carry none; no future dated entry at any granularity | the seven profile files — policyExposure[], read entry by entry |

## 9. What the record does NOT say

Eight absences. Each is **stated by the dossier that has it**, not inferred from silence.

1. **No revenue at all for four of the seven.** Lambda, Crusoe, Fluidstack and Nscale publish none.
   Fluidstack's file says it has *never* published revenue, backlog, headcount or a lease, and
   records that aggregator estimates were deliberately not used. Nscale's says every figure in its
   file is a lender's, a partner's, Companies House's or a named outlet's.
2. **No company-wide megawatt or GPU-fleet figure for Lambda** — its own file calls this the widest
   disclosure gap among the majors, and says an S-1 would close it.
3. **No confirmed terms for the largest contract in the segment.** The reported USD 45 bn
   Anthropic–Monarch contract is press-sourced; the partner's disclosure did not name the customer
   and the customer's newsroom is silent. Its own file calls it *"Nscale's most important and least
   confirmed number."*
4. **No customer concentration figure for four of the seven.** Only CoreWeave (~67 % Microsoft) and
   Nebius (two customers at 25 %/15 %, three at ~59 % by Q2 2026) disclose one. Lambda's is
   undisclosed pending a filing; Fluidstack's is explicitly **inferred, not stated**; Crusoe's is
   observable only through two counterparty decisions; Nscale's through a changing anchor.
5. **No ClusterMAX rating for Nscale**, and **no independent re-rating of IREN** since the
   acquisition its file says was bought to fix the rating. So the one shared basis in the segment
   covers six of seven and is stale at one of them.
6. **No policy exposure on record at all for three of the seven** — CoreWeave, Lambda and IREN carry
   an empty fence, including the incumbent.
7. **No date anywhere for the depreciation question.** The GPU useful-life dispute is the largest
   variable in the segment's economics by its own file's account, and nothing in the corpus dates
   when it resolves.
8. **No league table of these seven exists in this corpus**, and the public lane opener says the
   same thing one layer up — ranking is layer 4's job, and the lesson that names one of these
   companies twenty-six times declines to place any of them. This module ranks by **role**, which
   the registry supplies, and declines to rank **within** the six challengers, whose four routes
   are not measures of one thing.

## 10. Freshness gate — the `reviewBy` judgment, resolved

**`reviewBy` = 2026-09-30.** Read, not sorted — for the twelfth consecutive session.

**The sort returns nothing, which is session 3's (g) case for the fourth time — and in a new
shape.** 14 `policyExposure[]` entries across seven members, **three of the seven carrying no policy
array at all**, 11 entries dated, and **not one of the 11 is in the future at any granularity**.
Exactly one entry in the whole fence carries a day-level date — the EU AI Act's 2 August 2026 — and
it is **in the past**. A mechanical sort of the fence therefore returns nothing to take, and the
generator proves it independently: the public segment lesson fell through to the six-month default.

**The new shape is where the future dates actually live.** A day-level scan of all seven dossiers
found **exactly three future day-level dates in the entire segment, and all three are in one
member's file.** Six of the seven supply none. No previous landscape has had its whole forward
calendar concentrated in a single dossier.

**Taken: 30 September 2026** — Fluidstack Ltd's FY2025 accounts at Companies House, named in that
dossier's own indicator list as *"the first audited turnover for the pivot year."* It qualifies on
all four tests: it is day-level and future; it is on-subject, because the module's central claim is
that ~USD 27 bn of base-term rent stands on ~USD 2.6 bn of equity and this is the scheduled event
that puts an audited figure behind it; **no other module and no lesson holds that day**; and it is a
gate on **this module's own claim** rather than a tell about a third party's project.

**Eight rejections, in writing.**

1. **The whole `policyExposure[]` fence** — zero future dates at any granularity. The sort returns
   nothing; (g), fourth occurrence.
2. **2026-08-02** (EU AI Act full enforcement) — the only day-level date in the fence, and **past**.
3. **2026-12-31** (Abernathy instalment two; also the quarter-end of the Q4 delivery gate) —
   **already carried by four modules**: `china-policy-stack-2026-08`,
   `landscape-bridge-and-on-site-generation-2026-09`, `landscape-clean-firm-and-nuclear-2026-09` and
   `landscape-hyperscalers-and-ai-labs-2026-09`. (r), (u), (aa3) and (bb4) all reject a day another
   module already owns, and a fifth bell on the same day is not a distinction.
4. **2027-04-30** (Abernathy final instalment) — genuine, day-level and on-subject, but **later than
   the six-month default**. Taking it would set a *slower* review on the fastest-moving segment in
   the corpus.
5. **2026-10-31** (the outer edge of the S-1 window) — already
   `landscape-grid-equipment-2026-09`'s gate, and a month-range end is not a date the record states.
6. **January 2027** (a reported listing-penalty clock on one private member) — month-level, and a
   financing covenant inside one company rather than a segment gate.
7. **2027-03-14** — the segment's **own generated lesson's** `reviewBy`. (bb4)'s rule: a landscape
   must check its own segment lesson's clock, not only other modules'.
8. **2027-03-16** — the six-month default. Rejected because a genuine day-level gate exists, which
   is the whole reason §10.6 says *gate* rather than *effectiveDate*.

**Chosen knowingly: this module ships inside its own 30-day horizon.** `clReviewChip` renders it
gold immediately and `check-classroom-curriculum.py` will report **3 items due for review** rather
than 2 — joining `landscape-utilities-2026-09` and `landscape-in-hall-power-2026-09`, both at
2026-10-01 and both by design. Review dates never call `strict()`, so the checker still exits 0.
This is **(k) firing for the third time**: a six-month default here would be a date field telling a
lie that the module's own indicator table contradicts two sections earlier. It is also the
**earliest** `reviewBy` any module in the corpus has carried, at fourteen days, and that is
proportionate — this is the segment whose members restate their own size every quarter.

## 11. The Scraper interest seed — half-and-half, and a new drop class

**Answer: yes, and it is a half-and-half — (v)'s third outcome — with the halves falling exactly
along this segment's own split.**

**The denominator, re-measured today against BOTH arrays** per (bb5) and (i):
`SCRAPER_INTEREST_TOPIC_SEEDS` **37 seeds / 230 terms** and `SCRAPER_SEGMENT_SEEDS` **29 lenses /
249 terms** — **479 raw, 454 distinct**. That reconciles exactly with session 11's 469/444: its own
ten-term seed is the difference.

**The half that is already covered — the demand book, and by the segment one link up.** Session 11's
`topic-landscape-hyperscalers-and-ai-labs` holds `remaining performance obligation`, `compute
commitment`, `circular financing` and `speed to power`. Those are this segment's unit of account,
its contracted-backlog vocabulary and its first buying criterion — because **the hyperscalers are
the counterparties in the same contracts, so they are the same articles.** Criterion 5 is covered
too, and exactly: `rack density`, `liquid cooling` and `direct-to-chip` all score **exact** matches
already. Criterion 3's real-estate vocabulary belongs to `topic-aidc-landlords` (`powered land`,
`land entitlement`, `build-to-suit`, `data center ABS`, `tenant credit`, `take-or-pay lease`).

**The half that scores zero — the segment's own category and its credit structure.** Added as
`topic-landscape-neoclouds`, eight terms, all scoring **zero across all 454**:

`neocloud` · `merchant cloud` · `AI cloud` · `credit substitution` · `delayed-draw term loan` ·
`customer concentration` · `ClusterMAX` · `bare metal`

The first two are **not a discovery — session 11 reserved them for this seed by name**, dropping
them on split grounds to *"the unwritten neoclouds seed, which is the NEXT segment in the 7.3
order."* Honoured here. `credit substitution` is the registry's own phrase for what this segment
sells and is distinct from `tenant credit`, which is a landlord's diligence input on the other side
of the same trade. `delayed-draw term loan` is criterion 2's actual instrument at four of the seven.
`customer concentration` is criterion 4's own words. `ClusterMAX` is the incumbency basis of §3b.
`bare metal` is the bottom of the product ladder.

**Dropped and why — and one of the reasons is new.**

- **Two as NEAR-DUPLICATES that an exact-match score does not catch**, which is the check (i)
  demands and the one that nearly failed here: **`time to power`** scores zero, but session 11
  seeded **`speed to power`** — the same concept in different words, which would band the same
  articles twice. **`contracted compute`** scores zero against session 11's **`compute
  commitment`**, likewise. Both dropped.
- **Six on SPLIT grounds to `topic-aidc-landlords`**, honouring session 11's line that it *"owns the
  lease-credit layer from the other side of the same trade"*: `tenant of record`, `credit backstop`,
  `recognition agreement`, `bankruptcy-remote`, `triple-net lease`, `penny warrant`.
- **Three on SPLIT grounds elsewhere**: `sovereign AI` to the policy seeds; `GB300` and `NVL72` to
  the unwritten compute-and-the-rack seed, whose rack-generation vocabulary they are.
- **Six as SUPERSTRINGS** of existing terms (`gpu`, `chip`, `offtake`, `ai factory`): `GPU cloud`,
  `GPU-backed loan`, `GPU financing`, `GPU lease`, `chip leaseback`, `compute offtake`.
- **Three as too generic**: `backlog` (would mis-band transformer and EPC backlogs), `inference`
  (model layer, not infrastructure), `investment grade`.
- **Two as product or programme names**: `supercluster`, `Exemplar Cloud`.

**A NEW DROP CLASS — blocked in both directions.** The segment's single largest bear-case variable
is **GPU residual value and the useful-life assumption**, and it cannot be seeded at all. Every
precise form of it (`GPU residual value`, `GPU useful life`, `chip depreciation`) is a **superstring
of an existing term**, and every short form that is not (`useful life`, `depreciation schedule`)
**mis-bands into battery degradation**, which belongs to the cells seeds. Previous sessions recorded
four drop reasons — duplication, split, too-generic, product-name. This is a fifth: **a genuine gap
with no admissible term.** Recorded rather than forced, and it belongs with a developer decision
about whether the scorer should admit a narrowing term over an existing broad one.

**Not taken, and still open from session 11's list:** `restart` scores zero across all 454 and
remains `topic-landscape-clean-firm-and-nuclear`'s word for that module's next revision — **not
this session's**, for the second consecutive session.

`Scraper.gs` moves **v02.12g → v02.13g** for this seed.

## 12. Verification

Run before the push commit, all from a **pristine HEAD baseline captured before any edit**:

| Check | Baseline | After |
|---|---|---|
| `node --check` on a `.js` copy of `Classroom.gs` | clean | clean |
| `scripts/check-gas-inner-scripts.js` | clean | clean |
| `scripts/check-classroom-content.py` | 0 errors / 0 warnings — 46 lessons, 8 tracks, 142 gate cases, module assertion **20** | 0 / 0 — 46 lessons, 8 tracks, 142 gate cases, module assertion **21** |
| `scripts/check-classroom-curriculum.py --strict` | no structural findings; 28 stale pins; **2** items due | no structural findings; **3** items due (this module, by design — §10) |
| `scripts/check-classroom-pipeline.py --selftest` | 13 fixtures / 0 failures | 13 / 0 |
| `scripts/check-classroom-pipeline.py --base origin/main` | — | signature recorded in the session record |
| `scripts/build-classroom-segments.py --check` | **10 due**, `neoclouds` differing in `read-next` alone | **9 due** after regenerating `neoclouds` only |
| `scripts/check-readme-tree.py` | clean | clean after the GAS bump |
| Playwright render at **contributor** | — | nine sections, zero page errors, every screenshot read |
| Playwright denial at **analyst** | — | `ROLE_DENIED` from the real `handleGuidanceOp_` |

**Brace check before the append** (the §7.39 mechanical trap): the anchor is the previous function's
closing `}` on its own line, **never** the literal's `};`. Verified by counting unbalanced braces
immediately before the new definition and getting **0**.

## 13. Revision — 24 September 2026 review

A freshness review ahead of the 30 September gate. The gate itself, Fluidstack's statutory accounts at Companies House, has not resolved; the filing history still shows 2024 accounts only. So `reviewBy` stays **2026-09-30**. Two primary documents published after authoring overturned taught claims, and both were read first-hand:

- **ClusterMAX 3.0** (SemiAnalysis, 23 September 2026) now covers all seven members:
  - Platinum: CoreWeave and **Nebius**.
  - Silver: Lambda (all three cycles).
  - Bronze: **Crusoe**, down from Gold.
  - Not Recommended – Underperforming: IREN, re-tested.
  - Not Recommended – Unavailable: **Fluidstack**, which claims no spare capacity or declines testing, and **Nscale**, which the rater lists among providers that market managed clusters while offering bare metal.
  - The incumbent is still the only member at Platinum in all three cycles, but it no longer holds the tier alone. **The one-incumbent reading weakens, and the registry's role labels do not yet reflect a challenger at the top tier.** That is a registry and dossier question for a Profiler session.
- **Nscale's S-1** (filed 18 September 2026, NYSE: NSCL) is the second primary document:
  - Revenue: 2025 USD 33.0 M; H1 2026 USD 140.6 M; H1 2026 net loss USD 1,020.1 M.
  - The Anthropic agreements were signed 25 August 2026 at the Monarch Compute Campus, for up to about USD 44.6 bn. No MW or term is stated.
  - About **1 GW of 1.37 GW at seven owned sites**, which reverses the v1 dossier's "majority on other people's campuses".
  - Private members publishing no revenue fall from four to three, and the registration-statement indicator is resolved.
- **Fluidstack's own press page** names Anthropic for its New York and Texas campuses.
- **IREN v5** (2026-09-21) was re-read. The consensus-miss run now covers all of FY2026, with the full-year print missing on both lines, and Sweetwater's first 300 MW is targeted for Q4 2027.
- **Unchanged:** the four-route structure and the four-of-seven purchasing-authority count.
- **Left for a dossier refresh:** figures that are dated but not contradicted:
  - CoreWeave's backlog and contracted power (the Q2 2026 print reports about USD 104 bn and about 3.7 GW).
  - Crusoe's contracted figure (its Series F release cites 6 GW+ gross).
  - Fluidstack's equity (press reports a Series B that the company has not announced).
  - The segment registry's roles.

Developed by: LightAISolutions
