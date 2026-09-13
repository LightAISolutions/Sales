# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-12 11:01:15 PM EST
**Repo version:** v05.42r — **two push commits** on `claude/ecstatic-knuth-2jwso1` (v05.40r → v05.41r → v05.42r), both merged; this remember-session commit follows on the same branch after a rebase onto the merged `main`
**Branch:** `claude/ecstatic-knuth-2jwso1`
**Model:** Fable 5.1 High as the orchestrator; four research subagents (two per company, first-party then third-party) inherited it — ~63 minutes wall-clock for the v05.41r push commit, ~6 minutes for v05.42r, no cap hit

### What was done

1. **v05.41r — S3 V4 · E4b+E6b landed, and S3 CLOSED: Mitra Chem and Cornex dossiers (schema v7, profileVersion 1, intel-briefing), study guides (schema v2; 12 and 13 sections) and eight-module lesson plans**, 10 concepts registered (olivine, specific capacity, carbon coating, iron phosphate precursor, spray drying, sintering, hydrothermal synthesis, precursor-free synthesis, press density, D50), 14 company-published headshots, registry (5 and 27 aliases) and quarterly calendar rows, graph rebuilt (1,429 edges), all six checkers clean, both dossiers and guides rendered in Playwright with zero page errors
2. **Segments:** `mitra-chem` **adjacent** on `cells-and-chemistry` (upstream cathode material, pre-commercial, plant unbuilt); `cornex` **challenger** there (SNE H1-2026 7th at 30.2 GWh / 6.5%; 6th InfoLink/TrendForce/ICC, 5th Benchmark, 3rd SPIR) and **adjacent** on `storage-integrators-and-containers` (M5/M6 containers, no third-party integrator rank — the CALB/Great Power precedent). `cells-and-chemistry` 22 members · 4 inc · 11 cha · 7 adj; the SNE H1-2026 storage-cell top twelve is now entirely covered. No floor moved
3. **Both §8 rows rewritten from the evidence.** Mitra Chem: identity held (Mitra Future Technologies, Inc., CIK 0001887663, still private and operating) but the plant slipped to 'early 2027, commissioning 2028' at 'over $370M' (State of Michigan 2026-08-05; Michigan's support doubled to $50M), the DOE award is obligated and retained with only $2.25M outlaid, L&F (Korea) holds 3.3% and the 'joint venture' exists only in Korean headlines, the 2025 Form D ($15.6M of $50M) has no successor, and the company has said nothing since 2024-09-20. Cornex: identity held (楚能新能源股份有限公司, not 中比); 'top three in 2025' is SPIR's number (InfoLink/EVTank ninth), the '290 GWh Hubei DRC approval' could not be found, M5 mass production began 2024-02-01 not 2025, no CATL suit exists, no IPO filing anywhere (absent even from Hubei's 2026–28 listing-reserve roster), two RMB 6bn-class government funds entered and left the cap table, and the owner's separate 楚能汽车 car venture is self-funded at RMB 10bn
4. **The §6 register in `CLASSROOM-CURRICULUM-PLAN.md` was re-run in full and dated 2026-09-13 (v05.41r)** — no status moved, G10's residual (the insurance seat) recorded closed by the `insurance-and-risk-transfer` segment, G6 still the only open row; the S3 ledger row in `INTEGRATED-REMEDIATION-PLAN.md` flipped to Done on that re-run
5. **v05.42r — item D resolved and the action plan re-evaluated.** The developer chose option 1: `aka[]` joined the roster search haystack in `Profiler.html` (v01.86w → v01.87w; names, slugs and all 265 aliases; taglines still excluded; verified "楚能" → Cornex, "Guy Carpenter" → Marsh McLennan, "Mitra Future" → Mitra Chem, "中创新航" → CALB). `INTEGRATED-REMEDIATION-PLAN.md` §7.3 gained the post-S3 run order with every remaining phase tied to a model (G6 → C3 → bankability review → Phase 4 row 1 → S2 ∥ Phase 4 → K2 → rows 25–26 → C5 → plan clock; ~57 sessions, ~54 Opus 5 xhigh, 2–3 Fable 5.1 xhigh, none Fable 5.1 High), §7.4 re-sequenced, ledger rows updated, and a **§7.9 paste-in brief for G6**
6. **Corpus reconciliation:** Mitra Chem 0 inbound files; Cornex 3 files, 3 substantive mentions (CALB's 1.3 GWh margin, the NARI 2026 shortlist), all consistent, 0 revised

### Where we left off

Both pushes merged (`v05.41r` 5eab070, `v05.42r` 5470b48). This remember-session commit is the only thing after them. Nothing in flight. **S3 is closed; the next session is G6 on Opus 5 xhigh** from the §7.9 brief (pasted below), then C3.

### Key decisions and findings

- **G6 before S2 — the developer's instinct, and the plan's own rule since S0.** G6 was gated on S0 (met 2026-09-07), never on S3; running it first closes the register's last open row, unlocks Phase 4 row 26, and gives C3 nine modules and zero landscapes to migrate
- **Rank is a property of the house.** Cornex spans 3rd–7th across five houses for one half-year; the segment note tells the S2 author to type on SNE by name. The company and the Hubei/Wuhan governments quote SPIR
- **Private-lane identity rows aged on the operating record this time**, not the identity — a plant date, a cost, an approval that does not exist, a lawsuit that does not exist
- **Environment:** sec.gov Archives answered a declared research User-Agent ('Mozilla/5.0 (compatible; LightAISolutions research jonyang92@gmail.com)') while data.sec.gov stayed 403 — retry Archives before planning around the block; efts.sec.gov answered; cornexbattery.com needs a browser User-Agent and a 40-s timeout; fgw.hubei.gov.cn 412, yichang.gov.cn 407 (proxy policy); businesswire.com, woodtv.com, michigan.gov, lnfcorp.com blocked
- **Render recipe unchanged** (scratch copy, `_e = ''`, analyst role, fresh page per company); scratchpad `render.py` and `search_test.py` are session-local
- **The bankability module's `reviewBy` is 2026-10-01** — inside 30 days; it is order 3 in the run table and Phase 4 rows 23–24 wait on it
- **Study-guide shape traps hit this session:** timeline items are `{x, lane, label, sub}` with `lanes` a dict; proscons cards need `t`, `adv[]`, `dis[]` — both caught by `check-profiler-study.py`

### Active context

- **Repo version** `v05.42r`; **CHANGELOG at 95/100** total, 15 dated 2026-09-12 and exempt → ~80 non-exempt; no rotation due
- **S3: 10 of 10 — closed.** Next: **G6** (Opus 5 xhigh, §7.9 brief), then **C3** (Opus 5 xhigh, 2–3), then the bankability review (due 2026-10-01), then Phase 4 row 1 and the two long lanes
- **Page versions:** Profiler `v01.87w` (bumped this session), Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **§10.5 item D is done** — nothing awaits developer approval in the coverage plan
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **G6 on Opus 5 xhigh** from the `INTEGRATED-REMEDIATION-PLAN.md` §7.9 brief — the large-load interconnection guidance module as research synthesis: one push commit, the ninth module in `guidanceDocs_()`, register row G6 closed, no lesson and no migration.

**To continue:** paste the G6 prompt below into a new Opus 5 xhigh session:

```text
Run G6 of INTEGRATED-REMEDIATION-PLAN.md — the large-load interconnection guidance module, research synthesis — on Opus 5 xhigh as a fresh session. G6 is guidance-module AUTHORING: it adds one module to `guidanceDocs_()` in googleAppsScripts/Profiler/Profiler.gs, writes its analysis markdown, seeds the Scraper interest topic, and closes register row G6; it edits no dossier, study guide, lesson, registry or report, and creates, updates or deletes no Routine.

READ FIRST: repository-information/SESSION-CONTEXT.md (Latest Session); INTEGRATED-REMEDIATION-PLAN.md §7.2 (the G6 paragraph), §7.3 (the 2026-09-13 re-evaluated order — G6 is order 1) and §6 (the G6 ledger row); CLASSROOM-CURRICULUM-PLAN.md §6 row G6 and §3.3 `interconnection-for-large-loads` (the lesson's outline names the sections the module must be able to support — two jurisdictions, Order 2023 and what it left for load, the large-load tariff as a class, who pays the studies, the co-location docket); .claude/rules/industry-guidance.md steps 4–10 (module shape, `group` meta, access model, GAS version bump, verification, Scraper seed, `reviewBy`); the six utility study guides (dominion-energy, oncor, aep, southern-company, xcel-energy, entergy) and burns-mcdonnell — the module is composed AGAINST them and must not restate them; the existing `**Provenance:**` line of any research-synthesis module (grid-equipment-shortage-2026-09 is the precedent) for the form.

THE WORK — one push commit: (1) Research the federal layer from public primary sources only — FERC Order 2023 and 2023-A (the generator interconnection reforms and what they did not cover), FERC's large-load and co-location dockets (the PJM co-location proceeding and the Commission's 2025–2026 orders), the RTO large-load interconnection rules that exist today (PJM, MISO, SPP, ERCOT's SB 6 process via the Oncor guide), study-fee and readiness-deposit regimes, and the large-load tariff as a class of instrument across the six utilities — every quantitative claim with its docket, order or page; run scripts/check-source-reachability.py first and record blocked hosts. (2) Write repository-information/industry-guidance/large-load-interconnection-2026-09-analysis.md on the standard analysis shape, with a claims ledger. (3) Author `guidanceDocLargeLoadInterconnection_()` on the guidance section-kind vocabulary with id `large-load-interconnection-2026-09`, `group` = The AI Data-Center Wave, a `**Provenance:**` line naming it research synthesis with no ingested document, `reviewBy` set from its nearest dated gate (the next FERC compliance or effective date you find), registered in `guidanceDocs_()` immediately after `utility-aidc-procurement-2026-08`; contributor tier per the role matrix. (4) Scraper seed per industry-guidance step 9 (Scraper GAS bump applies). (5) Bump the Profiler GAS version and gs.version.txt per [PC-GS-VERSION] #1, `node --check` a .js copy, run scripts/check-gas-inner-scripts.js, and render the module in Playwright via gdRenderDoc(). (6) Close register row G6 in CLASSROOM-CURRICULUM-PLAN.md §6 with a dated re-check note (the row closes on the module's existence; the lesson is Phase 4 row 26), flip the G6 ledger row in INTEGRATED-REMEDIATION-PLAN.md §6, and note in §7.3 that order 1 is done and C3 is next. Do NOT author the lesson; do NOT migrate any module (that is C3).

VERIFY: the module renders with zero page errors; the guidance index lists nine modules; `check-classroom-curriculum.py --strict` clean; CHANGELOG — check the counter, do not assume. Normal Pre-Commit and Pre-Push checklists; one push commit on a claude/* branch (`git ls-remote` first).
```

## Previous Sessions

### Session — 2026-09-12 09:04:12 PM EST (v05.40r)

**Date:** 2026-09-12 09:04:12 PM EST
**Repo version:** v05.40r — **one push commit** on `claude/affectionate-wright-x9cng3` (v05.39r → v05.40r), merged; this remember-session commit follows on the same branch after a rebase onto the merged `main`
**Branch:** `claude/affectionate-wright-x9cng3`
**Model:** Fable 5.1 High as the orchestrator; four research subagents (two per company, first-party then third-party) inherited it — ~53 minutes wall-clock for the push commit, no cap hit

### What was done

1. **v05.40r — S3 V3 · E5 landed: Grid United and Pattern Energy dossiers (schema v7, profileVersion 1, intel-briefing), study guides (schema v2; 12 and 13 sections) and eight-module lesson plans**, 23 concepts registered (bipole, capacity subscription, CITAP, DC tie, development capital, gen-tie, GRIP, interregional transfer capability, negotiated-rate authority, NEPA, NIETC, Order 1920, participant funding, record of decision, share consideration, siting certificate, structured equity, Subscriber PTO, three interconnections, Transmission Facilitation Program, weather diversity, WECC path rating, wind turbine), 21 company-published headshots, registry and quarterly calendar rows, graph rebuilt, all six checkers clean, both dossiers and guides rendered in Playwright with zero page errors
2. **Segments:** both typed **adjacent** on `grid-equipment` (the HVDC converter buyers) and `utilities` (the developers utilities own through or buy from); Pattern also **adjacent** on `storage-developers-and-ipps` — an IPP at scale whose storage book is 20 MW operating plus 220 MW financed, so adjacency rather than a storage position. No floor moved, as §10.3 forecast. **S3 stands at nine of ten.**
3. **Both §8 E5 rows rewritten from the evidence.** Grid United's identity row was half wrong: not "founder-led, Arnold-backed" but **wholly owned by Centaurus Capital LP** (the Arnold family office) per Three Corners Connector's Oklahoma application as reported by OK Energy Today; Arnold is co-founder and chairman; zero Form D. The project row was stale: North Plains Connector cost is ~USD 6B (not 3.2), the final EIS came 2026-08-28, ND PSC hearings were 1–3 September (not August), the consortium is eight utilities plus Great River Energy — all non-binding, 2,550 of 3,000 MW, no binding agreement since January 2025, Avista guiding definitive agreements for late 2026. Pattern's two owner events held; CPP's Q3 FY2026 release adds the only percentage on the record (**69.1% CPP-led**, ambiguous between CPP alone and CPP with APG/ABP and ART); no sale or IPO process; HQ contested on the company's own pages (San Francisco legal/'Global HQ', Houston development and operations); Southern Spirit still without a Mississippi decision; an S&P item dated 2026-08-08 on USD 700M of Pattern notes could not be read
4. **Corpus reconciliation:** 4 inbound files (form-energy, blattner, quanta-services, sargent-lundy), 6 substantive mentions, all consistent, 0 revised. Blattner's source list mis-dates the SunZia EPC release (2023-12 for 2023-05-04) — a label error for that dossier's next revision

### Where we left off

The v05.40r push merged (`22d2150 Update last-processed-commit.sha to 8f45beb`). This remember-session commit is the only thing after it. Nothing in flight. **V4 · E4b+E6b (Mitra Chem · Cornex) is next and is the last S3 session**; the V4 paste-in prompt is below.

### Key decisions and findings

- **Second-hand identity facts are stated as second-hand.** Grid United's ownership exists only in a regulator's file read through trade press (the OCC does not serve filings); Pattern's 69.1% was written by CPP, not Pattern. Both are flagged in the dossiers and are the first watch items in their calendar rows
- **Keep the corporate and project layers distinct (as instructed) and it paid off:** every North Plains partner sits in North Plains Connector LLC on an MOU that says 'Grid United will continue to fund the development' — the developer carries all the development capital until permits; ALLETE's owner changed (CPP/GIP, December 2025) before any definitive agreement existed
- **Pattern's project anchors were verified from its newsroom first, then checked outside:** WECC dates energisation to 2025 and testing through Q1 2026, EIA gives 3,650 MW from 916 turbines against 3,515 MW nameplate at order — both quoted, unreconciled; the Cordelio fleet is not listed by the company, 14 of 16 identified from portfolio pages
- **A taxonomy observation for S2, not acted on:** the two transmission developers are adjacent on `grid-equipment` as **buyers** of HVDC converter capacity — the segment's buying criteria carry lead time and the manufacturing slot but not the capacity-reservation instrument; recorded in the §10.5 note
- **Checker limit recorded:** `check-profiler-crossrefs.py` skips 30 scopes over its 900-character cap, including one product entry in each new dossier; a clean run is not full coverage
- **Environment:** sec.gov / data.sec.gov 403 (partner utilities' 8-Ks read via StockTitan mirrors; HASI's 8-K via its investor site); `efts.sec.gov` full-text search answered (zero Form D for either company); businesswire.com 403 (company, Yahoo and Nasdaq copies cited with the wire URL where the wire is the origin); gridunited.com and northplainsconnector.com return a bot-check page to WebFetch but 200 to curl with a browser User-Agent, and all six Grid United sites plus patternenergy.com expose open WordPress REST APIs (`/wp-json/wp/v2/posts|pages|team|projects|media`) — the fastest route to a complete first-party archive; spglobal.com ratings pages and cppinvestments.com report pages blocked
- **Render recipe unchanged from V2**, with one fix: open a fresh Playwright page per company — the study-guide overlay from the first company otherwise intercepts the second company's `#ov-study-btn` click. Script at the scratchpad `render.py` (session-local, not committed)
- **JSON formatting trap hit once:** the concepts registry was rewritten at indent=1 (a 24,000-line diff) and redone at its own indent=2 before staging — the `git diff --stat` check the prompt asked for caught it
- **Model call held:** Fable 5.1 High as planned, no substitution

### Active context

- **Repo version** `v05.40r`; **CHANGELOG at 93/100** total, 13 dated 2026-09-12 and exempt → ~80 non-exempt; no rotation inside V4
- **S3: 9 of 10.** Remaining: **V4 · `E4b+E6b` (Mitra Chem · Cornex)**, Fable 5.1 High; identity notes in the §8 rows (Mitra Chem's legal name is Mitra Future Technologies, Inc., CIK 0001887663; Cornex is 楚能新能源股份有限公司, NOT 中比新能源/CBAK; ICL is no longer a usable public alternate). V4 completes the SNE H1-2026 storage-cell top twelve (`cornex` 7th at 30.2 GWh, P6's finding). **S3 is done when** the curriculum plan's §6 register (G10) is re-run after V4
- **Page versions (unchanged):** Profiler `v01.86w`, Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Still awaiting developer approval (§10.5 item D):** `aka[]` in the `Profiler.html` roster search haystack (~line 2202); this session added 37 more aliases the roster cannot find
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **S3 V4 · E4b+E6b (Mitra Chem · Cornex) on Fable 5.1 High** as a fresh session — the last S3 session, both private cells-and-chemistry names under a segment already at the floor; dossier + study guide for both in one push commit, segments assigned with a `basis` line each, both §8 rows rewritten, then re-run the curriculum plan's §6 register so S3 can be closed.

**To continue:** paste the V4 prompt below into a new Fable 5.1 High session:

```text
Picking up from my last session, run Phase E of repository-information/PROFILER-COVERAGE-PLAN.md on
Fable 5.1 High as a fresh session: S3 V4 · E4b+E6b — Mitra Chem, Cornex (the last S3 session).
READ FIRST: repository-information/SESSION-CONTEXT.md; PROFILER-COVERAGE-PLAN.md §2, §7, §10.2–10.5 and the
E4b and E6b rows in §8 (both carry identity corrections from 2026-09-09 — Mitra Chem's registered legal entity is
Mitra Future Technologies, Inc. (Delaware, SEC CIK 0001887663), trading as Mitra Chem, private and VC-backed, with a
Form D filed 2025-06-09 and a Muskegon, MI LFP cathode plant guided to break ground in early 2026, and a company news
page silent since 2024-09-20; Cornex is CORNEX NEW ENERGY CO., LTD. / 楚能新能源股份有限公司 (Chuneng New Energy),
Xiaogan/Wuhan, Hubei, founder-controlled by 代德明 (Dai Deming, ~76.15% equity, 92.5% of votes), NOT 中比新能源 —
that string is CBAK Energy (Nasdaq: CBAT), an unrelated company — with no IPO and no IPO filing anywhere; ICL Group
is no longer a usable public alternate for E4b because it discontinued its US LFP cathode project on 2025-11-11);
.claude/rules/profiler-app.md (Profiler Command incl. step 1a identity verification and step 7 corpus reconciliation,
Profiler Prep Command, Scheduled Refreshes); repository-information/PROFILER-SCHEMA.md;
repository-information/PROFILER-STYLES.md (active style: intel-briefing).
THE TASK, per company: `profiler <Company>` then `profiler prep <Company>` — dossier (schema v7, profileVersion 1,
categories per the §8 rows: both supplier; put the legal names in `name` and every alias, native-script name and
trading name in the registry `aka[]`) and study guide (schema v2) — then the registry sync, the graph build, the
study validator, the relationships and crossrefs checkers, a calendar row each (both private → quarterly cadence;
Mitra Chem's first watch item: the Muskegon groundbreaking, the open Form D round and any sign of life on the news
page; Cornex's: any IPO filing at HKEXnews or the CSRC, the Xiangyang and Wuhan phase-2 ramps, and the SNE storage-cell
rank), README tree entries, and flip both §8 rows.
Then assign each company's segments and roles in live-site-pages/profiler-data/profiler-segments.json with a basis
line per PROFILER-SCHEMA.md → Segments registry (the §8 Segment · role cells — cells-and-chemistry · adjacent for
Mitra Chem as upstream cathode material, cells-and-chemistry · challenger for Cornex on its SNE rank, plus
storage-integrators-and-containers · adjacent for Cornex if its storage systems support it — are hypotheses: write
what the dossier supports), and rewrite the §8 Phase E rows.
THE §8 ROW IS A HYPOTHESIS, NOT A BRIEF: treat every claim in its `Why` cell as unverified, re-run step 1a on both
identities (Mitra Chem's round may have closed or the company may have gone quiet or been acquired; Cornex's founder
control and no-IPO status may have moved), and rewrite that cell plus the `Checked` column with what you actually
found before you commit.
SESSION NOTES: V4 is pure deepening on a segment at the floor — no landscape is gated on it — but it completes the SNE
H1-2026 storage-cell top twelve (cornex is 7th at 30.2 GWh, above CALB and Great Power, which P6 landed), so read the
same SNE table the P6 session cited and type Cornex against it. Mitra Chem is a thin, English-language record where
EDGAR is the spine: sec.gov is blocked from this environment but efts.sec.gov full-text search answers for Form D
text and CIK lookups; run python3 scripts/check-source-reachability.py before Stage 2 and probe the hosts you need
more than once. Cornex is a Chinese-language record: its own site and WeChat-derived releases, Hubei DRC and
provincial approvals, cninfo/HKEXnews only to prove the absence of a listing, and Chinese trade press
(高工锂电, 起点锂电, 中国储能网) for the SNE and CIBF figures — quote native-script names alongside romanisations
and keep 楚能 and 中比 apart in every grep. businesswire.com returns 403 (use company copies, cite the wire URL).
Company-published leadership headshots are permitted — download to live-site-pages/images/execs/<slug>-<lastname>.jpg.
One push commit. JSON formatting: profiler-segments.json and the refresh calendar are indent=1, the registry and the
concepts registry indent=2, always ensure_ascii=False, never re-sort the roster — check git diff --stat before staging
(V3 caught a 24,000-line concepts rewrite this way). CHANGELOG headroom: 93/100 after v05.40r, ~80 non-exempt — no
rotation due. After both rows flip, re-run the §6 register checks in CLASSROOM-CURRICULUM-PLAN.md (G10) and date
them, and write the S3 close-out note in §10.5 — S3 is done only when that register has been re-run, never by the
plan's say-so.
VERIFY: sync-profiler-registry.py --check clean, check-profiler-study.py clean, check-profiler-relationships.py and
check-profiler-crossrefs.py clean, the dossiers and guides render (Playwright; the sign-in wall can be bypassed in a
scratch copy served over local HTTP with `var _e = ''` and localStorage ov_note_role = 'analyst' — never edit the
repo's Profiler.html for this; dossier tab keys are overview/products/devs/policy/strategy/people/fin/sources; the
study guide opens from the `#ov-study-btn` button — open a fresh page per company, or the first guide's overlay
blocks the second button), zero page errors. Normal Pre-Commit and Pre-Push checklists; push on a claude/* branch.
```

Developed by: LightAISolutions
