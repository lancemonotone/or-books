# BigCommerce Stencil theme (OR Books)

Local Stencil theme for **orbooks.com** lives at repo root:

`orbooks-theme/`

This repo is the OR Books Stencil theme workspace. Briefboard lives in a separate repo. Do not commit secrets or `node_modules`.

## Secrets

- Token file: `orbooks-theme/secrets.stencil.json` (gitignored)
- Never commit, paste in chat, or put under `_office/`
- If exposed: revoke token in BC **Settings → API Accounts**, create new Stencil-CLI token (**Publish theme**), update `secrets.stencil.json`

## Config

- `config.stencil.json` — store URL (`https://www.orbooks.com`), port, package manager
- Store homepage URL for `stencil init` / config — **not** the API path (`https://api.bigcommerce.com/stores/.../v3/`)

## Working directory

All CLI commands below: run from `orbooks-theme/`.

```bash
cd orbooks-theme
```

## Commands

### Info / help

```bash
stencil --version
stencil --help
stencil help push          # any subcommand: push, download, start, …
stencil debug              # env + theme settings dump
```

### Local preview

```bash
stencil start              # http://localhost:3000 (needs valid token + config)
stencil start -n           # no API cache — use when template/layout looks wrong
```

Restart `stencil start` after any edit to `config.stencil.json`.

## Custom templates (local vs production)

Production assigns Stencil custom templates in BigCommerce admin (**Custom Template Associations**). Local `stencil start` does **not** read those assignments automatically — map URLs in `orbooks-theme/config.stencil.json` → `customLayouts`.

Client-facing layout guide (which template for which page type): `_office/OR Books Website Documentation AG.md` → **Category Page Documentation** / **Author Page Documentation**.

### Why localhost can show the wrong layout

| Layer | Role |
|-------|------|
| **Production storefront** | Uses admin template associations → e.g. author pages render `single-author.html`. |
| **Stencil CLI local** | Checks `customLayouts` first (exact URL match), then may fall back to `template_file` from the store API — often the **default** category/product/page template even when production uses a custom one. |
| **`stencil pull` / `stencil download`** | Theme files and Page Builder `config.json` only — **not** per-URL template assignments. |

Symptom: production author page has photo sidebar + **In the media** accordion; localhost shows catalog sidebar + flat product grid (`category.html`).

### Configure local mappings

File: `orbooks-theme/config.stencil.json`

```json
{
  "customLayouts": {
    "brand": {},
    "category": {
      "authors.html": ["/authors/", "/authors/h/"],
      "single-author.html": ["/authors/h/theodore-hamm/"]
    },
    "page": {
      "about.html": ["/about/"]
    },
    "product": {
      "custom-pdp.html": ["/some-merchandise-product-slug/"]
    }
  },
  "normalStoreUrl": "https://www.orbooks.com",
  "port": 3000,
  "packageManager": "npm"
}
```

Rules:

