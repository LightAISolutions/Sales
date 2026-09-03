# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-03 03:40 AM EST
**Repo version:** v04.41r (started at v04.40r — one push commit, `a39b4dd`, plus this context write)
**Branch:** `claude/caterpillar-phase-a1-profiler-gztswc` — the push merged to `main` within minutes and the workflow swept the branch; it was restarted from `origin/main` (`git checkout -B … origin/main`) before this context commit
**Model:** Fable 5.1 xhigh — the first of the four Phase A anchor sessions, and the developer's stated test of whether xhigh earns its cost over High on a dossier + study-guide pair

**What we worked on — Phase A1 of `PROFILER-COVERAGE-PLAN.md`, Caterpillar, dossier + study guide in one commit (v04.41r):**

- **`caterpillar.profile.json`** — schema v7, profileVersion 1, `supplier`, intel-briefing: BLUF summary, five confidence-tagged key judgments plus a dated INDICATORS TO WATCH bullet and a stated collection gap. Six product lines with all depth fields (C175/3516E/D1500 standby diesel; G3520 Fast Response, G3500K/H, CG260 and the 10 MW medium-speed restart for prime and bridge; Solar Turbines Titan 130/250/350, PGM 130, SMT130; Cat ESS and microgrid controls; ATC/EMCP/EGP switchgear; services and channel), seven banded spec groups quoted verbatim, FY2024–Q2 2026 vs consensus with the Power Generation line per period (+22% / +38% / +41% / +29%) and backlog $30B → $72.1B, 24 developments, nine curated relationships, three policy exposures, five decision makers, **127 sources at 46% first-party**
- **`caterpillar.study.json`** — schema v2, **16 sections, the first guide in the corpus to use the rich section kinds** (tables, proscons, callout, bars, flashcards, quiz): the concept chain from the grid dropping to the load being back, the gen-set-vs-bridge-plant boundary, a product-mapping table and a megawatts-per-machine ladder, a `where-it-fails` callout aligned to `CLASSROOM-CURRICULUM-PLAN.md` §5 rows 4 and 5, 12 flashcards, a 9-item quiz. 114 `{{term}}` spans over 43 registry terms, no local glossary
- **26 shared concepts** registered in `profiler-concepts.json` (112 → 138) per the developer's instruction, checked against terms and aliases, and written consistently with the five that Classroom's `bridge-power` lesson also defines locally
- **`study-prep/caterpillar/caterpillar-lesson-plan.md`** — five modules with a worked fleet-sizing example and the industry map
- **Bookkeeping**: registry entry + sync, graph rebuild (490 → 506 edges), calendar row (`nextReport` 2026-10-29, `confirmed: false` — no advisory yet; trackers split Oct 28 / Oct 29 / Nov 4), README tree entries, §8 row A1 flipped to `v1 · v04.41r` / `✓ · v04.41r`. §6 register checks deliberately not re-run (phase-end)
- **Verification**: all three checkers clean; Playwright on localhost with a stubbed backend rendered nine dossier tabs and the full Study Guide with zero page errors (the harness ignores the aborted Google sign-in script, as the roles verifier does)

**Where we left off:**

- **A1 is done on `main`.** Next in the plan: **A2 Piller Power Systems → A3 Dominion Energy → A4 Vicor**, each on Fable 5.1 xhigh as `profiler <Company>` + `profiler prep <Company>` in one commit. A3 carries the only page change of the program (the `utility` category in the registry, `PROFILER-SCHEMA.md` and `Profiler.html`)
- **The xhigh test has an answer but no control.** Where the extra reasoning visibly showed: mid-draft self-correction (an overstated gas-vs-diesel CO₂ claim reduced to roughly a quarter; the EPA 100-hour allowance stated only after verification), source discipline against the prompt's own "likely" list (Kiewit, VoltaGrid, Vantage, Eaton omitted — no source states a link), the guide's design (three nested clocks, one-engine-three-numbers, the products table keyed to moments in the event, the ladder), and analytical traps surfaced rather than smoothed (Rail-inclusive vs ex-Rail segment basis, the earnings-date disagreement). What it did not buy: research yield or schema compliance. A real comparison needs a High-effort guide — the first Phase B pair is the natural control
- **First-party sites block direct fetches from this environment** (cat.com, caterpillar.com, solarturbines.com returned 403/timeouts); Agent 1 worked around it through Caterpillar's catalog and CDN hosts, IR store, SEC filings and archived captures, and ran 38 minutes against a 12–18 minute budget. Expect the same on Piller
- CHANGELOG at **94/100**; archive rotation fires above 100 — roughly six pushes out, inside Phase B. The earnings desk Routine and the weekly C2 pipeline remain live and unreviewed; sessions D and E of `IMPROVEMENT-PLAN.md` not started

