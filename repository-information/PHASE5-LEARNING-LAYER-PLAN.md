# Phase 5 — Learning-Layer Unification Plan

**Provenance:** Phase 5 of the approved 7-phase BESS/AIDC action plan (gap analysis, 2026-08-30, v03.89r session). Greenlit by the developer 2026-08-30 (v03.96r session) for a **fresh-session build**. This document is the detailed spec that session builds from — the gap-analysis transcript's detail did not persist, so it was re-derived here from the current codebase.

**Big picture:** Profiler is the first-party skeleton, Scraper is the fresh third-party blood, and the future **Classroom** app (Phase 6 design gate) teaches the developer + team from the accumulated corpus. Phase 5 unifies today's two incompatible teaching formats onto one engine so Classroom has a single content substrate.

## Current state (inventoried 2026-08-30)

- **Study guides** — 62 `<slug>.study.json` files in `live-site-pages/profiler-data/` (~822 KB; 384 sections, 802 flashcards), all at schema v1: `sections[]{heading, bullets[]}` + `flashcards[]{q, a}`. Rendered by `ovShowStudy` in `Profiler.html` — a thin overlay (bulleted lists + tap-to-flip cards) written before the guidance engine existed. Public Pages data, ungated by design (public-safe content rule in PROFILER-SCHEMA.md).
- **Guidance engine** — `gdRenderDoc(doc, shell)` in `Profiler.html` renders the rich section-kind vocabulary (`prose`, `callout`, `table`, `proscons`, `timeline`, `bars`, `flashcards`, `quiz`, `ledger`) plus `glossary`/`{{term}}` tooltips, `tiles`, per-section `sales` notes, revision notes, `reviewBy` chips, per-account quiz/done progress, and covered-company linking chips. **Crucially it is decoupled from its GAS fetch path** — callers fetch, the renderer takes plain JSON — so it can render static Pages JSON without touching the role-gated guidance ops.
- **Reports renderer** already reuses the same section-kind vocabulary (minus `flashcards`/`quiz`), proving the engine generalizes across content types.
- **The boundary that must not move:** guidance modules are admin/contributor-gated content living in `Profiler.gs` (never on Pages); study guides are public Pages data. Unification shares the *renderer and vocabulary*, never the content channels or gates.

## The build (proposed order)

1. **Schema — study.json v2** (PROFILER-SCHEMA.md first, single source of truth): `{ schemaVersion: 2, slug, title, lastUpdated, sections[], glossary[]{t, d}, flashcards? }` where `sections[]` uses the guidance section-kind vocabulary (`flashcards`/`quiz` allowed, unlike reports) and `{{term}}` tooltips resolve doc-glossary-first. v1 remains renderable forever: a small load-time adapter maps v1 (`heading`+`bullets`) onto v2 (`prose` with `ps` = bullets), so the renderer has one code path.
2. **Renderer** (`Profiler.html`, page version bump): the Study Guide overlay swaps `ovShowStudy`'s body for `gdRenderDoc` with a study shell variant — "Study Guide" kicker, source line and review chip omitted when absent, quiz/done progress namespaced per account+slug exactly as guidance already does. `ovShowStudy`'s v1 rendering retires once the adapter is in.
3. **Concepts registry** — new `live-site-pages/profiler-data/profiler-concepts.json`: `{ schemaVersion: 1, concepts[]{ slug, term, def, aliases[]? } }`, the shared public glossary. Study v2 `{{term}}` resolution order: doc glossary → concepts registry. The Prep Command registers new concepts there instead of redefining them per guide; guidance modules keep their internal glossaries (private content stays in `Profiler.gs`).
4. **Migration** — v1 tolerated indefinitely (the adapter guarantees it), but a **one-shot mechanical v1→v2 lift** (heading/bullets → prose, lossless, scripted) is recommended so the corpus is uniform and the adapter becomes a safety net rather than the main path. Rich-kind re-authoring (tables, timelines, quizzes) rides future `profiler prep` refreshes opportunistically — no mass re-authoring.
5. **Rider — Layer 3 Scraper seeds (approved 2026-08-30):** add interest-topic seeds for the registered named projects (`hyperion`, `frontier`, `lighthouse`, `jupiter-nm`, `trimount`; optionally `colossus`/`homer-city`/`stargate`) to `SCRAPER_INTEREST_TOPIC_SEEDS` in `googleAppsScripts/Scraper/Scraper.gs` with `source: 'project:<slug>'`, per the guidance-seed convention in `.claude/rules/industry-guidance.md` step 9. Scraper GAS version bump applies.
6. **Docs + verification:** PROFILER-SCHEMA.md study section rewritten for v2; Prep Command rules updated in `.claude/rules/profiler-app.md`; Playwright render of a lifted study guide through `gdRenderDoc`; extend the global validator pattern for study v2 shape; standard Pre-Commit train.

## Open questions for the build session

- **One-shot lift vs pure opportunistic** — the lift is lossless and scripted, but it revises 62 public files in one commit; confirm with the developer if they want it split.
- **Concepts registry seeding** — guidance glossaries are private, so the registry seeds from study-guide content + fresh authoring; decide the initial concept set (the BESS/AIDC core: LFP, PCS, ITC, FEOC, N+1, 800 VDC, …).
- **`repository-information/study-prep/` lesson plans** — out of scope; only the deployed study.json layer changes.

## After Phase 5

Phase 6 is the **Classroom design gate** — a design conversation, not a build: what Classroom is (new page vs Profiler mode), who it serves (the team the developer may lead), and how it draws on dossiers, guidance, study guides, reports, and the v7 policy/project/KPI data. Do not start Phase 6 implementation without that gate.

Developed by: LightAISolutions
