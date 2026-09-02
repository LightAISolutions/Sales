# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-02 (C2c — the pipeline authoring prompt — v04.23r)
**Date:** 2026-09-02 03:17:49 AM EST
**Repo version:** v04.23r
**Branch:** `claude/classroom-pipeline-authoring-rules-wxl3n6`

**What we worked on (one push, v04.23r — C2c, the authoring prompt, on Fable 5.1 High as a fresh session):**

- **`.claude/rules/classroom-app.md` — new section "Authoring a pipeline lesson"** (~95 lines, eight sub-sections), written *to* the twelve assertions of `scripts/check-classroom-pipeline.py`: the shape of a run (pin table → fetch every ref once → classify unchanged / moved / unknown → decide per lesson → decide the briefing → apply the P10 caps ranked by size of contradiction → one write); the **G3 contradiction test** — a revision exists only when the run can write, per section id, *"section `<id>` teaches X; `<ref>` now says Y"* with X actually in that section and Y on the fetched document; **`changed[]` = exactly P8's differs set** (existing ids only, newly appended sections never listed, one entry per run, `updated` = run date, `reviewBy` from the new material's gate); **the briefing** (`edition` = run date so `briefing-<edition>` is deterministic under G10; a G11 *item* is one dated, stated development, a *source* one distinct `ref`; ≥ 3 / ≥ 2 counted **after** the gate is chosen); the new-module exception; **G2 / G7 / §5.2 as the run's own obligations** with per-prefix ref-resolution rules; the eight-step write in checker order; an assertion → rule table
- **Two readings the section fixes that the contract left open** — both the stricter one: (1) a source that moved without contradicting anything leaves the lesson untouched **pin included** (G3's "does not change" read strictly; the G8 report swap is the only pin move without a section change; the re-examination next week is intended idempotence), (2) `title`, `short`, `group`, `type`, `edition`, `tiles[]`, `glossary[]`, `schemaVersion` are **frozen for the run** because contract §3.1 item 2's permitted-edit list omits them and no assertion watches them — a contradicted tile or glossary entry is reported under `Needs the developer`, never edited
- **Recorded:** `CLASSROOM-COMMITTER-CONTRACT.md` §10 "Settled in C2c (2026-09-02)"; `PHASE6-CLASSROOM-DESIGN.md` C2 status → C2a, C2b, C2c done, pipeline live; `CLAUDE.md` Reference Files row and README tree entry for `classroom-app.md`
- **The Routine's C2c pre-flight gate was deleted** from `trig_017pcCGpj1fkNYcUyCXPY3Wd`'s prompt (`update_trigger`, 07:15 UTC) — the prompt is otherwise byte-identical: no corpus token, 45-min / 120-turn budget, the three READ FIRST documents in the same order. **No Classroom code, ledger or `gateDigest` moved**; `--selftest` 13/13 and `check-classroom-content.py` 0/0 re-confirmed

**Where we left off:**

- **C2 is complete and live.** v04.23r merged to `main` (commit `5e5ad0b`). The first real run fires **today, Wednesday 2026-09-02 11:06 UTC (07:06 ET)** — the first fire whose pre-flight is the contract's own §5.1 rather than a stand-down. Push + email notification will carry its §5.4 report
- **Expected first outcome:** with no corpus token the corpus layer is *not read*, so a briefing can only come from dossier / study / guidance / registry / graph / report movement inside `(2026-09-01, 2026-09-02]` — most likely a `STAND-DOWN` with a real `Sources seen:` line, which is itself the measurement C2 needs
- Nothing is pending from this session

**Key decisions made:**

- **The prompt is written to the checkers, not alongside them** — every rule names the assertion that judges it, and the closing table pairs P1–P12 with the run's behaviour, so a future change to an assertion has one place to update in the prose
- **`edition` = the run date**, not the newest item's date: the window is `(coveredThrough, runDate]`, so the run date is what closes it, and it is what makes the briefing id deterministic for a re-fire after a lost push (G10)
- **G11 counted after the gate decision** — an item left out because its source would raise the briefing's gate does not count toward the three; the run picks the edition's tier first (public-only → analyst-visible; one guidance/corpus/briefing input → contributor+; one report → admin-only) and admits only inputs at or below it
- **No number moved** — G11 (3 / 2) and the §5.3 caps stay as the contract set them; the section says a developer may raise them, never lower them
- **Model plan held:** C2c on Fable 5.1 High (done); the weekly runs on Opus 5 High, measured against the contract's caps and budget

**Active context:**

- Repo **v04.23r** · Classroom **v01.04w** / **v01.07g** · Scraper **v01.71w** / **v01.99g** · Profiler **v01.79w** / **v01.33g**
- Capacity: repo CHANGELOG **76/100**; `Scrapergs.changelog.md` **46/50**; `Classroomgs.changelog.md` **7/50**; `Profilerhtml.changelog.md` still **50/50** — the next Profiler page change forces its rotation
- Ledger: `coveredThrough` `2026-09-01`, `lastRun` `null` — left for the first committing run to write
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Verification set for any Classroom change:** `python3 scripts/check-classroom-content.py`, `python3 scripts/check-classroom-pipeline.py --selftest` (13/13), `python3 scripts/check-classroom-pipeline.py --base origin/main` (P1 noise expected on a developer commit; **P3 is not** — refresh `gateDigest`), `node --check` on a `.js` copy of `Classroom.gs`, `node scripts/check-gas-inner-scripts.js`
- **Still flagged, not fixed:** `ENTERPRISE-SETUP.md`'s token record is stale (needs the developer to read the Script Property); the template-wide first-sign-in self-denial (Setup Step 14 trap) is documented but not designed out

**Recommendation for next session:**

- Read the §5.4 report from today's 07:06 ET pipeline run (push/email notification; session title prefixed `BLOCKED —` if it blocked) against the contract's caps and the 45-minute / 120-turn budget, and spot-check the one thing the checkers cannot: that every `ref@date` a `COMMIT` names in CHANGELOG matches the document it claims to have fetched. If it reports `BLOCKED` on P3, the ledger's `gateDigest` is stale against `main` — refresh it with the command in `.claude/rules/classroom-app.md`, not anything in the run. If it reports `STAND-DOWN`, note the `Sources seen:` counts — that is the first measurement of how much the corpus moves week to week, and decides whether the Wednesday cadence and the no-token default hold.

**To continue:** type `review the first pipeline run`
