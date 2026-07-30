# 2.4 — Scale the book cover on mobile

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.4` |
| **taskKey** | `6eb190a1-cfcd-4029-8261-05027bb3da83` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/6eb190a1-cfcd-4029-8261-05027bb3da83 |
| **Branch** | `feature/wave1-2.4-scale-book-cover-mobile` |
| **Commits** | `b26b111` Limit book cover height on phone product pages. |
| **Deploy** | Local only until Wave 1 batch `stencil push` |
| **Briefboard status** | Planned → delivery comment after ship to main |

## Client ask (original)

On book detail pages, the cover fills most of the phone screen. Readers must scroll before they see the description, format options, or purchase buttons. Limit cover height on small screens so title, key details, and primary actions appear in the first screenful. Keep a way to view the full cover if needed.

## Delivered (final state)

- On phones (&lt;768px), the main product cover is capped at `min(42vh, 17.5rem)` with `object-fit: contain`, centered.
- From 768px up, the previous cover sizing returns (no phone height cap).
- Zoom control still opens the full-size cover.
- Dropped the old phone `min-width: 300px` on the main slide (was fighting narrow viewports).

## Diverged from ask (if any)

None — matched the card.

## Client action needed

- [ ] None until Wave 1 push; then review a book page on a phone.

## Verify

- Phone width (~390): https://orbooks.com/catalog/meet-mayor-mamdani/ (local: `/catalog/meet-mayor-mamdani/`)
- Expect: cover shorter; title / formats / Add to Cart visible sooner without scrolling past a full-bleed cover.
- Tap zoom: full cover still available.

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change theme files | `templates-archive/` — `pdp.scss` may already be archived from earlier Wave 1 work; do not overwrite |
| New files (delete to undo) | None (edit only) |

## Screenshots / media

| File | Notes |
|------|--------|
| — | None captured this pass |

## Related / follow-up

- 7.8 Scale the In Bookstores images on mobile — homepage stock photos, separate task.
- 2.5 typography / PDP polish already on main; this task only touches cover height.
