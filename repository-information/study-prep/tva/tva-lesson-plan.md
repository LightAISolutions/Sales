# Tennessee Valley Authority — Technology Lesson Plan

**Purpose:** teach how a federal utility serves a data-center boom with no regulator above it — what a federal corporation is and what replaces the rate case; why a board quorum is a planning constraint; who a data center's counterparty is when the utility sells only at wholesale; what a capacity commitment charge does and why its price can stay private; what "approving an IRP" means when the plan is a set of ranges; how tolls and lease-purchase financing let a $30 billion debt cap carry a $13 billion program; and what a small-modular-reactor construction permit proves and does not — starting from high-school STEM. No company trivia: appointment dates, executives and salaries stay in the dossier. Generated 2026-09-29 from the Profiler dossier (profileVersion 1). Companion: the in-app guide (Profiler → TVA → Study guide 📖) carries the condensed version, the timeline, the flashcards and the self-test.

**How this plan relates to what you already have.** The Salt River Project plan taught public power: a utility with no shareholders whose board is elected. This plan teaches the federal case: a utility with no shareholders whose board is appointed, removable and, for nine months of 2025, unable to act. The two are the corpus's only gatekeepers without a commission, and they answer the same question — who decides the large-load terms and the resource mix — in opposite ways: SRP by election, TVA by appointment.

**Suggested pacing:** Module 1 in one sitting (~30 min — the federal corporation and the quorum), Module 2 in one sitting (~25 min — distributors and the wholesale contract), Module 3 in one sitting (~30 min — the capacity commitment charge and the IRP), Module 4 in one sitting (~30 min — tolls, lease-purchase and the gas build), Module 5 last (~25 min — the SMR permit, the map and where it fails), then the flashcard and self-test passes in the app.

## Module 1 — The federal corporation and the quorum

**The single idea:** TVA's Board sets rates with no review by anyone, and the President can remove the directors who set them.

1. **The entity.** TVA is a corporate agency and instrumentality of the United States, created by the TVA Act of 1933. It "is not authorized to issue equity securities"; it is owned by the government, files 10-Ks with the SEC only because its power bonds are registered, and receives no appropriations for the power program. The Act gives the Board "sole responsibility for establishing the rates TVA charges for power," and those rates are "not subject to judicial review or to review or approval by any state or other federal regulatory body."
2. **The board.** Nine directors, appointed by the President with Senate consent, five-year terms, a quorum of five. In 2025 three were removed in three months and the quorum was lost from April 1 to January 2026. TVA's bylaws let a Board below quorum keep operations running but not "embark on new programs," so FY2026 spending had to be delegated to the CEO and nothing new was resolved until November 2025. Today six seats are filled, two directors serve in holdover until January 3, 2027, and three are vacant.
3. **The owner's hand.** A March 2026 presidential memorandum capped every TVA salary at $500,000; the CEO announced his retirement three weeks later, an interim CEO serves at the cap, and the General Counsel and Chief Business Officer seats are empty. The 10-Q lists presidential memoranda as a risk factor.
4. **What this means for a plan.** Once a quorum exists, everything passes in one meeting — on August 20, 2026 the Board approved the IRP, the budget, the data-center rate, a $3.5 billion gas plant, three turbines and direct service to SpaceXAI. One more removal or a lapsed holdover takes that authority away again.

**Self-check:** in May 2025 a developer offers TVA a 20-year storage toll. What happens? (Nothing — the Board is below quorum and cannot start a new program; the storage authorization came in November 2025 and the tolls in April 2026.)

## Module 2 — Distributors and the wholesale contract

**The single idea:** TVA sells at wholesale to 153 local power companies that resell to customers, so a data center's counterparty is usually its distributor — unless it is big enough to be TVA's own.

