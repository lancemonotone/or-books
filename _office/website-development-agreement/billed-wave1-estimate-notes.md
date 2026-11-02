# Billed Wave 1 estimate — what is already true

Checked 2026-11-02. Rate $125/hr. No production push. Sources are the theme in `orbooks-theme/`, the live store, and staging.

## Already true

- Free Wave 1 list is out of this estimate. Draft already written: `email-draft-free-wave1-done.md`.
- Header on live and staging is Catalog, Authors, About, Booksellers. Events is not there. The old Events item sits inside a commented-out More menu: `orbooks-theme/templates/components/common/navigation-menu.html`. Footer still links to `/events/`.
- Live `https://www.orbooks.com/events/` still has one current event (September 2, 2026, Rosa Luxemburg's Herbarium, RSVP) plus the archive link. Layout is broken: featured sidebar image has no height, the event card is full width and very tall, the newsletter is not in the sidebar. Markup in `orbooks-theme-prod-download/templates/pages/custom/page/new-events.html` matches that (stray closing tags, upcoming and past blocks commented out).
- Staging `https://orbooks.mybigcommerce.com/events/` uses `templates/pages/custom/page/new-events.html`. Column layout is intact: Live on Ave C 2026 sidebar, events newsletter, a banner image, and View Events Archive. No current event card. Upcoming samples in that file are commented out and are 2024 placeholders.
- Staging `/past-events/` is usable. `templates/components/orbooks/event.html` is a hardcoded list (32 listing cards). Pagination shows 15 per page (`assets/js/theme/custom/custom.js`, `show_events_per_page`).
- See all sits in the section head, same tab: `templates/components/orbooks/section-head.html`. It is not under the product blocks.
- Product carousels keep arrows at every width and do not autoplay: `orProductCarouselSettings` in `assets/js/theme/custom/home.js`. The homepage hero does autoplay: `templates/components/carousel.html`. Round arrow chrome exists (`border-radius: 50%` in `category.scss`, `news.scss`, `pdp.scss`). Listing sliders (news, events, videos) use a separate chevron treatment: `assets/scss/or-books/slider-chrome.scss`.
- Featured Title cover is capped at `14.25rem` below 768px and `100%` from 768px: `assets/scss/or-books/productView.scss`.
- Our Authors still renders the featured-author carousel unless `hide_brand_banner` is on: `templates/pages/custom/category/authors.html`.
- Author photo is the category image beside the bio, with no rule between them: `templates/pages/custom/category/single-author.html`.
- Mailing list and percent-off text are centered below 768px and left-aligned from 768px: `assets/scss/or-books/newsletter.scss`.
- News, In the media, and past events share `templates/components/orbooks/listing-card.html` (figure, then date, then heading).

Arrow wording in the October 23 email is Rus summarizing Briefboard task **2.1** (phase 2, Wave 1). Antara's note is 2026-10-14 on that card. She did not pick one look. She asked which is worth doing.

Latest News (her item 4). Arrows beside the dates take too much space. Three options, with screenshots on the card:

1. Outline buttons outside the images.
2. Outline, slightly transparent, on top of the image.
3. No arrows. Auto-scroll like the carousel.

Her item 5: the Events and Videos sidebars (hidden until those sections are updated) use whichever Latest News option is chosen.

Book arrows are her item 9, a separate note: outline, centered on the book image, and she asked if arrows are needed at all. Mobile is her item 11: remove the round arrows and auto-scroll like the carousel, and she asked if that is intuitive.

Priced recommendation: option 2 for Latest News, Events, and Videos (3h). It answers the space complaint and keeps a control. Book arrows stay, outline and centered on the cover (2h). Mobile drops the round arrows and auto-scrolls (1.5h).

Events mockup: `New Events Page Mockup.jpg` in this folder. Her green notes: the top banner works like the homepage carousel and she will supply the graphics; View More can go to a page that lists old events and videos, and a replica of the current events page is enough. The 6h figure was a restore of the broken live page. This image is a full page, so that figure is retired.

## Paid work on the board (actual hours)

Invoices #109 and #113 totaled $3,062.50, which is 24.5 hours at $125. That matches Briefboard actuals:

| Cards | Estimated | Actual |
| --- | ---: | ---: |
| Discovery 1.1–1.3 (audit, Helvetica, staging import) | 7.75 | 8.5 |
| Wave 1, 2.1–2.7 | 6.25 | 16 |
| **Logged total** | | **24.5** |

The Wave 1 overrun is two cards: 2.1 Subjects (1h estimated, 4h actual) and 2.5 headings (1.5h estimated, 7h actual). Those became shared structure. The other five cards landed between 0.5h and 1.75h. Task 4.8 (one slider style, estimated 2h) was described to the client as already essentially finished by that structure.

The first $3,500 figure priced the new list like another full project. These notes are the cut that matches the finished cards: tweaks on components that already exist, plus one page assembled from the carousel, the event card, and the archive.

## Hours

| Group | Hours | Dollars |
| --- | ---: | ---: |
| Links and placement | 2 | 250 |
| Arrows | 3.5 | 437.50 |
| Type and image size | 2 | 250 |
| Cards and sidebar text | 2 | 250 |
| Billed list | 9.5 | 1,187.50 |
| Events page, from the mockup | 8.5 | 1,062.50 |
| **Total** | **18** | **2,250** |

Line detail:

- Subjects See all, new tab: 0.5. Same-tab is still the recommendation. Dropping it removes 0.5h.
- See all under the product blocks: 1. The section head already exists.
- Hide featured-author carousel: 0.5.
- Latest News arrows on the image, outline, slightly transparent, same on Events and Videos sidebars: 1.5. Slider chrome already exists from 2.2.
- Book arrows outlined and centered on the cover: 1.
- Mobile: remove round arrows and auto-scroll: 1. One carousel setting.
- Mobile Featured Title as large as the other covers: 1.
- Mobile title and author slightly larger: 0.5.
- Author name slightly larger: 0.5.
- Related Titles covers much smaller: 1.
- About-the-author photo much smaller: 0.5.
- In the media: less space between date and heading, centered on the image, same on News cards: 2.
- Center discount and mailing-list text from tablet up: 1.
- Line between author photo and text: 0.5.
- Type and image sizes, five tweaks on the existing scale: 2.
- Center discount and mailing-list text: 0.5. The panel already centers below 768px.
- In the media and News cards, date/heading spacing and centering: 1. One shared card.
- Line between author photo and text: 0.5.
- Events page from the mockup: 8.5. Header link 0.5. Sidebar videos 1.5. Top banner 1.5. Upcoming and Other as one card row used twice 2.5. Short past list plus View More 1. Phone and desktop check 1.5. Compared with 2.1 (a sidebar, 4h actual) and 2.5 (sitewide type, 7h actual).

## Events in / out

In: Events in the header. Sidebar with the season poster, a Videos block, and the events newsletter. Top banner carousel. Upcoming Live on Avenue C row. Other events row. Short past list. View More opens the archive already on staging.

Out: minor visual changes she deferred. She did not ask for ongoing event entry, and she did not ask for an admin screen. BigCommerce has no Events section. The cards live in the theme file. She supplies the banner graphics. A section with no events stays off the page.
