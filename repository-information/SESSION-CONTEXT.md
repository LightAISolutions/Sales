# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-24, 02:57 AM → 05:12 PM EST (attended; two working turns)
**Repo version:** v07.39r — one push on `claude/focused-bell-41xh5d` (v07.39r), plus this session-context write
**Branch:** `claude/focused-bell-41xh5d`

### What was done

- **Open-items audit across Scraper, Profiler, Classroom, Network and Events** (research only, no commit).
  - Three parallel readers covered the plan docs and CHANGELOG; the live Routine fleet was checked directly.
  - It returned a ranked plan: Priority 1 due 9/28–10/7, Priority 2 in October before RE+ on 11/16, Priority 3 housekeeping.
  - All six Routines are enabled and their last runs succeeded. The rebuilt Guidance Routine still carries step 3a.
  - The 9/23 C2 run ended in 9 minutes with no commit and no BLOCKED title, so it was almost certainly a stand-down. Its report is unread.
- **v07.39r — the Megmeet SST briefing updated from the OCP SST Specification Rev. 0.3.0 and OCP's 11 Aug 2026 announcement** (the developer supplied both PDFs).
  - New chapter 3.5, "What the OCP specification actually says".
  - Every second-hand spec claim corrected in place, with the old text struck through: the title and dates, "80 manufacturers building to it", NVIDIA questions 13 (Modbus) and 15 (harmonics), and week-one question 9.
  - The spec's numbers added across 15 chapters.
  - New Spec citation tier (refs 85–89) and a new Appendix E indexing every change.
  - PDF 76 → 84 pages.
  - Data file, figures M2 and M11 and the companion updated to match; the companion learned the `SPEC` tag prefix.

### Where we left off

- v07.39r is merged and its branch deleted. The developer has the PDF.
- **Not yet run:** the paste-ready prompt for rechecking the four Classroom landscape modules due this week. It is in this session's last CODING COMPLETE response.
  - The four: `landscape-cooling-2026-09` (reviewBy 9/28), `landscape-neoclouds-2026-09` (9/30), `landscape-utilities-2026-09` (10/1) and `landscape-in-hall-power-2026-09` (10/1).
  - The developer said "3"; the prompt covers 4 because in-hall-power is also due 10/1 and the OCP spec bears on it.
  - It also covers re-judging the rehearsal scenarios, including scenario-neoclouds-discovery (9/30) and the three utilities scenarios (10/1).
