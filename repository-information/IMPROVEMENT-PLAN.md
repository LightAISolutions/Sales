# Improvement Plan — Profiler · Scraper · Classroom

**Provenance.** Written 2026-09-02 in a research-only session from a full read of the three apps at repo **v04.24r**: `Profiler.html` / `Profiler.gs`, `Scraper.html` / `Scraper.gs`, `Classroom.html` / `Classroom.gs`, the four rules files (`profiler-app`, `scraper-sources`, `classroom-app`, `industry-guidance`), `PROFILER-SCHEMA.md`, `CLASSROOM-SCHEMA.md`, `PHASE6-CLASSROOM-DESIGN.md`, `CLASSROOM-COMMITTER-CONTRACT.md`, `PROFILER-STYLES.md`, the three brochures, every file under `live-site-pages/profiler-data/`, the pipeline ledger, the auto-merge workflow, and the live Routine inventory (27 active, 33 completed — prompts included). Every number below was measured from those files, not recalled. Nothing in the repo was changed by the session that wrote this.

**How to use this document.** It is written for a fresh build session to start from without asking questions. Read §1 (the diagnosis) once; then take proposals in the order given — §2 holds the three I would stake my reputation on, §3 the second tier, §4 the things to stop or rip out. Each proposal states **what** it is, **why** it is worth the operator's time, **what it touches**, **what has to be true** for it to work, and **how to verify** it. §6 is the register of every place a proposal collides with a rule or a recorded decision — read it before building anything, because several of these proposals argue that ground already walked should be walked again, and the argument has to be made explicitly, never by accident. §7 turns the whole thing into a session order. §8 lists what I examined and would leave alone.

## 0. Ground truth at v04.24r

Measured 2026-09-02 from the working tree and the Routine API. These are the facts the proposals stand on; if a build session finds one has moved, re-check the proposal that cites it.

| Layer | Fact |
|---|---|
| Dossiers | **89** profiles (86 at schema v7, 3 at v6), ~33 KB each, ~3 MB of JSON. **All 89 read "fresh" (≤45 d)** because every one was revised 2026-08-30 in a mass pass. 996 `recentDevelopments` (newest 2026-08-28), 497 curated relationships (every dossier curates), 60 carry `policyExposure[]`, 42 carry a normalized revenue KPI, median first-party share 50 % |
| Archive | 193 archived versions across 89 slugs; `archive-index.json` complete. Versions are viewable one at a time; **no diff view exists** |
| Study guides | **62** (27 covered companies have none). All at v2 by the mechanical lift of 2026-08-30 — 384 sections, **802 flashcards, 0 quiz sections**; `lastUpdated` 2026-08-07 → 08-22, so none was authored on the v2 vocabulary |
| Graph / registries | 490 edges (384 curated, 106 derived-only), built 2026-09-02. 8 named projects. 44 concepts |
| Guidance / reports | 7 modules in `Profiler.gs` (7 quiz + 7 flashcard sections, ~106 items). 4 reports, 22 dated `indicators[]`, 8 admin-lens overlays |
| Classroom | 2 tracks, 5 lessons (53 quiz/flashcard items), 0 briefings. Ledger `coveredThrough` 2026-09-01, `lastRun: null`. The **first pipeline run fires 2026-09-02 11:06 UTC** — after this document was written |
| Progress stores | Profiler `gd_progress:<acct>` and Classroom `cl_progress:<acct>` both store `{doc:{section:true}}` — **booleans, no completion date** |
| Scraper | 35 outlets (17 tier 1 incl. 5 primary federal feeds), 29 segment seeds, 24 topic seeds, 2 daily editions, corpus route live with stable item keys. The digest footer already carries a "Newly covered — Profiler added N companies" box. `SCRAPER_FEEDBACK_UI_ENABLED = false` (D3, 2026-08-27) |
| Routines (active) | 27: **21 one-shot post-earnings refreshes** (2026-10-15 → 11-25, armed 08-07 → 08-22), quarterly private sweep, monthly opportunity-report drift check, quarterly guidance review, daily ACL health check, weekly C2 pipeline |
| Routines (completed) | **7 August post-earnings refreshes fired** — Sinexcel 08-12, EVE 08-21, NVIDIA 08-27, Jinko 08-28, Sungrow 08-30, BYD 08-30 `SUCCEEDED`; **IREN 08-28 `ABANDONED`**. **None re-armed a successor.** `REMINDERS.md` holds no re-arm reminder. `profiler-app.md` still lists all seven as "currently armed" for August |
| Routine prompts | **0 of 21** armed refresh prompts mention the Scraper corpus bridge (they predate it). The Tesla prompt — representative — says "write the refreshed schema-v2 profile" (schema is v7) and "mirror the archived file to bess-aidc-library via add_repo" (the rules now say sessions do **not** attach the library repo). The C2 prompt states **"CORPUS TOKEN: none is supplied"** |
| Velocity | v03.80r (08-29 22:28) → v04.24r (09-02 03:52): **44 push commits in four days** |

Two consequences of the last five rows, stated plainly because the rest of the document leans on them:

1. **The self-re-arming refresh chain has failed 7 for 7.** The brochure's "staying current without being asked" is true only for the 21 triggers armed by hand in August. When those fire in October and November, the same chain runs again.
2. **Both designed news seams — Scraper → Profiler (news triage at refresh) and Scraper → Classroom (`corpus:` inputs) — are switched off in every scheduled session that would use them.** The code is finished on both sides; the switch is a token that lives only in Routine prompts, and no prompt carries it.

## 1. Diagnosis — what this is really trying to do, and what is standing in the way

**What it is trying to do.** One person is trying to reach genuine mastery of a market — deep enough to sell into it — by building a corpus that is (a) uniformly structured so companies can be compared, (b) kept current by the market's own clock rather than by memory, and (c) turned into retained knowledge rather than reference material. The three apps map onto (a), (b) and (c) respectively, and the brochures describe that loop as "Profiler is the skeleton, Scraper is the blood, Classroom is the institution."

**The loop as designed versus the loop as wired.** Reading the code rather than the brochures, the seams look like this:

