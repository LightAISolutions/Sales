var VERSION = "v01.07g";
var TITLE = "Classroom — BESS/AIDC Curriculum";
var GITHUB_OWNER  = "LightAISolutions";
var GITHUB_REPO   = "Sales";
var GITHUB_BRANCH = "main";
var FILE_PATH     = "googleAppsScripts/Classroom/Classroom.gs";
var DEPLOYMENT_ID = "AKfycbzgrjTjU_lRoMsBzH2CIjZsqXmoN9PJMqSYawhARg9FkvjmxbyX0k85X0Q6Ud9mL3gy";
var EMBED_PAGE_URL = "https://lightaisolutions.github.io/Sales/Classroom.html";

// Derive the parent page's origin from EMBED_PAGE_URL for postMessage targeting.
// postMessage calls from the GAS iframe to the parent page use this as the targetOrigin
// to restrict who can receive the messages. This is safer than "*" because it ensures
// only the intended embedding page can intercept session tokens and auth state.
// CRITICAL: .toLowerCase() is MANDATORY — browsers normalize origins to lowercase,
// but EMBED_PAGE_URL may contain mixed-case (e.g. "LightAISolutions"). Without
// toLowerCase(), the browser silently drops ALL postMessages because the targetOrigin
// doesn't match the actual lowercase origin. This exact bug (missing toLowerCase)
// broke sign-in in v02.79r and was never fixed live (the v02.80r fix never deployed
// because the auto-deploy pipeline was already broken).
var PARENT_ORIGIN = EMBED_PAGE_URL.replace(/^(https?:\/\/[^\/]+).*$/, '$1').toLowerCase();

// ══════════════
// AUTH CONFIG
// ══════════════
// Spreadsheet ID for project data (the GAS app reads/writes user data here).
// "BESS/AIDC - Audit Log" (developer-created 2026-09-02, renamed from
// "Classroom - Audit Log" once Profiler began logging into it too — one
// workbook, one tab per app). Holds ONLY audit tabs, which
// _writeAuditLogEntry/dataAuditLog create on first write.
// It is deliberately not the Master ACL spreadsheet: that file is read on
// every sign-in by every project and already carries a contention retry
// loop, so an append-heavy log does not belong in it. Note this does NOT
// become an authorization source — checkSpreadsheetAccess only consults a
// project sheet's sharing list when no Master ACL is configured, and one is.
var SPREADSHEET_ID = "16tt7n_1sEcOzLYOEOWZbkw81dva7i9zT6-1e5CTzXDk";
var SHEET_NAME     = "YOUR_SHEET_NAME";
// Master ACL spreadsheet — centralized access control for all GAS-powered pages.
// Two tabs:
//   "Access" — Row 1 = headers (Email, Role, page1, page2, ...). Rows 2+ = email in col A, role in col B, TRUE/FALSE per page.
//   "Roles"  — Row 1 = headers (Role, perm1, perm2, ...). Rows 2+ = role name in col A, TRUE/FALSE per permission.
// UI element gating is handled client-side via data-requires-permission and data-requires-role attributes on HTML elements.
// If configured, this replaces the old editor/viewer sharing-list check.
// Leave as placeholder to fall back to SPREADSHEET_ID editor/viewer check.
var MASTER_ACL_SPREADSHEET_ID = "1kG2KftqfKOeYwBCEkxRpw-QBh9s-1-Dvy31sH037UvE";
var ACL_SHEET_NAME = "Access";
var ACL_PAGE_NAME  = "Classroom";
var PORTAL_ICON    = "🎓";
var PORTAL_DESCRIPTION = "Curriculum and retention layer — taught from the Profiler and Scraper corpus.";

// Unified toggleable auth configuration (see 6-UNIFIED-TOGGLEABLE-AUTH-PATTERN.md)
// Select a preset, then apply per-project overrides.
var ACTIVE_PRESET = 'standard';     // 'standard' or 'hipaa'
var PROJECT_OVERRIDES = {
  ENABLE_DOMAIN_RESTRICTION: false,
  ALLOWED_DOMAINS: [],
  SESSION_EXPIRATION: 7200,   // default new projects to a 2-hour rolling session (overrides the preset's shorter default; absolute ceiling stays at the preset's ABSOLUTE_SESSION_TIMEOUT). The client countdown derives from this via the heartbeat's expiresIn, so no second constant is needed.
  // Audit trail (developer directive 2026-09-02, ahead of the C2 pipeline).
  // The 'standard' preset ships both loggers off; Classroom wants a record of
  // who signed in, who was denied, and who opened gated lesson material before
  // a scheduled pipeline starts authoring content on its own. Both writers
  // no-op while SPREADSHEET_ID is a placeholder, so these are inert until a
  // spreadsheet is attached — nothing to undo if that never happens.
  ENABLE_AUDIT_LOG: true,       // SessionAuditLog tab: sign-ins, failures, denials
  ENABLE_DATA_AUDIT_LOG: true,  // DataAuditLog tab: gated-lesson reads, progress writes
};

// ══════════════
// RBAC — Role-Based Access Control
// ══════════════
// Roles and permissions are read from the "Roles" tab of the centralized ACL spreadsheet.
// The "Access" tab has a "Role" column (col B) that assigns one role per user.
// UI element gating is handled client-side via data-requires-permission and data-requires-role HTML attributes.
// HIPAA: §164.308(a)(4)(ii) — access authorization based on role.

// Hardcoded fallback — used ONLY when the Roles tab is missing or unreadable.
// In normal operation, getRolesFromSpreadsheet() reads from the spreadsheet.
// Mirrors the ACL spreadsheet's Roles tab — keys are the .toLowerCase() of each
// Roles-tab row name, matching how getRolesFromSpreadsheet() normalizes them.
// Roles are permission TIERS (what a user can do), NOT job titles and NOT
// program access — per-program visibility lives in the Access tab's page columns.
// Keep this matrix in sync with the spreadsheet whenever roles are added,
// renamed, or their permissions change, so a Roles-tab outage cannot silently
// widen or narrow access.
var RBAC_ROLES_FALLBACK = {
  'developer':   ['read', 'write', 'delete', 'export', 'amend', 'admin'],
  'admin':       ['read', 'write', 'delete', 'export', 'amend', 'admin'],
  'editor':      ['read', 'write', 'export', 'amend'],
  'contributor': ['read', 'write'],
  'analyst':     ['read', 'export'],
  'viewer':      ['read'],
  'medical_director':  ['read', 'write', 'export', 'amend']
};

// Default role when ACL does not specify one (fallback access via editor/viewer list)
var RBAC_DEFAULT_ROLE = 'viewer';

// In-memory cache for the current execution (avoids repeated spreadsheet reads within a single request)
var _rbacRolesCache = null;
var _rbacRolesCacheExpiry = 0;

/**
 * Cache epoch — a counter stored in ScriptProperties that prefixes all CacheService keys.
 * Incrementing the epoch instantly orphans ALL existing cache entries (they have the old
 * prefix and will never be read again). This is a nuclear cache clear without needing to
 * know individual cache keys. The epoch is read once per execution and cached in memory.
 *
 * getEpochCache() returns a wrapper around CacheService.getScriptCache() that auto-prefixes
 * all keys with the epoch. Use this instead of CacheService.getScriptCache() directly.
 */
var _cacheEpoch = null;
function _getCacheEpoch() {
  if (_cacheEpoch !== null) return _cacheEpoch;
  _cacheEpoch = PropertiesService.getScriptProperties().getProperty('CACHE_EPOCH') || '0';
  return _cacheEpoch;
}
function getEpochCache() {
  var raw = CacheService.getScriptCache();
  var pfx = 'e' + _getCacheEpoch() + '_';
  return {
    get: function(key) { return raw.get(pfx + key); },
    put: function(key, value, ttl) { raw.put(pfx + key, value, ttl); },
    remove: function(key) { raw.remove(pfx + key); },
    removeAll: function(keys) { raw.removeAll(keys.map(function(k) { return pfx + k; })); }
  };
}

/**
 * Read roles and permissions from the "Roles" tab of the centralized ACL spreadsheet.
 * Expected layout: Row 1 = headers (Role, permission1, permission2, ...).
 *                  Rows 2+ = role name in col A, TRUE/FALSE per permission column.
 * Returns an object like { admin: ['read','write','delete',...], viewer: ['read'], ... }
 * Falls back to RBAC_ROLES_FALLBACK if the spreadsheet/tab is unavailable.
 * Results are cached in CacheService for 10 minutes and in memory for the current execution.
 */
function getRolesFromSpreadsheet() {
  // In-memory cache for same-execution reuse (avoids even CacheService overhead)
  var now = Date.now();
  if (_rbacRolesCache && now < _rbacRolesCacheExpiry) {
    return _rbacRolesCache;
  }

  var cache = getEpochCache();
  var cacheKey = 'rbac_roles_matrix';
  var cached = cache.get(cacheKey);
  if (cached) {
    try {
      _rbacRolesCache = JSON.parse(cached);
      _rbacRolesCacheExpiry = now + 60000; // 1 min in-memory
      return _rbacRolesCache;
    } catch (e) { /* fall through to spreadsheet read */ }
  }

  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  if (!hasAcl) {
    _rbacRolesCache = RBAC_ROLES_FALLBACK;
    _rbacRolesCacheExpiry = now + 60000;
    return RBAC_ROLES_FALLBACK;
  }

  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var rolesSheet = ss.getSheetByName('Roles');
    if (!rolesSheet) {
      Logger.log('RBAC: "Roles" tab not found — using hardcoded fallback');
      _rbacRolesCache = RBAC_ROLES_FALLBACK;
      _rbacRolesCacheExpiry = now + 60000;
      return RBAC_ROLES_FALLBACK;
    }

    var data = rolesSheet.getDataRange().getValues();
    if (data.length < 2) {
      _rbacRolesCache = RBAC_ROLES_FALLBACK;
      _rbacRolesCacheExpiry = now + 60000;
      return RBAC_ROLES_FALLBACK;
    }

    // Row 0 = headers: [Role, perm1, perm2, ...]
    var headers = data[0];
    var permNames = [];
    for (var c = 1; c < headers.length; c++) {
      permNames.push(String(headers[c]).trim().toLowerCase());
    }

    var roles = {};
    for (var r = 1; r < data.length; r++) {
      var roleName = String(data[r][0]).trim().toLowerCase();
      if (!roleName) continue;
      var perms = [];
      for (var p = 0; p < permNames.length; p++) {
        var val = data[r][p + 1];
        if (val === true || String(val).trim().toUpperCase() === 'TRUE') {
          perms.push(permNames[p]);
        }
      }
      roles[roleName] = perms;
    }

    // Cache for 10 minutes in CacheService
    cache.put(cacheKey, JSON.stringify(roles), 600);
    _rbacRolesCache = roles;
    _rbacRolesCacheExpiry = now + 60000;
    return roles;
  } catch (e) {
    Logger.log('RBAC: Error reading Roles tab — ' + e.message + ' — using hardcoded fallback');
    _rbacRolesCache = RBAC_ROLES_FALLBACK;
    _rbacRolesCacheExpiry = now + 60000;
    return RBAC_ROLES_FALLBACK;
  }
}

// Check if a role has a specific permission (reads from spreadsheet)
function hasPermission(role, permission) {
  var roles = getRolesFromSpreadsheet();
  var perms = roles[role];
  if (!perms) return false;
  return perms.indexOf(permission) !== -1;
}

// Validate and gate a data operation by permission.
// Throws PERMISSION_DENIED if the user's role lacks the required permission.
// Returns the user object (from validateSessionForData) on success.
function checkPermission(user, requiredPermission, operationName) {
  var role = user.role || RBAC_DEFAULT_ROLE;
  if (!hasPermission(role, requiredPermission)) {
    var roles = getRolesFromSpreadsheet();
    auditLog('security_alert', user.email, 'permission_denied', {
      operation: operationName,
      role: role,
      requiredPermission: requiredPermission,
      availablePermissions: (roles[role] || []).join(',')
    });
    throw new Error('PERMISSION_DENIED');
  }
  return user;
}

// ══════════════
// AUTH PRESETS
// ══════════════
var PRESETS = {
  standard: {
    SESSION_EXPIRATION: 3600,          // seconds — rolling session lifetime, reset by heartbeats (1hr)
    ABSOLUTE_SESSION_TIMEOUT: 28800,   // seconds — hard ceiling, never resets regardless of activity (8hr)
    ENABLE_HEARTBEAT: true,
    HEARTBEAT_INTERVAL: 300,           // seconds — how often GAS checks/extends the session when user is active (5min)
    MAX_SESSIONS_PER_USER: 1,
    OAUTH_TOKEN_LIFETIME: 3600,        // seconds — expected lifetime of the Google OAuth access token (1hr)
    OAUTH_REFRESH_BUFFER: 300,         // seconds — show "expiring soon" banner this long before token expires (5min)
    ENABLE_DOMAIN_RESTRICTION: false,
    ALLOWED_DOMAINS: [],
    ENABLE_AUDIT_LOG: false,
    AUDIT_LOG_SHEET_NAME: 'SessionAuditLog',
    AUDIT_LOG_RETENTION_YEARS: 6,
    ENABLE_HMAC_INTEGRITY: true,
    HMAC_SECRET_PROPERTY: 'HMAC_SECRET',
    ENABLE_EMERGENCY_ACCESS: false,
    EMERGENCY_ACCESS_PROPERTY: 'EMERGENCY_ACCESS_EMAILS',
    TOKEN_EXCHANGE_METHOD: 'url',
    ENABLE_CROSS_DEVICE_ENFORCEMENT: true,
    ENABLE_DATA_OP_VALIDATION: false,  // Data ops execute without session re-validation (current behavior)
    ENABLE_DOM_CLEARING_ON_EXPIRY: false,  // Auth wall overlay only (current behavior)
    ENABLE_ESCALATING_LOCKOUT: false,  // Use existing flat rate limit (5/5min)
    ENABLE_IP_LOGGING: false,          // Do not fetch or log client IP
    ENABLE_DATA_AUDIT_LOG: false,      // No per-operation audit logging (current behavior)
    DATA_AUDIT_LOG_SHEET_NAME: 'DataAuditLog'
  },
  hipaa: {
    SESSION_EXPIRATION: 900,           // seconds — rolling session lifetime, reset by heartbeats (15min)
    ABSOLUTE_SESSION_TIMEOUT: 28800,   // seconds — hard ceiling, never resets regardless of activity (8hr)
    ENABLE_HEARTBEAT: true,
    HEARTBEAT_INTERVAL: 300,           // seconds — how often GAS checks/extends the session when user is active (5min)
    MAX_SESSIONS_PER_USER: 1,
    OAUTH_TOKEN_LIFETIME: 3600,        // seconds — expected lifetime of the Google OAuth access token (1hr)
    OAUTH_REFRESH_BUFFER: 300,         // seconds — show "expiring soon" banner this long before token expires (5min)
    ENABLE_DOMAIN_RESTRICTION: true,
    ALLOWED_DOMAINS: [],
    ENABLE_AUDIT_LOG: true,
    AUDIT_LOG_SHEET_NAME: 'SessionAuditLog',
    AUDIT_LOG_RETENTION_YEARS: 6,
    ENABLE_HMAC_INTEGRITY: true,
    HMAC_SECRET_PROPERTY: 'HMAC_SECRET',
    ENABLE_EMERGENCY_ACCESS: true,
    EMERGENCY_ACCESS_PROPERTY: 'EMERGENCY_ACCESS_EMAILS',
    TOKEN_EXCHANGE_METHOD: 'postMessage',
    ENABLE_CROSS_DEVICE_ENFORCEMENT: true,
    ENABLE_DATA_OP_VALIDATION: true,   // Every google.script.run data op validates session first
    ENABLE_DOM_CLEARING_ON_EXPIRY: true,   // Destroy GAS iframe content on session expiry
    ENABLE_ESCALATING_LOCKOUT: true,   // Escalating lockout tiers (5min → 30min → 6hr)
    ENABLE_IP_LOGGING: false,          // DISABLED — ipify.org lacks BAA, violates HIPAA (Phase 3: C-3)
    ENABLE_DATA_AUDIT_LOG: true,       // Log individual data access events (reads, writes)
    DATA_AUDIT_LOG_SHEET_NAME: 'DataAuditLog'
  }
};

// ══════════════
// AUTH CONFIG RESOLUTION
// ══════════════
function resolveConfig(presetName, overrides) {
  var preset = PRESETS[presetName];
  if (!preset) {
    throw new Error('Unknown preset: ' + presetName + '. Valid presets: standard, hipaa');
  }
  var resolved = {};
  for (var key in preset) {
    if (preset.hasOwnProperty(key)) resolved[key] = preset[key];
  }
  for (var key in overrides) {
    if (overrides.hasOwnProperty(key)) resolved[key] = overrides[key];
  }
  if (presetName === 'hipaa') {
    if (resolved.ENABLE_DOMAIN_RESTRICTION &&
        (!resolved.ALLOWED_DOMAINS || resolved.ALLOWED_DOMAINS.length === 0)) {
      throw new Error('HIPAA preset with ENABLE_DOMAIN_RESTRICTION requires ALLOWED_DOMAINS — set your Workspace domain(s)');
    }
    if (resolved.SESSION_EXPIRATION > 900) {
      Logger.log('WARNING: HIPAA recommends SESSION_EXPIRATION ≤ 900s (15 min). Current: '
        + resolved.SESSION_EXPIRATION + 's');
    }
  }
  return resolved;
}

var AUTH_CONFIG = resolveConfig(ACTIVE_PRESET, PROJECT_OVERRIDES);
// ══════════════
// AUTH CONFIG END
// ══════════════

// ══════════════
// PROJECT START — Add your project-specific code here

// PROJECT: ── Role + Access matrix (Classroom v1) ─────────────────────────
// The server half of the Classroom access matrix approved at the Phase 6
// design gate (repository-information/PHASE6-CLASSROOM-DESIGN.md, 2026-08-31).
// The page hides UI per tier (CL_ROLE_CAPS in Classroom.html); these checks are
// the boundary:
//   admin       — everything, including pipeline controls and content admin
//   contributor — public tracks, guidance-derived lessons, weekly briefings
//   analyst     — public-provenance tracks, progress and study-next only
//   viewer      — NOT admitted to Classroom at all (decision 2)
// Viewer exclusion is an app-door gate rather than a per-op one: a viewer is
// turned away by clAdmitted_ before any capability is consulted. Keep this map
// in sync with CL_ROLE_CAPS in Classroom.html.
var CL_ROLE_CAPS = {
  admin:       ['tracks', 'guidance', 'briefing', 'reports', 'pipeline'],
  contributor: ['tracks', 'guidance', 'briefing'],
  analyst:     ['tracks'],
  viewer:      []
};

// PROJECT: ── Provenance gating (the rule that makes "Everything" safe) ────
// A generated lesson inherits the STRICTEST gate of its inputs. Content flows
// up the corpus into lessons, never down the access ladder — a tier that cannot
// see guidance in Profiler never sees guidance-derived material here. C1 stamps
// each lesson with the provenance of its sources; this map turns that stamp
// into the capability required to read it.
// Field notes are private Drive data under the notes-are-not-sources rule and
// can never become lesson content, so no 'note' provenance exists below — a
// lesson that ever claims one is denied to every tier rather than gated.
var CL_PROVENANCE_CAPS = {
  'public':   'tracks',    // dossiers, study guides, named projects, concepts — public Pages data
  'guidance': 'guidance',  // Industry Guidance modules — contributor+ in Profiler, same here
  'briefing': 'briefing',  // weekly "This week in BESS/AIDC" editions
  'report':   'reports'    // session-authored reports — admin-only in Profiler, same here
};
// Strictest last, so clGateForProvenance_ can fold a list of inputs to one cap.
// 'guidance' and 'briefing' are equally strict (both contributor+); the order
// between them is arbitrary and either fold answer gates identically.
var CL_PROVENANCE_STRICTNESS = ['public', 'guidance', 'briefing', 'report'];

// Collapse whatever the backend reports into one of the four known tiers. An
// unrecognised role becomes 'viewer', which is then not admitted — unknown
// fails closed rather than inheriting the reading surface.
function clRoleOf_(sess) {
  if ((((sess && sess.permissions) || [])).indexOf('admin') >= 0) return 'admin';
  var r = String((sess && sess.role) || '').toLowerCase().trim();
  return CL_ROLE_CAPS[r] ? r : 'viewer';
}
function clAdmitted_(sess) { return clRoleOf_(sess) !== 'viewer'; }
function clCan_(sess, cap) {
  if (!clAdmitted_(sess)) return false;
  return (CL_ROLE_CAPS[clRoleOf_(sess)] || []).indexOf(cap) >= 0;
}

// Fold a lesson's input provenances down to the single capability its strictest
// input demands. Returns '' when the list is empty or any entry is unknown or
// non-teachable — callers MUST treat '' as deny, never as "no gate needed".
function clGateForProvenance_(provenances) {
  var list = [].concat(provenances || []);
  if (!list.length) return '';
  var strictest = -1;
  for (var i = 0; i < list.length; i++) {
    var idx = CL_PROVENANCE_STRICTNESS.indexOf(String(list[i]).toLowerCase().trim());
    if (idx < 0) return '';
    if (idx > strictest) strictest = idx;
  }
  return CL_PROVENANCE_CAPS[CL_PROVENANCE_STRICTNESS[strictest]] || '';
}

// The gate C1's data ops call after validateSessionForData. Throws rather than
// returning false so a forgotten return value cannot serve gated content.
function clRequire_(sess, cap, operationName) {
  if (!clAdmitted_(sess)) {
    auditLog('security_alert', (sess && sess.email) || 'unknown', 'classroom_not_admitted',
      { operation: operationName || '', role: clRoleOf_(sess) });
    throw new Error('CLASSROOM_FORBIDDEN');
  }
  if (!clCan_(sess, cap)) {
    auditLog('security_alert', (sess && sess.email) || 'unknown', 'classroom_capability_denied',
      { operation: operationName || '', role: clRoleOf_(sess), capability: cap });
    throw new Error('CLASSROOM_FORBIDDEN');
  }
  return true;
}

// Convenience for C1: gate a lesson by its own provenance stamp in one call.
function clRequireLesson_(sess, provenances, operationName) {
  var cap = clGateForProvenance_(provenances);
  if (!cap) {
    auditLog('security_alert', (sess && sess.email) || 'unknown', 'classroom_bad_provenance',
      { operation: operationName || '', provenance: JSON.stringify(provenances || []) });
    throw new Error('CLASSROOM_FORBIDDEN');
  }
  return clRequire_(sess, cap, operationName);
}

// PROJECT: ── Track / lesson schema + provenance stamp (C1, schema v1) ─────
// Data-shape single source of truth: repository-information/CLASSROOM-SCHEMA.md.
// Lessons and tracks are strict-JSON object literals returned by
// clLesson<Name>_() / clTrack<Name>_() and registered in clLessons_() /
// clTracks_() below — the guidance content-in-GAS pattern, because a track
// names gated titles and a lesson's sections may carry gated material, so
// none of it may reach public Pages. scripts/check-classroom-content.py parses
// the literals straight out of this file: keep them JSON (double-quoted keys,
// no trailing commas, no expressions).
var CL_LESSON_SCHEMA_VERSION = 1;
var CL_TRACK_SCHEMA_VERSION = 1;

// The provenance stamp. Every lesson carries provenance.inputs[] — one entry
// per corpus source it was authored from: { kind, ref, date }. `ref` is a
// typed identity '<prefix>:<id>' and its prefix FIXES the kind, so a stamp is
// checked rather than trusted: an input claiming kind 'public' on a 'report:'
// ref is malformed and the lesson is denied, never gated down. Field notes have
// no prefix here on purpose (notes-are-not-sources): a 'note:' ref is unknown,
// so clStampKinds_ fails closed on it. Kinds are CL_PROVENANCE_STRICTNESS's
// vocabulary — nothing else folds.
var CL_PROVENANCE_REF_KINDS = {
  'profile':  'public',    // profile:<slug>              — a company dossier
  'study':    'public',    // study:<slug>                — a company study guide
  'project':  'public',    // project:<slug>              — a named project
  'graph':    'public',    // graph:profiler-graph        — the relationship graph
  'concepts': 'public',    // concepts:profiler-concepts  — the concepts registry
  'guidance': 'guidance',  // guidance:<module-id>        — an Industry Guidance module
  'corpus':   'briefing',  // corpus:<scraper-item-key>   — Scraper corpus material
  'briefing': 'briefing',  // briefing:<lesson-id>        — an earlier briefing edition
  'report':   'report'     // report:<report-id>          — a session-authored report
};
var CL_ID_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;
var CL_REF_RE = /^([a-z]+):([A-Za-z0-9][A-Za-z0-9._-]{0,127})$/;

// Read a lesson's stamp into the list clGateForProvenance_ folds. Returns []
// — which the gate turns into '' = deny — when the stamp is missing or empty,
// or when ANY input is malformed, carries an unknown prefix, or claims a kind
// its prefix does not carry. A stamp is either fully well-formed or it does
// not exist; there is no partial credit and no "best available" kind.
function clStampKinds_(lesson) {
  var inputs = lesson && lesson.provenance && lesson.provenance.inputs;
  if (Object.prototype.toString.call(inputs) !== '[object Array]' || !inputs.length) return [];
  var kinds = [];
  for (var i = 0; i < inputs.length; i++) {
    var inp = inputs[i] || {};
    var m = CL_REF_RE.exec(String(inp.ref || ''));
    if (!m) return [];
    var expected = CL_PROVENANCE_REF_KINDS[m[1]];
    if (!expected || String(inp.kind || '').toLowerCase().trim() !== expected) return [];
    kinds.push(expected);
  }
  return kinds;
}
// The capability a lesson's stamp demands, or '' (deny). Never stored in the
// data — derived at serve time so it cannot drift from the stamp.
function clLessonGate_(lesson) { return clGateForProvenance_(clStampKinds_(lesson)); }
// Whether this session may read this lesson. False on a bad stamp — a lesson
// is never readable by default.
function clLessonVisible_(sess, lesson) {
  var cap = clLessonGate_(lesson);
  return !!cap && clCan_(sess, cap);
}

// CONTENT START — the pipeline's write set inside this file
// Everything between this marker and // CONTENT END is the *content region*:
// the clLesson<Name>_() / clTrack<Name>_() literals and the two registries,
// and nothing else. An unattended C2 pipeline run may write here and on the
// VERSION line at the top of the file — nowhere else in this project, and
// nothing at all outside the write set of CLASSROOM-COMMITTER-CONTRACT.md §3.
// scripts/check-classroom-pipeline.py asserts a pipeline diff stays inside
// these markers (P2); scripts/check-classroom-content.py asserts no lesson or
// track literal is ever defined outside them, which is what keeps the fence an
// allowlist rather than a suggestion. Do not move a marker to admit an edit:
// the gate derivation below the fence is frozen precisely so a stamp can be
// checked rather than trusted.
// ── The first tracks, assembled from the existing corpus (C1) ─────────────
// Four public-stamped modules authored from the company study guides and the
// public concepts registry, plus one guidance-stamped module built on the BESS
// technology-fundamentals guidance analysis. Every input below is a source
// actually read while authoring — the stamp is not a citation of convenience.
// The guidance-stamped lesson folds to 'guidance', so analyst sees it only as
// a withheld count inside its track; pre-C3 the renderer turns its guidance
// input into a deep link out to Profiler's hub rather than embedding it.
// Keep these literals strict JSON — scripts/check-classroom-content.py parses
// them straight out of this file.

function clLessonCellToContainer_() {
  return {
 "schemaVersion": 1,
 "id": "cell-to-container",
 "type": "module",
 "title": "From Cell to Container",
 "short": "How a 3-volt chemistry becomes the box a developer buys by the megawatt-hour — and why every layer in between costs money.",
 "group": "Technology Foundations",
 "updated": "2026-09-01",
 "reviewBy": "2027-03-01",
 "provenance": {
  "inputs": [
   {
    "kind": "public",
    "ref": "study:catl",
    "date": "2026-08-08",
    "note": "the cell scoreboard, the assembly ladder, and the container-density argument"
   },
   {
    "kind": "public",
    "ref": "study:sungrow",
    "date": "2026-08-08",
    "note": "P=V*I, why plants run high DC voltage, and the liquid-cooling rationale"
   },
   {
    "kind": "public",
    "ref": "concepts:profiler-concepts",
    "date": "2026-08-31",
    "note": "term definitions used by the {{...}} tooltips"
   }
  ]
 },
 "tiles": [
  {
   "k": "~3.2 V",
   "v": "one LFP cell",
   "sub": "everything useful is thousands of them, wired and watched"
  },
  {
   "k": "5 numbers",
   "v": "the cell scoreboard",
   "sub": "and they fight each other — no chemistry wins all five"
  },
  {
   "k": "I²R",
   "v": "why voltage keeps climbing",
   "sub": "double the volts, quarter the loss, same power"
  },
  {
   "k": "MWh / 20 ft",
   "v": "what the buyer shops on",
   "sub": "density per footprint is a direct project-cost lever"
  }
 ],
 "glossary": [
  {
   "t": "separator",
   "d": "The thin porous film that keeps a cell's two electrodes from touching. Ions pass through it; if it fails, the electrodes short and the cell burns."
  },
  {
   "t": "SEI",
   "d": "Solid-electrolyte interphase — a parasitic layer that grows on the anode every cycle, permanently consuming a little lithium. It is the chemical reason capacity fades."
  },
  {
   "t": "cell-to-pack",
   "d": "Building a pack from large cells mounted straight into its structure, deleting the intermediate module layer and the housing that stores no energy."
  },
  {
   "t": "DC block",
   "d": "A container of batteries only, sold without the inverter. The buyer wires many DC blocks to central power-conversion skids and owns the integration."
  },
  {
   "t": "balance of system",
   "d": "Everything a plant buys that is not the generating or storing hardware itself — cabling, combiners, transformers, foundations. Often rivals the cells in cost."
  },
  {
   "t": "cycle life",
   "d": "How many full charge-discharge round trips a cell survives before its usable capacity falls to the warranty floor — conventionally about 80% of the original rating."
  }
 ],
 "sections": [
  {
   "id": "what-a-cell-is",
   "title": "What a cell actually is",
   "kind": "prose",
   "read": "3 min",
   "ps": [
    "A battery cell is a controlled chemical reaction with a wire in the way. Ions shuttle between two electrodes through a liquid electrolyte while the electrons — blocked from taking the direct route — are forced around an external circuit, where they do useful work. Charging runs the shuttle backwards. A {{separator}} keeps the electrodes apart, because electrodes touching is a short circuit, and a short circuit in a lithium cell is a fire.",
    "One cell is about 3.2 to 3.7 volts and, in grid sizes, a few hundred amp-hours. That is a torch, not a power plant. Everything useful — a vehicle pack, a grid container — is thousands of cells in series and parallel with a {{BMS}} watching every one of them for voltage and temperature. The management electronics are not an accessory; without them a large series string is a hazard.",
    "Three chemistries carry the conversation. {{NMC}} packs the most energy per kilogram, costs the most, and is the least thermally forgiving — which is why it went into long-range vehicles. {{LFP}} gives up roughly a fifth to a third of that density, drops the nickel and cobalt, tolerates far more cycles and is much harder to set alight — which is why it took nearly all of grid storage. {{sodium-ion}} swaps lithium for sodium: cheaper feedstock, excellent in deep cold, and a further density penalty, so it lands on short-duration and cold-climate duty rather than replacing LFP.",
    "Degradation is the chemistry's tax and it is charged every cycle. The {{SEI}} layer grows on the anode and takes a little lithium out of circulation forever; heat, deep discharge and hard charging all accelerate it. That is why a cell rated for 15,000 cycles and one rated for 6,000 are not the same product with different stickers — they are a 25-year asset and a 10-year asset."
   ],
   "sales": "When a buyer asks \"which chemistry\", they are usually asking \"what is my risk in year twelve\". Answer with cycle life and thermal behaviour, not with energy density."
  },
  {
   "id": "the-five-numbers",
   "title": "The scoreboard, and why it fights itself",
   "kind": "table",
   "read": "2 min",
   "intro": "Every chemistry is a different compromise among the same five numbers. No cell wins all of them, so the useful question is always *which two matter for this duty*.",
   "cols": [
    "Number",
    "What it measures",
    "Who it actually matters to"
   ],
   "rows": [
    [
     "Energy density by weight (Wh/kg)",
     "Energy per kilogram of cell",
     "Vehicles and aircraft, where mass is carried. A parked container does not care."
    ],
    [
     "Energy density by volume (Wh/L)",
     "Energy per litre of cell",
     "Anything with a fixed footprint — a car floor, a 20-foot container, a leased acre."
    ],
    [
     "Cycle life",
     "Full charge-discharge round trips before capacity fades to the warranty floor",
     "Grid owners financing a 20-year asset that cycles daily. This is the number lenders read."
    ],
    [
     "Charge rate ({{C-rate}})",
     "How fast energy goes in or out relative to capacity",
     "Fast-charging vehicles and power-duty grid work. A high rate is a materials-and-cooling claim, not a charger setting."
    ],
    [
     "Cost per kWh",
     "What the energy costs to buy",
     "Everyone — but it is set by manufacturing scale, not by chemistry alone."
    ]
   ],
   "note": "Two systems can quote the same MWh and behave nothing alike. The MWh is the tank; the other four numbers describe how long it lasts and how hard you may use it."
  },
  {
   "id": "the-assembly-ladder",
   "title": "The ladder from cell to grid",
   "kind": "prose",
   "read": "4 min",
   "ps": [
    "The classic build stacks layers: cells are welded into **modules** with sensors and cooling plates, modules stack into **racks**, and racks fill an **enclosure** with liquid cooling, fire suppression and venting. Each layer adds brackets, housing and wiring that store exactly zero energy, which is why the industry keeps deleting layers — {{cell-to-pack}} designs mount large cells directly into the structure and win back volume without changing chemistry at all.",
    "Grid storage is the same cells in a different costume. Cells go into liquid-cooled racks, racks fill a 20-foot container, and that container — the {{DC block}} — is the product a developer shops for. Downstream sits the {{PCS}}, the bidirectional inverter that turns container DC into grid-synchronised AC and back, then a medium-voltage transformer, then the substation, then the grid.",
    "Voltage discipline runs through the whole chain, and it is one equation. Power is voltage times current, and wires waste power as heat proportional to current *squared*. Move the same megawatts at twice the voltage and you need half the current and a quarter of the copper losses. That is why plants run 1,500-volt DC strings and why every generation of equipment pushes the working voltage up again.",
    "Liquid cooling won for a reason that is about ageing rather than comfort. Cells age faster when hot, and — worse — cells that age *unevenly* drift apart in behaviour until the weakest one limits the whole string. Cold plates hold every cell within a couple of degrees of its neighbours, which buys both life and the right to pack more energy into the same box. {{thermal runaway}} is the failure the rest of the fire engineering exists to contain."
   ],
   "sales": "Know which layer you are quoting. A DC-block spec sheet answers nothing about the conversion chain, and a buyer comparing a DC block against an AC block is comparing two different scopes of work."
  },
  {
   "id": "why-containers-grew",
   "title": "Why the container kept growing",
   "kind": "bars",
   "read": "2 min",
   "unit": "MWh per 20-foot footprint (class-representative)",
   "intro": "A project that needs a gigawatt-hour pays for every container it installs — foundation, cable run, crane lift, conversion skid. Density per footprint is therefore a direct cost lever, and vendors have raced on it for four years.",
   "items": [
    {
     "label": "2022 class",
     "v": 3.35,
     "sub": "the then-standard 20-foot DC block"
    },
    {
     "label": "2023 class",
     "v": 5,
     "sub": "larger cells, same footprint"
    },
    {
     "label": "2024 class",
     "v": 6.25,
     "sub": "the volume workhorse of the delivered fleet"
    },
    {
     "label": "2025+ class",
     "v": 9,
     "sub": "kilo-amp-hour-class cells, fewer parts per megawatt-hour"
    }
   ],
   "note": "Fewer, bigger cells means fewer welds and fewer connections — directionally cheaper to integrate. The honest tradeoff is thermal management and propagation behaviour, which is why fire-test data has to keep pace with the cell ladder."
  },
  {
   "id": "stationary-is-not-automotive",
   "title": "The mistake to stop making",
   "kind": "callout",
   "read": "1 min",
   "ps": [
    "Nobody weighs a grid container. Wh/kg — the number that sells a car — is close to irrelevant once the box is bolted to a concrete pad. What a storage buyer reads instead is energy per square metre of leased land, {{round-trip efficiency}}, auxiliary draw from the cooling system, safety listings, {{cycle life}}, and the shape of the degradation warranty that decides how much {{augmentation}} has to be budgeted for year ten.",
    "The same cell family sells as 1-, 2-, 4-, 6- or 8-hour storage purely by changing the ratio of energy to conversion power. Long {{duration}} means more containers per megawatt, which means cell cost dominates the bill — which is exactly the ground where cheap, long-lived chemistries win."
   ]
  },
  {
   "id": "drill",
   "title": "Flashcards",
   "kind": "flashcards",
   "read": "drill",
   "cards": [
    {
     "q": "Why does grid storage use LFP when premium EVs use NMC?",
     "a": "Stationary storage does not carry its own weight, so it trades energy density for the things it does need: cycle life, thermal stability and cost per cycle. NMC's density advantage buys vehicle range, which a container has no use for."
    },
    {
     "q": "What does the separator do, and what happens when it fails?",
     "a": "It is the porous film that lets ions pass while keeping the two electrodes from touching. If it fails, the electrodes short internally — the origin of most cell fires."
    },
    {
     "q": "Why do plants keep raising DC voltage?",
     "a": "Power = voltage x current, and losses go as current squared. Doubling voltage halves the current and quarters the resistive loss for the same power, so less copper carries more energy."
    },
    {
     "q": "What is augmentation and why is it designed in on day one?",
     "a": "Adding fresh capacity later so a faded site still meets its contracted megawatt-hours. It needs spare space, spare conversion headroom and controls that can mix old and new cells — none of which can be retrofitted into a full site."
    },
    {
     "q": "Why did liquid cooling displace air in grid containers?",
     "a": "It holds every cell within a couple of degrees of its neighbours. That slows ageing and, more importantly, keeps cells ageing *evenly* so no weak cell limits the string — which also permits more energy in the same enclosure."
    },
    {
     "q": "A container is quoted at 5 MWh. What have you not yet been told?",
     "a": "Its power rating — and therefore its duration — plus the degradation curve, the round-trip efficiency, the auxiliary draw and whether the price includes the conversion system."
    }
   ]
  },
  {
   "id": "check-yourself",
   "title": "Self-test",
   "kind": "quiz",
   "read": "5 questions",
   "items": [
    {
     "q": "A developer says footprint is their binding constraint. Which cell number matters most?",
     "c": [
      "Energy density by volume (Wh/L)",
      "Energy density by weight (Wh/kg)",
      "Charge rate (C-rate)",
      "Nominal cell voltage"
     ],
     "a": 0,
     "why": "Land is fixed and the container is a fixed box, so energy per unit volume — and ultimately per square metre of site — is what converts into fewer containers, pads and cable runs."
    },
    {
     "q": "What does a 4-hour system mean?",
     "c": [
      "It discharges at rated power for about four hours",
      "It fully charges in four hours",
      "Its cells last four times longer",
      "It has four conversion systems"
     ],
     "a": 0,
     "why": "Duration is energy divided by power. Four hours means the tank holds four hours of flow at the rated pipe size — it says nothing about charging time or cell life."
    },
    {
     "q": "Why does deleting the module layer increase pack energy without changing chemistry?",
     "c": [
      "The module housing and brackets stored no energy",
      "It raises the cell voltage",
      "It lowers the C-rate",
      "It removes the need for a BMS"
     ],
     "a": 0,
     "why": "Every intermediate layer spends weight and volume on structure. Mounting large cells straight into the pack recovers that space for active material."
    },
    {
     "q": "A vendor advertises a 12C cell. What is that mainly a claim about?",
     "c": [
      "Materials and cooling design",
      "The charger supplied with it",
      "The warranty length",
      "The cell's nominal voltage"
     ],
     "a": 0,
     "why": "Pushing ions in that fast risks plating lithium as metal on the anode and generates a lot of heat, so a high C-rate is a statement about electrode materials and thermal design, not about the power supply."
    },
    {
     "q": "Two 20-foot containers both quote 5 MWh. What most plausibly differs in project cost?",
     "c": [
      "Everything around them — pads, cabling, conversion, land per MWh",
      "The chemistry of the electrolyte",
      "The colour of the enclosure",
      "The nominal grid frequency"
     ],
     "a": 0,
     "why": "Balance-of-system costs scale with the number of installed units and the site area they occupy, and they routinely rival the cells themselves."
    }
   ]
  }
 ]
};
}

function clLessonDurationDegradation_() {
  return {
 "schemaVersion": 1,
 "id": "duration-and-degradation",
 "type": "module",
 "title": "Duration, Degradation, and the Twenty-Year Promise",
 "short": "Power and energy are two different numbers. What each one buys, how capacity fades, and what a vendor is actually guaranteeing.",
 "group": "Technology Foundations",
 "updated": "2026-09-01",
 "reviewBy": "2027-03-01",
 "provenance": {
  "inputs": [
   {
    "kind": "public",
    "ref": "study:fluence",
    "date": "2026-08-08",
    "note": "the DC-block / AC-block split, the project cast, augmentation and synthetic inertia"
   },
   {
    "kind": "public",
    "ref": "study:tesla",
    "date": "2026-08-08",
    "note": "power-versus-energy framing, revenue stacking, merchant versus contracted"
   },
   {
    "kind": "public",
    "ref": "concepts:profiler-concepts",
    "date": "2026-08-31",
    "note": "term definitions used by the {{...}} tooltips"
   }
  ]
 },
 "tiles": [
  {
   "k": "MW vs MWh",
   "v": "pipe vs tank",
   "sub": "duration = energy / power, and it decides the job"
  },
  {
   "k": "~80%",
   "v": "the warranty floor",
   "sub": "cycle-life ratings are quoted down to it, not to zero"
  },
  {
   "k": "year 10",
   "v": "when augmentation lands",
   "sub": "the headroom for it is a day-one design choice"
  },
  {
   "k": "milliseconds",
   "v": "why batteries win ancillary",
   "sub": "paid for readiness, not only for energy delivered"
  }
 ],
 "glossary": [
  {
   "t": "state of charge",
   "d": "How full the battery is right now, as a percentage of usable capacity. The control system holds it inside limits that protect both safety and warranty."
  },
  {
   "t": "AC block",
   "d": "A storage product delivered with its inverter included, arriving as grid-ready AC. The vendor owns the performance of the whole conversion chain."
  },
  {
   "t": "commissioning",
   "d": "The handover gate: every subsystem configured and tested against contract specification before commercial operation. The meter only starts earning afterwards."
  },
  {
   "t": "revenue stacking",
   "d": "Running one battery across several markets in the same period — frequency response in the afternoon, arbitrage in the evening, capacity all month."
  },
  {
   "t": "synthetic inertia",
   "d": "Programming an inverter to imitate the stabilising response a spinning generator gives a grid for free, so a grid full of inverters keeps its frequency steady."
  },
  {
   "t": "cycle life",
   "d": "How many full charge-discharge round trips a cell survives before usable capacity reaches the warranty floor."
  }
 ],
 "sections": [
  {
   "id": "power-and-energy",
   "title": "Two numbers, not one",
   "kind": "prose",
   "read": "3 min",
   "ps": [
    "Every storage system is described by two independent numbers, and confusing them is the most common mistake a newcomer makes. **Power** — megawatts — is how fast the system can push or pull. It is the size of the pipe, and it is set by the {{PCS}}. **Energy** — megawatt-hours — is how much it holds. It is the size of the tank, and it is set by the cells.",
    "{{Duration}} is simply energy divided by power. A 20 MWh system with a 5 MW conversion rating is a four-hour system: it delivers 5 MW for four hours. The same cells behind a 10 MW conversion rating would be a two-hour system instead. Nothing about the chemistry changed — the ratio did.",
    "Duration decides which jobs the asset can take. Short duration suits fast, frequent, shallow work: correcting grid frequency second by second, standing ready as reserve. Long duration suits shifting bulk energy — charging on a midday solar glut and discharging into the evening peak. As solar penetration rises the market keeps asking for longer durations, because the surplus it must absorb keeps getting wider.",
    "Batteries respond in milliseconds, which is faster than any turbine can physically move. That is why they earn disproportionately in the markets that pay for *response* rather than for energy — and why a battery's revenue is a portfolio rather than a single line."
   ],
   "sales": "Never quote MWh alone. A megawatt-hour figure without its power rating describes a tank with no stated tap."
  },
  {
   "id": "what-duration-buys",
   "title": "What each duration class is for",
   "kind": "table",
   "read": "2 min",
   "cols": [
    "Duration",
    "Typical duty",
    "What decides the economics"
   ],
   "rows": [
    [
     "Under 1 hour",
     "Frequency response and fast reserve — being paid to stand ready",
     "Conversion power and response speed. Cell energy is almost incidental, so cost per MW dominates."
    ],
    [
     "1–2 hours",
     "Peak shaving, ramp smoothing, capacity obligations",
     "A balance: enough energy to cover the peak, enough power to be useful between peaks."
    ],
    [
     "4 hours",
     "The workhorse shifting duty — charge on midday solar, discharge into the evening",
     "Cell cost per kWh and the degradation curve, because the asset cycles deeply every single day."
    ],
    [
     "6–8 hours and beyond",
     "Bulk shifting on high-renewable grids; long-duration contracts",
     "Almost entirely cell cost and {{cycle life}} — more containers per MW means the chemistry bill dominates."
    ]
   ],
   "note": "These are different products, not one product throttled. Duration is chosen at design time by the energy-to-power ratio, and the container count, land area and conversion scope all move with it."
  },
  {
   "id": "the-fade",
   "title": "How the promise is written",
   "kind": "prose",
   "read": "4 min",
   "ps": [
    "Capacity fades with use, and the vendor's degradation curve is a commitment about how fast. Ratings are quoted down to a floor — conventionally around 80% of original capacity — not to zero, because a contract that needs a fixed number of megawatt-hours stops being satisfied long before the cells stop working.",
    "That is what {{augmentation}} is for: adding fresh capacity partway through life so a faded site still delivers its contracted energy. It sounds like a maintenance decision, but it is a design decision. Augmentation needs physical space, spare conversion and cabling headroom, and controls willing to mix new cells with aged ones. None of that can be added to a site that was built full.",
    "This is why the degradation curve gets more scrutiny than almost any other line on the sheet. The financial model — the pro forma the lenders underwrite — is built directly on it, and an independent engineer will test the revenue assumptions against the warranty envelope rather than against the marketing headline. A curve that is optimistic by two points a year moves an augmentation event forward by years.",
    "The control layer is what keeps the promise honest in operation. An energy management system watches every rack's temperature and {{state of charge}}, enforces the safety and warranty limits, and executes dispatch. Cycling harder earns more today and ages the asset measurably faster, so the optimiser is always trading present revenue against a warranty it must not breach."
   ],
   "sales": "The warranty curve and the augmentation path are where the second decade of the deal is won. Lead with them; they are the questions the lender is going to ask anyway."
  },
  {
   "id": "block-architecture",
   "title": "Where the inverter sits",
   "kind": "proscons",
   "read": "3 min",
   "intro": "Batteries are DC and the grid is AC, so every site needs conversion. *Where that conversion sits* defines the two architectures on the market — and defines who owns the integration risk.",
   "cards": [
    {
     "t": "DC block",
     "meta": "Container of batteries only; conversion bought separately",
     "adv": [
      "Lowest cost per delivered megawatt-hour of hardware",
      "Buyer can select conversion vendors independently and standardise across sites",
      "Central conversion skids can be sized and maintained as their own fleet"
     ],
     "dis": [
      "The buyer, or their engineering firm, owns the integration and its risk",
      "Performance guarantees stop at the container boundary — nobody warrants the whole chain",
      "More field-installed cable and connection points, each one labour and a potential fault"
     ]
    },
    {
     "t": "AC block",
     "meta": "Conversion included; delivers grid-ready AC — the vendor warrants the whole chain",
     "adv": [
      "One vendor warrants the entire conversion chain end to end",
      "Far less site engineering; each block is independent and factory-testable",
      "Faster to commission, which pulls revenue forward"
     ],
     "dis": [
      "Higher unit price for the same stored energy",
      "Conversion vendor choice is made for you",
      "A small efficiency cost relative to sharing large central inverters"
     ]
    }
   ],
   "note": "Neither is the right answer in general. The question is who in the deal is best placed to carry integration risk — and whether that party is being paid for it."
  },
  {
   "id": "how-the-plant-earns",
   "title": "How the asset actually earns",
   "kind": "prose",
   "read": "3 min",
   "ps": [
    "There are three income shapes. **Energy arbitrage** pays for megawatt-hours moved from cheap hours to expensive ones. **Ancillary services** pay for being ready — correcting frequency within seconds, holding reserve. **Capacity** pays for being reliably available at system peak, whether or not the asset is called.",
    "{{Revenue stacking}} means running the same battery across all three in the same month without violating its {{state of charge}} limits or its warranty cycle budget. Bids go into wholesale markets every few minutes against price forecasts, which is far beyond human pace — the trading software is not a convenience, it is the revenue.",
    "The commercial split follows. A **contracted** battery earns a fixed toll — a capacity payment or a utility offtake agreement — and its returns are predictable and financeable. A **merchant** battery keeps whatever its forecasting and bidding extract from volatile prices: bigger upside, and entirely dependent on software quality.",
    "One physics job is worth knowing because it keeps appearing in tenders. Grids historically got stability free from the spinning mass of large generators resisting frequency change. As that mass retires, inverter-based storage can be programmed to imitate the response — {{synthetic inertia}} — and to damp oscillations on long transmission lines. Storage sited to relieve a congested line is sometimes sold as a virtual power line rather than as a generator at all."
   ]
  },
  {
   "id": "drill",
   "title": "Flashcards",
   "kind": "flashcards",
   "read": "drill",
   "cards": [
    {
     "q": "A system is 40 MWh and 10 MW. What is its duration, and what is that good for?",
     "a": "Four hours. That is the workhorse shifting duty — charge on a midday surplus, discharge across the evening peak — where cell cost and the degradation curve dominate the economics."
    },
    {
     "q": "Why is cycle life quoted to about 80% of capacity rather than to failure?",
     "a": "Because the contract needs a fixed number of megawatt-hours. Once capacity falls below what the contract accepts, the asset has failed commercially long before the cells stop working."
    },
    {
     "q": "Why can augmentation not be retrofitted into a full site?",
     "a": "It needs space, conversion and cabling headroom, and controls able to mix aged and new cells. All three are decided when the site is designed, not when the capacity runs short."
    },
    {
     "q": "What is the real difference between a DC block and an AC block?",
     "a": "Who owns integration risk. A DC block leaves the conversion chain to the buyer; an AC block arrives grid-ready with one vendor warranting the whole path."
    },
    {
     "q": "Why do batteries earn disproportionately in ancillary markets?",
     "a": "They respond in milliseconds — faster than any rotating machine — and those markets pay for speed and readiness rather than for energy delivered."
    },
    {
     "q": "What does the energy management system trade off every day?",
     "a": "Revenue now against warranty later. Deeper, harder cycling earns more today and measurably ages the cells, so dispatch is optimised inside state-of-charge and cycle-budget limits."
    }
   ]
  },
  {
   "id": "check-yourself",
   "title": "Self-test",
   "kind": "quiz",
   "read": "5 questions",
   "items": [
    {
     "q": "The same battery cells are put behind twice as much conversion power. What changes?",
     "c": [
      "Duration halves; stored energy is unchanged",
      "Stored energy doubles",
      "Cycle life doubles",
      "Round-trip efficiency doubles"
     ],
     "a": 0,
     "why": "Duration is energy divided by power. Widening the pipe empties the same tank in half the time — it does not add energy."
    },
    {
     "q": "Which number does a lender scrutinise hardest on a 20-year storage asset?",
     "c": [
      "The degradation curve",
      "The container's paint specification",
      "Energy density in Wh/kg",
      "The number of MPPT channels"
     ],
     "a": 0,
     "why": "The financial model is built on how much capacity remains each year. An optimistic curve moves the augmentation spend and breaks the pro forma."
    },
    {
     "q": "A merchant battery differs from a contracted one mainly in that it:",
     "c": [
      "Earns whatever forecasting and bidding extract from volatile prices",
      "Uses a different battery chemistry",
      "Cannot provide frequency response",
      "Is exempt from commissioning"
     ],
     "a": 0,
     "why": "Contracted assets earn a fixed toll and are easy to finance. Merchant assets keep the volatility — upside and downside both — which makes the trading software the differentiator."
    },
    {
     "q": "Why does revenue stacking need software rather than a schedule?",
     "c": [
      "Bids are re-optimised every few minutes against forecasts and warranty limits",
      "Regulators require a software vendor",
      "Batteries cannot be dispatched manually at all",
      "It reduces the cell count"
     ],
     "a": 0,
     "why": "Prices move on a five-minute cadence, and every bid has to respect state-of-charge and cycle-budget constraints simultaneously. That is an optimisation problem, not a timetable."
    },
    {
     "q": "What is synthetic inertia for?",
     "c": [
      "Imitating the stabilising response retiring spinning generators used to provide",
      "Increasing the container's energy density",
      "Reducing the cost of the transformer",
      "Extending warranty cycle counts"
     ],
     "a": 0,
     "why": "Grids leaned on the physical mass of large turbines to resist frequency change. Inverters can be programmed to reproduce that response as those machines retire."
    }
   ]
  }
 ]
};
}

function clLessonSpecSheet_() {
  return {
 "schemaVersion": 1,
 "id": "spec-sheet-decoded",
 "type": "module",
 "title": "The Spec Sheet, Decoded",
 "short": "Every line on a grid-BESS container spec sheet, what it plainly means, and the question the buyer is really asking.",
 "group": "Technology Foundations",
 "updated": "2026-09-01",
 "reviewBy": "2027-02-24",
 "provenance": {
  "inputs": [
   {
    "kind": "guidance",
    "ref": "guidance:bess-tech-fundamentals-2026-08",
    "date": "2026-08-24",
    "note": "the spec-sheet decode table, the cell ladder, and the certification vocabulary"
   },
   {
    "kind": "public",
    "ref": "study:sungrow",
    "date": "2026-08-08",
    "note": "worked example of one vendor's conversion and container line"
   },
   {
    "kind": "public",
    "ref": "concepts:profiler-concepts",
    "date": "2026-08-31",
    "note": "term definitions used by the {{...}} tooltips"
   }
  ]
 },
 "tiles": [
  {
   "k": "8 lines",
   "v": "decide the deal",
   "sub": "the rest of the sheet is context"
  },
  {
   "k": "280 → 1300 Ah",
   "v": "the cell ladder",
   "sub": "fewer, larger cells per megawatt-hour"
  },
  {
   "k": "≥95%",
   "v": "round-trip, DC side",
   "sub": "every lost point is energy bought twice"
  },
  {
   "k": "test method",
   "v": "not a certification",
   "sub": "UL 9540A has no pass or fail"
  }
 ],
 "glossary": [
  {
   "t": "cycle life",
   "d": "How many full charge-discharge round trips a cell survives before usable capacity reaches the warranty floor — conventionally about 80% of the original rating."
  },
  {
   "t": "state of health",
   "d": "Remaining usable capacity as a percentage of the original rating — the running score the degradation warranty is written against."
  },
  {
   "t": "derating",
   "d": "Operating below rated power or energy because a condition — usually temperature — is outside the window the equipment was designed for."
  },
  {
   "t": "footprint density",
   "d": "Energy delivered per square metre of occupied site. The stationary industry's answer to the vehicle industry's energy-per-kilogram."
  },
  {
   "t": "UL 1973",
   "d": "A certification listing covering cells, modules and racks — the component level of the battery safety file."
  },
  {
   "t": "UL 9540",
   "d": "The certification listing covering a complete integrated energy storage system, and the umbrella listing local authorities normally require."
  },
  {
   "t": "large-scale fire test",
   "d": "A full unit deliberately set alight with suppression disabled, to demonstrate that fire does not propagate to neighbouring units."
  }
 ],
 "sections": [
  {
   "id": "why-the-sheet-is-the-sale",
   "title": "Why the sheet is the sale",
   "kind": "prose",
   "read": "2 min",
   "ps": [
    "Buyers of grid storage rarely ask how the chemistry works. They ask what happens in year twelve, whether the site still meets contract, and who pays if it does not. Almost every one of those questions is answered — or dodged — somewhere on the container spec sheet, which is why reading one properly is the single most transferable skill in this business.",
    "The sheet has two kinds of line. Some are descriptive: how much energy, at what power, in what box. Those are easy and everyone quotes them. The rest are commitments — degradation, operating window, augmentation path, safety file — and those are where a comparison between two vendors actually resolves.",
    "The discipline that follows is simple to state and hard to hold: quote what ships today, show the roadmap separately, and be explicit about what will be committed to in writing. A spec line that blurs shipping product with roadmap is the single easiest thing for a competitor to take apart in front of your buyer."
   ],
   "sales": "Lead with the warranty curve and the augmentation path, not with the chemistry. The chemistry is table stakes; the second decade is the argument."
  },
  {
   "id": "line-by-line",
   "title": "Line by line",
   "kind": "table",
   "read": "5 min",
   "intro": "The eight lines that carry the decision. Read the third column as the question the buyer is actually asking when they point at the second.",
   "cols": [
    "Spec line",
    "Plain meaning",
    "What the buyer is really asking"
   ],
   "rows": [
    [
     "{{Cycle life}}",
     "Full round trips before capacity reaches the warranty floor",
     "How long is this a working asset, and how often must I spend on {{augmentation}}? Storage-class {{LFP}} rates in the ten-thousand-plus range by class."
    ],
    [
     "Energy density (Wh/kg · Wh/L)",
     "Energy per unit of weight and of volume",
     "How much land do I lease? Weight is a vehicle metric — answer a developer in {{footprint density}}, energy per square metre of site, instead."
    ],
    [
     "{{Round-trip efficiency}}",
     "Energy out divided by energy in",
     "What do losses cost me over twenty years? Every lost point is energy bought twice. Modern systems run at or above 95% on the DC side."
    ],
    [
     "Degradation / {{state of health}} curve",
     "Capacity remaining, year by year",
     "Does my financial model survive an independent engineer? The pro forma is built on this curve, and it will be tested against the warranty envelope, not the brochure."
    ],
    [
     "{{Duration}} class",
     "Hours of discharge at rated power",
     "Does this product match my revenue duty at all? Two-, four- and eight-hour systems are different products, not one product turned down."
    ],
    [
     "Operating window",
     "Temperature range without {{derating}}",
     "Where can I actually site this? Hardened variants extend the range at both ends; outside it, the nameplate is not the delivered capacity."
    ],
    [
     "{{Footprint density}}",
     "Energy per square metre of occupied site",
     "How many pads, cable runs and crane lifts am I buying? Land and balance-of-plant scale with area, not with nameplate."
    ],
    [
     "{{Augmentation}} path",
     "How capacity is restored later",
     "Did you design year ten in, or are you selling me a problem? Space, conversion and controls headroom must exist on day one — they cannot be retrofitted into a full site."
    ]
   ],
   "note": "A sheet that answers the first column confidently and goes quiet on the third is a sheet written for a procurement checklist rather than for an owner."
  },
  {
   "id": "the-cell-ladder",
   "title": "The cell ladder behind the sheet",
   "kind": "bars",
   "read": "2 min",
   "unit": "Ah per cell (class-representative sizes)",
   "intro": "Container density did not improve by magic. It improved because the industry climbed a cell ladder, and knowing where a product sits on it explains most of its spec sheet.",
   "items": [
    {
     "label": "280 Ah class",
     "v": 280,
     "sub": "the long-standing catalogue baseline across vendors"
    },
    {
     "label": "314 Ah class",
     "v": 314,
     "sub": "the current volume workhorse of the delivered fleet"
    },
    {
     "label": "500–600 Ah class",
     "v": 587,
     "sub": "in mass production and delivering since 2025"
    },
    {
     "label": "kilo-amp-hour class",
     "v": 1175,
     "sub": "1,000+ Ah cells, first mass production 2025"
    },
    {
     "label": "8-hour-native kAh",
     "v": 1300,
     "sub": "long-duration-native designs, deliveries ramping"
    }
   ],
   "note": "Fewer cells per container means fewer welds, fewer connections and fewer failure points — a directional integration-cost argument, not a costed bill of materials. The honest counterweight is thermal management and propagation behaviour, which is why the fire-test file has to climb the ladder alongside the cells."
  },
  {
   "id": "safety-words",
   "title": "The certification words, precisely",
   "kind": "callout",
   "read": "3 min",
   "ps": [
    "{{Thermal runaway}} is the failure everything else is designed against: a cell overheats past the point of self-acceleration, and its neighbours follow. Liquid cooling, cell spacing, venting, gas detection and suppression all exist to prevent the first event and to contain it if it happens. LFP's thermal stability is the head start the chemistry gives you.",
    "The vocabulary is worth getting exactly right, because getting it wrong is the fastest way to lose a technical buyer. {{UL 1973}} covers cells, modules and racks. {{UL 9540}} covers the complete integrated system and is the listing local authorities normally require. **{{UL 9540A}} is a test method with no pass or fail** — it produces propagation data at cell, module and unit level. Never say \"9540A certified\"; say *tested at cell, module and unit level, reports available*.",
    "{{NFPA 855}} is the installation standard, and as states adopt it the {{large-scale fire test}} — one unit fully alight, suppression off, no propagation to its neighbours — becomes effectively mandatory. A larger cell without matching test data is a harder bankability story, not an easier one."
   ],
   "sales": "Precision here is credibility. \"Certified\" where the correct word is \"tested\" tells a technical buyer you have not read your own safety file."
  },
  {
   "id": "drill",
   "title": "Flashcards",
   "kind": "flashcards",
   "read": "drill",
   "cards": [
    {
     "q": "A developer asks about energy density. What do you answer with instead?",
     "a": "Footprint economics — energy per square metre of site. Weight is a vehicle metric; land cost is its stationary equivalent, and it is what converts into pads, cable runs and lifts."
    },
    {
     "q": "Why is UL 9540A never something a product is 'certified' to?",
     "a": "Because it is a test method, not a listing. It has no pass or fail — it produces propagation data at cell, module and unit level. The correct claim is that testing was done and reports are available."
    },
    {
     "q": "Two vendors quote the same MWh, the same duration and the same efficiency. Where does the comparison actually resolve?",
     "a": "The degradation curve and the augmentation path — how much capacity remains each year, and whether the site was designed with the space and headroom to restore it."
    },
    {
     "q": "What does climbing the cell ladder buy, and what does it cost?",
     "a": "It buys fewer cells, welds and connections per megawatt-hour, so lower integration cost and fewer failure points. It costs harder thermal management and propagation behaviour, so the fire-test file must keep pace."
    },
    {
     "q": "Why does the operating window matter more than it looks?",
     "a": "Outside the stated range the system derates, so the nameplate stops being the delivered capacity. It is a siting constraint disguised as a footnote."
    }
   ]
  },
  {
   "id": "check-yourself",
   "title": "Self-test",
   "kind": "quiz",
   "read": "4 questions",
   "items": [
    {
     "q": "Which spec line most directly sets how often a site needs augmentation?",
     "c": [
      "The degradation / state-of-health curve",
      "The enclosure ingress rating",
      "The nominal cell voltage",
      "The transport dimensions"
     ],
     "a": 0,
     "why": "Augmentation is triggered when remaining capacity can no longer meet the contracted energy. The curve is what predicts that date, which is why the pro forma is built on it."
    },
    {
     "q": "A buyer says round-trip efficiency is 'only a couple of points'. What is the correct reply?",
     "c": [
      "Every lost point is energy bought twice, across twenty years of daily cycling",
      "Efficiency is fixed by the grid operator",
      "Efficiency only matters for short-duration systems",
      "It affects the warranty length"
     ],
     "a": 0,
     "why": "Losses are paid on the way in and never recovered on the way out. Over a daily-cycling twenty-year asset, a point or two of efficiency is a large cumulative energy bill."
    },
    {
     "q": "What is the honest tradeoff of larger cells?",
     "c": [
      "Fewer parts and connections, against harder thermal and propagation behaviour",
      "More energy per kilogram, against higher cost",
      "Longer warranty, against slower charging",
      "Lower voltage, against higher current"
     ],
     "a": 0,
     "why": "The integration saving is real and directional. The counterweight is that a bigger cell releases more energy if it fails, so the test file has to keep pace with the ladder."
    },
    {
     "q": "Which claim would a technical buyer most likely challenge on the spot?",
     "c": [
      "'UL 9540A certified'",
      "'Tested at cell, module and unit level'",
      "'Listed to UL 9540'",
      "'Rated -30 °C to 60 °C without derating'"
     ],
     "a": 0,
     "why": "UL 9540A is a test method with no pass or fail, so nothing can be certified to it. The other three are claims that a document can actually support."
    }
   ]
  }
 ]
};
}

function clLessonAidcPowerChain_() {
  return {
 "schemaVersion": 1,
 "id": "the-aidc-power-chain",
 "type": "module",
 "title": "The AI Data-Center Power Chain",
 "short": "Follow a megawatt from the utility service entrance to the rack — switchgear, busway, the UPS dial, and the choreography of an outage.",
 "group": "The AI Data-Center Wave",
 "updated": "2026-09-01",
 "reviewBy": "2027-03-01",
 "provenance": {
  "inputs": [
   {
    "kind": "public",
    "ref": "study:eaton",
    "date": "2026-08-21",
    "note": "distribution hierarchy, busway versus cable, selective coordination, the UPS efficiency dial, transfer choreography"
   },
   {
    "kind": "public",
    "ref": "study:vertiv",
    "date": "2026-08-21",
    "note": "the rack as an airflow and structural device at the end of the chain"
   },
   {
    "kind": "public",
    "ref": "concepts:profiler-concepts",
    "date": "2026-08-31",
    "note": "term definitions used by the {{...}} tooltips"
   }
  ]
 },
 "tiles": [
  {
   "k": "service → rack",
   "v": "one hierarchy",
   "sub": "each tier rated for fault energy, not just current"
  },
  {
   "k": "busway",
   "v": "capacity you reconfigure",
   "sub": "tap-off units move rack power without rewiring"
  },
  {
   "k": "10–20 ms",
   "v": "the hold-up window",
   "sub": "how long a server rides out a transfer unnoticed"
  },
  {
   "k": "10+ s",
   "v": "generator start",
   "sub": "every backup layer covers another layer's gap"
  }
 ],
 "glossary": [
  {
   "t": "switchgear",
   "d": "The heavy assembly of breakers and protection at a building's service entrance, rated to interrupt the fault energy the utility can deliver."
  },
  {
   "t": "busway",
   "d": "A prefabricated metal-enclosed conductor bar that bolts together in sections, replacing bundles of cable and accepting plug-in tap-offs anywhere along its run."
  },
  {
   "t": "selective coordination",
   "d": "Nesting breaker trip characteristics so a fault opens only the nearest upstream device, cutting the failure away without darkening anything else."
  },
  {
   "t": "time-current curve",
   "d": "The plotted personality of a protective device: how fast it trips at each level of current. Engineers nest these curves to achieve selectivity."
  },
  {
   "t": "hold-up time",
   "d": "How long a server power supply keeps its output alive on internal capacitance after input power disappears — roughly 10 to 20 milliseconds."
  },
  {
   "t": "automatic transfer switch",
   "d": "The device that senses utility failure, signals generators to start, and moves the load between sources — then manages the return when utility power comes back."
  },
  {
   "t": "eco-mode",
   "d": "Running the load on raw utility through a UPS bypass with the conversion stage idling in reserve, trading a few points of efficiency gain for a millisecond-scale transfer on failure."
  }
 ],
 "sections": [
  {
   "id": "service-to-rack",
   "title": "The hierarchy from service to rack",
   "kind": "prose",
   "read": "4 min",
   "ps": [
    "Power enters a building once and then fans out through tiers: {{switchgear}} at the service entrance, distribution boards, then panelboards and {{PDU}}s near the load. What sizes each tier is not simply the current it carries but the *fault* energy it must survive — the short-circuit power the utility can deliver into a failure at that point. That distinction is why the equipment gets dramatically heavier as you move upstream.",
    "There are two ways to move power across a data hall. The classic method pulls cable in conduit: familiar, flexible, and every circuit is field labour — changing anything means pulling wire again. {{Busway}} replaces those bundles with a prefabricated conductor bar that bolts together in sections.",
    "Busway's real feature is the tap-off. Plug-in units clamp anywhere along the run, so an overhead busway down an aisle turns rack power into something you *reconfigure* rather than something you reconstruct. In a facility where rack density changes between generations of hardware, that is worth more than the copper.",
    "The choice is economics as much as engineering. Busway installs faster with less skilled-labour time and carries very high current compactly; cable still wins on long single runs and tight budgets. Modern data halls overwhelmingly hang busway overhead, and the reason is the reconfiguration, not the ampacity."
   ],
   "sales": "When a customer describes a refresh cycle rather than a build, they are describing a busway argument — the value is in changing rack power without pulling wire."
  },
  {
   "id": "selective-coordination",
   "title": "One fault should trip one breaker",
   "kind": "prose",
   "read": "3 min",
   "ps": [
    "Breakers sit in series from the utility service down to every receptacle. {{Selective coordination}} means a fault opens only the nearest upstream device — the failure is cut away surgically while everything else keeps running. In a critical facility the alternative is the nightmare scenario: a fault in one rack's power strip opening a main breaker and darkening the hall.",
    "The engineering tool is the {{time-current curve}}. Every protective device has a plotted personality showing how fast it trips at each current, and the design nests those curves so the downstream device always wins the race at any plausible fault current.",
    "It is harder than it sounds. At very high fault currents the curves converge and both devices want to trip instantly. Short-time delays, instantaneous pickup settings, and zone-selective interlocking — the downstream breaker signalling upstream *I have this one* — are what restore order at the top of the range.",
    "Because the consequence is a whole hall rather than a rack, coordination studies are a contract deliverable rather than an internal exercise, and codes mandate selectivity outright for life-safety circuits."
   ]
  },
  {
   "id": "the-ups-dial",
   "title": "The UPS efficiency dial",
   "kind": "proscons",
   "read": "4 min",
   "intro": "Uninterruptible power is not one design but a dial between two positions, and at tens of megawatts the setting is a multi-million-dollar annual decision rather than a preference.",
   "cards": [
    {
     "t": "Double conversion",
     "meta": "Everything flows through the converters, continuously",
     "adv": [
      "The load sees a synthesised waveform regardless of what the utility does",
      "No transfer event at all on utility failure — the conversion stage is already carrying the load",
      "Simplest story to defend to a risk-averse operator or an insurer"
     ],
     "dis": [
      "Costs a few percent of every megawatt-hour, around the clock",
      "Those losses become heat, so the cooling plant pays a second time",
      "At tens of megawatts, two efficiency points is millions of dollars a year"
     ]
    },
    {
     "t": "Eco-mode",
     "meta": "Load runs on utility through bypass; conversion idles in reserve",
     "adv": [
      "Efficiency in the 98–99% range, with the cooling saving on top",
      "Same hardware — the mode is a commissioning decision, not a different product",
      "Adaptive variants keep converters primed for near-instant takeover"
     ],
     "dis": [
      "Requires detecting failure and transferring inside the server hold-up window",
      "The debate is whether detection is reliably that fast for *every* fault type, not the typical one",
      "Harder to defend after an incident, whatever the statistics say"
     ]
    }
   ],
   "note": "The physics referee is {{hold-up time}}: server power supplies ride roughly 10 to 20 milliseconds on internal capacitors, so a transfer completed inside that window is invisible to the IT load. Operators pick a point on the dial per facility, not a dogma."
  },
  {
   "id": "outage-choreography",
   "title": "The choreography of an outage",
   "kind": "table",
   "read": "3 min",
   "intro": "Backup is a relay race in which every layer exists to cover another layer's startup gap. The {{automatic transfer switch}} is the conductor.",
   "cols": [
    "Moment",
    "What is happening",
    "What is carrying the load"
   ],
   "rows": [
    [
     "0 ms",
     "Utility fails",
     "Stored energy — UPS batteries or flywheels — instantly and without a decision"
    ],
    [
     "A few ms",
     "The transfer switch senses the failure and signals the generators to start",
     "Still stored energy"
    ],
    [
     "~10 s and up",
     "Engines crank, stabilise, and reach a state where they can accept load",
     "Still stored energy — this gap is why the stored layer is sized in minutes, not seconds"
    ],
    [
     "Transfer",
     "The switch hands the load from stored energy to generation",
     "Generators, once synchronised or after a brief open transition"
    ],
    [
     "Steady state",
     "Paralleling switchgear adds engines in priority order and sheds non-critical load if generation runs short",
     "A room of engines behaving as one coordinated plant"
    ],
    [
     "Return",
     "Utility comes back; the switch manages the trip home",
     "Generators, then utility"
    ]
   ],
   "note": "Transfer style matters. **Open transition** breaks the connection momentarily — the load blinks unless stored energy bridges it. **Closed transition** briefly parallels generator and utility for a seamless swap, at the cost of strict synchronisation and utility approval."
  },
  {
   "id": "dirty-loads",
   "title": "What the load does back to the building",
   "kind": "prose",
   "read": "3 min",
   "ps": [
    "Power flows both ways as a *problem*. Loads that chop current — drives, {{rectifier}} front ends, ageing equipment — reflect distortion back into the building's wiring. That distortion heats transformers and conductors while doing no useful work, which is why specifications call for K-rated transformers and oversized neutrals where harmonics are expected.",
    "IEEE 519 draws the property line at the point of common coupling, where the building meets the utility. Limits apply *there*, so one customer's dirty loads cannot degrade a neighbour's power quality — and compliance is measured at that point rather than assumed from equipment datasheets.",
    "Power factor is billed, not merely calculated: utilities levy penalties when a facility's reactive draw ties up capacity they cannot sell to anyone else. Modern IT gear with active front ends behaves well here; the correction burden usually falls on the mechanical plant and on legacy equipment.",
    "AI computing added a new species of disturbance. Large GPU clusters swing tens of megawatts in milliseconds, and they do it *rhythmically* — training steps are periodic. Those repeating oscillations can interact with grid resonances below normal line frequency, which is new enough that detecting them only recently became a monitoring product feature rather than a research topic."
   ],
   "sales": "The megawatt-scale periodic swing is the newest thing in this chain. If a customer is standing up AI capacity on an older electrical plant, that conversation is happening whether or not you start it."
  },
  {
   "id": "drill",
   "title": "Flashcards",
   "kind": "flashcards",
   "read": "drill",
   "cards": [
    {
     "q": "What sizes electrical equipment at each tier of the distribution hierarchy?",
     "a": "The fault energy it must survive, not only the current it normally carries. That is why gear gets dramatically heavier towards the service entrance."
    },
    {
     "q": "What is busway's actual selling point over cable?",
     "a": "The tap-off. Plug-in units clamp anywhere along the run, so rack power becomes something you reconfigure rather than rewire — which matters most in facilities that refresh hardware."
    },
    {
     "q": "Why is selective coordination hardest at high fault currents?",
     "a": "The time-current curves of upstream and downstream devices converge there, so both want to trip instantly. Short-time delays and zone-selective interlocking restore the ordering."
    },
    {
     "q": "What is hold-up time and why does it referee the eco-mode debate?",
     "a": "It is the 10–20 ms a server power supply keeps running on internal capacitors after input power vanishes. A transfer finished inside that window is invisible to the load; outside it, the load drops."
    },
    {
     "q": "Why does the stored-energy layer have to last minutes rather than seconds?",
     "a": "Generators need ten-plus seconds to crank, stabilise and accept load, and the transfer sequence follows that. Stored energy has to cover the whole gap with margin."
    },
    {
     "q": "What is new about AI load from a power-quality point of view?",
     "a": "Tens of megawatts swinging in milliseconds, periodically. The repetition is the novel part — it can excite grid resonances below line frequency in a way steady loads never did."
    }
   ]
  },
  {
   "id": "check-yourself",
   "title": "Self-test",
   "kind": "quiz",
   "read": "5 questions",
   "items": [
    {
     "q": "A hall's rack layout changes every hardware generation. Which distribution choice does that argue for?",
     "c": [
      "Overhead busway with plug-in tap-offs",
      "Cable in conduit to each rack",
      "A larger service transformer",
      "More generator capacity"
     ],
     "a": 0,
     "why": "Tap-offs make rack power reconfigurable without field rewiring, which is exactly the cost that repeats every refresh."
    },
    {
     "q": "A fault in one rack's power strip darkens the whole hall. What failed?",
     "c": [
      "Selective coordination between breakers",
      "The chiller plant",
      "The building automation system",
      "Power factor correction"
     ],
     "a": 0,
     "why": "Selectivity means the nearest upstream device trips alone. A main opening for a downstream fault is the definition of miscoordination."
    },
    {
     "q": "Eco-mode raises UPS efficiency to 98–99%. What does it spend to get there?",
     "c": [
      "It must detect failure and transfer within the server hold-up window",
      "It requires a second utility feed",
      "It halves generator runtime",
      "It removes the need for an ATS"
     ],
     "a": 0,
     "why": "The load rides raw utility, so on failure the UPS has milliseconds to notice and take over. The risk is detection speed across every fault type, not the typical one."
    },
    {
     "q": "Why does an open-transition transfer make the load blink without stored energy?",
     "c": [
      "It breaks the connection momentarily before making the new one",
      "It reverses phase rotation",
      "It requires utility approval",
      "It runs the generators in parallel"
     ],
     "a": 0,
     "why": "Open transition deliberately disconnects before reconnecting. Something with stored energy has to bridge that instant, or the load sees the gap."
    },
    {
     "q": "IEEE 519 limits are measured at the point of common coupling because:",
     "c": [
      "That is where one customer's distortion could reach a neighbour",
      "It is the cheapest place to install a meter",
      "Utilities cannot measure inside a building",
      "Harmonics only exist at that point"
     ],
     "a": 0,
     "why": "The standard is drawing a property line. What a facility does internally is its own business until it degrades the shared supply."
    }
   ]
  }
 ]
};
}

function clLessonHeatConstraint_() {
  return {
 "schemaVersion": 1,
 "id": "heat-is-the-constraint",
 "type": "module",
 "title": "Heat Is the Constraint",
 "short": "Why AI racks outran air cooling, and how the chip-to-atmosphere thermal chain spends a fixed budget of degrees.",
 "group": "The AI Data-Center Wave",
 "updated": "2026-09-01",
 "reviewBy": "2027-03-01",
 "provenance": {
  "inputs": [
   {
    "kind": "public",
    "ref": "study:vertiv",
    "date": "2026-08-21",
    "note": "precision cooling machines, the CDU and liquid kit, the thermal chain as a temperature budget, rack airflow physics"
   },
   {
    "kind": "public",
    "ref": "study:nvidia",
    "date": "2026-08-21",
    "note": "why accelerator design pushes density — throughput cores, memory bandwidth, and the rack as the scale-up domain"
   },
   {
    "kind": "public",
    "ref": "concepts:profiler-concepts",
    "date": "2026-08-31",
    "note": "term definitions used by the {{...}} tooltips"
   }
  ]
 },
 "tiles": [
  {
   "k": "one rack",
   "v": "the scale-up domain",
   "sub": "copper's reach at memory speed sets the box size"
  },
  {
   "k": "Q = m·c·ΔT",
   "v": "the air ceiling",
   "sub": "airflow times temperature rise, and it runs out"
  },
  {
   "k": "40–45 °C",
   "v": "warm-water supply",
   "sub": "the temperature that buys chiller-free hours"
  },
  {
   "k": "chip → sky",
   "v": "one series path",
   "sub": "every interface spends part of the same budget"
  }
 ],
 "glossary": [
  {
   "t": "CRAC",
   "d": "Computer room air conditioner — a self-contained refrigeration machine, compressor included, cooling a room directly."
  },
  {
   "t": "CRAH",
   "d": "Computer room air handler — a coil and fans fed chilled water from a central plant, with no compressor of its own."
  },
  {
   "t": "economiser",
   "d": "A mode that rejects heat using cool outdoor conditions instead of running mechanical refrigeration. The number of hours per year it works is a function of climate."
  },
  {
   "t": "CDU",
   "d": "Coolant distribution unit — pumps plus a heat exchanger that isolate the facility's water from the clean technology loop touching the servers."
  },
  {
   "t": "cold plate",
   "d": "A liquid-cooled block bolted directly to a processor, carrying its heat away by conduction into a coolant loop instead of into room air."
  },
  {
   "t": "rear-door heat exchanger",
   "d": "A radiator that replaces a rack's back door, neutralising exhaust heat with liquid while the servers themselves stay air-cooled."
  },
  {
   "t": "approach",
   "d": "The temperature difference a heat exchanger needs in order to move heat across it. Every stage in the chain consumes some of the total available difference."
  },
  {
   "t": "scale-up domain",
   "d": "The group of accelerators that can share data at near-memory speed over short, high-bandwidth links — in practice about one rack, because that is copper's reach at those rates."
  }
 ],
 "sections": [
  {
   "id": "why-the-rack-got-hot",
   "title": "Why the rack got hot",
   "kind": "prose",
   "read": "4 min",
   "ps": [
    "A CPU spends most of its silicon making a handful of cores individually fast, because it has to race through one unpredictable instruction stream. A GPU inverts that bet: thousands of simple cores, each slow alone, arranged for total throughput. Neural networks happen to be exactly that shape — enormous matrix multiplications whose individual operations do not depend on each other — so they saturate every simple core at once.",
    "Saturating silicon is another way of saying *drawing power continuously*. And the memory side made it worse: compute grew far faster than memory bandwidth for decades, so accelerators starve unless memory is stacked vertically and mounted almost touching the processor. That packaging pulls the heat sources tightly together instead of spreading them out.",
    "Then the wiring set the box size. Links fast enough for accelerators to pool memory and act as one machine ride copper, and copper's reach at those data rates is roughly one rack. The {{scale-up domain}} ends where the copper does — so the industry's engineering effort pours into packing more accelerators, more memory and more power into a single rack-sized volume rather than spreading them across a hall.",
    "Put those three together and the density is not a fashion. It is the consequence of a throughput architecture, a memory wall, and a physical reach limit — which is why the cooling problem arrived all at once rather than gradually."
   ]
  },
  {
   "id": "air-runs-out",
   "title": "Where air runs out",
   "kind": "prose",
   "read": "3 min",
   "ps": [
    "A rack is an airflow device before it is furniture. Servers pull air front to back, and the cabinet's job is making sure that air arrives cold and leaves without sneaking back around to the intake. Blanking panels sealing empty slots remain the cheapest cooling fix in the industry, for exactly that reason.",
    "The ceiling is simple bookkeeping: heat removed equals airflow times temperature rise. A rack's power limit is therefore set by how much air its servers can pull and how much rise their components tolerate — and that arithmetic runs out somewhere in the tens of kilowatts per cabinet, no matter how good the room is.",
    "Below that ceiling, internal discipline is most of the win. Cable bundles blocking exhaust, unsealed cutouts, and mixed airflow directions quietly tax every server's fans, and fan power is not free — it is electricity spent to move air rather than to compute.",
    "Above the ceiling, the cabinet stops being furniture altogether. Manifolds, busbars and heavier hardware push racks past a tonne, with millimetre tolerances for rail-mounted equipment, seismic bracing, and floor-loading calculations. The enclosure becomes a structural, plumbed, powered machine."
   ],
   "sales": "If a customer is quoting rack densities above the air ceiling and has not mentioned liquid, they have a plumbing project they have not budgeted."
  },
  {
   "id": "the-thermal-chain",
   "title": "The chain, and its temperature budget",
   "kind": "table",
   "read": "4 min",
   "intro": "Heat flows in series from silicon to sky, and every interface needs an {{approach}} — a temperature difference — to drive it across. The chip's junction limit minus the hottest outdoor day is the whole budget; each stage spends part of it.",
   "cols": [
    "Stage",
    "What it is",
    "What it spends the budget on"
   ],
   "rows": [
    [
     "Die to {{cold plate}}",
     "Conduction out of the package into a liquid-cooled block",
     "Thermal interface quality and contact pressure"
    ],
    [
     "Cold plate to technology coolant",
     "Convection into the clean, controlled loop",
     "Flow rate and channel design"
    ],
    [
     "Technology loop to {{CDU}}",
     "The isolating heat exchanger between server loop and facility water",
     "Exchanger approach — the classic place a design gets pinched"
    ],
    [
     "Facility water to plant",
     "Pumped loop out to chillers or an {{economiser}}",
     "Pipe losses and pump power"
    ],
    [
     "Plant to outdoor air",
     "Vapour compression, or free cooling when the weather permits",
     "Compressor power, or nothing at all in economiser hours"
    ]
   ],
   "note": "Waste too many degrees in one exchanger and there is nothing left to drive the rest. That is why vendors increasingly sell the chip-to-atmosphere path as one guaranteed system: a single undersized stage throttles the entire chain regardless of how good the other four are."
  },
  {
   "id": "the-liquid-kit",
   "title": "The equipment between chip and plant",
   "kind": "prose",
   "read": "3 min",
   "ps": [
    "The {{CDU}} is liquid cooling's central appliance: pumps plus a heat exchanger isolating the facility's water from the pristine loop that touches the servers. It keeps two domains apart that must never mix — different chemistry, different pressure, different cleanliness standards.",
    "It comes in an order of magnitude of sizes. In-rack units serve one cabinet, in-row units serve a pod, and facility-scale skids serve megawatts. Liquid-to-air variants reject heat into room air where no facility water exists at all, trading capacity for the ability to retrofit.",
    "Downstream sits a plumbing product family: manifolds distributing coolant vertically through the rack, {{cold plate}}s bolted to each processor, drip-free quick disconnects that allow live service, and leak detection woven throughout. It is reliability engineering expressed in fittings.",
    "The {{rear-door heat exchanger}} is the transitional species worth knowing by name. It replaces the rack's back door with a radiator that neutralises exhaust heat using liquid, while the servers themselves stay air-cooled — bringing liquid to the rack without touching the IT hardware. It is how most facilities take the first step."
   ]
  },
  {
   "id": "warm-water-economics",
   "title": "Why warm water is the whole argument",
   "kind": "callout",
   "read": "2 min",
   "ps": [
    "The counter-intuitive move in modern cooling is to ask for *warmer* water, not colder. If servers accept supply water at 40–45 °C, then in most climates the plant can reject heat to outdoor air for most of the year without running compressors at all.",
    "That is what the temperature budget buys when it is spent carefully: giving each stage fewer degrees to consume leaves enough difference at the end to reject heat against a warm sky. {{Economiser}} hours are not a weather accident — they are a design outcome, which is why cooling design starts with a climate file rather than with equipment selection.",
    "Precision cooling was always a different animal from comfort cooling for a related reason: IT heat is dry, sensible heat, so the machines are built for high sensible ratios, tight bands and continuous year-round duty. The liquid generation simply pushed that specialisation further down the chain, all the way to the die."
   ],
   "sales": "Chiller-free hours are the number that survives a CFO conversation. Efficiency ratios are abstract; months per year without running compressors are not."
  },
  {
   "id": "drill",
   "title": "Flashcards",
   "kind": "flashcards",
   "read": "drill",
   "cards": [
    {
     "q": "Why did the rack become the unit of AI computing?",
     "a": "The links that let accelerators pool memory at near-memory speed ride copper, and copper's reach at those rates is about one rack. The scale-up domain ends where the copper does."
    },
    {
     "q": "What sets a rack's power ceiling on air?",
     "a": "Heat removed equals airflow times temperature rise. How much air the servers can pull, and how much rise they tolerate, caps the cabinet somewhere in the tens of kilowatts."
    },
    {
     "q": "What is the difference between a {{CRAC}} and a {{CRAH}}?",
     "a": "A CRAC is a self-contained refrigeration machine with its own compressor. A CRAH is only a coil and fans, fed chilled water from a central plant — which is how large facilities centralise."
    },
    {
     "q": "What does a CDU actually isolate?",
     "a": "The facility's water from the clean technology loop touching the servers — two domains with different chemistry, pressure and cleanliness that must never mix."
    },
    {
     "q": "Why ask for warmer supply water rather than colder?",
     "a": "Because at 40–45 °C most climates can reject the heat to outdoor air for most of the year without compressors. Warmer water converts directly into chiller-free hours."
    },
    {
     "q": "Why is a rear-door heat exchanger the usual first step into liquid?",
     "a": "It brings liquid to the rack — neutralising exhaust heat at the back door — without changing the servers, which stay air-cooled. It is a retrofit rather than a hardware transition."
    }
   ]
  },
  {
   "id": "check-yourself",
   "title": "Self-test",
   "kind": "quiz",
   "read": "5 questions",
   "items": [
    {
     "q": "The cooling chain's total temperature budget is:",
     "c": [
      "The chip's junction limit minus the hottest outdoor design day",
      "The chilled-water setpoint",
      "The rack inlet temperature",
      "The difference across the CDU alone"
     ],
     "a": 0,
     "why": "Heat flows in series from die to atmosphere. The whole available difference is between the hottest the silicon may get and the hottest it must reject into — every stage spends part of it."
    },
    {
     "q": "One undersized heat exchanger in the middle of the chain does what?",
     "c": [
      "Throttles the entire chain regardless of the other stages",
      "Only affects that stage's efficiency",
      "Increases economiser hours",
      "Reduces pump power"
     ],
     "a": 0,
     "why": "Series paths are limited by their worst stage. Spending too many degrees at one exchanger leaves nothing to drive the rest, which is why the path is increasingly sold as one guaranteed system."
    },
    {
     "q": "Blanking panels are famous in this field because they:",
     "c": [
      "Stop hot exhaust air sneaking back to the intakes, for almost no money",
      "Increase the rack's structural rating",
      "Reduce fan noise",
      "Improve power factor"
     ],
     "a": 0,
     "why": "Recirculation raises inlet temperature for free, and sealing empty slots stops it. It is the cheapest cooling improvement available in most halls."
    },
    {
     "q": "Why does the memory wall matter to a cooling conversation?",
     "c": [
      "It forces memory to be stacked and mounted right against the processor, concentrating heat",
      "It lowers total rack power",
      "It removes the need for cold plates",
      "It sets the utility service size"
     ],
     "a": 0,
     "why": "Feeding starved arithmetic units requires stacked memory placed almost touching the die. That packaging concentrates the heat sources instead of spreading them out."
    },
    {
     "q": "A facility with no chilled-water plant wants liquid cooling for one pod. What fits?",
     "c": [
      "A liquid-to-air CDU rejecting heat into room air",
      "A facility-scale skid",
      "Nothing — liquid requires facility water",
      "A larger service transformer"
     ],
     "a": 0,
     "why": "Liquid-to-air variants exist precisely for this case: they trade capacity for the ability to retrofit where no facility water loop exists."
    }
   ]
  }
 ]
};
}

function clTrackBessFoundations_() {
  return {
 "schemaVersion": 1,
 "id": "bess-foundations",
 "title": "BESS Foundations",
 "short": "Finish this and you can read a grid-storage spec sheet and hold a technical conversation about cells, duration and degradation.",
 "group": "Technology Foundations",
 "updated": "2026-09-01",
 "lessons": [
  "cell-to-container",
  "duration-and-degradation",
  "spec-sheet-decoded"
 ]
};
}

function clTrackAidcPowerPrimer_() {
  return {
 "schemaVersion": 1,
 "id": "aidc-power-primer",
 "title": "The AI Data-Center Power Primer",
 "short": "Finish this and you can follow a megawatt from the utility service entrance to the chip, and explain why heat now sets the density.",
 "group": "The AI Data-Center Wave",
 "updated": "2026-09-01",
 "lessons": [
  "the-aidc-power-chain",
  "heat-is-the-constraint"
 ]
};
}

// Registries — ordered by lane, as guidanceDocs_() is in Profiler.gs:
// Technology Foundations first, then the AI data-center wave. C2's pipeline
// appends to both. Register every clLesson<Name>_() / clTrack<Name>_() here —
// the checker flags an unregistered literal.
function clLessons_() {
  return [clLessonCellToContainer_(), clLessonDurationDegradation_(), clLessonSpecSheet_(),
          clLessonAidcPowerChain_(), clLessonHeatConstraint_()];
}
function clTracks_() {
  return [clTrackBessFoundations_(), clTrackAidcPowerPrimer_()];
}
// CONTENT END — below here the gate derivation is frozen for pipeline runs
function clLesson_(id) {
  var all = clLessons_();
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
}
function clTrack_(id) {
  var all = clTracks_();
  for (var i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
  return null;
}

// A lesson card — what an index may say about a lesson the session can read.
// Metadata only, never the sections; `kinds` are the distinct stamp kinds so
// the page can badge a lesson's provenance without learning its inputs.
function clLessonCard_(lesson) {
  var kinds = clStampKinds_(lesson), distinct = [];
  for (var i = 0; i < kinds.length; i++) if (distinct.indexOf(kinds[i]) < 0) distinct.push(kinds[i]);
  return { id: lesson.id, type: lesson.type || 'module', title: lesson.title,
           short: lesson.short || '', group: lesson.group || '',
           updated: lesson.updated || '', reviewBy: lesson.reviewBy || '',
           edition: lesson.edition || '', gate: clLessonGate_(lesson), kinds: distinct,
           revised: (lesson.revisions && lesson.revisions.length)
             ? lesson.revisions[lesson.revisions.length - 1].date : '',
           sections: (lesson.sections || []).length };
}
// Every lesson this session may read, as cards, in registry order.
function clLessonIndexFor_(sess) {
  var all = clLessons_(), out = [];
  for (var i = 0; i < all.length; i++) if (clLessonVisible_(sess, all[i])) out.push(clLessonCard_(all[i]));
  return out;
}
// A track as this session sees it: its readable lessons in track order plus a
// count of the ones withheld (so the page can say "2 more with contributor
// access" without naming them). null when nothing in it is readable — an
// entirely gated track is not listed, and asking for it by id says UNKNOWN.
function clTrackFor_(sess, track) {
  if (!track) return null;
  var ids = track.lessons || [], lessons = [], withheld = 0;
  for (var i = 0; i < ids.length; i++) {
    var l = clLesson_(ids[i]);
    if (l && clLessonVisible_(sess, l)) lessons.push(clLessonCard_(l)); else withheld++;
  }
  if (!lessons.length) return null;
  return { id: track.id, title: track.title, short: track.short || '',
           group: track.group || '', updated: track.updated || '',
           prereqs: track.prereqs || [], lessons: lessons, withheld: withheld };
}
function clTrackIndexFor_(sess) {
  var all = clTracks_(), out = [];
  for (var i = 0; i < all.length; i++) {
    var t = clTrackFor_(sess, all[i]);
    if (t) out.push(t);
  }
  return out;
}


// PROJECT: ── Per-account reading progress (C1) ────────────────────────────
// cop=progress / cop=setprogress, over the same transport and the same app
// door as index/track/lesson. The account's section ticks live server-side so
// progress follows the account across devices; the page keeps localStorage as
// its offline fallback and migrates local-only ticks up in one batch on its
// first successful sync (the guidance pattern, Profiler.gs gd_progress).
//
// Storage is one Script Property per account ('cl_progress:<email>' →
// {lessonId:{secId:true}}). The blobs are tiny, well under the 9KB/value cap,
// and have no cross-project consumers, so PropertiesService beats a
// spreadsheet round-trip per tick. C4's drill history will NOT fit this
// pattern — that is why the design doc calls out a sheet-backed store there.
//
// The one Classroom-specific rule: **progress is never a weaker gate than
// reading.** Validation is built from the lessons this session may actually
// read (clLessonVisible_), not from the whole registry, so a tier that cannot
// open a lesson can neither tick it nor discover its section ids by probing.
// Stored ticks for lessons the account can no longer read are filtered out of
// reads but never deleted — access can be restored, and progress is the
// developer's own history, not resettable state.
var CL_PROGRESS_PROP_PREFIX = 'cl_progress:';

function clProgressAcct_(sess) {
  var em = String((sess && sess.email) || '').toLowerCase().trim();
  if (!em || em === 'unvalidated' || em.indexOf('@') < 0) return '';
  return em;
}

// {lessonId: {sectionId: true}} for every lesson this session may read.
function clProgressValid_(sess) {
  var all = clLessons_(), valid = {};
  for (var i = 0; i < all.length; i++) {
    if (!clLessonVisible_(sess, all[i])) continue;
    var set = {}, secs = all[i].sections || [];
    for (var j = 0; j < secs.length; j++) if (secs[j].id) set[secs[j].id] = true;
    valid[all[i].id] = set;
  }
  return valid;
}

function clProgressRaw_(acct) {
  try {
    var raw = PropertiesService.getScriptProperties().getProperty(CL_PROGRESS_PROP_PREFIX + acct);
    return raw ? (JSON.parse(raw) || {}) : {};
  } catch (e) { return {}; }
}

// Narrow a stored map to what this session may currently read. Unknown lesson
// ids and sections that no longer exist drop out too, so a renamed section
// cannot resurrect as a phantom tick.
function clProgressVisible_(stored, valid) {
  var out = {};
  for (var lid in stored) {
    if (!stored.hasOwnProperty(lid) || !valid[lid]) continue;
    var keep = {}, any = false;
    for (var sid in stored[lid]) {
      if (stored[lid].hasOwnProperty(sid) && stored[lid][sid] && valid[lid][sid]) { keep[sid] = true; any = true; }
    }
    if (any) out[lid] = keep;
  }
  return out;
}

function clProgressRead_(sess) {
  var acct = clProgressAcct_(sess);
  if (!acct) return {};
  return clProgressVisible_(clProgressRaw_(acct), clProgressValid_(sess));
}

// Delta: one tick (id + sec + done=1|0) or a batch merge (merge = JSON
// {lessonId:{secId:bool}}) used by the page's first-sync migration.
function clProgressWrite_(sess, p) {
  var acct = clProgressAcct_(sess);
  if (!acct) return { success: false, error: 'NO_ACCOUNT' };
  var valid = clProgressValid_(sess);
  var delta = {};
  if (p.merge) {
    try { delta = JSON.parse(String(p.merge)) || {}; }
    catch (me) { return { success: false, error: 'BAD_MERGE' }; }
  } else if (p.id && p.sec) {
    var one = {}; one[String(p.sec)] = String(p.done) === '1';
    delta[String(p.id)] = one;
  } else {
    return { success: false, error: 'NO_DELTA' };
  }
  var lock = null;
  try { lock = LockService.getScriptLock(); lock.waitLock(5000); }
  catch (le) { lock = null; /* best effort — same-account collisions are rare */ }
  try {
    var props = PropertiesService.getScriptProperties();
    var key = CL_PROGRESS_PROP_PREFIX + acct;
    var cur = clProgressRaw_(acct);
    var wrote = 0;
    for (var lid in delta) {
      if (!delta.hasOwnProperty(lid) || !valid[lid]) continue;
      var secMap = delta[lid] || {};
      for (var sid in secMap) {
        if (!secMap.hasOwnProperty(sid) || !valid[lid][sid]) continue;
        if (secMap[sid]) {
          if (!cur[lid]) cur[lid] = {};
          if (!cur[lid][sid]) { cur[lid][sid] = true; wrote++; }
        } else if (cur[lid] && cur[lid][sid]) {
          delete cur[lid][sid]; wrote++;
        }
      }
      if (cur[lid] && !Object.keys(cur[lid]).length) delete cur[lid];
    }
    if (Object.keys(cur).length) props.setProperty(key, JSON.stringify(cur));
    else props.deleteProperty(key);
    return { success: true, changed: wrote, progress: clProgressVisible_(cur, valid) };
  } finally {
    if (lock) try { lock.releaseLock(); } catch (re) { /* already released */ }
  }
}

// PROJECT: ── Study-next pointer (C1, final slice) ─────────────────────────
// "Pick up where you left off": the first section this account has not yet
// ticked, in the first unfinished lesson, in the first unfinished track.
// Registry order IS the teaching order, so walking it in order is the whole
// algorithm — no scoring, no recency, nothing to tune.
//
// Computed server-side because the client only holds lesson CARDS, which
// carry a section COUNT and deliberately not the section ids (clLessonCard_'s
// shape is asserted by the checker so section content can never ride along in
// an index). The server has the lessons, so it names the exact section.
//
// Returned from cop=index AND from cop=setprogress, so the pointer is exact
// again the instant a tick lands without the page spending a round trip on it.
// Tracks only: briefings are a dated feed, not a path through the material.
function clStudyNext_(sess, prog) {
  var tracks = clTracks_();
  for (var t = 0; t < tracks.length; t++) {
    var ids = tracks[t].lessons || [];
    for (var i = 0; i < ids.length; i++) {
      var lesson = clLesson_(ids[i]);
      // An unreadable lesson is skipped rather than ending the walk — a tier
      // that cannot read lesson 3 should still be pointed at lesson 4.
      if (!lesson || !clLessonVisible_(sess, lesson)) continue;
      var secs = lesson.sections || [];
      var done = prog[lesson.id] || {};
      for (var s = 0; s < secs.length; s++) {
        if (done[secs[s].id]) continue;
        var ticked = 0;
        for (var k in done) if (done.hasOwnProperty(k) && done[k]) ticked++;
        return { track: tracks[t].id, trackTitle: tracks[t].title,
                 lesson: lesson.id, lessonTitle: lesson.title,
                 section: secs[s].id, sectionTitle: secs[s].title,
                 done: ticked, total: secs.length,
                 started: ticked > 0 };
      }
    }
  }
  return null;   // everything readable is complete — the page says so
}

// PROJECT: ── Classroom ops (action=classroom, cop=index|track|lesson|progress|setprogress)
// Read-only, over the same cookie-less fetch transport as Profiler's guidance
// ops. Order of checks: session → the app door (clRequire_ 'tracks' — every
// admitted tier holds it; viewer is turned away with an audit entry) → for a
// lesson, its own stamp through clRequireLesson_ before any section text
// leaves the server. Index and track answers are pre-filtered to what the tier
// may read. The renderer (next C1 slice) is the consumer.
function handleClassroomOp_(e) {
  var p = (e && e.parameter) || {};
  var op = String(p.cop || '');
  var session = p.session || '';
  if (!session || session.length < 32) return { success: false, error: 'SESSION_EXPIRED' };
  var sess = null;
  try {
    sess = validateSessionForData(session, 'classroom_' + op);
    clRequire_(sess, 'tracks', 'classroom_' + op);
    if (op === 'index') {
      var ixProg = clProgressRead_(sess);
      return { success: true, role: clRoleOf_(sess),
               schema: { lesson: CL_LESSON_SCHEMA_VERSION, track: CL_TRACK_SCHEMA_VERSION },
               tracks: clTrackIndexFor_(sess), lessons: clLessonIndexFor_(sess),
               progress: ixProg, next: clStudyNext_(sess, ixProg) };
    }
    if (op === 'track') {
      var t = clTrackFor_(sess, clTrack_(String(p.id || '')));
      if (!t) return { success: false, error: 'UNKNOWN_TRACK' };
      return { success: true, track: t };
    }
    if (op === 'lesson') {
      var lesson = clLesson_(String(p.id || ''));
      if (!lesson) return { success: false, error: 'UNKNOWN_LESSON' };
      clRequireLesson_(sess, clStampKinds_(lesson), 'classroom_lesson:' + lesson.id);
      // Denials are already audited by clRequire_/clRequireLesson_. Successful
      // reads of GATED lessons are the other half of the trail worth keeping:
      // who opened guidance-, corpus- or report-derived material, and when.
      // Public-stamped lessons are not logged — every admitted tier may read
      // them, so the row would carry no signal and only add volume.
      var lessonGate = clLessonGate_(lesson);
      if (lessonGate && lessonGate !== 'tracks') {
        dataAuditLog(sess.email, 'read', 'classroom_lesson', lesson.id,
          { gate: lessonGate, role: clRoleOf_(sess) });
      }
      return { success: true, lesson: lesson };
    }
    if (op === 'progress') {
      var pr = clProgressRead_(sess);
      return { success: true, progress: pr, next: clStudyNext_(sess, pr) };
    }
    if (op === 'setprogress') {
      var wr = clProgressWrite_(sess, p);
      if (wr.success) wr.next = clStudyNext_(sess, wr.progress);
      if (wr.success && wr.changed) {
        dataAuditLog(sess.email, 'write', 'classroom_progress',
          String(p.id || 'merge'), { changed: wr.changed, role: clRoleOf_(sess) });
      }
      return wr;
    }
    return { success: false, error: 'unknown_cop' };
  } catch (cErr) {
    var cMsg = String((cErr && cErr.message) || cErr);
    if (cMsg.indexOf('SESSION_EXPIRED') >= 0) return { success: false, error: 'SESSION_EXPIRED' };
    if (cMsg.indexOf('CLASSROOM_FORBIDDEN') >= 0) {
      return { success: false, error: 'ROLE_DENIED', role: sess ? clRoleOf_(sess) : RBAC_DEFAULT_ROLE };
    }
    return { success: false, error: cMsg };
  }
}
// PROJECT END
// ══════════════

// ══════════════
// CROSS-PROJECT SESSION MANAGEMENT
// Enables the GlobalACL "Global Sessions" feature to query and manage
// sessions on this project remotely via UrlFetchApp. The shared secret
// is read from the "Config" tab of the Master ACL Spreadsheet.
// ══════════════

/**
 * Check if a row in the Access tab is a metadata row (#NAME, #URL, #AUTH).
 */
function isMetadataRow(row) { return String(row[0]).trim().charAt(0) === '#'; }

/**
 * Ensure the Access tab has the 3 metadata rows (#NAME, #URL, #AUTH) after the header.
 * If missing, inserts them and shifts existing user data down.
 */
function ensureMetadataRows(sheet) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2 || String(data[1][0]).trim() !== '#NAME') {
    sheet.insertRowsAfter(1, 5);
    sheet.getRange(2, 1).setValue('#NAME');
    sheet.getRange(3, 1).setValue('#URL');
    sheet.getRange(4, 1).setValue('#AUTH');
    sheet.getRange(5, 1).setValue('#ICON');
    sheet.getRange(6, 1).setValue('#DESC');
  } else if (data.length < 5 || String(data[4][0]).trim() !== '#ICON') {
    // Existing spreadsheet with 3 metadata rows — add #ICON and #DESC
    sheet.insertRowsAfter(4, 2);
    sheet.getRange(5, 1).setValue('#ICON');
    sheet.getRange(6, 1).setValue('#DESC');
  }
}

/**
 * Auto-register this project in the Access tab metadata rows of the Master ACL Spreadsheet.
 * Metadata is stored in rows 2-6 (#NAME, #URL, #AUTH, #ICON, #DESC) under the project's page column.
 * Runs once per execution (cached flag).
 */
var _selfRegistered = false;
function registerSelfProject() {
  if (_selfRegistered) return;
  _selfRegistered = true;
  try {
    // Throttle. The five metadata cells this writes (#NAME/#URL/#AUTH/#ICON/#DESC)
    // only change when the project is redeployed, but this ran on EVERY page load.
    // With several projects sharing one Access tab, that is a constant stream of
    // writes against the same sheet the sign-in check has to read — the contention
    // that makes an ACL read fail in the first place. Keyed on VERSION so a new
    // build always re-registers, and the deploy route clears the marker outright.
    var regCache = getEpochCache();
    var regKey = 'selfreg_' + ACL_PAGE_NAME;
    if (regCache.get(regKey) === VERSION) return;

    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ACL_SHEET_NAME);
    if (!sheet) return;

    ensureMetadataRows(sheet);

    // Find column for this project
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var colIdx = -1;
    for (var c = 0; c < headers.length; c++) {
      if (String(headers[c]).trim().toLowerCase() === ACL_PAGE_NAME.toLowerCase()) {
        colIdx = c;
        break;
      }
    }

    // If column doesn't exist, add it
    if (colIdx === -1) {
      colIdx = headers.length;
      sheet.getRange(1, colIdx + 1).setValue(ACL_PAGE_NAME);
      sheet.getRange(2, colIdx + 1).setValue('');
      sheet.getRange(3, colIdx + 1).setValue('');
      sheet.getRange(4, colIdx + 1).setValue(false);
      sheet.getRange(5, colIdx + 1).setValue('');
      sheet.getRange(6, colIdx + 1).setValue('');
      var lastRow = sheet.getLastRow();
      if (lastRow > 6) {
        // Auto-authorize developers on new-project registration: users whose Role
        // (col B) is "developer" start authorized (TRUE); everyone else starts FALSE.
        // Only runs when the column is first created — never overwrites admin edits.
        var roleValues = sheet.getRange(7, 2, lastRow - 6, 1).getValues();
        var accessValues = [];
        for (var f = 0; f < lastRow - 6; f++) {
          accessValues.push([String(roleValues[f][0]).trim().toLowerCase() === 'developer']);
        }
        sheet.getRange(7, colIdx + 1, lastRow - 6, 1).setValues(accessValues);
        sheet.getRange(7, colIdx + 1, lastRow - 6, 1).insertCheckboxes();
      }
    }

    // Determine this project's URL
    var isSelfProject = (ACL_PAGE_NAME === 'globalacl');
    var myUrl = isSelfProject ? 'SELF'
      : (DEPLOYMENT_ID && DEPLOYMENT_ID !== 'YOUR_DEPLOYMENT_ID')
        ? 'https://script.google.com/macros/s/' + DEPLOYMENT_ID + '/exec'
        : '';
    if (!myUrl) return;

    // Write/update metadata rows for this project's column.
    // Placeholder guards — if TITLE / PORTAL_ICON / PORTAL_DESCRIPTION were left as
    // template placeholders (fields left blank in the GAS project creator), derive
    // presentable values from ACL_PAGE_NAME instead of writing raw placeholder tokens.
    var derivedTitle = ACL_PAGE_NAME.split(/[-_]/).map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
    var regTitle = (!TITLE || TITLE === 'TEMPLATE_TITLE' || TITLE === 'YOUR_PROJECT_TITLE' || TITLE.indexOf('CHANGE THIS PROJECT TITLE') === 0) ? derivedTitle : TITLE;
    var regIcon = (typeof PORTAL_ICON !== 'undefined' && PORTAL_ICON && PORTAL_ICON !== 'TEMPLATE_PORTAL_ICON') ? PORTAL_ICON : '📱';
    var regDesc = (typeof PORTAL_DESCRIPTION !== 'undefined' && PORTAL_DESCRIPTION && PORTAL_DESCRIPTION !== 'TEMPLATE_PORTAL_DESCRIPTION' && PORTAL_DESCRIPTION.indexOf('CHANGE THIS PROJECT TITLE') !== 0) ? PORTAL_DESCRIPTION : regTitle + ' application.';
    var col = colIdx + 1;
    sheet.getRange(2, col).setValue(regTitle);
    sheet.getRange(3, col).setValue(myUrl);
    sheet.getRange(4, col).setValue(true);
    sheet.getRange(5, col).setValue(regIcon);
    sheet.getRange(6, col).setValue(regDesc);
    // Only marked done after a fully successful pass, so a failed registration
    // retries on the next page load instead of being suppressed for 6 hours.
    regCache.put(regKey, VERSION, 21600);
  } catch (e) {
    Logger.log('registerSelfProject error: ' + e.message);
  }
}

/**
 * Read the cross-project admin secret from Script Properties.
 * Cached in-memory for the duration of a single GAS execution.
 */
var _crossProjectSecret = null;
function getCrossProjectSecret() {
  if (_crossProjectSecret) return _crossProjectSecret;
  try {
    _crossProjectSecret = PropertiesService.getScriptProperties()
      .getProperty('CROSS_PROJECT_ADMIN_SECRET') || '';
    return _crossProjectSecret;
  } catch (e) {
    Logger.log('getCrossProjectSecret error: ' + e.message);
  }
  return '';
}

/**
 * Validate a cross-project request: shared secret must match and caller must be admin.
 */
function validateCrossProjectAdmin(params) {
  var secret = (params && params.secret) || '';
  var callerEmail = (params && params.callerEmail) || '';
  if (!secret || !callerEmail) return { valid: false, reason: 'missing_params' };
  var expected = getCrossProjectSecret();
  if (!expected || secret !== expected) return { valid: false, reason: 'invalid_secret' };
  // Verify caller has admin role via ACL
  var access = checkSpreadsheetAccess(callerEmail);
  if (!access.hasAccess || access.role !== 'admin') return { valid: false, reason: 'not_admin' };
  return { valid: true, email: callerEmail };
}

/**
 * List active sessions for cross-project aggregation (skips session-token validation).
 * Called by the cross-project listSessions endpoint after secret+admin validation.
 */
function listActiveSessionsInternal(callerEmail) {
  var cache = getEpochCache();
  var activeSessions = [];
  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ACL_SHEET_NAME);
    if (!sheet) return activeSessions;
    var data = sheet.getDataRange().getValues();
    for (var r = 1; r < data.length; r++) {
      var email = String(data[r][0]).trim().toLowerCase();
      if (!email || email.indexOf('@') === -1) continue;
      var trackKey = 'sessions_' + email;
      var raw = cache.get(trackKey);
      if (!raw) continue;
      var tokens;
      try { tokens = JSON.parse(raw); } catch (e) { continue; }
      for (var i = 0; i < tokens.length; i++) {
        var sessionRaw = cache.get('session_' + tokens[i]);
        if (!sessionRaw) continue;
        var sess;
        try { sess = JSON.parse(sessionRaw); } catch (e) { continue; }
        var absRemaining = 0;
        if (sess.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
          absRemaining = Math.max(0, Math.round(
            AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT - ((Date.now() - sess.absoluteCreatedAt) / 1000)
          ));
        }
        var rollingRemaining = Math.max(0, Math.round(
          AUTH_CONFIG.SESSION_EXPIRATION - ((Date.now() - sess.createdAt) / 1000)
        ));
        activeSessions.push({
          email: sess.email,
          displayName: sess.displayName || '',
          role: sess.role || RBAC_DEFAULT_ROLE,
          createdAt: sess.absoluteCreatedAt || sess.createdAt,
          lastActivity: sess.lastActivity,
          absoluteRemaining: absRemaining,
          rollingRemaining: rollingRemaining,
          isEmergencyAccess: sess.isEmergencyAccess || false,
          isSelf: (sess.email || '').toLowerCase() === (callerEmail || '').toLowerCase(),
          project: TITLE
        });
      }
    }
  } catch (e) {
    Logger.log('listActiveSessionsInternal error: ' + e.message);
  }
  return activeSessions;
}

// ══════════════
// ADMIN UTILITIES — run from the GAS Editor (select function → Run)
// These are generic admin tools that work with any auth project.
// ══════════════

/**
 * Clear the access cache for a specific user so their next login reads the ACL fresh.
 * @param {string} email — the user's email address. When called from the GAS editor
 *   (no parameter), reads from Script Properties key "CLEAR_CACHE_EMAIL".
 *   Usage: Script Properties → CLEAR_CACHE_EMAIL = user@example.com → Run this function.
 * Note: uses the same epoch bump as clearAllAccessCache — all users are affected.
 * GAS CacheService does not support per-key enumeration, so targeted clearing is not possible.
 */
function clearAccessCacheForUser(email) {
  if (!email) {
    email = PropertiesService.getScriptProperties().getProperty('CLEAR_CACHE_EMAIL');
  }
  if (!email) {
    Logger.log('No email specified. Set Script Properties key "CLEAR_CACHE_EMAIL" or pass email as parameter.');
    return;
  }
  // Bump epoch to invalidate all cache (no way to target individual keys in GAS)
  clearAllAccessCache();
  Logger.log('Cache cleared for all users (epoch bumped). Target user: ' + email);
}

/**
 * Nuclear cache clear — increments the cache epoch so ALL existing CacheService entries
 * are instantly orphaned (they have the old epoch prefix and will never be read again).
 * No need to enumerate individual keys — everything is invalidated at once.
 * After incrementing, all users must re-authenticate on their next request.
 */
function clearAllAccessCache() {
  var props = PropertiesService.getScriptProperties();
  var oldEpoch = parseInt(props.getProperty('CACHE_EPOCH') || '0', 10);
  var newEpoch = String(oldEpoch + 1);
  props.setProperty('CACHE_EPOCH', newEpoch);

  // Reset in-memory cache for this execution
  _cacheEpoch = newEpoch;
  _rbacRolesCache = null;
  _rbacRolesCacheExpiry = 0;

  Logger.log('Cache epoch bumped from ' + oldEpoch + ' to ' + newEpoch
    + ' — ALL cached access, roles, and sessions are now invalidated.'
    + ' Old entries will expire naturally from CacheService within 10 minutes.');
}

/**
 * Diagnostic — probe all known cache key patterns and log what's found.
 * Run from the GAS editor to see what's currently in the cache.
 * Checks both the current epoch and the previous epoch (to detect stale entries).
 */
function inspectCache() {
  var props = PropertiesService.getScriptProperties();
  var epoch = parseInt(props.getProperty('CACHE_EPOCH') || '0', 10);
  var raw = CacheService.getScriptCache();

  // Collect emails from ACL + sharing list
  var emails = [];
  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  if (hasAcl) {
    try {
      var aclSs = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
      var aclSheet = aclSs.getSheetByName(ACL_SHEET_NAME);
      if (aclSheet) {
        var data = aclSheet.getDataRange().getValues();
        for (var r = 1; r < data.length; r++) {
          var em = String(data[r][0]).trim().toLowerCase();
          if (em && em.indexOf('@') > -1) emails.push(em);
        }
      }
    } catch(e) { Logger.log('ACL read error: ' + e.message); }
  }
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID";
  if (hasSheet) {
    try {
      var dataSs = SpreadsheetApp.openById(SPREADSHEET_ID);
      var allUsers = dataSs.getEditors().concat(dataSs.getViewers());
      for (var u = 0; u < allUsers.length; u++) {
        var ue = allUsers[u].getEmail().toLowerCase();
        if (ue && emails.indexOf(ue) === -1) emails.push(ue);
      }
    } catch(e) { Logger.log('Sharing list read error: ' + e.message); }
  }

  Logger.log('══════ CACHE INSPECTION ══════');
  Logger.log('Current epoch: ' + epoch);
  Logger.log('Users found: ' + emails.length);
  Logger.log('');

  // Check both current and previous epoch
  var epochs = [epoch, epoch - 1];
  for (var ei = 0; ei < epochs.length; ei++) {
    var ep = epochs[ei];
    if (ep < 0) continue;
    var pfx = 'e' + ep + '_';
    var label = (ep === epoch) ? 'CURRENT (e' + ep + ')' : 'PREVIOUS (e' + ep + ' — should be empty)';
    Logger.log('── ' + label + ' ──');

    // Roles matrix
    var rolesVal = raw.get(pfx + 'rbac_roles_matrix');
    Logger.log('  rbac_roles_matrix: ' + (rolesVal ? rolesVal.substring(0, 100) + '...' : '(empty)'));

    // Per-user keys
    for (var i = 0; i < emails.length; i++) {
      var email = emails[i];
      var access = raw.get(pfx + 'access_' + email);
      var role = raw.get(pfx + 'role_' + email);
      var sessions = raw.get(pfx + 'sessions_' + email);
      if (access || role || sessions) {
        Logger.log('  ' + email + ':');
        if (access) Logger.log('    access_: ' + access);
        if (role) Logger.log('    role_: ' + role);
        if (sessions) {
          try {
            var tokens = JSON.parse(sessions);
            Logger.log('    sessions_: ' + tokens.length + ' active token(s)');
            for (var t = 0; t < tokens.length; t++) {
              var sessRaw = raw.get(pfx + 'session_' + tokens[t]);
              if (sessRaw) {
                try {
                  var sess = JSON.parse(sessRaw);
                  Logger.log('      session ' + (t+1) + ': role=' + sess.role + ', created=' + new Date(sess.createdAt).toISOString());
                } catch(pe) {
                  Logger.log('      session ' + (t+1) + ': (unparseable)');
                }
              } else {
                Logger.log('      session ' + (t+1) + ': (expired/missing)');
              }
            }
          } catch(je) { Logger.log('    sessions_: (unparseable)'); }
        }
      }
    }
    Logger.log('');
  }
  Logger.log('══════ END INSPECTION ══════');
}

/**
 * List all active sessions by walking the ACL spreadsheet.
 * Admin-only — requires a valid session with 'admin' permission.
 * Called via google.script.run from the admin session panel.
 */
function listActiveSessions(sessionToken) {
  var user = validateSessionForData(sessionToken, 'listActiveSessions');
  checkPermission(user, 'admin', 'listActiveSessions');

  var cache = getEpochCache();
  var activeSessions = [];

  try {
    var ss = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(ACL_SHEET_NAME);
    if (!sheet) return activeSessions;
    var data = sheet.getDataRange().getValues();

    for (var r = 1; r < data.length; r++) {
      var email = String(data[r][0]).trim().toLowerCase();
      if (!email || email.indexOf('@') === -1) continue;

      var trackKey = 'sessions_' + email;
      var raw = cache.get(trackKey);
      if (!raw) continue;

      var tokens;
      try { tokens = JSON.parse(raw); } catch (e) { continue; }

      for (var i = 0; i < tokens.length; i++) {
        var sessionRaw = cache.get('session_' + tokens[i]);
        if (!sessionRaw) continue;

        var sess;
        try { sess = JSON.parse(sessionRaw); } catch (e) { continue; }

        var absRemaining = 0;
        if (sess.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
          absRemaining = Math.max(0, Math.round(
            AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT - ((Date.now() - sess.absoluteCreatedAt) / 1000)
          ));
        }
        var rollingRemaining = Math.max(0, Math.round(
          AUTH_CONFIG.SESSION_EXPIRATION - ((Date.now() - sess.createdAt) / 1000)
        ));

        activeSessions.push({
          email: sess.email,
          displayName: sess.displayName || '',
          role: sess.role || RBAC_DEFAULT_ROLE,
          createdAt: sess.absoluteCreatedAt || sess.createdAt,
          lastActivity: sess.lastActivity,
          absoluteRemaining: absRemaining,
          rollingRemaining: rollingRemaining,
          isEmergencyAccess: sess.isEmergencyAccess || false,
          isSelf: (sess.email || '').toLowerCase() === (user.email || '').toLowerCase()
        });
      }
    }
  } catch (e) {
    Logger.log('listActiveSessions error: ' + e.message);
  }

  auditLog('admin_action', user.email, 'list_active_sessions',
    { sessionCount: activeSessions.length });

  return activeSessions;
}

/**
 * Sign out a specific user by email (invalidate all their sessions).
 * Admin-only — requires a valid session with 'admin' permission.
 * Called via google.script.run from the admin session panel.
 */
function adminSignOutUser(sessionToken, targetEmail) {
  var user = validateSessionForData(sessionToken, 'adminSignOutUser');
  checkPermission(user, 'admin', 'adminSignOutUser');

  if (!targetEmail) return { success: false, error: 'no_email' };

  invalidateAllSessions(targetEmail, 'admin_signout');

  auditLog('admin_action', user.email, 'admin_sign_out_user',
    { targetEmail: targetEmail });

  return { success: true, email: targetEmail };
}

// ══════════════
// TEMPLATE START
// ══════════════

// =============================================
// NOAUTH — Web App Entry Point (doGet)
// Shared baseline structure; auth-specific routing added in AUTH section.
// =============================================

// (doGet is defined in the AUTH section below because it requires auth routing)

function doPost(e) {
  var action = (e && e.parameter && e.parameter.action) || "";

  // ⚠️ CRITICAL: Do NOT add authentication, secret checks, or any guards to this deploy handler.
  // The GitHub Actions workflow calls doPost(action=deploy) via webhook to trigger GAS self-update.
  // Adding auth here (e.g. DEPLOY_SECRET check) will silently break auto-updates — the workflow
  // gets "Unauthorized" and the GAS script never pulls new code from GitHub.
  // The deploy action only calls pullAndDeployFromGitHub() which is safe — it overwrites the
  // script with whatever is on GitHub (the source of truth), so there is no abuse vector.
  if (action === "deploy") {
    var result = pullAndDeployFromGitHub();
    // Deploy-time self-registration — a brand-new project appears in the Master ACL
    // Access tab as soon as CI deploys it, without anyone having to open the app first.
    // Clear the registration throttle first so a deploy always rewrites the metadata
    // even when the cached marker is still fresh.
    try { getEpochCache().remove('selfreg_' + ACL_PAGE_NAME); } catch (eReg) {}
    registerSelfProject();
    return ContentService.createTextOutput(result);
  }

  // Data poll via fetch() — eliminates iframe navigation churn that caused
  // "A listener indicated an asynchronous response" errors in the console.
  // Uses doPost + ContentService (which sets CORS headers on ANYONE_ANONYMOUS
  // deployments) instead of doGet + HtmlService iframe navigation.
  if (action === "getData") {
    var dpToken = (e && e.parameter && e.parameter.token) || "";
    var dpResult = processDataPoll(dpToken);
    return ContentService.createTextOutput(JSON.stringify(dpResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Heartbeat via fetch() — same pattern as getData to eliminate iframe churn.
  if (action === "heartbeat") {
    var hbToken = (e && e.parameter && e.parameter.token) || "";
    var hbResult = processHeartbeat(hbToken);
    return ContentService.createTextOutput(JSON.stringify(hbResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Token exchange via fetch() — iframe-free sign-in transport. The iframe flow
  // auto-creates HMAC_SECRET via doGet page loads; the fetch flow enters through
  // doPost, so ensure required Script Properties here too.
  if (action === "exchangeToken") {
    var xtToken = (e && e.parameter && e.parameter.token) || "";
    var xtResult;
    try {
      ensureScriptProperties_();
      xtResult = exchangeTokenForSession(xtToken);
    } catch (xtErr) {
      xtResult = { success: false, error: String((xtErr && xtErr.message) || xtErr) };
    }
    if (xtResult && xtResult.success) xtResult.version = VERSION;
    return ContentService.createTextOutput(JSON.stringify(xtResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Sign-out via fetch() — same iframe-free pattern.
  if (action === "signOut") {
    var soToken = (e && e.parameter && e.parameter.token) || "";
    var soResult;
    try {
      soResult = processSignOut(soToken);
    } catch (soErr) {
      soResult = { type: 'gas-signed-out', success: false, error: String((soErr && soErr.message) || soErr) };
    }
    return ContentService.createTextOutput(JSON.stringify(soResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // PROJECT: Classroom ops via fetch() — same transport rationale as the
  // fetch routes above; session + role + provenance gated in handleClassroomOp_.
  if (action === "classroom") {
    return ContentService.createTextOutput(JSON.stringify(handleClassroomOp_(e)))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput("Unknown action");
}

function getAppData() {
  var data = { version: VERSION, title: TITLE };
  return data;
}

/**
 * Ensure HMAC_SECRET and CACHE_EPOCH exist in Script Properties.
 * Called after a successful deploy — generates defaults if missing.
 * Existing values are never overwritten.
 */
function ensureScriptProperties_() {
  try {
    var props = PropertiesService.getScriptProperties();
    if (!props.getProperty('CACHE_EPOCH')) {
      props.setProperty('CACHE_EPOCH', '1');
    }
    if (!props.getProperty('HMAC_SECRET')) {
      var chars = '0123456789abcdef';
      var secret = '';
      for (var i = 0; i < 64; i++) {
        secret += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      props.setProperty('HMAC_SECRET', secret);
    }
  } catch (e) {
    Logger.log('ensureScriptProperties_ error: ' + e.message);
  }
}

function pullAndDeployFromGitHub() {
  // Audit: Log every deploy trigger for security monitoring
  var auditCache = getEpochCache();
  var deployLog = auditCache.get('deploy_audit_log') || '[]';
  var log;
  try { log = JSON.parse(deployLog); } catch(e) { log = []; }
  log.push({
    timestamp: new Date().toISOString(),
    trigger: 'doPost(action=deploy)',
    currentVersion: VERSION
  });
  if (log.length > 20) log = log.slice(-20);
  auditCache.put('deploy_audit_log', JSON.stringify(log), 21600);

  var GITHUB_TOKEN = PropertiesService.getScriptProperties().getProperty("GITHUB_TOKEN");

  var apiUrl = "https://api.github.com/repos/"
    + GITHUB_OWNER + "/" + GITHUB_REPO + "/contents/" + FILE_PATH
    + "?ref=" + GITHUB_BRANCH + "&t=" + new Date().getTime();

  var fetchHeaders = { "Accept": "application/vnd.github.v3.raw" };
  if (GITHUB_TOKEN) {
    fetchHeaders["Authorization"] = "token " + GITHUB_TOKEN;
  }

  var response = UrlFetchApp.fetch(apiUrl, { headers: fetchHeaders });
  var newCode = response.getContentText();

  var versionMatch = newCode.match(/var VERSION\s*=\s*"([^"]+)"/);
  var pulledVersion = versionMatch ? versionMatch[1] : null;

  if (pulledVersion && pulledVersion === VERSION) {
    return "Already up to date (" + VERSION + ")";
  }

  var scriptId = ScriptApp.getScriptId();
  var url = "https://script.googleapis.com/v1/projects/" + scriptId + "/content";
  var current = UrlFetchApp.fetch(url, {
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() }
  });
  var currentFiles = JSON.parse(current.getContentText()).files;
  var manifest = currentFiles.find(function(f) { return f.name === "appsscript"; });

  var payload = {
    files: [
      { name: "Code", type: "SERVER_JS", source: newCode },
      manifest
    ]
  };

  UrlFetchApp.fetch(url, {
    method: "put",
    contentType: "application/json",
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify(payload)
  });

  // Count existing versions first so we can fail *clearly* if the project has hit Apps Script's
  // version ceiling. Otherwise versions.create throws AFTER the code was already overwritten,
  // leaving the editor on the new version but the live deployment stuck on the old one.
  var totalVersions = 0;
  try {
    var vPageToken = null;
    do {
      var vListUrl = "https://script.googleapis.com/v1/projects/" + scriptId + "/versions"
        + (vPageToken ? "?pageToken=" + vPageToken : "");
      var vListResp = UrlFetchApp.fetch(vListUrl, {
        muteHttpExceptions: true,
        headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() }
      });
      var vListData = JSON.parse(vListResp.getContentText());
      if (vListData.versions) totalVersions += vListData.versions.length;
      vPageToken = vListData.nextPageToken || null;
    } while (vPageToken);
  } catch (countErr) { totalVersions = -1; }

  if (totalVersions >= 200) {
    return "DEPLOY HALTED — code updated to " + pulledVersion + " but the version limit ("
      + totalVersions + "/200) is reached, so the live deployment is STILL on the old version. "
      + "Free up versions in the Apps Script editor, then redeploy.";
  }

  var versionUrl = "https://script.googleapis.com/v1/projects/" + scriptId + "/versions";
  var versionResponse = UrlFetchApp.fetch(versionUrl, {
    method: "post",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({ description: pulledVersion + " — from GitHub " + new Date().toLocaleString() })
  });
  if (versionResponse.getResponseCode() >= 300) {
    return "DEPLOY FAILED creating a new version — code was updated to " + pulledVersion
      + " but the live deployment was NOT advanced (still on the old version). HTTP "
      + versionResponse.getResponseCode() + ": " + versionResponse.getContentText();
  }
  var newVersion = JSON.parse(versionResponse.getContentText()).versionNumber;

  var deployUrl = "https://script.googleapis.com/v1/projects/" + scriptId
    + "/deployments/" + DEPLOYMENT_ID;
  var deployResp = UrlFetchApp.fetch(deployUrl, {
    method: "put",
    contentType: "application/json",
    muteHttpExceptions: true,
    headers: { "Authorization": "Bearer " + ScriptApp.getOAuthToken() },
    payload: JSON.stringify({
      deploymentConfig: {
        scriptId: scriptId,
        versionNumber: newVersion,
        description: pulledVersion + " (deployment " + newVersion + ")"
      }
    })
  });
  if (deployResp.getResponseCode() >= 300) {
    return "DEPLOY FAILED repointing the deployment — version " + newVersion
      + " was created but the live deployment was NOT updated to it. HTTP "
      + deployResp.getResponseCode() + ": " + deployResp.getContentText();
  }

  // Auto-initialize required Script Properties on first deploy
  ensureScriptProperties_();

  return "Updated to " + pulledVersion + " (deployment " + newVersion + ") | "
    + (totalVersions + 1) + "/200";
}

// ══════════════
// TEMPLATE END
// ══════════════

// ══════════════
// AUTH START
// ══════════════

// =============================================
// AUTH — HTML/JS Output Escaping (XSS Prevention)
// Prevents injection via user-controlled values in generated HTML/JS strings.
// =============================================

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeJs(str) {
  if (!str) return '';
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/</g, '\\x3c')
    .replace(/>/g, '\\x3e')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r');
}

// =============================================
// AUTH — Conditional Audit Logger (Toggle-Gated)
// No-op when AUTH_CONFIG.ENABLE_AUDIT_LOG === false.
// =============================================

function auditLog(event, user, result, details) {
  if (!AUTH_CONFIG.ENABLE_AUDIT_LOG) return;
  _writeAuditLogEntry(event, user, result, details);
}

function _writeAuditLogEntry(event, user, result, details) {
  try {
    if (!SPREADSHEET_ID || SPREADSHEET_ID === "YOUR_SPREADSHEET_ID") return;
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheet = ss.getSheetByName(AUTH_CONFIG.AUDIT_LOG_SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(AUTH_CONFIG.AUDIT_LOG_SHEET_NAME);
      sheet.appendRow(['Timestamp', 'Event', 'User', 'Result', 'Details']);
      var protection = sheet.protect();
      protection.setDescription('Session Audit Log — protected');
      protection.setWarningOnly(true);
    }
    sheet.appendRow([
      new Date().toISOString(),
      event,
      user,
      result,
      JSON.stringify(details || {})
    ]);
  } catch(e) {
    Logger.log('Audit log error: ' + e.message);
  }
}

// =============================================
// AUTH — Data-Level Audit Logger (Toggle-Gated, Phase 8)
// No-op when AUTH_CONFIG.ENABLE_DATA_AUDIT_LOG === false.
// Separate from session audit log — captures per-operation PHI access events.
// =============================================

function dataAuditLog(user, action, resourceType, resourceId, details) {
  if (!AUTH_CONFIG.ENABLE_DATA_AUDIT_LOG) return;
  try {
    if (!SPREADSHEET_ID || SPREADSHEET_ID === "YOUR_SPREADSHEET_ID") return;
    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheetName = AUTH_CONFIG.DATA_AUDIT_LOG_SHEET_NAME || 'DataAuditLog';
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow([
        'Timestamp',
        'User',
        'Action',
        'ResourceType',
        'ResourceId',
        'Details',
        'SessionId',
        'IsEmergencyAccess'
      ]);
      var protection = sheet.protect();
      protection.setDescription('HIPAA Data Audit Log — protected');
      protection.setWarningOnly(true);
    }
    sheet.appendRow([
      new Date().toISOString(),
      user.email || user,
      action,
      resourceType,
      resourceId || '',
      JSON.stringify(details || {}),
      details && details.sessionId ? details.sessionId.substring(0, 8) + '...' : '',
      details && details.isEmergencyAccess ? 'YES' : 'NO'
    ]);
  } catch(e) {
    Logger.log('Data audit log error: ' + e.message);
  }
}

// =============================================
// AUTH — HMAC Session Integrity (Toggle-Gated)
// =============================================

function generateSessionHmac(sessionData) {
  if (!AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) return '';
  var secret = PropertiesService.getScriptProperties().getProperty(AUTH_CONFIG.HMAC_SECRET_PROPERTY);
  if (!secret) {
    // FAIL CLOSED: HMAC is enabled but secret is missing — this is a misconfiguration.
    // Log a security alert and throw to prevent session creation without integrity protection.
    auditLog('security_alert', sessionData.email || 'system', 'hmac_secret_missing',
      { property: AUTH_CONFIG.HMAC_SECRET_PROPERTY });
    throw new Error('HMAC integrity is enabled but HMAC_SECRET is not configured in Script Properties. '
      + 'This should auto-generate on first deploy via pullAndDeployFromGitHub(). '
      + 'If missing, verify deployment completed successfully or set manually: GAS Editor → Project Settings → Script Properties → Add: '
      + AUTH_CONFIG.HMAC_SECRET_PROPERTY + ' = <random-64-char-hex-string>');
  }
  var payload = sessionData.email
    + '|' + sessionData.createdAt
    + '|' + sessionData.lastActivity
    + '|' + (sessionData.absoluteCreatedAt || '')
    + '|' + (sessionData.displayName || '')
    + '|' + (sessionData.tokenObtainedAt || '');
  var signature = Utilities.computeHmacSha256Signature(payload, secret);
  return Utilities.base64Encode(signature);
}

function verifySessionHmac(sessionData) {
  if (!AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) return true;
  var secret = PropertiesService.getScriptProperties().getProperty(AUTH_CONFIG.HMAC_SECRET_PROPERTY);
  if (!secret) {
    // FAIL CLOSED: cannot verify without a secret — reject the session
    auditLog('security_alert', sessionData.email || 'unknown', 'hmac_secret_missing_verify',
      { property: AUTH_CONFIG.HMAC_SECRET_PROPERTY });
    return false;
  }
  if (!sessionData.hmac) return false;  // Secret exists but session has no HMAC → reject
  var expected = generateSessionHmac(sessionData);
  return expected === sessionData.hmac;
}

// ── GAS-Side HMAC-SHA256 Message Signing ──
// Uses Utilities.computeHmacSha256Signature() — native GAS API.
// This is the SAME algorithm as Web Crypto API HMAC-SHA256.
// The outputs are byte-for-byte identical when given the same key and payload.

/**
 * Sign a message object with HMAC-SHA256 using the session's messageKey.
 * @param {Object} msgObj - The message to sign (will have _sig added)
 * @param {string} messageKey - The session's HMAC key
 * @returns {Object} - The message with _sig field containing hex-encoded signature
 */
function signMessage(msgObj, messageKey) {
  if (!messageKey) return msgObj;

  // Create a deterministic payload — sorted keys, exclude _sig
  var copy = {};
  var keys = Object.keys(msgObj).sort();
  for (var i = 0; i < keys.length; i++) {
    if (keys[i] !== '_sig') copy[keys[i]] = msgObj[keys[i]];
  }
  var payload = JSON.stringify(copy);

  // Compute HMAC-SHA256 using GAS native API
  var signature = Utilities.computeHmacSha256Signature(payload, messageKey);

  // Convert signed byte array to hex string
  // GAS returns signed bytes (-128 to 127), must mask to unsigned (0-255)
  var hex = signature.map(function(byte) {
    return ('0' + (byte & 0xff).toString(16)).slice(-2);
  }).join('');

  msgObj._sig = hex;
  return msgObj;
}

// =============================================
// AUTH — Session Management (Server-Side)
// Toggle-gated: domain restriction, HMAC, audit, emergency access
// =============================================

function exchangeTokenForSession(accessToken) {
  if (!accessToken) {
    return { success: false, error: "no_token" };
  }

  // Rate limiting: configurable via ENABLE_ESCALATING_LOCKOUT toggle
  var rlCache = getEpochCache();
  var tokenFingerprint = 'ratelimit_' + accessToken.substring(0, 16);
  var attempts = rlCache.get(tokenFingerprint);
  var attemptCount = attempts ? parseInt(attempts, 10) : 0;

  if (!AUTH_CONFIG.ENABLE_ESCALATING_LOCKOUT) {
    // Standard preset: flat rate limit (5 failures / 5-minute window)
    if (attemptCount >= 5) {
      auditLog('login_failed', '', 'rate_limited', { fingerprint: tokenFingerprint.substring(0, 20) });
      return { success: false, error: "rate_limited" };
    }
  } else {
    // HIPAA preset: escalating lockout tiers
    // Tier 1: 5 failures → 5 min lockout
    // Tier 2: 10 cumulative failures → 30 min lockout
    // Tier 3: 20 cumulative failures → 6 hr lockout
    var LOCKOUT_TIER1 = 5;
    var LOCKOUT_TIER2 = 10;
    var LOCKOUT_TIER3 = 20;
    var LOCKOUT_TIER1_DURATION = 300;    // 5 minutes
    var LOCKOUT_TIER2_DURATION = 1800;   // 30 minutes
    var LOCKOUT_TIER3_DURATION = 21600;  // 6 hours

    if (attemptCount >= LOCKOUT_TIER3) {
      auditLog('security_alert', '', 'account_locked_tier3',
        { fingerprint: tokenFingerprint.substring(0, 20), attempts: attemptCount });
      return { success: false, error: "account_locked" };
    }
    if (attemptCount >= LOCKOUT_TIER2) {
      auditLog('login_failed', '', 'rate_limited_tier2',
        { fingerprint: tokenFingerprint.substring(0, 20), attempts: attemptCount });
      return { success: false, error: "rate_limited" };
    }
    if (attemptCount >= LOCKOUT_TIER1) {
      auditLog('login_failed', '', 'rate_limited',
        { fingerprint: tokenFingerprint.substring(0, 20), attempts: attemptCount });
      return { success: false, error: "rate_limited" };
    }
  }

  // Compute lockout TTL for failed login increments
  var rlTtl = 300;  // Default: 5 minutes (standard preset flat rate limit)
  if (AUTH_CONFIG.ENABLE_ESCALATING_LOCKOUT) {
    var nextCount = attemptCount + 1;
    if (nextCount >= 20) rlTtl = 21600;       // Tier 3: 6 hours
    else if (nextCount >= 10) rlTtl = 1800;   // Tier 2: 30 minutes
    // else rlTtl stays 300 (Tier 1: 5 minutes)
  }

  var userInfo = validateGoogleToken(accessToken);
  if (!userInfo || userInfo.status === "not_signed_in") {
    auditLog('login_failed', '', 'invalid_token', { reason: 'Google token validation failed' });
    rlCache.put(tokenFingerprint, String(attemptCount + 1), rlTtl);
    return { success: false, error: "invalid_token" };
  }

  // Domain restriction (toggle-gated)
  if (AUTH_CONFIG.ENABLE_DOMAIN_RESTRICTION) {
    // Fail closed: empty allowlist with domain restriction enabled is a misconfiguration
    if (!AUTH_CONFIG.ALLOWED_DOMAINS || AUTH_CONFIG.ALLOWED_DOMAINS.length === 0) {
      auditLog('security_alert', userInfo.email, 'domain_restriction_misconfigured',
        { reason: 'ENABLE_DOMAIN_RESTRICTION is true but ALLOWED_DOMAINS is empty' });
      return { success: false, error: "domain_not_configured" };
    }
    var emailDomain = userInfo.email.split('@')[1].toLowerCase();
    var domainAllowed = false;
    for (var i = 0; i < AUTH_CONFIG.ALLOWED_DOMAINS.length; i++) {
      if (emailDomain === AUTH_CONFIG.ALLOWED_DOMAINS[i].toLowerCase()) {
        domainAllowed = true;
        break;
      }
    }
    if (!domainAllowed) {
      auditLog('login_failed', userInfo.email, 'domain_rejected',
        { domain: emailDomain, allowed: AUTH_CONFIG.ALLOWED_DOMAINS.join(',') });
      rlCache.put(tokenFingerprint, String(attemptCount + 1), rlTtl);
      return { success: false, error: "domain_not_allowed" };
    }
  }

  // Check access via master ACL spreadsheet (or fall back to SPREADSHEET_ID editor/viewer list)
  // Returns RBAC-aware object: { hasAccess, role, isEmergencyAccess }
  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID";
  var accessResult = { hasAccess: true, role: RBAC_DEFAULT_ROLE, isEmergencyAccess: false };
  if (hasAcl || hasSheet) {
    accessResult = checkSpreadsheetAccess(userInfo.email);
    // The access list could not be read, so we do not know whether this user is
    // authorized. Reported separately from a denial, and deliberately NOT counted
    // as a failed attempt — otherwise a Sheets outage walks legitimate users up
    // the lockout tiers while they retry.
    if (accessResult.aclUnavailable) {
      return { success: false, error: "acl_unavailable", reason: accessResult.reason };
    }
    if (!accessResult.hasAccess) {
      auditLog('login_failed', userInfo.email, 'access_denied',
        { reason: 'No spreadsheet access' });
      rlCache.put(tokenFingerprint, String(attemptCount + 1), rlTtl);
      return { success: false, error: "not_authorized" };
    }
  }

  // Enforce single-session (configurable)
  if (AUTH_CONFIG.MAX_SESSIONS_PER_USER > 0) {
    invalidateAllSessions(userInfo.email);
  }

  // Create session token (cryptographically random UUID)
  var sessionToken = Utilities.getUuid() + Utilities.getUuid();
  sessionToken = sessionToken.replace(/-/g, "").substring(0, 48);

  // Generate a per-session message signing key for cryptographic message authentication.
  // GAS signs outgoing postMessages with this key; the HTML parent verifies signatures.
  var messageKey = Utilities.getUuid().replace(/-/g, '');

  var sessionData = {
    email: userInfo.email,
    displayName: userInfo.displayName,
    // accessToken intentionally NOT stored — only needed for the initial
    // validateGoogleToken() call above, then discarded (least privilege)
    createdAt: Date.now(),
    absoluteCreatedAt: Date.now(),
    lastActivity: Date.now(),
    tokenObtainedAt: Date.now(),
    messageKey: messageKey,
    // RBAC: role and permissions stored in session for fast permission checks
    // HIPAA: §164.308(a)(4)(ii) — access authorization based on role
    role: accessResult.role,
    permissions: getRolesFromSpreadsheet()[accessResult.role] || [],
    isEmergencyAccess: accessResult.isEmergencyAccess
  };

  // HMAC integrity (toggle-gated)
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    sessionData.hmac = generateSessionHmac(sessionData);
  }

  var cache = getEpochCache();
  cache.put("session_" + sessionToken, JSON.stringify(sessionData), AUTH_CONFIG.SESSION_EXPIRATION);

  trackUserSession(userInfo.email, sessionToken);

  // Clear rate limit on successful login
  rlCache.remove(tokenFingerprint);

  auditLog('login_success', userInfo.email, 'session_created',
    { sessionId: sessionToken.substring(0, 8) + '...', role: accessResult.role,
      isEmergencyAccess: accessResult.isEmergencyAccess });

  return {
    success: true,
    sessionToken: sessionToken,
    email: userInfo.email,
    displayName: userInfo.displayName,
    absoluteTimeout: AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT || 0,
    messageKey: messageKey,
    role: accessResult.role,
    permissions: getRolesFromSpreadsheet()[accessResult.role] || []
  };
}

function validateSession(sessionToken) {
  if (!sessionToken || sessionToken.length < 32) {
    return { status: "not_signed_in" };
  }

  var cache = getEpochCache();
  var raw = cache.get("session_" + sessionToken);
  if (!raw) {
    // Check for eviction tombstone — tells the client WHY the session is gone.
    // Don't remove it — let it expire naturally (5 min TTL) so both heartbeat
    // and page refresh can read it independently.
    var evictionReason = cache.get("evicted_" + sessionToken) || '';
    if (evictionReason) {
      return { status: "not_signed_in", evictionReason: evictionReason };
    }
    return { status: "not_signed_in" };
  }

  var sessionData;
  try {
    sessionData = JSON.parse(raw);
  } catch (e) {
    return { status: "not_signed_in" };
  }

  // HMAC verification (toggle-gated)
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    if (!verifySessionHmac(sessionData)) {
      auditLog('security_alert', sessionData.email || 'unknown', 'hmac_mismatch',
        { sessionId: sessionToken.substring(0, 8) + '...' });
      cache.remove("session_" + sessionToken);
      return { status: "not_signed_in" };
    }
  }

  // Absolute session timeout — hard ceiling that heartbeats cannot extend
  if (sessionData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
    var absoluteElapsed = (Date.now() - sessionData.absoluteCreatedAt) / 1000;
    if (absoluteElapsed > AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
      auditLog('session_expired', sessionData.email, 'absolute_timeout',
        { elapsed: Math.round(absoluteElapsed) + 's', limit: AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT + 's' });
      cache.remove("session_" + sessionToken);
      return { status: "not_signed_in" };
    }
  }

  // Authoritative expiry check (rolling — reset by heartbeats)
  var elapsed = (Date.now() - sessionData.createdAt) / 1000;
  if (elapsed > AUTH_CONFIG.SESSION_EXPIRATION) {
    auditLog('session_expired', sessionData.email, 'timeout',
      { elapsed: Math.round(elapsed) + 's', limit: AUTH_CONFIG.SESSION_EXPIRATION + 's' });
    cache.remove("session_" + sessionToken);
    return { status: "not_signed_in" };
  }

  // Check if Google token needs refresh
  var needsReauth = checkGoogleTokenExpiry(sessionData);

  // Update last activity (extends the CacheService TTL)
  sessionData.lastActivity = Date.now();
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    sessionData.hmac = generateSessionHmac(sessionData);
  }
  cache.put("session_" + sessionToken, JSON.stringify(sessionData), AUTH_CONFIG.SESSION_EXPIRATION);

  return {
    status: "authorized",
    email: sessionData.email,
    displayName: sessionData.displayName,
    needsReauth: needsReauth,
    role: sessionData.role || RBAC_DEFAULT_ROLE,
    permissions: sessionData.permissions || getRolesFromSpreadsheet()[sessionData.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE]
  };
}

// =============================================
// AUTH — Data Operation Session Gate
// Every google.script.run that touches patient data must call this first.
// Returns the validated session data (email, etc.) or throws if invalid.
// HIPAA: 45 CFR § 164.312(a)(1) — verify identity before every data access
// =============================================

function validateSessionForData(sessionToken, operationName) {
  // Toggle check — standard preset skips full validation but still extracts
  // role/permissions from the session cache so permission checks work correctly
  if (!AUTH_CONFIG.ENABLE_DATA_OP_VALIDATION) {
    var skipResult = { email: 'unvalidated', displayName: '', role: RBAC_DEFAULT_ROLE, permissions: [] };
    if (sessionToken) {
      try {
        var skipCache = getEpochCache();
        var skipRaw = skipCache.get("session_" + sessionToken);
        if (skipRaw) {
          var skipSession = JSON.parse(skipRaw);
          skipResult.email = skipSession.email || 'unvalidated';
          skipResult.role = skipSession.role || RBAC_DEFAULT_ROLE;
          skipResult.permissions = skipSession.permissions || getRolesFromSpreadsheet()[skipResult.role] || [];
        }
      } catch (e) { /* fall through with defaults */ }
    }
    return skipResult;
  }

  if (!sessionToken || sessionToken.length < 32) {
    auditLog('security_alert', 'unknown', 'data_access_no_token',
      { operation: operationName });
    throw new Error('SESSION_EXPIRED');
  }

  var cache = getEpochCache();
  var raw = cache.get("session_" + sessionToken);
  if (!raw) {
    // Check for eviction tombstone
    var evicted = cache.get("evicted_" + sessionToken);
    auditLog('security_alert', 'unknown', 'data_access_expired_session',
      { operation: operationName, reason: evicted || 'timeout' });
    throw new Error(evicted ? 'SESSION_EVICTED' : 'SESSION_EXPIRED');
  }

  var sessionData;
  try {
    sessionData = JSON.parse(raw);
  } catch (e) {
    auditLog('security_alert', 'unknown', 'data_access_corrupt_session',
      { operation: operationName });
    throw new Error('SESSION_CORRUPT');
  }

  // HMAC verification
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY && !verifySessionHmac(sessionData)) {
    auditLog('security_alert', sessionData.email || 'unknown', 'data_access_hmac_failed',
      { operation: operationName });
    cache.remove("session_" + sessionToken);
    throw new Error('SESSION_INTEGRITY_VIOLATION');
  }

  // Absolute timeout check
  if (sessionData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
    var absElapsed = (Date.now() - sessionData.absoluteCreatedAt) / 1000;
    if (absElapsed > AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
      auditLog('security_alert', sessionData.email, 'data_access_absolute_timeout',
        { operation: operationName, elapsed: Math.round(absElapsed) + 's' });
      cache.remove("session_" + sessionToken);
      throw new Error('SESSION_EXPIRED');
    }
  }

  // Rolling timeout check
  var elapsed = (Date.now() - sessionData.createdAt) / 1000;
  if (elapsed > AUTH_CONFIG.SESSION_EXPIRATION) {
    auditLog('security_alert', sessionData.email, 'data_access_rolling_timeout',
      { operation: operationName, elapsed: Math.round(elapsed) + 's' });
    cache.remove("session_" + sessionToken);
    throw new Error('SESSION_EXPIRED');
  }

  // Session is valid — return user identity, role, and context for audit logging
  return {
    email: sessionData.email,
    displayName: sessionData.displayName,
    clientIp: sessionData.clientIp || 'not-collected',
    isEmergencyAccess: sessionData.isEmergencyAccess || false,
    role: sessionData.role || RBAC_DEFAULT_ROLE,
    permissions: sessionData.permissions || getRolesFromSpreadsheet()[sessionData.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE]
  };
}

// =============================================
// DATA OPERATIONS — Session-gated
// Every function that reads/writes data must call validateSessionForData() first.
// Add your project-specific data operations here. Example:
//
// function saveRecord(sessionToken, recordData) {
//   var user = validateSessionForData(sessionToken, 'saveRecord');
//   checkPermission(user, 'write', 'saveRecord');
//   // ... your data operation here ...
//   bumpDataRev();   // let other signed-in viewers pick up the change (live sync)
//   return { success: true, email: user.email };
// }
// =============================================

// ── Live data revision (multi-user sync) ──
// A cheap CacheService token bumped on every shared-data write. The client polls
// getDataRev() (no sheet read) and only re-fetches data when the token changes — so
// multiple users see each other's edits within seconds without hammering the sheet or
// quota. Call bumpDataRev() at the end of EVERY project function that writes shared
// data (see the DATA OPERATIONS example above); the polling countdown UI and the poll
// loop itself are template code — projects only override window._onLiveDataChange
// (client side) to re-fetch and re-render their own data.
function bumpDataRev() {
  try { CacheService.getScriptCache().put('DATA_REV', String(Date.now()) + '-' + Math.floor(Math.random() * 100000), 21600); } catch (e) {}
}
function getDataRev(sessionToken) {
  validateSessionForData(sessionToken, 'getDataRev');   // throws on invalid/expired session
  return { rev: (CacheService.getScriptCache().get('DATA_REV') || '') };
}

function invalidateSession(sessionToken) {
  if (!sessionToken) return;
  var cache = getEpochCache();
  var raw = cache.get("session_" + sessionToken);
  if (raw) {
    try {
      var sessionData = JSON.parse(raw);
      removeUserSession(sessionData.email, sessionToken);
      auditLog('sign_out', sessionData.email, 'session_invalidated',
        { sessionId: sessionToken.substring(0, 8) + '...' });
    } catch (e) {}
  }
  cache.remove("session_" + sessionToken);
}

// Generates a one-time-use nonce that binds a validated session to a single page load.
// Flow: GAS serves handshake page → parent sends session token via postMessage →
// handshake page calls generatePageNonce() → navigates to ?page_nonce=NONCE →
// doGet() validates nonce → serves authenticated content.
// This ensures the session token NEVER appears in the URL.

function generatePageNonce(sessionToken) {
  var session = validateSession(sessionToken);
  if (session.status !== 'authorized') {
    return { success: false, error: session.status };
  }
  var nonce = Utilities.getUuid();
  var cache = getEpochCache();
  // Store nonce → session token mapping with 60-second TTL (one-time use).
  // 60s allows for the two-step flow: load getNonce listener → get nonce → reload iframe.
  cache.put('page_nonce_' + nonce, sessionToken, 60);
  return { success: true, nonce: nonce };
}

function validatePageNonce(nonce) {
  if (!nonce || nonce.length < 10) return null;
  var cache = getEpochCache();
  var sessionToken = cache.get('page_nonce_' + nonce);
  if (!sessionToken) return null;
  // One-time use: delete the nonce immediately
  cache.remove('page_nonce_' + nonce);
  return sessionToken;
}

function invalidateAllSessions(email, reason) {
  if (!email) return;
  var evictionReason = reason || 'new_sign_in';
  var cache = getEpochCache();
  var trackKey = "sessions_" + email.toLowerCase();
  var raw = cache.get(trackKey);
  if (!raw) return;
  try {
    var tokens = JSON.parse(raw);
    for (var i = 0; i < tokens.length; i++) {
      cache.remove("session_" + tokens[i]);
      // Leave a tombstone so the heartbeat/validateSession handler knows WHY
      // the session disappeared. Short TTL (5 minutes) — just needs to survive
      // until the old device's next heartbeat fires or page refresh.
      // After that, natural expiry is assumed (no tombstone = timed out normally).
      cache.put("evicted_" + tokens[i], evictionReason, 300);
    }
    if (tokens.length > 0) {
      auditLog('session_management', email, 'all_sessions_invalidated',
        { count: tokens.length });
    }
  } catch (e) {}
  cache.remove(trackKey);
}

// =============================================
// AUTH — Google Token Operations (Server-Side Only)
// =============================================

function validateGoogleToken(accessToken) {
  try {
    var resp = UrlFetchApp.fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { "Authorization": "Bearer " + accessToken },
        muteHttpExceptions: true
      }
    );
    if (resp.getResponseCode() !== 200) {
      return { status: "not_signed_in" };
    }
    var info = JSON.parse(resp.getContentText());
    if (!info.email) {
      return { status: "not_signed_in" };
    }
    var prefix = info.email.split("@")[0];
    var displayName = prefix.split(/[._-]/).map(function(part) {
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }).join(" ");
    return { status: "authorized", email: info.email, displayName: displayName };
  } catch (e) {
    return { status: "not_signed_in" };
  }
}

function checkGoogleTokenExpiry(sessionData) {
  var tokenAge = (Date.now() - sessionData.tokenObtainedAt) / 1000;
  return tokenAge >= (AUTH_CONFIG.OAUTH_TOKEN_LIFETIME - AUTH_CONFIG.OAUTH_REFRESH_BUFFER);
}

// =============================================
// AUTH — Session Tracking (for single-session enforcement)
// =============================================

function trackUserSession(email, sessionToken) {
  var cache = getEpochCache();
  var trackKey = "sessions_" + email.toLowerCase();
  var raw = cache.get(trackKey);
  var tokens = [];
  if (raw) {
    try { tokens = JSON.parse(raw); } catch (e) {}
  }
  tokens.push(sessionToken);
  cache.put(trackKey, JSON.stringify(tokens), AUTH_CONFIG.SESSION_EXPIRATION);
}

function removeUserSession(email, sessionToken) {
  if (!email) return;
  var cache = getEpochCache();
  var trackKey = "sessions_" + email.toLowerCase();
  var raw = cache.get(trackKey);
  if (!raw) return;
  try {
    var tokens = JSON.parse(raw);
    tokens = tokens.filter(function(t) { return t !== sessionToken; });
    if (tokens.length > 0) {
      cache.put(trackKey, JSON.stringify(tokens), AUTH_CONFIG.SESSION_EXPIRATION);
    } else {
      cache.remove(trackKey);
    }
  } catch (e) {}
}

// =============================================
// AUTH — Authorization (Spreadsheet Access + Emergency Access)
// Toggle-gated: emergency access override
// =============================================

// checkSpreadsheetAccess returns an RBAC-aware result object:
//   { hasAccess: true,  role: 'admin', isEmergencyAccess: false }
//   { hasAccess: false, role: null,    isEmergencyAccess: false }
// ── OWNER-RUN DIAGNOSTIC — authorization grant ───────────────────────
// Run this from the editor's Run dropdown when a Google service call fails on
// permissions even though appsscript.json already declares the scope.
//
// Declaring a scope and holding a grant for it are different things. The
// manifest is only the REQUEST list; the grant is a separate record tied to the
// account that authorized the script, and Google's granular consent lets a user
// approve some permissions while leaving others unticked. Apps Script re-prompts
// only when the requested set CHANGES or the grant is revoked — never on a
// failure — so reading the manifest, finding it correct and changing nothing
// cannot produce a consent screen, and a partial grant persists indefinitely.
//
// Deliberately has NO trailing underscore: underscore-suffixed functions are
// hidden from the editor's Run dropdown, and this one must be runnable by hand.
function diagnoseAuthorization() {
  Logger.log('== Authorization diagnosis ==');
  try {
    Logger.log('Running as: ' + Session.getEffectiveUser().getEmail()
      + '   (must be the account that owns / deploys this script)');
  } catch (eU) {
    Logger.log('Could not read the effective user: ' + eU.message);
  }

  var info;
  try {
    info = ScriptApp.getAuthorizationInfo(ScriptApp.AuthMode.FULL);
  } catch (eI) {
    Logger.log('Could not read authorization info: ' + eI.message);
    return;
  }
  Logger.log('Authorization status: ' + String(info.getAuthorizationStatus()));

  // Optional: not present on every runtime. When it is, it settles the question
  // outright — this is what the grant actually covers, as against what the
  // manifest merely asks for.
  try {
    var granted = info.getAuthorizedScopes();
    if (granted && granted.length) {
      Logger.log('Scopes actually GRANTED (' + granted.length + '):');
      for (var g = 0; g < granted.length; g++) Logger.log('      ' + granted[g]);
      Logger.log('   -> Anything the manifest declares that is NOT in this list is the gap.');
    }
  } catch (eS) { /* unavailable on this runtime — status + URL below still decide it */ }

  // Always report the DECLARED list too. A scope can be absent from the grant
  // for two opposite reasons — the manifest never asked for it, or the manifest
  // asked and the user did not approve it — and the granted list alone cannot
  // tell them apart. Printing both side by side makes the gap self-evident and,
  // importantly, gives diagnoseOauthScopes_ a caller: it is hidden from the Run
  // dropdown by its trailing underscore, so without this it is unreachable in
  // every project that lacks diagnoseAclAccess.
  Logger.log('Declared in the manifest:');
  diagnoseOauthScopes_();

  var url = info.getAuthorizationUrl();
  if (url) {
    Logger.log('THE GRANT IS INCOMPLETE. Open this URL, approve, then re-run diagnoseAclAccess:');
    Logger.log('   ' + url);
    Logger.log('   Open it signed in as the account named above, and approve EVERY permission shown — '
      + 'one unticked box reproduces this exact failure.');
    return;
  }

  Logger.log('No authorization is outstanding — the grant already covers every scope the manifest DECLARES.');
  Logger.log('-> Read the two lists above against each other before anything else:');
  Logger.log('   * A scope this app uses that is missing from BOTH lists = the manifest under-declares it. '
    + 'Add it to oauthScopes (Project Settings -> "Show appsscript.json"), save, then run this again — '
    + 'changing the declared set is what makes Apps Script finally prompt for consent.');
  Logger.log('   * A scope in the DECLARED list but not the GRANTED list would have produced an '
    + 'authorization URL above, so if none appeared, that is not what is happening here.');
  Logger.log('-> If both lists already cover everything and a call still fails, check these, in order:');
  Logger.log('   1. Project Settings -> Google Cloud Platform (GCP) Project. If this is a STANDARD project '
    + 'rather than the default one, its OAuth consent screen must list the scope, and the app must not be '
    + 'stuck in Testing with this account missing from the test users.');
  Logger.log('   2. The account named above. A second signed-in Google account is the usual cause of '
    + '"it works when I open the file but not when the script does".');
  Logger.log('   3. Force a completely fresh consent: revoke this project at '
    + 'https://myaccount.google.com/permissions, then run any function here again.');
}

// ── OWNER-RUN DIAGNOSTIC — OAuth scope report ────────────────────────
// Prints the project's declared oauthScopes and names any this app needs but
// does not declare. Pairs with diagnoseAuthorization: this one covers what is
// REQUESTED, that one covers what is GRANTED, and a permissions error can come
// from either — the two are indistinguishable from the error text alone.
//
// The manifest is not in the repo (the self-deploy preserves whatever manifest
// the project already has), so reading it back at runtime is the only way to
// see it without opening the editor.
function diagnoseOauthScopes_() {
  var REQUIRED = {
    'https://www.googleapis.com/auth/spreadsheets': 'SpreadsheetApp — the Master ACL and every data sheet',
    'https://www.googleapis.com/auth/drive': 'DriveApp / Drive REST — file storage',
    'https://www.googleapis.com/auth/script.external_request': 'UrlFetchApp — GitHub pulls and self-deploy',
    'https://www.googleapis.com/auth/script.projects': 'self-deploy — reads and rewrites its own source',
    'https://www.googleapis.com/auth/script.deployments': 'self-deploy — creates versions and deployments',
    'https://www.googleapis.com/auth/script.send_mail': 'MailApp — alerting',
    'https://www.googleapis.com/auth/script.scriptapp': 'ScriptApp.newTrigger — self-installed triggers'
  };
  try {
    var resp = UrlFetchApp.fetch(
      'https://script.googleapis.com/v1/projects/' + ScriptApp.getScriptId() + '/content',
      { muteHttpExceptions: true,
        headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() } });
    if (resp.getResponseCode() >= 300) {
      Logger.log('   Could not read the manifest (HTTP ' + resp.getResponseCode() + '). Check by hand: '
        + 'Project Settings -> tick "Show appsscript.json manifest file in editor".');
      return;
    }
    var files = JSON.parse(resp.getContentText()).files || [];
    var manifest = null;
    for (var i = 0; i < files.length; i++) {
      if (files[i].name === 'appsscript') manifest = files[i];
    }
    if (!manifest) { Logger.log('   No appsscript manifest was returned.'); return; }
    var declared = JSON.parse(manifest.source).oauthScopes;
    if (!declared || !declared.length) {
      Logger.log('   The manifest declares NO explicit oauthScopes, so Apps Script derives them from the '
        + 'code. A permissions error in that case means the grant is incomplete — run diagnoseAuthorization.');
      return;
    }
    Logger.log('   Declared oauthScopes (' + declared.length + '):');
    for (var d = 0; d < declared.length; d++) Logger.log('      ' + declared[d]);
    var missing = [];
    for (var need in REQUIRED) {
      if (REQUIRED.hasOwnProperty(need) && declared.indexOf(need) === -1) missing.push(need);
    }
    if (!missing.length) {
      Logger.log('   Every scope this app uses IS declared — so the declaration is not the problem. '
        + 'Compare this list against the GRANTED list printed above: if they match, the grant is '
        + 'complete and a permissions error is coming from somewhere else (see the checks below).');
      return;
    }
    Logger.log('   MISSING ' + missing.length + ' declaration(s) — each one breaks the feature named after it:');
    for (var m = 0; m < missing.length; m++) {
      Logger.log('      ' + missing[m] + '   <- ' + REQUIRED[missing[m]]);
    }
    Logger.log('   -> Fix: Project Settings -> tick "Show appsscript.json manifest file in editor" -> add '
      + 'the scope(s) to oauthScopes -> save -> run any function here and APPROVE the consent screen.');
  } catch (e) {
    Logger.log('   Scope check failed: ' + e.message);
  }
}

// ── ACL availability grace (last-known-good snapshot) ────────────────
// Three separate incidents have now taken every user of an app offline at
// once because the Master ACL could not be READ — most recently a missing
// `spreadsheets` OAuth grant, which makes SpreadsheetApp.openById throw for
// every caller until the owner re-consents in Google. The verdict in that
// state is UNKNOWN, and answering "no" to a user the list has repeatedly
// said "yes" to is the least accurate answer available.
//
// So every successful read stores the page's allow-list, and an unreadable
// ACL is answered from that snapshot instead of locking the app out.
// Deliberate boundaries, because this trades some security for availability:
//   * It can only ever REPRODUCE a "yes" the real ACL already gave. An email
//     absent from the snapshot is still denied — a user added during an
//     outage waits, which is the safe direction to fail.
//   * It never denies from the snapshot. Removals are honoured the moment the
//     list is readable again (within the normal 10-minute access cache).
//   * A revoked user can therefore retain access for at most
//     ACL_GRACE_MAX_AGE_SEC after the last good read. Set ACL_GRACE_ENABLED
//     to false for strict-denial compliance, accepting total lockouts.
// Every grace grant writes a security_alert audit row, so a degraded period is
// reconstructable afterwards rather than silent.
var ACL_GRACE_ENABLED = true;
var ACL_GRACE_MAX_AGE_SEC = 86400;  // 24h — covers an outage that starts on a Friday
var ACL_GRACE_MAX_ENTRIES = 200;    // Script Properties values cap at ~9KB

function aclSnapshotKey_() {
  return 'ACL_SNAPSHOT_' + String(ACL_PAGE_NAME || 'page');
}

// Persist the page's allow-list. Script Properties, not CacheService: a cache
// entry can evaporate at any moment, and the snapshot is only ever worth having
// at the moment the ACL is already unreachable. Writes are throttled to roughly
// one per ten minutes by a cache marker — without it this would write on every
// single sign-in.
function aclSnapshotSave_(allowMap) {
  if (!ACL_GRACE_ENABLED) return;
  try {
    var cache = getEpochCache();
    if (cache.get('acl_snapshot_fresh')) return;
    var emails = Object.keys(allowMap);
    if (emails.length > ACL_GRACE_MAX_ENTRIES) emails = emails.slice(0, ACL_GRACE_MAX_ENTRIES);
    var trimmed = {};
    for (var i = 0; i < emails.length; i++) trimmed[emails[i]] = allowMap[emails[i]];
    PropertiesService.getScriptProperties().setProperty(aclSnapshotKey_(),
      JSON.stringify({ at: Date.now(), roles: trimmed }));
    cache.put('acl_snapshot_fresh', '1', 600);
  } catch (e) {
    Logger.log('aclSnapshotSave_ failed (non-fatal): ' + e.message);
  }
}

// Returns { role: <string>, ageSec: <number> } when the snapshot still vouches
// for this email, else null. Null covers every uncertain case — no snapshot,
// unparseable snapshot, expired snapshot, email absent — so an unreadable ACL
// falls back to the original hard denial rather than to a guess.
function aclSnapshotLookup_(lowerEmail) {
  if (!ACL_GRACE_ENABLED) return null;
  try {
    var raw = PropertiesService.getScriptProperties().getProperty(aclSnapshotKey_());
    if (!raw) return null;
    var snap = JSON.parse(raw);
    if (!snap || !snap.roles || !snap.at) return null;
    var ageSec = Math.floor((Date.now() - Number(snap.at)) / 1000);
    if (!(ageSec >= 0) || ageSec > ACL_GRACE_MAX_AGE_SEC) return null;
    if (!Object.prototype.hasOwnProperty.call(snap.roles, lowerEmail)) return null;
    return { role: snap.roles[lowerEmail] || RBAC_DEFAULT_ROLE, ageSec: ageSec };
  } catch (e) {
    Logger.log('aclSnapshotLookup_ failed (non-fatal): ' + e.message);
    return null;
  }
}

// Legacy boolean callers: use checkSpreadsheetAccess(email).hasAccess
function checkSpreadsheetAccess(email, opt_ss) {
  var denied = { hasAccess: false, role: null, isEmergencyAccess: false };
  if (!email) return denied;
  var lowerEmail = email.toLowerCase();

  // Emergency access override (toggle-gated)
  if (AUTH_CONFIG.ENABLE_EMERGENCY_ACCESS) {
    var emergencyEmails = PropertiesService.getScriptProperties()
      .getProperty(AUTH_CONFIG.EMERGENCY_ACCESS_PROPERTY);
    if (emergencyEmails) {
      var emergencyList = emergencyEmails.split(',').map(function(e) {
        return e.trim().toLowerCase();
      });
      if (emergencyList.indexOf(lowerEmail) > -1) {
        auditLog('emergency_access', email, 'granted',
          { reason: 'Emergency access override via Script Properties' });
        return { hasAccess: true, role: 'admin', isEmergencyAccess: true };
      }
    }
  }

  var cache = getEpochCache();
  var cacheKey = "access_" + lowerEmail;
  var roleCacheKey = "role_" + lowerEmail;
  var cached = cache.get(cacheKey);
  if (cached !== null) {
    if (cached === "1") {
      var cachedRole = cache.get(roleCacheKey) || RBAC_DEFAULT_ROLE;
      return { hasAccess: true, role: cachedRole, isEmergencyAccess: false };
    }
    return denied;
  }

  // Method 1: Master ACL spreadsheet
  // Expected layout: col A = Email, col B = Role, cols C+ = page names (TRUE/FALSE)
  var hasAcl = MASTER_ACL_SPREADSHEET_ID && MASTER_ACL_SPREADSHEET_ID !== "YOUR_MASTER_ACL_SPREADSHEET_ID";
  // aclReadOk records whether the list was actually READ. Without it, "the ACL
  // says no" and "the ACL could not be opened" both fell through to the same
  // cached denial at the bottom of this function, so a transient Sheets fault
  // was reported to the user as `not_authorized` — indistinguishable from being
  // genuinely off the list, and sticky for the full 10-minute cache TTL.
  var aclReadOk = false;
  var aclFailReason = '';
  if (hasAcl) {
    // Every project rewrites its metadata columns on the shared Access tab, so
    // read failures here are usually momentary contention. One retry absorbs
    // that without materially slowing a genuine sign-in.
    for (var attempt = 0; attempt < 2 && !aclReadOk; attempt++) {
      if (attempt > 0) {
        try { Utilities.sleep(400); } catch (eSleep) {}
      }
      try {
        var aclSs = SpreadsheetApp.openById(MASTER_ACL_SPREADSHEET_ID);
        var aclSheet = aclSs.getSheetByName(ACL_SHEET_NAME);
        if (!aclSheet) { aclFailReason = 'acl_tab_missing'; continue; }
        var data = aclSheet.getDataRange().getValues();
        if (data.length < 2) { aclFailReason = 'acl_empty'; continue; }
        var headers = data[0];
        // Find the page column index (page access TRUE/FALSE)
        var colIdx = -1;
        for (var c = 0; c < headers.length; c++) {
          if (String(headers[c]).trim().toLowerCase() === ACL_PAGE_NAME.toLowerCase()) {
            colIdx = c; break;
          }
        }
        // A missing page column denies every user of this app at once. That is a
        // broken ACL, not a per-user decision, so it must not be cached as one.
        if (colIdx === -1) { aclFailReason = 'acl_column_missing'; continue; }
        // Find the Role column index (expected col B, but search by header name for flexibility)
        var roleColIdx = -1;
        for (var rc = 0; rc < headers.length; rc++) {
          if (String(headers[rc]).trim().toLowerCase() === 'role') {
            roleColIdx = rc; break;
          }
        }
        // Past this point the list was read and understood, so a "no" below is a
        // real denial and is safe to cache.
        aclReadOk = true;
        aclFailReason = '';
        // Refresh the last-known-good snapshot while the list is readable. This
        // is a separate pass rather than being folded into the lookup below,
        // which breaks as soon as it finds the user and so never sees the whole
        // column.
        var allowMap = {};
        var rolesMatrix = null;
        for (var sr = 1; sr < data.length; sr++) {
          var sEmail = String(data[sr][0]).trim().toLowerCase();
          if (!sEmail) continue;
          var sVal = data[sr][colIdx];
          if (!(sVal === true || String(sVal).trim().toUpperCase() === 'TRUE')) continue;
          var sRole = RBAC_DEFAULT_ROLE;
          if (roleColIdx !== -1 && data[sr][roleColIdx]) {
            var sRaw = String(data[sr][roleColIdx]).trim().toLowerCase();
            if (rolesMatrix === null) rolesMatrix = getRolesFromSpreadsheet();
            if (rolesMatrix[sRaw]) sRole = sRaw;
          }
          allowMap[sEmail] = sRole;
        }
        aclSnapshotSave_(allowMap);
        for (var r = 1; r < data.length; r++) {
          if (String(data[r][0]).trim().toLowerCase() === lowerEmail) {
            var val = data[r][colIdx];
            if (val === true || String(val).trim().toUpperCase() === 'TRUE') {
              // Read role from the Role column (default to RBAC_DEFAULT_ROLE if missing)
              var userRole = RBAC_DEFAULT_ROLE;
              if (roleColIdx !== -1 && data[r][roleColIdx]) {
                var rawRole = String(data[r][roleColIdx]).trim().toLowerCase();
                if (getRolesFromSpreadsheet()[rawRole]) {
                  userRole = rawRole;
                }
              }
              cache.put(cacheKey, "1", 600);
              cache.put(roleCacheKey, userRole, 600);
              return { hasAccess: true, role: userRole, isEmergencyAccess: false };
            }
            break; // Found email but not granted — continue to method 2
          }
        }
      } catch(e) {
        aclFailReason = 'acl_unreachable';
        Logger.log('checkSpreadsheetAccess: ACL read failed on attempt '
          + (attempt + 1) + ' for ' + ACL_PAGE_NAME + ': ' + e.message);
      }
    }
    // When an ACL is configured it is the sole authority — the sharing-list
    // fallback below is deliberately skipped. So an unreadable ACL means the
    // verdict is UNKNOWN, not "no". Return that uncached and let the caller
    // present it as a retryable outage.
    if (!aclReadOk) {
      // The list could not be read, so the verdict is UNKNOWN rather than "no".
      // Before reporting an outage, ask the last-known-good snapshot whether
      // this email was allowed the last time the list WAS readable, and serve
      // that instead of locking every user of the app out (aclSnapshotLookup_).
      var grace = aclSnapshotLookup_(lowerEmail);
      if (grace) {
        auditLog('security_alert', email, 'acl_grace_grant',
          { reason: aclFailReason || 'acl_unreachable', page: ACL_PAGE_NAME,
            role: grace.role, snapshotAgeSec: grace.ageSec });
        Logger.log('checkSpreadsheetAccess: ACL unreadable ('
          + (aclFailReason || 'acl_unreachable') + ') - granting ' + lowerEmail
          + ' from a snapshot ' + grace.ageSec + 's old.');
        // Deliberately not cached: the moment the ACL is readable again the real
        // verdict must win, and a cached grace grant would outlive the outage by
        // the full 10-minute access-cache TTL.
        return { hasAccess: true, role: grace.role, isEmergencyAccess: false,
                 aclDegraded: true };
      }
      auditLog('security_alert', email, 'acl_unavailable',
        { reason: aclFailReason || 'acl_unreachable', page: ACL_PAGE_NAME });
      return { hasAccess: false, role: null, isEmergencyAccess: false,
               aclUnavailable: true, reason: aclFailReason || 'acl_unreachable' };
    }
  }

  // Method 2: Editor/viewer sharing-list check on SPREADSHEET_ID
  // ONLY used when the ACL tab is NOT configured — when ACL exists, it is the
  // sole authority and the sharing list is not consulted.
  var hasSheet = SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID";
  if (!hasAcl && hasSheet) {
    var ss = opt_ss || SpreadsheetApp.openById(SPREADSHEET_ID);
    var editors = ss.getEditors();
    for (var i = 0; i < editors.length; i++) {
      if (editors[i].getEmail().toLowerCase() === lowerEmail) {
        cache.put(cacheKey, "1", 600);
        cache.put(roleCacheKey, RBAC_DEFAULT_ROLE, 600);
        return { hasAccess: true, role: RBAC_DEFAULT_ROLE, isEmergencyAccess: false };
      }
    }
    var viewers = ss.getViewers();
    for (var i = 0; i < viewers.length; i++) {
      if (viewers[i].getEmail().toLowerCase() === lowerEmail) {
        cache.put(cacheKey, "1", 600);
        cache.put(roleCacheKey, RBAC_DEFAULT_ROLE, 600);
        return { hasAccess: true, role: RBAC_DEFAULT_ROLE, isEmergencyAccess: false };
      }
    }
  }

  // Neither method granted access (or neither is configured)
  if (!hasAcl && !hasSheet) {
    return { hasAccess: true, role: RBAC_DEFAULT_ROLE, isEmergencyAccess: false };
  }
  cache.put(cacheKey, "0", 600);
  return denied;
}

// PROJECT START — Add your project-specific code here
// PROJECT END
// =============================================
// AUTH — Web App Entry Point (doGet)
// Toggle-gated: TOKEN_EXCHANGE_METHOD controls token exchange path.
// =============================================

// ── Phase 7 (H-5): Server-side heartbeat processing ──
// Called via google.script.run from the heartbeat listener page (action=heartbeat).
// Token is received via postMessage, NOT URL parameters — eliminates token-in-URL exposure.
function processHeartbeat(token) {
  if (!token || !AUTH_CONFIG.ENABLE_HEARTBEAT) {
    return {type: 'gas-heartbeat-error', error: 'invalid_request'};
  }

  var cache = getEpochCache();

  // Rate limit: max 20 per session per 5-minute window
  var hbRlKey = 'hb_ratelimit_' + token.substring(0, 16);
  var hbAttempts = cache.get(hbRlKey);
  var hbCount = hbAttempts ? parseInt(hbAttempts, 10) : 0;
  if (hbCount >= 20) {
    return {type: 'gas-heartbeat-error', error: 'rate_limited'};
  }
  cache.put(hbRlKey, String(hbCount + 1), 300);

  var raw = cache.get("session_" + token);
  if (!raw) {
    var evictionReason = cache.get("evicted_" + token) || 'timeout';
    // Don't remove the tombstone — let it expire naturally (5 min TTL).
    // Multiple consumers may need it: heartbeat, page refresh (validateSession),
    // and the same heartbeat may retry if the first response was dropped.
    return {type: 'gas-heartbeat-expired', reason: evictionReason};
  }

  var hbData;
  try { hbData = JSON.parse(raw); } catch (err) {
    return {type: 'gas-heartbeat-expired', reason: 'corrupt_session'};
  }

  // Retrieve messageKey from session data for signing response
  var msgKey = hbData.messageKey || '';

  // Check HMAC if enabled
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY && !verifySessionHmac(hbData)) {
    cache.remove("session_" + token);
    return signMessage({type: 'gas-heartbeat-expired', reason: 'integrity_violation'}, msgKey);
  }

  // Absolute session timeout — hard ceiling, heartbeats cannot extend past this
  if (hbData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
    var hbAbsElapsed = (Date.now() - hbData.absoluteCreatedAt) / 1000;
    if (hbAbsElapsed > AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT) {
      cache.remove("session_" + token);
      auditLog('session_expired', hbData.email, 'absolute_timeout_heartbeat',
        { elapsed: Math.round(hbAbsElapsed) + 's', limit: AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT + 's', clientIp: 'not-collected' });
      return signMessage({type: 'gas-heartbeat-expired', reason: 'absolute_timeout'}, msgKey);
    }
  }

  // Rolling session timeout
  var hbElapsed = (Date.now() - hbData.createdAt) / 1000;
  if (hbElapsed > AUTH_CONFIG.SESSION_EXPIRATION) {
    cache.remove("session_" + token);
    auditLog('session_expired', hbData.email, 'heartbeat_too_late',
      { elapsed: Math.round(hbElapsed) + 's', clientIp: 'not-collected' });
    return signMessage({type: 'gas-heartbeat-expired', reason: 'timeout'}, msgKey);
  }

  // Session valid — reset createdAt to extend
  hbData.createdAt = Date.now();
  hbData.lastActivity = Date.now();
  if (AUTH_CONFIG.ENABLE_HMAC_INTEGRITY) {
    hbData.hmac = generateSessionHmac(hbData);
  }
  cache.put("session_" + token, JSON.stringify(hbData), AUTH_CONFIG.SESSION_EXPIRATION);

  var hbAbsRemaining = hbData.absoluteCreatedAt && AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT
    ? Math.round(AUTH_CONFIG.ABSOLUTE_SESSION_TIMEOUT - ((Date.now() - hbData.absoluteCreatedAt) / 1000))
    : 0;
  return signMessage({type: 'gas-heartbeat-ok', expiresIn: AUTH_CONFIG.SESSION_EXPIRATION, absoluteRemaining: hbAbsRemaining}, msgKey);
}

// ── Live viewer presence ──
// Reports/returns who is currently viewing the app, with active/away derived from each
// client's window focus. Soft state only: one CacheService roster key holding
// { emailLower: {name, state, ts} }; entries self-expire after PRESENCE_STALE_MS, so a
// viewer who closes the tab simply ages out (no reliable unload signal is needed). No PHI —
// display name + focus state, keyed by the caller's own validated session. Read-modify-write
// on a single key (last-write-wins); clients re-report on a ~30s cadence, so transient
// races self-heal on the next report.
var PRESENCE_KEY = 'presence_roster';
var PRESENCE_STALE_MS = 75000;   // drop a viewer whose last report is older than 75s
var PRESENCE_TTL = 120;          // CacheService TTL for the roster key (seconds)

function updatePresence(sessionToken, state) {
  try {
    var id = validateSessionForData(sessionToken, 'presence');   // throws on invalid/expired session
    var email = String(id.email || '').toLowerCase();
    if (!email || email === 'unvalidated') return { viewers: [] };
    var st = (state === 'away') ? 'away' : 'active';
    var now = Date.now();
    var cache = getEpochCache();
    var roster = {};
    try { var raw = cache.get(PRESENCE_KEY); if (raw) roster = JSON.parse(raw) || {}; } catch (e) { roster = {}; }
    roster[email] = { name: id.displayName || id.email || email, state: st, ts: now };
    var out = [];
    for (var k in roster) {
      if (!roster.hasOwnProperty(k)) continue;
      var r = roster[k];
      if (!r || (now - (r.ts || 0)) > PRESENCE_STALE_MS) { delete roster[k]; continue; }
      out.push({ email: k, name: r.name || k, state: (r.state === 'away') ? 'away' : 'active', self: (k === email) });
    }
    cache.put(PRESENCE_KEY, JSON.stringify(roster), PRESENCE_TTL);
    out.sort(function (a, b) {
      if (a.self !== b.self) return a.self ? -1 : 1;                       // yourself first
      if (a.state !== b.state) return a.state === 'active' ? -1 : 1;       // active before away
      return String(a.name).localeCompare(String(b.name));                 // then by name
    });
    return { viewers: out };
  } catch (e) {
    return { viewers: [], error: String((e && e.message) || e) };
  }
}

// ── Phase 7 (H-6): Server-side sign-out processing ──
// Called via google.script.run from the signout listener page (action=signout).
// Token is received via postMessage, NOT URL parameters.
function processSignOut(token) {
  if (!token) {
    return {type: 'gas-signed-out', success: false, error: 'no_token'};
  }
  // Read messageKey before invalidation (for signing the response)
  var cache = getEpochCache();
  var raw = cache.get("session_" + token);
  var msgKey = '';
  if (raw) { try { msgKey = JSON.parse(raw).messageKey || ''; } catch(e) {} }
  invalidateSession(token);
  return signMessage({type: 'gas-signed-out', success: true}, msgKey);
}

// ── Phase 7 (M-4): Server-side security event processing ──
// Called via google.script.run from the securityEvent listener page (action=securityEvent).
// Event details are received via postMessage, NOT URL parameters.
function processSecurityEvent(eventType, details) {
  if (!eventType) return;
  var cache = getEpochCache();

  // Global rate limit: max 50 security events per 5-minute window
  var seGlobalKey = 'se_ratelimit_global';
  var seGlobalAttempts = cache.get(seGlobalKey);
  var seGlobalCount = seGlobalAttempts ? parseInt(seGlobalAttempts, 10) : 0;

  if (seGlobalCount < 50) {
    cache.put(seGlobalKey, String(seGlobalCount + 1), 300);
    var seDetails = {};
    try {
      if (typeof details === 'string') {
        seDetails = JSON.parse(details.substring(0, 500));
      } else if (details && typeof details === 'object') {
        seDetails = details;
      }
    } catch(ex) {}
    auditLog('security_event', 'not-collected', String(eventType).substring(0, 50), {
      details: seDetails,
      clientIp: 'not-collected',
      page: EMBED_PAGE_URL
    });
  } else if (seGlobalCount === 50) {
    cache.put(seGlobalKey, String(seGlobalCount + 1), 300);
    auditLog('security_event_flood', 'system', 'Global rate limit reached', {
      message: 'Max 50 security events per 5 minutes — further events suppressed regardless of source IP',
      lastEvent: String(eventType).substring(0, 50),
      page: EMBED_PAGE_URL
    });
  }
}

// ── DJB2→HMAC Migration: Server-side message signing for GAS session HTML ──
// Called via google.script.run from the session HTML inline script.
// Replaces client-side _s() (DJB2) with server-side HMAC-SHA256 signing.
// Same pattern as processHeartbeat/processSignOut (Phase 7).
function signAppMessage(sessionToken, messageType, params) {
  if (!sessionToken || !messageType) {
    return { type: 'error', error: 'missing_parameters' };
  }

  var cache = getEpochCache();

  // Validate session — retrieve messageKey from cache regardless of session validity
  var raw = cache.get('session_' + sessionToken);
  var msgKey = '';
  if (raw) {
    try { msgKey = JSON.parse(raw).messageKey || ''; } catch(e) {}
  }

  var session = validateSession(sessionToken);
  if (session.status !== 'authorized') {
    // Session is invalid — expected for 'gas-session-invalid' callers.
    // Use recovered messageKey from cache (may still exist even after expiry).
    return signMessage({
      type: 'gas-session-invalid',
      reason: 'SESSION_EXPIRED'
    }, msgKey);
  }

  switch (messageType) {
    case 'gas-auth-ok':
      var authRole = session.role || RBAC_DEFAULT_ROLE;
      return signMessage({
        type: 'gas-auth-ok',
        version: VERSION,
        needsReauth: session.needsReauth || false,
        messageKey: msgKey,
        role: authRole,
        permissions: session.permissions || getRolesFromSpreadsheet()[authRole] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE]
      }, msgKey);

    case 'gas-version':
      var appData = getAppData();
      return signMessage({
        type: 'gas-version',
        version: appData.version
      }, msgKey);

    case 'gas-user-activity':
      return signMessage({
        type: 'gas-user-activity'
      }, msgKey);

    case 'gas-session-invalid':
      return signMessage({
        type: 'gas-session-invalid',
        reason: (params && params.reason) || 'unknown'
      }, msgKey);

    default:
      return { type: 'error', error: 'unknown_message_type' };
  }
}

function doGet(e) {
  var sessionToken = (e && e.parameter && e.parameter.session) || "";
  // Phase 7: signOutToken, heartbeatToken, and msgKey URL parameters removed —
  // heartbeat and sign-out now use postMessage via action listener pages
  // (processHeartbeat/processSignOut called via google.script.run)

  // Phase 3 (C-3): Client IP collection removed — ipify.org lacks BAA coverage.
  // GAS doGet(e) does not expose client IP — no compliant server-side method exists.
  // All audit log entries use 'not-collected' for the IP field.
  // To re-enable, uncomment below and set AUTH_CONFIG.ENABLE_IP_LOGGING = true:
  // var rawIp = (e && e.parameter && e.parameter.clientIp) || '';
  // var clientIp = '';
  // if (rawIp) {
  //   var t = String(rawIp).trim().substring(0, 45);
  //   clientIp = (/^(\d{1,3}\.){3}\d{1,3}$/.test(t) || /^[0-9a-fA-F:]+$/.test(t)) ? t : 'invalid';
  // }
  var clientIp = 'not-collected';

  // Auto-initialize required Script Properties (HMAC_SECRET, CACHE_EPOCH) on first page load
  ensureScriptProperties_();

  // Auto-register this project in the Master ACL Projects sheet
  registerSelfProject();

  // ── Phase 7: postMessage-based action routes ──
  // These routes return lightweight listener pages that receive sensitive data
  // via postMessage instead of URL parameters. The listener pages use
  // google.script.run to call the server-side processing functions.
  var action = (e && e.parameter && e.parameter.action) || '';

  // GET deploy fallback — the CI deploy webhook's POST can fail on Google's redirect
  // (the workflow runner's curl loses the POST body → error page), so the workflow
  // retries as GET ?action=api&op=deploy. Same bare, unauthenticated semantics as the
  // protected doPost(action=deploy) handler (see its ⚠️ CRITICAL comment): it can only
  // re-pull what GitHub already contains. Do NOT add guards, secrets, or auth here.
  if (action === 'api' && ((e && e.parameter && e.parameter.op) || '') === 'deploy') {
    return ContentService.createTextOutput(pullAndDeployFromGitHub());
  }

  // GET API fallback for the fetch transport — Google's serving can drop POST
  // bodies on its redirect, so the HTML layer retries every doPost call on this
  // route. Mirrors the doPost fetch routes (JSON in, JSON out).
  if (action === 'api') {
    var apiOp = (e && e.parameter && e.parameter.op) || '';
    var apiToken = (e && e.parameter && e.parameter.token) || '';
    var apiResult;
    try {
      if (apiOp === 'exchangeToken') {
        ensureScriptProperties_();
        apiResult = exchangeTokenForSession(apiToken);
        if (apiResult && apiResult.success) apiResult.version = VERSION;
      } else if (apiOp === 'signOut') {
        apiResult = processSignOut(apiToken);
      } else if (apiOp === 'heartbeat') {
        apiResult = processHeartbeat(apiToken);
      } else if (apiOp === 'classroom') {
        // PROJECT: GET mirror of the Classroom ops (read-only, no payloads)
        apiResult = handleClassroomOp_(e);
      } else {
        apiResult = { error: 'unknown_op' };
      }
    } catch (apiErr) {
      apiResult = { error: String((apiErr && apiErr.message) || apiErr) };
    }
    return ContentService.createTextOutput(JSON.stringify(apiResult))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Heartbeat action — returns page that listens for token via postMessage
  if (action === 'heartbeat') {
    var hbListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-heartbeat-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data || evt.data.type !== "heartbeat-token") return;'
      + '  google.script.run'
      + '    .withSuccessHandler(function(r) {'
      + '      window.top.postMessage(r, PARENT_ORIGIN);'
      + '    })'
      + '    .withFailureHandler(function(e) {'
      + '      window.top.postMessage({type:"gas-heartbeat-error",'
      + '        error:String(e)}, PARENT_ORIGIN);'
      + '    })'
      + '    .processHeartbeat(evt.data.token);'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(hbListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Sign-out action — returns page that listens for token via postMessage
  if (action === 'signout') {
    var soListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-signout-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data || evt.data.type !== "signout-token") return;'
      + '  google.script.run'
      + '    .withSuccessHandler(function(r) {'
      + '      window.top.postMessage(r, PARENT_ORIGIN);'
      + '    })'
      + '    .withFailureHandler(function(e) {'
      + '      window.top.postMessage({type:"gas-signed-out", success:false,'
      + '        error:String(e)}, PARENT_ORIGIN);'
      + '    })'
      + '    .processSignOut(evt.data.token);'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(soListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Admin session management — returns page that listens for admin commands via postMessage
  if (action === 'adminSessions') {
    var adminListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-admin-sessions-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data) return;'
      + '  if (evt.data.type === "admin-list-sessions") {'
      + '    google.script.run'
      + '      .withSuccessHandler(function(r) {'
      + '        window.top.postMessage({type:"gas-admin-sessions-list", sessions:r}, PARENT_ORIGIN);'
      + '      })'
      + '      .withFailureHandler(function(e) {'
      + '        window.top.postMessage({type:"gas-admin-sessions-error",'
      + '          error:String(e)}, PARENT_ORIGIN);'
      + '      })'
      + '      .listActiveSessions(evt.data.token);'
      + '  }'
      + '  if (evt.data.type === "admin-signout-user") {'
      + '    google.script.run'
      + '      .withSuccessHandler(function(r) {'
      + '        window.top.postMessage({type:"gas-admin-signout-result", result:r}, PARENT_ORIGIN);'
      + '      })'
      + '      .withFailureHandler(function(e) {'
      + '        window.top.postMessage({type:"gas-admin-signout-error",'
      + '          error:String(e)}, PARENT_ORIGIN);'
      + '      })'
      + '      .adminSignOutUser(evt.data.token, evt.data.email);'
      + '  }'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(adminListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Cross-project session listing — called by GlobalACL's Global Sessions feature
  // Returns JSON via ContentService (not HTML). Authenticated by shared secret.
  if (action === 'listSessions') {
    var cpParams = { secret: (e.parameter && e.parameter.secret) || '', callerEmail: (e.parameter && e.parameter.callerEmail) || '' };
    var cpAuth = validateCrossProjectAdmin(cpParams);
    if (!cpAuth.valid) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: cpAuth.reason }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var cpSessions = listActiveSessionsInternal(cpAuth.email);
    return ContentService.createTextOutput(JSON.stringify({ success: true, sessions: cpSessions, project: TITLE }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Cross-project admin secret distribution — called by globalacl's distributeSecret_()
  if (action === 'setAdminSecret') {
    var newSecret = (e.parameter && e.parameter.newSecret) || '';
    var oldSecret = (e.parameter && e.parameter.oldSecret) || '';
    if (!newSecret) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'missing_secret' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var props = PropertiesService.getScriptProperties();
    var current = props.getProperty('CROSS_PROJECT_ADMIN_SECRET') || '';
    // Accept if: no current secret (first setup) OR oldSecret matches current
    if (current && oldSecret !== current) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    props.setProperty('CROSS_PROJECT_ADMIN_SECRET', newSecret);
    _crossProjectSecret = null; // clear cache
    return ContentService.createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Cross-project admin sign-out — called by globalacl's adminGlobalSignOutUser via UrlFetchApp
  if (action === 'adminSignOut') {
    var cpParams2 = { secret: (e.parameter && e.parameter.secret) || '', callerEmail: (e.parameter && e.parameter.callerEmail) || '' };
    var cpAuth2 = validateCrossProjectAdmin(cpParams2);
    if (!cpAuth2.valid) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    var cpTarget = (e.parameter && e.parameter.targetEmail) || '';
    if (cpTarget) {
      invalidateAllSessions(cpTarget, 'admin_signout');
    }
    return ContentService.createTextOutput(JSON.stringify({ success: true, email: cpTarget }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Cross-project access-cache clear — called by globalacl's adminGlobalClearAccessCaches
  // via UrlFetchApp. Bumps this app's cache epoch so ALL cached access, roles, and sessions
  // are invalidated (users re-authenticate on their next request). Used after ACL/role
  // changes (e.g. role renames) so stale cached grants don't linger anywhere.
  if (action === 'clearAccessCache') {
    // Secret-only validation (like setAdminSecret): the shared secret proves the request
    // comes from the Global ACL app, and ANY signed-in Global ACL user may trigger the
    // clear (developer decision — being granted the ACL manager IS the authorization;
    // the action forces re-authentication but exposes no data). callerEmail is
    // informational for audit trails only — no admin-role check on the caller.
    var ccSecret = (e.parameter && e.parameter.secret) || '';
    var ccExpected = getCrossProjectSecret();
    if (!ccExpected || ccSecret !== ccExpected) {
      return ContentService.createTextOutput(JSON.stringify({ error: 'unauthorized' }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    clearAllAccessCache();
    return ContentService.createTextOutput(JSON.stringify({ success: true, project: TITLE }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // Nonce generation action — returns page that generates a one-time-use page nonce
  // via google.script.run, replacing the insecure ?session=TOKEN URL pattern.
  // The parent page loads this, sends the session token via postMessage, and receives
  // a short-lived nonce to use in ?page_nonce=NONCE for the actual app load.
  if (action === 'getNonce') {
    var nonceListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-nonce-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data || evt.data.type !== "request-nonce") return;'
      + '  google.script.run'
      + '    .withSuccessHandler(function(r) {'
      + '      window.top.postMessage({type:"gas-nonce-result", success:r.success, nonce:r.nonce||"", error:r.error||""}, PARENT_ORIGIN);'
      + '    })'
      + '    .withFailureHandler(function(e) {'
      + '      window.top.postMessage({type:"gas-nonce-result", success:false, error:String(e)}, PARENT_ORIGIN);'
      + '    })'
      + '    .generatePageNonce(evt.data.sessionToken);'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(nonceListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Phase A — HIPAA Privacy Rule operations listener
  if (action === 'phaseA') {
    var phaseAListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"phase-a-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data) return;'
      + '  var d = evt.data;'
      + '  function ok(type, payload) { window.top.postMessage(Object.assign({type:type}, payload), PARENT_ORIGIN); }'
      + '  function fail(type, e) { window.top.postMessage({type:type, error:String(e)}, PARENT_ORIGIN); }'
      // Disclosure Accounting
      + '  if (d.type === "phase-a-get-disclosures") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-disclosures-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-disclosures-result", {result:{success:false,message:String(e)}}); })'
      + '      .getDisclosureAccounting(d.token);'
      + '  }'
      + '  if (d.type === "phase-a-export-disclosures") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-export-disclosures-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-export-disclosures-result", {result:{success:false,message:String(e)}}); })'
      + '      .exportDisclosureAccounting(d.token, d.format);'
      + '  }'
      // Right of Access
      + '  if (d.type === "phase-a-request-export") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-export-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-export-result", {result:{success:false,message:String(e)}}); })'
      + '      .requestDataExport(d.token, d.format);'
      + '  }'
      // Right to Amendment
      + '  if (d.type === "phase-a-request-amendment") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-amendment-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-amendment-result", {result:{success:false,message:String(e)}}); })'
      + '      .requestAmendment(d.token, d.recordId, d.currentContent, d.proposedChange, d.reason);'
      + '  }'
      + '  if (d.type === "phase-a-get-pending-amendments") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-pending-amendments-result", {amendments:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-pending-amendments-result", {amendments:[],error:String(e)}); })'
      + '      .getPendingAmendments(d.token);'
      + '  }'
      + '  if (d.type === "phase-a-review-amendment") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-review-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-review-result", {result:{success:false,message:String(e)}}); })'
      + '      .reviewAmendment(d.token, d.amendmentId, d.decision, d.decisionReason);'
      + '  }'
      + '  if (d.type === "phase-a-submit-disagreement") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-disagreement-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-disagreement-result", {result:{success:false,message:String(e)}}); })'
      + '      .submitDisagreement(d.token, d.amendmentId, d.statement);'
      + '  }'
      // Extension Workflows
      + '  if (d.type === "phase-a-request-access-extension") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-access-extension-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-access-extension-result", {result:{success:false,message:String(e)}}); })'
      + '      .requestAccessExtension(d.token, d.requestId, d.reason);'
      + '  }'
      + '  if (d.type === "phase-a-request-amendment-extension") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-amendment-extension-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-amendment-extension-result", {result:{success:false,message:String(e)}}); })'
      + '      .requestAmendmentExtension(d.token, d.amendmentId, d.reason);'
      + '  }'
      // Formal Denial Notice
      + '  if (d.type === "phase-a-generate-denial-notice") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-denial-notice-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-denial-notice-result", {result:{success:false,message:String(e)}}); })'
      + '      .generateDenialNotice(d.token, d.requestType, d.requestId, d.params);'
      + '  }'
      // HITECH EHR Disclosure Accounting
      + '  if (d.type === "phase-a-get-ehr-disclosures") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-a-ehr-disclosures-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-a-ehr-disclosures-result", {result:{success:false,message:String(e)}}); })'
      + '      .getDisclosureAccounting(d.token, d.targetEmail, {includeEhrTpo: true});'
      + '  }'
      // Phase B — P1: Grouped Disclosure Accounting
      + '  if (d.type === "phase-b-get-grouped-disclosures") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-grouped-disclosures-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-grouped-disclosures-result", {result:{success:false,message:String(e)}}); })'
      + '      .getGroupedDisclosureAccounting(d.token, d.targetEmail);'
      + '  }'
      // Phase B — P1: Summary PHI Export
      + '  if (d.type === "phase-b-generate-summary") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-summary-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-summary-result", {result:{success:false,message:String(e)}}); })'
      + '      .generateDataSummary(d.token, d.targetEmail);'
      + '  }'
      // Phase B — P1: Amendment Notifications
      + '  if (d.type === "phase-b-send-amendment-notifications") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-amendment-notifications-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-amendment-notifications-result", {result:{success:false,message:String(e)}}); })'
      + '      .sendAmendmentNotifications(d.token, d.amendmentId, d.recipients);'
      + '  }'
      + '  if (d.type === "phase-b-get-notification-status") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-notification-status-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-notification-status-result", {result:{success:false,message:String(e)}}); })'
      + '      .getNotificationStatus(d.token, d.amendmentId);'
      + '  }'
      + '  if (d.type === "phase-b-get-disclosure-recipients") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-disclosure-recipients-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-disclosure-recipients-result", {result:{success:false,message:String(e)}}); })'
      + '      .getDisclosureRecipientsForRecord(d.token, d.recordId);'
      + '  }'
      // Phase B — P2: Breach Logging
      + '  if (d.type === "phase-b-log-breach") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-log-breach-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-log-breach-result", {result:{success:false,message:String(e)}}); })'
      + '      .logBreach(d.token, d.params);'
      + '  }'
      + '  if (d.type === "phase-b-update-breach-status") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-update-breach-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-update-breach-result", {result:{success:false,message:String(e)}}); })'
      + '      .updateBreachStatus(d.token, d.breachId, d.updates);'
      + '  }'
      + '  if (d.type === "phase-b-get-breach-report") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-breach-report-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-breach-report-result", {result:{success:false,message:String(e)}}); })'
      + '      .getBreachReport(d.token, d.year);'
      + '  }'
      + '  if (d.type === "phase-b-get-breach-log") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-breach-log-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-breach-log-result", {result:{success:false,message:String(e)}}); })'
      + '      .getBreachLog(d.token, d.options);'
      + '  }'
      // Phase B — P3: Personal Representatives
      + '  if (d.type === "phase-b-register-representative") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-register-rep-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-register-rep-result", {result:{success:false,message:String(e)}}); })'
      + '      .registerPersonalRepresentative(d.token, d.params);'
      + '  }'
      + '  if (d.type === "phase-b-get-representatives") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-representatives-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-representatives-result", {result:{success:false,message:String(e)}}); })'
      + '      .getPersonalRepresentatives(d.token, d.targetEmail);'
      + '  }'
      + '  if (d.type === "phase-b-revoke-representative") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-b-revoke-rep-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-b-revoke-rep-result", {result:{success:false,message:String(e)}}); })'
      + '      .revokeRepresentative(d.token, d.representativeId, d.reason);'
      + '  }'
      // Phase C — P2: Legal Hold Management
      + '  if (d.type === "phase-c-place-legal-hold") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-c-place-hold-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-c-place-hold-result", {result:{success:false,message:String(e)}}); })'
      + '      .placeLegalHold(d.token, d.params);'
      + '  }'
      + '  if (d.type === "phase-c-release-legal-hold") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-c-release-hold-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-c-release-hold-result", {result:{success:false,message:String(e)}}); })'
      + '      .releaseLegalHold(d.token, d.holdId, d.reason);'
      + '  }'
      + '  if (d.type === "phase-c-get-legal-holds") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-c-legal-holds-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-c-legal-holds-result", {result:{success:false,message:String(e)}}); })'
      + '      .getLegalHolds(d.token, d.filters);'
      + '  }'
      // Phase C — P2: Retention Compliance Audit
      + '  if (d.type === "phase-c-audit-retention") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-c-audit-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-c-audit-result", {result:{success:false,message:String(e)}}); })'
      + '      .auditRetentionCompliance(d.token);'
      + '  }'
      + '  if (d.type === "phase-c-get-audit-report") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-c-audit-report-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-c-audit-report-result", {result:{success:false,message:String(e)}}); })'
      + '      .getComplianceAuditReport(d.token, d.format);'
      + '  }'
      // Phase C — P2: Archive Integrity Verification
      + '  if (d.type === "phase-c-verify-integrity") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-c-integrity-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-c-integrity-result", {result:{success:false,message:String(e)}}); })'
      + '      .verifyArchiveIntegrity(d.token);'
      + '  }'
      // Phase C — P2: Retention Policy Documentation
      + '  if (d.type === "phase-c-get-retention-policy") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-c-policy-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-c-policy-result", {result:{success:false,message:String(e)}}); })'
      + '      .getRetentionPolicyDocument(d.token);'
      + '  }'
      + '  if (d.type === "phase-c-export-retention-policy") {'
      + '    google.script.run.withSuccessHandler(function(r) { ok("phase-c-export-policy-result", {result:r}); })'
      + '      .withFailureHandler(function(e) { ok("phase-c-export-policy-result", {result:{success:false,message:String(e)}}); })'
      + '      .exportRetentionPolicy(d.token, d.format);'
      + '  }'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(phaseAListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Security event action — returns page that listens for event data via postMessage
  if (action === 'securityEvent') {
    var seListenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'var PARENT_ORIGIN = ' + JSON.stringify(PARENT_ORIGIN) + ';'
      + 'window.top.postMessage({type:"gas-security-event-ready"}, PARENT_ORIGIN);'
      + 'window.addEventListener("message", function(evt) {'
      + '  if (evt.origin !== PARENT_ORIGIN) return;'
      + '  if (!evt.data || evt.data.type !== "security-event-report") return;'
      + '  google.script.run'
      + '    .processSecurityEvent(evt.data.eventType, evt.data.details);'
      + '});'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(seListenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Security event reporting — client-side defense layers report blocked attacks
  // Phase 7: URL-parameter path kept for backwards compatibility during migration
  var securityEvent = (e && e.parameter && e.parameter.securityEvent) || '';
  if (securityEvent) {
    var seCache = getEpochCache();

    // Global rate limit: max 50 security events per 5-minute window (all sources combined)
    // Uses a single key independent of clientIp — prevents bypass via IP rotation
    var seGlobalKey = 'se_ratelimit_global';
    var seGlobalAttempts = seCache.get(seGlobalKey);
    var seGlobalCount = seGlobalAttempts ? parseInt(seGlobalAttempts, 10) : 0;

    if (seGlobalCount < 50) {
      seCache.put(seGlobalKey, String(seGlobalCount + 1), 300);
      var seDetails = {};
      try { seDetails = JSON.parse((e.parameter.details || '{}').substring(0, 500)); } catch(ex) {}
      auditLog('security_event', clientIp || 'unknown', securityEvent.substring(0, 50), {
        details: seDetails,
        clientIp: clientIp,
        userAgent: (e && e.parameter && e.parameter.ua) || '',
        page: EMBED_PAGE_URL
      });
    } else if (seGlobalCount === 50) {
      seCache.put(seGlobalKey, String(seGlobalCount + 1), 300);
      auditLog('security_event_flood', 'system', 'Global rate limit reached', {
        message: 'Max 50 security events per 5 minutes — further events suppressed regardless of source IP',
        lastClientIp: clientIp,
        lastEvent: securityEvent.substring(0, 50),
        page: EMBED_PAGE_URL
      });
    }
    // Return minimal response — no app HTML needed
    var seHtml = '<!DOCTYPE html><html><body></body></html>';
    return HtmlService.createHtmlOutput(seHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Phase 7 cleanup: Legacy URL-parameter heartbeat (?heartbeat=TOKEN) and
  // sign-out (?signOut=TOKEN) routes removed. These are now handled by:
  //   - processHeartbeat() via google.script.run from action=heartbeat listener page
  //   - processSignOut() via google.script.run from action=signout listener page
  // The postMessage-based approach eliminates token-in-URL exposure (H-5, H-6).

  // URL-parameter token exchange (standard mode)
  if (AUTH_CONFIG.TOKEN_EXCHANGE_METHOD === 'url') {
    var exchangeToken = (e && e.parameter && e.parameter.exchangeToken) || "";
    if (exchangeToken) {
      var result;
      try {
        result = exchangeTokenForSession(exchangeToken);
      } catch (err) {
        var errMsg = err.message || String(err);
        Logger.log("Token exchange error: " + errMsg);
        // Surface specific misconfiguration errors so the admin sees what to fix
        var errorCode = "server_error";
        if (errMsg.indexOf('HMAC_SECRET') !== -1) errorCode = "hmac_secret_missing";
        result = { success: false, error: errorCode };
      }
      var payload = JSON.stringify({
            type: "gas-session-created",
            success: result.success,
            sessionToken: result.sessionToken || "",
            email: result.email || "",
            displayName: result.displayName || "",
            error: result.error || "",
            reason: result.reason || "",   // acl_unavailable sub-cause — dropped by the whitelist otherwise
            absoluteTimeout: result.absoluteTimeout || 0,
            messageKey: result.messageKey || "",
            role: result.role || "",
            permissions: result.permissions || [],
            version: VERSION   // lets the host pill mirror the live GAS version on fresh sign-ins (gas-auth-ok already carries it for returning users)
          });
      var exchangeHtml = '<!DOCTYPE html><html><body><script>'
        + 'try { window.top.postMessage(' + payload + ', ' + JSON.stringify(PARENT_ORIGIN) + '); } catch(e) {}'
        + '</' + 'script></body></html>';
      return HtmlService.createHtmlOutput(exchangeHtml)
        .setTitle(TITLE)
        .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    }
  }

  // postMessage token exchange (HIPAA mode)
  if (AUTH_CONFIG.TOKEN_EXCHANGE_METHOD === 'postMessage' && !sessionToken) {
    var listenerHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>'
      + 'window.addEventListener("message", function(e) {'
      + '  if (!e.data || e.data.type !== "exchange-token") return;'
      + '  var token = e.data.accessToken;'
      + '  if (!token) return;'
      + '  var nonce = e.data.nonce || "";'  // Phase 2: echo nonce back for verification
      + '  google.script.run'
      + '    .withSuccessHandler(function(result) {'
      + '      window.top.postMessage({'
      + '        type: "gas-session-created",'
      + '        success: result.success,'
      + '        sessionToken: result.sessionToken || "",'
      + '        email: result.email || "",'
      + '        displayName: result.displayName || "",'
      + '        error: result.error || "",'
      + '        reason: result.reason || "",'
      + '        absoluteTimeout: result.absoluteTimeout || 0,'
      + '        messageKey: result.messageKey || "",'
      + '        role: result.role || "",'
      + '        permissions: result.permissions || [],'
      + '        version: ' + JSON.stringify(VERSION) + ','   // host pill mirrors the live GAS version on fresh sign-ins
      + '        nonce: nonce'
      + '      }, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '    })'
      + '    .withFailureHandler(function(err) {'
      + '      var code = "server_error";'
      + '      if (err && err.message && err.message.indexOf("HMAC_SECRET") !== -1) code = "hmac_secret_missing";'
      + '      window.top.postMessage({'
      + '        type: "gas-session-created",'
      + '        success: false,'
      + '        error: code,'
      + '        nonce: nonce'
      + '      }, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '    })'
      + '    .exchangeTokenForSession(token);'
      + '});'
      + 'window.top.postMessage({ type: "gas-ready-for-token" }, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(listenerHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // ── Page nonce validation ──
  // The page_nonce is a one-time-use token generated by generatePageNonce()
  // via the action=getNonce listener page. It binds a validated session to a
  // single page load without ever exposing the session token in the URL.
  var pageNonce = (e && e.parameter && e.parameter.page_nonce) || '';
  if (pageNonce) {
    sessionToken = validatePageNonce(pageNonce) || '';
  }

  // Normal flow: validate session token (from page_nonce or ?session= parameter)
  var session = validateSession(sessionToken);

  if (session.status !== "authorized") {
    var evReason = session.evictionReason || '';
    var authHtml = '<!DOCTYPE html><html><body><script>'
      + 'window.top.postMessage({type:"gas-needs-auth",authStatus:"' + escapeJs(session.status) + '",email:"' + escapeJs(session.email || '') + '",version:"' + escapeJs(VERSION) + '",evictionReason:"' + escapeJs(evReason) + '"}, ' + JSON.stringify(PARENT_ORIGIN) + ');'
      + '</' + 'script></body></html>';
    return HtmlService.createHtmlOutput(authHtml)
      .setTitle(TITLE)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }

  // Retrieve messageKey from session data for signing outgoing messages
  var appMsgKey = '';
  try {
    var appCache = getEpochCache();
    var appRaw = appCache.get("session_" + sessionToken);
    if (appRaw) { appMsgKey = JSON.parse(appRaw).messageKey || ''; }
  } catch(e) {}


  // Admin role detection for conditional admin UI
  var isAdmin = (session.role === 'admin');
  var sessionTokenForAdmin = isAdmin ? sessionToken : '';

  // Session valid — build the authenticated app UI
  var html = `
    <html>
    <head>
      <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">
      <meta http-equiv="Pragma" content="no-cache">
      <meta http-equiv="Expires" content="0">
      <style>
        html, body { height: 100%; margin: 0; overflow: hidden; }
        body { font-family: sans-serif; background: #bdbdbd; }  /* shows through the 30px top/bottom bands around the app surface */
        /* PROJECT START — Add your project-specific styles here */
        /* PROJECT END */
        /* App surface inset 30px top/bottom: the GAS layer spans the full screen, but the app
           UI/background lives between the bands — only overlay chrome (version pill, signed-in
           email, usable-area readout) occupies the exposed strips. Projects restyle background/
           color freely; keep the insets so the framing matches the other apps */
        #main-content { position: fixed; top: 30px; left: 0; right: 0; bottom: 30px; overflow: auto; background: #fff; color: #000; }
        #version { position: fixed; bottom: 9px; left: 8px; z-index: 9999; color: #1565c0; font-size: 12px; margin: 0; font-family: monospace; opacity: 0.8; }
        /* Signed-in email is a flex row in the top band: the live pills nest inside it
           so they sit immediately after the username and track its width automatically.
           Color/opacity live on #user-email-text so the pills stay full-strength. */
        #user-email { position: fixed; top: 3px; left: 8px; z-index: 9999; display: flex; align-items: center; gap: 10px; font-size: 11px; font-family: monospace; }
        #user-email-text { color: #666; opacity: 0.7; }
        /* Discreet usable-area readout: live width×height of the app viewport. Sits on the
           bottom band, left of the HOST page's pill stack (which owns the bottom-right corner
           at right:22px with pills stacked up to ~86px high) */
        #app-dims { position: fixed; right: 185px; bottom: 10px; z-index: 9000; color: #888; font: 10px/1 monospace; opacity: 0.7; pointer-events: none; }
        /* Live sync + viewer presence pills — poll countdown + who is viewing.
           Not independently positioned: they live inside the #user-email flex row in the
           top spacer band, immediately after the signed-in username, and stay clear of
           the app area and the HOST page's signed-in pill (top-right, z-index 10012). */
        #live-status-bar { display: flex; align-items: center; gap: 6px; font-family: Arial, sans-serif; }
        .dt-live { display:inline-flex; align-items:center; gap:5px; font-size:11px; color:#8b949e; background:#0d1117; border:1px solid #30363d; border-radius:20px; padding:3px 9px; white-space:nowrap; }
        .dt-live-dot { width:8px; height:8px; border-radius:50%; background:#3fb950; }
        .dt-live.off .dt-live-dot { background:#d29922; }
        .dt-live #dt-live-lbl { color:#e6edf3; font-weight:600; }
        .dt-live .dt-live-sub { color:#6e7681; }
        .dt-presence { position:relative; display:inline-flex; align-items:center; gap:5px; font-size:11px; color:#8b949e; background:#0d1117; border:1px solid #30363d; border-radius:20px; padding:3px 9px; white-space:nowrap; cursor:default; }
        .dt-presence .dt-pres-ico { font-size:12px; }
        .dt-presence #dt-pres-count { color:#e6edf3; font-weight:600; }
        .dt-pres-pop { position:absolute; top:100%; left:0; margin-top:6px; min-width:190px; max-height:280px; overflow:auto; background:#161b22; border:1px solid #30363d; border-radius:8px; padding:6px; z-index:60; box-shadow:0 6px 20px rgba(0,0,0,.45); display:none; }
        .dt-presence:hover .dt-pres-pop, .dt-presence.open .dt-pres-pop { display:block; }
        .dt-pres-row { display:flex; align-items:center; gap:7px; padding:4px 7px; border-radius:5px; font-size:12px; color:#c9d1d9; white-space:nowrap; }
        .dt-pres-dot { width:8px; height:8px; border-radius:50%; flex:0 0 auto; }
        .dt-pres-dot.active { background:#3fb950; }
        .dt-pres-dot.away { background:#d29922; }
        .dt-pres-you { color:#6e7681; }
        .dt-pres-empty { padding:6px 8px; color:#6e7681; font-size:11px; }
        ${isAdmin ? `
        /* Admin panel styles */
        #admin-badge { position: fixed; top: 7px; left: 12px; z-index: 100; background: rgba(0,0,0,0.55); padding: 3px 8px; border: 1px solid rgba(255,255,255,0.2); border-radius: 10px; font: 10px/1 monospace; text-transform: uppercase; letter-spacing: 0.5px; color: #90caf9; cursor: pointer; opacity: 0.6; transition: opacity 0.2s; }
        #admin-dropdown-gas { display: none; position: fixed; top: 31px; left: 12px; z-index: 101; background: rgba(20,20,30,0.95); border: 1px solid rgba(255,255,255,0.15); border-radius: 6px; padding: 4px 0; min-width: 140px; box-shadow: 0 4px 16px rgba(0,0,0,0.4); }
        #admin-dropdown-gas button { display: block; width: 100%; text-align: left; padding: 6px 12px; background: none; border: none; color: #90caf9; cursor: pointer; font: 11px/1.4 monospace; white-space: nowrap; }
        #admin-dropdown-gas button:hover { background: rgba(144,202,249,0.1); color: #fff; }
        #admin-panel-overlay { display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; z-index: 200; background: rgba(0,0,0,0.6); }
        #admin-panel { position: fixed; top: 40px; left: 8px; z-index: 201; background: rgba(20,20,30,0.98); color: #ccc; border: 1px solid #444; border-radius: 8px; font: 12px/1.4 monospace; width: 480px; max-width: calc(100vw - 16px); max-height: calc(100vh - 80px); overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.5); display: flex; flex-direction: column; }
        #admin-panel-header { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid #444; flex-shrink: 0; }
        #admin-panel-header .admin-title { color: #90caf9; font-weight: bold; font-size: 13px; }
        #admin-panel-close { background: none; border: none; color: #999; cursor: pointer; font-size: 16px; padding: 0 4px; }
        #admin-panel-close:hover { color: #fff; }
        #admin-nav { display: flex; border-bottom: 1px solid #333; padding: 4px 8px; gap: 4px; flex-shrink: 0; }
        .admin-tab { background: none; border: 1px solid #555; color: #90caf9; cursor: pointer; font: 10px/1 monospace; padding: 3px 8px; border-radius: 3px; }
        .admin-tab:hover { background: rgba(144,202,249,0.1); }
        .admin-tab.active { background: rgba(144,202,249,0.15); border-color: #90caf9; }
        #admin-menu-gas { display: flex; flex-wrap: wrap; gap: 4px; padding: 6px 8px; border-bottom: 1px solid #333; flex-shrink: 0; }
        .admin-menu-btn { background: none; border: none; color: #90caf9; cursor: pointer; font: 11px/1 monospace; padding: 2px 6px; }
        .admin-menu-btn:hover { color: #fff; text-decoration: underline; }
        .admin-menu-btn.active { color: #fff; font-weight: bold; }
        #admin-content { flex: 1; overflow-y: auto; padding: 10px 12px; }
        .pa-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #444; padding-bottom: 8px; }
        .pa-title { color: #90caf9; font-weight: bold; font-size: 13px; }
        .pa-action { border: 1px solid #90caf9; color: #90caf9; background: none; cursor: pointer; font: 10px/1 monospace; padding: 2px 8px; border-radius: 3px; }
        .pa-action:hover { background: rgba(144,202,249,0.1); }
        .pa-body { margin-top: 8px; }
        .pa-body label { display: block; color: #aaa; font-size: 11px; margin: 8px 0 4px; }
        .pa-body input, .pa-body textarea, .pa-body select { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid #555; color: #eee; padding: 6px 8px; border-radius: 4px; font: 12px monospace; box-sizing: border-box; }
        .pa-body textarea { resize: vertical; }
        .pa-format-picker { margin: 8px 0; }
        .pa-format-picker label { display: inline; margin-right: 12px; color: #ccc; font-size: 12px; }
        .pa-status { color: #999; font-size: 11px; margin-top: 8px; text-align: center; }
        .pa-empty { color: #888; font-size: 11px; text-align: center; padding: 16px 0; }
        .pa-card { background: rgba(255,255,255,0.05); border: 1px solid #444; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; }
        .pa-card-header { color: #90caf9; font-weight: bold; font-size: 11px; }
        .pa-card-meta { color: #888; font-size: 10px; margin: 4px 0; }
        .pa-card-field { font-size: 11px; margin: 4px 0; }
        .pa-card-field strong { color: #aaa; }
        .pa-card-actions { margin-top: 8px; display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
        .pa-approve { border: 1px solid #66bb6a; color: #66bb6a; background: none; cursor: pointer; font: 10px/1 monospace; padding: 2px 8px; border-radius: 3px; }
        .pa-approve:hover { background: rgba(102,187,106,0.15); }
        .pa-deny { border: 1px solid #ef5350; color: #ef5350; background: none; cursor: pointer; font: 10px/1 monospace; padding: 2px 8px; border-radius: 3px; }
        .pa-deny:hover { background: rgba(239,83,80,0.15); }
        .pa-deny-reason { width: 100%; background: rgba(255,255,255,0.08); border: 1px solid #555; color: #eee; padding: 4px 6px; border-radius: 3px; font: 10px monospace; margin-top: 4px; display: none; }
        .asp-session { background: rgba(255,255,255,0.05); border: 1px solid #333; border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; }
        .asp-session.asp-self { border-color: #1565c0; }
        .asp-session.asp-emergency { border-color: #ef5350; }
        .asp-role-badge { display: inline-block; padding: 1px 6px; border-radius: 3px; font-size: 9px; text-transform: uppercase; background: rgba(255,255,255,0.1); color: #90caf9; }
        .asp-meta { color: #888; font-size: 10px; margin: 4px 0; }
        .asp-kick { background: none; border: 1px solid #ef5350; color: #ef5350; cursor: pointer; font: 10px/1 monospace; padding: 2px 8px; border-radius: 3px; margin-top: 6px; }
        .asp-kick:hover { background: rgba(239,83,80,0.15); }
        ` : ''}
      </style>
    </head>
    <body>
      <h2 id="version">${escapeHtml(VERSION)}</h2>
      <div id="user-email">
        <span id="user-email-text">${escapeHtml(session.email)}</span>
        <!-- Live sync + viewer presence pills (template) — anchored right after the username -->
        <div id="live-status-bar">
          <div class="dt-live" id="dt-live" title="Live multi-user sync — others' changes appear automatically"><span class="dt-live-dot"></span><span id="dt-live-lbl">Live</span><span class="dt-live-sub" id="dt-live-since"></span><span class="dt-live-sub">|</span><span class="dt-live-sub" id="dt-live-next">▷ --</span></div>
          <div class="dt-presence" id="dt-presence" title="People currently viewing this app — green = active, amber = away (window not focused). Hover for the list."><span class="dt-pres-ico">👥</span><span id="dt-pres-count">–</span><span class="dt-pres-pop" id="dt-pres-pop"></span></div>
        </div>
      </div>
      <!-- GAS toggle moved to HTML layer for full iframe hide/show
      <button id="gas-layer-toggle" onclick="window._toggleGasLayer()" style="position:fixed;bottom:7px;left:135px;z-index:9999;background:rgba(0,0,0,0.55);color:#ccc;border:1px solid rgba(255,255,255,0.2);padding:3px 8px;border-radius:10px;font:10px/1 monospace;cursor:pointer;opacity:0.6;transition:opacity 0.2s;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">GAS</button>
      -->
      ${isAdmin ? `
      <div id="admin-badge" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.6'">ADMIN &#x25BE;</div>
      <div id="admin-dropdown-gas">
        <button data-admin-panel="sessions">Sessions</button>
        <button data-admin-panel="disclosures">Disclosures</button>
        <button data-admin-panel="data-export">My Data</button>
        <button data-admin-panel="amendment">Correction</button>
        <button data-admin-panel="amendment-review">Amendments</button>
        <button data-admin-panel="disagreement">Disagree</button>
        <button data-admin-panel="extension">Extensions</button>
        <button data-admin-panel="denial-notice">Denial Notice</button>
        <button data-admin-panel="ehr-disclosures">EHR Disclosures</button>
        <button data-admin-panel="breach-log">Breach Log</button>
        <button data-admin-panel="representatives">Representatives</button>
        <button data-admin-panel="legal-holds">Legal Holds</button>
        <button data-admin-panel="compliance-audit">Compliance Audit</button>
        <button data-admin-panel="archive-integrity">Archive Integrity</button>
        <button data-admin-panel="retention-policy">Retention Policy</button>
      </div>
      <div id="admin-panel-overlay">
        <div id="admin-panel">
          <div id="admin-panel-header">
            <span class="admin-title">Admin Tools</span>
            <button id="admin-panel-close">&times;</button>
          </div>
          <div id="admin-content">
            <div id="admin-loading" class="pa-empty">Select a tool from the admin menu.</div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- App surface (template): project content renders inside the inset framing -->
      <div id="main-content">
        <!-- PROJECT START — Add your project-specific content here -->
        <!-- PROJECT END -->
      </div>
      <span id="app-dims"></span>

      <script>
        // PostMessage handshake guard: verify we are embedded in the correct parent page.
        // Only runs on the ?session= path. Skipped on the ?page_nonce= path because
        // nonces are one-time-use — a copied nonce URL is already useless.
        var _loadedViaNonce = ${pageNonce ? 'true' : 'false'};
        if (!_loadedViaNonce) {
          document.body.style.visibility = 'hidden';
          var _hsId = Math.random().toString(36).substring(2) + Date.now().toString(36);
          var _hsOk = false;
          window.addEventListener('message', function(ev) {
            if (ev.data && ev.data.type === 'frame-handshake-response' && ev.data.handshakeId === _hsId) {
              _hsOk = true;
              document.body.style.visibility = 'visible';
            }
          });
          window.top.postMessage({type: 'frame-handshake-challenge', handshakeId: _hsId}, '${PARENT_ORIGIN}');
          setTimeout(function() {
            if (!_hsOk) {
              document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:Arial;color:#666;"><p>Access denied. This application must be accessed through its authorized embedding page.</p></div>';
              document.body.style.visibility = 'visible';
            }
          }, 2000);
        }

        // Session token for data operation validation (Phase 3)
        var _sessionToken = '${escapeJs(sessionToken)}';
        // DJB2→HMAC migration complete: _s() and _mk removed.
        // All message signing now happens server-side via signAppMessage()
        // (called through google.script.run — same pattern as Phase 7 heartbeat/signout).

        // Phase 3 (C-3): Client IP collection removed — ipify.org lacks BAA coverage.
        // To re-enable, uncomment below and set AUTH_CONFIG.ENABLE_IP_LOGGING = true:
        // var _clientIp = '';
        // function _valIp(v) {
        //   if (!v || typeof v !== 'string') return 'unknown';
        //   var t = v.trim().substring(0, 45);
        //   if (/^(\\d{1,3}\\.){3}\\d{1,3}$/.test(t) || /^[0-9a-fA-F:]+$/.test(t)) return t;
        //   return 'invalid';
        // }
        // if (${AUTH_CONFIG.ENABLE_IP_LOGGING}) {
        //   try {
        //     var _ipXhr = new XMLHttpRequest();
        //     _ipXhr.open('GET', 'https://api.ipify.org?format=text', true);
        //     _ipXhr.timeout = 5000;
        //     _ipXhr.onload = function() { if (_ipXhr.status === 200) _clientIp = _valIp(_ipXhr.responseText); };
        //     _ipXhr.onerror = function() { _clientIp = 'unknown'; };
        //     _ipXhr.ontimeout = function() { _clientIp = 'unknown'; };
        //     _ipXhr.send();
        //   } catch(e) { _clientIp = 'unknown'; }
        // }

        // Notify wrapper that auth is OK — send immediately so the host page
        // can show the app without waiting for the async google.script.run call.
        window.top.postMessage({type: 'gas-auth-ok', version: '${escapeJs(VERSION)}',
          needsReauth: ${session.needsReauth || false},
          messageKey: '${escapeJs(appMsgKey)}',
          role: '${escapeJs(session.role || RBAC_DEFAULT_ROLE)}',
          permissions: ${JSON.stringify(session.permissions || getRolesFromSpreadsheet()[session.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE])}}, '${PARENT_ORIGIN}');

        // Also send a signed version via google.script.run (belt-and-suspenders)
        google.script.run
          .withSuccessHandler(function(signed) {
            window.top.postMessage(signed, '${PARENT_ORIGIN}');
          })
          .withFailureHandler(function(err) {
            // Fallback: send unsigned gas-auth-ok so the host page at least knows
            // the session is valid (verification will pass because no key is set yet)
            window.top.postMessage({type: 'gas-auth-ok', version: '${escapeJs(VERSION)}',
              needsReauth: ${session.needsReauth || false},
              messageKey: '${escapeJs(appMsgKey)}',
              role: '${escapeJs(session.role || RBAC_DEFAULT_ROLE)}',
              permissions: ${JSON.stringify(session.permissions || getRolesFromSpreadsheet()[session.role] || getRolesFromSpreadsheet()[RBAC_DEFAULT_ROLE])}}, '${PARENT_ORIGIN}');
          })
          .signAppMessage(_sessionToken, 'gas-auth-ok');

        window.addEventListener('message', function(e) {
          // Phase 3: IP receiver removed — uncomment to re-enable
          // if (e.data && e.data.type === 'host-client-ip') {
          //   _clientIp = _valIp(e.data.ip);
          // }
          if (e.data && e.data.type === 'gas-version-check') {
            // DJB2→HMAC migration: signed server-side via signAppMessage()
            google.script.run
              .withSuccessHandler(function(signed) {
                top.postMessage(signed, '${PARENT_ORIGIN}');
              })
              .withFailureHandler(function() {
                // Don't send an unsigned response — the version poll is periodic and will retry.
                // A missing response is safer than an unsigned one that gets dropped by HMAC verify.
              })
              .signAppMessage(_sessionToken, 'gas-version');
          }
        });

        // Usable-area readout (template): live width×height of the app viewport,
        // updated on resize and device rotation
        (function () {
          function updDims() {
            var el = document.getElementById('app-dims');
            if (el) el.textContent = (window.innerWidth || 0) + '×' + (window.innerHeight || 0);
          }
          window.addEventListener('resize', updDims);
          window.addEventListener('orientationchange', updDims);
          updDims();
        })();

        // Activity detection — notify host page on user interaction so it can
        // trigger an immediate heartbeat (catches expired sessions before data loss)
        // DJB2→HMAC migration: signed server-side via signAppMessage()
        var _lastActivityNotify = 0;
        var _pendingActivity = false;
        function _notifyActivity() {
          var now = Date.now();
          if (now - _lastActivityNotify < 5000) return; // 5s debounce
          if (_pendingActivity) return; // Prevent stacking server calls
          _lastActivityNotify = now;
          _pendingActivity = true;
          google.script.run
            .withSuccessHandler(function(signed) {
              _pendingActivity = false;
              window.top.postMessage(signed, '${PARENT_ORIGIN}');
            })
            .withFailureHandler(function() {
              _pendingActivity = false;
              // Silently drop — next activity event will retry
            })
            .signAppMessage(_sessionToken, 'gas-user-activity');
        }
        document.addEventListener('keydown', _notifyActivity, true);
        document.addEventListener('click', _notifyActivity, true);
        document.addEventListener('input', _notifyActivity, true);

        // GAS layer visibility toggle
        (function() {
          var _gasLayerVisible = true;
          var _gasLayerEls = ['version', 'user-email', 'main-content', 'app-dims', 'admin-badge', 'admin-dropdown-gas', 'admin-panel-overlay', 'live-status-bar'];
          window._toggleGasLayer = function() {
            _gasLayerVisible = !_gasLayerVisible;
            var btn = document.getElementById('gas-layer-toggle');
            _gasLayerEls.forEach(function(id) {
              var el = document.getElementById(id);
              if (!el) return;
              el.style.display = _gasLayerVisible ? '' : 'none';
            });
            if (btn) {
              btn.textContent = _gasLayerVisible ? 'GAS' : 'GAS \\u25CB';
              btn.style.borderColor = _gasLayerVisible ? 'rgba(255,255,255,0.2)' : '#58a6ff';
            document.body.style.background = _gasLayerVisible ? '' : 'transparent';
            }
          };
        })();

        // Admin panel logic (only included for admin users)
        ${isAdmin ? `
        (function() {
          var _adminToken = '${escapeJs(sessionTokenForAdmin)}';
          var _adminPanelOpen = false;
          var _activeAdminPanel = null;

          function _escA(s) { if (!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

          function _setStatus(elId, msg, color) {
            var el = document.getElementById(elId);
            if (el) { el.textContent = msg; if (color) el.style.color = color; }
          }

          function _gasCall(fn, args, onOk, onErr) {
            var r = google.script.run.withSuccessHandler(onOk || function(){}).withFailureHandler(onErr || function(e){ console.error('Admin GAS error:', e); });
            r[fn].apply(r, args);
          }

          // Admin badge toggle dropdown
          document.getElementById('admin-badge').addEventListener('click', function(e) {
            e.stopPropagation();
            var dd = document.getElementById('admin-dropdown-gas');
            dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
          });
          document.addEventListener('click', function(e) {
            var dd = document.getElementById('admin-dropdown-gas');
            if (dd && !dd.contains(e.target) && e.target.id !== 'admin-badge') dd.style.display = 'none';
          });

          // Dropdown button click → open panel
          var ddBtns = document.querySelectorAll('#admin-dropdown-gas button');
          for (var i = 0; i < ddBtns.length; i++) {
            ddBtns[i].addEventListener('click', function() {
              document.getElementById('admin-dropdown-gas').style.display = 'none';
              _openAdminPanel(this.getAttribute('data-admin-panel'));
            });
          }

          // Close panel
          document.getElementById('admin-panel-close').addEventListener('click', function() {
            document.getElementById('admin-panel-overlay').style.display = 'none';
            _adminPanelOpen = false;
            _activeAdminPanel = null;
          });
          document.getElementById('admin-panel-overlay').addEventListener('click', function(e) {
            if (e.target === this) {
              this.style.display = 'none';
              _adminPanelOpen = false;
              _activeAdminPanel = null;
            }
          });

          function _openAdminPanel(panelId) {
            _activeAdminPanel = panelId;
            _adminPanelOpen = true;
            document.getElementById('admin-panel-overlay').style.display = 'block';
            var content = document.getElementById('admin-content');
            content.innerHTML = _getAdminPanelHtml(panelId);
            _attachAdminListeners(panelId);
            _loadAdminData(panelId);
          }

          function _loadAdminData(id) {
            switch(id) {
              case 'sessions': _loadSessions(); break;
              case 'disclosures': _loadDisclosures(); break;
              case 'amendment-review': _loadPendingAmendments(); break;
              case 'ehr-disclosures': _loadEhrDisclosures(); break;
              case 'breach-log': _loadBreachLog(); break;
              case 'representatives': _loadRepresentatives(); break;
              case 'legal-holds': _loadLegalHolds(); break;
            }
          }

          // Sessions loader
          function _loadSessions() {
            var el = document.getElementById('admin-session-list');
            if (el) el.innerHTML = '<div class="pa-status">Loading sessions...</div>';
            _gasCall('listActiveSessions', [_adminToken], function(r) { _renderSessions(r); });
          }
          function _renderSessions(sessions) {
            var list = document.getElementById('admin-session-list');
            if (!list) return;
            if (!sessions || sessions.length === 0) { list.innerHTML = '<div class="pa-empty">No active sessions found.</div>'; return; }
            var html = '';
            for (var i = 0; i < sessions.length; i++) {
              var s = sessions[i];
              var selfClass = s.isSelf ? ' asp-self' : '';
              var selfLabel = s.isSelf ? ' (you)' : '';
              html += '<div class="asp-session' + selfClass + '">';
              html += '<div style="display:flex;justify-content:space-between;align-items:center;">';
              html += '<strong style="color:#ccc;font-size:11px;">' + _escA(s.email || '') + selfLabel + '</strong>';
              html += '<span class="asp-role-badge">' + _escA(s.role || '') + '</span>';
              html += '</div>';
              html += '<div class="asp-meta">Created: ' + _escA(s.createdAt ? new Date(s.createdAt).toLocaleString() : '') + '</div>';
              html += '<div class="asp-meta">Last activity: ' + _escA(s.lastActivity ? new Date(s.lastActivity).toLocaleString() : '') + '</div>';
              if (!s.isSelf) {
                html += '<button class="asp-kick" data-kick-email="' + _escA(s.email) + '">Sign Out User</button>';
              }
              html += '</div>';
            }
            list.innerHTML = html;
            var kickBtns = list.querySelectorAll('.asp-kick');
            for (var k = 0; k < kickBtns.length; k++) {
              kickBtns[k].addEventListener('click', function() {
                var email = this.getAttribute('data-kick-email');
                this.textContent = 'Signing out...';
                this.disabled = true;
                _gasCall('adminSignOutUser', [_adminToken, email], function(r) {
                  if (r && r.success) { setTimeout(function(){ _loadSessions(); }, 500); }
                });
              });
            }
          }

          // HIPAA data loaders (same as Phase 1 but using google.script.run directly)
          function _loadDisclosures() {
            var el = document.getElementById('disclosure-list'); if(el) el.innerHTML = '';
            var empty = document.getElementById('disclosure-empty'); if(empty) empty.style.display = 'none';
            var period = document.getElementById('disclosure-period'); if(period) period.textContent = 'Loading disclosures (6-year lookback)...';
            var grouped = document.getElementById('disclosure-grouped-toggle');
            if (grouped && grouped.checked) {
              _gasCall('getGroupedDisclosureAccounting', [_adminToken], function(r) { _renderDisclosures(r); });
            } else {
              _gasCall('getDisclosureAccounting', [_adminToken], function(r) { _renderDisclosures(r); });
            }
          }
          function _loadPendingAmendments() {
            var el = document.getElementById('amend-review-list'); if(el) el.innerHTML = '';
            var empty = document.getElementById('amend-review-empty'); if(empty) empty.style.display = 'none';
            _gasCall('getPendingAmendments', [_adminToken], function(r) { _renderPendingAmendments(r); });
          }
          function _loadEhrDisclosures() {
            var el = document.getElementById('ehr-list'); if(el) el.innerHTML = '';
            var empty = document.getElementById('ehr-empty'); if(empty) empty.style.display = 'none';
            var period = document.getElementById('ehr-period'); if(period) period.textContent = 'Loading EHR TPO disclosures (3-year lookback)...';
            _gasCall('getDisclosureAccounting', [_adminToken, null, {includeEhrTpo: true}], function(r) { _renderEhrDisclosures(r); });
          }
          function _loadBreachLog() {
            var el = document.getElementById('breach-log-list'); if(el) el.innerHTML = '';
            var empty = document.getElementById('breach-empty'); if(empty) empty.style.display = 'none';
            _gasCall('getBreachLog', [_adminToken], function(r) { _renderBreachLog(r); });
          }
          function _loadRepresentatives() {
            var el = document.getElementById('rep-list'); if(el) el.innerHTML = '';
            var empty = document.getElementById('rep-empty'); if(empty) empty.style.display = 'none';
            _gasCall('getPersonalRepresentatives', [_adminToken], function(r) { _renderRepresentatives(r); });
          }
          function _loadLegalHolds() {
            var el = document.getElementById('lh-list'); if(el) el.innerHTML = '';
            var empty = document.getElementById('lh-empty'); if(empty) empty.style.display = 'none';
            var filter = document.getElementById('lh-status-filter');
            _gasCall('getLegalHolds', [_adminToken, filter ? {status: filter.value} : {}], function(r) { _renderLegalHolds(r); });
          }

          // Render functions
          function _renderDisclosures(result) {
            var container = document.getElementById('disclosure-list');
            var empty = document.getElementById('disclosure-empty');
            var period = document.getElementById('disclosure-period');
            if (!result || !result.success) { if(container) container.innerHTML = '<div style="color:#ef5350">Error: ' + _escA(result ? result.message : 'No response') + '</div>'; return; }
            if(period) period.textContent = result.period || '';
            if (!result.items || result.items.length === 0) { if(empty) empty.style.display = ''; return; }
            var html = '';
            for (var i = 0; i < result.items.length; i++) {
              var d = result.items[i];
              html += '<div class="pa-card"><div class="pa-card-header">' + _escA(d.recipient || 'Unknown') + '</div>';
              html += '<div class="pa-card-meta">' + _escA(d.date || '') + '</div>';
              html += '<div class="pa-card-field"><strong>Purpose:</strong> ' + _escA(d.purpose || '') + '</div>';
              if (d.description) html += '<div class="pa-card-field">' + _escA(d.description) + '</div>';
              if (d.count) html += '<div class="pa-card-field"><strong>Occurrences:</strong> ' + _escA(d.count) + '</div>';
              html += '</div>';
            }
            if(container) container.innerHTML = html;
          }
          function _renderEhrDisclosures(result) {
            var container = document.getElementById('ehr-list');
            var empty = document.getElementById('ehr-empty');
            var period = document.getElementById('ehr-period');
            if (!result || !result.success) { if(container) container.innerHTML = '<div style="color:#ef5350">Error: ' + _escA(result ? result.message : 'No response') + '</div>'; return; }
            if(period) period.textContent = result.period || '';
            if (!result.items || result.items.length === 0) { if(empty) empty.style.display = ''; return; }
            var html = '';
            for (var i = 0; i < result.items.length; i++) {
              var d = result.items[i];
              html += '<div class="pa-card"><div class="pa-card-header">' + _escA(d.recipient || 'Unknown') + '</div>';
              html += '<div class="pa-card-meta">' + _escA(d.date || '') + ' \\u2014 ' + _escA(d.purpose || 'TPO') + '</div>';
              if (d.description) html += '<div class="pa-card-field">' + _escA(d.description) + '</div>';
              html += '</div>';
            }
            if(container) container.innerHTML = html;
          }
          function _renderPendingAmendments(result) {
            var container = document.getElementById('amend-review-list');
            var empty = document.getElementById('amend-review-empty');
            if (!result || !result.success) { if(container) container.innerHTML = '<div style="color:#ef5350">Error: ' + _escA(result ? result.message : 'No response') + '</div>'; return; }
            if (!result.items || result.items.length === 0) { if(empty) empty.style.display = ''; return; }
            var html = '';
            for (var i = 0; i < result.items.length; i++) {
              var a = result.items[i];
              html += '<div class="pa-card"><div class="pa-card-header">Amendment #' + _escA(a.id || '') + '</div>';
              html += '<div class="pa-card-meta">Requested: ' + _escA(a.date || '') + ' by ' + _escA(a.requestor || '') + '</div>';
              html += '<div class="pa-card-field"><strong>Record:</strong> ' + _escA(a.recordId || '') + '</div>';
              html += '<div class="pa-card-field"><strong>Proposed:</strong> ' + _escA(a.proposed || '') + '</div>';
              if (a.reason) html += '<div class="pa-card-field"><strong>Reason:</strong> ' + _escA(a.reason) + '</div>';
              html += '<div class="pa-card-actions">';
              html += '<button class="pa-approve" data-amend-id="' + _escA(a.id) + '">Approve</button>';
              html += '<button class="pa-deny" data-amend-id="' + _escA(a.id) + '">Deny</button>';
              html += '<textarea class="pa-deny-reason" data-amend-id="' + _escA(a.id) + '" placeholder="Reason for denial"></textarea>';
              html += '</div></div>';
            }
            if(container) container.innerHTML = html;
            var appBtns = container.querySelectorAll('.pa-approve');
            for (var j = 0; j < appBtns.length; j++) {
              appBtns[j].addEventListener('click', function() {
                _gasCall('reviewAmendment', [_adminToken, this.getAttribute('data-amend-id'), 'Approved', ''], function() { _loadPendingAmendments(); });
              });
            }
            var denBtns = container.querySelectorAll('.pa-deny');
            for (var k = 0; k < denBtns.length; k++) {
              denBtns[k].addEventListener('click', function() {
                var id = this.getAttribute('data-amend-id');
                var reasonEl = container.querySelector('.pa-deny-reason[data-amend-id="' + id + '"]');
                if (reasonEl.style.display === 'none' || !reasonEl.style.display) { reasonEl.style.display = 'block'; return; }
                var reason = reasonEl.value.trim();
                if (!reason) { reasonEl.style.borderColor = '#ef5350'; return; }
                _gasCall('reviewAmendment', [_adminToken, id, 'Denied', reason], function() { _loadPendingAmendments(); });
              });
            }
          }
          function _renderBreachLog(result) {
            var container = document.getElementById('breach-log-list');
            var empty = document.getElementById('breach-empty');
            if (!result || !result.success) { if(container) container.innerHTML = '<div style="color:#ef5350">Error: ' + _escA(result ? result.message : 'No response') + '</div>'; return; }
            if (!result.items || result.items.length === 0) { if(empty) empty.style.display = ''; return; }
            if(empty) empty.style.display = 'none';
            var html = '';
            for (var i = 0; i < result.items.length; i++) {
              var b = result.items[i];
              html += '<div class="pa-card"><div class="pa-card-header">Breach #' + _escA(b.id || '') + '</div>';
              html += '<div class="pa-card-meta">Discovered: ' + _escA(b.discoveryDate || '') + ' | Status: ' + _escA(b.status || '') + '</div>';
              html += '<div class="pa-card-field">' + _escA(b.description || '') + '</div>';
              if (b.count) html += '<div class="pa-card-field"><strong>Affected:</strong> ' + _escA(b.count) + ' individuals</div>';
              html += '</div>';
            }
            if(container) container.innerHTML = html;
          }
          function _renderRepresentatives(result) {
            var container = document.getElementById('rep-list');
            var empty = document.getElementById('rep-empty');
            if (!result || !result.success) { if(container) container.innerHTML = '<div style="color:#ef5350">Error: ' + _escA(result ? result.message : 'No response') + '</div>'; return; }
            if (!result.items || result.items.length === 0) { if(empty) empty.style.display = ''; return; }
            if(empty) empty.style.display = 'none';
            var html = '';
            for (var i = 0; i < result.items.length; i++) {
              var r = result.items[i];
              html += '<div class="pa-card"><div class="pa-card-header">' + _escA(r.name || '') + '</div>';
              html += '<div class="pa-card-meta">' + _escA(r.email || '') + ' \\u2014 ' + _escA(r.relationship || '') + '</div>';
              html += '<div class="pa-card-field"><strong>Patient:</strong> ' + _escA(r.patientEmail || '') + '</div>';
              html += '<div class="pa-card-actions"><button class="pa-deny" data-rep-id="' + _escA(r.id) + '">Revoke</button></div>';
              html += '</div>';
            }
            if(container) container.innerHTML = html;
            var revBtns = container.querySelectorAll('.pa-deny[data-rep-id]');
            for (var j = 0; j < revBtns.length; j++) {
              revBtns[j].addEventListener('click', function() {
                _gasCall('revokeRepresentative', [_adminToken, this.getAttribute('data-rep-id'), 'Revoked by admin'], function() { _loadRepresentatives(); });
              });
            }
          }
          function _renderLegalHolds(result) {
            var container = document.getElementById('lh-list');
            var empty = document.getElementById('lh-empty');
            if (!result || !result.success) { if(container) container.innerHTML = '<div style="color:#ef5350">Error: ' + _escA(result ? result.message : 'No response') + '</div>'; return; }
            if (!result.items || result.items.length === 0) { if(empty) empty.style.display = ''; return; }
            if(empty) empty.style.display = 'none';
            var html = '';
            for (var i = 0; i < result.items.length; i++) {
              var h = result.items[i];
              html += '<div class="pa-card"><div class="pa-card-header">' + _escA(h.caseName || '') + '</div>';
              html += '<div class="pa-card-meta">Placed: ' + _escA(h.date || '') + ' | Custodian: ' + _escA(h.custodian || '') + '</div>';
              html += '<div class="pa-card-field"><strong>Scope:</strong> ' + _escA(h.scope || '') + '</div>';
              html += '<div class="pa-card-actions"><button class="pa-approve" data-hold-id="' + _escA(h.id) + '">Release</button></div>';
              html += '</div>';
            }
            if(container) container.innerHTML = html;
            var relBtns = container.querySelectorAll('.pa-approve[data-hold-id]');
            for (var j = 0; j < relBtns.length; j++) {
              relBtns[j].addEventListener('click', function() {
                _gasCall('releaseLegalHold', [_adminToken, this.getAttribute('data-hold-id'), 'Released by admin'], function() { _loadLegalHolds(); });
              });
            }
          }

          function _renderSimpleResult(elId, result, field) {
            var el = document.getElementById(elId);
            if (!el) return;
            if (!result || !result.success) { el.innerHTML = '<div style="color:#ef5350">Error: ' + _escA(result ? result.message : 'No response') + '</div>'; return; }
            el.innerHTML = '<div class="pa-card" style="white-space:pre-wrap;font-size:10px;">' + _escA(result[field] || '') + '</div>';
          }

          function _downloadResult(result, defaultName) {
            if (!result || !result.success || !result.data) return;
            var blob = new Blob([typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)], {type:'text/plain'});
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a'); a.href = url; a.download = defaultName; a.click();
            URL.revokeObjectURL(url);
          }

          // Panel HTML templates
          function _getAdminPanelHtml(id) {
            switch(id) {
              case 'sessions': return '<div class="pa-header"><span class="pa-title">Active Sessions</span><span><button id="admin-sessions-refresh" class="pa-action">Refresh</button></span></div><div id="admin-session-list"><div class="pa-status">Loading sessions...</div></div>';
              case 'disclosures': return '<div class="pa-header"><span class="pa-title">Disclosure Accounting</span><span><select id="disclosure-export-format" style="background:rgba(255,255,255,0.08);border:1px solid #555;color:#ccc;font:10px monospace;padding:1px 4px;border-radius:3px;"><option value="json">JSON</option><option value="csv">CSV</option></select><button id="disclosure-export-btn" class="pa-action">Export</button></span></div><div style="padding:4px 0;"><label style="display:inline;color:#aaa;font-size:11px;cursor:pointer;"><input type="checkbox" id="disclosure-grouped-toggle" checked /> Group repeated disclosures</label></div><div id="disclosure-period" class="pa-status"></div><div id="disclosure-list"></div><div id="disclosure-empty" class="pa-empty" style="display:none;">No disclosures found.</div>';
              case 'data-export': return '<div class="pa-header"><span class="pa-title">Download My Data</span></div><div class="pa-body"><p style="color:#aaa;font-size:11px;margin:0 0 8px;">Download a copy of all your data (HIPAA \\u00a7164.524).</p><div class="pa-format-picker"><label><input type="radio" name="export-format" value="json" checked> JSON</label><label><input type="radio" name="export-format" value="csv"> CSV</label><label><input type="radio" name="export-format" value="summary"> Summary</label></div><div id="summary-agreement" style="display:none;margin:6px 0;padding:6px;background:rgba(255,255,255,0.04);border-radius:4px;"><label style="font-size:10px;display:inline;cursor:pointer;"><input type="checkbox" id="summary-agree-checkbox" /> I agree to receive a summary</label></div><button id="data-export-download-btn" class="pa-action" style="margin-top:8px;">Download</button><div id="data-export-status" class="pa-status"></div></div>';
              case 'amendment': return '<div class="pa-header"><span class="pa-title">Request Record Correction</span></div><div class="pa-body"><label>Record to correct:<input type="text" id="amend-record-id" placeholder="Record ID" /></label><label>Current content:<textarea id="amend-current" rows="2"></textarea></label><label>Proposed correction:<textarea id="amend-proposed" rows="3"></textarea></label><label>Reason:<textarea id="amend-reason" rows="2"></textarea></label><button id="amend-submit-btn" class="pa-action" style="margin-top:8px;">Submit</button><div id="amend-status" class="pa-status"></div></div>';
              case 'amendment-review': return '<div class="pa-header"><span class="pa-title">Pending Amendments</span><span><button id="amend-review-refresh" class="pa-action">Refresh</button></span></div><div id="amend-review-list"></div><div id="amend-review-empty" class="pa-empty" style="display:none;">No pending amendments.</div>';
              case 'disagreement': return '<div class="pa-header"><span class="pa-title">Statement of Disagreement</span></div><div class="pa-body"><label>Amendment Request ID:<input type="text" id="disagree-amendment-id" /></label><label>Your statement:<textarea id="disagree-statement" rows="4"></textarea></label><button id="disagree-submit-btn" class="pa-action" style="margin-top:8px;">Submit</button><div id="disagree-status" class="pa-status"></div></div>';
              case 'extension': return '<div class="pa-header"><span class="pa-title">Grant 30-Day Extension</span></div><div class="pa-body"><label>Request type:<select id="extension-type" style="background:rgba(255,255,255,0.08);border:1px solid #555;color:#ccc;font:12px monospace;padding:4px;border-radius:4px;width:100%;"><option value="access">Access Request</option><option value="amendment">Amendment Request</option></select></label><label>Request ID:<input type="text" id="extension-request-id" /></label><label>Reason:<textarea id="extension-reason" rows="3"></textarea></label><button id="extension-submit-btn" class="pa-action" style="margin-top:8px;">Grant Extension</button><div id="extension-status" class="pa-status"></div></div>';
              case 'denial-notice': return '<div class="pa-header"><span class="pa-title">Formal Denial Notice</span></div><div class="pa-body"><label>Request Type:<select id="denial-request-type" style="background:rgba(255,255,255,0.08);border:1px solid #555;color:#ccc;font:11px monospace;padding:3px 6px;border-radius:3px;width:100%;"><option value="access">Access Request</option><option value="amendment">Amendment Request</option></select></label><label>Request/Amendment ID:<input type="text" id="denial-request-id" /></label><label>Basis for denial:<textarea id="denial-basis" rows="3"></textarea></label><label style="display:inline;color:#aaa;font-size:11px;cursor:pointer;"><input type="checkbox" id="denial-reviewable" checked /> Denial is reviewable</label><label>Contact person:<input type="text" id="denial-contact" value="HIPAA Privacy Officer" /></label><label>Contact office:<input type="text" id="denial-office" value="Privacy Office" /></label><button id="denial-generate-btn" class="pa-action" style="margin-top:8px;">Generate</button><div id="denial-status" class="pa-status"></div><div id="denial-notice-output" style="display:none;margin-top:8px;padding:8px;background:rgba(255,255,255,0.04);border-radius:4px;font-size:11px;color:#ccc;white-space:pre-wrap;"></div></div>';
              case 'ehr-disclosures': return '<div class="pa-header"><span class="pa-title">EHR Disclosure Accounting (HITECH)</span><span><button id="ehr-refresh-btn" class="pa-action">Refresh</button></span></div><div class="pa-body"><div id="ehr-period" class="pa-status"></div><div id="ehr-list"></div><div id="ehr-empty" class="pa-empty" style="display:none;">No EHR TPO disclosures found.</div></div>';
              case 'breach-log': return '<div class="pa-header"><span class="pa-title">Breach Log</span><span><button id="breach-refresh-btn" class="pa-action">Refresh</button></span></div><div class="pa-body"><div id="breach-log-list"></div><div id="breach-empty" class="pa-empty" style="display:none;">No breaches logged.</div><div style="margin-top:10px;border-top:1px solid #333;padding-top:10px;"><span style="color:#aaa;font-size:11px;font-weight:bold;">Log New Breach</span><label>Description:<textarea id="breach-description" rows="2"></textarea></label><label>Nature of PHI:<input type="text" id="breach-nature-phi" /></label><label>Affected count:<input type="number" id="breach-affected-count" min="0" value="0" /></label><label>Mitigation:<textarea id="breach-mitigation" rows="2"></textarea></label><button id="breach-log-submit-btn" class="pa-action" style="margin-top:8px;">Log Breach</button><div id="breach-log-status" class="pa-status"></div></div><div style="margin-top:10px;border-top:1px solid #333;padding-top:10px;"><span style="color:#aaa;font-size:11px;font-weight:bold;">Annual Report</span><label>Year:<input type="number" id="breach-report-year" style="width:80px;" /></label><button id="breach-report-btn" class="pa-action">Generate Report</button><div id="breach-report-result"></div></div></div>';
              case 'representatives': return '<div class="pa-header"><span class="pa-title">Personal Representatives</span><span><button id="rep-refresh-btn" class="pa-action">Refresh</button></span></div><div class="pa-body"><div id="rep-list"></div><div id="rep-empty" class="pa-empty">No representatives registered.</div><div style="margin-top:10px;border-top:1px solid #333;padding-top:10px;"><span style="color:#aaa;font-size:11px;font-weight:bold;">Register Representative</span><label>Rep Email:<input type="email" id="rep-email" /></label><label>Individual Email:<input type="email" id="rep-individual-email" /></label><label>Relationship:<select id="rep-relationship"><option value="">Select...</option><option value="Parent">Parent</option><option value="LegalGuardian">Legal Guardian</option><option value="HealthcarePOA">Healthcare POA</option><option value="CourtAppointed">Court Appointed</option><option value="Executor">Executor</option></select></label><label>Expiration:<input type="date" id="rep-expiration" /></label><label>Document Ref:<input type="text" id="rep-document-ref" /></label><label>Notes:<input type="text" id="rep-notes" /></label><button id="rep-register-btn" class="pa-action" style="margin-top:8px;">Register</button><div id="rep-register-status" class="pa-status"></div></div></div>';
              case 'legal-holds': return '<div class="pa-header"><span class="pa-title">Legal Holds</span><span><button id="lh-refresh-btn" class="pa-action">Refresh</button></span></div><div class="pa-body"><div style="margin-bottom:8px;"><label style="color:#aaa;font-size:11px;">Filter:<select id="lh-status-filter" style="font-size:11px;background:#1a1a2e;color:#ccc;border:1px solid #555;border-radius:3px;padding:2px 4px;"><option value="">All</option><option value="Active" selected>Active</option><option value="Released">Released</option><option value="Expired">Expired</option></select></label></div><div id="lh-list"></div><div id="lh-empty" class="pa-empty" style="display:none;">No legal holds found.</div><div style="margin-top:10px;border-top:1px solid #333;padding-top:10px;"><span style="color:#aaa;font-size:11px;font-weight:bold;">Place New Hold</span><label>Sheet:<select id="lh-sheet-name"><option value="">Select...</option><option value="SessionAuditLog">SessionAuditLog</option><option value="DataAuditLog">DataAuditLog</option><option value="DisclosureLog">DisclosureLog</option><option value="AccessRequests">AccessRequests</option><option value="AmendmentRequests">AmendmentRequests</option><option value="AmendmentNotifications">AmendmentNotifications</option><option value="BreachLog">BreachLog</option><option value="PersonalRepresentatives">PersonalRepresentatives</option><option value="LegalHolds">LegalHolds</option><option value="RetentionIntegrityLog">RetentionIntegrityLog</option></select></label><label>Hold Type:<select id="lh-hold-type"><option value="">Select...</option><option value="Litigation">Litigation</option><option value="Regulatory">Regulatory</option><option value="InternalInvestigation">Internal Investigation</option><option value="Audit">Audit</option><option value="Preservation">Preservation</option></select></label><label>Reason:<textarea id="lh-reason" rows="2"></textarea></label><label>Case Ref:<input type="text" id="lh-case-ref" /></label><label>Custodian:<input type="email" id="lh-custodian" /></label><label>Start Date:<input type="date" id="lh-start-date" /></label><label>End Date:<input type="date" id="lh-end-date" /></label><label>Expiration:<input type="date" id="lh-expiration" /></label><button id="lh-place-btn" class="pa-action" style="margin-top:8px;">Place Hold</button><div id="lh-place-status" class="pa-status"></div></div></div>';
              case 'compliance-audit': return '<div class="pa-header"><span class="pa-title">Retention Compliance Audit</span><span><button id="ca-run-btn" class="pa-action">Run Audit</button></span></div><div class="pa-body"><div id="ca-result"></div><div id="ca-empty" class="pa-empty">Click "Run Audit" to check retention compliance.</div><div style="margin-top:10px;border-top:1px solid #333;padding-top:10px;"><div class="pa-format-picker"><label><input type="radio" name="ca-export-format" value="json" checked /> JSON</label><label><input type="radio" name="ca-export-format" value="text" /> Text</label></div><button id="ca-export-btn" class="pa-action">Export</button><div id="ca-export-result"></div></div></div>';
              case 'archive-integrity': return '<div class="pa-header"><span class="pa-title">Archive Integrity Verification</span><span><button id="ai-verify-btn" class="pa-action">Verify All</button></span></div><div class="pa-body"><div id="ai-result"></div><div id="ai-empty" class="pa-empty">Click "Verify All" to check archive checksums.</div></div>';
              case 'retention-policy': return '<div class="pa-header"><span class="pa-title">Retention Policy</span><span><button id="rp-generate-btn" class="pa-action">Generate</button></span></div><div class="pa-body"><div id="rp-result"></div><div id="rp-empty" class="pa-empty">Click "Generate" to create a retention policy document.</div><div style="margin-top:10px;border-top:1px solid #333;padding-top:10px;"><div class="pa-format-picker"><label><input type="radio" name="rp-export-format" value="text" checked /> Text</label><label><input type="radio" name="rp-export-format" value="json" /> JSON</label></div><button id="rp-export-btn" class="pa-action">Export</button><div id="rp-export-result"></div></div></div>';
              default: return '<div class="pa-empty">Unknown panel.</div>';
            }
          }

          // Attach listeners per panel
          function _attachAdminListeners(id) {
            switch(id) {
              case 'sessions':
                var sRef = document.getElementById('admin-sessions-refresh');
                if (sRef) sRef.addEventListener('click', function() { _loadSessions(); });
                break;
              case 'disclosures':
                var gT = document.getElementById('disclosure-grouped-toggle');
                if (gT) gT.addEventListener('change', function() { _loadDisclosures(); });
                var eB = document.getElementById('disclosure-export-btn');
                if (eB) eB.addEventListener('click', function() {
                  _gasCall('exportDisclosureAccounting', [_adminToken, document.getElementById('disclosure-export-format').value], function(r) { _downloadResult(r, 'hipaa-disclosures.' + (r.format||'json')); });
                });
                break;
              case 'data-export':
                var radios = document.querySelectorAll('input[name="export-format"]');
                for (var ri = 0; ri < radios.length; ri++) radios[ri].addEventListener('change', function() { var sa = document.getElementById('summary-agreement'); if(sa) sa.style.display = this.value === 'summary' ? '' : 'none'; });
                var dl = document.getElementById('data-export-download-btn');
                if (dl) dl.addEventListener('click', function() {
                  var fmt = document.querySelector('input[name="export-format"]:checked').value;
                  if (fmt === 'summary') {
                    var cb = document.getElementById('summary-agree-checkbox'); if (!cb || !cb.checked) { _setStatus('data-export-status', 'Please agree first.', '#ef5350'); return; }
                    _gasCall('generateDataSummary', [_adminToken], function(r) { _downloadResult(r, 'hipaa-summary.json'); _setStatus('data-export-status', 'Ready.', '#66bb6a'); });
                  } else { _gasCall('requestDataExport', [_adminToken, fmt], function(r) { _downloadResult(r, 'hipaa-export.' + fmt); _setStatus('data-export-status', 'Ready.', '#66bb6a'); }); }
                });
                break;
              case 'amendment':
                var aS = document.getElementById('amend-submit-btn');
                if (aS) aS.addEventListener('click', function() {
                  var rId = document.getElementById('amend-record-id').value.trim(), cur = document.getElementById('amend-current').value.trim(), prop = document.getElementById('amend-proposed').value.trim(), rsn = document.getElementById('amend-reason').value.trim();
                  if (!rId || !prop) { _setStatus('amend-status', 'Record ID and proposed correction required.'); return; }
                  _setStatus('amend-status', 'Submitting...');
                  _gasCall('requestAmendment', [_adminToken, rId, cur, prop, rsn], function(r) { if (r&&r.success) _setStatus('amend-status', 'Submitted. ID: '+(r.id||'N/A'), '#66bb6a'); else _setStatus('amend-status', 'Error: '+(r?r.message:''), '#ef5350'); });
                });
                break;
              case 'amendment-review':
                var arR = document.getElementById('amend-review-refresh');
                if (arR) arR.addEventListener('click', function() { _loadPendingAmendments(); });
                break;
              case 'disagreement':
                var dS = document.getElementById('disagree-submit-btn');
                if (dS) dS.addEventListener('click', function() {
                  var aId = document.getElementById('disagree-amendment-id').value.trim(), stmt = document.getElementById('disagree-statement').value.trim();
                  if (!aId || !stmt) { _setStatus('disagree-status', 'Both fields required.'); return; }
                  _setStatus('disagree-status', 'Submitting...');
                  _gasCall('submitDisagreement', [_adminToken, aId, stmt], function(r) { if (r&&r.success) _setStatus('disagree-status', 'Filed.', '#66bb6a'); else _setStatus('disagree-status', 'Error: '+(r?r.message:''), '#ef5350'); });
                });
                break;
              case 'extension':
                var eS = document.getElementById('extension-submit-btn');
                if (eS) eS.addEventListener('click', function() {
                  var et = document.getElementById('extension-type').value, rId = document.getElementById('extension-request-id').value.trim(), rsn = document.getElementById('extension-reason').value.trim();
                  if (!rId || !rsn) { _setStatus('extension-status', 'Request ID and reason required.'); return; }
                  _setStatus('extension-status', 'Submitting...');
                  var fn = et === 'amendment' ? 'requestAmendmentExtension' : 'requestAccessExtension';
                  _gasCall(fn, [_adminToken, rId, rsn], function(r) { if (r&&r.success) _setStatus('extension-status', 'Granted. Deadline: '+(r.newDeadline||'N/A'), '#66bb6a'); else _setStatus('extension-status', 'Error: '+(r?r.message:''), '#ef5350'); });
                });
                break;
              case 'denial-notice':
                var dG = document.getElementById('denial-generate-btn');
                if (dG) dG.addEventListener('click', function() {
                  var rId = document.getElementById('denial-request-id').value.trim();
                  if (!rId) { _setStatus('denial-status', 'Request ID required.'); return; }
                  _setStatus('denial-status', 'Generating...');
                  var params = {basis:document.getElementById('denial-basis').value.trim(), reviewable:document.getElementById('denial-reviewable').checked, contact:document.getElementById('denial-contact').value.trim(), office:document.getElementById('denial-office').value.trim()};
                  _gasCall('generateDenialNotice', [_adminToken, document.getElementById('denial-request-type').value, rId, params], function(r) {
                    if (r&&r.success) { _setStatus('denial-status', 'Generated.', '#66bb6a'); var out=document.getElementById('denial-notice-output'); if(out){out.style.display='';out.textContent=r.notice||'';} }
                    else _setStatus('denial-status', 'Error: '+(r?r.message:''), '#ef5350');
                  });
                });
                break;
              case 'ehr-disclosures':
                var eR = document.getElementById('ehr-refresh-btn');
                if (eR) eR.addEventListener('click', function() { _loadEhrDisclosures(); });
                break;
              case 'breach-log':
                var bR = document.getElementById('breach-refresh-btn');
                if (bR) bR.addEventListener('click', function() { _loadBreachLog(); });
                var bS = document.getElementById('breach-log-submit-btn');
                if (bS) bS.addEventListener('click', function() {
                  var desc = document.getElementById('breach-description').value.trim();
                  if (!desc) { _setStatus('breach-log-status', 'Description required.'); return; }
                  _setStatus('breach-log-status', 'Logging...');
                  _gasCall('logBreach', [_adminToken, {description:desc, phiNature:document.getElementById('breach-nature-phi').value.trim(), count:document.getElementById('breach-affected-count').value, mitigation:document.getElementById('breach-mitigation').value.trim()}], function(r) {
                    if (r&&r.success) { _setStatus('breach-log-status', 'Logged. ID: '+(r.id||'N/A'), '#66bb6a'); _loadBreachLog(); } else _setStatus('breach-log-status', 'Error: '+(r?r.message:''), '#ef5350');
                  });
                });
                var bRpt = document.getElementById('breach-report-btn');
                if (bRpt) bRpt.addEventListener('click', function() {
                  document.getElementById('breach-report-result').innerHTML = '<div class="pa-status">Generating...</div>';
                  _gasCall('getBreachReport', [_adminToken, document.getElementById('breach-report-year').value||''], function(r) {
                    var el = document.getElementById('breach-report-result');
                    if (!r||!r.success) el.innerHTML = '<div style="color:#ef5350">Error: '+_escA(r?r.message:'')+'</div>';
                    else el.innerHTML = '<div class="pa-card" style="white-space:pre-wrap;font-size:10px;">'+_escA(r.report||'No breaches.')+'</div>';
                  });
                });
                break;
              case 'representatives':
                var rpR = document.getElementById('rep-refresh-btn');
                if (rpR) rpR.addEventListener('click', function() { _loadRepresentatives(); });
                var rpReg = document.getElementById('rep-register-btn');
                if (rpReg) rpReg.addEventListener('click', function() {
                  var re = document.getElementById('rep-email').value.trim(), ie = document.getElementById('rep-individual-email').value.trim();
                  if (!re || !ie) { _setStatus('rep-register-status', 'Both emails required.'); return; }
                  _setStatus('rep-register-status', 'Registering...');
                  _gasCall('registerPersonalRepresentative', [_adminToken, {repEmail:re, individualEmail:ie, relationship:document.getElementById('rep-relationship').value, expiration:document.getElementById('rep-expiration').value, documentRef:document.getElementById('rep-document-ref').value.trim(), notes:document.getElementById('rep-notes').value.trim()}], function(r) {
                    if (r&&r.success) { _setStatus('rep-register-status', 'Registered.', '#66bb6a'); _loadRepresentatives(); } else _setStatus('rep-register-status', 'Error: '+(r?r.message:''), '#ef5350');
                  });
                });
                break;
              case 'legal-holds':
                var lR = document.getElementById('lh-refresh-btn');
                if (lR) lR.addEventListener('click', function() { _loadLegalHolds(); });
                var lF = document.getElementById('lh-status-filter');
                if (lF) lF.addEventListener('change', function() { _loadLegalHolds(); });
                var lP = document.getElementById('lh-place-btn');
                if (lP) lP.addEventListener('click', function() {
                  var sh = document.getElementById('lh-sheet-name').value, ht = document.getElementById('lh-hold-type').value;
                  if (!sh || !ht) { _setStatus('lh-place-status', 'Sheet and hold type required.'); return; }
                  _setStatus('lh-place-status', 'Placing hold...');
                  _gasCall('placeLegalHold', [_adminToken, {sheetName:sh, holdType:ht, reason:document.getElementById('lh-reason').value.trim(), caseRef:document.getElementById('lh-case-ref').value.trim(), custodian:document.getElementById('lh-custodian').value.trim(), startDate:document.getElementById('lh-start-date').value, endDate:document.getElementById('lh-end-date').value, expiration:document.getElementById('lh-expiration').value}], function(r) {
                    if (r&&r.success) { _setStatus('lh-place-status', 'Hold placed. ID: '+(r.id||'N/A'), '#66bb6a'); _loadLegalHolds(); } else _setStatus('lh-place-status', 'Error: '+(r?r.message:''), '#ef5350');
                  });
                });
                break;
              case 'compliance-audit':
                var caR = document.getElementById('ca-run-btn');
                if (caR) caR.addEventListener('click', function() { document.getElementById('ca-result').innerHTML='<div class="pa-status">Running audit...</div>'; var ce=document.getElementById('ca-empty'); if(ce)ce.style.display='none'; _gasCall('auditRetentionCompliance', [_adminToken], function(r) { _renderSimpleResult('ca-result', r, 'report'); }); });
                var caE = document.getElementById('ca-export-btn');
                if (caE) caE.addEventListener('click', function() { var fmt=document.querySelector('input[name="ca-export-format"]:checked').value; _gasCall('getComplianceAuditReport', [_adminToken, fmt], function(r) { _downloadResult(r, 'audit-report.'+fmt); var el=document.getElementById('ca-export-result'); if(el)el.innerHTML='<div style="color:#66bb6a">Downloaded.</div>'; }); });
                break;
              case 'archive-integrity':
                var aiV = document.getElementById('ai-verify-btn');
                if (aiV) aiV.addEventListener('click', function() { document.getElementById('ai-result').innerHTML='<div class="pa-status">Verifying...</div>'; var ae=document.getElementById('ai-empty'); if(ae)ae.style.display='none'; _gasCall('verifyArchiveIntegrity', [_adminToken], function(r) { _renderSimpleResult('ai-result', r, 'report'); }); });
                break;
              case 'retention-policy':
                var rpG = document.getElementById('rp-generate-btn');
                if (rpG) rpG.addEventListener('click', function() { document.getElementById('rp-result').innerHTML='<div class="pa-status">Generating...</div>'; var re=document.getElementById('rp-empty'); if(re)re.style.display='none'; _gasCall('getRetentionPolicyDocument', [_adminToken], function(r) { _renderSimpleResult('rp-result', r, 'policy'); }); });
                var rpE = document.getElementById('rp-export-btn');
                if (rpE) rpE.addEventListener('click', function() { var fmt=document.querySelector('input[name="rp-export-format"]:checked').value; _gasCall('exportRetentionPolicy', [_adminToken, fmt], function(r) { _downloadResult(r, 'retention-policy.'+fmt); var el=document.getElementById('rp-export-result'); if(el)el.innerHTML='<div style="color:#66bb6a">Exported.</div>'; }); });
                break;
            }
          }
        })();
        ` : ''}


        // ── Live sync + viewer presence (TEMPLATE) ──
        // Two status pills (top-right): "Live Ns | ▷ Ns" — a visible countdown to the next
        // getDataRev() poll that watches for other users' writes — and "👥 N" — who is
        // viewing right now (green = active, amber = away by window focus; hover for the list).
        // Projects wire in two ways:
        //   1. Server: call bumpDataRev() after EVERY shared-data write (see DATA OPERATIONS).
        //   2. Client: override window._onLiveDataChange = function () { /* re-fetch + re-render */ }
        //      — called when another user's write changes the revision. Optionally override
        //      window._liveIsBusy = function () { /* return true while the user is mid-edit */ }
        //      to defer refreshes (a skipped round retries on the next poll).
        // Every path is wrapped in try/catch so a live/presence error can NEVER halt the
        // shared auth/app init that runs in this same inline script.
        (function () {
          function _lpCall(fn, args, onOk, onErr) {
            try {
              var r = google.script.run.withSuccessHandler(onOk || function () {}).withFailureHandler(onErr || function () {});
              r[fn].apply(r, args);
            } catch (e) { if (onErr) onErr(e); }
          }

          // — Viewer presence: report own state every 30s, render the roster —
          function _presEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
          function _presState() {
            try {
              var visible = (typeof document.visibilityState === 'undefined') ? true : (document.visibilityState === 'visible');
              var focused = (typeof document.hasFocus === 'function') ? document.hasFocus() : true;
              return (visible && focused) ? 'active' : 'away';
            } catch (e) { return 'active'; }
          }
          function _presRender(viewers) {
            try {
              var cnt = document.getElementById('dt-pres-count');
              var pop = document.getElementById('dt-pres-pop');
              var n = viewers ? viewers.length : 0;
              if (cnt) cnt.textContent = n ? String(n) : '–';
              if (!pop) return;
              if (!n) { pop.innerHTML = '<div class="dt-pres-empty">No one else viewing</div>'; return; }
              var html = '';
              for (var i = 0; i < viewers.length; i++) {
                var v = viewers[i] || {};
                var cls = (v.state === 'away') ? 'away' : 'active';
                var you = v.self ? ' <span class="dt-pres-you">(you)</span>' : '';
                var lbl = (v.state === 'away') ? ' — away' : '';
                html += '<div class="dt-pres-row"><span class="dt-pres-dot ' + cls + '"></span><span>' + _presEsc(v.name || v.email || '') + '</span>' + you + '<span class="dt-pres-you">' + lbl + '</span></div>';
              }
              pop.innerHTML = html;
            } catch (e) {}
          }
          function _presReport() {
            try {
              if (!_sessionToken) return;
              _lpCall('updatePresence', [_sessionToken, _presState()], function (res) { _presRender(res && res.viewers); }, function () {});
            } catch (e) {}
          }

          // — Live poll: visible countdown + cheap revision check, in lockstep —
          // The "next check" number is a simple counter decremented once per second and reset
          // with each poll cycle (countdown + poll chained via setTimeout — wall-clock math
          // against free-running setIntervals drifts under browser timer throttling). While a
          // check is actually in flight the display shows amber "polling...".
          var _lastRev = null, _liveTimer = null, _liveTickTimer = null, POLL_MS = 15000;
          var _liveLastOk = 0, _liveOk = false, _liveCountdown = 0, _liveChecking = false;
          function _updLive() {
            try {
              var el = document.getElementById('dt-live'); if (!el) return;
              el.classList.toggle('off', !_liveOk);
              var lbl = document.getElementById('dt-live-lbl'); if (lbl) lbl.textContent = _liveOk ? 'Live' : 'Reconnecting…';
              var since = _liveLastOk ? Math.max(0, Math.floor((Date.now() - _liveLastOk) / 1000)) : 0;
              var a = document.getElementById('dt-live-since'); if (a) a.textContent = since + 's';
              var b = document.getElementById('dt-live-next');
              if (b) {
                if (_liveChecking) { b.textContent = 'polling...'; b.style.color = '#d29922'; }
                else { b.textContent = '▷ ' + _liveCountdown + 's'; b.style.color = ''; }
              }
            } catch (e) {}
          }
          // Start the next poll cycle: reset the countdown, restart the 1s ticker, and schedule
          // the poll itself so ticker and poll can never drift apart. Called after EVERY poll
          // completion (success, failure, or busy-skip) — the chain must never die.
          function _scheduleLivePoll() {
            _liveChecking = false;
            _liveCountdown = POLL_MS / 1000;
            clearInterval(_liveTickTimer);
            _liveTickTimer = setInterval(function () { if (_liveCountdown > 0) _liveCountdown--; _updLive(); }, 1000);
            clearTimeout(_liveTimer);
            _liveTimer = setTimeout(_livePoll, POLL_MS);
            _updLive();
          }
          function _isBusy() {
            try { return (typeof window._liveIsBusy === 'function') ? !!window._liveIsBusy() : false; } catch (e) { return false; }
          }
          function _livePoll() {
            try {
              _liveChecking = true; _updLive();
              if (!_sessionToken || _isBusy()) { _scheduleLivePoll(); return; }   // skip this round but keep the chain alive
              _lpCall('getDataRev', [_sessionToken], function (res) {
                _liveLastOk = Date.now(); _liveOk = true; _scheduleLivePoll();
                var rev = (res && res.rev) || '';
                if (!rev) return;                                   // no writes recorded yet — nothing to compare
                if (_lastRev === null) { _lastRev = rev; return; }  // establish baseline
                if (rev === _lastRev || _isBusy()) return;          // unchanged, or user mid-edit (retries next poll)
                _lastRev = rev;
                try { if (typeof window._onLiveDataChange === 'function') window._onLiveDataChange(); } catch (e2) {}
              }, function () { _liveOk = false; _scheduleLivePoll(); });
            } catch (e) { try { _scheduleLivePoll(); } catch (e3) {} }
          }

          // Start both engines. Departures are handled server-side by staleness pruning
          // (no reliable unload signal), so there is nothing to tear down here.
          try {
            var onChange = function () { _presReport(); };
            document.addEventListener('visibilitychange', onChange);
            window.addEventListener('focus', onChange);
            window.addEventListener('blur', onChange);
            setInterval(_presReport, 30000);   // heartbeat every 30s; server prunes viewers unseen for 75s
            _presReport();                     // report immediately so the pill fills in on load
            _livePoll();                       // first poll now; each completion schedules the next cycle
          } catch (e) {}
        })();

        // PROJECT START — Add your project-specific UI logic here
        // PROJECT END
      </script>
    </body>
    </html>
  `;
  return HtmlService.createHtmlOutput(html)
    .setTitle(TITLE)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function serverSignOut(sessionToken) {
  invalidateSession(sessionToken);
  return { success: true };
}


// ═══════════════════════════════════════════════════════
// HIPAA COMPLIANCE — Configuration
// ═══════════════════════════════════════════════════════

/**
 * Breach alerting configuration.
 * Thresholds define how many security events of each type within WINDOW_MINUTES
 * trigger an email alert to the security officer.
 */
var BREACH_ALERT_CONFIG = {
  ENABLED: true,
  SECURITY_OFFICER_EMAIL: '',  // MUST be set before enabling — email address of designated security officer
  ALERT_COOLDOWN_MINUTES: 60,  // Minimum time between alerts of the same type
  WINDOW_MINUTES: 15,          // Rolling window for threshold evaluation
  THRESHOLDS: {
    'tier3_lockout': 1,        // Any Tier 3 lockout = immediate alert
    'hmac_integrity_violation': 3,  // 3 HMAC failures in window
    'session_hijack_attempt': 1,    // Any hijack attempt = immediate alert
    'brute_force': 5,          // 5 failed auth attempts in window
    'data_access_anomaly': 10, // 10 unusual data access patterns in window
    'permission_escalation': 1 // Any permission escalation attempt = immediate alert
  },
  // Event types that are ALWAYS logged to BreachLog (regardless of threshold)
  ALWAYS_LOG_EVENTS: ['tier3_lockout', 'session_hijack_attempt', 'permission_escalation']
};

/**
 * Retention enforcement configuration.
 * Controls how the retention trigger archives and protects audit data.
 */
var HIPAA_RETENTION_CONFIG = {
  RETENTION_YEARS: 6,          // Reads from AUTH_CONFIG.AUDIT_LOG_RETENTION_YEARS when available
  ARCHIVE_SHEET_SUFFIX: '_Archive',  // e.g. SessionAuditLog_Archive
  PROTECTION_LEVEL: 'warning', // 'warning' (shows dialog) or 'full' (blocks all edits)
  SHEETS_TO_PROTECT: [
    'SessionAuditLog', 'DataAuditLog', 'DisclosureLog',
    'AccessRequests', 'AmendmentRequests', 'AmendmentNotifications',
    'BreachLog', 'PersonalRepresentatives',
    'LegalHolds', 'RetentionIntegrityLog'
  ],
  // How many rows to process per trigger execution (to stay within 6-min GAS limit)
  BATCH_SIZE: 500
};

// ═══════════════════════════════════════════════════════
// PHASE C — RETENTION CONFIGURATION EXTENSIONS
// ═══════════════════════════════════════════════════════

/**
 * Legal hold configuration — controls litigation preservation behavior.
 * §164.316(b)(2)(i) + FRCP Rule 37(e)
 */
var LEGAL_HOLD_CONFIG = {
  ENABLED: true,
  MAX_HOLDS_PER_SHEET: 10,
  ALLOW_ARCHIVE_HOLDS: true,
  HOLD_TYPES: ['Litigation', 'Regulatory', 'InternalInvestigation', 'Audit', 'Preservation'],
  HOLD_NOTIFICATION_EMAIL: ''
};

/**
 * Archive integrity verification configuration — controls checksum behavior.
 * §164.312(c)(1) — Integrity controls
 */
var INTEGRITY_CONFIG = {
  ALGORITHM: 'SHA_256',
  CHECKSUM_BATCH_SIZE: 1000,
  STORAGE_MODE: 'tracking_sheet',
  TRACKING_SHEET_NAME: 'RetentionIntegrityLog'
};

/**
 * Personal representative configuration.
 */
var REPRESENTATIVE_CONFIG = {
  MAX_REPRESENTATIVES_PER_INDIVIDUAL: 5,  // Prevent abuse
  REQUIRE_ADMIN_APPROVAL: true,           // Admin must approve representative registrations
  ALLOW_SELF_REGISTRATION: false,         // Representatives cannot register themselves
  SUPPORTED_RELATIONSHIP_TYPES: [
    'Parent',
    'LegalGuardian',
    'HealthcarePOA',
    'CourtAppointed',
    'Executor'   // Estate executor for deceased individuals
  ]
};

/**
 * Configurable HIPAA compliance deadlines (in days/years).
 * Update these when regulations change — e.g. Privacy Rule NPRM
 * proposes reducing ACCESS_RESPONSE_DAYS from 30 to 15.
 * See: §164.524(b)(1), §164.526(b)(1), §164.528(c)(1)
 */
var HIPAA_DEADLINES = {
  ACCESS_RESPONSE_DAYS: 30,      // §164.524(b)(1) — proposed NPRM: 15
  ACCESS_EXTENSION_DAYS: 30,     // §164.524(b)(2)(iii)
  AMENDMENT_RESPONSE_DAYS: 60,   // §164.526(b)(1)
  AMENDMENT_EXTENSION_DAYS: 30,  // §164.526(b)(2)(ii)
  ACCOUNTING_RESPONSE_DAYS: 60,  // §164.528(c)(1)
  ACCOUNTING_PERIOD_YEARS: 6,    // §164.528(a)(1) — HITECH EHR: 3
  BREACH_NOTIFICATION_DAYS: 60   // §164.404(b) — individual notification
};


// ═══════════════════════════════════════════════════════
// HIPAA COMPLIANCE — Shared Utilities
// ═══════════════════════════════════════════════════════

/**
 * Generates a unique request ID for tracking compliance requests.
 * Format: PREFIX-YYYYMMDD-UUID8 (e.g. REQ-20260323-a1b2c3d4)
 */
function generateRequestId(prefix) {
  prefix = prefix || 'REQ';
  var date = Utilities.formatDate(new Date(), 'America/New_York', 'yyyyMMdd');
  var uuid = Utilities.getUuid().replace(/-/g, '').substring(0, 8);
  return prefix + '-' + date + '-' + uuid;
}

/**
 * Returns an EST-formatted ISO timestamp for audit entries.
 * Consistent with existing auditLog() timestamp format.
 */
function formatHipaaTimestamp() {
  return Utilities.formatDate(new Date(), 'America/New_York', "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
}

/**
 * Validates that the authenticated user can access the specified individual's data.
 * Self-service: user can only access their OWN data.
 * Admin: can access any individual's data.
 *
 * @param {Object} user - Session user object (from validateSessionForData)
 * @param {string} targetEmail - The individual whose data is being accessed
 * @param {string} operationName - Name of the calling operation (for audit)
 * @returns {boolean} true if access is permitted
 * @throws {Error} 'ACCESS_DENIED' if user cannot access this individual's data
 */
/**
 * EXTENDED validateIndividualAccess() — now checks personal representatives.
 * Replaces the Phase A version. The function signature is unchanged, ensuring
 * all existing Phase A callers continue to work without modification.
 *
 * Authorization chain:
 * 1. Admin → access granted (existing behavior)
 * 2. Self-service (user.email === targetEmail) → access granted (existing behavior)
 * 3. Personal representative (user registered + approved + active + not expired) → access granted (NEW)
 * 4. None of the above → ACCESS_DENIED (existing behavior)
 */
function validateIndividualAccess(user, targetEmail, operationName) {
  // Admins can access any individual's data (unchanged from Phase A)
  if (hasPermission(user.role, 'admin')) {
    auditLog('individual_access', user.email, 'admin_access', {
      operation: operationName,
      targetEmail: targetEmail,
      accessType: 'admin_override'
    });
    return true;
  }

  // Self-service: user can access their own data (unchanged from Phase A)
  if (user.email.toLowerCase() === targetEmail.toLowerCase()) {
    return true;
  }

  // NEW: Check personal representative authorization
  var repAuth = isRepresentativeAuthorized(user.email, targetEmail);
  if (repAuth) {
    auditLog('individual_access', user.email, 'representative_access', {
      operation: operationName,
      targetEmail: targetEmail,
      accessType: 'personal_representative',
      representativeId: repAuth.representativeId,
      relationshipType: repAuth.relationshipType
    });
    return true;
  }

  // Not authorized
  auditLog('security_alert', user.email, 'individual_access_denied', {
    operation: operationName,
    targetEmail: targetEmail,
    reason: 'not_self_not_admin_not_representative'
  });
  throw new Error('ACCESS_DENIED');
}

/**
 * Gets or creates a sheet in the Project Data Spreadsheet.
 * Follows the existing _writeAuditLogEntry() auto-creation pattern.
 *
 * @param {string} sheetName - Name of the sheet to get/create
 * @param {string[]} headers - Column headers for new sheet creation
 * @returns {Sheet} The Google Sheet object
 */
function getOrCreateSheet(sheetName, headers) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
    var protection = sheet.protect().setDescription('HIPAA Protected — ' + sheetName);
    protection.setWarningOnly(true);
    auditLog('sheet_created', 'system', 'success', {
      sheetName: sheetName,
      columnCount: headers.length,
      protection: 'warning_only'
    });
  }
  return sheet;
}

/**
 * Wraps a Phase A operation with standard error handling.
 * Catches known error types and returns structured responses.
 * HIPAA: never leaks PHI in error messages.
 */
function wrapPhaseAOperation(operationName, sessionToken, operationFn) {
  try {
    var user = validateSessionForData(sessionToken, operationName);
    return operationFn(user);
  } catch (e) {
    var errorType = e.message || 'UNKNOWN_ERROR';
    var safeErrors = {
      'SESSION_EXPIRED': { success: false, error: 'SESSION_EXPIRED', message: 'Your session has expired. Please sign in again.' },
      'SESSION_INVALID': { success: false, error: 'SESSION_INVALID', message: 'Invalid session. Please sign in again.' },
      'SESSION_EVICTED': { success: false, error: 'SESSION_EVICTED', message: 'Your session was ended. Please sign in again.' },
      'SESSION_CORRUPT': { success: false, error: 'SESSION_CORRUPT', message: 'Session data is corrupted. Please sign in again.' },
      'SESSION_INTEGRITY_VIOLATION': { success: false, error: 'SESSION_INTEGRITY_VIOLATION', message: 'Session integrity check failed. Please sign in again.' },
      'PERMISSION_DENIED': { success: false, error: 'PERMISSION_DENIED', message: 'You do not have permission for this operation.' },
      'ACCESS_DENIED': { success: false, error: 'ACCESS_DENIED', message: 'You can only access your own data.' },
      'NOT_FOUND': { success: false, error: 'NOT_FOUND', message: 'The requested record was not found.' },
      'INVALID_INPUT': { success: false, error: 'INVALID_INPUT', message: 'Invalid input provided.' }
    };
    if (safeErrors[errorType]) {
      return safeErrors[errorType];
    }
    auditLog('phase_a_error', 'system', 'error', {
      operation: operationName,
      errorType: errorType,
      errorMessage: e.message,
      stack: e.stack
    });
    return { success: false, error: 'INTERNAL_ERROR', message: 'An internal error occurred. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
// HIPAA COMPLIANCE — Phase A: Individual Rights
// ═══════════════════════════════════════════════════════

// PHASE A — ITEM #19: DISCLOSURE ACCOUNTING (§164.528)
// ═══════════════════════════════════════════════════════

/**
 * Records a PHI disclosure to the DisclosureLog sheet.
 * Called whenever PHI is shared with an external party.
 */
function recordDisclosure(params) {
  var required = ['recipientName', 'recipientType', 'phiDescription', 'purpose', 'individualEmail'];
  for (var i = 0; i < required.length; i++) {
    if (!params[required[i]]) {
      throw new Error('INVALID_INPUT');
    }
  }
  var disclosureId = generateRequestId('DISC');
  var timestamp = formatHipaaTimestamp();
  var isExempt = params.isExempt || false;
  var exemptionType = params.exemptionType || '';
  var triggeredBy = 'system';
  if (params.sessionToken) {
    try {
      var user = validateSessionForData(params.sessionToken, 'recordDisclosure');
      triggeredBy = user.email;
    } catch (e) {
      triggeredBy = 'system_automated';
    }
  }
  var dataCategory = params.dataCategory || 'General';
  var source = params.source || 'CoveredEntity';
  var headers = [
    'Timestamp', 'DisclosureID', 'IndividualEmail', 'RecipientName',
    'RecipientType', 'PHIDescription', 'Purpose', 'IsExempt',
    'ExemptionType', 'DataCategory', 'Source', 'TriggeredBy'
  ];
  var sheet = getOrCreateSheet('DisclosureLog', headers);
  sheet.appendRow([
    timestamp, disclosureId, params.individualEmail, params.recipientName,
    params.recipientType, params.phiDescription, params.purpose, isExempt,
    exemptionType, dataCategory, source, triggeredBy
  ]);
  auditLog('disclosure_recorded', triggeredBy, 'success', {
    disclosureId: disclosureId,
    recipientName: params.recipientName,
    purpose: params.purpose,
    isExempt: isExempt,
    individualEmail: params.individualEmail
  });
  return { success: true, disclosureId: disclosureId };
}

/**
 * Returns the disclosure accounting for the authenticated individual.
 * Filters to non-exempt disclosures within the configured lookback period.
 * Supports HITECH EHR dual-mode: when options.includeEhrTpo is true,
 * includes TPO disclosures with a 3-year lookback per HITECH §13405(c).
 *
 * @param {string} sessionToken — Session token
 * @param {string} [targetEmail] — Email to look up (defaults to authenticated user)
 * @param {Object} [options] — Optional settings
 * @param {boolean} [options.includeEhrTpo] — Include TPO disclosures with 3-year lookback (HITECH EHR mode)
 */
function getDisclosureAccounting(sessionToken, targetEmail, options) {
  return wrapPhaseAOperation('getDisclosureAccounting', sessionToken, function(user) {
    checkPermission(user, 'read', 'getDisclosureAccounting');
    var lookupEmail = targetEmail || user.email;
    validateIndividualAccess(user, lookupEmail, 'getDisclosureAccounting');
    var requestId = generateRequestId('ACCT');
    var now = new Date();
    options = options || {};
    var includeEhrTpo = options.includeEhrTpo || false;
    var lookbackYears = HIPAA_DEADLINES.ACCOUNTING_PERIOD_YEARS;
    var sixYearsAgo = new Date(now.getTime() - (lookbackYears * 365.25 * 24 * 60 * 60 * 1000));
    // HITECH §13405(c): EHR TPO disclosures use 3-year lookback
    var ehrTpoLookback = includeEhrTpo
      ? new Date(now.getTime() - (3 * 365.25 * 24 * 60 * 60 * 1000))
      : null;
    var headers = [
      'Timestamp', 'DisclosureID', 'IndividualEmail', 'RecipientName',
      'RecipientType', 'PHIDescription', 'Purpose', 'IsExempt',
      'ExemptionType', 'DataCategory', 'Source', 'TriggeredBy'
    ];
    var sheet = getOrCreateSheet('DisclosureLog', headers);
    var data = sheet.getDataRange().getValues();
    var disclosures = [];
    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var rowEmail = String(row[2]).toLowerCase();
      var rowIsExempt = row[7] === true || row[7] === 'TRUE' || row[7] === 'true';
      var rowDate = new Date(row[0]);
      var rowPurpose = String(row[6] || '').toLowerCase();
      var isTpoPurpose = (rowPurpose === 'treatment' || rowPurpose === 'payment' || rowPurpose === 'healthcare operations');
      if (rowEmail !== lookupEmail.toLowerCase()) continue;
      // Standard §164.528 accounting: non-exempt, non-TPO, 6-year lookback
      var includeStandard = !rowIsExempt && !isTpoPurpose && rowDate >= sixYearsAgo;
      // HITECH EHR mode: TPO disclosures with 3-year lookback
      var includeEhr = includeEhrTpo && !rowIsExempt && isTpoPurpose && ehrTpoLookback && rowDate >= ehrTpoLookback;
      if (includeStandard || includeEhr) {
        disclosures.push({
          disclosureId: row[1],
          date: row[0] instanceof Date ? row[0].toISOString() : String(row[0]),
          recipientName: row[3],
          recipientType: row[4],
          phiDescription: row[5],
          purpose: row[6],
          dataCategory: row[9] || 'General',
          source: row[10] || 'CoveredEntity',
          isEhrTpo: includeEhr && !includeStandard
        });
      }
    }
    disclosures.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
    dataAuditLog(user, 'read', 'disclosure_accounting', requestId, {
      targetEmail: lookupEmail,
      disclosureCount: disclosures.length,
      periodStart: sixYearsAgo.toISOString(),
      periodEnd: now.toISOString(),
      includeEhrTpo: includeEhrTpo
    });
    return {
      success: true, requestId: requestId, individualEmail: lookupEmail,
      disclosures: disclosures, count: disclosures.length,
      periodStart: sixYearsAgo.toISOString(), periodEnd: now.toISOString(),
      includeEhrTpo: includeEhrTpo,
      generatedAt: formatHipaaTimestamp()
    };
  });
}

/**
 * Exports the disclosure accounting in JSON or CSV format.
 */
function exportDisclosureAccounting(sessionToken, format) {
  return wrapPhaseAOperation('exportDisclosureAccounting', sessionToken, function(user) {
    checkPermission(user, 'export', 'exportDisclosureAccounting');
    var accounting = getDisclosureAccounting(sessionToken);
    if (!accounting.success) return accounting;
    format = (format || 'json').toLowerCase();
    var dateStr = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');
    var filename = 'disclosure-accounting-' + dateStr;
    if (format === 'csv') {
      var csvRows = ['Date,DisclosureID,RecipientName,RecipientType,PHIDescription,Purpose,DataCategory,Source'];
      for (var i = 0; i < accounting.disclosures.length; i++) {
        var d = accounting.disclosures[i];
        csvRows.push([
          '"' + d.date + '"',
          '"' + d.disclosureId + '"',
          '"' + (d.recipientName || '').replace(/"/g, '""') + '"',
          '"' + d.recipientType + '"',
          '"' + (d.phiDescription || '').replace(/"/g, '""') + '"',
          '"' + d.purpose + '"',
          '"' + (d.dataCategory || 'General') + '"',
          '"' + (d.source || 'CoveredEntity') + '"'
        ].join(','));
      }
      return { success: true, format: 'csv', data: csvRows.join('\n'), filename: filename + '.csv' };
    }
    return { success: true, format: 'json', data: JSON.stringify(accounting, null, 2), filename: filename + '.json' };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE A — ITEM #23: RIGHT OF ACCESS (§164.524)
// ═══════════════════════════════════════════════════════

/**
 * Creates an access request and immediately generates the export.
 * For testauthgas1 (small dataset), export is synchronous.
 */
function requestDataExport(sessionToken, format) {
  return wrapPhaseAOperation('requestDataExport', sessionToken, function(user) {
    checkPermission(user, 'export', 'requestDataExport');
    var requestId = generateRequestId('ACCESS');
    var requestDate = formatHipaaTimestamp();
    format = (format || 'json').toLowerCase();
    var arHeaders = [
      'RequestID', 'IndividualEmail', 'RequestDate', 'Format',
      'Status', 'ResponseDate', 'Notes'
    ];
    var arSheet = getOrCreateSheet('AccessRequests', arHeaders);
    arSheet.appendRow([requestId, user.email, requestDate, format, 'Processing', '', '']);
    var individualData;
    try {
      individualData = getIndividualData(sessionToken);
    } catch (e) {
      updateAccessRequestStatus(arSheet, requestId, 'Failed', 'Export generation failed: ' + e.message);
      throw e;
    }
    var dateStr = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');
    var filename = 'my-data-export-' + dateStr;
    var exportData;
    if (format === 'csv') {
      exportData = convertToCSV(individualData);
      filename += '.csv';
    } else {
      exportData = JSON.stringify(individualData, null, 2);
      filename += '.json';
    }
    var responseDate = formatHipaaTimestamp();
    updateAccessRequestStatus(arSheet, requestId, 'Completed', '');
    dataAuditLog(user, 'export', 'designated_record_set', requestId, {
      format: format,
      recordCount: individualData.summary.totalRecords,
      sheetsQueried: individualData.summary.sheetsQueried
    });
    return {
      success: true, requestId: requestId, format: format,
      data: exportData, filename: filename,
      requestDate: requestDate, responseDate: responseDate
    };
  });
}

/** Helper: update AccessRequests sheet status by requestId */
function updateAccessRequestStatus(sheet, requestId, status, notes) {
  var data = sheet.getDataRange().getValues();
  for (var r = 1; r < data.length; r++) {
    if (data[r][0] === requestId) {
      sheet.getRange(r + 1, 5).setValue(status);
      sheet.getRange(r + 1, 6).setValue(formatHipaaTimestamp());
      if (notes) sheet.getRange(r + 1, 7).setValue(notes);
      return;
    }
  }
}

/**
 * Retrieves ALL records from the Designated Record Set for the authenticated individual.
 */
function getIndividualData(sessionToken) {
  var user = validateSessionForData(sessionToken, 'getIndividualData');
  checkPermission(user, 'read', 'getIndividualData');
  var email = user.email.toLowerCase();
  var result = {
    individual: {
      email: user.email, displayName: user.displayName,
      role: user.role, exportDate: formatHipaaTimestamp(),
      generatedBy: 'testauthgas1 v' + VERSION
    },
    records: {},
    summary: { totalRecords: 0, sheetsQueried: 0 }
  };
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheetNames = [
    { name: SHEET_NAME, key: 'notes' },
    { name: 'SessionAuditLog', key: 'sessionHistory' },
    { name: 'DataAuditLog', key: 'dataAccessHistory' },
    { name: 'DisclosureLog', key: 'disclosures' },
    { name: 'AmendmentRequests', key: 'amendments' },
    { name: 'AccessRequests', key: 'accessRequests' }
  ];
  for (var i = 0; i < sheetNames.length; i++) {
    var s = ss.getSheetByName(sheetNames[i].name);
    if (s) {
      result.records[sheetNames[i].key] = extractRecordsForEmail(s, email, sheetNames[i].key);
      result.summary.sheetsQueried++;
    }
  }
  for (var key in result.records) {
    result.summary.totalRecords += result.records[key].length;
  }
  return result;
}

/**
 * Extracts rows from a sheet that match the individual's email.
 * Generic helper — searches all columns for email match.
 */
function extractRecordsForEmail(sheet, email, recordType) {
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) return [];
  var headers = data[0];
  var records = [];
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var matched = false;
    for (var c = 0; c < row.length; c++) {
      if (String(row[c]).toLowerCase() === email) {
        matched = true;
        break;
      }
    }
    if (matched) {
      var record = { _recordType: recordType, _rowIndex: r + 1 };
      for (var h = 0; h < headers.length; h++) {
        var _val = row[h];
        record[String(headers[h])] = _val instanceof Date ? _val.toISOString() : _val;
      }
      records.push(record);
    }
  }
  return records;
}

/**
 * Converts the getIndividualData() output to CSV format.
 */
function convertToCSV(individualData) {
  var lines = [];
  lines.push('# Data Export for ' + individualData.individual.email);
  lines.push('# Generated: ' + individualData.individual.exportDate);
  lines.push('# By: ' + individualData.individual.generatedBy);
  lines.push('');
  for (var recordType in individualData.records) {
    var records = individualData.records[recordType];
    if (records.length === 0) continue;
    lines.push('# === ' + recordType.toUpperCase() + ' (' + records.length + ' records) ===');
    var headers = [];
    for (var key in records[0]) {
      if (key.charAt(0) !== '_') headers.push(key);
    }
    lines.push(headers.join(','));
    for (var i = 0; i < records.length; i++) {
      var values = [];
      for (var h = 0; h < headers.length; h++) {
        var val = String(records[i][headers[h]] || '');
        if (/^[=+@\-]/.test(val)) val = "'" + val;
        if (val.indexOf(',') > -1 || val.indexOf('"') > -1 || val.indexOf('\n') > -1) {
          val = '"' + val.replace(/"/g, '""') + '"';
        }
        values.push(val);
      }
      lines.push(values.join(','));
    }
    lines.push('');
  }
  return lines.join('\n');
}

// ═══════════════════════════════════════════════════════
// PHASE A — ITEM #24: RIGHT TO AMENDMENT (§164.526)
// ═══════════════════════════════════════════════════════

/**
 * Creates an amendment request for a specific record.
 */
function requestAmendment(sessionToken, recordId, currentContent, proposedChange, reason) {
  return wrapPhaseAOperation('requestAmendment', sessionToken, function(user) {
    checkPermission(user, 'amend', 'requestAmendment');
    if (!recordId || !proposedChange || !reason) {
      throw new Error('INVALID_INPUT');
    }
    var amendmentId = generateRequestId('AMEND');
    var requestDate = formatHipaaTimestamp();
    var deadline = new Date();
    deadline.setDate(deadline.getDate() + HIPAA_DEADLINES.AMENDMENT_RESPONSE_DAYS);
    var deadlineStr = Utilities.formatDate(deadline, 'America/New_York', "yyyy-MM-dd'T'HH:mm:ss");
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    sheet.appendRow([
      amendmentId, user.email, recordId, requestDate,
      currentContent, proposedChange, reason, 'Pending',
      '', '', '', '', '', deadlineStr, ''
    ]);
    dataAuditLog(user, 'create', 'amendment_request', amendmentId, {
      recordId: recordId, reason: reason, deadline: deadlineStr
    });
    auditLog('amendment_requested', user.email, 'success', {
      amendmentId: amendmentId, recordId: recordId
    });
    return {
      success: true, amendmentId: amendmentId, status: 'Pending',
      deadline: deadlineStr,
      message: 'Your amendment request has been submitted. You will be notified of the decision within ' + HIPAA_DEADLINES.AMENDMENT_RESPONSE_DAYS + ' days.'
    };
  });
}

/**
 * Reviews an amendment request — approves or denies it.
 * Only users with 'admin' permission can review amendments.
 */
function reviewAmendment(sessionToken, amendmentId, decision, decisionReason) {
  return wrapPhaseAOperation('reviewAmendment', sessionToken, function(user) {
    checkPermission(user, 'admin', 'reviewAmendment');
    if (!amendmentId || !decision) throw new Error('INVALID_INPUT');
    if (decision !== 'Approved' && decision !== 'Denied') throw new Error('INVALID_INPUT');
    if (decision === 'Denied' && !decisionReason) throw new Error('INVALID_INPUT');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    var amendmentRow = null;
    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === amendmentId) {
        rowIndex = r + 1;
        amendmentRow = data[r];
        break;
      }
    }
    if (rowIndex === -1) throw new Error('NOT_FOUND');
    var currentStatus = amendmentRow[7];
    if (currentStatus !== 'Pending' && currentStatus !== 'UnderReview') {
      return { success: false, error: 'INVALID_STATE', message: 'This amendment is in status "' + currentStatus + '" and cannot be reviewed.' };
    }
    var decisionDate = formatHipaaTimestamp();
    sheet.getRange(rowIndex, 8).setValue(decision);
    sheet.getRange(rowIndex, 9).setValue(user.email);
    sheet.getRange(rowIndex, 10).setValue(decisionDate);
    sheet.getRange(rowIndex, 11).setValue(decisionReason || '');
    dataAuditLog(user, 'review', 'amendment_request', amendmentId, {
      decision: decision, decisionReason: decisionReason || '',
      individualEmail: amendmentRow[1], recordId: amendmentRow[2]
    });
    auditLog('amendment_reviewed', user.email, decision.toLowerCase(), {
      amendmentId: amendmentId, individualEmail: amendmentRow[1]
    });
    var message = decision === 'Approved'
      ? 'Amendment approved. The correction has been appended to the record.'
      : 'Amendment denied. Reason: ' + decisionReason + '. The individual has the right to file a statement of disagreement.';
    return { success: true, amendmentId: amendmentId, decision: decision, decisionDate: decisionDate, message: message };
  });
}

/**
 * Allows an individual to file a statement of disagreement after a denial.
 * Per §164.526(d)(3), the statement is appended to the record.
 */
function submitDisagreement(sessionToken, amendmentId, statement) {
  return wrapPhaseAOperation('submitDisagreement', sessionToken, function(user) {
    checkPermission(user, 'amend', 'submitDisagreement');
    if (!amendmentId || !statement) throw new Error('INVALID_INPUT');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    var amendmentRow = null;
    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === amendmentId) {
        rowIndex = r + 1;
        amendmentRow = data[r];
        break;
      }
    }
    if (rowIndex === -1) throw new Error('NOT_FOUND');
    validateIndividualAccess(user, amendmentRow[1], 'submitDisagreement');
    if (amendmentRow[7] !== 'Denied') {
      return { success: false, error: 'INVALID_STATE', message: 'A statement of disagreement can only be filed for denied amendments.' };
    }
    if (amendmentRow[11]) {
      return { success: false, error: 'ALREADY_EXISTS', message: 'A statement of disagreement has already been filed for this amendment.' };
    }
    var disagreementDate = formatHipaaTimestamp();
    sheet.getRange(rowIndex, 8).setValue('Denied — Disagreement Filed');
    sheet.getRange(rowIndex, 12).setValue(statement);
    sheet.getRange(rowIndex, 13).setValue(disagreementDate);
    dataAuditLog(user, 'create', 'disagreement_statement', amendmentId, {
      statementLength: statement.length
    });
    auditLog('disagreement_filed', user.email, 'success', { amendmentId: amendmentId });
    return { success: true, amendmentId: amendmentId, status: 'Denied — Disagreement Filed', message: 'Your statement of disagreement has been recorded and appended to the amendment record.' };
  });
}

/**
 * Returns the complete amendment history for a specific record.
 */
function getAmendmentHistory(sessionToken, recordId) {
  return wrapPhaseAOperation('getAmendmentHistory', sessionToken, function(user) {
    checkPermission(user, 'read', 'getAmendmentHistory');
    if (!recordId) throw new Error('INVALID_INPUT');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var amendments = [];
    for (var r = 1; r < data.length; r++) {
      if (data[r][2] === recordId) {
        validateIndividualAccess(user, data[r][1], 'getAmendmentHistory');
        var _rd = data[r][3], _dd = data[r][9], _dgd = data[r][12];
        amendments.push({
          amendmentId: data[r][0], requestDate: _rd instanceof Date ? _rd.toISOString() : String(_rd || ''),
          currentContent: data[r][4], proposedChange: data[r][5],
          reason: data[r][6], status: data[r][7],
          reviewerEmail: data[r][8] || null, decisionDate: _dd instanceof Date ? _dd.toISOString() : (_dd || null),
          decisionReason: data[r][10] || null,
          hasDisagreement: !!data[r][11], disagreementDate: _dgd instanceof Date ? _dgd.toISOString() : (_dgd || null)
        });
      }
    }
    amendments.sort(function(a, b) { return new Date(b.requestDate) - new Date(a.requestDate); });
    dataAuditLog(user, 'read', 'amendment_history', recordId, {
      amendmentCount: amendments.length
    });
    return { success: true, recordId: recordId, amendments: amendments, count: amendments.length };
  });
}

/**
 * Returns all pending/under-review amendment requests (admin only).
 * Used by the amendment review panel to list amendments needing action.
 */
function getPendingAmendments(sessionToken) {
  return wrapPhaseAOperation('getPendingAmendments', sessionToken, function(user) {
    checkPermission(user, 'admin', 'getPendingAmendments');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var pending = [];
    for (var r = 1; r < data.length; r++) {
      var status = data[r][7];
      if (status === 'Pending' || status === 'UnderReview') {
        pending.push({
          amendmentId: data[r][0], individualEmail: data[r][1],
          recordId: data[r][2], requestDate: data[r][3] instanceof Date ? data[r][3].toISOString() : String(data[r][3]),
          currentContent: data[r][4], proposedChange: data[r][5],
          reason: data[r][6], status: status, deadline: data[r][13] instanceof Date ? data[r][13].toISOString() : String(data[r][13])
        });
      }
    }
    pending.sort(function(a, b) { return new Date(a.requestDate) - new Date(b.requestDate); });
    auditLog('admin_action', user.email, 'list_pending_amendments', { count: pending.length });
    return pending;
  });
}

// ═══════════════════════════════════════════════════════
// PHASE A — 30-DAY EXTENSION WORKFLOWS (§164.524/§164.526)
// ═══════════════════════════════════════════════════════

/**
 * Requests a 30-day extension for an access request.
 * Per §164.524(b)(2)(i), a covered entity may extend the response period
 * by no more than 30 days with written notice to the individual.
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} requestId — The AccessRequests ID to extend
 * @param {string} reason — Written statement explaining why extension is needed
 */
function requestAccessExtension(sessionToken, requestId, reason) {
  return wrapPhaseAOperation('requestAccessExtension', sessionToken, function(user) {
    checkPermission(user, 'admin', 'requestAccessExtension');
    if (!requestId || !reason) throw new Error('INVALID_INPUT');
    var arHeaders = [
      'RequestID', 'IndividualEmail', 'RequestDate', 'Format',
      'Status', 'ResponseDate', 'Notes'
    ];
    var sheet = getOrCreateSheet('AccessRequests', arHeaders);
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    var requestRow = null;
    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === requestId) {
        rowIndex = r + 1;
        requestRow = data[r];
        break;
      }
    }
    if (rowIndex === -1) throw new Error('NOT_FOUND');
    var currentStatus = String(requestRow[4]);
    if (currentStatus === 'Completed' || currentStatus === 'Denied' || currentStatus === 'Extended') {
      return { success: false, error: 'INVALID_STATE', message: 'Request is in status "' + currentStatus + '" and cannot be extended.' };
    }
    var originalDate = new Date(requestRow[2]);
    var extendedDeadline = new Date(originalDate.getTime() +
      ((HIPAA_DEADLINES.ACCESS_RESPONSE_DAYS + HIPAA_DEADLINES.ACCESS_EXTENSION_DAYS) * 24 * 60 * 60 * 1000));
    var extendedDeadlineStr = Utilities.formatDate(extendedDeadline, 'America/New_York', "yyyy-MM-dd'T'HH:mm:ss");
    sheet.getRange(rowIndex, 5).setValue('Extended');
    sheet.getRange(rowIndex, 7).setValue('Extension granted: ' + reason + ' | New deadline: ' + extendedDeadlineStr);
    dataAuditLog(user, 'update', 'access_extension', requestId, {
      reason: reason,
      originalDate: requestRow[2],
      newDeadline: extendedDeadlineStr,
      individualEmail: requestRow[1]
    });
    auditLog('access_extension', user.email, 'success', {
      requestId: requestId, individualEmail: requestRow[1]
    });
    return {
      success: true, requestId: requestId, status: 'Extended',
      newDeadline: extendedDeadlineStr,
      message: 'Extension granted. The individual must be notified in writing. New deadline: ' + extendedDeadlineStr
    };
  });
}

/**
 * Requests a 30-day extension for an amendment request.
 * Per §164.526(b)(2)(i), a covered entity may extend the amendment response
 * period by no more than 30 days with written notice to the individual.
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} amendmentId — The AmendmentRequests ID to extend
 * @param {string} reason — Written statement explaining why extension is needed
 */
function requestAmendmentExtension(sessionToken, amendmentId, reason) {
  return wrapPhaseAOperation('requestAmendmentExtension', sessionToken, function(user) {
    checkPermission(user, 'admin', 'requestAmendmentExtension');
    if (!amendmentId || !reason) throw new Error('INVALID_INPUT');
    var headers = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var sheet = getOrCreateSheet('AmendmentRequests', headers);
    var data = sheet.getDataRange().getValues();
    var rowIndex = -1;
    var amendmentRow = null;
    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === amendmentId) {
        rowIndex = r + 1;
        amendmentRow = data[r];
        break;
      }
    }
    if (rowIndex === -1) throw new Error('NOT_FOUND');
    var currentStatus = String(amendmentRow[7]);
    if (currentStatus !== 'Pending' && currentStatus !== 'UnderReview') {
      return { success: false, error: 'INVALID_STATE', message: 'Amendment is in status "' + currentStatus + '" and cannot be extended.' };
    }
    var originalDate = new Date(amendmentRow[3]);
    var extendedDeadline = new Date(originalDate.getTime() +
      ((HIPAA_DEADLINES.AMENDMENT_RESPONSE_DAYS + HIPAA_DEADLINES.AMENDMENT_EXTENSION_DAYS) * 24 * 60 * 60 * 1000));
    var extendedDeadlineStr = Utilities.formatDate(extendedDeadline, 'America/New_York', "yyyy-MM-dd'T'HH:mm:ss");
    sheet.getRange(rowIndex, 8).setValue('Extended');
    sheet.getRange(rowIndex, 14).setValue(extendedDeadlineStr);
    sheet.getRange(rowIndex, 15).setValue('Extension: ' + reason);
    dataAuditLog(user, 'update', 'amendment_extension', amendmentId, {
      reason: reason,
      originalDeadline: amendmentRow[13],
      newDeadline: extendedDeadlineStr,
      individualEmail: amendmentRow[1]
    });
    auditLog('amendment_extension', user.email, 'success', {
      amendmentId: amendmentId, individualEmail: amendmentRow[1]
    });
    return {
      success: true, amendmentId: amendmentId, status: 'Extended',
      newDeadline: extendedDeadlineStr,
      message: 'Extension granted. The individual must be notified in writing. New deadline: ' + extendedDeadlineStr
    };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE A — FORMAL DENIAL NOTICE (§164.524(d))
// ═══════════════════════════════════════════════════════

/**
 * Generates a formal written denial notice per §164.524(d)(2).
 * Required elements:
 *   (i)   Basis for the denial
 *   (ii)  Individual's right to submit a statement of disagreement (for reviewable denials)
 *   (iii) Description of how the individual may complain to the covered entity
 *   (iv)  Name/title of contact person or office for complaints
 *   (v)   How to file a complaint with the HHS Secretary
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} requestType — 'access' or 'amendment'
 * @param {string} requestId — The request ID (AccessRequests or AmendmentRequests)
 * @param {Object} params — Additional denial parameters
 * @param {string} params.basisForDenial — The specific legal basis
 * @param {boolean} [params.isReviewable] — Whether the denial is reviewable (default: true)
 * @param {string} [params.contactPerson] — Name of complaint contact (default: HIPAA Privacy Officer)
 * @param {string} [params.contactOffice] — Office for complaints (default: Privacy Office)
 */
function generateDenialNotice(sessionToken, requestType, requestId, params) {
  return wrapPhaseAOperation('generateDenialNotice', sessionToken, function(user) {
    checkPermission(user, 'admin', 'generateDenialNotice');
    if (!requestType || !requestId || !params || !params.basisForDenial) {
      throw new Error('INVALID_INPUT');
    }
    if (requestType !== 'access' && requestType !== 'amendment') {
      throw new Error('INVALID_INPUT');
    }
    var isReviewable = params.isReviewable !== false;
    var contactPerson = params.contactPerson || 'HIPAA Privacy Officer';
    var contactOffice = params.contactOffice || 'Privacy Office';
    var noticeDate = formatHipaaTimestamp();
    var notice = {
      noticeType: 'HIPAA Formal Denial Notice',
      date: noticeDate,
      requestType: requestType,
      requestId: requestId,
      sections: {
        basisForDenial: {
          heading: '(i) Basis for Denial',
          content: params.basisForDenial
        },
        rightToDisagree: {
          heading: '(ii) Right to Submit Statement of Disagreement',
          content: isReviewable
            ? 'You have the right to submit a written statement of disagreement with the denial. '
              + 'Your statement will be appended to the designated record set and included with any future disclosures of the disputed information. '
              + 'If you choose not to submit a statement of disagreement, you may request that the covered entity include your request and the denial with any future disclosures.'
            : 'This denial is based on an unreviewable ground. The denied information was not created by this covered entity, '
              + 'is not part of the designated record set, or the information is exempted from access under the Privacy Rule.'
        },
        complaintProcess: {
          heading: '(iii) How to File a Complaint with the Covered Entity',
          content: 'You may file a complaint regarding this denial by contacting the ' + contactOffice + '. '
            + 'Contact person: ' + contactPerson + '. '
            + 'Complaints should be submitted in writing and will be reviewed within 30 days.'
        },
        contactInformation: {
          heading: '(iv) Complaint Contact',
          content: 'Name/Title: ' + contactPerson + ' | Office: ' + contactOffice
        },
        hhsComplaint: {
          heading: '(v) Filing a Complaint with the Secretary of HHS',
          content: 'You have the right to file a complaint with the Secretary of the U.S. Department of Health and Human Services. '
            + 'Complaints may be filed online at https://www.hhs.gov/hipaa/filing-a-complaint/ '
            + 'or by mail to: Office for Civil Rights, U.S. Department of Health and Human Services, '
            + '200 Independence Avenue S.W., Washington, D.C. 20201. '
            + 'Filing a complaint will not result in retaliation.'
        }
      },
      isReviewable: isReviewable,
      generatedBy: user.email,
      generatedAt: noticeDate
    };
    dataAuditLog(user, 'create', 'denial_notice', requestId, {
      requestType: requestType,
      basisForDenial: params.basisForDenial,
      isReviewable: isReviewable
    });
    auditLog('denial_notice_generated', user.email, 'success', {
      requestType: requestType, requestId: requestId
    });
    return { success: true, notice: notice };
  });
}


// ═══════════════════════════════════════════════════════
// HIPAA COMPLIANCE — Phase B: Organizational Compliance
// ═══════════════════════════════════════════════════════

// PHASE B — P3: PERSONAL REPRESENTATIVE ACCESS (#25)
// ═══════════════════════════════════════════════════════

/**
 * Registers a personal representative for an individual.
 * Only admins can register representatives.
 * The registration requires admin approval (separate step) unless auto-approved by config.
 *
 * @param {string} sessionToken — Admin session token
 * @param {Object} params
 * @param {string} params.representativeEmail — The representative's email
 * @param {string} params.individualEmail — The individual they will represent
 * @param {string} params.relationshipType — One of REPRESENTATIVE_CONFIG.SUPPORTED_RELATIONSHIP_TYPES
 * @param {string} [params.expirationDate] — When authorization expires (ISO 8601, null = indefinite)
 * @param {string} [params.documentReference] — Reference to authorization document
 * @param {string} [params.notes] — Additional notes
 * @returns {Object} { success, representativeId, approvalStatus }
 */
function registerPersonalRepresentative(sessionToken, params) {
  return wrapHipaaOperation('registerPersonalRepresentative', sessionToken, function(user) {
    checkPermission(user, 'admin', 'registerPersonalRepresentative');

    if (!params || !params.representativeEmail || !params.individualEmail || !params.relationshipType) {
      throw new Error('INVALID_INPUT');
    }

    // Validate relationship type
    if (REPRESENTATIVE_CONFIG.SUPPORTED_RELATIONSHIP_TYPES.indexOf(params.relationshipType) === -1) {
      throw new Error('INVALID_INPUT');
    }

    // Check representative limit per individual
    var headers = [
      'RepresentativeID', 'RepresentativeEmail', 'IndividualEmail',
      'RelationshipType', 'AuthorizationDate', 'ExpirationDate',
      'Status', 'ApprovalStatus', 'ApprovedBy', 'ApprovalDate',
      'DocumentReference', 'Notes'
    ];
    var sheet = getOrCreateSheet('PersonalRepresentatives', headers);
    var data = sheet.getDataRange().getValues();

    var activeCount = 0;
    for (var r = 1; r < data.length; r++) {
      if (String(data[r][2] || '').toLowerCase() === params.individualEmail.toLowerCase()
          && data[r][6] === 'Active') {
        activeCount++;
      }
      // Check for duplicate registration
      if (String(data[r][1] || '').toLowerCase() === params.representativeEmail.toLowerCase()
          && String(data[r][2] || '').toLowerCase() === params.individualEmail.toLowerCase()
          && data[r][6] === 'Active') {
        throw new Error('ALREADY_EXISTS');
      }
    }

    if (activeCount >= REPRESENTATIVE_CONFIG.MAX_REPRESENTATIVES_PER_INDIVIDUAL) {
      return {
        success: false,
        error: 'LIMIT_EXCEEDED',
        message: 'Maximum ' + REPRESENTATIVE_CONFIG.MAX_REPRESENTATIVES_PER_INDIVIDUAL
          + ' active representatives per individual.'
      };
    }

    var repId = generateRequestId('REP');
    var timestamp = formatHipaaTimestamp();
    var approvalStatus = REPRESENTATIVE_CONFIG.REQUIRE_ADMIN_APPROVAL ? 'Approved' : 'Pending';
    // Since admin is doing the registration, auto-approve
    var approvedBy = user.email;

    var row = [
      repId,
      params.representativeEmail,
      params.individualEmail,
      params.relationshipType,
      timestamp,  // AuthorizationDate
      params.expirationDate || '',
      'Active',
      approvalStatus,
      approvedBy,
      timestamp,  // ApprovalDate
      params.documentReference || '',
      params.notes || ''
    ];
    sheet.appendRow(row);

    dataAuditLog(user, 'create', 'personal_representative', repId, {
      representativeEmail: params.representativeEmail,
      individualEmail: params.individualEmail,
      relationshipType: params.relationshipType,
      approvalStatus: approvalStatus
    });

    return {
      success: true,
      representativeId: repId,
      approvalStatus: approvalStatus
    };
  });
}

/**
 * Returns the list of personal representatives for an individual.
 * Admin can query any individual; non-admin can only see their own representatives.
 *
 * @param {string} sessionToken — Session token
 * @param {string} [targetEmail] — For admin: specify individual's email
 * @returns {Object} { success, representatives: [...], count }
 */
function getPersonalRepresentatives(sessionToken, targetEmail) {
  return wrapHipaaOperation('getPersonalRepresentatives', sessionToken, function(user) {
    var email = targetEmail || user.email;
    validateIndividualAccess(user, email, 'getPersonalRepresentatives');

    var headers = [
      'RepresentativeID', 'RepresentativeEmail', 'IndividualEmail',
      'RelationshipType', 'AuthorizationDate', 'ExpirationDate',
      'Status', 'ApprovalStatus', 'ApprovedBy', 'ApprovalDate',
      'DocumentReference', 'Notes'
    ];
    var sheet = getOrCreateSheet('PersonalRepresentatives', headers);
    var data = sheet.getDataRange().getValues();

    var representatives = [];
    for (var r = 1; r < data.length; r++) {
      var indEmail = String(data[r][2] || '').toLowerCase();
      if (indEmail !== email.toLowerCase()) continue;

      representatives.push({
        representativeId: data[r][0],
        representativeEmail: data[r][1],
        relationshipType: data[r][3],
        authorizationDate: data[r][4] ? String(data[r][4]) : null,
        expirationDate: data[r][5] ? String(data[r][5]) : null,
        status: data[r][6],
        approvalStatus: data[r][7],
        documentReference: data[r][10] || null
      });
    }

    return {
      success: true,
      individualEmail: email,
      representatives: representatives,
      count: representatives.length
    };
  });
}

/**
 * Revokes a personal representative's authorization.
 * Supports the §164.502(g)(3) abuse/neglect override with documented reason.
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} representativeId — The representative record to revoke
 * @param {string} [reason] — Reason for revocation (required for abuse/neglect override)
 * @returns {Object} { success, representativeId, newStatus }
 */
function revokeRepresentative(sessionToken, representativeId, reason) {
  return wrapHipaaOperation('revokeRepresentative', sessionToken, function(user) {
    checkPermission(user, 'admin', 'revokeRepresentative');

    if (!representativeId) throw new Error('INVALID_INPUT');

    var headers = [
      'RepresentativeID', 'RepresentativeEmail', 'IndividualEmail',
      'RelationshipType', 'AuthorizationDate', 'ExpirationDate',
      'Status', 'ApprovalStatus', 'ApprovedBy', 'ApprovalDate',
      'DocumentReference', 'Notes'
    ];
    var sheet = getOrCreateSheet('PersonalRepresentatives', headers);
    var data = sheet.getDataRange().getValues();

    var targetRow = -1;
    var currentStatus = '';
    var repEmail = '';
    var indEmail = '';

    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === representativeId) {
        targetRow = r + 1;
        currentStatus = data[r][6];
        repEmail = data[r][1];
        indEmail = data[r][2];
        break;
      }
    }

    if (targetRow === -1) throw new Error('NOT_FOUND');
    if (currentStatus === 'Revoked') throw new Error('ALREADY_EXISTS');

    // Update status to Revoked
    sheet.getRange(targetRow, 7).setValue('Revoked'); // Status column
    // Append revocation reason to Notes
    var existingNotes = String(data[targetRow - 1][11] || '');
    var revocationNote = 'Revoked by ' + user.email + ' on ' + formatHipaaTimestamp();
    if (reason) {
      revocationNote += ' — Reason: ' + reason;
    }
    sheet.getRange(targetRow, 12).setValue(
      existingNotes ? existingNotes + ' | ' + revocationNote : revocationNote
    );

    dataAuditLog(user, 'update', 'personal_representative', representativeId, {
      previousStatus: currentStatus,
      newStatus: 'Revoked',
      representativeEmail: repEmail,
      individualEmail: indEmail,
      reason: reason || 'No reason provided'
    });

    return {
      success: true,
      representativeId: representativeId,
      previousStatus: currentStatus,
      newStatus: 'Revoked'
    };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE B — P2: RETENTION ENFORCEMENT (#18)
// ═══════════════════════════════════════════════════════

/**
 * Enforces HIPAA retention requirements across all protected sheets.
 * Designed to run as a daily time-driven trigger.
 *
 * Actions:
 * 1. Ensures sheet protection exists on all HIPAA sheets
 * 2. Archives records older than the retention period to *_Archive sheets
 * 3. Logs all actions to SessionAuditLog
 *
 * Does NOT delete any records — archival moves rows to a separate sheet.
 * The original sheet becomes smaller over time (performance improvement)
 * while the archive retains everything for the full retention period.
 */
function enforceRetention() {
  var startTime = new Date().getTime();
  var maxExecutionMs = 5 * 60 * 1000; // 5 minutes (leave 1-minute buffer for GAS 6-min limit)

  var retentionYears = HIPAA_RETENTION_CONFIG.RETENTION_YEARS
    || AUTH_CONFIG.AUDIT_LOG_RETENTION_YEARS || 6;
  var cutoffDate = getRetentionCutoffDate(retentionYears);

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheetsToProtect = HIPAA_RETENTION_CONFIG.SHEETS_TO_PROTECT;
  var batchSize = HIPAA_RETENTION_CONFIG.BATCH_SIZE || 500;

  var totalArchived = 0;
  var totalProtected = 0;

  for (var s = 0; s < sheetsToProtect.length; s++) {
    // Check execution time budget
    if (new Date().getTime() - startTime > maxExecutionMs) {
      auditLog('retention_timeout', 'system', 'partial', {
        processedSheets: s,
        totalSheets: sheetsToProtect.length,
        totalArchived: totalArchived,
        message: 'Trigger will resume on next daily execution'
      });
      break;
    }

    var sheetName = sheetsToProtect[s];
    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) continue;

    // Step 1: Ensure sheet protection
    var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    if (protections.length === 0) {
      var protection = sheet.protect().setDescription('HIPAA Protected — ' + sheetName);
      protection.setWarningOnly(true);
      totalProtected++;
    }

    // Step 2: Archive old records
    // Find the timestamp column (first column that looks like a date/timestamp)
    var data = sheet.getDataRange().getValues();
    if (data.length <= 1) continue; // Header only

    var headers = data[0];
    var tsColIdx = -1;
    for (var h = 0; h < headers.length; h++) {
      var hdr = String(headers[h]).toLowerCase();
      if (hdr === 'timestamp' || hdr === 'createddate' || hdr === 'requestdate'
          || hdr === 'discoverydate' || hdr === 'authorizationdate') {
        tsColIdx = h;
        break;
      }
    }
    if (tsColIdx === -1) continue; // No timestamp column found

    // Get or create archive sheet
    var archiveSheetName = sheetName + HIPAA_RETENTION_CONFIG.ARCHIVE_SHEET_SUFFIX;
    var archiveSheet = ss.getSheetByName(archiveSheetName);
    if (!archiveSheet) {
      archiveSheet = ss.insertSheet(archiveSheetName);
      archiveSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      archiveSheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      archiveSheet.setFrozenRows(1);
      var archiveProtection = archiveSheet.protect().setDescription('HIPAA Archive — ' + archiveSheetName);
      archiveProtection.setWarningOnly(true);
    }

    // Find rows to archive (older than cutoff, with legal hold check)
    var rowsToArchive = [];
    var rowsHeld = 0;

    for (var r = 1; r < data.length && rowsToArchive.length < batchSize; r++) {
      var ts = data[r][tsColIdx];
      var rowDate = ts instanceof Date ? ts : new Date(ts);
      if (isNaN(rowDate.getTime())) continue;

      // PHASE C: Use retention-relevant date (creation or last-in-effect, whichever is later)
      var retentionDate = getRetentionRelevantDate(headers, data[r]);
      if (retentionDate >= cutoffDate) continue; // Not yet eligible for archival

      // PHASE C: Check legal hold before archiving
      var hold = checkLegalHold(sheetName, rowDate);
      if (hold) {
        rowsHeld++;
        continue; // Skip this record — under legal hold
      }

      rowsToArchive.push({ rowIndex: r + 1, values: data[r] }); // 1-indexed for sheet ops
    }

    // PHASE C: Log held records count
    if (rowsHeld > 0) {
      auditLog('retention_hold_skipped', 'system', 'info', {
        sheetName: sheetName,
        rowsHeld: rowsHeld,
        holdReason: 'active_legal_hold'
      });
    }

    if (rowsToArchive.length === 0) continue;

    // Append archived rows to archive sheet
    var archiveValues = rowsToArchive.map(function(r) { return r.values; });
    var archiveStartRow = archiveSheet.getLastRow() + 1;
    archiveSheet.getRange(
      archiveStartRow, 1,
      archiveValues.length, archiveValues[0].length
    ).setValues(archiveValues);
    var archiveEndRow = archiveSheet.getLastRow();

    // Delete archived rows from source sheet (bottom-up to preserve indices)
    rowsToArchive.sort(function(a, b) { return b.rowIndex - a.rowIndex; });
    for (var d = 0; d < rowsToArchive.length; d++) {
      sheet.deleteRow(rowsToArchive[d].rowIndex);
    }

    totalArchived += rowsToArchive.length;

    // PHASE C: Compute and store integrity checksum for the archived batch
    computeArchiveChecksum(sheetName, archiveValues, archiveStartRow, archiveEndRow);
  }

  auditLog('retention_enforcement', 'system', 'success', {
    retentionYears: retentionYears,
    cutoffDate: cutoffDate.toISOString(),
    sheetsProcessed: sheetsToProtect.length,
    totalArchived: totalArchived,
    totalProtected: totalProtected,
    totalHeld: rowsHeld || 0
  });
}

/**
 * Sets up the daily time-driven trigger for retention enforcement.
 * Run this ONCE from the Apps Script editor (Run → setupRetentionTrigger).
 * The trigger fires once per day between 2:00-3:00 AM EST.
 */
function setupRetentionTrigger() {
  // Remove any existing retention triggers to avoid duplicates
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'enforceRetention') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  // Create new daily trigger
  ScriptApp.newTrigger('enforceRetention')
    .timeBased()
    .atHour(2) // 2:00 AM
    .everyDays(1)
    .inTimezone('America/New_York')
    .create();

  auditLog('retention_trigger_installed', 'system', 'success', {
    schedule: 'Daily at 2:00 AM EST',
    handler: 'enforceRetention()'
  });
}

// ═══════════════════════════════════════════════════════
// PHASE B — P2: BREACH DETECTION & ALERTING (#28)
// ═══════════════════════════════════════════════════════

/**
 * Evaluates whether a security event warrants a breach alert.
 * Called by processSecurityEvent() after logging the event.
 * Checks event count against configurable thresholds and sends email if exceeded.
 *
 * @param {string} eventType — The security event type (e.g. 'tier3_lockout', 'hmac_integrity_violation')
 * @param {Object} eventDetails — Details about the event (for the alert email)
 */
function evaluateBreachAlert(eventType, eventDetails) {
  if (!BREACH_ALERT_CONFIG.ENABLED) return;

  if (!BREACH_ALERT_CONFIG.SECURITY_OFFICER_EMAIL) {
    auditLog('breach_alert_config_error', 'system', 'error', {
      message: 'SECURITY_OFFICER_EMAIL not configured — breach alerting disabled',
      eventType: eventType
    });
    return;
  }

  var threshold = BREACH_ALERT_CONFIG.THRESHOLDS[eventType];
  if (!threshold) return; // Event type not configured for alerting

  var cache = getEpochCache();
  var windowKey = 'breach_window_' + eventType;

  // Count events in the rolling window
  var windowData = cache.get(windowKey);
  var eventCount = windowData ? parseInt(windowData, 10) + 1 : 1;
  cache.put(windowKey, String(eventCount), BREACH_ALERT_CONFIG.WINDOW_MINUTES * 60);

  if (eventCount < threshold) return; // Below threshold

  // Threshold exceeded — check cooldown before sending
  var cooldownKey = 'breach_alert_cooldown_' + eventType;
  if (cache.get(cooldownKey)) {
    auditLog('breach_alert_suppressed', 'system', 'cooldown', {
      eventType: eventType,
      eventCount: eventCount,
      threshold: threshold,
      reason: 'alert_cooldown_active'
    });
    return;
  }

  // Send the alert via extracted function
  var alertResult = sendBreachAlert(eventType, eventCount, threshold, eventDetails);

  if (alertResult.success) {
    // Set cooldown to prevent alert storms
    cache.put(cooldownKey, 'sent', BREACH_ALERT_CONFIG.ALERT_COOLDOWN_MINUTES * 60);
  }

  // Always log to BreachLog for events in the ALWAYS_LOG_EVENTS list
  if (BREACH_ALERT_CONFIG.ALWAYS_LOG_EVENTS.indexOf(eventType) > -1) {
    logBreachFromAlert(eventType, eventCount, eventDetails);
  }
}

/**
 * Sends a breach alert email to the configured security officer.
 * Extracted from evaluateBreachAlert() for reusability and testability.
 *
 * @param {string} eventType — The security event type
 * @param {number} eventCount — Number of events that triggered the alert
 * @param {number} threshold — The configured threshold for this event type
 * @param {Object} eventDetails — Details about the event (for the alert email)
 * @returns {Object} { success, messageId } or { success: false, error }
 */
function sendBreachAlert(eventType, eventCount, threshold, eventDetails) {
  var alertSubject = 'HIPAA Security Alert — ' + eventType.replace(/_/g, ' ').toUpperCase();
  var alertBody = 'HIPAA SECURITY ALERT\n'
    + '━━━━━━━━━━━━━━━━━━━━\n\n'
    + 'Event Type: ' + eventType + '\n'
    + 'Threshold: ' + threshold + ' events in ' + BREACH_ALERT_CONFIG.WINDOW_MINUTES + ' minutes\n'
    + 'Actual Count: ' + eventCount + '\n'
    + 'Timestamp: ' + formatHipaaTimestamp() + '\n'
    + 'Environment: testauthgas1\n\n'
    + 'Event Details:\n'
    + JSON.stringify(eventDetails || {}, null, 2).substring(0, 500) + '\n\n'
    + 'ACTION REQUIRED:\n'
    + '1. Review the SessionAuditLog for related events\n'
    + '2. Determine if this constitutes a breach per the 4-factor analysis\n'
    + '3. If a breach is confirmed, log it via the Breach Dashboard\n'
    + '4. Begin the 60-day notification countdown if applicable\n\n'
    + 'This alert was generated automatically by the HIPAA breach detection system.\n'
    + 'Alert cooldown: ' + BREACH_ALERT_CONFIG.ALERT_COOLDOWN_MINUTES + ' minutes (no duplicate alerts during this period).';

  return sendHipaaEmail({
    to: BREACH_ALERT_CONFIG.SECURITY_OFFICER_EMAIL,
    subject: alertSubject,
    body: alertBody,
    emailType: 'breach_alert',
    triggeredBy: 'system',
    metadata: {
      eventType: eventType,
      eventCount: eventCount,
      threshold: threshold
    }
  });
}

/**
 * Returns the current breach alert configuration.
 * Security officer email is redacted — shows '***configured***' when set.
 *
 * @returns {Object} Breach alert config with redacted email
 */
function getBreachAlertConfig() {
  return {
    enabled: BREACH_ALERT_CONFIG.ENABLED,
    securityOfficerEmail: BREACH_ALERT_CONFIG.SECURITY_OFFICER_EMAIL ? '***configured***' : '',
    alertCooldownMinutes: BREACH_ALERT_CONFIG.ALERT_COOLDOWN_MINUTES,
    windowMinutes: BREACH_ALERT_CONFIG.WINDOW_MINUTES,
    thresholds: BREACH_ALERT_CONFIG.THRESHOLDS,
    alwaysLogEvents: BREACH_ALERT_CONFIG.ALWAYS_LOG_EVENTS
  };
}

// ═══════════════════════════════════════════════════════
// PHASE B — P2: BREACH LOGGING (#31)
// ═══════════════════════════════════════════════════════

/**
 * Logs a breach or potential breach to the BreachLog sheet.
 * Can be called manually by admin or automatically by evaluateBreachAlert().
 *
 * @param {string} sessionToken — Admin session token (null for system-generated entries)
 * @param {Object} params
 * @param {string} params.description — Brief description of the breach/incident
 * @param {string} params.discoveryDate — When the breach was discovered (ISO 8601)
 * @param {string} params.source — 'Manual' | 'Auto-Detected'
 * @param {string} [params.natureOfPhi] — What types of PHI were involved
 * @param {string} [params.unauthorizedPerson] — Who accessed/received the PHI
 * @param {string} [params.acquiredOrViewed] — Whether PHI was actually accessed
 * @param {string} [params.mitigationSteps] — Actions taken to reduce harm
 * @param {number} [params.affectedIndividuals] — Number of individuals affected
 * @param {string} [params.relatedEventType] — Security event type that triggered this entry
 * @returns {Object} { success, breachId }
 */
function logBreach(sessionToken, params) {
  var performLog = function(user) {
    if (user) {
      checkPermission(user, 'admin', 'logBreach');
    }

    if (!params || !params.description) {
      throw new Error('INVALID_INPUT');
    }

    var breachId = generateRequestId('BREACH');
    var timestamp = formatHipaaTimestamp();
    var discoveryDate = params.discoveryDate || timestamp;

    // Calculate notification deadline per §164.404(b)
    var deadline = new Date(discoveryDate);
    deadline.setDate(deadline.getDate() + HIPAA_DEADLINES.BREACH_NOTIFICATION_DAYS);

    var headers = [
      'BreachID', 'CreatedDate', 'DiscoveryDate', 'Description',
      'Source', 'Status', 'NatureOfPhi', 'UnauthorizedPerson',
      'AcquiredOrViewed', 'MitigationSteps', 'AffectedIndividuals',
      'RiskAssessment', 'NotificationDeadline', 'NotificationDate',
      'HhsReportDate', 'RelatedEventType', 'InvestigatorEmail',
      'ResolutionDate', 'ResolutionNotes'
    ];
    var sheet = getOrCreateSheet('BreachLog', headers);

    var row = [
      breachId,
      timestamp,
      discoveryDate,
      params.description,
      params.source || 'Manual',
      'Under Investigation',
      params.natureOfPhi || '',
      params.unauthorizedPerson || '',
      params.acquiredOrViewed || '',
      params.mitigationSteps || '',
      params.affectedIndividuals || 0,
      '',  // RiskAssessment — to be filled during investigation
      deadline.toISOString(),
      '',  // NotificationDate
      '',  // HhsReportDate
      params.relatedEventType || '',
      user ? user.email : 'system',
      '',  // ResolutionDate
      ''   // ResolutionNotes
    ];
    sheet.appendRow(row);

    auditLog('breach_logged', user ? user.email : 'system', 'success', {
      breachId: breachId,
      source: params.source || 'Manual',
      description: params.description.substring(0, 100)
    });

    return {
      success: true,
      breachId: breachId,
      notificationDeadline: deadline.toISOString()
    };
  };

  // If called with a session token (manual entry), validate session
  if (sessionToken) {
    return wrapHipaaOperation('logBreach', sessionToken, performLog);
  }

  // If called without session token (system-generated), execute directly
  return performLog(null);
}

/**
 * Automatically creates a BreachLog entry when evaluateBreachAlert() fires.
 * Called internally — not exposed as a user-callable endpoint.
 *
 * @param {string} eventType — The security event type
 * @param {number} eventCount — Number of events that triggered the alert
 * @param {Object} eventDetails — Details from the security event
 */
function logBreachFromAlert(eventType, eventCount, eventDetails) {
  // Deduplication: check if a BreachLog entry for this eventType was created recently
  var headers = [
    'BreachID', 'CreatedDate', 'DiscoveryDate', 'Description',
    'Source', 'Status', 'NatureOfPhi', 'UnauthorizedPerson',
    'AcquiredOrViewed', 'MitigationSteps', 'AffectedIndividuals',
    'RiskAssessment', 'NotificationDeadline', 'NotificationDate',
    'HhsReportDate', 'RelatedEventType', 'InvestigatorEmail',
    'ResolutionDate', 'ResolutionNotes'
  ];
  var sheet = getOrCreateSheet('BreachLog', headers);
  var data = sheet.getDataRange().getValues();
  var cooldownMs = BREACH_ALERT_CONFIG.ALERT_COOLDOWN_MINUTES * 60 * 1000;
  var now = new Date();

  for (var r = 1; r < data.length; r++) {
    if (String(data[r][4]) !== 'Auto-Detected') continue;
    if (String(data[r][15]) !== eventType) continue;
    var created = data[r][1] instanceof Date ? data[r][1] : new Date(data[r][1]);
    if (!isNaN(created.getTime()) && (now.getTime() - created.getTime()) < cooldownMs) {
      auditLog('breach_log_dedup', 'system', 'suppressed', {
        eventType: eventType,
        existingBreachId: data[r][0],
        reason: 'duplicate_within_cooldown_window'
      });
      return; // Duplicate suppressed
    }
  }

  logBreach(null, {
    description: 'Auto-detected: ' + eventType + ' — ' + eventCount + ' events exceeded threshold within '
      + BREACH_ALERT_CONFIG.WINDOW_MINUTES + ' minutes',
    discoveryDate: formatHipaaTimestamp(),
    source: 'Auto-Detected',
    relatedEventType: eventType,
    natureOfPhi: 'To be determined during investigation',
    unauthorizedPerson: eventDetails && eventDetails.email ? eventDetails.email : 'Unknown — see audit logs',
    acquiredOrViewed: 'To be determined during investigation',
    mitigationSteps: 'Automatic escalating lockout applied. Alert sent to security officer.',
    affectedIndividuals: 0  // To be determined during investigation
  });
}

/**
 * Updates the status and investigation details of a breach record.
 * Used by admin during the investigation and notification process.
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} breachId — The breach to update
 * @param {Object} updates — Fields to update (only specified fields are changed)
 * @returns {Object} { success, breachId, newStatus }
 */
function updateBreachStatus(sessionToken, breachId, updates) {
  return wrapHipaaOperation('updateBreachStatus', sessionToken, function(user) {
    checkPermission(user, 'admin', 'updateBreachStatus');

    if (!breachId || !updates) throw new Error('INVALID_INPUT');

    var headers = [
      'BreachID', 'CreatedDate', 'DiscoveryDate', 'Description',
      'Source', 'Status', 'NatureOfPhi', 'UnauthorizedPerson',
      'AcquiredOrViewed', 'MitigationSteps', 'AffectedIndividuals',
      'RiskAssessment', 'NotificationDeadline', 'NotificationDate',
      'HhsReportDate', 'RelatedEventType', 'InvestigatorEmail',
      'ResolutionDate', 'ResolutionNotes'
    ];
    var sheet = getOrCreateSheet('BreachLog', headers);
    var data = sheet.getDataRange().getValues();

    // Valid status transitions
    var validTransitions = {
      'Under Investigation': ['Confirmed', 'Not a Breach'],
      'Confirmed': ['Notified', 'Closed'],
      'Not a Breach': ['Closed'],
      'Notified': ['Closed']
    };

    var targetRow = -1;
    var currentStatus = '';
    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === breachId) {
        targetRow = r + 1; // 1-indexed for sheet operations
        currentStatus = data[r][5];
        break;
      }
    }

    if (targetRow === -1) throw new Error('NOT_FOUND');

    // Validate status transition if status is being updated
    if (updates.status) {
      var allowed = validTransitions[currentStatus] || [];
      if (allowed.indexOf(updates.status) === -1) {
        throw new Error('INVALID_STATE');
      }
    }

    // Map update fields to column indices
    var fieldMap = {
      'status': 5, 'natureOfPhi': 6, 'unauthorizedPerson': 7,
      'acquiredOrViewed': 8, 'mitigationSteps': 9, 'affectedIndividuals': 10,
      'riskAssessment': 11, 'notificationDate': 13, 'hhsReportDate': 14,
      'resolutionDate': 17, 'resolutionNotes': 18
    };

    for (var field in updates) {
      if (updates.hasOwnProperty(field) && fieldMap[field] !== undefined) {
        sheet.getRange(targetRow, fieldMap[field] + 1).setValue(updates[field]);
      }
    }

    dataAuditLog(user, 'update', 'breach_record', breachId, {
      previousStatus: currentStatus,
      newStatus: updates.status || currentStatus,
      fieldsUpdated: Object.keys(updates)
    });

    return {
      success: true,
      breachId: breachId,
      previousStatus: currentStatus,
      newStatus: updates.status || currentStatus
    };
  });
}

/**
 * Generates a breach report for a specified calendar year.
 * Per §164.408(c), this report must be submitted to HHS within 60 days
 * after the end of the calendar year for breaches affecting <500 individuals.
 *
 * @param {string} sessionToken — Admin session token
 * @param {number} [year] — Calendar year to report (defaults to previous year)
 * @returns {Object} { success, year, breaches: [...], totalBreaches, totalAffected }
 */
function getBreachReport(sessionToken, year) {
  return wrapHipaaOperation('getBreachReport', sessionToken, function(user) {
    checkPermission(user, 'admin', 'getBreachReport');

    var reportYear = year || (new Date().getFullYear() - 1);
    var yearStart = new Date(reportYear, 0, 1);
    var yearEnd = new Date(reportYear, 11, 31, 23, 59, 59);

    var headers = [
      'BreachID', 'CreatedDate', 'DiscoveryDate', 'Description',
      'Source', 'Status', 'NatureOfPhi', 'UnauthorizedPerson',
      'AcquiredOrViewed', 'MitigationSteps', 'AffectedIndividuals',
      'RiskAssessment', 'NotificationDeadline', 'NotificationDate',
      'HhsReportDate', 'RelatedEventType', 'InvestigatorEmail',
      'ResolutionDate', 'ResolutionNotes'
    ];
    var sheet = getOrCreateSheet('BreachLog', headers);
    var data = sheet.getDataRange().getValues();

    var breaches = [];
    var totalAffected = 0;

    for (var r = 1; r < data.length; r++) {
      var discoveryDate = data[r][2];
      var date = discoveryDate instanceof Date ? discoveryDate : new Date(discoveryDate);
      if (isNaN(date.getTime())) continue;

      if (date >= yearStart && date <= yearEnd) {
        var affected = parseInt(data[r][10], 10) || 0;
        totalAffected += affected;

        breaches.push({
          breachId: data[r][0],
          discoveryDate: date.toISOString(),
          description: data[r][3],
          status: data[r][5],
          natureOfPhi: data[r][6],
          affectedIndividuals: affected,
          riskAssessment: data[r][11],
          notificationDate: data[r][13] ? String(data[r][13]) : null,
          hhsReportDate: data[r][14] ? String(data[r][14]) : null
        });
      }
    }

    dataAuditLog(user, 'read', 'breach_report', 'year_' + reportYear, {
      breachCount: breaches.length,
      totalAffected: totalAffected
    });

    return {
      success: true,
      year: reportYear,
      breaches: breaches,
      totalBreaches: breaches.length,
      totalAffected: totalAffected,
      hhsDeadline: new Date(reportYear + 1, 1, 28).toISOString(), // Feb 28 of following year (approx 60 days)
      note: breaches.length === 0
        ? 'No breaches discovered during ' + reportYear + '. Annual HHS notification may still be required if prior-year breaches were not yet reported.'
        : 'Report ' + breaches.length + ' breach(es) affecting ' + totalAffected + ' individuals to HHS by ' + new Date(reportYear + 1, 1, 28).toISOString().split('T')[0]
    };
  });
}

/**
 * Returns all breaches within the HIPAA retention window (default 6 years),
 * with optional filtering by status, year, or date range.
 * Unlike getBreachReport() which filters by a single calendar year, this function
 * provides a comprehensive view of all breaches for the full retention period.
 *
 * @param {string} sessionToken — Admin session token
 * @param {Object} [options] — Optional filters: { status, year, startDate, endDate }
 * @returns {Object} { success, breaches: [...], totalBreaches, totalAffected, dateRange }
 */
function getBreachLog(sessionToken, options) {
  return wrapHipaaOperation('getBreachLog', sessionToken, function(user) {
    checkPermission(user, 'admin', 'getBreachLog');

    var opts = options || {};
    var cutoff = getRetentionCutoffDate();

    var headers = [
      'BreachID', 'CreatedDate', 'DiscoveryDate', 'Description',
      'Source', 'Status', 'NatureOfPhi', 'UnauthorizedPerson',
      'AcquiredOrViewed', 'MitigationSteps', 'AffectedIndividuals',
      'RiskAssessment', 'NotificationDeadline', 'NotificationDate',
      'HhsReportDate', 'RelatedEventType', 'InvestigatorEmail',
      'ResolutionDate', 'ResolutionNotes'
    ];
    var sheet = getOrCreateSheet('BreachLog', headers);
    var data = sheet.getDataRange().getValues();

    var breaches = [];
    var totalAffected = 0;
    var earliestDate = null;
    var latestDate = null;

    for (var r = 1; r < data.length; r++) {
      var discoveryDate = data[r][2];
      var date = discoveryDate instanceof Date ? discoveryDate : new Date(discoveryDate);
      if (isNaN(date.getTime())) continue;

      // Must be within retention window
      if (date < cutoff) continue;

      // Optional status filter
      if (opts.status && String(data[r][5]) !== opts.status) continue;

      // Optional year filter
      if (opts.year && date.getFullYear() !== parseInt(opts.year, 10)) continue;

      // Optional date range filter
      if (opts.startDate) {
        var start = new Date(opts.startDate);
        if (!isNaN(start.getTime()) && date < start) continue;
      }
      if (opts.endDate) {
        var end = new Date(opts.endDate);
        if (!isNaN(end.getTime()) && date > end) continue;
      }

      var affected = parseInt(data[r][10], 10) || 0;
      totalAffected += affected;

      if (!earliestDate || date < earliestDate) earliestDate = date;
      if (!latestDate || date > latestDate) latestDate = date;

      breaches.push({
        breachId: data[r][0],
        createdDate: data[r][1] instanceof Date ? data[r][1].toISOString() : String(data[r][1]),
        discoveryDate: date.toISOString(),
        description: data[r][3],
        source: data[r][4],
        status: data[r][5],
        natureOfPhi: data[r][6],
        unauthorizedPerson: data[r][7],
        affectedIndividuals: affected,
        riskAssessment: data[r][11],
        notificationDeadline: data[r][12] ? String(data[r][12]) : null,
        notificationDate: data[r][13] ? String(data[r][13]) : null,
        hhsReportDate: data[r][14] ? String(data[r][14]) : null,
        relatedEventType: data[r][15] || null,
        resolutionDate: data[r][17] ? String(data[r][17]) : null,
        resolutionNotes: data[r][18] || null
      });
    }

    dataAuditLog(user, 'read', 'breach_log', 'full_log', {
      breachCount: breaches.length,
      totalAffected: totalAffected,
      filters: opts
    });

    return {
      success: true,
      breaches: breaches,
      totalBreaches: breaches.length,
      totalAffected: totalAffected,
      dateRange: {
        from: earliestDate ? earliestDate.toISOString() : null,
        to: latestDate ? latestDate.toISOString() : null,
        retentionCutoff: cutoff.toISOString()
      }
    };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE B — P1: AMENDMENT NOTIFICATIONS (#24b)
// ═══════════════════════════════════════════════════════

/**
 * Sends amendment notifications to specified third parties after an amendment is approved.
 * Called by admin after approving an amendment via reviewAmendment().
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} amendmentId — The approved amendment's ID
 * @param {Array<Object>} recipients — Array of { email, name } objects to notify
 * @returns {Object} { success, notificationsSent, notificationsFailed }
 */
function sendAmendmentNotifications(sessionToken, amendmentId, recipients) {
  return wrapHipaaOperation('sendAmendmentNotifications', sessionToken, function(user) {
    checkPermission(user, 'admin', 'sendAmendmentNotifications');

    if (!amendmentId || !recipients || !recipients.length) {
      throw new Error('INVALID_INPUT');
    }

    // Verify the amendment exists and is Approved
    var amHeaders = [
      'AmendmentID', 'IndividualEmail', 'RecordID', 'RequestDate',
      'CurrentContent', 'ProposedChange', 'Reason', 'Status',
      'ReviewerEmail', 'DecisionDate', 'DecisionReason',
      'DisagreementStatement', 'DisagreementDate', 'Deadline', 'Notes'
    ];
    var amSheet = getOrCreateSheet('AmendmentRequests', amHeaders);
    var amData = amSheet.getDataRange().getValues();

    var amendment = null;
    for (var r = 1; r < amData.length; r++) {
      if (amData[r][0] === amendmentId) {
        amendment = {
          id: amData[r][0],
          individualEmail: amData[r][1],
          recordId: amData[r][2],
          status: amData[r][7],
          decisionDate: amData[r][9]
        };
        break;
      }
    }

    if (!amendment) throw new Error('NOT_FOUND');
    if (amendment.status !== 'Approved') {
      throw new Error('INVALID_STATE');
    }

    // Create notification records and send emails
    var notifHeaders = [
      'NotificationID', 'AmendmentID', 'IndividualEmail',
      'NotificationType', 'RecipientEmail', 'RecipientName',
      'Status', 'SentDate', 'CreatedDate', 'ErrorDetails'
    ];
    var notifSheet = getOrCreateSheet('AmendmentNotifications', notifHeaders);

    var sent = 0;
    var failed = 0;
    var results = [];

    for (var i = 0; i < recipients.length; i++) {
      var recipient = recipients[i];
      var notifId = generateRequestId('NOTIF');
      var createdDate = formatHipaaTimestamp();

      // Send the notification email
      var emailResult = sendHipaaEmail({
        to: recipient.email,
        subject: 'Amendment Notification — ' + amendmentId,
        body: 'Dear ' + (recipient.name || recipient.email) + ',\n\n'
          + 'This notice is to inform you that a correction has been made to protected health '
          + 'information (PHI) that was previously disclosed to your organization.\n\n'
          + 'Amendment Reference: ' + amendmentId + '\n'
          + 'Date of Amendment Approval: ' + String(amendment.decisionDate) + '\n'
          + 'Record Affected: ' + amendment.recordId + '\n\n'
          + 'The correction has been approved and appended to the individual\'s designated record set. '
          + 'If you have previously relied on the disclosed information, please contact us to obtain '
          + 'the corrected information.\n\n'
          + 'This notification is provided in accordance with HIPAA §164.526(c)(3).',
        emailType: 'amendment_notification',
        triggeredBy: user.email,
        metadata: {
          amendmentId: amendmentId,
          recipientName: recipient.name,
          notificationId: notifId
        }
      });

      var status = emailResult.success ? 'Sent' : 'Failed';
      var sentDate = emailResult.success ? formatHipaaTimestamp() : '';
      var errorDetails = emailResult.success ? '' : (emailResult.error || 'Unknown error');

      notifSheet.appendRow([
        notifId, amendmentId, amendment.individualEmail,
        'ThirdPartyCorrection', recipient.email, recipient.name || '',
        status, sentDate, createdDate, errorDetails
      ]);

      if (emailResult.success) {
        sent++;
      } else {
        failed++;
      }

      results.push({
        notificationId: notifId,
        recipientEmail: recipient.email,
        status: status
      });
    }

    dataAuditLog(user, 'create', 'amendment_notifications', amendmentId, {
      recipientCount: recipients.length,
      sent: sent,
      failed: failed
    });

    return {
      success: true,
      amendmentId: amendmentId,
      notificationsSent: sent,
      notificationsFailed: failed,
      results: results
    };
  });
}

/**
 * Returns the notification history for a specific amendment.
 * Used by the admin review panel to show notification status.
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} amendmentId — The amendment to query notifications for
 * @returns {Object} { success, notifications: [...] }
 */
function getNotificationStatus(sessionToken, amendmentId) {
  return wrapHipaaOperation('getNotificationStatus', sessionToken, function(user) {
    checkPermission(user, 'admin', 'getNotificationStatus');

    if (!amendmentId) throw new Error('INVALID_INPUT');

    var notifHeaders = [
      'NotificationID', 'AmendmentID', 'IndividualEmail',
      'NotificationType', 'RecipientEmail', 'RecipientName',
      'Status', 'SentDate', 'CreatedDate', 'ErrorDetails'
    ];
    var sheet = getOrCreateSheet('AmendmentNotifications', notifHeaders);
    var data = sheet.getDataRange().getValues();

    var notifications = [];
    for (var r = 1; r < data.length; r++) {
      if (data[r][1] === amendmentId) {
        notifications.push({
          notificationId: data[r][0],
          notificationType: data[r][3],
          recipientEmail: data[r][4],
          recipientName: data[r][5],
          status: data[r][6],
          sentDate: data[r][7] ? String(data[r][7]) : null,
          createdDate: String(data[r][8]),
          errorDetails: data[r][9] || null
        });
      }
    }

    return {
      success: true,
      amendmentId: amendmentId,
      notifications: notifications,
      count: notifications.length
    };
  });
}

/**
 * Returns disclosure recipients who received PHI related to a specific record.
 * Helps admin identify who needs to be notified of an amendment.
 * Searches DisclosureLog for disclosures mentioning the record ID in PHIDescription.
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} recordId — The record that was amended
 * @returns {Object} { success, recipients: [{ email, name, lastDisclosureDate }] }
 */
function getDisclosureRecipientsForRecord(sessionToken, recordId) {
  return wrapHipaaOperation('getDisclosureRecipientsForRecord', sessionToken, function(user) {
    checkPermission(user, 'admin', 'getDisclosureRecipientsForRecord');

    if (!recordId) throw new Error('INVALID_INPUT');

    var headers = [
      'Timestamp', 'DisclosureID', 'IndividualEmail', 'RecipientName',
      'RecipientType', 'PHIDescription', 'Purpose', 'IsExempt',
      'ExemptionType', 'DataCategory', 'Source', 'TriggeredBy'
    ];
    var sheet = getOrCreateSheet('DisclosureLog', headers);
    var data = sheet.getDataRange().getValues();

    var recipientMap = {};
    for (var r = 1; r < data.length; r++) {
      var phiDesc = String(data[r][5] || '');
      if (phiDesc.indexOf(recordId) === -1) continue;

      var recipientName = String(data[r][3] || '');
      var recipientKey = recipientName.toLowerCase();

      if (!recipientMap[recipientKey]) {
        recipientMap[recipientKey] = {
          name: recipientName,
          recipientType: data[r][4],
          lastDisclosureDate: data[r][0]
        };
      } else {
        var existingDate = recipientMap[recipientKey].lastDisclosureDate;
        var newDate = data[r][0];
        if (newDate > existingDate) {
          recipientMap[recipientKey].lastDisclosureDate = newDate;
        }
      }
    }

    var recipients = [];
    for (var key in recipientMap) {
      if (recipientMap.hasOwnProperty(key)) {
        var rec = recipientMap[key];
        recipients.push({
          name: rec.name,
          recipientType: rec.recipientType,
          lastDisclosureDate: rec.lastDisclosureDate instanceof Date
            ? rec.lastDisclosureDate.toISOString()
            : String(rec.lastDisclosureDate)
        });
      }
    }

    return {
      success: true,
      recordId: recordId,
      recipients: recipients,
      count: recipients.length
    };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE B — P1: SUMMARY PHI EXPORT (#23b)
// ═══════════════════════════════════════════════════════

/**
 * Generates a metadata-only summary of the individual's designated record set.
 * Per §164.524(c)(3).
 */
function generateDataSummary(sessionToken, targetEmail) {
  return wrapHipaaOperation('generateDataSummary', sessionToken, function(user) {
    var email = targetEmail || user.email;
    validateIndividualAccess(user, email, 'generateDataSummary');
    checkPermission(user, 'export', 'generateDataSummary');

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var sheetsToScan = ['Live_Sheet', 'DisclosureLog', 'AccessRequests', 'AmendmentRequests'];
    var summary = {
      recordTypes: [],
      countPerType: {},
      dateRange: { earliest: null, latest: null },
      totalRecords: 0,
      lastUpdated: null,
      dataCategories: [],
      exportFormatsAvailable: ['json', 'csv']
    };

    var categoryMap = {
      'Live_Sheet': 'Treatment notes',
      'DisclosureLog': 'Disclosure records',
      'AccessRequests': 'Access request history',
      'AmendmentRequests': 'Amendment request history'
    };

    for (var s = 0; s < sheetsToScan.length; s++) {
      var sheetName = sheetsToScan[s];
      var sheet = ss.getSheetByName(sheetName);
      if (!sheet) continue;

      var data = sheet.getDataRange().getValues();
      if (data.length <= 1) continue;

      var headers = data[0];
      var emailColIdx = -1;
      var timestampColIdx = -1;

      for (var h = 0; h < headers.length; h++) {
        var hdr = String(headers[h]).toLowerCase();
        if (hdr.indexOf('email') > -1 && emailColIdx === -1) emailColIdx = h;
        if ((hdr === 'timestamp' || hdr === 'requestdate' || hdr === 'date') && timestampColIdx === -1) timestampColIdx = h;
      }

      var count = 0;
      for (var r = 1; r < data.length; r++) {
        var rowEmail = emailColIdx >= 0 ? String(data[r][emailColIdx] || '').toLowerCase() : '';
        if (emailColIdx >= 0 && rowEmail !== email.toLowerCase()) continue;

        count++;

        if (timestampColIdx >= 0) {
          var ts = data[r][timestampColIdx];
          var date = ts instanceof Date ? ts : new Date(ts);
          if (!isNaN(date.getTime())) {
            if (!summary.dateRange.earliest || date < new Date(summary.dateRange.earliest)) {
              summary.dateRange.earliest = date.toISOString();
            }
            if (!summary.dateRange.latest || date > new Date(summary.dateRange.latest)) {
              summary.dateRange.latest = date.toISOString();
              summary.lastUpdated = date.toISOString();
            }
          }
        }
      }

      if (count > 0) {
        summary.recordTypes.push(sheetName);
        summary.countPerType[sheetName] = count;
        summary.totalRecords += count;
        if (categoryMap[sheetName]) {
          summary.dataCategories.push(categoryMap[sheetName]);
        }
      }
    }

    dataAuditLog(user, 'summary_export', 'designated_record_set', email, {
      recordTypes: summary.recordTypes,
      totalRecords: summary.totalRecords,
      note: 'Summary only — no PHI content included'
    });

    var arHeaders = [
      'RequestID', 'IndividualEmail', 'RequestDate', 'Format',
      'Status', 'ResponseDate', 'Notes'
    ];
    var arSheet = getOrCreateSheet('AccessRequests', arHeaders);
    var requestId = generateRequestId('ACCESS');
    arSheet.appendRow([
      requestId, email, formatHipaaTimestamp(), 'summary',
      'Completed', formatHipaaTimestamp(), 'Summary export generated'
    ]);

    return {
      success: true,
      requestId: requestId,
      summary: summary,
      fee: '$0 (electronic self-service)',
      notice: 'This is a summary of your records. For the complete designated record set, request a full JSON or CSV export.'
    };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE B — P1: GROUPED DISCLOSURE ACCOUNTING (#19b)
// ═══════════════════════════════════════════════════════

/**
 * Returns a grouped disclosure accounting for the authenticated individual.
 * Per §164.528(b)(2)(ii).
 */
function getGroupedDisclosureAccounting(sessionToken, targetEmail) {
  return wrapHipaaOperation('getGroupedDisclosureAccounting', sessionToken, function(user) {
    var email = targetEmail || user.email;
    validateIndividualAccess(user, email, 'getGroupedDisclosureAccounting');

    var headers = [
      'Timestamp', 'DisclosureID', 'IndividualEmail', 'RecipientName',
      'RecipientType', 'PHIDescription', 'Purpose', 'IsExempt',
      'ExemptionType', 'DataCategory', 'Source', 'TriggeredBy'
    ];
    var sheet = getOrCreateSheet('DisclosureLog', headers);
    var data = sheet.getDataRange().getValues();

    var sixYearsAgo = new Date();
    sixYearsAgo.setFullYear(sixYearsAgo.getFullYear() - 6);

    var rawDisclosures = [];
    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      var indEmail = String(row[2] || '').toLowerCase();
      var isExempt = row[7] === true || row[7] === 'TRUE' || row[7] === 'true';
      var timestamp = row[0];

      if (indEmail !== email.toLowerCase()) continue;
      if (isExempt) continue;

      var discDate = timestamp instanceof Date ? timestamp : new Date(timestamp);
      if (discDate < sixYearsAgo) continue;

      rawDisclosures.push({
        timestamp: discDate,
        disclosureId: row[1],
        recipientName: row[3],
        recipientType: row[4],
        phiDescription: row[5],
        purpose: row[6]
      });
    }

    rawDisclosures.sort(function(a, b) { return a.timestamp - b.timestamp; });

    var groups = {};
    for (var i = 0; i < rawDisclosures.length; i++) {
      var disc = rawDisclosures[i];
      var groupKey = disc.recipientName + '||' + disc.purpose;

      if (!groups[groupKey]) {
        groups[groupKey] = {
          recipientName: disc.recipientName,
          recipientType: disc.recipientType,
          purpose: disc.purpose,
          phiDescription: disc.phiDescription,
          firstDisclosureId: disc.disclosureId,
          firstDate: disc.timestamp.toISOString(),
          lastDate: disc.timestamp.toISOString(),
          count: 1
        };
      } else {
        groups[groupKey].lastDate = disc.timestamp.toISOString();
        groups[groupKey].count++;
      }
    }

    var grouped = [];
    for (var key in groups) {
      if (groups.hasOwnProperty(key)) {
        grouped.push(groups[key]);
      }
    }
    grouped.sort(function(a, b) { return new Date(b.firstDate) - new Date(a.firstDate); });

    dataAuditLog(user, 'read', 'grouped_disclosure_accounting', email, {
      totalRawDisclosures: rawDisclosures.length,
      groupedEntries: grouped.length
    });

    return {
      success: true,
      disclosures: grouped,
      totalDisclosures: rawDisclosures.length,
      groupedCount: grouped.length
    };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE B — SHARED UTILITIES
// ═══════════════════════════════════════════════════════

/**
 * Alias for wrapPhaseAOperation() — Phase B uses the same error handling pattern.
 * All HIPAA operations (Phase A, B, and future) share the same session validation
 * and error response structure.
 */
var wrapHipaaOperation = wrapPhaseAOperation;

/**
 * Sends an email via MailApp with HIPAA-compliant formatting and audit logging.
 * Centralized to ensure all outgoing emails are tracked and rate-limited.
 */
function sendHipaaEmail(params) {
  var required = ['to', 'subject', 'body', 'emailType', 'triggeredBy'];
  for (var i = 0; i < required.length; i++) {
    if (!params[required[i]]) {
      throw new Error('INVALID_INPUT');
    }
  }

  // Rate limiting: check cooldown per emailType + recipient
  var cache = getEpochCache();
  var cooldownKey = 'email_cooldown_' + params.emailType + '_' + params.to;
  if (cache.get(cooldownKey)) {
    auditLog('email_rate_limited', params.triggeredBy, 'skipped', {
      emailType: params.emailType,
      to: params.to,
      reason: 'cooldown_active'
    });
    return { success: false, error: 'RATE_LIMITED', message: 'Email cooldown active for this recipient and type.' };
  }

  try {
    var emailOptions = {
      to: params.to,
      subject: params.subject,
      body: params.body
    };
    if (params.htmlBody) {
      emailOptions.htmlBody = params.htmlBody;
    }

    MailApp.sendEmail(emailOptions);

    // Set cooldown
    var cooldownMinutes = params.emailType === 'breach_alert'
      ? BREACH_ALERT_CONFIG.ALERT_COOLDOWN_MINUTES
      : 5;
    cache.put(cooldownKey, 'sent', cooldownMinutes * 60);

    var messageId = generateRequestId('EMAIL');

    auditLog('hipaa_email_sent', params.triggeredBy, 'success', {
      messageId: messageId,
      emailType: params.emailType,
      to: params.to,
      subject: params.subject,
      metadata: params.metadata || {}
    });

    return { success: true, messageId: messageId };
  } catch (e) {
    auditLog('hipaa_email_failed', params.triggeredBy, 'error', {
      emailType: params.emailType,
      to: params.to,
      error: e.message
    });
    return { success: false, error: 'EMAIL_FAILED', message: 'Failed to send email.' };
  }
}

// ═══════════════════════════════════════════════════════
// HIPAA COMPLIANCE — Phase C: Data Governance
// ═══════════════════════════════════════════════════════

function getRetentionCutoffDate(retentionYears) {
  var years = retentionYears || HIPAA_RETENTION_CONFIG.RETENTION_YEARS
    || AUTH_CONFIG.AUDIT_LOG_RETENTION_YEARS || 6;
  var cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - years);
  return cutoff;
}

/**
 * Checks whether a user is an authorized personal representative for a target individual.
 */
function isRepresentativeAuthorized(representativeEmail, individualEmail) {
  var headers = [
    'RepresentativeID', 'RepresentativeEmail', 'IndividualEmail',
    'RelationshipType', 'AuthorizationDate', 'ExpirationDate',
    'Status', 'ApprovalStatus', 'ApprovedBy', 'ApprovalDate',
    'DocumentReference', 'Notes'
  ];
  var sheet = getOrCreateSheet('PersonalRepresentatives', headers);
  var data = sheet.getDataRange().getValues();

  var now = new Date();
  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    var repEmail = String(row[1] || '').toLowerCase();
    var indEmail = String(row[2] || '').toLowerCase();
    var status = String(row[6] || '');
    var approvalStatus = String(row[7] || '');
    var expirationDate = row[5];

    if (repEmail === representativeEmail.toLowerCase()
        && indEmail === individualEmail.toLowerCase()
        && status === 'Active'
        && approvalStatus === 'Approved') {
      if (expirationDate && expirationDate instanceof Date && expirationDate < now) {
        continue;
      }
      return {
        representativeId: row[0],
        relationshipType: row[3],
        authorizationDate: row[4],
        expirationDate: expirationDate,
        documentReference: row[10]
      };
    }
  }

  return null;
}

// ══════════════════════════════════════════════════════════════
// PHASE C — RETENTION ENFORCEMENT EXTENSIONS
// §164.316(b)(2)(i), §164.312(c)(1-2), §164.308(a)(8), FRCP 37(e)
// ══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════
// PHASE C — LEGAL HOLD QUERY FUNCTIONS
// ═══════════════════════════════════════════════════════

/**
 * Checks whether a specific sheet (and optionally a date range) is under
 * an active legal hold. Called by enforceRetention() before archiving.
 *
 * @param {string} sheetName — Name of the sheet to check
 * @param {Date} [recordDate] — Date of the specific record being checked
 * @returns {Object|null} The active hold object if under hold, null otherwise
 */
function checkLegalHold(sheetName, recordDate) {
  if (!LEGAL_HOLD_CONFIG.ENABLED) return null;

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var holdSheet = ss.getSheetByName('LegalHolds');
  if (!holdSheet) return null;

  var data = holdSheet.getDataRange().getValues();
  var now = new Date();

  for (var r = 1; r < data.length; r++) {
    var row = data[r];
    if (String(row[1]) !== sheetName) continue;
    if (row[10] !== 'Active') continue;

    // Check expiration
    if (row[9] && new Date(row[9]) < now) {
      holdSheet.getRange(r + 1, 11).setValue('Expired');
      auditLog('legal_hold_expired', 'system', 'auto_expired', {
        holdId: row[0], sheetName: sheetName
      });
      continue;
    }

    // Check date range (if hold has a date range and record has a date)
    if (recordDate && row[5] && row[6]) {
      var holdStart = new Date(row[5]);
      var holdEnd = new Date(row[6]);
      if (recordDate < holdStart || recordDate > holdEnd) {
        continue;
      }
    }

    return {
      holdId: row[0],
      sheetName: row[1],
      holdType: row[2],
      reason: row[3],
      caseReference: row[4]
    };
  }

  return null;
}

/**
 * Returns all legal holds, optionally filtered by sheet name and/or status.
 *
 * @param {string} sessionToken — Admin session token
 * @param {Object} [filters] — { sheetName?, status? }
 * @returns {Object} { success, holds: [...], count }
 */
function getLegalHolds(sessionToken, filters) {
  return wrapRetentionOperation('getLegalHolds', sessionToken, function(user) {
    checkPermission(user, 'admin', 'getLegalHolds');

    filters = filters || {};
    var headers = [
      'HoldID', 'SheetName', 'HoldType', 'Reason', 'CaseReference',
      'StartDate', 'EndDate', 'PlacedBy', 'PlacedDate', 'ExpirationDate',
      'Status', 'ReleasedBy', 'ReleasedDate', 'ReleaseReason'
    ];
    var sheet = getOrCreateSheet('LegalHolds', headers);
    var data = sheet.getDataRange().getValues();
    var holds = [];

    for (var r = 1; r < data.length; r++) {
      var row = data[r];
      if (filters.sheetName && String(row[1]) !== filters.sheetName) continue;
      if (filters.status && row[10] !== filters.status) continue;

      holds.push({
        holdId: row[0],
        sheetName: row[1],
        holdType: row[2],
        reason: row[3],
        caseReference: row[4],
        startDate: row[5],
        endDate: row[6],
        placedBy: row[7],
        placedDate: row[8],
        expirationDate: row[9],
        status: row[10],
        releasedBy: row[11],
        releasedDate: row[12],
        releaseReason: row[13]
      });
    }

    holds.sort(function(a, b) {
      return new Date(b.placedDate) - new Date(a.placedDate);
    });

    dataAuditLog(user, 'read', 'legal_holds', 'query', {
      filters: JSON.stringify(filters),
      resultCount: holds.length
    });

    return {
      success: true,
      holds: holds,
      count: holds.length
    };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE C — LEGAL HOLD FUNCTIONS
// ═══════════════════════════════════════════════════════

/**
 * Places a legal hold on a specific sheet, preventing records within
 * the specified date range from being archived by enforceRetention().
 * §164.316(b)(2)(i) + FRCP Rule 37(e)
 *
 * @param {string} sessionToken — Admin session token
 * @param {Object} params — { sheetName, holdType, reason, startDate?, endDate?, caseReference?, expirationDate? }
 * @returns {Object} { success, holdId, sheetName, holdType, status }
 */
function placeLegalHold(sessionToken, params) {
  return wrapRetentionOperation('placeLegalHold', sessionToken, function(user) {
    checkPermission(user, 'admin', 'placeLegalHold');

    if (!params || !params.sheetName || !params.holdType || !params.reason) {
      throw new Error('INVALID_INPUT');
    }

    // Validate sheet name is in protected list
    var allProtected = HIPAA_RETENTION_CONFIG.SHEETS_TO_PROTECT.slice();
    if (LEGAL_HOLD_CONFIG.ALLOW_ARCHIVE_HOLDS) {
      for (var i = 0; i < HIPAA_RETENTION_CONFIG.SHEETS_TO_PROTECT.length; i++) {
        allProtected.push(HIPAA_RETENTION_CONFIG.SHEETS_TO_PROTECT[i]
          + HIPAA_RETENTION_CONFIG.ARCHIVE_SHEET_SUFFIX);
      }
    }
    if (allProtected.indexOf(params.sheetName) === -1) {
      return {
        success: false,
        error: 'INVALID_SHEET',
        message: 'Sheet "' + escapeHtml(params.sheetName) + '" is not a HIPAA-protected sheet.'
      };
    }

    // Validate hold type
    if (LEGAL_HOLD_CONFIG.HOLD_TYPES.indexOf(params.holdType) === -1) {
      throw new Error('INVALID_INPUT');
    }

    // Check hold limit
    var headers = [
      'HoldID', 'SheetName', 'HoldType', 'Reason', 'CaseReference',
      'StartDate', 'EndDate', 'PlacedBy', 'PlacedDate', 'ExpirationDate',
      'Status', 'ReleasedBy', 'ReleasedDate', 'ReleaseReason'
    ];
    var sheet = getOrCreateSheet('LegalHolds', headers);
    var data = sheet.getDataRange().getValues();
    var activeHoldsForSheet = 0;

    for (var r = 1; r < data.length; r++) {
      if (String(data[r][1]) === params.sheetName && data[r][10] === 'Active') {
        activeHoldsForSheet++;
      }
    }

    if (activeHoldsForSheet >= LEGAL_HOLD_CONFIG.MAX_HOLDS_PER_SHEET) {
      return {
        success: false,
        error: 'LIMIT_EXCEEDED',
        message: 'Maximum ' + LEGAL_HOLD_CONFIG.MAX_HOLDS_PER_SHEET
          + ' active holds per sheet. Release an existing hold first.'
      };
    }

    var holdId = generateRequestId('HOLD');
    var timestamp = formatHipaaTimestamp();

    var row = [
      holdId,
      params.sheetName,
      params.holdType,
      params.reason,
      params.caseReference || '',
      params.startDate || '',
      params.endDate || '',
      user.email,
      timestamp,
      params.expirationDate || '',
      'Active',
      '',  // ReleasedBy
      '',  // ReleasedDate
      ''   // ReleaseReason
    ];
    sheet.appendRow(row);

    dataAuditLog(user, 'create', 'legal_hold', holdId, {
      sheetName: params.sheetName,
      holdType: params.holdType,
      reason: params.reason,
      dateRange: (params.startDate || 'beginning') + ' to ' + (params.endDate || 'present')
    });

    // Optional notification
    var notifyEmail = getHoldNotificationEmail();
    if (notifyEmail) {
      sendHipaaEmail({
        to: notifyEmail,
        subject: 'Legal Hold Placed — ' + params.sheetName,
        body: 'Hold ID: ' + holdId + '\n'
          + 'Sheet: ' + params.sheetName + '\n'
          + 'Type: ' + params.holdType + '\n'
          + 'Reason: ' + params.reason + '\n'
          + 'Placed by: ' + user.email + '\n'
          + 'Date: ' + timestamp,
        emailType: 'legal_hold',
        triggeredBy: user.email
      });
    }

    return {
      success: true,
      holdId: holdId,
      sheetName: params.sheetName,
      holdType: params.holdType,
      status: 'Active'
    };
  });
}

/**
 * Releases an active legal hold, allowing the previously held records
 * to be processed by the next enforceRetention() trigger run.
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} holdId — ID of the hold to release
 * @param {string} reason — Reason for releasing the hold
 * @returns {Object} { success, holdId, status }
 */
function releaseLegalHold(sessionToken, holdId, reason) {
  return wrapRetentionOperation('releaseLegalHold', sessionToken, function(user) {
    checkPermission(user, 'admin', 'releaseLegalHold');

    if (!holdId || !reason) {
      throw new Error('INVALID_INPUT');
    }

    var headers = [
      'HoldID', 'SheetName', 'HoldType', 'Reason', 'CaseReference',
      'StartDate', 'EndDate', 'PlacedBy', 'PlacedDate', 'ExpirationDate',
      'Status', 'ReleasedBy', 'ReleasedDate', 'ReleaseReason'
    ];
    var sheet = getOrCreateSheet('LegalHolds', headers);
    var data = sheet.getDataRange().getValues();

    for (var r = 1; r < data.length; r++) {
      if (data[r][0] === holdId) {
        if (data[r][10] !== 'Active') {
          return {
            success: false,
            error: 'INVALID_STATE',
            message: 'Hold ' + holdId + ' is not active (current status: ' + data[r][10] + ').'
          };
        }

        var timestamp = formatHipaaTimestamp();
        sheet.getRange(r + 1, 11).setValue('Released');
        sheet.getRange(r + 1, 12).setValue(user.email);
        sheet.getRange(r + 1, 13).setValue(timestamp);
        sheet.getRange(r + 1, 14).setValue(reason);

        dataAuditLog(user, 'update', 'legal_hold', holdId, {
          action: 'released',
          sheetName: data[r][1],
          releaseReason: reason
        });

        var notifyEmail = getHoldNotificationEmail();
        if (notifyEmail) {
          sendHipaaEmail({
            to: notifyEmail,
            subject: 'Legal Hold Released — ' + data[r][1],
            body: 'Hold ID: ' + holdId + '\n'
              + 'Sheet: ' + data[r][1] + '\n'
              + 'Released by: ' + user.email + '\n'
              + 'Reason: ' + reason + '\n'
              + 'Date: ' + timestamp,
            emailType: 'legal_hold',
            triggeredBy: user.email
          });
        }

        return {
          success: true,
          holdId: holdId,
          status: 'Released'
        };
      }
    }

    throw new Error('NOT_FOUND');
  });
}

// ═══════════════════════════════════════════════════════
// PHASE C — RETENTION POLICY DOCUMENTATION
// ═══════════════════════════════════════════════════════

/**
 * Generates a formal retention policy document based on live system configuration.
 * §164.316(b)(1) — Documentation (Required)
 * §164.316(b)(2)(ii) — Availability (Required)
 *
 * @param {string} sessionToken — Admin session token
 * @returns {Object} { success, document: { sections: [...] }, generatedAt }
 */
function getRetentionPolicyDocument(sessionToken) {
  return wrapRetentionOperation('getRetentionPolicyDocument', sessionToken, function(user) {
    checkPermission(user, 'admin', 'getRetentionPolicyDocument');

    var timestamp = formatHipaaTimestamp();
    var retentionYears = HIPAA_RETENTION_CONFIG.RETENTION_YEARS || 6;
    var sheetsProtected = HIPAA_RETENTION_CONFIG.SHEETS_TO_PROTECT;

    var latestAudit = null;
    try {
      var auditResult = auditRetentionCompliance(sessionToken);
      if (auditResult.success) latestAudit = auditResult.report;
    } catch (e) { /* Non-fatal */ }

    var legalHolds = [];
    try {
      var holdResult = getLegalHolds(sessionToken, { status: 'Active' });
      if (holdResult.success) legalHolds = holdResult.holds;
    } catch (e) { /* Non-fatal */ }

    var document = {
      title: 'HIPAA Record Retention Policy — testauthgas1',
      version: '1.0',
      generatedAt: timestamp,
      generatedBy: user.email,
      regulatoryBasis: '45 CFR §164.316(b)(2)(i)',
      sections: [
        {
          heading: '1. Purpose',
          content: 'This document establishes the record retention policy for the testauthgas1 '
            + 'environment, as required by the HIPAA Security Rule §164.316(b). It defines '
            + 'retention periods, enforcement mechanisms, and exception handling procedures '
            + 'for all electronic protected health information (ePHI) and security documentation.'
        },
        {
          heading: '2. Scope',
          content: 'This policy applies to all electronic records maintained in the testauthgas1 '
            + 'Project Data Spreadsheet, including but not limited to:',
          items: sheetsProtected.map(function(name) {
            return name + ' — protected, ' + retentionYears + '-year retention';
          })
        },
        {
          heading: '3. Retention Period',
          content: 'All records identified in Section 2 shall be retained for a minimum of '
            + retentionYears + ' years from the date of creation or the date when the record '
            + 'last was in effect, whichever is later, per §164.316(b)(2)(i). Records subject '
            + 'to a legal hold (Section 6) shall be retained beyond the standard retention period '
            + 'until the hold is released.'
        },
        {
          heading: '4. Enforcement Mechanism',
          content: 'Retention is enforced by an automated daily trigger (enforceRetention()) '
            + 'that executes at 2:00 AM EST. The trigger: (1) verifies sheet-level protection '
            + 'on all covered sheets, (2) identifies records older than the retention cutoff, '
            + '(3) checks for active legal holds, (4) archives eligible records to protected '
            + 'archive sheets (*_Archive), (5) computes integrity checksums for archived batches, '
            + 'and (6) logs all actions to the SessionAuditLog.',
          details: {
            triggerSchedule: 'Daily at 2:00 AM EST',
            batchSize: HIPAA_RETENTION_CONFIG.BATCH_SIZE,
            protectionLevel: HIPAA_RETENTION_CONFIG.PROTECTION_LEVEL,
            archiveSuffix: HIPAA_RETENTION_CONFIG.ARCHIVE_SHEET_SUFFIX
          }
        },
        {
          heading: '5. Archive Integrity',
          content: 'Archived records are protected by SHA-256 checksums computed at archival '
            + 'time and stored in the RetentionIntegrityLog sheet. Integrity can be verified '
            + 'on demand or via automated audit. Any discrepancy between stored and recomputed '
            + 'checksums indicates potential tampering or corruption and triggers a CRITICAL finding.'
        },
        {
          heading: '6. Legal Hold Exceptions',
          content: 'Records subject to active legal holds are exempt from routine archival. '
            + 'Legal holds may be placed by admin-role users for litigation, regulatory investigation, '
            + 'internal investigation, audit, or preservation purposes. Holds may cover entire sheets '
            + 'or specific date ranges within a sheet.',
          activeHolds: legalHolds.length,
          holdDetails: legalHolds.map(function(h) {
            return h.holdId + ': ' + h.sheetName + ' (' + h.holdType + ') — ' + h.reason;
          })
        },
        {
          heading: '7. Compliance Monitoring',
          content: 'Retention compliance is audited weekly by an automated trigger '
            + '(auditRetentionCompliance()) that evaluates sheet protection status, record counts, '
            + 'archival completeness, legal hold coverage, and audit trail continuity. Audit reports '
            + 'are retained as organizational compliance artifacts.',
          latestAudit: latestAudit ? {
            auditId: latestAudit.auditId,
            date: latestAudit.timestamp,
            status: latestAudit.overallStatus,
            findings: latestAudit.findings.length
          } : 'No audit data available'
        },
        {
          heading: '8. Destruction Prohibited',
          content: 'No record within the retention period shall be destroyed, deleted, or made '
            + 'inaccessible, except through the automated archival process described in Section 4. '
            + 'Manual deletion of HIPAA-protected records is prohibited and will trigger a warning '
            + 'dialog (sheet protection level: ' + HIPAA_RETENTION_CONFIG.PROTECTION_LEVEL + '). '
            + 'All deletion attempts are logged.'
        },
        {
          heading: '9. Responsible Parties',
          content: 'The system administrator (admin role) is responsible for: (1) ensuring the '
            + 'retention trigger is installed and operational, (2) placing and releasing legal holds '
            + 'as needed, (3) reviewing weekly compliance audit reports, (4) verifying archive '
            + 'integrity, and (5) generating and distributing this policy document to relevant parties '
            + 'per §164.316(b)(2)(ii).'
        },
        {
          heading: '10. Policy Review',
          content: 'This policy shall be reviewed and updated per §164.316(b)(2)(iii) in response '
            + 'to: (1) changes in the regulatory environment (new HIPAA rules, state law changes), '
            + '(2) changes in the operating environment (new data types, new sheets, new functionality), '
            + '(3) security incidents that reveal retention gaps, or (4) organizational changes '
            + '(new staff, new roles, new BAA requirements). This document is auto-generated from '
            + 'live system configuration — regenerate it after any configuration change to ensure '
            + 'the policy reflects the current implementation.'
        }
      ]
    };

    dataAuditLog(user, 'generate', 'retention_policy_document', document.version, {
      sectionsGenerated: document.sections.length,
      sheetsDocumented: sheetsProtected.length,
      activeHolds: legalHolds.length
    });

    return { success: true, document: document, generatedAt: timestamp };
  });
}

/**
 * Exports the retention policy document as formatted text or JSON.
 * §164.316(b)(2)(ii) — Make documentation available
 *
 * @param {string} sessionToken — Admin session token
 * @param {string} [format='text'] — 'text' or 'json'
 * @returns {Object} { success, format, data, filename }
 */
function exportRetentionPolicy(sessionToken, format) {
  return wrapRetentionOperation('exportRetentionPolicy', sessionToken, function(user) {
    checkPermission(user, 'admin', 'exportRetentionPolicy');

    var policyResult = getRetentionPolicyDocument(sessionToken);
    if (!policyResult.success) return policyResult;

    var doc = policyResult.document;
    format = (format || 'text').toLowerCase();
    var dateStr = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');
    var filename = 'hipaa-retention-policy-' + dateStr;

    if (format === 'json') {
      return {
        success: true,
        format: 'json',
        data: JSON.stringify(doc, null, 2),
        filename: filename + '.json'
      };
    }

    var lines = [
      '════════════════════════════════════════════════════════════════',
      '',
      '  ' + doc.title,
      '',
      '  Generated: ' + doc.generatedAt,
      '  Generated by: ' + doc.generatedBy,
      '  Regulatory basis: ' + doc.regulatoryBasis,
      '  Document version: ' + doc.version,
      '',
      '════════════════════════════════════════════════════════════════',
      ''
    ];

    for (var i = 0; i < doc.sections.length; i++) {
      var section = doc.sections[i];
      lines.push(section.heading);
      lines.push('');
      lines.push(section.content);

      if (section.items) {
        lines.push('');
        for (var j = 0; j < section.items.length; j++) {
          lines.push('  • ' + section.items[j]);
        }
      }

      if (section.holdDetails && section.holdDetails.length > 0) {
        lines.push('');
        lines.push('  Active holds (' + section.activeHolds + '):');
        for (var k = 0; k < section.holdDetails.length; k++) {
          lines.push('    ' + section.holdDetails[k]);
        }
      }

      if (section.latestAudit && typeof section.latestAudit === 'object') {
        lines.push('');
        lines.push('  Latest audit: ' + section.latestAudit.auditId
          + ' (' + section.latestAudit.date + ') — ' + section.latestAudit.status
          + ', ' + section.latestAudit.findings + ' finding(s)');
      }

      if (section.details) {
        lines.push('');
        for (var key in section.details) {
          lines.push('  ' + key + ': ' + section.details[key]);
        }
      }

      lines.push('');
      lines.push('─────────────────────────────────────────');
      lines.push('');
    }

    return {
      success: true,
      format: 'text',
      data: lines.join('\n'),
      filename: filename + '.txt'
    };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE C — ARCHIVE INTEGRITY VERIFICATION
// ═══════════════════════════════════════════════════════

/**
 * Computes and stores a checksum for a batch of archived records.
 * Called by enforceRetention() after moving rows to the archive sheet.
 * §164.312(c)(1) — Integrity controls
 *
 * @param {string} sheetName — Source sheet name (e.g. 'SessionAuditLog')
 * @param {Array[]} archivedRows — The rows that were just archived
 * @param {number} archiveStartRow — Starting row number in the archive sheet
 * @param {number} archiveEndRow — Ending row number in the archive sheet
 */
function computeArchiveChecksum(sheetName, archivedRows, archiveStartRow, archiveEndRow) {
  if (!INTEGRITY_CONFIG) return;

  var checksum = computeRowsChecksum(archivedRows);
  var timestamp = formatHipaaTimestamp();

  var headers = [
    'ChecksumID', 'Timestamp', 'SheetName', 'ArchiveSheetName',
    'StartRow', 'EndRow', 'RowCount', 'Checksum', 'Algorithm',
    'VerificationStatus', 'LastVerified', 'VerificationNote'
  ];
  var logSheet = getOrCreateSheet(INTEGRITY_CONFIG.TRACKING_SHEET_NAME, headers);

  var checksumId = generateRequestId('CHK');
  var archiveSheetName = sheetName + HIPAA_RETENTION_CONFIG.ARCHIVE_SHEET_SUFFIX;

  logSheet.appendRow([
    checksumId,
    timestamp,
    sheetName,
    archiveSheetName,
    archiveStartRow,
    archiveEndRow,
    archivedRows.length,
    checksum,
    INTEGRITY_CONFIG.ALGORITHM,
    'PENDING',
    '',
    ''
  ]);

  auditLog('archive_checksum_stored', 'system', 'success', {
    checksumId: checksumId,
    sheetName: sheetName,
    rowCount: archivedRows.length,
    checksum: checksum.substring(0, 16) + '...'
  });
}

/**
 * Verifies the integrity of all archived records by recomputing checksums
 * and comparing against stored values.
 * §164.312(c)(2) — Mechanism to Authenticate ePHI (Addressable)
 *
 * @param {string} sessionToken — Admin session token
 * @returns {Object} { success, report: { archives: [...], findings: [...], overallStatus } }
 */
function verifyArchiveIntegrity(sessionToken) {
  return wrapRetentionOperation('verifyArchiveIntegrity', sessionToken, function(user) {
    checkPermission(user, 'admin', 'verifyArchiveIntegrity');

    var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    var timestamp = formatHipaaTimestamp();

    var report = {
      verificationId: generateRequestId('VRFY'),
      timestamp: timestamp,
      verifier: user.email,
      overallStatus: 'PASS',
      archives: [],
      findings: []
    };

    var logHeaders = [
      'ChecksumID', 'Timestamp', 'SheetName', 'ArchiveSheetName',
      'StartRow', 'EndRow', 'RowCount', 'Checksum', 'Algorithm',
      'VerificationStatus', 'LastVerified', 'VerificationNote'
    ];
    var logSheet = getOrCreateSheet(INTEGRITY_CONFIG.TRACKING_SHEET_NAME, logHeaders);
    var logData = logSheet.getDataRange().getValues();

    if (logData.length <= 1) {
      report.findings.push({
        severity: 'INFO',
        finding: 'No checksums stored yet — no archives to verify'
      });
      return { success: true, report: report };
    }

    // Group checksums by archive sheet
    var checksumsBySheet = {};
    for (var r = 1; r < logData.length; r++) {
      var archiveName = logData[r][3];
      if (!checksumsBySheet[archiveName]) {
        checksumsBySheet[archiveName] = [];
      }
      checksumsBySheet[archiveName].push({
        logRow: r + 1,
        checksumId: logData[r][0],
        startRow: logData[r][4],
        endRow: logData[r][5],
        expectedRowCount: logData[r][6],
        storedChecksum: logData[r][7],
        algorithm: logData[r][8]
      });
    }

    for (var archiveName in checksumsBySheet) {
      var archiveSheet = ss.getSheetByName(archiveName);
      var archiveReport = {
        archiveSheetName: archiveName,
        exists: !!archiveSheet,
        checksumEntries: checksumsBySheet[archiveName].length,
        passed: 0,
        failed: 0,
        status: 'PASS'
      };

      if (!archiveSheet) {
        archiveReport.status = 'MISSING';
        report.overallStatus = 'FAIL';
        report.findings.push({
          severity: 'CRITICAL',
          finding: 'Archive sheet "' + archiveName + '" is MISSING — archived records may be lost'
        });
        report.archives.push(archiveReport);
        continue;
      }

      var archiveData = archiveSheet.getDataRange().getValues();
      var entries = checksumsBySheet[archiveName];

      for (var e = 0; e < entries.length; e++) {
        var entry = entries[e];
        var startIdx = entry.startRow - 1;
        var endIdx = entry.endRow;

        if (endIdx > archiveData.length) {
          report.findings.push({
            severity: 'HIGH',
            finding: 'Checksum ' + entry.checksumId + ': archive "' + archiveName
              + '" has ' + archiveData.length + ' rows but checksum covers rows '
              + entry.startRow + '-' + entry.endRow + ' — ROW_COUNT_MISMATCH'
          });
          logSheet.getRange(entry.logRow, 10).setValue('FAIL');
          logSheet.getRange(entry.logRow, 11).setValue(timestamp);
          logSheet.getRange(entry.logRow, 12).setValue('ROW_COUNT_MISMATCH');
          archiveReport.failed++;
          archiveReport.status = 'FAIL';
          report.overallStatus = 'FAIL';
          continue;
        }

        var rows = archiveData.slice(startIdx, endIdx);
        var recomputed = computeRowsChecksum(rows);

        if (recomputed === entry.storedChecksum) {
          logSheet.getRange(entry.logRow, 10).setValue('PASS');
          logSheet.getRange(entry.logRow, 11).setValue(timestamp);
          logSheet.getRange(entry.logRow, 12).setValue('');
          archiveReport.passed++;
        } else {
          report.findings.push({
            severity: 'CRITICAL',
            finding: 'Checksum ' + entry.checksumId + ': INTEGRITY_MISMATCH in "'
              + archiveName + '" rows ' + entry.startRow + '-' + entry.endRow
              + ' — archived records may have been tampered with or corrupted'
          });
          logSheet.getRange(entry.logRow, 10).setValue('FAIL');
          logSheet.getRange(entry.logRow, 11).setValue(timestamp);
          logSheet.getRange(entry.logRow, 12).setValue('INTEGRITY_MISMATCH: stored='
            + entry.storedChecksum.substring(0, 16) + ' recomputed='
            + recomputed.substring(0, 16));
          archiveReport.failed++;
          archiveReport.status = 'FAIL';
          report.overallStatus = 'FAIL';
        }
      }

      report.archives.push(archiveReport);
    }

    dataAuditLog(user, 'verify', 'archive_integrity', report.verificationId, {
      overallStatus: report.overallStatus,
      archivesChecked: report.archives.length,
      findingsCount: report.findings.length
    });

    return { success: true, report: report };
  });
}

// ═══════════════════════════════════════════════════════
// PHASE C — RETENTION COMPLIANCE AUDIT
// ═══════════════════════════════════════════════════════

/**
 * Performs a comprehensive audit of retention enforcement across all HIPAA sheets.
 * §164.308(a)(8) — Evaluation (Required)
 * §164.316(b)(2)(iii) — Updates (Required)
 *
 * @param {string} [sessionToken] — Admin session token (null when triggered)
 * @returns {Object} Structured compliance audit report
 */
function auditRetentionCompliance(sessionToken) {
  var user = null;
  if (sessionToken) {
    user = validateSessionForData(sessionToken, 'auditRetentionCompliance');
    checkPermission(user, 'admin', 'auditRetentionCompliance');
  }

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var retentionYears = HIPAA_RETENTION_CONFIG.RETENTION_YEARS || 6;
  var cutoffDate = getRetentionCutoffDate(retentionYears);
  var timestamp = formatHipaaTimestamp();

  var report = {
    auditId: generateRequestId('AUDIT'),
    timestamp: timestamp,
    auditor: user ? user.email : 'system_trigger',
    retentionYears: retentionYears,
    cutoffDate: cutoffDate.toISOString(),
    overallStatus: 'COMPLIANT',
    sheets: [],
    legalHolds: [],
    findings: [],
    summary: {
      totalSheets: 0,
      protectedSheets: 0,
      unprotectedSheets: 0,
      totalActiveRecords: 0,
      totalArchivedRecords: 0,
      overageRecords: 0,
      activeHolds: 0,
      continuityGaps: 0
    }
  };

  var sheetsToProtect = HIPAA_RETENTION_CONFIG.SHEETS_TO_PROTECT;

  for (var s = 0; s < sheetsToProtect.length; s++) {
    var sheetName = sheetsToProtect[s];
    var sheet = ss.getSheetByName(sheetName);
    var archiveSheet = ss.getSheetByName(sheetName + HIPAA_RETENTION_CONFIG.ARCHIVE_SHEET_SUFFIX);

    var sheetReport = {
      sheetName: sheetName,
      exists: !!sheet,
      isProtected: false,
      activeRecords: 0,
      archivedRecords: 0,
      oldestActiveRecord: null,
      newestActiveRecord: null,
      overageRecords: 0,
      archiveExists: !!archiveSheet,
      status: 'OK'
    };

    if (!sheet) {
      sheetReport.status = 'MISSING';
      report.findings.push({
        severity: 'INFO',
        sheet: sheetName,
        finding: 'Sheet does not exist (may not have been created yet — created on first use)'
      });
      report.sheets.push(sheetReport);
      report.summary.totalSheets++;
      continue;
    }

    // Check protection
    var protections = sheet.getProtections(SpreadsheetApp.ProtectionType.SHEET);
    sheetReport.isProtected = protections.length > 0;
    if (!sheetReport.isProtected) {
      sheetReport.status = 'NON_COMPLIANT';
      report.overallStatus = 'NON_COMPLIANT';
      report.summary.unprotectedSheets++;
      report.findings.push({
        severity: 'HIGH',
        sheet: sheetName,
        finding: 'Sheet is NOT protected — records can be deleted without warning'
      });
    } else {
      report.summary.protectedSheets++;
    }

    // Count records and check dates
    var data = sheet.getDataRange().getValues();
    sheetReport.activeRecords = Math.max(0, data.length - 1);
    report.summary.totalActiveRecords += sheetReport.activeRecords;

    if (data.length > 1) {
      var headers = data[0];
      var tsColIdx = -1;
      for (var h = 0; h < headers.length; h++) {
        var hdr = String(headers[h]).toLowerCase();
        if (hdr === 'timestamp' || hdr === 'createddate' || hdr === 'requestdate'
            || hdr === 'discoverydate' || hdr === 'authorizationdate') {
          tsColIdx = h;
          break;
        }
      }

      if (tsColIdx !== -1) {
        var dates = [];
        for (var r = 1; r < data.length; r++) {
          var d = data[r][tsColIdx];
          var dateVal = d instanceof Date ? d : new Date(d);
          if (!isNaN(dateVal.getTime())) {
            dates.push(dateVal);
            if (dateVal < cutoffDate) {
              sheetReport.overageRecords++;
            }
          }
        }
        if (dates.length > 0) {
          dates.sort(function(a, b) { return a - b; });
          sheetReport.oldestActiveRecord = dates[0].toISOString();
          sheetReport.newestActiveRecord = dates[dates.length - 1].toISOString();
        }
      }

      report.summary.overageRecords += sheetReport.overageRecords;
      if (sheetReport.overageRecords > 0) {
        report.findings.push({
          severity: 'MEDIUM',
          sheet: sheetName,
          finding: sheetReport.overageRecords + ' record(s) past retention cutoff not yet archived'
            + ' (may be under legal hold or pending next trigger run)'
        });
      }
    }

    // Check archive
    if (archiveSheet) {
      var archiveData = archiveSheet.getDataRange().getValues();
      sheetReport.archivedRecords = Math.max(0, archiveData.length - 1);
      report.summary.totalArchivedRecords += sheetReport.archivedRecords;
    }

    report.sheets.push(sheetReport);
    report.summary.totalSheets++;
  }

  // Check legal holds
  var holdSheet = ss.getSheetByName('LegalHolds');
  if (holdSheet) {
    var holdData = holdSheet.getDataRange().getValues();
    for (var hr = 1; hr < holdData.length; hr++) {
      if (holdData[hr][10] === 'Active') {
        report.legalHolds.push({
          holdId: holdData[hr][0],
          sheetName: holdData[hr][1],
          holdType: holdData[hr][2],
          reason: holdData[hr][3],
          placedDate: holdData[hr][8],
          expirationDate: holdData[hr][9] || 'Indefinite'
        });
        report.summary.activeHolds++;
      }
    }
  }

  auditLog('retention_compliance_audit', user ? user.email : 'system', report.overallStatus, {
    auditId: report.auditId,
    totalSheets: report.summary.totalSheets,
    protectedSheets: report.summary.protectedSheets,
    overageRecords: report.summary.overageRecords,
    activeHolds: report.summary.activeHolds,
    findingsCount: report.findings.length
  });

  return { success: true, report: report };
}

/**
 * Generates a formatted compliance audit report for export.
 * Admin users get the full report; other roles get a summary-only view.
 *
 * @param {string} sessionToken
 * @param {string} [format='json'] — 'json' or 'text'
 * @returns {Object} { success, format, data, filename }
 */
function getComplianceAuditReport(sessionToken, format) {
  return wrapRetentionOperation('getComplianceAuditReport', sessionToken, function(user) {
    var isAdmin = hasPermission(user.role, 'admin');

    var audit = auditRetentionCompliance(sessionToken);
    if (!audit.success) return audit;

    var report = audit.report;
    format = (format || 'json').toLowerCase();
    var dateStr = Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd');
    var filename = 'retention-compliance-audit-' + dateStr;

    if (!isAdmin) {
      var summary = {
        auditId: report.auditId,
        timestamp: report.timestamp,
        overallStatus: report.overallStatus,
        sheetsAudited: report.summary.totalSheets,
        protectedSheets: report.summary.protectedSheets,
        activeHolds: report.summary.activeHolds,
        findingsCount: report.findings.length
      };
      return {
        success: true,
        format: format,
        data: format === 'json' ? JSON.stringify(summary, null, 2) : formatComplianceTextSummary(summary),
        filename: filename + '-summary.' + (format === 'json' ? 'json' : 'txt')
      };
    }

    if (format === 'json') {
      return {
        success: true,
        format: 'json',
        data: JSON.stringify(report, null, 2),
        filename: filename + '.json'
      };
    }

    var lines = [
      '═══════════════════════════════════════════',
      '  HIPAA RETENTION COMPLIANCE AUDIT REPORT',
      '  Audit ID: ' + report.auditId,
      '  Date: ' + report.timestamp,
      '  Auditor: ' + report.auditor,
      '  Overall Status: ' + report.overallStatus,
      '═══════════════════════════════════════════',
      '',
      'SUMMARY',
      '  Total sheets: ' + report.summary.totalSheets,
      '  Protected: ' + report.summary.protectedSheets,
      '  Unprotected: ' + report.summary.unprotectedSheets,
      '  Active records: ' + report.summary.totalActiveRecords,
      '  Archived records: ' + report.summary.totalArchivedRecords,
      '  Overage (past cutoff): ' + report.summary.overageRecords,
      '  Active legal holds: ' + report.summary.activeHolds,
      '',
      'SHEET DETAILS',
    ];

    for (var i = 0; i < report.sheets.length; i++) {
      var sht = report.sheets[i];
      lines.push('  ' + sht.sheetName + ': ' + sht.status
        + ' (' + sht.activeRecords + ' active, ' + sht.archivedRecords + ' archived)');
    }

    if (report.findings.length > 0) {
      lines.push('');
      lines.push('FINDINGS');
      for (var f = 0; f < report.findings.length; f++) {
        lines.push('  [' + report.findings[f].severity + '] '
          + report.findings[f].sheet + ': ' + report.findings[f].finding);
      }
    }

    if (report.legalHolds.length > 0) {
      lines.push('');
      lines.push('ACTIVE LEGAL HOLDS');
      for (var lh = 0; lh < report.legalHolds.length; lh++) {
        var hold = report.legalHolds[lh];
        lines.push('  ' + hold.holdId + ': ' + hold.sheetName
          + ' (' + hold.holdType + ') — ' + hold.reason);
      }
    }

    return {
      success: true,
      format: 'text',
      data: lines.join('\n'),
      filename: filename + '.txt'
    };
  });
}

/**
 * Formats a summary object as plain text for non-admin compliance report view.
 */
function formatComplianceTextSummary(summary) {
  return 'Retention Compliance Summary\n'
    + '  Audit ID: ' + summary.auditId + '\n'
    + '  Date: ' + summary.timestamp + '\n'
    + '  Status: ' + summary.overallStatus + '\n'
    + '  Sheets audited: ' + summary.sheetsAudited + '\n'
    + '  Protected: ' + summary.protectedSheets + '\n'
    + '  Active holds: ' + summary.activeHolds + '\n'
    + '  Findings: ' + summary.findingsCount;
}

/**
 * Sets up a weekly time-driven trigger for automated compliance auditing.
 * Run this ONCE from the Apps Script editor (Run → setupComplianceAuditTrigger).
 * The trigger fires once per week on Sunday at 3:00 AM EST.
 */
function setupComplianceAuditTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'auditRetentionCompliance') {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }

  ScriptApp.newTrigger('auditRetentionCompliance')
    .timeBased()
    .onWeekDay(ScriptApp.WeekDay.SUNDAY)
    .atHour(3)
    .inTimezone('America/New_York')
    .create();

  auditLog('compliance_audit_trigger_installed', 'system', 'success', {
    schedule: 'Weekly on Sunday at 3:00 AM EST',
    handler: 'auditRetentionCompliance()'
  });
}

// ═══════════════════════════════════════════════════════
// PHASE C — SHARED UTILITIES
// ═══════════════════════════════════════════════════════

/**
 * Computes a SHA-256 checksum for an array of row values.
 * Used to verify archive integrity — the checksum is stored at archival time
 * and can be recomputed later to detect tampering or corruption.
 *
 * @param {Array[]} rows - Array of row arrays (each row is an array of cell values)
 * @returns {string} Hex-encoded SHA-256 digest
 */
function computeRowsChecksum(rows) {
  var serialized = rows.map(function(row) {
    return row.map(function(cell) {
      if (cell instanceof Date) return cell.toISOString();
      if (cell === null || cell === undefined) return '';
      return String(cell);
    }).join('|');
  }).join('\n');

  var digest = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    serialized,
    Utilities.Charset.UTF_8
  );

  return digest.map(function(byte) {
    return ('0' + ((byte + 256) % 256).toString(16)).slice(-2);
  }).join('');
}

/**
 * Wraps a Phase C retention operation with standard error handling.
 * Delegates to wrapHipaaOperation() with Phase C-specific audit logging.
 *
 * @param {string} operationName - Name of the operation
 * @param {string} sessionToken - Session token
 * @param {Function} operationFn - The operation to execute (receives user object)
 * @returns {Object} Operation result or structured error
 */
function wrapRetentionOperation(operationName, sessionToken, operationFn) {
  return wrapHipaaOperation(operationName, sessionToken, function(user) {
    auditLog('retention_operation', user.email, 'started', {
      operation: operationName
    });
    var result = operationFn(user);
    auditLog('retention_operation', user.email, 'completed', {
      operation: operationName
    });
    return result;
  });
}

/**
 * Returns the notification email for legal hold events.
 * Falls back to BREACH_ALERT_CONFIG.SECURITY_OFFICER_EMAIL if not configured.
 *
 * @returns {string} Email address or empty string if not configured
 */
function getHoldNotificationEmail() {
  return LEGAL_HOLD_CONFIG.HOLD_NOTIFICATION_EMAIL
    || BREACH_ALERT_CONFIG.SECURITY_OFFICER_EMAIL
    || '';
}

/**
 * Determines the retention-relevant date for a record.
 * Per §164.316(b)(2)(i): 6 years from creation or "last in effect", whichever is later.
 *
 * @param {Object[]} headers - Column headers from the sheet
 * @param {Array} row - Row data
 * @returns {Date} The later of creation date or last-in-effect date
 */
function getRetentionRelevantDate(headers, row) {
  var creationDate = null;
  var lastInEffectDate = null;

  var creationCols = ['timestamp', 'createddate', 'requestdate', 'discoverydate', 'authorizationdate'];
  var lastInEffectCols = ['resolutiondate', 'revocationdate', 'expirationdate', 'approvaldate', 'releasedate', 'completiondate'];

  for (var i = 0; i < headers.length; i++) {
    var hdr = String(headers[i]).toLowerCase().replace(/[^a-z]/g, '');
    var val = row[i];
    if (!val) continue;

    var dateVal = val instanceof Date ? val : new Date(val);
    if (isNaN(dateVal.getTime())) continue;

    if (creationCols.indexOf(hdr) !== -1 && !creationDate) {
      creationDate = dateVal;
    }
    if (lastInEffectCols.indexOf(hdr) !== -1) {
      if (!lastInEffectDate || dateVal > lastInEffectDate) {
        lastInEffectDate = dateVal;
      }
    }
  }

  if (creationDate && lastInEffectDate) {
    return creationDate > lastInEffectDate ? creationDate : lastInEffectDate;
  }
  return creationDate || lastInEffectDate || new Date(0);
}


// ══════════════
// AUTH END
// ══════════════
// Developed by: LightAISolutions
