# Changelog — Network

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Networkhtml.changelog-archive.md](Networkhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 3/50`

## [Unreleased]

*(No changes yet)*

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
