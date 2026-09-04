# Mitsubishi Power — Technology Lesson Plan

**Subject:** the heavy-duty gas turbine as a machine and as a purchase — why firing temperature is the whole game, why grid frequency fixes frame size, what hydrogen co-firing actually delivers, why an efficient plant is a bad follower, and how to read the third OEM against the two the corpus already covers.

**Baseline assumed:** high-school STEM. Heat engines, the idea that a compressor consumes work, and that metals soften when hot.

**What this plan deliberately does NOT repeat.**

- **Kiewit's guide** already teaches *what a combined-cycle plant is* (two heat engines on one fuel, ~60% efficiency, heat rate, merit order) and *the turbine queue* (three OEMs, slots sold out years ahead, reservations as strategic assets). This plan assumes both. It does not re-explain combined cycle and it does not re-argue that the queue exists.
- **GE Vernova's guide** teaches the power-OEM business model, the installed-base flywheel and generator physics. Not repeated. This plan is about what distinguishes one frame from another, which that guide does not cover.
- **Wärtsilä's and the gen-set guides** teach engines as balancing plant. This plan touches that only at the point where it explains why a turbine is the base and not the buffer.
- **Bloom Energy's guide** compares fuel cells, engines and turbines as three ways to eat the same gas. Not repeated.
- Crucially, this plan does **not** teach "the category" — the brief for it is explicit that GE Vernova and Siemens Energy are already covered, so the third OEM is taught as a **comparison**, not as an introduction.

---

## Module 1 — Half the output never leaves the machine (60 min)

1. **The Brayton cycle in four steps** on one shaft: compress, burn, expand, exhaust. Then the fact that governs everything: **the compressor consumes roughly half of what the turbine produces.** Useful output is a difference between two much larger numbers.
2. **Why that makes turbines hypersensitive.** A one-percent change in compressor efficiency moves net output by roughly two, because the loss comes out of the small remainder. Fouled blades, a dirty filter and a hot day all attack the same margin.
3. **The two efficiency levers:** pressure ratio and firing temperature. Raising pressure ratio costs compressor stages — which is why turbines grow rather than simply improve. Raising temperature costs metallurgy, which is Module 2.
4. **The exhaust is worth about as much as the shaft.** Roughly 600°C, and in simple cycle all of it goes up the stack — which is why simple cycle converts only a third to two-fifths of the fuel. What a manufacturer does with that exhaust is a separate purchase.

---

## Module 2 — Firing temperature: buying efficiency with metallurgy (75 min)

The module that explains why classes are lettered and why a class step takes a decade.

1. **Firing temperature** is the gas temperature where it first meets the blades, and efficiency tracks it more closely than anything else. Current frontier: the 1,600°C and 1,650°C classes. The problem is immediate — the nickel superalloys melt several hundred degrees below that.
2. **Three stacked techniques, each with a cost.**
   - **Single-crystal blades.** Grain boundaries are where hot metal under load creeps apart; casting a blade as one crystal removes them, buying perhaps fifty degrees. Cost: a slow, expensive, low-yield casting process — and one of the real reasons capacity cannot be scaled by adding a shift.
   - **Thermal barrier coatings.** A ceramic layer holding a gradient so the metal runs a couple of hundred degrees cooler than the gas. It is what allows gas above the metal's melting point at all, and it is consumable — much of what an overhaul inspects.
   - **Turbine cooling air**, the expensive one. Air bled from the compressor through hollow blades. That air was compressed at full cost and bypassed the combustor, so it does no work. **A class step is only real if the temperature gain outruns the cooling-air penalty.**
3. **Why this shapes the industry.** A class step is a validated combination of casting, coating, cooling and combustion, proven at full scale over years. That is why the three who can do it are the three who do, why their efficiency claims sit within a point of each other, and why competition is decided by slots and service rather than by a technical lead.

---

## Module 3 — Why 50 Hz machines are bigger (45 min)

A short module with a large payoff, because it explains an entire product-line structure.

1. A large turbine drives its generator **directly** — no gearbox is practical at that torque.
2. A two-pole generator must turn at **3,000 rpm on 50 Hz and 3,600 rpm on 60 Hz**. So the grid fixes the shaft speed of the largest machine on the system.
3. Blade tip speed is rotational speed times radius, and tip speed is limited by centrifugal stress. **Turn more slowly and you can afford a longer blade.**
4. Output scales with air mass swallowed, so the 50 Hz frame of a given class is a scaled-up version of the 60 Hz one — commonly on the order of forty percent more power at broadly similar efficiency. **That is a scaling consequence, not a better product.**
5. The reading skill: find the frequency before the output. Japan is the instructive case — its grid is split 50 Hz east and 60 Hz west, so a Japanese manufacturer must build and validate both families for its home market.

---

## Module 4 — Simple or combined, and reading a rating (60 min)

