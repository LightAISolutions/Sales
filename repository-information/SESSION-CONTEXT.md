# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-07 11:30:55 PM EST
**Repo version:** v05.11r — **two** push commits this session: `bdca7ac` (v05.10r, K1 — merged to `main`, branch deleted by the workflow) and this one (v05.11r, the taxonomy decision + the Phase 5 brief + this context), on `claude/k1-fable-5-1-high-y5wuyn`
**Branch:** `claude/k1-fable-5-1-high-y5wuyn`
**Model:** Fable 5.1 High — **K1 of `INTEGRATED-REMEDIATION-PLAN.md` §7 (the study-pool fix), then the developer's taxonomy review of `profiler-segments.json` (S0's "done when"), then the Phase 5 paste-in brief.**

### What was done

**K1 — v05.10r.** `clDrillStudyItems_()` in `Classroom.gs` reads each guide's top-level `flashcards[]` **and** every `sections[]` entry of kind `flashcards`, emitting the new item kind `ss:<slug>:<sectionId>:<n>` beside the unchanged `sf:`. **Study pool 766 → 1,920** (766 `sf:` + 1,154 `ss:`), verified by running the real builder under Node shims against the local Pages tree. `CL_DRILL_INV_CAP` 1200 → 2400; `CL_DRILL_ID_RE` admits `ss`; `CL_DRILL_SECTION_ID_RE` keeps ungradable section ids out of the pool. **One deviation from §10.7, forced by measurement:** the cache holds the compact `{ id: hash }` map (60,705 bytes) under the new key `cl_drillstudy_v2` and `clDrillStudyExpand_()` restores `{ kind, slug, hash }` on read — the full shape measured ~146 KB, past the 100 KB `CacheService` cap. `Classroom.html` resolves `ss:` from the fetched guide's sections; the drill card's source line links the company in Profiler and names the section. `CLASSROOM-SCHEMA.md` gains the `ss` identity row; `check-classroom-content.py`'s documented-cap assertion moved to 2400. Playwright read: landing card "0 of 1920 cards started", `ss:aep:drill:0` rendering its exact question and answer. Classroom **GAS v01.17g · page v01.08w**. No guide touched, no `sf:` id or `study:` pin moved. `gateDigest` untouched (no P3).

**Taxonomy review — v05.11r.** The developer chose **Option B** for `compute-and-the-rack`: fill it, not fold it. **AMD** (challenger to NVIDIA) and **Supermicro** (the rack/server OEM) are Phase E group **E7** in `PROFILER-COVERAGE-PLAN.md` §8/§10, both public → Opus 5 xhigh; Phase E is now nineteen companies / seven groups / eight sessions, E7 running with E1–E3 (below-floor segments first). Recorded in the registry's `notes` for the segment (no membership changed — the dossiers do not exist yet), curriculum plan §10.2 row 9 / §10.11 / §8 item 11 / §9 row, remediation plan §6 (S0's "done when" closed; S3 nineteen) and §7.2. The fold was rejected because NVIDIA and Flex already sit in `power-conversion-and-rack-power-silicon`, so a fold would only have deleted the load's own buying criteria.

**Phase 5 brief.** Written into `INTEGRATED-REMEDIATION-PLAN.md` **§7.6** on the §7.5 pattern — evaluation only, one decision per report, the Routine gate decided but not applied, the §5 caveat lifted or restated, §7.7 decisions and §7.8 Phase 6 brief to be written by that session; CHANGELOG rotation arithmetic for a later EST day included.

### Where we left off

v05.11r pushed as one commit. Nothing half-done. **Next: Phase 5 on Fable 5.1 xhigh — paste `INTEGRATED-REMEDIATION-PLAN.md` §7.6.** Then S1 (generator + Value Chain tracks + health checker + `reading-the-graph`), then Phase 6, per §7.4.

### Key decisions and findings

