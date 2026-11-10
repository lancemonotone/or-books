# 4.5 — Mobile: round arrows and auto-scroll

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.5` |
| **taskKey** | `0c36d943-d053-4010-8023-62e6adfc5c57` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/0c36d943-d053-4010-8023-62e6adfc5c57` |
| **Branch** | `feature/wave2-4.5-mobile-arrows-autoscroll` |
| **Commits** | (see branch tip) |
| **Deploy** | Local only until Wave 2 staging push batch |

## Client ask (original)

On mobile, remove the round arrows and have product rows auto-scroll so people can tell the row scrolls.

## Delivered (final state)

- **Phone = below 768px** (theme layout breakpoint).
- **All** `.or-section--slider` rails (Latest News, videos/events sidebar, product rows, recent/video): no arrows below 768; autoplay ~4s; pause on hover/focus.
- Autoplay off when `prefers-reduced-motion: reduce`.
- Arrows stay from 768 up.

## Client action needed

- [ ] None for this card’s ask — check a phone-width product row when the Wave 2 batch is pushed

## Verify

- Local home, viewport &lt; 768: product rows have no arrows; slides advance on their own.
- ≥768: outline arrows still present (4.4).
- Reduced-motion OS setting: no autoplay.

## Related / follow-up

- Next Wave 2 order: **4.8** See all under blocks
