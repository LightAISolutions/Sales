# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-16 04:23:00 AM EST
**Repo version:** v02.48r

**What we worked on — a Hithium interview brief, then the AIDC report finally got its refinement:**

A long session in two halves. The first built interview prep for a real third-round interview; the second executed the AIDC report refinement that had been the standing recommendation for three sessions.

**v02.44r — `hithium-interview-brief.md` + `HITHIUM-INTERVIEW-BRIEF.pdf` (18 pages, 16 sections)**
- The ask was "a brief like the Megmeet one" for Hithium. Structure mirrors Megmeet's, plus three sections it has no analogue for: a **logistics** block (this round is an on-site visit), a consolidated **regulatory stack**, and a much longer **who you're meeting**
- **Two facts outside the dossier carried the whole brief.** `hithium.profile.json` (profileVersion 3) supplied the company; it does not contain either of these: **(1) Mizhi Zhang was CEO of Sungrow North America**, and before that managing director of the Americas storage business at the Sungrow–Samsung SDI JV — so he has already run the playbook the role exists to execute, and he crossed from the PCS/integrator side to the cell side. **(2) The FEOC / prohibited-foreign-entity regime is the commercial crux of the job** — material assistance cost ratio, ≥55% non-PFE for 2026 construction starts, forfeiture of the *entire* 30–40% ITC on failure
- **Calendar and Gmail settled details the developer did not state:** round 3 is an in-person visit at 4046 Clipper Ct, Fremont, Monday 2026-08-17 11:30 AM PT (room "Muir Woods"; Chris Chung coordinating, 925-584-8408); round 2 was Rumman Kabir, Director of Sales, on 08-12; and the developer had already emailed Rumman about the FCC inverter action, so the brief assumes that thread may have been passed up
- The FCC read is **Hithium-specific and reaches the opposite conclusion from Megmeet's for a different reason** — Hithium's utility products ship as **DC blocks with no PCS**, so the rule's conversion prong is not met on a plain reading; the residential line (integrated inverter + MPPT, wireless) genuinely is exposed

**v02.45r — cycle-life economics explained** (chat only, no file change that push)

**v02.46r — "Beijing's half of the squeeze" added to the brief (→ 21 pages)**
- The Reliance licensing collapse had been a half-sentence in a hedging paragraph. Tracing it established that it is the mechanism making FEOC *structurally* hard: MOFCOM added LFP/LMFP cathode preparation technology to the restricted-technology catalogue **2025-07-15** while **lowering** the thresholds that define scope, then MOFCOM/Customs Announcement No. 58 (**2025-10-09**, effective **2025-11-08**) extended dual-use controls to batteries, cathode and graphite anodes. Technology is **restricted, not prohibited** — a discretionary permission
- **The payload is the two-sided bind:** the workaround for the American material-assistance rule is a structure where a non-prohibited US entity owns production, and that is exactly the transfer Beijing made discretionary. Amara Raja/Gotion is the corroboration; Reliance publicly **denied** pausing, so the brief prescribes "the licensing route stalled under Chinese export controls" and forbids "Reliance halted its gigafactory"

**v02.47r — `hithium-strategy-addendum.md` + PDF (3 pages)**
- Answers "what strategies can I suggest, and how well-positioned is Hithium for US AIDC". Two strategies to lead with (**own the MACR arithmetic**; **sell to the grid, not to the data centre**), five held in reserve, the AIDC read, two questions, a do-not-say list
- **The AIDC verdict is deliberately unflattering: weak.** Binding reason — Hithium has **no rack-layer product** (no BBU, supercap, UPS, PCS or rack form factor), so it cannot play in the storage layer specific to AI. The constructive half is the reframe: *Hithium doesn't need to be inside a data centre to be paid by data-centre demand growth*
- **A hypothesis of mine was wrong and the correction is recorded in the document.** I assumed the Saudi relationship made the Gulf a soft landing for AIDC; Gulf AI investment with the US was conditioned on **divesting Chinese equivalent technology**, so Gulf *AI-data-centre* equipment is where Chinese content is squeezed out. Gulf **grid** storage is wide open (SPPC 3 GW/12 GWh, 27 prequalified)
- Renderer gained two additive short-document options: `toc: false` and an omitted `banner`
- **I promised one page and delivered three.** Trimming a quarter of the words moved the page count not at all — the driver is the letter format, base type and masthead. The document's own framing line was corrected rather than the content cut

