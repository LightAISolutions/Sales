# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-25, 07:59 PM → 09:02 PM EST (attended; three turns)
**Repo version:** v07.56r (one push; this save is unversioned)
**Branch:** `claude/brave-ritchie-un2qt1`

### What was done

- **A deep analysis of the corpus to fill the thin Profiler categories** (turn 1, research only, no commit). The categories stood at investor 5 · utility 6 · neocloud 7 · gc 7 · advisor 8 · hyperscaler 8, out of 177 dossiers.
  - **Corpus pull:** a word-bounded, alias-aware count of ~300 uncovered names across every dossier, study guide, report and `Classroom.gs`. The most-cited were ERCOT 73 dossiers, PJM 37, BlackRock/GIP 31, Exelon/ComEd 19, NV Energy/BHE 18 and KKR 18.
  - **Four parallel web-research subagents** checked candidate identity and buying authority. All four ran out of the session's 200-call search budget partway through.
- **The developer approved every recommended company.** v07.56r recorded them as **Phase F** in `PROFILER-COVERAGE-PLAN.md` §11:
  - 37 companies in 13 sessions: 11 utilities, 11 capital, 6 neocloud and landlord, 3 China hyperscaler, 3 GC/electrical, 3 advisor;
  - its own ledger in §11.3, with `Why` cells marked unverified;
  - the paste-in prompt for **F-U1 + F-U2** in §11.4: Duke, DTE, WEC, then Berkshire Hathaway Energy (NV Energy) and Exelon, run as two pushes on Fable 5.1 High.

### Where we left off

- **Everything is merged; the tree is clean.** The developer has the F-U1 + F-U2 prompt and is about to start it in a new session.
- **Suggested in parallel:** F-I1, BlackRock and KKR, on Opus 5.5 xhigh. It touches different dossiers. Its prompt is not yet written — ask for `give me the F-I1 prompt`.
- **Timed rows in §11.2:**
  - **F-N1** (Firmus, HUMAIN, G42/Khazna) — fold into the 10/1 neoclouds pass.
  - **F-H1** (ByteDance, Alibaba Cloud, Chindata) — before the 10/7 Megmeet start.
  - **F-I2** — after SoftBank's DigitalBridge close.
