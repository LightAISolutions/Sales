# Profiler.html — GAS Integration Sequence Diagram (Auth)

Sequence diagram showing the dual polling systems (HTML + GAS) and the note-box fetch transport (PROJECT OVERRIDE — no iframe: document-loads of /exec fail in cookie-carrying browsers).

> [Open in mermaid.live](https://mermaid.live/edit#pako:eNq1V11uGzcQvspgH9IVLG3jpnlRmgSq4jpq_QfLdgJUhUHtjlaEuSTL4UpWnAB96gHavvcKPVNO0CMUw9219WfXQNEXSSDn55uZb4ajmyg1GUbdiPDnEnWKb6TInShGGgDACudlKq3QHr51Zk7oNi_enh0egCA4cWYiFbpk6gu1RexiWYhlkhk6kkYn_tpvyu-vyOf0L9K9IYvz1zscQ8_ab8buVdyzlmCYOml9a4uSMbnCoFf9Ou6Vfrop1w_x9adC56hMTiNdyRwZj2Bm6JrktDkXXTgROcKBEVklVl92Xr2qrvlmW7b49lboDXJh4BLh86-_gUOOHmPhzThutcIZx5qhVWZRoPZwfnqwxczQC5pCFoxlLAPxXOrMzJPLXBAHcO5Ua5t_QyTRgeYYx-YaHOoMHYEWXs4QJsYVEO8PhkAy1x2pwWhOGmq_am6_N-xC35griR2FRDBBn07h8y9_AF6nIadn5gp1G_wUdeXPWIJYpF4a_ZIPaov7vWHnFuD3w-MjmEkBfaM9aj9EN5MpQiy00YvClATERzoHK_y0dX_RquJ3V0gA_IHay1QwitWIavmBll4KJT8gcB7iWn-QsZ5fQI2IGvTh-i4A1lFy7IRbgDIiw3vock7oIFUyvSIYylzDYDscxx1MvpemSBRSGvcPBntHZ5eDN22g1Nh7oVQ64FkJHKYoZw2a5SpaQ_4QiUSOcS6oI0o_7fi6ePy1VKc7XBfo5GRRG9-BHD2UHJLUE7MOJ7gJAWMhpGqDFgWuGA1smmJ6BezdOPkhFAjiXv9scLF3eXK6N9w7g9Toicy38WZrEA6pVL4NVIZMfDkRUj3AmLcX3Wrs9UpvOqc4cUhTiLlJF7D7tEmzMsbCXn0IhKnRGVVXy_120YX9vbN7R-Pry3T80ssCyYvCLqlf3AX1cfZ0N3n_fv4RjINCSO4IoVO8Pd-iL5Tn2rAbqPowu7vcHCRTM4dRdG4z4aXOkyQZRbADhB4s6kzqvEOm1NtN1HnrQj17lKnaKnHIzI9bq1rrHXAapMLQG0XvcEzSI5yiyBajCMgqHnE7sOYeFSEc3qUCCpPhw-hCjMZxKpaTGGqvxGLN9lAUCHWdHkhc35TaZ2auITO-C8-T5OskeZYkXyXJ7pLFBnr4ce-kYqr0hmu0231OkKESi3qErtOwaeGL25EFKXdQFzKD9z2xgNeS_Ou6gZaoVjEqhzgIUKgKceIYmJVKPUR-iMXEowOGLGssAXproy3219piFd59TbEF6SrjGeXs0awfRSxfMukxC29WxdimA_53tvd5CXgU1R9Jx6ZKkC7z8rFEZBuBhT3tZWe40CnXx2O68UhW3gaTyqFRCubST6WGZwRmUk1PPm7zniayDBoSgze3Og90QrVVzNDxrmWFRgXxMHXC8mNpnC0Jxk5mebM7rGe5zw9qSHBt4-8_f_9rFPEWIyCrlp_NF7DaXZrNBOf0RBsbeKikxo-p0JlkrtATUmUeVtCT4-HZi8BkYSUU0jnjeJ2cCKXGIr0KrCIkrltnJlTQz1obj96JM9eLLpw79R2D6FkbKNLE_LoGVcUePNNUOMygf3x6cj68PDv-Ye-o3oXZmEXnFy-g1DzC2ZI2_rJ6NkuHWahLlVeH1jhPID2hmkCp76S2PbA30mNBP_70CXbg5i4jfMBu6mHKZJYehOeZ1ST8iwBcCfLndcvFo4gkz2A_ldSIwVwQzJ30HvUoghkBCqckuhbssIFRZFlwrJDbNfQeTaUlIGs8W5U6eOUCjiJQkvz9TOszWZrVH06MLS09RKnA7GbCcKetsIithfqtPvdp4yAp6vbrH9xl9FC4q9CpnD8rHGHGXVL3kC1tg347ouWR9whAOf1XOFE7KtAVQmZRN7oZRX6KBY6i7ijKcCJK5UfRp6gdidIbHiFR17sS21E1Zus_oNXhp38AgafMhQ)

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
    HTML->>HTML: Dossier note box renders native form (GIS sign-in on parent)
    HTML->>GAS: Cookie-less fetch — exchangeToken, then note ops (action=note)
    GAS-->>HTML: JSON via ContentService (anonymous serving path)

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

    Note over Browser,GAS: Coverage panel (Scraper corpus bridge)
    Browser->>HTML: Click "Coverage 📰" on a dossier
    HTML->>GAS: fetch action=news&nop=timeline|candidates&slug<br>(POST; GET api mirror as fallback — session-validated)
    GAS->>GAS: Proxy: UrlFetchApp → Scraper ?action=corpus<br>(shared CORPUS_TOKEN Script Property; unset → not_configured,<br>panel reports itself unconfigured)
    GAS-->>HTML: {items[]} + {candidates[]} → overlay split at the dossier's<br>lastUpdated ("since this dossier was written" vs earlier) +<br>"possible relationships spotted in the news" list

    Note over Browser,CL: Changelog Popups
    Browser->>HTML: Click HTML version pill
    HTML->>CL: Fetch Profilerhtml.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup

    Browser->>HTML: Click GAS version pill
    HTML->>CL: Fetch Profilergs.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup
```

## Key Design Notes

- **Native note box over fetch (PROJECT OVERRIDE)** — the deployment URL is stored reversed+base64 in `_e` and stashed in `window._gasNoteUrl`; the note box is native page UI (GIS sign-in popup on the parent, fleet CLIENT_ID), and all backend traffic — token exchange and the note ops — goes over cookie-less `fetch()` to `?action=note&nop=…` (POST with GET api-route fallback; file payloads POST-only). Document-loads of /exec (iframe or top-level) are avoided entirely: they fail in cookie-carrying browsers via Google's multi-account routing. When `_e` is empty the box falls back to the GitHub-issue-form flow
- **Industry Guidance ops (role-gated, v01.38w/v01.17g; progress sync v01.68w/v01.27g)** — the same cookie-less fetch transport carries `?action=guidance&gop=index|doc|mentions|progress|setprogress` (POST with GET api-route fallback). Server-side `handleGuidanceOp_` requires `guidanceAllowed_` (the `admin` permission, or a tier in `GUIDANCE_ROLES` — currently `contributor`) before returning document-analysis module JSON; the page's `✦ Industry Guidance` masthead button (created only for guidance-capable sessions by the auth wall's `pass()`) opens a full-screen overlay that renders the module — prose, tables, pros/cons, timeline, bars, flashcards, quiz, ledger, glossary tooltips — entirely from the fetched JSON. Reading progress (section ticks) syncs per account via `gop=progress`/`gop=setprogress` into one Script Property per account (`gd_progress:<email>`); the page keeps localStorage as its offline fallback and migrates local-only ticks up on first sync. Content lives in Profiler.gs (repo + GAS project only, never on public Pages)
- **Dual polling** — HTML and GAS versions are polled independently with anti-sync protection (if polls align within 3s, GAS poll gets a 5s delay to re-stagger them)
- **Two splash screens** — green "Website Ready" for HTML version changes, blue "Code Ready" for GAS version changes
- **Audio unlock** — the note-box iframe does not cover the page, so parent clicks reach the document normally; the standard template audio unlock applies

Developed by: LightAISolutions
