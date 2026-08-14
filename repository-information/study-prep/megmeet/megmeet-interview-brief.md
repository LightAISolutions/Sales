# Megmeet — Interview Brief

*Built from `live-site-pages/profiler-data/megmeet.profile.json` (profileVersion 2, updated 2026-08-09). Companion to [`megmeet-lesson-plan.md`](megmeet-lesson-plan.md), which teaches the underlying physics — this file is the interview-facing layer: products, competitive position, recent activity, hard questions, and questions to ask.*

> **Sourcing discipline.** Everything below traces to the dossier. Where the dossier carries a labeled analytical read rather than a sourced fact, this file says so — because asserting an interpretation as fact to someone who works there is the fastest way to lose credibility.

## The one sentence

Megmeet is a Shenzhen power-electronics manufacturer with six business lines and ¥9.4B of revenue, deliberately burning its profit margin to get designed into the next generation of AI data-center power — the 800 VDC architecture NVIDIA is driving toward its 2027 megawatt racks. **The old appliance business is paying for the AI bet, and the bet has not paid off yet.**

## The five facts that carry the conversation

| Fact | Number | Why it matters |
|---|---|---|
| They are on NVIDIA's list | Only mainland-China power vendor named for GB200 NVL72 | In a server-power market ~74% held by Taiwanese suppliers, being the one mainland name NVIDIA called out is the door they walked through |
| The pivot is expensive | FY2025 net profit −66.6% to ¥146M | Revenue grew 15%; Q4 was a loss; operating cash flow went negative for the first time |
| AI revenue is not here yet | "Immaterial" through 2025 — *their own characterization* | Company told 21jingji its AI-server PSU orders were still small-batch, small-value, uncertain timing |
| But the ramp has started | Power products +67% YoY in Q1 2026 to ¥817M | The bull datapoint most candidates miss; Q1 total revenue +20.4%, all six segments growing |
| The verdict lands soon | H1 report ~27 Aug 2026 | Consensus embeds a ~6x FY2026 profit rebound premised on AI power; H1 is the first hard test |

**Do not assert:** trade press reported Megmeet displacing Lite-On as the #2 NVIDIA power-shelf source. The company has never confirmed it and its own statements point the other way. Say "I've seen it reported, though I don't think you've confirmed it."

## The 60-second answer to "what do you know about us?"

> "You're a power-electronics company, not really an appliance company or an AI company — that's the thing people get wrong. The founders came out of Huawei Electric and Emerson Network Power, so conversion is the core competence, and you've pointed it at six industries: appliance controls, EV and rail, industrial automation, welding, precision components, and power products. What's interesting right now is that the power-products group is being turned into an AI data-center business, funded out of the mature lines — R&D has been 11–12% of revenue for a decade, and FY2025 profit took a two-thirds hit to pay for it. The bet is that the shift from AC distribution to 800 VDC reshuffles who supplies rack power before the incumbents lock it down, and being the one mainland vendor NVIDIA named for GB200 is the beachhead. And I know the H1 report at the end of this month is really the first proof point on whether that revenue is showing up."

Why it works: it names the real identity (a conversion-technology platform, not a product company), credits the founding DNA, frames the profit collapse as a choice rather than a failure, and lands on a catalyst date almost nobody else will know.

## Company shape

| Business group | FY2025 share | Direction |
|---|---|---|
| Smart home appliance controls | 37.9% · ¥3.56B | Largest, and the **only segment that shrank** (−4.8%) on domestic price wars and soft India AC demand. The wallet funding the pivot |
| Power products (incl. AI data center) | 28.5% · ¥2.68B | +14% FY2025, then **+67% in Q1 2026**. The strategic centre of gravity |
| NEV & rail transit | 12.2% · ¥1.14B | Fastest growth (+109%) but lowest margin of the majors (15.3%) — volume land-grab, dilutive to mix |
| Industrial automation | 9.3% · ¥877M | +40%. Drives, servos, PLCs. ~28% gross margin |
| Intelligent equipment (welding, microwave, oil) | 6.4% · ¥605M | +31% at **38.5% gross margin — the highest in the company**. The quiet profit engine |
| Precision connection | 4.8% · ¥449M | +18% at 5.1% gross margin; company calls it an investment-and-integration period |

