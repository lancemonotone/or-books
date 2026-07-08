# Stable Issue key separate from display Issue id

Accepted. Issues need a permanent identity so Compact can rewrite `phase.sequence` labels without breaking evidence links, decision blocks, comments, or URLs.

We store a UUID as Issue key on each Issue and use that key for all lasting references. Issue id remains the human-facing label only. Soft fallback from old `#/issue/1.3` style hashes was rejected while the review is still unshared development.

Considered: remap display ids on every Compact; display-id-only forever; UUID in the URL with no separate label. Rejected as fragile or ugly for client-facing chips.
