# CSA Group — Technology Lesson Plan

**Purpose:** teach **who says a battery is safe and how they earn the right to say it** — the difference between a standard, a code and a certification mark; the five-seat conformity system of North America (developer, accreditor, certifier, code adopter, enforcer) and how it differs between the United States and Canada; what a product listing proves and what field evaluation is for; the family of battery fire tests (UL 9540A, UL 9540, UL 1973, CSA C800, NFPA 855) and who writes each; what a large-scale fire test physically is; how an interim specification becomes a consensus standard and then law; and why the Canadian Electrical Code, not the CSA mark, is CSA's moat. CSA Group is the worked example because for a century it has held three seats at once — it writes the standard, tests to it and licenses the mark — and in August 2026 agreed to sell the testing seat to Kiwa Group.

**How this plan relates to what you already have.** The **DNV plan** taught what a certificate proves from the lender's chair; this plan goes inside the certifier. The **kWh Analytics plan** (same session) teaches the underwriter who reads the fire-test report. The cell-maker plans (**CATL**, **EVE**, **Hithium**) teach thermal runaway inside the cell; this plan starts where the cell has already failed and asks what the neighbours do. The **bankability guidance module** covers certification from the seller's side.

**Three ideas carry the plan.** A standard is a sentence, a code is that sentence made law, a mark is a laboratory's signature that a product met the sentence — three jobs, three institutions in the United States, one institution in Canada until 2026. A code can require a test but cannot give the test's author a monopoly on running it. Marks are equal where accreditation is equal; only codes are exclusive.

**One boundary, held throughout.** CSA Group's website returned HTTP 403 to every request from the research environment; the company's own pages were read from Wayback Machine snapshots and are cited by their original URLs, and the 2025/26 annual report is cited by title only. CSA publishes no revenue or surplus — its accounts are members-only — so the C$2.1 billion Kiwa price is the only valuation figure in the record.

**Suggested pacing:** Module 1 in one sitting (~30 min) — the vocabulary module; do not skip it. Module 2 (~35 min). Module 3 with a large-scale fire-test report or an OEM's test release open if you can find one (~40 min). Module 4 (~25 min). Module 5 (~20 min). Then flashcards and self-test in the app.

## Module 1 — Standard, code, mark: three things that are not the same

**The single idea:** the words 'certified', 'listed', 'compliant' and 'approved' are used interchangeably in tenders and mean four different things.

**A standard** is a written requirement from a committee. A consensus standard has passed a balanced committee, public review and formal approval; a technical specification is an interim task-group document published to fill a gap. CSA TS-800:24 was 'not a consensus document'; CSA/ANSI C800:25 is.

**A code** is a standard a government adopted — by incorporation by reference. CSA writes C22.1; British Columbia, Alberta and Ontario each adopted the 2024 edition on their own 2025 dates with their own amendments. NFPA writes 855; states adopt it through their fire codes.

**A mark** is a certifier's attestation that samples of a product met a standard's tests and the factory is under surveillance. 'UL 9540 listed' means a laboratory certified the system to a product standard. It does not mean a full-scale fire test was run at the buyer's spacing.

**Who may test.** OSHA recognises Nationally Recognized Testing Laboratories per standard and per site (CSA since 1992, 23 sites, UL 9540/1973/1741 in scope). The Standards Council of Canada accredits standards developers and certifiers (CSA's certification accreditation dates from 1983, renewed in May 2026 to 2031). The accreditor sits above the certifier the way the certifier sits above the manufacturer.

**Self-check:** a tender says 'NFPA 855 compliant containers'. What has it asked for? *(An installation rule, not a product — NFPA 855 'is NOT a certification standard'. It should have asked for a UL 9540 listing plus the test data the installation analysis needs.)*

## Module 2 — The five seats, and what a listing proves

**The single idea:** developer, accreditor, certifier, adopter, enforcer — five seats, and the whole system is the flow of trust between them.

**United States.** UL Standards & Engagement writes (UL 9540, 9540A, 1973); OSHA and ANSI accredit; UL Solutions, Intertek, TÜV, CSA and others test; states and cities adopt the fire and electrical codes; fire marshals and inspectors enforce.

**Canada.** CSA writes the electrical code and the C22.2 product standards; the Standards Council accredits; the same certifiers test under SCC-accredited scopes; provinces adopt; provincial safety authorities enforce. Ontario recognises 26 marks; 'any mark from an SCC-accredited certification body … can serve as acceptable evidence', while 'a US-only UL mark by itself is not enough in Canada'.

**The certification cycle.** Samples tested to the standard (for batteries: crush, nail, overcharge, short circuit, fire exposure, environmental) → certificate and listing → licence to use the mark → factory surveillance. Lose the surveillance, lose the listing. Witnessed manufacturer testing lets the maker's own laboratory run the tests with the certifier watching (Gotion's laboratory was so designated in 2021); the IECEE CB Scheme makes one test report a passport 'to access up to 70 countries'.

**Field evaluation** is for everything that is not a product: a custom or one-off installation is evaluated on site to SPE-1000 and given a serialised label; Ontario caps it at fewer than 500 units per model per agency.

**Self-check:** why is a certifier's Kunshan laboratory more important to its battery business than its Toronto one? *(Because the products being certified for North America are made in China; the test happens where the manufacturer is, witnessed or in the certifier's local lab, and the certificate follows.)*

