# Heading hierarchy — Major Third (1.25)

**Status:** approved 2026-07-29  
**Scope:** `orbooks-theme/assets/scss/or-books/typography.scss` (+ contract docs)

## Goal

Replace the flat shared heading size with a **Major Third** modular scale so `h1`–`h6` read as a clear hierarchy (Briefboard 2.5).

## Locked (unchanged)

- `typography.scss` = sole source of body + heading type
- Bare `h1`–`h6` only; no class-based heading appearance
- No `h1`–`h6` rules outside `typography.scss`
- Shared chrome: Condensed 700, uppercase, line-height 1, shared block-end margin tokens
- Body scale: 14 → 16 (768) → 18 (1024)

## Scale

Ratio **1.25**. Mobile base **1rem** for `h6`. At **1024px+**, base **1.125rem** (tracks body bump).

| Level | Mobile | ≥1024 |
|-------|--------|-------|
| h6 | 1rem | 1.125rem |
| h5 | 1.25rem | 1.40625rem |
| h4 | 1.5625rem | 1.7578125rem |
| h3 | 1.953125rem | 2.197265625rem |
| h2 | 2.44140625rem | 2.74658203125rem |
| h1 | 3.0517578125rem | 3.4332275390625rem |

Tokens: `--or-type-h1-size` … `--or-type-h6-size`. Remove `--or-type-heading-size`.

## Narrow containers

When the nearest containment context is **≤30rem (480px)** wide, every `h1`–`h6` is **−2px** (`calc(var(--or-type-hN-size) - 0.125rem)`).

Containment: `.custom-sidebar` (`container-name: or-narrow`) and existing `.or-section`. Not a separate sidebar scale — width-driven only.

## Align

- Naked `h1`–`h6`: `text-align: center` below 768px; `start` at 768px+ (same breakpoint as past-events list centering).
- Headings inside card/container shells inherit parent `text-align` (list in `typography.scss`: `.event-details`, `.video-details`, `.card*`).

## Margin-block-end stair

Per-level tokens `--or-type-h1-margin-block-end` … `--or-type-h6-margin-block-end` (larger levels get more space). Bumps at 768 and 1024.

## Out of scope

Markup level changes; Perfect Fourth / other ratios; class-based title type; sidebar-only parallel type scale.

## Product CMS exception (pull quotes)

BC **Shout** custom fields and product description HTML often wrap quotes in bare `h2`/`h3`. Those are **not** section titles. In `typography.scss`, headings inside `.book-review-details` and `.product-desc` use `--or-type-pullquote-size` (18 → 20 @768 → 24 @1024) while keeping heading chrome. Accordion titles (`.product-desc-title`, `.accordion-title`) stay on the Major Third scale.
