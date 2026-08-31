#!/usr/bin/env python3
"""Named-project candidate scanner (schema v7 registry, Layer 2 of pin coverage).

Counts, for every watchlisted project name, how many DISTINCT dossiers mention it
(each dossier is an independently researched sighting - the corroboration signal).
Flags unregistered names at >=3 dossiers as registration candidates, mirroring how
Scraper's EdgeCandidates surface relationship candidates. Run after profile writes;
extend WATCHLIST as new names appear in agent reports or Scraper digests.

    python3 scripts/scan-project-candidates.py
"""
import json, glob, re

D = 'live-site-pages/profiler-data'
WATCHLIST = {
    'denton':          [r'Denton'],
    'new-albany':      [r'New Albany', r'Mustang'],   # multi-operator OH cluster - split before registering
    'fort-wayne':      [r'Fort Wayne'],
    'cwl1':            [r'CWL1'],
    'lebanon-in':      [r'Lebanon, Ind', r'Lebanon IN', r'Lebanon, IN'],
    'crane':           [r'Crane Clean'],
    'clinton':         [r'Clinton'],
    'polaris-forge':   [r'Polaris Forge', r'Ellendale'],
    'lake-mariner':    [r'Lake Mariner'],
    'vineland':        [r'Vineland'],
    'qts-atl2':        [r'ATL2', r'superfactory'],
    'horizon-childress': [r'Childress', r'Sweetwater'],
    'hermantown':      [r'Hermantown'],
    'beaver-dam':      [r'Beaver Dam'],
    'duane-arnold':    [r'Duane Arnold'],
    'steel-river':     [r'Steel River'],
    'sunraycer':       [r'Sunraycer', r'Lupinus'],
    'edwards-sanborn': [r'Sanborn'],
    'big-rock':        [r'Big Rock'],
    'sunzia':          [r'SunZia'],
}

def main():
    registered = {p['slug'] for p in json.load(open(f'{D}/profiler-projects.json'))['projects']}
    texts = {f.split('/')[-1].replace('.profile.json', ''): open(f).read()
             for f in glob.glob(f'{D}/*.profile.json')}
    rows = []
    for key, pats in WATCHLIST.items():
        hits = sorted(s for s, t in texts.items() if any(re.search(p, t) for p in pats))
        rows.append((len(hits), key, hits))
    for n, key, hits in sorted(rows, reverse=True):
        flag = 'REGISTER?' if n >= 3 and key not in registered else ('registered' if key in registered else '')
        print(f'{n:2d} dossiers | {key:18s} {flag:10s} | {", ".join(hits[:8])}{"…" if len(hits) > 8 else ""}')
    print(f'\n{sum(1 for n, k, _ in rows if n >= 3 and k not in registered)} unregistered candidate(s) at the >=3-dossier bar '
          f'(name collisions need a human read before registering - see PROFILER-SCHEMA.md, Named-projects registry)')

if __name__ == '__main__':
    main()
# Developed by: LightAISolutions
