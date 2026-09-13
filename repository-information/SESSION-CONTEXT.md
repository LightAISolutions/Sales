# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-13 05:15:00 PM EST
**Repo version:** v05.52r — **three push commits** on `claude/adoring-brown-mvddj2` (v05.50r, v05.51r, v05.52r), all merged; this remember-session commit follows on the same branch
**Branch:** `claude/adoring-brown-mvddj2`
**Model:** Opus 5 xhigh as the orchestrator; **no subagents** — Bash, targeted primary-source web research, the GitHub Actions MCP tools and Playwright throughout

### What was done

**The bankability review (plan order 3) — then two off-plan pushes the developer asked for, the second of which live-tested the first.**

1. **v05.50r — the quarterly review of `bess-bankability-2026-08`.** Every dated gate re-verified against the **primary instrument** only. `updated` → 2026-09-13; `reviewBy` 2026-10-01 → **2027-01-01**, set from the module's own next dated gate (UL 9540A Ed. 6's effective date, which is also when non-BES IBRs come inside PRC-029) rather than a cadence — the curriculum checker now reports **0 items** in its 30-day horizon. **All eleven section ids, the module id and the three `counterparty` report anchors held**, which was §7.12's named trap
2. **Five claims moved, two of them corrections of things the module had wrong.** The **FCC's inverter Covered List reads on place of production, not nationality** — "foreign-produced power inverters, except those granted a Conditional Approval", with §45X eligibility / domestic-end-product status / a Conditional Approval as the three exits — which **killed the module's "pair Chinese DC blocks with non-Chinese PCS/EMS" advice outright**. And **AB 303 died 2026-01-31** on the Art. IV §10(c) deadline, not in committee in April 2025; the California siting threat was live nine months longer than the module implied. Staleness: **UL 9540A Ed. 6** exists, effective 2027-01-01, dropping unit-level for non-residential BESS without an active TRPPS and putting pass/fail on the installation test; **ANSI/CSA C800:25 §9.7** supersedes TS-800:24 while NFPA 855-2026 as issued names no LSFT method at all. Tightening: **BNEF's 2026-08-15 methodology** added a two-different-commercial-banks financing test to Tier 1
3. **The review's step 4 exposed a silent C3 regression.** `check-profiler-reports.py` still parsed guidance modules out of `Profiler.gs`, which C3 emptied — it returned `{}` and errored on **all 20 overlay anchors across all 8 reports**. Confirmed byte-identical on a pristine `HEAD` before attribution, repointed at `Classroom.gs`, back to **0 errors / 0 warnings**
4. **v05.51r — the GAS deploy path, rebuilt from the Actions logs.** `.github/scripts/gas-deploy.sh` (new) is one shared caller for all eight projects; it asserts the reported version **equals the merged version**, runs **GET first** with POST as fallback, and gauges the 200-version ceiling. A new final step `Fail the run if any GAS deploy was unconfirmed` turns the run red **after** branch cleanup. `REPO-ARCHITECTURE.md`'s flowchart and sequence diagram updated with both pako URLs regenerated and verified; the mechanism documented in `.claude/rules/workflows.md`
5. **v05.52r — the guidance sweep, and its negative result.** All nine modules parsed and every string walked: **no other module repeats the nationality framing.** But the sweep found a collision v05.50r had created — EO 14420 §5(c) defines "foreign-produced" as *not manufactured, produced or assembled in the US* while the FCC defines the same phrase for the same named equipment as *neither §45X-eligible nor a domestic end product*, and the two **disagree about a US-assembled inverter**, which is exactly the fact pattern the EO module's quiz turns on. Both modules now cross-reference
6. **`INTEGRATED-REMEDIATION-PLAN.md` §7.13** — the paste-in brief for order 4 (`four-machines`), written in this remember-session commit, with §7.3 row 4 flipped to NEXT UP

### Where we left off

All three pushes merged and deployed. **Plan orders 1, 2 and 3 are closed; order 4 is next.** Nothing is outstanding and no operator step is pending. The one thing not closable from here: **line 1 of Classroom's Apps Script editor should read `v01.25g`** — the run log says it deployed, but only the editor is authoritative.

### Key decisions and findings

