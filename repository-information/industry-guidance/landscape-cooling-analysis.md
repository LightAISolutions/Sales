# Landscape — Cooling — Analysis & Module Source

> **Not deployed.** This file is the source of truth for the in-app guidance module
> `landscape-cooling-2026-09` (`guidanceDocLandscapeCooling_()` in
> `googleAppsScripts/Classroom/Classroom.gs`, lane **The Value Chain**, tier **contributor**).
> Written 2026-09-17 as S2 session 15 — the **fifteenth** landscape and the **twenty-fourth**
> guidance module. Spec: `CLASSROOM-CURRICULUM-PLAN.md` §10.6; brief:
> `INTEGRATED-REMEDIATION-PLAN.md` §7.45.

## What this is

A **corpus-synthesis** landscape: no ingested document and no new research. Every claim traces to
one of the segment's eleven member dossiers at the profile version recorded in §8, to
`profiler-segments.json`, or to `profiler-graph.json`. The developer's 2026-09-07 exception
(`INTEGRATED-REMEDIATION-PLAN.md` §7.2, decision 2) is what allows a guidance module to name and
rank covered companies; the guidance is still to a **group** — the BESS or AIDC-power seller
reading it, about the parties that decide whether the other half of the megawatt gets bought.

## The segment as measured

All figures re-derived from the files on **2026-09-17**, not copied from the brief (§10.6 **(aa4)**).

| What | Measured |
|---|---|
| Members | **11** — **4** incumbents, **1** challenger, **6** adjacent. The smallest supply segment S2 has covered |
| Incumbents | `vertiv`, `schneider-electric`, `trane-technologies`, `coolit` |
| Challenger | `eaton` |
| Adjacent | `aligned`, `delta-electronics`, `flex`, `liteon`, `mitsubishi-electric`, `supermicro` |
| Chain position · tier | **8 · build** |
| Registry `notes` | **present, and about exactly one member** — it argues `supermicro`'s adjacency in detail and says nothing about the other ten |
| Buying criteria | **6** — the joint maximum in the registry |
| Edges among members | **26** of the 55 possible pairs — **23 carrying at least one curated typing**, 3 present but untyped |
| Curated typings | **39**: `competitor` **36**, `partner` **2**, `other` **1** |
| `competitor` pairs | **21 — 38 % of all possible pairs** |
| Shape of the competitor graph | **ONE component of ten.** One cut vertex (`coolit`), and cutting it detaches only `supermicro`, a leaf. **The two-market hypothesis §7.45 offered is refuted** (§3a) |
| Members outside the competitor graph | **1** — `aligned`, typed `other` to `vertiv` and nothing else |
| Independent rankings available | **three, on three populations, and two of them invert each other end to end** (§3b–3c) |
| Shared members | **9 of 11**, across **8** other segments, **6** of which have a built landscape |
| Shared memberships · inversions | **22 memberships, 17 inversions — 77 %** |
| Direction of the inversion | **Perfectly sorted by role held here**: incumbents 0 up / 4 down / 2 equal; challenger 1 up / 4 down; **adjacents 8 up / 0 down / 3 equal** (§4b) |
| Members belonging to **no** other segment | **2** — `trane-technologies` and `coolit`, the only two pure cooling plays, **with no edge between them of any kind** |
| `policyExposure` entries | **34 across 11 members** — 3.1 per member; **2 members carry none at all** (`vertiv`, `eaton`) |
| Dated policy entries | **17 of 34**, and **exactly one is in the future** — which is already the generated segment lesson's own `reviewBy` (§10b) |
| Future day-level dates anywhere in the segment | **8**, of which **7 are the same event** stated seven times in one dossier |
| Buying criteria with a taught owner | **6 of 6.** Measured across all nineteen segments, **`cooling` is the only one with zero dash rows** — every other segment has at least one, and the next best is `cells-and-chemistry` at five of six (§1) |
| `READ_NEXT` | `heat-is-the-constraint` (**built**, public) · `the-cooling-plant-and-water` (**built**, public, §7 row 18, **one day old**) — both built, both public, and **neither names a single member** (§2a) |
| Ownership | Re-counted from the `ownership` field: **9 public**, **1 subsidiary** (`coolit`, inside Ecolab since 2 July 2026) and **1 private** (`aligned`). The most publicly-reporting roster S2 has met — and two of the nine still publish no figure for this business (§9) |

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

1. `who-dominates-and-on-what-basis` — prose — three rankings, two of which invert, and why
2. `who-threatens` — prose — one challenger, and a bench that is everybody else's incumbent
3. `each-players-bet` — table — eleven rows, and why the table is not five
4. `the-indicators` — table — ten rows; four carry a day
5. `the-sellers-play` — callout — the AIDC-power path and the BESS path
6. `claims-ledger` — ledger — every claim to a dossier at its profile version
7. `what-the-record-does-not-say` — callout — seven absences, each stated by the file that has it
8. `drill` — flashcards
9. `check-yourself` — quiz

## 1. Executive read

**Cooling is one chain measured at two points, and almost every disagreement about it is really a
disagreement about where you stood.** Two independent rankings of this exact segment place Vertiv
first and fifth, and Trane fifth and second — and both members' own files give the same reason,
independently and in almost the same words: *they are strong at different points in the same chain.*

That single fact organises the rest. It explains why the roster's rank order is the **inverse** of
the rank order everywhere else — no incumbent here is ranked higher in any of its six memberships
elsewhere, and no adjacent here is ranked lower in any of its eleven. It explains why the only two
members that belong to no other segment are the two pure cooling plays, one at each end of the
chain, with **no edge between them**. And it is why the CDU capacity ladder every vendor publishes
(§3d) is evidence of convergence rather than a ranking: its top rung is a 14 MW assembly of blocks
and its others are single units, and it puts an `adjacent` member above three of the four incumbents.

The second organising fact is that **position at the top of this segment was bought, not built.** All
five ranked members' liquid-cooling positions changed hands inside eighteen months — Eaton paid USD
9.5bn for Boyd, Ecolab paid ~USD 4.75bn for CoolIT itself, Schneider took Motivair, Trane converted
LiquidStack and bought Stellar Energy, Vertiv assembled equivalent scope in four deals. The bench
built instead, and the one exception prices the difference: Flex paid **USD 53m** for JetCool,
about **179× less** than Eaton paid for the same layer.

For a seller the practical content is three sentences. Know which ranking the room is holding and
name its measuring point. Assume the cooling incumbent is also your power competitor — or, as in the
one `partner` typing in this segment, your power partner. And treat the **approach temperature** as
the negotiation rather than the spec sheet, because it is the number that decides whether the site
needs a chiller at all.

**A curriculum note worth recording, and it is measured rather than asserted**: run the generator's
own intersection across all nineteen segments and **`cooling` is the only one whose criterion table
prints no dash at all** — six of six resolve, where the next best is `cells-and-chemistry` at five
of six and three segments resolve none. Row 18 built `the-cooling-plant-and-water` on 2026-09-16 and
cleared the last of them. So the module owns **none** of the six tests and only says who sits where
on each — against session 8's two-of-six unowned, session 10's five and session 11's six. That is
the sharpest form of layer 4's job the programme has had the curriculum to support.

## 2. The split — decided and written before any other section, per §10.6 (j)

This segment's `READ_NEXT` is **two public mechanism lessons and nothing else**, and between them
they own the whole of its subject: `heat-is-the-constraint` (`aidc-campus` position 1, built
2026-09-01) and `the-cooling-plant-and-water` (Phase 4 row 18, built 2026-09-16 — **one day before
this module**). The line is the ordinary S2 one — **the two lessons own the tests, this module owns
the named parties** — and §2.3's one-lesson cap on cooling means the module must not become the
ninth section row 18 was forbidden to write.

### 2a. §10.6 (t) fires in a fourth shape: the neighbours are SILENT

