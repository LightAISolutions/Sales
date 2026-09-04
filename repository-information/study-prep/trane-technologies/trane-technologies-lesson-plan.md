# Trane Technologies — Technology Lesson Plan

**Purpose:** teach **the chiller as a machine and the plant around it** — why compressor work is a function of temperature lift and nothing else you can easily change, why the compressor type decides the machine's whole character, why the part-load number is the honest one, why the refrigerant became a regulated component with a legal calendar, why rejecting heat to a wet-bulb beats rejecting it to a dry-bulb and what that costs in water, and why a plant with perfectly good chillers can still fail at its hydronics. Starting from high-school physics. No company trivia. Generated 2026-09-04 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → Trane Technologies → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** This app carries the deepest treatment of the thermal chain anywhere in the corpus and this plan repeats none of it. **Vertiv** covers CRAC against CRAH against chiller as a room-level choice, the CDU and the plumbing family below it — manifolds, cold plates, quick disconnects, the rear-door heat exchanger — the temperature budget from junction to outdoor air, why warm water buys chiller-free hours, and rack airflow, blanking panels and floor loading at the cabinet. **Schneider Electric** covers the BMS, DCIM, prefabricated modular plant and energy accounting. This plan is the **machine** Vertiv's guide gives one sentence to, and the **plant** built around it.

**Three ideas carry the plan.** Every degree of **lift** you can give back is compressor work you do not pay for. A chiller is **bought at full load and lived with at part load**. And a plant fails at its **hydronics** far more often than at its machines.

**One boundary, held throughout.** Trane Technologies is not "Trane". The listed company owns the **Trane** commercial and residential brand, **American Standard Heating & Air Conditioning** (unrelated to the plumbing-fixture company of a similar name, which has belonged to a different group since 2013), and **Thermo King** transport refrigeration. Commercial HVAC in the Americas is the great bulk of it, the data-centre thermal line is a minority, and **no split between them is published anywhere**. Module 5 makes that a lesson rather than a footnote.

**Suggested pacing:** Module 1 in one sitting (~30 min). Module 2 with a real chiller datasheet if you can get one — it is the module that pays (~40 min). Module 3 (~30 min). Module 4 (~35 min). Module 5 (~20 min). Then flashcards and self-test in the app.

## Module 1 — Lifting heat uphill

**The single idea:** a chiller does not make cold. It moves heat from somewhere you want cool to somewhere you do not care about, and the only way to move heat from cold to hot is to do work on the way.

**The cycle, in four steps.** A liquid refrigerant enters the **evaporator** at low pressure, where its boiling point is below the temperature of the water being chilled — so it boils, and boiling absorbs an enormous amount of energy at constant temperature (**latent heat**, far more per kilogram than merely warming the same fluid). The cold vapour goes to the **compressor**, which raises its pressure and with it its temperature. The hot vapour enters the **condenser**, where its condensing temperature is now above the outdoor air or the tower water, so it gives its heat up and turns back to liquid. The **expansion device** drops the liquid back to evaporator pressure, cooling it as it goes, and the loop closes.

**COP greater than one is not a trick.** A machine moving six kilowatts of heat for one kilowatt of electricity has a coefficient of performance of 6. It is not creating energy; it is relocating it, and the electricity pays only for the relocation. It is also why a chiller and a heat pump are the same machine — one sells the cold end, the other the hot end.

**Now the number that costs money. Temperature lift** is the difference between condensing and evaporating temperatures — how far uphill the machine pushes. Compressor work rises steeply with it and everything else is second order. Two consequences follow and they explain most of this plan: **raise the chilled-water temperature** and the evaporator end of the lift comes up; **lower the condensing temperature** and the other end comes down. Both are worth real money and both are free when the weather cooperates.

