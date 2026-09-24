# Landscape — In-Hall Power — Analysis & Module Source

**Module:** `landscape-in-hall-power-2026-09` · lane **The Value Chain** · tier **contributor**
**Provenance:** Corpus synthesis over the segment's 27 member dossiers at the versions in the claims ledger; no ingested document and no new research.
**Written:** 2026-09-15 (S2 session 7, repo v05.93r) · **Seventh landscape, sixteenth guidance module.**

## What this is

The source of truth for the seventh landscape module. It is a **corpus synthesis**: no document was ingested and no new research was run. Every claim traces to a member dossier at the profile version recorded in §8, and the dossiers carry the primary sources. The module JSON lives in `googleAppsScripts/Classroom/Classroom.gs` **below the `// CONTENT END` fence**, registered at the end of `guidanceDocs_()`'s The Value Chain lane.

The segment is **position 5** in the chain and tier **build** — the first landscape S2 has written on a `build`-tier segment whose own definition ends *inside* the building.

## The segment as measured

Re-measured from `profiler-segments.json` on **15 September 2026**, member for member, against the figure `INTEGRATED-REMEDIATION-PLAN.md` §7.29 carried. **They agree exactly: 27 members — 10 incumbent · 7 challenger · 10 adjacent.** This is the **seventh consecutive S2 session** to re-measure its own segment and confirm the brief; the record is now long enough to be worth keeping and still not a reason to skip the count.

It is the **third-deepest segment in the corpus**, behind `storage-developers-and-ipps` (31 at S0, 34 as measured) and `storage-integrators-and-containers` (29 at S0, 32 as measured), and its **ten incumbents are the second-largest incumbent set S2 has met** after `epc-and-construction`'s sixteen.

The registry's `notes` field is **empty** for this segment, as it was for session 6's. The roles therefore have to be read off the 27 basis lines and the dossiers rather than off a label, and §3–§4 below are that work.

**The definition is unusually wide and it is the reason the split in §2 is hard:**

> Everything between the service entrance and the rack whip that keeps a hall up when the grid drops: static, rotary and modular UPS, the switchgear, busway and PDUs inside the fence, the prefabricated power module, the facility-level DC bus, and the VRLA, lithium and flywheel stores under all of it — including the BBU and UPS cells that make the UPS room the one place a battery sale happens inside the building.

**The six buying criteria, verbatim from the registry:**

1. kVA per frame and installed MW per protected MW under the chosen redundancy topology
2. Efficiency in double conversion and in eco-mode; SiC content
3. Repair time and the maintenance day as the design case (monolithic vs modular)
4. Battery type under the UPS — VRLA, lithium, flywheel — minutes of autonomy and float life
5. Reference-design alignment (NVIDIA blueprints) and 800 VDC readiness
6. Lead time for factory-built power rooms and the tested-at-factory guarantee

## Teaching sequence (mirrors the module's nine §10.6 section ids, in order)

| # | Section id | Kind | What it does |
|---|---|---|---|
| 1 | `who-dominates-and-on-what-basis` | prose | The split stated first; then the ten incumbents read as **two groups that do not compete** — seven machine makers, one DC-bus architect, two store makers |
| 2 | `who-threatens` | prose | The seven challengers, **six of whom arrived from the storage layer**, and the three deletion routes carried by *adjacent* members |
| 3 | `each-players-bet` | table | 17 rows — ten incumbents + seven challengers, registry order, every bet labelled analysis |
| 4 | `the-indicators` | table | 10 dated rows, including the two gates rejected for `reviewBy` under §10.6 (r) |
| 5 | `the-sellers-play` | callout | §10.10's two paths — and the storage seller's path here is mostly the public lesson's **honest no**, applied to named parties |
| 6 | `claims-ledger` | ledger | Every load-bearing claim → `profile:<slug> @ vN — field` |
| 7 | `what-the-record-does-not-say` | callout | Eight absences, including the one this segment shares with no other |
| 8 | `drill` | flashcards | 11 cards, first one on the split |
| 9 | `check-yourself` | quiz | 5 judgment questions at the group level |

## 1. Executive read

**The ten incumbents do not compete with one another, and the reason is not stage separation — it is that three of them are not in the same business as the other seven.** Seven build the *machine*: Schneider, Vertiv, Eaton, ABB, Huawei Digital Power, Mitsubishi Electric and Piller. One sells the *architecture of the bus* the machine sits on: Zhonhen. Two build the *store under it*: Narada and Panasonic. A league table across those three groups would rank a UPS frame against a lead-acid string against a 240-volt DC standard.

**Six of the seven challengers arrived from the storage layer and not one of them was a UPS vendor.** Five are cell makers (Samsung SDI, LG Energy Solution, Gotion, EVE Energy, Hithium); one is a BESS integrator productising storage into a medium-voltage UPS category (ON.energy); the seventh, Flex, arrived from contract manufacturing carrying bought switchgear. **So the threat to this segment is not a better UPS. It is a change in what the store is — and the challengers are the companies that make the store.**

**The three routes that could delete the room machine are all carried by *adjacent* members, not by challengers.** A utility-scale battery outside the building at medium voltage (Rosendin + FlexGen's BESSUPS; Prevalon's Hybrid Power Stabilizer); a battery on an 800-volt DC bus at the hall edge (Heron Power's SuperBBU; Delta's grid-to-chip stack); and a fleet-level architecture that declines to protect one building at all — which is the public lesson's territory and is named here, not taught here. **The registry classes all of these as adjacent precisely because they are not UPS vendors, which is what makes the route easy to miss.**

**And the module's own assessment, stated as analysis rather than as a finding of the record: in this segment the useful question is not who is biggest but what each incumbency is made of — because every one of the six things a buyer buys on has its *mechanism* taught somewhere else.** That is §2, and it is the most crowded neighbourhood any landscape has faced.

## 2. The split — eleven neighbours, six of them public lessons

Written **before** the module, per §10.6 (j). Session 6 had four neighbours and called that the record. **This segment has eleven — six public lessons and five registered modules** — and the reason is structural rather than accidental: the segment sits where the public AIDC-power curriculum was built.

### 2a. The finding that organises the whole split

**Every one of the segment's six buying criteria has its mechanism owned by a neighbour.** No previous landscape has had that. It makes the line unusually easy to draw and unusually easy to cross, so it is drawn explicitly:

| # | Buying criterion | Who owns the mechanism | What this module owns |
|---|---|---|---|
| 1 | kVA per frame; installed MW per protected MW under the topology | `the-ups-room` (`the-ladder-and-the-datasheet`, 11 rows) and `redundancy-by-the-numbers` (`the-vocabulary`) | Which vendors publish which block size, and the parallel limit each franchise is sold against |
| 2 | Efficiency in double conversion and eco-mode; SiC content | `the-ups-room` (`three-ways-to-build-one`) and `the-aidc-power-chain` (`the-ups-dial`) | Which vendor takes a published position **against** eco-mode, and which one makes its own silicon |
| 3 | Repair time and the maintenance day (monolithic vs modular) | `the-ups-room` (`three-ways-to-build-one`, `where-it-fails`) | Which vendors sell drawers and which sell monoliths |
| 4 | Battery type — VRLA, lithium, flywheel — autonomy and float life | `the-ups-room` (`the-battery-under-each`, 8 × 4) and `bess-tech-fundamentals-2026-08` (the cell) | Who makes that store, and that six of seven challengers came from there |
| 5 | Reference-design alignment (NVIDIA) and 800 VDC readiness | `nvidia-800vdc-2026-08` and `the-800-vdc-shift` | Who is on the published roster and who is not |
| 6 | Lead time for factory-built power rooms; tested at factory | `grid-equipment-shortage-2026-09` | Which vendors quote which weeks, and who is adding capacity |

**The module therefore owns none of the six tests. It owns only who sits where on each — and the fact that the six together do not sort the roster the way the role labels predict.**

### 2b. The first landscape-against-landscape split, and it is a ROLE INVERSION

