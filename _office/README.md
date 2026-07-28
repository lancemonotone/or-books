# Task delivery notes (`_office/`)

**Audience:** AI agents generating client updates, Briefboard comments, or handoff copy. Humans rarely read these files.

## When to add notes

After completing work on a **Briefboard task** (Wave 1+), create or update:

`_office/<task-id-slug>/NOTES.md`

Use `TASK-NOTES-TEMPLATE.md` as the schema. Copy the template; fill every section that applies.

## Naming

Folder slug: `<BB display id>-<short-slug>` — e.g. `2.2-fix-fake-links`, `2.1-label-or-replace-subjects-icons`.

## Index (completed / in progress)

| BB id | Folder | Branch (if any) | Status |
|-------|--------|-----------------|--------|
| 1.2 | `1.2-helvetica-removal/` | `feature/helvetica-font-removal` | Complete locally; deploy with Wave 1 batch |
| 2.1 | `2.1-label-or-replace-subjects-icons/` | `feature/wave1-2.1-subjects-icons` | Complete locally; deploy with Wave 1 batch |
| 2.2 | `2.2-fix-fake-links/` | `feature/wave1-2.2-section-heads` | Complete locally; deploy with Wave 1 batch |
| 2.3 | `2.3-stop-squashing-media-list-images/` | `feature/wave1-2.3-media-list-images` | Complete locally; deploy with Wave 1 batch |
| 2.5 | `2.5-make-headings-easier-to-tell-apart/` | — | Research / parked (NOTES only; not implemented) |

## Theme rollback archives

Pre-change theme file snapshots: `templates-archive/` — **one write-once tree**; see **Agent contract** in `templates-archive/README.md`.

- First edit to a path → copy true original (`9a14f93`) into `templates-archive/` if not already there.
- Later tasks touching the same path → skip (already archived).
- Restore from archive = undo **all** project changes on that file; per-task partial undo = git.
- Never store shipped or WIP code here.

| Task | Archive | What it holds |
|------|---------|---------------|
| 2.1+ | `templates-archive/` (single tree) | Pre–Wave 1 originals per path (see README manifest) |
| 1.2 | — | Font cutover artifacts in `_office/1.2-helvetica-removal/`; `base.html` original in `templates-archive/` |

## Generating client copy from NOTES

Read the task’s `NOTES.md` + live Briefboard task (`api/agent.php` GET). **Briefboard comment** (if posting): what changed in plain language; scope divergences vs the card when relevant. No internal git/deploy state; no review or next-step nudges unless the user asks. See `.cursor/rules/briefboard-comments.mdc`. **NOTES.md** may hold internal detail (branches, commits, deploy batch) for agents only.
