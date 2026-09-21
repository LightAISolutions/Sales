# Routines — Operations and Post-Mortems

*Developer-session reference for the scheduled Routines that write to this repo. **A Routine run does not need this file** — it needs `.claude/rules/profiler-app.md` (the commands) and its own prompt. This is the record of how the Routines are wired, what has gone wrong with them, and what it costs to run them, kept out of the rules file so it is not re-read on every turn of every run.*

*Split out of `.claude/rules/profiler-app.md` on 2026-09-21 (v07.01r): that section was 186 of the file's 347 lines and was being re-read on every turn of every scheduled run at roughly $1.64 a run in cache reads, for material no run consumes.*

---

## Scheduled Refreshes

Post-earnings dossier refreshes run on **one recurring Routine** — the **Profiler earnings desk** (`trig_01UyH77BMKJnxzBUZJ11ej6A`) — driven by a calendar file in the repo. There are no per-company triggers.

- **The calendar** — `repository-information/profiler-refresh-calendar.json` (schema in `PROFILER-SCHEMA.md`). One row per covered company: public rows carry `nextReport` / `confirmed`, private and unit-level rows carry `cadence: "quarterly"`. Each row also carries the `watch[]` items that used to live inside a per-company trigger prompt, and a `source` recording where the date came from
- **The desk** — fires **weekdays 13:00 UTC** as a fresh session, push + email notifications. Each run: read the calendar → for every row whose `nextReport` is **yesterday or earlier**, (1) verify the report actually published, (2) run the Profiler Command end to end **including news triage** (the desk prompt carries `CORPUS_TOKEN`; see "News Triage — Scraper Corpus Bridge" above), (3) research and write the row's next `nextReport`, `confirmed` and `source`, and refresh its `watch[]` where the picture moved → one commit. For rows that are **unconfirmed and within seven days**, confirm the date and update the row without refreshing the dossier
- **Capped at three companies per run, with carry-over.** Anything still due is simply due again tomorrow — the calendar is the queue, so nothing is lost by stopping at the cap. The old convention staggered triggers two hours apart to keep parallel sessions off shared state files; one serial session per day removes the reason for the stagger
- **Nothing due — stand down silently, no commit.** Same precedent as the monthly drift check. The report must still name what it read (row count and the next date coming up) so a silent stand-down is distinguishable from a session that never reached the repo
- **The desk never creates triggers.** It updates calendar rows. The self-re-arming step is deleted, not moved: no session creates a per-company Routine again
- **Private and unit-level companies** stay on the recurring quarterly sweep (Jan/Apr/Jul/Oct 1, ~13:00 UTC), which checks for material developments and refreshes only when warranted. Their calendar rows mirror that cadence so one file lists all coverage. When such a company lists — the sweep's `watch[]` items flag the candidates — convert its row from `cadence` to `nextReport` and the desk picks it up

**Why this replaced the one-shot convention.** The former convention was a one-shot trigger per company, self-re-arming, staggered two hours apart, each carrying a complete standalone prompt. It was measured on 2026-09-02 and it had failed **7 for 7**. Seven August refreshes fired (Sinexcel, EVE Energy, NVIDIA, Jinko, Sungrow, BYD `SUCCEEDED`; IREN `ABANDONED`); **none landed a commit**, none archived a version, none re-armed a successor, and none wrote the `REMINDERS.md` fallback the convention prescribed. All seven dossiers still showed their reported period as pending. The six "SUCCEEDED" runs lasted 2–4 minutes against a command that takes far longer — the status means the session's first turn ended without error, not that the work was done. IREN was abandoned holding a permission prompt for a `find` over `/home` and `/root`: it was hunting for the repository checkout.

Three properties of the old design made that failure invisible, and the calendar fixes each:

- **The state was unreadable.** A one-shot that fires and does not re-arm leaves no artefact in the repo, so nothing could notice. A calendar file is diffable, shows up in the CHANGELOG when it moves, and its rows can be read by the roster
- **The procedure was copied 22 times and drifted.** The armed prompts still said "schema-v2 profile" (the schema is v7) and told sessions to mirror archives to `bess-aidc-library` via `add_repo` (the rules now say sessions do not attach that repo). Procedure belongs in this file; the prompt points at it
- **The corpus token reached none of them.** 0 of 22 armed prompts carried it, so the news-triage bridge — finished on both sides — was switched off in every scheduled refresh. One prompt carries it now

