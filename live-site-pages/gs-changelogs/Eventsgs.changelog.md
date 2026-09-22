# Changelog — Events (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Eventsgs.changelog-archive.md](Eventsgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 2/50`

## [Unreleased]

*(No changes yet)*

## [v01.02g] — 2026-09-22 04:14:18 AM EST — v07.09r

### Changed
- The backend now points at its own spreadsheet and web-app deployment: first use prepares the data tabs, stars and notes are stored, and the self-update route is live
- Minor internal improvements

## [v01.01g] — 2026-09-22 01:08:08 AM EST — v07.07r

### Added
- **First release of the Events backend.** Access is limited to administrators; every other account is turned away before any data is read, and each refusal is recorded
- The spreadsheet is prepared automatically on first use with the tabs the app needs now and in coming releases (stars, plans, meetings, proposed changes, tuning, sharing and profiles), and column layouts are kept current on later releases without touching existing rows
- **Stars, attending state and notes** are saved per account: starring, unstarring, choosing planning / registered / attended / skipped, and writing a note — every value is checked before it is written, and a note on an event that was not yet starred stars it
- Row identifiers are random and opaque — never derived from an event, a name or a date
- Two unauthenticated status probes: an access-list health check, and a daily execution counter that reports how many requests the backend handled today, grouped by type — counts only, never who or what
- Session activity is confirmed every ten minutes instead of every five, and the backend is never polled for data

Developed by: LightAISolutions
