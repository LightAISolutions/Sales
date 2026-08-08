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
2. **Research via web search** — thorough, current-date-aware sweep covering every schema section — with **products & services as the priority section** (developer directive, 2026-08-07): allocate research depth to the full product-line enumeration first — flagship product names, concrete specs, the v2 depth fields (positioning vs named competitors, sold-through model, target segments, roadmap with dates) — before rounding out identity/snapshot facts, recent developments (trailing 12–18 months with a strategy takeaway per event), technical specifications of flagship products, decision makers (names, titles, career backgrounds, verified LinkedIn URLs, company-published photos), and financial performance vs expectations for the trailing two fiscal years plus the latest interim. **Default research vehicle (developer-approved 2026-08-06): two parallel `general-purpose` subagents per company** — Agent A exhausts first-party sources (Stage 1 below), Agent B covers third-party sources (Stage 2 below) — targeting ~50–70 evaluated sources combined (~250–350k tokens, ~12–18 min per company). A single agent (~25–40 sources) is acceptable for thin/private subjects where the public record is small; a three-agent deep sweep (~100–150 sources) is reserved for companies the user flags as high-stakes. The `strategyRead` synthesis is authored by the main agent from the combined research and labeled as analysis — it is never delegated as "fact-finding". Apply the authoring rules (public sources only, no fabrication, expectations honesty, analysis stays labeled) and the **Source Priority Protocol** (developer directive, 2026-08-06):
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

## Profiler Note Command

If the user says **"profiler note \<Company\>: \<text\>"** (or similar: "add a note to \<Company\>", "log this about \<Company\>", "I learned something about \<Company\>", or relays intel from a contact/event about a covered company):

1. **Resolve the slug** — must exist in `profiler-companies.json`; if it doesn't, tell the user and offer to create the profile first (`profiler <Company>`). Ecosystem-wide intel not tied to one company uses slug `general`
2. **Capture verbatim** — store the user's input text **unaltered** in `live-site-pages/profiler-data/profiler-notes.json` (schema: PROFILER-SCHEMA.md), prepended (newest first), with `id` (`note-YYYYMMDD-NN`), today's date, and a `sourceType` inferred from context (ask if genuinely unclear)
3. **Ask for the confidence rating (0–100)** — always ask the user to rate how confident they feel about the information on a scale of 0–100 (via `AskUserQuestion` with ranges as options plus Other for an exact number, or accept a number stated in the prompt). Never invent or default this value — it is the developer's judgment (explicit developer directive, 2026-08-07)
4. **Public-deployment awareness** — notes deploy verbatim to the public site (explicit developer decision, 2026-08-07: verbatim storage, no sanitization). If a note contains something that looks NDA'd, deal-sensitive, or personally identifying, flag it to the user **before** committing and let them decide — flag, don't block
5. **Tags** — add 1–3 lowercase recall tags when obvious (`pricing`, `roadmap`, `hiring`, `org-change`, …)
6. **Commit/push** — data-only change: no Profiler page version bump; the Profiler page is an **indirect affect** in AFFECTED URLS. Repo CHANGELOG entry (e.g. "Field note added for Megmeet (note-20260808-01)")

**Confidence weighting (applies whenever notes are consumed)** — any session using field notes (dossier research, refreshes, reports, prep materials) weights each note by its `confidence`:
- **75–100** — treat as reliable first-hand intel: use it to steer research and shape analysis (`strategyRead`, prep talking points), stated as the developer's observation
- **40–74** — treat as a lead: worth investigating and corroborating against public sources before leaning on it
- **0–39** — treat as rumor: mention only with explicit hedging, never as a basis for conclusions
- In all cases, notes are **never** cited as profile sources and never blended into sourced profile sections (see "Notes are not sources" in PROFILER-SCHEMA.md)

## Profiler Prep Command — Technology Lesson Plans

If the user says **"profiler prep \<Company\>"** (or similar: "prep me for \<Company\>", "teach me \<Company\>", "study plan for \<Company\>", "teach me their products"):

**What this command is (developer directive, 2026-08-07):** a **technology curriculum**, not company-trivia prep. It teaches the developer — assuming **high-school-level STEM knowledge** as the starting point — whatever underlying science, engineering, and industry context is needed to genuinely understand **what the company's products and services do in the grand scheme of their industry** (e.g. what an SST does in medium-voltage critical-power AIDC infrastructure). **Never quiz or drill company trivia** — founding dates, executive names, headquarters, share counts, and similar facts stay in the dossier for reference but are NOT lesson-plan or flashcard material.

