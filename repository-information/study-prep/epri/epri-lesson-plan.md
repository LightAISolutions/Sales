# EPRI — Technology Lesson Plan

**Subject:** EPRI (Electric Power Research Institute, Inc.), with its research programmes, DCFlex, the Open Power AI Consortium, the BESS Failure Incident Database and ESIC, and Powering Intelligence · **Written:** 2026-10-04 from the Profiler dossier (profileVersion 1) · **Baseline assumed:** high-school STEM, no utility or finance background.

**Purpose:** teach what an industry research cooperative is, how it is funded and governed, and how three of its outputs become the shared facts the rest of this corpus argues from:
- the funding model — fixed dues, opt-in supplementals, services and government contracts — and why the split sets the agenda;
- governance by a member-elected board and the neutrality question;
- from an incident database to a failure rate, with the denominators attached;
- building and misreading a data-centre load forecast;
- what a flexibility demonstration measures, and why a uniform classification matters to a tariff;
- where a research institute sits against the certifiers, independent engineers and insurers.

No company trivia: founding dates, executives, compensation and revenue stay in the dossier. The in-app guide (Profiler → EPRI → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The **UL Solutions**, **DNV**, **CSA Group** and **Intertek** plans teach the certifiers and independent engineers who cite this institute's data; the **kWh Analytics** plan teaches the insurer that published its failure chapter; the **Google**, **Meta**, **NVIDIA**, **Compass Datacenters**, **Duke Energy** and **Constellation** dossiers are the flexibility test bed's founders; the **ERCOT** and **PJM** material covers the grid operators whose large-load rules the institute's work feeds.

**Suggested pacing (before the flexibility framework's final version, due by October 2026, and the next Form 990 in November 2026):** Module 1 (~15 min), Module 2 (~10 min), Module 3 (~15 min), Module 4 (~15 min), Module 5 (~15 min), Module 6 (~10 min), then the flashcards and self-test in the app.

## Module 1 — The funding model

**The single idea:** half fixed dues, half opt-in projects, a tail of services and contracts — and the split decides who sets the agenda.

1. **Membership.** A fixed annual fee priced by the member's size buys a seat on every programme committee the member joins, every deliverable (reports, software, databases, training) and the researchers' support. Scope is set collectively.
2. **Supplemental projects.** Opt-in, separately budgeted, offered periodically; a share of a member's dues can be redirected to them, and non-members — technology companies, data-centre operators, consultants — may fund them at published prices. Scope belongs to the funders.
3. **Services and contracts.** Billable work for one member (laboratory qualification, consulting) and cost-reimbursable research for government agencies — the fastest-growing line and the one exposed to award terminations.
4. **The shift.** When supplementals out-earn dues, the urgent questions — data-centre flexibility, AI — are being funded by whoever shows up, which is how a chip maker and several hyperscalers came to sit inside a utility cooperative.
5. **Reading the accounts.** A non-profit's Form 990 and audited statements give revenue by line, expenses by sector, headcount and officer pay; the two differ by scope (the 990 adds investment income), so quote both.

**Self-check:** a data-centre developer wants a question studied. Which line does it use, and who else must agree? *(A supplemental project — it pays the published price and the project's funders set the scope; no member vote is needed.)*

## Module 2 — Governance and neutrality

**The single idea:** a member-elected board of utility executives governs; neutrality is asserted by charter and contested by funding critics.

1. **Classes and seats.** Federal and public power, regulated utilities, non-US utilities and system operators each elect directors; unregulated generators and others are non-voting; a governance committee appoints a few outsiders.
2. **The posture.** No advocacy for a company, sector or technology; trivial lobbying; technical foundations offered for others to adapt.
3. **The critique.** Half the money and nearly every director come from the industry studied; a methodology that favours that industry's preferred outcomes invites the charge of capture.
4. **How to read it.** Measurements (incident counts, surveys, test data) as the best public record; framings (which scenarios, what counts as flexible) as positions a funder influenced.

**Self-check:** what is the strongest evidence for and against the neutrality claim? *(For: open publication of methods and data. Against: board composition and the dues share.)*

## Module 3 — From incident database to failure rate

**The single idea:** incidents divided by installed capacity gives the curve every safety argument cites; keep both terms attached.

1. **The record.** Publicly reported battery fires, explosions and safety events by date, site, chemistry, size, age and root cause where known; media-dependent, so some regions are undercounted.
2. **The ratio.** Incidents per gigawatt per year. Deployment grew far faster than incidents, so the rate fell roughly a hundredfold in six years while the raw count stayed in single or low double digits.
3. **Root cause.** Only a third of catalogued incidents had enough information to assign a cause; integration, assembly and construction led. Most failures with a known age fell in construction, commissioning or the first two years — infant mortality.
4. **What it changed.** Commissioning rigour, containment of thermal runaway, first-responder guidance, and the argument that modern LFP containers built to NFPA 855 and tested to UL 9540A are a different risk class from the early designs.
5. **What it is not.** A certificate. The institute writes guidelines and keeps the record; laboratories test and certification bodies list.

**Self-check:** a vendor says 'failures are down 97 percent'. What two numbers do you ask for? *(Incidents per year and gigawatts installed — the ratio's numerator and denominator.)*

## Module 4 — Building a load forecast

**The single idea:** a scenario forecast gives a range by state under stated growth assumptions; the range is the finding and announced capacity is a pipeline.

1. **Method.** Measured base-year consumption by state; low, medium and high growth scenarios from chip shipments, construction tracking and operator disclosures; energy and share of national use at a horizon year.
2. **Why the range is wide.** AI's share of load, efficiency gains and build-out rates are uncertain; one number would hide that.
3. **The pipeline trap.** Developers file for many sites to secure a few; nameplate announcements overstate near-term peak. The institute's own words: a pipeline indicator, not a near-term peak forecast.
4. **Where it goes.** Utility resource plans, large-load tariff dockets, federal republication of the state tables. An upward revision by half between editions is a market event.
5. **For a seller.** The state table says where equipment demand concentrates; the spread says how much of your pipeline is real.

**Self-check:** a state's announced pipeline is three times the forecast peak. Which is wrong? *(Neither — they measure different things; the pipeline is filings, the forecast is expected consumption.)*

## Module 5 — What a flexibility demonstration measures

**The single idea:** how much load can move, how fast, and for how long — at what cost to the work.

1. **Compute choreography.** Pause, slow or reschedule training and batch jobs; cap GPU power. Seconds to minutes; hours. Latency-sensitive services cannot move.
2. **Geospatial shifting.** Move work to a data centre on another grid; needs spare capacity and the data there.
3. **Backup generation and batteries.** Generators and UPS batteries during a grid event; limited by fuel, permits and duration.
4. **Cooling and auxiliaries.** Pre-cool and ride on thermal mass for minutes.
5. **Ride-through.** Stay connected through voltage and frequency dips instead of tripping to backup — a settings question with reliability consequences for the whole grid.
6. **Why classify.** A uniform set of flexibility classes lets a grid operator write a tariff or interconnection rule around them; without it every jurisdiction negotiates from scratch. The measured results so far — a quarter of cluster power for three hours; a third within seconds — are the first numbers anyone has.

**Self-check:** why do grid operators want flexibility classes rather than bilateral promises? *(Classes are enforceable and comparable in a tariff; promises are not.)*

## Module 6 — Where the institute sits

**The single idea:** the reference the assurance firms cite, not a competitor to them.

1. **Before the project:** the institute's incident data, guidelines and test methods inform the standards.
2. **At the project:** the laboratory tests, the certification body lists, the independent engineer reviews, the insurer prices.
3. **After the project:** incidents feed the database; the cycle repeats.
4. **For a seller:** 'EPRI certified' does not exist; 'tested per an ESIC guideline' or 'cited in the failure database' are the real claims.

**Self-check:** which document does a lender want — an institute guideline or a certification body's listing? *(The listing; the guideline is what the listing's standard drew on.)*

## Risks to keep in view (from the dossier)

- Agenda drift as supplemental funders — including non-utilities — outspend dues.
- Governance turnover: the chair elected in 2026 is leaving his utility in 2027; nine directors left the roster in a year.
- Federal award terminations reaching a growing contract line.
- An 'open' AI consortium with no open-weights release eighteen months on.

## Sources for the technology and industry content

The institute's Form 990 returns and Deloitte-audited statements; its governance documents, programme pages and the DCFlex supplemental notice; its press releases on DCFlex, the Open Power AI Consortium, Flex MOSAIC and Powering Intelligence; the BESS failure white paper and the TWAICE/PNNL study release; Utility Dive, Latitude Media, IEEE Spectrum, Daily Energy Insider and Public Power coverage; the California Energy Commission docket and DOE and LBNL documents that cite the institute's data; the Energy & Policy Institute critique. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
