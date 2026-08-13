#!/usr/bin/env python3
"""Upsert staging catalog products from production (SKU / custom_url match).

Strategy B + create missing categories/brands. See:
  _office/staging-prod-migration/PRODUCT-SYNC-SPEC.md

Usage:
  python scripts/sync-products-from-prod.py --dry-run
  python scripts/sync-products-from-prod.py
  python scripts/sync-products-from-prod.py --resume   # skip already-ok SKUs in state file
"""

from __future__ import annotations

import argparse
import json
import sys
import time
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parents[1]
OFFICE = ROOT.parent / "_office" / "staging-prod-migration"
STATE_PATH = OFFICE / "product-sync-state.json"
secrets = json.loads((ROOT / "secrets.catalog.json").read_text(encoding="utf-8"))
PROD, STAGE = secrets["prod"], secrets["stage"]

# Read-only / store-specific — never send on create/update
SKIP_PRODUCT_KEYS = {
    "id",
    "calculated_price",
    "reviews_rating_sum",
    "reviews_count",
    "total_sold",
    "date_created",
    "date_modified",
    "date_last_imported",
    "view_count",
    "base_variant_id",
    "option_set_id",
    "option_set_display",
    "related_products",
    "variants",
    "images",
    "primary_image",
    "custom_fields",
    "modifiers",
    "options",
    "option_values",
    "videos",
    "bulk_pricing_rules",
}


def headers(store):
    return {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Auth-Token": store["accessToken"],
    }


def req(store, method, path, body=None, params=None, retries=6):
    url = f"https://api.bigcommerce.com/stores/{store['storeHash']}/v3{path}"
    for attempt in range(retries):
        r = requests.request(
            method,
            url,
            headers=headers(store),
            json=body,
            params=params,
            timeout=180,
        )
        if r.status_code == 429:
            wait = int(r.headers.get("X-Rate-Limit-Time-Reset-Ms", 5000)) / 1000.0
            wait = max(wait, 2.0) * (1 + attempt * 0.25)
            print(f"  rate-limit sleep {wait:.1f}s", flush=True)
            time.sleep(wait)
            continue
        if r.status_code >= 500:
            time.sleep(2 + attempt)
            continue
        try:
            data = r.json() if r.content else None
        except Exception:
            data = {"raw": (r.text or "")[:800]}
        return r.status_code, data
    return 429, {"error": "rate limit exhausted"}


def paginate(store, path, params=None, key="data"):
    params = dict(params or {})
    limit = int(params.setdefault("limit", 250))
    page = 1
    while True:
        params["page"] = page
        code, data = req(store, "GET", path, params=params)
        if code != 200:
            raise RuntimeError(f"GET {path} page={page} -> {code} {data}")
        items = data.get(key) or []
        if not items:
            break
        for item in items:
            yield item
        pag = (data.get("meta") or {}).get("pagination") or {}
        total_pages = pag.get("total_pages")
        if total_pages is not None:
            if page >= total_pages:
                break
        elif len(items) < limit:
            break
        page += 1


def cat_url(cat):
    return ((cat.get("custom_url") or {}).get("url") or "").strip()


def product_key(p):
    sku = (p.get("sku") or "").strip()
    if sku:
        return ("sku", sku)
    url = ((p.get("custom_url") or {}).get("url") or "").strip()
    return ("url", url or f"id:{p.get('id')}")


def load_categories(store):
    by_url = {}
    by_id = {}
    for c in paginate(store, "/catalog/categories"):
        by_id[c["id"]] = c
        u = cat_url(c)
        if u:
            by_url[u] = c
    return by_url, by_id


def load_brands(store):
    by_name = {}
    by_id = {}
    for b in paginate(store, "/catalog/brands"):
        name = (b.get("name") or "").strip()
        if name:
            by_name[name] = b
        by_id[b["id"]] = b
    return by_name, by_id


