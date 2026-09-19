# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-19 03:40:47 PM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v06.63r
**Branch:** `claude/sleepy-heisenberg-qt5pit`

### What was done

- Novos Power dossier and technology study guide, plus lesson plan (v06.63r) — schema v7 `intel-briefing`, identity verified (Novos Power Inc., Delaware; San Diego principal office; co-founders Susan Linwood and Chris Mi). One product line (VASST) on the record as **claims only** — no datasheet, topology, certification target, customer, round or patent; input range stated three ways and 48 kV sits above UL 2877's 38 kV ceiling; the "incubated by LACI" line traces to the CEO's prior company ChargePodX, not to Novos. 38 sources, first-party share 8%.
- Seven concepts registered (`air-gap`, `control-bandwidth`, `insulation-coordination`, `leakage-inductance`, `magnetizing-inductance`, `reluctance`, `technology-readiness-level`) — registry 1,477.
- Registry, refresh calendar and segment membership written (`power-conversion-and-rack-power-silicon` challenger, no adjacency); graph rebuilt at 1,481 edges; corpus reconciliation found 1 inbound mention, 0 dossiers changed.
- Segment lesson `segment-power-conversion-and-rack-power-silicon` regenerated; Classroom GAS v01.82g → **v01.83g**; README tree GAS display synced.

### Where we left off

Everything is merged (`8081881` on main). This session is a read-only evaluation of the Profiler & Classroom programme against `INTEGRATED-REMEDIATION-PLAN.md` §7.3 — no authoring.

### Key decisions made

- A pre-product company gets a dossier that says so — VASST's spec rows are labelled claimed, and the study guide labels its own mechanism reading as the guide's inference rather than the company's disclosure.
- Study guides for sibling companies cross-refer rather than repeat (Heron, Amperesand, DG Matrix).

### Active context

- **Repo version v06.63r** · `CHANGELOG.md` **105 raw / 98 non-exempt**, counter `105/100` — seven sections exempt as same-EST-day; **the first push on a later EST day rotates the 2026-09-14 group of twenty** · `Classroomgs.changelog.md` 45/50 · `Profilerhtml.changelog.md` 49.
- **GAS versions:** Classroom **v01.83g**, Scraper v02.20g, Profiler v01.39g. **Pages:** Profiler v01.90w, Classroom v01.16w.
- **Programme state (measured this session):** 70 lessons · 8 tracks · 220 gate cases, 0 errors / 0 warnings; 19 of 19 landscape modules; Phase 4 **26 of 26**; C5 **14 of 14**, both seats 7 of 7; 177 dossiers; registry 0 of 177 out of sync; reports 0/0; README tree 0 findings; no structural findings.
- **Open:** `build-classroom-segments.py --check` **17 of 19 due** — 14 are pin-date only (`sections differing: none`), **3 have real content drift on `who-is-connected`** (`storage-integrators-and-containers`, `grid-equipment`, `bridge-and-on-site-generation`) from the DG Matrix + Novos Power graph rebuilds. 55 stale pins; 9 items due for review by 2026-10-19.
- **Four developer decisions still open:** design §12 item 2 (quarterly-review Routine prompt — drafted, one sentence from applied, (rr66)/(rr68)); (rr56) answer-position re-cut of eleven scenarios; roster-hash amendment ((rr59), §10.8); stranded footer ((rr22)). Findings register continues at **(rr69)**.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Run the segment regeneration pass** (`scripts/build-classroom-segments.py --all`) to clear the 17-due backlog, because three of the seventeen carry real `who-is-connected` drift rather than pin dates — leaving them means every Classroom commit proves itself against a non-zero baseline, which is exactly how the v05.62r 24-error backlog hid a 25th. One developer run, Classroom GAS bump, no authoring.

**To continue:** type `run the segment regeneration pass`

## Previous Sessions

**Date:** 2026-09-19 06:31:08 AM EST
**Repo version:** v06.62r — one push, merged (auto-merge landed `9093bdc` on main; Classroom GAS v01.82g deploy step due on that merge), then this handover
**Branch:** `claude/focused-bardeen-ov4ovr` — restarted from `origin/main` after the merge (`git fetch --prune origin`) for this handover

### What was done

