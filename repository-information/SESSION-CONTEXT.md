# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-13 05:38:06 AM EST
**Repo version:** v05.49r — **two push commits** on `claude/affectionate-galileo-rsr3k1` (v05.48r, v05.49r), both merged; this remember-session commit follows on the same branch
**Branch:** `claude/affectionate-galileo-rsr3k1`
**Model:** Opus 5 xhigh as the orchestrator; **no subagents** — Bash, Node VM harnesses and Playwright throughout. ~76 minutes for the C3 push, then a live-troubleshooting stretch with the developer, then ~20 minutes for the masthead push

### What was done

**C3 session 3 of 3 — the Guidance Homecoming, CLOSED (v05.48r). Then a developer-directed masthead change (v05.49r), and a long live-support stretch in between.**

1. **The progress ticks migrated** — six one-shot admin functions, three per project, deliberately named without a trailing underscore because **Apps Script hides `_`-suffixed functions from the editor's Run dropdown**. Profiler: `exportGuidanceProgress` / `previewGuidanceProgressPrune` / `applyGuidanceProgressPrune`, filtering `gd_progress:<email>` to the nine module ids over a **frozen `GD_MIGRATED_MODULE_IDS` literal** (the registry it would otherwise walk is deleted in the same commit). Classroom: `previewGuidanceProgressImport` / `applyGuidanceProgressImport` / `verifyGuidanceProgressImport`, reading the payload from a `GUIDANCE_PROGRESS_IMPORT` Script Property because an editor-run function takes no arguments
2. **The design's done-when is met** — `scripts/check-guidance-migration.js` (new) runs all six real functions in **two isolated VM contexts with one Script Property store each**, fixture built from the real registry. **44 assertions pass**: export read-only and deterministic, dry run writes nothing, verifier accounts for every tick per account with zero missing, second import writes 0 and leaves the store byte-identical, prune leaves `study-`/`dossier-` ticks and unrelated properties alone and is itself idempotent
3. **The read-only window closed** — `clProgressValid_` admits every registered module behind `clCan_(sess,'guidance')` (**one map, not two**: progress is never a weaker gate than reading); modules render with mark-as-understood buttons and filling nav ticks; library cards carry a completion readout; `clDrillGuidanceItems_` puts **139 guidance items** into the C4 pool as `gc:`/`gq:` ids beside 216 lesson items. **Decision 6 at its target state**
4. **Profiler's copy deleted** — twelve functions, the `gop=index|doc` branches, ten page-side functions, five dead CSS blocks, and `scripts/check-guidance-parity.py`. `Profiler.gs` 760 KB → 449 KB; `Profiler.html` 8,099 → 7,818 lines. **The `gd-*` renderer deliberately stayed** — study guides, the report view and the sign-in log all render through it
5. **`.claude/rules/industry-guidance.md` re-targeted** at `Classroom.gs` (frontmatter + steps 4/5/6/7/10) as a file-target and op-name change, and the **quarterly review Routine's prompt updated in place** after the developer was asked in-session and approved — same trigger id `trig_01CrhxzfBV6uKQNKpUXLLMSZ`, same cron, run history intact
6. **v05.49r — the masthead directive.** Profiler lost `🎓 Classroom` and `✦ Industry Guidance` (stack five slots → three at 4/44/84, `#ov-header` 194px → 114px); Classroom lost `← Profiler`. `verify-profiler-roles.py` moved with the code: the `classroom` column is retired and the `guidance` row now reads the **dossier chip line** instead of a button — a stronger assertion, because the line only paints once the server has answered. **12 × 4 from here**
7. **`INTEGRATED-REMEDIATION-PLAN.md` §7.12** — the paste-in brief for the bankability review (order 3), written in this remember-session commit, with the §7.3 row 3 flipped to NEXT UP

### Where we left off

Both pushes merged and deployed. **C3 is closed and the plan's order 2 is done.** The developer confirmed Classroom's guidance surfaces work in production — library, ticks, drill — and the migration sequence itself **found an empty store**: `exportGuidanceProgress()` returned `accounts:{}`, `ticks:0`, `keptDocs:0`, so there was no history to move and the prune must not be run. **Open thread:** whether the developer's guidance ticks exist in browser `localStorage` under `ov_guide_progress_*`; a console snippet to recover them with their real dates was given and its result is not yet known.

### Key decisions and findings

