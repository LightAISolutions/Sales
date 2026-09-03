# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-03 02:29 AM EST
**Repo version:** v04.40r (started at v04.39r — one push commit, this one)
**Branch:** `claude/profiler-coverage-gaps-sg0mzu` — clean against `origin/main` at commit time; the branch did not exist on the remote, so no rebase and no restart were needed
**Model:** Fable 5.1 — a planning session, by the standing decision that planning runs on Fable and authoring on Opus 5. **That decision is now refined for dossier work** — see Key decisions

**What we worked on — a coverage analysis, an approved roster, and the plan file that carries it:**

- **Analyzed Profiler's coverage against Classroom's gap register** (`CLASSROOM-CURRICULUM-PLAN.md` §6, the twelve rows with the new `Status` column). Coverage stood at 89 dossiers / 62 study guides. Three structural findings the register did not state: the nine `ipp` dossiers — the entire BESS buyer side — carry **zero** study guides; the `investor` and `advisor` categories exist in the schema and have never held a company; there is no `utility` category at all
- **Counted corpus mentions of uncovered companies** across every dossier and guide, which is the strongest evidence of an ecosystem gap and surfaced names the register never listed: Digital Realty (13 docs), Blackstone (12), AEP (11 dossiers + 25 guidance hits), Anthropic (10 docs, 97 hits), MGX (10), Fluidstack (6), Intersect Power (6), Mitsubishi Power (6). Powin (13 docs) tops the list and is deliberately excluded — defunct, told inside FlexGen's dossier, excluded by the earlier v02.91r plan too
- **Recommended 65 companies in six tiers plus 30 study-guide passes**; the developer **approved all tiers** and chose to run the program by model — every Fable 5.1 xhigh session first, then Fable 5.1 High, then Opus 5 xhigh — and to return to the Classroom build only after the whole roster lands
- **Wrote `repository-information/PROFILER-COVERAGE-PLAN.md`** — the plan reorganized into that order: §2 model rule, §3 Phase A (4 anchors), §4 Phase B (29), §5 Phase C (32 + 30 guides), §6 Phase D (back to Classroom), §7 per-session bookkeeping and the paste-in prompt template, §8 the status ledger every session flips

**Where we left off:**

- **Nothing in Profiler has been built yet.** The plan is committed; the first dossier session is the developer's next action. Order: **A1 Caterpillar → A2 Piller → A3 Dominion → A4 Vicor** on Fable 5.1 xhigh, each as `profiler <Company>` + `profiler prep <Company>` in one commit; then Phase B (B1–B10) on Fable 5.1 High; then Phase C (C1–C12 plus the guide revisions and the 27 backfills) on Opus 5 xhigh; then Phase D
- **Session A3 (Dominion) carries a page change**: the `utility` category must be added to `profiler-companies.json`'s `categories`, PROFILER-SCHEMA.md, and `Profiler.html` (chip label, `.ov-tag` colour, `known` list, compare peer groups, `OV_REL_CAT_COLORS`) — a Profiler page version bump, the only page change in the program
- **The repo CHANGELOG is at 93/100.** Archive rotation fires above 100 — roughly seven pushes out, i.e. inside Phase B. Whoever lands that push does the rotation in the same commit
- The Classroom cut line (`redundancy-by-the-numbers`, `inside-the-rack`, the second wave) is **paused by the developer's decision** until Phase D. The earnings desk Routine and the weekly C2 pipeline remain live and unreviewed; sessions D and E of `IMPROVEMENT-PLAN.md` not started

**Key decisions and positions taken:**

- **Dossier work has its own model rule, layered on the standing decision.** Fable 5.1 xhigh only for the four anchors a future lesson will pin, as dossier + guide in one session; Fable 5.1 High for private/opaque subjects and the utilities (regulatory synthesis); Opus 5 xhigh for public companies with deep first-party records and for every study-guide pass on an existing dossier. Stated as judgment, not measurement — the repo has never compared dossier quality by model, and Phase A doubles as the test: if Caterpillar's guide on xhigh reads no better than High, demote A2–A4 before running them
- **Every company is a pair.** Classroom pins study guides, not dossiers, for equipment lessons (the §5 failure map is built from guides only). A dossier without a prep pass adds nothing to Classroom, so the plan never schedules one without the other, and the backfill of existing dossiers starts with the nine IPPs because the buyer side has no guides at all
- **Phase-end, not session-end, register checks.** A row in §6 is not closed until someone re-runs its check and dates it (last session's rule). The plan schedules that at the end of each phase and again in Phase D, and keeps the §8 ledger as the per-session record so the two never substitute for each other
- **Powin, Broad Reach, Boyd, Motivair, Prolec, Cupertino Electric and Calpine stay uncovered** — each is already told inside a covered parent's dossier. Wood Mackenzie and BNEF are ranking sources, not counterparties

**Active context:** `TEMPLATE_DEPLOY` Off · `MULTI_SESSION_MODE` Off · `CHAT_BOOKENDS` Off · Profiler `v01.80w` / `v01.33g` · Classroom `v01.07w` / `v01.16g` · concepts registry 112 entries · CHANGELOG 93/100 · no active reminders · TODO empty

**Recommendation for next session:**

- **Run Phase A1 — Caterpillar — on Fable 5.1 xhigh**, as a fresh session: `profiler Caterpillar` then `profiler prep Caterpillar`, one push commit, per `PROFILER-COVERAGE-PLAN.md` §3 and §7. It closes G2's first half, anchors the `backup-generation` lesson, and is the cheapest test of whether xhigh earns its cost over High on a dossier + guide pair before A2–A4 spend it.
**To continue:** type `run Phase A1 of PROFILER-COVERAGE-PLAN.md — Caterpillar — on Fable 5.1 xhigh`

## Previous Sessions

### 2026-09-03 — the second cut-line wave: `the-800-vdc-shift`, `the-control-stack`, `where-bess-plugs-in` + the §6 Status column (v04.39r)

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
