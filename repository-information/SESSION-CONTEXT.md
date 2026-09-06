# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-06 07:00 PM EST
**Repo version:** v04.93r — **five** push commits this session (`e8cfd6c` v04.88r was the prior session's tail; this session landed `f16c0f8` v04.89r, `2b8cb3c` v04.90r, `987d5f2` v04.91r, `61e2474` v04.92r, `fddbed4` v04.93r), all merged to `main`, plus this housekeeping commit
**Branch:** `claude/phase-c10-profiler-coverage-ww7aro` (rebased onto `origin/main` after each merge)
**Model:** Opus 5 xhigh — Phase C session **C10** (Blackstone · Brookfield · Macquarie, landed at v04.86r before the context compaction) and then five follow-on pushes, each one the developer accepting the previous response's recommendation.

### What was done

**v04.89r — bijection enforcement.** `scripts/sync-profiler-registry.py` now asserts that every active roster company has exactly one refresh-calendar row and every row resolves to a covered company, plus the row shape from PROFILER-SCHEMA.md. Error under `--check` (exit 1), warning in write mode — because the Profiler Command registers a company at step 5 and adds its calendar row later in the same session. Tested by being made to fail in ten sandbox states.

**v04.90r — closed the C10 step-7 deferral across the nine unreached dossiers.** One needed a change: `nvidia` to pv9, adding the 10 Aug 2026 six-firm compute-financing MOU and three reciprocal edges (`blackstone`, `brookfield`, `fluidstack`). Eight needed nothing and each is named with its reason in the CHANGELOG. The BlackRock/Blackstone control was run over all nine and came back clean.

**v04.91r — the overdue `nvidia` earnings refresh.** Q2 FY2027 actuals (revenue $96.2B +106% against a $91B guide; data center $89.0B; GAAP EPS $2.46 above non-GAAP $2.22 on $7.771B of equity-securities gains; Q3 guided $108.0B ±2% at 74.0%). All four calendar watch items worked; the row advanced out of OVERDUE, `nextReport` rolled to 2026-11-25.

**v04.92r — `scripts/check-source-reachability.py`.** A disclosure-tier reachability probe plus a corpus provenance measurement. Always exits 0. Two defects in the draft were found by testing it to failure.

**v04.93r — archive-rotation hardening.** Did **not** run the rotation (the rule says stop at ≤100 and we are at 96). Dry-ran it instead and found the real risk: on a shallow clone every SHA lookup for the first-to-rotate groups fails silently.

### Where we left off

All five pushes merged. Working tree clean, nothing unpushed. `Sections: 96/100` in CHANGELOG.md — four pushes of headroom. All seven checkers exit 0. The developer asked for a plan evaluation, a next-session prompt, and this context write.

### Key decisions and findings

- **The attached run-order snapshot the developer pasted is STALE.** Its items ② (X2), ③ (F6·F7·F8) and most of ④ (C5–C10) are already complete. The real remaining program is **C12 → 6 guide sessions → X3 → Phase D**. Recorded here so a future session does not re-derive it.
- **Phase X is done except X3.** X1 shipped at v04.71r; X2 is empirically clear — `check-profiler-relationships.py` reports 0 findings, 0 URLs outside `sources[]`, 0 incoherent reciprocals, and all 10 accept-list entries carry a `why`. **§9.4's status ledger is EMPTY and should be filled in** — the plan does not record that X1 and X2 landed.
- **§7's after-every-write list is out of date** — it names four scripts; there are now six checkers plus the reachability probe.
- **EDGAR is blocked from this environment's egress.** SEC's own "Undeclared Automated Tool" page under a correctly declared non-personal User-Agent; network-keyed, not fixable by changing the UA. **But `asx.com.au` and `londonstockexchange.com` both return 200**, so the filing route is alive and it is SEC specifically that is down. **This does not bite C12** — Whiting-Turner is private, Gotion files on Shenzhen (`szse.cn` / `cninfo.com.cn`) and REPT on HKEX (`hkexnews.hk`).
- **Never put the developer's email in a request header.** `check-source-reachability.py` carries a role address on an org domain and a comment saying so.
- **The accept list stays at TEN.** `portfolio` entered the enum at v04.85r; the list may grow only for genuinely-both-true pairs, never for enum gaps.
- **Three of my four recommendations this session needed correcting on contact with the repo.** The pattern was recommending from memory of the rules at the end of a response rather than checking first.

### Active context

- **Branch:** `claude/phase-c10-profiler-coverage-ww7aro` · **repo version:** v04.93r · **Profiler page:** v01.83w (unchanged since v04.85r — every push since has been data-only)
- **Corpus:** 151 companies · 151 profiles · 125 study guides (26 backfills outstanding) · 297 archived dossier versions
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG:** 96/100. Next rotation moves the 2026-08-31 group (3 sections) once the total passes 100. **Deepen the clone first** — now a mandatory step in the procedure.
- **Standing, unassigned:** the README archive listing is 53 entries behind (313 listed vs 366 on disk, ordering undecided); `archive/nvidia.profile.v2.json` is missing and cannot be reconstructed; `nvidia`'s 2026-08-27 calendar one-shot fired SUCCEEDED but landed no commit, which no checker can see.

### Recommendation for next session

- Run **Phase C session C12** — `whiting-turner`, `gotion`, `rept` — on **Opus 5 xhigh**, the last three new companies in the program, taking the corpus to the 154 that X3's close-out assumes. Fill in §9.4's empty status ledger for X1/X2 and refresh §7's checker list in the same commit, since both are stale and both are one-line fixes a C12 session is already in the right files to make.

**To continue:** type `profiler coverage plan session C12`

## Previous Sessions

### Session — Phase C session C9 + follow-ons (Opus 5 xhigh)

**Date:** 2026-09-06 08:38 AM EST
**Repo version:** v04.85r — **three** push commits this session (`02ce5be` v04.83r, `64c4806` v04.84r, `6049838` v04.85r, all merged to `main`), plus this housekeeping commit
**Branch:** `claude/phase-c-session-c9-hra8xc` (rebased onto `origin/main` after each merge)
**Model:** Opus 5 xhigh — Phase C session **C9**: Cipher Digital · Hut 8 · Galaxy Digital, then two follow-on pushes the developer asked for by accepting the recommendation each time.

### What was done

**Push 1 — v04.83r, C9 proper.** Three `developer` dossiers (schema v7, pv1) with study guides and lesson plans: `cipher-mining` (47 sources, 45% first-party, 19 relationships), `hut-8` (71 / 48% / 14, plus 11 verified exec photos), `galaxy-digital` (61 / 66% / 12). Seven step-7 counterparty revisions, each archived before editing. 33 concepts registered (1,002 total). Registered the **`river-bend-campus`** named project with its Scraper interest-topic seed (Scraper GAS v02.00g → v02.01g); a `helios` pin was weighed and declined. **The CHANGELOG rotation fired** — fourteen sections dated 2026-08-30 (v03.84r–v03.97r) moved to the archive with SHA enrichment, 100/100 → 86/100.

**Push 2 — v04.84r, the `google` reconciliation.** Closed the one deferral C9 left open. `google` to pv7: the Fluidstack lease-backstop programme written up as a first-class strand, four relationships added and one enriched, 24 → 38 sources.

**Push 3 — v04.85r, the `portfolio` enum + three corrections.** Added `portfolio` to `relationships[].type` (schema, checker comment, `Profiler.html` `OV_REL_TYPES`/`OV_REL_WORK`; Profiler v01.82w → **v01.83w**). Seven edges flipped `other` → `portfolio` across `amazon`, `mgx` (five) and `google`. **Accept list 15 → 10.** And corrected three errors published in push 2 — see below.

### Where we left off

All three pushes are merged. Working tree clean, all checkers green: registry sync clean (148 companies), study **0 errors / 0 warnings** (122 guides, 1,002 concepts), relationships **exit 0** (10 accepts), crossrefs **exit 0** (337 pairs), graph 1,177 edges / 888 curated, Playwright 0 page errors. CHANGELOG at **88/100** — twelve pushes of headroom, no rotation due. **C10 is the next session and the developer has been given a paste-in prompt for it.**

### Key decisions and findings

- **`portfolio` now exists in the enum.** This is the change that matters most for the next session. Enum expansion only, no `schemaVersion` bump, on the `recentDevelopments.category` precedent. Write it directly; do not accept around it.
- **I published three errors at v04.84r and fixed them at v04.85r.** (1) "Alphabet discloses nothing" was wrong — it discloses the programme as **credit derivatives**, notional USD 0 → 16,940m → 28,436m → **43,785m**, withholding only counterparty identity. (2) "Google took nothing at Hut 8, unlike everywhere else" overstated a true fact — Abernathy and Cipher's USD 333m increase carried no warrants either. (3) The **springing Alphabet guarantee** at River Bend is in no SEC filing and is now flagged as offering-memorandum trade reporting in both `google` and `hut-8`.
- **The methodological lesson, now in the calibration log:** a null on a proper noun bounds only that proper noun. My EDGAR search and its controls were both correct — `Fluidstack` really does return zero inside Alphabet's CIK — but inferring a programme-level conclusion from a name-level null was not. Search the subject's **mechanism words** too; `backstop` returns 17 hits in the same document that returns zero for `Fluidstack`.
- **C9's own §5 verdicts:** `>$19B of leases combined` **FAILED** three ways; `the miner-pivot landlords` held for two and, for Galaxy, held at the site while failing at the company; the four remaining clauses held with correction. The three subjects are all SEC-classified finance companies (SIC 6199 / 6199 / 6211).
- Cipher was renamed **Cipher Digital Inc.** in February 2026; the slug stays `cipher-mining` on the C5 RWE precedent.

### Active context

- Branch `claude/phase-c-session-c9-hra8xc`, repo **v04.85r**, 148 companies, 122 study guides.
- Accept list **10 entries**; `blattner x quanta-services` was re-reasoned and kept because a wholly-owned operating subsidiary is not a financial holding (the missing types there are `parent`/`subsidiary`).
- Toggles unchanged: `START_OF_RESPONSE_BLOCK` On, `CHAT_BOOKENDS` Off, `TIMING_ESTIMATES` On, `END_OF_RESPONSE_BLOCK` On, `MULTI_SESSION_MODE` Off.
- REMINDERS.md has no active reminders; TODO.md is empty.
- **Known, unfixed, and deliberately so:** the README archive listing is ~40 files behind (314 entries against 356 on disk). Four sessions have now followed the same precedent of not inserting them. This needs a developer decision — regenerate mechanically, or exclude archive snapshots from the tree by rule.
- **Open questions parked in the dossiers, not guessed:** the dollar cap on Hut 8's River Bend backstop and whether Google backstops New Lebanon at all. Both live in 144A offering memoranda. The rating-agency presales on the Hut 8 DC LLC 6.192% 2042 notes are the likeliest public route.

### Recommendation for next session

- Run **C10 — Blackstone · Brookfield · Macquarie** (`investor`, Opus 5 xhigh). The enum blocker is cleared, so this session can finally write `investor`/`portfolio` pairs coherently instead of generating accepts; these three are the counterparties `aligned`, `cyrusone`, `digital-realty` and `qts` currently cannot link to at all. Budget for the inbound tail — the union of `\bBlackstone\b`, `\bBrookfield\b` and `\bMacquarie\b` is **38 dossiers**, nearly double C8's twenty — and guard hard against **BlackRock**, which appears in 19 files and is a different firm.

**To continue:** type `continue with C10`
