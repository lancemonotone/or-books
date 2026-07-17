# OR Books — BigCommerce implementation notes

Senior-dev instructions for planned Issues (phases 1–4). Assumes familiarity with BigCommerce control panel, Stencil CLI, and theme deploy.

**Docs base:** Context7 `/bigcommerce/docs` (Stencil Sass, templates, `utils.api.search`, Script Manager).  
**Theme work:** prefer Stencil theme source (`assets/scss/`, Handlebars templates, `assets/js/`) over one-off Theme Editor hacks when changes must survive theme updates.  
**Hours:** set on each Issue in `app/data/issues.yaml` (`hours:`). Deferred (phase 5) has hours for the Estimate **side line only** (not in Grand).

**Client decisions locked:**

| Topic | Choice |
|-------|--------|
| Sliders | Dots |
| Bookseller signup | Embed Mailchimp on BC page |
| Rights Catalogs | Populate with embedded PDFs (client supplies files) |
| Email format | Deferred (in-house) — not in this quote |

---

## Shared setup (once)

1. Pull current live theme via Stencil CLI / Theme Marketplace download.
2. Map Issue surfaces in theme: `templates/components/common/header`, quick-search partials, `assets/js/theme/global/quick-search.js` (or custom equivalent), page templates for blog/news, product, authors.
3. Keep a small `assets/scss/custom/_or-mobile.scss` (or existing custom partial) and `@import` from `theme.scss` per [Stencil Sass](https://developer.bigcommerce.com/docs/storefront/stencil/themes/style/sass).
4. After CSS/JS changes: `stencil bundle` → upload → smoke on phone widths.

---

## Phase 1

### 1.1 Keep the header visible when searching — **2.5h**

**Surface:** Stencil quick-search (theme JS + templates), not a BC platform limit.

**Steps:**

1. Locate dual UIs: header search trigger vs full-screen/alternate search panel (check `quick-search` component + any Page Builder / Script Manager overlay).
2. Consolidate to one field: header stays in DOM; overlay/panel does not hide `.header` / logo.
3. Align placeholder copy to one string in template/lang.
4. Keep using `utils.api.search.search(query, { template: 'search/quick-results' }, cb)` for results ([Stencil utils](https://developer.bigcommerce.com/docs/storefront/stencil/utils/reference)).
5. Same close control from entry through results.

**Verify:** Mobile — tap search → header+logo visible → type → results → close; no second search chrome.

---

### 1.2 Subjects icons → accordion (client scope) — **1h**

**Client:** In-house imagery; remove heading; subjects under a “View More” accordion. `[P1]`

**Steps:**

1. Find Subjects page template / category grid markup (custom page or category template).
2. Remove section heading per client.
3. Wrap subject list in accordion (existing theme accordion pattern if present; else details/summary or shared accordion partial).
4. Labels: if icons remain, ensure text labels exist under icons **or** text-only rows inside accordion — client imagery is their job; you wire structure only.

**Verify:** Subjects page: no heading; accordion expands to subject list; usable on phone.

---

### 1.3 Fix false link affordances — **1h**

**Client:** Make real links like desktop. `[P1]`

**Steps:**

1. Audit homepage modules for “See all” / section titles that look linked.
2. Wire `href` to real category/blog URLs where desktop already links; else restyle to plain text (remove underline/color that imply link).
3. Prefer Handlebars `{{url}}` / existing carousel heading partials over Script Manager.

**Verify:** Every See all / View all is either a working link or clearly non-interactive.

---

### 1.4 Open media articles on first tap — **1h**

**Steps:**

1. Find “In the Media” card markup + hover/tap JS that reveals “Read Now”.
2. Make card/`<a>` navigate on first tap; remove intermediate overlay CTA (or make overlay non-blocking and unused).
3. Drop entrance animation if it gates the link (related to 4.2).

**Verify:** One tap on media row opens article; no second tap on Read Now.

---

### 1.5 Stop squashing media list images — **1.5h**

**Steps:**

1. Compare list card CSS (`object-fit`, fixed height, aspect-ratio) vs single-article hero.
2. Match list image ratio to article (typically `object-fit: cover` + consistent aspect-ratio box; avoid forced height that squashes).
3. Check blog/custom post listing templates for news vs media if separate.

**Verify:** List thumbnails not vertically squashed; match article proportions.

---

### 1.6 Scale book cover on mobile — **0.75h**

**Steps:**

1. Product template image gallery / main image SCSS (`productView-image` or custom).
2. Cap max-height / use responsive width on small viewports so title + primary CTA enter first screen.
3. Optional: lightbox/zoom still available for full cover.

**Verify:** Phone product page shows title + Add to Cart without scrolling past full-bleed cover.

---

### 1.7 Align header icons — **0.75h**

**Steps:**

1. Header action buttons SCSS (menu, search, cart).
2. Shared square hit box; flex/grid center icons; fix search optical centering.

**Verify:** Menu/search/cart boxes match; search icon centered.

---

### 1.8 Heading / title hierarchy — **2.5h**

**Client:** Interested in your suggestion. `[P1]`

**Suggestion to ship:**

| Role | Treatment |
|------|-----------|
| Section labels (e.g. Forthcoming) | Sans, uppercase or tracked, smaller than book titles |
| Book / product titles | Larger weight; primary attention |
| Pull quotes | Distinct size, not competing with H2 |

**Steps:**

1. Define tokens in Sass (type scale variables).
2. Apply across homepage carousels, product, news.
3. Short note in PR / reply to client with the table above.

**Verify:** Section heading vs book title distinguishable at a glance on homepage + product.

---

### 1.9 Left-align long paragraphs on mobile — **0.5h**

**Steps:**

1. About / legal / web page body selectors.
2. `text-align: start` for multi-sentence blocks under mobile breakpoint; keep center only for short labels.

**Verify:** About + Subsidiary Rights body left-aligned on phone.

---

### 1.10 Shorten news bylines — **0.75h**

**Client:** Remove bylines and hashtags; keep the date. `[P1]`

**Steps:**

1. Blog/post meta partial (byline, tags).
2. Remove author/source line and hashtag output; keep date only.
3. Apply to news + media article templates if shared.

**Verify:** Article shows date only; no “Posted by” / hashtags.

---

### 1.11 Header room when menu open — **0.5h**

**Steps:**

1. Mobile nav overlay SCSS (`navPages`, off-canvas).
2. Increase top padding/offset so overlay does not crowd logo; match clearance used when menu closed.

**Verify:** Open menu on phone — logo/header not cramped.

---

## Phase 2

### 2.1 Back from news articles — **0.5h**

**Steps:**

1. Blog post template: add “Back to News” (or Media) link near top linking to listing URL.
2. Reuse breadcrumb partial if theme has one.

**Verify:** One tap returns to listing from any article.

---

### 2.2 FAQ page links + link styling — **0.75h**

**Client:** Distinct link styling; clickable on mobile. `[P2]`

**Steps:**

1. Edit FAQ web page HTML in BC (Content → Web Pages) — wrap Booksellers etc. in `<a href="...">`.
2. Theme CSS: ensure in-content links have distinct color/underline on mobile (not same as body text).

**Verify:** FAQ references are tappable and visually distinct.

---

### 2.3 Remove repeated menu labels — **0.5h**

**Steps:**

1. Navigation / `navPages` submenu markup.
2. Remove duplicate parent-name heading under each group (template or menu item config).

**Verify:** Submenu no longer repeats parent category name.

---

### 2.4 Label Featured Title blocks — **1.5h**

**Client:** Title above image like Featured Title pattern elsewhere. `[P2]`

**Steps:**

1. Identify widget/partial used for Featured Title (Page Builder widget vs theme carousel).
2. Move heading above media; same position on all templates that use the block.
3. Ensure missing-heading instances get the label.

**Verify:** Featured block always has visible title above image.

---

### 2.5 Consistent buttons — **2.5h**

**Steps:**

1. Inventory primary CTAs: Add to Cart, Submit, View All, Subscribe, View Full Catalog.
2. Map to shared button classes (`button--primary` / theme equivalents); restyle outliers in Sass.
3. Align quantity stepper with primary CTA geometry.

**Verify:** Primary CTAs share padding, radius, type across homepage + product + forms.

---

### 2.6 Larger tap targets — **1.5h**

**Steps:**

1. Pricing radios, alphabet filter, tags, video arrows, captcha inputs.
2. Min 44×44px hit area (padding on label/`::before` if visual stays small).

**Verify:** Spot-check purchase options + authors alphabet on phone.

---

### 2.7 Remove math captcha — **0.75h**

**Steps:**

1. Contact form source (BC form, custom HTML, or app).
2. Remove math question field + validation; keep reCAPTCHA (or single spam method).
3. Test submit on mobile.

**Verify:** No math field; submit still works with one bot check.

---

### 2.8 One slider style (dots) — **2h**

**Decision:** Dots.

**Steps:**

1. Find all carousels (homepage products, About, Featured Author).
2. Configure/theme to dots only; remove arrow-only variants or hide arrows via CSS/JS options.
3. Homepage must not mix patterns.

**Verify:** All sliders use dots; no arrow-only controls left on audited pages.

---

## Phase 3

### 3.1 Center author alphabet spinner — **0.5h**

**Steps:**

1. Authors page alphabet control SCSS.
2. Center horizontally with content column; keep swipe alignment.

**Verify:** Spinner centered over author grid on phone.

---

### 3.2 Featured Author slider typography — **0.75h**

**Steps:**

1. Increase bio font-size on mobile.
2. Match “Featured Author” heading to site section heading tokens (from 1.8).

**Verify:** Bio readable; heading matches site hierarchy.

---

### 3.3 Legal tables on mobile — **2h**

**Steps:**

1. Privacy/CCPA tables in web page HTML or theme.
2. Wrapper with `overflow-x: auto` + clear scroll affordance, **or** stack rows with data-label pattern.
3. Prefer one pattern site-wide for legal tables.

**Verify:** CCPA table readable on phone without clipped columns.

---

### 3.4 Even section spacing — **1h**

**Steps:**

1. Audit large gaps (catalog list ↔ Featured Title, etc.).
2. Normalize vertical margins between modules via shared spacing tokens.

**Verify:** No unexplained large whitespace between related modules on cited pages.

---

### 3.5 Cookie preferences bar align — **0.25h**

**Steps:**

1. Footer / cookie prefs bar CSS (often third-party + theme footer).
2. Match max-width and horizontal centering to footer content.

**Verify:** Preferences bar lines up with footer block.

---

### 3.6 Rights Catalogs page (PDFs) — **1.5h**

**Decision:** Populate; client provides catalog PDFs; embed, no body text.

**Steps:**

1. Wait for PDF assets from client; upload to WebDAV / File Manager / CDN.
2. Replace Lorem on `/rights-catalogs` with embeds (`<iframe>` or PDF object / download links if embed blocked).
3. Keep page in nav only with real content.

**Verify:** No Lorem; PDFs viewable/downloadable; nav OK.

---

### 3.7 Bookseller signup embed — **1.5h**

**Decision:** Embed Mailchimp form on OR Books page.

**Steps:**

1. Create/edit BC web page for bookseller signup (or section on Booksellers).
2. Paste Mailchimp embed HTML; style with theme CSS overrides.
3. Point Booksellers CTA to on-site URL (not `list-manage.com`).
4. Fix intro email typography size while there.
5. Confirm submissions hit existing bookseller audience.

**Note:** Official BC Mailchimp app does **not** replace this custom list ([client-decisions.md](../notes/client-decisions.md)).

**Verify:** Signup stays on orbooks.com; test submit; header/footer visible.

---

## Phase 4

### 4.1 Featured Title link target — **0.75h**

**Original rec:** Same tab.  
**Client:** Same tab mobile / new tab desktop — discussed; pushback sent (internal product links).

**Default for estimate (until client reverses):** Remove `target="_blank"` so Featured Title matches other in-site product links (same tab). If client insists on breakpoint split, add ~0.5h for JS/`matchMedia` `target` toggling (not guaranteed on all browsers).

**Steps:**

1. Find Featured Title anchors with `target="_blank"` / `rel=noopener`.
2. Remove blank target (widget setting or template).
3. Smoke homepage Featured Title.

**Verify:** Opens in same tab; Back works.

---

### 4.2 Remove distracting button motion — **0.5h**

**Client (disagree with nuance):** Remove from “New items”; retain on black buttons.

**Steps:**

1. Locate Read Now / overlay entrance animation CSS/JS on author media vs other modules.
2. Disable slide/bounce on New items / media list context only; leave black button treatment if separate.

**Verify:** New items media CTA appears without slide/bounce; black buttons unchanged if still used elsewhere.

---

## Phase 5 — Deferred (side line only; not in Grand)

If client un-parks these later. Estimates assume **we** do the work (even where they said in-house).

### 5.1 Reading Lists View All — **0.5h**

**Client:** Hide for now.

**Steps:**

1. Remove or unpublish Reading Lists “View All” link on homepage module (template / Page Builder / menu).
2. Optionally 301 or unpublish the solo destination page so deep links die cleanly.
3. Leave homepage Reading Lists module intact.

**Verify:** No View All → empty duplicate page; homepage module still works.

---

### 5.2 Author photo crop — **1h**

**Client:** Do manually. Estimate below = CSS contract if they ask us instead.

**Steps (CSS path):**

1. Authors grid image selector.
2. Fixed aspect-ratio box + `object-fit: cover`; graceful empty/missing image state.
3. Smoke several author cards.

**Verify:** Uniform crop; no stretch. (Manual crop path = their CMS work, not billed here.)

---

### 5.3 Accordion title hover stability — **0.5h**

**Steps:**

1. Find accordion title hover/focus animation (CSS transform/letter-spacing or JS).
2. Remove title motion; keep chevron/background feedback only.

**Verify:** Title text does not shift on hover/tap.

---

### 5.4 Privacy TOC item 4 link — **0.5h**

**Client:** In-house. If we do it:

**Steps:**

1. Open privacy notice web page HTML.
2. Fix item 4 markup/`href`/CSS so it matches items 1–3, 5–8.
3. Confirm anchor target exists on page.

**Verify:** Item 4 looks and acts like other TOC links on mobile.

---

### 5.5 Email format consistency — **1h**

**Client:** In-house. Decision elsewhere chose `mailto`. If we do it:

**Steps:**

1. Audit Booksellers, Terms, Shipping, Rights, Contact for `[at]` vs `@`.
2. Normalize to `mailto:` links with `@` (per decision).
3. Theme CSS if needed so links match body link style.

**Verify:** No mixed formats; emails tappable on phone.

---

### 5.6 Privacy TOC sentence case — **0.5h**

**Steps:**

1. Privacy TOC link text in page HTML or CSS `text-transform`.
2. Sentence case (or title case); ensure no horizontal overflow on narrow screens.

**Verify:** TOC not all-caps; readable on phone.

---

### 5.7 Rights Enquiries typo + slug — **0.75h**

**Client:** In-house. If we do it:

**Steps:**

1. Fix page heading “Rights Enquiries” in web page / template.
2. Change URL slug from `/rights-enquires/` → `/rights-enquiries/`.
3. Add BC redirect from old slug → new (or update all nav/footer links).
4. Grep theme/menus for old spelling.

**Verify:** Heading + slug correct; old URL does not 404 without redirect.

---

### 5.8 In Bookstores image scale (or remove) — **0.5h**

**Client:** Might remove altogether.

**Steps:**

1. Confirm remove vs scale with client.
2. **Remove:** hide module / Page Builder widget. **Scale:** max-height on mobile like other promos (same pattern as 1.6).

**Verify:** Module gone, or image no longer dominates first viewport.

---

## Estimate summary

| Phase | Hours | In Grand? |
|-------|------:|-----------|
| 1 | 12.75 | Yes |
| 2 | 10.00 | Yes |
| 3 | 7.50 | Yes |
| 4 | 1.25 | Yes |
| **Grand (Remaining)** | **31.50** | — |
| 5 Deferred side line | **5.25** | No |

@ $150: Grand ≈ **$4,725** · Deferred side line ≈ **$787.50**

---

## After coding each Issue

1. Set `actual_hours` when done (manual roll-up).
2. Mark Issue `complete` (or leave `deferred` if still parked).
3. Re-check `#/estimates` Done / Remaining / Grand / Deferred.
