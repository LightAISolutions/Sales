---
paths:
  - "googleAppsScripts/**/*.gs"
  - "googleAppsScripts/**/*.config.json"
  - "live-site-pages/gs-versions/**"
  - "live-site-pages/testauthgas1.html"
  - "live-site-pages/testauthhtml1.html"
  - "live-site-pages/globalacl.html"
  - "live-site-pages/*-code.js.txt"
# Same path scope as .claude/rules/gas-scripts.md — this reference auto-injects
# whenever the core rules file does, so the architectural context is always
# available alongside the actionable rules.
---

# Google Apps Script Reference

*Path-scoped reference companion to `.claude/rules/gas-scripts.md`. Both files use the same `paths:` frontmatter, so this reference auto-injects whenever the core rules do. Content: architecture overview, setup steps, webhook auto-deploy, template source file, template vs project code separation, GAS UI layout awareness, and visual verification after GAS UI changes.*

## GAS Architecture Overview

### What This Is
A Google Apps Script web app that pulls its own source code from a GitHub repository and redeploys itself. GitHub is the source of truth — the `.gs` file is the ONLY file you need to edit.

Updates reach the live web app via webhook:
Push to a `claude/*` branch → GitHub Action merges to main → workflow calls `doPost(action=deploy)` → GAS pulls + deploys itself

### Page Reload (Embedding Solution)
The GAS sandbox iframe blocks programmatic navigation from async callbacks. Solution: embed the web app as a full-screen iframe on a GitHub Pages page. The embedding page polls a version file on GitHub Pages to detect updates and reloads automatically.

### Architecture — Dynamic Loader Pattern
- `doGet()` serves a STATIC HTML shell (never changes)
- All visible content is fetched at runtime via `getAppData()`
- `getAppData()` returns `{version, title}` → `applyData()` updates DOM
- After a pull, `getAppData()` runs on the NEW server code
- This bypasses Google's aggressive server-side HTML caching

### Auto-Deploy Flow (push → live in ~30 seconds)
1. Claude Code pushes to `claude/*` branch
2. GitHub Action merges to main
3. GitHub Action calls `doPost(action=deploy)`
4. `doPost()` calls `pullAndDeployFromGitHub()` directly
5. GAS pulls new code from GitHub, overwrites project, deploys
6. Embedding page detects version change via `gs.version.txt` polling
7. App shows new version — zero manual clicks

*The `doPost(action=deploy)` handler must remain unauthenticated — this is a safety-critical rule. See `.claude/rules/gas-scripts.md` — "⚠️ Deploy Handler Protection".*

### Version Limit Management (200 Version Cap)
Apps Script has a hard 200 version limit. The API does NOT support deleting versions. When 180+ is reached, a warning appears. Manually clean up: Apps Script editor → Project History → Bulk delete.

## Setup Steps

1. Create an Apps Script project, paste the code
2. Enable "Show appsscript.json" in Project Settings, set contents:
   ```json
   {
     "timeZone": "America/New_York",
     "runtimeVersion": "V8",
     "dependencies": {},
     "webapp": {
       "executeAs": "USER_DEPLOYING",
       "access": "ANYONE_ANONYMOUS"
     },
     "exceptionLogging": "STACKDRIVER",
     "oauthScopes": [
       "https://www.googleapis.com/auth/script.projects",
       "https://www.googleapis.com/auth/script.external_request",
       "https://www.googleapis.com/auth/script.deployments",
       "https://www.googleapis.com/auth/spreadsheets",
       "https://www.googleapis.com/auth/script.send_mail",
       "https://www.googleapis.com/auth/script.scriptapp",
       "https://www.googleapis.com/auth/drive"
     ]
   }
   ```
   The `script.scriptapp` scope is required for the script to create its own time-driven triggers (`ScriptApp.newTrigger`) — without it, programmatic trigger installs (e.g. a self-installing hourly scheduler) fail with a permissions error. After adding a scope, re-run any function in the editor and re-consent
