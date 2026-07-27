# 2.2 — Fix text that looks like a link but is not

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.2` |
| **taskKey** | `553ddbd1-fe57-4788-ad5f-0d2727de1ebf` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/553ddbd1-fe57-4788-ad5f-0d2727de1ebf |
| **Branch** | `feature/wave1-2.2-section-heads` (merged → `staging` → `main`) |
| **Tip on main** | `f9b67d2` — Unify section slider shells and shared block button styles |
| **Key commits** | `3376838` first section-head pass · `5b5850c` heads identical, arrows on carousel · `620e05c` kill card-body equal-height · `67e6820` `.or-heading` · `8baefec` pin quick-view · `f9b67d2` slider DOM + block buttons |
| **Deploy** | On `main` locally; storefront still Wave 1 batch `stencil push` |
| **Briefboard status** | `complete` (2026-07-27) — delivery comment already posted; **no further BB comment** for post-complete polish (office NOTES only) |

## Client ask (original)

“See all” and some section titles looked like links but did nothing on tap (especially mobile). Real links like Latest News were hard to distinguish. Antara [P1]: make real links like the desktop version.

## Delivered (final state)

- **Section head:** plain title + black **See all** minibutton. Same layout for every strip (slider or not). Title is **not** a link — only See all is.
- **Heading type:** shared `.or-heading` atom (`headings.scss`). No letter-spacing on strip titles (and heading tracking tokens zeroed sitewide).
- **Slider chrome:** arrows on the **carousel** only (left/right, vertically centered) with side padding so they don’t cover covers. Never in the title row. Class: `.or-section--slider`.
- **Slider DOM contract:** every section slider is `or-section--slider` → `or-section-head` → **slick root** (no `innersection` / `inner-featured` / empty AJAX hosts). AJAX injects `ul.productCarousel` as the head’s next sibling. Sidebar Events also use `--slider`.
- **Block CTAs:** View Catalog, Read Now, event/video primary buttons share `.or-btn` / `.or-btn-block` (legacy page type overrides scoped off).
- **Vertical rhythm:** `.or-flow` on home sidebar + main column.
- **Product cards:** removed equal-height JS; quick-view pinned to card bottom; empty `<h5 class="feature-heading">` removed.
- **Applied to:** Forthcoming, Bestsellers, In Focus, Latest News, Recent events/video, sidebar Videos/Events; **Reading Lists** = same head, no slider class.
- **Category See all:** AJAX fills `href` when the category URL resolves.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| Fix taps on existing “See all” links | Rebuilt as one shared **section head** on touched strips | Absolute See all sat under Slick on mobile; markup was inconsistent. One molecule is maintainable and matches design-language modularization. |
| Title + See all both clickable | Title plain; only See all links | Clear CTA; heads look identical with/without sliders. |
| Task scope = link fix only | Also `.or-section`, slider-chrome, `.or-heading`, `.or-flow`, equal-height removal, Read Now / Catalog → `.or-btn`, unified slider shells | Shared design system instead of per-strip one-offs; follow-on UI bugs found while reviewing heads. |
| Sidebar heads different | Same head + heading type as main | One pattern sitewide. |
| Arrows in / near title row (early pass) | Arrows stay on carousel sides | Client: title row must not change for slider vs non-slider. |

## Client action needed

- [x] None blocking implementation.
- [ ] **Review on staging** when Wave 1 batch is pushed — tap **See all** on mobile and desktop; confirm arrows sit on carousels only; heads match Reading Lists vs Bestsellers.
- [ ] **4.8 (later):** slider **dots** sitewide — client already chose dots on Briefboard; separate task, not part of 2.2.

## Verify

Local: `http://localhost:3000/` — hard refresh (theme watch covers CSS/JS).

- Sidebar **Latest News** + **Reading Lists**: title + See all; only See all navigates (`/news/`, `/reading-lists/`).
- Latest News: arrows mid-sides on the news body; Read Now matches Catalog button type.
- Main **Forthcoming**, **Bestsellers**, **In Focus**: same head; slick root directly under head; arrows clear of cards; See all → category or reading-list URL.
- Mobile ~390px: tap See all — navigates (does not advance carousel).
- Strip titles: uppercase condensed, **no** letter-spacing stretch.

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change files (2.2 first touch) | `templates-archive/` — `category-sidebar-image.html`, `categoty-products.html`, `home-event.html`, `recent-home.html`, `recent-video.html`, `featured.html` (baseline `9a14f93`) |
| Also changed (archived earlier by 2.1) | `home.html`, `home.scss`, `home.js` — same tree; restore undoes all project edits on that path |
| New files (delete to undo) | `templates/components/orbooks/section-head.html`, `assets/scss/or-books/section.scss`, `assets/scss/or-books/section-head.scss`, `assets/scss/or-books/slider-chrome.scss`, `assets/scss/or-books/headings.scss`, `assets/scss/or-books/flow.scss`, `templates/components/orbooks/flow.html` |
| Restore one file | `cp templates-archive/<path> orbooks-theme/<path>` |

## Screenshots / media

None stored under `_office/2.2-fix-fake-links/` yet. Briefboard task has client media `120911.png`, `121002.png`.

## Related / follow-up

- **4.8** — Dots sitewide via `slider-chrome.scss` when approved (heads stay title + See all only).
- **5.2** — Featured Author slider typography (separate).
- **Page H1s** — category/blog/CMS still use `.page-heading` with page-specific sizes; letter-spacing already zeroed. Convert to `.or-heading` / modifiers in a later pass if desired.
- Catalog `.sale-product-section` still an AJAX host on category pages (not `or-section` yet).