def ensure_categories(prod_by_id, stage_by_url, dry_run):
    """Create missing stage categories (parents first). Returns (created, reused)."""
    created = 0
    reused = 0

    # (parent_id, name.lower()) -> stage cat — names unique per parent in BC
    by_parent_name = {}
    for sc in stage_by_url.values():
        key = (sc.get("parent_id") or 0, (sc.get("name") or "").strip().lower())
        by_parent_name[key] = sc

    def depth(cid, seen=None):
        seen = seen or set()
        if cid in seen or cid not in prod_by_id:
            return 0
        seen.add(cid)
        parent = prod_by_id[cid].get("parent_id") or 0
        return 0 if not parent else 1 + depth(parent, seen)

    def register(u, stage_cat):
        stage_by_url[u] = stage_cat
        key = (
            stage_cat.get("parent_id") or 0,
            (stage_cat.get("name") or "").strip().lower(),
        )
        by_parent_name[key] = stage_cat

    def adopt_existing(u, existing, img):
        """Map prod URL → existing stage cat; align custom_url when possible."""
        nonlocal reused
        register(u, existing)
        reused += 1
        if dry_run:
            return
        put = {}
        cur = cat_url(existing)
        if cur != u:
            put["custom_url"] = {"url": u, "is_customized": True}
        if img:
            put["image_url"] = img
        if put:
            code, data = req(STAGE, "PUT", f"/catalog/categories/{existing['id']}", body=put)
            if code in (200, 201) and data and data.get("data"):
                register(u, data["data"])
            elif code not in (200, 201):
                print(f"  warn adopt url {u} id={existing['id']}: {code}", flush=True)

    ordered = sorted(prod_by_id.values(), key=lambda c: depth(c["id"]))
    for cat in ordered:
        u = cat_url(cat)
        if not u:
            continue
        if u in stage_by_url:
            continue
        parent_stage = 0
        pid = cat.get("parent_id") or 0
        if pid:
            parent_prod = prod_by_id.get(pid)
            if not parent_prod:
                print(f"  skip cat missing parent id={pid} url={u}", flush=True)
                continue
            pu = cat_url(parent_prod)
            if pu not in stage_by_url:
                print(f"  skip cat parent not on stage yet url={u} parent={pu}", flush=True)
                continue
            parent_stage = stage_by_url[pu]["id"]
            if parent_stage < 0:
                continue

        name = cat["name"]
        name_key = (parent_stage, (name or "").strip().lower())
        existing = by_parent_name.get(name_key)
        img = cat.get("image_url")
        if existing:
            print(f"  reuse category name={name!r} parent={parent_stage} -> {u}", flush=True)
            adopt_existing(u, existing, img)
            continue

        body = {
            "name": name,
            "parent_id": parent_stage,
            "description": cat.get("description") or "",
            "sort_order": cat.get("sort_order") or 0,
            "is_visible": cat.get("is_visible", True),
            "page_title": cat.get("page_title") or "",
            "meta_keywords": cat.get("meta_keywords") or [],
            "meta_description": cat.get("meta_description") or "",
            "search_keywords": cat.get("search_keywords") or "",
            "custom_url": {"url": u, "is_customized": True},
        }
        if img:
            body["image_url"] = img
        if dry_run:
            print(f"  [dry] create category {u}", flush=True)
            created += 1
            register(u, {"id": -1, "name": name, "parent_id": parent_stage, "custom_url": {"url": u}})
            continue
        code, data = req(STAGE, "POST", "/catalog/categories", body=body)
        if code == 409:
            # race / missed index — refetch siblings under parent
            for sc in paginate(
                STAGE, "/catalog/categories", params={"parent_id": parent_stage, "limit": 250}
            ):
                k = (sc.get("parent_id") or 0, (sc.get("name") or "").strip().lower())
                by_parent_name[k] = sc
                su = cat_url(sc)
                if su:
                    stage_by_url[su] = sc
            existing = by_parent_name.get(name_key)
            if existing:
                print(f"  reuse after 409 name={name!r} -> {u}", flush=True)
                adopt_existing(u, existing, img)
                continue
            print(f"  FAIL create category {u}: {code} {data}", flush=True)
            continue
        if code not in (200, 201):
            print(f"  FAIL create category {u}: {code} {data}", flush=True)
            continue
        new_c = data["data"]
        register(u, new_c)
        created += 1
        if created % 25 == 0:
            print(f"  categories created={created}", flush=True)
        if img and not new_c.get("image_url"):
            req(STAGE, "PUT", f"/catalog/categories/{new_c['id']}", body={"image_url": img})
    return created, reused


