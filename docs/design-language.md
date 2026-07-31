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
  - `or-btn` — one rule in `buttons.scss` (`.or-btn.button`): Condensed bold, uppercase, `--or-btn-max-inline: 25rem`
  - `or-btn-block` — modifier on same rule: fill parent up to cap, `margin-inline: auto`
  - `or-btn-sm` — modifier: compact size tokens (section-head See all)
- **Do not** restyle `.or-btn` in page SCSS (`home`, `pdp`, `category`, …). Layout wrappers only.
- **Keep** BigCommerce `button` / `button--primary` for Theme Editor colors.
- **Convert later:** on any CTA you touch, add `or-btn` (and `or-btn-block` / `or-btn-sm` as needed). Example:

```html
<a class="button button--primary or-btn or-btn-block" href="…">Label</a>
```

Do **not** mass-rewrite every `.button` in the theme until that chunk of work.

## Molecule: Newsletter (`.or-newsletter`)

- **Styles:** `orbooks-theme/assets/scss/or-books/newsletter.scss`
- **Shell:** gray panel (`#f3f3f3`), shared with home `.percentage-main` (form signup).
- **External CTA:** `.or-newsletter.or-newsletter--cta` + `.or-newsletter-title` + `.or-btn-block` (booksellers, rights, events).
- **Do not** restyle in `category.scss` / `events.scss` / `home.scss`.

## Layout: Vertical flow (`.or-flow`)

- **Styles:** `orbooks-theme/assets/scss/or-books/flow.scss`
- **Job:** Column stack whose **gap** owns vertical spacing between direct children (margins zeroed on those children).
- **Modifiers:** `or-flow-tight` · `or-flow-loose`
- **Home:** Wired on `.custom-sidebar` + `.custom-content` — one responsive gap for main + sidebar strips (replaces per-block `margin-top` one-offs).
- **Category:** Wired on sidebar (`.page-sidebar.or-flow`) — Catalog / Featured Title / Reading Lists.
- **Wire later on:** category `.page-content`, CMS `.page` / `.page-content`, product `.pdp-js`, blog `.page`.
- **Gap tokens:** `1.5rem` → `1.75rem` (768) → `2rem` (1024).

## Organism: Section (`.or-section`)

- **Styles:** `orbooks-theme/assets/scss/or-books/section.scss`
- **Job:** Shared shell for any homepage (etc.) block that uses `.or-section-head` + body.
- **Modifier:** `.or-section--slider` when the body is a Slick carousel — enables shared arrow chrome only (does not change the head).

## Typography system (`typography.scss`)

**Only file allowed to set body / heading type.** Loaded last in `or-books/theme.scss`.

| Layer | What |
|-------|------|
| **Tokens** | `--or-text-*` scale; `--or-type-body-*`; `--or-type-pullquote-*`; `--or-type-h1-size`…`--or-type-h6-size` + matching `--or-type-h*-margin-block-end` (Major Third 1.25); heading line |
| **Body** | `body`, `p` — Helvetica stack, body size/line; **`p` always `text-align: start`** (editors need no class). Center only short chrome (headings &lt;768, buttons, cards). |
| **Headings** | bare `h1–h6` — shared chrome (Condensed 700, uppercase); **size + margin stairs** Major Third; **align** center &lt;768, start ≥768; **narrow CQ** ≤30rem → −2px each level; card shells (`text-align: inherit`) |
| **Pull quotes** | Bare `blockquote` > `h3` (quote) + `cite` or legacy `span` (attribution). Group: `.custom-fields-shouts` (top/bottom rules). |
| **Accordion labels** | `.accordion-custom-tabs .accordion-title` / `.product-desc-title` — same pullquote size stair (PDP + author). |)

**Do not** style `h1–h6` in page/component SCSS (not even margin/align). Layout around headings uses parents / flex children (`:first-child`), not heading selectors.

**Markup:** bare heading tags. Classes on headings only for JS hooks; those classes get **no** type CSS.

## Atom: Heading

Covered by the typography system above (not a separate utility class).