3. Create or use a GCP project where you have Owner access
4. Enable Apps Script API in GCP project (APIs & Services → Library)
5. If using Google Drive (e.g. image uploads): enable **Google Drive API** in the same GCP project (APIs & Services → Library → search "Google Drive API" → Enable). Without this, `UrlFetchApp` calls to `googleapis.com/drive/v3/` fail with permission errors even when `oauthScopes` includes `drive`
6. Link GCP project in Apps Script (Project Settings → Change project)
7. Enable Apps Script API at script.google.com/home/usersettings
8. Deploy as Web app (Deploy → New deployment → Web app → Anyone)
9. Copy Deployment ID into `DEPLOYMENT_ID` in the `.gs` file
10. Set `GITHUB_TOKEN` in Script Properties: Key: `GITHUB_TOKEN`, Value: `github_pat_...` token (fine-grained token with "Public repositories" read-only access)
    - **Cross-owner caveat**: the token must be minted under a GitHub user who has direct access to the `GITHUB_OWNER/GITHUB_REPO` configured in the `.gs` file. A token that works for `OwnerA/repo` does NOT automatically work for `OwnerB/repo` — GitHub treats them as independent resources even when the code is identical, because authz is per-owner. A fine-grained PAT can only be scoped to repos the minting user owns or admins; a classic PAT relies on the minting user being a member/collaborator of the new owner. Migrating a GAS project to pull from a different GitHub owner typically requires minting a new token under a GitHub account that is a direct member of the new owner. Verify before setting the Script Property by running: `curl -H "Authorization: token TOKEN" https://api.github.com/repos/OWNER/REPO` — expect `200` with JSON on success, `404` if the token's user doesn't have access (GitHub returns 404 not 403 as an anti-enumeration measure — same quirk documented in `.claude/rules/workflows.md`, "Job-Level Permissions"), `401` if revoked/malformed
    - **Enterprise caveat**: if the repo's owner is an organization inside a **GitHub Enterprise**, PAT policy applies at two layers (enterprise + org) and fine-grained PATs typically require org-admin approval before they authenticate. A token can appear valid on the user's tokens page while still returning 404 against enterprise-owned repos — the approval queue (`https://github.com/organizations/ORG/settings/personal-access-tokens-pending-requests`) is the usual blocker. Enterprise admins are exempt from the approval queue; everyone else needs an admin to approve each new token. If the enterprise disables fine-grained PATs entirely (Enterprise Managed Users, tightened enterprise policies), the GAS auto-pull architecture is incompatible — switch to a GitHub App (installation tokens via JWT), or flip the architecture to push from GitHub Actions using the Apps Script API instead of having GAS pull from GitHub. **For this repo specifically**, the full setup (enterprise + org policies, approval flow, current token config, 404 diagnostic headers, rotation) is documented in `repository-information/ENTERPRISE-SETUP.md`
11. Run any function from editor to trigger OAuth authorization
12. If using Google Sheets: create spreadsheet, copy ID into `SPREADSHEET_ID`
13. If using installable trigger for sheet caching: Apps Script editor → Triggers → + Add Trigger → Function: `onEditWriteB1ToCache`, Event source: From spreadsheet, Event type: On edit

## GAS Webhook Auto-Deploy (Confirmed Working)

When a `.gs` file is pushed and merged to `main`, the `auto-merge-claude.yml` workflow triggers a webhook (`doPost(action=deploy)`) on the corresponding GAS web app. This causes the GAS script to pull its latest source from GitHub and redeploy itself — **without the embedding HTML page needing to be open**. The GAS backend updates server-side; the next time a user loads the page, they get the new version automatically.

- **Confirmed 2026-03-06**: Testation7 GAS updated from v01.00g → v01.01g via webhook with no page open — the workflow deploy step successfully triggered `doPost`, and the GAS app pulled and redeployed itself
- Each GAS project gets its own deploy step in the workflow (added by `setup-gas-project.sh` during project creation)
- The webhook URL is constructed from the `DEPLOYMENT_ID` in each project's `.config.json`

### Checking the live GAS version without opening the editor

`?action=api&op=deploy` on a project's `/exec` URL returns the version the deployment is actually running — `Already up to date (vXX.XXg)` or `Updated to vXX.XXg`. It is unauthenticated **by design** (see the ⚠️ CRITICAL comment on the deploy handler: it can only re-pull what GitHub already contains) and idempotent, so it is safe to call at any time:

```bash
ID=$(jq -r .DEPLOYMENT_ID googleAppsScripts/Receipts/Receipts.config.json)
curl -sL "https://script.google.com/macros/s/$ID/exec?action=api&op=deploy" --max-time 90
```

Use this instead of the editor to answer "did my push actually reach the live app?" — the workflow's deploy step **exits 0 even when the deploy is unconfirmed** (it only emits a `::warning`), so a green workflow run is not by itself proof the GAS side updated. A healthy version response also proves the script project exists and the owning account still has access to it, which is the fastest way to rule out a broken/trashed project when sign-in or the editor is misbehaving.

Projects whose `DEPLOYMENT_ID` is still `YOUR_DEPLOYMENT_ID` (currently `globalacl`, `testauthgas1`, `testauthhtml1`) are never deployed — their workflow deploy steps exit immediately and their version bumps are repo-only bookkeeping.

## OAuth Scope Regressions — invisible to git, and they look like broken data

> **Symptom:** a Google service call fails at runtime with *"You do not have permission to call `X`. Required permissions: `<scope>`"* — **and no consent screen appears**. Seen twice: `ScriptApp.newTrigger` losing `script.scriptapp` (v01.87r), and `SpreadsheetApp.openById` losing `spreadsheets`, which took the whole Receipts sign-in down for every user (v02.57r).