1. **The structure.** About 90 percent of revenue comes from 153 local power companies — municipal systems like Memphis Light, Gas and Water (9 percent) and Nashville Electric Service (8 percent), and rural cooperatives — under wholesale power contracts; 148 have signed a 20-year rolling partnership agreement. The other 10 percent is 62 directly served customers: industrials, federal agencies and, since 2026, hyperscale campuses.
2. **The fence.** TVA and its distributors may not supply load outside the area they served on July 1, 1957, and a Federal Power Act clause stops FERC from ordering TVA to wheel power for use inside it. Inside the fence there is one supplier.
3. **How a rate change travels.** The Board changes wholesale rates by resolution after a letter to the distributors; each distributor then adopts a matching resale schedule. The data-center rate approved in August 2026 reached Huntsville and LaFollette customers when their boards adopted it in September.
4. **The two doors.** xAI's Colossus 1 took 150 MW in November 2024 and 150 MW more in February 2026 through MLGW, enrolled in TVA demand response, with an xAI-funded substation — a distributor's customer, but every firm load above 100 MW needs a TVA Board vote. In August 2026 the Board approved SpaceXAI's MZX Tech LLC as a direct TVA customer above 100 MW for its next campus. Colossus 2, between them, runs behind the meter on a 1.2 GW gas plant in Southaven, Mississippi, next to TVA's own combined cycle.

