# Estimates & burn (time / $) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.  
> **Do not use TDD** — see `.cursor/rules/no-tdd.mdc` and `AGENTS.md`. Verify in the browser (or a quick manual check named in each task).  
> **CSS:** Any `.css` edit must follow the `responsive-css` skill (mobile-first, nested `@media` at `768px`/`1024px`, logical properties, no BEM `&__` / `&--`).

**Goal:** Let Issues carry estimate hours and actual burn; derive `$` from `config.php` hourly rate; show Done / Remaining / Grand (plus Deferred side line) on a dedicated Estimate page and on Issue cards/detail when set.

**Architecture:** Optional `hours` and `actual_hours` live on each Issue in `issues.yaml`. `hourly_rate` lives in `api/config.php` and is exposed as `hourlyRate` on authenticated `editor-auth.php` responses. One pure client module (`assets/estimates.js`) owns parse/cost/bucket math; presentation renders `#/estimates` plus chips; editor saves the new fields and `deferred` status.

**Tech stack:** Existing vanilla JS modules, js-yaml, PHP session auth APIs, flat YAML under `app/data/`.

**Spec:** `docs/superpowers/specs/2026-07-16-estimates-time-money-design.md`

**Branch:** `feature/plan-estimates-time-money` (from up-to-date `staging`)

## Global Constraints

- Rate only in `config.php` / `config.example.php` — never Settings JSON or invented defaults.
- Omit unset `hours` / `actual_hours` from YAML (empty editor field → delete key; do not write `0` for “unknown”).
- Quote buckets: **Done** = `complete`; **Remaining** = `planned` + `in_progress` + `blocked`; **Grand** = Done + Remaining; **Deferred** side line only = `deferred` (never in Grand). (`in_progress` already exists in the app; treat like `planned` for money.)
- Missing rate → hours still show; `$` fails visibly (“Hourly rate not configured”).
- Client sees estimate + actual (hours + `$` when rate set) — transparent.
- No timesheet log entries, timers, or external time-app import.
- Domain vocabulary: Issue / Issue id / Issue key / Phase — see `CONTEXT.md`.
- Asset rules: no jQuery; no `wp_add_inline_*` (N/A here); separate JS files; vanilla JS.

## File map

| File | Role |
|------|------|
| `app/api/config.example.php` | Document `hourly_rate` |
| `app/api/config.php` | Local rate (do not commit secrets; rate OK to set locally) |
| `app/api/editor-lib.php` | `editor_hourly_rate(): ?float` |
| `app/api/editor-auth.php` | Include `hourlyRate` when authenticated |
| `app/data/issues.yaml` | Migrate `blocked` → `deferred`; later hold `hours` / `actual_hours` |
| `app/assets/estimates.js` | Pure parse / cost / rollup helpers |
| `app/assets/router.js` | `#/estimates` route |
| `app/assets/app.js` | State rate, Estimate page, cards/detail chips, COPY, status label |
| `app/index.html` | Nav link Estimate |
| `app/assets/editor/views.js` | Status option + hours fields + save omit |
| `app/assets/tokens.css` | Deferred status colors (light + dark) |
| `app/assets/styles.css` | Estimate page + burn chips + `.pill--deferred` |
| `CONTEXT.md` | Glossary terms |
| `app/README.md` | Status list, hours fields, `hourly_rate` |

---

### Task 1: Config, auth rate, deferred migrate, glossary

**Files:**
- Modify: `app/api/config.example.php`
- Modify: `app/api/config.php` (local only — set a real rate for verification; do not force-commit if repo policy excludes it; if `config.php` is tracked, add `hourly_rate` there too)
- Modify: `app/api/editor-lib.php`
- Modify: `app/api/editor-auth.php`
- Modify: `app/data/issues.yaml` (3 Issues: `2.8`, `4.8`, `4.12` — `status: blocked` → `deferred`)
- Modify: `CONTEXT.md`
- Modify: `app/README.md`

**Interfaces:**
- Consumes: `$editorConfig` already loaded in `editor-lib.php`
- Produces: `editor_hourly_rate(): ?float`; auth JSON field `hourlyRate` (`number|null`)

- [ ] **Step 1: Add `hourly_rate` to config example**

In `app/api/config.example.php`, after `app_public_url`, add:

```php
    /**
     * USD hourly rate for Issue estimate/actual $ (optional).
     * Omit or set null when unset — presentation must not invent a default.
     */
    'hourly_rate' => null,
```