- **The §10.7 cache arithmetic was wrong** (~30 bytes/item assumed; ~76 measured). Compact map chosen over the spec's split-by-slug-initial fallback; the split stays documented as the next step past ~90 KB.
- **Profiler has no deep link to a study-guide section**, so the `ss:` source line links `Profiler.html#<slug>` and names the section as text.
- **Option B over A/C** for `compute-and-the-rack`; the "fold" was really a deletion since both members are already in power conversion.
- **The content checker hard-codes the documented cap** and must move with the schema; it caught the 1200 → 2400 change as designed.

### Active context

- **Branch:** `claude/k1-fable-5-1-high-y5wuyn` · **repo version:** v05.11r · **Profiler page:** v01.83w · **Classroom page:** v01.08w · **Classroom GAS:** v01.17g
- **Corpus:** 154 companies / 154 profiles / 154 study guides / 1,210 concepts / 1,260 edges (built 2026-09-07) / 9 named projects / 8 guidance modules / 4 reports; 19 segments / 283 memberships; **drill study pool 1,920**
- **Classroom live:** 10 lessons · 3 tracks · 134 gate cases · `check-classroom-content.py` 0/0 · pipeline no P3 · selftest 13/0
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 111 sections, 13 dated 2026-09-07.** Same EST day → 112 − 14 = 98 → no rotation. **A later EST day → 112 non-exempt → ROTATION FIRES**; oldest whole date group is the **thirteen** `2026-09-01` sections (`v04.01r`–`v04.13r`) → 99. `git fetch --unshallow` MUST run before any SHA lookup; budget ~10 extra minutes.
- **Checker state:** content 10/3/134 0/0; pipeline P1/P2 noise on developer commits, no P3; reports **0 errors / 7 warnings** (hithium v13 ×3, sungrow v9, catl v7 ×2, zhonhen v7 — `report-pins-verified.json` untouched).
- **Plan ledger (`INTEGRATED-REMEDIATION-PLAN.md` §6):** 0 · 1 · 2a · 2b · 3 · S0 Done (v05.09r, "done when" closed v05.11r) · **K1 Done (v05.10r)** · **5 next** · S1 · 6 · S3 (0/19) · G6 (ready) · C3 · S2 (0/19) · 4 (0/26) · K2 · C5 · C6 deferred.
- **Standing, unassigned:** `archive/nvidia.profile.v2.json` missing and unreconstructable; OSHA IMIS, SEC EDGAR, primedatacenters.com and web.archive.org network-blocked; `huawei`'s FCC `policyExposure` entry over the 900-char convention; do not act on the `named-project` report's whitespace call until Phase 5 restates it; the stale "802 of ~855" figures were rewritten in `Classroom.html`'s drill comment, and `CLASSROOM-SCHEMA.md` line "855 items × a scheduling row" (the C4 sizing argument) was left as history.

### Recommendation for next session

- Run **Phase 5 on Fable 5.1 xhigh**: open `INTEGRATED-REMEDIATION-PLAN.md` §7.6 and paste the blockquote as the opening prompt — the report-strategy evaluation (one decision per report, the Routine gate, the §5 caveat), writing §7.7 and the Phase 6 brief §7.8, no report authored.

**To continue:** type `run Phase 5`

## Previous Sessions

**Date:** 2026-09-07 07:24 PM EST
**Repo version:** v05.09r — **one** push commit this session (S0 + this context, the v05.08r precedent), on `claude/s0-segment-design-gate-y8us8d`
**Branch:** `claude/s0-segment-design-gate-y8us8d`
**Model:** Fable 5.1 xhigh — **S0 of `INTEGRATED-REMEDIATION-PLAN.md` §7: the segment-layer design gate.** Design only: registries, specs and plan sections. No lesson authored, no generator code, no dossier / guide / report / `report-pins-verified.json` touched, `Classroom.gs` and `Profiler.gs` untouched, no registry sync or graph rebuild, §6 register not re-run beyond the G6 wording.

