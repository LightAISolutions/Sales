# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-08 06:32:46 AM EST
**Repo version:** v05.17r — one push commit on `claude/fable-5-1-high-code-ht15vb` (session context folded into the same commit)
**Branch:** `claude/fable-5-1-high-code-ht15vb`
**Model:** Fable 5.1 High — **S1, the code half. CODE HALF IS CLOSED; the lesson half (`reading-the-graph`, Opus 5 xhigh) is OPEN and has a paste-in brief below.**

### What was done

- **`scripts/build-classroom-segments.py`** written and run: nineteen `segment-*` lessons generated into `Classroom.gs` inside the content fence at `--today 2026-09-08` (ten fixed sections, `group` `The Value Chain`, all-public stamps read off the fetched files — member dossiers' `lastUpdated`, graph `built` 2026-09-08, concepts commit date 2026-09-07 on `origin/main`). Deterministic: a forced `--all` rerun rewrote nothing; `--check` at 0 due
- **Three Value Chain tracks** created and registered at the end of `clTracks_()`: `value-chain-makers` (3), `value-chain-builders` (7, prereq makers), `value-chain-buyers-and-backers` (9, prereq makers)
- **`scripts/check-classroom-curriculum.py`** written: lanes/tracks + gate distribution, segment floor table, stale pins (26 real ones on the hand-authored lessons), regeneration-due via the generator, drill pool (1,920 study + 203 lesson + 283 roster rows), review dates (1: `bess-bankability-2026-08` at 2026-10-01). `--strict` clean
- **`scripts/check-classroom-content.py`**: fourth lane admitted; `check_segment_lessons()` assertion added (ten ids in order, `profile:` inputs == members, `the-players` Dossier column == members with roles, all-public). 29 lessons / 6 tracks, 0 / 0
- **`scripts/sync-profiler-registry.py`**: `segments[]` mirror written into `profiler-companies.json` (154 / 154; `--check` clean)
- Classroom GAS **v01.17g → v01.18g** (page unchanged at v01.08w); docs updated (plan §6 / §7.3, curriculum §10, `PROFILER-SCHEMA.md`, `CLASSROOM-SCHEMA.md`, README tree)

### Where we left off

v05.17r pushed. Content checker 0 / 0; pipeline checker P1 (developer files) + P10 (nineteen modules — the documented developer-run cap breach) only, **no P3, no P5**; `--selftest` 13 / 0; `node --check`, inner scripts, sync `--check`, health `--strict`, generator `--check` all clean. **Next: the Opus 5 xhigh session authors `reading-the-graph` and inserts it at position 1 of `value-chain-makers`** (brief below). Then the §6 ledger continues: S3 (0/19), G6 (ready), C3, S2 (0/19), 4 (0/26), K2, C5, C6 deferred.

### Key decisions and findings

- **Tracks appended at the end of `clTracks_()`, not "after `market-access`"** — that track does not exist yet. Recorded in the plan; the session that creates `market-access` may insert it before the three (developer session, not P5-bound; nobody holds progress on them yet)
- **`the-players` carries a `Dossier` slug column** instead of the planned "dossier chip" — the Classroom renderer (`clFmt`) has no chip or link syntax, only bold / italic / `{{term}}`. The slug is what the content checker's assertion and K2's roster deck key on; a clickable chip is a renderer feature for K2 or C3
- **Criterion → lesson matching is restricted to the segment's own read-next lessons** — a bare keyword hit across the curriculum was noise (cooling's "part-load efficiency" pointed at the inverter lesson)
- **`who-is-connected` shows all in-segment curated edges and the first 40 neighbour-segment edges** (totals in the section `note`); the integrators segment would otherwise carry 209 rows. `what-moved` capped at 12 per the plan
- **The concepts pin must be read on a fresh `origin/main`** — the first run pinned 2026-09-04 off a stale local ref; after `git fetch origin main` it read 2026-09-07 and the lessons were regenerated from the pre-run backup so no first-generation lesson carries a revision entry. The generator falls back to HEAD with a warning only when the base ref is missing
- **Session context folded into the push commit** rather than a separate `Remember session context` commit — push-once + single-commit-per-interaction
- **Checker facts worth keeping:** the 26 stale pins on the hand-authored lessons are real corpus drift (concepts 08-31/09-03 → 09-07, `study:vertiv` 08-21 → 09-04, `bridge-power`'s seven dossiers and four projects) — the C2 pipeline's candidate list, untouched here; `check-profiler-reports.py` still 0 / 0 with 2 aged pins quiet

### Active context

- **Branch:** `claude/fable-5-1-high-code-ht15vb` · **repo version:** v05.17r · **Classroom GAS:** v01.18g · **Classroom page:** v01.08w · **Profiler page:** v01.83w (data-only indirect affect — `profiler-companies.json` gained `segments[]`, no bump)
- **Corpus:** 154 companies / 154 profiles / 154 study guides / 1,210 concepts / 1,260 edges, 3,690 evidence items / 9 named projects / 8 guidance modules / 8 reports (4 current) / 19 segments · **Classroom:** 29 lessons (10 mechanism + 19 segment), 6 tracks, 4 lanes
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG:** **104 sections, 6 dated 2026-09-08** (`v05.12r`–`v05.17r`) → 98 non-exempt, no rotation today. **A later EST day → 104 non-exempt → ROTATION FIRES** on the twenty-one `2026-09-02` sections (`v04.14r`–`v04.34r`) → 83; run `git fetch --unshallow` before any SHA lookup
- **Plan ledger (§6):** 0 · 1 · 2a · 2b · 3 · S0 · K1 · 5 · 6 Done · **S1 code Done / lesson Open**; next S3 (0/19) · G6 (ready) · C3 · S2 (0/19) · 4 (0/26) · K2 · C5 · C6 deferred
- **Standing, unassigned:** unchanged from v05.16r (the two `verify-profiler-roles.py` progress-isolation failures; `archive/nvidia.profile.v2.json` missing; one archive gap per dossier touched last session; README archive-tree drift ~61 entries; `huawei`'s FCC `policyExposure` over 900 chars; `byd` segment `basis` line; overdue desk rows `iren` / `jinko` 08-27). New: **the Classroom renderer has no dossier-chip syntax** (K2/C3); **`market-access` will land after the Value Chain tracks in registry order unless inserted**
- **Routine note:** unchanged — none created, updated or deleted

### Recommendation for next session

- Run the **S1 lesson half on Opus 5 xhigh**: author `reading-the-graph`, the Value Chain lane's opener, and insert it at position 1 of `value-chain-makers`. It is the natural next step because the nineteen segment lessons already assume it — every `who-is-connected` table and every player table reads on the vocabulary this lesson teaches — and nothing upstream moves under it (all inputs public, checkers at 0 / 0).

**To continue:** paste the brief below into a new Opus 5 xhigh session.

### Paste-in brief for the Opus 5 xhigh session — `reading-the-graph` (S1 lesson half)

> Run the S1 lesson half: author `reading-the-graph`, the opener of the Value Chain lane, and insert it at position 1 of the `value-chain-makers` track. The code half landed at v05.17r (Fable 5.1 High): the nineteen `segment-*` lessons and the three Value Chain tracks are in `Classroom.gs`, the content checker now asserts segment lessons and admits the lane `The Value Chain`, and `scripts/check-classroom-curriculum.py` reports the curriculum.
>
> READ FIRST: `repository-information/SESSION-CONTEXT.md` (Latest Session); `CLASSROOM-CURRICULUM-PLAN.md` §10.1–10.3 (what a segment lesson is, the three roles, the player table and `who-is-connected` shapes) and **§10.5** (the lesson's spec — id, gate, inputs, the nine proposed sections); `CLASSROOM-SCHEMA.md` (lesson schema v1, the stamp, the content contract — this is a **mechanism** lesson: never company trivia, the credit-substitution chain is a worked example, not the answer to any card); `.claude/rules/classroom-app.md` (the write order, G2 / G7 / §5.2, versioning and verification); `PROFILER-SCHEMA.md` → "Relationship graph" (edge shape: `a` · `b` · `curated{a|b}{type,note,context,source,status,since,scale,via,project}` · `evid[]` · `last`; the seven types `customer` / `supplier` / `competitor` / `partner` / `investor` / `portfolio` / `other` and their inverses; curated against derived). Then open one generated literal — `clLessonSegmentCooling_()` in `Classroom.gs` — to see the `the-players` (Company · Dossier · Role · Basis) and `who-is-connected` (From · To · Type · Status · Scale · Via) tables the lesson must teach a reader to read. Read `live-site-pages/Profiler.html` around the `#network` ecosystem explorer (search "Ecosystem explorer") so `the-explorer` describes the real UI and invents nothing.
>
> THE WORKED EXAMPLE: the credit-substitution chain — `profile:fluidstack` · `profile:hut-8` · `profile:terawulf` (three landlords, one tenant of record, one backstop, typed differently at each end). Fetch the three dossiers and the graph edges among them (`profiler-graph.json`, the `a`/`b` pairs over those slugs) and teach only what those records state. Add a fourth dossier only if you actually read it and the lesson takes something from it.
>
> THE LESSON: `clLessonReadingTheGraph_()` inside `// CONTENT START` … `// CONTENT END`, after the last `clLesson*` literal and before the first `clTrack*` literal. `id` `reading-the-graph`, `type` `module`, `group` `The Value Chain`, public — inputs `graph:profiler-graph` (date = the graph's `built`, read off the file), `concepts:profiler-concepts` (date = `git log -1 --format=%cs origin/main -- live-site-pages/profiler-data/profiler-concepts.json`, after `git fetch origin main`), and the `profile:` refs at each dossier's own `lastUpdated`. Sections, fixed here for life: `what-an-edge-is` · `seven-types-two-directions` · `reading-the-chips` · `one-chain-three-typings` · `the-explorer` · `segments-and-roles` · `where-it-fails` · `drill` (flashcards) · `check-yourself` (quiz, five items). `segments-and-roles` teaches what a segment is, what incumbent / challenger / adjacent mean (quote `profiler-segments.json`'s `roles` definitions), and how to read a player table and a `who-is-connected` section. `where-it-fails` covers at least: a derived mention read as a deal; a `partner` edge that is really a customer; an edge whose `status` moved. `reviewBy` from the lesson's own nearest dated gate, else ~6 months. Strict JSON, no `[c:]` tokens, `{{term}}` only for terms in `profiler-concepts.json` or the lesson's own `glossary[]`. Register it by appending to the **end** of `clLessons_()`.
>
> THE TRACK: insert `"reading-the-graph"` at **position 1** of `clTrackValueChainMakers_()`'s `lessons[]` (before `segment-cells-and-chemistry`) and set that track's `updated` to today. This is a developer session, so P5's append-only finding on that track is expected and acceptable — record it in the CHANGELOG; no account holds progress on the track yet.
>
> VERSIONING: Classroom GAS `v01.18g` → `v01.19g` (`var VERSION` + `live-site-pages/gs-versions/Classroomgs.version.txt` + the README tree's Classroom GAS display); page unchanged unless you touch `Classroom.html`. GAS changelog: generic lines only ("A new lesson opens the Value Chain lane", "Curriculum updated"). Repo `v05.17r` → `v05.18r`; README `Last updated:`; CHANGELOG version section with the prompt blockquoted (104 sections today — 6 dated 2026-09-08 are exempt; on a later EST day the twenty-one `2026-09-02` sections rotate first, `git fetch --unshallow` before SHA lookups). Plan `INTEGRATED-REMEDIATION-PLAN.md` §6 S1 row → **Done** (lesson half, v05.18r) and the §7.3 row; curriculum plan §10.5 opener paragraph → authored; §4's `value-chain-makers` row if you touch it.
>
> VERIFY BEFORE COMMIT: `python3 scripts/check-classroom-content.py` (0 errors, no new warnings — 29 → 30 lessons); `python3 scripts/check-classroom-pipeline.py --base origin/main` (expect P1 on developer files and P5 on the `value-chain-makers` insert — **never P3**; refresh `gateDigest` only if P3 reports); `--selftest` (13 / 0); `node --check` on a `.js` copy of `Classroom.gs`; `node scripts/check-gas-inner-scripts.js`; `python3 scripts/check-classroom-curriculum.py --strict` (The Value Chain lane should read 20 lessons, 20/20 analyst-visible); the analyst-view test is the content checker's gate truth table plus a Playwright read of the Classroom index as an analyst if credentials are at hand (optional).
>
> Normal Pre-Commit and Pre-Push checklists; one push commit on a `claude/*` branch (check `git ls-remote` first). Affected page: Classroom (`v01.19g`, page unchanged). End with "remember session".


## Previous Sessions

### Session — 2026-09-08 06:08:41 AM EST (v05.16r)

**Date:** 2026-09-08 06:08:41 AM EST
**Repo version:** v05.16r — three push commits on `claude/phase-6-session-3-preflight-zpgtsw` (v05.15r, session-context, v05.16r)
**Branch:** `claude/phase-6-session-3-preflight-zpgtsw`
**Model:** Opus 5 xhigh — **Phase 6 session 3 (the AIDC power-conversion edition) followed by the BYD specified-foreign-entity write-up. PHASE 6 IS CLOSED and the BYD item is CLOSED.**

### What was done

**Two pieces of work in one session, in this order.**

**1 · Phase 6 session 3 — v05.15r.** The preflight was decided empirically before any refresh work started, exactly as session 2 did: all three H1 2026 interims were confirmed published and retrievable first (`sinexcel` 2026-08-11, `zhonhen` 2026-08-27, `megmeet` 2026-08-28), with `cninfo.com.cn` answering and `szse.cn` failing TLS, and only then were ~45 minutes committed. Six research subagents ran (Stage 1 first-party / Stage 2 third-party per company), each scoped to the missing period rather than a full re-sweep because all three dossiers had been refreshed 1–4 days earlier. `megmeet` v6 → **v7**, `zhonhen` v7 → **v8**, `sinexcel` v7 → **v8**; all archived, registry synced, graph rebuilt (3,681 → **3,690** evidence items), calendar rows advanced. `aidc-power-conversion--competitive--2026-09-08` published over the **15**-name 800 VDC roster cut **by layer**, 31 citations, seven sections, eight judgments, three overlays re-authored on `nvidia-800vdc-2026-08`; 8 superseded AIDC pins removed. Plan §6 Phase 6 → **Done**.

**2 · The BYD SFE write-up — v05.16r.** `byd` v8 → **v9** (v8 archived). The `policyExposure[]` entry for OBBBA §45X/§48E moved from "UNRESOLVED, AND RECORDED AS SUCH" to resolved on two independent statutory prongs, closed against **IRS Notice 2026-15** read in full (95pp from irs.gov) rather than inferred from counsel summaries. Both 2026-09-08 editions' `byd` pins re-verified at v9 **in the same commit** — the step that keeps the checker at 0 / 0 instead of regressing to 0 / 2.

### Where we left off

v05.16r pushed and merged; nothing half-done, nothing pending. **`check-profiler-reports.py` is at 0 errors / 0 warnings with 2 aged pins verified and quiet.** Next in the §6 ledger: **S1**, then S3 (0/19), G6 (ready), C3, S2 (0/19), 4 (0/26), K2, C5, C6 deferred.

### Key decisions and findings

- **The edition's central finding is a sourced negative: architectural validation is not commercial inclusion.** Zhonhen's 187-page interim contains no order, no backlog, no named customer, no capacity commitment and zero occurrences of NVIDIA, SST or transformer-rectifier — despite NVIDIA's August 2026 paper naming its Panama Architecture. Sinexcel's management states **four times** that AIDC products are 「样品处于开发阶段，尚未实现正式销售」 and "800V" appears **zero times** in its 212-page interim. Megmeet's interim claims only membership — 「英伟达指定的数据中心电源推荐提供商之一」 — and names no competitor in 238 pages.
- **The prior edition's "SST roster still forming" is retired** by `sungrow` v9's EnerNeo, described in Sungrow's own interim as launched and supplying.
- **The winners already owned the adjacent business** — Delta the shelf, Sungrow the power electronics, Infineon the silicon, the grid tier the transformers. The vendors for whom 800 VDC *is* the thesis disclose the least.
- **BYD IS a specified foreign entity, on two independent prongs**: §7701(a)(51)(B)(iv) via the NDAA FY2024 §154(b) naming, and (ii) via the 8 June 2026 §1260H listing. **The §154(b) prong carries the first taxable year** — Notice 2026-15's footnote 21 puts the determination for the first taxable year beginning after 4 July 2025 at the **first day** of that year (1 January 2026 for a calendar-year filer, five months before the §1260H addition), so the judgment prose was reordered to lead with §154(b). Exposure is a **ratio test, not a ban**: 55% non-prohibited content for an EST beginning construction in calendar 2026 rising toward 75% by 2030, with a **pre-16-June-2025 binding-contract carve-out** excluding those costs from the MACR entirely. Two traps recorded: the notice publishes **no list** of entities, and its "as in effect on January 1, 2025" clauses attach to the **beginning-of-construction** rules, not to the SFE lists.
- **`zhonhen` does NOT run late — the calendar was wrong.** H1 filed four days inside the 31 August deadline with a consistent 2024–2026 record; the old inference rested on the dossier not yet holding the filing.
- **`sinexcel`'s OVERDUE row was a desk false positive** — the report published on its scheduled 2026-08-11 date; the 08-12 one-shot fired SUCCEEDED and landed no commit. Only cninfo's date is authoritative.
- **The Megmeet #2-supplier claim eroded rather than confirmed.** Membership and rank are different claims; restated as a contested narrative with no supporting source located.
- **A subagent's "contradiction" was checked rather than accepted** — Zhonhen's Stage 2 agent reported NVIDIA's Panama name-check as "not established", but that was a WAF block on `bjx.com.cn` / `xueqiu.com`. A bounded null is not a refutation; the claim stands.
- **Three contaminated claim clusters excluded and recorded** so a future session rejects rather than re-imports them (Sinexcel's untraceable Vertiv-OEM / 36 kW / +US$500 cluster; a stale FY2026 forecast from a 2024 note on the FY2023 annual; a search-summarizer confabulation about Megmeet's H1 meeting expectations).
- **The FX discipline held for a third session** — no H1 2026 figure entered a normalized table; the `sungrow` v9 precedent now covers five companies across three sessions.
- **Developer decisions:** leave the `byd` segment `basis` line untouched (the edition's ranking-basis table carries the nuance); correct §7.8's "six added members" to eight **with the provenance kept** (struck through, not overwritten).

### Active context

- **Branch:** `claude/phase-6-session-3-preflight-zpgtsw` · **repo version:** v05.16r · **Profiler page:** v01.83w (indirect affect, data-only, no bump) · **Classroom page:** v01.08w · **Classroom GAS:** v01.17g
- **Corpus:** 154 companies / 154 profiles / 154 study guides / 1,210 concepts / **1,260 edges, 3,690 evidence items** / 9 named projects / 8 guidance modules / **8 reports (4 current, 4 superseded)** / 19 segments
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG:** **103 sections, 5 dated 2026-09-08** (`v05.12r`–`v05.16r`). Same EST day → 103 − 5 = 98 → no rotation. **A later EST day → 103 non-exempt → ROTATION FIRES** on the twenty-one `2026-09-02` sections (`v04.14r`–`v04.34r`) → 82; budget ~10 extra minutes and run `git fetch --unshallow` before any SHA lookup.
- **Checker state:** reports **0 errors / 0 warnings, 2 aged pins verified and quiet** (both `byd` at v9 on the two 2026-09-08 editions); all six profiler checkers exit 0; content 10 / 3 / 134, 0 / 0; pipeline P1 on out-of-write-set paths only, no P3.
- **Plan ledger (§6):** 0 · 1 · 2a · 2b · 3 · S0 · K1 · 5 · **6 Done (v05.13r, v05.14r, v05.15r)**; next **S1** · S3 (0/19) · G6 (ready) · C3 · S2 (0/19) · 4 (0/26) · K2 · C5 · C6 deferred.
- **Standing, unassigned:** the two `verify-profiler-roles.py` progress-isolation failures (pre-existing, confirmed against a clean tree); `archive/nvidia.profile.v2.json` missing and unreconstructable; **one archive gap per dossier touched this session** (`megmeet` v3, `zhonhen` v4, `sinexcel` v4, `byd` v4 — pre-existing, not created here); the README archive-tree drift, now ~61 entries behind after this session's four new archive files; `huawei`'s FCC `policyExposure` entry over the 900-char convention; the `byd` segment `basis` line (developer chose to leave it); the overdue desk rows that remain (`iren` / `jinko` 08-27). **The BYD SFE item is CLOSED — do not re-open it.** The one live consequence is that `s154-listed-bess-suppliers--risk--2026-09-08` still states the status as unresolved; reports are immutable, the drift is recorded in its coverage pin, and the corrected finding reaches readers with that report's next edition.
- **Egress notes:** `cninfo.com.cn` REACHABLE and the route that matters for SZSE issuers; **`szse.cn` root fails TLS** but **`disc.static.szse.cn` serves disclosure PDFs directly (HTTP 200)**; `irs.gov` reachable (Notice 2026-15 fetched, 95pp / 528 KB) and `taxlawcenter.org` now answers where it 403'd in session 2; `hkexnews.hk` reachable; newly blocked: `bjx.com.cn` and `xueqiu.com` article pages (WAF), `21jingji.com` (503), `simplywall.st` (403). OSHA IMIS, SEC EDGAR, primedatacenters.com and web.archive.org remain blocked.
- **Routine note:** unchanged — none created, updated or deleted.

### Recommendation for next session

- Run **S1** — the next open row in the §6 ledger now that Phase 6 is closed and no report work is outstanding. It is the natural next step because S2's nineteen landscape modules depend on it, and the reports those landscapes will cite are all freshly regenerated and at 0 errors / 0 warnings, so nothing upstream will move under them.

**To continue:** type `run S1`

