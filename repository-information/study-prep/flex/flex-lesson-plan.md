# Flex — Technology Lesson Plan

**Subject:** two joined subjects — the last hundred metres of electrical distribution (from the low-voltage switchboard to the plug on the back of a rack), and the contract-manufacturing model read as a procurement decision rather than as a business model.

**Baseline assumed:** high-school STEM plus whatever the reader has retained from the corpus's other power guides. Ohm's law, heat from resistance, and the idea that a breaker protects a circuit.

**What this plan deliberately does NOT repeat.** The corpus already covers the ground either side of this one:

- **Powell's guide** already teaches the medium-voltage room — what a switchgear lineup is, arc flash and arc-resistant construction, how a protection study is built from short-circuit through coordination to incident energy, and buying a power room as a factory-tested product. This plan starts **downstream of the low-voltage board**, where Powell's stops.
- **Rehlko's guide** already teaches single-line-diagram literacy, static UPS internals and paralleling switchgear. This plan begins **after** the UPS output.
- **Vicor's and Megmeet's guides** already teach the rack power chain and the 800 VDC transition. This plan does not re-teach either; its shelf module is about **telling three vendors apart** when all three build to one published reference, which is a different skill.
- **Delta's guide** already defines OEM, ODM and contract manufacturer and argues the climb from component to system — from the **vendor's** side. This plan takes the same subject from the **buyer's** side: what you sign, what you own, and how hard it is to leave. That is a genuinely different lesson with different conclusions.
- **LITEON's guide** already teaches design-win economics and the SMT line. This plan does not cover factory operations at all.

---

## Module 1 — The last hundred metres (60 min)

**Concepts:** switchboard; PDU; remote power panel; whip; withstand rating; ampacity and derating.

