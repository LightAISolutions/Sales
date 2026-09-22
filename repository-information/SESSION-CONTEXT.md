# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-22 06:55 PM EST (the session ran ~05:55 → 07:05 PM EST)
**Repo version:** v07.18r — no version bump; one housekeeping push on `claude/ecstatic-maxwell-oticzd` (this session-context write only)
**Branch:** `claude/ecstatic-maxwell-oticzd`
**Model:** Fable 5.1 (E3 live-judgment session between E3 and E4)

### What was done

**No code changed.** This was the developer's E3 hand-off, judged live, plus the pre-E4 checks.

- **The seats' two segment lists are confirmed by the developer (2026-09-22).** `profiler-segments.json` → `seats` stands as written: storage-seller = developers and IPPs · utilities · capital · assurance · insurance; aidc-power-seller = landlords · hyperscalers · EPC · neoclouds · utilities (union of nine). The reasoning the developer endorsed: all five demand-tier segments plus capital, assurance and insurance from services, plus EPC and construction from build; the ten left out are the three supply, six build and software-and-optimization. The two borderline calls (software out, EPC in) were named and accepted. Sensitivity was measured: EPC touches 33 upcoming events, software 10, insurance 3. No file edit was needed
- **E3 judged live.** The Recommended list was accurate to the developer's own history (has attended DCD>Connect, RE+ and PTC; contacts go to Infocast). The developer changed `relevancePrior` in the Events spreadsheet's `Tuning` tab from 0.05 to **0.2** — live state, not in the repo — because WEF Davos ranked first on a perfect 3-tag segment fit despite relevance 1
- **Peer tokens** — the developer set both and believes them correct; this session could not verify them (script properties, and the session never calls the app). The page's own evidence: after pressing Recommended the status line reads `Ranked N upcoming events · X accounts · Y signals` when linked, or `Network not connected — scored without your accounts` when not; the sheet's Recommendation block shows the gold "Connect Network…" line when not. Told the developer exactly that
- **Routines rebuilt.** `list_triggers` shows six: earnings desk (weekdays 13:00 UTC), C2 weekly (Wed 11:00 UTC), Industry Guidance quarterly (15 Jan/Apr/Jul/Oct), Profiler quarterly (1 Jan/Apr/Jul/Oct), monthly opportunity-report drift check (1st 17:00 UTC), ACL health daily. The old earnings desk (`trig_01Uy…`) is gone. The API does not expose the attached repository, so the tie to `LightAISolutions/Sales` was confirmed by outcome, not by field: the new desk landed v06.96r on 2026-09-21 (IREN / Jinko / Oracle rows `lastRefreshed` 2026-09-21) and v07.16r (NOVONIX) on 2026-09-22 — the first commits a scheduled run has ever landed in this repo
- **E4 session 1 prompt** revised in chat with the two developer-approved extras: the poller's past-date guard (`evPollSource_`, kinds `new-event` / `new-edition`, plus a harness case) and a seats-block id check in `scripts/check-events-registry.py`. §13.12 in the design plan was NOT edited — the pasted prompt carries the extras and the E4 session records them when it flips §11

### Where we left off

