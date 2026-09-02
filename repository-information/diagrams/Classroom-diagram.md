# Classroom.html — GAS Integration Sequence Diagram (Auth)

Sequence diagram showing the dual polling systems (HTML + GAS) and the iframe injection flow.

> [Open in mermaid.live](https://mermaid.live/edit#pako:eNq9Vt9v4jgQ_ldGeQId5Ep392HRbldc2ushtXsVtNw-IFUmGYLVYOdsA8v--N9vJk4KgdCrdNL1oYA94_lmvm_G_h7EOsGgH1j8e4UqxkspUiOWUwX0lwvjZCxzoRz8ZvTGojne-OP-9gaEhSgT1hqtl-HCLbMGu0nNio3CNRortQrdV3fscF13SO2_mA_GbM8ff-EMBnn-YWYuWvRpYRwbmbt2g5PWaYaFn__252DlFsd2kU9xIVSKmU7tVHmbz9ohaMJV1afD5ejDnUgRbrRIvFm52b248Nu801gw3n62ukQmBx4Rpqvz3vtzMMgVwJZwetZqt6tlTjnBPNPbJRLWh9FNw2GRQUFY5ZzYRdhItwBr4kTHMNPaWWdEXvOiQ_uVtRJrmZK3BacbI5Fxl3zKNPsFog2RIPKcQKuEUINU5XGna-c56Ne4AP5HwWQsHHFfx1jaD5V0UmTyG8L1cAyt0n-YsJ_bwhjNWsZoSwH47e5zadgnkzMjzBYyYgZPsPZAPyDOZPxEipKporiNcAz3knWDmELae_2EqhXdDK8-3z8OLztgY52fhOJ9qMzkROfEKNcVmn1ecm3dLRmSylqpsF1BNeoWTh3v297xssM1QSPn2_LwXyBFBytOSaq5PoRThCkSxqWQWYc0wMztHcoG0QLjJ-Do2shvBUHQGkT3w8nV493oanx1D7FWc5m2azrxuTYmYdCuMkdVWhWV-HVOwdsvdNuk7wcQqUR3Rzgn_wW0uE-20DurypxpncNVuQiW-kol1m_tNwoddk2QT86oT4_x7KOTSyJXLPM9_8kuqx_rs1745cvmB2gDVDrlUAkarM_rDf4ic0wOh4G4mDHJbvOok8cLvYFp8JAnVHCVhmE4DYhOS3Tm1Gu01LV6pZqPeG7RjVSJ3oSZ9n0VGmTpt9p1r8MWGBVW1eCZBjRprSRSRiiSLcGwOdVuwWjqCDCzCLe7asCSJtvLAIs0teFq7Nex4D8T24OzxzynSqpeqF1EsBzlrSDRrg_vwvBtGL4Jw_Mw7O2dWEEvvpycVhM_6OrS672zNCIJIHUizS04lGLVxpPnsUWUUxf1CRGevO4Av0rrPpVdtCc3r6qUJM8GtmLGcvEYXC6z7KUmgJaYO0qKYcsSTwG_fdQe14ftUYd4qjka0NaVzzDXr1b_NGD7FYsfCyGe9d6CF2_VDP-H8CO-mV-l-lcqsyKLBuaeRF-rST6jEOSAbrzueKtiuDO0Gx_dmT7acO4DagrIbwG6nN9Y0HM_THm5w68nkSRQ6Znv_srndFNE3GTVMwnudL7KbfNtGvFF6uNV7HP-NbB82u_o4sXBTI6rCOGyrEp0s1PZrTBPRQFLtughZ0krhL_MjkBVGTSj2pfka0BRJ_x3SEEnWKKhUZfQe_z7NKDxQVdu0J8GCc4F3YrT4CfZ0DWpmeCg78wKO4FvhfLd7hd__gOOXsXI)

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
- **Audio unlock via UAv2** — since the GAS iframe covers the entire page, click events don't reach the parent document. The UAv2 poll detects `navigator.userActivation.hasBeenActive` (propagated from cross-origin iframe clicks) and unlocks AudioContext without needing a direct click on the parent

Developed by: LightAISolutions