Three shapes of (t) are on the record. Session 6 found a neighbour that **pre-declared** the handoff
in a tile. Row 18 found one firing **inverted** — an undeclared pre-emption, `heat-is-the-constraint`
having already taken six things the spec read as row 18's, with no decline sentence anywhere. Row 19
found a third — a **declared handoff naming the wrong sibling**, `where-batteries-stop` handing "the
formats, the manufacturing, the yield" to a lesson that teaches none of them.

All three were checked here and **none of them fires**, because all three presuppose that the
neighbour said something or took something. Measured across both lesson literals:

| Test | Measured |
|---|---|
| Members of this segment named in `heat-is-the-constraint`'s prose | **0 of 11** |
| Members named in `the-cooling-plant-and-water`'s prose | **0 of 11** |
| Apparent name matches, on inspection | **6 — every one a `provenance.inputs[].ref`**, i.e. a stamp, not a sentence |
| Members whose study guide `the-cooling-plant-and-water` is stamped on | **5 of 11** — `vertiv`, `aligned`, `schneider-electric`, `coolit`, `trane-technologies` |
| Pre-declared handoff to layer 4 in either lesson | **none** — no tile, no callout, no sentence |
| Declared handoff that could be wrong | **none exists to be wrong** |

So the boundary here is **enacted rather than declared**. The lesson that teaches the plant is built
out of five of this segment's own members' study guides and names not one of them; it reads the
vendors' documents for the physics and drops the vendors. That is a stronger statement of the
boundary than any tile, and it is the fourth shape: **a neighbour can reserve layer 4's job by
saying nothing at all, while standing on layer 4's own members.**

The corollary for a future landscape: (t)'s first three shapes are all *readings of what a neighbour
wrote*. This one is only visible as a **measurement of what it did not write**, so the check has to
be a name count and not a search for a handoff sentence.

### 2b. What the two lessons own, and this module therefore does not

Enumerated so that a later revision cannot import them and collapse the split. `heat-is-the-constraint`
owns: why the rack got hot and the scale-up domain; where air runs out and the Q = m·c·ΔT ceiling;
the five-stage chip-to-atmosphere chain as a **temperature budget**; what each piece of liquid kit
is; and why warm water is the whole argument. `the-cooling-plant-and-water` owns: **the two ratios
and the trade between them**; chillers against economisers and the climate file; the waterless
proscons; containment and what it changes outside the hall; the BMS, DCIM and the sequence of
operations; and five named failure modes. **Eleven things**, and the module teaches none of them.

What is left, and what this module is: **who sells each of those machines, on what basis anybody
says so, what each is betting, and what would change the answer.**

### 2c. The test §7.23 sets — one number doing a different job in each

The shared number is the **approach temperature**, the degrees a CDU spends between the technology
loop and facility water. In `the-cooling-plant-and-water` it is *arithmetic*: a W45 rack minus a
five-degree CDU approach is forty-degree water, and forty-degree water is a dry cooler rather than a
chiller — the tile that carries the lesson. Here it is a **product specification firms compete on
and publish**: CoolIT rates the CHx2000 at "2000 kW cooling capacity **at 5 °C ATD**" and its
liquid-to-air AHx at 240 kW **at 15 °C ATD**; Delta states a **4 °C approach** on its 2.4 MW
800 VDC-native unit. Same quantity, and in the lesson it sizes a plant while here it sorts a roster.

### 2d. Neighbours beyond the two lessons

Nine, all checked for the member's **subject** and — per (dd7) — for the member's **name**:

| Neighbour | What it is | Line drawn |
|---|---|---|
| `heat-is-the-constraint` | public lesson | the physics of the budget; names nobody |
| `the-cooling-plant-and-water` | public lesson | the plant arithmetic; names nobody, stamped on five members |
| `landscape-in-hall-power-2026-09` | built landscape, **6** shared members | the room's electrical machines; the registry itself inverts three of the six |
| `landscape-power-conversion-and-rack-power-silicon-2026-09` | built landscape, **5** shared | the conversion layer; **all five invert** |
| `landscape-grid-equipment-2026-09` | built landscape, **4** shared | the fence line; three of four invert |
| `landscape-storage-integrators-and-containers-2026-09` | built landscape, **2** shared | both invert to `adjacent` there |
| `landscape-bridge-and-on-site-generation-2026-09` | built landscape, **1** shared | `eaton` only |
| `landscape-aidc-developers-and-landlords-2026-09` | built landscape, **1** shared | owns `aligned` as an **incumbent landlord**; this module owns only its cooling platform |
| `reading-the-graph` | lane opener | **returns nothing** — it names no member of this segment and never mentions cooling |

Two further segments share members and have **no** landscape yet, so no line needs drawing with
them: `compute-and-the-rack` (`flex`, `supermicro`) and `software-and-optimization`
(`schneider-electric`). Both are still open S2 rows.

Per §10.6 **(bb1)**, when an instrument cannot be run, say so and measure the property that disabled
it. The lane-opener instrument of **(cc4)** returns nothing here because `reading-the-graph`'s worked
example is a credit-substitution chain among tenants and landlords: this segment sells into that
chain rather than appearing in it.

## 3. Who dominates, and on what basis

### 3a. The brief's hypothesis was tested against the graph and REJECTED

§7.45 proposed that this segment is **"two markets wearing one name"** — a thermal-equipment market
and a power-and-IT market that has annexed the cold plate — and asked that the reading be tested
before publishing. It was, against `profiler-graph.json`, and it does not hold.

| Graph test | Result |
|---|---|
| Edges among the eleven | **26** — 23 carrying at least one curated typing, 3 present but untyped |
| Curated typings | **39**: `competitor` **36**, `partner` **2**, `other` **1** |
| Distinct `competitor` pairs | **21 of the 55 possible — 38 %** |
| Components of the competitor subgraph | **ONE, of ten members** |
| Members outside it | **1** — `aligned`, typed `other` to `vertiv` and nothing else |
| Cut vertices | **1** — `coolit`, and cutting it detaches only `supermicro`, a degree-1 leaf |
| Components of the **thermal-touching** competitor subgraph | **ONE, of nine** |

Session 14's **(ee2)** found a roster whose competitor subgraph fell into 6 + 10 + 1 on one node and
one edge; that is what a two-market segment looks like in the graph. **Nothing here cuts.** Remove
the only cut vertex and the result is 8 + 1. So the segment is not two markets.

### 3b. What IS true is sharper, and two independent rankings prove it by inverting

The segment has **two third-party rankings of itself, and they run in opposite directions at both
ends**:

| Ranking | Published | Places |
|---|---|---|
| **ABI Research** — competitive ranking of thermal-management providers for data centres | 30 January 2025 | **Vertiv 1st** (Market Leader) · Johnson Controls · **Schneider Electric 3rd** · Daikin · **Trane 5th** (Mainstream tier) |
| **Global Market Insights** — data-centre chiller share of a USD 2.6bn 2025 market | August 2026 | Johnson Controls 20.9 % · **Trane 2nd at 18.7 %** · Carrier 14.5 % · Daikin 12.0 % · **Vertiv 5th at 8.1 %** |

**Vertiv is first on one and fifth on the other. Trane is fifth on one and second on the other.**
And the corpus states the reason itself, **twice, from both companies' files, in almost the same
words and with neither citing the other** — *"because the two companies are strong at different
points in the same chain."* That is session 13's **(dd2)** corpus-internal cross-attestation firing
a second time, and for the first time about a **ranking** rather than about a structural clock.

**So the published judgment is this: cooling has no single rank order, and the reason is not that it
is two markets but that it is ONE CHAIN WITH TWO MEASURING POINTS.** Name the list and the point it
measures, or the number is a category error. That satisfies session 14's **(ee1)** condition one in
a new way: (ee1) required naming *which* list because one publisher runs several; here the two
publishers measure different *places*, and the fix is the same sentence.

