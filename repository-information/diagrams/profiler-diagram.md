# Profiler.html — GAS Integration Sequence Diagram (Auth)

Sequence diagram showing the dual polling systems (HTML + GAS) and the inline note-box iframe flow (PROJECT OVERRIDE — not the template’s full-screen iframe).

> [Open in mermaid.live](https://mermaid.live/edit#pako:eNq1Vttu4zYQ_ZWBnmSsrW663Rehm8B1XNdAshtEjncfDAQ0OZKJUKRKUna8F6BP_YCiX7hfUowujq9pgKIviUHO5czMOUN9CbgRGMSBw99L1BwvJcssy2caAKBg1ksuC6Y9_GLNyqE9vPhtcn0FzMGNNalUaKOFz9URs-m2EdlES7ROGh35R39oP9qxz9y_WPcTMqd_H3EO_aL4eW7Pw35ROEi4lYXvHHEyJlNY-dW_PvRLvzi0G1T1DRZMZ6hM5ma6tnlvPIJZom2b06VexHDDMoQrw0Rt1lz2zs_ra7o51i263RhdIg0G7hG-__kXWKTqMWTezMNOpzqjWgUWyqxz1B7ubq-OhEk8cwsQVTBBNhCupBZmFd1nzFEBd1Z1dhxH_SSGS-OcRAuaSpybR5iXUgkHUiupEWRqWY4QXjhVZu-4yQum102YUT_p9c7Pm6pjGGvPHhBSY3OwqAVaCuOkQPAL3GQ43dR6OPHOkID-oPaSMy-N3i2gsR9r6SVT8jPCaJxA2PiPBfn5NSRol5Kja3FX171N68hHyblldg3KMIEnxnnn0AJXkj84SGSmYXwcjiWFOd_nHJ2bmAfU4eBqPHw_uR9fdsFxU5yEUvuAJyewyFEuWzTbQyuM89foHMswzJjrsdIvepVTt_bdmtATrilama6b4K8gQw8llSR1avbhVGmqgjFnUnVBsxx3gpLBYIH8ASi7sfJzNSAI-4PJeDq8v7kdJsMJcKNTme0ypq71aBEWXal8F1xZdeKHlEli7UkZTuN6LfVLb3q3mFp0CwhJRGs4e922WRlTwLA5BIfcaOHqq20hTWMYDScnV9fFPZ-_8zJH51lebLlPn4r6unx9Fn36tPoKxkLOpPaomea4OT_iz5Sn2VAa4NXuEU-Xh0JfmBXMgrtCMC91FkXRLIBX4NBDgVpInfWcKfXxEButNrtBmVpWkUViftjZ9dpXwG1lVS2lWfAR5056hFtkYj0LwBWKVtAr2EuPyiFcP7UCciPweXRVjcZSK7abWM1esfVe7IQ2VDOnZxo3MKX2wqw0CONjeBtFP0XRmyj6MYrOtiK20KsfJzcVUaWf7NHu7K0DgYqtu7TwNOzTsJXwdLOygJOCYhAGTz2BgI_S-YtGQFtUqxmVQVgZuGoqjhpHwAqp1HPkh5ClHi0QZNlgqaB3DmQx2pPFLrxTojiCdJfxhHL5YtbPArIvifQo4Psff0PN2FYB_zvbB_RIv4jqL6RjOyXg27x8KREpRsXCvvayl6w1p_l45AePZJ1tnNYJjVKwkn4hNbxxYNJ6e9Jxl76jmBDQkhi82ficVsKAlNV-MMGNKcrCHX8-B_Ry1vnauVP9O2Ap2q_o-WJ3CfM2QZQ3TRlcPdHrmtmHqn80qYJZh4KwN5UVZdGiP45om4gvAJS5_won6AY52pxJEcTBl1ngF5jjLIhngcCUlcrPgm9BN2ClNzTYIPa2xG5Qk7_5bK8Pv_0DMCrP8g)

```mermaid
sequenceDiagram
    participant Browser
    participant HTML as Profiler.html
    participant HV as Profilerhtml.version.txt
    participant GV as Profilergs.version.txt
    participant GAS as GAS Web App<br>(Apps Script)
    participant Google as Google OAuth
    participant CL as Changelogs

    Note over Browser,HTML: Page Load
    Browser->>HTML: Load Profiler.html
    HTML->>HTML: Decode _e → reverse(atob()) → GAS deployment URL
    HTML->>HTML: Stash decoded URL (window._gasNoteUrl)
    HTML->>GAS: Dossier note box builds inline iframe (?slug=company)
    GAS-->>Browser: Intake form renders inside the note box

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
        HTML->>HV: GET Profilerhtml.version.txt?_cb=timestamp
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
    HTML->>GV: Initial check: does Profilergs.version.txt exist?
    GV-->>HTML: v01.XXg (exists → show GAS pill)
    loop Every 10 seconds (after 15s initial delay)
        HTML->>GV: GET Profilergs.version.txt?_cb=timestamp
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
    HTML->>CL: Fetch Profilerhtml.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup

    Browser->>HTML: Click GAS version pill
    HTML->>CL: Fetch Profilergs.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup
```

## Key Design Notes

- **Inline note-box iframe (PROJECT OVERRIDE)** — the deployment URL is stored as a reversed+base64-encoded string in `_e`, but instead of the template’s full-screen iframe the decoded URL is stashed in `window._gasNoteUrl`; each dossier’s "Add a Field Note" section renders its own inline iframe with `?slug=<company>` so the form prefills the company. When `_e` is empty the box falls back to the GitHub-issue-form flow
- **Dual polling** — HTML and GAS versions are polled independently with anti-sync protection (if polls align within 3s, GAS poll gets a 5s delay to re-stagger them)
- **Two splash screens** — green "Website Ready" for HTML version changes, blue "Code Ready" for GAS version changes
- **Audio unlock** — the note-box iframe does not cover the page, so parent clicks reach the document normally; the standard template audio unlock applies

Developed by: ShadowAISolutions
