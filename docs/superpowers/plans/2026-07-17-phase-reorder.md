# Phase reorder on overview — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.  
> **Do not use TDD** — see `.cursor/rules/no-tdd.mdc` and `AGENTS.md`. Verify with the manual checks named in each task.  
> **CSS:** Any `.css` edit must follow the `responsive-css` skill (mobile-first, nested `@media` at `768px`/`1024px`, logical properties, native nesting — no BEM `&__` / `&--`).

**Goal:** Let authenticated editors reorder Overview phases via an explicit reorder mode (collapse + ⠿ handles); persist a dense `1…N` renumber with Compact `n.x` Issue ids.

**Architecture:** Overview enters `phaseReorderMode` → collapse all → HTML5 handle DnD → `POST api/save-phase-order.php` with a permutation of **pre-drop** phase ids. Server surgically rewrites `audit.yaml` sprints (new order + ids `1…N`) and `issues.yaml` (`sprint` + Compact `id`); returns `sprints` + issue index for client patch. No `ext-yaml` emit (unavailable on this Local PHP).

**Tech stack:** Vanilla JS (`app/assets/app.js`, `api.js`), PHP session auth APIs, flat YAML under `app/data/`.

**Spec:** `docs/superpowers/specs/2026-07-17-phase-reorder-design.md`  
*(Persistence note: spec originally preferred `yaml_parse`/`yaml_emit`; this environment has neither — plan uses surgical audit rewrite, and the spec Persistence section matches.)*

**Branch:** from up-to-date `staging` → `feature/plan-phase-reorder` (create before Task 1 if not already on a feature branch).

## Global Constraints

- Renumber phases to dense `1…N` matching list order; Compact Issue ids to `{phase}.{sequence}`; **keys** never change.
- Auth-gated app shell already; show Reorder only when `audit.sprints.length >= 2`.
- Explicit **Reorder phases** mode — not naked drag while browsing.
- Enter mode → collapse all, clear `?phases=`, show handles, block accordion open; Done → exit, stay closed.
- One transport: `POST api/save-phase-order.php` (no parallel admin-ajax / full YAML dump from overview).
- No SortableJS; no editor Phases DnD; no Deferred pin; no undo; no auto-reopen after Done.
- Asset rules: no jQuery; no inline script/style in PHP; vanilla JS; separate CSS in `styles.css`.
- Domain vocabulary: Issue / Issue id / Issue key / Phase / Compact — see `CONTEXT.md`.

## File map

| File | Role |
|------|------|
| `app/api/save-phase-order.php` | Auth POST: permutation → remap audit + issues → JSON |
| `app/assets/api.js` | `savePhaseOrder(phaseIds)` |
| `app/assets/app.js` | Mode flag, accordion render/handles, DnD bind, COPY, state patch |
| `app/assets/styles.css` | Handle + drop markers + reorder-mode accordion rules |
| `app/README.md` | Document Overview phase reorder |

---

### Task 1: `save-phase-order.php` (server remap)

**Files:**
- Create: `app/api/save-phase-order.php`

**Interfaces:**
- Consumes: `editor-lib.php` (`editor_require_auth`, CSRF, honeypot, `editor_data_path`, `editor_write_yaml`); issue-block helpers patterned on `save-issue-phase.php`
- Produces: `POST` JSON `{ ok, sprints, issues, phaseMap, savedAt }`

- [ ] **Step 1: Create endpoint shell**

Create `app/api/save-phase-order.php`:

