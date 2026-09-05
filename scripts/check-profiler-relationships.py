#!/usr/bin/env python3
"""Check the MECHANICAL invariants of every Profiler dossier's relationships[].

relationships[] is the one cross-reference surface nothing guarded until this
script existed (PROFILER-COVERAGE-PLAN.md §9.1, S2). build-profiler-graph.py
resolves slugs while it builds and warns about unregistered projects, but it
never fails, and nothing at all asked whether the two ends of a curated edge
agree on what kind of edge it is, or whether the source an edge cites is one
the dossier actually registered. This script asks exactly those questions —
four structural invariants, nothing semantic. The semantic layer (do two
dossiers contradict each other?) is check-profiler-crossrefs.py, and it
already exists; a fifth "smart" detector here would be the failure mode, not
a bonus.

    python3 scripts/check-profiler-relationships.py            # readable report
    python3 scripts/check-profiler-relationships.py --json     # machine-readable
    python3 scripts/check-profiler-relationships.py --only nvidia
    python3 scripts/check-profiler-relationships.py --pair microsoft openai
    python3 scripts/check-profiler-relationships.py --kinds reciprocal-type

Exit 0 when nothing is reported, 1 while any finding remains, 2 on a broken
input (unreadable registry, invalid accept list, no dossiers). Run it after
every profile write beside sync-profiler-registry.py, build-profiler-graph.py
and check-profiler-study.py. It NEVER edits a dossier.

THE FOUR INVARIANTS
  dangling-slug         relationships[].slug must resolve in
                        profiler-companies.json. The schema says links to
                        non-covered companies are omitted, not invented, so
                        this is a regression guard — expect zero.
  reciprocal-type       When A curates B AND B curates A, the two types must
                        be coherent inverses. `type` reads from the stating
                        side ("B is A's <type>"), so A:supplier pairs with
                        B:customer, A:investor with B:portfolio, and the
                        symmetric types partner and competitor pair with
                        themselves. A pair where either side says `other`
                        is reported: `other` makes no claim, so coherence
                        cannot be established mechanically — a human records
                        the intent on the accept list. Naively comparing the
                        two type strings reports 82 pairs on the 127-dossier
                        corpus; 67 of those are correct customer/supplier
                        inverses. The real count is 15 — see CALIBRATION.
  unregistered-source   relationships[].source, WHEN IT IS A URL, must be an
                        exact string match for a url in that dossier's own
                        sources[]. The schema allows "a URL or a label from
                        this profile's sources[]", so a bare label is never
                        flagged, and an absent source is never flagged — the
                        app derives a provisional link at render time. Only a
                        URL the dossier never registered is a finding. When a
                        sources[] url matches after normalising scheme, www,
                        trailing slash and fragment, the report says so as a
                        hint; the finding still stands, because the app
                        resolves the string exactly.
  unregistered-project  relationships[].project, when set, must resolve in
                        profiler-projects.json. build-profiler-graph.py only
                        warns; this fails.

WHAT IS DELIBERATELY NOT AN INVARIANT
  One-sidedness. 503 of the 853 entries at v04.69r had no reciprocal edge, and
  421 of those are silent in both directions — 165 of them `competitor`, where
  silence is correct (a large company has no reason to name a small rival).
  Reporting them would be the over-calling that PROFILER-COVERAGE-PLAN.md §9.2
  reason 2 declines. build-profiler-graph.py already merges one-sided edges
  into bidirectional graph edges, so nothing is lost by not flagging them.

FALSE-POSITIVE POSTURE
  These are structural invariants, so a finding is a finding. There is no
  tuning block and nothing to loosen: an exception goes on the accept list
  with a written reason (microsoft/openai and google/terawulf are genuinely
  both partner and investor), never into a weakened rule. Measured on the
  127-dossier corpus at v04.69r: 853 entries, 678 distinct pairs, 0 dangling
  slugs, 15 reciprocal-type findings, 119 unregistered-source findings
  (disposition of the 853: 517 exact url match, 119 url not in sources[],
  140 label, 77 absent). Record and method:
  repository-information/PROFILER-CROSSREF-CALIBRATION.md.

ACCEPTING A REVIEWED FINDING
  Each finding prints a 12-character id, stable across reruns as long as the
  facts it hashes do not change (the two types for reciprocal-type; the slug,
  counterparty and url for unregistered-source; and so on). Add it to
  repository-information/profiler-relationships-accepted.json:

      {"schemaVersion": 1, "accepted": [
        {"id": "3f9c2a7b1d04", "pair": "microsoft x openai",
         "why": "partner AND investor — both true", "when": "2026-09-05"}
      ]}

  Editing either side's type, or the cited url, changes the id and reopens
  the finding — which is the intended behaviour.
"""
import argparse
import hashlib
import json
import re
import signal
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DATA_DEFAULT = REPO / "live-site-pages" / "profiler-data"
ACCEPT_DEFAULT = REPO / "repository-information" / "profiler-relationships-accepted.json"
REGISTRY_NAME = "profiler-companies.json"
PROJECTS_NAME = "profiler-projects.json"

