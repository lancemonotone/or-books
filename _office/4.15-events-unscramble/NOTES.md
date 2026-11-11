# 4.15 — Events unscramble — notes

## Done (local)

- Sidebar schedule poster + three event posters under the existing top banner.
- Two-column poster grid from 768px; one column on phone.
- Existing banner, newsletter, archive link unchanged.
- Local preview uses theme files under `orbooks-theme/assets/img/events/`.

## Before staging / prod

1. Upload the four JPGs to **Image Manager** (staging, then prod when shipping).
2. Swap `{{cdn 'img/events/…'}}` in `new-events.html` for those Image Manager URLs.
3. Remove the temporary theme copies under `assets/img/events/`.

## Mention in final client update

Events posters still work the way the previous agency set them up: she uploads in **Storefront → Image Manager**, then the theme file (`new-events.html`) has to point at those URLs. BigCommerce has no Events “gallery loop” like WordPress; a self-serve Page Builder widget would be separate work she did not buy for this pass. For now, new or renamed posters still need a small template touch after she uploads.
