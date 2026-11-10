# 4.4 — Book arrows in outline, centered on the image

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.4` |
| **taskKey** | `b61cd59f-c535-4fa7-b818-4c0d42c0c2b4` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/b61cd59f-c535-4fa7-b818-4c0d42c0c2b4` |
| **Branch** | `feature/wave2-4.4-book-arrows` |
| **Commits** | (see git log on branch) |
| **Deploy** | Local only until Wave 2 staging push batch |

## Client ask (original)

Keep the book arrows. Draw them as an outline, centered on the book image.

## Delivered (final state)

- Outline look shared from **4.2**.
- Book carousel arrows sit on the **cover mid-line**.
- Book carousel arrows sit under the **section-head left/right edges** (same as Latest News), with track gutters so covers clear the controls.
- Side hang outside the heading chrome removed.

## Client action needed

- [ ] None for this card — review Bestsellers / Forthcoming / In Focus when the Wave 2 batch is pushed

## Verify

- Local home: product carousels — arrows mid-cover; left/right edges line up with title / See all.
- Latest News still correct (unchanged listing gutters in this commit).

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change | Revert `slider-chrome.scss` `.productCarousel` tokens |
| New files | None |

## Related / follow-up

- Slider chrome unification (one clearance recipe for all section sliders; class cleanup) — next pass on this branch
