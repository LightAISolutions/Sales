# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
**Date:** 2026-08-30 10:53:59 PM EST
**Repo version:** v03.96r
**Branch:** `claude/bess-aidc-phase-4-l74und`

**What we worked on (Phase 4 built + accelerated fleet backfill + pin layer + report automation, v03.91r–v03.96r):**

- **v03.91r — Phase 4 / schema v7 built:** `policyExposure[]` (regime/status/effectiveDate/exposure/mitigation/source; new Policy tab in all 5 style skins + export chapter), physical KPI keys (`gwh-shipped`, `backlog-gwh`, `mw-energized`, `mw-contracted`) + `qty` overlay, relationship `via`/`project` + `profiler-projects.json` named-projects registry (colossus/homer-city/stargate), `OV_PEER_FAMILIES` expanded to 4 families (hardware · colocation=developer+neocloud · construction=epc+gc · developer-ipp=ipp). Profiler v01.71w; graph builder + reports checker extended; CHANGELOG archive rotation (2026-08-23 group)
- **v03.92r — first real v7 data:** Tesla (2 policy regimes + `via` on CATL/LG) and xAI (tesla rel → `via: Megapack` + first `⚑ colossus` pin); both archived; developer verified live
- **v03.93r — fleet-wide backfill, 9 parallel agents:** 83 dossiers → v7 (116 policy entries, 180 `via`, pins 28, 10 qty overlays); 3 legitimate skips (core-scientific, hitt, holder-construction — nothing supportable); 83 outgoing versions archived from git; rotation again (2026-08-24 group, 8 sections)
- **v03.94r — pin-coverage Layers 1+2:** projects registry v2 (`parent` rollup), 5 new registrations (hyperion, frontier/lighthouse/jupiter-nm as stargate children, trimount), 14 pins added + 3 stargate pins refined to specific campuses (pin-precision rule now in schema), denton deliberately NOT registered (no single-campus engagement — the registry's own rule held), `scripts/scan-project-candidates.py` standing scanner (20-name watchlist, flags ≥3-dossier unregistered names), v01.72w tooltip "part of Stargate"
- **v03.95r — report automation (developer approved drift-gated monthly over their weekly-wall-clock instinct):** inaugural opportunity report `named-project-bess-attach--opportunity--2026-08-30` (15 pins, 18 verbatim citations, checker 0 errors first run), report-library search + type/status filters (v01.73w), Routine `Profiler opportunity report — monthly drift check` (`trig_01TvnXREVHsQ4QCrtveYjvZM`, cron `0 17 1 * *` ≈ 1st 9am PST, fresh session; gate: <10 scoped dossiers revised past pins AND no fired indicator → silent stand-down, else supersede with "What changed since the last edition"); documented as Report Command step 8 in `.claude/rules/profiler-app.md`
- **v03.96r — Phase 5 handoff:** wrote `repository-information/PHASE5-LEARNING-LAYER-PLAN.md` (detailed spec re-derived from the codebase: study.json v2 on the guidance engine via `gdRenderDoc`'s fetch-decoupled renderer, concepts registry, v1 adapter + optional one-shot lift, Layer 3 Scraper-seed rider) + this context save

**Where we left off:**

- Everything pushed and auto-merged; working tree clean. **Phases 0–4 of the 7-phase plan are DONE**; the pin/report layer extensions are done
- **Phase 5 (learning-layer unification) is greenlit for a FRESH session** — the full spec is in `repository-information/PHASE5-LEARNING-LAYER-PLAN.md`; Layer 3 (Scraper interest seeds for registered projects) rides its commit train (approved)
- Phase 6 = Classroom design gate — a design conversation AFTER P5, not a build

**Key decisions made:**

- Drift-gated monthly report regeneration approved over weekly wall-clock (reports read only dossiers; weekly signal lives in Scraper; library is already the archive)
- Pin-precision rule: single-campus engagements pin the sub-campus (parent rolls up); multi-site engagements keep the program pin
- Registry register-only-when-referenced rule enforced (denton deferred to watchlist despite 5-dossier corroboration)
- Regime labels stay free-string; minor drift noted ("DoD 1260H list" vs "listing") — normalize opportunistically
- Pre-existing gap flagged NOT repaired (developer's call pending): `tesla.profile.v4.json` never archived by the v03.67r curation pass; recoverable from git before commit `a5f7158`

**Active context:**

- Branch `claude/bess-aidc-phase-4-l74und` · repo v03.96r · Profiler page v01.73w · Profiler GAS v01.28g · Scraper GAS v01.89g
- Capacity: repo CHANGELOG 96/100; **Profiler page changelog 49/50 — its rotation likely fires within the next 1–2 page bumps**; toggles unchanged (START/TIMING/END On, CHAT_BOOKENDS Off)
- Watch items for the next session's first check: Monday 2026-08-31 06:00 ET scheduled Scraper run (first unattended reliability+corpus exercise) and the drift Routine's first fire 2026-09-01 ~9am PST (expected: silent stand-down at near-zero drift)
- Unregistered-project watchlist headliners from `scan-project-candidates.py`: new-albany 8 dossiers (multi-operator cluster — needs human split), denton 5, polaris-forge 4

**Recommendation for next session:**

- **Build Phase 5 (learning-layer unification)** per `repository-information/PHASE5-LEARNING-LAYER-PLAN.md` — study.json v2 on the guidance engine, the concepts registry, the v1 adapter (+ confirm the one-shot lift of all 62 guides with the developer), and the approved Layer 3 Scraper-seed rider in the same train

**To continue:** type `build phase 5`

## Previous Sessions

### Session — 2026-08-30 (strategic gap analysis + Phases 0–3 built, v03.89r–v03.90r)

**Date:** 2026-08-30 09:14:53 PM EST
**Repo version:** v03.90r
**Branch:** `claude/bess-aidc-market-research-f6jznm`

**What we worked on (strategic analysis → Phases 0–3 built and verified, v03.89r–v03.90r):**

- **Strategic gap analysis** of Profiler + Scraper against the developer's stated big-picture goal (mastering the US BESS/AIDC market for a sales/BD career; Profiler = reliable 1st-party skeleton, Scraper = "fresh blood" 3rd-party trade news finding the diamonds companies won't disclose; future **Classroom** app to teach the developer + team from the accumulated corpus). Two Explore agents read all ~45k lines; produced 7 strategic gaps and a **7-phase action plan (Phases 0–6)** — full analysis and both agents' findings are in this session's transcript; the plan summary: P0 hygiene · P1 wire the bridge · P2 stop corpus data loss · P3 diamond pipeline · P4 schema v7 depth · P5 unify the learning layer (study.json v2 on the guidance engine + concepts registry) · P6 Classroom design gate
- **v03.89r — approved Phases 0–3, one commit:** (P0) schema-doc drift fixed (`ipp` category, `legalName`+`hq` identity variant documented, `recentDevelopments.category` canonical enum expanded 8→17 with case-insensitive consumption + opportunistic normalization), stale "Planned" `profiler report` commands entry removed, `searchArchive`/`sourceStats` bounded to newest-8000-row column-scoped reads, ClickLog capped at 20k; (P1) rubric returns company **slugs** (`mcs`) + article key (`ak`) in intake Signals JSON (safe field-drop serializer `scSignalsJson_` replaces the raw 1200-char slice), slug-aware deduped `scTimelineScan_`/`companyTimeline`, **token-gated `?action=corpus` route** in Scraper (`cop=timeline|candidates`, `CORPUS_TOKEN` Script Property, flat refusal while unset), `handleNewsOp_` session-validated proxy in Profiler.gs (server→server with the shared token), **Coverage 📰 dossier overlay** in Profiler.html (split at dossier `lastUpdated`, event chips, figures, desk reads, candidates list); (P2) Drive cold-store (`scColdStoreRows_` → "Scraper Archive" folder) before Digests/DigestIntake retention trims — failed Drive write SKIPS the trim; sub-floor covered-company items kept as corpus-only `Section='archive'` rows excluded from digest flow via `scDigestItems_`; archive search haystack now includes summary + analysis; (P3) summarize call additionally returns `event` (closed 10-value enum `SCRAPER_EVENT_TYPES`) + up to 6 verbatim `figs` merged into Signals JSON, **EdgeCandidates tab** mined post-render (covered-company pairs per article, deduped, ≤25/run), daily `scReconcileEdgeCandidates_` marks pending → `covered` against published profiler-graph.json / `expired` after 60d, **"News Triage — Scraper Corpus Bridge"** section added to `.claude/rules/profiler-app.md` and wired into the scheduled-refresh convention. Versions: Scraper GAS v01.89g, Profiler GAS v01.28g, Profiler page v01.69w. All three affected diagrams synced with regenerated + verified pako URLs
- **Bridge verified live:** developer set `CORPUS_TOKEN` in both projects; session probes confirmed both deploys (v01.89g / v01.28g), token gating (wrong/missing token → flat `denied`), session gating (`SESSION_EXPIRED`); developer screenshots confirmed Tesla/CATL/NVIDIA Coverage panels rendering with stored items, splits, and desk reads
- **v03.90r (page v01.70w):** roster search narrowed to company **names only** (`name + slug`, tagline dropped from the haystack) — predicate verified against the live registry ("nvidia" → 1 card, was 7); developer confirmed working
- Housekeeping: Profiler page changelog hit its 50-cap → rotated the six 2026-08-10 sections to its archive with SHA enrichment (now 46/50)

**Where we left off:**

- Phases 0–3 fully built, deployed, probe- and screenshot-verified. Working tree clean, everything merged to `main`
- **The developer wants Phase 4 built in a fresh session** — that is the entire next job. Phase 4 spec (from the approved plan): **schema v7** — (a) `policyExposure[]` on profiles (`{regime, status, effectiveDate, exposure, mitigation, source}` — regimes like §154/FEOC/ITC-45X/301/AD-CVD; raw material already in 35 dossiers' prose, the bankability guidance module, and the §154 risk report); (b) BESS/AIDC-native KPI keys added to the normalized-KPI vocabulary (`gwh-shipped`, `backlog-gwh`, `mw-energized`, `mw-contracted`); (c) optional relationship `via` (product line) + `project` fields plus a lightweight named-projects registry (Stargate, Colossus, Homer City as first-class entities); (d) expand `OV_PEER_FAMILIES` in Profiler.html beyond the single `hardware` family (colocation, EPC/GC, developer/IPP). Order: PROFILER-SCHEMA.md first (single source of truth), then renderer + check scripts, then backfill rides post-earnings refreshes opportunistically — no mass migration (the proven v3/v4 pattern). Phases 5–6 remain unbuilt and unscheduled

**Key decisions made:**

- Diamond-loop closes **without any write-back channel**: refresh sessions promote candidates into dossier `relationships[]`, the graph rebuild publishes, Scraper's daily reconcile observes it and marks the candidate `covered`
- `CORPUS_TOKEN` lives ONLY in both projects' Script Properties and Routine prompts — never in repo files, never typed into chat (prompts land verbatim in the repo CHANGELOG)
- Cold-store failure skips the retention trim (preserving rows beats tidying the tab); sub-25 covered-company items are kept because the sub-floor band is where quiet single-source leaks live
- Enum/identity normalization is opportunistic-on-revision only — no 88-profile data pass (would force 88 archival snapshots for cosmetics)
- Roster search = names only; slug stays in the haystack as the hyphenated name form
- Retired Scraper pipeline code (~2,500 lines) and the unreachable suggest-note path stay in place per Chesterton's Fence — open decisions

**Active context:**

- **Branch:** `claude/bess-aidc-market-research-f6jznm` · **Repo:** v03.90r · **Profiler:** page v01.70w / GAS v01.28g · **Scraper:** page v01.68w / GAS v01.89g — all live
- Capacity: **repo CHANGELOG 100/100 — the NEXT push exceeds the cap: archive rotation with mandatory SHA enrichment MUST run in that push commit** (likely the Phase 4 session's push); Profiler page changelog 46/50; Scraper GAS 36/50; Profiler GAS 28/50
- Watch item: **Monday 2026-08-31 06:00 ET scheduled Scraper run** — now the first unattended exercise of BOTH the v03.87r–88r reliability machinery AND the new corpus path (event/figure capture, candidate mining, corpus-only rows, cold-store hooks). Fastest read: the "Last scheduled run" tile + `goLiveStatus` `recentErrors`, then the first EdgeCandidates rows and a Coverage panel for event chips
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**

- **Build Phase 4 (schema v7 depth)** per the spec in "Where we left off": `policyExposure[]`, BESS/AIDC-native KPI keys, relationship `via`/`project` + named-projects registry, expanded peer families — schema doc first, then renderer + check scripts, opportunistic backfill. Heads-up for that session: its push commit must also run the repo CHANGELOG archive rotation (file is at 100/100)
- **To continue:** type `build phase 4`

Developed by: LightAISolutions
