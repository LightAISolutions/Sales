# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-13 12:23:26 AM EST
**Repo version:** v05.44r — **one push commit** on `claude/jolly-meitner-06wd3n` (v05.43r → v05.44r), merged; this remember-session commit follows on the same branch
**Branch:** `claude/jolly-meitner-06wd3n`
**Model:** Opus 5 xhigh as the orchestrator; **no subagents** — the whole migration was done in-session with Bash, Python extraction scripts and Playwright. ~31 minutes for the push commit against a 55-minute estimate, no cap hit

### What was done

**C3 session 1 of 2–3 — the Guidance Homecoming. Order 2 of the §7.3 run table, now under way.**

1. **The nine `guidanceDoc*_()` module literals and `guidanceDocs_` / `guidanceIndex_` / `guidanceDoc_` are in `Classroom.gs`, copied byte-for-byte from `Profiler.gs`** (5,583 lines of content; 5,622 with their `// Content:` comment blocks), placed **below `// CONTENT END`** and inside the `// PROJECT START`/`// PROJECT END` region. `handleGuidanceOp_(e)` answers `gop=index|doc` behind `clRequire_(sess,'guidance')`, and `action=guidance` is wired into both routers (the doPost fetch route and `action=api&op=guidance`). Classroom `v01.19g` → `v01.20g`
2. **`Classroom.html` `v01.09w` → `v01.10w`** — the guidance surface: `#guidance` (lane-grouped library with review and revised chips), `#guidance/<id>[/<section>]`, `#guidance-glossary` (122 terms, each definition beside its source module), and cross-module search with snippet highlighting. Rendered entirely through the existing `cl*` primitives — **nothing was ported from `Profiler.html`'s `gd*` engine**, because C1 slice 2 had already brought every section kind across. `clRenderSection` gained `opts.readOnly`; `clApplyProgressUI` returns early on a guidance view so the study-next and drill cards cannot leak into a library page; the guidance nav marker is a plain bullet, not an unfillable checkbox
3. **The slice plan is written into `PHASE6-CLASSROOM-DESIGN.md`** under the C3 bullet — the design's eight checklist items mapped to sessions 1/2/3 plus the two invariants, the file-layout decision with its full reasoning, the duplicate-window rationale, and why guidance is read-only until session 3
4. **`scripts/check-guidance-parity.py` (new)** — the duplicate-window guard: all twelve functions byte-identical in both `.gs` files, and the module ids matching. Deleted in session 3 with Profiler's copy
5. **`repository-information/diagrams/Classroom-diagram.md`** — the now-false pre-C3 sentence corrected and a new **Industry Guidance** design note added (ops, gate, routes, fence placement, read-only window, parity guard). The Mermaid sequence was left alone: it depicts neither guidance nor the C4 drill, so nothing in it was falsified and **no pako regeneration was needed**
6. **`INTEGRATED-REMEDIATION-PLAN.md` §7.10 — the paste-in brief for C3 session 2** (written in this remember-session commit), plus run-table row 2 flipped to "session 1 done" and a dated v05.44r progress note
7. **Verified:** `node --check` on `Classroom.gs` and both page script blocks; `check-gas-inner-scripts.js` (9 files / 86 blocks); a Playwright render + screenshot read of **every new surface** with **zero page errors**; the server gate proved per tier in Node; `check-guidance-parity.py`, `check-readme-tree.py`, `check-classroom-curriculum.py --strict` and `check-classroom-pipeline.py --selftest` all clean

### Where we left off

The v05.44r push merged. Nothing in flight. **C3 session 2 is next** — its paste-in brief is `INTEGRATED-REMEDIATION-PLAN.md` **§7.10**, written in this commit at the developer's request and reproduced under *Recommendation* below.

### Key decisions and findings

