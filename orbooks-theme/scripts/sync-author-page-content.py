#!/usr/bin/env python3
"""Assign stage products into author categories + copy author-tagged blog posts from prod."""

from __future__ import annotations

import html
import json
import os
import re
import time
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path

import requests
from requests.auth import HTTPDigestAuth

ROOT = Path(__file__).resolve().parents[1]
secrets = json.loads((ROOT / "secrets.catalog.json").read_text(encoding="utf-8"))
prod, stage = secrets["prod"], secrets["stage"]
dav = secrets["webdav"]
auth_dav = HTTPDigestAuth(dav["username"], dav["password"])
dav_base = dav["url"].rstrip("/")

PROD_ROOT = 61
STAGE_ROOT = 113


def v3(store, method, path, body=None, params=None):
    url = f"https://api.bigcommerce.com/stores/{store['storeHash']}/v3{path}"
    r = requests.request(
        method,
        url,
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Auth-Token": store["accessToken"],
        },
        json=body,
        params=params,
        timeout=120,
    )
    try:
        data = r.json()
    except Exception:
        data = {"raw": r.text[:400]}
    return r.status_code, data


def v2(store, method, path, body=None, params=None):
    url = f"https://api.bigcommerce.com/stores/{store['storeHash']}/v2{path}"
    r = requests.request(
        method,
        url,
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-Auth-Token": store["accessToken"],
        },
        json=body,
        params=params,
        timeout=120,
    )
    if r.status_code == 204:
        return 204, None
    try:
        data = r.json()
    except Exception:
        data = {"raw": r.text[:400]}
    return r.status_code, data


def list_cats(store, parent_id):
    page, out = 1, []
    while True:
        _code, data = v3(
            store,
            "GET",
            "/catalog/categories",
            params={"parent_id": parent_id, "limit": 250, "page": page},
        )
        rows = data.get("data") or []
        out.extend(rows)
        pages = (data.get("meta") or {}).get("pagination", {}).get("total_pages", 1)
        if page >= pages or not rows:
            break
        page += 1
    return out


def decode_tag(t):
    return html.unescape(str(t)).strip()


def to_rfc2822(iso):
    if not iso:
        return None
    try:
        s = iso
        if re.search(r"[+-]\d{4}$", iso):
            s = re.sub(r"([+-]\d{2})(\d{2})$", r"\1:\2", iso)
        dt = datetime.fromisoformat(s.replace("Z", "+00:00"))
        return format_datetime(dt.astimezone(timezone.utc))
    except Exception:
        try:
            dt = datetime.strptime(iso[:19], "%Y-%m-%dT%H:%M:%S").replace(tzinfo=timezone.utc)
            return format_datetime(dt)
        except Exception:
            return None


def ensure_thumb(filename):
    if not filename:
        return True
    check = requests.head(
        f"https://cdn11.bigcommerce.com/s-{stage['storeHash']}/product_images/uploaded_images/{filename}",
        timeout=30,
    )
    if check.status_code == 200:
        return True
    dl = requests.get(
        f"https://cdn11.bigcommerce.com/s-{prod['storeHash']}/product_images/uploaded_images/{filename}",
        timeout=60,
    )
    if dl.status_code != 200:
        return False
    put = requests.put(
        f"{dav_base}/product_images/uploaded_images/{filename}",
        data=dl.content,
        auth=auth_dav,
        timeout=120,
        headers={"Content-Type": "application/octet-stream"},
    )
    return put.status_code in (200, 201, 204)


