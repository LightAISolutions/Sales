# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

### Session — 2026-09-24 05:50 PM EST (Classroom landscape review, v07.40r)

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
