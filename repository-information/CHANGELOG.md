# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 90/100`

## [Unreleased]

*(No changes yet)*

## [v02.40r] — 2026-08-14 01:42:59 AM EST

> **Prompt:** "Will the recent FCC ban on foreign-made inverters be a problem for Megmeet? Give me a detailed answer"

### Added
- **New section in the Megmeet interview brief — the July 2026 FCC inverter rule** (`repository-information/study-prep/megmeet/megmeet-interview-brief.md`, and the published artifact). Verified against current sources on 2026-08-14 rather than from the dossier, because the dossier is stale on this (see below). Covers: the mechanism (Covered List addition effective 2026-07-28, barring FCC equipment authorization); the two-part definition (bi-directional DC↔AC conversion **and** remote connectivity via Wi-Fi/cellular/Bluetooth "or another similar connection"); the "foreign-produced" test (Buy American *domestic end product*, 48 CFR § 25.101(a) — US manufacture plus >65% domestic component cost through 2028, 75% from 2029); prospective-only application with pre-28-July authorizations grandfathered; and the Conditional Approval pathway through the Department of War or DHS, open until 2026-01-01, requiring a time-bound US onshoring plan
- **A three-bucket exposure assessment for Megmeet**: AI data-center power (PSUs, shelves, sidecar, SST) reads as **probably out of scope but unsettled** — unidirectional AC→DC, none of the enumerated inverter categories, wired management via PMBus and IPMI/Redfish/SNMP rather than wireless; PV/storage/EV-charging components are **genuinely exposed**, with the 40 kW EV-charging module platform launched 2026-07-31 landing three days after the rule took effect; everything else is out
- **The competitive insight that matters commercially**: the rule is an **origin test, not a China test**, so Delta and Lite-On are equally foreign-produced. If the interpretation ever stretches toward IT power it does not hit Megmeet asymmetrically — it hits incumbents with far more US SKUs to re-authorize
- An eighth question for the interviewer, on whether the covered-list action has changed US authorization planning or the US-versus-Thailand manufacturing calculus

### Notes
- **Confidence is explicitly bounded in the brief.** No source located addresses data-center or IT power supplies directly, so the in/out read is stated as inference from the definition rather than a sourced ruling. The FCC's own FAQ and determination PDF both returned HTTP 403 and could not be read; the analysis rests on law-firm alerts (Cooley, Morgan Lewis, Crowell, Covington) and trade press. The brief instructs the developer to say "my read", not "the rule says"
- **Dossier staleness identified and flagged, not silently patched.** `live-site-pages/profiler-data/huawei-digital-power.profile.json` still records this as a **draft, China-specific** rule from the 2026-06-30 Reuters report, with a strategyRead calling the Megmeet spillover "unconfirmed and scope-dependent". Both predate the 2026-07-28 action and its country-agnostic scope. `AIDC-MARKET-REPORT.md` §6.4 and §8.4 carry the same stale framing. Refreshing the Huawei dossier is a Profiler revision (archive + profileVersion bump) and the report refresh was deferred by the developer, so neither was changed here

## [v02.39r] — 2026-08-14 01:18:13 AM EST

> **Prompt:** "sales role, meeting Yuan Meng, head of NA Sales & Marketing."

### Changed
- **Retuned the Megmeet interview brief for a sales role** (`repository-information/study-prep/megmeet/megmeet-interview-brief.md`, and the published artifact at the same URL). The technology chain is retained — the brief now says explicitly that the bar is being credible with an engineer for twenty minutes, not designing a power shelf — and the weight moved to the commercial picture
- **New section — who you're meeting.** Yuan Meng appears nowhere in the dossier or the repo, and the brief says so plainly rather than inventing a background. What it does supply is the *function*: the only US-facing leader on record is Roya Movahedi (CMO, US/international), the quoted spokesperson in every 2025–26 English release and absent from the China filings — evidence, flagged as inference, that the international commercial layer was built recently and separately
- **New section — the North America picture.** Leads on the nuance most candidates will miss: the expected first hyperscaler volume delivery is **domestic**, so North America is greenfield with no reference win to point at. Then the sellable assets (NVIDIA ecosystem seat, the Dallas lab as a sales instrument, the existing Ericsson/Cisco/Juniper/Arista/Accton network-power relationships, full-chain quoting, spec leadership, financed capacity), the design-in sales motion, and the country-of-origin question
- **New section — five field objections** with what each one is really asking and how to answer: Chinese supplier, unproven at scale, shaky financials, Delta owns the socket, and 800 VDC slipping
- **Rewritten questions-to-ask** for a sales counterpart — territory questions, sale-mechanics questions, and a closing question that separates the equity story from the sales motion. **Two new hard questions** (cold account opening; first ninety days) and **two new self-test items**, bringing it to twelve

### Notes
- **The regulatory framing is deliberately fenced.** The brief warns against importing the battery world's 1260H listings, stepped cell tariffs and draft inverter rule into a Megmeet conversation — those are documented for battery and inverter suppliers, and Megmeet is not recorded as being on those lists. Carrying that framing into the room would describe someone else's problem
- No dossier data changed; this remains a derived study artifact

## [v02.38r] — 2026-08-14 01:06:30 AM EST

> **Prompt:** "I want to further refine the AIDC market report, but save that task for later. I am going to interview with Megmeet tomorrow morning and want to quickly learn everything I need to seem like I understand their products, industry position, and recent activities. Organize the information in Megmeet's dossier and output it to me in whichever way you think will be best for me to learn what I need to learn."

### Added
- **`repository-information/study-prep/megmeet/megmeet-interview-brief.md`** (new) — an interview-facing companion to the existing technology lesson plan, organized from the Megmeet dossier (profileVersion 2). Where `megmeet-lesson-plan.md` teaches the physics, the brief covers what an interview actually tests: a 60-second "what do you know about us" answer, the five load-bearing facts, the product chain as the catalogue (grid to SST to sidecar to BBU/supercap to power shelves to M-CRPS to power brick), the competitive position against Delta and Lite-On inside the ~74% Taiwanese bloc, a reverse-chronological activity timeline, four hard questions with model answers, a say/don't-say table, six questions to ask them, a 17-term vocabulary table, and a ten-question self-test with collapsible answers
- Published as a phone-readable artifact for review before the interview — serif and monospace typography with no sans face, a signal-teal accent on warm-neutral paper, both themes token-defined, and the grid-to-GPU power chain rendered as a one-line-diagram ladder with voltage annotations

### Notes
- **Sourcing discipline is explicit throughout.** The brief separates sourced fact from the dossier's labeled analytical reads, and flags the unverified Lite-On displacement report specifically — the company has never confirmed it and its own late-2025 statements contradict it, so asserting it in the room would be a credibility loss. The dossier's moderate-confidence "architecture timing" thesis is marked as an interpretation to be presented as one
- The 27 August 2026 H1 report is surfaced as the central catalyst: the company itself called AI-DC revenue immaterial through 2025 while consensus embeds a roughly six-fold FY2026 profit rebound, so the half-year print is the first hard test
- No dossier data was changed — this is a derived study artifact only. The developer's separate request to further refine the AIDC market report was deferred at their instruction and is **not** actioned here

## [v02.37r] — 2026-08-13 04:34:03 AM EST

