# 2.4 — Scale the book cover on mobile

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.4` |
| **taskKey** | `6eb190a1-cfcd-4029-8261-05027bb3da83` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/6eb190a1-cfcd-4029-8261-05027bb3da83 |
| **Branch** | `fix/wave1-2.4-cover-bigger` merged → `staging`. Earlier: `feature/wave1-2.4-scale-book-cover-mobile`. |
| **Commits** | `b26b111` first phone cap · follow-up: +25% cover |
| **Deploy** | Staging storefront for Wave 1 review. Not orbooks.com until approval. |
| **Briefboard status** | `blocked` — waiting on client: bigger cover, first screen still shows title/subtitle/author |

## Client ask (original)

On book detail pages, the cover fills most of the phone screen. Readers must scroll before they see the description, format options, or purchase buttons. Limit cover height on small screens so title, key details, and primary actions appear in the first screenful. Keep a way to view the full cover if needed.

## Delivered (final state)

- On phones (&lt;768px), the main product cover is capped at `min(52.5vh, 21.875rem)` (~25% larger than the first cap), `object-fit: contain`, centered. Gap under the cover is `0.75rem` so title / subtitle / author still land in the first screen.
- From 768px up, the previous cover sizing returns (no phone height cap).
- Zoom control still opens the full-size cover.
- Dropped the old phone `min-width: 300px` on the main slide (was fighting narrow viewports).

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| First pass: limit cover so details show sooner | Phone cap `min(42vh, 17.5rem)` | Original card |
| Aug 14: a little too small; +20–25% | Cap raised 25% to `min(52.5vh, 21.875rem)` | She asked for bigger, closer to Related Titles |

## Client action needed

- [ ] How they like this size. Cap is a CSS token; easy to nudge up or down.

## Verify

- Phone width (~390): https://orbooks.com/catalog/meet-mayor-mamdani/ (local: `/catalog/meet-mayor-mamdani/`)
- Expect: cover ~25% larger than the first cap; title, subtitle, and author still visible without scrolling.
- Tap zoom: full cover still available.
- Aug 18 local check (390×844): cover, title, subtitle, and author all in the first screen.

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
