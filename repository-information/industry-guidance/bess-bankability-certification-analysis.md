# Bankability & Certification for Grid-Scale BESS — Analysis & Study Source

**Provenance:** research synthesis, not a document ingest — compiled 2026-08-24 from ~50 primary and secondary sources (UL Solutions, NFPA/code analyses, CSA Group, FERC/NERC/ERCOT dockets, WECC's Moss Landing report, EPRI's failure database, DNV/CEA/BNEF methodology pages, insurer commentary, law-firm and IE publications). Feeds the in-app Industry Guidance module `bess-bankability-2026-08`, which lives in `googleAppsScripts/Classroom/Classroom.gs` below the `// CONTENT END` fence (it moved there from `Profiler.gs` at C3 session 3, v05.48r). Claims carry sources in the ledger; unverified items flagged. **The body below is the 2026-08-24 record; the 2026-09-13 quarterly re-verification section near the end carries every change since, and wins on any conflict.**

## What this is

A teaching document for Hithium's US sales team on the three approval gauntlets a grid-scale BESS runs — safety/code (UL + NFPA 855, enforced by AHJs/fire marshals), grid (UL 1741/IEEE 1547 at distribution; IEEE 2800/NERC PRC-029-1/ERCOT NOGRR 245 at transmission), and money (IE diligence, warranties/LTSAs, insurance, and the 2026-dominant FEOC/tariff overlay). Core thesis: **a product can be certified and still not be bankable** — bankability is the lender's judgment that the supplier and the paperwork together de-risk 20 years of cash flow.

## Executive read

- **Vocabulary discipline is a sales skill.** UL 9540A is a **test method with no pass/fail** — never say "9540A certified"; say "tested at cell, module and unit level, reports available." NOGRR 282 is **large-electronic-load** (data-center) ride-through; the storage rules are NOGRR 245 and NOGRR 272/PGRR 121. "BNEF Tier 1" is a bank-financeability screen, not a quality award.
- **NFPA 855-2026 is the inflection:** Large-Scale Fire Testing (one unit fully alight, suppression off, no propagation — CSA TS-800:24 is the standardized procedure) moves from best practice to effectively mandatory; Hazard Mitigation Analysis becomes default; NFPA 68 deflagration venting is no longer accepted as the primary explosion-control strategy. UL 9540A's 5th edition (Mar 12, 2025) aligns to it.
- **The grid gauntlet hardens Oct 1, 2026:** NERC PRC-029-1 (FERC Order 909, Jul 24, 2025) makes IBR ride-through — explicitly including BESS — enforceable; ERCOT's NOGRR 245 maximization deadline passed Dec 31, 2025.
- **The fire track record is improving and priced:** Moss Landing (Jan 16, 2025 — LG NMC in a legacy indoor design; ~$400M Vistra write-off; moratoria in SLO/Orange counties; AB 303 died, CPUC advanced SB 1383/SB 38 rules) was judged "not a market-moving event" by brokers precisely because underwriters distinguish legacy indoor NMC from modern outdoor LFP containers. EPRI-database analyses show failure rates down ~97-99% per deployed GWh 2018→2025 (media-derived database — state the caveat).
- **Bankability mechanics:** the IE report (DNV, Sargent & Lundy, B&V, Leidos, ICF...) is "the definitive gatekeeper for reaching financial close" — it tests the revenue model vs the warranty envelope, degradation/augmentation economics, grid compliance, and supplier counterparty strength. CEA's factory data: **72% of BESS manufacturing defects are now system-level** (fire detection/suppression 28%, aux panels 19%, thermal 15%) — which is why factory-audit rights are standard. BNEF Tier 1 criteria: ≥6 projects ≥10 MW/10 MWh in 2 years to ≥3 independent buyers with non-recourse financing; Chinese firms ~85% of the Q2 2026 list.
- **The China overlay:** lenders cannot avoid China (90-100% of US BESS has Chinese content) so they price and paper it — MACR documentation, FEOC certifications, ITC-eligibility reps, recapture indemnities (per the China-policy module). The FCC moved mid-2026 to ban new authorizations of Chinese-made inverters (prospective); DOE's Jan 2026 inspection of 30 units found no malicious hardware. Practical pairing: Chinese DC blocks + non-Chinese PCS/EMS.

