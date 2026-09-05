#!/usr/bin/env python3
"""Detect contradictory claims BETWEEN Profiler dossiers.

sync-profiler-registry.py reconciles a dossier against the registry,
build-profiler-graph.py resolves its relationship slugs, check-profiler-study.py
validates its study guide and check-profiler-reports.py its reports. Every one
of them checks a dossier against itself or against an index. None asks whether
two dossiers assert contradictory facts about the same thing. Step 7 of the
Profiler Command (.claude/rules/profiler-app.md, added v04.64r) requires that
reconciliation by hand on every new dossier; this script makes it verifiable
instead of self-reported, and is the only thing that reaches the pairs written
before the rule existed.

    python3 scripts/check-profiler-crossrefs.py            # readable report
    python3 scripts/check-profiler-crossrefs.py --json     # machine-readable
    python3 scripts/check-profiler-crossrefs.py --pair meta vistra
    python3 scripts/check-profiler-crossrefs.py --include-grouped

Exit 0 when nothing is reported, 1 when candidates remain. Reviewed candidates
are silenced by adding their id to repository-information/
profiler-crossref-accepted.json — see ACCEPTING below. The script NEVER edits a
dossier: it reports, and a human adjudicates under step 7's four-way
disposition. Rewriting an accurate dossier is worse than the drift.

WHAT IT DETECTS
  differing-figures  Two dossiers give different magnitudes for what looks like
                     one fact, in a shared dimension (power, energy, currency,
                     percent). Both must name the other; each figure is
                     attributed to the company name immediately preceding it;
                     figures that agree exactly, or that reconcile as component
                     and total, are dropped.
  open-question      One dossier flags something unresolved inside a bounded
                     record, names a covered company in that record, and the
                     other dossier carries an unhedged passage on the same
                     rare-anchored topic. Cheap, because the uncertainty is
                     self-declared.
  grouped-attribution (opt-in, --include-grouped) One characterisation applied
                     to two or more covered companies in a single clause. NOT a
                     contradiction detector — it surfaces the sentence shape and
                     each member's self-description for a human to check. It
                     flags accurate sentences too, which is why it is off.

WHAT IT STRUCTURALLY CANNOT DETECT
  Categorical mischaracterisation. The invenergy drift said Vistra, NRG and
  Talen were all "contracting existing fleets to data centres"; NRG's model is
  customer-funded new build. Every number was right. Detecting that requires
  reading NRG's dossier and understanding that "new build under a Project
  Development Agreement" contradicts "contracting existing fleets" — semantic
  entailment between two prose characterisations. No lexical, numeric or
  structural signal in the corpus separates that sentence from the hundreds of
  accurate peer groupings around it. --include-grouped surfaces the shape; it
  cannot judge it. This class is out of scope, and the checker scores 3 of the
  4 known cases because of it.

  Also out of scope: unit-less counts and multiples (3.4x MOIC), dates, claims
  split across dossiers that never name each other, and anything requiring an
  external source to adjudicate.

COVERAGE AND THE FALSE-POSITIVE BUDGET
  False positives are the failure mode, not false negatives: a checker nobody
  runs twice is worth nothing. Target was a review load small enough to clear in
  one sitting at better than one-in-four useful. Measured on the 127-dossier
  corpus at v04.64r: 260 mutually-mentioning pairs compared, 7 candidates
  reported, 2 of them worth acting on — 29 percent precision on a seven-item
  load, 1.4 seconds. Full method, the tuning sweep and the four-case scoring:
  repository-information/PROFILER-CROSSREF-CALIBRATION.md.

  Coverage is deliberately narrower than the corpus: mutual mention reduces the
  ~870-1,130 cross-dossier pairs to 260. A pair where only one side names the
  other is never compared. That is the price of the precision above, and it
  means this script is a floor under step 7, not a substitute for it.

ACCEPTING A REVIEWED CANDIDATE
  Each candidate prints a 12-character id, stable across reruns as long as the
  two claims do not change. Add it to the accept list to keep reruns quiet:

      {"schemaVersion": 1, "accepted": [
        {"id": "daf884f297f8", "why": "different products", "when": "2026-09-05"}
      ]}

  Editing either dossier's claim changes the id, so the candidate returns for
  review — which is the intended behaviour. Most fixes need no accept entry at
  all: stating the counterparty's figure, or saying no source reconciles the
  two, silences the finding on its own.
"""
import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
DATA_DEFAULT = REPO / "live-site-pages" / "profiler-data"
ACCEPT_DEFAULT = REPO / "repository-information" / "profiler-crossref-accepted.json"

# ---------------------------------------------------------------- tuning ---
# Every threshold that trades recall for precision lives here. The defaults
# were fitted against the four v04.64r drift cases (see MEASUREMENT below).

# How far (characters) a figure may sit from the company name it is read as
# describing. Attribution in this corpus is appositive or possessive and short:
# "Vistra (2.1 GW ...)", "Meta takes 2,609 MW", "TeraWulf's minority share for
# $85 million". A sweep at 40/60/80/120/160 kept both known figure conflicts at
# every setting; every candidate the wider windows added was a false positive,
# so the tightest setting that holds the ground truth is the default.
ATTR_WINDOW = 40
# The counterpart's name must PRECEDE the figure. "Vistra (2.1 GW ...)" and
# "TeraWulf's minority share for $85 million" attribute; "…roughly 62% with
# Schneider, Vertiv, Eaton" merely lists a company after a number that belongs
# to somebody else. Direction alone removed a third of the false positives.
ATTR_REQUIRE_PRECEDING = True

