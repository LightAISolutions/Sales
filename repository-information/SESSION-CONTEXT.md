# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-04 03:19 PM EST
**Repo version:** v04.54r (started at v04.51r — **three** push commits this session: `966da36` v04.52r, `2eeccde` v04.53r, `2d5ff01` v04.54r, plus this context write)
**Branch:** `claude/phase-c11-profiler-coverage-49yg1c`
**Model:** **Opus 5 xhigh — §2 assigns Phase C to Opus natively, so there is NO substitution to record.** The three C11 rows in §8 read plain `Opus 5 xhigh`

### What was done

- **Phase C11 (v04.52r)** — `oklo`, `trane-technologies` and `mccarthy`: three schema-v7 dossiers at profileVersion 1, three schema-v2 study guides, 145 net new shared concepts (465 → 610), 18 relationship backfills with archival, 20 exec headshots, three lesson plans, three calendar rows, README tree entries and the three §8 rows flipped. Verified with `sync-profiler-registry.py --check` (0 of 109 out of sync), `check-profiler-study.py` (0 errors / 0 warnings, 83 guides, 610 concepts), `build-profiler-graph.py` (706 edges, 534 curated) and Playwright across all three plus a control slug with zero page errors and zero unresolved `{{term}}` markers.
- **§6 bookkeeping, first pass (v04.53r)** — **G8 closed** and **G7 moved to Partial**, both dated `v04.52r`, plus a "Targeted re-run of G7 and G8" paragraph in the v04.51r form.
- **§6 full re-run (v04.54r)** — the re-run the register said was owed at the close of Phase B, run one phase late. Writing an honest standings note meant re-checking every row first, and **that found two rows sitting at Partial after the work that closes them had already landed**: **G2 closed** (the corpus holds all four gen-set OEMs — `caterpillar`, `cummins`, `rolls-royce-power-systems` and `rehlko`, Rehlko being the carved-out Kohler Energy business, against an ask of two of four) and **G5 closed, over-satisfied** (six `utility` dossiers with guides against an ask of four). G4, G6 and G10 re-checked and dated unchanged. A **Standings block** was inserted directly under the table, ahead of the four dated re-check paragraphs, sorting what is left by **scheduled** (G7, G10 — both coverage-plan §8 row B10) versus **structural** (G4, G6 — no ledger row can produce them).

### Where we left off

All three commits are pushed and merged; the working tree is clean and the branch is at `origin/main`. The register now stands at **six closed** (G1, G2, G3, G5, G8, G9), **two Partial** (G4, G7), **two Open** (G6, G10), **two standing judgments** (G11, G12). The developer asked for a paste-ready commissioning prompt for the **G4 guidance module**, which was delivered in chat this turn and is reproduced in the recommendation below.

### Key decisions and findings

- **The recommendation to "rewrite the stale commission-first paragraph" was deliberately not followed.** That paragraph is a dated record in an append-only trail; rewriting it would have made §6 lie about its own history. The real problem was the **order** a top-down reader met things in, so current standings were inserted **above** the trail and all four historical paragraphs were left untouched.
- **The register's staleness is a structural failure mode, not a one-off.** G2 and G5 sat wrong for four and five repo versions because their own text named the sessions that would close them and nobody re-ran the check afterwards. Nothing in the repo fires that check automatically.
- **A prior session's assumption about G4 was wrong and is corrected here.** The v04.51r entry said G4's module "needs a source document from the developer". It does not: **five of the seven existing guidance modules have no ingested source at all** — only `nvidia-800vdc-white-paper-2026-08.pdf` and the EO 14420 HTML/txt exist under `industry-guidance/sources/`. The other five are teaching syntheses that declare provenance in a `**Provenance:**` line (see `power-infrastructure-aidc-analysis.md`). A G4 session can be commissioned today with no upload.
- **G10 was deliberately left Open on a judgment call.** `black-veatch` is covered but as an EPC, and the row names it among the independent engineers; whether an EPC dossier can occupy the IE seat is the developer's call, not a re-check's.
- **`powell-industries`, not `powell`.** An early probe on the short slug returned a false negative that would have contradicted G4's v04.51r text.
- Six curly apostrophes written earlier in the session were normalised to straight, matching the file's 84-to-0 convention.

