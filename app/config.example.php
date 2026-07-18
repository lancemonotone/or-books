<?php

declare(strict_types=1);

/**
 * Copy to config.php (same folder) and set admin_email + editor_password.
 *
 * Auth: email + password. admin_email is the only admin (Settings + content editor).
 * editor_password is the admin bootstrap password until the admin sets a hashed
 * password in the app; after that, the config password is ignored for login.
 *
 * Path: app/ (alongside index.html). PHP loads it from app/api via dirname(__DIR__).
 *
 * Notification secrets stay here; team lists and client name live in Settings (settings.json).
 * User password hashes live in data/responses/users.json (not here).
 */
return [
    /** Required. Only this address is admin (not editable in Settings). */
    'admin_email' => '',

    /**
     * Admin bootstrap password (plaintext). Used only when admin has no hash in users.json.
     * Leave empty after admin has set a password in the app (or keep as offline recovery:
     * clear the admin row in users.json to re-enable this value).
     */
    'editor_password' => '',
    'editor_session_days' => 30,

    /** Public base URL of this app (trailing slash OK), used in notification links. */
    'app_public_url' => '',

    /**
     * USD hourly rate for Issue estimate/actual $ (optional).
     * Omit or set null when unset — presentation must not invent a default.
     */
    'hourly_rate' => null,

    /**
     * Your details for the estimate PDF header (optional).
     * Omit or leave blank lines out of the print — Fail Fast, no invented copy.
     * logo: path relative to the app folder, e.g. assets/vendor-logo.png
     */
    'vendor' => [
        'name' => '',
        'business' => '',
        'address' => '',
        'email' => '',
        'phone' => '',
        'logo' => 'assets/img/vendor-logo.png',
    ],

    'notify' => [
        /** Hard off even when Settings has notify enabled. */
        'enabled' => true,
        /** From header for PHP mail(), e.g. Review <noreply@example.com> */
        'from' => '',
        /** Shared secret for notify-flush.php?secret=… cron hits. */
        'flush_secret' => '',
        /**
         * Optional BCC for immediate notifies only (not digests).
         * Skipped when this address is already in the To list.
         */
        'bcc' => '',
    ],
];