### 3c. A third ranking, on the newest layer, and it agrees with neither

| Ranking | Published | Places |
|---|---|---|
| **Dell'Oro** — liquid cooling | January 2026 | **Vertiv the leader**, with **CoolIT**, nVent and **Boyd** holding strong positions. Supermicro **not named at all** |
| **Dell'Oro** — market shape | September 2025 | *"around 40 companies with CDUs"*; *"we expect fewer than 10 vendors to ultimately capture the lion's share"* |
| **Omdia** — data-centre thermal | current in `vertiv` v9 | **Vertiv top-3**, with **~6 points of share gained** — the movement column **(ee1)** condition two asks for |
| **Omdia** — CDUs | 2023 | **CoolIT first** |

Three assessments, three populations, and **only Vertiv appears in all three** — first in two of
them and fifth in the third. Trane appears in two and is absent from the liquid-cooling one.
Schneider appears in one by name. CoolIT appears only where the layer is liquid.

### 3d. The CDU ladder looks like a ranking and is not one

Every member that sells a merchant unit publishes a capacity, so a ladder is available — and it
must be published with its own defeater, because the top rung is not the same kind of object as the
rest:

| Member | Role here | Top published CDU | What the number is |
|---|---|---|---|
| `trane-technologies` | incumbent | **14 MW** | **a scalable assembly** — GigaModular in 2.5 MW blocks, validated to 14 MW |
| `delta-electronics` | adjacent | **3 MW** | a single unit — GoCool liquid-to-liquid, shipping |
| `schneider-electric` | incumbent | **2.5 MW** | a single unit — Motivair MCDU-70, January 2026 |
| `vertiv` | incumbent | **2.3 MW** | top of the CoolChip family, which starts at 70 kW |
| `liteon` | adjacent | **2.1 MW** | in-row |
| `coolit` | incumbent | **2.0 MW** | CHx2000, at 5 °C ATD, rated at **12 GB300 NVL72 racks** |
| `flex` | adjacent | **1.8 MW** | modular rack-level, two to six units per rack from 600 kW |
| `supermicro` | adjacent | **1.8 MW** in-row | 250 kW in-rack; sold as an attach to the compute |
| `eaton` | challenger | not separately published | entered by buying Boyd Thermal |
| `mitsubishi-electric` | adjacent | **none** | sells the chiller, not the CDU |
| `aligned` | adjacent | **none merchant** | 350 kW/rack, deployed platform-wide, never sold |

Two things disqualify the ladder as a rank order. **The top rung is an assembly of blocks and the
others are units**, so 14 MW and 2 MW do not measure the same thing. And the ladder **contradicts
every independent assessment**: it puts an `adjacent` member (Delta, 3 MW) above three of the four
incumbents, and Delta is named by none of ABI, GMI or Dell'Oro. The honest use of the ladder is as
**evidence of convergence** rather than of rank: **eight of the eleven publish a rating on the same
machine** — the other three sell no merchant CDU at all — and they arrived at it from six different
businesses: the room, the building system, the chiller plant, the cold plate, the power shelf and the
server rack. CoolIT's own file adds that the unit of competition has already moved past megawatts to
**racks cooled per CDU**.

### 3e. Position at the top was bought; position on the bench was built

The single most compact fact about this roster: **every one of the five ranked members' liquid-cooling
positions changed hands inside eighteen months.**

| Member | How the position was taken | Consideration |
|---|---|---|
| `eaton` (challenger) | bought **Boyd Thermal**, closed 12 March 2026 | **USD 9.5bn** at 22.5× forward EBITDA; ~USD 1.7bn of 2026 sales, about **USD 1.5bn of it liquid cooling** |
| `coolit` (incumbent) | **was itself bought** — Ecolab from KKR, closed 2 July 2026 | **~USD 4.75bn**, 29× NTM adjusted EBITDA on ~USD 550m expected sales |
| `schneider-electric` (incumbent) | took control of **Motivair**, September 2025 | not disclosed |
| `trane-technologies` (incumbent) | **LiquidStack** minority 2023 → full March 2026; **Stellar Energy** February 2026 | Stellar **USD 553.4m gross**; LiquidStack not disclosed |
| `vertiv` (incumbent) | assembled equivalent scope in **four** deals — PurgeRite, Strategic Thermal Labs, ThermoKey, BMarko | PurgeRite **~USD 1.0bn**; the other three not disclosed |

The bench did the opposite. Delta's GoCool, LiteOn's line and Mitsubishi's CritiCool (introduced
2021) are organic; Supermicro's 10-K states it manufactures its own CDUs and manifolds; Aligned's
own file calls its Delta³/DeltaFlow programme *"a sustained build-not-buy pattern"* behind 50+
patents. **One adjacent bought, and its price is what makes the axis legible: Flex paid USD 53m for
JetCool in November 2024 against Eaton's USD 9.5bn for Boyd — the same layer, about 179× apart**, a
comparison Eaton's own dossier draws.

So `who-dominates-and-on-what-basis` answers: **Vertiv, on the only basis that appears in all three
independent assessments and on the one movement figure anybody publishes; Trane, on the plant, where
the rank order reverses; Schneider, on the design layer rather than the hardware layer; and CoolIT,
on the chip end, where no plant-side ranking reaches.** Four incumbents, four different measuring
points, and the registry is right about all four.

## 4. Who threatens — one challenger, and a bench that is everybody else's incumbent

### 4a. The registry gives this segment one challenger, and it bought its way in

`eaton` is the only member typed `challenger`, and the basis line says why in eight words: *"~$1.5B
of liquid cooling entered by acquisition."* It is a challenger **here** and an incumbent in
`in-hall-power`, and it holds `adjacent` in four other segments. Its own dossier calls the whole
conversion inorganic by design — about **USD 12.5bn across Fibrebond, Ultra PCS and Boyd Thermal in
fourteen months** — and an analyst read quoted in it says Eaton went *"all-in on liquid cooling
rather than dipping a toe like other players."* At 22.5× forward EBITDA, the file's own words are
that *"the price demands execution."*

A one-challenger threat section is writable — session 8's **(y4)** established that — but here the
single challenger is **not where the threat is**, and the measurement says so.

### 4b. The organising measurement: the rank order here is the INVERSE of the rank order everywhere else

Nine of the eleven members belong to at least one other segment. Measured against the parsed
registry on 2026-09-17:

| | Members | Memberships elsewhere | Ranked **higher** elsewhere | Ranked **lower** elsewhere | Same role |
|---|---|---|---|---|---|
| Incumbent here | 4 | 6 | **0** | 4 | 2 |
| Challenger here | 1 | 5 | 1 | 4 | 0 |
| **Adjacent here** | **6** | **11** | **8** | **0** | 3 |
| **Total** | **9 of 11** | **22** | **9** | **8** | **5** |

**17 of 22 memberships invert — 77 %**, and the direction is not mixed, it is sorted by the role the
member holds here. **All nine promotions elsewhere belong to members this segment does not rank at
the top. All eight demotions belong to members it does.** No incumbent here is ranked higher
anywhere else, in six chances. No adjacent here is ranked lower anywhere else, in eleven.

### 4c. Two standing instruments fire at once, in opposite directions — which no landscape has met

Session 10's **(aa2)**: when a segment's adjacents are 100 % ranked elsewhere, the segment is a
**product** other industries make rather than a layer other industries sell into. It fires — **6 of
6**, with no exception: `delta-electronics` and `liteon` are incumbents in
`power-conversion-and-rack-power-silicon`; `mitsubishi-electric` is an incumbent in **both**
`grid-equipment` and `in-hall-power`; `flex` is a challenger in two segments; `aligned` is an
incumbent landlord; `supermicro` is a challenger in `compute-and-the-rack`.

