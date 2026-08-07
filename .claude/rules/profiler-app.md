---
paths:
  - "live-site-pages/Profiler.html"
  - "live-site-pages/profiler-data/**"
  - "repository-information/PROFILER-SCHEMA.md"
---

# Profiler App — Company Dossier Command

*Path-scoped: auto-injects when working on the Profiler app or its data. Also user-triggered on demand — the Profiler Command below fires whenever the user asks for a company profile/dossier, regardless of which files are loaded. Cross-referenced from CLAUDE.md ("Profiler Command" section).*

The Profiler app renders standardized corporate dossiers from JSON profiles in `live-site-pages/profiler-data/`. The data schema's single source of truth is `repository-information/PROFILER-SCHEMA.md` — read it before writing or revising any profile.

## Profiler Command

If the user says **"profiler \<Company Name\>"** (or similar: "add \<Company\> to Profiler", "create a profile for \<Company\>", "generate a dossier for \<Company\>", "update the \<Company\> profile", or supplies a list of companies to cover):

1. **Resolve the slug** per PROFILER-SCHEMA.md slug rules. If the slug already exists in `profiler-companies.json`, this is a **revision** (update in place, `profileVersion` +1); otherwise it is a **new profile**
2. **Research via web search** — thorough, current-date-aware sweep covering every schema section: identity/snapshot facts, products & services (including the v2 depth fields: positioning, sold-through model, target segments, roadmap), recent developments (trailing 12–18 months with a strategy takeaway per event), technical specifications of flagship products, decision makers (names, titles, career backgrounds, verified LinkedIn URLs, company-published photos), and financial performance vs expectations for the trailing two fiscal years plus the latest interim. **Default research vehicle (developer-approved 2026-08-06): two parallel `general-purpose` subagents per company** — Agent A exhausts first-party sources (Stage 1 below), Agent B covers third-party sources (Stage 2 below) — targeting ~50–70 evaluated sources combined (~250–350k tokens, ~12–18 min per company). A single agent (~25–40 sources) is acceptable for thin/private subjects where the public record is small; a three-agent deep sweep (~100–150 sources) is reserved for companies the user flags as high-stakes. The `strategyRead` synthesis is authored by the main agent from the combined research and labeled as analysis — it is never delegated as "fact-finding". Apply the authoring rules (public sources only, no fabrication, expectations honesty, analysis stays labeled) and the **Source Priority Protocol** (developer directive, 2026-08-06):
   - **Stage 1 — first-party, exhaustive, always first:** fully scrape the target company's own channels before consulting anything else — Investor Relations pages (annual/interim reports, results releases, investor presentations), the complete press-release archive (trailing 24 months minimum), product and datasheet pages, and leadership pages. First-party pages are the ground truth for products, specs, leadership, and company-reported financials
   - **Stage 2 — third-party, to fill and check:** exchange filings, trade press, and consultancy rankings fill the gaps and supply what the company cannot credibly say about itself — analyst expectations/consensus, independent rankings, and critical context (litigation, misses, controversies). Never source "vs expectations" verdicts or risk context solely from the company
   - **Citation order in `sources[]`:** company IR/PR/product pages first, then filings, then trade press — with aggregator-only figures marked as such per the schema rules
   - Research prompts sent to subagents must state this two-stage protocol explicitly
3. **Archive the superseded dossier (revisions only)** — before editing an existing profile, follow the **Archival Procedure** below so the outgoing version is preserved. New profiles have nothing to archive — skip this step
4. **Write the profile** — create or update `live-site-pages/profiler-data/<slug>.profile.json` conforming to PROFILER-SCHEMA.md. Set `lastUpdated` to today; set/increment `profileVersion`
5. **Register it** — add or update the company's entry in `profiler-companies.json` (keep `lastUpdated` in sync with the profile)
6. **Photos** — if the company publishes leadership photos, download them to `live-site-pages/images/execs/<slug>-<lastname>.jpg` and reference via the profile's `photo` field; otherwise omit the field (initials avatar renders). Never scrape LinkedIn images
7. **Batch requests** — when the user names multiple companies, run one research pass per company (parallel subagents where sensible) and land all profiles in the single interaction commit
8. **Standard treatment** — every company gets exactly the standard schema sections. No bespoke sections or special emphasis for any company (explicit developer rule; applies to Sinexcel like everyone else)
9. **Commit/push** — normal Pre-Commit + Pre-Push checklists apply (repo CHANGELOG entry, repo version bump on the push commit, README timestamp). The auto-merge workflow deploys the new data to the live site

