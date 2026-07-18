<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

const ISSUE_STATUSES = ['planned', 'in_progress', 'blocked', 'deferred', 'complete'];

editor_start_session();
editor_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
editor_verify_honeypot($body['website'] ?? null);
editor_verify_csrf($body['csrf'] ?? null);
editor_release_session();

$taskKey = trim((string) ($body['taskKey'] ?? ''));
$status = trim((string) ($body['status'] ?? ''));

if ($taskKey === '') {
    respond_json(422, ['error' => 'taskKey is required.']);
}

if (!in_array($status, ISSUE_STATUSES, true)) {
    respond_json(422, ['error' => 'Invalid status.']);
}

$path = editor_data_path('tasks');
if (!file_exists($path)) {
    respond_json(404, ['error' => 'Tasks file not found.']);
}

$lockPath = $path . '.lock';
$lock = fopen($lockPath, 'c+');
if ($lock === false) {
    respond_json(500, ['error' => 'Could not lock tasks file.']);
}

try {
    if (!flock($lock, LOCK_EX)) {
        respond_json(500, ['error' => 'Could not lock tasks file.']);
    }

    $content = file_get_contents($path);
    if ($content === false) {
        respond_json(500, ['error' => 'Could not read tasks file.']);
    }

    $updated = update_task_status_yaml($content, $taskKey, $status);
    editor_write_yaml('tasks', $updated);
} finally {
    flock($lock, LOCK_UN);
    fclose($lock);
}

editor_log_activity('task.status', ['taskKey' => $taskKey, 'status' => $status]);
respond_json(200, [
    'ok' => true,
    'taskKey' => $taskKey,
    'status' => $status,
    'savedAt' => gmdate('c'),
]);

/**
 * Replace status inside the YAML block for one issue key.
 * Preserves the rest of the file as-is (no full re-dump).
 */
function update_task_status_yaml(string $content, string $taskKey, string $status): string
{
    $escapedKey = preg_quote($taskKey, '/');
    $parts = preg_split('/(?=^- key:)/m', $content);
    if ($parts === false) {
        respond_json(500, ['error' => 'Could not parse tasks file.']);
    }

    $found = false;
    foreach ($parts as &$part) {
        if ($part === '') {
            continue;
        }
        if (!preg_match('/^- key:\s*' . $escapedKey . '\s*$/m', $part)) {
            continue;
        }
        $found = true;
        $count = 0;
        $part = preg_replace(
            '/^([ \t]*)status:\s*\S+[ \t]*\r?$/m',
            '${1}status: ' . $status,
            $part,
            1,
            $count
        );
        if (!is_string($part) || $count !== 1) {
            respond_json(500, ['error' => 'Could not update status for this issue.']);
        }
        break;
    }
    unset($part);

    if (!$found) {
        respond_json(404, ['error' => 'Issue not found.']);
    }

    return implode('', $parts);
}
