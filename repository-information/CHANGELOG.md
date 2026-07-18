# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 12/100`

## [Unreleased]

*(No changes yet)*

## [v01.12r] — 2026-07-17 11:45:41 PM EST

> **Prompt:** "I was able to pass the "Connect to server" issue from earlier, but i still cannot sign in. See attached screenshot."

### Fixed
- Embedded app screen blocked after successful fetch sign-in (Google Drive "Sorry, unable to open the file" inside the iframe + `action=securityEvent` 404 spam — the multi-account `/u/N` routing 404 hitting the remaining iframe loads): the `#gas-app` iframe and the hidden securityEvent frames are now created **credentialless** in `live-site-pages/MasterACL.html`, `Scraper.html`, `globalacl.html` (all v01.02w) and the auth HTML template — cookie-less iframes get Google's anonymous serving path (the same path verified working via server probes), while the session continues to travel in the `?session=` URL. Browsers without `credentialless` support ignore the attribute (prior behavior preserved). Flagged as a documented inference: anonymous serving, cookie removal, and anonymous GAS usage are each verified, but the combination inside a credentialless iframe is untested until the owner confirms in-browser

## [v01.11r] — 2026-07-17 10:05:56 PM EST

> **Prompt:** "Do the fetch conversion (your recommendation) AND address this: "The root-cause template defect (setup script generates `standard`-preset GAS against a hipaa-built HTML template) still awaits a permanent fix so future projects are born working" (your heads-up)."

### Added
- **Iframe-free `fetch` sign-in transport** ported from the `testauthgas1` scaffold into `live-site-pages/MasterACL.html` (v01.01w), `Scraper.html` (v01.01w), and `globalacl.html` (v01.01w): new `_gasPost()` (POST with GET `action=api` fallback), `exchangeViaFetch()`, `_mapExchangeError()`, `_completeSignInFetch()` (transport-verified direct show — no `gas-auth-ok` gate), plus fetch branches in `sendHeartbeat()`, the sign-out flow, and the page-load session restore (heartbeat-validated). `HTML_CONFIG.TOKEN_EXCHANGE_METHOD` → `'fetch'`. Cookie-less fetch always reaches Google's anonymous serving path, making the auth machinery immune to the blocked framed `/exec` responses (multi-account `/u/N` 404s, X-Frame-Options) that killed iframe sign-in in the owner's normal browser
- GAS routes for the transport in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.07g), `Scraper.gs` (v01.03g), `globalacl.gs` (v01.01g): `doPost action=exchangeToken` (with `ensureScriptProperties_()` bootstrap) and `action=signOut`, plus a general `doGet action=api` GET fallback (`exchangeToken`/`signOut`/`heartbeat` ops)

### Changed
- **Permanent template fix**: the same conversion applied to `live-site-pages/templates/HtmlAndGasTemplateAutoUpdate-auth.html.txt` and `gas-minimal-auth-template-code.js.txt` — future auth projects are born with the fetch transport, which no longer depends on the GAS preset's `TOKEN_EXCHANGE_METHOD`, dissolving the standard-vs-hipaa exchange mismatch permanently
- Template propagation note: `testauthgas1` (already the fetch reference) and `testauthhtml1` (intentionally the postMessage test scaffold) were left unchanged; the latent `processDataPoll` dead-route in the GAS template generation was left as-is (not referenced by the new routes)

### Verified
- Full-file JS syntax parse on all 4 GAS files and all inline script blocks of the 4 HTML files; Playwright `file://` smoke test on the 3 converted pages (only known file-protocol restrictions logged, zero code errors)

## [v01.10r] — 2026-07-17 09:22:12 PM EST

> **Prompt:** "@"/root/.claude/uploads/07152af2-7240-5bfb-8986-2eaa697523c9/af91e797-globalacl_working_sample_v01.89g.txt" See attached .txt file for a successful example. Compare this with my GAS code and update mine as needed to resolve my sign-in problem for "jonyang92@gmail.com". This example is being used for a different company, so scrub out anything specific and give me a working skeleton that can be applied to my GAS code."