In local `app/api/config.php`, set a numeric rate for your environment (example `150`).

- [ ] **Step 2: Add `editor_hourly_rate()` in `editor-lib.php`**

Place after `editor_enabled()`:

```php
/**
 * Configured hourly rate for estimate/actual $, or null if unset/invalid.
 */
function editor_hourly_rate(): ?float
{
    global $editorConfig;
    if (!array_key_exists('hourly_rate', $editorConfig)) {
        return null;
    }
    $raw = $editorConfig['hourly_rate'];
    if ($raw === null || $raw === '') {
        return null;
    }
    if (!is_numeric($raw)) {
        return null;
    }
    $rate = (float) $raw;
    if (!is_finite($rate) || $rate < 0) {
        return null;
    }
    return $rate;
}
```

- [ ] **Step 3: Expose `hourlyRate` from `editor-auth.php`**

On GET when building the response, and on successful login POST, include:

```php
'hourlyRate' => editor_hourly_rate(),
```

GET unauthenticated response may omit it or send `null` — either is fine; client only trusts it after `authenticated === true`.

Example GET authenticated payload shape:

```php
respond_json(200, [
    'authenticated' => $authenticated,
    'csrf' => $csrf,
    'files' => EDITOR_FILES,
    'hourlyRate' => $authenticated ? editor_hourly_rate() : null,
]);
```

Login success:

```php
respond_json(200, [
    'ok' => true,
    'csrf' => editor_csrf_token(),
    'hourlyRate' => editor_hourly_rate(),
]);
```

- [ ] **Step 4: Migrate blocked → deferred in `issues.yaml`**

Change these three only:

- `id: '2.8'` (`d1a5bef1-69b2-4ff5-8bf2-61efc6b31212`)
- `id: '4.8'` (`22f6409d-b5e4-46b1-8086-f2839495505e`)
- `id: '4.12'` (`fb10d3ef-47f4-49e0-852e-b75d75b4244f`)

`status: blocked` → `status: deferred`. Leave no Issues on `blocked` after this step.

- [ ] **Step 5: Update `CONTEXT.md` glossary**

Append terms (keep existing style):

```markdown
**Deferred**:
An Issue status meaning the client does not want the work at this time (may return later). Deferred Issues are shown on the Estimate page side line but are never included in Done, Remaining, or Grand totals.
_Avoid_: Blocked (Blocked means waiting on an answer or gate while still intending to do the work)

**Blocked** (status):
Waiting on a Questions answer or other gate; work is still intended and stays in the Estimate quote (Remaining / Grand).
_Avoid_: Deferred

**Estimate hours**:
Optional planned effort on an Issue (`hours` in YAML). Dollar amount is hours × configured hourly rate.
_Avoid_: Story points, effort band

**Actual hours**:
Optional burn roll-up on an Issue (`actual_hours`), entered manually from an external time tracker — not a timesheet log inside this app.
_Avoid_: Time entry, timesheet row

**Done / Remaining / Grand** (Estimate page):
Done = complete Issues; Remaining = planned + in progress + blocked; Grand = Done + Remaining. Deferred is separate and not quoted.
```

- [ ] **Step 6: Update `app/README.md`**

- Status list: `planned`, `in_progress`, `blocked`, `deferred`, `complete`.
- Note optional `hours` / `actual_hours`.
- Note `hourly_rate` in `config.php`.
- Clarify: Questions wait → `blocked` (in quote); client “not now” → `deferred` (out of quote).

- [ ] **Step 7: Verify auth JSON**

Sign out/in (or hit `api/editor-auth.php` while logged in). Expect `hourlyRate` number when rate set; `null` when unset.

- [ ] **Step 8: Commit**

```bash
git add app/api/config.example.php app/api/editor-lib.php app/api/editor-auth.php app/data/issues.yaml CONTEXT.md app/README.md
# include config.php only if you intentionally track the rate change locally
git commit -m "$(cat <<'EOF'
Add hourly_rate config, auth exposure, and deferred status migrate.

EOF
)"
```

---

### Task 2: `estimates.js` rollup helpers

**Files:**
- Create: `app/assets/estimates.js`

**Interfaces:**
- Consumes: Issue objects with `status`, `hours`, `actual_hours`, `sprint`
- Produces: exported functions below (exact names)

