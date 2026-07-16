<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

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
$sprintRaw = $body['sprint'] ?? $body['phaseId'] ?? null;
$sprint = is_numeric($sprintRaw) ? (int) $sprintRaw : 0;

if ($issueKey === '') {
    respond_json(422, ['error' => 'issueKey is required.']);
}

if ($sprint < 1) {
    respond_json(422, ['error' => 'Invalid phase.']);
}

$auditPath = editor_data_path('audit');
if (!file_exists($auditPath)) {
    respond_json(404, ['error' => 'Audit file not found.']);
}

$auditContent = file_get_contents($auditPath);
if ($auditContent === false) {
    respond_json(500, ['error' => 'Could not read audit file.']);
}

$phaseIds = parse_audit_phase_ids($auditContent);
if (!in_array($sprint, $phaseIds, true)) {
    respond_json(422, ['error' => 'Phase is not in the audit plan.']);
}

$path = editor_data_path('issues');
if (!file_exists($path)) {
    respond_json(404, ['error' => 'Issues file not found.']);
}

$lockPath = $path . '.lock';
$lock = fopen($lockPath, 'c+');
if ($lock === false) {
    respond_json(500, ['error' => 'Could not lock issues file.']);
}

$issueId = '';
$issueIndex = [];

try {
    if (!flock($lock, LOCK_EX)) {
        respond_json(500, ['error' => 'Could not lock issues file.']);
    }

    $content = file_get_contents($path);
    if ($content === false) {
        respond_json(500, ['error' => 'Could not read issues file.']);
    }

    $result = move_issue_to_phase_yaml($content, $issueKey, $sprint, $phaseIds);
    editor_write_yaml('issues', $result['content']);
    $issueId = $result['id'];
    $issueIndex = $result['issues'];
} finally {
    flock($lock, LOCK_UN);
    fclose($lock);
}

respond_json(200, [
    'ok' => true,
    'issueKey' => $issueKey,
    'sprint' => $sprint,
    'id' => $issueId,
    'issues' => $issueIndex,
    'savedAt' => gmdate('c'),
]);

/**
 * @return list<int>
 */
function parse_audit_phase_ids(string $auditContent): array
{
    if (!preg_match_all('/^[ \t]*-[ \t]+id:\s*(\d+)[ \t]*\r?$/m', $auditContent, $matches)) {
        return [];
    }
    $ids = [];
    foreach ($matches[1] as $raw) {
        $ids[] = (int) $raw;
    }
    return array_values(array_unique($ids));
}

/**
 * Move one Issue to a phase (append within that phase), Compact ids in all phases.
 * Preserves YAML blocks (no full re-dump).
 *
 * @param list<int> $phaseIds
 * @return array{content: string, id: string, issues: list<array{key: string, id: string, sprint: int}>}
 */
function move_issue_to_phase_yaml(
    string $content,
    string $issueKey,
    int $targetSprint,
    array $phaseIds
): array {
    $escapedKey = preg_quote($issueKey, '/');
    $parts = preg_split('/(?=^- key:)/m', $content);
    if ($parts === false) {
        respond_json(500, ['error' => 'Could not parse issues file.']);
    }

    $prefix = '';
    $blocks = [];
    foreach ($parts as $part) {
        if ($part === '') {
            continue;
        }
        if (!preg_match('/^- key:/', $part)) {
            $prefix .= $part;
            continue;
        }
        $blocks[] = $part;
    }

    $moved = null;
    $rest = [];
    foreach ($blocks as $block) {
        if (preg_match('/^- key:\s*' . $escapedKey . '\s*$/m', $block)) {
            $moved = $block;
            continue;
        }
        $rest[] = $block;
    }

    if ($moved === null) {
        respond_json(404, ['error' => 'Issue not found.']);
    }

    $count = 0;
    $moved = preg_replace(
        '/^([ \t]*)sprint:\s*\S+[ \t]*\r?$/m',
        '${1}sprint: ' . $targetSprint,
        $moved,
        1,
        $count
    );
    if (!is_string($moved) || $count !== 1) {
        respond_json(500, ['error' => 'Could not update phase for this issue.']);
    }

    $byPhase = [];
    foreach ($phaseIds as $phaseId) {
        $byPhase[$phaseId] = [];
    }
    $orphans = [];

    foreach ($rest as $block) {
        $sprint = read_block_sprint($block);
        if ($sprint !== null && isset($byPhase[$sprint])) {
            $byPhase[$sprint][] = $block;
        } else {
            $orphans[] = $block;
        }
    }

    $byPhase[$targetSprint][] = $moved;

    $ordered = [];
    foreach ($phaseIds as $phaseId) {
        $sequence = 1;
        foreach ($byPhase[$phaseId] as $block) {
            $id = $phaseId . '.' . $sequence;
            $sequence++;
            $ordered[] = write_block_id($block, $id);
        }
    }
    foreach ($orphans as $block) {
        $ordered[] = $block;
    }

    $ordered = array_map(
        static function (string $block): string {
            return str_ends_with($block, "\n") ? $block : $block . "\n";
        },
        $ordered
    );

    $issues = [];
    $movedId = '';
    foreach ($ordered as $block) {
        $key = read_block_key($block);
        $id = read_block_id($block);
        $sprint = read_block_sprint($block);
        if ($key === null || $id === null || $sprint === null) {
            continue;
        }
        $issues[] = [
            'key' => $key,
            'id' => $id,
            'sprint' => $sprint,
        ];
        if ($key === $issueKey) {
            $movedId = $id;
        }
    }

    if ($movedId === '') {
        respond_json(500, ['error' => 'Could not determine new Issue id.']);
    }

    return [
        'content' => $prefix . implode('', $ordered),
        'id' => $movedId,
        'issues' => $issues,
    ];
}

function read_block_key(string $block): ?string
{
    if (!preg_match('/^- key:\s*(\S+)[ \t]*\r?$/m', $block, $match)) {
        return null;
    }
    return trim($match[1], " \t\"'");
}

function read_block_id(string $block): ?string
{
    if (!preg_match('/^[ \t]*id:\s*[\'"]?([^\'"\r\n]+)[\'"]?[ \t]*\r?$/m', $block, $match)) {
        return null;
    }
    return trim($match[1]);
}

function read_block_sprint(string $block): ?int
{
    if (!preg_match('/^[ \t]*sprint:\s*(\d+)[ \t]*\r?$/m', $block, $match)) {
        return null;
    }
    return (int) $match[1];
}

function write_block_id(string $block, string $id): string
{
    $count = 0;
    $quoted = "'" . $id . "'";
    $updated = preg_replace(
        '/^([ \t]*id:\s*)[^\r\n]*/m',
        '${1}' . $quoted,
        $block,
        1,
        $count
    );
    if (!is_string($updated) || $count !== 1) {
        respond_json(500, ['error' => 'Could not rewrite Issue id.']);
    }
    return $updated;
}