### Changed
- Compared the uploaded working sample (globalacl v01.89g, other org) against our GAS code after scrubbing org-specific values: function inventories and the entire sign-in path are identical — the only functional configuration difference is that the working org runs `ACTIVE_PRESET: 'hipaa'`. Aligned `googleAppsScripts/MasterACL/MasterACL.gs` (v01.06g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.02g) to that proven skeleton: `ACTIVE_PRESET` → `'hipaa'`, `PROJECT_OVERRIDES` made byte-identical to the sample (`ENABLE_DOMAIN_RESTRICTION: false`, `ALLOWED_DOMAINS: []`, `SESSION_EXPIRATION: 7200`), removing the now-redundant `TOKEN_EXCHANGE_METHOD` override (hipaa's default is `postMessage`). The embedding HTML's own comments ("must match GAS PRESETS.hipaa...") confirm the auth HTML template was written for the hipaa preset — the setup script generating `standard`-preset GAS against it is the template defect. Session durations verified in sync both sides (7200/28800). The sample's `PROJECT:` doPost signOut wrapper was not ported (workspace-specific, unrelated to sign-in). Note: the browser-side multi-account `/exec` 404 (Google issue) remains — single-account session still required

## [v01.09r] — 2026-07-17 08:36:54 PM EST

> **Prompt:** "I still cannot sign in as "jonyang92@gmail.com". Fix the problem."

### Fixed
- Sign-in timeout ("The sign-in service isn't responding") on MasterACL and Scraper: the auth HTML template hardcodes `TOKEN_EXCHANGE_METHOD: 'postMessage'`, but the GAS `standard` preset resolves it to `'url'` — the served shell had no postMessage token listener, so the OAuth token exchange never completed and the 25s reachability watchdog fired. Confirmed by probing the live `/exec` deployment (healthy, serving current code, correct `gas-needs-auth` handshake — ruling out deployment/OAuth-access causes). Fix: `TOKEN_EXCHANGE_METHOD: 'postMessage'` added to `PROJECT_OVERRIDES` in `googleAppsScripts/MasterACL/MasterACL.gs` (v01.05g) and `googleAppsScripts/Scraper/Scraper.gs` (v01.01g) — the combination the working hipaa-preset projects (Globalacl, test pages) already use. Latent template defect noted: every future `standard`-preset auth project inherits this mismatch until the GAS template or setup script aligns the two sides

## [v01.08r] — 2026-07-17 08:10:18 PM EST

> **Prompt:** "The first screenshot is the error message I get when I try to sign in with "jonyang92@gmail.com" and the second screenshot is an example of a successful Master ACL sheet. Modify the "grantUserAccess" function to resolve the first problem and modify my Master ACL sheet to look like the second screenshot."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.04g): `grantUserAccess()` reworked into a three-phase utility. Phase 1 (STRUCTURE) verifies/repairs the Master ACL spreadsheet to match the reference layout — creates the Access tab if missing, writes `Email`/`Role` headers, adds the `#NAME`/`#URL`/`#AUTH`/`#ICON`/`#DESC` metadata rows via `ensureMetadataRows`, creates a `Roles` tab with the default permission matrix (new `ensureRolesTab_` helper, checkboxes included), and registers this project's page column. Phase 2 (GRANT) unchanged — default admin grants for the two owner emails. Phase 3 (WEB APP PROBE) initializes required Script Properties then fetches the project's own `/exec` URL and logs a precise verdict — the page's "sign-in service isn't responding" watchdog fires when the deployment doesn't serve the app, so the probe distinguishes healthy / access-not-Anyone / stale-or-empty-deployment (with click-by-click fix instructions)

## [v01.07r] — 2026-07-17 07:47:16 PM EST

> **Prompt:** "GAS is telling me: "No emails specified. Set Script Properties key "GRANT_ACCESS_EMAILS" (single email or comma-separated list), optionally "GRANT_ACCESS_ROLE", then Run again." Make it so I don't have to do this. Add "jonyang92@gmail.com" and "lightaisolution@gmail.com"."

