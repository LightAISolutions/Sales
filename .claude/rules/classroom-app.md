---
paths:
  - "live-site-pages/Classroom.html"
  - "googleAppsScripts/Classroom/**"
  - "repository-information/CLASSROOM-SCHEMA.md"
---

# Classroom App — Content Authoring Rules

*Path-scoped: auto-injects when working on the Classroom app or its schema. The design these rules implement is `repository-information/PHASE6-CLASSROOM-DESIGN.md`; the data shapes are in `repository-information/CLASSROOM-SCHEMA.md` — read it before authoring or revising any lesson or track, whether by hand or in a C2 pipeline session.*

## Where content lives

- Lessons and tracks are **strict-JSON object literals** returned by `clLesson<Name>_()` / `clTrack<Name>_()` in the PROJECT region of `googleAppsScripts/Classroom/Classroom.gs`, registered in `clLessons_()` / `clTracks_()` (ordered by lane). They never deploy to public Pages — a track names gated titles, and lesson sections may carry gated material
- Keep the literals JSON (double-quoted keys, no trailing commas, no expressions): `scripts/check-classroom-content.py` parses them out of the `.gs` and a non-JSON literal fails the check

## The provenance stamp — the one rule that makes "Everything" safe

- Every lesson carries `provenance.inputs[]`, one entry per corpus source it was authored from: `{ "kind", "ref", "date" }`. `ref` is a typed identity `<prefix>:<id>` and the prefix fixes the kind (`CL_PROVENANCE_REF_KINDS` in `Classroom.gs`; table in CLASSROOM-SCHEMA.md). The lesson inherits the **strictest** gate of its inputs (`clGateForProvenance_`): public-only lessons reach analysts, guidance- or corpus-derived lessons are contributor+, report-derived lessons are admin-only
- **Never fabricate an input.** An input is a source the lesson's content actually came from — a dossier, study guide, project, module, corpus item, or report you read while authoring. A lesson with no corpus input has no place in Classroom
- **Field notes never become content.** There is no `note:` prefix on purpose; a lesson that references one is denied to every tier. Notes may steer emphasis only when the developer supplies them — never quoted, never cited (`PHASE6-CLASSROOM-DESIGN.md`)
- **Never invent a parallel gate.** Serve lesson text only through `clRequireLesson_(sess, clStampKinds_(lesson), …)`; a malformed stamp folds to `''` = deny, and that is the intended outcome, not a bug to route around
- The `gate` is never stored in data — it is derived from the stamp at serve time so it cannot drift

## Freshness

- Every lesson carries `updated` and `reviewBy` (set from the lesson's own nearest dated gate, guidance discipline step 10 in `.claude/rules/industry-guidance.md`), and each `provenance.inputs[].date` pins the source's revision date at authoring — that pin is what a C2 refresh compares against to emit "what changed since you learned this"
- A revision appends to `revisions[]` with `changed[]` naming the section ids whose meaning changed; unchanged sections keep their ids and their progress

## Versioning and verification

- Content-only additions bump the **GAS** version ([PC-GS-VERSION] #1); renderer/UI changes also bump the **page** version ([PC-HTML-VERSION] #2). Public changelog entries stay generic ("curriculum updated") per `.claude/rules/changelog-security.md` — never name gated sources
- Before push: `python3 scripts/check-classroom-content.py` (schema + stamp truth table; a write without a clean pass is incomplete), `node --check` on a `.js` copy of `Classroom.gs`, and `node scripts/check-gas-inner-scripts.js`

Developed by: LightAISolutions
