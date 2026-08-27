# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-27 01:48:08 AM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v03.00r

**What was done:**
- Remote ACL health probe added to `Profiler.gs` — `aclHealthProbe_()`, dispatched as unauthenticated `GET ?action=api&op=aclhealth`; runs the exact Access-tab read sequence sign-in performs and reports the failing stage (spreadsheet ID redacted, 200-char cap, 60s result cache), turning an `acl_unavailable` sign-in outage into a one-curl diagnosis (v03.00r)
- Profiler GAS v01.20g → v01.21g; `Profilergs.version.txt` synced; generic public entry added to the GAS changelog; README tree Profiler version display corrected from stale `v01.38w · v01.17g` to `v01.42w · v01.21g` (v03.00r)
- Investigation established the reported `acl_unavailable/acl_unreachable` sign-in error is environment-side (Master ACL spreadsheet grant/transient), not a repo regression — all four live deployments answered unauthenticated version checks healthy and current (v03.00r)

**Where we left off:** All changes committed and merged to main

**Active context:**
- No TODO items; no active reminders; CHANGELOG counter 93/100
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

## Previous Sessions

### Session — 2026-08-24 (v02.99r)

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
