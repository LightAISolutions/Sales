# Changelog — Classroom — BESS/AIDC Curriculum (Google Apps Script)

All notable user-facing changes to this script are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Older sections are rotated to [Classroomgs.changelog-archive.md](Classroomgs.changelog-archive.md) when this file exceeds 50 version sections.

`Sections: 24/50`

## [Unreleased]

*(No changes yet)*

## [v01.24g] — 2026-09-13 06:28:51 AM EST — v05.50r

### Changed
- **One Industry Guidance module was refreshed against current sources.** Several dated items in it had moved on since it was written, so the text now says where they actually stand; two statements that had drifted from the record were corrected outright; and the module's review-by date moved forward to the next date its own subject matter is due to change
- **Its reading sections keep the same names and order**, so any reading marks and review schedules already attached to them carry over untouched
- The module's flashcards and self-test each gained one item, and several existing ones were reworded for the updated material. **A reworded card re-enters the review rotation as new** — the schedule built on the old wording no longer describes the new text, so it is not carried forward. This is intended, not a fault

## [v01.23g] — 2026-09-13 03:24:43 AM EST — v05.48r

### Added
- **Reading marks on guidance modules are kept here now**, per account and across devices, in the same place lesson marks are kept — so a module you read on one machine shows as read on another
- **Guidance flashcards and self-test questions feed the drill**, alongside the lesson and study-guide cards, on the same review schedule
- A one-off tool for bringing across the reading history built up in the other app, together with a check that reports whether every mark arrived. It can be run twice safely, and a mark already recorded here is never replaced by an older one from the transfer

### Changed
- Who can read the modules is unchanged

## [v01.22g] — 2026-09-13 01:24:48 AM EST — v05.46r

### Fixed
- The link that lets a company dossier in the other app list which study modules mention that company no longer fails when the connection setting was pasted in with an invisible trailing space or line break. Surrounding blank space is now ignored on both ends
- If that lookup cannot complete for some other reason, it now reports a readable reason instead of appearing to be a network fault
## [v01.21g] — 2026-09-13 12:52:01 AM EST — v05.45r

### Added
- Groundwork so that a company dossier in the other app can again list which study modules mention that company, now that the modules live here. Nothing changes in this app's own screens

### Changed
- Minor internal improvements
## [v01.20g] — 2026-09-13 12:13:40 AM EST — v05.44r

### Added
- **The nine Industry Guidance modules are now served by this app.** The library, each module and their glossaries are answered here, so guidance no longer has to be read in a different app
- Access is unchanged: the admin and contributor tiers can read guidance, and the analyst and viewer tiers cannot — the same rule that applied when the modules were served elsewhere

### Changed
- Guidance content sits outside the region the automatic weekly curriculum job is allowed to write, so a scheduled run can never alter a guidance module

## [v01.19g] — 2026-09-08 06:59:28 AM EST — v05.18r

### Added
- **A new lesson opens the Value Chain lane** — it teaches how to read the relationship map before the market-structure lessons that use it, with flashcards and a five-question self-test. Readable by every admitted tier
- Curriculum updated

### Changed
- The first Value Chain track now opens with that lesson

## [v01.18g] — 2026-09-08 06:32:46 AM EST — v05.17r

### Added
- **A new lane, The Value Chain, with nineteen market-structure lessons and three tracks** — one lesson per link of the value chain, from cells to insurance, each stating who sits where, what is bought there and on what, the comparable figures on record, who is connected to whom, what moved recently and which policy regimes bear on it, with a structure self-test. Every one is readable by every admitted tier
- Curriculum updated

### Changed
- The lesson index now groups four lanes instead of three

## [v01.17g] — 2026-09-07 07:44:48 PM EST — v05.10r

### Fixed
- **The drill's study pool now includes every study-guide card**, not only the ones kept at the top of a guide — about 1,920 cards instead of about 770. Existing card histories are unchanged

### Changed
- The pool can now grow to 2,400 study cards before the safety cap applies, and its cached form is smaller, so the full pool stays cached rather than being rebuilt on every request

## [v01.16g] — 2026-09-03 01:27:59 AM EST — v04.37r

### Added
- A new lesson has been added to the campus track. It is restricted to the contributor tier and above; readers below that tier will see it counted as withheld rather than listed
- Curriculum updated

### Changed
- The campus track now runs two lessons and its summary describes what the walk covers today

## [v01.15g] — 2026-09-03 01:16:17 AM EST — v04.36r