### Changed
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.03g): `grantUserAccess()` no longer requires Script Properties — when `GRANT_ACCESS_EMAILS` is unset it falls back to built-in defaults `DEFAULT_GRANT_EMAILS` (`jonyang92@gmail.com`, `lightaisolution@gmail.com`) with `DEFAULT_GRANT_ROLE` (`admin`). Script Properties still override the defaults when set, for granting other users/roles

## [v01.06r] — 2026-07-17 07:42:23 PM EST

> **Prompt:** "No one has permissions to access these projects right now. Make a function that I can run that allows new users to get permission."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.02g): new `grantUserAccess()` admin utility in the PROJECT block — run from the Apps Script editor with Script Properties `GRANT_ACCESS_EMAILS` (single or comma-separated) and optional `GRANT_ACCESS_ROLE` (default `viewer`). Appends Access-tab rows for new users (role + TRUE for every page column, with checkboxes), re-enables all page columns for existing rows (role updated only when explicitly set), validates the role against the known role list with a warning, and bumps the access-cache epoch so grants take effect immediately. One run grants access to every registered project since all auth projects share the central Master ACL spreadsheet

## [v01.05r] — 2026-07-17 07:37:12 PM EST

> **Prompt:** "I can't sign into my MasterACL project with my personal email (jonyang92@gmail.com) because permissions are not set by my work email (lightaisolution@gmail.com). Autocreate the admin permissions for my personal email."

### Added
- `googleAppsScripts/MasterACL/MasterACL.gs` (v01.01g): new `PROJECT OVERRIDE` block with `SEED_ADMIN_EMAILS` (`jonyang92@gmail.com`) and an idempotent `ensureSeedAdmins()` called from `doGet` — appends an `admin`-role row with all page columns TRUE to the Access tab when the email is missing, bumps the access-cache epoch so cached denials clear immediately, and never touches existing rows (manual spreadsheet edits always win). Runs server-side as the deployment owner, so it works even though the visiting user has no spreadsheet access

## [v01.04r] — 2026-07-17 07:18:01 PM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "Scraper",
>   "TITLE": "News Scraper",
>   "DEPLOYMENT_ID": "AKfycby8nOR0AqLsDlZPcrTX9dWIInY48R9Jrl8oBDtN5t0emC06j7iwidEMdXttrD1zXnjUIg",
>   "SPREADSHEET_ID": "19U0Wu25eUXEHPVz4VWjKQIpnRozgFycNSjFCTB-umkk",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **Scraper** (News Scraper — auth-enabled, `standard` preset) created via `scripts/setup-gas-project.sh`: `live-site-pages/Scraper.html` (v01.00w), `googleAppsScripts/Scraper/Scraper.gs` (v01.00g), `Scraper.config.json` with real deployment/spreadsheet IDs and Master ACL registration, version files, page/GAS changelogs + archives, and `repository-information/diagrams/Scraper-diagram.md` (with verified mermaid.live link)
- `Deploy Scraper` webhook step added to `.github/workflows/auto-merge-claude.yml`; Scraper registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges — all script-generated with no manual repair needed (v01.03r script fixes verified in production)

### Changed
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to include the new Scraper nodes (verified by decompression)

## [v01.03r] — 2026-07-17 07:11:12 PM EST

> **Prompt:** "fix the setup script defects"

### Fixed
- `scripts/setup-gas-project.sh` Phase 6: the GAS Projects registration row was appended after the last `|`-prefixed line in the whole file (landing in the coding-guidelines pointer table) — now anchors on the `| Project | Code File |` header and inserts after the last contiguous row of that table
- `scripts/setup-gas-project.sh` Phase 9: the workflow deploy step anchored on a `# ── AHK VERSION FILE UPDATE ──` banner comment that no longer exists, silently skipping the insert — now anchors on the stable `- name: Update AHK version files` step name
- `scripts/setup-gas-project.sh` Phase 5b: generated per-environment diagrams lacked the mandatory "Open in mermaid.live" link — the script now generates the pako URL via `python3` (zlib is pako-compatible) with round-trip verification and a warning fallback when Python is unavailable
- All three fixes verified end-to-end against a throwaway repo copy (row placement, workflow step position, link decompression)