What the convention was designed to protect is kept: refreshes still fire on the market's clock rather than the operator's memory. What is dropped is the part that broke — a secret and a procedure hidden inside opaque trigger records that the repo could not see, diff, or check.

**The 2026-09-16 measurement — the mechanism was never the prompt.** The calendar fixed all three properties above and the desk still landed nothing: the 7 Sep run landed no commit, and the 16 Sep run researched IREN, Jinko and Oracle, committed locally as `a378a96`, and was **denied on push**. The cause sits one level below the prompt. **A Routine created through the `create_trigger` MCP tool is stored with `sources: []`** — so every fired session gets a container with no repository checkout and no push credential. Measured against the API on 2026-09-16: all six Routines read `sources: []`, and a test Routine created *from a session that did have the repo attached* also came back `sources: []`. Neither `create_trigger` nor `update_trigger` exposes a `sources` parameter at all; only the claude.ai Routines UI can attach one. Sessions the developer starts carry `sources: [{git_repository: .../Sales}]`; fired sessions carry nothing.

The August one-shots died of the same thing, and **the record above already held the evidence without naming it**: IREN was "abandoned holding a permission prompt for a `find` over `/home` and `/root`". It was not hunting for the checkout because its prompt had drifted — it was hunting because there was no checkout. The three properties explain why the failure stayed *invisible* for a month; they do not explain the failure. This does.

**STEP 0 — what every scheduled prompt now opens with, corrected by live probe the same day.** The first version of STEP 0, written on 2026-09-16, told the session to call `add_repo` and `register_repo_root`. **A manual firing of the ACL health check that afternoon proved those tools DO NOT EXIST in a Routine-fired session** — the run's own words: *"I ran toolSearch for `add_repo` and `register_repo_root` — both returned 'No matching deferred tools found'. This isn't a denial from the tool itself; the harness simply doesn't expose that tool in this session's toolset."* Do not write a scheduled prompt against a tool this session can see; a fired session's toolset is **narrower** than an interactive one's, and that difference is invisible from here.

What does work is a **plain clone**: `git clone https://github.com/LightAISolutions/Sales.git /home/user/Sales` succeeds, because the session's git proxy authenticates transparently — no token, no `gh`, no credential wrangling. All six prompts were rewritten to lead with that. Three further properties are deliberate:

- **Prove the push path before researching, not after.** `git push --dry-run origin HEAD:refs/heads/claude/pushprobe-<date>` authenticates against the remote without creating anything. Clone proves *read* access; it says nothing about *write*, and write is what failed on `a378a96`. A run that cannot push must discover that in ten seconds, not after an hour of research. The five committing Routines carry this; the ACL detector, which never pushes, does not.
- **Fail closed.** A failed clone or a denied dry-run push stops the run before any research, dossier write or calendar advance. A queue row left due is recoverable; an hour of unpushable research is not.
- **Nothing auto-loads.** Without `register_repo_root` there is no repo-root registration, so `CLAUDE.md` and `.claude/rules/` are **not** in a fired session's context. Every prompt now says to read them explicitly. A scheduled run that "follows the Pre-Commit checklist" without having read it is following nothing.

**A further environment difference, observed the same day:** the sandbox can refuse to execute a repo script outright — `bash scripts/check-acl-health.sh` was denied as *"Code from External"* on one firing and ran normally on the next. For a detector, hand-replicating the probe is an acceptable fallback **if the report says so**. For the C2 pipeline it is not: §2 and §4.5 forbid substituting for a checker, so a blocked checker is BLOCKED, never a hand-rolled pass.

**NEVER USE A `fire_trigger` PAYLOAD TO ADD WORK TO A ROUTINE — a well-behaved session will refuse it, and should.** Text attached when firing a Routine by hand arrives at the fired session as **untrusted data**, not as instructions, and the session is told to act on it only where its own configured prompt authorizes. Measured twice on 2026-09-16 with the same Routine and near-identical payloads: the 14:04 PDT firing complied, and the 14:28 PDT firing **refused** — *"it labels a `git push` test (even dry-run) as 'the most important thing in this run' and pressures urgency, and it asserts as fact things I have no way to verify … classic injection pressure tactics"* — ran only its configured job, and raised a security notice asking who has permission to fire triggers on the account. **The refusal was correct and the compliance was the anomaly.** A payload urging an unattended agent to exercise write access against a repository is indistinguishable from an attack, whoever sent it.