~40% of revenue earned overseas. 8,894 employees at end-2025 (~3,100 in R&D). Ten R&D centres, eight manufacturing bases across China, Thailand, India, the US, Germany. Founded 2003; SZSE-listed 2017; HK A+H dual listing filed June 2026.

## What they make — the product chain is the catalogue

Megmeet's AI catalogue *is* the power chain, box by box. Learn the chain and you have learned the catalogue.

| Stage | Product | What to know |
|---|---|---|
| 10–35 kV AC | **The grid arrives** (medium voltage) | High voltage because low voltage means enormous current, and losses rise with the *square* of current |
| → 800 V DC | **Solid-state transformer (SST)** | A transformer built from switching electronics instead of just an iron core. MV grid AC → 800 VDC in one system at **>98.5%**, megawatt scale. Replaces the step-down transformer, the rectifier stage, part of the central UPS. The product that would make them an infrastructure vendor rather than a component vendor |
| 480/380 V AC → 800 V | **800 V HVDC sidecar** | The bridge shipping today. A cabinet standing *beside* the rack converting building AC to 800 VDC, feeding **>1 MW into a single rack** without rebuilding the facility. Claims vs legacy in-rack AC: **+5% efficiency, −45% copper, up to −30% TCO**. Announced for NVIDIA Kyber May 2025 — first mover among mainland vendors |
| 800 V DC bus | **BBU + supercapacitor shelves** | The UPS dissolved into the rack. BBU (16.5 kW) rides through seconds-to-minutes; supercap shelf (15 kW) absorbs *millisecond* swings. Both are needed because GPU training loads slam between compute and communication phases |
| 33 kW / 110 kW | **Power shelves** | Slide-in 19-inch trays feeding the rack DC busbar. 33 kW air-cooled (1U, hot-swap, N+1/N+N) and **110 kW liquid-cooled** for GB300/Vera Rubin racks at 45 °C warm-liquid inlet. The jump to 110 kW liquid (May 2026) is the clearest signal they track NVIDIA's roadmap rather than follow it |
| 800 W – 5.5 kW | **CRPS / M-CRPS server PSUs** | Standard form factor — any compliant module fits any compliant chassis, **which is exactly how a challenger gets in**, because sockets are re-competed on spec. Ruby-grade M-CRPS launched Mar 2026 at 5.5 kW, **>100 W/in³** |
| → ~1 V DC | **Power brick** | Point-of-load converter next to the GPU, dropping the bus to the ~1 V at hundreds of amps the silicon drinks |

**The sentence that shows you get it:** "The reason 800 VDC matters isn't efficiency for its own sake — it's that a classic rack drew 5–15 kW and an NVIDIA-class rack is heading to a megawatt. At 415 VAC a megawatt is ~1,400 A, which means busbar like railroad track. The old chain physically stops scaling, so you convert once, early, at high voltage, and distribute DC instead."

**The connective insight for the other segments:** every other business line is the *same physics* aimed at a different industry. A variable-frequency drive rectifies grid AC to DC then re-synthesizes AC at a chosen frequency (motor speed follows frequency; motors are ~45% of global electricity). Appliance controls are the same inverter sized for a compressor. EV on-board chargers and DC-DC units are the same stages in a vehicle. Welding is precision current control — and their highest-margin line.

## Where they stand

| Player | Position | What to know |
|---|---|---|
| **Delta Electronics** | ~41% share, Taiwan | The incumbent to beat. Deepest published 800 VDC stack, first-qualified across GB200/GB300 shelf sets, ~70% of Blackwell-platform PSUs |
| **Lite-On** | #2, ~30%, Taiwan | BBU franchise is its structural edge — BBUs went from optional (GB200) to standard (GB300). Slightly behind Delta on the 800 V clock |
| **Taiwanese bloc** | ~74% of server power | Delta, Lite-On, AcBel, Chicony, Advanced Energy. This concentration is why a mainland challenger interests NVIDIA at all |
| **Megmeet** | Only mainland vendor NVIDIA named | Competing on **architecture timing, not price**. Co-developed 800 VDC sidecar shown at OCP Global Summit Oct 2025 |

