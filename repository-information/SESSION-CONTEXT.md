# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-12 11:40:59 PM EST
**Repo version:** v05.43r — **one push commit** on `claude/stoic-hypatia-i0f7vr` (v05.42r → v05.43r); this remember-session commit follows on the same branch
**Branch:** `claude/stoic-hypatia-i0f7vr`
**Model:** Opus 5 xhigh as the orchestrator; one Explore subagent (the seven-guide survey) inherited it — ~35 minutes of research, ~60 minutes total, no cap hit

### What was done

**G6 — the large-load interconnection guidance module. Order 1 of the §7.3 run table, done in one session.**

1. **`large-load-interconnection-2026-09` is the ninth module in `guidanceDocs_()`**, registered immediately after `utility-aidc-procurement-2026-08` so the "The AI Data-Center Wave" lane stays contiguous. Title *Large-Load Interconnection: The Federal Rulebook Above the Fence*; contributor tier through the existing `GUIDANCE_ROLES` gate; twelve sections (2 `prose`, 4 `table`, 1 `timeline` with three CVD lanes and twelve dated items, 1 `proscons`, 1 `callout`, `flashcards` 9, `quiz` 6, `ledger` 32 rows), four `tiles`, 21 glossary terms, 19 `{{term}}` tooltips all resolving, `reviewBy` **2026-11-16**
2. **`repository-information/industry-guidance/large-load-interconnection-2026-09-analysis.md`** — 301 lines, 15 sections, a 50-plus-row claims ledger that labels every second-hand item, a ten-item "what the record does NOT say", and a freshness gate deriving `reviewBy` from three converging November 2026 dates (the 90-day abeyance filings, FERC's own projected next action on RM26-4, and the PJM compliance outcomes)
3. **Primary-source research only.** Federal Register full text of **Order No. 2023** (RM22-14-000, 88 FR 61014, effective 2023-11-06) and **2023-A** (RM22-14-001, 89 FR 27006, effective 2024-05-16); the six FR notices instituting the large-load **FPA §206** proceedings (91 FR 37968–37975, 2026-06-24); FERC's orders in **PJM co-location** (193 FERC ¶ 61,217, 2025-12-18, EL25-49-000 *et al.*), **SPP HILL/HILLGA** (194 FERC ¶ 61,031, ER26-247-000) and **SPP CHILLS** (195 FERC ¶ 61,196, ER26-1323); FERC's Unified Agenda for **RM26-4-000** (91 FR 53150); the 2026-06-18 Sunshine Act notice (91 FR 36126); Texas **SB 6** (89R, effective 2025-06-20)
4. **Scraper seed `topic-federal-interconnection`** (Scraper `v02.01g` → `v02.02g`), terms deliberately federal and narrow — the existing `topic-utility-procurement` seed already carries *interconnection*, *large load*, *co-location* and the RTO names, so repeating them would split one band rather than open a new one
5. **Register row G6 CLOSED** in `CLASSROOM-CURRICULUM-PLAN.md` §6 with a dated re-check note — **the gap register now has no open row at all**. G6's ledger row in `INTEGRATED-REMEDIATION-PLAN.md` §6 flipped to Done; C3's row flipped to NEXT UP; §7.3 rows 1–2 updated and a dated progress note added
6. **Verified:** `node --check` on both `.gs` files, `check-gas-inner-scripts.js` (9 files / 86 blocks), a Playwright `gdRenderDoc()` render with **zero page errors** (13 section nodes, 5 tables, 12 timeline items, 32 glossary spans, the `reviewBy` chip plain), `guidanceDocs_()` returns nine, `check-classroom-curriculum.py --strict` clean, `check-readme-tree.py` 0 findings after `--fix` synced the two GAS displays

### Where we left off

The push merged. Nothing in flight. **G6 is closed and C3 is the next session** — a paste-in prompt for it was written in chat at the developer's request and is reproduced under *Recommendation* below.

### Key decisions and findings

- **The module was composed AGAINST the seven guides, not over them.** An Explore subagent read `dominion-energy`, `oncor`, `aep`, `southern-company`, `xcel-energy`, `entergy` and `burns-mcdonnell` in full and returned ten things they already teach well and ten federal-layer gaps. The module therefore carries **no** tariff anatomy, **no** minimum-demand arithmetic and **no** SB 6 clauses — it references the guide section by id and moves on
- **The finding the module turns on:** "large load" and "load interconnection" each appear **zero times** in the 336 Federal Register pages of Order No. 2023, and zero in 2023-A along with "co-location" and "data cent". Three federal rulemakings in twenty years standardised generator interconnection and none addressed load — which is the space the state large-load tariff grew into. "Order 2023" and FERC docket numbers now appear in the corpus for the first time
- **Environment, and it shaped the sourcing:** **`ferc.gov` 403 and `misoenergy.org` 403** from this network on every path; `elibrary.ferc.gov` redirects. `federalregister.gov` (including its JSON API and `full_text/text/…` route), `govinfo.gov`, `spp.org` (which publishes FERC's own order PDFs), `pjm.com`, `ercot.com` and `capitol.texas.gov` all answered. `sec.gov` / `data.sec.gov` still 403. The six §206 orders are therefore established from their FR notices plus professional summaries, and the module's honesty section says so
- **One citation conflict, recorded not smoothed:** a secondary summary gives 195 FERC ¶ 61,209 for the PJM large-load order; the FR notice ties **¶ 61,211** to EL26-67-000 explicitly. Primary wins, and the module states the discrepancy
- **The 50 MW / >69 kV threshold is in the module only as FERC's *suggestion under investigation*** — two law-firm summaries of the same orders report no threshold at all. The only load thresholds stated as law are SPP's (10 MW ≤69 kV / 50 MW >69 kV) and Texas's 75 MW
- **The curriculum plan's §3.3 prediction checked out** (Dec 2025 PJM order → June 2026 orders to all six RTOs), with one correction: June 2026 produced **six §206 investigations, not a rulemaking**, and RM26-4 still reads "Next Action Undetermined" on FERC's August 2026 agenda

### Active context

- **Repo version** `v05.43r`; **CHANGELOG at 96/100** (no rotation due); **`Scrapergs.changelog.md` at 49/50** — the next Scraper GAS bump is the last before mandatory rotation; `Profilergs.changelog.md` at 36/50
- **GAS versions:** Profiler `v01.36g`, Scraper `v02.02g`. **Page versions unchanged this session** — Profiler `v01.87w`, Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Run order from here:** **C3** (Opus 5 xhigh, 2–3 sessions) → the **bankability review** (`bess-bankability-2026-08` `reviewBy` **2026-10-01**, already inside the 30-day horizon and flagged by the curriculum checker) → Phase 4 row 1 → S2 ∥ Phase 4 → K2 → rows 25–26 → C5 → the plan clock. **~56 sessions remain**
- **Sizes C3 will care about:** the nine `guidanceDoc*_()` content functions are **~5,590 lines of a 14,748-line `Profiler.gs`**; `Classroom.gs` is already **~39,900 lines**. `Classroom.html` already carries the `cl*` guidance renderer from C1 slice 2; `CL_ROLE_CAPS` already grants `guidance` to admin and contributor, and `CL_PROVENANCE_CAPS` already maps `'guidance' → 'guidance'`
- **Module render recipe (guidance, as used this session):** extract the module JSON straight out of `Profiler.gs`, write a **scratch copy** of `Profiler.html` with `var _e = ''`, open it `file://` with `bypass_csp`, then call `gdRenderDoc(doc, shell, {})` directly — never edit the repo's page. Playwright installs with `pip install playwright`; the browser is already at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. `ERR_FILE_NOT_FOUND` console errors for relative assets are expected under `file://` and are not page errors
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **C3, the Guidance Homecoming, session 1 of 2–3, on Opus 5 xhigh** — open by writing the slice plan and the file-layout decision (one `Classroom.gs` or a second `.gs` in the same project, given ~5,590 lines moving into a ~39,900-line file) into `PHASE6-CLASSROOM-DESIGN.md` under the C3 bullet, then execute session 1's slice only: the module content functions and the `guidanceDocs_`/index/doc/search/unified-glossary ops moving to Classroom under its own role gate and rendering there. Module ids must stay byte-identical (Scraper's `guidance:<module-id>` seeds depend on them), and Profiler's guidance keeps working until its slice is cut over.

**To continue:** type `continue with your recommendation`

## Previous Sessions

### Session — 2026-09-12 11:01:15 PM EST (v05.42r)

**Date:** 2026-09-12 11:01:15 PM EST
**Repo version:** v05.42r — **two push commits** on `claude/ecstatic-knuth-2jwso1` (v05.40r → v05.41r → v05.42r), both merged; this remember-session commit follows on the same branch after a rebase onto the merged `main`
**Branch:** `claude/ecstatic-knuth-2jwso1`
**Model:** Fable 5.1 High as the orchestrator; four research subagents (two per company, first-party then third-party) inherited it — ~63 minutes wall-clock for the v05.41r push commit, ~6 minutes for v05.42r, no cap hit

#### What was done

1. **v05.41r — S3 V4 · E4b+E6b landed, and S3 CLOSED: Mitra Chem and Cornex dossiers (schema v7, profileVersion 1, intel-briefing), study guides (schema v2; 12 and 13 sections) and eight-module lesson plans**, 10 concepts registered (olivine, specific capacity, carbon coating, iron phosphate precursor, spray drying, sintering, hydrothermal synthesis, precursor-free synthesis, press density, D50), 14 company-published headshots, registry (5 and 27 aliases) and quarterly calendar rows, graph rebuilt (1,429 edges), all six checkers clean, both dossiers and guides rendered in Playwright with zero page errors
2. **Segments:** `mitra-chem` **adjacent** on `cells-and-chemistry` (upstream cathode material, pre-commercial, plant unbuilt); `cornex` **challenger** there (SNE H1-2026 7th at 30.2 GWh / 6.5%; 6th InfoLink/TrendForce/ICC, 5th Benchmark, 3rd SPIR) and **adjacent** on `storage-integrators-and-containers` (M5/M6 containers, no third-party integrator rank — the CALB/Great Power precedent). `cells-and-chemistry` 22 members · 4 inc · 11 cha · 7 adj; the SNE H1-2026 storage-cell top twelve is now entirely covered. No floor moved
3. **Both §8 rows rewritten from the evidence.** Mitra Chem: identity held (Mitra Future Technologies, Inc., CIK 0001887663, still private and operating) but the plant slipped to 'early 2027, commissioning 2028' at 'over $370M' (State of Michigan 2026-08-05; Michigan's support doubled to $50M), the DOE award is obligated and retained with only $2.25M outlaid, L&F (Korea) holds 3.3% and the 'joint venture' exists only in Korean headlines, the 2025 Form D ($15.6M of $50M) has no successor, and the company has said nothing since 2024-09-20. Cornex: identity held (楚能新能源股份有限公司, not 中比); 'top three in 2025' is SPIR's number (InfoLink/EVTank ninth), the '290 GWh Hubei DRC approval' could not be found, M5 mass production began 2024-02-01 not 2025, no CATL suit exists, no IPO filing anywhere (absent even from Hubei's 2026–28 listing-reserve roster), two RMB 6bn-class government funds entered and left the cap table, and the owner's separate 楚能汽车 car venture is self-funded at RMB 10bn
4. **The §6 register in `CLASSROOM-CURRICULUM-PLAN.md` was re-run in full and dated 2026-09-13 (v05.41r)** — no status moved, G10's residual (the insurance seat) recorded closed by the `insurance-and-risk-transfer` segment, G6 still the only open row; the S3 ledger row in `INTEGRATED-REMEDIATION-PLAN.md` flipped to Done on that re-run
5. **v05.42r — item D resolved and the action plan re-evaluated.** The developer chose option 1: `aka[]` joined the roster search haystack in `Profiler.html` (v01.86w → v01.87w; names, slugs and all 265 aliases; taglines still excluded; verified "楚能" → Cornex, "Guy Carpenter" → Marsh McLennan, "Mitra Future" → Mitra Chem, "中创新航" → CALB). `INTEGRATED-REMEDIATION-PLAN.md` §7.3 gained the post-S3 run order with every remaining phase tied to a model (G6 → C3 → bankability review → Phase 4 row 1 → S2 ∥ Phase 4 → K2 → rows 25–26 → C5 → plan clock; ~57 sessions, ~54 Opus 5 xhigh, 2–3 Fable 5.1 xhigh, none Fable 5.1 High), §7.4 re-sequenced, ledger rows updated, and a **§7.9 paste-in brief for G6**
6. **Corpus reconciliation:** Mitra Chem 0 inbound files; Cornex 3 files, 3 substantive mentions (CALB's 1.3 GWh margin, the NARI 2026 shortlist), all consistent, 0 revised

#### Where we left off

Both pushes merged (`v05.41r` 5eab070, `v05.42r` 5470b48). This remember-session commit is the only thing after them. Nothing in flight. **S3 is closed; the next session is G6 on Opus 5 xhigh** from the §7.9 brief (pasted below), then C3.

#### Key decisions and findings

- **G6 before S2 — the developer's instinct, and the plan's own rule since S0.** G6 was gated on S0 (met 2026-09-07), never on S3; running it first closes the register's last open row, unlocks Phase 4 row 26, and gives C3 nine modules and zero landscapes to migrate
- **Rank is a property of the house.** Cornex spans 3rd–7th across five houses for one half-year; the segment note tells the S2 author to type on SNE by name. The company and the Hubei/Wuhan governments quote SPIR
- **Private-lane identity rows aged on the operating record this time**, not the identity — a plant date, a cost, an approval that does not exist, a lawsuit that does not exist
- **Environment:** sec.gov Archives answered a declared research User-Agent ('Mozilla/5.0 (compatible; LightAISolutions research jonyang92@gmail.com)') while data.sec.gov stayed 403 — retry Archives before planning around the block; efts.sec.gov answered; cornexbattery.com needs a browser User-Agent and a 40-s timeout; fgw.hubei.gov.cn 412, yichang.gov.cn 407 (proxy policy); businesswire.com, woodtv.com, michigan.gov, lnfcorp.com blocked
- **Render recipe unchanged** (scratch copy, `_e = ''`, analyst role, fresh page per company); scratchpad `render.py` and `search_test.py` are session-local
- **The bankability module's `reviewBy` is 2026-10-01** — inside 30 days; it is order 3 in the run table and Phase 4 rows 23–24 wait on it
- **Study-guide shape traps hit this session:** timeline items are `{x, lane, label, sub}` with `lanes` a dict; proscons cards need `t`, `adv[]`, `dis[]` — both caught by `check-profiler-study.py`

#### Active context

- **Repo version** `v05.42r`; **CHANGELOG at 95/100** total, 15 dated 2026-09-12 and exempt → ~80 non-exempt; no rotation due
- **S3: 10 of 10 — closed.** Next: **G6** (Opus 5 xhigh, §7.9 brief), then **C3** (Opus 5 xhigh, 2–3), then the bankability review (due 2026-10-01), then Phase 4 row 1 and the two long lanes
- **Page versions:** Profiler `v01.87w` (bumped this session), Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **§10.5 item D is done** — nothing awaits developer approval in the coverage plan
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

#### Recommendation for next session

- Run **G6 on Opus 5 xhigh** from the `INTEGRATED-REMEDIATION-PLAN.md` §7.9 brief — the large-load interconnection guidance module as research synthesis: one push commit, the ninth module in `guidanceDocs_()`, register row G6 closed, no lesson and no migration.

**To continue:** paste the G6 prompt below into a new Opus 5 xhigh session:

```text
Run G6 of INTEGRATED-REMEDIATION-PLAN.md — the large-load interconnection guidance module, research synthesis — on Opus 5 xhigh as a fresh session. G6 is guidance-module AUTHORING: it adds one module to `guidanceDocs_()` in googleAppsScripts/Profiler/Profiler.gs, writes its analysis markdown, seeds the Scraper interest topic, and closes register row G6; it edits no dossier, study guide, lesson, registry or report, and creates, updates or deletes no Routine.

READ FIRST: repository-information/SESSION-CONTEXT.md (Latest Session); INTEGRATED-REMEDIATION-PLAN.md §7.2 (the G6 paragraph), §7.3 (the 2026-09-13 re-evaluated order — G6 is order 1) and §6 (the G6 ledger row); CLASSROOM-CURRICULUM-PLAN.md §6 row G6 and §3.3 `interconnection-for-large-loads` (the lesson's outline names the sections the module must be able to support — two jurisdictions, Order 2023 and what it left for load, the large-load tariff as a class, who pays the studies, the co-location docket); .claude/rules/industry-guidance.md steps 4–10 (module shape, `group` meta, access model, GAS version bump, verification, Scraper seed, `reviewBy`); the six utility study guides (dominion-energy, oncor, aep, southern-company, xcel-energy, entergy) and burns-mcdonnell — the module is composed AGAINST them and must not restate them; the existing `**Provenance:**` line of any research-synthesis module (grid-equipment-shortage-2026-09 is the precedent) for the form.

THE WORK — one push commit: (1) Research the federal layer from public primary sources only — FERC Order 2023 and 2023-A (the generator interconnection reforms and what they did not cover), FERC's large-load and co-location dockets (the PJM co-location proceeding and the Commission's 2025–2026 orders), the RTO large-load interconnection rules that exist today (PJM, MISO, SPP, ERCOT's SB 6 process via the Oncor guide), study-fee and readiness-deposit regimes, and the large-load tariff as a class of instrument across the six utilities — every quantitative claim with its docket, order or page; run scripts/check-source-reachability.py first and record blocked hosts. (2) Write repository-information/industry-guidance/large-load-interconnection-2026-09-analysis.md on the standard analysis shape, with a claims ledger. (3) Author `guidanceDocLargeLoadInterconnection_()` on the guidance section-kind vocabulary with id `large-load-interconnection-2026-09`, `group` = The AI Data-Center Wave, a `**Provenance:**` line naming it research synthesis with no ingested document, `reviewBy` set from its nearest dated gate (the next FERC compliance or effective date you find), registered in `guidanceDocs_()` immediately after `utility-aidc-procurement-2026-08`; contributor tier per the role matrix. (4) Scraper seed per industry-guidance step 9 (Scraper GAS bump applies). (5) Bump the Profiler GAS version and gs.version.txt per [PC-GS-VERSION] #1, `node --check` a .js copy, run scripts/check-gas-inner-scripts.js, and render the module in Playwright via gdRenderDoc(). (6) Close register row G6 in CLASSROOM-CURRICULUM-PLAN.md §6 with a dated re-check note (the row closes on the module's existence; the lesson is Phase 4 row 26), flip the G6 ledger row in INTEGRATED-REMEDIATION-PLAN.md §6, and note in §7.3 that order 1 is done and C3 is next. Do NOT author the lesson; do NOT migrate any module (that is C3).

VERIFY: the module renders with zero page errors; the guidance index lists nine modules; `check-classroom-curriculum.py --strict` clean; CHANGELOG — check the counter, do not assume. Normal Pre-Commit and Pre-Push checklists; one push commit on a claude/* branch (`git ls-remote` first).
```

Developed by: LightAISolutions
