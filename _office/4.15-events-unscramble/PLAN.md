# 4.15 — Events page unscramble

## Goal

Make `/events/` usable again: two-column layout restored, Antara’s posters in place, archive link works. **No mockup rebuild.**

**Local now:** theme assets under `assets/img/events/` + 2-col `.event-poster-grid`. **Ship:** Image Manager URLs (see NOTES).

## What’s true now (verified)

| Surface | State |
|--------|--------|
| **Live** `orbooks.com/events/` | Broken markup (mismatched tags from old theme). Sidebar “featured” slot empty. Current event + newsletter still in the HTML soup but not in a proper page column. |
| **Staging** + **theme in repo** (`new-events.html`) | Columns work: sidebar (Live on Ave C 2026 poster + Events newsletter) + main (banner + “View Events Archive”). **No current event card** — upcoming/past blocks are commented out. |
| **Past archive** `/past-events/` | Already usable on staging. |

Client ask (Briefboard): unscramble layout, put current events back, leave the rest. She will send new posters later (content, not layout).

## Target layout (desktop)

```
┌─────────────┬──────────────────────────────────────┐
│ Sidebar     │ Main                                 │
│             │ ┌──────────────────────────────────┐ │
│ Live on     │ │ Top banner (existing / her art)  │ │
│ Ave C poster│ └──────────────────────────────────┘ │
│             │ ┌──────────────────────────────────┐ │
│ Events      │ │ Current event card               │ │
│ newsletter  │ │ (poster · date · title · RSVP)   │ │
│             │ └──────────────────────────────────┘ │
│             │         [ View Events Archive ]      │
└─────────────┴──────────────────────────────────────┘
```

Phone: main stack first, then sidebar (existing `.event-main-page` order).

## In scope

1. Keep the **staging/theme** column shell as the source of truth (already fixed vs live).
2. Uncomment / restore **one current event** in the main column (live’s Rosa Luxemburg card is the known current item until she sends updates).
3. Smoke-check desktop + phone: sidebar poster, newsletter, banner, event card, archive link.
4. Leave optional Upcoming / short Past list **commented** until she has content (or she asks to show them).

## Out of scope

- Mockup rebuild (header Events link, Videos sidebar widget, carousel of many banners, new admin UI).
- Inventing events she hasn’t supplied.
- Fixing live by editing the old broken prod-download file in place — ship the working theme template instead.

## Files

- `orbooks-theme/templates/pages/custom/page/new-events.html` — put current event back in main; keep optional blocks commented.
- `orbooks-theme/assets/scss/or-books/events.scss` — only if layout still breaks after markup fix.
- `_office/4.15-events-unscramble/NOTES.md` — delivery memo after verify.

## Steps

1. Branch from staging after 4.11 merge: `feature/wave2-4.15-events-unscramble`.
2. Add current event card markup into main (match existing `.event-card` pattern already styled).
3. Local + staging check at phone and desktop widths.
4. Briefboard your-turn + screenshot when approved.

## Done when

- Staging `/events/` shows: sidebar poster + newsletter, banner, **at least one** current event card, archive button.
- Layout is two columns on desktop; no empty broken sidebar slot like live.
- No mockup-only sections added.
