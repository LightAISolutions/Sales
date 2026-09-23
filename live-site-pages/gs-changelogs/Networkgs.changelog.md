# Changelog — Network (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Networkgs.changelog-archive.md](Networkgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 14/50`

## [Unreleased]

*(No changes yet)*

## [v01.14g] — 2026-09-23 12:41:01 AM EST — v07.22r

### Added
- Warmth is computed for every contact on each read — a decayed sum of touches weighted by kind, halving over 90 days — and answered with the list and the detail; nothing is stored
- A cadence per role and relationship, and a reconnect list of the contacts whose last touch is older than it, most overdue first; contacts marked do not contact are left out
- A calendar export or a mail CSV pasted into the app is parsed here into a list of proposed touches matched to contacts by email; only the rows you confirm are recorded, each with your own reference as its evidence and one line as its summary — never a message body

### Changed
- Minor internal improvements

## [v01.13g] — 2026-09-22 11:02:50 PM EST — v07.21r

### Added
- The people the trade press names at an account can be read from the news corpus, for accounts with a dossier — accounts without one are told so rather than searched
- Accepting a person saves a press-quote signal on the account (confidence 0.7) with the article as its evidence, the person's name and title, and a link to your contact when the name matches one at that account; accepting the same person twice refreshes the row rather than duplicating it

### Changed
- Minor internal improvements

## [v01.12g] — 2026-09-22 10:38:40 PM EST — v07.20r

### Added
- The account's saved events page is shared with Events so its monthly read can find the shows the company names
- A regulatory-filing signal can be saved on an account without an event — it shows on the account's "Will be at" line with the filing as evidence

### Changed
- Minor internal improvements

## [v01.11g] — 2026-09-22 07:50:15 PM EST — v07.19r

### Added
- Reading an account's (or a contact's account's) attendance signals for the detail cards

### Changed
- A LinkedIn link is accepted as an attendance signal only as a post you read yourself; every other kind of signal still refuses one
- Signal reads carry the person's name and title where a signal names one
## [v01.10g] — 2026-09-22 07:15:53 AM EST — v07.14r

### Added
- Exports in three formats from one gather: CSV, an Excel workbook built through a temporary spreadsheet, and vCard 3.0 text per contact and as a bundle; every export records a disclosure entry
- Follow-up drafts: saved templates, one rendered draft per recipient with merge fields, edits, and marking a draft sent (which records an "Email sent" interaction) or discarded; the script never sends mail
- The developer's own card details (name, title, company, phone) saved on the profile row and answered as a vCard

### Changed
- Recipients marked do-not-contact or without marketing consent are skipped from a mailing and reported by reason

## [v01.09g] — 2026-09-22 06:46:16 AM EST — v07.13r

### Added
- **The contact list answers a search and eight filters** (relationship, stage, role, segment, source event, tag, met-date range, consent) and carries each contact's most recent interaction date — the one new field on a list row. The columns the search and filters read never leave the server; an unknown filter value is refused rather than ignored
- **Bulk changes over a selection of contacts**: add a tag to each, or set the relationship and stage of their companies — every row is checked on its own (a stage still needs a Target or Customer relationship; a relationship moved off those resets the stage to None, as the editor does) and the rows that could not be changed are answered back with the reason, the rest applied. Recorded as events with counts only
- **CSV export of a selection** (or of every contact): one quoted row per contact with their company, relationship, stage and last touch; contacts marked do-not-contact are left out; a disclosure record is written naming the count and the identifiers, never a field

## [v01.08g] — 2026-09-22 05:05:03 AM EST — v07.10r

### Added
- **The backend can now talk to the Events backend, and answer it** — the first private server-to-server route between the two apps. Every request from the peer must carry a shared secret; a missing, short or wrong secret is refused with one flat answer before any data is opened, and nothing about the secret is ever written to a log
- Answers the peer with your live accounts that carry a scored relationship — names, slugs, relationship, stage, segments and tags only; never contacts, emails or notes
- Accepts attendance signals from the peer for your accounts, one per account × event × kind × evidence link, refreshing an existing row instead of duplicating it; a signal that cites LinkedIn is refused row by row
- Asks the Events backend which of your starred events is on today, for the scan card's default — only for a signed-in administrator, and reporting "not connected" rather than an error while the link is unset

