# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-07 04:19 AM EST
**Repo version:** v05.04r — **one** push commit this session (`80e12f9`), merged to `main` as `3265d3e`, plus this housekeeping commit
**Branch:** `claude/phase-1-dossier-fixes-5vp7km` (fast-forwarded to `origin/main` after the merge via `git merge --ff-only origin/main`; the workflow had deleted the remote branch, which freed push-once for this second push)
**Model:** Fable 5.1 Medium — **Phase 1 of the integrated remediation plan: the five zero-research dossier fixes (F2–F6).** No report, `sungrow`, `catl` or `tract` edit.

### What was done

**v05.04r — Phase 1, all five dossiers revised and archived per the Profiler Command, `lastUpdated` 2026-09-07.**
- **`hithium` v12 (v11 archived) — F2.** Added the `lightsource-bp` **customer** edge (Woolooga BESS Stage 1, 128 × 5 MWh / 640 MWh, `via` 5 MWh LFP containers, `since` 2024-12, active), mirroring the supplier edge Lightsource bp already carried; registered the Energy-Storage.News award article Lightsource bp cites (2024-12-18, independent tier) as the edge's exact `sources[]` URL. `srcTotal` 51 → 52.
- **`google` v9 (v8 archived) — F3.** Intersect Power at the **USD 5,868m final purchase-price allocation** (Alphabet Q2 2026 10-Q: goodwill USD 2,174m, PP&E USD 5,129m, debt assumed USD 1,214m) in summary, product line, spec row and closing development; **~$4.75B kept as the announced figure**; new `financial` development dated 2026-07-23 citing the already-registered 10-Q (`sources[0]`, same URL `intersect-power` cites). Placeholder date `2026-03-xx` → `2026-03-10`.
- **`compass-datacenters` v5 (v4 archived) — F4.** Brookfield × Bloom framework now reads USD 5bn / up to 1 GW at launch, **expanded fivefold to USD 25bn of total capex in Q2 2026**; registered Bloom Energy's Q2 2026 10-Q (the source `brookfield` and `bloom-energy` cite). "No source ties it to Compass" stands.
- **`arevon` v4 (v3 archived) — F5.** Both operating-BESS counts stated with definitions: standalone-only = three by mid-2025 (Saticoy, Condor, Peregrine), four after Nighthawk; standalone-plus-hybrid = the company ordinals (Peregrine fifth, Nighthawk sixth — consistent with Vikings and Eland counted, the undated California Flats retrofit not). No registered source states Arevon's definition.
- **`huawei-digital-power` v7 (v6 archived) — F6, attribution only.** Judgment 5, the `sungrow` edge, the `megmeet` edge and the FCC `policyExposure` entry now say the ~CNY 100B market-value loss and the wired-links argument attributed to Sungrow are **this dossier's own assertions** — re-reading the registered Cooley, Morgan Lewis, National Law Review and Energy-Storage.News pages found no Sungrow support (US News unreachable, but pre-action); `sungrow` v8 carries neither. Source tiers now visible in the prose. One registered-source qualification added: **Cooley's 31 July note reads the second security determination as covering wired as well as wireless connections**, which would moot a wired-links defence. No Sungrow research done.
- **Toolchain:** registry synced (5 entries); graph rebuilt — 1,257 edges / 950 curated / 3,667 evidence, digest `401594320568f841…` (was `563ae281…`); **two new crossref candidates** (`6b7685094bf1`, `d55d105703c5`, lightsource-bp × hithium — Lightsource-side open questions on Woolooga energization and the Aula contract transfer that Hithium's record cannot answer) **adjudicated and accepted with reasons**, 0 candidates / 21 over-cap scopes after; `check-profiler-reports.py` **0 errors / exactly 3 warnings** (hithium v12 past its v11 verification in `grid-scale-bess`, `named-project-bess-attach`, `s154-listed-bess-suppliers`) — **left loud, `report-pins-verified.json` untouched**; study and relationships checkers 0/0.
- **Records:** `INTEGRATED-REMEDIATION-PLAN.md` §6 Phase 1 → **Done — v05.04r**; Phase 2a marked next with the F6 residue. README tree gained the five archive files. CHANGELOG: no rotation (104 sections, 6 dated today → 98 non-exempt).

### Where we left off

v05.04r pushed and merged; this housekeeping push carries the session context. Phase 1 is closed in the plan. **The next unit of work is Phase 2a on Opus 5 xhigh** — the `sungrow` and `catl` research refreshes (F7, F8) — and a paste-in prompt was handed over in chat. Nothing is half-done.

### Key decisions and findings

- **Both figures stated, never reconciled by fiat** (step 7): Arevon's two counts carry their definitions; Google keeps the announced ~$4.75B beside the 10-Q USD 5,868m; Compass keeps the USD 5bn launch wording beside the USD 25bn expansion.
- **The F6 attributions are unsourced in huawei's own record**, not merely uncorroborated by Sungrow's — the fix was to say so in the dossier with tiers, and hand the substance to 2a. The Cooley wired-or-wireless reading is the one new fact 2a must weigh: if the second determination covers wired links, a Sungrow wired-links defence would be moot.
- **A crossref candidate raised by a new edge is adjudicated, not suppressed** — accepted only when the second passage genuinely cannot answer the first, with the reason written in the accept list.
- **Standing, unfixed defects noted, not touched:** huawei Judgment 5 carries a double confidence tag "(Low confidence) (Moderate confidence)"; `google` has no `relationships[]` edge to `intersect-power` although the inverse investor edge exists.
- Fast-forward (`git merge --ff-only origin/main`) again preferred over `checkout -B` after a merge.

### Active context

- **Branch:** `claude/phase-1-dossier-fixes-5vp7km` · **repo version:** v05.04r · **Profiler page:** v01.83w (unchanged — data-only)
- **Corpus:** 154 companies / 154 profiles / 154 study guides / 1,210 concepts / 9 named projects / 8 guidance modules / 4 reports (0 superseded); 5 dossiers at new versions (hithium 12, google 9, compass-datacenters 5, arevon 4, huawei-digital-power 7)
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 104 sections, 6 dated 2026-09-07.** Same EST day → 105 − 7 = 98 → no rotation. **A later EST day → 105 non-exempt → ROTATION FIRES**; oldest whole date group is the **thirteen** `2026-09-01` sections (`v04.01r`–`v04.13r`). `git fetch --unshallow` MUST run before any SHA lookup; budget ~10 extra minutes.
- **Checker state:** `check-profiler-reports.py` 0 errors / **3 warnings (hithium, expected, left loud)** / 35 quiet. `check-profiler-crossrefs.py` 0 candidates / 21 scopes noted / accept list 12. `check-profiler-relationships.py` 0 findings, accept list 10. Graph digest `401594320568f841…`.
- **Plan ledger (`INTEGRATED-REMEDIATION-PLAN.md` §6):** Phase 0 Done (v05.02r/v05.03r) · Phase 1 Done (v05.04r) · **2a next** · 2b, 3, 4 (0/20), 5, 6, G6 open.
- **Standing, unassigned:** README archive listing behind for older versions; `archive/nvidia.profile.v2.json` missing; OSHA IMIS and SEC EDGAR network-blocked (SEC pages fetched fine this session via the proxy for reading, not research); README tree cosmetics in `study-prep/`. Interim caveat: **do not act on the `named-project` report's whitespace call** until Phase 5.

### Recommendation for next session

- Run **Phase 2a on Opus 5 xhigh** from `INTEGRATED-REMEDIATION-PLAN.md` §1–§3: the `sungrow` and `catl` research refreshes — F7 (SST / grid-to-chip / the CNY 100B loss / the FCC wired-prong argument, sourced from Sungrow's own record or stated as unconfirmed, weighing Cooley's wired-or-wireless reading now in huawei v7) and F8 (CATL's RMB 4.1B / 49% Zhonhen holdco purchase from CATL's side) — revised and archived per the Profiler Command, step 7 run against `hithium` and `huawei-digital-power`, all six checkers clean, the three hithium pins still loud unless read and recorded.

**To continue:** type `run phase 2a`

## Previous Sessions

**Date:** 2026-09-07 03:52 AM EST
**Repo version:** v05.03r — **two** push commits this session: `6ee86f9` (v05.02r, Phase 0), merged to `main` as `a33b577`, and the v05.03r push carrying the X3b acceptance and this context write
**Branch:** `claude/fable-phase-0-remediation-dvqmwe` (fast-forwarded to `origin/main` after the first merge; the remote branch had been deleted by the workflow, which freed push-once for the second push)
**Model:** Fable 5.1 High — **Phase 0 of the integrated remediation plan, then the X3b acceptance.** No dossier and no report edited.

### What was done

**v05.02r — Phase 0 of the nine-phase integrated plan, all five components.** (1) `PROFILER-COVERAGE-PLAN.md` §9.4's X3 row split into **X3a · integrity close-out = Done v05.01r** (substance kept) and **X3b · report-pin policy = Open**, §9.5 row 5 updated, Phase D still starts at step 2. (2) §9.3's "0 warnings" clause and the "re-pin all four reports" instruction struck **in place** with visible defect notes; a **Phase 0 evaluation** paragraph records why the clause was permanently unreachable (re-verified: `:219` file set from every `*.report.json`, `:228–235` no status gate, `superseded` computed at `:236`) and evaluates the v05.01r proposal — right in substance, wrong in form (prose the checker cannot test; discards the count; silent on superseded reports). Adopted: keep "0 warnings" and make the count mean the right thing. (3) **`repository-information/report-pins-verified.json`** seeded with the 38 pins, generated from a live checker run after confirming the same 38 triples (17 short-gap / 21 wide-gap, named examples matching) and an **empty** `git diff 6ad51a9..HEAD -- live-site-pages/profiler-data`. (4) **`scripts/check-profiler-reports.py`**: two-pass load so `superseded` is known first; superseded reports skipped for pin drift only; verified pins quiet until the dossier moves past `verifiedAt`, then re-warn; the list validated (eight error cases); docstring rewritten. Exercised in a scratch copy: `hithium` v11→v12 gave exactly 3 re-warnings; a superseded report skipped 12 pins and errored its 12 stale entries. **Live: 4 reports, 0 errors, 0 warnings, 38 quiet.** (5) **`repository-information/INTEGRATED-REMEDIATION-PLAN.md`** persisted — nine phases with model/effort/sessions/scope/done-when, the twelve-item X3 finding set with a phase each, the curriculum skeleton (3 lanes · 5 tracks · 30 lessons · 10 built · 20 remaining), dependencies and caveats, status ledger. All six checkers exit 0; `profiler-graph.json` byte-identical for the sixth session (digest asserted).

**v05.03r — X3b accepted, Phase X closed.** Two explanatory turns (what X3b needed from the developer; what "quiet" means) then the developer accepted the amended criterion. §9.4 X3b → Done v05.03r (closed by the session *after* the one that wrote the criterion; v05.02r text kept as history); §9.5 row 5 Phase X closed; §6 and §9.3 record the date; plan §5/§6 updated. Phase 1 paste-in prompt handed over in chat.

### Where we left off

v05.03r pushed. Phase X is closed in every record. **The next unit of work is Phase 1 on Fable 5.1 Medium** — the five zero-research dossier fixes — and a paste-in prompt for it was handed over with this context write. Nothing is half-done.

### Key decisions and findings

- **The session that writes a criterion does not close against it.** Recorded in `INTEGRATED-REMEDIATION-PLAN.md` (intro rule 2) and applied twice this session: Phase 0 left X3b Open despite the checker reading clean, and the acceptance turn flipped it only on the developer's word.
- **"0 warnings" was kept as the criterion, not replaced with prose.** The checker's count is the surface's only mechanical signal; making it mean "every aged pin on a current report read at the current version" preserves it, and the re-warn on dossier movement makes it self-arming. Phase 1 will bump `hithium` (pinned in three current reports) → expect exactly **3 warnings** to return; leave them loud until read again and recorded.
- **Phase 1's fifth dossier, `huawei-digital-power`, is under-specified by the record.** The X3 finding names its Sungrow attributions (CNY 100B market-value loss, FCC wired-prong argument) that `sungrow` v8 does not carry, but not the edit. The plan says the Phase 1 brief scopes it; anything needing Sungrow's own record moves to Phase 2a.
- **Cheap-and-certain before slow-and-uncertain** (Phase 1 before 2a) and **Phase 5 before Phase 6** (do not author the reports twice) are written into the plan's dependency list.
- The `checkout -B` branch restart was denied by the permission classifier; `git merge --ff-only origin/main` reached the same state non-destructively. Prefer the fast-forward when the session's commit is already on `main`.

### Active context

- **Branch:** `claude/fable-phase-0-remediation-dvqmwe` · **repo version:** v05.03r · **Profiler page:** v01.83w (unchanged — every push since v04.85r has been data- or docs-only)
- **Corpus:** unchanged from v05.01r — 154 companies / 154 profiles / 154 study guides / 1,210 concepts / 9 named projects / 8 guidance modules / 4 reports (0 superseded)
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG: 103 sections, 5 dated 2026-09-07.** Same EST day → 104 − 6 = 98 → no rotation. **A later EST day → 104 non-exempt → ROTATION FIRES**; oldest whole date group is the **thirteen** `2026-09-01` sections (`v04.01r`–`v04.13r`). `git fetch --unshallow` MUST run before any SHA lookup; budget ~10 extra minutes.
- **Checker state:** `check-profiler-reports.py` 0 errors / 0 warnings / 38 aged pins verified and quiet (`report-pins-verified.json`, 38 entries). `check-profiler-crossrefs.py` 0 candidates / 21 scopes noted. `check-profiler-relationships.py` 0 findings, accept list 10. Graph digest `563ae281…2168d6`.
- **Plan ledger (`INTEGRATED-REMEDIATION-PLAN.md` §6):** Phase 0 Done (v05.02r, X3b accepted v05.03r) · Phase 1 next · 2a, 2b, 3, 4 (0/20), 5, 6, G6 open.
- **Standing, unassigned:** README *archive* listing behind; `archive/nvidia.profile.v2.json` missing and unreconstructable; OSHA IMIS and SEC EDGAR network-blocked; README tree cosmetics in `study-prep/`. Interim caveat: **do not act on the `named-project` report's whitespace call** until Phase 5.

### Recommendation for next session

- Run **Phase 1 on Fable 5.1 Medium** from `INTEGRATED-REMEDIATION-PLAN.md` §1–§2: the five zero-research dossier fixes — `hithium` (add the `lightsource-bp` customer edge), `google` (Intersect Power at the USD 5,868m 10-Q allocation), `compass-datacenters` (Brookfield × Bloom USD 5bn → 25bn), `arevon` (five-vs-three operating BESS), `huawei-digital-power` (attribution wording only; Sungrow-record questions to 2a) — revised and archived per the Profiler Command, all six checkers clean, and exactly the three `hithium` pins re-warning in `check-profiler-reports.py`, left loud. Every correcting fact is already in the corpus; it is comparison work.

**To continue:** type `run phase 1`
