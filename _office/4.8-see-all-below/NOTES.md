# 4.8 — See All below the product blocks

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.8` |
| **taskKey** | `3f9ca77f-7c97-45a6-b55d-a9ec9dd5370e` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/3f9ca77f-7c97-45a6-b55d-a9ec9dd5370e` |
| **Branch** | `feature/wave2-4.8-see-all-below` |
| **Commits** | `bad7baa` Move section See all under slider bodies (4.8) |
| **Briefboard status** | `blocked` (your turn) — delivery comment posted |
| **Deploy** | Local only until Wave 2 staging push batch |

## Client ask (original)

Move See all under Bestsellers, Forthcoming, In Focus, and Subjects (below the blocks) for space before the next title.

## Delivered (final state)

- **All** `.or-section--slider` sections: title on top, See all centered under the body (shared contract — including Latest News).
- `.or-section--cta-below` for non-slider Subjects (same layout).

## Client action needed

- [ ] None for this card’s ask — review Bestsellers, Forthcoming, In Focus, Subjects (and sidebar news) when the Wave 2 batch is pushed

## Verify

- Local home: See all under each slider body and Subjects, not beside the title.
- Latest News matches the same below-body CTA placement.
