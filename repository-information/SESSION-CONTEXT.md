# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
**Date:** 2026-08-31 04:11:48 AM EST
**Repo version:** v03.98r
**Branch:** `claude/bess-aidc-phase-5-learning-gdc1f0`

**What we worked on (Phase 5 built + Phase 6 design gate closed, v03.97r–v03.98r):**

- **v03.97r — Phase 5 (learning-layer unification) built end-to-end** per the plan doc: Study Guide **schema v2** on the guidance section-kind vocabulary (PROFILER-SCHEMA.md rewritten; v1 renderable forever via the in-page `ovStudyV2` adapter); **`profiler-concepts.json`** shared public glossary seeded with 44 core concepts ({{term}} resolves doc-glossary-first → registry); `ovShowStudy` swapped onto `gdRenderDoc` with a "Study Guide" shell (v01.74w; old v1 overlay + CSS retired); `Profiler.gs` v01.29g accepts `study-<slug>` progress ids (registry-validated, pattern-checked, 80-tick cap — cross-device sync for guidance-role tiers, localStorage otherwise); **one-shot lift of all 62 guides** (384 sections, 802 flashcards, lossless, `scripts/lift-study-guides.py`); `scripts/check-profiler-study.py` validator (clean pass, wired into schema + Prep Command); **Layer 3 rider**: 8 named-project interest seeds in `Scraper.gs` v01.90g (`source: 'project:<slug>'`) + registration-time seed convention in PROFILER-SCHEMA.md. Verified: node --check, inner-scripts check, Playwright renders (lifted guide, rich-kind synthetic with registry tooltips + doc-glossary override, v1 adapter), harness smoke
- **v03.98r — Phase 6 Classroom design gate held and closed**: four decision points put to the developer, answers reasoned through, approved design written as **`repository-information/PHASE6-CLASSROOM-DESIGN.md`** — the executable spec for the build sessions

**Where we left off:**

- Everything pushed and auto-merged; working tree clean. **Phases 0–5 of the 7-phase plan are DONE; the Phase 6 design gate is CLOSED** — the developer approved the plan and will build Classroom v1 in a fresh session
- Classroom v1 = **C0–C2** per the spec: C0 scaffold (`setup-gas-project.sh` → Classroom app) + the approved Profiler analyst-tier access retune; C1 learning core (tracks/progress/study-next); C2 curriculum pipeline (scheduled authoring Routine, weekly briefing lessons, freshness gates)

**Key decisions made:**

- **Classroom is its own app** (`Classroom.html` + `Classroom.gs`) — recommendation deliberately reversed from "Profiler mode" once the developer stated the federated-ecosystem/quality-over-economy context; synergy via Pages data + token-gated server-to-server routes
- **Profiler access retune approved** (not yet coded — C0's first slice): analyst loses Relationships/Network, Coverage (real server-side check in `handleNewsOp_`), and Export; viewer strict dossier-only; contributor/admin unchanged; `verify-profiler-roles.py` to be extended
- **"Everything" content under the provenance-gating rule** — a lesson inherits the strictest gate of its inputs; field notes never become content; the deep-analysis half runs as scheduled Claude sessions, not in GAS; in-app runtime Q&A stays deliberately deferred
- **C3 = Guidance homecoming** (developer-proposed, agreed): Industry Guidance migrates from `Profiler.gs` to Classroom after v1 verifies; **no interim Profiler→Classroom guidance route** — tracks deep-link until then; full migration checklist is in the spec
- One-shot v1→v2 study lift confirmed by the developer's prompt phrasing and executed; `lastUpdated` values preserved (content unchanged)

**Active context:**

- Branch `claude/bess-aidc-phase-5-learning-gdc1f0` · repo v03.98r · Profiler page v01.74w / GAS v01.29g · Scraper page v01.68w / GAS v01.90g
- Capacity: repo CHANGELOG 98/100 (rotation ~2–3 pushes out); **Profiler page changelog 50/50 — the C0 session's Profiler.html bump (access retune) WILL trigger its archive rotation with SHA enrichment**; Profiler GAS 29/50; Scraper GAS 37/50; toggles unchanged (START/TIMING/END On, CHAT_BOOKENDS Off)
- Watch items: Monday 2026-08-31 06:00 ET scheduled Scraper run (first unattended corpus exercise; the 8 project seeds land in the Interests tab flagged "New topic" via the daily registry sync) and the drift Routine's first fire 2026-09-01 ~9am PST (expected: silent stand-down)

**Recommendation for next session:**

- **Build Classroom v1 (C0–C2)** per `repository-information/PHASE6-CLASSROOM-DESIGN.md` — C0 scaffold + Profiler access retune (that push must also rotate the Profiler page changelog, at cap), then C1 learning core, then C2 curriculum pipeline

**To continue:** type `build classroom v1`

## Previous Sessions

### Session — 2026-08-30 (Phase 4 built + fleet backfill + pin layer + report automation + Phase 5 handoff, v03.91r–v03.96r)

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

Developed by: LightAISolutions
