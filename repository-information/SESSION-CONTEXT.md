# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-24, 05:13 PM → 05:50 PM EST (attended; two turns)
**Repo version:** v07.40r — one push on `claude/classroom-landscape-modules-review-kf1rsn` (v07.40r, merged), plus this session-context write
**Branch:** `claude/classroom-landscape-modules-review-kf1rsn`

### What was done

- **v07.40r — the four Classroom landscape modules due this week were rechecked and updated**, and the four rehearsal scenarios resting on two of them were re-judged.
  - Four parallel research agents rechecked the dated claims. Every changed fact was re-read first-hand before it went in.
  - **cooling:** reviewBy stays 9/28, because the CoolIT launch is still ahead.
    - Schneider's 3.5 MW WCDU now tops the CDU ladder.
    - The EPA 2030 relief is narrowed to small semiconductor chillers, plus the data-centre 700-GWP limit from 1 Jan 2027.
    - The Texas freeze now includes the 21 Sep TCEQ permit halt.
  - **neoclouds:** reviewBy stays 9/30, because Fluidstack's accounts are not filed. This module needs a deeper refresh.
    - ClusterMAX 3.0 (23 Sep) puts Nebius at Platinum beside CoreWeave, drops Crusoe to Bronze, and marks Fluidstack and Nscale Unavailable.
    - Nscale's S-1 (18 Sep) confirms revenue, the Anthropic contract at up to about $44.6bn, and about 1 GW of 1.37 GW at owned sites.
    - Fluidstack names its own end customer.
  - **utilities:** reviewBy 10/1 → 2027-01-01.
    - Texas behind-the-meter asymmetry corrected for the 21 Sep permit halt.
    - Merger dates split between Virginia (17 Nov) and South Carolina (8 Dec; 29 Jan order).
  - **in-hall power:** reviewBy 10/1 → 10/31.
    - The OCP SST Spec Rev 0.3.0 is added, citing the spec only, as far as briefing chapter 3.5 records.
    - Flex Form 10 revenue line corrected.
  - **Scenarios:** every beat holds in all four.
    - Fluidstack: the room, beat 3, ledger and gap 7 revised.
    - Dominion: the merger calendar revised.
    - AEP: the Texas premise revised.
    - Southern: pin re-stamped only.
  - Checks: all passed. The pipeline checker showed only P1/P2/P10/P13 developer noise, with no P3.
- **Turn 2:** the developer was handed a paste-ready prompt for the neoclouds Profiler pass, plus the remaining heads-up list below.

### Where we left off

- v07.40r is merged. The neoclouds Profiler-pass prompt is in this session's last response, for a new Opus 5.5 session on or after 1 Oct, once Fluidstack's 30 Sep accounts deadline has passed.
- **Gates this week:**
  - CoolIT CDU launch 9/28 (cooling)
  - Fluidstack accounts 9/30 (neoclouds and its scenario)
  - Dominion purchase solicitation 10/1 (scenario-utilities-objection)
- **Open heads-up items (the developer's):**
  - The Dominion room is framed two weeks before the 1 Oct solicitation and needs reframing once it issues.
  - Unverified: AEP's "six of eight" tariff states (its 30 Jul release says five), and Dominion's "all-stock" deal description.
  - Narada's H1 2026 collapse is not yet in its v4 dossier.
  - The Trane dossier's policyExposure[1] reads the EPA 2030 relief too broadly.

### Key decisions made

- **A review date moves only when its gate is certain or already passed.** A gate whose outcome is still uncertain stays the review date: CoolIT 9/28, Fluidstack 9/30, Dominion 10/1. A certain gate moves it (the Alabama statute's effective date), and so does a month-level gate that can only be tested at month-end (Samsung SDI "October" → 10/31).
- **Scenario pins were re-stamped where beats hold**, per the developer's brief. A scenario pin records a re-judgment. This departs from the G3 choice made at (rr70), which governs lesson pins.
- **The utilities review date skips hearings, elections and deliverables**, following the module's own rule, and lands on the next effective date (1 Jan 2027).
- **A fact that could not be verified was left alone and flagged** rather than changed (AEP five-versus-six, "all-stock", Narada H1).

### Active context

- **Toggles unchanged:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Classroom GAS v01.90g.** Curriculum due-for-review is 6. There are 0 scenarios on moved landscapes and 13 pin-only segments, which are intended under G3.
- **Render recipe that worked:**
  - Serve a copy of `Classroom.html` with `_e=''` and `AUTO_REFRESH=false`.
  - After load, seed the four sessionStorage keys (`SESSION_KEY`, `EMAIL_KEY`, `ROLE_KEY`=contributor, `PERMISSIONS_KEY`='[]') and override `window._gasPost` to answer `gop=index|doc` from the parsed `guidanceDoc*_` literals.
  - Then run `clHeaderShow(); clAppMount();`.
  - Copy `profiler-concepts.json` to the served `profiler-data/`.
- **Editing trick:** `json.dumps(obj, indent=1, ensure_ascii=False)` reproduces the `Classroom.gs` literals byte for byte, except the indentation of the closing brace. Keep the original last line.
- **`check-classroom-pipeline.py --selftest` takes minutes.** Run it in the background.
- **Dates:**
  - The C2 Routine fires 9/30 11:00 UTC.
  - The Profiler quarterly check and drift check fire 10/1.
  - The Guidance quarterly review fires 10/15.
  - The developer starts at Megmeet 10/7.
  - RE+ runs 11/16–19.

### Recommendation for next session

- Run the neoclouds Profiler pass (the prompt from this session's last response) in a fresh Opus 5.5 High session on or after 1 October 2026. Fluidstack's 30 September accounts filing is then settled one way or the other.

**To continue:** paste the neoclouds Profiler-pass prompt into a new session (or type `give me the neoclouds Profiler-pass prompt` to have it re-pasted)

## Previous Sessions

### Session — 2026-09-24 05:12 PM EST (Megmeet SST briefing from the OCP spec)

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
