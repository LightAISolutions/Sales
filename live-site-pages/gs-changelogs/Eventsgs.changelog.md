# Changelog — Events (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Eventsgs.changelog-archive.md](Eventsgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 3/50`

## [Unreleased]

*(No changes yet)*

## [v01.03g] — 2026-09-22 05:05:03 AM EST — v07.10r

### Added
- **The backend can now talk to the Network backend, and answer it** — the same shared-secret route as Network's: a missing, short or wrong secret is refused with one flat answer before any data is opened, and nothing about the secret is ever logged
- Answers the peer with your starred events that are on today (in each event's own time zone) and, separately, every starred event with your attending state — read from your stars and the public registry, never anything about people
- Relays one account's attendance signals from the Network backend, with each event's name and dates attached
- A signed-in administrator's request for Network's scored accounts is passed through, reporting "not connected" rather than an error while the link is unset

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