Two consequences. **Anything a Routine must do belongs in its configured prompt**, where it is authorized — that is why the push probe lives in STEP 0 and not in a fired payload. And **a fired payload is unusable as a diagnostic channel**: it cannot reliably request an extra step, and it must never assert unverifiable context ("the developer just fixed X", "an earlier run reported Y") to justify one, because a careful session will correctly discount exactly that. Diagnose by editing the prompt, firing the Routine plainly, and reading the run.

**A related limit on observing a run at all.** A fired session's transcript cannot be read from another session — no tool exposes it, and cloud sessions are not reachable for messaging. What *is* readable is the run's telemetry via `get_session` (duration, context tokens, cost, status bucket), which distinguishes a session that reached the repo from one that did not: the 2026-09-16 firings consumed 153,895 and 54,561 context tokens against near-zero for the repo-less runs that preceded them. For the report itself the developer must open the run in the Routines UI, so **a Routine's own report shape is the only durable output** — write the prompt so the report says what a reader will need.

**Timezone, because it cost a round trip.** The Routines UI renders run times in the **viewer's local zone** (PDT for this developer), while this repo timestamps everything **EST/EDT**. A 17:28 EDT firing appears in the History list as *"Today at 2:28 PM"*. Cite PDT when pointing the developer at a run, or they will look for an entry that is not there under that name.

**SETTLED 2026-09-18: A ROUTINE-FIRED SESSION CAN CLONE BUT CANNOT PUSH. THE CLONE WORKAROUND IS NOT A FIX — ATTACHING THE REPOSITORY AT CREATION IS.** The earnings desk fired on Thursday 17 and Friday 18 September with the corrected STEP 0. Friday's run: **34 seconds, 47,441 context tokens, 1,315 output tokens, $0.11, no commit.** The token count proves it cloned — a session with no checkout spends near-zero — and the 34 seconds prove it stopped at the dry-run push rather than researching. `profiler-refresh-calendar.json` is untouched, still `updated: 2026-09-13` with `iren`, `jinko`, `oracle` and `novonix` due. So the two halves of repository access are **separable**, and only one of them is reachable from a prompt: **`git clone` over the session's git proxy authenticates for READ; WRITE is denied and no prompt instruction can grant it.** That is why the read-only ACL detector has run green all week while every committing Routine lands nothing.

**PROVEN 2026-09-21 BY A CONTROLLED A/B, AND THE MECHANISM IS VISIBLE IN THE SESSION RECORDS.** Both desks were deliberately left live for one Monday firing, identical in every respect except the attached repository. The result:

| | OLD `trig_01UyH77BMKJnxzBUZJ11ej6A` | NEW `trig_01HkrwpCULei8Gje6RGqcp1B` |
|---|---|---|
| `session_context` | `sources` and `outcomes` **both absent** | `sources: [{git_repository: …/Sales}]`, `outcomes: […branches: [claude/funny-shannon-0mrb4f]]` |
| Duration | **33 s** | **4 m 24 s** first turn, ~14 m total |
| Context tokens | 48,101 | **335,058** |
| Output tokens | 1,200 | **138,201** |
| Cost | $0.11 | **$13.86** |
| Result | no commit | **`cdfafb36` — v06.96r, 13 files, +2,020 lines** |

**That is the first commit a scheduled run has ever landed in this repository**, and the calendar moved with it: `updated` 2026-09-13 → 2026-09-21, four rows due → one, `iren` / `jinko` / `oracle` refreshed and archived at v4 / v5 / v4, `novonix` correctly left for the next run by the cap of three. **The `sources` / `outcomes` pair in the new session's record is the thing that was missing from every fired session since 2026-08** — it is exactly the shape an interactive session carries, and it appears only because the repository was selected on the New routine form.

**Budget the real number — and know what it is a number OF.** A healthy three-company run values at about **$14** and a quarter of the context window; the run of "successful" 34-second runs valued at eleven cents each and did nothing. **The cheap runs were the broken ones.**

