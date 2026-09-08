# AMD — Technology Lesson Plan

**Subject:** the technology under AMD's data-centre products — accelerator silicon, memory, packaging, rack-scale systems and the software layer that decides whether any of it is substitutable.
**Baseline assumed:** high-school physics and mathematics. No prior semiconductor knowledge.
**Total:** seven modules, about 5 hours 45 minutes with exercises.
**Not covered here:** AMD's corporate history, executives, financial results or share price. Those belong in the dossier, not in a technology curriculum.

**Where this sits against other plans in this directory.** `flex/` covers electrical distribution from the switchboard to the rack inlet and what contract manufacturing is. `vertiv/` and `delta-electronics/` cover the thermal and conversion plant. `supermicro/` covers rack integration and the cooling chain from the cold plate outward. This plan runs from the transistor to the rack door and stops there deliberately — it is the *load*, and the other plans are what feeds and cools it.

---

## Module 1 — Why this arithmetic wanted a different processor (50 min)

**Objective:** understand why neural-network work suits a wide, simple, parallel processor and why that choice has thermal consequences.

- What a conventional processor optimises for: a few complicated dependent steps, executed fast, with much of the silicon spent predicting what comes next.
- What a neural network is arithmetically: overwhelmingly one operation — multiply and accumulate — over values that do not depend on one another. Nothing waits.
- Why that maps onto a graphics processor: thousands of simple units running one instruction across many data values. The historical accident, and why the name survives the change of purpose.
- The vocabulary: accelerator, and the distinction between merchant accelerators and silicon a cloud operator designs for itself.
- **The thermal consequence, introduced here and used for the rest of the plan:** keeping thousands of units busy converts nearly all drawn power into heat in a very small volume. Density is the through-line.

*Exercise:* given a workload description, decide whether it is latency-bound and dependent (a CPU shape) or throughput-bound and independent (an accelerator shape). Five short cases including one deliberately ambiguous.

---

## Module 2 — The memory wall (55 min)

**Objective:** be able to explain why arithmetic throughput is usually *not* what limits an AI machine.

- The parameter-reading problem: producing one token requires reading a large fraction of the model's parameters out of memory.
- Why arithmetic units idle: they finish before memory delivers the next batch. Bandwidth, not FLOPS, sets achieved speed for most real work.
- High-bandwidth memory: vertical stacking, in-package placement, a link thousands of wires wide. Why short distance plus great width buys bandwidth.
- **Capacity against bandwidth** — the distinction that is most often muddled. Capacity decides what fits on one chip; bandwidth decides how fast it runs. Worked numerically.
- Why memory drove packaging into the critical path, and why packaging capacity — not wafer capacity — has repeatedly rationed supply.

*Exercise:* two accelerators, same peak arithmetic, different memory capacity and bandwidth. Predict which wins on (a) a model that just fits on both, (b) a model that fits on only one, (c) a small model at very high request volume. Justify each.

---

## Module 3 — Precision as an engineering lever (45 min)

**Objective:** never again read a performance figure without asking which format it is in.

- Bits per number, and what the number of bits costs in memory, bandwidth and throughput.
- The ladder: FP64 and FP32 for classical simulation; FP16 and BF16 as the training workhorse; FP8; FP4 at the current frontier. Roughly a doubling of throughput per halving of bits.
- Why neural networks tolerate this and physical simulation does not — and why national laboratories still buy on double-precision performance while AI buyers do not.
- Peak against achieved. Why a peak figure assumes an impossible utilisation, and the publicly conceded roughly-half-of-peak result on real rack tests.
- The comparison trap: two vendors can use different four-bit formats.

*Exercise:* take three published headline performance claims and normalise them — identify the format, identify whether it is peak or measured, and state what remains uncomparable after normalisation.

---

## Module 4 — Building a big chip out of small ones (55 min)

**Objective:** understand yield, chiplets, process nodes and why a fabless designer's ceiling is someone else's factory.

