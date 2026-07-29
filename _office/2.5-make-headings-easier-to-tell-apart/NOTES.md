# 2.5 — Make headings and titles easier to tell apart

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.5` |
| **taskKey** | `d9a285fd-c112-4962-be45-5bbb594dc1d3` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/d9a285fd-c112-4962-be45-5bbb594dc1d3 |
| **Branch** | `feature/wave1-2.5-headings-type-scale` |
| **Deploy** | Local only until Wave 1 batch `stencil push` |
| **Briefboard status** | `planned` — theme work in progress; no delivery comment yet |

## Client ask (original)

Sitewide: section headings, book titles, pull quotes, and body text are too close in size and weight. Fix the type scale across the storefront.

## Contract (locked)

- **`typography.scss`** = sole source of body + heading type.
- **Bare `h1–h6` only** — shared chrome sitewide (Condensed 700, uppercase, shared line); **sizes + margin-block-end = Major Third stairs** via `--or-type-h*-size` / `--or-type-h*-margin-block-end` (size base bumps at 1024).
- **Align:** naked headings `center` &lt;768, `start` ≥768. Headings inside cards/containers (`event-details`, `video-details`, `.card*`, product shells) use `text-align: inherit` so they follow the container.
- **No classes for heading appearance.** Classes on headings only if JS needs a hook; those classes get **no** type CSS.
- **No `h1–h6` rules in any other stylesheet** — not even margin/text-align (container inherit list lives in `typography.scss`).
- Layout around headings uses parents / flex / non-heading wrappers.
- Spec: `docs/superpowers/specs/2026-07-29-heading-major-third-design.md`

## Delivered so far

### Typography system

- Replaced `headings.scss` with **`typography.scss`** (tokens + body + shared `h1–h6`); imported **last** in `or-books/theme.scss`.
- Stripped **all** `h1–h6` rulesets outside `typography.scss` (or-books, foundation, citadel, stencil layouts, invoice/maintenance). Settings `$h*`-font vars only remain.
- Removed title-class type rulesets sitewide (`.page-heading`, `.productView-title`, `.card-title`, `.blog-title`, `.large-title`, `.related-title`, `.sidebarBlock-heading`, `.modal-header-title`, `.product-desc-title`, `.or-subjects-title`, etc.).
- JS hook classes kept in markup where needed (`productView-title`, `accordion-title`, `card-title`, …) — no type CSS on those classes.
- Foundation `_type.scss` heading/body type neutralized; competing `body` type in `common.scss` removed.
- Accordion chrome restored without type: `cursor: pointer`, chevron absolute right, open rotate (`common.scss` `.accordion-custom-tabs`).
- Subjects title size tokens removed; bare `h*` only.
- Docs: `docs/design-language.md` aligned to this contract.

### Events page cleanup (same branch; headings + template hygiene)

Production maps:

| URL | Template |
|-----|----------|
| `/events/` | `new-events.html` |
| `/past-events/` | `events.html` (confirmed via live `stencilBootstrap`) |

- Cleaned live **`new-events.html`**: sidebar featured only; banner slider; optional Upcoming + Past list (uncommented for review, wrapped in `<!-- BEGIN/END optional -->`); **View Past Events** `or-btn`; newsletter under that CTA (not sidebar); bare `h2`s.
- Restored **`events.html`** as real Past Events archive page (`orbooks/event` + pagination); bare `<h1>{{ page.title }}`. Local map: `/past-events/` → `events.html`.
- Spare copy of optional blocks: `templates/components/orbooks/events-deferred-sections.html` (not mapped; keep in sync; pointers in `new-events.html` header).
- Fixed single-slide Slick pagination dot (`home.js`: dots only if slide count > 1; no slick on empty `.upcoming-events`).
- Subscribe / archive CTAs use `.or-btn`; newsletter **sidebar** with bare **`h3`** + `or-btn-block`.
- New **`events.scss`** (imported before typography): events layout extracted from `pages.scss`; stripped card/list type stairs; replicated layout fixes — `.event-page { display: block }`, no `padding-left: 75px`, no negative margins on `.event-page`/`.video-page`.

## Still to do

- Full browser verify: home, Events (with optional blocks on), Past Events archive, PDP, author, cards — headings match; bylines readable.
- Decide with human: keep optional Upcoming/Past list live vs HTML-comment when empty (client used to uncommenting).
- Dial remaining non-heading type stairs that still fight hierarchy (author bio, etc.) if still in scope.
- Commit when asked; BB delivery comment when reviewable; Wave 1 `stencil push` for prod parity (`/events/` still old messy template until push).

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| “Easier to tell apart” via richer type scale stairs | One shared heading look for all `h1–h6` | Locked contract: one system, not per-level size stairs |
| (none on card) Events template cleanup | Cleaned `/events/` + restored `/past-events/` mapping clarity | Found hollow Upcoming + broken archive markup while verifying headings |

## Client action needed

- [ ] None until verify pass + push.
- [ ] Later: confirm whether optional Upcoming/Past list stays live or commented between shows.

## Verify

Hard-refresh local:

- Home strips — bare `h2` / section heads, shared heading look.
- `/events/` — LOAC sidebar `h2`; optional Upcoming/Past; View Past Events + newsletter; no lonely Slick dot with one banner slide.
- `/past-events/` — `events.html`, page title `h1`, event cards from `orbooks/event`.
- PDP book title `h1`, accordion `h3` — same heading system; accordion pointer + chevron right.
- Prod still differs until push ([orbooks.com/events/](https://orbooks.com/events/) still empty Upcoming + broken archive heading).

## Theme archive / new files

| Kind | Location |
|------|----------|
| Old `headings.scss` | `templates-archive/…` if present (write-once baseline) |
| New | `orbooks-theme/assets/scss/or-books/typography.scss` — delete to undo |
| New | `orbooks-theme/templates/components/orbooks/events-deferred-sections.html` — spare optional Events markup |

## Related

- **5.2** — Featured Author slider (Wave 3).
- Events optional-block workflow — client edits `new-events.html` HTML comments; spare in `events-deferred-sections.html`.