**Key decisions and positions taken:**

- **Thinner beats fabricated, applied literally.** Four relationships the prompt named as likely were left out because no source states them; fuel-consumption tables, an MW-delivered figure, LinkedIn URLs and a company-confirmed Q3 date were all omitted and said so in the CHANGELOG. Microsoft and Meta are typed `customer` as end users procured through developers, with the note saying so
- **A data-only change still lists the Profiler page as an indirect affect** (per `profiler-app.md`) — it went in AFFECTED URLS at its current version with no bump
- **New shared concepts go to the registry, not the guide's glossary**, and the registry definitions were written to agree with Classroom's lesson-local definitions where they overlap, so `{{term}}` resolves identically on both surfaces
- **The calendar date is chosen by cadence when trackers disagree** (Oct 29 matches Q3 2025), marked unconfirmed, with the disagreement written into `source` for the desk's confirm step
- **Sequencing during agent waits** — every company-independent artefact (concepts, technology sections, lesson-plan modules 1–4, the Playwright script, README and ledger edits) was built while the research agents ran, so the post-report work collapsed to assembly and checks. Worth repeating on A2–A4

**Active context:** `TEMPLATE_DEPLOY` Off · `MULTI_SESSION_MODE` Off · `CHAT_BOOKENDS` Off · Profiler `v01.80w` / `v01.34g` (no page or GAS version moved) · Classroom `v01.07w` / `v01.16g` · 90 dossiers · 63 study guides · concepts registry 138 · graph 506 edges · CHANGELOG 94/100 · no active reminders · TODO empty

**Recommendation for next session:**

- **Run Phase A2 — Piller Power Systems — on Fable 5.1 xhigh** as a fresh session: `profiler Piller` then `profiler prep Piller`, one push commit, per `PROFILER-COVERAGE-PLAN.md` §3 and §7. It closes the rotary/flywheel half of G3 that no guide in the corpus carries, and it is the most design-sensitive guide of the remaining anchors — the one where xhigh's guide-side advantage should show most clearly.
**To continue:** type `run Phase A2 of PROFILER-COVERAGE-PLAN.md — Piller — on Fable 5.1 xhigh`

## Previous Sessions

### 2026-09-03 — Profiler coverage plan approved: 65 companies + 30 guides ordered by model (v04.40r)

**Date:** 2026-09-03 02:29 AM EST
**Repo version:** v04.40r (started at v04.39r — one push commit, this one)
**Branch:** `claude/profiler-coverage-gaps-sg0mzu` — clean against `origin/main` at commit time; the branch did not exist on the remote, so no rebase and no restart were needed
**Model:** Fable 5.1 — a planning session, by the standing decision that planning runs on Fable and authoring on Opus 5. **That decision is now refined for dossier work** — see Key decisions

**What we worked on — a coverage analysis, an approved roster, and the plan file that carries it:**

- **Analyzed Profiler's coverage against Classroom's gap register** (`CLASSROOM-CURRICULUM-PLAN.md` §6, the twelve rows with the new `Status` column). Coverage stood at 89 dossiers / 62 study guides. Three structural findings the register did not state: the nine `ipp` dossiers — the entire BESS buyer side — carry **zero** study guides; the `investor` and `advisor` categories exist in the schema and have never held a company; there is no `utility` category at all
- **Counted corpus mentions of uncovered companies** across every dossier and guide, which is the strongest evidence of an ecosystem gap and surfaced names the register never listed: Digital Realty (13 docs), Blackstone (12), AEP (11 dossiers + 25 guidance hits), Anthropic (10 docs, 97 hits), MGX (10), Fluidstack (6), Intersect Power (6), Mitsubishi Power (6). Powin (13 docs) tops the list and is deliberately excluded — defunct, told inside FlexGen's dossier, excluded by the earlier v02.91r plan too
- **Recommended 65 companies in six tiers plus 30 study-guide passes**; the developer **approved all tiers** and chose to run the program by model — every Fable 5.1 xhigh session first, then Fable 5.1 High, then Opus 5 xhigh — and to return to the Classroom build only after the whole roster lands
- **Wrote `repository-information/PROFILER-COVERAGE-PLAN.md`** — the plan reorganized into that order: §2 model rule, §3 Phase A (4 anchors), §4 Phase B (29), §5 Phase C (32 + 30 guides), §6 Phase D (back to Classroom), §7 per-session bookkeeping and the paste-in prompt template, §8 the status ledger every session flips