def ensure_brands(prod_brands, stage_brands, dry_run):
    created = 0
    reused = 0
    # case-insensitive index — BC duplicate check is case-insensitive
    by_lower = {(n or "").strip().lower(): b for n, b in stage_brands.items()}

    def refresh_stage_brands():
        nonlocal by_lower
        stage_brands.clear()
        by_lower.clear()
        for b in paginate(STAGE, "/catalog/brands"):
            name = (b.get("name") or "").strip()
            if name:
                stage_brands[name] = b
                by_lower[name.lower()] = b

    for name, b in prod_brands.items():
        if name in stage_brands:
            continue
        existing = by_lower.get((name or "").strip().lower())
        if existing:
            stage_brands[name] = existing
            reused += 1
            continue
        body = {
            "name": name,
            "page_title": b.get("page_title") or name,
            "meta_keywords": b.get("meta_keywords") or [],
            "meta_description": b.get("meta_description") or "",
            "search_keywords": b.get("search_keywords") or "",
        }
        if b.get("image_url"):
            body["image_url"] = b["image_url"]
        if dry_run:
            created += 1
            stage_brands[name] = {"id": -1, "name": name}
            by_lower[name.lower()] = stage_brands[name]
            continue
        code, data = req(STAGE, "POST", "/catalog/brands", body=body)
        if code == 409:
            refresh_stage_brands()
            existing = by_lower.get((name or "").strip().lower()) or stage_brands.get(name)
            if existing:
                stage_brands[name] = existing
                reused += 1
                continue
            print(f"  FAIL create brand {name!r}: {code} {data}", flush=True)
            continue
        if code not in (200, 201):
            print(f"  FAIL create brand {name!r}: {code} {data}", flush=True)
            continue
        stage_brands[name] = data["data"]
        by_lower[name.lower()] = data["data"]
        created += 1
        if created % 50 == 0:
            print(f"  brands created={created}", flush=True)
    return created, reused


def map_categories(prod_ids, prod_by_id, stage_by_url):
    out = []
    for cid in prod_ids or []:
        pc = prod_by_id.get(cid)
        if not pc:
            continue
        u = cat_url(pc)
        sc = stage_by_url.get(u)
        if sc and sc.get("id", -1) > 0:
            out.append(sc["id"])
    return out


def build_product_body(prod, stage_cat_ids, stage_brand_id):
    body = {}
    for k, v in prod.items():
        if k in SKIP_PRODUCT_KEYS:
            continue
        body[k] = v
    body["categories"] = stage_cat_ids
    if stage_brand_id:
        body["brand_id"] = stage_brand_id
    elif "brand_id" in body:
        del body["brand_id"]
    # custom_url
    cu = prod.get("custom_url") or {}
    if cu.get("url"):
        body["custom_url"] = {"url": cu["url"], "is_customized": True}
    # custom fields (create/update without ids)
    cfs = []
    for cf in prod.get("custom_fields") or []:
        name = (cf.get("name") or "").strip()
        if not name:
            continue
        cfs.append({"name": name, "value": cf.get("value") or ""})
    if cfs:
        body["custom_fields"] = cfs
    # images on create
    images = []
    for i, img in enumerate(prod.get("images") or []):
        url = img.get("url_zoom") or img.get("url_standard") or img.get("url_thumbnail")
        if not url:
            continue
        images.append(
            {
                "image_url": url,
                "is_thumbnail": bool(img.get("is_thumbnail")) or i == 0,
                "sort_order": img.get("sort_order") if img.get("sort_order") is not None else i,
                "description": img.get("description") or "",
            }
        )
    if images:
        body["images"] = images
    # weight required for physical
    if body.get("type") == "physical" and body.get("weight") is None:
        body["weight"] = 0
    if body.get("price") is None:
        body["price"] = 0
    return body