| Seam | Mechanism | State at v04.24r |
|---|---|---|
| Profiler → Scraper | registry sync → Interests rows; dossier mining → aliases + segments; guidance/project seeds | **Live.** Daily, automatic, self-healing |
| Scraper → Profiler (reader) | Coverage 📰 panel via the token-gated corpus proxy | **Live** for contributor+ |
| Scraper → Profiler (corpus) | news triage inside every dossier refresh; edge candidates → curated relationships → graph reconcile | **Wired, switched off** — no refresh prompt carries the token |
| Profiler → Classroom | provenance pins on dossiers, study guides, graph, concepts, projects; the pipeline re-reads them weekly | **Live** (first run today) |
| Scraper → Classroom | `corpus:<key>` provenance inputs | **Wired, switched off** — the C2 Routine supplies no token by decision |
| Classroom → reader | tracks, study-next, per-section ticks, revision notes | **Live**, but the per-account "what changed since you learned this" delta the schema promises **cannot be computed** — the store has no dates |
| Classroom → retention | flashcards / quizzes as sections | **Tap-to-flip only.** No scheduling, no history, no recall |
| Field notes → anything unattended | confidence-weighted steering of research, triage at every refresh | **Off by construction** since M3 — unattended sessions cannot read notes |

Five observations follow.

**1. The system over-produces and under-retains.** Roughly thirty hours of static reading already exists (dossiers alone are ~250k words), it grows on every refresh, and the only retention mechanism anywhere is a flashcard that flips when tapped. The binding constraint is the operator's reading and deciding time. Every proposal that adds a surface, a report type or a tab spends that constraint; the proposals that pay it back are the ones that let the operator *not* re-read (deltas) and *not* forget (retention). Classroom's C4 — the drill queue — is the single feature that converts the corpus into the stated goal, and it is scheduled after a relocation phase (C3) that adds no capability.

**2. The freshness machinery has a silent single point of failure, and it has already failed.** Seven one-shot refreshes fired in August; none produced the next one-shot, none left the reminder the rules prescribe as the fallback, one was abandoned with no repo trace, and the rules file still lists all seven as armed. The design put procedure (a 2,000-character prompt) and a secret (the corpus token) inside 21 opaque trigger records that nothing in the repo can see, diff, or check. The prompts have drifted several schema generations behind the rules. This is the one operational item I would fix before anything else, because when the October cohort fires the same thing happens 21 more times.

**3. "What changed" exists as data, not as a reading experience.** Profiler keeps every superseded version and shows them one at a time. Classroom designed the right thing — `revisions[].changed[]` against per-account completion — but implemented booleans where the schema says dates, so the delta the whole freshness discipline exists to surface never renders. For an operator who cannot re-read 89 dossiers, a "changed since you last read it" signal is worth more than any new section.

**4. The one first-party signal is quarantined to the point of inertness for the sessions that do the work.** Field notes are correctly barred from ever becoming a source or a lesson. But the rules also say every dossier refresh weighs pending notes and that 75–100-confidence notes *steer research* — and since M3 no scheduled refresh, sweep, or report can read a note. Twenty-one refreshes will run this autumn with none of the developer's own judgment in them. The corpus-token pattern adopted three weeks after M3 shows a route that respects the privacy decision (the repo never holds the notes) while letting a scheduled session read them.

**5. Operator time is going into machinery velocity.** Forty-four pushes in four days, on top of a corpus that is now complete and uniformly fresh. That pace built something genuinely good, and it is also the reason the flashcards are unscheduled, the deltas unrendered and the seams unswitched: each is a consumption feature, and production has been winning. The plan below is deliberately weighted toward consumption and toward switching on what already exists, and §4 proposes a period in which nothing new is built on the production side.

## 2. The three I would stake my reputation on

Ordered by leverage. If only one is built, build P1; if the sequence matters, build P3 first because it is small, operational, and stops a failure that is already happening.

### P1 — Build the retention loop now: pull C4 ahead of C3

**What.** A spaced-repetition drill in Classroom over every recall item the corpus already holds, with a daily "due today" card as the app's landing element, and — as a prerequisite — completion **dates** in both progress stores so the schema-promised "changed since you learned this" delta finally renders.

- **Item universe at v1.** The 802 study-guide flashcards (public Pages JSON — `Classroom.html` fetches `profiler-data/<slug>.study.json` directly, same origin, no new route) plus the 53 lesson quiz/flashcard items (already served through the gated `cop=lesson`). Guidance items (~106) join at C3 when the modules move — do **not** build an interim route for them (decision 6 of the design gate stands). That is ~855 items on day one, growing with every prep pack and lesson.
- **Item identity.** `<ref>#<sectionId>#<n>` — `study:sungrow#the-physics-toolkit#2`, `lesson:cell-to-container#check#0` — plus a short content hash. Section ids are permanent by schema, so the id is stable; the hash detects a reworded card and resets that item's history rather than drilling a stale answer. Quiz items (`q`/`c`/`a`/`why`) and flashcards (`q`/`a`) are both drillable; the drill shows the card face, the reader grades recall.
- **Gate.** An item inherits its source's gate exactly as a lesson does: study items fold to `tracks` (every admitted tier), lesson items to the lesson's stamp via `clLessonVisible_`. The due queue is filtered server-side by the same fold — a tier that cannot open a lesson never sees its cards. This is the existing rule, not a new one.
- **Scheduler.** SM-2 (interval, ease, repetitions, lapses) — it needs no library, is well understood, and is good enough for a one-operator deck; FSRS can replace it later without changing storage. Four grades (again / hard / good / easy). Introduce at most ~10 new items per day so the 855-item backlog arrives over three months rather than in one wall; cap a session at ~20 reviews so "ten minutes" stays true.
- **Storage.** The design gate already says drill history outgrows the 9 KB property pattern and expects a sheet-backed store. Use a `ClassroomDrill` tab in the spreadsheet Classroom already owns (`SPREADSHEET_ID` is shared with Profiler — prefix the tab name), one row per `(acct, itemId)`: `acct, itemId, hash, due, interval, ease, reps, lapses, lastGrade, lastAt`. Read the account's rows once per session (one `getValues`), write back in one `setValues` at session end plus a per-grade append to a small `ClassroomDrillLog` for recovery — GAS quota is not a concern at one operator's volume, but batching keeps the drill snappy.
- **Surface.** Classroom index: a card above study-next — "**Today** · 14 due · ~7 min · Start" — and a `#drill` route with the card, the grade buttons, and a "source" link back to the lesson section or study guide. Nothing about lessons or tracks changes.
- **Completion dates (prerequisite, and independently valuable).** Change both progress stores from `{sec: true}` to `{sec: "YYYY-MM-DD"}` (`clProgressWrite_` / `clProgressVisible_` / `clProgressRead_` in Classroom; `gdProgressWrite_` in Profiler), migrating an existing `true` to the date of the migration commit. Then render, per account, every revision whose `changed[]` names a section the account completed **before** the revision date — a "changed since you read it" badge on the section and on the index row. This is the hook `CLASSROOM-SCHEMA.md` (Freshness) describes and the code does not implement; the pipeline's `changed[]` discipline is worth nothing to the reader until it exists.

