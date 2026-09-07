# Previous Session Context

Claude writes to this file when the developer says **"Remember Session"** — capturing enough context for a future session to pick up the train of thought quickly. This is separate from "Reminders for Developer" (REMINDERS.md), which is the developer's own notes.

> **Note on stale-context auto-reconstruction** — when a session starts and this file's `Repo version:` doesn't match the current repo version, Claude reconstructs the missing entry from CHANGELOG.md and commits it **without pushing**. The commit rides along with the session's first user-task commit on the next push. If a session ends before any user-task push happens, the reconstructed entry stays **local-only** and the next session will just re-reconstruct from CHANGELOG if still stale. This is intentional — pushing a dedicated reconstruction commit on its own would force every subsequent user push in the same session to wait for the auto-merge workflow to finish before it could push too (push-once enforcement). The reconstructed entry is a convenience hint, not load-bearing state, so the small persistence risk is a fair trade.

## Latest Session

**Date:** 2026-09-06 08:23 PM EST
**Repo version:** v04.94r — **one** push commit this session (`e1324c7`), pushed to `claude/c11-landing-timeline-jmos13`, plus this housekeeping commit
**Branch:** `claude/c11-landing-timeline-jmos13` (no rebase needed — `origin/main` had not advanced)
**Model:** Opus 5 xhigh — Phase C session **C12**, the last three new companies in the coverage programme.

### What was done

**v04.94r — C12: `whiting-turner`, `gotion`, `rept`.** Three dossiers at schema v7 / pv1 with schema-v2 study guides and lesson plans. 62 / 61 / 52 sources; 11 / 12 / 10 relationships; 11 / 9 / 10 guide sections. Six research subagents (two per company, first-party then third-party) ran in parallel, 9–25 minutes each.

**The corpus is now at 154 companies / 154 profiles / 154 calendar rows** — the figure X3's close-out assumes. 128 study guides, 1,049 concepts.

**Both §5 premises held, the FEOC one more sharply than the brief expected.** Verified against statute rather than trade coverage:
- **Gotion is a specified foreign entity twice over** — named in NDAA FY2024 §154(b) (one of exactly six: CATL, BYD, Envision, EVE, Gotion, Hithium) **and** PRC-incorporated. So its operating Manteno, Illinois plant **cannot claim §45X**, because status follows ownership not site; Defense procurement ban dated **2027-10-01**; the USD 2.4bn Michigan plant is dead with incentives clawed back and litigation running both ways.
- **REPT is named nowhere**, captured only by the incorporation prong §7701(a)(51)(B)(v). No US plant, no stranded capital; exposure runs solely through customers' material-assistance cost-ratio arithmetic. FY2026 NDAA **§842** would capture it from 2028-01-01 — trade coverage has missed this.
- **Three widely repeated Gotion claims are false**: NOT on UFLPA (2026-07-31 update), NOT on DoD §1260H (2026-06-08 update, unlike CATL/BYD/CALB/EVE), and the **NO GOTION Act was never enacted** (H.R. 524 at "introduced"). The **§30D framing behind all 2023–24 coverage is moot** — §30D terminated for vehicles acquired after 2025-09-30.

**Step 7 — 11 inbound mentions read, 6 dossiers revised, 5 confirmed accurate.** `turner-construction` v8, `vantage` v9, `byd` v7, `prevalon` v5, `jupiter-power` v6, `lightsource-bp` v6, each archived before editing.

**Plan bookkeeping:** §5's C12 row rewritten from hypothesis to record; §8's three rows flipped; §9.4's X3 row records its first precondition met; **§7's after-every-write list corrected from four scripts to six** plus the reachability probe.

### Where we left off

Push merged. Working tree clean apart from this housekeeping commit. All six checkers exit 0 plus the probe. `Sections: 97/100` in CHANGELOG.md — **three pushes of headroom**. The developer asked for a paste-in prompt for the first guide-backfill session and this context write.

### Key decisions and findings

