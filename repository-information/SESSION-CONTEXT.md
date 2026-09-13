# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-13 01:47:06 AM EST
**Repo version:** v05.47r — **four push commits** on `claude/adoring-planck-nczbq5` (v05.44r → v05.47r), all merged; this remember-session commit follows on the same branch
**Branch:** `claude/adoring-planck-nczbq5`
**Model:** Opus 5 xhigh as the orchestrator; **no subagents** — Bash, Node harnesses and Playwright throughout. ~30 minutes for the main push, then three shorter fix/diagnose cycles

### What was done

**C3 session 2 of 2–3 — the Guidance Homecoming's federation slice (v05.45r), plus three follow-ups the developer's testing surfaced (v05.46r, v05.47r).**

1. **The Admin lens re-hosts in Classroom** (`Classroom.html` v01.10w → v01.11w) — `clLoadAdminLens` / `clApplyAdminLens`, the `cl*` port of Profiler's `gd*` pair on the light palette, behind `clCan('reports')` (admin only, unchanged in `CL_ROLE_CAPS`, so **no access-matrix value moved**). **No new server route**: the index and reports are public Pages data under `CL_DATA_BASE`. Twelve panels across five modules for an admin, zero on the other four, **zero for a contributor with zero report-data network requests issued**
2. **`guidanceMentions_()` moved to `Classroom.gs`** byte-identical (v01.19g → v01.22g across the session) behind `?action=guidancepeer&t=…&gpop=mentions` — the mirror of `scHandleCorpus_`, token-gated on a **new** `GUIDANCE_PEER_TOKEN` Script Property, no browser-facing door. `Profiler.gs` (v01.36g → v01.38g) relays it via `guidanceMentionsProxy_()` on the `handleNewsOp_` shape. `guidanceAllowed_` stays the only browser-facing boundary; `Profiler.html` was untouched by that commit, which was the test
3. **v05.46r — the peer route hardened** after the developer set the token and still saw nothing: both sides now `.trim()` the shared secret before comparing, and Profiler's proxy stopped collapsing three distinct upstream faults into `upstream_unreachable`
4. **v05.47r — the actual reported bug, and it was not the token.** The chips had been rendering all along at **y ≈ 1817px on a 2035px page**: `ovGuidanceMentionsLine`'s `paint()` ended in `main.appendChild(line)`, below the tab panes *and* below the field-note form. Now inserts before `.ov-tabs` (`Profiler.html` v01.87w → v01.88w). **Developer confirmed both chips on Tesla and NVIDIA**
5. **The slice plan records session 2** in `PHASE6-CLASSROOM-DESIGN.md`; `INTEGRATED-REMEDIATION-PLAN.md` has the §6 ledger row, the §7.3 order-2 row, a dated v05.45r progress note extended with the two follow-ups, and **§7.11 — the paste-in brief for C3 session 3** (written in this commit)
6. **Verified:** `node --check` on both `.gs` files and every page script block; `check-gas-inner-scripts.js` (9 files / 86 blocks); `check-guidance-parity.py`, `check-readme-tree.py`, `check-classroom-curriculum.py --strict`, `check-classroom-pipeline.py --selftest` all clean; Playwright renders with **zero page errors** throughout

### Where we left off

All four pushes merged and deployed; the token is set and the chips are live and confirmed. Nothing in flight. **C3 session 3 is next and it is the last one** — its brief is `INTEGRATED-REMEDIATION-PLAN.md` **§7.11**, reproduced under *Recommendation* below.

### Key decisions and findings