KINDS = ("dangling-slug", "reciprocal-type", "unregistered-source",
         "unregistered-project")

# ------------------------------------------------------------- invariants ---
# What B must say about A when A says B is <key>. `type` reads from the stating
# side's perspective (PROFILER-SCHEMA.md → relationships[]): "B is A's
# supplier" implies "A is B's customer". `other` is deliberately absent — it
# carries no claim, so no reciprocal can be shown coherent with it; those
# pairs are reported for a human to accept with a reason. `portfolio` is the
# schema-level inverse of `investor` (PROFILER-COVERAGE-PLAN.md §9.3); the
# schema's enum does not yet carry it, so an investor edge whose reciprocal is
# anything else is reported until the enum grows or the pair is accepted.
INVERSE = {
    "customer": "supplier",
    "supplier": "customer",
    "investor": "portfolio",
    "portfolio": "investor",
    "partner": "partner",
    "competitor": "competitor",
}
URL_RE = re.compile(r"^https?://", re.I)


# ---------------------------------------------------------------- loading ---
def fingerprint(parts):
    return hashlib.sha1("␟".join(str(p) for p in parts).encode("utf-8")).hexdigest()[:12]


def read_json(path, what):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except FileNotFoundError:
        print("ERROR %s not found at %s" % (what, path), file=sys.stderr)
        sys.exit(2)
    except ValueError as exc:
        print("ERROR %s is not valid JSON — %s" % (what, exc), file=sys.stderr)
        sys.exit(2)


def load_corpus(data_dir):
    """Every <slug>.profile.json under data_dir → {slug: profile}."""
    corpus = {}
    for path in sorted(Path(data_dir).glob("*.profile.json")):
        slug = path.name[: -len(".profile.json")]
        try:
            corpus[slug] = json.loads(path.read_text(encoding="utf-8"))
        except ValueError as exc:
            print("ERROR %s: invalid JSON — %s" % (path.name, exc),
                  file=sys.stderr)
    return corpus


def load_accepted(path):
    if not Path(path).exists():
        return {}
    blob = read_json(path, "accept list")
    return {e["id"]: e for e in blob.get("accepted", [])
            if isinstance(e, dict) and e.get("id")}


def norm_url(url):
    """Loose form used ONLY for the near-match hint, never for the verdict."""
    u = str(url or "").strip().lower()
    u = re.sub(r"^https?://", "", u)
    u = re.sub(r"^www\.", "", u)
    u = u.split("#", 1)[0]
    return u.rstrip("/")


def edges_of(profile):
    """(index, entry) for every well-formed relationships[] entry."""
    rels = profile.get("relationships")
    if not isinstance(rels, list):
        return []
    return [(i, r) for i, r in enumerate(rels) if isinstance(r, dict)]


