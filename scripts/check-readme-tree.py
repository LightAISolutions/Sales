#!/usr/bin/env python3
"""Verify the README tree's page/GAS version displays against their source files.

[PC-README-TREE] #7 requires that when [PC-HTML-VERSION] #2 or [PC-GS-VERSION] #1
bumps a version, the matching `vXX.XXw` / `vXX.XXg` display in the README tree is
updated to match. That obligation lives only in #7 -- neither #1 nor #2 mentions
the tree -- so a session that bumps a `.gs` has no reason to read the rule that
tells it to update the tree, and the display silently goes stale.

It does go stale. The v05.34r audit found FIVE of eight GAS displays behind by
exactly one bump each (MasterACL, Receipts, globalacl, testauthgas1,
testauthhtml1), against zero HTML displays -- and the HTML side was clean only
because v05.33r had just swept it by hand. One bump behind, five times over, is
not a comprehension failure: the instruction is clear and was simply not read.
This script makes the rule verifiable instead of self-reported.

    python3 scripts/check-readme-tree.py           # readable report
    python3 scripts/check-readme-tree.py --json    # machine-readable
    python3 scripts/check-readme-tree.py --fix     # sync displays to source

Three problem classes are reported:
  drift    -- the tree shows a version the source file disagrees with
  missing  -- a version file exists but no tree entry links to its changelog
  orphan   -- a tree entry links to a changelog with no version file behind it

`--fix` only ever rewrites a display to match its version file, which is the
single source of truth per [PC-HTML-SOURCE] #3 and [PC-GS-VERSION] #1. It never
touches a version file, and it cannot resolve `missing` or `orphan` -- those are
structural and need a human. Exit 0 when clean, 1 when anything is reported.
"""
import argparse, glob, json, os, re, sys

README = 'README.md'
SRC = {
    'w': ('live-site-pages/html-versions/*html.version.txt', 'html.version.txt', 'html'),
    'g': ('live-site-pages/gs-versions/*gs.version.txt', 'gs.version.txt', 'gs'),
}


def sources(kind):
    pat, suffix, _ = SRC[kind]
    out = {}
    for f in glob.glob(pat):
        name = os.path.basename(f)[: -len(suffix)]
        out[name] = open(f, encoding='utf-8').read().strip().strip('|')
    return out


def displays(readme, kind):
    _, _, infix = SRC[kind]
    pat = r'([A-Za-z0-9_.-]+)%s\.changelog\.md">(v[0-9.]+%s)</a>' % (infix, kind)
    return dict(re.findall(pat, readme))


def audit(readme):
    problems = []
    for kind in ('w', 'g'):
        src, shown = sources(kind), displays(readme, kind)
        for name, want in sorted(src.items()):
            got = shown.get(name)
            if got is None:
                problems.append({'kind': kind, 'name': name, 'type': 'missing',
                                 'source': want, 'tree': None})
            elif got != want:
                problems.append({'kind': kind, 'name': name, 'type': 'drift',
                                 'source': want, 'tree': got})
        for name in sorted(set(shown) - set(src)):
            problems.append({'kind': kind, 'name': name, 'type': 'orphan',
                             'source': None, 'tree': shown[name]})
    return problems


def apply_fix(readme, problems):
    fixed = 0
    for p in problems:
        if p['type'] != 'drift':
            continue
        _, _, infix = SRC[p['kind']]
        old = '%s%s.changelog.md">%s</a>' % (p['name'], infix, p['tree'])
        new = '%s%s.changelog.md">%s</a>' % (p['name'], infix, p['source'])
        if readme.count(old) == 1:
            readme = readme.replace(old, new)
            fixed += 1
    return readme, fixed


def main():
    ap = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    ap.add_argument('--json', action='store_true', help='machine-readable output')
    ap.add_argument('--fix', action='store_true', help='sync drifted displays to source')
    args = ap.parse_args()

    readme = open(README, encoding='utf-8').read()
    problems = audit(readme)

    if args.fix and problems:
        readme, fixed = apply_fix(readme, problems)
        if fixed:
            open(README, 'w', encoding='utf-8').write(readme)
        problems = audit(readme)
        if not args.json:
            print('fixed %d drifted display(s)' % fixed)

    if args.json:
        print(json.dumps(problems, indent=1))
        return 1 if problems else 0

    counts = {}
    for p in problems:
        counts[p['type']] = counts.get(p['type'], 0) + 1
    for p in problems:
        label = {'w': 'page', 'g': 'GAS'}[p['kind']]
        if p['type'] == 'drift':
            print('  DRIFT    %-22s %-5s tree %-9s != source %s' %
                  (p['name'], label, p['tree'], p['source']))
        elif p['type'] == 'missing':
            print('  MISSING  %-22s %-5s no tree entry (source %s)' %
                  (p['name'], label, p['source']))
        else:
            print('  ORPHAN   %-22s %-5s tree shows %s, no version file' %
                  (p['name'], label, p['tree']))
    n_html = len(sources('w'))
    n_gas = len(sources('g'))
    if problems:
        print('\n%d problem(s) across %d page + %d GAS display(s): %s' % (
            len(problems), n_html, n_gas,
            ', '.join('%d %s' % (v, k) for k, v in sorted(counts.items()))))
        return 1
    print('%d page + %d GAS version display(s) match their source files — 0 findings'
          % (n_html, n_gas))
    return 0


if __name__ == '__main__':
    sys.exit(main())

# Developed by: LightAISolutions
