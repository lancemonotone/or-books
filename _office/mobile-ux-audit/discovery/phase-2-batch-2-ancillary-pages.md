# Phase 2 Discovery — Batch 2 (Ancillary & Legal Pages)

**Scope:** 13 screenshots — bookseller/rights, authors, subsidiary rights, privacy/legal, FAQ, shipping  
**Captured:** 2026-07-06 (12:53–13:00)  
**Status:** Analysis complete  
**Builds on:** [phase-1](./phase-1-done-screenshots.md), [phase-2 batch 1](./phase-2-batch-1-content-pages.md), [screenshot-annotations](./screenshot-annotations.md)

---

## Screenshot groups

| Group | Files | Page / URL |
|-------|-------|------------|
| Trade / bookseller | `125307`, `125329`, `125535` | `/bookseller`, In Bookstores, Mailchimp bookseller signup |
| Rights | `125454`, `125507`, `125642` | `/rights-enquiries`, `/rights-catalogs`, `/subsidiary` |
| Authors (combined view) | `125607` | `/authors/` — Featured Author + Our Authors |
| Privacy / legal | `125703`, `125733`, `125756` | Privacy notice, CCPA table, Privacy Policy & Guidelines |
| Terms / FAQ / shipping | `125811`, `125833`, `130006` | Terms & Conditions, FAQ, shipping/returns info |

---

## 1. Findings

### Email address inconsistency (site-wide pattern)

**User observation confirmed on `125307`:** Same page mixes formats.

| Format | Examples seen | Screens |
|--------|---------------|---------|
| `[at]` obfuscation (not tappable) | `orders [at] orbooks.com`, `info [at] orbooks.com` | `125307`, `125811`, `130006`, Contact (P2) |
| Standard `@` as link | `rights@orbooks.com` | `125307`, `125454` |
| Standard `@` as link (external) | `orders@orbooks.com` on Mailchimp | `125535` |

**Impact:** Users cannot one-tap mail on most trade/legal pages; inconsistent within a single page (`125307` has both formats).

**Roadmap:** Extends **1.4** — audit all CMS pages; standardize on `mailto:` links with `@`.

---

### Carousel / slider style — **client decision required**

**User observation on `123850` (About video):** Arrow-style slider (black circles, white chevrons).

**Site inventory so far:**

| Style | Where seen |
|-------|------------|
| Nav dots | Homepage product carousels (`120911`) |
| Arrow buttons (circular black) | About video (`123850`), Featured Author (`125607`), homepage (`120911` — mixed on same page) |

**Recommendation:** Do not implement **2.9** (carousel consistency) until client picks one pattern. Document both in a short visual comparison for sign-off.

---

### Typography & content quality

| Issue | Detail | Screens |
|-------|--------|---------|
| Heading typo | "RIGHTS **ENQUIRES**" (should be Enquiries) | `125454` |
| Placeholder content | Entire Rights Catalogs page is Lorem Ipsum | `125507` |
| Heading font split | "Featured Author" serif vs "Our Authors" sans on same page | `125607` |
| Privacy TOC styling bug | Item 4 number is black; items 1–3, 5–8 numbers are blue with link text | `125703` |
| ALL-CAPS TOC links | Long privacy section titles in all-caps hurt mobile scanability | `125703` |
| Insecure link | `http://www.orbooks.com` in privacy body (should be https) | `125756` |
| FAQ cross-refs not linked | "Booksellers page", "Rights Inquiries page" plain text — not styled or linked | `125833` |

---

### Layout & spacing

| Issue | Detail | Screens |
|-------|--------|---------|
| Excessive header-to-content gap | Booksellers, Rights Enquiries, Privacy Policy title blocks | `125307`, `125454`, `125756` |
| Large gap before footer | Terms page: whitespace between body end and black footer | `125811` |
| Subsidiary rights alignment break | Book metadata center-aligned; "World Rights" left-aligned below | `125642` |
| In Bookstores | Large gap header → illustration; stock photo may not show OR titles | `125329` |
| Featured Author bio density | Tiny white text on dark banner — hard to read on mobile | `125607` |

---

### Mobile-unfriendly components

| Issue | Detail | Screens |
|-------|--------|---------|
| Privacy CCPA table | Three-column table with extreme wrapping; text touches cell borders; not responsive | `125733` |
| **Fix direction:** stack rows, horizontal scroll, or accordion per category on mobile | | |

---

### Confirmed recurring patterns (from earlier batches)