**Why.** The purpose of the whole system is mastery, and mastery is retention plus currency. Retention is the least-built layer by a wide margin: the flashcards exist, the quizzes exist, the section vocabulary carries them across all three content channels, and nothing schedules a single one. A ten-minute daily drill is the highest-yield ten minutes available to this operator, and — unlike every other proposal — it *reduces* the reading budget rather than spending it, because a fact drilled is a dossier section that need not be re-read.

**Touches.** `Classroom.gs` (new ops `cop=drill|grade` in the PROJECT region *outside* the content fence; progress-store change; the `ClassroomDrill` tab ensure function), `Classroom.html` (drill route, landing card, changed-since-read badges), `Profiler.gs` + `Profiler.html` (progress dates, badge on study guides), `CLASSROOM-SCHEMA.md` (new "Drill item identity and history" section; the Freshness paragraph updated to match the code), `PHASE6-CLASSROOM-DESIGN.md` (C4 status, reordered), `scripts/check-classroom-content.py` (no change to lesson shapes; optionally assert drill-item ids resolve), and — because `handleClassroomOp_` and the progress symbols are on the 32-symbol gate surface — **`classroom-pipeline-ledger.json`'s `gateDigest` refreshed in the same commit** per `classroom-app.md`. Page + GAS version bumps for both apps.

**Must be true.** (1) The `GATE_SYMBOLS` digest procedure is followed or the next pipeline run blocks on "the ground moved". (2) `clProgressValid_`'s invariant — progress is never a weaker gate than reading — is preserved by the date change (validation logic identical, only the stored value type changes). (3) The Sheets store is per-account-first so C6's team layer can read it without a migration. (4) Study-guide fetches from `Classroom.html` honour `cache: no-store` like Profiler's, so a regenerated guide re-hashes.

**Verify.** `check-classroom-content.py` clean; `check-classroom-pipeline.py --selftest` still 13/13; `--base origin/main` shows P1 write-set findings only (expected on a developer commit) and **no P3 finding**; Playwright: sign in as admin, complete a section, land a pipeline-style revision naming it (fixture), see the badge; drill 20 cards, reload, see intervals persisted; `?as=analyst` never receives a card from `spec-sheet-decoded`.

### P2 — Deltas, not documents: Profiler adopts Classroom's revision discipline

**What.** Three layers, shippable independently, cheapest first.

- **(a) Computed "What changed" on every dossier — zero authoring.** When a dossier with an archive entry opens, fetch its previous version (public JSON, already reachable — the Versions overlay does it) and diff the structured fields: `recentDevelopments[]` added (by date + headline), `financials.periods[]` added or with changed metrics, `relationships[]` added or re-typed, `policyExposure[]` added, `productsAndServices[]` names added, `decisionMakers[]` names added or removed, and a flag (not a diff) when `summary`, `ecosystemRole` or `strategyRead` text changed. Render a collapsible strip under the header: "**Changed in v6** (2026-08-30) — 3 developments · 1 financial period · 2 relationships · strategy read revised", expanding to the dated items. Mass passes like 2026-08-30 will produce dense strips; keep the strip to counts plus dated items so it stays readable.
- **(b) A per-account "read" stamp.** Profiler already has a per-account server progress store for guidance and study docs. Accept a `dossier-<slug>` doc id with `{ read: "YYYY-MM-DD", seen: "<lastUpdated>" }`, written by an explicit **"Mark as read"** control (opening a dossier is not reading it). The roster card then shows "revised since you read it" when `lastUpdated > seen`, and the dossier's changed-strip compares against the version the reader actually saw, not merely the previous one. Tiers without the guidance role keep the same localStorage fallback study progress uses.
- **(c) An authored `revisions[]` entry — schema v8, optional, opportunistic.** `{ "date", "version", "note", "changed": ["recentDevelopments", "financials", …] }`, written by the Profiler Command on every revision (the refresh session already knows what moved — it archived the previous version). One line of "what moved and so what", rendered at the top of the changed-strip. Additive under "Extending the schema"; older dossiers simply lack it. Second consumers: the Classroom pipeline's G3 test ("section teaches X; ref now says Y") gets a dossier-stated list of what moved before it diffs prose, and the report coverage badge ("dossier since revised") gains a reason.

**Why.** The operator will read a dossier once and never again; 89 × 33 KB guarantees it. Deltas are the only reading model that scales with the refresh cadence the system is about to run (21 refreshes in six weeks). Classroom already committed to this discipline — permanent ids, `changed[]`, revision notes — for five lessons; the same discipline is missing on the ~3 MB corpus that matters most. Layer (a) costs one page version and no session work at all.

**Touches.** `Profiler.html` (diff, strip, mark-as-read, roster badge — page bump), `Profiler.gs` (`gdProgressWrite_` accepts `dossier-<slug>` with the registry-slug containment check study docs already use — GAS bump), `PROFILER-SCHEMA.md` (v8 `revisions[]`, "Registry revision signals" unchanged), `profiler-app.md` (Profiler Command step 4: write the revisions entry; step 8 standard treatment unaffected), the earnings-desk prompt from P3 (so scheduled refreshes write it).

