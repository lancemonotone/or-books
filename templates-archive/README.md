# Theme originals (pre–subjects / design-system pass)

Snapshots from git **HEAD before this work**. Outside `orbooks-theme/` so Stencil zip/push never includes them.

Paths mirror `orbooks-theme/` (drop the `orbooks-theme/` prefix here).

Task notes + screenshots for this pass: `_office/2.1-label-or-replace-subjects-icons/`.

## Restore one file

```bash
cp templates-archive/templates/pages/home.html orbooks-theme/templates/pages/home.html
```

## Restore everything from this archive

From repo root:

```bash
cp -R templates-archive/templates/. orbooks-theme/templates/
cp -R templates-archive/assets/. orbooks-theme/assets/
```

## New files in this pass (no original — delete to undo)

- `orbooks-theme/templates/components/orbooks/subjects-nav.html`
- `orbooks-theme/assets/scss/or-books/subjects.scss`
- `orbooks-theme/assets/scss/or-books/buttons.scss`
- `docs/design-language.md`