- **DG Matrix dossier + technology study guide (the Profiler Command and the Prep Command, one push).** Fable 5.1, two parallel `general-purpose` research subagents (first-party 62 sources incl. both Interport Flex spec sheets and nine whitepaper PDFs from the company's r2.dev asset store; third-party 78, 64 read). Identity verified first: **DG Matrix Inc.**, Delaware (SEC CIK 0002059108; Form D 2025-03-06 and 2026-03-04 via efts.sec.gov — metadata only), HQ **Morrisville, NC** (951 Aviation Parkway; the brief's "Raleigh" is the metro / registered-agent address), private, independent, CEO Haroon Inam. `dg-matrix.profile.json` v1 (schema v7, intel-briefing): four product lines, 51 spec rows, 23 developments, 7 key judgments + indicators, 13 relationships, 4 policy exposures, 10 decision makers with eight company-published headshots, 84 sources (first-party share 44%).
- **Of the brief's four trade-press claims:** Series A **verified** (USD 60M, 2026-02-18, Engine Ventures; ABB, MHI, Helios, Fine Structure, MCJ, Sabancı; ABB's own 2025 seed release confirms the stake); "first company shipping a commercial multiport SST" **partially verified** — true of a 480 V six-port unit shipping "pre-certification", no named energised site, UL target (end Q2 2026) passed unannounced; **NVIDIA GTC 2026 roster NOT verified** — no NVIDIA-published page names DG Matrix (only Power Electronics News' list citing "Nvidia's list"); MGX membership is the company's statement; SemiAnalysis **verified** as "claims up to 98.5%". The central finding: the shipping product is low-voltage input (96–97% peak on its datasheet); the 12–34.5 kV Cell-MV that competes with Heron/Amperesand is "2028+" on the CFO's own roadmap slide.
- **`dg-matrix.study.json`** (schema v2, 13 sections) and `study-prep/dg-matrix/dg-matrix-lesson-plan.md` — third sibling of the Heron and Amperesand guides (owns multi-port topology / multi-active bridge, 480 V vs 34.5 kV input, GPU pulse loads and the sidecar, datasheet literacy, UL 1741/2877 certification path, the behind-the-meter block). Five concepts registered: `mgx`, `multi-active-bridge`, `multi-port-sst` (alias "power router"), `pulse-load`, `ul-2877` (registry 1,470).
- **Registered:** roster entry (`aka[]`, `domains[]` incl. the r2.dev asset host), quarterly refresh-calendar row with seven watch items, segments `power-conversion-and-rack-power-silicon` challenger + `in-hall-power` adjacent; graph rebuilt (1,468 edges); all Profiler checkers 0 findings.
- **Corpus reconciliation:** 21 inbound mentions across 5 files reviewed; **1 dossier changed** — `amperesand` v1 → **v2** (archived): three fields had placed DG Matrix on NVIDIA's own rosters; corrected, and a reciprocal `dg-matrix` competitor link added. Heron Power's two mentions and both study guides' "no shipped fleets" line were accurate and untouched.
- **Classroom cascade:** both segment lessons regenerated, Classroom.gs v01.81g → **v01.82g**, `Classroomgs.changelog.md` 44/50 (no rotation), README GAS display; content checker 0/0; pipeline `--base origin/main` P1 ×19 developer paths + **P7 ×2** (same-day regeneration — `updated` could not advance because v06.61r regenerated the same two lessons earlier on 2026-09-19; no P3); selftest 15/0; node --check and inner-scripts clean; readme tree 10 + 8 / 0.

### Where we left off

Everything is merged. The developer asked for a paste-ready prompt for the next company (given in the handover response — Novos Power, the fourth name in SemiAnalysis's SST vendor set and the only one uncovered). The four open decisions from earlier sessions (quarterly-review Routine amendment, (rr56), roster hash (rr59), stranded footer (rr22)) are unchanged and undated.

### Key decisions made

- **A trade-press roster line is not an NVIDIA roster line.** Every NVIDIA-published 800 V DC list (May 2025, Oct 2025, Aug 2026 blogs; GTC 2026 press kit) is read in full before a dossier says a vendor is "on NVIDIA's roster"; Power Electronics News' GTC list citing "Nvidia's list" is recorded as trade press. The Amperesand dossier was corrected on this rule.
- **MHI's stake is not linked to `mitsubishi-power`.** The investor is Mitsubishi Heavy Industries, Ltd.; the covered slug is a brand of MHI, and the brief said "only if the source names the right entity" — recorded in prose and the calendar's Chesterton item instead.
- **Quote the datasheet beside the headline.** The 400 kVA sheet's 96–97% peak efficiency is recorded next to the "up to 98.5%" platform claim in specs, judgments and the calendar row; kVA is not kW.
- **A same-day second regeneration of a segment lesson trips P7 in the pipeline checker** (`updated` cannot advance within the day). It is an artifact for a developer commit, not a defect; a future session that regenerates the same lesson twice in one EST day should expect it and say so.

### Active context

- **Repo version v06.62r** · `CHANGELOG.md` **104 raw / 98 non-exempt** (six sections dated 2026-09-19; the first push on a later EST day rotates the 2026-09-14 group of twenty — detach the footer first, SHA enrichment) · `Classroomgs.changelog.md` 44 raw / 43 non-exempt · `Profilerhtml.changelog.md` 49.
- **GAS versions:** Classroom **v01.82g**, Scraper v02.20g, Profiler v01.39g. **Pages:** Profiler v01.90w, Classroom v01.16w.
- **Profiler corpus:** 176 dossiers; SST startups covered: heron-power, amperesand, dg-matrix; Novos Power, Hyperscale Power, Enphase (IQ SST) not covered.
- **Environment:** sec.gov and data.sec.gov blocked (efts.sec.gov full-text search answered — metadata only); businesswire.com 403 (Yahoo Finance syndications work); inc.com, PitchBook, Crunchbase, Tracxn, DCD 403; PIL had to be pip-installed to convert webp headshots.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Run `profiler novos-power` and `profiler prep novos-power` in one push** so the fourth name in SemiAnalysis's 800 V DC SST vendor set joins Heron Power, Amperesand and DG Matrix — verify identity first (the corpus knows only SemiAnalysis's line: "direct MV-to-800VDC SST with 50% smaller footprint", "peak efficiencies over 98%" — HQ, legal name, funding and leadership are all unverified), assign it to `power-conversion-and-rack-power-silicon` (regenerating that segment lesson → Classroom GAS bump v01.82g → v01.83g), and cross-refer its study guide to the three sibling guides instead of repeating them. Run on Fable 5.1 High.

**To continue:** type `profiler and profiler prep novos-power`

Developed by: LightAISolutions