**Must be true.** `archive-index.json` stays complete on every revision (it is today: 193 entries) — the Archival Procedure already requires it. The diff is over structured fields only; never attempt prose diffs in the browser.

**Verify.** Open `sinexcel` (v6, four archived versions): strip lists the 08-30 changes; mark as read; roster shows no badge; hand-edit `lastUpdated` in a local copy → badge appears. `sync-profiler-registry.py --check` still clean (no denormalized field added). `check-profiler-reports.py` unaffected.

### P3 — One earnings desk instead of 21 one-shots, and switch the news bridge on

**What.** Replace the per-company one-shot Routines with **one recurring Routine driven by a calendar file in the repo**, amend the prompt once, and retire the hand-armed triggers after seeding the calendar from them.

- **`repository-information/profiler-refresh-calendar.json`** — one row per covered public company: `{ "slug", "nextReport": "YYYY-MM-DD", "confirmed": true|false, "source": "<url or note>", "lastRefreshed": "YYYY-MM-DD", "watch": ["…"] }`, plus rows with `"cadence": "quarterly"` for the 21 private companies so the quarterly sweep can fold in later if wanted. Seed it from the 21 armed prompts (their dates, confirmation status and per-company watch items are all in the prompt text) and the seven fired ones (research their next dates).
- **Routine "Profiler earnings desk"** — weekdays 13:00 UTC, fresh session, `notifications: { push, email }`. The run: read the calendar → for every row with `nextReport ≤ yesterday`: verify the report actually published (the existing step 1) → run the Profiler Command end to end **including news triage** (the token is in this one prompt) and note triage if S1 lands → research and write the next `nextReport` → single push commit; for rows unconfirmed and within seven days, confirm the date and update the row; when nothing is due, **stand down silently, no commit** (the drift-check precedent). Cap at three companies per run with carry-over so a session stays bounded; the old two-hour stagger existed to keep parallel sessions from colliding, and one serial session removes the reason for it.
- **The prompt.** Short: identity, calendar path, "follow `.claude/rules/profiler-app.md` end to end", the corpus token (and the notes token once S1 exists), the cap, the stand-down rule, the report shape. Nothing procedural that the rules already say — the drift of the current prompts ("schema-v2", `add_repo` mirroring) is what happens when procedure is copied into 21 places.
- **Retire** the 21 one-shots once the calendar carries their dates; leave the quarterly private sweep and the monthly drift check as they are (both already run the stand-down pattern). Rewrite the "Scheduled Refreshes" section of `profiler-app.md` to point at the calendar; delete the "Currently armed" list, which is already wrong.

**Why.** The evidence in §0: seven fired, zero re-armed, zero reminders, one abandoned with no trace, and prompts that no longer describe the command they invoke. The chain's failure mode is silent by construction — a one-shot that fires and does not re-arm leaves no artefact anywhere the repo or the rules can see. A calendar in the repo is diffable, appears in the CHANGELOG when it moves, is readable by the roster (the freshness dot can say "reports in 9 days"), and puts the token and the procedure in exactly one place. It keeps the property the convention was designed for — refreshes fire on the market's clock, not the operator's — and drops the part that broke.

**Touches.** No app code. The calendar file (new), the Routine (create one, update none, delete 21 after seeding), `profiler-app.md` ("Scheduled Refreshes" rewritten; "News Triage" unchanged), `README.md` tree entry for the new file, CHANGELOG. Optionally `Profiler.html` reads the calendar for a "reports in N days" hint on the roster — a later, separate page bump.

**Must be true.** (1) The developer pastes `CORPUS_TOKEN` into the Routine prompt at creation — it must never enter the calendar file, the rules, or the CHANGELOG blockquote (redact as the C2 record does). (2) The fired session has trigger tooling only to **update the calendar file**, never to create triggers — the re-arm step is deleted, not moved. (3) The IREN abandonment is understood first (§9) so the desk's verify step handles whatever caused it.

**Verify.** Fire the desk by hand (`fire_trigger`) on a day with nothing due → stand-down message, no commit. Move one row's `nextReport` to yesterday for a company that has reported → a normal refresh commit whose CHANGELOG entry shows news triage ran (items promoted or "none qualified"), `sync-profiler-registry.py` and `build-profiler-graph.py` both run, calendar row advanced. The Routine list shows one desk Routine and zero per-company one-shots.

## 3. Second tier — worth doing, in this order

### S1 — A token-gated notes route, so unattended refreshes can finally weigh field notes

**What.** `Profiler.gs` gains `?action=notes&t=<NOTES_TOKEN>` with two ops, both refused unless the Script Property holds a 16+ character token (the corpus-route pattern exactly): `nop=pending&slug=<slug>` returns that company's notes with `triage: pending` (id, date, sourceType, confidence, note text, attached-transcript text when present) and `nop=triage` (POST) writes **only** the `triage` field of one note, only from `pending`, to `promoted (vN)` or `logged-only`. Consumers: the earnings desk (P3), the quarterly sweep, and report generation — for **steering and triage only**, under the existing confidence bands. **Not** the Classroom pipeline: contract §4.3 ("notes may steer emphasis only when the developer places them in the Routine's prompt") is left intact; a briefing that cites or quotes a note is still denied to every tier by the missing `note:` prefix, and this route does not change that.

**Why.** The rules already require note triage at every refresh and say 75–100-confidence notes steer research. Since M3 that requirement cannot execute unattended, so the operator's own first-hand judgment — the one input no public source can supply — is absent from every scheduled session this autumn. The M3 decision was about exposure (a repo file is public; Pages is public); this route keeps the notes in Drive, behind the same Script Property discipline as the corpus token, and adds the write-back the triage rule needs (`triage` today can only be set by a session that cannot reach the log).

