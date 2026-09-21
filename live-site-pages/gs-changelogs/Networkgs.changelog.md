# Changelog — Network (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Networkgs.changelog-archive.md](Networkgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 4/50`

## [Unreleased]

*(No changes yet)*

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