**Two smaller controls.** **Superheat** is the few degrees of extra warming the vapour carries above its boiling point leaving the evaporator — the margin that keeps liquid out of a machine designed to compress gas. **Subcooling** is the few degrees below condensing temperature the liquid carries leaving the condenser; more of it means more useful cooling per kilogram circulated.

**The unit is historical.** A **ton of refrigeration** is the rate that would freeze a short ton of ice in a day — about 3.517 kW. Carry this conversion: **a megawatt of IT load needs roughly 284 tons of cooling**, before adding the electrical losses that also become heat.

**Self-check:** two identical chillers, one in Phoenix and one in Seattle, serving the same load. Which uses less electricity over a year, and why? *(Seattle — lower ambient means a lower condensing temperature, a smaller lift, and less compressor work per ton, every hour.)*

## Module 2 — The compressor, and the number on the datasheet that matters

**The single idea:** the compressor type sets the machine's capacity range, its part-load behaviour, its noise, its maintenance and its failure mode. Everything a datasheet says is downstream of it.

- **Centrifugal** — a high-speed impeller flings refrigerant outward and velocity becomes pressure. The large end, hundreds to thousands of tons: the highest efficiency available at scale, continuous flow, few moving parts. It has a lower flow limit called **surge**, below which it cannot hold head at all — which is why a big centrifugal makes a poor small machine.
- **Screw** — two meshing helical rotors trap gas and squeeze it. The middle, roughly a hundred to several hundred tons: tolerant of high lift and deep part load, compact, no surge limit, and it needs oil management.
- **Scroll** — two interleaved spirals, one orbiting inside the other. The small end, and the building block of modular machines that gang many together: simple, quiet, cheap, with excellent part-load because you simply switch some off.
- **Reciprocating** — a piston in a cylinder. Largely displaced in new applied equipment, still common in refrigeration and transport.

**Two refinements at the large end.** A **variable-speed drive** on a centrifugal lets the impeller slow as the required lift falls — the condition that holds for most of the year, and the largest single contributor to a good part-load number. A **magnetic bearing** floats the shaft on controlled fields instead of oil; the point is not the friction saved but the **oil removed**, because oil that escapes ends up as a film on the evaporator tubes degrading heat transfer for the life of the machine.

**Now the number.** A chiller is selected against the worst hour of the design year and then spends essentially none of its life there. **IPLV** weights efficiency at 100, 75, 50 and 25 percent load — under the North American standard, roughly 1, 42, 45 and 12 percent of the hours respectively. Read that again: **the rated full-load point carries about one percent of the weight.** **NPLV** is the same calculation at the project's actual temperatures, and it is the number to ask for when the design is not standard. Comparing one maker's IPLV against another's NPLV is meaningless, and it happens.

**Why part-load efficiency often beats full-load efficiency.** Condenser-water relief: cooler weather lowers the condensing temperature, shrinking the lift. Part load usually coincides with cooler weather, so the machine does less work per ton exactly when fewer tons are asked for. A control sequence holding condenser water at a fixed high temperature all year throws this away entirely.

**And the floor.** **Minimum stable load** is the lowest output a machine holds continuously; on a centrifugal it is set by surge. Below it the machine cycles, which wastes energy and wears it. A plant whose smallest chiller's floor is above the building's night load will cycle every night of the year, and the fix is a smaller machine in the lineup rather than a setting.

**Self-check:** two chillers have identical full-load kW/ton but very different IPLV. Which costs less to run, and by roughly how much of the weighting? *(The better-IPLV machine, and by about 99% of the weighting — the full-load point carries about one percent.)*

## Module 3 — The refrigerant is a regulated component

**The single idea:** for most of this industry's history the working fluid was an engineering choice. It is now a compliance choice with an engineering consequence, on a calendar set by law.