**Rider — note recency as Scraper's attention signal.** Scraper's emphasis band uses dossier `lastUpdated` as a proxy for "companies you are actively working". A recent 75+ note is a far better proxy. A metadata-only op (`nop=recent` → `[ {slug, date, confidence} ]`, no text) lets Scraper's daily sync raise the emphasis recency for companies the operator has just met — the "steer research" rule applied to the news desk. Worth doing only after the route exists; it is the same class of coupling as the registry sync.

**Touches.** `Profiler.gs` (route, two ops, admin audit-log rows), `profiler-app.md` (Note Command step 2 and the triage procedure gain the unattended path; Recall design bullet "Field notes are NOT readable from the repo" stays true and gains "…but a scheduled session holding the notes token reads them through the route"), `PROFILER-SCHEMA.md` Field Notes note ("Consequence for sessions" paragraph updated), the desk prompt. Scraper.gs for the rider.

**Must be true.** Token never in any file; the desk's CHANGELOG record redacts it like the corpus token; transcripts can be long (120k chars) — the route should return text for typed notes and a `hasTranscript` flag plus a second call per transcript, so a slug with ten meeting recordings does not blow a fetch.

**Verify.** Without the token: `denied`. With it: pending notes for a slug; a triage write moves exactly one field; the app's Manage panel shows the new triage state; `getPendingNotesForClaude` no longer lists it.

### S2 — Carry the corpus token in the C2 Routine (decide, after measuring)

**What.** Amend the weekly pipeline prompt to carry `CORPUS_TOKEN`, so the corpus layer is read rather than skipped. Everything else in the contract already handles it: `corpus:` items count toward the G11 bar only when dated and stated, the gate folds to `briefing` (contributor+), G7 requires the key to have come back on the timeline route this run, and §5.1 step 5 redacts the token from the record.

**Why.** Without it, a briefing can only be built from first-party revisions — which lag the news by weeks for public companies and by a quarter for private ones — and the `corpus:` prefix in the stamp vocabulary is dead. The digest is where the operator reads news; the briefing's distinct job is to say which of that news changes what the curriculum teaches, and it cannot say that without reading it.

**When.** Not before the first two or three runs. C2b's decision to omit the token was deliberate (settled item 10.6); the right moment to reopen it is when the runs have shown their behaviour. Concretely: if three consecutive runs `STAND-DOWN` while the corpus visibly moved (the digest ran every weekday), the layer is starving and the token goes in. If runs are producing briefings from first-party revisions alone, leave it another month.

### S3 — Cross-links the apps are missing (an afternoon, no gating questions)

- Digest items already carry `mcs` (matched dossier slugs). Render a small "dossier →" link (`Profiler.html#<slug>`) beside the source line of every Companies-section item, in the app and in the email. A link is not content; Pages is public.
- Digest footer: a "🎓 Classroom" link (and, once P1 exists, "drill due" as static text pointing at `Classroom.html#drill` — no cross-app count fetch, no coupling).
- Profiler masthead: a link to `Scraper.html` beside the Classroom link (Coverage 📰 reaches the corpus, but nothing reaches the editions).
- Classroom masthead: a link to `Scraper.html` beside the Profiler one.

**Touches.** `Scraper.gs` render (GAS bump), `Profiler.html`, `Classroom.html` (page bumps). No rules.

### S4 — Report indicators become Scraper tripwires

**What.** Every current report carries dated `indicators[]` — 22 today ("Frontier first-building delivery H2 2026", "Treasury PFE regulations by 2026-12-31", "Hithium HKEX re-filing"). Nothing watches them except the monthly drift check for one report, and only with a token it does not have. Seed each current report's indicators into `SCRAPER_INTEREST_TOPIC_SEEDS` as `key: 'topic-rpt-<report-id-short>-<n>'`, `source: 'report:<id>'`, `terms` drawn from the indicator's proper nouns and event words, default ON, marked stale by the sync when the index flips the report to `superseded` (the retired-source pattern). The desk (P3) and the drift check then query the corpus for indicator hits with a real signal behind them.

**Why.** Reports are the one place the corpus states what would confirm or refute its own judgments; today those statements expire unobserved. This is the guidance-seed and project-seed convention extended to a third layer that already exists.

**Touches.** `Scraper.gs` seeds (the `tv` rule applies to any later term edit), `profiler-app.md` Report Command step 4 (register seeds when a report lands), the drift-check prompt (already anticipates the token). Scraper GAS bump.

### S5 — Study guides: let the drill be the consumer; author quizzes only where a meeting is coming

The 62 guides were lifted mechanically and none uses the v2 kinds; 27 covered companies have no guide at all. Do **not** mass-regenerate — the rules' opportunistic-backfill stance is right and the cost is real. Instead: P1 drills the 802 existing cards as they are; when `profiler prep <Company>` runs before a meeting, it writes quiz sections on the v2 vocabulary (the Prep Command already says so), and those enter the drill on the next open. The one change worth making now is in the Prep Command's output: every quiz item gets a `why` (the renderer supports it) so the drill's "again" path teaches rather than merely scores.

## 4. Stop, remove, freeze

Removals count as improvements. Each item below names the evidence and the decision the developer has to make; none should be executed on this document's authority alone where a recorded decision stands behind the thing being removed (Chesterton's Fence applies to this plan too).

### R1 — Stop hand-arming one-shot refresh triggers

Covered by P3. The convention produced a chain that failed silently seven times; the replacement keeps its purpose. After the calendar is seeded, delete the 21 one-shots and never create a per-company trigger again. The quarterly sweep and the drift check stay.

### R2 — Scraper's legacy Projects machinery: audit, then decide, then most likely remove

**What it is.** The pre-rebuild research-project system: project wizard, Compile (RSS fetch loops), Backfill (GDELT), Deep backfill (Haiku web search), Plan (AI query planner), Enrich, Analyze (AI scoring with 👍/👎 exemplars), Calibrate, Distill preferences, Brief, the Schedules-tab pipeline, and the tabs `Projects`, `Schedules`, `Articles`, `ArticlesArchive`, `Reports`, `Profiles`, `Preferences`, `QueryPlans`. Roughly **1,900 lines of `Scraper.gs`** (`createProject` … `scBriefCore_`, `handleProjectAction_`, `scRunScheduleStep_`, `scDeliverBrief_`) and **~1,700 lines of `Scraper.html`** (wizard, cards, calibration, stats, verdict queue). `SCRAPER_LEGACY_SCHEDULES_ENABLED = false` already gates its scheduled half off; the interactive half is still mounted at page load.