**E4 session 1 is next**, in a fresh session, with the revised prompt given in chat at the close of this session (§13.12's paste-in plus the two extras above). Before it runs the developer should (1) press Recommended once more and read the status line — DCD>Connect and RE+ should now sit near 0.55 with WEF down near 0.41 if the 0.2 weight took; a `default weight used for relevancePrior` note means the Tuning cell did not parse; (2) confirm the status line does not say `Network not connected`. **C2 fires Wednesday 2026-09-23 11:00 UTC (04:00 PDT)** — its rebuilt Routine is armed; an E4 session running across that time must check `git ls-remote` before pushing (already in the prompt).

### Open findings carried forward

- **The poller proposes past editions** — now folded into the E4 session 1 prompt by developer approval (no longer deferred)
- **No checker validates `seats` ids** — folded into the E4 session 1 prompt likewise
- **`pullAndDeployFromGitHub` never logs its outcome** — fleet-wide TEMPLATE papercut, still deliberately unfixed
- **Segment fit rewards narrow audiences** (three matching tags score the same 1.0 as nine; a mega-show is penalised per supply-side tag — RE+ scores 0.57). A formula change, E5 scope if it still bothers the developer after the weight change

### Key decisions made

- Seats lists confirmed as-is; no tier rule
- `relevancePrior` 0.05 → 0.2 (live Tuning tab; the repo's `EV_TUNING_DEFAULTS` seed stays 0.05 — it is only the seed for an empty tab)
- The two E2-scope extras ride E4 session 1 rather than a separate session
- The "Repo access denied" reminder was **left active** — its evidence has now landed (v06.96r, old desk deleted) but it is the developer's note to close

### Active context

- **Repo version v07.18r.** `CHANGELOG.md` `Sections: 89/100` — no rotation due
- **Live versions:** `Events.html` v01.06w · `Events.gs` v01.05g · `Network.html` v01.20w · `Network.gs` v01.10g
- **Reminders still open** (developer's own — untouched): close out "Repo access denied" (evidence now exists; the old desk is already deleted); the Megmeet briefing after the Network/Events build, before 2026-10-07
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run E4 session 1 with the revised prompt (Fable 5.1 High, one session, one push): the weekly signals sweep, the manual signal form, the "Signals only" pill, `scripts/check-events-signals.js`, plus the poller past-date guard and the seats-id check; flip §11's E4 row to In progress — session 1 and write §13.13.
- **To continue:** type `run E4 session 1 from §13.12 with the two extras`

## Previous Sessions

### Session — 2026-09-22 05:30 PM EST (E3 build)

**Date:** 2026-09-22 05:30 PM EST (the session ran ~05:12 → 05:35 PM EST)
**Repo version:** v07.18r — one push on `claude/festive-noether-7wb1zr`, one commit (this session-context write rides in it)
**Branch:** `claude/festive-noether-7wb1zr`
**Model:** Fable 5.1 (E3 build session, §13.11)

### What was done

**E3 — the recommendation score — built end to end, one push (v07.18r; `Events.html` v01.06w, `Events.gs` v01.05g).**

- **`Events.gs` `eop=recommend`** (`evRecommend_`, behind `recommend`): the six §6 terms computed server-side over the upcoming registry from Network's scored accounts once over the bridge, each account's signals over the read leg (capped at 40, `signalsCapped`), the seats' segment sets from `profiler-segments.json` → `seats`, the dossier `lastUpdated` dates from `profiler-companies.json` for the salience decay (calendar months, 12-month half-life), `mentions[]`, and the owner's registered / attended stars for the conflict term (an event's own star never conflicts with itself). `evTuning_` seeds the empty `Tuning` tab once (six weights + a `regions` row, a Note each) and reads it on every score; a malformed or missing weight defaults and is named. `not_configured` degrades (`notConfigured: true`, `accountPresence` 0, everything else computed); an unreadable Pages file zeroes its term and is named under `unavailable[]`. Audit counts only
- **`Events.html`**: the **Recommended** pill on the Mine row (every press fetches — a Tuning edit needs no deploy) ranks the agenda into one "Recommended" section with rank + score chip per row; the sheet's placeholder became the **why panel** — score and rank, six term bars with weights and signed contributions, accounts by name (relationship, stage, stage weight, signal kind, confidence, evidence link), matched segments, mention chips into Profiler, starred conflicts as links, the Tuning line. Fetched on demand only: the pill, a sheet opened before any score, return to the tab or a star write while ranked
- **`profiler-segments.json` gained a `seats` block** — the one judgment call of the session. §12.6 says the seats' segments are "read from `profiler-segments.json` at run time, never a copy", but the file carried no seat → segment mapping; the two seats' buyer segments are taken from `C5-SALES-SIMULATIONS-DESIGN.md` §9's inventory (storage-seller: developers and IPPs, utilities, capital, assurance, insurance; aidc-power-seller: landlords, hyperscalers, EPC, neoclouds, utilities — union of nine). Documented in `PROFILER-SCHEMA.md`. **The developer should confirm the two sets** — a segment added or removed there changes `segmentFit` for every event
- **`scripts/check-events-score.js`** — 70 checks, every term hand-computed on three fixture events; **`scripts/verify-events-roles.py`** — the Recommended pass (one request, re-ordered rows with chips, the why names the stub account and its evidence link, unpress restores the months); zero page errors at 390 × 844
- Docs: `EVENTS-SCHEMA.md` §5 / §6 / §12, `PROFILER-SCHEMA.md` seats row, design plan §11 E3 → **Done — v07.18r**, **§13.12 written** (the E4 brief, three sessions, with session 1's paste-in prompt), README tree, the three changelogs

### Where we left off

**E3 is built and verified offline; it is NOT yet judged live.** The hand-off the brief asks for is the developer's: redeploy `Events.gs` (`pullAndDeployFromGitHub` from the editor's Run dropdown — never Deploy → New deployment), open Events, press **Recommended**, open the top five and judge each *why* line by line against their own account list, then change one weight in the `Tuning` tab of the Events spreadsheet and press again. Until both peer tokens are set on the live deployments the panel reads "connect Network to score by account" and `accountPresence` is 0 — the list still ranks on the other five terms. **`accountPresence` is mostly 0 until E4 lands** (only Network's manual signals feed it) — this is expected, not a defect. **E4 session 1 is next — §13.12**; its paste-in prompt was given in chat at the close of this session.

### Open findings carried forward (not E3's, not fixed)

- **The poller proposes editions that have already happened** (from the v07.17r session): `evPollSource_`'s item loop has no past-date guard for the `new-event` / `new-edition` kinds; ~5 lines + a harness case in E2 scope. The 33-row queue very likely holds history to hand-reject. Fix in a small E2-scope session or fold into E4 session 1 only if the developer says so
- **`pullAndDeployFromGitHub` returns its outcome and never logs it** — fleet-wide TEMPLATE papercut, deliberately not fixed ([PC-TEMPLATE-PROP] #19 would make it a 10-project push)

### Key decisions made

- **The seat → segment map lives in `profiler-segments.json`, not in Events** — §12.6 forbids a copy; the alternative (a tier rule: demand + services) differs from the C5 inventory by two segments (adds software, drops EPC) and was rejected as a silent substitution
- **`monthsSinceNewestMention` is calendar months from the newest mentioning dossier's `lastUpdated`** — `mentions[]` carries no date; the companies registry is the only dated public layer that maps a slug to a revision
- **Same-country for `proximity` is derived from the registry** (the country of every event carrying a preferred region) rather than a second Tuning row — an empty `regions` row scores 0 everywhere, per §5.4's "optional"
- **One account counts once, at its strongest signal**, in `accountPresence` — otherwise an exhibitor + speaker pair for one account would double-count
- **`channel` scores as a partner (0.5)**; a `target` past `none` (`post-award` / `won` / `lost`) scores 0.4 — the §6 table named neither; both are now written into §6
- **Every press of the pill fetches** — the done-when is "changing a weight reorders them without a deploy", so caching across presses would hide the change
- **Session context folded into the single push** — the prompt said "one push … and remember session"; a second push would have had to wait for the auto-merge to delete the branch

### Active context

- **Repo version v07.18r.** `CHANGELOG.md` `Sections: 89/100` — no rotation due (rotation at >100)
- **Live versions after deploy:** `Events.html` v01.06w · `Events.gs` v01.05g · `Network.html` v01.20w · `Network.gs` v01.10g
- **Peer tokens** `EVENTS_PEER_TOKEN` / `NETWORK_PEER_TOKEN` — same value on both deployments; still unverified by any session. E3 degrades without them; E4 session 1's write leg needs them
- **Playwright** is `pip install playwright` + the pre-installed Chromium at `/opt/pw-browsers`. Per-container
- **Reminders still open** (developer's own — untouched): close out the "Repo access denied" issue and rebuild C2 before **Wednesday 2026-09-23 04:00 PDT**; the Megmeet briefing after the Network/Events build, before 2026-10-07
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Judge E3 live first (redeploy, press Recommended, the top five line by line, one weight change) — then run E4 session 1 from §13.12: the weekly signals sweep (Map Your Show / a2z exhibitor diff, speaker roster, the three newswire feeds), the manual signal form, the "Signals only" pill, `scripts/check-events-signals.js` and the verifier's signals pass; flip §11's E4 row to In progress — session 1 and write §13.13. **Fable 5.1 High, one session, one push.**
- **To continue:** type `run E4 session 1 from §13.12`