```php
<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

editor_start_session();
editor_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
editor_verify_honeypot($body['website'] ?? null);
editor_verify_csrf($body['csrf'] ?? null);
editor_release_session();

$phaseIdsRaw = $body['phaseIds'] ?? null;
if (!is_array($phaseIdsRaw) || $phaseIdsRaw === []) {
    respond_json(422, ['error' => 'phaseIds must be a non-empty array.']);
}

$requestedIds = [];
foreach ($phaseIdsRaw as $raw) {
    if (!is_numeric($raw)) {
        respond_json(422, ['error' => 'Invalid phase id in phaseIds.']);
    }
    $requestedIds[] = (int) $raw;
}

$auditPath = editor_data_path('audit');
$issuesPath = editor_data_path('issues');
if (!file_exists($auditPath) || !file_exists($issuesPath)) {
    respond_json(404, ['error' => 'Audit or issues file not found.']);
}

$auditLockPath = $auditPath . '.lock';
$issuesLockPath = $issuesPath . '.lock';
$auditLock = fopen($auditLockPath, 'c+');
$issuesLock = fopen($issuesLockPath, 'c+');
if ($auditLock === false || $issuesLock === false) {
    respond_json(500, ['error' => 'Could not lock data files.']);
}

try {
    if (!flock($auditLock, LOCK_EX) || !flock($issuesLock, LOCK_EX)) {
        respond_json(500, ['error' => 'Could not lock data files.']);
    }

    $auditContent = file_get_contents($auditPath);
    $issuesContent = file_get_contents($issuesPath);
    if ($auditContent === false || $issuesContent === false) {
        respond_json(500, ['error' => 'Could not read data files.']);
    }

    $result = reorder_phases_yaml($auditContent, $issuesContent, $requestedIds);
    editor_write_yaml('audit', $result['auditContent']);
    editor_write_yaml('issues', $result['issuesContent']);
} finally {
    flock($auditLock, LOCK_UN);
    flock($issuesLock, LOCK_UN);
    fclose($auditLock);
    fclose($issuesLock);
}

respond_json(200, [
    'ok' => true,
    'sprints' => $result['sprints'],
    'issues' => $result['issues'],
    'phaseMap' => $result['phaseMap'],
    'savedAt' => gmdate('c'),
]);
```

- [ ] **Step 2: Implement audit sprint parse + rewrite**

In the same file, add helpers. Parse sprint entries under `sprints:` as blocks starting with `  - id:` (two-space indent list items). Validate `$requestedIds` is an exact permutation of current ids (same length, same set, no dupes).

```php
/**
 * @param list<int> $requestedIds
 * @return array{
 *   auditContent: string,
 *   issuesContent: string,
 *   sprints: list<array{id:int,title:string,subtitle:string,description:string}>,
 *   issues: list<array{key:string,id:string,sprint:int}>,
 *   phaseMap: array<string,int>
 * }
 */
function reorder_phases_yaml(string $auditContent, string $issuesContent, array $requestedIds): array
{
    $parsed = parse_audit_sprints_section($auditContent);
    $currentIds = array_map(static fn(array $s): int => $s['id'], $parsed['sprints']);

    $sortedCurrent = $currentIds;
    $sortedRequested = $requestedIds;
    sort($sortedCurrent);
    sort($sortedRequested);
    if ($sortedCurrent !== $sortedRequested || count($requestedIds) !== count(array_unique($requestedIds))) {
        respond_json(422, ['error' => 'phaseIds must be a permutation of current phase ids.']);
    }

    $byOldId = [];
    foreach ($parsed['sprints'] as $sprint) {
        $byOldId[$sprint['id']] = $sprint;
    }

    $phaseMap = []; // oldId string => newId int
    $newSprints = [];
    $newBlocks = [];
    $newId = 1;
    foreach ($requestedIds as $oldId) {
        $sprint = $byOldId[$oldId];
        $phaseMap[(string) $oldId] = $newId;
        $newSprints[] = [
            'id' => $newId,
            'title' => $sprint['title'],
            'subtitle' => $sprint['subtitle'],
            'description' => $sprint['description'],
        ];
        $newBlocks[] = rewrite_sprint_block_id($sprint['block'], $newId);
        $newId++;
    }

    $auditContent = $parsed['before'] . "sprints:\n" . implode('', $newBlocks) . $parsed['after'];

    $issuesResult = remap_issues_for_phase_order($issuesContent, $phaseMap, array_column($newSprints, 'id'));

    return [
        'auditContent' => $auditContent,
        'issuesContent' => $issuesResult['content'],
        'sprints' => $newSprints,
        'issues' => $issuesResult['issues'],
        'phaseMap' => $phaseMap,
    ];
}
```

Implement `parse_audit_sprints_section` to split:

- `before` = everything before the `sprints:` line (include trailing newline up to but not including `sprints:`)
- sprint blocks = each `  - id: N` … until next `  - id:` or dedent out of list
- `after` = any trailing content after the sprints list (usually empty)

Implement `rewrite_sprint_block_id($block, $newId)` with `preg_replace` on the first `id:` line only.

Extract title/subtitle/description from each block with simple line regexes (multiline `|` descriptions: keep the raw block body when rewriting id only — do not re-serialize description). For the JSON `sprints` payload, read scalar fields; for description, join remaining description lines after `description:` (or empty string).

