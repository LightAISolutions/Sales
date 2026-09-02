# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-02 04:58:20 AM EST
**Repo version:** v04.24r *(unchanged — this session's plan commit was documentation-only by instruction, no version bump)*
**Branch:** `claude/three-app-architecture-review-e1on3o`

**What we worked on (one docs-only push, commit `25b279c`, merged to `main` — the three-app architecture review):**

- **`repository-information/IMPROVEMENT-PLAN.md`** (296 lines, §0–§9) — the improvement plan for Profiler · Scraper · Classroom, written from a full read of all six app source files, the four rules files, both schemas, the Phase 6 design + committer contract, the brochures, every file in `profiler-data/`, and the **live Routine inventory including prompts** (27 active, 33 completed). §0 is a measured ground-truth table; §1 the diagnosis; §2 the three flagship proposals; §3 second tier; §4 stop/remove/freeze; §5 the C3→C6 sequencing verdict; **§6 a collision register** naming every rule or recorded decision a proposal touches and the argument for reconsidering it; **§7 a session-by-session build order (A–E)**; §8 what was examined and left alone; **§9 facts to verify before building**
- **The three flagship proposals:** **P1** build the retention loop now — pull **C4 ahead of C3** (SM-2 drill over the 802 study-guide flashcards + 53 lesson items, sheet-backed history in a `ClassroomDrill` tab, a "due today" landing card; prerequisite: both progress stores change from booleans to **completion dates** so the schema-promised "changed since you learned this" delta can render); **P2** deltas not documents — Profiler adopts Classroom's revision discipline (computed "what changed in vN" strip from the archive, a per-account mark-as-read stamp + roster badge, optional authored `revisions[]` at schema v8); **P3** one **earnings desk** Routine driven by `repository-information/profiler-refresh-calendar.json`, replacing the 21 hand-armed one-shot refreshes and carrying the corpus token once
- **Second tier:** S1 token-gated **notes route** on Profiler.gs (`pending` / `triage` / `recent`) so unattended refreshes can weigh field notes — Classroom pipeline explicitly *not* a consumer (contract §4.3 intact); S2 corpus token in the C2 prompt, decided after 2–3 measured runs; S3 cross-links (digest → dossier, all mastheads ↔ Scraper); S4 report `indicators[]` as Scraper topic seeds; S5 quizzes only via `profiler prep`. **Removals/freezes:** R1 stop hand-arming one-shots; R2 audit-then-remove Scraper's legacy Projects machinery (~1,900 GAS + ~1,700 HTML lines, three AI-spend paths); R3 a one-quarter freeze on production-side building; R4 doc/prompt drift
- **Evidence the plan stands on** (all measured 2026-09-02): the **seven August post-earnings triggers fired — six `SUCCEEDED`, IREN `ABANDONED` — and none re-armed a successor or wrote the fallback reminder**; `profiler-app.md` still lists them as armed. **0 of 21 armed refresh prompts mention the corpus bridge** (they predate it); the Tesla prompt says "schema-v2" and "mirror via add_repo" (both superseded). The **C2 prompt states "CORPUS TOKEN: none is supplied"**. Both progress stores hold `{sec: true}`. All 89 dossiers carry `lastUpdated` 2026-08-30 (mass pass). 62 study guides, 0 quiz sections. The Scraper brochure teaches 👍/👎 rating and Calibrate, retired by `SCRAPER_FEEDBACK_UI_ENABLED = false` (D3, 2026-08-27)
- **Delivered in chat, not committed:** the copy/paste Opus 5 prompt for Session A of the plan

**Where we left off:**

- `25b279c` merged to `main` by the auto-merge workflow; `main` at `7a451ba`. This Remember-session commit is the branch's second push
- **Deliberately skipped for the plan commit, per the developer's "that file and nothing else":** Pre-Commit [PC-CHANGELOG] #6 (no CHANGELOG entry for `IMPROVEMENT-PLAN.md`), [PC-README-TREE] #7 (no README tree row), [PC-README-TIMESTAMP] #10, [PC-REPO-VERSION] #15. **The next push commit should fold these in** — the plan's Session A is the natural place
- **Classroom's first real pipeline run (today 11:06 UTC / 07:06 ET) is still unreviewed** — carried over from two sessions now; §9 item 1 of the plan predicts a `STAND-DOWN`
- Nothing else pending

**Key positions taken (proposals, not decisions — the developer decides):**

- **Documentation only.** No code, schema, rules file, changelog, README or version file changed; every collision with a recorded decision is named in §6 with its argument, never made silently
- **Order of build:** Session A = P3 (small, operational, stops a failure already happening) before P1 (the flagship); then B = completion dates + computed dossier deltas; C = the drill; D = seams (S1, S3, S4); E = the R2 audit; then C3 as designed
- **Decision 6 honoured:** guidance items stay out of the drill until C3 — no interim Profiler→Classroom guidance route
- **S1 respects M3's purpose** (notes never in repo or on Pages) and argues from the corpus-token precedent; the Classroom pipeline is excluded as a consumer

**Active context:**

- Repo **v04.24r** · Classroom **v01.04w** / **v01.07g** · Scraper **v01.71w** / **v01.99g** · Profiler **v01.79w** / **v01.33g** — **no app code changed this session**
- Capacity unchanged: repo CHANGELOG **77/100**; `Scrapergs.changelog.md` **46/50**; `Classroomgs.changelog.md` **7/50**; `Profilerhtml.changelog.md` **50/50** — the next Profiler page change forces its rotation
- Ledger `coveredThrough` `2026-09-01`, `lastRun` `null`. Routines: 21 one-shot refreshes (2026-10-15 → 11-25) + quarterly private sweep + monthly drift check + quarterly guidance review + daily ACL check + weekly C2
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Still flagged, not fixed:** README tree root line shows `v01.03r`; `ENTERPRISE-SETUP.md` token record stale; the template-wide first-sign-in self-denial (Setup Step 14 trap)

**Recommendation for next session:**

- Run **Session A of `IMPROVEMENT-PLAN.md` §7 (the earnings desk)** on Opus 5: first verify §9 items 1–3 (today's pipeline report; what the seven August refresh sessions did and why IREN was abandoned; whether the 08-30 dossiers carry the H1/Q2 figures), then seed `repository-information/profiler-refresh-calendar.json` from the 21 armed prompts + the 7 fired ones, create the one desk Routine with the corpus token pasted at creation and nowhere else, hand-fire it on a no-due day to confirm a silent stand-down, retire the 21 one-shots, rewrite "Scheduled Refreshes" in `profiler-app.md` around the calendar, fix the R4 drift, and fold in the CHANGELOG entry + README tree row the plan commit skipped. No app code in that session

**To continue:** type `implement Session A of IMPROVEMENT-PLAN.md`

## Previous Sessions

### Session — 2026-09-02 (App brochures + model selection — v04.24r)
**Date:** 2026-09-02 04:29:02 AM EST
**Repo version:** v04.24r
**Branch:** `claude/app-brochures-model-selection-4hrge9`

**What we worked on (one push, v04.24r — app brochures + a model-selection decision, on Opus 5):**

- **`repository-information/brochures/` — three 8-page informational PDF brochures**, one per app, for a new user: what it does, the methodology, the workflow, and how to use it effectively. **Authored from the apps' own code and rules, not from the design documents**, so every figure is the shipped value — Scraper's 40/25/20/15 rubric weights and ×1.00/×0.55/×0.25 geo multipliers, Classroom's ≥3-items/≥2-sources briefing bar and nine ref prefixes, Profiler's four-tier matrix and 0–100 note-confidence bands
- **Build tooling** — `build-brochures.py` renders each `<slug>.body.html` fragment through the shared `brochure.css` (Letter, per-app accent) with headless Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`. `brochures/README.md` records the rebuild command and the one constraint that bit: pages are fixed-height with `overflow: hidden`, so content past **~1006px of the 1056px box** is *silently clipped* — no error, no reflow
- **Kept out of `live-site-pages/`** — the brochures describe access matrices, the corpus route and private note handling; GitHub Pages is public
- **`REPO-ARCHITECTURE.md` deliberately not touched** — its diagram carries no node for `study-prep/` or `industry-guidance/` either; content directories under `repository-information/` are outside its repo-wide-architecture scope. Flagged rather than silently added
- **Model-selection question answered** (`claude-api` skill read first, per its trigger): **Fable 5.1** for the improvement/ideation prompt — most capable widely released model, built for demanding long-horizon reasoning, $10/$50 vs Opus 5's $5/$25 (a rounding error one-shot). Matches the developer's own precedent: C2c authoring on Fable 5.1, the checker-bound weekly pipeline runs on Opus 5
- **Wrote the Fable 5.1 handoff prompt** (delivered in chat, not committed) — loose on analysis, tight only on constraints; its highest-value instruction is *read the `.claude/rules/` files before proposing*, with four concrete already-rejected examples (notes-are-not-sources, the unmarked-geography default, Google News site-feeds, deferred in-app AI) so the session doesn't re-propose walked ground

**Where we left off:**

- **v04.24r merged to `main`** (commit `80d1d26`); the brochure PDFs were also delivered to the developer directly
- The **Fable 5.1 prompt is in the chat transcript of this session only** — it was never written to a file. If it is wanted again, it is reproducible from the design notes below but not stored in the repo
- Nothing else pending. Classroom's first real pipeline run (Wed 07:06 ET) was **not** reviewed this session — that carries over

**Key decisions made:**

- **Brochures are repo documentation, not site content.** `repository-information/brochures/`, never `live-site-pages/`
- **Build artifacts are committed** (`<slug>-brochure.html`) rather than gitignored — keeps the working tree clean for the stop hook, and the intermediate HTML is browser-viewable
- **The Fable prompt makes the final chat message the deliverable, not a file.** In this remote environment an uncommitted file dies with the container, so "research-only, no commit" and "write it to disk" are in conflict; the transcript is the durable option. A one-line swap to a docs-only commit was offered as the alternative
- **Prompt design for Fable 5.1**: full task spec up front, loose on *how to think*, tight on constraints and deliverable — the `claude-api` skill warns that prompts written for prior models are often too prescriptive and reduce Fable 5.1's output quality, and this repo's CLAUDE.md is already maximally prescriptive ambient context
- **Ask for conviction, not ranking** — "three you'd stake your reputation on" over "rank fifteen politely"

**Active context:**

- Repo **v04.24r** · Classroom **v01.04w** / **v01.07g** · Scraper **v01.71w** / **v01.99g** · Profiler **v01.79w** / **v01.33g** — **no app code changed this session**
- Capacity: repo CHANGELOG **77/100**; `Scrapergs.changelog.md` **46/50**; `Classroomgs.changelog.md` **7/50**; `Profilerhtml.changelog.md` still **50/50** — the next Profiler page change forces its rotation
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Pre-existing drift, flagged not fixed:** the README tree's root line shows `v01.03r` beside the CHANGELOG link while the repo is at v04.24r
- **Still flagged, not fixed:** `ENTERPRISE-SETUP.md`'s token record is stale; the template-wide first-sign-in self-denial (Setup Step 14 trap)
- **Useful technique from this session:** a measurement harness that sets `.page { overflow: visible }` and compares each page's last child's bottom against the 1006px limit via headless Chromium `--dump-dom`. Anything fixed-height and print-bound in this repo should be checked that way rather than by eye

**Recommendation for next session:**

- Run the **Fable 5.1 xhigh** improvement session with the three brochures attached, using the prompt from this session's transcript — then bring its plan back to **Opus 5** to implement. If the transcript is gone, the prompt's shape is recorded above: open on the analysis, tight on constraints (read anything / change nothing / deliver in the final chat message), and leading with the instruction to read `.claude/rules/` before proposing so it doesn't re-tread rejected ground. **Before that**, spend two minutes on the one thing that carried over: read the §5.4 report from the Wednesday 07:06 ET Classroom pipeline run — a `BLOCKED` on P3 means the ledger's `gateDigest` is stale against `main`, and a `STAND-DOWN` is the first real measurement of how much the corpus moves week to week.

**To continue:** type `review the first pipeline run, then give me the Fable prompt again`
