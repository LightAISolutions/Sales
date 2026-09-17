# Changelog Archive — Classroom — BESS/AIDC Curriculum (Google Apps Script)

Older version sections rotated from [Classroomgs.changelog.md](Classroomgs.changelog.md). Full granularity preserved — entries are moved here verbatim when the main changelog exceeds 50 version sections.

## Rotation Logic

Same rotation logic as the repository changelog archive — see [CHANGELOG-archive.md](../../repository-information/CHANGELOG-archive.md) for the full procedure. In brief: count version sections, skip if ≤50, never rotate today's sections, rotate the oldest full date group together.

---

## [v01.13g] — 2026-09-02 11:38:08 PM EST — v04.34r — [ddd7c5f](https://github.com/LightAISolutions/Sales/commit/ddd7c5f41f76fe45daa64de11fe270c5c726741e)

### Changed
- The lesson on the building's own power chain — service entrance to rack — now sits in the grid-to-chip track at its proper place in the walk, so the track finally reads end to end: the property line and the queue behind it, the power station a campus builds when that queue is too slow, then the chain inside the building
- The older two-lesson power track has been retired and replaced by a campus track that opens on why heat, rather than power, decides how much compute fits in a hall. Both lessons kept their identity through the move, so nothing you have already completed is reset

## [v01.12g] — 2026-09-02 11:04:43 PM EST — v04.33r — [8f557e2](https://github.com/LightAISolutions/Sales/commit/8f557e2d315af41f15cef4ff3798dee4572f8cbd)

### Added
- A new lesson on what a campus does when its grid connection is still years away: building its own power station on site, the four kinds of machine that can burn the same gas, and what each one costs in fuel, in permitting and in delivery date
- The lesson covers why the waiting line moved from the utility to the engine factory, how an on-site power plant ends up designed with data-hall redundancy logic, and how four real campuses each answered the same problem differently
- It closes on where the approach fails — the air permit rather than the plant, machines that lose output at part load and in hot thin air, fuel that is a supply chain rather than a tank, a manufacturing slot that slips, and an island that cannot hold a load swinging in milliseconds

### Changed
- The data-center power track now runs two lessons in order, and its summary describes both

## [v01.11g] — 2026-09-02 10:36:47 PM EST — v04.32r — [31d704e](https://github.com/LightAISolutions/Sales/commit/31d704ed52eebc55e5639c536a37ff2fdf410627)

### Added
- A new lesson on how a site gets connected to the grid in the first place: the studies that gate it, the queue that forms behind them, the substation that arrives at the end, and the five different quantities a campus announcement can mean by "megawatts"
- The lesson closes on where the process fails — the date that moves, the equipment slot nobody reserved, energization treated as a formality, and the permit problem that looks exactly like an equipment problem
- A new track that walks the data-center power chain in physical order, starting at the property line. The new lesson opens it, and the rest of the walk is added as each part is written

## [v01.10g] — 2026-09-02 06:23:38 PM EST — v04.29r — [12555d8](https://github.com/LightAISolutions/Sales/commit/12555d8dc31d2021039831391ed6b20965a31347)

### Fixed
- The drill now assembles its own list of available study-guide cards instead of relying on the page to send one, which is what stopped the drill from loading at all

## [v01.09g] — 2026-09-02 05:45:44 PM EST — v04.28r — [4c77b47](https://github.com/LightAISolutions/Sales/commit/4c77b4743bd55d8774e41c37b44d77af8be5d9fb)

### Added
- Storage and scheduling for the new drill: what you are due to review, when each card comes back, and a full history of how each one has gone over time. It follows your account across devices like the rest of your progress
- The drill only ever offers cards from material you are allowed to read — the same rule that governs which lessons you can open

## [v01.08g] — 2026-09-02 05:16:32 PM EST — v04.27r — [b126e33](https://github.com/LightAISolutions/Sales/commit/b126e33f11d5b3c7a0e5f38401121a26a664a467)

### Changed
- Marking a section understood now records the date it happened, instead of only that it happened. This is what lets a lesson tell you it was revised after you read it. The record still follows your account across devices
- Sections marked before this version keep their mark and simply carry no date

## [v01.07g] — 2026-09-02 02:41:00 AM EST — v04.22r — [4fc34af](https://github.com/LightAISolutions/Sales/commit/4fc34aff9dab7ac4230cfdd08975daa80f8ffc78)

### Changed
- Minor internal improvements

## [v01.06g] — 2026-09-02 01:21:25 AM EST — v04.19r — [fefa998](https://github.com/LightAISolutions/Sales/commit/fefa9980b0699d5f5b80c519c09ce11c0de02e21)

### Changed
- Minor internal improvements

## [v01.05g] — 2026-09-02 01:10:32 AM EST — v04.18r — [af4069a](https://github.com/LightAISolutions/Sales/commit/af4069ae71a38d912103534ccf1413e61c009004)

### Added
- The app now works out what you should read next and sends it with the curriculum, so the suggestion is always current and never points at material your access level cannot open

### Changed
- The record of sign-ins, refusals and restricted-material reads now has somewhere to go, so it starts filling from this update onward

## [v01.04g] — 2026-09-02 12:58:13 AM EST — v04.17r — [a53cd91](https://github.com/LightAISolutions/Sales/commit/a53cd9189dca8772c3568ad612db49968a0f25e6)

### Added
- Reading progress is now stored per account, so it is the same on every device you sign in from
- Progress can only be recorded against material your access level lets you open, and ticks on material you can no longer open are hidden rather than deleted

### Changed
- The app now keeps a record of sign-ins, refusals, and who opened restricted material; the record starts filling once a log destination is attached

## [v01.03g] — 2026-09-02 12:20:16 AM EST — v04.14r — [cb1d3e1](https://github.com/LightAISolutions/Sales/commit/cb1d3e1487b4768baa8a1f3a029d942b0514d151)

### Added
- The script now knows its own published address, so future updates install themselves without anyone opening the editor

## [v01.02g] — 2026-09-01 11:14:26 PM EST — v04.13r — [92c643e](https://github.com/LightAISolutions/Sales/commit/92c643ea11587780a54fb9565e0c85d232586213)

### Added
- The first lessons and tracks are now stored and served, each one recorded alongside the sources it was written from
- A lesson drawn from restricted material is served only to the access levels cleared for it; everyone else sees it counted, not named

## [v01.01g] — 2026-09-01 10:31:20 PM EST — v04.12r — [c2f6aed](https://github.com/LightAISolutions/Sales/commit/c2f6aedc5df2a5a6cfdba431ef74502c518f2a2a)

### Added
- Groundwork for the curriculum: the shape every lesson and track will take, and the access check that decides who can read each lesson based on where its material came from
- The curriculum is still empty — lessons and tracks arrive in the next update


Developed by: LightAISolutions
