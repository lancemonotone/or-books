# 2.2 — Fix text that looks like a link but is not

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.2` |
| **taskKey** | `553ddbd1-fe57-4788-ad5f-0d2727de1ebf` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/553ddbd1-fe57-4788-ad5f-0d2727de1ebf |
| **Branch** | `feature/wave1-2.2-section-heads` |
| **Commits** | `3376838` — unify section heads + See all; `170f8c7` — scaffold `or-flow` (not wired) |
| **Deploy** | Local only until Wave 1 batch `stencil push` |

## Client ask (original)

“See all” and some section titles looked like links but did nothing on tap (especially mobile). Real links like Latest News were hard to distinguish. Antara [P1]: make real links like the desktop version.

## Delivered (final state)

- **Unified section head:** plain title + See all minibutton — **identical** for every section (slider or not). Title not a link.
- **Slider chrome:** arrows stay on the **carousel**, left/right, vertically centered (`.or-section--slider` in `slider-chrome.scss`). Never in the title row.
- **Organism:** `.or-section` wrapper; add `--slider` only when a Slick body is present.
- **Applied to:** Forthcoming, Bestsellers, In Focus, Latest News, Recent events/video, sidebar Videos; **Reading Lists** = same head, no slider class.
- **Molecule files:** `section.scss`, `section-head.html` / `.scss`, `slider-chrome.scss`, `buttons.scss`.
- **Category heads:** AJAX upgrades See all `href` when category URL resolves.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| Fix taps on existing “See all” links | Rebuilt as one shared **section head** pattern sitewide on touched strips | Absolute-positioned See all sat under Slick on mobile; markup was inconsistent (title only, See all in carousel partial, In Focus different again). One molecule is easier to maintain and matches design-language modularization. |
| See all as its own link | Title plain; only See all links | Clear CTA; heads match with/without sliders. |
| Task scope = link fix only | Also **`.or-section`** + **slider-chrome** (side arrows) + **`.or-flow`** scaffold | Shared design system, not per-strip one-offs. |
| Sidebar heads different | Same head molecule as main | One pattern sitewide. |

## Client action needed

- [x] None blocking implementation.
- [ ] **Review on staging** when Wave 1 batch is pushed — tap section heads (title + See all) on mobile and desktop.
- [ ] **4.8 (later):** slider dots vs arrows — client already chose **dots** on Briefboard; unifying carousel chrome is a separate task, not part of 2.2.

## Verify

Local: `http://localhost:3000/` — hard refresh.

- Sidebar **Latest News** and **Reading Lists**: one row, black See all button, whole row links to `/news/` and `/reading-lists/`.
- Main column **Forthcoming**, **Bestsellers**, **In Focus**: same pattern; See all goes to category or reading-list URL.
- Mobile ~390px: tap center of row — should navigate (not advance carousel).

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change files (2.2 first touch) | `templates-archive/` — `category-sidebar-image.html`, `categoty-products.html`, `home-event.html`, `recent-home.html`, `recent-video.html`, `featured.html` (baseline `9a14f93`) |
| Also changed (archived earlier by 2.1) | `home.html`, `home.scss`, `home.js` — same tree; restore undoes all project edits on that path |
| New files (delete to undo) | `templates/components/orbooks/section-head.html`, `assets/scss/or-books/section.scss`, `assets/scss/or-books/section-head.scss`, `assets/scss/or-books/slider-chrome.scss`, `assets/scss/or-books/flow.scss`, `templates/components/orbooks/flow.html` |
| Restore one file | `cp templates-archive/<path> orbooks-theme/<path>` |

## Screenshots / media

None in `_office/2.2-fix-fake-links/` yet. Briefboard task has client media `120911.png`, `121002.png`.

## Related / follow-up

- **4.8** — Switch `.or-slider-nav` to dots sitewide when client approves (slot + SCSS stub ready).
- **5.2** — Featured Author slider typography (separate).
- **`or-flow`** — wire on `.custom-content`, `.page-content`, etc. when ready to replace ad-hoc section margins.
