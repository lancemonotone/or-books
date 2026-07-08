# Stable Issue keys (Merge 1) Implementation Plan

> **For agentic workers:** Implement task-by-task. Steps use checkbox (`- [ ]`) syntax.  
> **Do not use TDD** — see `.cursor/rules/no-tdd.mdc`. Verify in the browser.  
> **Follow-up:** Merge 2 (Phase-grouped DnD + Compact display ids) is out of scope here; see “After Merge 1” at the end.

**Goal:** Give every Issue a stable UUID Issue key; use that key for all lasting references (URLs, comments, evidence links, decision blocks, editor deep links) while Issue id (`1.3`) remains the human-facing label only.

**Architecture:** Add `key` on each Issue in `issues.yaml`. Migrate existing evidence `issues[]`, decision `blocks[]`, and `comments.json` from display Issue ids to keys once. Presentation and editor look up by key for routing/selection; chips and headings still show Issue id. Hard cut on routes: `#/issue/<uuid>` only — old `#/issue/1.3` shows not-found.

**Tech stack:** Existing vanilla JS modules, js-yaml (browser + script), PHP editor auth APIs, flat YAML/JSON under `app/data/`.

**Domain / ADR:** `CONTEXT.md` · `docs/adr/0001-stable-issue-key.md`

**Branch:** `feature/issue-reorder-renumber` (already created from `staging`)

---

## Decisions locked (grill)

| Topic | Choice |
|------|--------|
| Identity | UUID Issue **key** + display **Issue id** |
| Lasting refs | All use **key** |
| URL label | Show Issue id; `href` uses key |
| Old `#/issue/1.3` | Hard cut — not found (nothing shared yet) |
| Compact (Merge 2) | Rewrites Issue ids only; does not touch key refs |
| Ship | This plan = Merge 1 only |

---

## File map

| File | Role |
|------|------|
| `app/data/issues.yaml` | Add `key:` per Issue (migration) |
| `app/data/evidence.yaml` | `issues:` lists become keys |
| `app/data/decisions.yaml` | `blocks:` become keys |
| `app/data/responses/comments.json` | Object keys become Issue keys (likely still `{}`) |
| `app/assets/app.js` | `issueByKey`, routes, chips href, comments by key |
| `app/assets/editor/main.js` | Selection + URL + View link by key |
| `app/assets/editor/views.js` | List `data-issue-key`, lookups by key; remove editable Issue id field now or leave for Merge 2 — **remove editable id in this merge** (Q3 A) |
| `app/assets/editor/issue-composer.js` | New Issues get `key` + append placement can wait for Merge 2; **must generate `key` on create** |
| `app/assets/editor/api.js` | `dumpYaml` includes `key`; optional `newIssueKey()` |
| `app/scripts/migrate-issue-keys.mjs` | One-shot migration (Node, uses `js-yaml` from `app/assets/vendor` or npm) |
| `app/README.md` | Document `key` + `#/issue/<key>` |

---

### Task 1: ADR already written — confirm + commit docs with feature

**Files:**
- Existing: `docs/adr/0001-stable-issue-key.md`
- Existing: `CONTEXT.md`

- [ ] **Step 1: Confirm ADR and CONTEXT match final grill**

Hard cut on display-id URLs (Q14 B). Issue key used for lasting refs. Compact defined as display-id rewrite only.

- [ ] **Step 2: Commit docs on the feature branch** (if not already)

```bash
git add CONTEXT.md docs/adr/0001-stable-issue-key.md docs/superpowers/plans/2026-07-08-stable-issue-keys.md
git commit -m "Document stable Issue key decision and Merge 1 plan."
```

---

### Task 2: Shared helper to create Issue keys

**Files:**
- Modify: `app/assets/editor/api.js`
- Optionally export a tiny shared helper used by presentation if needed (presentation only *reads* keys)

- [ ] **Step 1: Add `newIssueKey()` next to `suggestIssueId`**

```js
export function newIssueKey() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Extremely unlikely fallback in modern browsers — Fail Fast if missing:
  throw new Error('crypto.randomUUID is required to create Issue keys.');
}
```

- [ ] **Step 2: Ensure `dumpYaml` for issues always serializes `key` as string**

