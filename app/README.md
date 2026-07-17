# OR Books — Mobile Review (presentation app)

Interactive client review app. **No WordPress dependency** — deploy this folder as `orbooks.com/audit/` (sibling to WP, not inside it).

Discovery notes and roadmap live in [`../_office/mobile-ux-audit/`](../_office/mobile-ux-audit/). **YAML in `data/` is the presentation source of truth.**

## Layout

```
or-books/                 ← repo root
└── app/                  ← document root on the server (deploy as /audit/)
    ├── config.example.php  # copy → config.php (gitignored)
    ├── config.php          # local secrets + vendor + hourly_rate
    ├── index.html
    ├── assets/           # JS, CSS, motion adapter
    ├── api/              # PHP — saves comments/decisions to JSON
    ├── data/             # issues.yaml, evidence.yaml, decisions.yaml
    ├── edit/             # password-protected YAML editor
    ├── media/            # PNG + MP4 (gitignored — link or copy)
    ├── robots.txt
    └── scripts/
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
5. Copy `config.example.php` to `config.php` (in this `app/` folder) and set `editor_password`.
6. Optional: add HTTP Basic Auth in `.htaccess` for another layer.

The review app and content editor share the same password and session. **Nothing in the review UI loads without sign-in.** YAML/JSON under `data/` are blocked from direct HTTP access and served only through authenticated APIs.

## Settings

Signed-in **Settings** (gear in the header):

- Client / project name (header brand, Overview heading, browser tab, email subject prefix)
- Appearance: light / dark / system (saved in the browser)
- Notification on/off, client & developer teams (each person = name used in the app + email + update frequency). Those names are the options in the “Your name” picker on issues and Questions.

Deploy secrets stay in `config.php` at the **app root** (same folder as `index.html`; deploy with the rest of `app/` as `/audit/`):

- `app_public_url` — base URL for links inside notification emails
- `hourly_rate` — optional USD rate for estimate/actual dollar amounts (omit or null when unset)
- `vendor` — optional estimate PDF header: `name`, `business`, `address`, `email`, `phone`, `logo` (path relative to the app folder, e.g. `assets/vendor-logo.png`)
- `notify.from` — From header for PHP `mail()`
- `notify.flush_secret` — required by the digest cron endpoint
- `notify.enabled` — hard off for the host

Digest cron (hourly/daily teams): hit `api/notify-flush.php?secret=YOUR_FLUSH_SECRET` on a schedule (every 15–60 minutes is fine). PHP `mail()` must work on the host; a stronger provider can replace it later.

## Content editor

URL: **`/audit/edit/`** (linked from the signed-in review nav).

### Setup

1. Copy `config.example.php` to `config.php` (in this `app/` folder).
2. Set `editor_password` to a long random string.
3. Ensure PHP can write to `data/*.yaml`.

Leave `editor_password` empty to disable the review app and editor (both require it).

### Security (basic)

| Layer | What it does |
|-------|----------------|
| Password | Required to open the review app and editor; stored in `config.php` only |
| Session cookie | HttpOnly, SameSite=Strict; shared by review + editor |
| CSRF token | Required on saves, replies, and sign-out |
| Honeypot field | Hidden field bots often fill; request rejected |
| Login lockout | 8 failed attempts, 15 minute cooldown |
| `data/.htaccess` | Denies direct download of YAML/JSON |
| `robots.txt` | Asks crawlers not to index `/edit/` or editor API |
| `noindex` meta | On the editor page itself |

This is not hidden from humans who know the URL. It blocks casual crawlers and drive-by bots, not a determined attacker. Use HTTP Basic Auth on `/audit/` if you want more.

### Using the editor

1. Open `/audit/edit/`.
2. Sign in with the password.
3. Use the tabs: **Overview**, **Issues**, **Media**, **Questions**.
4. Pick an item in the sidebar; changes autosave. Deep-link with `?tab=issues&issue=<key>` (UUID), not the display id.
5. **Reorder issues:** drag the ⠿ handle in the Issues sidebar. With **All phases**, drag across phase groups; with a single phase filter, reorder within that phase only. Display ids Compact automatically after reorder, delete, phase change, or new issue.
6. **Reorder phases (Overview):** on the presentation Overview, use **Reorder phases**. All phases collapse; drag the ⠿ handle to change plan order. Phase numbers become dense `1…N`; Issue display ids Compact to match (`n.x`). Issue keys are unchanged.

**Media files:** copy PNG or MP4 files into `media/` on the server (or run `scripts/link-media.sh` locally). Use **Add media** or **Change file** to open the image picker — it refreshes the file list when it opens.

When you save **Issues**, **Media**, or **Questions**, overview counts in `audit.yaml` are recalculated automatically. The presentation app also counts live from the data files.

## Editing content (manual YAML)

There is no admin screen. You edit **YAML files** in `data/` with any text editor, save, and refresh the browser.

### File map

| File | What it controls |
|------|------------------|
| `data/audit.yaml` | Intro text, phase groupings, last-updated (overview counts are calculated automatically) |
| `data/issues.yaml` | Each recommendation note (what the client reads) |
| `data/evidence.yaml` | Screenshot and video index |
| `data/decisions.yaml` | Questions the client must answer |
| `data/responses/comments.json` | Client feedback (written by the app, not by hand) |
| `data/responses/decisions.json` | Client answers (written by the app, not by hand) |

### Edit an existing note

Open `data/issues.yaml`. Each item looks like this:

```yaml
- key: "280a567f-7694-47ee-8d72-402e68da199d"   # stable UUID — lasting refs use this
  id: "1.2"                                       # display label only (phase.sequence)
  sprint: 1
  title: Label or Replace the Subjects icons
  priority: critical
  status: planned
  tags: [navigation, subjects]
  problem: >
    What the client sees under "Issue Found".
  recommendation: >
    What the client sees under "Suggested Fix".
  acceptance:
    - Internal checklist for you (not shown in the app)
  evidence:
    - file: "121022.png"
```

Every note needs a stable **`key`** (UUID). Chips, URLs, evidence links, decision blocks, comments, and editor deep links all use **`key`**. The **`id`** (`1.2`) is the human label only—do not put it in lasting references.

Change `title`, `problem`, or `recommendation` for client-facing copy. Change `priority` (`critical`, `high`, `medium`, `low`) or `status` (`planned`, `in_progress`, `blocked`, `deferred`, `complete`) for the pills on each card.

Optional estimate fields: `hours` (planned effort) and `actual_hours` (burn roll-up from an external time tracker, not logged in this app). Dollar amounts use `hours` or `actual_hours` × `hourly_rate` from `config.php` when the rate is set.

**Blocked vs deferred:** set `status: blocked` (“Waiting on you”) when an Issue waits on a Questions answer or other client gate — it stays in the Estimate quote (Remaining / Grand). Set `status: deferred` when the client does not want the recommended work (confirm from comments / scope by hand). Deferred appears on the Estimate side line but is excluded from Done, Remaining, and Grand totals. Do not mass-convert Blocked → Deferred.

`tags` show as chips on the issue detail page (filter links; editable there too). `acceptance` stays internal planning only — not shown in the presentation app.

Prefer editing via **`/audit/edit/`** (it assigns `key` and a display `id` for new notes). Hand-editing YAML: generate a new UUID for `key` if you add a row manually.

### Add a new note

1. Prefer the editor’s **Add issue** (assigns `key` + display `id`).
2. Or add a block to `issues.yaml` with a new UUID `key`, next display `id` in sequence (e.g. `1.10`), and the same fields as above.
3. Set `sprint` to `1`–`5` to place it in the right phase (5 = Deferred).
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
  url: https://orbooks.com/example-page
  issues:
    - "280a567f-7694-47ee-8d72-402e68da199d"   # Issue keys, not display ids
```

The filename must match a file in `media/`. Both directions help: notes pull images in, and the Media gallery links back to notes.

### Add a new screenshot or video

1. Copy the file into `_office/screenshots/` (source) and `app/media/` (for the app).
2. Name it `{HHMMSS}.png` or `{HHMMSS}.mp4` (see [`../_office/mobile-ux-audit/inventory/filename-convention.md`](../_office/mobile-ux-audit/inventory/filename-convention.md)).
3. Add a row to `data/evidence.yaml`.
4. Reference it from the relevant note(s) in `issues.yaml`.

For videos, set `type: video` in `evidence.yaml`.

### Edit phases (groupings)

Phases live in `data/audit.yaml` under `sprints`. Each phase has `id`, `title`, `subtitle`, and `description` (all client-facing).

Phase numbers are dense `1…N` in list order. Reordering on Overview renumbers ids and Compacts Issue display ids (`n.x`). A title like “Deferred” is ordinary copy — not a special pinned phase. Priority (`critical` / `high` / `medium` / `low`) is separate and can vary within a phase.

Notes are assigned to a phase with the `sprint` field in `issues.yaml`. The phase `id` must match.

To re-apply phase membership from client `[P1]` / `[P2]` / `[P3]` markers in comments (leaving comments and priority untouched), run:

```bash
node scripts/migrate-phases-from-pn.mjs
```

### Add or edit a client question

Open `data/decisions.yaml`:

```yaml
- key: 51411d72-c195-47a1-8036-96c9314de4e8
  title: Slider controls (dots or arrows)
  blocks:
    - "d1a5bef1-69b2-4ff5-8bf2-61efc6b31212"   # Issue keys
  question: Which style should all sliders use on the site?
  recommendation: >
    Optional text shown as "Suggested approach".
  options:
    - value: dots
      label: Dots under the slider
      description: Optional helper text.
      evidence:
        - file: "120911.png"
          caption: Homepage, dot-style slider
```

`blocks` lists Issue **keys** linked to this question. Linked questions appear on those issue pages in the presentation. Set the linked note's `status: blocked` when it depends on the answer (Waiting on you; still in the Estimate quote). Use `status: deferred` only when the client has declined the recommended work (out of quote) — not as a rename of Blocked.

Each question needs a stable **`key`** (UUID). The editor assigns one when you add a question; it is not shown to the client. Client answers are stored under that key in `data/responses/decisions.json`.

### Typical workflow

1. Draft findings in `_office/mobile-ux-audit/` (markdown).
2. Copy the client-ready wording into `issues.yaml`.
3. Link media in `evidence.yaml` and on each note.
4. Preview locally (`npx serve` in `app/`).
5. Deploy when ready.

### Views

`#/` overview (phases accordion; `#/?phases=1` opens phase 1) · `#/issue/<key>` (note by UUID; chips still show `1.3`) · `#/evidence` · `#/decisions` · `#/responses`

Legacy `#/sprints` and `#/sprint/<n>` redirect to overview.

Old `#/issue/1.3` routes are not supported (hard cut).