`landscape-power-conversion-and-rack-power-silicon-2026-09` (S2 session 5) is the adjacent position, and this is the first time a landscape has had to split against another landscape. **The line is not subject matter. It is the registry's own role assignment, and it inverts.**

**Eight members sit in both segments, and five of the eight carry a different role in each:**

| Member | In `in-hall-power` | In `power-conversion-and-rack-power-silicon` |
|---|---|---|
| Schneider Electric | **incumbent** | adjacent |
| Eaton | **incumbent** | adjacent |
| ABB | **incumbent** | adjacent |
| Delta Electronics | adjacent | **incumbent** |
| Heron Power | adjacent | **challenger** |
| Huawei Digital Power | incumbent | incumbent |
| Zhonhen | incumbent | incumbent |
| Flex | challenger | challenger |

So the split writes itself: **that module ranks the conversion layer and this one ranks the room.** Three companies that lead the room are hedgers in the conversion layer; two companies that lead or attack the conversion layer are bystanders to the room. Nothing below re-ranks the conversion layer, re-states its nine stages, re-runs the rack-shelf fight or repeats the origin test as a re-sorting.

**§7.23's test — the one number both cite must do a different job in each — holds on `late 2027`, Heron Power's mass-production date.** In that module it is an **arrival risk on a challenger's own business**: the company has no shipped unit, and its own dossier says a one-year slip is *fatal to the data-centre thesis*. Here the identical date is a **reprieve clock on an installed product category** — the date after which a 12 MW block that eliminates twelve UPS, four PDUs and twenty RPPs can be *ordered* rather than prototyped. A supplier's survival risk there; an incumbent's stay of execution here. Same date, opposite side of the transaction.

### 2c. The test applied to each of the other four modules

- **`nvidia-800vdc-2026-08`** owns the architecture and is vendor-blind by its own guardrails. Shared number: **800 VDC** itself. There it is *the converged voltage* — what it is, why it happens, what it deletes. Here it is **criterion 5, a roster-membership test on a named vendor**, and the striking fact is an absence: Zhonhen's Panama architecture is named in NVIDIA's own August 2026 paper (pp. 21–23) while Zhonhen is **absent from every published partner roster**. An engineering fact there; a membership fact here.
- **`power-infra-aidc-2026-08`** owns the chain and the three BESS sockets. Shared object: **socket 3**. There it is one of three places a battery earns. Here socket 3 **is the segment**, and the module's only job on it is to name who holds it.
- **`grid-equipment-shortage-2026-09`** owns lead times as a supply system with four constraints, and its teaching question is *"measured from what — order, drawing approval, or release to manufacture?"* Shared numbers: **24 weeks against 46–48 weeks**. There they would be two points on a lead-time series. Here they are **a competitive weapon aimed at this segment's own switchgear** — criterion 6 — quoted by a company that does not sell switchgear.
- **`bess-tech-fundamentals-2026-08`** owns the cell. Shared number: **the C-rate**. There it is a chemistry property taught from zero. Here it is **the market-entry test that sorts six of seven challengers**: a cell chosen for energy cannot serve a power application, which is why Narada's 10C line, the 1C-to-6C cabinet ladder and EVE's 628Ah class are positions rather than specifications.

### 2d. The six public lessons, and three of them pre-declare the handoff

This is the part §10.6 (t) tells a landscape to check before drafting, and here it pays three times.

- **`the-ups-room`** is the densest neighbour in the corpus for this segment — it *is* criteria 1 through 4. Its `the-shelf-that-threatens-the-room` callout closes on a paragraph headed **"The honest limit, and where this hands off"**, and says in as many words that *the installed base alone guarantees decades of service revenue for the room machine; what is actually in play is the **marginal** megawatt in new AI halls.* **That sentence is this module's brief.** The lesson decides the question; the module assigns the marginal megawatt to named parties. §7.23's test holds on **thirty seconds**: the lesson's own arithmetic is that 4.2 kWh carries 1 MW for 15 seconds, taught to separate seconds (sized by power) from minutes (sized by energy) — an *arithmetic lesson*. Here the same quantity is a **sufficiency claim by a named party against a named incumbent's product**: Heron's SuperBBU gives "30 seconds of full-load backup matched to generator start", which is the number the deletion argument turns on.
- **`redundancy-by-the-numbers`** pre-declares even more explicitly. Its `the-vanishing-ups` callout ends: *"**This lesson deliberately does not describe the machine being deleted.** The static, rotary and modular answers, the battery under each of them and the case for making that battery earn belong to the lesson on the UPS room."* A declined scope upstream is the cleanest possible statement of where a boundary runs — and it declines *toward another lesson*, not toward this module, which is why the module carries no redundancy vocabulary at all. Shared object: **"N+1 of what?"**, a tile in both that lesson and `the-ups-room`. There it is a four-level vocabulary. Here the module states only the **commercial** consequence: a vendor's parallel limit of four to eight units is the ceiling on what one franchise can protect in one system.
- **`where-bess-plugs-in`** pre-declares the third time, and it is the one that shapes §7. Its `the-honest-no` callout tells a grid-storage seller that the correct answer on socket 3 is *"No. Not not yet, not let us explore a partnership. No."* — **and then tells them to keep watching it anyway**, because *"its specifications cascade."* §7.23's test holds on **socket 3** itself: there it is a **disqualification test the reader applies to their own company**; here it is **the scoreboard of who passed that test and what it cost** — the seven challengers who built a UPS-class or rack-scale product, and what happened to each. A self-test there; a roster here. **This module is what "keep watching it anyway" looks like.**
- **`the-aidc-power-chain`** owns the hierarchy from service entrance to rack, selective coordination, the UPS efficiency dial and the choreography of an outage. Nothing below repeats any of it.
- **`backup-generation`** owns **the ten seconds**. §7.23's test: there it is *the one number the whole standby architecture is built around* — a design target. Here it is the specification a challenger's product is explicitly **matched to**, which is a competitive fact rather than an engineering one.
- **`the-800-vdc-shift`** owns the thesis (convert once, early, high), the three chains, the new boxes and DC safety. The handoff here is total: the module cites no stage count and no conversion arithmetic.

**It matters more than a module split because the gates differ.** All six lessons are analyst-visible (`tracks`); this module is contributor-only. Material drifting from the module into a lesson's territory is material an analyst can already read; material drifting the other way is a gate raised on something already public.

### 2e. The nineteen omissions — do not import them in a later revision

More than double session 6's nine, as §7.29 predicted. From **`the-ups-room`**: (1) the seconds-versus-minutes arithmetic; (2) the IEC 62040-3 classification and the four clocks; (3) the three ways to build one, as engineering; (4) the eleven-row ladder-and-datasheet table; (5) the four-column battery-under-each table; (6) the grid-interactive UPS mechanism — bidirectional front end, revenue-grade metering, reserve floor, anti-islanding; (7) the shelf-versus-room argument as engineering — autonomy, fault current, one maintenance action; (8) its eight failure modes. From **`backup-generation`**: (9) the ten-second sequence, the three ratings, block load, paralleling, load shed and the permit ceiling. From **`redundancy-by-the-numbers`**: (10) the redundancy vocabulary and what a nine costs, the tiers, the five commissioning levels; (11) the fleet-level vanishing-UPS argument. From **`where-bess-plugs-in`**: (12) the three sockets as a map, and the honest no as advice to the reader. From **`the-aidc-power-chain`**: (13) the service-to-rack hierarchy, selective coordination, the UPS dial, the outage choreography, dirty loads. From **`the-800-vdc-shift`**: (14) why the number is 800, the three chains, the new boxes, DC safety. From **`nvidia-800vdc-2026-08`**: (15) the four deployment architectures, TRU versus SST, the fault and grounding tables, protection zones and SSCBs, certification, the rack-power ladder. From **`power-infra-aidc-2026-08`**: (16) how the grid is organised and what a battery earns, the three sockets, the 2026–28 gates. From **`grid-equipment-shortage-2026-09`**: (17) the four constraints, the lead-time series, the buyer's instruments, sparing. From **`bess-tech-fundamentals-2026-08`**: (18) the cell in plain terms, the spec sheet, the large-cell ladder, sodium, duration classes, the safety words. From **`landscape-power-conversion-and-rack-power-silicon-2026-09`**: (19) the conversion layer's own ranking — its nine stages, the rack-shelf fight, the origin test as a re-sorting, its twelve-row bets table, and the eight shared members' positions *in that segment*.