### Active context

- Branch `claude/phase-c11-profiler-coverage-49yg1c`; repo version **v04.54r**; CHANGELOG counter **71/100**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- Registry at **109 companies**, concepts at **610**, study guides at **83**, graph at **706 edges**.
- `REMINDERS.md` still carries one active reminder: the **Fable 5.1 High vs Opus 5 xhigh head-to-head on the Xcel Energy dossier** (baseline is `xcel-energy.profile.json` at `v04.46r`, commit `2652d30`).
- Still owed elsewhere: Fable session **B10** (`coolit` closes G7, `dnv`/`sargent-lundy` close G10, plus `mgx`, `x-energy`), and a guidance session for **G6** ("Interconnection for large loads").

### Recommendation for next session

- **Commission the G4 guidance module — "The grid-equipment shortage: GOES, bushings, test bays, lead times" — as a fresh Opus 5 xhigh session.** It is the top of the register's own restated list, it is the only remaining gap whose public sources are already in the corpus (the Siemens Energy Grid Technologies spine, `powell-industries`, plus `hitachi-energy`, `ge-vernova`, `abb`, `mitsubishi-electric`), and no scheduled Profiler session will ever close it. The full paste-ready prompt was written out in chat on 2026-09-04 at 03:19 PM EST; re-derive it from `.claude/rules/industry-guidance.md` steps 1–10 if it is not to hand. **The session must also flip §6's G4 row to Closed with a dated re-check AND update the Standings block in the same commit** — that block names G4 and G6 as the two structural rows and goes stale the moment the module lands, which is precisely the failure this session spent a commit repairing.
**To continue:** type `commission the G4 grid-equipment-shortage guidance module on Opus 5 xhigh`

## Previous Sessions


**Date:** 2026-09-04 04:40 AM EST
**Repo version:** v04.51r (started at v04.50r — one push commit, `4a371aa`, plus this context write)
**Branch:** `claude/section8-guide-revisions-opus5-7y6n3p`
**Model:** **Opus 5 xhigh — §2 assigns ALL study-guide work on existing dossiers to Opus natively, so there is NO substitution to record.** The §8 Guide column reads plain `✓ · v04.51r` on all four rows

**What we worked on — the three §8 guide revisions plus the `narada` backfill, landed as v04.51r in one data-only push. This was a GUIDE session: no new dossiers, no new companies, no profile writes.**

- **`vertiv.study.json` 6 → 18 sections.** The guide was cooling-only. Ten new sections teach the UPS as **the machine and the transaction**: what a `power module` physically is and the three things engineered into the *slot* (current sharing by droop, precharge/isolation decoupling, touch safety); module/frame/unit/system/path as five different purchases; capacity-on-demand, which defers about a third of the cost rather than most of it; the ratings ladder from a 33 kW rack shelf to a 50 MW prefab block; a twelve-row datasheet reading (overload rating, short-circuit contribution, THDi, battery charge-current limit, floor loading, IEC 62443); the eleven-step procurement sequence with **submittal approval named as the silent schedule killer**; and what moving the store into the rack distributes
- **`schneider-electric.study.json` 6 → 17 sections.** Nine new sections on the deliberately different axis — **the system and the ladder**: the five redundancy arrangements above the machine, the installed-MW-per-protected-MW arithmetic (N = 1.0 · block-redundant and N+1 at 4+1 = 1.25 · distributed redundant = 1.5 · 2N = 2.0), the maintenance day as the real design case, the distribution between the UPS output and the server's two cords read as a *redundancy* problem, one UPS idea across four orders of magnitude, and the battery that earns
- **`siemens-energy.study.json` 6 → 18 sections.** Ten new Grid Technologies sections teaching **the network as a system**: why the wire not the plant is the constraint and the three limits that bind under N-1; terminals → GCB → GSU → bay → switchyard → point of interconnection as a procurement sequence, read twice (once for a plant, once for a campus); AIS vs GIS vs SF6-free; the four reasons to build a DC link; inertia and system strength with the synchronous condenser against the STATCOM; and the buyer's six instruments against a 36-month transformer
- **`narada.study.json` new, 13 sections** — the backup battery from the **cell's** side: the sprinter and the distance runner, electrode thickness as the choice that splits them, the constant-power specification (watts per cell, to an end voltage, at a temperature) and why amp-hour sizing comes up short, AGM/lead-carbon and why lead survived partial-state-of-charge duty, the string and its worst cell (conductance screening vs a real capacity test), and the 500 ms pulse duty
- **Lesson plans** under `study-prep/vertiv/`, `.../schneider-electric/`, `.../siemens-energy/` and `.../narada/` — **four new folders; none of these four companies had one before**
- **Concepts 401 → 464** (+62, plus 2 added on validator feedback = 465 final)

