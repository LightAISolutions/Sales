# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-22 01:08:08 AM EST (push timestamp; the session ran ~12:50 → 01:20 AM EST)
**Repo version:** v07.07r — one push: `5169babd` v07.07r (E1 session 1 — the Events scaffold and the agenda) on `claude/ecstatic-mayer-qe6sgq` restarted from `origin/main` at `6884a411`; auto-merged to `main`.
**Branch:** `claude/ecstatic-mayer-qe6sgq`
**Model:** Fable 5.1 High (E1 brief, §13.7, session 1 of two)

### What was done

**E1 session 1 is landed — §11's E1 row reads *In progress — session 1, v07.07r*; steps 1–4 of §13.7 done, steps 5–8 (session 2) untouched.**

- **`Events.html` v01.01w / `Events.gs` v01.01g** scaffolded by `scripts/setup-gas-project.sh` from the auth template (`hipaa`, fleet `CLIENT_ID`, `ACL_PAGE_NAME: Events`, `PORTAL_ICON: 📅`), then the N0-style hand edits: `events.webmanifest` + `images/events-icon-192/512.png`, the `manifest-src 'self'` PROJECT OVERRIDE on both CSP tags, no service worker, `HEARTBEAT_INTERVAL` 600 s and `DATA_POLL_INTERVAL: 0` on both sides, `op=quota` + `op=aclhealth` ported verbatim from `Network.gs`. The fleet Master ACL id (`1kG2K…UvE`) was set by hand — the Global ACL config the script defaults from still carries its placeholder.
- **The door, both sides** (`EV_ROLE_CAPS` admin: `calendar` · `recommend` · `plans` · `signals` · `roster` · `tuning`; the other three tiers empty; `evAdmitted_` / `evAdmitted()`), `scripts/verify-events-roles.py` passing at 390 × 844 — admin: the agenda (99 rows), exactly one `eop=list` and one registry fetch; contributor / analyst / viewer: the turned-away card, zero requests, **no registry fetch either**; `?as=` only subtracts; zero page errors; the sheet opens with `dates=` / `ctz=` and the `.ics` download, Escape closes it.
- **`ensureEventsTabs_()`** creating all five §5 tabs (`Stars` · `Plans` · `Meetings` · `Proposed` · `Tuning`) plus `Shares` · `Profiles`; `EV_ID_RE` / `evNewId_` (`st-` `pl-` `mt-` `pr-`); ownership helpers verbatim from Receipts via Network; `eop=list|star|unstar|note` in the PROJECT regions only, body-POST for the writes, Attending enum-validated, audit rows ids + counts only.
- **The agenda**: relative fetch of `events-data/events.json` (+ `profiler-segments.json` and `profiler-companies.json` for labels), month → day groups under a sticky month header, an IntersectionObserver month-in-view label in the masthead, a Today pill, past editions behind a fold; rows name · dates · place · kind + star toggle, no ids or numbers on a card; `evPlace()` tolerates empty city / region / venue (18 / 31 / 68 rows) without a stray separator; tentative rows say so. Filters: kind, region (state codes with ≥ 3 events + Abroad), audience segment (scrolling pill strip), ★ Starred, and **"Signals only" present but disabled, noted "from E4"**.
- **The detail sheet**: organiser, venue, where, status badge (tentative rows are said to be tentative — 27 rows, 11 of them permanently unverifiable from a server), tierNote, the links, audience by name, `mentions[]` chips → `Profiler.html#<slug>`, the sources line with `lastConfirmed`; **Add to Google Calendar** (§9 template URL) and **Download .ics** (hand-rolled RFC 5545, 75-octet folding, CRLF, escaping, stable `UID:<slug>@events.lightaisolutions.github.io`); star / attending / note through `eop=note`.
- **Docs**: CHANGELOG v07.07r (the previous session's `[Unreleased]` SESSION-CONTEXT entry absorbed), **rotation fired** — the 2026-09-16 group (25 sections, v06.05r–v06.29r) archived with all 25 SHAs resolved, `Sections: 78/100`; README tree (page description, `events.webmanifest`, `verify-events-roles.py`, v01.01w · v01.01g); REPO-ARCHITECTURE flowchart nodes + URL regenerated and verified (9,569 chars); `diagrams/Events-diagram.md`, the GAS Projects row and the `Deploy Events` workflow step by the script.

### Where we left off

**Session 1 is merged; session 2 has not started.** Two ids are still placeholders and are the developer's step, not a session's: **`SPREADSHEET_ID`** (the "own spreadsheet" — N0 had one supplied up front; this session ran unattended with none) and **`DEPLOYMENT_ID`** (recorded the N0 way after the deploy). Until both are real the live page shows the calendar with "Stars are not connected yet" and `ensureEventsTabs_()` throws `SPREADSHEET_NOT_CONFIGURED`. The deploy hand-off steps are in the v07.07r CHANGELOG Notes (the N0 list, including the Manage deployments → New version bootstrap lesson).

The chat hand-off named what to check on the phone once deployed: the agenda opens at today's month with the month named in the masthead; a starred event shows ★ on its row and in the Starred count; the Calendar link opens Google Calendar prefilled with the dates and the event's time zone; the `.ics` imports.

### Key decisions made

- **The note rides on the `eop=list` row** (id · slug · attending · **note** · updatedAt) rather than behind a separate detail op — the sheet shows it, there is no `eop=get` in the brief's four ops, and a per-open detail request would cost an execution each time under D14. Nothing about people is in this app, so the minimum-necessary principle is not strained.
- **`eop=unstar` hard-deletes the row** — `Stars` has no `Deleted At` column in §5, and a star is not a record about a person (the D8 soft-delete reasoning does not apply). **`eop=note` on an unstarred event stars it** — a note implies interest.
- **A turned-away tier fetches nothing, not even the public registry** — the denied card is the whole of a denied load; the verifier asserts it.
- **Region pills are derived from the registry** (state codes with ≥ 3 events + "Abroad") rather than a hand-kept list, so E2's `events sync` never has to touch the page for a new state.
- **`op=quota` / `op=aclhealth` were copied from `Network.gs`**, not inherited from the template file — the auth template in `live-site-pages/templates/` still lacks them; the brief's "shared template region" is the region N0 defined in Network. The template itself was not edited ([PC-TEMPLATE-PROP] #19 not triggered).
- **A JS comment naming the two GitHub hosts was reworded** so a grep-based [PC-PRIVATE-REPO] #18 audit never matches `Events.html`.

### Active context

- **Repo version v07.07r.** `CHANGELOG.md` `Sections: 78/100` after the rotation — no rotation is due for a while.
- **Placeholders in `Events.config.json` / `Events.gs`**: `SPREADSHEET_ID`, `DEPLOYMENT_ID` (page `_e = ''`). The Deploy Events workflow step no-ops until the deployment id is real.
- **Parallel sessions were live** (`claude/adoring-brown-mvddj2` on the remote at session start). `MULTI_SESSION_MODE` is `Off` — every session restarts its branch from `origin/main` and checks `git ls-remote` before pushing.
- **Reminders still open**: close out the "Repo access denied" issue after Monday's two earnings-desk runs (C2 must be rebuilt before Wednesday 2026-09-23 04:00 PDT); the Megmeet briefing prompt runs after the Network/Events build, before 2026-10-07 (`repository-information/megmeet-briefing-prompt.md`).
- **Playwright** is `pip install playwright` + the pre-installed Chromium at `/opt/pw-browsers` (no `playwright install`); Pillow was `pip install pillow`. Both are per-container.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open a Fable 5.1 High session and run E1 session 2** — §13.7 steps 5–8: `scripts/build-events-ics.py` writing `live-site-pages/events-data/events.ics` (every `confirmed` event, `X-WR-CALNAME`, stable UIDs) wired into `check-events-registry.py`'s `.ics` walk, the Subscribe pill with the `webcal://` URL, the read-only day-plan tab, the Playwright phone pass (month header sticks across a month boundary, sheet opens/closes, a star round-trips through the stub, one event's ICS parses, the Calendar href carries `dates=` / `ctz=`, screenshots of month / agenda / detail, zero page errors), then flip §11's E1 row to Done and write the B brief as §13.8. The prompt was handed over in chat at the close of this session. If the developer has created the spreadsheet and deployed by then, record both ids in that session (the N0 way) before the phone pass.
- **To continue:** type `run E1 session 2`

