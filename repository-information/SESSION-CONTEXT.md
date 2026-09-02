# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
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

## Previous Sessions

### Session — 2026-09-01 (Classroom C0 — scaffold, access matrix, cross-links; model plan — v04.11r)
**Date:** 2026-09-01 10:08:49 PM EST
**Repo version:** v04.11r
**Branch:** `claude/classroom-v1-model-selection-ja05mu`

**What we worked on:**

- **Model selection across the Classroom v1 build plan (research, no commit).** Read `PHASE6-CLASSROOM-DESIGN.md` against the `claude-api` skill's model reference. Fable 5.1 is $10/$50 per MTok against Opus 5 at $5/$25 — exactly 2× — and "Extra" reads as the `xhigh` effort tier. Because lower effort on the newest models often matches or exceeds prior-generation performance at high effort, **Fable 5.1 High** is the efficient way to buy Fable's capability; Fable 5.1 Extra was not recommended anywhere in v1
- **C0 built and pushed (v04.11r).** Classroom scaffolded from the auth template via `setup-gas-project.sh` (10 files), the v1 access matrix built on both sides, masthead cross-links wired between the two apps, and `verify-profiler-roles.py` extended with the new surface

**The agreed model plan for the remaining phases:**

| Phase | Model |
|---|---|
| C0 — scaffold + cross-links | Opus 5 Extra ✅ done |
| **C1 — schema + provenance gating** | **Fable 5.1 High** ← next session |
| C1 — tracks, progress, study-next plumbing | Opus 5 Extra |
| C2 — pipeline machinery | Opus 5 Extra |
| C2 — authoring prompt + freshness deltas | Fable 5.1 High (one session) |
| C3 / C4 | the only candidates for Fable 5.1 Extra |

**Where we left off:**

- C0 is complete and pushed. Classroom is at **v01.00w / v01.00g**, Profiler at **v01.77w** (GAS unchanged at v01.32g)
- **`DEPLOYMENT_ID` is still a placeholder** — the expected bootstrap gap. The developer must create the GAS project, deploy it once, then put the real ID in `googleAppsScripts/Classroom/Classroom.config.json`. The workflow's deploy step reads it at merge time and no-ops silently until then, so Classroom's GAS half is not live yet
- Nothing in C1 has been started — no track schema, no lesson storage, no progress store

**Key decisions made:**

- **The provenance-gating rule was encoded in C0, before any content exists to gate.** `CL_PROVENANCE_CAPS` + `clGateForProvenance_()` fold a lesson's inputs down to the capability its strictest input demands, and fail closed (`''` = deny) on an empty list, an unknown provenance, or a field-note provenance. C1 should stamp lessons and call `clRequireLesson_()` rather than inventing a parallel path
- **The Profiler cross-link is gated on the existing `study` capability, not a new one** — the three tiers holding `study` are exactly the three Classroom admits, so the two matrices cannot drift apart at that seam
- **Viewer exclusion is an app-door gate**, not a per-op one: `clAdmitted_` turns viewer away before any capability is consulted, and an unrecognised role collapses to viewer
- **The masthead is wired by wrapping `showApp()` from the project region**, never by editing the AUTH region, so template propagation ([PC-TEMPLATE-PROP] #19) stays conflict-free
- The scaffold's `[template]` labels on Classroom's README/architecture entries were **left alone** — Scraper carries them, Profiler does not, so the repo holds both conventions and it was not settled unilaterally mid-phase

**Active context:**

- Repo **v04.11r** · Classroom **v01.00w** / **v01.00g** · Profiler **v01.77w** / **v01.32g** · Scraper **v01.71w** / **v01.98g**
- Capacity: repo CHANGELOG **91/100**; Profiler page changelog rotated this push — now **48/50**, archive holds 29 sections
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Classroom is light-themed, Profiler is dark.** The masthead was styled for the page's actual white body. Giving Classroom a visual identity that matches the Profiler family is a C1 decision, deliberately not made in C0
- Playwright works here via `pip install playwright` (package only) + `executable_path=/opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell`, serving `live-site-pages/` over `python3 -m http.server`
- **Test trap hit this session:** seeding only `localStorage` when `getStorage()` may return `sessionStorage` made a working masthead look broken. Seed both stores in page-level role tests

**Recommendation for next session:**

- Build **C1's track/lesson schema and its provenance stamp first**, on Fable 5.1 High, before any renderer or progress work — it is the one irreversible decision in v1 (Phase 5 showed study.json v1 stays renderable forever behind an adapter), it must slot into `clGateForProvenance_()`'s existing vocabulary, and every lesson C2 later auto-authors inherits it.

**To continue:** type `build C1 — start with the track and lesson schema`

Developed by: LightAISolutions
