# Classroom App — Unattended-Committer Contract (C2a)

**What this is.** The contract the Classroom curriculum pipeline is held to. C2 (`PHASE6-CLASSROOM-DESIGN.md`, "Content & pipeline model") is a recurring Routine that fires **fresh, unattended Claude sessions** which read what changed in the corpus, author or refresh lessons, and commit and push like any other session — with no developer watching. C1 shipped the invariants (the provenance stamp, the serve-time gate derivation, progress that is never a weaker gate than reading). This document states them as obligations an unattended committer can be checked against **before** any pipeline code exists, so that no code can quietly weaken them. It is design only: C2b builds the machinery to this contract, C2c writes the authoring prompt against it, and the weekly runs are measured against it.

**Provenance.** C2a output, 2026-09-02 (Fable 5.1 Extra), from the curated context of the C1 sessions (v04.12r → v04.20r). Every file, function, and region named below was read at repo **v04.20r**; line numbers are as of that version and are given for orientation only — the named markers and symbols are the contract, not the numbers.

**Where it sits.** `CLASSROOM-SCHEMA.md` says what a lesson *is*; `.claude/rules/classroom-app.md` says how a session *authors* one; this document says what a session that nobody is watching *may do to the repository*. Where the three overlap, the stricter rule wins, and a conflict is a defect in this document to be fixed at a design gate, never resolved by the committer in its own favour.

## 1. Vocabulary

| Term | Meaning |
|------|---------|
| **The committer** | One pipeline session: a fresh Claude session fired by the C2 Routine, with no human present and no ability to ask one. Also called "a run". Every rule below binds it; none binds a developer session, which keeps the ordinary repo discipline |
| **The corpus** | The source layers a lesson may be authored from — exactly the nine prefixes of `CL_PROVENANCE_REF_KINDS` in `Classroom.gs` (dossiers, study guides, named projects, the graph, the concepts registry, guidance modules, Scraper corpus items, earlier briefings, reports). Nothing else is a source; in particular the committer's own training knowledge is not |
| **The write set** | The closed list of files and regions the committer may change (§3). Anything not on it is forbidden (§4) — there is no third category |
| **The content region** | The sub-region of `Classroom.gs`'s PROJECT region that holds only lesson/track literals and their registries (§3.1). C2b marks it explicitly |
| **A pin** | `provenance.inputs[].date` — a source's revision date as observed when the lesson was authored or last refreshed (`CLASSROOM-SCHEMA.md`, Freshness) |
| **The watermark** | The date the curriculum has covered the corpus through: the newest registered briefing's `edition`, recorded in the ledger as `coveredThrough` (§6.3) |
| **The ledger** | The small in-repo run record the pipeline keeps (§6.3). It advances only in a committing run |
| **Outcome** | Every run ends in exactly one of `COMMIT`, `STAND-DOWN`, or `BLOCKED` (§5). There is no fourth outcome and no partial one |

## 2. Standing — what kind of actor the committer is

- **A full session, not a privileged one.** The committer runs the Session Start, Pre-Commit and Pre-Push checklists exactly as a developer session does, pushes to a `claude/*` branch, and lets `auto-merge-claude.yml` merge, deploy the GAS project (the `Deploy Classroom` step fires only when `Classroom.gs` changed) and publish Pages. It holds no shortcut through any of that
- **The ecosystem's first real budget surface** (design gate, 2026-08-31): its triggers are admin-only and scheduled. It never runs from an in-app button; it never fires itself outside its Routine; a developer may fire it by hand (`fire_trigger`) and that run is still bound by this contract
- **It has nobody to ask.** Every rule in the repo that says "ask the user", "surface the decision", "confirm before" resolves, for the committer, to **do nothing and report** (§5.4). "Best guess" is not an option that exists for it — a guess in a developer session is corrected in the next message; a guess in a pipeline run is live to every tier until someone notices
- **Its judge is the checker, and it never edits its judge.** `scripts/check-classroom-content.py` and the diff-aware sibling C2b adds (§7) are read-only to the committer. A run whose write fails the checkers discards the write; it never adjusts the checker, the fixtures, or the thresholds to pass
- **One attempt per run.** A run makes its write once, verifies, and either commits or discards. It does not iterate toward "whatever the checker accepts" — iterating a write until it passes is how an invariant gets weakened one harmless-looking change at a time

## 3. The write set — what the committer MAY write

This list is **closed and exhaustive**. A path not listed here is forbidden even if it looks harmless, even if a checklist item seems to require it, even if the change is "just a comment".

### 3.1 `googleAppsScripts/Classroom/Classroom.gs` — the content region only

The gate derivation and the content share the PROJECT region today (`// PROJECT START`, line 329 → `// PROJECT END`, line 2264 at v04.20r): role caps and provenance folding (lines 331–498), the literals and registries (~489–1984), then progress, study-next and the ops (2042–2263). "The PROJECT region" is therefore **too coarse** to be an allowlist. The committer may write only the **content region**:

