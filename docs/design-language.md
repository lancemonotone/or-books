# Design language (atomic)

OR Books theme is moving toward a small **component library**: reusable pieces with shared names, so home and category (and later catalog) do not reinvent the same UI.

## Vocabulary

| Layer | Meaning | Example |
|-------|---------|---------|
| **Token** | Named value (space, type size, color) | `--or-subjects-gap` |
| **Atom** | Smallest useful UI bit | `.or-btn` type treatment |
| **Molecule** | Atoms composed into one job | Subjects nav list + optional CTA |
| **Organism** | Page region made of molecules | Home sidebar (subjects + featured book + …) |

We do **not** need a full Storybook yet. Start by naming things in templates + SCSS, then reuse.

## File rule (modular SCSS)

- **New `or-*` atom/molecule** → own file under `orbooks-theme/assets/scss/or-books/` + one `@import` in `theme.scss`.
- **Do not** dump molecule rules into mega page files (`home.scss`, `common.scss`, `category.scss`).
- Page files keep **layout / page-only** glue. Shared UI lives next to its name (`buttons.scss`, `subjects.scss`, `section-head.scss`, …).

## Atom: Button (`.or-btn`)

- **Styles:** `orbooks-theme/assets/scss/or-books/buttons.scss`
- **Classes:**
  - `or-btn` — Roboto Condensed bold, uppercase; flex-centered label; no letter-spacing stretch on hover
  - `or-btn-block` — full width of parent
  - `or-btn-sm` — compact padding (section-head See all)
- **Keep** BigCommerce `button` / `button--primary` for Theme Editor colors.
- **Convert later:** on any CTA you touch, add `or-btn` (and `or-btn-block` / `or-btn-sm` as needed). Example:

```html
<a class="button button--primary or-btn or-btn-block" href="…">Label</a>
```

Do **not** mass-rewrite every `.button` in the theme until that chunk of work.

## Layout: Vertical flow (`.or-flow`)

- **Styles:** `orbooks-theme/assets/scss/or-books/flow.scss`
- **Partial (optional later):** `templates/components/orbooks/flow.html`
- **Job:** Column stack whose **gap** owns vertical spacing between direct children (margins zeroed on those children).
- **Modifiers:** `or-flow-tight` · `or-flow-loose`
- **Status:** Scaffolded and imported. **Not wired** into live page templates yet.
- **Wire later on:** home `.custom-content`, category `.page-content`, CMS `.page` / `.page-content`, product `.pdp-js`, blog `.page`.

## Molecule: Section head (`.or-section-head`)

- **Template:** `orbooks-theme/templates/components/orbooks/section-head.html`
- **Styles:** `orbooks-theme/assets/scss/or-books/section-head.scss`
- **Job:** One link for a home slider / list section — title + mini **See all** CTA (not a nested link).
- **CTA:** `button button--primary or-btn or-btn-sm` (styles in `buttons.scss`; section-head paints hover via parent link).
- **Tap:** Whole control ≥ 44px tall on phone/tablet; CTA is visual only (`pointer-events: none`).
- **Variants:** pass `title_class="sidebar-heading"` in the sidebar; omit `url` when AJAX fills `data-or-section-head-pending`.

## Molecule: Subjects

- **Template:** `orbooks-theme/templates/components/orbooks/subjects-nav.html`
- **Styles:** `orbooks-theme/assets/scss/or-books/subjects.scss`
- **Classes:** `or-subjects`, `or-subjects-title`, `or-subjects-list`, `or-subjects-item`, `or-subjects-link`, `or-subjects-catalog-cta`
- **Variants:** `variant="home"` (full list + View Catalog) · `variant="category"` (title + full list)
- Home CTA uses `or-btn` + `or-btn-block`.

### Rules for this molecule

- Text labels only (no icon grid).
- Full Catalog-child list always visible — no expand/collapse.
- No drop-shadow hover on links (underline / color only).
- Home CTA label: **View Catalog** → `/catalog/`.

## Next candidates (later chunks)

- Featured / “big book” block
- News card / byline
- Other CTAs → add `or-btn` as you touch them

## Naming

Prefix `or-` for OR Books molecules. Prefer full class names in SCSS (no `&__element` BEM concat). Prefer CSS custom properties for spacing/type that change by breakpoint.