```js
/** @returns {number|null} */
export function parseHours(value) { … }

/** @returns {number|null} */
export function issueEstimateHours(issue) { … }

/** @returns {number|null} */
export function issueActualHours(issue) { … }

/**
 * @param {number|null|undefined} hours
 * @param {number|null|undefined} rate
 * @returns {number|null}
 */
export function hoursToCost(hours, rate) { … }

export function issueEstimateCost(issue, rate) { … }
export function issueActualCost(issue, rate) { … }

/** @returns {'done'|'remaining'|'deferred'|'other'} */
export function issueQuoteBucket(issue) { … }

/**
 * @param {object[]} issues
 * @param {number|null|undefined} rate
 * @returns {{
 *   done: BucketTotals,
 *   remaining: BucketTotals,
 *   grand: BucketTotals,
 *   deferred: BucketTotals,
 *   estimateCompleteness: { set: number, total: number },
 *   actualCompleteness: { set: number, total: number },
 * }}
 * BucketTotals = { estimateHours, actualHours, estimateCost, actualCost, count }
 * Costs are null when rate unset; hour sums ignore null hours.
 */
export function summarizeEstimates(issues, rate) { … }

/**
 * @param {object[]} issues
 * @param {object[]} sprints audit.sprints
 * @param {number|null|undefined} rate
 */
export function summarizeEstimatesByPhase(issues, sprints, rate) { … }

/** USD display; null → null (caller shows Fail Fast / em dash) */
export function formatUsd(amount) { … }

export function formatHours(hours) { … }
```

- [ ] **Step 1: Implement `app/assets/estimates.js`**

Rules to encode:

- `parseHours`: accept finite number `>= 0`; reject `''`, `null`, `undefined`, `NaN`, negative.
- Buckets: `complete` → `done`; `planned` | `in_progress` | `blocked` → `remaining`; `deferred` → `deferred`; else → `other` (exclude from quote and deferred side).
- Quoted Issues for completeness = done + remaining only.
- `grand` totals = sum of done + remaining hour fields (recompute; do not add null costs as 0).
- `estimateCost` on a bucket: if `rate` is null, `estimateCost`/`actualCost` are `null`; else `hoursSum * rate` for hours that exist (same as summing per-issue costs).
- `summarizeEstimatesByPhase`: one summary per sprint id in audit order; append orphan sprint ids found on Issues but missing from audit at the end.
- `formatUsd`: `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`.
- `formatHours`: trim trailing zeros sensibly (e.g. `2.5`, `2`).

- [ ] **Step 2: Smoke-check in browser console** (temporary import or paste)

With three fake Issues (complete 2h, planned 3h, deferred 5h) and rate `100`, expect Grand estimate hours `5`, deferred hours `5`, Grand cost `$500`.

- [ ] **Step 3: Commit**

```bash
git add app/assets/estimates.js
git commit -m "$(cat <<'EOF'
Add estimate and burn rollup helpers.

EOF
)"
```

---

### Task 3: Editor — hours fields + deferred status

**Files:**
- Modify: `app/assets/editor/views.js` (`ISSUE_STATUS_OPTIONS`, issue form markup, `applyIssueForm`)

**Interfaces:**
- Consumes: existing `input()` / `field()` helpers
- Produces: YAML Issue may include `hours` / `actual_hours` numbers; status may be `deferred`

- [ ] **Step 1: Extend status options**

```js
const ISSUE_STATUS_OPTIONS = [
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In progress" },
  { value: "blocked", label: "Waiting on you" },
  { value: "deferred", label: "Deferred" },
  { value: "complete", label: "Complete" },
];
```

- [ ] **Step 2: Add hours fields to the Issue form**

After the Priority/Status grid, add:

```js
<div class="editor-grid editor-grid--2">
  ${field(
    "Hours (estimate)",
    input(
      "hours",
      issue.hours == null || issue.hours === "" ? "" : String(issue.hours),
      "number",
      'min="0" step="0.25"',
    ),
  )}
  ${field(
    "Actual hours",
    input(
      "actual_hours",
      issue.actual_hours == null || issue.actual_hours === ""
        ? ""
        : String(issue.actual_hours),
      "number",
      'min="0" step="0.25"',
    ),
  )}
</div>
```

- [ ] **Step 3: Save / omit in `applyIssueForm`**

After reading status, parse hours:

