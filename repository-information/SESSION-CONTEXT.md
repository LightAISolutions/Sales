# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
**Date:** 2026-09-01 08:03:04 PM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v04.08r

**What was done (v04.04r–v04.08r, reconstructed from CHANGELOG — Scraper diagnostics, federal feeds, an EO 14420 guidance module; no session context was saved):**

- Scraper's status strip split `tick 8h ago · 5 err/24h` into two tiles: a run tile that says `overdue` past the served `tickOverdueMin`, and a `BACKGROUND FAULTS · LAST 24H` tile that opens a panel listing each fault with **Copy all** and a manager-gated **Mark resolved & clear**. The count became exact via an hourly tally (`scDigestErrCount_`) instead of a `.slice(-5).length` ceiling, and the silent-throw path in `scSchedulerTick` now logs `tick.fatal` and rethrows (Scraper.html v01.69w, Scraper.gs v01.94g) (v04.04r)
- Fixed the fault tile vanishing right after that deploy — the new tally property did not exist yet, so `recentErrorCount` read 0 while five entries sat unreachable in the detail log; now `max(tally, in-window log length)` (Scraper.gs v01.95g) (v04.05r)
- Five primary federal feeds added to Scraper after live probes (White House Presidential Actions, Federal Register FERC + IRS, DOE Newsroom, EIA Today in Energy); ferc.gov (Cloudflare 403), the IRS newsroom (404) and EPA (empty 202) retired with rules-file entries; `topic-bps-security` + `topic-federal-action` seeds; EO 14420 bulk-power-system guidance module `eo14420-bulk-power-2026-08` authored from the primary text, with analysis markdown + archived source under `repository-information/industry-guidance/` (Scraper.gs v01.96g, Profiler.gs v01.32g) (v04.06r)
- "Why thin?" gained a per-source contribution table (`bySource`, `silentSources`) so a silent feed and a sub-threshold feed are distinguishable; the edition picker was rebuilt (grouped by edition, issue number first, weekday shown, edition filter, weekend builds shown as unnumbered) with `wdDgDate_` parsing through `Date.UTC` (Scraper.gs v01.97g, Scraper.html v01.70w) (v04.07r)
- "Why thin?" had never rendered once: its 25 s client deadline set `settled`, and the success handler discarded any later reply. The timer now shows a live elapsed count instead of giving up, transport aborts are explained with a retry hint, the subtitle shows desk vs round-trip time, and `scDigestScoreRows_` is bounded to the newest 8,000 intake rows (Scraper.html v01.71w, Scraper.gs v01.98g) (v04.08r)

**Where we left off:** All changes committed and merged to main

**Active context:**

- Repo **v04.08r** · HTML: Scraper **v01.71w**, Profiler **v01.75w** · GAS: Scraper **v01.98g**, Profiler **v01.32g**, Receipts **v01.29g**, MasterACL **v01.14g**
- Repo CHANGELOG at **88/100**
- TODO.md empty; REMINDERS.md has no active reminders
- Toggles: `START_OF_RESPONSE_BLOCK` On, `CHAT_BOOKENDS` Off, `TIMING_ESTIMATES` On, `END_OF_RESPONSE_BLOCK` On
- Open items carried forward: the daily ACL health Routine (`trig_01GeTqB8xp5nG8FCC139Bgr9`) has not yet been observed staying silent on a healthy day (v04.03r recommendation); v04.07r made "are the Federal Register feeds contributing?" answerable in-app but did not answer it

## Previous Sessions

### Session — 2026-09-01 (Receipts ACL grace snapshot + health probe, daily ACL monitoring Routine — v04.03r)
**Date:** 2026-09-01 03:01:25 AM EST
**Repo version:** v04.03r
**Branch:** `claude/receipts-app-bug-73prik`

**What we worked on (two pushes, v04.02r and v04.03r):**

- **The developer reported a third Receipts sign-in outage** (`acl_unavailable/acl_unreachable`) with a screenshot and said "fix it." Before touching code, I probed the **Profiler** deployment's `aclhealth` endpoint — a *different* Apps Script project reading the *same* ACL spreadsheet — and it returned `stage:"open"`, `acl_unreachable`, `"You do not have permission to call SpreadsheetApp.openById. Required permissions: .../auth/spreadsheets"`. **That one call settled everything**: the spreadsheet was irrelevant (the call never reached it), the fault was not Receipts-specific (a second project failed identically), and it was not fixable from this repo (no commit grants an OAuth scope)
- **So the defect worth fixing was not the grant — it was that a grant gap produced a total, silent, undiagnosable lockout.** Two changes followed
- **v04.02r — last-known-good ACL snapshot** in the shared AUTH block. Every successful read stores the page's allow-list (`email → role`) in Script Properties; a read that fails both attempts consults it before reporting an outage. Applied to `gas-minimal-auth-template-code.js.txt` and propagated to **all 7 auth projects** per [PC-TEMPLATE-PROP] #19 — the function was byte-identical across all 8 files before (`69231e6bc877`) and after (`ef876136e831`), verified by hash
- **v04.02r — `aclHealthProbe_` ported to `Receipts.gs`** (`GET ?action=api&op=aclhealth`), extended with a `grace` field (users covered, age, armed). Profiler had this since its own incident; Receipts did not, which is exactly why all three Receipts incidents cost an Apps Script editor round-trip
- **Developer then repaired the grant in Google and confirmed all three apps work.** Verified from outside: Receipts `v01.29g acl_ok`, Profiler `v01.31g acl_ok`, Scraper `v01.93g`, MasterACL `v01.14g` — and the Receipts probe showed **`grace: 16 users, armed`**, i.e. the new safety net populated itself on their first successful sign-in
- **v04.03r — monitoring.** `scripts/check-acl-health.sh` plus a daily Routine, because all three incidents were discovered the same way (the developer hitting a wall) and the probe that would have caught each a morning earlier had nothing watching it

