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

- A session fired by the C2 Routine — no developer present — is bound by **`repository-information/CLASSROOM-COMMITTER-CONTRACT.md`** (C2a, 2026-09-02) on top of everything above: a closed write set (the content region of `Classroom.gs` + the versioning/changelog files only), frozen surfaces (the AUTH region, the gate derivation, the stamp vocabulary, existing ids, existing gates), three outcomes (`COMMIT` / `STAND-DOWN` / `BLOCKED`, the latter two leaving the repo untouched), the thirteen corpus-delta guarantees, and the diff-aware checker C2b adds. Read it before touching the pipeline machinery (C2b); the run's own decision procedure — what to teach this week, written to the checker's assertions — is the "Authoring a pipeline lesson" section below (C2c, 2026-09-02), which the Routine prompt points every run at
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

## Authoring a pipeline lesson

*The C2c authoring prompt (2026-09-02). This is how one unattended run — "the committer" of `repository-information/CLASSROOM-COMMITTER-CONTRACT.md` — decides what to teach this week, written **to** the twelve assertions in `scripts/check-classroom-pipeline.py` (P1–P12) rather than alongside them: every rule below names the assertion that will judge it, and the three obligations no assertion can see are stated as the run's own. A developer session authoring by hand is not bound by the caps or the outcomes, but the same rules produce a lesson the next pipeline run can revise; where this section and the contract differ, the contract wins and the difference is a defect to report, never a licence.*

### The shape of a run

A run is a **decision followed by at most one write**. It reads the whole curriculum's pins, fetches every source once, decides — per lesson, then for the briefing — and only then opens `Classroom.gs`. Nothing is written "to see how it looks": the first write is the only write (contract §2, one attempt), and it is made after the decision is complete and named in full. The default outcome is `STAND-DOWN`; a quiet corpus is the expected week, and reporting it costs nothing (§5).