- **I recorded a wrong reachability finding and the correction is now a rule.** One probe of `www.szse.cn` returned `000`; I wrote it into §7 as unreachable. A subagent then used the host successfully and a three-attempt re-probe returned **200 / 000 / 200** — intermittent, not down. §7 now says: sample a failing host at least three times before recording it as blocked. The failure mode is asymmetric — a false "blocked" narrows the research plan and is never contradicted, because nobody retries a host they have written off.
- **Two agent-reported "corpus errors" were artefacts of my own prompt wording.** `jupiter-power` already treats St Gall and Fort Stockton as one project; `prevalon` was already at pv4 with the Nextpower acquisition recorded. Reading the files rather than trusting the reports avoided two needless revisions — the over-calling failure mode §9.2 warns about.
- **The brief's claim that §9.4's ledger was empty was stale** (populated at v04.77r and v04.85r). I updated the X3 row instead of manufacturing an edit.
- **Do NOT sort `profiler-companies.json`.** I did, and it moved two pre-existing entries, inflating the diff from ~36 lines to 176. Rebuilt preserving original order → 62/4.
- **Check concept collisions programmatically, not by phrase.** Of 22 proposed concepts, three already existed under different display terms (`cm-at-risk`, `ipd`, `vdc`) and a phrase search missed all three. 19 were registered.
- **The relationships checker caught a fabricated URL before it shipped** — a RenewEconomy link reconstructed from a report had a plausible but wrong slug.
- **Serialisation traps confirmed empirically**: `apex-clean-energy.profile.json` plus exactly two report files refuse round-trip; `archive-index.json` and the refresh calendar are indent=2 with **no** trailing newline; profiles and guides are indent=1 with one. A byte-exact write helper was proven against all seven families before use.
- **The `s154-listed-bess-suppliers` report scope was corrected by raw string replacement**, never re-serialised — its rationale said "Gotion is listed but not covered by a dossier", which C12 made false. One line changed.

### Active context

- **Branch:** `claude/c11-landing-timeline-jmos13` · **repo version:** v04.94r · **Profiler page:** v01.83w (unchanged since v04.85r — every push since has been data-only)
- **Corpus:** 154 companies · 154 profiles · **128 study guides (26 backfills outstanding)** · 374 archived dossier versions · 1,049 concepts
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG:** 97/100, counter verified against the real section count. **Rotation will fire inside the six-session backfill block** — deepen the clone first.
- **The 26 backfills, grouped as §8 has them:** IPP buyer-side (9) `apex-clean-energy` `arevon` `eolian` `jupiter-power` `key-capture-energy` `lightsource-bp` `nextera-energy-resources` `plus-power` `terra-gen`; bridge-power supplier (6) `voltagrid` `proenergy` `enchanted-rock` `mainspring-energy` `on-energy` `prevalon`; integrator (7) `canadian-solar` `crrc-zhuzhou` `envision-energy` `hyperstrong` `ls-energy-solutions` `sunwoda` `trina-storage`; EPC (4) `blattner` `mastec` `solv-energy` `samsung-ct`. §8 carries 27 backfill rows — `narada` is the 27th and is already done (`✓ · v04.51r`).
- **Two dated triggers now in the calendar:** Volkswagen's Gotion voting waiver expires ~**2027-12-15**, on which date it mechanically becomes controlling shareholder unless extended; FY2026 NDAA **§842** captures REPT from **2028-01-01**.
- **Standing, unassigned:** the README archive listing is well behind (the non-archive listing is exact at 282, matching disk); `archive/nvidia.profile.v2.json` is missing and cannot be reconstructed; OSHA IMIS and SEC EDGAR are both network-blocked from this environment.

### Recommendation for next session

- Start the **guide backfills** with the five IPP buyer-side companies — `apex-clean-energy`, `arevon`, `eolian`, `jupiter-power`, `key-capture-energy` — on **Opus 5 xhigh**, guides only, no dossier edits. They are the largest thematic cluster, §6's `who-buys-storage` and `how-a-storage-project-happens` lessons depend on them, and starting now puts the CHANGELOG rotation early in the six-session block rather than against the deadline.

**To continue:** type `start the guide backfills`

## Previous Sessions

### Session — Phase C session C10 + five follow-ons (Opus 5 xhigh)