**The strategic argument (labeled analysis — moderate confidence in the dossier, *not* company guidance):** when a technology generation turns over, the incumbent's qualifications, installed base and tooling partially reset, and every socket is re-qualified against a new spec. Megmeet's wager is that it gets designed in during that reset window, before incumbents re-consolidate around 800 VDC as they did around AC. Present this as "my read is…", never as something Megmeet said.

**The second half of the position:** Thailand phase II capacity, India localisation, the Dallas test lab, and the Hong Kong listing all point one way — a mainland company packaging itself to be procurable by American AI-infrastructure buyers despite tariff and geopolitical friction. Named network-power customers already include Ericsson, Cisco, Juniper, Arista, Accton, so the Western-OEM muscle exists and is being redirected.

## Recent activity (newest first)

The pattern to notice: **the product and capacity news is relentlessly positive while the financial news is relentlessly hard** — and both are true at once. That tension *is* the company right now.

| Date | Event | Read |
|---|---|---|
| 2026-07-20 | **Three 10% limit-downs in four sessions**; ~−31% in 20 days off the June peak | Sell-side cited profit collapse, negative operating cash flow, >¥6B guarantee quota, HK dilution risk. The AI premium is real but fragile |
| 2026-06-29 | **HK A+H dual listing filed** (Huatai International, Citigroup) | Offshore raise to fund AI-power capex; arguably necessary given negative operating cash flow, dilution the accepted price |
| 2026-06-26 | **Dallas, Texas AI-DC power test lab** opened — 360 kW active, 1.5 MW roadmap | Validation capacity next to US hyperscaler customers — localisation beyond "made in Thailand" |
| 2026-05-29 | **NVIDIA MGX: 110 kW liquid-cooled power shelf**, 800 VDC rack conversion, BBU/supercap shelves | Moving up from 33 kW air to the liquid-cooled class for GB300 / Vera Rubin racks |
| 2026-04-28 | **FY2025 results + Q1 2026** | FY2025: revenue ¥9.40B (+15.1%), net profit ¥146M (−66.6%), ex-one-off −93%, Q4 a loss, OCF −¥139M. Q1 2026: revenue ¥2.788B (+20.4%), all six segments growing, **power products +67% to ¥817M** |
| 2026-04-13 | **Full 800 VDC grid-to-GPU chain** shown at Open AI Infra Summit, Beijing | SiC/GaN front end, sidecar, power/BBU shelves, digital-twin control — full-chain vendor, not a single-shelf supplier |
| 2026-03-03 | **Ruby-efficiency M-CRPS 5.5 kW** server PSU | Past Titanium to Ruby at >100 W/in³ — spec leadership is the entry ticket to AI-server sockets |
| 2026-02-06 | **¥2.66B private placement** completed at ¥85.01/share | Subscribers included E Fund and UBS; **the chairman participated personally**. Funds Changsha R&D, Thailand phase II, Zhuzhou phase III — the capex is financed |
| 2026-01-28 | **FY2025 profit warning**: net profit −66% to −72% | Blamed on AI-power R&D, overseas build-outs, price wars, FX losses — the pivot's cost landing before its revenue |
| 2025-11-04 | **Company said AI-server PSU orders were still small-batch**, small-value, uncertain timing | Their own words to 21jingji, and they contradict market share-gain reporting. The single most useful thing to know |
| 2025-10-13 | **Co-developed 800 VDC sidecar** shown at OCP Global Summit | Public NVIDIA co-development visibility — the ecosystem-credibility milestone |
| 2025-05-21 | **800 V HVDC sidecar for NVIDIA Kyber** announced (>1 MW/rack) | First mover among mainland vendors. Where the AI story starts |

