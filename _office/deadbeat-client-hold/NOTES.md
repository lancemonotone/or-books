# Operation Deadbeat Client — theme hold

**Created:** 2026-09-01  
**Why:** Client unpaid. Remove Wave 1 theme from staging storefront; keep full restore path locally.

## Snapshots (do not delete)

| Kind | Location |
|------|----------|
| **Git tag** | `held-theme-unpaid-2026-09-01` → `eea83b5` (on `origin` too) |
| **Theme zip** | Repo root: `orbooks-held-2026-09-01.zip` (~14 MB, local only) |
| **Branches** | `main` ≡ `staging` ≡ `origin/main` @ `2274139` (theme tip still `eea83b5`) |

```bash
git show held-theme-unpaid-2026-09-01 --no-patch
git checkout held-theme-unpaid-2026-09-01   # detached HEAD — branch from here or checkout main after merge
```

## Staging storefront — pull theme (BC admin)

1. **Storefront → Themes** → **Apply** **Orbooks_Stable28050225 (1)** (pre–Wave 1 stable).
2. **Delete** private uploads **OR Books_260724 (1)** through **(14)** (only after stable is active).
3. Verify `https://orbooks.mybigcommerce.com` — old stable look, not Wave 1.

Catalog / pages / associations unchanged — theme only.

## Reinstate when paid

```bash
git checkout main    # or: git checkout -b reinstate-theme held-theme-unpaid-2026-09-01
cd orbooks-theme
cp secrets.stencil.stage.json secrets.stencil.json
# config.stencil.json → normalStoreUrl = https://orbooks.mybigcommerce.com
node scripts/apply-homepage-ids.js staging
stencil push -a
node scripts/apply-homepage-ids.js prod
```

Or upload `orbooks-held-2026-09-01.zip` via **Storefront → Themes → Upload** if CLI unavailable.

## Status

| Step | Done |
|------|------|
| Tag `held-theme-unpaid-2026-09-01` | yes (local + `origin`) |
| Bundle `orbooks-held-2026-09-01.zip` | yes (local disk) |
| `main` / `staging` / `origin/main` synced | yes (`2274139`) |
| Apply stable theme on staging | pending |
| Delete OR Books_260724 (1–14) | pending |