### 2f. One thing the split does not mean

It does not mean the module is thin. **Eleven neighbours own the mechanisms; none of them owns the parties.** Not one of the six lessons names a vendor in a ranking — `the-ups-room` describes static, rotary and modular machines without saying who builds which — and the two nearest modules are vendor-blind by construction. Layer 4 is where the ordering lives (§10.1), and this is layer 4.

## 3. Who dominates, and on what basis

**Organised by what each incumbency is made of, because the ten are not ten vendors of one thing.**

**Group one — the seven who build the machine.**

- **Schneider Electric** and **Vertiv** are *shared* number one. Dell'Oro places them about **0.1 of a point apart** at the top of data-center physical infrastructure, which is the corpus's most precise statement that this segment has no single leader. Their incumbencies are made of different material: Schneider's is the **design layer** — the only vendor with NVIDIA co-developed designs spanning power management, cooling controls and whole-factory blueprints in Omniverse, a position that pulls its hardware into projects before competitive bidding starts, and a disclosed $373M supply-capacity agreement with one landlord. Vertiv's is **concentration**: the highest data-center revenue share among large-caps at about 75–80 %, a $15B backlog and a book-to-bill near 2.9×, which makes it the sector's leveraged proxy in both directions — up 14–20 % on an order print, down 25–30 % in days on a demand scare.
- **Eaton** is the incumbent making the most explicit bet that buyers want **delivered power systems rather than components** — and the bet is inorganic by design: roughly **$12.5B across Fibrebond, Ultra PCS and Boyd Thermal in fourteen months**, plus a Siemens Energy 500 MW on-site alliance. Its data-centre orders grew 200–240 % against a market growing about 7.5 % a year, which its own dossier reads as **content per megawatt rather than unit-share capture** — an important distinction, because content expands with the architecture and share does not.
- **ABB**'s incumbency is **one voltage class up**. HiPerGuard is the industry's first static medium-voltage UPS, the 34.5 kV class removes a conversion stage outright, and the dossier's read is that it has no direct static-MV-UPS competitor at scale while trailing Schneider, Vertiv, Eaton and Huawei in LV UPS. Its bet is that the MV and 800 VDC transition **resets the leaderboard**. Two structural facts travel with it in any counterparty relationship and its own dossier states both: it sold its grid and transmission business before the supercycle, so it cannot supply the transformers its customers' connections need; and it is a three-time US bribery settler.
- **Huawei Digital Power** is the **excluded benchmark**. It competes at the integrated-solution tier rather than the component tier, its prefabricated PowerPOD — 2.4 to 3.2 MW containerised blocks on an **18-week** delivery claim — is the pattern the industry is converging on, and it is a structural non-factor in the United States. Its exclusion is a **durable share subsidy** to the four Western majors in NATO geographies, which is the only way a US-facing seller should read it.
- **Mitsubishi Electric** is the vertical-integration case and the one whose marketing and revenue point in different directions. It is consistently named in the leading vendor set for data-center UPS, power transformers and gas-insulated switchgear, and **no firm reachable in the research published a market-share percentage for it in any of the three**. Its own numbers say the AI exposure is in transmission and distribution rather than in the UPS line its marketing leads with: Energy Systems orders rose **80 %** year on year while Public Utility Systems — which contains UPS — saw full-year orders **fall 9 %**. Its distinctive claim is that it is the only UPS brand designing and making its own power semiconductors, which underwrites both a silicon-carbide line and **a published position against eco-mode**: it publishes no eco-mode figure for any model, states that silicon carbide makes eco-mode unnecessary, and publishes 98.2 % double-conversion efficiency instead. **That is criterion 2 answered by refusing the question**, and it is the clearest single instance of an incumbency made of something other than share.
- **Piller** is the only vendor in the corpus that answers the room's question with a **rotating machine** rather than power electronics and a battery — rotary, diesel-rotary and flywheel UPS, and the isolated-parallel bus. Its own franchise moved: its partner states that hyperscale *"moved away from Piller rotary technology in recent years in favour of battery-static UPS"*, and the relevance now runs through the fence line, where SHIELDX is sold **one unit per 12 MW gen-set** into behind-the-meter plants. Its binding constraint is **factory capacity, not demand** — a €20M programme lifts output from about 100 to about 400 large systems a year only by **end-2027**, with build slots being released for 2028.

**Group two — the one who sells the architecture of the bus.** **Zhonhen** is China's data-center HVDC leader at **31 % share** with CR3 at 72 %, lead author of the national 240V/336V DC standard, and its Panama one-stage 10 kV-to-DC conversion predates the Western 800 VDC push by six years. NVIDIA's August 2026 execution paper **names the Panama Architecture** as a transformer-rectifier implementation of its own data-hall DC block. And its H1 2026 interim converts none of that into commercial traction: **no order, no backlog, no named data-centre customer, no NVIDIA mention, no 800V revenue**, exports at 4.1 % of revenue, and absence from every published partner roster. **Architectural endorsement and commercial inclusion are separate questions and only the first has been answered** — which is criterion 5 producing an answer the role label does not predict.

**Group three — the two who build the store.** **Panasonic** claims about **80 % of the data-center distributed-power (BBU) market** — self-reported, with no third-party verification — behind ¥350B of dedicated capex and a chief executive calling ¥800B of FY2029 data-center storage revenue *a minimum commitment*; Q1 FY2027 data-center storage sales were ¥113B, 1.9× year on year. **Narada** is the segment's cautionary comparable: **#2 in base-station and data-centre backup shipments** on a thirty-year franchise, with a creditor reorganisation petition, a going-concern-qualified audit, an adverse internal-controls opinion and 163 frozen accounts behind it. Its backup segment **grew through FY2025 and then broke** — in H1 2026 the comms and data-centre line fell 44.8% and sold below cost. It is still an asset map rather than an obituary, because its distress is actively freeing accounts, channel partners and talent, but the franchise a buyer would take is now shrinking.

**The honesty note this section owes the reader.** Those are not three measures of one thing. A design franchise is a procurement fact; a share point is a market fact; a published refusal of eco-mode is an engineering position; a DC standard authored for one country is a regulatory fact; and a BBU share claim with no third-party check is a company's own statement. **Flattening them into an ordering would misrepresent all of them** — and the two members most likely to top such a list on installed base, Schneider and Vertiv, are separated by a tenth of a point by the only house that measures them together.

## 4. Who threatens, and on which route

**Seven challengers, and the shape of the set is the finding: six of the seven arrived from the storage layer and not one of them was a UPS vendor.** They divide into three routes, and the third is the only one attacking the machine itself.

**Route one — the cell makers selling a product line, not a box. Five of the seven.** *Samsung SDI* has made AI data-centre power its chosen recovery vector: UPS and BBU guided to grow **more than 70 % in 2026**, the Q2 2026 turnaround — its first profit in seven quarters — attributed to those lines, and a **world-first UL indoor large-scale fire test pass for UPS batteries** as the deliberate differentiation against Chinese price leaders. *LG Energy Solution* frames the same market more broadly and claims to be **the only supplier serving all three AI-DC storage applications — BESS, UPS and BBU — on a non-FEOC chain**, behind five North American sites and a 140 GWh order backlog. *EVE Energy* is positioned across all three power layers of a campus and brought an **OCP China 2026 BBU portfolio** on 800V HVDC — while its own dossier records that no independent source names a hyperscaler, cloud provider or server ODM among its customers, and that A-samples were guided to customers for May–June 2026 with nothing corroborating since. *Gotion* claims **first place globally above 28 % share** in base-station and data-centre UPS backup batteries **in its own audited annual report** rather than only in marketing — a claim no research house corroborates. *Hithium* launched a four-SKU lithium-sodium AIDC line in December 2025 **with zero named customers**.
**What sorts these five is not product. It is whether their cells can lawfully enter a US project.** Samsung SDI and LG Energy Solution are the non-FEOC pair and the regime works *in their favour*; Gotion, EVE and Hithium are three of the **exactly six entities named in §154(b) of the FY2024 National Defense Authorization Act** — a statutory designation removable only by an act of Congress. Gotion is simultaneously the most US-exposed and the most US-constrained: it is the only one with an operating US plant, five lines at Manteno, Illinois, on more than $536M of pledged state incentives, **and its US subsidiaries are captured with it**, so the plant it actually runs cannot claim the advanced manufacturing credit for what it makes there.

