# Kill editor / Author mode Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans or subagent-driven-development task-by-task. Steps use checkbox syntax.

**Goal:** Collaborative Author mode on presentation; full Issue→Task rename; eventually delete `/edit/`.

**Architecture:** Evolve presentation [`app/assets/app.js`](../../app/assets/app.js) with Edit toggle + save APIs. Phase 1 is rename-only. Phase 2 adds authoring chrome and widens write auth. Phase 3 ports Questions and removes [`app/edit/`](../../app/edit/).

**Tech stack:** Vanilla JS, PHP session auth (`editor-lib.php`), YAML under `app/data/`.

**Design:** [`docs/superpowers/specs/2026-07-18-kill-editor-author-mode-design.md`](../specs/2026-07-18-kill-editor-author-mode-design.md).

## Hard rules

- Branch from up-to-date `staging`.
- No TDD; verify in browser.
- Fail Fast: no dual issue/task APIs after Phase 1.
- Do not start Phase 2 until Phase 1 is verified.

---

## Phase 1 — Full Issue → Task rename

### Task 1: Data file

- [ ] Rename `app/data/issues.yaml` → `app/data/tasks.yaml`
- [ ] Update loaders (`content.php`, editor `loadYamlFile`, `EDITOR_FILES`, notify paths)

### Task 2: PHP APIs

- [ ] Rename `save-issue-*.php` → `save-task-*.php`
- [ ] `issueKey` → `taskKey` in bodies and activity events
- [ ] Update callers in presentation + editor `api.js`

### Task 3: Presentation JS

- [ ] Routes `/task/`, `/tasks/…` in `router.js`
- [ ] Temporary redirects from `#/issue…` → `#/task…`
- [ ] Rename symbols/COPY in `app.js`, estimates modules

### Task 4: Editor + docs

- [ ] Rename `issue-composer.js` → `task-composer.js`
- [ ] Tabs/deep links `tasks` / `task=`
- [ ] Update `CONTEXT.md`, `app/README.md`

### Task 5: Verify (human gate)

- [ ] Admin + user: Overview, task detail by UUID, Estimates, editor, comments, Questions blocks, phase reorder

**STOP** for personal test before Phase 2.

---

## Phase 2 — Collaborative Author mode

- [ ] `state.editMode` + Edit / Done header control (all signed-in)
- [ ] When on: task CRUD/reorder, phase CRUD/reorder, media add/attach/delete, prose edit
- [ ] Admin-only: Overview intro, hours
- [ ] Strip `acceptance` from YAML + forms
- [ ] Auth: `editor_require_auth` for collaborative writes; `editor_require_admin` for intro/hours/Settings
- [ ] Relabel editor nav toward Questions-only until Phase 3

---

## Phase 3 — Kill `/edit/`

- [ ] Questions authoring under Edit mode on presentation
- [ ] Delete `app/edit/` and editor-only assets
- [ ] Remove editor nav link; redirect or 404 old `/edit/` URL
