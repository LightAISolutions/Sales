# Phase 6 — Classroom Design (approved gate output)

**Provenance:** Phase 6 of the 7-phase BESS/AIDC action plan. The design gate the plan required was held 2026-08-30 → 31 (v03.98r session); every decision below was made or approved by the developer in that conversation. This document is the **executable spec** the Classroom build sessions work from — the successor to `PHASE5-LEARNING-LAYER-PLAN.md`, playing the same role Phase 5's spec played for its build.

**Big picture:** Profiler is the first-party skeleton, Scraper is the fresh third-party blood, and **Classroom is the institution** — it turns the accumulated corpus into taught, retained, current knowledge for the developer and the team they may lead, in service of mastering the US BESS/AIDC market for a sales/BD career. Ecosystem stance (developer directive, 2026-08-31): a growing family of **federated apps** — each with its own page + GAS project — synergizing through public Pages data and token-gated server-to-server routes, never a monolith. Quality over build economy.

## Decisions (developer-approved 2026-08-31)

1. **Form factor — own app**: `Classroom.html` + `Classroom.gs`, spawned via `setup-gas-project.sh` from the auth template (own sign-in wall, Master ACL, deploy webhook, version/changelog files)
2. **Audience**: admin, contributor, and analyst tiers get Classroom; viewer is excluded
3. **Content**: "Everything" — the whole corpus teaches, under the provenance-gating rule below; field notes never become content; the deep analysis/authoring half runs as scheduled Claude sessions, not in GAS
4. **V1 scope = C0 – C2** (scaffold + learning core + curriculum pipeline); drills and simulations ride the next train
5. **Profiler access retune** — approved as proposed (analyst loses Relationships/Network, Coverage, Export; viewer goes strict dossier-only); executes as C0's first slice
6. **Industry Guidance migrates to Classroom** (developer-proposed, agreed): target state is guidance living in `Classroom.gs`; executed as dedicated phase **C3 — Guidance homecoming** after v1 is verified. No interim Profiler→Classroom guidance route is built — until C3, Classroom tracks deep-link out to Profiler's guidance hub for tiers holding the capability

## Access model

### Profiler retune (C0's first slice — approved 2026-08-31; **BUILT 2026-08-31**, ahead of the Classroom scaffold)

> **Status: done.** Shipped as Profiler v01.75w / v01.30g — `OV_ROLE_CAPS` gained `network` · `coverage` · `study` · `compare`, `handleNewsOp_` got its server-side check, the `#network` and `#compare` hash routes deny on their own, and `scripts/verify-profiler-roles.py` now asserts all ten surfaces per tier plus both deep links. The rest of C0 (Classroom scaffold, cross-links) is still to build.

| Profiler surface | Admin | Contributor | Analyst | Viewer |
|---|---|---|---|---|
| Dossiers, roster, search (incl. Policy tab) | ✓ | ✓ | ✓ | ✓ |
| Study guides + concepts tooltips | ✓ | ✓ | ✓ | ✗ *(change)* |
| Compare view | ✓ | ✓ | ✓ | ✗ *(change if currently visible)* |
| Relationships tab + Network explorer | ✓ | ✓ | **✗ (change)** | ✗ |
| Coverage 📰 (Scraper-bound) | ✓ | ✓ | **✗ (change)** | ✗ |
| Export dossier (Word/PDF) | ✓ | ✓ | **✗ (change)** | ✗ |
| Industry Guidance | ✓ | ✓ | ✗ | ✗ |
| Reports · Versions · Field notes · Style 🖋 | ✓ | ✗ | ✗ | ✗ |

Implementation notes for the C0 session:
- New `OV_ROLE_CAPS` capabilities for the surfaces not yet capability-gated (`network`/relationships tab, `coverage`, and the study/compare gating for viewer); flip `export` off for analyst. `?as=<tier>` preview must keep only-subtracting semantics
- **Coverage gets a real server-side role check** in `handleNewsOp_` (`Profiler.gs`) — the proxy currently validates the session only. Relationships/network, study guides, and compare draw on public Pages JSON, so their analyst/viewer gates are app-experience gates (same honest standing as Versions); if that data must ever become truly private, that is a data-relocation decision (the M3 pattern), not a gate tweak
- `GUIDANCE_ROLES` unchanged; "report generation" needs no change — reports are session-authored and the in-app surface is already view-only, admin-only. User management lives in the MasterACL app (admin-only, unchanged)
- Update `scripts/verify-profiler-roles.py` for the new matrix; Profiler page + GAS version bumps per the normal train
- **Budget definition** (for "anything that could meaningfully use up budgets"): anything that triggers AI generation or heavy fetch loops. Nothing a contributor can reach in Profiler today qualifies; Classroom's pipeline is the ecosystem's first real budget surface and its triggers stay admin-only + scheduled

### Classroom matrix (v1)