**Route two — productising storage into a UPS category. One of the seven.** *ON.energy* is the inverse of the gas-bridge cohort: rather than displacing storage with generation it sells storage **as** a medium-voltage UPS, competing with Vertiv, Eaton and Schneider on one flank and with a cell maker's AIDC line on the other, validated against ERCOT's large-load ride-through rule and carrying a **5 GW deployment agreement** with one developer. Its own dossier is blunt about the gap: those 3-GW-plus and 10-GW-plus claims run far ahead of roughly **240 MWh of verified operating assets**, and more than $250M of lifetime capital against a 5 GW buildout implies financing that has not surfaced. **The single most valuable open question in this segment is who supplies its cells** — a 5 GW award is one of the largest non-Chinese cell procurements in the US market, and whoever wins it sets the sourcing norm for the whole storage-as-UPS category.

**Route three — the only one attacking the machine, and it bought its way in.** *Flex* owns **Anord Mardix** switchgear, busway and power pods, Crown Technical Systems medium-voltage switchgear and Electrical Power Products substation protection — roughly **$6.4B of acquisitions** culminating in a $4.4bn agreement for EPC Power in September 2026. It is the one challenger selling this segment's own products. Two facts govern the reading. Its branded power businesses are **commercially sub-scale against the named leaders** — busway researchers list Schneider, Legrand's Starline, Eaton, ABB and Siemens as leaders and categorise Anord Mardix as an *other player* — and **no revenue line has ever been published** for them, so anyone quoting a Flex data-centre revenue figure is quoting something the record does not contain. And the whole proposition is **being separated into an independent public company in the first calendar quarter of 2027**, which means the competitor is being reconstituted mid-fight.

**What the three routes have in common.** None of them attacks a ranking, because the segment has no single ranking to attack — the two leaders are a tenth of a point apart and three of the ten incumbents are not in the same business as the other seven. Route one attacks with a chemistry and a compliance status, route two with a product category that did not exist, route three with a purchase order. **So the module's own assessment, stated as analysis: the threat to this segment's incumbents is not share loss to a cheaper UPS — it is that the contested layer moved underneath the machine, from the frame to the store, and the companies that make the store were never in this segment.**

**And the three deletion routes that carry no challenger label at all.** All three are held by **adjacent** members, which is what makes them easy to miss.
1. **The battery outside the building.** *Rosendin* and *FlexGen* sell **BESSUPS** — medium-voltage (1–35 kV) utility-scale battery UPS replacement sited **outside** the hall, replacing data-center UPS systems *and* diesel generators, on a design-and-method patent plus grid-interconnection and transient-frequency-stabilisation patents, meeting CBEMA power-quality standards. *Prevalon*'s Hybrid Power Stabilizer attacks the same GPU load-swing problem with UPS-replacement ambitions stated in its own product description, hardware-in-the-loop tested at a US national laboratory.
2. **The battery on the 800-volt bus.** *Heron Power*'s SuperBBU couples directly to the 800 V bus with no DC-DC stage and gives **30 seconds of full-load backup matched to generator start** — and its 12 MW block eliminates four MV transformers, four LV switchboards, **twelve UPS, four PDUs and twenty RPPs**, on a single **24-week** lead time against the **46–48 weeks** it quotes for switchgear. *Delta Electronics* publishes the deepest 800 VDC catalogue of any vendor — 660 kW in-row power racks with 480 kW of embedded BBU, supercapacitor shelves, SiC e-fuses — while also selling a conventional Ultron DPM UPS line and claiming more than 6.5 GW of UPS capacity across US data centres. **It is hedged across the deletion.**
3. **The architecture that declines to protect the building at all** — the fleet-level answer. **That belongs to the public lesson and is not taught here.** It is named because a seller who meets it will hear it described as a UPS decision when it is a procurement decision made one level up.

**The counter-threat the incumbents hold and the challengers do not: the installed base.** The public lesson states the principle — decades of service revenue are guaranteed by the fleet already in the ground, and what is in play is the marginal megawatt in new AI halls. **This module's contribution is to say who owns that fleet**: seven machine makers with multi-decade franchises, one of which has a €20M programme that will not quadruple its output until end-2027, and a second whose backup segment grew through a creditor reorganisation. **A deletion route with no shipped unit does not touch any of it before late 2027 at the earliest.**

## 5. Each player's bet — the seventeen

One row per incumbent and challenger, in registry order — seventeen of the twenty-seven members. **Every bet is analysis, not fact**: each is that member's own `strategyRead[]`, which the dossier already marks as an assessment carrying a confidence level, restated in one line. The ten adjacent members get no row because they are not ranked players here; what they do to the segment is §4 and §6. At seventeen rows this sits between session 6's twenty-two and session 5's twelve — the table follows the segment, never the last module (§10.6 (m)).

| Player | Role | The bet (analysis) |
|---|---|---|
| Schneider Electric | incumbent | That the design layer beats the hardware layer — co-developed reference designs that pull its hardware in before competitive bidding starts — and that a two-speed portfolio cushions an AI-capex shock better than a pure play, at the price of the multiple |
| Vertiv | incumbent | That the highest data-centre concentration in the sector is worth the volatility it brings, and that a $15B backlog carries it through the one transition that contracts its own core franchise — while no incumbent has yet named a shipping 800 VDC switchboard product |
| Eaton | incumbent | That buyers want delivered power systems rather than components, bought rather than built — $12.5B in fourteen months — and that content per megawatt, not unit share, is the metric that compounds |
| ABB | incumbent | That pushing the UPS a voltage class up resets a leaderboard it currently sits fourth or fifth on: the first static MV UPS, a 34.5 kV class that deletes a conversion stage, and an architecture role in the next rack generation |
| Huawei Digital Power | incumbent | That the integrated-solution tier is the right altitude and that the non-NATO world is a large enough market to hold it, while its exclusion subsidises the four Western majors it sets the spec and speed bar for |
| Mitsubishi Electric | incumbent | That owning the power semiconductor is the durable differentiator — and that refusing eco-mode outright, publishing no figure for it and selling double-conversion efficiency instead, is a position rather than a gap |
| Piller | incumbent | That a rotating machine still wins where a buyer values fault current, harmonic isolation, medium-voltage connection and no battery room — and that the franchise has moved from the hall it lost to the fence line, where its stabiliser ships one unit per 12 MW gen-set |
| Zhonhen | incumbent | That the architecture it has run at scale for six years is the one the West is now converging on — and that architectural endorsement in a buyer's own paper converts into commercial inclusion, which its own interim reports no order, no backlog and no named customer against |
| Narada | incumbent | That a thirty-year backup franchise survives the balance sheet that carries it: the segment grew through FY2025 but fell 44.8% and sold below cost in H1 2026 under a creditor reorganisation petition, so the bet now rests on the product differentiation being real enough that a restructuring would preserve it or a buyer would want it |
| Panasonic | incumbent | That backup power, not grid storage, is where its cell business belongs — ¥350B of capex, EV lines physically repurposed — and that an ~80 % distributed-power share it reports itself survives contact with a market growing toward several billion dollars |
| Samsung SDI | challenger | That safety certification is the one dimension hyperscalers will pay a premium for, and that a world-first indoor fire test plus a non-FEOC chain converts a 1.4 % global share into a defensible AI-DC position — with a US cell ramp as the pivotal execution item |
| LG Energy Solution | challenger | That the durable advantage is regulatory rather than technical: five North American sites make it the default non-Chinese chain, and serving all three AI-DC storage applications at once is a claim no competitor can match on the same compliance footing |
| Gotion | challenger | That a world-leading UPS-backup share stated in its own audited report is worth holding while the US route around a statutory designation is built — an operating Illinois plant that cannot claim the credit for what it makes there, and a distribution partnership as the visible workaround |
| EVE Energy | challenger | That forcing the large-cell transition upstream buys it a position downstream, and that a rack-to-grid AIDC backup portfolio is logical adjacency worth building before a single customer is named |
| ON.energy | challenger | That storage sold as a medium-voltage UPS is a category rather than a substitution, and that being first to a ride-through certification sets the supply-chain norms everyone after it copies — on a 5 GW award against roughly 240 MWh of verified operating assets |
| Hithium | challenger | That top-two stationary-cell scale carries into a building it has never sold into, with a four-SKU AIDC line launched ahead of any named customer and financing capacity, not demand, as the binding constraint |
| Flex | challenger | That owning switchgear plus busway plus power pods plus cooling lets it quote grid-to-chip scope no component vendor can match — bought rather than built, sub-scale against the named leaders, unpublished as a revenue line, and about to be separated into its own company mid-fight |

