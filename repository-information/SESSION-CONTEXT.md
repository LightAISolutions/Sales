# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions


**Date:** 2026-09-22 11:02 PM EST (the session ran ~10:45 → 11:05 PM EST)
**Repo version:** v07.21r — one push on `claude/loving-einstein-yepfer` (E4 session 3 + this session-context write, one commit)
**Branch:** `claude/loving-einstein-yepfer`
**Model:** Fable 5.1 (E4 session 3 — the people route; **E4 is Done**)

### What was done

- **E4 session 3 landed** (`Scraper.gs` v02.22g · `Network.gs` v01.13g · `Network.html` v01.22w; §11's E4 row → **Done** with the three sessions' versions; §13.15 written — the N4 session-1 brief with its paste-in prompt): the Scraper's summarise call asks for `people[]` in the same single model call (≤ 5 per item, role ∈ quoted · author · named; `scPeopleParse_` bounds it; stored as `ppl` in the item's Signals blob; `SCRAPER_SIGNALS_CELL_MAX` 1500 → 2500) — **no second call, no back-fill**; `cop=people&slug=&since=` behind `NETWORK_CORPUS_TOKEN` alone (routed before the `CORPUS_TOKEN` gate; every boundary case flat `denied` with zero reads); Network's `nwPeopleProxy_`, `nop=people` (an uncovered account answers `covered:false` with no fetch; `accepted` per person) and `nop=peopleaccept` (one `press-quote` row at 0.7 with `corpus:<key>`, `Source = scraper`, the person, the contact match); the write leg's `corpus:` branch for `press-quote` only, the empty slug for `press-quote`, the person's name key in the press-quote upsert key; the page's **People in the press** list (read on a tap) with Accept per person and the "Will be at" line re-read in place
- `scripts/check-scraper-people.js` (62 checks, two VM contexts, zero live calls); `check-peer-bridge.js` / `check-events-signals.js` extract the new key helper (61 · 103 pass); `check-network-schema.py` allows `items` · `people` · `covered`; `verify-network-roles.py` gained the people pass — ALL CHECKS PASSED at 390 × 844; `check-events-registry.py` exit 0; `check-readme-tree.py` 0 findings; the host grep clean (the only `linkedin.com` is Network's manual-kind rule)
- `NETWORK-SCHEMA.md` §8 / §9 / §14 updated; CHANGELOG `Sections: 92/100`

### Where we left off

**The developer's live check is next** (reported, not asserted): set `NETWORK_CORPUS_TOKEN` to the same random 16+ character value in **both** Scraper's and Network's Script Properties (never committed), redeploy Scraper and Network (both `.gs` changed), let one digest build summarise an article (or run the summarise step) so an item carries people, open that company's account in Network → **Read the press** → accept one person → the "Will be at" line reads `press — press-quote 0.7 (Name, Title)`. **The three live-state brackets in this session's prompt were left unfilled** by the developer (the weekly sweep, the first Signals now line, the newsroom / docket rows) — carry them into the next live check. **Then N4 session 1** with the §13.15 paste-in prompt (given in chat at the close of this session); its two brackets are the corpus token and the first people read.

### Open findings carried forward

- **Back-fill is none by decision** — items summarised before `Scraper.gs` v02.22g never carry people; the route answers only new items (D17 had proposed a one-time admin job; the brief overrode it)
- An accept on an uncovered account with a pasted key is not refused server-side (the route is the guard — the page never offers Accept there); harmless, noted
- The `press` label on the "Will be at" line stands until N4's chips (as `?` does for a docket row)
- From session 2: the Scraper roster carries no FERC eLibrary RSS; RE+ 2026's roster is a Swapcard widget; "Combined Notice of Filings" items name applicants only in the body; GlobeNewswire's feed unverified until a live sweep is read
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- No back-fill (the brief's wording over D17's "one-time admin job")
- The empty event slug is accepted for `press-quote` (§3 already said "empty for a press quote with no event"); a fake slug was the worse alternative
- The press-quote upsert key includes the person's name key — one article quotes several people at one account; every other kind's key is unchanged
- `SCRAPER_SIGNALS_CELL_MAX` raised to 2500 and `ppl` dropped after `figs` in the blob's drop order — so the people list survives on rich articles without displacing the corpus metadata Profiler reads
- The people list is read on a tap, never on the detail open — one UrlFetch per tap, no poll (E3's on-demand pattern)
- `cop=people` is routed before the `CORPUS_TOKEN` gate so Profiler's token never opens it and the Network token never reaches the other cops

### Active context

- **Repo version v07.21r.** `CHANGELOG.md` `Sections: 92/100` — no rotation due
- **Live versions:** `Scraper.gs` v02.22g · `Network.html` v01.22w · `Network.gs` v01.13g · `Events.html` v01.08w · `Events.gs` v01.07g
- **Reminders still open** (developer's own — untouched): close out "Repo access denied"; the Megmeet briefing after the Network/Events build, before 2026-10-07
- **C2 Routine** fires Wednesday 2026-09-23 11:00 UTC — parallel pushes possible; check `git ls-remote` before pushing
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Do the live check first (the corpus token in both projects, redeploy Scraper and Network, one article summarised, its people read on the account and one accepted), then run N4 session 1 with the §13.15 paste-in prompt — its two bracketed live-state fields filled from Network.
- **To continue:** type `run N4 session 1 from §13.15`