> **Prompt:** "continue with your recommendation"
>
> *(The recommendation, from the preceding feasibility answer: build the summarization step — Build C-minimal — before speaker ID, because the pipeline currently ends at a transcript and a transcript is not something you send a customer. Reordered ahead of the prior session's "start Build B" recommendation.)*

### Added
- `Profiler.gs` (v01.09g) — **meeting-notes summarization**. A transcript filed with a note is turned into structured notes (Summary / Discussed / Customer signals / Action items / Open questions) by one Anthropic Messages API call. New `summarize` note op plus `summarizeNoteTranscript_`, `anthropicSummarize_`, `meetingNotesPrompt_`, and the pure `vttToPlainText_`
- `vttToPlainText_` strips the WEBVTT header, cue numbers, timing lines, `NOTE`/`STYLE`/`REGION` blocks and inline cue tags, and collapses consecutive duplicate cues — Whisper repeats a cue's text when a segment spans a boundary, which would otherwise be fed to the model twice. Verified against a synthetic VTT carrying every one of those cases
- Two new Script Properties on the Profiler Apps Script project: `ANTHROPIC_API_KEY` (required — without it the op returns `SUMMARY_NOT_CONFIGURED` and the note keeps its placeholder) and `ANTHROPIC_MODEL` (optional override). Default model is `claude-haiku-4-5-20251001`, chosen because `UrlFetchApp` gives up around 60 seconds and a slow response would cost the whole op; `claude-sonnet-5` is a one-property swap when depth matters more than latency
- `Profiler.html` (v01.26w) — a submit that carried a transcript now chains straight into `summarize` (server signals this with a new `canSummarize` flag, true only for `.txt`/`.md`/`.vtt`/`.srt` attachments), and a **✨ Summarize** button appears on any logged note with a transcript, for retrying a failed run or back-filling notes filed before this existed

### Changed
- `Profiler.gs` — summarization is a **separate op**, not part of `submitFieldNote`: a submit must never fail because the model was slow or the key was missing. The note is written with its placeholder first, then filled in
- `Profiler.gs` — re-running is idempotent rather than stacking. The developer's typed text is captured once into a new `typedText` field on first run and re-prepended every time, so the note is rebuilt as `typed text + fresh summary` and their own words are never consumed (User-Owned Content). `triage` deliberately stays `pending` — a machine summary is an input to promotion, not a decision to promote
- `Profiler.gs` — transcripts over 120,000 characters (~2.5 hours) are truncated rather than failing the request, and the note's `[auto-summary …]` header says so. `listFieldNotes` now returns the new `summarized` date
- `Profiler.html` — notes containing newlines render with `white-space: pre-wrap` in both the read-only log and the manage panel; generated notes are multi-line and a plain `<p>` collapsed them into one run-on paragraph
- `repository-information/ENTERPRISE-SETUP.md` — documents the two new Script Properties, including that the key is unrelated to `GITHUB_TOKEN` rotation

### Notes
- This closes the "summary pending triage" placeholder path for transcripts specifically. Word/PDF attachments still get the placeholder and still wait for a triage pass — `driveReadNoteFile_` only returns text for `.txt`/`.md`/`.vtt`/`.srt`
- The Profiler sequence diagram was checked and not updated: it depicts the note *transport* (`?action=note&nop=…`), not individual ops, so a new `nop` does not change what it shows

## [v02.36r] — 2026-08-13 03:39:36 AM EST

> **Prompt:** "add transcribe.ps1 to the repo. What exactly does adding this launcher to the repo do for me?"

### Added
- `scripts/transcribe.ps1` — PowerShell launcher for local Whisper transcription (`large-v3-turbo`, `--device cuda --compute_type float16 --vad_filter True --language en`, VTT out). Wraps the three things the bare command gets wrong: it calls `whisper-ctranslate2.exe` by full path so the venv need not be activated, prepends every `site-packages\nvidia\**\bin` folder to `PATH` (Windows does not search site-packages, which is what produced `RuntimeError: Library cublas64_12.dll is not found`), and writes each transcript beside its own audio via `--output_dir` so the current directory is irrelevant. Accepts multiple paths via `ValueFromRemainingArguments`, so several files can be drag-dropped onto the window in one go; exits non-zero if any file failed
- Not deployed and not executed by CI — it runs on the developer's own Windows machine against their RTX 4090. Versioning it makes the transcription settings reviewable and diffable, and gives future sessions the exact flag set to mirror when Build A absorbs transcription into the app

### Changed
- `README.md` — `scripts/` tree gains the new entry

## [v02.35r] — 2026-08-13 03:01:32 AM EST

> **Prompt:** "Can you make it so that a transcribed .vtt file is automatically saved in the "2-transcribed" Drive folder instead of the original "1-awaiting-transcription" Drive folder?"

### Added
- `Profiler.html` (v01.25w) — **File transcript** control in the admin note form. One file pick does three things: uploads the `.vtt` into `Profiler App/meeting-recordings/2-transcribed/`, moves its recording out of `1-awaiting-transcription/` to join it, and carries the same file into the note's attachments. Without the audio move the queue folder would keep advertising work that is already done, which is the whole reason the two folders exist
- `ovFileTranscript`, plus `ovDriveList` (folder listing) and `ovDriveMove` (re-parent) — the latter two generalise the PATCH/list calls previously inlined in `ovSweepLooseRecordings`
- `ovBaseName` matches transcript to recording by filename stem, so `catl--2026-08-10--Voice 260810_015240.vtt` claims `…015240.m4a` and leaves every other queued recording alone

### Changed
- `Profiler.html` (v01.25w) — `readFiles` now reads from a new `pendingFiles()` helper that merges the file input with the picked transcript, de-duplicated by name+size so selecting the same file in both controls cannot attach it twice. The save button's empty-note guard and its "Uploading…"/"Saving…" wording read from the same helper
- A failed audio move is reported distinctly from a failed transcript upload — the transcript is already filed at that point, so the whole action must not read as failed

### Notes
- Transcription itself stays on the developer's machine (RTX 4090, `whisper-ctranslate2` with `large-v3-turbo`). Fully unattended filing would need Drive credentials on the PC and its own OAuth flow; this keeps the browser's existing `drive.file` token as the only credential in play

## [v02.34r] — 2026-08-11 02:25:14 AM EST

> **Prompt:** "continue with your recommendation"

### Added
- **The AIDC market report is now issued in all five Profiler writing styles.** `repository-information/aidc-market-report-print.html` carries five presentation skins selected by a `data-style` attribute on `<html>`, each translated from the print-calibrated export CSS in `Profiler.html` so a report handed to a customer reads in the same voice as the app that produced it. New downloadable editions: `AIDC-MARKET-REPORT-analyst-prose.pdf` (Analyst Prose, the Profiler house style), `AIDC-MARKET-REPORT-equity-research.pdf` (Sell-Side Research Note), `AIDC-MARKET-REPORT-intel-briefing.pdf` (Intelligence Community Briefing) and `AIDC-MARKET-REPORT-smart-brevity.pdf` (Axios Smart Brevity). `AIDC-MARKET-REPORT.pdf` keeps its unsuffixed name as the canonical BloombergNEF edition, so existing links do not break
- **Per-style banner in the masthead** naming the active skin. All five ship in the markup and CSS reveals the matching one; each states that the skin changes typography and chrome only. The `equity-research` banner carries the "analytical framing, **not investment advice**" disclaimer that `PROFILER-STYLES.md` rule 1 requires on any dossier issued in that style
- `scripts/build-aidc-report-pdf.mjs` gained `--style <slug>`. **A bare run now renders all five editions from a single page load**, swapping the attribute between `Page.printToPDF` calls — so the editions are structurally incapable of drifting apart in content
- A "Presentation styles" note in the report's own Method & Citation section, stating plainly that the text is identical across the five editions

### Changed
- The print stylesheet was refactored onto style-scoped CSS custom properties (`--accent`, `--body-font`, `--h1-*`, `--h2-*`, `--h3-*`, `--sub-*`, `--mast-rule`, `--pull-bg`). Every rule now reads a slot rather than a raw family, size or colour, so a skin is ~10 lines of variable overrides instead of a duplicated rule block. Chrome that was hardcoded to the Bloomberg blue — section rules, kick line, pull-quote spine, stat-tile rules, timeline axis and dates, contents numbers — now follows `--accent`
- SVG figure numerals follow the active skin's display face via `.fig svg text { font-family:var(--h1-font) }` (a presentation attribute loses to any CSS rule, so no per-figure markup changed)
- `repository-information/AIDC-MARKET-REPORT.md` — the "Formatted edition" pointer became a linked list of all five editions. The brittle page count was dropped rather than re-stated: page counts differ per skin (28–33) and would go stale on any text edit
- `repository-information/PROFILER-STYLES.md` — the report is registered as a **second display-layer consumer** alongside `Profiler.html`, with the standing instruction to mirror skin changes across both in the same commit
- `README.md` — tree entries for the four new editions

### Notes
- **Chart colours are deliberately style-invariant.** The categorical palette was validated once with the `dataviz` six checks against the white print surface; re-tinting it per skin would mean re-validating five palettes and would put the data layer at the mercy of a typographic choice. This is stated in the report's Method section rather than left implicit
- Editions verified by rasterizing and inspecting the actual rendered PDFs, not the markup: Analyst Prose reproduces the Georgia/gold paper document, Intelligence Community Briefing renders fully monospaced with letterspaced ink rules, and the ring-gauge numerals reskin correctly with the chart palette intact

## [v02.33r] — 2026-08-10 11:08:22 PM EST

> **Prompt:** "You just created an AIDC Market Report at this location: https://github.com/LightAISolutions/Sales/blob/main/repository-information/AIDC-MARKET-REPORT.md. Convert it into a professionally-formatted market report (downloadable PDF) that matches the "Bloomberg - Research Report" style that is available on Profiler. Also, create a moderate amount of graphs (bars & circles) when applicable. If you are just listing competitors' products next to each other, display it in a table instead. I see some text that is crossed out, so remove them in the final version. If you need me to reupload the Bloomberg report for your reference, tell me and I will do so."

### Added
- **`repository-information/AIDC-MARKET-REPORT.pdf`** (new) — a 29-page typeset edition of the AIDC market report, styled to the Profiler `bloomberg` export skin defined in `PROFILER-STYLES.md` and `Profiler.html` (Arial body, `#0b62a4` section rules, monospace meta and figure captions, paper-document measure). Carries a running header, a `Page N of M` footer, a masthead with corpus/method/verification/classification metadata, and a two-column table of contents. Report text is unchanged in substance from the Markdown source — the PDF restates it with figures and comparison tables
- **`repository-information/aidc-market-report-print.html`** (new) — the typeset source the PDF renders from. Fully self-contained: inline CSS, inline SVG figures, zero external requests. **12 figures**: 2026 big-four capex (ranged bars), GE Vernova order-book ramp (columns), the queue-versus-compression lead-time chart on one shared month axis (the report's centrepiece), transformer scarcity as three ring gauges, the Colossus 0→1.0 GW ramp, the nuclear price ladder, the 800 VDC milestone timeline, the AI-server BBU market, the Chinese-integrator share donut, the H1 2026 ESS cell-share donut, the BESS block-size leapfrog, and the electrical-contractor duopoly. **17 tables**, including new comparison tables that replace prose competitor lists: behind-the-meter posture by buyer, productized onsite-power offerings, the three named power ODMs, incumbent 800 VDC status, the cell-and-block race, hyperscaler storage posture, the compliant lane, the four BESS demand doors, prefabrication offerings, competitors by lane, the dated trigger calendar, and the risk stack
- **`scripts/build-aidc-report-pdf.mjs`** (new) — renders the HTML to PDF via the pre-installed Chromium over the DevTools Protocol (Node 22's global `WebSocket`; no npm dependencies). `Page.printToPDF` is used rather than the `--print-to-pdf` CLI flag specifically because only the former accepts a custom running header and footer. A `--png` proof mode writes per-page previews for visual review
- `*.pdf binary` added to `.gitattributes` so the committed PDF is never line-ending normalized

### Fixed
- **The crossed-out text in the rendered report** (`repository-information/AIDC-MARKET-REPORT.md`) — 117 single `~` characters were in use as "approximately". GitHub-Flavored Markdown treats a matching pair of single tildes on one line as strikethrough, so lines such as `≈$220B (raised from ≈$200B)` rendered with the span between them struck through. All 117 replaced with `≈`, which renders literally and reads correctly in both the Markdown and the PDF

### Changed
- `repository-information/AIDC-MARKET-REPORT.md` — added a "Formatted edition" pointer to the PDF and its typeset source directly under the metadata line, noting that the Markdown remains the canonical text
- `README.md` — structure-tree entries for the three new files

### Notes
- Chart colours were validated with the `dataviz` skill's six checks against the white print surface before any figure was drawn (categorical palette `#0b62a4 · #c2622a · #1b8a6b · #7a3f7d · #8a8f2a · #b03a34` — worst adjacent colour-vision-deficiency ΔE 8.6, worst normal-vision ΔE 21.8, all six ≥3:1 contrast: all checks pass). Ranges are drawn as hatched extensions rather than separate marks, and every donut wedge is direct-labeled so identity is never carried by colour alone
- Two layout defects were caught by rendering and inspecting the actual PDF pages rather than trusting the markup: Table 6 overflowed the printable width (fixed with `table-layout:fixed` plus `overflow-wrap:break-word`), and long tables were jumping whole to the next page (fixed by letting tables span pages with a repeated header while keeping rows intact)
- `REPO-ARCHITECTURE.md` was deliberately **not** changed — its Scripts subgraph carries shared infrastructure scripts only and already omits `check-gas-inner-scripts.js` and `playwright-harness.py`; a single-purpose document-build script matches those, not the infrastructure tier

## [v02.32r] — 2026-08-10 10:17:55 PM EST

> **Prompt:** "Re-focus back to when you finished compiling all 40 AIDC industry company dossiers and were about to generate the AIDC market report. Do so now. Synthesize directly from the profiles and cite their sources without new research: turbine/transformer scarcity economics, behind-the-meter power (xAI/Crusoe as templates), the 800 VDC transition, BESS competitive dynamics, and the craft-labor bottleneck — shaped as the sales-strategy deliverable for Jon's AIDC power/storage pipeline."

### Added
- **AIDC Market Report** (`repository-information/AIDC-MARKET-REPORT.md`, new) — the sales-strategy deliverable the 40-company Profiler expansion was built for. Synthesized exclusively from the 40 dossiers with no new research: 8 parallel extraction agents returned 572 themed, source-tagged claims (40/40 company coverage), then a 4-agent adversarial verification pass checked 353 report claims against the dossiers (6 errors + 14 nitpicks found, all corrected). Nine sections: 12 confidence-tagged Key Judgments; the demand backdrop; the five requested themes (turbine/transformer scarcity economics, behind-the-meter power with xAI/Crusoe as templates, the 800 VDC transition, BESS competitive dynamics, the craft-labor bottleneck); a sales playbook (40-company account map, entry points/talk tracks, timing triggers keyed to the armed refresh Routines, pipeline risks); and method/citation notes. Every factual claim carries its dossier source label + publication date; `strategyRead`-derived items are labeled [Analysis] with the dossiers' confidence tags preserved
- README structure tree entry for the new report file (`README.md`)

### Changed
- Session context auto-reconstructed at session start (stale v02.30r → v02.31r) from the CHANGELOG per the Session Start Checklist; the v02.24r Previous Sessions entry was removed under the 2-session cap (`repository-information/SESSION-CONTEXT.md`, intermediate commit)

## [v02.31r] — 2026-08-10 08:28:24 PM EST

> **Prompt:** "continue with your recommendation"

### Changed
- **Amazon dossier revised to profileVersion 2** (`live-site-pages/profiler-data/amazon.profile.json`) — added a supply-chain read answering "which BESS OEM does AWS use?", which the dossier previously could not support. Three new confidence-tagged `strategyRead` entries: (High) the three-layer storage-procurement distinction — Layer 1 utility-scale BESS where developers (AES, Primergy) own the OEM decision, Layer 2 behind-the-meter campus BESS where Amazon has no announced deployments (a structural contrast with xAI and Crusoe), Layer 3 rack-level BBU where AI-specific battery demand actually lands; (Low) the Samsung SDI BBU thread — April 2026 reports of final-stage AWS talks on a ~$700M BBU-based UPS supply agreement and July 2026 reports of BBU cells shipping via Taiwan's Simplo with Amazon among end customers, neither company-confirmed, both unnamed-source trade press, with Samsung SDI in parallel talks with Meta and Google; (Low) the Fluence-at-Bellefield inference flagged explicitly as an untested inference from AES's ~28% Fluence stake, with no press release, filing, or trade coverage naming the project's battery supplier
- Six new sources added at their chronological positions (Digitimes, TechTimes, UPI, AsiaToday, AES 2025 annual report; the Bellefield Phase 1 source was already present), each labeled with its confirmation status
- `live-site-pages/profiler-data/archive/amazon.profile.v1.json` + `archive-index.json` — v1 archived per the Archival Procedure before the revision
- `live-site-pages/profiler-data/profiler-companies.json` — Amazon `lastUpdated` synced to 2026-08-10

## [v02.30r] — 2026-08-10 04:42:24 AM EST

> **Prompt:** "I do not see a "Profiler" folder in jonyang92@gmail.com's Google Drive. I would like to see a "Profiler App" folder to mirror my "Receipts App" folder nomenclature. What happened?"

### Fixed

**Root cause.** A Drive search of jonyang92@gmail.com's account confirmed no `Profiler` folder exists (owned or shared) and no `profiler-notes.json` — while `Receipts App` and the loose `Voice 260810_000737.m4a` both sit in that account's root. `DriveApp` inside a GAS web app acts as the account that **deployed** the app, not the signed-in user, so v01.07g's `driveRecFolder_` created its tree in the deployer's Drive. `Receipts App` is visible precisely because it is created **browser-side** with the user's own `drive.file` credential. The v01.07g design was architecturally incapable of producing a folder the user could see; renaming the constant alone would not have fixed it.

#### `Profiler.gs` — v01.08g

##### Removed
- `driveRecFolder_`, `driveRecName_`, `driveFileRecording_`, `driveSweepRootRecordings_`, `driveListPendingRecordings_`, `driveMarkRecordingTranscribed_`, and the `filerec`/`recpending`/`recdone` ops — all operated on the wrong Drive. (Added earlier in this same session; not pre-existing code.)

##### Added
- `recFoldersGet_`/`recFoldersSet_` and the `recfolders`/`setrecfolders` ops — the script's only remaining role is parking the browser's three folder IDs in Script Properties, because `drive.file` cannot re-find a folder it created in an earlier session. Both admin-gated

#### `Profiler.html` — v01.24w

##### Added
- `ovRecFolders`, `ovDriveMkdir`, `ovDriveApi`, `ovRecName`, and `ovSweepLooseRecordings` — the `Profiler App/meeting-recordings/{1-awaiting-transcription,2-transcribed}` tree is now created browser-side with `drive.file`, so it lands in the signed-in user's Drive alongside `Receipts App/`

##### Changed
- `ovDriveUploadAudio(file, slug, onProgress, cb)` resolves the folder tree first and passes `parents: [pendingId]` plus the `<slug>--YYYY-MM-DD--<original>` name on both the multipart and resumable paths, so a recording is never loose in My Drive and needs no post-upload filing step
- The stray sweep moved from note-form render to just after a successful upload. On page load no Drive token exists, so the render-time version could only have worked by provoking a consent popup nobody asked for; after an upload the token is already live. It re-parents root-level audio the app itself created — `drive.file` grants persist per file — which is what relocates the recording uploaded before the folder existed

#### Documentation

##### Changed
- `PROFILER-SCHEMA.md` — Field Notes now documents both Drive trees and why ownership splits them
- `.claude/rules/profiler-app.md` — meeting-audio bullet rewritten for the browser-side tree

## [v02.29r] — 2026-08-10 04:25:55 AM EST

> **Prompt:** "The audio file just got dropped in My Drive without any thought. Create a suitable folder infrastructure to store these in that will make it easy for the user to understand and for the future Transcription function to interact with. Move the most recently uploaded audio file into its folder after the structure is created."

### Added

#### `Profiler.gs` — v01.07g

##### Added
- `Profiler/meeting-recordings/` with `1-awaiting-transcription/` and `2-transcribed/` subfolders, created lazily via the existing `driveChildFolder_` helper. Numeric prefixes force workflow order in the Drive UI so the transcription queue is legible without opening the app. Recordings live under the same `Profiler/` root as `profiler-notes.json` and `note-files/` rather than a parallel tree — the browser's `drive.file` scope cannot see the script-created root, so a browser-side folder would have produced a second, duplicate `Profiler` folder in My Drive
- `driveFileRecording_(fileId, slug)` renames to `<slug>--YYYY-MM-DD--<original>` and moves into the pending folder; `driveRecName_` is idempotent so a re-file does not stack prefixes
- `driveSweepRootRecordings_()` relocates loose audio from My Drive root — root level only, `audio/*` MIME only, capped at `REC_SWEEP_MAX` (50) to stay inside the execution budget, and every move is returned by name so nothing relocates invisibly
- `driveListPendingRecordings_()` and `driveMarkRecordingTranscribed_(fileId)` — the queue read and the pending→transcribed move the transcription pass will need
- Note ops `filerec`, `recpending`, `recdone`, all added to the admin permission gate alongside `submit`/`list`/`edit`/`delete`

#### `Profiler.html` — v01.23w

##### Changed
- `ovDriveUploadAudio` now yields `{ link, id }` via the shared `ovDriveResult` normaliser instead of a bare link — the file ID is what lets the backend file a recording the browser cannot reach
- The upload completion handler calls `filerec` with the file ID and the dossier slug, and reports the destination path in the status line
- A one-shot `filerec` sweep (no file ID) fires when the admin note form renders, guarded by `window._ovRecSwept`, so a recording uploaded before filing existed — or one whose note was abandoned — is put away on the next page load. Silent unless something actually moved

#### Documentation

##### Changed
- `PROFILER-SCHEMA.md` — Field Notes section gains the full Drive tree, the recording filename convention, and the `filerec`/`recpending`/`recdone` contract
- `.claude/rules/profiler-app.md` — meeting-audio bullet documents the filing step and the transcription-pass ops

## [v02.28r] — 2026-08-10 04:13:24 AM EST

> **Prompt:** "I tried to attach a 30 second voice recorder memo via browser files and it stayed "uploading" for many minutes without any Google consent screens popping up. What's wrong? Fix it."

### Fixed
- `Profiler.html` (v01.22w) — The Drive consent popup never opened, so `ovDriveToken`'s callback never fired and the upload hung on "Uploading…" indefinitely. `requestAccessToken()` was being called from an async continuation — inside `ovLoadGis().then(...)`, itself inside the file input's `change` handler — by which point the transient user activation from the tap is gone and mobile browsers silently block the popup. Consent is now requested from the button's `click` handler while the gesture is live, and the file picker opens only after a token is in hand. `ovPreloadGis()` warms the GIS library when the admin form renders so the tap path stays synchronous
- `Profiler.html` (v01.22w) — `initTokenClient` had no `error_callback`. GIS reports `popup_failed_to_open` and `popup_closed` exclusively through that handler, so a blocked or dismissed consent window produced total silence. Added it, mapped to distinct error codes, with `ovDriveErrText` rendering each as an actionable sentence
- `Profiler.html` (v01.22w) — Added a 120 s watchdog around the token request (`ovDriveRequest` settles exactly once via a `done` guard) and an `AbortController` timeout on the multipart upload, so no failure mode can leave the UI waiting forever

## [v02.27r] — 2026-08-10 04:01:03 AM EST

> **Prompt:** "When I attach meeting recording and click voice recorder, it shows that I can only record up to 10 minutes and 27 seconds. Why is that? I want to be able to comfortably record 1-hour long meeting audio, up to 2-hours per meeting even."

### Changed
- `Profiler.html` (v01.21w) — Meeting audio over 6 MB now uploads through Drive's resumable protocol in 8 MB chunks (`ovDriveSendChunk`, XHR so the 308 "Resume Incomplete" responses are readable and `upload.onprogress` gives byte-level progress) with three retries per chunk on exponential backoff. A 1-hour recording is ~50 MB and a 2-hour one ~150 MB — the previous single-shot multipart POST restarted from zero on any connection blip at that size. The multipart path is retained as `ovDriveMultipart` for small files and as the fallback when the resumable session's `Location` header is not readable
- `Profiler.html` (v01.21w) — The upload status line now reports a percentage instead of a static "Uploading…"
- `Profiler.html` (v01.21w) — The recording button is relabelled "🎙 Attach saved recording" and carries a hint directing the developer to record in the phone's own recorder app first and browse to the saved file. The record-now shortcut Android offers inside the file picker is a short-clip capture path (~10 min on a Galaxy A54) and is the wrong entry point for a meeting. `accept` stays `audio/*` on purpose — narrowing to an extension list would grey out any container the list missed, which is a hard block, whereas the picker shortcut is only a wrong turn the hint steers around

## [v02.26r] — 2026-08-10 03:38:54 AM EST

> **Prompt:** "I confirm that Profiler's oauthScopes include https://www.googleapis.com/auth/drive. I then ran _getCacheEpoch and it executed, but I didnt see the consent screen pop up. \n\nStep 0:\n1. I saved a typed note successfully. \n2. I failed to attach the recorded voice recorder clip. See 2nd attached picture. \n3. The log and its copy function works for the typed note. To be tested for the voice recorder clip."

### Fixed
- Meeting-recording upload failed with `google_sign_in_unavailable`. `ovDriveToken` checked for `window.google` directly, but the GIS library is injected on demand by the sign-in flow — on a page load with an existing session that flow never runs, so the library was absent even though the user was signed in. The Drive token request now goes through `ovLoadGis()` first
- CSP `connect-src` did not include `https://www.googleapis.com`, so the Drive multipart upload would have been blocked even once GIS loaded. Added it, matching `Receipts.html` which performs the same upload
- Three note-box status messages still promised the log would update "after the next deploy (~1–2 min)". Notes write straight to Drive with no deploy since v02.25r — the messages now say the note is visible immediately

## [v02.25r] — 2026-08-10 02:17:53 AM EST

> **Prompt:** "all three recommendations, build M3 and M5."

### Security
- Field notes, note attachments, and meeting transcripts moved out of the public repository into the script owner's Google Drive (`Profiler/profiler-notes.json`, `Profiler/note-files/<slug>/`), served only through the GAS backend behind the Master ACL. Previously the log was committed to `live-site-pages/profiler-data/` and was readable unauthenticated via `raw.githubusercontent.com` and `git clone` regardless of the app's sign-in wall
- Deleted the GitHub-issue intake channel (`field-note-intake.yml`, `field-note.yml`, `field-note-file.yml`) — it committed note text into the public repo, recreating the exposure the migration closed
- Removed the `library/` mirror of `profiler-notes.json` and `note-files/` from `auto-merge-claude.yml` so notes are not republished into the second repository
- `claudeone` / `claudepending` read ops gated behind the same server-side `admin` check as `list` — they return full note and transcript text

### Added
- `Profiler.gs` Drive storage layer (`driveNotesGet_`/`driveNotesPut_`/`drivePutNoteFile_`/`driveReadNoteFile_`/`driveDeleteNoteFile_`), folder + file IDs cached in Script Properties; `LockService` serialization retained
- "Copy for Claude" — per-note **📋 Copy** and header **📋 Copy pending** buttons in the ⚙ notes overlay, returning note metadata plus transcript text formatted for pasting into a session. Replaces the automated note read that unattended sessions lose
- M5 meeting-recording upload — browser-side multipart upload to the user's own Drive via `drive.file` (`ovDriveUploadAudio`), storing only the resulting link as `recordingLink`; audio bytes never traverse GAS, so the 6-minute execution ceiling and 50 MB `UrlFetchApp` cap do not apply
- Transcript attachments (`.txt`/`.md`/`.vtt`/`.srt`) accepted alongside Word/PDF in both note forms

### Changed
- Note writes no longer dispatch a deploy — notes are not repo data, so writes are immediate
- `sourceFile` is now a `drive:<fileId>` reference rather than a repo-relative path
- `PROFILER-SCHEMA.md` and `.claude/rules/profiler-app.md` rewritten for Drive storage, including the explicit consequence that scheduled refreshes and the quarterly sweep now run without note context
- Pre-deployment note-box fallback explains the backend is unreachable instead of offering the deleted GitHub form

### Removed
- `live-site-pages/profiler-data/profiler-notes.json` and the repo-write helpers `ghPutFile_`, `ghPutNotes_`, `ghGetSha_`, plus the `NOTES_FILE_PATH`/`NOTE_FILES_DIR` constants

## [v02.24r] — 2026-08-09 11:18:02 PM EST

> **Prompt:** "continue with your recommendation. Also, for all dossiers, change the source formatting to include the article date instead of the accessed date. Then, make sure to organize them chronologically with the most recent news first."

### Added
- **Seven post-earnings refresh Routines armed** for the batch-2 public tickers, following the existing one-shot convention (fresh session, verify-then-refresh, self-re-arming): EVE Energy (fires 2026-08-21 — H1 report expected 08-18/08-20, sources conflicted), ABB (2026-10-21 — Q3 scheduled 10-20 per ABB's calendar), Hitachi Energy (2026-10-24 — parent Hitachi Q2 FY26 expected 10-23), Equinix (2026-10-29 15:00 UTC — Q3 estimated ~10-28, staggered after Meta), Quanta Services (2026-10-30 17:00 UTC — Q3 expected 10-29, staggered after LG Energy Solution), Constellation Energy (2026-11-10 — Q3 confirmed 11-09), Siemens Energy (2026-11-12 — Q4 FY26 call company-announced 11-11; prompt carries the Omterra rebrand note). Report dates verified via web search on 2026-08-09; estimates marked as such in each trigger prompt

### Changed
- **Source format migrated across all 40 dossiers** (`live-site-pages/profiler-data/*.profile.json`): `sources[].accessed` (access date) replaced by `sources[].date` (publication/article date, `YYYY-MM-DD` or `YYYY-MM`; omitted for undated evergreen pages — product pages, IR hubs, market-report landing pages, aggregator quote pages), and every `sources[]` array reordered chronologically with the most recent publication first, undated entries last. Dates derived from URL paths, matching `recentDevelopments` entries, label text, and model knowledge — executed by 8 parallel subagents (5 profiles each), with low-confidence choices reported per batch; all 40 files JSON-validated and ordering-verified programmatically
- `repository-information/PROFILER-SCHEMA.md` — `sources[]` definition updated to the `date` field with newest-first ordering; the "List first-party sources first" citation-order rule replaced (source priority now governs research order only); "Dates everywhere" rule updated
- `live-site-pages/Profiler.html` (v01.17w → v01.18w) — source lists in the app and the Word/PDF export now render the publication date (with a legacy `accessed` fallback for archived pre-migration profiles); meta tag synced
- **Quarterly private-company sweep expanded from 3 to 6 companies** — Crusoe, Huawei Digital Power, and xAI folded into the recurring Routine (renamed "Profiler quarterly check — Hithium, FlexGen, Rosendin, Crusoe, Huawei DP & xAI (private)") with per-company watch items; the xAI entry converts to a post-earnings trigger if the SpaceX IPO completes and quarterly reporting begins
- `.claude/rules/profiler-app.md` — "Currently armed" registry updated with the 7 new one-shot entries (chronological) and the expanded 6-company sweep line

## [v02.23r] — 2026-08-09 11:02:49 PM EST

> **Prompt:** "profiler batch 2 as recommended"

### Added
- **Ten new Intel Briefing dossiers — Batch 2 of the AIDC market-report coverage expansion** (all profileVersion 1, in `live-site-pages/profiler-data/`): xAI (`xai.profile.json`), Crusoe (`crusoe.profile.json`), Equinix (`equinix.profile.json`), Constellation Energy (`constellation-energy.profile.json`), Siemens Energy (`siemens-energy.profile.json`), Hitachi Energy (`hitachi-energy.profile.json`), ABB (`abb.profile.json`), Huawei Digital Power (`huawei-digital-power.profile.json`), EVE Energy (`eve-energy.profile.json`), Quanta Services (`quanta-services.profile.json`). Researched via 20 parallel subagents — two per company (first-party IR/press/product + third-party filings/consensus/trade press per the Source Priority Protocol), all sources accessed 2026-08-09. Categories: supplier ×5 (Siemens Energy, Hitachi Energy, ABB, Huawei Digital Power, EVE Energy), hyperscaler ×2 (xAI, Equinix), developer ×2 (Crusoe, Constellation Energy), integrator ×1 (Quanta Services). Unconfirmed/press-only items flagged (Low confidence) throughout — e.g. xAI combined-fleet GPU/2 GW tracker figures, Crusoe valuation marks, Constellation PPA pricing (analyst estimates), the EVE DoD 1260H listing (Reuters-relayed), Huawei sub-segment claims, the Siemens Energy Omterra rebrand's ticker implications. Render-verified headlessly: 40 home cards, all 10 dossiers show BLUF summaries and Key Judgments with zero page errors
- `live-site-pages/profiler-data/profiler-companies.json` — 10 new registry entries with IC-voice taglines; roster now 40 companies
- `README.md` — tree entries for the 10 new profile JSONs

## [v02.22r] — 2026-08-09 10:24:17 PM EST

> **Prompt:** "profiler batch 1 as recommended"

### Added
- **Ten new Intel Briefing dossiers — Batch 1 of the AIDC market-report coverage expansion** (all profileVersion 1, in `live-site-pages/profiler-data/`): Vertiv (`vertiv.profile.json`), Delta Electronics (`delta-electronics.profile.json`), Eaton (`eaton.profile.json`), Schneider Electric (`schneider-electric.profile.json`), GE Vernova (`ge-vernova.profile.json`), LITEON (`liteon.profile.json`), Oracle (`oracle.profile.json`), OpenAI (`openai.profile.json`), CoreWeave (`coreweave.profile.json`), Bloom Energy (`bloom-energy.profile.json`). Researched via 20 parallel subagents — two per company (first-party IR/press/product + third-party filings/consensus/trade press per the Source Priority Protocol), all sources accessed 2026-08-09. Categories: supplier ×6 (Vertiv, Delta, Eaton, Schneider, GE Vernova, LITEON, Bloom), hyperscaler ×3 (Oracle, OpenAI, CoreWeave). Unconfirmed/press-only items flagged (Low confidence) throughout — e.g. the reported Goldman NT$4,500 Delta target, Megmeet power-shelf displacement reports, OpenAI press-reported financials (no audited statements exist), the reported $2B Delta–Infineon SiC deal. Render-verified headlessly: 30 home cards, GE Vernova and OpenAI dossiers show BLUF summaries and Key Judgments with zero page errors
- `live-site-pages/profiler-data/profiler-companies.json` — 10 new registry entries with IC-voice taglines; roster now 30 companies
- `README.md` — tree entries for the 10 new profile JSONs

## [v02.21r] — 2026-08-09 06:09:32 PM EST

> **Prompt:** "continue with your recommendation"

### Added
- **Nine post-earnings refresh Routines armed** for the new public tickers, following the existing one-shot convention (fresh session, verify-then-refresh, self-re-arming): NVIDIA (fires 2026-08-27 — Q2 FY2027 company-confirmed for 08-26), Jinko (2026-08-28 — JKS Q2 est. 08-27 / A-share H1 deadline 08-31), Samsung SDI (2026-10-28 15:00 UTC — Q3 listed 10-27; staggered after Wärtsilä), Google (2026-10-28 17:00 UTC — Q3 confirmed 10-27), Microsoft (2026-10-28 19:00 UTC — FY2027 Q1 est. 10-27), Meta (2026-10-29 — Q3 est. 10-28), Amazon (2026-10-30 — Q3 est. 10-29), LG Energy Solution (2026-10-30 15:00 UTC — Q3 est. ~10-29; staggered after Amazon), Panasonic (2026-10-31 — FY2027 Q2 est. ~10-30). All report dates verified via web search on 2026-08-09; estimates are marked as such in each trigger prompt and the fired sessions confirm before refreshing

### Changed
- **Rosendin folded into the private-company quarterly sweep** — the recurring Routine (Jan/Apr/Jul/Oct 1) renamed "Profiler quarterly check — Hithium, FlexGen & Rosendin (private)" with Rosendin watch items added (data-center project awards, BESSUPS rollout with FlexGen, EPC storage wins, ESOP/leadership changes)
- `.claude/rules/profiler-app.md` — "Currently armed" registry updated with the 9 new one-shot entries (chronological) and the expanded 3-company sweep line

## [v02.20r] — 2026-08-09 05:59:18 PM EST

> **Prompt:** "Profiler LG Energy Solutions, Panasonic, Samsung SDI, Jinko, NVIDIA, Meta, Google, Amazon, Microsoft, Rosendin using Fable 5."

### Added
- **Ten new Intel Briefing dossiers** (all profileVersion 1, in `live-site-pages/profiler-data/`): LG Energy Solution (`lg-energy-solution.profile.json`), Panasonic (`panasonic.profile.json`), Samsung SDI (`samsung-sdi.profile.json`), Jinko (`jinko.profile.json`), NVIDIA (`nvidia.profile.json`), Meta (`meta.profile.json`), Google (`google.profile.json`), Amazon (`amazon.profile.json`), Microsoft (`microsoft.profile.json`), Rosendin (`rosendin.profile.json`). Researched via 20 parallel subagents — two per company (first-party IR/press/product + third-party filings/consensus/trade press per the Source Priority Protocol), ~50–70 sources evaluated per company, all accessed 2026-08-09. Categories: supplier ×5 (LGES, Panasonic, Samsung SDI, Jinko, NVIDIA), hyperscaler ×4 (Meta, Google, Amazon, Microsoft), integrator ×1 (Rosendin). Unconfirmed/press-only items are flagged (Low confidence) throughout — e.g. Samsung SDI–Tesla/Amazon ESS deal reports, Meta TPU purchase reports, the NVIDIA–OpenAI $250B backstop report. Render-verified headlessly: 20 home cards, NVIDIA and Google dossiers show BLUF summaries and Key Judgments with zero page errors
- `live-site-pages/profiler-data/profiler-companies.json` — 10 new registry entries with IC-voice taglines; roster now 20 companies
- `README.md` — tree entries for the 10 new profile JSONs

## [v02.19r] — 2026-08-09 05:09:33 AM EST

> **Prompt:** "Voice approved. However, remove "Company Name - Profiler" from the top right and the URL from the bottom left of the export documents."

### Fixed
- `live-site-pages/Profiler.html` (v01.17w) — the "Company — Profiler" title (top right) and page URL (bottom left) on PDF exports were the **browser's own print header/footer**, drawn in the page margins during `window.print()`. Suppressed via `@page { margin: 0; }` in the print pipeline (no margin box → nothing for the browser to draw, per Chrome's documented behavior); `#ov-prev-doc` print padding changed from `0` to `12mm 14mm` so the document carries its own page margins. Verified via headless print-CSS PDF (9-page Megmeet export): page 1 clean with proper margins, no header/footer artifacts. Known tradeoff: continuation pages start near the paper edge (element padding doesn't repeat per page) — disclosed to the developer with a riskier `@page :first` alternative offered

## [v02.18r] — 2026-08-09 04:46:49 AM EST

> **Prompt:** "Rewrite all dossiers, their home-page descriptions, and export styles in Style 4: Intel Briefing - IC Assessment."

### Changed
- **All 10 dossiers rewritten in the Intel Briefing style** (`live-site-pages/profiler-data/*.profile.json`) — facts unchanged, voice converted: every `summary` now opens with a BOTTOM LINE UP FRONT sentence followed by a BACKGROUND section; analytic `ecosystemRole` claims reframed as "We assess … Basis: …"; Megmeet's `strategyRead` converted to confidence-tagged judgments; and the nine dossiers that had no `strategyRead` each gained a new 4-bullet **Key Judgments** array — "(High/Moderate/Low confidence) We assess …" — synthesized strictly from each dossier's existing sourced facts (no new research). Colloquial development takeaways IC-ified (e.g. Megmeet's "self-deflation of the AI hype", CATL's "pencil out"). All `profileVersion` +1 (megmeet → 2, rest → 3), `lastUpdated` 2026-08-09
- `live-site-pages/profiler-data/profiler-companies.json` — all 10 home-page roster taglines rewritten in IC-terse voice with attribution/watch-item framing
- **Export styles**: no code change needed — exports already render through the intel-briefing skin shipped in v02.17r (v01.16w), so the rewritten prose flows into the app, Word, and PDF automatically
- Archived all 10 outgoing versions per the Archival Procedure (`archive/megmeet.profile.v1.json`, `archive/<slug>.profile.v2.json` ×9; `archive-index.json` updated)
- Render-verified headlessly: BYD dossier shows Background/Key Judgments/Technical Annex sections, BLUF lead, and 4 numbered confidence-tagged judgments with zero console errors

## [v02.17r] — 2026-08-09 04:30:58 AM EST

> **Prompt:** "Set profiler style to #4: intel-briefing. Also make sure that the export document (doc/pdf) has a formatting style and spacing that matches the writing style. Create a style button that is only visible to Admins that allows the user to change the Profiler app + export styles between these five styles."

### Added
- `live-site-pages/Profiler.html` (v01.16w) — dossier display-style engine: per-style section-label maps (`OV_SEC_LABELS`), app-side typography skins (`ov-sty-*` on `#ov-app`), export-document skins on `#ov-prev-doc` (preview + PDF print), and style-matched inline Word CSS in `ovWordExport` — Bloomberg (Arial, blue numbered headings, "Figure N:" captions on spec/financial tables), Equity Research (thesis banner with not-investment-advice note), Intel Briefing (Courier typewriter document, numbered KEY JUDGMENTS `<ol>`, COMPILED FROM OPEN SOURCES banner), Smart Brevity (bold sans axiom headers). Admin-only **🖋 style button** (z-index 8900, gated on `ov_note_role === 'admin'` like Versions 🕘, shown on wall pass) opens a picker overlay; choice persists per-device in localStorage `ov_style`; `OV_DEFAULT_STYLE = 'intel-briefing'` mirrors the registry's Active style. Verified headlessly: five app/export screenshots + admin/non-admin gating, zero console errors

### Changed
- `repository-information/PROFILER-STYLES.md` — **Active style: `intel-briefing`** (was `default`); new "Display layer" bullet documenting the `OV_DEFAULT_STYLE` sync rule and the admin 🖋 switcher
- `.claude/rules/profiler-app.md` — switching procedure now includes the `OV_DEFAULT_STYLE` sync; display-layer architecture documented
- `README.md` — Profiler tree entry version display → v01.16w

## [v02.16r] — 2026-08-09 04:00:40 AM EST

> **Prompt:** "I tested both my admin jonyang92@gmail.com account and a test contributor jymiasole01@gmail.com account and Profiler works as intended. Only jonyang92@gmail.com could see the version history while jymiasole01@gmail.com could not. Regarding the dossier writing style, save it down as the default style and then let me see several mock-ups of what the dossier writing style would be after analyzing and integrating the attached Bloomberg report's writing style and formatting. Save that down as the Bloomberg style. If you have alternative reporting styles besides Bloomberg to show me, give me mock-up suggestions of those as well."

### Added
- `repository-information/PROFILER-STYLES.md` — dossier writing-style registry (single source of truth for how dossier prose is written; **Active style: `default`**). Codifies the current authoring conventions as the **Default style**; defines the **Bloomberg style** from a formatting/style analysis of the developer-supplied BloombergNEF "US Data Center Outlook — The Age of AI" report (exec-summary lead + Summary findings bullets, mandatory inline comparators, taxonomy/run-in-italic bullets, Figure captions with Source/Note lines, unhedged declarative voice, one dry aside per section); and adds three alternatives — `equity-research` (sell-side note: thesis banner, "we" voice, bull/bear key debates, dated catalysts), `intel-briefing` (IC assessment: BLUF, confidence-tagged key judgments mapped to the field-note 0–100 bands, indicators to watch), and `smart-brevity` (Axios form: one-line lede + fixed axioms). Every style carries a like-for-like Megmeet mock-up (summary → AI-DC positioning → FY2025 results development → strategy read)

### Changed
- `.claude/rules/profiler-app.md` — new "Dossier Writing Styles" section registering the styles file (read-before-authoring rule, switching procedure, styles-never-override-schema-rules); Profiler Command step 4 now requires prose in the active style
- `CLAUDE.md` — Profiler Command section now points at the writing-style registry alongside the data schema
- `README.md` — `PROFILER-STYLES.md` added to the repository tree

## [v02.15r] — 2026-08-09 03:29:35 AM EST

> **Prompt:** "I'd rather have a sign-in wall on the whole app like the Receipts app in order to control who gets to view my valuable dossiers. Also, I want Admins to be the only ones that are able to view previous dossier versions (everyone else should only see the current version). Since I want my friends to be able to export documents and type field notes to me, shouldn't I give them "contributor" roles instead of just "viewer" roles?"

### Added
- `live-site-pages/Profiler.html` (v01.15w) — full-app sign-in wall (`#ov-authwall`, z-index 9000, app-branded): the UI is blocked until a session validates (`whoami` on load for stored sessions; GIS popup sign-in otherwise), reusing the note backend's session machinery — same account system as Receipts (its extra HIPAA/single-tab hardening intentionally not ported). Wall skips only when `_e` is empty (pre-deployment fallback). Non-ACL sign-ins are rejected by the exchange with a "ask Jon to add you" hint
- **Versions 🕘 is now admin-only** — the previous-versions button renders only for admin sessions; the notes ⚙ cog dropped to z-index 8900 so it sits under the wall while signed out

### Changed
- `.claude/rules/profiler-app.md` — auth wall, admin-only versions, and the `contributor` role decision documented (role already existed in `RBAC_ROLES_FALLBACK` with no `admin` permission — no backend change needed; friends' ACL rows use Role = `contributor`)
- **Data-privacy caveat re-disclosed**: the wall gates the app experience; the underlying data files (profiles, notes, archives) remain on public GitHub Pages and are fetchable by direct URL. True data privacy = GAS-served data or GitHub Enterprise Pages access control — both offered as follow-ups, neither built

## [v02.14r] — 2026-08-09 03:03:41 AM EST

> **Prompt:** "I plan to share this Profiler app with my work friends later on, so copy Scraper and Receipt's Google sign-in and account structure. In the MasterACL spreadsheet, I want Profiler's sign-in application to be named "Profiler", so change the "In-dossier field-note intake for the Profiler app" name to "Profiler Field Notes". Also, I want other users besides me to only be able to view the dossiers and use the export and study guide features, as well as a limited-version field note feature. Limited version means that they can submit typed notes, attach documents, and add a confidence level, but it gets sent to "jonyang92@gmail.com" via email for consideration instead of being automatically saved into the Profiler app and bess-aidc-library database. Recommend the best way to accomplish the separation of power between me and other users above."

### Added
- `googleAppsScripts/Profiler/Profiler.gs` (v01.05g) — separation of power, enforced server-side: `submit`/`list`/`edit`/`delete` now require the `admin` permission (Master ACL role `admin`/`developer`); all other ACL-approved signed-in users get the new `suggest` op — same inputs (typed note, up to 3×8 MB Word/PDF attachments, source type, 0–100 confidence) but the suggestion is emailed to `NOTE_SUGGEST_EMAIL` (jonyang92@gmail.com) via MailApp with files as real attachments, and nothing is committed. New `whoami` op returns the session's role for UI branching. `PORTAL_DESCRIPTION` → "Profiler Field Notes" (Master ACL registration name; `ACL_PAGE_NAME` stays "Profiler" — the sheet column) + config sync
- `live-site-pages/Profiler.html` (v01.14w) — role-aware note box: sign-in stores the role from the exchange (`admin` vs `member`); admins get the full form + Manage panel, members get the suggest form ("goes to Jon for review"); a `whoami` check covers sessions that predate role tracking, and an `ADMIN_ONLY` server response live-downgrades a stale admin UI to suggest mode. All three branches verified headlessly with a stubbed backend (member suggest send, admin regression, stale-admin downgrade)
- `.claude/rules/profiler-app.md` — separation-of-power rules documented (server-side boundary, suggested-confidence-is-advisory, acceptance flow)

### Changed
- Sign-in/account structure note: Profiler already shares Scraper/Receipts' exact auth machinery (same GIS client, token exchange, session system, Master ACL spreadsheet) — this change wires the missing role layer through it; dossier viewing, export, and study guides remain public page features requiring no sign-in

## [v02.13r] — 2026-08-09 02:41:47 AM EST

> **Prompt:** *(same interaction — live API verification after the v02.12r deploy)* Curl probes against the deployed note API returned `{"success":true,...}` for a bogus session token, exposing that the standard preset's `ENABLE_DATA_OP_VALIDATION: false` made the fetch-exposed note ops effectively unauthenticated.

### Security
- `googleAppsScripts/Profiler/Profiler.gs` (v01.04g) — `PROJECT_OVERRIDES.ENABLE_DATA_OP_VALIDATION: true`: every note op now runs full session validation (the preset's `false` assumed `google.script.run` transport, only reachable from the signed-in served page — an assumption the public fetch route broke). Plus a defense-in-depth guard in `handleNoteOp_` rejecting missing/short tokens before dispatch, so a future toggle regression cannot silently reopen the ops. Live-verified post-deploy: bogus sessions now receive `SESSION_EXPIRED`

### Fixed
- Confirmed the POST transport is sound for browsers (302 → GET on the echo URL returns clean JSON) — the apparent POST failures during verification were a curl `-L -X POST` artifact, not a client bug

*(Counter reads 101/100 legitimately: all 6 over-limit sections are dated today (EST) and today's sections are rotation-exempt; 95 non-exempt sections remain under the cap.)*

## [v02.12r] — 2026-08-09 02:37:16 AM EST

> **Prompt:** "The embedded box and fallback link both fail and shows the same Google Drive "sorry" message as above"

### Fixed
- `live-site-pages/Profiler.html` (v01.13w) — the note box no longer loads the GAS app as a document at all. The top-level fallback failing too proved this isn't a framing problem: on the developer's phone, ANY cookie-carrying document-load of `/exec` (framed or top-level) dies in Google's multi-account routing, while anonymous requests serve fine — the exact conclusion the fleet already reached (Receipts' `TOKEN_EXCHANGE_METHOD: 'fetch'` comment: iframe transports "stop working when Google blocks framed /exec responses"). Rebuilt the note box as **native page UI**: GIS sign-in popup on the parent (fleet CLIENT_ID, `openid email profile`), token exchanged for a session via the existing fetch exchange route, then all note ops over cookie-less `fetch()` — typed notes, Word/PDF upload (POST body, 3 × 8 MB), and the full manage panel (list/inline edit/delete), all in place. CSP extended to the fleet's GIS + script.google.com allowances. Full flow verified headlessly with a stubbed backend (sign-in state, save, list, edit, delete — zero page errors)
- `googleAppsScripts/Profiler/Profiler.gs` (v01.03g) — new `handleNoteOp_` fetch dispatcher: `doPost(action=note)` + GET api-route mirror (`action=api&op=note`), ops `bootstrap`/`submit`/`list`/`edit`/`delete` (param `nop`), session-validated via the existing machinery, JSON via ContentService (anonymous serving path)
- `repository-information/diagrams/profiler-diagram.md` — updated to the fetch architecture (pako URL regenerated + decompression-verified)

## [v02.11r] — 2026-08-09 02:20:26 AM EST

> **Prompt:** "I wanted to add a field note, but this is what I saw. Resolve it." *(screenshot: the note-box iframe showing Google Drive's "Sorry, unable to open the file at this time" error)*

### Fixed
- `live-site-pages/Profiler.html` (v01.12w) — the note-box iframe now loads **credentialless** (cookie-less), matching the current template pattern used by Receipts: cookie-carrying framed `/exec` requests hit Google's multi-account `/u/N` routing and fail with the Drive error the developer screenshotted; the anonymous path avoids it (sessions travel in the URL, not cookies). Root cause: the inline note-box iframe was written against the older template block still present in Profiler.html, which predates the credentialless fix

### Added
- `live-site-pages/Profiler.html` — "Open the note form in its own tab ↗" link under the note box: a top-level `/exec` visit never hits the framed-routing failure, so this fallback always works (also useful as a deliberate full-screen mode)

## [v02.10r] — 2026-08-09 01:59:52 AM EST

> **Prompt:** "I plan to test with a fake field note, so build me a way to see, edit, and delete previously submitted field notes. Then, I'll test adding and deleting field notes. Also, explain to me how you will evaluate which field notes are relevant enough to display in the dossier vs which just get saved but not displayed."

### Added
- `googleAppsScripts/Profiler/Profiler.gs` (v01.02g) — note management: server functions `listFieldNotes` / `updateFieldNote` / `deleteFieldNote` (session-validated, lock-serialized; edits stamp `edited: YYYY-MM-DD`; deletes remove the log entry and best-effort delete the attached note file via a new `ghGetSha_` + contents DELETE; shared `ghPutNotes_` helper) and a "Manage existing notes" panel in the served form UI (list with metadata, inline edit textarea + confidence select, delete with confirm; wrapped in try/catch so a fault can never block the auth flow). Client logic verified via a stubbed-backend Playwright harness (list → edit → delete round-trip, zero page errors)
- `repository-information/PROFILER-SCHEMA.md` — `notes[].edited` field; `submittedVia` now documents the `profiler-intake` value; clarified that the never-alter constraint binds Claude's triage, not developer edits
- `.claude/rules/profiler-app.md` — note-management capability documented under the second capture channel

## [v02.09r] — 2026-08-09 01:30:51 AM EST

> **Prompt:** "Profiler deployment ID: <AKfycbwnpv-PYXK_7Wvp5ZAtnhZawcTWgc-8Df_1qKKoLsg9gGawIukAzU7H14aw9DOrVSJ3Tw>"

### Changed
- `googleAppsScripts/Profiler/Profiler.config.json` + `Profiler.gs` (v01.01g) — real `DEPLOYMENT_ID` synced in ([PC-GAS-CONFIG] #14); the "Deploy Profiler" workflow step now fires on `.gs` merges
- `live-site-pages/Profiler.html` (v01.11w) — `var _e` set to the obfuscated deployment URL (reverse + base64, round-trip verified) — the in-dossier note box now renders the GAS intake form; GitHub-form fallback retired from the live path
- `repository-information/ENTERPRISE-SETUP.md` — recorded the new `profiler-intake-writer` fine-grained PAT (Sales-scoped, Contents R/W + Actions R/W, no expiration, stored as the Profiler GAS project's `GITHUB_TOKEN` Script Property)

## [v02.08r] — 2026-08-09 01:11:29 AM EST

> **Prompt:** "Can you modify the field note to be functional by itself without re-routing the user to the GitHub form? I'd like to be able to type some notes and/or upload meeting notes directly from the Profiler app."

### Added
- `googleAppsScripts/Profiler/Profiler.gs` (v01.00g) — Profiler GAS intake app (restored from the v02.04r-removed ProfilerIntake scaffold, renamed to page-convention naming and completed): Google-sign-in + Master-ACL gated form served in-app; `submitFieldNote` now accepts Word/PDF attachments (up to 3 × 8 MB, base64) alongside/instead of typed text — files commit to `repository-information/note-files/<slug>/` via the GitHub contents API (`ghPutFile_`), notes commit to `profiler-notes.json` (lock-serialized, `submittedVia: "profiler-intake"`), then `ghDispatchDeploy_` best-effort dispatches the deploy workflow. Served UI gains a file picker + `?slug=` dossier prefill (sanitized doGet interpolation)
- `googleAppsScripts/Profiler/Profiler.config.json` — project config (real Master-ACL spreadsheet ID; `DEPLOYMENT_ID` placeholder until the one-time Apps Script deployment)
- `live-site-pages/gs-versions/Profilergs.version.txt` (`|v01.00g|`), `live-site-pages/gs-changelogs/Profilergs.changelog.md` + archive — page-convention GAS tracking files (the GAS version pill on Profiler auto-activates)
- `live-site-pages/Profiler.html` (v01.10w) — GAS-backed note box: the template's full-screen iframe injection is PROJECT-OVERRIDDEN to stash the decoded URL in `window._gasNoteUrl`; each dossier's "Add a Field Note" section renders an inline iframe (`?slug=<company>` prefill) where the developer types and/or uploads directly. GitHub-form flow remains as automatic fallback while `DEPLOYMENT_ID` is a placeholder
- `.github/workflows/auto-merge-claude.yml` — "Deploy Profiler" GAS self-update step (placeholder-gated, standard POST + GET-fallback webhook)
- `repository-information/diagrams/profiler-diagram.md` — per-environment diagram restored and corrected for the inline note-box iframe design (pako URL regenerated + decompression-verified)
- `.claude/rules/gas-scripts.md` — Profiler row in the GAS Projects table + `Profiler.html` added to the path scope

### Changed
- `.claude/rules/profiler-app.md` — second capture channel rewritten: GAS-backed in-app intake is primary once deployed; GitHub issue form documented as the fallback mode
- `repository-information/REPO-ARCHITECTURE.md` — `GAS_PROFILER` node + edges added to the flowchart and class diagram (both pako URLs regenerated + decompression-verified)
- `README.md` — Profiler tree entry gains the ⛽ GAS link and v01.00g changelog link; new entries for the GAS project dir, gs version/changelog files, and per-environment diagram

## [v02.07r] — 2026-08-08 10:36:20 PM EST

> **Prompt:** "Purge the test notes. Also, I don't see a "Add a Field Note" option, much less an option to upload meeting notes in word doc or pdf format. Resolve these issues."

### Added
- `live-site-pages/Profiler.html` (v01.09w) — "Field note 📝" button in the dossier header (next to Export) that scrolls to the note box and focuses it; the box was rendering correctly but sat below every dossier section (33 sources deep on BYD), making it effectively invisible — root cause of "I don't see it"
- `live-site-pages/Profiler.html` — "Upload Word/PDF 📎" button in the note box and a "📎 File" shortcut in the ⚙ Field Notes overlay header, both opening the new file-upload issue form prefilled with the company
- `.github/ISSUE_TEMPLATE/field-note-file.yml` — 📎 Field note file form: company/source/confidence dropdowns + a textarea where the developer attaches the .docx/.pdf (GitHub issue textareas accept file attachments natively)
- `.github/workflows/field-note-intake.yml` — new `commit-file-note` job for `field-note-file` issues: validates fields, extracts `user-attachments` URLs, downloads the document(s) to `repository-information/note-files/<slug>/YYYY-MM-DD-<name>` (never deployed; mirrored to the library), logs a placeholder note with `sourceFile` set (`[file note: <name> — summary pending triage]`), commits, dispatches the deploy, and closes the issue. Parser rejection paths (no attachment, non-Word/PDF, download failure) tested locally against the real regexes
- `.claude/rules/profiler-app.md` — documented the in-app upload variant of the third capture channel; triage passes must replace placeholder file notes with faithful summaries

### Changed
- `.github/ISSUE_TEMPLATE/field-note.yml` — intro now points to the file form instead of "send the file to Claude"

### Removed
- The two intake-pipeline test notes (`note-20260808-01`, `note-20260808-02`) from `live-site-pages/profiler-data/profiler-notes.json`

## [v02.06r] — 2026-08-08 10:19:41 PM EST

> **Prompt:** "start phase R3"

### Added
- **Phase R3 — Business monthly line-items ledger** (`live-site-pages/Receipts.html` v01.33w, client-side only — no GAS change): each `<Company>/<Year>/<Month>` folder gains a `Line Items - <Month> <Year>.csv` maintained via the user's `drive.file` credential. New PROJECT-block module: `_csvEscape`/`_dateFromReceiptId` (ID's `YYYYMMDD` suffix locates rows across edits)/`_bizCsvName`/`_buildLedgerRows` (no-items receipts get a single `(no itemized lines)` row), `_updateBizLedger` (read-modify-write: drop rows by trailing `,ReceiptID` match, append, PATCH-media update or multipart create), `syncBusinessLedger` (removes from old-ID/new-ID/printed-date months, appends to the printed-date month — handles date edits moving a receipt across months), `removeFromBusinessLedger`
- Save hook runs PDF → ledger **sequentially** (they share the folder tree; racing find-or-create could duplicate folders) with a combined status; delete hook drops ledger rows; a Business→Personal flip now trashes the PDF, clears its registered link, and removes ledger rows

### Verified
- `node --check` on inline scripts; the page's exact CSV functions run in Node on real data — quote/comma escaping, row removal by receipt ID, month filenames, date-from-ID incl. collision suffixes, no-items fallback; Playwright smoke load with zero page errors

## [v02.05r] — 2026-08-08 10:18:39 PM EST

> **Prompt:** *(follow-up within the same interaction — end-to-end intake test)* The first live test of the field-note pipeline (issue #1) committed the note to `main` correctly, but the deploy never ran: pushes made with the built-in `GITHUB_TOKEN` do not trigger `push`-event workflows (GitHub recursion prevention), so the note was invisible on the live site.

### Fixed
- `.github/workflows/field-note-intake.yml` — after committing a note, the workflow now explicitly dispatches `auto-merge-claude.yml` on `main` (`gh workflow run`); `workflow_dispatch` events are exempt from GITHUB_TOKEN recursion prevention, so the deploy + library mirror run and the note appears in the Profiler ⚙ changelog. Added the required `actions: write` permission and corrected the header comment that wrongly claimed the push alone would trigger the deploy

## [v02.04r] — 2026-08-08 10:11:17 PM EST

> **Prompt:** "What is the purpose of this new Profiler Intake project? Is there any way to accomplish my goal without creating a new project?" *(followed by the form answer: "I would like the option to either type small amounts of information in an input box in a target company's dossier and also the option to upload notes via a word doc or PDF.")*

### Added
- `.github/ISSUE_TEMPLATE/field-note.yml` — "📝 Field note" GitHub issue form: company dropdown (all 10 covered slugs + general), source-type dropdown, verbatim note textarea, 0–100 confidence dropdown
- `.github/workflows/field-note-intake.yml` — workflow fires on `field-note`-labeled issues opened by the repo owner: parses the issue body (injection-safe via env), validates slug/source/confidence/length, prepends the note to `live-site-pages/profiler-data/profiler-notes.json` with id `note-YYYYMMDD-NN`, commits (no `[skip ci]` so Pages redeploys), closes the issue with a confirmation comment
- `live-site-pages/Profiler.html` (v01.08w) — "Add a Field Note" quick-note box at the bottom of every non-archived dossier: textarea + source select + confidence select; Save opens a prefilled GitHub issue form (`?template=field-note.yml&company=…&sourcetype=…&confidence=…&note=…`); hint directs Word/PDF files to Claude
- `.claude/rules/profiler-app.md` — documented the second capture channel (in-dossier quick-note → issue intake) and third capture channel (Word/PDF files via Claude, originals stored privately under `repository-information/note-files/<slug>/`, note text = faithful summary, `sourceFile` set)
- `.github/workflows/auto-merge-claude.yml` — mirror job now syncs `repository-information/note-files/` → `library/notes/files/`

### Changed
- `live-site-pages/Profiler.html` — "＋ Add note" button in the Field Notes changelog overlay now opens the issue form instead of the removed intake page
- `repository-information/PROFILER-SCHEMA.md` — Field Notes schema: `submittedVia` now documents the `issue-form (#N)` format; added `sourceFile` field for Word/PDF-sourced notes

### Removed
- ProfilerIntake GAS scaffold (superseded by the issue-form intake before it was ever deployed): `googleAppsScripts/ProfilerIntake/` (`.gs` + config), `live-site-pages/profiler-intake.html`, its 4 changelog files and 2 version files, `repository-information/diagrams/profiler-intake-diagram.md`, its GAS Projects table row in `.claude/rules/gas-scripts.md`, its deploy step in `auto-merge-claude.yml`, and its nodes in `REPO-ARCHITECTURE.md` (flowchart pako URL regenerated and decompression-verified)
- README tree entries for all removed profiler-intake files (connector characters repaired)

## [v02.03r] — 2026-08-08 09:56:18 PM EST

> **Prompt:** "Change the "Reimbursement" toggle name to "Business". The toggle between Personal and Reimbursement/Business is not obvious enough - Make it more obvious. All of my current scanned receipts are all Personal; I won't have any real Reimbursement/Business receipts until I get a new job, so skip the tests related to Reimbursement/Business for now. I will bring problems up as they arise later. Start Phase 2"

### Added
- **Phase R2 — Business-expense PDF filing**: on every Business save the browser converts the receipt photo to a one-page PDF (hand-built JPEG-in-PDF, no libraries — CSP-safe) and files it under `<Company>/<Year>/<Month>` in the user's own Drive (lazy folder creation from the receipt's printed date, English names); first Business save prompts inline for the company name

#### `Receipts.html` — v01.32w

##### Added
- PDF pipeline in the PROJECT block: `_jpegDims` (SOF parse), `_buildJpegPdf` (verified against a real JPEG with MuPDF rasterization), `_findOrCreateFolder`/`_ensureBizPath` (lazy `<Company>/<Year>/<Month>` via the user's `drive.file` token), `_uploadPdfToFolder` (multipart), `saveBusinessPdf` orchestrator (photo bytes → PDF → upload → `registerReceiptPdf`; re-saves trash the previous PDF)
- Company plumbing: `rr-company-row` inline prompt in the review grid (shown for Business with no stored company; save blocks until provided), ⚙️ Settings "Company · X" row with inline editor, `_companyName`/`_fetchCompany` state
- Delete flow trashes the receipt's PDF copy (server returns the link — the file lives in the user's Drive); history detail shows "View PDF copy ↗"

##### Changed
- **Reimbursement → Business** rename across toggle, review select, History/Reports filters, badge tooltip, 中文 strings (报销 → 商务); stored/localStorage values renamed with legacy-value compatibility
- Scan-panel toggle redesigned as an obvious segmented switch: "EXPENSE TYPE" caption + joined two-half pill, active half solid ink with white text

#### `Receipts.gs` — v01.21g

##### Added
- "PDF Link" column 16 + Profiles "Company Name" column 5 (in-place upgrades); `setCompanyName` (sanitized for folder names) + `registerReceiptPdf` (owner-only) with POST + GET-fallback routes; `getProfile` returns `company`; `getReceiptDetail` returns `pdfUrl`; `deleteReceipt` returns `pdfUrl` for browser-side trashing

##### Changed
- Stored expense-type value renamed to `Business` (save normalization + read compatibility for the briefly-stored `Reimbursement` value) across list/report/detail/export

### Changed
- CHANGELOG archive rotation: count reached 102 (v02.02r had pushed past the cap) — moved the oldest date group (2026-07-17, 11 sections `v01.02r`–`v01.12r`) to `CHANGELOG-archive.md` with SHA enrichment

### Verified
- `node --check` on the `.gs` + inline scripts; the page's exact `_buildJpegPdf` run in Node on a real 1200×1600 JPEG and the output rasterized by MuPDF (1 page, 612×816pt, embedded image intact); Playwright at 390×844 — segmented switch states, company row reveal, options, zero page errors

## [v02.02r] — 2026-08-08 09:40:27 PM EST

> **Prompt:** "secret added. Confirm there are no mistakes."

### Changed

- `ENTERPRISE-SETUP.md` Library Mirror Token table — Expiration row updated to record the actual choice: **No expiration** (enterprise admin exemption, matching the GAS token); secret noted as added 2026-08-08
- No rotation move this push: 101 total sections but only 94 are non-exempt (today's are exempt per rotation logic — Scenario F pattern); counter reads over-capacity until older date groups age out

### Fixed

- Resolved the parallel-session rotation collision: this session and the concurrent Receipts session (v02.01r) both rotated `v01.01r` to the archive identically — kept the upstream full-SHA header, no content lost

## [v02.01r] — 2026-08-08 09:31:15 PM EST

> **Prompt:** "1. One company. 2. Lazy folder creation. 3. CSV. 4. English folder/file names approved."

### Added
- **Phase R1 of the reimbursement plan — expense type at the point of scanning** (approved with: one company, lazy folders, CSV, English names — those choices land in Phases R2/R3)

#### `Receipts.html` — v01.31w

##### Added
- 🏠 Personal | 💼 Reimbursement toggle (`.etbtn`) on the scan panel above the Scan button — sticky per device via `localStorage` `rcpt_expense_mode`; `_expenseMode`/`setExpenseMode()` in the PROJECT block
- `rr-etype` select in the review grid (pairs with Total) — new scans inherit the scan-panel mode, editing an existing receipt shows its stored type; `collectReview()` sends `expenseType`
- `rh-etype` filter in the History filter drawer + 💼 `rh-et-tag` badge on reimbursement rows; filter participates in the "n active" hint, Clear, and reload-on-change
- `rp-etype` filter in Reports (client-side, consistent with the other instant Reports filters) — hint, Clear, and re-render wired
- `etype` parameter sent on `listReceipts`, `exportReceipts`, and `exportPreview` calls; 中文 translations for the toggle, the three dropdowns, and the "Expense" label

#### `Receipts.gs` — v01.20g

##### Added
- "Expense Type" column 15 on the Receipts tab (header array + in-place upgrade; blank legacy rows read as Personal everywhere — no backfill)
- `saveReceipt` writes the normalized type; `listReceipts`/`reportReceipts`/`getReceiptDetail` return `expenseType`; `listReceipts` + `reportReceipts` accept an `etype` filter (applied before the row cap)
- `etype` threaded through `gatherExportData_` → `exportReceipts`/`previewExportPivot`; export's Receipts sheet gains an "Expense Type" column; all six POST/GET transport routes pass `etype`

### Changed
- CHANGELOG archive rotation (first ever): section count hit 101 — moved the oldest date group (2026-07-13, `v01.01r`) to `CHANGELOG-archive.md` with SHA enrichment

### Verified
- `node --check` on the `.gs` and all inline scripts; Playwright at 390×844 — toggle state + localStorage persistence, filter options, 💼 badge, Expense select in the review grid, no horizontal scroll, zero page errors

## [v02.00r] — 2026-08-08 09:09:06 PM EST

> **Prompt:** "Regarding the centralization discussion, go with the workflow mirror, walk me through how to create the PAT, and use your proposed library layout."

### Added

- **`mirror-library` workflow job** (`.github/workflows/auto-merge-claude.yml`) — after every auto-merge (and on direct `main` pushes, so intake-app note commits mirror too), syncs knowledge files into `LightAISolutions/bess-aidc-library` using the approved layout: `dossiers/` (profiles + registry), `archive/`, `notes/`, `study/` (+`study-prep/` lesson plans), `digests/` (activates when the Scraper export ships), `reports/` and `receipts/` (session-written, never mirrored). Generates the library README once; commits only when content changed; skips with a notice until the `LIBRARY_SYNC_TOKEN` secret exists
- **"Library Mirror Token" section** in `repository-information/ENTERPRISE-SETUP.md` — fine-grained PAT spec (Contents read/write on `bess-aidc-library` only) + 7-step creation walkthrough

### Changed

- Profiler **Archival Procedure step 3** (`.claude/rules/profiler-app.md`) — off-repo mirroring is now automatic via the workflow; sessions no longer attach the library repo
- REPO-ARCHITECTURE.md CI/CD flowchart — added the mirror node (fed by merge and direct-main-push paths); mermaid.live URL regenerated and decompression-verified

## [v01.99r] — 2026-08-08 08:11:03 PM EST

> **Prompt:** "I logged into lightaisolution and opened the MasterACL spreadsheet. All users were TRUE, but I unchecked and rechecked to TRUE. However, jonyang92@gmail.com still cannot login."

### Added
- `diagnoseAclAccess()` owner-run diagnostic in `googleAppsScripts/Receipts/Receipts.gs` (v01.19g, PROJECT block): sign-in shows `not_authorized` although the Access tab shows TRUE and the entire auth path (`exchangeTokenForSession`, `checkSpreadsheetAccess`, `getRolesFromSpreadsheet`, epoch cache) is byte-identical to the last-known-good version — so the mismatch is between what the owner edits and what the code reads. The diagnostic runs the real lookup and logs: the ACL spreadsheet's name + URL as opened by `MASTER_ACL_SPREADSHEET_ID` (catches editing a different file), tab presence, header row with duplicate `Receipts`-column detection (code uses the first match), matching col-A rows with charCode dumps (catches invisible characters / near-miss addresses), the raw page-column cell value + type, the cached verdict, then `clearAllAccessCache()` + a fresh `checkSpreadsheetAccess()` verdict

### Verified
- `node --check` on the full `.gs`; auth functions diffed byte-for-byte between dee4da1 (last confirmed working sign-in) and origin/main before concluding no code regression exists

## [v01.98r] — 2026-08-08 12:14:10 AM EST

> **Prompt:** "add the date check rule"

### Added

- New Think Before Asserting extension in `.claude/rules/behavioral-rules.md`: day-of-week + date pairs must be verified with `date -d YYYY-MM-DD +%A` before being asserted — including day names supplied by the user; on conflict, the date is authoritative and the discrepancy is surfaced. Prevents the day-name drift that put "Thursday 8/14" (actually Friday) into a trigger prompt and prep documents

## [v01.97r] — 2026-08-08 12:12:16 AM EST

> **Prompt:** "The meeting is actually Friday, 8/14, and I am busy on Thursday, 8/13, so schedule this for Wednesday, 8/12."

### Fixed

- Meeting day-name corrected to **Friday 2026-08-14** in the refresher trigger prompt (`trig_01DBojuiEhM4ps3VEsZEvySv` — fire time was already Wednesday 2026-08-12 22:00 UTC and is unchanged) and in the `megmeet-lesson-plan.md` pacing line (now also notes Thursday 8/13 is blocked out). Root cause: the prior session inferred day names from conversational text instead of verifying with `date -d` — 8/12 was always Wednesday and 8/14 is Friday

## [v01.96r] — 2026-08-08 12:07:00 AM EST

> **Prompt:** "Change my Megmeet trigger from Thursday, 8/13, to Wednesday, 8/12.
>
> Then, update all the company dossier to reflect my increased priority on company products and services.
>
> Then, profiler prep the remaining companies the same way you did gor Megmeet.
>
> If you use 100% of my Fable usage and 100% of my usage credits, then pause and save your progress, then restart after my weekly fable limit resets. At that point, let me know how far you've gotten."

### Changed

- **Megmeet refresher trigger moved** to 2026-08-12 22:00 UTC (6 PM EST) — renamed "Megmeet product-tech refresher (2026-08-12)", prompt dates adjusted (`trig_01DBojuiEhM4ps3VEsZEvySv`)
- **Products-and-services priority encoded** as a standing rule: Profiler Command research step in `.claude/rules/profiler-app.md` and a new authoring rule in `repository-information/PROFILER-SCHEMA.md` — `productsAndServices[]`/`technicalSpecs[]` carry the deepest research investment
- **All 9 remaining dossiers revised to profileVersion 2** (product-focused research sweeps, ~20–35 sources each, first-party datasheets first; schemaVersion → 2; lastUpdated 2026-08-08): `byd` (7 lines, HaoHan/MC Cube/Blade, 6 spec tables), `catl` (10 lines, TENER/Qilin/Shenxing/Naxtra, 9 spec tables), `flexgen` (8 lines, HybridOS stack + Powin transition, 5 capability tables), `fluence` (8 lines, Smartstack/Gridstack Pro/Mosaic, 5 spec tables), `hithium` (6 lines, 280→1300Ah cell ladder + ∞Block, 9 spec tables), `sinexcel` (6 lines incl. new AIDC/HVDC division, 13 spec tables), `sungrow` (11 lines, SG-HX/1+X/PowerTitan 3.0, 10 spec tables), `tesla` (8 lines, Megapack 2XL/3/Megablock/Autobidder, 5 spec tables), `wartsila` (7 lines, Quantum 2/3/HE + GEMS + engines, 5 spec tables); registry `lastUpdated` synced

### Added

- **Archival system first use** — all 9 v1 dossiers archived to `live-site-pages/profiler-data/archive/<slug>.profile.v1.json` with `archive-index.json` populated (9 slugs, supersededBy 2)
- **Technology curricula for all 9 companies** (Megmeet-style, high-school-STEM baseline, concept-only flashcards, zero company trivia): in-app `<slug>.study.json` (5 sections + 15 flashcards each) and full-depth `repository-information/study-prep/<slug>/<slug>-lesson-plan.md` (5 modules, worked examples, self-tests) — every covered company now has a Study guide 📖 in the Profiler app
- README tree: 9 study.json entries, 9 archive entries, 9 study-prep directories

## [v01.95r] — 2026-08-07 11:19:48 PM EST

> **Prompt:** "I don't actually want interview prep. I want the study prep to assume I have high school level STEM knowledge and teach me whatever I need to know to understand what their products do in the grand scheme of their industry (ie: what do SSTs do in the medium voltage critical power AIDC infrastructure). Don't quiz me on company info like founding date, executive team, or headquarters location. I want to focus on each company's products and services."

### Changed

- **Profiler Prep Command redefined as a technology lesson-plan engine** (`.claude/rules/profiler-app.md`) — assumes high-school-STEM baseline, teaches what the products do in their industry context via concept-gap analysis; standing rule: never quiz company trivia (founding dates, executives, HQ). Output moves to `repository-information/study-prep/<slug>/<slug>-lesson-plan.md`
- **Study Guide schema semantics updated** (`repository-information/PROFILER-SCHEMA.md`) — sections teach concepts progressively; flashcards quiz concept/product understanding only
- **`megmeet.study.json` rewritten as a technology curriculum** — 5 modules (power-electronics fundamentals → legacy data-center power chain → the 800VDC shift with every Megmeet product mapped to its slot, incl. what an SST does in MV critical-power AIDC infrastructure → the same physics across VFDs/EV/appliances/welding → industry map & economics) + 15 concept flashcards. Data-only change — no Profiler page version bump
- **Wednesday 8/13 trigger reworked** (`trig_01DBojuiEhM4ps3VEsZEvySv`, renamed "Megmeet product-tech refresher") — now delivers a product/technology refresher + trailing-week news; interview-cram framing, talking points, and company trivia removed
- CLAUDE.md Profiler Command pointer updated to describe the technology-lesson-plan behavior

### Removed

- `repository-information/interview-prep/` and its 4 interview-oriented files (study guide, schedule, cram flashcards, Q&A prep) — replaced by `repository-information/study-prep/megmeet/megmeet-lesson-plan.md` per the developer's redirection away from interview prep

### Added

- `repository-information/study-prep/megmeet/megmeet-lesson-plan.md` — full-depth 5-module technology curriculum with worked efficiency/PUE math, product-by-product 800VDC chain walkthrough, and a concept self-test

## [v01.94r] — 2026-08-07 11:02:33 PM EST

> **Prompt:** "Regarding my Profiler app:
> - I want each Company profile to accept new information that I learn about the company from industry contacts or in-person events, store it somewhere easily accessible to recall for future reports, and create a visible summary of each new input in the form of a chronological changelog (create a Settings cog icon in the bottom right of dashboard that leads to this changelog).
> - I also want to use this app to identify gaps in my understanding towards a target company and create a lesson plan (any and all formats that best accomplish the job) to teach me important "need-to-know" information about their key products and services. The real life scenario I am facing is: I am job hunting right now and am interviewing with many of the companies in this Profiler app. The most immediate need is Megmeet, which I have a scheduled interview with on Thursday, 8/14, 10am. I want to seem like I have done my homework and know their core business. Recommend an action plan for me to approve."
>
> *(Plan approved via AskUserQuestion: all 3 phases; notes stored public + verbatim with a developer-rated 0–100 confidence score; lesson plans both private docs and sanitized in-app; Wednesday cram trigger yes.)*

### Added

- **Field Notes system** — `live-site-pages/profiler-data/profiler-notes.json` (chronological log, schema v1: id/date/slug/sourceType/verbatim note/developer-rated 0–100 confidence/tags); "Profiler Note Command" + confidence-weighting rules in `.claude/rules/profiler-app.md`; Field Notes schema in `repository-information/PROFILER-SCHEMA.md`; ⚙ cog (dashboard, bottom-right) + chronological changelog overlay with company filter chips and confidence badges in `Profiler.html` (v01.06w)
- **Study guide system** — Study Guide schema (`<slug>.study.json`) in PROFILER-SCHEMA.md; "Profiler Prep Command" (gap analysis → private prep pack in `repository-information/interview-prep/<slug>/` + sanitized in-app guide) in `profiler-app.md`; "Study guide 📖" dossier button + overlay with tap-to-flip flashcards in `Profiler.html`
- **Megmeet dossier** — `megmeet.profile.json` (profileVersion 1, schema v2) from a two-agent research sweep (~65 first-party + third-party sources); registered in `profiler-companies.json` (10 companies covered)
- **Megmeet prep pack** — `megmeet.study.json` (in-app, sanitized) + private `repository-information/interview-prep/megmeet/` (study guide, day-by-day schedule to 8/14, flashcards, Q&A prep)
- **Cram trigger** — one-shot Routine `Megmeet interview cram — night before (2026-08-13)` (`trig_01DBojuiEhM4ps3VEsZEvySv`), fires 2026-08-13 22:00 UTC in a fresh session to produce `megmeet-cram-sheet.md` from trailing-week news; push + email notification on completion

### Changed

- CLAUDE.md "Profiler Command" section extended with the `profiler note` and `profiler prep` trigger phrases
- README tree: new profiler-data entries, `interview-prep/` section, Profiler version display → v01.06w

## [v01.93r] — 2026-08-07 09:58:47 PM EST

> **Prompt:** "I reinstalled the Profiler app and it still opens a browser instead of looking like a standalone app"

### Fixed

- Profiler wouldn't install as a standalone PWA because the installed Receipts app claimed scope `./` (the whole site) — Chrome refuses to offer install for a page inside an installed PWA's scope (documented in w3c/manifest #1180/#1209). Narrowed both manifests to per-app scopes (`profiler.webmanifest` → `./Profiler.html`, `receipts.webmanifest` → `./Receipts.html`) and added distinct `id` fields to pin each app's identity. No page version bumps — no HTML files changed; manifests are fetched fresh at install time

## [v01.92r] — 2026-08-07 09:49:43 PM EST

> **Prompt:** "continue with your recommendation."

*(Executes the prior response's recommendation — make Profiler installable as a PWA like Receipts.)*

### Added

- `live-site-pages/profiler.webmanifest` — PWA manifest (`display: standalone`, ink theme `#13151c`, start URL `./Profiler.html`)
- `live-site-pages/images/profiler-icon-192.png` + `profiler-icon-512.png` — home-screen icons rendered from `profiler-logo.svg` via headless Chromium; the 512 is `any maskable` with the emblem composited at 80% on a full-bleed ink field so circular/squircle masks never clip the gold border

### Changed

- `Profiler.html` (v01.05w) — added `<link rel="manifest">`, `theme-color`, `apple-touch-icon`, and the three Apple PWA meta tags; CSP `manifest-src` overridden `'none'` → `'self'` with a `PROJECT OVERRIDE` comment mirroring the Receipts pattern. Verified in headless Chromium: manifest fetches through the CSP, both icons serve 200, no new console errors

## [v01.91r] — 2026-08-07 03:26:14 AM EST

> **Prompt:** "In my Profiler app, verify the Sinexcel refresh. Also, choose a suitable logo for this app and replace the placeholder."

### Added

- `live-site-pages/images/profiler-logo.svg` — Profiler app logo: a dossier-card emblem in the app's own palette (ink `#1d212d`, paper `#e9e4d6`, gold `#d8b45a`) with a photo-frame profile silhouette, index lines, and a gold verification seal

### Changed

- `Profiler.html` (v01.04w) — `SPLASH_LOGO_URL` now points at `images/profiler-logo.svg`, so the Website Ready / Code Ready splashes and the maintenance screen show the app's own logo. `DEVELOPER_LOGO_URL` / `YOUR_ORG_LOGO_URL` intentionally left on the placeholder — they carry developer/org branding semantics, not app branding, and are not consumed by the page. (Same interaction also verified the Sinexcel scheduled refresh — trigger armed and preconditions consistent; no changes were needed for that part)

## [v01.90r] — 2026-08-07 02:00:31 AM EST

> **Prompt:** "continue with your recommendation"

*(Executes the v01.89r recommendation — extend the scheduled-refresh convention to every remaining covered company.)*

### Added

- Armed one-shot scheduled refresh triggers for the remaining public companies, each firing a fresh session the day after its report and following the full Profiler Command (verify-published gate → dual-agent research → archive-first → refresh → self-re-arm with tooling fallback): BYD 2026-08-30 15:00 UTC (staggered 2h after Sungrow — both report 2026-08-29), Tesla 2026-10-22 (estimate-based; fired session confirms the real date), Wärtsilä 2026-10-28 (announced 2026-10-27), CATL 2026-11-01 (2026-10-31 disclosure deadline), Fluence 2026-11-25 14:00 UTC (estimate-based, FY ends Sep 30)
- Quarterly private-company sweep Routine for Hithium & FlexGen (cron: Jan/Apr/Jul/Oct 1, ~13:00 UTC; next fire 2026-10-01) — checks for material developments, refreshes dossiers archive-first only when warranted, makes no commits otherwise

### Changed

- Upgraded the pre-existing Sinexcel trigger (fires 2026-08-12) to the improved prompt template — verify-published gate and self-re-arm now carry the trigger-tooling fallback (REMINDERS.md note if `create_trigger` is unavailable in the fired session)
- `.claude/rules/profiler-app.md` Scheduled Refreshes section now lists the full armed roster (7 companies + the private-company quarterly sweep) with tickers, fire times, and date-confidence notes

## [v01.89r] — 2026-08-07 12:34:58 AM EST

> **Prompt:** "Continue from where you left off."

*(Continuation after a tool-approval interruption — completes the in-flight Overview → Profiler rename, dossier archival system, and scheduled Sungrow refresh.)*

### Changed

- Renamed the Overview app to **Profiler** across the repo: `Overview.html` → `Profiler.html` (v01.03w), `overview-data/` → `profiler-data/`, `<slug>.overview.json` → `<slug>.profile.json`, `overview-companies.json` → `profiler-companies.json`, `OVERVIEW-SCHEMA.md` → `PROFILER-SCHEMA.md`, `Overviewhtml.*` version/changelog files → `Profilerhtml.*`, `.claude/rules/overview-app.md` → `profiler-app.md` — plus all content references (page title/header/exports, CLAUDE.md Profiler Command section + Reference Files row, README tree, REPO-ARCHITECTURE.md flowchart node with regenerated mermaid.live URL, changelog headers)
- Profiler Command trigger phrase is now "profiler \<Company\>" (was "overview \<Company\>")

### Added

- Dossier archival system: `live-site-pages/profiler-data/archive/` with `archive-index.json` — every profile revision now archives the superseded version as `<slug>.profile.v<N>.json` before overwriting, with best-effort mirroring to the `bess-aidc-library` repo (Archival Procedure in `.claude/rules/profiler-app.md`)
- Scheduled refresh convention + first armed trigger: one-shot Routine "Profiler refresh — Sungrow (post-H1 2026)" fires 2026-08-30 13:00 UTC (day after Sungrow's scheduled 2026-08-29 H1 report), runs the full Profiler Command in a fresh session, and re-arms itself for the next reporting period (Scheduled Refreshes section in `profiler-app.md`)

## [v01.88r] — 2026-08-07 12:02:06 AM EST

> **Prompt:** "continue with your recommendation"

*(Executes the approved upgrade package with gradual backfill — recommendation from the v01.87r response.)*

### Added

#### `Overview.html` — v01.02w

##### Added
- Recent Developments section: per-event timeline rows (`.ov-dev` — date column, category chip, headline, italic "→ strategy takeaway", source line) rendered between Products & Services and Strategy Read; driven by the new `recentDevelopments[]` schema field
- Strategy Read section: gold-bordered `.ov-strategy` box with a prominent "Analysis — inference from the sourced facts, not company statements" tag, rendering the new `strategyRead[]` bullets
- Product depth rows: optional `positioning` / `soldThrough` / `targetSegments` / `roadmap` fields render as labeled key-value lines under each product entry
- Export document builder (`ovBuildDoc`) and Word CSS carry all three additions, so exported Word/PDF dossiers include the new sections
- Verified via a route-intercepted v2 fixture (both new sections + 3 product depth rows render in dossier and export preview; zero console errors) plus the full v1 regression pass (all 9 existing profiles render unchanged)

#### `repository-information/OVERVIEW-SCHEMA.md`

##### Added
- Schema v2: `recentDevelopments[]` (dated, categorized, trailing 12–18 months, newest first, one-line `read` per event), `strategyRead[]` (labeled-analysis bullets), and the four optional product depth fields; new authoring rules "Analysis stays labeled" and "Recent-developments window"; v1 profiles remain valid (renderer skips absent sections)

#### `.claude/rules/overview-app.md`

##### Changed
- Default research vehicle is now **two parallel subagents per company** (first-party Stage 1 + third-party Stage 2, ~50–70 evaluated sources, ~250–350k tokens); single-agent kept for thin/private subjects, three-agent sweep reserved for user-flagged high-stakes targets; research must cover the v2 sections; existing dossiers upgrade on their next natural refresh (gradual backfill, per developer choice)

## [v01.87r] — 2026-08-06 11:27:45 PM EST

> **Prompt:** "These overviews are kind of useful, but don't provide me enough insight into their products/services and don't include recent news highlights that can give me insight into their sales/product strategy. Can you think of and recommend ways to improve the quality of the overviews? 
>
> I also noticed that each company overview only has around 12-16 sources. Why not evaluate more sources to get more information? What is the maximum number of sources I can look up before either it starts costing tokens or starts taking more than 30-minutes to generate a single corporate overview?
>
> Also, note that I want source priority to be: target company's Investor Relations and Press Release pages > trade news sites. Always make sure to fully scrape all relevant information from the target companies themselves first."

*(Quality-upgrade approval question went unanswered — upgrades remain proposed; only the source-priority directive is implemented in this version.)*

### Added

- `.claude/rules/overview-app.md` — **Source Priority Protocol** (developer directive) added to the Overview Command's research step: Stage 1 exhaustively scrapes the target company's own channels first (Investor Relations, complete press-release archive ≥24 months, product/datasheet pages, leadership pages); Stage 2 uses third-party sources only to fill gaps and supply what the company cannot credibly self-report (consensus/expectations, independent rankings, critical context); `sources[]` citation order puts first-party pages first; research prompts must state the protocol explicitly
- `repository-information/OVERVIEW-SCHEMA.md` — matching **Source priority** authoring rule (first-party ground truth scraped fully first; trade press second; first-party listed first in `sources[]`)

## [v01.86r] — 2026-08-06 10:51:29 PM EST

> **Prompt:** "overview Sungrow, Tesla, Fluence, CATL, Flexgen, Wartsila, BYD"

### Added

- Seven company dossiers via the Overview Command batch mode (7 parallel research subagents), all at profileVersion 1 in `live-site-pages/overview-data/`:
  - `sungrow.overview.json` — supplier; SZSE: 300274; #1 in Wood Mackenzie's 2025 BESS-integrator AND PV-inverter rankings; PowerTitan 2.0/3.0 + 1+X 2.0 specs; FY2025 ESS revenue overtook inverters (RMB 37.3B, 43 GWh); Q1 2026 miss captured
  - `tesla.overview.json` — supplier; NASDAQ: TSLA; energy-division focus (Megapack 3 / Megablock / Powerwall 3 specs, 46.7 GWh 2025 deployments); FY2024–Q2 2026 results vs consensus incl. the Q2 2026 EPS miss and $240M warranty charge
  - `fluence.overview.json` — integrator; NASDAQ: FLNC; Smartstack/Gridstack Pro specs; the FY2025 guidance-collapse trajectory and FY2026 cut documented vs guidance; 5 company-published exec headshots downloaded from the official leadership page
  - `catl.overview.json` — supplier; SZSE: 300750 · HKEX: 3750; TENER Stack / TENER Sodium specs; FY2024 miss → FY2025 beat → H1 2026 storage +87.5%; US 1260H/procurement-ban headwinds noted
  - `flexgen.overview.json` — integrator; private; HybridOS capability profile (absent OEM/cert lists flagged explicitly); Powin asset acquisition ($36M) and CES acquisition; funding history; verified LinkedIn URLs for CEO/CFO
  - `wartsila.overview.json` — integrator; HEL: WRT1V; Quantum2/Quantum3 + GEMS specs; the two-stage storage-ownership outcome (2025 retention → June 2026 50/50 RCT Solutions JV) with segment financials; 4 official board-of-management headshots
  - `byd.overview.json` — supplier; SZSE: 002594 · HKEX: 1211; HaoHan 14.5 MWh / Chess Plus specs; FY2025 consensus misses amid the EV price war; 12.5 GWh SEC and 11.3 GWh Masdar orders; storage-division leadership change (Yin Xueqin)
- `live-site-pages/images/execs/` — nine company-published executive headshots (Fluence ×5, Wärtsilä ×4) referenced by the profiles' `photo` fields; executives without published headshots render initials avatars
- All seven companies registered in `overview-companies.json` (9 companies total) and the README tree

### Changed

- `README.md` — `overview-data/` listing expanded to all nine profiles; `images/execs/` subdirectory entry added

## [v01.85r] — 2026-08-06 10:09:14 PM EST

> **Prompt:** "overview Hithium"

### Added

- `live-site-pages/overview-data/hithium.overview.json` — Hithium dossier (profileVersion 1) via the Overview Command: identity (private; A-share attempt withdrawn 2023, both HKEX applications lapsed — the second in April 2026), six product/service lines (∞Cell LFP cells 280Ah→1300Ah, ∞Block/∞Power containers to 6.9 MWh, sodium-ion N162Ah, C&I, HeroEE residential, Texas/Spain localized manufacturing), four flagship spec tables (∞Cell 1175Ah, ∞Cell 1300Ah, ∞Power 6.25 MWh, ∞Power 6.9 MWh 8h), nine decision makers (four ex-CATL executive directors incl. founder Wu Zuyu; no verified LinkedIn profiles or usable official headshots — initials avatars render), FY2023/FY2024/H1-2025 prospectus financials with shipment rankings (global No. 5 → No. 3 → Top 2) and risk context (CATL litigation >RMB 240M claimed, equity freeze, subsidy-dependent FY2024 profit), 18 cited sources with access dates
- Registered Hithium in `overview-companies.json` (supplier, Xiamen; registry `lastUpdated` in sync) and added the profile to the README tree

### Changed

- `README.md` — `overview-data/` tree listing gains `hithium.overview.json`

## [v01.84r] — 2026-08-06 09:50:12 PM EST

> **Prompt:** "Create an export button that allows the user to export the overview file in either Word or PDF formats, with a Preview screen before exporting to give the user a chance to catch mistakes."

### Added

- `Overview.html` (v01.01w) — "Export dossier ⬇" button in the dossier header → full-screen export preview overlay (`#ov-prev-overlay`) with a sticky toolbar and a light "paper" rendering of the complete dossier (`ovBuildDoc()`: letterhead, snapshot facts table, products, spec tables, decision makers, financials-vs-expectations tables, sources, generated-timestamp footer) so mistakes can be caught before exporting
- Word export (`ovWordExport()`): serializes the preview document into a standalone Word-compatible HTML payload (UTF-8 BOM + Office XML namespaces + embedded print-friendly CSS) and downloads it as `<slug>-overview-<date>.doc` — opens directly in Microsoft Word with editable text and tables
- PDF export: `window.print()` against a dedicated `@media print` block that isolates the preview document (everything else hidden, toolbar stripped, page-break rules on section headings and tables) — "Save as PDF" in the print dialog yields a clean, text-searchable PDF with zero vendored libraries (CSP stays closed to external hosts)
- Preview UX: Esc key and backdrop click both close the overlay; toolbar is sticky while the document scrolls. Playwright-verified end to end (preview renders all six document sections, `window.print` invocation stubbed and confirmed, real `.doc` download captured and byte-checked for the BOM+HTML header, Esc close, zero console errors)

## [v01.83r] — 2026-08-06 09:38:07 PM EST

> **Prompt:** "I want to create corporate overviews of all companies in my ecosystem (suppliers, developers, integrators, investors, hyperscalers, advisors, etc) that aims to educate the reader on what the company does (products and/or services), who their decision makers are (ie: executive team with profile picture + work experience from LinkedIn), their financial performance vs expectations in past two years, detailed technical specifications on their products and services, and potentially more later. Create an app called "Overview" that will create these overviews as long as I give it a company name. I also want it to be organized optimally for Claude to recall these for future revisions or reports. Thus, should I create this app in my Sales repo or my BESS-AIDC-Library repo? I am leaning towards the Sales repo because this repo was created to contain all apps that I can use in my Sales job. Let me know if you disagree.
>
> Also, I am no longer working at Sinexcel, so make sure to add Sinexcel as a covered company, but do not give it special treatment, such as creating new sections called "Relevance for Sinexcel". Recommend me an action plan to approve."

*(User chose "Approve — build now" and "Company-published photos + initials fallback" for exec pictures via AskUserQuestion.)*

### Added

- `Overview.html` — new ecosystem company dossier app (v01.00w, built from the noauth template — splash, version polling, and changelog popup inherited): roster view with category filter chips (supplier / developer / integrator / investor / hyperscaler / advisor) and search, plus a per-company dossier view rendering Snapshot facts, Products & Services, Technical Specifications tables, Decision Maker cards (company-published photos with initials-avatar fallback + LinkedIn links when verified), Financial Performance vs Expectations tables with beat/miss/inline verdicts, and a cited Sources list. Hash-routed; all app code inside PROJECT markers. Playwright-verified end to end (roster, search empty state, full dossier render, back navigation — zero console errors)
- `live-site-pages/overview-data/` data layer: `overview-companies.json` registry (roster, categories, freshness) and `sinexcel.overview.json` pilot profile (profileVersion 1) — Sinexcel covered with standard treatment: four business lines, StellaON 1250K/1575K + SEC480 + Ultra AHF spec tables, 10 decision makers with career backgrounds, FY2024 / FY2025 / Q1-2026 results vs expectations, 16 cited sources with access dates
- `repository-information/OVERVIEW-SCHEMA.md` — single source of truth for the registry and profile schemas: slug rules, field tables, authoring rules (public sources only, no fabrication, expectations honesty, photo policy, standard treatment for every company), and the schema-extension procedure
- `.claude/rules/overview-app.md` — the "overview \<Company\>" command (research → profile JSON → registry → commit), data-vs-page versioning interactions, and the recall design (one file read per company, registry as index, diffable revisions); registered in CLAUDE.md via a new "Overview Command" pointer section and a Reference Files table row

### Changed

- `README.md` — tree entries for the new page (Internal Sites), `overview-data/` directory, `Overviewhtml.version.txt`, Overview changelog + archive, `OVERVIEW-SCHEMA.md`, and `overview-app.md`
- `repository-information/REPO-ARCHITECTURE.md` — flowchart gains the `Overview.html` environment node with serves / version-polling / template-copy edges; mermaid.live pako URL regenerated and decompression-verified

## [v01.82r] — 2026-08-05 10:26:18 PM EST

> **Prompt:** "I added Allen as a test user and he confirmed that he could sign in. 

1. Add a preview feature after the Pivot Builder wizard so users can catch a mistake and redo the Pivot Builder rather than find out after the export is completed.

2. Make sure that this app is calibrated to scan and extract information from commercial invoices as well as typical receipts."

### Added

#### `Receipts.html` — v01.30w

##### Added
- Export designer Preview step (step 4) — the Values & sheets step's primary button is now "Preview"; `rxFetchPreview()` calls the new `exportPreview` op and renders the exact server-computed Pivot grid as a scrollable table (`.rx-prev-wrap`, sticky header, bold totals row, truncation notes) with Back returning to the wizard state intact and "⬇️ Export" running the real export; labels localize via `rxLbl()` (t() + tCat())
- "Business" receipt category with subcategories Inventory & Resale, Supplies & Packaging, Equipment, Freight & Shipping, Deposits & CRV, Professional Services — added to `CATEGORIES`/`SUBCATS` (propagates to History/Reports filters and the review screen) with 中文 display names in `I18N_CAT_ZH`

##### Changed
- Photo compression max dimension raised 1600px → 2000px so small print on dense letter-size commercial invoices stays legible for extraction

#### `Receipts.gs` — v01.18g

##### Added
- `previewExportPivot` + `exportPreview` dispatcher branches (POST + GET fallback) — returns the pivot grid as JSON without creating a spreadsheet; grids truncated for transport at 60 data rows / 13 data columns (header + totals always kept) with `truncatedRows`/`truncatedCols` counts
- "Business" in `RECEIPT_CATEGORIES` + six invoice subcategories in `ITEM_CATEGORIES` (extraction schema enums)

##### Changed
- Refactored export internals: `gatherExportData_` (session/owner/receipts/line-items gather) and `buildReceiptPivot_` (cross-tab grid) are now shared by `exportReceipts` and the preview, guaranteeing the preview matches the exported Pivot sheet
- Gemini extraction prompt recalibrated for commercial invoices — vendor→merchant, invoice date (not due/ship date), grand total, Business category, per-line deposits/freight/discount handling (negative amounts for credits), case/pack qty×unit-price semantics with printed extended totals preferred, capture-every-line instruction for long invoices, and Business subcategory guidance

## [v01.81r] — 2026-08-05 10:12:22 PM EST

> **Prompt:** "Allen is the owner of a liquor store and frequently needs to scan, document, and organize invoices of all applicable retail expenses. I want to let him use this Receipt app to scan his invoices and export them in a dynamically-controllable way for whatever purposes he may have. I think it would be good to add an additional prompt that pops up when the Export button is pressed that goes through a short process to figure out which data categories he wants in the X and Y axes or not included. Recommend a couple solutions for me to choose from."

*(User chose the "Pivot Builder wizard" option via AskUserQuestion.)*

### Added

#### `Receipts.html` — v01.29w

##### Added
- Export designer wizard — tapping "⬇️ Export .xlsx" now opens a 3-step modal (`#rx-overlay`/`#rx-modal`, rendered per-step by `rxRender()`): Rows / Y axis (category, subcategory, merchant, month, week, line item), Columns / X axis (none, month, category, merchant), Values (receipt totals, line-item costs, purchase counts) plus include-toggles for the Receipts / LineItems / Monthly Summary sheets; Export sends the config as a `pivot` JSON param, last-used config persists in localStorage `Receipts_export_cfg`, labels follow the app language (new `I18N_ZH` entries), outside-tap/Cancel dismiss, and `showAuthWall()` hides the overlay

#### `Receipts.gs` — v01.17g

##### Added
- `exportReceipts` accepts an optional `pivot` JSON param (both dispatcher call sites) and prepends a cross-tab **Pivot** sheet — rows × columns aggregation with row/column/grand totals, frozen headers; subcategory/item rows and item-cost values aggregate over line items (read once up front), other combinations over receipts; a `nextSheet_` helper orders Pivot → Receipts → LineItems → Monthly Summary and honors the sheet include-toggles. Legacy calls without the param keep the original three-sheet workbook

##### Fixed
- `exportReceipts` referenced an undeclared `ownerEmail` in the Monthly Summary owner filter (latent since the combined-view refactor in v01.43r) — any export where the Monthly Summary tab had data rows would throw a ReferenceError and fail; the filter now uses the export's resolved owner set (also fixes combined exports to include shared owners' summary rows)

## [v01.80r] — 2026-08-05 05:26:52 AM EST

> **Prompt:** "I am rating articles in Articles and it constantly fails and shows the error message: "Could not save feedback (http_404)". What's wrong and fix it."

### Fixed

#### `Scraper.gs` — v01.29g

##### Added
- `setArticleVerdicts` batch action (registered): applies up to `SCRAPER_VERDICT_BATCH_MAX`(40) absolute verdict values in one request + one Articles-tab scan; skips malformed verdicts and foreign-owner/project rows; returns `{saved, failed}` id lists; one audit row per batch. Exists because Google's /exec front-end intermittently 404s individual requests (redeploy serving flap — the root cause of the user's 36 consecutive `http_404` failures); one batched call minimizes exposure. Unit-tested 9/9 (multi-apply incl. clear, col-12 writes, foreign-row skip + failed reporting, malformed skip, bad payload)

#### `Scraper.html` — v01.32w

##### Fixed
- Verdict saving reworked from per-tap request (2 attempts then "gave up") to an offline-tolerant queue: `scVerdictClick` applies optimistic UI + enqueues into localStorage (`scraperVerdictQueue`, latest-tap-wins per article); `scFlushVerdicts_` batches everything pending into one `setArticleVerdicts` call with exponential backoff retries forever (5s→60s cap), flushes on page load (queue survives reloads), drops server-confirmed and not-found ids, warns once while unreachable and confirms when saved. Replaces `scSendVerdict` (the retry-twice transport this queue supersedes). Rating buttons never lock, so rapid-fire rating is instant. Playwright-tested: optimistic UI + queue growth under a full 404 storm, single-batch flush of both ratings on recovery, reload-with-pending auto-flush

## [v01.79r] — 2026-08-05 03:35:45 AM EST

> **Prompt:** "I want a floating notification window that saves previous notifications with their respective timestamps. I want to be able to start a Backfill step, walk away from my computer, come back and know for sure whether or not Backfill finishes. This applies for all functions."

### Added

#### `Scraper.html` — v01.31w

##### Added
- Notification history subsystem: `scNotify_` appends every toast (`scToast` hook — results and errors for ALL actions) plus a "▶ \<label\> — started" entry (hooked into `scProgShow`'s bar-creation branch) to a localStorage log (`scraperNotifLog`, capped at 100, newest first) so history survives deploy auto-reloads. A started entry with no matching finish identifies an interrupted run
- 🔔 header button with unread badge (count of entries newer than `scraperNotifSeen`; opening the panel marks all read) and a floating `#sc-notif-panel` (fixed top-right, z 9000 — below the auth wall and version pill) listing timestamped entries via `toLocaleString`, errors in red, with Clear/close controls; live-updates while open
- `showAuthWall()` hides the panel (PROJECT OVERRIDE addition to the deactivate-authenticated-UI block). Playwright-tested: badge count after a Compile run (start + finish entries), newest-first ordering with timestamps, badge reset on open, persistence across a full page reload, Clear

## [v01.78r] — 2026-08-05 03:13:25 AM EST

> **Prompt:** "I completed Ootion A and added the scSchedulerTick hourly trigger, but the red banner still exists - What's wrong and fix it. Also, now that I have archived junk (left with 300+ articles) and added new keywords to the plan and rebuilt it, what are my next steps, why, and the cost."

### Fixed

#### `Scraper.gs` — v01.28g

##### Fixed
- `getSchedulerHealth` false negative on manually added triggers: verification relied solely on `ScriptApp.getProjectTriggers()`, which throws without the `script.scriptapp` scope — so a real, working hand-added trigger was still reported "not installed". Now `scSchedulerTick` writes a `SCHEDULER_LAST_TICK` heartbeat property at the top of every run (before the lock, so even lock-busy ticks heartbeat), and `getSchedulerHealth` trusts a <2h heartbeat first (no permission needed), falls back to ScriptApp, and returns `unverified: true` when neither works. Unit-tested 13/13 (heartbeat-beats-permission, stale heartbeat, scriptapp fallback, lock-busy heartbeat)

#### `Scraper.html` — v01.30w

##### Fixed
- Scheduler banner gains a third state: `unverified` renders an amber "can't verify yet — clears automatically after the first hourly run" notice instead of the red "NOT running" alarm, which was wrong (and alarming) right after a manual trigger add. Playwright-tested (amber text/background, no red text, banner clears on heartbeat-verified health)

## [v01.77r] — 2026-08-05 02:57:13 AM EST

> **Prompt:** "scheduler result: 1) confirmed not anywhere in Inbox; 2) Reports tab has no rows; 3) chip on project card still says "first run pending"; 4) No triggers exist in my google apps script even after I reloaded the Scraper page (did not reinstall this trigger). Also, when I rebuilt my plan, it removed the keywords I just added and went back to the original 24 keywords. Shouldn't Rebuild override the original keyword plan with the new plan + my new keywords?"

### Fixed

#### `Scraper.gs` — v01.27g

##### Fixed
- Scheduler root cause identified: the manifest's explicit `oauthScopes` lacks `https://www.googleapis.com/auth/script.scriptapp`, so every `scEnsureSchedulerTrigger_` call (`ScriptApp.getProjectTriggers`/`newTrigger`) throws a permissions error that doGet's try/catch swallowed — no trigger, no runs, no email, zero trace. New `getSchedulerHealth` action re-attempts the install and returns `{installed, triggers, error}` with the real error text so the UI can surface it (requires a one-time manual fix: add the trigger in the editor, or add the scope + re-consent)

##### Changed
- Rebuild preserves manual additions: `QueryPlans` gains a `Manual` column; `scGetPlan_`/`scSavePlan_` round-trip it (legacy rows parse as empty), `addPlanQuery` records each user-added group, and `planQueries` puts stored manual groups FIRST, drops exact-dupe AI groups, caps at `SCRAPER_PLAN_TOTAL_MAX`, and returns `manual` to the client. Unit-tested 19/19 (roundtrip incl. legacy rows, manual tracking, rebuild preservation/dedupe/no-prior-plan, health error surfacing)

#### `Scraper.html` — v01.29w

##### Added
- `scCheckSchedulerHealth_` on every project-list load: when `getSchedulerHealth` reports the trigger missing, a red `#sc-sched-warn` banner renders above the list with Google's error and the manual fix steps (Triggers → scSchedulerTick → hourly); banner clears once installed
- Manual plan groups badged "· added by you" in `scShowPlan_` (new `manual` param threaded through all callers); Rebuild status reports "(your N manual additions kept)" and the button title no longer claims manual additions are replaced. Playwright-tested: banner content/clearing, badges, rebuild preservation rendering

#### `gas-project-creator.html` — v01.02w

##### Fixed
- Manifest template now includes the `script.scriptapp` OAuth scope (also propagated to `sample-components/appsscript.json` and the setup steps in `.claude/rules/gas-scripts-reference.md`) so new projects can self-install time-driven triggers

## [v01.76r] — 2026-08-05 02:34:08 AM EST

> **Prompt:** "When I am adding new keywords into my Plan, it processes extremely slowly, doesn't always add it to the Plan, and when it does, it doesn't update the keyword list in real time so I don't know it's added. Also, the scheduler did not work this morning; I never got an email at jonyang92@gmail.com."

### Fixed

#### `Scraper.gs` — v01.26g

##### Fixed
- Lost-update race in `addPlanQuery`: the read-AI-write sequence now runs under a `LockService` script lock (`tryLock(15000)` → `plan_busy`; release in `finally` covers all early returns) — previously an overlapping retry read the pre-add plan and its save silently dropped the first keyword. `plan_duplicate` now also returns the full `queries` list. Unit-tested: busy/no-save, acquire+release on happy path, release on duplicate and AI-error early returns
- Scheduler poison loop: `scRunScheduleStep_` now counts consecutive failed ticks (`run.fails`, `run.lastError`); after `SCRAPER_SCHED_MAX_FAILS`(6) it abandons the cycle — advances Next Run, clears state, writes a `scheduled-run-failed` audit row, and (for email/both delivery) sends a failure-notice email with the phase and error. Previously a persistent error retried hourly forever with total silence (the likeliest cause of the missed morning email). Counter resets on any successful phase step. Unit-tested through 6 stubbed failing ticks
- `scEnsureSchedulerTrigger_` re-verifies the hourly `scSchedulerTick` trigger against `ScriptApp.getProjectTriggers()` every 24h (property now stores the last verification timestamp; legacy `'1'` counts as stale) — a deleted trigger self-heals within a day instead of never
- `scDeliverBrief_` email failures now log the `MailApp` error to the audit log (`brief-email-failed`) instead of only recording an opaque `email_failed` status

#### `Scraper.html` — v01.28w

##### Changed
- `scPlanAdd_` rebuilt: optimistic pending `<li>` ("evaluating and saving…") inserted at the top on press; on success the panel re-renders from the server's authoritative `data.queries` via `scShowPlan_` (highlighting the group containing the term); on transport failure a `getQueryPlan` verify-then-report pass renders the truth ("saved" vs "NOT added — try again"); post-render control refs re-fetched by id. New `plan_busy` error string. Playwright-tested: pending row visible while the add route is held open, authoritative re-render + highlight + provenance refresh, lost-reply verification path

## [v01.75r] — 2026-08-04 08:27:47 PM EST

> **Prompt:** "There's not much noticeable change. Sometimes it's fast and sometimes it never loads. Also, I pressed Rebuild and looked away. When I looked back, I was back in the Plan page and was not sure if the Rebuild went through. Check and tell me; Then make sure all buttons give a result and recommended next step."

### Added

#### `Scraper.html` — v01.27w

##### Added
- Plan panel provenance line in `scShowPlan_`: "N query groups · saved <plannedAt>" (`toLocaleString` on the QueryPlans ISO timestamp; `'just now'` after in-session build/rebuild) — makes a Rebuild verifiable even when the confirmation is lost to a deploy-triggered auto-reload
- Recommended-next-step text appended to every completion toast (Compile→Analyze, Backfill→Enrich→Analyze, Deep backfill→Analyze, Enrich→Analyze, Analyze→rate/Stats, Archive junk→Backfill, Plan build/Rebuild→Compile or Backfill); `scToast` gained a duration param (completion toasts 9s, errors default 8s)
- Data-driven `Recommended next:` line in the Stats footer (`scRenderStats_`): archivable junk → Archive junk; unscored → Analyze; preview coverage <80% → Enrich; ratable pool → rate verdicts; else grow via Backfill

##### Fixed
- 90s AbortController watchdog (`_fetchT`) on both POST and GET paths in `_gasPost` — a hung fetch previously never settled, leaving the pressed button disabled forever with no error ("sometimes it never loads"); now it rejects with `no reply after 90s`, every handler's existing `.catch` surfaces it, and the button recovers. Verified via Playwright (provenance line, rebuild next-step status, stats recommendation) + static wiring assertions

## [v01.74r] — 2026-08-04 08:11:10 PM EST

> **Prompt:** "It takes a long time for each of my button (Plan, Backfill, etc) presses to register. Can you speed that up?"

### Changed

#### `Scraper.gs` — v01.25g

##### Changed
- API-first `doGet` routing (PROJECT OVERRIDE): the GET api/deploy routes are now matched before the page-boot work — previously every GET-fallback API call paid `ensureScriptProperties_` + `registerSelfProject()` (opens the Master ACL spreadsheet, ~1–2s) + `scEnsureSchedulerTrigger_` before the action even ran. Boot work still runs for page-shell and listener-page loads
- `ensureScraperTabs_` guarded by an execution-global + 6h `CacheService` flag (key embeds the tab count, so adding a tab to `SCRAPER_TAB_HEADERS` auto-invalidates); the ~10 per-press `getSheetByName` probes now run at most once per cache window, failing open if CacheService is unavailable. Unit-tested 15/15 (cold run, same-execution skip, warm-cache zero probes, cache-outage fail-open, stale-count invalidation, plus static doGet ordering assertions incl. deploy-fallback placement per Deploy Handler Protection)

#### `Scraper.html` — v01.26w

##### Changed
- Sticky transport in `_gasPost`: after a POST transport failure where the GET fallback succeeds, `_scGasGetOnly` locks the session to the GET api route — eliminating the wasted failed-POST round trip on every subsequent call in environments where Google's serving drops POST bodies. The flag is only set after a successful GET (a total outage can't disable POST permanently). Playwright-tested: first call = 1 failed POST + 1 GET, second call = GET only

## [v01.73r] — 2026-08-04 06:41:08 PM EST

> **Prompt:** "I archived junk and pressed "Plan". This is what it looks like. Give me an option to add keywords like "Sinexcel" and have it automatically evaluate and add relevant adders like " data center project OR deal" and add it to the list in real-time, so I never have to leave that window."

### Added

#### `Scraper.gs` — v01.24g

##### Added
- `addPlanQuery` action (registered in `SCRAPER_PROJECT_ACTIONS` + `handleProjectAction_`): takes a raw term, dedupes case-insensitively against the saved plan (`plan_duplicate` + the covering group), enforces `SCRAPER_PLAN_TOTAL_MAX`(40) hard cap (`plan_full`), then one `aiComplete_` call shapes the term into a styled query group (5 in-prompt style examples); if the AI reply drifts off the term, falls back to `'"term" ' + scTopicTerms_(topic, 3)`. New group is `unshift`ed (prepended) so manual adds always fall inside every consumer's slice window; saved via `scSavePlan_`, logged to UsageLog + audit (`plan_add`)

##### Changed
- Plan consumption caps raised: `SCRAPER_PLAN_GDELT_MAX` 12→16, `SCRAPER_PLAN_GNEWS_MAX` 10→24

#### `Scraper.html` — v01.25w

##### Added
- Search Plan panel add-a-term UI: `#sc-plan-input` + Add button + Enter-key submit in `scShowPlan_`; `scPlanAdd_` calls `addPlanQuery` (no retry wrapper — avoids double AI spend), prepends the returned group as a highlighted `<li>` (textContent, XSS-safe), shows "Added — N query groups now saved", clears + refocuses the input; `plan_duplicate` renders "Already covered by: <group>"; new error strings `term_missing`/`plan_full`

##### Changed
- `scRunPlan` now calls `getQueryPlan` first and opens the saved plan instantly (protects manual adds); the planner only runs when no plan exists. New in-panel Rebuild button (`scPlanRebuild_`) is two-tap ("Replaces list — tap again") and re-renders via `scShowPlan_`. Unit-tested 12/12 (node, extracted `addPlanQuery`: dedupe/prepend/drift-fallback/cap/errors) + Playwright UI test (saved-plan open without planner call, real-time add, Enter+duplicate, two-tap rebuild)

## [v01.72r] — 2026-08-04 06:01:06 PM EST

> **Prompt:** "build the query planner and AI pre-filter at fetch time, as well as the Claude web-search backfill for an occassional "deep backfill" option. After archiving, I will only have 300+ relevant articles in my collection, so my priority is to fill it with other relevant articles."

### Added

#### `Scraper.gs` — v01.23g

##### Added
- Query planner: `QueryPlans` tab + `planQueries` action — one `aiComplete_` call turns the FULL topic paragraph + keywords + learned preferences into ≤`SCRAPER_PLAN_QUERIES_MAX`(24) entity-level query groups (`scGetPlan_`/`scSavePlan_`/`scJsonArray_`); `getQueryPlan` reads it back. Plan groups feed `scBuildFetchQueue_` (up to 10 gnews queries, label `plan`) and REPLACE the auto-built `scGdeltQueries_` set (up to 12 + liked-domain group, OR groups paren-wrapped for GDELT)
- Fetch-time pre-filter: `scPrefilterItems_` batch keep/drop (40 headlines/call, "when unsure KEEP") wired into `scCompileChunk_` and `backfillNow` before row insertion; fails open on any AI error; `filtered` count in state/response/audit; AI calls logged to UsageLog
- Deep backfill: `deepBackfillNow` — one Claude web-search task per invocation (`scWebSearchArticles_`: `claude-haiku-4-5` + `web_search_20250305`, `max_uses` 3, quarter × query-group tasks over 8 quarters × ≤8 groups), Enrich-style poison-safe `attempting` marker, rows arrive with snippet (summary) so Enrich is unnecessary, `searches` counted from `usage.server_tool_use`; `deepbf_key_missing` when ANTHROPIC_API_KEY is absent. Unit-tested 26/26 via node against extracted functions (plan parsing, GDELT paren-wrapping/caps, prefilter keep/drop + fail-open, web-search payload/parse/429)

#### `Scraper.html` — v01.24w

##### Added
- Plan button → `scRunPlan` (progress panel + toast) and `scShowPlan_` reusing the stats overlay shell to list the stored query groups
- Deep backfill button → `scRunDeepBackfill` with two-tap paid-search confirm, chunked loop, progress (tasks/articles/searches), `deepbf_key_missing` + `plan_parse_failed` error messages
- Compile/Backfill progress lines show `filtered` junk counts. Playwright-verified: plan overlay contents, arm label, missing-key toast, 3-chunk deep run (calls counted), screenshots inspected

## [v01.71r] — 2026-08-04 04:53:53 PM EST

> **Prompt:** "Continue with your recommendation. Also, since the GDELT backfill is so limited, explore other possible methods to backfill that could increase my fetch accuracy, even if it costs more tokens. If so, approximate how much more each method will cost. "

### Added

#### `Scraper.gs` — v01.22g

##### Added
- `ArticlesArchive` tab (Articles headers + `Archived At`) auto-created via `SCRAPER_TAB_HEADERS`; `archiveJunk` action moves unrated sub-`SCRAPER_CALIB_MIN_SCORE` articles there in one locked pass (read → idempotent-by-Article-ID archive append → single-write Articles rewrite), clears the row-indexed `scEnrich_` state, and returns `{archived, remaining}`. Unit-tested 25/25 via node against the extracted functions (partition, crash-recovery re-append, empty case, stats before/after)
- `getScoreStats` extended with per-band preview counts (`p0`–`p80`), `archivable` (unrated & <10), and `archived` (rows in the archive tab)

##### Changed
- `scExistingArticleUrls_` dedupe set now includes ArticlesArchive URLs, so Compile/Backfill can never re-import archived articles

#### `Scraper.html` — v01.23w

##### Added
- Stats panel: per-band `sc-stat-sub` line showing "N with preview · M title-only"; footer lines for archivable count (with Archive junk pointer) and already-archived count
- "Archive junk" card button: first tap fetches the live count and arms ("Archive 1781? Tap again", 6s timeout), second tap runs the single `archiveJunk` call through the progress panel with result toast. Playwright-verified end-to-end against stubbed backend (arm label, single call, toast, progress, post-archive stats)

## [v01.70r] — 2026-08-04 04:01:42 PM EST

> **Prompt:** "build the distribution panel"

### Added

#### `Scraper.gs` — v01.21g

##### Added
- `getScoreStats` action: one Articles-sheet scan returning rubric-aligned band counts (0-9 / 10-29 / 30-49 / 50-79 / 80-100), scored/unscored/total, over-20 count, snippet coverage, 👍/👎 totals, and the unrated ratable pool (score ≥ `SCRAPER_CALIB_MIN_SCORE`, no verdict)

#### `Scraper.html` — v01.22w

##### Added
- Stats button per project card → `#sc-stats-overlay` panel: big %-over-20 headline, five color-coded proportional band bars (colors matching the score-chip palette, hover titles naming the rubric band), and a corpus-health footer (scored of total with unscored hint, preview coverage %, rating counts, ratable pool). Harness-verified against stubbed stats: headline 36% (720/2000), bars proportional to band counts, close button and click-outside dismiss, screenshot visually checked

## [v01.69r] — 2026-08-04 06:02:52 AM EST

> **Prompt:** "fix the enrich stall"

### Fixed

#### `Scraper.gs` — v01.20g

##### Fixed
- Poison-URL stall in `scEnrichChunk_`: `UrlFetchApp` has no timeout, so a hanging site carried the execution into Google's uncatchable 6-minute kill; state was only saved at batch end, so the client's retry chain (POST → GET fallback → `scRetryOnce`, each leg hanging ~6 min) re-ran the same batch and re-hit the same URL forever. State is now persisted BEFORE every fetch with an `attempting` row marker; a leftover marker on the next run means the previous execution died mid-fetch on that row — it's counted unavailable, skipped, and the run continues. Per-fetch persistence also stops killed executions from losing the batch's other progress. Node-verified 8/8 by running the extracted shipped function against stubbed platform services: seeded mid-fetch kill state → poison row never re-fetched, counted failed, remaining rows enriched, run completes; fresh run persists the marker before all fetches and clears it in the final state

## [v01.68r] — 2026-08-04 03:33:53 AM EST

> **Prompt:** "build the enrich step"

### Added

#### `Scraper.gs` — v01.19g

##### Added
- `enrichNow` action + session-free `scEnrichChunk_` core: chunked/resumable abstract harvest for snippet-less articles (15 page fetches per call, 40s budget, row-cursor resume — safe because the Articles sheet is append-only); fetches with a browser-like User-Agent, writes to the Snippet column, counts failures without marking them so a later run retries; UsageLog fetch counting; returns processed/total/enriched/failed for the progress bar
- Pure `scExtractAbstract_`: og:description → twitter:description → meta description with either attribute order, single/double quotes, entity decode, whitespace collapse, 300-char cap — node-verified 10/10 against extracted source (fallback chain, precedence, entities, no-match, cap)

#### `Scraper.html` — v01.21w

##### Added
- Enrich button per project card + `scRunEnrich` chunk loop wired to the progress panel ("X/Y articles · N previews found · M unavailable"), completion/nothing-to-do toasts, resume-on-retry failure path — harness-verified through a 3-chunk stubbed run

## [v01.67r] — 2026-08-04 03:28:10 AM EST

> **Prompt:** "apply the three fixes. Recommend me some work-arounds to tackle the "title only" issue; Is there any way to get an abstract summary of the article instead of just judging by the title?"

### Fixed

#### `Scraper.gs` — v01.18g

##### Fixed
- Scoring rubric (fix 1): `scScoreBatch_` prompt now anchors five bands — 80-100 on-topic / 50-79 relevant subtopic / 30-49 adjacent context (corporate moves, financing, policy, supply chain, partnerships of relevant players, explicitly named) / 10-29 weak / 0-9 unrelated — plus "use the full range; do not default to the extremes". Replaces the two-anchor instruction that produced the bimodal near-zero distribution on the 2000-article re-score
- Title-only fairness (fix 2): same prompt now states a missing body is NOT evidence of irrelevance — headline-only articles (all GDELT backfill rows store an empty snippet) are scored on what the headline plausibly covers
- Feedback rebalance (fix 3): `scFeedbackPrompt_` caps 👎 exemplars at 👍-count + 2 and reframes them as "obvious junk the user filtered out… do NOT treat as a relevance ceiling" instead of "score articles like these LOW"; `scDistillFeedback_` prompt now instructs the distiller to state preferences positively first, with rejections at most a short final sentence. Node-verified against extracted source (6/6): all-downs history shows only 2 junk-framed exemplars with the ceiling warning, balanced history shows all ups + capped downs, empty history emits nothing

## [v01.66r] — 2026-08-04 02:39:32 AM EST

> **Prompt:** "After I tap + to add a suggested keyword to project keywords, give me an option to undo that +. Also, give me a clearer, more informative progress bar for every action button I can click (ie: Backfill, Analyze, Re-score collection)."

### Added

#### `Scraper.html` — v01.20w

##### Added
- Suggestion undo: added chips render a × (`.sc-sugg-undo`); `scCalAddSuggestion_` generalized into `scCalToggleSuggestion_` with `op: add|remove` through the same optimistic 900ms-debounced batch pipeline; payload builder applies ops in order and skips the request entirely on a net-zero batch (add undone before flush); failure rollback restores each chip's pre-tap state including its +/× button. Harness-verified: add → 1 `updateProject` (keyword present), undo → 2nd call (keyword gone, + restored), quick +× → no request
- Action progress bars: fixed bottom-left `#sc-prog-stack` (z-index 60 — visible above the articles/calibration overlay, nudged above the version pill), one `.sc-progress` panel per project with label, fill bar (percent when total known, sliding indeterminate stripe when not), stats line, and a 1s-tick elapsed clock; `scProgDone` turns it green and fades after 2.5s, `scProgFail_` freezes the reason for 5s. Wired into Compile (feeds/new/failed), Backfill (slices/found/failed), Analyze (scored/left + 🧠 note), and Re-score (clearing phase → scoring phase). Harness-verified fill progression `indet → 33% → 67% → 100%` via MutationObserver plus screenshot

## [v01.65r] — 2026-08-04 01:46:24 AM EST

> **Prompt:** "I added some suggested keywords to project keywords, but it took a very long time to process my clicks. Is there any way to speed that up?"

### Changed

#### `Scraper.html` — v01.19w

##### Changed
- Suggestion-add chips are now optimistic + batched: `scCalAddSuggestion_` flips the chip instantly and queues the addition; `scCalFlushSuggestions_` coalesces all taps within a 900ms debounce window into ONE `updateProject` (mid-flight taps re-flush after the response). Harness-verified: 4 rapid taps registered in 179ms against a 1.5s-latency stub, exactly 1 request carrying all 4 additions

##### Fixed
- Lost-update race eliminated: per-tap requests each built their payload from the pre-response project state, so rapid taps could overwrite earlier additions — the single batched payload merges every queued addition; on failure all batch chips roll back with re-tappable + buttons and a retry toast

#### `Scraper.gs` — v01.17g

##### Changed
- `scWriteSchedules_` skips the delete-and-reappend rewrite when frequencies, delivery, and custom config are unchanged — per-row `deleteRow` calls were the slowest part of `updateProject`, making scope-only edits sluggish

##### Fixed
- Scope-only project edits no longer wipe schedule rows' Next Run / Last Run — previously every `updateProject` reset live scheduler state, making the schedule immediately due again

## [v01.64r] — 2026-08-04 01:33:25 AM EST

> **Prompt:** "apply both changes"

### Changed

#### `Scraper.gs` — v01.16g

##### Changed
- Calibration excludes scores below `SCRAPER_CALIB_MIN_SCORE` (10) entirely — confirming articles the scorer already dismissed teaches it almost nothing
- Band mixer extracted into pure `scCalibMix_` and the silent low-band fallback removed: empty mid/high slots borrow only from each other, empty low slots borrow from mid/high, and the queue ends when the informative bands (30–70 / 70+) run dry — the low band (now 10–29) never substitutes for them. Node-verified against extracted source: all-low corpus → empty queue, 6/2/2 ratio on a mixed 10-pick, hi-substitution without lo-flooding, mid-stream termination, band order preserved

#### `Scraper.html` — v01.18w

##### Changed
- Calibration empty-state messages rewritten for the new behavior ("Nothing informative left to calibrate…" / "All caught up — nothing informative left to rate") with a pointer to Compile + Analyze; harness-verified render

## [v01.63r] — 2026-08-04 01:17:17 AM EST

> **Prompt:** "build the scheduler."

### Added

#### `Scraper.gs` — v01.15g

##### Added
- Scheduler: hourly `scSchedulerTick()` (LockService-guarded) walks the Schedules tab for Active rows whose Next Run has passed (or was never set, or whose run is mid-flight) and drives each through compile → analyze (incl. auto-distill) → brief → deliver via a persisted per-schedule phase state (`scSchedRun_<scheduleId>` Script Property), phase-stepping within a 240s tick budget and resuming next tick; 4s pauses between analyze chunks for free-tier AI RPM
- Session-free cores extracted: `scCompileChunk_` / `scAnalyzeChunk_` / `scBriefCore_` — `compileNow` / `analyzeArticles` / `previewBrief` are now thin session-validated wrappers with identical behavior
- Delivery: `scDeliverBrief_` appends a Reports-tab row (status `generated` / `emailed` / `email_failed`) and emails the brief via `MailApp` when delivery is `email`/`both`
- `scNextRun_`: pure next-run computation anchored at 7:00 AM ET per frequency (daily/weekly/monthly/quarterly/biannual/annual; custom parses "every N days", weekly fallback) — node-verified with 11 passing cases against the extracted source
- Trigger self-install: `scEnsureSchedulerTrigger_` (idempotent, property-guarded) hooked into `doGet` inside try/catch; `setupSchedulerTrigger()` manual fallback for the editor. Deploy handler untouched
- Paused/archived projects: schedules skip the cycle, advance Next Run, and drop stale run state; `scSchedulesFor_`/`listProjects` now return per-project `nextRun`/`lastRun`

#### `Scraper.html` — v01.17w

##### Added
- Green `⏰ next: <date>` chip on project cards (title-attr shows last run); "⏰ first run pending" variant for scheduled projects awaiting their first pass — harness-verified both variants render from stubbed `listProjects`

## [v01.62r] — 2026-08-04 01:08:07 AM EST

> **Prompt:** "I like your plan, but add ways to improve the fetching breadth as well. I am willing to spend more time and effort on the project topic/keywords/sources/ideally more."

### Added

#### `Scraper.gs` — v01.14g

##### Added
- `listArticles` extended: standard mode gains server-side filters (`minScore`, `days` on Fetched At, `q` needle over title/snippet/summary/source); new `mode=calibration` returns a stratified sample of unrated scored articles mixed ~60% mid-band (30–70) / 20% high / 20% low via a round-robin pattern, newest-first within bands
- New `distillPreferences` action: on-demand re-distill when the verdict count changed (otherwise returns the stored profile), plus `likedDomains` for the suggestions UI
- New `resetScores` action ("Re-score collection"): clears Summary + Relevance Score for a project in one batched range write (verdicts preserved) so the normal chunked Analyze loop re-scores with the current profile
- New `scLikedDomains_`: domains of 👍-rated articles, computed live — Compile adds up to 3 `site:` Google News queries (`liked-source` label) and Backfill adds one `domainis:` GDELT group (query cap 5 → 6)
- Distillation prompt now asks for adjacent topics/synonyms/entities beyond literal title phrases; `SCRAPER_PREFS_KEYWORDS_MAX` 8 → 12; Compile uses up to 9 learned keywords (was 6)

#### `Scraper.html` — v01.16w

##### Added
- Calibrate button per project card → calibration mode in the articles overlay: rate-and-replace card queue (8 visible, 30 fetched, background top-up under 5), session counter, auto `distillPreferences` every 10 ratings with 🧠 toast
- "What I've learned" box: profile note + suggested-keyword and liked-domain chips with one-tap add via `updateProject` (client-side payload merge); "Re-score collection" two-tap confirm → `resetScores` → reuses `scRunAnalyze`
- Standard mode filter bar (days / min score / keyword) wired to the new `listArticles` params; card markup extracted into shared `scArtCard_`
- Harness-verified end-to-end: 8-card open, remove+replace on rating, counter, distill at 10 ratings, learned box chips, suggestion add, min-score filter param; both-mode screenshots visually checked

## [v01.61r] — 2026-08-03 11:57:41 PM EST

> **Prompt:** "For a few article ratings, it took a long time before it captured and saved me ratings. When I am rating articles (thumbs up/down), create a status window to the right that shows the steps that it is going through, so that it is easier to debug in the future."

### Added

#### `Scraper.html` — v01.15w

##### Added
- Rating status panel `#sc-vlog`: fixed dark monospace log docked right of the articles card (z-index 51, responsive at ≤1240px/≤760px breakpoints). Each 👍/👎 tap opens a numbered `scVlogSession` with its own clock; every step logs with `+Xms` elapsed — tap registered, per-attempt send/reply (with per-request round-trip ms), transport-retry wait, `unknown_op` mid-update wait, saved ✓ / NOT saved, buttons unlocked. Sessions from concurrent taps interleave safely (per-session numbering + per-session t0); log capped at 60 lines; × hides it (reappears on next rating); hidden when the articles overlay closes
- `scSendVerdict` restructured with sequential per-attempt instrumentation (inlining the former `scRetryOnce` wrapping so each attempt is individually visible); behavior unchanged — one transport retry + one `unknown_op` retry, 2.5s waits
- Harness-verified: healthy tap (attempt 1 → saved), flapping server (unknown_op → wait → attempt 2 → saved), close button, and screenshot visual check

## [v01.60r] — 2026-08-03 11:33:05 PM EST

> **Prompt:** "build the distillation step while I continue to rate articles."

### Added

#### `Scraper.gs` — v01.13g

##### Added
- Feedback distillation: `scDistillFeedback_` sends ALL of a project's 👍/👎-rated titles (up to `SCRAPER_DISTILL_TITLES_MAX` = 40/side) to the AI and stores the result — a ≤150-word learned-preferences note plus up to 8 suggested search phrases — in a new user-visible `Preferences` sheet tab (`Project ID`, `Owner`, `Learned Preferences`, `Suggested Keywords`, `Verdicts Used`, `Distilled At`); auto-created by `ensureScraperTabs_`, upserted one row per project
- Distillation runs automatically inside `analyzeArticles` when total verdicts ≥ `SCRAPER_DISTILL_MIN_VERDICTS` (3) AND the count changed since the last distillation — at most one extra AI call per Analyze cycle (the stored `Verdicts Used` count makes follow-up chunk invocations skip it); failures are non-fatal and retried on the next Analyze
- Scoring prompts now include the learned note via `scPrefsPrompt_` (between PROJECT SCOPE and the raw exemplars); `previewBrief` includes it too so briefs reflect learned preferences
- Learned keywords widen fetching: `scBuildFetchQueue_` adds up to 2 `learned`-labeled Google News queries (6 keywords, OR'd in 3s) and `scGdeltQueries_` adds one learned query group to Backfill (cap raised 4 → 5 groups)
- `analyzeArticles` returns `distilled: N` (verdict count) when a distillation ran, and counts the distillation call in `UsageLog`

#### `Scraper.html` — v01.14w

##### Added
- The Analyze loop watches for `data.distilled` and appends "🧠 Preferences updated from your N ratings." to the completion toast (both the "articles scored" and "already scored" paths)

## [v01.59r] — 2026-08-03 11:21:17 PM EST

> **Prompt:** "I opened Articles and started to rate them, but only the 1st article's thumbs-up rating went through. When I tried to thumbs-up the 2nd and 3rd articles, it would get grayed-out for a few seconds before resetting to default. Did I actually do anything by rating the 2nd and 3rd articles? Also, fix this issue."

### Fixed

#### `Scraper.html` — v01.13w

##### Fixed
- Verdict saves now go through `scSendVerdict`: retries once on transport failure (matching `scRetryOnce`) and once more with a 2.5s delay when the server answers `unknown_op` — the signature of Google's `/exec` serving briefly flapping to a stale deployment version after a GAS redeploy, which made taps land on code that didn't know `setArticleVerdict` yet. Server writes are absolute values, so retries are idempotent. Root cause confirmed by a full-fidelity Playwright harness (real page + handlers, stubbed GAS routes): the client path was correct in isolation; flap, healthy, and persistent-failure scenarios all verified post-fix
- New `unknown_op` entry in `SC_ERROR_MESSAGES` ("The server is finishing an update — wait a few seconds and try again") replaces the generic fallback toast for all actions during deploy flaps

## [v01.58r] — 2026-08-03 10:06:55 PM EST

> **Prompt:** "fix articles and build the feedback loop. It is imperative that Scraper can learn about my preferences and can improve its article fetching and scoring capabilities to be realistically useful."

### Added

#### `Scraper.gs` — v01.12g

##### Added
- `setArticleVerdict` action records 👍/👎/clear into the existing User Verdict column (ownership-checked by project + owner, audit-logged)
- Verdict exemplars feed the scoring prompt: `analyzeArticles` collects up to 8 newest 👍 and 8 newest 👎 titles per project and `scScoreBatch_` injects them as a USER FEEDBACK section between the project scope and the article list, so every future scoring batch calibrates to the user's confirmed preferences

##### Fixed
- `listArticles` now sorts the project's full corpus by score (unscored last, newest-first within ties) **before** applying the 100-row cap — the previous newest-fetched-first cap let a large low-relevance backfill crowd every relevant article out of the overlay

#### `Scraper.html` — v01.12w

##### Added
- 👍/👎 verdict buttons on each article card (delegated click handler, active-state highlight, tap-again-to-clear, disabled while the save round-trips); verified via Playwright visual test

#### `Scraper-diagram.md`

##### Changed
- Sequence diagram updated: top-scored `listArticles` selection, exemplar titles in the scoring step, and the new `setArticleVerdict` flow; mermaid.live pako URL regenerated and decompression-verified

## [v01.57r] — 2026-08-03 08:17:43 PM EST

> **Prompt:** "16 minutes later, the backfill progress looks like this. Therefore, I don't think there's a need to "fix" the backfill. However, I do want you to show failures in the progress UI."

### Changed

#### `Scraper.html` — v01.11w

##### Changed
- Backfill progress button now appends the silent-error count from `backfillNow` responses (`, N failed`) when nonzero — failed GDELT slices (e.g. rate-limit rejections, which GDELT returns as HTTP-200 plain text) were previously invisible until the completion toast

## [v01.56r] — 2026-08-03 06:43:09 AM EST

> **Prompt:** "Key added as "Scraper-GAS" with an expiry date of "never". Continue the build."

### Added

#### `Scraper.gs` — v01.11g

##### Added
- GDELT DOC 2.0 historical backfill engine: new `backfillNow`/`getBackfillStatus` actions slice the past 24 months per month × per query and pull date-ranged English article lists (≤250 per slice) into the Articles tab — deduped against existing URLs, batch-appended via `setValues` (not per-row `appendRow`), time-budgeted (40s / 6 fetches per call), with compact resumable state in Script Properties (slices are derived from `startedAt` + stored queries rather than stored, keeping state well under the 9KB property limit)

#### `Scraper.html` — v01.10w

##### Added
- Backfill button on each project card runs the chunked backfill loop with live progress ("Backfilling… n/total (X found)") and a completion toast; transport failures auto-retry once and an interrupted run resumes where it left off

## [v01.55r] — 2026-08-03 06:20:57 AM EST

> **Prompt:** "Repo created per your instructions and I made sure Claude Github App has access to the bess-aidc-library repo. Also, I have created an Anthropic Console account under jonyang92@gmail.com and funded it with $200."

### Added

#### `Scraper.gs` — v01.10g

##### Added
- Claude (Anthropic) AI provider wired into the swappable `aiComplete_()` layer: new `scClaudeComplete_()` calls the Messages API with Sonnet 5 (`claude-sonnet-5` default, `ANTHROPIC_MODEL` Script Property overrides) using an `ANTHROPIC_API_KEY` Script Property, mapping responses/errors to the same `ai_*` taxonomy as Gemini (`ai_key_missing`, `ai_rate_limited`, `ai_http_<code>` with trimmed API message, `ai_bad_json`, `ai_empty_response`)
- `AI_PROVIDER` Script Property now switches providers (`claude` | `gemini`) without a code change; Gemini remains the default and free-tier fallback

##### External
- Companion library repo `LightAISolutions/bess-aidc-library` seeded and pushed: 76-file skeleton inherited from this repo's template conventions (CLAUDE.md, rules, hooks, skills, trimmed auto-merge workflow), plus `library/news/<segment>/<year>/` archive structure, `library/specsheets/` placeholder, and the 55-company `WATCHLIST.md`

## [v01.54r] — 2026-08-03 02:51:07 AM EST

> **Prompt:** "Another error message. Resolve it."

### Fixed

#### `Scraper.gs` — v01.09g

##### Fixed
- Transport-level `http_404` on Analyze: live probes confirmed the deployment healthy (fast requests return 200 in 4–9s), isolating the failure to long-running exec requests dying at Google's HTTP front-end. `analyzeArticles` now makes exactly 1 AI call per invocation (was up to 3 + 2s sleeps), keeping each request compile-chunk-sized; the client loop provides continuation and free-tier RPM spacing. Removed the now-unused `SCRAPER_AI_CALL_SPACING_MS` intra-request sleep

#### `Scraper.html` — v01.09w

##### Fixed
- Compile and Analyze loops now automatically retry a failed chunk once (2.5s pause) before surfacing a transport error — safe because server-side state is chunked/resumable

## [v01.53r] — 2026-08-03 02:38:35 AM EST

> **Prompt:** "I created the GEMINI_API_KEY on my jonyang92@gmail.com account. Then, I added the GEMINI_API_KEY to the Scraper app's Script Properties on lightaisolution@gmail.com's account (owner of the app). However, when I pressed Analyze with or without Compile first, both times ended in the same error (attached). Resolve this."

### Fixed

#### `Scraper.gs` — v01.08g

##### Fixed
- `ai_http_404` on Analyze: the hardcoded `gemini-2.5-flash-lite` model was retired by Google on 2026-07-09 (months before its announced Oct 16 shutdown). Replaced the hardcoded model with live discovery: `scGeminiDiscoverModel_()` queries the ListModels endpoint (paginated), filters to stable `generateContent`-capable Gemini models (excludes preview/exp/image/tts/live/audio/embed/thinking variants), prefers flash-lite → flash → any Gemini with newest version + shortest name, and caches the pick in the `GEMINI_MODEL_AUTO` Script Property. A 404 on a cached model triggers one automatic rediscover-and-retry, so future model retirements self-heal. Manual `GEMINI_MODEL` Script Property still overrides everything
- Gemini API error bodies are now surfaced: non-200 responses throw `ai_http_<code> — <API error message>` instead of an opaque status code
- `analyzeArticles` now reports `hasArticles` so the client can distinguish "no articles compiled yet" from "everything already scored"

#### `Scraper.html` — v01.08w

##### Fixed
- Clicking Analyze on a project with no compiled articles now shows "No articles to analyze yet — run Compile first to gather news." instead of the misleading "All articles were already scored."
- Added a user-facing message for the no-compatible-model case

## [v01.52r] — 2026-08-03 02:15:55 AM EST

> **Prompt:** "Deploy works and does give me a bunch of Google News that are questionably related to my topic. Continue with Phase 3."

### Added

#### `Scraper.gs` — v01.07g

##### Added
- Phase 3 AI layer: provider-agnostic `aiComplete_()` abstraction — Gemini free tier today (`scGeminiComplete_` via `generateContent` v1beta, default model `gemini-2.5-flash-lite` overridable with a `GEMINI_MODEL` Script Property; key from `GEMINI_API_KEY`), Claude slot ready as a future branch
- `analyzeArticles` route: chunked AI relevance scoring — up to 3 AI calls per invocation × 10 articles per call, 2s spacing for free-tier RPM headroom; scores (0–100) and 1–2 sentence summaries (for scores ≥50) written back to the Articles tab; unscored articles are the natural resume state
- `previewBrief` route: executive brief synthesized from the top 30 relevant articles (score ≥50), plain-text overview + bullets
- `listArticles` now returns `summary` and `score`; `scLogUsage_` extended to track AI calls alongside fetch calls in UsageLog

#### `Scraper.html` — v01.07w

##### Added
- Analyze button per project card driving the chunked scoring loop with progress ("Scoring… N left")
- Articles panel: color-coded relevance score chips (green ≥70, amber ≥50, red <50), AI summaries shown in place of raw snippets, scored-first sort order
- Brief button in the articles panel rendering the AI executive brief in a styled box
- User-facing error messages for AI failure modes (missing key, rate limit, empty/unreadable response, no relevant articles)

## [v01.51r] — 2026-08-03 01:23:34 AM EST

> **Prompt:** "I signed into the live Scraper page and created a real project. Continue with Phase 2."

### Added

#### `Scraper.gs` — v01.06g

##### Added
- Phase 2 compilation engine: `scBuildFetchQueue_()` builds Google News RSS search queries from topic terms (stopword-filtered via `scTopicTerms_`), keyword OR-chunks, industry combinations, and exclusion negations, plus the project's user-specified feed URLs
- `scParseFeed_()` parses both RSS 2.0 and Atom feeds via XmlService with HTML-stripped, length-bounded fields
- `compileNow` route: chunked, resumable compilation — each call fetches ≤6 URLs within a 40s budget, persists progress in Script Properties (`scCompile_<projectId>`), dedupes against existing article URLs per project, caps runs at 200 new articles, appends rows to the Articles tab, and logs fetch counts to UsageLog; the client loops until `done`
- `getCompileStatus` and `listArticles` routes (owner-scoped, newest-first, capped at 100)
- Dispatcher/action-list extended with the three new ops (doPost + doGet api mirror route automatically)

#### `Scraper.html` — v01.06w

##### Added
- Compile button per project card with live progress label ("Compiling… N/M") driving the chunked `compileNow` loop, finishing with a result toast and auto-opening the articles panel
- Articles panel overlay listing fetched articles (linked title opening in a new tab, source · date meta line, snippet)

##### Fixed
- Articles panel close button now shares the wizard close-button styling