# A figure pair is a candidate only inside this relative-difference band.
# Exactly equal (0.0) is the accurate case and is never reported. Above the
# ceiling the two numbers are almost always different facts that happen to sit
# near the same company name, not two readings of one fact.
DIFF_MIN = 0.005          # 0.5% — below this, rounding, not drift
DIFF_MAX = 0.25           # 25%  — above this, assume different subjects

# Document frequency at or below which a capitalised token counts as a "rare
# anchor" — a topic both passages are demonstrably about (e.g. "Nautilus",
# "Moss Landing"). 127 dossiers in the corpus; 12 is under 10 percent.
ANCHOR_DF_MAX = 12
# A single-word anchor has to clear a harder bar than a multi-word proper noun.
ANCHOR_DF_STRICT = 4
# How far the uncertainty marker may sit from the company mention it is read as
# being about, inside one scope.
OQ_PROXIMITY = 400
# The uncertainty has to live in a bounded record — a development, a
# relationship, one judgement — not somewhere inside a 4,000-character summary
# that also happens to name the company two paragraphs away.
OQ_SCOPE_MAX = 900
# Token overlap above which the "answer" is just the same sentence restated.
# Two dossiers that both say "confirmed talks but no details finalized" agree;
# neither answers the other.
OQ_DUPLICATE_JACCARD = 0.40

# Fields that carry no cross-dossier claims. sources[] is bibliography (titles
# and URLs) and decisionMakers[] is executive career history; step 7 of the
# Profiler Command already says to skip exec-career mentions. Together they are
# ~26% of all cross-dossier mention occurrences and ~0% of the real conflicts.
SKIP_FIELDS = {"sources", "decisionMakers", "website", "domains", "slug",
               "schemaVersion", "profileVersion", "lastUpdated", "categories",
               "ticker", "legalName", "name", "shortName"}

# Sub-keys that are structural rather than prose.
SKIP_KEYS = {"photo", "url", "source", "slug", "id", "kind", "type", "status"}

# Phrases that mean the dossier ALREADY does what step 7 asks for: it states
# both readings and says nothing reconciles them. Finding one in either passage
# suppresses the figure finding — the disagreement is disclosed, not drifted.
RECONCILED_MARKERS = (
    "no source reconciles", "no public source reconciles", "does not reconcile",
    "counterparty figure", "counterparty's figure", "the two figures",
    "own release states", "own release says", "release states", "release says",
    "reported variously", "figures differ", "differs from the counterparty",
)

# Uncertainty markers for the open-question class. Deliberately narrow: these
# say "we could not resolve this", not "the company does not disclose X"
# (which is a collection gap about the subject itself and is not answerable by
# another dossier).
UNCERTAINTY_MARKERS = (
    "unresolved", "no source ties", "no source confirms", "no source identifies",
    "no source names", "no public source ties", "no public source confirms",
    "could not be confirmed", "could not confirm", "cannot be confirmed",
    "remains unclear", "is unclear whether", "it is unclear", "unclear whether",
    "not clear whether", "unknown whether", "open question", "not established",
    "no source establishes", "cannot be determined", "yet to be confirmed",
    "unconfirmed",
)

# Words that survive suffix-stripping but are far too generic to use as a
# company alias ("Available Power" -> "Available" would match prose).
DERIVED_ALIAS_BLOCK = {
    "Available", "Applied", "Prime", "Core", "Compass", "Standard", "General",
    "National", "United", "Modern", "Base", "Edge", "Vantage", "Global",
    "Digital", "Clean", "Advanced", "American", "Pacific", "Atlantic", "Summit",
    "Apex", "Element", "Origin", "Momentum", "Horizon", "Frontier", "Liberty",
    "Sunrise", "Crown", "Hunt", "Tract", "Arc", "Flex", "Bloom",
}

# Trailing tokens that may be stripped from a short name to get the form the
# corpus actually uses in prose ("Talen Energy" -> "Talen", "NRG Energy" ->
# "NRG"). Only one token is ever stripped.
STRIPPABLE_SUFFIXES = {
    "Energy", "Corporation", "Corp", "Inc", "Company", "Group", "Holdings",
    "Systems", "Solutions", "Technologies", "Platforms", "Partners", "Industries",
    "Networks", "Infrastructure", "Renewables", "International",
}

# ------------------------------------------------------- alias derivation ---
def aliases_for(profile):
    """Every surface form of a company the corpus plausibly writes.

    Sources, in order: the registry/profile `name`, the profile's own
    `shortName` (86 of 127 dossiers carry one), and at most one suffix-stripped
    derivative of the short name, because prose writes "Talen" and "NRG" where
    the schema writes "Talen Energy" and "NRG Energy".
    """
    out = []
    for key in ("shortName", "name"):
        v = profile.get(key)
        if isinstance(v, str) and v.strip():
            out.append(v.strip())
    # Legal names carry parenthetical alternates and CJK renderings; the bare
    # head of the name before any bracket or comma is the usable form.
    for v in list(out):
        head = re.split(r"[(,;·]", v)[0].strip()
        if head and head != v and len(head) >= 3:
            out.append(head)
    derived = []
    for v in out:
        parts = v.split()
        if len(parts) >= 2 and parts[-1].rstrip(".") in STRIPPABLE_SUFFIXES:
            cand = " ".join(parts[:-1]).strip()
            if (len(cand) >= 3 and cand not in DERIVED_ALIAS_BLOCK
                    and (len(cand) >= 4 or cand.isupper())):
                derived.append(cand)
    out.extend(derived)
    # Longest first so the alternation prefers "Talen Energy" over "Talen".
    seen, uniq = set(), []
    for v in sorted(out, key=len, reverse=True):
        if v.lower() not in seen:
            seen.add(v.lower())
            uniq.append(v)
    return uniq