1. **Name the four objects.** A data-hall electrical drawing below the UPS is mostly these repeated: the switchboard (main breaker plus feeders, whose withstand rating sets what everything downstream may be), the PDU (breaks a feeder into branch circuits, historically with a transformer inside), the remote power panel (the PDU's distribution job without the transformer, out on the floor near the racks), and the whip (the flexible final connection).
2. **Why this tier gets its own module.** Establish the count: a hall with three thousand racks on two feeds each has six thousand terminations in the final tier alone, every one made by hand. No upstream redundancy protects a rack from a bad crimp on its own whip. This is the single most transferable fact in the plan.
3. **The redundancy-tracing skill.** Two feeds are redundant only if they stay separate back to two sources. Drill it: on any drawing, follow both feeds upward until they either reach different transformers or meet. **Where they meet is the real boundary**, and it is often not where the tenant was told it was.
4. **Ampacity is not a fixed number.** It falls with bundling, ambient temperature and continuous duty — and data-hall load is always continuous, hence the 80% convention. A hall specified without derating runs out of usable amps before it runs out of nameplate.

**Check for understanding:** given a one-line showing A and B feeds to every rack, state what additional information you need before calling the hall redundant.

---

## Module 2 — Busway or conduit (45 min)

**Concepts:** busway; tap-off box; the shared-asset trade; the coordination re-check.

1. Present it as one decision made before the tenant is known, which sets how expensive it is to change the hall later.
2. **Busway:** reconfigurable (a tap-off box, not a cable pull), dense (a 6300 A bar against the equivalent conduit bank), fewer terminations per kilowatt, metering at the connection. Against: a shared asset, higher cost per metre, fixed ratings, and long lead times.
3. **Panels and whips:** cheap, familiar, genuinely independent circuits, capacity added incrementally, commodity lead times. Against: terminations scale with racks, bundled cables derate, reconfiguration means working in an occupied hall.
4. **Land the framing:** the argument is about **change**, not efficiency. Losses are comparable; what differs is what it costs to move a rack. A hall for one known tenant at fixed density is well served by panels; a hall that will be re-tenanted at rising density is what busway was invented for.
5. **The trap created by the advantage:** a tap-off box added in an afternoon is a load added without a coordination re-check. Nothing fails on the day.

---

## Module 3 — Buying the whole power train from one firm (60 min)

**Concepts:** interfaces as the unit of risk; factory test; optionality; counterparty concentration.

1. **What integration buys is the elimination of interfaces.** Every seam between two vendors is a place a specification can be read two ways, a date can slip independently, and a fault can be blamed in both directions. This is a schedule argument, not an engineering-quality argument, and it should be taught as one.
2. **Prefabrication is the mechanism.** A factory-built power skid or pod moves wiring, testing and inspection into a shop where they are repeatable. The claim that this cuts deployment from twelve-plus months to six-to-twelve is a claim about moving work indoors.
3. **The single integrated test** is the second real benefit: integration faults found in a factory rather than during commissioning, which is the most expensive place to find anything.
4. **What it costs.** No benchmark on any individual item; no swap without unpicking the design; lead times become a single point of failure rather than six independent ones; and the service relationship, spares, firmware and institutional memory all concentrate in one counterparty.
5. **The middle path** most sophisticated buyers take: integrate where the interfaces are genuinely painful and the thing is genuinely a system; keep competitive tension on commodities with published ratings. Then write a defined scope boundary, an agreed test, and a named party responsible for anything crossing it.

---

## Module 4 — The contract that is actually being signed (60 min)

**Concepts:** CM consignment; CM turnkey; JDM; ODM; tooling ownership; design authority; BOM visibility; should-cost.

1. Teach the four arrangements as a **spectrum of design ownership**, not as a menu, and make the reader place a real quote on it.
2. **Three questions settle everything**, and they should be drilled until automatic:
   - Who is named as the owner of the **tooling**? (Decides how fast production can move.)
   - Who holds **design authority** — who approves a component substitution? (If not the buyer, the buyer discovers changes rather than authorising them.)
   - Can the buyer see the **BOM at line-item cost**? (If not, no should-cost analysis is possible and every negotiation is about one number.)
3. **Where disputes actually live:** the JDM row, because shared design ownership is a legal problem before it is an engineering one.
4. Connect to Module 6: the substituted-component failure is a design-authority failure, not a component failure.

---

## Module 5 — Reading a third-party power shelf (45 min)

**Concepts:** tier location; the four comparable numbers; the questions the datasheet does not answer.

1. **Locate the vendor on the chain first.** Silicon sells to components; components sell into systems; a vendor competes only within its own tier. Being named in a platform's ecosystem alongside another company establishes each party's relationship to the **platform owner**, not to each other. This is the most commonly made error in the sector and it deserves its own five minutes.
2. **The four comparable numbers:** efficiency **and at what load** (a redundant shelf lives near half load, so a half-load figure is the honest one); hold-up time in milliseconds at full load; power per rack unit; and input flexibility.
3. **The questions the datasheet does not answer:** whose silicon is inside and is it single-sourced; can it be serviced live and what happens electrically when a unit leaves a shared bus; is the management interface open or private; and where is it built.
4. **Land the conclusion:** at the shelf level the products converge because the platform owner specified them. What survives as differentiation is the silicon, the serviceability, the manufacturing location, and how much of the rest of the chain comes with it.

---

## Module 6 — Where it fails (45 min)

Corpus failure-map rows 7, 8 and 14 written at this tier, plus the failures that belong to the contract rather than the copper: a tap-off box added without a coordination re-check; termination quality at scale; A and B feeds that meet upstream; ampacity taken from the table rather than the installation; commissioning that proved the parts and not the system; tooling the buyer does not own; a component substituted under someone else's design authority; and a supplier that becomes a different company.

**Spend the most time on the last three**, because they are the ones no electrical drawing can show and the ones this plan exists to add to the corpus.

---

## Module 7 — Who buys, who competes (30 min)

Three buyer types that behave differently (hyperscalers who wrote the specification, colocation operators who value reconfigurability and lead time, enterprises who buy through a contractor). Three published tiers that do not line up with corporate boundaries — everyone is climbing toward the middle, which is where the AI build-out put the money.

**Three signals to watch instead of announcements:** whether a vendor is named by the platform owner or only by itself; what it paid, since a purchase price is a fair proxy for whether it bought a market position or a technology; and whether it keeps a business or separates it, since a separation is usually a truer statement about two businesses' different growth rates and natural owners than anything in the original pitch.

**Close with the caution:** almost none of this market is measured. Researchers publish leader groups and other-player categories rather than percentages; circulating figures often disagree or cannot be found at the source they are attributed to. Treat every share figure as attributed, and treat absence from a league table as weak evidence.

---

## Suggested pacing

About five and a half hours. Modules 1–2 together (they are one subject). Modules 3–4 together — they are the procurement half and they reinforce each other. Modules 5–7 in a third sitting.

Developed by: LightAISolutions