`get_session`'s `usage.cost_usd` is the **API list-price valuation of the tokens consumed, not a charge against a balance.** Verified on the 2026-09-21 run: 42,896,504 cache-read + 1,072,155 cache-write + 557,346 input + 138,201 output tokens at Claude Sonnet 5 rates ($2.00 / $10.00 per MTok, cache write 1.25×, cache read 0.1×) computes to **$13.76 against a reported $13.86 — 0.75% apart.** On a Pro or Max plan that value is **drawn from the plan allocation**, not billed: limits are shared across Claude and Claude Code on a five-hour session window plus a weekly cap, and Claude Code uses plan allocation only — API credits are opt-in and require explicit consent, so a scheduled Routine never silently spends money. The same run's `rate_limit_info` recorded `isUsingOverage: false`, confirming it.

**The line that actually matters for scheduling: cache reads were 62% of the cost** ($8.58 of $13.76, on 42.9M tokens) — the agentic loop re-reading its context every turn. Five committing Routines on regular cadences consume **plan allowance**, not dollars, but they consume it in five-hour windows shared with interactive work. The earnings desk alone is five runs a week at roughly this size.

**WHICH weekly allowance a scheduled run draws — and which one it does not. Verified 2026-09-21.** A Routine with no model pinned (`"model": ""` in its record — all five committing Routines) is served by the platform default, not by whatever model the developer happens to be authoring in. The 2026-09-21 desk run's session record reads `last_served_model: "claude-sonnet-5"` — **not Fable**. That distinction is load-bearing because **Fable is not a separate weekly bucket**: per Anthropic's help centre, Fable models *"draw from your plan's regular weekly usage limits and use them faster than other Claude models,"* and on Max *"you can use up to 50% of your weekly usage limits on Fable models at no extra cost"* — after which **Fable alone** moves to usage credits while the rest of the weekly limit stays spendable on other models. Other models compete for the same pool: *"your use of other models draws from the same usage limits and you can never use more than your weekly limit."*

**So a desk run spends the shared weekly all-model limit and none of the Fable half.** The Fable half is spent by interactive authoring sessions, and the gap is not close — over 2026-09-19..21 those ran **$27–$179 of valuation each** against the desk's $14, and the only `rateLimitType: "seven_day"` / `status: "allowed_warning"` ever recorded in this account's session data sat on a **Fable 5.1 interactive session**, never on a scheduled run. **Do not thin the desk cadence to protect Fable headroom — the desks are not what spends it.** The corollary is the actionable half: **pinning a Routine to Fable would start drawing that 50% sub-allocation.** Leave a Routine's model unset unless there is a reason, and if one is ever pinned to Fable, say in the annex why.

**WHICH MODEL A ROUTINE SHOULD RUN. Evaluated 2026-09-21.** The creation form carries a model selector and Claude uses that model on every run; all six Routines leave it unset and take the platform default, `claude-sonnet-5` on every fired session inspected. **Leave it there for most of them.** Every failure in the 2026-09-16→21 saga was *infrastructural* — no repository, no push — and not one was a run reasoning badly: the 2026-09-21 desk run on Sonnet 5 produced 13 files and +2,020 lines, respected the cap of three and correctly left `novonix` as carry-over; C2's 2026-09-16 run held 361,369 context tokens without strain. There is no observed capability gap to fix.

**The test that does justify Opus 5: can a checker see the failure?** `check-classroom-content.py` and `check-classroom-pipeline.py` verify *structure* — schema, gate digest, JSON validity, the presence of a provenance stamp. Neither can tell a real freshness pin from a plausible fabricated one, which `.claude/rules/classroom-app.md` forbids in as many words. A structurally perfect lesson with an invented input passes every gate and lands in the curriculum, on a one-attempt-per-run budget. So: **Opus 5 for C2 and the Industry Guidance review** (same content surface, same re-verify-from-a-primary-source judgment); **Sonnet 5 for the earnings desk, the ACL check, the opportunity report and the quarterly sweep**, where a checker or the calendar catches what goes wrong.

Priced on the 2026-09-21 run's actual mix (42,896,504 cache read / 1,072,155 cache write / 557,346 input / 138,201 output):

| Model | In · Out $/MTok | Cache read | Same run |
|---|---|---|---|
| Sonnet 5 | $2 · $10 | $0.20 | **$13.76** |
| Opus 5 | $5 · $25 | $0.50 | $34.39 |
| Fable 5.1 | $10 · $50 | **$0.25** | $36.61 |
| Haiku 4.5 | $1 · $5 | $0.10 | 200K context — **cannot hold it** |