- **SESSION-CONTEXT.md's previous entry was wrong about run #558 and this session corrected it.** The note said Deploy Profiler "reported success and the project was still on v01.38g". The log line reads `Deploy confirmed (GET): Already up to date (v01.39g)` — and v05.48r is the commit that *introduced* v01.39g, so it had deployed within the preceding ten seconds. **Profiler did deploy.** The v01.38g reading was almost certainly a stale Apps Script editor tab; that editor does not live-reload. **Read the logs before trusting a carried-forward diagnosis.**
- **The POST leg never worked as a report.** Google's 302 drops it, so `POST deploy unconfirmed` printed on every run *including the two where it had actually deployed*, at 8–13s per project. The GET fallback was doing all the visible work. The real defect was the acceptance test matching **any** version, which cannot catch a stale read of the `.gs` off GitHub's contents API.
- **Failure is deferred on purpose and must not be "fixed".** `Delete branch` and `Sweep stale claude branches` are gated on `success()`, so a deploy step failing in place would strand the `claude/*` branch and block the next push under push-once enforcement. `gas-deploy.sh` records and exits 0; the final gate step exits 1 after cleanup.
- **Drill hashes, read from source rather than assumed:** a flashcard hashes `q + '||' + a`; a quiz item hashes `q + '||' + choices + '||' + a` — **`why` is excluded**, so a quiz explanation can be improved at **zero schedule cost**. Appends go at the **end** of each array so no `gc:`/`gq:` positional index shifts.
- **The §7.12 brief's "ten stale segment-* lessons" was wrong — it is TWELVE**, 24 errors. Always diff the checker output against a pristine `HEAD` worktree rather than trusting a stated count.
- **Keyword sweeps need a discrimination rule.** FEOC, PFE, §154 and tariff claims *are* legitimately about Chinese entities; only the FCC Covered List is nationality-agnostic. "Fixing" every keyword hit would have broken correct content.
- **A valid-YAML step can still be in the wrong job.** The deploy gate landed in `check-template` on the first attempt and parsed fine; only asserting step order programmatically caught it.
- **CHANGELOG rotation still has not fired, three sessions running.** 105 raw / **96 non-exempt**, because nine sections are dated 2026-09-13. It fires on the first push landing on a later EST day — which is almost certainly the next session.

### Active context

- **Repo version** `v05.52r`; **CHANGELOG 105/100 raw / 96 non-exempt**; `Classroomgs.changelog.md` 25/50, **`Profilerhtml.changelog.md` 49/50 — one bump from mandatory rotation**; oldest whole date group for rotation is **thirteen sections dated 2026-09-04**; clone unshallowed
- **GAS versions:** Classroom `v01.25g` (Apps Script **34/200 versions**), Profiler `v01.39g`, Scraper `v02.02g`. **Page versions unchanged all session:** Classroom `v01.13w`, Profiler `v01.90w`, Scraper `v01.72w`, Receipts `v01.37w`, MasterACL `v01.06w`, globalacl `v01.06w`, gas-project-creator `v01.04w`, testauthgas1 `v01.04w`, testauthhtml1 `v01.04w`, text-compare `v01.02w`
- **Registries at v05.52r:** `clLessons_()` 30 lessons, `clTracks_()` 6 tracks; neither `four-machines` nor `electrical-foundations` exists yet
- **Operational:** the auto-merge workflow adds a `[skip ci]` SHA-tracker commit after every merge, so **`origin/main` is always one commit ahead of your last push — rebase before every push commit cycle**
- **Run order from here:** **order 4 (`four-machines`, §7.13)** → S2 ∥ Phase 4 rows 2–24 → K2 → rows 25–26 → C5 → the plan clock. **~54 sessions remain**
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Author **`four-machines`** — Phase 4 row 1, order 4 of the §7.3 run table — on Opus 5 xhigh from the **§7.13** brief: one mechanism lesson with seven fixed section ids, a seven-input provenance stamp, plus the `electrical-foundations` track it creates at position 2 of `clTracks_()` and the `prereqs[]` §2.2 has promised since v05.07r. **The trap is the fence** — a lesson goes INSIDE `// CONTENT START … // CONTENT END`, and the last three sessions were all guidance modules, which live outside it.

**To continue:** paste the `four-machines` prompt (reproduced in chat, and stored as §7.13 of `INTEGRATED-REMEDIATION-PLAN.md`) into a new Opus 5 xhigh session.

## Previous Sessions

### Session — 2026-09-13 05:38:06 AM EST (v05.49r)

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