- **What it is:** from the `// ── The first tracks, assembled from the existing corpus (C1)` banner through the closing brace of `clTracks_()` — the `clLesson<Name>_()` / `clTrack<Name>_()` literals and the two registries `clLessons_()` / `clTracks_()`
- **C2b must fence it explicitly** with `// CONTENT START` / `// CONTENT END` markers so the boundary is mechanical rather than a line range, and the diff-aware checker (§7) must assert that a pipeline commit's diff to `Classroom.gs` lies entirely inside the fence — plus the one line named next
- **Permitted edits inside the fence, and nothing else:**
  1. **Append** a new `clLesson<Name>_()` returning a strict-JSON lesson literal (schema v1, `CLASSROOM-SCHEMA.md`), or a new `clTrack<Name>_()`
  2. **Revise** an existing lesson literal under the revision rules of §6 — a new `revisions[]` entry, re-pinned inputs, section content with the same section ids, `updated` / `reviewBy`
  3. **Append** an id to `clLessons_()` / `clTracks_()` (registration) or a module id to the end of an existing track's `lessons[]`
  4. Bump `updated` on a track whose `lessons[]` grew
- **The single line outside the fence it may touch:** `var VERSION = "vXX.XXg";` (line 1) — the [PC-GS-VERSION] #1 bump the checklist requires. Nothing else in the config header, nothing in `PROJECT_OVERRIDES`
- **Literals stay strict JSON** (double-quoted keys, no trailing commas, no expressions) — the checker parses them out of the file; a non-JSON literal is a checker failure, which is a `BLOCKED` run (§5)

### 3.2 The versioning and changelog files the checklist requires

| Path | What the committer may do to it | Rule |
|------|--------------------------------|------|
| `live-site-pages/gs-versions/Classroomgs.version.txt` | Rewrite to the new GAS version in pipes (`\|vXX.XXg\|`), matching `VERSION` | [PC-GS-VERSION] #1 |
| `live-site-pages/gs-changelogs/Classroomgs.changelog.md` (+ `Classroomgs.changelog-archive.md` on rotation) | Append one versioned section with **generic** entries only — "curriculum updated", "new lesson added to a track", "weekly briefing published". Never a lesson title that is gated, never a source, never a company name that reached the lesson through a gated input | [PC-PAGE-CHANGELOG] #16 · `.claude/rules/changelog-security.md` |
| `repository-information/CHANGELOG.md` (+ `CHANGELOG-archive.md` on rotation) | Add the run's version section (§8) — the full record, since this file is not deployed. Archive rotation with SHA enrichment when the counter exceeds 100 | [PC-CHANGELOG] #6 |
| `repository-information/repository.version.txt` | The push-commit bump | [PC-REPO-VERSION] #15 |
| `README.md` | **Two lines only:** the `Last updated:` line, and the Classroom entry's GAS-version display in the tree. Never the tree structure, never any other entry | [PC-README-TIMESTAMP] #10 · [PC-README-TREE] #7 |
| `repository-information/classroom-pipeline-ledger.json` | The run record (§6.3). Created by C2b; rewritten only by a committing run | this contract |

### 3.3 What is deliberately NOT in the write set even though a session normally writes it

- **`repository-information/SESSION-CONTEXT.md`** — the developer's own handoff between developer sessions. The Session Start Checklist's staleness auto-reconstruction would fire on every pipeline run (a prior run bumped the repo version), push the developer's real entry into `## Previous Sessions`, and — under the 2-session cap — delete their history within two weeks of weekly runs. The committer **skips** the reconstruction step and never writes this file. Consequence, accepted: the developer's next session sees "stale" and reconstructs from CHANGELOG, where the run's section (§8) is written to make that reconstruction informative
- **`repository-information/REMINDERS.md` and `TODO.md`** — developer-owned content (behavioral-rules "User-Owned Content"). The scheduled-refresh precedent lets a one-shot Routine add a re-arm reminder when trigger tooling is missing; the C2 Routine is recurring and never needs to re-arm, so the exception does not transfer. A blocked run reports out of band (§5.4), never by writing into the developer's notes
- **`live-site-pages/Classroom.html`** — the renderer. If a lesson would need a section kind, field, or behaviour the renderer lacks, the material is left out and the run reports it; the page version does not move in a pipeline run
- **`live-site-pages/profiler-data/**`, `reports/**`, `archive/**`** — the corpus is read-only to the committer. It teaches from the corpus; it never revises, re-registers, or archives a dossier, study guide, project, concept, graph, or report. Those have their own commands and their own Routines
- **`googleAppsScripts/Classroom/Classroom.config.json`** and every other `googleAppsScripts/**` file — no other project, and not Classroom's own config

## 4. The forbidden surfaces — what the committer must NEVER touch

Everything outside §3 is forbidden by construction. The surfaces below are named anyway, each with the reason, because they are the ones an authoring session is most likely to be *tempted* to touch while "just making the lesson work".

### 4.1 The AUTH region and the template

