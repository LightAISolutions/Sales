---
paths:
  - ".github/workflows/**"
  - ".github/last-processed-commit.sha"
---

# Workflow Rules

*Actionable rules: see Deployment Flow in Session Start Checklist and Pre-Push Checklist in CLAUDE.md.*

## Merge Conflict Prevention (Auto-Merge Workflow)

The auto-merge workflow merges `claude/*` branches into `main` using `git merge --ff-only` with a `-X theirs` fallback. The `-X theirs` strategy auto-resolves content conflicts by preferring the incoming branch.

**Why this matters:** Every `claude/*` push triggers the workflow. If a prior workflow already merged a different claude branch into `main` (advancing `main` beyond this branch's fork point), a fast-forward is no longer possible. The fallback merge can hit content conflicts — especially in `CHANGELOG.md`, which is modified on every commit by the Pre-Commit Checklist. Without `-X theirs`, the merge fails with exit code 1, the auto-merge job fails, and the deploy job is skipped (its condition requires auto-merge success).

**Why `-X theirs` is safe:** The claude branch is always branched from `main` and contains strictly newer changes. When both sides modify the same lines (e.g. `CHANGELOG.md`'s `[Unreleased]` header timestamp), the claude branch's version is always the one we want. The `-X theirs` strategy resolves exactly this class of conflict — same-line edits where the incoming branch has the latest content.

**What this does NOT cover:** If the conflict is structural (e.g. a file was deleted on `main` but modified on the branch), `-X theirs` may not produce the desired result. These cases are rare in the `claude/*` workflow and would need manual intervention.

## Commit SHA Tracking (Inherited Branch Guard)

The file `.github/last-processed-commit.sha` stores the SHA of the last commit that was successfully merged into `main` by the auto-merge workflow. This provides a deterministic guard against inherited branches on forks and imports.

**How it works:**
1. When a `claude/*` branch is pushed, the workflow reads `.github/last-processed-commit.sha` from **two sources**: the checked-out branch AND `origin/main` (after fetching)
2. If the incoming commit SHA (`github.sha`) matches the stored SHA from **either source**, the branch is inherited — it carries the exact same commit from the template repo. The workflow deletes the branch and skips
3. After a successful merge, the workflow updates the file with the new `HEAD` SHA on `main` **in the same push as the merge** — this is critical to eliminate the race window

**Why atomic merge+SHA update?** Previously, the merge and SHA update were two separate pushes. If a fork/import copied the repo between push 1 (merge) and push 2 (SHA update), the copy got the branch but the `.sha` file was stale — the guards couldn't detect it. Now the merge and SHA update land in a single `git push`, so there's no window for an inconsistent copy.

**Why two sources in the check?** The branch's copy of `.sha` has the value from when the branch was created. `origin/main`'s copy has the latest post-merge value. On a fork/copy, which copy the inherited branch carries depends on timing — checking both catches either scenario.

**Why this is bulletproof:**
- Git SHAs are deterministic — a fork/import inherits the exact same SHAs from the source repo
- A new legitimate commit always produces a different SHA (different author, timestamp, parent, etc.)
- The file travels with the repo on copy, carrying the "already processed" marker with it
- The atomic merge+SHA update eliminates the timing race between updates and copies
- The dual-source check (branch + origin/main) eliminates timing races between the SHA file value and the branch copy
- No API calls needed — the check is a file read and string compare, making it the fastest guard in the chain

**Relationship to other guards:** This is **Check 0a** in the guard chain. The branch-source check runs before the origin/main fetch (fast path — catches exact matches immediately). The origin/main-source check runs after the fetch (catches cases where the branch's copy is stale but main's copy is current). Both run before the already-merged check, the timestamp check, and the IS_TEMPLATE_REPO mismatch check.

**File management:** The `.sha` file is managed exclusively by the workflow — Claude Code does not modify it. The only exception is during initial repository creation, where the file is seeded with the current HEAD SHA.

## Job-Level Permissions — Include `contents: read` Explicitly

**Rule:** Any workflow job that declares its own `permissions:` block AND calls `actions/checkout` (or otherwise reads repo files) must include `contents: read`. Do NOT rely on workflow-level `permissions:` to carry through — they don't.

**Why:** Job-level `permissions:` blocks **replace** workflow-level permissions, not augment them. Every permission not listed in the job block defaults to "none" for that job, regardless of what the workflow-level block says. `actions/checkout` uses the `GITHUB_TOKEN` scoped to the job's permissions — without `contents: read`, the token cannot clone the repo.

**Why it looks fine on public repos but breaks on private ones:** Public repo metadata is world-readable, so `actions/checkout` can clone anonymously even when the token has no `contents` scope. On **private** repos, authentication is mandatory, and the request fails.

**Misleading error message:** GitHub's API returns `404 "Repository not found"` (not `403 "Forbidden"`) when a private repo is requested without read access — an intentional anti-enumeration measure that makes the error look like a typo or a deleted repo instead of a permissions issue. If a workflow checkout step fails on a private repo with "Repository not found" and the token is obviously for the right repo, **check the job's `permissions:` block first** before suspecting bad tokens or wrong URLs.

**Correct deploy-job shape:**
```yaml
deploy:
  permissions:
    contents: read       # ← required for actions/checkout on private repos
    pages: write
    id-token: write
```

**Full case study:** `repository-information/KNOWN-CONSTRAINTS-AND-FIXES.md` — "Fix 4 — Pages deploy job failing with 'Repository not found' on private forks"

## Post-Merge Derived-Value Sync Steps

Three steps in `auto-merge-claude.yml` run **after** the merge and regenerate values that are derived from a source of truth elsewhere in the repo: **Update AHK version files**, **Update auto-update HTML payload version files**, and **Sync README tree version displays** (added v05.35r). They share a deliberate shape, and a change to any one of them should preserve it.

**They run after the merge, not before it.** A pre-merge gate on a derived value blocks the real change behind a bookkeeping mismatch. The precedent for a pre-merge *blocking* check is `Validate GAS served inner <script> syntax`, and it earns that position because a broken inner script breaks the running app — fresh sign-ins hang while already-open tabs keep working, so the failure is invisible until it is expensive. A wrong version number in a README table is not that.

**None of them may fail the step, and this is a hard constraint rather than a preference.** Every step after them — `Delete branch` and `Sweep stale claude branches` — is gated on `success()`. A step that exits non-zero therefore leaves the `claude/*` branch on the remote, and the next push in that session collides with Pre-Push Checklist item #5's push-once enforcement. The AHK and payload steps express this by ending their retry loops with `::warning::` and continuing. The README tree step has an extra case: findings its `--fix` cannot resolve (a version file with no tree entry, or a tree entry with no version file) are raised as `::error::`, which renders red in the run summary **without** failing the step. Anything that needs a human is annotated, never thrown.

**They push to `main` with `[skip ci]`** and share one retry pattern: four attempts, exponential backoff (2s/4s/8s/16s), and a `git rebase origin/main` between attempts when `origin/main` has advanced — the narrow race where a concurrent workflow lands between the merge push and this one. On exhaustion they warn and move on, because the value is derived and the next run regenerates it idempotently.

**The README tree step deviates from the other two in one respect, on purpose:** it runs unconditionally rather than guarding on whether the relevant files changed in this merge. The AHK and payload steps only fire when a `.ahk` or a payload `.html` changed, because regeneration is meaningless otherwise. The README tree step also has to sweep drift left behind by pushes that predate the gate — the v05.34r audit found five such displays — so a changed-files guard would leave exactly the backlog the step exists to clear. It is stdlib-only Python and takes about a second.

## WORKFLOW_PAT Safety Net

**Rule:** The `auto-merge` job's checkout step uses an opt-in `WORKFLOW_PAT` fallback, gated on the repo variable `USE_WORKFLOW_PAT`. Do NOT remove this fallback as "cleanup" during an unrelated fix — it is a deliberate safety net. Modifications to the token selection require user approval (see Chesterton's Fence gate in `.claude/rules/behavioral-rules.md`).

**Why `WORKFLOW_PAT` is retained:** GitHub historically blocked `GITHUB_TOKEN` from pushing commits that modify `.github/workflows/*` files — such pushes required the `workflow` scope, which only Personal Access Tokens carry. Current empirical evidence (as of v11.60r) shows `GITHUB_TOKEN` successfully pushes yml-modifying merge commits to `main` in this workflow, but this behavior is not guaranteed to persist — GitHub's policy could tighten, or a future workflow step could attempt to self-modify its own yml (which is a known use case for merge automation). The PAT fallback preserves the escape hatch for both scenarios.

**The hardened opt-in gate:** The token expression is:
```yaml
token: ${{ (vars.USE_WORKFLOW_PAT == 'true' && secrets.WORKFLOW_PAT) || secrets.GITHUB_TOKEN }}
```
The prior `secrets.WORKFLOW_PAT || secrets.GITHUB_TOKEN` pattern was unsafe because GitHub's `||` operator picks the first **truthy** value — a stale or revoked PAT string is still truthy, so checkout would use the broken token and fail with a misleading "Repository not found" error. The opt-in gate requires BOTH conditions — an explicit `vars.USE_WORKFLOW_PAT == 'true'` AND a non-empty `secrets.WORKFLOW_PAT` — so a fork that accidentally inherits a stale PAT silently falls through to `GITHUB_TOKEN` unless the fork operator explicitly opts in.

**How to enable `WORKFLOW_PAT`:**
1. Create a Personal Access Token with the `workflow` and `repo` scopes
2. Add it as a repo secret named `WORKFLOW_PAT`
3. Add a repo **variable** (not secret) named `USE_WORKFLOW_PAT` with value `true`
4. Both must be present — missing either one causes the gate to fall through to `GITHUB_TOKEN`

**How to disable:** set `USE_WORKFLOW_PAT` to anything other than `'true'` (or delete the variable). The secret can stay — it will not be used.

**Why a variable, not just a secret presence check:** a variable is explicit opt-in configuration. A secret presence check would silently activate `WORKFLOW_PAT` the moment someone added the secret, reintroducing the stale-PAT failure mode. The variable forces a conscious decision to use the PAT path.

## GAS Self-Update Deploy Verification (`.github/scripts/gas-deploy.sh`)

Every `Deploy <Project>` step is a four-line wrapper around one shared script. **Do not inline the verification logic back into the steps** — that is exactly how it drifted: response checking and the GET fallback were added to four of eight steps and never reached Testauthgas1, Testauthhtml1, Globalacl or MasterACL, which sat on `curl … || true` for months.

**The assertion.** `pullAndDeployFromGitHub()` returns `Updated to <v>` on a real deploy and `Already up to date (<v>)` when the running deployment's `VERSION` already equals what it read from GitHub. The step used to accept either string **with any version in it**, which cannot distinguish a real deploy from a stale read of the `.gs` off the GitHub contents API — a stale read reports the OLD version as current and would pass. The script now requires the version in the answer to equal the version in the merged `.gs`, read with `sed -n 's/^var VERSION *= *"\([^"]*\)".*/\1/p'`. An unreadable `VERSION` is a failure, never a pass.

