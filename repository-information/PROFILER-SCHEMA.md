# Profiler App — Company Profile Schema

The **Profiler** app (`live-site-pages/Profiler.html`) renders standardized corporate dossiers for companies in the ecosystem (suppliers, developers, integrators, EPCs, general contractors, IPPs, utilities, investors, hyperscalers, neoclouds, advisors). All data lives in `live-site-pages/profiler-data/` and is fetched by the page at runtime via relative URLs (works with a private repo — GitHub Pages serves it publicly):

- `profiler-companies.json` — the **registry**: the roster the app lists and filters
- `<slug>.profile.json` — one **profile** per company: the full dossier
- `reports/<id>.report.json` — one **industry report** per generation: a point-in-time synthesis across covered dossiers (see Report schema below)
- `reports/reports-index.json` — the **reports index**: the library the app's Reports view lists
- `profiler-segments.json` — the **segments registry**: the value-chain segments and every covered company's role in them (see Segments registry below)

This file is the **single source of truth for the data schema**. Profiles are generated and revised by the **Profiler Command** (see `.claude/rules/profiler-app.md`), and every profile must conform to the structures below. The renderer only draws a section when its data is present, so optional sections can be omitted safely.

## Slug rules

- Lowercase, ASCII letters/digits/hyphens only (e.g. `sinexcel`, `sungrow`, `burns-mcdonnell`)
- The slug is the company's **permanent identity**: it names the profile file (`<slug>.profile.json`), forms the page URL (`Profiler.html#<slug>`), and keys the registry entry. Never change a slug once published — revise the profile in place instead
- One slug per corporate entity. Subsidiaries only get their own slug when they are genuinely distinct actors in the ecosystem

## Naming and renames

The slug is permanent; names are not. Companies rebrand, and three sessions in a row have found a coverage-plan row carrying a name or ticker the company had already retired. These rules keep a rename from becoming a corpus-wide problem.

**Four fields, four different jobs.**

| Field | Holds | Changes when |
|-------|-------|--------------|
| `slug` | The permanent identity. Names the file, forms the URL, keys the registry | **Never** |
| `name` (profile) | The **full legal name** — the registrant on the filing, the entity in the charter | Only when the legal entity is actually renamed, which is rarer than a rebrand |
| `shortName` (profile) and `name` (registry) | The **display name**, shown on the roster card and the dossier header | On a rebrand, subject to the collision test below |
| `aka[]` (registry) | Every **other** name the corpus should search for | Additively, forever — an alias is never removed, because old dossiers keep using old names |

**Choosing a display name on a rebrand.** Default to the name the market currently uses. Override it, and keep the prior name, when the new brand fails the **collision test**: is it a common word, a personal surname, or a string that already appears in the corpus meaning something else? Run `grep -rE '\b<NewName>\b' live-site-pages/profiler-data/*.profile.json` before deciding. A brand that collides makes every future corpus reconciliation noisier for as long as the company is covered, and the display name is the cheapest thing to trade away.

*Worked example, and the reason this section exists.* Marsh & McLennan Companies, Inc. rebranded to **Marsh** in January 2026 and moved its ticker from MMC to MRSH. The legal name did not change, so `name` did not change. The display name stayed **"Marsh McLennan"** because "Marsh" fails the collision test twice over — Clearway's Marsh Landing generating station and Entergy's chief executive Drew Marsh both already appear in the corpus. The rebrand, the new brand, the renamed businesses (Marsh Risk, Marsh Re, Marsh People and Investments) and the retired names (Guy Carpenter, Mercer) all went into `aka[]`, where the reconciliation grep can find them. **Nothing was lost by declining the new brand as a label, and a permanent search problem was avoided.**

*And the measured reason the alias list is not optional.* Grepping the corpus for the display name `Marsh McLennan` returns **two** dossiers. Grepping the `aka[]` entries returns **six**, and the four extra ones include `dnv` — which carries the single most important inbound claim about the company, that its battery guidance names no certifier — reached only through the alias `Marsh`, plus `csa-group` reached only through `Oliver Wyman`. A session reconciling on the display name alone would have missed both. Some aliases return pure noise (`Victor`, `MMC`); that costs a few files to read and is the correct trade.

**What a rebrand always requires**, whichever way the display name goes: the ticker updated in `ownership.ticker` and the registry `ticker`; the old and new brands added to `aka[]`; the old domain added to `domains[]` if it still resolves or redirects; and the rebrand itself recorded as a `recentDevelopments[]` entry with its date, because a reader who knew the company under the old name needs to be told when it changed.


## Registry schema — `profiler-companies.json`

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Registry schema version (currently `3` — v3 added `companies[].aka`; v2 added `companies[].domains`). Nothing reads this value at runtime — neither `Profiler.html` nor any script gates on it — so it is documentation of intent rather than a compatibility switch |
| `categories` | string[] | yes | Canonical category order for the filter chips: `supplier`, `developer`, `integrator`, `epc`, `gc`, `ipp`, `utility`, `investor`, `hyperscaler`, `neocloud`, `advisor`, `other` (`epc` renders as "EPC", `gc` as "General Contractor", `ipp` as "IPP", `utility` as "Utility"). `utility` (added 2026-09-03 with the Dominion Energy dossier) is the regulated, rate-based electric utility — the commission-supervised gatekeeper whose IRP, rate case, large-load tariff and interconnection process decide whether AI load and the storage behind it get built; it is its own compare peer family and is never filed under `ipp` or `other` |
| `companies[]` | object[] | yes | One entry per covered company |
| `companies[].slug` | string | yes | Per Slug rules; must have a matching `<slug>.profile.json` |
| `companies[].name` | string | yes | Display name (short form, e.g. "Sinexcel") |
| `companies[].categories` | string[] | yes | One or more canonical categories |
| `companies[].tagline` | string | yes | One-line description shown on the roster card |
| `companies[].hq` | string | no | City, Country |
| `companies[].ticker` | string | no | `EXCHANGE: SYMBOL` for public companies |
| `companies[].status` | string | yes | `active` (normal) or `archived` (kept but de-emphasized) |
| `companies[].lastUpdated` | string | yes | `YYYY-MM-DD` of the profile's last revision — keep in sync with the profile's `lastUpdated` |
| `companies[].aka` | string[] | no | **Registry v3.** Every other name this company is known by, for **text search** — former names, the operating brand when it differs from the display name, short forms, the native-script name, and the names of subsidiaries the corpus will meet under their own branding. It is a mechanical field like `domains`: nothing renders it, and its only consumer is the corpus-reconciliation grep in the Profiler Command step 7, which searches these instead of guessing. Include the display `name` itself only if a grep for it would otherwise be missed. **Entries may legitimately be ambiguous** — "Marsh" collides with a power plant and a chief executive — and that is fine, because step 7 requires reading each hit rather than counting them; an ambiguous alias that surfaces a real claim is doing its job. Omitting the field is safe and simply means the reconciliation grep searches the display name alone |
| `companies[].domains` | string[] | no | **Registry v2.** The company's own web domains, used to classify source provenance (see "Source provenance" below). Bare hostnames, no scheme and no `www.` — a subdomain match is implied, so `abb.com` covers `new.abb.com`. Include the host from the profile's `website`, plus any other domain the company itself publishes on: parent-company domains for subsidiaries (`hitachi.com` for Hitachi Energy), regional or sub-brand sites (`bydenergy.com`, `delta-americas.com`), separate newsrooms (`about.fb.com`, `atmeta.com` for Meta), brand TLDs (`blog.google`), and IR-platform hosts serving the company's own filings (`iren.gcs-web.com`). Omitting the field is safe — every source then falls to `disclosure` or `independent`, which understates rather than overstates first-party sourcing |
| `companies[].srcTotal` | number | auto | **Denormalized** — number of cited sources in the profile. Written by `scripts/sync-profiler-registry.py`; never hand-edit. Powers the roster coverage line |
| `companies[].srcFirstPct` | number | auto | **Denormalized** — first-party share (company + disclosure tiers), percent. Written by the sync script from the profile's `sources[]` and this entry's `domains` |
| `companies[].kpiNorm` | boolean | auto | **Denormalized** — `true` when the profile carries a schema-v4 normalized annual revenue (`kpi: "revenue"` with `usdMillions`). Powers the roster's `$ comparable` tag and the coverage strip's count |
| `companies[].segments[]` | object[] | auto | **Denormalized mirror of the segments registry** (S0, 2026-09-07) — `[{ "id", "role" }]`, one entry per segment the company is a member of in `profiler-segments.json`, in the registry's segment order; `role` ∈ `incumbent` · `challenger` · `adjacent`. Written by `scripts/sync-profiler-registry.py` from the segments registry (landed at S1, v05.17r — every roster entry carries it; an empty array means the registry places the company nowhere, and an absent field means "not yet synced"); never hand-edit. The segments registry is the source of truth; this mirror exists so the roster can filter and chip by segment from its one fetch. Additive and auto-written, so no `schemaVersion` bump (the `srcTotal`/`kpiNorm` precedent) |

