#!/usr/bin/env python3
"""Generator for the Classroom segment lessons — layer 3 of the curriculum.

One public `segment-<id>` lesson per value-chain segment in
live-site-pages/profiler-data/profiler-segments.json, written as an ordinary
strict-JSON `clLessonSegment<CamelId>_()` literal inside the content fence of
googleAppsScripts/Classroom/Classroom.gs and registered in clLessons_(). The
design is CLASSROOM-CURRICULUM-PLAN.md §10.3–10.5 (S0, 2026-09-07); this script
is S1's code half. It states what the record states — the registry's own
sentences, the dossiers' own headlines and normalized figures, the graph's own
edges — and never a judgment: the judgment layer is the landscape module (S2).

Inputs (all read from the working tree, dates read off the fetched files — G2):
    profiler-segments.json     the taxonomy, memberships, roles, basis lines
    profiler-companies.json    display names
    <slug>.profile.json        lastUpdated, financials overlay, developments,
                               policyExposure — one per member (slug matched, G7)
    profiler-graph.json        `built` and the edges
    profiler-concepts.json     the {{term}} vocabulary; its pin is the file's
                               last commit date on --base (PROFILER-SCHEMA.md,
                               "Registry revision signals")
    Classroom.gs               the existing literals (for diffing) and the
                               registered mechanism lessons (for read-next)

Determinism: same inputs → the same bytes. Members, edges, developments and
fence rows are sorted; JSON key order is fixed; the only date the generator
invents is `updated` (= --today, default the EST date) and it is written only
when something else changed. A regeneration replaces the literal in place and
appends exactly one revisions[] entry whose changed[] is the set of section
ids whose parsed JSON differs (the P8 rule of check-classroom-pipeline.py).

Usage:
    python3 scripts/build-classroom-segments.py --check            # list due segments; exit 1 if any
    python3 scripts/build-classroom-segments.py --segment <id> ... # regenerate named segments
    python3 scripts/build-classroom-segments.py --all              # regenerate every segment
    python3 scripts/build-classroom-segments.py                    # regenerate the due ones only
    options: --today YYYY-MM-DD   --base origin/main   --dry-run

This is a developer-session tool, never a pipeline one: after a run, bump the
Classroom GAS version, add the generic changelog line, and run both Classroom
checkers, --selftest, node --check and check-gas-inner-scripts.js.
"""
import argparse
import datetime as dt
import json
import random
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "live-site-pages" / "profiler-data"
GS = ROOT / "googleAppsScripts" / "Classroom" / "Classroom.gs"
PROFILER_GS = ROOT / "googleAppsScripts" / "Profiler" / "Profiler.gs"
SEGMENTS = DATA / "profiler-segments.json"
COMPANIES = DATA / "profiler-companies.json"
GRAPH = DATA / "profiler-graph.json"
CONCEPTS = DATA / "profiler-concepts.json"
CONCEPTS_REL = "live-site-pages/profiler-data/profiler-concepts.json"

LANE = "The Value Chain"
SECTION_IDS = ["the-segment", "where-it-sits", "what-is-bought-and-on-what", "the-players",
               "the-numbers", "who-is-connected", "what-moved", "the-fence", "read-next",
               "check-yourself"]
ROLE_ORDER = {"incumbent": 0, "challenger": 1, "adjacent": 2}
OVERLAY_KPIS = ["revenue", "gwh-shipped", "backlog-gwh", "mw-energized", "mw-contracted"]
MOVED_CAP = 12
NEIGHBOUR_ROW_CAP = 40      # curated edges to the ±1 segments shown in who-is-connected
TERM_TOKEN = re.compile(r"\{\{([^}]+)\}\}")
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