TOKEN_RE = re.compile(r"[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*|&")


def tokenize(text):
    """(token, start, end) triples. Apostrophes and full stops are dropped, so
    "AEP's" yields AEP and "Amazon.com" yields Amazon + com — the forms the
    alias table is built from. Maximal runs mean "Talent" is one token and can
    never match the alias "Talen": grep -il talen returns 17 dossiers where the
    word-boundary, case-sensitive form returns 4.
    """
    return [(m.group(0), m.start(), m.end()) for m in TOKEN_RE.finditer(text)]


def alias_tokens(alias):
    return tuple(m.group(0) for m in TOKEN_RE.finditer(alias))


# ------------------------------------------------------ passage extraction ---
class Passage:
    """One unit of adjudicable text with the JSON path that produced it.

    `scope` is the path of the enclosing object (a relationship, a development,
    a product). Figure comparison works at leaf-string granularity so that a
    number is never attributed across a join boundary; the open-question class
    works at object granularity, because a development's uncertainty usually
    sits in `read` while the company it concerns is named in `headline`.
    """

    __slots__ = ("path", "scope", "text", "spans", "_anchors", "_rare", "_figs")

    def __init__(self, path, scope, text):
        self.path = path
        self.scope = scope
        self.text = text
        self.spans = []   # [(slug, start, end)] — filled by build_indexes
        self._anchors = None
        self._rare = None
        self._figs = None

    def anchors(self):
        if self._anchors is None:
            self._anchors = anchor_tokens(self.text)
        return self._anchors

    def rare(self, anchor_df):
        """Rare anchors, minus every company alias.

        A company name is not a topic: Meta and Vistra name each other in a
        dozen unrelated paragraphs. Only a token that is rare across the corpus
        AND is not one of the 127 companies says the two passages are about the
        same thing.
        """
        if self._rare is None:
            self._rare = {t for t in self.anchors()
                          if anchor_df.get(t, 99) <= ANCHOR_DF_MAX
                          and t not in COMPANY_ALIASES
                          and not any(w.lower() in LOWERCASED
                                      for w in t.split())}
        return self._rare

    def figures(self):
        if self._figs is None:
            self._figs = list(find_figures(self.text))
        return self._figs


def extract_passages(profile):
    """Walk a dossier and yield Passage objects for every prose leaf string."""
    out = []

    def walk(node, path, scope):
        if isinstance(node, str):
            if len(node.strip()) >= 12:
                out.append(Passage(path, scope, node))
        elif isinstance(node, list):
            for i, item in enumerate(node):
                sub = "%s[%d]" % (path, i)
                # Every list element is its own scope. Treating the whole
                # strategyRead array as one scope let an "unresolved" in
                # judgement 1 pair with a company named in judgement 6 —
                # 61 of the first 134 open-question candidates came from
                # exactly that, and none of them were real.
                walk(item, sub, sub)
        elif isinstance(node, dict):
            for k, v in node.items():
                if k in SKIP_KEYS:
                    continue
                walk(v, "%s.%s" % (path, k), scope)

    for key, val in profile.items():
        if key in SKIP_FIELDS:
            continue
        walk(val, key, key)
    return out


def group_by_scope(passages):
    """Object-level view: {scope: [Passage, ...]} preserving order."""
    scopes = {}
    for p in passages:
        scopes.setdefault(p.scope, []).append(p)
    return scopes


COMPANY_ALIASES = set()   # filled by build_indexes
LOWERCASED = set()        # tokens seen lowercase anywhere in the corpus
CAP_TOKEN_RE = re.compile(r"\b[A-Z][A-Za-z0-9\-]{2,}\b")
COMMON_CAPS = {
    "The", "This", "That", "These", "Those", "There", "They", "Their", "Its",
    "And", "But", "For", "With", "From", "Into", "Over", "Under", "After",
    "Before", "When", "Where", "While", "Both", "Each", "Only", "Also", "Not",
    "New", "Two", "Three", "One", "Four", "Five", "January", "February",
    "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December", "Note", "Company", "Group", "Phase", "Project",
    "Data", "Center", "Centre", "Energy", "Power", "Storage", "Nuclear",
    "Board", "Chief", "Executive", "President", "Vice", "Senior", "Collection",
    "High", "Moderate", "Low", "BOTTOM", "LINE", "UP", "FRONT", "Read",
}


def anchor_tokens(text):
    """Capitalised unigrams and bigrams that could name a shared topic."""
    hits = [(m.start(), m.end(), m.group(0)) for m in CAP_TOKEN_RE.finditer(text)]
    # "Oklo's" tokenises to "Oklo" once the apostrophe is out of the class, so
    # a possessive company name can no longer masquerade as a topic anchor.
    out = {t for _, _, t in hits if t not in COMMON_CAPS}
    for (s1, e1, t1), (s2, _, t2) in zip(hits, hits[1:]):
        # Only a genuine adjacency in the text, not adjacency in the hit list.
        if s2 - e1 == 1 and text[e1] == " ":
            out.add(t1 + " " + t2)
    return out

# ----------------------------------------------------------------- numbers ---
_NUM = r"(\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?)"

# Longest unit first so MWh is never shortened to MW.
POWER_UNITS = {"TW": 1e6, "GW": 1e3, "MW": 1.0, "kW": 1e-3}
ENERGY_UNITS = {"TWh": 1e6, "GWh": 1e3, "MWh": 1.0, "kWh": 1e-3}
SCALES = {"trillion": 1e6, "tn": 1e6, "billion": 1e3, "bn": 1e3, "B": 1e3,
          "million": 1.0, "mn": 1.0, "M": 1.0, "thousand": 1e-3, "k": 1e-3,
          "K": 1e-3, "": None}

