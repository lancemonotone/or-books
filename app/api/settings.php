<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';
require_once __DIR__ . '/settings-lib.php';

editor_start_session();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    // All signed-in users need clientName + team names (author picker / brand).
    // Settings UI and writes remain admin-only.
    editor_require_auth();
    editor_release_session();
    $settings = load_settings();
    if (editor_session_role() === 'admin') {
        $settings = editor_enrich_settings_auth_status($settings);
    }
    respond_json(200, $settings);
}

if ($method !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

editor_require_admin();
$body = read_request_json();
editor_verify_honeypot($body['website'] ?? null);
editor_verify_csrf($body['csrf'] ?? null);
editor_release_session();

$normalized = normalize_settings($body);

try {
    save_settings($normalized);
    editor_apply_settings_auth($body, $normalized);
} catch (Throwable $e) {
    respond_json(500, ['error' => 'Could not save settings.']);
}

editor_log_activity('settings.save');
respond_json(200, editor_enrich_settings_auth_status(load_settings()));
