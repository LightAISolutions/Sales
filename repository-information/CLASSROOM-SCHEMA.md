# Classroom App — Track & Lesson Schema

**Single source of truth** for the Classroom app's content data shapes: the **lesson** (schema v1), the **track** (schema v1), and the **provenance stamp** every lesson carries. Read this before authoring or revising any lesson or track — by hand in a build session or automatically in a C2 pipeline session. The Profiler counterpart is `PROFILER-SCHEMA.md`; the design these shapes implement is `PHASE6-CLASSROOM-DESIGN.md` (developer-approved 2026-08-31).

**Where content lives.** Lessons and tracks are authored as **strict-JSON object literals** returned by `clLesson<Name>_()` / `clTrack<Name>_()` functions in the PROJECT region of `googleAppsScripts/Classroom/Classroom.gs`, and registered in `clLessons_()` / `clTracks_()` — the guidance content-in-GAS pattern. They never deploy to public Pages: a track names gated lesson titles, and a lesson's sections may carry guidance-, briefing-, or report-derived material. The page reads them only through the role-gated `action=classroom` ops. Keep the literals JSON (double-quoted keys, no trailing commas, no expressions) — `scripts/check-classroom-content.py` parses them straight out of the `.gs`.

**What is deliberately not here.** Per-account progress (the `gd_progress` property-store pattern) and the study-next pointer are the next C1 slice; the drill queue is C4. Neither changes these shapes — progress keys on lesson id + section id, which is why both ids are permanent.

## Id rules

- Lesson ids, track ids, and section ids match `^[a-z0-9][a-z0-9-]{0,63}$` (`CL_ID_RE` in `Classroom.gs`) — kebab-case, lowercase, max 64 chars
- **Ids are permanent.** Progress, freshness deltas, and track membership all key on them. A revision that keeps a section's meaning keeps its id; a section whose meaning changes gets a new id (and the old one is listed in the revision's `changed[]`, see Freshness)
- Lesson ids are unique across all lessons; track ids across all tracks; section ids within their lesson. A lesson id and a track id may coincide but should not — keep them distinguishable at a glance
- Briefing lessons are dated editions: `briefing-YYYY-MM-DD` (optionally with a `-<n>` suffix if two editions land on one day)

## The provenance stamp — `provenance.inputs[]`

The rule that makes "Everything" safe (`PHASE6-CLASSROOM-DESIGN.md`): **a lesson inherits the strictest gate of its inputs.** Content flows *up* the corpus into lessons, never *down* the access ladder — a tier that cannot see guidance in Profiler never sees guidance-derived material here. The stamp is how a lesson declares its inputs; `clGateForProvenance_()` in `Classroom.gs` folds them to the one capability the strictest input demands, and `clRequireLesson_()` enforces it before any section text leaves the server.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `provenance.inputs[]` | object[] | yes (≥1) | One entry per corpus source the lesson was authored from. **Never fabricate an input** — it is a source you actually read while authoring, not a citation of convenience. A lesson with no corpus input has no place in Classroom |
| `provenance.inputs[].kind` | string | yes | `public` · `guidance` · `briefing` · `report` — `CL_PROVENANCE_STRICTNESS`'s vocabulary, least to most strict. **Must equal the kind the `ref` prefix carries** (table below); a mismatch is a malformed stamp and the lesson is denied to every tier, never gated down |
| `provenance.inputs[].ref` | string | yes | Typed identity `<prefix>:<id>` matching `^([a-z]+):([A-Za-z0-9][A-Za-z0-9._-]{0,127})$` (`CL_REF_RE`). The prefix names the corpus layer and fixes the kind; the id is that layer's own permanent identity (a slug, a module id, a report id, a Scraper item key). Store the identity, never a URL — the renderer derives links, so data never depends on another app's routes |
| `provenance.inputs[].date` | string | recommended | `YYYY-MM-DD` — the source's revision date **at authoring** (a profile's `lastUpdated`, a module's `updated`, a report's `generated`, a corpus item's published date). This pin is the freshness hook: a C2 refresh compares it against the live source to emit "what changed since you learned this". Omit only when the source carries no date; the checker warns |
| `provenance.inputs[].note` | string | no | One short line on what the lesson took from this source (authoring aid; never rendered) |

