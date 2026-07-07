# Per-screenshot annotations

Detailed findings keyed by filename. Supplements [phase-1](./phase-1-done-screenshots.md), [phase-2 batch 1](./phase-2-batch-1-content-pages.md), and [recordings](./recordings-notes.md).

---

## `120802.png` — Menu overlay

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Submenus repeat the same name as the parent category (redundant labels) | Medium | 2.7 |
| Open overlay crowds the logo at the top — compare vertical clearance with any other screenshot where header is visible | Medium | 2.8 |
| Magnifying glass icon not centered inside its square button | Low | 2.5 |

---

## `120911.png` — Homepage

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Two different slider/carousel styles on one page — one uses nav dots, another uses arrows | Medium | 2.9 |
| Section headings (e.g. FORTHCOMING & NEW RELEASES) not differentiated enough from book titles (e.g. IF I MUST DIE) — hierarchy collapse | High | 2.1 |
| "See all" text looks like a link but is not interactive (false affordance) | High | 1.5 |
| Section titles: some are links, some are not — non-linked titles still look clickable because of adjacent "See all" styling | High | 1.5 |

---

## `121855.png` → `121904.png` — Search flow

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Tapping first search box ("Search the store") transitions to a **different** search UI ("Search our store…") | Critical | 1.3 |
| Site header disappears during search — disorienting context loss | Critical | 1.3 |
| **Desired behavior:** stay on one search UI; keep header visible if possible | — | See [BigCommerce note](#bigcommerce-search) below |

### BigCommerce search

The dual-UI + header-hide pattern is a **theme/implementation choice**, not a BigCommerce platform limitation. BC exposes predictive search via Storefront GraphQL and REST; a custom or headless front end can keep a single in-place search field with the header pinned. **Verify at code mapping:** whether search is BC widget, theme overlay, or WP plugin — then consolidate to one component (task 1.3).

---

## `160840.png` — Reading Lists (homepage module)

| Finding | Severity | Roadmap |
|---------|----------|---------|
| "View All" under Reading Lists leads to a solo page that only repeats the same icons shown above — no added value | High | 1.6 |
| Same page shows multiple CTA button styles (View All black, Subscribe gray, View Full Catalog outlined) | Medium | 2.2 (CTA system) |

---

## `123202.png` → `123215.png` — Author / In the Media

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Media card images vertically squished — inconsistent dimensions (e.g. Consortium News banner in list vs correct proportions on single article) | High | 2.10 |
| **Persistent problem** across list views; compare with `161534` (single article hero) | High | 2.10 |

---

## `161534.png` — News/media single article

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Consortium News hero image displays at **correct** aspect ratio here | — | Reference for 2.10 fix |
| Byline: "Posted by Consortium News on May 28, 2026" — source attribution may be useful but "Posted by" is redundant; long bylines awkward on mobile | Medium | Content / 2.11 |
| No back navigation to news index — dead-end; only escape is footer "News" link or homepage section title (which does not look like a link) | High | 1.7 |
| Relates to false-affordance section-title issue from `120911` | High | 1.5, 1.7 |

---

## `123249.png` — Single book page (reviews)

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Review quote typography much larger than default body — breaks vertical rhythm | Medium | 2.1 |
| Overall vertical flow on book page not pleasing (reviews block) | Medium | 2.3 |

---

## `123327.png` — News article (Run Zohran Run)

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Same byline concerns as `161534` ("Posted by Labour Left on…") | Medium | 2.11 |
| No back to news listing | High | 1.7 |

---

## `123434.png` — Footer

| Finding | Severity | Roadmap |
|---------|----------|---------|
| "Manage Website Data Collection Preferences" bar not center-aligned with footer content above | Low | 3.4 |

---

## `123739.png` — Catalog book list

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Huge whitespace between book list and Featured Title block below | Medium | 2.3 |
| "Featured Title" heading very small, different font, positioned **under** the image instead of above the section — easy to miss | High | 2.12 |
| On other pages the Featured block has no visible heading at all — users don't know what the widget is | High | 2.12 |
| **Hypothesis:** may be a category-listing widget (like Related Interest on book page) showing a single title — different from whatever drives the full Featured Title section on other templates. **Confirm at code mapping.** | — | Open question |

---

## `161238.png` — In the Media list (still frame)

| Finding | Severity | Roadmap |
|---------|----------|---------|
| See [recordings-notes.md](./recordings-notes.md) — "Read Now" overlay on tap | High | 1.8 |

---

## Related recordings

| File | Notes doc |
|------|-----------|
| `123119.mp4` | [recordings-notes.md](./recordings-notes.md) |

---

## Phase 2 batch 2 — ancillary & legal

Full write-up: [phase-2-batch-2-ancillary-pages.md](./phase-2-batch-2-ancillary-pages.md)

| File | Page | Key note |
|------|------|----------|
| `125307` | Booksellers | **Mixed email:** `orders [at]` vs `rights@` on same page |
| `125329` | In Bookstores | Stock photo; spacing |
| `125454` | Rights Enquiries | `rights@` OK; "ENQUIRES" typo |
| `125507` | Rights Catalogs | Lorem Ipsum placeholder |
| `125535` | Mailchimp signup | External; `orders@` link smaller than body; → **2.15** |
| `125607` | Authors | Featured Author arrows; font split |
| `125642` | Subsidiary Rights | Alignment break on "World Rights" |
| `125703` | Privacy TOC | Item 4 number color bug |
| `125733` | Privacy CCPA table | Non-responsive on mobile |
| `125756` | Privacy Policy | http link |
| `125811` | Terms | `orders [at]` |
| `125833` | FAQ | Page refs not linked |
| `130006` | Shipping info | `orders [at]`, `info [at]` |

---

## `123850.png` — About (video slider)

| Finding | Severity | Roadmap |
|---------|----------|---------|
| Arrow-style carousel (black circles) — third instance of slider style split | Medium | 2.9 — **[client decision](../notes/client-decisions.md)** |

