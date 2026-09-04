# CoolIT Systems — Technology Lesson Plan

**Purpose:** teach **the coolant distribution unit as a machine** — what is physically inside it (plate heat exchanger, redundant pumps, filters, reservoir and expansion tank, fill pumps, sensors, a controller, ride-through power), the two loops it keeps apart and why they have opposite requirements, the approach temperature as the one datasheet number that decides whether the chiller plant needs compressors, ASHRAE's W-classes as the language racks and plants use to agree a water temperature, how flow and pressure are shared across a row and why warm water costs pumping head, what is actually in the coolant and how it goes bad, why microns of filtration decide uptime, the three places a CDU can stand and the fault domain each one buys, and the specific failure modes — connection, condensation, loss of flow, fouling — that take a liquid-cooled rack down. CoolIT is the worked example because its published sheets carry the numbers (2,000 kW at 5 °C ATD; 2,125 LPM at 35 psi; 25 µm; N+N) and because its position — cold plates sold to server makers, CDUs and piping sold to operators — shows how liquid cooling is bought.

**How this plan relates to what you already have.** The **Vertiv plan** names the CDU as liquid cooling's central appliance and teaches the chip-to-atmosphere temperature budget; the **Trane plan** teaches the chiller, the tower and why warmer water is the cheapest lever. This plan opens the box between them and repeats neither: it references the temperature budget and the chiller only to show where the CDU's approach sits inside them. The **Schneider** and **Eaton** plans own the electrical room; the operator plans (Aligned, QTS, Switch) own the hall as a whole. Nothing here teaches the chiller cycle, the cooling tower or the UPS.

**Three ideas carry the plan.** A CDU is a boundary, and every part in it exists to move heat across that boundary while letting nothing else cross. Every capacity rating hides an approach temperature, and the approach is the one stage of the temperature budget the buyer chooses with a purchase order. And in liquid cooling the slow failures — chemistry, filtration, balancing — are the ones nobody owns after handover.

**One boundary, held throughout.** CoolIT publishes no revenue; the only figures are its acquirer's (about USD 550m of sales in the twelve months after March 2026). It was owned by KKR and Mubadala from May 2023 to July 2026 and is now an Ecolab subsidiary; its patent disputes with Asetek ended in summary judgment and settlement in 2022, not a jury verdict. The plan works from datasheets, brochures, standards bodies (ASHRAE, OCP), a server maker's fluid guidance (Dell) and court records, and says so where the record stops — the rating of the CHx750, the coolant-inlet guidance NVIDIA does not publish, the kilowatts of the CDU launching on 28 September 2026.

**Suggested pacing:** Module 1 in one sitting (~35 min). Module 2 with a CDU datasheet open (~40 min) — it is the one that pays. Module 3 (~30 min). Module 4 (~30 min). Module 5 (~25 min). Then flashcards and self-test in the app.

## Module 1 — Open the box: what a CDU is made of, and the two loops it separates

**The single idea:** every component answers one of five jobs — isolate, hold temperature, hold pressure, deliver flow, keep the fluid clean.

**The parts.** A plate heat exchanger (or, in liquid-to-air units, a radiator and fan array) is the boundary itself. Pumps in N+N or N+1 give the clean loop its pressure and flow — "1500 LPM at 34 psi for single pump operation" means either pump alone carries the duty. Filters at 25 or 50 µm protect microchannels; a reservoir, expansion tank and fill pumps keep the sealed loop full as it warms, cools and is serviced; sensors for flow, pressure, temperature, humidity, level and leak feed a PLC that speaks Redfish and SNMP to IT and Modbus and BACnet to the building; an ultracapacitor and optional ATS keep the pumps turning through a power transfer.

**The two loops.** The technology cooling system is small, sealed, filtered and chemically treated, owned by the IT side, and touches the silicon. The facility water system is the plant's water — large, plant-grade, at whatever temperature the day allows. They meet only at the exchanger's plates; the CDU's job is that they never meet anywhere else.

**Self-check:** a sheet lists exchanger, pumps, filters, sensors and controller but no expansion tank or fill pumps. Who is topping up the loop? *(A technician, by hand, every time the fluid temperature swings or a hose is changed.)*

## Module 2 — Approach temperature, W-classes, and reading the datasheet

**The single idea:** a capacity figure without its approach is a headline, not a rating.

**The number.** The approach is how much warmer the coolant leaving for the racks is than the facility water arriving. CoolIT rates liquid-to-liquid units at 5 °C ATD and liquid-to-air at 15 °C. Work backwards from the rack: a W45 rack minus a 5 °C approach permits 40 °C plant water, which a dry cooler can make without compressors most of the year; minus 15 °C it needs 30 °C water, which means chillers. Ten degrees of approach is the difference between a plant with chillers and one without.

**The classes.** Since the fifth edition the W-number is the maximum supply temperature in °C: W17, W27, W32, W40, W45, W+. CoolIT's in-rack units accept "W17 to W+"; the CHx1500 is "compatible with ASHRAE W+"; Lenovo publishes its GB300 rack as W45.

