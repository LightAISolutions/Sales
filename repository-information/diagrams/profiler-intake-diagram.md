# profiler-intake.html — GAS Integration Sequence Diagram (Auth)

Sequence diagram showing the dual polling systems (HTML + GAS) and the iframe injection flow.

> [Open in mermaid.live](https://mermaid.live/edit#pako:eNq9Vt9vIjcQ_ldG-wQqbEPu7qGozYlu0hSJXKNA6D0gRcY7u1gs9tY2cNyP_73j9S6wYUkiVWoeAtgz42_mm2_sbwFXMQb9wOA_a5QcrwVLNVvNJNBfzrQVXORMWvhdq61Bfbrx5-RuBMxArlUiMtRdIS1bYriwq6zBetpg60zDDWojlAztF3vqdtvklppXnAZj5-U-_sY5DPL817m-atGngTHXIrftBiel0gwLP__tr8HaLk7toiLpaMFkiplKzUx6m0_KIijCVVWs4wrUh3uWIowUi71Zudm9uvLbbueFEjqjve01OtLgCWG2vuz9cgkaXR2wxayat9rtatklHmOeqd0KCfHjw6ghWKSREWKREOsIW2EXYDSPFYe5UtZYzfKaFwXtV9aSbURK3gasajyJjLvkUybbLxBtiQqW5wRaxoQahCzDna-gZ6JfYwTcPzpMcGapA-oYS_uhFFawTHxFuB2OoVX6D2PnZ3cwRr0RHE3ZBn67uy-N88nEXDO9g4z4wTPcPdIP4JngS-orkUo6txGOdhozdsDpSDNRS5StaDS8-TR5Gl53wHCVn4XifajM5ERxOIpNheaYl1wZe0eG1GutlJkuoxp1C6eO920feDngmqIWya4M_hOkaGHtUhIyUc_hFMcUCeOKiaxDPeCYOwrqDKIF8iW405UWXwuCoDWIJsPpzdP9w834ZgJcyUSk7Vqf-Fwbk9Bo1pmlKq2LSvyc0OHtFzQ37fvBRF2iug-YkP8CWk4nO-hdVGXOlMrhplwEQ7qSsfFbx0KhYLcE-ZWp9fGJz3-zYkUUs1V-FGV6yO375qIXfv68_Q5KAxVQWpSMxu5-vcGfZdZR5I4BXsyb-LB5oufxQm1hFjzmMZVdpmEYzgIi1RCpOSmOlrpGrWVziL1Qt0LGahtmyqsr1OgE0GrXvZ4L4aGwqsbPLKCpawRR84As3hEMk2eMaCA0dQSYGYS7QzVgRfPtZYBFmkq7ahzXseiCjO2exR67aVVS9ULtIoJlKW8JsbJ9-BCG78PwXRhehmHvKGIFvfhydmZN_birN2Dvg6FBSQBJjzS94HlDVmKe7ocXUU5a6hMifOUCBPwijP1YKuqo6XxvpdT-zsBU_BhXQgcxF1n2kiCgxRJLqTnwokRVJNE-kcpts1TqQM8JpQFzXQUO7ObNSpgFzn7thIBFU1703oNv5EoY_4cIIndXv0kBb-zSijIaoUft-tb-dDGK5hzQHdgd7ySHe027_OQW9acNE3-gogPd64Cu63cGVOLHq1vuuFcVi2Ooetu9Biqf8wKJnOCq5xPcq3ydm-b7NXJXqz-vYt_lXwProv2Bli8apzSvzglXZW2i0aHX7pheFmUsOaNnnqGOoSzKHAlalUcztuPGfDs0UsV_BxZ0ghVqGoExveK_zQIaK3QhB_1ZEGPC6M6cBT_Ihi5R5cgO-lavsRN4WZSvfb_4418pUtrp)

```mermaid
sequenceDiagram
    participant Browser
    participant HTML as profiler-intake.html
    participant HV as profiler-intakehtml.version.txt
    participant GV as profiler-intakegs.version.txt
    participant GAS as GAS Web App<br>(Apps Script)
    participant Google as Google OAuth
    participant CL as Changelogs

    Note over Browser,HTML: Page Load
    Browser->>HTML: Load profiler-intake.html
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
        HTML->>HV: GET profiler-intakehtml.version.txt?_cb=timestamp
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
    HTML->>GV: Initial check: does profiler-intakegs.version.txt exist?
    GV-->>HTML: v01.XXg (exists → show GAS pill)
    loop Every 10 seconds (after 15s initial delay)
        HTML->>GV: GET profiler-intakegs.version.txt?_cb=timestamp
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
    HTML->>CL: Fetch profiler-intakehtml.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup

    Browser->>HTML: Click GAS version pill
    HTML->>CL: Fetch profiler-intakegs.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup
```

## Key Design Notes

- **GAS iframe injection** — the deployment URL is stored as a reversed+base64-encoded string in `_e`. The iframe uses `srcdoc` with a bootstrap script that reads the URL from `parent._r`, deletes it, then navigates — preventing the URL from being visible in page source
- **Dual polling** — HTML and GAS versions are polled independently with anti-sync protection (if polls align within 3s, GAS poll gets a 5s delay to re-stagger them)
- **Two splash screens** — green "Website Ready" for HTML version changes, blue "Code Ready" for GAS version changes
- **Audio unlock via UAv2** — since the GAS iframe covers the entire page, click events don't reach the parent document. The UAv2 poll detects `navigator.userActivation.hasBeenActive` (propagated from cross-origin iframe clicks) and unlocks AudioContext without needing a direct click on the parent

Developed by: ShadowAISolutions
