# EO 14420 — Declaring a National Emergency to Secure the United States Bulk-Power System

**Source:** Executive Order 14420, signed 2026-08-26 · The White House, *Presidential Actions*
**Archived:** `sources/eo14420-bulk-power-system-2026-08.html` (full page) and `.txt` (extracted text)
**Authorities:** IEEPA (50 U.S.C. 1701 et seq.), National Emergencies Act (50 U.S.C. 1601 et seq.), 3 U.S.C. 301
**Analysis written:** 2026-09-01 · **Module:** `eo14420-bulk-power-2026-08` (lane: Market Access & Bankability)

> **Why this document, and why it was nearly missed.** It reached the desk through trade coverage days after signing, and only partially. The Scraper roster was entirely secondary — thirty outlets reporting *on* government action, none reading it. This is the class of story where the primary text beats the coverage, because the operative detail sits in the definitions section that trade pieces summarise away. The federal-source roster added in the same commit exists because of this document.

---

## 1. What the order actually is

A national emergency declared under IEEPA over **foreign supply of bulk-power system electric equipment**. It is not a tariff, not a tax rule, and not a procurement preference — it is an authority to **prohibit transactions** and, separately, to **impose conditions on equipment already installed**.

The order is self-executing only in part. Section 2(a) is a live prohibition from the signing date, but it bites only on transactions the Secretary of Energy has *determined* meet the risk tests. The machinery that turns it into day-to-day compliance — the rules, the covered-entity designations, the pre-qualified vendor list — is delegated and dated.

## 2. Executive read

Three things matter for anyone selling into US grid or data-center power.

**First, battery storage is named equipment.** §5(b) enumerates in-scope equipment, and the list includes **battery energy storage systems**, **utility-scale and other grid-connected inverters**, and **uninterruptible power supply systems supporting critical infrastructure**. This is not an inference from "grid equipment" — BESS and inverters are on the face of the definition. It also reaches **generation turbines**, **substation transformers**, **industrial control systems** (RTUs, PLCs, IEDs), **distributed control systems**, **protective relaying** and **high-voltage circuit breakers**.

**Second, the scope follows the software, not just the box.** The same subsection extends consideration to "associated software and firmware, remote access capabilities, lifecycle maintenance and update mechanisms, and other supply chain dependencies." A domestically assembled unit with foreign firmware and a vendor remote-support tunnel is inside the question, not outside it.

**Third, it reaches backwards.** §2(a) restricts transactions *initiated after* 2026-08-26. But §2(b) lets the Secretary impose conditions on equipment **acquired or installed before** that date — up to and including "disconnect, replace, or remove." That is the provision with balance-sheet consequences for existing fleets, and it is the one most often dropped from summaries.

## 3. The dated gates

| Gate | Deadline | What happens |
|---|---|---|
| §2(a) prohibition | **In force 2026-08-26** | Applies to transactions initiated after this date, on determination |
| §3(b) implementing rules | **2026-12-24** (120 days) | DOE publishes rules/regulations; may designate Covered Foreign Entities and license transactions |
| §4(a) FAR recommendations | **2027-02-22** (180 days) | DOE recommends FAR revisions prioritising US-manufactured energy infrastructure |
| §4(b) FAR Council | **2027-05-23** (+90 days) | FAR Council *considers* proposing amendments for notice and comment |
| §3(c) equipment identification | "As soon as practicable" | Identify at-risk installed equipment; recommend inventory / isolate / monitor / replace |

The **2026-12-24** rules deadline is the module's nearest real gate and the date its content should be re-verified against. Note the asymmetry: §4(b) obliges the FAR Council only to *consider* proposing — it is not a commitment to a rule.

## 4. The definitions that decide scope

**"Bulk-power system"** (§5(a)) — transmission facilities and control systems, plus generation needed for reliability. Explicitly **includes transmission rated at 69 kV or above** and explicitly **excludes facilities used in local distribution**. The 69 kV line is the single most useful scoping fact in the order: it is what separates a covered substation asset from distribution-side equipment.

