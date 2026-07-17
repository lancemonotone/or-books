# Phase reorder on overview — Design

**Date:** 2026-07-17  
**Status:** Approved  
**App:** OR Books mobile review (`app/`)

## Problem

Phases on the Overview page follow `audit.sprints` array order, but there is no way to reorder them from the live overview. Editors must change phase numbers manually in the content editor. Open accordion panels make any future drag-and-drop hard: tall open panels destroy drop targeting.

## Goals

- Authenticated editors reorder phases on Overview via drag-and-drop.
- After reorder, phase numbers are dense `1…N` matching list order.
- Issue display ids stay `{phase}.{sequence}` (`n.x`): **n** = phase order, **x** = issue order within that phase (Compact).
- Issue **keys** never change (comments, evidence, deep links stay valid).
- Explicit **Reorder phases** mode collapses all accordions so drag targets stay short.

## Non-goals

- Guest / unauthenticated reorder.
- Editor Phases-list DnD (same remap rules can mirror later).
- Removing or changing the editor’s free-form “Phase number” field in this slice.
- SortableJS or other DnD libraries (native HTML5, same pattern as issue sidebar).
- Undo history.
- Special “Deferred” pin (the name “Deferred” is ordinary phase copy in this install).
- Auto-reopening phases after exiting reorder mode.

## Decisions

| Topic | Choice |
|-------|--------|
| Who | Authenticated only |
| Surface | Overview phase accordion (`#/`) |
| UX entry | **Reorder phases** button (not naked drag while browsing) |
| On enter mode | Collapse all; clear `?phases=`; show ⠿ handles; block opening accordions |
| On Done | Exit mode; phases stay closed |
| Semantics | Renumber phase ids to `1…N` by new list position; remap `issue.sprint`; Compact `issue.id` |
| Within-phase issues | Relative order unchanged |
| Persist | Dedicated `POST api/save-phase-order.php` |
| DnD | HTML5 + handle-only, mirrors editor issue sidebar |
| Empty / single phase | Empty phases still reorder; **hide** Reorder when fewer than 2 phases |

## UX mode

1. When authenticated and `audit.sprints.length >= 2`, show **Reorder phases** beside the existing open/close-all accordion controls. If fewer than 2 phases, omit the button.
2. Enter mode → collapse every phase `<details>`; `history.replaceState` to `#/` (no open phase ids); render ⠿ `data-drag-handle` on each summary row; prevent toggle/open while mode is on; disable or hide open-all.
3. Drag via handle only (not the whole summary). Drop indicators: `is-drop-before` / `is-drop-after` (same idea as editor issue list).
4. Successful drop → persist → patch client state → re-render Overview **still in reorder mode** so the editor can keep shuffling.
5. Button label toggles **Reorder phases** ↔ **Done**. Done exits mode; accordions stay closed.
6. Guests: no button, no handles.

## Remap rules

Client sends a **permutation of current (pre-drop) phase ids** in the new visual order.

Server:

1. Rebuild `audit.sprints` in that order (preserve title, subtitle, description).
2. Assign new ids `1…N` by position. Build `oldId → newId`.
3. For each issue: `sprint = map[oldSprint]` when the old sprint is in the map.
4. Compact within each phase: `id = "{newSprint}.{1…M}"` in current within-phase list order.
5. Issue **key** unchanged.
6. Reject the request if `phaseIds` is not an exact permutation of current audit phase ids (missing, duplicate, or unknown).

Orphan issues (sprint not in audit): leave unchanged — same spirit as `save-issue-phase.php` orphan handling; do not invent a phase.

## API

`POST api/save-phase-order.php`  
Auth + CSRF + honeypot (same contract as other overview saves).

### Request

```json
{
  "phaseIds": [3, 1, 2, 4, 5],
  "csrf": "…",
  "website": ""
}
```

`phaseIds`: new order; values are **pre-drop** phase ids.

### Success (200)

```json
{
  "ok": true,
  "sprints": [
    { "id": 1, "title": "…", "subtitle": "…", "description": "…" }
  ],
  "issues": [
    { "key": "…", "id": "1.1", "sprint": 1 }
  ],
  "phaseMap": { "3": 1, "1": 2, "2": 3, "4": 4, "5": 5 },
  "savedAt": "…"
}
```

### Errors

| Code | When |
|------|------|
| 401 / 403 | Not authenticated / bad CSRF |
| 422 | Not a permutation of current phase ids |
| 404 | Audit or issues file missing |
| 500 | Lock / parse / write failure |

### Persistence

- Lock and write both `audit` and `issues` in one critical section (no half-write).
- **Issues:** block-level YAML rewrite patterned on `save-issue-phase.php` (preserve issue blocks; update `sprint` + Compact `id`; keep within-phase block order; orphans appended unchanged).
- **Audit:** surgical rewrite of the `sprints` list — reorder sprint entries to match the permutation, rewrite each `id:` to dense `1…N`, preserve title/subtitle/description and other audit keys. Do **not** require PHP `ext-yaml` emit (this Local PHP has no `yaml_emit`). Fail closed if the sprints list cannot be parsed/rebuilt.
- Concurrent editor save: last write wins (same as other overview APIs).

## Client wiring

- `savePhaseOrder(phaseIds)` in `app/assets/api.js` → `postJson`.
- Overview state flag (e.g. `phaseReorderMode`) survives re-render so mode stays on after a successful drop.
- On success: replace `state.audit.sprints` from `sprints`; patch each `state.issues[]` `id` / `sprint` from the `issues` index (same pattern as `saveIssuePhase`).
- Optimistic DOM reorder allowed; on API failure → restore previous order + `alert` (rollback spirit of phase select).
- CSS: handle in the summary row; while mode is on, rows stay collapsed height only.

## Architecture

```
Overview (auth)
  → Reorder phases
      → collapse all, clear ?phases=, show handles
  → HTML5 drop
      → phaseIds from DOM order
      → POST save-phase-order.php
          → remap audit.sprints + issues (Compact)
      → patch state → render (still in mode)
  → Done → exit mode, stay collapsed
```

## Verification (manual)

1. Guest: no reorder control.
2. Auth, 2+ phases: enter mode → all closed; cannot open; handles visible.
3. Drag phase formerly `3` to first → after save, that phase is `1`; its issues become `1.x`; other phases renumber; keys unchanged; `#/issue/{key}` still works.
4. Within-phase issue order unchanged (only the `n` prefix changes).
5. API fail → UI order restored; YAML unchanged.
6. Done → handles gone; phases stay closed.
7. Fewer than 2 phases: Reorder button absent.

## Out of scope reminders

- Do not add editor sidebar/Phases DnD in this slice.
- Do not auto-open previous `?phases=` set after Done.
- Do not treat any phase title as pinned or special.
