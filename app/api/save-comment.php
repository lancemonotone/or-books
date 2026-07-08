<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
$issueId = trim((string) ($body['issueId'] ?? ''));

if ($issueId === '') {
    respond_json(422, ['error' => 'issueId is required.']);
}

$stance = trim((string) ($body['stance'] ?? ''));
$allowedStances = ['agree', 'disagree', 'discuss'];
if (!in_array($stance, $allowedStances, true)) {
    respond_json(422, ['error' => 'Invalid stance.']);
}

$record = [
    'stance' => $stance,
    'text' => sanitize_text($body['text'] ?? ''),
    'author' => sanitize_author($body['author'] ?? ''),
    'updatedAt' => gmdate('c'),
];

$path = responses_dir() . '/comments.json';

try {
    $all = read_json_file($path);
    $all[$issueId] = $record;
    write_json_file($path, $all);
} catch (Throwable $e) {
    respond_json(500, ['error' => 'Could not save comment.']);
}

respond_json(200, $record);