# ── The fixed maps (§10.3 rows 3 and 9) ──────────────────────────────────────
# Segment → the §3 mechanism lessons that teach its technology and its market.
# Ids not yet registered in Classroom.gs render as "(planned)" — the map names
# the curriculum plan's ids so the pointer is right the day the lesson lands.
READ_NEXT = {
    "cells-and-chemistry": ["cell-to-container", "duration-and-degradation", "how-a-cell-is-made",
                            "where-batteries-stop", "the-china-policy-stack"],
    "storage-integrators-and-containers": ["cell-to-container", "spec-sheet-decoded", "the-control-stack",
                                           "what-bankable-means", "the-certification-stack"],
    "power-conversion-and-rack-power-silicon": ["four-machines", "string-versus-central", "the-800-vdc-shift",
                                                "inside-the-rack", "dc-fault-engineering"],
    "grid-equipment": ["the-transformer-and-the-substation", "breakers-relays-and-faults", "the-fence-line",
                       "grid-stability-and-the-generator"],
    "in-hall-power": ["the-aidc-power-chain", "the-ups-room", "backup-generation", "redundancy-by-the-numbers",
                      "where-bess-plugs-in"],
    "bridge-and-on-site-generation": ["bridge-power", "backup-generation", "grid-stability-and-the-generator"],
    "clean-firm-and-nuclear": ["clean-firm-power", "the-campus-as-a-power-project"],
    "cooling": ["heat-is-the-constraint", "the-cooling-plant-and-water"],
    "compute-and-the-rack": ["inside-the-rack", "the-800-vdc-shift", "heat-is-the-constraint"],
    "epc-and-construction": ["how-a-storage-project-happens", "the-campus-as-a-power-project", "where-the-chain-breaks"],
    "storage-developers-and-ipps": ["who-buys-storage", "how-a-storage-project-happens", "contracts-and-revenue",
                                    "reading-the-numbers"],
    "aidc-developers-and-landlords": ["the-fence-line", "bridge-power", "the-campus-as-a-power-project",
                                      "redundancy-by-the-numbers"],
    "hyperscalers-and-ai-labs": ["the-aidc-power-chain", "the-campus-as-a-power-project",
                                 "utility-procurement-meets-ai-load"],
    "neoclouds": ["the-campus-as-a-power-project", "bridge-power", "redundancy-by-the-numbers"],
    "utilities": ["how-a-utility-buys", "utility-procurement-meets-ai-load", "the-fence-line",
                  "interconnection-for-large-loads"],
    "capital": ["what-bankable-means", "contracts-and-revenue", "reading-the-numbers"],
    "assurance": ["the-certification-stack", "what-bankable-means"],
    "software-and-optimization": ["the-control-stack", "contracts-and-revenue"],
    "insurance-and-risk-transfer": ["what-bankable-means", "contracts-and-revenue"],
}
# Titles for lessons the plan specifies but no session has built yet
# (CLASSROOM-CURRICULUM-PLAN.md §3). Registered lessons use their live title.
PLANNED_TITLES = {
    "how-a-cell-is-made": "From Powder to Cell: Manufacturing, Formats, and Yield",
    "where-batteries-stop": "Long Duration, Sodium, and the Engine Boundary",
    "four-machines": "Rectifier, Inverter, DC-DC, Transformer",
    "string-versus-central": "One Big Box or Many Small Ones",
    "the-transformer-and-the-substation": "Why Electricity Changes Clothes",
    "breakers-relays-and-faults": "Stopping Ten Thousand Amps",
    "grid-stability-and-the-generator": "Inertia, Reactive Power, and Teaching Electronics to Lead",
    "interconnection-for-large-loads": "The Rulebook Above the Fence",
    "backup-generation": "The Ten-Second Race",
    "the-ups-room": "Static, Rotary, Modular, and the Battery Under Each",
    "redundancy-by-the-numbers": "N+1, 2N, and Six Nines",
    "inside-the-rack": "The Last Ten Metres",
    "dc-fault-engineering": "Faults, Grounding, and the Interlock at 800 Volts",
    "where-the-chain-breaks": "The Failure-Point Map",
    "the-cooling-plant-and-water": "PUE, WUE, and the Plant Outside the Hall",
    "the-campus-as-a-power-project": "Reading the Eight Named Projects",
    "clean-firm-power": "When the Campus Signs a Reactor",
    "who-buys-storage": "Eight Buyer Classes",
    "how-a-storage-project-happens": "From Site Control to Commercial Operation",
    "contracts-and-revenue": "Who Carries Which Risk",
    "reading-the-numbers": "One Dollar, Four Names",
    "how-a-utility-buys": "The Regulated Machine",
    "the-certification-stack": "Listing, Test Method, Code",
    "what-bankable-means": "The Independent Engineer's Report",
    "the-china-policy-stack": "Four Levers and One Order",
    "utility-procurement-meets-ai-load": "The Gatekeeper",
}
# Buying criterion → the mechanism lesson that teaches it, by keyword. Matched
# case-insensitively against the criterion text; first two hits are listed.
CRITERION_LEXICON = [
    (("cycle life", "calendar life", "degradation", "warranty curve", "augmentation", "round-trip"), "duration-and-degradation"),
    (("cost per kwh", "ah class", "format", "cell", "chemistry", "c-rate"), "cell-to-container"),
    (("foreign entity", "feoc", "prohibited", "section 301", "tariff", "origin", "ownership"), "the-china-policy-stack"),
    (("ul 9540", "certif", "listing", "nfpa", "fire record", "fire", "test method"), "the-certification-stack"),
    (("bankab", "independent engineer", "lender"), "what-bankable-means"),
    (("bms", "ems", "control", "software", "dispatch", "optimi", "forecast"), "the-control-stack"),
    (("inverter", "pcs", "conversion", "efficiency", "rectifier"), "four-machines"),
    (("string", "central"), "string-versus-central"),
    (("800", "vdc", "rack power", "bbu", "busbar"), "the-800-vdc-shift"),
    (("transformer", "substation", "switchgear", "goes", "lead time", "bushing"), "the-transformer-and-the-substation"),
    (("breaker", "fault", "protection", "relay", "arc"), "breakers-relays-and-faults"),
    (("ups", "static", "rotary", "hold-up", "ride-through"), "the-ups-room"),
    (("genset", "turbine", "engine", "bridge", "fuel", "gas supply", "emissions"), "bridge-power"),
    (("redundan", "n+1", "2n", "uptime", "availability", "concurrent"), "redundancy-by-the-numbers"),
    (("cooling", "liquid", "pue", "water", "wue", "chiller", "cdu", "refrigerant", "approach temperature"), "the-cooling-plant-and-water"),
    (("heat", "thermal", "density", "kw per rack", "cold plate"), "heat-is-the-constraint"),
    (("interconnect", "queue", "study", "large load", "energiz", "megawatt"), "the-fence-line"),
    (("ppa", "tolling", "offtake", "contract", "revenue", "merchant", "capacity payment"), "contracts-and-revenue"),
    (("financ", "debt", "equity", "tax credit", "itc", "45x", "48e", "cost of capital"), "what-bankable-means"),
    (("epc", "schedule", "construction", "commissioning", "labor", "labour", "craft"), "how-a-storage-project-happens"),
    (("rate case", "regulat", "irp", "rfp", "procure", "commission"), "how-a-utility-buys"),
    (("nuclear", "smr", "clean firm", "reactor"), "clean-firm-power"),
    (("rack density", "nvlink", "per watt", "allocation", "qualified vendor"), "inside-the-rack"),
    (("grid-forming", "inertia", "reactive", "stability", "black start"), "grid-stability-and-the-generator"),
    (("site control", "land", "permit", "zoning"), "how-a-storage-project-happens"),
    (("insur", "premium", "risk transfer", "coverage"), "what-bankable-means"),
    (("kpi", "reporting", "disclosure", "backlog"), "reading-the-numbers"),
]