- **Key** = filename under `templates/pages/custom/{category|page|product|brand}/` (e.g. `single-author.html`).
- **Value** = full store path(s), no domain. Trailing slash optional (Stencil normalizes).
- **Arrays OK** — one template → many exact URLs ([BC docs](https://developer.bigcommerce.com/docs/storefront/stencil/themes/templates/custom-templates)).
- **No wildcards** — `/authors/[slug]/` or `/authors/*/*/` do not work; each path is literal.
- **Restart** `stencil start` after edits.

Add mappings **when you need to test that page type locally** — not every author/product URL unless you want full parity.

### Verify which template is active

**Production (read-only):** View Source → find `stencilBootstrap("category", "...")` (or `page` / `product`) → parse JSON → **`template`** field.

Example: `pages/custom/category/single-author` on https://orbooks.com/authors/h/theodore-hamm/

**Local:** Same check on `http://localhost:3000/...` after restart. Should match production for mapped URLs.

Quick DOM check: `single-author.html` → `.single-author-page` wrapper; default category → no that class, catalog sidebar widgets.

### Production source of truth (bulk export)

To list **all** assignments without guessing URLs:

1. **GET** [Custom Template Associations](https://developer.bigcommerce.com/docs/rest-content/custom-template-associations) — `?type=category` (and `page`, `product`, `brand`); paginate.
2. **GET** [Categories](https://developer.bigcommerce.com/docs/rest-catalog/categories) (etc.) — join `entity_id` → `url`.
3. Build `customLayouts` arrays from `file_name` + paths. Store hash from CDN (`s-4rbj5oww8j` → `4rbj5oww8j`). Token: `secrets.stencil.json` (never commit or paste in chat).

Do **not** use Categories API `layout_file` for Stencil themes — Blueprint only; Stencil uses Custom Template Associations.

### OR Books custom template files (theme tree)

Under `orbooks-theme/templates/pages/custom/`:

| Type | File | Typical use |
|------|------|-------------|
| category | `authors.html` | `/authors/`, letter buckets |
| category | `single-author.html` | Individual author pages |
| category | `merchandise.html` | `/merchandise/` |
| category | `booksellers.html` | `/booksellers/` |
| category | `subsidiary-rights.html` | `/subsidiary-rights/` |
| category | `reading-list.html` | One URL per reading list under `/reading-lists/.../` |
| category | `categroy-no-sidebar.html`, `category-no-sidebar-2.html`, `category-no-sidebar-3.html` | Per-category admin assignment — URL varies |
| page | `about.html`, `events.html`, `new-events.html`, `videos.html`, `sign-up.html` | Static pages — map when testing |
| product | `custom-pdp.html` | Merchandise PDPs — one URL per product |

Defaults (`category.html`, `product.html`, `home.html`, …) need no `customLayouts` entry.

### Currently mapped locally (check file for latest)

See `orbooks-theme/config.stencil.json`. As of 2026-07-28: authors index + `/authors/h/`, Theodore Hamm single-author, merchandise, booksellers, subsidiary-rights. Page/product/reading-list/no-sidebar templates unmapped until needed.

### References

- [Custom Templates (local `customLayouts`)](https://developer.bigcommerce.com/docs/storefront/stencil/themes/templates/custom-templates)
- [Custom Template Associations API (production assignments)](https://developer.bigcommerce.com/docs/rest-content/custom-template-associations)
- [Apply a custom template locally (BC Support)](https://support.bigcommerce.com/s/question/0D51B00004mno5ZSAQ/how-do-i-apply-a-custom-template-locally)

## Helvetica / font licensing work

```bash
stencil download -o        # pull live theme; overwrite local
stencil download -f templates/layout/base.html   # one file only
stencil pull               # pull active theme *config* only (Page Builder settings)
```

First-time empty folder: create config (`stencil init` or write `config.stencil.json` + `secrets.stencil.json`), then `stencil download -o`, then `npm install`.  
`stencil init` may fail `npm install` on an empty folder (no `package.json` yet) — ignore that; download first.

### Build / upload

```bash
stencil bundle             # zip only — no upload
stencil push               # bundle + upload (does not activate unless flagged)
stencil push -a            # upload + activate (picks variation interactively)
stencil push -d            # delete oldest private theme if upload limit reached
stencil push -c 1          # push to channel ID 1 (multi-storefront)
```

Useful flags: `-s theme.zip` (save zip), `-S` (source maps), `-vb` (verbose).

### Init (rare after first setup)

```bash
stencil init
# prompts: store home URL, access token, port (3000), package manager (npm)
```

## Helvetica / font licensing work

Context: Monotype detected embedded Helvetica webfonts.

**Finished in theme (2026-07-24):** SCSS uses honest stacks; `base.html` loads
**Roboto Condensed** under its real name; `assets/fonts/helvetica*` removed;
checkout no longer embeds Helvetica files. Tracker: issue #1.

Stacks: condensed → `"Roboto Condensed", Helvetica, Arial, sans-serif`;
body → `Helvetica, Arial, sans-serif`; Neue → `"Helvetica Neue", Helvetica, Arial, sans-serif`.

Notes / older paste trials: `_office/1.2-helvetica-removal/`  
Email thread: `_office/helvetica.md`

Deploy when ready: `stencil push -a`, then Network → Font check (no store CDN Helvetica).

Invisible deploy probe (View Source):

```html
<!-- orbooks font audit: stencil deploy probe 2026-07-24 -->
```
## What must stay in the theme tree

Stencil needs essentially the **whole theme package** (not just `base.html`):

| Keep | Why |
|------|-----|
| `templates/` | Markup / layouts |
| `assets/` | SCSS, JS, images, fonts |
| `lang/` | Translations |
| `config.json`, `schema.json` | Theme / Page Builder settings |
| `package.json`, webpack/stencil conf | Build toolchain |
| `meta/` | Theme marketplace metadata |

| Do not version in git | Why |
|----------------------|-----|
| `node_modules/` | Reinstall with `npm install` |
| `secrets.stencil.json` | API token |
| Build artifacts / random zips | Regenerated by `bundle` / `push` |

~800 source files is normal for a customized Cornerstone-based theme. You need them for `stencil start` / `bundle` / `push`.

## Git / repo strategy (guidance)

**Do not** dump the full theme into the Briefboard `or-books` git history if you can avoid it.

Recommended:

1. **Separate repo** for the Stencil theme (e.g. `orbooks-stencil` / `orbooks-theme`).
2. Keep this repo (`or-books`) for Briefboard (`app/`) + `_office/` client notes.
3. Until split: gitignore entire `orbooks-theme/` here so accidental commits do not pollute Briefboard.

Do not “move Briefboard into app” for this — `app/` already is Briefboard. Theme should leave this repo, not nest deeper inside it.
