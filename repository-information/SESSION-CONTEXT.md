# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-03 02:03 AM EST
**Repo version:** v04.39r (started at v04.34r — **six push commits**, plus this context write)
**Branch:** `claude/800-vdc-shift-lesson-av3l62` — every push merged to `main` by the auto-merge workflow, and the
branch was **restarted from `origin/main` before each of the last five commits** (`git checkout -B <branch>
origin/main`), because the previous push had already merged and the workflow had swept the branch. That is the
pattern to repeat: restart *before* making edits, so no intermediate commit is needed to get a clean tree.
**Model:** Opus 5 — an authoring session, by the standing decision that planning runs on Fable and authoring on Opus 5

**What we worked on — three lessons, a registry increment, and two corrections to the plan itself:**

- **`the-800-vdc-shift`** (`34edfe9`, v04.35r) — cut-line item 3, appended at position 4 of `aidc-grid-to-chip`.
  Eight sections across five kinds, 12 lesson-local glossary terms, five public inputs. Gate `tracks`.
  **The first commit in the sequence to return zero pipeline findings** — a pure append, exactly as predicted
- **`the-control-stack`** (`beb650a`, v04.36r) — cut-line item 4, appended at position 4 of `bess-foundations`.
  Eight sections across seven kinds, 15 glossary terms, five public inputs. Gate `tracks`. First commit to
  exercise a **mixed-gate track**: analyst sees 3 of 4 lessons with `withheld: 1`, because `spec-sheet-decoded`
  pins a `guidance:` input
- **`where-bess-plugs-in`** (`54d2084`, v04.37r) — cut-line item 5, appended at position 2 of `aidc-campus`.
  Eight sections across seven kinds, 11 glossary terms, six inputs (one `guidance`, five `public`). Gate
  **`guidance`** — the first in this sequence, and the commit that finally exercised **the strict half of the
  provenance fold**: analyst cannot read it and it is absent from their lesson index entirely
- **37 concepts added to the registry** (`b018487`, v04.38r), 75 → 112 entries, 334 insertions and **zero
  deletions**. Plus four stale rows corrected in `CLASSROOM-CURRICULUM-PLAN.md`
- **§6's gap register gained a `Status` column** (`e753963`, v04.39r), all twelve rows backfilled from checks run
  against the corpus: **1 closed, 1 partial, 8 open, 1 deferred, 1 by design**
- **Versions:** Classroom GAS `v01.13g` → `v01.14g` → `v01.15g` → `v01.16g`, each with `Classroomgs.version.txt`
  in the same commit. No page version moved all session — every change was GAS-side or data-side

**Where we left off:**

- **§7's first five are complete.** `the-fence-line` → `bridge-power` → `the-800-vdc-shift` (aidc-grid-to-chip,
  4 lessons) · `the-control-stack` (bess-foundations, 4) · `where-bess-plugs-in` (aidc-campus, 2). Curriculum is
  **10 lessons / 3 tracks** against the plan's 30 / 5
- **What remains on the cut line is the second wave**, opening with `redundancy-by-the-numbers` and
  `inside-the-rack` — positions 4 and 5 of `aidc-grid-to-chip`, deliberately skipped this session. **Three
  lessons written today refer forward to `inside-the-rack`** (twice from `the-800-vdc-shift`, once implicitly
  from `the-control-stack`), all phrased descriptively rather than by lesson id, so nothing dangles for a reader
  — but the promises are accumulating against it
- **The repo CHANGELOG is at 92/100.** Archive rotation is **mandatory** above 100, so roughly eight more push
  commits before it fires. Worth knowing before starting a run of small commits
- Five of the ten lessons still pin `concepts:profiler-concepts` at the stale **2026-08-31**; the five written
  today pin the real **2026-09-03**. **This is now a deliberate non-fix — see Key decisions**
- The earnings desk Routine (weekdays 13:00 UTC) and the weekly C2 pipeline (Wed 11:00 UTC) remain live and
  unreviewed across six sessions; neither was touched. Sessions D and E of `IMPROVEMENT-PLAN.md` not started