- `Classroom.gs` `// AUTH CONFIG` → `// AUTH CONFIG END` (lines 23–325), `// TEMPLATE START` → `// TEMPLATE END` (2705–2949), `// AUTH START` → `// AUTH END` (2953–9526), and the config header (lines 1–21) other than `VERSION`. The AUTH region is **shared across five projects** and carries traps that were deliberately left in place under Chesterton's Fence (the 600 s ACL cache TTL, the FALSE-seeding in `registerSelfProject()`, the session-duration pair under [PC-SESSION-SYNC] #20). A pipeline run that "fixes" any of it changes the sign-in behaviour of every app in the ecosystem with nobody watching
- The cross-project session management block that follows `// PROJECT END` (`isMetadataRow`, `ensureMetadataRows`, `registerSelfProject`, `clearAccessCacheForUser`, `clearAllAccessCache`) — Global ACL machinery, not Classroom content

### 4.2 The gate derivation

Inside the PROJECT region but **outside the content fence**, and frozen for the committer:

- The access matrix: `CL_ROLE_CAPS`, `clRoleOf_`, `clAdmitted_`, `clCan_`, `clRequire_`
- The provenance fold: `CL_PROVENANCE_CAPS`, `CL_PROVENANCE_STRICTNESS`, `clGateForProvenance_`, `clRequireLesson_`
- The stamp reader: `CL_PROVENANCE_REF_KINDS`, `CL_ID_RE`, `CL_REF_RE`, `clStampKinds_`, `clLessonGate_`, `clLessonVisible_`
- The per-tier views: `clLessonCard_`, `clLessonIndexFor_`, `clTrackFor_`, `clTrackIndexFor_`, `clLesson_`, `clTrack_`
- Progress and study-next: `CL_PROGRESS_PROP_PREFIX`, `clProgressAcct_`, **`clProgressValid_`** (the function that makes progress never a weaker gate than reading), `clProgressRaw_`, `clProgressVisible_`, `clProgressRead_`, `clProgressWrite_`, `clStudyNext_`
- The transport: `handleClassroomOp_`, and its wiring in `doPost` / the GET `api` mirror
- The schema versions `CL_LESSON_SCHEMA_VERSION` / `CL_TRACK_SCHEMA_VERSION` — a shape change is a design-gate decision with a load-time adapter (`CLASSROOM-SCHEMA.md`, "Extending the schema", rule 2). The committer authors to the **current** schema version only; a lesson it wants to write that does not fit v1 is left unwritten and reported

The gate is derived at serve time from the stamp precisely so it cannot drift from the data. A committer that could edit the derivation could make any stamp mean anything; keeping the derivation frozen is what lets the stamp be *checked* rather than *trusted*.

### 4.3 The provenance stamp vocabulary

The committer writes stamps; it never extends what a stamp can say:

- **No new prefix, no new kind, no new rung** in `CL_PROVENANCE_REF_KINDS` / `CL_PROVENANCE_STRICTNESS` / `CL_PROVENANCE_CAPS`. The fold order *is* the access ladder; a new kind is a new rung, agreed at a design gate (`CLASSROOM-SCHEMA.md`, "Extending the schema", rule 4)
- **No `note:` ref, ever.** Field notes are private Drive data under the notes-are-not-sources rule. There is no prefix for them by design, and the committer must not simulate one by citing a note under any other prefix. Notes may steer emphasis **only** when the developer places them in the Routine's prompt — never quoted, never cited, never a `ref`
- **No `kind` that the prefix does not carry.** A mismatch is a malformed stamp; the code denies the lesson to every tier, the checker reports it, and the run is `BLOCKED`
- **No input the run did not read.** An input is a document the run fetched and drew on in this run (or, on a revision, one it re-fetched and confirmed still underlies the lesson). "Citation of convenience" — adding `concepts:profiler-concepts` because every lesson seems to have it — is fabricating an input
- **No `ref` whose id did not resolve at run time.** `CL_REF_RE` checks the *form* of a ref; only the committer can check that `profile:foo` names a dossier that exists. An unresolved ref is never written (§6, G7)
- **No URL in a `ref`.** The id is the layer's own permanent identity (slug, module id, report id, corpus item key); the renderer derives links

### 4.4 Permanent identities and the shape of existing content

- **Lesson ids, track ids and section ids are never renamed or removed** by the committer. Progress keys on lesson id + section id, and `clProgressVisible_` silently drops any tick whose section id no longer exists — a removed section id erases that tick's visibility for every account at once. A section may be **revised in place** (same id, listed in `revisions[].changed[]`) or a new section **appended**; removal and renaming are developer decisions
- **Track membership is append-only** for the committer: a module id may be added to the **end** of a track's `lessons[]`; nothing is removed or reordered. `clStudyNext_` walks registry order then track order, so a reorder moves every account's study-next pointer without a tick changing. Registry order in `clLessons_()` / `clTracks_()` is likewise append-only
- **The gate of an existing lesson never changes in a pipeline run — in either direction** (§6, G6). Raising it hides a lesson analysts were reading and freezes their visible progress; lowering it is the "content flows down the access ladder" failure the whole design exists to prevent. New material at a different gate becomes a **new lesson**

