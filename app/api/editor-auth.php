<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

editor_start_session();
editor_require_enabled();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    if (editor_authenticated()) {
        $email = editor_session_email();
        $valid = $email !== '';
        if ($valid && !editor_is_admin_email($email)) {
            $valid = editor_email_on_team($email) && editor_find_user($email) !== null;
        }
        if (!$valid) {
            editor_logout();
        }
    }

    $status = editor_auth_status_payload();
    $authenticated = $status['authenticated'];
    $csrf = $authenticated ? editor_csrf_token() : null;
    editor_release_session();
    respond_json(200, array_merge($status, [
        'csrf' => $csrf,
        'files' => EDITOR_FILES,
        'hourlyRate' => $authenticated ? editor_hourly_rate() : null,
        'vendor' => $authenticated ? editor_vendor() : null,
    ]));
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

if ($action === 'change_password') {
    editor_require_auth();
    editor_verify_csrf($body['csrf'] ?? null);
    editor_verify_honeypot($body['website'] ?? null);
    editor_change_password(
        (string) ($body['currentPassword'] ?? ''),
        (string) ($body['newPassword'] ?? ''),
        (string) ($body['confirmPassword'] ?? '')
    );
    respond_json(200, array_merge(
        ['ok' => true, 'csrf' => editor_csrf_token()],
        editor_auth_status_payload()
    ));
}

if ($action !== 'login') {
    respond_json(400, ['error' => 'Unknown action.']);
}

editor_verify_honeypot($body['website'] ?? null);
$email = (string) ($body['email'] ?? '');
$password = (string) ($body['password'] ?? '');

if (!editor_attempt_login($email, $password, null)) {
    respond_json(401, ['error' => 'Wrong email or password.']);
}

respond_json(200, array_merge(
    [
        'ok' => true,
        'csrf' => editor_csrf_token(),
        'hourlyRate' => editor_hourly_rate(),
        'vendor' => editor_vendor(),
    ],
    editor_auth_status_payload()
));
