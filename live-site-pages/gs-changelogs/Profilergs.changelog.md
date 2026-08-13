# Changelog — Profiler (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Profilergs.changelog-archive.md](Profilergs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 9/50`

## [Unreleased]

*(No changes yet)*

## [v01.09g] — 2026-08-13 04:34:03 AM EST — v02.37r

### Added
- Transcripts saved with a note are turned into written meeting notes automatically, covering the summary, discussion points, customer signals, action items and open questions
- Writing a note up can be repeated at any time. Anything you typed yourself is kept and put back at the top each time, so repeating it never replaces your own words or stacks copies of the write-up
- Very long recordings are shortened before being written up rather than failing, and the note says when that happened

### Changed
- Saving a note and writing it up are now separate steps, so a slow or unavailable write-up can no longer cost you the note itself — the note and its transcript are saved first
- Notes stay marked as pending after being written up; a written-up note is still yours to review before anything reaches a dossier

## [v01.08g] — 2026-08-10 04:42:24 AM EST — v02.30r

### Fixed
- The recordings folder is now created in **your own** Google Drive, next to your other app folders, instead of in the Drive of whichever account the app was published from — where you could not see it

## [v01.07g] — 2026-08-10 04:25:55 AM EST — v02.29r

### Added
- Meeting recordings now have a home. Uploads are sorted into a dedicated recordings area with two folders — one for audio still waiting on a transcript, one for audio already transcribed — so a glance shows what is left to do
- Each recording is renamed to lead with the company and the date, keeping its original name on the end, so files stay recognisable
- A recording that was uploaded but never sorted is picked up and put away automatically the next time the app is opened

## [v01.06g] — 2026-08-10 02:17:53 AM EST — v02.25r

### Security
- Notes and their attachments are held in private storage and released only to an approved signed-in account

### Changed
- Saving a note now takes effect immediately, with no publishing step
- Meeting recordings are uploaded directly from your browser, so length is no longer limited by the app

## [v01.05g] — 2026-08-09 03:03:41 AM EST — v02.14r

### Added
- Role-based access: saving, editing, and deleting notes is now owner-only; other signed-in team members can submit note suggestions (with attachments and a confidence rating) that are emailed to the owner for review

## [v01.04g] — 2026-08-09 02:41:47 AM EST — v02.13r

### Security
- Strengthened sign-in checks on the note service — every note operation now fully verifies the signed-in session

## [v01.03g] — 2026-08-09 02:37:16 AM EST — v02.12r

### Changed
- The note service now talks to the app over a more reliable connection method, fixing load failures some phones experienced

## [v01.02g] — 2026-08-09 01:59:52 AM EST — v02.10r

### Added
- "Manage existing notes" panel in the field-note form — view every submitted note, edit its text and confidence rating in place, or delete it (deleting a file note also removes the attached document). Edited notes show an "edited" date in the log

## [v01.01g] — 2026-08-09 01:30:51 AM EST — v02.09r

### Added
- The field-note service is connected — sign in once with Google, then save notes and upload Word/PDF meeting files straight from any dossier

Developed by: ShadowAISolutions
