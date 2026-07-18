# Per-task Author locks (WordPress-style takeover)

> **For agentic workers:** Implement task-by-task. Steps use checkbox syntax. No TDD (project rule).

**Goal:** Stop silent clobber when two people Author-edit at once, using per-task soft locks + takeover, while keeping status/priority/tags/phase chips lock-free.

**Architecture:** Lock records in `app/data/responses/task-locks.json` keyed by task UUID. Claim/heartbeat/release/takeover via `api/editor-task-lock.php`. Task detail Author UI respects foreign locks (read-only author fields + Take over). On any `tasks` YAML POST, merge per task: blocks locked by another session stay from disk; caller’s/unlocked blocks use incoming.

**Tech Stack:** PHP session email + `session_id()`, JSON lock file with `flock`, existing Author presentation JS.

## Global Constraints

- Fail Fast: no invented collaborator names — use session email (optional team name if already in settings).
- Field chip APIs stay lock-free.
- Lock TTL 120s; client heartbeat ~40s.
- Mass-hours wipe guard stays.

---

### Task 1: Lock storage + API

**Files:**
- Create `app/api/task-lock-lib.php`
- Create `app/api/editor-task-lock.php`

- [ ] Lock file path beside `users.json` (`responses/task-locks.json`)
- [ ] Shape: `{ "locks": { "<taskKey>": { "email", "sessionId", "expiresAt" } } }`
- [ ] Expire stale on read; `flock` on write
- [ ] Actions: `claim`, `heartbeat`, `release`, `takeover`, GET status
- [ ] `claim` / `heartbeat` require auth; foreign lock → 409 unless `takeover`

### Task 2: Merge locked tasks on YAML save

**Files:**
- Modify `app/api/editor-data.php`

- [ ] After hours guards, if `$file === 'tasks'`: merge incoming with disk using lock map (other session → disk block)
- [ ] Re-insert disk-only keys still locked by others (prevent delete-while-locked)

### Task 3: Client claim / banner / takeover

**Files:**
- Create `app/assets/task-lock.js` (or fold into `author-mode.js`)
- Modify `app/assets/app.js`, `app/index.html` if script tag needed
- Modify `app/assets/styles.css` for banner

- [ ] When `editMode && route.name === 'task'`: claim; heartbeat interval; release on leave/edit-off/`pagehide`
- [ ] Banner: “{email} is editing this task” + Take over
- [ ] Foreign lock → author fields render read-only; chips stay editable
- [ ] Take over → POST takeover → re-render

### Task 4: Manual verify

- [ ] Two browsers / two accounts: A edits task, B sees banner; B takeover; A save blocked or A loses lock
- [ ] Different tasks: both can Author; saves don’t wipe the other (merge)
- [ ] Chips still save without claiming lock
- [ ] Asset violation scan on edited PHP

---

**Out of scope:** Live cursors, OT/CRDT, whole-app lock, evidence-page locks.
