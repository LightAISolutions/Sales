# Changelog — Classroom — BESS/AIDC Curriculum (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Classroomgs.changelog-archive.md](Classroomgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 6/50`

## [Unreleased]

*(No changes yet)*

## [v01.06g] — 2026-09-02 01:21:25 AM EST — v04.19r

### Changed
- Minor internal improvements

## [v01.05g] — 2026-09-02 01:10:32 AM EST — v04.18r

### Added
- The app now works out what you should read next and sends it with the curriculum, so the suggestion is always current and never points at material your access level cannot open

### Changed
- The record of sign-ins, refusals and restricted-material reads now has somewhere to go, so it starts filling from this update onward

## [v01.04g] — 2026-09-02 12:58:13 AM EST — v04.17r

### Added
- Reading progress is now stored per account, so it is the same on every device you sign in from
- Progress can only be recorded against material your access level lets you open, and ticks on material you can no longer open are hidden rather than deleted

### Changed
- The app now keeps a record of sign-ins, refusals, and who opened restricted material; the record starts filling once a log destination is attached

## [v01.03g] — 2026-09-02 12:20:16 AM EST — v04.14r

### Added
- The script now knows its own published address, so future updates install themselves without anyone opening the editor

## [v01.02g] — 2026-09-01 11:14:26 PM EST — v04.13r

### Added
- The first lessons and tracks are now stored and served, each one recorded alongside the sources it was written from
- A lesson drawn from restricted material is served only to the access levels cleared for it; everyone else sees it counted, not named

## [v01.01g] — 2026-09-01 10:31:20 PM EST — v04.12r

### Added
- Groundwork for the curriculum: the shape every lesson and track will take, and the access check that decides who can read each lesson based on where its material came from
- The curriculum is still empty — lessons and tracks arrive in the next update

Developed by: LightAISolutions