**Key decisions and positions taken:**

- **A closed gap that still reads as open is worse than an open one — it actively generates wrong
  recommendations.** §6's G1 had been closed since `5c66534` (v04.31r) and the register still said *do this
  first*. That produced a recommendation this session executed on a false premise. The fix was structural: a
  `Status` column, plus the rule that **a row is not closed until someone re-runs its check and dates it**. The
  same shape of defect will recur in any register without a status field — worth checking §5 and §7 for it
- **Check the concepts registry against its terms AND its aliases, never terms alone.** Six candidate terms
  (`automatic transfer switch`, `THD`, `total harmonic distortion`, `scale-out`, `minimum take`, `synthetic
  inertia`) already resolve through aliases. On a terms-only comparison G1 reads 31/34 closed; on a correct one
  it is **34/34**. This is now written into §8 note 4 as standing practice
- **A moved source does not justify a re-pin.** The recommendation to advance the five stale concepts pins was
  **dropped on reflection and deliberately not executed.** Advancing a pin asserts the lesson was authored
  against a document it was not; adding registry definitions contradicts nothing any lesson teaches, and because
  `{{term}}` resolves lesson-first it cannot even change what a reader sees. The contract's G3 rule — *a source
  that moved without contradicting anything leaves the lesson untouched, pin included* — is right here even
  though it formally binds only pipeline runs. Executing it would have needed five fabricated `revisions[]`
  entries or five contentless `updated` bumps
- **The registry promotion rule is now explicit and checkable**, rather than intuited: promote a term when it is
  defined locally in **two or more lessons**, or appears **at least five times** across the public corpus or the
  guidance modules. Two exception classes: one half of a pair whose other half qualifies (`energy battery` ↔
  `power battery`), and a regulatory identifier whose sibling is already present (`NOGRR 245` beside `NOGRR
  282`). Twelve candidates were excluded by that rule and stay lesson-local
- **The real cross-lesson glossary duplication was 5 terms, not the 38 claimed in a recommendation.** 94 local
  entries across 88 distinct terms; only `cycle life` (×3) and `black start`, `ride-through`, `state of charge`,
  `state of health` (×2) repeat. Measure before recommending
- **Fourteen deviations from the plan's §3.x outlines were reported before writing, across three lessons.** The
  pattern that generalises: the outline is a specification, the corpus is the authority, and where they
  disagree the corpus wins and the disagreement is stated in the CHANGELOG. The two most instructive —
  **(a)** `the-800-vdc-shift` carries **no `bars` section**, because its only chartable numbers come from two
  sources on two different bases (a single-phase `P = V·I` illustration against a real three-phase figure) and
  charting them together would manufacture a comparability neither source claims; **(b)** `where-bess-plugs-in`
  gained a `where-it-fails` section its §3.4 outline omits but §7 promises — **a contradiction inside the plan**,
  resolved in §7's favour only because the sources genuinely carry a dated set of *commercial* failure modes
- **"Anti-islanding" appears in the plan's §3.1 outline and in none of the four study guides that section pins.**
  A small factual gap in the plan itself, not just an authoring call — worth remembering if a later electrical
  lesson leans on the phrase
- **`reviewBy` is the material's own nearest dated gate, and this session produced the cleanest example yet.**
  `where-bess-plugs-in` carries **2026-12-10** because that is simultaneously the guidance module's own review
  date *and* the Batch Zero queue-repricing gate its timeline teaches — one event, not two facts that agree. The
  other two lessons took the ~6-month default and said why: their sources carry no forward dated gate at all
- **A registry-only or docs-only change bumps the repo version and nothing else** — no page version, no GAS
  version, no page changelog — per the convention `5c66534` established. Data is deployed, but it is not a page

**Active context:**

- Repo **v04.39r** · Classroom **v01.07w / v01.16g** · Profiler **v01.80w / v01.34g** · Scraper
  **v01.71w / v01.99g** — no page version moved this session
