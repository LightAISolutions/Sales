#!/usr/bin/env python3
"""Network schema checker — NETWORK-SCHEMA.md §14 (design plan N1, step 10).

Reads NETWORK-SCHEMA.md, Network.gs and Network.html and asserts:

  1. Enum mirrors — every enum the schema's §4 defines (relationship, stage,
     role, interaction kind, signal kind, consent) is byte-identical, in
     order, to the flat list in Network.gs AND to the grouped NW_ENUMS map in
     Network.html; the client labels match the schema's "Labels:" line where
     it gives one. The D5 stage rule's relationship set is also mirrored.
  2. Test ids — every id literal in the tests (verify-network-roles.py and
     this file) matches NW_ID_RE (^[acisdm]-[0-9a-z]{13}$).
  3. Id generation — no id-generating function in Network.gs takes a name,
     an email, a company or a date as input (§1 / D8): nwNewId_ and
     nwRandomBase36_ have no such parameter, and every nwNewId_( call passes
     a one-letter prefix literal (plus, at most, the taken-ids map).
  4. Audit rows — every auditLog( call in the PROJECT region of Network.gs
     builds its `details` argument from ids, counts and op names only (§12 /
     D9): a lexical check that no identifier or object key in the argument
     expression names a card field (name, email, phone, company, address,
     note, title, summary, body, raw extraction …). A bare identifier is
     traced to its `var x = {…}` / `x[...] = …` assignments in the same
     function.

Exit 1 on any finding, 0 when clean. No network, no Playwright.

Usage:
  python3 scripts/check-network-schema.py
"""
import re, sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SCHEMA = REPO / 'repository-information' / 'NETWORK-SCHEMA.md'
GS = REPO / 'googleAppsScripts' / 'Network' / 'Network.gs'
HTML = REPO / 'live-site-pages' / 'Network.html'
TESTS = [REPO / 'scripts' / 'verify-network-roles.py', Path(__file__).resolve()]

NW_ID_RE = re.compile(r'^[acisdm]-[0-9a-z]{13}$')
ID_LITERAL_RE = re.compile(r"""['"]([acisdm]-[0-9a-zA-Z]+)['"]""")

# schema enum name → (Network.gs flat list, Network.html NW_ENUMS key)
ENUMS = {
    'Account relationship': ('NW_RELATIONSHIPS', 'relationship'),
    'Account stage': ('NW_STAGES', 'stage'),
    'Contact role': ('NW_ROLES', 'role'),
    'Interaction kind': ('NW_INTERACTION_KINDS', 'interactionKind'),
    'Signal kind': ('NW_SIGNAL_KINDS', 'signalKind'),
    'Contact consentMarketing': ('NW_CONSENT', 'consent'),
}
# Identifiers / keys that may never appear in an auditLog details expression.
FORBIDDEN = {'name', 'fullname', 'firstname', 'lastname', 'email', 'emails', 'phone', 'phones', 'company', 'address',
             'note', 'notes', 'title', 'summary', 'body', 'raw', 'rawtext', 'extraction', 'website', 'linkedin',
             'department', 'socials', 'domain', 'hq', 'subject', 'to', 'evidence', 'contact', 'payload', 'data',
             'front', 'back', 'c', 'x', 'p', 'e'}
# Expressions that yield an id, a count or a flag whatever they are applied to —
# stripped before the identifier scan (a `.id` of anything is an id; a
# `.length`, an nwFieldCount_(…), an Object.keys(…).length or a `? 1 : 0`
# ternary is a count).
COUNT_SHAPES = [r'\b[A-Za-z_$][\w$]*\.(?:id|length|created)\b', r'\bnwFieldCount_\([^)]*\)', r'\bObject\.keys\([^)]*\)\.length',
                r'\(?\b[A-Za-z_$][\w$]*\s*\?\s*\d+\s*:\s*\d+\)?']