- **The file-layout question was decided by the deployer, not the checker.** `scripts/check-gas-inner-scripts.js` walks `googleAppsScripts/*/*.gs`, so a second `.gs` is fine *to the toolchain* — but `pullAndDeployFromGitHub()` fetches exactly `FILE_PATH` and PUTs `[{name:"Code", type:"SERVER_JS", source:newCode}, manifest]` to `projects/<id>/content`, an API call that **replaces the project's entire file set**. A second file would be deleted by the next merge-triggered deploy, taking `guidanceDocs_()` with it; it also has no `var VERSION` line, which is exactly what the deployer diffs to decide whether to deploy at all. Supporting one would mean rewriting the pull-deploy path all nine projects share, with no staging environment. **One `.gs`.**
- **The isolation a second file was wanted for is what the `// CONTENT END` fence already gives.** Guidance sits below it, so the unattended C2 pipeline's write set stays exactly what `CLASSROOM-COMMITTER-CONTRACT.md` §3 says it is — the `clLesson*_` / `clTrack*_` literals and the two registries — and `check-classroom-pipeline.py` (P2) already enforces that.
- **Function names kept byte-identical** (`guidanceDoc*_`, `guidanceDocs_`, `guidanceIndex_`, `guidanceDoc_`), so the move is diffable by a checker and session 3's `.claude/rules/industry-guidance.md` re-target is a one-line file change rather than a rewrite.
- **The duplicate is deliberate and guarded.** Profiler must keep serving until its slice is cut over, and `guidanceMentions_()` (session 2) cannot answer without the content beside it. The named collision: **the bankability review (`bess-bankability-2026-08`, `reviewBy` 2026-10-01) is §7.3 order 3 and edits a module** — it must edit **both** copies or `check-guidance-parity.py` fails the build.
- **Read-only on purpose.** Wiring guidance ticks now would open a second progress store (`cl_progress:`) beside Profiler's `gd_progress:` during the very window session 3's one-shot import exists to reconcile. Profiler stays the place guidance is *studied* until then; no guidance item enters the drill before that — decision 6 unchanged.
- **Two pre-existing failures, confirmed byte-identical against a pristine `HEAD` worktree** (run this check before attributing either to a change): `check-classroom-content.py` exits 1 with **24 errors** — ten `segment-*` lessons whose `the-players` rows and `profile:` inputs no longer match their registry members after S3 added Cornex, Mitra Chem, Stem, Pattern Energy, Grid United, Heron Power, gridmatic and Supermicro; regenerating them is `build-classroom-segments.py` work owned by the **S2** sessions (curriculum plan §10.9). `verify-profiler-roles.py` reports **2 progress-persistence failures** in Profiler; its full 13-surface × 4-tier access matrix passes.
- **The Classroom environment diagram is behind on C4** — the drill has no node and no design note. Not fixed here (C3 corrected only what it falsified), but worth a future sweep.
- **Render recipe for Classroom (new, and it works):** scratch copy of `Classroom.html` in the scratchpad with `var _e = ''` and `AUTO_REFRESH = false`, opened `file://` with `bypass_csp`; then stub **the transport, not the caller** — override `window._gasPost` to answer `action=guidance` from module JSON dumped out of `Classroom.gs` by Node, and `window.loadSession` to return a 40-char token with the tier under test — so the real `clGuidanceApi` → `clRoute` → renderer path runs. **Hide `#auth-wall`** (and `.splash`, `#gas-pill`, `#verify-overlay`) or it intercepts every pointer event and `hover` times out. Then `clHeaderShow(); clAppMount();`. `file://` CORS errors for `sounds/*.mp3` and `profiler-data/profiler-concepts.json` are expected and are **not** page errors — count `pageerror` events only. Playwright installs with `pip install playwright`; browser at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`.
- **Gate-proving recipe (stronger than a page render):** extract the `// PROJECT START` … `// PROJECT END` region with a regex, stub `auditLog`/`dataAuditLog`/`validateSessionForData`, and call `handleGuidanceOp_` in Node once per tier — the same technique `check-classroom-content.py` uses for the lesson gate. It proved analyst/viewer/unknown get `ROLE_DENIED` on `index` as well as `doc` (no titles leak into a filtered list), and that denials audit as `classroom_not_admitted` / `classroom_capability_denied`.
- **CHANGELOG counter trap:** `Sections: 96/100` matched **three** places in the file (the header plus two historical notes quoting old counters). Anchor the replacement on the header's surrounding newlines, and verify the count empirically with `grep -c '^## \[v[0-9]'` rather than trusting the header.

