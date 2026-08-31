# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
**Date:** 2026-08-31 05:32:16 AM EST
**Repo version:** v03.99r
**Branch:** `claude/dossier-analyst-access-fix-v437ym`

**What we worked on (Phase 6 C0's first slice built early + a model-choice analysis, v03.99r):**

- **v03.99r — the Profiler access retune, built.** The developer reported analysts still reaching Network + Relationships and thought it had already been changed. **Their premise was half right and the correction mattered**: the retune was *approved* in the v03.98r design gate but never coded — `OV_ROLE_CAPS` carried no `network` capability at all, so the Relationships tab and `#network` explorer were ungated for **every** signed-in tier, viewer included. The screenshot was correct behavior, not a regression
- **Scope call, flagged before starting**: implemented the whole approved table from `PHASE6-CLASSROOM-DESIGN.md`, not just the two surfaces named — analyst also lost Coverage 📰 and Export, viewer lost Study + Compare. Reason given: splitting it would have made `verify-profiler-roles.py` encode a half-applied matrix that gets rewritten next session. Developer did not object and has since verified admin/analyst differentiation live
- `Profiler.html` **v01.75w** — four new caps (`network`, `coverage`, `study`, `compare`); `ovDeniedView()` added so `#network` and `#compare` deep links deny on their own; three stale "ungated / every signed-in tier" comments corrected
- `Profiler.gs` **v01.30g** — `COVERAGE_ROLES` + `coverageAllowed_()` (sharing a new `roleAllowed_` helper with guidance) enforced in `handleNewsOp_`
- `scripts/verify-profiler-roles.py` — five surfaces → ten per tier, plus deep-link denial assertions in **both** directions; full run clean (4 tiers + progress isolation + 88-dossier specs audit)
- Profiler page changelog hit its 50/50 cap exactly as predicted — 2026-08-13 date group (2 sections) rotated to the archive with SHA enrichment
- **Then a research response (no code): Fable 5 vs Opus 5 for building Classroom**, asked because the developer is at 95% of their weekly Fable limit

**Where we left off:**

- Everything pushed and auto-merged; working tree clean. Developer confirmed the access differentiation is correct on the live site
- **Classroom v1 (C0–C2) is NOT started.** The developer is pausing the project here and will restart later — they took the model advice as something to "keep in mind for when I restart this project"
- Phase 6 C0's *first slice* is done; the rest of C0 (Classroom scaffold via `setup-gas-project.sh`, masthead cross-links) plus C1 and C2 remain

**Key decisions made:**

- **`network` is one capability gating two doors** — the per-dossier Relationships tab and the standalone explorer — so they can never drift apart. Documented in `.claude/rules/profiler-app.md`
- **Hidden entry points are not the gate**: every gated hash route re-checks its own capability. A bookmarked `#network` from an analyst gets a denial view, not a blank screen
- **Only Coverage got a real server-side boundary** — the corpus reaches the browser solely through the GAS proxy. The relationship graph, study guides and Compare read public Pages JSON, so their gates are honest app-experience gates (same standing as Versions). Making any of them truly private is a data-relocation decision (the M3 pattern), not a gate tweak — this is written into both the `.gs` matrix comment and the rules file
- **Model choice for Classroom — build C0–C2 on Opus 5 at `xhigh`; do NOT spend the last 5% of the Fable allowance on C0.** Reasoning worth keeping: (a) the design gate already closed, so C0–C2 is spec-following, and the reasoning premium pays most on open-ended design; (b) this repo's highly prescriptive `CLAUDE.md` is the *documented* anti-pattern for Fable — the migration guide says prompts written for prior models "are often too prescriptive and reduce output quality," so getting Fable's benefit would mean re-tuning ~99 versions of gate system for a model affordable 5% of the time; (c) fast mode is Opus-only, Fable has none; (d) in this repo the verifiers catch errors, not model brilliance. Fable pricing is 2× Opus ($10/$50 vs $5/$25 per MTok), same 1M context and 128K output
- **Where Fable would actually earn it: C2** — and specifically the model that **runs as** the weekly authoring Routine (recurring, unattended, open-ended), not the one that *builds* the pipeline. That is a per-Routine model setting, and it is the choice that compounds
- Weekly Fable limit **resets Saturday 2026-09-05 07:00 AM EST**, so a full allowance will very likely be available by the time C2 is reached — the decision does not need making at C0

**Active context:**

- Branch `claude/dossier-analyst-access-fix-v437ym` · repo **v03.99r** · Profiler page **v01.75w** / GAS **v01.30g** · session ran as `claude-opus-5` at `effort_level: xhigh`
- Capacity: **repo CHANGELOG 99/100 — the next push rotates** (2026-08-27 date group, 20 sections, is the oldest); Profiler page changelog 49/50; Profiler GAS 30/50; Scraper GAS 37/50
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- Watch items: today's **Monday 2026-08-31 06:00 ET Scraper run** (first unattended corpus exercise — fires ~30 min after this save; the 8 project seeds should land in the Interests tab flagged "New topic") and the drift Routine's first fire **2026-09-01 ~9am PST** (expected: silent stand-down)

**Recommendation for next session:**

- Build **Classroom v1 C0** per `repository-information/PHASE6-CLASSROOM-DESIGN.md` — the scaffold half that remains (`setup-gas-project.sh` → Classroom app on the auth template, Classroom access matrix, masthead cross-links between the apps); the Profiler retune half is already shipped. Stay on Opus 5 at `xhigh`, and expect that push to rotate the repo CHANGELOG

**To continue:** type `build classroom v1`

## Previous Sessions

### Session — 2026-08-31 (Phase 5 learning layer built + Phase 6 Classroom design gate, v03.97r–v03.98r)

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

Developed by: LightAISolutions
