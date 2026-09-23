# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-22 10:45 PM EST (the session ran ~10:26 → 10:45 PM EST)
**Repo version:** v07.20r — one push on `claude/relaxed-mayer-lbrzvz` (E4 session 2 + this session-context write, one commit)
**Branch:** `claude/relaxed-mayer-lbrzvz`
**Model:** Fable 5.1 (E4 session 2 — newsroom pages, agendas, the docket watch)

### What was done

- **E4 session 2 landed** (`Events.gs` v01.07g · `Events.html` v01.08w · `Network.gs` v01.12g; `Network.html` v01.21w untouched; §11's E4 row → In progress — session 2; §13.14 written with the session-3 paste-in prompt): on session 1's run, never a fork — **newsroom / "meet us at" pages** per `target` account with a `newsroomUrl` (now carried on `nop=accounts` when set), read monthly (the day parked per account id in the script property `EV_SIGNALS_NEWSROOM`, 28-day skip, a failed page retried), matched on each target event's name or its series with the year within 400 characters → `newsroom` 0.7 with the person the page names; **agendas** at `agendaUrl` through the roster parser → `agenda` 0.9 with the person (same-URL-as-roster read once); **recordings decided as a manual row of `kind = agenda`** (the form's third option, the note prefixed `Recording:`); **the docket watch** once per run over the Federal Register's FERC feed (the Scraper roster's `fedreg-ferc` row byte for byte) per watched account whose segments name a docket segment found by name in `profiler-segments.json` → `docket` 0.7, the filing as evidence, **no event slug** — Network's write leg accepts the empty slug for `docket` only, the score never counts it
- `scripts/check-events-signals.js` 76 → **103 checks**, zero live calls; `check-events-score.js` / `check-peer-bridge.js` / `check-events-poller.js` / `check-gas-inner-scripts.js` still pass; `check-events-registry.py` exit 0 after its own `--fix-past` flipped two iMasons rows that ended 2026-09-22 (the `.ics` rebuilt, 69 confirmed); `check-readme-tree.py` 0 findings; `verify-events-roles.py` and `verify-network-roles.py` ALL CHECKS PASSED at 390 × 844, zero page errors; the host grep clean (the only `linkedin.com` is Network's manual-kind rule)
- `EVENTS-SCHEMA.md` §3 / §8 and `NETWORK-SCHEMA.md` §3 / §8 updated; CHANGELOG `Sections: 91/100`

### Where we left off

**The developer's live check is next** (reported, not asserted): redeploy Events and Network (both `.gs` changed), open the Proposed tab → Signals now → read the status line (`Swept N events (P pages read …)`; the answer's `newsrooms{}` and `dockets{}` and `feeds[]` now carry a `fedreg-ferc` row), then open a target account with a Newsroom URL in Network and read its "Will be at" line — a newsroom row names the show, a docket row reads `? — docket 0.7` with the filing link (the `?` stands until N4's chips). Add a recording on an event sheet (the third kind) and find it on the account. **The two live-state brackets in this session's prompt were left unfilled** by the developer (whether the weekly sweep is installed and what the first Signals now line read) — session 3's prompt carries three brackets; fill them before pasting. **Then E4 session 3** with the §13.14 paste-in prompt (given in chat at the close of this session).

### Open findings carried forward

- **The Scraper roster carries no FERC eLibrary RSS** — FERC's own site is `blocked` (Cloudflare challenge); the docket watch reads the roster's Federal Register FERC feed, whose item titles name the filer. "Combined Notice of Filings" items name their applicants only in the document body — a per-item fetch would be new scope (a decision)
- **RE+ 2026's speaker roster is a Swapcard iframe widget** — reads as `no_roster_found`; its agenda URL (`re-plus.com/schedule/`) is likely the same widget — reading Swapcard's API would be new scope (a decision)
- **GlobeNewswire's feed** landed unverified in session 1 — read the first live sweep's `feeds[]`
- A docket row shows as `? — docket 0.7` on Network's "Will be at" line (no event to name) until N4's chips
- The series key for `RE+` normalises to two letters and is filtered — newsroom and press matches on that show need the edition name ("RE+ 2026"), which the name key covers
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed

### Key decisions made

- Recordings enter as a manual `agenda` row (the brief's least-scope answer) — no recording kind in Network; the form gained the option, so `Events.html` bumped and the verifier's kinds list changed
- The docket watch reads the Federal Register FERC feed (the roster's row) — no outlet added, FERC's own site never fetched
- Newsroom pages are read for `target` accounts only (the brief's wording); customer and partner pages are never fetched (asserted)
- The newsroom skip state is a script property keyed by account id (ids only), not a tab — §5 says no Events tab for signals
- The docket segment ids are found by segment name at run time (`utilit` · `ipp` · `developer`), never hard-coded
- `check-events-registry.py --fix-past` was run because the checker prescribes it and exit 0 is a required verification — two rows that ended 2026-09-22 are now `past`

### Active context

- **Repo version v07.20r.** `CHANGELOG.md` `Sections: 91/100` — no rotation due
- **Live versions:** `Events.html` v01.08w · `Events.gs` v01.07g · `Network.html` v01.21w · `Network.gs` v01.12g
- **Reminders still open** (developer's own — untouched): close out "Repo access denied"; the Megmeet briefing after the Network/Events build, before 2026-10-07
- **C2 Routine** fires Wednesday 2026-09-23 11:00 UTC — parallel pushes possible; check `git ls-remote` before pushing
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Do the live check first (redeploy both apps, Signals now, read a newsroom row and a docket row on an account in Network, add one recording), then run E4 session 3 with the §13.14 paste-in prompt — its three bracketed live-state fields filled from the panel and from Network.
- **To continue:** type `run E4 session 3 from §13.14`
