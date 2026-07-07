# Mobile UX — Developer roadmap

Derived from Phase 1, Phase 2 batch 1, and [screenshot annotations](../discovery/screenshot-annotations.md). Tasks will be refined after remaining screenshot analysis and code mapping.

**Legend:** Impact = user-facing severity · Effort = rough dev cost · Status = planning only (no implementation yet)

---

## Sprint 1 — Critical usability & layout hotfixes

*High impact · Low–medium effort*

| ID | Task | Impact | Effort | Status | Discovery ref |
|----|------|--------|--------|--------|---------------|
| 1.1 | **Standardize global page padding** — CSS utility/token for mobile horizontal padding on all main layout wrappers; fix book detail text flush to edge | Critical | Low | Planned | P1 spacing |
| 1.2 | **Add labels to Subjects icons** — text sub-headings under line-art icons | Critical | Low | Planned | P1 Flow A |
| 1.3 | **Unify search UX** — single search component and placeholder copy; **keep header visible**; no transition to alternate search page/panel. BC/platform does not block this — theme consolidation task | Critical | Medium | Planned | `121855`–`121904`, P1 Flow B |
| 1.4 | **Site-wide email links** — audit all pages; replace `[at]` obfuscation with tappable `mailto:` using `@`; same page must not mix formats (`125307` has both) | High | Low | Planned | `125307`, `125811`, `130006`, Contact, `125454` |
| 1.5 | **Fix false link affordances** — "See all" / section titles: either make interactive or restyle so non-links don't look clickable | High | Low–medium | Planned | `120911` |
| 1.6 | **Reading Lists "View All"** — solo destination page repeats homepage icons; add real index content or remove redundant route | High | Medium | Planned | `160840` |
| 1.7 | **News/article back navigation** — breadcrumb or "Back to News" on single posts; news index reachable without footer-only escape | High | Low | Planned | `123327`, `161534` |
| 1.8 | **In the Media list — direct navigation** — remove "Read Now" overlay; first tap goes to article (see [recording](../discovery/recordings-notes.md)) | High | Low–medium | Planned | `123119` video, `161238` |
| 1.9 | **Wire internal page references** — FAQ and body copy mentions (e.g. "Booksellers page") must be real links with link styling | High | Low | Planned | `125833` |

### Acceptance hints (draft)

- **1.3** One search field from header tap through results; header/logo remain visible; same placeholder and close affordance throughout
- **1.5** Every "See all" / "View all" is either a link or plain text — audit homepage modules
- **1.6** View All page adds value (descriptions, filters) or defers to homepage-only module
- **1.7** User can return to news listing in one tap from any news article
- **1.8** Media list item tap navigates immediately; no intermediate overlay CTA

---

## Sprint 2 — Typography & element consolidation

*Medium impact · Medium effort*

| ID | Task | Impact | Effort | Status | Discovery ref |
|----|------|--------|--------|--------|---------------|
| 2.1 | **Global typography tokens** — h1/h2/h3 hierarchy; section headings visually distinct from product/book titles; review quotes scaled to body rhythm | High | Medium | Planned | `120911`, `123249`, P1+P2 |
| 2.2 | **CTA + quantity component system** — Add to Cart, Submit, View All, Subscribe share one geometry language; reskin `- 1 +` counter | High | Medium | Planned | P1 purchase, `160840` |
| 2.3 | **Fix component gaps** — Subjects, catalog list ↔ Featured block, authors, about, contact, book reviews vertical rhythm | Medium | Low–medium | Planned | `123739`, `123249`, P1+P2 |
| 2.4 | **Author grid image contract** — uniform aspect ratio/crop; graceful missing-image fallback | High | Medium | Planned | P2 Flow D |
| 2.5 | **Header action icon system** — unified container for menu, search, cart; **center icons in buttons** | High | Low–medium | Planned | `120802`, P2 |
| 2.6 | **Text alignment rules** — left-align long body copy | Medium | Low | Planned | P2 About |
| 2.7 | **Menu overlay copy** — remove redundant submenu labels that repeat parent category name | Medium | Low | Planned | `120802` |
| 2.8 | **Menu overlay layout** — fix overlay crowding logo; match header clearance on other screens | Medium | Low | Planned | `120802` |
| 2.9 | **Carousel consistency** — one slider pattern site-wide (**blocked:** [client decision](../notes/client-decisions.md) on dots vs arrows) | Medium | Medium | Blocked | `120911`, `123850`, `125607` |
| 2.10 | **Media/card image aspect ratio** — fix vertical squish in list views (e.g. Consortium News in `123202`); match single-article rendering (`161534`) | High | Medium | Planned | `123202`–`123215`, `161534` |
| 2.11 | **News byline format** — shorten attribution (drop "Posted by" if source shown); handle long names on mobile | Medium | Low | Content/dev | `123327`, `161534` |
| 2.12 | **Featured Title widget clarity** — heading above section, consistent type size; document widget vs category-listing widget; fix missing headings on some templates | High | Medium | Planned | `123739` |
| 2.13 | **Privacy/legal mobile tables** — responsive pattern for CCPA and similar tables (stack, scroll, or accordion) | High | Medium | Planned | `125733` |
| 2.14 | **Featured Author module** — readable bio type on mobile; unify "Featured Author" heading font with site sans scale | Medium | Low–medium | Planned | `125607` |
| 2.15 | **Bookseller signup on BigCommerce** — replace `list-manage.com` redirect with on-site form; submissions to same Mailchimp audience (embed MC HTML or custom form + merge tags). Fix intro copy typography (`orders@` same size as body). **Blocked:** [client decision](../notes/client-decisions.md) §3 — embed vs custom vs keep external | Medium | Medium | Blocked | `125535`, `125307`, Flow H |