- **GWP** is the sorting variable — how much a kilogram warms the atmosphere relative to carbon dioxide.
- The **AIM Act** phases down US production and imports of high-GWP hydrofluorocarbons in steps, with sector rules on what new equipment may be charged with.
- The **EU F-gas Regulation** runs a steeper quota schedule to zero, which is why a global manufacturer often ships different fluids into different markets from the same factory.
- **A2L** is a safety class meaning low toxicity and **mild flammability** — where most low-GWP replacements land. It brings leak detection, machine-room ventilation, charge limits per space, labelling and pipe-routing rules through rated assemblies. **This is a building change dressed as a fluid change**, and most US jurisdictions are still on a code edition that does not reference A2Ls at all, so the local authority's interpretation becomes part of the design.
- **ASHRAE 15** is the standard that makes that concrete for the machine room.
- A **low-pressure refrigerant** runs below atmospheric on the low side, so a leak draws air **in** rather than pushing refrigerant **out**. It permits a thinner-walled, lighter machine and requires a purge unit to remove the air and moisture that leak inward — a genuinely different machine, not a different charge.

**The practical reading for a buyer.** The refrigerant decides three things that outlive the purchase and appear in no efficiency number: whether the fluid will still be available and affordable to top the machine up in fifteen years; whether the machine room needs detection and ventilation it does not have; and whether the machine is a high- or low-pressure design, which changes its construction, service regime and leak behaviour. The transition is also not smooth in practice — the US saw a real shortage of one A2L replacement through 2025, with surcharges and manufacturers extending factory pre-charging to cut what had to be added in the field.

**Self-check:** a client wants to "just switch to the low-GWP refrigerant" on an existing machine. What have they actually proposed? *(Possibly a different machine — pressure class, materials and controls may all differ — plus a machine-room modification and a code review with the local authority. The drum is the easy part.)*

## Module 4 — The plant is not the chiller

**The single idea:** you can buy the best chillers in the catalogue, install them correctly, and still run a plant that costs half again what it should. The reason is the water outside the machines.

**Where the heat goes.** An air-cooled machine rejects to the **dry-bulb** temperature. A water-cooled machine rejects through a **cooling tower** to the **wet-bulb**, which is always at or below dry-bulb and on a hot dry day far below — a much smaller lift and materially less energy. What it costs is water, chemistry, a Legionella regime, and a great deal more equipment. The middle ground is where most new plants land: **adiabatic** pre-wetting captures most of the tower's efficiency using water only on the hottest days; a **dry cooler** uses none at all and gives up hot-day capacity.

**Reading a tower.** Five numbers: the **wet-bulb** (the floor, a property of climate); the **approach** (how far above it the leaving water actually is — closing it costs surface area and buys lift, forever); the **range** (the drop across the tower, which with flow gives the heat rejected); **cycles of concentration** (how far the dissolved solids concentrate before blowdown); and **drift** (droplets carried out, small and regulated). The water budget in one line: **make-up equals evaporation plus blowdown plus drift**. Evaporation is physics; blowdown is the lever, and cutting it trades water for scale on the condenser tubes — which widens the approach, raises the lift, and costs energy. **WUE and PUE move in opposite directions**, and anyone quoting one without the other is quoting half the answer.

**The hydronics, and the classic failure.** The heat a loop carries is flow times **delta-T**. Turn it around: for a fixed duty, **flow is inversely proportional to delta-T**. Design for 10 °C and achieve 5 °C and the plant pumps twice the water for the same cooling. That is **low delta-T syndrome**, and it is nearly universal in older plants. It is **almost never caused at the chiller** — it is control valves leaking through, three-way valves bypassing, coils fouled or oversized, or a bypass left open years ago. The plant then does something that looks insane and is perfectly logical: it **stages on another chiller**, not because the building needs cooling but because the secondary flow exceeds what the running machines can pass. A plant at half load with every chiller running is the signature.