**GET first, POST as fallback.** Measured on runs #558 and #561: the POST leg's response is never readable by the runner (Google's 302 drops it), so it printed `POST deploy unconfirmed` on every run — *including the runs where it had actually deployed* — at a cost of 8–13s per project. The GET route (`?action=api&op=deploy`) returns the function's real return string. POST is kept, not deleted, because it has been observed to complete a deploy on its own.

**Then five re-reads, added at v05.59r.** Two legs were not enough. Run **#568** (Classroom, v01.29g) went red here and the deploy **had landed** — the whole step took 76s, so neither leg reached its 120s ceiling; the exec endpoint simply answered with something that was not the function's return string. Reproduced by hand minutes later: one GET came back as Google's HTML shell and the very next GET returned `Already up to date (v01.29g)`. **The failure mode is a non-answer, not a slow deploy, and a re-read is what fixes it.** The script now polls the GET route five more times behind 5/15/30/60/90s of backoff at `--max-time 45`, reporting the confirming leg as `POLL <n>` so a run log shows the retry was needed. Re-reading is safe and idempotent: the GET route runs `pullAndDeployFromGitHub()`, the same call the first leg made, and once the version matches it returns `Already up to date (<v>)` without acting — so a poll either catches a deploy that landed or retries one that did not. The cost lands only on the failure path: ~7 minutes worst case for a project that never confirms, zero for one that confirms on the first leg.

