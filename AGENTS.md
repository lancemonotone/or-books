## Agent skills

### Issue tracker

GitHub Issues via `gh` (`lancemonotone/or-books`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### BigCommerce Stencil theme

Local theme at `orbooks-theme/` (orbooks.com storefront). CLI, secrets, sync/push, font cutover: `docs/agents/stencil-theme.md`. Cursor rule: `.cursor/rules/stencil-theme.mdc` (applies when editing theme files).

### Briefboard Agent API

Live board: `https://lancemonotone.com/or-books/app/` — docs `API.md`, endpoint `api/agent.php`.

- Token file: `.cursor/secrets.briefboard.json` (gitignored). Copy from `.cursor/secrets.briefboard.example.json`.
- Fields: `baseUrl`, `agent_api_token` (from that install’s `config.php`). Never commit or paste the token in chat.

### Task delivery notes (client copy source)

Per-task outcome memos for agents: `_office/<task-slug>/NOTES.md`. Index + template: `_office/README.md`, `_office/TASK-NOTES-TEMPLATE.md`.

Use these (plus Briefboard API) to draft what changed, scope divergences, and client action items — not play-by-play dev logs.

Theme rollback snapshots: `templates-archive/` — **write-once** pre-change originals per path (baseline `9a14f93`); single tree, no per-task folders; never put shipped code or later edits there (`templates-archive/README.md` → Agent contract).

### Testing / TDD

Do **not** use TDD (`/tdd`, red-green-refactor, failing tests first) in this repo.
Prefer: lock behavior in a short plan → implement → verify in the browser (or a quick manual check).
Do not add a test harness for feature work unless the user explicitly asks.
