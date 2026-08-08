# Profiler App — Company Profile Schema

The **Profiler** app (`live-site-pages/Profiler.html`) renders standardized corporate dossiers for companies in the ecosystem (suppliers, developers, integrators, investors, hyperscalers, advisors). All data lives in `live-site-pages/profiler-data/` and is fetched by the page at runtime via relative URLs (works with a private repo — GitHub Pages serves it publicly):

- `profiler-companies.json` — the **registry**: the roster the app lists and filters
- `<slug>.profile.json` — one **profile** per company: the full dossier

This file is the **single source of truth for the data schema**. Profiles are generated and revised by the **Profiler Command** (see `.claude/rules/profiler-app.md`), and every profile must conform to the structures below. The renderer only draws a section when its data is present, so optional sections can be omitted safely.

## Slug rules

- Lowercase, ASCII letters/digits/hyphens only (e.g. `sinexcel`, `sungrow`, `burns-mcdonnell`)
- The slug is the company's **permanent identity**: it names the profile file (`<slug>.profile.json`), forms the page URL (`Profiler.html#<slug>`), and keys the registry entry. Never change a slug once published — revise the profile in place instead
- One slug per corporate entity. Subsidiaries only get their own slug when they are genuinely distinct actors in the ecosystem

## Registry schema — `profiler-companies.json`

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Registry schema version (currently `1`) |
| `categories` | string[] | yes | Canonical category order for the filter chips: `supplier`, `developer`, `integrator`, `investor`, `hyperscaler`, `advisor`, `other` |
| `companies[]` | object[] | yes | One entry per covered company |
| `companies[].slug` | string | yes | Per Slug rules; must have a matching `<slug>.profile.json` |
| `companies[].name` | string | yes | Display name (short form, e.g. "Sinexcel") |
| `companies[].categories` | string[] | yes | One or more canonical categories |
| `companies[].tagline` | string | yes | One-line description shown on the roster card |
| `companies[].hq` | string | no | City, Country |
| `companies[].ticker` | string | no | `EXCHANGE: SYMBOL` for public companies |
| `companies[].status` | string | yes | `active` (normal) or `archived` (kept but de-emphasized) |
| `companies[].lastUpdated` | string | yes | `YYYY-MM-DD` of the profile's last revision — keep in sync with the profile's `lastUpdated` |

## Profile schema — `<slug>.profile.json`

