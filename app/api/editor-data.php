<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

editor_start_session();
editor_require_admin();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    editor_release_session();
    $file = trim((string) ($_GET['file'] ?? ''));
    if ($file === '') {
        respond_json(200, ['files' => EDITOR_FILES]);
    }

    respond_json(200, [
        'file' => $file,
        'content' => editor_read_yaml($file),
    ]);
}

if ($method !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
editor_verify_honeypot($body['website'] ?? null);
editor_verify_csrf($body['csrf'] ?? null);
editor_release_session();

$file = trim((string) ($body['file'] ?? ''));
$content = (string) ($body['content'] ?? '');

if ($file === '') {
    respond_json(422, ['error' => 'file is required.']);
}

try {
    editor_write_yaml($file, $content);
} catch (Throwable $e) {
    respond_json(500, ['error' => 'Could not save file.']);
}

editor_log_activity('editor.save', ['file' => $file]);
respond_json(200, [
    'ok' => true,
    'file' => $file,
    'savedAt' => gmdate('c'),
]);
