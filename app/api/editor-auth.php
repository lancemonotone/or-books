<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

editor_start_session();
editor_require_enabled();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $authenticated = editor_authenticated();
    $csrf = $authenticated ? editor_csrf_token() : null;
    editor_release_session();
    respond_json(200, [
        'authenticated' => $authenticated,
        'csrf' => $csrf,
        'files' => EDITOR_FILES,
    ]);
}

if ($method !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
$action = trim((string) ($body['action'] ?? 'login'));

if ($action === 'logout') {
    editor_require_auth();
    editor_verify_csrf($body['csrf'] ?? null);
    editor_logout();
    respond_json(200, ['ok' => true]);
}

if ($action !== 'login') {
    respond_json(400, ['error' => 'Unknown action.']);
}

editor_verify_honeypot($body['website'] ?? null);
$password = (string) ($body['password'] ?? '');

if (!editor_attempt_login($password, null)) {
    respond_json(401, ['error' => 'Wrong password.']);
}

respond_json(200, [
    'ok' => true,
    'csrf' => editor_csrf_token(),
]);