# -------------------------------------------------------------- detectors ---
def detect_dangling(corpus, names, registry_slugs):
    out = []
    for slug in sorted(corpus):
        for i, r in edges_of(corpus[slug]):
            target = r.get("slug")
            if target in registry_slugs:
                continue
            out.append({
                "kind": "dangling-slug",
                "slug": slug, "name": names.get(slug, slug),
                "path": "relationships[%d]" % i,
                "counterparty": target,
                "type": r.get("type"),
                "note": (r.get("note") or "")[:200],
                "id": fingerprint(["slug", slug, target]),
            })
    return out


def detect_reciprocal_types(corpus, names):
    """Report every mutually-curated pair whose two types are not inverses."""
    said = {}                                   # (a, b) → [(index, type)]
    for slug in corpus:
        for i, r in edges_of(corpus[slug]):
            if r.get("slug"):
                said.setdefault((slug, r["slug"]), []).append((i, r.get("type")))
    out, naive = [], 0
    for (a, b), fwd in sorted(said.items()):
        if a >= b or (b, a) not in said:
            continue
        back = said[(b, a)]
        if {t for _, t in fwd} != {t for _, t in back}:
            naive += 1
        coherent = any(INVERSE.get(ta) == tb for _, ta in fwd for _, tb in back)
        if coherent:
            continue
        ia, ta = fwd[0]
        ib, tb = back[0]
        out.append({
            "kind": "reciprocal-type",
            "a": {"slug": a, "name": names.get(a, a), "type": ta,
                  "path": "relationships[%d]" % ia,
                  "note": (corpus[a]["relationships"][ia].get("note") or "")[:200]},
            "b": {"slug": b, "name": names.get(b, b), "type": tb,
                  "path": "relationships[%d]" % ib,
                  "note": (corpus[b]["relationships"][ib].get("note") or "")[:200]},
            "expected": "%s ↔ %s" % (ta, INVERSE.get(ta, "(no inverse defined)")),
            "id": fingerprint(["type", a, b, ta, tb]),
        })
    return out, naive


def detect_unregistered_sources(corpus, names):
    out = []
    disposition = {"url-match": 0, "url-missing": 0, "label": 0, "absent": 0}
    for slug in sorted(corpus):
        urls = {s.get("url") for s in corpus[slug].get("sources") or []
                if isinstance(s, dict)}
        loose = {norm_url(u): u for u in urls if u}
        for i, r in edges_of(corpus[slug]):
            src = r.get("source")
            if src is None or src == "":
                disposition["absent"] += 1
                continue
            if not URL_RE.match(str(src)):
                disposition["label"] += 1
                continue
            if src in urls:
                disposition["url-match"] += 1
                continue
            disposition["url-missing"] += 1
            out.append({
                "kind": "unregistered-source",
                "slug": slug, "name": names.get(slug, slug),
                "path": "relationships[%d]" % i,
                "counterparty": r.get("slug"),
                "type": r.get("type"),
                "url": src,
                "nearMatch": loose.get(norm_url(src)),
                "id": fingerprint(["source", slug, r.get("slug"), src]),
            })
    return out, disposition


def detect_unregistered_projects(corpus, names, project_slugs):
    out = []
    disposition = {"registered": 0, "unregistered": 0, "absent": 0}
    for slug in sorted(corpus):
        for i, r in edges_of(corpus[slug]):
            project = r.get("project")
            if not project:
                disposition["absent"] += 1
                continue
            if project in project_slugs:
                disposition["registered"] += 1
                continue
            disposition["unregistered"] += 1
            out.append({
                "kind": "unregistered-project",
                "slug": slug, "name": names.get(slug, slug),
                "path": "relationships[%d]" % i,
                "counterparty": r.get("slug"),
                "project": project,
                "id": fingerprint(["project", slug, r.get("slug"), project]),
            })
    return out, disposition