- [ ] **Step 3: Implement issues remap (block surgery)**

Pattern on `save-issue-phase.php` block split (`(?=^- key:)`):

```php
/**
 * @param array<string,int> $phaseMap oldId string => newId
 * @param list<int> $newPhaseIds dense 1…N in order
 * @return array{content: string, issues: list<array{key:string,id:string,sprint:int}>}
 */
function remap_issues_for_phase_order(string $content, array $phaseMap, array $newPhaseIds): array
{
    // Split into prefix + blocks (same as save-issue-phase.php).
    // For each block: if sprint in phaseMap, rewrite sprint to new id.
    // Bucket by NEW sprint id; preserve encounter order within each old phase
    // (blocks already in file order — when grouping, append in original pass order).
    // Compact id to "{newSprint}.{sequence}".
    // Orphans (sprint not in map): append unchanged after ordered phases.
    // Return content + index of {key,id,sprint} for every block that has those fields.
}
```

Reuse (copy into this file, or extract shared helpers later — **do not** create a shared lib in this slice unless copy is painful) the `read_block_*` / `write_block_id` helpers from `save-issue-phase.php`. Also add `write_block_sprint($block, $sprint)` mirroring the sprint `preg_replace` in that file.

- [ ] **Step 4: Manual API verify**

While logged in (browser session cookie), from DevTools or a small curl with session:

1. `POST` with `phaseIds` = reverse of current ids (e.g. `[5,4,3,2,1]`).
2. Expect 200; `audit.yaml` sprints ids are `1…N` in new order; titles moved with them; issues under former phase 5 now have `sprint: 1` and ids `1.x`.
3. `POST` with duplicate / missing id → 422.
4. Restore desired order with another POST (or git checkout data files if verifying on a throwaway copy).

**Commit message (when user asks to commit):** `feat: add save-phase-order API for phase renumber`

---

### Task 2: Client API helper

**Files:**
- Modify: `app/assets/api.js`

**Interfaces:**
- Consumes: `postJson`
- Produces: `savePhaseOrder(phaseIds: number[]): Promise<{ sprints, issues, phaseMap, savedAt }>`

- [ ] **Step 1: Add export**

After `saveIssueTags`:

```js
export function savePhaseOrder(phaseIds) {
  return postJson('api/save-phase-order.php', { phaseIds });
}
```

- [ ] **Step 2: Wire import in `app.js`**

In `app/assets/app.js` import list (top of file), add `savePhaseOrder` next to `saveIssuePhase`.

**Commit message:** `feat: add savePhaseOrder client helper`

---

### Task 3: Overview reorder mode + DnD + CSS

**Files:**
- Modify: `app/assets/app.js`
- Modify: `app/assets/styles.css` (follow `responsive-css` skill)

**Interfaces:**
- Consumes: `savePhaseOrder`, `state.audit.sprints`, `overviewHref`, `syncOverviewPhaseUrl`, `render` / `bindUi`
- Produces: `state.phaseReorderMode` boolean; reorder UI on Overview

- [ ] **Step 1: State + COPY**

In `state` object add:

```js
phaseReorderMode: false,
```

In `COPY` (near phases accordion strings) add:

```js
reorderPhases: "Reorder phases",
doneReorderingPhases: "Done",
```

- [ ] **Step 2: Render accordion for mode**

Update `renderPhasesAccordion(openPhaseIds)`:

- If `state.phaseReorderMode`, force all items closed (ignore `openPhaseIds` for `open` attribute).
- If mode on, prepend a drag handle inside each summary:

```html
<button type="button" class="phases-accordion__drag" data-drag-handle draggable="true" aria-label="Drag to reorder">⠿</button>
```

- Put `data-phase-reorder` on `.phases-accordion` when mode is on.
- In `section__head` controls: if `(state.audit.sprints || []).length >= 2`, add:

```html
<button type="button" class="phases-accordion__reorder" data-phases-reorder>
  ${escapeHtml(state.phaseReorderMode ? COPY.doneReorderingPhases : COPY.reorderPhases)}
</button>
```

- When mode on, omit or disable open-all / close-all (prefer omit open-all; close-all optional — simplest: hide both open/close-all while mode on, show only Done).

- [ ] **Step 3: Enter / exit mode**

In `bindUi` (near phases open/close handlers):