# ── Loading — every date read off the fetched file itself (G2, G7) ──────────
class Corpus:
    def __init__(self, base):
        self.warnings = []
        self.segments = json.loads(SEGMENTS.read_text(encoding="utf-8"))
        self.companies = {c["slug"]: c for c in json.loads(COMPANIES.read_text(encoding="utf-8"))["companies"]}
        self.graph = json.loads(GRAPH.read_text(encoding="utf-8"))
        concepts = json.loads(CONCEPTS.read_text(encoding="utf-8"))
        self.terms = set()
        for c in concepts.get("concepts") or []:
            if isinstance(c, dict) and c.get("term"):
                self.terms.add(str(c["term"]).lower())
                for a in c.get("aliases") or []:
                    self.terms.add(str(a).lower())
        self.graph_built = str(self.graph.get("built") or "")
        self.concepts_date = git_commit_date(base, CONCEPTS_REL)
        if not DATE_RE.match(self.graph_built):
            raise SystemExit("profiler-graph.json carries no `built` date — refusing to pin")
        if not self.concepts_date:
            raise SystemExit("cannot read the concepts file's commit date on %s — the layer is unknown, "
                             "refusing to pin (git fetch --unshallow?)" % base)
        self.by_id = {s["id"]: s for s in self.segments["segments"]}
        self.by_pos = {s["position"]: s for s in self.segments["segments"]}
        self.member_seg = {}          # slug → [(segment id, role)] in position order
        for s in self.segments["segments"]:
            for m in s["members"]:
                self.member_seg.setdefault(m["slug"], []).append((s["id"], m["role"]))
        self._profiles = {}
        # Edges indexed by slug, once.
        self.edges_by_slug = {}
        for e in self.graph.get("edges") or []:
            self.edges_by_slug.setdefault(e["a"], []).append(e)
            self.edges_by_slug.setdefault(e["b"], []).append(e)

    def profile(self, slug):
        """The dossier, parsed and identity-matched — never assumed to exist (G7)."""
        if slug not in self._profiles:
            path = DATA / ("%s.profile.json" % slug)
            try:
                p = json.loads(path.read_text(encoding="utf-8"))
            except (OSError, ValueError) as e:
                raise SystemExit("member %r: cannot read %s — %s" % (slug, path.name, e))
            if p.get("slug") != slug:
                raise SystemExit("member %r: %s carries slug %r — identity mismatch" % (slug, path.name, p.get("slug")))
            if not DATE_RE.match(str(p.get("lastUpdated") or "")):
                raise SystemExit("member %r: no lastUpdated on the dossier — refusing to pin" % slug)
            self._profiles[slug] = p
        return self._profiles[slug]

    def name(self, slug):
        p = self.profile(slug)
        return p.get("shortName") or (self.companies.get(slug) or {}).get("name") or p.get("name") or slug


def git_commit_date(base, rel):
    """`YYYY-MM-DD` of the file's last commit on the base revision, or '' when
    git cannot say (shallow clone, missing ref) — the caller treats '' as unknown."""
    for rev in (base, "HEAD"):
        try:
            out = subprocess.run(["git", "log", "-1", "--format=%cs", rev, "--", rel],
                                 cwd=ROOT, capture_output=True, text=True, timeout=30)
        except (OSError, subprocess.TimeoutExpired):
            return ""
        d = out.stdout.strip()
        if out.returncode == 0 and DATE_RE.match(d):
            if rev != base:
                print("WARN  %s not available — concepts pin read on HEAD instead" % base)
            return d
    return ""


def load_checker():
    """The content checker's parser — one parser for the literal shape."""
    import importlib.util
    spec = importlib.util.spec_from_file_location("ccc", ROOT / "scripts" / "check-classroom-content.py")
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


def camel(seg_id):
    return "".join(p[:1].upper() + p[1:] for p in seg_id.split("-"))


def fn_name(seg_id):
    return "clLessonSegment%s_" % camel(seg_id)


def first_sentence(text, cap=160):
    m = re.match(r"(.+?[.!?])(\s|$)", text.strip())
    s = (m.group(1) if m else text.strip())
    if len(s) <= cap:
        return s
    cut = s[:cap - 1].rsplit(" ", 1)[0].rstrip(" ,;:—-")
    return cut + "…"


def add_months(date_str, months):
    y, m, d = (int(x) for x in date_str.split("-"))
    m += months
    y += (m - 1) // 12
    m = (m - 1) % 12 + 1
    last = [31, 29 if (y % 4 == 0 and (y % 100 != 0 or y % 400 == 0)) else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1]
    return "%04d-%02d-%02d" % (y, m, min(d, last))


def canon(obj):
    return json.dumps(obj, sort_keys=True, ensure_ascii=False)


def fmt_num(v):
    if isinstance(v, bool) or not isinstance(v, (int, float)):
        return ""
    if float(v).is_integer():
        return "{:,}".format(int(v))
    return "{:,.1f}".format(v)