## Module 3 — The fire-test family and the anatomy of a large-scale burn

**The single idea:** UL 9540A tells you how a fire spreads inside a unit; a large-scale fire test tells a fire chief what happens to the unit next door.

**The family.** UL 9540A (UL S&E): propagation from cell to module to unit to installation; a characterisation, not a listing; sixth edition (March 2026) adds large-scale requirements. UL 9540 (UL S&E, bi-national): the system listing. UL 1973: the pack listing beneath it. CSA C800:25 (CSA, from TS-800:24): a reliability and quality-assurance protocol — weather, mechanical impact, ballistics, and the Section 9.7 large-scale fire test — whose data is 'intended to be used as part of an assessment of bankability and insurability'. NFPA 855 (NFPA): installation rules; from 2026 large-scale testing is mandatory and Section 9.7 of C800 is referenced. CE Code Section 64 (CSA): Canadian installation law, drafted with 855 in view.

**Why C800 exists.** 'Existing standards (such as UL 9540A) are capable of testing for thermal runaway, but they do not adequately simulate fire propagation scenarios' — Marvin Peng, CSA. Manufacturers and AHJs asked for a procedure; TS-800 answered in 2024; C800 made it consensus in 2025; the codes referenced it in 2026.

**The burn.** A full enclosure beside neighbours at the spacing being qualified (15 cm for CLOU, 5 cm for Envision, back-to-back for Prevalon). Suppression off. A module driven into thermal runaway; vent gas intentionally ignited. Then the wait: 22 hours (Wärtsilä Quantum 3), 49 hours (Envision, 1,297 °C), 59 hours (CLOU, above 1,300 °C), 16 hours (HyperStrong, 1,400 °C). The unit is lost; the report is about the neighbours — 80.71 °C at 15 cm, 56 °C for HyperStrong — and about deflagration panels doing their job.

**Who watches.** A certifier's engineer, at its own or a partner's site. CSA witnessed Wärtsilä, BYD, CLOU, Canadian Solar, Fluence, Envision, HyperStrong and Jinko; UL Solutions witnessed Hithium; TÜV Rheinland witnessed Trina, e-STORAGE's second test and Sungrow's. A code requires the procedure, not the vendor.

**Self-check:** a 5 MWh container burns for two days and the neighbour's cells peak at 56 °C. Did the product pass? *(That is the pass: containment and neighbour temperatures within limits over the whole burn. The initiating unit's destruction is the test's premise, not its failure.)*

## Module 4 — How a standard is made, and how a code is paid for

**The single idea:** the value of a standards body is the sentence it writes; the difficulty is getting paid for a sentence that becomes law.

**The making.** Task group → technical specification (fast, interim) → committee with balanced interests → public review → approval by the national accreditor (SCC) and, for a bi-national document, ANSI → publication → reference by codes. TS-800 to C800 took fourteen months; C800 to NFPA 855-2026 about ten more.

**The paying.** The Canadian Electrical Code is sold (CAD 190; bundles; an exam) under digital-rights management, with free view access in Canada. P.S. Knight's copy-cat edition was enjoined in Canada (2016, affirmed 2018, leave refused 2019, contempt 2021) but the US Fifth Circuit held in 2024 that codes incorporated into Canadian law are 'the law' and copyable in the United States. Regulators now pay for public access (energy regulators renewed free pipeline standards for five years in April 2026; the nuclear regulator funds read-only access). The Kiwa proceeds become an endowment 'not exposed to the pressures of a large commercial business'.

**The split.** One roof (standards funded by the certifier: a flywheel, speed, independence — and a conflict of interest, capital starvation, concentration) against two roofs (a clean mandate and scale for the laboratories — and a stopped flywheel, two organisations called CSA, endowment risk). UL split its writing arm from UL Solutions years ago; CSA is selling its testing arm outright.

**Self-check:** after the sale, who issues a UL 9540 certificate bearing the CSA mark? *(CSA Group Testing & Certification Inc., a Kiwa company holding the NRTL recognition and the SCC certification accreditation — not the Canadian Standards Association, which keeps the standards.)*

## Module 5 — Where it fails, and where CSA sits

**The witness is not the author.** The share of large-scale tests CSA witnesses fell as its standard succeeded: Trina, e-STORAGE and Sungrow went elsewhere in 2026.

**The listing is not the installation.** Both the product certificate and the installation-level test are needed, and the surveillance behind the first.

**Marks are equal; codes are exclusive.** The CSA mark is one of 26 acceptable proofs in Ontario; the Canadian Electrical Code is the only installation law.

**Copyright stops at the border; accounts stop at the membership.** No revenue is public; three headcounts count three entities; the website is unreadable to a bot.

**Where CSA sits.** Author of the fire test the codes require (C800) and of the installation law of Canada (C22.1 Section 64); second North American source for the storage listing (NRTL, UL 9540/1973/1741); one of three witnesses for large-scale burns; a laboratory network from Independence, Ohio to Kunshan — all of the last three about to belong to Kiwa. In this corpus's assurance segment it is the challenger to UL Solutions' set; its incumbents are DNV and Sargent & Lundy, who read CSA's report rather than write it.

Developed by: LightAISolutions