POWER_RE = re.compile(_NUM + r"\s?(TWh|GWh|MWh|kWh|TW|GW|MW|kW)(?![A-Za-z])")
MONEY_RE = re.compile(
    r"(?:US)?([$€£])\s?" + _NUM
    + r"\s?(trillion|billion|million|thousand|tn|bn|mn|[BMKk])?(?![A-Za-z])")
PCT_RE = re.compile(_NUM + r"\s?(?:%|percent(?:age point)?s?\b)")


def _val(raw):
    return float(raw.replace(",", ""))


def find_figures(text):
    """Yield (start, end, dimension, normalised_value, raw) for every figure.

    Dimensions are compared only against themselves. Power normalises to MW,
    energy to MWh, money to millions of its own currency, percent to points.
    Bare counts and multiples ("3.4x MOIC") are deliberately not extracted —
    78 percent of cross-dossier mentions contain a digit, and an unscoped
    numeric comparator drowns in coincidence.
    """
    for m in POWER_RE.finditer(text):
        unit = m.group(2)
        if unit in ENERGY_UNITS:
            yield (m.start(), m.end(), "energy",
                   _val(m.group(1)) * ENERGY_UNITS[unit], m.group(0).strip())
        else:
            yield (m.start(), m.end(), "power",
                   _val(m.group(1)) * POWER_UNITS[unit], m.group(0).strip())
    for m in MONEY_RE.finditer(text):
        sym, raw, scale = m.group(1), m.group(2), m.group(3) or ""
        mult = SCALES.get(scale)
        if mult is None:
            # A bare "$400" is a share price, a per-kW cost, a headcount cost —
            # not a magnitude that can be compared with "$400 million".
            continue
        yield (m.start(), m.end(), "money:" + sym, _val(raw) * mult,
               m.group(0).strip())
    for m in PCT_RE.finditer(text):
        yield (m.start(), m.end(), "percent", _val(m.group(1)), m.group(0).strip())


def rel_diff(a, b):
    hi = max(abs(a), abs(b))
    return abs(a - b) / hi if hi else 0.0


def excerpt(text, start, end, pad=170):
    """A readable window around a span, for adjudication without opening files."""
    lo = max(0, start - pad)
    hi = min(len(text), end + pad)
    out = text[lo:hi].replace("\n", " ").strip()
    return ("…" if lo > 0 else "") + out + ("…" if hi < len(text) else "")

# ------------------------------------------------------------------ corpus ---
class Dossier:
    __slots__ = ("slug", "name", "aliases", "profile", "passages", "scopes",
                 "mentions", "anchors")

    def __init__(self, slug, profile):
        self.slug = slug
        self.name = profile.get("shortName") or profile.get("name") or slug
        self.aliases = aliases_for(profile)
        self.profile = profile
        self.passages = extract_passages(profile)
        self.scopes = group_by_scope(self.passages)
        self.mentions = {}      # other slug -> [(passage, start, end)]
        self.anchors = set()    # every capitalised anchor token in the dossier


def load_corpus(data_dir, only=None):
    """Load every <slug>.profile.json under data_dir."""
    corpus = {}
    for path in sorted(Path(data_dir).glob("*.profile.json")):
        slug = path.name[: -len(".profile.json")]
        if only and slug not in only:
            continue
        try:
            profile = json.loads(path.read_text(encoding="utf-8"))
        except ValueError as exc:
            print("ERROR %s: invalid JSON — %s" % (path.name, exc),
                  file=sys.stderr)
            continue
        corpus[slug] = Dossier(slug, profile)
    return corpus


def build_indexes(corpus):
    """Populate per-dossier mention spans and the corpus-wide anchor DF map.

    A 350-alternative regex over 6.8 MB of prose costs about three minutes; a
    first-token index over the same text costs about three seconds, which is
    the difference between a checker that gets run and one that does not.
    """
    table = {}          # first token -> [(token tuple, slug)] longest first
    COMPANY_ALIASES.clear()
    for slug, dos in sorted(corpus.items()):
        for alias in dos.aliases:
            COMPANY_ALIASES.add(alias)
            COMPANY_ALIASES.update(alias.split())
            toks = alias_tokens(alias)
            if not toks:
                continue
            table.setdefault(toks[0], []).append((toks, slug))
    for head in table:
        table[head].sort(key=lambda x: -len(x[0]))

    # A token that also appears in lower case somewhere in the corpus is an
    # ordinary word that happened to start a sentence — "BOTH", "Simultaneously",
    # "Note". Only tokens that are never lower-cased can be topic anchors.
    LOWERCASED.clear()
    for dos in corpus.values():
        for p in dos.passages:
            for w in TOKEN_RE.finditer(p.text):
                t = w.group(0)
                if t and t[0].islower():
                    LOWERCASED.add(t.lower())

    anchor_df = {}
    for slug, dos in corpus.items():
        seen_anchor = set()
        for p in dos.passages:
            toks = tokenize(p.text)
            words = [t for t, _, _ in toks]
            for i, (word, start, _) in enumerate(toks):
                cands = table.get(word)
                if not cands:
                    continue
                for seq, target in cands:
                    n = len(seq)
                    if tuple(words[i:i + n]) == seq:
                        p.spans.append((target, start, toks[i + n - 1][2]))
                        dos.mentions.setdefault(target, []).append(p)
                        break
            seen_anchor |= p.anchors()
        dos.anchors = seen_anchor
        for tok in seen_anchor:
            anchor_df[tok] = anchor_df.get(tok, 0) + 1
    return anchor_df


