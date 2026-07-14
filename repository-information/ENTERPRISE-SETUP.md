# Enterprise Setup — LightAISolutions

This repo lives under the **`LightAISolutions`** GitHub Enterprise. This document captures the enterprise/org structure, Personal Access Token (PAT) policies, the specific token used for GAS auto-deploy, and where to click when something breaks.

## Enterprise Structure

- Enterprise URL: https://github.com/enterprises/lightaisolutions
- The enterprise contains the `LightAISolutions` organization (and possibly others)
- This repo (`LightAISolutions/lightaisolutions`) lives under that org
- Enterprise admins set ceiling policies; orgs configure within the ceiling; individual tokens/users operate within the org's configuration

## Personal Access Tokens — policy locations

PAT policy applies at **two layers**: enterprise-level (ceiling) and org-level (within the ceiling). A fine-grained PAT must satisfy BOTH layers before it can authenticate against `LightAISolutions/lightaisolutions`.

### Enterprise-level policy

- **URL:** https://github.com/enterprises/lightaisolutions/settings/personal_access_tokens_policies
- **Navigation:** Enterprise page → top-nav "Policies" tab → left-sidebar "Personal access tokens"
- **Current configuration:**
  - **Restrict access via fine-grained PATs** — set to "Allow organizations to configure access requirements" (enterprise defers to each org)
  - **Require approval of fine-grained PATs** — set to "Allow organizations to configure approval requirements" (enterprise defers to each org)
  - **Maximum lifetime** — 366 days (enterprise admins are exempt per the note on the org-level page)
  - **SAML/SSO** — NOT required (Authentication security page shows "Require SAML authentication" unchecked)

### Org-level policy (LightAISolutions)

- **Settings URL:** https://github.com/organizations/LightAISolutions/settings/personal-access-tokens-policies
- **Navigation:** `LightAISolutions` org → Settings → left-sidebar "Third-party Access → Personal access tokens → Settings"
- **Current configuration:**
  - **Access** — "Allow access via fine-grained personal access tokens" (permitted)
  - **Approval** — "Require administrator approval" (**every new fine-grained PAT must be approved by an org admin before it authenticates against org resources**)
  - **Lifetime** — max 366 days (inherited from enterprise; org can set shorter but not longer)

### Approval queue (for org admins)

- **Pending requests:** https://github.com/organizations/LightAISolutions/settings/personal-access-tokens-pending-requests
- **Active tokens:** https://github.com/organizations/LightAISolutions/settings/personal-access-tokens-active
- Enterprise admins are **exempt** from the approval requirement — their tokens bypass the pending queue and become active immediately after minting

## Current GAS Auto-Deploy Token

The token used by the 5 GAS projects' `pullAndDeployFromGitHub()` function to fetch source from this repo.

| Field | Value |
|-------|-------|
| **Token name** | `gas-self-update-reader-LAIS` |
| **Resource owner** | `LightAISolutions` |
| **Repository access** | Only select repositories: `LightAISolutions/lightaisolutions` |
| **Contents permission** | Read-only |
| **Metadata permission** | Read-only (required, auto-populated) |
| **Expiration** | No expiration (enterprise admin exemption) — **still recommended to rotate every ~12 months** for hygiene |
| **Used in** | `GITHUB_TOKEN` Script Property of every GAS project that pulls from this repo |

### Where the token lives (not the value — GitHub shows the value only once at creation)

- **Personal tokens page (view/edit/regenerate):** https://github.com/settings/personal-access-tokens → click the token name
- **Org-side active list:** https://github.com/organizations/LightAISolutions/settings/personal-access-tokens-active → click the token name
- **GAS Script Properties (actual token value):** Each Apps Script project → Project Settings → Script properties → `GITHUB_TOKEN`

### Projects currently using this token

All three GAS projects in this repo:
1. `googleAppsScripts/Globalacl/globalacl.gs`
2. `googleAppsScripts/Testauthgas1/testauthgas1.gs`
3. `googleAppsScripts/Testauthhtml1/testauthhtml1.gs`

All read the token from the same Script Property key (`GITHUB_TOKEN`) on their respective Apps Script projects. Rotating the token means pasting the new value into all three Script Properties.

### Why we're not using a classic PAT

Classic PATs grant blanket access to every repo the minting user can see. Fine-grained PATs are scoped to specific repos — `gas-self-update-reader-LAIS` can only read `lightaisolutions`, nothing else. Much smaller blast radius if the token leaks.

### Why we're not using a GitHub App (yet)

GitHub Apps are the "correct" long-term pattern for enterprise auto-deploy — they issue short-lived installation tokens, decouple from any human user's lifecycle, and aren't blocked by enterprise PAT policies. But they require ~50 lines of JWT-signing code in the `.gs` file. For the current 5-project footprint, a fine-grained PAT is simpler. Reconsider when we exceed ~10 GAS projects.

