# Spec: Stage ← prod product upsert (API)

**Status:** approved 2026-08-12 — execute while unattended  
**Plan context:** `_office/staging-prod-migration/PLAN.md` Steps 1–3 (API instead of CSV wipe)

## Goal

Staging product catalog matches production: same SKUs (or URL for empty SKU), fields, images, category membership. No menus / payments / Page Builder.

## Strategy B

1. Map stage categories by `custom_url` path; brands by name.
2. Missing prod category paths → create on stage (parents first); missing brands → create.
3. Match stage products by **SKU first**, then by **`custom_url` path** (stage SKUs often differ from prod for the same book URL). Empty SKU → URL only.
4. Prod SKU/URL on stage → `PUT` update. Missing → `POST` create. On 409 URL duplicate → look up that URL and update instead of skip.
5. Stage-only products (no prod match) → `DELETE`.
6. Sync script: `orbooks-theme/scripts/sync-products-from-prod.py`  
   - `--dry-run` counts only  
   - default = live write

## Field sync (product)

Copy from prod into create/update body (remap ids):

- Core: name, type, sku, description, weight/dims, prices, tax fields, inventory_*, visibility, featured, search_keywords, availability*, condition*, sort_order, page_title, meta_*, upc/mpn/gtin, warranty, bin_picking_number, gift wrapping, preorder_*, price_hidden_*, open_graph_*, custom_url (is_customized)
- `categories` → stage ids via path map
- `brand_id` → stage brand via name map
- `custom_fields` → name/value only (no prod ids)
- Images → prod CDN `url_zoom` / `url_standard` as `image_url` on create; on update replace via product images API if needed
- Simple products only expected (≈1 variant); skip complex option-set rebuild unless create fails

## Out of scope

Menus, theme settings IDs, blog, WebDAV blog thumbs, customers/orders, payments, exact product ID parity.

## Verify

- Stage product count ≈ prod (1714)
- Sample PDP has image + custom fields
- Author cat (e.g. Hamm) has expected books once SKUs exist
