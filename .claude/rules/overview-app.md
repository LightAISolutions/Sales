---
paths:
  - "live-site-pages/Overview.html"
  - "live-site-pages/overview-data/**"
  - "repository-information/OVERVIEW-SCHEMA.md"
---

# Overview App — Company Dossier Command

*Path-scoped: auto-injects when working on the Overview app or its data. Also user-triggered on demand — the Overview Command below fires whenever the user asks for a company overview, regardless of which files are loaded. Cross-referenced from CLAUDE.md ("Overview Command" section).*

The Overview app renders standardized corporate dossiers from JSON profiles in `live-site-pages/overview-data/`. The data schema's single source of truth is `repository-information/OVERVIEW-SCHEMA.md` — read it before writing or revising any profile.

## Overview Command

If the user says **"overview \<Company Name\>"** (or similar: "add \<Company\> to Overview", "create an overview for \<Company\>", "generate a dossier for \<Company\>", "update the \<Company\> overview", or supplies a list of companies to cover):

1. **Resolve the slug** per OVERVIEW-SCHEMA.md slug rules. If the slug already exists in `overview-companies.json`, this is a **revision** (update in place, `profileVersion` +1); otherwise it is a **new profile**
2. **Research via web search** — thorough, current-date-aware sweep covering every schema section: identity/snapshot facts, products & services, technical specifications of flagship products, decision makers (names, titles, career backgrounds, verified LinkedIn URLs, company-published photos), and financial performance vs expectations for the trailing two fiscal years plus the latest interim. A background `general-purpose` subagent is the preferred vehicle so research runs while other work proceeds. Apply the authoring rules (public sources only, no fabrication, expectations honesty)
3. **Write the profile** — create or update `live-site-pages/overview-data/<slug>.overview.json` conforming to OVERVIEW-SCHEMA.md. Set `lastUpdated` to today; set/increment `profileVersion`
4. **Register it** — add or update the company's entry in `overview-companies.json` (keep `lastUpdated` in sync with the profile)
5. **Photos** — if the company publishes leadership photos, download them to `live-site-pages/images/execs/<slug>-<lastname>.jpg` and reference via the profile's `photo` field; otherwise omit the field (initials avatar renders). Never scrape LinkedIn images
6. **Batch requests** — when the user names multiple companies, run one research pass per company (parallel subagents where sensible) and land all profiles in the single interaction commit
7. **Standard treatment** — every company gets exactly the standard schema sections. No bespoke sections or special emphasis for any company (explicit developer rule; applies to Sinexcel like everyone else)
8. **Commit/push** — normal Pre-Commit + Pre-Push checklists apply (repo CHANGELOG entry, repo version bump on the push commit, README timestamp). The auto-merge workflow deploys the new data to the live site

## Version & changelog interactions

- **Data-only changes** (profile JSONs, registry) do **not** bump the Overview page version — `Overview.html` was not modified, and the app fetches profile data fresh (`cache: no-store`) on every render, so deployed data is picked up without a page reload. [PC-HTML-VERSION] #2 fires only when `Overview.html` itself changes
- **AFFECTED URLS partition** — a data-only change still counts as an **indirect affect** on the Overview page (the user-facing content changed). List the page in AFFECTED URLS showing its current version
- **Page changelog** (`Overviewhtml.changelog.md`) tracks only `Overview.html` version bumps, per the standard page-changelog rules. Profile additions/revisions are recorded in the repo CHANGELOG (`repository-information/CHANGELOG.md`) instead — e.g. "Added Sinexcel dossier (profileVersion 1)". Public-changelog security rules apply if a page entry is ever written
- **Renderer changes** (new sections, layout) follow the normal HTML page rules: version bump, meta tag sync, page changelog entry, template-separation markers (all app code lives in the PROJECT blocks)

## Recall design (why it's organized this way)

Built so a future Claude session can reconstruct full context cheaply:

- **One file read per company** — `overview-data/<slug>.overview.json` holds the complete dossier; no cross-file joins needed
- **The registry is the index** — `overview-companies.json` answers "which companies are covered, how categorized, how fresh" in one read
- **Schema doc defines meaning** — field semantics live in OVERVIEW-SCHEMA.md, not in Claude's memory
- **Revisions are diffable** — `profileVersion` + `lastUpdated` + git history + repo CHANGELOG entries give a full revision trail per company
- **Reports** — when generating a report that cites covered companies, read the relevant profiles and cite their `sources` rather than re-researching from scratch; refresh a profile first if it is stale for the report's purpose

Developed by: ShadowAISolutions
