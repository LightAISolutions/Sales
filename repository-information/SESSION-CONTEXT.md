# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-02 03:17:49 AM EST
**Repo version:** v04.23r
**Branch:** `claude/classroom-pipeline-authoring-rules-wxl3n6`

**What we worked on (one push, v04.23r — C2c, the authoring prompt, on Fable 5.1 High as a fresh session):**

- **`.claude/rules/classroom-app.md` — new section "Authoring a pipeline lesson"** (~95 lines, eight sub-sections), written *to* the twelve assertions of `scripts/check-classroom-pipeline.py`: the shape of a run (pin table → fetch every ref once → classify unchanged / moved / unknown → decide per lesson → decide the briefing → apply the P10 caps ranked by size of contradiction → one write); the **G3 contradiction test** — a revision exists only when the run can write, per section id, *"section `<id>` teaches X; `<ref>` now says Y"* with X actually in that section and Y on the fetched document; **`changed[]` = exactly P8's differs set** (existing ids only, newly appended sections never listed, one entry per run, `updated` = run date, `reviewBy` from the new material's gate); **the briefing** (`edition` = run date so `briefing-<edition>` is deterministic under G10; a G11 *item* is one dated, stated development, a *source* one distinct `ref`; ≥ 3 / ≥ 2 counted **after** the gate is chosen); the new-module exception; **G2 / G7 / §5.2 as the run's own obligations** with per-prefix ref-resolution rules; the eight-step write in checker order; an assertion → rule table
- **Two readings the section fixes that the contract left open** — both the stricter one: (1) a source that moved without contradicting anything leaves the lesson untouched **pin included** (G3's "does not change" read strictly; the G8 report swap is the only pin move without a section change; the re-examination next week is intended idempotence), (2) `title`, `short`, `group`, `type`, `edition`, `tiles[]`, `glossary[]`, `schemaVersion` are **frozen for the run** because contract §3.1 item 2's permitted-edit list omits them and no assertion watches them — a contradicted tile or glossary entry is reported under `Needs the developer`, never edited
- **Recorded:** `CLASSROOM-COMMITTER-CONTRACT.md` §10 "Settled in C2c (2026-09-02)"; `PHASE6-CLASSROOM-DESIGN.md` C2 status → C2a, C2b, C2c done, pipeline live; `CLAUDE.md` Reference Files row and README tree entry for `classroom-app.md`
- **The Routine's C2c pre-flight gate was deleted** from `trig_017pcCGpj1fkNYcUyCXPY3Wd`'s prompt (`update_trigger`, 07:15 UTC) — the prompt is otherwise byte-identical: no corpus token, 45-min / 120-turn budget, the three READ FIRST documents in the same order. **No Classroom code, ledger or `gateDigest` moved**; `--selftest` 13/13 and `check-classroom-content.py` 0/0 re-confirmed

**Where we left off:**

- **C2 is complete and live.** v04.23r merged to `main` (commit `5e5ad0b`). The first real run fires **today, Wednesday 2026-09-02 11:06 UTC (07:06 ET)** — the first fire whose pre-flight is the contract's own §5.1 rather than a stand-down. Push + email notification will carry its §5.4 report
- **Expected first outcome:** with no corpus token the corpus layer is *not read*, so a briefing can only come from dossier / study / guidance / registry / graph / report movement inside `(2026-09-01, 2026-09-02]` — most likely a `STAND-DOWN` with a real `Sources seen:` line, which is itself the measurement C2 needs
- Nothing is pending from this session

**Key decisions made:**

- **The prompt is written to the checkers, not alongside them** — every rule names the assertion that judges it, and the closing table pairs P1–P12 with the run's behaviour, so a future change to an assertion has one place to update in the prose
- **`edition` = the run date**, not the newest item's date: the window is `(coveredThrough, runDate]`, so the run date is what closes it, and it is what makes the briefing id deterministic for a re-fire after a lost push (G10)
- **G11 counted after the gate decision** — an item left out because its source would raise the briefing's gate does not count toward the three; the run picks the edition's tier first (public-only → analyst-visible; one guidance/corpus/briefing input → contributor+; one report → admin-only) and admits only inputs at or below it
- **No number moved** — G11 (3 / 2) and the §5.3 caps stay as the contract set them; the section says a developer may raise them, never lower them
- **Model plan held:** C2c on Fable 5.1 High (done); the weekly runs on Opus 5 High, measured against the contract's caps and budget

**Active context:**

- Repo **v04.23r** · Classroom **v01.04w** / **v01.07g** · Scraper **v01.71w** / **v01.99g** · Profiler **v01.79w** / **v01.33g**
- Capacity: repo CHANGELOG **76/100**; `Scrapergs.changelog.md` **46/50**; `Classroomgs.changelog.md` **7/50**; `Profilerhtml.changelog.md` still **50/50** — the next Profiler page change forces its rotation
- Ledger: `coveredThrough` `2026-09-01`, `lastRun` `null` — left for the first committing run to write
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Verification set for any Classroom change:** `python3 scripts/check-classroom-content.py`, `python3 scripts/check-classroom-pipeline.py --selftest` (13/13), `python3 scripts/check-classroom-pipeline.py --base origin/main` (P1 noise expected on a developer commit; **P3 is not** — refresh `gateDigest`), `node --check` on a `.js` copy of `Classroom.gs`, `node scripts/check-gas-inner-scripts.js`
- **Still flagged, not fixed:** `ENTERPRISE-SETUP.md`'s token record is stale (needs the developer to read the Script Property); the template-wide first-sign-in self-denial (Setup Step 14 trap) is documented but not designed out

**Recommendation for next session:**

- Read the §5.4 report from today's 07:06 ET pipeline run (push/email notification; session title prefixed `BLOCKED —` if it blocked) against the contract's caps and the 45-minute / 120-turn budget, and spot-check the one thing the checkers cannot: that every `ref@date` a `COMMIT` names in CHANGELOG matches the document it claims to have fetched. If it reports `BLOCKED` on P3, the ledger's `gateDigest` is stale against `main` — refresh it with the command in `.claude/rules/classroom-app.md`, not anything in the run. If it reports `STAND-DOWN`, note the `Sources seen:` counts — that is the first measurement of how much the corpus moves week to week, and decides whether the Wednesday cadence and the no-token default hold.

**To continue:** type `review the first pipeline run`

## Previous Sessions

### Session — 2026-09-02 (C2b — the pipeline machinery — v04.22r)
**Date:** 2026-09-02 03:01:02 AM EST
**Repo version:** v04.22r
**Branch:** `claude/classroom-pipeline-c2b-x7f4e2`

**What we worked on (one push, v04.22r — C2b, the Classroom pipeline machinery, on Opus 5 Extra, working `CLASSROOM-COMMITTER-CONTRACT.md` §10 in order):**

- **§10.1 — corpus item identity.** `scTimelineScan_` in `Scraper.gs` now emits `key` on every timeline item: `scArticleKey_`'s base36 digest of the normalised URL, which is also the route's dedupe identity and fits `CL_REF_RE`'s id charset. Without it no `corpus:<item-key>` provenance ref could ever be written. **Behaviour change worth remembering:** the dedupe fallback for legacy intake rows whose signals blob predates `ak` moved from the raw URL to `scArticleKey_(url)` — matching what `scDigestEdgeCandidates_` already did — so two records of one story under different URL spellings now collapse to one row. **Scraper v01.98g → v01.99g**
- **§10.2 — the undated layers.** New "Registry revision signals" section in `PROFILER-SCHEMA.md`: `profiler-projects.json` and `profiler-concepts.json` are dated by **file commit date** (`git log -1 --format=%cs`, read on the base revision), not a per-entry `updated`. An undeterminable date (shallow clone) makes the layer **unknown** for that run, never "today" and never "unchanged"
- **§10.3 — the content fence.** `// CONTENT START` / `// CONTENT END` now bracket the `clLesson*_()` / `clTrack*_()` literals and both registries in `Classroom.gs`; `check-classroom-content.py` gained `check_fence()`, which errors on any literal or registry defined outside it — on every *state*, not only on a diff. Negative-tested by relocating the fence. **Classroom v01.06g → v01.07g**; the gate-surface digest is byte-identical before and after
- **§10.4 — `scripts/check-classroom-pipeline.py` (new, ~1090 lines).** The diff-aware judge: P1–P12 exactly as the contract's §7 table states them, run as `--base origin/main` against the working tree. P6 computes gates by loading the snapshot's own PROJECT region into Node rather than re-implementing the fold. Parsing scans a **comment/string-masked copy** of the `.gs` (same length, bodies blanked) so an apostrophe in a comment or a brace in a string cannot break brace matching, while byte-identical comparisons still read the original. `--selftest` runs **13 fixtures — one positive (a well-formed pipeline commit, which must report nothing) and one negative per assertion** — and refuses to run if any of P1–P12 lacks one. 13/13 pass
- **§10.5 — the ledger.** `repository-information/classroom-pipeline-ledger.json`: `coveredThrough` `2026-09-01` (newest lesson `updated` at creation), `gateDigest` over the 32 §4.2 symbols, `lastRun` `null`. `.claude/rules/classroom-app.md` now carries the developer-side refresh obligation **with the command that recomputes it**, plus the fence and both new checker invocations in the verification set
- **§10.6 — the Routine, armed.** `trig_017pcCGpj1fkNYcUyCXPY3Wd`, `0 11 * * 3` (Wednesday ~11:00 UTC / 07:00 ET), fresh session per fire, `notifications: { push: true, email: true }`, prompt carrying the contract by path, a 45-min / 120-turn budget, and **no corpus token**
- **§10.7 — deferred with a reason.** The admin-only in-app "curriculum current through …" surface waits for C3, and the ledger is **not** mirrored into a Script Property: that would add a write target the checkers cannot judge (a Script Property leaves no diff) to buy one line of text
- **Recorded:** `CLASSROOM-COMMITTER-CONTRACT.md` §10 "Settled in C2b" (one row per handed item), `PHASE6-CLASSROOM-DESIGN.md` (C2a+C2b done, C2c not started), `CLAUDE.md` Reference Files row, README tree (two new entries + both GAS version displays)

**Where we left off:**

- **C2b is complete, pushed and merged** (v04.22r on `main`, commit `4fc34af`). No page version moved — Classroom stays **v01.04w**, Scraper **v01.71w**
- **The Routine is live and will fire Wednesday ~11:00 UTC**, but **it stands itself down until C2c lands** (see key decisions). Expect a push + email notification reporting `STAND-DOWN` each Wednesday until then
- **C2c has not been started.** It is the only thing between the machinery and the first real authoring run

**Key decisions made:**

- **The Routine's pre-flight gates on C2c.** Its first fire was ~4 hours after arming, before any authoring prompt existed. Rather than disable it (the developer asked for it armed) or let it author curriculum without the C2c bar, the prompt requires a section headed **"Authoring a pipeline lesson"** in `.claude/rules/classroom-app.md` and reports `STAND-DOWN` when absent. **Deleting that one paragraph from the Routine prompt lifts it** — that is the C2c hand-off switch
- **File commit date over a per-entry `updated`** for the undated registries: a per-entry date cannot serve `concepts:profiler-concepts` at all (it is a whole-file identity like the graph), and a field a human must remember to set fails in the *unsafe* direction — a forgotten date makes a changed source look unchanged. The file date over-triggers candidacy instead, which G3 and the blast-radius caps already bound
- **The gate digest includes comments** inside the 32 gate symbols (whitespace-normalised, comments kept). Deliberate — a change to the reasoning written next to the gate is exactly what a run should see acknowledged — but it means a comment reflow in e.g. `clStudyNext_` blocks the next run until `gateDigest` is refreshed
- **No assertion was softened to make the repo pass.** This developer commit deliberately fails P1 (seven paths outside the committer's write set); that is the checker working on a developer commit
- **No diagram change.** The Scraper sequence diagram depicts the corpus route at `{items[] | candidates[]}` granularity and never enumerates response fields; its "dedupes editions on the article key" note is now *more* accurate. The Classroom diagram depicts serve-time behaviour, unchanged

**Active context:**

- Repo **v04.22r** · Classroom **v01.04w** / **v01.07g** · Scraper **v01.71w** / **v01.99g** · Profiler **v01.79w** / **v01.33g**
- Capacity: repo CHANGELOG **75/100**; `Scrapergs.changelog.md` **46/50** (four Scraper GAS pushes from forced rotation); `Classroomgs.changelog.md` **7/50**; `Profilerhtml.changelog.md` still **50/50** — the next Profiler page change forces its rotation
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Verification set for any Classroom change:** `python3 scripts/check-classroom-content.py`, `python3 scripts/check-classroom-pipeline.py --selftest` (must stay 13/13), `python3 scripts/check-classroom-pipeline.py --base origin/main` (P1 write-set noise is expected on a developer commit; **P3 is not** — refresh `gateDigest`), `node --check` on a `.js` copy of `Classroom.gs`, `node scripts/check-gas-inner-scripts.js`
- **Still flagged, not fixed:** `ENTERPRISE-SETUP.md`'s token record is stale (needs the developer to read the Script Property); the template-wide first-sign-in self-denial (Setup Step 14 trap) is documented but not designed out
- **Model plan:** C2c — authoring prompt + freshness deltas — **Fable 5.1 High**; the weekly runs — **Opus 5 High**, measured against the contract's caps

**Recommendation for next session:**

- Run **C2c — the authoring prompt** on **Fable 5.1 High** as a fresh session: add an **"Authoring a pipeline lesson"** section to `.claude/rules/classroom-app.md`, written against `CLASSROOM-COMMITTER-CONTRACT.md` and the twelve assertions that now mechanically enforce it — in particular what makes newer material a **contradiction** under G3 rather than novelty, how to name `revisions[].changed[]` so P8's "differing sections == changed[]" equality holds, the G11 minimum-material bar for a briefing (≥3 qualifying items across ≥2 sources), and the three guarantees no checker can see (G2 read-before-re-pin, G7 ref resolution, §5.2 read-phase honesty). Read the contract and `scripts/check-classroom-pipeline.py`'s assertion list first — the prompt is written *to* the checkers, not alongside them. Finish by deleting the "PRE-FLIGHT GATE — C2c" paragraph from Routine `trig_017pcCGpj1fkNYcUyCXPY3Wd` so the next Wednesday run is a real one.

**To continue:** type `build C2c — the authoring prompt`