**Haiku is disqualified by arithmetic** (335K and 361K context against a 200K ceiling), not judgment. **Fable 5.1 is only 6% dearer than Opus 5 here**, not the 2× the headline prices imply, because its cache reads are $0.25/MTok against Opus 5's $0.50 — on a cache-dominated workload that discount nearly cancels the input premium; it is still wrong for unattended work because it alone draws the 50% weekly sub-allocation. C2 on Opus 5 prices at ≈$18.45 against $7.87 — about **$42 a month of plan allowance** for the one job where a silent bad output is unrecoverable.

**CACHE READS ARE THE DISCOUNT, NOT THE WASTE.** 42.9M cache-read tokens billed $8.58 at $0.20/MTok; uncached the same tokens bill **$85.79**. The cache saved $77 on one run, and dominating a long agentic run is what it looks like working. What is worth cutting is the quantity behind it: **cache reads ≈ context size × turns**, so ~42.9M over ~130 turns is ~330K tokens re-read every turn.

**The largest item in that 330K is the queue file, and it is nearly all waste.** `repository-information/profiler-refresh-calendar.json` is **384,240 bytes ≈ 96,000 tokens over 177 rows**; on 2026-09-21 **one row was due**, and everything the prompt consumes serialises to **5,075 bytes ≈ 1,300 tokens**. Reading it whole parks ~96K tokens in context for the life of the run — ≈12.3M cache-read tokens, **≈$2.46, ~29% of the cache-read bill**, to act on 1.3K of it. **It is also a correctness risk: 2,573 lines against the Read tool's 2,000-line default, so a plain Read silently truncates the tail of the queue.** Replace "Read the calendar" with an extraction that prints only what the prompt's rules use — ≤3 due rows oldest-first, carry-over slugs, the unconfirmed-within-7-days set, and the counts the stand-down report requires:

```bash
python3 -c "
import json,datetime
d=json.load(open('repository-information/profiler-refresh-calendar.json')); rows=d['companies']
t=datetime.date.today().isoformat(); h=(datetime.date.today()+datetime.timedelta(days=7)).isoformat()
due=sorted([r for r in rows if r.get('nextReport') and r['nextReport']<t], key=lambda r:r['nextReport'])
print(json.dumps({'today':t,'totalRows':len(rows),
 'publicRows':sum(1 for r in rows if r.get('nextReport')),
 'quarterlyRows':sum(1 for r in rows if not r.get('nextReport')),
 'dueCount':len(due),'take':[r['slug'] for r in due[:3]],'carryOver':[r['slug'] for r in due[3:]],
 'due':due[:3],
 'unconfirmedWithin7d':[r for r in rows if r.get('nextReport') and t<=r['nextReport']<=h and not r.get('confirmed')],
 'nextUpcoming':min([r['nextReport'] for r in rows if r.get('nextReport') and r['nextReport']>=t] or ['-'])},indent=1))"
```

Writing a row back edits the file in place and never needs the whole thing in context.

**SUPERSEDED 2026-09-21 (v07.02r) — the lever no longer depends on any prompt.** The snippet above and the script both work, but they were a workaround for a file that did not need to be that big. Measuring where the 375 KB actually sat: **`watch` was 66.4% of it and `source` 31.6% — 98% between them — while the queue logic (due-date comparison, tier selection, the cap of three) reads neither.** The scheduling fields are ~7 KB of values. So the payload moved to `repository-information/profiler-refresh-notes.json` and the calendar went **384,240 → 21,576 bytes (−94%) and 2,573 → 1,069 lines**, which also puts it back under the Read tool's 2,000-line default and retires the truncation bug structurally rather than by instruction.

**Why that matters more than the script:** a Routine prompt cannot be edited after the Routine is created, so any lever that lives in a prompt is one rebuild away from being lost and cannot be applied to an already-rebuilt Routine at all. A lever that lives in the *data* applies to every Routine, immediately, with no prompt change and no rebuild. **The already-rebuilt earnings desk gets ~94% of the saving on its next fire with nothing done to it**, because its prompt still says "read the calendar" and the calendar is now 21 KB. `profiler-queue.py` remains the better path — it returns ~5 KB, joins the notes per-slug and gives the stand-down counts directly — and rides along free with the rebuilds already planned. **Never read `profiler-refresh-notes.json` whole; that is the mistake the split exists to prevent.**

**The general rule this is an instance of:** before writing a prompt instruction to work around a file, measure the file. A data fix outlives every prompt that would have worked around it.

