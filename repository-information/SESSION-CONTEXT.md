# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

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

## Previous Sessions

**Date:** 2026-09-22 12:29:48 AM EST
**Repo version:** v07.06r — ten pushes this session on `claude/repo-access-denied-339rna`, rebased onto `origin/main` before each: `66f18297` v06.97r, `2cd6348b` v06.98r, `1ed61dc0` v06.99r, `4f9fca6c` v07.00r, `e7ed2c5e` + `c347b37e` v07.01r, `ea5f52f7` v07.02r, `afb26ada` v07.04r, `814c7281` v07.05r, `38c8da9d` v07.06r. `70a0c488` v07.03r is **not mine** — it is the Classroom C2 pipeline's own first commit.
**Branch:** `claude/repo-access-denied-339rna`
**Model:** Opus 5

### What was done

**The "Repo access denied" issue is closed, and the whole Routine fleet is rebuilt and proven.**

- **Root cause**: `create_trigger` has no `sources` parameter, so every agent-created Routine fired into a session with no checkout and could never push. Proved by a controlled A/B on 2026-09-21 — two live earnings desks, identical but for the attached repository: the old one 33s / $0.11 / no commit, the new one ~14m / $13.86 / commit `cdfafb36` with 13 files and +2,020 lines.
- **The UI's Edit form does NOT expose repositories**, despite the current documentation saying it does. Re-tested by the developer on C2: Edit opens, no repositories field, and **Runs with** shows only environment and model. Rebuild is mandatory; recorded so it is not re-litigated from the docs a third time.
- **All five committing Routines rebuilt** (developer, via the claude.ai form) with `LightAISolutions/Sales` attached and **zero connectors**. C2 and Industry Guidance set to **Opus 5**; the two Profiler ones to **Sonnet 5**. The ACL health check is read-only and was deliberately **not** rebuilt.
- **Four old `meta_mcp` copies deleted** — after archiving their prompts verbatim to `repository-information/routine-prompts-archive.md`, because a pre-delete check found `crusoe`'s research priorities had only partly survived the move into `watch[]`.
- **Coverage gap found and closed**: 64 of 177 dossiers (36%) were covered by no Routine at all, 31 of them in Megmeet-adjacent segments including the four SST peers. Root cause was the hardcoded 21-company list in the sweep prompt. Every cadence row now carries a `tier` — 52 `core` (90d), 33 `watch` (180d), 0 untiered — and the sweep reads tiers, so coverage changes by commit.
- **Both cache levers implemented, and lever 1 made automatic.** Measured where the calendar's bytes were: `watch` 66.4% + `source` 31.6% = 98%, none of it read by the queue logic. Split to `profiler-refresh-notes.json`; the calendar went **384,240 → 21,576 bytes (−94%)** and 2,573 → 1,069 lines, back under the Read tool's 2,000-line default. Lever 2 split 186 lines out of `profiler-app.md` (**−38%**). Net ≈ **−$2.49/run on the desk, ~$55/month**.
- **Two checker fixes**: `build-classroom-segments.py --check` now separates real work from pin churn (was 16 due with 15 pin-only), and the P9 fixture in `check-classroom-pipeline.py` was repaired — it derived its briefing id from `coveredThrough` and collided with the real briefing the moment the pipeline's first commit advanced the watermark. `--selftest` back to **15 fixtures / 0 failures**.
- **C2 landed its first-ever commit** (`70a0c488`), audited independently: 7 paths all inside contract §3, nothing forbidden touched, ledger watermark advanced off `null`, all gates clean.

### Where we left off

Everything is committed, pushed and merged. The repo is green: all four C2 gates pass, `--selftest` is 15/0, `check-readme-tree.py` is 0 findings, `sync-profiler-registry.py` is 0 findings. Six Routines live, all enabled, all with zero connectors.

**The Megmeet briefing was deliberately deferred** — the developer wants it after the Network and Events build plan and closer to the 2026-10-07 start date. The prompt is preserved at `repository-information/megmeet-briefing-prompt.md` and a reminder is in `REMINDERS.md`.

### Key decisions made

- **Sonnet 5 stays the default for Routines; Opus 5 only where a checker cannot see the failure.** Every failure in the saga was infrastructural, not a run reasoning badly. C2 and Industry Guidance write curriculum whose correctness a structural checker cannot verify — a fabricated provenance pin passes every gate — so they get Opus 5. Haiku is disqualified by arithmetic (200K context vs runs of 335K and 361K). Fable is wrong for unattended work because it alone draws the 50% weekly sub-allocation.
- **`usage.cost_usd` is API list-price valuation, not a balance charge** — verified by reconstruction to 0.75%. Drawn from plan allocation; `isUsingOverage: false`.
- **Before writing a prompt instruction to work around a file, measure the file.** A data fix outlives every prompt that would have worked around it — and a prompt cannot be edited after its Routine is created.
- **`created_via` alone is not a safe delete filter** — the ACL check is `meta_mcp` and must survive. The rule is `meta_mcp` minus the ACL check.
- **The API's `sources` field is not evidence of repository attachment** — it reads empty even on Routines that have demonstrably committed. The **Runs with** card is the only reliable check (v06.70r trap, held again).

### Active context

- **Branch:** `claude/repo-access-denied-339rna` · **repo version** v07.06r · CHANGELOG `Sections: 102/100` raw but **78 non-exempt** (24 dated 2026-09-21 EST) — a counter reading over 100 is expected here and is **not** a rotation signal.
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off.
- **Routines (6, all enabled, all zero connectors):** earnings desk weekdays 13:00Z (default model) · C2 Wednesdays 11:00Z (Opus 5) · quarterly check 1 Jan/Apr/Jul/Oct 13:00Z (Sonnet 5) · opportunity report 1st monthly 17:00Z (Sonnet 5) · Industry Guidance 15 Jan/Apr/Jul/Oct 13:00Z (Opus 5) · ACL health check daily 10:00Z.
- **Open, none blocking:** (1) the Megmeet briefing, deferred by choice; (2) the sweep lag — core rows come due **2026-11-27** but the sweep next fires **2027-01-01**, a 35-day gap, and a monthly cadence with the tier gate would close it cheaply; (3) Receipts' ACL grace snapshot may still be unarmed — the daily ACL run reports it as a warning, and one successful Receipts sign-in arms it.
- **Reminders:** the 2026-09-19 repo-access reminder is now fully satisfied by this session's work but was **left open deliberately** — it is developer-owned and only the developer closes it.

### Recommendation for next session

- **Resume the Network and Events build** — E0 is done (`events.json`, `events-sources.json`, the checker, 73 events), so E1 is next, with its brief already written as §13.7 of `NETWORK-EVENTS-DESIGN-PLAN.md`. That is the developer's stated priority, and the Megmeet briefing is explicitly queued behind it.
- **To continue:** type `run E1`