**Market context, if raised:** ~¥24 (early 2024) → ¥190 intraday peak / ~¥94.7B market cap (3 Jun 2026) → ¥108.71 / ~¥63.6B (29 Jul 2026). Handle lightly — know the arc, don't volunteer an opinion on your prospective employer's share price.

## The hard questions

In each case the winning move is the same: **acknowledge the real difficulty, then show you understand why the company chose it.** Do not be a cheerleader — people who work there know the numbers better than you do.

**"What do you make of our FY2025 results?"** — Name the trade honestly: revenue +15%, profit −two-thirds, because R&D and overseas capacity were pulled forward ahead of the revenue they serve, with FX losses and price competition on top. Then make the analytical point: the useful question isn't whether profit fell, it's *whether the spending bought position*. Evidence it did — NVIDIA ecosystem membership, the co-developed sidecar, the jump to 110 kW liquid, power products +67% in Q1. Evidence still outstanding — revenue at scale, which H1 will show.

**"Is the AI data-center business real, or is it a story?"** — The honest answer earns more than the enthusiastic one. Per the company's own late-2025 statements, AI orders were small-batch and immaterial, most projects pre-mass-production. What has changed is directional: batch deliveries of custom server power began end-2025, first domestic hyperscaler volume delivery expected 2026, power products +67% in Q1 2026. So: real and starting, not yet material. Then the sharp bit — consensus prices a ~6x FY2026 profit rebound, so the market has already decided; H1 shows whether it was right.

**"Why would a hyperscaler buy from us instead of Delta?"** — Three arguments together. *Architecture timing*: during a reset, sockets are re-qualified and the incumbent's lead partially resets. *Supply-base diversity*: a ~74% Taiwanese market is a concentration risk large buyers actively manage. *Full-chain capability*: Megmeet can quote grid-to-GPU rather than one box, which is rare. Then be candid — Delta is first-qualified across the shelf sets and holds most Blackwell PSU volume, so this is a wedge, not a coronation.

**"What worries you about us?"** — A real answer, calmly delivered, is a strength. The expectations-vs-disclosure gap is the honest one: the company said AI revenue was immaterial and consensus is priced for a 6x rebound — a lot of load on one half-year print. Second, the fastest-growing segment (EV/rail, +109%) runs at 15.3% gross margin, so growth is dilutive to mix. Third, negative operating cash flow means the build-out depends on capital markets, which is presumably part of why the HK listing exists. Frame these as things you'd want to understand better, not accusations.

### Say / don't say

| Say | Don't say |
|---|---|
| "My read is the profit collapse was a deliberate purchase of position — and H1 is the first real scoreboard." | "The profit drop isn't a concern." It plainly is; pretending otherwise signals you didn't read the filings |
| "You're the only mainland vendor NVIDIA named for GB200 NVL72 power." | "You've taken the #2 shelf slot from Lite-On." Reported, never confirmed, contradicted by the company |
| "The 800 V transition is a vendor-list reset on a published clock — first shipments this year, Kyber racks 2027." | "800 volts is just more efficient." True but shallow — the driver is that megawatt racks make AC distribution unworkable |

## Questions worth asking them

Pick three or four; don't run the list.

1. **"How much of the 800 VDC opportunity comes through the sidecar versus the SST?"** — retrofit versus purpose-built campus; two businesses on two timelines.
2. **"Does NVIDIA ecosystem membership translate into ODM design-ins, or do you still win each one separately?"** — the real commercial question behind the thesis.
3. **"Is the Dallas lab mostly about validation speed, or about being procurable by US buyers?"** — names the geopolitical strategy without saying anything awkward.
4. **"The 110 kW liquid-cooled shelf is a big step from 33 kW air — how much of that engineering was thermal versus power conversion?"** — a genuine engineering question.
5. **"How do you think about appliance controls over the next few years — cash engine to be managed, or reinvested in?"** — shows you looked at the whole company.
6. **"Where does storage fit — is the BBU/supercap layer something you build or integrate?"** — opens the conversation you probably most want.

**The one that will be remembered:** *"When the half-year numbers come out at the end of the month, what will you personally be looking at first?"* Warm rather than adversarial, proves you know the calendar, and almost nobody else will ask it.