**Second item: the rules a run must read.** CLAUDE.md ≈23K tokens, `PROFILER-SCHEMA.md` ≈21K and this file ≈19K are ~63K re-read every turn — ≈8.2M cache-read tokens, **≈$1.64 a run**. Said plainly: **this file is now 74,675 bytes, seven of those edits made during this one investigation, and every line is a per-turn tax on every desk run.** It is why the failures stopped repeating and it is not free — when it next grows, split the post-mortem history a run never needs from the operating procedure it does. **Third: keep the dual-agent research** — a subagent gets its own context window, so fetched pages never enter the parent's per-turn re-read. Levers one and two together plausibly take a run from $13.76 to $9–10 without touching the work product.



**The comparison that shows STEP 0 earned its place anyway.** On 2026-09-16 the same Routine spent about an hour researching IREN, Jinko and Oracle, committed locally, hit the denial at the last step, and lost everything — with the queue left in the dark. On 2026-09-18 it spent **34 seconds and eleven cents**, wrote nothing, advanced no row, and said exactly why. STEP 0 did not fix the access problem and was never going to; what it fixed is the **cost and the silence** of the failure. Keep it after the rebuild for exactly that reason: it is the thing that makes a future loss of write access cheap and loud instead of expensive and invisible.

**THE REBUILD'S PRICE, MEASURED 2026-09-19: A UI-CREATED ROUTINE CAN NEVER BE EDITED BY AN AGENT AGAIN.** The rebuilt earnings desk carries `created_via: "http_api"`, and `update_trigger` refuses it outright: *"this routine was created via http_api, not by an agent. Agents can only update routines they created (via create_trigger)."* A Routine's own session may still set `enabled=false`; nothing else. **This retires, for every rebuilt Routine, the whole apparatus this repo has built around `update_trigger`** — the C3 session 3 rule, design §12 item 2, and the (rr66)/(rr68)/(rr69) sequence that spent three sessions getting one prompt amendment applied with the developer's approval. After a rebuild that path does not exist: a prompt change is a developer pasting into the UI, full stop. Write it down in the annex as before if you like, but no session will apply it.

**It is still the right trade, and the reason is asymmetric.** A Routine that cannot push is useless no matter who may edit it; prompt amendments are occasional while runs are daily. But it is a real cost, it applies to all five committing Routines, and it should be taken knowingly rather than discovered by a session that finds `update_trigger` refusing it mid-task — which is exactly how it was discovered here.

**Two API fields that look like they answer "is a repository attached" and do not.** `derived_state.folders_state` reads `FOLDERS_STATE_NONE` and `folders` reads `[]` on a Routine whose repository is demonstrably attached and visible in the UI; `session_request.config.sources` is simply absent from a UI-created Routine's record rather than present-and-empty. **Neither is evidence of anything.** The only reliable check available today is the Routine's detail page in the UI: the repository appears in the **Runs with** card beside the environment and the model. Do not report a Routine as un-attached on the strength of those fields — that reading was made here and was wrong.

**So: never create a Routine and assume it can reach the repo.** `create_trigger` cannot attach a source, and `update_trigger` cannot add one later. **The repository picker exists ONLY on the claude.ai "New routine" creation form** — confirmed 2026-09-16 against the live UI: the edit menu, the "Runs with" card and the detail page expose no repository control at all. So a Routine created without a source can never be given one; it has to be **recreated** with the repo selected and the old one deleted. **As of 2026-09-18 this is mandatory, not optional, for every Routine that commits** — it is the only remaining way to get write access into a fired session. When recreating, note that the form pre-loads five connectors (Claude Docs, Gmail, Calendar, Drive, visualize) under a *"write actions, without asking"* warning while all six existing Routines run with `mcp_connections: []` — remove them, or unattended runs silently gain write access to mail and files they have never had.