1. **Build the pin table.** For every registered lesson, list `provenance.inputs[]` as `(lesson id, ref, pin)`. The pins in the lessons are the baseline — the ledger never duplicates them; the ledger contributes only `coveredThrough` (the briefing watermark) and `gateDigest` (pre-flight, §5.1)
2. **Fetch every distinct `ref` once**, from the layer the contract's §6.1 table names for its prefix, and record the date **read off the fetched document itself**: a dossier's `lastUpdated`, a study guide's `lastUpdated`, a module's `updated` in `guidanceDocs_()`, the graph's `built`, a report's `generated` (and the index's `status`), a corpus item's `publishedAt` (token-gated; skipped without a token), and — for `project:` and `concepts:` — the file's last commit date on the base revision (`git log -1 --format=%cs -- <path>`; `PROFILER-SCHEMA.md`, "Registry revision signals"). Classify each ref exactly once: **unchanged** (date = pin), **moved** (date > pin), or **unknown** (§5.2 below). These three counts are the report's `Sources seen:` line
3. **Decide each moved source's lessons** under the contradiction test (next heading). A lesson with any unknown input is frozen — not decided, listed under `Frozen`
4. **Decide the briefing** under the watermark and the minimum-material bar (below)
5. **Apply the caps** (§5.3 step 6 · P10): at most one new briefing, one new module, three revised lessons, one new track, no lesson revised twice. Rank revisions by the size of the contradiction (a wrong number in a taught claim outranks a superseded reference), take the top three, and list the rest under `Skipped at caps` — they are re-examined next run because their pins did not move
6. **Write, verify, commit, report** — in the order under "The write, in the order the checkers read it"

### What makes newer material a contradiction (G3) rather than novelty

A source that moved is a **candidate** (G1); it becomes a **revision** only when the run can write, for a named section id, the sentence *"section `<id>` teaches X; `<ref>` now says Y"* — where X is a claim actually present in that section's text (its `ps`, `rows`, `cards`, `items`, `lanes`, `note`, `sales`) and Y is on the document fetched this run. That sentence, one per section, is the revision: its section ids are `revisions[].changed[]`, its X→Y pairs are `revisions[].note`, and the CHANGELOG `### Changed` line repeats it. **If the sentence cannot be written, the lesson does not change** — not its sections, not its pin, not `updated`.

- **Contradiction** is a taught claim the source now states differently: a number (a cycle-life figure, a rack density, a tariff rate), a date (an effective date, a commissioning milestone), a direction (rising → falling, planned → cancelled), a ranking or ordering, a mechanism or a definition, a "who does what". **Supersession** is the same claim restated by a successor document — the report case (G8): the superseding report replaces the ref, same prefix, re-pinned to its `generated`, named in `revisions[].note`; only the sections whose claims the successor changed go in `changed[]`, which may be none
- **Novelty** is material the lesson never taught: a new project, a new product line, a new figure for something the lesson did not cite, a development at a company the lesson uses only as a worked example for a different point. Novelty is **briefing material** (below) or, rarely, a **new module** — never a silent addition to an existing lesson. Appending a section to teach it is a write the run does not make: it grows a taught lesson without a contradiction to justify opening it
- **A source that moved without contradicting anything leaves the lesson untouched — pin included.** G3 says the lesson "does not change", and a pin is part of the lesson. The source will show as *moved* again next run and be re-examined; that repetition is the intended idempotence (G9's stand-down logic applied to pins), not a defect to fix by advancing the pin "to keep it current". The one pin movement without a section change the contract allows is the G8 report swap
- **The contradiction must touch what the lesson took from the source.** Each input's `note` says what was taken; a dossier that revised its financials does not contradict a lesson that took only its container spec table. Read the section, not the diff of the source
- **Wording is never a revision (G4 · P8).** A section whose meaning stands is not opened — not to tighten, not to restyle, not to fix a typo, not to reflow. P8 compares every section's parsed JSON base → head and any difference in its content — a reworded string, a changed space inside one — puts that section in the *differs* set (only a *whole-lesson* whitespace-only diff is forgiven, and forgiven as an error); a section that differs and is not in `changed[]` fails, and naming it in `changed[]` to pass would claim a meaning change that did not happen — which P8 cannot see and G4 forbids. The safe practice is mechanical: **copy the section object you are not revising byte for byte, or do not touch the literal at all**

### Naming `revisions[].changed[]` so P8's equality holds

P8 asserts a set equality on every lesson present at both base and head that differs at all: `{ section ids in both base and head whose parsed JSON differs }` **==** `{ ids in the appended revision's changed[] }`. P7 asserts the entry's shape. Together they fix what a revision literally is:

- **Exactly one entry is appended** to `revisions[]`, oldest-first order preserved: `{ "date": "<run date>", "note": "<the X→Y sentences, one per section; a G8 swap named as `report:old → report:new`>", "changed": [ … ] }`. Existing entries are never edited or reordered (P7 "append-only"); a second entry in the same run is a second revision (P10 "no lesson revised twice")
- **`changed[]` is the differs set, no more and no less.** Every section id whose object you changed — meaning changed, per G3 — is listed; every section you did not list is left byte-identical. An id in `changed[]` that is identical base → head fails P8 ("lists meaning that moved, not sections that were visited"); a section that differs and is missing from `changed[]` fails P8 ("every account that completed it must see the delta")
- **`changed[]` names existing section ids only.** P7 requires each id to be one of the lesson's section ids at head; P8 computes *differs* over the ids present at **both** base and head, so a **newly appended section is never in `changed[]`** — it has no completed ticks to reconcile, and naming it fails P8 as "identical". A section id is never removed or renamed (P5, G12): a claim that no longer holds is corrected in place under its id, and the correction is what `changed[]` records
- **`updated` advances to the run date** whenever anything but `updated` itself differs (P7); **`reviewBy` is set from the nearest dated gate in the *new* material** — an effective date, a milestone, a scheduled rate change now taught by the corrected section — and is never earlier than `updated` (P7, G13). A revision that corrects a date-bearing claim almost always moves `reviewBy`; a revision that corrects a figure with no gate keeps the existing `reviewBy` unless it has already passed, in which case set ~6 months from `updated` (guidance discipline)
- **Pins move only on the inputs the revision drew on**, each to the date read off that fetched document (G2, below); never backwards (P7, G5). An input the revision did not draw on keeps its pin even if that source moved
- **Outside `sections[]`, a revision may change only** `provenance.inputs[].date` (and a G8 `ref` swap), `updated`, `reviewBy` and `revisions[]` — that is the closed list in contract §3.1 item 2. `title`, `short`, `group`, `type`, `edition`, `tiles[]`, `glossary[]` and `schemaVersion` are frozen for the committer. A tile value or a glossary definition that the corpus now contradicts is **left as is and reported** under `Needs the developer` — no assertion watches those fields, which is exactly why the run does not touch them
- **The gate is identical before and after (G6 · P6).** Adding an input that would raise the gate (a `guidance:` ref to a public lesson, a `report:` ref to anything) is not done — the material is left out and reported; removing an input that would lower the gate is not done — the run is `BLOCKED` on that lesson. Material at a different gate is a new lesson with its own stamp

### The briefing — the watermark (G9) and the minimum-material bar (G11)

The briefing is the default home for everything the corpus added that no lesson teaches. It is a dated `type: "briefing"` lesson with `edition` = **the run date** — the window is `(coveredThrough, runDate]`, so the edition that closes it is the run date, which is also what makes the id `briefing-<edition>` deterministic (G10: before writing, check `origin/main` for that id; if it exists, a lost push has already been authored and the run does not author it again). P9 asserts the id names the edition, `edition` > the base ledger's `coveredThrough`, `edition` ≤ today, and the head ledger's `coveredThrough` = `edition` = the newest registered briefing's edition.

**A qualifying item** is one development a reader at the briefing's gate would be taught — one claim with a date — that (a) is carried by a document fetched this run whose revision or published date lies inside the window, and (b) is stated by that document, not inferred from it. One document can carry several items (a dossier revision that adds a factory milestone and an order is two); a document dated in the window that carries nothing teachable is zero. For the undated registries, the window is decided by the file's commit date and the items by `git diff` of the file against its state at the last commit on or before `coveredThrough` — entries added or changed there are the items. **A source** is one distinct `ref`. Corpus items count only when a token was supplied; without one the corpus layer is not "unknown" — it is *not read*, and the report says so.

- **The bar: at least three qualifying items across at least two distinct sources**, counted **after** the gate decision below — an item left out because its source would raise the gate does not count toward the three. Fewer → `STAND-DOWN`, with the count in the report (`Wrote: nothing — 2 qualifying items across 1 source, bar is 3/2`). C2c keeps the contract's numbers; a developer may raise them here, never lower them
- **The gate is chosen, not inherited by accident.** A briefing folds to the strictest kind of its inputs like any lesson: all-public inputs → the analyst-visible "public-only edition"; one `guidance:` or `corpus:` or `briefing:` input → contributor+; one `report:` input → admin-only for everyone. Decide the edition's tier first, then admit only inputs at or below it; corroborate a gated item from a public layer when one carries it (`profile:` over `report:`) and cite the public layer. Cite the previous edition (`briefing:<id>`) only when this one genuinely builds on it — it costs analyst visibility
- **Shape.** `id` `briefing-<edition>` (`-<n>` suffix only if two editions land on one day, which a weekly cadence never produces), `title` "This week in BESS/AIDC — <edition>" or the lane it covers, `short` the one-line summary, `group` the lane most items fall in, `updated` = `edition` = run date, `reviewBy` from the nearest dated gate among the items (never earlier than `updated`), `provenance.inputs[]` one entry per source drawn on with `date` = the date read off it, and `sections[]` one section per item (a `prose` or `callout`; a `table` when several items share a shape), each with a **stable kebab-case id derived from the item** so a later edition's cross-reference has something to name. Every claim traces to a fetched input; the section says what the source says and, where the developer's Routine prompt steers emphasis, weights it — never quotes it, never cites it (no `note:` ref exists, P4)
- **The ledger moves with it and only with it** (P9, §6.3): `coveredThrough` = the new `edition`; `lastRun` = `{ date, repoVersion, outcome: "COMMIT", wrote: [ids], revised: [ids], frozen: [ids] }`. A run that revises lessons but authors no briefing leaves `coveredThrough` where it was — P9 fails a watermark that moved without a briefing — and still rewrites `lastRun`
- **No briefing from memory.** A window with nothing fetched in it is a `STAND-DOWN`, however eventful the week seemed. The window stays open and the next run re-examines it

### A new module — the exception

Novelty becomes a **module** only when it is a teachable unit on its own: fundamentals that will hold for months (`reviewBy` ≥ ~6 months out is the tell), at a single coherent gate, in an existing lane, with at least one explanatory section and a `quiz` or `flashcards` check, and no existing lesson it would duplicate. At most one per run (P10). It is appended to the end of a track's `lessons[]` only when the track's stated outcome (`short`) already covers it; otherwise it is registered without a track and the report says so. New tracks (cap one) need three or more registered modules that no track orders — in practice a developer decision the run reports rather than makes. When in doubt the material goes in the briefing; a module authored unattended that turns out to be wrong is revised under G3 next week, but one that should not have existed cannot be removed by any run (P5).

### The three guarantees no checker can see

The diff-aware checker judges the write; these three are judged only by the run's own honesty, and the §8 CHANGELOG record exists so a developer can spot-check them.

- **G2 — read before re-pin.** Every `date` written into a stamp — a new lesson's pins or a revision's re-pins — is a value the run read off the body of a document it fetched **this run**: the dossier's `lastUpdated` in the fetched `<slug>.profile.json`, not the `lastUpdated` beside it in `profiler-companies.json` (the registry is for the sweep, never for a pin); the module's `updated` in `guidanceDocs_()`; the report's `generated` in the report file; the commit date `git log` printed for the registry file. Never the ledger, never a previous pin plus a guess, never today's date because "it was fetched today". The §8 `### Added` / `### Changed` lines name every input as `ref@date` so the pin is auditable against the document it came from
- **G7 — every ref resolved.** `CL_REF_RE` checks that `profile:foo` is well-formed; only the run can check that `foo` exists. A ref is written only if, in this run, its document was fetched and parsed and its identity matched: `profile:`/`study:` — the JSON at `profiler-data/<slug>.profile.json` / `<slug>.study.json` parsed and its `slug` field equals the id; `project:` — the slug is an entry in `profiler-projects.json`; `graph:profiler-graph` / `concepts:profiler-concepts` — the file parsed; `guidance:` — a module with that `id` is in `guidanceDocs_()` in `Profiler.gs` on the base revision; `corpus:` — the `key` came back on the timeline route in this run (never constructed from a URL); `briefing:` — the lesson id is in `clLessons_()` at base; `report:` — the id is in `reports-index.json` and the report file parsed. A ref that "obviously exists" but was not resolved is not written. `ref` ids never carry a URL, a slug you normalised yourself, or a version suffix
- **§5.2 — the read phase degrades to unknown, never to assume.** A fetch that fails, a body that does not parse, a shape the run does not recognise (a `schemaVersion` it has not seen, a missing date field), or a date **older** than the pin — all make the source **unknown**, every lesson pinned to it **frozen**, and the freeze listed in the report as `lesson ← ref`. A source the run did not fetch (the corpus layer without a token; a layer skipped for budget) is unknown for refresh purposes and *not read* for briefing purposes — never "unchanged". Nothing in the corpus is filled from the run's own knowledge: a claim no fetched document carries is not taught this week, and the gap is reported, not bridged. Retrying a fetch once is reading; retrying until it says what the run hoped is not

### The write, in the order the checkers read it

Only after the decision is complete and every id, ref, pin, section id and `changed[]` is settled:

1. **`Classroom.gs`, inside `// CONTENT START` … `// CONTENT END` only** (P2): append the new `clLesson<Name>_()` / `clTrack<Name>_()` literal(s) after the last existing literal and before the registries, replace a revised literal in place, append the new id(s) to the **end** of `clLessons_()` / `clTracks_()` (P5, append-only) and to the end of a track's `lessons[]` (bump that track's `updated`). Strict JSON: double-quoted keys, no trailing commas, no expressions. Then the one line outside the fence: `var VERSION = "vXX.XXg";` by exactly `+0.01` (P12)
2. **`live-site-pages/gs-versions/Classroomgs.version.txt`** → `|vXX.XXg|`, the same value (P12)
3. **`live-site-pages/gs-changelogs/Classroomgs.changelog.md`** — one versioned section, header `## [vXX.XXg] — <timestamp> — vXX.XXr`, entries **generic only** (P11): `- Weekly briefing published`, `- Curriculum updated`, `- New lesson added to a track`. Never a lesson `title` unless the lesson's gate is `tracks`, never a `ref`, never a company name that reached the lesson through a gated input. When in doubt, the generic line is always correct
4. **`repository-information/CHANGELOG.md`** — the §8 record under the run's version section: the Routine prompt blockquoted with the token redacted, `### Added` per new lesson `**<id>** (<gate>) — <one line>; inputs: <ref@date, …>`, `### Changed` per revised lesson `**<id>** (<gate>, unchanged) — <what moved>; changed sections: <ids>; inputs re-pinned: <ref old→new, …>`, `### Notes` with the §5.4 report verbatim, the checker result lines, and the `VERSION` step. Archive rotation with SHA enrichment if the counter exceeds 100
5. **`repository-information/repository.version.txt`** (+0.01) and **`README.md`** — two lines only: `Last updated:` and the Classroom entry's GAS-version display (P1 bounds the file, not the lines; the two-line rule is the contract's, §3.2)
6. **`repository-information/classroom-pipeline-ledger.json`** — `coveredThrough` (only with a briefing), `lastRun`; `gateDigest` untouched (P3)
7. **Verify** — `python3 scripts/check-classroom-content.py` (zero errors, no new warnings against the pre-flight baseline), `python3 scripts/check-classroom-pipeline.py --base origin/main` (zero findings; `--today` defaults to the run date), `node --check` on a `.js` copy of `Classroom.gs`, `node scripts/check-gas-inner-scripts.js` — once now and once more immediately before `git commit`; the second run is the one that counts. Any finding → discard everything (`git checkout -- . && git clean -fd`, delete the branch) and end `BLOCKED` with the finding verbatim as `Blocked by:` — one attempt, no smaller second try
8. **Commit** `vXX.XXr Classroom pipeline — <YYYY-MM-DD>` on `claude/classroom-pipeline-<YYYY-MM-DD>`, Pre-Commit and Pre-Push checklists as any session (no `SESSION-CONTEXT.md` reconstruction, §3.3), push once, then the §5.4 report as the run's last message

