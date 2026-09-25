# Changelog — Network

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Networkhtml.changelog-archive.md](Networkhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 25/50`

## [Unreleased]

*(No changes yet)*

## [v01.25w] — 2026-09-25 06:08:32 AM EST — v07.49r

### Added

- **"What did you learn?" in the Promote box.** Promoting a touch to a Profiler field note now asks what you actually learned, and that is what Profiler receives, with the touch (who, when, which company) attached as context. Before, only the automatic line such as "Card scanned" went across, so the note said you met someone but not what they told you. The box is required, and the start of what you wrote also appears in the contact's History

## [v01.24w] — 2026-09-23 01:20:11 AM EST — v07.23r

### Added
- A **📄 Brief** button on every contact detail — one tap exports a pre-meeting brief as a Word document: the warmth line, the contact, the account, the full timeline of touches, where the account will be, the dossier's strategy read and its last five developments when the company is covered, and the pipeline stage. The dossier is read, never changed, and the export is recorded like every other
- A **⇈ Promote** action on each touch in a contact's history — copies that touch into Profiler's field-note intake as a contact note with the confidence you give it (0–100), one way; the dossier is never edited and a note on the contact records the promotion. Needs a Profiler sign-in in the same browser; a second promote of the same touch is refused
- The **"Will be at"** line is now chips — one per event, named as Events knows it, with the kinds and confidences beneath and a link into Events; press quotes appear as a "Quoted in press" chip and regulatory filings as a "Regulatory filing" chip
- A **🕸 Map** in the masthead — your accounts, the contacts at each and the events you met them at, drawn from the list as filtered; drag to pan, tap a node to focus it, tap a focused contact to open their row

### Changed
- Minor internal improvements

## [v01.23w] — 2026-09-23 12:41:01 AM EST — v07.22r

### Added
- A **warmth** chip on every contact row and on the detail — hot, warm, cool or cold from a decayed sum of your touches (meetings count most, notes least, everything halving over 90 days); the detail also shows the contact's cadence and how far past it they are
- The **Warmth** sort is now live — hottest first
- A **Reconnect** card in the masthead listing the contacts whose last touch is older than their cadence, most overdue first, with a one-tap draft into the follow-up drafts flow (per row or for the ticked)
- An **Import touches** panel in the masthead — paste a calendar export (.ics) or a sent-mail / inbox CSV from your own mail client, review the proposed touches matched to your contacts by email, tick the ones to keep and record them with your own reference; nothing is read from any mailbox or calendar and nothing is recorded until you confirm

### Changed
- Minor internal improvements

## [v01.22w] — 2026-09-22 11:02:50 PM EST — v07.21r

### Added
- A **People in the press** section on the account detail — tap **Read the press** to list who the trade press has quoted or bylined at the account, then **Accept** anyone worth tracking; accepted people show a tick and appear on the "Will be at" line straight away

### Changed
- Minor internal improvements

## [v01.21w] — 2026-09-22 07:50:15 PM EST — v07.19r

### Added
- A **Will be at** line on the account and contact details: the attendance signals Events found or you added, each with its event, kind, confidence and evidence link
## [v01.20w] — 2026-09-22 04:20:59 PM EST — v07.17r

### Fixed
- **Exporting vCards with the card image no longer crashes the browser on a phone.** Ticking "include card image" and exporting a vCard bundle or a per-contact zip could freeze the tab for tens of seconds and, on a phone, end in the browser's "Aw, Snap!" crash page. The card image is now prepared in a way that costs a fraction of the memory and time, so the export finishes in about a second either way.

### Changed
- **The card image embedded in a vCard is now sized for a contact photo.** Cards are stored at full capture size for reading; the copy that rides along in the vCard is redrawn smaller before it is attached. Contacts apps on both phone platforms show it at avatar size regardless, the resulting `.vcf` is roughly ten times smaller and easier to send, and very large photos — which some phones quietly refuse to import — no longer occur.
- **The export now says which card image it is on** while it collects them, instead of sitting silently on "Building…".

## [v01.19w] — 2026-09-22 07:15:53 AM EST — v07.14r

### Added
- Export menu on the selection bar: CSV, an Excel workbook (Contacts, Accounts and Interactions sheets), a vCard bundle, or one vCard per contact as a zip; an "include card image" tick adds each contact's card front to its vCard
- Start a mailing: pick recipients from the selection, choose a saved template or write one with merge fields (first name, company, where and when you met, the last topic), then review one editable draft per recipient
- Draft hand-off: an .eml bundle for any mail client (your From address remembered on this device), CSV or .txt, per-draft Copy and Mail app; Mark sent records an "Email sent" interaction, Discard closes a draft — nothing is sent by the app
- Drafts and My card pills in the masthead; My card keeps your own name, title, company and phone and shows them as a full-screen QR code that a phone camera reads straight into Contacts

### Changed
- Contacts marked do-not-contact are left out of every export; recipients without marketing consent or an email address are skipped from a mailing with the reason shown

## [v01.18w] — 2026-09-22 06:46:16 AM EST — v07.13r

### Added
- **The Contacts list can now be searched, filtered and sorted.** Search by name, company, title or email address; a Filters drawer narrows the list by relationship, stage, role, industry segment, source event, tag, met-date range and consent to marketing — the count tile reads "3 of 40" while a filter is on, and Clear brings everything back
- **Sort by last touch, name or company** — each starts in its natural order (newest touch first; names and companies A to Z) and a button flips it. Last touch is the date of the newest interaction with each contact and now shows on every row. A Warmth sort is shown but stays off until relationship intelligence arrives
- **Select several contacts at once.** Tick the box on any row (or "all" for every row shown) and a bar appears at the bottom of the screen with what you can do with the selection: **Tag** them, **set their companies' relationship and stage** (a stage still needs a Target or Customer relationship — any company that cannot take it is reported by name count, the rest are set), **download a CSV** of the selection (opens cleanly in Excel with accents intact; anyone marked do-not-contact is left out), or **Delete** them after a confirm that says how many — each can still be restored from its row. Start a mailing is on the bar but not yet live
- Ticking rows never closes a contact you have open; the selection survives a refresh and is trimmed to the rows still shown

## [v01.17w] — 2026-09-22 06:05:50 AM EST — v07.12r

### Fixed
- The "Starred today" row now sits directly under the Source event field, where the choice applies, instead of below the Save and Cancel buttons

## [v01.16w] — 2026-09-22 05:56:25 AM EST — v07.11r

### Fixed
- **Editing a saved contact no longer fills an empty Source event with today's show.** A contact was met when it was met. On a saved contact's editor the starred events on today are now offered as tap-to-use pills under the field, never filled in for you; a freshly scanned card still gets the prefill

## [v01.15w] — 2026-09-22 05:05:03 AM EST — v07.10r

### Added
- **Source event fills itself in** when you review a scanned card: if exactly one of your starred events is on today, the field is prefilled with it; if several are, they are offered as pills under the field; if none are, nothing changes. The field stays editable as before, and the default arrives quietly — it never overwrites something you have already typed
- A short, plain message when the two apps are not yet linked

## [v01.14w] — 2026-09-21 06:47:37 AM EST — v06.94r

### Added
- **Accounts.** A new card under Contacts lists every company you have saved a contact at — name, relationship, stage and how many contacts are there. Tap a row for the full account with its contacts beneath; **Edit** opens the same account block the review card uses, now in full (name, relationship, stage, segments, tags, HQ, newsroom page, notes) and saves it back. Renaming a company renames its photo folder in Drive the next time a card is filed there. Deleting an account that still has contacts is refused and tells you how many — nothing is removed for you; a deleted account can be restored with one tap
- **Profiler link.** A company that has a Profiler dossier shows a **Profiler ↗** link on its account row, in the account detail and on the contact's account line, opening straight to that dossier; its segments are shown by name
- **Propose a dossier.** An account with no dossier yet gets a one-tap **Propose a dossier** that copies the exact line to paste into a Profiler session (the line is also shown so it can be selected by hand) and marks the account as proposed
- **On the record.** Opening a contact at a covered company checks the dossier's decision-makers: a matching name shows the title the dossier records and which revision it comes from; if the card's title differs, that is noted — nothing is changed on either side. The dossier is only read when the detail opens, never while the list loads

## [v01.13w] — 2026-09-21 06:25:15 AM EST — v06.93r

### Fixed
- **Tidy titles & companies looked like it did nothing.** It was running — but its progress and result were written on the capture card at the top of the page, and the list only redrew once every contact had been checked (half a minute or more). Now the button itself reads "Tidying 3 of 20…" while it runs, a line inside the Contacts list shows progress and then the result (what changed, or that everything was already in the standard form), and each corrected row re-cases as soon as its change lands. A contact that cannot be read or saved is counted and named instead of stopping the run silently

## [v01.12w] — 2026-09-21 05:53:43 AM EST — v06.92r

### Added
- **Tidy titles & companies** — one tap at the top of the Contacts list applies the standard casing to every saved contact and account and reports what changed. Use it once after an update to the rule; a company renamed this way renames for everyone at it

### Changed
- **The casing rule follows your calls**: a rank title followed by "of" takes the comma form ("Director of Onshore Renewables" → "Director, Onshore Renewables"; also Manager, VP, EVP, Coordinator, Engineer, Analyst, Specialist, Lead, Supervisor, Officer — "Head of IT" and "Chief of Staff" keep their "of"), and words you have ruled on are remembered (RAI stays in capitals: "RAI ENERGY" → "RAI Energy"). Confirmed on your list: "VICE PRESIDENT, PRE-CONSTRUCTION" → "VP, Pre-Construction", "Senior Manager" → "Sr. Manager", "SR. DIRECTOR, STORAGE ENGINEERING" → "Sr. Director, Storage Engineering", "AVANTUS" → "Avantus", "Jupiter POWER" → "Jupiter Power", "CYPRESS CREEK RENEWABLES" → "Cypress Creek Renewables", "DEPUTY DIRECTOR" → "Deputy Director", "DEVELOPMENT COORDINATOR" → "Development Coordinator"

## [v01.11w] — 2026-09-21 05:39:58 AM EST — v06.91r

### Added
- **Edit a saved contact.** Tap a row in Contacts, then **Edit**: the same editor and review block as a held card, filled from the saved row — change any detail, the role, the account block, the source event, met date or consent, and **Save changes** writes it back. Moving a contact to a different company records the change of employer in their history

### Changed
- **Titles, departments and company names are standardised** when a card is read, when a held card loads and whenever you edit them: every word First-letter-capitalised with the rest lower ("Director of Grid Services", "Sungrow Power Supply Co., Ltd."), except a C-suite title (CEO, CFO, COO …) or a word that is reasonably an acronym (IT, HR, EMEA, ABB, TSMC), which stays in capitals; a word already in mixed case (McKinsey, PhD) is left as printed, and text in another script is never touched. In titles, **Vice President becomes VP, Executive Vice President becomes EVP, and Senior becomes Sr.** — so "Senior Vice President, Sales" reads "Sr. VP, Sales". A company the Profiler record covers takes the record's own spelling of its name

## [v01.10w] — 2026-09-21 05:01:07 AM EST — v06.90r

### Added
- **Review and save a card.** Edit on a held card now opens the full review: the person's role, the account block (company, relationship — Target by default for a card from a show — and stage, which can leave None only for a Target or Customer account), the source event, the date you met (the day the card was scanned, editable), marketing consent and a do-not-contact switch. **Save** files the card as a contact; **Save all** files the whole stack in order
- **Companies are recognised.** When the company on a card is one the Profiler record covers, the review says so and proposes the link and its segments; you confirm or untick it. Any other company becomes a new account of yours, and a company you already have is reused
- **Duplicates are offered a merge, never dropped.** When a card matches a contact you already have — by email, then phone, then name at the same company — the card shows both side by side, one row per detail that differs, with the new card chosen by default. Merge keeps the existing contact and both cards' photos; "Keep as a separate contact" is there for two people who genuinely match
- **Photos move to the company folder** in your own Drive when a card is saved — from the inbox folder into a folder named after the company, created on the first save for that company
- **Retry** reads the card again from the same photos; **Swap** turns a two-sided card's front and back around
- **The contacts list** shows name, title and company; tap a row for every detail and the card's history; **Delete** hides a contact and a one-tap **Restore** brings it back
- A detail the reading was unsure of is outlined in the editor until you change or accept it

### Changed
- The held-card notes and the empty-list text no longer say saving arrives later — it is here

## [v01.09w] — 2026-09-21 04:12:37 AM EST — v06.88r

### Changed
- The capture controls line up in two equal halves on every row: Front / Back beside **Scan**, then **Extract** / **Clear**, then **One-** / **Two-sided** (stacked labels) beside **Choose photos**

## [v01.08w] — 2026-09-21 04:03:50 AM EST — v06.87r

### Changed
- **Name capitalisation is now two-case only** — a name printed entirely in capitals (MOHAMMED S. ALRAI) or entirely in lower case (austin york) becomes Mohammed S. Alrai / Austin York; a name with mixed case is kept exactly as printed, and a name in another script is never changed

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
