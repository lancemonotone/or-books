# Multi-user auth design

Approved brainstorm (2026-07-17). Implementation: `docs/superpowers/plans/2026-07-17-multi-user-auth.md`.

## Problem

The review app and content editor share one plaintext `editor_password`. Anyone signed in can use Settings and the editor. There are no per-user accounts or hashed passwords. `admin_email` in config was unused.

## Goals

- Email + password login for all accounts.
- **Admin** (`admin_email` in `config.php` only): Settings + user provisioning + content editor + review app.
- **User** (team member with an auth row): review app only — not Settings, not `/edit/`.
- Admin sets a temporary password in Settings (email must already be on a team). First login forces password change. Users can change password later.
- No auth emails (no invite / reset / magic link). Existing notify mail is unrelated.

## Decisions

| Topic | Choice |
|-------|--------|
| Admin identity | `admin_email` in config only (not editable in Settings) |
| User provision | Temp password in Settings; email must be a team member |
| First login | Temp password → `mustChangePassword` |
| Admin bootstrap | `admin_email` + `editor_password` until admin stores a hash; then config password ignored |
| Credential store | `data/responses/users.json` (never returned with password hashes) |
| Remove team member | Delete matching auth row; login requires still on team (admins exempt) |
| Approach | Evolve `editor-lib` / `editor-auth` (keep session, CSRF, lockout) |

## Roles

| Role | Review | Settings | Editor APIs / `/edit/` |
|------|--------|----------|-------------------------|
| Admin | yes | yes | yes |
| User | yes | 403 | 403 / blocked UI |

Role is derived: email matches `admin_email` → admin; else user.

## Data: `users.json`

```json
{
  "users": [
    {
      "email": "person@example.com",
      "passwordHash": "<password_hash>",
      "mustChangePassword": true
    }
  ]
}
```

- Emails normalized (trim + lowercase).
- Temp passwords hashed immediately with `password_hash(PASSWORD_DEFAULT)`.
- Admin may have a row after changing password (hash handoff).

## Login flow

1. POST email + password (+ honeypot).
2. If admin email: verify users.json hash if present; else `hash_equals` vs `editor_password`.
3. Else: must be on a Settings team **and** have a users.json row; `password_verify`.
4. Failures use existing lockout.
5. Session stores authenticated + email; role derived on read.

## Settings (admin)

- UI and **POST** are admin-only.
- **GET** is available to all signed-in users (needed for brand `clientName` and author-name pickers). Auth status flags (`hasLogin`, `mustChangePassword`) are only attached for admin GETs.
- Per member: set or reset temporary login password; status `hasLogin` / `mustChangePassword` only.
- Saving teams prunes auth rows for emails no longer on any team (never prune admin hash solely for not being on a team).

## Out of scope

Auth emails, OAuth, WordPress users, forgot-password mail, renaming `editor_*` symbols, gating raw `/media/` URLs beyond current behavior.