**Why it is a candidate.** The digest engine replaced its purpose (D3, 2026-08-27: the rubric "replaces 👍/👎 feedback as the relevance model"). It carries three separate AI-spend paths (Gemini/Claude scoring, Haiku web search, Gemini planning) that the "expensive things run as scheduled sessions" boundary would not admit if proposed today. It is a third of the largest file in the repo and a sixth of the largest page, in a fleet where every GAS file also carries the ~5,000-line shared AUTH region. And the brochure's rating advice (below, R4) shows the operator's own model of the app has already drifted from what the Projects code does.

**The audit before the decision.** From the Scraper spreadsheet: `UsageLog` rows since 2026-08-27 attributable to compile/backfill/analyze/plan (owner email, AI calls, fetch calls); `Projects` row count and `Updated At` dates; `Schedules` rows. If no project has been touched since go-live, the decision is easy. **Keep** regardless: `aiComplete_` and the provider plumbing (the digest uses them), `scParseFeed_`, `scLogUsage_`, the `Interests`/`Digest*`/`Editions`/`Subscribers`/`ClickLog`/`Shares`/`EdgeCandidates` tabs. **Preserve** the historical 👍/👎 votes by exporting the `Articles` tab to the cold-store Drive folder before deleting the tab, since D3 said the votes are preserved.

**Payoff if removed.** A smaller, single-purpose Scraper; one fewer place a future session can be tempted to add AI spend; a brochure that matches the app; and — the real prize — the operator no longer has to hold two mental models of what Scraper is.

### R3 — A consumption quarter: freeze production-side building

A judgment call, stated as one. The corpus is complete for its purpose (89 dossiers across the value chain, uniformly fresh), the machinery is finished on both sides of every seam, and the pace (44 pushes in four days) is being spent on more of both. Propose, for roughly one quarter:

- **No new Profiler surfaces, tabs, report types, or writing styles.** Five styles across two display layers is already a maintenance surface for one operator; freeze at five. (This is not a removal — the styles work and were chosen.)
- **No new Scraper surfaces or outlets.** The roster is deliberately short; keep it there. Tune segments, which is what the app tells you to do.
- **Build only consumption:** P1, P2, S3, and the S2 decision. Measure with what already exists — Profiler's sign-in log, Classroom's gated-read audit rows, Scraper's click log, and the drill's own history — and let usage, not ideas, decide what gets built after the quarter.

### R4 — Documentation and prompt drift to fix in the first session

- **Scraper brochure, pages 6–7**, tells the reader to "rate the misses 👍 and 👎" and that "thumbs-down is worth more than thumbs-up", and lists Calibrate as a Tune surface. `SCRAPER_FEEDBACK_UI_ENABLED = false` retired all three on 2026-08-27 (D3). Either flip the flag on (a developer decision, and one R2 would moot) or correct the brochure; today it teaches a workflow the app does not offer. The rating that *does* exist is click-through, which the brochure describes correctly.
- **`profiler-app.md` "Currently armed"** lists seven August triggers that have fired and none of their successors, because there are none. P3 replaces the list with the calendar.
- **Armed refresh prompts** say "schema-v2 profile" and "mirror to bess-aidc-library via add_repo"; the rules say v7 and "sessions do NOT attach the library repo". P3 retires them.
- **`CLASSROOM-SCHEMA.md` Freshness** says the progress store "records when an account completed a section"; the code stores `true`. P1 makes the document true.
- **`Classroom.html` C1 banner comment** says progress ticks and study-next are "deliberately absent"; both shipped. Trivial; fold into P1's page bump.

## 5. The Classroom roadmap — sequencing verdict on C3 → C6

The decided order is C3 (guidance homecoming) → C4 (drill queue) → C5 (sales simulations) → C6 (team layer). **Recommended order: C4 → P2 → C3 → C5 → C6.** P2 is Profiler work, not a Classroom phase, but it is the same idea as C4's delta hook applied to the largest corpus, and it belongs in the sequence.

**Why C4 jumps the queue.** C3 is a relocation: guidance modules, the lens, the mentions route, the seed sources, the progress export/import and the quarterly Routine all move, and at the end the operator can do exactly what they can do today — the deep links work now. It carries the highest migration risk of any phase ("developer study history is not resettable state") and delivers no new learning capability. C4 is the phase that makes the corpus compound, its item universe at v1 (study guides + lessons) needs nothing from C3, and its one dependency — completion dates — is a fix the schema already promises. Decision 6 ("no interim Profiler→Classroom guidance route") is respected by keeping guidance items out of the drill until C3 lands.

**Why not skip C3.** The drill wants one store for every recall item, the pipeline will eventually want to revise guidance modules under the same contract that governs lessons, and Industry Guidance is teaching material sitting in a dossier app. C3 is right; it is just not urgent, and doing it second means the drill's storage and identity scheme is already proven when ~106 guidance items join.

**C5 is well fed and needs a contract decision first.** Sixty dossiers carry `policyExposure[]`, 497 relationships carry `status`/`scale`/`via`/`project`, eight named projects are registered — the raw material for objection and discovery scenarios is there. But a simulation is not a `module` or a `briefing`: it needs its own lesson `type` (a schema bump, therefore a load-time adapter and a checker extension), a decision on whether the pipeline may author one unattended (the caps and the G3 test were written for lessons that teach claims, not scenarios that rehearse conversations), and a decision on gate — a scenario built from a report is admin-only, which is most of them. Hold C5 at a design gate, as C6 already is.

**C6 stays gated on a team existing.** Nothing here changes that. Two things P1 should do so C6 is cheap later: keep the drill store account-first, and keep every per-account structure keyed by the Master-ACL email so an instructor view is a filter, not a migration.

