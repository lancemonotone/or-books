# Kill editor / Author mode design

Approved brainstorm (2026-07-18). Implementation: `docs/superpowers/plans/2026-07-18-kill-editor-author-mode.md`.

## Problem

Content authoring lives in a separate `/edit/` SPA. The presentation app already mutates some fields (status, tags, phase, comments). Multi-user auth shipped with admin vs user roles, but the product goal is a **collaborative** review board: clients should add tasks, phases, and media themselves. Keeping a second editor app doubles maintenance and blocks that collaboration.

## Goals

- Author on the **same presentation pages** (Author mode), not a folded form SPA.
- Shared **Edit / Done** toggle for every signed-in user (not always-editable).
- Collaborative writes when Edit is on (see permissions).
- Full rename **Issue → Task** (names, paths, APIs); UUID `key` values unchanged.
- Remove **acceptance** entirely (UI + YAML).
- Eventually delete `/edit/`.

## Permissions (when Edit is on)

| Action | Who |
|--------|-----|
| Add / reorder / delete tasks | all |
| Add / reorder / edit / delete phases | all |
| Add / attach / delete media | all |
| Edit title / problem / suggested fix | all |
| Overview intro | admin |
| Hours (estimate / actual) | admin |
| Settings | admin |

This widens multi-user auth: users are co-authors for structure and prose, not review-only. Settings and admin-only fields stay admin-gated.

## Phasing

1. **Rename** Issue → Task (hard cut APIs/files; short client hash redirects for old `#/issue…` routes). Personal test gate.
2. **Author mode** on presentation + drop acceptance; keep `/edit/` for Questions until phase 3.
3. **Questions** authoring on presentation → delete `/edit/`.

## Rename rules

| Keep | Change |
|------|--------|
| UUID values in `key:`, `comments.json` keys, `blocks:` values | Names: Issue → Task in UI, CONTEXT, files (`tasks.yaml`), APIs (`save-task-*`, `taskKey`), routes (`#/task/…`) |
| Display ids `phase.n` | Product term Issue id → Task id |

Fail Fast: no dual `issue`/`task` PHP endpoints after phase 1.

## Out of scope

Auth emails / OAuth; renaming `editor_*` PHP session symbols; Notion-style always-on editing; keeping acceptance as an ignored field.