# ── The lesson — ten fixed sections, the registry's words ────────────────────
class Builder:
    def __init__(self, corpus, registered, today):
        self.c = corpus
        self.registered = registered      # lesson id → title, from Classroom.gs
        self.today = today
        self.landscapes = landscape_modules()

    # -- helpers ------------------------------------------------------------
    def members(self, seg):
        return sorted(seg["members"], key=lambda m: (ROLE_ORDER.get(m["role"], 9), m["slug"]))

    def lesson_ref(self, lid):
        t = self.registered.get(lid)
        if t:
            return "*%s*" % t
        return "*%s* (planned)" % PLANNED_TITLES.get(lid, lid)

    def neighbours(self, seg):
        return self.c.by_pos.get(seg["position"] - 1), self.c.by_pos.get(seg["position"] + 1)

    def curated_sides(self, e):
        """[(from, to, curated dict)] — one per curated side of an edge."""
        out = []
        cur = e.get("curated") or {}
        if cur.get("a"):
            out.append((e["a"], e["b"], cur["a"]))
        if cur.get("b"):
            out.append((e["b"], e["a"], cur["b"]))
        return out

    def counterparties(self, seg):
        """{"sells-to": {segment id: n}, "buys-from": {segment id: n}} — curated
        customer / supplier edges between this segment's members and other
        segments' members, read from the typed side exactly as the graph states it."""
        slugs = {m["slug"] for m in seg["members"]}
        seen, counts = set(), {"sells-to": {}, "buys-from": {}}
        for s in slugs:
            for e in self.c.edges_by_slug.get(s, []):
                key = (e["a"], e["b"])
                if key in seen:
                    continue
                seen.add(key)
                for frm, to, cur in self.curated_sides(e):
                    t = cur.get("type")
                    if t not in ("customer", "supplier"):
                        continue
                    if (frm in slugs) == (to in slugs):
                        continue                      # both inside or both outside
                    inside, other = (frm, to) if frm in slugs else (to, frm)
                    # frm→to `customer`: to is frm's customer. frm→to `supplier`: to supplies frm.
                    if frm == inside:
                        direction = "sells-to" if t == "customer" else "buys-from"
                    else:
                        direction = "buys-from" if t == "customer" else "sells-to"
                    for sid, _role in self.c.member_seg.get(other, []):
                        if sid != seg["id"]:
                            counts[direction][sid] = counts[direction].get(sid, 0) + 1
        return counts

    # -- sections -----------------------------------------------------------
    def sec_the_segment(self, seg):
        tier = seg["tier"]
        tier_line = self.c.segments.get("tiers", {}).get(tier, "")
        return {"id": "the-segment", "title": "The segment", "kind": "prose", "read": "1 min",
                "ps": [seg["definition"],
                       "Chain position %d of %d · tier **%s** — %s." % (
                           seg["position"], len(self.c.by_pos), tier, tier_line.rstrip("."))]}

    def sec_where_it_sits(self, seg):
        up, down = self.neighbours(seg)
        rows = [["Upstream (position %d)" % up["position"], up["name"], up["tier"]] if up
                else ["Upstream", "— (first link in the chain)", ""],
                ["**This segment** (position %d)" % seg["position"], "**%s**" % seg["name"], seg["tier"]],
                ["Downstream (position %d)" % down["position"], down["name"], down["tier"]] if down
                else ["Downstream", "— (last link in the chain)", ""]]
        cps = self.counterparties(seg)
        def fmt(d):
            items = sorted(d.items(), key=lambda kv: (-kv[1], self.c.by_id[kv[0]]["position"]))
            return " · ".join("%s (%d edge%s)" % (self.c.by_id[sid]["name"], n, "" if n == 1 else "s")
                              for sid, n in items) or "none on the record"
        rows.append(["Buyers on the record (curated customer / supplier edges)", fmt(cps.get("sells-to", {})),
                     "who buys what this segment makes or does"])
        rows.append(["Suppliers on the record (curated customer / supplier edges)", fmt(cps.get("buys-from", {})),
                     "who this segment buys from"])
        return {"id": "where-it-sits", "title": "Where it sits in the chain", "kind": "table", "read": "1 min",
                "cols": ["Link", "Segment", "Tier"], "rows": rows}

    def sec_what_is_bought(self, seg):
        rows = []
        eligible = set(READ_NEXT.get(seg["id"], []))
        for crit in seg["buyingCriteria"]:
            low = crit.lower()
            hits = []
            for keys, lid in CRITERION_LEXICON:
                # Only a lesson mapped to this segment can teach one of its criteria —
                # a bare keyword hit across the whole curriculum is noise.
                if lid in eligible and any(k in low for k in keys) and lid not in hits:
                    hits.append(lid)
                if len(hits) == 2:
                    break
            rows.append([crit, " · ".join(self.lesson_ref(l) for l in hits) if hits else "—"])
        return {"id": "what-is-bought-and-on-what", "title": "What is bought here, and on what", "kind": "table",
                "read": "2 min", "cols": ["Buying criterion", "Taught in"], "rows": rows}

    def sec_the_players(self, seg):
        rows = []
        for m in self.members(seg):
            rows.append(["**%s**" % self.c.name(m["slug"]), m["slug"], m["role"], m["basis"]])
        if not rows:
            rows.append(["—", "—", "—", "No member on record — the segment starts empty and fills as dossiers land"])
        return {"id": "the-players", "title": "The players", "kind": "table", "read": "3 min",
                "intro": "Grouped incumbent → challenger → adjacent. The basis is the line in the company's own dossier that places it here; the dossier column is the identity the roster deck and the dossier link key on.",
                "cols": ["Company", "Dossier", "Role", "Basis (the dossier's own line)"], "rows": rows}

    def latest_overlay(self, slug):
        """(periodEnd, {kpi: metric}) for the latest annual period carrying any
        normalized KPI — the overlay's own rule: only figures the prose contains."""
        best = None
        for per in (self.c.profile(slug).get("financials") or {}).get("periods") or []:
            if per.get("periodType") != "annual":
                continue
            found = {}
            for m in per.get("metrics") or []:
                k = m.get("kpi")
                if k in OVERLAY_KPIS and k not in found and (
                        isinstance(m.get("usdMillions"), (int, float)) or isinstance(m.get("qty"), (int, float))):
                    found[k] = m
            if found:
                end = str(per.get("periodEnd") or "")
                if best is None or end > best[0]:
                    best = (end, found, per.get("period") or "")
        return best

    def sec_the_numbers(self, seg):
        rows, none = [], []
        for m in self.members(seg):
            ov = self.latest_overlay(m["slug"])
            if not ov:
                none.append(self.c.name(m["slug"]))
                continue
            end, found, label = ov
            rev = found.get("revenue")
            rows.append(["**%s**" % self.c.name(m["slug"]), "%s · %s" % (label.split(" (")[0], end) if end else label,
                         fmt_num(rev.get("usdMillions")) if rev else "—",
                         (rev.get("fxBasis") or "") if rev else "",
                         fmt_num(found["gwh-shipped"].get("qty")) if "gwh-shipped" in found else "—",
                         fmt_num(found["backlog-gwh"].get("qty")) if "backlog-gwh" in found else "—",
                         fmt_num(found["mw-energized"].get("qty")) if "mw-energized" in found else "—",
                         fmt_num(found["mw-contracted"].get("qty")) if "mw-contracted" in found else "—"])
        if none:
            rows.append(["*No normalized figure on record*", "—", "—", "", "—", "—", "—",
                         ", ".join(none)])
        if not rows:
            rows.append(["—", "No member carries a normalized figure for this period", "—", "", "—", "—", "—", "—"])
        return {"id": "the-numbers", "title": "The numbers on record", "kind": "table", "read": "2 min",
                "intro": "Only the dossiers' normalized annual figures — revenue in USD millions with its stated FX basis, and the physical KPIs in their own units. A company without a normalized figure is listed as such, never estimated.",
                "cols": ["Company", "Period", "Revenue (USD m)", "FX basis", "GWh shipped", "Backlog (GWh)",
                         "MW energized", "MW contracted"], "rows": rows}

    def sec_who_is_connected(self, seg):
        slugs = {m["slug"] for m in seg["members"]}
        up, down = self.neighbours(seg)
        near = set()
        for n in (up, down):
            if n:
                near |= {m["slug"] for m in n["members"]}
        near -= slugs
        internal, adjacent_rows, derived_in, derived_near, seen = [], [], 0, 0, set()
        for s in sorted(slugs):
            for e in self.c.edges_by_slug.get(s, []):
                key = (e["a"], e["b"])
                if key in seen:
                    continue
                seen.add(key)
                a_in, b_in = e["a"] in slugs, e["b"] in slugs
                both = a_in and b_in
                one_near = (a_in and e["b"] in near) or (b_in and e["a"] in near)
                if not (both or one_near):
                    continue
                sides = self.curated_sides(e)
                if not sides:
                    if both:
                        derived_in += 1
                    else:
                        derived_near += 1
                    continue
                for frm, to, cur in sides:
                    row = ["**%s**" % self.c.name(frm), "**%s**" % self.c.name(to) if to in slugs else self.c.name(to),
                           cur.get("type") or "—", cur.get("status") or "—", cur.get("scale") or "—",
                           cur.get("via") or "—"]
                    (internal if both else adjacent_rows).append(row)
        internal.sort(key=lambda r: (r[0], r[1], r[2]))
        adjacent_rows.sort(key=lambda r: (r[0], r[1], r[2]))
        n_adj = len(adjacent_rows)
        rows = internal + adjacent_rows[:NEIGHBOUR_ROW_CAP]
        if not rows:
            rows = [["—", "—", "No curated edge among the members or to the neighbouring segments", "—", "—", "—"]]
        note = ("Curated edges among members: %d · to the neighbouring segments: %d%s · derived-only mentions "
                "(no curated typing): %d among members, %d to the neighbours."
                % (len(internal), n_adj,
                   (" (the first %d shown, by company)" % NEIGHBOUR_ROW_CAP) if n_adj > NEIGHBOUR_ROW_CAP else "",
                   derived_in, derived_near))
        return {"id": "who-is-connected", "title": "Who is connected to whom", "kind": "table", "read": "3 min",
                "intro": "The relationship graph as it stands: curated edges among the members first, then curated edges from a member to the segments one link up or down. Bold names are members of this segment; the type is the edge as typed from the first company's side.",
                "cols": ["From", "To", "Type", "Status", "Scale", "Via"], "rows": rows, "note": note}

    def sec_what_moved(self, seg):
        items = []
        for m in seg["members"]:
            for d in self.c.profile(m["slug"]).get("recentDevelopments") or []:
                date = str(d.get("date") or "")
                head = str(d.get("headline") or "").strip()
                if not (DATE_RE.match(date) and head):
                    continue
                items.append((date, m["slug"], head, str(d.get("category") or "")))
        items.sort(key=lambda t: (t[0], t[1], t[2]), reverse=True)
        items = items[:MOVED_CAP]
        out = []
        for i, (date, slug, head, cat) in enumerate(items, 1):
            out.append({"x": i, "lane": "record", "label": "%s — %s" % (date, head),
                        "sub": "%s%s" % (self.c.name(slug), (" · " + cat) if cat else "")})
        if not out:
            out.append({"x": 1, "lane": "record", "label": "No dated development on record",
                        "sub": "The members' dossiers carry no dated development yet"})
        return {"id": "what-moved", "title": "What moved", "kind": "timeline", "read": "3 min",
                "intro": "The newest dated developments across the members' dossiers, most recent first, capped at %d. The number is the order, not the calendar; the provenance strip says when each dossier was read." % MOVED_CAP,
                "lanes": {"record": "On the record"}, "items": out}

    def fence_entries(self, seg):
        groups = {}
        for m in seg["members"]:
            for pe in self.c.profile(m["slug"]).get("policyExposure") or []:
                regime = str(pe.get("regime") or "").strip()
                if not regime:
                    continue
                key = (regime, str(pe.get("status") or "—"), str(pe.get("effectiveDate") or ""))
                groups.setdefault(key, set()).add(m["slug"])
        return groups

    def sec_the_fence(self, seg):
        groups = self.fence_entries(seg)
        rows = []
        for (regime, status, eff), slugs in sorted(groups.items(), key=lambda kv: (kv[0][0].lower(), kv[0][1], kv[0][2])):
            rows.append([regime, status, eff or "—", ", ".join(sorted(self.c.name(s) for s in slugs))])
        if not rows:
            rows.append(["—", "—", "—", "No member's dossier records a policy exposure"])
        return {"id": "the-fence", "title": "The policy fence", "kind": "table", "read": "2 min",
                "intro": "Every policy regime a member's dossier records as bearing on it, with the dossier's own status and effective date. The nearest future date here sets this lesson's review date.",
                "cols": ["Regime", "Status", "Effective", "Members exposed"], "rows": rows}

    def sec_read_next(self, seg):
        lessons = [self.lesson_ref(l) for l in READ_NEXT.get(seg["id"], [])]
        ps = ["**Mechanism lessons for this segment:** " + (" · ".join(lessons) if lessons else "none mapped yet") + "."]
        land = self.landscapes.get(seg["id"])
        if land:
            ps.append("**The landscape module** — the judgment layer for this segment — is *%s*, for the tiers that hold guidance access." % land)
        else:
            ps.append("**No landscape module yet.** The judgment layer — who dominates and on what basis, who threatens, each player's bet — is authored separately and only once the segment holds three members including an incumbent and a challenger.")
        names = [self.c.name(m["slug"]) for m in self.members(seg)]
        ps.append("**Study guides:** " + (", ".join(names) if names else "none yet") + " — each member's dossier carries one in Profiler.")
        return {"id": "read-next", "title": "Read next", "kind": "callout", "read": "1 min", "ps": ps}

    def sec_check_yourself(self, seg):
        """Five structural items, deterministic per segment (seeded on its id).
        Structure only — a segment, a role, a criterion, a neighbour, an edge."""
        rng = random.Random("segment:" + seg["id"])
        others = [s for s in self.c.segments["segments"] if s["id"] != seg["id"]]
        mem = self.members(seg)
        items = []

        def choices(correct, pool, n=4):
            pool = [p for p in pool if p != correct]
            picks = rng.sample(pool, min(n - 1, len(pool)))
            opts = picks + [correct]
            rng.shuffle(opts)
            return opts, opts.index(correct)

        if mem:
            m = mem[0]
            c, a = choices(seg["name"], [o["name"] for o in others])
            items.append({"q": "Which segment does the registry place **%s** in%s?" % (
                self.c.name(m["slug"]), " (among others)" if len(self.c.member_seg.get(m["slug"], [])) > 1 else ""),
                "c": c, "a": a,
                "why": "The registry's basis line: %s" % m["basis"]})
            m2 = mem[-1] if len(mem) > 1 else mem[0]
            c, a = choices(m2["role"], ["incumbent", "challenger", "adjacent"], 3)
            items.append({"q": "What role does the registry give **%s** in %s?" % (self.c.name(m2["slug"]), seg["name"]),
                          "c": c, "a": a,
                          "why": "%s — %s" % (m2["role"], self.c.segments["roles"].get(m2["role"], ""))})
        crit = seg["buyingCriteria"][0]
        pool = [x for o in others for x in o["buyingCriteria"]]
        c, a = choices(crit, pool)
        items.append({"q": "Which of these is a criterion buyers in **%s** buy on, per the registry?" % seg["name"],
                      "c": c, "a": a,
                      "why": "It is the first criterion the registry lists for this segment; the others belong to other links of the chain."})
        up, down = self.neighbours(seg)
        if up:
            c, a = choices(up["name"], [o["name"] for o in others if o["id"] != up["id"]])
            items.append({"q": "Which segment sits one link **upstream** of %s?" % seg["name"], "c": c, "a": a,
                          "why": "Chain position %d against this segment's %d." % (up["position"], seg["position"])})
        elif down:
            c, a = choices(down["name"], [o["name"] for o in others if o["id"] != down["id"]])
            items.append({"q": "Which segment sits one link **downstream** of %s?" % seg["name"], "c": c, "a": a,
                          "why": "This segment is the first link; position %d follows it." % down["position"]})
        edge = self.first_internal_edge(seg)
        if edge:
            frm, to, cur = edge
            types = ["customer", "supplier", "competitor", "partner", "investor", "portfolio", "other"]
            c, a = choices(cur.get("type"), types)
            items.append({"q": "The graph records a curated edge from **%s** to **%s**. How is it typed from %s's side?" % (
                self.c.name(frm), self.c.name(to), self.c.name(frm)), "c": c, "a": a,
                "why": (cur.get("note") or "As curated in the dossier.")})
        while len(items) < 5 and len(mem) > len(items) - 2:
            # Thin segments: fall back to more placement items rather than inventing anything.
            idx = len(items) - 2
            if idx >= len(mem):
                break
            m = mem[idx]
            c, a = choices(seg["name"], [o["name"] for o in others])
            items.append({"q": "Which segment does the registry place **%s** in?" % self.c.name(m["slug"]),
                          "c": c, "a": a, "why": "The registry's basis line: %s" % m["basis"]})
        return {"id": "check-yourself", "title": "Self-test", "kind": "quiz", "read": "%d questions" % len(items),
                "items": items}

    def first_internal_edge(self, seg):
        slugs = sorted(m["slug"] for m in seg["members"])
        sset = set(slugs)
        for s in slugs:
            for e in sorted(self.c.edges_by_slug.get(s, []), key=lambda e: (e["a"], e["b"])):
                if e["a"] in sset and e["b"] in sset:
                    for frm, to, cur in self.curated_sides(e):
                        if cur.get("type"):
                            return frm, to, cur
        return None

    # -- the lesson ---------------------------------------------------------
    def stamp(self, seg):
        inputs = []
        for m in sorted(seg["members"], key=lambda m: m["slug"]):
            p = self.c.profile(m["slug"])
            inputs.append({"kind": "public", "ref": "profile:%s" % m["slug"], "date": p["lastUpdated"],
                           "note": "member — %s; the basis line, developments, normalized figures and policy exposure" % m["role"]})
        inputs.append({"kind": "public", "ref": "graph:profiler-graph", "date": self.c.graph_built,
                       "note": "curated edges among members and to the neighbouring segments"})
        inputs.append({"kind": "public", "ref": "concepts:profiler-concepts", "date": self.c.concepts_date,
                       "note": "term resolution for the {{term}} tooltips"})
        return {"inputs": inputs}

    def review_by(self, seg, updated):
        future = sorted(eff for (_r, _s, eff), _m in self.fence_entries(seg).items()
                        if DATE_RE.match(eff) and eff > updated)
        return future[0] if future else add_months(updated, 6)

    def tiles(self, seg, connected):
        roles = {r: sum(1 for m in seg["members"] if m["role"] == r) for r in ROLE_ORDER}
        n = len(seg["members"])
        internal = int(re.search(r"among members: (\d+)", connected["note"]).group(1))
        return [{"k": str(n), "v": "member%s on record" % ("" if n == 1 else "s"), "sub": "companies with a dossier placed here"},
                {"k": str(roles["incumbent"]), "v": "incumbent%s" % ("" if roles["incumbent"] == 1 else "s"),
                 "sub": "the established leading set, per the dossiers"},
                {"k": str(roles["challenger"]), "v": "challenger%s" % ("" if roles["challenger"] == 1 else "s"),
                 "sub": "contesting that set; %d adjacent" % roles["adjacent"]},
                {"k": str(internal), "v": "curated edge%s" % ("" if internal == 1 else "s"),
                 "sub": "among the members, in the relationship graph"}]

    def build(self, seg, updated):
        connected = self.sec_who_is_connected(seg)
        sections = [self.sec_the_segment(seg), self.sec_where_it_sits(seg), self.sec_what_is_bought(seg),
                    self.sec_the_players(seg), self.sec_the_numbers(seg), connected, self.sec_what_moved(seg),
                    self.sec_the_fence(seg), self.sec_read_next(seg), self.sec_check_yourself(seg)]
        assert [s["id"] for s in sections] == SECTION_IDS
        return {"schemaVersion": 1, "id": "segment-%s" % seg["id"], "type": "module", "title": seg["name"],
                "short": first_sentence(seg["definition"]), "group": LANE, "updated": updated,
                "reviewBy": self.review_by(seg, updated), "provenance": self.stamp(seg),
                "tiles": self.tiles(seg, connected), "sections": sections}


