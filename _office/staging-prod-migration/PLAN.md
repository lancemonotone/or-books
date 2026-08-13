# Staging store ← production data migration (DIY)

**Goal:** Bring the existing OR Books **staging** store (`https://orbooks.mybigcommerce.com`) close enough to **production** (`https://www.orbooks.com`) that the client can review theme work on a public URL — without pushing themes to production.

**Method:** Manual BigCommerce store-to-store transfer (no StagingPro, no new sandbox clone).

**Stores**

| Role | Storefront URL | Notes |
|------|----------------|--------|
| Source | `https://www.orbooks.com` | Live production — **read/export only** |
| Destination | `https://orbooks.mybigcommerce.com` | Old sandbox (pre-2024 leftover) — wipe + import |

**Local Stencil**

| File | Role |
|------|------|
| `orbooks-theme/secrets.stencil.prod.json` | Prod CLI token backup |
| `orbooks-theme/secrets.stencil.stage.json` | Staging CLI token backup |
| `orbooks-theme/secrets.stencil.json` | Active token (copy from prod or stage) |
| `orbooks-theme/config.stencil.json` | `normalStoreUrl` / `normalStoreUrlProd` / `normalStoreUrlStage` |

**Hard rules**

- Do **not** `stencil push` to production during this project.
- Keep production **live** (not “Down for Maintenance”) while staging imports product images from prod CDN.
- Expect **new entity IDs** on staging — theme settings that hardcode category/product IDs must be re-set after import.
- Exact bit-for-bit twin is **impossible** (BC does not transfer store settings, payments, tax, apps, users, Page Builder layouts as a unit). Aim: catalog + pages + theme + associations good enough for QA.

---

## Doc sources (primary)