**The register answer, verified against the corpus rather than remembered:**

- **G3 CLOSES** (v04.51r). Both revisions landed; the dossier half was already satisfied twice over by Piller (v04.42r) and Mitsubishi Electric (v04.48r)
- **G9 CLOSES** (v04.51r). The Narada guide is the battery half of the DC bus; Vicor (v04.44r) was the silicon/shelf half. `inside-the-rack` and `the-800-vdc-shift` can now pin `study:narada`
- **G4 is TWO OF THREE and cannot close from Profiler work at all.** Siemens Energy revision ✓, Powell dossier ✓ (v04.48r). The third ask is a guidance module *"The grid-equipment shortage: GOES, bushings, test bays, lead times"*. Verified: `guidanceDocs_()` still returns the same seven modules, and **§8 of the coverage plan contains no guidance-module row anywhere**. §5 of that plan predicts G4 will close at the phase re-run — that prediction is wrong, and the §6 register note now says so. **The Industry Guidance Command's step 1 requires an UPLOADED source document**, so this cannot be handed to an unattended session; the developer has to bring a document
- Only G3, G4 and G9 were re-run. G2, G5, G6, G7, G8, G10, G11, G12 keep their Phase-A dates; the full re-run is still owed at the close of Phase B

**Key decisions and positions taken:**

- **The vertiv/schneider split was decided explicitly and stated in both guides' opening callouts**, as the brief required: Vertiv = the machine and the transaction, Schneider = the system and the ladder. The split was chosen *after* reading Rehlko, Piller, Mitsubishi Electric and Eaton in full — Rehlko already owns monolithic-vs-modular, the four clocks and the three sizing numbers, and Mitsubishi Electric owns the efficiency curve and the VRLA/lithium table, so neither revision re-argues any of it
- **Nothing was deleted from the three revised guides.** All six pre-existing sections in each are byte-identical (verified with `git show HEAD:`), and all 36 legacy top-level `flashcards[]` cards were preserved by folding them into the new inline `drill` sections. Chesterton's Fence held: the temptation was to rewrite the mechanically-lifted v1 prose, and it was resisted because the brief asked for an addition, not a rewrite
- **Three concept candidates were dropped as alias collisions rather than added**: `maintenance bypass` and `wrap-around bypass` already resolve through `static bypass`, `switchyard` through `substation`, `reactive power` through `power factor`. The existing definitions were checked and found adequate; the distinctions that mattered (a manual wrap-around cabinet vs the automatic static switch) are taught in plain prose instead
- **No registry sync and no graph rebuild were run, deliberately** — no `*.profile.json` was touched, so both would have been no-ops. Reported as a decision rather than silently skipped, because the brief asked for exactly that. No calendar rows, no Profiler page or GAS bump

**Environment notes — TWO NEW CORRECTIONS beyond the inherited C3 set:**