### Assertion → the authoring rule that satisfies it

| # | The checker asserts | So the run … |
|---|---------------------|--------------|
| P1 | changed paths ⊆ the §3 write set | touches only the nine files above; a checklist item that seems to want another file is reported, not obeyed |
| P2 | the `Classroom.gs` diff is inside the fence + the `VERSION` line | never moves a marker, never edits a comment outside the fence, never "fixes" anything below `// CONTENT END` |
| P3 | the gate surface digests identically and matches the ledger | leaves every §4.2 symbol and the ledger's `gateDigest` byte-identical; a mismatch at pre-flight is `BLOCKED — the ground moved`, reported for the developer |
| P4 | the stamp vocabulary is byte-identical, no `note` | writes stamps only in the nine existing prefixes; steers on developer notes without citing them |
| P5 | every id survives; registries and `lessons[]` are append-only | corrects in place under the same id, appends at the end, never removes, renames or reorders |
| P6 | every surviving lesson's derived gate is unchanged | admits no input that raises the gate, removes none that lowers it; new-gate material is a new lesson |
| P7 | pins monotone; `updated` moved; one revision appended; `changed[]` ⊆ section ids; `reviewBy` ≥ `updated` | re-pins only forward and only to observed dates; sets `updated` = run date; appends exactly one entry naming existing ids; sets `reviewBy` from the new material's gate |
| P8 | `changed[]` == the sections that differ | opens only the sections it revises, copies the rest byte for byte, and lists exactly those it opened; never lists a new section |
| P9 | a new briefing's id, edition and the watermark agree | `briefing-<runDate>`, `edition` = run date, `coveredThrough` = `edition`; no watermark move without a briefing |
| P10 | ≤ 1 briefing, ≤ 1 module, ≤ 3 revisions, ≤ 1 track, none twice | ranks and cuts at the caps, reporting the remainder as `Skipped at caps` |
| P11 | the public GAS changelog names no gated title and no ref | writes the generic lines only |
| P12 | `VERSION` and the version file moved together by one step | bumps both by 0.01 in the same write |

What no row covers — G2, G7, §5.2 — is the run's word, and the CHANGELOG record is where a developer checks it.

## Versioning and verification

- Content-only additions bump the **GAS** version ([PC-GS-VERSION] #1); renderer/UI changes also bump the **page** version ([PC-HTML-VERSION] #2). Public changelog entries stay generic ("curriculum updated") per `.claude/rules/changelog-security.md` — never name gated sources
- Before push: `python3 scripts/check-classroom-content.py` (schema + stamp truth table; a write without a clean pass is incomplete), `node --check` on a `.js` copy of `Classroom.gs`, and `node scripts/check-gas-inner-scripts.js`
- Also before push, when the change touches `Classroom.gs`, the ledger, or either checker: `python3 scripts/check-classroom-pipeline.py --base origin/main` (the diff-aware judge — on a developer commit its P1 write-set findings are expected noise, but **P3 is not**: a P3 mismatch means the gate digest needs refreshing per above) and `python3 scripts/check-classroom-pipeline.py --selftest` (the contract §7 fixtures — one positive, twelve negative; this must stay at zero failures)

Developed by: LightAISolutions