Session 14's **(ee3)**: when a segment's incumbents are demoted to `adjacent` everywhere else, the
segment is the **services layer** the rest of the chain borrows from. It fires too — of the six
memberships the four incumbents hold elsewhere, **four are demotions to `adjacent`** and the other
two are `in-hall-power`, the one neighbour that ranks them at all.

The two instruments have never both returned true before, and they are not in conflict: they are the
two halves of one statement. **Cooling is the only segment in the taxonomy whose rank order is the
inverse of the rank order everywhere else, member for member** — and §3b explains why. A segment
whose own rank depends on the measuring point will invert against every neighbour that measures
somewhere else, because the neighbour is measuring somewhere else by definition.

The two members that **cannot** invert are the proof. `trane-technologies` and `coolit` belong to no
other segment at all — the only two of eleven — and they are the two pure cooling plays, one at each
end of the chain. **The graph carries no edge between them of any kind.** The segment's only two
members with nothing to contradict them are also the two that never meet.

### 4d. So where the threat actually is

Not from the challenger bench, which is one firm. **From six companies that are somebody else's
incumbent, arriving with a cooling line bolted to a franchise they already hold in the same
building** — the power shelf (Delta, LiteOn), the switchgear and UPS (Mitsubishi), the rack (Flex,
Supermicro) or the hall itself (Aligned). Three facts size it:

- **Delta and LiteOn are already inside the rack.** Delta is the first-qualified power-shelf supplier
  for GB200/GB300 NVL72 and TrendForce's named primary beneficiary of the 800 V shift; it now ships
  a 3 MW CDU and a 2.4 MW unit that is **800 VDC-native by design**. Vertiv's own dossier concedes
  the point: *"Delta-class ODM power vendors sit closer to the NVIDIA rack than any incumbent."*
- **Aligned is the demand side refusing to buy.** Its edge to `vertiv` is typed `other`, not
  `competitor`, and the note is the whole reading: in-house cooling IP *"is its moat claim versus
  peers who buy merchant CRAH/CDU equipment from Vertiv and others."* A landlord that builds its own
  is a unit of demand that never enters anybody's order book.
- **Supermicro is the boundary the registry argues in writing.** The segment's `notes` field is about
  this one member and it cuts both ways in as many words: the FY2026 10-K states Supermicro
  *manufactures* the CDUs and manifolds — the same standard on which Delta and LiteOn sit here — but
  Dell'Oro names Vertiv the liquid-cooling leader and **does not name Supermicro at all**, every
  DLC-2 performance figure is a company claim rather than an independent measurement, and a DLC
  component shortage cost it a reported **USD 800m of revenue in a quarter**, *"which is the
  behaviour of a taker of cooling supply rather than a maker of it."* **Adjacent, not challenger** —
  and the module publishes the registry's reasoning rather than the label alone.

One corpus-internal disagreement belongs here and is stated rather than smoothed: `coolit`'s file
records Supermicro as **a stated collaborator**; Supermicro *"names no third-party cooling vendor
anywhere in its filings or product pages."* The graph resolves it as `competitor` and says why —
*"no source reconciles them, so the substantive and mutually supported reading is competition in
cold plates and rack CDUs."* Session 13's **(dd2)** found two dossiers **agreeing** unprompted; this
is the same instrument returning a **disagreement**, and the graph's typing is the arbitration.

## 5. Each player's bet — eleven rows, and why the table is not five

§10.6 specifies one row per incumbent and challenger, which here would be **five**. The table below
carries **eleven**, and the reason is §4b rather than a preference: on a roster where six of the
eleven are somebody else's incumbent and every one of them is promoted elsewhere, a five-row table
would omit the thing the module is about. Session 4's **(m)** established that section proportions
follow the segment; this is the same rule adding rows instead of removing them. Every bet is drawn
from the member's own `strategyRead[]` and is **analysis, labelled as analysis** — never blended
with the fact columns of §3.

| Member | Role | The bet |
|---|---|---|
| `vertiv` | incumbent | That being the **pure play** is worth the volatility. ~75–80 % data-centre revenue, a USD 15.0bn backlog at end-2025 and a book-to-bill near 2.9× — and a stock that moved −25–30 % on the DeepSeek scare and −10–17 % on a 3 % revenue miss. Its own file names execution, not demand, as the binding risk into 2027: five plant expansions and six acquisitions integrating at once |
| `schneider-electric` | incumbent | That the **design layer** beats the hardware layer. The only incumbent with NVIDIA co-developed designs spanning electrical, cooling controls and whole-factory blueprints — a position that pulls its hardware into projects before competitive bidding starts. Its own caveat: no design-linked order figures are published |
| `trane-technologies` | incumbent | That a chiller vendor which **stops at the plant room** sells into a shrinking share of the heat path — so buy down the chain. Its own file grades the execution as *following rather than leading*: a 2023 minority in LiquidStack converted to full ownership only after Schneider took Motivair. The instrument is now the **reference design**, three published in ten months |
| `coolit` | incumbent | That the **CDU is where the margin and the consolidation are decided**, and that the recurring revenue is chemistry and monitoring rather than hardware — Ecolab's thesis, and the reason it paid 29× for a hardware maker. Its own stated risk: hyperscalers run their own fluid programmes and treat the CDU as a commodity |
| `eaton` | challenger | That AI data centres will buy **delivered power systems rather than components** — switchgear, UPS, busway, prefab, liquid cooling and on-site generation as one grid-to-chip scope, assembled inorganically. Its own file prices the risk: four integrations plus a spin-off landing together in 2026–2027, against a market that already prices it for perfection |
| `delta-electronics` | adjacent | That **proximity to the rack** wins the cooling attach. First-qualified power shelves, a reported NVIDIA DC-DC exclusive, and a CDU line that is 800 VDC-native by design. Its own file names the exposure: AI data centre is >50 % of revenue |
| `liteon` | adjacent | That the **BBU franchise becomes non-discretionary** as backup moves from optional to standard, and that the CDU rides in beside it. Its own file concedes it is a step behind Delta on the 800 V GPU-side ramp and is routing around it via ASIC customers |
| `flex` | adjacent | That **buying, not building**, closes a credible-but-sub-scale position — about USD 6.3bn across six deals since 2021, JetCool among them at USD 53m. Its own file states the gap plainly: *JetCool appears in no liquid-cooling league table from any named ranking*. The Cloud and Power Infrastructure separation targeted for Q1 2027 governs everything else |
| `mitsubishi-electric` | adjacent | That **one corporate parent** for the medium-voltage equipment upstream, the UPS inside and the chiller beside it is the differentiator. Its own file is the most sceptical of any member about its own marketing: the real exposure is transmission and distribution rather than the UPS line the data-centre pitch leads with |
| `aligned` | adjacent | That cooling IP is a **landlord's moat rather than a product** — Delta³ at ~1 % of IT load in fan power against ~10 % for CRAC/CRAH rows, DeltaFlow at 350 kW/rack, 50+ patents, and a waterless closed loop that its own file frames as removing the **water-permitting veto** in Texas, Arizona and Utah |
| `supermicro` | adjacent | That **scope across the seam** beats depth anywhere on it — GPU systems at one end and 1–50 MW cooling towers at the other, sold as building blocks. Its own file grades the cooling position honestly: a genuine manufactured line, and **not** a leadership one |

## 6. The indicators

Ten rows. **Four carry a day**, two carry a month or quarter, one is in force with **no end date at
all**, and three are undated by construction. Every date is the corpus's own; none is inferred.