**AMENDED 2026-09-21, THEN RESOLVED THE SAME DAY — THE DOCUMENTATION IS WRONG AND THE ORIGINAL FINDING STANDS: A ROUTINE'S REPOSITORY CANNOT BE EDITED. REBUILD IS MANDATORY.** `code.claude.com/docs/en/routines` → *Edit and control routines* reads: *"Open the menu next to the routine's name and select **Edit** to change the name, prompt, **repositories**, environment, connectors, or any of the routine's triggers."* Routines are a research preview whose UI changes, and the 2026-09-16 observation predates this reading by five days — either the control shipped since, or it was looked for in the wrong place (the doc puts it behind the **menu beside the routine's name**, not the "Runs with" card, which is where it was sought). **Re-tested 2026-09-21 by the developer on the C2 routine: Edit opened, and there was no interactable repositories field.** The detail page's **Runs with** card shows only `Claude HQ · Default model` — environment and model, no repository. So the documentation describes a control that is not in the shipped UI, the 2026-09-16 observation was correct, and **rebuild is the only path**. Do not re-litigate this a third time on the strength of the docs; re-test only if the UI visibly changes. There is also a surface the MCP tools do not have: **`/schedule update` in a *local* terminal session** (`/schedule` is unavailable inside a cloud session, which is why nothing in this repo can run it), which walks the same fields the web form collects. What stays true regardless: `create_trigger` and `update_trigger` as exposed to an agent carry **no repository parameter at all**, so no session in this repo can attach a repository by any means — a limit of the agent tool surface, not of the product. Documented canonical list URL: **`claude.ai/code/routines`**.

**Also corrected 2026-09-21: the `fire_trigger` "prompt-injection refusal" recorded at v06.19r was a build behaviour, not an anomaly.** The routines documentation states that *"Before v2.1.213, the session received the same prompt framed as an untrusted background notification and could refuse to act on it,"* and that a fired prompt now arrives as the session's assigned task. The refusal and the compliance were each correct for their build. Retiring `fire_trigger` as a diagnostic channel was still right — a fired run is a real run — but the reason recorded for it was wrong.

**Two operational facts from the same reading, neither previously recorded here.** Routines carry a **daily per-account run cap** separate from subscription limits (one-off runs are exempt), so a duplicate Routine left enabled spends cap as well as allowance. And if the GitHub connection lapses, **a Routine skips runs for up to 72 hours and then turns itself off** — reconnecting inside the window resumes it, after it needs re-enabling by hand. That is a second, independent way a run can report no repository access, distinct from the missing-`sources` cause proved on 2026-09-21; check the connection before re-deriving the whole diagnosis.

**The desk's prompt.** Kept here so it can be recreated without re-deriving it. It is deliberately short: the STEP 0 repo bootstrap, then identity, the calendar, a pointer to this file, the cap, the stand-down rule, the report shape. Nothing procedural that this file already says — the 22 retired prompts drifted precisely because the procedure was copied into 22 places. Paste the real `CORPUS_TOKEN` in at creation; it lives in the Routine prompt and nowhere else.

```text
STEP 0 — CLONE, THEN PROVE YOU CAN PUSH, BEFORE ANY RESEARCH. This Routine fires into a session
with NO repository source. On 2026-09-16 a run completed a full IREN/Jinko/Oracle refresh, committed
it locally as a378a96, and was DENIED on push — every minute of that work was thrown away. Do not
repeat it. Establish the push path first, while it still costs nothing.
  a. git clone https://github.com/LightAISolutions/Sales.git /home/user/Sales
     The session's git proxy authenticates transparently — no token, no `gh`, no credentials.
     If /home/user/Sales already exists with a clean `git status`, it is already cloned: just cd in.
  b. cd /home/user/Sales && git fetch --unshallow origin main || true
     Do this BEFORE reading any version pin, any `git log` date or any `--check` result — a shallow
     clone reports false staleness.
  c. PROVE PUSH WORKS NOW, before researching anything:
       git push --dry-run origin HEAD:refs/heads/claude/pushprobe-$(date +%Y%m%d)
     This authenticates against the remote without creating or changing anything.
  d. IF THE DRY-RUN PUSH IS DENIED, STOP IMMEDIATELY. Do no research, verify no reports, write no
     dossier, advance no calendar row, make no commit. Report the exact git error verbatim and end
     the run. A queue row left due is recoverable; an hour of research that cannot be pushed is not.
  e. Read CLAUDE.md and the rules files you need EXPLICITLY — they do NOT auto-load in this session,
     so the Pre-Commit and Pre-Push checklists are not in your context until you read them yourself.

  DO NOT look for `add_repo` or `register_repo_root`. Those tools do NOT exist in a Routine-fired
  session — verified 2026-09-16, both return "No matching deferred tools found". Searching for them
  only wastes turns. `git clone` is the supported path.

Only once the clone exists AND the dry-run push succeeded, do the following:

You are a fresh session in the LightAISolutions/Sales repo, running the Profiler earnings desk.

Read repository-information/profiler-refresh-calendar.json. It is the queue.

DUE = any row whose nextReport is yesterday or earlier. Take at most THREE due rows this run,
oldest nextReport first. Anything left over is due again tomorrow — do not exceed the cap.

For each row you take:
  1. Verify the report actually published (the row's source names where to look). If it has not,
     re-date the row with the real date, set confirmed accordingly, and move on — write no dossier.
  2. Run the Profiler Command in .claude/rules/profiler-app.md end to end, INCLUDING the news
     triage step in "News Triage — Scraper Corpus Bridge". Use the row's watch[] as the research
     priorities. CORPUS_TOKEN: <paste at creation>
  3. Advance the row: new nextReport (researched), confirmed, source, lastRefreshed, and refresh
     watch[] where the picture moved.

Also: for any row that is unconfirmed and whose nextReport is within seven days, confirm the date
and update the row. That is calendar work, not a refresh, and does not count against the cap.

Land one commit per run under the repo's normal Pre-Commit / Pre-Push checklists.

NEVER create, update or delete a Routine/trigger. The calendar is the only schedule. If you find
yourself wanting to arm a follow-up, write the date into the row instead.

IF NOTHING IS DUE: stand down. Make no commit and change no files. Still report — say how many
rows you read, how many are public vs quarterly, and the next date coming up with its slug. A
stand-down that does not name what it read is indistinguishable from a session that never reached
the repo, which is exactly how the previous convention failed.

REPORT (every run, due or not): rows read; rows taken; per company — published yes/no, what
changed, whether news triage promoted items or none qualified; rows re-dated; carry-over still
due; the commit SHA or "no commit".
```