**v02.48r — the AIDC market report rewritten as investor education (31 → 155 pages, 9 → 14 chapters)**
- Layout, the three explicit asks: contents is a **single-column index on its own page 2**, and **every chapter opens a fresh page** — both from `page-break-before` on `h2` plus `page-break-after` on `.toc` (Contents is itself an `h2`, so it lands alone on page 2 for free)
- Reframed from sales-strategy to equity-research-desk-teaching-an-investor. Every chapter opens by teaching its subject, defines terms in place, and closes with *What this means for your capital* (23 such passages) plus a named falsifier. Ch1's 12 judgments each became a reasoned subsection; **new Ch2 is a primer**; **new Ch8 consolidates policy**; **Ch10–12 cover all 40 names individually** with a recommended strategy and its reasoning; new Ch14 states provenance
- **The FCC integrity gap is closed** — the standing recommendation from two prior sessions
- Produced by a **14-agent workflow** (13 chapter drafts + 1 adversarial critique), 3.35M subagent tokens, 112 minutes

**Where we left off:**
- Everything committed, pushed and auto-merged; working tree clean at v02.48r
- **The developer has the report and needs time to review it** — that is why this context was saved
- All four Hithium prep documents delivered: brief (21pp), strategy addendum (3pp), and the report (155pp canonical + four style editions)

**Key decisions made:**
- **The brief was closed at 21 pages deliberately.** Past that, additions cost absorption time rather than buying readiness. The strategy addendum was made a **separate artifact** for that reason
- **The report now contains research the dossiers do not.** Policy, Chinese export controls and the FCC correction were verified against live sources 15–16 August. Ch14 **retracts the old blanket "no new research" claim** rather than repeating it. Company facts remain corpus-only
- **The critique agent's findings were verified before being applied — and it was wrong once.** It flagged the ≥12,000-cycle CATL 587 Ah figure as invented; it is real, in the **Hithium** dossier's competitor-positioning field, not `catl.profile.json`. Applying it blind would have deleted a sourced fact
- **`build-aidc-report-pdf.mjs` still renders from the hand-authored `aidc-market-report-print.html`, not the `.md`.** Both were regenerated from the same chapter set in one pass this session, so they are currently in sync — but the drift risk is structural and unfixed
- Three passages that read as **security selection** were recast; a not-investment-advice disclaimer is in the masthead and Ch14

**Active context:**
- Branch `claude/hithium-interview-brief-pdf-uosx99` (deleted from remote after each auto-merge; recreate by pushing)
- Repo **v02.48r** · Profiler v01.26w · 9 tracked pages all 🟢 · CHANGELOG counter **98/100 — archive rotation fires within two push commits**
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders
- **The container has 4 CPUs, so workflow concurrency caps at 2 agents.** A 13-agent fan-out took 112 minutes for that reason — size future workflows against a cap of 2, not 8–16
- **All PDFs are build artifacts.** Edit any `.md` or the print HTML and the PDFs go stale until rebuilt
- **The shallow clone bites on archive rotation** — `git fetch --deepen=250` first if SHA enrichment fails
- **A bug of mine to remember:** a heading-normalisation regex with four capture groups but a three-group replacement prepended the heading-level digit to every heading *and deleted every closing tag* across 673KB. Recovery was `git checkout` + re-apply edits through a script that asserts each replacement applied. Every helper script in the scratchpad now asserts rather than silently no-opping
- **Carried forward:** the voice meeting-notes app's **Build B (speaker identification) and Build C (meeting notes + export) are both unstarted**. Whisper does not diarize, so transcripts are one unlabeled run of text

**Recommendation for next session:**
- **Ask the developer for their read on Chapter 2 and Chapter 8 of the report, then calibrate the teaching level across all 14 chapters in one pass.** Ch2 is the primer everything else leans on and Ch8 is where mechanism-teaching is densest; if those two land at the right altitude the other twelve are calibrated correctly, and if they do not, it is a single dial to turn rather than a chapter-by-chapter guess. Rebuild all five editions afterwards with `node scripts/build-aidc-report-pdf.mjs`
- **To continue:** type `calibrate the report's teaching level`

## Previous Sessions

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
