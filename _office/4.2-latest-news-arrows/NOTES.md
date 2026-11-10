# 4.2 — Latest News arrows

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `4.2` |
| **taskKey** | `880de670-28a2-4034-ab2f-8bd01328afdb` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/880de670-28a2-4034-ab2f-8bd01328afdb` |
| **Branch** | `feature/wave2-4.2-latest-news-arrows` |
| **Commits** | `1a15d1f` Add Wave 2 4.2 outline slider arrows outside listing cards |
| **Deploy** | Local only until Wave 2 staging push batch |

## Client ask (original)

Arrows beside the Latest News dates take too much space. Preference settled on outline arrows sitting on the image, slightly see-through. Same treatment for the Events and Videos sidebars.

## Delivered (final state)

- Shared `.or-section--slider` chrome: outline circle, slightly see-through white fill; **hover = full white fill**.
- Same assets on every section slider (sidebar news + main book carousels). Not a sidebar one-off.
- Latest News / Events / Videos: card inset (`--or-slider-listing-gutter`) so arrows sit **outside** the card; vertical pin to thumb mid-line.
- Book cover centering refinements remain **4.4** if still needed after this shared look.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| Same look on Events and Videos sidebars | CSS ready; blocks not on local home (theme toggles hide them) | Cannot visual-check until those sections are turned on |

## Client action needed

- [ ] None for this card’s chrome — review Latest News on staging when the Wave 2 batch is pushed
- [ ] Optional: turn Events / Videos sidebars back on when content is ready so the shared arrow treatment shows

## Verify

- Local: `http://localhost:3000/` — sidebar **Latest News**; arrows overlay the image as outline circles, not solid black next to the date.
- Click prev/next still advances news.
- Bestsellers / Forthcoming arrows still solid (not this card).

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change theme files | No `templates-archive/` tree in this workspace yet — skipped |
| New files (delete to undo) | `orbooks-theme/assets/img/left-slider-outline.svg` |
| Other artifacts | Revert `slider-chrome.scss` sidebar block + `home.scss` track-pad tokens |

## Screenshots / media

| File | Notes |
|------|--------|
| (none saved) | Verified in browser: outline asset + ~center on image |

## Related / follow-up

- **4.4** Book arrows outline, centered on cover
- **4.5** Mobile round arrows + auto-scroll