def landscape_modules():
    """segment id → landscape module id, from guidanceDocs_() wherever it lives
    (Profiler.gs until C3, Classroom.gs after)."""
    out = {}
    for path in (PROFILER_GS, GS):
        try:
            src = path.read_text(encoding="utf-8")
        except OSError:
            continue
        for m in re.finditer(r'"id":\s*"(landscape-([a-z0-9-]+)-\d{4}-\d{2})"', src):
            out.setdefault(m.group(2), m.group(1))
    return out


# ── Diffing and writing — replace in place, append once, register once ──────
def strip_dates(lesson):
    """The lesson without the fields a regeneration may legitimately move on
    its own: `updated`, `reviewBy` (derived from `updated`) and `revisions[]`."""
    out = {k: v for k, v in lesson.items() if k not in ("updated", "reviewBy", "revisions")}
    return out


def changed_sections(old, new):
    bs = {s["id"]: s for s in old.get("sections") or []}
    hs = {s["id"]: s for s in new.get("sections") or []}
    return sorted(sid for sid in set(bs) & set(hs) if canon(bs[sid]) != canon(hs[sid]))


def moved_inputs(old, new):
    op = {i["ref"]: i.get("date") for i in (old.get("provenance") or {}).get("inputs") or []}
    np_ = {i["ref"]: i.get("date") for i in (new.get("provenance") or {}).get("inputs") or []}
    parts = []
    for ref in sorted(set(op) | set(np_)):
        if ref not in op:
            parts.append("%s added@%s" % (ref, np_[ref]))
        elif ref not in np_:
            parts.append("%s removed" % ref)
        elif op[ref] != np_[ref]:
            parts.append("%s %s→%s" % (ref, op[ref], np_[ref]))
    return parts