1. **Simple against combined from the equipment side** — not repeating Kiewit's explanation of what combined cycle *is*, but treating it as a purchase: what the HRSG, steam turbine, condenser, water treatment and cooling add in cost, footprint, water and construction time, against what the bottoming Rankine cycle adds in output for no extra fuel. Land the practical point: **the decision is usually made by the calendar, not the economics.**
2. **ISO conditions** — 15°C, sea level, 60% RH, no inlet or exhaust loss — and every correction between there and a site rating: ambient temperature (roughly half a percent of output per degree C, because a fixed swept volume of hotter air carries less mass), altitude, inlet and exhaust pressure loss, degradation with hours, and the gross-to-net step.
3. **Inlet air cooling** as a product line that exists because the hot-day derate coincides with peak demand.
4. Contrast explicitly with the reciprocating-engine derating already taught elsewhere: same idea, larger corrections, and worst exactly when it is least affordable.

---

## Module 5 — Hydrogen: the percentage does not mean what it looks like (60 min)

The most important module in the plan, because the error it corrects is everywhere.

1. **Volume percent is not energy percent and not carbon percent.** Hydrogen carries roughly a third of methane's energy per unit volume. So 30% by volume is about a ninth to a tenth of the energy — and about that much carbon reduction.
2. **Check it against two independent published figures.** Independent analysis puts a 30 vol% blend at about a 12% carbon reduction; a manufacturer's own 50 vol% demonstration on a utility unit reported about 22%. Both agree with the arithmetic. Have the reader do the calculation themselves and confirm it.
3. **Why the combustor is the hard part.** Dry low-NOx combustors premix fuel and air so the flame burns lean and cool without water or steam injection. A lean premixed flame lives in a narrow window — blow-out on one side, flashback on the other. Hydrogen's flame speed is several times methane's, so it pushes the flame toward travelling back up the burner into hardware never designed to hold one. Hydrogen also burns hotter, pushing NOx back up.
4. **The honest reading of a hydrogen-capable claim is a question, not a number:** what percentage, by volume or energy, at what NOx, with what combustor, demonstrated at what scale and duration, requiring what modification when the fuel arrives.
5. **And the option's value is policy-sensitive in both directions.** Where a rule requires a decarbonisation pathway, hydrogen readiness is a compliance asset. Where the rule is withdrawn, it becomes discretionary. The capability does not change when the rule does; the price a buyer will pay for it does.

---

## Module 6 — The follower problem (45 min)

1. **Efficiency is a full-load property.** Backing off costs disproportionately: the compressor still turns at full speed and takes its share while useful output falls. Inlet guide vanes recover some, but there is a **minimum stable load** below which the lean premixed flame cannot be held.
2. **In combined cycle the penalty compounds** — less exhaust at lower temperature means the bottoming cycle, the part that made the plant efficient, falls fastest.
3. **Starting is thermal, not control.** Thick steam-turbine casings must be reheated slowly; hence hot, warm and cold start times differing substantially.
4. **Every start is maintenance.** Overhaul intervals count equivalent operating hours, and a start counts for many hours of steady running because of thermal cycling. Dispatch pattern changes service cost, not just fuel cost.
5. **So the on-site answer is plural.** A load swinging tens of megawatts in milliseconds is absorbed by stored energy first, smoothed by fast machines second, with the large efficient plant supplying the average underneath. **The efficient machine is the base; it is not the buffer.**

---

## Module 7 — The third OEM, read against the other two (60 min)

Teach the comparison, not the category. Axes, with the sourced numbers:

| Axis | What separates them |
|---|---|
| Order book | GE Vernova 116 GW under contract, Siemens Energy 95 GW, Mitsubishi 35 GW large-frame across 80 units — but the first two include slot reservations and the third does not split them out, and no source normalises them |
| Customer mix | GE Vernova ~20% data centers; Siemens Energy 22 GW tied to data centers; Mitsubishi described as focused on core utility customers |
| Efficiency | All three around 64% combined cycle — effectively a tie, therefore not a decision variable |
| Validation | Mitsubishi's grid-connected validation plant, 8,000 hours before release, is the strongest published claim of the three |
| Hydrogen | Deepest published operating record on hydrogen-containing fuels — set against Module 5's arithmetic about what a blend actually buys |
| Storage | Mitsubishi exited utility-scale batteries in 2026, narrowing the behind-the-meter offer relative to gen-set OEMs that kept theirs |
| Capacity | Industry orders far exceed manufacturing capacity; note the gap between a company's own stated 30% capacity path and trade press describing a doubling |

**The skill being built:** the ability to say, unprompted and without overclaiming, where a third-place supplier is genuinely differentiated (validation discipline, hydrogen operating hours, utility relationships) and where it is not (efficiency, order book, storage).

---

## Module 8 — Where it fails (30 min)

Failure-map row 4. A turbine specified at ISO and installed hot and high; a plant bought for efficiency and dispatched as a follower; a hydrogen percentage read as a carbon percentage; the air permit lagging the shell; a slot reservation that slips or was never firm; and fuel supply treated as a commodity rather than as infrastructure.

---

## Suggested pacing

| Session | Modules | Time |
|---|---|---|
| 1 | 1 and 2 | ~2h 15m |
| 2 | 3 and 4 | ~1h 45m |
| 3 | 5 and 6 | ~1h 45m |
| 4 | 7 and 8 | ~1h 30m |

If only one session is available, do Module 5 and Module 7. The hydrogen arithmetic is the error most likely to appear in a customer conversation, and the three-way comparison is the thing the corpus could not previously supply.

Developed by: LightAISolutions
