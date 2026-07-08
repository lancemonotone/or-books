# OR Books — Mobile Review (presentation app)

Interactive client review app. **No WordPress dependency** — deploy this folder as `orbooks.com/audit/` (sibling to WP, not inside it).

Discovery notes and roadmap live in [`../_office/mobile-ux-audit/`](../_office/mobile-ux-audit/). **YAML in `data/` is the presentation source of truth.**

## Layout

```
app/                      ← document root on the server (deploy as /audit/)
├── index.html
├── assets/               # JS, CSS, motion adapter
├── api/                  # PHP — saves comments/decisions to JSON
├── data/                 # issues.yaml, evidence.yaml, decisions.yaml
├── edit/                 # password-protected YAML editor (not linked from presentation)
├── media/                # PNG + MP4 (gitignored — link or copy)
├── robots.txt            # asks crawlers to skip /edit/ and editor API
└── scripts/
    ├── link-media.sh
    └── link-media.ps1
```

## Local preview

```bash
# From repo root
./app/scripts/link-media.sh     # or: pwsh app/scripts/link-media.ps1

cd app && npx --yes serve -p 8080
```

Open http://localhost:8080/#/

Saving feedback requires PHP on the deployed host.

## Deploy

1. Upload **`app/`** contents to `public_html/audit/` on the server.
2. Copy or sync `_office/screenshots/*` into `media/` on the server.
3. Make `data/responses/` writable by PHP.
4. Make `data/` writable by PHP if you use the editor.
5. Copy `api/config.example.php` to `api/config.php` and set `editor_password`.
6. Optional: add HTTP Basic Auth in `.htaccess` for another layer.

## Content editor

URL: **`/audit/edit/`** (not linked from the client presentation).

### Setup

1. Copy `api/config.example.php` to `api/config.php`.
2. Set `editor_password` to a long random string.
3. Ensure PHP can write to `data/*.yaml`.

Leave `editor_password` empty to disable the editor.

### Security (basic)

| Layer | What it does |
|-------|----------------|
| Password | Required to sign in; stored in `config.php` only |
| Session cookie | HttpOnly, SameSite=Strict |
| CSRF token | Required on save and sign-out |
| Honeypot field | Hidden field bots often fill; request rejected |
| Login lockout | 8 failed attempts, 15 minute cooldown |
| `robots.txt` | Asks crawlers not to index `/edit/` or editor API |
| `noindex` meta | On the editor page itself |

This is not hidden from humans who know the URL. It blocks casual crawlers and drive-by bots, not a determined attacker. Use HTTP Basic Auth on `/edit/` if you want more.

### Using the editor

1. Open `/audit/edit/`.
2. Sign in with the password.
3. Use the tabs: **Overview**, **Notes**, **Screenshots**, **Questions**.
4. Pick an item in the sidebar, edit the form, click **Save section**.

**Media files:** copy PNG or MP4 files into `media/` on the server (or run `scripts/link-media.sh` locally), then click **Reload** in the editor. Use **Add media** or **Change file** to open the image picker.

When you save **Notes**, **Screenshots**, or **Questions**, overview counts in `audit.yaml` are recalculated automatically. The presentation app also counts live from the data files.

## Editing content (manual YAML)

There is no admin screen. You edit **YAML files** in `data/` with any text editor, save, and refresh the browser.

### File map

| File | What it controls |
|------|------------------|
| `data/audit.yaml` | Page title, intro text, phase groupings (overview counts are calculated automatically) |
| `data/issues.yaml` | Each recommendation note (what the client reads) |
| `data/evidence.yaml` | Screenshot and video index |
| `data/decisions.yaml` | Questions the client must answer |
| `data/responses/comments.json` | Client feedback (written by the app, not by hand) |
| `data/responses/decisions.json` | Client answers (written by the app, not by hand) |

### Edit an existing note

Open `data/issues.yaml`. Each item looks like this:

```yaml
- id: "1.1"
  sprint: 1
  title: Add side margins on mobile pages
  impact: critical
  effort: low
  status: planned
  tags: [layout, spacing]
  problem: >
    What the client sees under "What we found".
  recommendation: >
    What the client sees under "What we suggest".
  acceptance:
    - Internal checklist for you (not shown in the app)
  evidence:
    - file: "121022.png"
      caption: Short label under the image
```

Change `title`, `problem`, or `recommendation` for client-facing copy. Change `impact` (`critical`, `high`, `medium`, `low`) or `status` (`planned`, `blocked`) for the pills on each card.

`effort`, `tags`, and `acceptance` stay in the file for your own planning. They are **not** shown in the presentation app.

### Add a new note

1. Pick the next id in sequence (e.g. `1.10` for phase 1, `2.16` for phase 2).
2. Add a new block to `issues.yaml` with the same fields as above.
3. Set `sprint` to `1`, `2`, or `3` to place it in the right phase.
4. Link screenshots under `evidence` (see below).

### Link a screenshot to a note

**On the note** — add under `evidence`:

```yaml
evidence:
  - file: "121022.png"
    caption: Book page, text at the edge
```

**On the file** — add or update the matching row in `data/evidence.yaml`:

```yaml
- file: "121022.png"
  type: image
  page: Book detail — Run Zohran Run
  issues: ["1.1", "2.2"]
```

The filename must match a file in `media/`. Both directions help: notes pull images in, and the Screenshots gallery links back to notes.

### Add a new screenshot or video

1. Copy the file into `_office/screenshots/` (source) and `app/media/` (for the app).
2. Name it `{HHMMSS}.png` or `{HHMMSS}.mp4` (see [`../_office/mobile-ux-audit/inventory/filename-convention.md`](../_office/mobile-ux-audit/inventory/filename-convention.md)).
3. Add a row to `data/evidence.yaml`.
4. Reference it from the relevant note(s) in `issues.yaml`.

For videos, set `type: video` and optional `poster: "123202.png"` in `evidence.yaml`.

### Edit phases (groupings)

Phases live in `data/audit.yaml` under `sprints`. Each phase has `id`, `title`, `subtitle`, and `description` (all client-facing).

Notes are assigned to a phase with the `sprint` field in `issues.yaml`. The phase `id` must match.

### Add or edit a client question

Open `data/decisions.yaml`:

```yaml
- id: carousel-style
  title: Slider controls (dots or arrows)
  blocks: ["2.9"]
  question: Which style should all sliders use on the site?
  recommendation: >
    Optional text shown as "Our suggestion".
  options:
    - value: dots
      label: Dots under the slider
      description: Optional helper text.
      evidence:
        - file: "120911.png"
          caption: Homepage, dot-style slider
```

`blocks` lists note ids that are waiting on this answer (for your reference only; not shown in the app). Set the linked note's `status: blocked` when it depends on the answer.

### Typical workflow

1. Draft findings in `_office/mobile-ux-audit/` (markdown).
2. Copy the client-ready wording into `issues.yaml`.
3. Link media in `evidence.yaml` and on each note.
4. Preview locally (`npx serve` in `app/`).
5. Deploy when ready.

### Views

`#/` overview · `#/sprint/1` (phase 1) · `#/issue/1.3` (note) · `#/evidence` · `#/decisions` · `#/responses`
