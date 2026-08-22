# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-21 11:07:23 PM EST
**Repo version:** v02.75r
**Branch:** `claude/aidc-market-report-batch-a-r6d7iq`

**What we worked on (v02.71r–v02.75r — the full Profiler roster expansion, plan complete):**

- **Batch A — neoclouds/developers (v02.71r):** Nebius, Lambda, Applied Digital, IREN, TeraWulf, Core Scientific — 6 dossiers via two-agent Profiler runs. **Batch B — general contractors (v02.72r):** Turner, HITT, Holder, DPR, Mortenson — single-agent runs (recovered fully from mid-write agent deaths and usage-limit breaks). **Batch C — EPCs (v02.73r):** Bechtel, Kiewit, Burns & McDonnell, Black & Veatch, Primoris. Registry grew **41 → 57 companies**; every new dossier shipped with its `.study.json` and company-published exec photos (never LinkedIn)
- **Study-guide backfill (v02.74r):** 30 new concept-curriculum guides via 5 themed agents (hyperscalers, neoclouds/DC-ops, power electronics, batteries/solar, grid OEMs) — **every covered company now has a study guide**. Same push: new `neocloud` category (CoreWeave, Lambda, Nebius; IREN + Crusoe dual with `developer`), BLUF/Background paragraph split + snapshot capitalization (screenshot request), dual-shape renderer fix (newer profiles' HQ/Ownership/ticker/legalName no longer blank), 9 dossiers' "BLUF:" → "BOTTOM LINE UP FRONT:" (Profiler v01.33w)
- **EPC/GC recategorization (v02.75r):** evaluated all 57 companies; new `epc` + `gc` categories (render "EPC"/"General Contractor" via new `ovCatLabel`, colors `--ov-epc` yellow / `--ov-gc` tan). Bechtel, B&V, Burns & McDonnell, Kiewit, Primoris, Quanta, Rosendin → `epc`; Turner, HITT, Holder, DPR → `gc`; Mortenson `gc`+`epc`; Equinix `hyperscaler` → `developer`. `integrator` is now the clean BESS set (FlexGen, Fluence, Wärtsilä). Profiler v01.34w
- **Triggers:** post-earnings one-shots armed through the batches (incl. Primoris 2026-11-03); the private-company quarterly sweep expanded to 16 companies — full armed list in `.claude/rules/profiler-app.md`

**Where we left off:**
- Everything committed, merged, and Playwright-verified at **v02.75r** / Profiler **v01.34w**; working tree clean. The approved roster-expansion plan (A/B/C + backfill) is **fully complete**

**Key decisions made:**
- Category taxonomy: values stay short lowercase slugs (`epc`, `gc`) with display labels mapped in the renderer (`ovCatLabel`) — schema documented in PROFILER-SCHEMA.md
- Judgment calls the developer may want to eyeball: **Rosendin → EPC** (trade electrical contractor at core, but genuine renewables EPC arm; clearly not a GC or BESS integrator) and **Equinix → developer** (colo operator-landlord alongside Applied Digital/TeraWulf/Core Scientific, not a cloud provider)
- Older-vintage profile JSONs use compact arrays — edit them with surgical text edits, never JSON round-trips (a re-dump produces ~800 lines of reformat noise)
- **Confidentiality (standing, non-negotiable):** the Zhonhen intro deck is CONFIDENTIAL — never committed to the repo, never cited into the public dossier; its summary lives only in non-deployed `study-prep/`. Recruiting-channel information (the English name "Jacky Zhu", meeting logistics, recruiter claims) never enters public profiles — public sources only per PROFILER-SCHEMA.md. Never raise Zhu Guoding's Dec 2025 conviction with the interviewer. `study.json` files are public-safe: concept/technology flashcards only — no company trivia, no personal or interview context
- No ultracode; single-agent research suffices for private construction firms; photos company-published only

**Active context:**
- **CHANGELOG counter is at exactly 100/100 — the NEXT push commit trips archive rotation** (rotate whole date-groups, SHA-enrich every moved header, post-rotation grep verification per changelogs.md)
- Parallel sessions have been landing on main all week — restart the branch from `origin/main` before every push cycle and bump from whatever version main is actually at
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**
- Run **Batch D — colocation providers** (Vantage, Aligned, QTS, Switch, STACK), the optional final tranche from the approved expansion plan: single-agent Profiler runs with study guides in the same batch commit, private companies join the quarterly sweep. Note: this push's CHANGELOG section will trip the archive rotation — budget a few extra minutes
- **To continue:** type `run batch D`

## Previous Sessions

### Session — 2026-08-21 (v02.70r)

**Date:** 2026-08-21 05:02:40 PM EST
**Repo version:** v02.70r
**Branch:** `claude/aidc-market-report-clarify-sruhbn`

**What we worked on (v02.49r–v02.53r and v02.63r–v02.70r — AIDC research platform + Zhonhen campaign):**

- **Two-document restructure of the AIDC market report:** `AIDC-MARKET-REPORT.md` is now an 11-chapter / 109pp report; former chapters 10–12 became the standalone `AIDC-COVERAGE-UNIVERSE.md` (3 chapters, 40 companies, 51pp — every per-company "recommended strategy" passage kept per the developer's instruction). Both rebranded **"Jon Yang Equity Research"**, TOCs fully expanded, certification stack (§7.5) added, 21 acronym gaps closed, chapter 2 at +1 teaching patience. `scripts/build-aidc-report-pdf.mjs` has a DOCS registry (`--doc report|coverage`, `--style <slug>`)
- **Zhonhen Electric dossier** (`zhonhen.profile.json`, 41 sources) — Profiler registry now at **41 companies**. Load-bearing corrections vs the recruiter's framing: the chairman is **Bao Xiaoru** (the mother), not the founder; **31%** is overall China HVDC share (Kezhi 2025) while "70%+" is per-account share within named customers; CATL is taking 49% of the **holding company**, not the listco (definitive agreement 2026-08-14)
- **Zhonhen interview campaign — the developer PASSED round 1** (AIDC Sales Director; interviewer "Jacky Zhu" = **Zhu Yikun**, son of founder Zhu Guoding and chairman Bao Xiaoru). Prep set in `repository-information/study-prep/zhonhen/`: interview brief (11pp), power-architecture lesson plan (6pp — US AC chain vs China 240/336/800Vdc), and an absorption summary of the company's confidential intro deck (4pp) — all with PDFs via `scripts/build-study-prep-pdf.mjs`
- **Approved the Profiler roster-expansion plan** with the study-guide amendment — full plan in the Recommendation below

**Where we left off:**
- Everything committed, merged, and verified at **v02.70r**; working tree clean. No in-flight work — this save exists specifically so the roster expansion runs on a clean session

**Key decisions made:**
- **Model usage for the expansion:** Fable 5 within included weekly limits, fall back to Opus 5 when exhausted. **No "Fable 5 Extra"** (usage-credit billing) and **no ultracode** — the Profiler protocol already supplies the orchestration, and the 4-CPU container caps useful concurrency at ~2 agents
- **Study-guide effort stays at default High** — guides are derivative of already-deep dossier research; raising effort would spend budget on the cheapest step of the pipeline
- **Confidentiality (standing, non-negotiable):** the Zhonhen intro deck is marked CONFIDENTIAL — never committed to the repo, never cited into the public dossier; its summary lives only in non-deployed `study-prep/`. Recruiting-channel information (the English name "Jacky Zhu", meeting logistics, recruiter claims) never enters public profiles — public sources only per PROFILER-SCHEMA.md. Never raise Zhu Guoding's Dec 2025 conviction with the interviewer. `study.json` files are public-safe: concept/technology flashcards only — no company trivia, no personal or interview context
- One deck inconsistency to sidestep in conversation: say "the 100-kilowatt power shelf" (slide 6 says 108kW, slide 15 says 100kW)

**Active context:**
- CHANGELOG counter **95/100** — the next few pushes will trip archive rotation (rotate whole date-groups, SHA-enrich every moved header, run the post-rotation grep verification)
- MULTI_SESSION_MODE is Off but parallel sessions have been landing on main all week — rebase before every push cycle and bump from whatever version main is actually at
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**
- Execute the approved Profiler roster expansion: **Batch A — neoclouds** (Nebius, Lambda, Applied Digital, IREN, TeraWulf, Core Scientific — two-agent Profiler runs each), then **Batch B — general contractors** (Turner, Holder, DPR, HITT, Mortenson — single-agent), then **Batch C — EPCs** (Bechtel, Kiewit, Burns & McDonnell, Black & Veatch, Primoris — single-agent). Every new dossier ships with its `<slug>.study.json` in the same batch commit; one commit per batch. After the batches, run the **retroactive study-guide backfill**: compute the gap list by diffing `ls live-site-pages/profiler-data/*.study.json` against the registry (only hithium, sinexcel, sungrow, tesla, wartsila, and zhonhen have guides as of this save) and create the missing ones at default High effort. New listed companies get post-earnings refresh triggers; private ones join the quarterly sweep. Optional future Batch D (colos): Vantage, Aligned, QTS, Switch, STACK
- **To continue:** type `approved — run batch A`

Developed by: ShadowAISolutions
