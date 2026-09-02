# Classroom.html — GAS Integration Sequence Diagram (Auth)

Sequence diagram showing the dual polling systems (HTML + GAS) and the iframe injection flow.

> [Open in mermaid.live](https://mermaid.live/edit#pako:eNq1V-1u4zYWfZULLZBKGFnTbLd_3J0UrieTBk06QZxJC9RFQJNXMjcUySEpezxpgP3VByj2Cfsku5eSEju2swEW-8cf4r3k4bnnHlJ3CTcCk2Hi8WODmuNbySrH6qkGALDMBcmlZTrAd84sPbrtge-vzs-AeRgr5r0zpi7moVY74q43oiioWKDz0ugifArbCSebCZX_L-GjCcXT1084g5G1f5-5o3RkrYcJd9KGbEeSMZXCmNf-ej9qwnw7btxucc50hcpUfqrbmB9NQDALdD0_OdExhAtWIZwZJtqwbnBwdNQO08hOwmj4IeotUnHgBuHP3_8Ah7R9TFkwszTL4jParECrzKpGHeDD5dmOacYOWUCQpWM1wlKGOXjHheEwMyb44JjdyDoZTYZ9tGYLWbGAHoLZudLJaDIYHB11GxxGREucAbMWHGqBzoPU3XT7WWvZH25UAegDdZCcBWn0JsYu_lTLIJmSnxFOTieQdvmngvLCCiboFpKj70rfDg8eqKEcJWeOuRUowwTuqdcHjw64kvzWw0RWGk53w3HURT6MOEfvr8wt6nR8dnr849XN6dscPDd2L5Q2BwIlgUOOctGjWa-LNT6co_eswrRifsCaMB_EpLzNzR7r8ojrGp0sV93kr6DCAA1tSerSPIUTl4kbxppJlYOOlVublALGc-S3QKsbJz_HAkE6Gl-dXh_fXFweT46vgBtdyirb0Em7152bcOgbFXLwTWTidcmkyp7ps-thaz2jJpjBJZYO_RxSapIVHH7Z06yMsXDcPQSP3Gjh26H1Rrkewsnx1X53-vaGz94EWaMPrLZr-dePu_pt8eVh8fPPy9_AOKiZ1AE10xwfnu_IZypQcWgZ4NFdxOPgVidP5mYJ0-SDFSxIXRVFMU3gFXgMYFELqauBN43ePcVDiy6lFmZZKNP2VeGQpJ9mm1lPW-AyRkXXmSY_4czLgHCJTKymCXirmJ8TlM3lUXmE80cqoDYCn0cX92gcUbFOYiy-Yqsnc0_IpLo6PUPc2DQ6CLPUIEwYwtdF8bei-Koo_loUh2sz9tDjj71Wdd263KbuDr_2IFCxVQ5kWvBUh30PXz94FnBqoSEIg3tPOcBP0odvuxZa01orqQrSGOBjWTwxR8isVOo5-UPKyoAOCLPswETs2VZjnDxtjE18-9piB9RNzRPMxYt1P00oviHZo4A___kvaDXb98D_Xe9jOodfJPYXCrIvE_B1Zb5UijRH1OFIBzmYrDSHC2cC8q1zsl3ttGwXNErF819q-MqDKVsDpcc53ZWYENDLmM77PueZXohHQeOc5I1qakhZhPCG93LJYXyY7UBEWh1Zm2awdMxadJForr5HJtCRB6QZvAKuRtaeE0Vptn0Wlhj4HC7eT67g6boH3Ng3Ugv8dODRUzHiZZCk3IUyKw-MfcyAkik1Y_w22zrrFkxJkt6knemdcW9ZYB3iS_zYSIc3Ka2TfxEc47f-iywut5C4pFPWQ2icRgFsyVbAAllEvCEJY9yuA_LOGYU5tJP98iukDplgM4Wg0HujPbyKhZyjEq2EsljBbvSXX-m2WmNggoBy5oS_332zGdOlBlg3LzizhPQv7Z_XByp8I8VBFb7ZS_5O3tv0Ayl67rcYfaDtLIZ25AFXE_KRH6QW_iZtp8kildTzRJp1ZtEdCNFyiNvSKEHcagGoS-M4Ckr57vjd-8tjYHpFvhcvKAE_BVDIFnSfnSN4dIv-lWaT_3bt--7iTdfY_xjPbNViMI5sqGqkiEBQV1JjLLh1xlPdqFQ5gfXcaJ8DWaSSGnOYMedzKMlBYlli2T428nMOCkWFLoe7u4Cuvr-HYIwK0vpdDfQu0m-dKaVCN6A6v374x43maIMv_uE74dtmpiSPryUeKDiD0jiolPGeLr-9-Pe3-pjE0r__wIWxjfXPSSpaS2_xZHUbmxg_bGHzysX7FYq6M8Dx2WNZzpm7jV5JZbHMeRTkU52L2cb28HdDWj90XoKo8v8rniRPanQ1kyIZJnfTJMyxxmkynCYCS9aoME3ukzxhTTDk4skwuAbzpD3pulfx9uH9vwF8KSVt)

```mermaid
sequenceDiagram
    participant Browser
    participant HTML as Classroom.html
    participant HV as Classroomhtml.version.txt
    participant GV as Classroomgs.version.txt
    participant GAS as GAS Web App<br>(Apps Script)
    participant Google as Google OAuth
    participant CL as Changelogs

    Note over Browser,HTML: Page Load
    Browser->>HTML: Load Classroom.html
    HTML->>HTML: Decode _e → reverse(atob()) → GAS deployment URL
    HTML->>HTML: Create iframe with srcdoc bootstrap
    HTML->>GAS: iframe navigates to deployment URL
    GAS-->>Browser: GAS web app renders in iframe

    Note over Browser,Google: Google OAuth Authentication
    HTML->>Google: Initialize GIS (Google Identity Services)
    Google-->>HTML: GIS library loaded
    Browser->>HTML: User clicks Sign In
    HTML->>Google: requestAccessToken(CLIENT_ID, scopes)
    Google-->>HTML: Access token received
    HTML->>GAS: postMessage(gas-auth-token, token)
    GAS->>Google: Verify token + get user info
    Google-->>GAS: User email, name
    GAS->>GAS: Check authorization (ACTIVE_PRESET config)
    GAS-->>HTML: postMessage(gas-auth-result, success/fail)

    Note over Browser,HV: HTML Auto-Refresh (every 10s)
    loop Every 10 seconds
        HTML->>HV: GET Classroomhtml.version.txt?_cb=timestamp
        HV-->>HTML: |v01.XXw| or maintenance|v01.XXw|timestamp
        alt Version changed
            HTML->>HTML: Show "Updating..." + set pending-sound
            HTML->>Browser: window.location.reload()
            Browser->>HTML: Reload → "Website Ready" splash + sound
        else Maintenance mode
            HTML->>Browser: Show orange maintenance overlay
        else Same version
            HTML->>HTML: Countdown dot: 5..4..3..2..1
        end
    end

    Note over Browser,GV: GAS Auto-Refresh (15s delay, then every 10s)
    HTML->>GV: Initial check: does Classroomgs.version.txt exist?
    GV-->>HTML: v01.XXg (exists → show GAS pill)
    loop Every 10 seconds (after 15s initial delay)
        HTML->>GV: GET Classroomgs.version.txt?_cb=timestamp
        GV-->>HTML: v01.XXg
        alt GAS version changed
            HTML->>HTML: "GAS updated — reloading..."
            HTML->>Browser: window.location.reload()
            Browser->>HTML: Reload → "Code Ready" splash + sound
        else Same version
            HTML->>HTML: GAS pill countdown dot
        end
    end

    Note over HTML,GV: Anti-Sync Protection
    HTML->>HTML: If GAS poll within 3s of HTML poll,<br>add 5s delay to GAS poll

    Note over Browser,GAS: Curriculum (action=classroom, C1)
    HTML->>HTML: showApp() wrapper → clHeaderShow() + clAppMount()
    HTML->>GAS: fetch POST action=classroom&cop=index&session<br>(GET action=api&op=classroom fallback)
    GAS->>GAS: validateSessionForData → clRequire_(sess,'tracks')<br>(viewer is turned away at the app door)
    GAS-->>HTML: {role, tracks[] (readable lessons + withheld count),<br>lessons[] as metadata cards}
    Browser->>HTML: Click a lesson row (#lesson/&lt;id&gt;)
    HTML->>GAS: fetch action=classroom&cop=lesson&id&session
    GAS->>GAS: clRequireLesson_(sess, clStampKinds_(lesson))<br>— the provenance stamp is folded and enforced<br>BEFORE any section text leaves the server
    GAS-->>HTML: {lesson} → rendered by the ported guidance engine<br>(prose, table, proscons, timeline, bars, flashcards,<br>quiz, ledger, {{term}} tooltips)
    HTML->>HTML: Fetch profiler-data/profiler-concepts.json<br>(public Pages data) for glossary fallback

    Note over Browser,CL: Changelog Popups
    Browser->>HTML: Click HTML version pill
    HTML->>CL: Fetch Classroomhtml.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup

    Browser->>HTML: Click GAS version pill
    HTML->>CL: Fetch Classroomgs.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup
```

## Key Design Notes

- **GAS iframe injection** — the deployment URL is stored as a reversed+base64-encoded string in `_e`. The iframe uses `srcdoc` with a bootstrap script that reads the URL from `parent._r`, deletes it, then navigates — preventing the URL from being visible in page source
- **Dual polling** — HTML and GAS versions are polled independently with anti-sync protection (if polls align within 3s, GAS poll gets a 5s delay to re-stagger them)
- **Two splash screens** — green "Website Ready" for HTML version changes, blue "Code Ready" for GAS version changes
- **Curriculum ops (role-gated, v01.00w/v01.01g; first tracks + renderer v01.01w/v01.02g)** — the page's own UI reads lessons and tracks over the cookie-less fetch transport at `?action=classroom&cop=index|track|lesson` (POST with a GET api-route fallback), the same shape Profiler's guidance ops use. `handleClassroomOp_` validates the session, applies the app door (`clRequire_(sess,'tracks')` — viewer is not admitted at all), pre-filters index and track answers to the tier, and for a lesson folds its own `provenance.inputs[]` stamp through `clStampKinds_` → `clGateForProvenance_` and enforces it with `clRequireLesson_` before any section text is returned. The gate is never stored in the data. Content lives in `Classroom.gs` as strict-JSON literals (repo + GAS project only, never on public Pages, because a track names gated titles); the renderer in `Classroom.html` is a port of the guidance engine onto a light palette, so one section vocabulary serves study guides, guidance modules, reports and lessons. Pre-C3 a `guidance:` provenance input renders as a deep link out to Profiler's hub rather than embedding the module
- **Audio unlock via UAv2** — since the GAS iframe covers the entire page, click events don't reach the parent document. The UAv2 poll detects `navigator.userActivation.hasBeenActive` (propagated from cross-origin iframe clicks) and unlocks AudioContext without needing a direct click on the parent

Developed by: LightAISolutions
