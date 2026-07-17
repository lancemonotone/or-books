<?php

declare(strict_types=1);

/**
 * Copy to config.php (same folder) and set editor_password.
 * Same password gates the review app and the content editor.
 *
 * Path: repo root (sibling to app/). PHP loads it from app/api via dirname.
 *
 * Notification secrets stay here; team lists and client name live in Settings (settings.json).
 */
return [
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
