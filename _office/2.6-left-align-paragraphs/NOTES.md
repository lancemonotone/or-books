# 2.6 — Left-align long paragraphs on mobile

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.6` |
| **taskKey** | `030cf68c-ad0d-4b9f-8c65-f0471faf263b` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/030cf68c-ad0d-4b9f-8c65-f0471faf263b |
| **Branch** | `feature/wave1-2.6-left-align-paragraphs` |
| **Commits** | `dbbe191` Share shout blockquotes via typography; About matches PDP cite markup. · `933bb40` Unify list cards, newsletter CTAs, and body paragraph alignment. · `804b67e` Keep list-card titles centered through tablet; restore row padding. |
| **Deploy** | Local only until Wave 1 batch `stencil push` |
| **Briefboard status** | `planned` — delivery comment posted; estimate 0.5h, `actual_hours` already 1 |
| **Estimate note** | Ran longer than 0.5h — many CMS/category templates needed the same alignment + shared layout contract, not a single CSS tweak |

## Client ask (original)

Long text on About and legal pages is harder to read when alignment jumps around on a narrow screen. Left-align paragraphs; reserve centered text for short labels only. Client tagged **[P1]**.

## Delivered (final state)

### Paragraph alignment (core ask)

- Sitewide body paragraphs left-align (`text-align: start`).
- CMS page bodies use a proper `.page-body` wrapper (no illegal `<p>` wrapping whole page HTML) on default page, contact, events, videos.
- About `.pagetext` no longer owns text-align — spacing/size only.
- Design-language Body row updated to match.

### Related polish on the same pages (scope growth)

While applying the alignment contract across templates, these shared surfaces were brought onto one pattern:

- **About / shout quotes** — shared blockquote + cite markup with PDP; dropped duplicate About store `h1`.
- **Sidebar / stack CTAs** — About, booksellers, rights use shared `.or-btn` / `.or-btn-block`; block buttons center correctly in stacks (foundation adjacent-button margin quirk fixed).
- **Mailchimp newsletter CTAs** — shared `.or-newsletter` molecule (booksellers, subsidiary-rights, events); same gray panel language as home subscribe shell. Home “Join Our Mailing List” stays the BigCommerce form (not Mailchimp).
- **Product cards (Rights / Booksellers / Merchandise)** — Unified to shared grid `orbooks/card` (image on top) via `category/product-listing`. Rights renders on card when field present; booksellers still hides it via page CSS. Deleted `orbooks/category-listing`.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| Left-align long paragraphs on About/legal | That, plus shared buttons, newsletter CTAs, and list-card layout on pages touched while applying the contract | Same pages mixed center/left and one-off layouts; fixing only `p` left half-broken surfaces |

## Client action needed

- [ ] None until Wave 1 push; then spot-check About, a legal/CMS page, Subsidiary Rights, Merchandise, Events newsletter CTA on phone + desktop.

## Verify

| Surface | Local URL | Look for |
|---------|-----------|----------|
| About | `/about/` | Body copy left; sidebar buttons full-width stack; shout cites match PDP pattern |
| CMS / legal | any content page | Paragraphs start-aligned; no broken nested `<p>` |
| Subsidiary Rights | `/subsidiary-rights/` | Grid cards (image on top); Rights text when field present; newsletter CTA |
| Merchandise | `/merchandise/` | Same grid card (full width — no sidebar) when custom template mapped |
| Booksellers | `/booksellers/` | Same grid card; Rights field present but hidden by `.book-seller` CSS |
| Events | `/events/` | Mailchimp CTA uses shared newsletter molecule |

Phone (~390) and tablet (~768–1024): body paragraphs stay left; product cards use shared grid stack.

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change theme files | `templates-archive/` — write-once originals if not already archived; do not overwrite |
| New files (delete to undo) | `orbooks-theme/assets/scss/or-books/newsletter.scss` |

## Screenshots / media

| File | Notes |
|------|--------|
| — | None captured this pass |

## Related / follow-up

- 2.5 typography contract — paragraph align lives in `typography.scss` alongside heading scale.
- Home mailing-list form is not a Mailchimp eepurl CTA; do not force it into `.or-newsletter--cta`.
