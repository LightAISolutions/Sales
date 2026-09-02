# Changelog Archive — Profiler

Archived changelog sections rotated from [Profilerhtml.changelog.md](Profilerhtml.changelog.md).

## [v01.29w] — 2026-08-17 08:36:32 PM EST — v02.64r — [9326148](https://github.com/LightAISolutions/Sales/commit/93261486e9ccea0ab47d76615dd15ee0b335cbc9)

### Added
- **Transcripts you have already transcribed are now picked up for you.** Opening the notes log checks your "2-transcribed" folder and lists any meeting transcript that has not been written up yet. Choose a confidence rating once, press one button, and every waiting transcript is filed against the right company and written up in turn
- Each pending transcript is shown with the company it will be filed under **before** you commit to importing, so a mis-named file is visible rather than quietly filed in the wrong place. A file whose name does not match a company you cover is filed under General instead of being skipped
- Progress is reported per file while the batch runs, so a long transcript no longer looks like a stall

### Fixed
- The write-up and copy-with-transcript buttons no longer appear on notes whose attachment is a Word or PDF document. Those buttons could never work on such a note, and pressing one always failed
- A folder that cannot be checked now says so, instead of looking identical to having nothing new to import

## [v01.28w] — 2026-08-17 02:34:37 AM EST — v02.56r — [6762fd6](https://github.com/LightAISolutions/Sales/commit/6762fd62fc42f36d33dbf3061edfb74653d4d8de)

### Changed
- When sign-in cannot reach the access list, the message now says **which** part is at fault instead of giving the same wording for every cause, and it includes a short code you can quote when reporting it
- A retry is only suggested when the problem is genuinely temporary. A structural problem with the list now says plainly that it will not clear on its own and needs an administrator, rather than inviting you to keep trying

## [v01.27w] — 2026-08-17 02:10:00 AM EST — v02.54r — [4832a48](https://github.com/LightAISolutions/Sales/commit/4832a488b385fc40ff070724181c18fab99582f2)

### Fixed
- A brief interruption while the app was checking your access no longer appears as "Access denied". Sign-in now says it is a temporary service problem and asks you to try again, instead of turning you away with a message that suggests your access had been removed
- After one of these interruptions, sign-in works again as soon as the service recovers rather than staying blocked for the next several minutes
- Retrying during an interruption no longer counts toward the failed-attempt limit, so a service hiccup can no longer escalate into a temporary lockout

## [v01.26w] — 2026-08-13 04:34:03 AM EST — v02.37r — [09f990c](https://github.com/LightAISolutions/Sales/commit/09f990cfd3ee8cc87516087965ebe0c58ed07bf1)

### Added
- Filing a transcript with a note now writes the meeting up for you. Instead of a placeholder that waited for a later pass, the note comes back as a short summary, what was discussed, what the customer signalled, action items and open questions — readable and copyable within about a minute of saving
- A **✨ Summarize** button on any note that has a transcript attached. Use it to write up notes filed before this existed, or to retry if the first attempt did not finish
- The note log shows the date a note was written up from its transcript

### Changed
- Notes that run to several lines now keep their line breaks in the log and in the manage panel, instead of collapsing into a single block of text
- If the write-up step does not complete, the note and its transcript are still saved — the status message says so and points at the retry button

## [v01.25w] — 2026-08-13 03:01:32 AM EST — v02.35r — [c8928a4](https://github.com/LightAISolutions/Sales/commit/c8928a46200a887002eb9c079cb9062c9a48db7b)

### Added
- A **File transcript** button in the note box. Once you have transcribed a recording on your own computer, pick the transcript here and it is saved into the "transcribed" folder, the recording it belongs to moves out of the waiting folder to join it, and the transcript is attached to the note you are writing — all from the one selection

## [v01.24w] — 2026-08-10 04:42:24 AM EST — v02.30r — [ecaf52f](https://github.com/LightAISolutions/Sales/commit/ecaf52f)

### Fixed
- Meeting recordings now go into a **Profiler App** folder in your own Google Drive, matching how the receipts app names its folder. The previous version put them somewhere you had no way to reach

### Changed
- Recordings are placed in the right folder as they upload, rather than landing loose and being tidied up afterwards
- Any recordings still sitting loose in your Drive are moved into the folder the next time you attach one, and the status line tells you how many were moved

## [v01.23w] — 2026-08-10 04:25:55 AM EST — v02.29r — [5d41ecb](https://github.com/LightAISolutions/Sales/commit/5d41ecb)

### Changed
- After a recording uploads, the status line now tells you exactly where it was put away rather than just saying "attached"
- Any recordings left loose from an earlier session are tidied away when you open the note box, and you are told how many were moved

## [v01.22w] — 2026-08-10 04:13:24 AM EST — v02.28r — [157fc95](https://github.com/LightAISolutions/Sales/commit/157fc95)

### Fixed
- Attaching a recording could sit on "Uploading…" forever with no Drive permission prompt ever appearing. Permission is now requested the moment you tap the button, which is when your browser will actually allow the prompt to open
- If the permission window is blocked, dismissed, or never comes back, the status line now says so and invites you to tap again — previously nothing was reported and the upload appeared to stall indefinitely
- An upload that stops responding is now cancelled and reported instead of hanging

