# Multi-user auth implementation plan

> **For agentic workers:** Use superpowers:executing-plans or subagent-driven-development task-by-task.

**Goal:** Email+password auth with admin vs user roles; hashed passwords; admin provisions temp passwords in Settings (no email sends).

**Architecture:** Evolve existing PHP session/CSRF/lockout in `app/api/editor-lib.php`. Store hashes in `users.json` beside settings. Role = email matches `config.admin_email` → admin; else user if on a Settings team + auth row.

**Tech stack:** PHP sessions, `password_hash` / `password_verify`, JSON file store, existing review/editor JS.

See design: `docs/superpowers/specs/2026-07-17-multi-user-auth-design.md`.

## Tasks

1. Spec + config contract (`admin_email`, `editor_enabled` rules, README)
2. users.json + auth core in editor-lib
3. editor-auth API (email login, change_password, status fields)
4. Settings admin-only + temp password + prune
5. Review app UI
6. Editor UI
7. Manual verify

## Out of scope

Auth emails, OAuth, WP users, forgot-password mail, renaming `editor_*`, gating raw `/media/` files beyond current behavior.
