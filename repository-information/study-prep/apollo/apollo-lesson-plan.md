# Apollo — Technology Lesson Plan

**Subject:** Apollo Global Management, Inc. (NYSE: APO), its Asset Management, Retirement Services (Athene) and Principal Investing segments, the funds that control Stream Data Centers, and its compute-financing book · **Written:** 2026-10-05 from the Profiler dossier (profileVersion 1) · **Baseline assumed:** high-school STEM, no finance background.

**Purpose:** teach how a manager that owns a life insurer reaches AI infrastructure without buying any power equipment itself:
- what Apollo earns from fees, from the insurer's spread and from its own capital, and why AUM, fee-generating AUM and perpetual capital differ;
- how annuity money becomes long-dated lending, and why that suits data-centre and chip leases;
- asset-based finance, and the difference between arranging a deal and holding it;
- how a chip-financing platform is layered, and why a commitment, a target, a backstop and a guarantee are four different numbers;
- what controlling a developer means for a seller, and why a 50% stake is not control;
- the buying-authority test across Apollo's positions, and the deal ladder.

No company trivia: founding dates, executives, fund sizes and share prices stay in the dossier. The in-app guide (Profiler → Apollo → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The **KKR** plan's Module 1 teaches an asset manager that owns an insurer (Global Atlantic); Module 1 here applies it to Athene at larger scale. The **Blue Owl** plan teaches lending against chips and moving a campus off a hyperscaler's balance sheet, which Module 4 builds on. The **Fluidstack** plan shows the site operator where the financed racks are deployed.

**Suggested pacing (about two hours):** Module 1 (~15 min), Module 2 (~15 min), Module 3 (~10 min), Module 4 (~25 min — the densest), Module 5 (~20 min — the most important for a seller), Module 6 (~15 min), then the flashcard and self-test passes in the app.

## Module 1 — A manager that owns an insurer

**The single idea:** fees on other people's money and a spread on the insurer's own portfolio are two different businesses under one listed company.

1. **Three segments.** Asset Management earns management and transaction fees; its measure is fee-related earnings (USD 2,528m in 2025). Retirement Services is Athene, wholly owned since January 2022; its measure is spread-related earnings (USD 3,361m). Principal Investing is Apollo's own capital in its funds (USD 338m).
2. **Three sizes.** About USD 1.05tn of assets under management at 30 June 2026, USD 858bn of it fee-generating, and USD 621bn of perpetual capital — money with no return date. Athene's USD 416bn is the largest slice.
3. **Why perpetual capital matters.** A fund that must return money in ten years cannot comfortably hold a twenty-year loan. An insurer's balance sheet can, which is why Apollo can lead deals that most managers would syndicate.

**Self-check:** Which earnings line would fall if Athene's portfolio earned less but annuity holders were owed the same? *(Spread-related earnings.)*

## Module 2 — How annuity money becomes long-dated lending

**The single idea:** an insurer that owes money for decades wants assets that pay for decades.

1. **The annuity promise.** A saver hands over a lump sum; the insurer pays a stated return or income for years. Premiums go into the insurer's general account, and the insurer keeps the spread between what the portfolio earns and what it owes.
2. **The portfolio's shape.** To earn that spread safely, the assets must be long-dated and mostly high-grade. Athene's portfolio is 'primarily high-grade fixed income assets', managed by Apollo.
3. **The link to AI infrastructure.** A five-year lease of compute racks to a large AI lab, backstopped by the chip designer, is a long, contracted stream of payments — the kind of asset an insurer can hold. In Broadcom's AI XPV Platform Athene guarantees 15% of the purchaser's obligation.

**Self-check:** Why would an insurer prefer a lease to a strong tenant over a loan to a young developer with no contracts? *(The lease's payments are contracted and predictable, which matches the insurer's long obligations.)*

## Module 3 — Lending against assets, not companies

**The single idea:** a large share of Apollo's credit is secured by specific assets and their cash flows, not by a borrower's general credit.

1. **Two kinds of credit.** Of USD 749.2bn of credit at 31 December 2025, USD 302.1bn was direct origination — loans judged on a company's credit — and USD 282.7bn was asset-based finance, loans secured by pools of equipment, leases, receivables or loans.
2. **Chip financing is asset-based finance.** The lender looks first to the hardware and the lease payments. Its risks are the lessee stopping payment and the chips being worth less than the debt when the lease ends; a backstop from a strong party narrows both.
3. **Arranging is not holding.** Apollo Capital Solutions originates, structures and syndicates loans (record fees of USD 808m in 2025). Leading a deal can mean keeping part and selling the rest.

**Self-check:** A manager 'leads' a USD 10bn financing. How much has it lent? *(Unknown from that sentence — leading says who arranged it, not how much the leader holds or has funded.)*

## Module 4 — The layers of a chip-financing platform

**The single idea:** in a chip-financing platform every party carries a different risk, and none of them buys power equipment.

1. **The layers.** Broadcom designs the compute racks and backstops the customer's five-year lease payments up to about USD 29bn. An Apollo-managed fund holds the obligation to buy the racks. Athene guarantees 15% of that obligation, and a third party reimburses Athene for 35% of anything it pays. Apollo funds lead the initial tranche, with Blackstone's Credit & Insurance business as the other anchor and with banks. Anthropic leases the racks, which are deployed at Fluidstack-based sites.
2. **Four numbers.** USD 35bn is committed money drawn over several years as racks are bought. 'Over 20 GW' is a design target for compute through 2028. About USD 29bn is Broadcom's maximum potential liability under its backstop. 15% is Athene's guaranteed share. Never add them together or swap one for another.
3. **The same discipline elsewhere.** Apollo led a USD 3.5bn financing of Valor Compute Infrastructure's USD 5.4bn purchase of NVIDIA GB200 systems, leased triple-net to an xAI subsidiary. That is a loan size and a transaction size — and Valor's fund, not Apollo, owns the systems.
4. **Where the power equipment is bought.** By whoever owns and operates the buildings the racks go into. The financing buys chips.

**Self-check:** A headline says 'Apollo lends USD 35bn against chips for Anthropic.' What is wrong with it? *(USD 35bn is a commitment drawn over years, shared with Blackstone and banks; the borrower is an Apollo-managed purchaser fund, and Anthropic is the lessee.)*

## Module 5 — What controlling a developer means for a seller

**The single idea:** Apollo's funds own most of Stream Data Centers; Stream's management and its campus joint ventures sign the orders.

1. **The platform.** Apollo-managed funds bought a majority of Stream in November 2025; Stream's management and a Principal fund kept minority stakes. Stream reports more than 4 GW of long-term powered land — sites where a utility has committed to deliver power — and delivers campuses as joint ventures. New capital was committed for 650 MW of near-term capacity in metro Chicago, Atlanta and Dallas.
2. **Who signs.** Stream's development teams or the joint venture that owns each campus place the orders for switchgear, transformers, generators and batteries. Where a utility builds the substation — ComEd at Elk Grove Village, Illinois — the utility buys that equipment.
3. **A lead, not a fact.** The Information reported in September 2026 that Anthropic was in early talks to lease up to 1 GW directly from Stream. No party has announced it.
4. **Other controlled platforms.** Vaultica (STACK's former European colocation business, seven sites), PowerGrid Services (a utility maintenance and construction contractor that installs equipment utilities buy) and, once its purchase closes, Eagle Creek's roughly 700 MW of hydro plants.

**Self-check:** Apollo announces new capital for a Stream campus. Whom do you call about medium-voltage switchgear? *(Stream's development team for that campus — and the utility, if it is building the substation.)*

## Module 6 — Why half is not control, and the deal ladder

**The single idea:** the test is never the size of the cheque; it is who signs the purchase order.

1. **Fifty-fifty stakes.** Apollo funds committed USD 6.5bn for 50% of Ørsted's 2.9 GW Hornsea 3, including half of its capital spending; Ørsted builds and operates it. Apollo holds 50% of TotalEnergies' roughly 2 GW Texas solar-and-storage portfolio, which TotalEnergies operates. In the German grid joint venture, RWE has operational control.
2. **The buying-authority test.** Stream and Vaultica pass through their own management; PowerGrid Services rarely buys power equipment itself; Eagle Creek is pending; the chip financings fail because they buy chips; the 50% stakes fail because partners operate; FlexGen is a seller Apollo invested in, and Nscale a borrower.
3. **The ladder.** Report (the Anthropic–Stream talks) → memorandum (NVIDIA's compute-financing memoranda with six firms, August 2026, subject to final agreements) → signed, not closed (Eagle Creek; Kelvion's sale to SLB) → closed (Stream; the STACK carve-out, now Vaultica) → committed and drawing (the XPV tranche).

**Self-check:** A release says Apollo and a utility each own half of a new solar portfolio. Who buys the inverters? *(Whichever owner the agreements make the operator — usually the utility or developer, not Apollo.)*

## Sources for the technology and industry content

Apollo Global Management's FY2025 10-K, Q2 2026 10-Q and Q4 2025 and Q2 2026 earnings releases; the joint Broadcom–Apollo–Blackstone release of 9 June 2026 and Apollo's own release on the AI XPV Platform; Broadcom's 10-Q for the quarter to 2 August 2026; Apollo's releases on Stream Data Centers (August and November 2025), the STACK European colocation carve-out (April 2025), Valor Compute Infrastructure (January 2026), Hornsea 3 (November 2025) and Eagle Creek (October 2025); Stream's September 2025 Elk Grove Village release; NVIDIA's 10 August 2026 release; Investing.com's carriage of The Information's 22 September 2026 report. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