def literal_text(fn, obj):
    return "function %s() {\n  return %s;\n}\n" % (fn, json.dumps(obj, indent=1, ensure_ascii=False))


def function_span(src, fn):
    """(start, end) of `function fn() { ... }` including the trailing newline."""
    m = re.search(r"^function %s\(\) \{\n" % re.escape(fn), src, re.M)
    if not m:
        return None
    depth, i = 0, m.start()
    in_str = esc = False
    for j in range(m.start(), len(src)):
        c = src[j]
        if in_str:
            if esc:
                esc = False
            elif c == "\\":
                esc = True
            elif c == '"':
                in_str = False
            continue
        if c == '"':
            in_str = True
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                end = j + 1
                if src[end:end + 1] == "\n":
                    end += 1
                return m.start(), end
    return None


def insert_after_last(src, prefix, text, before_pat):
    """Insert `text` after the last `function <prefix>...` literal, or before
    `before_pat` when none exists. Keeps one blank line between literals."""
    spans = [function_span(src, m.group(1)) for m in
             re.finditer(r"^function (%s[A-Z]\w*_)\(\) \{" % prefix, src, re.M)]
    spans = [s for s in spans if s]
    if spans:
        at = max(e for _s, e in spans)
    else:
        m = re.search(before_pat, src, re.M)
        if not m:
            raise SystemExit("cannot find an insertion point for %s literals" % prefix)
        at = m.start()
    return src[:at] + "\n" + text + src[at:]


