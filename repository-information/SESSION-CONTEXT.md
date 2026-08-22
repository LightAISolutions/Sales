# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-08-22 (v02.81r)

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