- **The Phase B Events work (#9a) and all dated reminders still stand**, unchanged by this session.

### Key decisions made

- **Ranking tests:** corpus pull, then buying authority (who signs for batteries, MV gear, generation or SSTs), then seat fit. `utilities` is the only segment in both sales seats, so utilities run first.
- **Tenants are replaced by their landlords.** Together AI, Vultr, TensorWave and Lightning were dropped for 5C/Hypertec and TECfusions. Most GCs were dropped for Clayco and the electrical integrators Faith Technologies and EMCOR.
- **ERCOT and PJM are held.** They are grid operators, and adding them would mean first using the empty `other` category. That is the developer's decision.
- **Excluded, with the reasons in §11.1:** GIC, Silver Lake, Partners Group, the banks, DigitalBridge, PG&E, SCE, Sempra, CenterPoint and FirstEnergy. Clean Energy Associates is already inside `intertek`.
- **Landscape coupling:** new members make `landscape-utilities-2026-09`, `landscape-capital-2026-09` and `landscape-neoclouds-2026-09` stale. A Profiler session records this and never edits `Classroom.gs`.

### Known issues

- **Drift candidates in existing dossiers** — agent-reported, unread, and carried in the utility prompt:
  - `powerhouse-data-centers`: FERC rejected ComEd's Joliet TSA cancellation on 22 Sep;
  - `tract`: the PUCN conditionally approved its gas plants, around 19 Sep;
  - `stack-infrastructure` / `oracle` / `jupiter-nm`: Oracle's force-majeure notice on Project Jupiter, 24 Sep.
- **Carried over:** `megmeet-briefing-prompt.md` names the 9/8 AIDC edition; `verify-profiler-roles.py` (2) and `check-events-plan.js` (2); the two aged 9/8 reports.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **CHANGELOG:** `Sections: 108/100`, 10 dated 9/25 and exempt. **The first push dated 9/26 or later must rotate** (after `git fetch --unshallow`).

### Recommendation for next session

- Run **Phase F sessions F-U1 + F-U2**, the five utilities, on **Fable 5.1 High** using the prompt in `PROFILER-COVERAGE-PLAN.md` §11.4. Utilities feed both sales seats, and three of the five buy batteries directly.

**To continue:** paste the prompt in `PROFILER-COVERAGE-PLAN.md` §11.4 into a fresh Fable 5.1 High session

## Previous Sessions

### Session — 2026-09-25 07:14 PM → 07:52 PM EST (#12R closed — Events discovery Routine live, v07.55r)

**Date:** 2026-09-25, 07:14 PM → 07:52 PM EST (attended; four turns)
**Repo version:** v07.55r (two pushes: v07.54r, v07.55r; this save is unversioned)
**Branch:** `claude/wizardly-mendel-6o4h2e`

### What was done

- **#12R closed — the Events discovery Routine (phase R) is live:**
  - **v07.54r:** the repo-side queue `repository-information/events-discovery-queue.json`, starting empty, with its schema in `EVENTS-SCHEMA.md` §7.1. `check-events-registry.py` → `check_queue()` validates it. `.claude/rules/events-app.md` gained "The discovery run (R) and `events sync discovery`", covering the five source classes, the bar, the cap of 5, the stand-down and promotion. The Routine prompt is in `ROUTINES-OPERATIONS.md` → "Events discovery — quarterly", with STEP 0 byte-identical to the desk's.
  - **Developer, in the UI:** created "Events discovery - quarterly" (`trig_01LdSJyaBJAmrEYr4Eq5Fq8c`). Runs with "Claude HQ · Sales", Sonnet 5, no connectors, push and email on. The cron `CRON_TZ=America/New_York 50 8 8 3,6,9,12 *` was set with `/schedule update` in a local terminal; the next fire is Tue 2026-12-08 08:50 ET.
  - **First run (Run now):** a STAND-DOWN with a full report, no commit and the queue untouched, which §8 accepts.
  - **v07.55r:** the plan's §11 R row is Done. `ROUTINES-OPERATIONS.md` now has the schedule step corrected and a new settled finding.
- **Phase A is complete** (#8 at v07.52r/v07.53r, #12R at v07.54r/v07.55r).

### Where we left off

- **Everything is merged; the tree is clean.** Next is Phase B (9/28–10/6): #9a, the registry pass, then the booth-number build.
- **Dated reminders stand:**
  - The cooling recheck, from 9/28.
  - The 9/30 Classroom run.
  - The neoclouds pass and Habitat Energy, from 10/1.
  - The Dominion reframe, 10/2–10/6.
  - The AIDC re-run, after 10/31.
  - The Megmeet start is Wed 10/7.

### Key decisions made

- **Where the queue lives:** in the repo under `repository-information/`, not the `Proposed` tab, which a fired session cannot reach. It stays out of `live-site-pages/`, so unverified candidates never deploy. Rejected candidates stay in the file as dedup memory.
- **Promotion is a session command, `events sync discovery`.** No app or GAS change is involved. It re-reads the organiser page, and it re-probes any new roster row before writing it.
- **Candidate bar:**
  - relevance of at least 3, not a webinar, starting 21 days to 18 months out;
  - US or Canada, or a mega show at relevance 4 or higher anywhere;
  - grounded: a dossier names it, the organiser is on the roster, or at least 2 covered companies appear on the organiser's page;
  - the organiser's page must be read in the run.
- **Schedule:** the 8th of Mar/Jun/Sep/Dec, which avoids a 10/8 fire twelve days after the Run now.
- **Model:** Sonnet 5. Every candidate gets a human decision and a re-read before anything lands.
- **Settled finding:** `update_trigger` refuses on UI-created Routines ("Agents can only update routines they created"). A custom cron on a committing Routine needs `/schedule update` from a local CLI.

### Known issues

- The first run could not read several organiser pages: AFCOM, SEIA and MISO returned 403, the DCC page is behind a login wall, and CAISO and SPP returned 404. The trade-body and grid-operator classes are therefore mostly dead from the sandbox. If December also stands down for this reason, add those organisers as hand-maintained roster rows. Do not loosen the read-the-page rule.
- **Carried over:**
  - `megmeet-briefing-prompt.md` still names the 9/8 AIDC edition. Its own row says to re-check the index after 10/1.
  - `verify-profiler-roles.py` (2) and `check-events-plan.js` (2, stale fixture dates).
  - The two aged 9/8 reports still warn.

### Active context

- **Toggles:** START On · BOOKENDS Off · TIMING On · END On · MULTI_SESSION Off.
- **CHANGELOG:** `Sections: 107/100` — 9 dated 9/25 are exempt. **The first push dated 9/26 or later must rotate** the oldest date groups (SHA-enriched, after `git fetch --unshallow`).
- **Routines:** 7 in total. The busiest day is the 1st of a quarter month, with 4 runs.

### Recommendation for next session

- Start Phase B with **#9a, the registry pass**, in a fresh Opus 5.5 High session on or after Mon 9/28. It fills `hours[]`, `venueLatLng` and `agendaUrl` for RE+ 2026 and the 35 events through 11/30, verified against organiser pages. The booth-number build and `events plan re-plus-2026` both depend on those fields. Expect the CHANGELOG archive rotation on that push.

**To continue:** type `write the #9a registry-pass prompt`
