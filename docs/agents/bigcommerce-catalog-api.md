# BigCommerce Catalog / Content API + WebDAV (OR Books)

Use for staging↔prod catalog, blog, categories, theme associations — **not** Stencil CLI (`secrets.stencil*.json`).

## Secrets

File: `orbooks-theme/secrets.catalog.json` (gitignored via `secrets.*.json`).

Example shape: `orbooks-theme/secrets.catalog.example.json`.

| Block | Purpose |
|-------|---------|
| `prod` | `storeHash` + `accessToken` — **read-only** scopes |
| `stage` | `storeHash` + `accessToken` — **modify** scopes |
| `webdav` | Staging (or target) WebDAV — File Access password |

### Catalog API OAuth scopes (store-level API account)

Same five areas on both stores; prod = read-only, staging = modify:

- Products
- Content
- Information & Settings
- Themes
- Marketing

**Do not** add Sites & Routes for custom template associations — those use **Themes**.

Scopes cannot be edited on an existing account → create a new API account if scopes change.

Never commit tokens or paste them in chat / `_office/`.

## WebDAV (blog thumbs, Image Manager files)

Admin: **Settings → File Access (WebDAV)** (or Account → File Access).

| Field | Value |
|-------|--------|
| URL | `https://store-{hash}.mybigcommerce.com/dav` |
| Username | email shown in File Access |
| Password | **WebDAV password** from that screen (not store login) |

### Auth (mandatory)

BigCommerce WebDAV requires **HTTP Digest**, not Basic.

- Python: `requests` + `HTTPDigestAuth`
- curl: `--digest --user user:pass`
- Node `fetch` with `Authorization: Basic …` → **401**

### Paths

Root listing includes `/dav/product_images/`, `/dav/content/`, etc.

Blog post `thumbnail_path` values like `/product_images/uploaded_images/foo.png` map to:

`PUT {webdav.url}/product_images/uploaded_images/foo.png`

Copy files from prod CDN if needed:

`https://cdn11.bigcommerce.com/s-{prodHash}/product_images/uploaded_images/{filename}`

Then verify staging CDN **200** before claiming fixed.

### Minimal Python upload pattern

```python
import requests
from requests.auth import HTTPDigestAuth

auth = HTTPDigestAuth(username, password)
url = f"{dav_base.rstrip('/')}/product_images/uploaded_images/{filename}"
r = requests.put(url, data=file_bytes, auth=auth, timeout=120,
                 headers={"Content-Type": "application/octet-stream"})
# expect 201 or 204
```

## Related APIs (quick)

| Need | Approach |
|------|----------|
| Blog posts | v2 `/blog/posts` — `published_date` must be **RFC-2822** (e.g. `Date.toUTCString()`), not ISO-8601. 207 responses often mean **unpublished** drafts |
| Blog thumbs | WebDAV upload first; API only accepts local `thumbnail_path` under `/product_images/` |
| Category images | `PUT /v3/catalog/categories/{id}` with `image_url` (public URL; prod CDN works) |
| Custom templates | `PUT /v3/storefront/custom-template-associations` — needs **Themes** scope |
| List page associations | `GET …/custom-template-associations?type=page&entity_id:in=11,12` — unfiltered list is mostly categories |
| Theme Styles fields | **Page Builder only** — Themes API is GET + validate, no public write for settings |
| Category IDs | Trees/list responses use `category_id`; `/catalog/categories` uses `id` |
| Product upsert | Match **SKU then `custom_url`**. 409 name on cat/brand → reuse. 409 URL on product → update existing URL owner |
| Empty web pages | `/about/`, `/past-events/` bodies empty on prod — associate `about.html` / `events.html`; do not paste CMS HTML |

## See also

- Stencil CLI / `customLayouts`: `docs/agents/stencil-theme.md`
- Staging migration plan + verified methods: `_office/staging-prod-migration/PLAN.md` (Lessons). Product upsert: `orbooks-theme/scripts/sync-products-from-prod.py`.