**Why a red gate is expensive, and why it is worth stopping.** `deploy` is gated `needs.auto-merge.result == 'success'`, so a red GAS gate **skips the GitHub Pages deploy entirely** — on run #568 the GAS project was serving the new lesson while the live site still served the previous `gs-versions/*.txt` and `gs-changelogs/*.md`, i.e. a version pill and a changelog popup that disagreed with the app. The documented recovery is a **`workflow_dispatch` on `main`**: `auto-merge` is gated `github.ref != 'refs/heads/main'` so it skips, and `deploy` fires through its `auto-merge.result == 'skipped' && is-initialized` branch. Run **#569** did that and went green.

**Failure is deferred on purpose — do not "fix" this by failing in place.** `gas-deploy.sh` records failures to `$RUNNER_TEMP/gas-deploy-failures` and **exits 0**. `Delete branch` and `Sweep stale claude branches` are gated on `success()`, so a step that failed in place would leave the `claude/*` branch alive and block the next session under push-once enforcement. The final step of the `auto-merge` job, **`Fail the run if any GAS deploy was unconfirmed`**, reads that file after cleanup and exits 1. Keep that step last.

**Version ceiling.** The success string carries `N/200`. Apps Script caps a project at 200 versions; past that `pullAndDeployFromGitHub()` returns `DEPLOY HALTED` and the live app silently stops advancing. The script warns at ≥170. Classroom was at 32/200 on 2026-09-13.

**Reading a run.** The authoritative check is the `Deploy <Project>` step log, not the green tick and not the page's GAS version pill (which reads the repo's `gs-versions/*.txt` off Pages — the repo's file, not the deployment). `Updated to vX …` = deployed this run. `Already up to date (vX)` = already on vX, and since the assertion landed, vX is guaranteed to be the merged version.

Developed by: LightAISolutions