1. **Read everything first** — the company's `<slug>.profile.json` (its `productsAndServices` and `technicalSpecs` are the syllabus) and its field notes from `profiler-notes.json` (confidence-weighted). If no profile exists, run the full Profiler Command first
2. **Concept-gap analysis** — for each product line, work backwards from the product to the concepts a high-school-STEM reader needs to understand it (e.g. power shelf → AC/DC conversion, rectification, redundancy N+1, efficiency-at-scale economics). Identify the concept chain, then fill any technical gaps with targeted web research on the *technology and industry architecture* (not the company)
3. **Write the lesson plan** — `repository-information/study-prep/<slug>/<slug>-lesson-plan.md` (NOT deployed; the directory must never move under `live-site-pages/`). Structure: progressive modules from fundamentals → today's industry architecture → where each of the company's products slots in and what it displaces → the company's other product lines → the industry map (who buys, who competes, why the technology transition matters economically). Use plain-language analogies, define every acronym on first use, and include a suggested pacing section if the developer has a deadline
4. **Write the in-app study guide** — `live-site-pages/profiler-data/<slug>.study.json` (schema: PROFILER-SCHEMA.md): the same curriculum in section-bullet form plus **concept flashcards** (Q&A on how the technology and products work — never company trivia). Public-safe: no personal circumstances or deal context. Data-only change (no page version bump); the Profiler page is an indirect affect
5. **Refresh on demand** — re-running the command regenerates both layers from the current dossier + notes; files are overwritten in place (git history preserves prior versions)
6. **Commit/push** — normal checklists; repo CHANGELOG entry (private file names are fine in the repo CHANGELOG; keep them out of any public page changelog)

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
- **Currently armed** (all fire fresh sessions; one-shots re-arm themselves):
  - **Sinexcel** (SZSE ChiNext: 300693) — fires 2026-08-12 13:00 UTC (H1 report scheduled 2026-08-11)
  - **Sungrow** (SZSE: 300274) — fires 2026-08-30 13:00 UTC (H1 report scheduled 2026-08-29)
  - **BYD** (SZSE: 002594 · HKEX: 1211) — fires 2026-08-30 15:00 UTC (H1 results scheduled 2026-08-29; staggered 2h after Sungrow to avoid parallel-session conflicts)
  - **Tesla** (NASDAQ: TSLA) — fires 2026-10-22 13:00 UTC (Q3 results estimated ~2026-10-21; the fired session confirms the real date and re-schedules if needed)
  - **Wärtsilä** (HEL: WRT1V) — fires 2026-10-28 13:00 UTC (Jan–Sep interim report announced for 2026-10-27)
  - **CATL** (SZSE: 300750 · HKEX: 3750) — fires 2026-11-01 13:00 UTC (Q3 report due by the 2026-10-31 disclosure deadline)
  - **Fluence** (NASDAQ: FLNC) — fires 2026-11-25 14:00 UTC (Q4/FY2026 results estimated ~2026-11-24, FY ends Sep 30; the fired session confirms the real date and re-schedules if needed)
  - **Hithium & FlexGen** (private, no earnings calendar) — recurring quarterly sweep (Jan/Apr/Jul/Oct 1, ~13:00 UTC) that checks for material developments and refreshes only when warranted; recurs on its own, no re-arm

## Version & changelog interactions

- **Data-only changes** (profile JSONs, registry) do **not** bump the Profiler page version — `Profiler.html` was not modified, and the app fetches profile data fresh (`cache: no-store`) on every render, so deployed data is picked up without a page reload. [PC-HTML-VERSION] #2 fires only when `Profiler.html` itself changes
- **AFFECTED URLS partition** — a data-only change still counts as an **indirect affect** on the Profiler page (the user-facing content changed). List the page in AFFECTED URLS showing its current version
- **Page changelog** (`Profilerhtml.changelog.md`) tracks only `Profiler.html` version bumps, per the standard page-changelog rules. Profile additions/revisions are recorded in the repo CHANGELOG (`repository-information/CHANGELOG.md`) instead — e.g. "Added Sinexcel dossier (profileVersion 1)". Public-changelog security rules apply if a page entry is ever written
- **Renderer changes** (new sections, layout) follow the normal HTML page rules: version bump, meta tag sync, page changelog entry, template-separation markers (all app code lives in the PROJECT blocks)

## Recall design (why it's organized this way)

Built so a future Claude session can reconstruct full context cheaply:

- **One file read per company** — `profiler-data/<slug>.profile.json` holds the complete dossier; no cross-file joins needed
- **The registry is the index** — `profiler-companies.json` answers "which companies are covered, how categorized, how fresh" in one read
- **Field notes are one read too** — `profiler-notes.json` holds every first-hand note chronologically; filter by `slug` for one company's intel, weight by `confidence` (see the Profiler Note Command). Read it before any research, refresh, report, or prep task
- **Schema doc defines meaning** — field semantics live in PROFILER-SCHEMA.md, not in Claude's memory
- **Revisions are diffable** — `profileVersion` + `lastUpdated` + git history + repo CHANGELOG entries give a full revision trail per company
- **Reports** — when generating a report that cites covered companies, read the relevant profiles and cite their `sources` rather than re-researching from scratch; refresh a profile first if it is stale for the report's purpose

Developed by: ShadowAISolutions
