# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
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

## Previous Sessions

### Session — 2026-09-02 (Classroom C1 finished end-to-end + Profiler sign-in log — v04.20r)
**Date:** 2026-09-02 01:39:01 AM EST
**Repo version:** v04.20r
**Branch:** `claude/opus5-extra-first-tracks-dne4vq`

**What we worked on (eight pushes, v04.13r → v04.20r — Classroom C1 finished end-to-end, plus a Profiler sign-in log, all on Opus 5 Extra):**

- **v04.13r — first tracks + the renderer.** Five lessons authored from the existing corpus (`cell-to-container`, `duration-and-degradation`, `spec-sheet-decoded` (the one guidance-stamped module), `the-aidc-power-chain`, `heat-is-the-constraint`) registered in `clLessons_()`, two tracks in `clTracks_()` (`bess-foundations` 3, `aidc-power-primer` 2). The guidance renderer was ported into `Classroom.html` as the `cl*` engine (all nine section kinds, `{{term}}` tooltips, hash routing `#lesson/<id>[/<sectionId>]`), rendering through the `action=classroom` ops
- **v04.14r–v04.17r — deploy, then the sign-in outage.** GAS deployed (`DEPLOYMENT_ID` recorded, token verified as correct — the same repo, and PATs are scoped per-repository not per-path), merge confirmed three independent ways (git log, a read-only `curl` of `/exec`, the Pages version files). Sign-in then failed `not_authorized` with the ACL plainly TRUE — **stale ACL denial cache**, fixed by running `clearAllAccessCache` (no args, bumps `CACHE_EPOCH`) and documented as Setup Step 14 in `gas-scripts-reference.md`
- **v04.18r — per-account progress.** One Script Property per account (`cl_progress:<email>`), `cop=progress|setprogress`, and the security rule that matters: `clProgressValid_()` builds the tickable set from `clLessonVisible_()`, so **progress is never a weaker gate than reading**. The Profiler cache trap was pre-empted rather than repeated — `clAcctKey()` folds an account digest into every local storage key from the first commit, so Classroom never shipped a shared key and needs no purge shim. Gated-lesson reads now audit to the sheet
- **v04.19r — study-next pointer.** `clStudyNext_()` walks tracks in registry order and **skips** unreadable lessons rather than stopping; returned by `index`, `progress` and `setprogress`; rendered as the study-next card. Audit sheet wired (`16tt7n_…`, the workbook the developer renamed to "BESS/AIDC")
- **v04.20r — Profiler sign-in log.** In-app, admin-only (`SIGNIN_ROLES = []` — no role name qualifies, the `admin` permission is the only door), reading the existing `ProfilerSessionAuditLog` tab rather than adding a sheet. The masthead slot bug (Sign-ins overlapping Reports) was self-inflicted by folding the new button into Reports' CSS rule; fixed with per-button slots + `min-height: 194px`, verified by reading bounding boxes rather than eyeballing a screenshot
- **Verification throughout:** `check-classroom-content.py` grew 97 → **123 gate cases** (progress + study-next truth tables, `{{term}}` coverage); `verify-profiler-roles.py` gained the `signins` surface across all tiers

**Where we left off:**

- **C1 is complete, live and merged.** Classroom **v01.04w / v01.06g**, Profiler **v01.79w / v01.33g**. The app is signed into and working — index, tracks, lesson views, per-account progress and the study-next card all render against real data
- **C2 has not been started.** No pipeline, no Routine, no corpus-delta computation, no commit-and-deploy path
- Nothing is pending in the working tree; every push merged cleanly

**Key decisions made:**

- **Progress inherits the read gate, never its own.** The tickable set is derived from visibility at serve time — a lesson you cannot read cannot be marked read. This is the one invariant C2's committer must not break
- **The account digest went in from the first commit, not after a bug.** Profiler's shared-key trap was known, so Classroom's keys were per-account from the start; `gdPurgeSharedProgress()` was deliberately **not** ported (nothing to purge)
- **Study-next skips, never stops.** An unreadable lesson mid-track advances the pointer rather than dead-ending an analyst behind a contributor-gated module
- **The sign-in log is a read of existing audit data, not a new store** — and it is gated on the `admin` *permission*, not a role name, so a renamed tier cannot accidentally inherit it
- **The 600s ACL cache TTL and the FALSE-seeding in `registerSelfProject()` were left alone** — the AUTH region is shared across five projects; the trap is documented instead (Chesterton's Fence)
- **Public changelog discipline held**: track titles are themselves gated, so page/GAS changelog entries stay generic — the repo CHANGELOG carries the detail

**Active context:**

- Repo **v04.20r** · Classroom **v01.04w** / **v01.06g** · Profiler **v01.79w** / **v01.33g** · Scraper **v01.71w** / **v01.98g**
- **Two changelogs are at capacity — the next change to either forces archive rotation**: repo `CHANGELOG.md` **100/100**, `Profilerhtml.changelog.md` **50/50**. Classroom's page/GAS changelogs have room
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- Verification set for any Classroom change: `python3 scripts/check-classroom-content.py`, `node --check` on a `.js` copy of `Classroom.gs`, `node scripts/check-gas-inner-scripts.js`. For Profiler role surfaces: `python3 scripts/verify-profiler-roles.py`
- **Flagged, not fixed (needs a fact only the developer can read):** `ENTERPRISE-SETUP.md`'s token record is stale — the header says 5 GAS projects, the list names three, and Repository access reads `LightAISolutions/lightaisolutions` (the template) while every `.gs` pulls from `LightAISolutions/Sales`. Correcting it requires reading the actual Script Property
- **Also outstanding:** the template-wide first-sign-in self-denial (the Setup Step 14 trap) is documented but not designed out
- **Model plan for C2 (revised this session):** C2a — the unattended-committer contract, design only — **Fable 5.1 Extra**; C2b — build the machinery — **Opus 5 Extra**; C2c — authoring prompt + freshness deltas — **Fable 5.1 High**; the weekly runs — **Opus 5 High**, measured
- **Why a fresh session for C2a**: prompt caches are model-scoped, so continuing this transcript on Fable 5.1 would re-read ~20 turns of implementation detail at 2× input price with no cache reuse — and a design pass is *better* served starting from this curated context than from the implementation narrative, which biases toward "extend what exists"

**Recommendation for next session:**

- Run **C2a — the unattended-committer contract** on **Fable 5.1 Extra**: a written spec, no implementation. It must answer what the scheduled pipeline may write (which files, which registries), what it must never touch (the provenance stamp vocabulary, the gate derivation, anything under `AUTH`), how it fails closed when the corpus delta is ambiguous or the checker fails, and what the delta computation must guarantee before a lesson is allowed to change. C1 shipped the invariants; C2a is where they get stated as a contract an unattended committer can be held to — before any code can quietly weaken them.

**To continue:** type `build C2a — the unattended-committer contract`

Developed by: LightAISolutions
