# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-07 05:01 PM EST
**Repo version:** v05.08r — **two** push commits this session: `184416c` (v05.07r, Phase 3 — merged to `main`, branch deleted by the workflow) and this one (v05.08r, the program extension + this context)
**Branch:** `claude/phase-3-curriculum-review-8pj5lw` (fast-forwarded to `origin/main` after the v05.07r merge, which freed push-once for the second push)
**Model:** Fable 5.1 xhigh — **Phase 3 of the integrated remediation plan (F12), then the developer's review of it, which produced the program extension in `INTEGRATED-REMEDIATION-PLAN.md` §7.** No lesson authored, no track created, no dossier/guide/report touched, Classroom.gs untouched.

### What was done

**v05.07r — Phase 3, the curriculum re-plan.** `CLASSROOM-CURRICULUM-PLAN.md` §1 re-verified from the filesystem and re-dated (154 dossiers / 154 guides / 1,210 concepts / 1,260 edges / 8 modules / 9 projects / 4 reports; Classroom 10 lessons / 3 tracks / 134 gate cases; 26 of the 56 built-lesson pins have moved). All eight §2.2 exclusions re-tested with a written reason: **nuclear reversed** as a public `clean-firm-power`; **utility reversed as a split** (public `how-a-utility-buys` carries the machinery the six utility guides cover section by section, `utility-procurement-meets-ai-load` stays guidance-gated as the playbook); **cooling cap kept**, lesson deepened on `coolit`/`trane-technologies`; five kept. **§2.3 added**: the remediation plan's skeleton counted "20 remaining" but named four register unlocks (`backup-generation`, `the-ups-room`, `how-a-utility-buys`, `clean-firm-power`) that §3 never specified — all four admitted, so the curriculum is **34 lessons / 10 built / 24 remaining**. §3 four new specs + input notes on twenty specs; §4 rebuilt; **§7 re-ranked as the 24-row Phase 4 order with stamps and reasons** (`four-machines` first, it creates `electrical-foundations`; `how-a-utility-buys` second, creates `market-access`; guidance lessons last, rows 23–24 gated on the bankability module's review due 2026-10-01); §8 updated; §9 revision log added. Remediation plan §6: Phase 3 Done, Phase 4 0 of 24 → then 0 of 26 (below).

**Found in Phase 3:** the drill's study pool (`clDrillStudyItems_`) reads a guide's top-level `flashcards[]` only; the 95 guides authored since September carry 1,154 cards in a `flashcards` *section* the pool never sees → **K1**.

**v05.08r — the program extension (developer review of Phase 3, same day).** Proposal made and approved: Classroom gains a generated **segment layer** (one public segment lesson per value-chain segment from registry + dossiers + graph, regenerated when members move) and a **landscape layer** (one contributor-tier module per segment, Opus-authored in guidance shape). Three fences moved with approval: the content contract amended (segment lessons may drill structure; roster deck opt-in), landscapes at **contributor** tier, and **segments become a registry layer** (`profiler-segments.json`) the Profiler Command must populate. Taxonomy: the seventeen proposed segments **plus** software-and-optimization and insurance-and-risk-transfer as new segments, testing-and-certification **merged with advisors as "assurance"**, upstream materials and transmission developers as adjacent roles → **nineteen segments**. **Seventeen dossiers approved for S3** (hypotheses to verify): Stem · Habitat Energy · Gridmatic; Marsh · Aon · kWh Analytics; UL Solutions · CSA Group · Intertek; Albemarle · Mitra Chem (ICL alternate, Nano One fallback) · Novonix (Syrah Vidalia alternate, Westwater Kellyton alternate); Grid United · Pattern Energy; CALB · Cornex · Great Power. **G6 reclassified**: research-synthesis accepted on the G4 precedent (six of eight modules have no ingested document) — Opus 5 xhigh, one session, no longer developer-blocked. Everything persisted in **`INTEGRATED-REMEDIATION-PLAN.md` §7** (7.1 what landed vs the original plan, 7.2 decisions, 7.3 run order with model/effort per phase, 7.4 sequencing, **7.5 the paste-in brief for S0**) and the §6 ledger (S0 next; K1, S1, S3, C3, S2, K2, C5, C6 rows added; Phase 4 0 of 26; Phase 5/6 moved before S2; G6 row rewritten).