| # | What to watch | When | Why it moves a judgment here |
|---|---|---|---|
| 1 | **CoolIT's next-generation CDU** — a named capacity above 2 MW and any Vera Rubin NVL72 rating | **28 September 2026** | The segment's own file calls it an indicator to watch: it would confirm that the CDU is where consolidation is decided and close the Rubin gap. A re-badged CHx2000 would not. **This module's `reviewBy`** (§10) |
| 2 | **Section 301 exclusion expiry** — 178 exclusions revert to the underlying list rate at 23:59 ET, and they *"specifically include rotary compressors within defined wattage ranges"* | **9 November 2026** | The one future effective date in the whole fence. It is a component-cost gate on the plant side, and it is **already the generated segment lesson's own review date** — which is why it is an indicator here and not this module's clock |
| 3 | **Ecolab's Q3 filing** — the first to carry CoolIT inside the Global Water segment | late October 2026 | Any disclosed contribution or customer-concentration language tests the 29× price and the *"four of the five hyperscalers"* claim that has never been attributed to a named customer |
| 4 | **The next Dell'Oro and Omdia rankings** | Q4 2026 | Whether Vertiv holds the liquid-cooling lead against a forty-vendor field the same publisher expects to consolidate below ten. The movement column, not the level |
| 5 | **Vertiv's 800 VDC portfolio and Italian chiller capacity** | 2H 2026 / end-2026 | The pure play doubling plant capacity while announcing a DC portfolio no incumbent has yet shipped as a switchboard product |
| 6 | **Flex's Cloud and Power Infrastructure separation** | targeted Q1 2027 | It removes a cooling line from a contract manufacturer's balance sheet and puts it in a standalone — changing what "adjacent" means for one of the six |
| 7 | **EPA Technology Transitions** — industrial process chillers moved from 2026 and 2028 | **1 January 2030** | The forced-replacement catalyst that one incumbent had already priced in, now pushed out. A demand-timing change, not a compliance problem |
| 8 | **Section 232** — residential HVAC held at 15 % ad valorem, and the capped 15 % rate on specified electrical-grid equipment, both **through 31 December 2027**, rising to 25 % from 2028 | **31 December 2027** | A cross-segment regime that reaches this roster from two directions. Per **(z7)** it has no segment home and is watched rather than owned |
| 9 | **The Texas ERCOT data-centre audit** — new Texas projects frozen pending it | in effect **August 2026, no end date** | One member has publicly committed to the state's standards and positions **zero-water operational cooling** as already compliant. A pause with no end date cannot be a clock, but it is the clearest live example of water deciding a site |
| 10 | **The first covered operator to name a cooling supplier** | undated | Two members' files record the same absence from opposite ends: *no public source names a single hyperscaler, colocation operator or general contractor as a Trane customer*, and CoolIT's *"four of the five hyperscalers"* names none of them. The first disclosure resolves the largest gap in §9 |

## 7. The seller's play — §10.10's two paths

### 7a. The AIDC-power seller

**You are selling into the other half of the megawatt, and the half you do not sell has a different
buyer.** Three things follow from §3 and they are practical rather than rhetorical.

**Know which ranking the room is holding.** If the customer's thermal shortlist came from a
chiller-share table, Trane is second and Vertiv is fifth. If it came from a thermal-management
assessment, Vertiv is first and Trane is fifth. Both are published, neither is wrong, and the two
describe **different points on one chain**. A seller who cites the ranking that suits them without
naming the list and its measuring point will be corrected by the one person in the room who has the
other table — and the correction is fatal because it is true.

**Assume the cooling incumbent is also your power competitor, or your power partner.** Nine of
eleven members sit in another segment; three of the five ranked members are `in-hall-power`
incumbents. The clearest single instance is the **Eaton–Trane** pair: the only `partner` typing in
the segment, an August 2026 joint reference design integrating Eaton electrical infrastructure with
Trane chillers, CDUs and controls, claiming **80 % less copper and 30 % lower installation cost**.
Two firms that compete nowhere are selling one scope — and reference designs get a vendor specified
before procurement starts, which is the go-to-market instrument three members now name as primary.

**The approach temperature is the negotiation, not the spec sheet.** §2c's number is where the
vendor's product meets the building's water, and it is published per unit — 5 °C on one 2 MW CDU,
15 °C on a liquid-to-air unit, 4 °C on an 800 VDC-native one. Every degree spent there is a degree
the plant cannot spend, and the lesson teaches why. The seller's use is narrower: **it tells you
which vendor's unit lets this site run without a chiller**, which is the whole of buying criteria 1
and 2.

### 7b. The BESS seller

The honest answer to *does this segment buy storage* is **rarely and indirectly** — and the two
places it does are worth knowing precisely.

**One member has already bought.** Aligned framed a **31 MW / 62 MWh** battery explicitly as an
**interconnection accelerator** in October 2025, alongside a 540 MW self-funded gigascale campus.
That is a landlord's purchase made for a power reason, and the cooling platform is the same
company's — so the storage conversation and the cooling conversation are with one counterparty.

**One member is crossing into your lane.** Vertiv's EnergyCore Grid is a **1 MW to 200+ MW
utility-grade product sold through data-centre relationships**, and its own file reads this as
convergence between data-centre power vendors and the BESS integrator space — *"a lane-crossing move
worth tracking for every storage vendor in this file."* Supermicro sells a **1.5 MW / 3.1 MWh**
system as site infrastructure beside its cooling towers. Neither is a storage company; both are
selling storage to a buyer you already call on.

**And what to stop doing**: pitching thermal management as a BESS differentiator in this room. Every
one of these eleven sells thermal management for a living, four of them rank on it independently,
and the container's HVAC is a component to them rather than a claim.

## 8. Claims ledger

Every claim to a dossier at the profile version read on **2026-09-17**, plus the two registries.
Dossiers already cite their own sources, so the ledger cites dossiers — §10.6's rule.