### Added
- A new lesson on the software that actually runs a storage plant: the layers of control between the cells and the market, which layer decides what, and which two of them only watch
- It walks a single operating day on three lanes — what the market is doing, what the plant does about it, and the ceiling the whole day runs under — and shows why the bidding software is the revenue rather than a convenience
- A reference table assigns every number quoted about a storage plant to the layer that owns it, and says what you would actually observe if that layer were the one at fault
- It covers the choice between an inverter that follows the grid's wave and one that creates it, why that has moved from a preference to a tender requirement, and what it means when three different kinds of buyer ask for the same thing
- It closes on where control fails: a fault whose blast radius was set by the architecture years earlier, a mis-dispatch that voids a warranty silently, a converter that disconnects where it was contracted to stay connected, a control layer whose supplier is gone, and a plant that was available almost all year and still missed the hours that mattered

### Changed
- The BESS foundations track now runs four lessons and its summary describes what the walk covers today

## [v01.14g] — 2026-09-03 12:59:55 AM EST — v04.35r

### Added
- A new lesson closing out the grid-to-chip walk: why the traditional building power chain converts to direct current twice and throws one of them away, and what happens when that redundancy is designed out
- It sets three architectures side by side — the incumbent chain, the one standardised in China fifteen years ago, and the high-voltage direct-current chain arriving now — and explains why the whole argument comes down to a single relationship between voltage, current and heat
- It walks the new equipment: what each box replaces, where it physically stands, and which parts are shipping into existing halls today versus which commit a building to a new architecture
- It closes on where the approach fails — a stage deleted without a plan for the jobs it was quietly doing, an arc with no moment when it must go out, a commodity power supply pressed one voltage too far, and a retrofit that works per rack and fails per hall
- Reading the sources honestly is taught as part of the material: the efficiency figures quoted for the three architectures are not measured on the same basis, and the lesson says so rather than lining them up as a ranking

### Changed
- The grid-to-chip track now runs four lessons end to end, and its summary describes the walk as it currently reads

## [v01.13g] — 2026-09-02 11:38:08 PM EST — v04.34r

### Changed
- The lesson on the building's own power chain — service entrance to rack — now sits in the grid-to-chip track at its proper place in the walk, so the track finally reads end to end: the property line and the queue behind it, the power station a campus builds when that queue is too slow, then the chain inside the building
- The older two-lesson power track has been retired and replaced by a campus track that opens on why heat, rather than power, decides how much compute fits in a hall. Both lessons kept their identity through the move, so nothing you have already completed is reset

## [v01.12g] — 2026-09-02 11:04:43 PM EST — v04.33r

### Added
- A new lesson on what a campus does when its grid connection is still years away: building its own power station on site, the four kinds of machine that can burn the same gas, and what each one costs in fuel, in permitting and in delivery date
- The lesson covers why the waiting line moved from the utility to the engine factory, how an on-site power plant ends up designed with data-hall redundancy logic, and how four real campuses each answered the same problem differently
- It closes on where the approach fails — the air permit rather than the plant, machines that lose output at part load and in hot thin air, fuel that is a supply chain rather than a tank, a manufacturing slot that slips, and an island that cannot hold a load swinging in milliseconds

### Changed
- The data-center power track now runs two lessons in order, and its summary describes both

## [v01.11g] — 2026-09-02 10:36:47 PM EST — v04.32r

### Added
- A new lesson on how a site gets connected to the grid in the first place: the studies that gate it, the queue that forms behind them, the substation that arrives at the end, and the five different quantities a campus announcement can mean by "megawatts"
- The lesson closes on where the process fails — the date that moves, the equipment slot nobody reserved, energization treated as a formality, and the permit problem that looks exactly like an equipment problem
- A new track that walks the data-center power chain in physical order, starting at the property line. The new lesson opens it, and the rest of the walk is added as each part is written

## [v01.10g] — 2026-09-02 06:23:38 PM EST — v04.29r

### Fixed
- The drill now assembles its own list of available study-guide cards instead of relying on the page to send one, which is what stopped the drill from loading at all

## [v01.09g] — 2026-09-02 05:45:44 PM EST — v04.28r

### Added
- Storage and scheduling for the new drill: what you are due to review, when each card comes back, and a full history of how each one has gone over time. It follows your account across devices like the rest of your progress
- The drill only ever offers cards from material you are allowed to read — the same rule that governs which lessons you can open

## [v01.08g] — 2026-09-02 05:16:32 PM EST — v04.27r

### Changed
- Marking a section understood now records the date it happened, instead of only that it happened. This is what lets a lesson tell you it was revised after you read it. The record still follows your account across devices
- Sections marked before this version keep their mark and simply carry no date

## [v01.07g] — 2026-09-02 02:41:00 AM EST — v04.22r

### Changed
- Minor internal improvements

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
