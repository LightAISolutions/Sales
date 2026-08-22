---
paths:
  - "repository-information/industry-guidance/**"
  - "live-site-pages/Profiler.html"
  - "googleAppsScripts/Profiler/**"
---

# Industry Guidance Command

If the user says **"industry guidance: <document>"** (or similar: "add this to Industry Guidance", "analyze this document for the guidance hub", "new guidance doc", or uploads an industry-wide document with that intent):

1. **Ingest the source** — copy the uploaded document to `repository-information/industry-guidance/sources/<slug>.pdf` (kebab-case slug with publisher + topic + date, e.g. `nvidia-800vdc-white-paper-2026-08.pdf`). Image-only PDFs are read visually with the Read tool's `pages` parameter (PyMuPDF `get_text()` returning 0 chars on every page identifies them)
2. **Deep-read and verify** — read every page; extract all quantitative claims and dated milestones with page references; verify the numbers with at least one independent re-extraction pass (subagents assigned page ranges) before any figure enters the content. Respect the source's reproduction notice: analysis is original prose, quantitative claims carry page citations, figures are re-expressed from stated data — never reproduced as images
3. **Write the analysis markdown** — `repository-information/industry-guidance/<slug>-analysis.md` (never deployed; the source of truth). Standard shape: what the document is → executive read → known-vs-new map tailored to the developer's current curriculum → per-topic deep dives with advantages/disadvantages made explicit → "what it means for <active engagement>" → claims ledger (page-referenced) → what the document does NOT say
4. **Author the in-app module** — a new `guidanceDoc<Name>_()` function in the PROJECT block of `googleAppsScripts/Profiler/Profiler.gs`, registered in `guidanceDocs_()`. The module JSON's section kinds (`prose`, `callout`, `table`, `proscons`, `timeline`, `bars`, `flashcards`, `quiz`, `ledger`) plus `glossary`, `tiles`, per-section `zh` notes and `{{term}}` tooltips are rendered by Profiler.html's guidance renderer — **new documents need no page changes**. Timeline lane colors are the CVD-validated trio (gold `#b18f35` generations/core, blue `#4f83e6` deployment/milestones, rose `#cc5f75` ecosystem); re-run the dataviz validator if new chart colors are introduced
5. **Access model** — the guidance ops (`action=guidance`, `gop=index|doc`) are **admin-gated server-side** in `handleGuidanceOp_` (`checkPermission`-equivalent via the `admin` permission). The masthead button is created only for admin sessions (UI convenience; the server check is the boundary). Module content ships inside `Profiler.gs` — repo + GAS project only, never on public Pages
6. **Versioning** — content-only additions bump the **GAS** version ([PC-GS-VERSION] #1) since the module lives in `Profiler.gs`; renderer/UI changes also bump the **page** version ([PC-HTML-VERSION] #2). Standard Pre-Commit checklist applies; public page/GAS changelog entries stay generic ("guidance library updated") per changelog-security — never name the analyzed document publicly
7. **Verify before push** — `node --check` on a `.js` copy of Profiler.gs, `scripts/check-gas-inner-scripts.js`, and a Playwright render of the module via direct `gdRenderDoc()` invocation with the new JSON (auth bypassed with `bypass_csp` + localStorage role), plus the standard harness smoke test
8. **Refreshes** — a revised edition of a covered document updates the same module (bump its `updated` field), archives nothing (git history suffices), and amends any engagement docs the findings touch (e.g. the Zhonhen study-prep set), regenerating affected study-prep PDFs

**Q&A channels are deliberately v1-absent** (developer decision 2026-08-22). If revisited: `anthropicSummarize_` in Profiler.gs is the existing Claude API precedent (Script Properties `ANTHROPIC_API_KEY`/`ANTHROPIC_MODEL`) — read the `claude-api` skill before extending it.

Developed by: ShadowAISolutions
