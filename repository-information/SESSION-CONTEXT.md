# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-04 10:12 PM EST
**Repo version:** v04.59r (bumped this session on the F2 push commit `911f8e0`; this entry is the housekeeping commit `Remember session context`)
**Branch:** `claude/fable-phase-b-f2-sf0i80` (the v04.59r push merged and the branch was swept; rebased onto `origin/main` at `4634e10` before this commit)
**Model:** Fable 5.1 High — Phase B session F2 (Fluidstack · Nscale · Anthropic).

### What was done

- **Three dossiers (schema v7, profileVersion 1, intel-briefing) + three schema v2 study guides + three lesson plans in one push commit.** `fluidstack` and `nscale` under `neocloud`, `anthropic` under `hyperscaler` — the first frontier-lab dossier. Sources 136 / 126 / 149 (first-party 47 / 51 / 56 percent); relationships 9 / 9 / 13, all resolving; 31 headshots (none for Fluidstack — no leadership page with photos exists); 46 shared concepts registered (tenant-of-record and lease vocabulary, anchored-neocloud financing, the buyer-side compute-contract terms). Registry sync (115), graph rebuild (785 edges), study checker (89 guides, 684 concepts) and the Playwright render of every dossier tab and every guide all clean; three quarterly calendar rows (76).
- **Every URL asserted programmatically.** `scratchpad/urlindex.py` built a URL index from the six agent reports (plus session-fetched pages and other covered dossiers' sources as a second tier) and every sources[], relationships[], policyExposure[] and recentDevelopments[] URL was checked against it before assembly — 0 unmatched per dossier. The F1 lesson, applied.
- **Premises re-verified as dated facts and recorded, not smoothed:** the 401 MW / 20-year Anthropic lease is at Justified (Hawesville, KY), direct with TeraWulf, no Fluidstack entity; Microsoft walked from Nscale's 1.35 GW Monarch LOI (Semafor) and the Anthropic 460 MW / about USD 45bn contract there is press-reported and unconfirmed by either party (`announced`); OpenAI's Stargate Norway LOI was replaced by Microsoft and Stargate UK is paused; Fluidstack's USD 1.5bn round at USD 18bn is unannounced by the company; its 1 GW France campus was withdrawn in March 2026.
- **§8 rows flipped to `B9 → F2 … v1 · v04.59r | ✓ · v04.59r`.** CLASSROOM-CURRICULUM-PLAN.md §6 untouched (F2 closes no register row). README execs line recounted from the files by registry slug: **407 images across 69 companies** — the prior 68 baseline was one high (67 by the same method), so the count moved by one company fewer than the two added.
- **Wrote the paste-ready F3 prompt** (Aypa Power · Spearmint Energy · Intersect Power) in chat at ~10:15 PM EST.

### Where we left off

Nothing is in flight. Working tree clean after this commit. F3–F8 remain on Fable 5.1 High; the G6 guidance module (Opus 5 xhigh), Phase C C4–C10 + C12, 26 guide backfills and Phase D are unchanged.

### Key decisions and findings

- **The URL index is the assembly gate, not a post-check.** Build `<slug>-{a,b}.md` reports that each end in `## ALL URLS`, index them, and have the assembler refuse any URL not in the index; cite a source from another covered dossier's sources[] (corpus tier) rather than from memory when a release times out or 404s.
- **Reported contract values stay `announced` with the reporter named.** The Nscale–Anthropic Monarch terms and the Lambda contract are the two largest unconfirmed numbers in the three dossiers; each calendar row's first watch item is their confirmation.
- **A subsidiary's parent domains count as first-party** (schema rule) — Anthropic's registry domains include claude.com and its CDN; Fluidstack's include the project-site domains.
- **Six agents died on an HTTP 429 usage limit mid-run** and were resumed by SendMessage with context intact after the user's reset — resume rather than respawn; the reports were complete. The stall cost ~1h 25m; net of it F2 ran ~72 minutes against a 90m estimate.
- **`json.dump(indent=2, ensure_ascii=False)` matches the calendar file's formatting** (46-line diff for three rows); the concepts file is the same.
- **Environment re-confirmed:** Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`; threaded HTTP server + GAS stub as admin + accounts.google.com fulfilled empty; `f2-render-check.py` (per-slug tabs incl. Relationships, sources count, `{{`, then `#ov-study-btn` and `.gd-term` data-terms against concepts + glossary) is the working harness — dry-run it on a known-good slug first. Shell cwd resets to the repo root after every Bash call; tool output above ~30 KB persists to a file; foreground sleep is blocked (Monitor tool).

### Active context

- Branch `claude/fable-phase-b-f2-sf0i80`; repo version **v04.59r**; CHANGELOG 76/100.
- Toggles: `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- `REMINDERS.md`: no active reminders.
- Registry 115 companies; concepts 684; calendar 76 rows; execs 407 images across 69 companies.

### Recommendation for next session

- **Run F3 (Aypa Power · Spearmint Energy · Intersect Power) as a fresh Fable 5.1 High session using the paste-ready prompt written in chat on 2026-09-04 at ~10:15 PM EST** — three `developer · ipp` dossiers + three guides on the BESS-developer buyer side, with the Aypa (Blackstone → Brookfield), Intersect (Google-owned) and Spearmint ownership premises re-verified first, §8 rows flipped to `B3 → F3`, one push commit.
**To continue:** type `run F3 on Fable 5.1 High`

## Previous Sessions

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