### What was done

**The segments registry — `live-site-pages/profiler-data/profiler-segments.json` (schema v1).** Nineteen segments in chain order across four tiers (supply · build · demand · services), each with a definition, buying criteria, notes and members. **283 memberships across all 154 dossiers, none unassigned**, every one verified against the company's own `ecosystemRole` / `productsAndServices` (never the registry category) with a `basis` line quoting the dossier. Roles: incumbent / challenger / adjacent, self-described in the file with the floor rule. **Floor at S0: sixteen at it, three below** — `assurance` (2·0·2) and `insurance-and-risk-transfer` (0) as §7.2 predicted, **and `compute-and-the-rack` (NVIDIA + Flex only), which §7.2 counted above the floor and the dossiers do not support**. `software-and-optimization` is not at zero (FlexGen incumbent, Fluence's Mosaic/Nispera challenger) but its landscape waits for S3 batch 1. Taxonomy strains recorded in the registry's `notes` and in the curriculum plan §10.11 for the developer's review — the one S0 "done when" clause a session cannot close.

**Schema and rules.** `PROFILER-SCHEMA.md`: a "Segments registry" section, the `companies[].segments[]` mirror row (sync-script change is S1's), the revision-signals section extended. `profiler-app.md`: Profiler Command step 5 gains the segment assignment (same commit, dossier not category, unassigned rather than guessed). `CLASSROOM-SCHEMA.md` content contract amended (mechanism: never trivia; segment lessons may drill structure; roster deck opt-in and separate); `classroom-app.md` gains the matching section (generator writes segment lessons; the pipeline never revises one). `industry-guidance.md`: the landscape-module exception to the 2026-08-29 content-scope rule, recorded so the two rules do not contradict.

**Curriculum plan.** **§10 added** — five-layer model, floor rule with the S0 floor table, segment-lesson template (ten fixed section ids, all-public stamp of every member `profile:` + `graph:` + `concepts:`, `reviewBy` from the fence), generator spec (`scripts/build-classroom-segments.py` — deterministic, regenerate only what moved, developer-session tool, no P3 by construction), the fourth lane's three tracks (`value-chain-makers` 4 · `value-chain-builders` 7 · `value-chain-buyers-and-backers` 9, contiguous position ranges, `reading-the-graph` as opener — S1 authors it), landscape-module spec (guidance shape, contributor tier, claims ledger citing `profile:` at `profileVersion`), K1 (`ss:` item kind, pool builder not lift), K2 (roster deck `rc:`), health script, two role paths, 10.11 review notes. **§3** two specs: `reading-the-numbers` (`market-access` 4) and `interconnection-for-large-loads` (`aidc-grid-to-chip` 2, the G6 lesson). **§7** rows 25–26; positions re-numbered. **§4** re-numbered (built ids untouched). **§6** G6 re-classified as research synthesis, Opus 5 xhigh, no longer developer-blocked (trail kept, S0 note appended). §2.2/§2.3/§8/§9 updated. Curriculum: **36 authored + the opener = 37; 10 built · 26 remaining; 19 generated segment lessons in the fourth lane.**

**Coverage plan.** **§10 Phase E** (seven sessions E1a–E6 by default) and **seventeen §8 rows** with proposed slugs, categories, segment · role hypotheses, models per §7.2, and the chat's notes verbatim in `Why`. Remediation plan §6: S0 Done (v05.09r); **K1 and Phase 5 next** (either order); S1/S3/G6/Phase 4 rows point at the specs.

### Where we left off

v05.09r pushed as one commit. Nothing half-done. **Next: K1 (Fable 5.1 High, spec §10.7) or Phase 5 (Fable 5.1 xhigh, the report-strategy evaluation) — either order; S1 (generator + tracks + checker + `reading-the-graph`) after Phase 5 per §7.4.** The developer's taxonomy review of `profiler-segments.json` (especially `compute-and-the-rack`) can happen at any time and changes nothing in the run order.

### Key decisions and findings

- **Roles follow the dossier's characterisation, not geography** — CRRC and HyperStrong are integrator incumbents with no US channel; the basis says so; the landscape carries the US reading.
- **The role vocabulary strains on the demand tier** and the strain is written into `basis`: the AI labs are hyperscaler `challenger`s (new buyers), the utilities' challengers are the competitive retailers (NRG, Vistra), Galaxy is a landlord challenger despite being a broker-dealer.
- **The three Value Chain tracks are contiguous position ranges (1–3, 4–10, 11–19)**, not tier-balanced — each reads as one stretch of the chain; 4/7/9 lessons.
- **K1 decided: pool builder, not lift script** — lifting would touch 95 public guides and move every `study:` pin.
- **Checker behaviour on a stale `origin/main` ref**: `check-classroom-pipeline.py` showed 767 findings on a clean tree until `git fetch origin main` (a forced update); after the fetch, "nothing changed". Fetch before trusting the pipeline checker.

### Active context

- **Branch:** `claude/s0-segment-design-gate-y8us8d` · **repo version:** v05.09r · **Profiler page:** v01.83w · **Classroom page:** v01.07w · **Classroom GAS:** v01.16g (all unchanged — no page affected; the registry has no consumer until S1)
- **Corpus:** 154 companies / 154 profiles / 154 study guides / 1,210 concepts / 1,260 edges (built 2026-09-07) / 9 named projects / 8 guidance modules / 4 reports; **19 segments / 283 memberships (new)**
- **Classroom live:** 10 lessons · 3 tracks · 134 gate cases · `check-classroom-content.py` 0/0
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 109 sections, 11 dated 2026-09-07.** Same EST day → 110 − 12 = 98 → no rotation. **A later EST day → 110 non-exempt → ROTATION FIRES**; oldest whole date group is the **thirteen** `2026-09-01` sections (`v04.01r`–`v04.13r`). `git fetch --unshallow` MUST run before any SHA lookup; budget ~10 extra minutes.
- **Checker state:** content 10/3/134 0/0; pipeline "nothing changed" on a clean fetched tree, P1 noise on plan-file commits, no P3; reports **0 errors / 7 warnings** (hithium v13 ×3, sungrow v9, catl v7 ×2, zhonhen v7 — all left loud, `report-pins-verified.json` untouched). Graph digest unchanged.
- **Plan ledger (`INTEGRATED-REMEDIATION-PLAN.md` §6):** 0 · 1 · 2a · 2b · 3 · **S0 Done (v05.09r)** · **K1 next** · **5 next** · S1 · 6 · S3 (0/7) · G6 (ready) · C3 · S2 (0/19) · 4 (0/26) · K2 · C5 · C6 deferred.
- **Standing, unassigned:** `archive/nvidia.profile.v2.json` missing and unreconstructable; OSHA IMIS, SEC EDGAR, primedatacenters.com and web.archive.org network-blocked; `huawei`'s FCC `policyExposure` entry over the 900-char convention; do not act on the `named-project` report's whitespace call until Phase 5.

### Recommendation for next session

- Run **K1 on Fable 5.1 High** from the curriculum plan §10.7: `clDrillStudyItems_()` reads every `flashcards`-kind section under a new `ss:<slug>:<sectionId>:<n>` item kind, `CL_DRILL_INV_CAP` → 2400, the schema's item-identity table gains the `ss` row, `Classroom.html` resolves `ss:` from the fetched guide; both checkers, `node --check`, `check-classroom-pipeline.py --base origin/main` (refresh `gateDigest` only if P3), Playwright read of the drill showing ≈1,920 study items; GAS + page bump. Phase 5 is the equally valid alternative if a Fable xhigh session is what is open.

**To continue:** type `run K1`

Developed by: LightAISolutions
