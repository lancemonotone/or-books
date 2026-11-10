# Featured Title — Read More + card layout below desktop

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.16` |
| **taskKey** | `cc59b253-67c1-40e9-8b2d-7e5aa37183ce` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/cc59b253-67c1-40e9-8b2d-7e5aa37183ce` |
| **Branch** | `feature/wave2-4.2-latest-news-arrows` |
| **Commits** | `0f9e6a2` Fix Featured Title layout width, Read More, and centered copy below desktop |
| **Deploy** | Local only until Wave 2 staging push batch |

## Client ask (original)

Ad-hoc during Wave 2: Read More should match mailing-list CTAs below desktop and fill the details column on desktop; featured card full width below 1024; all copy centered below 1024.

## Delivered (final state)

- Below 1024: Featured Title card fills its column; title through description centered; Read More matches View Full Catalog / Need Help (shared block height and max width, centered).
- From 1024: copy left-aligned; Read More full width of the details column.
- Grid no longer shrinks to the cover’s intrinsic width.

## Client action needed

- [ ] None — review on staging when the Wave 2 batch is pushed

## Verify

- Local home Featured Title at ~900px and ~1280px: width, centering, Read More size/placement.