### 4.5 Everything that judges, configures, or governs the run

`scripts/**` (both checkers included), `.github/workflows/**`, `.claude/**`, `CLAUDE.md`, `repository-information/CLASSROOM-SCHEMA.md`, `PHASE6-CLASSROOM-DESIGN.md`, this document, and the Routine's own definition (a run never edits, re-schedules, or re-prompts its Routine — `update_trigger` is not a tool the committer uses). A run that finds any of these wrong **reports** it (§5.4); the developer changes them.

## 5. Fail-closed — the three outcomes and what forces each

A run ends in exactly one outcome. The default is `STAND-DOWN`; `COMMIT` must be earned by passing every gate below; `BLOCKED` is any state where the run wanted to write and could not do so safely.

| Outcome | Repo state afterwards | Visibility |
|---------|----------------------|------------|
| `COMMIT` | One push commit on a fresh `claude/classroom-pipeline-<YYYY-MM-DD>` branch, merged by the workflow | The CHANGELOG section (§8), the Routine's completion notification, the GAS changelog's generic entry |
| `STAND-DOWN` | **Untouched.** No commit, no branch, no ledger change | The run's final message (§5.4). No repo trace — deliberately, following the Profiler drift-check precedent (`profiler-app.md`, step 8): a quiet week must not cost a workflow run, a version bump and a CHANGELOG section |
| `BLOCKED` | **Untouched.** Any local write is discarded (`git checkout -- .`, untracked files removed, branch deleted) | The run's final message **and** the Routine completion notification **and** the session title prefixed `BLOCKED —` (§5.4). A blocked run must be noticeable without opening a transcript |

### 5.1 Pre-flight (before any corpus read) — any failure is `BLOCKED`

1. **Identity:** `git remote -v` is `LightAISolutions/Sales`; the branch is a fresh `claude/classroom-pipeline-<date>` created from a just-fetched `origin/main`; the working tree is clean. A pre-existing branch of that name on the remote means a prior run is in flight or stuck → `BLOCKED`, never a second push into it
2. **Baseline is green:** `python3 scripts/check-classroom-content.py` passes on `main` **before** any write, and its warning count is recorded as the baseline. A red baseline is somebody else's problem; the committer never "fixes the baseline" on its way to a lesson
3. **The ground has not moved:** the digest of the gate surface (§4.2 symbols, computed by the diff-aware checker) equals the digest the ledger recorded at the last committing run **or** the ledger's `gateDigest` was refreshed by a developer session since. A gate change the committer did not see acknowledged means its assumptions about what a stamp *means* may be stale → `BLOCKED`, report the drift
4. **Schema versions** in the file equal the versions this contract's authoring rules were written for (v1 / v1). A bump without a contract update → `BLOCKED`
5. **The corpus token** for the Scraper route, if the prompt carries one, is used only in the request and never written to any file, log line, or the CHANGELOG. If no token is supplied, corpus reads are **skipped** (the run may still refresh from Pages-served layers and repo-resident ones); the briefing is not authored from memory in its place

### 5.2 Read phase — degrade to "unknown", never to "assume"

- A source that cannot be fetched, parses to something the run does not recognise, or reports a revision date **older** than its pin (a rollback) is **unknown** for this run. Every lesson pinned to an unknown source is **frozen** — not refreshed — and the freeze is listed in the report
- The run never fills a gap in the corpus from its own knowledge. Every claim in a lesson traces to a fetched input; a fact the corpus does not carry is not taught this week

### 5.3 Write phase — the gates a `COMMIT` must pass, in order

1. **Delta guarantees** G1–G13 (§6) hold for every lesson and track touched
2. **Diff allowlist:** `git diff --name-only origin/main` ⊆ §3; the `Classroom.gs` diff lies inside the content fence plus the `VERSION` line
3. **`python3 scripts/check-classroom-content.py`:** zero errors and **no new warnings** against the pre-flight baseline (a new unresolved `{{term}}` is a defect the reader would see)
4. **The diff-aware checker** (§7): zero errors
5. **`node --check`** on a `.js` copy of `Classroom.gs`, and `node scripts/check-gas-inner-scripts.js`
6. **Blast-radius caps:** per run at most **one** new briefing, **one** new module, **three** revised lessons, **one** new track, and **no** lesson revised twice. A run that wants more than that stops at the caps and reports the remainder — a bad run should be a small run
7. **Pre-Commit and Pre-Push checklists** as any session — including the rebase-before-push rule and push-once enforcement. A remote branch collision after the retries → `BLOCKED`
8. **Budget:** the run has a wall-clock and turn budget set by C2b in the Routine prompt. Exceeding it at any point → `BLOCKED`, no partial commit, no "commit what is done so far"

Any gate failing at any step → discard everything, `BLOCKED`. The run does not retry with a smaller change (§2, one attempt).

### 5.4 Reporting — the last message of every run

The final message is a structured report the Routine's completion notification carries (C2b arms `notifications: { push, email }` on the Routine):