**Date:** 2026-09-06 07:00 PM EST
**Repo version:** v04.93r — **five** push commits this session (`e8cfd6c` v04.88r was the prior session's tail; this session landed `f16c0f8` v04.89r, `2b8cb3c` v04.90r, `987d5f2` v04.91r, `61e2474` v04.92r, `fddbed4` v04.93r), all merged to `main`, plus this housekeeping commit
**Branch:** `claude/phase-c10-profiler-coverage-ww7aro` (rebased onto `origin/main` after each merge)
**Model:** Opus 5 xhigh — Phase C session **C10** (Blackstone · Brookfield · Macquarie, landed at v04.86r before the context compaction) and then five follow-on pushes, each one the developer accepting the previous response's recommendation.

#### What was done

**v04.89r — bijection enforcement.** `scripts/sync-profiler-registry.py` now asserts that every active roster company has exactly one refresh-calendar row and every row resolves to a covered company, plus the row shape from PROFILER-SCHEMA.md. Error under `--check` (exit 1), warning in write mode — because the Profiler Command registers a company at step 5 and adds its calendar row later in the same session. Tested by being made to fail in ten sandbox states.

**v04.90r — closed the C10 step-7 deferral across the nine unreached dossiers.** One needed a change: `nvidia` to pv9, adding the 10 Aug 2026 six-firm compute-financing MOU and three reciprocal edges (`blackstone`, `brookfield`, `fluidstack`). Eight needed nothing and each is named with its reason in the CHANGELOG. The BlackRock/Blackstone control was run over all nine and came back clean.

**v04.91r — the overdue `nvidia` earnings refresh.** Q2 FY2027 actuals (revenue $96.2B +106% against a $91B guide; data center $89.0B; GAAP EPS $2.46 above non-GAAP $2.22 on $7.771B of equity-securities gains; Q3 guided $108.0B ±2% at 74.0%). All four calendar watch items worked; the row advanced out of OVERDUE, `nextReport` rolled to 2026-11-25.

**v04.92r — `scripts/check-source-reachability.py`.** A disclosure-tier reachability probe plus a corpus provenance measurement. Always exits 0. Two defects in the draft were found by testing it to failure.

**v04.93r — archive-rotation hardening.** Did **not** run the rotation (the rule says stop at ≤100 and we are at 96). Dry-ran it instead and found the real risk: on a shallow clone every SHA lookup for the first-to-rotate groups fails silently.

#### Where we left off

All five pushes merged. Working tree clean, nothing unpushed. `Sections: 96/100` in CHANGELOG.md — four pushes of headroom. All seven checkers exit 0. The developer asked for a plan evaluation, a next-session prompt, and this context write.

#### Key decisions and findings

- **The attached run-order snapshot the developer pasted is STALE.** Its items ② (X2), ③ (F6·F7·F8) and most of ④ (C5–C10) are already complete. The real remaining program is **C12 → 6 guide sessions → X3 → Phase D**. Recorded here so a future session does not re-derive it.
- **Phase X is done except X3.** X1 shipped at v04.71r; X2 is empirically clear — `check-profiler-relationships.py` reports 0 findings, 0 URLs outside `sources[]`, 0 incoherent reciprocals, and all 10 accept-list entries carry a `why`. **§9.4's status ledger is EMPTY and should be filled in** — the plan does not record that X1 and X2 landed.
- **§7's after-every-write list is out of date** — it names four scripts; there are now six checkers plus the reachability probe.
- **EDGAR is blocked from this environment's egress.** SEC's own "Undeclared Automated Tool" page under a correctly declared non-personal User-Agent; network-keyed, not fixable by changing the UA. **But `asx.com.au` and `londonstockexchange.com` both return 200**, so the filing route is alive and it is SEC specifically that is down. **This does not bite C12** — Whiting-Turner is private, Gotion files on Shenzhen (`szse.cn` / `cninfo.com.cn`) and REPT on HKEX (`hkexnews.hk`).
- **Never put the developer's email in a request header.** `check-source-reachability.py` carries a role address on an org domain and a comment saying so.
- **The accept list stays at TEN.** `portfolio` entered the enum at v04.85r; the list may grow only for genuinely-both-true pairs, never for enum gaps.
- **Three of my four recommendations this session needed correcting on contact with the repo.** The pattern was recommending from memory of the rules at the end of a response rather than checking first.

#### Active context

- **Branch:** `claude/phase-c10-profiler-coverage-ww7aro` · **repo version:** v04.93r · **Profiler page:** v01.83w (unchanged since v04.85r — every push since has been data-only)
- **Corpus:** 151 companies · 151 profiles · 125 study guides (26 backfills outstanding) · 297 archived dossier versions
- **Toggles:** `START_OF_RESPONSE_BLOCK` On · `CHAT_BOOKENDS` Off · `TIMING_ESTIMATES` On · `END_OF_RESPONSE_BLOCK` On · `MULTI_SESSION_MODE` Off · `IS_TEMPLATE_REPO` No · `TEMPLATE_DEPLOY` Off
- **CHANGELOG:** 96/100. Next rotation moves the 2026-08-31 group (3 sections) once the total passes 100. **Deepen the clone first** — now a mandatory step in the procedure.
- **Standing, unassigned:** the README archive listing is 53 entries behind (313 listed vs 366 on disk, ordering undecided); `archive/nvidia.profile.v2.json` is missing and cannot be reconstructed; `nvidia`'s 2026-08-27 calendar one-shot fired SUCCEEDED but landed no commit, which no checker can see.

#### Recommendation for next session

- Run **Phase C session C12** — `whiting-turner`, `gotion`, `rept` — on **Opus 5 xhigh**, the last three new companies in the program, taking the corpus to the 154 that X3's close-out assumes. Fill in §9.4's empty status ledger for X1/X2 and refresh §7's checker list in the same commit, since both are stale and both are one-line fixes a C12 session is already in the right files to make.

**To continue:** type `profiler coverage plan session C12`