| # | Claim | Source | Field |
|---|---|---|---|
| 1 | 11 members, 4 · 1 · 6; chain position 8, tier `build`; six buying criteria | `profiler-segments.json` | `segments[cooling]` |
| 2 | 26 edges among the eleven; 39 curated typings (36 `competitor`, 2 `partner`, 1 `other`); one competitor component of ten | `profiler-graph.json` @ built 2026-09-13 | `edges[]` |
| 3 | ABI Research 30 January 2025 — Vertiv 1st Market Leader, Schneider 3rd, Trane 5th Mainstream, with Johnson Controls and Daikin between | `profile:trane-technologies` @ v1 | `productsAndServices[2].positioning`, `relationships[2].context` |
| 4 | Global Market Insights August 2026 — Johnson Controls 20.9 %, Trane 18.7 %, Carrier 14.5 %, Daikin 12.0 %, Vertiv 8.1 % of a USD 2.6bn 2025 data-centre chiller market | `profile:trane-technologies` @ v1 | `productsAndServices[0].positioning` |
| 5 | *"because the two companies are strong at different points in the same chain"* — stated independently in both files | `profile:trane-technologies` @ v1 · `profile:vertiv` @ v9 | `relationships[2].context` · `relationships[9].context` |
| 6 | Dell'Oro January 2026 — Vertiv the liquid-cooling leader; CoolIT, nVent and Boyd strong; Supermicro not named | `profile:supermicro` @ v1 | `strategyRead[3]`, `productsAndServices[0].positioning` |
| 7 | Dell'Oro September 2025 — *"around 40 companies with CDUs"*, *"fewer than 10 vendors to ultimately capture the lion's share"* | `profile:coolit` @ v1 | `productsAndServices[0].positioning`, `strategyRead[1]` |
| 8 | Omdia — Vertiv top-3 in data-centre thermal with ~6 points of share gained; Omdia placed CoolIT first in 2023 | `profile:vertiv` @ v9 · `profile:coolit` @ v1 | `ecosystemRole`, `productsAndServices[1].description` · `strategyRead[1]` |
| 9 | CDU ladder — Trane GigaModular 2.5 MW blocks validated to 14 MW; Delta GoCool 3 MW; Schneider/Motivair MCDU-70 2.5 MW; Vertiv CoolChip 70 kW–2.3 MW; LiteOn 2.1 MW in-row; CoolIT CHx2000 2.0 MW at 5 °C ATD / 12 GB300 NVL72 racks; Flex 600 kW–1.8 MW; Supermicro 1.8 MW in-row, 250 kW in-rack | `profile:trane-technologies` @ v1 · `profile:delta-electronics` @ v5 · `profile:schneider-electric` @ v9 · `profile:vertiv` @ v9 · `profile:liteon` @ v6 · `profile:coolit` @ v1 · `profile:flex` @ v1 · `profile:supermicro` @ v1 | `productsAndServices[]` |
| 10 | Eaton bought Boyd Thermal for USD 9.5bn at 22.5× forward EBITDA, closed 12 March 2026; ~USD 1.7bn 2026 sales, ~USD 1.5bn liquid cooling; ~USD 12.5bn of M&A in 14 months | `profile:eaton` @ v8 | `summary`, `productsAndServices[3]`, `strategyRead[0]` |
| 11 | Ecolab bought CoolIT for ~USD 4.75bn, 29× NTM adjusted EBITDA on ~USD 550m expected sales, closed 2 July 2026 | `profile:coolit` @ v1 | `summary`, `strategyRead[0]` |
| 12 | Trane — LiquidStack minority 2023 → full March 2026; Stellar Energy February 2026 for USD 553.4m gross; *"buying its way down the thermal chain… as a follower"* | `profile:trane-technologies` @ v1 | `ecosystemRole`, `strategyRead[0]` |
| 13 | Schneider took control of Motivair September 2025; MCDU-70 launched January 2026; the cooling lead is *"contestable"* | `profile:schneider-electric` @ v9 | `strategyRead[3]` · `profile:trane-technologies` @ v1 `strategyRead[0]` |
| 14 | Vertiv assembled equivalent scope through PurgeRite (~USD 1.0bn), Strategic Thermal Labs, ThermoKey and BMarko | `profile:vertiv` @ v9 | `productsAndServices[1].positioning`, `strategyRead[3]` |
| 15 | Flex paid USD 53m for JetCool in November 2024, against Eaton's USD 9.5bn for Boyd | `profile:eaton` @ v8 · `profile:flex` @ v1 | `relationships[8].context` · `strategyRead[2]` |
| 16 | 9 of 11 shared, 22 memberships elsewhere, 17 inversions; 0 of 6 incumbent memberships promoted, 0 of 11 adjacent memberships demoted | `profiler-segments.json` | `segments[].members[]` across all 19 |
| 17 | `trane-technologies` and `coolit` belong to no other segment; the graph carries no edge between them | `profiler-segments.json` · `profiler-graph.json` | `segments[].members[]` · `edges[]` |
| 18 | Eaton–Trane joint reference design, August 2026, claiming 80 % less copper and 30 % lower installation cost | `profiler-graph.json` · `profile:trane-technologies` @ v1 | `edges[].curated` (`partner`, since 2026-08) · `strategyRead[1]` |
| 19 | Aligned's in-house cooling IP is *"its moat claim versus peers who buy merchant CRAH/CDU equipment from Vertiv and others"*; Delta³ ~1 % of IT load in fan power vs ~10 %; DeltaFlow 350 kW/rack; 50+ patents; waterless loop removes the water-permitting veto | `profiler-graph.json` (`other` typing) · `profile:aligned` @ v7 | `edges[].curated.a.note` · `strategyRead[1]`, `policyExposure[0]` |
| 20 | Supermicro — *"adjacent, not challenger"*, on a manufactured product line rather than a market position; USD 800m of revenue lost in a quarter to a DLC component shortage | `profiler-segments.json` `notes` · `profile:supermicro` @ v1 | `segments[cooling].notes` · `strategyRead[2]`, `strategyRead[3]` |
| 21 | CoolIT records Supermicro as a stated collaborator; Supermicro names no third-party cooling vendor anywhere; the graph types it `competitor` and says no source reconciles them | `profiler-graph.json` · `profile:coolit` @ v1 · `profile:supermicro` @ v1 | `edges[].curated.b.context` · `ecosystemRole` · `productsAndServices[]` |
| 22 | Delta first-qualified for GB200/GB300 NVL72 power shelves; TrendForce's named primary 800 V beneficiary; 2.4 MW 800 VDC-native CDU with a 4 °C approach; AI data centre >50 % of revenue | `profile:delta-electronics` @ v5 | `strategyRead[0]`, `strategyRead[3]`, `productsAndServices[]` |
| 23 | *"Delta-class ODM power vendors sit closer to the NVIDIA rack than any incumbent"* | `profile:vertiv` @ v9 | `strategyRead[1]` |
| 24 | LiteOn — BBUs move from optional to standard; a step behind Delta on the 800 V GPU-side ramp; 2.1 MW in-row CDU | `profile:liteon` @ v6 | `strategyRead[0]`, `strategyRead[1]`, `productsAndServices[]` |
| 25 | Flex — *"JetCool appears in no liquid-cooling league table from any named ranking"*; ~USD 6.3bn across six deals; separation targeted Q1 2027 | `profile:flex` @ v1 | `strategyRead[3]`, `strategyRead[2]`, `strategyRead[0]` |
| 26 | Mitsubishi — CritiCool air-cooled chillers plus MEWALL and 10/20/40 kW DX units, introduced 2021 and sold beside the UPS line; exposure is really transmission and distribution | `profile:mitsubishi-electric` @ v3 | `productsAndServices[]`, `strategyRead[0]` |
| 27 | Vertiv — ~75–80 % data-centre revenue, USD 15.0bn backlog at end-2025, book-to-bill ~2.9×; −25–30 % on DeepSeek, −10–17 % on a 3 % miss; execution the binding risk into 2027 | `profile:vertiv` @ v9 | `summary`, `strategyRead[0]`, `strategyRead[3]` |
| 28 | Schneider — the only vendor with NVIDIA co-developed designs spanning power, liquid-cooling controls and factory blueprints; no design-linked order figures published | `profile:schneider-electric` @ v9 | `ecosystemRole`, `strategyRead[0]` |
| 29 | Trane — order backlog USD 12.1bn at Q2 2026, up 70 %; no data-centre revenue figure of any kind; no named data-centre customer anywhere in the public record | `profile:trane-technologies` @ v1 | `summary`, `ecosystemRole`, `strategyRead[5]` |
| 30 | Section 301 — 178 exclusions expire 23:59 ET 9 November 2026, specifically including rotary compressors within defined wattage ranges | `profile:trane-technologies` @ v1 | `policyExposure[4]` |
| 31 | CoolIT's next-generation CDU launches 28 September 2026, engineered for 1 MW+ racks; a named capacity above 2 MW would confirm Judgment 2 and close the Rubin gap | `profile:coolit` @ v1 | `strategyRead[8]` (**INDICATORS TO WATCH**), `productsAndServices[0].roadmap`, `recentDevelopments[1]` |
| 32 | EPA Technology Transitions — industrial process chillers moved from 2026 and 2028 to 1 January 2030; AIM Act allowance steps 2026-2028, 2029-2033, 2034-2035, 2036 | `profile:trane-technologies` @ v1 | `policyExposure[1]`, `policyExposure[0]` |
| 33 | Section 232 — residential HVAC at 15 % ad valorem through 31 December 2027; capped 15 % on specified electrical-grid equipment through 2027-12-31, 25 % from 2028 | `profile:trane-technologies` @ v1 · `profile:mitsubishi-electric` @ v3 | `policyExposure[3]` · `policyExposure[0]` |
| 34 | Texas ERCOT data-centre audit in effect August 2026 with new projects frozen and no end date; Aligned publicly committed to the state standards | `profile:aligned` @ v7 | `policyExposure[0]` |
| 35 | Aligned's Calibrant BESS, 31 MW / 62 MWh, October 2025, framed as an interconnection accelerator; Project Caprock 540 MW | `profile:aligned` @ v7 | `strategyRead[2]` |
| 36 | Vertiv EnergyCore Grid, 1 MW–200+ MW, *"a lane-crossing move worth tracking for every storage vendor in this file"*; Supermicro's 1.5 MW / 3.1 MWh system sold as site infrastructure | `profile:vertiv` @ v9 · `profile:supermicro` @ v1 | `strategyRead[4]` · `productsAndServices[0]` |
| 37 | CoolIT — *"4 of the top 5 server OEMs and 4 of the 5 hyperscalers as customers"*, no hyperscaler named anywhere; concentration undisclosed by design | `profile:coolit` @ v1 | `summary`, `strategyRead[3]`, `strategyRead[7]` |

