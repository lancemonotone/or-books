# 2.5 — Make headings and titles easier to tell apart

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.5` |
| **taskKey** | `d9a285fd-c112-4962-be45-5bbb594dc1d3` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/d9a285fd-c112-4962-be45-5bbb594dc1d3 |
| **Branch** | `feature/wave1-2.5-headings-type-scale` |
| **Deploy** | Local only until Wave 1 batch `stencil push` |
| **Briefboard status** | `planned` — theme work in progress; no delivery comment yet |

## Client ask (original)

Sitewide: section headings, book titles, pull quotes, and body text are too close in size and weight. Fix the type scale across the storefront.

## Contract (locked)

- **`typography.scss`** = sole source of body + heading type.
- **Bare `h1–h6` only** — shared chrome sitewide (Condensed 700, uppercase); **Major Third (1.25) size + margin stairs**; desktop size base bumps at 1024.
- **Align:** naked headings `center` &lt;768, `start` ≥768. Card shells (`.event-details`, `.video-details`, `.card*`) inherit parent align. ProductView headings use naked contract (not inherit).
- **Narrow CQ:** nearest containment ≤**30rem** → every heading **−2px**. Containment on `.custom-sidebar`, `.or-section`, `.card`.
- **No classes for heading appearance.** JS hook classes OK; no type CSS on them.
- **No `h1–h6` rules outside `typography.scss`.**
- Spec: `docs/superpowers/specs/2026-07-29-heading-major-third-design.md`

## Delivered so far

### Typography system

- Replaced `headings.scss` → **`typography.scss`** (last in `theme.scss`).
- Stripped competing `h*` / title-class type rules sitewide.
- Major Third stairs + margin stairs; global −2px size shift; narrow container −2px via CQ.
- Accordion chrome restored without type (pointer + chevron).

### Events

| URL | Template |
|-----|----------|
| `/events/` | `new-events.html` |
| `/past-events/` | `events.html` |

- Sidebar LOAC graphic (no link); newsletter; optional Upcoming/Past **HTML-commented**; archive CTA; `events.scss`; event titles `h4`.

### Blog / media / cards

- **Removed animated / overlay “read now”** (absolute full-card hover reveal + transform slide). All `.blog-list` CTAs are in-flow `.or-btn`.
- Listing cards share product-card stack (`h4.card-title` → `.card-category-name` → `.card-text`); see Card stack unify below.
- `blog.js`: only runs when `.custom-blog-list` + `.catename`; keeps summary as `.card-text`.
- Product slider titles **`h4.card-title`** (was `h3`).
- Blog post page layout rebuilt (no figure/title overlap); single post still `h1`.
- Featured product: same meta classes as product cards; description + `or-btn` Read More.
- **`productView.scss`**: featured/top-product layout moved out of `home.scss` / `common.scss`.
- Dropped `@container` button size bump that made sidebar/main Read Now disagree.

### Other

- Past-events `ul`: zero pad when centered; indent ≥768.
- `.or-section-head` headings: `margin-block-end: 0`.

### Card stack unify (listing)

Target = author books accordion product card text stack.

| Slot | Product card | Blog / media listing | Featured home product |
|------|--------------|----------------------|------------------------|
| Title | `h4.card-title` | `h4.card-title` | `h4.productView-title.card-title` |
| Meta | `.card-category-name` (sub-heading) | `.card-category-name.blog-date` | `.card-category-name` (sub-heading) |
| Secondary | `.card-text` (author) | `.card-text` (summary, JS only) | `.card-text.productView-brand` |
| CTA | quickview (unchanged) | in-flow `.or-btn` | `.or-btn` Read More |

- Image→title gap: `.card-body` `padding-block-start: 1.25rem` (was 10px).
- Shared meta type in `common.scss` for `.blog-list` + `.top-product`.
- Single blog post page still `h1` + date under title (not card stack).

### PDP meta stack (book page)

- Title: `<h2 class="productView-title">` — class kept for JS hook only; no type CSS on class.
- Subtitle / author / short description: bare `<p>` (body type).
- Shouts: bare `<blockquote>`; nested CMS `h*`/`span` reset to body in `typography.scss`.
- Stripped `pdp.scss` type stairs for `.title-main`, `.short-dec`, subtitle `.productView-info-value`, shout attributions.

## Still to do

- Browser verify pass (author accordion, in-the-media, Latest News, featured product, PDP meta).
- Roll same bare markup to quick-view / default-pdp when ready.
- BB **3.1** (deferred): logo `h1` every page; content titles → `h2`.
- BB delivery; Wave 1 `stencil push`.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| Flat “one look” then richer stairs | Major Third + narrow CQ | Iterated with human after flat scale felt too flat |
| (none) Events / blog CTA cleanup | Events templates + killed overlay read button | Found while verifying headings |

## Client action needed

- [ ] None until verify pass + push.
- [ ] Later: confirm optional Upcoming/Past list live vs commented between shows.

## Verify

- Home: section `h2`, product cards `h4`, Latest News `h4` + in-flow read.
- Author / PDP “in the media”: GraphQL cards, no hover overlay.
- `/news/{slug}/`: two-column header, no title-over-image.
- `/events/`, `/past-events/`.

## Theme archive / new files

| Kind | Location |
|------|----------|
| New | `orbooks-theme/assets/scss/or-books/typography.scss` |
| New | `orbooks-theme/assets/scss/or-books/events.scss` |
| New | `orbooks-theme/assets/scss/or-books/productView.scss` |
| Removed | animated blog `.read-btn` overlay styles (`news.scss`) |

## Related

- **5.2** — Featured Author slider (Wave 3).
- Events optional-block workflow — HTML comments in `new-events.html`.