## [v01.07g] — 2026-09-21 06:47:37 AM EST — v06.94r

### Added
- **Editing an account.** An account's name, relationship, stage, segments, tags, HQ, newsroom page and notes can be changed from the app; the same checks as saving a contact apply (a stage other than None still needs a Target or Customer), and a rename is refused when another of your accounts already has that name
- The account list now carries each account's contact count, and looking up an account also returns the contacts at it. Recorded as events with identifiers and counts only

## [v01.06g] — 2026-09-21 05:39:58 AM EST — v06.91r

### Added
- **Editing a saved contact.** A contact's details, role, account and consent choices can be changed after saving; the same checks as saving apply, the photos and the original reading are kept, and a move to a different company is recorded in the contact's history. Recorded as an event with identifiers only

## [v01.05g] — 2026-09-21 05:01:07 AM EST — v06.90r

### Added
- **Saving a contact.** A reviewed card is written as a contact, its company as a new or existing account, and the scan as the first entry in that contact's history. Every choice on the card — role, relationship, stage, consent — is checked against the allowed values, and a stage other than None is refused unless the account is a Target or Customer
- **Duplicate check before the write.** The app asks whether a card matches an existing contact — by email, then phone, then name at the same company — and receives the matching contact so it can offer a merge. A merge keeps the existing contact, updates the chosen details, records which card was folded in and keeps a link to both cards' photos
- **Full-row lookup**, **delete** and **restore** for contacts and accounts; a deleted contact can be restored with one tap, and an account that still has contacts cannot be deleted
- After the photos move to the company folder, the new photo links are written back to the contact
- Every one of these events is recorded with identifiers and counts only — never a name, email, phone or any other detail from the card

## [v01.04g] — 2026-09-20 09:55:33 PM EST — v06.82r

### Added
- **Business-card reading.** The backend now reads a card's front and back in one pass and returns the contact details it found — name, title, company, department, emails, phones, address, website, LinkedIn, other handles and the languages seen — with a per-field confidence so the app can mark what deserves a second look. Names in Chinese, Japanese or Korean are romanised with the original script kept alongside; nothing is ever invented for a field that is not printed
- Details read from a QR code on the card take precedence over the printed text
- Each new contact receives its random, opaque identifier before its photos are stored, so nothing about the person is ever encoded in a file name
- A repeated request for the same photos within ten minutes is answered from a short-lived cache instead of being read again
- Reading a card is recorded as an event with the contact's identifier and a count of fields found — never the contents of the card

## [v01.03g] — 2026-09-20 09:06:03 PM EST — v06.79r

### Added
- **A daily execution counter the operator can read.** A status address now reports how many requests the backend handled today, grouped by type — counts only, never who made them or what they contained (the counter now carries the same name as in every other app, so one fleet-wide check reads all of them)

## [v01.02g] — 2026-09-20 08:38:53 PM EST — v06.77r

### Changed
- **First live deployment.** The backend now knows its own deployment, so it can update itself automatically whenever a new release is published

## [v01.01g] — 2026-09-20 12:56:34 AM EST — v06.76r

### Added
- **First release of the Network backend.** Access is limited to administrators; every other account is turned away before any data is read, and each refusal is recorded
- The spreadsheet is prepared automatically on first use with the tabs the app needs (accounts, contacts, interactions, signals, mailings, drafts, sharing and profiles), and column layouts are kept current on later releases without touching existing rows
- Contact and account identifiers are random and opaque — never derived from a name, an email, a company or a date
- A registry for the app’s Drive folders, so card images can be filed under the right company on every device
- Two unauthenticated status probes: an access-list health check, and a daily execution counter that reports how many requests the backend handled today, grouped by type — counts only, never who or what
- Session activity is confirmed every ten minutes instead of every five, and the backend is never polled for data

Developed by: LightAISolutions
