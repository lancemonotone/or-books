# Phase 1 Discovery — Done Screenshots

**Scope:** 10 screenshots in [`../../screenshots/`](../../screenshots/)  
**Captured:** 2026-07-06  
**Status:** Analysis complete (expanded via [screenshot-annotations.md](./screenshot-annotations.md))

---

## 1. Inconsistencies — Buttons, Typography, and Spacing

### Typography & visual hierarchy

| Issue | Detail | Screens likely involved |
|-------|--------|-------------------------|
| Inconsistent header fonts/weights | Bold condensed sans for section headings ("FORTHCOMING & NEW RELEASES", "SUBJECTS", "LATEST NEWS") vs heavier/different config on book page title "RUN ZOHRAN RUN!" | Homepage, book detail |
| Body text variations | "Jules Boykoff" section uses modern sans with generous line-height; review quotes on book detail use tightly tracked sans with different weight and character width | Book detail, author bio |
| Case treatments | Section headings alternate all-caps ("FORTHCOMING & NEW RELEASES", "SUBJECTS") vs mixed title-case ("In the Media", "Latest News") | Homepage, media modules |

### Spacing & alignment

| Issue | Detail | Screens likely involved |
|-------|--------|-------------------------|
| Horizontal layout shifts | "Latest News" has explicit side margins; "In the Media" cards bleed closer to viewport edges; book detail body text has zero side padding | Homepage, book detail |
| Vertical padding anomalies | Subjects page has large empty gaps between illustrative icons; product config radio options are tightly packed with inadequate touch spacing | Subjects, book detail purchase matrix |

### Buttons & form elements

| Issue | Detail | Screens likely involved |
|-------|--------|-------------------------|
| Conflicting search UI | Two search bar patterns: (A) rounded, nearly full-width with trailing X; (B) sharp rectangular, edge-to-edge with leading arrow and trailing magnifier | Header search overlay, alternate search view |
| Quantity counter disconnect | `- 1 +` counter uses light-gray border and off-center typography; clashes with solid black sharp-corner "Add To Cart" CTA beside it | Book detail |
| Accordion toggle discrepancies | Sidebar "Catalog" chevron points down; "In the Media" accordion uses different weight/style chevron pointing up | Sidebar menu, media page |

---

## 2. User flows & friction points

### Flow A — Browsing subjects to finding a book

| Step | Action |
|------|--------|
| 1 | User opens hamburger menu or scrolls to Subjects section |
| 2 | User views abstract line-art icons (megaphone, capitol dome, lips) |
| 3 | User clicks an icon to view a filtered list |

**Friction:** Icons are unlabelled. "Politics" may be guessable (capitol dome); "Feminism", "Media", and others are ambiguous — forces trial-and-error.

### Flow B — Using search to find content

| Step | Action |
|------|--------|
| 1 | User taps magnifying glass in sticky header |
| 2 | Overlay opens; mobile keyboard appears |
| 3 | User attempts to clear or execute search |

**Friction:** Input fields, close patterns, and placeholder text shift styles by context — no predictable interaction model. Tapping "Search the store" transitions to a different UI ("Search our store…") and **the header disappears** (see `121855`–`121904`). Active search shows a large blank void below with no empty-state hints. **Fix:** single in-place search; header stays visible — not blocked by BigCommerce (theme implementation).

### Flow C — Product configuration & purchasing

| Step | Action |
|------|--------|
| 1 | User lands on book detail page (e.g. Run Zohran Run!) |
| 2 | User reads reviews and scrolls to purchase matrix |
| 3 | User selects format (Paperback, E-Book) and taps Add To Cart |

**Friction 1:** Text blocks lack left/right padding; copy sits against viewport edge — poor readability.  
**Friction 2:** Radio buttons and currency options are crammed together — high risk of mis-taps on mobile.

---

## 3. Findings summary (for roadmap triage)

### Critical (usability blockers)

- Zero horizontal padding on book detail body text
- Unlabelled Subjects icons
- Dual search bar implementations
- Undersized touch targets on purchase options

### High (consistency / trust)

- Typography hierarchy and casing drift across modules
- Section horizontal alignment inconsistency (Latest News vs In the Media)
- Quantity counter visual mismatch with primary CTA

### Medium (polish)

- Excessive vertical gaps on Subjects page
- Mismatched accordion/chevron icons
- Search empty state

---

## 4. Screenshot file index

Per-file detail: [screenshot-annotations.md](./screenshot-annotations.md)

| File | Page / flow | Key findings |
|------|-------------|--------------|
| `120802.png` | Menu overlay | Redundant submenu labels; overlay crowds logo; search icon off-center |
| `120911.png` | Homepage | Dual slider styles; heading vs title hierarchy; false "See all" affordance |
| `121002.png` | — | (see annotations) |
| `121022.png` | — | (see annotations) |
| `121855.png` | Search entry | "Search the store" → different UI; header hides |
| `121904.png` | Search active | Alternate search panel |
| `123202.png` | Author In the Media | Squished media card images |
| `123215.png` | Author In the Media | Same aspect-ratio issue |
| `123249.png` | Book detail reviews | Oversized review type; poor vertical rhythm |
| `123310.png` | — | (see annotations) |

### Related (added post Phase 1)

| File | Page / flow | Key findings |
|------|-------------|--------------|
| `160840.png` | Reading Lists module | View All page redundant |
| `161238.png` | In the Media list | Read Now overlay (see recording) |
| `161534.png` | Media article | Correct image ratio; no back nav; byline |
