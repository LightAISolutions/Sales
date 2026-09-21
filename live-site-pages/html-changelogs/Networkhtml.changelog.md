# Changelog — Network

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Networkhtml.changelog-archive.md](Networkhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 7/50`

## [Unreleased]

*(No changes yet)*

## [v01.07w] — 2026-09-21 03:59:29 AM EST — v06.86r

### Added
- **Names are capitalised** — the first letter of every name word is upper-cased even when the card prints it in lower case
- **Unclear scans tell you** — when a detail looked unclear in the photo, the card shows a note with **Rescan**, **Enter manually** and **Looks right**, and the filed message says which detail to check
- **One-sided / Two-sided switch for batches** — choose it before picking photos; in a two-sided batch every two photos become one card
- **Delete a card** — remove a card you have read, together with its photos in your Drive

### Changed
- **Photograph** is now **Scan** and sits beside the Front / Back switch; the batch button reads **Choose photos**
- The “Missing: …” reminders are gone — business cards vary too much for them to help

## [v01.06w] — 2026-09-21 03:36:02 AM EST — v06.85r

### Changed
- The photo buttons on a card are now **Front** and **Back**, sized to sit on one row with **Edit**
- The “one side / two sides” label is gone — the Front and Back buttons already show how many sides were captured

## [v01.05w] — 2026-09-21 03:30:03 AM EST — v06.84r

### Added
- **A note you can clear** for each detail the card reader was unsure of — “Check the website against the card”. Tap **Fix** to correct it or **Looks right** to dismiss it; a dismissed note stays dismissed
- **Missing details are pointed out** — when other cards you have scanned had a field (say, a website) and this one does not, the card says so with an **Add** button
- **Edit any card you have read** — name, title, company, department, emails, phones, address, website and LinkedIn, right on the card; corrected details are kept on the phone and count as verified

### Changed
- The technical identifier and the confidence list are no longer shown under a card

## [v01.04w] — 2026-09-21 03:17:50 AM EST — v06.83r

### Added
- **A progress bar for every card** — four steps (Id, Upload, Read, Filed) fill as the card moves through them, with a “card 3 of 12” title during a batch; a problem turns the bar red at the step it stopped
- **A clear “go on” signal** — when a card is filed, a green “ready for the next card” line appears, the phone buzzes briefly and the Photograph button pulses so the next shot is one tap away
- **Open the original photo** — every card you have read shows a Front photo (and Back photo) button that opens the picture in your Drive
- **See what was read** — tap a card's name to expand every field found, with the uncertain ones highlighted; editing and saving still arrive in the next release

## [v01.03w] — 2026-09-20 09:55:33 PM EST — v06.82r

### Added
- **Capture a card.** A new card at the top of the app photographs a business card — the front, then the back if it has one — with a Front / Back switch so both sides are read together as one card. Up to fifteen photos can also be chosen at once from the phone's library
- **The card is read for you.** Extract sends both sides for reading and shows the name, title and company it found, with the fields worth a second look marked. Names printed in Chinese, Japanese or Korean are romanised with the original script kept alongside. A QR code printed on the card is read on the phone itself and fills the details it carries
- **Works without signal.** A card captured while offline waits on the phone and is sent automatically when the connection returns; the card shows how many are waiting and a “send now” link
- **Photos filed in your own Drive.** Card photos go straight to a `Network App` folder in the signed-in account's own Drive under an opaque file name; the first upload asks once for permission to manage the files this app creates
- Cards that have been read are held on the phone until reviewing and saving them arrives in the next release

### Changed
- The empty contacts list now points to the capture card above it

## [v01.02w] — 2026-09-20 08:38:53 PM EST — v06.77r

### Changed
- **The app is now connected to its backend.** Signing in reaches the live service, so administrators see the contacts view and the spreadsheet is prepared on first use. Nothing else changed on the page

## [v01.01w] — 2026-09-20 12:56:34 AM EST — v06.76r

### Added
- **First release of the Network app.** Sign in with your Google account to open it; the app is available to administrators only — every other account sees a clear “administrators only” card and nothing is loaded for it
- The contacts view, showing counts and an empty list until card capture arrives in the next release
- Installable to a phone’s home screen (Add to Home Screen on iPhone, Install app on Android) with its own icon; it runs as a standalone app without the browser chrome
- The view refreshes when the app is opened, when you return to its tab and after every save — there is no background polling

Developed by: LightAISolutions
