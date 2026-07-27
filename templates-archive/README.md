# Theme originals (rollback)

**Read-only rollback copies.** Not a second working tree. Not where shipped or in-progress code lives.

Live theme code stays in `orbooks-theme/` only. Snapshots live **outside** `orbooks-theme/` so Stencil zip/push never includes them.

Paths mirror `orbooks-theme/` (drop the `orbooks-theme/` prefix when copying back).

Task delivery notes: `_office/<task-slug>/NOTES.md` — see `_office/README.md`.

## Agent contract (mandatory)

| Do | Do not |
|----|--------|
| On the **first** project edit to a theme file, copy its **true original** (pre–Wave 1 baseline, commit `9a14f93`) into this tree at the matching path | Put new, modified, or “current” theme files here |
| **Skip** if that path already exists here (write-once per file) | Create per-task subfolders (`templates-archive/2.2-…/`) |
| List **new files** introduced by a task in that task’s `NOTES.md` (delete from `orbooks-theme/` to undo) | Overwrite an existing archived original |
| Use **git** for per-task partial undo | Expect this tree to hold multiple versions of the same path |

**One tree → one original per path.** Restoring a file from here undoes **all** project changes on that path (2.1, 2.2, …). Per-task rollback of only part of a file is a git concern.

**Baseline:** `9a14f93` (theme init in this repo). Files that did not exist at init have no archive entry — remove the new file to undo.

## Archived paths

| Path | First touched by |
|------|------------------|
| `templates/pages/home.html` | 2.1 |
| `templates/components/category/sidebar.html` | 2.1 |
| `templates/components/orbookshome/subject_sidebar.html` | 2.1 |
| `assets/js/theme/custom/home.js` | 2.1 |
| `assets/scss/or-books/home.scss` | 2.1 |
| `assets/scss/or-books/theme.scss` | 2.1 |
| `assets/scss/or-books/header.scss` | 2.1 |
| `assets/scss/or-books/common.scss` | 2.1 |
| `assets/scss/or-books/pages.scss` | 2.1 |
| `assets/scss/or-books/authors.scss` | 2.1 |
| `assets/scss/or-books/pdp.scss` | 2.1 |
| `templates/components/orbooks/category-sidebar-image.html` | 2.2 |
| `templates/components/orbooks/categoty-products.html` | 2.2 |
| `templates/components/orbookshome/home-event.html` | 2.2 |
| `templates/components/orbookshome/recent-home.html` | 2.2 |
| `templates/components/orbookshome/recent-video.html` | 2.2 |
| `templates/components/products/featured.html` | 2.2 |
| `templates/layout/base.html` | 1.2 |

## New files (no archive — delete to undo)

| Path | Introduced by |
|------|----------------|
| `templates/components/orbooks/subjects-nav.html` | 2.1 |
| `assets/scss/or-books/subjects.scss` | 2.1 |
| `assets/scss/or-books/buttons.scss` | 2.1 |
| `templates/components/orbooks/section-head.html` | 2.2 |
| `assets/scss/or-books/section-head.scss` | 2.2 |
| `assets/scss/or-books/flow.scss` | 2.2 |
| `templates/components/orbooks/flow.html` | 2.2 |

## Other artifacts

| Task | Location | Notes |
|------|----------|--------|
| **1.2** Helvetica | `_office/1.2-helvetica-removal/` | Email thread, cutover status, trial `base.*.hbs` variants |
| **or-flow** scaffold | `docs/design-language.md` | Wiring notes; class not on live wrappers yet |

## Restore one file

```bash
cp templates-archive/templates/pages/home.html orbooks-theme/templates/pages/home.html
```

## Restore everything in this tree

```bash
cp -R templates-archive/templates/. orbooks-theme/templates/
cp -R templates-archive/assets/. orbooks-theme/assets/
```

Then remove any **new files** listed above that the rollback should drop.
