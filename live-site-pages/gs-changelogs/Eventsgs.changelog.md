# Changelog — Events (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Eventsgs.changelog-archive.md](Eventsgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 8/50`

## [Unreleased]

*(No changes yet)*

## [v01.08g] — 2026-09-23 02:19:54 AM EST — v07.24r

### Added
- A **plan** for one starred event, answered in one read: the booths ranked from the recommendation's own account and segment terms with a line quoted verbatim from each covered company's dossier (read from the public site, never from Profiler's app) and its stage; the agenda page read once and its sessions kept when the title names one of your segments, a speaker is one of your contacts or a speaker is a dossier decision maker; a day plan per show day with the registry's hours or a default frame, the ranked visits, the sessions, the booked meetings and the open slots between them; the nearby venues within 600 m from OpenStreetMap, fetched once per event and kept for 30 days — a failed lookup is an empty list, never a failure
- **Booking a meeting** against a Network contact: the meeting is written on the contact in Network first, then kept here with its record's id, and the calendar invite is answered as a download; unbooking removes the meeting here and leaves the record in Network; the contacts of an account are read from Network for the pick list
- When Network is not connected, the plan and a booking still answer — without booths, contacts or a Network record — and say so

### Changed
- Minor internal improvements

## [v01.07g] — 2026-09-22 10:38:40 PM EST — v07.20r

### Added
- The weekly sweep now also reads each **target account's own events page** once a month (the "events / meet us at" page saved on the account in Network) and notes the shows it names — with the person, where the page names one
- The sweep reads each event's **agenda** for the people speaking and their companies, months ahead of the roster
- A **regulatory-filing watch**: the Federal Register's FERC notices are checked once a run for your utility, storage-developer and data-centre-developer accounts named as filers; a hit is saved on the account as a docket signal with the notice as evidence (it is not tied to an event, so it never moves an event's score)
- A **recording of a talk** can be saved as a signal from the event sheet — the link is kept as evidence and never fetched

### Changed
- The Signals now answer and the last-swept line count the events pages and filings read; a failed page is retried on the next run
- Minor internal improvements

## [v01.06g] — 2026-09-22 07:50:15 PM EST — v07.19r

### Added
- A weekly **attendance sweep**: for every starred event and the top ten recommended, the exhibitor directory and the speaker roster are read and the three newswires are watched for your target, customer and partner accounts; every hit is saved as a signal on the account in Network with its kind, confidence, evidence link and the date it was first seen. Install it once; run it any time with Signals now. Nothing is read from a professional network or an attendee list
- Saving a signal you typed on an event's sheet

### Changed
- The organiser poller no longer proposes an edition or event whose dates have already passed
- The recommendation carries the person a signal names, so the event sheet can show them
## [v01.05g] — 2026-09-22 05:29:45 PM EST — v07.18r

### Added
- **The recommendation score** — every upcoming event is scored from six inputs: how much of its audience sits in your two selling seats, which of your accounts show a sign of attending and how far along each is, how many company dossiers name the show and how recently, whether it is in a region you prefer, whether it clashes with an event you are registered for, and the calendar's own relevance rating. Each input is weighted and the weights are yours to change in the Tuning tab — the first score fills the tab with the defaults and a note per row explaining each one; a weight that is not a number falls back to its default and the answer says so
- The score explains itself: every event comes back with each input's value and the rows behind it, so the page can show why
- If the two apps are not yet linked, the score still runs without the account input and says so rather than failing; the reads stop after forty accounts so a score never runs long

## [v01.04g] — 2026-09-22 07:40:08 AM EST — v07.15r

### Added
- **The weekly poller** — once a week (and on demand from the Proposed tab) the backend reads every organiser feed on the public roster that can be read, compares what the organiser publishes against the calendar, and proposes the differences for approval: a new edition, moved dates, a changed venue, a changed web address, a cancellation, or a show the calendar has never carried. It never changes the calendar itself — an approved change is applied in a session
- A source that is blocked, hand-maintained or asks not to be crawled is never fetched; a source that cannot be read records its status and proposes nothing — nothing is ever guessed or filled from another feed
- The same proposal is never raised twice, however many weeks it stays pending or was already decided
- Approve, reject and "mark applied" for the queue, a "poll now" for the first run, and a one-tap install of the weekly schedule that replaces any earlier one rather than adding to it
- A per-run outcome per source (status, items read, newest date) the Proposed tab shows
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
