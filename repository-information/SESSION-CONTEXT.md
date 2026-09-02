# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
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

## Previous Sessions

### Session — 2026-09-01 (Classroom C1 — track/lesson schema + provenance stamp — v04.12r)
**Date:** 2026-09-01 10:37:01 PM EST
**Repo version:** v04.12r
**Branch:** `claude/c1-track-lesson-schema-k4nh88`

**What we worked on (one push, v04.12r — Classroom C1, schema slice, on Fable 5.1 High):**

- **The track/lesson schema and its provenance stamp — the one irreversible decision in v1 — built first, before any renderer or progress code.** `repository-information/CLASSROOM-SCHEMA.md` (new) is the single source of truth: id rules, the stamp (`provenance.inputs[]{kind, ref, date}`), lesson schema v1 (`module` / `briefing`, guidance section-kind vocabulary, `reviewBy`, `revisions[].changed[]`), track schema v1, freshness hooks, the `action=classroom` op contract, a worked example, verification and extension rules
- **The stamp is checked, not trusted.** `CL_PROVENANCE_REF_KINDS` in `Classroom.gs` (v01.01g) maps ref prefixes to kinds (`profile`/`study`/`project`/`graph`/`concepts` → public; `guidance` → guidance; `corpus`/`briefing` → briefing; `report` → report). `clStampKinds_()` reads a lesson's stamp into the list the C0 gate folds and returns `[]` (→ deny) on a missing/empty stamp, malformed ref, unknown prefix, or kind/prefix mismatch. There is no `note:` prefix by design
- **Registries + filtering + ops:** `clLessons_()` / `clTracks_()` (empty), `clLessonCard_()` metadata cards, per-tier `clLessonIndexFor_` / `clTrackFor_` / `clTrackIndexFor_` (withheld counts; unreadable tracks are not enumerable), and read-only `handleClassroomOp_()` (`cop=index|track|lesson`, wired in `doPost` and the GET `api` mirror) — session → `clRequire_(sess,'tracks')` → `clRequireLesson_()` on the lesson's own stamp before any section text leaves the server
- **`scripts/check-classroom-content.py` (new)** parses the strict-JSON lesson/track literals out of the `.gs`, validates both schemas and every stamp against the prefix table read from the code itself, then loads the PROJECT region into Node and asserts a 97-case truth table (fold outcomes, per-tier visibility, index filtering, card shape, audited denials). Clean pass, no warnings
- **`.claude/rules/classroom-app.md` (new, path-scoped) + CLAUDE.md Reference Files row** — the authoring contract C2's pipeline sessions inherit; PHASE6 doc carries a C1 status note; README tree lists the three new files

**Where we left off:**

- The schema slice is complete, pushed and merged (v04.12r). Classroom is at **v01.00w / v01.01g**; the page was not touched this session
- **Registries are empty by design.** Nothing renders in Classroom yet — the remaining C1 slices are: first tracks from the corpus, the renderer (port the guidance engine), per-account progress (`gd_progress` pattern), and the study-next pointer
- **`DEPLOYMENT_ID` is still a placeholder** — the ops answer only after the developer deploys the GAS project once and records the ID in `googleAppsScripts/Classroom/Classroom.config.json`

**Key decisions made:**

- **Content lives in `Classroom.gs` as strict-JSON literals** (`clLesson<Name>_()` / `clTrack<Name>_()`, guidance content-in-GAS pattern) — never on Pages — so the checker can parse them and tracks can name gated titles
- **The gate is never stored in data**; it is derived from the stamp at serve time. A malformed stamp denies to every tier rather than gating down
- **Guidance inputs are stored by module id, never a URL** — Profiler's hash router has no `#guidance` route (found this session), so data must not depend on another app's routes; the renderer derives links. C0's masthead deep link to `Profiler.html#guidance` was left as is
- **`corpus:` refs carry the `briefing` kind** (contributor+), matching Coverage's tier in Profiler — the gate follows the content across apps
- **A briefing's "public-only edition"** for analysts is simply a briefing whose inputs are all public — no special field
- **The Classroom tree entry keeps its `[template]` label** — C0 deliberately left that convention unsettled, so it was not changed unilaterally here either

**Active context:**

- Repo **v04.12r** · Classroom **v01.00w** / **v01.01g** · Profiler **v01.77w** / **v01.32g** · Scraper **v01.71w** / **v01.98g**
- Capacity: repo CHANGELOG **92/100**; Classroom GAS changelog **1/50**
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- Model plan for the remaining phases (agreed last session): next C1 slice (tracks, renderer, progress, study-next) on **Opus 5 Extra**; C2 machinery on Opus 5 Extra; C2 authoring prompt + freshness deltas on Fable 5.1 High
- Verification set for any Classroom change: `python3 scripts/check-classroom-content.py`, `node --check` on a `.js` copy of `Classroom.gs`, `node scripts/check-gas-inner-scripts.js`
- Quiz item shape in the shared renderer is `{ q, c: [choices], a: <index>, why }` (documented in the schema example)

**Recommendation for next session:**

- Assemble the first tracks from the existing corpus on Opus 5 Extra: author public-stamped modules from the study guides and concepts registry plus one guidance-stamped module that deep-links pre-C3, register them in `clLessons_()` / `clTracks_()`, pass `check-classroom-content.py`, then port the guidance renderer into `Classroom.html` so the index and lesson views render through the new `action=classroom` ops.

**To continue:** type `build C1 — first tracks and the renderer`

Developed by: LightAISolutions