### Acceptance hints (draft)

- **2.1** Section heading vs book title distinguishable at a glance (size, weight, or casing rule)
- **2.5** Search icon optically centered in hit area on all breakpoints
- **2.10** List and detail views use same image ratio rules; no vertical squash
- **2.12** Featured block always has visible section label in same position
- **2.15** Form lives on `orbooks.com` (BC web page); OR Books header/footer visible; fields: Email*, Store/organization*, Contact name, Website; successful submit adds contact to existing bookseller Mailchimp audience; Booksellers page CTA points to on-site URL not `list-manage.com`

---

## Sprint 3 — Polish & interactive states

*Low–medium impact · Low effort*

| ID | Task | Impact | Effort | Status | Discovery ref |
|----|------|--------|--------|--------|---------------|
| 3.1 | **Standardize accordion chevrons** — single shared SVG icon component | Medium | Low | Planned | P1 accordion |
| 3.2 | **Expand touch targets** — pricing radios, alphabet filter, tag chips, video arrows, captcha inputs ≥ 44×44px | High | Low–medium | Planned | P1 + P2 |
| 3.3 | **Social icon set** — align footer social with header icon geometry | Low | Low | Planned | P2 contact footer |
| 3.4 | **Cookie/preferences bar alignment** — center "Manage Website Data Collection Preferences" with footer | Low | Low | Planned | `123434` |

---

## Content fixes (non-dev)

| Item | Source |
|------|--------|
| About page missing spaces (`day.Though`, `released.Our`) | P2 `123828` |
| Footer "Developed By :" errant space | P2 `123434` |
| Greyed alphabet letters — empty-state copy if zero authors | P2 `123519` |
| Rights Enquiries heading typo ("ENQUIRES") | `125454` |
| Rights Catalogs Lorem Ipsum — replace before launch | `125507` |
| Privacy `http://www.orbooks.com` → https | `125756` |
| Privacy TOC item 4 numbering color | `125703` |

---

## Open questions (code mapping)

- [ ] Is search BC widget, theme JS, or WP plugin? (determines 1.3 implementation)
- [ ] Featured Title on catalog list (`123739`) — same widget as homepage Featured Title or category listing like Related Interest?
- [ ] Bookseller signup: embed vs custom BC form vs keep hosted? (determines 2.15)

---

## Backlog (post Phase 2 screenshot pass)

- Cart and checkout flow — **not captured in any screenshot**
- Account / login pages — footer links only
- Search results page layout — not captured
- Remaining screen recordings (3 of 4)

**Phase 2 complete:** 36 PNGs analyzed (33 original + 3 supplemental). Cart/checkout remain the largest gap.

---

## Pre-implementation gates

1. [ ] Map each finding to theme template, block, or plugin file
2. [x] Confirm remaining Phase 2 screenshots don't contradict or extend scope
3. [ ] Write formal plan doc (after Matt Pocock setup)
4. [ ] Branch from `staging` per project git workflow