Top-level fields:

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Profile schema version — currently `2` (v2 adds `recentDevelopments[]`, `strategyRead[]`, and the product depth fields). v1 profiles remain valid; the renderer skips absent sections. Write new/revised profiles at v2 |
| `slug` / `name` / `shortName` | string | yes | Identity; `name` is the full legal name, `shortName` the display name |
| `categories` | string[] | yes | Same values as the registry entry |
| `website` | string | no | `https://` URL |
| `headquarters` / `founded` / `employees` | string/number/string | no | Snapshot facts (employees as a string, e.g. `"~2,400 (2025)"`) |
| `ownership` | object | no | `{ "type": "public"\|"private"\|"subsidiary", "ticker": "EXCHANGE: SYMBOL" }` |
| `summary` | string | yes | Neutral 2–4 sentence description of what the company does |
| `ecosystemRole` | string | no | 1–3 sentences on how the company fits this ecosystem |
| `productsAndServices[]` | object[] | yes | `{ "name", "category", "description", "highlights": string[] }` — one entry per product/service line. **Optional depth fields (schema v2):** `positioning` (vs named competitors, differentiation), `soldThrough` (commercial model — direct / EPC / OEM-merchant / licensing), `targetSegments` (who it's sold to), `roadmap` (announced-not-yet-shipped items with dates) |
| `recentDevelopments[]` | object[] | no (v2) | `{ "date": "YYYY-MM-DD", "category", "headline", "read", "source" }` — trailing 12–18 months of order wins, product launches, partnerships, leadership changes, capacity expansions, regulatory/financial events. `category` ∈ `order-win`, `product-launch`, `partnership`, `leadership`, `capacity`, `regulatory`, `financial`, `other`. `read` is the one-line strategy takeaway ("so what"); `source` is a label or URL. Newest first |
| `strategyRead[]` | string[] | no (v2) | 3–5 analytical bullets synthesizing what the company's behavior says about its sales/product strategy (target segments & geographies, channel/commercial model, pricing posture, roadmap direction). **This is Claude's inference, not sourced fact** — the renderer labels it as analysis; never blend unsourced interpretation into other sections |
| `technicalSpecs[]` | object[] | no | `{ "product", "specs": [{ "label", "value" }], "notes" }` — flagship products only, concrete figures |
| `decisionMakers[]` | object[] | yes | See below |
| `financials` | object | yes | See below |
| `sources[]` | object[] | yes | `{ "label", "url", "accessed": "YYYY-MM-DD" }` — every fact in the profile must be traceable to one of these |
| `lastUpdated` | string | yes | `YYYY-MM-DD` of this revision |
| `profileVersion` | number | yes | Starts at `1`, +1 on every revision — gives Claude a diffable revision marker |

`decisionMakers[]` entries:

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `name` | string | yes | Romanized name (append native script in parentheses when relevant) |
| `title` | string | yes | Current role |
| `photo` | string | no | Repo-relative path (`images/execs/<slug>-<lastname>.jpg`) — **company-published photos only**; omit to render an initials avatar |
| `linkedin` | string | no | Full profile URL — only when a real public profile was verified; never guessed |
| `background` | string[] | yes | Work-experience bullets, most recent first (`"Role — Company (years)"` style); education last if notable |

`financials` object: `{ "currency", "type": "public"|"private", "periods": [...], "commentary" }`. Each period: `{ "period": "FY2024", "metrics": [{ "name", "actual", "expected", "verdict": "beat"|"miss"|"inline", "result" }], "commentary" }` — `expected` is the analyst consensus or company guidance at the time (state which in `result`/`commentary`); for private companies use disclosed figures/funding rounds and leave `expected` empty where none exists. Cover the trailing **two fiscal years** plus the latest interim period when published.

## Authoring rules

- **Products & services are the priority section** (developer directive, 2026-08-07) — `productsAndServices[]` and `technicalSpecs[]` carry the deepest research investment: enumerate every product line, name flagships, quote concrete specs, and fill all four depth fields per entry wherever the public record allows. Other sections stay standard-depth
- **Public sources only** — profiles deploy to public GitHub Pages. Company sites, filings, press releases, reputable financial media only. Never include deal notes, quoted pricing, NDA'd material, or anything learned privately
- **Source priority** — the target company's own Investor Relations and press-release pages outrank trade news: scrape them fully **first** (they are ground truth for products, specs, leadership, and company-reported figures), then use trade press, filings, and consultancies for what the company cannot supply about itself — expectations/consensus, independent rankings, and critical context. List first-party sources first in `sources[]`
- **No fabrication** — a number, name, spec, or URL that can't be sourced is omitted or marked as an estimate in the text; empty beats invented
- **Expectations honesty** — `expected` values must be real published consensus/guidance figures; when none exists, leave it empty and say so in commentary rather than manufacturing a benchmark
- **Photo policy** — only photos the company itself published (leadership page, press kit), downloaded into `live-site-pages/images/execs/` so the page never hotlinks. LinkedIn photos are never scraped (auth wall + ToS). No photo → the app renders an initials avatar automatically
- **Standard treatment for every company** — every profile uses exactly these sections. No company-specific sections, no bespoke fields, no special emphasis for any one company (explicit developer rule)
- **Analysis stays labeled** — `strategyRead[]` is the only section allowed to contain inference beyond the sources, and the renderer marks it as analysis; every other section states only what a cited source supports. A strategy read that a source directly supports belongs in `recentDevelopments[].read` instead
- **Recent-developments window** — cover the trailing 12–18 months, newest first; prefer first-party press releases as the `source` per the source-priority rule, with trade press for events the company didn't announce itself
- **Dates everywhere** — `lastUpdated`, per-source `accessed` dates, and period labels make staleness visible; a future revision session bumps `profileVersion` and `lastUpdated`

## Field Notes schema — `profiler-notes.json`

A single chronological log of first-hand intel the developer collects from industry contacts, in-person events, calls, and other channels. Captured via the **Profiler Note Command** (see `.claude/rules/profiler-app.md`). Rendered by the app's ⚙ (settings cog) changelog on the dashboard, and read by every future research/refresh/report session as recall context.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Notes schema version (currently `1`) |
| `notes[]` | object[] | yes | All notes, **newest first** |
| `notes[].id` | string | yes | `note-YYYYMMDD-NN` (NN = per-day counter, `01`-based) — stable identity for referencing/correcting a note |
| `notes[].date` | string | yes | `YYYY-MM-DD` the note was recorded |
| `notes[].slug` | string | yes | Company the note is about (must exist in the registry; use `general` for ecosystem-wide intel not tied to one company) |
| `notes[].sourceType` | string | yes | `contact` · `event` · `call` · `news` · `other` |
| `notes[].note` | string | yes | The developer's input, stored **verbatim** (explicit developer decision, 2026-08-07) |
| `notes[].confidence` | number | yes | **0–100, rated by the developer** at capture time — how confident they feel about the information. Claude always asks for this rating when a note is added and never invents it |
| `notes[].tags[]` | string[] | no | Freeform lowercase tags for recall filtering (e.g. `pricing`, `roadmap`, `hiring`) |
| `notes[].triage` | string | no | Dossier-promotion state: `pending` (not yet evaluated — default for app-submitted notes), `promoted (vN)` (folded into the dossier at profileVersion N), or `logged-only` (evaluated, kept as context only). Set by Claude during refresh/triage passes — never by the intake app |
| `notes[].submittedVia` | string | no | `profiler-intake` when the note came from the in-app form; absent for Claude-command captures |

**Notes are not sources.** Field notes deploy publicly with the site but are private intel, not public-sourced fact — they must **never** be cited in a profile's `sources[]` or blended into profile sections. They inform research direction, reports, and conversation prep only, weighted by `confidence` (see the Confidence weighting rule in `.claude/rules/profiler-app.md`).

## Study Guide schema — `<slug>.study.json`

The in-app rendering of a company **technology study guide**, generated by the **Profiler Prep Command** (see `.claude/rules/profiler-app.md`). Content contract (developer directive, 2026-08-07): it **teaches the technology behind the company's products and their industry context**, assuming high-school-level STEM knowledge as the baseline — it is not a company-facts crib sheet. `sections[]` build up concepts progressively (fundamentals → industry architecture → where each product fits); `flashcards[]` quiz **concept and product understanding only** — never company trivia (founding dates, executives, headquarters). The full-depth curriculum lives in `repository-information/study-prep/<slug>/` (not deployed); this file is the public-safe rendering and must contain no personal circumstances.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Study schema version (currently `1`) |
| `slug` | string | yes | Matching company slug (must have a `<slug>.profile.json`) |
| `title` | string | yes | Display title (e.g. "Megmeet — Study Guide") |
| `lastUpdated` | string | yes | `YYYY-MM-DD` of this revision |
| `sections[]` | object[] | yes | `{ "heading", "bullets": string[] }` — the need-to-know brief, ordered most-important first |
| `flashcards[]` | object[] | no | `{ "q", "a" }` — self-quiz cards rendered tap-to-flip in the app |

The renderer shows a "Study Guide" button on a company's dossier only when its `<slug>.study.json` exists.

## Extending the schema

When a new section is needed ("potentially more later"):
1. Add the field(s) here first — this file is the schema's single source of truth
2. Bump `schemaVersion` in new/revised profiles; older profiles stay valid (the renderer skips absent sections)
3. Extend the renderer in `Profiler.html` (PROJECT block) to draw the new section when present — page version bump per [PC-HTML-VERSION] #2
4. Backfill existing profiles opportunistically on their next revision — no mass migration required

Developed by: ShadowAISolutions
