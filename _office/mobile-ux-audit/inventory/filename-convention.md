# Screenshot & recording filename convention

## Format

| Asset | Pattern | Example | Location |
|-------|---------|---------|----------|
| Screenshot | `{HHMMSS}.png` | `120802.png` | `_office/screenshots/` |
| Screen recording | `{HHMMSS}.mp4` | `123119.mp4` | `_office/screenshots/` |

`HHMMSS` is the **capture time** from the original device filename (24-hour clock, 2026-07-06 session).

## Rationale

- Short enough to reference in client decks and roadmap tasks (`120802`, `125535`)
- Unique within this audit session
- No spaces or long `Screenshot_20260706-` prefix

## When adding new captures

1. Save to `_office/screenshots/` and rename to `{HHMMSS}.png` or `{HHMMSS}.mp4`
2. Add row to [`screenshots.md`](./screenshots.md) with page/flow
3. Reference as `` `120802.png` `` or `` `120802` `` in discovery docs (both OK)

## Legacy names (renamed 2026-07-07)

| New | Old |
|-----|-----|
| `120802.png` | `Screenshot_20260706-120802.png` |
| `161238.png` | `Screenshot 2026-07-06 161238.png` |
| `123119.mp4` | `screen-20260706-123119-1783355469817.mp4` |

Previously analyzed files lived in `screenshots/Done/`; that folder was removed 2026-07-07 — all assets now sit in `screenshots/` alongside recordings.

Full inventory: [`screenshots.md`](./screenshots.md)
