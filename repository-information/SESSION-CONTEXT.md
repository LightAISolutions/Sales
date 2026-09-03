# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-03 04:33 AM EST
**Repo version:** v04.42r (started at v04.41r — one push commit, `861a85b`, merged to `main` within minutes; plus this context write)
**Branch:** `claude/phase-a2-profiler-coverage-62yjq1` — restarted from `origin/main` (`git checkout -B … origin/main`) before this context commit because the workflow had merged and swept it
**Model:** Fable 5.1 xhigh — the second of the four Phase A anchor sessions

**What we worked on — Phase A2 of `PROFILER-COVERAGE-PLAN.md`, Piller Power Systems, dossier + study guide in one commit (v04.42r):**

- **`piller.profile.json`** — schema v7, profileVersion 1, `supplier`, intel-briefing: BLUF summary, six confidence-tagged key judgments, a dated INDICATORS TO WATCH bullet, collection gap stated. **Ten product lines** with all depth fields (SHIELDX; UB-V; UNIBLOCK UBT+/UBTD+/DeRUPS; the Isolated Parallel bus; POWERBRIDGE; Active Power CleanSource; CPM; M+ Series/APOSTAR/APOTRANS; converters, ground power, naval and Grid series; service and rental), **ten banded spec groups** quoted verbatim, Langley Holdings financials FY2023–H1 2026 with Langley's own guidance as the only expectations (private, unlisted — stated), the one Piller-level figure (2025 revenue €332M, +28%, per the Northeim chamber) carried as `kpi: revenue` at the researched 2025 EUR/USD average (1.1296, cited), 23 developments, nine relationships (Crusoe, Nebius, Tesla, Caterpillar, Bloom Energy, Vertiv, Schneider Electric, Eaton, ABB), three policy exposures, five decision makers, **185 sources at 64% first-party**
- **`piller.study.json`** — schema v2, **15 sections**: who owns the seconds; IEC 62040-3 grades (`table`); battery vs flywheel (`proscons`, with the 15 MJ ≈ 4.2 kWh arithmetic); static and rotary anatomy; DRUPS; static vs rotary (nine-row `table`); the stiff source; topologies to the isolated-parallel ring (`table`); the swinging load and the island; products table and single-unit-then-system `bars` ladder; `where-it-fails` aligned to §5 row 6 plus the rotary family's own failures; 14 flashcards; 10-item quiz. 131 `{{term}}` spans over 58 registry terms, no local glossary
- **24 shared concepts** registered (138 → 162): `autonomy`, `concurrent maintainability`, `coupling choke`, `DC link`, `distributed redundant`, `double conversion`, `DRUPS`, `eco-mode`, `excitation`, `fault current`, `flywheel`, `frequency converter`, `IEC 62040-3`, `IGBT`, `isolated parallel bus`, `low voltage`, `magnetic bearing`, `MTBF`, `power conditioning`, `rotary UPS`, `static bypass`, `static UPS`, `synchronous machine`, `VRLA`; the `UPS` definition widened from "battery-backed" to "a battery string or a spinning flywheel"
- **`study-prep/piller/piller-lesson-plan.md`** — five modules (the seconds and the classification; chemistry vs spinning steel; static, rotary and DRUPS anatomy; topologies, the ring and the stiff source; the catalogue against the chain, the ladder, who buys, who competes)
- **Bookkeeping**: registry entry after Panasonic + sync, graph 506 → 519 edges (13 touch `piller`), calendar row as `cadence: "quarterly"` with Langley's disclosure cadence in `source` (annual report early Feb, interim early Aug), README tree entries, §8 row A2 flipped to `v1 · v04.42r` / `✓ · v04.42r`. §6 register checks deliberately not re-run (phase-end)
- **Verification**: all three checkers clean plus a local schema-v7 validator (scratchpad, not committed); Playwright on localhost with a stubbed backend rendered nine dossier tabs and the full Study Guide (15 sections, 4 tables, 2 pros/cons, callout, 11 bars, 14 cards, 10 quiz items, 127 resolving tooltips), zero page errors

**Where we left off:**

