## Agent skills

### Issue tracker

GitHub Issues via `gh` (`lancemonotone/or-books`). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five labels (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). See `docs/agents/triage-labels.md`.

### Domain docs

Single-context (`CONTEXT.md` + `docs/adr/` at repo root). See `docs/agents/domain.md`.

### Testing / TDD

Do **not** use TDD (`/tdd`, red-green-refactor, failing tests first) in this repo.
Prefer: lock behavior in a short plan → implement → verify in the browser (or a quick manual check).
Do not add a test harness for feature work unless the user explicitly asks.
