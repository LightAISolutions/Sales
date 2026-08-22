# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-22 05:10:05 AM EST
**Repo version:** v02.81r
**Branch:** `claude/aidc-market-report-batch-d-tgat0t`

**What we worked on (v02.76r–v02.81r — Batch D, the Zhonhen strategy report, and a Profiler UX overhaul):**

- **Batch D — colocation providers (v02.76r):** Vantage, Aligned, QTS, Switch, STACK Infrastructure. Registry **57 → 62**; each with `.study.json` + exec photos (24). Highlights the research surfaced: Aligned's ~$40B AIP/MGX/GIP acquisition **closed 2026-07-21** (buyers include Microsoft/NVIDIA/xAI); Switch has a **confidential S-1 filed** at a reported $50–80B; Vantage is exploring a ~$100B IPO; STACK owns all three campuses of Amazon's $18B Louisiana program plus Stargate's Project Jupiter. All five joined the quarterly sweep (**now 21 companies** — trigger prompt + `.claude/rules/profiler-app.md` both updated). This push also tripped the **CHANGELOG archive rotation** (2026-08-05 date group, 7 sections, SHA-enriched, 100 → 94) and caught the README tree up on **42 entries** prior sessions had missed
- **Zhonhen US AIDC strategy report (v02.77r):** 15-page confidential report + PDF in `study-prep/zhonhen/` (`zhonhen-strategy-report.md`, registered in `build-study-prep-pdf.mjs`). Six confidence-tagged key judgments; the core thesis is that **NVIDIA's own ladder reaches MV-to-DC power blocks only in 2029** (power racks 2H 2026 → row centers 2027 → SST/DC power blocks 2029), so Zhonhen's shipping one-stage MV rectifier has a **2026–2029 window**. Two regulatory tailwinds verified: ERCOT's LCL ride-through rule (NOGRR282/NPRR1308) became **binding 2026-08-01**, and FERC ordered national computational-load standards on 2026-07-16. Neocloud thesis verified true **only for self-builders** → target **IREN first, Crusoe second**; CoreWeave/Lambda/Nebius are tenants (rack-side motion only); xAI deprioritized (inside SpaceX = security hard stop)
- **Zhonhen dossier v2 (v02.78r):** corrected the claim that NVIDIA's 800VDC roster "names Delta, Megmeet and Hopewind" — **Hopewind is on neither NVIDIA list** (it came from a Chinese aggregator; only trade press ties it to Vertiv as a subcontractor). Fixed in three prose sites, aggregator source replaced with NVIDIA's two primary blog posts, v1 archived
- **Tabbed dossiers + paginated exports (v02.79r, Profiler v01.35w):** 7 sticky style-aware tabs (specs merged into Products) with shareable `#slug/tab` deep links; exports rebuilt with a cover page, **hyperlinked Contents on page 2**, and every chapter starting a fresh page (verified: a real print-to-PDF gave 15 pages, 84 live link annotations). Word gets a true TOC field for page numbers. Also fixed the BLUF/BACKGROUND run-together by splitting summaries on signposts (`BACKGROUND:`/`BACKGROUND.`, `Watch items:`, `Collection gap:`) so all 62 render congruently without rewriting prose
- **Key Judgments fix (v02.80r, v01.36w):** they were never missing — 7 older profiles stored `strategyRead` as `{confidence, judgment}` objects rendering as "[object Object]". Added `ovStratText` dual-shape handling (archived snapshots keep the old shape forever) **and** normalized the 7 live profiles to canonical strings
- **Executive-photo backfill (v02.81r, v01.37w):** **40 verified headshots across 17 dossiers** — 23 first-party from official leadership pages + 17 license-verified Wikimedia Commons portraits, each with a new **`photoCredit`** field rendered as a card caption and export credit line. Coverage **86 → 126 of 320 execs**; dossiers with photos **21 → 38**

**Where we left off:**
- Everything committed, pushed and Playwright-verified at **v02.81r** / Profiler **v01.37w**; working tree clean. Batch D completed the entire approved roster-expansion plan (A/B/C/backfill/D)

**Key decisions made:**
- **Photo policy extended (developer-approved):** company-published photos **plus** verified free-licensed Wikimedia Commons portraits (CC BY / CC BY-SA / CC0 / public domain only), attribution stored in `photoCredit`. LinkedIn scraping, news-agency/wire photos and video frame-grabs remain prohibited. Documented in PROFILER-SCHEMA.md + profiler-app.md
- **Visual verification of every photo is mandatory** — 4 of 21 Commons candidates were wrong despite passing license + name-match scoring (a French cottage window matched "Olivier Blum"; a 19th-century painting matched "Christian Bruch"; two unusable group shots). The working method: build an HTML contact sheet with "WHO IT SHOULD BE" labels, screenshot it, read it, wire in only confirmed matches
- **Tab/export choices:** 7 tabs with specs merged into Products; sticky bar + `#slug/tab` deep links; PDF ToC = hyperlinks only (Chromium print cannot compute page numbers), Word = real TOC field
- **Renderer tolerance over data-only fixes** — when a data shape changes, fix the renderer too, because archived snapshots keep old shapes permanently
- **"10jqka" is not a typo** — it is Tonghuashun (同花顺, 10jqka.com.cn), a major Chinese retail-finance data platform; now written out in the dossier
- **Zhonhen confidentiality (standing):** the Schneider Electric relationship is Jacky's **confidential** disclosure — discuss only with Zhonhen, never name it elsewhere. The intro deck stays out of the repo/public dossier; never raise Zhu Guoding's conviction; the gated NVIDIA whitepaper quote ("simpler and highly familiar design") is **publicly unverifiable** — never put it in front of a customer

**Active context:**
- **CHANGELOG counter is at 99/100** — the next push commit that adds a version section trips archive rotation again (rotate whole date-groups, SHA-enrich, post-rotation grep verification)
- **Two field notes are waiting on the developer** (a session cannot write the Drive log): *"Jacky: Schneider Electric relationship (confidential)"* and *"Jacky: targeting neoclouds — speed + technical capability priority"* — paste into the app's note box with your own 0–100 confidence ratings
- **~194 execs still have no photo.** Method that works and is ready to re-run: probe common leadership-page URL patterns → **curl + HTML parsing** (Playwright cannot reach corporate sites through the proxy: `ERR_CONNECTION_RESET`), match exec names against image filenames/alt text, contact-sheet verify. Wikimedia rate-limits hard (HTTP 429) — any further Commons sweep must run serially with backoff as a long background job
- Model note: this session ran Fable 5, exhausted the weekly limit, and finished on **Opus 5**. Two subagents died mid-task on credit exhaustion; work was completed directly in the main session
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On

**Recommendation for next session:**
- Extend the **executive-photo backfill to the remaining ~194 execs** using the proven curl-based first-party harvester: widen the URL-pattern probe (only 8 of 33 domains resolved last time — most misses were wrong path guesses, not blocked sites), run per-company, and contact-sheet verify before wiring. This is the one piece of completed work with a defined method and a large remaining gap
- **To continue:** type `continue the photo backfill`

## Previous Sessions

### Session — 2026-08-21 (v02.75r)

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
