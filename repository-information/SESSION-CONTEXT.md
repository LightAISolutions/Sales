# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions
### Session — 2026-09-22 05:00 PM EST (close-out: the vCard fold fix, E2 confirmed live, v07.17r)

**Date:** 2026-09-22 05:00 PM EST (the session ran ~04:15 → 05:00 PM EST)
**Repo version:** v07.17r — one push on `claude/focused-thompson-zjh7pn`, two commits (the stale-context reconstruction rode along); this session-context write is a second push.
**Branch:** `claude/focused-thompson-zjh7pn`
**Model:** Opus 5 (close-out session between N3 s2 / E2 and E3 — not a build session)

### What was done

**A close-out session, not a build.** Four open items from the previous two sessions, plus one live defect found and fixed.

- **`Network.html` v01.20w — fixed the vCard PHOTO splice crashing mobile Chrome ("Aw, Snap!").** Root cause was `nwVcardFold`, **not** the Drive-consent flash the symptom pointed at. It folded by re-slicing a shrinking `line` (`line = ' ' + line.slice(75)`), forcing the engine to flatten the previous pass's cons string every iteration — quadratic in line length. Property lines are short and were never affected; a PHOTO line is the whole card front in base64. The stored front is the 2,000 px capture (~600 KB) → a single ~800 KB line → ~11,000 passes: **measured 18,329 ms and multiple GB of allocation churn per card** on desktop-class V8. Desktop absorbed it (which is why the PC "worked" — it was surviving, frozen, ~37 s for two cards); a phone renderer answered with an OOM kill. Three fixes: the fold is now flat (index the source, `join` once — **verified byte-for-byte identical** to the old output for every length 0–1,200 and at 200,000 chars; **1,679× faster**, 18,329 ms → 10.9 ms); `nwCardFrontBytes` → `nwCardFrontPhoto` (fetch as Blob, redraw at 720 px / q 0.8, base64 straight out of the canvas — **the full-size bytes are never turned into a string**; fallback to raw bytes only without `createImageBitmap` and only under 512 KB); `nwBytesToB64` batches at 8 KB not 32 KB. Plus a progress line through the serial photo fetches. A `PROJECT OVERRIDE` comment in the fold records why it must never go back to a loop
- **Answered three questions in chat** (no code): what `NW_POSTAL_ADDRESS` should hold (a one-line CAN-SPAM physical postal address; Script Property, read live by `PropertiesService`, no redeploy); how to redeploy `Events.gs` from the editor (`pullAndDeployFromGitHub` from the Run dropdown — never **Deploy → New deployment**, which mints a new id and orphans `Events.config.json`); and how to read that function's execution log
- **`NETWORK-SCHEMA.md` §11** — the PHOTO row records the 720 px re-encode; the N3 s2 paragraph states the flat-fold requirement as a rule, not an implementation detail
- **Session-start reconstruction** — `SESSION-CONTEXT.md` recorded v07.15r against a repo at v07.16r (the Profiler earnings desk's scheduled NOVONIX refresh landed without a "remember session"). Recovered from CHANGELOG, committed separately as prescribed

### Where we left off

**E2 is live and confirmed.** The developer ran the first cycle: `pullAndDeployFromGitHub` returned "Already up to date (v01.04g)" — the workflow had already deployed it — the GAS pill on Events.html reads **v01.04g**, the weekly trigger is installed, and **Poll now** returned *"Polled 10 sources (48 skipped, 0 failed): 33 new proposals, 0 already known."* Queue: 33 pending · 0 approved · 0 rejected · 0 applied. **10 + 48 = 58 = the roster exactly**, and `0 already known` is correct for a first run. **E3 is next — §13.11**; its paste-in prompt was given in chat at the close of this session.

### Open finding — the poller proposes editions that have already happened (NOT yet fixed, NOT E3's job)

**`evPollSource_`'s item loop has no past-date guard.** Every item a feed publishes is matched and diffed, so a finished edition yields a `new-edition` / `new-event` proposal. **Demonstrated on the live queue:** `ai-infra-summit`'s feed is 2 items, newest **2026-09-15** (a week past); the registry already holds `ai-infra-summit-2027` (San Jose, 2027-08-31); the poller proposed **NEW-EDITION `ai-infra-summit-2026`** (Santa Clara) — i.e. adding backwards. The two 12-item ICS feeds (`esig-events`, `imasons-events`) very likely contribute more of the same, so an unknown share of the 33 is history.

**Not corruption** — the approve gate stops it and nothing reaches `events.json` without `events sync`. It is **queue noise that recurs every Monday** and that the developer has to hand-reject. Registry context: 100 events, **exactly 1 already ended**, and the agenda has a deliberate "Past editions" group — so the calendar keeps a small tail of history on purpose and is not meant to accumulate past editions wholesale.

**Shape of the fix** (~5 lines + a harness case, E2 scope): in `evPollSource_`'s `for (var i = 0; i < items.length; i++)` loop, skip an item whose `end || start` is before today **for the `new-event` / `new-edition` kinds only** — `cancelled`, `moved-dates`, `changed-venue` and `changed-url` must still fire on rows already in the registry, because an organiser can cancel or move a row the calendar already carries. Bump `Events.gs`, add the case to `scripts/check-events-poller.js`, redeploy.

**Deliberately not done this session and deliberately kept out of E3** — §13.11 says "no new scope", and folding a poller fix into a scoring session is what that guard exists to prevent.

### Key decisions made

- **The fold fix is byte-for-byte equivalence, not "close enough"** — proven across every length 0–1,200 and at 200,000 chars before it was accepted, because the old output is what already-exported `.vcf` files contain
- **Downscaling the PHOTO is fidelity-neutral, not a compromise** — Contacts on both platforms renders it at avatar size regardless, and oversized PHOTO values are a known iOS import failure; the `.vcf` also gets ~10× smaller
- **No `Network.gs` change and no redeploy for the vCard fix** — the splice is page-side by design, because the card front lives in the developer's own Drive under `drive.file`, which the script cannot read
- **`pullAndDeployFromGitHub` returns its outcome and never logs it**, and the editor's Run button does not print return values — so the success path is invisible in the editor on all **10** projects that carry the template copy. Noted as a fleet-wide papercut; **not fixed**, because it is TEMPLATE code and [PC-TEMPLATE-PROP] #19 would make it a 10-project push
- **"June 2028" in the masthead is not a bug** — the sticky month indicator falls back to "the last month whose top is above the fold" when nothing intersects (over-scrolled, or the Agenda hidden behind another tab); the registry's last event is 2028-06-04

### Active context

- **Repo version v07.17r.** `CHANGELOG.md` `Sections: 88/100` — no rotation due (rotation at >100)
- **Live versions:** `Network.html` v01.20w · `Network.gs` v01.10g · `Events.html` v01.05w · `Events.gs` v01.04g (deploy confirmed by the GAS pill)
- **Before E3 can score by account, both peer tokens must be set on the live deployments** — `EVENTS_PEER_TOKEN` and `NETWORK_PEER_TOKEN`, the same value on both. Unverified this session. E3's panel must degrade to "connect Network to score by account", never fail, so the build is not blocked either way
- **Playwright** is `pip install playwright` + the pre-installed Chromium at `/opt/pw-browsers`. Per-container
- **Reminders still open** (developer's own — untouched): close out the "Repo access denied" issue — **the evidence is in**, the v07.16r run cloned, researched, committed and pushed; C2 must be rebuilt before **Wednesday 2026-09-23 04:00 PDT**, which is tomorrow. The Megmeet briefing runs after the Network/Events build, before 2026-10-07
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off

### Recommendation for next session

- Run E3 from §13.11 — `eop=recommend` with the six §6 terms, `Tuning` seeded once, the Recommended pill with score chips and the *why* panel, `scripts/check-events-score.js`, the verifier's Recommended pass; flip §11's E3 row to Done and write the E4 brief as §13.12. **Fable 5.1 High, one session, one push.** The CHANGELOG counter has moved to 88/100 since §13.11 was written — read the live counter, not the one in the stored prompt.
- **To continue:** type `run E3 from §13.11`
