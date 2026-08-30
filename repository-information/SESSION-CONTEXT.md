# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-29 08:19:11 PM EST
**Repo version:** v03.75r
**Branch:** `claude/profiler-report-engine-nlopn4`

**What we worked on (v03.63r-v03.75r — the report engine, then the complete Relationships build-out):**

- **Report engine (v01.52w-v01.53w):** `#reports` / `#report/<id>` views + the grid-scale BESS competitive report (`profiler-data/reports/`), admin-only via the `reports` capability; commit-message rule contradiction resolved in `gas-scripts.md` (repo-version prefix only, developer decision)
- **Relationships tab (v01.54w):** own tab per dossier, full-length explanations (source + context + every quoted mention), nothing truncated
- **The big build-out (v01.55w, v03.67r, approved at maximum scope):** 485 curated relationship links across all 88 dossiers (schema v6), 12 hyperscaler/neocloud dossiers revised with targeted research (archived per procedure), `profiler-graph.json` built by new `scripts/build-profiler-graph.py` (REQUIRED after every profile write, rule updated), grouped tab (Working with / Competing with / Other / Detected) with deal chips + cross-dossier inbound evidence, ⛓ Network explorer at `#network`
- **Refinements (v01.56w-v01.62w):** Detected group collapsed by default + denial-only edges excluded via `EXCLUDED_PAIRS` (v03.68r); two-company common-ground compare mode (v03.69r); "What's new" recency feed, later tightened 90d→30d (v03.70r-71r); report Relationship map — live overlay, curated links only, excluded from Word export (v03.71r); relationship one-pager Word export + masthead button swap (Network 44px / admin-only Reports 84px) + Industry Guidance grouped into three topic lanes with a `group` meta field (Profiler.gs v01.23g, v03.72r); counterparty-category filter chips + IPP label fix (v03.73r); formation timeline with lane-based collision-free labels (v03.74r)
- **Opener-gate hardening (v03.75r, this push):** page enumeration folded into the Response Opener Step 1 command in `chat-bookends.md` after a fabricated-timestamp miss — one combined command (timestamp + toggles + version files) that nothing can displace

**Where we left off:**

- Everything committed, pushed, and auto-merged through v03.74r; v03.75r (gate fix + this context) is the final push. Working tree clean
- **The Relationships improvement list is fully delivered** — grouping + deal chips, graph + inbound evidence, Network explorer, common ground, recency feed, report wiring, one-pager export, category chips, formation timeline. No deferred work on this thread
- The Industry Guidance topic-lane headers require the GAS deploy webhook to have fired (v01.23g) — if the library still renders flat well after the v03.72r merge, check the deploy webhook

**Key decisions made:**

- Detected (derived-only) links are weak signals: collapsed by default; edges whose only evidence is an anti-relationship denial sentence are excluded in the graph builder (`EXCLUDED_PAIRS` — curated links can never be excluded)
- Recency window is 30 days (developer preference over the initial 90)
- The report Relationship map is a clearly-labeled **live overlay** — never blended into the immutable report snapshot, curated links only, excluded from the Word export
- Masthead slots: universally-visible buttons take the inner slots, admin-only buttons the outermost, so lower tiers never see a gap
- Guidance topic lanes: Technology Foundations → The AI Data-Center Wave → Market Access & Bankability; every future module must carry a `group` label (rule in `industry-guidance.md` step 4)
- Two "run this first" habits displace each other under task focus — the opener is now one indivisible command

**Active context:**

- **Branch:** `claude/profiler-report-engine-nlopn4` · **Repo:** v03.75r · **Profiler:** v01.62w / GAS v01.23g
- Relationship graph: 472 edges (372 curated), 1,499 evidence items, 88 companies
- Changelog capacity: page 44/50 · GAS 23/50 · **repo CHANGELOG 100/100 — the NEXT push must rotate a date group into the archive (SHA enrichment mandatory)**
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**

- Nothing is deferred from this session. One inherited watch item survives from the Scraper session (its entry rotated out of this file under the 2-session cap): **Monday 2026-08-31's scheduled Scraper digest run is the first real end-to-end execution** of the 06:00 ET build / 07:00 ET send schedule — verify it built from the 72-hour window, replaced the day's edition, and actually mailed.

**To continue:** type `check how Monday's scheduled Scraper run went`

## Previous Sessions

### Session — 2026-08-29 (Profiler quality build-out, v03.52r-v03.62r)

**Date:** 2026-08-29 03:45:02 PM EST
**Repo version:** v03.62r
**Branch:** `claude/profiler-dossier-summary-8obbjo`

**What we worked on (v03.52r–v03.62r — the Profiler quality build-out, all six approved recommendations now shipped):**