## [v01.21w] — 2026-08-10 04:01:03 AM EST — v02.27r — [37ac866](https://github.com/LightAISolutions/Sales/commit/37ac866)

### Changed
- Long meeting recordings now upload reliably. A file of any length is sent in pieces, so a dropped signal costs only the piece in flight instead of restarting the whole upload, and the button now shows a percentage while it works
- The recording button reads "Attach saved recording" and explains the flow: record in your phone's own voice recorder app, which has no length limit, then browse to the saved file. The record shortcut offered inside the file picker stops at about ten minutes and is not the way to capture a full meeting

## [v01.20w] — 2026-08-10 03:38:54 AM EST — v02.26r — [7404577](https://github.com/LightAISolutions/Sales/commit/7404577)

### Fixed
- Attaching a meeting recording failed for anyone already signed in — the upload now works without needing to sign in again
- Note confirmations no longer say the log updates after a short delay; notes appear in the log immediately

## [v01.19w] — 2026-08-10 02:17:53 AM EST — v02.25r — [ebd7804](https://github.com/LightAISolutions/Sales/commit/ebd7804)

### Changed
- Field notes are now private — they are kept in your own Google Drive and shown only after you sign in with an approved account

### Added
- Copy buttons on every note, plus a copy-all for untriaged notes, put a note and its transcript on your clipboard in one tap
- Attach a meeting recording to a note straight from your phone or computer
- Transcript files can be attached alongside Word and PDF notes

Developed by: LightAISolutions
## [v01.18w] — 2026-08-09 11:18:02 PM EST — v02.24r — [a288645](https://github.com/LightAISolutions/Sales/commit/a288645799c20d80924396004fd6c47b6b357506)

### Changed
- Source citations now show each article's publication date instead of the date it was looked up, in the dossier view and in exported documents
- Sources are now listed chronologically with the most recent news first; undated reference pages appear at the end

## [v01.17w] — 2026-08-09 05:09:33 AM EST — v02.19r — [3b7949d](https://github.com/LightAISolutions/Sales/commit/3b7949db9a12b54e84f565e65afb75f6543c3782)

### Fixed
- PDF exports no longer show the page name in the top corner or the web address in the bottom corner — exported documents are now clean, with proper page margins built into the document itself

## [v01.16w] — 2026-08-09 04:30:58 AM EST — v02.17r — [0312e54](https://github.com/LightAISolutions/Sales/commit/0312e545ac0f61be92bcf499fdfa7e9af46e23ec)

### Added
- Dossier styles — five presentation styles (Default, Bloomberg, Equity Research, Intel Briefing, Smart Brevity) that change section titles, typography, and spacing throughout the app **and** in the exported Word/PDF documents, so the export always matches the on-screen style
- Style switcher for the app owner — a 🖋 button opens a picker to change the style; the choice applies on that device

### Changed
- Dossiers now display in the **Intel Briefing** style by default — briefing-style section titles (Background, Key Judgments, Technical Annex), numbered analytical judgments, and a typewriter-style export document

## [v01.15w] — 2026-08-09 03:29:35 AM EST — v02.15r — [62c6809](https://github.com/LightAISolutions/Sales/commit/62c6809b0e96a40687dd56ed3af435f593786715)

### Added
- Sign-in required — the app now asks for a one-time Google sign-in before anything is shown; access is limited to approved users

### Changed
- Previous dossier versions (the "Versions 🕘" browser) are now visible to the app owner only — everyone else sees the current version of each dossier

## [v01.14w] — 2026-08-09 03:03:41 AM EST — v02.14r — [7e089a7](https://github.com/LightAISolutions/Sales/commit/7e089a7ade424c8dbbfaac897e164901d7426307)

### Added
- Team-ready field notes: signed-in team members can now suggest notes — type what you learned, attach Word/PDF files, and rate your confidence; suggestions go to the app owner for review instead of publishing directly. Full note management remains reserved for the owner

## [v01.13w] — 2026-08-09 02:37:16 AM EST — v02.12r — [f9ef3e0](https://github.com/LightAISolutions/Sales/commit/f9ef3e0f578a759bca123d4889c574ee74803a54)

### Fixed
- The field-note form now works on phones where it previously showed an "unable to open the file" error — the form is built into the page itself instead of loading an embedded frame

### Changed
- Sign in with Google directly in the note box (one time); then type notes, attach Word/PDF files, and manage existing notes — all in place

## [v01.12w] — 2026-08-09 02:20:26 AM EST — v02.11r — [cdb8c74](https://github.com/LightAISolutions/Sales/commit/cdb8c74052b1acfed8e94f06a0ebb78965e9a29e)

### Fixed
- The field-note form failed to load inside the note box on some phones ("unable to open the file" error) — the box now loads the form in a way that avoids that failure

### Added
- "Open the note form in its own tab" link under the note box — a full-screen fallback that always works

