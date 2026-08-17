# Changelog — Testauthgas1 Title (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [testauthgas1gs.changelog-archive.md](testauthgas1gs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 2/50`

## [Unreleased]

*(No changes yet)*

## [v01.02g] — 2026-08-17 02:34:37 AM EST — v02.56r

### Fixed
- The specific reason the access list could not be read is now sent back to the page. It was already being worked out, but never delivered, so all four possible causes looked identical from the sign-in screen and could not be told apart

## [v01.01g] — 2026-08-17 02:10:00 AM EST — v02.54r

### Fixed
- Sign-in now tells apart "this account is not on the access list" from "the access list could not be reached right now". The second is reported as a temporary service problem, and is retried automatically before sign-in gives up
- A momentary failure to reach the access list is no longer remembered as a denial, so access is restored the moment the service recovers instead of several minutes later
- These interruptions no longer count toward the failed-attempt lockout

### Changed
- The app now refreshes its entry in the shared access directory only when its version changes, instead of on every single page load. Less simultaneous writing to the shared directory means far fewer of the interruptions above
Developed by: ShadowAISolutions
