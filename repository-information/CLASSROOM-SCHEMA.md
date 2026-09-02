# Classroom App — Track & Lesson Schema

**Single source of truth** for the Classroom app's content data shapes: the **lesson** (schema v1), the **track** (schema v1), and the **provenance stamp** every lesson carries. Read this before authoring or revising any lesson or track — by hand in a build session or automatically in a C2 pipeline session. The Profiler counterpart is `PROFILER-SCHEMA.md`; the design these shapes implement is `PHASE6-CLASSROOM-DESIGN.md` (developer-approved 2026-08-31).

**Where content lives.** Lessons and tracks are authored as **strict-JSON object literals** returned by `clLesson<Name>_()` / `clTrack<Name>_()` functions in the PROJECT region of `googleAppsScripts/Classroom/Classroom.gs`, and registered in `clLessons_()` / `clTracks_()` — the guidance content-in-GAS pattern. They never deploy to public Pages: a track names gated lesson titles, and a lesson's sections may carry guidance-, briefing-, or report-derived material. The page reads them only through the role-gated `action=classroom` ops. Keep the literals JSON (double-quoted keys, no trailing commas, no expressions) — `scripts/check-classroom-content.py` parses them straight out of the `.gs`.

**What is deliberately not here.** Per-account progress (the `gd_progress` property-store pattern) and the study-next pointer are the next C1 slice; the drill queue is C4. Neither changes these shapes — progress keys on lesson id + section id, which is why both ids are permanent.

## Id rules

- Lesson ids, track ids, and section ids match `^[a-z0-9][a-z0-9-]{0,63}$` (`CL_ID_RE` in `Classroom.gs`) — kebab-case, lowercase, max 64 chars
- **Ids are permanent.** Progress (next slice), freshness deltas, and track membership all key on them. A revision that keeps a section's meaning keeps its id; a section whose meaning changes gets a new id (and the old one is listed in the revision's `changed[]`, see Freshness)
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
| `type` | string | no | `module` (default) · `briefing`. Tracks may list modules only; briefings are surfaced as a dated feed and carry `edition` |
| `title` | string | yes | Display title |
| `short` | string | yes | One-line card summary (≤160 chars) |
| `group` | string | yes | Topic lane the index groups by — reuse the guidance lanes (`Technology Foundations`, `The AI Data-Center Wave`, `Market Access & Bankability`); add a lane only when none fits |
| `updated` | string | yes | `YYYY-MM-DD` of this revision |
| `reviewBy` | string | yes | `YYYY-MM-DD` — set from the lesson's **own nearest dated gate** (a regulatory effective date, a milestone, a scheduled rate change), not a fixed cadence; slow-moving fundamentals default to ~6 months from `updated` (guidance freshness discipline) |
| `edition` | string | briefings only | `YYYY-MM-DD` the briefing covers through; required when `type` = `briefing`, forbidden otherwise |
| `provenance` | object | yes | The stamp — see above. `{ "inputs": [...] }` |
| `revisions[]` | object[] | no | `{ "date", "note", "changed": string[] }` — one entry per revision, oldest first; `changed[]` names the section ids whose meaning changed (see Freshness). A first authoring needs no entry |
| `tiles[]` | object[] | no | `{ "k", "v", "sub" }` — up to four headline tiles rendered above the sections, as guidance modules use |
| `glossary[]` | object[] | no | `{ "t", "d" }` — lesson-local term definitions. `{{term}}` tooltips resolve **lesson glossary first, then the public concepts registry** (`profiler-concepts.json`), the study-guide order. Define a term here only when the lesson needs a meaning the registry lacks |
| `sections[]` | object[] | yes (≥1) | Guidance section-kind vocabulary: `{ "id", "title", "kind", … }` with `kind` ∈ `prose`, `callout`, `table`, `proscons`, `timeline`, `bars`, `flashcards`, `quiz`, `ledger` and the same per-kind fields as guidance modules (`ps`, `cols`/`rows`, `cards`, `lanes`/`items`, `unit`, `intro`, `read`, `note`, `tone`, per-section `sales`). `id` per Id rules, unique within the lesson — progress keys on lesson id + section id. Ordered as taught. Prose uses the guidance micro-markup (`**bold**`, `*italic*`, `{{term}}`); **no `[c:<id>]` citation tokens** — a lesson's sourcing is its stamp, and the renderer shows the inputs as a provenance strip |

