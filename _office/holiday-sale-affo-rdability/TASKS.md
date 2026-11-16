# Holiday sale — tasks / build

Working checklist and delivery notes for the AFFO/RDABILITY sale chrome.

**Communication / email thread:** [NOTES.md](./NOTES.md)

---

## Current status

Client approved go-live. Sale already live on their side. Do her follow-ups below, then **one** production push with everything together (no staged launch). Briefboard notes after that.

## Antara’s latest asks (Nov 15–16)

From her emails after the preview video. Clarifying email drafted in [NOTES.md](./NOTES.md) (In Focus URL + books source; ticker stuck-red wording). Finish follow-ups, then **one** launch. Hours below are **new** work only (not the original 5h). No separate “nice-to-have” lane; all items are in scope unless she cuts them.

**How In Focus works today (site fact):** the book row is BigCommerce **Featured Products**, not a category. Only **See all** is hard-coded to Palestine (`/reading-lists/the-palestine-list/`). She asked to show “this special offer category” in that section and replace See all; Rock Bottom **animation** only after that change. Awaiting which URL (`/special-offer/` vs `/special-offers/`) and whether the row should pull from that category or she picks titles.

| Ask | Est. | Notes |
|-----|------|--------|
| In Focus books → special offer | **0.5h** | New/Bestsellers already load by category ID in `home.js`; reuse that pattern (or she curates Featured Products and this drops near 0). Blocked on her reply. |
| See all → special offer URL | **0.25h** | One href in `featured.html` once URL confirmed; same sitting as In Focus. |
| Rock Bottom seal in same launch | **0** | Already built locally; ship with the In Focus swap, not before. |
| Mobile sticker above Dazed quote | **0.5h** | Reuse sticker asset; insert above Dazed in `home.html` + small-screen CSS (header sticker already hidden on small). |
| Ticker: red block always stuck left | **0.25h** | Fixed red lead + yellow scrolls (Amara look). Confirm short **THE AFFO/RDABILITY SALE** vs long locked lead. |
| Go live (one prod push) | **0** | Part of the project; not a separate estimate line. |
| Briefboard delivery comments | **0.25h** | After push. |

**Total ≈ 1.75h** (Rock Bottom + go live add no estimate hours).

Checklist:

- [ ] **In Focus books** (~0.5h): show the special offer category in that section (await her URL + whether to pull category products or she sets the titles).
- [ ] **See all** (~0.25h): point at that same special offer URL (not Palestine).
- [ ] **Rock Bottom animation** (0 new): include in the same push, only after the In Focus change above.
- [ ] **Mobile sticker** (~0.5h): above “A radical, exciting response to Amazonian hegemony.” —Dazed; not sticky.
- [ ] **Ticker red lead** (~0.25h): always stuck on the left like her reference; yellow line scrolls.
- [ ] **Go live** (0): one production push with sticker + ticker + Rock Bottom + items above (project step, not billed hours).
- [ ] **Briefboard** (~0.25h): delivery comments after push.

**Candidate URLs (her pick):** https://orbooks.com/special-offer/ · https://orbooks.com/special-offers/