**The shape of this table is the finding.** Ten of the seventeen bets defend or extend a position in the machine. **Six of the remaining seven are bets that the store is the contested layer** — and every one of those six is placed by a company that was not in this segment five years ago.

## 6. The indicators

What to watch, dated where the record dates it. **Two of these ten are gates that were considered for this module's own `reviewBy` and rejected under §10.6 (r) — a gate another module already owns belongs here, not in the review date.** They are marked.

| On record | Indicator | What a move means |
|---|---|---|
| 1 Oct 2026 | A challenger's US prismatic LFP cell production starts at its Indiana joint venture, toward a 30 GWh cell target | The dated test of the non-FEOC claim that underwrites the whole challenger cohort's US access. **This module's review date** |
| Q4 cal 2026 | The $4.4bn EPC Power acquisition closes into the challenger that owns switchgear, busway and power pods | The last piece before the separation. A slip re-opens whether the grid-to-chip scope claim survives the split |
| 30 Nov 2026 | The 800 VDC architecture module's own review gate | **Rejected for `reviewBy`** — it is `nvidia-800vdc-2026-08`'s clock, and criterion 5 reads off that module rather than this one |
| 31 Dec 2026 | The HVDC incumbent's FY2025 data-centre power revenue and cash conversion, against its ESOP hurdles | The only public test of whether architectural endorsement has converted into commercial inclusion. Still no order, backlog or named customer as of H1 2026 |
| Q1 cal 2027 | The scope challenger separates into an independent public company; its chief executive leaves with the spun-off half | The competitor is reconstituted mid-fight. Watch whether the branded power businesses get a revenue line for the first time |
| Early Feb 2027 | The rotary incumbent's parent publishes its 2026 annual report | The external check on a stabiliser franchise that is capacity-constrained rather than demand-constrained, and on the behind-the-meter plants it ships into |
| Q1 2027 onward | Any UL listing of the hall-edge block, and a data-centre pilot energised at a named campus | The first evidence that deletion route two is a product rather than a specification. No shipped unit exists today |
| 31 Dec 2027 | The capped 15 % Section 232 rate for specified electrical-grid equipment expires, rising to 25 % from 2028 | Criterion 6, priced. It reaches transformers and switchgear on full customs value — this segment's own products, and the reason two incumbents are building US plants |
| Late 2027 | The hall-edge challenger's mass production begins; a €20M European programme quadruples rotary-UPS output | **The deletion clock and the supply answer land in the same quarter.** One incumbent's capacity is sold out until 2028; the block that eliminates twelve UPS is not orderable before then |
| 1 Oct 2027 | Three of the seven challengers become barred from defence procurement by statute, removable only by an act of Congress | **Rejected for `reviewBy`** — it is the policy modules' subject and 381 days out. It is nonetheless the single most consequential date for the challenger cohort's US access |

## 7. The seller's play

Both paths of §10.10, and the first of them is short because **a public lesson already answered it**.

**If you sell storage.** `where-bess-plugs-in` tells you the answer on socket 3 is *no* — not *not yet*, not *let us explore a partnership* — for a grid-storage supplier without a rack-scale or UPS-class product, and it tells you to keep watching the socket anyway because its specifications cascade outward. **This module is the watching.** Three things it adds that the lesson cannot, because the lesson names no companies. **First: the honest no has exceptions and they are countable.** Seven challengers built a UPS-class or rack-scale product and entered; five are cell makers, and what sorted them was not product quality but whether their cells can lawfully enter a US project — two are in the regime's favour, three are named in a statute. **Second: the entry price is visible.** A world-first indoor fire test, a non-FEOC chain built deliberately over years, an OCP portfolio, a ride-through certification. These are the attributes being written into the category now, and they are compliance as much as engineering. **Third: if you are selling a cell rather than a system, the single most valuable question in the segment is who supplies the 5 GW storage-as-UPS award** — that contract sets the sourcing norm for the whole category.

**If you sell AI data-centre power — move one: find out which of the three groups you are talking to.** A machine maker buys a component inside a design it owns. An architecture vendor buys a standard. A store maker buys a cell specification. **Three different conversations, and no ranking connects them** — the two at the top of the segment are separated by a tenth of a point by the only house that measures them together, and three of the ten incumbents would never meet in a bid.

**Move two: read criterion 5 as a roster question, not a technology question.** Being named in a buyer's published architecture paper and being on that buyer's published partner roster are **different facts**, and the segment contains a member that has the first and not the second. When an account says it is "aligned with the reference design", ask which roster, published where, and at which tier.

**Move three: know which incumbents are hedged across the deletion and which are exposed to it.** One publishes the deepest 800 VDC catalogue in the market *and* a conventional UPS line with more than 6.5 GW deployed. Another's independent read is that the architecture contracts the centralised UPS market — its own core franchise — while creating new power-rack and transformer markets, and that no incumbent has yet named a shipping 800 VDC switchboard. **A vendor with a hedge and a vendor with a roadmap are in different positions, and the datasheet does not say which is which.**

**Move four: on lead time, ask what is being compared.** The most aggressive claim in the segment is 24 weeks for a hall-edge block against 46–48 weeks for switchgear — quoted by a company that does not sell switchgear, has no shipped unit, and whose own dossier says no third party has stated or tested the claim. **Criterion 6 is where this segment is most vulnerable and where its challengers' evidence is thinnest at the same time.** The supply-system answer to *why* the lead time is what it is belongs to the grid-equipment module; the question here is only who is quoting what.

**Move five: the installed base is the argument the incumbents will not make for themselves.** The marginal megawatt in new AI halls is genuinely contested. The fleet already in the ground is not, and it guarantees decades of service revenue. A seller who treats a deletion story as a present-tense fact is arguing against a public lesson's own conclusion.

## 8. Claims ledger

**Provenance:** corpus synthesis over the segment's member dossiers at the versions below; no ingested document, no new research. Every load-bearing claim traces to a dossier at that dossier's profile version on **15 September 2026**, and to the field inside it. **The dossiers carry the primary sources; this ledger carries the dossiers** — that is the whole provenance chain for a corpus-synthesis module, and it is why no publisher appears in the source column. The registry is cited at the repo version of its **last change** (v05.41r, 2026-09-13) rather than at this session's, because it did not move this session.

**Three claims in this module are the module's own** and are labelled as analysis wherever they appear: that the ten incumbents form three groups that do not compete; that the threat is a change in *what the store is* rather than share loss on the machine; and every row of the bets table.

