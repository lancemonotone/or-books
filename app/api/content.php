<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

editor_start_session();
editor_require_auth();
editor_release_session();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$file = trim((string) ($_GET['file'] ?? ''));
if ($file === '') {
    respond_json(422, ['error' => 'file is required.']);
}

respond_json(200, [
    'file' => $file,
    'content' => editor_read_yaml($file),
]);
