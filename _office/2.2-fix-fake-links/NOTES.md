# 2.2 — Fix text that looks like a link but is not

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.2` |
| **taskKey** | `553ddbd1-fe57-4788-ad5f-0d2727de1ebf` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/553ddbd1-fe57-4788-ad5f-0d2727de1ebf |
| **Branch** | `fix/wave1-2.2-titles-reading-list` → `staging`. Earlier: `feature/wave1-2.2-section-heads` merged. |
| **Tip** | page-scroll product carousels (`orProductCarouselSettings`) |
| **Key commits** | `3376838` section-head · `5b5850c` arrows on carousel · `67e6820` `.or-heading` · `f9b67d2` slider shells + block buttons · `3664381` equal-height cards · this close-out: smaller desktop heads, hide Reading Lists widget, leftover section labels on shared head |
| **Deploy** | Staging storefront for Wave 1 review. Not orbooks.com until approval. |
| **Briefboard status** | `blocked` — Aug 14 follow-up done on our side; pending client |

## Client ask (original)

“See all” and some section titles looked like links but did nothing on tap (especially mobile). Real links like Latest News were hard to distinguish. Antara [P1]: make real links like the desktop version.

Aug 14 follow-up: quieter See all; Featured Title stays on top; section titles a bit smaller on desktop; hide Reading List for now.

## Delivered (final state)

- **Section head:** plain title + **See all** minibutton. Same layout for every strip (slider or not). Title is **not** a link — only See all is.
- **Heading type:** shared `.or-heading` atom (`headings.scss`). No letter-spacing on strip titles (tracking tokens zeroed sitewide).
- **Slider chrome:** arrows on the **carousel** only (left/right, vertically centered) with gutter padding. Never in the title row. Class: `.or-section--slider`.
- **Slider DOM contract:** `or-section--slider` → `or-section-head` → slick root (no junk wrappers). AJAX injects `ul.productCarousel` as head’s next sibling. Sidebar Events use `--slider` too.
- **Equal-height cards:** flex stretch in `slider-chrome.scss` so slides in a row match height; quick-view icons align at the bottom (CSS, not the old JS height equalizer).
- **Full-page advance:** product carousels scroll a whole page per arrow (`slidesToScroll` matches `slidesToShow`: 3 / 2 / 1 by breakpoint) via shared `orProductCarouselSettings` in `home.js`.
- **Block CTAs:** View Catalog, Read Now, event/video primaries share `.or-btn` / `.or-btn-block`.
- **Vertical rhythm:** `.or-flow` on home sidebar + main column.
- **Applied to (home):** Forthcoming, Bestsellers, In Focus, Latest News, Recent events/video, sidebar Videos/Events.
- **See all:** compact outline (not solid black). Featured Title stays at the top of the home sidebar (also 2.1). No See all when there is no destination (Featured Title, Related Interest).
- **Section titles:** desktop size locked to the pre-1024 h2 (`--or-type-section-head-size`); mobile/tablet unchanged. Page titles still bump at 1024.
- **Reading Lists** sidebar widget (home + catalog) hidden until the client asks to restore. Footer + `/reading-lists/` pages unchanged. In Focus main-column strip left visible.
- **Same section-head on leftover labels:** Related Interest (book pages), Bestsellers on Catalog / no-sidebar templates, In Bookstores, Latest Catalog, Live on Ave C 2026. Upcoming / Past Events and Featured news wired the same way inside still-commented blocks.
- **Category See all:** AJAX fills `href` when the category URL resolves. Catalog Bestsellers uses the same slider host as home.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| Fix taps on existing “See all” links | Shared **section head** molecule | Absolute See all sat under Slick on mobile; one pattern is maintainable. |
| Title + See all both clickable | Title plain; only See all links | Clear CTA; heads identical with/without sliders. |
| Task scope = link fix only | Also section/slider/heading/flow/buttons/equal-height/page-scroll | Design system + bugs found while reviewing heads. |
| Arrows in / near title row (early pass) | Arrows on carousel sides | Client: title row must not change for slider vs non-slider. |

## Client action needed

- [ ] Restore Reading Lists sidebar widget when they want it back.
- [ ] **4.8 (later):** slider **dots** sitewide — separate task.

## Verify

Staging storefront (and local `http://localhost:3000/`): hard refresh.

- Home: quieter section titles on desktop; Reading Lists sidebar images gone; Featured Title matches other heads.
- Book page: Related Interest uses the shared head (desktop sidebar + phone stack).
- Catalog: Bestsellers head + See all, same as home.
- `/booksellers/`, `/subsidiary-rights/`, `/events/`: In Bookstores, Latest Catalog, Live on Ave C 2026.

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