**Self-check:** a 200 MW campus connects through Huntsville Utilities. Who signs its power contract, and who must vote first? (Huntsville Utilities signs; TVA's Board must approve the firm load above 100 MW before it is served.)

## Module 3 — The capacity commitment charge and an IRP of ranges

**The single idea:** TVA's large-load terms and its resource plan were both adopted by resolution in one meeting, and both are far less specific on paper than a commission's would be.

1. **The charge.** From October 1, 2026 a standard data-center rate class applies — about a 10 percent all-in impact phased over three fiscal years — with capacity commitment provisions in each schedule and a Capacity Commitment Charge for new or expanding loads above 5 MW. It "helps recover incremental capacity costs — ensuring that new data center customers do not shift costs to other customers"; press accounts say it is paid over three to five years to fund grid upgrades. A Power Interruption Provision sets terms for loads that want service before capacity exists; in-flight projects can qualify for transitional treatment; data centers are removed from the manufacturing rates they had been admitted to in 2008.
2. **What is not public.** The price per kilowatt, the term, the collateral and the transitional criteria are in customer contracts; the public has, in one critic's words, "one slide with seven bullet points." Against PPL's tariff, SRP's E-67 and FPL's LLCS, TVA's regime is the least transparent in the corpus and, at 5 MW, has the lowest threshold.
3. **The IRP.** On August 20, 2026 the Board approved "the power supply mix ranges and the strategic portfolio direction" of the 2026 IRP: a need of 11–32 GW through 2040, met by 7,000–26,000 MW of gas, up to 5,000 MW of nuclear, 3,000–12,000 MW of renewables nameplate, 2,000–3,000 MW of efficiency and demand response and 1,000–5,000 MW of storage. The direction: keep the coal fleet, suspend wind, add firm gas and storage, prepare for new nuclear. The Kingston and Cumberland coal retirements set in 2023–24 were reversed in February 2026.
4. **What binds.** The ranges do not; the separate November 2025 authorization for up to 1,500 MW of storage tolls by end-2029 does. As a federal agency TVA also needs a NEPA record of decision for the plan and for each plant — a court found in September 2026 that the Kingston gas decision violated NEPA, and no record of decision for the IRP had appeared by September 30.

**Self-check:** which TVA figure could a seller put in a proposal — "7–26 GW of gas," "1–5 GW of storage," or "1,500 MW of storage tolls by 2029"? (The last: it is an executed Board authority, under which 425 MW has already been signed.)

## Module 4 — Tolls, lease-purchase and the gas build

**The single idea:** a $30 billion cap on bonds does not cap TVA's program, because the batteries are tolls and the big plants are leased.

1. **The cap.** The TVA Act limits bonds to $30.0 billion outstanding. At September 30, 2025 TVA had $23.5 billion of debt and $23.8 billion of total financing obligations; the FY2027 plan takes total obligations to $30.7 billion by FY2029, with about $5 billion of it outside the bond count.
2. **Lease-purchase.** The 1,450 MW Cumberland combined cycle (CT1 synchronized May 29, 2026; commercial by December) was financed in May 2026 by a $2.0 billion lease-purchase: a separate entity issued $1.8 billion of notes and $200 million of equity and leases the plant to TVA for thirty years. Johnsonville's aeroderivatives used an $800 million structure in 2024. The plant is TVA's to run; the paper is somebody else's.
3. **Tolls.** TVA owns 20 MW of batteries at Vonore. Its large batteries are 20-year tolls signed April 21, 2026 — Plus Power's Crawfish Creek (200 MW / 800 MWh, Alabama, summer 2029) and Tenaska's Bobwhite (225 MW / 900 MWh, Tennessee, late 2029) — booked as more than $1.3 billion of capacity payments with a lease component. The developer owns the plant and chose the supplier, undisclosed for both; the Kingston 100 MW battery was bid as design-build-operate. As at APS and SRP, the battery seller's account is the developer.
4. **Turbines.** TVA buys these itself: ten GE Vernova LM6000VELOX units at Johnsonville (500 MW, 2025), sixteen at Kingston (up to 850 MW, 2028), three 7F.05 frame units approved in August 2026 for $300 million, a 500 MW frame plant at New Caledonia (May 2028), Allen's 200 MW of aeros (2027), Lagoon Creek's 350 MW, and an unsited $3.5 billion "New Gas Facility 2032." The Cumberland and Kingston combined-cycle OEMs are not named in the filings read.

**Self-check:** TVA's total financing obligations reach $30.7 billion in FY2029 against a $30.0 billion cap. Why is that not a breach? (The cap counts bonds; about $5 billion sits in lease-purchase entities whose notes are not TVA bonds.)

## Module 5 — The SMR permit, the map and where it fails

**The single idea:** the first U.S. SMR construction permit is a licensing milestone, not a plant; and TVA's plan fails at the quorum, the unpublished price, the courts and the disclosure.

1. **The permit.** On September 29, 2026 the NRC issued a construction permit for a 300 MW GE Vernova Hitachi BWRX-300 at Clinch River — the first for a commercial small modular reactor in the United States, fourteen months after formal review began. A construction permit allows building under NRC oversight; an operating license, a cost estimate and a construction-funding decision are all still ahead. The Board has approved $350 million of development money and DOE selected the project for about $400 million; commercial operation is "the early 2030s." Partners: GE Vernova Hitachi, Bechtel and Sargent & Lundy.
2. **Behind it.** A PPA of up to 50 MW from Kairos Power's Hermes 2 for Google's Alabama and Tennessee load (2030); a non-binding ENTRA1/NuScale collaboration for up to 6 GW; an Oklo fuel-recycling agreement; the IRP's "up to 5,000 MW" of nuclear. Every other BWRX-300 in the corpus points at this permit.
3. **Who buys what.** Batteries: the toll developers and the Kingston design-build bidder. Turbines: TVA, from GE Vernova on the record. The SMR: TVA with DOE cost share, through Bechtel and Sargent & Lundy. Large loads: the distributor's schedule, or TVA's direct contract above 100 MW.
4. **The failure modes.** Three vacant seats and two holdovers mean one removal returns the Board to four and stops new programs. The charge above 5 MW has no public price, term or collateral, so a Memphis campus cannot be compared with a Florida one on paper. Kingston lost a NEPA case a year before completion; every plant in a 7–26 GW range needs a record of decision that can be challenged. And tva.com is blocked to automated readers — the dossier was written from board decks, EDGAR, the NRC and third parties, and says so.

**Self-check:** the NRC has issued the permit and the Board has $350 million approved. What decides whether Clinch River is built? (A Board construction-funding resolution — which requires a quorum — and the DOE grant agreement; neither is on the record.)

## Where the flashcards and self-test point

The in-app guide's drill items test the concept chain above — the federal corporation and what replaces the rate case, the quorum, the distributor as counterparty and the fence, the capacity commitment charge, ranges against authorizations, lease-purchase under a debt cap, tolls and who picks the supplier, and what a construction permit is and is not. None tests a date, a name or a salary.

Developed by: LightAISolutions
