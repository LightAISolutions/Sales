# Receipts.html — GAS Integration Sequence Diagram (Auth)

Sequence diagram showing the dual polling systems (HTML + GAS) and the iframe injection flow.

> [Open in mermaid.live](https://mermaid.live/edit#pako:eNq9Vm1v4jgQ_iujfAId5Ep398Oi3a64lOshtXsVUG4_IFXGGYLVYOdsA8u-_PcbxwkQCD2kk64fCsTz8sw8z4zzPeAqxqAbGPx7hZLjrWCJZsupBPrLmLaCi4xJC79ptTGoTw_-GD_cAzMwRI4isyZc2GVaYzY5NHI24Rq1EUqG9qs9tb-r2CfmX6x7I2fuPv7CGfSy7MNM3zTo08CIawrRrHFSKkkx9_Pf_uyt7OLULsrrixZMJpiqxEylt_msLIIiXGVzWq4XXXhkCcK9YrE3Kw7bNzf-2J3Udcud7oxu0REDzwjT1XXn_TVodA3ABrNq1mg2y8eu4hizVG2XSFCfhvc1wSKNjKCKOTGLsBF2AUbzWHGYKWWN1SyreFHQbmkt2Vok5G3AqtpMZNwmn6LKbo5oQxywLCPQMibUIGQR7nzrPAXdChXg_lEywZkl6qsYC_uBFFawVHxDuBuMoFH4D2LnZ7cwQr0WHE3Bvz9u71rjfFIx00xvISVi8AxpT_QDeCr4CwlKJJLy1sLRbo6M7XFKacbqBWUjuh_0P4-fB7ctMFxlZ6F4H2ozOVEc0se6RHPIS6aMfSBDElkjYabNqEft3KnlfZt7Xva4JqjFfFsE_wUStLByJQk5V8dw8jR5wbhkIm2RBhxzB0GdQbRA_gIuu9LiW04QNHrReDDpPz8O-6P-GLiSc5E0KzrxtdYWodGsUktdWuWd-HVOyZuvDNuk65cPqUS1hzgn_wU03JxsoXNVtjlVKoN-8RAMzZWMjT86HBQKdkeQzy2oT8989tGKJXHLltmB-2Rf1I_1VSf88mXzA5QG6py0KBnt1N3zGn-WWseNSwM83zDx_vBkkEcLtYFp8JTF1G-ZhGE4DYhNQ2xmNGr0qG3UStaH2E3oRshYbcJU-bEKNTrlN5pVr-MJGOZW5d6ZBrRnjSBOhsjiLcEwWcqo_4SmigBTg_Cw7wYsabG9DjAvU2nXjcM-5vSnbHsUe-TWVEHVK72LCJaluiXEynbhXRi-DcM3YXgdhp2DiCX0_MvZZTXxe66qvM47QxuSANIg0tqCYyWWUzzZbS2inIaoS4jw3F0H-FUY-6mYoQO1eVElJHhnYEpijOudw5aJNH1tBKDB5pZqcqhFASdH3zwZjruj4agiPDcaNWCrunco1xdrfxo4-5WTPuYyvOq8BS_dchT-D9lH7lq-SPMX6rLkirblgUAvVaSLkcuxR9dde7SVHB41nfKTC9NnG8x9QkUJ3YsA3cxvDKi536Tuccu9ObE4hlLN7uIvfc6PRORGrHxFgkeVrTJTf5VG7hb1-Ur2Xf0VsC7a72j5orqQeZkgXBZNie73Intg-iXvX0EWvcMZkgrBL4ojTGUB9aAOFXkBJpqD_44oaAVL1LTmYnoN_z4NaHXQbRt0p0GMc0YX4jT4STZ0QypHb9C1eoWtwA9C8bruH_78B1DjwbQ)

```mermaid
sequenceDiagram
    participant Browser
    participant HTML as Receipts.html
    participant HV as Receiptshtml.version.txt
    participant GV as Receiptsgs.version.txt
    participant GAS as GAS Web App<br>(Apps Script)
    participant Google as Google OAuth
    participant CL as Changelogs

    Note over Browser,HTML: Page Load
    Browser->>HTML: Load Receipts.html
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
        HTML->>HV: GET Receiptshtml.version.txt?_cb=timestamp
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
    HTML->>GV: Initial check: does Receiptsgs.version.txt exist?
    GV-->>HTML: v01.XXg (exists → show GAS pill)
    loop Every 10 seconds (after 15s initial delay)
        HTML->>GV: GET Receiptsgs.version.txt?_cb=timestamp
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
    HTML->>CL: Fetch Receiptshtml.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup

    Browser->>HTML: Click GAS version pill
    HTML->>CL: Fetch Receiptsgs.changelog.md
    CL-->>HTML: Markdown → parsed to HTML popup
```

## Key Design Notes

- **GAS iframe injection** — the deployment URL is stored as a reversed+base64-encoded string in `_e`. The iframe uses `srcdoc` with a bootstrap script that reads the URL from `parent._r`, deletes it, then navigates — preventing the URL from being visible in page source
- **Dual polling** — HTML and GAS versions are polled independently with anti-sync protection (if polls align within 3s, GAS poll gets a 5s delay to re-stagger them)
- **Two splash screens** — green "Website Ready" for HTML version changes, blue "Code Ready" for GAS version changes
- **Audio unlock via UAv2** — since the GAS iframe covers the entire page, click events don't reach the parent document. The UAv2 poll detects `navigator.userActivation.hasBeenActive` (propagated from cross-origin iframe clicks) and unlocks AudioContext without needing a direct click on the parent

## Receipt Pipeline — Upload → Extract → Review → Save

Sequence for the receipts app feature (v01.01g/w upload, v01.02g/w extraction + review + save, v01.03g retry/fallback, v01.04g/v01.05w extraction cache + history browser, v01.09g/v01.11w batch upload + reports + edit-in-place). All routes require a validated session; the upload and save calls travel as body-POSTs with client-side retry because their payloads exceed GET URL limits. Extraction results are cached server-side by file ID (10 min) so transport retries never re-run Gemini.

> [Open in mermaid.live — Receipt Pipeline](https://mermaid.live/edit#pako:eNqlWM2O28gRfpUCL6Yw4mhm_QNEjh3MjMb2LOyxMRojMFaLRYldonqn2U13N6XRGg72tMCeFpsskMsCuSTPkJzzKH6B5BGS6iY1kiXLdnISRbKru6q--uorvklyIyjpJ45e16RzGkgsLJYjDQBQofUylxVqDy8d2c27Ty6fPQV0cEE5ycq7_akv1W_H9mHqctRQoSYFe2BpJmkOOVrR2TTy-GjINvjn9zSGo6oKFoR5YZzf8v7AyhmFFcYUiuL_sMQ2x4CJUYLstr2olFqGxfHq6MVZWFqQJotezkihLmosaMvqYTjosLKEwk2JfFjaOg978FRqOvNUOvA4dp2RjjbOjScwM7IhjN3hsA8X9LqWlhw4WWgSmdTgyDlpNKRY-ylMlJkDjs2sPQgvzR4-5JD34RIrGCVDDnLj9CiBdz_8EXIsySL0YCIVQSXzqzZvvHC5fmDm2uWoCLyBdz_-9fDewUF1DV--OH0MaY56hq4T7I3R0b07axYeHw378OL58BIw99LoB3WlDIomDJBOjC1hbMTiPlu-Deg9lZV3XdAGHp9ewgSVGmN-1Tj2-GjYWp2hkgI9DWMoHhk7QI-pN1ek194OOe9Dbgk9PZKK0ovs1atXr549GwyyJ0_K0rns_Pz8fP_bqlhbyLEn7WpLzXkvcey-STuwB1hVpAVYM4fUefS1azwjsWJiGcI3TeDPRDcEu_19adXb3fGia28x98uAcUywkmCq7aFpnC3Is6fHizORxg07-wX5Y2XG6XooA7R5QcA0nRjtSXt49_0vIEssKJSkq4x2NMynVCI7bGXu4cvh8_PWVrCStQ6UZPMpat8FFMKSc13gTHUhr60lnS-64OqxNx5VFzxedyFec4nk6KkwdtEF1RbIV19DSphPYS79FBAEcaGVfMz27a1Bd3Wet5tjE2dUHk5jTLl-wiskSMSnK5ngEuLSW7IRmIq0g8pSNpFKkYAUlYKJJCUckJAex6otQFKOVveZoFSfsQnXwCLkoERdowLS3i4a01psKfIj8W3tfHuaXggeyEAvXJpDnNGy-ncCzuGMNsuzD0sELzmaRIAA7MHE2JxgorDYLNNBXSnJaYJ8SvlVcMphSUuQ7DE09gIAmDER-ASi3Y8hwQ68IWuN7YNozb2FWityLm7-4BDSURK8RL2Y42KUbB7lyDGBAjMypwrOBjD0xtI351jSkhIgzY1S0kV4TCbyGrIvetntbWV2QZpd8VOCamq8YYYs0efTcEvTHM4G7zPKI6lU610gEKlztd9WypJOQhS6YHEOdIOjK6r8BkddUKUwp5WOYs3cQRrKpSKbMQ7aUpHkthgY11KJcOhnRvupWsCwLku0C25ODHRnwGgQpMjT7mJbAqXPATgT6wQXER9TJeDdr38aJZAOpAvgl9p5QgGKcEYuHIcDtEmwH2yVT6Tzxi5gzBEgC-ns4HD_4E4BPQhXd-f3I74yo9UCBE2wVr55tnzr3vzDfbTZoWmhE6k8WQdpi2boBaoDi7og6IGbmnlW64jpHjhjfTZeZPxOZ3chKun8Ui58lPfD8ueaMi9LAoXfLQLrQSkLliosFc4GDRdsYj4wb-uCAy-9oixHR-J-KOusqNGu97ZlDQwXOo_oz6KUgkAO1nExBESh82Th6OTpLcf7LJ3KjapLDWlhOXCBVswVdeHwICulBj-1xntFW-CKYikjGaDdJg_rxdMSRIubB4ed4Gf8D8byWY1tARty0txNOU8PVpK0tZu7r75-GyLKqQJLWpAl8QHk4GrN7858QW3iB-RRqo9nfxmVVV7ZA-nde6Sww5u1hhv9ousKtSABIp5jr2E5JfXVTr2aGysiWQTkfXJ5_fsvf_457Cx1aGCjZBAY53ejBPC_rYgfeQ5mgVIHOSA13HG7wxlJ65MVVFh_cXx0stKwbkUbt5hNSxml93xKGqxRxEDWE1nUy-TfJCUe_zPSsiwrR_7SopuSSL2tqcP0e9NneHzhoIc-9ofbByBw4Xbxckwo72-pNFwdE2vKYJHRuyOb-9fKXTMUjPWfkcpRchqXhPXM8rXjUAUF6GHaEHVDoJ2PqWA29elsyOc-ji2NygrczRQW0rl1CguPt2Wi8SNYQtfEI31-VPtpp8sR1OA5UyGY4S1W3NtywfeZd7vNqBSTwqIchJnrQEsyprlpYDvychx0RkNmUSo6lqeG0y110eTqN22uDg935OplMNM0tQKVIruAslZeZo4U5Z4nvQoO73IFwJi3bowpYyo4ZXUekNmFOB2oBcTvBF6i2tC9cesTU1ZB87w_PP4vA2Tn40vXZ6kwj-eolANXYc5q5Me_3du_60Iwm5F_YolbKlm4ePEMpoTCGlOu7LWe4NByjYUgVmN2X9dUc7WFRsOd8T0V_6FJwIHzVIUmWBcRW8EU69x__h00mAmcj5JOEMjf_xIVvrHQaikUM9Q5Lbuwpmt_MwF8EFWnQvp1Bc6IjPry0wDVSrCmZ3AMRsm7X3_61z9-itZbu6tDyijZHY3VsSsQ10aP5NBvOc0jeR17PJNe2PD_GIgCZKSgsjJhSB4vVsYiToKluZWeXEP0S3LZ_XWH6cV9Vrk2a5p6rchKI7gLeWu4SzekutsvS5_PqUFj8NS7hhDmUT8laVfYNNDFFwcHBx8RUOuqY8vXpxMlSfvMSUEwrvMr4rMKlGrRmxNdqUWvjBNLbywz1Dwt9-JPKI29MFSwvtyQ6l24-dZw80khfqpwXcgNizqW8Z2km5RkS5Qi6SdvRomfUkmjpD9KmgFilLxNugnW3rAaTvrcsbtJXbGp5jNpvPn2P0CAIDM)

```mermaid
sequenceDiagram
    participant User
    participant HTML as Receipts.html<br>(scan panel + review card)
    participant GAS as GAS Web App<br>(doPost)
    participant Drive as Google Drive<br>(receipts folder)
    participant Gemini as Gemini API<br>(generativelanguage)
    participant SS as Spreadsheet<br>(Receipts + LineItems tabs)

    Note over User,SS: Requires signed-in session (auth flow above)
    User->>HTML: Tap "Scan receipt" → camera / file picker
    HTML->>HTML: Downscale to ≤1600px JPEG (canvas) → base64
    HTML->>GAS: POST action=uploadReceipt (form body; ≤3 attempts, no GET fallback)
    GAS->>GAS: validateSessionForData(token)
    GAS->>Drive: createFile(R-YYYYMMDD-HHmmss-NNNN.jpg)
    GAS->>SS: ensureReceiptTabs_() + append row (status=uploaded)
    GAS-->>HTML: {receiptId, fileId, fileUrl}
    HTML->>GAS: POST action=extractReceipt (GET api op fallback)
    GAS->>Drive: getFileById(fileId).getBlob()
    GAS->>Gemini: generateContent — image + responseSchema (strict JSON)
    Gemini-->>GAS: merchant, address, date, currency, subtotal, tax, total,<br>category, lineItems[] (each with a department category)
    GAS-->>HTML: {success, data}
    alt Extraction succeeded
        HTML->>User: Review card opens pre-filled (all fields editable)
    else Extraction failed
        HTML->>User: Review card opens empty — manual entry
    end
    User->>HTML: Adjust fields / line items → Save receipt
    HTML->>GAS: POST action=saveReceipt (form body: receiptId + reviewed JSON + force flag)
    GAS->>GAS: Duplicate check — same merchant+date+total as a saved receipt<br>→ {error: duplicate} unless force=1 ("Save anyway")
    GAS->>GAS: Assign readable ID Store_Name-YYYYMMDD (collision suffix -2/-3)
    GAS->>Drive: Rename the photo to match the new ID
    GAS->>SS: Fill receipt row incl. address (status=saved, raw extraction kept)
    GAS->>SS: Replace LineItems rows (with per-item categories)
    GAS->>SS: Rebuild the Monthly Summary tab (also on delete)
    GAS-->>HTML: {success, receiptId: newId}
    HTML->>User: "Saved ✓" (Discard instead leaves the row status=uploaded)

    Note over User,SS: History browser (v01.04g / v01.05w; saved-only default v01.05g / v01.06w)
    User->>HTML: Tap "History" → filters (merchant / date range / show-unsaved / sort-by-date)
    HTML->>GAS: POST action=listReceipts (GET api op fallback)
    GAS->>GAS: One-time lazy data migration (IDs → Store_Name-YYYYMMDD,<br>merchants title-cased; flag-guarded)
    GAS->>Drive: Sync photo-folder viewers to the Master ACL's<br>Receipts column (grant + revoke, 10-min throttle)
    GAS->>SS: Read Receipts tab, filter (status=saved unless uploaded=1),<br>upload order or receipt-date order (sort=date)
    GAS-->>HTML: {receipts[]} → list rendered
    User->>HTML: Tap a receipt row
    HTML->>GAS: POST action=getReceiptDetail (GET api op fallback)
    GAS->>SS: Read receipt row + its LineItems rows
    GAS-->>HTML: {receipt, lineItems[]} → expanded detail + photo link

    Note over User,SS: Record deletion (v01.05g / v01.06w)
    User->>HTML: Tap 🗑 → inline "Delete?" arm → tap again within 4s
    HTML->>GAS: POST action=deleteReceipt (GET api op fallback)
    GAS->>GAS: RBAC check — 'delete' permission when roles configured
    GAS->>SS: Delete receipt row + its LineItems rows
    GAS->>Drive: setTrashed(true) on the photo (recoverable ~30 days)
    GAS-->>HTML: {success} → row removed from the list

    Note over User,SS: .xlsx export (v01.05g / v01.06w)
    User->>HTML: Tap "Export .xlsx" (uses current history filters)
    HTML->>GAS: POST action=exportReceipts (GET api op fallback)
    GAS->>SS: Build temp spreadsheet — Receipts + LineItems sheets
    GAS->>Drive: Export temp as .xlsx (OAuth), then trash the temp file
    GAS-->>HTML: {fileName, base64} → Blob download in the browser

    Note over User,SS: Batch upload — mass processing (v01.09g / v01.11w)
    User->>HTML: Tap "Upload" → gallery multi-select (cap 15 per batch)
    loop Each photo, strictly sequential
        HTML->>HTML: Compress → base64
        HTML->>GAS: POST action=uploadReceipt (form body)
        HTML->>GAS: POST action=extractReceipt<br>(calls spaced ≥6.5s — Gemini free-tier RPM headroom)
        GAS-->>HTML: {data or error} → queued for review
    end
    HTML->>User: Review cards step through the queue ("· n of N")<br>— Save or Discard advances to the next receipt

    Note over User,SS: Edit saved receipt in place (v01.09g / v01.11w)
    User->>HTML: History detail → "✏️ Edit receipt / line items"
    HTML->>User: Review card pre-filled from getReceiptDetail data
    User->>HTML: Fix or remove lines → Save receipt
    HTML->>GAS: POST action=saveReceipt<br>(idempotent by receiptId — rewrites row + LineItems)

    Note over User,SS: Reports (v01.09g / v01.11w)
    User->>HTML: Tap "Reports" → period control + filters
    HTML->>GAS: POST action=reportReceipts (GET api op fallback)
    GAS->>SS: Read all saved receipts + their LineItems (cap 2000)
    GAS-->>HTML: {receipts[], lineItems[]}
    HTML->>HTML: Client-side buckets (daily/weekly/monthly/bi-annual/annual)<br>+ instant filters (merchant, category, department, dates, cost range)
```

Developed by: ShadowAISolutions