- **The Profiler route is `#<slug>`, NOT `#/company/<slug>`.** The C3 notes never recorded the hash format and the first harness run timed out waiting for `#ov-study-btn`
- **The image's Playwright browser build is 1194; the pip package (1.62) expects 1234.** Launch with `executable_path='/opt/pw-browsers/chromium'` (plus `--no-sandbox`). **`playwright install` is not the fix** and should not be attempted
- Everything else from C3 held exactly and should be carried forward: threaded HTTP server or `page.reload()` deadlocks; `add_init_script` setting `localStorage ov_note_role='admin'`; an injected style hiding `#ov-authwall`; `accounts.google.com` fulfilled with an empty script; `ensure_ascii=False` for marker comparison; tabs are `id="ov-tab-<key>"`; assert `.ov-rel-src` against *sourced* relationships only; control-test an untouched slug first to set the console baseline
- **NEW AUTHORING TRAP: a `{{term}}` marker must carry the concept's TERM, not its slug.** `{{mobile-substation}}` does not resolve where the registry holds `mobile substation`. It is completely silent while authoring — a slug reads like a plausible marker — and it produced **48 errors across 25 distinct terms in two guides**. `check-profiler-study.py` catches every one, and a slug→term repair pass fixes them mechanically
- The indent trap did not repeat: `*.profile.json` / `*.study.json` at indent=1 with **no** trailing newline, `profiler-concepts.json` at indent=2 **with** one — verified against live files before writing. `repository.version.txt` **does** carry a trailing newline (caught at the pre-stage diff review)
- **Authoring the guides as one Python builder script each** (12–18 sections per tool call) rather than many small Edits is why the session ran 41m against a 75m estimate. The per-tool-call heuristics do not model this pattern

**Verification, all green at close:** study checker `0 errors, 80 guides / 465 concepts` · Playwright across all four guides plus an untouched control slug (`rehlko`) — zero page errors, zero new console errors, zero literal `{{markers}}` rendered, every `{{term}}` resolving in the DOM (145 distinct concepts; 204 counted per guide) and every section title present, 18/18 · 17/17 · 18/18 · 13/13 sections rendered

**Where we left off:** `4a371aa` is merged to `main` (v04.51r) and the branch was deleted by the auto-merge workflow. The developer then asked for the next paste-in prompt, which was delivered in chat for **C11** — Oklo · Trane Technologies · McCarthy — with its own entity-discipline notes (Oklo is pre-revenue and no Aurora is operating; Trane Technologies is not just Trane and the data-centre line is a minority of revenue; McCarthy is private and employee-owned, so expect a collection gap on revenue and mix).

**Active context:** `TEMPLATE_DEPLOY` Off · `MULTI_SESSION_MODE` Off · `CHAT_BOOKENDS` Off · `START_OF_RESPONSE_BLOCK` On · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · Profiler `v01.82w` / `v01.34g` (untouched — data-only session) · **106 dossiers · 80 study guides · concepts 465 · graph 678 edges (unchanged) · calendar 67 rows (unchanged) · execs 328 images / 62 companies · CHANGELOG 68/100** · 1 active reminder (the Xcel Fable-vs-Opus model test) · TODO empty

**Recommendation for next session:**

- **Run C11 — Oklo, Trane Technologies and McCarthy — as one Opus 5 xhigh dossier session.** It is the only remaining Opus session that closes a register row: Oklo closes **G8** outright if its guide teaches what is genuinely new about an SMR as engineering (factory fabrication vs site construction, HALEU, the licensing path as the schedule, load-following, build-own-operate) rather than telling a company story, and Trane delivers the chiller half of **G7** — whose CDU half is CoolIT in Fable session **B10**, so G7 cannot close this session and the report at the end should say so plainly. After C11, every register row Opus can close is closed, and the remaining blockers are Fable's B10 (G7, G10) and a **guidance session** for G4's grid-equipment-shortage module, which needs a source document from the developer.
**To continue:** type `run Phase C11 on Opus 5 xhigh`
