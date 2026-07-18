<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';
require_once __DIR__ . '/task-lock-lib.php';

editor_start_session();
editor_require_auth();

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
$isAdmin = editor_session_role() === 'admin';
$role = editor_session_role();
editor_release_session();

$file = trim((string) ($body['file'] ?? ''));
$content = (string) ($body['content'] ?? '');

if ($file === '') {
    respond_json(422, ['error' => 'file is required.']);
}

if ($file === 'tasks') {
    if (!$isAdmin) {
        // Non-admin cannot change hours / actual_hours.
        $content = editor_restore_task_hours_from_disk($content);
    } else {
        // Admin full-dumps can omit hours by accident — block mass wipe.
        $content = editor_guard_task_hours_mass_wipe($content);
    }
    // Keep other users' locked task blocks from disk (Author full-dump safety).
    $content = editor_merge_tasks_respecting_locks($content);
}

if (!$isAdmin && $file === 'audit') {
    $content = editor_restore_audit_admin_fields_from_disk($content);
}

try {
    editor_write_yaml($file, $content);
} catch (Throwable $e) {
    respond_json(500, ['error' => 'Could not save file.']);
}

editor_log_activity('editor.save', ['file' => $file, 'role' => $role]);
respond_json(200, [
    'ok' => true,
    'file' => $file,
    'savedAt' => gmdate('c'),
]);

/**
 * When another session holds a task lock, keep that task's YAML block from disk
 * so Author full-dumps cannot clobber their in-progress edits.
 */
function editor_merge_tasks_respecting_locks(string $incoming): string
{
    $locks = task_locks_active_map();
    $foreignKeys = [];
    foreach ($locks as $taskKey => $lock) {
        if (task_lock_is_foreign($lock)) {
            $foreignKeys[$taskKey] = true;
        }
    }
    if ($foreignKeys === []) {
        return $incoming;
    }

    $diskBlocks = editor_task_yaml_blocks(editor_read_yaml('tasks'));
    $incomingBlocks = editor_task_yaml_blocks($incoming);

    $orderedKeys = array_keys($incomingBlocks);
    foreach (array_keys($diskBlocks) as $taskKey) {
        if (!isset($incomingBlocks[$taskKey]) && isset($foreignKeys[$taskKey])) {
            $orderedKeys[] = $taskKey;
        }
    }

    $out = [];
    $seen = [];
    foreach ($orderedKeys as $taskKey) {
        if (isset($seen[$taskKey])) {
            continue;
        }
        $seen[$taskKey] = true;

        if (isset($foreignKeys[$taskKey]) && isset($diskBlocks[$taskKey])) {
            $out[] = $diskBlocks[$taskKey];
            continue;
        }
        if (isset($incomingBlocks[$taskKey])) {
            $out[] = $incomingBlocks[$taskKey];
            continue;
        }
        if (isset($diskBlocks[$taskKey])) {
            $out[] = $diskBlocks[$taskKey];
        }
    }

    return implode('', $out);
}

/**
 * @return array<string, string> taskKey => yaml block (including trailing newline)
 */
function editor_task_yaml_blocks(string $content): array
{
    $parts = preg_split('/(?=^- key:)/m', $content);
    if ($parts === false) {
        respond_json(500, ['error' => 'Could not parse tasks file.']);
    }

    $blocks = [];
    foreach ($parts as $part) {
        if ($part === '' || !preg_match('/^- key:\s*(.+)\s*$/m', $part, $keyMatch)) {
            continue;
        }
        $key = trim($keyMatch[1], " \t\"'");
        if ($key === '') {
            continue;
        }
        $blocks[$key] = str_ends_with($part, "\n") ? $part : $part . "\n";
    }

    return $blocks;
}

/**
 * Non-admin cannot change hours / actual_hours. Restore per-task values from disk.
 * New tasks (no disk match) get hours fields stripped.
 */
function editor_restore_task_hours_from_disk(string $incoming): string
{
    $existing = editor_read_yaml('tasks');
    $hoursMap = editor_task_hours_map($existing);

    $parts = preg_split('/(?=^- key:)/m', $incoming);
    if ($parts === false) {
        respond_json(500, ['error' => 'Could not parse tasks file.']);
    }

    foreach ($parts as &$part) {
        if ($part === '' || !preg_match('/^- key:\s*(.+)\s*$/m', $part, $keyMatch)) {
            continue;
        }
        $key = trim($keyMatch[1], " \t\"'");
        $part = editor_strip_task_hours_lines($part);
        if (isset($hoursMap[$key])) {
            $part = editor_inject_task_hours_lines($part, $hoursMap[$key]);
        }
    }
    unset($part);

    return implode('', $parts);
}

/**
 * Admin Author saves rewrite the whole tasks file from browser memory.
 * If that payload has zero hours but disk still has some, treat as accidental
 * wipe and restore. Per-task clears still work when other tasks keep hours.
 */
