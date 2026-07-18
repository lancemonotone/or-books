<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

editor_start_session();
editor_require_admin();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

editor_release_session();
respond_json(200, editor_load_audit_log());