```js
const reorderBtn = main.querySelector("[data-phases-reorder]");
if (reorderBtn) {
  reorderBtn.addEventListener("click", () => {
    if (state.phaseReorderMode) {
      state.phaseReorderMode = false;
      render();
      return;
    }
    state.phaseReorderMode = true;
    main.querySelectorAll("details[data-phase-id]").forEach((item) => {
      item.open = false;
    });
    history.replaceState(null, "", overviewHref([]));
    state.route = parseRoute();
    render();
  });
}
```

On phase `toggle` listeners: if `state.phaseReorderMode`, force `item.open = false` and return (do not sync open URL).

Clear mode on route leave: at start of `render()` or route change, if `state.route.name !== "overview"` then `state.phaseReorderMode = false`.

- [ ] **Step 4: Bind HTML5 DnD**

Add `bindPhaseReorderDrag(root = main)` called from `bindUi` when mode on:

```js
function bindPhaseReorderDrag(root = main) {
  const container = root.querySelector(".phases-accordion[data-phase-reorder]");
  if (!container) {
    return;
  }

  let draggedPhaseId = null;
  const items = () => [...container.querySelectorAll("details[data-phase-id]")];

  const clearDropState = () => {
    container
      .querySelectorAll(".is-dragging, .is-drop-before, .is-drop-after")
      .forEach((node) => {
        node.classList.remove("is-dragging", "is-drop-before", "is-drop-after");
      });
  };

  container.querySelectorAll("[data-drag-handle]").forEach((handle) => {
    handle.addEventListener("dragstart", (event) => {
      const item = handle.closest("details[data-phase-id]");
      draggedPhaseId = item?.dataset.phaseId || null;
      if (!draggedPhaseId) {
        return;
      }
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedPhaseId);
      item?.classList.add("is-dragging");
    });
    handle.addEventListener("dragend", () => {
      draggedPhaseId = null;
      clearDropState();
    });
    // Prevent summary toggle when interacting with handle
    handle.addEventListener("click", (event) => event.preventDefault());
  });

  container.addEventListener("dragover", (event) => {
    if (!draggedPhaseId) {
      return;
    }
    event.preventDefault();
    clearDropState();
    const item = event.target.closest("details[data-phase-id]");
    if (item && item.dataset.phaseId !== draggedPhaseId) {
      const rect = item.getBoundingClientRect();
      const before = event.clientY < rect.top + rect.height / 2;
      item.classList.add(before ? "is-drop-before" : "is-drop-after");
    }
  });

  container.addEventListener("drop", async (event) => {
    event.preventDefault();
    const fromId = event.dataTransfer.getData("text/plain") || draggedPhaseId;
    clearDropState();
    if (!fromId) {
      return;
    }
    const target = event.target.closest("details[data-phase-id]");
    if (!target || target.dataset.phaseId === fromId) {
      return;
    }

    const order = items().map((el) => el.dataset.phaseId);
    const fromIndex = order.indexOf(fromId);
    if (fromIndex < 0) {
      return;
    }
    order.splice(fromIndex, 1);
    const targetId = target.dataset.phaseId;
    let toIndex = order.indexOf(targetId);
    const rect = target.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    if (!before) {
      toIndex += 1;
    }
    order.splice(toIndex, 0, fromId);

    // Optimistic DOM order
    const byId = new Map(items().map((el) => [el.dataset.phaseId, el]));
    order.forEach((id) => {
      const el = byId.get(id);
      if (el) {
        container.appendChild(el);
      }
    });

    const previousSprints = structuredClone(state.audit.sprints);
    const previousIssues = state.issues.map((issue) => ({
      key: issue.key,
      id: issue.id,
      sprint: issue.sprint,
    }));

    try {
      const result = await savePhaseOrder(order.map(Number));
      state.audit.sprints = result.sprints;
      const byKey = new Map((result.issues || []).map((row) => [row.key, row]));
      for (const item of state.issues) {
        const next = byKey.get(item.key);
        if (!next) {
          continue;
        }
        item.id = next.id;
        item.sprint = next.sprint;
      }
      // Keep mode on
      state.phaseReorderMode = true;
      render();
    } catch (error) {
      state.audit.sprints = previousSprints;
      const prevByKey = new Map(previousIssues.map((row) => [row.key, row]));
      for (const item of state.issues) {
        const prev = prevByKey.get(item.key);
        if (!prev) {
          continue;
        }
        item.id = prev.id;
        item.sprint = prev.sprint;
      }
      window.alert(error.message || "Could not save phase order.");
      render();
    }
  });
}
```

