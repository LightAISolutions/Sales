# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-22 07:55 PM EST (the session ran ~07:15 → 07:55 PM EST)
**Repo version:** v07.19r — one push on `claude/dreamy-ride-lt8z21` (E4 session 1 + this session-context write, one commit)
**Branch:** `claude/dreamy-ride-lt8z21`
**Model:** Fable 5.1 (E4 session 1 — attendance signals)

### What was done

- **E4 session 1 landed** (`Events.gs` v01.06g · `Events.html` v01.07w · `Network.gs` v01.11g · `Network.html` v01.21w; §11's E4 row → In progress — session 1; §13.13 written with the session-2 paste-in prompt): the weekly sweep `evSignalsRun_` (Tuesday 06:00 ET trigger, `eop=installsignals` / `signalsnow`) over every starred event plus the top ten recommended — Map Your Show through the gallery's JSON proxy (needs only `X-Requested-With: XMLHttpRequest`; RE+ 2026 answers all 1,214 exhibitors in one call, probed live from the session), a2z (fixture-only — no a2z URL in the registry today), the speaker roster (JSON-LD `performer` / HTML cards), the three newswires once per run; every hit matched by the exact normalised-name key (Network's `nwNormaliseCompany_` byte for byte) or the Profiler slug as words, written over the bridge's write leg with kind · confidence · evidence · `firstSeen` (+ the person for a speaker); a failed page one audit row; counts parked in `EV_SIGNALS_LAST`
- **The manual path** `eop=signal` on the event sheet (account · `linkedin-manual` / `registrant-mail` · link · one line · confidence), the **"Signals only" pill** over the cached score, the person named in the why, the **Attendance signals card** on the Proposed tab
- **Network's minimal leg (per the brief):** `nwPeerSignalsWrite_` now accepts a LinkedIn host on `linkedin-manual` only (before this it rejected every kind — the manual path could not have landed), the read leg carries the person, `nop=signals` session GET by account or contact, one "Will be at" line on both details
- **The two developer-approved extras:** the poller's past-date guard (`pastSkipped`; harness case, 67 checks) and `check-events-registry.py`'s `seats` validation (proved to fail on tampered copies)
- **Harnesses / verifiers:** `scripts/check-events-signals.js` (76 checks; Network's real far side in a second VM context; zero live calls), `check-events-score.js` 70, `check-peer-bridge.js` 61, `check-events-poller.js` 67, `check-events-registry.py` exit 0, `check-readme-tree.py` 0 findings, `verify-events-roles.py` and `verify-network-roles.py` ALL CHECKS PASSED at 390 × 844, zero page errors; the host grep clean on the served page and the `.gs`

### Where we left off

**The developer's live check is next** (§8's done-when, reported not asserted): redeploy Events and Network (both `.gs` changed), open the Proposed tab → Install signals (first `ScriptApp.newTrigger` may ask for the script's own authorisation — accept in the editor and tap again) → Signals now → read the status line (`Swept N events … signals found — written / updated`; `feeds[]` names each feed's status — **GlobeNewswire is unverified from this session's egress**), open RE+ 2026 → the why's "Accounts with a signal" should name every tagged account exhibiting there; then add one manual signal on the sheet and find it on the contact in Network (the "Will be at" line on the contact's detail). **Then E4 session 2** with the §13.13 paste-in prompt (given in chat at the close of this session) — fill in the two live-state brackets first.

### Open findings carried forward

- **RE+ 2026's speaker roster is a Swapcard iframe widget** (`connect.re-plus.events/widget/…/people/…`) — the sweep reads it as `no_roster_found`; reading Swapcard's API would be new scope (a decision, §13.13 says so)
- **GlobeNewswire's feed URL could not be reached from the session** (HTTP/2 reset / timeout at the proxy) — landed unverified; the first live Signals now answer says whether Google's egress reaches it
- **Business Wire's "home" channel is broken** on the site's side; the all-news channel parameter `G1QFDERJXkJeEFpRXg==` was found by probing the last byte of the channel value — if it ever answers an error document, re-probe the same way
- The series key for `RE+` normalises to two letters and is filtered (`< 3` chars) — press matches need the edition name ("RE+ 2026"), which the name key covers
- `pullAndDeployFromGitHub` never logs its outcome — fleet-wide TEMPLATE papercut, still deliberately unfixed
- Segment fit rewards narrow audiences — E5 scope if it still bothers the developer

### Key decisions made

- The brief's "minimal Network session leg" was built (four files bumped, not two) because the done-when's "shows on the contact" has no other surface — and because Network's write leg rejected a LinkedIn host on every kind, which would have refused the manual path outright
- The sweep's last-run state is a script property (counts only), not a tab — §5 says no Events tab for signals
- The matcher uses exact keys only (normalised name + Profiler slug as words) — "Tesla" never claims "Tesla Power Equipments"
- Signals now sweeps the pressing admin only; the trigger sweeps every owner with a Stars row
- Recording-by-manual-link (row 6) left to session 2's brief to decide the kind

### Active context

- **Repo version v07.19r.** `CHANGELOG.md` `Sections: 90/100` — no rotation due
- **Live versions:** `Events.html` v01.07w · `Events.gs` v01.06g · `Network.html` v01.21w · `Network.gs` v01.11g
- **Reminders still open** (developer's own — untouched): close out "Repo access denied" (the evidence exists; the old desk is deleted); the Megmeet briefing after the Network/Events build, before 2026-10-07
- **C2 Routine** fires Wednesday 2026-09-23 11:00 UTC — parallel pushes possible; check `git ls-remote` before pushing
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Do the live check first (redeploy both apps, Install signals, Signals now, read RE+ 2026's accounts, one manual signal found on the contact in Network), then run E4 session 2 with the §13.13 paste-in prompt — its two bracketed live-state fields filled from the panel's Signals now line.
- **To continue:** type `run E4 session 2 from §13.13`