function editor_guard_task_hours_mass_wipe(string $incoming): string
{
    $existing = editor_read_yaml('tasks');
    if (!editor_yaml_has_any_task_hours($existing)) {
        return $incoming;
    }
    if (editor_yaml_has_any_task_hours($incoming)) {
        return $incoming;
    }

    return editor_restore_task_hours_from_disk($incoming);
}

function editor_yaml_has_any_task_hours(string $content): bool
{
    return (bool) preg_match('/^[ \t]*(?:hours|actual_hours):[ \t]*\S/m', $content);
}

/**
 * @return array<string, array{hours:?string, actual_hours:?string}>
 */
function editor_task_hours_map(string $content): array
{
    $parts = preg_split('/(?=^- key:)/m', $content);
    if ($parts === false) {
        return [];
    }

    $map = [];
    foreach ($parts as $part) {
        if ($part === '' || !preg_match('/^- key:\s*(.+)\s*$/m', $part, $keyMatch)) {
            continue;
        }
        $key = trim($keyMatch[1], " \t\"'");
        $map[$key] = [
            'hours' => editor_read_task_scalar_line($part, 'hours'),
            'actual_hours' => editor_read_task_scalar_line($part, 'actual_hours'),
        ];
    }

    return $map;
}

function editor_read_task_scalar_line(string $block, string $field): ?string
{
    if (!preg_match('/^[ \t]*' . preg_quote($field, '/') . ':[ \t]*.*\r?$/m', $block, $match)) {
        return null;
    }
    return $match[0];
}

function editor_strip_task_hours_lines(string $block): string
{
    $stripped = preg_replace('/^[ \t]*(?:hours|actual_hours):[ \t]*.*\r?\n?/m', '', $block);
    return is_string($stripped) ? $stripped : $block;
}

/**
 * @param array{hours:?string, actual_hours:?string} $hours
 */
function editor_inject_task_hours_lines(string $block, array $hours): string
{
    $lines = [];
    if ($hours['hours'] !== null) {
        $lines[] = rtrim($hours['hours'], "\r\n");
    }
    if ($hours['actual_hours'] !== null) {
        $lines[] = rtrim($hours['actual_hours'], "\r\n");
    }
    if ($lines === []) {
        return $block;
    }

    $injection = implode("\n", $lines) . "\n";

    // Prefer after status:, else after priority:, else after id:.
    foreach (['status', 'priority', 'id'] as $anchor) {
        $count = 0;
        $updated = preg_replace(
            '/^([ \t]*' . preg_quote($anchor, '/') . ':[ \t]*.*\r?\n)/m',
            '${1}' . $injection,
            $block,
            1,
            $count
        );
        if (is_string($updated) && $count === 1) {
            return $updated;
        }
    }

    return $block . $injection;
}

/**
 * Non-admin cannot change Overview intro (summary) or updated stamp.
 */
function editor_restore_audit_admin_fields_from_disk(string $incoming): string
{
    $existing = editor_read_yaml('audit');
    $summary = editor_extract_top_level_field($existing, 'summary');
    $updated = editor_extract_top_level_field($existing, 'updated');

    if ($summary !== null) {
        $incoming = editor_replace_top_level_field($incoming, 'summary', $summary);
    }
    if ($updated !== null) {
        $incoming = editor_replace_top_level_field($incoming, 'updated', $updated);
    }

    return $incoming;
}

/**
 * Capture a top-level YAML field (scalar or block) including its key line.
 */
function editor_extract_top_level_field(string $content, string $field): ?string
{
    $pattern = '/^' . preg_quote($field, '/') . ':[ \t]*(?:\|[^\r\n]*)?\r?\n(?:[ \t]+.*(?:\r?\n|$))*/m';
    if (preg_match($pattern, $content, $match)) {
        return $match[0];
    }

    // Single-line scalar: updated: '2026-07-16'
    $scalar = '/^' . preg_quote($field, '/') . ':[ \t]*.*\r?\n?/m';
    if (preg_match($scalar, $content, $match)) {
        return $match[0];
    }

    return null;
}

function editor_replace_top_level_field(string $content, string $field, string $replacement): string
{
    $pattern = '/^' . preg_quote($field, '/') . ':[ \t]*(?:\|[^\r\n]*)?\r?\n(?:[ \t]+.*(?:\r?\n|$))*/m';
    $count = 0;
    $updated = preg_replace($pattern, $replacement, $content, 1, $count);
    if (is_string($updated) && $count === 1) {
        return $updated;
    }

    $scalar = '/^' . preg_quote($field, '/') . ':[ \t]*.*\r?\n?/m';
    $count = 0;
    $updated = preg_replace($scalar, $replacement, $content, 1, $count);
    if (is_string($updated) && $count === 1) {
        return $updated;
    }

    return $content;
}
