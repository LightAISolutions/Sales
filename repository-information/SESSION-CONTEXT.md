# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-24, 07:42 PM → 07:53 PM EST (attended; two turns)
**Repo version:** v07.42r, one push on `claude/optimistic-mccarthy-plgmod` (merged), plus this session-context write
**Branch:** `claude/optimistic-mccarthy-plgmod`

### What was done

- **The first `events sync` to reach the registry (v07.42r).** The developer pasted the Proposed tab's export: 16 approved proposals and 10 polls.
  - **7 applied:**
    - `datacloud-usa-2027`: start moved to 30 Aug 2027; venue changed to Austin Marriott Downtown with `city` kept as "Austin"; the stale `venueLatLng` removed.
    - Three website updates: ESIG Large Loads, iMasons at Yotta, Data Center World.
    - Two new ESIG webinars (1 Oct, 15 Oct), both `tentative`. Their remaining fields came from the evidence pages, read 2026-09-24.
  - **9 skipped, at the developer's choice**, because they were poller misreads:
    - AI Infra Summit ×3: the organiser's JSON-LD still carries the finished 2026 edition.
    - MWC: street address in `city`.
    - Yotta: the event name read as the venue.
    - Four duplicates of existing rows under new slugs: Battery Show NA, ESIG Fall Workshop, iMasons Cascadia, iMasons Texas.
  - `lastProbe` updated on 10 roster rows. `uptime-network-americas-fall-2026` flipped to `past` with `--fix-past`.
  - `events.ics` rebuilt. `check-events-registry.py` exit 0: 102 events, 69 confirmed.
  - The CHANGELOG section lists every applied and skipped `pr-` id.

### Where we left off

- Everything is committed and merged to main.
- **The developer's panel follow-up, not a session task:**
  - Enter `v07.42r` in **Mark applied** for the 7 applied ids.
  - **Reject** the 9 skipped ids.