def register(src, registry, fn):
    m = re.search(r"^function %s\(\) \{\s*return \[(.*?)\];" % registry, src, re.S | re.M)
    if not m:
        raise SystemExit("%s(): registry not found" % registry)
    body = m.group(1)
    if fn + "()" in body:
        return src
    new_body = body.rstrip() + ",\n          %s()" % fn
    return src[:m.start(1)] + new_body + src[m.end(1):]


def fence_ok(src):
    a, b = src.find("// CONTENT START"), src.find("// CONTENT END")
    return 0 <= a < b


def check_terms(lesson, terms):
    seen, out = set(), []
    def walk(node):
        if isinstance(node, str):
            for t in TERM_TOKEN.findall(node):
                if t.lower() not in terms and t.lower() not in seen:
                    seen.add(t.lower()); out.append(t)
        elif isinstance(node, list):
            for x in node: walk(x)
        elif isinstance(node, dict):
            for k, v in node.items():
                if k not in ("id", "kind"): walk(v)
    walk(lesson.get("sections") or [])
    return out


def verify(lesson, seg):
    """The checks the generator carries itself (§10.4)."""
    ids = [s["id"] for s in lesson["sections"]]
    assert ids == SECTION_IDS, ids
    members = sorted(m["slug"] for m in seg["members"])
    refs = sorted(i["ref"].split(":", 1)[1] for i in lesson["provenance"]["inputs"] if i["ref"].startswith("profile:"))
    assert refs == members, (refs, members)
    players = next(s for s in lesson["sections"] if s["id"] == "the-players")
    rows = sorted(r[1] for r in players["rows"] if r[1] != "—")
    assert rows == members, (rows, members)
    json.loads(json.dumps(lesson))     # strict JSON by construction


# ── The three Value Chain tracks (§10.5) ─────────────────────────────────────
TRACKS = [
    ("value-chain-makers", "clTrackValueChainMakers_", "The Value Chain I — Who Makes It",
     "Finish this and you can read the relationship graph, and say who makes the cell, the container and the "
     "converter and on what each is bought.", [], (1, 3)),
    ("value-chain-builders", "clTrackValueChainBuilders_", "The Value Chain II — Who Builds and Powers It",
     "Finish this and you can say who connects it, powers it, cools it and builds it, and who sets the calendar.",
     ["value-chain-makers"], (4, 10)),
    ("value-chain-buyers-and-backers", "clTrackValueChainBuyersAndBackers_",
     "The Value Chain III — Who Buys It and Who Backs It",
     "Finish this and you can say who buys it, who backs it, who assures it, who optimises it and who insures "
     "it — and which desk signs.", ["value-chain-makers"], (11, 19)),
]