## Vocabulary

| Term | Meaning |
|---|---|
| 800 VDC / HVDC | High-voltage DC distribution inside the data hall — the architecture transition everything revolves around |
| SST | Solid-state transformer — MV grid AC → 800 VDC in one electronic system, >98.5% |
| Sidecar | Cabinet beside the rack converting building AC to 800 VDC — the retrofit path to megawatt racks |
| CRPS / M-CRPS | Common Redundant Power Supply — the standard server-PSU form factor; "M" is the higher-power variant |
| BBU | Battery backup unit — seconds-to-minutes ride-through on the rack DC bus |
| Supercapacitor | Far less energy than a battery, delivered far faster — catches millisecond load swings |
| N+1 / N+N | Redundancy: one spare module beyond the load, or full duplication |
| Hot-swap | Replacing a failed module without powering anything down |
| PUE | Power usage effectiveness — facility power ÷ IT load. 1.5 ordinary, <1.1 the ambition. The industry scoreboard |
| Titanium / Ruby | Server PSU efficiency grades; Titanium ≈96%, Ruby the newer top tier |
| GB200 / GB300 | NVIDIA rack-scale GPU systems; NVL72 = 72 GPUs joined as one unit |
| Kyber / Vera Rubin | NVIDIA's next rack generation and platform — the racks that need 800 VDC, arriving 2027 |
| MGX | NVIDIA's modular server reference architecture partners build to |
| OCP | Open Compute Project — the open hardware standards body whose summit is where this ecosystem shows its work |
| SiC / GaN | Silicon carbide, gallium nitride — wide-bandgap semiconductors that switch faster and hotter than silicon, enabling compact high-efficiency conversion |
| VFD | Variable-frequency drive — the industrial-automation product; controls motor speed by synthesizing AC at a chosen frequency |
| PCS | Power conversion system — the inverter block in battery storage; the bridge to the storage world |

## Ten-question self-test

Answer out loud before checking. Recall is what makes it stick.

1. Why does an AI rack need 800 VDC instead of 415 VAC?
2. What does a solid-state transformer replace?
3. Why does the rack need both a BBU and a supercapacitor shelf?
4. What is the commercial difference between the sidecar and the SST?
5. Why is a standardized PSU form factor good news for a challenger?
6. What share of server power do Taiwanese suppliers hold, and who leads?
7. What did Megmeet itself say about its AI order book as of late 2025?
8. What happened to FY2025 profit, and why?
9. What is the single most encouraging recent number?
10. What happens at the end of August, and why does it matter?

<details><summary>Answers</summary>

1. A megawatt at 415 VAC is ~1,400 A — impractical busbar and severe resistive losses; losses scale with the square of current. Converting once at high voltage and distributing DC also removes stages and lets batteries connect natively.
2. The conventional step-down transformer, the rectification stage, and part of the central UPS — collapsed into one system at >98.5%.
3. Different timescales: supercaps absorb millisecond transients from GPU compute/communication phase swings; batteries carry seconds-to-minutes ride-through.
4. Sidecar is the retrofit product for buildings distributing 480/380 VAC today; the SST is for purpose-built DC campuses and arrives later. Sidecars dominate through ~2027.
5. Any compliant module fits any compliant chassis, so sockets are re-competed on spec rather than locked to an incumbent relationship.
6. ~74%, led by Delta at ~41%, with Lite-On, AcBel, Chicony, Advanced Energy behind.
7. That orders were still small-batch, small-value, uncertain timing, with most projects pre-mass-production.
8. Net profit −66.6% to ¥146M on revenue +15.1% to ¥9.40B; ex-one-off −93%; OCF negative for the first time. Causes: AI-power R&D, overseas build-outs, price competition, FX losses.
9. Power products +67% YoY in Q1 2026 to ¥817M, inside total revenue +20.4% with all six segments growing.
10. The H1 2026 report (~27 Aug). Consensus embeds a ~6x FY2026 profit rebound premised on AI data-center power — the first hard test of whether it is materializing.

</details>

Developed by: ShadowAISolutions