**Ref prefixes and the kind each carries** (`CL_PROVENANCE_REF_KINDS` in `Classroom.gs` — the code is authoritative; this table mirrors it):

| Prefix | Kind | Points at | Gate the kind demands |
|--------|------|-----------|-----------------------|
| `profile:<slug>` | `public` | A company dossier (`<slug>.profile.json`) | `tracks` — analyst+ |
| `study:<slug>` | `public` | A company study guide (`<slug>.study.json`) | `tracks` |
| `project:<slug>` | `public` | A named project (`profiler-projects.json`) | `tracks` |
| `graph:profiler-graph` | `public` | The relationship graph | `tracks` |
| `concepts:profiler-concepts` | `public` | The concepts registry | `tracks` |
| `guidance:<module-id>` | `guidance` | An Industry Guidance module (`id` in `Profiler.gs`; pre-C3 the lesson deep-links, post-C3 it may embed) | `guidance` — contributor+ |
| `corpus:<item-key>` | `briefing` | Scraper corpus material reached through the token-gated corpus route (contributor+ in Profiler as Coverage — the gate follows the content) | `briefing` — contributor+ |
| `briefing:<lesson-id>` | `briefing` | An earlier briefing edition this one builds on | `briefing` |
| `report:<report-id>` | `report` | A session-authored report (`reports/<id>.report.json`) | `reports` — admin-only |

**There is no `note:` prefix, by design.** Field notes are private Drive data under the notes-are-not-sources rule and can never become lesson content; a `note:` ref is an unknown prefix, so `clStampKinds_()` returns `[]` and the gate folds to `''` = deny. Notes may steer a pipeline session's emphasis only when the developer supplies them — never quoted, never cited.

**Fold semantics** (`clStampKinds_()` → `clGateForProvenance_()`): all-public → `tracks`; any `guidance` → `guidance`; any `corpus`/`briefing` → `briefing` (equally strict as guidance — both contributor+); any `report` → `reports`. Missing stamp, empty list, malformed ref, unknown prefix, or kind/prefix mismatch → `''` (deny). **The gate is never stored in data** — it is derived at serve time so it cannot drift from the stamp. The "public-only edition" of a briefing the design allows for analysts is simply a briefing lesson whose inputs are all public — no special field.

## Lesson schema — `clLesson<Name>_()` (schema v1)

A lesson is one teachable unit: a **module** (lives in tracks, taught once, refreshed when its inputs move) or a **briefing** (a dated "This week in BESS/AIDC" edition, a feed rather than a track member). Both use the same shape; `type` tells them apart. The section vocabulary is the guidance renderer's, so the Classroom renderer in `Classroom.html` is that engine ported onto this page's palette — the same one study guides and reports render on, per Phase 5. A change to a section kind in either app belongs in both.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Lesson schema version — currently `1` (`CL_LESSON_SCHEMA_VERSION`). Older lessons stay renderable forever behind an adapter, exactly as study.json v1 does — bump only for a shape change, and add the adapter in the same commit |
| `id` | string | yes | Per Id rules — the lesson's permanent identity. Progress, track membership and freshness deltas key on it |
| `type` | string | no | `module` (default) · `briefing` · `scenario`. Tracks may list modules only; briefings are surfaced as a dated feed and carry `edition`; scenarios are the C5 simulation layer and are surfaced through the Rehearsal library (see below) |
| `title` | string | yes | Display title |
| `short` | string | yes | One-line card summary (≤160 chars) |
| `group` | string | yes | Topic lane the index groups by — reuse the guidance lanes (`Technology Foundations`, `The AI Data-Center Wave`, `Market Access & Bankability`) or the segment layer's `The Value Chain` (the fourth lane, added at S0/S1 because no guidance lane fits a segment — `CLASSROOM-CURRICULUM-PLAN.md` §10.5); add a lane only when none fits |
| `updated` | string | yes | `YYYY-MM-DD` of this revision |
| `reviewBy` | string | yes | `YYYY-MM-DD` — set from the lesson's **own nearest dated gate** (a regulatory effective date, a milestone, a scheduled rate change), not a fixed cadence; slow-moving fundamentals default to ~6 months from `updated` (guidance freshness discipline) |
| `edition` | string | briefings only | `YYYY-MM-DD` the briefing covers through; required when `type` = `briefing`, forbidden otherwise |
| `provenance` | object | yes | The stamp — see above. `{ "inputs": [...] }` |
| `revisions[]` | object[] | no | `{ "date", "note", "changed": string[] }` — one entry per revision, oldest first; `changed[]` names the section ids whose meaning changed (see Freshness). A first authoring needs no entry |
| `tiles[]` | object[] | no | `{ "k", "v", "sub" }` — up to four headline tiles rendered above the sections, as guidance modules use |
| `glossary[]` | object[] | no | `{ "t", "d" }` — lesson-local term definitions. `{{term}}` tooltips resolve **lesson glossary first, then the public concepts registry** (`profiler-concepts.json`), the study-guide order. Define a term here only when the lesson needs a meaning the registry lacks |
| `sections[]` | object[] | yes (≥1) | Guidance section-kind vocabulary: `{ "id", "title", "kind", … }` with `kind` ∈ `prose`, `callout`, `table`, `proscons`, `timeline`, `bars`, `flashcards`, `quiz`, `ledger` and the same per-kind fields as guidance modules (`ps`, `cols`/`rows`, `cards`, `lanes`/`items`, `unit`, `intro`, `read`, `note`, `tone`, per-section `sales`). `id` per Id rules, unique within the lesson — progress keys on lesson id + section id. Ordered as taught. Prose uses the guidance micro-markup (`**bold**`, `*italic*`, `{{term}}`); **no `[c:<id>]` citation tokens** — a lesson's sourcing is its stamp, and the renderer shows the inputs as a provenance strip |