def attributed_to(passage, slug):
    """Figures in `passage` whose NEAREST company mention is `slug`.

    Nearest-mention attribution is what keeps the figure comparator honest.
    Meta's nuclear sentence carries six magnitudes — Constellation's 1,121 MW,
    TerraPower's 690 MW, Oklo's 1.2 GW, Vistra's 2.1 GW and 433 MW. A window
    alone pulls in four of them and manufactures four false pairs; attributing
    each figure to the company name closest to it leaves exactly the two that
    the sentence actually says about Vistra.
    """
    if not passage.spans:
        return []
    out = []
    for start, end, dim, value, raw in passage.figures():
        best, best_d = None, None
        for msl, ms, me in passage.spans:
            after = ms >= end
            d = ms - end if after else (start - me if me <= start else 0)
            d = max(d, 0)
            if best_d is None or d < best_d:
                best, best_d, best_after = msl, d, after
        if ATTR_REQUIRE_PRECEDING and best is not None and best_after:
            continue
        if best == slug and best_d is not None and best_d <= ATTR_WINDOW:
            out.append((start, end, dim, value, raw, best_d))
    return out


def nearest_per_dimension(figs):
    """Keep only the figure closest to the counterpart mention in each dimension.

    A paragraph that says "Vistra (2.1 GW existing-plant PPAs + 433 MW uprates)"
    attributes two magnitudes to Vistra, but only the first is the quantity the
    sentence is about; the second is a rider. Comparing every attributed figure
    against every attributed figure on the other side manufactures pairs like
    "433 MW of uprates" against "624 MW of storage" — same company, same unit,
    nothing to do with each other. Taking the nearest per dimension cut the
    live-corpus figure volume by roughly two thirds without losing either of
    the two known figure conflicts.
    """
    best = {}
    for f in figs:
        dim, dist = f[2], f[5]
        if dim not in best or dist < best[dim][5]:
            best[dim] = f
    return list(best.values())


def subset_sums(values, max_terms=3):
    """Every sum of up to max_terms distinct values (order-independent)."""
    out = set()
    vals = list(values)[:8]      # combinatorial guard; passages are short
    n = len(vals)
    for i in range(n):
        out.add(vals[i])
        for j in range(i + 1, n):
            out.add(vals[i] + vals[j])
            if max_terms >= 3:
                for k in range(j + 1, n):
                    out.add(vals[i] + vals[j] + vals[k])
    return out


def reconciles(v, others, tol=0.005):
    """True when v is, or is the sum of, figures the other dossier states.

    This is the arithmetic half of the "omitted component" problem. Meta's
    corrected text says 2,176 MW + 433 MW; Vistra says 2,609 MW. Those are the
    same fact and a magnitude comparator calls them 16.6 percent apart forever.
    They reconcile — 2,176 + 433 = 2,609 — so the pair is dropped. Before the
    correction Meta said 2.1 GW + 433 MW, which sums to 2,533 and reconciles
    with nothing, which is exactly why the drift was real.
    """
    for cand in subset_sums(others):
        if cand and abs(cand - v) / max(abs(cand), abs(v)) <= tol:
            return True
    return False

# --------------------------------------------------------------- detectors ---
def fingerprint(parts):
    return hashlib.sha1("␟".join(str(p) for p in parts).encode("utf-8")).hexdigest()[:12]


def _reconciled(*texts):
    """True when the disagreement is already disclosed in the prose.

    Two cases, and both mean step 7 has nothing left to ask for: the passage
    states both readings and says nothing reconciles them, or it hedges the
    figure itself ("$37.7B vs $99B figures conflict across outlets — treat as
    unresolved"). A checker that keeps flagging a disclosed disagreement is
    training its reader to ignore it.
    """
    blob = " ".join(texts).lower()
    return (any(m in blob for m in RECONCILED_MARKERS)
            or any(m in blob for m in UNCERTAINTY_MARKERS))