- **Still-open Priority 1 items from the audit** (the developer's to action):
  - Read the 9/23 C2 run report before 9/30.
  - Approve the ~33 Events proposals and run `events sync`; Yotta, GCPA and ESIG start 9/28.
  - Decide before the 10/1 quarterly sweep whether to move Habitat Energy and Gridmatic to the core tier or refresh them by hand.

### Key decisions made

- **Highlighting convention for document updates:** `mark.chg` (yellow) for new or corrected text, `del.chg` (struck through) beside anything replaced, `tr.chg` / `.chg-block` for new rows and sections, and an appendix indexing every change.
- **New sources get their own tier** rather than sharing the web "1". Numbers were appended (85–89), not renumbered.
- **"July 2026" was not called an error.** The spec PDF's creation date is 2 July; the briefing records the spec's own dates instead.
- **Figures whose data didn't change are not committed.** A regeneration run rewrites all 14 SVGs with new timestamps and clip ids; the unchanged 12 were restored.
- **The source PDFs are not stored in the repo.**

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Container quirk:** `pypdf` and `pdfminer` failed on a broken `cryptography` binding until `pip install cffi`. PyMuPDF (`pip install pymupdf`) renders PDF pages to PNG for the Read tool; `apt` poppler returned 404.
- **Spec facts worth remembering:** SKU A is 13.8 kV at 5 MW and SKU B is 34.5 kV at 5 or 10 MW. The rest:
  - 800 V DC unipolar output
  - at least 98% efficiency from 50–100% load, power-train losses only
  - overload of 120% for 5 s and 150% for 150 ms
  - BIL of at least 110 kV at 13.8 kV and 150–200 kV at 34.5 kV
  - Modbus TCP/IP as the only communications requirement
  - no UL 9540 in the compliance list
  - the plotted NOGRR 282 corner points differ from the briefing's web figures (chapter 16.3)
- **Dates:** the developer starts at Megmeet on 2026-10-07. The C2 Routine fires 2026-09-30 11:00 UTC. The Profiler quarterly check and drift check fire 10/1. The Guidance review fires 10/15. The Megmeet Q3 report is due by 10/31. RE+ runs 11/16–19.

### Recommendation for next session

- Run the four-module Classroom landscape recheck in a fresh Opus 5.5 High session before Sunday 2026-09-28, using the prompt from this session's last response.

**To continue:** paste the Classroom landscape recheck prompt into a new Opus 5.5 High session (or type `give me the landscape recheck prompt` to have it re-pasted)

## Previous Sessions

### Session — 2026-09-24 12:45 AM EST (Classroom segment regeneration)

**Date:** 2026-09-23 10:33 PM → 2026-09-24 12:45 AM EST (attended)
**Repo version:** v07.37r — one push on `claude/quirky-fermat-21bvyi` (v07.37r), plus this session-context write
**Branch:** `claude/quirky-fermat-21bvyi`

### What was done

**v07.37r — the Classroom segment regeneration left open at v07.36r, plus both changelog rotations.**
- **Five segments regenerated** with `build-classroom-segments.py --segment <id>` (generation date 2026-09-23). `Classroom.gs` went from v01.88g to v01.89g. Each lesson got one appended revision whose `changed[]` exactly matches the differing sections:
  - `power-conversion-and-rack-power-silicon`: the-players, what-moved, who-is-connected. This carries Megmeet v8, Delta v6 and LITEON v7.
  - `cells-and-chemistry` and `hyperscalers-and-ai-labs`: what-moved.
  - `storage-integrators-and-containers` and `grid-equipment`: who-is-connected.
- **The 13 pin-only segments were left alone**, as the developer asked and G3 requires. `--check` now reads 13 due, all pin-only, with 0 section changes.
- **Repo CHANGELOG rotated:** the 2026-09-17 date group (19 sections, v06.30r–v06.48r) moved to `CHANGELOG-archive.md`. Counter `107/100` → `89/100`.
- **Classroom GAS changelog rotated:** the 2026-09-15 date group (10 sections, v01.39g–v01.48g) moved to its archive. Counter `50/50` → `41/50`.
- **SHA enrichment:** 29 of 29 resolved on the deepened clone.
- **Checks:** content 0 errors / 0 warnings, selftest 15/15, `node --check`, the inner-scripts check, the curriculum check and the README tree check all pass. The pipeline check shows only P10 (5 revisions against a cap of 3), which binds unattended runs only. There was no P3 finding, so `gateDigest` is unchanged.

### Where we left off

The v07.37r push is merged into main and the branch is deleted. Nothing is pending: TODO is empty, there are no active reminders, and no section-changing segment is due.

### Key decisions made

- **Both rotations ran at the developer's instruction before the rules required them.** At 2026-09-23 EST, today's sections were exempt, leaving 92 non-exempt in the repo CHANGELOG (trigger 100) and 49 in the GAS changelog (cap 50). One whole date group was moved from each, the oldest, which leaves both files under their caps even after midnight.
- **Each archive keeps its existing SHA link style:** 8-character short SHAs in the repo archive, 7 in the Classroom GAS archive.

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **The 13 pin-only segments will keep showing as due in `--check`.** That's the intended G3 behaviour, not work. They become real work only when a section differs.
- **`check-classroom-pipeline.py --selftest` takes several minutes of CPU time** in this container. Run it in the background.
- **Dates:** the developer starts at Megmeet on 2026-10-07. The Megmeet Q3 2026 report is due by 31 October.

### Recommendation for next session

- Session fully complete — no deferred work; future sessions can pick any new task.
