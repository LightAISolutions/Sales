# Changelog — GAS Project Creator Page

All notable user-facing changes to this page are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [gas-project-creatorhtml.changelog-archive.md](gas-project-creatorhtml.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 4/50`

## [Unreleased]

*(No changes yet)*

## [v01.04w] — 2026-09-10 03:31:19 AM EST — v05.33r

### Fixed
- Opening the page straight after an update no longer shows the previous version's content. The page now checks, on load, whether the copy it is running matches the version it is reporting, and refreshes itself once if it does not
- Refreshes triggered by an update now always fetch a fresh copy of the page rather than reusing the one already in the browser's cache

## [v01.03w] — 2026-08-27 04:09:00 PM EST — v03.03r

### Changed
- Minor internal improvements

## [v01.02w] — 2026-08-05 02:57:13 AM EST — v01.77r

### Fixed
- The recommended project settings now include the permission that lets a script install its own scheduled timers — without it, features that rely on hourly automation could never activate

## [v01.01w] — 2026-07-13 08:28:42 PM EST — v01.01r

### Changed
- Default repository name and logo addresses now point to this site instead of the original template site

Developed by: LightAISolutions
