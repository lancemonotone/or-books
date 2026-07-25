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

## Atom: Button (`.or-btn`)

- **Styles:** `orbooks-theme/assets/scss/or-books/buttons.scss`
- **Classes:**
  - `or-btn` — Roboto Condensed bold, uppercase, no letter-spacing stretch on hover
  - `or-btn-block` — full width of parent
- **Keep** BigCommerce `button` / `button--primary` for Theme Editor colors.
- **Convert later:** on any CTA you touch, add `or-btn` (and `or-btn-block` if it should span the container). Example:

```html
<a class="button button--primary or-btn or-btn-block" href="…">Label</a>
```

Do **not** mass-rewrite every `.button` in the theme until that chunk of work.

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
- Sidebar section heading
- Other CTAs → add `or-btn` as you touch them

## Naming

Prefix `or-` for OR Books molecules. Prefer full class names in SCSS (no `&__element` BEM concat). Prefer CSS custom properties for spacing/type that change by breakpoint.