**Why no consent prompt.** When `appsscript.json` carries an **explicit** `oauthScopes` array, Apps Script requests exactly that list and does **not** auto-derive missing scopes from the code. A dropped entry therefore fails at call time rather than at authorization time — the scope was never asked for, so there is nothing to consent to. That absence is the tell: a stale *grant* prompts for re-consent, a missing *declaration* just fails.

**Why the repo cannot see or fix it.** No live project's `appsscript.json` is in this repo, and `pullAndDeployFromGitHub()` deliberately **preserves** the project's existing manifest — it reads the current `appsscript` file back and writes it unchanged alongside the new `Code`. So a scope regression survives every push, every deploy, and every CI run, and no amount of committing fixes it. It has to be repaired in the Apps Script editor.

**Diagnosis.** `diagnoseOauthScopes_()` in `Receipts.gs` reads the manifest back through the Apps Script API and prints the declared scopes plus any the app needs and lacks, each labelled with the feature it breaks. `diagnoseAclAccess()` calls it automatically when the ACL open fails with a permissions-shaped error, and distinguishes that from a file-level failure (wrong ID, trashed, unshared) — the two need opposite fixes.

**Repair:** Project Settings → tick *"Show appsscript.json manifest file in editor"* → add the missing scope(s) to `oauthScopes` (canonical list in "Setup Steps" step 2 above) → save → **run any function in the editor and approve the consent screen**. The re-consent is mandatory, not optional: changing the scope list invalidates the existing grant, so the old token still lacks the new scope until it is re-approved.

**Standing risk.** Because the manifest is unversioned, any future scope loss is equally silent. If this recurs a third time, the fix worth considering is committing a canonical `appsscript.json` per project and having the self-deploy write it — but that is a deliberate change to `pullAndDeployFromGitHub`'s manifest-preservation behavior and must be discussed, not slipped in: preserving the manifest is what keeps per-project webapp settings from being clobbered by a shared template.

## Google Multi-Account Routing — the recurring "unable to open the file" failure

> **Symptom:** Google Drive's *"Sorry, unable to open the file at this time."* This is **not** a repo defect and no code change fixes it. It has hit this fleet at least three times, on three different surfaces: the Profiler note-box iframe, the embedded `#gas-app` iframe after sign-in, and the Apps Script editor itself.

**Mechanism.** Google resolves a URL with no `/u/N/` prefix against the browser's **default** account — the first one signed in. When the requested file is owned by a *different* signed-in account, Drive returns the error above rather than switching accounts. This fleet is especially exposed because the GAS projects and their Drive folders are owned by a dedicated **script account**, while day-to-day browsing happens as the developer's personal account (see the `DRIVE_FOLDER_ID` comment in `Receipts.gs`: *"owned by the script account; shared to the developer's personal account for viewing"*).

**Fixes, in order of reliability:**
1. **Private/incognito window signed into only the owning account** — deterministic, because there is no second account for the router to pick.
2. **Force the account index in the URL** — `https://script.google.com/u/0/home/projects`, incrementing `/u/1/`, `/u/2/` until the project appears. The index is the order the accounts were signed in, not a stable identifier.
3. **Make the owning account the browser default** — sign out of all Google accounts, then sign back in with the script account first.

**In-app occurrences are already fixed structurally** and must not regress: embedded `/exec` iframes are created **credentialless** and the token exchange runs over cookie-less `fetch()`, both of which reach Google's anonymous serving path where account routing does not apply. If this error reappears *inside a page*, the cause is an iframe or transport that lost its cookie-less property — not a new Google bug.

**Diagnostic order when the editor will not open:** probe the deployment first (previous section). A healthy version response proves the project is alive and owned, which narrows the problem to browser-side routing and rules out a trashed project or lost ownership.

## GAS Template Source File

The GAS templates in `live-site-pages/templates/` are the **single source of truth** for GAS project scaffolding. Two variants exist:
- `gas-minimal-noauth-template-code.js.txt` — no auth (default)
- `gas-minimal-auth-template-code.js.txt` — with Google auth

A reference file (`repository-information/archive info/GAS-TEST-FUNCTIONS-REFERENCE.md`) archives 6 optional test/diagnostic functions (version counting, sound playback, sheet operations, quota display) that can be manually added to projects needing a test admin UI.

Each template contains placeholder values (`YOUR_DEPLOYMENT_ID`, `YOUR_ORG_NAME`, etc.) and serves two purposes:

1. **Browser "Copy Code.gs" button** — the gas-project-creator page fetches the appropriate template based on the auth checkbox and does find-and-replace with the user's config values before copying to clipboard
2. **Setup script template** — `scripts/setup-gas-project.sh` selects the correct template based on `INCLUDE_AUTH` config field, copies it as the starting point for new GAS projects, then substitutes config values via sed

