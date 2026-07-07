# Screen recording notes

**Status:** Partial — 1 of 4 reviewed

---

## `123119.mp4`

**Context:** In the Media list (Meet Mayor Mamdani coverage)  
**Still frame:** `161238.png`

### Interaction observed

| Step | Behavior | Problem |
|------|----------|---------|
| 1 | User taps a media list item | Expected: navigate to article/book page |
| 2 | UI shows a **"Read Now"** button overlay on the item | Extra tap; blocks preview of content behind overlay |
| 3 | User must tap again to proceed | Friction; non-standard mobile list pattern |

### Recommendation

- List rows should navigate directly on first tap (whole row is the link).
- If a CTA is required, use inline text link styling — not a modal overlay on the card.
- Relates to squished card images in `123202` / `123215` — same In the Media component.

**Roadmap:** Task 1.8

---

## Pending review

| File | Topic (guess) |
|------|----------------|
| `122948.mp4` | — |
| `123547.mp4` | — |
| `123929.mp4` | — |