def detect_figures(corpus, anchor_df, require_anchor=False):
    """Class 1 — two dossiers give different magnitudes for the same fact.

    Both directions must hold before anything is compared: A must name B, and
    B must name A. Mutual mention is the cheapest available proxy for "these
    two paragraphs are about the same transaction", and it costs almost no
    recall — a dossier that discusses a counterparty's figure names the
    counterparty, and the counterparty's own dossier names it back.
    """
    findings = []
    slugs = sorted(corpus)
    for i, sa in enumerate(slugs):
        A = corpus[sa]
        for sb in slugs[i + 1:]:
            B = corpus[sb]
            a_pass = A.mentions.get(sb)
            b_pass = B.mentions.get(sa)
            if not a_pass or not b_pass:
                continue
            seen = set()
            a_figs = {pa: nearest_per_dimension(attributed_to(pa, sb))
                      for pa in dict.fromkeys(a_pass)}
            b_figs = {pb: nearest_per_dimension(attributed_to(pb, sa))
                      for pb in dict.fromkeys(b_pass)}
            # Everything either dossier says about the other, by dimension —
            # the evidence base for the agreed-value and arithmetic credits.
            # Every magnitude either dossier states ANYWHERE it talks about the
            # other — not only the attributed ones. Bloom's summary says "the
            # Oracle master agreement reaches up to 2.8 GW (up to 2.45 GW
            # earmarked ...)"; Oracle says 2.45 GW. Comparing Bloom's 2.8 from a
            # different paragraph against Oracle's 2.45 is a mis-pairing, and
            # only a dossier-wide credit sees that Bloom already states 2.45.
            # Two different credits over two different sets, deliberately.
            # EXACT agreement is checked dossier-wide — every magnitude either
            # dossier states anywhere it talks about the other. Bloom's summary
            # says "the Oracle master agreement reaches up to 2.8 GW (up to
            # 2.45 GW earmarked ...)" while the flagged pairing came from a
            # different Bloom paragraph, and only the wide set sees that Bloom
            # already states Oracle's number.
            # ARITHMETIC reconciliation is checked only over counterpart-
            # ATTRIBUTED figures. Subset sums over a wide set find coincidences:
            # run against everything Meta says near Vistra, some combination
            # lands on 2,609 and the real 2.1 GW drift disappears.
            a_any, b_any, a_attr, b_attr = {}, {}, {}, {}
            for pa in dict.fromkeys(a_pass):
                for _, _, dim, val, _ in pa.figures():
                    a_any.setdefault(dim, set()).add(round(val, 6))
                for f in attributed_to(pa, sb):
                    a_attr.setdefault(f[2], set()).add(round(f[3], 6))
            for pb in dict.fromkeys(b_pass):
                for _, _, dim, val, _ in pb.figures():
                    b_any.setdefault(dim, set()).add(round(val, 6))
                for f in attributed_to(pb, sa):
                    b_attr.setdefault(f[2], set()).add(round(f[3], 6))
            # Passage-level value sets: every magnitude either passage states,
            # attributed or not. If A's paragraph already contains B's number
            # the two dossiers agree and the near-miss the comparator found is
            # a mis-pairing — "Vistra 13.9 GW and Talen approximately 13.1 GW"
            # appears verbatim in both dossiers, and pairing 13.9 against 13.1
            # across them is an artefact, not a disagreement.
            pvals = {}
            for p_ in list(a_figs) + list(b_figs):
                d = {}
                for _, _, dim, val, _ in p_.figures():
                    d.setdefault(dim, set()).add(round(val, 6))
                pvals[p_] = d
            for pa, figs_a in a_figs.items():
                if not figs_a:
                    continue
                for pb, figs_b in b_figs.items():
                    if not figs_b:
                        continue
                    if _reconciled(pa.text, pb.text):
                        continue
                    shared = None
                    if require_anchor:
                        both = sorted(pa.rare(anchor_df) & pb.rare(anchor_df),
                                      key=len, reverse=True)
                        if not both:
                            continue
                        shared = both[0]
                    else:
                        both = sorted(pa.rare(anchor_df) & pb.rare(anchor_df),
                                      key=len, reverse=True)
                        shared = both[0] if both else None
                    for s1, e1, d1, v1, r1, _ in figs_a:
                        for s2, e2, d2, v2, r2, _ in figs_b:
                            if d1 != d2:
                                continue
                            rd = rel_diff(v1, v2)
                            if not (DIFF_MIN <= rd <= DIFF_MAX):
                                continue
                            # Agreed-value credit: if either dossier already
                            # states the other's number somewhere about this
                            # counterparty, the two are not in disagreement —
                            # the near-miss is a different quantity. This is
                            # also what makes the checker go quiet once step 7's
                            # "state both figures" remedy has been applied.
                            if (round(v2, 6) in a_any.get(d1, ())
                                    or round(v1, 6) in b_any.get(d1, ())):
                                continue
                            if (round(v2, 6) in pvals[pa].get(d1, ())
                                    or round(v1, 6) in pvals[pb].get(d1, ())):
                                continue
                            if (reconciles(v2, a_attr.get(d1, ()))
                                    or reconciles(v1, b_attr.get(d1, ()))):
                                continue
                            key = (d1, round(v1, 6), round(v2, 6))
                            if key in seen:
                                continue
                            seen.add(key)
                            findings.append({
                                "kind": "differing-figures",
                                "dimension": d1,
                                "delta_pct": round(rd * 100, 1),
                                "anchor": shared,
                                "a": {"slug": sa, "name": A.name, "path": pa.path,
                                      "value": r1, "normalised": v1,
                                      "claim": excerpt(pa.text, s1, e1)},
                                "b": {"slug": sb, "name": B.name, "path": pb.path,
                                      "value": r2, "normalised": v2,
                                      "claim": excerpt(pb.text, s2, e2)},
                                "id": fingerprint(["fig", sa, sb, pa.path, pb.path,
                                                   d1, r1, r2]),
                            })
    return findings


def build_rare_index(corpus, anchor_df):
    """{(slug, rare token): [passages]} so the open-question class does not
    rescan every dossier for every uncertain passage."""
    idx = {}
    for slug, dos in corpus.items():
        for p in dos.passages:
            for tok in p.rare(anchor_df):
                idx.setdefault((slug, tok), []).append(p)
    return idx


def jaccard(a, b):
    ta = {t.lower() for t in TOKEN_RE.findall(a) if len(t) > 3}
    tb = {t.lower() for t in TOKEN_RE.findall(b) if len(t) > 3}
    if not ta or not tb:
        return 0.0
    return len(ta & tb) / float(len(ta | tb))