## Molecule: Section head (`.or-section-head`)

- **Template:** `orbooks-theme/templates/components/orbooks/section-head.html`
- **Styles:** `orbooks-theme/assets/scss/or-books/section-head.scss` (layout only)
- **Title type:** bare `h*` from `typography.scss`
- **Job:** Plain title + **See all** link. **Same for every section** — whether or not a slider follows.
- **CTA:** Only See all is a link (`button button--primary or-btn or-btn-sm`). Title is not linked.
- **Omit `url`** when AJAX fills `data-or-section-head-pending` on the See all link.
- **Never** includes carousel arrows.

## Molecule: Slider chrome (`.or-section--slider`)

- **Styles:** `orbooks-theme/assets/scss/or-books/slider-chrome.scss`
- **Job:** Shared Slick **arrow** look + placement: on the **carousel**, left/right, vertically centered. Not in the title row.
- **Track:** full-bleed (no side gutter). Arrows overlay the slide edges so block CTAs (`.or-btn-block`) can span the section width.
- **DOM contract (all section sliders — main + sidebar):**
  ```
  .or-section.or-section--slider
    .or-section-head
    [slick root — direct sibling; may keep a semantic class]
  ```
  No intermediate wrappers (`innersection`, `inner-featured`, empty AJAX hosts). AJAX injects the slick root as the next sibling of the head. Optional loader may exist until removed.
- **Slick root classes (semantic, not structure):** `.blog-cont`, `.eventgrid`, `.videomain`, `.productCarousel` / `.newprd`, `.recent-slide`, `.video-slide` — these *are* the carousel element.
- **DOM:** Arrows stay Slick children of the slider (default). No `appendArrows` into the head.
- **Out of contract:** Hero `.heroCarousel`, PDP galleries, page-only banners.
- **4.8 (when approved):** style `.slick-dots` in this same file; heads stay unchanged.
- **Usage:** add `or-section or-section--slider` on the section wrapper. Non-sliders use `or-section` only (e.g. Reading Lists).

## Atom: Button (`.or-btn`)

- **Styles:** `orbooks-theme/assets/scss/or-books/buttons.scss`
- **Block CTA:** `.or-btn-block` — modifier on `.or-btn.button`; fill parent up to `--or-btn-max-inline` (25rem), centered. Font/padding size tokens may still use **container queries** on parent `.or-section` where needed.
- **Compact:** `.or-btn-sm` for section-head See all.

## Molecule: Subjects

- **Template:** `orbooks-theme/templates/components/orbooks/subjects-nav.html`
- **Styles:** `orbooks-theme/assets/scss/or-books/subjects.scss`
- **Classes:** `or-subjects-section`, `or-subjects`, `or-subjects-list`, `or-subjects-item`, `or-subjects-link`
- **One markup path** (home + category sidebar). No `variant` param.
- Shared section head — not a block CTA under the list.

### Rules for this molecule

- Text labels only (no icon grid).
- No expand/collapse; no drop-shadow hover on links (underline / color only).
- Head: **Catalog** + **See all** → `/catalog/`.
- **Full SSR list** when the current page is Catalog root (`category.name === Catalog`) or a Catalog child (`children.is_active` in the Catalog tree). Detect via nav tree — subject URLs are inconsistent (`/catalog/…` vs e.g. `/fiction-poetry-literature/`).
- **Elsewhere** (home + other category sidebars): SSR all children, then set `data-or-subjects-popular="10"`; `home.js` trims to top 10 by bestseller **title** mix. GraphQL fail → leave full SSR list.
- **Alignment:** centered below two-column layout; left-aligned from `medium` (1024) when sidebar is a column.

## Next candidates (later chunks)

- Featured / “big book” block
- News card / byline
- Other CTAs → add `or-btn` as you touch them
- **4.8:** dots sitewide via `slider-chrome.scss` (heads stay title + See all only)

## Naming

Prefix `or-` for OR Books molecules. Prefer full class names in SCSS (no `&__element` BEM concat). Prefer CSS custom properties for spacing/type that change by breakpoint.
