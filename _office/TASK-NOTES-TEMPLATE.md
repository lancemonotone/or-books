# <BB id> — <Briefboard task title>

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | e.g. `2.2` |
| **taskKey** | UUID from Briefboard `tasks[]` |
| **Briefboard URL** | `https://lancemonotone.com/or-books/app/?i=1#/task/<taskKey>` |
| **Branch** | e.g. `feature/wave1-2.2-section-heads` |
| **Commits** | Short list of commit hashes + one-line subject |
| **Deploy** | e.g. Local only until Wave 1 `stencil push` batch |

## Client ask (original)

One short paragraph from Briefboard `problem` / client comments. Quote Antara tags like `[P1]` when relevant.

## Delivered (final state)

What the storefront does **now** after this task. Bullets. Plain language. No file paths unless needed for rollback.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| … | … | … |

Omit this section if we matched the card exactly.

## Client action needed

- [ ] None — review on staging when batch is pushed
- [ ] Decision: …
- [ ] Content: …
- [ ] Approval: …

## Verify

Where to check locally: URL + viewport + what to tap/look for.

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change theme files | `templates-archive/` — **write-once** per path from baseline `9a14f93` (only if this task is the first to touch that file; see `templates-archive/README.md`) |
| New files (delete to undo) | List paths under `orbooks-theme/` |
| Other artifacts | e.g. `_office/…` font cutover |

Do **not** copy post-change code into `templates-archive/`. Do **not** overwrite an existing archived original.

## Screenshots / media

| File | Notes |
|------|--------|
| `_office/<folder>/….png` | … |

## Related / follow-up

Other BB tasks, decisions, or deferred work (e.g. 4.8 slider chrome — not in scope for this task).
