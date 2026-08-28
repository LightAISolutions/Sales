# Changelog Archive

Older version sections rotated from [CHANGELOG.md](CHANGELOG.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 100 version sections.

Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with per-entry EST timestamps and project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository).

## Rotation Logic

When Claude runs Pre-Commit #7 on the push commit, after creating the new version section in CHANGELOG.md, this rotation procedure runs:

### Quick rule (memorize this)

> **100 triggers, date groups move.** When sections exceed 100, rotate the oldest date group. A date group is ALL sections sharing the same date — could be 1 section or 500. Never move part of a date group. Today's sections (EST) are always exempt. Repeat until ≤100 non-exempt sections remain.

### Step-by-step

1. **Count** — count all `## [vXX.XX*]` version sections in CHANGELOG.md (exclude `## [Unreleased]`)
2. **Threshold check** — if the count is **100 or fewer**, stop — no rotation needed
3. **Current-day exemption** — get today's date (EST via `TZ=America/New_York date '+%Y-%m-%d'`). Any version section whose date (`YYYY-MM-DD` in the header) matches today is **exempt from rotation**, even if the total exceeds 100. This means the main changelog can temporarily exceed the 100-section limit on busy days — it self-corrects on the next push after midnight
4. **Mandatory first rotation** — if the threshold check triggered (step 2), you MUST rotate at least one date group before checking the non-exempt count. Do NOT skip straight to the re-check in step 7 — the trigger means "rotate now", not "check if rotation is needed". Proceed to steps 5–6 with the oldest non-exempt date group
5. **Identify the oldest date group** — among the non-exempt sections (dates before today), find the **oldest date** that appears in any section header. **ALL sections sharing that date form a single date group** — this could be 1 section or 100+ sections. The entire group moves together, no matter how many sections it contains
6. **Rotate the group** — move the entire date group from CHANGELOG.md to CHANGELOG-archive.md:
   - **SHA enrichment** — as each version section is moved, look up its push commit SHA and append ` — [SHORT_SHA](https://github.com/ORG/REPO/commit/FULL_SHA)` to the header. Resolve ORG/REPO from `git remote -v`. If the header already contains a SHA link, skip it. If the lookup fails (commit not found — common when git history is shallow), move the section as-is without a SHA link. **Lookup by changelog type:**
     - **Repo CHANGELOG** — headers contain the repo version directly. For `## [v01.05r] — 2026-02-28 ...`, run `git log --oneline --all --grep="^v01.05r " | head -1`
     - **Page/GAS changelogs** — headers contain the page/GAS version AND a repo version cross-reference at the end (e.g. `## [v01.44w] — 2026-03-13 ... — v03.09r`). **Use the repo version cross-reference** for the lookup — it's the same version that appears in commit messages. Run `git log --oneline --all --grep="^v03.09r " | head -1`. This is more efficient than trying to match page versions to commits, since commit messages use repo version prefixes, not page version prefixes
     - **Batch optimization** — when rotating multiple sections, build a lookup table first: run `git log --oneline --all` once, then match each section's repo version against the output in-memory (or via grep). This avoids N separate `git log` calls for N sections
   - Remove them from CHANGELOG.md
   - Insert them into CHANGELOG-archive.md **above** any previously archived sections but below the archive header, in their original order (reverse-chronological, same as in CHANGELOG.md)
   - On the first rotation, remove the `` placeholder
