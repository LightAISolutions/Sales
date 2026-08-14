# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-08-13 03:45:45 AM EST
**Repo version:** v02.36r

**What we worked on — the voice meeting-notes app, capture + transcription now working end to end:**

This long session designed the app the developer asked for (transcribe meetings from phone audio → identify speakers → generate exportable meeting notes → file into the Profiler field note of the company met with) and got the first two thirds of it **working on real hardware**.

- **v02.25r–v02.30r (earlier in the session)** — field notes migrated from the public repo into Drive behind the Master ACL; the GitHub issue-form intake deleted; browser-side meeting-recording upload built and then debugged through four real-device failures: GIS not loaded on a resumed session, missing `googleapis.com` in CSP, the Android picker's ~10-minute inline-capture cap, a silent hang caused by requesting Drive consent from an async continuation (fixed by moving it onto the button's click handler + adding the missing `error_callback` + a watchdog), and finally a folder tree built in the **wrong Drive** — `DriveApp` acts as the account that *deployed* the web app, not the signed-in user, so the tree was rebuilt browser-side with `drive.file`, mirroring `Receipts App/`
- **v02.35r** — **File transcript** control in the note box: one pick uploads the `.vtt` into `2-transcribed/`, moves its recording out of `1-awaiting-transcription/` to join it (matched by filename stem via `ovBaseName`), and attaches the same file to the note. New helpers `ovFileTranscript` / `ovDriveList` / `ovDriveMove`; `pendingFiles()` merges the transcript into the note's attachments, de-duplicated by name+size
- **v02.36r** — `scripts/transcribe.ps1`, the local Whisper launcher. **Confirmed present on `main`** (67 lines, merged as `e21f497`)

**Transcription resolved differently than planned.** The developer disclosed an **RTX 4090** mid-session, which killed the browser-vs-paid-API question the spike existed to answer — native is both free and much faster. So Whisper runs on their PC via `whisper-ctranslate2` (`large-v3-turbo`, `--device cuda --compute_type float16 --vad_filter True --language en`, VTT out) and the app just accepts the transcript. Build A shrank from "run Whisper in the app" to "already done".

**Setup gotchas, all solved and encoded in the launcher** (worth not rediscovering): Python **3.12**, not 3.14 — ctranslate2 has no Windows wheel for 3.14; PowerShell execution policy needed `RemoteSigned` for the venv activator; and `RuntimeError: Library cublas64_12.dll is not found` because pip puts CUDA DLLs in `site-packages\nvidia\**\bin`, which Windows does not search — the launcher prepends those folders to `PATH`.

**Where we left off — verified on real hardware:**
- Record (phone) → attach → own-Drive folder → transcribe (4090) → **File transcript** → note. Run twice: the CATL clip (12m 30s, 11.7 MB) and the Hithium clip, the second one dragged onto the launcher window
- The 11.7 MB upload crossed the 6 MB threshold and showed a **climbing percentage**, which proves the resumable chunked path works against real Drive: the session `Location` header is CORS-exposed, the 308 handshake parses, and chunk PUTs authorize off the session URL alone
- Measured **131 kbps** → 1 hour ≈ 56 MB / 8 chunks, 2 hours ≈ 112 MB / 15 chunks; a dropped connection costs ≤8 MB
- Everything pushed and auto-merged; working tree clean

**Where this sits in the overall plan:**

| Part | State |
|---|---|
| Capture (record → Drive) | **Done**, verified twice on hardware |
| Build A — transcription | **Done**, natively rather than in-app |
| Build B — speaker ID | **Not started.** Whisper does not diarize; transcripts are one unlabeled run of text |
| Build C — meeting notes + export | **Not started.** No structured document, no Word/PDF export |

**Key decisions made:**
- **Native GPU transcription over in-browser** — the 4090 makes the browser path strictly worse for long meetings. In-app transcription stays possible later for machines without a GPU, but is not the primary path
- **Two Drive trees, split by ownership** — notes stay in the deployer's Drive (the backend must read them server-side); recordings and transcripts live in the user's own Drive under `Profiler App/`, because those are what the developer browses
- `scripts/transcribe.ps1` is versioned deliberately: it is the spec Build A must match if the app ever absorbs transcription, and it is readable by future sessions that cannot see the developer's PC. It is **not** auto-installed — copy it to `%USERPROFILE%\whisper\` after changes
- Confidence, notes storage, and the five speaker-training accelerations (company scoping, confidence-gated auto-accept, skip enrollment, auto-detect self, self-tuning threshold) all still stand as approved earlier

**Active context:**
- Branch `claude/voice-meeting-notes-app-ddgbxb` (deleted from remote after each auto-merge; recreate by pushing)
- Repo v02.36r · Profiler v01.25w · v01.08g · 9 tracked pages all 🟢 · CHANGELOG counter 97/100 — **rotation fires soon**
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders
- **Open gaps, none blocking:** (a) the approved **one-tap 55/80 confidence question was never built** — the form still shows a 0–100 dropdown in steps of 5; (b) no resume across page reload for a long upload (session URL is in-memory only); (c) `ovDriveRetryChunk` never exercised against a real network error; (d) the Apps Script deployment runs as an account that is not jonyang92@gmail.com, which is why the notes log is not in their Drive
- Parallel sessions are active on this repo (an AIDC market report landed mid-session). **Commit before rebasing, never `git stash pop` across a moved base** — a stash pop silently left conflict markers that got committed this session and had to be reset before pushing

**Recommendation for next session:**
- **Build B — speaker identification.** It is the largest remaining gap and the one the developer will feel immediately: right now a meeting transcript is a single wall of text with no idea who said what, which makes the generated meeting notes in Build C impossible to attribute. Start by deciding where diarization runs — the same 4090 via `pyannote` bolted onto `scripts/transcribe.ps1` is the natural fit given transcription already lives there, and it can label the `.vtt` before it is ever uploaded. Then layer the five approved training accelerations on top
- **To continue:** type `start build B — speaker identification`
