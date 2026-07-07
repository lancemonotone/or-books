# Phase 2 Discovery — Batch 1 (Content & Directory Pages)

**Scope:** 10 screenshots (news, footer, authors, catalog, about, contact)  
**Captured:** 2026-07-06 (12:33–12:40)  
**Status:** Analysis complete  
**Builds on:** [phase-1-done-screenshots.md](./phase-1-done-screenshots.md)

---

## Screenshot groups

| Group | Files | Page / URL |
|-------|-------|------------|
| News article | `123327` | `/news/the-…` (Run Zohran Run podcast post) |
| Global footer | `123434` | Footer nav (captured from `/catalog/ru…`) |
| Authors directory | `123519`, `123704` | Our Authors (alphabet filter + grid) |
| Catalog listing | `123739` | Book list (Inferno, Red Card, …) |
| Featured title | `123809` | Featured Title module (Red Card) |
| About | `123828`, `123850` | `/about/` |
| Contact | `123949`, `124005` | `/contact-us` (info + form/footer) |

---

## 1. New & confirmed inconsistencies

### Typography & visual hierarchy

| Issue | Detail | Screens | Phase 1 |
|-------|--------|---------|---------|
| Serif vs sans body split | News article body is serif; About history block is serif; many headings remain condensed sans | `123327`, `123850` | **Confirms** body text variations |
| Center-aligned body copy | About page paragraphs and quotes are center-aligned in a narrow column — hurts readability on mobile | `123828` | **New** |
| Mixed alignment within page | About: left-aligned serif bio text above center-aligned "LAUNCHING OR" heading and image | `123850` | **New** |
| Catalog list typography | Book titles and authors all bold all-caps sans at different scales; subtitle regular weight | `123739`, `123809` | **Confirms** hierarchy drift |
| Footer type | Condensed sans, all center-aligned on dark background | `123434` | **New** (footer spec) |

### Spacing & alignment

| Issue | Detail | Screens | Phase 1 |
|-------|--------|---------|---------|
| Excessive vertical gaps | Large whitespace: hero → headline (news); filter → grid (authors); list items (catalog); header → body (about, contact); submit → footer (contact) | Most batch | **Confirms** vertical padding anomalies |
| Inconsistent horizontal inset | News tags and body appear inset; footer full-bleed dark; contact sections use centered narrow column with short divider lines | `123327`, `123434`, `123949` | **Confirms** horizontal layout shifts |
| Author grid misalignment | Uneven image aspect ratios cause author names to sit at different vertical positions row-to-row | `123519`, `123704` | **New** |
| Featured title spacing | Large gap between 3D book render and "Featured Title" label | `123809` | **New** |

### Buttons, icons & form elements

| Issue | Detail | Screens | Phase 1 |
|-------|--------|---------|---------|
| Header icon treatment | Hamburger is "naked"; search and cart sit in light-gray **square** buttons — asymmetric header | All 10 | **New** (site-wide) |
| Filter button shape | Authors "ALL" uses **rounded** black pill; header actions use **square** gray boxes | `123519` | **Confirms** button style conflict |
| Alphabet filter touch targets | Individual letter cells (A–Z, 0–9) are very small and tightly packed | `123519` | **Extends** touch-target issue |
| News tag chips | `#Run Zohran Run!` / `#Theodore Hamm` black rectangles — small tap areas, cramped against body below | `123327` | **New** |
| Video carousel arrows | Small circular black buttons on YouTube embed — likely under 44×44px | `123850` | **Extends** touch-target issue |
| Form field layout | "REQUIRED" labels right-aligned while field labels are left-aligned — staggered visual rhythm | `124005` | **New** |
| Math captcha input | Narrow single-line box for "What is 1 + 9?" — undersized for mobile | `124005` | **Extends** touch-target issue |
| Social icon style | Footer uses thin-stroke **circular** outlines; header uses **square** filled-gray buttons | `124005` | **New** |
| Primary CTA consistency | "Submit Form" matches solid black rounded style of "Add To Cart" (Phase 1) | `124005` | **Positive** — anchor pattern |

### Content & data quality

| Issue | Detail | Screens |
|-------|--------|---------|
| Missing author image | "IMAGE NOT AVAILABLE" placeholder for Patrick Cockburn | `123704` |
| Copy errors | About page: missing spaces after periods (`day.Though`, `released.Our`) | `123828` |
| Email obfuscation | Contact emails use `[at]` instead of `@` — not tappable `mailto:` links | `123949` |
| Footer typo | "Developed By : Dit interactive" — errant space before colon | `123434` |

---

## 2. User flows & friction points

### Flow D — Finding an author

