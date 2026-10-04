# SemiAnalysis — Technology Lesson Plan

**Subject:** SemiAnalysis (SemiAnalysis LLC), with ClusterMAX, the institutional models, InferenceX, the consulting and technical-assessment line, and SemiAnalysis Capital · **Written:** 2026-10-04 from the Profiler dossier (profileVersion 1) · **Baseline assumed:** high-school STEM, no finance or data-centre background.

**Purpose:** teach what an independent research firm sells in the AI-infrastructure market, how a GPU-cloud rating is produced and what its tiers do and do not assert, how a supply-chain model and an inference benchmark are built, and where a firm that also consults and invests meets its independence questions:
- the four layers — free rating, paid models and assessments, consulting, venture fund — and how each feeds the next;
- what it takes to test a GPU cluster, and how tiers move between editions;
- how an industry model is reconstructed bottom-up and reconciled top-down;
- inference benchmarks: what a vendor-funded public test proves;
- independence: disclosure versus proof, and the MNPI line;
- from research to fund: Form D as the fact base;
- the datacentre-power line this corpus's power and grid dossiers cite.

No company trivia: founding dates, executives, ownership and revenue stay in the dossier. The in-app guide (Profiler → SemiAnalysis → Study guide 📖) carries the condensed version, the flashcards and the self-test.

**How this plan relates to what you already have.** The **CoreWeave**, **Nebius**, **Crusoe**, **Lambda**, **IREN**, **Fluidstack**, **Nscale** and **Firmus** plans teach the clouds the rating scores; the **Vertiv**, **Amperesand** and **DG Matrix** plans teach the 800 VDC and solid-state-transformer equipment the power line sizes; the **Anthropic** dossier is the one named customer by spend; the **Anza** plan is the other advisor whose product is data rather than engineering.

**Suggested pacing (before the next ClusterMAX edition, expected around March 2027):** Module 1 (~10 min), Module 2 (~20 min), Module 3 (~15 min), Module 4 (~10 min), Module 5 (~15 min), Module 6 (~10 min), Module 7 (~10 min), then the flashcards and self-test in the app.

## Module 1 — Four layers, one firm

**The single idea:** a free rating builds the audience, paid models and assessments monetise it, consulting deepens it, and a venture fund turns the analyst into an owner.

1. **The free layer.** A rating of GPU clouds anyone can read, cited by buyers, lenders and the clouds themselves. Its price is nothing; its influence is the firm's distribution.
2. **The paid layer.** Institutional models of the supply chain (accelerators, memory, datacentres, cloud TCO, networking, fab equipment) sold on request; a newsletter that is under a twentieth of revenue; a paid technical-assessment service that uses the rating's toolkit during a buyer's acceptance testing.
3. **Consulting.** Due diligence on silicon, clusters and clouds for investors deploying capital — the firm files the rating itself under this heading.
4. **The fund.** A venture fund and single-deal vehicles investing in the sector the firm analyses, with SEC Form D filings as the public record.
5. **Why it matters.** Each layer adds a relationship with the companies the first layer rates.

**Self-check:** which layer is free, and what does it buy the firm? *(The rating; it buys the audience every paid layer sells to.)*

## Module 2 — Testing a GPU cluster

**The single idea:** a rating is a hands-on test of a granted cluster, scored on operations rather than hardware.

1. **The unit.** Hundreds to thousands of accelerators joined by a high-bandwidth network and shared storage. The difficulty is keeping them all working at once; one slow node drags a training job.
2. **What is scored.** Handover time; inter-node network throughput; storage; detection and replacement of failed nodes (auto-remediation); monitoring and alerting; security posture; SLA terms; support quality.
3. **Hands-on, not mystery-shopped.** Providers grant test nodes and talk to the rater during testing — deeper than an anonymous customer, and closer.
4. **How tiers move.** No access → unavailable; a failed security gate → down regardless of performance; a known gap fixed → up. Editions tighten the methodology, so cross-edition comparisons need the methodology note.
5. **Reading a tier.** Platinum, Gold, Silver, Bronze, a participation tier, not-recommended tiers and unavailable — each asserts less than its name; the review text carries the finding.

**Self-check:** a provider drops two tiers with unchanged hardware. What most likely changed? *(The methodology — a new security gate or penalties for handover and remediation failures.)*

## Module 3 — Building a supply-chain model

**The single idea:** an industry model is a bottom-up reconstruction reconciled against top-down disclosures and kept alive.

1. **Objects.** Facilities by owner, site, power, status and tenant; accelerator and memory SKUs by volume and price; a cloud TCO model pricing a GPU-hour from capital cost, power, depreciation and utilisation.
2. **Inputs.** Filings, permits, construction tracking, supplier and customer conversations, hardware teardowns in a lab, the firm's own benchmarks.
3. **Reconciliation.** The count of facilities must agree with the capital expenditure the owners disclose; the SKU volumes with the foundry's and memory makers' output.
4. **Buyers.** Hyperscalers checking suppliers, neoclouds pricing clusters, investors sizing markets, governments watching export-control effects. 'Contact sales' pricing; undisclosed client list.
5. **The MNPI line.** Material non-public information stays out of what is sold to investors; trading pre-approval and supervisory review are the controls. The 2026 litigation alleged, and the firm denied, a breach.