### Where we left off

v05.08r pushed. **The next unit of work is S0 on Fable 5.1 xhigh** — the segment-layer design gate — with the brief in `INTEGRATED-REMEDIATION-PLAN.md` §7.5. Nothing is half-done. K1 (the study-pool fix, Fable 5.1 High) can run before or after S0.

### Key decisions and findings

- **34 mechanism lessons is the right size for the mechanism layer; the market-structure layer was missing entirely** and cannot be hand-authored at 154+ companies — it is generated from the dossiers (every one carries `strategyRead` and `financials`; 126 carry `policyExposure`), with a human-authored judgment layer on top.
- **Phase 4 is 26 sessions, not 20**: the four unlocks the skeleton never specified, plus `reading-the-numbers` (row 25) and the G6 lesson (row 26). `reading-the-graph` is authored inside S1.
- **Phases 5 and 6 move before S2** — landscape modules cite the reports for admin extras, so F10/F11 staleness must not propagate.
- **~73 sessions from here** (C6 excluded): ~50 Opus 5 xhigh, ~12 Fable 5.1 High, 4 Fable 5.1 xhigh.
- **Checker behaviour on plan-only commits:** `check-classroom-pipeline.py` reports P1 findings on edited plan files (expected noise per classroom-app.md); no P3. Content checker and report checker identical before and after.

### Active context

- **Branch:** `claude/phase-3-curriculum-review-8pj5lw` · **repo version:** v05.08r · **Profiler page:** v01.83w · **Classroom page:** v01.07w · **Classroom GAS:** v01.16g (all unchanged — documentation only)
- **Corpus:** 154 companies / 154 profiles / 154 study guides / 1,210 concepts / 1,260 edges (built 2026-09-07) / 9 named projects / 8 guidance modules / 4 reports (0 superseded); registry categories 12 (11 populated: advisor 2, investor 5, utility 6, …)
- **Classroom live:** 10 lessons · 3 tracks (`bess-foundations`, `aidc-grid-to-chip`, `aidc-campus`) · 134 gate cases · `check-classroom-content.py` 0/0
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 108 sections, 10 dated 2026-09-07.** Same EST day → 109 − 11 = 98 → no rotation. **A later EST day → 109 non-exempt → ROTATION FIRES**; oldest whole date group is the **thirteen** `2026-09-01` sections (`v04.01r`–`v04.13r`). `git fetch --unshallow` MUST run before any SHA lookup; budget ~10 extra minutes.
- **Checker state:** reports **0 errors / 7 warnings** (hithium v13 ×3, sungrow v9, catl v7 ×2, zhonhen v7 — all left loud, `report-pins-verified.json` untouched) / 31 quiet. Content 10/3/134 0/0. Pipeline: "nothing changed" on a clean tree; P1 noise on plan-file commits. Graph digest `bf085b3f790f785a331a85b134513b23bbf25f3703ae9ea9ebd3b3a7dc27aa08`.
- **Plan ledger (`INTEGRATED-REMEDIATION-PLAN.md` §6):** 0 · 1 · 2a · 2b · **3 Done (v05.07r)** · **S0 next** · K1 · 5 · S1 · 6 · S3 (0/6–7) · G6 (research-based) · C3 · S2 (0/~19) · 4 (0/26) · K2 · C5 · C6 deferred. Run order and critical path: §7.3–7.4.
- **Standing, unassigned:** `archive/nvidia.profile.v2.json` missing and unreconstructable; OSHA IMIS, SEC EDGAR, primedatacenters.com and web.archive.org network-blocked; `huawei`'s FCC `policyExposure` entry over the 900-char convention; do not act on the `named-project` report's whitespace call until Phase 5.

### Recommendation for next session

