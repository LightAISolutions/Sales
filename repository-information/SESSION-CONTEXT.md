# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-29 09:54:32 PM EST
**Repo version:** v03.82r
**Branch:** `claude/industry-guidance-cleanup-xblq61`

**What we worked on (v03.76r–v03.82r — the Industry Guidance scrub + improvement build-out):**

- **Content scrub (v03.76r, GAS v01.24g + page v01.63w):** all six guidance modules stripped of company-specific guidance (Zhonhen, Hithium) — modules now address supplier/buyer groups only ("BESS suppliers", "TRU/SST suppliers", "§154-listed suppliers", developers, integrators, hyperscalers); statutory facts naming companies (the NDAA §154(b) list) stay as objective information. The `zh` note field renamed `sales`, rendered under a neutral "Sales angle" label (the renderer had leaked "For the Zhonhen conversation" to all guidance viewers). Repo CHANGELOG's 2026-08-22 date group (15 sections) rotated to the archive, SHA-enriched
- **Admin lens (v03.77r, page v01.64w):** reports declare `guidanceOverlays[]` (`{moduleId, sectionId, ps}`) and admins (the `reports` capability) see 🔒 rose panels inside the anchored module sections with a "View source report" link; stale anchors fall back to module end; non-admin tiers never fetch report data. `check-profiler-reports.py` validates anchors against the live modules parsed from Profiler.gs, forbids citation tokens in overlay prose, and reconciles the index's new `overlayModules` field
- **Two overlay-bearing reports** restoring the company lens the scrub removed: `s154-listed-bess-suppliers--risk--2026-08-29` (v03.78r — CATL/BYD/Envision/EVE/Hithium, 24 citations, 5 overlays onto China Policy / Bankability / Power Infra / Utility-AIDC; carries the *current* Hithium file: third listing lapse Apr 2026, equity freeze, ~10 CATL suits) and `aidc-power-conversion--competitive--2026-08-29` (v03.79r — Delta/LITEON/Megmeet/Zhonhen/Sinexcel/Vertiv/Eaton/Schneider, 29 citations, 3 overlays onto the NVIDIA module; carries the CATL RMB 4.1B/49% Zhonhen-holdco re-rating and the roster-absence read)
- **Freshness discipline (v03.80r, GAS v01.25g + page v01.65w):** every module carries a gate-derived `reviewBy` (Bankability → Oct 1 PRC-029-1; Utility-AIDC + Power Infra → Dec 10 Batch Zero; China Policy → Dec 31 Treasury PFE regs; NVIDIA → Nov 30; BESS Tech → Feb 24) rendered as plain/gold/red chips; report library + report view show fresh ≤45d / aging ≤120d / stale age chips; quarterly review Routine armed (`trig_01CrhxzfBV6uKQNKpUXLLMSZ`, Jan/Apr/Jul/Oct 15 13:00 UTC, fresh session, first fire 2026-10-15)
- **Company-chip cross-links (v03.81r, GAS v01.26g + page v01.66w):** covered company names in module text link to dossiers (`gdLinkCompanies` — registry name authority + `ovRelDerive` ambiguity guard; buttons/links/headings/term-spans excluded); dossiers show "✦ Covered in guidance modules" for guidance-capable tiers via the new role-gated `gop=mentions` op (server scan, 6h `CacheService`)
- **Search + unified glossary (v03.82r, page v01.67w, client-only):** library search across every module's flattened section text + glossary (ranked, highlighted snippets, hit → module scrolled to section via `ovGuideLoadDoc`'s new scroll arg); "📖 Unified glossary" merges all terms alphabetically, duplicates grouped with per-module definitions and source chips

**Where we left off:**

- Everything through v03.82r committed, pushed, and auto-merged; working tree clean; the v01.24g GAS deploy was live-verified via the `op=deploy` probe (later bumps ride the same webhook)
- **Of the six improvement recommendations from the module audit, four are delivered (#1 lens, #2 freshness, #3 cross-links, #6 search/glossary). #4 and #5 are deferred to next session at the developer's instruction** — see the recommendation below
- Profiler page changelog at **49/50 — the next page bump triggers its rotation** (SHA enrichment mandatory); repo CHANGELOG at 92/100; GAS changelog 26/50

**Key decisions made:**

- **Content scope rule (in `industry-guidance.md` step 4):** modules give guidance to groups only, never to a single named company; single-company specificity lives in admin-only reports and reaches modules through the Admin lens; statutory name-lists stay as fact
- Report overlays carry no `[c:id]` citation tokens (the report link is the citation path); reports stay immutable — the two new reports were authored fresh rather than retrofitting the existing one
- `reviewBy` derives from each module's own nearest dated gate, not a fixed cadence; the quarterly Routine is the backstop, the in-app chips the primary signal
- Cross-link matching inherits the ambiguity guard (one-word capitalized names skip sentence starts/post-colon) — under-linking beats false-linking
- Search and glossary are client-only over the existing role-gated ops — no new server surface, no content exposure beyond what the viewer's tier can already open

**Active context:**

- **Branch:** `claude/industry-guidance-cleanup-xblq61` · **Repo:** v03.82r · **Profiler:** v01.67w / GAS v01.26g
- Reports library: 3 reports, all `current`; the two new ones carry `overlayModules`; the older competitive report's coverage pins are aging by design (12 checker warnings, not errors)
- Imminent external events (no action needed — automated): Zhonhen H1 2026 report due by Aug 31 (feeds the NVIDIA-module lens's checkpoint); Sungrow + BYD post-earnings refresh triggers fire Aug 30; **inherited watch item: Monday 2026-08-31's scheduled Scraper digest run is the first real end-to-end execution — verify it built from the 72-hour window, replaced the day's edition, and mailed**
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**

- **Finish the two remaining guidance improvements in one pass (developer instruction, 2026-08-29):** **#5 per-module revision notes** — a `revisions: [{date, note}]` meta field on each module rendered near the header (seed each module with the 2026-08-29 scrub/generalization as its first entry; emit via `guidanceIndex_()` if the library should show a "revised" hint), then **#4 server-side reading-progress sync** — replace/augment the per-device localStorage `gdProgress` with a per-user store behind new role-gated guidance ops (e.g. `gop=progress` read / `gop=setprogress` write in `handleGuidanceOp_`, keyed by the validated session's account; keep localStorage as the offline fallback and migrate local ticks up on first sync). #4 is server-handler work only (not the served auth shell) but touches Profiler.gs storage — plan the storage medium (Script Properties vs the Master ACL spreadsheet pattern) before coding, and run the full gate set (node --check, inner-scripts, Playwright, harness). Both land as one interaction commit with GAS + page bumps.

**To continue:** type `finish the guidance improvements`

## Previous Sessions

### Session — 2026-08-29 (report engine + Relationships build-out, v03.63r-v03.75r)

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

Developed by: LightAISolutions
