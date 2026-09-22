# Changelog — Events

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Eventshtml.changelog-archive.md](Eventshtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 6/50`

## [Unreleased]

*(No changes yet)*

## [v01.06w] — 2026-09-22 05:29:45 PM EST — v07.18r

### Added
- **A Recommended pill** on the Mine row — press it and the agenda ranks every upcoming event by how worth attending it looks, with a score on each row; press it again to go back to the calendar order. The ranking is worked out afresh on every press, so a change to the weights takes effect immediately
- **A "why" panel on every event** — the score, the six things it is made of as bars with their weights, the accounts that have a sign of attending (with the stage, the kind of sign and a link to the evidence), the audience segments that match your seats, the dossiers that name the show, and any clash with an event you are already registered for
- A note on the panel saying where the weights and the preferred regions are edited, and which ones are in use

### Changed
- The "connect Network" line on the event sheet now appears only when the two apps are not yet linked; the score still works without the account term in that case
- The score is fetched only when you ask for it — on the pill, when an event is opened for the first time, or when you return to the tab while ranked — never in the background

## [v01.05w] — 2026-09-22 07:40:08 AM EST — v07.15r

### Added
- **A Proposed tab for administrators** — the weekly poller's queue: every change it found on an organiser's own feed (a new edition, moved dates, a changed venue or web address, a cancellation, a show the calendar has never seen) as a card with what the calendar says today and what the organiser now publishes, grouped by source, with Approve and Reject on each
- The approved changes collect as one block of text with a Copy button, ready to hand to the session that applies them to the calendar, and a "Mark applied" box for the version that session reports
- Poller controls on the same tab: install the weekly run once, run it now, refresh, and the last outcome for each source (status, how many items, the newest date seen)

### Changed
- The Agenda and Day plan tabs are unchanged; the new tab loads only when opened and never polls in the background
## [v01.04w] — 2026-09-22 05:05:03 AM EST — v07.10r

### Added
- The detail sheet now carries a one-line note that the recommendation-by-account panel arrives in a later release; it makes no request of its own
- A plain message for when the Events and Network apps are not yet linked

## [v01.03w] — 2026-09-22 04:14:18 AM EST — v07.09r

### Changed
- The page is now connected to its own backend: stars, attending state and notes save and reload from your account instead of the "Stars are not connected yet" notice, and the Day plan fills from the events you have starred
- Minor internal improvements

## [v01.02w] — 2026-09-22 02:00:16 AM EST — v07.08r

### Added
- **Subscribe** on the masthead: one tap offers the whole calendar — every event the organiser has confirmed — as a subscription link for Google Calendar, Apple Calendar or Outlook, so new editions and moved dates arrive on their own. The link can be copied with a button or selected by hand, and a one-time download of the same calendar file is beside it
- **Day plan** tab: pick a day and see the events you starred that fall on it as a timeline — the venue's opening hours where the organiser publishes them, which day of the show it is, your attending state and your note. A strip of your starred days makes hopping between them a tap; tapping an entry opens its detail sheet. Read-only in this release — meetings and plans arrive later
- The month named at the top of the page follows the chosen day while the day plan is showing

### Changed
- The pinned month header now sits clear of the account bar at the top of the screen while you scroll, and rows no longer show through beside it

### Fixed
- Semicolons in an event's name, venue or description are now written correctly in the downloaded calendar file, so the per-event download and the subscribed calendar read identically in every calendar app

## [v01.01w] — 2026-09-22 01:08:08 AM EST — v07.07r

### Added
- **First release of the Events app.** Sign in with your Google account to open it; the app is available to administrators only — every other account sees a clear “administrators only” card and nothing is loaded for it
- **The calendar**: every trade show, conference, regional day, social, corporate summit and webinar in the public event registry, listed by month and day under a header that stays pinned while you scroll, with the month in view named at the top of the page and a **Today** button that jumps to the current day. Past editions sit behind a fold at the bottom
- **Honest dates**: an event whose dates the organiser has not yet published is marked *tentative* on its row and explained on its detail sheet — nothing is presented as firm unless the organiser's own page was read
- **Filters** as tap-to-toggle pills: kind, region, audience segment and your starred events. A “Signals only” filter is shown but switched off until attendance signals arrive in a later release
- **Detail sheet** on a tap: organiser, venue, where, status, the registry's note on who attends and why it matters, website, registration, exhibitor list, agenda, speakers and floor-plan links where the organiser publishes them, the audience segments, which dossiers name the event (each a link straight to that dossier in Profiler) and the source it was last confirmed from
- **Add to Google Calendar** opens Google Calendar with the event prefilled (title, dates, place, details, the event's own time zone); **Download .ics** saves a calendar file that imports into any calendar app and updates rather than duplicates on re-import
- **Stars, attending and notes**: star an event from its row or its sheet, set whether you are planning to go, registered, attended or skipped, and keep a private note on it — all saved to your own account
- Installable to a phone's home screen (Add to Home Screen on iPhone, Install app on Android) with its own icon; it runs as a standalone app without the browser chrome
- The view refreshes when the app is opened, when you return to its tab and after every change — there is no background polling

Developed by: LightAISolutions
