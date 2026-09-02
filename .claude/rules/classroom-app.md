---
paths:
  - "live-site-pages/Classroom.html"
  - "googleAppsScripts/Classroom/**"
  - "repository-information/CLASSROOM-SCHEMA.md"
  - "repository-information/CLASSROOM-COMMITTER-CONTRACT.md"
---

# Classroom App — Content Authoring Rules

*Path-scoped: auto-injects when working on the Classroom app or its schema. The design these rules implement is `repository-information/PHASE6-CLASSROOM-DESIGN.md`; the data shapes are in `repository-information/CLASSROOM-SCHEMA.md` — read it before authoring or revising any lesson or track, whether by hand or in a C2 pipeline session.*

## Where content lives

- Lessons and tracks are **strict-JSON object literals** returned by `clLesson<Name>_()` / `clTrack<Name>_()` in the PROJECT region of `googleAppsScripts/Classroom/Classroom.gs`, registered in `clLessons_()` / `clTracks_()` (ordered by lane). They never deploy to public Pages — a track names gated titles, and lesson sections may carry gated material
- Keep the literals JSON (double-quoted keys, no trailing commas, no expressions): `scripts/check-classroom-content.py` parses them out of the `.gs` and a non-JSON literal fails the check
- Every literal lives inside the **content fence** — `// CONTENT START` … `// CONTENT END` in `Classroom.gs` (C2b, 2026-09-02). The fence is the unattended pipeline's write set inside the file (`CLASSROOM-COMMITTER-CONTRACT.md` §3.1): `check-classroom-content.py` errors on any `clLesson*`/`clTrack*` literal or either registry defined outside it, and `check-classroom-pipeline.py` (P2) errors on a pipeline diff that reaches outside it. Developer sessions may edit either side of the fence freely — but a new lesson or track still belongs **inside** it, or the next pipeline run cannot revise what you wrote

## The provenance stamp — the one rule that makes "Everything" safe

- Every lesson carries `provenance.inputs[]`, one entry per corpus source it was authored from: `{ "kind", "ref", "date" }`. `ref` is a typed identity `<prefix>:<id>` and the prefix fixes the kind (`CL_PROVENANCE_REF_KINDS` in `Classroom.gs`; table in CLASSROOM-SCHEMA.md). The lesson inherits the **strictest** gate of its inputs (`clGateForProvenance_`): public-only lessons reach analysts, guidance- or corpus-derived lessons are contributor+, report-derived lessons are admin-only
- **Never fabricate an input.** An input is a source the lesson's content actually came from — a dossier, study guide, project, module, corpus item, or report you read while authoring. A lesson with no corpus input has no place in Classroom
- **Field notes never become content.** There is no `note:` prefix on purpose; a lesson that references one is denied to every tier. Notes may steer emphasis only when the developer supplies them — never quoted, never cited (`PHASE6-CLASSROOM-DESIGN.md`)
- **Never invent a parallel gate.** Serve lesson text only through `clRequireLesson_(sess, clStampKinds_(lesson), …)`; a malformed stamp folds to `''` = deny, and that is the intended outcome, not a bug to route around
- The `gate` is never stored in data — it is derived from the stamp at serve time so it cannot drift

## Freshness

- Every lesson carries `updated` and `reviewBy` (set from the lesson's own nearest dated gate, guidance discipline step 10 in `.claude/rules/industry-guidance.md`), and each `provenance.inputs[].date` pins the source's revision date at authoring — that pin is what a C2 refresh compares against to emit "what changed since you learned this"
- A revision appends to `revisions[]` with `changed[]` naming the section ids whose meaning changed; unchanged sections keep their ids and their progress

## Unattended (pipeline) sessions

- A session fired by the C2 Routine — no developer present — is bound by **`repository-information/CLASSROOM-COMMITTER-CONTRACT.md`** (C2a, 2026-09-02) on top of everything above: a closed write set (the content region of `Classroom.gs` + the versioning/changelog files only), frozen surfaces (the AUTH region, the gate derivation, the stamp vocabulary, existing ids, existing gates), three outcomes (`COMMIT` / `STAND-DOWN` / `BLOCKED`, the latter two leaving the repo untouched), the thirteen corpus-delta guarantees, and the diff-aware checker C2b adds. Read it before authoring the Routine prompt (C2c) or the pipeline machinery (C2b)
- Developer sessions are **not** bound by it, but one obligation flows back: **a developer session that changes the gate surface refreshes `gateDigest` in `repository-information/classroom-pipeline-ledger.json` in the same commit** — otherwise the next pipeline run blocks on "the ground moved". The gate surface is the 32 symbols listed in `GATE_SYMBOLS` in `scripts/check-classroom-pipeline.py` (the access matrix, the provenance fold, the stamp reader, the per-tier views, progress and study-next, the transport, the two schema-version constants) — as read by the checker, *including their comments*, since a change to the reasoning written next to the gate is exactly what a run should see acknowledged. Recompute and write it with:

  ```bash
  python3 - <<'EOF'
  import importlib.util, json, pathlib
  spec = importlib.util.spec_from_file_location("cp", "scripts/check-classroom-pipeline.py")
  cp = importlib.util.module_from_spec(spec); spec.loader.exec_module(cp)
  d, missing = cp.gate_digest(open("googleAppsScripts/Classroom/Classroom.gs", encoding="utf-8").read())
  assert not missing, missing
  p = pathlib.Path("repository-information/classroom-pipeline-ledger.json")
  led = json.loads(p.read_text()); led["gateDigest"] = d
  p.write_text(json.dumps(led, indent=1) + "\n"); print(d)
  EOF
  ```

  You do not need to guess whether a change counts: run `python3 scripts/check-classroom-pipeline.py --base origin/main` before pushing and refresh the digest if P3 reports a mismatch. The ledger's other two fields are the pipeline's own — `coveredThrough` is the curriculum watermark and `lastRun` records the last committing run; a developer session leaves both alone

## Versioning and verification

- Content-only additions bump the **GAS** version ([PC-GS-VERSION] #1); renderer/UI changes also bump the **page** version ([PC-HTML-VERSION] #2). Public changelog entries stay generic ("curriculum updated") per `.claude/rules/changelog-security.md` — never name gated sources
- Before push: `python3 scripts/check-classroom-content.py` (schema + stamp truth table; a write without a clean pass is incomplete), `node --check` on a `.js` copy of `Classroom.gs`, and `node scripts/check-gas-inner-scripts.js`
- Also before push, when the change touches `Classroom.gs`, the ledger, or either checker: `python3 scripts/check-classroom-pipeline.py --base origin/main` (the diff-aware judge — on a developer commit its P1 write-set findings are expected noise, but **P3 is not**: a P3 mismatch means the gate digest needs refreshing per above) and `python3 scripts/check-classroom-pipeline.py --selftest` (the contract §7 fixtures — one positive, twelve negative; this must stay at zero failures)

Developed by: LightAISolutions