The templates live in `live-site-pages/templates/` because they must be accessible via GitHub Pages `fetch()`, and the setup script can read them from any location in the repo.

*Template source propagation: when this file is modified, changes must be propagated to all existing `.gs` files — see `.claude/rules/html-pages.md` — section "Template Source Propagation" ([PC-TEMPLATE-PROP] #19)*

## Template vs Project Code Separation

All GAS code files (`.gs` and the GAS template `.js.txt` files) use section dividers to distinguish **template code** (shared across all projects, propagated via [PC-TEMPLATE-PROP] #19) from **project-specific code** (unique to one project, never overwritten during propagation).

### Divider format
Dividers use 14 `═` characters. Each marker is a 3-line block (divider, label, divider):
```javascript
// ══════════════
// TEMPLATE START
// ══════════════

// ══════════════
// TEMPLATE END
// ══════════════

// ══════════════
// PROJECT START
// ══════════════

// ══════════════
// PROJECT END
// ══════════════
```

### File structure (top to bottom)
1. **Config variables** — always first, no divider needed (every file starts with these)
2. **PROJECT block** — project-specific variables and standalone functions (e.g. `SPLASH_LOGO_URL`, `readPushedVersionFromCache()`). Empty on new projects — placeholder for future additions
3. **TEMPLATE block** — all template functions (`doGet`, `doPost`, `getAppData`, `getSoundBase64`, `writeVersionToSheet`, `readB1FromCacheOrSheet`, `onEditWriteB1ToCache`, `fetchGitHubQuotaAndLimits`, `pullAndDeployFromGitHub`)
4. `// Developed by:` branding line — always last

### Inline markers and override markers — canonical reference

Marker semantics (inline `// PROJECT:` additions, `// PROJECT OVERRIDE:` modifications, single-line vs multi-line forms, and the propagation-stop behavior triggered by `PROJECT OVERRIDE`) are identical across `.html` and `.gs` files. **The canonical reference lives in `.claude/rules/html-pages-reference.md` — "Template vs Project Code Separation"** — see that section for full examples, marker distinctions, and propagation rules. GAS-specific note: `.gs` files use JavaScript syntax only, so only the `//` comment form applies — HTML and CSS comment forms (`<!-- -->`, `/* */`) are not used.

### Rules for new code
- **New project-specific features** should go in the PROJECT block when possible — standalone functions, new variables, and self-contained logic belong there
- **Project code inside template functions** is allowed when required (e.g. the feature needs to hook into a specific point in a template function's flow). It must be marked with inline `// PROJECT:` markers — never mixed unmarked into template functions
- `// PROJECT OVERRIDE:` markers for project-specific modifications to existing template code — these trigger a propagation halt (see "Project override markers" above)
- **Template updates** ([PC-TEMPLATE-PROP] #19) propagate changes only within TEMPLATE markers — PROJECT blocks and inline `// PROJECT:` lines are preserved as-is. When `// PROJECT OVERRIDE` markers are found in a TEMPLATE region that a template change touches, propagation **stops for that file** and alerts the user
- **Keep clusters large** — prefer grouping related project-specific code together rather than scattering small project additions throughout the file. When practical, extract project logic into standalone functions in the PROJECT block and call them from template functions with an inline `// PROJECT:` marker
- **The template source files** (`gas-minimal-noauth-template-code.js.txt`, `gas-minimal-auth-template-code.js.txt`) have empty PROJECT blocks — they define the insertion point but contain no project code themselves

## GAS UI Layout Awareness

GAS UI elements (iframe panels, toggle buttons, status indicators, overlays) are **guests** inside the host HTML page. They must defer to the host page's existing layout — the HTML page should never need to accommodate GAS elements. When making changes to GAS-related UI on any HTML page:
- **Check for conflicts** with the version indicator (`#version-indicator`, fixed bottom-right), changelog overlay, splash screens, and any other fixed/absolute elements already on the page
- **Avoid overlapping** interactive elements — if two fixed-position controls would occupy the same corner or edge, move the GAS element to an unoccupied position
- **Test mental layout** — before finalizing CSS for any new fixed-position GAS UI element, mentally walk through all existing fixed elements on the page and verify no visual or interactive overlap occurs at any viewport size
- This rule applies automatically to all GAS UI changes — the developer does not need to explicitly request layout-awareness each time

## Visual Verification After GAS UI Changes

*See `.claude/rules/html-pages-reference.md` — section "Visual Verification After UI Changes" — for the full rule and procedure. The rule already covers `.gs` file triggers and explains how to find the embedding page for a GAS change. On-demand command: see CLAUDE.md — "Visual Test Command".*

Developed by: ShadowAISolutions