```js
payload = data.map((issue) => ({
  ...issue,
  key: String(issue.key),
  id: String(issue.id),
  sprint: Number(issue.sprint),
}));
```

- [ ] **Step 3: Commit**

```bash
git add app/assets/editor/api.js
git commit -m "Add Issue key helper and persist key in issues YAML dump."
```

---

### Task 3: One-shot migration script

**Files:**
- Create: `app/scripts/migrate-issue-keys.mjs`

Run from repo with Node 18+ (has `crypto.randomUUID`). Parse YAML with the vendored browser bundle is awkward; prefer:

```bash
cd app && npm init -y && npm install js-yaml
```

Only if `app/package.json` does not exist — keep scripts local; do not invent a full frontend build. Or: use PHP one-shot behind editor auth. **Prefer Node + js-yaml** so migration is reviewable in git as a pure data rewrite.

- [ ] **Step 1: Write script that:**

1. Loads `app/data/issues.yaml`, `evidence.yaml`, `decisions.yaml`, `responses/comments.json`
2. For each issue without `key`, assign `crypto.randomUUID()`
3. Builds `Map` displayId → key (string id → key)
4. Rewrites every evidence `issues[]` entry through the map; drop/warn on unknown ids (Fail Fast: throw if unknown)
5. Rewrites every decision `blocks[]` entry the same way
6. Rewrites `comments.json` top-level keys through the map (empty object stays empty)
7. Writes all files back (YAML dump with stable formatting close to current — `lineWidth: -1`)

Pseudo-structure:

```js
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import yaml from 'js-yaml';

const dataDir = path.resolve('data'); // run with cwd = app/

const issues = yaml.load(fs.readFileSync(path.join(dataDir, 'issues.yaml'), 'utf8'));
const idToKey = new Map();
for (const issue of issues) {
  if (!issue.key) issue.key = crypto.randomUUID();
  idToKey.set(String(issue.id), issue.key);
}
// ... rewrite evidence, decisions, comments ...
fs.writeFileSync(path.join(dataDir, 'issues.yaml'), yaml.dump(issues, { lineWidth: -1, noRefs: true }));
```

- [ ] **Step 2: Run migration**

```bash
cd app
node scripts/migrate-issue-keys.mjs
```

Expected: `issues.yaml` entries gain `key:`; evidence/decisions reference UUIDs.

- [ ] **Step 3: Spot-check**

```bash
grep -n "key:" data/issues.yaml | head
grep -n "blocks:" -A2 data/decisions.yaml | head
```

- [ ] **Step 4: Commit data + script**

```bash
git add app/scripts/migrate-issue-keys.mjs app/package.json app/package-lock.json app/data/issues.yaml app/data/evidence.yaml app/data/decisions.yaml app/data/responses/comments.json
git commit -m "Migrate Issues to stable keys and rewrite lasting refs."
```

(If you add `node_modules`, gitignore it — only commit lockfile + package.json.)

---

### Task 4: Presentation app — lookup and routes by key

**Files:**
- Modify: `app/assets/app.js`
- Modify: `app/assets/router.js` only if param rename helps (optional; `issueId` param can hold a key string)

- [ ] **Step 1: Replace `issueById` with key-first API**

```js
function issueByKey(key) {
  return state.issues.find((item) => item.key === key);
}

function issueById(id) {
  return state.issues.find((item) => String(item.id) === String(id));
}
```

Use `issueByKey` for routing, comments, chips `href`. Use Issue id only for visible text.

- [ ] **Step 2: Update chips**

```js
return `<a class="chip chip--issue" href="#/issue/${escapeHtml(issue.key)}">${escapeHtml(issue.id)}</a>`;
```

Same pattern for issue cards and edit links: `issue: issue.key` (or whatever `editorUrl` expects).

- [ ] **Step 3: `renderIssueDetail` / route**

`issueByKey(params.issueId)` (param is the key). Missing → existing not-found copy. **No** fallback to display id.

- [ ] **Step 4: Comments form**

`data-comment-form` and `saveComment` payload use Issue **key**.

- [ ] **Step 5: Browser verify**

