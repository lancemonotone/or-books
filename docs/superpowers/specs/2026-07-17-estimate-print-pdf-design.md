# Estimate print-to-PDF — Design

**Date:** 2026-07-17  
**Status:** Approved  
**App:** OR Books mobile review (`app/`)  
**Depends on:** [2026-07-16-estimates-time-money-design.md](./2026-07-16-estimates-time-money-design.md)

## Problem

The Estimate page shows quote rollups in the browser but has no downloadable client-facing estimate. Sharing requires screenshots or manual re-entry.

## Goals

- One-click downloadable estimate from `#/estimates` via browser print → Save as PDF.
- Client quote that is easy for a human to scan (clear tables, stable headings).
- Content driven by a **profile** so defaults can change later without a new PDF stack.
- Reuse existing `estimates.js` math only (no parallel rollup API).

## Non-goals

- jsPDF / pdf-lib / server-side PDF generation.
- UI toggles for profile flags (v1).
- Editing hourly rate in Settings.
- In-app timers or timesheet import.

## Decisions

| Topic | Choice |
|-------|--------|
| Format | Browser `window.print()` → user Save as PDF |
| Default content | Client quote: estimate hours + `$` only |
| Deferred | Same as any other phase section when `includeDeferredAppendix`; omit deferred Issues from phases if flag off. Still excluded from Done/Remaining/Grand math. |
| Actuals / completeness | Omitted in default profile |
| Flexibility | Profile object in code; no UI toggles yet |
| Rate missing | Hours still print; `$` cells use Fail Fast copy |
| Client name missing | Omit name line (no invented default) |
| Vendor header | From root `config.php` `vendor` block; omit blank fields / invalid logo |
| Config location | Repo root `config.php` (sibling to `app/`) |
| Access | Anyone who can see `#/estimates` |

## Default profile

```js
{
  includeActuals: false,
  includeDeferredAppendix: true,
  includeDone: false,
  includeRemaining: false,
  includeGrandTitle: false,
  includeCompleteness: false,
}
```

## Document layout

1. **Header:** optional vendor block (`logo`, `business`, `name`, `address`, `email`, `phone` from config) + title “Estimate”; `clientName` when set; generated date; hourly rate line or Fail Fast note.
2. **Summary:** Grand estimate hours + estimate `$` only (no Done / Remaining cards; no “Grand total” title). Note that deferred issues are not included in the total.
3. **Per-phase tables:** Issue id · Title · Status · Estimate hours · Estimate `$` (quoted statuses only; em dash when unset). Optional actual columns when `includeActuals`.
4. **Deferred phase(s)** stay in the phase list when `includeDeferredAppendix` — same layout as other phases (no page break / special chrome).

## Architecture

```
#/estimates “Download estimate”
    → printEstimate(data, profile)
        → buildEstimatePrintHtml (estimates.js math)
        → mount #estimate-print-root
        → window.print()
        → teardown on afterprint
```

Print CSS: hide app chrome and screen Estimate page; show only `#estimate-print-root`. Screen: print root hidden.

## Error / empty behavior

| Case | Behavior |
|------|----------|
| No Issues | Button disabled / no print |
| Rate missing | PDF still prints; `$` Fail Fast text |
| No clientName | Name line omitted |
| Zero deferred | No deferred phase section (nothing to list) |

## Verification (manual)

1. Open `#/estimates` → Download estimate → Save as PDF.
2. Summary estimate hours/`$` match page Done / Remaining / Grand.
3. No actuals or completeness in default PDF.
4. Deferred phase section present with other phases; no page break; same styling as Phase 1–4.
5. Clear rate → `$` Fail Fast; hours still show.
6. Empty Issues → button disabled.