def sync_tracks(src, corpus, existing_tracks, today, log):
    """Create the three tracks on the first run; afterwards append any newly
    registered segment lesson to its track (append-only — a reorder is a
    developer's decision, never the generator's)."""
    for tid, fn, title, short, prereqs, (lo, hi) in TRACKS:
        want = ["segment-%s" % s["id"] for s in corpus.segments["segments"] if lo <= s["position"] <= hi]
        cur = existing_tracks.get(fn)
        if cur is None:
            obj = {"schemaVersion": 1, "id": tid, "title": title, "short": short, "group": LANE,
                   "updated": today, "lessons": want}
            if prereqs:
                obj["prereqs"] = prereqs
            src = insert_after_last(src, "clTrack", literal_text(fn, obj), r"^// Registries — ordered by lane")
            src = register(src, "clTracks_", fn)
            log.append("track %s created with %d lessons" % (tid, len(want)))
            continue
        missing = [l for l in want if l not in cur.get("lessons", [])]
        if missing:
            obj = dict(cur)
            obj["lessons"] = list(cur["lessons"]) + missing
            obj["updated"] = today
            s, e = function_span(src, fn)
            src = src[:s] + literal_text(fn, obj) + src[e:]
            log.append("track %s: appended %s" % (tid, ", ".join(missing)))
    return src


# ── Main ─────────────────────────────────────────────────────────────────────
def est_today():
    import zoneinfo
    return dt.datetime.now(zoneinfo.ZoneInfo("America/New_York")).strftime("%Y-%m-%d")


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n\n")[0])
    ap.add_argument("--check", action="store_true", help="list due segments and exit 1 if any")
    ap.add_argument("--segment", action="append", default=[], help="regenerate this segment (repeatable)")
    ap.add_argument("--all", action="store_true", help="regenerate every segment")
    ap.add_argument("--today", default=None, help="generation date YYYY-MM-DD (default: today, EST)")
    ap.add_argument("--base", default="origin/main", help="revision for the concepts pin (default origin/main)")
    ap.add_argument("--dry-run", action="store_true", help="report what would change; write nothing")
    args = ap.parse_args()
    today = args.today or est_today()
    if not DATE_RE.match(today):
        raise SystemExit("--today must be YYYY-MM-DD")

    corpus = Corpus(args.base)
    ccc = load_checker()
    src = GS.read_text(encoding="utf-8")
    if not fence_ok(src):
        raise SystemExit("Classroom.gs: content fence not found")
    lessons = ccc.parse_literals(src, "clLesson")
    tracks = ccc.parse_literals(src, "clTrack")
    if ccc.errors:
        raise SystemExit("Classroom.gs literals do not parse: %s" % ccc.errors[:3])
    registered = {l["id"]: l["title"] for l in lessons.values() if isinstance(l, dict) and l.get("id")}
    builder = Builder(corpus, registered, today)

    segs = corpus.segments["segments"]
    unknown = [s for s in args.segment if s not in corpus.by_id]
    if unknown:
        raise SystemExit("unknown segment id(s): %s" % ", ".join(unknown))
    if args.segment:
        segs = [corpus.by_id[s] for s in args.segment]

    # Decide per segment: new / due / current.
    plan, due_report = [], []
    for seg in segs:
        fn = fn_name(seg["id"])
        old = lessons.get(fn)
        if old is None:
            plan.append((seg, fn, None, "new"))
            due_report.append("%s: no lesson yet" % seg["id"])
            continue
        probe = builder.build(seg, old.get("updated") or today)
        if canon(strip_dates(probe)) != canon(strip_dates(old)):
            why = moved_inputs(old, probe)
            secs = changed_sections(old, probe)
            plan.append((seg, fn, old, "due"))
            due_report.append("%s: due — inputs moved: %s; sections differing: %s"
                              % (seg["id"], ", ".join(why) or "none", ", ".join(secs) or "none"))
        elif args.all:
            plan.append((seg, fn, old, "forced"))
        else:
            plan.append((seg, fn, old, "current"))

    if args.check:
        due = [r for r in due_report]
        print("build-classroom-segments --check: %d segment(s), %d due" % (len(segs), len(due)))
        for r in due:
            print("  " + r)
        return 1 if due else 0

    log, written = [], 0
    for seg, fn, old, state in plan:
        if state == "current":
            continue
        new = builder.build(seg, today)
        if old is not None:
            secs = changed_sections(old, new)
            moved = moved_inputs(old, new)
            if state == "forced" and not secs and not moved:
                continue            # nothing moved: same bytes, nothing written
            revs = list(old.get("revisions") or [])
            revs.append({"date": today, "note": "regenerated: " + ("; ".join(moved) if moved else "registry or graph content moved with no pin change"),
                         "changed": secs})
            new["revisions"] = revs
            # Pins move only on inputs that moved — every pin is read off the file, so an
            # unchanged input keeps its date by construction. Guard against regression anyway.
            oldp = {i["ref"]: i.get("date") for i in old["provenance"]["inputs"]}
            for i in new["provenance"]["inputs"]:
                if i["ref"] in oldp and oldp[i["ref"]] and i["date"] < oldp[i["ref"]]:
                    raise SystemExit("%s: pin for %s would move backwards (%s → %s) — the source is unknown, refusing"
                                     % (new["id"], i["ref"], oldp[i["ref"]], i["date"]))
            log.append("%s: regenerated (changed: %s; %s)" % (new["id"], ", ".join(secs) or "none", "; ".join(moved) or "no pin moved"))
        else:
            log.append("%s: generated (%d members)" % (new["id"], len(seg["members"])))
        verify(new, seg)
        for t in check_terms(new, corpus.terms):
            print("WARN  %s: {{%s}} is not in the concepts registry" % (new["id"], t))
        text = literal_text(fn, new)
        if old is None:
            src = insert_after_last(src, "clLesson", text, r"^function clTrack[A-Z]\w*_\(\) \{")
            src = register(src, "clLessons_", fn)
        else:
            s, e = function_span(src, fn)
            src = src[:s] + text + src[e:]
        written += 1

    src = sync_tracks(src, corpus, tracks, today, log)
    for line in log:
        print("  " + line)
    if not log:
        print("build-classroom-segments: nothing due — nothing written")
        return 0
    if args.dry_run:
        print("build-classroom-segments: dry run — %d lesson(s) would be written" % written)
        return 0
    GS.write_text(src, encoding="utf-8")
    print("build-classroom-segments: %d lesson(s) written to %s (generation date %s)" % (written, GS.name, today))
    print("next: bump the Classroom GAS version, add the generic changelog line, run check-classroom-content.py, "
          "check-classroom-pipeline.py --base origin/main and --selftest, node --check, check-gas-inner-scripts.js")
    return 0


if __name__ == "__main__":
    sys.exit(main())

# Developed by: LightAISolutions