## 9. What the record does NOT say

Seven absences, each stated by the file that has it rather than asserted here.

**The corpus does not cover the top of this segment's own plant market.** The chiller table names
five vendors with percentages and **two of them are members** — Trane at 18.7 % and Vertiv at 8.1 %,
**26.8 points**. The other three — Johnson Controls at 20.9 %, Carrier at 14.5 % and Daikin at
12.0 %, **47.4 points** — have no dossier at all. The market leader of the plant layer is outside
the roster. ABI's five have the same shape: three members, two absent. Dell'Oro's four liquid-cooling
names: two members, one (**Boyd**) reachable only through the challenger that bought it, and one
(**nVent**) absent entirely.

**No cooling vendor in this corpus has a named data-centre customer.** Trane's file states it after
an exhaustive check: *no source states a commercial relationship between Trane Technologies and any*
hyperscaler, colocation operator, AIDC developer or general contractor, and the only two stated
relationships in the ecosystem are the NVIDIA and Eaton reference designs. CoolIT claims *"4 of the
5 hyperscalers"* and names none. **The buyer side of this segment is invisible on both ends.**

**Trane publishes no data-centre revenue figure of any kind** — "data center" appears in its FY2025
10-K four times, all inside an alphabetical product list — while its backlog growth is attributed to
data-centre orders. CoolIT *"publishes no revenue, margin, installed-megawatt or annual unit
figure."* Two of the four incumbents therefore cannot be sized on the business this segment is about.

**Two members' own pages contradict themselves and no source reconciles them.** Supermicro's
liquid-to-air sidecar is published at *"up to 200 kW on the DCBBS page and up to 500 kW on the
liquid-cooling page"*; its HBM4 bandwidth appears as both 1.4 PB/s and 1.6 PB/s. Recorded because a
capacity ladder (§3d) is only as good as the capacities on it.

**Every DLC-2 performance figure is a company claim** — 98 % heat capture, 40 % power saving, 20 %
lower total cost of ownership — *"rather than an independent measurement"*, in that member's own
words. The same caution applies to CoolIT's published head-to-head, which compares the CHx2000 at
2,269 kW against **anonymised** competitors at 1,073 kW and 734 kW.

**Two members carry no `policyExposure` array at all** — `vertiv`, an incumbent, and `eaton`, the
challenger. They are the leader named by all three independent assessments and the firm that paid the
most to enter. The fence in §6 is therefore thin by absence rather than by measurement, and any
refrigerant or tariff exposure those two carry is simply not on the record here.

**The registry's `notes` field addresses exactly one member.** It argues Supermicro's adjacency in
detail and says nothing about the other ten — so the lopsided 4 · 1 · 6 shape, and the fact that the
bench outranks the leaders everywhere else, are measured in §4b rather than explained by the
registry.

## 10. Freshness gate — the `reviewBy` judgment, resolved

**Taken: 2026-09-28.** Eleven days after `updated`, the **earliest `reviewBy` any module in this
corpus carries**, inside its own 30-day horizon by choice.

### 10a. The fence, measured

| | Measured |
|---|---|
| `policyExposure` entries across 11 members | **34** — 3.1 per member |
| Members carrying none at all | **2** — `vertiv` (incumbent) and `eaton` (the challenger) |
| Dated entries | **17 of 34** |
| **Future** day-level `effectiveDate` | **exactly 1** |
| Future day-level dates anywhere in the eleven dossiers | **8**, of which **7 are one event** |

### 10b. §10.6 (bb4) and (dd5) fire together: the sort's one answer is the generator's own

The single future `effectiveDate` in the whole fence is **2026-11-09**, the Section 301 exclusion
expiry in `trane-technologies`' `policyExposure[4]`. It is genuinely **on-subject** — the expiring
exclusions *"specifically include rotary compressors within defined wattage ranges"*, which is
chiller-plant content, not a truck engine. That is unusual: **(x4)**, **(z4)** and **(aa3)** all met
a sort whose one answer was off-subject.

It is still rejected, on **(bb4)**'s ground: `segment-cooling`'s own generated `reviewBy` **is
2026-11-09**, set by the generator from that exact field. A landscape must not duplicate the clock of
the public lesson sitting directly beneath it. Session 13's **(dd5)** named the shape — *the
mechanical route cannot produce a second opinion at all, because the sort and the generator read one
field* — and this is its second firing, in a **new sub-shape**: (dd5)'s date was off-subject *and*
the generator's, so two grounds agreed. Here the date is **on-subject and still unusable**, so the
tautology is the only ground, and reading rather than sorting is the only way out.

### 10c. What reading returns

Seven of the eight future day-level dates in the segment are the **same event**, stated seven
separate times in `coolit`'s file — in `summary`, `productsAndServices[0].highlights[5]`,
`productsAndServices[0].roadmap`, `recentDevelopments[1].headline`, `sources[3].label`,
`strategyRead[1]` and `strategyRead[8]`. It is **28 September 2026**, the launch of a
next-generation CDU *"engineered for 1MW+ ultra-dense AI racks"*, announced 2026-08-17 with **no
name, capacity or specification disclosed**.

The seventh mention is why it is the gate rather than an indicator. `strategyRead[8]` is headed
**INDICATORS TO WATCH** and states the test in the file's own words: *"a named capacity above 2 MW
and any Vera Rubin NVL72 rack rating would confirm Judgment 2 and close the Rubin gap in Judgment 5;
a re-badged CHx2000 would not."* Judgment 2 is that the CDU is where the category's margin and
consolidation are being decided — **which is §3d of this module.** So the date clocks this module's
own central claim, which is exactly what §10.6 asks a `reviewBy` to do, and the module is written to
lean on it: §3d's ladder tops out at a 2.0 MW rung that the segment's chip-side incumbent has
announced it will replace on that day.

### 10d. Nine rejections, in writing

| Candidate | Where | Rejected because |
|---|---|---|
| **2026-11-09** | `trane-technologies` `policyExposure[4]` | **Already `segment-cooling`'s own generated `reviewBy`**, from this exact field — **(bb4)**, and **(dd5)**'s tautology. Kept as **indicator row 2** per **(u)** |
| **2026-11-10** | `flex` `sources[10].label` | Off-subject — an investor day at an `adjacent` member, with no thermal content. And **one day after** a rejected candidate, which is the adjacent-pair trap **(dd5)** names |
| **2027-12-31** | `trane-technologies` `policyExposure[3]`, `mitsubishi-electric` `policyExposure[0]` | **Later than the six-month default** (2027-03-17), and **(z7)** settled that Section 232 is a cross-segment regime with no segment home. Indicator row 8 |
| **2029-04-23** | `mitsubishi-electric` `policyExposure[2]` | Far beyond the default, and off-subject — a distribution-transformer efficiency rule whose exposure that dossier itself calls **indirect** |
| **2030-01-01** | `trane-technologies` `policyExposure[1]` | On-subject (industrial process chillers) and **39 months out**. Row 18 rejected it as a lesson's gate; it fails a module's on distance alone. Indicator row 7 |
| **2032-01-01** | `trane-technologies` `policyExposure[1]` | Further still, and off-subject — supermarket refrigeration and cold-storage warehouses |
| **2030-08-15** | `flex` `relationships[1].context` | Off-subject and far — a customer warrant expiry |
| **AIM Act next allowance step (2029)** | `trane-technologies` `policyExposure[0]` | **No day** — the schedule is stated as year ranges (2026-2028, 2029-2033, 2034-2035, 2036), and inventing a day would be fabrication |
| **Texas ERCOT audit freeze** | `aligned` `policyExposure[0]` | **In effect since August 2026 with no end date.** A pause that has not said when it lifts cannot ring. Indicator row 9 |