- **A1 and A2 are done on `main`.** Next: **A3 Dominion Energy → A4 Vicor**, each on Fable 5.1 xhigh as `profiler <Company>` + `profiler prep <Company>` in one commit. **A3 carries the program's only page change**: add `utility` to `profiler-companies.json`'s `categories` (after `ipp` is the natural slot), to PROFILER-SCHEMA.md's category table (registry row and the intro list), and to `Profiler.html` — chip label, `.ov-tag` colour, `known` list, compare peer groups, `OV_REL_CAT_COLORS` — with a Profiler bump v01.80w → v01.81w, meta tag, a public-safe page changelog entry, and `verify-profiler-roles.py` re-run. Do not file Dominion under `ipp` or `other`
- **The xhigh test, second data point.** Where the extra reasoning visibly showed on A2: the Vineland contradiction (Langley never names the site; third parties tie it to DataOne/Nebius; WHYY reports the engine plan replaced by fuel cells) was surfaced, hedged everywhere it appears and made the low-confidence judgment rather than smoothed; the "flywheel and battery are complements, not substitutes" judgment came from reading Crusoe's dossier against the Bergen release; the guide's design (the seconds as a power problem in an energy costume, the ring drawn as impedance rather than logic, the same machine in five catalogue rows); source discipline (Microsoft, VoltaGrid, Wärtsilä left out of relationships; aggregator DRUPS-market figures spanning 10× left unused; the FX rate researched and cited). What it did not buy: research yield or schema compliance — the two agents ran 23 and 20 minutes and returned clean. Still no High-effort control; B1 is the natural one
- **Sequencing during agent waits worked again**: concepts, lesson-plan modules 1–4, 13 of 15 guide sections, the Playwright harness, README and ledger edits were all built while the agents ran, so post-report work was assembly and checks (~25 minutes). Repeat on A3 — for a utility, the company-independent half is the regulated-procurement concept chain (rate base and cost of service, IRP → CPCN → RFP, PJM capacity and transmission planning, large-load tariffs and minimum-demand contracts, interconnection studies and cost allocation, SCC dockets), which can be drafted before a single Dominion fact arrives
- **First-party sites**: piller.com served everything; langleyholdings.com HTML returned 503 but its PDFs downloaded; web.archive.org is blocked for WebFetch in this environment. Expect Dominion's IR site (investors.dominionenergy.com) and SCC dockets to be reachable; SEC EDGAR always is
- CHANGELOG at **95/100**; archive rotation fires above 100 — roughly five pushes out, inside Phase B. The earnings desk Routine and the weekly C2 pipeline remain live and unreviewed; sessions D and E of `IMPROVEMENT-PLAN.md` not started

**Key decisions and positions taken:**

- **Private, unit-level subject → `financials.type: "private"`, parent-group periods with the parent's own guidance as `expected`, verdicts against that guidance, and every "no consensus exists" stated in the row.** The one whole-company figure from an independent chamber-of-commerce report carries the KPI overlay; nothing at the parent or division level does
- **Piller-authored datasheets read from distributor mirrors carry `party: "company"`** explicitly, with the mirror flagged in the label and the canonical download page named — the words are the company's, the host is not
- **Calendar row is `cadence: "quarterly"`** (unit-level, no earnings clock) with the parent's disclosure cadence written into `source` so the desk knows when the next Piller-relevant document lands (~early Feb 2027)
- **A registry definition may be corrected when a new guide teaches something the old definition excluded** (UPS: battery-backed → battery or flywheel); recorded in the CHANGELOG as a Changed item
- **A data-only change still lists the Profiler page as an indirect affect** at its current version, no bump (per `profiler-app.md`)

**Active context:** `TEMPLATE_DEPLOY` Off · `MULTI_SESSION_MODE` Off · `CHAT_BOOKENDS` Off · Profiler `v01.80w` / `v01.34g` (no page or GAS version moved) · Classroom `v01.07w` / `v01.16g` · 91 dossiers · 64 study guides · concepts registry 162 · graph 519 edges · CHANGELOG 95/100 · no active reminders · TODO empty

**Recommendation for next session:**

- **Run Phase A3 — Dominion Energy — on Fable 5.1 xhigh** as a fresh session: `profiler Dominion Energy` then `profiler prep Dominion Energy`, one push commit, per `PROFILER-COVERAGE-PLAN.md` §3 and §7, **adding the `utility` category** (registry, schema, `Profiler.html` with a page bump) in the same commit. It closes the utility half of G5 that the guidance modules mention 30 times and no public source teaches, and it is the first public-company anchor, so the calendar row is a researched `nextReport` (Q3 2026 results, early November) rather than a cadence.
**To continue:** type `run Phase A3 of PROFILER-COVERAGE-PLAN.md — Dominion Energy — on Fable 5.1 xhigh`

## Previous Sessions

### 2026-09-03 — Phase A1 Caterpillar: dossier + study guide on Fable 5.1 xhigh (v04.41r)

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

Developed by: LightAISolutions
