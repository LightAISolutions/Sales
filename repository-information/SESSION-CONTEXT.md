# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-08 12:00:01 AM EST
**Repo version:** v05.12r — one push commit on `claude/phase-5-report-evaluation-cs27yo`
**Branch:** `claude/phase-5-report-evaluation-cs27yo`
**Model:** Fable 5.1 xhigh — **Phase 5 of `INTEGRATED-REMEDIATION-PLAN.md` §7 (the report-strategy evaluation, F10 / F11), evaluation only.**

### What was done

**Phase 5 — v05.12r.** A written decision per report in the plan's new **§7.7**: all four reports **re-scoped and regenerated**, none retired, none regenerated as-is — the defect is scope, not fact. `named-project-bess-attach` → the live project web (24 dossiers pinning 9 projects, plus `tesla` cited through `xai`; River Bend and ten new participants missing from the 15-company edition). `grid-scale-bess` → the registry's integrator incumbents + challengers (18) plus `flexgen` as the adjacent comparator; `eve-energy` out (cells / in-hall per the registry). `s154-listed-bess-suppliers` → the statutory six (`gotion` added; `rept`'s not-named record as a limitation). `aidc-power-conversion` → the covered 800 VDC roster **by layer** (15: silicon, rack, sidecar/SST, facility + grid tier; `huawei` out on the stated reason). The seven checker warnings read again against what each report cites — every cited figure holds; none re-pinned. **The drift-gated monthly Routine's gate is REPLACED** (recorded only — the developer applies it): keep monthly / fresh session / opportunity-series-only; replace the ≥10-versions-moved count with any of (a) an indicator fired, (b) scope drift — a project the edition does not cover, or the project-pinning set differing from `scope.value` by ≥3, (c) ≥5 scoped dossiers with a development absent from the archived pinned version. Evidence: 13 of 15 scoped dossiers already past their pins while 0 of 15 carry a development since the edition — the gate trips on housekeeping and would have missed F10. **The §5 caveat is RESTATED** as *supplier* whitespace (storage is in the plan at Lighthouse and Project Jupiter; no supplier named anywhere but Trimount and Colossus); it lifts with Phase 6 session 1. **§7.8** carries three Phase 6 paste-in briefs (sessions: named-project → grid-scale + §154 → AIDC). §6 Phase 5 Done / Phase 6 next with the order; §7.1 and §7.4 updated.

### Where we left off

v05.12r pushed as one commit. Nothing half-done. **Next: Phase 6 session 1 on Opus 5 xhigh — paste `INTEGRATED-REMEDIATION-PLAN.md` §7.8 "Session 1"** (the named-project edition, before the Routine's 2026-10-01 fire). Then S1 (§7.4 puts Phase 5 → S1 → Phase 6; Phase 6 sessions 2–3 wait on desk refreshes and can interleave with S1).

### Key decisions and findings

- **Overlays cannot reach a landscape from a Phase 6 edition** — `guidanceOverlays[]` live in the report and must name a module that exists in `Profiler.gs`, so the "reports feed the landscapes' admin extras" sequencing is resolved as: Phase 6 editions overlay the existing eight modules; S2 landscapes cite the edition id in their claims ledger; the overlay onto a landscape arrives with the *next* edition after S2 (§7.7 finding 8).
- **`s154-listed-bess-suppliers--risk--2026-08-29.report.json` was edited after publication** at v04.94r (commit `e1324c7`, its `scope.rationale`) — an immutability breach the checker cannot see; recorded, not reverted; Phase 6's supersession moots it; restoring the published text is the developer's call.
- **The earnings desk is leaving rows overdue**: `sinexcel` (08-11), `eve-energy` (08-20), `iren` and `jinko` (08-27), `byd` (08-29); the 7 Sep run `SUCCEEDED` in 19 minutes with no commit. Three of those are report indicators — Phase 6's preflight inherits them (refresh first or state the staleness). `megmeet` / `zhonhen` H1 2026 interims are also absent, with rows dated 30 Oct.
- **No Phase E row changes any report's answer** (E6 is cells, E7 is the load).
- **Until the Routine's gate is changed, the 2026-10-01 fire authors an edition on churn** unless Phase 6 session 1 lands first — land it, or pause the Routine.

### Active context

- **Branch:** `claude/phase-5-report-evaluation-cs27yo` · **repo version:** v05.12r · **Profiler page:** v01.83w (unaffected) · **Classroom page:** v01.08w · **Classroom GAS:** v01.17g
- **Corpus:** 154 companies / 154 profiles / 154 study guides / 1,210 concepts / 1,260 edges / 9 named projects / 8 guidance modules / 4 reports (all current; 3 to be superseded per session) / 19 segments / 283 memberships / drill pool 1,920
- **Classroom live:** 10 lessons · 3 tracks · 134 gate cases · `check-classroom-content.py` 0/0 · pipeline no P3
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG:** **99 sections, 1 dated 2026-09-08** (the thirteen 2026-09-01 sections rotated at v05.12r). Same EST day → 100 − 2 = 98 → no rotation. **A later EST day → 100 non-exempt → ROTATION FIRES** on the twenty-one `2026-09-02` sections (`v04.14r`–`v04.34r`) → 79; budget ~10 extra minutes. `git fetch --unshallow` MUST run before any SHA lookup.
- **Checker state:** reports **0 errors / 7 warnings** (hithium v13 ×3, sungrow v9, catl v7 ×2, zhonhen v7 — `report-pins-verified.json` untouched, no report file edited); content 10/3/134 0/0; pipeline P1 on the plan file only.
- **Plan ledger (§6):** 0 · 1 · 2a · 2b · 3 · S0 · K1 · **5 Done (v05.12r)** · **6 next** (three sessions, §7.8) · S1 · S3 (0/19) · G6 (ready) · C3 · S2 (0/19) · 4 (0/26) · K2 · C5 · C6 deferred.
- **Standing, unassigned:** `archive/nvidia.profile.v2.json` missing and unreconstructable; OSHA IMIS, SEC EDGAR, primedatacenters.com and web.archive.org network-blocked; `huawei`'s FCC `policyExposure` entry over the 900-char convention; the v04.94r edit of the §154 report file; the overdue desk rows above.

### Recommendation for next session

- Run **Phase 6 session 1 on Opus 5 xhigh**: paste the "Session 1" blockquote from `INTEGRATED-REMEDIATION-PLAN.md` §7.8 — the named-project opportunity edition (25 in scope, `supersedes` the 2026-08-30 id, the 13 superseded pin rows removed), landed before the Routine's 2026-10-01 fire.

**To continue:** type `run Phase 6 session 1`

## Previous Sessions

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

Developed by: LightAISolutions
