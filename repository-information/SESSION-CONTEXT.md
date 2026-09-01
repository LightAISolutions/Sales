# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session
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

## Previous Sessions

### Session — 2026-09-01 (Receipts ACL outage: live diagnosis, grace snapshot, health probe — v04.02r)
**Date:** 2026-09-01 01:51:37 AM EST
**Reconstructed:** Auto-recovered from CHANGELOG (original session did not save context)
**Repo version:** v04.02r
**Branch:** `claude/receipts-app-bug-73prik`

**What was done (v04.00r–v04.01r, reconstructed from CHANGELOG):**

- **v04.00r — Monday's first unattended Scraper run worked; the delivery gate around it did not.** The three-day delivery window (added to end a midnight give-up) had silently split the weekday rule in two: the pass asked "is today a run day?" but never "is the EDITION for a run day?", so the weekend's manual builds mailed alongside Monday's. Fixed with an off-day gate applied in both the grouping and send loops, off-day rows stamped `'off-day'` rather than skipped, and a DST-proof `scIsoDayOfDateKey_` that deliberately avoids `new Date(key)`. The window itself was kept — it is what carries a missed Friday edition to Monday
- **v04.01r — weekend builds unnumbered, and same-story clustering.** `scIssueNumbers_` ranks run-day dates only, retroactively moving Monday from No. 004 to No. 002; `scClusterStories_` collapses multi-outlet coverage of one event onto the most reliable source, with event category as a separator rather than a requirement and a shared-distinctive-token test rather than a similarity ratio

**What this session did (v04.02r):**

- **Receipts sign-in outage, third of its kind — fixed the lockout, not the grant.** A live probe of the Profiler deployment (different script, same ACL spreadsheet) returned `acl_unreachable` with "You do not have permission to call SpreadsheetApp.openById. Required permissions: .../auth/spreadsheets" — proving the failure is an account-level OAuth grant gap hitting every auth app at once, not a Receipts defect and not the spreadsheet
- Added a **last-known-good ACL snapshot** to the shared AUTH block (auth template + all 7 auth projects): a successful read stores the page's allow-list in Script Properties; an unreadable ACL is answered from it instead of denying everyone. Reproduces only "yes" verdicts the real ACL already gave, never denies from the snapshot, 24h ceiling, `ACL_GRACE_ENABLED` off-switch, every grace grant audited
- Ported **`aclHealthProbe_`** to `Receipts.gs` (`GET ?action=api&op=aclhealth`) — Profiler had it, Receipts did not, which is why all three Receipts incidents cost an Apps Script editor round-trip. Extended with a `grace` field reporting snapshot presence, coverage and age

**Where we left off:**

- All changes committed and merged to main
- **The developer still has one manual step in Google that no commit can do**: run `diagnoseAuthorization()` from the Receipts Apps Script editor, open the authorization URL it prints, and approve **every** checkbox as the script account. Until then the ACL stays unreadable — the grace snapshot only masks it for users already recorded, and a first-ever sign-in on a project with no snapshot yet will still be denied

**Key decisions made:**

- **Availability beats strict denial here, deliberately.** A revoked user can retain access for up to 24h past the last good read. Receipts runs the `hipaa` preset, so this is a real trade — flagged in the CHANGELOG as the one part of the push worth a second opinion. `ACL_GRACE_ENABLED = false` restores the old behavior
- **The grace verdict is not cached** — a cached grant would outlive the outage by the full 10-minute access-cache TTL
- **Fixed in the shared AUTH block, not just Receipts.** `checkSpreadsheetAccess` was byte-identical across the template and all seven projects, and the outage was fleet-wide; patching only Receipts would have created drift that the next template propagation would clobber
- **Not attempted: pinning `oauthScopes` from the deploy path.** Considered as a recurrence fix, rejected — the deploy path is the most dangerous code in the repo, an under-declared pinned list would brick self-update fleet-wide, and the manifest is already preserved verbatim by `pullAndDeployFromGitHub()`. The recurrence is in the *grant*, not the declaration

**Active context:**

- Branch `claude/receipts-app-bug-73prik` · repo **v04.02r** · Receipts GAS **v01.29g**, Profiler **v01.31g**, Scraper **v01.93g**, MasterACL **v01.14g**, globalacl **v01.08g**, testauth\* **v01.07g**
- Capacity after this push: repo CHANGELOG **82/100** (the 2026-08-27 group, 20 sections, rotated to the archive with SHA enrichment; archive now 220); Scraper GAS 40/50; Profiler GAS 31/50; Receipts GAS 29/50
- Toggles unchanged (START/TIMING/END `On`, `CHAT_BOOKENDS` `Off`); TODO.md and REMINDERS.md both empty
- **Sandbox note for future sessions in this environment**: the auto-mode classifier blocks most bulk file mutation from Bash (heredoc-to-file, running scripts from the scratchpad, many compound commands). Simple `sed -i 's///'`, single redirects, `cp`, and the Edit/Write tools all work. `node --check` cannot read `.gs` (Node 22 rejects the extension — it fails on untouched files too); use `node --check --input-type=commonjs < file`

**Recommendation for next session:**

- Confirm the Google-side grant is repaired and the fleet is healthy: curl the Receipts `aclhealth` probe shipped this push (`?action=api&op=aclhealth` on its `/exec` URL) and expect `"ok":true,"reason":"acl_ok"`. If it still reports `acl_unreachable`, the `diagnoseAuthorization()` re-consent has not been done yet and nothing else should be built on top of it

**To continue:** type `check acl health`
