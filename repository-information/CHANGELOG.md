# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 99/100`

## [Unreleased]

*(No changes yet)*

## [v01.99r] — 2026-08-08 07:36:43 PM EST

> **Prompt:** "Everything looks good so far. However, my goal is to eventually connect all my work related apps together such that Receipts is used for my reimbursement expenses, Profiler is used to build up and display corporate dossiers that can be updated with insights and trade news, and Scraper is used to discover relevant recent news and produce news digests. I would like to centralize all information in my bess-aidc-library repo, so make sure Profiler and Scraper store their information there. I want future reporting functions to draw from my entire pool of information. Correct me if my understanding is wrong or if there's a more efficient way to accomplish my goal.
>
> In the Profiler app specifically, I dont see where I can view previous versions of each company dossier - is that built in? Also, I want to have an option to input new information I learn about each company from trade shows and in person meetings and have the app efficiently store it and decide if it's important enough to include in the dossier."
>
> *(Via AskUserQuestion: centralization architecture — discuss more first; version-history viewer — build; note capture — GAS-backed in-app intake; Receipts in pool — not yet.)*

### Added

- **Dossier version-history viewer** (`Profiler.html` v01.07w) — "Versions 🕘" button on dossiers with archived versions; lists versions from `archive-index.json`, renders any archived dossier with an "Archived vN" banner and a one-tap return to current; study-guide probe skipped on archived snapshots; "＋ Add note" link added to the ⚙ Field Notes overlay
- **`profiler-intake` environment** — new auth-gated GAS project scaffolded via `setup-gas-project.sh` (page, `ProfilerIntake/profiler-intake.gs` v01.01g, config, version files, changelogs, GAS Projects table row, per-environment diagram, workflow deploy step). PROJECT block implements the field-note form (company/source/note/0–100 confidence slider) and server-side `submitFieldNote` — session-validated, slug-validated against the registry, LockService-serialized, committing verbatim notes to `profiler-notes.json` on `main` via the GitHub Contents API with `triage: "pending"` + `submittedVia: "profiler-intake"`. Deployment ID pending (workflow step no-ops until set)
- **Triage & promotion rules** (`.claude/rules/profiler-app.md`) — notes never edit dossiers directly; Claude evaluates pending notes at every refresh (or on "triage notes"), records `promoted (vN)` / `logged-only` outcomes, reports each decision. `triage`/`submittedVia` fields added to the Field Notes schema in `PROFILER-SCHEMA.md`

## [v01.98r] — 2026-08-08 12:14:10 AM EST

> **Prompt:** "add the date check rule"

### Added

- New Think Before Asserting extension in `.claude/rules/behavioral-rules.md`: day-of-week + date pairs must be verified with `date -d YYYY-MM-DD +%A` before being asserted — including day names supplied by the user; on conflict, the date is authoritative and the discrepancy is surfaced. Prevents the day-name drift that put "Thursday 8/14" (actually Friday) into a trigger prompt and prep documents

## [v01.97r] — 2026-08-08 12:12:16 AM EST

> **Prompt:** "The meeting is actually Friday, 8/14, and I am busy on Thursday, 8/13, so schedule this for Wednesday, 8/12."

### Fixed

- Meeting day-name corrected to **Friday 2026-08-14** in the refresher trigger prompt (`trig_01DBojuiEhM4ps3VEsZEvySv` — fire time was already Wednesday 2026-08-12 22:00 UTC and is unchanged) and in the `megmeet-lesson-plan.md` pacing line (now also notes Thursday 8/13 is blocked out). Root cause: the prior session inferred day names from conversational text instead of verifying with `date -d` — 8/12 was always Wednesday and 8/14 is Friday

## [v01.96r] — 2026-08-08 12:07:00 AM EST

> **Prompt:** "Change my Megmeet trigger from Thursday, 8/13, to Wednesday, 8/12.
>
> Then, update all the company dossier to reflect my increased priority on company products and services.
>
> Then, profiler prep the remaining companies the same way you did gor Megmeet.
>
> If you use 100% of my Fable usage and 100% of my usage credits, then pause and save your progress, then restart after my weekly fable limit resets. At that point, let me know how far you've gotten."

### Changed

- **Megmeet refresher trigger moved** to 2026-08-12 22:00 UTC (6 PM EST) — renamed "Megmeet product-tech refresher (2026-08-12)", prompt dates adjusted (`trig_01DBojuiEhM4ps3VEsZEvySv`)
- **Products-and-services priority encoded** as a standing rule: Profiler Command research step in `.claude/rules/profiler-app.md` and a new authoring rule in `repository-information/PROFILER-SCHEMA.md` — `productsAndServices[]`/`technicalSpecs[]` carry the deepest research investment
- **All 9 remaining dossiers revised to profileVersion 2** (product-focused research sweeps, ~20–35 sources each, first-party datasheets first; schemaVersion → 2; lastUpdated 2026-08-08): `byd` (7 lines, HaoHan/MC Cube/Blade, 6 spec tables), `catl` (10 lines, TENER/Qilin/Shenxing/Naxtra, 9 spec tables), `flexgen` (8 lines, HybridOS stack + Powin transition, 5 capability tables), `fluence` (8 lines, Smartstack/Gridstack Pro/Mosaic, 5 spec tables), `hithium` (6 lines, 280→1300Ah cell ladder + ∞Block, 9 spec tables), `sinexcel` (6 lines incl. new AIDC/HVDC division, 13 spec tables), `sungrow` (11 lines, SG-HX/1+X/PowerTitan 3.0, 10 spec tables), `tesla` (8 lines, Megapack 2XL/3/Megablock/Autobidder, 5 spec tables), `wartsila` (7 lines, Quantum 2/3/HE + GEMS + engines, 5 spec tables); registry `lastUpdated` synced

### Added

- **Archival system first use** — all 9 v1 dossiers archived to `live-site-pages/profiler-data/archive/<slug>.profile.v1.json` with `archive-index.json` populated (9 slugs, supersededBy 2)
- **Technology curricula for all 9 companies** (Megmeet-style, high-school-STEM baseline, concept-only flashcards, zero company trivia): in-app `<slug>.study.json` (5 sections + 15 flashcards each) and full-depth `repository-information/study-prep/<slug>/<slug>-lesson-plan.md` (5 modules, worked examples, self-tests) — every covered company now has a Study guide 📖 in the Profiler app
- README tree: 9 study.json entries, 9 archive entries, 9 study-prep directories

## [v01.95r] — 2026-08-07 11:19:48 PM EST

> **Prompt:** "I don't actually want interview prep. I want the study prep to assume I have high school level STEM knowledge and teach me whatever I need to know to understand what their products do in the grand scheme of their industry (ie: what do SSTs do in the medium voltage critical power AIDC infrastructure). Don't quiz me on company info like founding date, executive team, or headquarters location. I want to focus on each company's products and services."

### Changed

- **Profiler Prep Command redefined as a technology lesson-plan engine** (`.claude/rules/profiler-app.md`) — assumes high-school-STEM baseline, teaches what the products do in their industry context via concept-gap analysis; standing rule: never quiz company trivia (founding dates, executives, HQ). Output moves to `repository-information/study-prep/<slug>/<slug>-lesson-plan.md`
- **Study Guide schema semantics updated** (`repository-information/PROFILER-SCHEMA.md`) — sections teach concepts progressively; flashcards quiz concept/product understanding only
- **`megmeet.study.json` rewritten as a technology curriculum** — 5 modules (power-electronics fundamentals → legacy data-center power chain → the 800VDC shift with every Megmeet product mapped to its slot, incl. what an SST does in MV critical-power AIDC infrastructure → the same physics across VFDs/EV/appliances/welding → industry map & economics) + 15 concept flashcards. Data-only change — no Profiler page version bump
- **Wednesday 8/13 trigger reworked** (`trig_01DBojuiEhM4ps3VEsZEvySv`, renamed "Megmeet product-tech refresher") — now delivers a product/technology refresher + trailing-week news; interview-cram framing, talking points, and company trivia removed
- CLAUDE.md Profiler Command pointer updated to describe the technology-lesson-plan behavior

### Removed

- `repository-information/interview-prep/` and its 4 interview-oriented files (study guide, schedule, cram flashcards, Q&A prep) — replaced by `repository-information/study-prep/megmeet/megmeet-lesson-plan.md` per the developer's redirection away from interview prep

### Added

- `repository-information/study-prep/megmeet/megmeet-lesson-plan.md` — full-depth 5-module technology curriculum with worked efficiency/PUE math, product-by-product 800VDC chain walkthrough, and a concept self-test

## [v01.94r] — 2026-08-07 11:02:33 PM EST

> **Prompt:** "Regarding my Profiler app:
> - I want each Company profile to accept new information that I learn about the company from industry contacts or in-person events, store it somewhere easily accessible to recall for future reports, and create a visible summary of each new input in the form of a chronological changelog (create a Settings cog icon in the bottom right of dashboard that leads to this changelog).
> - I also want to use this app to identify gaps in my understanding towards a target company and create a lesson plan (any and all formats that best accomplish the job) to teach me important "need-to-know" information about their key products and services. The real life scenario I am facing is: I am job hunting right now and am interviewing with many of the companies in this Profiler app. The most immediate need is Megmeet, which I have a scheduled interview with on Thursday, 8/14, 10am. I want to seem like I have done my homework and know their core business. Recommend an action plan for me to approve."
>
> *(Plan approved via AskUserQuestion: all 3 phases; notes stored public + verbatim with a developer-rated 0–100 confidence score; lesson plans both private docs and sanitized in-app; Wednesday cram trigger yes.)*

### Added

- **Field Notes system** — `live-site-pages/profiler-data/profiler-notes.json` (chronological log, schema v1: id/date/slug/sourceType/verbatim note/developer-rated 0–100 confidence/tags); "Profiler Note Command" + confidence-weighting rules in `.claude/rules/profiler-app.md`; Field Notes schema in `repository-information/PROFILER-SCHEMA.md`; ⚙ cog (dashboard, bottom-right) + chronological changelog overlay with company filter chips and confidence badges in `Profiler.html` (v01.06w)
- **Study guide system** — Study Guide schema (`<slug>.study.json`) in PROFILER-SCHEMA.md; "Profiler Prep Command" (gap analysis → private prep pack in `repository-information/interview-prep/<slug>/` + sanitized in-app guide) in `profiler-app.md`; "Study guide 📖" dossier button + overlay with tap-to-flip flashcards in `Profiler.html`
- **Megmeet dossier** — `megmeet.profile.json` (profileVersion 1, schema v2) from a two-agent research sweep (~65 first-party + third-party sources); registered in `profiler-companies.json` (10 companies covered)
- **Megmeet prep pack** — `megmeet.study.json` (in-app, sanitized) + private `repository-information/interview-prep/megmeet/` (study guide, day-by-day schedule to 8/14, flashcards, Q&A prep)
- **Cram trigger** — one-shot Routine `Megmeet interview cram — night before (2026-08-13)` (`trig_01DBojuiEhM4ps3VEsZEvySv`), fires 2026-08-13 22:00 UTC in a fresh session to produce `megmeet-cram-sheet.md` from trailing-week news; push + email notification on completion

### Changed

- CLAUDE.md "Profiler Command" section extended with the `profiler note` and `profiler prep` trigger phrases
- README tree: new profiler-data entries, `interview-prep/` section, Profiler version display → v01.06w

## [v01.93r] — 2026-08-07 09:58:47 PM EST

> **Prompt:** "I reinstalled the Profiler app and it still opens a browser instead of looking like a standalone app"

### Fixed