Checked and clear: **2026-09-28 is not any other module's `reviewBy`** (the nearest are
`landscape-neoclouds-2026-09` at 2026-09-30 and `landscape-utilities-2026-09` /
`landscape-in-hall-power-2026-09` at 2026-10-01), and it is **not** `segment-cooling`'s.

### 10e. The consequence, stated rather than discovered

`check-classroom-curriculum.py`'s 30-day horizon will report **4 items due for review** instead of
3, and still exit 0 — review dates never call `strict()`. `clReviewChip` renders the module gold
immediately. That is **(k)** firing for a fourth time and it is the rule working: a six-month default
here would put a date field on a module whose own §3d says the ladder it publishes is scheduled to
change in eleven days.

## 11. The Scraper interest seed — ADDED, and the gap is the segment's arithmetic

### 11a. The denominator, re-counted from the file per (bb5)

`SCRAPER_INTEREST_TOPIC_SEEDS` **40 seeds / 258 terms** and `SCRAPER_SEGMENT_SEEDS` **29 lenses /
249 terms** — **507 raw, 482 distinct**. That reconciles exactly with session 14's 472 plus the ten
it added.

### 11b. The roster holds this segment's MACHINES and not its ARITHMETIC

A label-level glance would say cooling is covered, because `seg-cooling` exists. It holds **eight
terms** and every one is an equipment noun: `liquid cooling`, `direct-to-chip`, `immersion cooling`,
`cdu`, `coolant distribution`, `rear-door heat exchanger`, `chiller`, `thermal management`. Scored
against all 482, what is missing is not a residue — it is **four of the six buying criteria**:

| Criterion | Its own vocabulary | Score |
|---|---|---|
| 1 · approach temperature and the facility water the chip vendor allows | `approach temperature`, `facility water`, `technology cooling system`, `warm-water cooling`, `W-class` | **all zero** |
| 2 · PUE and WUE by climate; waterless heat rejection | `WUE`, `water usage effectiveness`, `dry cooler`, `waterless cooling`, `heat rejection`, `free cooling` | **all zero** — while its partner `pue` **is** held |
| 3 · part-load efficiency (IPLV) and the chiller's real operating point | `IPLV`, `part-load efficiency`, `waterside economizer`, `kW/ton` | **all zero** |
| 6 · refrigerant calendar and the sequence the BMS runs | `refrigerant`, `low-GWP`, `AIM Act`, `A2L`, `building management system`, `DCIM` | **all zero** |

The sharpest single instance: **the segment's own pair of ratios is half-seeded.** `pue` is an exact
held term, inside a topic seed alongside `rack density` and `kilowatt per rack`; `WUE` scores zero.
A digest that scores the efficiency half of this segment and not the water half will systematically
under-band the thing that gets campuses refused permits — which the registry's own definition names
as the segment's headline fact.

### 11c. Twelve terms taken

`approach temperature` · `facility water` · `WUE` · `IPLV` · `waterside economizer` · `dry cooler` ·
`cold plate` · `liquid-to-air` · `AIM Act` · `low-GWP` · `factory witness test` ·
`building management system`

Every one scores **zero** on exact, substring and near-duplicate checks against all 482.

### 11d. Drops, with the reason

- **`water usage effectiveness`** — *roster consistency*, a reason no previous session has recorded:
  the paired metric is seeded as the bare acronym `pue` with no expansion, so seeding both forms here
  would double-count one article against a convention the roster already set.
- **`part-load efficiency`** — near-duplicate of `IPLV` per **(cc6)**; IPLV is the discriminating form.
- **`cooling tower`** — mis-bands. The corpus covers `clean-firm-and-nuclear`, and the cooling tower
  is the iconic nuclear-plant image; the same failure class as session 14's `commissioning`.
- **`refrigerant`** (bare) — too generic across automotive and residential HVAC. `AIM Act` and
  `low-GWP` carry the same coverage precisely.
- **`sequence of operations`** — a term of art in HVAC and generic everywhere else (software,
  military, legal).
- **`DCIM`** — precise, but *split grounds* per **(v)**: it is `software-and-optimization`'s, an
  unwritten S2 row, and an S2 session may only add `topic-landscape-<segment>`.
- **`chiller plant`, `centrifugal chiller`, `air-cooled chiller`, `magnetic-bearing chiller`** —
  superstrings of the held `chiller`.
- **`coolant distribution unit`, `in-row CDU`, `in-rack CDU`, `sidecar CDU`** — superstrings of the
  held `coolant distribution`, `cdu` and `sidecar`.
- **`liquid-to-liquid`** — the default case; `liquid-to-air` is the discriminating one (the retrofit
  class) and seeding both would double-count.
- **`CRAH` / `CRAC`** — the machine being displaced rather than this segment's product; it answers
  none of the six criteria.
- **`containment`, `hot aisle`** — split grounds: `the-cooling-plant-and-water` owns containment and
  it belongs to the room rather than to the vendor market.
- **`ASHRAE W17`, `W45`, `W-class`** — almost no article volume; too narrow to score.

### 11e. The seven-seed shortfall, and both standing debts

**`Scraper.gs` holds seven `topic-landscape-*` seeds against fourteen built landscapes** — counted
as **quoted `key:` literals**, because a loose grep on the string returns thirteen. This one takes it
to eight against fifteen. **Seven S2 sessions seeded nothing**, and closing that is a developer
decision rather than a session's: an S2 session may only add its own segment's seed, so the backlog
cannot be cleared from inside the lane that created it.

Both standing reservation debts re-checked against all 482 and **both still open**:

- **`restart`** scores zero for a **seventh** consecutive session. It remains
  `topic-landscape-clean-firm-and-nuclear`'s word for that module's next revision.
- **Session 12's six terms** assigned on split grounds to `topic-aidc-landlords` — `tenant of
  record`, `credit backstop`, `recognition agreement`, `bankruptcy-remote`, `triple-net lease`,
  `penny warrant` — are **still in no seed and still score zero**, a **third** consecutive session
  confirming that a term *assigned* to another seed's territory is not a term *seeded* there. (A
  first pass here checked session **6**'s seven landlord terms by mistake, found all seven held, and
  nearly recorded a false state change — **(aa4)** catching itself: never take a measurement from a
  brief or a memory, open the file.)

## 12. Verification

| Check | Expected |
|---|---|
| `node --check` on `.js` copies of `Classroom.gs` and `Scraper.gs` | clean |
| `scripts/check-gas-inner-scripts.js` | all inner blocks parse |
| `scripts/check-classroom-content.py` | **0 errors / 0 warnings**, 49 lessons / 8 tracks / 142 gate cases, module assertion **23 → 24** |
| `scripts/check-classroom-curriculum.py --strict` | no structural findings; 28 stale pins; **4** items due for review (was 3 — this module's own 2026-09-28, by design, §10e) |
| `scripts/check-classroom-pipeline.py --selftest` | 13 fixtures / 0 failures |
| `scripts/check-classroom-pipeline.py --base origin/main` | **P1** on the plan files, **P2** on the below-the-fence module, no P3, no P5, no P8, no P12 |
| `scripts/build-classroom-segments.py --check` | **7 → 7 → 6** (forecast recorded before the write) |
| `scripts/check-readme-tree.py` | clean after the GAS bumps |
| Playwright render at **contributor** | 9 of 9 sections, zero page errors |
| Real serving path | **analyst → `ROLE_DENIED`**; token < 32 chars → `SESSION_EXPIRED` |


Developed by: LightAISolutions