**The sheet, line by line.** Capacity at approach; flow at pressure (single-pump or both?); racks per CDU (whose arithmetic, under what conditions — the AHx240's count fell from four GB200 racks to two GB300 racks as the rack grew); power consumption; redundancy (pump versus unit); filtration; footprint and kW/m²; interfaces and wetted materials; protocols and group control; ride-through; test regime (100% PG25 leak test, 6 MW witness rig); service coverage.

**Self-check:** the same unit is quoted at "2269 kW cooling load" and "2000 kW at 5°C ATD". Which is comparable across vendors? *(The one that states its approach.)*

## Module 3 — Flow, pressure and balancing across a row

**The single idea:** the pump pays for every restriction, and coolant takes the easiest path.

**Litres per kilowatt.** Ratings assume 1.2 LPM/kW; the selection guide says 1.5 is typical for AI systems. A 120 kW rack at 1.2 LPM/kW needs about 144 LPM, so a unit rated 2,125 LPM at 35 psi has the flow for twelve — the "12 x GB300 NVL72 racks per CDU" claim.

**Pressure drop.** Manifolds, quick disconnects, hoses and above all the cold plates' microchannels each take pressure; the pumps must supply the total at design flow or the far rack starves. OCP: pressure drop across 1" lines "can be over five times higher than 2" lines". Glycol reduces the water's heat capacity by up to ten percent and costs flow too.

**Warm water costs head.** Lenovo's GB300 table: 25 °C water needs 59 LPM at 2.3 psi; 45 °C needs 177 LPM at 18.4 psi. The chiller saving in the Trane plan is paid for here in pump energy and pipe size.

**Balancing and groups.** Balancing valves or orifices at each manifold, reverse-return piping, a pump held to a differential-pressure setpoint; and up to 20 CDUs on one header under group control, which is where "six nines" comes from — and where unit redundancy (a partner on the header) differs from pump redundancy (N+N inside one box).

**Self-check:** a row moves from 1" to 2" branch lines. What changes at the CDU? *(About a fifth of the branch pressure drop — smaller pumps, less energy, or more racks — for more metal in the row.)*

## Module 4 — What is in the loop: chemistry, filtration and cleanliness

**The single idea:** the slow failures are chemical and particulate, and after handover nobody owns them.

**PG25.** Inhibited propylene glycol at 25 percent by volume in deionised water: protects to about −10 °C, carries the inhibitor package (tolyltriazole for copper, silicates for aluminium), and is the least concentration that suppresses microbial growth. Inhibitors deplete; top-ups with plain water dilute everything. Dell's calendar: quarterly pH (8–10.5) and refractometer checks, an annual laboratory analysis of inhibitors, hardness, chloride, sulfate, degradation acids and dissolved metals. Velocity above about 1.5 m/s erodes copper; dissimilar metals in one fluid set up galvanic corrosion — the reason for matched wetted materials and for polypropylene piping.

**Filtration.** 25 µm inline in the CDU plus a sidestream polisher below 5 µm (OCP), and 1 µm during fill. A single particle can block a microchannel and the plate behind it runs hot with nothing to see.

**Built clean.** Pipe dope and tape are prohibited in TCS systems; stainless modules are passivated and pickled off-site, polypropylene is fused on-site by certified technicians, every manifold and quick disconnect is leak-tested before shipment. Prefabrication moves the dirty work out of the hall.

**Self-check:** the refractometer reads 18 percent glycol after a year of topping up. Which protection has not weakened? *(None of the three — freeze, microbial and inhibitor protection all fell; only the fluid's heat capacity rose slightly.)*

## Module 5 — Where the CDU stands, how a rack goes down, and how liquid cooling is bought

**The single idea:** position sets the fault domain; the buying process has two doors.

**Three positions.** In the rack (80–200 kW in 4U; the fault domain is one rack; rack space and a pump per rack are the cost). In the row (1.5–2 MW in one cabinet feeding up to twelve racks; the fault domain is the row unless a partner shares the header). At the facility (skids in a corridor; nothing but pipes on the floor; the longest planning lead). Liquid-to-air units stand in the row without water, at a 15 °C approach, and hand the heat to the room's air system.

**Failure modes.** OCP's three water risks — pipe, connection, condensation — with human error the most cited cause and pump-failure procedures the most important preparation. Dry-break quick disconnects at every server; supply held above the dew point; leak-detection traces around each cold plate, cable along the manifolds, level sensors on the reservoir. Loss of flow is the fast failure (a stopped pump with no partner, a power transfer without ride-through, a closed valve); fouling is the slow one; erosion and corrosion the long one.

**Two channels.** Cold plates and loops go to server OEMs and ODMs as design wins per platform generation, specified from the platform owner's recommended-vendor list — and lost when an OEM designs in-house (Lenovo, Supermicro). CDUs, manifolds and TCS piping go to operators and their contractors as hall equipment, proven on a factory witness rig before shipment and serviced in the field. The vendor's strategy — and its new parent's — is to own the second door and the fluid that flows through it.

**Self-check:** a hall has 1 MW of spare air-cooling capacity. How much liquid-cooled IT can liquid-to-air CDUs add? *(Less than 1 MW — rack heat plus the CDUs' own fan power all lands on the air system.)*

Developed by: LightAISolutions