Call `bindPhaseReorderDrag()` at end of `bindUi` when `state.phaseReorderMode` is true.

**Important:** After a successful save, phase **DOM** `data-phase-id` values become the **new** ids (`1…N`). The next drag must send those new ids as the permutation — `render()` after success handles that.

- [ ] **Step 5: CSS**

In `app/assets/styles.css` near `.phases-accordion` rules, add (native nesting, logical props, mobile-first):

```css
.phases-accordion__drag {
  flex-shrink: 0;
  inline-size: 2rem;
  block-size: 2rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-muted);
  cursor: grab;
  padding: 0;
  line-height: 1;
  font-size: 0.9rem;

  &:active {
    cursor: grabbing;
  }
}

.phases-accordion__reorder {
  /* match control button density; accent text */
  border: 0;
  border-radius: var(--radius);
  background: transparent;
  color: var(--color-accent);
  cursor: pointer;
  padding: 0.35rem 0.6rem;
  font: inherit;

  &:hover {
    background: var(--color-accent-soft);
    color: var(--color-text);
  }

  &:focus-visible {
    outline: 2px solid var(--color-accent);
    outline-offset: 2px;
  }
}

.phases-accordion[data-phase-reorder] {
  & .phases-accordion__summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  & .phases-accordion__item.is-dragging {
    opacity: 0.55;
  }

  & .phases-accordion__item.is-drop-before {
    box-shadow: inset 0 2px 0 0 var(--color-accent);
  }

  & .phases-accordion__item.is-drop-after {
    box-shadow: inset 0 -2px 0 0 var(--color-accent);
  }

  & .phases-accordion__panel {
    display: none;
  }
}
```

Adjust summary layout so the handle sits before the heading without breaking existing summary grid — inspect current `.phases-accordion__summary` and integrate the handle into that flex/grid rather than fighting it.

- [ ] **Step 6: Browser verify**

1. Log in → Overview → **Reorder phases** visible (5 phases).
2. Open a phase, then enter reorder → all closed; no open; handles visible; open-all gone.
3. Drag former phase 5 to top → after save, it is phase `1`; its issues show `1.x`; other phases renumber; issue deep links by key still work.
4. Within-phase issue order unchanged (spot-check two issues in one phase).
5. Done → handles gone; stay closed.
6. Force API error (temp rename endpoint) → alert + order restored.

**Commit message:** `feat: overview phase reorder mode with drag-and-drop`

---

### Task 4: README

**Files:**
- Modify: `app/README.md`

- [ ] **Step 1: Document Overview reorder**

In the editor / phases section (near “Edit phases” / Reorder issues), add a short bullet:

```markdown
6. **Reorder phases (Overview):** when signed in, use **Reorder phases** on the Overview accordion. All phases collapse; drag the ⠿ handle to change plan order. Phase numbers become dense `1…N`; Issue display ids Compact to match (`n.x`). Issue keys are unchanged.
```

Update the “Current phases are delivery waves…” note so it does not imply ids are forever fixed at 1–5 Deferred — order/numbers follow Overview reorder (Deferred is just a title).

- [ ] **Step 2: Skim verify** README matches shipped UI labels.

**Commit message:** `docs: document overview phase reorder`

---

## Spec coverage checklist

| Spec requirement | Task |
|------------------|------|
| Auth / 2+ phases button | Task 3 |
| Reorder mode collapse + block open + Done stays closed | Task 3 |
| HTML5 handle DnD | Task 3 |
| Remap `1…N` + Compact + keys stable | Task 1 |
| Permutation validation 422 | Task 1 |
| `save-phase-order.php` + locks both files | Task 1 |
| Surgical issues + surgical audit (no yaml_emit) | Task 1 |
| `savePhaseOrder` client | Task 2 |
| Patch state + stay in mode after save | Task 3 |
| Rollback on failure | Task 3 |
| CSS handles / drop markers | Task 3 |
| README | Task 4 |
| No editor Phases DnD / no SortableJS / no Deferred pin | Out of scope (not tasked) |

---

## Execution handoff

Plan saved to `docs/superpowers/plans/2026-07-17-phase-reorder.md`.

**Two execution options:**

1. **Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
2. **Inline Execution** — execute tasks in this session with checkpoints  

Which approach?
