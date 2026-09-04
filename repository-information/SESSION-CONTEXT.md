# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-04 05:40 PM EST
**Repo version:** v04.57r (bumped this session on the head-to-head push commit `14d6411`; this entry is the housekeeping commit `Remember session context`)
**Branch:** `claude/fable-5-1-xcel-energy-comparison-fhxyhe` (the v04.57r push merged and the branch was swept; rebased onto `origin/main` at `0048387` before this commit)
**Model:** Fable 5.1 High — the Xcel Energy head-to-head session.

### What was done

- **Xcel Energy dossier refreshed to profileVersion 2 on Fable 5.1 High, written blind to the Opus 5 xhigh v1 (v04.46r), which is archived as `archive/xcel-energy.profile.v1.json` with an index entry and README tree line.** Two parallel research subagents (156 first-party + 139 third-party source entries); v2 carries 140 sources at 54 percent first-party, 9 product lines, 6 spec groups / 79 rows, 4 financial periods, 50 developments, 10 relationships, 6 policy regimes, 15 decision makers (11 reused headshots), 7 confidence-tagged judgments plus an indicators bullet. Registry synced (`srcTotal` 101 → 140), graph rebuilt, calendar row advanced (`lastRefreshed` 2026-09-04, SPS-leadership watch item rewritten). Render check: zero page errors, zero console errors. `xcel-energy.study.json` untouched.
- **Head-to-head reported in chat by section with every difference classed (a) same-fact-different-treatment or (b) search luck. Verdict on the §2 claim: inconclusive**, recorded as a dated paragraph in `PROFILER-COVERAGE-PLAN.md` §2; the §8 `xcel-energy` row reads `v1 · v04.46r → v2 · v04.57r` with the re-run noted beside the Opus substitution. The reminder moved to Completed Reminders (developer-authorised on commissioning). CHANGELOG v04.57r (counter 74/100).
- **Wrote the paste-ready F1 prompt** (DNV · Sargent & Lundy · CoolIT) in chat at 05:40 PM EST — includes the §4 regrouping line, the G7/G10 re-check-and-flip instruction, the advisor-chip Playwright check, and the environment notes.

### Where we left off

Nothing is in flight. Working tree clean after this commit. The Fable window opened 04:19 PM EST 2026-09-04 has ~41 minutes of the head-to-head spent on it; F1–F8 remain.

### Key decisions and findings