**Which is why the pipe arrangement matters.** A **primary-secondary** plant splits constant flow through the chillers from variable flow to the load, joined by a short **decoupler**. It is forgiving and it *hides* a low delta-T, because excess secondary flow reverses through the decoupler and mixes warm return into the supply. **Which way and how much water flows through that short pipe is the single most useful diagnostic in the plant**, and most plants do not measure it. **Variable primary flow** removes the second pump set and exposes the problem instead of hiding it — better, and less forgiving.

**Staging** is the last piece and the one most often left as the vendor shipped it. Stage on early and four machines run lightly loaded where two would do; stage on late and a machine surges. The right sequence depends on the individual part-load curves, the pumping arrangement and the season — and in a growing data hall the load changes continuously. A badly sequenced plant is not broken. It just costs more, every hour, for twenty years.

**Two levers worth knowing.** **Raising the chilled-water supply temperature** is the cheapest efficiency move available: it shrinks the lift directly and multiplies free-cooling hours. What stops you in an air-cooled hall is dehumidification and coil capacity — and **direct liquid cooling removes both objections**, because a cold plate is not dehumidifying anything. And **thermal storage** solves a failure nobody watches: when power fails the UPS carries the IT load instantly, so the racks keep making heat, while compressors on generator power must restart in sequence and often enforce an anti-recycle timer of minutes. The only bridge is the water already in the pipes.

**Self-check:** a plant is running four chillers at 40% each on a mild day. What is your first measurement? *(The decoupler — direction and magnitude of flow. It will almost certainly show the plant staging on flow rather than load.)*

## Module 5 — Two businesses, one thermodynamics

**The single idea:** the same vapour-compression cycle sold into two industries that share almost nothing else — and holding them apart is a reading skill, not a legal footnote.

| | Commercial and residential HVAC | Transport refrigeration |
|---|---|---|
| The box | A building: fixed, surveyed, utility-connected | A trailer, truck, rail car or container: moving, vibrating, salted |
| Power | The building's electrical service | Its own engine, battery, shore power or alternator |
| Duty | Weather-following, with a design day | Door openings, arctic to desert, road shock |
| Customer | Owners and developers, through engineers and contractors | Fleet operators, through dealers, on cost per mile |
| Cycle | Construction and retrofit, plus a refrigerant calendar | Freight — trailer orders and spot rates, out of phase with construction |
| In the accounts | Inside three geographic segments | Inside the same three segments; not a reportable segment |

**Why this is in a technology plan.** When a headline says a company's backlog rose 70% on data-centre demand, the accurate reading is that one line inside one segment moved — while residential weakened through a refrigerant transition and transport refrigeration stayed soft. Nothing in the published accounts lets you separate them, and the honest response is to say so rather than to estimate. That is the same discipline the Oklo plan applies to announcements, applied here to segments.

**Self-check:** you are told data centres are "about 10% of revenue". What is the provenance of that number, and what should you do with it? *(It is an unattributed analyst estimate relayed by a retail outlet — no analyst, no firm named. Report it as an estimate with its provenance, and never derive from it.)*

## Where it fails — the checklist

Drawn from `CLASSROOM-CURRICULUM-PLAN.md` §5 row 13 (the thermal chain) and row 14 (commissioning), plus the machine-specific modes:

1. **Low delta-T syndrome** — the plant stages on a chiller nobody needs; the decoupler is the diagnostic.
2. **A pinched approach nobody watched** — fouling beyond the rating's allowance, silently raising kW/ton with no alarm.
3. **A centrifugal asked to run below its floor** — surge, and a plant that cycles every night.
4. **The sequence of operations left as the vendor shipped it** — §5's "invisible and decisive".
5. **Condenser water held warm all year "to protect the machine"** — the part-load benefit thrown away.
6. **A refrigerant change treated as a fluid change** — A2L is a building change under ASHRAE 15 and the local code.
7. **No thermal ride-through for the chiller restart** — an uncovered window in exactly the event the facility was designed around.
8. **A tower run for water and judged on energy, or the reverse** — WUE and PUE move in opposite directions.

Developed by: LightAISolutions