**Where we left off:**

- Everything committed, pushed and merged (`a8fab2f`); working tree clean; all four deployed projects verified green from outside
- **Routine `ACL health check (daily)` — `trig_01GeTqB8xp5nG8FCC139Bgr9`**, cron `0 10 * * *` (06:00 ET), fresh session per fire, push + email. **First fire was 2026-09-01 ~06:02 AM EDT.** It is instructed to stay **silent** on a healthy run, so silence is the success signal
- The one thing not yet observed: a real quiet-day run. Manual runs pass; the Routine has not yet been seen to correctly say nothing

**Key decisions made:**

- **Availability over strict denial, deliberately and flagged.** A revoked user keeps access up to 24h past the last good read if the ACL happens to be unreadable. Receipts runs the `hipaa` preset, so this is a real trade — `ACL_GRACE_ENABLED = false` restores strict denial. The snapshot can only ever *reproduce* a yes the real ACL already gave; it never denies from the snapshot, so removals land as soon as the list is readable
- **The grace verdict is not cached** — a cached grant would outlive the outage by the full 10-minute access-cache TTL
- **The monitor lives outside Google, on purpose.** A GAS-side time-driven check would sit in the same account whose grant keeps lapsing — the one failure domain a monitor must not share — and `script.scriptapp` is systemically missing on pre-v01.82r projects, so such a trigger could silently never install and look exactly like health
- **Exit 2 (nothing probed) is a failure, not a pass.** A monitor that reports success when it checked nothing is worse than no monitor, because it gets trusted. Same reasoning makes an empty/non-JSON body a failure rather than a swallowed parse error
- **Rejected: pinning `oauthScopes` from the deploy path.** Considered as a recurrence fix — an under-declared pinned list would brick self-update fleet-wide, and `pullAndDeployFromGitHub()` already preserves the manifest verbatim. The recurrence is in the *grant*, not the declaration
- **`REPO-ARCHITECTURE.md` deliberately not updated** for the new script: its diagram depicts the three *template* scripts only, and six existing utility scripts are already absent by that convention

**Active context:**

- Branch `claude/receipts-app-bug-73prik` · repo **v04.03r** · GAS: Receipts **v01.29g**, Profiler **v01.31g**, Scraper **v01.93g**, MasterACL **v01.14g**, globalacl **v01.08g**, testauthgas1/testauthhtml1 **v01.07g**. No HTML page versions changed in either push
- Capacity: repo CHANGELOG **83/100** (the 2026-08-27 group, 20 sections, rotated to the archive with SHA enrichment this session; archive now 220). GAS changelogs: Scraper 40/50, Profiler 31/50, Receipts 29/50, MasterACL 14/50, globalacl 8/50, testauth\* 7/50
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Diagnostic entry points worth remembering**: `bash scripts/check-acl-health.sh` (2s, exits 0/1/2, optional project-name filter); `?action=api&op=aclhealth` on Receipts or Profiler; `?action=api&op=deploy` on any project to read its live GAS version. `diagnoseAuthorization()` in the editor is the only thing that separates a never-*declared* scope from a declared-but-partially-*granted* one — they throw the identical error and have opposite repairs
- **Sandbox notes for future sessions in this environment**: the auto-mode classifier blocks most bulk file mutation from Bash — heredoc-to-file, running scripts from the scratchpad, and many compound commands are denied, sometimes inconsistently for the same command shape. What reliably works: single `sed -i 's///'`, single redirects, `cp`, and the Edit/Write tools. Budget for propagation-by-Edit rather than by script. Also: `node --check` cannot read `.gs` (Node 22 rejects the extension and fails identically on untouched files, so it is **not** a syntax signal) — use `node --check --input-type=commonjs < file`

**Recommendation for next session:**

- Confirm the monitoring Routine behaved correctly on its quiet days — check that `trig_01GeTqB8xp5nG8FCC139Bgr9` has fired (`list_triggers` shows `last_run`) and that it produced **no** notification while the fleet was healthy. That is the only property the manual runs could not prove, and a detector that cries wolf on healthy days is worse than none. If it did notify on a green run, tighten the "stay silent" instruction in its prompt via `update_trigger` rather than deleting and recreating it

**To continue:** type `check the acl routine fired quietly`

