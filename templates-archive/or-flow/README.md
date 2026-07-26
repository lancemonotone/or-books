# Vertical flow (`.or-flow`) — scaffold

Spacing stack for main columns. **Live templates are not wired yet.**

## CSS

`orbooks-theme/assets/scss/or-books/flow.scss` (imported from `theme.scss`)

## Target wrappers (when enabling)

| Template | File | Add `or-flow` on |
|----------|------|------------------|
| Home | `templates/pages/home.html` | `.custom-content` (sidebar optional: `.custom-sidebar`) |
| Category | `templates/pages/category.html` | `.page-content` |
| CMS page | `templates/pages/page.html` | `.page` or `.page-content` |
| Product | `templates/pages/product.html` | `.pdp-js` |
| Blog | `templates/pages/blog.html` | `.page` |

## Partial

`templates/components/orbooks/flow.html` — block wrapper for future use:

```handlebars
{{#> components/orbooks/flow}}
  …sections…
{{/components/orbooks/flow}}
```

Stencil must support partial blocks for that form; until then, add the class on the existing wrapper element.

## Smoke check (manual)

1. Temporarily add `or-flow` to one wrapper in the table.
2. Confirm even gaps between direct children; no double margin from old `margin-top` on sections.
3. Remove the class (keep scaffolding) until the enable step.
