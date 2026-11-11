# 4.15 — Events unscramble — notes

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.15` |
| **taskKey** | `fb5dbe04-8a8d-491c-8154-4f8f81f4d4cd` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/fb5dbe04-8a8d-491c-8154-4f8f81f4d4cd` |
| **Branch** | `feature/wave2-4.15-events-unscramble` |
| **Commits** | `ace4b3f` Restore Events posters: sidebar schedule and two-column flyer grid (4.15) |
| **Deploy** | Staging theme push (not prod) |
| **Briefboard status** | `blocked` (your turn) — delivery comment posted |

## Client ask (original)

Unscramble the broken Events page only. No rebuild from the mockup. She sent posters later.

## Delivered (final state)

- Sidebar shows the Fall 2026 schedule poster.
- Existing top banner stays.
- Three event posters sit under the banner in a two-column grid (one column on phone).
- Newsletter signup and View Events Archive unchanged.

## Client action needed

- [ ] Review Events on staging when the Wave batch is up
- [ ] Know: new/changed posters → Image Manager upload, then theme URL update (same as prior agency). No WP-style gallery loop.

## Before prod

1. Prefer Image Manager URLs over theme asset copies.
2. Remove temporary `orbooks-theme/assets/img/events/` once Image Manager is wired.
3. No prod push until human says so.

## Mention in final client update

Events posters still work the way the previous agency set them up: upload in **Storefront → Image Manager**, then the theme file (`new-events.html`) must point at those URLs. BigCommerce has no Events gallery loop like WordPress; a self-serve Page Builder widget would be separate work.