```
CLASSROOM PIPELINE — <YYYY-MM-DD> — <COMMIT | STAND-DOWN | BLOCKED>
Covered through: <old watermark> → <new watermark | unchanged>
Sources seen: <n fetched> · <n unchanged> · <n moved> · <n unknown>
Wrote: <lesson id (gate) — reason; …> | nothing
Skipped at caps: <…> | none
Frozen (unknown source): <lesson id ← ref; …> | none
Blocked by: <the single failing gate, verbatim> | —
Needs the developer: <one line per item, or "nothing">
```

A `BLOCKED` run additionally sets its own session title to `BLOCKED — Classroom pipeline <date>` so the session list shows it, and, when the block was a **safety** condition (a checker failure, gate drift, schema drift, an AUTH-region change in the diff), says so in the first line. Nothing about a blocked run is ever written into the repository.

## 6. The corpus delta — what must be guaranteed before a lesson may change

### 6.1 Revision signals per layer

The delta is computed against **dated identities**, one per prefix. This table is the committer's only notion of "what changed"; a layer with no usable signal is read but never drives a refresh.

| Prefix | Identity | Revision signal (v04.20r) | Read from | Note for C2b |
|--------|----------|---------------------------|-----------|--------------|
| `profile:<slug>` | dossier slug | `lastUpdated` (+ `profileVersion`) — also in `profiler-companies.json` per company | Pages `profiler-data/<slug>.profile.json`; the registry for the sweep | — |
| `study:<slug>` | study slug | `lastUpdated` | Pages `profiler-data/<slug>.study.json` | — |
| `project:<slug>` | project slug | **none per entry** — `profiler-projects.json` entries carry no date | repo | Use the file's last commit date as the layer's date, or add a per-entry `updated` (a `PROFILER-SCHEMA.md` decision, not the committer's) |
| `graph:profiler-graph` | fixed | `built` | Pages `profiler-graph.json` | — |
| `concepts:profiler-concepts` | fixed | **none** — `schemaVersion` only | repo | File commit date, as for projects |
| `guidance:<module-id>` | module `id` | module `updated` | **repo source** `Profiler.gs` `guidanceDocs_()` — never the Profiler API, which needs a signed-in session | — |
| `corpus:<item-key>` | Scraper item key | `publishedAt` | the token-gated `?action=corpus&cop=timeline&slug=&since=` route | **Identity gap:** the timeline route returns `url` (the dedupe key `ak`), not a key, and a URL cannot fit `CL_REF_RE`'s id charset; the candidates route exposes a row `key`. C2b must expose a stable, charset-safe item key on the timeline route (e.g. a short digest of the URL) before any `corpus:` ref is written |
| `briefing:<lesson-id>` | lesson id | `edition` | repo (`Classroom.gs`) | — |
| `report:<report-id>` | report id | `generated`; index `status` (`current` / `superseded`, `supersedes`) | Pages `reports/reports-index.json` + the report file | — |

### 6.2 The guarantees

Before an existing lesson may change, or a new one be written, **all** of the following hold. Each is checkable; the diff-aware checker (§7) asserts every one that can be asserted from the diff and the ledger.

- **G1 — Pinned baseline.** A lesson is a refresh candidate only when at least one of its inputs' live revision date is **strictly later** than that input's pin. Equal dates are "unchanged"; the lesson is not touched and its pins do not move
- **G2 — Read before re-pin.** A pin advances only to a date the run **observed on a document it fetched this run**. No pin is ever set from the registry alone, from the ledger, or from a date the run inferred
- **G3 — Contradiction, not novelty.** A lesson is revised only when the newer material **contradicts or supersedes** something the lesson currently teaches (design gate: deltas fire "when new material contradicts taught material"). The run must be able to name the section id(s) and the claim(s) that moved — that list *is* `revisions[].changed[]`. If it cannot name them, the lesson does not change; novelty that touches no taught claim is briefing material or a new module, never a silent edit
- **G4 — Meaning, not wording.** `changed[]` lists sections whose **meaning** changed. Rewording, tightening, restyling is not a revision and is not a write: the committer never opens a lesson to polish it
- **G5 — Monotone pins.** Pins never move backwards. A live date older than the pin marks the source unknown and freezes the lesson (§5.2)
- **G6 — Gate invariance.** `clGateForProvenance_(clStampKinds_(lesson))` is **identical before and after** a revision. An input the run would add that raises the gate is **not added** — its material is left out and reported; an input whose removal would lower the gate is **not removed** — the run is `BLOCKED` on that lesson. Material at a different gate becomes a new lesson with its own stamp
- **G7 — Resolution.** Every `ref` in a written stamp resolved to a fetched document in this run. The checker validates form; only the run can validate existence, so it must
- **G8 — Superseded reports.** A lesson pinned to a report whose index `status` is `superseded` is a refresh candidate against the superseding report: the ref is replaced by the successor's id (same prefix, same kind, gate unchanged — G6), re-pinned to its `generated`, and the swap is named in `revisions[].note`. Reports are immutable, so the old ref is never re-read as "current"
- **G9 — Watermark discipline.** New-material candidates for a briefing are items whose revision or published date lies in `(coveredThrough, runDate]`. `coveredThrough` advances only in a `COMMIT`, only to the new briefing's `edition`, and `edition` is never later than the run date. A `STAND-DOWN` leaves the window open, so the next run re-examines it — that is the intended idempotence, not a bug
- **G10 — Determinism.** The same corpus state and the same ledger yield the same decision. Before writing, the run checks `origin/main` for a lesson with the intended id (a briefing's `briefing-<edition>`, a module's slug): if it exists, the run does not author it again — a re-fire after a lost push must not double-author
- **G11 — Minimum material.** A briefing is authored only when at least **three** qualifying items across at least **two** distinct sources landed in the window (C2c may raise these numbers, never lower them). Fewer → `STAND-DOWN` with the count in the report. A briefing with nothing to say is worse than no briefing: it spends a version and teaches nothing
- **G12 — Progress safety.** Section ids are never removed or renamed (§4.4). A section whose meaning changed keeps its id and is listed in `changed[]`, so every account that completed it sees the "what changed since you learned this" delta rather than a silently vanished tick
- **G13 — `reviewBy` from the lesson's own gate.** A revision sets `reviewBy` from the lesson's nearest dated gate in the *new* material (guidance freshness discipline, step 10 of `.claude/rules/industry-guidance.md`), never from a fixed cadence, and never earlier than `updated`

### 6.3 The ledger — `repository-information/classroom-pipeline-ledger.json`

The pins in the lessons are the refresh baseline (single source of truth — the ledger never duplicates them). The ledger carries only what the lessons cannot:

```json
{
  "schemaVersion": 1,
  "coveredThrough": "2026-09-02",
  "gateDigest": "sha256:…",
  "lastRun": { "date": "2026-09-02", "repoVersion": "v04.21r", "outcome": "COMMIT",
               "wrote": ["briefing-2026-09-02"], "revised": [], "frozen": [] }
}
```

- `coveredThrough` — the watermark (G9). Equals the newest registered briefing's `edition`; the checker asserts the two agree
- `gateDigest` — a digest of the §4.2 gate surface as the last committing run saw it (§5.1, step 3). A developer session that changes the gate refreshes it in the same commit (C2b adds that to the Classroom rules); a mismatch at pre-flight is the "ground moved" block
- `lastRun` — the last **committing** run only. Stand-downs and blocks are not recorded here (§5) — the transcript and the notification are their record
- Not deployed (`repository-information/` never reaches Pages), so it may name gated identities. Created by C2b with `coveredThrough` set to the date of the newest lesson `updated` at that time

## 7. Verification — the checkers as the committer's judge

`scripts/check-classroom-content.py` validates a **state**: schemas, ids, stamps against the code's own prefix table, the stamp → gate truth table. The committer needs a second judge that validates a **change**. C2b adds it as a sibling, `scripts/check-classroom-pipeline.py`, run as `--base origin/main` against the working tree, and this contract is met only when **both** pass clean. What the sibling must assert, each backed by a fixture in which the forbidden mutation is present and the checker fails:

| # | Assertion | Contract rule |
|---|-----------|---------------|
| P1 | Changed paths ⊆ the write set of §3 | §3 |
| P2 | The `Classroom.gs` diff lies inside `// CONTENT START` … `// CONTENT END`, plus exactly the `VERSION` line | §3.1 |
| P3 | The gate-surface digest (§4.2 symbols, whitespace-normalised) is unchanged base → head, and equals the ledger's `gateDigest` | §4.2 · §5.1 |
| P4 | `CL_PROVENANCE_REF_KINDS`, `CL_PROVENANCE_STRICTNESS`, `CL_PROVENANCE_CAPS` are byte-identical base → head; no `note` anywhere in them | §4.3 |
| P5 | Every lesson id, track id and section id present at base is present at head; registries and every track's `lessons[]` are prefix-preserving (append-only) | §4.4 · G12 |
| P6 | For every lesson id present at both: `clGateForProvenance_(clStampKinds_(…))` is identical base → head (computed through the loaded PROJECT region, as the truth table already does) | G6 |
| P7 | For every lesson id present at both: each surviving input's `date` at head ≥ its date at base; `updated` at head > at base if anything else changed; `revisions[]` at head = base's list + exactly one appended entry whose `changed[]` ⊆ the lesson's section ids; `reviewBy` ≥ `updated` | G1 · G4 · G5 · G13 |
| P8 | A lesson touched at head differs from base in something other than whitespace and wording inside unchanged section ids — i.e. every id in `changed[]` actually differs, and every section that differs is in `changed[]` (a reword-only diff is an error, not a warning) | G3 · G4 |
| P9 | New `briefing` lessons: id `briefing-<edition>`, `edition` > ledger `coveredThrough` at base, `edition` ≤ today; ledger `coveredThrough` at head = that `edition` | G9 · G10 |
| P10 | Blast-radius caps: ≤ 1 new briefing, ≤ 1 new module, ≤ 3 revised lessons, ≤ 1 new track, no lesson revised twice | §5.3 step 6 |
| P11 | `Classroomgs.changelog.md`'s new section contains no lesson `title` of a lesson whose gate is not `tracks`, and no `ref` id | §3.2 · changelog-security |
| P12 | `VERSION` and `Classroomgs.version.txt` moved together by exactly one step | [PC-GS-VERSION] #1 |

What it **cannot** assert, and the committer must therefore hold itself to without a checker: G2 (a pin was observed on a fetched document), G7 (every ref resolved), and the read-phase honesty of §5.2. C2c's authoring prompt states these as the run's own obligations, and the §8 record names the fetched documents so a developer can spot-check.

The committer runs both checkers **before** [PC-GS-VERSION] / CHANGELOG work, and once more immediately before `git commit` — the second run is the one that counts. Neither checker is ever edited by the committer (§4.5).

## 8. The run record — what a `COMMIT` writes into CHANGELOG.md

The repo CHANGELOG is not deployed, so the pipeline's section is the full, gated-content-safe-to-name record that the GAS changelog cannot be. Per [PC-CHANGELOG] #6 the section is the push commit's, with the prompt blockquote carrying the Routine's prompt text (**not** the corpus token, which is redacted as `<corpus token supplied>` / `<no corpus token>`). Then, under the standard categories:

- `### Added` — each new lesson as `**<id>** (<gate>) — <one line>; inputs: <ref@date, …>`; each track appended to
- `### Changed` — each revised lesson as `**<id>** (<gate>, unchanged) — <what moved, one line>; changed sections: <ids>; inputs re-pinned: <ref old→new, …>`
- `### Notes` — the report of §5.4 verbatim (watermark, sources seen, frozen lessons, items skipped at caps), the checker result lines, and `Classroom.gs VERSION vXX.XXg → vXX.XXg`

The commit message is `vXX.XXr Classroom pipeline — <YYYY-MM-DD>` ([PC-COMMIT-MSG] #8; when `MULTI_SESSION_MODE` = `On`, drop the prefix as any session would).

## 9. Interactions with the rest of the repo discipline

- **The checklists apply unchanged** — Session Start (with the one exemption in §3.3: no SESSION-CONTEXT reconstruction), Pre-Commit (all twenty items; the committer's write set is a strict subset of what those items already govern), Pre-Push (all five). Nothing in this contract relaxes a checklist item; several tighten one (README: two lines only; GAS changelog: generic only)
- **Chat bookends are irrelevant to an unattended run** — there is no reader mid-response — but the final message of §5.4 is mandatory regardless of the four toggles, because it is the run's only report
- **Archive rotation** can fall to a pipeline run (it does when the CHANGELOG counter is at 100). It is in the write set and runs with SHA enrichment as for any session. If the rotation cannot be completed cleanly (a header without a resolvable SHA after unshallowing is *not* a block — the rules allow `[SHA unavailable]`; a malformed file is), the run is `BLOCKED` rather than committing a half-rotated changelog
- **Concurrency with other Routines** — the cadence C2b sets must clear the Scraper run (Monday 06:00 ET), the Profiler monthly drift check (`0 17 1 * *`), and the guidance quarterly review (`0 13 15 1,4,7,10 *`), and any armed post-earnings dossier refresh (`profiler-app.md`, "Scheduled Refreshes"). Recommendation: **Wednesday 11:00 UTC** (07:00 ET), weekly — two days after the Scraper edition has landed and been read by the Coverage bridge, and on a day no other Routine uses. A developer session running at the same time is handled by the rebase-before-push rule and push-once enforcement, not by the committer trying to detect it
- **Model plan** (SESSION-CONTEXT, 2026-09-02): the weekly runs are budgeted for Opus 5 High and measured. The caps in §5.3 are sized for that — a run that regularly hits them is a signal to raise the model or the cadence at a design gate, not for the run to work harder

## 10. Handed to C2b and C2c

Findings from writing this contract that the build sessions must settle before the first scheduled run:

1. **Corpus item identity** (§6.1): expose a charset-safe, stable item key on the Scraper timeline route, or `corpus:` refs cannot be written at all. Until then the committer treats the corpus layer as read-only context for briefing *emphasis* and cites the public layers it corroborates
2. **Undated layers** (§6.1): `profiler-projects.json` and `profiler-concepts.json` carry no per-entry revision date. Decide between file-commit-date and a per-entry `updated` in `PROFILER-SCHEMA.md`
3. **The content fence** (§3.1): add `// CONTENT START` / `// CONTENT END` to `Classroom.gs` around the literals and registries, and teach `check-classroom-content.py` to flag any `clLesson*`/`clTrack*` literal outside it
4. **`check-classroom-pipeline.py`** (§7): the twelve assertions, each with a failing fixture
5. **The ledger** (§6.3): create it with `coveredThrough` = newest lesson `updated`, `gateDigest` computed by the new checker; add "refresh `gateDigest` in the same commit" to `.claude/rules/classroom-app.md` for developer sessions that touch the gate surface
6. **The Routine**: fresh session per fire, `notifications: { push: true, email: true }`, the cadence above, a prompt that carries this contract by path, the budget, and (optionally) the corpus token — never the token in a committed file
7. **Optional, admin-only in-app surface** under the `pipeline` capability: "curriculum current through <coveredThrough>" and the last run's date, read from the ledger the page cannot reach today — so C2b decides whether the ledger is mirrored into a Script Property by the committing run (a second write target, which would extend §3) or the surface waits for C3

### Settled in C2b (2026-09-02)

The machinery was built to this contract, not the other way round; where a §10 item asked for a decision, the decision is recorded at the place the decision lives, and named here so C2c can find it.

| § | Item | Settled as | Where it lives now |
|---|------|-----------|--------------------|
| 10.1 | Corpus item identity | The timeline route emits `key` on every item — `scArticleKey_`'s base36 digest of the normalised URL, which is also the route's dedupe identity. It matches `CL_REF_RE`'s id charset, so `corpus:<item-key>` refs can be written | `Scraper.gs` `scHandleCorpus_` / `scTimelineScan_` (v01.99g) |
| 10.2 | Undated layers | **File commit date**, not a per-entry `updated`: `git log -1 --format=%cs -- <path>` read on the base revision. A per-entry date cannot serve `concepts:profiler-concepts` at all (it is a whole-file identity), and a field a human must remember to set fails in the unsafe direction. Undeterminable date → the layer is **unknown** for that run | `PROFILER-SCHEMA.md`, "Registry revision signals — the undated layers" |
| 10.3 | The content fence | `// CONTENT START` … `// CONTENT END` added around the literals and both registries. `check-classroom-content.py` now errors on any `clLesson*`/`clTrack*` literal or registry defined outside it — on every state, not only on a diff | `Classroom.gs` (v01.07g) · `scripts/check-classroom-content.py` `check_fence()` |
| 10.4 | The diff-aware checker | `scripts/check-classroom-pipeline.py`, P1–P12, `--base origin/main` against the working tree. `--selftest` runs thirteen fixtures: one **positive** (a well-formed pipeline commit, which must be clean) and one negative per assertion, each the positive with a single forbidden mutation applied. The suite refuses to run if any of P1–P12 lacks a fixture | `scripts/check-classroom-pipeline.py` |
| 10.5 | The ledger | Created with `coveredThrough` = `2026-09-01` (the newest lesson `updated` at creation), `gateDigest` computed by the new checker, and `lastRun: null` — no committing run has happened yet. The developer-side obligation to refresh `gateDigest` is now in the Classroom rules with the command to compute it | `repository-information/classroom-pipeline-ledger.json` · `.claude/rules/classroom-app.md` |
| 10.6 | The Routine | Armed weekly, **Wednesday 11:00 UTC** (07:00 ET) as recommended in §9, fresh session per fire, `notifications: { push: true, email: true }`. The prompt carries this contract by path, the budget, and no corpus token — the token is supplied by the developer when they want corpus reads, and a run without one skips the corpus layer per §5.1 step 5 | the C2 Routine |
| 10.7 | The in-app `pipeline` surface | **Deferred to C3, and the ledger is not mirrored into a Script Property.** Mirroring would add a second write target to §3 — and a write the checkers cannot judge, since a Script Property leaves no diff — to buy one admin-only line of text. The `pipeline` capability already exists in `CL_ROLE_CAPS`; C3 can serve `coveredThrough` when the page has a way to read repo-resident state | — |

### Settled in C2c (2026-09-02)

The authoring prompt is the section **"Authoring a pipeline lesson"** in `.claude/rules/classroom-app.md`, which the Routine prompt directs every run to read third. It is written *to* the §7 assertions: the G3 test is stated as a sentence the run must be able to write per section id (*"section `<id>` teaches X; `<ref>` now says Y"*) and a source that moved without such a sentence leaves the lesson untouched, pin included — the G8 report swap is the only pin movement without a section change; `changed[]` is defined as exactly P8's differs set (existing ids only, new sections never listed); a briefing's `edition` is the run date, so `briefing-<edition>` is deterministic under G10; a G11 *item* is one dated, stated development and a *source* is one distinct `ref`, counted after the gate is chosen; the fields outside `sections[]` that no assertion watches (`title`, `short`, `group`, `tiles[]`, `glossary[]`) are frozen for the run and a contradiction in them is reported; and G2, G7 and §5.2 are stated as the run's own obligations, auditable through the §8 `ref@date` record. The numbers in G11 and §5.3 are unchanged. The Routine's C2c pre-flight gate was deleted the same day.

Two things C2b deliberately did **not** do. It did not soften any assertion to make the current repo pass: P1–P12 are written against the contract, and this developer commit fails P1 by design (it writes seven paths outside the committer's write set) — that is the checker working, not a defect. And it did not give the committer a way to record a `STAND-DOWN` or a `BLOCKED` run anywhere in the repo; §5's silence is preserved exactly.

Developed by: LightAISolutions