7. **Re-check** — after moving one date group, re-count the non-exempt sections remaining. If still above 100, repeat steps 5–6 with the next oldest date group. Continue until ≤100 non-exempt sections remain (or only today's sections are left)

### Key rules

- **Group by date, not individually** — never split a date group across the two files. All sections from the same day move together. A date group can contain any number of sections — the count of sections in the group is irrelevant; the group always moves as a unit
- **Never rotate today** — today's sections (EST) always stay in CHANGELOG.md regardless of count. The limit is enforced against older dates only
- **Common scenario: all non-exempt sections share one date** — this happens after a busy day followed by a new day. Example: 103 sections total, 3 from today, 100 from yesterday. All 100 from yesterday form one date group → rotate all 100 at once, leaving only today's 3. Do NOT move just enough to reach 100 — the date group is indivisible
- **Preserve content verbatim** — sections are moved exactly as-is (categories, entries, timestamps). No reformatting. The only modification during rotation is SHA enrichment (step 5) — adding a commit SHA link to headers that don't already have one
- **Order in archive** — newest archived sections appear at the top of the archive (just like CHANGELOG.md uses reverse-chronological order). When appending a newly rotated date group, insert it **above** any previously archived sections but below the archive header
- **Threshold is configurable** — the limit of 100 sections is defined in Pre-Commit #7 in CLAUDE.md. To change it, update the number there
- **SHA enrichment is MANDATORY — never skip it** — this is the most commonly skipped step during rotation. The "distraction tunnel" pattern causes it: moving large blocks of text is complex, and the per-section SHA lookup gets lost in the complexity. **Before writing any rotated section to the archive, verify it has a SHA link appended.** If you catch yourself about to insert sections without SHA links, STOP and go back to step 5. The SHA enrichment step applies to BOTH the repo CHANGELOG archive AND all page/GAS changelog archives — every `## [v...]` header in every archive file must have a commit SHA link. For page/GAS changelogs, look up the SHA using the repo version cross-reference at the end of the header (e.g. `— v02.90r` → search for `v02.90r` in git log)

### Post-rotation verification (MANDATORY)

After completing all rotation steps, run this verification before proceeding:

```
grep '^## \[v' CHANGELOG-archive.md | grep -v '— \[' | head -5
```

If ANY lines appear (sections without SHA links), the rotation is incomplete — go back and enrich those sections. **Do not commit until this check passes.** Run the same check on any page/GAS changelog archives that were rotated.

### Examples

**Scenario A: 103 sections, 3 from today, 100 from yesterday (single previous date)**
- 3 sections from today (exempt), 100 from yesterday (non-exempt)
- 100 ≤ 100 → no rotation needed (the threshold counts non-exempt only)

**Scenario B: 104 sections, 3 from today, 101 from yesterday (single previous date)**
- 3 exempt, 101 non-exempt — all 101 share one date
- Rotate ALL 101 at once → 3 sections remain → done
- Result: CHANGELOG has only today's 3 sections

**Scenario C: 102 sections, all from different dates**
- Sections span dates 2026-01-01 through 2026-02-21, today is 2026-02-21
- Today's section (2026-02-21) is exempt → 101 non-exempt sections
- Oldest date group: 2026-01-01 (1 section) → rotate it → 100 non-exempt remain → done

**Scenario D: 102 sections, 5 from today**
- 5 sections from today (exempt), 97 from older dates
- 97 ≤ 100 → no rotation needed despite 102 total

**Scenario E: 105 sections, 3 from today, oldest date has 4 sections**
- 102 non-exempt sections, oldest date has 4 → rotate those 4 → 98 non-exempt remain → done

**Scenario F: 105 sections, 3 from today, oldest two dates have 2 each**
- 102 non-exempt → rotate oldest date (2 sections) → 100 non-exempt → done

---

## [v02.34r] — 2026-08-11 02:25:14 AM EST — [d1366db](https://github.com/LightAISolutions/Sales/commit/d1366db3d54cc0928718cb45afd19d7f3ffe0fa6)

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

## [v02.33r] — 2026-08-10 11:08:22 PM EST — [5150fe2](https://github.com/LightAISolutions/Sales/commit/5150fe2)

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

## [v02.32r] — 2026-08-10 10:17:55 PM EST — [16463a3](https://github.com/LightAISolutions/Sales/commit/16463a3)

> **Prompt:** "Re-focus back to when you finished compiling all 40 AIDC industry company dossiers and were about to generate the AIDC market report. Do so now. Synthesize directly from the profiles and cite their sources without new research: turbine/transformer scarcity economics, behind-the-meter power (xAI/Crusoe as templates), the 800 VDC transition, BESS competitive dynamics, and the craft-labor bottleneck — shaped as the sales-strategy deliverable for Jon's AIDC power/storage pipeline."

### Added
- **AIDC Market Report** (`repository-information/AIDC-MARKET-REPORT.md`, new) — the sales-strategy deliverable the 40-company Profiler expansion was built for. Synthesized exclusively from the 40 dossiers with no new research: 8 parallel extraction agents returned 572 themed, source-tagged claims (40/40 company coverage), then a 4-agent adversarial verification pass checked 353 report claims against the dossiers (6 errors + 14 nitpicks found, all corrected). Nine sections: 12 confidence-tagged Key Judgments; the demand backdrop; the five requested themes (turbine/transformer scarcity economics, behind-the-meter power with xAI/Crusoe as templates, the 800 VDC transition, BESS competitive dynamics, the craft-labor bottleneck); a sales playbook (40-company account map, entry points/talk tracks, timing triggers keyed to the armed refresh Routines, pipeline risks); and method/citation notes. Every factual claim carries its dossier source label + publication date; `strategyRead`-derived items are labeled [Analysis] with the dossiers' confidence tags preserved
- README structure tree entry for the new report file (`README.md`)

### Changed
- Session context auto-reconstructed at session start (stale v02.30r → v02.31r) from the CHANGELOG per the Session Start Checklist; the v02.24r Previous Sessions entry was removed under the 2-session cap (`repository-information/SESSION-CONTEXT.md`, intermediate commit)

## [v02.31r] — 2026-08-10 08:28:24 PM EST — [476bc71](https://github.com/LightAISolutions/Sales/commit/476bc71)

> **Prompt:** "continue with your recommendation"

### Changed
- **Amazon dossier revised to profileVersion 2** (`live-site-pages/profiler-data/amazon.profile.json`) — added a supply-chain read answering "which BESS OEM does AWS use?", which the dossier previously could not support. Three new confidence-tagged `strategyRead` entries: (High) the three-layer storage-procurement distinction — Layer 1 utility-scale BESS where developers (AES, Primergy) own the OEM decision, Layer 2 behind-the-meter campus BESS where Amazon has no announced deployments (a structural contrast with xAI and Crusoe), Layer 3 rack-level BBU where AI-specific battery demand actually lands; (Low) the Samsung SDI BBU thread — April 2026 reports of final-stage AWS talks on a ~$700M BBU-based UPS supply agreement and July 2026 reports of BBU cells shipping via Taiwan's Simplo with Amazon among end customers, neither company-confirmed, both unnamed-source trade press, with Samsung SDI in parallel talks with Meta and Google; (Low) the Fluence-at-Bellefield inference flagged explicitly as an untested inference from AES's ~28% Fluence stake, with no press release, filing, or trade coverage naming the project's battery supplier
- Six new sources added at their chronological positions (Digitimes, TechTimes, UPI, AsiaToday, AES 2025 annual report; the Bellefield Phase 1 source was already present), each labeled with its confirmation status
- `live-site-pages/profiler-data/archive/amazon.profile.v1.json` + `archive-index.json` — v1 archived per the Archival Procedure before the revision
- `live-site-pages/profiler-data/profiler-companies.json` — Amazon `lastUpdated` synced to 2026-08-10

## [v02.30r] — 2026-08-10 04:42:24 AM EST — [ecaf52f](https://github.com/LightAISolutions/Sales/commit/ecaf52f)

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

## [v02.29r] — 2026-08-10 04:25:55 AM EST — [5d41ecb](https://github.com/LightAISolutions/Sales/commit/5d41ecb)

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

## [v02.28r] — 2026-08-10 04:13:24 AM EST — [157fc95](https://github.com/LightAISolutions/Sales/commit/157fc95)

> **Prompt:** "I tried to attach a 30 second voice recorder memo via browser files and it stayed "uploading" for many minutes without any Google consent screens popping up. What's wrong? Fix it."

### Fixed
- `Profiler.html` (v01.22w) — The Drive consent popup never opened, so `ovDriveToken`'s callback never fired and the upload hung on "Uploading…" indefinitely. `requestAccessToken()` was being called from an async continuation — inside `ovLoadGis().then(...)`, itself inside the file input's `change` handler — by which point the transient user activation from the tap is gone and mobile browsers silently block the popup. Consent is now requested from the button's `click` handler while the gesture is live, and the file picker opens only after a token is in hand. `ovPreloadGis()` warms the GIS library when the admin form renders so the tap path stays synchronous
- `Profiler.html` (v01.22w) — `initTokenClient` had no `error_callback`. GIS reports `popup_failed_to_open` and `popup_closed` exclusively through that handler, so a blocked or dismissed consent window produced total silence. Added it, mapped to distinct error codes, with `ovDriveErrText` rendering each as an actionable sentence
- `Profiler.html` (v01.22w) — Added a 120 s watchdog around the token request (`ovDriveRequest` settles exactly once via a `done` guard) and an `AbortController` timeout on the multipart upload, so no failure mode can leave the UI waiting forever

## [v02.27r] — 2026-08-10 04:01:03 AM EST — [37ac866](https://github.com/LightAISolutions/Sales/commit/37ac866)

> **Prompt:** "When I attach meeting recording and click voice recorder, it shows that I can only record up to 10 minutes and 27 seconds. Why is that? I want to be able to comfortably record 1-hour long meeting audio, up to 2-hours per meeting even."

### Changed
- `Profiler.html` (v01.21w) — Meeting audio over 6 MB now uploads through Drive's resumable protocol in 8 MB chunks (`ovDriveSendChunk`, XHR so the 308 "Resume Incomplete" responses are readable and `upload.onprogress` gives byte-level progress) with three retries per chunk on exponential backoff. A 1-hour recording is ~50 MB and a 2-hour one ~150 MB — the previous single-shot multipart POST restarted from zero on any connection blip at that size. The multipart path is retained as `ovDriveMultipart` for small files and as the fallback when the resumable session's `Location` header is not readable
- `Profiler.html` (v01.21w) — The upload status line now reports a percentage instead of a static "Uploading…"
- `Profiler.html` (v01.21w) — The recording button is relabelled "🎙 Attach saved recording" and carries a hint directing the developer to record in the phone's own recorder app first and browse to the saved file. The record-now shortcut Android offers inside the file picker is a short-clip capture path (~10 min on a Galaxy A54) and is the wrong entry point for a meeting. `accept` stays `audio/*` on purpose — narrowing to an extension list would grey out any container the list missed, which is a hard block, whereas the picker shortcut is only a wrong turn the hint steers around

## [v02.26r] — 2026-08-10 03:38:54 AM EST — [7404577](https://github.com/LightAISolutions/Sales/commit/7404577)

> **Prompt:** "I confirm that Profiler's oauthScopes include https://www.googleapis.com/auth/drive. I then ran _getCacheEpoch and it executed, but I didnt see the consent screen pop up. \n\nStep 0:\n1. I saved a typed note successfully. \n2. I failed to attach the recorded voice recorder clip. See 2nd attached picture. \n3. The log and its copy function works for the typed note. To be tested for the voice recorder clip."

### Fixed
- Meeting-recording upload failed with `google_sign_in_unavailable`. `ovDriveToken` checked for `window.google` directly, but the GIS library is injected on demand by the sign-in flow — on a page load with an existing session that flow never runs, so the library was absent even though the user was signed in. The Drive token request now goes through `ovLoadGis()` first
- CSP `connect-src` did not include `https://www.googleapis.com`, so the Drive multipart upload would have been blocked even once GIS loaded. Added it, matching `Receipts.html` which performs the same upload
- Three note-box status messages still promised the log would update "after the next deploy (~1–2 min)". Notes write straight to Drive with no deploy since v02.25r — the messages now say the note is visible immediately

## [v02.25r] — 2026-08-10 02:17:53 AM EST — [ebd7804](https://github.com/LightAISolutions/Sales/commit/ebd7804)

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

## [v02.24r] — 2026-08-09 11:18:02 PM EST — [a288645](https://github.com/LightAISolutions/Sales/commit/a288645799c20d80924396004fd6c47b6b357506)

> **Prompt:** "continue with your recommendation. Also, for all dossiers, change the source formatting to include the article date instead of the accessed date. Then, make sure to organize them chronologically with the most recent news first."

### Added
- **Seven post-earnings refresh Routines armed** for the batch-2 public tickers, following the existing one-shot convention (fresh session, verify-then-refresh, self-re-arming): EVE Energy (fires 2026-08-21 — H1 report expected 08-18/08-20, sources conflicted), ABB (2026-10-21 — Q3 scheduled 10-20 per ABB's calendar), Hitachi Energy (2026-10-24 — parent Hitachi Q2 FY26 expected 10-23), Equinix (2026-10-29 15:00 UTC — Q3 estimated ~10-28, staggered after Meta), Quanta Services (2026-10-30 17:00 UTC — Q3 expected 10-29, staggered after LG Energy Solution), Constellation Energy (2026-11-10 — Q3 confirmed 11-09), Siemens Energy (2026-11-12 — Q4 FY26 call company-announced 11-11; prompt carries the Omterra rebrand note). Report dates verified via web search on 2026-08-09; estimates marked as such in each trigger prompt

### Changed
- **Source format migrated across all 40 dossiers** (`live-site-pages/profiler-data/*.profile.json`): `sources[].accessed` (access date) replaced by `sources[].date` (publication/article date, `YYYY-MM-DD` or `YYYY-MM`; omitted for undated evergreen pages — product pages, IR hubs, market-report landing pages, aggregator quote pages), and every `sources[]` array reordered chronologically with the most recent publication first, undated entries last. Dates derived from URL paths, matching `recentDevelopments` entries, label text, and model knowledge — executed by 8 parallel subagents (5 profiles each), with low-confidence choices reported per batch; all 40 files JSON-validated and ordering-verified programmatically
- `repository-information/PROFILER-SCHEMA.md` — `sources[]` definition updated to the `date` field with newest-first ordering; the "List first-party sources first" citation-order rule replaced (source priority now governs research order only); "Dates everywhere" rule updated
- `live-site-pages/Profiler.html` (v01.17w → v01.18w) — source lists in the app and the Word/PDF export now render the publication date (with a legacy `accessed` fallback for archived pre-migration profiles); meta tag synced
- **Quarterly private-company sweep expanded from 3 to 6 companies** — Crusoe, Huawei Digital Power, and xAI folded into the recurring Routine (renamed "Profiler quarterly check — Hithium, FlexGen, Rosendin, Crusoe, Huawei DP & xAI (private)") with per-company watch items; the xAI entry converts to a post-earnings trigger if the SpaceX IPO completes and quarterly reporting begins
- `.claude/rules/profiler-app.md` — "Currently armed" registry updated with the 7 new one-shot entries (chronological) and the expanded 6-company sweep line

## [v02.23r] — 2026-08-09 11:02:49 PM EST — [41211ef](https://github.com/LightAISolutions/Sales/commit/41211ef06d5ad9aacfa73141e90d30523d9d1062)

> **Prompt:** "profiler batch 2 as recommended"

### Added
- **Ten new Intel Briefing dossiers — Batch 2 of the AIDC market-report coverage expansion** (all profileVersion 1, in `live-site-pages/profiler-data/`): xAI (`xai.profile.json`), Crusoe (`crusoe.profile.json`), Equinix (`equinix.profile.json`), Constellation Energy (`constellation-energy.profile.json`), Siemens Energy (`siemens-energy.profile.json`), Hitachi Energy (`hitachi-energy.profile.json`), ABB (`abb.profile.json`), Huawei Digital Power (`huawei-digital-power.profile.json`), EVE Energy (`eve-energy.profile.json`), Quanta Services (`quanta-services.profile.json`). Researched via 20 parallel subagents — two per company (first-party IR/press/product + third-party filings/consensus/trade press per the Source Priority Protocol), all sources accessed 2026-08-09. Categories: supplier ×5 (Siemens Energy, Hitachi Energy, ABB, Huawei Digital Power, EVE Energy), hyperscaler ×2 (xAI, Equinix), developer ×2 (Crusoe, Constellation Energy), integrator ×1 (Quanta Services). Unconfirmed/press-only items flagged (Low confidence) throughout — e.g. xAI combined-fleet GPU/2 GW tracker figures, Crusoe valuation marks, Constellation PPA pricing (analyst estimates), the EVE DoD 1260H listing (Reuters-relayed), Huawei sub-segment claims, the Siemens Energy Omterra rebrand's ticker implications. Render-verified headlessly: 40 home cards, all 10 dossiers show BLUF summaries and Key Judgments with zero page errors
- `live-site-pages/profiler-data/profiler-companies.json` — 10 new registry entries with IC-voice taglines; roster now 40 companies
- `README.md` — tree entries for the 10 new profile JSONs

## [v02.22r] — 2026-08-09 10:24:17 PM EST — [4da38db](https://github.com/LightAISolutions/Sales/commit/4da38dbbcae8993a09cd2990e9f89bbc074d58ec)

> **Prompt:** "profiler batch 1 as recommended"

### Added
- **Ten new Intel Briefing dossiers — Batch 1 of the AIDC market-report coverage expansion** (all profileVersion 1, in `live-site-pages/profiler-data/`): Vertiv (`vertiv.profile.json`), Delta Electronics (`delta-electronics.profile.json`), Eaton (`eaton.profile.json`), Schneider Electric (`schneider-electric.profile.json`), GE Vernova (`ge-vernova.profile.json`), LITEON (`liteon.profile.json`), Oracle (`oracle.profile.json`), OpenAI (`openai.profile.json`), CoreWeave (`coreweave.profile.json`), Bloom Energy (`bloom-energy.profile.json`). Researched via 20 parallel subagents — two per company (first-party IR/press/product + third-party filings/consensus/trade press per the Source Priority Protocol), all sources accessed 2026-08-09. Categories: supplier ×6 (Vertiv, Delta, Eaton, Schneider, GE Vernova, LITEON, Bloom), hyperscaler ×3 (Oracle, OpenAI, CoreWeave). Unconfirmed/press-only items flagged (Low confidence) throughout — e.g. the reported Goldman NT$4,500 Delta target, Megmeet power-shelf displacement reports, OpenAI press-reported financials (no audited statements exist), the reported $2B Delta–Infineon SiC deal. Render-verified headlessly: 30 home cards, GE Vernova and OpenAI dossiers show BLUF summaries and Key Judgments with zero page errors
- `live-site-pages/profiler-data/profiler-companies.json` — 10 new registry entries with IC-voice taglines; roster now 30 companies
- `README.md` — tree entries for the 10 new profile JSONs

## [v02.21r] — 2026-08-09 06:09:32 PM EST — [e7719ab](https://github.com/LightAISolutions/Sales/commit/e7719ab4823e1762bf8e5df44059ad60c447e16f)

> **Prompt:** "continue with your recommendation"

### Added
- **Nine post-earnings refresh Routines armed** for the new public tickers, following the existing one-shot convention (fresh session, verify-then-refresh, self-re-arming): NVIDIA (fires 2026-08-27 — Q2 FY2027 company-confirmed for 08-26), Jinko (2026-08-28 — JKS Q2 est. 08-27 / A-share H1 deadline 08-31), Samsung SDI (2026-10-28 15:00 UTC — Q3 listed 10-27; staggered after Wärtsilä), Google (2026-10-28 17:00 UTC — Q3 confirmed 10-27), Microsoft (2026-10-28 19:00 UTC — FY2027 Q1 est. 10-27), Meta (2026-10-29 — Q3 est. 10-28), Amazon (2026-10-30 — Q3 est. 10-29), LG Energy Solution (2026-10-30 15:00 UTC — Q3 est. ~10-29; staggered after Amazon), Panasonic (2026-10-31 — FY2027 Q2 est. ~10-30). All report dates verified via web search on 2026-08-09; estimates are marked as such in each trigger prompt and the fired sessions confirm before refreshing

### Changed
- **Rosendin folded into the private-company quarterly sweep** — the recurring Routine (Jan/Apr/Jul/Oct 1) renamed "Profiler quarterly check — Hithium, FlexGen & Rosendin (private)" with Rosendin watch items added (data-center project awards, BESSUPS rollout with FlexGen, EPC storage wins, ESOP/leadership changes)
- `.claude/rules/profiler-app.md` — "Currently armed" registry updated with the 9 new one-shot entries (chronological) and the expanded 3-company sweep line

## [v02.20r] — 2026-08-09 05:59:18 PM EST — [6e514e4](https://github.com/LightAISolutions/Sales/commit/6e514e42e35249b4271915717c1f66de27af30a2)

> **Prompt:** "Profiler LG Energy Solutions, Panasonic, Samsung SDI, Jinko, NVIDIA, Meta, Google, Amazon, Microsoft, Rosendin using Fable 5."

### Added
- **Ten new Intel Briefing dossiers** (all profileVersion 1, in `live-site-pages/profiler-data/`): LG Energy Solution (`lg-energy-solution.profile.json`), Panasonic (`panasonic.profile.json`), Samsung SDI (`samsung-sdi.profile.json`), Jinko (`jinko.profile.json`), NVIDIA (`nvidia.profile.json`), Meta (`meta.profile.json`), Google (`google.profile.json`), Amazon (`amazon.profile.json`), Microsoft (`microsoft.profile.json`), Rosendin (`rosendin.profile.json`). Researched via 20 parallel subagents — two per company (first-party IR/press/product + third-party filings/consensus/trade press per the Source Priority Protocol), ~50–70 sources evaluated per company, all accessed 2026-08-09. Categories: supplier ×5 (LGES, Panasonic, Samsung SDI, Jinko, NVIDIA), hyperscaler ×4 (Meta, Google, Amazon, Microsoft), integrator ×1 (Rosendin). Unconfirmed/press-only items are flagged (Low confidence) throughout — e.g. Samsung SDI–Tesla/Amazon ESS deal reports, Meta TPU purchase reports, the NVIDIA–OpenAI $250B backstop report. Render-verified headlessly: 20 home cards, NVIDIA and Google dossiers show BLUF summaries and Key Judgments with zero page errors
- `live-site-pages/profiler-data/profiler-companies.json` — 10 new registry entries with IC-voice taglines; roster now 20 companies
- `README.md` — tree entries for the 10 new profile JSONs

## [v02.19r] — 2026-08-09 05:09:33 AM EST — [3b7949d](https://github.com/LightAISolutions/Sales/commit/3b7949db9a12b54e84f565e65afb75f6543c3782)

> **Prompt:** "Voice approved. However, remove "Company Name - Profiler" from the top right and the URL from the bottom left of the export documents."

### Fixed
- `live-site-pages/Profiler.html` (v01.17w) — the "Company — Profiler" title (top right) and page URL (bottom left) on PDF exports were the **browser's own print header/footer**, drawn in the page margins during `window.print()`. Suppressed via `@page { margin: 0; }` in the print pipeline (no margin box → nothing for the browser to draw, per Chrome's documented behavior); `#ov-prev-doc` print padding changed from `0` to `12mm 14mm` so the document carries its own page margins. Verified via headless print-CSS PDF (9-page Megmeet export): page 1 clean with proper margins, no header/footer artifacts. Known tradeoff: continuation pages start near the paper edge (element padding doesn't repeat per page) — disclosed to the developer with a riskier `@page :first` alternative offered

## [v02.18r] — 2026-08-09 04:46:49 AM EST — [f628906](https://github.com/LightAISolutions/Sales/commit/f6289063f361aa33ed3c206813e1c02ea2235011)

> **Prompt:** "Rewrite all dossiers, their home-page descriptions, and export styles in Style 4: Intel Briefing - IC Assessment."

### Changed
- **All 10 dossiers rewritten in the Intel Briefing style** (`live-site-pages/profiler-data/*.profile.json`) — facts unchanged, voice converted: every `summary` now opens with a BOTTOM LINE UP FRONT sentence followed by a BACKGROUND section; analytic `ecosystemRole` claims reframed as "We assess … Basis: …"; Megmeet's `strategyRead` converted to confidence-tagged judgments; and the nine dossiers that had no `strategyRead` each gained a new 4-bullet **Key Judgments** array — "(High/Moderate/Low confidence) We assess …" — synthesized strictly from each dossier's existing sourced facts (no new research). Colloquial development takeaways IC-ified (e.g. Megmeet's "self-deflation of the AI hype", CATL's "pencil out"). All `profileVersion` +1 (megmeet → 2, rest → 3), `lastUpdated` 2026-08-09
- `live-site-pages/profiler-data/profiler-companies.json` — all 10 home-page roster taglines rewritten in IC-terse voice with attribution/watch-item framing
- **Export styles**: no code change needed — exports already render through the intel-briefing skin shipped in v02.17r (v01.16w), so the rewritten prose flows into the app, Word, and PDF automatically
- Archived all 10 outgoing versions per the Archival Procedure (`archive/megmeet.profile.v1.json`, `archive/<slug>.profile.v2.json` ×9; `archive-index.json` updated)
- Render-verified headlessly: BYD dossier shows Background/Key Judgments/Technical Annex sections, BLUF lead, and 4 numbered confidence-tagged judgments with zero console errors

## [v02.17r] — 2026-08-09 04:30:58 AM EST — [0312e54](https://github.com/LightAISolutions/Sales/commit/0312e545ac0f61be92bcf499fdfa7e9af46e23ec)

> **Prompt:** "Set profiler style to #4: intel-briefing. Also make sure that the export document (doc/pdf) has a formatting style and spacing that matches the writing style. Create a style button that is only visible to Admins that allows the user to change the Profiler app + export styles between these five styles."

### Added
- `live-site-pages/Profiler.html` (v01.16w) — dossier display-style engine: per-style section-label maps (`OV_SEC_LABELS`), app-side typography skins (`ov-sty-*` on `#ov-app`), export-document skins on `#ov-prev-doc` (preview + PDF print), and style-matched inline Word CSS in `ovWordExport` — Bloomberg (Arial, blue numbered headings, "Figure N:" captions on spec/financial tables), Equity Research (thesis banner with not-investment-advice note), Intel Briefing (Courier typewriter document, numbered KEY JUDGMENTS `<ol>`, COMPILED FROM OPEN SOURCES banner), Smart Brevity (bold sans axiom headers). Admin-only **🖋 style button** (z-index 8900, gated on `ov_note_role === 'admin'` like Versions 🕘, shown on wall pass) opens a picker overlay; choice persists per-device in localStorage `ov_style`; `OV_DEFAULT_STYLE = 'intel-briefing'` mirrors the registry's Active style. Verified headlessly: five app/export screenshots + admin/non-admin gating, zero console errors

### Changed
- `repository-information/PROFILER-STYLES.md` — **Active style: `intel-briefing`** (was `default`); new "Display layer" bullet documenting the `OV_DEFAULT_STYLE` sync rule and the admin 🖋 switcher
- `.claude/rules/profiler-app.md` — switching procedure now includes the `OV_DEFAULT_STYLE` sync; display-layer architecture documented
- `README.md` — Profiler tree entry version display → v01.16w

## [v02.16r] — 2026-08-09 04:00:40 AM EST — [1ef3f5b](https://github.com/LightAISolutions/Sales/commit/1ef3f5b0e25706e52495b7877d6c0e548836466e)

> **Prompt:** "I tested both my admin jonyang92@gmail.com account and a test contributor jymiasole01@gmail.com account and Profiler works as intended. Only jonyang92@gmail.com could see the version history while jymiasole01@gmail.com could not. Regarding the dossier writing style, save it down as the default style and then let me see several mock-ups of what the dossier writing style would be after analyzing and integrating the attached Bloomberg report's writing style and formatting. Save that down as the Bloomberg style. If you have alternative reporting styles besides Bloomberg to show me, give me mock-up suggestions of those as well."

### Added
- `repository-information/PROFILER-STYLES.md` — dossier writing-style registry (single source of truth for how dossier prose is written; **Active style: `default`**). Codifies the current authoring conventions as the **Default style**; defines the **Bloomberg style** from a formatting/style analysis of the developer-supplied BloombergNEF "US Data Center Outlook — The Age of AI" report (exec-summary lead + Summary findings bullets, mandatory inline comparators, taxonomy/run-in-italic bullets, Figure captions with Source/Note lines, unhedged declarative voice, one dry aside per section); and adds three alternatives — `equity-research` (sell-side note: thesis banner, "we" voice, bull/bear key debates, dated catalysts), `intel-briefing` (IC assessment: BLUF, confidence-tagged key judgments mapped to the field-note 0–100 bands, indicators to watch), and `smart-brevity` (Axios form: one-line lede + fixed axioms). Every style carries a like-for-like Megmeet mock-up (summary → AI-DC positioning → FY2025 results development → strategy read)

### Changed
- `.claude/rules/profiler-app.md` — new "Dossier Writing Styles" section registering the styles file (read-before-authoring rule, switching procedure, styles-never-override-schema-rules); Profiler Command step 4 now requires prose in the active style
- `CLAUDE.md` — Profiler Command section now points at the writing-style registry alongside the data schema
- `README.md` — `PROFILER-STYLES.md` added to the repository tree

## [v02.15r] — 2026-08-09 03:29:35 AM EST — [62c6809](https://github.com/LightAISolutions/Sales/commit/62c6809b0e96a40687dd56ed3af435f593786715)

> **Prompt:** "I'd rather have a sign-in wall on the whole app like the Receipts app in order to control who gets to view my valuable dossiers. Also, I want Admins to be the only ones that are able to view previous dossier versions (everyone else should only see the current version). Since I want my friends to be able to export documents and type field notes to me, shouldn't I give them "contributor" roles instead of just "viewer" roles?"

### Added
- `live-site-pages/Profiler.html` (v01.15w) — full-app sign-in wall (`#ov-authwall`, z-index 9000, app-branded): the UI is blocked until a session validates (`whoami` on load for stored sessions; GIS popup sign-in otherwise), reusing the note backend's session machinery — same account system as Receipts (its extra HIPAA/single-tab hardening intentionally not ported). Wall skips only when `_e` is empty (pre-deployment fallback). Non-ACL sign-ins are rejected by the exchange with a "ask Jon to add you" hint
- **Versions 🕘 is now admin-only** — the previous-versions button renders only for admin sessions; the notes ⚙ cog dropped to z-index 8900 so it sits under the wall while signed out

### Changed
- `.claude/rules/profiler-app.md` — auth wall, admin-only versions, and the `contributor` role decision documented (role already existed in `RBAC_ROLES_FALLBACK` with no `admin` permission — no backend change needed; friends' ACL rows use Role = `contributor`)
- **Data-privacy caveat re-disclosed**: the wall gates the app experience; the underlying data files (profiles, notes, archives) remain on public GitHub Pages and are fetchable by direct URL. True data privacy = GAS-served data or GitHub Enterprise Pages access control — both offered as follow-ups, neither built

## [v02.14r] — 2026-08-09 03:03:41 AM EST — [7e089a7](https://github.com/LightAISolutions/Sales/commit/7e089a7ade424c8dbbfaac897e164901d7426307)

> **Prompt:** "I plan to share this Profiler app with my work friends later on, so copy Scraper and Receipt's Google sign-in and account structure. In the MasterACL spreadsheet, I want Profiler's sign-in application to be named "Profiler", so change the "In-dossier field-note intake for the Profiler app" name to "Profiler Field Notes". Also, I want other users besides me to only be able to view the dossiers and use the export and study guide features, as well as a limited-version field note feature. Limited version means that they can submit typed notes, attach documents, and add a confidence level, but it gets sent to "jonyang92@gmail.com" via email for consideration instead of being automatically saved into the Profiler app and bess-aidc-library database. Recommend the best way to accomplish the separation of power between me and other users above."

### Added
- `googleAppsScripts/Profiler/Profiler.gs` (v01.05g) — separation of power, enforced server-side: `submit`/`list`/`edit`/`delete` now require the `admin` permission (Master ACL role `admin`/`developer`); all other ACL-approved signed-in users get the new `suggest` op — same inputs (typed note, up to 3×8 MB Word/PDF attachments, source type, 0–100 confidence) but the suggestion is emailed to `NOTE_SUGGEST_EMAIL` (jonyang92@gmail.com) via MailApp with files as real attachments, and nothing is committed. New `whoami` op returns the session's role for UI branching. `PORTAL_DESCRIPTION` → "Profiler Field Notes" (Master ACL registration name; `ACL_PAGE_NAME` stays "Profiler" — the sheet column) + config sync
- `live-site-pages/Profiler.html` (v01.14w) — role-aware note box: sign-in stores the role from the exchange (`admin` vs `member`); admins get the full form + Manage panel, members get the suggest form ("goes to Jon for review"); a `whoami` check covers sessions that predate role tracking, and an `ADMIN_ONLY` server response live-downgrades a stale admin UI to suggest mode. All three branches verified headlessly with a stubbed backend (member suggest send, admin regression, stale-admin downgrade)
- `.claude/rules/profiler-app.md` — separation-of-power rules documented (server-side boundary, suggested-confidence-is-advisory, acceptance flow)

### Changed
- Sign-in/account structure note: Profiler already shares Scraper/Receipts' exact auth machinery (same GIS client, token exchange, session system, Master ACL spreadsheet) — this change wires the missing role layer through it; dossier viewing, export, and study guides remain public page features requiring no sign-in

## [v02.13r] — 2026-08-09 02:41:47 AM EST — [62cf0f1](https://github.com/LightAISolutions/Sales/commit/62cf0f1a513ab1f73cbe31d0766e138f10f293be)

> **Prompt:** *(same interaction — live API verification after the v02.12r deploy)* Curl probes against the deployed note API returned `{"success":true,...}` for a bogus session token, exposing that the standard preset's `ENABLE_DATA_OP_VALIDATION: false` made the fetch-exposed note ops effectively unauthenticated.

### Security
- `googleAppsScripts/Profiler/Profiler.gs` (v01.04g) — `PROJECT_OVERRIDES.ENABLE_DATA_OP_VALIDATION: true`: every note op now runs full session validation (the preset's `false` assumed `google.script.run` transport, only reachable from the signed-in served page — an assumption the public fetch route broke). Plus a defense-in-depth guard in `handleNoteOp_` rejecting missing/short tokens before dispatch, so a future toggle regression cannot silently reopen the ops. Live-verified post-deploy: bogus sessions now receive `SESSION_EXPIRED`

### Fixed
- Confirmed the POST transport is sound for browsers (302 → GET on the echo URL returns clean JSON) — the apparent POST failures during verification were a curl `-L -X POST` artifact, not a client bug

*(Counter reads 101/100 legitimately: all 6 over-limit sections are dated today (EST) and today's sections are rotation-exempt; 95 non-exempt sections remain under the cap.)*

## [v02.12r] — 2026-08-09 02:37:16 AM EST — [f9ef3e0](https://github.com/LightAISolutions/Sales/commit/f9ef3e0f578a759bca123d4889c574ee74803a54)

> **Prompt:** "The embedded box and fallback link both fail and shows the same Google Drive "sorry" message as above"

### Fixed
- `live-site-pages/Profiler.html` (v01.13w) — the note box no longer loads the GAS app as a document at all. The top-level fallback failing too proved this isn't a framing problem: on the developer's phone, ANY cookie-carrying document-load of `/exec` (framed or top-level) dies in Google's multi-account routing, while anonymous requests serve fine — the exact conclusion the fleet already reached (Receipts' `TOKEN_EXCHANGE_METHOD: 'fetch'` comment: iframe transports "stop working when Google blocks framed /exec responses"). Rebuilt the note box as **native page UI**: GIS sign-in popup on the parent (fleet CLIENT_ID, `openid email profile`), token exchanged for a session via the existing fetch exchange route, then all note ops over cookie-less `fetch()` — typed notes, Word/PDF upload (POST body, 3 × 8 MB), and the full manage panel (list/inline edit/delete), all in place. CSP extended to the fleet's GIS + script.google.com allowances. Full flow verified headlessly with a stubbed backend (sign-in state, save, list, edit, delete — zero page errors)
- `googleAppsScripts/Profiler/Profiler.gs` (v01.03g) — new `handleNoteOp_` fetch dispatcher: `doPost(action=note)` + GET api-route mirror (`action=api&op=note`), ops `bootstrap`/`submit`/`list`/`edit`/`delete` (param `nop`), session-validated via the existing machinery, JSON via ContentService (anonymous serving path)
- `repository-information/diagrams/profiler-diagram.md` — updated to the fetch architecture (pako URL regenerated + decompression-verified)

## [v02.11r] — 2026-08-09 02:20:26 AM EST — [cdb8c74](https://github.com/LightAISolutions/Sales/commit/cdb8c74052b1acfed8e94f06a0ebb78965e9a29e)

> **Prompt:** "I wanted to add a field note, but this is what I saw. Resolve it." *(screenshot: the note-box iframe showing Google Drive's "Sorry, unable to open the file at this time" error)*

### Fixed
- `live-site-pages/Profiler.html` (v01.12w) — the note-box iframe now loads **credentialless** (cookie-less), matching the current template pattern used by Receipts: cookie-carrying framed `/exec` requests hit Google's multi-account `/u/N` routing and fail with the Drive error the developer screenshotted; the anonymous path avoids it (sessions travel in the URL, not cookies). Root cause: the inline note-box iframe was written against the older template block still present in Profiler.html, which predates the credentialless fix

### Added
- `live-site-pages/Profiler.html` — "Open the note form in its own tab ↗" link under the note box: a top-level `/exec` visit never hits the framed-routing failure, so this fallback always works (also useful as a deliberate full-screen mode)

## [v02.10r] — 2026-08-09 01:59:52 AM EST — [5b0d3bf](https://github.com/LightAISolutions/Sales/commit/5b0d3bfa767754e7039647f08106b55b9ef03035)

> **Prompt:** "I plan to test with a fake field note, so build me a way to see, edit, and delete previously submitted field notes. Then, I'll test adding and deleting field notes. Also, explain to me how you will evaluate which field notes are relevant enough to display in the dossier vs which just get saved but not displayed."

### Added
- `googleAppsScripts/Profiler/Profiler.gs` (v01.02g) — note management: server functions `listFieldNotes` / `updateFieldNote` / `deleteFieldNote` (session-validated, lock-serialized; edits stamp `edited: YYYY-MM-DD`; deletes remove the log entry and best-effort delete the attached note file via a new `ghGetSha_` + contents DELETE; shared `ghPutNotes_` helper) and a "Manage existing notes" panel in the served form UI (list with metadata, inline edit textarea + confidence select, delete with confirm; wrapped in try/catch so a fault can never block the auth flow). Client logic verified via a stubbed-backend Playwright harness (list → edit → delete round-trip, zero page errors)
- `repository-information/PROFILER-SCHEMA.md` — `notes[].edited` field; `submittedVia` now documents the `profiler-intake` value; clarified that the never-alter constraint binds Claude's triage, not developer edits
- `.claude/rules/profiler-app.md` — note-management capability documented under the second capture channel

## [v02.09r] — 2026-08-09 01:30:51 AM EST — [829f7e0](https://github.com/LightAISolutions/Sales/commit/829f7e0cb8fe2a7f17daa660f2a7e9894cf35a4d)

> **Prompt:** "Profiler deployment ID: <AKfycbwnpv-PYXK_7Wvp5ZAtnhZawcTWgc-8Df_1qKKoLsg9gGawIukAzU7H14aw9DOrVSJ3Tw>"

### Changed
- `googleAppsScripts/Profiler/Profiler.config.json` + `Profiler.gs` (v01.01g) — real `DEPLOYMENT_ID` synced in ([PC-GAS-CONFIG] #14); the "Deploy Profiler" workflow step now fires on `.gs` merges
- `live-site-pages/Profiler.html` (v01.11w) — `var _e` set to the obfuscated deployment URL (reverse + base64, round-trip verified) — the in-dossier note box now renders the GAS intake form; GitHub-form fallback retired from the live path
- `repository-information/ENTERPRISE-SETUP.md` — recorded the new `profiler-intake-writer` fine-grained PAT (Sales-scoped, Contents R/W + Actions R/W, no expiration, stored as the Profiler GAS project's `GITHUB_TOKEN` Script Property)

## [v02.08r] — 2026-08-09 01:11:29 AM EST — [3c30acd](https://github.com/LightAISolutions/Sales/commit/3c30acd618ed609af1274204e2bce0290e5581c1)

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

## [v02.07r] — 2026-08-08 10:36:20 PM EST — [58d0d4e](https://github.com/LightAISolutions/Sales/commit/58d0d4eebd8a5c1c375bca27fc11636924928b87)

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

## [v02.06r] — 2026-08-08 10:19:41 PM EST — [5893c6e](https://github.com/LightAISolutions/Sales/commit/5893c6e8514bf9654200efb122ecee94a3e2bab6)

> **Prompt:** "start phase R3"

### Added
- **Phase R3 — Business monthly line-items ledger** (`live-site-pages/Receipts.html` v01.33w, client-side only — no GAS change): each `<Company>/<Year>/<Month>` folder gains a `Line Items - <Month> <Year>.csv` maintained via the user's `drive.file` credential. New PROJECT-block module: `_csvEscape`/`_dateFromReceiptId` (ID's `YYYYMMDD` suffix locates rows across edits)/`_bizCsvName`/`_buildLedgerRows` (no-items receipts get a single `(no itemized lines)` row), `_updateBizLedger` (read-modify-write: drop rows by trailing `,ReceiptID` match, append, PATCH-media update or multipart create), `syncBusinessLedger` (removes from old-ID/new-ID/printed-date months, appends to the printed-date month — handles date edits moving a receipt across months), `removeFromBusinessLedger`
- Save hook runs PDF → ledger **sequentially** (they share the folder tree; racing find-or-create could duplicate folders) with a combined status; delete hook drops ledger rows; a Business→Personal flip now trashes the PDF, clears its registered link, and removes ledger rows

### Verified
- `node --check` on inline scripts; the page's exact CSV functions run in Node on real data — quote/comma escaping, row removal by receipt ID, month filenames, date-from-ID incl. collision suffixes, no-items fallback; Playwright smoke load with zero page errors

## [v02.05r] — 2026-08-08 10:18:39 PM EST — [dcf6414](https://github.com/LightAISolutions/Sales/commit/dcf64142e90323afa95653954f6067909ed2b100)

> **Prompt:** *(follow-up within the same interaction — end-to-end intake test)* The first live test of the field-note pipeline (issue #1) committed the note to `main` correctly, but the deploy never ran: pushes made with the built-in `GITHUB_TOKEN` do not trigger `push`-event workflows (GitHub recursion prevention), so the note was invisible on the live site.

### Fixed
- `.github/workflows/field-note-intake.yml` — after committing a note, the workflow now explicitly dispatches `auto-merge-claude.yml` on `main` (`gh workflow run`); `workflow_dispatch` events are exempt from GITHUB_TOKEN recursion prevention, so the deploy + library mirror run and the note appears in the Profiler ⚙ changelog. Added the required `actions: write` permission and corrected the header comment that wrongly claimed the push alone would trigger the deploy

## [v02.04r] — 2026-08-08 10:11:17 PM EST — [baf1388](https://github.com/LightAISolutions/Sales/commit/baf1388004f57a040e536afbd684b813dbef5b81)

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

## [v02.03r] — 2026-08-08 09:56:18 PM EST — [9bce979](https://github.com/LightAISolutions/Sales/commit/9bce97994df40a824a47f21329a626374d04a114)

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

## [v02.02r] — 2026-08-08 09:40:27 PM EST — [c98e251](https://github.com/LightAISolutions/Sales/commit/c98e251a027da245ea0378d19b3f5624e1be3a42)

> **Prompt:** "secret added. Confirm there are no mistakes."

### Changed

- `ENTERPRISE-SETUP.md` Library Mirror Token table — Expiration row updated to record the actual choice: **No expiration** (enterprise admin exemption, matching the GAS token); secret noted as added 2026-08-08
- No rotation move this push: 101 total sections but only 94 are non-exempt (today's are exempt per rotation logic — Scenario F pattern); counter reads over-capacity until older date groups age out

### Fixed

- Resolved the parallel-session rotation collision: this session and the concurrent Receipts session (v02.01r) both rotated `v01.01r` to the archive identically — kept the upstream full-SHA header, no content lost

## [v02.01r] — 2026-08-08 09:31:15 PM EST — [9f2955b](https://github.com/LightAISolutions/Sales/commit/9f2955b0662ae458616bd36e2a11a5c9590472cd)

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

## [v02.00r] — 2026-08-08 09:09:06 PM EST — [72bce7d](https://github.com/LightAISolutions/Sales/commit/72bce7d3d9a88e36c96bd8d7f8261f90217da14a)

> **Prompt:** "Regarding the centralization discussion, go with the workflow mirror, walk me through how to create the PAT, and use your proposed library layout."

### Added

- **`mirror-library` workflow job** (`.github/workflows/auto-merge-claude.yml`) — after every auto-merge (and on direct `main` pushes, so intake-app note commits mirror too), syncs knowledge files into `LightAISolutions/bess-aidc-library` using the approved layout: `dossiers/` (profiles + registry), `archive/`, `notes/`, `study/` (+`study-prep/` lesson plans), `digests/` (activates when the Scraper export ships), `reports/` and `receipts/` (session-written, never mirrored). Generates the library README once; commits only when content changed; skips with a notice until the `LIBRARY_SYNC_TOKEN` secret exists
- **"Library Mirror Token" section** in `repository-information/ENTERPRISE-SETUP.md` — fine-grained PAT spec (Contents read/write on `bess-aidc-library` only) + 7-step creation walkthrough

### Changed

- Profiler **Archival Procedure step 3** (`.claude/rules/profiler-app.md`) — off-repo mirroring is now automatic via the workflow; sessions no longer attach the library repo
- REPO-ARCHITECTURE.md CI/CD flowchart — added the mirror node (fed by merge and direct-main-push paths); mermaid.live URL regenerated and decompression-verified

## [v01.99r] — 2026-08-08 08:11:03 PM EST — [bd4fc5c](https://github.com/LightAISolutions/Sales/commit/bd4fc5c555c35176e268efe121f29997e9bd9033)

> **Prompt:** "I logged into lightaisolution and opened the MasterACL spreadsheet. All users were TRUE, but I unchecked and rechecked to TRUE. However, jonyang92@gmail.com still cannot login."

### Added
- `diagnoseAclAccess()` owner-run diagnostic in `googleAppsScripts/Receipts/Receipts.gs` (v01.19g, PROJECT block): sign-in shows `not_authorized` although the Access tab shows TRUE and the entire auth path (`exchangeTokenForSession`, `checkSpreadsheetAccess`, `getRolesFromSpreadsheet`, epoch cache) is byte-identical to the last-known-good version — so the mismatch is between what the owner edits and what the code reads. The diagnostic runs the real lookup and logs: the ACL spreadsheet's name + URL as opened by `MASTER_ACL_SPREADSHEET_ID` (catches editing a different file), tab presence, header row with duplicate `Receipts`-column detection (code uses the first match), matching col-A rows with charCode dumps (catches invisible characters / near-miss addresses), the raw page-column cell value + type, the cached verdict, then `clearAllAccessCache()` + a fresh `checkSpreadsheetAccess()` verdict

### Verified
- `node --check` on the full `.gs`; auth functions diffed byte-for-byte between dee4da1 (last confirmed working sign-in) and origin/main before concluding no code regression exists

## [v01.98r] — 2026-08-08 12:14:10 AM EST — [e1a7f1a](https://github.com/LightAISolutions/Sales/commit/e1a7f1a7771bd3d6e1e970faafd7d2b38534a23a)

> **Prompt:** "add the date check rule"

### Added

- New Think Before Asserting extension in `.claude/rules/behavioral-rules.md`: day-of-week + date pairs must be verified with `date -d YYYY-MM-DD +%A` before being asserted — including day names supplied by the user; on conflict, the date is authoritative and the discrepancy is surfaced. Prevents the day-name drift that put "Thursday 8/14" (actually Friday) into a trigger prompt and prep documents

## [v01.97r] — 2026-08-08 12:12:16 AM EST — [5db593e](https://github.com/LightAISolutions/Sales/commit/5db593e0038fddc309c1d13f31cb1e0adecf4561)

> **Prompt:** "The meeting is actually Friday, 8/14, and I am busy on Thursday, 8/13, so schedule this for Wednesday, 8/12."

### Fixed

- Meeting day-name corrected to **Friday 2026-08-14** in the refresher trigger prompt (`trig_01DBojuiEhM4ps3VEsZEvySv` — fire time was already Wednesday 2026-08-12 22:00 UTC and is unchanged) and in the `megmeet-lesson-plan.md` pacing line (now also notes Thursday 8/13 is blocked out). Root cause: the prior session inferred day names from conversational text instead of verifying with `date -d` — 8/12 was always Wednesday and 8/14 is Friday

## [v01.96r] — 2026-08-08 12:07:00 AM EST — [1973941](https://github.com/LightAISolutions/Sales/commit/1973941dd4e329a7e6fa8f1de9ec6a3cb9aec1eb)

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

## [v01.95r] — 2026-08-07 11:19:48 PM EST — [50b831f](https://github.com/LightAISolutions/Sales/commit/50b831ff74e83091c21d5a6017e9b79d8272de2d)

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

## [v01.94r] — 2026-08-07 11:02:33 PM EST — [320f105](https://github.com/LightAISolutions/Sales/commit/320f105f4b65e551d2c48521fe3dd201d7f64f8a)

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

## [v01.93r] — 2026-08-07 09:58:47 PM EST — [81b2d95](https://github.com/LightAISolutions/Sales/commit/81b2d958066f633d540bd0bed319c0bb10d2b06b)

> **Prompt:** "I reinstalled the Profiler app and it still opens a browser instead of looking like a standalone app"

### Fixed

- Profiler wouldn't install as a standalone PWA because the installed Receipts app claimed scope `./` (the whole site) — Chrome refuses to offer install for a page inside an installed PWA's scope (documented in w3c/manifest #1180/#1209). Narrowed both manifests to per-app scopes (`profiler.webmanifest` → `./Profiler.html`, `receipts.webmanifest` → `./Receipts.html`) and added distinct `id` fields to pin each app's identity. No page version bumps — no HTML files changed; manifests are fetched fresh at install time

## [v01.92r] — 2026-08-07 09:49:43 PM EST — [a4ed463](https://github.com/LightAISolutions/Sales/commit/a4ed4637ffd893b3da92fcbb9238cf70d4372f08)

> **Prompt:** "continue with your recommendation."

*(Executes the prior response's recommendation — make Profiler installable as a PWA like Receipts.)*

### Added

- `live-site-pages/profiler.webmanifest` — PWA manifest (`display: standalone`, ink theme `#13151c`, start URL `./Profiler.html`)
- `live-site-pages/images/profiler-icon-192.png` + `profiler-icon-512.png` — home-screen icons rendered from `profiler-logo.svg` via headless Chromium; the 512 is `any maskable` with the emblem composited at 80% on a full-bleed ink field so circular/squircle masks never clip the gold border

### Changed

- `Profiler.html` (v01.05w) — added `<link rel="manifest">`, `theme-color`, `apple-touch-icon`, and the three Apple PWA meta tags; CSP `manifest-src` overridden `'none'` → `'self'` with a `PROJECT OVERRIDE` comment mirroring the Receipts pattern. Verified in headless Chromium: manifest fetches through the CSP, both icons serve 200, no new console errors

## [v01.91r] — 2026-08-07 03:26:14 AM EST — [4df98e4](https://github.com/LightAISolutions/Sales/commit/4df98e4a21d3f92ddad4e8f3d7de912bde1576b3)

> **Prompt:** "In my Profiler app, verify the Sinexcel refresh. Also, choose a suitable logo for this app and replace the placeholder."

### Added

- `live-site-pages/images/profiler-logo.svg` — Profiler app logo: a dossier-card emblem in the app's own palette (ink `#1d212d`, paper `#e9e4d6`, gold `#d8b45a`) with a photo-frame profile silhouette, index lines, and a gold verification seal

### Changed

- `Profiler.html` (v01.04w) — `SPLASH_LOGO_URL` now points at `images/profiler-logo.svg`, so the Website Ready / Code Ready splashes and the maintenance screen show the app's own logo. `DEVELOPER_LOGO_URL` / `YOUR_ORG_LOGO_URL` intentionally left on the placeholder — they carry developer/org branding semantics, not app branding, and are not consumed by the page. (Same interaction also verified the Sinexcel scheduled refresh — trigger armed and preconditions consistent; no changes were needed for that part)

## [v01.90r] — 2026-08-07 02:00:31 AM EST — [f1bb972](https://github.com/LightAISolutions/Sales/commit/f1bb9726a4c0a29d7bd7cb7d660e767c735f86f3)

> **Prompt:** "continue with your recommendation"

*(Executes the v01.89r recommendation — extend the scheduled-refresh convention to every remaining covered company.)*

### Added

- Armed one-shot scheduled refresh triggers for the remaining public companies, each firing a fresh session the day after its report and following the full Profiler Command (verify-published gate → dual-agent research → archive-first → refresh → self-re-arm with tooling fallback): BYD 2026-08-30 15:00 UTC (staggered 2h after Sungrow — both report 2026-08-29), Tesla 2026-10-22 (estimate-based; fired session confirms the real date), Wärtsilä 2026-10-28 (announced 2026-10-27), CATL 2026-11-01 (2026-10-31 disclosure deadline), Fluence 2026-11-25 14:00 UTC (estimate-based, FY ends Sep 30)
- Quarterly private-company sweep Routine for Hithium & FlexGen (cron: Jan/Apr/Jul/Oct 1, ~13:00 UTC; next fire 2026-10-01) — checks for material developments, refreshes dossiers archive-first only when warranted, makes no commits otherwise

### Changed

- Upgraded the pre-existing Sinexcel trigger (fires 2026-08-12) to the improved prompt template — verify-published gate and self-re-arm now carry the trigger-tooling fallback (REMINDERS.md note if `create_trigger` is unavailable in the fired session)
- `.claude/rules/profiler-app.md` Scheduled Refreshes section now lists the full armed roster (7 companies + the private-company quarterly sweep) with tickers, fire times, and date-confidence notes

## [v01.89r] — 2026-08-07 12:34:58 AM EST — [f1d7d29](https://github.com/LightAISolutions/Sales/commit/f1d7d298b24d0fac17e0006d6ea10faec52ffe4f)

> **Prompt:** "Continue from where you left off."

*(Continuation after a tool-approval interruption — completes the in-flight Overview → Profiler rename, dossier archival system, and scheduled Sungrow refresh.)*

### Changed

- Renamed the Overview app to **Profiler** across the repo: `Overview.html` → `Profiler.html` (v01.03w), `overview-data/` → `profiler-data/`, `<slug>.overview.json` → `<slug>.profile.json`, `overview-companies.json` → `profiler-companies.json`, `OVERVIEW-SCHEMA.md` → `PROFILER-SCHEMA.md`, `Overviewhtml.*` version/changelog files → `Profilerhtml.*`, `.claude/rules/overview-app.md` → `profiler-app.md` — plus all content references (page title/header/exports, CLAUDE.md Profiler Command section + Reference Files row, README tree, REPO-ARCHITECTURE.md flowchart node with regenerated mermaid.live URL, changelog headers)
- Profiler Command trigger phrase is now "profiler \<Company\>" (was "overview \<Company\>")

### Added

- Dossier archival system: `live-site-pages/profiler-data/archive/` with `archive-index.json` — every profile revision now archives the superseded version as `<slug>.profile.v<N>.json` before overwriting, with best-effort mirroring to the `bess-aidc-library` repo (Archival Procedure in `.claude/rules/profiler-app.md`)
- Scheduled refresh convention + first armed trigger: one-shot Routine "Profiler refresh — Sungrow (post-H1 2026)" fires 2026-08-30 13:00 UTC (day after Sungrow's scheduled 2026-08-29 H1 report), runs the full Profiler Command in a fresh session, and re-arms itself for the next reporting period (Scheduled Refreshes section in `profiler-app.md`)

## [v01.88r] — 2026-08-07 12:02:06 AM EST — [7cd6566](https://github.com/LightAISolutions/Sales/commit/7cd656696bc2df9a57ac14017f4fa3897202d90b)

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

## [v01.87r] — 2026-08-06 11:27:45 PM EST — [6bf1fbe](https://github.com/LightAISolutions/Sales/commit/6bf1fbeca4d51cfe62b9bb28b71d97fc8a03e3e9)

> **Prompt:** "These overviews are kind of useful, but don't provide me enough insight into their products/services and don't include recent news highlights that can give me insight into their sales/product strategy. Can you think of and recommend ways to improve the quality of the overviews? 
>
> I also noticed that each company overview only has around 12-16 sources. Why not evaluate more sources to get more information? What is the maximum number of sources I can look up before either it starts costing tokens or starts taking more than 30-minutes to generate a single corporate overview?
>
> Also, note that I want source priority to be: target company's Investor Relations and Press Release pages > trade news sites. Always make sure to fully scrape all relevant information from the target companies themselves first."

*(Quality-upgrade approval question went unanswered — upgrades remain proposed; only the source-priority directive is implemented in this version.)*

### Added

- `.claude/rules/overview-app.md` — **Source Priority Protocol** (developer directive) added to the Overview Command's research step: Stage 1 exhaustively scrapes the target company's own channels first (Investor Relations, complete press-release archive ≥24 months, product/datasheet pages, leadership pages); Stage 2 uses third-party sources only to fill gaps and supply what the company cannot credibly self-report (consensus/expectations, independent rankings, critical context); `sources[]` citation order puts first-party pages first; research prompts must state the protocol explicitly
- `repository-information/OVERVIEW-SCHEMA.md` — matching **Source priority** authoring rule (first-party ground truth scraped fully first; trade press second; first-party listed first in `sources[]`)

## [v01.86r] — 2026-08-06 10:51:29 PM EST — [11dfcac](https://github.com/LightAISolutions/Sales/commit/11dfcaceab8d3ccf61e699bfe8933ccd200e40ad)

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

## [v01.85r] — 2026-08-06 10:09:14 PM EST — [70247bc](https://github.com/LightAISolutions/Sales/commit/70247bc1b54ab3d8365d4912d6d6413cc6095f59)

> **Prompt:** "overview Hithium"

### Added

- `live-site-pages/overview-data/hithium.overview.json` — Hithium dossier (profileVersion 1) via the Overview Command: identity (private; A-share attempt withdrawn 2023, both HKEX applications lapsed — the second in April 2026), six product/service lines (∞Cell LFP cells 280Ah→1300Ah, ∞Block/∞Power containers to 6.9 MWh, sodium-ion N162Ah, C&I, HeroEE residential, Texas/Spain localized manufacturing), four flagship spec tables (∞Cell 1175Ah, ∞Cell 1300Ah, ∞Power 6.25 MWh, ∞Power 6.9 MWh 8h), nine decision makers (four ex-CATL executive directors incl. founder Wu Zuyu; no verified LinkedIn profiles or usable official headshots — initials avatars render), FY2023/FY2024/H1-2025 prospectus financials with shipment rankings (global No. 5 → No. 3 → Top 2) and risk context (CATL litigation >RMB 240M claimed, equity freeze, subsidy-dependent FY2024 profit), 18 cited sources with access dates
- Registered Hithium in `overview-companies.json` (supplier, Xiamen; registry `lastUpdated` in sync) and added the profile to the README tree

### Changed

- `README.md` — `overview-data/` tree listing gains `hithium.overview.json`

## [v01.84r] — 2026-08-06 09:50:12 PM EST — [bb32dad](https://github.com/LightAISolutions/Sales/commit/bb32dad591c6101e0d701b4e1ab3f32fd5f099fb)

> **Prompt:** "Create an export button that allows the user to export the overview file in either Word or PDF formats, with a Preview screen before exporting to give the user a chance to catch mistakes."

### Added

- `Overview.html` (v01.01w) — "Export dossier ⬇" button in the dossier header → full-screen export preview overlay (`#ov-prev-overlay`) with a sticky toolbar and a light "paper" rendering of the complete dossier (`ovBuildDoc()`: letterhead, snapshot facts table, products, spec tables, decision makers, financials-vs-expectations tables, sources, generated-timestamp footer) so mistakes can be caught before exporting
- Word export (`ovWordExport()`): serializes the preview document into a standalone Word-compatible HTML payload (UTF-8 BOM + Office XML namespaces + embedded print-friendly CSS) and downloads it as `<slug>-overview-<date>.doc` — opens directly in Microsoft Word with editable text and tables
- PDF export: `window.print()` against a dedicated `@media print` block that isolates the preview document (everything else hidden, toolbar stripped, page-break rules on section headings and tables) — "Save as PDF" in the print dialog yields a clean, text-searchable PDF with zero vendored libraries (CSP stays closed to external hosts)
- Preview UX: Esc key and backdrop click both close the overlay; toolbar is sticky while the document scrolls. Playwright-verified end to end (preview renders all six document sections, `window.print` invocation stubbed and confirmed, real `.doc` download captured and byte-checked for the BOM+HTML header, Esc close, zero console errors)

## [v01.83r] — 2026-08-06 09:38:07 PM EST — [b3ba5bd](https://github.com/LightAISolutions/Sales/commit/b3ba5bdd0a8e70d8cecf821a17442325aa4a497d)

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

## [v01.82r] — 2026-08-05 10:26:18 PM EST — [`9dd7e84`](https://github.com/LightAISolutions/Sales/commit/9dd7e84328734b15ba6dcafee75d03b69282764b)

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

## [v01.81r] — 2026-08-05 10:12:22 PM EST — [`6d50768`](https://github.com/LightAISolutions/Sales/commit/6d5076860640cd366e397fb93f78bc392924c5aa)

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

## [v01.80r] — 2026-08-05 05:26:52 AM EST — [`5b3e2d4`](https://github.com/LightAISolutions/Sales/commit/5b3e2d4b89397195195f0308296808f474493bea)

> **Prompt:** "I am rating articles in Articles and it constantly fails and shows the error message: "Could not save feedback (http_404)". What's wrong and fix it."

### Fixed

#### `Scraper.gs` — v01.29g

##### Added
- `setArticleVerdicts` batch action (registered): applies up to `SCRAPER_VERDICT_BATCH_MAX`(40) absolute verdict values in one request + one Articles-tab scan; skips malformed verdicts and foreign-owner/project rows; returns `{saved, failed}` id lists; one audit row per batch. Exists because Google's /exec front-end intermittently 404s individual requests (redeploy serving flap — the root cause of the user's 36 consecutive `http_404` failures); one batched call minimizes exposure. Unit-tested 9/9 (multi-apply incl. clear, col-12 writes, foreign-row skip + failed reporting, malformed skip, bad payload)

#### `Scraper.html` — v01.32w

##### Fixed
- Verdict saving reworked from per-tap request (2 attempts then "gave up") to an offline-tolerant queue: `scVerdictClick` applies optimistic UI + enqueues into localStorage (`scraperVerdictQueue`, latest-tap-wins per article); `scFlushVerdicts_` batches everything pending into one `setArticleVerdicts` call with exponential backoff retries forever (5s→60s cap), flushes on page load (queue survives reloads), drops server-confirmed and not-found ids, warns once while unreachable and confirms when saved. Replaces `scSendVerdict` (the retry-twice transport this queue supersedes). Rating buttons never lock, so rapid-fire rating is instant. Playwright-tested: optimistic UI + queue growth under a full 404 storm, single-batch flush of both ratings on recovery, reload-with-pending auto-flush

## [v01.79r] — 2026-08-05 03:35:45 AM EST — [`29d5bc7`](https://github.com/LightAISolutions/Sales/commit/29d5bc7a83dd76580d7d889e380c733c4abb8369)

> **Prompt:** "I want a floating notification window that saves previous notifications with their respective timestamps. I want to be able to start a Backfill step, walk away from my computer, come back and know for sure whether or not Backfill finishes. This applies for all functions."

### Added

#### `Scraper.html` — v01.31w

##### Added
- Notification history subsystem: `scNotify_` appends every toast (`scToast` hook — results and errors for ALL actions) plus a "▶ \<label\> — started" entry (hooked into `scProgShow`'s bar-creation branch) to a localStorage log (`scraperNotifLog`, capped at 100, newest first) so history survives deploy auto-reloads. A started entry with no matching finish identifies an interrupted run
- 🔔 header button with unread badge (count of entries newer than `scraperNotifSeen`; opening the panel marks all read) and a floating `#sc-notif-panel` (fixed top-right, z 9000 — below the auth wall and version pill) listing timestamped entries via `toLocaleString`, errors in red, with Clear/close controls; live-updates while open
- `showAuthWall()` hides the panel (PROJECT OVERRIDE addition to the deactivate-authenticated-UI block). Playwright-tested: badge count after a Compile run (start + finish entries), newest-first ordering with timestamps, badge reset on open, persistence across a full page reload, Clear

## [v01.78r] — 2026-08-05 03:13:25 AM EST — [`d4550ef`](https://github.com/LightAISolutions/Sales/commit/d4550efe2de4ca034ac49a7bf8a45dd078ee40d1)

> **Prompt:** "I completed Ootion A and added the scSchedulerTick hourly trigger, but the red banner still exists - What's wrong and fix it. Also, now that I have archived junk (left with 300+ articles) and added new keywords to the plan and rebuilt it, what are my next steps, why, and the cost."

### Fixed

#### `Scraper.gs` — v01.28g

##### Fixed
- `getSchedulerHealth` false negative on manually added triggers: verification relied solely on `ScriptApp.getProjectTriggers()`, which throws without the `script.scriptapp` scope — so a real, working hand-added trigger was still reported "not installed". Now `scSchedulerTick` writes a `SCHEDULER_LAST_TICK` heartbeat property at the top of every run (before the lock, so even lock-busy ticks heartbeat), and `getSchedulerHealth` trusts a <2h heartbeat first (no permission needed), falls back to ScriptApp, and returns `unverified: true` when neither works. Unit-tested 13/13 (heartbeat-beats-permission, stale heartbeat, scriptapp fallback, lock-busy heartbeat)

#### `Scraper.html` — v01.30w

##### Fixed
- Scheduler banner gains a third state: `unverified` renders an amber "can't verify yet — clears automatically after the first hourly run" notice instead of the red "NOT running" alarm, which was wrong (and alarming) right after a manual trigger add. Playwright-tested (amber text/background, no red text, banner clears on heartbeat-verified health)

## [v01.77r] — 2026-08-05 02:57:13 AM EST — [`cd475f1`](https://github.com/LightAISolutions/Sales/commit/cd475f10dccf7a518651823ebc9c1ecf9b6c9afb)

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

## [v01.76r] — 2026-08-05 02:34:08 AM EST — [`83fe573`](https://github.com/LightAISolutions/Sales/commit/83fe5733bd839dc89d36f5ea84f584823c9da865)

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

## [v01.75r] — 2026-08-04 08:27:47 PM EST — [`acb6788`](https://github.com/LightAISolutions/Sales/commit/acb6788)

> **Prompt:** "There's not much noticeable change. Sometimes it's fast and sometimes it never loads. Also, I pressed Rebuild and looked away. When I looked back, I was back in the Plan page and was not sure if the Rebuild went through. Check and tell me; Then make sure all buttons give a result and recommended next step."

### Added

#### `Scraper.html` — v01.27w

##### Added
- Plan panel provenance line in `scShowPlan_`: "N query groups · saved <plannedAt>" (`toLocaleString` on the QueryPlans ISO timestamp; `'just now'` after in-session build/rebuild) — makes a Rebuild verifiable even when the confirmation is lost to a deploy-triggered auto-reload
- Recommended-next-step text appended to every completion toast (Compile→Analyze, Backfill→Enrich→Analyze, Deep backfill→Analyze, Enrich→Analyze, Analyze→rate/Stats, Archive junk→Backfill, Plan build/Rebuild→Compile or Backfill); `scToast` gained a duration param (completion toasts 9s, errors default 8s)
- Data-driven `Recommended next:` line in the Stats footer (`scRenderStats_`): archivable junk → Archive junk; unscored → Analyze; preview coverage <80% → Enrich; ratable pool → rate verdicts; else grow via Backfill

##### Fixed
- 90s AbortController watchdog (`_fetchT`) on both POST and GET paths in `_gasPost` — a hung fetch previously never settled, leaving the pressed button disabled forever with no error ("sometimes it never loads"); now it rejects with `no reply after 90s`, every handler's existing `.catch` surfaces it, and the button recovers. Verified via Playwright (provenance line, rebuild next-step status, stats recommendation) + static wiring assertions

## [v01.74r] — 2026-08-04 08:11:10 PM EST — [`bcac8c4`](https://github.com/LightAISolutions/Sales/commit/bcac8c4)

> **Prompt:** "It takes a long time for each of my button (Plan, Backfill, etc) presses to register. Can you speed that up?"

### Changed

#### `Scraper.gs` — v01.25g

##### Changed
- API-first `doGet` routing (PROJECT OVERRIDE): the GET api/deploy routes are now matched before the page-boot work — previously every GET-fallback API call paid `ensureScriptProperties_` + `registerSelfProject()` (opens the Master ACL spreadsheet, ~1–2s) + `scEnsureSchedulerTrigger_` before the action even ran. Boot work still runs for page-shell and listener-page loads
- `ensureScraperTabs_` guarded by an execution-global + 6h `CacheService` flag (key embeds the tab count, so adding a tab to `SCRAPER_TAB_HEADERS` auto-invalidates); the ~10 per-press `getSheetByName` probes now run at most once per cache window, failing open if CacheService is unavailable. Unit-tested 15/15 (cold run, same-execution skip, warm-cache zero probes, cache-outage fail-open, stale-count invalidation, plus static doGet ordering assertions incl. deploy-fallback placement per Deploy Handler Protection)

#### `Scraper.html` — v01.26w

##### Changed
- Sticky transport in `_gasPost`: after a POST transport failure where the GET fallback succeeds, `_scGasGetOnly` locks the session to the GET api route — eliminating the wasted failed-POST round trip on every subsequent call in environments where Google's serving drops POST bodies. The flag is only set after a successful GET (a total outage can't disable POST permanently). Playwright-tested: first call = 1 failed POST + 1 GET, second call = GET only

## [v01.73r] — 2026-08-04 06:41:08 PM EST — [`d28a97f`](https://github.com/LightAISolutions/Sales/commit/d28a97f)

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

## [v01.72r] — 2026-08-04 06:01:06 PM EST — [`9eee790`](https://github.com/LightAISolutions/Sales/commit/9eee790)

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

## [v01.71r] — 2026-08-04 04:53:53 PM EST — [`308513a`](https://github.com/LightAISolutions/Sales/commit/308513a)

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

## [v01.70r] — 2026-08-04 04:01:42 PM EST — [`2f604a6`](https://github.com/LightAISolutions/Sales/commit/2f604a6)

> **Prompt:** "build the distribution panel"

### Added

#### `Scraper.gs` — v01.21g

##### Added
- `getScoreStats` action: one Articles-sheet scan returning rubric-aligned band counts (0-9 / 10-29 / 30-49 / 50-79 / 80-100), scored/unscored/total, over-20 count, snippet coverage, 👍/👎 totals, and the unrated ratable pool (score ≥ `SCRAPER_CALIB_MIN_SCORE`, no verdict)

#### `Scraper.html` — v01.22w

##### Added
- Stats button per project card → `#sc-stats-overlay` panel: big %-over-20 headline, five color-coded proportional band bars (colors matching the score-chip palette, hover titles naming the rubric band), and a corpus-health footer (scored of total with unscored hint, preview coverage %, rating counts, ratable pool). Harness-verified against stubbed stats: headline 36% (720/2000), bars proportional to band counts, close button and click-outside dismiss, screenshot visually checked

## [v01.69r] — 2026-08-04 06:02:52 AM EST — [`53ced63`](https://github.com/LightAISolutions/Sales/commit/53ced63)

> **Prompt:** "fix the enrich stall"

### Fixed

#### `Scraper.gs` — v01.20g

##### Fixed
- Poison-URL stall in `scEnrichChunk_`: `UrlFetchApp` has no timeout, so a hanging site carried the execution into Google's uncatchable 6-minute kill; state was only saved at batch end, so the client's retry chain (POST → GET fallback → `scRetryOnce`, each leg hanging ~6 min) re-ran the same batch and re-hit the same URL forever. State is now persisted BEFORE every fetch with an `attempting` row marker; a leftover marker on the next run means the previous execution died mid-fetch on that row — it's counted unavailable, skipped, and the run continues. Per-fetch persistence also stops killed executions from losing the batch's other progress. Node-verified 8/8 by running the extracted shipped function against stubbed platform services: seeded mid-fetch kill state → poison row never re-fetched, counted failed, remaining rows enriched, run completes; fresh run persists the marker before all fetches and clears it in the final state

## [v01.68r] — 2026-08-04 03:33:53 AM EST — [`9543a7b`](https://github.com/LightAISolutions/Sales/commit/9543a7b)

> **Prompt:** "build the enrich step"

### Added

#### `Scraper.gs` — v01.19g

##### Added
- `enrichNow` action + session-free `scEnrichChunk_` core: chunked/resumable abstract harvest for snippet-less articles (15 page fetches per call, 40s budget, row-cursor resume — safe because the Articles sheet is append-only); fetches with a browser-like User-Agent, writes to the Snippet column, counts failures without marking them so a later run retries; UsageLog fetch counting; returns processed/total/enriched/failed for the progress bar
- Pure `scExtractAbstract_`: og:description → twitter:description → meta description with either attribute order, single/double quotes, entity decode, whitespace collapse, 300-char cap — node-verified 10/10 against extracted source (fallback chain, precedence, entities, no-match, cap)

#### `Scraper.html` — v01.21w

##### Added
- Enrich button per project card + `scRunEnrich` chunk loop wired to the progress panel ("X/Y articles · N previews found · M unavailable"), completion/nothing-to-do toasts, resume-on-retry failure path — harness-verified through a 3-chunk stubbed run

## [v01.67r] — 2026-08-04 03:28:10 AM EST — [`b7c7de6`](https://github.com/LightAISolutions/Sales/commit/b7c7de6)

> **Prompt:** "apply the three fixes. Recommend me some work-arounds to tackle the "title only" issue; Is there any way to get an abstract summary of the article instead of just judging by the title?"

### Fixed

#### `Scraper.gs` — v01.18g

##### Fixed
- Scoring rubric (fix 1): `scScoreBatch_` prompt now anchors five bands — 80-100 on-topic / 50-79 relevant subtopic / 30-49 adjacent context (corporate moves, financing, policy, supply chain, partnerships of relevant players, explicitly named) / 10-29 weak / 0-9 unrelated — plus "use the full range; do not default to the extremes". Replaces the two-anchor instruction that produced the bimodal near-zero distribution on the 2000-article re-score
- Title-only fairness (fix 2): same prompt now states a missing body is NOT evidence of irrelevance — headline-only articles (all GDELT backfill rows store an empty snippet) are scored on what the headline plausibly covers
- Feedback rebalance (fix 3): `scFeedbackPrompt_` caps 👎 exemplars at 👍-count + 2 and reframes them as "obvious junk the user filtered out… do NOT treat as a relevance ceiling" instead of "score articles like these LOW"; `scDistillFeedback_` prompt now instructs the distiller to state preferences positively first, with rejections at most a short final sentence. Node-verified against extracted source (6/6): all-downs history shows only 2 junk-framed exemplars with the ceiling warning, balanced history shows all ups + capped downs, empty history emits nothing

## [v01.66r] — 2026-08-04 02:39:32 AM EST — [`8bc535f`](https://github.com/LightAISolutions/Sales/commit/8bc535f)

> **Prompt:** "After I tap + to add a suggested keyword to project keywords, give me an option to undo that +. Also, give me a clearer, more informative progress bar for every action button I can click (ie: Backfill, Analyze, Re-score collection)."

### Added

#### `Scraper.html` — v01.20w

##### Added
- Suggestion undo: added chips render a × (`.sc-sugg-undo`); `scCalAddSuggestion_` generalized into `scCalToggleSuggestion_` with `op: add|remove` through the same optimistic 900ms-debounced batch pipeline; payload builder applies ops in order and skips the request entirely on a net-zero batch (add undone before flush); failure rollback restores each chip's pre-tap state including its +/× button. Harness-verified: add → 1 `updateProject` (keyword present), undo → 2nd call (keyword gone, + restored), quick +× → no request
- Action progress bars: fixed bottom-left `#sc-prog-stack` (z-index 60 — visible above the articles/calibration overlay, nudged above the version pill), one `.sc-progress` panel per project with label, fill bar (percent when total known, sliding indeterminate stripe when not), stats line, and a 1s-tick elapsed clock; `scProgDone` turns it green and fades after 2.5s, `scProgFail_` freezes the reason for 5s. Wired into Compile (feeds/new/failed), Backfill (slices/found/failed), Analyze (scored/left + 🧠 note), and Re-score (clearing phase → scoring phase). Harness-verified fill progression `indet → 33% → 67% → 100%` via MutationObserver plus screenshot

## [v01.65r] — 2026-08-04 01:46:24 AM EST — [`b048b61`](https://github.com/LightAISolutions/Sales/commit/b048b61)

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

## [v01.64r] — 2026-08-04 01:33:25 AM EST — [`a596f46`](https://github.com/LightAISolutions/Sales/commit/a596f46)

> **Prompt:** "apply both changes"

### Changed

#### `Scraper.gs` — v01.16g

##### Changed
- Calibration excludes scores below `SCRAPER_CALIB_MIN_SCORE` (10) entirely — confirming articles the scorer already dismissed teaches it almost nothing
- Band mixer extracted into pure `scCalibMix_` and the silent low-band fallback removed: empty mid/high slots borrow only from each other, empty low slots borrow from mid/high, and the queue ends when the informative bands (30–70 / 70+) run dry — the low band (now 10–29) never substitutes for them. Node-verified against extracted source: all-low corpus → empty queue, 6/2/2 ratio on a mixed 10-pick, hi-substitution without lo-flooding, mid-stream termination, band order preserved

#### `Scraper.html` — v01.18w

##### Changed
- Calibration empty-state messages rewritten for the new behavior ("Nothing informative left to calibrate…" / "All caught up — nothing informative left to rate") with a pointer to Compile + Analyze; harness-verified render

## [v01.63r] — 2026-08-04 01:17:17 AM EST — [`5d9b8b5`](https://github.com/LightAISolutions/Sales/commit/5d9b8b5)

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

## [v01.62r] — 2026-08-04 01:08:07 AM EST — [`ff07339`](https://github.com/LightAISolutions/Sales/commit/ff07339)

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

## [v01.61r] — 2026-08-03 11:57:41 PM EST — [1f497f8](https://github.com/LightAISolutions/Sales/commit/1f497f8b8a954079dbb757bb192e0037d1e3695f)

> **Prompt:** "For a few article ratings, it took a long time before it captured and saved me ratings. When I am rating articles (thumbs up/down), create a status window to the right that shows the steps that it is going through, so that it is easier to debug in the future."

### Added

#### `Scraper.html` — v01.15w

##### Added
- Rating status panel `#sc-vlog`: fixed dark monospace log docked right of the articles card (z-index 51, responsive at ≤1240px/≤760px breakpoints). Each 👍/👎 tap opens a numbered `scVlogSession` with its own clock; every step logs with `+Xms` elapsed — tap registered, per-attempt send/reply (with per-request round-trip ms), transport-retry wait, `unknown_op` mid-update wait, saved ✓ / NOT saved, buttons unlocked. Sessions from concurrent taps interleave safely (per-session numbering + per-session t0); log capped at 60 lines; × hides it (reappears on next rating); hidden when the articles overlay closes
- `scSendVerdict` restructured with sequential per-attempt instrumentation (inlining the former `scRetryOnce` wrapping so each attempt is individually visible); behavior unchanged — one transport retry + one `unknown_op` retry, 2.5s waits
- Harness-verified: healthy tap (attempt 1 → saved), flapping server (unknown_op → wait → attempt 2 → saved), close button, and screenshot visual check

## [v01.60r] — 2026-08-03 11:33:05 PM EST — [3ef1ffb](https://github.com/LightAISolutions/Sales/commit/3ef1ffbe02df26d21cef67586e5de9331465a5c4)

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

## [v01.59r] — 2026-08-03 11:21:17 PM EST — [b3941f4](https://github.com/LightAISolutions/Sales/commit/b3941f4755f44da0f0664ba6f47cd2445a3b7ef6)

> **Prompt:** "I opened Articles and started to rate them, but only the 1st article's thumbs-up rating went through. When I tried to thumbs-up the 2nd and 3rd articles, it would get grayed-out for a few seconds before resetting to default. Did I actually do anything by rating the 2nd and 3rd articles? Also, fix this issue."

### Fixed

#### `Scraper.html` — v01.13w

##### Fixed
- Verdict saves now go through `scSendVerdict`: retries once on transport failure (matching `scRetryOnce`) and once more with a 2.5s delay when the server answers `unknown_op` — the signature of Google's `/exec` serving briefly flapping to a stale deployment version after a GAS redeploy, which made taps land on code that didn't know `setArticleVerdict` yet. Server writes are absolute values, so retries are idempotent. Root cause confirmed by a full-fidelity Playwright harness (real page + handlers, stubbed GAS routes): the client path was correct in isolation; flap, healthy, and persistent-failure scenarios all verified post-fix
- New `unknown_op` entry in `SC_ERROR_MESSAGES` ("The server is finishing an update — wait a few seconds and try again") replaces the generic fallback toast for all actions during deploy flaps

## [v01.58r] — 2026-08-03 10:06:55 PM EST — [2ec7564](https://github.com/LightAISolutions/Sales/commit/2ec7564081c7665ecb67cdc6287f952f6f7ed4bf)

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

## [v01.57r] — 2026-08-03 08:17:43 PM EST — [be1fdaa](https://github.com/LightAISolutions/Sales/commit/be1fdaa1c8ef9dc02f91a8a2f6ed899a0af33064)

> **Prompt:** "16 minutes later, the backfill progress looks like this. Therefore, I don't think there's a need to "fix" the backfill. However, I do want you to show failures in the progress UI."

### Changed

#### `Scraper.html` — v01.11w

##### Changed
- Backfill progress button now appends the silent-error count from `backfillNow` responses (`, N failed`) when nonzero — failed GDELT slices (e.g. rate-limit rejections, which GDELT returns as HTTP-200 plain text) were previously invisible until the completion toast

## [v01.56r] — 2026-08-03 06:43:09 AM EST — [4e80170](https://github.com/LightAISolutions/Sales/commit/4e801704c3ed1c8000c38dc52c2f4fc06989d18b)

> **Prompt:** "Key added as "Scraper-GAS" with an expiry date of "never". Continue the build."

### Added

#### `Scraper.gs` — v01.11g

##### Added
- GDELT DOC 2.0 historical backfill engine: new `backfillNow`/`getBackfillStatus` actions slice the past 24 months per month × per query and pull date-ranged English article lists (≤250 per slice) into the Articles tab — deduped against existing URLs, batch-appended via `setValues` (not per-row `appendRow`), time-budgeted (40s / 6 fetches per call), with compact resumable state in Script Properties (slices are derived from `startedAt` + stored queries rather than stored, keeping state well under the 9KB property limit)

#### `Scraper.html` — v01.10w

##### Added
- Backfill button on each project card runs the chunked backfill loop with live progress ("Backfilling… n/total (X found)") and a completion toast; transport failures auto-retry once and an interrupted run resumes where it left off

## [v01.55r] — 2026-08-03 06:20:57 AM EST — [748bcab](https://github.com/LightAISolutions/Sales/commit/748bcabc2d66a31a1f06016937ff333bfe29f9bf)

> **Prompt:** "Repo created per your instructions and I made sure Claude Github App has access to the bess-aidc-library repo. Also, I have created an Anthropic Console account under jonyang92@gmail.com and funded it with $200."

### Added

#### `Scraper.gs` — v01.10g

##### Added
- Claude (Anthropic) AI provider wired into the swappable `aiComplete_()` layer: new `scClaudeComplete_()` calls the Messages API with Sonnet 5 (`claude-sonnet-5` default, `ANTHROPIC_MODEL` Script Property overrides) using an `ANTHROPIC_API_KEY` Script Property, mapping responses/errors to the same `ai_*` taxonomy as Gemini (`ai_key_missing`, `ai_rate_limited`, `ai_http_<code>` with trimmed API message, `ai_bad_json`, `ai_empty_response`)
- `AI_PROVIDER` Script Property now switches providers (`claude` | `gemini`) without a code change; Gemini remains the default and free-tier fallback

##### External
- Companion library repo `LightAISolutions/bess-aidc-library` seeded and pushed: 76-file skeleton inherited from this repo's template conventions (CLAUDE.md, rules, hooks, skills, trimmed auto-merge workflow), plus `library/news/<segment>/<year>/` archive structure, `library/specsheets/` placeholder, and the 55-company `WATCHLIST.md`

## [v01.54r] — 2026-08-03 02:51:07 AM EST — [9682a32](https://github.com/LightAISolutions/Sales/commit/9682a326285bf894a37fa69d105c38b71610fa34)

> **Prompt:** "Another error message. Resolve it."

### Fixed

#### `Scraper.gs` — v01.09g

##### Fixed
- Transport-level `http_404` on Analyze: live probes confirmed the deployment healthy (fast requests return 200 in 4–9s), isolating the failure to long-running exec requests dying at Google's HTTP front-end. `analyzeArticles` now makes exactly 1 AI call per invocation (was up to 3 + 2s sleeps), keeping each request compile-chunk-sized; the client loop provides continuation and free-tier RPM spacing. Removed the now-unused `SCRAPER_AI_CALL_SPACING_MS` intra-request sleep

#### `Scraper.html` — v01.09w

##### Fixed
- Compile and Analyze loops now automatically retry a failed chunk once (2.5s pause) before surfacing a transport error — safe because server-side state is chunked/resumable

## [v01.53r] — 2026-08-03 02:38:35 AM EST — [5609e93](https://github.com/LightAISolutions/Sales/commit/5609e936061e29c1d8af48a92d97d3b9092d6b6b)

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

## [v01.52r] — 2026-08-03 02:15:55 AM EST — [3f99df9](https://github.com/LightAISolutions/Sales/commit/3f99df95559316fed98a81d8c231543141be7dd4)

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

## [v01.51r] — 2026-08-03 01:23:34 AM EST — [1c38ef1](https://github.com/LightAISolutions/Sales/commit/1c38ef13ebbce16787c36d57b096debdf02bf907)

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

## [v01.50r] — 2026-08-02 09:42:54 PM EST — [b71d24e](https://github.com/LightAISolutions/Sales/commit/b71d24e87e61efca66ed241d5be799f73c567271)

> **Prompt:** "Stick with Gmail sign-in as planned and kick off Phase 1 (data model + project intake wizard)."

### Added

#### `Scraper.gs` — v01.05g

##### Added
- News Scraper Phase 1 data model: `ensureScraperTabs_()` creates 6 spreadsheet tabs (Projects, Schedules, Articles, Reports, Profiles, UsageLog) with frozen header rows, idempotently
- Session-gated project management routes `createProject`, `listProjects`, `getProject`, `updateProject`, `setProjectStatus` (active/paused/archived), all owner-scoped by email via `validateSessionForData` and reached through the iframe-free fetch transport (doPost actions + doGet `api` mirror via shared `handleProjectAction_` dispatcher)
- Payload normalization/validation (`scNormalizeProjectPayload_`) with bounded strings/lists, frequency whitelist (daily/weekly/monthly/quarterly/biannual/annual/custom), delivery whitelist (inapp/email/both), URL-validated custom sources, and a 10-active-projects-per-user cap
- Per-project schedule rows (one per frequency) written to the Schedules tab; audit entries via `dataAuditLog`

#### `Scraper.html` — v01.05w

##### Added
- News Scraper app layer (`#scraper-app`): project dashboard with cards (status/frequency/delivery chips), Refresh, Edit, Pause/Resume, and two-step inline Archive confirm; activated from `showApp()` via `window._scraperInit` (inline `// PROJECT:` hook)
- 5-step project intake wizard (basics → scope → sources → schedule → review) with per-step validation, custom-frequency reveal, review summary, and create/update submission through `_gasPost`
- `scraper-app` registered in `_htmlLayerEls` (PROJECT OVERRIDE) so the HTML layer toggle hides/shows the dashboard

### Fixed
- README `Repo version:` display corrected (was showing v01.48r while the repo version file was at v01.49r)

## [v01.49r] — 2026-08-02 08:37:29 PM EST — [0327874](https://github.com/LightAISolutions/Sales/commit/032787455cbe00851bd2d4ae6948d9dbf7c27be6)

> **Prompt:** "Delete everything related to this "spain-argentina" page. It was just a test."

### Removed
- Deleted the spain-argentina test page and all its tracking files: `live-site-pages/spain-argentina.html`, `html-versions/spain-argentinahtml.version.txt`, `html-changelogs/spain-argentinahtml.changelog.md`, `html-changelogs/spain-argentinahtml.changelog-archive.md` (all added in v01.15r)
- Removed its README tree entries (Standalone Utilities page entry + html-versions and html-changelogs subtree lines) and its REPO-ARCHITECTURE.md flowchart node `SPAINARG_PAGE` with its serves / version-polling / template-copy edges (flowchart pako URL regenerated and decompression-verified)
- Historical mentions in CHANGELOG.md (v01.15r section) and SESSION-CONTEXT.md are records of past sessions and were intentionally left intact

## [v01.48r] — 2026-08-02 08:31:18 PM EST — [ca4dd1c](https://github.com/LightAISolutions/Sales/commit/ca4dd1c754302ca5a8f07416763262f16c92ffc9)

> **Prompt:** "Also translate the review screen's category and subcategory dropdowns."

### Changed

- `Receipts.html` (v01.28w) — the review screen's category select (`fillCategories`) and per-item subcategory selects (`fillSubcatSelect`, incl. the blank "Subcategory —"/"子类别 —" option and preserved off-list values) now label via `tCat()`; `applyAppLanguage`'s value-keyed option pass extended to `#rr-category` and `.rr-cat` so a language toggle relabels an open review card too. Stored values remain English

## [v01.47r] — 2026-08-02 08:10:52 PM EST — [caa2275](https://github.com/LightAISolutions/Sales/commit/caa2275224c718b7afae411dae486ea81010674f)

> **Prompt:** "I want the Simplified Chinese translation option to translate everything, including:
>
> * "0 receipts * August 2026" and "No receipts saved yet this month" at the top of the dashboard.
> * All categories (Groceries, Dining, etc) in both History and Reports.
> * All subcategories for all categories in Reports.
> * In Daily Reports, change Mon-Sun to their Simplified Chinese equivalents while keeping the ", MM/DD/YY" latter half.
> * In Monthly Reports, change the months to their Simplified Chinese equivalents.
> * In Bi-annual Reports, change the "first/second half of 2026" into their Simplified Chinese equivalents."

### Added

- `Receipts.html` (v01.27w) — `I18N_CAT_ZH` (~90 entries) + `tCat()` for category/subcategory display names: History and Reports dropdown labels relabel via `option.value` (stored English values untouched — lossless both directions), report By-category / By-subcategory rows, the Line Items section title and note, and the month card's top-category rows all display 中文 in Chinese mode
- `Receipts.html` (v01.27w) — localized period labels in `bucketLabel()`: daily `周三, 7/29/26` (RP_DAYS_ZH; date half unchanged), monthly `2026年7月`, bi-annual `2026年上半年/下半年`; weekly and annual stay numeric
- `Receipts.html` (v01.27w) — month card fully localized: `N 张收据 · 2026年8月` (`zh-CN` locale month name), `本月还没有保存的收据` empty state, `其他项目` for the "Everything else" row; the language toggle now also calls `refreshMonthCard()` so the card flips immediately

## [v01.46r] — 2026-08-02 05:44:59 AM EST — [ca13e7b](https://github.com/LightAISolutions/Sales/commit/ca13e7b49352d550e4fb2f8975ba5bb075275944)

> **Prompt:** "In the Settings cog menu, include an option to change the app language from English to Simplified Chinese."

### Added

- `Receipts.html` (v01.26w) — app language toggle (English / 简体中文) in the Settings ⚙️ panel (`#rsp-lang`, persisted as `Receipts_lang` in localStorage). Chrome-level i18n layer: `I18N_ZH` dictionary + `t()` for dynamic strings; `applyAppLanguage()` swaps static elements via a config list (`L10N_ELS`) plus dataset-keyed walkers for field labels, checkbox tails, stamp labels, period tabs, and select options (original English remembered in `data-i18n-en` so toggling is lossless). Translated surfaces: landing buttons + stamp labels + month card + date locale, History card, Reports card (period tabs, chips, section titles, Line Items controls, hints, empty states), Sharing card, review-card labels/buttons, Settings panel, affirmations (13 zh equivalents), and a map of common status messages (`I18N_STATUS_ZH`). Receipt data (merchants, item descriptions, category values) intentionally stays as stored — categories are server-matched data values
- `t()`/`setStatus` guarded with `typeof` checks — `fillReportCategories` runs at script-eval time before the dictionary vars are assigned, and an unguarded lookup killed the whole script when Chinese was active at page load (caught by the bilingual Playwright pass)

## [v01.45r] — 2026-08-02 05:10:46 AM EST — [06ae13a](https://github.com/LightAISolutions/Sales/commit/06ae13aed12e666eff4712c69ca8fc58524c52f5)

> **Prompt:** "In the Reports section -> Line Items (Subcategory) with "Group by item" checked, if an item has been purchased more than once, show the total amount across all purchases instead of individual prices. We can see the individual prices once we click the line item anyways."

### Changed

- `Receipts.html` (v01.25w) — grouped Line Items rows now show the group's summed spend (`gTot`) as the row amount instead of the latest purchase price; the ×count and low–high range stats are unchanged and per-purchase prices remain in the tap-to-expand history

## [v01.44r] — 2026-08-02 05:05:19 AM EST — [40aec01](https://github.com/LightAISolutions/Sales/commit/40aec01f7c4f8d6d6315627d5e09ed570cd49c78)

> **Prompt:** "The combined viewing works as intended. However, I realized that I cannot view a receipt photo that she uploaded without getting access to her Google Drive Receipt App folder. Make it so that when a user shares view and edit permissions with another user, it automatically gives the other user permission to view the original user's folder."

### Added

- `Receipts.html` (v01.24w) — Drive folder sharing rides along with app grants: `driveShareFolder()` (POST a `reader` permission on the owner's "Receipts App" folder via the owner's `drive.file` token, `sendNotificationEmail=false`) fires on successful `addShare`; `driveUnshareFolder()` (permissions.list → DELETE the grantee's permission, raw fetch since DELETE returns an empty 204) fires on successful `removeShare`
- `Receipts.html` (v01.24w) — reconciliation in `loadShares()`: when the granted set differs from the `Receipts_folder_perms_synced` localStorage key, every granted email gets `driveShareFolder()` and the key advances only when all succeed — this retrofits folder access for grants made before this feature and self-heals failed Drive calls on the next app open. Must run client-side: the `drive.file` token can only manage permissions on folders the app created for that signed-in user; the server has no access to user Drives

## [v01.43r] — 2026-08-02 04:46:01 AM EST — [cf725a4](https://github.com/LightAISolutions/Sales/commit/cf725a488e697defb840a2c59d5a06c8533625ba)

> **Prompt:** "Approved, but also allow mutual delete."

### Added

#### `Receipts.gs` — v01.16g

##### Added
- `resolveOwnerSet_()` — combined-view owner resolution: `forOwner '*'` returns the session user plus every owner who granted them access as an ownerEmail → scope map; any other value defers to `resolveOwnerScope_` (single-entry map). Combining never widens access — every entry is backed by an existing Shares-tab grant
- `listReceipts` / `reportReceipts` now filter rows against the resolved owner set and tag each returned row with `owner` (and `canEdit` in listReceipts); `exportReceipts` accepts `'*'` and the Receipts sheet gains an Owner column (backfill loop indexes shifted accordingly)

##### Changed
- `deleteReceipt` ownership gate extended for mutual delete: the owner can always delete; any other user needs an edit-scope grant from the row's owner (`getShareScope_ === 'edit'`); everything else still responds `receipt_not_found` (no existence leak)

#### `Receipts.html` — v01.23w

##### Added
- "Combined (mine + shared)" option (`value '*'`) in the History and Reports "Viewing" pickers when received grants exist; `rhRowOwner()` normalizes each row's owner for detail/edit/photo routing (own rows → `''`); owner chip (`.rh-owner-tag`, name part of the email) on History rows in combined view
- Delete visibility in combined view follows per-row `canEdit` (edit-grant rows deletable, view-only rows not); single shared views keep delete hidden as before; the client-side own-Drive photo trash now keys off `rhRowOwner` so only the row's owner attempts it

## [v01.42r] — 2026-08-02 04:34:42 AM EST — [944d392](https://github.com/LightAISolutions/Sales/commit/944d392480661436ab3767fca7defd8967ce9896)

> **Prompt:** "Approved - Implement your plan. 
>
> Also, I want it to be possible for me and another user to combine our receipts and look at everything together. The real scenario is: my girlfriend and I live together, so everything we buy is shared. Thus, I want all the receipts both of us scan to be visible and editable by both Gmail accounts. Recommend a plan of action to implement this for me to approve." *(Line Items drill-down implemented this version; the combined-receipts plan was presented for approval, not yet implemented)*

### Added

- `Receipts.html` (v01.22w) — "🧾 Line items" collapsible group in Reports, rendered when a category is chosen (title carries the subcategory when one is picked). Flat mode lists each matching line item `date · merchant · description · price` (newest first, 300-row display cap, count + total header); "Group by item" mode collapses normalized item names into rows showing ×count, low–high price range, and latest price, expanding on tap to the full dated per-merchant history. Item search box (`#rp-item-q`) filters descriptions live — keystrokes rebuild only `#rp-item-list` via `_rpItemCtx`, so the input keeps focus; search/group state persists across `renderReport()` rebuilds (search resets on each Reports open). All existing filters (owner, dates, merchant, min/max, subcategory) apply since the rows derive from the already-filtered receipt map; client-only feature over the existing `reportReceipts` payload — no GAS changes

## [v01.41r] — 2026-08-02 12:31:41 AM EST — [e04d857](https://github.com/LightAISolutions/Sales/commit/e04d857dd1eaa42edacc85fde251d1f6fa5e292d)

> **Prompt:** "Everything looks good. However, I can no longer see the "Admin" drop down menu in my HTML/GAS layers, which I need to approve new user sessions. Fix it."

### Changed

- `Receipts.gs` (v01.15g) — Admin badge restyled from a dim status-pill look (dark `rgba(0,0,0,0.55)` background, 60% opacity, 10px font — visually identical to the adjacent Live/presence pills, so after the v01.14g move into the `#user-email` row it read as "gone") to a solid accent button: `#90caf9` background, dark text, bold 11px, full opacity, hover lighten; `#admin-wrap` gets `flex: 0 0 auto` so the row can never shrink it. Diagnosis confirmed the menu was functionally present: run 44's deploy log shows "Updated to v01.14g (deployment 21)", and a full-stack Playwright reproduction (real host page + real rendered `doGet` HTML in the iframe, R-hotspot → HTML-layer-toggle flow) showed the badge visible and its dropdown opening — the regression was prominence, not function

## [v01.40r] — 2026-08-02 12:11:48 AM EST — [7811523](https://github.com/LightAISolutions/Sales/commit/78115239120e5a7833214a7eb161e005e17195aa)

> **Prompt:** "A few changes:
>
> * In the History section, move the "sort by receipt date" checkbox outside of the collapsible filter. 
> * Add a "Clear" button in both the History and Reports sections' filters that clears all chosen filters back to default. 
> * In the History section, remove the green checkbox that shows each receipt as saved. If it shows up in the History section, it must already be saved. 
> * While logging in, there is an "icon placeholder" block. Replace this block with a relevant Icon that accurately represents what this app does.
> * In the dashboard, create a "Settings" cog icon at the bottom right corner of the screen that contains the signed in email account (jonyang92@gmail.com), and the "Sign out" and "Sign out everywhere" options. 
> * Slow down the speed at which the positive affirmations cycle by half."

### Added

- `Receipts.html` (v01.21w) — `#rh-clear` / `#rp-clear` buttons at the bottom of each filter drawer: History clears search/dates/category then `rhFilterHint()` + `loadHistory()`; Reports clears merchant/dates/min/max/subcat and dispatches `change` on `rp-cat` so the subcategory dropdown hides/resets through its normal listener
- `Receipts.html` (v01.21w) — Settings cog (`#rsp-settings`, fixed bottom-right, z-index 9) opening `#rsp-settings-panel` with the signed-in email, "Sign out", and "Sign out everywhere"; replaces the inline account row under the status line (same `rsp-account`/`rsp-signout`/`rsp-signout-all` ids so the 2s session-sync interval and sign-out handlers are unchanged); closes on outside click
- `live-site-pages/images/receipts-logo.svg` (created) — Paper Ledger-themed receipt icon (torn zigzag bottom, ink outline, accent `$`) shown on the auth wall and sign-out screen instead of the "LOGO" placeholder (`auth-wall-logo`/`signout-logo` src, PROJECT OVERRIDE)

### Changed

- `Receipts.html` (v01.21w) — "Sort by receipt date" moved out of the History filter drawer onto a pinned row under the Filters toggle; affirmation rotation slowed from 7s to 14s per message

### Removed

- `Receipts.html` (v01.21w) — the `rh-status` ✅/📤 emoji per History row (history only lists saved receipts) and its CSS rule

## [v01.39r] — 2026-08-01 11:52:43 PM EST — [a6732a4](https://github.com/LightAISolutions/Sales/commit/a6732a4a1022f09d68ee3cef4e6ce62ada5637c0)

> **Prompt:** "implement the same filter related changes to the Receipt History section. Also, in the Reports section, move the circle graph checkbox out of the collapsible filter area. I want to be able to easily switch between the bar and circle graphs."

### Changed

- `Receipts.html` (v01.20w) — History filters moved into a collapsible `#rh-filter-body` drawer (collapsed by default), mirroring the Reports pattern: sticky `.rh-head` now holds only the title, the "Viewing" shared-view row, and the `#rh-filter-head` toggle row (~89px vs ~250px pinned). The `⬇️ Export .xlsx` button stays on the pinned toggle row (action, not a filter) with a click guard so it doesn't toggle the drawer; new `rhFilterHint()` shows "n active" for search/dates/category (sort order not counted — it reorders, doesn't narrow)
- `Receipts.html` (v01.20w) — Reports' Circle graphs checkbox moved out of the filter drawer onto the always-pinned `#rp-filter-head` row (new `#rp-circle-wrap` with a click guard in the drawer-toggle handler), so bar ↔ circle switching is one tap without opening filters

## [v01.38r] — 2026-08-01 11:44:33 PM EST — [04bbb0f](https://github.com/LightAISolutions/Sales/commit/04bbb0fe9514eeac922ebd1e886ac4736298856e)

> **Prompt:** "in the Reports section, over half of the screen is freeze-paned, so it is not visually comfortable to use. Make the filters collapsible and start collapsed by default. Re-size as needed with focus on user comfort."

### Changed

- `Receipts.html` (v01.19w) — Reports filters moved out of the sticky `.rp-head` into a new collapsible `#rp-filter-body` drawer (collapsed by default): only the title, period tabs, shared-view "Viewing" row, and a slim `#rp-filter-head` toggle row stay pinned, shrinking the freeze-pane from ~380px to ~132px at 390px width. The toggle row reuses the report groups' `.rp-sec-toggle` +/− circle; when open, the drawer scrolls with the report content
- `Receipts.html` (v01.19w) — New `rpFilterHint()` shows an "n active" accent hint on the collapsed Filters row (merchant/category/subcategory/dates/min/max counted), called at the top of `renderReport()` before the `rpData` guard so it stays accurate even before data loads
- `Receipts.html` (v01.19w) — Report card max-height increased from `calc(100dvh - 170px)` to `calc(100dvh - 120px)` for ~50px more visible report content

## [v01.37r] — 2026-08-01 11:34:35 PM EST — [fa9e4cf](https://github.com/LightAISolutions/Sales/commit/fa9e4cfad1ccddf9335eae1fc87e16f02c1b0ae3)

> **Prompt:** "In order for me to approve new users via the admin panel, I need to be able to click it. Currently, it's being blocked by whichever layer my email (jonyang92@gmail.com) is on. Reformat things so that I can access the admin panel." *(with a desktop screenshot showing the GAS layer's ADMIN badge hidden behind the signed-in email display)*

### Fixed

- `Receipts.gs` (v01.14g) — Admin badge was unclickable: the GAS-served page pinned both `#user-email` (z-index 9999) and `#admin-badge` (z-index 100) to the same fixed top-left corner, so the email row painted over the badge and swallowed its clicks. The badge (with its `#admin-dropdown-gas`) now lives inside the `#user-email` flex row after the live-status pills, wrapped in a new `#admin-wrap` (position: relative) that anchors the dropdown directly beneath the badge — inline flow makes overlap structurally impossible
- Dropdown first-click no-op: the toggle compared `dd.style.display === 'none'`, but the initial inline style is `''` (CSS supplies the `none`), so the first click set `none` and did nothing visible. Toggle now checks `=== 'block'`, opening on the first click
- Mobile safety: `#user-email` capped at `calc(100vw - 16px)` with ellipsis truncation on `#user-email-text`, so the email + Live/presence pills + ADMIN badge stay on one row inside the 30px top band at 390px widths

## [v01.36r] — 2026-08-01 09:57:44 PM EST — [c28adf3](https://github.com/LightAISolutions/Sales/commit/c28adf3e32a00f80e387186a97eb0a70891a6343)

> **Prompt:** "I successfully added the ".../auth/drive.file" scope to the scopes list and made sure each family member's Gmail is in the test-users list. I also successfully completed your recommended next step - everything worked. 
>
> After scanning a receipt, the progress bar gets replaced by the positive affirmations. Do not do that. Also, there is an unloaded icon next to the progress status. I want this progress status and bar to look cute, artsy, and match the existing theme. Give me several mockups to choose between. 
>
> Also, now that all receipt pictures get saved to the user's Drive's "Receipt App" folder, migrate the existing 29 receipt pictures from LightAISolution@gmail.com's Drive to jonyang92@gmail.com's Drive. 
>
> Also, create a sign in/out mechanism, so that other users don't need to use the hidden R button to sign out. Make sure it matches the existing theme and still looks professional.
>
> Also, just like how the Groceries category has 16 departments, refer to apps like ReceiptCamp, Expensify, and Smart Receipts, and populate the other categories (Dinings, Transport, ... , Travel) with relevant subcategories that are also hidden until their linked category is chosen. 
>
> If the above are executed without any problems, then continue with Phase 4." *(Progress design choice via AskUserQuestion: "A, but also add a progress bar above the stage stamps.")*

### Added

#### `Receipts.html` — v01.18w

##### Added
- "Stamp Card" progress UI (developer-chosen mockup A + bar): the existing progress bar sits above four coffee-card stage stamps (📷 Snap → ☁️ Save → ✨ Read → 🧾 Done) that ink to ✓ as the pipeline advances, with a pulsing accent ring on the active stage; `setProgress(pct, stage)` drives both (explicit stage passed by the batch path whose bar spans the whole batch), all hidden together on completion
- Visible account row at the panel foot (`#rsp-account`): signed-in email + link-style "Sign out" / "Sign out everywhere" wired to the template's `performSignOut` flows — no hidden hotspot needed
- One-time background legacy-photo migration (`migrateLegacyPhotos`): lists the user's org-Drive photos, streams each via `getLegacyPhotoBase64`, re-uploads into the user's own "Receipts App" folder, re-links the row via `completePhotoMigration`; per-account localStorage completion flag, quiet status updates, retries next session on failure; `uploadToOwnDrive` gained a mime parameter
- Per-category `SUBCATS` map (Groceries departments unchanged; Dining/Transport/Health/Shopping/Entertainment/Utilities/Travel/Other lists modeled on Expensify/Smart Receipts): review-card item selectors repopulate on category change (off-list values preserved as extra options), Reports' subcategory dropdown + drill-down section now work for every category ("By department" label kept for Groceries, "By subcategory" otherwise)

##### Fixed
- Affirmations no longer talk over a running pipeline (suspended while the scan/batch is active) and now retire the finished progress bar + stamps when they resume; the broken thumbnail `<img>` next to the status ("unloaded icon") was removed along with its wiring

#### `Receipts.gs` — v01.13g

##### Added
- Migration ops on both transports: `listLegacyPhotos` (owner-scoped; a photo is "legacy" iff the script can open it), `getLegacyPhotoBase64` (8MB cap), `completePhotoMigration` (validated Drive URL, row re-link, org copy trashed)
- `ITEM_CATEGORIES` expanded to the union of all per-category subcategory lists (the Gemini extraction enum); extraction prompt updated to pick subcategories matching the receipt's category

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — migration flow section added, extraction subcategory note updated (mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright: account row appears with the session email, Dining subcats populate and survive a Travel switch with value preserved, Reports shows the per-category dropdown + "By subcategory" section, the mocked 2-photo migration ran end-to-end (list → bytes → own-Drive upload → re-link) and set its completion flag, and the Stamp Card was driven through active → all-done → auto-hide by the real pipeline; zero page errors

## [v01.35r] — 2026-08-01 08:11:26 PM EST — [038a514](https://github.com/LightAISolutions/Sales/commit/038a5145e5249046e07e930d04f09db397630fd9)

> **Prompt:** "I verified that the access granting functionality works both ways (giving and receiving permission). Continue with Phase 3."

### Added

#### `Receipts.html` — v01.17w

##### Added
- Own-Drive photo storage: `AUTH_SCOPES` constant adds the non-sensitive `drive.file` scope to all six GIS token clients (each marked `PROJECT OVERRIDE`); new Drive client module — `_getDriveToken` (reuses `_ssoAccessToken`, silent GIS re-request otherwise), `ensureDriveFolder` (Profiles-tab lookup → auto-create "Receipts App" folder → `setProfileFolder` registration), `driveMultipartUpload` via `uploadToOwnDrive`, and best-effort `driveRenameFile` / `driveTrashFile`
- Pipeline rework (single-scan `handleFile` + batch `step`): compress → browser uploads the photo to the user's own Drive → `uploadReceipt` link-registration → `extractReceiptData` from the bytes (throttling preserved via the generalized `extractFor`); **automatic fallback** to the legacy base64 → org-Drive path whenever the Drive token/consent/upload fails, so no photo is ever lost; Retry re-extracts from held bytes (`currentB64`; batch entries keep bytes only for failed extractions to limit memory)
- Save renames the own-Drive photo to the final receipt ID; delete moves it to the user's Drive trash — both via the user's own token, both best-effort (`_drivePhotoByReceipt` map; server-side rename/trash still covers legacy org-Drive rows)

#### `Receipts.gs` — v01.12g

##### Added
- `Profiles` tab (Email, Drive Folder ID, Display Name, Created At) + `getProfile` / `setProfileFolder` ops (folder-ID format validated) on both transports
- `extractReceiptData(sessionToken, imageBase64, mimeType)` — Gemini extraction straight from bytes with an MD5-digest cache (no Drive read); shared `geminiExtractFromBase64_()` core refactored out of `extractReceipt`, which keeps its file-ID path for legacy rows
- `uploadReceipt` dual mode: `imageUrl` link-registration (validated `drive.google.com` prefix, no bytes, GET-fallback-capable) alongside the unchanged legacy base64 path

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — pipeline diagram reworked for own-Drive storage (browser→Drive upload, link registration, bytes-based extraction, per-side rename/trash notes; mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright end-to-end with mocked Drive + GAS endpoints driving the real pipeline — own-Drive path (getProfile → folder create → setProfileFolder → multipart upload → link-mode uploadReceipt with no image bytes → extractReceiptData → review card → save → rename PATCH) and the fallback path (Drive failing → legacy base64 uploadReceipt → extractReceipt by file ID) both confirmed; zero page errors

## [v01.34r] — 2026-08-01 07:51:32 PM EST — [f6241f6](https://github.com/LightAISolutions/Sales/commit/f6241f6017d4aa626fc5e6e16ef9beffd78ac8cc)

> **Prompt:** "I verified on my phone that History, Reports, and the month card still show all my receipts. Continue with Phase 2."

### Added

#### `Receipts.gs` — v01.11g

##### Added
- `Shares` tab (Owner → Grantee, scope `view`/`edit`, timestamp) with `listShares` / `addShare` (upsert, email-format check, self-share block, 20-grant cap) / `removeShare` ops on both transports
- `resolveOwnerScope_()` + `getShareScope_()` — every read op (`listReceipts`, `getReceiptDetail`, `reportReceipts`, `exportReceipts`) accepts an `owner` param resolved through the grant table; `saveReceipt` accepts it too but demands an `edit` grant; `deleteReceipt` deliberately takes no owner param (owner-only); `getReceiptDetail` responses carry `canEdit` + `owner` for the UI

#### `Receipts.html` — v01.16w

##### Added
- "🤝 Sharing" landing button (side-by-side with History) + sharing card (z-index 9): grant-by-email form with view / view+edit scope, revoke buttons, "shared with me" list, mapped error messages (`bad_email`, `cannot_share_with_self`, `share_limit`)
- "Viewing" selector rows in History (`#rh-owner`) and Reports (`#rp-owner`) — hidden until `listShares` returns received grants; selections thread `owner` into list/detail/report/export calls
- Shared-view guardrails: delete buttons hidden on shared views, the History-detail Edit button suppressed when `canEdit` is false, `editingOwner` threaded into the edit-in-place save, and the month-card refresh no longer clobbers the reports dataset while a shared view is open

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — sharing flow added to the pipeline diagram (mermaid.live URL regenerated + decompression-verified); share card added to the HTML layer-toggle element list

### Verified
- `node --check` on the `.gs` and both inline scripts; Playwright interaction test at 390px with mocked share data through the real code paths — grant/revoke round-trip, "Viewing" selectors appear only with received grants, shared list hides delete, view-only shared detail suppresses Edit, and the wire calls carry `owner` exactly when a shared view is active; zero page errors

## [v01.33r] — 2026-08-01 07:38:37 PM EST — [04a3cc6](https://github.com/LightAISolutions/Sales/commit/04a3cc67239c790222bcafb46e008b8339fa4a04)

> **Prompt:** "continue with your recommendation" *(executes Phase 1 — data isolation — of the approved multi-user action plan from the preceding research response)*

### Added
- `googleAppsScripts/Receipts/Receipts.gs` (v01.10g) — multi-user data isolation. The existing "Uploaded By" column is now the receipt's owner: `listReceipts`, `getReceiptDetail`, `reportReceipts`, `deleteReceipt`, `saveReceipt`, and `exportReceipts` are all scoped to the signed-in user's own rows (ownership misses respond `receipt_not_found` so existence never leaks across accounts); `saveReceipt`'s duplicate detection is per-owner
- `backfillReceiptOwners_()` — one-time flag-guarded (`RECEIPT_OWNER_BACKFILL`) lazy migration stamping `RECEIPTS_LEGACY_OWNER` into blank Uploaded By cells, triggered from `listReceipts`/`reportReceipts`
- Monthly Summary tab rebuilt per-owner (new leading `Owner` column, rows sorted owner → month desc); the .xlsx export copies only the requesting user's summary rows and drops the Owner column to keep the familiar layout

### Removed
- `syncDriveFolderAccess_()` and its `listReceipts` call — the ACL → photo-folder viewer sync granted every ACL member viewer access to the shared photos folder, which becomes a cross-user privacy leak under multi-user isolation (removal pre-approved in the action plan). Previously granted folder viewers are NOT auto-revoked — manual Drive cleanup recommended

### Changed
- `repository-information/diagrams/Receipts-diagram.md` — pipeline diagram updated: owner-scoped reads, owner backfill in the lazy-migration step, folder-sync interaction removed (mermaid.live URL regenerated + decompression-verified)

### Verified
- `node --check` on the `.gs`; no remaining references to the removed sync function; server-side-only change (no UI modification, visual test not applicable per the trigger list)

## [v01.32r] — 2026-08-01 07:04:39 PM EST — [1737e9e](https://github.com/LightAISolutions/Sales/commit/1737e9e2775150ea8eacec2cd7c60a443a9d3572)

> **Prompt:** "[screenshot attached] The hidden R button only hides the HTML and GAS buttons at the bottom. I want the hidden R button to also hide the sections I circled in red in the attached picture."

### Changed
- `live-site-pages/Receipts.html` (v01.15w) — the "R" hotspot now toggles a body-level `rcpt-clean` class (on by default) whose `!important` CSS rule hides all six developer/technical pills: `#user-pill` (email + Sign Out / Sign Out All), `#auth-timers` (session countdown), `#gas-pill` (GAS version), `#version-indicator` (HTML version), and the two layer-toggle pills. The class approach replaces the previous per-element inline-style wrappers (`_showGasToggle`/`_hideGasToggle` gating removed) — it outranks the template's inline `display` changes after sign-in and automatically covers the dynamically-created version pill, which inline juggling could not

### Verified
- `node --check` on both inline scripts; Playwright at 390px with the signed-in pill states simulated — all pills hidden by default, all revealed on "R" tap (user pill flex, timers/GAS pill block, both toggles block), all re-hidden on second tap; zero page errors. The HTML version pill is created only after a successful version fetch (impossible under `file://`) but is governed by the same ID-based CSS rule in production

## [v01.31r] — 2026-08-01 06:53:29 PM EST — [00a532a](https://github.com/LightAISolutions/Sales/commit/00a532a9e7d75a0b3b6f5b4846148f5e95bd8958)

> **Prompt:** "One more change:
>
> * Change front-end display to include a hidden button on the letter "R" in the word "Receipts" on the home screen that I can press to toggle on/off the HTML and GAS layer. I want the app to look clean to other users and still allow me to toggle these layers on for myself."

### Added
- `live-site-pages/Receipts.html` (v01.14w) — hidden developer hotspot: the "R" of the brand heading is wrapped in `#rsp-r-secret` (no visual affordance, tap-highlight suppressed); tapping it shows/hides the `#html-layer-toggle` and `#gas-layer-toggle` pills, which now start hidden for everyone. The template's post-sign-in `_showGasToggle()` / sign-out `_hideGasToggle()` are wrapped so GAS-pill eligibility is tracked but the pill only surfaces while the hotspot state is on

### Fixed
- `.rsp-brand span` date styling narrowed to `#rsp-date` — the generic selector was also hitting the new "R" span, rendering it small/italic (caught by the Playwright screenshot before commit)

### Verified
- `node --check` on both inline scripts; Playwright at 390px — pills hidden on load, still hidden after the template's simulated post-sign-in `_showGasToggle()`, both revealed on "R" tap (HTML pill toggles the receipts layer correctly), both hidden again on second tap; heading renders with a uniform "Receipts" wordmark; zero page errors

## [v01.30r] — 2026-08-01 06:08:39 PM EST — [7481bec](https://github.com/LightAISolutions/Sales/commit/7481beced14f9cea20800f50139cbbd68f30ff85)

> **Prompt:** "A few more changes: 
>
> * In the Reports section:
>    * Hide the "All departments" drop-down menu until "Groceries" are chosen in the "All categories" drop-down menu. 
>    * Change "Circle graphs (percentage comparison)" to "Circle graphs".
>    * After checking the "Circle graphs" option, I notice that only 8 data groups are included before the rest are grouped under "Other". Reformat the circle graphs such that the circle graph itself is larger and located above the index breakdown of different data groups. Then, allow each circle graph to include up to 20 data groups that keep extending downwards. I like the current data group format of "Group name, Percentage, USD Amount", so keep this structure."

### Changed
- `live-site-pages/Receipts.html` (v01.13w) — `#rp-subcat` (departments dropdown) starts `display:none` and is toggled by a dedicated `#rp-cat` change listener: visible only when the selection is `Groceries`; on any other selection it hides and clears its value (with a re-render) so no invisible line-item filter lingers
- Circle-graphs checkbox label shortened to "Circle graphs"
- Donut layout restructured: `.rp-donut-wrap` is now a column (large `min(210px, 62vw)` donut centered on top, full-width legend below extending downward); slice cap raised 8 → 20 before the "Other" fold; legend row format unchanged (swatch · name · percent · amount)

### Verified
- `node --check` on both inline scripts; Playwright at 390px with intercepted `reportReceipts` demo data (12 categories) — departments dropdown hidden on load, visible for Groceries, hidden + cleared on switch to Dining; 12 legend rows render without an "Other" fold; large donut renders above the legend

## [v01.29r] — 2026-08-01 05:53:12 PM EST — [3457be2](https://github.com/LightAISolutions/Sales/commit/3457be259474c3ef4f008ba7e643ce6763e3466d)

> **Prompt:** "A few more changes:
>
> * In the Reports section:
>    * Change the Daily Totals format to the equivalent of "Wed, 7/29/26".
>    * Change the Weekly Totals format to the equivalent of "7/26/26 - 8/1/26".
>    * Change the Monthly Totals format to the equivalent of "July 2026".
>    * Change the Bi-annual Totals format to the equivalent of "First Half of 2026" and "Second Half of 2026".
>    * Add a "By Department" section under the "By Category" section in the report that only shows up when the user chooses "Groceries" in the "By Category" drop-down menu. 
>    * Minimize each of the reporting groups ("Daily Totals", "By Category", "By Department", "Top Merchants" until the user clicks a little "+" icon on the right side of the reporting group. 
>    * Add a checkbox option to show the reporting groups as circle graphs instead of bar graphs to see percentage comparisons. Make sure they also start off minimized until the user expands the reporting group."

### Added
- `live-site-pages/Receipts.html` (v01.12w) — "By department" report group (line-item department totals over the filtered receipts), rendered only when the `#rp-cat` category filter is `Groceries`; collapsible report groups (`rpSection()` header + right-side circled `+`/`−` toggle, `_rpOpen` state map — all groups start minimized on every card open, toggle state survives filter re-renders via a delegated `#rp-body` click handler that flips display in place); "Circle graphs (percentage comparison)" checkbox — sections render as stroke-dasharray SVG donuts (8-slice cap + "Other" fold, `RP_COLORS` palette) with a swatch/label/percent/amount legend instead of bars
- Period-label formatter `bucketLabel()`: daily "Wed, 7/29/26", weekly "7/26/26 - 8/1/26", monthly "July 2026", bi-annual "First Half of 2026" / "Second Half of 2026"

### Changed
- Weekly bucketing switched from ISO-8601 Monday-start keys (`isoWeekKey`, removed) to Sunday-start week-start-date keys (`weekStartKey`) so the displayed ranges match the requested Sunday–Saturday spans; `.rp-section` groups restyled as bordered sub-cards to carry the collapsible headers

### Verified
- `node --check` on both inline scripts; Playwright interaction test at 390×844 with intercepted `reportReceipts` demo data through the real renderer — verified all four label formats, department group appears only for Groceries (present with, absent without), groups start collapsed, `+`/`−` toggling, and 3 donut SVGs with percentage legends in circle mode; only expected `file://` console errors

## [v01.28r] — 2026-08-01 05:18:59 PM EST — [c850f48](https://github.com/LightAISolutions/Sales/commit/c850f48e3efa0045a510bf34d2526b5fc4c628bb)

> **Prompt:** "In my Receipts app, I want to make the following changes:
>
> * Add an Upload receipts button to allow for mass processing for up to X number of receipts at a time. Recommend a max number of receipts to be uploaded and explain to me why.
> * Add a Reports button that allows for the generation and real-time display of daily, weekly, monthly, bi-annual, and annual reports, and real-time filtering by merchant name, major categories (ie: Grocery) tied with minor categories (ie: Produce), date ranges, and total cost ranges.
> * Allow me to edit the line items in Receipt History, so I don't have to delete/re-upload everytime I want to delete a line that I should have deleted in the Review step. 
> * Improve the landing UI. I want this app to look professionally made with popular mobile UX/UI designs. Show me a couple designs and let me choose before you implement." *(Design choice via AskUserQuestion: "A, but remove the "Photograph or choose a receipt to upload sentence". Instead, cycle through "Love yourself", "You're the best!", "Today's gonna be a good day", and 10 more sentences like these.")*

### Added
- Batch "Upload receipts" flow (gallery multi-select, cap 15/batch), Reports card with real-time client-side filtering, and edit-in-place for saved receipts in History
- `reportReceipts` GAS op — compact receipts + line-items dataset powering the Reports card and the landing month summary

### Changed
- Receipts landing redesigned to the developer-chosen "Paper Ledger" theme (cream/ink serif design with printed-receipt month summary); idle status line now cycles 13 affirmations
- `repository-information/diagrams/Receipts-diagram.md` — pipeline sequence diagram extended with the batch upload, edit-in-place, and reports flows (mermaid.live URL regenerated + decompression-verified)

#### `Receipts.html` — v01.11w

##### Added
- `#receipt-upload-input` (`multiple`, no `capture`) + sequential batch engine: per-photo compress → `uploadReceipt` → `extractReceipt` with ≥6.5s spacing between extraction calls (Gemini free-tier ~10 RPM), `MAX_BATCH = 15`, queue-stepped review cards with a "· n of N" position chip; Save/Discard advance the queue
- `#receipt-report-card` (z-index 8): Daily/Weekly/Monthly/Bi-annual/Annual segmented control, merchant/category/department/date-range/cost-range filters (all client-side over one `reportReceipts` fetch → instant re-render), summary chips, per-period bars, category breakdown, top merchants; minor-category mode switches totals to matching line-item amounts
- "✏️ Edit receipt / line items" button in each History detail — reopens the review card pre-filled from `getReceiptDetail` and re-saves via the idempotent `saveReceipt`, returning to a refreshed History list
- `#rcpt-month` landing hero (perforated-edge month summary fed by `reportReceipts`, refreshed after saves/deletes) and `#receipt-backdrop` full-screen cream layer wired into the template's HTML layer toggle via a project-side wrapper

##### Changed
- Full "Paper Ledger" restyle of the PROJECT CSS (theme variables `--rc-*`, serif type, monospace numerals, ink buttons); PWA `theme-color` → `#e9e3d6`; review/history/report cards raised to `top: 76px` with `calc(100dvh - 170px)` height; history date column widened to fix wrapping
- Idle status text replaced by a 13-sentence affirmation rotation (7s cycle; real status messages linger 12s before rotation resumes); status colors moved to theme palette

#### `Receipts.gs` — v01.09g

##### Added
- `reportReceipts(sessionToken, dateFrom, dateTo)` — all saved receipts (id, date, merchant, currency, total, category; cap 2000) plus their LineItems rows (receiptId, description, amount, category); routed in `doPost` and the `doGet` `action=api` fallback chain

### Verified
- `node --check` on the `.gs` and both inline page scripts; Playwright at 390×844 — landing, Reports, batch-position review card, and History detail with Edit button all render correctly in the new theme; only expected `file://` console errors

## [v01.27r] — 2026-08-01 06:51:35 AM EST — [b90dd37](https://github.com/LightAISolutions/Sales/commit/b90dd37187facddbbd3ef58fa809244979b1abf4)

> **Prompt:** "In Receipt History, label the "Start Date" and "End Date" boxes in the same way as the "Search merchant" box is labeled. Also, keep the "Start Date" and "End Date" boxes side-by-side, but move them below the "Search merchant" box. Also, add a drop-down menu that filters between the major categories: Groceries, Dining, Transport, Health, Shopping, Entertainment, Utilities, Travel, and Other."

### Added
- Category filter for receipt history and export

#### `Receipts.html` — v01.10w

##### Added
- Full-width `#rh-cat` dropdown row in the history card, populated from the existing `CATEGORIES` array with a blank "All categories" option; sends `cat` on both `listReceipts` and `exportReceipts` calls and reloads on change

##### Changed
- History filter rows restructured: row 1 = merchant search + Search button; row 2 = "Start Date"/"End Date" boxes side-by-side, each with a small `.rh-field` label above (date inputs can't show placeholder text like the search box, so field labels are the matching treatment); row 3 = category dropdown

#### `Receipts.gs` — v01.08g

##### Added
- `category` parameter on `listReceipts` (exact match on the Category column, applied server-side before the row cap) and threaded through `exportReceipts` → internal `listReceipts` call; `cat` parameter wired into all four transport routes (POST + GET fallback for both ops)

### Verified
- `node --check` on the `.gs` and all inline scripts; Playwright at 390px — labels "Start Date"/"End Date" render above the side-by-side boxes, dropdown lists all 9 categories + "All categories", no horizontal scroll, zero page errors

## [v01.26r] — 2026-08-01 06:36:33 AM EST — [658cce8](https://github.com/LightAISolutions/Sales/commit/658cce8c1313516baaf5c159415a01f2146a6d40)

> **Prompt:** "Everything works. Also, remove the checkbox for "Show unsaved uploads". I think it's redundant now that I will never upload a receipt without saving."

### Removed
- "Show unsaved uploads" checkbox from the history card (`live-site-pages/Receipts.html` v01.09w): markup, its change listener, and the `uploaded` parameter from the history-load and export calls — the UI is saved-only. The server-side `uploaded` parameter on `listReceipts`/`exportReceipts` is intentionally retained (harmless capability; the client simply no longer sends it), so unsaved rows remain reachable via the spreadsheet if ever needed

### Verified
- Zero `rh-show-uploaded` references remain; `node --check` on all inline scripts; Playwright render — sort checkbox and export button intact, zero page errors

## [v01.25r] — 2026-08-01 06:25:29 AM EST — [526aa58](https://github.com/LightAISolutions/Sales/commit/526aa5850995b78c5259761c2f07e030f8297a3a)

> **Prompt:** "I tested the 2 actions and both work as intended. 1. In the Receipt History, standardize merchant names to be: capitalize the first letter of each word with the rest lower-case (ie: Trader Joe's instead of TRADER JOE'S). 2. In the Receipt History, when I try to "view photo", it says that "jonyang92@gmail.com" doesnt have access to the file. I assume it's because the folder is on "LightAISolution@gmail.com"'s Drive. I would like for this folder's permissions to be synced to my MasterACL file's permissions. For example, if I give a new email Admin access to my Receipts app via the MasterACL spreadsheet, I want that email to automatically get access to this Receipt Pictures folder. Make the changes necessary so that this can happen." *(screenshots: history with mixed-case merchants; Drive "you need access" page for jonyang92@gmail.com)*

### Added
- **Drive folder ↔ Master ACL permission sync** (`googleAppsScripts/Receipts/Receipts.gs` v01.07g): `syncDriveFolderAccess_()` reads the Access tab (col A emails, Receipts column TRUE, metadata rows skipped via the @-check), grants VIEWER on the photos folder to every authorized user, and revokes viewers whose grant was removed — the folder owner and manually-added editors are never touched. Runs from `listReceipts` (first thing opened before viewing photos), throttled via CacheService to once per 10 minutes; best-effort with the app's session auth as the real gate

### Changed
- **Merchant standardization**: `titleCase_()` (capitalize each word start incl. after hyphen/slash, rest lower-case, apostrophes preserved — "TRADER JOE'S" → "Trader Joe's") applied to `data.merchant` at save time; migration upgraded to **v3** (flag `RECEIPT_ID_FORMAT=v3`): title-cases all saved merchants in place and regenerates `Store_Name-YYYYMMDD` IDs + LineItems references + Drive photo names where the standardized name changes them (collision-suffix-only differences keep the existing ID)
- Pipeline diagram history flow updated (v3 migration + folder ACL sync; pako URL regenerated, decompression-verified)

### Verified
- `node --check` on the `.gs`; `titleCase_` behavior checked against real merchant strings (TRADER JOE'S → Trader Joe's, MEGA MART → Mega Mart, cvs/pharmacy #123 → Cvs/Pharmacy #123, seven-eleven → Seven-Eleven)

## [v01.24r] — 2026-08-01 06:06:54 AM EST — [5c15b04](https://github.com/LightAISolutions/Sales/commit/5c15b048d44b37016ad536a3848641f3e4e968fc)

> **Prompt:** "I tested all 6 actions and they all worked as intended. Go with your suggested supermarket department taxonomy (16 departments). I want per-item editing in the review screen."

### Added
- Per-item department editing in the review screen (`live-site-pages/Receipts.html` v01.08w): each line item is now a two-line block — inputs row + a compact department `<select>` (`.rr-cat`, client `ITEM_CATS` mirrors the GAS `ITEM_CATEGORIES` 16-department enum) pre-selected from Gemini's auto-assignment; `collectReview()` includes `category` per item

### Fixed
- Extracted per-item categories were being dropped on save — the review UI didn't carry them, so `collectReview()` sent items without `category` and `saveReceipt` stored empty strings. The dropdowns now carry the extraction values (edited or not) through to the LineItems tab and the export

### Verified
- `node --check` on all inline scripts; Playwright at 390×844 — three item blocks with departments Produce/Pantry/Beverages set via the real Add-item path, selects render under each row, no horizontal scroll, zero page errors. GAS untouched (v01.06g unchanged — `saveReceipt` already persisted `it.category`)

## [v01.23r] — 2026-08-01 05:28:51 AM EST — [3bcdf30](https://github.com/LightAISolutions/Sales/commit/3bcdf306b4d047f260dab9a14c095e76bc1a0a71)

> **Prompt:** "I tested all three actions and everything works as intended. Currently, the receipt history shows the receipts based on upload order; Create a checkbox option to show the receipts chronologically based on the receipt dates instead of upload order. Also, reformat the default "Receipt ID"s to "Store_Name-YYYYMMDD"; Update the existing receipts' IDs to match. Also, currently, the status (uploading, extracting, saved, etc) window is to the right of the "History" button; Move the status window below the "Scan Receipt" and "History" buttons and add a progress bar that makes sense for this application. Also, when extracting, record the store address as well. Also, in the exported excel spreadsheet tab "LineItems", make it easy to distinguish and switch between the different receipts. After executing the above, continue with Phase 5: automatic spending categories (assigned during extraction), a monthly-summary tab, duplicate-receipt detection. Regarding the automatic spending categories, refer to existing apps like ReceiptCamp, Expensify, and Smart Receipts to figure out the best categories to use to cover the entirety of grocery store items."

### Added
- **Readable receipt IDs** (`googleAppsScripts/Receipts/Receipts.gs` v01.06g): `makeReceiptId_()` builds `Store_Name-YYYYMMDD` (sanitized merchant, collision suffix `-2`/`-3`), assigned at save time since merchant/date are unknown at upload; the Drive photo is renamed to match; one-time lazy migration (`migrateReceiptIds_()`, Script-Properties-flag + LockService guarded, triggered from `listReceipts`) renames all existing saved receipts, their LineItems rows, and photos
- **Store address**: added to the Gemini schema, new "Store Address" column (in-place header upgrade for existing sheets), editable field in the review card (`live-site-pages/Receipts.html` v01.07w), shown in history detail (📍) and the export
- **Progress bar + status relocation**: status line moved below the Scan/History buttons; stepped bar tracks Compressing (15) → Uploading (40) → Extracting (70) → Done (100, green) and Saving (85) → Saved (100); cards shifted down (top 128px) to clear the taller panel
- **"Sort by receipt date" checkbox** — server-side sort in `listReceipts` (`sort=date`, newest printed date first, undated rows last)
- **Phase 5a — automatic per-item categories**: `ITEM_CATEGORIES` (16 supermarket departments: Produce, Meat & Seafood, Dairy & Eggs, Bakery, Deli & Prepared, Frozen, Pantry, Snacks & Candy, Beverages, Alcohol, Household, Personal Care, Baby, Pet, Non-Grocery, Other) assigned by Gemini per line item via schema enum; stored in a new LineItems "Category" column, shown in history detail and the export. Reference apps (Expensify/Smart Receipts style) verified via web search to use merchant-level buckets only, so item level uses standard supermarket department taxonomy
- **Phase 5b — Monthly Summary tab**: `rebuildMonthlySummary_()` aggregates saved receipts per month (count, total, per-receipt-category totals), rebuilt on every save/delete and mirrored as a third sheet in the export
- **Phase 5c — duplicate detection**: `saveReceipt` rejects a save matching another saved receipt's merchant+date+total with `{error: 'duplicate', duplicateOf}`; the review card warns and the next Save press sends `force=1` ("save anyway")

### Changed
- **Export LineItems readability**: items grouped per receipt under bold banded header rows (store · date · total) with alternating block colors and blank separators; Receipt ID column retained for filtering; Receipts sheet gains the Store Address column; export response count fixed to actual item rows
- Receipt Pipeline diagram updated with ID assignment, duplicate check, address, summary rebuild, sort and migration steps (pako URL regenerated, decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright at 390×844 and 390×700 — status+progress render below the buttons, review card (with address) no longer overlaps the taller panel, sticky Save still visible; zero page errors

## [v01.22r] — 2026-08-01 04:38:48 AM EST — [af6ca3e](https://github.com/LightAISolutions/Sales/commit/af6ca3ef0589340f9f07b1a65fc589b9391ae6a0)

> **Prompt:** "History works, but I want you to only show "saved" receipts by default. Add a checkbox option to show uploaded but unsaved receipts. Also, give me an option to delete records as well. Meanwhile, continue with Phase 4."

### Added
- **Record deletion** (`googleAppsScripts/Receipts/Receipts.gs` v01.05g, `live-site-pages/Receipts.html` v01.06w): GAS `deleteReceipt` route removes the receipt row + its LineItems rows and trashes the Drive photo (fileId parsed from the stored URL; recoverable ~30 days). Enforces the RBAC `delete` permission when the ACL's roles are configured (empty permission set falls back to session-only gating, matching other write routes). Client-side: per-row 🗑 with a two-tap inline confirmation (arm → "Delete?" → 4s auto-disarm) — no browser `confirm()` per the repo's UI Dialogs rule
- **Receipts Phase 4 — .xlsx export**: GAS `exportReceipts` builds a temp two-sheet spreadsheet (Receipts incl. subtotal/tax/total pulled per-ID, LineItems for the matching IDs), exports it via the Drive endpoint with `ScriptApp.getOAuthToken()`, trashes the temp file (in a `finally`), and returns `{fileName, base64}`; "⬇️ Export .xlsx" button downloads it as a Blob using the current history filters
- "Show unsaved uploads" checkbox in the history filter header

### Changed
- History now defaults to **saved receipts only** — `listReceipts` gained a status filter (`uploaded=1` includes unsaved rows), wired to the checkbox
- Delete + export flows appended to the Receipt Pipeline diagram (pako URL regenerated, decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render at 390×700 — checkbox, export button, idle 🗑 and armed "Delete?" states all visible, no horizontal scroll, zero page errors

## [v01.21r] — 2026-08-01 04:12:06 AM EST — [01c10e1](https://github.com/LightAISolutions/Sales/commit/01c10e1486534aefa5f65b4181ea1119726031d4)

> **Prompt:** "I re-scanned the Trader Joe's receipt and it successfully saved. I then tried a long MegaMart receipt and it also succeeded, but the extraction took close to 10 minutes. Is there any way to speed up this process? Meanwhile, continue with Phase 3."

### Fixed
- **~10-minute extractions** (`googleAppsScripts/Receipts/Receipts.gs` v01.04g): root cause was the fetch transport double-running the work — the POST leg ran the full extraction, Google returned an unparseable error page, and the GET fallback re-ran everything. Three changes: (1) extraction results now cached server-side by fileId (`CacheService`, 10-min TTL) so a second transport leg returns instantly; (2) `gemini-3.6-flash` promoted to primary (faster generation; the observed 503 congestion was on 3.5-flash, now the fallback); (3) retry plan trimmed 4 → 3 attempts to bound worst-case wall time

### Added
- **Receipts Phase 3 — history browser** (`Receipts.gs` v01.04g, `live-site-pages/Receipts.html` v01.05w): GAS `listReceipts` route (merchant substring + date-range filters, newest first, cap 500) and `getReceiptDetail` route (full fields + LineItems rows), both with POST + GET api fallbacks; HTML "🧾 History" button + history card (z-index 7, dvh-sized, sticky filter header) with search/date inputs, receipt list (status ✅/📤, totals), tap-to-expand cached details, and photo links; HTML-escaping helper for all rendered spreadsheet data
- History flows appended to the Receipt Pipeline sequence diagram in `repository-information/diagrams/Receipts-diagram.md` (pako URL regenerated and decompression-verified)

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render of the history card with simulated rows + expanded detail at 390×700 (no horizontal scroll, zero page errors)

## [v01.20r] — 2026-08-01 03:51:49 AM EST — [a81c722](https://github.com/LightAISolutions/Sales/commit/a81c7221edc18a9bfd069ac763eee21eaff9a185)

> **Prompt:** "it successfully extracted the information, but after scrolling to the bottom, I cannot see nor click "Save Receipt". Resize this UI to make it more user friendly and possible to save receipts." *(screenshot: 12-item extracted receipt, card scrolled to "+ Add item" with the action row cut off below the visible screen)*

### Fixed
- Unreachable Save button on mobile (`live-site-pages/Receipts.html` v01.04w): the review card's `max-height` used `100vh`, which on mobile includes the area behind the browser URL bar — with long item lists the card's bottom edge (action row) landed below the visible screen. Now sized with `100dvh` (dynamic viewport height; `100vh` kept as older-browser fallback) plus extra bottom clearance above the version pills

### Changed
- Save/Discard/Retry row is now a **sticky action bar** pinned to the card's bottom edge (`position: sticky` with background + top border) — always visible and clickable regardless of scroll position; the fields and item list scroll underneath it

### Verified
- Playwright at 390×700 (short viewport simulating browser chrome) with a 12-item receipt: Save button inside the viewport and clickable via `document.elementFromPoint` both before and after scrolling the card's content; zero page errors

## [v01.19r] — 2026-08-01 03:17:05 AM EST — [faa2fe3](https://github.com/LightAISolutions/Sales/commit/faa2fe39fcd2049cd09660ec21b1bb2a7064eceb)

> **Prompt:** "I got the attached error message" *(screenshot: review card open in manual-entry fallback with `Extraction failed (gemini_http_503: This model is currently experiencing high demand. Spikes in demand are usually temporary. Please try again later.)`)*

### Fixed
- Transient Gemini 503 "high demand" failures (`googleAppsScripts/Receipts/Receipts.gs` v01.03g): `extractReceipt` now runs a 4-step retry plan — primary model twice (0s/2s waits), then `GEMINI_FALLBACK_MODEL = "gemini-3.6-flash"` twice (1s/3s waits) — retrying only transient statuses (503/429/500); non-transient errors (bad key, bad request) still fail fast to avoid burning quota

### Added
- "Retry extraction" button in the review card (`live-site-pages/Receipts.html` v01.03w): shown only when extraction fails; re-runs extraction against the already-uploaded Drive file (tracked via new `currentFileId`) and re-populates the card on success — no re-photographing needed

### Verified
- `node --check` on `.gs` + all inline scripts; Playwright render of the failed-extraction state at 390×844 (retry button visible, no horizontal scroll, zero page errors)

## [v01.18r] — 2026-08-01 03:07:59 AM EST — [4d2b91c](https://github.com/LightAISolutions/Sales/commit/4d2b91cb6596e5b661721265fd1f2c89be8048d5)

> **Prompt:** "The receipt picture was successfully taken and uploaded. Start phase 2."

### Added
- **Receipts Phase 2 — AI extraction + review-before-save** (`googleAppsScripts/Receipts/Receipts.gs` v01.02g, `live-site-pages/Receipts.html` v01.02w):
- GAS `extractReceipt` route (POST + GET api fallback; session-validated): reads the uploaded photo back from Drive by fileId and calls Gemini `generateContent` (`GEMINI_MODEL = "gemini-3.5-flash"`, key from Script Properties `GEMINI_API_KEY`) with a strict `responseSchema` returning merchant, date, currency, subtotal, tax, total, category (9-option enum), and lineItems[]; temperature 0; robust error mapping (`gemini_key_missing`, `gemini_http_*`, `gemini_parse_failed`)
- GAS `saveReceipt` route (body-POST only — reviewed JSON can exceed GET URL limits): fills the receipt's row by Receipt ID (date/merchant/currency/subtotal/tax/total/category), sets status `saved`, stores the raw extraction JSON for audit, and replaces the receipt's LineItems rows idempotently
- HTML review card (`#receipt-review-card`, z-index 6 — under the overlay walls like the scan panel): auto-opens pre-filled after extraction with editable fields + category dropdown + line-items grid (add/remove rows), Save/Discard actions; opens empty for manual entry when extraction fails; `uploadReceipt` now returns `fileId` to feed extraction
- New "Receipt Pipeline" sequence diagram section in `repository-information/diagrams/Receipts-diagram.md` (upload → extract → review → save; pako URL generated and decompression-verified)

### Verified
- Gemini model names verified against current documentation via web search (gemini-3.5-flash / gemini-3.6-flash, free tier); `node --check` on the `.gs` and all inline scripts; Playwright render of the populated review card at 390×844 and 1280×800 (no horizontal scroll, zero page errors)

## [v01.17r] — 2026-08-01 02:26:53 AM EST — [9f936c5](https://github.com/LightAISolutions/Sales/commit/9f936c5db38547c35bed3ee9eb3f2dbdd7709204)

> **Prompt:** "I approve the plan to PWA-ify the web app. I have also granted Receipts ACL permission to "jonyang92@gmail.com" and confirmed that the live page loads. LightAISolution's Drive folder ID is "1DHfXwzo0qXI_2H0Q2dDLKGn7EOtguI0A"."

### Added
- **Receipts Phase 1 upload pipeline** (`live-site-pages/Receipts.html` v01.01w, `googleAppsScripts/Receipts/Receipts.gs` v01.01g): "📷 Scan receipt" panel in the page PROJECT blocks — camera-direct capture on phones (`capture="environment"`), file picker on desktop, client-side canvas compression (max 1600px JPEG q0.82, EXIF-orientation-aware via `createImageBitmap`), thumbnail + status feedback. New `_gasPostBody()` transport variant sends the base64 image in a form-encoded POST body with 3-attempt retry (the template's `_gasPost` carries params in the URL — impossible at image sizes; no GET fallback exists for the same reason)
- GAS side: `uploadReceipt` route (`doPost action=uploadReceipt`, session-validated via `validateSessionForData`) decodes and saves the photo to the configured Drive folder and appends an "uploaded" row to the `Receipts` tab; idempotent `ensureReceiptTabs_()` bootstraps the `Receipts` + `LineItems` tabs (frozen headers) on first write — Phase 2's extraction will fill the remaining columns
- **PWA install support**: new `live-site-pages/receipts.webmanifest` + generated app icons (`images/receipts-icon-192.png`, `receipts-icon-512.png`, maskable) + manifest/theme-color/apple-touch head tags in `Receipts.html`; CSP `manifest-src` relaxed `'none'` → `'self'` in both CSP tags, marked with a `PROJECT OVERRIDE` comment
- `DRIVE_FOLDER_ID` added to `Receipts.config.json` and mirrored in `Receipts.gs` (config sync per [PC-GAS-CONFIG] #14)

### Verified
- `node --check` passes on the full `.gs` and every inline HTML script block; Playwright render checks at 390×844 and 1280×800 — panel centered with no horizontal scroll, zero page errors

## [v01.16r] — 2026-08-01 01:40:25 AM EST — [d00c587](https://github.com/LightAISolutions/Sales/commit/d00c58788b9ece6a630558c97f13b0a93db2c3ac)

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push. `bash scripts/setup-gas-project.sh <<'CONFIG' { "PROJECT_ENVIRONMENT_NAME": "Receipts", "TITLE": "Receipts", "DEPLOYMENT_ID": "AKfycbwASoUFzqdy3Bb-NbsbG6Hh3-9fPz1aGJGi8AbUsBV0YBu85ockXXdWkLKB8kEtivrb", "SPREADSHEET_ID": "1SfVRsHm6pUn1bq633BSKiQ8c3IsQeVAs7H0265ckdDM", "SHEET_NAME": "Live_Sheet", "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg", "INCLUDE_AUTH": true, "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com", "AUTH_PRESET": "hipaa", "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE", "ACL_SHEET_NAME": "Access" } CONFIG`"

### Added
- New auth GAS project **Receipts** (HIPAA preset) created via `scripts/setup-gas-project.sh` — 10 files: `live-site-pages/Receipts.html` (v01.00w), `googleAppsScripts/Receipts/Receipts.gs` (v01.00g), `Receipts.config.json`, html/gs version files, page + GAS changelogs with archives, and per-environment diagram `repository-information/diagrams/Receipts-diagram.md`
- Registered across the repo: GAS Projects table (`.claude/rules/gas-scripts.md`), README structure tree (page entry with version links + all subtree entries), REPO-ARCHITECTURE.md (RECEIPTS_PAGE + GAS_RECEIPTS nodes and template-source/iframe/serves/deploy/polling edges), and a `Deploy Receipts` webhook step in `.github/workflows/auto-merge-claude.yml`
- Live config wired in at creation: real deployment ID (obfuscated `_e` URL in the page verified against expected encoding), data spreadsheet (`Live_Sheet`), and real Master ACL spreadsheet ID in both `.gs` and `.config.json` — Global ACL Access-tab self-registration active on first page load

### Changed
- Regenerated the Flowchart and Class Diagram mermaid.live pako URLs in `repository-information/REPO-ARCHITECTURE.md` (both went stale when the setup script added the Receipts nodes) — decompression-verified, including the new `Receipts-diagram.md` link

## [v01.15r] — 2026-07-18 03:15:05 AM EST — [bd28564](https://github.com/LightAISolutions/Sales/commit/bd28564e0ba76ac0e3f3dc4002e1c17a57f14ac9)

> **Prompt:** "Create a 5 second animation of Spain vs Argentina in the 2026 world cup and show it on repeat."

### Added
- New standalone page `live-site-pages/spain-argentina.html` (v01.00w), created from `HtmlAndGasTemplateAutoUpdate-noauth.html.txt`: a pure-CSS 5-second Spain vs Argentina World Cup 2026 match animation that loops infinitely (`animation: … 5s … infinite`). PROJECT blocks contain a scoreboard (🇪🇸 ESP 0–0 ARG 🇦🇷), a striped pitch with halfway line/centre circle/boxes/goals, three Spain players (red/yellow), three Argentina players (albiceleste stripes incl. a diving keeper), a ⚽ ball that passes through midfield and finishes in Argentina's net, and a "GOAL!" flash at ~80% of the loop. No JavaScript added — the JS PROJECT block stays empty (animation is CSS-only); no GAS project
- New tracking files: `html-versions/spain-argentinahtml.version.txt` (`|v01.00w|`), `html-changelogs/spain-argentinahtml.changelog.md` + `spain-argentinahtml.changelog-archive.md`
- Registered the page in the README tree (Standalone Utilities group + html-versions/html-changelogs subtrees) and in REPO-ARCHITECTURE.md's flowchart (SPAINARG_PAGE node + serves/version-polling/template-copy edges; pako URL regenerated and decompression-verified)
- Verified via Playwright at two loop timestamps (~1.8s mid-play, ~4.2s GOAL flash); fixed an invalid `font:` shorthand (`inherit` family) found during the check by switching to explicit font-size/weight properties

## [v01.14r] — 2026-07-18 02:39:24 AM EST — [cc86b54](https://github.com/LightAISolutions/Sales/commit/cc86b54bfa3e65e51730eddecb14fe439587fbfd)

> **Prompt:** "In my Scraper project, remove the text box + submit button."

### Removed
- Scraper text-submission UI (`live-site-pages/Scraper.html` v01.04w): removed the text box + Submit button panel — the PROJECT-block CSS (`#text-submit-panel` and related rules), the panel markup, and the submit wiring JS (fetch `submitText` call, Enter-to-submit, inline status feedback). PROJECT START/END markers left in place (empty) for future page content. The GAS-side `submitText` route in `googleAppsScripts/Scraper/Scraper.gs` is intentionally retained unchanged (now unused) — removal not requested
- Verified via Playwright render check: page renders cleanly with no leftover panel or layout artifacts (the 5 pre-existing `file://` CSP logo-image refusals reproduce identically on the unmodified page)

## [v01.13r] — 2026-07-18 12:05:25 AM EST — [50449c4](https://github.com/LightAISolutions/Sales/commit/50449c4ba2dbaf36d2029a1aa8464bcfdbdf1670)

> **Prompt:** "In the Scraper project, create a text box with a submit button. When the user clicks submit, copy whatever they wrote in the text box into the spreadsheet."

### Added
- Scraper text submission feature (`live-site-pages/Scraper.html` v01.03w, `googleAppsScripts/Scraper/Scraper.gs` v01.04g): a top-center panel with a text box + Submit button in the page's PROJECT blocks (hidden behind the auth wall until sign-in; z-index 5 — above the GAS iframe, below all overlay walls). Submission goes over the iframe-free fetch transport to a new `PROJECT:`-marked `doPost action=submitText` route (with GET `api op=submitText` fallback) → `submitText()` in the PROJECT block, which validates the session via `validateSessionForData`, trims/caps input at 5000 chars, and appends `[timestamp, user email, text]` to `Live_Sheet` in the configured spreadsheet. Inline status feedback (Saving… / Saved ✓ / error), Enter-to-submit, button disabled while in flight
- Verified: GAS + HTML JS syntax parse, Playwright render check with simulated signed-in state (panel positioned correctly, no overlap with pills/overlays)

Developed by: LightAISolutions
## [v01.12r] — 2026-07-17 11:45:41 PM EST — [1d60d9f](https://github.com/LightAISolutions/Sales/commit/1d60d9f750f4b21a5e00240992bc65c5aafe15a6)

> **Prompt:** "I was able to pass the "Connect to server" issue from earlier, but i still cannot sign in. See attached screenshot."

### Fixed
- Embedded app screen blocked after successful fetch sign-in (Google Drive "Sorry, unable to open the file" inside the iframe + `action=securityEvent` 404 spam — the multi-account `/u/N` routing 404 hitting the remaining iframe loads): the `#gas-app` iframe and the hidden securityEvent frames are now created **credentialless** in `live-site-pages/MasterACL.html`, `Scraper.html`, `globalacl.html` (all v01.02w) and the auth HTML template — cookie-less iframes get Google's anonymous serving path (the same path verified working via server probes), while the session continues to travel in the `?session=` URL. Browsers without `credentialless` support ignore the attribute (prior behavior preserved). Flagged as a documented inference: anonymous serving, cookie removal, and anonymous GAS usage are each verified, but the combination inside a credentialless iframe is untested until the owner confirms in-browser

## [v01.11r] — 2026-07-17 10:05:56 PM EST — [c4d1bd3](https://github.com/LightAISolutions/Sales/commit/c4d1bd39eb9b7fa2846592e901e2bb46034234fa)

> **Prompt:** "Do the fetch conversion (your recommendation) AND address this: "The root-cause template defect (setup script generates `standard`-preset GAS against a hipaa-built HTML template) still awaits a permanent fix so future projects are born working" (your heads-up)."

### Added
- **Iframe-free `fetch` sign-in transport** ported from the `testauthgas1` scaffold into `live-site-pages/MasterACL.html` (v01.01w), `Scraper.html` (v01.01w), and `globalacl.html` (v01.01w): new `_gasPost()` (POST with GET `action=api` fallback), `exchangeViaFetch()`, `_mapExchangeError()`, `_completeSignInFetch()` (transport-verified direct show — no `gas-auth-ok` gate), plus fetch branches in `sendHeartbeat()`, the sign-out flow, and the page-load session restore (heartbeat-validated). `HTML_CONFIG.TOKEN_EXCHANGE_METHOD` → `'fetch'`. Cookie-less fetch always reaches Google's anonymous serving path, making the auth machinery immune to the blocked framed `/exec` responses (multi-account `/u/N` 404s, X-Frame-Options) that killed iframe sign-in in the owner's normal browser
- GAS routes for the transport in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.07g), `Scraper.gs` (v01.03g), `globalacl.gs` (v01.01g): `doPost action=exchangeToken` (with `ensureScriptProperties_()` bootstrap) and `action=signOut`, plus a general `doGet action=api` GET fallback (`exchangeToken`/`signOut`/`heartbeat` ops)

### Changed
- **Permanent template fix**: the same conversion applied to `live-site-pages/templates/HtmlAndGasTemplateAutoUpdate-auth.html.txt` and `gas-minimal-auth-template-code.js.txt` — future auth projects are born with the fetch transport, which no longer depends on the GAS preset's `TOKEN_EXCHANGE_METHOD`, dissolving the standard-vs-hipaa exchange mismatch permanently
- Template propagation note: `testauthgas1` (already the fetch reference) and `testauthhtml1` (intentionally the postMessage test scaffold) were left unchanged; the latent `processDataPoll` dead-route in the GAS template generation was left as-is (not referenced by the new routes)

### Verified
- Full-file JS syntax parse on all 4 GAS files and all inline script blocks of the 4 HTML files; Playwright `file://` smoke test on the 3 converted pages (only known file-protocol restrictions logged, zero code errors)

## [v01.10r] — 2026-07-17 09:22:12 PM EST — [489a824](https://github.com/LightAISolutions/Sales/commit/489a8249b496f5081e861611fda3c9b47f6687b1)

> **Prompt:** "@"/root/.claude/uploads/07152af2-7240-5bfb-8986-2eaa697523c9/af91e797-globalacl_working_sample_v01.89g.txt" See attached .txt file for a successful example. Compare this with my GAS code and update mine as needed to resolve my sign-in problem for "jonyang92@gmail.com". This example is being used for a different company, so scrub out anything specific and give me a working skeleton that can be applied to my GAS code."

### Changed
- Compared the uploaded working sample (globalacl v01.89g, other org) against our GAS code after scrubbing org-specific values: function inventories and the entire sign-in path are identical — the only functional configuration difference is that the working org runs `ACTIVE_PRESET: 'hipaa'`. Aligned `googleAppsScripts/MasterACL/MasterACL.gs` (v01.06g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.02g) to that proven skeleton: `ACTIVE_PRESET` → `'hipaa'`, `PROJECT_OVERRIDES` made byte-identical to the sample (`ENABLE_DOMAIN_RESTRICTION: false`, `ALLOWED_DOMAINS: []`, `SESSION_EXPIRATION: 7200`), removing the now-redundant `TOKEN_EXCHANGE_METHOD` override (hipaa's default is `postMessage`). The embedding HTML's own comments ("must match GAS PRESETS.hipaa...") confirm the auth HTML template was written for the hipaa preset — the setup script generating `standard`-preset GAS against it is the template defect. Session durations verified in sync both sides (7200/28800). The sample's `PROJECT:` doPost signOut wrapper was not ported (workspace-specific, unrelated to sign-in). Note: the browser-side multi-account `/exec` 404 (Google issue) remains — single-account session still required

## [v01.09r] — 2026-07-17 08:36:54 PM EST — [d726490](https://github.com/LightAISolutions/Sales/commit/d7264904ba3a82ef4d24ec76436f7710639ee986)

> **Prompt:** "I still cannot sign in as "jonyang92@gmail.com". Fix the problem."

### Fixed
- Sign-in timeout ("The sign-in service isn't responding") on MasterACL and Scraper: the auth HTML template hardcodes `TOKEN_EXCHANGE_METHOD: 'postMessage'`, but the GAS `standard` preset resolves it to `'url'` — the served shell had no postMessage token listener, so the OAuth token exchange never completed and the 25s reachability watchdog fired. Confirmed by probing the live `/exec` deployment (healthy, serving current code, correct `gas-needs-auth` handshake — ruling out deployment/OAuth-access causes). Fix: `TOKEN_EXCHANGE_METHOD: 'postMessage'` added to `PROJECT_OVERRIDES` in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.05g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.01g) — the combination the working hipaa-preset projects (Globalacl, test pages) already use. Latent template defect noted: every future `standard`-preset auth project inherits this mismatch until the GAS template or setup script aligns the two sides

## [v01.08r] — 2026-07-17 08:10:18 PM EST — [f54c4cc](https://github.com/LightAISolutions/Sales/commit/f54c4cc33d0f6aeb9ed6a2101bbb0195bb3a0304)

> **Prompt:** "The first screenshot is the error message I get when I try to sign in with "jonyang92@gmail.com" and the second screenshot is an example of a successful Master ACL sheet. Modify the "grantUserAccess" function to resolve the first problem and modify my Master ACL sheet to look like the second screenshot."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.04g): `grantUserAccess()` reworked into a three-phase utility. Phase 1 (STRUCTURE) verifies/repairs the Master ACL spreadsheet to match the reference layout — creates the Access tab if missing, writes `Email`/`Role` headers, adds the `#NAME`/`#URL`/`#AUTH`/`#ICON`/`#DESC` metadata rows via `ensureMetadataRows`, creates a `Roles` tab with the default permission matrix (new `ensureRolesTab_` helper, checkboxes included), and registers this project's page column. Phase 2 (GRANT) unchanged — default admin grants for the two owner emails. Phase 3 (WEB APP PROBE) initializes required Script Properties then fetches the project's own `/exec` URL and logs a precise verdict — the page's "sign-in service isn't responding" watchdog fires when the deployment doesn't serve the app, so the probe distinguishes healthy / access-not-Anyone / stale-or-empty-deployment (with click-by-click fix instructions)

## [v01.07r] — 2026-07-17 07:47:16 PM EST — [21a2c40](https://github.com/LightAISolutions/Sales/commit/21a2c407b143e02dc422b0a3c95f75878dfe5761)

> **Prompt:** "GAS is telling me: "No emails specified. Set Script Properties key "GRANT_ACCESS_EMAILS" (single email or comma-separated list), optionally "GRANT_ACCESS_ROLE", then Run again." Make it so I don't have to do this. Add "jonyang92@gmail.com" and "lightaisolution@gmail.com"."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.03g): `grantUserAccess()` no longer requires Script Properties — when `GRANT_ACCESS_EMAILS` is unset it falls back to built-in defaults `DEFAULT_GRANT_EMAILS` (`jonyang92@gmail.com`, `lightaisolution@gmail.com`) with `DEFAULT_GRANT_ROLE` (`admin`). Script Properties still override the defaults when set, for granting other users/roles

## [v01.06r] — 2026-07-17 07:42:23 PM EST — [f5e213d](https://github.com/LightAISolutions/Sales/commit/f5e213dcfe99813f70e42afdef0e5660780a0c0b)

> **Prompt:** "No one has permissions to access these projects right now. Make a function that I can run that allows new users to get permission."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.02g): new `grantUserAccess()` admin utility in the PROJECT block — run from the Apps Script editor with Script Properties `GRANT_ACCESS_EMAILS` (single or comma-separated) and optional `GRANT_ACCESS_ROLE` (default `viewer`). Appends Access-tab rows for new users (role + TRUE for every page column, with checkboxes), re-enables all page columns for existing rows (role updated only when explicitly set), validates the role against the known role list with a warning, and bumps the access-cache epoch so grants take effect immediately. One run grants access to every registered project since all auth projects share the central Master ACL spreadsheet

## [v01.05r] — 2026-07-17 07:37:12 PM EST — [d45e3de](https://github.com/LightAISolutions/Sales/commit/d45e3de1ca94fc50717cc17572338d3a05ec9c8f)

> **Prompt:** "I can't sign into my MasterACL project with my personal email (jonyang92@gmail.com) because permissions are not set by my work email (lightaisolution@gmail.com). Autocreate the admin permissions for my personal email."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.01g): new `PROJECT OVERRIDE` block with `SEED_ADMIN_EMAILS` (`jonyang92@gmail.com`) and an idempotent `ensureSeedAdmins()` called from `doGet` — appends an `admin`-role row with all page columns TRUE to the Access tab when the email is missing, bumps the access-cache epoch so cached denials clear immediately, and never touches existing rows (manual spreadsheet edits always win). Runs server-side as the deployment owner, so it works even though the visiting user has no spreadsheet access

## [v01.04r] — 2026-07-17 07:18:01 PM EST — [500a4fe](https://github.com/LightAISolutions/Sales/commit/500a4fe7d1346adb8e747edf0a0879fd8e7277bc)

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "Scraper",
>   "TITLE": "News Scraper",
>   "DEPLOYMENT_ID": "AKfycby8nOR0AqLsDlZPcrTX9dWIInY48R9Jrl8oBDtN5t0emC06j7iwidEMdXttrD1zXnjUIg",
>   "SPREADSHEET_ID": "19U0Wu25eUXEHPVz4VWjKQIpnRozgFycNSjFCTB-umkk",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **Scraper** (News Scraper — auth-enabled, `standard` preset) created via `scripts/setup-gas-project.sh`: `live-site-pages/Scraper.html` (v01.00w), `googleAppsScripts/Scraper/Scraper.gs` (v01.00g), `Scraper.config.json` with real deployment/spreadsheet IDs and Master ACL registration, version files, page/GAS changelogs + archives, and `repository-information/diagrams/Scraper-diagram.md` (with verified mermaid.live link)
- `Deploy Scraper` webhook step added to `.github/workflows/auto-merge-claude.yml`; Scraper registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges — all script-generated with no manual repair needed (v01.03r script fixes verified in production)

### Changed
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to include the new Scraper nodes (verified by decompression)

## [v01.03r] — 2026-07-17 07:11:12 PM EST — [5a48862](https://github.com/LightAISolutions/Sales/commit/5a48862bc3638618103768d8c206e3c338f71b7a)

> **Prompt:** "fix the setup script defects"

### Fixed
- `scripts/setup-gas-project.sh` Phase 6: the GAS Projects registration row was appended after the last `|`-prefixed line in the whole file (landing in the coding-guidelines pointer table) — now anchors on the `| Project | Code File |` header and inserts after the last contiguous row of that table
- `scripts/setup-gas-project.sh` Phase 9: the workflow deploy step anchored on a `# ── AHK VERSION FILE UPDATE ──` banner comment that no longer exists, silently skipping the insert — now anchors on the stable `- name: Update AHK version files` step name
- `scripts/setup-gas-project.sh` Phase 5b: generated per-environment diagrams lacked the mandatory "Open in mermaid.live" link — the script now generates the pako URL via `python3` (zlib is pako-compatible) with round-trip verification and a warning fallback when Python is unavailable
- All three fixes verified end-to-end against a throwaway repo copy (row placement, workflow step position, link decompression)

## [v01.02r] — 2026-07-17 06:55:07 PM EST — [63a7038](https://github.com/LightAISolutions/Sales/commit/63a70386a6a3a99c405d7ddc2aa284a185a270e2)

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "MasterACL",
>   "TITLE": "MasterACL",
>   "DEPLOYMENT_ID": "AKfycbxgxErSg_DfV7WjVvDQ4_LVkFAkON-86iJaNhQ3k50Hs-WbQ2KLskfRtnzSVlZNIHhc8Q",
>   "SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "IS_MASTER_ACL": true,
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **MasterACL** (auth-enabled, `standard` preset, flagged as the Master ACL project) created via `scripts/setup-gas-project.sh`: `live-site-pages/MasterACL.html` (v01.00w), `googleAppsScripts/MasterACL/MasterACL.gs` (v01.00g), `MasterACL.config.json` with real deployment/spreadsheet IDs, version files, page/GAS changelogs + archives, and `repository-information/diagrams/MasterACL-diagram.md`
- `Deploy MasterACL` webhook step added to `.github/workflows/auto-merge-claude.yml` (the setup script announced this step but never wrote it — added manually, mirroring the Globalacl step)
- MasterACL registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges

### Fixed
- Setup script defect: the GAS Projects table row was inserted into the coding-guidelines pointer table in `.claude/rules/gas-scripts.md` — moved to the actual GAS Projects table
- Added the missing "Open in mermaid.live" link to `MasterACL-diagram.md` and regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (both verified by decompression)

## [v01.01r] — 2026-07-13 08:28:42 PM EST — [0c1f7bf](https://github.com/LightAISolutions/Sales/commit/0c1f7bfb27564bdc4913fecdf9cd3626c423d01c)

> **Prompt:** "continue with your recommendation"

### Changed
- Initialized repository identity: internal links, branding URLs, and live-site references updated from the template's `lightaisolutions` repo name to `Sales` across README.md, CITATION.cff, issue template config, REPO-ARCHITECTURE.md, index.html, sitemap.xml, and robots.txt (`bash scripts/init-repo.sh LightAISolutions Sales ShadowAISolutions` + manual follow-ups; developer branding `ShadowAISolutions` preserved)
- GAS Project Creator page defaults now point to this repository — GitHub Repo field prefills `Sales` and the three logo URL fields prefill `https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg` (v01.01w)
- Regenerated `repository-information/readme-qr-code.png` to encode this repository's URL (`https://github.com/LightAISolutions/Sales`)
- Updated CLAUDE.md Template Variables table: `YOUR_REPO_NAME` → `Sales`

### Fixed
- Corrected GitHub Pages hostnames mangled by the init script's global replace — the template's org and repo share the same lowercase string, so `lightaisolutions.github.io` became `Sales.github.io` in CITATION.cff, README.md, and REPO-ARCHITECTURE.md; restored to `lightaisolutions.github.io` (paths correctly remain `/Sales/`)
- Removed the duplicate `main` push-trigger entry the init script inserted into `.github/workflows/auto-merge-claude.yml` (this copy already had `main` in the trigger)
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (verified decompression)

Developed by: LightAISolutions