```js
function readOptionalHours(form, name) {
  const raw = form.querySelector(`[name="${name}"]`)?.value;
  if (raw == null || String(raw).trim() === "") {
    return null;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    throw new Error(`${name} must be a number ≥ 0.`);
  }
  return n;
}

// in applyIssueForm:
const hours = readOptionalHours(form, "hours");
const actualHours = readOptionalHours(form, "actual_hours");
if (hours == null) {
  delete issue.hours;
} else {
  issue.hours = hours;
}
if (actualHours == null) {
  delete issue.actual_hours;
} else {
  issue.actual_hours = actualHours;
}
```

If `applyIssueForm` cannot throw into UI today, surface the error via existing editor status helper the same way other validation does — do not silently coerce invalid input to `0`.

- [ ] **Step 4: Browser check**

In Editor → Issues: set Deferred on one Issue; set estimate `2.5` and actual `1`; save; reload YAML and confirm keys present. Clear fields; save; confirm keys omitted.

- [ ] **Step 5: Commit**

```bash
git add app/assets/editor/views.js
git commit -m "$(cat <<'EOF'
Add estimate and actual hours fields plus deferred status in editor.

EOF
)"
```

---

### Task 4: Auth → state, route, Estimate page, nav

**Files:**
- Modify: `app/assets/router.js`
- Modify: `app/assets/app.js`
- Modify: `app/index.html`

**Interfaces:**
- Consumes: `summarizeEstimates`, `summarizeEstimatesByPhase`, `formatUsd`, `formatHours`, `issueEstimateHours`, `issueActualHours`, `hoursToCost` from `./estimates.js`
- Produces: `#/estimates` view; `state.hourlyRate`

- [ ] **Step 1: Add route**

In `router.js` `ROUTES`:

```js
{ pattern: /^\/estimates$/, name: 'estimates' },
```

- [ ] **Step 2: Wire `hourlyRate` into state**

In `state`:

```js
hourlyRate: null,
```

Add:

```js
function applyHourlyRate(auth) {
  const raw = auth?.hourlyRate;
  state.hourlyRate =
    typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? raw : null;
}
```

Call `applyHourlyRate(auth)` after successful `fetchAuth()` when authenticated, and after `login()` resolves (use returned payload).

- [ ] **Step 3: Import helpers + COPY**

```js
import {
  summarizeEstimates,
  summarizeEstimatesByPhase,
  formatUsd,
  formatHours,
  issueEstimateHours,
  issueActualHours,
  hoursToCost,
} from "./estimates.js";
```

Add COPY keys as needed, e.g. `estimates: "Estimate"`, `hourlyRateMissing: "Hourly rate not configured"`, bucket labels Done / Remaining / Grand / Deferred.

Add `deferred: "Deferred"` to `STATUS_LABELS`.

- [ ] **Step 4: Implement `renderEstimatesPage()`**

Behavior:

1. If `state.issues.length === 0` → empty page message (no fake numbers).
2. `const summary = summarizeEstimates(state.issues, state.hourlyRate)`.
3. Top strip: Done / Remaining / Grand — each shows estimate hours, estimate `$`, actual hours, actual `$`. When `state.hourlyRate === null`, money cells show `COPY.hourlyRateMissing` (or a single page banner with the missing-rate message — pick one consistent pattern; prefer banner + em dash in money cells).
4. Deferred side line from `summary.deferred` — label that it is **not included in totals**.
5. Completeness line from `summary.estimateCompleteness` / `actualCompleteness`.
6. Per-phase: `summarizeEstimatesByPhase(state.issues, state.audit.sprints || [], state.hourlyRate)`; each phase shows mini bucket strip + table of Issues (`id`, title, status, estimate, actual) with em dash when unset; Issue id links to `#/issue/<key>`.

- [ ] **Step 5: Hook route + nav**

In `renderRoute` switch:

```js
case "estimates":
  return renderEstimatesPage();
```

In `app/index.html` primary nav (with Overview / Screenshots / …):

```html
<a href="#/estimates" data-nav>Estimate</a>
```

Ensure `updateActiveNav` marks Estimate active on `#/estimates`.

- [ ] **Step 6: Browser check**

With rate set and at least one Issue with hours: open `#/estimates`, confirm Grand / Remaining / Done math; deferred Issues only on side line.

- [ ] **Step 7: Commit**

```bash
git add app/assets/router.js app/assets/app.js app/index.html
git commit -m "$(cat <<'EOF'
Add Estimate page with Done, Remaining, Grand, and deferred side line.

EOF
)"
```

---

### Task 5: Issue card + detail burn chips

**Files:**
- Modify: `app/assets/app.js` (`renderIssueCard`, `renderIssueDetail`, small helper)