### Scenario lessons — `type: "scenario"` and the `scenario` block (C5, built 2026-09-18 at v06.52r; **C5 closed at v06.56r — fourteen scenarios over nine buyer segments, seven per seat**)

A **scenario** is one rehearsed conversation: one seat, one buyer segment, one named counterparty from that segment's roster, one stage of the sale, one mode. It is an ordinary schema-v1 lesson — **no `CL_LESSON_SCHEMA_VERSION` bump**, because every field below is additive (rule 2 under "Extending the schema"). The design is `C5-SALES-SIMULATIONS-DESIGN.md`; the ledger of which scenarios exist is `CLASSROOM-CURRICULUM-PLAN.md` §11.

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `scenario` | object | yes when `type` = `scenario`, **forbidden otherwise** | The block that makes it playable and checkable — five fields, all required |
| `scenario.mode` | string | yes | `objection` · `discovery` |
| `scenario.seat` | string | yes | `storage-seller` · `aidc-power-seller` — the two implicit role paths of `CLASSROOM-CURRICULUM-PLAN.md` §10.10, now a field |
| `scenario.segment` | string | yes | A registered segment id in `profiler-segments.json` — the **buyer's** segment, and the segment whose landscape module the stamp must carry |
| `scenario.counterparty` | string | yes | A dossier slug that is an `incumbent` or `challenger` member of `scenario.segment` (an adjacent member is in the segment by association, not as the desk that signs). `<slug>.profile.json` must exist and `profile:<slug>` must be in the stamp |
| `scenario.stage` | string | yes | `prospecting` · `discovery` · `rfp` · `shortlist` · `negotiation` · `post-award` |
| `id` | string | yes | `scenario-<segment-id>-<mode>`, with `-storage` / `-aidc` appended only when the same segment and mode exist for both seats, and `-<n>` only for a second scenario of the same kind |
| `group` | string | yes | **`The Value Chain`** — a scenario is keyed to a segment, and that segment's lesson and landscape already sit in that lane |
| `edition` | — | forbidden | Briefings only |
| `tiles[]` | object[] | yes, exactly four, this order | `{ k: <counterparty display name>, v: "across the table" }` · `{ k: <segment name>, v: "the segment" }` · `{ k: "Objection" \| "Discovery", v: "the exercise" }` · `{ k: <stage, capitalised>, v: "where in the sale" }`. The renderer reads the counterparty's display name off the first tile, so its `v` values are fixed |
| `sections[]` | object[] | yes, exactly ten, this order | `the-room` (callout) · `what-the-record-says` (table) · `the-position` (prose) · `beat-1` · `beat-2` · `beat-3` (each `quiz`) · `the-mechanism-behind-it` (callout) · `debrief` (table) · `claims-ledger` (ledger) · `what-the-record-does-not-say` (callout). Ids are permanent, as the segment layer's are — a scenario's ten ticks are its completion record |