# --------------------------------------------------------------- reporting ---
DISPOSITION_HINT = {
    "dangling-slug":
        "X2 disposition: the counterparty is not a covered company — drop the "
        "entry (the schema says such links are omitted, not invented) or fix "
        "the slug typo. Never accept a dangling slug.",
    "reciprocal-type":
        "X2 disposition: if one side is simply wrong, correct that side's "
        "`type` (archive + profileVersion +1). If both are true at once "
        "(partner AND investor), accept the id with the reason written out.",
    "unregistered-source":
        "X2 disposition: register the url in this dossier's sources[] with the "
        "correct party tier, or replace it with an already-registered "
        "equivalent (a near match below is usually a scheme/slash variant). "
        "Accept only when neither is possible, and say why.",
    "unregistered-project":
        "X2 disposition: register the project in profiler-projects.json "
        "(PROFILER-SCHEMA.md → Named-projects registry) or drop the pin.",
}


def render_text(findings, accepted, stats, out=sys.stdout):
    def w(line=""):
        print(line, file=out)

    by_kind = {}
    for f in findings:
        by_kind.setdefault(f["kind"], []).append(f)

    for kind in KINDS:
        group = by_kind.get(kind) or []
        if not group:
            continue
        w("=" * 78)
        w("%s — %d finding(s)" % (kind.upper(), len(group)))
        w("=" * 78)
        w("  → %s" % DISPOSITION_HINT[kind])
        for f in group:
            w()
            if kind == "reciprocal-type":
                a, b = f["a"], f["b"]
                w("[%s] %s  ×  %s   %s says %s · %s says %s" %
                  (f["id"], a["name"], b["name"], a["slug"], a["type"],
                   b["slug"], b["type"]))
                w("  expected %s" % f["expected"])
                w("  %s  %s" % (a["slug"], a["path"]))
                w("      \"%s\"" % a["note"])
                w("  %s  %s" % (b["slug"], b["path"]))
                w("      \"%s\"" % b["note"])
            elif kind == "unregistered-source":
                w("[%s] %s  →  %s   (%s)" %
                  (f["id"], f["name"], f["counterparty"], f["type"]))
                w("  %s  %s" % (f["slug"], f["path"]))
                w("      url: %s" % f["url"])
                if f.get("nearMatch"):
                    w("      near match in sources[]: %s" % f["nearMatch"])
            elif kind == "unregistered-project":
                w("[%s] %s  →  %s   project: %s" %
                  (f["id"], f["name"], f["counterparty"], f["project"]))
                w("  %s  %s" % (f["slug"], f["path"]))
            else:
                w("[%s] %s  →  %s   (%s)" %
                  (f["id"], f["name"], f["counterparty"], f["type"]))
                w("  %s  %s" % (f["slug"], f["path"]))
                w("      \"%s\"" % f["note"])
        w()

    w("-" * 78)
    w("%d dossier(s), %d relationship entries, %d distinct pair(s), "
      "%d reciprocal pair(s)" % (stats["dossiers"], stats["entries"],
                                 stats["pairs"], stats["reciprocalPairs"]))
    w("reciprocal types: %d differ as strings, %d incoherent after inverse "
      "filtering" % (stats["naiveTypeMismatches"], stats["byKind"]["reciprocal-type"]))
    sd = stats["sourceDisposition"]
    w("source disposition: %d exact url match · %d url not in sources[] · "
      "%d label (allowed) · %d absent (allowed)" %
      (sd["url-match"], sd["url-missing"], sd["label"], sd["absent"]))
    pd = stats["projectDisposition"]
    w("project pins: %d registered · %d unregistered · %d unpinned" %
      (pd["registered"], pd["unregistered"], pd["absent"]))
    w("%d finding(s) reported, %d suppressed by the accept list (%d entries)"
      % (len(findings), stats["suppressed"], len(accepted)))
    if findings:
        w("Accept a reviewed finding by adding its id to %s"
          % stats["accept_path"])