## [v01.02r] — 2026-07-17 06:55:07 PM EST

> **Prompt:** "Set up a new GAS project. Run the script, then commit and push.
>
> bash scripts/setup-gas-project.sh <<'CONFIG'
> {
>   "PROJECT_ENVIRONMENT_NAME": "MasterACL",
>   "TITLE": "MasterACL",
>   "DEPLOYMENT_ID": "AKfycbxgxErSg_DfV7WjVvDQ4_LVkFAkON-86iJaNhQ3k50Hs-WbQ2KLskfRtnzSVlZNIHhc8Q",
>   "SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "SHEET_NAME": "Live_Sheet",
>   "DEVELOPER_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "YOUR_ORG_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "SPLASH_LOGO_URL": "https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg",
>   "INCLUDE_AUTH": true,
>   "CLIENT_ID": "830735769637-ak3c73b4lnea004i8dge8kg6n53o36vl.apps.googleusercontent.com",
>   "AUTH_PRESET": "standard",
>   "IS_MASTER_ACL": true,
>   "MASTER_ACL_SPREADSHEET_ID": "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE",
>   "ACL_SHEET_NAME": "Access"
> }
> CONFIG"

### Added
- New GAS project **MasterACL** (auth-enabled, `standard` preset, flagged as the Master ACL project) created via `scripts/setup-gas-project.sh`: `live-site-pages/MasterACL.html` (v01.00w), `googleAppsScripts/MasterACL/MasterACL.gs` (v01.00g), `MasterACL.config.json` with real deployment/spreadsheet IDs, version files, page/GAS changelogs + archives, and `repository-information/diagrams/MasterACL-diagram.md`
- `Deploy MasterACL` webhook step added to `.github/workflows/auto-merge-claude.yml` (the setup script announced this step but never wrote it — added manually, mirroring the Globalacl step)
- MasterACL registered in the GAS Projects table and path scope of `.claude/rules/gas-scripts.md`; README.md tree and REPO-ARCHITECTURE.md updated with the new page, GAS node, and edges

### Fixed
- Setup script defect: the GAS Projects table row was inserted into the coding-guidelines pointer table in `.claude/rules/gas-scripts.md` — moved to the actual GAS Projects table
- Added the missing "Open in mermaid.live" link to `MasterACL-diagram.md` and regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (both verified by decompression)

## [v01.01r] — 2026-07-13 08:28:42 PM EST

> **Prompt:** "continue with your recommendation"

### Changed
- Initialized repository identity: internal links, branding URLs, and live-site references updated from the template's `lightaisolutions` repo name to `Sales` across README.md, CITATION.cff, issue template config, REPO-ARCHITECTURE.md, index.html, sitemap.xml, and robots.txt (`bash scripts/init-repo.sh LightAISolutions Sales ShadowAISolutions` + manual follow-ups; developer branding `ShadowAISolutions` preserved)
- GAS Project Creator page defaults now point to this repository — GitHub Repo field prefills `Sales` and the three logo URL fields prefill `https://lightaisolutions.github.io/Sales/images/logo-placeholder.svg` (v01.01w)
- Regenerated `repository-information/readme-qr-code.png` to encode this repository's URL (`https://github.com/LightAISolutions/Sales`)
- Updated CLAUDE.md Template Variables table: `YOUR_REPO_NAME` → `Sales`

### Fixed
- Corrected GitHub Pages hostnames mangled by the init script's global replace — the template's org and repo share the same lowercase string, so `lightaisolutions.github.io` became `Sales.github.io` in CITATION.cff, README.md, and REPO-ARCHITECTURE.md; restored to `lightaisolutions.github.io` (paths correctly remain `/Sales/`)
- Removed the duplicate `main` push-trigger entry the init script inserted into `.github/workflows/auto-merge-claude.yml` (this copy already had `main` in the trigger)
- Regenerated the REPO-ARCHITECTURE.md Flowchart mermaid.live URL to match the updated diagram code (verified decompression)

Developed by: ShadowAISolutions