| Step | Action |
|------|--------|
| 1 | User opens Our Authors (menu or link) |
| 2 | User scans alphabet filter or scrolls grid |
| 3 | User taps letter or author portrait |

**Friction 1:** Letter filter targets are too small for reliable tapping.  
**Friction 2:** Inconsistent portrait crops make scanning harder; missing images break grid rhythm.  
**Friction 3:** Greyed-out `0-9` and `X` with no explanation — unclear if empty or broken.

### Flow E — Browsing catalog to a title

| Step | Action |
|------|--------|
| 1 | User views vertical book list or Featured Title block |
| 2 | User reads title, subtitle, author |
| 3 | User taps to open detail (assumed) |

**Friction 1:** Excessive vertical gap between list items wastes scroll depth.  
**Friction 2:** Center-aligned list text contrasts with left-aligned patterns elsewhere — no consistent product-card contract.

### Flow F — Contacting OR Books

| Step | Action |
|------|--------|
| 1 | User opens Contact Us |
| 2 | User finds correct department email |
| 3 | User copies address or scrolls to form |

**Friction 1:** `[at]` emails require manual edit — no one-tap mailto.  
**Friction 2:** Sparse layout with wide vertical gaps pushes form below fold.  
**Friction 3:** Form adds math captcha + reCAPTCHA + small inputs — high effort on mobile.

### Flow G — Footer navigation

| Step | Action |
|------|--------|
| 1 | User scrolls to footer |
| 2 | User scans grouped links (Catalog, Home, Account, Cart, …) |

**Friction:** Dense center-aligned link stack is readable but long; no visual distinction between commerce links (Cart, Account) and editorial (News, Events). Cookie/preferences bar adds a second dark footer tier.

---

## 3. Phase 1 cross-check

| Phase 1 finding | Seen in Batch 1? | Notes |
|-----------------|------------------|-------|
| Zero side padding on book detail | Not reproduced | These pages use inset/narrow columns instead |
| Dual search UI | Not visible | Header search icon only — no overlay captured |
| Subjects unlabelled icons | N/A | Different page type |
| Quantity counter vs CTA | N/A | No purchase UI in batch |
| Accordion chevron mismatch | N/A | No accordions in batch |
| Typography / casing drift | **Yes** | News, About, Contact, catalog all differ |
| Vertical spacing anomalies | **Yes** | Widespread |
| Horizontal layout inconsistency | **Yes** | Center vs inset vs full-bleed footer |

---

## 4. Findings summary

### Critical

- Alphabet filter touch targets below mobile minimum (`123519`)
- Contact emails not actionable as links (`123949`)

### High

- Site-wide header icon inconsistency (naked menu vs boxed search/cart)
- Author grid broken by mixed aspect ratios and missing images
- Center-aligned body copy on About reduces readability (`123828`)

### Medium

- Excessive vertical whitespace on catalog, authors, contact, about
- Form layout inconsistencies (REQUIRED alignment, small captcha input)
- Social vs header icon style mismatch
- News tag chips undersized and cramped

### Low / content

- About copy typos (missing spaces)
- Footer "Developed By :" spacing
- Greyed filter letters without empty-state copy

---

## 5. Screenshot file index

| File | Page / URL | Notable elements |
|------|------------|------------------|
| `123327.png` | News article | Hero image, tags, serif body, podcast CTA |
| `123434.png` | Footer | Dark nav, copyright, dev credit, cookie bar |
| `123519.png` | Our Authors | Alphabet filter, author grid top rows |
| `123704.png` | Our Authors (scroll) | Mixed crops, missing image placeholder |
| `123739.png` | Catalog list | Inferno, Red Card, center-aligned cards |
| `123809.png` | Featured Title | Red Card 3D render, centered stack |
| `123828.png` | About | Centered copy, quotes, copy typos |
| `123850.png` | About (history) | YouTube embed, carousel arrows, photo |
| `123949.png` | Contact Us | Department emails, dividers |
| `124005.png` | Contact form + footer | Form, captcha, social icons |

---

## 6. Roadmap impact

See [roadmap.md](../plan/roadmap.md) for promoted tasks. New items from this batch:

| ID | Task | Sprint |
|----|------|--------|
| 1.4 | Mailto links for contact emails (replace `[at]` obfuscation on mobile) | 1 |
| 2.4 | Author grid image aspect-ratio contract + fallback treatment | 2 |
| 2.5 | Header action icon system — unified container style for menu, search, cart | 2 |
| 2.6 | Text alignment rules — left-align long body copy; reserve center for short labels | 2 |
| 3.2 | *(extended)* — alphabet filter, tag chips, video arrows, captcha inputs | 3 |
| 3.3 | Social icon set aligned with header icon geometry | 3 |
| — | About copy typos | Content fix (non-dev) |