| Claim | Source |
|---|---|
| Segment holds 27 members — 10 incumbent, 7 challenger, 10 adjacent; chain position 5, tier build | profiler-segments.json @ v05.41r — segments[].members[], .position, .tier |
| The definition names static/rotary/modular UPS, switchgear, busway and PDUs inside the fence, the prefabricated power module, the facility DC bus, and the VRLA/lithium/flywheel stores including BBU and UPS cells | profiler-segments.json @ v05.41r — segments[].definition |
| The six buying criteria, including reference-design alignment and 800 VDC readiness (5) and lead time for factory-built power rooms (6) | profiler-segments.json @ v05.41r — segments[].buyingCriteria |
| Eight members sit in both this segment and power-conversion-and-rack-power-silicon; five carry a different role in each | profiler-segments.json @ v05.41r — segments[].members[].role, both segments |
| Schneider and Vertiv are shared #1 in data-center physical infrastructure, about 0.1 point apart (Dell'Oro) | profile:vertiv @ v9 — strategyRead[1]; profile:schneider-electric @ v9 — ecosystemRole |
| Schneider's edge is the design layer: the only incumbent with NVIDIA co-developed designs across power, cooling controls and whole-factory blueprints; a $373M supply-capacity agreement with one landlord | profile:schneider-electric @ v9 — ecosystemRole, strategyRead[0] |
| Vertiv carries ~75–80 % data-center revenue concentration, a $15B backlog and ~2.9× book-to-bill; it moved -25–30 % in days on a demand scare | profile:vertiv @ v9 — ecosystemRole, strategyRead[0] |
| Independent analysis projects the 800 VDC architecture contracts the centralized UPS market; no incumbent has yet named a shipping 800 VDC switchboard product | profile:vertiv @ v9 — strategyRead[2] |
| Eaton assembled ~$12.5B of scope across Fibrebond, Ultra PCS and Boyd Thermal in 14 months plus a Siemens Energy 500 MW alliance; DC orders grew 200–240 % against a market growing ~7.5 % a year | profile:eaton @ v8 — ecosystemRole, strategyRead[0], strategyRead[1] |
| ABB's HiPerGuard is the first static MV UPS; the 34.5 kV class removes a conversion stage; ABB trails Schneider, Vertiv, Eaton and Huawei in UPS; it sold its grid business before the supercycle and is a three-time US bribery settler | profile:abb @ v7 — ecosystemRole, strategyRead[0], strategyRead[2], strategyRead[4] |
| Huawei Digital Power competes at the integrated-solution tier; PowerPOD is 2.4–3.2 MW containerized blocks on an 18-week delivery claim; its exclusion is a durable share subsidy to Western vendors in NATO geographies | profile:huawei-digital-power @ v8 — ecosystemRole, strategyRead[1] |
| Mitsubishi Electric is named in the leading vendor set for data-center UPS, transformers and GIS, and no reachable firm publishes a share percentage for it in any of the three | profile:mitsubishi-electric @ v3 — ecosystemRole, strategyRead[4] |
| Energy Systems orders rose 80 % YoY in the quarter to 2026-06-30 while Public Utility Systems — which contains UPS — saw full-year FY2026 orders fall 9 % | profile:mitsubishi-electric @ v3 — strategyRead[0] |
| Mitsubishi Electric publishes no eco-mode efficiency figure for any model, states SiC makes eco-mode unnecessary, and publishes 98.2 % double-conversion efficiency on its SiC line | profile:mitsubishi-electric @ v3 — strategyRead[1] |
| Piller is the corpus's reference for rotary, diesel-rotary and flywheel UPS and the isolated-parallel bus; hyperscale "moved away from Piller rotary technology in recent years in favour of battery-static UPS" | profile:piller @ v2 — ecosystemRole, strategyRead[0] |
| SHIELDX ships one unit per 12 MW gen-set in behind-the-meter plants; a €20M programme lifts Bilshausen output from ~100 to ~400 large systems a year only by end-2027, with slots released for 2028 | profile:piller @ v2 — ecosystemRole, strategyRead[1] |
| Zhonhen is China's data-center HVDC leader at 31 % share, CR3 72 %, lead author of the national 240V/336V DC standard; Panama converts 10 kV directly to DC in one stage at over 97.5 % | profile:zhonhen @ v8 — ecosystemRole, strategyRead[0] |
| NVIDIA's August 2026 execution paper names the Panama Architecture (pp. 21–23); Zhonhen is absent from NVIDIA's published 800VDC partner rosters, discloses no order, no named customer and no 800V revenue, and exports are 4.1 % of revenue | profile:zhonhen @ v8 — ecosystemRole, strategyRead[1] |
| Panasonic claims ~80 % of the data-center distributed-power (BBU) market, unverified by any third party; ¥350B of capex; Q1 FY2027 data-center storage sales ¥113B (1.9× YoY) against an ¥800B FY2029 target | profile:panasonic @ v4 — ecosystemRole, strategyRead[0], strategyRead[1] |
| Narada is #2 in base-station and data-centre backup shipments on a 30-year franchise, carries a creditor reorganization petition, a going-concern-qualified audit, an adverse internal-controls opinion and 163 frozen accounts — and the comms/DC segment, which grew through FY2025, fell 44.8% at a −4.0% gross margin in H1 2026 | profile:narada @ v5 — ecosystemRole, strategyRead[0], strategyRead[1], financials.periods[0] |
| Samsung SDI's UPS and BBU lines are guided to grow >70 % in 2026; it holds a world-first UL indoor large-scale fire test pass for UPS batteries; its global ESS share is 1.4 % (#12, H1 2026) | profile:samsung-sdi @ v5 — ecosystemRole, strategyRead[0], strategyRead[2] |
| US prismatic LFP cell production starts at the StarPlus Indiana JV from October 2026, toward a 30 GWh BESS cell target, and both billion-dollar-class US ESS deals depend on it landing on time | profile:samsung-sdi @ v5 — policyExposure[0].mitigation, strategyRead[1] |
| LG Energy Solution claims to be the only supplier serving all three AI-DC storage applications — BESS, UPS and BBU — on a non-FEOC chain, behind five North American sites and a 140 GWh ESS backlog | profile:lg-energy-solution @ v6 — ecosystemRole, strategyRead[3] |
| Gotion claims first place globally above 28 % share in base-station and data-centre UPS backup batteries in its own audited annual report, uncorroborated by any research house | profile:gotion @ v1 — ecosystemRole |
| Gotion is named in NDAA §154(b), its US subsidiaries are captured with it, and its operating Manteno plant cannot claim the advanced manufacturing credit for what it makes there | profile:gotion @ v1 — ecosystemRole, strategyRead[1] |
| EVE, Gotion and Hithium are three of exactly six entities named in §154(b) of the FY2024 NDAA, barred from DoD procurement from 1 October 2027 and removable only by an act of Congress | profile:eve-energy @ v6 — policyExposure, strategyRead[1]; profile:gotion @ v1 — policyExposure |
| EVE's AIDC BBU portfolio (OCP China 2026) spans rack, distribution and grid-scale backup on 800V HVDC; no independent source names a hyperscaler, cloud provider or server ODM customer | profile:eve-energy @ v6 — ecosystemRole, strategyRead[3] |
| ON.energy sells storage as a medium-voltage UPS competing with Vertiv/Eaton/Schneider, validated against ERCOT NOGRR 282, on a 5 GW award — against roughly 240 MWh of verified operating assets and >$250M of lifetime capital | profile:on-energy @ v4 — ecosystemRole, strategyRead[0], strategyRead[2] |
| The unnamed cell supplier behind that 5 GW award is the segment's single most valuable open question and sets the sourcing precedent for the storage-as-UPS category | profile:on-energy @ v4 — strategyRead[1] |
| Hithium launched a four-SKU lithium-sodium AIDC line in December 2025 with zero named customers, and financing capacity rather than demand is its binding constraint | profiler-segments.json @ v05.41r — members[].basis; profile:hithium @ v13 — strategyRead[3] |
| Flex owns Anord Mardix switchgear, busway and power pods, Crown Technical Systems and Electrical Power Products; ~$6.4B of acquisitions culminating in $4.4bn for EPC Power agreed 3 September 2026, closing Q4 calendar 2026 | profile:flex @ v1 — ecosystemRole, strategyRead[2] |
| Busway researchers list Schneider, Starline, Eaton, ABB and Siemens as leaders and categorise Anord Mardix as an other player; no revenue line has ever been published for the branded power businesses | profile:flex @ v1 — strategyRead[1], strategyRead[3] |
| The Cloud and Power Infrastructure separation was approved 5 May 2026 for the first calendar quarter of 2027, with the chief executive going to the spun-off company | profile:flex @ v1 — strategyRead[0] |
| Rosendin and FlexGen's BESSUPS is a medium-voltage (1–35 kV) utility-scale battery UPS replacement sited outside the hall, replacing data-center UPS systems and diesel generators, on a design-and-method patent | profile:rosendin @ v7 — productsAndServices; profile:flexgen @ v7 — productsAndServices |
| Prevalon's Hybrid Power Stabilizer is a BESS-plus-power-electronics product for GPU load swings carrying UPS-replacement ambitions, hardware-in-the-loop tested at a US national laboratory | profile:prevalon @ v5 — ecosystemRole, productsAndServices |
| Heron Power's SuperBBU couples directly to the 800 V bus with no DC-DC stage and gives 30 seconds of full-load backup matched to generator start | profile:heron-power @ v1 — productsAndServices, technicalSpecs |
| Its 12 MW block eliminates four MV transformers, four LV switchboards, twelve UPS, four PDUs and twenty RPPs, on a single 24-week lead time against the 46–48 weeks it quotes for switchgear | profile:heron-power @ v1 — productsAndServices |
| Heron has no shipped unit, no independently checkable datasheet and no UL listing on the record; mass production begins late 2027 against an architecture that attaches MV-direct SSTs to a target of toward 2029 | profile:heron-power @ v1 — strategyRead[0], strategyRead[2] |
| Delta publishes the deepest 800 VDC catalogue of any vendor — 660 kW in-row racks with 480 kW of embedded BBU, supercapacitor shelves, SiC e-fuses — and separately claims >6.5 GW of UPS capacity across US data centers | profile:delta-electronics @ v5 — summary, productsAndServices |
| Rehlko is the only gen-set OEM in the corpus that also manufactures a three-phase static UPS, to 500 kVA per system, alongside paralleling switchgear to 15 kV and transfer switches to 4,000 A | profile:rehlko @ v1 — ecosystemRole |
| Rolls-Royce Power Systems sells a diesel-rotary UPS in the mtu Kinetic PowerPack, 480 to 3,000 kVA, alongside gen-sets and a battery line | profile:rolls-royce-power-systems @ v1 — ecosystemRole; profiler-segments.json @ v05.41r — members[].basis |
| Cummins and Caterpillar both reach into the room with paralleling switchgear and transfer switches — to 4,000 A and 40 A to 4,000 A respectively | profile:cummins @ v1 — ecosystemRole; profile:caterpillar @ v2 — ecosystemRole |
| Sunwoda's four-tier AIDC energy architecture runs grid-side storage → campus backup → rack backup → BBU, with UPS/HVDC backup from 1 kVA to 800 kVA; it is a prohibited foreign entity with no US manufacturing | profile:sunwoda @ v4 — ecosystemRole, productsAndServices |
| The capped 15 % Section 232 rate for specified electrical-grid equipment runs through 2027-12-31, rising to 25 % from 2028, on full customs value; transformers and switchgear are within derivative scope | profile:mitsubishi-electric @ v3 — policyExposure[0] |
| The EU is phasing high-risk inverters out of EU-funded projects with new contracts fully incorporating the restrictions from April 2027 | profile:huawei-digital-power @ v8 — policyExposure[3] |

