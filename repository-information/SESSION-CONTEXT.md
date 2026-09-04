# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-04 07:29 PM EST
**Repo version:** v04.58r (bumped this session on the F1 push commit `1c3a3cc`; this entry is the housekeeping commit `Remember session context`)
**Branch:** `claude/fable-phase-b-f1-5mj1xg` (the v04.58r push merged and the branch was swept; rebased onto `origin/main` at `3e806ee` before this commit)
**Model:** Fable 5.1 High — Phase B session F1 (DNV · Sargent & Lundy · CoolIT).

### What was done

- **Three dossiers (schema v7, profileVersion 1, intel-briefing) + three schema v2 study guides + three lesson plans in one push commit.** `dnv` and `sargent-lundy` are the registry's first two `advisor`-category entries (the roster's Advisor chip now shows 2 and filters to them — Playwright-verified with a screenshot); `coolit` under `supplier`. Sources 101 / 158 / 151 (first-party 32 / 71 / 65 percent); relationships 10 / 16 / 3, all resolving; 28 headshots; 28 shared concepts registered (8 project-finance terms from the IE guides, 20 CDU terms). Registry sync, graph rebuild (745 edges) and the study checker all clean; three quarterly calendar rows.
- **Premise corrections recorded in the CoolIT dossier, not smoothed:** Ecolab-owned since 2026-07-02 (about USD 4.75bn; KKR + Mubadala only May 2023 → July 2026); Asetek v. CoolIT ended in the 2022-09-11 summary judgment and a settlement, no jury verdict; the Federal Circuit revived CoolIT's '567 patent 2024-03-07. Sargent & Lundy is not an ESOP ("privately owned and led by engineers").
- **Register:** G7 → **Closed** v04.58r (CDU-specialist half landed; Trane holds the chiller half). G10 → **Partial** v04.58r — two IE dossiers satisfy the independent-engineer half and give `what-bankable-means` public corroboration, but no broker or insurer dossier exists, so the insurance half is still open and the row says so. §8 rows flipped to `B10 → F1 … v1 · v04.58r | ✓ · v04.58r`; §4 carries the dated F1–F8 regrouping paragraph.
- **Wrote the paste-ready F2 prompt** (Fluidstack · Nscale · Anthropic) in chat at ~07:29 PM EST — same structure as F1, with this session's two lessons added to its ENVIRONMENT block.

### Where we left off

Nothing is in flight. Working tree clean after this commit. F2–F8 remain on Fable 5.1 High; the G6 guidance module (Opus 5 xhigh), Phase C C4–C10 + C12, 26 guide backfills and Phase D are unchanged.

### Key decisions and findings

- **Verify every source URL against the research reports before assembly.** One URL was fabricated mid-assembly (an AEP centenary page for Sargent & Lundy that no report contained); caught before commit by grepping the reports, then the CoolIT assembly asserted every URL programmatically. Future sessions: build the sources list from a URL index extracted from the agent reports, never from memory of a quote.
- **Ownership and litigation premises in a commissioning brief are dated facts — re-check them first.** The F1 brief said "KKR-owned since 2023" and implied an Asetek jury verdict; both were stale. Put the ownership and litigation questions in the agent prompts explicitly, as F1 did, and record corrections in the dossier's summary and judgments.
- **`party` field and parent domains:** for a subsidiary, the parent's domain goes into registry `domains` (schema rule), so Ecolab's releases count as first-party for CoolIT. DNV's annual report read from a mirror host carries `party: "company"`; title-only citations of unreadable pages are stated as a collection gap in the dossier rather than dropped.
- **Concept collisions:** the registry already had `approach` (tower/chiller sense) — `approach-temperature` was registered with only the "approach temperature differential" alias. `direct-to-chip cooling` is an alias of `cold-plate`; `direct-liquid-cooling` carries `DLC` only. Check aliases before registering.
- **JSON formatting:** `profiler-concepts.json` and `profiler-refresh-calendar.json` are two-space indented; a one-space dump produced a 10,000-line diff and was re-serialised before commit.
- **Environment re-confirmed:** dnv.com is Cloudflare-blocked (403 on every page) and annualreport.dnv.com egress-denied — mirror hosts (IIOA for the annual report, ASHB for RP-0043) worked; tool output above ~30 KB is persisted to a file, so read reports in ≤40-line chunks; foreground `sleep` is blocked — use the Monitor tool to wait on agent report files; a stop hook fires on uncommitted plan edits while agents run — `git stash` them and pop before the commit. Threaded HTTP server + roles stub + `/opt/pw-browsers/chromium-*` still the working Playwright recipe (`f1-render-check.py` pattern: roster chip click, per-slug tabs, sources count, `{{}}` and gd-term resolution).
- **Time:** F1 took 1h 34m against a 45m estimate — six agent reports totalling ~2,000 lines, a context compaction, and dossiers averaging 137 sources. Estimate F2 at ~90 minutes.

### Active context

- Branch `claude/fable-phase-b-f1-5mj1xg`; repo version **v04.58r**; CHANGELOG 75/100.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry 112 companies (2 advisor); concepts 638; calendar 73 rows; execs 376 images across 68 companies.

### Recommendation for next session

- **Run F2 (Fluidstack · Nscale · Anthropic) as a fresh Fable 5.1 High session using the paste-ready prompt written in chat on 2026-09-04 at ~07:29 PM EST** — three dossiers + three guides, first hyperscaler-category AI lab authored on Fable, neocloud guides that must not repeat CoreWeave / Nebius / Lambda, §8 rows flipped, one push commit.
**To continue:** type `run F2 on Fable 5.1 High`

## Previous Sessions

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

Developed by: LightAISolutions