- **The token was never the problem, and the evidence that settled it was a timestamp.** The developer's console showed `built: '2026-09-13T05:13:26.776Z'` — fifteen minutes *before* v05.46r deployed — so the secret had matched from the moment it was set. v05.46r is still worth having (a trailing newline pasted from an execution log produces exactly that symptom, invisible in the Script Properties UI and fatal under `!==`) but it fixed a trap that had not been sprung.
- **Two diagnoses were made from plausible mechanisms before the page was actually rendered; the render took ninety seconds and settled it outright.** For anything visual on these pages, render first. This is the single most transferable lesson of the session.
- **A verification fixture nearly produced a phantom finding.** The first Profiler render showed *empty* chips. Cause: the fixture had been written with `JSON.stringify(m, Object.keys(m).sort(), 1)` — the second argument is the **replacer** (a property allowlist), not `space` — so every hit object was stripped to `{}`. Use `JSON.stringify(m, null, 1)`. Always sanity-check a fixture before drawing a conclusion from it.
- **`gd_progress:` is a shared store, not a guidance store** — it also holds `study-<slug>` and `dossier-<slug>` ticks. Session 3's item-4 migration must move **only** registered module ids. This is the largest correctness trap left in C3.
- **Profiler's copy is twelve functions, not thirteen** — `guidanceMentions_()` has already gone. `check-guidance-parity.py` watches exactly those twelve and dies with them in session 3.
- **The chip click path is load-bearing for session 3**: `ovGuideOpenDoc` opens Profiler's own overlay, so deleting the `gd*` engine breaks the chips unless they are re-pointed at `Classroom.html#guidance/<id>` first.
- **CHANGELOG arithmetic is non-exempt, not raw.** It reads `100/100`, but four sections are dated 2026-09-13, so the non-exempt count is **96** and rotation correctly did **not** fire. **It fires on the first push dated after 2026-09-13.** Oldest whole date group: **thirteen sections dated 2026-09-04**. The clone was deepened here (55 → 1,138 commits) but a fresh session gets a fresh shallow clone — `git fetch --unshallow origin main` **before** any SHA lookup.
- **Profiler render recipe (new, and it works):** scratch copy of `Profiler.html` in the scratchpad with `_e = ''` and `AUTO_REFRESH = false`, plus a copy of `profiler-data/`, served over **`http://127.0.0.1`** (not `file://`, or CORS silently kills every fetch and a skipped lens looks like a pass). `add_init_script` sets `ov_note_role` / `ov_note_session` / `ov_note_email` in localStorage; then set `window._gasNoteUrl` to a dummy host and patch `window.fetch` to answer it. Hide any fixed full-height `body > div` that is not `#ov-*` to clear the auth wall. The init block loads the registry and calls `ovRoute()` on its own — no `pass()` needed.
- **Gate-proving recipe held again**: extract the functions with a brace-matched regex, stub `PropertiesService` / `UrlFetchApp` / `CacheService` / `validateSessionForData`, and drive per tier and per failure mode in Node. An **admin session carries `permissions: ['admin']`, not `role: 'admin'`** — a stub that omits it reports a false `ROLE_DENIED`.

### Active context

- **Repo version** `v05.47r`; **CHANGELOG at 100/100 raw / 96 non-exempt** — rotation due on the first push dated after 2026-09-13; **`Scrapergs.changelog.md` at 49/50** (untouched all session); `Profilerhtml.changelog.md` 47/50, `Profilergs.changelog.md` 38/50, `Classroomhtml.changelog.md` 11/50, `Classroomgs.changelog.md` 22/50
- **GAS versions:** Classroom `v01.22g`, Profiler `v01.38g`, Scraper `v02.02g`. **Page versions:** Profiler `v01.88w`, Classroom `v01.11w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Operational state:** `GUIDANCE_PEER_TOKEN` **is set in both projects and working** — no setup step is outstanding. The nine modules are still **deliberately duplicated** in both `.gs` files until session 3
- **Run order from here:** **C3 session 3** (§7.11) → the **bankability review** (`bess-bankability-2026-08`, `reviewBy` 2026-10-01 — after session 3 it edits only Classroom's copy) → Phase 4 row 1 → S2 ∥ Phase 4 → K2 → rows 25–26 → C5 → the plan clock. **~54 sessions remain**
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run **C3 session 3, the Guidance Homecoming's final slice, on Opus 5 xhigh** from the `INTEGRATED-REMEDIATION-PLAN.md` §7.11 brief — in its stated order: migrate the guidance progress ticks (module ids **only**, verified against a pre-migration export, idempotent), re-point the dossier mention chips to `Classroom.html#guidance/<id>`, then delete Profiler's twelve functions and `check-guidance-parity.py`, re-target `.claude/rules/industry-guidance.md`, and ask before touching the quarterly Routine. The deletion goes last because everything else must be proven working while the fallback still exists.

**To continue:** paste the C3 session 3 prompt (reproduced in chat, and stored as §7.11 of `INTEGRATED-REMEDIATION-PLAN.md`) into a new Opus 5 xhigh session.

## Previous Sessions

### Session — 2026-09-13 12:23:26 AM EST (v05.44r)

**Date:** 2026-09-13 12:23:26 AM EST
**Repo version:** v05.44r — **one push commit** on `claude/jolly-meitner-06wd3n` (v05.43r → v05.44r), merged; this remember-session commit follows on the same branch
**Branch:** `claude/jolly-meitner-06wd3n`
**Model:** Opus 5 xhigh as the orchestrator; **no subagents** — the whole migration was done in-session with Bash, Python extraction scripts and Playwright. ~31 minutes for the push commit against a 55-minute estimate, no cap hit

#### What was done

**C3 session 1 of 2–3 — the Guidance Homecoming. Order 2 of the §7.3 run table, now under way.**