- Curriculum **10 lessons / 3 tracks**: `bess-foundations` 4, `aidc-grid-to-chip` 4, `aidc-campus` 1 + 1
  (`where-bess-plugs-in` is guidance-gated, so analysts see 1 of 2 there). Concepts registry at **112 entries**
- **The gate derivation has now been run against the real registries on both halves of the fold.** Analyst sees
  8 of 10 lessons; contributor and admin see 10; viewer sees none and is refused every track. Withheld counts:
  `bess-foundations` 1, `aidc-campus` 1, `aidc-grid-to-chip` 0
- Capacity: repo CHANGELOG **92/100**; `Classroomgs` changelog **16/50**
- `classroom-pipeline-ledger.json` untouched all session — `gateDigest`, `coveredThrough` and `lastRun`
  unchanged, and **no commit produced a P3 finding**, so the next pipeline run will not block
- Routines unchanged (6): earnings desk, C2 pipeline, daily ACL, monthly drift, quarterly guidance review,
  quarterly private sweep
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md empty
- **§8 note 11's open developer calls are down to one**: whether G5 (four utility dossiers) is worth commissioning
  before track 5's guidance lessons exist. The `aidc-power-primer` naming question and the G1-sequencing question
  are both closed

**Recommendation for next session:**

- **Author `inside-the-rack` on Opus 5** (`CLASSROOM-CURRICULUM-PLAN.md` §3.3, second wave), at position 4 of
  `aidc-grid-to-chip` — still a pure append, since position 5's `redundancy-by-the-numbers` is also unwritten.
  It is the right next lesson for a reason no other candidate has: **three lessons shipped today already refer
  forward to it** — the PSU-to-die walk, the 48 V busbar, the last centimetre and the periodic load swing were
  all explicitly deferred to it — so it is the only unwritten lesson the existing curriculum has made promises
  about. Its inputs (`study:delta-electronics`, `study:liteon`, `study:lambda`, `study:nvidia`, `study:megmeet`)
  are all present, and two of them were read in full this session.

**To continue:** type `author inside-the-rack from CLASSROOM-CURRICULUM-PLAN.md §3.3`

## Previous Sessions

### 2026-09-03 — `bridge-power` + the §2.2 track cut (v04.34r)

**Date:** 2026-09-03 12:10:00 AM EST
**Repo version:** v04.34r (started at v04.32r — two push commits, plus this context write)
**Branch:** `claude/bridge-power-lesson-oajbui` (both pushes merged to `main` by the auto-merge workflow)
**Model:** Opus 5 — an authoring session, by the standing decision that planning runs on Fable and authoring on Opus 5

**What we worked on — two commits: `bridge-power`, then the §2.2 track cut:**

- **Authored `clLessonBridgePower_()`** (`8f557e2`, v04.33r) inside the `// CONTENT START` … `// CONTENT END`
  fence in `googleAppsScripts/Classroom/Classroom.gs`, at position 2 of `aidc-grid-to-chip`. **Nine sections
  across seven kinds** — `why-a-campus-builds-a-power-plant` (prose) · `ways-to-eat-the-same-gas` (proscons,
  four cards) · `fuel-in-electricity-out` (bars) · `the-turbine-queue` (prose) · `prime-backup-n-plus-one`
  (callout) · `four-campuses` (table) · `where-it-fails` (callout, `tone: warn`) · `drill` (6 flashcards) ·
  `check-yourself` (5 quiz items). No two of a kind adjacent; `sales` on four of seven teaching sections
- **Nineteen public inputs, every pin read off the document fetched that session** (G2), every ref resolved
  before writing (G7): seven study guides (`kiewit@2026-08-21`, `wartsila@2026-08-08`,
  `bloom-energy@2026-08-21`, `vantage@2026-08-21`, `crusoe@2026-08-21`, `xai@2026-08-21`,
  `primoris@2026-08-21`), seven dossiers (`voltagrid`, `proenergy`, `enchanted-rock`, `mainspring-energy`,
  `kiewit`, `bloom-energy`, `stack-infrastructure`, all `@2026-08-30`), four projects (`frontier`,
  `jupiter-nm`, `colossus`, `homer-city`, all `@2026-09-02`) and `concepts:profiler-concepts@2026-09-03`.
  Folds to **`tracks`** — analyst and up. **Fifteen lesson-local glossary entries**
