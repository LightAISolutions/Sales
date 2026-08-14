# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-14 02:42:25 AM EST
**Repo version:** v02.43r

**What we worked on — the Megmeet prep pack became downloadable PDFs, via a renderer built to not drift:**

A short, narrow session picking up directly from the AIDC market report PDF work. The ask was one thing — "output the Megmeet Interview Brief in a downloadable PDF" — and the interesting part is the design call underneath it.

**v02.42r — `scripts/build-study-prep-pdf.mjs` + `MEGMEET-INTERVIEW-BRIEF.pdf` (13 pages, 15 sections)**
- **The renderer parses the Markdown directly rather than typesetting a hand-authored HTML twin.** This is the deliberate divergence from `build-aidc-report-pdf.mjs`, whose source *was* authored as HTML. `megmeet-interview-brief.md` already exists and is the file the developer edits, so an HTML copy would drift the moment they touched it. The `.md` stays the single source of truth
- Same Chromium-over-DevTools-Protocol plumbing as the AIDC script (only `Page.printToPDF` accepts a custom running header/footer; the `--print-to-pdf` CLI flag cannot). No npm dependencies. The CDP client is duplicated between the two scripts rather than extracted — refactoring the working AIDC script as a side effect was judged out of scope
- Small Markdown subset by design: headings, paragraphs, GFM pipe tables, blockquotes, lists, `<details>`, inline emphasis/code/links, and (added in v02.43r) fenced code
- **Three rendering decisions that were bugs first.** (1) **Proportional table columns** — weighted by average cell text length, clamped 11–58%; equal thirds under `table-layout:fixed` made the five-objections table unreadable. (2) **`<details>` forced open** — Chromium prints a collapsed `<details>` as *only* its `<summary>`, which would have silently dropped the self-test answers. (3) **Blockquotes split by role** — a bolded lead-in renders as a boxed caution, a line opening with a quote mark renders as a tinted "Say it like this" pull quote, because the brief uses `>` for both
- Reading order fix: whatever sits between the H1 and the first H2 is the document's own framing, so it is lifted above the contents block instead of being stranded after it

**v02.43r — `MEGMEET-LESSON-PLAN.pdf` (5 pages) + fenced code support**
- The lesson plan needed a capability the brief never exercised: **fenced code blocks**, for its two ASCII architecture diagrams. Content is escaped and never inline-processed. Print style is **non-wrapping 7.5pt mono — a wrapped ASCII diagram is a destroyed one**; that fits ~118 columns against a widest-block-in-repo of 92. A wider future block will clip rather than wrap, which is the correct failure mode but is a real limit
- Contents block collapses to one column at ≤6 sections; the lesson plan's five long module titles balanced badly two-up
- **The brief's PDF was rebuilt to check for regression, then reverted** — `cmp -l` found exactly 14 differing bytes, all of them the PDF `/CreationDate`. Re-committing a 350 KB blob to move a timestamp is history churn

**Where we left off:**
- Everything committed, pushed and auto-merged; working tree clean at v02.43r
- Both PDFs delivered to the developer in chat as downloadable files
- **The developer's Megmeet interview is today, Friday 2026-08-14** (`date -d` confirmed the weekday). Both halves of the prep pack are in hand

**Key decisions made:**
- **One skin, not five.** The AIDC report ships in all five registered writing styles and `PROFILER-STYLES.md` carries a standing instruction to mirror skin changes across its consumers. Registering a third consumer for a prep document would take on that maintenance obligation for no reader benefit, so the script hard-codes the canonical `bloomberg` skin and stays out of the registry. **Do not "helpfully" add the other four**
- **The intermediate HTML is staged in a temp dir, not committed.** A committed HTML twin is exactly the drift the design avoids. `--keep-html` writes it beside the PDF when wanted for inspection
- **`REPO-ARCHITECTURE.md` deliberately not updated**, following the v02.33r precedent — the Scripts subgraph carries shared infrastructure only and already omits `check-gas-inner-scripts.js`, `playwright-harness.py` and `build-aidc-report-pdf.mjs`
- **The brief's self-test content gap was flagged, not fixed** — twelve questions, ten answers. Q11 and Q12 are both answered in the body, so it may be deliberate. Developer-owned content; do not write answers into it unasked
- **Both prep documents are registered in the script's `DOCS` map**; a bare `node scripts/build-study-prep-pdf.mjs` rebuilds both. New prep docs are registered by adding a `DOCS` entry