1. Open presentation overview — chips show `1.x` / `2.x`
2. Click a chip — URL is `#/issue/<uuid>`, detail loads
3. Open `#/issue/1.3` — not found
4. Leave a comment on an issue — `comments.json` key is UUID after save

- [ ] **Step 6: Commit**

```bash
git add app/assets/app.js
git commit -m "Route and link presentation Issues by stable key."
```

---

### Task 5: Editor — select and deep-link by key

**Files:**
- Modify: `app/assets/editor/main.js`
- Modify: `app/assets/editor/views.js`
- Modify: `app/assets/editor/issue-composer.js`

- [ ] **Step 1: Rename mental model in state**

Prefer `selectedIssueKey` (or keep `selectedIssueId` but store the UUID — confusing). **Recommend rename to `selectedIssueKey`.**

Update:

- `updateEditorUrl` → `?issue=<key>`
- `applyEditorDeepLink` → match `item.key`
- `navigateToIssue` → argument is key (rename to `navigateToIssueKey` or keep name, pass key)
- Toolbar View link → `../#/issue/${key}` (label still fine as “View”)
- Delete uses key to find row

- [ ] **Step 2: Sidebar buttons**

```html
data-issue-key="${escapeAttr(issue.key)}"
```

Click handler reads `dataset.issueKey`.

- [ ] **Step 3: Remove editable Issue id field (Q3 A)**

In `renderIssueForm`, remove the `Issue id` input. Heading keeps `${issue.id}: ${issue.title}`. Phase select stays.

In `applyIssueForm`, stop reading `[name="id"]`; leave `issue.id` unchanged until Merge 2 Compact (still fine).

- [ ] **Step 4: Composer / Add issue**

On create:

```js
{
  key: newIssueKey(),
  id: suggestIssueId(phase, issues), // still ok for Merge 1; Merge 2 Compact will own sequencing
  sprint: phase,
  // ...
}
```

- [ ] **Step 5: Linked-issue checkboxes on Media tab**

Checkbox `value` = Issue **key**. `row.issues` arrays already keys after migration. Labels still show `${issue.id} — ${issue.title}`.

`syncEvidenceIssueLinks` must push **keys** (from `issue.key`), not `issue.id`:

```js
fileToIssues.get(item.file).add(String(issue.key));
```

- [ ] **Step 6: Browser verify**

1. Sign in to editor with `?tab=issues&issue=<uuid>`
2. Switch Issues — URL updates with key
3. View opens presentation on same key
4. Media linked-issues checkboxes persist keys after autosave
5. Create issue from composer — new row has `key` in saved YAML

- [ ] **Step 7: Commit**

```bash
git add app/assets/editor/main.js app/assets/editor/views.js app/assets/editor/issue-composer.js app/assets/editor/api.js
git commit -m "Select and link editor Issues by stable key; drop editable Issue id."
```

---

### Task 6: README + merge to staging

**Files:**
- Modify: `app/README.md` (YAML shape + URL scheme)

- [ ] **Step 1: Document**

- Each issue has `key` (UUID) and `id` (display)
- Links: `#/issue/<key>`
- Do not hand-edit `key`

- [ ] **Step 2: Final smoke**

Presentation + editor paths from Tasks 4–5 once more after hard refresh (`cache: 'no-store'` already on presentation fetches).

- [ ] **Step 3: Merge feature → staging**

```bash
git checkout staging
git merge feature/issue-reorder-renumber
```

Do **not** merge to `main` until Merge 1 is approved.

- [ ] **Step 4: Commit README on branch before merge if not done**

```bash
git add app/README.md
git commit -m "Document Issue key in app README."
```

---

## After Merge 1 (Merge 2 — separate plan later)

- Phase-grouped Issues sidebar
- Drag within Phase / across Phases when filter = All phases
- Compact display Issue ids on drop + delete
- Phase dropdown → append to target Phase + Compact
- New Issue → append + Compact
- Autosave after Compact; update selection to same Issue key

Do not start Merge 2 until Merge 1 is merged to staging and smoke-checked.

---

## Out of scope (Merge 1)

- Drag-and-drop
- Compact / renumber display ids
- Soft URL fallback for old display ids
- Automated test harness