- Profiler wouldn't install as a standalone PWA because the installed Receipts app claimed scope `./` (the whole site) — Chrome refuses to offer install for a page inside an installed PWA's scope (documented in w3c/manifest #1180/#1209). Narrowed both manifests to per-app scopes (`profiler.webmanifest` → `./Profiler.html`, `receipts.webmanifest` → `./Receipts.html`) and added distinct `id` fields to pin each app's identity. No page version bumps — no HTML files changed; manifests are fetched fresh at install time

## [v01.92r] — 2026-08-07 09:49:43 PM EST

> **Prompt:** "continue with your recommendation."

*(Executes the prior response's recommendation — make Profiler installable as a PWA like Receipts.)*

### Added

- `live-site-pages/profiler.webmanifest` — PWA manifest (`display: standalone`, ink theme `#13151c`, start URL `./Profiler.html`)
- `live-site-pages/images/profiler-icon-192.png` + `profiler-icon-512.png` — home-screen icons rendered from `profiler-logo.svg` via headless Chromium; the 512 is `any maskable` with the emblem composited at 80% on a full-bleed ink field so circular/squircle masks never clip the gold border

### Changed

- `Profiler.html` (v01.05w) — added `<link rel="manifest">`, `theme-color`, `apple-touch-icon`, and the three Apple PWA meta tags; CSP `manifest-src` overridden `'none'` → `'self'` with a `PROJECT OVERRIDE` comment mirroring the Receipts pattern. Verified in headless Chromium: manifest fetches through the CSP, both icons serve 200, no new console errors

## [v01.91r] — 2026-08-07 03:26:14 AM EST

> **Prompt:** "In my Profiler app, verify the Sinexcel refresh. Also, choose a suitable logo for this app and replace the placeholder."

### Added

- `live-site-pages/images/profiler-logo.svg` — Profiler app logo: a dossier-card emblem in the app's own palette (ink `#1d212d`, paper `#e9e4d6`, gold `#d8b45a`) with a photo-frame profile silhouette, index lines, and a gold verification seal

### Changed

- `Profiler.html` (v01.04w) — `SPLASH_LOGO_URL` now points at `images/profiler-logo.svg`, so the Website Ready / Code Ready splashes and the maintenance screen show the app's own logo. `DEVELOPER_LOGO_URL` / `YOUR_ORG_LOGO_URL` intentionally left on the placeholder — they carry developer/org branding semantics, not app branding, and are not consumed by the page. (Same interaction also verified the Sinexcel scheduled refresh — trigger armed and preconditions consistent; no changes were needed for that part)

## [v01.90r] — 2026-08-07 02:00:31 AM EST

> **Prompt:** "continue with your recommendation"

*(Executes the v01.89r recommendation — extend the scheduled-refresh convention to every remaining covered company.)*

### Added

- Armed one-shot scheduled refresh triggers for the remaining public companies, each firing a fresh session the day after its report and following the full Profiler Command (verify-published gate → dual-agent research → archive-first → refresh → self-re-arm with tooling fallback): BYD 2026-08-30 15:00 UTC (staggered 2h after Sungrow — both report 2026-08-29), Tesla 2026-10-22 (estimate-based; fired session confirms the real date), Wärtsilä 2026-10-28 (announced 2026-10-27), CATL 2026-11-01 (2026-10-31 disclosure deadline), Fluence 2026-11-25 14:00 UTC (estimate-based, FY ends Sep 30)
- Quarterly private-company sweep Routine for Hithium & FlexGen (cron: Jan/Apr/Jul/Oct 1, ~13:00 UTC; next fire 2026-10-01) — checks for material developments, refreshes dossiers archive-first only when warranted, makes no commits otherwise

### Changed

- Upgraded the pre-existing Sinexcel trigger (fires 2026-08-12) to the improved prompt template — verify-published gate and self-re-arm now carry the trigger-tooling fallback (REMINDERS.md note if `create_trigger` is unavailable in the fired session)
- `.claude/rules/profiler-app.md` Scheduled Refreshes section now lists the full armed roster (7 companies + the private-company quarterly sweep) with tickers, fire times, and date-confidence notes

## [v01.89r] — 2026-08-07 12:34:58 AM EST

> **Prompt:** "Continue from where you left off."

*(Continuation after a tool-approval interruption — completes the in-flight Overview → Profiler rename, dossier archival system, and scheduled Sungrow refresh.)*

### Changed

- Renamed the Overview app to **Profiler** across the repo: `Overview.html` → `Profiler.html` (v01.03w), `overview-data/` → `profiler-data/`, `<slug>.overview.json` → `<slug>.profile.json`, `overview-companies.json` → `profiler-companies.json`, `OVERVIEW-SCHEMA.md` → `PROFILER-SCHEMA.md`, `Overviewhtml.*` version/changelog files → `Profilerhtml.*`, `.claude/rules/overview-app.md` → `profiler-app.md` — plus all content references (page title/header/exports, CLAUDE.md Profiler Command section + Reference Files row, README tree, REPO-ARCHITECTURE.md flowchart node with regenerated mermaid.live URL, changelog headers)
- Profiler Command trigger phrase is now "profiler \<Company\>" (was "overview \<Company\>")

### Added

- Dossier archival system: `live-site-pages/profiler-data/archive/` with `archive-index.json` — every profile revision now archives the superseded version as `<slug>.profile.v<N>.json` before overwriting, with best-effort mirroring to the `bess-aidc-library` repo (Archival Procedure in `.claude/rules/profiler-app.md`)
- Scheduled refresh convention + first armed trigger: one-shot Routine "Profiler refresh — Sungrow (post-H1 2026)" fires 2026-08-30 13:00 UTC (day after Sungrow's scheduled 2026-08-29 H1 report), runs the full Profiler Command in a fresh session, and re-arms itself for the next reporting period (Scheduled Refreshes section in `profiler-app.md`)

## [v01.88r] — 2026-08-07 12:02:06 AM EST

> **Prompt:** "continue with your recommendation"

*(Executes the approved upgrade package with gradual backfill — recommendation from the v01.87r response.)*

### Added

#### `Overview.html` — v01.02w

##### Added
- Recent Developments section: per-event timeline rows (`.ov-dev` — date column, category chip, headline, italic "→ strategy takeaway", source line) rendered between Products & Services and Strategy Read; driven by the new `recentDevelopments[]` schema field
- Strategy Read section: gold-bordered `.ov-strategy` box with a prominent "Analysis — inference from the sourced facts, not company statements" tag, rendering the new `strategyRead[]` bullets
- Product depth rows: optional `positioning` / `soldThrough` / `targetSegments` / `roadmap` fields render as labeled key-value lines under each product entry
- Export document builder (`ovBuildDoc`) and Word CSS carry all three additions, so exported Word/PDF dossiers include the new sections
- Verified via a route-intercepted v2 fixture (both new sections + 3 product depth rows render in dossier and export preview; zero console errors) plus the full v1 regression pass (all 9 existing profiles render unchanged)

#### `repository-information/OVERVIEW-SCHEMA.md`

##### Added
- Schema v2: `recentDevelopments[]` (dated, categorized, trailing 12–18 months, newest first, one-line `read` per event), `strategyRead[]` (labeled-analysis bullets), and the four optional product depth fields; new authoring rules "Analysis stays labeled" and "Recent-developments window"; v1 profiles remain valid (renderer skips absent sections)

#### `.claude/rules/overview-app.md`

##### Changed
- Default research vehicle is now **two parallel subagents per company** (first-party Stage 1 + third-party Stage 2, ~50–70 evaluated sources, ~250–350k tokens); single-agent kept for thin/private subjects, three-agent sweep reserved for user-flagged high-stakes targets; research must cover the v2 sections; existing dossiers upgrade on their next natural refresh (gradual backfill, per developer choice)

## [v01.87r] — 2026-08-06 11:27:45 PM EST

> **Prompt:** "These overviews are kind of useful, but don't provide me enough insight into their products/services and don't include recent news highlights that can give me insight into their sales/product strategy. Can you think of and recommend ways to improve the quality of the overviews? 
>
> I also noticed that each company overview only has around 12-16 sources. Why not evaluate more sources to get more information? What is the maximum number of sources I can look up before either it starts costing tokens or starts taking more than 30-minutes to generate a single corporate overview?
>
> Also, note that I want source priority to be: target company's Investor Relations and Press Release pages > trade news sites. Always make sure to fully scrape all relevant information from the target companies themselves first."

*(Quality-upgrade approval question went unanswered — upgrades remain proposed; only the source-priority directive is implemented in this version.)*

### Added

- `.claude/rules/overview-app.md` — **Source Priority Protocol** (developer directive) added to the Overview Command's research step: Stage 1 exhaustively scrapes the target company's own channels first (Investor Relations, complete press-release archive ≥24 months, product/datasheet pages, leadership pages); Stage 2 uses third-party sources only to fill gaps and supply what the company cannot credibly self-report (consensus/expectations, independent rankings, critical context); `sources[]` citation order puts first-party pages first; research prompts must state the protocol explicitly
- `repository-information/OVERVIEW-SCHEMA.md` — matching **Source priority** authoring rule (first-party ground truth scraped fully first; trade press second; first-party listed first in `sources[]`)

## [v01.86r] — 2026-08-06 10:51:29 PM EST

> **Prompt:** "overview Sungrow, Tesla, Fluence, CATL, Flexgen, Wartsila, BYD"

### Added

- Seven company dossiers via the Overview Command batch mode (7 parallel research subagents), all at profileVersion 1 in `live-site-pages/overview-data/`:
  - `sungrow.overview.json` — supplier; SZSE: 300274; #1 in Wood Mackenzie's 2025 BESS-integrator AND PV-inverter rankings; PowerTitan 2.0/3.0 + 1+X 2.0 specs; FY2025 ESS revenue overtook inverters (RMB 37.3B, 43 GWh); Q1 2026 miss captured
  - `tesla.overview.json` — supplier; NASDAQ: TSLA; energy-division focus (Megapack 3 / Megablock / Powerwall 3 specs, 46.7 GWh 2025 deployments); FY2024–Q2 2026 results vs consensus incl. the Q2 2026 EPS miss and $240M warranty charge
  - `fluence.overview.json` — integrator; NASDAQ: FLNC; Smartstack/Gridstack Pro specs; the FY2025 guidance-collapse trajectory and FY2026 cut documented vs guidance; 5 company-published exec headshots downloaded from the official leadership page
  - `catl.overview.json` — supplier; SZSE: 300750 · HKEX: 3750; TENER Stack / TENER Sodium specs; FY2024 miss → FY2025 beat → H1 2026 storage +87.5%; US 1260H/procurement-ban headwinds noted
  - `flexgen.overview.json` — integrator; private; HybridOS capability profile (absent OEM/cert lists flagged explicitly); Powin asset acquisition ($36M) and CES acquisition; funding history; verified LinkedIn URLs for CEO/CFO
  - `wartsila.overview.json` — integrator; HEL: WRT1V; Quantum2/Quantum3 + GEMS specs; the two-stage storage-ownership outcome (2025 retention → June 2026 50/50 RCT Solutions JV) with segment financials; 4 official board-of-management headshots
  - `byd.overview.json` — supplier; SZSE: 002594 · HKEX: 1211; HaoHan 14.5 MWh / Chess Plus specs; FY2025 consensus misses amid the EV price war; 12.5 GWh SEC and 11.3 GWh Masdar orders; storage-division leadership change (Yin Xueqin)
- `live-site-pages/images/execs/` — nine company-published executive headshots (Fluence ×5, Wärtsilä ×4) referenced by the profiles' `photo` fields; executives without published headshots render initials avatars
- All seven companies registered in `overview-companies.json` (9 companies total) and the README tree

### Changed

- `README.md` — `overview-data/` listing expanded to all nine profiles; `images/execs/` subdirectory entry added

## [v01.85r] — 2026-08-06 10:09:14 PM EST

> **Prompt:** "overview Hithium"

### Added

- `live-site-pages/overview-data/hithium.overview.json` — Hithium dossier (profileVersion 1) via the Overview Command: identity (private; A-share attempt withdrawn 2023, both HKEX applications lapsed — the second in April 2026), six product/service lines (∞Cell LFP cells 280Ah→1300Ah, ∞Block/∞Power containers to 6.9 MWh, sodium-ion N162Ah, C&I, HeroEE residential, Texas/Spain localized manufacturing), four flagship spec tables (∞Cell 1175Ah, ∞Cell 1300Ah, ∞Power 6.25 MWh, ∞Power 6.9 MWh 8h), nine decision makers (four ex-CATL executive directors incl. founder Wu Zuyu; no verified LinkedIn profiles or usable official headshots — initials avatars render), FY2023/FY2024/H1-2025 prospectus financials with shipment rankings (global No. 5 → No. 3 → Top 2) and risk context (CATL litigation >RMB 240M claimed, equity freeze, subsidy-dependent FY2024 profit), 18 cited sources with access dates
- Registered Hithium in `overview-companies.json` (supplier, Xiamen; registry `lastUpdated` in sync) and added the profile to the README tree

### Changed

- `README.md` — `overview-data/` tree listing gains `hithium.overview.json`

## [v01.84r] — 2026-08-06 09:50:12 PM EST

> **Prompt:** "Create an export button that allows the user to export the overview file in either Word or PDF formats, with a Preview screen before exporting to give the user a chance to catch mistakes."

### Added

- `Overview.html` (v01.01w) — "Export dossier ⬇" button in the dossier header → full-screen export preview overlay (`#ov-prev-overlay`) with a sticky toolbar and a light "paper" rendering of the complete dossier (`ovBuildDoc()`: letterhead, snapshot facts table, products, spec tables, decision makers, financials-vs-expectations tables, sources, generated-timestamp footer) so mistakes can be caught before exporting
- Word export (`ovWordExport()`): serializes the preview document into a standalone Word-compatible HTML payload (UTF-8 BOM + Office XML namespaces + embedded print-friendly CSS) and downloads it as `<slug>-overview-<date>.doc` — opens directly in Microsoft Word with editable text and tables
- PDF export: `window.print()` against a dedicated `@media print` block that isolates the preview document (everything else hidden, toolbar stripped, page-break rules on section headings and tables) — "Save as PDF" in the print dialog yields a clean, text-searchable PDF with zero vendored libraries (CSP stays closed to external hosts)
- Preview UX: Esc key and backdrop click both close the overlay; toolbar is sticky while the document scrolls. Playwright-verified end to end (preview renders all six document sections, `window.print` invocation stubbed and confirmed, real `.doc` download captured and byte-checked for the BOM+HTML header, Esc close, zero console errors)

## [v01.83r] — 2026-08-06 09:38:07 PM EST

> **Prompt:** "I want to create corporate overviews of all companies in my ecosystem (suppliers, developers, integrators, investors, hyperscalers, advisors, etc) that aims to educate the reader on what the company does (products and/or services), who their decision makers are (ie: executive team with profile picture + work experience from LinkedIn), their financial performance vs expectations in past two years, detailed technical specifications on their products and services, and potentially more later. Create an app called "Overview" that will create these overviews as long as I give it a company name. I also want it to be organized optimally for Claude to recall these for future revisions or reports. Thus, should I create this app in my Sales repo or my BESS-AIDC-Library repo? I am leaning towards the Sales repo because this repo was created to contain all apps that I can use in my Sales job. Let me know if you disagree.
>
> Also, I am no longer working at Sinexcel, so make sure to add Sinexcel as a covered company, but do not give it special treatment, such as creating new sections called "Relevance for Sinexcel". Recommend me an action plan to approve."

*(User chose "Approve — build now" and "Company-published photos + initials fallback" for exec pictures via AskUserQuestion.)*

### Added

- `Overview.html` — new ecosystem company dossier app (v01.00w, built from the noauth template — splash, version polling, and changelog popup inherited): roster view with category filter chips (supplier / developer / integrator / investor / hyperscaler / advisor) and search, plus a per-company dossier view rendering Snapshot facts, Products & Services, Technical Specifications tables, Decision Maker cards (company-published photos with initials-avatar fallback + LinkedIn links when verified), Financial Performance vs Expectations tables with beat/miss/inline verdicts, and a cited Sources list. Hash-routed; all app code inside PROJECT markers. Playwright-verified end to end (roster, search empty state, full dossier render, back navigation — zero console errors)
- `live-site-pages/overview-data/` data layer: `overview-companies.json` registry (roster, categories, freshness) and `sinexcel.overview.json` pilot profile (profileVersion 1) — Sinexcel covered with standard treatment: four business lines, StellaON 1250K/1575K + SEC480 + Ultra AHF spec tables, 10 decision makers with career backgrounds, FY2024 / FY2025 / Q1-2026 results vs expectations, 16 cited sources with access dates
- `repository-information/OVERVIEW-SCHEMA.md` — single source of truth for the registry and profile schemas: slug rules, field tables, authoring rules (public sources only, no fabrication, expectations honesty, photo policy, standard treatment for every company), and the schema-extension procedure
- `.claude/rules/overview-app.md` — the "overview \<Company\>" command (research → profile JSON → registry → commit), data-vs-page versioning interactions, and the recall design (one file read per company, registry as index, diffable revisions); registered in CLAUDE.md via a new "Overview Command" pointer section and a Reference Files table row

### Changed

- `README.md` — tree entries for the new page (Internal Sites), `overview-data/` directory, `Overviewhtml.version.txt`, Overview changelog + archive, `OVERVIEW-SCHEMA.md`, and `overview-app.md`
- `repository-information/REPO-ARCHITECTURE.md` — flowchart gains the `Overview.html` environment node with serves / version-polling / template-copy edges; mermaid.live pako URL regenerated and decompression-verified

## [v01.82r] — 2026-08-05 10:26:18 PM EST

> **Prompt:** "I added Allen as a test user and he confirmed that he could sign in. 

1. Add a preview feature after the Pivot Builder wizard so users can catch a mistake and redo the Pivot Builder rather than find out after the export is completed.

2. Make sure that this app is calibrated to scan and extract information from commercial invoices as well as typical receipts."

### Added

#### `Receipts.html` — v01.30w

##### Added
- Export designer Preview step (step 4) — the Values & sheets step's primary button is now "Preview"; `rxFetchPreview()` calls the new `exportPreview` op and renders the exact server-computed Pivot grid as a scrollable table (`.rx-prev-wrap`, sticky header, bold totals row, truncation notes) with Back returning to the wizard state intact and "⬇️ Export" running the real export; labels localize via `rxLbl()` (t() + tCat())
- "Business" receipt category with subcategories Inventory & Resale, Supplies & Packaging, Equipment, Freight & Shipping, Deposits & CRV, Professional Services — added to `CATEGORIES`/`SUBCATS` (propagates to History/Reports filters and the review screen) with 中文 display names in `I18N_CAT_ZH`

##### Changed
- Photo compression max dimension raised 1600px → 2000px so small print on dense letter-size commercial invoices stays legible for extraction

#### `Receipts.gs` — v01.18g

##### Added
- `previewExportPivot` + `exportPreview` dispatcher branches (POST + GET fallback) — returns the pivot grid as JSON without creating a spreadsheet; grids truncated for transport at 60 data rows / 13 data columns (header + totals always kept) with `truncatedRows`/`truncatedCols` counts
- "Business" in `RECEIPT_CATEGORIES` + six invoice subcategories in `ITEM_CATEGORIES` (extraction schema enums)

##### Changed
- Refactored export internals: `gatherExportData_` (session/owner/receipts/line-items gather) and `buildReceiptPivot_` (cross-tab grid) are now shared by `exportReceipts` and the preview, guaranteeing the preview matches the exported Pivot sheet
- Gemini extraction prompt recalibrated for commercial invoices — vendor→merchant, invoice date (not due/ship date), grand total, Business category, per-line deposits/freight/discount handling (negative amounts for credits), case/pack qty×unit-price semantics with printed extended totals preferred, capture-every-line instruction for long invoices, and Business subcategory guidance

## [v01.81r] — 2026-08-05 10:12:22 PM EST

> **Prompt:** "Allen is the owner of a liquor store and frequently needs to scan, document, and organize invoices of all applicable retail expenses. I want to let him use this Receipt app to scan his invoices and export them in a dynamically-controllable way for whatever purposes he may have. I think it would be good to add an additional prompt that pops up when the Export button is pressed that goes through a short process to figure out which data categories he wants in the X and Y axes or not included. Recommend a couple solutions for me to choose from."

*(User chose the "Pivot Builder wizard" option via AskUserQuestion.)*

### Added

#### `Receipts.html` — v01.29w

##### Added
- Export designer wizard — tapping "⬇️ Export .xlsx" now opens a 3-step modal (`#rx-overlay`/`#rx-modal`, rendered per-step by `rxRender()`): Rows / Y axis (category, subcategory, merchant, month, week, line item), Columns / X axis (none, month, category, merchant), Values (receipt totals, line-item costs, purchase counts) plus include-toggles for the Receipts / LineItems / Monthly Summary sheets; Export sends the config as a `pivot` JSON param, last-used config persists in localStorage `Receipts_export_cfg`, labels follow the app language (new `I18N_ZH` entries), outside-tap/Cancel dismiss, and `showAuthWall()` hides the overlay

#### `Receipts.gs` — v01.17g

##### Added
- `exportReceipts` accepts an optional `pivot` JSON param (both dispatcher call sites) and prepends a cross-tab **Pivot** sheet — rows × columns aggregation with row/column/grand totals, frozen headers; subcategory/item rows and item-cost values aggregate over line items (read once up front), other combinations over receipts; a `nextSheet_` helper orders Pivot → Receipts → LineItems → Monthly Summary and honors the sheet include-toggles. Legacy calls without the param keep the original three-sheet workbook

##### Fixed
- `exportReceipts` referenced an undeclared `ownerEmail` in the Monthly Summary owner filter (latent since the combined-view refactor in v01.43r) — any export where the Monthly Summary tab had data rows would throw a ReferenceError and fail; the filter now uses the export's resolved owner set (also fixes combined exports to include shared owners' summary rows)

## [v01.80r] — 2026-08-05 05:26:52 AM EST

> **Prompt:** "I am rating articles in Articles and it constantly fails and shows the error message: "Could not save feedback (http_404)". What's wrong and fix it."

### Fixed

#### `Scraper.gs` — v01.29g

##### Added
- `setArticleVerdicts` batch action (registered): applies up to `SCRAPER_VERDICT_BATCH_MAX`(40) absolute verdict values in one request + one Articles-tab scan; skips malformed verdicts and foreign-owner/project rows; returns `{saved, failed}` id lists; one audit row per batch. Exists because Google's /exec front-end intermittently 404s individual requests (redeploy serving flap — the root cause of the user's 36 consecutive `http_404` failures); one batched call minimizes exposure. Unit-tested 9/9 (multi-apply incl. clear, col-12 writes, foreign-row skip + failed reporting, malformed skip, bad payload)

#### `Scraper.html` — v01.32w

##### Fixed
- Verdict saving reworked from per-tap request (2 attempts then "gave up") to an offline-tolerant queue: `scVerdictClick` applies optimistic UI + enqueues into localStorage (`scraperVerdictQueue`, latest-tap-wins per article); `scFlushVerdicts_` batches everything pending into one `setArticleVerdicts` call with exponential backoff retries forever (5s→60s cap), flushes on page load (queue survives reloads), drops server-confirmed and not-found ids, warns once while unreachable and confirms when saved. Replaces `scSendVerdict` (the retry-twice transport this queue supersedes). Rating buttons never lock, so rapid-fire rating is instant. Playwright-tested: optimistic UI + queue growth under a full 404 storm, single-batch flush of both ratings on recovery, reload-with-pending auto-flush

## [v01.79r] — 2026-08-05 03:35:45 AM EST

> **Prompt:** "I want a floating notification window that saves previous notifications with their respective timestamps. I want to be able to start a Backfill step, walk away from my computer, come back and know for sure whether or not Backfill finishes. This applies for all functions."

### Added

#### `Scraper.html` — v01.31w

##### Added
- Notification history subsystem: `scNotify_` appends every toast (`scToast` hook — results and errors for ALL actions) plus a "▶ \<label\> — started" entry (hooked into `scProgShow`'s bar-creation branch) to a localStorage log (`scraperNotifLog`, capped at 100, newest first) so history survives deploy auto-reloads. A started entry with no matching finish identifies an interrupted run
- 🔔 header button with unread badge (count of entries newer than `scraperNotifSeen`; opening the panel marks all read) and a floating `#sc-notif-panel` (fixed top-right, z 9000 — below the auth wall and version pill) listing timestamped entries via `toLocaleString`, errors in red, with Clear/close controls; live-updates while open
- `showAuthWall()` hides the panel (PROJECT OVERRIDE addition to the deactivate-authenticated-UI block). Playwright-tested: badge count after a Compile run (start + finish entries), newest-first ordering with timestamps, badge reset on open, persistence across a full page reload, Clear

## [v01.78r] — 2026-08-05 03:13:25 AM EST

> **Prompt:** "I completed Ootion A and added the scSchedulerTick hourly trigger, but the red banner still exists - What's wrong and fix it. Also, now that I have archived junk (left with 300+ articles) and added new keywords to the plan and rebuilt it, what are my next steps, why, and the cost."

### Fixed

#### `Scraper.gs` — v01.28g

##### Fixed
- `getSchedulerHealth` false negative on manually added triggers: verification relied solely on `ScriptApp.getProjectTriggers()`, which throws without the `script.scriptapp` scope — so a real, working hand-added trigger was still reported "not installed". Now `scSchedulerTick` writes a `SCHEDULER_LAST_TICK` heartbeat property at the top of every run (before the lock, so even lock-busy ticks heartbeat), and `getSchedulerHealth` trusts a <2h heartbeat first (no permission needed), falls back to ScriptApp, and returns `unverified: true` when neither works. Unit-tested 13/13 (heartbeat-beats-permission, stale heartbeat, scriptapp fallback, lock-busy heartbeat)

#### `Scraper.html` — v01.30w

##### Fixed
- Scheduler banner gains a third state: `unverified` renders an amber "can't verify yet — clears automatically after the first hourly run" notice instead of the red "NOT running" alarm, which was wrong (and alarming) right after a manual trigger add. Playwright-tested (amber text/background, no red text, banner clears on heartbeat-verified health)

## [v01.77r] — 2026-08-05 02:57:13 AM EST

> **Prompt:** "scheduler result: 1) confirmed not anywhere in Inbox; 2) Reports tab has no rows; 3) chip on project card still says "first run pending"; 4) No triggers exist in my google apps script even after I reloaded the Scraper page (did not reinstall this trigger). Also, when I rebuilt my plan, it removed the keywords I just added and went back to the original 24 keywords. Shouldn't Rebuild override the original keyword plan with the new plan + my new keywords?"

### Fixed

#### `Scraper.gs` — v01.27g

##### Fixed
- Scheduler root cause identified: the manifest's explicit `oauthScopes` lacks `https://www.googleapis.com/auth/script.scriptapp`, so every `scEnsureSchedulerTrigger_` call (`ScriptApp.getProjectTriggers`/`newTrigger`) throws a permissions error that doGet's try/catch swallowed — no trigger, no runs, no email, zero trace. New `getSchedulerHealth` action re-attempts the install and returns `{installed, triggers, error}` with the real error text so the UI can surface it (requires a one-time manual fix: add the trigger in the editor, or add the scope + re-consent)

##### Changed
- Rebuild preserves manual additions: `QueryPlans` gains a `Manual` column; `scGetPlan_`/`scSavePlan_` round-trip it (legacy rows parse as empty), `addPlanQuery` records each user-added group, and `planQueries` puts stored manual groups FIRST, drops exact-dupe AI groups, caps at `SCRAPER_PLAN_TOTAL_MAX`, and returns `manual` to the client. Unit-tested 19/19 (roundtrip incl. legacy rows, manual tracking, rebuild preservation/dedupe/no-prior-plan, health error surfacing)

#### `Scraper.html` — v01.29w

##### Added
- `scCheckSchedulerHealth_` on every project-list load: when `getSchedulerHealth` reports the trigger missing, a red `#sc-sched-warn` banner renders above the list with Google's error and the manual fix steps (Triggers → scSchedulerTick → hourly); banner clears once installed
- Manual plan groups badged "· added by you" in `scShowPlan_` (new `manual` param threaded through all callers); Rebuild status reports "(your N manual additions kept)" and the button title no longer claims manual additions are replaced. Playwright-tested: banner content/clearing, badges, rebuild preservation rendering

#### `gas-project-creator.html` — v01.02w

##### Fixed
- Manifest template now includes the `script.scriptapp` OAuth scope (also propagated to `sample-components/appsscript.json` and the setup steps in `.claude/rules/gas-scripts-reference.md`) so new projects can self-install time-driven triggers

## [v01.76r] — 2026-08-05 02:34:08 AM EST

> **Prompt:** "When I am adding new keywords into my Plan, it processes extremely slowly, doesn't always add it to the Plan, and when it does, it doesn't update the keyword list in real time so I don't know it's added. Also, the scheduler did not work this morning; I never got an email at jonyang92@gmail.com."

### Fixed

#### `Scraper.gs` — v01.26g

##### Fixed
- Lost-update race in `addPlanQuery`: the read-AI-write sequence now runs under a `LockService` script lock (`tryLock(15000)` → `plan_busy`; release in `finally` covers all early returns) — previously an overlapping retry read the pre-add plan and its save silently dropped the first keyword. `plan_duplicate` now also returns the full `queries` list. Unit-tested: busy/no-save, acquire+release on happy path, release on duplicate and AI-error early returns
- Scheduler poison loop: `scRunScheduleStep_` now counts consecutive failed ticks (`run.fails`, `run.lastError`); after `SCRAPER_SCHED_MAX_FAILS`(6) it abandons the cycle — advances Next Run, clears state, writes a `scheduled-run-failed` audit row, and (for email/both delivery) sends a failure-notice email with the phase and error. Previously a persistent error retried hourly forever with total silence (the likeliest cause of the missed morning email). Counter resets on any successful phase step. Unit-tested through 6 stubbed failing ticks
- `scEnsureSchedulerTrigger_` re-verifies the hourly `scSchedulerTick` trigger against `ScriptApp.getProjectTriggers()` every 24h (property now stores the last verification timestamp; legacy `'1'` counts as stale) — a deleted trigger self-heals within a day instead of never
- `scDeliverBrief_` email failures now log the `MailApp` error to the audit log (`brief-email-failed`) instead of only recording an opaque `email_failed` status

#### `Scraper.html` — v01.28w

##### Changed
- `scPlanAdd_` rebuilt: optimistic pending `<li>` ("evaluating and saving…") inserted at the top on press; on success the panel re-renders from the server's authoritative `data.queries` via `scShowPlan_` (highlighting the group containing the term); on transport failure a `getQueryPlan` verify-then-report pass renders the truth ("saved" vs "NOT added — try again"); post-render control refs re-fetched by id. New `plan_busy` error string. Playwright-tested: pending row visible while the add route is held open, authoritative re-render + highlight + provenance refresh, lost-reply verification path

## [v01.75r] — 2026-08-04 08:27:47 PM EST

> **Prompt:** "There's not much noticeable change. Sometimes it's fast and sometimes it never loads. Also, I pressed Rebuild and looked away. When I looked back, I was back in the Plan page and was not sure if the Rebuild went through. Check and tell me; Then make sure all buttons give a result and recommended next step."

### Added

#### `Scraper.html` — v01.27w

##### Added
- Plan panel provenance line in `scShowPlan_`: "N query groups · saved <plannedAt>" (`toLocaleString` on the QueryPlans ISO timestamp; `'just now'` after in-session build/rebuild) — makes a Rebuild verifiable even when the confirmation is lost to a deploy-triggered auto-reload
- Recommended-next-step text appended to every completion toast (Compile→Analyze, Backfill→Enrich→Analyze, Deep backfill→Analyze, Enrich→Analyze, Analyze→rate/Stats, Archive junk→Backfill, Plan build/Rebuild→Compile or Backfill); `scToast` gained a duration param (completion toasts 9s, errors default 8s)
- Data-driven `Recommended next:` line in the Stats footer (`scRenderStats_`): archivable junk → Archive junk; unscored → Analyze; preview coverage <80% → Enrich; ratable pool → rate verdicts; else grow via Backfill

##### Fixed
- 90s AbortController watchdog (`_fetchT`) on both POST and GET paths in `_gasPost` — a hung fetch previously never settled, leaving the pressed button disabled forever with no error ("sometimes it never loads"); now it rejects with `no reply after 90s`, every handler's existing `.catch` surfaces it, and the button recovers. Verified via Playwright (provenance line, rebuild next-step status, stats recommendation) + static wiring assertions

## [v01.74r] — 2026-08-04 08:11:10 PM EST

> **Prompt:** "It takes a long time for each of my button (Plan, Backfill, etc) presses to register. Can you speed that up?"

### Changed

#### `Scraper.gs` — v01.25g

##### Changed
- API-first `doGet` routing (PROJECT OVERRIDE): the GET api/deploy routes are now matched before the page-boot work — previously every GET-fallback API call paid `ensureScriptProperties_` + `registerSelfProject()` (opens the Master ACL spreadsheet, ~1–2s) + `scEnsureSchedulerTrigger_` before the action even ran. Boot work still runs for page-shell and listener-page loads
- `ensureScraperTabs_` guarded by an execution-global + 6h `CacheService` flag (key embeds the tab count, so adding a tab to `SCRAPER_TAB_HEADERS` auto-invalidates); the ~10 per-press `getSheetByName` probes now run at most once per cache window, failing open if CacheService is unavailable. Unit-tested 15/15 (cold run, same-execution skip, warm-cache zero probes, cache-outage fail-open, stale-count invalidation, plus static doGet ordering assertions incl. deploy-fallback placement per Deploy Handler Protection)

#### `Scraper.html` — v01.26w

##### Changed
- Sticky transport in `_gasPost`: after a POST transport failure where the GET fallback succeeds, `_scGasGetOnly` locks the session to the GET api route — eliminating the wasted failed-POST round trip on every subsequent call in environments where Google's serving drops POST bodies. The flag is only set after a successful GET (a total outage can't disable POST permanently). Playwright-tested: first call = 1 failed POST + 1 GET, second call = GET only

## [v01.73r] — 2026-08-04 06:41:08 PM EST

> **Prompt:** "I archived junk and pressed "Plan". This is what it looks like. Give me an option to add keywords like "Sinexcel" and have it automatically evaluate and add relevant adders like " data center project OR deal" and add it to the list in real-time, so I never have to leave that window."

### Added

#### `Scraper.gs` — v01.24g

##### Added
- `addPlanQuery` action (registered in `SCRAPER_PROJECT_ACTIONS` + `handleProjectAction_`): takes a raw term, dedupes case-insensitively against the saved plan (`plan_duplicate` + the covering group), enforces `SCRAPER_PLAN_TOTAL_MAX`(40) hard cap (`plan_full`), then one `aiComplete_` call shapes the term into a styled query group (5 in-prompt style examples); if the AI reply drifts off the term, falls back to `'"term" ' + scTopicTerms_(topic, 3)`. New group is `unshift`ed (prepended) so manual adds always fall inside every consumer's slice window; saved via `scSavePlan_`, logged to UsageLog + audit (`plan_add`)

##### Changed
- Plan consumption caps raised: `SCRAPER_PLAN_GDELT_MAX` 12→16, `SCRAPER_PLAN_GNEWS_MAX` 10→24

#### `Scraper.html` — v01.25w

##### Added
- Search Plan panel add-a-term UI: `#sc-plan-input` + Add button + Enter-key submit in `scShowPlan_`; `scPlanAdd_` calls `addPlanQuery` (no retry wrapper — avoids double AI spend), prepends the returned group as a highlighted `<li>` (textContent, XSS-safe), shows "Added — N query groups now saved", clears + refocuses the input; `plan_duplicate` renders "Already covered by: <group>"; new error strings `term_missing`/`plan_full`

##### Changed
- `scRunPlan` now calls `getQueryPlan` first and opens the saved plan instantly (protects manual adds); the planner only runs when no plan exists. New in-panel Rebuild button (`scPlanRebuild_`) is two-tap ("Replaces list — tap again") and re-renders via `scShowPlan_`. Unit-tested 12/12 (node, extracted `addPlanQuery`: dedupe/prepend/drift-fallback/cap/errors) + Playwright UI test (saved-plan open without planner call, real-time add, Enter+duplicate, two-tap rebuild)

## [v01.72r] — 2026-08-04 06:01:06 PM EST

> **Prompt:** "build the query planner and AI pre-filter at fetch time, as well as the Claude web-search backfill for an occassional "deep backfill" option. After archiving, I will only have 300+ relevant articles in my collection, so my priority is to fill it with other relevant articles."

### Added

#### `Scraper.gs` — v01.23g

##### Added
- Query planner: `QueryPlans` tab + `planQueries` action — one `aiComplete_` call turns the FULL topic paragraph + keywords + learned preferences into ≤`SCRAPER_PLAN_QUERIES_MAX`(24) entity-level query groups (`scGetPlan_`/`scSavePlan_`/`scJsonArray_`); `getQueryPlan` reads it back. Plan groups feed `scBuildFetchQueue_` (up to 10 gnews queries, label `plan`) and REPLACE the auto-built `scGdeltQueries_` set (up to 12 + liked-domain group, OR groups paren-wrapped for GDELT)
- Fetch-time pre-filter: `scPrefilterItems_` batch keep/drop (40 headlines/call, "when unsure KEEP") wired into `scCompileChunk_` and `backfillNow` before row insertion; fails open on any AI error; `filtered` count in state/response/audit; AI calls logged to UsageLog
- Deep backfill: `deepBackfillNow` — one Claude web-search task per invocation (`scWebSearchArticles_`: `claude-haiku-4-5` + `web_search_20250305`, `max_uses` 3, quarter × query-group tasks over 8 quarters × ≤8 groups), Enrich-style poison-safe `attempting` marker, rows arrive with snippet (summary) so Enrich is unnecessary, `searches` counted from `usage.server_tool_use`; `deepbf_key_missing` when ANTHROPIC_API_KEY is absent. Unit-tested 26/26 via node against extracted functions (plan parsing, GDELT paren-wrapping/caps, prefilter keep/drop + fail-open, web-search payload/parse/429)

#### `Scraper.html` — v01.24w

##### Added
- Plan button → `scRunPlan` (progress panel + toast) and `scShowPlan_` reusing the stats overlay shell to list the stored query groups
- Deep backfill button → `scRunDeepBackfill` with two-tap paid-search confirm, chunked loop, progress (tasks/articles/searches), `deepbf_key_missing` + `plan_parse_failed` error messages
- Compile/Backfill progress lines show `filtered` junk counts. Playwright-verified: plan overlay contents, arm label, missing-key toast, 3-chunk deep run (calls counted), screenshots inspected

## [v01.71r] — 2026-08-04 04:53:53 PM EST

> **Prompt:** "Continue with your recommendation. Also, since the GDELT backfill is so limited, explore other possible methods to backfill that could increase my fetch accuracy, even if it costs more tokens. If so, approximate how much more each method will cost. "

### Added

#### `Scraper.gs` — v01.22g

##### Added
- `ArticlesArchive` tab (Articles headers + `Archived At`) auto-created via `SCRAPER_TAB_HEADERS`; `archiveJunk` action moves unrated sub-`SCRAPER_CALIB_MIN_SCORE` articles there in one locked pass (read → idempotent-by-Article-ID archive append → single-write Articles rewrite), clears the row-indexed `scEnrich_` state, and returns `{archived, remaining}`. Unit-tested 25/25 via node against the extracted functions (partition, crash-recovery re-append, empty case, stats before/after)
- `getScoreStats` extended with per-band preview counts (`p0`–`p80`), `archivable` (unrated & <10), and `archived` (rows in the archive tab)

##### Changed
- `scExistingArticleUrls_` dedupe set now includes ArticlesArchive URLs, so Compile/Backfill can never re-import archived articles

#### `Scraper.html` — v01.23w

##### Added
- Stats panel: per-band `sc-stat-sub` line showing "N with preview · M title-only"; footer lines for archivable count (with Archive junk pointer) and already-archived count
- "Archive junk" card button: first tap fetches the live count and arms ("Archive 1781? Tap again", 6s timeout), second tap runs the single `archiveJunk` call through the progress panel with result toast. Playwright-verified end-to-end against stubbed backend (arm label, single call, toast, progress, post-archive stats)

## [v01.70r] — 2026-08-04 04:01:42 PM EST

> **Prompt:** "build the distribution panel"

### Added

#### `Scraper.gs` — v01.21g

##### Added
- `getScoreStats` action: one Articles-sheet scan returning rubric-aligned band counts (0-9 / 10-29 / 30-49 / 50-79 / 80-100), scored/unscored/total, over-20 count, snippet coverage, 👍/👎 totals, and the unrated ratable pool (score ≥ `SCRAPER_CALIB_MIN_SCORE`, no verdict)

#### `Scraper.html` — v01.22w

##### Added
- Stats button per project card → `#sc-stats-overlay` panel: big %-over-20 headline, five color-coded proportional band bars (colors matching the score-chip palette, hover titles naming the rubric band), and a corpus-health footer (scored of total with unscored hint, preview coverage %, rating counts, ratable pool). Harness-verified against stubbed stats: headline 36% (720/2000), bars proportional to band counts, close button and click-outside dismiss, screenshot visually checked

## [v01.69r] — 2026-08-04 06:02:52 AM EST

> **Prompt:** "fix the enrich stall"

### Fixed

#### `Scraper.gs` — v01.20g

##### Fixed
- Poison-URL stall in `scEnrichChunk_`: `UrlFetchApp` has no timeout, so a hanging site carried the execution into Google's uncatchable 6-minute kill; state was only saved at batch end, so the client's retry chain (POST → GET fallback → `scRetryOnce`, each leg hanging ~6 min) re-ran the same batch and re-hit the same URL forever. State is now persisted BEFORE every fetch with an `attempting` row marker; a leftover marker on the next run means the previous execution died mid-fetch on that row — it's counted unavailable, skipped, and the run continues. Per-fetch persistence also stops killed executions from losing the batch's other progress. Node-verified 8/8 by running the extracted shipped function against stubbed platform services: seeded mid-fetch kill state → poison row never re-fetched, counted failed, remaining rows enriched, run completes; fresh run persists the marker before all fetches and clears it in the final state

## [v01.68r] — 2026-08-04 03:33:53 AM EST

> **Prompt:** "build the enrich step"

### Added

#### `Scraper.gs` — v01.19g

##### Added
- `enrichNow` action + session-free `scEnrichChunk_` core: chunked/resumable abstract harvest for snippet-less articles (15 page fetches per call, 40s budget, row-cursor resume — safe because the Articles sheet is append-only); fetches with a browser-like User-Agent, writes to the Snippet column, counts failures without marking them so a later run retries; UsageLog fetch counting; returns processed/total/enriched/failed for the progress bar
- Pure `scExtractAbstract_`: og:description → twitter:description → meta description with either attribute order, single/double quotes, entity decode, whitespace collapse, 300-char cap — node-verified 10/10 against extracted source (fallback chain, precedence, entities, no-match, cap)

#### `Scraper.html` — v01.21w

##### Added
- Enrich button per project card + `scRunEnrich` chunk loop wired to the progress panel ("X/Y articles · N previews found · M unavailable"), completion/nothing-to-do toasts, resume-on-retry failure path — harness-verified through a 3-chunk stubbed run

## [v01.67r] — 2026-08-04 03:28:10 AM EST

> **Prompt:** "apply the three fixes. Recommend me some work-arounds to tackle the "title only" issue; Is there any way to get an abstract summary of the article instead of just judging by the title?"

### Fixed

#### `Scraper.gs` — v01.18g

##### Fixed
- Scoring rubric (fix 1): `scScoreBatch_` prompt now anchors five bands — 80-100 on-topic / 50-79 relevant subtopic / 30-49 adjacent context (corporate moves, financing, policy, supply chain, partnerships of relevant players, explicitly named) / 10-29 weak / 0-9 unrelated — plus "use the full range; do not default to the extremes". Replaces the two-anchor instruction that produced the bimodal near-zero distribution on the 2000-article re-score
- Title-only fairness (fix 2): same prompt now states a missing body is NOT evidence of irrelevance — headline-only articles (all GDELT backfill rows store an empty snippet) are scored on what the headline plausibly covers
- Feedback rebalance (fix 3): `scFeedbackPrompt_` caps 👎 exemplars at 👍-count + 2 and reframes them as "obvious junk the user filtered out… do NOT treat as a relevance ceiling" instead of "score articles like these LOW"; `scDistillFeedback_` prompt now instructs the distiller to state preferences positively first, with rejections at most a short final sentence. Node-verified against extracted source (6/6): all-downs history shows only 2 junk-framed exemplars with the ceiling warning, balanced history shows all ups + capped downs, empty history emits nothing

## [v01.66r] — 2026-08-04 02:39:32 AM EST

> **Prompt:** "After I tap + to add a suggested keyword to project keywords, give me an option to undo that +. Also, give me a clearer, more informative progress bar for every action button I can click (ie: Backfill, Analyze, Re-score collection)."

### Added

#### `Scraper.html` — v01.20w

##### Added
- Suggestion undo: added chips render a × (`.sc-sugg-undo`); `scCalAddSuggestion_` generalized into `scCalToggleSuggestion_` with `op: add|remove` through the same optimistic 900ms-debounced batch pipeline; payload builder applies ops in order and skips the request entirely on a net-zero batch (add undone before flush); failure rollback restores each chip's pre-tap state including its +/× button. Harness-verified: add → 1 `updateProject` (keyword present), undo → 2nd call (keyword gone, + restored), quick +× → no request
- Action progress bars: fixed bottom-left `#sc-prog-stack` (z-index 60 — visible above the articles/calibration overlay, nudged above the version pill), one `.sc-progress` panel per project with label, fill bar (percent when total known, sliding indeterminate stripe when not), stats line, and a 1s-tick elapsed clock; `scProgDone` turns it green and fades after 2.5s, `scProgFail_` freezes the reason for 5s. Wired into Compile (feeds/new/failed), Backfill (slices/found/failed), Analyze (scored/left + 🧠 note), and Re-score (clearing phase → scoring phase). Harness-verified fill progression `indet → 33% → 67% → 100%` via MutationObserver plus screenshot

## [v01.65r] — 2026-08-04 01:46:24 AM EST

> **Prompt:** "I added some suggested keywords to project keywords, but it took a very long time to process my clicks. Is there any way to speed that up?"

### Changed

#### `Scraper.html` — v01.19w

##### Changed
- Suggestion-add chips are now optimistic + batched: `scCalAddSuggestion_` flips the chip instantly and queues the addition; `scCalFlushSuggestions_` coalesces all taps within a 900ms debounce window into ONE `updateProject` (mid-flight taps re-flush after the response). Harness-verified: 4 rapid taps registered in 179ms against a 1.5s-latency stub, exactly 1 request carrying all 4 additions

##### Fixed
- Lost-update race eliminated: per-tap requests each built their payload from the pre-response project state, so rapid taps could overwrite earlier additions — the single batched payload merges every queued addition; on failure all batch chips roll back with re-tappable + buttons and a retry toast

#### `Scraper.gs` — v01.17g

##### Changed
- `scWriteSchedules_` skips the delete-and-reappend rewrite when frequencies, delivery, and custom config are unchanged — per-row `deleteRow` calls were the slowest part of `updateProject`, making scope-only edits sluggish

##### Fixed
- Scope-only project edits no longer wipe schedule rows' Next Run / Last Run — previously every `updateProject` reset live scheduler state, making the schedule immediately due again

## [v01.64r] — 2026-08-04 01:33:25 AM EST

> **Prompt:** "apply both changes"

### Changed

#### `Scraper.gs` — v01.16g

##### Changed
- Calibration excludes scores below `SCRAPER_CALIB_MIN_SCORE` (10) entirely — confirming articles the scorer already dismissed teaches it almost nothing
- Band mixer extracted into pure `scCalibMix_` and the silent low-band fallback removed: empty mid/high slots borrow only from each other, empty low slots borrow from mid/high, and the queue ends when the informative bands (30–70 / 70+) run dry — the low band (now 10–29) never substitutes for them. Node-verified against extracted source: all-low corpus → empty queue, 6/2/2 ratio on a mixed 10-pick, hi-substitution without lo-flooding, mid-stream termination, band order preserved

#### `Scraper.html` — v01.18w

##### Changed
- Calibration empty-state messages rewritten for the new behavior ("Nothing informative left to calibrate…" / "All caught up — nothing informative left to rate") with a pointer to Compile + Analyze; harness-verified render

## [v01.63r] — 2026-08-04 01:17:17 AM EST

> **Prompt:** "build the scheduler."

### Added

#### `Scraper.gs` — v01.15g

##### Added
- Scheduler: hourly `scSchedulerTick()` (LockService-guarded) walks the Schedules tab for Active rows whose Next Run has passed (or was never set, or whose run is mid-flight) and drives each through compile → analyze (incl. auto-distill) → brief → deliver via a persisted per-schedule phase state (`scSchedRun_<scheduleId>` Script Property), phase-stepping within a 240s tick budget and resuming next tick; 4s pauses between analyze chunks for free-tier AI RPM
- Session-free cores extracted: `scCompileChunk_` / `scAnalyzeChunk_` / `scBriefCore_` — `compileNow` / `analyzeArticles` / `previewBrief` are now thin session-validated wrappers with identical behavior
- Delivery: `scDeliverBrief_` appends a Reports-tab row (status `generated` / `emailed` / `email_failed`) and emails the brief via `MailApp` when delivery is `email`/`both`
- `scNextRun_`: pure next-run computation anchored at 7:00 AM ET per frequency (daily/weekly/monthly/quarterly/biannual/annual; custom parses "every N days", weekly fallback) — node-verified with 11 passing cases against the extracted source
- Trigger self-install: `scEnsureSchedulerTrigger_` (idempotent, property-guarded) hooked into `doGet` inside try/catch; `setupSchedulerTrigger()` manual fallback for the editor. Deploy handler untouched
- Paused/archived projects: schedules skip the cycle, advance Next Run, and drop stale run state; `scSchedulesFor_`/`listProjects` now return per-project `nextRun`/`lastRun`

#### `Scraper.html` — v01.17w

##### Added
- Green `⏰ next: <date>` chip on project cards (title-attr shows last run); "⏰ first run pending" variant for scheduled projects awaiting their first pass — harness-verified both variants render from stubbed `listProjects`

## [v01.62r] — 2026-08-04 01:08:07 AM EST

> **Prompt:** "I like your plan, but add ways to improve the fetching breadth as well. I am willing to spend more time and effort on the project topic/keywords/sources/ideally more."

### Added

#### `Scraper.gs` — v01.14g

##### Added
- `listArticles` extended: standard mode gains server-side filters (`minScore`, `days` on Fetched At, `q` needle over title/snippet/summary/source); new `mode=calibration` returns a stratified sample of unrated scored articles mixed ~60% mid-band (30–70) / 20% high / 20% low via a round-robin pattern, newest-first within bands
- New `distillPreferences` action: on-demand re-distill when the verdict count changed (otherwise returns the stored profile), plus `likedDomains` for the suggestions UI
- New `resetScores` action ("Re-score collection"): clears Summary + Relevance Score for a project in one batched range write (verdicts preserved) so the normal chunked Analyze loop re-scores with the current profile
- New `scLikedDomains_`: domains of 👍-rated articles, computed live — Compile adds up to 3 `site:` Google News queries (`liked-source` label) and Backfill adds one `domainis:` GDELT group (query cap 5 → 6)
- Distillation prompt now asks for adjacent topics/synonyms/entities beyond literal title phrases; `SCRAPER_PREFS_KEYWORDS_MAX` 8 → 12; Compile uses up to 9 learned keywords (was 6)

#### `Scraper.html` — v01.16w

##### Added
- Calibrate button per project card → calibration mode in the articles overlay: rate-and-replace card queue (8 visible, 30 fetched, background top-up under 5), session counter, auto `distillPreferences` every 10 ratings with 🧠 toast
- "What I've learned" box: profile note + suggested-keyword and liked-domain chips with one-tap add via `updateProject` (client-side payload merge); "Re-score collection" two-tap confirm → `resetScores` → reuses `scRunAnalyze`
- Standard mode filter bar (days / min score / keyword) wired to the new `listArticles` params; card markup extracted into shared `scArtCard_`
- Harness-verified end-to-end: 8-card open, remove+replace on rating, counter, distill at 10 ratings, learned box chips, suggestion add, min-score filter param; both-mode screenshots visually checked

## [v01.61r] — 2026-08-03 11:57:41 PM EST

> **Prompt:** "For a few article ratings, it took a long time before it captured and saved me ratings. When I am rating articles (thumbs up/down), create a status window to the right that shows the steps that it is going through, so that it is easier to debug in the future."

### Added

#### `Scraper.html` — v01.15w

##### Added
- Rating status panel `#sc-vlog`: fixed dark monospace log docked right of the articles card (z-index 51, responsive at ≤1240px/≤760px breakpoints). Each 👍/👎 tap opens a numbered `scVlogSession` with its own clock; every step logs with `+Xms` elapsed — tap registered, per-attempt send/reply (with per-request round-trip ms), transport-retry wait, `unknown_op` mid-update wait, saved ✓ / NOT saved, buttons unlocked. Sessions from concurrent taps interleave safely (per-session numbering + per-session t0); log capped at 60 lines; × hides it (reappears on next rating); hidden when the articles overlay closes
- `scSendVerdict` restructured with sequential per-attempt instrumentation (inlining the former `scRetryOnce` wrapping so each attempt is individually visible); behavior unchanged — one transport retry + one `unknown_op` retry, 2.5s waits
- Harness-verified: healthy tap (attempt 1 → saved), flapping server (unknown_op → wait → attempt 2 → saved), close button, and screenshot visual check

## [v01.60r] — 2026-08-03 11:33:05 PM EST

> **Prompt:** "build the distillation step while I continue to rate articles."

### Added

#### `Scraper.gs` — v01.13g

##### Added
- Feedback distillation: `scDistillFeedback_` sends ALL of a project's 👍/👎-rated titles (up to `SCRAPER_DISTILL_TITLES_MAX` = 40/side) to the AI and stores the result — a ≤150-word learned-preferences note plus up to 8 suggested search phrases — in a new user-visible `Preferences` sheet tab (`Project ID`, `Owner`, `Learned Preferences`, `Suggested Keywords`, `Verdicts Used`, `Distilled At`); auto-created by `ensureScraperTabs_`, upserted one row per project
- Distillation runs automatically inside `analyzeArticles` when total verdicts ≥ `SCRAPER_DISTILL_MIN_VERDICTS` (3) AND the count changed since the last distillation — at most one extra AI call per Analyze cycle (the stored `Verdicts Used` count makes follow-up chunk invocations skip it); failures are non-fatal and retried on the next Analyze
- Scoring prompts now include the learned note via `scPrefsPrompt_` (between PROJECT SCOPE and the raw exemplars); `previewBrief` includes it too so briefs reflect learned preferences
- Learned keywords widen fetching: `scBuildFetchQueue_` adds up to 2 `learned`-labeled Google News queries (6 keywords, OR'd in 3s) and `scGdeltQueries_` adds one learned query group to Backfill (cap raised 4 → 5 groups)
- `analyzeArticles` returns `distilled: N` (verdict count) when a distillation ran, and counts the distillation call in `UsageLog`

#### `Scraper.html` — v01.14w

##### Added
- The Analyze loop watches for `data.distilled` and appends "🧠 Preferences updated from your N ratings." to the completion toast (both the "articles scored" and "already scored" paths)

## [v01.59r] — 2026-08-03 11:21:17 PM EST

> **Prompt:** "I opened Articles and started to rate them, but only the 1st article's thumbs-up rating went through. When I tried to thumbs-up the 2nd and 3rd articles, it would get grayed-out for a few seconds before resetting to default. Did I actually do anything by rating the 2nd and 3rd articles? Also, fix this issue."

### Fixed

#### `Scraper.html` — v01.13w

##### Fixed
- Verdict saves now go through `scSendVerdict`: retries once on transport failure (matching `scRetryOnce`) and once more with a 2.5s delay when the server answers `unknown_op` — the signature of Google's `/exec` serving briefly flapping to a stale deployment version after a GAS redeploy, which made taps land on code that didn't know `setArticleVerdict` yet. Server writes are absolute values, so retries are idempotent. Root cause confirmed by a full-fidelity Playwright harness (real page + handlers, stubbed GAS routes): the client path was correct in isolation; flap, healthy, and persistent-failure scenarios all verified post-fix
- New `unknown_op` entry in `SC_ERROR_MESSAGES` ("The server is finishing an update — wait a few seconds and try again") replaces the generic fallback toast for all actions during deploy flaps

## [v01.58r] — 2026-08-03 10:06:55 PM EST

> **Prompt:** "fix articles and build the feedback loop. It is imperative that Scraper can learn about my preferences and can improve its article fetching and scoring capabilities to be realistically useful."

### Added

#### `Scraper.gs` — v01.12g

##### Added
- `setArticleVerdict` action records 👍/👎/clear into the existing User Verdict column (ownership-checked by project + owner, audit-logged)
- Verdict exemplars feed the scoring prompt: `analyzeArticles` collects up to 8 newest 👍 and 8 newest 👎 titles per project and `scScoreBatch_` injects them as a USER FEEDBACK section between the project scope and the article list, so every future scoring batch calibrates to the user's confirmed preferences

##### Fixed
- `listArticles` now sorts the project's full corpus by score (unscored last, newest-first within ties) **before** applying the 100-row cap — the previous newest-fetched-first cap let a large low-relevance backfill crowd every relevant article out of the overlay

#### `Scraper.html` — v01.12w

##### Added
- 👍/👎 verdict buttons on each article card (delegated click handler, active-state highlight, tap-again-to-clear, disabled while the save round-trips); verified via Playwright visual test

#### `Scraper-diagram.md`

##### Changed
- Sequence diagram updated: top-scored `listArticles` selection, exemplar titles in the scoring step, and the new `setArticleVerdict` flow; mermaid.live pako URL regenerated and decompression-verified

## [v01.57r] — 2026-08-03 08:17:43 PM EST

> **Prompt:** "16 minutes later, the backfill progress looks like this. Therefore, I don't think there's a need to "fix" the backfill. However, I do want you to show failures in the progress UI."

### Changed

#### `Scraper.html` — v01.11w

##### Changed
- Backfill progress button now appends the silent-error count from `backfillNow` responses (`, N failed`) when nonzero — failed GDELT slices (e.g. rate-limit rejections, which GDELT returns as HTTP-200 plain text) were previously invisible until the completion toast

## [v01.56r] — 2026-08-03 06:43:09 AM EST

> **Prompt:** "Key added as "Scraper-GAS" with an expiry date of "never". Continue the build."

### Added

#### `Scraper.gs` — v01.11g

##### Added
- GDELT DOC 2.0 historical backfill engine: new `backfillNow`/`getBackfillStatus` actions slice the past 24 months per month × per query and pull date-ranged English article lists (≤250 per slice) into the Articles tab — deduped against existing URLs, batch-appended via `setValues` (not per-row `appendRow`), time-budgeted (40s / 6 fetches per call), with compact resumable state in Script Properties (slices are derived from `startedAt` + stored queries rather than stored, keeping state well under the 9KB property limit)

#### `Scraper.html` — v01.10w

##### Added
- Backfill button on each project card runs the chunked backfill loop with live progress ("Backfilling… n/total (X found)") and a completion toast; transport failures auto-retry once and an interrupted run resumes where it left off

## [v01.55r] — 2026-08-03 06:20:57 AM EST

> **Prompt:** "Repo created per your instructions and I made sure Claude Github App has access to the bess-aidc-library repo. Also, I have created an Anthropic Console account under jonyang92@gmail.com and funded it with $200."

### Added

#### `Scraper.gs` — v01.10g

##### Added
- Claude (Anthropic) AI provider wired into the swappable `aiComplete_()` layer: new `scClaudeComplete_()` calls the Messages API with Sonnet 5 (`claude-sonnet-5` default, `ANTHROPIC_MODEL` Script Property overrides) using an `ANTHROPIC_API_KEY` Script Property, mapping responses/errors to the same `ai_*` taxonomy as Gemini (`ai_key_missing`, `ai_rate_limited`, `ai_http_<code>` with trimmed API message, `ai_bad_json`, `ai_empty_response`)
- `AI_PROVIDER` Script Property now switches providers (`claude` | `gemini`) without a code change; Gemini remains the default and free-tier fallback

##### External
- Companion library repo `LightAISolutions/bess-aidc-library` seeded and pushed: 76-file skeleton inherited from this repo's template conventions (CLAUDE.md, rules, hooks, skills, trimmed auto-merge workflow), plus `library/news/<segment>/<year>/` archive structure, `library/specsheets/` placeholder, and the 55-company `WATCHLIST.md`

## [v01.54r] — 2026-08-03 02:51:07 AM EST

> **Prompt:** "Another error message. Resolve it."

### Fixed

#### `Scraper.gs` — v01.09g

##### Fixed
- Transport-level `http_404` on Analyze: live probes confirmed the deployment healthy (fast requests return 200 in 4–9s), isolating the failure to long-running exec requests dying at Google's HTTP front-end. `analyzeArticles` now makes exactly 1 AI call per invocation (was up to 3 + 2s sleeps), keeping each request compile-chunk-sized; the client loop provides continuation and free-tier RPM spacing. Removed the now-unused `SCRAPER_AI_CALL_SPACING_MS` intra-request sleep

#### `Scraper.html` — v01.09w

##### Fixed
- Compile and Analyze loops now automatically retry a failed chunk once (2.5s pause) before surfacing a transport error — safe because server-side state is chunked/resumable

## [v01.53r] — 2026-08-03 02:38:35 AM EST

> **Prompt:** "I created the GEMINI_API_KEY on my jonyang92@gmail.com account. Then, I added the GEMINI_API_KEY to the Scraper app's Script Properties on lightaisolution@gmail.com's account (owner of the app). However, when I pressed Analyze with or without Compile first, both times ended in the same error (attached). Resolve this."

### Fixed

#### `Scraper.gs` — v01.08g

##### Fixed
- `ai_http_404` on Analyze: the hardcoded `gemini-2.5-flash-lite` model was retired by Google on 2026-07-09 (months before its announced Oct 16 shutdown). Replaced the hardcoded model with live discovery: `scGeminiDiscoverModel_()` queries the ListModels endpoint (paginated), filters to stable `generateContent`-capable Gemini models (excludes preview/exp/image/tts/live/audio/embed/thinking variants), prefers flash-lite → flash → any Gemini with newest version + shortest name, and caches the pick in the `GEMINI_MODEL_AUTO` Script Property. A 404 on a cached model triggers one automatic rediscover-and-retry, so future model retirements self-heal. Manual `GEMINI_MODEL` Script Property still overrides everything
- Gemini API error bodies are now surfaced: non-200 responses throw `ai_http_<code> — <API error message>` instead of an opaque status code
- `analyzeArticles` now reports `hasArticles` so the client can distinguish "no articles compiled yet" from "everything already scored"

#### `Scraper.html` — v01.08w

##### Fixed
- Clicking Analyze on a project with no compiled articles now shows "No articles to analyze yet — run Compile first to gather news." instead of the misleading "All articles were already scored."
- Added a user-facing message for the no-compatible-model case

## [v01.52r] — 2026-08-03 02:15:55 AM EST

> **Prompt:** "Deploy works and does give me a bunch of Google News that are questionably related to my topic. Continue with Phase 3."

### Added

#### `Scraper.gs` — v01.07g

##### Added
- Phase 3 AI layer: provider-agnostic `aiComplete_()` abstraction — Gemini free tier today (`scGeminiComplete_` via `generateContent` v1beta, default model `gemini-2.5-flash-lite` overridable with a `GEMINI_MODEL` Script Property; key from `GEMINI_API_KEY`), Claude slot ready as a future branch
- `analyzeArticles` route: chunked AI relevance scoring — up to 3 AI calls per invocation × 10 articles per call, 2s spacing for free-tier RPM headroom; scores (0–100) and 1–2 sentence summaries (for scores ≥50) written back to the Articles tab; unscored articles are the natural resume state
- `previewBrief` route: executive brief synthesized from the top 30 relevant articles (score ≥50), plain-text overview + bullets
- `listArticles` now returns `summary` and `score`; `scLogUsage_` extended to track AI calls alongside fetch calls in UsageLog

#### `Scraper.html` — v01.07w

##### Added
- Analyze button per project card driving the chunked scoring loop with progress ("Scoring… N left")
- Articles panel: color-coded relevance score chips (green ≥70, amber ≥50, red <50), AI summaries shown in place of raw snippets, scored-first sort order
- Brief button in the articles panel rendering the AI executive brief in a styled box
- User-facing error messages for AI failure modes (missing key, rate limit, empty/unreadable response, no relevant articles)

## [v01.51r] — 2026-08-03 01:23:34 AM EST

> **Prompt:** "I signed into the live Scraper page and created a real project. Continue with Phase 2."

### Added

#### `Scraper.gs` — v01.06g

##### Added
- Phase 2 compilation engine: `scBuildFetchQueue_()` builds Google News RSS search queries from topic terms (stopword-filtered via `scTopicTerms_`), keyword OR-chunks, industry combinations, and exclusion negations, plus the project's user-specified feed URLs
- `scParseFeed_()` parses both RSS 2.0 and Atom feeds via XmlService with HTML-stripped, length-bounded fields
- `compileNow` route: chunked, resumable compilation — each call fetches ≤6 URLs within a 40s budget, persists progress in Script Properties (`scCompile_<projectId>`), dedupes against existing article URLs per project, caps runs at 200 new articles, appends rows to the Articles tab, and logs fetch counts to UsageLog; the client loops until `done`
- `getCompileStatus` and `listArticles` routes (owner-scoped, newest-first, capped at 100)
- Dispatcher/action-list extended with the three new ops (doPost + doGet api mirror route automatically)

#### `Scraper.html` — v01.06w

##### Added
- Compile button per project card with live progress label ("Compiling… N/M") driving the chunked `compileNow` loop, finishing with a result toast and auto-opening the articles panel
- Articles panel overlay listing fetched articles (linked title opening in a new tab, source · date meta line, snippet)

##### Fixed
- Articles panel close button now shares the wizard close-button styling

## [v01.50r] — 2026-08-02 09:42:54 PM EST

> **Prompt:** "Stick with Gmail sign-in as planned and kick off Phase 1 (data model + project intake wizard)."

### Added

#### `Scraper.gs` — v01.05g

##### Added
- News Scraper Phase 1 data model: `ensureScraperTabs_()` creates 6 spreadsheet tabs (Projects, Schedules, Articles, Reports, Profiles, UsageLog) with frozen header rows, idempotently
- Session-gated project management routes `createProject`, `listProjects`, `getProject`, `updateProject`, `setProjectStatus` (active/paused/archived), all owner-scoped by email via `validateSessionForData` and reached through the iframe-free fetch transport (doPost actions + doGet `api` mirror via shared `handleProjectAction_` dispatcher)
- Payload normalization/validation (`scNormalizeProjectPayload_`) with bounded strings/lists, frequency whitelist (daily/weekly/monthly/quarterly/biannual/annual/custom), delivery whitelist (inapp/email/both), URL-validated custom sources, and a 10-active-projects-per-user cap
- Per-project schedule rows (one per frequency) written to the Schedules tab; audit entries via `dataAuditLog`

#### `Scraper.html` — v01.05w

##### Added
- News Scraper app layer (`#scraper-app`): project dashboard with cards (status/frequency/delivery chips), Refresh, Edit, Pause/Resume, and two-step inline Archive confirm; activated from `showApp()` via `window._scraperInit` (inline `// PROJECT:` hook)
- 5-step project intake wizard (basics → scope → sources → schedule → review) with per-step validation, custom-frequency reveal, review summary, and create/update submission through `_gasPost`
- `scraper-app` registered in `_htmlLayerEls` (PROJECT OVERRIDE) so the HTML layer toggle hides/shows the dashboard

### Fixed
- README `Repo version:` display corrected (was showing v01.48r while the repo version file was at v01.49r)

## [v01.49r] — 2026-08-02 08:37:29 PM EST

> **Prompt:** "Delete everything related to this "spain-argentina" page. It was just a test."

### Removed
- Deleted the spain-argentina test page and all its tracking files: `live-site-pages/spain-argentina.html`, `html-versions/spain-argentinahtml.version.txt`, `html-changelogs/spain-argentinahtml.changelog.md`, `html-changelogs/spain-argentinahtml.changelog-archive.md` (all added in v01.15r)
- Removed its README tree entries (Standalone Utilities page entry + html-versions and html-changelogs subtree lines) and its REPO-ARCHITECTURE.md flowchart node `SPAINARG_PAGE` with its serves / version-polling / template-copy edges (flowchart pako URL regenerated and decompression-verified)
- Historical mentions in CHANGELOG.md (v01.15r section) and SESSION-CONTEXT.md are records of past sessions and were intentionally left intact

## [v01.48r] — 2026-08-02 08:31:18 PM EST

> **Prompt:** "Also translate the review screen's category and subcategory dropdowns."

### Changed

- `Receipts.html` (v01.28w) — the review screen's category select (`fillCategories`) and per-item subcategory selects (`fillSubcatSelect`, incl. the blank "Subcategory —"/"子类别 —" option and preserved off-list values) now label via `tCat()`; `applyAppLanguage`'s value-keyed option pass extended to `#rr-category` and `.rr-cat` so a language toggle relabels an open review card too. Stored values remain English

## [v01.47r] — 2026-08-02 08:10:52 PM EST

> **Prompt:** "I want the Simplified Chinese translation option to translate everything, including:
>
> * "0 receipts * August 2026" and "No receipts saved yet this month" at the top of the dashboard.
> * All categories (Groceries, Dining, etc) in both History and Reports.
> * All subcategories for all categories in Reports.
> * In Daily Reports, change Mon-Sun to their Simplified Chinese equivalents while keeping the ", MM/DD/YY" latter half.
> * In Monthly Reports, change the months to their Simplified Chinese equivalents.
> * In Bi-annual Reports, change the "first/second half of 2026" into their Simplified Chinese equivalents."

### Added

- `Receipts.html` (v01.27w) — `I18N_CAT_ZH` (~90 entries) + `tCat()` for category/subcategory display names: History and Reports dropdown labels relabel via `option.value` (stored English values untouched — lossless both directions), report By-category / By-subcategory rows, the Line Items section title and note, and the month card's top-category rows all display 中文 in Chinese mode
- `Receipts.html` (v01.27w) — localized period labels in `bucketLabel()`: daily `周三, 7/29/26` (RP_DAYS_ZH; date half unchanged), monthly `2026年7月`, bi-annual `2026年上半年/下半年`; weekly and annual stay numeric
- `Receipts.html` (v01.27w) — month card fully localized: `N 张收据 · 2026年8月` (`zh-CN` locale month name), `本月还没有保存的收据` empty state, `其他项目` for the "Everything else" row; the language toggle now also calls `refreshMonthCard()` so the card flips immediately

## [v01.46r] — 2026-08-02 05:44:59 AM EST

> **Prompt:** "In the Settings cog menu, include an option to change the app language from English to Simplified Chinese."

### Added

- `Receipts.html` (v01.26w) — app language toggle (English / 简体中文) in the Settings ⚙️ panel (`#rsp-lang`, persisted as `Receipts_lang` in localStorage). Chrome-level i18n layer: `I18N_ZH` dictionary + `t()` for dynamic strings; `applyAppLanguage()` swaps static elements via a config list (`L10N_ELS`) plus dataset-keyed walkers for field labels, checkbox tails, stamp labels, period tabs, and select options (original English remembered in `data-i18n-en` so toggling is lossless). Translated surfaces: landing buttons + stamp labels + month card + date locale, History card, Reports card (period tabs, chips, section titles, Line Items controls, hints, empty states), Sharing card, review-card labels/buttons, Settings panel, affirmations (13 zh equivalents), and a map of common status messages (`I18N_STATUS_ZH`). Receipt data (merchants, item descriptions, category values) intentionally stays as stored — categories are server-matched data values
- `t()`/`setStatus` guarded with `typeof` checks — `fillReportCategories` runs at script-eval time before the dictionary vars are assigned, and an unguarded lookup killed the whole script when Chinese was active at page load (caught by the bilingual Playwright pass)

## [v01.45r] — 2026-08-02 05:10:46 AM EST

> **Prompt:** "In the Reports section -> Line Items (Subcategory) with "Group by item" checked, if an item has been purchased more than once, show the total amount across all purchases instead of individual prices. We can see the individual prices once we click the line item anyways."

### Changed

- `Receipts.html` (v01.25w) — grouped Line Items rows now show the group's summed spend (`gTot`) as the row amount instead of the latest purchase price; the ×count and low–high range stats are unchanged and per-purchase prices remain in the tap-to-expand history

## [v01.44r] — 2026-08-02 05:05:19 AM EST

> **Prompt:** "The combined viewing works as intended. However, I realized that I cannot view a receipt photo that she uploaded without getting access to her Google Drive Receipt App folder. Make it so that when a user shares view and edit permissions with another user, it automatically gives the other user permission to view the original user's folder."

### Added

- `Receipts.html` (v01.24w) — Drive folder sharing rides along with app grants: `driveShareFolder()` (POST a `reader` permission on the owner's "Receipts App" folder via the owner's `drive.file` token, `sendNotificationEmail=false`) fires on successful `addShare`; `driveUnshareFolder()` (permissions.list → DELETE the grantee's permission, raw fetch since DELETE returns an empty 204) fires on successful `removeShare`
- `Receipts.html` (v01.24w) — reconciliation in `loadShares()`: when the granted set differs from the `Receipts_folder_perms_synced` localStorage key, every granted email gets `driveShareFolder()` and the key advances only when all succeed — this retrofits folder access for grants made before this feature and self-heals failed Drive calls on the next app open. Must run client-side: the `drive.file` token can only manage permissions on folders the app created for that signed-in user; the server has no access to user Drives

## [v01.43r] — 2026-08-02 04:46:01 AM EST

> **Prompt:** "Approved, but also allow mutual delete."

### Added

#### `Receipts.gs` — v01.16g

##### Added
- `resolveOwnerSet_()` — combined-view owner resolution: `forOwner '*'` returns the session user plus every owner who granted them access as an ownerEmail → scope map; any other value defers to `resolveOwnerScope_` (single-entry map). Combining never widens access — every entry is backed by an existing Shares-tab grant
- `listReceipts` / `reportReceipts` now filter rows against the resolved owner set and tag each returned row with `owner` (and `canEdit` in listReceipts); `exportReceipts` accepts `'*'` and the Receipts sheet gains an Owner column (backfill loop indexes shifted accordingly)

##### Changed
- `deleteReceipt` ownership gate extended for mutual delete: the owner can always delete; any other user needs an edit-scope grant from the row's owner (`getShareScope_ === 'edit'`); everything else still responds `receipt_not_found` (no existence leak)

#### `Receipts.html` — v01.23w

##### Added
- "Combined (mine + shared)" option (`value '*'`) in the History and Reports "Viewing" pickers when received grants exist; `rhRowOwner()` normalizes each row's owner for detail/edit/photo routing (own rows → `''`); owner chip (`.rh-owner-tag`, name part of the email) on History rows in combined view
- Delete visibility in combined view follows per-row `canEdit` (edit-grant rows deletable, view-only rows not); single shared views keep delete hidden as before; the client-side own-Drive photo trash now keys off `rhRowOwner` so only the row's owner attempts it

## [v01.42r] — 2026-08-02 04:34:42 AM EST

> **Prompt:** "Approved - Implement your plan. 
>
> Also, I want it to be possible for me and another user to combine our receipts and look at everything together. The real scenario is: my girlfriend and I live together, so everything we buy is shared. Thus, I want all the receipts both of us scan to be visible and editable by both Gmail accounts. Recommend a plan of action to implement this for me to approve." *(Line Items drill-down implemented this version; the combined-receipts plan was presented for approval, not yet implemented)*

### Added

- `Receipts.html` (v01.22w) — "🧾 Line items" collapsible group in Reports, rendered when a category is chosen (title carries the subcategory when one is picked). Flat mode lists each matching line item `date · merchant · description · price` (newest first, 300-row display cap, count + total header); "Group by item" mode collapses normalized item names into rows showing ×count, low–high price range, and latest price, expanding on tap to the full dated per-merchant history. Item search box (`#rp-item-q`) filters descriptions live — keystrokes rebuild only `#rp-item-list` via `_rpItemCtx`, so the input keeps focus; search/group state persists across `renderReport()` rebuilds (search resets on each Reports open). All existing filters (owner, dates, merchant, min/max, subcategory) apply since the rows derive from the already-filtered receipt map; client-only feature over the existing `reportReceipts` payload — no GAS changes

## [v01.41r] — 2026-08-02 12:31:41 AM EST

> **Prompt:** "Everything looks good. However, I can no longer see the "Admin" drop down menu in my HTML/GAS layers, which I need to approve new user sessions. Fix it."

### Changed

- `Receipts.gs` (v01.15g) — Admin badge restyled from a dim status-pill look (dark `rgba(0,0,0,0.55)` background, 60% opacity, 10px font — visually identical to the adjacent Live/presence pills, so after the v01.14g move into the `#user-email` row it read as "gone") to a solid accent button: `#90caf9` background, dark text, bold 11px, full opacity, hover lighten; `#admin-wrap` gets `flex: 0 0 auto` so the row can never shrink it. Diagnosis confirmed the menu was functionally present: run 44's deploy log shows "Updated to v01.14g (deployment 21)", and a full-stack Playwright reproduction (real host page + real rendered `doGet` HTML in the iframe, R-hotspot → HTML-layer-toggle flow) showed the badge visible and its dropdown opening — the regression was prominence, not function

## [v01.40r] — 2026-08-02 12:11:48 AM EST

> **Prompt:** "A few changes:
>
> * In the History section, move the "sort by receipt date" checkbox outside of the collapsible filter. 
> * Add a "Clear" button in both the History and Reports sections' filters that clears all chosen filters back to default. 
> * In the History section, remove the green checkbox that shows each receipt as saved. If it shows up in the History section, it must already be saved. 
> * While logging in, there is an "icon placeholder" block. Replace this block with a relevant Icon that accurately represents what this app does.
> * In the dashboard, create a "Settings" cog icon at the bottom right corner of the screen that contains the signed in email account (jonyang92@gmail.com), and the "Sign out" and "Sign out everywhere" options. 
> * Slow down the speed at which the positive affirmations cycle by half."

### Added

- `Receipts.html` (v01.21w) — `#rh-clear` / `#rp-clear` buttons at the bottom of each filter drawer: History clears search/dates/category then `rhFilterHint()` + `loadHistory()`; Reports clears merchant/dates/min/max/subcat and dispatches `change` on `rp-cat` so the subcategory dropdown hides/resets through its normal listener
- `Receipts.html` (v01.21w) — Settings cog (`#rsp-settings`, fixed bottom-right, z-index 9) opening `#rsp-settings-panel` with the signed-in email, "Sign out", and "Sign out everywhere"; replaces the inline account row under the status line (same `rsp-account`/`rsp-signout`/`rsp-signout-all` ids so the 2s session-sync interval and sign-out handlers are unchanged); closes on outside click
- `live-site-pages/images/receipts-logo.svg` (created) — Paper Ledger-themed receipt icon (torn zigzag bottom, ink outline, accent `$`) shown on the auth wall and sign-out screen instead of the "LOGO" placeholder (`auth-wall-logo`/`signout-logo` src, PROJECT OVERRIDE)

### Changed

- `Receipts.html` (v01.21w) — "Sort by receipt date" moved out of the History filter drawer onto a pinned row under the Filters toggle; affirmation rotation slowed from 7s to 14s per message

### Removed

- `Receipts.html` (v01.21w) — the `rh-status` ✅/📤 emoji per History row (history only lists saved receipts) and its CSS rule

## [v01.39r] — 2026-08-01 11:52:43 PM EST

> **Prompt:** "implement the same filter related changes to the Receipt History section. Also, in the Reports section, move the circle graph checkbox out of the collapsible filter area. I want to be able to easily switch between the bar and circle graphs."

### Changed

- `Receipts.html` (v01.20w) — History filters moved into a collapsible `#rh-filter-body` drawer (collapsed by default), mirroring the Reports pattern: sticky `.rh-head` now holds only the title, the "Viewing" shared-view row, and the `#rh-filter-head` toggle row (~89px vs ~250px pinned). The `⬇️ Export .xlsx` button stays on the pinned toggle row (action, not a filter) with a click guard so it doesn't toggle the drawer; new `rhFilterHint()` shows "n active" for search/dates/category (sort order not counted — it reorders, doesn't narrow)
- `Receipts.html` (v01.20w) — Reports' Circle graphs checkbox moved out of the filter drawer onto the always-pinned `#rp-filter-head` row (new `#rp-circle-wrap` with a click guard in the drawer-toggle handler), so bar ↔ circle switching is one tap without opening filters

## [v01.38r] — 2026-08-01 11:44:33 PM EST

> **Prompt:** "in the Reports section, over half of the screen is freeze-paned, so it is not visually comfortable to use. Make the filters collapsible and start collapsed by default. Re-size as needed with focus on user comfort."

### Changed

- `Receipts.html` (v01.19w) — Reports filters moved out of the sticky `.rp-head` into a new collapsible `#rp-filter-body` drawer (collapsed by default): only the title, period tabs, shared-view "Viewing" row, and a slim `#rp-filter-head` toggle row stay pinned, shrinking the freeze-pane from ~380px to ~132px at 390px width. The toggle row reuses the report groups' `.rp-sec-toggle` +/− circle; when open, the drawer scrolls with the report content
- `Receipts.html` (v01.19w) — New `rpFilterHint()` shows an "n active" accent hint on the collapsed Filters row (merchant/category/subcategory/dates/min/max counted), called at the top of `renderReport()` before the `rpData` guard so it stays accurate even before data loads
- `Receipts.html` (v01.19w) — Report card max-height increased from `calc(100dvh - 170px)` to `calc(100dvh - 120px)` for ~50px more visible report content

## [v01.37r] — 2026-08-01 11:34:35 PM EST

> **Prompt:** "In order for me to approve new users via the admin panel, I need to be able to click it. Currently, it's being blocked by whichever layer my email (jonyang92@gmail.com) is on. Reformat things so that I can access the admin panel." *(with a desktop screenshot showing the GAS layer's ADMIN badge hidden behind the signed-in email display)*

### Fixed

- `Receipts.gs` (v01.14g) — Admin badge was unclickable: the GAS-served page pinned both `#user-email` (z-index 9999) and `#admin-badge` (z-index 100) to the same fixed top-left corner, so the email row painted over the badge and swallowed its clicks. The badge (with its `#admin-dropdown-gas`) now lives inside the `#user-email` flex row after the live-status pills, wrapped in a new `#admin-wrap` (position: relative) that anchors the dropdown directly beneath the badge — inline flow makes overlap structurally impossible
- Dropdown first-click no-op: the toggle compared `dd.style.display === 'none'`, but the initial inline style is `''` (CSS supplies the `none`), so the first click set `none` and did nothing visible. Toggle now checks `=== 'block'`, opening on the first click
- Mobile safety: `#user-email` capped at `calc(100vw - 16px)` with ellipsis truncation on `#user-email-text`, so the email + Live/presence pills + ADMIN badge stay on one row inside the 30px top band at 390px widths

## [v01.36r] — 2026-08-01 09:57:44 PM EST

> **Prompt:** "I successfully added the ".../auth/drive.file" scope to the scopes list and made sure each family member's Gmail is in the test-users list. I also successfully completed your recommended next step - everything worked. 
>
> After scanning a receipt, the progress bar gets replaced by the positive affirmations. Do not do that. Also, there is an unloaded icon next to the progress status. I want this progress status and bar to look cute, artsy, and match the existing theme. Give me several mockups to choose between. 
>
> Also, now that all receipt pictures get saved to the user's Drive's "Receipt App" folder, migrate the existing 29 receipt pictures from LightAISolution@gmail.com's Drive to jonyang92@gmail.com's Drive. 
>
> Also, create a sign in/out mechanism, so that other users don't need to use the hidden R button to sign out. Make sure it matches the existing theme and still looks professional.
>
> Also, just like how the Groceries category has 16 departments, refer to apps like ReceiptCamp, Expensify, and Smart Receipts, and populate the other categories (Dinings, Transport, ... , Travel) with relevant subcategories that are also hidden until their linked category is chosen. 
>
> If the above are executed without any problems, then continue with Phase 4." *(Progress design choice via AskUserQuestion: "A, but also add a progress bar above the stage stamps.")*

### Added

#### `Receipts.html` — v01.18w

##### Added
- "Stamp Card" progress UI (developer-chosen mockup A + bar): the existing progress bar sits above four coffee-card stage stamps (📷 Snap → ☁️ Save → ✨ Read → 🧾 Done) that ink to ✓ as the pipeline advances, with a pulsing accent ring on the active stage; `setProgress(pct, stage)` drives both (explicit stage passed by the batch path whose bar spans the whole batch), all hidden together on completion
- Visible account row at the panel foot (`#rsp-account`): signed-in email + link-style "Sign out" / "Sign out everywhere" wired to the template's `performSignOut` flows — no hidden hotspot needed
- One-time background legacy-photo migration (`migrateLegacyPhotos`): lists the user's org-Drive photos, streams each via `getLegacyPhotoBase64`, re-uploads into the user's own "Receipts App" folder, re-links the row via `completePhotoMigration`; per-account localStorage completion flag, quiet status updates, retries next session on failure; `uploadToOwnDrive` gained a mime parameter
- Per-category `SUBCATS` map (Groceries departments unchanged; Dining/Transport/Health/Shopping/Entertainment/Utilities/Travel/Other lists modeled on Expensify/Smart Receipts): review-card item selectors repopulate on category change (off-list values preserved as extra options), Reports' subcategory dropdown + drill-down section now work for every category ("By department" label kept for Groceries, "By subcategory" otherwise)

##### Fixed
- Affirmations no longer talk over a running pipeline (suspended while the scan/batch is active) and now retire the finished progress bar + stamps when they resume; the broken thumbnail `<img>` next to the status ("unloaded icon") was removed along with its wiring

#### `Receipts.gs` — v01.13g

##### Added
- Migration ops on both transports: `listLegacyPhotos` (owner-scoped; a photo is "legacy" iff the script can open it), `getLegacyPhotoBase64` (8MB cap), `completePhotoMigration` (validated Drive URL, row re-link, org copy trashed)
- `ITEM_CATEGORIES` expanded to the union of all per-category subcategory lists (the Gemini extraction enum); extraction prompt updated to pick subcategories matching the receipt's category

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — migration flow section added, extraction subcategory note updated (mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright: account row appears with the session email, Dining subcats populate and survive a Travel switch with value preserved, Reports shows the per-category dropdown + "By subcategory" section, the mocked 2-photo migration ran end-to-end (list → bytes → own-Drive upload → re-link) and set its completion flag, and the Stamp Card was driven through active → all-done → auto-hide by the real pipeline; zero page errors

## [v01.35r] — 2026-08-01 08:11:26 PM EST

> **Prompt:** "I verified that the access granting functionality works both ways (giving and receiving permission). Continue with Phase 3."

### Added

#### `Receipts.html` — v01.17w

##### Added
- Own-Drive photo storage: `AUTH_SCOPES` constant adds the non-sensitive `drive.file` scope to all six GIS token clients (each marked `PROJECT OVERRIDE`); new Drive client module — `_getDriveToken` (reuses `_ssoAccessToken`, silent GIS re-request otherwise), `ensureDriveFolder` (Profiles-tab lookup → auto-create "Receipts App" folder → `setProfileFolder` registration), `driveMultipartUpload` via `uploadToOwnDrive`, and best-effort `driveRenameFile` / `driveTrashFile`
- Pipeline rework (single-scan `handleFile` + batch `step`): compress → browser uploads the photo to the user's own Drive → `uploadReceipt` link-registration → `extractReceiptData` from the bytes (throttling preserved via the generalized `extractFor`); **automatic fallback** to the legacy base64 → org-Drive path whenever the Drive token/consent/upload fails, so no photo is ever lost; Retry re-extracts from held bytes (`currentB64`; batch entries keep bytes only for failed extractions to limit memory)
- Save renames the own-Drive photo to the final receipt ID; delete moves it to the user's Drive trash — both via the user's own token, both best-effort (`_drivePhotoByReceipt` map; server-side rename/trash still covers legacy org-Drive rows)

#### `Receipts.gs` — v01.12g

##### Added
- `Profiles` tab (Email, Drive Folder ID, Display Name, Created At) + `getProfile` / `setProfileFolder` ops (folder-ID format validated) on both transports
- `extractReceiptData(sessionToken, imageBase64, mimeType)` — Gemini extraction straight from bytes with an MD5-digest cache (no Drive read); shared `geminiExtractFromBase64_()` core refactored out of `extractReceipt`, which keeps its file-ID path for legacy rows
- `uploadReceipt` dual mode: `imageUrl` link-registration (validated `drive.google.com` prefix, no bytes, GET-fallback-capable) alongside the unchanged legacy base64 path

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — pipeline diagram reworked for own-Drive storage (browser→Drive upload, link registration, bytes-based extraction, per-side rename/trash notes; mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright end-to-end with mocked Drive + GAS endpoints driving the real pipeline — own-Drive path (getProfile → folder create → setProfileFolder → multipart upload → link-mode uploadReceipt with no image bytes → extractReceiptData → review card → save → rename PATCH) and the fallback path (Drive failing → legacy base64 uploadReceipt → extractReceipt by file ID) both confirmed; zero page errors

## [v01.34r] — 2026-08-01 07:51:32 PM EST

> **Prompt:** "I verified on my phone that History, Reports, and the month card still show all my receipts. Continue with Phase 2."

### Added

#### `Receipts.gs` — v01.11g

##### Added
- `Shares` tab (Owner → Grantee, scope `view`/`edit`, timestamp) with `listShares` / `addShare` (upsert, email-format check, self-share block, 20-grant cap) / `removeShare` ops on both transports
- `resolveOwnerScope_()` + `getShareScope_()` — every read op (`listReceipts`, `getReceiptDetail`, `reportReceipts`, `exportReceipts`) accepts an `owner` param resolved through the grant table; `saveReceipt` accepts it too but demands an `edit` grant; `deleteReceipt` deliberately takes no owner param (owner-only); `getReceiptDetail` responses carry `canEdit` + `owner` for the UI

#### `Receipts.html` — v01.16w

##### Added
- "🤝 Sharing" landing button (side-by-side with History) + sharing card (z-index 9): grant-by-email form with view / view+edit scope, revoke buttons, "shared with me" list, mapped error messages (`bad_email`, `cannot_share_with_self`, `share_limit`)
- "Viewing" selector rows in History (`#rh-owner`) and Reports (`#rp-owner`) — hidden until `listShares` returns received grants; selections thread `owner` into list/detail/report/export calls
- Shared-view guardrails: delete buttons hidden on shared views, the History-detail Edit button suppressed when `canEdit` is false, `editingOwner` threaded into the edit-in-place save, and the month-card refresh no longer clobbers the reports dataset while a shared view is open

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — sharing flow added to the pipeline diagram (mermaid.live URL regenerated + decompression-verified); share card added to the HTML layer-toggle element list

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright interaction test at 390px with mocked share data through the real code paths — grant/revoke round-trip, "Viewing" selectors appear only with received grants, shared list hides delete, view-only shared detail suppresses Edit, and the wire calls carry `owner` exactly when a shared view is active; zero page errors

## [v01.33r] — 2026-08-01 07:38:37 PM EST

> **Prompt:** "continue with your recommendation" *(executes Phase 1 — data isolation — of the approved multi-user action plan from the preceding research response)*

### Added
- `googleAppsScripts/Receipts/Receipts.gs` (v01.10g) — multi-user data isolation. The existing "Uploaded By" column is now the receipt's owner: `listReceipts`, `getReceiptDetail`, `reportReceipts`, `deleteReceipt`, `saveReceipt`, and `exportReceipts` are all scoped to the signed-in user's own rows (ownership misses respond `receipt_not_found` so existence never leaks across accounts); `saveReceipt`'s duplicate detection is per-owner
- `backfillReceiptOwners_()` — one-time flag-guarded (`RECEIPT_OWNER_BACKFILL`) lazy migration stamping `RECEIPTS_LEGACY_OWNER` into blank Uploaded By cells, triggered from `listReceipts`/`reportReceipts`
- Monthly Summary tab rebuilt per-owner (new leading `Owner` column, rows sorted owner → month desc); the .xlsx export copies only the requesting user's summary rows and drops the Owner column to keep the familiar layout

### Removed
- `syncDriveFolderAccess_()` and its `listReceipts` call — the ACL → photo-folder viewer sync granted every ACL member viewer access to the shared photos folder, which becomes a cross-user privacy leak under multi-user isolation (removal pre-approved in the action plan). Previously granted folder viewers are NOT auto-revoked — manual Drive cleanup recommended

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — pipeline diagram updated: owner-scoped reads, owner backfill in the lazy-migration step, folder-sync interaction removed (mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs`; no remaining references to the removed sync function; server-side-only change (no UI modification, visual test not applicable per the trigger list)

## [v01.32r] — 2026-08-01 07:04:39 PM EST

> **Prompt:** "[screenshot attached] The hidden R button only hides the HTML and GAS buttons at the bottom. I want the hidden R button to also hide the sections I circled in red in the attached picture."

### Changed
- `live-site-pages/Receipts.html` (v01.15w) — the "R" hotspot now toggles a body-level `rcpt-clean` class (on by default) whose `!important` CSS rule hides all six developer/technical pills: `#user-pill` (email + Sign Out / Sign Out All), `#auth-timers` (session countdown), `#gas-pill` (GAS version), `#version-indicator` (HTML version), and the two layer-toggle pills. The class approach replaces the previous per-element inline-style wrappers (`_showGasToggle`/`_hideGasToggle` gating removed) — it outranks the template's inline `display` changes after sign-in and automatically covers the dynamically-created version pill, which inline juggling could not

### Verified
- `node --check` on both inline scripts; Playwright at 390px with the signed-in pill states simulated — all pills hidden by default, all revealed on "R" tap (user pill flex, timers/GAS pill block, both toggles block), all re-hidden on second tap; zero page errors. The HTML version pill is created only after a successful version fetch (impossible under `file://`) but is governed by the same ID-based CSS rule in production

## [v01.31r] — 2026-08-01 06:53:29 PM EST

> **Prompt:** "One more change:
>
> * Change front-end display to include a hidden button on the letter "R" in the word "Receipts" on the home screen that I can press to toggle on/off the HTML and GAS layer. I want the app to look clean to other users and still allow me to toggle these layers on for myself."

### Added
- `live-site-pages/Receipts.html` (v01.14w) — hidden developer hotspot: the "R" of the brand heading is wrapped in `#rsp-r-secret` (no visual affordance, tap-highlight suppressed); tapping it shows/hides the `#html-layer-toggle` and `#gas-layer-toggle` pills, which now start hidden for everyone. The template's post-sign-in `_showGasToggle()` / sign-out `_hideGasToggle()` are wrapped so GAS-pill eligibility is tracked but the pill only surfaces while the hotspot state is on

### Fixed
- `.rsp-brand span` date styling narrowed to `#rsp-date` — the generic selector was also hitting the new "R" span, rendering it small/italic (caught by the Playwright screenshot before commit)

### Verified
- `node --check` on both inline scripts; Playwright at 390px — pills hidden on load, still hidden after the template's simulated post-sign-in `_showGasToggle()`, both revealed on "R" tap (HTML pill toggles the receipts layer correctly), both hidden again on second tap; heading renders with a uniform "Receipts" wordmark; zero page errors

## [v01.30r] — 2026-08-01 06:08:39 PM EST

> **Prompt:** "A few more changes: 
>
> * In the Reports section:
>    * Hide the "All departments" drop-down menu until "Groceries" are chosen in the "All categories" drop-down menu. 
>    * Change "Circle graphs (percentage comparison)" to "Circle graphs".
>    * After checking the "Circle graphs" option, I notice that only 8 data groups are included before the rest are grouped under "Other". Reformat the circle graphs such that the circle graph itself is larger and located above the index breakdown of different data groups. Then, allow each circle graph to include up to 20 data groups that keep extending downwards. I like the current data group format of "Group name, Percentage, USD Amount", so keep this structure."

### Changed
- `live-site-pages/Receipts.html` (v01.13w) — `#rp-subcat` (departments dropdown) starts `display:none` and is toggled by a dedicated `#rp-cat` change listener: visible only when the selection is `Groceries`; on any other selection it hides and clears its value (with a re-render) so no invisible line-item filter lingers
- Circle-graphs checkbox label shortened to "Circle graphs"
- Donut layout restructured: `.rp-donut-wrap` is now a column (large `min(210px, 62vw)` donut centered on top, full-width legend below extending downward); slice cap raised 8 → 20 before the "Other" fold; legend row format unchanged (swatch · name · percent · amount)

### Verified
- `node --check` on both inline scripts; Playwright at 390px with intercepted `reportReceipts` demo data (12 categories) — departments dropdown hidden on load, visible for Groceries, hidden + cleared on switch to Dining; 12 legend rows render without an "Other" fold; large donut renders above the legend

## [v01.29r] — 2026-08-01 05:53:12 PM EST

> **Prompt:** "A few more changes:
>
> * In the Reports section:
>    * Change the Daily Totals format to the equivalent of "Wed, 7/29/26".
>    * Change the Weekly Totals format to the equivalent of "7/26/26 - 8/1/26".
>    * Change the Monthly Totals format to the equivalent of "July 2026".
>    * Change the Bi-annual Totals format to the equivalent of "First Half of 2026" and "Second Half of 2026".
>    * Add a "By Department" section under the "By Category" section in the report that only shows up when the user chooses "Groceries" in the "By Category" drop-down menu. 
>    * Minimize each of the reporting groups ("Daily Totals", "By Category", "By Department", "Top Merchants" until the user clicks a little "+" icon on the right side of the reporting group. 
>    * Add a checkbox option to show the reporting groups as circle graphs instead of bar graphs to see percentage comparisons. Make sure they also start off minimized until the user expands the reporting group."

### Added
- `live-site-pages/Receipts.html` (v01.12w) — "By department" report group (line-item department totals over the filtered receipts), rendered only when the `#rp-cat` category filter is `Groceries`; collapsible report groups (`rpSection()` header + right-side circled `+`/`−` toggle, `_rpOpen` state map — all groups start minimized on every card open, toggle state survives filter re-renders via a delegated `#rp-body` click handler that flips display in place); "Circle graphs (percentage comparison)" checkbox — sections render as stroke-dasharray SVG donuts (8-slice cap + "Other" fold, `RP_COLORS` palette) with a swatch/label/percent/amount legend instead of bars
- Period-label formatter `bucketLabel()`: daily "Wed, 7/29/26", weekly "7/26/26 - 8/1/26", monthly "July 2026", bi-annual "First Half of 2026" / "Second Half of 2026"

### Changed
- Weekly bucketing switched from ISO-8601 Monday-start keys (`isoWeekKey`, removed) to Sunday-start week-start-date keys (`weekStartKey`) so the displayed ranges match the requested Sunday–Saturday spans; `.rp-section` groups restyled as bordered sub-cards to carry the collapsible headers

### Verified
- `node --check` on both inline scripts; Playwright interaction test at 390×844 with intercepted `reportReceipts` demo data through the real renderer — verified all four label formats, department group appears only for Groceries (present with, absent without), groups start collapsed, `+`/`−` toggling, and 3 donut SVGs with percentage legends in circle mode; only expected `file://` console errors

## [v01.28r] — 2026-08-01 05:18:59 PM EST

> **Prompt:** "In my Receipts app, I want to make the following changes:
>
> * Add an Upload receipts button to allow for mass processing for up to X number of receipts at a time. Recommend a max number of receipts to be uploaded and explain to me why.
> * Add a Reports button that allows for the generation and real-time display of daily, weekly, monthly, bi-annual, and annual reports, and real-time filtering by merchant name, major categories (ie: Grocery) tied with minor categories (ie: Produce), date ranges, and total cost ranges.
> * Allow me to edit the line items in Receipt History, so I don't have to delete/re-upload everytime I want to delete a line that I should have deleted in the Review step. 
> * Improve the landing UI. I want this app to look professionally made with popular mobile UX/UI designs. Show me a couple designs and let me choose before you implement." *(Design choice via AskUserQuestion: "A, but remove the "Photograph or choose a receipt to upload sentence". Instead, cycle through "Love yourself", "You're the best!", "Today's gonna be a good day", and 10 more sentences like these.")*

### Added
- Batch "Upload receipts" flow (gallery multi-select, cap 15/batch), Reports card with real-time client-side filtering, and edit-in-place for saved receipts in History
- `reportReceipts` GAS op — compact receipts + line-items dataset powering the Reports card and the landing month summary

### Changed
- Receipts landing redesigned to the developer-chosen "Paper Ledger" theme (cream/ink serif design with printed-receipt month summary); idle status line now cycles 13 affirmations
- `repository-information/diagrams/Receipts-diagram.md` — pipeline sequence diagram extended with the batch upload, edit-in-place, and reports flows (mermaid.live URL regenerated + decompression-verified)

#### `Receipts.html` — v01.11w

##### Added
- `#receipt-upload-input` (`multiple`, no `capture`) + sequential batch engine: per-photo compress → `uploadReceipt` → `extractReceipt` with ≥6.5s spacing between extraction calls (Gemini free-tier ~10 RPM), `MAX_BATCH = 15`, queue-stepped review cards with a "· n of N" position chip; Save/Discard advance the queue
- `#receipt-report-card` (z-index 8): Daily/Weekly/Monthly/Bi-annual/Annual segmented control, merchant/category/department/date-range/cost-range filters (all client-side over one `reportReceipts` fetch → instant re-render), summary chips, per-period bars, category breakdown, top merchants; minor-category mode switches totals to matching line-item amounts
- "✏️ Edit receipt / line items" button in each History detail — reopens the review card pre-filled from `getReceiptDetail` and re-saves via the idempotent `saveReceipt`, returning to a refreshed History list
- `#rcpt-month` landing hero (perforated-edge month summary fed by `reportReceipts`, refreshed after saves/deletes) and `#receipt-backdrop` full-screen cream layer wired into the template's HTML layer toggle via a project-side wrapper

##### Changed
- Full "Paper Ledger" restyle of the PROJECT CSS (theme variables `--rc-*`, serif type, monospace numerals, ink buttons); PWA `theme-color` → `#e9e3d6`; review/history/report cards raised to `top: 76px` with `calc(100dvh - 170px)` height; history date column widened to fix wrapping
- Idle status text replaced by a 13-sentence affirmation rotation (7s cycle; real status messages linger 12s before rotation resumes); status colors moved to theme palette

#### `Receipts.gs` — v01.09g

##### Added
- `reportReceipts(sessionToken, dateFrom, dateTo)` — all saved receipts (id, date, merchant, currency, total, category; cap 2000) plus their LineItems rows (receiptId, description, amount, category); routed in `doPost` and the `doGet` `action=api` fallback chain

### Verified
- `node --check` on the `.gs` and both inline page scripts; Playwright at 390×844 — landing, Reports, batch-position review card, and History detail with Edit button all render correctly in the new theme; only expected `file://` console errors

## [v01.27r] — 2026-08-01 06:51:35 AM EST

> **Prompt:** "In Receipt History, label the "Start Date" and "End Date" boxes in the same way as the "Search merchant" box is labeled. Also, keep the "Start Date" and "End Date" boxes side-by-side, but move them below the "Search merchant" box. Also, add a drop-down menu that filters between the major categories: Groceries, Dining, Transport, Health, Shopping, Entertainment, Utilities, Travel, and Other."

### Added
- Category filter for receipt history and export

#### `Receipts.html` — v01.10w

##### Added
- Full-width `#rh-cat` dropdown row in the history card, populated from the existing `CATEGORIES` array with a blank "All categories" option; sends `cat` on both `listReceipts` and `exportReceipts` calls and reloads on change

##### Changed
- History filter rows restructured: row 1 = merchant search + Search button; row 2 = "Start Date"/"End Date" boxes side-by-side, each with a small `.rh-field` label above (date inputs can't show placeholder text like the search box, so field labels are the matching treatment); row 3 = category dropdown

#### `Receipts.gs` — v01.08g

##### Added
- `category` parameter on `listReceipts` (exact match on the Category column, applied server-side before the row cap) and threaded through `exportReceipts` → internal `listReceipts` call; `cat` parameter wired into all four transport routes (POST + GET fallback for both ops)

### Verified
- `node --check` on the `.gs` and all inline scripts; Playwright at 390px — labels "Start Date"/"End Date" render above the side-by-side boxes, dropdown lists all 9 categories + "All categories", no horizontal scroll, zero page errors

## [v01.26r] — 2026-08-01 06:36:33 AM EST

> **Prompt:** "Everything works. Also, remove the checkbox for "Show unsaved uploads". I think it's redundant now that I will never upload a receipt without saving."

### Removed
- "Show unsaved uploads" checkbox from the history card (`live-site-pages/Receipts.html` v01.09w): markup, its change listener, and the `uploaded` parameter from the history-load and export calls — the UI is saved-only. The server-side `uploaded` parameter on `listReceipts`/`exportReceipts` is intentionally retained (harmless capability; the client simply no longer sends it), so unsaved rows remain reachable via the spreadsheet if ever needed

### Verified
- Zero `rh-show-uploaded` references remain; `node --check` on all inline scripts; Playwright render — sort checkbox and export button intact, zero page errors

## [v01.25r] — 2026-08-01 06:25:29 AM EST

> **Prompt:** "I tested the 2 actions and both work as intended. 1. In the Receipt History, standardize merchant names to be: capitalize the first letter of each word with the rest lower-case (ie: Trader Joe's instead of TRADER JOE'S). 2. In the Receipt History, when I try to "view photo", it says that "jonyang92@gmail.com" doesnt have access to the file. I assume it's because the folder is on "LightAISolution@gmail.com"'s Drive. I would like for this folder's permissions to be synced to my MasterACL file's permissions. For example, if I give a new email Admin access to my Receipts app via the MasterACL spreadsheet, I want that email to automatically get access to this Receipt Pictures folder. Make the changes necessary so that this can happen." *(screenshots: history with mixed-case merchants; Drive "you need access" page for jonyang92@gmail.com)*

### Added
- **Drive folder ↔ Master ACL permission sync** (`googleAppsScripts/Receipts/Receipts.gs` v01.07g): `syncDriveFolderAccess_()` reads the Access tab (col A emails, Receipts column TRUE, metadata rows skipped via the @-check), grants VIEWER on the photos folder to every authorized user, and revokes viewers whose grant was removed — the folder owner and manually-added editors are never touched. Runs from `listReceipts` (first thing opened before viewing photos), throttled via CacheService to once per 10 minutes; best-effort with the app's session auth as the real gate

### Changed
- **Merchant standardization**: `titleCase_()` (capitalize each word start incl. after hyphen/slash, rest lower-case, apostrophes preserved — "TRADER JOE'S" → "Trader Joe's") applied to `data.merchant` at save time; migration upgraded to **v3** (flag `RECEIPT_ID_FORMAT=v3`): title-cases all saved merchants in place and regenerates `Store_Name-YYYYMMDD` IDs + LineItems references + Drive photo names where the standardized name changes them (collision-suffix-only differences keep the existing ID)
- Pipeline diagram history flow updated (v3 migration + folder ACL sync; pako URL regenerated, decompression-verified)

### Verified
- `node --check` on the `.gs`; `titleCase_` behavior checked against real merchant strings (TRADER JOE'S → Trader Joe's, MEGA MART → Mega Mart, cvs/pharmacy #123 → Cvs/Pharmacy #123, seven-eleven → Seven-Eleven)

## [v01.24r] — 2026-08-01 06:06:54 AM EST

> **Prompt:** "I tested all 6 actions and they all worked as intended. Go with your suggested supermarket department taxonomy (16 departments). I want per-item editing in the review screen."

### Added
- Per-item department editing in the review screen (`live-site-pages/Receipts.html` v01.08w): each line item is now a two-line block — inputs row + a compact department `<select>` (`.rr-cat`, client `ITEM_CATS` mirrors the GAS `ITEM_CATEGORIES` 16-department enum) pre-selected from Gemini's auto-assignment; `collectReview()` includes `category` per item

### Fixed
- Extracted per-item categories were being dropped on save — the review UI didn't carry them, so `collectReview()` sent items without `category` and `saveReceipt` stored empty strings. The dropdowns now carry the extraction values (edited or not) through to the LineItems tab and the export

### Verified
- `node --check` on all inline scripts; Playwright at 390×844 — three item blocks with departments Produce/Pantry/Beverages set via the real Add-item path, selects render under each row, no horizontal scroll, zero page errors. GAS untouched (v01.06g unchanged — `saveReceipt` already persisted `it.category`)

## [v01.23r] — 2026-08-01 05:28:51 AM EST

> **Prompt:** "I tested all three actions and everything works as intended. Currently, the receipt history shows the receipts based on upload order; Create a checkbox option to show the receipts chronologically based on the receipt dates instead of upload order. Also, reformat the default "Receipt ID"s to "Store_Name-YYYYMMDD"; Update the existing receipts' IDs to match. Also, currently, the status (uploading, extracting, saved, etc) window is to the right of the "History" button; Move the status window below the "Scan Receipt" and "History" buttons and add a progress bar that makes sense for this application. Also, when extracting, record the store address as well. Also, in the exported excel spreadsheet tab "LineItems", make it easy to distinguish and switch between the different receipts. After executing the above, continue with Phase 5: automatic spending categories (assigned during extraction), a monthly-summary tab, duplicate-receipt detection. Regarding the automatic spending categories, refer to existing apps like ReceiptCamp, Expensify, and Smart Receipts to figure out the best categories to use to cover the entirety of grocery store items."

### Added
- **Readable receipt IDs** (`googleAppsScripts/Receipts/Receipts.gs` v01.06g): `makeReceiptId_()` builds `Store_Name-YYYYMMDD` (sanitized merchant, collision suffix `-2`/`-3`), assigned at save time since merchant/date are unknown at upload; the Drive photo is renamed to match; one-time lazy migration (`migrateReceiptIds_()`, Script-Properties-flag + LockService guarded, triggered from `listReceipts`) renames all existing saved receipts, their LineItems rows, and photos
- **Store address**: added to the Gemini schema, new "Store Address" column (in-place header upgrade for existing sheets), editable field in the review card (`live-site-pages/Receipts.html` v01.07w), shown in history detail (📍) and the export
- **Progress bar + status relocation**: status line moved below the Scan/History buttons; stepped bar tracks Compressing (15) → Uploading (40) → Extracting (70) → Done (100, green) and Saving (85) → Saved (100); cards shifted down (top 128px) to clear the taller panel
- **"Sort by receipt date" checkbox** — server-side sort in `listReceipts` (`sort=date`, newest printed date first, undated rows last)
- **Phase 5a — automatic per-item categories**: `ITEM_CATEGORIES` (16 supermarket departments: Produce, Meat & Seafood, Dairy & Eggs, Bakery, Deli & Prepared, Frozen, Pantry, Snacks & Candy, Beverages, Alcohol, Household, Personal Care, Baby, Pet, Non-Grocery, Other) assigned by Gemini per line item via schema enum; stored in a new LineItems "Category" column, shown in history detail and the export. Reference apps (Expensify/Smart Receipts style) verified via web search to use merchant-level buckets only, so item level uses standard supermarket department taxonomy
- **Phase 5b — Monthly Summary tab**: `rebuildMonthlySummary_()` aggregates saved receipts per month (count, total, per-receipt-category totals), rebuilt on every save/delete and mirrored as a third sheet in the export
- **Phase 5c — duplicate detection**: `saveReceipt` rejects a save matching another saved receipt's merchant+date+total with `{error: 'duplicate', duplicateOf}`; the review card warns and the next Save press sends `force=1` ("save anyway")

### Changed
- **Export LineItems readability**: items grouped per receipt under bold banded header rows (store · date · total) with alternating block colors and blank separators; Receipt ID column retained for filtering; Receipts sheet gains the Store Address column; export response count fixed to actual item rows
- Receipt Pipeline diagram updated with ID assignment, duplicate check, address, summary rebuild, sort and migration steps (pako URL regenerated, decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright at 390×844 and 390×700 — status+progress render below the buttons, review card (with address) no longer overlaps the taller panel, sticky Save still visible; zero page errors

## [v01.22r] — 2026-08-01 04:38:48 AM EST

> **Prompt:** "History works, but I want you to only show "saved" receipts by default. Add a checkbox option to show uploaded but unsaved receipts. Also, give me an option to delete records as well. Meanwhile, continue with Phase 4."

### Added
- **Record deletion** (`googleAppsScripts/Receipts/Receipts.gs` v01.05g, `live-site-pages/Receipts.html` v01.06w): GAS `deleteReceipt` route removes the receipt row + its LineItems rows and trashes the Drive photo (fileId parsed from the stored URL; recoverable ~30 days). Enforces the RBAC `delete` permission when the ACL's roles are configured (empty permission set falls back to session-only gating, matching other write routes). Client-side: per-row 🗑 with a two-tap inline confirmation (arm → "Delete?" → 4s auto-disarm) — no browser `confirm()` per the repo's UI Dialogs rule
- **Receipts Phase 4 — .xlsx export**: GAS `exportReceipts` builds a temp two-sheet spreadsheet (Receipts incl. subtotal/tax/total pulled per-ID, LineItems for the matching IDs), exports it via the Drive endpoint with `ScriptApp.getOAuthToken()`, trashes the temp file (in a `finally`), and returns `{fileName, base64}`; "⬇️ Export .xlsx" button downloads it as a Blob using the current history filters
- "Show unsaved uploads" checkbox in the history filter header

### Changed
- History now defaults to **saved receipts only** — `listReceipts` gained a status filter (`uploaded=1` includes unsaved rows), wired to the checkbox
- Delete + export flows appended to the Receipt Pipeline diagram (pako URL regenerated, decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render at 390×700 — checkbox, export button, idle 🗑 and armed "Delete?" states all visible, no horizontal scroll, zero page errors

## [v01.21r] — 2026-08-01 04:12:06 AM EST

> **Prompt:** "I re-scanned the Trader Joe's receipt and it successfully saved. I then tried a long MegaMart receipt and it also succeeded, but the extraction took close to 10 minutes. Is there any way to speed up this process? Meanwhile, continue with Phase 3."

### Fixed
- **~10-minute extractions** (`googleAppsScripts/Receipts/Receipts.gs` v01.04g): root cause was the fetch transport double-running the work — the POST leg ran the full extraction, Google returned an unparseable error page, and the GET fallback re-ran everything. Three changes: (1) extraction results now cached server-side by fileId (`CacheService`, 10-min TTL) so a second transport leg returns instantly; (2) `gemini-3.6-flash` promoted to primary (faster generation; the observed 503 congestion was on 3.5-flash, now the fallback); (3) retry plan trimmed 4 → 3 attempts to bound worst-case wall time

### Added
- **Receipts Phase 3 — history browser** (`Receipts.gs` v01.04g, `live-site-pages/Receipts.html` v01.05w): GAS `listReceipts` route (merchant substring + date-range filters, newest first, cap 500) and `getReceiptDetail` route (full fields + LineItems rows), both with POST + GET api fallbacks; HTML "🧾 History" button + history card (z-index 7, dvh-sized, sticky filter header) with search/date inputs, receipt list (status ✅/📤, totals), tap-to-expand cached details, and photo links; HTML-escaping helper for all rendered spreadsheet data
- History flows appended to the Receipt Pipeline sequence diagram in `repository-information/diagrams/Receipts-diagram.md` (pako URL regenerated and decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render of the history card with simulated rows + expanded detail at 390×700 (no horizontal scroll, zero page errors)

## [v01.20r] — 2026-08-01 03:51:49 AM EST

> **Prompt:** "it successfully extracted the information, but after scrolling to the bottom, I cannot see nor click "Save Receipt". Resize this UI to make it more user friendly and possible to save receipts." *(screenshot: 12-item extracted receipt, card scrolled to "+ Add item" with the action row cut off below the visible screen)*

### Fixed
- Unreachable Save button on mobile (`live-site-pages/Receipts.html` v01.04w): the review card's `max-height` used `100vh`, which on mobile includes the area behind the browser URL bar — with long item lists the card's bottom edge (action row) landed below the visible screen. Now sized with `100dvh` (dynamic viewport height; `100vh` kept as older-browser fallback) plus extra bottom clearance above the version pills

### Changed
- Save/Discard/Retry row is now a **sticky action bar** pinned to the card's bottom edge (`position: sticky` with background + top border) — always visible and clickable regardless of scroll position; the fields and item list scroll underneath it

### Verified
- Playwright at 390×700 (short viewport simulating browser chrome) with a 12-item receipt: Save button inside the viewport and clickable via `document.elementFromPoint` both before and after scrolling the card's content; zero page errors

## [v01.19r] — 2026-08-01 03:17:05 AM EST

> **Prompt:** "I got the attached error message" *(screenshot: review card open in manual-entry fallback with `Extraction failed (gemini_http_503: This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.)`)*

### Fixed
- Transient Gemini 503 "high demand" failures (`googleAppsScripts/Receipts/Receipts.gs` v01.03g): `extractReceipt` now runs a 4-step retry plan — primary model twice (0s/2s waits), then `GEMINI_FALLBACK_MODEL = "gemini-3.6-flash"` twice (1s/3s waits) — retrying only transient statuses (503/429/500); non-transient errors (bad key, bad request) still fail fast to avoid burning quota

### Added
- "Retry extraction" button in the review card (`live-site-pages/Receipts.html` v01.03w): shown only when extraction fails; re-runs extraction against the already-uploaded Drive file (tracked via new `currentFileId`) and re-populates the card on success — no re-photographing needed

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render of the failed-extraction state at 390×844 (retry button visible, no horizontal scroll, zero page errors)

## [v01.18r] — 2026-08-01 03:07:59 AM EST

> **Prompt:** "The receipt picture was successfully taken and uploaded. Start phase 2."

### Added
- **Receipts Phase 2 — AI extraction + review-before-save** (`googleAppsScripts/Receipts/Receipts.gs` v01.02g, `live-site-pages/Receipts.html` v01.02w):
- GAS `extractReceipt` route (POST + GET api fallback; session-validated): reads the uploaded photo back from Drive by fileId and calls Gemini `generateContent` (`GEMINI_MODEL = "gemini-3.5-flash"`, key from Script Properties `GEMINI_API_KEY`) with a strict `responseSchema` returning merchant, date, currency, subtotal, tax, total, category (9-option enum), and lineItems[]; temperature 0; robust error mapping (`gemini_key_missing`, `gemini_http_*`, `gemini_parse_failed`)
- GAS `saveReceipt` route (body-POST only — reviewed JSON can exceed GET URL limits): fills the receipt's row by Receipt ID (date/merchant/currency/subtotal/tax/total/category), sets status `saved`, stores the raw extraction JSON for audit, and replaces the receipt's LineItems rows idempotently
- HTML review card (`#receipt-review-card`, z-index 6 — under the overlay walls like the scan panel): auto-opens pre-filled after extraction with editable fields + category dropdown + line-items grid (add/remove rows), Save/Discard actions; opens empty for manual entry when extraction fails; `uploadReceipt` now returns `fileId` to feed extraction
- New "Receipt Pipeline" sequence diagram section in `repository-information/diagrams/Receipts-diagram.md` (upload → extract → review → save; pako URL generated and decompression-verified)

### Verified
- Gemini model names verified against current documentation via web search (gemini-3.5-flash / gemini-3.6-flash, free tier); `node --check` on the `.gs` and all inline scripts; Playwright render of the populated review card at 390×844 and 1280×800 (no horizontal scroll, zero page errors)

## [v01.17r] — 2026-08-01 02:26:53 AM EST

> **Prompt:** "I approve the plan to PWA-ify the web app. I have also granted Receipts ACL permission to "jonyang92@gmail.com" and confirmed that the live page loads. LightAISolution's Drive folder ID is "1DHfXwzo0qXI_2H0Q2dDLKGn7EOtguI0A"."

### Added
- **Receipts Phase 1 upload pipeline** (`live-site-pages/Receipts.html` v01.01w, `googleAppsScripts/Receipts/Receipts.gs` v01.01g): "📷 Scan receipt" panel in the page PROJECT blocks — camera-direct capture on phones (`capture="environment"`), file picker on desktop, client-side canvas compression (max 1600px JPEG q0.82, EXIF-orientation-aware via `createImageBitmap`), thumbnail + status feedback. New `_gasPostBody()` transport variant sends the base64 image in a form-encoded POST body with 3-attempt retry (the template's `_gasPost` carries params in the URL — impossible at image sizes; no GET fallback exists for the same reason)
- GAS side: `uploadReceipt` route (`doPost action=uploadReceipt`, session-validated via `validateSessionForData`) decodes and saves the photo to the configured Drive folder and appends an "uploaded" row to the `Receipts` tab; idempotent `ensureReceiptTabs_()` bootstraps the `Receipts` + `LineItems` tabs (frozen headers) on first write — Phase 2's extraction will fill the remaining columns
- **PWA install support**: new `live-site-pages/receipts.webmanifest` + generated app icons (`images/receipts-icon-192.png`, `receipts-icon-512.png`, maskable) + manifest/theme-color/apple-touch head tags in `Receipts.html`; CSP `manifest-src` relaxed `'none'` → `'self'` in both CSP tags, marked with a `PROJECT OVERRIDE` comment
- `DRIVE_FOLDER_ID` added to `Receipts.config.json` and mirrored in `Receipts.gs` (config sync per [PC-GAS-CONFIG] #14)

### Verified
- `node --check` passes on the full `.gs` and every inline HTML script block; Playwright render checks at 390×844 and 1280×800 — panel centered with no horizontal scroll, zero page errors

## [v01.16r] — 2026-08-01 01:40:25 AM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push. `bash scripts/setup-gas-project.sh <<'CONFIG' { "PROJECT_ENVIRONMENT_NAME": "Receipts", "TITLE": "Receipts", "DEPLOYMENT_ID": "AKfycbwASoUFzqdy3Bb-NbsbG6Hh3-9fPz1aGJGi8AbUsBV0YBu85ockXXdWkLKB8kEtivrb", "SPREADSHEET_ID": "1SfVRsHm6pUn1bq633BSKiQ8c3IsQeVAs7H0265ckdDM", "SHEET_NAME": "Live_Sheet", "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "INCLUDE_AUTH": true, "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com", "AUTH_PRESET": "hipaa", "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE", "ACL_SHEET_NAME": "Access" } CONFIG`"

### Added
- New auth GAS project **Receipts** (HIPAA preset) created via `scripts/setup-gas-project.sh` — 10 files: `live-site-pages/Receipts.html` (v01.00w), `googleAppsScripts/Receipts/Receipts.gs` (v01.00g), `Receipts.config.json`, html/gs version files, page + GAS changelogs with archives, and per-environment diagram `repository-information/diagrams/Receipts-diagram.md`
- Registered across the repo: GAS Projects table (`.claude/rules/gas-scripts.md`), README structure tree (page entry with version links + all subtree entries), REPO-ARCHITECTURE.md (RECEIPTS_PAGE + GAS_RECEIPTS nodes and template-source/iframe/serves/deploy/polling edges), and a `Deploy Receipts` webhook step in `.github/workflows/auto-merge-claude.yml`
- Live config wired in at creation: real deployment ID (obfuscated `_e` URL in the page verified against expected encoding), data spreadsheet (`Live_Sheet`), and real Master ACL spreadsheet ID in both `.gs` and `.config.json` — Global ACL Access-tab self-registration active on first page load

### Changed
- Regenerated the Flowchart and Class Diagram mermaid.live pako URLs in `repository-information/REPO-ARCHITECTURE.md` (both went stale when the setup script added the Receipts nodes) — decompression-verified, including the new `Receipts-diagram.md` link

## [v01.15r] — 2026-07-18 03:15:05 AM EST

> **Prompt:** "Create a 5 second animation of Spain vs Argentina in the 2026 world cup and show it on repeat."

### Added
- New standalone page `live-site-pages/spain-argentina.html` (v01.00w), created from `HtmlAndGasTemplateAutoUpdate-noauth.html.txt`: a pure-CSS 5-second Spain vs Argentina World Cup 2026 match animation that loops infinitely (`animation: … 5s … infinite`). PROJECT blocks contain a scoreboard (🇪🇸 ESP 0–0 ARG 🇦🇷), a striped pitch with halfway line/centre circle/boxes/goals, three Spain players (red/yellow), three Argentina players (albiceleste stripes incl. a diving keeper), a ⚽ ball that passes through midfield and finishes in Argentina's net, and a "GOAL!" flash at ~80% of the loop. No JavaScript added — the JS PROJECT block stays empty (animation is CSS-only); no GAS project
- New tracking files: `html-versions/spain-argentinahtml.version.txt` (`|v01.00w|`), `html-changelogs/spain-argentinahtml.changelog.md` + `spain-argentinahtml.changelog-archive.md`
- Registered the page in the README tree (Standalone Utilities group + html-versions/html-changelogs subtrees) and in REPO-ARCHITECTURE.md's flowchart (SPAINARG_PAGE node + serves/version-polling/template-copy edges; pako URL regenerated and decompression-verified)
- Verified via Playwright at two loop timestamps (~1.8s mid-play, ~4.2s GOAL flash); fixed an invalid `font:` shorthand (`inherit` family) found during the check by switching to explicit font-size/weight properties

## [v01.14r] — 2026-07-18 02:39:24 AM EST

> **Prompt:** "In my Scraper project, remove the text box + submit button."

### Removed
- Scraper text-submission UI (`live-site-pages/Scraper.html` v01.04w): removed the text box + Submit button panel — the PROJECT-block CSS (`#text-submit-panel` and related rules), the panel markup, and the submit wiring JS (fetch `submitText` call, Enter-to-submit, inline status feedback). PROJECT START/END markers left in place (empty) for future page content. The GAS-side `submitText` route in `googleAppsScripts/Scraper/Scraper.gs` is intentionally retained unchanged (now unused) — removal not requested
- Verified via Playwright render check: page renders cleanly with no leftover panel or layout artifacts (the 5 pre-existing `file://` CSP logo-image refusals reproduce identically on the unmodified page)

## [v01.13r] — 2026-07-18 12:05:25 AM EST

> **Prompt:** "In the Scraper project, create a text box with a submit button. When the user clicks submit, copy whatever they wrote in the text box into the spreadsheet."

### Added
- Scraper text submission feature (`live-site-pages/Scraper.html` v01.03w, `googleAppsScripts/Scraper/Scraper.gs` v01.04g): a top-center panel with a text box + Submit button in the page's PROJECT blocks (hidden behind the auth wall until sign-in; z-index 5 — above the GAS iframe, below all overlay walls). Submission goes over the iframe-free fetch transport to a new `PROJECT:`-marked `doPost action=submitText` route (with GET `api op=submitText` fallback) → `submitText()` in the PROJECT block, which validates the session via `validateSessionForData`, trims/caps input at 5000 chars, and appends `[timestamp, user email, text]` to `Live_Sheet` in the configured spreadsheet. Inline status feedback (Saving… / Saved ✓ / error), Enter-to-submit, button disabled while in flight
- Verified: GAS + HTML JS syntax parse, Playwright render check with simulated signed-in state (panel positioned correctly, no overlap with pills/overlays)

## [v01.12r] — 2026-07-17 11:45:41 PM EST

> **Prompt:** "I was able to pass the "Connect to server" issue from earlier, but i still cannot sign in. See attached screenshot."

### Fixed
- Embedded app screen blocked after successful fetch sign-in (Google Drive "Sorry, unable to open the file" inside the iframe + `action=securityEvent` 404 spam — the multi-account `/u/N` routing 404 hitting the remaining iframe loads): the `#gas-app` iframe and the hidden securityEvent frames are now created **credentialless** in `live-site-pages/MasterACL.html`, `Scraper.html`, `globalacl.html` (all v01.02w) and the auth HTML template — cookie-less iframes get Google's anonymous serving path (the same path verified working via server probes), while the session continues to travel in the `?session=` URL. Browsers without `credentialless` support ignore the attribute (prior behavior preserved). Flagged as a documented inference: anonymous serving, cookie removal, and anonymous GAS usage are each verified, but the combination inside a credentialless iframe is untested until the owner confirms in-browser

## [v01.11r] — 2026-07-17 10:05:56 PM EST

> **Prompt:** "Do the fetch conversion (your recommendation) AND address this: "The root-cause template defect (setup script generates `standard`-preset GAS against a hipaa-built HTML template) still awaits a permanent fix so future projects are born working" (your heads-up)."

### Added
- **Iframe-free `fetch` sign-in transport** ported from the `testauthgas1` scaffold into `live-site-pages/MasterACL.html` (v01.01w), `Scraper.html` (v01.01w), and `globalacl.html` (v01.01w): new `_gasPost()` (POST with GET `action=api` fallback), `exchangeViaFetch()`, `_mapExchangeError()`, `_completeSignInFetch()` (transport-verified direct show — no `gas-auth-ok` gate), plus fetch branches in `sendHeartbeat()`, the sign-out flow, and the page-load session restore (heartbeat-validated). `HTML_CONFIG.TOKEN_EXCHANGE_METHOD` → `'fetch'`. Cookie-less fetch always reaches Google's anonymous serving path, making the auth machinery immune to the blocked framed `/exec` responses (multi-account `/u/N` 404s, X-Frame-Options) that killed iframe sign-in in the owner's normal browser
- GAS routes for the transport in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.07g), `Scraper.gs` (v01.03g), `globalacl.gs` (v01.01g): `doPost action=exchangeToken` (with `ensureScriptProperties_()` bootstrap) and `action=signOut`, plus a general `doGet action=api` GET fallback (`exchangeToken`/`signOut`/`heartbeat` ops)

### Changed
- **Permanent template fix**: the same conversion applied to `live-site-pages/templates/HtmlAndGasTemplateAutoUpdate-auth.html.txt` and `gas-minimal-auth-template-code.js.txt` — future auth projects are born with the fetch transport, which no longer depends on the GAS preset's `TOKEN_EXCHANGE_METHOD`, dissolving the standard-vs-hipaa exchange mismatch permanently
- Template propagation note: `testauthgas1` (already the fetch reference) and `testauthhtml1` (intentionally the postMessage test scaffold) were left unchanged; the latent `processDataPoll` dead-route in the GAS template generation was left as-is (not referenced by the new routes)

### Verified
- Full-file JS syntax parse on all 4 GAS files and all inline script blocks of the 4 HTML files; Playwright `file://` smoke test on the 3 converted pages (only known file-protocol restrictions logged, zero code errors)

## [v01.10r] — 2026-07-17 09:22:12 PM EST

> **Prompt:** "@"/root/.claude/uploads/07152af2-7240-5bfb-8986-2eaa697523c9/af91e797-globalacl_working_sample_v01.89g.txt" See attached .txt file for a successful example. Compare this with my GAS code and update mine as needed to resolve my sign-in problem for "jonyang92@gmail.com". This example is being used for a different company, so scrub out anything specific and give me a working skeleton that can be applied to my GAS code."

### Changed
- Compared the uploaded working sample (globalacl v01.89g, other org) against our GAS code after scrubbing org-specific values: function inventories and the entire sign-in path are identical — the only functional configuration difference is that the working org runs `ACTIVE_PRESET: 'hipaa'`. Aligned `googleAppsScripts/MasterACL/MasterACL.gs` (v01.06g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.02g) to that proven skeleton: `ACTIVE_PRESET` → `'hipaa'`, `PROJECT_OVERRIDES` made byte-identical to the sample (`ENABLE_DOMAIN_RESTRICTION: false`, `ALLOWED_DOMAINS: []`, `SESSION_EXPIRATION: 7200`), removing the now-redundant `TOKEN_EXCHANGE_METHOD` override (hipaa's default is `postMessage`). The embedding HTML's own comments ("must match GAS PRESETS.hipaa...") confirm the auth HTML template was written for the hipaa preset — the setup script generating `standard`-preset GAS against it is the template defect. Session durations verified in sync both sides (7200/28800). The sample's `PROJECT:` doPost signOut wrapper was not ported (workspace-specific, unrelated to sign-in). Note: the browser-side multi-account `/exec` 404 (Google issue) remains — single-account session still required

## [v01.09r] — 2026-07-17 08:36:54 PM EST

> **Prompt:** "I still cannot sign in as "jonyang92@gmail.com". Fix the problem."

### Fixed
- Sign-in timeout ("The sign-in service isn't responding") on MasterACL and Scraper: the auth HTML template hardcodes `TOKEN_EXCHANGE_METHOD: 'postMessage'`, but the GAS `standard` preset resolves it to `'url'` — the served shell had no postMessage token listener, so the OAuth token exchange never completed and the 25s reachability watchdog fired. Confirmed by probing the live `/exec` deployment (healthy, serving current code, correct `gas-needs-auth` handshake — ruling out deployment/OAuth-access causes). Fix: `TOKEN_EXCHANGE_METHOD: 'postMessage'` added to `PROJECT_OVERRIDES` in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.05g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.01g) — the combination the working hipaa-preset projects (Globalacl, test pages) already use. Latent template defect noted: every future `standard`-preset auth project inherits this mismatch until the GAS template or setup script aligns the two sides

## [v01.08r] — 2026-07-17 08:10:18 PM EST

> **Prompt:** "The first screenshot is the error message I get when I try to sign in with "jonyang92@gmail.com" and the second screenshot is an example of a successful Master ACL sheet. Modify the "grantUserAccess" function to resolve the first problem and modify my Master ACL sheet to look like the second screenshot."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.04g): `grantUserAccess()` reworked into a three-phase utility. Phase 1 (STRUCTURE) verifies/repairs the Master ACL spreadsheet to match the reference layout — creates the Access tab if missing, writes `Email`/`Role` headers, adds the `#NAME`/`#URL`/`#AUTH`/`#ICON`/`#DESC` metadata rows via `ensureMetadataRows`, creates a `Roles` tab with the default permission matrix (new `ensureRolesTab_` helper, checkboxes included), and registers this project's page column. Phase 2 (GRANT) unchanged — default admin grants for the two owner emails. Phase 3 (WEB APP PROBE) initializes required Script Properties then fetches the project's own `/exec` URL and logs a precise verdict — the page's "sign-in service isn't responding" watchdog fires when the deployment doesn't serve the app, so the probe distinguishes healthy / access-not-Anyone / stale-or-empty-deployment (with click-by-click fix instructions)

## [v01.07r] — 2026-07-17 07:47:16 PM EST

> **Prompt:** "GAS is telling me: "No emails specified. Set Script Properties key "GRANT_ACCESS_EMAILS" (single email or comma-separated list), optionally "GRANT_ACCESS_ROLE", then Run again." Make it so I don't have to do this. Add "jonyang92@gmail.com" and "lightaisolution@gmail.com"."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.03g): `grantUserAccess()` no longer requires Script Properties — when `GRANT_ACCESS_EMAILS` is unset it falls back to built-in defaults `DEFAULT_GRANT_EMAILS` (`jonyang92@gmail.com`, `lightaisolution@gmail.com`) with `DEFAULT_GRANT_ROLE` (`admin`). Script Properties still override the defaults when set, for granting other users/roles

## [v01.06r] — 2026-07-17 07:42:23 PM EST

> **Prompt:** "No one has permissions to access these projects right now. Make a function that I can run that allows new users to get permission."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.02g): new `grantUserAccess()` admin utility in the PROJECT block — run from the Apps Script editor with Script Properties `GRANT_ACCESS_EMAILS` (single or comma-separated) and optional `GRANT_ACCESS_ROLE` (default `viewer`). Appends Access-tab rows for new users (role + TRUE for every page column, with checkboxes), re-enables all page columns for existing rows (role updated only when explicitly set), validates the role against the known role list with a warning, and bumps the access-cache epoch so grants take effect immediately. One run grants access to every registered project since all auth projects share the central Master ACL spreadsheet

## [v01.05r] — 2026-07-17 07:37:12 PM EST

> **Prompt:** "I can't sign into my MasterACL project with my personal email (jonyang92@gmail.com) because permissions are not set by my work email (lightaisolution@gmail.com). Autocreate the admin permissions for my personal email."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.01g): new `PROJECT OVERRIDE` block with `SEED_ADMIN_EMAILS` (`jonyang92@gmail.com`) and an idempotent `ensureSeedAdmins()` called from `doGet` — appends an `admin`-role row with all page columns TRUE to the Access tab when the email is missing, bumps the access-cache epoch so cached denials clear immediately, and never touches existing rows (manual spreadsheet edits always win). Runs server-side as the deployment owner, so it works even though the visiting user has no spreadsheet access

## [v01.04r] — 2026-07-17 07:18:01 PM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "Scraper",
>   "TITLE": "News Scraper",
>   "DEPLOYMENT_ID": "AKfycby8nOR0AqLsDlZPcrTX9dWIInY48R9Jrl8oBDtN5t0emC06j7iwidEMdXttrD1zXnjUIg",
>   "SPREADSHEET_ID": "19U0Wu25eUXEHPVz4VWjKQIpnRozgFycNSjFCTB-umkk",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **Scraper** (News Scraper — auth-enabled, `standard` preset) created via `scripts/setup-gas-project.sh`: `live-site-pages/Scraper.html` (v01.00w), `googleAppsScripts/Scraper/Scraper.gs` (v01.00g), `Scraper.config.json` with real deployment/spreadsheet IDs and Master ACL registration, version files, page/GAS changelogs + archives, and `repository-information/diagrams/Scraper-diagram.md` (with verified mermaid.live link)
- `Deploy Scraper` webhook step added to `.github/workflows/auto-merge-claude.yml`; Scraper registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges — all script-generated with no manual repair needed (v01.03r script fixes verified in production)

### Changed
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to include the new Scraper nodes (verified by decompression)

## [v01.03r] — 2026-07-17 07:11:12 PM EST

> **Prompt:** "fix the setup script defects"

### Fixed
- `scripts/setup-gas-project.sh` Phase 6: the GAS Projects registration row was appended after the last `|`-prefixed line in the whole file (landing in the coding-guidelines pointer table) — now anchors on the `| Project | Code File |` header and inserts after the last contiguous row of that table
- `scripts/setup-gas-project.sh` Phase 9: the workflow deploy step anchored on a `# ── AHK VERSION FILE UPDATE ──` banner comment that no longer exists, silently skipping the insert — now anchors on the stable `- name: Update AHK version files` step name
- `scripts/setup-gas-project.sh` Phase 5b: generated per-environment diagrams lacked the mandatory "Open in mermaid.live" link — the script now generates the pako URL via `python3` (zlib is pako-compatible) with round-trip verification and a warning fallback when Python is unavailable
- All three fixes verified end-to-end against a throwaway repo copy (row placement, workflow step position, link decompression)

## [v01.02r] — 2026-07-17 06:55:07 PM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "MasterACL",
>   "TITLE": "MasterACL",
>   "DEPLOYMENT_ID": "AKfycbxgxErSg_DfV7WjVvDQ4_LVkFAkON-86iJaNhQ3k50Hs-WbQ2KLskfRtnzSVlZNIHhc8Q",
>   "SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "IS_MASTER_ACL": true,
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **MasterACL** (auth-enabled, `standard` preset, flagged as the Master ACL project) created via `scripts/setup-gas-project.sh`: `live-site-pages/MasterACL.html` (v01.00w), `googleAppsScripts/MasterACL/MasterACL.gs` (v01.00g), `MasterACL.config.json` with real deployment/spreadsheet IDs, version files, page/GAS changelogs + archives, and `repository-information/diagrams/MasterACL-diagram.md`
- `Deploy MasterACL` webhook step added to `.github/workflows/auto-merge-claude.yml` (the setup script announced this step but never wrote it — added manually, mirroring the Globalacl step)
- MasterACL registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges

### Fixed
- Setup script defect: the GAS Projects table row was inserted into the coding-guidelines pointer table in `.claude/rules/gas-scripts.md` — moved to the actual GAS Projects table
- Added the missing "Open in mermaid.live" link to `MasterACL-diagram.md` and regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (both verified by decompression)

## [v01.01r] — 2026-07-13 08:28:42 PM EST

> **Prompt:** "continue with your recommendation"

### Changed
- Initialized repository identity: internal links, branding URLs, and live-site references updated from the template's `lightaisolutions` repo name to `Sales` across README.md, CITATION.cff, issue template config, REPO-ARCHITECTURE.md, index.html, sitemap.xml, and robots.txt (`bash scripts/init-repo.sh LightAISolutions Sales ShadowAISolutions` + manual follow-ups; developer branding `ShadowAISolutions` preserved)
- GAS Project Creator page defaults now point to this repository — GitHub Repo field prefills `Sales` and the three logo URL fields prefill `https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg` (v01.01w)
- Regenerated `repository-information/readme-qr-code.png` to encode this repository's URL (`https://github.com/LightAISolutions/Sales`)
- Updated CLAUDE.md Template Variables table: `YOUR_REPO_NAME` → `Sales`

### Fixed
- Corrected GitHub Pages hostnames mangled by the init script's global replace — the template's org and repo share the same lowercase string, so `lightaisolutions.github.io` became `Sales.github.io` in CITATION.cff, README.md, and REPO-ARCHITECTURE.md; restored to `lightaisolutions.github.io` (paths correctly remain `/Sales/`)
- Removed the duplicate `main` push-trigger entry the init script inserted into `.github/workflows/auto-merge-claude.yml` (this copy already had `main` in the trigger)
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (verified decompression)

Developed by: ShadowAISolutions