def detect_open_questions(corpus, anchor_df, rare_index):
    """Class 3 — one dossier flags something unresolved that another answers.

    Cheap and high value: the uncertainty is self-declared, so there is no
    semantic judgement in the detection at all. The judgements are (a) is the
    uncertainty actually about this company — enforced by requiring the marker
    and the company mention to sit within OQ_PROXIMITY characters of each other
    inside one scope — and (b) is the other dossier's passage on the same
    topic, enforced by a rare, non-company, multi-word-or-very-rare anchor.
    """
    findings, emitted = [], set()
    for sa in sorted(corpus):
        A = corpus[sa]
        for scope, plist in A.scopes.items():
            if "[" not in scope:
                continue          # a whole summary / ecosystemRole is not a record
            joined = " ".join(p.text for p in plist)
            if len(joined) > OQ_SCOPE_MAX:
                continue
            low = joined.lower()
            marks = [(m, low.find(m)) for m in UNCERTAINTY_MARKERS if m in low]
            if not marks:
                continue
            # Company mention offsets inside the joined scope text.
            named = {}
            base = 0
            for p in plist:
                for sl, st, _ in p.spans:
                    if sl != sa:
                        named.setdefault(sl, []).append(base + st)
                base += len(p.text) + 1
            if not named:
                continue
            rare = set()
            for p in plist:
                rare |= p.rare(anchor_df)
            # A one-word anchor has to be genuinely rare; a multi-word proper
            # noun ("Moss Landing", "Comanche Peak") is specific by construction.
            rare = {t for t in rare
                    if " " in t or anchor_df.get(t, 99) <= ANCHOR_DF_STRICT}
            if not rare:
                continue
            for sb in sorted(named):
                B = corpus.get(sb)
                if B is None:
                    continue
                near = min((abs(mo - co) for _, mo in marks for co in named[sb]),
                           default=None)
                if near is None or near > OQ_PROXIMITY:
                    continue
                marker = min(marks, key=lambda mm: min(abs(mm[1] - co)
                                                       for co in named[sb]))[0]
                answers = []
                for tok in rare:
                    for p in rare_index.get((sb, tok), ()):
                        # The other dossier answers only if it is talking about
                        # THIS company (Vistra's Moss Landing relationship names
                        # Burns & McDonnell) and is not itself hedging. Two
                        # dossiers carrying the same "no details finalized" are
                        # consistent, not an unanswered question.
                        if not any(sl == sa for sl, _, _ in p.spans):
                            continue
                        if any(m in p.text.lower() for m in UNCERTAINTY_MARKERS):
                            continue
                        if jaccard(joined, p.text) >= OQ_DUPLICATE_JACCARD:
                            continue
                        answers.append((tok, p))
                if not answers:
                    continue
                # Prefer the rarest anchor, then the longest.
                answers.sort(key=lambda x: (anchor_df.get(x[0], 99), -len(x[0])))
                top = answers[:3]
                dedupe_key = (frozenset((sa, sb)), top[0][0], marker)
                if dedupe_key in emitted:
                    continue
                emitted.add(dedupe_key)
                findings.append({
                    "kind": "open-question",
                    "marker": marker,
                    "anchor": top[0][0],
                    "a": {"slug": sa, "name": A.name, "path": scope,
                          "claim": excerpt(joined, low.find(marker),
                                           low.find(marker) + len(marker),
                                           pad=300)},
                    "b": {"slug": sb, "name": B.name,
                          "path": top[0][1].path,
                          "claim": top[0][1].text[:700].replace("\n", " "),
                          "also": [p.path for _, p in top[1:]]},
                    # The claim text is part of the identity: editing either
                    # side must reopen the candidate for review, which is the
                    # contract the docstring states. Scope + marker alone would
                    # keep an accepted id valid after the passage was rewritten.
                    "id": fingerprint(["oq", sa, sb, scope, marker, top[0][0],
                                       joined, top[0][1].text]),
                })
    return findings


GROUPING_RE = re.compile(r"\b(which|that|who|all of (?:which|them)|both|each)\b")
SENT_SPLIT_RE = re.compile(r"(?<=[.;!?])\s+(?=[A-Z(])")


def detect_grouped_claims(corpus):
    """Class 4 (opt-in) — one characterisation attributed to several companies.

    This does NOT detect a contradiction. It surfaces the sentence shape that
    produced the invenergy drift: three peers swept into a single clause, of
    which one behaves differently. Verifying each member is a semantic job, so
    the script only hands the reviewer the sentence and each member's own
    self-description. It flags accurate sentences too, which is why it is off
    by default.
    """
    findings = []
    for sa in sorted(corpus):
        A = corpus[sa]
        for p in A.passages:
            if len({sl for sl, _, _ in p.spans if sl != sa}) < 2:
                continue
            for sent in SENT_SPLIT_RE.split(p.text):
                off = p.text.find(sent)
                inside = [(sl, s - off, e - off) for sl, s, e in p.spans
                          if off <= s < off + len(sent) and sl != sa]
                members = sorted({sl for sl, _, _ in inside})
                if len(members) < 2:
                    continue
                spans = sorted((s, e) for _, s, e in inside)
                if spans[-1][0] - spans[0][1] > 60:
                    continue
                tail = sent[spans[-1][1]:spans[-1][1] + 120]
                if not GROUPING_RE.search(tail):
                    continue
                findings.append({
                    "kind": "grouped-attribution",
                    "members": members,
                    "a": {"slug": sa, "name": A.name, "path": p.path,
                          "claim": sent.strip()[:600]},
                    "b": {"selfDescriptions": [
                        {"slug": m, "name": corpus[m].name,
                         "says": (corpus[m].profile.get("ecosystemRole")
                                  or corpus[m].profile.get("summary") or "")[:300]}
                        for m in members if m in corpus]},
                    "id": fingerprint(["grp", sa, p.path, ",".join(members),
                                       sent.strip()[:120]]),
                })
    return findings

# --------------------------------------------------------------- reporting ---
DISPOSITION_HINT = {
    "differing-figures":
        "step 7 disposition: `differing figures` if both readings are defensible "
        "(state both, say nothing reconciles them) · `contradicted` if one is "
        "simply wrong (revise that dossier, archive + profileVersion +1) · "
        "`accurate` if they describe different things — then accept the id.",
    "open-question":
        "step 7 disposition: `open question` — if the second passage answers the "
        "first, close it and date it in the FIRST dossier. If it does not, "
        "accept the id.",
    "grouped-attribution":
        "step 7 disposition: `contradicted` if any member does not fit the shared "
        "characterisation (revise this dossier) · `accurate` otherwise — then "
        "accept the id.",
}