## Hithium's specific file (what an IE will say)

**Tailwinds:** #2 global ESS cell shipper (2025, InfoLink; 35.1 GWh/#3 in 2024); BNEF Tier 1 since at least 2Q 2024; a real US operating record (Jupiter Power 3 GWh — ∞Block 5 MWh, 314 Ah cells rated to 11,000 cycles; Perfect Power 1 GWh MOU); Mesquite TX assembly shipping since Aug 28, 2025.
**Headwinds:** HKEX IPO filed Mar 2025 → lapsed Sep 25, 2025 → refiled Oct 2025 (H1 2025 revenue RMB 6.97B, +224.6%; gross margin 17.9% → 13.1%), unclosed as of Aug 2026 — an IE reads an unclosed IPO as a financing-dependency flag against a 20-year warranty; the CATL unfair-competition suit (Ningde court, confirmed Jun 25, 2025; 587 Ah cell, 4.4% energy-density deviation alleged; a reported executive arrest Jul 2025 — moderate confidence) adds injunction/reputational tail risk; the FEOC/tariff overlay per the companion module. Structural answers that work in project finance: parent guarantees, warranty insurance/bonding, escrowed spares, availability-LD LTSAs backed by the US entity, named bank references, quantified US fleet performance.

## The certification stack (teach from this table)

| Standard | Covers | Nature | Who demands |
|---|---|---|---|
| UN 38.3 | 8 transport abuse tests, cells/batteries | Test regime + Test Summary (self-responsibility) | Carriers, customs, buyers |
| UL 1973 | Cell/module/rack safety, stationary | Certification (listing) | Integrators, AHJs, lenders |
| UL 9540 | The complete ESS as integrated assembly | Certification (listing) — the umbrella mark | AHJs (NFPA 855/IFC require listed ESS), utilities, lenders, insurers |
| UL 9540A (5th ed. 2025) | Thermal-runaway propagation test, 4 levels | **Test method — no pass/fail**; produces design data | AHJs (spacing deviations), insurers, lenders, nearly all RFPs |
| CSA TS-800:24 / C800:25 | Large-Scale Fire Test procedure | Standardized test (one unit fully alight, no propagation) | AHJs/developers under NFPA 855-2026; RFPs |
| UL 9540B | Residential LSFT outline (May 2024) | Outline, maturing — NOT the grid-scale gate | Residential AHJs |
| NFPA 855 (2026) / IFC §1207 | Siting, spacing, HMA, detection, explosion control, ERP | Installation standard / adopted code | Fire marshals/AHJs; insurers; lenders |
| UL 1741 SB + IEEE 1547/1547.1 | Inverter grid-support, anti-islanding ≤2 s, interop | Certification to interconnection standard | Distribution utilities, state rules |
| IEEE 2800-2022 | Transmission IBR performance | Performance standard → enforceable via PRC-029 | Transmission interconnection |
| NERC PRC-029-1 | Mandatory IBR ride-through incl. BESS | Enforceable standard (FERC Order 909; eff. ~Oct 1, 2026) | NERC/FERC; generator owners |
| ERCOT NOGRR 245 (+272/PGRR 121) | ERCOT IBR ride-through; advanced grid support | Nodal Operating Guide revisions | ERCOT resource entities |

## The RFP diligence checklist (what buyers ask for)