---

## The rebuild prompts, current as of v07.01r

Paste these verbatim at rebuild. Both read the queue through `scripts/profiler-queue.py` — see the cost analysis above, and note the sandbox fallback. **Neither is urgent any more**: since v07.02r the calendar itself is 21 KB, so a Routine still running the old "read the calendar" wording already gets most of the saving. The script is the better path, not a required one.

### Earnings desk — replaces the "Read the calendar" instruction

Keep STEP 0 exactly as it is above, then replace the queue paragraph with:

```text
Read the queue with:  python3 scripts/profiler-queue.py --desk
Do NOT read repository-information/profiler-refresh-notes.json whole: it is ~369 KB of research
payload and the script joins the handful of entries you need per-slug. (The calendar itself is
~21 KB since the v07.02r split, so reading THAT whole is merely wasteful rather than harmful.)
The script returns
take[] (at most three due rows, oldest first), carryOver[], due[] with the full rows,
unconfirmedWithin7d[], and the totalRows / publicRows / quarterlyRows counts your stand-down
report must quote. If the sandbox refuses to run a repo script ("Code from External" policy
denial), say so in the report and re-run the same logic inline with python3 -c — never fall
back to reading the calendar whole.

Work take[] in order. Write rows back by editing the calendar file in place; that does not
require having read the whole file into context.
```

### Quarterly sweep — replaces the hardcoded 21-company list entirely

The old prompt named twenty-one companies inline, which is why sixty-four calendar rows were covered by nothing: the list and the corpus drifted apart and no one could see it. Coverage is now a property of the data. Replace the whole company paragraph with:

```text
Read the sweep queue with:  python3 scripts/profiler-queue.py --quarterly --tier core
(and, on the January and July runs only, again with --tier watch)

Cadence rows — the ones with no nextReport, which are private or unit-level companies with no
earnings clock — carry a tier. core = the Megmeet/SST-adjacent segments plus the named private
set, swept every 90 days. watch = the rest, swept every 180. The script returns only the rows
whose lastRefreshed is older than their tier's interval, oldest first, with ageDays on each.

If untieredRows[] is non-empty, a row was added to the calendar without a tier and is therefore
covered by nothing. Do NOT silently skip it: refresh it if it is due by any reading, and name
every untiered slug in your closing report so a developer session can tier it.

Never carry a company list in this prompt. Coverage is changed by committing to the calendar,
which a normal session can do; a prompt cannot be edited after this Routine is created.
```

Everything else in the quarterly prompt — the per-company research priorities, the archival procedure, the schema-v2 requirements, the Playwright check, the single commit — stays as written. The per-company `watch[]` arrays in the calendar rows already carry what the inline paragraph used to say, and unlike the prompt they can be updated by a commit.

Developed by: LightAISolutions