- Wafers, random defect distribution, and why yield falls as die area rises. The arithmetic that puts a ceiling on single-die size.
- Chiplets as the response: smaller pieces, each likely to be good, joined in one package. What that buys beyond yield — mixed process generations, and product families assembled from common pieces.
- What it costs: the pieces must communicate at nearly monolithic speed, which is an interconnect problem; and packaging becomes as demanding as fabrication.
- Process nodes: why the nanometre figure is a marketing label rather than a measurement, and what a newer node actually delivers.
- **Fabless and foundry.** Design without factories; capacity bought from a foundry. A design win and a supply win are different events — this is the module's key takeaway.
- Tape-out as the point of no return in a silicon schedule.

*Exercise:* given a defect density and two die sizes, compute approximate yields and the implied cost per good die; then explain in prose why the same design split into four chiplets changes the answer.

---

## Module 5 — Why the rack became the product (60 min)

**Objective:** derive rack-scale systems from physics rather than accepting them as a marketing category.

- Why a frontier model spans thousands of accelerators and why they must stay in step — the slowest sets the pace.
- Two distinct wiring problems: scale-up (memory-speed, coherent, copper, about one rack of reach) and scale-out (switched, optical, building-scale).
- **The derivation:** if the fastest link reaches about a rack, the largest coherent group is a rack; therefore sell the rack. Note that competing vendors independently converged on 72 accelerators per rack.
- What is inside one: accelerators, host processors, scale-up switching, network interfaces, coolant manifolds, power shelves — one object, not a shelf of servers.
- The electrical and thermal arithmetic: roughly 225–245 kW against five to fifteen for a conventional rack, and why that forces liquid cooling as physics rather than preference.
- Open specification against proprietary platform: what each choice does to the supplier ecosystem, and the specific observable difference — whether the platform owner publishes a qualified power-vendor roster or does not.

*Exercise:* size the problem. For a 240 kW rack, estimate the airflow that air cooling would require and show why it is impractical; then state what facility-water temperature would remove the need for a chiller.

---

## Module 6 — The software layer, and why it is the contest (55 min)

**Objective:** explain why two comparable chips are not substitutable, in terms a buyer would recognise.

- The stack from framework to driver, and why nobody programs the accelerator directly.
- What two decades of tuned libraries actually contain, and why the last twenty per cent is where the gap lives.
- Measured comparisons: near-parity on straightforward workloads, twenty to thirty per cent behind on large transformer training where tuned libraries have no equivalent.
- **The finding worth the whole module:** software reliability is bounded by test capacity. A team with an order of magnitude less hardware to test on cannot close a software gap by effort alone. A software problem that is really a capital-allocation problem.
- Composability as the specific failure mode: individual features working while their combination does not.
- What this means commercially — migration cost falls on the buyer, which is why share moves more slowly than hardware comparisons predict.

*Exercise:* write the evaluation checklist a buyer should use for a second-source accelerator. It should contain more software questions than hardware ones; justify the ordering.

---

## Module 7 — The map: who buys, who competes, and where the value sits (45 min)

**Objective:** place each product line on the chain and be able to state what decides the win at each rung.

- The chain from foundry to deployed cluster, and the distinct businesses along it.
- Mapping the portfolio: accelerators, rack-scale systems, host processors, networking silicon, software, client and embedded — and what each competes against.
- **The two-position reading:** an established position in the host-processor socket, a challenger position in the accelerator. Why any single verdict is wrong, and why the rack is the mechanism by which one might convert into the other.
- Buyers by type — frontier labs, hyperscalers, sovereign programmes, national laboratories, neoclouds — and what each optimises for.
- Where the buyer's constraint has moved: from chips available to power available. Performance per watt as the ceiling on what a site can ever contain.

*Exercise:* for each of five buyer types, rank the purchasing criteria and identify which product line the vendor should lead with. Defend one case where the answer differs from the obvious.

---

## Suggested pacing

| If you have | Do this |
|---|---|
| One hour | Modules 2 and 3. The memory wall and precision are the two ideas that make every published figure readable. |
| Half a day | Modules 1–5. Ends with the physical derivation of rack-scale systems, which is the concept the rest of the corpus leans on. |
| Two evenings | Evening one: Modules 1–4 (silicon and memory). Evening two: Modules 5–7 (systems, software, market). |
| Before a meeting on rack-scale AI | Module 5, then Module 6's exercise. Density and the software-migration question are what the room will actually argue about. |

Developed by: LightAISolutions
