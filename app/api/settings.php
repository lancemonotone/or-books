<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';
require_once __DIR__ . '/settings-lib.php';

editor_start_session();
editor_require_auth();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    editor_release_session();
    respond_json(200, load_settings());
}

if ($method !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
editor_verify_honeypot($body['website'] ?? null);
editor_verify_csrf($body['csrf'] ?? null);
editor_release_session();

$normalized = normalize_settings($body);

try {
    save_settings($normalized);
} catch (Throwable $e) {
    respond_json(500, ['error' => 'Could not save settings.']);
}

respond_json(200, $normalized);
