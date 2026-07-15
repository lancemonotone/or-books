<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';
require_once __DIR__ . '/comments-lib.php';

editor_start_session();
editor_require_auth();
editor_release_session();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$rawComments = read_json_file(comments_path());
$comments = [];
foreach ($rawComments as $issueId => $row) {
    if (!is_array($row)) {
        continue;
    }
    $comments[(string) $issueId] = normalize_comment_record($row);
}

$decisions = read_json_file(responses_dir() . '/decisions.json');

respond_json(200, [
    'comments' => $comments,
    'decisions' => is_array($decisions) ? $decisions : [],
]);
