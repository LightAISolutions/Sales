# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-08-10 10:25:20 PM EST
**Repo version:** v02.32r

**What we worked on (v02.32r — the AIDC market report):**
- Generated **`repository-information/AIDC-MARKET-REPORT.md`** (251 lines, 9 sections) — the sales-strategy deliverable the 40-company Profiler expansion was built for, synthesized **exclusively from the dossiers with zero new research**
- Method (documented in the report's §9): 8 parallel extraction agents read all 40 dossiers → 572 source-tagged themed claims (40/40 coverage) → single-author synthesis → 4 adversarial verifier agents checked 353 report claims against the dossiers (6 errors + 14 nitpicks, all fixed pre-commit)
- Structure: 12 confidence-tagged Key Judgments; demand backdrop (~$735–760B big-four capex, GW-denominated demand, circular-financing risk); the five requested themes (turbine/transformer scarcity economics, behind-the-meter power with xAI/Crusoe as templates, the 800 VDC transition, BESS competitive dynamics, craft-labor bottleneck); a sales playbook (40-company account map, theme-keyed talk tracks, timing triggers wired to the armed refresh Routines, pipeline risks); method/citation notes. Every fact cites its dossier source label + publication date; `strategyRead`-derived items are labeled [Analysis] with dossier confidence tags preserved
- Session start also auto-reconstructed stale session context (v02.30r → v02.31r) per the checklist

**Where we left off:**
- v02.32r pushed and auto-merged to main; working tree clean; the report is deliberately **not deployed** (lives in `repository-information/` like study-prep — sales-sensitive content)
- Two container restarts hit mid-verification; the Workflow journal-cache resume recovered both times losslessly

**Key decisions made:**
- Report location: `repository-information/`, not the Profiler app — rendering it in-app would be a new feature decision (schema + renderer), not a file move
- §8.3's earnings-calendar dates are labeled as coming from the armed Routine schedule (operational data), not dossier content — a verifier catch, kept as a standing convention
- Ranking claims always name the ranking body (Wood Mackenzie vs Benchmark vs InfoLink vs SNE differ) — carried into the report's §9 as a customer-facing rule

**Active context:**
- Branch `claude/aidc-market-report-tdwz5g` (deleted from remote after each auto-merge; recreate by pushing)
- Repo v02.32r · Profiler v01.24w · v01.08g · 9 tracked pages all 🟢 · CHANGELOG counter 93/100
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders
- Near-dated: Sinexcel H1 report due 2026-08-11; its one-shot refresh Routine fires 2026-08-12 (fresh session); Megmeet H1 08-27 is the report's other big checkpoint

**Recommendation for next session:**
- **Update the report with Sinexcel H1** — after the 08-12 refresh Routine lands the H1 2026 disclosure in the Sinexcel dossier, fold the first-AIDC-revenue read into `AIDC-MARKET-REPORT.md` §5.4 and §8.3. It is the nearest-dated fact that materially changes the report, and it exercises the §9 maintenance loop for the first time
- **To continue:** type `update the report with Sinexcel H1`

Developed by: ShadowAISolutions
