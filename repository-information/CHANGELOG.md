# Changelog

All notable changes to this project are documented here.
Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), with project-specific versioning (`w` = website, `g` = Google Apps Script, `r` = repository). Older sections are rotated to [CHANGELOG-archive.md](CHANGELOG-archive.md) when this file exceeds 100 version sections.

`Sections: 5/100`

## [Unreleased]

*(No changes yet)*

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