1. [Data Transfer in BigCommerce](https://support.bigcommerce.com/s/article/Data-Transfer-in-BigCommerce) — what transfers / how
2. [Transferring Products](https://support.bigcommerce.com/s/article/Transferring-Products) — CSV export/import
3. [Transferring Storefront Content](https://support.bigcommerce.com/s/article/Transferring-Storefront-Content) — theme, WebDAV images, pages, blog
4. [Transferring Other Data](https://support.bigcommerce.com/s/article/Transferring-Other-Data) — redirects (optional)
5. Repo: `docs/agents/stencil-theme.md` — Stencil push, `customLayouts` harvest

---

## Progress

| Step | Name | Status |
|------|------|--------|
| 0 | Prep & decisions | done |
| 1 | Wipe / clear staging catalog | skipped — Strategy B upsert instead of wipe |
| 2 | Export products from production | superseded — CSV exported; live path is Catalog API |
| 3 | Import products into staging | done — 1711/1715; 4 leftover have empty cats on prod |
| 4 | WebDAV Image Manager assets | partial — blog thumbs for author posts |
| 5 | Web pages (critical set) | partial — `/about/` + `/past-events/` exist + templates |
| 6 | Blog posts (if home Latest News needs them) | partial — author-tagged posts copied; many unpublished |
| 7 | Push current theme to staging | done |
| 8 | Theme settings + homepage IDs | done — New=`111`, Sale=`112` (Page Builder) |
| 9 | Custom template associations | partial — authors + about/past-events |
| 10 | Menus, carousel, odds & ends | partial — header/footer destinations audited; `/faq/` created |

| 11 | Verification checklist | pending |
| 12 | Point local Stencil at staging (ongoing) | ongoing |

**How we work:** One step at a time. Mark status `in progress` → `done` (or `blocked`) in this table. Do not skip ahead without confirming the previous step.

**Scripts (keep):** `orbooks-theme/scripts/sync-products-from-prod.py`, `orbooks-theme/scripts/sync-author-page-content.py`. Spec: `PRODUCT-SYNC-SPEC.md`. Do not commit `product-sync-log.txt` / `product-sync-state.json`.

---

## Lessons (do this — verified)

Do **not** rediscover. Full API/WebDAV notes: `docs/agents/bigcommerce-catalog-api.md`.

### Products (Steps 1–3)

- **Do not wipe** if stage already has books. **Strategy B:** upsert by **SKU**, then by **`custom_url` path**. SKU-only → 409 “URL is a duplicate” and skipped books.
- Create missing category paths (parents first) and brands by name. **409 duplicate name** → reuse existing sibling/brand (same name, different URL is normal).
- Images: prod CDN `url_zoom` / `url_standard` as `image_url`. Prod stays live so staging can fetch.
- Script: `python scripts/sync-products-from-prod.py` (`--dry-run`, `--resume`, `--retry-fails`).
- 409 SKU duplicate: omit sku/upc/gtin/mpn and retry; never orphan-delete a product that failed mid-update (that dropped Mamdani).
- `--retry-fails` re-creates SKUs from the FAIL log. Skip-delete implied.

### Pages vs theme (Step 5)

- BC article “copy HTML source” applies when the **page body** has markup.
- `/about/` and `/past-events/` have **empty bodies** on prod. Copy lives in theme: `about.html` + `about-main-content.html`; `events.html` + `event.html`.
- Staging needs: Pages API (URL + meta + visibility) **and** `PUT /v3/storefront/custom-template-associations` (`entity_type: page`). Images already on prod CDN — no WebDAV copy for these pages.

### Custom template associations (Step 9)

- Filter: `type=page` + `entity_id:in=…`. Unfiltered GET is mostly categories (250/page) — do not paginate looking for About.
- Local Stencil maps URLs in `config.stencil.json` `customLayouts`. Staging storefront needs the **active theme** to contain those templates.

### Blog (Step 6)

- v2 `/blog/posts` — `published_date` **RFC-2822**, not ISO-8601.
- Thumbs: WebDAV Digest upload first; API only accepts `/product_images/uploaded_images/…`.
- 207 / unpublished drafts: created but not live until `is_published` is true.

### Theme settings (Step 8)

- Homepage category/product IDs: **Page Builder only**. Themes API is GET + validate — no public write.

### Header / footer (Step 10)

- Links are **hardcoded in the theme** (`navigation-menu.html`, `footer-navigation.html`). Not a BC channel-menu copy.
- Audit = hit those URLs on staging. Fix missing **pages/categories**, not rewrite nav HTML.

---

## Step 0 — Prep & decisions

**Stop here until answered.**

### Confirm

- [x] You have **admin** on both prod and staging
- [x] Staging may be **wiped** (old catalog discarded)
- [x] Client knows staging will be broken / incomplete mid-migration
- [x] Prod export/import window is OK (import can take a while; prod stays live)

### Optional shortcuts (decide now)

- [x] Skip customers / orders (recommended for theme QA)
- [x] Skip payment gateway setup on staging (recommended)
- [x] Skip apps unless a reviewed page depends on one

### Capture before wipe (staging)

In staging admin, note anything you might need later (unlikely):

- [ ] Channel / storefront URL confirmed: `https://orbooks.mybigcommerce.com`
- [ ] Existing Stencil CLI token still valid (or recreate)

### Local

- [ ] `secrets.stencil.stage.json` has staging token
- [ ] `secrets.stencil.prod.json` has prod token
- [ ] Active `secrets.stencil.json` + `normalStoreUrl` point at **prod** for Steps 2–3 exports (admin browser), and will switch to **staging** for Step 7+

**Exit:** Decisions locked. Ready for Step 1.

---

## Step 1 — Wipe / clear staging catalog

**Status:** skipped. Strategy B upsert (`PRODUCT-SYNC-SPEC.md`) — keep matching SKUs, delete stage-only junk.

**Why (original):** Merging 2024 leftovers with live catalog → duplicate SKUs, wrong trees, `/authors/` still missing or wrong.

### Do (staging admin)

1. **Products →** delete products in bulk (or delete all if feasible)
2. **Products → Categories →** delete old category tree (or empty as much as possible)
3. Spot-check: product list empty / near-empty; categories emptied

### Verify

- [ ] Staging storefront catalog no longer shows old books as the “source of truth”
- [ ] No critical dependency on leftover staging-only SKUs

**Exit:** Staging catalog is a clean destination for import.

**Blocked if:** Staging still has products you must keep — stop and decide merge vs wipe.

---

## Step 2 — Export products from production

**Doc:** [Transferring Products](https://support.bigcommerce.com/s/article/Transferring-Products)

### Do (production admin)

1. **Settings → Export templates**
2. Copy **Bulk Edit** template → enable **Products** export
3. If variants: enable **Include Product Options**
4. Advanced CSV: expand sub-items across CSV (per BC article)
5. On Products tab, follow BC field rules:
   - Uncheck Product ID / Product Image ID / Product Image File / Product Image Path (as directed)
   - Check **Product Image URL**, rename column to **Product Image File** (case-sensitive, no spaces)
6. **Products → Export** → choose that template → download CSV
7. Save file somewhere durable (not only Downloads)

### Verify

- [ ] CSV opens; has products + categories columns
- [ ] Image URL-style values present for covers
- [ ] File size / row count looks sane vs live catalog

**Exit:** Export CSV ready for staging import.

**Notes:** Categories/brands travel with the product CSV (with known CSV limits on images/descriptions — API later if gaps).

---

## Step 3 — Import products into staging

**Live path:** Catalog API upsert — `orbooks-theme/scripts/sync-products-from-prod.py` (see Lessons + `PRODUCT-SYNC-SPEC.md`). CSV below is the BC-documented fallback only.

**Doc:** [Transferring Products](https://support.bigcommerce.com/s/article/Transferring-Products)

### Do (staging admin)

1. Confirm **production is live** (not maintenance) — staging downloads images from prod CDN during import
2. **Products → Import**
3. Check **File was exported using the ‘Bulk Edit’ template**
4. Upload CSV → map fields → **Ignore** Product ID if present
5. Start import; wait for completion
6. **View Imported Products** — spot-check titles, images, category tree

### Verify

- [ ] `/authors/` exists on staging (or category with that path)
- [ ] Sample product PDP shows image
- [ ] Category tree roughly matches prod (letter buckets / authors if present)

**Exit:** Catalog usable on staging storefront.

**Blocked if:** Images 404 / import errors — check prod maintenance off, CSV image column naming, BC import log.

---

## Step 4 — WebDAV Image Manager assets

**Doc:** [Transferring Storefront Content](https://support.bigcommerce.com/s/article/Transferring-Storefront-Content) → Image Manager / WebDAV

**Agent ops (do not rediscover):** `docs/agents/bigcommerce-catalog-api.md` — Digest auth, `secrets.catalog.json` → `webdav`, path `/product_images/uploaded_images/`.

### Do

1. Connect WebDAV to **production** (GUI) **or** pull files from prod CDN `…/product_images/uploaded_images/{file}`
2. Download / collect needed `product_images/uploaded_images` (Image Manager pool; blog thumbs live here)
3. Connect WebDAV to **staging** with **HTTP Digest** (`secrets.catalog.json` → `webdav`)
4. Upload into staging’s same folder path (`PUT …/dav/product_images/uploaded_images/{file}`)
5. Confirm staging CDN **200** and/or **Storefront → Image Manager**

### Verify

- [ ] Reading-list panels / author banners referenced by theme or pages can resolve on staging
- [ ] Blog Latest News thumbs resolve (not broken Image Manager paths)
- [ ] No mass broken Image Manager URLs on key pages (spot-check)

**Exit:** Shared marketing/image-manager assets present on staging.

---

## Step 5 — Web pages (critical set)

**Doc:** [Transferring Storefront Content](https://support.bigcommerce.com/s/article/Transferring-Storefront-Content) → Web Pages

**Minimum page set (adjust as needed):**

- About
- Events (and past-events if separate)
- Videos
- Contact / FAQ / Terms if client will click footer links during review
- Any other page mapped in `config.stencil.json` → `customLayouts.page`

### Do (per page)

**If the live page body is empty** (About, Past Events): skip HTML paste. Create/update the page URL via Content API, then associate `about.html` / `events.html`. Markup is already in the theme. See **Lessons**.

**If the live page has HTML in the editor:**

1. Prod: **Storefront → Web Pages** → open page → **Edit HTML Source** → copy
2. Staging: create/edit matching page → paste HTML → match name, URL path, meta if possible
3. Repeat

**Alternate:** Content API (`GET/PUT/POST /v3/content/pages`).

### Verify

- [ ] Staging URLs for critical pages return 200 (not 404)
- [ ] Markup roughly matches prod for those pages

**Exit:** Critical CMS pages exist on staging.

---

## Step 6 — Blog posts (Latest News)

**When:** Home “Latest News” empty without blog content.

**Doc:** Same storefront content article → Blog Posts

### Do

1. Export/copy recent posts from prod (HTML + title + date) into staging blog
2. Or API transfer if preferred

### Verify

- [ ] Staging home Latest News shows posts (after theme + settings)
- [ ] `/news/` (or staging blog URL) lists posts

**Exit:** Blog sufficient for home sidebar QA.

**Skip if:** Client OK reviewing home without news during theme work.

---

## Step 7 — Push current theme to staging

**Doc:** Repo `docs/agents/stencil-theme.md` + BC theme transfer via Stencil CLI

### Do

1. Copy `secrets.stencil.stage.json` → `secrets.stencil.json`
2. Set `config.stencil.json` → `normalStoreUrl` = `https://orbooks.mybigcommerce.com`
3. Confirm **not** pointing at prod
4. From `orbooks-theme/`:

```bash
stencil push -a
```

5. Activate variation when prompted
6. Open staging storefront — theme chrome matches local/main

### Verify

- [ ] Footer / store name still staging-flavored (OK)
- [ ] Header / type / layout look like current theme
- [ ] Did **not** upload to production Themes list

**Exit:** Staging runs current theme package.

---

## Step 8 — Theme settings + homepage IDs

**Why:** Staging category/product IDs ≠ prod. Home rails use theme settings (`new_category_id`, `sale_category_id`, `sidebar_product_id`, etc.).

### Do (staging admin)

1. **Storefront → Themes** → customize / theme settings (or Page Builder as used on prod)
2. Set homepage category IDs from **staging** category list (Forthcoming / Bestsellers / sale — match OR Books intent)
3. Set featured/sidebar product ID from a real staging product
4. Enable carousel if used; upload carousel slides if missing ([content transfer: carousel = manual](https://support.bigcommerce.com/s/article/Transferring-Storefront-Content))
5. Optional: `stencil pull` while pointed at staging to sync `config.json` locally — only if you need staging’s saved settings in repo (usually leave prod settings as source of truth for git)

### Verify

- [ ] Home Forthcoming / Bestsellers populate (or clearly configured)
- [ ] Featured sidebar product shows a cover (not “IMAGE NOT AVAILABLE” if product has image)
- [ ] Carousel slides visible if expected

**Exit:** Home data rails wired to staging IDs.

---

## Step 9 — Custom template associations

**Why:** Stencil custom templates (`authors.html`, `single-author.html`, …) are assigned in admin; not imported by `stencil pull`.

### Do (staging admin)

1. **Storefront → Custom Templates** (or Custom Template Associations) — assign same mappings as prod for categories/pages/products in scope
2. Local: after staging URLs exist, optionally:

```bash
cd orbooks-theme
# harvest against staging storefront if script base URL supports it — otherwise map manually
node scripts/harvest-custom-layouts.js --apply
```

   Only run harvest against staging if the script targets staging; do not overwrite local map with wrong host without checking.

3. Restart `stencil start` if testing locally against staging

### Verify

- [ ] Staging `/authors/` uses authors layout (not default category / not 404)
- [ ] Sample author page uses `single-author` if assigned on prod
- [ ] Booksellers / reading-lists / etc. as needed

**Exit:** Key custom layouts match prod associations.

---

## Step 10 — Menus, carousel, odds & ends

### Do as needed

- [ ] Navigation menus (recreate or adjust links for staging paths)
- [ ] Homepage carousel images (manual upload)
- [ ] Logo / favicon if wrong
- [ ] Social links / footer links
- [ ] 301 redirects CSV only if needed ([Transferring Other Data](https://support.bigcommerce.com/s/article/Transferring-Other-Data)) — trial stores may block; staging is paid sandbox so likely OK
- [ ] **Do not** copy live payment credentials onto staging unless intentional

### Non-transferable (recreate only if review needs them)

Per BC Data Transfer table: store settings, payment gateways, tax, custom signup fields, user accounts, apps.

**Exit:** Client can click around without obvious 404s on main nav.

---

## Step 11 — Verification checklist

Compare **staging** vs **production** (same paths):

| Check | Staging OK? |
|-------|-------------|
| Home loads; theme looks current | |
| Hero carousel | |
| Forthcoming / Bestsellers | |
| Sidebar featured + Latest News + Reading Lists | |
| `/authors/` | |
| One letter bucket + one author page | |
| One book PDP | |
| About / Events / Videos (if migrated) | |
| Footer nav | |

**Client handoff:** Send staging URL + “content is a copy for review; not live checkout.”

**Exit:** Staging fit for theme review.

---

## Step 12 — Day-to-day Stencil workflow (after migration)

| Task | Creds |
|------|--------|
| Local preview of staging | Stage token + `normalStoreUrl` staging |
| Push theme for client | Stage only (`stencil push -a`) |
| Local preview of prod catalog | Prod token + prod URL — **no push** |

Never leave staging token active if about to push thinking you’re on prod.

---

## Out of scope (this plan)

- Pushing or activating themes on production
- StagingPro / BC partner paid migration
- Perfect ID parity with production
- Full order/customer history sync
- Live payment testing on staging

---

## Session log

Append short notes as steps complete (date, who, blockers).

| Date | Step | Note |
|------|------|------|
| 2026-08-12 | 0 | Admin both stores; wipe OK; client OK mid-break; skip customers/orders/payments/apps |
| 2026-08-12 | 7 (early) | Theme already pushed to staging |
| 2026-08-12 | 2 | Prod product CSV exported; import-over vs wipe discussed; Image Manager = WebDAV (admin File Access), not separate SFTP |
| 2026-08-12 | 1–3 | Strategy B approved (upsert, no wipe). Script `sync-products-from-prod.py`. SKU-only match failed 409 URL dupes → match SKU then URL |
| 2026-08-12 | 6+9 | Authors tree + `sync-author-page-content.py` (products into author cats + tagged blog). Many blog copies unpublished |
| 2026-08-13 | 5+9 | `/about/` (id 11, visible) + `/past-events/` (id 12, hidden like prod) + template associations `about.html` / `events.html` |
| 2026-08-13 | 10 | Header/footer are theme-hardcoded. Audit: only `/faq/` 404’d → copied from prod (id 13). `/videos/` associated `videos.html`. |
| 2026-08-13 | 5 | About sidebar: copied `/job-openings-internships/` (14), `/privacy-policy-guidelines/` (15), `/internships/` (16). All 200. |
| 2026-08-13 | 3 | Retry 207 FAIL SKUs: 203 created. Mamdani at `/catalog/meet-mayor-mamdani/`. Stage 1711 vs prod 1715 (4 empty-cat SKUs skipped). |

---

## Next action

Product catalog close enough. Header/footer destinations work. Menus themselves need no BC menu rebuild.