## [v01.11w] — 2026-08-09 01:30:51 AM EST — v02.09r — [829f7e0](https://github.com/LightAISolutions/Sales/commit/829f7e0cb8fe2a7f17daa660f2a7e9894cf35a4d)

### Changed
- The in-app field-note box is now live — the "Add a Field Note" section saves typed notes and Word/PDF uploads directly inside the app (one-time Google sign-in)

## [v01.10w] — 2026-08-09 01:11:29 AM EST — v02.08r — [3c30acd](https://github.com/LightAISolutions/Sales/commit/3c30acd618ed609af1274204e2bce0290e5581c1)

### Added
- The "Add a Field Note" box can now save notes and upload Word/PDF files directly inside the app — type, attach, and save in one place with a one-time Google sign-in (activates once the backend is connected; until then the box keeps its current behavior)

## [v01.09w] — 2026-08-08 10:36:20 PM EST — v02.07r — [58d0d4e](https://github.com/LightAISolutions/Sales/commit/58d0d4eebd8a5c1c375bca27fc11636924928b87)

### Added
- "Field note 📝" button at the top of every dossier — one tap jumps straight to the note box (previously it was easy to miss at the bottom of long dossiers)
- "Upload Word/PDF 📎" button in the note box — opens a form where you attach your meeting-notes document; the file is stored and a log entry is created automatically
- "📎 File" shortcut in the Field Notes changelog header for uploading a document without opening a dossier

### Changed
- Two test entries were removed from the Field Notes log

## [v01.08w] — 2026-08-08 10:11:17 PM EST — v02.04r — [baf1388](https://github.com/LightAISolutions/Sales/commit/baf1388004f57a040e536afbd684b813dbef5b81)

### Added
- "Add a Field Note" box at the bottom of every dossier — type what you learned, pick how you learned it and your 0–100 confidence, and save in one tap

### Changed
- The "＋ Add note" button in the Field Notes changelog now opens the same streamlined note form

## [v01.07w] — 2026-08-08 07:36:43 PM EST — v01.99r — [ebb8720](https://github.com/LightAISolutions/Sales/commit/ebb8720a26d61049557381f6e9c4d2f67dc7f32d)

### Added
- Dossier version history — companies with archived dossier versions show a "Versions 🕘" button; browse any previous version as a clearly-labeled historical snapshot with one tap back to the current dossier
- "＋ Add note" button in the Field Notes changelog — opens the new sign-in-protected note form where you can record what you learned and rate your confidence

## [v01.06w] — 2026-08-07 11:02:33 PM EST — v01.94r — [320f105](https://github.com/LightAISolutions/Sales/commit/320f105f4b65e551d2c48521fe3dd201d7f64f8a)

### Added
- Field Notes changelog — a ⚙ button in the bottom-right of the dashboard opens a chronological log of first-hand notes, filterable by company, each showing its date, source type, and a 0–100 confidence rating
- Study guides — companies with a published study guide now show a "Study guide 📖" button on their dossier, opening a need-to-know brief with tap-to-flip flashcards

## [v01.05w] — 2026-08-07 09:49:43 PM EST — v01.92r — [a4ed463](https://github.com/LightAISolutions/Sales/commit/a4ed4637ffd893b3da92fcbb9238cf70d4372f08)

### Added
- Profiler can now be installed to your phone's home screen as a real app — added via "Add to Home Screen", it opens full-screen with its own icon, without the browser address bar

## [v01.04w] — 2026-08-07 03:26:14 AM EST — v01.91r — [4df98e4](https://github.com/LightAISolutions/Sales/commit/4df98e4a21d3f92ddad4e8f3d7de912bde1576b3)

### Changed
- Profiler now has its own logo — a corporate dossier emblem shown on the loading and maintenance screens, replacing the generic placeholder

## [v01.03w] — 2026-08-07 12:34:58 AM EST — v01.89r — [f1d7d29](https://github.com/LightAISolutions/Sales/commit/f1d7d298b24d0fac17e0006d6ea10faec52ffe4f)

### Changed
- The app has a new name: **Profiler** — the page title, header, and document exports now use the new name

## [v01.02w] — 2026-08-07 12:02:06 AM EST — v01.88r — [7cd6566](https://github.com/LightAISolutions/Sales/commit/7cd656696bc2df9a57ac14017f4fa3897202d90b)

### Added
- Recent Developments timeline on company dossiers — dated news highlights with a category tag and a one-line strategy takeaway per event
- Strategy Read section — a clearly-labeled analytical view of each company's sales and product direction
- Richer product entries: competitive positioning, how each product is sold, target segments, and roadmap items
- Word and PDF exports include all the new sections

## [v01.01w] — 2026-08-06 09:50:12 PM EST — v01.84r — [bb32dad](https://github.com/LightAISolutions/Sales/commit/bb32dad591c6101e0d701b4e1ab3f32fd5f099fb)

### Added
- Export button on every company dossier
- Document-style preview screen so you can check for mistakes before exporting
- Export to Word (downloads a .doc file) or PDF (opens the print dialog — choose "Save as PDF")

Developed by: LightAISolutions
