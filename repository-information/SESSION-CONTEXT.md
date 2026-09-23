# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-23 01:20 AM EST (the session ran ~12:54 → 01:25 AM EST)
**Repo version:** v07.23r — one push on `claude/exciting-knuth-3pb083` (N4 session 2 + this session-context write, one commit)
**Branch:** `claude/exciting-knuth-3pb083`
**Model:** Fable 5.1 (N4 session 2 — the pre-meeting brief, promote to field note, the network map and the "Will be at" chips; **N4 is Done**)

### What was done

- **N4 session 2 landed** (`Network.gs` v01.15g · `Network.html` v01.24w; §11's N4 row → **Done** with both sessions' versions; §13.17 written — the E5 session-1 brief with its paste-in prompt): `nop=brief` (session GET, behind `contacts`) assembles the contact's own rows server-side — the contact minus the raw extraction and card links, the account, every Interaction newest first, the account's Signals named by Events, the warmth block, the stage — and writes the D9 disclosure row (`network_brief rows=1 ids=<c- id>`) + a `data_export` audit; the page builds a **real `.docx`** (three-part OOXML over the existing store-only zip) adding the served dossier's `strategyRead[]` and last five `recentDevelopments[]` when covered. `nop=promote` (body-POST) copies one Interaction into Profiler's intake **through Profiler's existing note op** (`action=note` · `nop=submit` at `PROFILER_INTAKE_EXEC`) as a `sourceType: contact` note with the developer's 0–100 confidence, the i- id as evidence in the text, the account's slug or `general`; the developer's own Profiler session is read by the page from the shared origin (`localStorage` `ov_note_session`) and relayed once, never stored or audited; the promotion is recorded as a `note` Interaction (`promoted:<i- id>:<intake id>` — the duplicate guard; the source row untouched). `nop=signals` gains `eventName` / `eventStart` / `events` / `eventsConfigured` from one `eop=signals` call per read, degrading to slugs. The page: the 📄 Brief button and the ⇈ Promote box on the detail, the "Will be at" chips (press quotes as "Quoted in press", filings as "Regulatory filing"), the 🕸 Map masthead card (vanilla SVG over the list payload; pan, tap-to-focus, a second tap opens the row — the tap decided on `pointerup`, because a captured pointer's click never reaches the node)
- `scripts/check-network-brief.js` (58 checks, zero live calls — it caught the empty-string confidence that rounded to 0 and passed the bound; fixed); `verify-network-roles.py` gained the chips · brief (the `.docx` unzipped and read back) · promote · map passes and the D17 grep — ALL CHECKS PASSED at 390 × 844, zero page errors; `check-scraper-people.js` extracts the three new signal helpers; every sibling harness passes; `check-readme-tree.py` 0 findings
- `NETWORK-SCHEMA.md` §8 / §11 / §12 / §14 updated; CHANGELOG `Sections: 94/100`

### Where we left off

**The developer's live check is next** (reported, not asserted): confirm the Network redeploy (`?action=api&op=deploy` → `Already up to date (v01.15g)`, else run `pullAndDeployFromGitHub` once), open a contact detail → **📄 Brief** → open the `.docx` in Word (a covered and an uncovered contact per §8's done-when), sign in to Profiler in the same browser → **⇈** on one touch → Promote at a confidence → find `note-<date>-NN` in Profiler's intake Manage panel, read the **Will be at** chips on an account with signals (the event names need `EVENTS_PEER_TOKEN` on Network and `NETWORK_PEER_TOKEN` on Events — both are set), open **🕸 Map**. **The three live-state brackets in this session's prompt were left unfilled** (the warmth chips, the reconnect list, the confirmed `.ics` row) — do both checks together. **Then E5 session 1** with the §13.17 paste-in prompt (given in chat at the close of this session); its four brackets are the brief, the promotion, the chips and the map.

### Open findings carried forward