ALLOWED_KEYS = {'contactId', 'accountId', 'absorbedId', 'duplicateOf', 'interactionId', 'id', 'accounts', 'contacts',
                'interactions', 'fields', 'sides', 'duplicate', 'accountCreated', 'count', 'error', 'operation', 'role',
                'capability', 'op', 'ids', 'rows', 'signals', 'drafts', 'mailings', 'purged', 'retried', 'accountChanged',
                'renamed', 'tags',   # N2: nop=account logs a rename flag and the tag COUNT, never a tag
                'written', 'updated', 'rejected', 'events', 'ok'}   # B: the peer signals upsert logs three counts; eventstoday an event count + a success flag


def schema_enums(text):
    """§4 lines: **Account `relationship`** (`NW_RELATIONSHIPS`…) — `a` · `b` …  Labels: A · B …"""
    out = {}
    sec = text.split('## 4 ·', 1)[1].split('\n## ', 1)[0]
    for line in sec.splitlines():
        m = re.match(r'\*\*(Account|Contact|Interaction|Signal|Draft) `(\w+)`\*\*.*? — (.*)$', line)
        if not m:
            continue
        key, rest = m.group(1) + ' ' + m.group(2), m.group(3)
        values = re.findall(r'`([a-z][a-z0-9-]*)`', rest.split('. ', 1)[0])
        labels = None
        lm = re.search(r'Labels: (.*?)\.(?:\s|$)', rest)
        if lm:
            labels = [x.strip() for x in lm.group(1).split(' · ')]
        out[key] = (values, labels)
        # the consent enum shares a line with two others
        for extra, k2 in (('Draft `status`', 'status'), ('Signal `source`', 'source')):
            em = re.search(re.escape(extra) + r'\*\* — (.*?)(?:\.\s|$)', line)
            if em:
                out[k2] = (re.findall(r'`([a-z][a-z0-9-]*)`', em.group(1)), None)
    # `**Contact `consentMarketing`** — `yes` · `no` · `unknown` (default).` — same regex already covers it
    return out


def gs_list(gs, name):
    m = re.search(r'var ' + name + r' = (\[.*?\]);', gs, re.S)
    if not m:
        return None
    return re.findall(r"'([^']*)'", m.group(1))


def gs_stage_rel(gs):
    return gs_list(gs, 'NW_STAGE_RELATIONSHIPS')


def html_enums(html):
    m = re.search(r'var NW_ENUMS = \{(.*?)\n\};', html, re.S)
    if not m:
        return {}
    body, out = m.group(1), {}
    for gm in re.finditer(r'\n\s*(\w+): \[', body):
        args, _ = call_args(body, gm.end() - 1)   # bracket-matched: the group's own [[…], …] list
        out[gm.group(1)] = re.findall(r"\['([^']*)', '([^']*)'\]", ','.join(args))
    return out


def html_stage_rel(html):
    m = re.search(r"\[('target'|'customer'), ('target'|'customer')\]\.indexOf\(rel\.value\)", html)
    return sorted(x.strip("'") for x in m.groups()) if m else None


def project_region(gs):
    start = gs.index('// PROJECT START')
    end = gs.index('// PROJECT END', start)
    return gs[start:end], start


def call_args(src, start):
    """Split the argument list of a call whose '(' is at src[start]; returns (args, end)."""
    depth, i, args, cur, in_str, esc = 0, start, [], '', None, False
    while i < len(src):
        ch = src[i]
        if in_str:
            cur += ch
            if esc:
                esc = False
            elif ch == '\\':
                esc = True
            elif ch == in_str:
                in_str = None
        elif ch in ('"', "'"):
            in_str = ch; cur += ch
        elif ch in '([{':
            depth += 1
            if depth > 1:
                cur += ch
        elif ch in ')]}':
            depth -= 1
            if depth == 0:
                args.append(cur.strip()); return args, i
            cur += ch
        elif ch == ',' and depth == 1:
            args.append(cur.strip()); cur = ''
        else:
            cur += ch
        i += 1
    return args, i