- Run **S0 on Fable 5.1 xhigh** by pasting `INTEGRATED-REMEDIATION-PLAN.md` §7.5 as the opening prompt: it writes `profiler-segments.json` (nineteen segments, memberships verified against each dossier's `ecosystemRole`), curriculum plan §10 and rows 25–26, the content-contract amendment, the registry `segments[]` schema and Profiler Command step, the coverage plan's Phase E ledger for the seventeen approved dossiers, and the corrected G6 row — design only, no code, no lesson, no dossier.

**To continue:** type `design the segment layer`

## Previous Sessions

**Date:** 2026-09-07 06:00 AM EST
**Repo version:** v05.06r — **one** push commit this session (`4a22d7f`), merged to `main` as `e31afca`, plus this housekeeping commit
**Branch:** `claude/phase-2b-tract-pdc-citations-e2i2io` (fast-forwarded to `origin/main` after the merge; the workflow had deleted the remote branch, which freed push-once for this second push)
**Model:** Fable 5.1 High — **Phase 2b of the integrated remediation plan: the `tract` ↔ `prime-data-centers` citation read (F9).** No new research, no report edit, no other dossier touched.

### What was done

**v05.06r — Phase 2b. Two dossiers moved, both archived, `lastUpdated` 2026-09-07.** Every cited page on both sides was opened (curl through the proxy; Austin Monitor via WebFetch). The hypothesis — USD 4bn is a build-out total, USD 400m a phase 1 — held with one correction: **the total is a nine-building figure from 2024, not an eight-building one.**

- **What the sources say.** The Muskin Elam page behind `tract`'s USD 4bn is **dated** (`datePublished` 2025-05-08) and is a reprint of Justin Sayers's Austin Business Journal report — "across the street from a $4 billion data center campus project by Dallas-based Prime Data Centers LLC", **no scope stated**. The primary is the **Caldwell County Commissioners Court special meeting of 12 March 2024** (Hays Caldwell EDP 2024-03-13, Post Register 2024-03-20, echoed verbatim by the Caldwell DCAT tracker — all three already in Prime's `sources[]`): phase 1 **$1.3 billion for 3 buildings** (780,000 sq ft), **nine data centers across three phases**, **$4.2 billion at full buildout**, 10-year 100% abatement with a ~40% PILOT (~$840,000/yr). Texas filing **TABS2026019473** (registered 2026-05-05, read live) restates phase 1 as two 380,000 sq ft **shell** buildings, 760,000 sq ft, **$400,000,000**, June 2026–September 2027, owner Lockhart Property, LLC, Gensler. Baxtel's Prime Austin page (live) carries the current master plan: 206 acres, **eight buildings, 2 million sq ft**, phase 1 "provisionally pegged at $1.3 billion and 144 MW across three buildings" before the two-building filing. Austin Monitor and GovTech Insider mention neither Prime nor any dollar figure; Baxtel's Caldwell Valley page gives only the 1.43-mile distance.
- **`tract` v3 (v2 archived).** Nothing deleted. Edge note, edge context and `productsAndServices[2].highlights[0]` now state both figures with their scopes and the ABJ attribution. Muskin Elam dated 2025-05-08, relabelled, and moved from the undated tail into chronological position (edge `source` URL unchanged); TDLR (2026-05-05), Post Register (2024-03-20), Hays Caldwell EDP (2024-03-13) and Baxtel Prime Austin (undated) added. `srcTotal` 151 → 155.
- **`prime-data-centers` v3 (v2 archived) — step 7 in reverse.** Prime cited the county primary three times but never stated USD 4.2bn; the campus record, the `tract` edge and the H1 2026 "Campus investment claims" row now state USD 1.3bn (2024 phase 1), USD 4.2bn (2024 full build-out, nine buildings) and USD 400m (2026 two-shell phase 1) with their vintages, and say **no source restates a full-build-out total for the eight-building / 384 MW plan**. Muskin Elam added. `srcTotal` 172 → 173.
- **Both relationship scopes kept under the crossref checker's 900-char joined cap** (`tract` rel[2] 860, Prime rel[5] 892) so the pair is examined; the checker joins every string in the relationship object, so note + context + URL must fit together.
- **Records:** plan §6 Phase 2b → **Done — v05.06r**, Phase 3 marked next. README tree gained four archive entries — the two new v2 files **and the two v1 files missing since v05.00r**. CHANGELOG: no rotation (106 sections, 8 dated today → 98 non-exempt).

### Where we left off

v05.06r pushed and merged; this housekeeping push carries the session context. Phases 0, 1, 2a and 2b are closed in the plan. **The next unit of work is Phase 3 on Fable 5.1 xhigh** — the curriculum re-plan and skeleton review (F12) — and a paste-in prompt was handed over in chat. Nothing is half-done.

### Key decisions and findings

- **A "USD 4bn vs USD 400m disagreement" was two true figures for different scopes and different years** — and the plan's own hypothesis (eight-building total) was slightly wrong: the total belongs to the superseded nine-building plan. Reading the primary, not just the citing page, is what surfaced that.
- **Prime's dossier held the primary source and never used it.** Citing a page is not stating its figure; step 7 has to run in both directions.
- **Undated ≠ undated.** The Muskin Elam page carried `datePublished` in its metadata; a source that looks evergreen should be checked for article metadata before it is filed as undated.
- **Two cited pages are unreachable from this environment:** Prime's own site (403 on every path) and the Wayback Machine (connection reset through the proxy — Wayback, not the target, is what fails). Austin Business Journal originals are paywalled; the reprint is the verifiable text.

### Active context

- **Branch:** `claude/phase-2b-tract-pdc-citations-e2i2io` · **repo version:** v05.06r · **Profiler page:** v01.83w (unchanged — data-only)
- **Corpus:** 154 companies / 154 profiles / 154 study guides / 1,210 concepts / 9 named projects / 8 guidance modules / 4 reports (0 superseded); `tract` 3, `prime-data-centers` 3
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 106 sections, 8 dated 2026-09-07.** Same EST day → 107 − 9 = 98 → no rotation. **A later EST day → 107 non-exempt → ROTATION FIRES**; oldest whole date group is the **thirteen** `2026-09-01` sections (`v04.01r`–`v04.13r`). `git fetch --unshallow` MUST run before any SHA lookup; budget ~10 extra minutes.
- **Checker state:** reports **0 errors / 7 warnings** (hithium v13 ×3, sungrow v9, catl v7 ×2, zhonhen v7 — all left loud, `report-pins-verified.json` untouched) / 31 quiet. Crossrefs 0 candidates / 21 over-cap scopes / accept list 12. Relationships 0 findings / accept list 10. Study 0/0. Registry 154, calendar bijection clean. Graph digest `bf085b3f790f785a331a85b134513b23bbf25f3703ae9ea9ebd3b3a7dc27aa08` (1,260 edges / 950 curated / 3,677 evidence).
- **Plan ledger (`INTEGRATED-REMEDIATION-PLAN.md` §6):** Phase 0 Done (v05.02r/v05.03r) · 1 Done (v05.04r) · 2a Done (v05.05r) · **2b Done (v05.06r)** · **3 next** · 4 (0/20), 5, 6, G6 open.
- **Phase 3 inputs, mapped:** plan §2 row 3 ("done when": §1 re-dated; each §2.2 exclusion kept or reversed with a written reason; the 20-lesson remaining list re-ordered and recorded in the curriculum plan's §7), §3 paragraph, §4 skeleton (3 lanes · 5 tracks · 30 lessons · 10 built · 20 remaining; the three contradicted exclusions — nuclear/SMR vs `x-energy`+`oklo`, cooling vs `coolit`, `utility-procurement-meets-ai-load` vs six `utility` dossiers). `CLASSROOM-CURRICULUM-PLAN.md` §1 (verified 2026-09-02 against 89 dossiers), §2.2 exclusions, §6 gap register (G6 the only structural open row), §7 cut line (first five built; second wave of 7 and third wave listed), §8 item 9 (track edits are a developer-session write inside the content fence, `gateDigest` unchanged). Phase 3 writes into the curriculum plan, not the remediation plan's §4.
- **Standing, unassigned:** `archive/nvidia.profile.v2.json` missing and unreconstructable; README archive listing may still lag for other slugs (tract and Prime caught up this session); OSHA IMIS, SEC EDGAR, primedatacenters.com and web.archive.org network-blocked; `huawei`'s FCC `policyExposure` entry over the 900-char convention (not a scanned scope kind). Interim caveat still standing: **do not act on the `named-project` report's whitespace call** until Phase 5.

### Recommendation for next session

- Run **Phase 3 on Fable 5.1 xhigh** from `INTEGRATED-REMEDIATION-PLAN.md` §2 row 3, §3 and §4: re-verify `CLASSROOM-CURRICULUM-PLAN.md` §1 against the 154-company corpus and re-date it, re-test every §2.2 exclusion against the §6 closures with a written keep/reverse reason each, and re-order the 20 remaining lessons into §7 — a planning write into the curriculum plan only, no lesson authoring, no track edit.

**To continue:** type `run phase 3`

Developed by: LightAISolutions