**Each beat** carries `intro` (the counterparty's line), **exactly one** item with **exactly four** choices, an `a` that indexes them, a `why` that addresses **all four**, and a section-level **`note`** carrying the conversation forward. `note` is a **section** field, not an item field — the renderer prints only `sec.note`, so a `note` written inside `items[]` reaches no reader; the checker errors on both the omission and the misplacement.

**The stamp fixes the gate, and the gate is asserted rather than stored.** Every scenario's stamp carries `profile:<counterparty>` and at least one `guidance:landscape-<segment>-YYYY-MM` for its own segment, may carry any other `profile:` / `project:` / `graph:` / `concepts:` ref a ledger row actually cites, and may carry **no `report:`, `corpus:` or `briefing:` ref** — so `clGateForProvenance_(clStampKinds_(…))` computes to **`guidance`**, which `check-classroom-content.py` asserts. A fold of `tracks` means the landscape input was lost; `reports` means a report was gained. Both are authoring defects, not gate options. `reviewBy` is the nearest dated gate among the ledgered claims and is **never later than the landscape's own `reviewBy`** (a warning).

**A scenario is in no deck and no track.** `clDrillLessonItems_` skips `type: scenario`, so its three beats contribute no `lc:`/`lq:` item at any tier; `check_track` refuses it as it refuses a briefing; `clStudyNext_` walks tracks only, so it is never a study-next target. The **unattended pipeline never authors and never revises one** — `CLASSROOM-COMMITTER-CONTRACT.md` §3.1/§4.4, enforced by P13.

**Content contract** (inherits the study-guide and guidance rules; **amended 2026-09-07 at S0 of `INTEGRATED-REMEDIATION-PLAN.md` §7 — developer-approved, decision 1 of §7.2**): teach the technology and the market in its industry context from a high-school-STEM baseline; guidance-style content addresses supplier/buyer **groups**, and company-specific material comes from dossiers and is stamped as such. Public-safe is decided by the stamp, not by the prose: a lesson that quotes a report is `report`-stamped whether or not the quoted line looks harmless. **What a drill item may ask depends on the lesson's kind:**
- **Mechanism lessons** (every hand-authored module in `CLASSROOM-CURRICULUM-PLAN.md` §3) keep the original rule unchanged — flashcards and quizzes drill understanding, **never company trivia**. A card asks how the thing works or why the buyer asks; it never asks which company shipped how many gigawatt-hours.
- **Segment lessons** (`segment-<id>`, generated from `profiler-segments.json` by `scripts/build-classroom-segments.py` — `CLASSROOM-CURRICULUM-PLAN.md` §10.3) **may drill structure**: which segment a company sits in, its role there (incumbent / challenger / adjacent), what the segment's buyers buy on, and who is connected to whom in the graph. That is market structure, not trivia — a seller who cannot place a company in the chain loses the room before the mechanism conversation starts. They still never drill figures for their own sake: a number appears in a card only as the basis of a structural claim the dossier makes.
- **Scenario lessons** (`scenario-<segment>-<mode>`, the C5 simulation layer above) drill **nothing** — they are the assessment layer, not a retention one. Their three `quiz` beats are the decision mechanic and are excluded from the pool by `clDrillLessonItems_`, because every scenario is about one named counterparty and the mechanism deck's contract is "never company trivia". Completion is ten ticked sections, and there is no spaced repetition over them in v1.
- **The roster deck** (K2, `CLASSROOM-CURRICULUM-PLAN.md` §10.8) is the one place company cards live — one card per member of a segment, enumerated from the segment lessons' player tables — and it is **opt-in and separate**: its own queue, its own caps, never mixed into the mechanism deck, and never enabled for an account that has not turned it on. The mechanism deck is untouched by its existence.

## Track schema — `clTrack<Name>_()` (schema v1)

A track is an ordered reading list of module lessons with a stated outcome. It carries no provenance of its own — **its gate is its lessons'**: a tier sees the track with the lessons it may read, plus a count of the withheld ones, and a track with nothing readable is not listed at all (asking for it by id answers `UNKNOWN_TRACK`, so gated tracks are not enumerable).

| Field | Type | Required | Meaning |
|-------|------|----------|---------|
| `schemaVersion` | number | yes | Track schema version — currently `1` (`CL_TRACK_SCHEMA_VERSION`) |
| `id` | string | yes | Per Id rules — permanent; track progress rollups key on it |
| `title` | string | yes | Display title |
| `short` | string | yes | One-line summary: what you can do after finishing it |
| `group` | string | yes | Topic lane, same vocabulary as lessons |
| `updated` | string | yes | `YYYY-MM-DD` the lesson list last changed |
| `lessons[]` | string[] | yes (≥1) | Lesson ids in teaching order. Every id must resolve to a registered lesson of `type` `module`; no duplicates |
| `prereqs[]` | string[] | no | Track ids to finish first (advisory — the renderer suggests, never blocks). Must resolve, no cycles |

## Freshness — `updated`, `reviewBy`, `revisions[]`, input pins

Every lesson is dated three ways, and C2's pipeline relies on all three (what an **unattended** pipeline run may do with them — pins only advance to observed dates, gates never change on a revision, section ids are never removed — is `CLASSROOM-COMMITTER-CONTRACT.md`):

- **`reviewBy`** — the lesson's own nearest dated gate. The renderer shows it as a chip (plain > 30 days out, gold within 30 days, red "⚠ review due" once passed — the guidance `gdReviewChip` behaviour). The quarterly review Routine is the backstop; a revision that changes a dated gate sets the new `reviewBy` in the same commit
- **`provenance.inputs[].date`** — the source's revision date **at authoring**. A refresh session re-reads each input, and where the live source is newer and contradicts taught material it revises the lesson and records what moved
- **`revisions[]`** — `{ "date", "note", "changed": ["section-id", …] }`, oldest first. `changed[]` is the "what changed since you learned this" hook: the progress store records **when** an account completed a section — the stored value is a `YYYY-MM-DD` completion date, not a boolean (`Classroom.gs` v01.08g) — so any revision dated after that completion whose `changed[]` names the section is surfaced as a delta. `Classroom.html` computes this client-side (`clSectionDelta`) from the completion date and the lesson's own `revisions[]`; both already travel to the page, so no server op is needed. **A section completed before dates existed stores legacy `true`**, which reads as "completed, date unknown" and yields no delta — an undated tick cannot be compared against a revision date, and stamping one with today's date would fabricate history. Those resolve themselves the next time the section is ticked. A section whose **meaning** changed keeps its id and appears in `changed[]`; a section that is merely reworded appears in neither. A new section is simply added (a never-completed section needs no delta); a removed section id is listed in `changed[]` once so completed-section progress is reconciled, then never reused

## Serving — `action=classroom` ops (`Classroom.gs`)

Read-only fetch ops, the guidance-ops transport (`doPost` `action=classroom`, mirrored on the GET `api` route as `op=classroom`), parameters `session`, `cop`, `id`:

| `cop` | Returns | Gate |
|-------|---------|------|
| `index` | `{ role, schema: { lesson, track }, tracks[], lessons[] }` — tracks as the tier sees them (readable lessons as cards + `withheld` count), every readable lesson as a card | session → `clRequire_(sess, 'tracks')` (the app door; viewer is turned away) |
| `track` | `{ track }` — one track as the tier sees it; `UNKNOWN_TRACK` when it does not exist **or** nothing in it is readable | same door |
| `lesson` | `{ lesson }` — the full lesson including sections | door, then **`clRequireLesson_(sess, clStampKinds_(lesson))`** — the stamp's fold is enforced before any section text leaves the server |
| `drill` | `{ today, items[], stats }` — the queue (see "Drill items and history"); lesson items carry their payload, study items carry the id and slug (the page fetches that text) | door; lesson items enumerated from `clLessonVisible_`, study items from the server-built public pool |
| `grade` | `{ id, state }` — the item's new scheduling state | door, then the same derivation `drill` served from; an id outside it is `ITEM_DENIED` |

A **card** (`clLessonCard_`) is metadata only — `id`, `type`, `title`, `short`, `group`, `updated`, `reviewBy`, `edition`, `gate` (the capability the stamp folded to), `kinds` (the distinct stamp kinds, for a provenance badge), `revised`, `sections` (count). Errors: `SESSION_EXPIRED`, `ROLE_DENIED` (with the tier), `UNKNOWN_TRACK`, `UNKNOWN_LESSON`, `NO_ACCOUNT`, `BAD_ITEM`, `ITEM_DENIED`, `DRILL_FULL`, `DRILL_STORE_UNAVAILABLE`, `unknown_cop`. Every denial writes an audit-log entry naming the operation and tier (`clRequire_` / `clRequireLesson_`).

## Example — a guidance-derived module (contributor+)

```js
function clLessonSpecSheet_() {
  return {
 "schemaVersion": 1,
 "id": "spec-sheet-decoded",
 "type": "module",
 "title": "The Spec Sheet, Decoded",
 "short": "Every line on a BESS container spec sheet, what it means, and why the buyer asks.",
 "group": "Technology Foundations",
 "updated": "2026-09-01",
 "reviewBy": "2027-02-24",
 "provenance": {
  "inputs": [
   { "kind": "guidance", "ref": "guidance:bess-tech-fundamentals-2026-08", "date": "2026-08-24",
     "note": "the spec-sheet table and the warranty-curve framing" },
   { "kind": "public", "ref": "study:sungrow", "date": "2026-08-30",
     "note": "worked example of one vendor's container line" },
   { "kind": "public", "ref": "concepts:profiler-concepts", "date": "2026-08-30" }
  ]
 },
 "sections": [
  { "id": "why-it-matters", "title": "Why the spec sheet is the sale", "kind": "prose", "read": "2 min",
    "ps": [ "Buyers rarely ask how the chemistry works — they ask what happens in year 12. {{cycle life}} …" ],
    "sales": "Lead with the warranty curve, not the chemistry." },
  { "id": "check", "title": "Check yourself", "kind": "quiz",
    "items": [ { "q": "What does round-trip efficiency measure?", "c": ["…", "…", "…"], "a": 0, "why": "…" } ] }
 ]
  };
}
```

The stamp folds to `guidance` (one guidance input outranks the two public ones), so contributor and admin read it and analyst sees it only as a withheld count in its track. Pre-C3 the renderer shows the guidance input as a deep link into Profiler's hub; the data does not change at C3.

## Drill items and history (C4)

The retention layer. Every flashcard and quiz item already in the corpus becomes a drillable **item**; the account's per-item history drives a spaced-repetition queue. Nothing about lessons or study guides changes to support this — the drill reads the material that already exists.

### Item identity

An item id is `<kind>:<source>:<section>:<n>` — stable, derivable from the content alone, and never stored inside the content:

| Kind | Id shape | Source of the item |
|------|----------|--------------------|
| `lc` | `lc:<lessonId>:<sectionId>:<n>` | a lesson's `flashcards` section, `cards[n]` |
| `lq` | `lq:<lessonId>:<sectionId>:<n>` | a lesson's `quiz` section, `items[n]` |
| `sf` | `sf:<slug>:<n>` | a study guide's top-level `flashcards[n]` (public Pages data) |
| `ss` | `ss:<slug>:<sectionId>:<n>` | a study guide's section of kind `flashcards` with that `id`, `cards[n]` (public Pages data; every guide authored from 2026-09 keeps its cards here — K1, curriculum plan §10.7) |

`n` is the index within its array. Ids are **positional**, which is deliberate: the alternative is authoring an id per card, and ~2,000 hand-written ids is a maintenance surface with no reader-visible benefit. Positional ids have one failure mode — inserting a card mid-array shifts every later id — and the content hash below is what makes that failure safe rather than silent. An `ss:` id is stable across guide edits for the same reason a `lc:` id is: the section id is permanent per the study schema, so only a mid-array insert moves it, and the hash absorbs that. `sf:` ids were not renamed when `ss:` arrived, so no account's history moved.

### The content hash

Each history row stores a short hash of the item's own text (question + answer, or question + choices + answer). It is a **change detector, not a checksum**: djb2 over the concatenated text, base-36. On every grade the client sends the hash it rendered; when it does not match the stored one, the item's scheduling state is **reset and the item is re-introduced** rather than being credited with a history that belonged to different text.

This is the same reasoning as `revisions[].changed[]` for lessons: material that changed is material you have not learned. It also absorbs the positional-id failure — a card inserted mid-array shifts its successors' ids onto different text, the hashes stop matching, and those cards are re-introduced instead of silently inheriting a stranger's schedule.

### Scheduling — SM-2

Standard SM-2, with the grade collapsed to four buttons because a six-point self-rating is a decision the reader should not have to make on every card:

| Button | SM-2 `q` | Effect |
|--------|----------|--------|
| Again | 2 | lapse: `reps` → 0, `interval` → 1 day, `lapses` +1 |
| Hard | 3 | `interval` × 1.2, ease −0.14 |
| Good | 4 | standard progression (1 → 6 → `interval` × ease) |
| Easy | 5 | standard progression, ease +0.10 |

Ease starts at 2.5 and floors at 1.3 — below that a card is not being learned and the interval, not the ease, should absorb it. Intervals are whole days; `due` is a `YYYY-MM-DD` date, so "due today" is a string comparison in the same shape the progress store already uses.

### Storage — two sheet tabs

The design doc called this out at C4: drill history outgrows the 9 KB-per-account Script Property that reading progress uses. 855 items × a scheduling row is comfortably past it, so the drill is sheet-backed on the Classroom spreadsheet.

**`ClassroomDrill`** — current state, one row per (account, item). This is the queue.

| Column | Meaning |
|--------|---------|
| `Account` | lower-cased email; the account key, exactly as the progress store scopes |
| `ItemId` | per "Item identity" above |
| `Hash` | the content hash the state was earned against |
| `Ease` | SM-2 ease factor |
| `IntervalDays` | current interval |
| `Reps` | consecutive successful reviews |
| `Lapses` | lifetime count of `Again` |
| `Due` | `YYYY-MM-DD` |
| `LastGrade` | 0–3 as sent by the client |
| `LastSeen` | `YYYY-MM-DD` |
| `Updated` | ISO timestamp of the last write |

**`ClassroomDrillLog`** — append-only, one row per grade: `Timestamp`, `Account`, `ItemId`, `Grade`, `IntervalBefore`, `IntervalAfter`, `Ease`. The state tab answers "what is due"; the log answers "how did this go over time", which is the question a retention feature has to be able to answer later. Nothing reads the log yet, and that is fine — it cannot be reconstructed after the fact, so it is written from the first commit.

### Caps

- **`CL_DRILL_SESSION_CAP` = 20** items per drill session, and **`CL_DRILL_NEW_CAP` = 10** never-before-seen items introduced per day. A queue that returns everything due is a queue the reader stops opening
- **`CL_DRILL_ACCOUNT_CAP` = 3000** state rows per account. The corpus holds ~2,050 items (1,920 study cards after K1 plus the lesson items), so this is headroom rather than a limit; it exists so a malformed client cannot grow the tab without bound
- **`CL_DRILL_INV_CAP` = 2400** study-guide items built into the pool (`sf:` and `ss:` together — ~1,920 at K1) — a guard against a registry that grows unexpectedly, not a limit the corpus is near. The cached value is the compact `{ id: hash }` map (~61 KB at 1,920 items); if the corpus takes it past ~90 KB, split the cached value by slug initial before raising the cap again

### Serving — `cop=drill` and `cop=grade`

Both sit behind the same app door as every other Classroom op (`clRequire_(sess, 'tracks')`), and both enforce the rule the progress store established: **the drill is never a weaker gate than reading.**

- **Lesson items** are enumerated server-side from lessons this session may actually read (`clLessonVisible_`), exactly as `clProgressValid_` does for sections. A tier that cannot open a lesson can neither drill its cards nor discover them by probing an id
- **Study-guide items** are public Pages data. The server builds this half of the pool **itself** — registry, then every `<slug>.study.json` through `UrlFetchApp.fetchAll`, cached six hours as ids and hashes only (~23 KB; card text is never cached). It briefly did this from a client-supplied `inv` array instead, which could not work: the shared GAS transport carries parameters in the query string and the real corpus encodes to ~39,000 characters, several times what Apps Script accepts. Owning it server-side removes the payload, lets the hash comparison re-introduce a changed card at queue time rather than only at grade time, and leaves nothing client-supplied to validate. `CL_DRILL_INV_CAP` remains as a build guard
- `cop=drill` returns the queue: due items first (oldest `Due` first), then new items up to the daily cap. Lesson items carry their payload, since the server holds them and the gate has been checked; study items carry the id only, because the client already has the text
- `cop=grade` takes `id`, `grade` (0–3) and `hash`, re-validates the id against the same gate, applies SM-2, writes both tabs, and returns the updated state. An unvalidated id is refused, never silently stored

## Verification

Run **`python3 scripts/check-classroom-content.py`** after any lesson, track, or stamp write — a write without a clean pass is incomplete (sibling rule to the study and report checkers). It parses every `clLesson<Name>_()` / `clTrack<Name>_()` literal out of `Classroom.gs` and validates both schemas, id rules and uniqueness, section kinds, track membership, prerequisite cycles, and every stamp against the prefix table **read from the `.gs` itself** (so the checker cannot drift from the code); then it loads the PROJECT region into Node and asserts the stamp → gate truth table (`clStampKinds_` → `clGateForProvenance_` → `clLessonVisible_` per tier, plus the per-tier index filtering) against fixtures. It also **warns on any `{{term}}` that resolves in neither the lesson's own glossary nor `profiler-data/profiler-concepts.json`** — an unresolvable term renders as a dotted span with no tooltip behind it, which a reader sees and a reviewer does not. Also run `node --check` on a `.js` copy of `Classroom.gs` and `node scripts/check-gas-inner-scripts.js`, as for every GAS change.

**Micro-markup is checked too, and the rule behind it is worth knowing while authoring (added v05.56r).** `clFmt` in `Classroom.html` resolves `**bold**` with `/\*\*([^*]+)\*\*/g` — a character class that **cannot contain an asterisk** — and only then `*italic*`. So **an italic nested inside a bold never matches**: the bold pass skips it, the italic pass chews the string, and **literal asterisks render to the reader**. Use one level of emphasis per span. The checker simulates both substitutions over every string the renderer actually formats and errors on any surviving `*`, naming the section id and the exact path (`cards[1].adv[0]`). Two properties of that scope are deliberate and should survive any future edit:

- **Only clFmt-fed fields are checked.** Most content reaches the DOM through `clEl()`'s `textContent`, where an asterisk is a literal character — section `title` and `read`, proscons card `t`/`meta`, `tiles[]`, `glossary[]`, the lesson's own `title`/`short`, and timeline lane labels. `provenance.inputs[].note` is an authoring aid that is **never rendered at all**, which is why `P=V*I` sits safely in one today.
- **The walk is kind-aware, not field-name-aware.** A `timeline` item's `label` and `sub` are formatted; a `bars` item's `label` and `sub` are not. Same field names, opposite answers — so the scope table is keyed on `kind` and mirrors the renderer call site by call site.

The same check runs over the nine `guidanceDoc<Name>_()` literals below the `// CONTENT END` fence: they are not lessons and nothing else here validates them, but `Classroom.html` renders them through the same `cl*` engine, so they carry the identical hazard.

## Extending the schema

1. Update this document first — it is the single source of truth
2. Bump `CL_LESSON_SCHEMA_VERSION` / `CL_TRACK_SCHEMA_VERSION` only for a **shape** change, and add the load-time adapter in the same commit so every older lesson stays renderable (the study.json v1 precedent); new optional fields need no bump — the renderer skips absent fields
3. Extend `scripts/check-classroom-content.py` for the new field and re-run it
4. Never add a `note:` prefix, and never add a provenance kind that is not in `CL_PROVENANCE_STRICTNESS` — the fold order is the access ladder, and a new kind means a new rung agreed at a design gate

Developed by: LightAISolutions
