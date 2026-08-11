# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-08-10 08:54:11 PM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v02.31r

**What was done:**
- Amazon dossier revised to profileVersion 2 — added the supply-chain read answering "which BESS OEM does AWS use?": three confidence-tagged `strategyRead` entries ((High) the three-layer storage-procurement distinction; (Low) the Samsung SDI BBU thread — ~$700M AWS UPS talks + Simplo-shipped BBU cells, neither company-confirmed; (Low) the Fluence-at-Bellefield untested inference from AES's ~28% Fluence stake); six new sources added chronologically; v1 archived per the Archival Procedure; registry `lastUpdated` synced (v02.31r)

**Where we left off:** All changes committed and merged to main

**Active context:**
- No TODO items, no active reminders
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- Standing recommendation from the v02.24r session remains open: generate the AIDC market report from the 40-company dossier set

## Previous Sessions

**Date:** 2026-08-10 05:13:33 AM EST
**Repo version:** v02.30r

**What we worked on (v02.25r → v02.30r — the voice meeting-notes app, capture half):**

The developer asked for a note-taker that transcribes meetings from phone audio, identifies speakers, generates exportable meeting notes, and files a copy into the Profiler field notes of the company met with. We planned the whole thing, then **built and shipped the entire capture half**. Transcription, speaker ID, and note generation are still unbuilt.

- **v02.25r (M3 + M5)** — Field notes migrated from the public repo to Drive. `profiler-notes.json` + `note-files/<slug>/` now live in the script owner's Drive behind the Master ACL; the three GitHub issue-form intake files were deleted (they committed notes into a repo proven public by an unauthenticated `raw.githubusercontent.com` fetch). Added `getNoteForClaude`/`getPendingNotesForClaude` + 📋 Copy buttons as the replacement for the automated note read, and the browser-side meeting-recording upload
- **v02.26r** — Recording upload failed with `google_sign_in_unavailable`: `ovDriveToken` checked `window.google` directly, but GIS is injected on demand by the sign-in flow, which never runs on a page load with an existing session. Routed through `ovLoadGis()`. Also found by tracing that CSP `connect-src` was missing `googleapis.com` — would have failed next attempt
- **v02.27r** — Answered the "picker caps at 10:27" question (that's Android's inline capture path, not the Voice Recorder app) and rewrote the button + hint to steer to recording in the standalone app. More importantly: replaced the single-shot multipart upload with **Drive resumable chunking** (8 MB chunks, 3 retries each, XHR so 308 responses are readable and `upload.onprogress` gives real progress) — a 2-hour file is ~112 MB and the old path restarted from zero on any blip
- **v02.28r** — Upload hung on "Uploading…" forever with **no consent screen**. Root cause: `requestAccessToken()` was called from an async continuation (inside `ovLoadGis().then()`, inside the picker's `change` handler), by which point transient user activation is gone and mobile browsers silently block the popup. Moved consent to the button's `click` handler; added the missing `error_callback` (GIS reports popup failures *only* there) and a 120 s watchdog + upload abort timeout so nothing can hang silently again
- **v02.29r** — Built a `meeting-recordings/` tree with GAS `DriveApp`. **Wrong Drive** — see below
- **v02.30r** — Drive search proved no `Profiler` folder existed in the developer's account at all. `DriveApp` acts as the account that *deployed* the web app, not the signed-in user, and those differ here. Rebuilt the tree **browser-side** with `drive.file`, mirroring how Receipts creates `Receipts App/`. Removed the six v01.07g GAS Drive helpers and their three ops; the script now only parks folder IDs (`recfolders`/`setrecfolders`) because `drive.file` cannot re-find its own folders across sessions

**Where we left off:**
- **Capture is verified end-to-end on real hardware.** The developer uploaded a 12m 30s / 11.7 MB clip: it crossed the 6 MB threshold so the **resumable chunked path ran for real**, showed a climbing percentage, landed in the right folder as `catl--2026-08-10--…`, and the post-upload sweep relocated the earlier stray as `unfiled--2026-08-10--…`. Confirmed independently via Drive search (both files share parent `1wZKAOw…`)
- The climbing percentage proves three previously-unverified things: Google exposes the resumable session `Location` header to browser JS, the 308 handshake parses correctly, and chunk PUTs authorize off the session URL alone (so token expiry mid-upload is harmless)
- Measured bitrate **131 kbps** → 1 hour ≈ 56 MB / 8 chunks, 2 hours ≈ 112 MB / 15 chunks. A drop costs ≤8 MB (~7%)
- Everything pushed and auto-merged; working tree clean

**Key decisions made:**
- **Free-first**, record on phone / transcribe on computer (A54, 6 GB RAM)
- **Notes serve from GAS + Drive, not Pages** — the developer explicitly accepted sacrificing the unattended Monday triage Routine to get this, since an unattended session can no longer read the log. Replacement is the 📋 Copy pending button, pasted in manually
- **Confidence is a one-tap question on save: 55** (forward-looking/competitive) **or 80** (observable/factual)
- All five speaker-training accelerations approved for Build B: company scoping, confidence-gated auto-accept, skip enrollment, auto-detect self, self-tuning threshold
- **Two Drive trees, split by ownership** — notes stay in the deployer's Drive (the backend must read them server-side); recordings go in the user's own Drive (they browse those). This is architectural, not cosmetic
- `accept` stays `audio/*` deliberately — an extension list would grey out any container it missed (hard block) to avoid a picker shortcut the hint already steers around

**Active context:**
- Branch `claude/voice-meeting-notes-app-ddgbxb` (deleted from remote after each auto-merge; recreate by pushing)
- Repo v02.30r · Profiler v01.24w · v01.08g · 9 tracked pages all 🟢 · CHANGELOG counter 91/100
- Toggles: START_OF_RESPONSE_BLOCK On · CHAT_BOOKENDS Off · TIMING_ESTIMATES On · END_OF_RESPONSE_BLOCK On · MULTI_SESSION_MODE Off
- No TODO items, no active reminders
- Test scripts kept in the session scratchpad (resumable chunking, consent failures, folder creation, note form) — all four passing at v01.24w
- **Known gaps, none blocking:** no resume across page reload (session URL is in-memory only — a backgrounded tab restarts a 112 MB upload); `ovDriveRetryChunk` never exercised against a real network error; the developer's Apps Script deployment runs as an account that is not jonyang92@gmail.com, which is why the notes log isn't in their Drive either

**Recommendation for next session:**
- **Run the transcription spike before writing any Build A code** — load Whisper in the browser on the developer's computer, transcribe the saved 12m 30s clip, and time it. That one measurement decides the architecture: faster than real time means in-browser transcription is viable and the app stays free; several times slower means a 2-hour meeting becomes an overnight job and AssemblyAI's free tier (10 hrs/month + $50 credit, diarization +$0.02/hr) should be priced instead. Building UI before that result risks throwing it away
- **To continue:** type `run the transcription spike`

Developed by: ShadowAISolutions