def main():
    prod_letters = list_cats(prod, PROD_ROOT)
    stage_letters = list_cats(stage, STAGE_ROOT)
    stage_letter_by_path = {c.get("custom_url", {}).get("url"): c for c in stage_letters}

    path_to_stage_author = {}
    author_names = set()
    path_to_prod_author = {}

    for pl in prod_letters:
        pl_path = (pl.get("custom_url") or {}).get("url")
        sl = stage_letter_by_path.get(pl_path)
        if not sl:
            continue
        stage_authors = {
            (c.get("custom_url") or {}).get("url"): c for c in list_cats(stage, sl["id"])
        }
        for pa in list_cats(prod, pl["id"]):
            path = (pa.get("custom_url") or {}).get("url")
            if not path:
                continue
            path_to_prod_author[path] = pa["id"]
            sa = stage_authors.get(path)
            if sa:
                path_to_stage_author[path] = sa["id"]
                author_names.add((sa.get("name") or "").strip())
        print(f"mapped letter {pl.get('name')}", flush=True)

    print(f"author_map={len(path_to_stage_author)} names={len(author_names)}", flush=True)

    # sku -> set of stage author category ids required
    sku_to_author_cats = {}
    for path, prod_cat_id in path_to_prod_author.items():
        stage_cat_id = path_to_stage_author.get(path)
        if not stage_cat_id:
            continue
        page = 1
        while True:
            _code, data = v3(
                prod,
                "GET",
                "/catalog/products",
                params={"categories:in": prod_cat_id, "limit": 250, "page": page},
            )
            rows = data.get("data") or []
            for p in rows:
                sku = p.get("sku") or ""
                if not sku:
                    continue
                sku_to_author_cats.setdefault(sku, set()).add(stage_cat_id)
            pages = (data.get("meta") or {}).get("pagination", {}).get("total_pages", 1)
            if page >= pages or not rows:
                break
            page += 1
        print(f"collected products so far skus={len(sku_to_author_cats)} last={path}", flush=True)

    print(f"skus_needing_author_cats={len(sku_to_author_cats)}", flush=True)

    # Load stage products by sku (only those we need — query each is ok if count ~hundreds)
    assigned = already = missing_product = 0
    errors = []
    for i, (sku, need_cats) in enumerate(sku_to_author_cats.items()):
        _sc, sd = v3(stage, "GET", "/catalog/products", params={"sku": sku, "limit": 1})
        s = (sd.get("data") or [None])[0]
        if not s:
            missing_product += 1
            continue
        cats = list(s.get("categories") or [])
        before = set(cats)
        for cid in need_cats:
            if cid not in cats:
                cats.append(cid)
        if set(cats) == before:
            already += 1
            continue
        uc, ud = v3(stage, "PUT", f"/catalog/products/{s['id']}", body={"categories": cats})
        if 200 <= uc < 300:
            assigned += 1
        elif len(errors) < 8:
            errors.append({"sku": sku, "status": uc, "err": ud})
        if (i + 1) % 50 == 0:
            print(f"assign progress {i + 1}/{len(sku_to_author_cats)} assigned={assigned}", flush=True)
            time.sleep(0.15)

    print(
        json.dumps(
            {
                "products_assigned": assigned,
                "already": already,
                "missing_on_stage": missing_product,
                "assign_errors": errors,
            },
            indent=2,
        ),
        flush=True,
    )

    name_lower = {n.lower() for n in author_names if n}
    existing_titles = set()
    page = 1
    while True:
        _code, posts = v2(stage, "GET", "/blog/posts", params={"limit": 250, "page": page})
        if not isinstance(posts, list) or not posts:
            break
        for p in posts:
            existing_titles.add((p.get("title") or "").strip())
        if len(posts) < 250:
            break
        page += 1

    to_copy = []
    page = 1
    while page <= 40:
        _code, posts = v2(
            prod,
            "GET",
            "/blog/posts",
            params={"limit": 250, "page": page, "is_published": "true"},
        )
        if not isinstance(posts, list) or not posts:
            break
        for p in posts:
            tags = [decode_tag(t) for t in (p.get("tags") or [])]
            if any(t.lower() in name_lower for t in tags):
                title = (p.get("title") or "").strip()
                if title not in existing_titles:
                    to_copy.append(p["id"])
        if len(posts) < 250:
            break
        page += 1

    print(f"blog_to_copy={len(to_copy)}", flush=True)

    blog_ok = blog_fail = 0
    blog_errors = []
    for i, pid in enumerate(to_copy):
        _code, src = v2(prod, "GET", f"/blog/posts/{pid}")
        if not isinstance(src, dict):
            blog_fail += 1
            continue
        thumb = src.get("thumbnail_path") or ""
        if thumb:
            ensure_thumb(os.path.basename(thumb))
        body = {
            "title": src.get("title"),
            "body": src.get("body"),
            "author": src.get("author") or "",
            "is_published": True,
            "meta_description": src.get("meta_description") or "",
            "meta_keywords": src.get("meta_keywords") or "",
            "tags": [decode_tag(t) for t in (src.get("tags") or [])],
        }
        pub = to_rfc2822(src.get("published_date_iso8601") or src.get("published_date") or "")
        if pub:
            body["published_date"] = pub
        if thumb:
            body["thumbnail_path"] = thumb
        body = {k: v for k, v in body.items() if v not in (None, "")}
        c, created = v2(stage, "POST", "/blog/posts", body=body)
        if c in (200, 201):
            blog_ok += 1
        else:
            blog_fail += 1
            if len(blog_errors) < 8:
                blog_errors.append({"id": pid, "status": c, "err": created})
        if (i + 1) % 25 == 0:
            print(f"blog progress {i + 1}/{len(to_copy)} ok={blog_ok}", flush=True)
            time.sleep(0.2)

    _sc, sd = v3(stage, "GET", "/catalog/categories", params={"name": "Theodore Hamm", "limit": 10})
    hamm = next(
        (
            c
            for c in (sd.get("data") or [])
            if "/authors/h/theodore-hamm/" in ((c.get("custom_url") or {}).get("url") or "")
        ),
        None,
    )
    hamm_prods = 0
    if hamm:
        _hc, hp = v3(
            stage, "GET", "/catalog/products", params={"categories:in": hamm["id"], "limit": 10}
        )
        hamm_prods = (hp.get("meta") or {}).get("pagination", {}).get("total", 0)

    print(
        json.dumps(
            {
                "products_assigned": assigned,
                "already": already,
                "missing_on_stage": missing_product,
                "blog_ok": blog_ok,
                "blog_fail": blog_fail,
                "blog_errors": blog_errors,
                "hamm_products": hamm_prods,
            },
            indent=2,
        ),
        flush=True,
    )


if __name__ == "__main__":
    main()
