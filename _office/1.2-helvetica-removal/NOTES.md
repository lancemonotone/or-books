# 1.2 — Helvetica Removal

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `1.2` |
| **taskKey** | `2d1a8876-4cd6-4ecb-a5ab-4dd69c2d0bdd` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/2d1a8876-4cd6-4ecb-a5ab-4dd69c2d0bdd |
| **Branch** | `feature/helvetica-font-removal` |
| **Commits** | `a820202` — remove embedded Helvetica webfonts; `2355325` — mark complete pending batch deploy |
| **Deploy** | Complete in Briefboard; local theme ready; **not live** until Wave 1 batch push |

## Client ask (original)

Monotype flagged embedded Helvetica on the storefront; license cost prohibitive. Client asked to stop serving Helvetica files and use system font stack with fallbacks while keeping brand look where possible.

Full email thread: `_office/1.2-helvetica-removal/helvetica.md`.

## Delivered (final state)

- Removed embedded Helvetica font files from theme assets / CDN serve path.
- **Body/UI:** system Helvetica when installed (typical on Apple), else Arial — via SCSS stacks in `variable.scss`.
- **Condensed headings:** Roboto Condensed (Google Font) — loaded in `base.html`; not Helvetica Condensed files.
- Storefront no longer downloads Helvetica binaries from the store CDN.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| “Continue using Helvetica” as brand font | System Helvetica **only when already on device**; no webfont embed | Embedding was the license trigger; system stack is the compliant pattern. |

## Client action needed

- [x] None — font-removal approach agreed in email (Rus → Antara).
- [ ] **Review on staging** after batch push — spot-check headings and body type on Mac vs Windows.
- [ ] **Retroactive Monotype fee** — Antara asked whether original site builders should have licensed fonts; draft reply in `helvetica.md` (not legal advice; client should consult counsel before paying or replying to Monotype).

## Verify

`stencil start` → Network tab: no Helvetica `.woff`/`.woff2` from theme; Roboto Condensed + Karla (or configured Google fonts) only.

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-1.2 `base.html` | `templates-archive/templates/layout/base.html` (from commit before `a820202`) |
| Font cutover trials / email | `_office/1.2-helvetica-removal/base.helvetica.hbs`, `base.robotocondensed.hbs`, `base.achivonarrow.hbs`, `helvetica.md`, `CUTOVER.txt` |
| Restore layout | `cp templates-archive/templates/layout/base.html orbooks-theme/templates/layout/base.html` |

## Screenshots / media

None required; compliance issue, not visual redesign.

## Related / follow-up

- Optional future cleanup: remove leftover font binaries if any remain; SCSS family name audit — tracked as follow-up in Briefboard recommendation text, not blocking 1.2.
