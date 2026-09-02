# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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


## Previous Sessions

### Session — 2026-09-02 (C2a — the unattended-committer contract — v04.21r)
**Date:** 2026-09-02 02:17:43 AM EST
**Repo version:** v04.21r
**Branch:** `claude/c2a-unattended-committer-spec-0d10mk`

**What we worked on (one push, v04.21r — C2a, the unattended-committer contract, design only, on Fable 5.1 Extra as a fresh session):**

- **`repository-information/CLASSROOM-COMMITTER-CONTRACT.md` (new, ten sections)** — the contract a scheduled Classroom pipeline run is held to. **§3 write set (closed):** the *content region* of `Classroom.gs` (the `clLesson*_()` / `clTrack*_()` literals + the two registries — C2b fences it with `// CONTENT START` / `// CONTENT END`), the `VERSION` line, the GAS version/changelog files, the repo CHANGELOG (+ archive), `repository.version.txt`, two lines of `README.md`, and a new `classroom-pipeline-ledger.json`. Deliberately excluded: `SESSION-CONTEXT.md` (weekly auto-reconstruction would flush the developer's handoff under the 2-session cap), `REMINDERS.md`/`TODO.md`, `Classroom.html`, the whole corpus
- **§4 frozen surfaces:** the AUTH region + template (shared across five projects), the gate derivation (every `CL_*` constant and `cl*` gating/progress/ops function — frozen so the stamp stays *checked* not *trusted*), the stamp vocabulary (no new prefix/kind/rung, no `note:`, no unread input, no unresolved ref, no URL), permanent ids (section ids never removed — `clProgressVisible_` would erase the tick for every account), append-only tracks/registries, and **the gate of an existing lesson never changes in either direction**
- **§5 fail-closed:** `COMMIT` / `STAND-DOWN` (repo untouched, silent — the Profiler drift-check precedent) / `BLOCKED` (repo untouched, reported via final message + Routine notification + `BLOCKED —` session title). Pre-flight blocks on identity, a red baseline checker, gate-surface drift vs the ledger's `gateDigest`, a schema bump without a contract update. One attempt per run, never edits its judge, blast-radius caps (≤1 briefing, ≤1 module, ≤3 revisions, ≤1 track)
- **§6 thirteen corpus-delta guarantees** (pinned baseline, read-before-re-pin, contradiction-not-novelty, meaning-not-wording, monotone pins, gate invariance, ref resolution, superseded-report swap, watermark discipline, determinism, minimum material, progress safety, `reviewBy` from the lesson's own gate) + per-layer revision-signal table + a minimal ledger (`coveredThrough`, `gateDigest`, `lastRun`; pins stay in the lessons). **§7** the twelve assertions of a diff-aware `check-classroom-pipeline.py` C2b must add, each with a failing fixture. **§8** CHANGELOG run record. **§9** cadence recommendation Wednesday 11:00 UTC. **§10** seven items handed to C2b/C2c
- **Pointers:** `.claude/rules/classroom-app.md` (path scope + new "Unattended (pipeline) sessions" section, including the one obligation that flows back to developer sessions — refresh `gateDigest` when the gate surface changes), `PHASE6-CLASSROOM-DESIGN.md` (C2 status note), `CLASSROOM-SCHEMA.md` (Freshness pointer), `CLAUDE.md` Reference Files row, README tree
- **CHANGELOG rotated** — the 2026-08-28 date group (27 sections, v03.21r → v03.47r) archived with SHA enrichment; counter 100 → **74/100**

**Where we left off:**

- **C2a is complete, pushed and merged** (v04.21r on `main`). No page, GAS, or data file changed — Classroom stays **v01.04w / v01.06g**
- **C2b and C2c have not been started.** Nothing mechanical enforces the contract yet — no content fence, no ledger, no pipeline checker, no Routine

**Key decisions made:**

- **"PROJECT region" is too coarse an allowlist** — the gate derivation and the lesson literals share it in `Classroom.gs`, so the contract defines a narrower *content region* and makes C2b fence it explicitly
- **The gate of an existing lesson never changes in a pipeline run, in either direction** — raising hides a lesson analysts were reading; lowering is the "content flows down the ladder" failure. New material at a different gate becomes a new lesson
- **Stand-downs leave no repo trace; blocked runs report out of band** — a quiet week must not cost a workflow run, a version bump and a CHANGELOG section; a blocked run must not write anything (not even a reminder) because a blocked run's judgment is exactly what is in doubt
- **Pins stay in the lessons; the ledger carries only what lessons cannot** (the watermark, the gate digest, the last committing run) — one source of truth, nothing to drift
- **A separate document rather than a schema section** — the schema says what a lesson *is*; the contract says what an unwatched actor may *do to the repository*
- **Two prerequisite gaps found and handed to C2b, not patched here:** the Scraper timeline route identifies items by `url` (cannot fit `CL_REF_RE`'s id charset — no `corpus:` ref can be written yet), and `profiler-projects.json` / `profiler-concepts.json` carry no per-entry revision date

**Active context:**

- Repo **v04.21r** · Classroom **v01.04w** / **v01.06g** · Profiler **v01.79w** / **v01.33g** · Scraper **v01.71w** / **v01.98g**
- Capacity: repo CHANGELOG **74/100** (room again); `Profilerhtml.changelog.md` still **50/50** — the next Profiler page change forces its rotation
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- Verification set for any Classroom change: `python3 scripts/check-classroom-content.py`, `node --check` on a `.js` copy of `Classroom.gs`, `node scripts/check-gas-inner-scripts.js`. For Profiler role surfaces: `python3 scripts/verify-profiler-roles.py`
- **Still flagged, not fixed:** `ENTERPRISE-SETUP.md`'s token record is stale (needs the developer to read the Script Property); the template-wide first-sign-in self-denial (Setup Step 14 trap) is documented but not designed out
- **Model plan for the rest of C2:** C2b — build the machinery — **Opus 5 Extra**; C2c — authoring prompt + freshness deltas — **Fable 5.1 High**; the weekly runs — **Opus 5 High**, measured against the contract's caps

**Recommendation for next session:**

- Run **C2b — the pipeline machinery** on **Opus 5 Extra**, working the contract's §10 in order: (1) expose a stable, charset-safe item key on the Scraper timeline route, (2) decide the undated-layer signal for projects/concepts in `PROFILER-SCHEMA.md`, (3) add the `// CONTENT START` / `// CONTENT END` fence to `Classroom.gs` and teach `check-classroom-content.py` to flag literals outside it, (4) write `scripts/check-classroom-pipeline.py` with its twelve assertions and a failing fixture for each, (5) create the ledger, and only then (6) arm the weekly Routine with push + email notifications. Read `CLASSROOM-COMMITTER-CONTRACT.md` first — the machinery is built *to* it, not the other way round.

**To continue:** type `build C2b — the pipeline machinery`
