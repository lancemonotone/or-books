# 2.1 — Label or Replace the Subjects icons

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.1` |
| **taskKey** | `280a567f-7694-47ee-8d72-402e68da199d` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=2#/task/280a567f-7694-47ee-8d72-402e68da199d |
| **Branch** | Merged to `staging` (`feature/sidebar-column-contract` FF). Earlier: `feature/wave1-2.1-subjects-icons`, `fix/wave1-2.1-subjects-catalog-head` |
| **Commits** (this close-out) | `650990f` Subjects heading + outline See all · `cde5c8c` Featured Title first + Short Description · `bc7517a` Featured Title spacing · `586f7c9` carousel sentence case + sidebar hairline · `2d872d9` sidebar gutters · `a3be931` 26/74 column shell · `e24a40f` square news thumbs |
| **Deploy** | On staging storefront (`orbooks.mybigcommerce.com`). Not orbooks.com until Wave 1 approval. |
| **Briefboard status** | `blocked` — our work done; waiting on client. Reply posted 2026-08-18. |

## Client ask (original)

Icons-only Subjects; hard to tell categories. Card: labels or text. Antara [P1]: in-house imagery, drop the heading, list under a View More accordion.

Aug 14 (product notes; ignore live-vs-staging split): text names + **SUBJECTS** heading; quieter See all; Featured Title stays top + Read More from **Short Description**; carousel intro sentence case; sidebar divider or grey wash + restore gap; no inner scrollbar.

## Delivered (final state)

- Subjects are a labeled text list (no icon grid). Heading is **Subjects** (CSS uppercase). **See all** is a compact outline button → `/catalog/`.
- Home list: 10 subjects ranked by bestseller title mix. Catalog root + subject pages: full list, current subject marked.
- Featured Title is at the **top** of the home sidebar. Read More uses the **Short Description** custom field. Card spacing flattened.
- Homepage carousel intro stays sentence case.
- Sidebar: light hairline, original gutters (35px / 60px), scrolls with the page (no inner scrollbar). Same 26/74 shell on home, catalog, booksellers, rights, events, about, author, book PDP.
- Empty **In the media** stays hidden. Latest News thumbs square; Read Now / thumb not clipped by Slick.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| View More accordion | Open text list | Names behind expand/collapse repeats the original problem |
| Drop the heading | **Subjects** heading | Later note asked for SUBJECTS, not Catalog |
| In-house / typographic icons, first 5–6 on home | Not doing | Client never sent art; owner closed this out |
| Grey wash on sidebar | Hairline only | She offered line or wash; line shipped |

## Client action needed

- [ ] Review on staging (Wave 1). Nothing to live until approval.

## Verify

- Home sidebar: Featured Title first (Short Description + Read More), then Subjects + outline See all, hairline + gap.
- `/catalog/` and a subject page: full subject list.
- Book / author: In the media hidden when empty.
- Latest News: square thumb, Read Now borders visible.

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change theme files | `templates-archive/` — write-once from `9a14f93` |
| New files (delete to undo) | `subjects-nav.html`, `subjects.scss`, `newsletter-stack.html` (later 2.1/2.6 overlap) |

## Screenshots / media

| File | Notes |
|------|--------|
| `2.1-subjects-home-sidebar.png` | Desktop homepage (older Catalog-head shot) |
| `2.1-subjects-home-sidebar-mobile.png` | Mobile |

## Related / follow-up

- **2.2** — quieter See all + Featured Title on top also noted there; 2.2 still has smaller desktop section titles + hide Reading List.
- Extra on this branch not on the 2.1 card: primary hover invert, catalog/order outline buttons, news thumb clip, empty media tab.
