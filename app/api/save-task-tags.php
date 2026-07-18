<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

const ISSUE_TAG_MAX_LENGTH = 40;
const ISSUE_TAG_MAX_COUNT = 30;

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
$rawTags = $body['tags'] ?? null;

if ($taskKey === '') {
    respond_json(422, ['error' => 'taskKey is required.']);
}

if (!is_array($rawTags)) {
    respond_json(422, ['error' => 'tags must be an array.']);
}

$tags = normalize_issue_tags($rawTags);

$path = editor_data_path('tasks');
if (!file_exists($path)) {
    respond_json(404, ['error' => 'Tasks file not found.']);
}

/*
 * Lock a sidecar file, not tasks.yaml itself.
 * Windows denies rename() onto a path that still has an open handle (code 5).
 */
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

    $updated = update_task_tags_yaml($content, $taskKey, $tags);
    editor_write_yaml('tasks', $updated);
} finally {
    flock($lock, LOCK_UN);
    fclose($lock);
}

editor_log_activity('task.tags', ['taskKey' => $taskKey]);
respond_json(200, [
    'ok' => true,
    'taskKey' => $taskKey,
    'tags' => $tags,
    'savedAt' => gmdate('c'),
]);

/**
 * @param list<mixed> $rawTags
 * @return list<string>
 */
function normalize_issue_tags(array $rawTags): array
{
    $tags = [];
    $seen = [];

    foreach ($rawTags as $raw) {
        if (!is_string($raw) && !is_int($raw) && !is_float($raw)) {
            respond_json(422, ['error' => 'Invalid tag.']);
        }

        $tag = trim(preg_replace('/\s+/u', ' ', (string) $raw) ?? '');
        if ($tag === '') {
            continue;
        }

        if (str_contains($tag, "\n") || str_contains($tag, "\r")) {
            respond_json(422, ['error' => 'Invalid tag.']);
        }

        $length = function_exists('mb_strlen') ? mb_strlen($tag) : strlen($tag);
        if ($length > ISSUE_TAG_MAX_LENGTH) {
            respond_json(422, ['error' => 'Tag is too long.']);
        }

        $key = function_exists('mb_strtolower') ? mb_strtolower($tag) : strtolower($tag);
        if (isset($seen[$key])) {
            continue;
        }
        $seen[$key] = true;
        $tags[] = $tag;
    }

    if (count($tags) > ISSUE_TAG_MAX_COUNT) {
        respond_json(422, ['error' => 'Too many tags.']);
    }

    return $tags;
}

function yaml_tag_scalar(string $tag): string
{
    if (preg_match('/^[A-Za-z0-9](?:[A-Za-z0-9 ._\/-]*[A-Za-z0-9])?$/', $tag)) {
        return $tag;
    }

    return "'" . str_replace("'", "''", $tag) . "'";
}

/**
 * @param list<string> $tags
 */
function format_tags_yaml_block(array $tags, string $indent): string
{
    if ($tags === []) {
        return $indent . "tags: []\n";
    }

    $out = $indent . "tags:\n";
    foreach ($tags as $tag) {
        $out .= $indent . '  - ' . yaml_tag_scalar($tag) . "\n";
    }

    return $out;
}

/**
 * Replace tags inside the YAML block for one issue key.
 * Preserves the rest of the file as-is (no full re-dump).
 *
 * @param list<string> $tags
 */
function update_task_tags_yaml(string $content, string $taskKey, array $tags): string
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

        $indent = '  ';
        if (preg_match('/^([ \t]+)(?:priority|status|title):/m', $part, $indentMatch)) {
            $indent = $indentMatch[1];
        }
        $block = format_tags_yaml_block($tags, $indent);

        $count = 0;
        $part = preg_replace(
            '/^[ \t]*tags:[ \t]*\[[^\]]*\][ \t]*\R?/m',
            $block,
            $part,
            1,
            $count
        );
        if (!is_string($part)) {
            respond_json(500, ['error' => 'Could not update tags for this issue.']);
        }

        if ($count !== 1) {
            $part = preg_replace(
                '/^[ \t]*tags:[ \t]*\R(?:[ \t]+-[ \t]*.+\R)*/m',
                $block,
                $part,
                1,
                $count
            );
            if (!is_string($part)) {
                respond_json(500, ['error' => 'Could not update tags for this issue.']);
            }
        }

        if ($count !== 1) {
            $part = preg_replace(
                '/^([ \t]*status:\s*\S+[ \t]*\R)/m',
                '$1' . $block,
                $part,
                1,
                $count
            );
            if (!is_string($part) || $count !== 1) {
                respond_json(500, ['error' => 'Could not update tags for this issue.']);
            }
        }
        break;
    }
    unset($part);

    if (!$found) {
        respond_json(404, ['error' => 'Issue not found.']);
    }

    return implode('', $parts);
}
