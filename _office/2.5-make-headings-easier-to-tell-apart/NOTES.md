# 2.5 — Make headings and titles easier to tell apart

<!-- Agent-oriented delivery memo. Not a build log. Research / parked — not implemented. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.5` |
| **taskKey** | `d9a285fd-c112-4962-be45-5bbb594dc1d3` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/d9a285fd-c112-4962-be45-5bbb594dc1d3 |
| **Branch** | (none yet — park until Wave 1 2.5 start) |
| **Deploy** | N/A |
| **Briefboard status** | `planned` — card copy updated sitewide (2026-07-28); theme work not started |

## Client ask (original)

Section heads / book titles / pull quotes too similar; everything fights. Evidence was PDP (`Run Zohran Run`). Card reframed sitewide: body copy also competes with headings on book detail **and** author pages.

## Research notes (2026-07-28, during 2.3)

Parked here so 2.3 stays squash-only.

### Author single-page type scale

Measured Finkelstein / Hamm at ~1920px:

| Element | Size |
|---------|------|
| Name (H1) | ~44px |
| Bio paragraph | ~25px |
| Accordion titles | ~25px |
| Accordion body | ~20px |
| Site `body` | 14px |

Bio ≈ accordion heads → hierarchy flat. Cause: long breakpoint staircases in `authors.scss` (bio `14→18→25`, title →44, accordion →25 at `xxlarge`).

### Heading system half-migrated

Wave 1.2.2 / 2.2 introduced `.or-heading` for section strips. Some CMS / Events surfaces still use bare `h2` (e.g. **Upcoming Events**) after Condensed styles were stripped — type looks unfinished until either:

1. Apply `.or-heading` (or equivalent) on those templates, **or**
2. Restore a single global `h*` scale under 2.5’s type system.

Do **not** invent a parallel heading path. One scale sitewide.

### Recommended scope when work starts

- One type scale: heads, titles, quotes, body — book PDP, author pages, Events/CMS long-form.
- Dial back author bio / accordion stairs so body sits clearly under heads.
- Finish bare-`h*` vs `.or-heading` migration as part of that scale (not a separate drive-by).

## Delivered (final state)

Nothing on storefront yet. BB **problem** / **recommendation** updated to sitewide wording; evidence media still linked.

## Client action needed

- [ ] None until implementation starts.

## Related / follow-up

- **2.3** — media list squash (separate; done locally).
- **5.2** — Featured Author slider typography (Wave 3; do not fold into 2.5 unless card says so).
