# 2.3 — Stop squashing images in media lists

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.3` |
| **taskKey** | `b57d706d-de6d-46d7-8e3f-6452f175c362` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/b57d706d-de6d-46d7-8e3f-6452f175c362 |
| **Branch** | `feature/wave1-2.3-media-list-images` merged → `staging` |
| **Commits** | `a5d3a34` Stop squashing media-list thumbnails in In the media accordions |
| **Deploy** | On staging storefront. Not orbooks.com until they ship. |
| **Briefboard status** | `blocked` — client approved 14 Aug 2026 (“great, can go live”). Nothing left on this card. |

## Client ask (original)

Images in media list cards look vertically squashed. The same image looks correct on the full article page.

Evidence: `briefboard/media/123202.png`, `123215.png`, `161534.png`.

## Root cause

`.accordion-desc .custom-blog-list .blog-thumbnail img` had `max-height: 130px` in `assets/scss/or-books/common.scss`. That rule only applied to **In the media** lists inside product/author accordions — not to the full news article page.

General `.blog-list` styles in `news.scss` already had `max-height: 130px` commented out; the accordion override was the leftover squasher.

## Delivered

- Removed the accordion-only `max-height: 130px` block from `common.scss`.
- List thumbnails follow natural image proportions (same idea as full article page), not a forced short strip.
- Small adjacent cleanup on the same files: author-only pagination font + dead author scrollbar hide moved/commented toward `authors.scss` (not part of the squash ask).

## Diverged from ask (if any)

None for the squash fix. Author CSS tidy is extra hygiene on files already open for 2.3.

## Client action needed

None. Approved for live when they ship.

## Verify

Staging (or local): author (e.g. Theodore Hamm) or product with media → expand **In the media**.

- Thumbnails are not vertically compressed.
- Same image on `/news/…` article page matches list proportions (wide banners stay wide).

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change file | `templates-archive/assets/scss/or-books/common.scss` (already archived) |
| Restore | `cp templates-archive/assets/scss/or-books/common.scss orbooks-theme/assets/scss/or-books/common.scss` |

## Related / follow-up

None for this card.