def enclosing_function(src, pos):
    starts = [m for m in re.finditer(r'\nfunction \w+\(', src) if m.start() < pos]
    if not starts:
        return src[:pos]
    s = starts[-1].start()
    nxt = re.search(r'\nfunction \w+\(', src[pos:])
    return src[s: pos + (nxt.start() if nxt else len(src) - pos)]


def identifiers(expr):
    # strip string literals first — a string is data, not a card field reference —
    # then the id / count shapes, so only bare value references remain
    stripped = re.sub(r"'(?:[^'\\]|\\.)*'|\"(?:[^\"\\]|\\.)*\"", ' ', expr)
    for shape in COUNT_SHAPES:
        stripped = re.sub(shape, ' 0 ', stripped)
    return re.findall(r'[A-Za-z_$][A-Za-z0-9_$]*', stripped)


def check_details(expr, fn_src):
    findings = []
    exprs = [expr]
    if re.fullmatch(r'[A-Za-z_$][A-Za-z0-9_$]*', expr):
        # a bare identifier: trace its assignments in the same function
        for m in re.finditer(r'(?:var\s+)?' + re.escape(expr) + r'(\[[^\]]*\])?\s*=\s*([^;]+);', fn_src):
            exprs.append((m.group(1) or '') + ' ' + m.group(2))
    for ex in exprs:
        keys = re.findall(r'(?:^|[{,]\s*)([A-Za-z_$][A-Za-z0-9_$]*)\s*:', ex)
        for k in keys:
            if k not in ALLOWED_KEYS:
                findings.append('key %r not in the id/count allow-list' % k)
        for ident in identifiers(ex):
            if ident.lower() in FORBIDDEN and ident not in ALLOWED_KEYS:
                findings.append('identifier %r names a card field' % ident)
    return findings