def main():
    ap = argparse.ArgumentParser(
        description="Check the mechanical invariants of Profiler relationships[].")
    ap.add_argument("--data", default=str(DATA_DEFAULT),
                    help="dossier directory (default: live-site-pages/profiler-data)")
    ap.add_argument("--accept", default=str(ACCEPT_DEFAULT),
                    help="JSON file of reviewed finding ids to suppress")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--only", nargs="*", metavar="SLUG",
                    help="report only findings stated by these dossiers "
                         "(either side of a reciprocal pair); the whole corpus "
                         "is still loaded so resolution is unaffected")
    ap.add_argument("--pair", nargs=2, metavar=("SLUG", "SLUG"),
                    help="report only findings between these two dossiers")
    ap.add_argument("--kinds", nargs="*", choices=KINDS, metavar="KIND",
                    help="restrict to these finding kinds: %s" % ", ".join(KINDS))
    args = ap.parse_args()
    signal.signal(signal.SIGPIPE, signal.SIG_DFL)   # `| head` is not an error

    data = Path(args.data)
    corpus = load_corpus(data)
    if not corpus:
        print("ERROR no dossiers found under %s" % data, file=sys.stderr)
        sys.exit(2)
    registry = read_json(data / REGISTRY_NAME, "registry")
    companies = [c for c in registry.get("companies", []) if isinstance(c, dict)]
    registry_slugs = {c.get("slug") for c in companies}
    names = {c.get("slug"): c.get("name") or c.get("slug") for c in companies}
    if (data / PROJECTS_NAME).exists():
        projects = read_json(data / PROJECTS_NAME, "named-projects registry")
        project_slugs = {p.get("slug") for p in projects.get("projects", [])
                         if isinstance(p, dict)}
    else:
        print("WARN %s not found — every project pin will be reported"
              % (data / PROJECTS_NAME), file=sys.stderr)
        project_slugs = set()

    findings = detect_dangling(corpus, names, registry_slugs)
    recip, naive = detect_reciprocal_types(corpus, names)
    findings += recip
    srcs, source_disposition = detect_unregistered_sources(corpus, names)
    findings += srcs
    projs, project_disposition = detect_unregistered_projects(
        corpus, names, project_slugs)
    findings += projs

    if args.kinds:
        findings = [f for f in findings if f["kind"] in args.kinds]
    if args.only:
        want = set(args.only)
        findings = [f for f in findings
                    if want & ({f.get("slug")} | {f.get("a", {}).get("slug")}
                               | {f.get("b", {}).get("slug")})]
    if args.pair:
        want = set(args.pair)
        findings = [f for f in findings
                    if want <= ({f.get("slug"), f.get("counterparty")}
                                | {f.get("a", {}).get("slug")}
                                | {f.get("b", {}).get("slug")})]

    accepted = load_accepted(args.accept)
    kept = [f for f in findings if f["id"] not in accepted]

    pairs, reciprocal = set(), 0
    for slug in corpus:
        for _, r in edges_of(corpus[slug]):
            if r.get("slug"):
                pairs.add(frozenset((slug, r["slug"])))
    stated = {(s, r["slug"]) for s in corpus for _, r in edges_of(corpus[s])
              if r.get("slug")}
    reciprocal = sum(1 for a, b in stated if a < b and (b, a) in stated)
    by_kind = {k: 0 for k in KINDS}
    for f in kept:
        by_kind[f["kind"]] += 1
    stats = {
        "dossiers": len(corpus),
        "entries": sum(len(edges_of(p)) for p in corpus.values()),
        "pairs": len(pairs),
        "reciprocalPairs": reciprocal,
        "naiveTypeMismatches": naive,
        "sourceDisposition": source_disposition,
        "projectDisposition": project_disposition,
        "byKind": by_kind,
        "suppressed": len(findings) - len(kept),
        "accept_path": args.accept,
    }

    if args.json:
        json.dump({"schemaVersion": 1, "stats": stats, "findings": kept},
                  sys.stdout, indent=2, ensure_ascii=False)
        print()
    else:
        render_text(kept, accepted, stats)
    sys.exit(1 if kept else 0)


if __name__ == "__main__":
    main()

# Developed by: LightAISolutions