## Archival Procedure

Every **revision** of an existing profile archives the outgoing version before it is overwritten, so no dossier state is ever lost:

1. **Copy before editing** — copy the current live `live-site-pages/profiler-data/<slug>.profile.json` to `live-site-pages/profiler-data/archive/<slug>.profile.v<N>.json`, where `<N>` is the `profileVersion` being superseded (e.g. archiving v3 while writing v4 → `sungrow.profile.v3.json`). The copy happens **before** any edits to the live file. The `.v<N>` suffix keeps basenames unique per [PC-UNIQUE-FILES] #17
2. **Update the archive index** — `live-site-pages/profiler-data/archive/archive-index.json` is keyed by slug; append an entry to the slug's array: `{ "file": "<slug>.profile.v<N>.json", "profileVersion": <N>, "archivedAt": "YYYY-MM-DD", "supersededBy": <N+1> }`
3. **Mirror off-repo (best-effort)** — attach the `lightaisolutions/bess-aidc-library` repo (via `add_repo`) and copy the archived file into its `profiler-archive/` directory with a matching commit. If that repo or the tooling is unavailable in the session, the in-repo archive alone is acceptable — state this plainly in the response summary
4. **Versioning** — archival is a data-only change: no Profiler page version bump ([PC-HTML-VERSION] #2 does not fire), no page changelog entry. The repo CHANGELOG entry for the revision mentions the archived version (e.g. "Refreshed Sungrow dossier to profileVersion 4; v3 archived")

The `archive/` directory deploys with the site like the rest of `profiler-data/` — acceptable, since profiles contain only public-sourced data.

## Scheduled Refreshes

Post-earnings dossier refreshes run on one-shot Routines (triggers) rather than manual prompts:

- **Convention** — a one-shot trigger named `Profiler refresh — <Company> (<period>)`, firing a **fresh session** the day after the company's scheduled report date, with a complete standalone prompt that invokes `profiler <Company>` and walks the full command (verify → research → archive → write → register → render check → commit/push)
- **Verify before running** — the fired session first confirms the report actually published; if not, it re-schedules itself ~3 days out and stops
- **Self-re-arming** — the final step of every scheduled refresh researches the company's next scheduled report date and creates the next one-shot trigger (report date +1 day). If trigger tooling is unavailable in the firing session, it instead adds an Active Reminder to `repository-information/REMINDERS.md` telling the developer to re-arm manually (including the expected date) and states this plainly in its summary
- **Currently armed** — Sungrow (SZSE: 300274) post-H1-2026 refresh: fires 2026-08-30 13:00 UTC (H1 report scheduled 2026-08-29)

## Version & changelog interactions

- **Data-only changes** (profile JSONs, registry) do **not** bump the Profiler page version — `Profiler.html` was not modified, and the app fetches profile data fresh (`cache: no-store`) on every render, so deployed data is picked up without a page reload. [PC-HTML-VERSION] #2 fires only when `Profiler.html` itself changes
- **AFFECTED URLS partition** — a data-only change still counts as an **indirect affect** on the Profiler page (the user-facing content changed). List the page in AFFECTED URLS showing its current version
- **Page changelog** (`Profilerhtml.changelog.md`) tracks only `Profiler.html` version bumps, per the standard page-changelog rules. Profile additions/revisions are recorded in the repo CHANGELOG (`repository-information/CHANGELOG.md`) instead — e.g. "Added Sinexcel dossier (profileVersion 1)". Public-changelog security rules apply if a page entry is ever written
- **Renderer changes** (new sections, layout) follow the normal HTML page rules: version bump, meta tag sync, page changelog entry, template-separation markers (all app code lives in the PROJECT blocks)

## Recall design (why it's organized this way)

Built so a future Claude session can reconstruct full context cheaply:

- **One file read per company** — `profiler-data/<slug>.profile.json` holds the complete dossier; no cross-file joins needed
- **The registry is the index** — `profiler-companies.json` answers "which companies are covered, how categorized, how fresh" in one read
- **Schema doc defines meaning** — field semantics live in PROFILER-SCHEMA.md, not in Claude's memory
- **Revisions are diffable** — `profileVersion` + `lastUpdated` + git history + repo CHANGELOG entries give a full revision trail per company
- **Reports** — when generating a report that cites covered companies, read the relevant profiles and cite their `sources` rather than re-researching from scratch; refresh a profile first if it is stale for the report's purpose

Developed by: ShadowAISolutions
