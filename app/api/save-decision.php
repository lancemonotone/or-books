<?php
declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
$decisionId = trim((string) ($body['decisionId'] ?? ''));

if ($decisionId === '') {
    respond_json(422, ['error' => 'decisionId is required.']);
}

$choice = trim((string) ($body['choice'] ?? ''));
if ($choice === '') {
    respond_json(422, ['error' => 'choice is required.']);
}

$record = [
    'choice' => $choice,
    'text' => sanitize_text($body['text'] ?? ''),
    'author' => sanitize_author($body['author'] ?? ''),
    'updatedAt' => gmdate('c'),
];

$path = responses_dir() . '/decisions.json';

try {
    $all = read_json_file($path);
    $all[$decisionId] = $record;
    write_json_file($path, $all);
} catch (Throwable $e) {
    respond_json(500, ['error' => 'Could not save decision.']);
}

respond_json(200, $record);
