<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

const ISSUE_PRIORITIES = ['critical', 'high', 'medium', 'low'];

editor_start_session();
editor_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
editor_verify_honeypot($body['website'] ?? null);
editor_verify_csrf($body['csrf'] ?? null);
editor_release_session();

$issueKey = trim((string) ($body['issueKey'] ?? ''));
$priority = trim((string) ($body['priority'] ?? ''));

if ($issueKey === '') {
    respond_json(422, ['error' => 'issueKey is required.']);
}

if (!in_array($priority, ISSUE_PRIORITIES, true)) {
    respond_json(422, ['error' => 'Invalid priority.']);
}

$path = editor_data_path('issues');
if (!file_exists($path)) {
    respond_json(404, ['error' => 'Issues file not found.']);
}

/*
 * Lock a sidecar file, not issues.yaml itself.
 * Windows denies rename() onto a path that still has an open handle (code 5).
 */
$lockPath = $path . '.lock';
$lock = fopen($lockPath, 'c+');
if ($lock === false) {
    respond_json(500, ['error' => 'Could not lock issues file.']);
}

try {
    if (!flock($lock, LOCK_EX)) {
        respond_json(500, ['error' => 'Could not lock issues file.']);
    }

    $content = file_get_contents($path);
    if ($content === false) {
        respond_json(500, ['error' => 'Could not read issues file.']);
    }

    $updated = update_issue_priority_yaml($content, $issueKey, $priority);
    editor_write_yaml('issues', $updated);
} finally {
    flock($lock, LOCK_UN);
    fclose($lock);
}

editor_log_activity('issue.priority', ['issueKey' => $issueKey, 'priority' => $priority]);
respond_json(200, [
    'ok' => true,
    'issueKey' => $issueKey,
    'priority' => $priority,
    'savedAt' => gmdate('c'),
]);

/**
 * Replace priority inside the YAML block for one issue key.
 * Preserves the rest of the file as-is (no full re-dump).
 */
function update_issue_priority_yaml(string $content, string $issueKey, string $priority): string
{
    $escapedKey = preg_quote($issueKey, '/');
    $parts = preg_split('/(?=^- key:)/m', $content);
    if ($parts === false) {
        respond_json(500, ['error' => 'Could not parse issues file.']);
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
            '/^([ \t]*)priority:\s*\S+[ \t]*\r?$/m',
            '${1}priority: ' . $priority,
            $part,
            1,
            $count
        );
        if (!is_string($part) || $count !== 1) {
            respond_json(500, ['error' => 'Could not update priority for this issue.']);
        }
        break;
    }
    unset($part);

    if (!$found) {
        respond_json(404, ['error' => 'Issue not found.']);
    }

    return implode('', $parts);
}
