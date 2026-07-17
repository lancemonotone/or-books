# BigCommerce impl notes + Issue estimates

**Goal:** For each planned Issue (phases 1–4), document senior-dev BigCommerce implementation steps and set `hours` on `issues.yaml` so `#/estimates` is complete.

**Out of scope:** Implementing storefront changes; `actual_hours` (burn). Deferred Issues get hours for the Estimate side line only.

**Deliverables:**
1. `_office/mobile-ux-audit/plan/bc-implementation-notes.md` — one section per Issue
2. `hours:` on each planned Issue in `app/data/issues.yaml`

**Rules:**
- Context7 `/bigcommerce/docs` first; note when theme-local (no BC API for CSS-only)
- Senior familiar with BC basics; lean hours (0.25 / 0.5 increments)
- Client decisions already in `responses/decisions.json` / comments
- Client scope changes (e.g. 1.2 accordion, 1.10 bylines+hashtags) override original recommendation when present

**Verify:** Open `#/estimates` — Remaining shows hours for all planned Issues; Deferred side line has no hours.