- **A green `Deploy <Project>` workflow step does NOT mean the code landed.** Run #558's `Deploy Profiler` step reported success and ran 10 seconds — it genuinely called the web app — yet the Apps Script project was still on v01.38g until the developer ran `pullAndDeployFromGitHub()` by hand. **This is an unfixed defect in `.github/workflows/auto-merge-claude.yml`** and it has been shipping silently for every GAS change. It cost most of an hour of live troubleshooting. Worth its own session.
- **The GAS version pill on a page is NOT evidence of what is deployed.** It reads `live-site-pages/gs-versions/*.gs.version.txt` off GitHub Pages — the repo's file — which the commit bumps whether or not the script project ever pulled. The only authoritative check is line 1 of the Apps Script editor.
- **The merge rule is "an existing Classroom tick always stands", and it is correct in BOTH directions.** The brief only required not overwriting a newer Classroom tick; max-date-wins would satisfy that and is wrong, because when Profiler's date is the newer, Classroom's earlier date is the true first completion. Never overwriting also makes the import idempotent by construction.
- **C3 created a new permanence constraint nobody has hit yet.** A guidance module's **section ids** are now progress-tick keys in `cl_progress:` AND are embedded in drill ids (`gc:<moduleId>:<sectionId>:<n>`). Renaming one silently orphans reading history, resets that section's SM-2 schedules, and breaks report overlay anchors. §7.12 names this as the bankability review's primary trap.
- **`check-classroom-content.py` asserted `tickable == readable lessons` per tier**, so admitting modules broke it by design; the checker moved with the code and the new assertions are stronger (guidance drill pool gated per tier, every served id gradable, **lesson ids and module ids asserted disjoint**). 134 → 142 gate cases. `clProgressValid_` is a `GATE_SYMBOLS` member, so `gateDigest` was refreshed.
- **Two Classroom render traps, both cost a debugging cycle:** `HTML_CONFIG.STORAGE_TYPE` is `sessionStorage` and the page's single-tab enforcement **clears it on load**, so a session seeded from `add_init_script` is wiped before `clAdmitted()` reads it; and `_gasPost` is a top-level `function` declaration, so an init-script assignment to `window._gasPost` is **overwritten** by it. Both stubs must be installed AFTER the page's own scripts run. Recorded in the rules file's step 7.
- **`gis_load_failed` in a Profiler Playwright run is a harness artifact** — the harness aborts `accounts.google.com`. Confirmed identical on a pristine `HEAD` Profiler across three runs each.
- **The masthead harness lesson:** the button stack is built by the auth wall's `pass()`, which a harness bypassing the wall never calls — so the buttons are genuinely absent and the test fails for the wrong reason. Call the `ov*BtnShow()` builders explicitly.
- **CHANGELOG arithmetic, third push in a row:** 102 raw / **96 non-exempt**, because six sections are dated 2026-09-13. Rotation has correctly not fired all session. **It fires on the first push landing on a later EST day**, when all six stop being exempt. The clone was unshallowed (55 → 1,145 commits) so SHA enrichment is ready.

### Active context

- **Repo version** `v05.49r`; **CHANGELOG 102/100 raw / 96 non-exempt**; **`Profilerhtml.changelog.md` at 49/50 — one bump from mandatory rotation**; `Classroomhtml.changelog.md` 13/50, `Profilergs.changelog.md` 39/50, `Classroomgs.changelog.md` 23/50, `Scrapergs.changelog.md` 49/50 (untouched all session)
- **GAS versions:** Classroom `v01.23g`, Profiler `v01.39g`, Scraper `v02.02g`. **Page versions:** Profiler `v01.90w`, Classroom `v01.13w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Operational state:** `GUIDANCE_PEER_TOKEN` set and working in both projects. The six one-shot migration functions are **deployed but effectively unused** — the export found an empty store. **The prune must not be run.** `GUIDANCE_PROGRESS_IMPORT` should be deleted from Classroom's Script Properties if it was created
- **Run order from here:** **the bankability review (§7.12, order 3)** → Phase 4 row 1 (`four-machines`) → S2 ∥ Phase 4 rows 2–24 → K2 → rows 25–26 → C5 → the plan clock. **~54 sessions remain**
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run the **bankability review** — order 3 of the §7.3 run table, the only module inside the 30-day `reviewBy` horizon (2026-10-01) — on Opus 5 xhigh from the `INTEGRATED-REMEDIATION-PLAN.md` **§7.12** brief: re-verify `bess-bankability-2026-08`'s dated gates against primary sources, refresh `updated` and `reviewBy`, and **do not rename a single section id**, because since C3 they key the developer's reading history and the C4 drill schedules as well as three report overlay anchors.

**To continue:** paste the bankability-review prompt (reproduced in chat, and stored as §7.12 of `INTEGRATED-REMEDIATION-PLAN.md`) into a new Opus 5 xhigh session.

## Previous Sessions

### Session — 2026-09-13 01:47:06 AM EST (v05.47r)

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
Developed by: LightAISolutions
