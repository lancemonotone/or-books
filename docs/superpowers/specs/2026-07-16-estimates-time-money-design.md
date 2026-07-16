# Estimates & burn (time / $) — Design

**Date:** 2026-07-16  
**Status:** Draft for review  
**App:** OR Books mobile review (`app/`)

## Problem

The review lists Issues with priority and status but has no effort or money view. The client needs a clear quote of work remaining, work done, and overall scope cost, plus transparent burn when hours are logged from an external time tracker.

## Goals

- Estimate hours per Issue; derive `$` from a configured hourly rate.
- Track actual burn per Issue as a single roll-up number (time tracked elsewhere).
- Show Done / Remaining / Grand totals, with Deferred visible but never quoted.
- Surface numbers on a dedicated Estimate page, Issue detail, and Issue cards (when set).
- Editor can set estimate hours, actual hours, and the new `deferred` status.

## Non-goals

- In-app timers or timesheet log entries (date/note rows).
- Import/sync from the external time app.
- Per-person rates or multiple currencies.
- Editing hourly rate in the Settings UI (rate lives in `config.php` only).

## Decisions

| Topic | Choice |
|-------|--------|
| Rate location | `hourly_rate` in `api/config.php` (not Settings JSON) |
| Estimate unit | Optional `hours` on each Issue (number); `$ = hours × rate` |
| Burn unit | Optional `actual_hours` on each Issue (manual roll-up) |
| Missing hours | Skip in that sum; show completeness (“X of Y estimated / actual logged”) |
| Client visibility | Hours + `$` for both estimate and actual when set |
| UI surfaces | `#/estimates` page; Issue detail + cards when values set |
| Status model | Add `deferred`; keep `blocked` for decision/dependency waits |
| Migrate | Existing `blocked` Issues → `deferred` (clear `blocked` for future use) |

## Status meanings & quote rules

| Status | Meaning | In Done | In Remaining | In Grand | Deferred side line |
|--------|---------|---------|--------------|----------|--------------------|
| `planned` | In play / ready | — | yes | yes | — |
| `blocked` | Waiting on an answer (Questions) or real gate; still intend to do | — | yes | yes | — |
| `complete` | Done | yes | — | yes | — |
| `deferred` | Client: not now (may return) | — | — | — | yes (not quoted) |

**Grand** = Done + Remaining only. Deferred never enters Done, Remaining, or Grand.

Suggested client-facing labels (presentation COPY):

- `planned` → Planned  
- `blocked` → Waiting on you (decision/gate; still in quote)  
- `deferred` → Deferred / Not now  
- `complete` → Complete  

## Data model

### Issue (`issues.yaml`)

```yaml
- key: …
  id: '1.1'
  # …
  status: planned   # planned | blocked | deferred | complete
  hours: 2.5        # optional estimate
  actual_hours: 1.0 # optional burn roll-up
```

- Omit `hours` / `actual_hours` when unset (do not write `0` as a stand-in for “unknown”).
- Values must be finite numbers `>= 0`. Invalid values are treated as unset (Fail Fast in editor validation on save).

### Config (`api/config.php`)

```php
'hourly_rate' => 150, // number; omit or leave null/empty = unset
```

Document in `config.example.php`. Local `config.php` is not committed with secrets; rate is business config, not a password, but stays server-side with other deploy config.

### Rate exposure

After authentication, include `hourlyRate` on the `editor-auth.php` payload (GET when authenticated and POST login success). Client stores `state.hourlyRate`.

- If rate unset: show hours; money columns/labels fail visibly (“Hourly rate not configured”).
- Do not invent a default rate in application code.

## Rollup math

Shared pure helper module (e.g. `assets/estimates.js`):

- `issueEstimateHours(issue)` / `issueActualHours(issue)` — parse or null  
- `issueEstimateCost(issue, rate)` / `issueActualCost(issue, rate)` — null if hours or rate missing  
- Bucket filters by status as in the table above  
- Completeness for quoted statuses (`planned` | `blocked` | `complete`): count with hours set vs count of Issues in those statuses (same pattern for actuals)  
- Phase rollups: group by Issue phase (`sprint` field) using audit phase list order  

Currency formatting: USD-style for display (`$1,234` / `$1,234.50`); rate assumed USD unless later config adds currency (out of scope).

## UI

### Nav

Primary nav link: **Estimate** → `#/estimates`.

### Estimate page (`#/estimates`)

1. **Summary strip:** Done / Remaining / Grand — each with estimate hours, estimate `$`, actual hours, actual `$` (money cells respect rate Fail Fast).  
2. **Deferred side line:** count of deferred Issues; estimate/actual hours if any — clearly labeled “not included in totals.”  
3. **Completeness:** e.g. “Estimated 12 of 40 · Actual logged 5 of 40” (quoted statuses only).  
4. **Per-phase sections:** same four buckets; list Issues in phase with id, title, status, estimate, actual, link to `#/issue/<key>`. Show estimate/actual cells only when set (or show em dash when unset within the table for scanability — prefer em dash in the Estimate table; hide chips on cards when unset).

### Issue detail

When `hours` and/or `actual_hours` set, show estimate and/or actual (hours + `$` when rate configured).

### Issue cards

Same: chip or meta line only when at least one of estimate/actual is set.

### Editor

- Number fields: **Hours (estimate)** and **Actual hours** next to priority/status.  
- Status select includes `deferred`.  
- Empty field on save → omit key from YAML.  
- One-shot data migrate: rewrite current `status: blocked` → `deferred` in `issues.yaml`.

## Architecture

```
config.php (hourly_rate)
    → editor-auth.php (hourlyRate in JSON)
        → app state
issues.yaml (hours, actual_hours, status)
    → content.php (existing)
        → estimates.js helpers
            → Estimate page / cards / detail
editor saves hours + actual_hours + deferred via existing YAML save path
```

One client-side math path only — no parallel PHP rollup API for v1.

## Docs / glossary

Update:

- `CONTEXT.md` — `deferred`, estimate hours, actual hours, Grand / Remaining / Done  
- `app/README.md` — status list, optional hours fields, `hourly_rate`  
- Decision-wait guidance: Issues waiting on Questions stay `blocked` (in quote); client “not now” uses `deferred` (out of quote)

## Error / empty behavior

| Case | Behavior |
|------|----------|
| No Issues | Empty Estimate page state (no fake demo numbers) |
| Rate missing | Hours visible; `$` shows explicit not-configured message |
| Hours unset | Omitted from that sum; em dash in Estimate table; no card chip |
| All deferred | Grand = 0; Deferred side line shows the parked work |

## Verification (manual)

1. Set `hourly_rate` in `config.php`; sign in; confirm `hourlyRate` present.  
2. Set estimate + actual on a `planned` Issue; see card, detail, Estimate Grand/Remaining.  
3. Mark `complete` → moves from Remaining into Done; Grand unchanged if hours unchanged.  
4. Set `deferred` → drops out of Grand; appears on Deferred side line.  
5. Clear rate → `$` fails visibly; hours still show.  
6. Confirm migrated former-blocked Issues are `deferred`.

## Implementation order (hint for plan)

1. Config + auth payload + status/`deferred` migrate + glossary  
2. YAML fields + editor form/save  
3. `estimates.js` helpers  
4. Estimate route/page + nav  
5. Issue detail + cards  
6. Styles (`responsive-css`)  
7. Manual verification checklist above