**Interfaces:**
- Consumes: `issueEstimateHours`, `issueActualHours`, `hoursToCost`, `formatHours`, `formatUsd`, `state.hourlyRate`
- Produces: optional estimate/actual chip markup

- [ ] **Step 1: Add `renderIssueEstimateMeta(issue)`**

Return `""` when both estimate and actual hours are null.

Otherwise render a compact meta line/chips, e.g. `Est 2.5h · $250` and/or `Actual 1h · $100`. If rate missing, show hours only (no fake `$`).

- [ ] **Step 2: Card**

In `renderIssueCard`, after `renderMetaRow(issue)` (or inside content below meta):

```js
${renderIssueEstimateMeta(issue)}
```

- [ ] **Step 3: Detail**

In `renderIssueDetail`, after `renderMetaRow(...)`:

```js
${renderIssueEstimateMeta(issue)}
```

- [ ] **Step 4: Browser check**

Issue with hours set → chip on overview card + detail. Issue without hours → no chip.

- [ ] **Step 5: Commit**

```bash
git add app/assets/app.js
git commit -m "$(cat <<'EOF'
Show estimate and actual chips on Issue cards and detail.

EOF
)"
```

---

### Task 6: Styles (responsive-css)

**Files:**
- Modify: `app/assets/tokens.css`
- Modify: `app/assets/styles.css`

**Interfaces:**
- Consumes: Estimate page class names from Task 4/5 (`page--estimates`, `estimates-summary`, `estimates-table`, `issue-estimate-meta`, etc. — use the class names you actually shipped)
- Produces: readable mobile-first layout; deferred pill colors

- [ ] **Step 1: Read `responsive-css` skill and add deferred tokens**

In `tokens.css` (light + dark sections), add deferred colors distinct from blocked (e.g. muted violet/slate — not the same as blocked orange).

- [ ] **Step 2: Pill + Estimate layout in `styles.css`**

- `.pill--deferred` using the new tokens.
- Estimate summary: stack on small screens; multi-column from `768px` via custom properties + nested `@media`.
- Table: horizontal scroll wrapper if needed on small screens (`overflow-inline: auto`); prefer logical properties.
- Issue estimate meta: muted, compact, no card chrome unless needed for scanability.

Do **not** use BEM `&__` / `&--` concatenation; nest with `& .estimates-summary__…` full class names or separate selectors per skill.

- [ ] **Step 3: Browser check at ~375px and ~1024px**

Summary readable; table usable; chips wrap cleanly.

- [ ] **Step 4: Commit**

```bash
git add app/assets/tokens.css app/assets/styles.css
git commit -m "$(cat <<'EOF'
Style Estimate page and deferred status pill.

EOF
)"
```

---

### Task 7: End-to-end verification

**Files:** none (checklist only)

- [ ] **Step 1: Run full checklist from the spec**

1. `hourly_rate` set → sign in → `hourlyRate` present → `$` shows on Estimate.
2. `planned` Issue with estimate + actual → card, detail, Remaining + Grand.
3. Flip to `complete` → moves to Done; Grand hours unchanged if hours unchanged.
4. Flip to `deferred` → leaves Grand; appears on Deferred side line.
5. Remove/unset `hourly_rate` → reload session → hours remain; `$` fails visibly.
6. Former blocked Issues (`2.8`, `4.8`, `4.12`) are `deferred`.
7. Asset scan on edited PHP only: no jQuery / inline JS / inline CSS patterns.

- [ ] **Step 2: Fix any misses found in Step 1** (same branch; small follow-up commit if needed)

- [ ] **Step 3: Final commit only if Step 2 produced fixes**

```bash
git commit -m "$(cat <<'EOF'
Fix Estimate verification findings.

EOF
)"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| `hourly_rate` in config | 1 |
| Auth exposes rate | 1, 4 |
| `hours` / `actual_hours` on Issue | 3 |
| Done / Remaining / Grand / Deferred rules | 2, 4 |
| `in_progress` in Remaining | 2 (Global Constraints) |
| Estimate page + nav | 4 |
| Cards + detail when set | 5 |
| Editor fields + deferred | 3 |
| Migrate blocked → deferred | 1 |
| Fail Fast missing rate | 2, 4 |
| Glossary / README | 1 |
| Styles | 6 |
| Manual verification | 7 |
| No timesheet / no Settings rate | Global Constraints |

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-07-16-estimates-time-money.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — run tasks in this session with checkpoints  

Which approach?
