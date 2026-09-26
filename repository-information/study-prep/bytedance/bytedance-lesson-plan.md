# ByteDance — Technology Lesson Plan

**Purpose:** teach how an AI platform's demand turns into power-equipment orders, starting from high-school STEM — what a token is and why output tokens cost more than input tokens, how token volume becomes accelerators, racks and megawatts, the three doors through which a hyperscaler's power equipment is bought (its own campuses, a landlord's halls, rented capacity), how to convert racks to megawatts, what 'HVDC penetration' and an '800 V pilot' mean, why an SST's medium-frequency transformer is the hard part, and how to read capex numbers that disagree. No company trivia: founding dates, executives, app user counts and valuations stay in the dossier. Generated 2026-09-26 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → ByteDance → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The Alibaba Cloud guide teaches the Chinese DC power chain from 240 V to Panama; this one assumes it and turns to demand, procurement and evidence. The Chindata guide teaches ByteDance's largest landlord from the landlord's side. Read the three together.

**Suggested pacing (before 7 October 2026):** Module 1 (~20 min — tokens), Module 2 (~25 min — the three doors; the most important module), Module 3 (~15 min — racks to megawatts), Module 4 (~20 min — the chain and its suppliers), Module 5 (~25 min — the 800 V question and reading evidence), Module 6 last (~10 min — chips and borders), then the flashcard and self-test passes in the app.

## Module 1 — Tokens

**The single idea:** a token is the unit of AI output, every token is arithmetic on an accelerator, and the price structure of a token shows where the accelerator's time goes.

1. **What a token is.** A word or a piece of one. Models read input tokens (the prompt) and write output tokens (the answer). Volcano Engine sells ByteDance's Doubao-Seed models and third-party models per million tokens — model-as-a-service (MaaS). Its president said Doubao processed 180 trillion tokens a day by June 2026.
2. **Prefill and decode.** Input tokens are processed together in one parallel pass, keeping the arithmetic units busy (cheap per token). Output tokens are generated one at a time; each needs a full pass through the model's weights and is limited by memory bandwidth (expensive per token). On the September 2026 price page Doubao-Seed 2.1 Pro costs RMB 6 per million input tokens and RMB 30 per million output; third-party models run three to three-and-a-half times.
3. **The cache.** A repeated prompt prefix can reuse stored intermediate state instead of recomputing it; the price falls to between a quarter and a thirtieth of the input price, and the platform charges for the memory held (RMB 0.017 per million tokens per hour).
4. **From tokens to megawatts.** More tokens → more accelerator-hours → more accelerators → more racks → more megawatts of IT load → more substations, transformers, UPS or DC systems and distribution. Two brakes: energy per token falls as chips and models improve, and not every accelerator sits in a building ByteDance owns.

**Self-check:** why do output-heavy, long-context workloads matter most to a power-equipment seller? (They keep memory-rich accelerators busy around the clock — the load the chain is sized for.)

## Module 2 — The three doors

**The single idea:** where a megawatt sits decides who orders its power equipment and who writes the specification.

1. **Own campuses.** Run under Volcano Engine names — the Yangtze-Delta centre at Wuhu and its Wuwei site, the Taihang centre at Datong, Horinger in Inner Mongolia — and ordered directly: suppliers' own filings name ByteDance or Volcano Engine as the customer. ByteDance writes the spec; the spend is capex.
2. **Leased halls in China.** Most of ByteDance's China capacity is rented from wholesale landlords. Chindata China's acquirer reports that one customer took ~90% of its revenue and that UPS makers are chosen by tender from the customer's qualified-vendor list. The landlord places the order; the tenant decides who may win it. Operating expense, not capex.
3. **Rented abroad.** Overseas campuses (Johor, Thailand, Brazil, Finland) and GPU clouds that own the chips. The owner buys the equipment; rented GPUs buy none; the spend is operating expense.
4. **The direction of travel.** The landlord's filing tabulates the tenant's own campuses as a risk and notes that the first wholesale contract expires in November 2027 with no renewal talks started. Self-build moves the equipment decision from the landlord's engineers to ByteDance's.
5. **Capex leaks.** RMB 160 billion (December 2025), more than RMB 200 billion (May 2026), up to US$70 billion under discussion (May 2026): a budget, a revision and a ceiling, with different scopes. About 3× low to high; none confirmed. Report the range and each scope; never average.

**Self-check:** a UPS maker has sold to the landlord for years but is not on the tenant's list. Can it win the next leased hall? (No — the list gates the tender; it must qualify with the tenant.)

## Module 3 — Racks to megawatts

**The single idea:** IT megawatts = racks × kilowatts per rack; the power does not shrink when racks get denser, it concentrates.

1. **A worked campus.** Datong phase 2 was approved as 15,604 racks at 12 kW: 15,604 × 12 kW ≈ 187 MW, the figure the landlord's filing gives.
2. **The same load at AI densities.** 187 MW at 40 kW/rack ≈ 4,700 racks; at 130 kW ≈ 1,440; at 350 kW ≈ 535. A few hundred cabinets carry what thousands of rows did — which is what forces liquid cooling and higher distribution voltages (see the Alibaba Cloud plan, Module 3).
3. **Use it as a check.** Rack count × density should roughly match the substation and the MW figure in a filing; a factor-of-several disagreement means one number describes something else.

**Self-check:** a permit lists 21,824 server racks and a substation but no density. What do you need before quoting megawatts? (The design density per rack — without it the rack count is not a power figure.)

## Module 4 — The chain and who makes it

**The single idea:** a hyperscale campus is built from a handful of equipment categories, and ByteDance's named suppliers in each are domestic makers.

1. **Substation.** Takes the grid feed at high voltage and steps it to the campus's 10 kV; prefabricated versions arrive as factory-tested blocks. TGOOD's filings record ByteDance/Volcano Engine orders, including the Wuwei site.
2. **Protection and energy management.** Relays and control that detect and isolate faults and manage power flows. Sifang's 2025 report names the Wuhu phase-2 Volcano Engine centre.
3. **Transformers.** 10 kV to the building's low voltage, usually dry-type indoors. Jinpan's bond filing lists ByteDance among 360 completed data-centre projects.
4. **UPS and power modules.** AC UPS or 240/336 V DC systems. Kstar names ByteDance first among its IDC customers for UPS and power modules; Mingyang Electric's power module won a Volcano Engine project.
5. **Precision distribution.** Row- and rack-level panels, busway, rack-head cabinets and switching. Zhonhen's 2025 report records wins in ByteDance self-built and third-party co-built rooms — precision distribution, not HVDC.
6. **Cable.** Far East took part in building the Yangtze-Delta campus.
7. **Who is absent.** Full-text searches of Megmeet, Sinexcel and Kehua filings find no ByteDance mention — and Kehua anonymises its internet customers. Silence is a collection gap, not proof.

**Self-check:** Zhonhen's report names ByteDance. Does that make Zhonhen ByteDance's HVDC supplier? (No — the named win is precision distribution; the HVDC win in the same passage is a bank.)

## Module 5 — The 800 V question and reading evidence

**The single idea:** a tender is a signal, an award is a fact, and an SST award is meaningful because its hardest part is still being qualified.

1. **HVDC penetration.** The share of IT load fed by 240/336 V DC systems instead of AC UPS — a fleet average that moves slowly because built halls keep their chains.
2. **An 800 V pilot.** One building fed at 800 V DC from a transformer-rectifier or an SST — a test of source, DC protection and racks together. A 'building-level, tens-of-MW' pilot would be one hall.
3. **What the record holds.** The 30–40% HVDC share and the tens-of-MW pilot trace to one unattributed exhibition post (22 January 2026); the same site said a week later that the 800 V work was 'still out to tender'; a financial paper confirmed on 22 September 2026 only that 800 V HVDC was 'first introduced'. No supplier filing announces a ByteDance 800 V or SST award.
4. **Tender versus award.** A tender asks for bids; an award names the winner, and a material order to a listed Chinese supplier usually surfaces in its filings. Watch the Q3 2026 reports (due by 31 October).
5. **Why the SST's transformer is the hard part.** An SST's medium-frequency transformer must hold full medium-voltage insulation in a small core under SiC switching edges; heat and partial discharge are hardest there. A supplier rumoured to have won a ByteDance SST pilot said in April 2026 that its SST's core medium-voltage high-frequency transformer was still at sample testing.

**Self-check:** what single document would convert the 800 V story from signal to fact? (A listed supplier's filing or a ByteDance/Volcano Engine release naming an 800 V or SST award.)

## Module 6 — Chips and borders

**The single idea:** export controls split ByteDance's compute map, and only the domestic half buys power equipment through Chinese procurement.

1. **The rule.** US export controls restrict which accelerators Chinese companies may buy and where they may run.
2. **The split.** At home: permitted imported chips and domestic accelerators (reported, not confirmed: ByteDance-designed ASICs made by Qualcomm; a larger domestic-chip budget). Abroad: leased campuses and GPU clouds running the newest chips; in the US, TikTok runs in Oracle's cloud inside the TikTok USDS joint venture.
3. **The consequence.** Domestic halls buy Chinese power equipment through the three doors; overseas halls buy through their owners; rented GPUs buy none. The domestic chip mix sets the rack power envelope a Chinese seller designs for — and nobody at ByteDance has published a rack power class or busbar voltage.

**Self-check:** why is ByteDance's overseas capex a poor guide to Chinese power-equipment demand? (Much of it is leased or rented abroad, bought by the owners, and some is not capex at all.)

## Where the flashcards and self-test point

The in-app guide's drill items test the concept chain above — prefill versus decode and the cache, tokens to megawatts, the three doors and the approved vendor list, racks × density, HVDC share versus an 800 V pilot, tender versus award, the medium-frequency transformer, capex scope, and silence in filings. None tests a date, a name or a share count.

Developed by: LightAISolutions