1. **The nine `guidanceDoc*_()` module literals and `guidanceDocs_` / `guidanceIndex_` / `guidanceDoc_` are in `Classroom.gs`, copied byte-for-byte from `Profiler.gs`** (5,583 lines of content; 5,622 with their `// Content:` comment blocks), placed **below `// CONTENT END`** and inside the `// PROJECT START`/`// PROJECT END` region. `handleGuidanceOp_(e)` answers `gop=index|doc` behind `clRequire_(sess,'guidance')`, and `action=guidance` is wired into both routers (the doPost fetch route and `action=api&op=guidance`). Classroom `v01.19g` → `v01.20g`
2. **`Classroom.html` `v01.09w` → `v01.10w`** — the guidance surface: `#guidance` (lane-grouped library with review and revised chips), `#guidance/<id>[/<section>]`, `#guidance-glossary` (122 terms, each definition beside its source module), and cross-module search with snippet highlighting. Rendered entirely through the existing `cl*` primitives — **nothing was ported from `Profiler.html`'s `gd*` engine**, because C1 slice 2 had already brought every section kind across. `clRenderSection` gained `opts.readOnly`; `clApplyProgressUI` returns early on a guidance view so the study-next and drill cards cannot leak into a library page; the guidance nav marker is a plain bullet, not an unfillable checkbox
3. **The slice plan is written into `PHASE6-CLASSROOM-DESIGN.md`** under the C3 bullet — the design's eight checklist items mapped to sessions 1/2/3 plus the two invariants, the file-layout decision with its full reasoning, the duplicate-window rationale, and why guidance is read-only until session 3
4. **`scripts/check-guidance-parity.py` (new)** — the duplicate-window guard: all twelve functions byte-identical in both `.gs` files, and the module ids matching. Deleted in session 3 with Profiler's copy
5. **`repository-information/diagrams/Classroom-diagram.md`** — the now-false pre-C3 sentence corrected and a new **Industry Guidance** design note added (ops, gate, routes, fence placement, read-only window, parity guard). The Mermaid sequence was left alone: it depicts neither guidance nor the C4 drill, so nothing in it was falsified and **no pako regeneration was needed**
6. **`INTEGRATED-REMEDIATION-PLAN.md` §7.10 — the paste-in brief for C3 session 2** (written in this remember-session commit), plus run-table row 2 flipped to "session 1 done" and a dated v05.44r progress note
7. **Verified:** `node --check` on `Classroom.gs` and both page script blocks; `check-gas-inner-scripts.js` (9 files / 86 blocks); a Playwright render + screenshot read of **every new surface** with **zero page errors**; the server gate proved per tier in Node; `check-guidance-parity.py`, `check-readme-tree.py`, `check-classroom-curriculum.py --strict` and `check-classroom-pipeline.py --selftest` all clean

#### Where we left off

The v05.44r push merged. Nothing in flight. **C3 session 2 is next** — its paste-in brief is `INTEGRATED-REMEDIATION-PLAN.md` **§7.10**, written in this commit at the developer's request and reproduced under *Recommendation* below.

#### Key decisions and findings

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

#### Active context

- **Repo version** `v05.44r`; **CHANGELOG at 97/100** — three pushes of headroom, rotation is close; **`Scrapergs.changelog.md` at 49/50** (the next Scraper GAS bump is the last before mandatory rotation); `Classroomhtml.changelog.md` 10/50, `Classroomgs.changelog.md` 20/50, `Profilergs.changelog.md` 36/50
- **GAS versions:** Classroom `v01.20g` (bumped), Profiler `v01.36g`, Scraper `v02.02g`. **Page versions:** Classroom `v01.10w` (bumped), Profiler `v01.87w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Facts session 2 will need, already established:** reports live at `live-site-pages/profiler-data/reports/` (`OV_BASE` and `CL_DATA_BASE` are both `profiler-data/`); **four `current` reports carry `overlayModules`, giving twelve overlay panels across five modules** — `nvidia-800vdc` 3, `power-infra-aidc` 3, `bess-bankability` 2, `china-policy-stack` 2, `utility-aidc-procurement` 2 — and the `bess-bankability/counterparty` and `power-infra-aidc/markets` anchors each take a panel from **two** different reports, so the renderer must append, not replace. `CL_ROLE_CAPS` already grants `reports` to admin only, so no access-matrix value should change. `gdApplyLens` inserts before `.gd-done-btn`; there is **no** `.cl-done-btn` on a read-only guidance section, so the port must not drop the panel on a missed selector. The mentions route mirrors `scHandleCorpus_` in `Scraper.gs` and needs a **new** shared Script Property, not `CORPUS_TOKEN`
- **Run order from here:** **C3 session 2** (§7.10) → C3 session 3 → the **bankability review** (`reviewBy` 2026-10-01, and it must edit both copies while the duplicate stands) → Phase 4 row 1 → S2 ∥ Phase 4 → K2 → rows 25–26 → C5 → the plan clock. **~55 sessions remain**
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

#### Recommendation for next session

- Run **C3 session 2, the Guidance Homecoming's middle slice, on Opus 5 xhigh** from the `INTEGRATED-REMEDIATION-PLAN.md` §7.10 brief — checklist items 2 and 3 only: the Admin lens re-hosted in Classroom under `clCan('reports')` reading the public `reports/*.report.json`, and `guidanceMentions_()` moved to Classroom behind one narrow token-gated route that `Profiler.gs` proxies on the `scHandleCorpus_` pattern, with the dossier chips still working through an unchanged `ovGuideApi('mentions')` call. Do not delete Profiler's copy and do not wire guidance ticks — both are session 3.

**To continue:** paste the C3 session 2 prompt (reproduced in chat, and stored as §7.10 of `INTEGRATED-REMEDIATION-PLAN.md`) into a new Opus 5 xhigh session.
Developed by: LightAISolutions