**Briefboard phase:** [Holiday Banner on Estimates](https://lancemonotone.com/or-books/app/estimates?section=holiday-banner)  
6.1–6.4 marked **complete**. New revision cards: **6.5** In Focus books (0.5h), **6.6** See all (0.25h), **6.7** mobile Dazed sticker (0.5h), **6.8** stuck red ticker (0.25h), **6.9** BB delivery notes (0.25h).

## Build progress (internal)

### 6.1 Sticky top sale ticker — done locally

| Field | Value |
|-------|--------|
| **taskKey** | `d53216a9-8660-4c4d-8423-ed0729c0cdcf` |
| **BB comment** | **None yet** (wait for client estimate go-ahead) |
| **Commits** | `c7cfc04` Add sticky AFFO/RDABILITY sale ticker under the header (6.1) |

**Delivered (local):**

- Sticky CSS marquee between header and content (mockup placement).
- Locked sale copy; red/yellow; Silkscreen; pause on hover; reduced-motion calm.
- Hidden on cart / checkout / account / auth.
- Theme setting `or_holiday_banner` (Holiday Banner in Theme Editor) gates the chrome.
- No bottom border under ticker.

**Verify:** `stencil start` → homepage → ticker under header; scroll sticks; cart page has no ticker.

### 6.2 Header AFFORDABILITY SALE sticker (pulse) — done locally

| Field | Value |
|-------|--------|
| **taskKey** | `6fc12297-b929-4c92-bd64-fbab95beb393` |
| **BB comment** | **None yet** — do **not** post until client estimate go-ahead. When posting, **must** include mobile hide + ask Antara (checklist below). |
| **Commits** | `3a07765` Add AFFO/RDABILITY header sticker with pulse; hide under 768px (6.2) |

**Delivered (local):**

- Transparent `Sticker.png` at `assets/img/holiday/affordability-sale-sticker.png`, beside/overlapping OR logo (≥768).
- Slow continuous CSS pulse (~3.2s); static under `prefers-reduced-motion`.
- Same cart/account/auth hide as ticker; gated by `or_holiday_banner`.
- **Sticker hidden below ~480–510 (later tuned)** on header — mobile header has no free slot beside the logo; sat under search/cart (`sticker-mobile-collision.png`). Ticker still carries the sale on small screens. **Antara (Nov 15):** OK with hide in header; prefers try placing it **above the Dazed quote** (not sticky) — see Next actions.
- **Mobile sticky clash (≤767):** ticker sticks under fixed header (not over it); z below header so sticker can overhang yellow strip on desktop.
- **301–568 cover:** clearance when header taller than body pad; ticker type floor `0.75rem`.

**Verify:** ≥768 header → sticker by logo, pulsing; &lt;768 → no sticker, ticker OK; cart → neither.

### WHEN POSTING 6.2 BB COMMENT (mandatory — do not skip)

Client-facing; `mode: "reply"` if any messages exist. Include:

1. What shipped: sticker by logo with slow pulse (desktop/tablet).
2. **Mobile scope change:** sticker hidden under 768 because it sat under search/cart — attach or describe `sticker-mobile-collision.png`.
3. Ticker still on phones so sale copy remains visible.
4. Ask Antara if hide-on-phone is OK, or if she wants a different small-screen treatment.

**Mobile follow-up (Antara answered):** header hide OK; prefer try above Dazed quote before the single launch (Next actions #3).

### 6.3 In Focus hang/oscillate badge — done locally; ships with In Focus category swap

| Field | Value |
|-------|--------|
| **taskKey** | *(Holiday Banner 6.3 — confirm UUID from BB if needed)* |
| **BB comment** | **None yet** |
| **Commits** | *(pending)* |

**Delivered (local + prod-download preview):**

- “ROCK BOTTOM PRICE” serrated seal hanging near In Focus section title (`featured.html` only).
- Art: `assets/img/holiday/rock-bottom-price-badge.png` (we drew from mockup — **client sent no badge file**).
- Slow swing / oscillate (~2.8s); static tilt under `prefers-reduced-motion`.
- Gated by `or_holiday_banner`; visual only (no link); pointer-events none.
- Same cart/account hide family as other holiday chrome.
- **Live-theme gotcha:** `.featured span` in `home.scss` was absolute-positioning every heading span (meant for See all). Narrowed to `span.cate_link` so hang title keeps heading type + pivot math.

**Verify:** homepage In Focus → red seal swinging from **S**; Theme Editor off → gone. Preview: prod-download `stencil start` → localhost:3000.

**Launch rule (Rus):** one push — In Focus category + See all + Rock Bottom seal (+ sticker/ticker and any optional items we complete) go live together. Antara’s “only once this change is done” is satisfied by not shipping the seal ahead of the category swap; we just aren’t doing a sticker/ticker-only first release.

## Assets on hand / still needed

| Item | File |
|------|------|
| Sticker placeholder (Nov 12) | `sticker-placeholder-sale.png` |
| Ticker still (Nov 12, superseded) | `ticker-reference-still.png` |
| Homepage mockup (Nov 13) | `sale homepage.jpg` |
| Sticker working (Nov 13 AM) | `Affordability Sale Pop-Art Burst.png` |
| Ticker video + still (Nov 13) | `ticker-mwejkcuk.gif`, `ticker-mwejkcuk-still.png` |
| Pixel font / UI ref (Nov 13) | `image.png` |
| Sticker almost final (Nov 13 later) | `Sticker.png` (transparent) |
| Mobile sticker under search/cart (Nov 13) | `sticker-mobile-collision.png` — **attach when posting 6.2 BB** |
| Click / link targets | **None** (Rus) — visual only |
| Thin inter-section banners art | Idea only; not for estimate |

## Amara ticker generator (what it is)

URL she used: https://amarasoftware.com/news-ticker-generator/

**Not a library** to install or depend on. Browser tool that:

- Lets you configure headlines, colors, speed, presets
- Exports **HTML + embedded CSS animation** (paste/adapt), or **GIF / MP4 / WebM**

Her GIF/still = look + color + motion reference (and/or an export from that tool). We should **rebuild in our theme** (Handlebars + SCSS/CSS, maybe tiny JS), matching colors/behavior — not load Amara as a third-party widget. Optional: peek at their exported HTML pattern (duplicate track + CSS transform marquee + reduced-motion) and reinvent cleanly in `orbooks-theme-prod-download/`.

## Technical read (theme)

- **Codebase:** Implement on `orbooks-theme/` for staging preview; after approval, port to `orbooks-theme-prod-download/` (sync from live first) and push prod. Keep sale chrome isolated (partials + toggle) so the port stays small.
- Custom strip above header for sticky ticker + sticker (not stock BC banner alone).
- Exclude cart/checkout/account for ticker (and sticker as appropriate).
- No hrefs on sale chrome.
- Take-down: prefer **theme setting / simple toggle** (least work + easy sale extension).
- Optional: In Focus dangling/oscillating badge (see above); last priority.
- Thin banners between rails: out of estimate per Antara.
- Reduced motion: calmer pulse / static ticker when `prefers-reduced-motion`.
- Sticker: `Sticker.png` transparent; we pick pixel webfont.

**Not in embellishment estimate:** catalog prices, coupons, free-shipping rules, carousel promo art (they manage), sale landing page content.

## Scope boundaries (for estimate)

**In:**

- Sticky (or non-sticky) top ticker sitewide except cart/checkout/account
- Header-area sticker with slow pulse
- Prod theme push; easy on/off / extension
- Optional line item: In Focus oscillating label (or explicitly skipped)

**Out of this estimate:**

- Thin banners between sections (idea only)
- Redesigning sticker art
- Sale pricing / BC promotions / coupons / free shipping config
- Wave 2 cards
- Carousel sale graphics (their end)

## Estimate posture (internal)

**Client estimate (Rus, Nov 13): 5 hours** @ $125/hr = **$625**.

Covers: sticky top ticker; header sticker + slow pulse; In Focus hang/oscillate badge; sale on/off toggle; mobile/polish buffer. Visual only. Thin banners **out**.

**Workflow (internal):** build on staging theme first for review → after approval, port to prod theme + push live. Staging→prod port (~1h) **eaten**, not added to the quote.

| Slice | Hours |
|-------|-------|
| Sticky ticker | 1.5 |
| Header sticker + pulse | 1.25 |
| In Focus hang/oscillate badge | 1.0 |
| Toggle + smoke / polish buffer | 1.25 |
| **Client total** | **5.0** |
| Staging→prod port (eaten) | ~1.0 |

Rate: $125/hr.

## Related / follow-up

- BB **Holiday Banner** phase live: 6.1 ticker 1.5h, 6.2 sticker 1.25h, 6.3 In Focus badge 1h, 6.4 toggle/prod 1.25h (total 5h).
- Wave 2 still pending her separate reply.