- **Head-to-head (a)-class evidence, for the record.** Fable edge on discipline: Google ESA `announced` (v1 `active`) because unapproved; Meta `since 2023-10` from Xcel's own story (v1 `2026` from the EEI list, with a false "Xcel names no customer but Google" gap); a Moody's negative-outlook claim v1 asserted with no resolvable source (the Q2 2026 10-Q and Q2 deck carry ratings without outlooks — checked directly) that v2 withheld; the SPS presidency stated as a collection gap (v1's 13 decision makers omit SPS with no note). Opus edge on depth: 10-K extraction (large-load concentration risk factor, credit-transfer cash $652M, carryforwards $1,474M, insurance repricing $40M→$135M, capex actuals), the slide-drift reading (flat contracted block, the 200 MW row slipping a year, the redacted fifth row), and the PSCo-not-in-an-RTO structural judgment that v2 missed. Judgments otherwise the same calls. **Consequence: no Fable make-good for Oncor or AEP; Phase B remainder can go to either model.** The recurring gap is 10-K reading depth in the research-agent prompts, not the authoring model.
- **Write-blind caveat that future comparisons must design around:** the registry tagline and the refresh-calendar `watch[]` list both summarize the existing dossier, so a "blind" session that reads them for bookkeeping is exposed at the topic level. Read those two only after authoring, or have the subagents launched before any bookkeeping read (this session did the latter by accident of ordering).
- **v1's `mw-contracted` KPI on a utility's contracted data-center load** was deliberately not carried in v2 — the physical KPI keys are defined for capacity operators. Open question for the schema if utilities keep getting the overlay.
- **SPS leadership gap is real and unsourced on first-party channels:** Brad Baldridge quoted as interim president from 2026-03-25; Adrian Rodriguez last quoted 2026-01-28; the calendar watch item cites an AEP release naming Rodriguez at AEP Texas — unverified this session, revise the Baldridge entry at the next refresh if confirmed.
- Environment re-confirmed: `pip install playwright` + `pip install pymupdf` needed; threaded HTTP server; `executable_path` into `/opt/pw-browsers/chromium-1194`; the roles stub from `scripts/verify-profiler-roles.py` works for a single-dossier render check; sec.gov and the Q4 CDN answer to curl with a User-Agent, so a fact can be verified after the agents return.

### Active context

- Branch `claude/fable-5-1-xcel-energy-comparison-fhxyhe`; repo version **v04.57r**; CHANGELOG 74/100.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Still owed: Phase B F1–F8 (Fable 5.1 High), G6 guidance module (Opus 5 xhigh), Phase C C4–C10 + C12, 26 guide backfills, Phase D. Register rows G7 (Partial) and G10 (Open) close with F1.

### Recommendation for next session

- **Run F1 (DNV · Sargent & Lundy · CoolIT) as a fresh Fable 5.1 High session using the paste-ready prompt written in chat on 2026-09-04 at 05:40 PM EST** — three dossiers + three guides, first `advisor` chip with a Playwright check, G7/G10 re-checked and flipped in-session, the §4 regrouping line, one push commit.
**To continue:** type `run F1 on Fable 5.1 High`

## Previous Sessions

**Date:** 2026-09-04 04:28 PM EST
**Repo version:** v04.56r (no bump — this session made no code or data change; one housekeeping commit `Remember session context`)
**Branch:** `claude/profiler-coverage-phase-b-3jimh8`
**Model:** Fable 5.1 (this session), used only for planning — no dossier, guide or module was authored, so no §8 row and no §2 note changed.

### What was done

- **Audited `PROFILER-COVERAGE-PLAN.md` §8 against the filesystem.** Every row matches the files on `main`: 20 of 65 new companies landed (A1–A4 · B1–B2 · C1, C2, C3, C11), 4 of 30 guide passes (Vertiv, Schneider, Siemens Energy revisions + the Narada backfill). Register §6: G2, G3, G4, G5, G8, G9 closed; G7 Partial (CoolIT); G10 Open (DNV, S&L); G6 Open (guidance module); G11/G12 standing.
- **Recommended a Fable-first action plan** (in chat, 04:20 PM EST): no Fable xhigh work remains; the Phase B remainder (24 companies) runs on Fable 5.1 High as eight sessions **F1–F8**, reordered so register closers and the most opaque subjects go first — F1 DNV · Sargent & Lundy · CoolIT (closes G10 + G7, first `advisor` chip, re-check and flip both rows in-session) · F2 Fluidstack · Nscale · Anthropic · F3 Aypa · Spearmint · Intersect · F4 Invenergy · Gridstor · Available Power · F5 esVolta · Strata · Hunt · F6 MGX · Excelsior Energy Capital · X-energy (first `investor` chips; Excelsior moved here from B6, B10 split in two) · F7 Compass · EdgeCore · PowerHouse · F8 Fermi America · Tract · Prime Data Centers · **F9** the Xcel head-to-head (the active reminder) as the leftover-credit filler. Opus 5 xhigh afterwards: G6 module first, then C4–C10, C12, the 26 backfills, then Phase D. **§8 and §4 were NOT edited** — the regrouping is a chat recommendation; the F1 session should note it in §4 when it flips its rows.
- **Wrote the paste-ready prompt for the Xcel head-to-head** (in chat, this turn) — Fable 5.1 High, dossier-only, written blind to the Opus version, reported by section with every difference classed *same-fact-different-treatment* vs *search luck*, verdict into §2's confidence note, §8 `xcel-energy` row flipped, reminder moved to Completed (developer authorised the completion by commissioning the session on 2026-09-04).

### Where we left off

Nothing is in flight. Working tree clean, branch at `origin/main` plus this commit. The developer's Fable window (~14 h from 04:19 PM EST 2026-09-04) is open and unspent; the intended order is the Xcel head-to-head first (developer's choice, ahead of F1), then F1–F8.

### Key decisions and findings

- **Baseline facts for the head-to-head, verified this session:** `xcel-energy.profile.json` on `main` is byte-identical to commit `2652d30` (v04.46r), profileVersion 1, schema 7, 101 sources, 6 relationships, 13 decision makers, 7 strategyRead judgments; **never archived** (no `archive/xcel-energy.*` entry), so the Fable re-run is a normal revision — v1 goes to `archive/xcel-energy.profile.v1.json` with an archive-index entry and the new file is profileVersion 2. `xcel-energy.study.json` stays untouched — the comparison is dossier-only.
- **Write-blind rule (added to the prompt, not in the reminder):** the Fable session must not open the Opus dossier until its own v2 is written, or the comparison measures editing rather than authoring.
- **The head-to-head verdict has a consequence beyond the reminder:** if Fable High is materially better on the (a)-class evidence, Oncor and AEP (the other two B2 Opus substitutions) become Fable make-good candidates; if not, §2 can send the rest of Phase B to Opus without regret.
- CHANGELOG counter 73/100 — no archive rotation due during the remaining program.

### Active context

- Branch `claude/profiler-coverage-phase-b-3jimh8`; repo version **v04.56r**.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md` still carries the one active reminder (Xcel head-to-head) — it is the spec for the next session and is closed by that session, not this one.
- Still owed elsewhere: G6 guidance module (Opus 5 xhigh), Phase B F1–F8, Phase C C4–C10 + C12, 26 guide backfills, Phase D.

### Recommendation for next session

- **Run the Xcel Energy head-to-head as a fresh Fable 5.1 High session using the paste-ready prompt written in chat on 2026-09-04 at 04:26 PM EST** (spec: the active reminder in `REMINDERS.md`; baseline commit `2652d30`; archive v1, write v2 blind, report by section, weight same-fact-different-treatment differences only, verdict into §2's confidence note, flip the §8 `xcel-energy` row, move the reminder to Completed). Then proceed to F1 (DNV · Sargent & Lundy · CoolIT) with the F1 prompt from the same chat.
**To continue:** type `run the Xcel Energy head-to-head on Fable 5.1 High`

Developed by: LightAISolutions
