# 4.12 — In the media date and heading

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.12` |
| **taskKey** | `1c4cbf58-1da1-47e7-a439-a71a3c188c8a` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/1c4cbf58-1da1-47e7-a439-a71a3c188c8a` |
| **Branch** | `feature/wave2-4.12-media-date-heading-gap` |
| **Commits** | `0f7a7b0` Tighten date-to-title spacing on listing cards (4.12) |
| **Deploy** | Local only until Wave 2 staging push batch |
| **Briefboard status** | `blocked` (your turn) — delivery comment posted |

## Client ask (original)

In the media: reduce space between the date and news heading; she also asked about centering on the image. Same treatment for News page cards.

## Delivered (final state)

- Less space between the date and the title on shared listing cards (In the media, News, and the same card type elsewhere).
- Date and heading stay left-aligned (not centered on the image).
- Homepage Latest News date size matches `/news/` cards (no longer oversized with the sidebar headline scale).

## Client action needed

- [ ] None for this card’s ask — review In the media / News cards when the Wave 2 batch is pushed

## Verify

- Home Latest News (or In the media): date sits closer to the title; both left-aligned.
- `/news/`: same tighter gap and left alignment on listing cards.
