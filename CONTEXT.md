# OR Books Mobile Review

Standalone audit presentation and password-gated content editor for the OR Books mobile UX review.

## Language

**Issue**:
A discrete finding in the review, shown to the client with problem, suggestion, status, and linked media.
_Avoid_: Note, ticket, bug

**Issue id**:
The public label for an Issue in `phase.sequence` form (for example `1.3`). Within each Phase, sequence is always dense and matches list order; it is rewritten when Issues are reordered or deleted.
_Avoid_: Slug, key (the stable technical identity is Issue key)

**Issue key**:
A stable unique identifier for an Issue that never changes when Compact rewrites the Issue id. Used for lasting references (URLs, comments, evidence links, decision blocks, editor deep links).
_Avoid_: UUID as the spoken product name; do not call this Issue id

**Phase**:
A numbered work bundle in the review plan (for example Urgent fixes). An Issue belongs to exactly one Phase.
_Avoid_: Sprint (UI says Phase; YAML may still use `sprint`)

**Compact**:
Rewriting Issue ids in a Phase to `phase.1…phase.n` in current list order with no gaps.
_Avoid_: Reindex, renumber pass (prefer Compact when discussing the dense rewrite)

**Issue order**:
The sequence of Issues within a Phase in the editor sidebar and in `issues.yaml`. Compact makes Issue ids match this order. Across Phases, Issues stay grouped by Phase in plan order.

**Deferred**:
An Issue status meaning the client does not want the recommended work (often signaled by a No / disagree stance or comments to that effect). Deferred Issues are shown on the Estimate page side line but are never included in Done, Remaining, or Grand totals. Set by judgment — stance alone is not always enough.
_Avoid_: Blocked

**Blocked** (status):
Waiting on you — a Questions answer or other client gate. Work is still intended and stays in the Estimate quote (Remaining / Grand). Do not rename Blocked Issues to Deferred.
_Avoid_: Deferred

**Estimate hours**:
Optional planned effort on an Issue (`hours` in YAML). Dollar amount is hours × configured hourly rate.
_Avoid_: Story points, effort band

**Actual hours**:
Optional burn roll-up on an Issue (`actual_hours`), entered manually from an external time tracker — not a timesheet log inside this app.
_Avoid_: Time entry, timesheet row

**Done / Remaining / Grand** (Estimate page):
Done = complete Issues; Remaining = planned + in progress + blocked; Grand = Done + Remaining. Deferred is separate and not quoted.