**"Foreign-produced"** (§5(c)) — "not manufactured, produced, or assembled in the United States." Note *assembled*: US final assembly of foreign content is, on the text, outside this particular definition. This is a materially different test from the tax-side domestic-content rules, and conflating the two is the predictable error.

**"Covered Foreign Entity"** (§5(e)) — two routes. A country or person owned by, controlled by, or subject to the jurisdiction or direction of a government that is (i) subject to a US arms embargo or sanctions regime under the International Traffic in Arms Regulations, or (ii) determined by the Secretary — with the Secretary of War, DNI and APNSA — to be engaged in conduct detrimental to US national security or foreign policy. **Route (ii) is discretionary and undated**, which is where the real uncertainty sits: the covered set can grow by determination, without notice-and-comment.

**"Person"** and **"United States person"** (§5(f), (h)) are broad — including foreign branches of US-organised entities.

## 5. What it means for suppliers and buyers

*Guidance to supplier and buyer groups, per the module content-scope rule — no single-company analysis.*

**BESS suppliers and integrators.** Storage is named equipment. The exposure is not only cell origin: it is the enclosure, the PCS/inverter, the BMS firmware, and the remote-diagnostics channel. Expect buyers to begin asking for a supply-chain and remote-access map well before the December rules, because the §2(b) retrofit power makes an installed fleet a live question rather than a closed sale.

**Inverter and PCS suppliers.** "Utility-scale and other grid-connected inverters" is explicit. The firmware and update-mechanism language means a supplier's OTA update path is part of the assessed risk surface.

**Data-center developers and hyperscalers.** UPS supporting critical infrastructure is named, as are generation turbines and the ICS/DCS layer. On-site generation and the switchgear behind it are inside the frame where they touch the bulk-power system; behind-the-meter distribution-side equipment is, on the 69 kV line, generally outside it.

**All groups — the asymmetric opportunity.** §2(e) authorises the Secretary to publish a list of **pre-qualified equipment and vendors** exempt from the §2(a) prohibition. A published pre-qualification list is a procurement moat: suppliers positioned to qualify early convert a compliance burden into a shortlist position. Nothing in the order commits to a timeline for it.

## 6. What the order does NOT say

- It **names no companies and no countries.** Every designation is delegated.
- It sets **no tariff and no duty rate**. This is not a trade-remedy instrument.
- It does not create private rights — §7(c) is explicit that it is unenforceable by any party against the United States.
- It does **not** state that pre-2026-08-26 equipment must be removed. §2(b) is an authority to impose conditions, exercisable after weighing reliability, safety, replacement availability and continuity of service, and it expressly permits phased compliance.
- It gives **no deadline for the pre-qualified vendor list** and no criteria for it.
- It does not address the tax-side FEOC/PFE rules at all. Different statute, different test, different dates — see the China policy-stack module.

## 7. Claims ledger

| Claim | Source |
|---|---|
| Signed 2026-08-26; EO 14420; IEEPA + NEA + 3 U.S.C. 301 | Order preamble and dateline |
| BESS, grid-connected inverters, UPS for critical infrastructure named as in-scope equipment | §5(b) |
| Scope extends to associated software, firmware, remote access, lifecycle update mechanisms | §5(b), final sentence |
| Bulk-power system includes ≥69 kV transmission; excludes local distribution | §5(a) |
| "Foreign-produced" = not manufactured, produced, **or assembled** in the US | §5(c) |
| Covered Foreign Entity: ITAR arms-embargo/sanctions route, or Secretary determination | §5(e) |
| Prohibition applies to transactions initiated after the order date | §2(a) |
| Authority over equipment acquired/installed **before** the order, incl. disconnect/replace/remove | §2(b) |
| Reliability, safety, replacement availability and continuity weighed before removal; phased compliance permitted | §2(b) |
| Pre-qualified equipment and vendor list authorised | §2(e) |
| Implementing rules within 120 days → 2026-12-24 | §3(b) |
| FAR revision recommendations within 180 days → 2027-02-22 | §4(a) |
| FAR Council considers proposing within 90 days of receipt → 2027-05-23 | §4(b) |
| Reports to Congress under NEA §401 and IEEPA §204(c) | §6(a) |
| No private right of action | §7(c) |

Developed by: LightAISolutions
