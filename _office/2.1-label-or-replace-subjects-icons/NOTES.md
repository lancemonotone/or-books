# 2.1 — Label or Replace the Subjects icons

Briefboard: Wave 1 task **2.1**  
Live board: https://lancemonotone.com/or-books/app/?i=1#/task/280a567f-7694-47ee-8d72-402e68da199d  
Branch work: `feature/wave1-2.1-subjects-icons` (local; not live on orbooks.com until Wave 1 batch push)

## Client ask (Antara)

In-house imagery; remove SUBJECTS heading; subject list under a View More accordion [P1].

## What we shipped locally (and why)

### Subjects → text list

Replaced the icon grid with labeled subject links (same idea as the Fiction category sidebar). Dropped the SUBJECTS heading. Under the list: a real **View Catalog** button (the old “View All Subjects” control was misleading — it only sent people to `/catalog/`).

Shared molecule: `orbooks-theme/templates/components/orbooks/subjects-nav.html` + `assets/scss/or-books/subjects.scss`. Button atom: `or-btn` / `or-btn-block` in `buttons.scss`. Design notes: `docs/design-language.md`.

### Why the full list, not a View More accordion

The original problem was that people couldn’t tell what each subject was. Hiding names behind expand/collapse would keep that friction. Showing every subject as a plain link means one scroll, no extra tap to discover the list. If the open list feels too long, we can trim or regroup later — starting hidden didn’t match the goal.

### Why Featured Title moved under Subjects

Subjects are how people browse the catalog, so they come first in the sidebar. Featured Title is a promo for one book; it was competing for the top of the column. It now follows the subject list. Longer term: Featured Title as a hero in the main column (not decided / not done).

### Why the sidebar no longer has its own scrollbar

The old sidebar locked to a short sticky box with an inner scroll. With a full subject list (plus Featured Title, news, etc.) that meant fighting a tiny scrollbar while the rest of the page scrolled separately. The column now grows with the page: one scroll shows everything.

## Screenshots (local preview)

| File | Notes |
|------|--------|
| `2.1-subjects-home-sidebar.png` | Desktop homepage — subjects list, View Catalog, Featured Title below |
| `2.1-subjects-home-sidebar-mobile.png` | Mobile |

## Rollback (theme originals)

Pre-change theme files live in repo-root `templates-archive/` (not zipped with Stencil). See `templates-archive/README.md`.