**Denormalized fields & the sync script.** The roster renders from the registry alone — one fetch, no per-card profile loads (see "Recall design" in `.claude/rules/profiler-app.md`) — so per-company summary facts the roster displays are denormalized into the registry. Denormalized data drifts; `scripts/sync-profiler-registry.py` is the reconciliation. Run it after any pass that adds or revises profiles (`--check` reports drift without writing). It also keeps `lastUpdated` in sync, replacing the one-off pass that previously did so.

## Profile schema — `<slug>.profile.json`

Top-level fields:

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Profile schema version — currently `7` (v7 adds `policyExposure[]`, `relationships[].via`/`project`, and the physical-unit KPI keys + `qty` overlay field; v6 added `relationships[].status`/`since`/`scale`; v5 added `relationships[].context`; v4 added the normalized-KPI fields on `financials` periods/metrics; v3 added `relationships[]`; v2 added `recentDevelopments[]`, `strategyRead[]`, and the product depth fields). Older profiles remain valid; the renderer skips absent sections. Write new/revised profiles at v7 |
| `slug` / `name` / `shortName` | string | yes | Identity; `name` is the full legal name, `shortName` the display name. **Live-corpus variant (documented 2026-08-30):** a batch of dossiers instead carries `legalName` (with `name` as the display name) — both shapes render, and external consumers must tolerate both. Canonical for new/revised profiles: `name` + `shortName`; normalize the variant opportunistically on a profile's next revision, never as a mass migration |
| `categories` | string[] | yes | Same values as the registry entry |
| `website` | string | no | `https://` URL |
| `headquarters` / `founded` / `employees` | string/number/string | no | Snapshot facts (employees as a string, e.g. `"~2,400 (2025)"`). **Live-corpus variant:** the `legalName` batch writes `hq` instead of `headquarters` — same tolerance and same opportunistic-normalization rule as the identity row above |
| `ownership` | object | no | `{ "type": "public"\|"private"\|"subsidiary", "ticker": "EXCHANGE: SYMBOL" }` |
| `summary` | string | yes | Neutral 2–4 sentence description of what the company does |
| `ecosystemRole` | string | no | 1–3 sentences on how the company fits this ecosystem |
| `productsAndServices[]` | object[] | yes | `{ "name", "category", "description", "highlights": string[] }` — one entry per product/service line. **Optional depth fields (schema v2):** `positioning` (vs named competitors, differentiation), `soldThrough` (commercial model — direct / EPC / OEM-merchant / licensing), `targetSegments` (who it's sold to — **accepted as either a `string[]` or a single comma-joined string**, and both shapes are present across live dossiers; consumers must tolerate both, exactly as they do for the legacy `specs[]` shapes below), `roadmap` (announced-not-yet-shipped items with dates) |
| `recentDevelopments[]` | object[] | no (v2) | `{ "date": "YYYY-MM-DD", "category", "headline", "read", "source" }` — trailing 12–18 months of order wins, product launches, partnerships, leadership changes, capacity expansions, regulatory/financial events. **Canonical `category` set (expanded 2026-08-30 to match live usage — the original 8-value enum had drifted to 33 free-text spellings):** `order-win`, `product-launch`, `partnership`, `leadership`, `capacity`, `regulatory`, `policy`, `financial`, `project`, `procurement`, `customer`, `market`, `incident`, `legal`, `ma`, `corporate`, `other`. All lowercase. **Consumption rule:** consumers match categories case-insensitively and render unrecognized values as-is (the renderer prints the string) — but new/revised profiles write only canonical values, and a revision pass normalizes any legacy spelling it touches (`Project` → `project`, `M&A` → `ma`, `Recognition`/`Risk`/`Expansion` → the nearest canonical or `other`). Opportunistic normalization only — no mass migration, per "Extending the schema". `read` is the one-line strategy takeaway ("so what"); `source` is a label or URL. Newest first |
| `strategyRead[]` | string[] | no (v2) | 3–5 analytical bullets synthesizing what the company's behavior says about its sales/product strategy (target segments & geographies, channel/commercial model, pricing posture, roadmap direction). **This is Claude's inference, not sourced fact** — the renderer labels it as analysis; never blend unsourced interpretation into other sections |
| `relationships[]` | object[] | no (v3; `context` v5; `status`/`since`/`scale` v6; `via`/`project` v7) | `{ "slug", "type", "note", "context", "source", "status", "since", "scale", "via", "project" }` — the three v6 fields are optional deal metadata rendered as chips: `status` ∈ `active` · `announced` · `historical` (the engagement's current state per the cited source), `since` is `YYYY` or `YYYY-MM` when the start is sourced, `scale` is the stated magnitude verbatim-short ("$4.3B cell award", "11.275 GWh", "429 MW") — never an estimate. **v7 adds two more optional chips**: `via` is the product line or offering the engagement runs through, verbatim-short from the source ("Megapack", "800 VDC power shelves", "Grid-forming PCS") — set it only when the source names the line, and `project` is a **named-project slug** from the named-projects registry (`profiler-projects.json`, below) pinning the engagement to a first-class project entity (Stargate, Colossus, Homer City…); a `project` value not in that registry renders as its raw slug and is flagged by `build-profiler-graph.py`, so register the project first. Otherwise: **curated links to other covered companies**, written at research/refresh time and rendered on the dossier's own **Relationships tab** (v01.54w). `slug` must exist in the registry (links to non-covered companies are omitted, not invented); `type` ∈ `customer`, `supplier`, `partner`, `competitor`, `investor`, `portfolio`, `other` (**`portfolio` added 2026-09-06** — it is the coherent inverse of `investor` and had been missing since the type set was written, so an owner's side of an investment link had to be typed `other` and the pair accepted by hand; seven such accepts had accumulated. Enum expansion only, no `schemaVersion` bump, on the `recentDevelopments.category` precedent: no existing profile used the value, and consumers render an unrecognised type as-is. Use it only where the counterparty types this company `investor`; where two types are genuinely true at once — investor AND commercial partner — keep the substantive one and accept the pair); `note` is the one-line basis for the link (what connects them, in plain language); `context` (optional, v5) is the **expanded explanation** — 2–6 sentences on the nature, history, and mechanics of the relationship, grounded in the cited source, rendered in full (paragraph breaks via blank lines); `source` names the source that explicitly states the relationship — a URL or a label from this profile's `sources[]` (the app resolves it against `sources[]` and renders it as a linked "Source" line, so prefer an exact `sources[]` URL). **When the field is absent, the app derives provisional links at render time** by scanning the dossier's own summary, judgments, product positioning, and developments for other covered companies' names — every mention is quoted as a full sentence (never clipped), tagged with the section it came from, and development mentions carry the event's date and source link. Derived links are superseded as the listed set the moment `relationships[]` is populated; the derived evidence still renders under each curated link as "mentions across this dossier". Backfill opportunistically on each dossier's next revision per "Extending the schema"; a research pass should curate every company the dossier's own prose mentions, plus material links the prose implies (a customer named in an order win, a named competitor, a JV partner) — filling `note`, `context`, and `source` for each |
| `policyExposure[]` | object[] | no (v7) | `{ "regime", "status", "effectiveDate", "exposure", "mitigation", "source" }` — how named policy regimes bear on this company, one entry per regime, most material first. `regime` is the instrument's short canonical name — free string because regimes evolve, but reuse established spellings so entries line up across dossiers: `NDAA §154`, `FEOC restrictions`, `ITC/45X`, `Section 301 tariffs`, `AD/CVD`. `status` ∈ `in-effect` · `announced` · `proposed` · `expired` — the regime's state **as it applies to this company** per the cited source. `effectiveDate` is `YYYY-MM-DD` or `YYYY-MM` when the source states one (omit otherwise). `exposure` is 1–4 sentences of sourced fact on how this company specifically sits in the regime (listed/not listed, tariff rate on its supply chain, credit eligibility); `mitigation` (optional) is the company's **own stated** response — a US plant, a re-domiciled supply chain, a licensing structure — never an inferred one (inference belongs in `strategyRead[]`). `source` names the source stating the exposure — a URL or label resolved against this profile's `sources[]`, exactly like `relationships[].source`. Raw material for backfill already exists in dossier prose, the bankability guidance module, and the §154 risk report; backfill opportunistically per "Extending the schema" — never as a mass migration |
| `technicalSpecs[]` | object[] | no | `{ "product", "specs": [...], "notes" }` — flagship products only, concrete figures. **`specs[]` entries are `{ "band", "label", "value" }`** (banded format, v01.41w — developer directive 2026-08-22): `band` is the category the attribute sits under (Power, Electrical, Design, Compliance, …) and consecutive entries sharing a band render under one gold band header inside the product table; `label` is the attribute name; `value` is the figure. **Author values verbatim from the source** — split a packed source statement on its own punctuation and keep each fragment word-for-word; labels and bands are yours to write, values are not. Two legacy shapes still render and must keep rendering, because archived snapshots hold them forever: `{ "label", "value" }` with no band (a plain two-column row) and a **plain string** (a full-width statement row spanning both columns). Entries with no text are dropped, a group with no renderable rows and no `notes` is dropped, and a profile whose groups all drop renders **no** specs section at all rather than an empty heading |
| `decisionMakers[]` | object[] | yes | See below |
| `financials` | object | yes | See below |
| `sources[]` | object[] | yes | `{ "label", "url", "date": "YYYY-MM-DD" }` — every fact in the profile must be traceable to one of these. `date` is the source's **publication/article date** (`YYYY-MM` when only the month is known); **omit the field** for undated evergreen pages (product pages, IR hubs, corporate about pages, market-report landing pages, aggregator quote pages). **Ordering: chronological, newest publication first; undated sources last** (developer directive, 2026-08-09 — replaced the accessed-date format and the first-party-first ordering). The renderer falls back to a legacy `accessed` field for archived pre-migration profiles. An optional `party` (`company` \| `disclosure` \| `independent`) overrides the derived provenance for that one source — see "Source provenance" |
| `lastUpdated` | string | yes | `YYYY-MM-DD` of this revision |
| `profileVersion` | number | yes | Starts at `1`, +1 on every revision — gives Claude a diffable revision marker |

`decisionMakers[]` entries:

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `name` | string | yes | Romanized name (append native script in parentheses when relevant) |
| `title` | string | yes | Current role |
| `photo` | string | no | Repo-relative path (`images/execs/<slug>-<lastname>.jpg`) — **company-published photos** (leadership pages, press kits, annual/interim reports, IR decks, newsroom bios) or **freely licensed Wikimedia Commons photos of public figures** (CC BY / CC BY-SA / public domain — verified license required); omit to render an initials avatar |
| `photoCredit` | string | no | **Required whenever `photo` is a Wikimedia Commons / CC-licensed image** (developer-approved policy extension, 2026-08-22): the attribution string in the form `"Author, License, via Wikimedia Commons"`. The app shows it as a caption on the exec card and exports include it as a credit line. Omit for company-published photos |
| `linkedin` | string | no | Full profile URL — only when a real public profile was verified; never guessed |
| `background` | string[] | yes | Work-experience bullets, most recent first (`"Role — Company (years)"` style); education last if notable |

`financials` object: `{ "currency", "type": "public"|"private", "periods": [...], "commentary" }`. Each period: `{ "period": "FY2024", "metrics": [{ "name", "actual", "expected", "verdict": "beat"|"miss"|"inline", "result" }], "commentary" }` — `expected` is the analyst consensus or company guidance at the time (state which in `result`/`commentary`); for private companies use disclosed figures/funding rounds and leave `expected` empty where none exists. Cover the trailing **two fiscal years** plus the latest interim period when published.

### Normalized KPI fields (schema v4)

The `name`/`actual` pair is deliberately prose — 217 distinct metric names across the covered set, with figures, YoY deltas and caveats written the way each company reports them. That prose stays authoritative and unchanged. **v4 layers a small, optional, machine-readable overlay on top of it** so a metric can be compared across companies (the Compare view's normalized revenue row is the first consumer). Fill it only where the mapping is genuine; leave it out otherwise — an absent field is always better than a forced one.

On each **period** (`financials.periods[]`):

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `periodType` | string | no | `annual` · `half` · `quarter` · `other`. What kind of reporting period this is, independent of how the label is worded (`FY2025 (ended Sep 30, 2025)` and `FY2025` are both `annual`) |
| `periodEnd` | string | no | `YYYY-MM-DD` the period ended. Makes fiscal-year offsets explicit — Fluence's FY2025 ended 2025-09-30 while Tesla's ended 2025-12-31, and a consumer comparing them must be able to say so |

On each **metric** (`financials.periods[].metrics[]`):

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `kpi` | string | no | Canonical key identifying what this metric *is*, regardless of how `name` words it. **Currency KPIs** (overlay = `usdMillions` + `fxBasis`): `revenue`, `net-income`, `eps`, `operating-profit`, `gross-margin`, `orders`, `backlog`, `capex`, `shipments`. **Physical KPIs (v7** — the BESS/AIDC-native vocabulary; overlay = `qty`**)**: `gwh-shipped` (energy-storage shipments/deliveries for the period, GWh), `backlog-gwh` (contracted-but-undelivered storage backlog at period end, GWh), `mw-energized` (data-center capacity energized/in operation at period end, MW), `mw-contracted` (contracted future capacity at period end, MW). Set a key only when the metric is that KPI for the **whole company** — a segment figure (`ESS segment revenue`) is not `revenue`, and a guidance line is not an actual |
| `usdMillions` | number | no | The figure expressed in **millions of USD**. For companies that report in USD this is the reported number restated in millions and nothing else. For any other reporting currency it is a conversion, and `fxBasis` is then **mandatory** |
| `fxBasis` | string | see left | How `usdMillions` was arrived at. `"as reported"` when the company reports in USD. Otherwise the citable conversion basis, including the rate, the period it applies to and its source — e.g. `"RMB at 7.1873 CNY/USD (2025 calendar-year average, exchange-rates.org / x-rates.com)"`. **Never store a converted figure without one**: an unsourced conversion is fabricated precision, which the No-fabrication rule forbids as squarely as an invented revenue number |
| `qty` | number | no (v7) | The figure for a **physical KPI**, expressed in the unit its key names — GWh for `gwh-shipped`/`backlog-gwh`, MW for `mw-energized`/`mw-contracted`. Same derivability rule as `usdMillions`: the number must come from `actual`'s prose, never introduced by the overlay. No conversion machinery — the unit is fixed by the key (a source stating `2.5 GW` becomes `qty: 2500` on an MW key, a pure unit restatement). A metric carries `usdMillions`+`fxBasis` (currency KPIs) **or** `qty` (physical KPIs), never both |

**Rules**

- **The prose is the source of truth; the overlay is a convenience.** `usdMillions` must be derivable from `actual` — never introduce a figure the prose does not contain. If they ever disagree, `actual` is right and the overlay is the bug
- **Only comparable things get a `kpi`.** Whole-company actuals only: not segments, not guidance ranges, not trajectories, not "Results"-style composite lines. When a period reports several revenue lines (total, segment, quarterly split), the `kpi: "revenue"` marker belongs on the total for that period alone
- **One `kpi` per key per period.** A consumer reading `revenue` for a period must get exactly one answer
- **FX rates are researched, not remembered** — per the "Platform quotas, limits, and pricing require web search verification" rule in `.claude/rules/behavioral-rules.md`, look the rate up and cite it. Where the dossier itself already states a USD equivalent (CATL's `~US$10B` beside `RMB 72.2B`), use it to sanity-check the conversion and say so
- **Backfill opportunistically** — a dossier gains these on its next revision, exactly as `relationships[]` does. There is no mass migration, and consumers must treat every field as optional

### Source provenance

Every cited source is classified into one of three tiers, mirroring the citation order in the Source Priority Protocol (`.claude/rules/profiler-app.md`). The app shows the resulting **first-party share** on the dossier header, in the Source List, and as a Compare row.

| Tier | Means | Determined by |
|------|-------|---------------|
| `company` | Published on the company's own channels — IR pages, newsroom, product pages, leadership pages | Source host matches (or is a subdomain of) an entry in the registry's `companies[].domains` |
| `disclosure` | The company's own words, published through a regulated or syndicated channel — exchange and regulator filings, newswire releases | Source host matches the app's global filing-host or wire-service list |
| `independent` | Everyone else — trade press, analysts, consultancies, aggregators, government bodies writing about the company | Neither of the above |

**"First-party share" = `company` + `disclosure`** — both are the company's own account of itself; only the publisher differs.

**Classification is data-driven, never inferred from the company name.** An earlier token-matching approach mislabelled whole dossiers: Black & Veatch (`bv.com`), QTS (`q.com`) and Schneider (`se.com`) have domains too short to tokenize; Google and xAI publish on brand TLDs (`blog.google`, `x.ai`); Meta's newsroom is `about.fb.com`. Declare the domains in the registry instead. When a single source still lands in the wrong tier, set its `party` explicitly — that always wins.

**The `disclosure` tier depends on hosts being reachable, and that is an environment condition, not a repo invariant.** At v04.91r `data.sec.gov` served SEC's "Your Request Originates from an Undeclared Automated Tool" page under a correctly declared non-personal User-Agent — a network-keyed block, not a User-Agent defect — and the session substituted NVIDIA's own newsroom. That substitution is invisible in the finished dossier: the sources are first-party either way, and the tier share barely moves, because `company` and `disclosure` both count as first-party. `scripts/check-source-reachability.py` probes the filing hosts and reports the corpus's tier mix so the condition is known **before** research is planned rather than after. It **always exits 0** — a blocked government host is not a repo defect and must never fail a commit. Run it before a `profiler <Company>` or a scheduled refresh, not at commit time.

**A high first-party share is a caution, not a credential.** The schema leans on first-party channels for products, specs and leadership, and on independent sources for what a company cannot credibly say about itself — missed expectations, litigation, independent rankings. A dossier sourced almost entirely from the company is under-checked, and the app says so in those words.


## Authoring rules

- **Products & services are the priority section** (developer directive, 2026-08-07) — `productsAndServices[]` and `technicalSpecs[]` carry the deepest research investment: enumerate every product line, name flagships, quote concrete specs, and fill all four depth fields per entry wherever the public record allows. Other sections stay standard-depth
- **Public sources only** — profiles deploy to public GitHub Pages. Company sites, filings, press releases, reputable financial media only. Never include deal notes, quoted pricing, NDA'd material, or anything learned privately
- **Source priority** — the target company's own Investor Relations and press-release pages outrank trade news: scrape them fully **first** (they are ground truth for products, specs, leadership, and company-reported figures), then use trade press, filings, and consultancies for what the company cannot supply about itself — expectations/consensus, independent rankings, and critical context. This priority governs **research order**, not citation order — `sources[]` itself is ordered chronologically, newest publication date first, undated evergreen pages last (developer directive, 2026-08-09)
- **No fabrication** — a number, name, spec, or URL that can't be sourced is omitted or marked as an estimate in the text; empty beats invented
- **Expectations honesty** — `expected` values must be real published consensus/guidance figures; when none exists, leave it empty and say so in commentary rather than manufacturing a benchmark
- **Photo policy** — two permitted tracks, both downloaded into `live-site-pages/images/execs/` so the page never hotlinks: (1) photos the company itself published (leadership page, press kit, annual/interim report, IR deck, newsroom bio); (2) **Wikimedia Commons photos of public figures under a verified free license** (CC BY, CC BY-SA, or public domain — check the file's license page, never assume), with the attribution stored in `photoCredit` (developer-approved extension, 2026-08-22). LinkedIn photos are never scraped (auth wall + ToS); news-agency/wire photos and keynote video frame-grabs are never used (copyright). No photo → the app renders an initials avatar automatically
- **Standard treatment for every company** — every profile uses exactly these sections. No company-specific sections, no bespoke fields, no special emphasis for any one company (explicit developer rule)
- **Analysis stays labeled** — `strategyRead[]` is the only section allowed to contain inference beyond the sources, and the renderer marks it as analysis; every other section states only what a cited source supports. A strategy read that a source directly supports belongs in `recentDevelopments[].read` instead
- **Recent-developments window** — cover the trailing 12–18 months, newest first; prefer first-party press releases as the `source` per the source-priority rule, with trade press for events the company didn't announce itself
- **Dates everywhere** — `lastUpdated`, per-source publication `date` values, and period labels make staleness visible; a future revision session bumps `profileVersion` and `lastUpdated`

## Field Notes schema — `profiler-notes.json`

A single chronological log of first-hand intel the developer collects from industry contacts, in-person events, calls, and other channels. Captured via the **Profiler Note Command** (see `.claude/rules/profiler-app.md`). Rendered by the app's ⚙ (settings cog) changelog on the dashboard.

> **Storage moved to Google Drive (M3, 2026-08-10).** The log lives at `Profiler/profiler-notes.json` in the script owner's Drive — **not in this repo**. The repo is public, so a file committed here is readable via `raw.githubusercontent.com` and `git clone` no matter what the app's sign-in wall does; moving it out of `live-site-pages/` alone would have closed only the Pages vector. Attachments live under `Profiler/note-files/<slug>/`, and meeting audio under the uploading user's own Drive.
>
> **Drive layout — two owners, two trees.** This split is not cosmetic: `DriveApp` inside the script acts as the account that **deployed** the web app, while browser-side uploads act as the **signed-in user**. They are frequently different accounts, so anything the user is expected to browse must be created browser-side.
>
> Script owner's Drive (created by `DriveApp`, invisible to the user unless they own the deployment):
> ```
> Profiler/
> ├── profiler-notes.json                 the log itself
> └── note-files/<slug>/                  Word/PDF/transcript attachments
> ```
> Signed-in user's own Drive (created browser-side with `drive.file`, alongside `Receipts App/`):
> ```
> Profiler App/
> └── meeting-recordings/
>     ├── 1-awaiting-transcription/       uploaded audio, no transcript yet
>     └── 2-transcribed/                  audio whose transcript is attached to its note
> ```
> Recording filenames are `<slug>--YYYY-MM-DD--<original name>`, so company and date read at a glance in the Drive UI; `unfiled` stands in for the slug when a stray is swept up. The numbered folders make the transcription queue visible without opening the app.
>
> **Transcripts** are produced outside the app (Whisper on the developer's own machine) and filed by the note box's **File transcript** control: the `.vtt` is uploaded to `2-transcribed/` and its recording is re-parented from `1-awaiting-transcription/` to join it, matched by filename stem (`…015240.vtt` claims `…015240.m4a`). The same pick is also attached to the note being written, so triage gets the text. A transcript with no matching recording in the queue still files — it just reports that nothing moved.
>
> `drive.file` cannot search for a folder it created in an earlier session, so the three folder IDs are parked on the backend (`recfolders` reads them, `setrecfolders` writes them, both admin-gated, stored in Script Properties). Uploads name the pending folder as their `parents` so a recording is never loose in My Drive. Audio uploaded before this tree existed is still reachable — `drive.file` grants persist per file for the app — so a sweep after each upload re-parents any root-level audio it can see.
>
> **Consequence for sessions:** an unattended Claude session can no longer read the log. The scheduled post-earnings refreshes, the quarterly sweep, reports, and prep tasks all run without note context unless the developer supplies it. The app's **📋 Copy pending** button (⚙ overlay) and the per-note **📋 Copy** button return the note plus its transcript formatted for pasting into a session — that is the intended replacement for the automated read.

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
| `notes[].submittedVia` | string | no | `profiler-intake` for notes saved via the in-app note box (GAS backend); `issue-form (#N)` for the GitHub-issue fallback; absent for Claude-command captures |
| `notes[].edited` | string | no | `YYYY-MM-DD` of the developer's most recent in-app edit. Set by the intake app's Manage panel; absent when never edited. Only the **developer** edits notes (their own content) — Claude's triage passes never alter note text (exception: replacing a file-note's `summary pending` placeholder with the faithful summary) |
| `notes[].sourceFile` | string | no | For document- and transcript-derived notes: a `drive:<fileId>` reference to the original under `Profiler/note-files/<slug>/` in Drive. Text attachments (`.txt`/`.md`/`.vtt`/`.srt`) are readable back through the app's Copy buttons; Word/PDF are download-only. The `note` text is a faithful summary, not verbatim, for file-based captures |
| `notes[].recordingLink` | string | no | Drive link to a meeting audio recording uploaded browser-side with the user's own `drive.file` credential (never relayed through GAS). Constrained server-side to `drive.google.com`/`docs.google.com` URLs |

**Notes are not sources.** Field notes are private intel, not public-sourced fact — they must **never** be cited in a profile's `sources[]` or blended into profile sections. They inform research direction, reports, and conversation prep only, weighted by `confidence` (see the Confidence weighting rule in `.claude/rules/profiler-app.md`).

## Study Guide schema — `<slug>.study.json`

The in-app rendering of a company **technology study guide**, generated by the **Profiler Prep Command** (see `.claude/rules/profiler-app.md`). Content contract (developer directive, 2026-08-07): it **teaches the technology behind the company's products and their industry context**, assuming high-school-level STEM knowledge as the baseline — it is not a company-facts crib sheet. Sections build up concepts progressively (fundamentals → industry architecture → where each product fits); flashcards and quizzes drill **concept and product understanding only** — never company trivia (founding dates, executives, headquarters). The full-depth curriculum lives in `repository-information/study-prep/<slug>/` (not deployed); this file is the public-safe rendering and must contain no personal circumstances.

**v2 (Phase 5, 2026-08-30) — study guides render on the guidance engine.** `sections[]` uses the same section-kind vocabulary as guidance modules and reports, so a study guide can carry rich sections (tables, timelines, pros/cons, quizzes) — rendered by `gdRenderDoc` in `Profiler.html` with a "Study Guide" shell (no source line, no review chip). **The boundary that must not move:** guidance modules are role-gated content living in `Profiler.gs` (never on Pages); study guides are public Pages data. Unification shares the *renderer and vocabulary*, never the content channels or gates.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Study schema version — currently `2`. v1 (`sections[]{heading, bullets[]}`) remains renderable forever: a load-time adapter in `Profiler.html` (`ovStudyV2`) maps v1 onto v2 (`prose` sections with `ps` = bullets), so the renderer has one code path. Write new/revised guides at v2 |
| `slug` | string | yes | Matching company slug (must have a `<slug>.profile.json`) |
| `title` | string | yes | Display title (e.g. "Megmeet — Technology Study Guide") |
| `lastUpdated` | string | yes | `YYYY-MM-DD` of this revision |
| `sections[]` | object[] | yes | Guidance section-kind vocabulary: `{ "id", "title", "kind", … }` with `kind` ∈ `prose`, `callout`, `table`, `proscons`, `timeline`, `bars`, `flashcards`, `quiz`, `ledger` (study guides may use `flashcards`/`quiz`, unlike reports) and the same per-kind fields as guidance modules (`ps`, `cols`/`rows`, `cards`, `lanes`/`items`, `unit`, `intro`, `read`, `note`, `tone`, `sales`). `id` is a stable kebab-case anchor, unique within the guide — quiz/done progress is keyed per account + guide + section id, so revisions that keep meaning should keep ids. Ordered most-important first |
| `glossary[]` | object[] | no | `{ "t", "d" }` — guide-local term definitions. `{{term}}` tooltips anywhere in the guide resolve **doc-glossary-first, then the concepts registry** (`profiler-concepts.json`, below). Define a term here only when the guide needs a meaning that differs from (or is absent from) the shared registry — otherwise register it once in the registry |
| `flashcards[]` | object[] | no | `{ "q", "a" }` — legacy top-level self-quiz cards, rendered as a trailing "Flashcards" section. Valid at v2 for continuity (the mechanical v1→v2 lift keeps them in place); new authoring should prefer an inline `kind: "flashcards"` section positioned where it teaches best |

The renderer shows a "Study Guide" button on a company's dossier only when its `<slug>.study.json` exists. Reading/quiz progress uses the same per-account machinery as guidance modules (doc id `study-<slug>`): tiers with guidance access sync ticks across devices through the role-gated progress ops; every other tier keeps the per-device localStorage fallback. **Verification:** run `python3 scripts/check-profiler-study.py` after any study-guide or concepts-registry write — it validates both schemas and `{{term}}` resolution; a write without a clean pass is incomplete (sibling rule to the report checker).

## Concepts registry — `profiler-concepts.json`

The **shared public glossary** for study guides: one definition per core BESS/AIDC concept, so guides stop redefining `LFP` or `N+1` per company. The Prep Command registers new concepts here instead of duplicating them per guide; guidance modules keep their internal glossaries (role-gated content stays in `Profiler.gs` — the registry never absorbs it). Study-guide `{{term}}` tooltips resolve doc-glossary-first, then this registry.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Registry schema version (currently `1`) |
| `concepts[]` | object[] | yes | One entry per concept, alphabetical by slug |
| `concepts[].slug` | string | yes | Per Slug rules — the concept's permanent identity |
| `concepts[].term` | string | yes | The display term as guides write it inside `{{…}}` (e.g. "LFP", "N+1", "800 VDC"). Matching is case-insensitive |
| `concepts[].def` | string | yes | 1–3 sentence tooltip definition, high-school-STEM baseline, public-safe, no figures that need their own citation |
| `concepts[].aliases[]` | string[] | no | Alternate spellings that resolve to the same definition ("lithium iron phosphate" for LFP). Case-insensitive; must not collide with another concept's term or aliases |

The registry carries **no revision date** — see "Registry revision signals" below for the date the Classroom pipeline reads for `concepts:profiler-concepts`. Add a concept when study guides use it or are about to (the initial set seeds the core BESS/AIDC vocabulary the corpus already teaches) — the registry is a vocabulary in use, not an encyclopedia. `scripts/check-profiler-study.py` validates the registry shape and flags term/alias collisions and unresolved `{{term}}` references. The file deploys with the site like all `profiler-data/` files (public-safe content only).

## Report schema — `reports/<id>.report.json`

An **industry report** generated by the **Profiler Report Command** (see `.claude/rules/profiler-app.md`): a point-in-time synthesis built **from covered dossiers only** — never fresh research — and rendered by the app's Reports view. Files live in `live-site-pages/profiler-data/reports/` alongside `reports-index.json`. The in-app Reports surface (masthead button + both views) is **admin-only** (`reports` capability in `OV_ROLE_CAPS` — developer directive, 2026-08-29); the JSON files themselves remain public Pages data like every other `profiler-data/` file, so the gate governs the app surface, not the files.

**Snapshot semantics.** A report embeds everything it shows at generation time — figures, citations, and per-company coverage pins. It is **immutable once published**: re-running a topic produces a *new* report file whose `supersedes` field names the old id; the old file stays in place (no archival procedure — the report library is its own archive). If a cited dossier is later revised, the report's pins make the drift detectable; the report itself is never edited. Drift on a **current** report is reported by `check-profiler-reports.py` as a warning until a human re-verifies the pin by reading and records it in `repository-information/report-pins-verified.json` at the dossier's then-current `profileVersion`; the warning returns when the dossier moves past that version (the pin needs reading again — intended, not a bug). Superseded reports are never drift-checked: they are the library's history, and re-pinning is never the answer to a warning.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Report schema version (currently `1`) |
| `id` | string | yes | `<topic-slug>--<type>--YYYY-MM-DD` (slug rules apply to the topic part). Permanent identity: names the file (`<id>.report.json`) and the URL (`Profiler.html#report/<id>`) |
| `title` | string | yes | Display title |
| `type` | string | yes | `macro` · `competitive` · `risk` · `opportunity` |
| `topic` | string | yes | The topic as commanded, in plain words |
| `generated` | string | yes | `YYYY-MM-DD` the report was authored |
| `style` | string | yes | The writing style the prose was authored in (the registry's Active style at generation — see `PROFILER-STYLES.md`) |
| `scope` | object | yes | `{ "kind": "family"\|"categories"\|"slugs"\|"all", "value": string[], "rationale" }` — which companies are in scope and the one-line reason for the cut |
| `coverage` | object | yes | Honesty block — see below |
| `bluf` | string | yes | Bottom-line-up-front: the whole takeaway in 1–2 sentences |
| `keyJudgments[]` | object[] | yes | `{ "text", "confidence": "high"\|"moderate"\|"low", "cites": string[] }` — numbered analytic judgments, each confidence-tagged; `cites` lists supporting citation ids. Judgments are **always analysis** — the renderer labels them as such |
| `sections[]` | object[] | yes | Report body. Same section-kind vocabulary as the guidance renderer — `kind` ∈ `prose`, `callout`, `table`, `proscons`, `timeline`, `bars`, `ledger` (`flashcards`/`quiz` are study-module kinds and not valid in reports) with the same per-kind fields (`ps`, `cols`/`rows`, `cards`, `lanes`/`items`, `unit`, `intro`, `read`, `note`, `tone`). Report-specific extras: `analysis: true` marks a section as inference (renderer labels it); `cites: string[]` lists section-level citations; `bars` items may carry `slug` + `kpi` so the figure is verifiable against that profile's KPI overlay |
| `indicators[]` | object[] | no | Tripwires to watch: `{ "date", "text", "confirms" }` — a concrete observable event, when to expect it, and what it would confirm or refute |
| `limitations[]` | string[] | yes | Explicit collection gaps and comparability caveats — what this report cannot say and why |
| `citations[]` | object[] | yes | `{ "id": "c1", "slug", "company", "label", "url", "date", "party" }` — see Citation rules below |
| `supersedes` | string | no | The `id` of the report this one replaces (same topic re-run) |
| `guidanceOverlays[]` | object[] | no | **Admin lens** anchors — `{ "moduleId", "sectionId", "title"?, "ps": string[] }`. Each entry pins company-specific analysis from this report to one section of an Industry Guidance module (`moduleId` = the guidance doc's `id` in `Profiler.gs`, `sectionId` = the section's `id`). Admins viewing that module see the entry's `ps` paragraphs rendered as a 🔒 "Admin lens" panel inside the anchored section, with a link back to this report; non-admin tiers never fetch report data, so the shared modules stay group-level. `ps` uses the guidance micro-markup (`**bold**`, `*italic*`, `{{term}}`) — **no `[c:<id>]` citation tokens** (the lens renderer doesn't resolve them; the "View source report" link is the citation path). Anchors are validated against the live modules by `check-profiler-reports.py`; if a module section is later renamed, the panel falls back to the end of the module with a stale-anchor note |

**Coverage block** (`coverage`): `{ "companies": [...], "gaps": string[], "dataWindow": { "oldest", "newest" } }`. Each `companies[]` entry pins the dossier state the report was built from: `{ "slug", "name", "profileVersion", "lastUpdated", "srcTotal", "srcFirstPct", "kpiNorm" }`. `gaps[]` states, in plain words, what is missing (a company with no comparable revenue, a private company with no disclosed figures). `dataWindow` is the oldest/newest `lastUpdated` among pinned dossiers. The renderer shows a roster-style coverage strip from this block and badges any company whose live registry entry is newer than its pin ("dossier since revised").

**Citation rules:**
- Every citation is **copied verbatim from the cited dossier's `sources[]`** (`label`, `url`, `date`) at generation time — reports never introduce sources of their own; new sourcing belongs in a dossier refresh first (per "Reports" in the Recall design, `.claude/rules/profiler-app.md`)
- `party` is resolved at generation with the same data-driven tiering as the app (registry `domains` → `company`; filing/wire hosts → `disclosure`; else `independent`; a per-source `party` override in the profile wins) and shown as a tier badge — provenance is the reader's citation-confidence signal
- Inline citation tokens **`[c:<id>]`** may appear in any prose string, table cell, or timeline label; the renderer converts them to superscript links into the citation list. Section-level `cites[]` and judgment-level `cites[]` carry broader attributions
- **Figures in `table`/`bars` sections come only from the profiles' normalized-KPI overlay** (`usdMillions`, with its `fxBasis` reproduced or cited). A company without a genuine mapping appears as "not normalized" with the reason — never silently dropped, never force-converted. Every comparison states its denominator
- **Analysis stays labeled** — `bluf`, `keyJudgments[]`, and any `analysis: true` section are inference and rendered as such; everything else states only what a cited dossier source supports
- **Field notes never appear in report content.** Reports deploy to public Pages; notes may steer scope and emphasis when the developer supplies them, but nothing note-derived is stated (stricter than the general confidence-weighting rule, by design)

**Verification is mandatory:** run `python3 scripts/check-profiler-reports.py` after any report write — it validates the schema, resolves every citation against the cited profile's `sources[]`, checks `party` derivations, verifies `bars`/KPI figures against the profile overlay, reconciles the index, and reports pin drift on current reports against `repository-information/report-pins-verified.json` (see Snapshot semantics above). A report write without a clean check pass is incomplete, exactly as a profile write without the registry sync is.

## Reports index — `reports/reports-index.json`

The Reports library view renders from this index alone (one fetch, mirroring the registry-as-index design):

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Index schema version (currently `1`) |
| `reports[]` | object[] | yes | One entry per report, **newest first**: `{ "id", "title", "type", "topic", "date", "scopeLabel", "companies", "citations", "status", "supersedes" }` |

`scopeLabel` is a short human string ("12 grid-scale BESS players"); `companies`/`citations` are counts; `status` is `current` or `superseded` (set to `superseded` when a newer report names this one in its `supersedes`). Entries for reports that declare `guidanceOverlays[]` also carry `overlayModules: string[]` — the sorted unique module ids the report overlays — so the guidance renderer can find overlay-bearing reports from the one index fetch without opening every report file (only `current` reports' overlays render). Keep the index in sync with the report files — the check script reconciles it.

## Relationship graph — `profiler-graph.json`

The **ecosystem relationship graph**: one machine-built file merging every dossier's curated `relationships[]` and derived cross-mentions into unified, bidirectional edges, so any company's Relationships tab can show **inbound** evidence (what other dossiers record about it) alongside its own outbound account, and the Network explorer can query the whole ecosystem in one fetch.

**Built, never hand-edited.** `python3 scripts/build-profiler-graph.py` regenerates it from the registry + all profiles; running it is **REQUIRED after any profile write** (sibling of the registry-sync rule — a stale graph silently hides new relationships). The build's derivation mirrors the app's `ovRelDerive` (name scan over summary/ecosystem role/judgments/product description+positioning/developments, word-boundary match with the ambiguous-one-word sentence-start guard); if one changes, change both. **Pair exclusions** (developer directive 2026-08-29): `EXCLUDED_PAIRS` in the build script drops derived-only edges whose entire evidence is an anti-relationship sentence ("no X ties found" — the text explicitly denies a link); curated links are never excluded, and a pair is added only when every evidence sentence is a denial.

| Field | Type | Meaning |
|-------|------|---------|
| `schemaVersion` | number | Graph schema version (currently `1`) |
| `built` | string | `YYYY-MM-DD` the graph was generated |
| `edges[]` | object[] | One entry per company pair with any curated link or derived mention, `a` < `b` lexicographically |
| `edges[].a` / `edges[].b` | string | The two slugs (both must exist in the registry) |
| `edges[].curated` | object | Present when either dossier curates the link: `{ "a": {…}, "b": {…} }` — each side's `relationships[]` entry about the other (`type`, `note`, `context`, `source`, `status`, `since`, `scale`, `via`, `project`), keyed by which dossier stated it. `type` reads from the stating side's perspective ("b is a's `type`") |
| `edges[].evid[]` | object[] | Derived mentions from both dossiers: `{ "from": "a"\|"b", "where", "date", "text", "src" }` — full sentences / development units, exactly as the tab quotes them |
| `edges[].last` | string | Newest dated evidence (`YYYY-MM-DD`), `""` when no evidence carries a date |

The graph deploys with the site like all `profiler-data/` files (public-sourced content only — field notes never enter it).

## Named-projects registry — `profiler-projects.json`

The ecosystem's recurring **named projects** (Stargate, Colossus, Homer City…) as first-class entities, so a relationship can pin an engagement to the project it serves via `relationships[].project` (v7) instead of burying the name in prose. **Deliberately lightweight**: the registry holds identity and one line of orientation — the sourced facts, participants, and history live in the dossiers whose `relationships[]` reference the project, exactly as derived links do. There is no member list to drift: a project's participants are derivable at any time by scanning published relationships for its slug.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Registry schema version (currently `2` — v2 added `projects[].parent`) |
| `projects[]` | object[] | yes | One entry per named project, alphabetical by slug |
| `projects[].slug` | string | yes | Per Slug rules — the permanent identity `relationships[].project` references |
| `projects[].name` | string | yes | Display name as the ecosystem uses it (e.g. "Stargate", "Homer City Energy Campus") |
| `projects[].kind` | string | yes | Short lowercase label for what the project is: `aidc-campus`, `power-campus`, `bess`, `program`, … — freeform-lite, reuse existing values where they fit |
| `projects[].location` | string | no | Where it is, plainly ("Abilene, TX", "Memphis, TN"); multi-site programs name the flagship |
| `projects[].parent` | string | no | **Registry v2.** Slug of the umbrella project this one belongs to (Frontier/Lighthouse/Project Jupiter → `stargate`), so sub-campus pins still roll up to the program. The renderer surfaces it in the ⚑ chip tooltip ("part of Stargate"). **Pin precision rule**: a relationship whose substance is one specific sub-campus pins the child; an engagement spanning several of a program's campuses pins the parent program |
| `projects[].note` | string | yes | Neutral one-liner orienting the reader — who leads it and what it is. No figures, no claims that need their own citation: anything source-worthy belongs in a dossier |

Entries carry **no revision date** — see "Registry revision signals" below for the date the Classroom pipeline reads for `project:<slug>`. Add a project only when at least one dossier's `relationships[]` is ready to reference it — the registry is an index of pins in use, not a research surface. `build-profiler-graph.py` warns when a curated `project` slug is missing from the registry. The file deploys with the site like all `profiler-data/` files.

**Scraper interest seed (registration-time sync, Layer 3 — 2026-08-30).** Every registered project also gets a matching interest-topic seed in `SCRAPER_INTEREST_TOPIC_SEEDS` (`googleAppsScripts/Scraper/Scraper.gs`) — `key: 'topic-<project-slug>'`, a label naming the project, precise search `terms` (multi-word phrases; a bare common word like "Frontier" or "Lighthouse" pads topic bands on unrelated articles), and `source: 'project:<slug>'` — mirroring the guidance-module seed convention in `.claude/rules/industry-guidance.md` step 9. When registering a new project, add the seed in the same commit (Scraper GAS version bump applies). Seeds are one-time sheet inserts: the developer's in-sheet edits win afterwards (see `.claude/rules/scraper-sources.md`).

## Segments registry — `profiler-segments.json`

The **value-chain segments** of the ecosystem as a registry layer (designed at S0 of `INTEGRATED-REMEDIATION-PLAN.md` §7, 2026-09-07; the developer's decision that segments are data the Profiler Command populates, not prose a lesson infers). Nineteen segments in chain order, each with a definition, the criteria its buyers buy on, and its **members** — every covered company that sits in it, with a **role** and the line in that company's own dossier that supports the assignment. It is the input to the generated segment lessons (`scripts/build-classroom-segments.py`, S1) and the landscape modules (S2), and the roster mirrors it as `companies[].segments[]`.

**The evidence rule.** A membership is verified against the company's **own dossier** — its `ecosystemRole` and `productsAndServices[]` — never against the registry category, which is a filter label and not evidence. The `basis` field records the supporting line. A company whose dossier supports no segment goes in `unassigned[]` with a reason rather than being placed by guess; a dossier revision that removes the basis removes the membership.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Segments registry schema version (currently `1`) |
| `description` | string | yes | One-paragraph orientation for a reader (or a session) that opens the file cold |
| `roles` | object | yes | The role vocabulary, self-describing: `incumbent` (the dossier places the company in the segment's established leading set — a third-party rank or the dossier's own incumbent / benchmark / reference / leader language), `challenger` (contesting that set — an entrant, a second source, a fast riser, a base being converted, a niche or mid-tier player, or a leader elsewhere attacking the market the corpus serves), `adjacent` (the segment is not the company's primary business but its dossier records a product line, division, channel, or buyer/supplier position touching it). Adjacent members render under their own heading in a segment lesson's player table and never satisfy the floor rule's role requirement |
| `tiers` | object | yes | The four chain tiers the `position` order runs through: `supply` (makes the thing) · `build` (builds, powers and cools the plant or hall) · `demand` (owns, operates or consumes it) · `services` (finances, assures, optimises or insures it) |
| `floorRule` | string | yes | The rule stated in `CLASSROOM-CURRICULUM-PLAN.md` §10.2, repeated here so a consumer can apply it without the plan: a landscape module needs at least three members with a dossier, including one incumbent and one challenger |
| `segments[]` | object[] | yes | Nineteen entries, ordered by `position` |
| `segments[].id` | string | yes | Per Slug rules — the segment's **permanent identity**. Segment lesson ids derive from it (`segment-<id>`) and Classroom progress keys on those, so an id never changes; a segment that stops making sense is retired in place, never renamed |
| `segments[].name` | string | yes | Display name |
| `segments[].position` | number | yes | 1–19, the chain order the Value Chain tracks teach in (`CLASSROOM-CURRICULUM-PLAN.md` §10.5) |
| `segments[].tier` | string | yes | One of `tiers` |
| `segments[].definition` | string | yes | 1–3 sentences: what the segment makes or does and where it sits in the chain — the segment lesson's `the-segment` section is generated from it |
| `segments[].buyingCriteria[]` | string[] | yes (≥3) | What a buyer in this segment buys on — the `what-is-bought-and-on-what` section's rows |
| `segments[].notes` | string | no | Reserved adjacent roles not yet filled, floor state, and any taxonomy caveat the developer should see (e.g. a segment the plan counted above the floor that the dossiers do not support) |
| `segments[].members[]` | object[] | yes (may be empty for a new segment) | The covered companies in the segment |
| `segments[].members[].slug` | string | yes | Per Slug rules; must exist in `profiler-companies.json` and have a `<slug>.profile.json` |
| `segments[].members[].role` | string | yes | `incumbent` · `challenger` · `adjacent` per `roles` |
| `segments[].members[].basis` | string | yes | One line naming the dossier field and the claim that supports the assignment — `ecosystemRole: …`, `productsAndServices › <line>: …`, or `registry tagline: …` (the tagline is the dossier's own one-line summary as registered, acceptable as a pointer to the `ecosystemRole` it condenses). Written at assignment; a landscape module's claims ledger may cite it |
| `unassigned[]` | object[] | yes (may be empty) | `{ "slug", "reason" }` — covered companies whose dossier supports no segment assignment. Empty at S0: all 154 dossiers placed |

**Multiple membership is normal.** A company sits in every segment its dossier documents a position in — Tesla is an integrator incumbent, a cell and conversion adjacent, a software adjacent and a retail-supply adjacent — and the role differs per segment. A membership is never inferred from another membership.

**Who writes it.** The **Profiler Command** assigns every new dossier to one or more segments with a role in the same commit that lands the dossier (`.claude/rules/profiler-app.md`, step 5 — the segment assignment), and re-checks the assignment on a revision when the `ecosystemRole` or product lines moved. A new segment is a **design decision** (the taxonomy is the developer's — nineteen agreed 2026-09-07), added here first and in `CLASSROOM-CURRICULUM-PLAN.md` §10 in the same commit; it never appears by a session's own initiative. **Revision date:** the file carries no `updated` field — like the projects and concepts registries below, its revision date is the file's last commit date (see "Registry revision signals"), and the segment lessons pin the member dossiers' own `lastUpdated`, never this file.

**Verification.** `python3 -c "import json; json.load(open('live-site-pages/profiler-data/profiler-segments.json'))"` parses; every member slug has a profile file and a registry entry; no segment lists a slug twice; positions are 1–19 without gaps. From S1 (v05.17r) `scripts/check-classroom-curriculum.py` reports them (`CLASSROOM-CURRICULUM-PLAN.md` §10.9 — a member slug with no profile and a registered segment with no lesson are `--strict` findings) and `scripts/check-classroom-content.py` fails a commit whose generated `segment-*` lesson drifted from this registry.

## Registry revision signals — the undated layers

Most corpus layers carry their own revision date (`lastUpdated` on a profile or study guide, `built` on the graph, `updated` on a guidance module, `generated` on a report). **`profiler-projects.json`, `profiler-concepts.json` and (from S0, 2026-09-07) `profiler-segments.json` do not** — neither the file nor its entries carry one. That gap was found while writing `CLASSROOM-COMMITTER-CONTRACT.md` (§6.1, handed to C2b as item 2) because the Classroom pipeline's refresh rule (G1) needs a comparable date for every layer a lesson pins.

**The decision (C2b, 2026-09-02): the layer's revision date is the file's last commit date.** No `updated` field is added to either registry.

```
git log -1 --format=%cs -- live-site-pages/profiler-data/profiler-projects.json
git log -1 --format=%cs -- live-site-pages/profiler-data/profiler-concepts.json
git log -1 --format=%cs -- live-site-pages/profiler-data/profiler-segments.json
```

`%cs` is the committer date as `YYYY-MM-DD`, which is exactly the pin format. Read it on the base revision the run started from (`origin/main`), not on a dirty working tree.

Why the file date rather than a per-entry `updated`:

- **A per-entry date cannot serve the concepts layer at all.** `concepts:profiler-concepts` is a *fixed* ref — the whole registry is one identity, the way `graph:profiler-graph` is. There is no entry to date. Any per-entry scheme would still need a file-level answer here, so it could never be the single mechanism
- **A field a human must remember to set fails in the unsafe direction.** A forgotten `updated` makes a changed source look unchanged, and a lesson built on it is never re-examined — silent staleness. A commit date cannot be forgotten. The file date over-triggers instead: it makes every lesson pinned to the layer a *candidate* whenever the file is touched for any reason, and candidacy is cheap — G3 ("contradiction, not novelty") still requires the run to name the taught claim that moved before anything is written, and the blast-radius caps bound a bad week
- **Both registries are deliberately lightweight** — an index of pins in use and a vocabulary in use, not research surfaces. A maintenance field on every entry is exactly the weight their schemas were written to avoid

**Fail-closed.** If the commit date cannot be determined — a shallow clone with no history for the path — the layer is **unknown** for that run (`CLASSROOM-COMMITTER-CONTRACT.md` §5.2) and every lesson pinned to it is frozen. It is never assumed to be today's date, and never assumed unchanged. Unshallowing first (`git fetch --unshallow`) is the fix, the same one CHANGELOG archive rotation already needs.

**If a per-entry date is ever wanted anyway** it is additive under "Extending the schema" below — `projects[].updated` / `concepts[].updated`, `schemaVersion` bumped, absent meaning "fall back to the file date". Nothing here forecloses it; the pipeline simply does not depend on it.

## Refresh calendar — `repository-information/profiler-refresh-calendar.json`

**Not a deployed file.** It lives in `repository-information/`, not `live-site-pages/`, because it is operational state for the **Profiler earnings desk** Routine rather than site content. One row per covered company; the desk reads it on every fire and writes back the row it advanced. See "Scheduled Refreshes" in `.claude/rules/profiler-app.md` for how the desk consumes it.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Calendar schema version (currently `1`) |
| `updated` | string | yes | `YYYY-MM-DD` the file was last written |
| `description` | string | yes | One-paragraph orientation for a fired session that reads the file cold |
| `companies[]` | object[] | yes | One row per covered company, public and private alike |
| `companies[].slug` | string | yes | Per Slug rules; must exist in `profiler-companies.json` |
| `companies[].nextReport` | string | public only | `YYYY-MM-DD` of the **next report this dossier owes** — the date the desk compares against. A date in the past means the row is **due**: either the report just published, or it published earlier and was never folded in |
| `companies[].confirmed` | boolean | public only | `true` when `nextReport` comes from the company itself (IR calendar, press release, regulatory deadline); `false` when it is a tracker estimate or a cadence inference. Unconfirmed rows within seven days are the desk's confirm-the-date work |
| `companies[].cadence` | string | private only | `"quarterly"` — the row has no earnings clock and is carried by the recurring quarterly sweep (Jan/Apr/Jul/Oct 1). Mutually exclusive with `nextReport`/`confirmed` |
| `companies[].source` | string | yes | URL or note establishing where `nextReport` came from, and any caveat the desk's verify step needs (conflicting trackers, unannounced dates, rebrands, overdue history) |
| `companies[].lastRefreshed` | string | yes | `YYYY-MM-DD` the dossier was last revised — mirrors the registry's `lastUpdated` for the slug |
| `companies[].watch[]` | string[] | yes | Research focus items for the next refresh, in priority order. This is where the per-company judgment that used to live inside 22 separate trigger prompts is kept |

**Names and tickers are deliberately absent.** They resolve against `profiler-companies.json` by slug. Duplicating them here would create a second place for them to drift.

**Who writes it.** The desk advances the row it refreshed (`nextReport`, `confirmed`, `source`, `lastRefreshed`, and `watch[]` where the picture moved) in the same commit as the dossier. A developer adds a row when a company joins coverage, and converts a `cadence` row to a `nextReport` row when a private company lists — the quarterly sweep's watch items already flag the candidates (Vantage, Switch, Lambda, xAI).

**The roster and the calendar are in bijection, and it is enforced.** Every **active** company in `profiler-companies.json` has exactly one row here, and every row resolves to a covered company. `scripts/sync-profiler-registry.py` asserts this: under `--check` a missing row, an orphan row, a duplicate, or a row that breaks the field rules above is an **error and exits 1**; in write mode the same finding is a **warning**, because during authoring a company is legitimately registered before its row is added later in the same session. Archived companies may keep a row but are not required to have one. The check lives in the sync script rather than in a checker of its own for one reason: it is the script that already runs after every profile write, and an unscheduled company is a defect that **hides itself** — it simply never enters the desk's queue. The gap reached **38 of 151 companies** before anyone noticed (found by accident at v04.88r, enforced from v04.89r).

**Adding a company.** Add the row in the same commit that adds the dossier. A public company with no announced date gets `confirmed: false` and a cadence-inferred `nextReport`; the desk confirms it when the date comes within seven days.

## Extending the schema

When a new section is needed ("potentially more later"):
1. Add the field(s) here first — this file is the schema's single source of truth
2. Bump `schemaVersion` in new/revised profiles; older profiles stay valid (the renderer skips absent sections)
3. Extend the renderer in `Profiler.html` (PROJECT block) to draw the new section when present — page version bump per [PC-HTML-VERSION] #2
4. Backfill existing profiles opportunistically on their next revision — no mass migration required

Developed by: LightAISolutions