def run():
    findings = []
    schema = SCHEMA.read_text(encoding='utf-8')
    gs = GS.read_text(encoding='utf-8')
    html = HTML.read_text(encoding='utf-8')
    # 1 — enum mirrors
    se = schema_enums(schema)
    he = html_enums(html)
    for key, (gs_name, html_key) in ENUMS.items():
        if key not in se:
            findings.append('schema §4 has no `%s` enum line' % key); continue
        values, labels = se[key]
        g = gs_list(gs, gs_name)
        if g != values:
            findings.append('%s: Network.gs %s = %r, schema = %r' % (key, gs_name, g, values))
        h = he.get(html_key)
        if h is None:
            findings.append('%s: Network.html NW_ENUMS has no %r group' % (key, html_key))
        else:
            if [v for v, _ in h] != values:
                findings.append('%s: Network.html NW_ENUMS.%s values = %r, schema = %r' % (key, html_key, [v for v, _ in h], values))
            if labels and [l for _, l in h] != labels:
                findings.append('%s: Network.html labels = %r, schema = %r' % (key, [l for _, l in h], labels))
    for k2, gs_name in (('status', 'NW_DRAFT_STATUS'), ('source', 'NW_SIGNAL_SOURCES')):
        if k2 in se and gs_list(gs, gs_name) != se[k2][0]:
            findings.append('%s: Network.gs %s = %r, schema = %r' % (k2, gs_name, gs_list(gs, gs_name), se[k2][0]))
    sr = gs_stage_rel(gs)
    if sorted(sr or []) != ['customer', 'target']:
        findings.append('D5 stage rule: Network.gs NW_STAGE_RELATIONSHIPS = %r, expected target · customer' % sr)
    hr = html_stage_rel(html)
    if hr != ['customer', 'target']:
        findings.append('D5 stage rule: Network.html gateStage does not test target · customer (found %r)' % hr)
    if 'STAGE_NEEDS_TARGET_OR_CUSTOMER' not in gs:
        findings.append('D5 stage rule: Network.gs save validator does not refuse a stage without target · customer')
    # N2: the same validator on both write paths — nop=save and nop=account
    # must each reach the function that throws STAGE_NEEDS_TARGET_OR_CUSTOMER.
    vm = re.search(r'function (nw\w+)\([^)]*\)\s*\{[^}]*?STAGE_NEEDS_TARGET_OR_CUSTOMER', gs)
    validator = vm.group(1) if vm else None
    if not validator:
        findings.append('D5 stage rule: no Network.gs function throws STAGE_NEEDS_TARGET_OR_CUSTOMER')
    for op, fn in (('save', 'nwSaveOp_'), ('account', 'nwAccountOp_')):
        if not re.search(r"op === '%s'" % op, gs):
            findings.append("nop=%s: handleNetworkOp_ does not dispatch op === '%s'" % (op, op)); continue
        fm = re.search(r'function %s\(' % fn, gs)
        if not fm:
            findings.append('nop=%s: Network.gs has no %s' % (op, fn)); continue
        fn_src = enclosing_function(gs, fm.start() + 9)
        reach = validator and (validator + '(' in fn_src or ('nwAccountFullFromPayload_(' in fn_src and validator + '(' in enclosing_function(gs, gs.index('function nwAccountFullFromPayload_(') + 9)))
        if not reach:
            findings.append('nop=%s: %s does not validate the account through %s (D5 stage rule)' % (op, fn, validator or 'the stage validator'))
    # 2 — test ids
    for tf in TESTS:
        for n, line in enumerate(tf.read_text(encoding='utf-8').splitlines(), 1):
            if tf == Path(__file__).resolve() and ('ID_LITERAL_RE' in line or 'NW_ID_RE' in line):
                continue
            for lit in ID_LITERAL_RE.findall(line):
                if not NW_ID_RE.match(lit):
                    findings.append('%s:%d id literal %r does not match NW_ID_RE' % (tf.name, n, lit))
    # 3 — id generation
    for fname in ('nwNewId_', 'nwRandomBase36_'):
        m = re.search(r'function ' + fname + r'\(([^)]*)\)', gs)
        if not m:
            findings.append('Network.gs has no %s' % fname); continue
        params = [p.strip() for p in m.group(1).split(',') if p.strip()]
        bad = [p for p in params if re.search(r'name|email|company|date|title|phone|text', p, re.I)]
        if bad:
            findings.append('%s takes %r — an id may never derive from a name or a date (D8)' % (fname, bad))
    for m in re.finditer(r'nwNewId_\(', gs):
        if gs[max(0, m.start() - 9):m.start()].endswith('function '):
            continue
        args, _ = call_args(gs, m.end() - 1)
        if not (args and re.fullmatch(r"'[acisdm]'", args[0])) and not (args and args[0] == 'prefix'):
            findings.append('nwNewId_ called with a non-literal prefix: %r' % (args,))
        if len(args) > 2:
            findings.append('nwNewId_ called with %d arguments: %r' % (len(args), args))
    if re.search(r'function nw\w*Id\w*_?\([^)]*\b(name|email|company|date)\b', gs, re.I):
        findings.append('an nw*Id* function takes a name / email / company / date parameter')
    # 4 — audit rows in the PROJECT region
    region, offset = project_region(gs)
    n_calls = 0
    for m in re.finditer(r'\bauditLog\(', region):
        args, _ = call_args(region, m.end() - 1)
        n_calls += 1
        if len(args) < 4:
            continue
        fn_src = enclosing_function(region, m.start())
        line = region[:m.start()].count('\n') + gs[:offset].count('\n') + 1
        for f in check_details(args[3], fn_src):
            findings.append('Network.gs:%d auditLog details: %s — %s' % (line, f, args[3][:70]))
    print('check-network-schema: %d enums, %d auditLog calls in the PROJECT region, %d test file(s)' % (len(ENUMS), n_calls, len(TESTS)))
    if findings:
        print('\nFINDINGS (%d):' % len(findings))
        for f in findings:
            print('  ✗', f)
        return 1
    print('OK — enum mirrors identical, D5 validator on both nop=save and nop=account, test ids opaque, id generation name- and date-free, audit rows ids and counts only.')
    return 0


if __name__ == '__main__':
    sys.exit(run())

# Developed by: LightAISolutions