- The `.docx` carries no `styles.xml` — headings are bold runs; Word, Pages and LibreOffice open such a package, but a corporate template will not style it. Add a styles part only if the developer asks
- A promote needs the developer signed in to Profiler in the same browser — the page reads Profiler's own `ov_note_session` key (same origin); an expired Profiler session is relayed as `profiler_session_expired` with nothing written
- The chips' event names ride Events' `eop=signals`, which round-trips through Network's peer read leg — one detail open is one Events call plus one Network peer read; with either token unset the chips show slugs
- The map draws the list **as filtered** — a contact outside the current filter is not a node; the status line says "of N (the list is filtered)"
- From N4 s1: the `.ics` DESCRIPTION is never read; do-not-contact contacts are excluded from the reconnect list; two `.gs` regex literals use `\x22` / `\x27` for quote marks (the shared extractor reads a quote inside a regex as a string opener — keep that convention)
- From E4: the Scraper roster carries no FERC eLibrary RSS; RE+ 2026's roster is a Swapcard widget; GlobeNewswire's feed unverified until a live sweep is read; no back-fill of `people[]`
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- The `promoted:<i- id>:<intake id>` marker lives on a **new `note` Interaction**, never on the source row's Evidence Link (§3 gives that column to the row's own evidence); the marker is also the duplicate guard
- The promote relays the developer's Profiler session server-side in one call (the page reads it from the shared origin) rather than posting from the page — one op, the duplicate refused before any call, the note Interaction written in the same op; the session is never stored, logged or audited
- An uncovered account promotes to the intake's `general` slug with the company named in the text; a slug not matching `NW_PEER_SLUG_RE` also falls back to `general`
- The brief is a real `.docx` (not the `.doc` HTML-in-Word of the Profiler precedent) so the verifier can unzip and read its paragraphs; built over the existing store-only zip, no library
- The map tap is decided on `pointerup` (a captured pointer's `click` lands on the svg, not the node); a drag under 6 px is a tap

### Active context

- **Repo version v07.23r.** `CHANGELOG.md` `Sections: 94/100` — no rotation due
- **Live versions:** `Network.html` v01.24w · `Network.gs` v01.15g · `Events.html` v01.08w · `Events.gs` v01.07g · `Scraper.gs` v02.22g
- **Reminders still open** (developer's own — untouched): close out "Repo access denied"; the Megmeet briefing after the Network/Events build, before 2026-10-07 (the Network/Events build now stands at E5 + X + Q remaining)
- **A parallel branch `claude/adoring-brown-mvddj2` was on the remote during this session** — not this session's; check `git ls-remote` before pushing
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Do the live check first (the redeploy, one brief in Word for a covered and an uncovered contact, one promotion found in Profiler's intake, the chips on an account with signals, the map), then run E5 session 1 with the §13.17 paste-in prompt — its four bracketed live-state fields filled from Network.
- **To continue:** type `run E5 session 1 from §13.17`

## Previous Sessions

**Date:** 2026-09-23 12:53 AM EST (the session ran ~12:21 → 12:55 AM EST)
**Repo version:** v07.22r — one push on `claude/amazing-cerf-xlaqav` (N4 session 1); this session-context write is a second, no-bump push on the same branch name restarted from `origin/main`
**Branch:** `claude/amazing-cerf-xlaqav`
**Model:** Fable 5.1 (N4 session 1 — warmth, the reconnect list and the import panel; **N4 is In progress — session 1 done**)

### What was done

- **N4 session 1 landed** (`Network.gs` v01.14g · `Network.html` v01.23w; §11's N4 row → **In progress — session 1 done**; §13.16 written — the N4 session-2 brief with its paste-in prompt): warmth and cadence **computed on every read, stored nowhere** (`NETWORK-SCHEMA.md` §5 rewritten as built — weights meeting 2 · call 1.5 · email-in 1.2 · calendar 1.5 · email-out 1 · scan 1 · linkedin 0.5 · note 0.3, halving every 90 days; hot ≥ 2 · warm ≥ 0.75 · cool ≥ 0.2; cadence 30 / 60 / 90 / 180 per role × relationship); `warmth` + `warmthBand` on every list row from the same single read of the Interactions tab as `lastTouch` (`nwTouchPass_`), the `warmth` block on the detail; `nop=reconnect` (most overdue first, do-not-contact rows left out); `nop=import` (a pasted `.ics` or mail CSV parsed **server-side** into a proposal list matched by email — unmatched addresses proposed and never written, the developer's own address skipped, already-recorded rows marked duplicate) and `nop=importconfirm` (only the ticked rows as `email-in` / `email-out` / `calendar` Interactions; Evidence = the developer's reference · the UID or Message-ID; one line as Summary, never a body). The page: the warmth chip with legend on rows and the detail, the Warmth sort live, the 🔥 Reconnect card (Draft per row / for the ticked → the N3 drafts flow), the ⇪ Import touches panel
- `scripts/check-network-warmth.js` (66 checks, zero live calls); `verify-network-roles.py` gained the warmth · reconnect · import passes, the D15 grep names `CalendarApp` — ALL CHECKS PASSED at 390 × 844, zero page errors; `check-network-schema.py` allows `matched` · `unmatched`; every sibling harness still passes; `check-readme-tree.py` 0 findings
- `NETWORK-SCHEMA.md` §5 / §12 / §14 updated; CHANGELOG `Sections: 93/100`

### Where we left off

**The developer's live check is next** (reported, not asserted): confirm the Network redeploy (`?action=api&op=deploy` → `Already up to date (v01.14g)`, else run `pullAndDeployFromGitHub` once), read the warmth chips against three known contacts and the Warmth sort, open 🔥 Reconnect and tap Draft on one row (the drafts panel opens with that recipient), paste one `.ics` into ⇪ Import touches → Propose → type a reference → Record → `✓ 1 touch recorded`. **The two live-state brackets in this session's prompt were left unfilled** (the corpus token, the first people read) — the E4 s3 check may still be pending; do both checks together. **Then N4 session 2** with the §13.16 paste-in prompt (given in chat at the close of this session); its three brackets are the chips, the reconnect list and the confirmed `.ics` row.

### Open findings carried forward

- The `.ics` DESCRIPTION is never read and no CSV body column is ever mapped — by design (D15 / D9); a CSV whose header lacks a Date column or a To / From column is refused by name (`csv_columns`)
- Do-not-contact contacts are excluded from the reconnect list (a nudge is a draft; D9 excludes them from every draft) — recorded in §5
- The `press —` / `?` labels on the "Will be at" line stand until N4 session 2's chips
- Two regex literals in the N4 `.gs` code use `\x22` / `\x27` for the quote marks — the shared harness extractor reads a quote inside a regex as a string opener; keep that convention in new `.gs` regexes
- From E4: the Scraper roster carries no FERC eLibrary RSS; RE+ 2026's roster is a Swapcard widget; GlobeNewswire's feed unverified until a live sweep is read; no back-fill of `people[]` for items summarised before `Scraper.gs` v02.22g
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- Warmth rides the list op's existing single read of the Interactions tab (`nwLastTouch_` now delegates to `nwTouchPass_`) — no second read, no column
- The reconnect list measures a contact with no Interaction from its met date and skips one with neither
- The import's duplicate key is contact · kind · day · line — a re-paste proposes those rows as already recorded, a re-confirm refuses them
- The three import kinds only (`email-in` · `email-out` · `calendar`) — a `scan` or `meeting` through the import path is refused as `bad_kind`
- The page mirrors the three legend constants byte for byte (asserted by the harness) and never computes a score

### Active context

- **Repo version v07.22r.** `CHANGELOG.md` `Sections: 93/100` — no rotation due
- **Live versions:** `Network.html` v01.23w · `Network.gs` v01.14g · `Events.html` v01.08w · `Events.gs` v01.07g · `Scraper.gs` v02.22g
- **Reminders still open** (developer's own — untouched): close out "Repo access denied"; the Megmeet briefing after the Network/Events build, before 2026-10-07
- **C2 Routine** fires Wednesday 2026-09-23 11:00 UTC — parallel pushes possible; check `git ls-remote` before pushing
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Do the live check first (confirm the redeploy, the warmth chips against three known contacts, Reconnect → Draft, one `.ics` row confirmed), then run N4 session 2 with the §13.16 paste-in prompt — its three bracketed live-state fields filled from Network.
- **To continue:** type `run N4 session 2 from §13.16`


Developed by: LightAISolutions