- **Executed the plan's §2.2 track cut** (`ddd7c5f`, v04.34r): `the-aidc-power-chain` moved to position 3 of
  `aidc-grid-to-chip`; **`aidc-power-primer` retired, not renamed**; `clTrackAidcCampus_()` created in the
  same commit holding `heat-is-the-constraint` at position 1, with the curriculum's **first `prereqs[]`**
  (`["aidc-grid-to-chip"]`). `clLessons_()` needed **no edit** — registry order already equalled the new
  teaching order. Also corrected a stale header comment ("Five public-stamped modules" → "Six")
- **Verified both commits:** `check-classroom-content.py` — 7 lessons, 3 tracks, 134 gate cases,
  **0 errors / 0 warnings** each time. `check-classroom-pipeline.py --base origin/main` — v04.33r: **1
  finding, P5** on the lesson-registry insertion; v04.34r: **2 findings, both P5** (`track
  'aidc-power-primer' disappeared`, `clTracks_() not append-only`). **No P1, no P3 either time**, so
  `gateDigest` was correctly never touched. `--selftest` 13/0 both times; `node --check` and
  `check-gas-inner-scripts.js` clean. **The gate derivation was run against the real registries**, not the
  checker's fixtures, on both commits
- **Versions:** Classroom GAS `v01.11g` → `v01.12g` → `v01.13g`, each with `Classroomgs.version.txt` in the
  same commit and a generic public changelog entry naming no title, ref or company

**Where we left off:**

- **`aidc-grid-to-chip` holds 3 of its 8 planned lessons** in plan order — `the-fence-line` → `bridge-power`
  → `the-aidc-power-chain` — and its `short` describes the walk as it now reads end to end.
  **`aidc-campus` holds 1 of 4** (`heat-is-the-constraint`), with its prereq attached
- **The next cut-line item is `the-800-vdc-shift`** (§7 item 3), which lands at **position 6** of
  `aidc-grid-to-chip`. Positions 4 and 5 (`redundancy-by-the-numbers`, `inside-the-rack`) are second-wave,
  so it is appended to the end of the current `lessons[]` — **append-only, no reorder, so it should be the
  first commit in this sequence to produce zero P5 findings**
- **The retired track id `aidc-power-primer` must never be reused** (plan §4 item 2). Asking for it now
  answers `UNKNOWN_TRACK`, which was verified rather than assumed
- The five pre-existing lessons still pin `concepts:profiler-concepts` at the stale **`2026-08-31`** —
  untouched again, still a one-line correction whenever the developer wants it
- The earnings desk Routine (weekdays 13:00 UTC) and the weekly C2 pipeline (Wed 11:00 UTC) remain live and
  unreviewed across five sessions; neither was touched. Sessions D and E of `IMPROVEMENT-PLAN.md` not started

**Key decisions and positions taken:**

- **`aidc-power-primer` was retired rather than retitled, and the reasoning is the one that generalises.**
  The retitle was the conservative option and §2.2 explicitly allows it. It was rejected because the only
  thing a permanent track id protects is progress keyed on it — and Classroom keys progress on **lesson id
  + section id, never on track id**, so the rollup is reconstructed from the lessons wherever they sit.
  **Had track-level progress been stored, or had any analyst account existed, the retitle would have been
  correct.** The removal was surfaced in chat before it was made, per the Chesterton's Fence gate
- **Retiring a track and creating its replacement must happen in one commit**, so no registered lesson is
  ever in no track. A lesson outside every track still appears in the lesson index (`clLessonIndexFor_`
  walks the lesson registry, not the tracks), so that failure would have been quiet rather than visible
