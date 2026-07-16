<?php

declare(strict_types=1);

/**
 * Copy to config.php and set editor_password.
 * Same password gates the review app and the content editor.
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

    'notify' => [
        /** Hard off even when Settings has notify enabled. */
        'enabled' => true,
        /** From header for PHP mail(), e.g. Review <noreply@example.com> */
        'from' => '',
        /** Shared secret for notify-flush.php?secret=… cron hits. */
        'flush_secret' => '',
    ],
];
