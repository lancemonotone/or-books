# OR Books — Mobile UX Audit Workspace

Working area for screenshot-driven discovery, notes, and implementation planning. Source evidence lives in [`../screenshots/`](../screenshots/); this folder holds analysis, inventory, and the plan of attack.

**Client presentation app:** [`../../app/`](../../app/) — interactive deck at `orbooks.com/audit/` when deployed.

## Status

| Phase | Screenshots | Discovery doc | Status |
|-------|-------------|---------------|--------|
| 1 — Core flows | 10 screenshots | [phase-1-done-screenshots.md](./discovery/phase-1-done-screenshots.md) | Complete |
| 2a — Content & directory | 10 screenshots | [phase-2-batch-1-content-pages.md](./discovery/phase-2-batch-1-content-pages.md) | Complete |
| 2a+ — Annotations & recording | 3 PNGs + 1 video | [screenshot-annotations.md](./discovery/screenshot-annotations.md) | Complete |
| 2b — Ancillary & legal | 13 screenshots | [phase-2-batch-2-ancillary-pages.md](./discovery/phase-2-batch-2-ancillary-pages.md) | Complete |
| 2 — PNG pass | **36 total** in `screenshots/` | All discovery docs | Complete |
| 3 — Screen recordings | 4 `.mp4` in `screenshots/` | [recordings-notes.md](./discovery/recordings-notes.md) | 1 of 4 |

## Folder layout

```
mobile-ux-audit/
├── README.md                 ← you are here
├── discovery/                ← structured findings per screenshot batch
│   ├── phase-1-done-screenshots.md
│   ├── phase-2-batch-1-content-pages.md
│   ├── screenshot-annotations.md  ← per-file detail (canonical)
│   ├── recordings-notes.md
│   └── analysis-template.md
├── inventory/
│   ├── screenshots.md          ← master list
│   └── filename-convention.md  ← {HHMMSS} naming for client sharing
├── plan/
│   └── roadmap.md              ← prioritized phase tasks
└── notes/                    ← scratch, meeting notes, open questions
```

## Workflow

1. **Capture** — Add to `../screenshots/`. Rename to `{HHMMSS}.png` / `{HHMMSS}.mp4` ([convention](./inventory/filename-convention.md)). Update [`inventory/screenshots.md`](./inventory/screenshots.md).
2. **Inventory** — Update [`inventory/screenshots.md`](./inventory/screenshots.md) when files move or new captures arrive.
3. **Analyze** — Copy [`discovery/analysis-template.md`](./discovery/analysis-template.md), fill it in, save as `discovery/phase-N-<topic>.md`.
4. **Consolidate** — Fold new findings into [`plan/roadmap.md`](./plan/roadmap.md); add or reprioritize tasks.
5. **Implement** — When ready, reference roadmap tasks in a formal plan file (e.g. `docs/plans/`) and branch per [git-branch-workflow](../../.cursor/rules/git-branch-workflow.mdc).

## Screens covered in Phase 1

Homepage modules, Subjects page, book detail (Run Zohran Run!), search overlay, sidebar navigation, media sections, and purchase configuration UI.

## Open questions (post screenshot pass)

- Cart/checkout flow — **not captured** in any screenshot
- Account / login pages — footer links only
- Search results layout — not captured
- [Client decisions](./notes/client-decisions.md) — carousel style, Rights Catalogs content, email policy

## Resolved

- Footer, About, Contact, Authors, trade/legal pages — documented in phase 2 batches

## Related assets

| Asset | Location |
|-------|----------|
| Screenshots (36) | `../screenshots/*.png` |
| Screen recordings (4) | `../screenshots/*.mp4` |
