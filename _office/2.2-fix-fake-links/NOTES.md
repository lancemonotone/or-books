# 2.2 — Fix text that looks like a link but is not

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.2` |
| **taskKey** | `553ddbd1-fe57-4788-ad5f-0d2727de1ebf` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/553ddbd1-fe57-4788-ad5f-0d2727de1ebf |
| **Branch** | `feature/wave1-2.2-section-heads` (+ follow-ups merged → `staging` → `main`) |
| **Tip** | page-scroll product carousels (`orProductCarouselSettings`) |
| **Key commits** | `3376838` section-head · `5b5850c` arrows on carousel · `67e6820` `.or-heading` · `f9b67d2` slider shells + block buttons · `3664381` equal-height cards · page-scroll = full page per arrow |
| **Deploy** | On `main` locally; storefront still Wave 1 batch `stencil push` |
| **Briefboard status** | `complete` — delivery comment + follow-up note on full-page carousel advance (2026-07-27) |

## Client ask (original)

“See all” and some section titles looked like links but did nothing on tap (especially mobile). Real links like Latest News were hard to distinguish. Antara [P1]: make real links like the desktop version.

## Delivered (final state)

- **Section head:** plain title + black **See all** minibutton. Same layout for every strip (slider or not). Title is **not** a link — only See all is.
- **Heading type:** shared `.or-heading` atom (`headings.scss`). No letter-spacing on strip titles (tracking tokens zeroed sitewide).
- **Slider chrome:** arrows on the **carousel** only (left/right, vertically centered) with gutter padding. Never in the title row. Class: `.or-section--slider`.
- **Slider DOM contract:** `or-section--slider` → `or-section-head` → slick root (no junk wrappers). AJAX injects `ul.productCarousel` as head’s next sibling. Sidebar Events use `--slider` too.
- **Equal-height cards:** flex stretch in `slider-chrome.scss` so slides in a row match height; quick-view icons align at the bottom (CSS, not the old JS height equalizer).
- **Full-page advance:** product carousels scroll a whole page per arrow (`slidesToScroll` matches `slidesToShow`: 3 / 2 / 1 by breakpoint) via shared `orProductCarouselSettings` in `home.js`.
- **Block CTAs:** View Catalog, Read Now, event/video primaries share `.or-btn` / `.or-btn-block`.
- **Vertical rhythm:** `.or-flow` on home sidebar + main column.
- **Applied to:** Forthcoming, Bestsellers, In Focus, Latest News, Recent events/video, sidebar Videos/Events; **Reading Lists** = same head, no slider class.
- **Category See all:** AJAX fills `href` when the category URL resolves.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| Fix taps on existing “See all” links | Shared **section head** molecule | Absolute See all sat under Slick on mobile; one pattern is maintainable. |
| Title + See all both clickable | Title plain; only See all links | Clear CTA; heads identical with/without sliders. |
| Task scope = link fix only | Also section/slider/heading/flow/buttons/equal-height/page-scroll | Design system + bugs found while reviewing heads. |
| Arrows in / near title row (early pass) | Arrows on carousel sides | Client: title row must not change for slider vs non-slider. |

## Client action needed

- [x] None blocking implementation.
- [ ] **Review** when Wave 1 batch is pushed — See all on mobile/desktop; arrows on carousels; equal-height cards; arrow advances a full page of cards; heads match Reading Lists vs Bestsellers.
- [ ] **4.8 (later):** slider **dots** sitewide — separate task.

## Verify

Local: `http://localhost:3000/` — hard refresh.

- Sidebar **Latest News** + **Reading Lists**: title + See all; only See all navigates.
- Product strips: equal card heights; magnifiers aligned; **next/prev jumps a full page** (3 cards desktop, 2 mid, 1 narrow).
- Main strips: slick root under head; arrows clear of covers.
- Mobile ~390px: See all navigates (does not advance carousel).

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change files | `templates-archive/` (baseline `9a14f93`) |
| New files (delete to undo) | `section-head.html`, `section.scss`, `section-head.scss`, `slider-chrome.scss`, `headings.scss`, `flow.scss`, `flow.html` |
| Restore one file | `cp templates-archive/<path> orbooks-theme/<path>` |

## Screenshots / media

None under `_office/2.2-fix-fake-links/` yet. Briefboard has client media `120911.png`, `121002.png`.

## Related / follow-up

- **4.8** — Dots sitewide via `slider-chrome.scss` when approved.
- **5.2** — Featured Author slider typography (separate).
- Catalog `.sale-product-section` still AJAX host on category pages (not `or-section` yet).
