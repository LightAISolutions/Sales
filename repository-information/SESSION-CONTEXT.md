# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-24 05:19:27 PM EST
**Repo version:** v02.99r
**Branch:** `claude/profiler-rbac-phase-4-mph0s9`

**What we worked on (v02.98r-v02.99r — Phases 4 and 5, completing the v02.91r AIDC program):**

- **Phase 4 (v02.98r):** the two-document Hithium sales strategy report in `study-prep/hithium/` — the **IC playbook** (`hithium-ic-playbook.md` + 7-page PDF: the market-fence one-pager, the six-channel hunt map + Jupiter-pattern account profile, the seven-question qualification script + disqualifier table, MACR-arithmetic-as-a-service, the seven-row objection table, the five-play Jupiter defense vs the Peak Energy sodium wedge with early-warning indicators, the 10-item proof pack, the red-lines list) and the **team-lead playbook** (`hithium-team-lead-playbook.md` + 6-page PDF: the certified-MW-over-queue-GW thesis, the six-demand-pool coverage plan with 4:1 staffing guidance, the dated 2026-28 policy calendar, rules of engagement vs ON.energy / the gas cohort / CATL / the FEOC-compliant tier / Peak Energy, five-stage pipeline gates with MOU-at-zero counting rules, team standards, the 2026-28 play). Both registered in `build-study-prep-pdf.mjs`
- **Phase 5 (v02.99r, GAS v01.20g):** the team training curriculum — two new Industry Guidance training modules in `Profiler.gs` (library now 6): `guidanceDocBessTech_()` (*BESS Technology Fundamentals for the Sales Team* — LFP in plain terms, the spec sheet decoded, the 280→1300Ah cell ladder, cell-to-container, sodium claim discipline, duration-class proscons, safety/certification vocabulary) and `guidanceDocPowerInfra_()` (*Power Infrastructure & the AIDC Power Chain* — grid basics and MW-vs-MWh, the two market designs, the battery revenue stack, the grid-to-GPU chain with NOGRR 282/SB 6, the three BESS sockets, the 2026-28 gates timeline); their two analysis markdowns in `industry-guidance/`; and the four-week onboarding curriculum (`hithium-team-training-curriculum.md` + 5-page PDF) with pass/fail competency gates G1-G4, before-day-one setup, and trainer's notes. Verified via node --check, inner-scripts check, JSON/tooltip/quiz validation, Playwright `gdRenderDoc()` renders, and the harness smoke test
- All five PDFs (both playbooks + the curriculum) delivered to the developer as chat downloads

**Where we left off:**
- Everything committed, pushed, and merged through v02.99r (workflow deployed; GAS webhook pulls v01.20g); working tree clean. **The v02.91r plan is fully complete — Phases 1-5 all delivered** (the 88-dossier base, 6 guidance modules, Hithium v5 + the relationship web, the two playbooks, the training curriculum)
- Developer-side only: review the two new training modules in-app (admin/contributor tiers, the ✦ Industry Guidance button) now that v01.20g is live

**Key decisions made (established this session):**
- Phase 5 landed as **in-app guidance modules + a curriculum document** — the two teaching gaps (core technical, power infrastructure) filled the same way as the Phase 2 policy modules, and the curriculum sequences all assets into four gated weeks (G3, the red-lines recital, is the hard floor — no customer contact until it passes)
- Training modules are **teaching syntheses with pointer-form claims ledgers** — no new external claims; every figure traces to the dossier or a prior verified analysis
- Concede-then-structure is the house objection-answer pattern (playbooks + curriculum enforce it)
- Sodium claim discipline in writing: the AIDC sodium SKU's mass production is unconfirmed — the approved line commits only to the shipping utility SKU plus a written roadmap

**Active context:**
- CHANGELOG counter 92/100; Profiler v01.42w / GAS v01.20g; registry 88 companies; no TODO items or active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On
- Standing sensitivities unchanged: the Zhonhen/Schneider disclosure stays in Zhonhen contexts; never raise Zhu Guoding's conviction unprompted in customer-facing material; NVIDIA quotes paraphrased with page cites; field notes never cited as profile sources; the reported Hithium executive arrest stays do-not-quote

**Recommendation for next session:**
- The v02.91r AIDC program is fully complete (Phases 1-5) — no deferred work; future sessions can pick any new task. (Developer-side only: review the two new training modules in-app.)

## Previous Sessions

### Session — 2026-08-24 (v02.97r)

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