## Previous Sessions

**Date:** 2026-09-22 12:43:01 AM EST
**Repo version:** v06.95r at the time of the push — **the repo is now at v07.06r**; a parallel Opus 5 session (`claude/repo-access-denied-339rna`) landed eleven versions beside this one. One push here: `5b1c9e5` v06.95r (E0 — the Events registry and source roster) on `claude/ecstatic-cannon-ilvoq2` restarted from `origin/main`; merged to `main`.
**Branch:** `claude/ecstatic-cannon-ilvoq2`
**Model:** Opus 5 xhigh (E0 brief, §13.4)

### What was done

**E0 is Done (§11 flipped, v06.95r) — research and data only; nothing under `Events.html` / `Events.gs`, which is E1.**

- **`live-site-pages/events-data/events.json` — 100 events: 72 `confirmed`, 27 `tentative`, 1 `past`.** `confirmed` means an organiser page was read this session (WebFetch, or organiser-host JSON-LD); the `past` row (NAATBatt 2026) was organiser-read too and the checker flipped its status. No row is ever `confirmed` on a third-party listing. Every `tentative` row carries a `manual` source and a `tierNote` saying exactly why — eleven because the organiser blocks non-browser clients, the rest because the organiser publishes no dates for that edition.
- **`events-sources.json` — 58 roster rows, every one probed live before it was written** (HTTP status, `Event`/`VEVENT` count, newest item, robots for the fetched path). **24 blocked**, each with reason + date: `cloudflare-challenge` on OCP, DCD, Enlit, 10times, SEMI and Gartner; `403-akamai-non-browser` on CERAWeek; `403-datadome` on Reuters; `403-azure-waf` on GCPA and NAATBatt; `no-feed` on Uptime, Hannover, Ignite, EEI, NARUC, Hot Chips; 404/503/DNS on Solar & Storage Live, SNEC, CIBF, ESIE, IDEE, Battery Japan, AMD. **11 live JSON-LD feeds**, two of them new to the plan — **iMasons (11 `Event` objects) and ESIG (12)**, which between them carry the whole sub-mega/social tier.
- **`scripts/extract-corpus-events.py`** — 33 corpus events (not 31; §1's count was measured at v06.70r), **256 `mentions[]` rows across 90 dossiers onto 32 registry rows**, every corpus event with ≥ 1 mention. Idempotent, `--check` / `--report`.
- **`scripts/check-events-registry.py`** — every `EVENTS-SCHEMA.md` §12 assertion plus two earned here: a `confirmed` row needs a source whose `kind` is not `manual`, and no event source may have a LinkedIn / 10times / Google-News host. Exits 0. `--fix-past` flips status only; it fired once, on NAATBatt.
- **Appendix A caveats resolved**: the DCD New York 2027 conflict is recorded *unresolved by design* (Clocate's JSON-LD says 17–18 Mar at the NY Marriott Marquis, a second listing says 17–18 May, DCD is Cloudflare-blocked); NAATBatt's weak Aug 2027 row is **dropped** (organiser publishes only Feb 9–12 2026); **Wood Mackenzie NA Power & Renewables (Apr 28–29 2027, Omni Interlocken) and Datacloud USA (Aug 31–Sep 2 2027, Fairmont Austin) are now dated and confirmed**. Three seed errors corrected: ACP Siting + Permitting and ACP PEAK are two events, not one; Energy Storage Summit USA 2027 moves to the Renaissance Dallas at Plano; six third-party-sourced rows (GTC 2027, InterBattery 2027, CIGRE, IEEE PES GM 2027, Battery Show Europe 2027, AWS re:Invent 2026) are now organiser-read.
- **Docs**: §11's E0 row → Done with all three count sets; README tree entries for `events-data/`, both files and both scripts; CHANGELOG `Sections: 91/100` at the time. **Nothing new written in §13** — §13.4's closing line asks for an E1 brief as §13.6, but N2 already wrote E1 as §13.7, so the line is stale and was not acted on.

### Where we left off

**E0 is merged to `main` and E1's prerequisite is satisfied**: `events.json`, `events-sources.json` and `check-events-registry.py` are all on `main`, the checker exits 0, and §11's E0 row reads Done. §11's E1 row is still **Proposed** — nothing in the Network/Events plan moved between v06.96r and v07.06r; those eleven versions were the parallel session's Routine-fleet work, the Classroom C2 pipeline and the cache levers.

The developer asked for the E1 paste-in prompt, which was handed over in chat at the close of this session (Fable 5.1 High, session 1 of two, §13.7's own prompt refreshed with the current repo version and the rotation arithmetic below).

### Key decisions made

- **A third-party listing can never confirm a row.** Eleven organisers block non-browser clients, so eleven shows the corpus cares about will never be organiser-verified from a server. Rather than soften `confirmed`, the checker now asserts it: a `confirmed` row must carry a source whose `kind` is not `manual`.
- **Blocked ≠ unusable event.** GCPA and NAATBatt serve a 403 Azure WAF to `curl` but are readable by a browser-class fetch — so their *events* are `confirmed` while their *roster rows* are `blocked`. That split is deliberate; the checker tolerates it; it means the E2 poller will never cover those shows.
- **Dates that are patterns are labelled as patterns.** CERAWeek 2027, ESIE 2027, Hot Chips 39, IDEE and AMD Advancing AI carry dates inferred from a prior edition's slot, and each says so in its own `tierNote`. These are the rows most likely to be wrong and the first to re-check when E2 runs.
- **The 10times row exists only as a never-re-propose marker** — cited by no event, and the checker rejects any event source on a LinkedIn / 10times / Google-News host. Same for COMPUTEX, which is on the roster with `robots: disallowed` so the poller must skip it.
- **`REPO-ARCHITECTURE.md` was deliberately not touched.** The brief said to mirror `profiler-data/`'s treatment *if it appears there* — it does not, and neither does any project checker. Adding `events-data/` would have made it inconsistent with its own sibling.
- Two seed-calendar feed flags did not survive the probe: 7x24 Exchange and the International Battery Seminar are **not** ICS, and Intersolar is **not** JSON-LD `BusinessEvent`. All three are recorded as `html` with the probe that says so, rather than as a feed E2 would fail on.

### Active context

- **Repo version v07.06r.** `CHANGELOG.md` `Sections: 102/100` — **one section is dated today (2026-09-22), so 101 are non-exempt and rotation IS due on the next push that creates a version section.** The oldest date group is **2026-09-16 with 25 sections**; rotating it leaves 77 raw / 76 non-exempt, under 100, so **one rotation suffices**. Run `git fetch --unshallow origin main` before any SHA lookup — the sections due are the oldest and are exactly the ones beyond a shallow horizon.
- This session's own push did **not** rotate: "Remember Session" is housekeeping with no version bump, so no version section was created and [PC-CHANGELOG] #6's rotation step never fired.
- **E0 artefacts on `main`**: `live-site-pages/events-data/{events.json,events-sources.json}`, `scripts/{extract-corpus-events.py,check-events-registry.py}`. Re-run before trusting: `python3 scripts/check-events-registry.py` (expect `OK 100 events … 58 roster rows`) and `python3 scripts/extract-corpus-events.py --check`.
- **Parallel sessions are live.** `claude/adoring-brown-mvddj2` was on the remote throughout this session and still is; a second Opus 5 session pushed ten times beside this one. `MULTI_SESSION_MODE` is `Off`, so every session must restart its branch from `origin/main` and check `git ls-remote` before pushing.
- **Megmeet briefing deferred** to after the Network/Events build, prompt preserved at `repository-information/megmeet-briefing-prompt.md` (the parallel session's decision, carried forward).
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- **Open a Fable 5.1 High session and run E1 session 1** — the Events scaffold and agenda (§13.7; the prompt was handed over in chat at the close of this session). E0's artefacts are on `main` with the checker at 0, so the prerequisite the brief names is satisfied, and D16 puts a hard date on it: the calendar has to be live **before 2026-11-16**, which is RE+ week.
- **To continue:** type `run E1 session 1`

Developed by: LightAISolutions