**Content contract** (inherits the study-guide and guidance rules): teach the technology and the market in its industry context from a high-school-STEM baseline; flashcards and quizzes drill understanding, never company trivia; guidance-style content addresses supplier/buyer **groups**, and company-specific material comes from dossiers and is stamped as such. Public-safe is decided by the stamp, not by the prose: a lesson that quotes a report is `report`-stamped whether or not the quoted line looks harmless.

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

Every lesson is dated three ways, and C2's pipeline relies on all three:

- **`reviewBy`** — the lesson's own nearest dated gate. The renderer shows it as a chip (plain > 30 days out, gold within 30 days, red "⚠ review due" once passed — the guidance `gdReviewChip` behaviour). The quarterly review Routine is the backstop; a revision that changes a dated gate sets the new `reviewBy` in the same commit
- **`provenance.inputs[].date`** — the source's revision date **at authoring**. A refresh session re-reads each input, and where the live source is newer and contradicts taught material it revises the lesson and records what moved
- **`revisions[]`** — `{ "date", "note", "changed": ["section-id", …] }`, oldest first. `changed[]` is the "what changed since you learned this" hook: the progress store (next slice) records when an account completed a section, so any revision dated after that completion whose `changed[]` names the section is surfaced as a delta. A section whose **meaning** changed keeps its id and appears in `changed[]`; a section that is merely reworded appears in neither. A new section is simply added (a never-completed section needs no delta); a removed section id is listed in `changed[]` once so completed-section progress is reconciled, then never reused

## Serving — `action=classroom` ops (`Classroom.gs`)

Read-only fetch ops, the guidance-ops transport (`doPost` `action=classroom`, mirrored on the GET `api` route as `op=classroom`), parameters `session`, `cop`, `id`:

| `cop` | Returns | Gate |
|-------|---------|------|
| `index` | `{ role, schema: { lesson, track }, tracks[], lessons[] }` — tracks as the tier sees them (readable lessons as cards + `withheld` count), every readable lesson as a card | session → `clRequire_(sess, 'tracks')` (the app door; viewer is turned away) |
| `track` | `{ track }` — one track as the tier sees it; `UNKNOWN_TRACK` when it does not exist **or** nothing in it is readable | same door |
| `lesson` | `{ lesson }` — the full lesson including sections | door, then **`clRequireLesson_(sess, clStampKinds_(lesson))`** — the stamp's fold is enforced before any section text leaves the server |

A **card** (`clLessonCard_`) is metadata only — `id`, `type`, `title`, `short`, `group`, `updated`, `reviewBy`, `edition`, `gate` (the capability the stamp folded to), `kinds` (the distinct stamp kinds, for a provenance badge), `revised`, `sections` (count). Errors: `SESSION_EXPIRED`, `ROLE_DENIED` (with the tier), `UNKNOWN_TRACK`, `UNKNOWN_LESSON`, `unknown_cop`. Every denial writes an audit-log entry naming the operation and tier (`clRequire_` / `clRequireLesson_`).

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

## Verification

Run **`python3 scripts/check-classroom-content.py`** after any lesson, track, or stamp write — a write without a clean pass is incomplete (sibling rule to the study and report checkers). It parses every `clLesson<Name>_()` / `clTrack<Name>_()` literal out of `Classroom.gs` and validates both schemas, id rules and uniqueness, section kinds, track membership, prerequisite cycles, and every stamp against the prefix table **read from the `.gs` itself** (so the checker cannot drift from the code); then it loads the PROJECT region into Node and asserts the stamp → gate truth table (`clStampKinds_` → `clGateForProvenance_` → `clLessonVisible_` per tier, plus the per-tier index filtering) against fixtures. It also **warns on any `{{term}}` that resolves in neither the lesson's own glossary nor `profiler-data/profiler-concepts.json`** — an unresolvable term renders as a dotted span with no tooltip behind it, which a reader sees and a reviewer does not. Also run `node --check` on a `.js` copy of `Classroom.gs` and `node scripts/check-gas-inner-scripts.js`, as for every GAS change.

## Extending the schema

1. Update this document first — it is the single source of truth
2. Bump `CL_LESSON_SCHEMA_VERSION` / `CL_TRACK_SCHEMA_VERSION` only for a **shape** change, and add the load-time adapter in the same commit so every older lesson stays renderable (the study.json v1 precedent); new optional fields need no bump — the renderer skips absent fields
3. Extend `scripts/check-classroom-content.py` for the new field and re-run it
4. Never add a `note:` prefix, and never add a provenance kind that is not in `CL_PROVENANCE_STRICTNESS` — the fold order is the access ladder, and a new kind means a new rung agreed at a design gate

Developed by: LightAISolutions