def clear_custom_fields(product_id):
    code, data = req(
        STAGE,
        "GET",
        f"/catalog/products/{product_id}/custom-fields",
        params={"limit": 250},
    )
    if code != 200:
        return
    for cf in data.get("data") or []:
        req(STAGE, "DELETE", f"/catalog/products/{product_id}/custom-fields/{cf['id']}")


def sync_images(product_id, prod_images):
    code, data = req(
        STAGE, "GET", f"/catalog/products/{product_id}/images", params={"limit": 50}
    )
    if code == 200:
        for img in data.get("data") or []:
            req(STAGE, "DELETE", f"/catalog/products/{product_id}/images/{img['id']}")
    for i, img in enumerate(prod_images or []):
        url = img.get("url_zoom") or img.get("url_standard") or img.get("url_thumbnail")
        if not url:
            continue
        req(
            STAGE,
            "POST",
            f"/catalog/products/{product_id}/images",
            body={
                "image_url": url,
                "is_thumbnail": bool(img.get("is_thumbnail")) or i == 0,
                "sort_order": img.get("sort_order") if img.get("sort_order") is not None else i,
                "description": img.get("description") or "",
            },
        )


def load_state():
    if STATE_PATH.exists():
        return json.loads(STATE_PATH.read_text(encoding="utf-8"))
    return {"done_keys": [], "stats": {}}


