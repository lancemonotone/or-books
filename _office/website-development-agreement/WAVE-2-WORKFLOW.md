# Wave 2 billed work — how we run it

Same pattern as Wave 1. Briefboard is the plan for client scope. Do not invent a separate epic plan unless the human asks.

## Source of truth

- **Board:** Wave 2 estimate — https://lancemonotone.com/or-books/app/estimates?section=wave-2
- **Scope per card:** title, problem (her wording), recommendation (suggested fix), hours, status
- **Research / hour history:** `billed-wave1-estimate-notes.md` (may lag the board; prefer live cards)
- **Client thread:** `email-draft-billed-wave1-estimate.md`, `email-chain-since-agreement.md`

Approved cut (as of client go-ahead): planned cards only; deferred / skipped stay deferred. Re-read the board before starting — hours and recommendations were revised after her notes (Events = unscramble only, not mockup rebuild).

## How to implement (per card)

1. Confirm card status is **planned** (or equivalent ready). Skip deferred.
2. Branch from up-to-date `staging`: `feature/wave2-<id>-…` or `fix/…` as needed.
3. Implement only that card’s recommendation. No freelance scope.
4. Verify on staging (or local Stencil with staging IDs when required).
5. Write `_office/<id>-<slug>/NOTES.md` from `TASK-NOTES-TEMPLATE.md`.
6. Briefboard comment = client-facing outcome only (see `briefboard-comments.mdc`).

No TDD. Lock behavior from the card (or a short named plan for one hard card), implement, check in the browser.

## Suggested order (after client go-ahead)

Re-read Wave 2 on the board first. Only **planned** cards. Do not wait on Events posters or her “keep like live” list to start the rest.

1. Sync `staging` from `main`, then branch.
2. **Arrow batch** (same carousel / slider area): **4.2** Latest News arrows → **4.4** book arrows → **4.5** mobile round arrows + auto-scroll.
3. **Small layout tweaks:** **4.8** See all under blocks → **4.6** Featured Title cover on mobile → **4.12** media / News date–title gap → **4.11** About the author photo.
4. **4.15 Events** last among the build: short unscramble plan first → fix layout on staging → add posters / copy when she sends them.

Start with **4.2** unless the human names a different card.

## When a short written plan *is* worth it

- **4.15 Events unscramble** — easy to overbuild into the mockup. One short plan: restore working layout, put current/upcoming content in when assets arrive, leave the rest alone. No mockup rebuild, no admin event entry.
- Other cards: the Briefboard recommendation is enough unless the human names a plan file.

## Gates / do not

- **Events posters** — block Events *content* only, not the layout fix or other cards.
- **Her “keep like live” list** (Booksellers, etc.) — shapes **pre-deploy** tweaks, not this estimate. Prefer shared-grid density tweaks over ripping a page off the shared card system unless she decides otherwise.
- **Deferred cards** — leave deferred (4.1, 4.3, 4.7, 4.9, 4.10, 4.13, 4.14 as of the revised cut).
- **No mockup rebuild** for Events. **No prod push** until the human says so.

## Deploy

Theme pushes as one unit. Do not promise per-page deploys. Staging first; production only when the human says so. Homepage IDs: staging `111`/`112`/`1792` while on staging; never leave those in a prod push (`docs/agents/stencil-theme.md`).

## Booksellers / “keep like live”

Staging vs live diffs on listing pages are often **Wave 1 theme** (shared product cards / column density), not unsynced CMS copy. Booksellers category description already matched prod after catalog sync.