def load_accepted(path):
    if not Path(path).exists():
        return {}
    try:
        blob = json.loads(Path(path).read_text(encoding="utf-8"))
    except ValueError as exc:
        print("ERROR accept list is not valid JSON — %s" % exc, file=sys.stderr)
        sys.exit(2)
    return {e["id"]: e for e in blob.get("accepted", []) if isinstance(e, dict)
            and e.get("id")}


def render_text(findings, accepted, stats, out=sys.stdout):
    def w(line=""):
        print(line, file=out)

    by_kind = {}
    for f in findings:
        by_kind.setdefault(f["kind"], []).append(f)

    for kind in ("differing-figures", "open-question", "grouped-attribution"):
        group = by_kind.get(kind) or []
        if not group:
            continue
        w("=" * 78)
        w("%s — %d candidate(s)" % (kind.upper(), len(group)))
        w("=" * 78)
        for f in group:
            w()
            a, b = f["a"], f["b"]
            if kind == "grouped-attribution":
                w("[%s] %s  ×  %s" % (f["id"], a["name"],
                                      ", ".join(f["members"])))
                w("  %s  %s" % (a["slug"], a["path"]))
                w("      \"%s\"" % a["claim"])
                for sd in b["selfDescriptions"]:
                    w("  %s says of itself:" % sd["slug"])
                    w("      \"%s\"" % sd["says"].replace("\n", " "))
            else:
                head = ("Δ %.1f%% (%s)" % (f["delta_pct"], f["dimension"])
                        if kind == "differing-figures"
                        else "marker: \"%s\"" % f["marker"])
                w("[%s] %s  ×  %s   %s" % (f["id"], a["name"], b["name"], head))
                if f.get("anchor"):
                    w("  shared topic anchor: %s" % f["anchor"])
                w("  %s  %s" % (a["slug"], a["path"]))
                if "value" in a:
                    w("      value: %s" % a["value"])
                w("      \"%s\"" % a["claim"])
                w("  %s  %s" % (b["slug"], b["path"]))
                if "value" in b:
                    w("      value: %s" % b["value"])
                w("      \"%s\"" % b["claim"])
                if b.get("also"):
                    w("      (also see: %s)" % ", ".join(b["also"]))
            w("  → %s" % DISPOSITION_HINT[kind])
        w()

    w("-" * 78)
    w("%d dossier(s), %d mutually-mentioning pair(s) compared" %
      (stats["dossiers"], stats["pairs"]))
    w("%d candidate(s) reported, %d suppressed by the accept list (%d entries)"
      % (len(findings), stats["suppressed"], len(accepted)))
    if findings:
        w("Accept a reviewed candidate by adding its id to %s"
          % stats["accept_path"])


def main():
    global DIFF_MAX
    ap = argparse.ArgumentParser(
        description="Detect contradictory claims between Profiler dossiers.")
    ap.add_argument("--data", default=str(DATA_DEFAULT),
                    help="dossier directory (default: live-site-pages/profiler-data)")
    ap.add_argument("--accept", default=str(ACCEPT_DEFAULT),
                    help="JSON file of reviewed candidate ids to suppress")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--only", nargs="*", metavar="SLUG",
                    help="restrict the corpus to these slugs (both sides)")
    ap.add_argument("--pair", nargs=2, metavar=("SLUG", "SLUG"),
                    help="report only candidates between these two dossiers")
    ap.add_argument("--include-grouped", action="store_true",
                    help="also run the opt-in grouped-attribution class")
    ap.add_argument("--require-anchor", action="store_true",
                    help="figures must additionally share a rare non-company "
                         "topic token (higher precision, and it drops the whole "
                         "omitted-component class — see LIMITS in the docstring)")
    ap.add_argument("--max-delta", type=float, default=25.0,
                    help="figure band ceiling, percent (default %.0f)" % (DIFF_MAX * 100))
    ap.add_argument("--kinds", nargs="*", default=None,
                    help="restrict to these finding kinds")
    args = ap.parse_args()
    DIFF_MAX = args.max_delta / 100.0

    corpus = load_corpus(args.data, set(args.only) if args.only else None)
    if not corpus:
        print("ERROR no dossiers found under %s" % args.data, file=sys.stderr)
        sys.exit(2)
    anchor_df = build_indexes(corpus)

    pairs = sum(1 for i, sa in enumerate(sorted(corpus))
                for sb in sorted(corpus)[i + 1:]
                if corpus[sa].mentions.get(sb) and corpus[sb].mentions.get(sa))

    findings = detect_figures(corpus, anchor_df,
                              require_anchor=args.require_anchor)
    findings += detect_open_questions(corpus, anchor_df,
                                      build_rare_index(corpus, anchor_df))
    if args.include_grouped:
        findings += detect_grouped_claims(corpus)
    if args.kinds:
        findings = [f for f in findings if f["kind"] in args.kinds]
    if args.pair:
        want = set(args.pair)
        findings = [f for f in findings
                    if want <= ({f["a"]["slug"]} | {f["b"].get("slug")}
                                | set(f.get("members") or []))]

    accepted = load_accepted(args.accept)
    kept = [f for f in findings if f["id"] not in accepted]
    stats = {"dossiers": len(corpus), "pairs": pairs,
             "suppressed": len(findings) - len(kept),
             "accept_path": args.accept}

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