## 9. What the record does NOT say

Eight absences, stated rather than smoothed.

1. **There is no ranking of this segment.** The nearest thing to one is two vendors placed about a tenth of a point apart by a single research house — and the four-or-five-name top-five structures the dossiers cite measure *data-center power* as a whole, not the room. No source ranks a rotary vendor against a BBU maker, because no source treats them as the same market.
2. **No market-share percentage exists for one of the ten incumbents in any of its three named markets.** Its own dossier says so in as many words, and where sources rank rather than list, it falls below the top five.
3. **The largest BBU share claim in the segment — about 80 % — is self-reported and has no third-party verification.** So is the 28 %-plus UPS-backup claim from a challenger, which appears in an audited annual report and is corroborated by no research house.
4. **Two of the seven challengers have launched AIDC product lines with no named customer at all**, and a third's A-samples were guided to customers in mid-2026 with nothing corroborating since. Product existence and commercial traction are separate facts here more often than in any segment S2 has written.
5. **The most quantified deletion claim in the segment comes from a company with no shipped unit and no public datasheet**, and its own dossier records that the lead-time claim customers are buying is the one no third party has stated or tested.
6. **No revenue line has ever been published for one challenger's branded power businesses**, so any data-centre revenue figure attributed to it is something the record does not contain.
7. **Three of the ten adjacent members name no data-centre customer anywhere in any first-party or third-party source** — their dossiers state the collection gap rather than fill it. Breadth of product line is verifiable for them; who bought it is not.
8. **And the absence this segment shares with no other: the buyer's own test is public and the vendor's answer to it is not.** Every one of the six buying criteria has a public lesson or module teaching how to read it — the datasheet lines, the classification codes, the redundancy levels, the chemistry table. What no source publishes is where each named vendor actually sits on those lines. **That gap is what this module exists to narrow, and it narrows it from dossiers rather than from a ranking that does not exist.**

## 10. Freshness gate — the `reviewBy` judgment, resolved

**`reviewBy` = 2026-10-01**, sixteen days after `updated`. **Read, not sorted — for the eighth consecutive S2 session, and this run produced a fifth distinct failure mode for the sort plus a new field.**

**What a sort returns.** The 27 members carry **81 `policyExposure[]` entries, 29 with an `effectiveDate`, and exactly three of those dates lie in the future.** The nearest is **2027-01**, an engine maker's phased Model Year 2027 on-highway emissions launch; the other two are both **2027-10-01**, the same NDAA §154(b) schedule. **So a sort of the fence would have clocked an in-hall-power module on a truck engine's model year** — a date field telling a lie this module's own prose contradicts.

**What a read returns.** A challenger's `policyExposure[0]` entry carries **no `effectiveDate` at all**, and its **`mitigation`** field states: *"US prismatic LFP cell production from October 2026 at the StarPlus Indiana JV (toward a 30 GWh BESS cell target)."* Its `strategyRead[1]` calls the same milestone **the pivotal execution item**, on which both billion-dollar-class US ESS deals and the claimed through-2029 order book depend. **This is the fifth distinct failure mode of the sort and the first gate found in a `mitigation` field** — sessions 2 and 6 found gates in `exposure` prose, session 3 found nothing to sort, session 4 found a nearer date than the sort, session 5 found one future date among seventeen.

**Why it is genuinely this module's gate and not one member's news.** The module's central threat argument is that **six of seven challengers arrived from the storage layer, and what sorts them is not product but whether their cells can lawfully enter a US project.** Two of the six are the non-FEOC pair whose whole differentiator is a chain the regime favours; three are named in a statute. **The Indiana ramp is the nearest dated test of whether the non-FEOC claim has a US cell behind it rather than a Korean import** — and if it slips, the claim that underwrites the challenger cohort's US access is unsupported. A load-bearing claim in §4 moves on that date.

**Consequence, accepted deliberately.** The module ships **inside its own 30-day review horizon**. `clReviewChip` renders it gold from the first load, and `check-classroom-curriculum.py` reports **2 items due for review** instead of 1, while still exiting 0 because review dates never call `strict()`. That is the **second firing of session 4's (k)** and it is the rule working: a six-month default would have been a date field telling a lie the module's own §4 contradicts.

**Five candidates rejected, in writing.**

