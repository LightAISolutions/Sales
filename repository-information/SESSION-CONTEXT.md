# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-24 03:12:54 PM EST
**Repo version:** v02.97r
**Branch:** `claude/profiler-role-access-control-mwyky3`

**What we worked on (v02.92r-v02.97r — the full AIDC understanding phase, Phases 1-3 of the plan approved under v02.91r):**

- **Batch A (v02.92r):** nine BESS-competitor dossiers (Prevalon, Canadian Solar e-STORAGE, Trina Storage, HyperStrong, LS Energy Solutions, CRRC Zhuzhou, Sunwoda, Narada, Envision). Registry 62 → 71
- **Batch B (v02.93r):** eight IPP/developer dossiers (Jupiter Power, Lightsource bp, NextEra Energy Resources, Plus Power, Arevon, Eolian, Key Capture, Terra-Gen) under a new `ipp` category (registry + page-side color/label support, Profiler v01.42w). Registry 71 → 79. Verified the three Hithium prospectus references: Jupiter strong (3 GWh + Trimount), Lightsource bp Australia-only and fading, Samsung C&T MOU-grade and unconverted
- **Batch C (v02.94r):** four EPC dossiers (SOLV, Blattner, MasTec, Samsung C&T). Registry 79 → 83. Established the owner-furnished procurement norm — EPCs install, owners choose the cells
- **Batch D (v02.95r):** five BtM-power dossiers — VoltaGrid, ERock, ProEnergy, Mainspring (FEOC-immune gas/linear demand-shapers, all with zero BESS in-product = open attach sockets) and ON.energy (evaluation returned a FULL DOSSIER verdict: its MV AI UPS + 5 GW Crusoe deal is a direct category competitor to Hithium's ∞Power AIDC line). Registry 83 → 88
- **Phase 2 (v02.96r, GAS v01.19g):** three Industry Guidance modules in `Profiler.gs` (library now 4): the China policy stack (FEOC/MACR 55→75%, the ~40.9% current tariff stack after the SCOTUS IEEPA ruling, NDAA phases, five compliant lanes), utility procurement meets AIDC load (Oncor/AEP/Entergy/Dominion/Georgia Power; the 85% minimum-take norm; the two-lane buyer map), and BESS bankability & certification (UL/NFPA-855-2026 stack, IE mechanics, the Hithium counterparty file, 10-item RFP checklist) + three analysis markdowns in `industry-guidance/`. This push also ran the CHANGELOG archive rotation (2026-08-08 group, 12 sections, SHA-enriched)
- **Phase 3 (v02.97r):** Hithium dossier revised to **profileVersion 5 (AIDC lens)** — new ∞Power AIDC product entry (four-SKU lithium-sodium line; energy-backbone-not-UPS positioning, zero named customers 8 months post-launch), AIDC/US-book spec annex, the Jupiter-Peak Energy sodium wedge flagged, 3 new strategy reads, 51 sources; v4 archived. Plus **the relationship-web deliverable** `study-prep/hithium/hithium-relationship-web.md` — the eight-layer AIDC value chain, graded Hithium relationships, the cell-brand decision map per channel, two Mermaid diagrams, six 2026-28 demand pools

**Where we left off:**
- Everything committed and pushed through v02.97r (auto-merge deploys; GAS webhook pulls v01.19g); working tree clean. **The understanding phase is complete** — 88 dossiers, 4 guidance modules, Hithium v5, the relationship web. The developer wants Phase 4 started in a fresh session

**Key decisions made (developer-approved or established this session):**
- Coverage scope: Tiers 1+2 minus Powin; utilities/standards bodies as guidance modules, not dossiers; ON.energy promoted to a full dossier on the evaluation verdict
- Phase 4 (next) = the **sales strategy report as two documents** in `repository-information/study-prep/hithium/` — an IC playbook and a team-lead playbook, PDF'd (register in `build-study-prep-pdf.mjs`); Phase 5 (after) = team training curriculum
- Hithium's framing: competes in **containerized BESS**, not sidecar/backup-unit/electrical-room products
- Guidance renderer detail: per-section `zh` notes render under a hard-coded "For the Zhonhen conversation" label — non-Zhonhen modules use closing `**Field note:**` prose lines instead (making the label doc-configurable = small page bump, offered to the developer)
- CHANGELOG rotation follows the step-1-7 procedure (mandatory first rotation when total >100), which contradicts Scenarios A/D (non-exempt-only threshold) — the stricter reading was applied 08-24

**Active context:**
- CHANGELOG counter 90/100; archive 107 sections all SHA-linked; Profiler v01.42w / GAS v01.19g; 88 registry companies; no TODO items or active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On
- **Report-ready findings a Phase 4 session should read first:** the relationship web (`study-prep/hithium/hithium-relationship-web.md` — demand pools + decision map), the Hithium v5 dossier (Jupiter anchor + the Peak Energy sodium wedge = the top account-defense priority), the three guidance analyses in `repository-information/industry-guidance/` (policy lanes, the two-lane buyer motion, the bankability toolkit), and the ON.energy dossier (the AI UPS category contest)
- Standing sensitivities: the Zhonhen/Schneider disclosure stays in Zhonhen contexts only; never raise Zhu Guoding's conviction unprompted in customer-facing material; NVIDIA white-paper quotes are paraphrased with page cites on public surfaces; field notes are never cited as profile sources

**Recommendation for next session:**
- **Execute Phase 4 — the two-document Hithium sales strategy report** (`study-prep/hithium/`): the IC playbook (account targeting from the decision map, the safe-harbored/merchant qualification script, objection handling from the bankability checklist, Jupiter account defense vs the Peak wedge) and the team-lead playbook (territory/segment strategy across the six demand pools, the policy calendar, competitive posture vs ON.energy and the gas cohort, pipeline metrics) — both PDF'd via `build-study-prep-pdf.mjs`
- **To continue:** type `continue with Phase 4`

## Previous Sessions

### Session — 2026-08-22 (v02.87r)

**Date:** 2026-08-22 07:35:46 PM EST
**Repo version:** v02.87r
**Branch:** `claude/aidc-photo-backfill-g8ujeg`

**What we worked on (v02.82r–v02.87r — photo backfill passes 2–3, Zhonhen Q&A + prep corrections, and the Industry Guidance hub):**

- **Exec-photo backfill pass 2 (v02.82r):** 34 verified headshots across 19 dossiers (coverage 126 → 160 of 320). Root-caused the prior sweep's misses: blind URL-path guessing, not blocked hosts — replaced with a two-level crawl of each site's own navigation, alias-aware name matching, Wikipedia-biography lead images for Commons (7 photos), and same-surname collision fixes. Method consolidated into `scripts/harvest-exec-photos.py` (gaps/firstparty/commons/sheet/wire subcommands)
- **PDF track (v02.83r):** +4 headshots from ESG/annual reports via a new `pdfs` subcommand (caption-band matching, clip-region rendering) — Samsung SDI, LG Energy Solution ×2, Huawei Digital Power, all previously zero-photo. Coverage **164/320, 46 dossiers**. Empirically bounded: regulatory filings are text-only; ESG reports show boards, not exec teams
- **Browser-path diagnosis (v02.84r):** Chromium *does* honor the proxy (bogus-port test proves it); its NSS store starts empty (fixable via `certutil` + the proxy CA — commands recorded in the harvester's env notes); the residual reset on non-github hosts is **upstream egress policy — an administrator action, not another session's debugging**. Photo backfill is at its practical ceiling (~156 remain, mostly JS-rendered sites + no-Wikipedia-article execs)
- **Zhonhen TRU/SST correction (v02.84r):** the lesson plan told the developer to call Panama a "solid-state transformer" — corrected to TRU in Module 3 + Q&A, PDF rebuilt. Answered in chat: TRU-vs-SST device classes, and why 473 kW/m³ leads for tenant neoclouds (density = revenue) while self-builders get schedule/ERCOT and Crusoe gets generator protection
- **Interview-day one-pager (v02.85r):** `zhonhen-one-pager.md` + PDF (2 pages after the developer okayed length over the 1-page cut); new `dense: true` scan-sheet mode in `build-study-prep-pdf.mjs`
- **Industry Guidance hub (v02.86r, Profiler v01.38w · GAS v01.17g):** admin-only "✦ Industry Guidance" masthead button → full-screen overlay rendering study modules from JSON served by a new admin-gated `action=guidance` API in Profiler.gs (PROJECT-marked additions on the note-ops transport; content never on public Pages). Renderer widgets: glossary tooltips, tables, pros/cons, lane-colored timeline (CVD-validated gold/blue/rose), bars, flashcards, scored quiz, claims ledger, reading progress. First module: **NVIDIA's Aug 2026 800 VDC white paper** — read all 36 pages, every number verified by two extraction agents; source PDF + `nvidia-800vdc-analysis.md` committed under `repository-information/industry-guidance/`. New repeatable command in `.claude/rules/industry-guidance.md`
- **Zhonhen docs amended from the paper (v02.86r):** the "simpler and highly familiar" quote **verified at p22** (which names the "Panama Architecture" as a canonical TRU implementation) — retired the strategy report's "appears in no NVIDIA document" claim; quote now customer-usable (cite + paraphrase). Window refined: 2029 attaches to next-gen SST; TRU 4.8 MW blocks specified now; Option B Q3 2027
- **Block-composition story (v02.87r):** `zhonhen-block-composition.md` + PDF — the current-ladder derivation (6000 A = 4.8 MW ÷ 800 V), NVIDIA's own blessing of paralleled rectifier modules, the arithmetic (2 × 2.5 MW = the drawn 5 MVA block; **8 × 2.5 = a 20 MW DU exactly**; 5 MW MVR container = the block 1:1), eight-row interface scorecard, ten engineering questions

**Where we left off:**
- Everything committed, pushed and merged through **v02.87r**; working tree clean; Profiler at v01.38w / GAS v01.17g (webhook redeploys on merge). The developer has the one-pager, block-composition PDF, and the in-app module pending their first sign-in test

**Key decisions made (developer-approved):**
- Industry Guidance architecture: **in-app renderer + admin-gated GAS data op** (chosen over GAS-iframe and all-on-Pages); **Q&A skipped for v1** (revisit path documented — `anthropicSummarize_` precedent + `ANTHROPIC_API_KEY`); **source PDFs committed** to `repository-information/industry-guidance/sources/`; **Zhonhen docs updated** in the same push
- Public changelog entries for guidance stay generic — never name analyzed documents publicly
- NVIDIA-side claims only from the verified ledger; deck-only Zhonhen figures (container table, 10 GW fleet) stay inside Zhonhen conversations; Schneider relationship never leaves study-prep; the developer confirmed both field notes are now in the app
- Estimate calibration: anchor on deliverable count (~20–40m per multi-file feature), not phase count

**Active context:**
- **CHANGELOG counter reads 105/100** — twelve of today's sections are current-day exempt (non-exempt = 93). The **next push after midnight EST trips archive rotation** (rotate whole date-groups, SHA-enrich, post-rotation grep check)
- Also pending from earlier: the two changelog-rotation rules (step-2 "count all" vs Scenario A "non-exempt only") genuinely conflict — was flagged to the developer 08/22; Scenario A followed in practice
- Photo backfill: done at 164/320 unless the egress policy changes (then `scripts/harvest-exec-photos.py` env notes has the exact Chromium recipe)
- Playwright: proxy CA now needs importing per-container (`apt-get install -y libnss3-tools` + `certutil` line in the harvester notes); PyMuPDF + poppler-utils installed this container only
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**
- **Triage the developer's Zhonhen field notes and any answers to the ten block-composition questions into a dossier revision** (`profiler zhonhen`): the notes are in the app's Drive log now, the composition brief will generate engineering answers worth folding in, and the dossier's v2 pre-dates the white-paper verification — one revision pass aligns dossier, notes, and the new primary source
- **To continue:** type `triage zhonhen notes and refresh the dossier`