- **Summary tab + relationships (v01.44w–v01.45w):** renamed each dossier's Background tab to Summary; replaced the rejected "at a glance" cards with a Relationships section — typed cross-links derived from dossier data plus a radial SVG relationship map with clickable nodes. Settings cog (bottom right) with a Commands overlay documenting all Profiler commands
- **Compare view (v01.46w–v01.48w):** roster Compare mode (up to 4 companies), tiered rows — dossier meta and financials always; product/spec rows only within a shared peer group. Peer families: `OV_PEER_FAMILIES` treats supplier + integrator as one "Hardware" family (developer directive — keep grouping flexible as the industry shifts). Cross-space selections fall back to financials-only
- **Normalized KPIs, schema v4 (v01.47w–v01.49w, roadmap #2):** `periodType`/`periodEnd`/`kpi`/`usdMillions`/`fxBasis` overlay; comparable-revenue coverage now **42 of 88**. FX rates researched, never recalled (CNY 7.1873, TWD 31.171, KRW 1421.48, EUR 1.1306 — all 2025 annual averages). Five deliberate exclusions render "Not normalized yet": Oracle (guidance), Switch (no annual total), Crusoe + Lambda (third-party estimates), OpenAI (press-reported)
- **Source provenance (v01.50w, roadmap #4):** every source classified company / disclosure / independent; first-party share shown on the dossier header, in the Source List with per-source tags, and as a Compare Tier 0 row. Registry schema v2 added `companies[].domains` (all 88 curated); per-source `party` field overrides any verdict
- **Roster coverage (v01.51w, roadmap #5):** freshness dot (fresh ≤45d / aging ≤120d / stale — post-earnings cadence) with visible age, source count, first-party share, `$ comparable` tag per card; aggregate strip above the grid. New `scripts/sync-profiler-registry.py` reconciles the denormalized registry fields (`--check` reports drift); its use is now REQUIRED after any profile write (rule added to `.claude/rules/profiler-app.md` step 5 this push)
- **Notable bugs found & fixed:** `ovCmpLatestRevenue` picked revenue by array position but 22/88 dossiers are newest-first (Amazon would have shown FY2024); a token-matching provenance classifier was **discarded before shipping** after an 88-dossier audit (Black & Veatch 6%, Google 0% — replaced with declared domains); `ovFreshness` boundary flip from `Math.round` on datetime deltas
- Six ticker-field ownership-prose fixes; registry `lastUpdated` drift sync (both task cards)

**Where we left off:**

- All work committed, pushed, and auto-merged through **v03.62r** (this push carries the sync-requirement rule + this session context). Working tree clean
- **All six approved recommendations from the session-opening review are done except #3 — the `profiler report <topic>` command — which the developer explicitly wants as its own session with fresh context**
- Profiler page changelog sits at **50/50 — the next page bump rotates again** (2026-08-07's five sections move as one date group, SHA enrichment mandatory). Repo CHANGELOG at 98/100

**Key decisions made:**

- Compare is financials-first; deep rows only within a peer family. Supplier + integrator are one family; the structure is declarative so new families are one-line additions
- Provenance classification is data-driven (registry `domains`), never name-token heuristics — a wrong sourcing claim is worse than none
- First-party share is a **balance signal, not a quality score** — near-total company sourcing reads as under-corroborated by design
- No near-identical archive snapshots for batch data passes; FY2025-only KPI normalization; dossier-stated USD beats external FX conversion
- The roster renders from the registry alone — anything it displays gets denormalized into the registry and reconciled by the sync script, never fetched per-card

**Active context:**

- **Branch:** `claude/profiler-dossier-summary-8obbjo` · **Repo:** v03.62r · **Profiler:** `v01.51w` / GAS `v01.22g`
- Coverage: 88 dossiers · 2,058 cited sources · 42 comparable revenue · median 52% first-party · all freshness dots green (oldest 7d — tints differentiate as October earnings approach)
- ~30 armed post-earnings refresh triggers start firing late October; each fired session now inherits the sync-script requirement via the updated Profiler Command
- Test suites live in the session scratchpad and are NOT committed — the durable contracts are in `.claude/rules/` and `PROFILER-SCHEMA.md`
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**

- Design and build **`profiler report <topic>`** (roadmap #3, the last approved item) — the industry-report engine that was the point of the whole quality build-out. Everything it needs now exists: normalized KPIs for cross-company figures, provenance for citation confidence, relationships for ecosystem structure, peer families for scoping, and coverage metadata for honesty about gaps. Start with a design pass (report types — macro, competitive, risk, opportunity; output format; how reports cite dossier sources per the "Reports" rule in profiler-app.md's Recall design) and get developer approval before building.

**To continue:** type `design profiler report`

Developed by: LightAISolutions