1. **2027-01, the engine maker's Model Year 2027 launch.** What the sort returns. Rejected on subject: it is an on-highway emissions schedule at an *adjacent* member, and it bears on trucks rather than on anything between the service entrance and the rack whip.
2. **2026-10-01, an adjacent member's chief financial officer retirement.** The same calendar day as the date taken, and rejected because a personnel transition is not a gate on anything this module teaches. Named here because it is exactly the trap of taking the nearest *date* rather than the nearest *gate*.
3. **2026-11-30, the 800 VDC architecture module's own review gate.** Rejected under §10.6 (r)/(u): it is already `nvidia-800vdc-2026-08`'s clock, and criterion 5 reads off that module rather than this one. It is **indicator 3**.
4. **2027-10-01, NDAA §154(b) biting on three of the seven challengers.** The single most consequential regime for the challenger cohort's US access — and 381 days out, well past the six-month default, and squarely the policy modules' subject. It is **indicator 10**.
5. **Late 2027, the hall-edge challenger's mass production.** Genuinely this module's own deletion clock and the §7.23 shared number with session 5's module — but it is *behind* the date taken, and a `reviewBy` takes the nearest gate, not the most interesting one. It is **indicator 9**.

## 11. The Scraper interest seed — asked from scratch, and ADDED

§7.29 stated the prior as *"possibly yours"*. **Asked from scratch and the answer is yes.**

**The check was run against every term in both arrays, per §10.6 (i) — 399 distinct terms across `SCRAPER_INTEREST_TOPIC_SEEDS` (32 keys) and `SCRAPER_SEGMENT_SEEDS` (29 keys)**, up from 392 at session 6. **Much of this segment's vocabulary is already covered, and by five different segment seeds** — which is why the answer needed the full run rather than a glance at the topic labels:

| Already covered | By |
|---|---|
| `ups battery` | `seg-bess-datacenter` |
| `mv ups`, `static ups`, `solid-state transformer` | `seg-mv-power-conversion` |
| `power skid`, `prefabricated power`, `power module` | `seg-sidecar-power` |
| `rack pdu`, `busway`, `power distribution unit`, `remote power panel` | `seg-rack-power` |
| `bbu`, `battery backup unit`, `power shelf` | `seg-psu` |
| `switchgear`, `transformer`, `hvdc` | `seg-transformers`, `seg-grid-equipment` |
| `uninterruptible power` | `seg-power-electronics` |
| `800 vdc` | `topic-800vdc-power` |

**What scored zero across all 399 is the half of the segment no seed touches: the rotary machine, the store under the machine, and the packaging axis.** Eleven terms, each verified to be neither an existing term nor a superstring of one:

`rotary ups` · `drups` · `flywheel ups` · `flywheel` · `modular ups` · `isolated parallel bus` · `eco-mode` · `vrla` · `transfer switch` · `critical power` · `grid-interactive ups`

That gap is not incidental. **It is buying criteria 2, 3 and 4** — efficiency and eco-mode, monolithic versus modular, and the battery type under the UPS — **the three criteria whose mechanism the public lesson owns and whose parties nobody was watching.** A rotary incumbent, a diesel-rotary adjacent and a gen-set OEM that builds a static UPS are all in this roster, and no seed in either array contains a single one of `rotary`, `flywheel`, `vrla`, `eco-mode` or `modular ups`.

**Four candidates dropped on duplication grounds** — `uninterruptible power supply` and `data center ups` are superstrings of existing terms (`uninterruptible power`, `data center`) and would double-count the same article in the digest's topic band; `rpp` is the acronym of `remote power panel`, already in `seg-rack-power`; `power pod` is a near-duplicate of `containerized power` and `prefabricated power` in `seg-sidecar-power`.

**Two candidates dropped on SPLIT grounds rather than duplication grounds**, which is session 6's (v) discipline applied a second time: **`supercapacitor` and `capacitor backup unit`** both score zero, and both belong to the **rack-side storage tier** that `nvidia-800vdc-2026-08` and `landscape-power-conversion-and-rack-power-silicon-2026-09` own. Seeding them here would blur in the digest exactly the line §2b draws in the curriculum. **`panama architecture`** scores zero and was dropped on the same ground: the 800 VDC module carries the Panama name-check in a section of its own.

**Four dropped as unscoreable** — `battery room`, `float charge`, `conductance testing` and `autonomy` are the public lesson's glossary rather than headline vocabulary; a seed term has to match a news headline, not a datasheet line.

**The seed added**, in `SCRAPER_INTEREST_TOPIC_SEEDS` with no `tv` marker (a new key has no sheet row; `tv` guards edits to an *existing* seed's terms and lives on `SCRAPER_SEGMENT_SEEDS`):

```js
{ key: 'topic-in-hall-power',
  label: 'In-hall power: UPS, rotary machines and the store under them',
  terms: ['rotary ups', 'drups', 'flywheel ups', 'flywheel', 'modular ups',
          'isolated parallel bus', 'eco-mode', 'vrla', 'transfer switch',
          'critical power', 'grid-interactive ups'],
  source: 'guidance:landscape-in-hall-power-2026-09' }
```

This touches `Scraper.gs`, so the Scraper GAS version bumps with it ([PC-GS-VERSION] #1) and **two deploy lines are expected in the merge workflow rather than one**.

## Revision — 24 September 2026 review

A freshness review ahead of the 1 October gate, and the first time this module cites a primary document.

- **The buyers' SST specification.** *OCP, Solid State Transformer (SST) Specification — Medium Voltage to 800 VDC Power Conversion Platform*, Revision 0.3.0 (Google, Microsoft, NVIDIA; effective 22 June 2026; announced by OCP 11 August 2026). It was checked against the first-hand summary in `study-prep/megmeet/megmeet-sst-briefing-print.html` chapter 3.5, and nothing beyond that chapter is stated. The module now carries:
  - the definition of an SST coupled with storage as a medium-voltage UPS;
  - two SKUs: 13.8 kV at 5 MW, and 34.5 kV at 5 or 10 MW;
  - a unipolar 800 V DC output;
  - at least 98% efficiency from 50–100% load, on power-train losses only;
  - a recommended overload of 120% for 5 s and 150% for 150 ms;
  - Modbus TCP/IP as the only communications requirement;
  - BIL of at least 110 kV at 13.8 kV and 150–200 kV at 34.5 kV;
  - ride-through written as SST-plus-storage;
  - the compliance list, with no UL 9540;
  - the sections the draft leaves open.

  This is one paragraph under the deletion routes, one undated indicator row and seven ledger rows, each citing the specification itself. The module's own reading, stated as analysis, is that route two's storage-as-MV-UPS category is now a buyer's definition.
- **Flex.** The spin-off's Form 10 (15 September 2026) reports a combined Power segment of about USD 2.1 bn for FY2026, without breaking out critical power. "No revenue line has ever been published" is corrected to "none on their own". The spin-off name (Axiom Solutions International, AXM) and the EPC Power outside date (31 December 2026 plus two automatic three-month extensions) are added.
- **The gate.** Samsung SDI restated on its Q2 call that StarPlus Indiana cell production begins in October. That is a month-level start, testable only at the month's end, so `reviewBy` moves from 2026-10-01 to **2026-10-31**.
- **Delta Electronics.** Re-read at v6 (2026-09-23); the catalogue and the 6.5 GW UPS claims hold.
- **Flagged, not changed:**
  - ~~Narada's H1 2026 interim (reported revenue −57%) is not yet in the v4 dossier, so "the backup segment grew through the collapse" rests on FY2025.~~ Closed later the same day; see the follow-up below.
  - Vertiv's backlog and book-to-bill come from different quarters.
  - Heron and RWE signed a grid-battery pilot on 21 September, which is not a data-centre campus.
- **Follow-up the same day — Narada at v5.** The dossier now carries the H1 2026 interim (filed 29 August on cninfo). The backup segment grew through FY2025 and then fell **44.8%** at a **−4.0%** gross margin in H1 2026. The group-three paragraph, the bets row and the ledger row are corrected and re-pinned at v5. `reviewBy` is unchanged.

Developed by: LightAISolutions
