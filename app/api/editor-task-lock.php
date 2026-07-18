<?php

declare(strict_types=1);

require __DIR__ . '/task-lock-lib.php';

editor_start_session();
editor_require_auth();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $taskKey = trim((string) ($_GET['taskKey'] ?? ''));
    editor_release_session();
    if ($taskKey === '') {
        respond_json(422, ['error' => 'taskKey is required.']);
    }
    $lock = task_lock_get($taskKey);
    respond_json(200, [
        'lock' => task_lock_public($lock, $taskKey),
    ]);
}

if ($method !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
editor_verify_honeypot(isset($body['website']) && is_string($body['website']) ? $body['website'] : null);
editor_verify_csrf(isset($body['csrf']) && is_string($body['csrf']) ? $body['csrf'] : null);

$action = trim((string) ($body['action'] ?? ''));
$taskKey = trim((string) ($body['taskKey'] ?? ''));
editor_release_session();

switch ($action) {
    case 'claim':
        respond_json(200, task_lock_claim($taskKey, false));
    case 'takeover':
        respond_json(200, task_lock_claim($taskKey, true));
    case 'heartbeat':
        respond_json(200, task_lock_heartbeat($taskKey));
    case 'release':
        respond_json(200, task_lock_release($taskKey));
    default:
        respond_json(422, ['error' => 'Unknown action.']);
}