**Where we left off:**

- **Nothing in Profiler has been built yet.** The plan is committed; the first dossier session is the developer's next action. Order: **A1 Caterpillar → A2 Piller → A3 Dominion → A4 Vicor** on Fable 5.1 xhigh, each as `profiler <Company>` + `profiler prep <Company>` in one commit; then Phase B (B1–B10) on Fable 5.1 High; then Phase C (C1–C12 plus the guide revisions and the 27 backfills) on Opus 5 xhigh; then Phase D
- **Session A3 (Dominion) carries a page change**: the `utility` category must be added to `profiler-companies.json`'s `categories`, PROFILER-SCHEMA.md, and `Profiler.html` (chip label, `.ov-tag` colour, `known` list, compare peer groups, `OV_REL_CAT_COLORS`) — a Profiler page version bump, the only page change in the program
- **The repo CHANGELOG is at 93/100.** Archive rotation fires above 100 — roughly seven pushes out, i.e. inside Phase B. Whoever lands that push does the rotation in the same commit
- The Classroom cut line (`redundancy-by-the-numbers`, `inside-the-rack`, the second wave) is **paused by the developer's decision** until Phase D. The earnings desk Routine and the weekly C2 pipeline remain live and unreviewed; sessions D and E of `IMPROVEMENT-PLAN.md` not started

**Key decisions and positions taken:**

- **Dossier work has its own model rule, layered on the standing decision.** Fable 5.1 xhigh only for the four anchors a future lesson will pin, as dossier + guide in one session; Fable 5.1 High for private/opaque subjects and the utilities (regulatory synthesis); Opus 5 xhigh for public companies with deep first-party records and for every study-guide pass on an existing dossier. Stated as judgment, not measurement — the repo has never compared dossier quality by model, and Phase A doubles as the test: if Caterpillar's guide on xhigh reads no better than High, demote A2–A4 before running them
- **Every company is a pair.** Classroom pins study guides, not dossiers, for equipment lessons (the §5 failure map is built from guides only). A dossier without a prep pass adds nothing to Classroom, so the plan never schedules one without the other, and the backfill of existing dossiers starts with the nine IPPs because the buyer side has no guides at all
- **Phase-end, not session-end, register checks.** A row in §6 is not closed until someone re-runs its check and dates it (last session's rule). The plan schedules that at the end of each phase and again in Phase D, and keeps the §8 ledger as the per-session record so the two never substitute for each other
- **Powin, Broad Reach, Boyd, Motivair, Prolec, Cupertino Electric and Calpine stay uncovered** — each is already told inside a covered parent's dossier. Wood Mackenzie and BNEF are ranking sources, not counterparties

**Active context:** `TEMPLATE_DEPLOY` Off · `MULTI_SESSION_MODE` Off · `CHAT_BOOKENDS` Off · Profiler `v01.80w` / `v01.33g` · Classroom `v01.07w` / `v01.16g` · concepts registry 112 entries · CHANGELOG 93/100 · no active reminders · TODO empty

**Recommendation for next session:**

- **Run Phase A1 — Caterpillar — on Fable 5.1 xhigh**, as a fresh session: `profiler Caterpillar` then `profiler prep Caterpillar`, one push commit, per `PROFILER-COVERAGE-PLAN.md` §3 and §7. It closes G2's first half, anchors the `backup-generation` lesson, and is the cheapest test of whether xhigh earns its cost over High on a dossier + guide pair before A2–A4 spend it.
**To continue:** type `run Phase A1 of PROFILER-COVERAGE-PLAN.md — Caterpillar — on Fable 5.1 xhigh`

Developed by: LightAISolutions