### Active context

- **Repo version** `v05.44r`; **CHANGELOG at 97/100** — three pushes of headroom, rotation is close; **`Scrapergs.changelog.md` at 49/50** (the next Scraper GAS bump is the last before mandatory rotation); `Classroomhtml.changelog.md` 10/50, `Classroomgs.changelog.md` 20/50, `Profilergs.changelog.md` 36/50
- **GAS versions:** Classroom `v01.20g` (bumped), Profiler `v01.36g`, Scraper `v02.02g`. **Page versions:** Classroom `v01.10w` (bumped), Profiler `v01.87w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Facts session 2 will need, already established:** reports live at `live-site-pages/profiler-data/reports/` (`OV_BASE` and `CL_DATA_BASE` are both `profiler-data/`); **four `current` reports carry `overlayModules`, giving twelve overlay panels across five modules** — `nvidia-800vdc` 3, `power-infra-aidc` 3, `bess-bankability` 2, `china-policy-stack` 2, `utility-aidc-procurement` 2 — and the `bess-bankability/counterparty` and `power-infra-aidc/markets` anchors each take a panel from **two** different reports, so the renderer must append, not replace. `CL_ROLE_CAPS` already grants `reports` to admin only, so no access-matrix value should change. `gdApplyLens` inserts before `.gd-done-btn`; there is **no** `.cl-done-btn` on a read-only guidance section, so the port must not drop the panel on a missed selector. The mentions route mirrors `scHandleCorpus_` in `Scraper.gs` and needs a **new** shared Script Property, not `CORPUS_TOKEN`
- **Run order from here:** **C3 session 2** (§7.10) → C3 session 3 → the **bankability review** (`reviewBy` 2026-10-01, and it must edit both copies while the duplicate stands) → Phase 4 row 1 → S2 ∥ Phase 4 → K2 → rows 25–26 → C5 → the plan clock. **~55 sessions remain**
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **C3 session 2, the Guidance Homecoming's middle slice, on Opus 5 xhigh** from the `INTEGRATED-REMEDIATION-PLAN.md` §7.10 brief — checklist items 2 and 3 only: the Admin lens re-hosted in Classroom under `clCan('reports')` reading the public `reports/*.report.json`, and `guidanceMentions_()` moved to Classroom behind one narrow token-gated route that `Profiler.gs` proxies on the `scHandleCorpus_` pattern, with the dossier chips still working through an unchanged `ovGuideApi('mentions')` call. Do not delete Profiler's copy and do not wire guidance ticks — both are session 3.

**To continue:** paste the C3 session 2 prompt (reproduced in chat, and stored as §7.10 of `INTEGRATED-REMEDIATION-PLAN.md`) into a new Opus 5 xhigh session.

## Previous Sessions

### Session — 2026-09-12 11:40:59 PM EST (v05.43r)

**Date:** 2026-09-12 11:40:59 PM EST
**Repo version:** v05.43r — **one push commit** on `claude/stoic-hypatia-i0f7vr` (v05.42r → v05.43r); this remember-session commit follows on the same branch
**Branch:** `claude/stoic-hypatia-i0f7vr`
**Model:** Opus 5 xhigh as the orchestrator; one Explore subagent (the seven-guide survey) inherited it — ~35 minutes of research, ~60 minutes total, no cap hit

#### What was done

**G6 — the large-load interconnection guidance module. Order 1 of the §7.3 run table, done in one session.**

1. **`large-load-interconnection-2026-09` is the ninth module in `guidanceDocs_()`**, registered immediately after `utility-aidc-procurement-2026-08` so the "The AI Data-Center Wave" lane stays contiguous. Title *Large-Load Interconnection: The Federal Rulebook Above the Fence*; contributor tier through the existing `GUIDANCE_ROLES` gate; twelve sections (2 `prose`, 4 `table`, 1 `timeline` with three CVD lanes and twelve dated items, 1 `proscons`, 1 `callout`, `flashcards` 9, `quiz` 6, `ledger` 32 rows), four `tiles`, 21 glossary terms, 19 `{{term}}` tooltips all resolving, `reviewBy` **2026-11-16**
2. **`repository-information/industry-guidance/large-load-interconnection-2026-09-analysis.md`** — 301 lines, 15 sections, a 50-plus-row claims ledger that labels every second-hand item, a ten-item "what the record does NOT say", and a freshness gate deriving `reviewBy` from three converging November 2026 dates (the 90-day abeyance filings, FERC's own projected next action on RM26-4, and the PJM compliance outcomes)
3. **Primary-source research only.** Federal Register full text of **Order No. 2023** (RM22-14-000, 88 FR 61014, effective 2023-11-06) and **2023-A** (RM22-14-001, 89 FR 27006, effective 2024-05-16); the six FR notices instituting the large-load **FPA §206** proceedings (91 FR 37968–37975, 2026-06-24); FERC's orders in **PJM co-location** (193 FERC ¶ 61,217, 2025-12-18, EL25-49-000 *et al.*), **SPP HILL/HILLGA** (194 FERC ¶ 61,031, ER26-247-000) and **SPP CHILLS** (195 FERC ¶ 61,196, ER26-1323); FERC's Unified Agenda for **RM26-4-000** (91 FR 53150); the 2026-06-18 Sunshine Act notice (91 FR 36126); Texas **SB 6** (89R, effective 2025-06-20)
4. **Scraper seed `topic-federal-interconnection`** (Scraper `v02.01g` → `v02.02g`), terms deliberately federal and narrow — the existing `topic-utility-procurement` seed already carries *interconnection*, *large load*, *co-location* and the RTO names, so repeating them would split one band rather than open a new one
5. **Register row G6 CLOSED** in `CLASSROOM-CURRICULUM-PLAN.md` §6 with a dated re-check note — **the gap register now has no open row at all**. G6's ledger row in `INTEGRATED-REMEDIATION-PLAN.md` §6 flipped to Done; C3's row flipped to NEXT UP; §7.3 rows 1–2 updated and a dated progress note added
6. **Verified:** `node --check` on both `.gs` files, `check-gas-inner-scripts.js` (9 files / 86 blocks), a Playwright `gdRenderDoc()` render with **zero page errors** (13 section nodes, 5 tables, 12 timeline items, 32 glossary spans, the `reviewBy` chip plain), `guidanceDocs_()` returns nine, `check-classroom-curriculum.py --strict` clean, `check-readme-tree.py` 0 findings after `--fix` synced the two GAS displays

#### Where we left off

The push merged. Nothing in flight. **G6 is closed and C3 is the next session** — a paste-in prompt for it was written in chat at the developer's request and is reproduced under *Recommendation* below.

#### Key decisions and findings

- **The module was composed AGAINST the seven guides, not over them.** An Explore subagent read `dominion-energy`, `oncor`, `aep`, `southern-company`, `xcel-energy`, `entergy` and `burns-mcdonnell` in full and returned ten things they already teach well and ten federal-layer gaps. The module therefore carries **no** tariff anatomy, **no** minimum-demand arithmetic and **no** SB 6 clauses — it references the guide section by id and moves on
- **The finding the module turns on:** "large load" and "load interconnection" each appear **zero times** in the 336 Federal Register pages of Order No. 2023, and zero in 2023-A along with "co-location" and "data cent". Three federal rulemakings in twenty years standardised generator interconnection and none addressed load — which is the space the state large-load tariff grew into. "Order 2023" and FERC docket numbers now appear in the corpus for the first time
- **Environment, and it shaped the sourcing:** **`ferc.gov` 403 and `misoenergy.org` 403** from this network on every path; `elibrary.ferc.gov` redirects. `federalregister.gov` (including its JSON API and `full_text/text/…` route), `govinfo.gov`, `spp.org` (which publishes FERC's own order PDFs), `pjm.com`, `ercot.com` and `capitol.texas.gov` all answered. `sec.gov` / `data.sec.gov` still 403. The six §206 orders are therefore established from their FR notices plus professional summaries, and the module's honesty section says so
- **One citation conflict, recorded not smoothed:** a secondary summary gives 195 FERC ¶ 61,209 for the PJM large-load order; the FR notice ties **¶ 61,211** to EL26-67-000 explicitly. Primary wins, and the module states the discrepancy
- **The 50 MW / >69 kV threshold is in the module only as FERC's *suggestion under investigation*** — two law-firm summaries of the same orders report no threshold at all. The only load thresholds stated as law are SPP's (10 MW ≤69 kV / 50 MW >69 kV) and Texas's 75 MW
- **The curriculum plan's §3.3 prediction checked out** (Dec 2025 PJM order → June 2026 orders to all six RTOs), with one correction: June 2026 produced **six §206 investigations, not a rulemaking**, and RM26-4 still reads "Next Action Undetermined" on FERC's August 2026 agenda

#### Active context

- **Repo version** `v05.43r`; **CHANGELOG at 96/100** (no rotation due); **`Scrapergs.changelog.md` at 49/50** — the next Scraper GAS bump is the last before mandatory rotation; `Profilergs.changelog.md` at 36/50
- **GAS versions:** Profiler `v01.36g`, Scraper `v02.02g`. **Page versions unchanged this session** — Profiler `v01.87w`, Classroom `v01.09w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Run order from here:** **C3** (Opus 5 xhigh, 2–3 sessions) → the **bankability review** (`bess-bankability-2026-08` `reviewBy` **2026-10-01**, already inside the 30-day horizon and flagged by the curriculum checker) → Phase 4 row 1 → S2 ∥ Phase 4 → K2 → rows 25–26 → C5 → the plan clock. **~56 sessions remain**
- **Sizes C3 will care about:** the nine `guidanceDoc*_()` content functions are **~5,590 lines of a 14,748-line `Profiler.gs`**; `Classroom.gs` is already **~39,900 lines**. `Classroom.html` already carries the `cl*` guidance renderer from C1 slice 2; `CL_ROLE_CAPS` already grants `guidance` to admin and contributor, and `CL_PROVENANCE_CAPS` already maps `'guidance' → 'guidance'`
- **Module render recipe (guidance, as used this session):** extract the module JSON straight out of `Profiler.gs`, write a **scratch copy** of `Profiler.html` with `var _e = ''`, open it `file://` with `bypass_csp`, then call `gdRenderDoc(doc, shell, {})` directly — never edit the repo's page. Playwright installs with `pip install playwright`; the browser is already at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. `ERR_FILE_NOT_FOUND` console errors for relative assets are expected under `file://` and are not page errors
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

#### Recommendation for next session

- Run **C3, the Guidance Homecoming, session 1 of 2–3, on Opus 5 xhigh** — open by writing the slice plan and the file-layout decision (one `Classroom.gs` or a second `.gs` in the same project, given ~5,590 lines moving into a ~39,900-line file) into `PHASE6-CLASSROOM-DESIGN.md` under the C3 bullet, then execute session 1's slice only: the module content functions and the `guidanceDocs_`/index/doc/search/unified-glossary ops moving to Classroom under its own role gate and rendering there. Module ids must stay byte-identical (Scraper's `guidance:<module-id>` seeds depend on them), and Profiler's guidance keeps working until its slice is cut over.

**To continue:** type `continue with your recommendation`

Developed by: LightAISolutions