**Active context:**
- Branch `claude/megmeet-interview-brief-pdf-0dn6an` (deleted from remote after each auto-merge; recreate by pushing)
- Repo **v02.43r** · Profiler v01.26w · 9 tracked pages all 🟢 · CHANGELOG counter **93/100**
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders
- **Both PDFs are build artifacts.** Edit either `.md` and the PDF goes stale until `node scripts/build-study-prep-pdf.mjs` is re-run
- **Carried forward from the dropped v02.36r entry (2-session cap):** a parallel session built the voice meeting-notes app — capture and transcription work end to end on real hardware (Whisper `large-v3-turbo` on the developer's RTX 4090 via `scripts/transcribe.ps1`), but **Build B (speaker identification) and Build C (meeting notes + export) are both unstarted**. Whisper does not diarize, so transcripts are one unlabeled run of text. Do not assume that work is finished
- **The container clone is shallow** — `git fetch --deepen=250` first if changelog archive rotation fires and SHA enrichment fails
- **Still open, unchanged from last session:** `AIDC-MARKET-REPORT.md` §6.4 and §8.4 describe the FCC action as a pending China-specific draft, contradicting the refreshed Huawei dossier. The report claims in §9 that every fact traces to a dossier source, so this is an integrity gap

**Recommendation for next session:**
- **Refine the AIDC market report, starting with §6.4 and §8.4.** Unchanged from last session and still the highest-value open item: the report contradicts its own sourcing claim on the FCC action, and correcting it folds directly into the refinement the developer explicitly deferred. Rebuild all five editions afterwards with `node scripts/build-aidc-report-pdf.mjs`
- **To continue:** type `refine the AIDC market report`

## Previous Sessions

**Date:** 2026-08-14 01:59:01 AM EST
**Repo version:** v02.41r

**What we worked on — the AIDC market report became a publishable document, then Megmeet interview prep took over:**

Two distinct arcs in one session. The first turned the existing market report into a real deliverable; the second was triggered by the developer having a Megmeet interview the next morning and ran to a regulatory correction that fed back into the dossier set.

**Arc 1 — the AIDC market report as a document (v02.33r, v02.34r)**
- **v02.33r** — built `repository-information/aidc-market-report-print.html` and `repository-information/AIDC-MARKET-REPORT.pdf`: 29 pages, **12 figures, 17 tables**, typeset to the Profiler `bloomberg` export skin from `PROFILER-STYLES.md` + `Profiler.html`. Added `scripts/build-aidc-report-pdf.mjs`, which drives the pre-installed Chromium over the **DevTools Protocol** rather than the `--print-to-pdf` CLI flag — only `Page.printToPDF` accepts a custom running header/footer, which is how the report got `Page N of M`. Prose competitor lists became comparison tables per the developer's instruction
- **Fixed the "crossed out text" the developer reported** — it was a real Markdown bug, not a rendering glitch: 117 single `~` characters were doing duty as "approximately", and GFM treats a matching pair of single tildes on one line as strikethrough. All replaced with `≈`
- **v02.34r** — issued the report in **all five** registered writing styles. Refactored the stylesheet onto style-scoped CSS custom properties so a skin is ~10 lines of overrides; a bare `node scripts/build-aidc-report-pdf.mjs` renders all five editions **from a single page load**, so they cannot drift in content. Registered the report as a **second display-layer consumer** in `PROFILER-STYLES.md` with a standing instruction to mirror skin changes across both

**Arc 2 — Megmeet interview prep (v02.38r–v02.41r)**
- **v02.38r** — `repository-information/study-prep/megmeet/megmeet-interview-brief.md` plus a published artifact. Deliberately a *companion* to the existing `megmeet-lesson-plan.md`: the lesson plan teaches the physics, the brief teaches the room
- **v02.39r** — retuned for a **sales role** interviewing with **Yuan Meng, Head of NA Sales & Marketing**. Added the NA go-to-market picture, five field objections with answers, and sales-shaped questions
- **v02.40r** — the developer asked whether the FCC inverter ban hurts Megmeet. **The repo's data was stale and their premise was right.** Verified against current sources; added a full section. Also executed the **mandatory changelog archive rotation** (counter hit 101; the 2026-08-02 date group of 11 sections rotated out)
- **v02.41r** — refreshed the **Huawei Digital Power dossier to profileVersion 2** to correct the same stale FCC record; v1 archived per the Archival Procedure

**The FCC finding, because it matters beyond Megmeet:** the rule was adopted **2026-07-28** as an FCC Covered List addition — not the pending China-specific draft the dossiers still described. "Foreign-produced" is a **Buy American domestic-end-product test** (48 CFR 25.101(a); US manufacture + >65% domestic content through 2028, 75% from 2029), so it is an **origin rule, not a China rule** — Delta, Lite-On and US brands manufacturing offshore are caught alike. It is **prospective only** (pre-28-July authorizations survive), and there is a Conditional Approval route through the Department of War or DHS to 2028-01-01 requiring a time-bound US onshoring plan. The definition is a **two-prong test**: bi-directional DC↔AC conversion **AND** remote connectivity via "Wi-Fi, cellular, Bluetooth or another similar connection". Sungrow shed roughly **CNY 100B (~$14.8B)** of market value and is publicly arguing it falls outside the second prong because it restricts connection activity to **wired** links — which independently corroborates the read that wired-managed rack power (Megmeet PSUs, shelves, sidecars, SSTs) sits outside. That wired-vs-wireless question is unresolved and is the variable to watch.

**Where we left off:**
- Everything committed, pushed and auto-merged; working tree clean at v02.41r
- The interview brief artifact is live and updated in place (same URL across all three revisions)
- The developer's interview was imminent at session end — "tomorrow morning" said at ~01:00 EST on Friday 2026-08-14, so plausibly that morning

**Key decisions made:**
- **The report stays undeployed** in `repository-information/` — sales-sensitive, consistent with the prior session's call
- **Chart palette is style-invariant across all five skins.** Validated once with the `dataviz` six checks against the white print surface; re-tinting per skin would mean re-validating five palettes and would put the data layer at the mercy of a typographic choice. Stated in the report's method section rather than left implicit
- **The `bloomberg` edition keeps the unsuffixed filename** as canonical so existing links never break
- **`REPO-ARCHITECTURE.md` deliberately not updated** for the build script — its Scripts subgraph carries shared infrastructure only and already omits `check-gas-inner-scripts.js` and `playwright-harness.py`. Flagged to the developer rather than skipped silently
- **Yuan Meng is not in the dossier and no background was invented.** The brief says so on its face and supplies the *function* instead (Roya Movahedi, CMO US/international, is the only US-facing leader on record). Offered to research them; not taken up
- **The 2026-06-30 FCC draft entry was retained and marked SUPERSEDED**, not deleted — the delta between what was trailed and what was adopted is itself analytically useful
- **The Huawei refresh was a targeted correction, not a full 50–70 source re-research pass** — that is what the developer agreed to. A full sweep is still available

**Active context:**
- Branch `claude/aidc-market-report-pdf-ghbpsi` (deleted from remote after each auto-merge; recreate by pushing)
- Repo **v02.41r** · Profiler v01.26w · 9 tracked pages all 🟢 · CHANGELOG counter **91/100** (headroom restored by this session's rotation)
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders
- **A parallel session is mid-project on the voice meeting-notes app** (see Previous Sessions) — Build B, speaker identification, is unstarted. Do not assume that work is finished
- **The container clone is shallow.** SHA enrichment during changelog rotation failed on all 11 sections until `git fetch --deepen=250` recovered the history; all 50 archive headers now carry commit links. Deepen first next time rotation fires
- **Open thread the developer deferred:** "further refine the AIDC market report" — explicitly saved for later

**Recommendation for next session:**
- **Refine the AIDC market report, starting with §6.4 and §8.4.** Those two sections still describe the FCC action as a pending China-specific draft, which now contradicts the refreshed Huawei dossier — and since the report claims in §9 that every fact traces to a dossier source, that is an integrity gap rather than a cosmetic one. It also folds directly into the refinement the developer deferred, so the correction and the improvement land together. Rebuild all five PDF editions afterwards with `node scripts/build-aidc-report-pdf.mjs`
- **To continue:** type `refine the AIDC market report`