| Pattern | Seen again |
|---------|------------|
| Search icon off-center in button | `125307`, `125454`, `125507`, others |
| Hamburger naked vs boxed search/cart | All batch 2 |
| Author grid aspect-ratio mismatch | `125607` (same as `123519`) |
| Alphabet filter small touch targets | `125607` |
| Arrow-style carousel | `125607` Featured Author |

---

### External / third-party surfaces

| Issue | Detail | Screens |
|-------|--------|---------|
| Mailchimp signup | Hosted on `list-manage.com` (Mailchimp hosted form); form chrome is MC default (orange asterisks, etc.) | `125535` |
| MC intro copy typography | `orders@orbooks.com` link is **smaller** than surrounding body text — inconsistent even within MC-hosted page | `125535` |
| Note | Email on MC page is correct `orders@orbooks.com` link — ironically better than on-site bookseller page (`125307`) except for link font size | |

---

## 2. User flows & friction

### Flow H — Bookseller / trade contact

| Step | Friction |
|------|----------|
| Read Booksellers page | `orders [at]` not tappable; same page shows `rights@` as proper link — confusing |
| Follow mailing list CTA | Lands on external Mailchimp — acceptable but stylistic break |
| FAQ references Booksellers page | Text mention not linked from FAQ (`125833`) |

### Flow I — Rights / subsidiary

| Step | Friction |
|------|----------|
| Rights Enquiries | Minimal page — OK; typo in heading |
| Rights Catalogs | **Placeholder Lorem Ipsum** — page not production-ready |
| Subsidiary Rights | Scrolling list OK; alignment inconsistency on rights line |

### Flow J — Legal / privacy (mobile)

| Step | Friction |
|------|----------|
| Read privacy policy | TOC item 4 styling bug; all-caps link text |
| CCPA disclosures table | Unreadable on mobile — critical for compliance UX |
| Terms contact | `orders [at]` again |

---

## 3. Findings summary

### Critical

- Rights Catalogs placeholder content (`125507`) — ship blocker if page is live
- Privacy CCPA table mobile layout (`125733`)

### High

- Email `[at]` vs `@` inconsistency site-wide (**1.4**)
- FAQ internal page references not linked (`125833`)
- Featured Author readability (`125607`)

### Medium

- Carousel style — **await client decision** (dots vs arrows)
- Privacy TOC styling bug (`125703`)
- Rights Enquiries heading typo (`125454`)
- Subsidiary rights alignment (`125642`)
- http → https in privacy (`125756`)

### Low

- In Bookstores stock photo / spacing (`125329`)
- Mailchimp visual drift (`125535`)

---

## 4. Screenshot file index

| File | Page / URL | Key findings |
|------|------------|--------------|
| `125307.png` | `/bookseller` | Mixed email formats on one page |
| `125329.png` | In Bookstores | Illustration + stock photo; spacing |
| `125454.png` | Rights Enquiries | `rights@` OK; "ENQUIRES" typo |
| `125507.png` | Rights Catalogs | Lorem Ipsum placeholder |
| `125535.png` | Mailchimp bookseller signup | External; `orders@` link smaller than body text |
| `125607.png` | `/authors/` | Featured Author carousel; heading font split; grid issues |
| `125642.png` | Subsidiary Rights | Center/left alignment break |
| `125703.png` | Privacy notice TOC | Item 4 color bug; all-caps links |
| `125733.png` | Privacy CCPA table | Non-responsive table |
| `125756.png` | Privacy Policy & Guidelines | http link; large top gap |
| `125811.png` | Terms & Conditions | `orders [at]` |
| `125833.png` | FAQ | Cross-page refs not linked |
| `130006.png` | Shipping / orders info | `orders [at]`, `info [at]` |

---

## 5. Client decisions needed

| # | Question | Blocks |
|---|----------|--------|
| 1 | **Carousel control:** dots, arrows, or context-specific? (`120911`, `123850`, `125607`) | Task 2.9 |
| 2 | Rights Catalogs: real content timeline? | Content / launch |
| 3 | Mailchimp: keep external signup or embed? | Trade flow |

---

## 6. Roadmap impact

| ID | Change |
|----|--------|
| 1.4 | Expanded — site-wide email audit, not just Contact page |
| 1.9 | **New** — FAQ / body copy internal links styled and wired |
| 2.9 | Gated on client carousel decision |
| 2.13 | **New** — Privacy/legal mobile table pattern |
| 2.14 | **New** — Featured Author module readability |
| 2.15 | **New** — Bookseller Mailchimp signup on BC (blocked: client-decisions §3) |
| Content | Rights Enquiries typo; Rights Catalogs Lorem; privacy http link |
