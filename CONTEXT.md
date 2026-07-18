# OR Books Mobile Review

Standalone audit presentation with collaborative Edit mode for the OR Books mobile UX review.

## Language

**Task**:
A discrete finding in the review, shown to the client with problem, suggestion, status, and linked media.
_Avoid_: Note, ticket, bug, Issue

**Task id**:
The public label for a Task in `phase.sequence` form (for example `1.3`). Within each Phase, sequence is always dense and matches list order; it is rewritten when Tasks are reordered or deleted.
_Avoid_: Slug, key (the stable technical identity is Task key)

**Task key**:
A stable unique identifier for a Task that never changes when Compact rewrites the Task id. Used for lasting references (URLs, comments, evidence links, decision blocks, editor deep links).
_Avoid_: UUID as the spoken product name; do not call this Task id

**Phase**:
A numbered work bundle in the review plan (for example Urgent fixes). A Task belongs to exactly one Phase.
_Avoid_: Sprint (UI says Phase; YAML may still use `sprint`)

**Compact**:
Rewriting Task ids in a Phase to `phase.1…phase.n` in current list order with no gaps.
_Avoid_: Reindex, renumber pass (prefer Compact when discussing the dense rewrite)

**Task order**:
The sequence of Tasks within a Phase in the editor sidebar and in `tasks.yaml`. Compact makes Task ids match this order. Across Phases, Tasks stay grouped by Phase in plan order.

**Deferred**:
A Task status meaning the client does not want the recommended work (often signaled by comments to that effect). Deferred Tasks are shown on the Estimate page side line but are never included in Done, Remaining, or Grand totals. Set by judgment from comments and scope — not from a Yes/No control.
_Avoid_: Blocked

**Blocked** (status):
Waiting on you — a Questions answer or other client gate. Work is still intended and stays in the Estimate quote (Remaining / Grand). Do not rename Blocked Tasks to Deferred.
_Avoid_: Deferred

**Estimate hours**:
Optional planned effort on a Task (`hours` in YAML). Dollar amount is hours × configured hourly rate.
_Avoid_: Story points, effort band

**Actual hours**:
Optional burn roll-up on a Task (`actual_hours`), entered manually from an external time tracker — not a timesheet log inside this app.
_Avoid_: Time entry, timesheet row

**Done / Remaining / Grand** (Estimate page):
Done = complete Tasks; Remaining = planned + in progress + blocked; Grand = Done + Remaining. Deferred is separate and not quoted.