| Classroom surface | Admin | Contributor | Analyst | Viewer |
|---|---|---|---|---|
| Public-provenance tracks + progress + study-next | ✓ | ✓ | ✓ | — no access |
| Guidance-derived lessons (post-C3) / guidance deep-links (pre-C3) | ✓ | ✓ | ✗ | — |
| Report-derived lessons | ✓ | ✗ | ✗ | — |
| Weekly briefing lessons | ✓ | ✓ | ✗ (public-only edition if trivial, else ✗) | — |
| Pipeline controls, content admin | ✓ | ✗ | ✗ | — |

**Provenance-gating rule (the rule that makes "Everything" safe):** a generated lesson inherits the **strictest gate of its inputs** — public-input lessons can reach analysts; guidance-derived lessons are contributor+; report-derived lessons are admin-only. Content flows *up* the corpus into lessons, never *down* the access ladder. The gate follows the content across apps: a tier that cannot see guidance in Profiler never sees guidance-derived material in Classroom.

**Field notes never become content** — private Drive data under the notes-are-not-sources rule. At most they steer pipeline emphasis (admin-supplied, never quoted, never cited).

## Content & pipeline model

- **Sources**: dossiers (+ v7 policy/project/KPI data), relationship graph, named projects, study guides, concepts registry, guidance modules, reports, and Scraper's corpus (timeline/candidates via the existing token-gated route). Public layers are fetched by the page directly; gated content is served by `Classroom.gs` behind its role checks
- **Storage**: authored lessons and track definitions live in `Classroom.gs` (the guidance content-in-GAS pattern) because tracks reference gated titles; per-account track progress lives in Classroom's own property store (the `gd_progress` pattern), independent of Profiler's ticks
- **The pipeline** (C2): a recurring Routine fires fresh Claude sessions that read what changed since the last run — Scraper corpus deltas, dossier revisions (`lastUpdated` / graph), new guidance and reports — decide what a BESS/AIDC seller now needs to know, and author or refresh lesson modules + a **"This week in BESS/AIDC" briefing lesson**, committed and deployed like guidance modules. Cadence recommendation: weekly, staggered clear of the Monday 06:00 ET Scraper run; the C2 session sets it. Pipeline sessions follow the freshness discipline: every lesson carries a `reviewBy` from its own dated gates, refreshes emit **"what changed since you learned this"** deltas when new material contradicts taught material
- **In-app runtime Q&A ("ask the instructor") stays deliberately deferred** — same standing as the 2026-08-22 guidance decision. `anthropicSummarize_` (Scraper) is the API precedent and the `claude-api` skill is the mandatory pre-read if it is ever revisited; it is a real budget surface and needs its own design pass

## Phase plan

- **C0 — Scaffold + Profiler retune**: `setup-gas-project.sh` → Classroom app (auth template); Classroom access matrix; the Profiler retune above (page + server + role-verifier); masthead cross-links between the apps. No guidance route (decision 6)
- **C1 — Learning core**: track/lesson schema (provenance-gated); first tracks assembled from the existing corpus (public content inline, guidance via deep-links); per-account track progress + rollup; study-next pointer
- **C2 — Curriculum pipeline**: the scheduled authoring Routine, briefing lessons, freshness gates + deltas. **V1 ends here — verified before C3 starts**
- **C3 — Guidance homecoming** (developer-proposed 2026-08-31): migrate Industry Guidance from Profiler to Classroom. Checklist: the module content functions + `guidanceDocs_`/index/doc/search/unified-glossary ops move to `Classroom.gs`; the **Admin lens re-hosts in Classroom** (reads the public `reports/*.report.json` + index from Pages under Classroom's own `reports`-capability check); dossier-side "covered in guidance modules" chips re-point through **one narrow token-gated mentions route** on Classroom that `Profiler.gs` proxies (mirror of the corpus-route pattern); per-account guidance progress ticks migrate via a one-shot admin export/import (developer study history is not resettable state); Scraper's `guidance:<module-id>` seed sources stay valid (module ids never change); the quarterly review Routine re-points to Classroom; `.claude/rules/industry-guidance.md` re-targets authoring at `Classroom.gs` (module JSON vocabulary and renderer contract unchanged)
- **C4 — Retention**: spaced-repetition drill queue across all flashcards/quiz items, per-item history; needs its own storage design (drill history outgrows the 9KB-per-account property pattern — expect a sheet-backed store)
- **C5 — Sales simulations**: objection/discovery scenario modules built from dossier facts, relationships, named projects, and policy exposure
- **C6 — Team layer** (gated on a team actually existing): instructor dashboard, placement quiz, certification checkpoints

Each phase runs as its own session train with the standard Pre-Commit/Pre-Push discipline, exactly as Phases 0–5 did.

## Verification expectations

Per build session: `node --check` on `.gs` copies + `scripts/check-gas-inner-scripts.js`; Playwright render + screenshot read of every new surface; `scripts/verify-profiler-roles.py` after any access-matrix change (C0 extends it); the C3 migration is complete only when guidance renders in Classroom, the lens and mention chips work, and migrated progress ticks verify against a pre-migration export.

## After Phase 6

C6 closes the original 7-phase plan. Beyond it, candidate future decisions already named and deliberately deferred: in-app runtime Q&A, note-steered emphasis, audio/commute mode.

Developed by: LightAISolutions
