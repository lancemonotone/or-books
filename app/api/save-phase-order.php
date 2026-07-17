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

$phaseIdsRaw = $body['phaseIds'] ?? null;
if (!is_array($phaseIdsRaw) || $phaseIdsRaw === []) {
    respond_json(422, ['error' => 'phaseIds must be a non-empty array.']);
}

$requestedIds = [];
foreach ($phaseIdsRaw as $raw) {
    if (!is_numeric($raw)) {
        respond_json(422, ['error' => 'Invalid phase id in phaseIds.']);
    }
    $requestedIds[] = (int) $raw;
}

$auditPath = editor_data_path('audit');
$issuesPath = editor_data_path('issues');
if (!file_exists($auditPath) || !file_exists($issuesPath)) {
    respond_json(404, ['error' => 'Audit or issues file not found.']);
}

$auditLockPath = $auditPath . '.lock';
$issuesLockPath = $issuesPath . '.lock';
$auditLock = fopen($auditLockPath, 'c+');
$issuesLock = fopen($issuesLockPath, 'c+');
if ($auditLock === false || $issuesLock === false) {
    respond_json(500, ['error' => 'Could not lock data files.']);
}

try {
    if (!flock($auditLock, LOCK_EX) || !flock($issuesLock, LOCK_EX)) {
        respond_json(500, ['error' => 'Could not lock data files.']);
    }

    $auditContent = file_get_contents($auditPath);
    $issuesContent = file_get_contents($issuesPath);
    if ($auditContent === false || $issuesContent === false) {
        respond_json(500, ['error' => 'Could not read data files.']);
    }

    $result = reorder_phases_yaml($auditContent, $issuesContent, $requestedIds);
    editor_write_yaml('audit', $result['auditContent']);
    editor_write_yaml('issues', $result['issuesContent']);
} finally {
    flock($auditLock, LOCK_UN);
    flock($issuesLock, LOCK_UN);
    fclose($auditLock);
    fclose($issuesLock);
}

respond_json(200, [
    'ok' => true,
    'sprints' => $result['sprints'],
    'issues' => $result['issues'],
    'phaseMap' => $result['phaseMap'],
    'savedAt' => gmdate('c'),
]);

/**
 * @param list<int> $requestedIds
 * @return array{
 *   auditContent: string,
 *   issuesContent: string,
 *   sprints: list<array{id:int,title:string,subtitle:string,description:string}>,
 *   issues: list<array{key:string,id:string,sprint:int}>,
 *   phaseMap: array<string,int>
 * }
 */
function reorder_phases_yaml(string $auditContent, string $issuesContent, array $requestedIds): array
{
    $parsed = parse_audit_sprints_section($auditContent);
    $currentIds = array_map(static fn(array $s): int => $s['id'], $parsed['sprints']);

    $sortedCurrent = $currentIds;
    $sortedRequested = $requestedIds;
    sort($sortedCurrent);
    sort($sortedRequested);
    if ($sortedCurrent !== $sortedRequested || count($requestedIds) !== count(array_unique($requestedIds))) {
        respond_json(422, ['error' => 'phaseIds must be a permutation of current phase ids.']);
    }

    $byOldId = [];
    foreach ($parsed['sprints'] as $sprint) {
        $byOldId[$sprint['id']] = $sprint;
    }

    $phaseMap = []; // oldId string => newId int
    $newSprints = [];
    $newBlocks = [];
    $newId = 1;
    foreach ($requestedIds as $oldId) {
        $sprint = $byOldId[$oldId];
        $phaseMap[(string) $oldId] = $newId;
        $newSprints[] = [
            'id' => $newId,
            'title' => $sprint['title'],
            'subtitle' => $sprint['subtitle'],
            'description' => $sprint['description'],
        ];
        $newBlocks[] = rewrite_sprint_block_id($sprint['block'], $newId);
        $newId++;
    }

    $auditContent = $parsed['before'] . "sprints:\n" . implode('', $newBlocks) . $parsed['after'];

    $issuesResult = remap_issues_for_phase_order($issuesContent, $phaseMap, array_column($newSprints, 'id'));

    return [
        'auditContent' => $auditContent,
        'issuesContent' => $issuesResult['content'],
        'sprints' => $newSprints,
        'issues' => $issuesResult['issues'],
        'phaseMap' => $phaseMap,
    ];
}

/**
 * Split the audit `sprints:` list into the text before it, each sprint
 * block (`  - id: N` … up to the next `  - id:` or dedent), and any
 * trailing content after the list. No yaml_parse/yaml_emit: block text is
 * preserved verbatim except for the rewritten `id:` line.
 *
 * @return array{
 *   before: string,
 *   after: string,
 *   sprints: list<array{id:int,title:string,subtitle:string,description:string,block:string}>
 * }
 */