**Self-check:** why does a buyer of the model care who else buys it? *(If a rated cloud is a client, the rating's independence is a live question.)*

## Module 4 — Inference benchmarks

**The single idea:** a public, continuous benchmark proves software and hardware trends; its absolute ranking inherits the provenance of the hardware.

1. **Metrics.** Tokens per second per GPU, latency at a target interactivity, cost per million tokens, across models and sequence lengths; nightly runs on current software show the stack improving.
2. **Sponsors.** Chip makers and clouds donate hardware and engineers because a public number they can win beats a private one.
3. **Provenance.** Vendor-supplied hardware and runs the public cannot reproduce make the result auditable only by its author.
4. **Use.** Trend lines and ratios are robust; discount placement by the sponsor list.

**Self-check:** what single change would most raise a benchmark's credibility? *(Independently procured hardware, or a suite the public can run on its own systems.)*

## Module 5 — Independence

**The single idea:** the gap is disclosure, not proof of misconduct.

1. **What is disclosed.** Methodology; which providers gave access; the existence of paid services; the fund's SEC filings; a compensation disclaimer in the first edition only.
2. **What is not.** A client list; whether rated providers buy models or assessments; badge-licence terms; fund holdings; any policy on rating portfolio companies.
3. **The structural facts.** Rated providers donate the benchmark's compute and grant the rating's test nodes; a prior investment vehicle held a stake in a rated cloud; the review text refers to clients of the firm's models.
4. **The firm's answer.** Providers cannot buy a ranking; compensation is not tied to tiers. No critic has produced evidence otherwise, and the loudest critic runs a rated provider.
5. **For a reader.** Treat a tier as a technically grounded judgment by a firm with undisclosed commercial and investment ties to several rated companies — not an audit.

**Self-check:** which single document would close most of the gap? *(A client and holdings list set against the rated roster.)*

## Module 6 — From research to fund

**The single idea:** Form D is the fact base; profiles carry claims.

1. **Vehicles.** A venture fund (committed capital, management fee, carried interest), single-deal SPVs, a third-party feeder — each reported on Form D under private-placement exemptions.
2. **What Form D shows.** Filed target, amount sold, number of investors, signatory. A target is not a close; nil sold means nil sold until an amendment.
3. **Why research firms raise funds.** Deal flow seen first, a brand founders want, and fee income unrelated to subscriptions.
4. **What changes.** Every view on a portfolio company or its competitors is an owner's view; the firm sets its own disclosure rules.

**Self-check:** a profile says the fund 'confirmed at' a larger figure than the filing's target. Which do you carry? *(Both, labelled: the filed target as fact, the larger figure as a company-confirmed claim.)*

## Module 7 — The power research line

**The single idea:** the firm's datacentre-power analysis is scenario framing this corpus's power and grid dossiers cite, revised by its author.

1. **800 VDC in phases.** Power-rack retrofits, DC-native racks, facility-level DC distribution, then the solid-state transformer replacing the line-frequency transformer.
2. **Market sizing.** Bill of materials per phase times gigawatts built — a forecast with stated assumptions.
3. **Behind-the-meter.** On-site generation and storage as the answer to the interconnection queue; the firm's gigawatt estimates frame the generation dossiers.
4. **Grid economics.** Capacity-market modelling critiques and household-bill analysis that reach regulators.
5. **For a reader.** Check the post's date and assumptions before quoting a figure 'per SemiAnalysis'.

**Self-check:** a dossier quotes a market size for solid-state transformers from this firm. What two things do you check? *(The post it came from and the assumptions it states.)*

## Risks to keep in view (from the dossier)

- Disclosure thinning edition by edition while reliance on the rating grows.
- A venture fund and SPVs invested in the rated sector; holdings undisclosed.
- Arbitration-stayed litigation alleging MNPI misuse — unproven, denied, private.
- Revenue known only through one outlet's reporting; headcount through third-party counts.

## Sources for the technology and industry content

The firm's about, careers, compliance and model product pages; the public text of each ClusterMAX edition and clustermax.ai; the InferenceMAX/InferenceX launch posts, the GitHub repository and the provider blogs that describe their support; the fund's Form D filings on sec.gov; The Information, Substrate and Asymmetrix profiles as relayed; the Hot Aisle critique and the Yahoo Finance segment carrying the firm's reply; UniCourt and Docket Alarm for the San Francisco Superior Court dockets; the 800 VDC and behind-the-meter posts and their third-party summaries. Concept definitions are registered in `profiler-concepts.json`.

Developed by: LightAISolutions