## Troubleshooting — 404 on `api.github.com`

Auto-deploy reports `Exception: Request failed for https://api.github.com returned code 404` in the GAS Executions log. This is GitHub's **anti-enumeration response** — a fine-grained PAT that lacks access to a target repo returns 404 (not 403), so the repo's existence isn't leaked to unauthorized callers. The response headers reveal the actual cause.

### Diagnostic

Run from any terminal (replace `YOUR_TOKEN` with the value in GAS Script Properties):

```bash
curl -i -H "Authorization: token YOUR_TOKEN" https://api.github.com/repos/LightAISolutions/lightaisolutions
```

Then read the response headers and body:

| Signal | Meaning | Fix |
|--------|---------|-----|
| `HTTP/2 200` + repo JSON | Token works. Problem is elsewhere (GAS, Apps Script API, OAuth scopes) | See "Other failure modes" below |
| `HTTP/2 404` + `X-RateLimit-Limit: 5000` + `x-accepted-github-permissions: metadata=read` | **Token authenticates but has zero access to this repo.** Most common cause | Edit the token — confirm Repository access includes `lightaisolutions` and Permissions include `Metadata: Read` and `Contents: Read` |
| `HTTP/2 404` + `X-RateLimit-Limit: 60` | Token string is not authenticating at all (parsed as anonymous) | Token string is malformed — re-copy from personal tokens page, re-paste into Script Properties |
| `HTTP/2 401` + `"Bad credentials"` | Token is revoked, expired, or typo'd | Regenerate the token |
| `HTTP/2 403` + `"Resource not accessible by personal access token"` | Token is valid but the specific permission (e.g. `Contents: Read`) isn't granted | Edit permissions on the token |
| `HTTP/2 403` + header `X-GitHub-SSO: required` | Enterprise requires SSO authorization for this token | Click "Configure SSO" → "Authorize" on the token's page |

### "Token is pending" check

If the token was just created and the 404 persists, it may be sitting in the org's approval queue:

1. Go to https://github.com/organizations/LightAISolutions/settings/personal-access-tokens-pending-requests
2. Find the token → click **Approve**
3. Retest curl — should return 200

Enterprise admins bypass the approval queue, so this only applies to non-admin users minting tokens.

### Other failure modes (if curl returns 200 but auto-deploy still fails)

- **Script Properties missing** — verify `GITHUB_TOKEN` key exists in Project Settings → Script properties; sometimes the key gets accidentally renamed or deleted
- **Apps Script API disabled for user** — go to https://script.google.com/home/usersettings and toggle Google Apps Script API to **ON**
- **GCP project mismatch** — GAS project must be linked to your GCP project (Project Settings → Google Cloud Platform Project)
- **OAuth scopes not authorized** — open the editor, pick any function, click Run, grant permissions when prompted
- **Deployment access setting** — Deploy → Manage deployments → edit → Who has access: **Anyone** (anything else returns HTML login page for the unauthenticated webhook POST)
- **DEPLOYMENT_ID mismatch** — the hardcoded `DEPLOYMENT_ID` in the `.gs` file must match the live deployment's ID; otherwise `pullAndDeployFromGitHub()` updates the wrong (inactive) deployment slot

## Token Rotation

Fine-grained PATs expire per the enterprise ceiling (max 366 days). Even with no expiration set (admin exemption), rotate proactively every ~12 months.

### Rotation procedure

1. Mint a new fine-grained PAT — same settings as the current one (Resource owner `LightAISolutions`, Only select repositories → `lightaisolutions`, Contents: Read, Metadata: Read auto)
2. Copy the new `github_pat_...` value
3. Verify access with curl:
   ```bash
   curl -i -H "Authorization: token NEW_TOKEN" https://api.github.com/repos/LightAISolutions/lightaisolutions
   ```
   Expect `HTTP/2 200` + repo JSON
4. Paste the new value into `GITHUB_TOKEN` Script Property of each of the 5 GAS projects
5. In one GAS project (pick Globalacl), run `pullAndDeployFromGitHub` from the editor to confirm the new token works end-to-end
6. Revoke the old token: https://github.com/settings/personal-access-tokens → click the old token → Revoke

### If the minting user leaves or loses access

Fine-grained PATs are bound to the minting user's ongoing access to the resource owner. If the user is removed from LightAISolutions (leaves the company, account transferred, etc.), ALL their tokens against LightAISolutions resources stop working immediately — even ones that hadn't hit their expiration date.

Mitigation: mint the PAT under a dedicated **machine/service GitHub account** (e.g. `pfc-automation-bot`) that's a standalone member of LightAISolutions. Then no human's lifecycle affects the token. Credentials for the bot account live in a team password manager. Worth doing once the GAS automation becomes load-bearing.

Developed by: ShadowAISolutions
