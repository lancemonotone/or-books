# 4.4 — Book arrows in outline, centered on the image

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.4` |
| **taskKey** | `b61cd59f-c535-4fa7-b818-4c0d42c0c2b4` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/b61cd59f-c535-4fa7-b818-4c0d42c0c2b4` |
| **Branch** | `feature/wave2-4.4-book-arrows` |
| **Commits** | `e09bb72` mid-cover + head-edge placement; follow-up shared slider chrome / list contract |
| **Deploy** | Local only until Wave 2 staging push batch |

## Client ask (original)

Keep the book arrows. Draw them as an outline, centered on the book image.

## Delivered (final state)

- Outline look shared from **4.2**.
- Book carousel arrows sit on the **cover mid-line**.
- Book carousel arrows sit under the **section-head left/right edges**, with track gutters so covers clear the controls.
- Shared section-slider chrome (one clearance recipe); section sliders use `ul > li` slides; hover slide stacks above neighbors.

## Client action needed

- [ ] None for this card’s ask — review Bestsellers / Forthcoming / In Focus when the Wave 2 batch is pushed

## Verify

- Local home: product carousels — outline arrows mid-cover; edges line up with title / See all.
- Hover book card — outline/shadow above adjacent covers.

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change | Revert `slider-chrome.scss` / related home templates on this branch |
| New files | None |

## Related / follow-up

- Wave 2 next card per `WAVE-2-WORKFLOW.md` (4.5 mobile arrows / auto-scroll in the arrow batch)
