# 4.6 — Featured title image bigger

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.6` |
| **taskKey** | `7fedbc83-deab-49f2-8fce-eccd2016cd3b` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/7fedbc83-deab-49f2-8fce-eccd2016cd3b` |
| **Branch** | `feature/wave2-4.6-featured-title-cover` |
| **Commits** | `60a097e` Enlarge Featured Title cover on phones (4.6) |
| **Deploy** | Local only until Wave 2 staging push batch |
| **Briefboard status** | `blocked` (your turn) — delivery comment posted |

## Client ask (original)

Featured title image should be bigger — same as the other books. On mobile, make the Featured Title cover as large as the other book covers.

## Delivered (final state)

- Below 500px: Featured Title cover capped with an eye-tuned `70cqw` max (full one-slide width was still too large). From 500px up, cover fills the Featured Title column.

## Client action needed

- [ ] None for this card’s ask — review Featured Title on a phone when the Wave 2 batch is pushed

## Verify

- Local home at phone width (~390): Featured Title cover spans the sidebar/column width, not a smaller centered thumbnail.
- Desktop/tablet: cover still fills the Featured Title column as before.