**One sequencing risk to name.** P1's Sheets-backed history is the first per-account store in the fleet that is not a Script Property. Design the tab once, with the account as the first column and a documented per-account row cap, and put the shape in `CLASSROOM-SCHEMA.md` before writing a row — the same "schema first" discipline every other layer follows.

## 6. Rule and decision collision register

Every place a proposal touches a rule or a recorded decision, with the argument for reconsidering it. "Conforms" means the proposal is what the rule already asks for.

| Proposal | Rule or decision touched | Where it is recorded | Position |
|---|---|---|---|
| P1 — C4 before C3 | Phase order C3 → C4 | `PHASE6-CLASSROOM-DESIGN.md`, Phase plan | **Reconsider.** The order was a build sequence, not a dependency: C4 v1 needs no guidance content. Retention is the stated purpose; relocation is not |
| P1 — guidance items out of the drill until C3 | Decision 6: no interim Profiler→Classroom guidance route | same, Decisions | **Conforms.** Deliberately honoured |
| P1 — completion dates in the progress stores | Progress symbols are on the frozen gate surface | `CLASSROOM-COMMITTER-CONTRACT.md` §4.2; `classroom-app.md` "Unattended (pipeline) sessions" | **Conforms.** Frozen for the *committer*, not the developer; the obligation is to refresh `gateDigest` in the same commit, which P1 does |
| P1 — completion dates | "progress is never a weaker gate than reading" | `Classroom.gs` `clProgressValid_` | **Conforms.** Validation unchanged; only the stored value type changes |
| P1 — sheet-backed drill store | "drill history outgrows the 9 KB property pattern — expect a sheet-backed store" | `PHASE6-CLASSROOM-DESIGN.md` C4 | **Conforms** |
| P2(c) — dossier `revisions[]` | "Extending the schema": additive, opportunistic, no mass migration | `PROFILER-SCHEMA.md` | **Conforms** |
| P2(b) — `dossier-<slug>` progress docs | Progress doc ids validated against modules; study ids by containment | `Profiler.gs` `gdProgressWrite_` | **Conforms.** Same containment rule as `study-<slug>` |
| P3 — one desk Routine | Scheduled Refreshes convention: one-shot per company, self-re-arming, two-hour stagger | `profiler-app.md` "Scheduled Refreshes" | **Reconsider.** The chain failed 7/7 with no trace; prompts drifted several generations; a single serial session removes the reason for the stagger. The property the convention protects (refresh on the market's clock) is kept |
| P3 — token in the desk prompt | "CORPUS_TOKEN … supplied to sessions in the Routine prompt or pasted by the developer" | `profiler-app.md` "News Triage" | **Conforms.** The 21 prompts simply never received it |
| P3 — stand down silently | Drift-check precedent: a quiet run costs no commit | `profiler-app.md` Report Command step 8; contract §5 | **Conforms** |
| S1 — notes route | M3: "the app's Copy pending button … is the intended replacement for the automated read"; "Field notes are NOT readable from the repo" | `PROFILER-SCHEMA.md` Field Notes; `profiler-app.md` Recall design | **Reconsider.** M3 closed the *repo/Pages* exposure and this keeps it closed; the corpus-token route (2026-08-30, three weeks after M3) established that a Script-Property secret in a Routine prompt is an acceptable way for a scheduled session to read gated data. The triage-at-every-refresh rule cannot otherwise execute unattended |
| S1 — notes never become sources or lessons | Notes are not sources; no `note:` prefix; contract §4.3 | `PROFILER-SCHEMA.md`; `CLASSROOM-SCHEMA.md`; contract | **Untouched.** The route serves steering and triage only; the Classroom pipeline is explicitly excluded as a consumer |
| S2 — token in the C2 prompt | C2b settled item 10.6: no token; developer supplies it when they want corpus reads | contract §10 "Settled in C2b" | **Reconsider, after measurement.** Three stand-downs against a moving corpus is the trigger |
| S4 — report seeds | Seed conventions for guidance and project layers; `tv` discipline | `industry-guidance.md` step 9; `PROFILER-SCHEMA.md` Named projects; `scraper-sources.md` | **Extension.** Same shape, third layer; the `tv` rule applies from the first term edit |
| R2 — remove legacy Projects | D3: "the feedback code paths and historical votes are preserved — only the UI is retired"; brochure lists Projects & Plan as live | `Scraper.html` flag comment; `Scraper.gs` D3 comment; Scraper brochure p.2 | **Audit-gated.** Not on this document's authority; votes exported before any tab is dropped |
| R4 — brochure rating advice | `SCRAPER_FEEDBACK_UI_ENABLED = false` | `Scraper.html` | **Doc error** to correct, or a flag to flip — developer's call |
| — | Geographic multiplier: unmarked = ×1.00 | `Scraper.gs` `SCRAPER_GEO_FACTORS` comment | **Untouched.** Correct as designed |
| — | Google News site-scoped feeds rejected | `scraper-sources.md` | **Untouched** |
| — | In-app runtime Q&A deferred | `PHASE6-CLASSROOM-DESIGN.md`; `industry-guidance.md` | **Untouched.** Nothing here adds an in-app AI call |
| — | Stand-down default; G3 contradiction-not-novelty; blast-radius caps | contract §5, §6 | **Untouched.** Right for an unattended committer |
| — | Content-in-GAS for gated material | `CLASSROOM-SCHEMA.md`; `industry-guidance.md` | **Untouched** |

## 7. Build order — session-by-session handoff

Each session is one push train under the normal Pre-Commit / Pre-Push discipline. Sessions are ordered so that each leaves the fleet safer than it found it; none depends on a later one.

**Session A — the desk (P3 + R1 + R4), no app code.**
1. Read the seven completed August Routines' outcomes (§9) and the 21 armed prompts; extract every company's next report date, confirmation status and watch items into `repository-information/profiler-refresh-calendar.json`.
2. Create the desk Routine (weekdays 13:00 UTC, fresh session, push + email notifications) with the short prompt; the developer pastes the corpus token into it at creation and nowhere else.
3. Fire it once by hand on a no-due day and confirm a silent stand-down.
4. Delete the 21 one-shots. Rewrite "Scheduled Refreshes" in `profiler-app.md` around the calendar; fix the R4 brochure/prompt/comment drift (the brochure rebuild command is in `repository-information/brochures/README.md`; re-check the 1006 px page limit it records).
5. Exit criteria: one desk Routine, zero per-company one-shots, calendar committed, rules pointing at it.

**Session B — completion dates + computed dossier deltas (P1 prerequisite + P2a/b).**
1. `Classroom.gs`: progress values become dates; `clProgressVisible_` accepts `true` (legacy) or a date; write the migration; refresh `gateDigest` in the same commit; run both checkers.
2. `Profiler.gs`: same for `gd_progress`; accept `dossier-<slug>` doc ids.
3. `Classroom.html`: "changed since you read it" badges from `revisions[].changed[]` × completion dates.
4. `Profiler.html`: the computed changed-strip against the previous archived version; mark-as-read; roster badge.
5. Update `CLASSROOM-SCHEMA.md` Freshness to match the code. Page + GAS bumps for both apps. Playwright both.

**Session C — the drill (P1).**
1. Schema first: a "Drill items and history" section in `CLASSROOM-SCHEMA.md` (item identity, hash, SM-2 fields, the sheet tab shape, the per-account cap).
2. `Classroom.gs`: `ClassroomDrill` / `ClassroomDrillLog` tab ensure; `cop=drill` (due items for this session, gate-filtered, capped, with new-item introduction) and `cop=grade`; refresh `gateDigest`.
3. `Classroom.html`: landing card, `#drill` route, grading, source links; study-guide fetch with `cache: no-store`.
4. `PHASE6-CLASSROOM-DESIGN.md`: C4 marked built, order note. Checkers, Playwright, `?as=analyst` gate test.

**Session D — the seams (S1 + S3 + S4).**
1. `Profiler.gs` notes route (`pending`, `triage`, `recent`); the developer sets `NOTES_TOKEN` in Script Properties and adds it to the desk prompt.
2. Cross-links in all three apps.
3. Report-indicator seeds in `Scraper.gs`; Report Command step 4 updated.
4. Optional rider: Scraper emphasis from note recency.

**Session E — the R2 audit.** Read the Scraper spreadsheet's `UsageLog`, `Projects`, `Schedules`; write the finding to `IMPROVEMENTS.md`; the developer decides; a removal session follows only on approval, exporting `Articles` to cold storage first.

**Then C3**, as designed, with the drill already holding study and lesson items so guidance items join a proven store. **S2** is decided on the pipeline's own evidence, on its own timetable.

## 8. Examined and deliberately left alone

Listed so a later session does not re-derive them.

- **Scraper's rubric, segment gate, evidence cap and geographic multiplier.** Mature, well-argued in the code, and every "obvious" improvement I considered (a geography penalty for unmarked articles, a broader roster, title-dedupe at ingest) is one the comments already record as tried and wrong. Tune through the Interests sheet, as the app says.
- **The provenance fold and the fail-closed stamp.** The single mechanism that makes "Everything" teachable is correct, small, and checked rather than trusted. Nothing here adds a rung, a prefix, or a stored gate.
- **The unattended-committer contract.** Its default of stand-down, its one-attempt rule, its caps and its diff-aware judge are exactly what an unattended writer should be held to. The two places this plan touches it (completion dates; a future C5 type) are developer changes made through its own procedure.
- **Notes-are-not-sources**, in every form. S1 reads notes; nothing here cites one.
- **Content-in-GAS for gated material** and **public Pages for public data.** Federated apps talking through Pages JSON and token-gated routes is the right shape for this stack; nothing here proposes a shared backend.
- **The five writing styles.** Frozen by R3, not removed — they work and were chosen.
- **The shared AUTH region** (~5,000 lines per project, HIPAA machinery included). Dead weight for these three apps, but a template concern shared across the fleet and guarded by Chesterton's Fence; not a three-app improvement.
- **Public `profiler-data/`** including reports and archives. Known and accepted ("gates govern the app surface, not the files"); relocating it is the M3 pattern and a separate decision.
- **The `reviewBy` discipline and the quarterly guidance review.** Right-sized.
- **The 1st-of-month drift check and the private-company quarterly sweep.** Both already run the stand-down pattern the desk adopts.

## 9. Facts the first build session must verify before it starts

1. **The first C2 run** (2026-09-02 11:06 UTC). With `coveredThrough` = 2026-09-01, a one-day window and no corpus token, the expected outcome is `STAND-DOWN`; a `BLOCKED` on P3 would mean the ledger's `gateDigest` is stale against `main`. Read its §5.4 report before Session B, which changes the gate surface.
2. **What the seven August refresh sessions actually did.** Their transcripts (or the CHANGELOG sections dated 08-12, 08-21, 08-27, 08-28, 08-30) should show whether each landed a commit and why none re-armed — trigger tooling absent, step skipped, or the fallback reminder never written. The IREN run is recorded `ABANDONED`; find out why before the desk's verify step is written. This determines whether the desk needs anything beyond "update the calendar".
3. **Whether the Profiler dossiers dated 2026-08-30 carry the post-earnings figures** for Sungrow, BYD, Sinexcel, EVE, NVIDIA, Jinko and IREN, or only the mass v7 pass. Check each `financials.periods[]` for the H1/Q2 2026 period. If missing, the desk's first run should re-do them.
4. **Scraper `UsageLog` / `Projects` / `Schedules`** row counts since 2026-08-27 — the R2 evidence.
5. **`gateDigest` procedure** in `classroom-app.md` still matches `scripts/check-classroom-pipeline.py` (`GATE_SYMBOLS` count and names) — Session B and C both depend on it.
6. **The Script Properties present in both GAS projects** (`CORPUS_TOKEN` set in Scraper and Profiler; `ANTHROPIC_API_KEY` in Profiler for the transcript watcher) — the desk's news triage and S1 both assume the corpus route is live end to end, which the Coverage panel confirms in the app.

Developed by: LightAISolutions