1. UL 1973 + UL 9540 listings (NRTL); PCS certs (1741 SB / IEEE 2800 evidence)
2. Complete UL 9540A reports at cell, module, AND unit level (cell-only submissions are a known dodge buyers screen for) + LSFT results + deflagration-management design data
3. NFPA 855 package: HMA support, spacing drawings, gas detection, ERP template, responder training
4. UN 38.3 Test Summaries + DG shipping docs
5. Cycle-life/degradation/RTE data with independent-lab validation (DNV scorecard participation)
6. Capacity warranty (term, annual SoH table, operating envelope), availability guarantee, throughput terms, LDs, LTSA scope, augmentation plan
7. Counterparty proof: audited financials, parent guarantees/warranty insurance, bank references, US fleet references
8. Trade/tax: country-of-origin + HTS docs, domestic-content declarations, FEOC/MACR certifications (Notice 2026-15 mechanics) + recapture indemnities
9. Quality: pre-shipment inspection + in-line factory audit rights, FAT/SAT protocols
10. Cyber: EMS/BMS architecture, SBOM, firmware chain of custody, remote-access policy, FCC authorization status

## Claims ledger (abbreviated — module carries the full 30-row table)

| Claim | Source | Date |
|---|---|---|
| UL 9540A = test method, no pass/fail, 4 levels; 5th ed. Mar 12, 2025 | UL Solutions; ShopULStandards; Mayfield | 2025 |
| NFPA 855-2026: LSFT central; HMA default; NFPA 68 no longer primary | Telgian; Energy-Storage.News; EnergyTech | 2025-26 |
| CSA TS-800:24 LSFT procedure | CSA Group | 2024-25 |
| PRC-029-1 approved (FERC Order 909, Jul 24, 2025), eff. ~Oct 1, 2026, incl. BESS | Federal Register; Keentel | 2025 |
| NOGRR 245 eff. Oct 1, 2024 (maximization Dec 31, 2025); NOGRR 282 = large electronic loads | ERCOT notices/dockets | 2024-26 |
| Moss Landing: Jan 16, 2025; LG NMC legacy indoor; sprinklers deactivated; $400M write-off | WECC report (Dec 22, 2025); Energy-Storage.News; Canary Media | 2025 |
| AB 303 died Apr 2025; CPUC SB 1383/SB 38 rules; SLO/Orange moratoria | Brownstein; Energy-Storage.News; Utility Dive | 2025 |
| McMicken 2019: runaway → explosion; DNV GL findings | Utility Dive; NFPA | 2019-20 |
| EPRI: failure rate down ~97-99% 2018→2025 (methodology caveats) | EPRI wiki/white paper; Battery Design | 2024-25 |
| Insurance: "not a market-moving event"; NMC>LFP severity priced | Energy-Storage.News; kWh Analytics; NARDAC | 2025-26 |
| IE scope + "definitive gatekeeper" | Sargent & Lundy; DNV; Sunraise | 2025-26 |
| BNEF Tier 1 criteria; ~85% Chinese Q2 2026; Hithium listed since ≥2Q24 | BNEF methodology; EnergyTrend; Hithium PR | 2024-26 |
| CEA: 72% defects system-level (fire 28%, aux 19%, thermal 15%) | ess-news; CEA report | 2025-05 |
| Warranty/LTSA norms; supplier won't warranty without LTSA | Foot Anstey; TWAICE | 2026 |
| Notice 2026-15 MACR floors (55% 2026 → 75% 2030); financing gate | projectfinance.law; McGuireWoods; Energy-Storage.News | 2026 |
| §301 25% Jan 1, 2026; current stack ~40.9% (post-SCOTUS layers, Jul 24, 2026) | USTR; Pacific Battery layer math (reconciles Benchmark's pre-Feb 58.4% print) | 2026 |
| FCC ban on new Chinese inverter authorizations (prospective, mid-2026); DOE found no malicious hardware (Jan 2026) | pv magazine USA; Reuters/US News; Canary Media | 2026 |
| Hithium: #2 2025 ESS cell shipments; Jupiter 3 GWh; Mesquite shipping Aug 28, 2025 | InfoLink; SolarbeGlobal; Energy-Storage.News | 2025 |
| Hithium IPO lapsed Sep 25, 2025, refiled Oct 2025; GM 17.9→13.1%; CATL suit Jun 2025 | Energy-Storage.News; Bamboo Works; ess-news; pv magazine | 2025-26 |

**[UNVERIFIED / do not quote]:** a dedicated PVEL/Kiwa BESS scorecard (not confirmed — their scorecard is PV modules); the "10-25% premium discount for complete 9540A data" (vendor source); "no 2025-26 US fire attributed to a Chinese containerized system" (absence of evidence in searches, not a verified negative); the reported Hithium executive arrest (moderate confidence, secondary Chinese-media-derived).

## 2026-09-13 quarterly re-verification (module v `updated` 2026-09-13, `reviewBy` 2027-01-01)

Every dated gate in the module was re-checked against the **primary instrument** — the standards body, the
regulator's own public notice or docket, or the legislature's bill record. No secondary summary was accepted as
the basis for a change. Five claims moved; the rest held.

**CHANGED — UL 9540A is one edition behind.** A **6th edition** exists and UL Solutions tests to both the 5th and
the 6th; UL's own Code Authority material gives the 6th an **effective date of January 1, 2027**. Substantively the
6th **drops the unit-level test for non-residential BESS**, keeping it for residential systems and for
non-residential systems carrying an active thermal-runaway propagation prevention system (TRPPS); runs the
**installation-level large-scale fire test on every system regardless of unit-level result and applies pass/fail
criteria to that test**; and adds the **intentional ignition of vented gases**. This falsifies the module's
"cell + module + unit is the complete stack" advice for the 6th edition and makes naming the edition part of the
completeness claim. *(Source: UL Solutions, UL 9540A test-method and Code Authority pages.)*

**CHANGED — the LSFT procedure is ANSI/CSA C800:25, not TS-800:24, and NFPA 855-2026 names neither.** CSA Group's
own Tentative Interim Amendment submission to NFPA (Log No. 1852) states that **CSA/ANSI C800:25 has been published
and ANSI-approved** with the large-scale procedure at **Section 9.7**, and that because no consensus standard existed
when 855's second draft closed, **the methods for large-scale fire testing are not currently defined in NFPA 855**.
The 2026 edition adds **Annex G.11** on what the test must show; UL 9540A Ed. 6's installation test is the second
route. Errata 855-26-1 (issue date October 13, 2025) confirms the 2026 edition is issued. No issued TIA on the 2026
edition was found, so the C800 reference is proposed, not adopted — stated that way in the module.
*(Sources: NFPA docinfo — proposed TIA 1852 and Errata 855-26-1.)*

**CORRECTED — the FCC inverter action is not a China rule.** The module said the FCC barred new authorizations for
*Chinese-made* inverters. The Covered List entry, added **July 28, 2026 (DA 26-786)** and modified **August 20, 2026
(DA 26-870)** in WC Docket 18-89 / ET Docket 21-232 / EA Docket 21-233, reads **"Foreign-produced power inverters,
except power inverters which have been granted a Conditional Approval by DoW or DHS"** — expressly *regardless of the
nationality of the producer*. The adopted definitions: a **"power inverter"** is a UL 1741 utility-interactive
inverter (UL 1741 §§2.1.23, 2.1.52) that **contains or is designed, equipped or configured to accept** a component
enabling remote communication, control, sensing, data collection or monitoring over Ethernet, Wi-Fi, cellular,
Bluetooth or similar, wired or wireless; **"foreign-produced"** excludes units that are **eligible for the §45X
Advanced Manufacturing Tax Credit** or are a **domestic end product** under 48 CFR §25.101(a) (domestic component
cost **>65% for CY2024–2028, >75% from CY2029**). Non-utility-interactive inverters are out of scope. The listing is
prospective — existing authorizations stand — and OET's **DA 26-789** (July 28, 2026) waived the permissive-change
prohibitions so harm-mitigating firmware updates can still reach already-authorised covered units. **The module's
"pair Chinese DC blocks with non-Chinese PCS/EMS" advice was therefore wrong and has been replaced.** A second-order
finding worth carrying: DoW reasoned the §45X carve-out from §45X(c)(1)(C)/§7701(a)(52), so **the FEOC document set
and the FCC document set have converged**. *(Sources: FCC Public Notices DA 26-786 and DA 26-870, full text.)*

**CORRECTED — AB 303 did not die in April 2025.** The official California bill record for AB-303 (2025–2026, Addis)
shows the committee hearing **postponed on 2025-04-02**, the bill then sitting as a live two-year
measure, and **"Died pursuant to Art. IV, Sec. 10(c) of the Constitution" on 2026-01-31**, filed with the Chief Clerk
2026-02-02. Scope confirmed: projects with **200 MWh or more** within **3,200 feet of a sensitive receptor** or on an
environmentally sensitive site. The California siting risk was live nine months longer than the module implied.
*(Source: leginfo.legislature.ca.gov, AB-303 bill status.)*

**CHANGED — BNEF Tier 1 criteria tightened on August 15, 2026.** Per BNEF's own published methodology of that date:
six eligible projects in the last two years, at least three different buyers, each project at least **10 MW *or*
10 MWh** (either threshold — the module's "10 MW/10 MWh" read as a conjunction), third-party buyer, manufacturer
owning its plants — **plus, new: at least one of those projects financed with non-recourse financing from at least
two different commercial banks.** BNEF states the classification "is purely a measure of industry acceptance," which
strengthens the module's existing "screen, not an award" teaching. The ~85% Chinese share is the Q2 2026 list and is
**not** re-verified — the list itself is not public — and is labelled as such in the module.
*(Source: BNEF Tier 1 Energy Storage Methodology, August 15, 2026.)*

**HELD, now citable to the instrument.** PRC-029-1: FERC **Order No. 909**, Docket **RM25-3-000**, **90 FR 35599**,
published 2025-07-29, rule effective 2025-08-28; the standard's **US effective date of October 1, 2026** is carried in
NERC's own Standards, Compliance and Enforcement Bulletin for **August 31 – September 7, 2026**, alongside PRC-024-4,
PRC-030-1 and TOP-003-7. **New material added:** Order 909's twelve-month directive produced **PRC-029-2** under
Project 2025-05, whose April 2026 implementation plan would **retire PRC-029-1** on the later of October 1, 2026 or
the first calendar quarter after approval, and which sets the phased dates the module now carries (non-BES IBRs not
before January 1, 2027; hardware-limitation documentation within 12 months of the effective date for in-service
units, 90 days for later ones). ERCOT: **NOGRR 272 and PGRR 121 approved by the PUCT 2025-11-06, effective
2025-12-01**, with PGRR 121's model-quality and validation duties attaching to storage resources whose SGIA is
executed **on or after 2026-04-01**; NOGRR 245 effective 2024-10-01 as stated. FEOC: **IRS Notice 2026-15** confirms
the **55%** Clean Electricity MACR floor for an energy storage technology beginning construction in calendar 2026
(§7701(a)(52)(B)(ii)), as interim guidance with safe harbours pending proposed regulations. EPRI's failure database
is tracked through 2025-12-31, so the 2018→2025 window and its media-derived caveat stand unchanged.
*(Sources: federalregister.gov API record 2025-14304; NERC Project 2025-05 implementation plan and the Aug 31–Sep 7
2026 bulletin; ercot.com issue pages NOGRR245 / NOGRR272 / PGRR121; IRS Notice 2026-15.)*

**Not re-verified this cycle** (undated in the module, no dated gate attached): the CEA 72%-system-level defect
finding and its 28/19/15 split; the insurer commentary on Moss Landing pricing; the IE-firm roster. Left as written.

**Next dated gate, and therefore the new `reviewBy`: 2027-01-01** — UL 9540A Ed. 6's effective date, which is also the
date non-BES inverter-based resources come inside PRC-029. October 1, 2026 is not the trigger because this revision
states that date and the phasing behind it explicitly, so the module reads correctly on either side of it.

## What this analysis does NOT cover

State-by-state fire-code adoption timing; specific insurer terms; the IEC/international certification track beyond passing mentions; augmentation contract structures in detail; cybersecurity standards specifics beyond the FCC action and NERC CIP direction.

Developed by: LightAISolutions