def save_state(state):
    OFFICE.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, indent=2), encoding="utf-8")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--resume", action="store_true", help="Skip keys in state done_keys")
    ap.add_argument("--limit", type=int, default=0, help="Max prod products to process")
    ap.add_argument("--skip-delete", action="store_true", help="Do not delete stage-only products")
    args = ap.parse_args()
    dry = args.dry_run

    print("=== load categories / brands ===", flush=True)
    prod_by_url, prod_by_id = load_categories(PROD)
    stage_by_url, _stage_by_id = load_categories(STAGE)
    print(f"cats prod={len(prod_by_id)} stage={len(stage_by_url)}", flush=True)

    prod_brands, prod_brands_by_id = load_brands(PROD)
    stage_brands, _ = load_brands(STAGE)
    print(f"brands prod={len(prod_brands)} stage={len(stage_brands)}", flush=True)

    print("=== ensure categories ===", flush=True)
    n_cat, n_cat_reuse = ensure_categories(prod_by_id, stage_by_url, dry)
    print(
        f"categories created={n_cat} reused={n_cat_reuse} stage_map={len(stage_by_url)}",
        flush=True,
    )

    print("=== ensure brands ===", flush=True)
    n_brand, n_brand_reuse = ensure_brands(prod_brands, stage_brands, dry)
    print(f"brands created={n_brand} reused={n_brand_reuse}", flush=True)

    print("=== index stage products ===", flush=True)
    stage_by_sku = {}
    stage_by_purl = {}
    stage_all = []
    for p in paginate(
        STAGE, "/catalog/products", params={"include_fields": "id,sku,name,custom_url"}
    ):
        stage_all.append(p)
        sku = (p.get("sku") or "").strip()
        if sku:
            stage_by_sku[sku] = p
        u = ((p.get("custom_url") or {}).get("url") or "").strip()
        if u:
            stage_by_purl[u] = p
    print(
        f"stage products={len(stage_all)} sku_idx={len(stage_by_sku)} url_idx={len(stage_by_purl)}",
        flush=True,
    )

    state = load_state() if args.resume else {"done_keys": [], "stats": {}}
    done_norm = set()
    for item in state.get("done_keys", []):
        if isinstance(item, (list, tuple)) and len(item) == 2:
            done_norm.add((item[0], item[1]))
    done = done_norm

    stats = {
        "create": 0,
        "update": 0,
        "delete": 0,
        "fail": 0,
        "skip_done": 0,
        "cat_create": n_cat,
        "cat_reuse": n_cat_reuse,
        "brand_create": n_brand,
        "brand_reuse": n_brand_reuse,
    }
    seen_stage_ids = set()
    seen_prod_keys = set()

    def find_existing(prod):
        sku = (prod.get("sku") or "").strip()
        u = ((prod.get("custom_url") or {}).get("url") or "").strip()
        if sku and sku in stage_by_sku:
            return stage_by_sku[sku], "sku"
        if u and u in stage_by_purl:
            return stage_by_purl[u], "url"
        return None, None

    def apply_update(pid, prod, body):
        put_body = {k: v for k, v in body.items() if k not in ("images", "custom_fields")}
        code, data = req(STAGE, "PUT", f"/catalog/products/{pid}", body=put_body)
        if code == 409 and "sku" in str(data):
            put_body.pop("sku", None)
            code, data = req(STAGE, "PUT", f"/catalog/products/{pid}", body=put_body)
        if code == 409 and "custom_url" in str(data):
            put_body.pop("custom_url", None)
            code, data = req(STAGE, "PUT", f"/catalog/products/{pid}", body=put_body)
        if code not in (200, 201):
            return code, data
        clear_custom_fields(pid)
        for cf in body.get("custom_fields") or []:
            req(STAGE, "POST", f"/catalog/products/{pid}/custom-fields", body=cf)
        sync_images(pid, prod.get("images") or [])
        return code, data

    def register_stage(p):
        stage_all.append(p)
        sku = (p.get("sku") or "").strip()
        if sku:
            stage_by_sku[sku] = p
        u = ((p.get("custom_url") or {}).get("url") or "").strip()
        if u:
            stage_by_purl[u] = p

    print("=== upsert products ===", flush=True)
    n = 0
    for prod in paginate(
        PROD,
        "/catalog/products",
        params={"include": "images,custom_fields", "limit": 50},
    ):
        n += 1
        if args.limit and n > args.limit:
            break
        key = product_key(prod)
        seen_prod_keys.add(key)
        key_s = f"{key[0]}:{key[1]}"
        if args.resume and key in done:
            stats["skip_done"] += 1
            existing, _how = find_existing(prod)
            if existing:
                seen_stage_ids.add(existing["id"])
            continue

        stage_cat_ids = map_categories(prod.get("categories") or [], prod_by_id, stage_by_url)
        bid = prod.get("brand_id")
        pb = prod_brands_by_id.get(bid) if bid else None
        brand_name = (pb.get("name") or "").strip() if pb else None
        brand_id = None
        if brand_name and brand_name in stage_brands:
            brand_id = stage_brands[brand_name].get("id")
            if brand_id is not None and brand_id < 0:
                brand_id = None

        body = build_product_body(prod, stage_cat_ids, brand_id)
        existing, how = find_existing(prod)

        if dry:
            if existing:
                stats["update"] += 1
                seen_stage_ids.add(existing["id"])
            else:
                stats["create"] += 1
            if n % 100 == 0:
                print(f"  [dry] processed={n} {stats}", flush=True)
            continue

        try:
            if existing:
                pid = existing["id"]
                code, data = apply_update(pid, prod, body)
                if code not in (200, 201):
                    print(f"  FAIL update {key_s} via={how}: {code} {data}", flush=True)
                    stats["fail"] += 1
                    continue
                seen_stage_ids.add(pid)
                # keep indexes in sync if sku/url changed
                register_stage({"id": pid, "sku": body.get("sku"), "custom_url": body.get("custom_url")})
                stats["update"] += 1
            else:
                code, data = req(STAGE, "POST", "/catalog/products", body=body)
                if code not in (200, 201) and "images" in body:
                    body2 = dict(body)
                    del body2["images"]
                    code, data = req(STAGE, "POST", "/catalog/products", body=body2)
                    if code in (200, 201) and data.get("data"):
                        sync_images(data["data"]["id"], prod.get("images") or [])
                # URL already owned by a stage product we didn't index by this SKU
                if code == 409 and "URL" in str(data):
                    u = ((prod.get("custom_url") or {}).get("url") or "").strip()
                    existing = stage_by_purl.get(u)
                    if not existing and u:
                        # refresh url index once
                        for p in paginate(
                            STAGE,
                            "/catalog/products",
                            params={"include_fields": "id,sku,name,custom_url"},
                        ):
                            pu = ((p.get("custom_url") or {}).get("url") or "").strip()
                            if pu:
                                stage_by_purl[pu] = p
                        existing = stage_by_purl.get(u)
                    if existing:
                        code, data = apply_update(existing["id"], prod, body)
                        if code in (200, 201):
                            seen_stage_ids.add(existing["id"])
                            stats["update"] += 1
                            done.add(key)
                            state["done_keys"] = [list(k) for k in done]
                            state["stats"] = stats
                            if (stats["create"] + stats["update"]) % 25 == 0:
                                save_state(state)
                                print(
                                    f"  progress n={n} create={stats['create']} update={stats['update']} fail={stats['fail']} last={key_s}",
                                    flush=True,
                                )
                            continue
                if code not in (200, 201):
                    print(f"  FAIL create {key_s}: {code} {data}", flush=True)
                    stats["fail"] += 1
                    continue
                stats["create"] += 1
                if data and data.get("data"):
                    register_stage(data["data"])
                    seen_stage_ids.add(data["data"]["id"])

            done.add(key)
            state["done_keys"] = [list(k) for k in done]
            state["stats"] = stats
            if (stats["create"] + stats["update"]) % 25 == 0:
                save_state(state)
                print(
                    f"  progress n={n} create={stats['create']} update={stats['update']} fail={stats['fail']} last={key_s}",
                    flush=True,
                )
        except Exception as e:
            print(f"  EXC {key_s}: {e}", flush=True)
            stats["fail"] += 1
            save_state(state)

    save_state(state)

    # deletes — only stage products never matched by sku or url to a prod product
    orphans = [p for p in stage_all if p["id"] not in seen_stage_ids]
    # de-dupe by id (register_stage may append twice)
    seen_orphan = set()
    orphan_unique = []
    for p in orphans:
        if p["id"] in seen_orphan:
            continue
        seen_orphan.add(p["id"])
        orphan_unique.append(p)
    orphans = orphan_unique

    if args.limit:
        print(f"=== skip orphan delete (limit mode); would be {len(orphans)} ===", flush=True)
    elif args.skip_delete:
        print(f"=== skip orphan delete; {len(orphans)} stage-only ===", flush=True)
    else:
        print(f"=== delete stage-only products count={len(orphans)} ===", flush=True)
        for p in orphans:
            if dry:
                stats["delete"] += 1
                continue
            code, data = req(STAGE, "DELETE", f"/catalog/products/{p['id']}")
            if code in (200, 204):
                stats["delete"] += 1
            else:
                print(f"  FAIL delete id={p['id']}: {code} {data}", flush=True)
                stats["fail"] += 1
            if stats["delete"] % 50 == 0:
                print(f"  deleted={stats['delete']}", flush=True)

    # verify counts
    if not dry:
        code, data = req(STAGE, "GET", "/catalog/products", params={"limit": 1})
        stage_total = ((data or {}).get("meta") or {}).get("pagination", {}).get("total")
        code, data = req(PROD, "GET", "/catalog/products", params={"limit": 1})
        prod_total = ((data or {}).get("meta") or {}).get("pagination", {}).get("total")
        stats["stage_total"] = stage_total
        stats["prod_total"] = prod_total

    state["stats"] = stats
    save_state(state)
    print(json.dumps({"dry_run": dry, **stats}, indent=2), flush=True)
    if stats["fail"]:
        sys.exit(1)


if __name__ == "__main__":
    main()