function parse_audit_sprints_section(string $auditContent): array
{
    if (!preg_match('/^sprints:[ \t]*\r?\n/m', $auditContent, $headerMatch, PREG_OFFSET_CAPTURE)) {
        respond_json(500, ['error' => 'Could not find sprints section in audit file.']);
    }

    $headerText = $headerMatch[0][0];
    $headerOffset = $headerMatch[0][1];
    $before = substr($auditContent, 0, $headerOffset);
    $rest = substr($auditContent, $headerOffset + strlen($headerText));

    // Everything indented (part of the sprints list) up to the next
    // non-indented (top-level) line or end of file.
    preg_match('/^(?:[ \t]+.*(?:\r?\n|$))*/', $rest, $listMatch);
    $listText = $listMatch[0];
    $after = substr($rest, strlen($listText));

    $parts = preg_split('/(?=^  - id:)/m', $listText);
    if ($parts === false) {
        respond_json(500, ['error' => 'Could not parse sprints list.']);
    }

    $sprints = [];
    foreach ($parts as $part) {
        if (trim($part) === '') {
            continue;
        }
        if (!preg_match('/^  - id:\s*(\d+)/', $part, $idMatch)) {
            respond_json(500, ['error' => 'Malformed sprint block (missing id).']);
        }
        $sprints[] = [
            'id' => (int) $idMatch[1],
            'title' => read_sprint_scalar($part, 'title'),
            'subtitle' => read_sprint_scalar($part, 'subtitle'),
            'description' => read_sprint_description($part),
            'block' => $part,
        ];
    }

    if ($sprints === []) {
        respond_json(500, ['error' => 'No sprints found in audit file.']);
    }

    return [
        'before' => $before,
        'after' => $after,
        'sprints' => $sprints,
    ];
}

/** Plain/quoted scalar field (e.g. `    title: 'Foo'`) inside a sprint block. */
function read_sprint_scalar(string $block, string $field): string
{
    if (!preg_match('/^[ \t]+' . preg_quote($field, '/') . ':[ \t]*(.*)\r?$/m', $block, $match)) {
        return '';
    }
    return trim($match[1], " \t\"'");
}

/**
 * `description:` may be an inline scalar (`description: ''`) or a `|`
 * block scalar spanning one or more indented lines. Read-only: used for
 * the JSON payload, never re-serialized back into the block.
 */
function read_sprint_description(string $block): string
{
    if (preg_match('/^[ \t]+description:[ \t]*\|[ \t]*\r?\n((?:[ \t]+.*(?:\r?\n|$))*)/m', $block, $match)) {
        $lines = preg_split('/\r?\n/', rtrim($match[1], "\r\n"));
        $indent = null;
        $dedented = [];
        foreach ($lines as $line) {
            if ($indent === null && trim($line) !== '') {
                preg_match('/^[ \t]*/', $line, $indentMatch);
                $indent = strlen($indentMatch[0]);
            }
            $dedented[] = $indent !== null ? substr($line, $indent) : $line;
        }
        return implode("\n", $dedented);
    }

    if (preg_match('/^[ \t]+description:[ \t]*(.*)\r?$/m', $block, $match)) {
        return trim($match[1], " \t\"'");
    }

    return '';
}

/** Rewrite only the `id:` value on the `  - id: N` line; block otherwise untouched. */
function rewrite_sprint_block_id(string $block, int $newId): string
{
    $count = 0;
    $updated = preg_replace(
        '/^([ \t]*-[ \t]+id:[ \t]*)\d+/',
        '${1}' . $newId,
        $block,
        1,
        $count
    );
    if (!is_string($updated) || $count !== 1) {
        respond_json(500, ['error' => 'Could not rewrite phase id.']);
    }
    return $updated;
}

/**
 * @param array<string,int> $phaseMap oldId string => newId
 * @param list<int> $newPhaseIds dense 1…N in order
 * @return array{content: string, issues: list<array{key:string,id:string,sprint:int}>}
 */
function remap_issues_for_phase_order(string $content, array $phaseMap, array $newPhaseIds): array
{
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

    $byNewPhase = [];
    foreach ($newPhaseIds as $newId) {
        $byNewPhase[$newId] = [];
    }
    $orphans = [];

    foreach ($blocks as $block) {
        $oldSprint = read_block_sprint($block);
        $newSprint = $oldSprint !== null ? ($phaseMap[(string) $oldSprint] ?? null) : null;
        if ($newSprint === null || !isset($byNewPhase[$newSprint])) {
            $orphans[] = $block;
            continue;
        }
        $byNewPhase[$newSprint][] = write_block_sprint($block, $newSprint);
    }

    $ordered = [];
    foreach ($newPhaseIds as $newId) {
        $sequence = 1;
        foreach ($byNewPhase[$newId] as $block) {
            $id = $newId . '.' . $sequence;
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
    }

    return [
        'content' => $prefix . implode('', $ordered),
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

function write_block_sprint(string $block, int $sprint): string
{
    $count = 0;
    $updated = preg_replace(
        '/^([ \t]*)sprint:\s*\S+[ \t]*\r?$/m',
        '${1}sprint: ' . $sprint,
        $block,
        1,
        $count
    );
    if (!is_string($updated) || $count !== 1) {
        respond_json(500, ['error' => 'Could not update phase for this issue.']);
    }
    return $updated;
}
