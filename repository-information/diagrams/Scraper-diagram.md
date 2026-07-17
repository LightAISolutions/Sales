# Scraper.html — GAS Integration Sequence Diagram (Auth)

Sequence diagram showing the dual polling systems (HTML + GAS) and the iframe injection flow.

> [Open in mermaid.live](https://mermaid.live/edit#pako:eNq9Vt9v4jgQ_ldGeQIdZEt39-HQbVdcyvWQ2r0KKLcPSJVxhmA12DnbwLI__vcbxwkkJXQrnXR9KGDPjL-Z75uxvwVcxRj0A4P_bFByvBYs0Ww9l0B_GdNWcJExaeF3rXYG9enGn9O7W2AGJlyzDHW4suu0wWpWsXEm4Ra1EUqG9os9Nb-pmifmJ8aDibN2H3_jAgZZ9ttCX7XoMw8hMttucFIqSTH389_-Gmzs6tQuypOLVkwmmKrEzKW3-aQsgiJcZWU6rhB9uGcJwq1isTcrNrtXV37b7TSUym0ebK7RkQKPCPPNZe_XS9Do8scWs2rRarfLZZdwjFmq9mskpA_j24ZgkUZGSMWSWEXYCbsCo3msOCyUssYSkpoXBe2X1pJtRULeBqxqPImMu-RTJNnPEe2IApZlBFrGhBqELMKdr5xnoF9jAtw_OkxwZon5OsbCfiSFFSwVXxFuRhNoFf6j2PnZPUxQbwVHU9Dvt7uH0jifVCw003tIiRc8w9kD_QCeCv5EehKJpHMb4WjXQ8YOOB1ppuoJZSu6HQ0_TR9H1x0wXGVnoXgfKjM5URyOYluiqfKSKWPvyJA01kqY6TKqUTd36njf9pGXI64ZarHcF8F_gQQtbFxKQi7Vczj5MXnCuGYi7ZAGHHOVoM4gWiF_Ane60uJrThC0BtF0NBs-3o-Hk-EUuJJLkbRrOvG5Niah0WxSS1Xa5JV4s6TD2y_02qzvBw-pRHXHuCT_FbRcn-yhd1GWOVUqg2GxCIb6SsbGb1UbhYLdEOQz0-njI198sGJN1LJ1VvGeHXP6vr3ohZ8_776D0kCFkxYlo3F6WG_wZ6l11LhjgOfzJT5unvTxZKV2MA8espjKLZMwDOcBkWmIzIw6jZa6Rm1kc4hDg-6EjNUuTJXvqlCjE36rXfd63gDj3KocO_OApqwRRMkYWbwnGCZLGZWf0NQRYGoQ7o7VgDXNtZcB5mkq7apRrWPOfsr2z2JP3JQqqHqhdhHBspS3hFjZPrwPw3dh-DYML8OwV4lYQs-_nJ1VMz_m6sLrvTc0IAkg9SFNLXguxLKJZ4ehRZRTD_UJEZ656AC_CGM_Fh1UEZvXVEJydwam5MW40jlomUjTlxoAWmxpKSUHWhRocvDtk9a4qbdGHeC5xmjAWle9A7l9tfLngbPfOOFjLsKL3jvwwi0b4f8QfeTu5Fcp_pWqLKmiUVmR52v16GLkYhzQXded7CWHe027_OS29KeNlv5ARQe6VwBdy28NqKUfo265415NLI6h1LK79Uuf8w0RuQYrn0dwr7JNZprv0chdof68kn2Xfw2si_YHWr6qTWNexg_XRU2i26PG7ph-ystXcEXPN0NKIfRFbgSpxN-MqSrIn0OiLvjvgIJOsEZNIy6m1_e3eUBjgy7aoD8PYlwyugvnwQ-yoctROXKDvtUb7AS-DYpXul_88S9oaL3N)

```mermaid
sequenceDiagram
    participant Browser
    participant HTML as Scraper.html
    participant HV as Scraperhtml.version.txt
    participant GV as Scrapergs.version.txt
    participant GAS as GAS Web App<br>(Apps Script)
    participant Google as Google OAuth
    participant CL as Changelogs

    Note over Browser,HTML: Page Load
    Browser->>HTML: Load Scraper.html
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
        HTML->>HV: GET Scraperhtml.version.txt?_cb=timestamp
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
    HTML->>GV: Initial check: does Scrapergs.version.txt exist?
    GV-->>HTML: v01.XXg (exists → show GAS pill)
    loop Every 10 seconds (after 15s initial delay)
        HTML->>GV: GET Scrapergs.version.txt?_cb=timestamp
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
    HTML->>CL: Fetch Scraperhtml.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup

    Browser->>HTML: Click GAS version pill
    HTML->>CL: Fetch Scrapergs.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup
```

## Key Design Notes

- **GAS iframe injection** — the deployment URL is stored as a reversed+base64-encoded string in `_e`. The iframe uses `srcdoc` with a bootstrap script that reads the URL from `parent._r`, deletes it, then navigates — preventing the URL from being visible in page source
- **Dual polling** — HTML and GAS versions are polled independently with anti-sync protection (if polls align within 3s, GAS poll gets a 5s delay to re-stagger them)
- **Two splash screens** — green "Website Ready" for HTML version changes, blue "Code Ready" for GAS version changes
- **Audio unlock via UAv2** — since the GAS iframe covers the entire page, click events don't reach the parent document. The UAv2 poll detects `navigator.userActivation.hasBeenActive` (propagated from cross-origin iframe clicks) and unlocks AudioContext without needing a direct click on the parent

Developed by: ShadowAISolutions
