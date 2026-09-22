# Changelog — Events

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Eventshtml.changelog-archive.md](Eventshtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 2/50`

## [Unreleased]

*(No changes yet)*

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
