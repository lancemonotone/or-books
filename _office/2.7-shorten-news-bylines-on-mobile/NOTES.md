# 2.7 — Shorten news bylines on mobile

<!-- Agent-oriented delivery memo. Not a build log. -->

## Meta

| Field | Value |
|-------|--------|
| **Briefboard id** | `2.7` |
| **taskKey** | `1c59053b-b5c4-4f94-8361-422f66dd6614` |
| **Briefboard URL** | https://lancemonotone.com/or-books/app/?i=1#/task/1c59053b-b5c4-4f94-8361-422f66dd6614 |
| **Branch** | `fix/wave1-2.7-news-byline-date-only` |
| **Commits** | `7ed3cba` Show news article date only; drop byline and hashtags. |
| **Deploy** | Local only until Wave 1 batch `stencil push` |

## Client ask (original)

Bylines read “Posted by [name] on [date]”. Posted by is redundant; long names wrap badly on small screens. Card suggested shorter name + date. Client comment: **Remove bylines and hashtags and keep the date.** **[P1]**

## Delivered (final state)

- News article header shows the publish date only (no “Posted by…”).
- Hashtag list under the article header is gone.
- News listing cards were already date-only; unchanged.

## Diverged from ask (if any)

| Original expectation | What we shipped | Why |
|--------------------|-----------------|-----|
| Shorter line with source name + date | Date only; no hashtags | Client P1 override on the card |

## Client action needed

- [ ] None until Wave 1 push; then spot-check a news article on phone width (date under title, no byline, no #tags).

## Verify

| Surface | Local URL | Look for |
|---------|-----------|----------|
| News article | `/news/the-inside-story-behind-new-yorks-first-democratic-socialist-mayor-run-zohran-run/` | Date only under title; no Posted by; no hashtags |

## Theme archive (rollback)

| Kind | Location |
|------|----------|
| Pre-change theme files | `templates-archive/` if first touch of path from baseline `9a14f93` |
| New files (delete to undo) | None |

## Screenshots / media

| File | Notes |
|------|--------|
| Briefboard `123327.png` / `161534.png` | Pre-fix reference on card |

## Related / follow-up

None.