- **`mentions[]` is stale on main.** `extract-corpus-events.py --check` fails, and it failed before this sync too, after recent dossier edits (v07.41r's Trane and Narada revisions, among others). The sync never writes `mentions[]`, so it was left alone.
- **Active reminders (the developer's):**
  - Cooling recheck from 28 Sep.
  - Neoclouds pass from 1 Oct.
  - Dominion reframe 2–6 Oct.

### Key decisions made

- **An approved proposal is not applied blindly.** When a row would write data that is visibly wrong and the checker cannot see it (street address in `city`, event name as venue, a duplicate under a new slug, a year-crossed edition), the session names the rows and asks. The developer chose "apply the good ones, skip the rest, list the ids to reject".
- **A partly-right `changed-venue` keeps the good half.** Datacloud's venue name was taken and the address-in-city was not. `venueLatLng` is dropped when the venue changes, rather than left pinned to the old venue.
- **A `new-event` row's `series` is its name**, because the name carries no year (the rule's "name without its year").

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Events page unchanged:** Events.html v01.11w; only the data changed.
- **Poller weaknesses seen:**
  - It writes a JSON-LD `address` string into `city`.
  - It takes `location.name` as the venue even when that is the event name.
  - It proposes `new-event` rows for events the registry already holds under a different slug, with no name/date match.
  - It diffs an organiser page's stale previous edition against the current-edition row.
- **The checker's duplicate test is slug-only.**
- **Dates:**
  - CoolIT launch 9/28
  - Fluidstack accounts and C2 Routine 9/30
  - Dominion solicitation 10/1
  - ESIG DER webinar 10/1
  - Megmeet start 10/7
  - Battery Show NA 10/12–15
  - ESIG large-loads webinar 10/15
  - RE+ 11/16–19

### Recommendation for next session

- Run `python3 scripts/extract-corpus-events.py` to refresh the stale `mentions[]` in `events.json`, then `python3 scripts/check-events-registry.py` (exit 0) and `--check`. Commit it as a data-only push: it feeds the score's `corpusSalience` term, and it has been stale since the recent dossier revisions.

**To continue:** type `refresh the events mentions index`

## Previous Sessions

### Session — 2026-09-24 07:08 PM EST (Fact verification close-out, v07.41r)

**Date:** 2026-09-24, 06:18 PM → 07:08 PM EST (attended; four turns)
**Repo version:** v07.41r — three pushes on `claude/session-reminders-classroom-review-0g2lqj` (two reminder commits, then v07.41r; all merged), plus this session-context write
**Branch:** `claude/session-reminders-classroom-review-0g2lqj`

### What was done

- **Three reminders added to `REMINDERS.md`**, in date order:
  - Recheck `landscape-cooling-2026-09` after the CoolIT CDU launch, **Mon 28 Sep**.
  - The neoclouds Profiler pass, on or after **Thu 1 Oct**, in a fresh Opus 5.5 High session, once Fluidstack's 30 Sep accounts filing has landed or been missed.
  - Reframe the Dominion rehearsal (`scenario-utilities-objection`) **Fri 2 – Tue 6 Oct**, after the 1 Oct purchase solicitation issues and before Megmeet on 7 Oct. It carries the unverified Dominion "all-stock" check.
- **v07.41r — the three facts flagged at v07.40r, verified and closed:**
  - **AEP "six of eight": verified, no change.** The 30 Jul Q2 deck said five; the "Aug & Sep 2026 Investor Meetings" handout says six, after Michigan approved in between. Oklahoma (PSO) and SWEPCO Texas are still pending. The AEP bullet in the cooling reminder is struck through as closed.
  - **Trane: dossier v1 → v2, v1 archived.** Checked against Federal Register 2026-10387 and 40 CFR 84.54:
    - The 2030 date covers only semiconductor-manufacturing chillers of 100 lb charge or less; data-centre cooling keeps its 700-GWP limit from 1 Jan 2027.
    - The amendment took effect 27 Jul, not 26 May.
    - policyExposure[1], strategyRead #5 and the development entry were corrected, and the conclusion reversed: Trane's data-centre line keeps its transition tailwind.
  - **Narada: dossier v4 → v5, v4 archived.** The H1 2026 report was read first-hand from cninfo (filed 29 Aug):
    - Revenue RMB 1.699B (−56.7%) and net loss RMB 1.111B; every segment sold below cost.
    - Equity attributable to shareholders RMB 290M; total equity RMB 25M; liabilities 99.8% of assets; about RMB 410M of the RMB 465M cash frozen.
    - SR1 lowered from High to Moderate, because the comms/DC segment fell 44.8% in H1 after growing through FY2025.
  - **Classroom GAS v01.90g → v01.91g:**
    - Five "grew through the collapse" passages corrected across `landscape-cells-and-chemistry-2026-09` and `landscape-in-hall-power-2026-09`, with Narada ledger rows re-pinned at v5 and revision notes added.
    - `segment-in-hall-power` and `segment-cooling` regenerated. They were the only segments with section changes.
    - Analysis markdown mirrored, plus an inline correction in `CLASSROOM-CURRICULUM-PLAN.md` §10.6.
  - **Checks, all clean:**
    - Profiler relationships: 0 findings. Cross-references: 0 candidates. Inbound reconciliation: 3 Narada mentions, none changed.
    - Classroom content: 0 errors. Pipeline self-test: 15/15. `node --check` and inner scripts: clean.
    - Pipeline checker: P1/P2 only, with no P3, so no `gateDigest` refresh.

### Where we left off

- Everything is committed and merged to main. No flagged fact from v07.40r is still open.
- **Active reminders (the developer's):** the cooling recheck from 28 Sep, the neoclouds pass from 1 Oct, and the Dominion reframe 2–6 Oct.
- **Due for the C2 pipeline (Wed 30 Sep 11:00 UTC), not a developer task:**
  - 17 pin-only segment lessons (the graph rebuild moved its date).
  - 14 stale hand-authored pins.
- **Curriculum review dates in the next 30 days:**
  - cooling module 9/28
  - neoclouds module and scenario 9/30
  - utilities-objection scenario 10/1
  - capital-objection scenario 10/14
  - briefing-2026-09-21 on 10/21

### Key decisions made

- **A fact that's right at two different dates is closed without an edit.** AEP's five and six are both correct; the repo already dated "six" to August.
- **A primary source that contradicts a strategy judgment revises the judgment and its confidence**, not just the numbers (Narada SR1, Trane SR5). Each correction is marked in-line as "(Corrected at vN …)".
- **No USD overlay without a citable FX basis.** The Narada interim carries `kpi: revenue` but no `usdMillions`.
- **Developer sessions regenerate segments whose sections change** (G3). Pin-only segments are left to the pipeline.
- **Reminder-only commits stay housekeeping:** no version bump and no CHANGELOG entry, following the `bb8892c4` precedent.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Classroom GAS is at v01.91g.** Profiler page v01.91w is unchanged (data-only edits).
- **Retrieval recipes that worked from this container:**
  - **cninfo:** POST `http://www.cninfo.com.cn/new/hisAnnouncement/query` with `searchkey=<name>&category=category_bndbg_szsh;&column=szse&seDate=…`. PDFs are at `static.cninfo.com.cn/finalpage/…`.
  - **Federal Register:** the site is bot-blocked, but the API (`/api/v1/documents/<id>.json`) gives the govinfo PDF URL, and that downloads.
  - **eCFR:** the versioner API needs `curl --compressed`.
  - **PDF text:** `pip install pymupdf`.
- **Gotcha:** `open(p,'w').write(open(p).read()…)` truncates the file before the read. It emptied `repository.version.txt` once this session; it was caught and restored.
- **Corpus drift noticed, not fixed:** 4 older dossiers use `periodType: "interim"`, which is not a schema value (`half` / `quarter` / `annual` / `other`).
- **Dates:**
  - CoolIT launch 9/28
  - Fluidstack accounts 9/30
  - C2 Routine 9/30 11:00 UTC
  - Dominion solicitation 10/1
  - Profiler quarterly and drift checks 10/1
  - Megmeet start 10/7
  - Guidance quarterly review 10/15
  - RE+ 11/16–19

### Recommendation for next session

- On or after Monday 2026-09-28, recheck `landscape-cooling-2026-09` against what CoolIT actually launched (capacity, ship date, form factor) and place it on the CDU ladder. Move `reviewBy` only if the gate has passed; if the launch slipped, set it to the new date.

**To continue:** type `recheck the cooling module after CoolIT`