- **Three §3.3 deviations on `bridge-power`, all reported before writing.** (a) `three-ways-to-eat-the-same-gas`
  became **four** ways with a count-free id `ways-to-eat-the-same-gas` — the Mainspring dossier positions the
  linear generator as an explicit fourth category, and teaching three while pinning that dossier would have
  made the pin ornamental. (b) `four-campuses` **lost its "grid posture" column** — stated for only two of
  four rows; it became "who builds and supplies it" and the two known postures moved to the `note`, which
  says plainly the other two are not stated. (c) `where-it-fails` carries §5 row 4 in full but only the
  **paralleling half** of row 5 — the transfer-switch specifics belong to `study:eaton` / `study:rosendin`
  and to `the-aidc-power-chain`, so the section names them as the next lesson's material instead
- **One section was added that the outline omits** — a `bars` on the efficiency ladder, with four
  source-stated figures. **The fuel cell is deliberately absent from that chart**: its guide gives
  efficiency as a relationship ("nearly scale-free"), not a class figure, and §8 note 6 forbids inventing
  the proportion. The `note` says so. **This is the pattern for `bars` under note 6**
- **`reviewBy` is `2026-12-31` — a real dated gate, not the ~6-month default**, unlike `the-fence-line`.
  Frontier's first building (H2 2026) and Project Jupiter's initial operations (Q4 2026) both close on that
  date, and both are taught in `four-campuses`, so two flagship rows change state when they land
- **The sales lines were written to what the sources actually say, which is uncomfortable.** All four pinned
  supplier dossiers describe platforms with no storage in the product line, and one advertises prime power
  with "zero reliance on battery storage". So the lesson teaches that this cohort is where storage is being
  **designed out**, and that the openings are narrow and specific — the bring-up, the transient/ride-through
  duty, and the conversion at the end of a bridge. "A battery rides along" was the comfortable read and the
  wrong one
- **Three inputs the plan's §3.3 list does not name were added** because the lesson genuinely drew on them:
  `profile:kiewit`, `profile:bloom-energy`, `profile:stack-infrastructure`. The plan's own list would have
  left two of the four campus rows unsourced. **The plan is a specification; the corpus is the authority**

**Active context:**

- Repo **v04.34r** · Classroom **v01.07w / v01.13g** · Profiler **v01.80w / v01.34g** · Scraper
  **v01.71w / v01.99g** — no page version moved this session (content-only, GAS side)
- Curriculum now **7 lessons / 3 tracks** (`bess-foundations` 3, `aidc-grid-to-chip` 3, `aidc-campus` 1);
  the plan proposes 30 / 5. Concepts registry unchanged at 75 entries
- Capacity: repo CHANGELOG **87/100**; `Classroomgs` changelog **13/50**
- `classroom-pipeline-ledger.json` untouched — `gateDigest`, `coveredThrough` and `lastRun` all unchanged
- Routines unchanged (6): earnings desk, C2 pipeline, daily ACL, monthly drift, quarterly guidance review,
  quarterly private sweep
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md empty
- Plan §8 item 11's open developer calls are now **two**, not three: G5 (four utility dossiers) and whether
  G1's second wave should precede the remaining cut-line lessons. The `aidc-power-primer` naming question
  is **closed**

**Recommendation for next session:**

- **Author `the-800-vdc-shift` on Opus 5** (`CLASSROOM-CURRICULUM-PLAN.md` §3.3, cut-line item 3), appended
  to the end of `aidc-grid-to-chip`'s `lessons[]`. It is the topic every customer conversation drifts to,
  `study:zhonhen` and `study:megmeet` carry the whole public thesis between them, and — because positions 4
  and 5 are second-wave — it is a pure append that needs no registry reorder, making it the first commit in
  this sequence that should come back with **zero P5 findings**. Its `bars`/`table` split is the live
  judgement call: the three-chain comparison has stated stage counts and efficiency bands, but "the new
  boxes" gives shape without figures and must be a `table` under §8 note 6.

**To continue:** type `author the-800-vdc-shift from CLASSROOM-CURRICULUM-PLAN.md §3.3`
