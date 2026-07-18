<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';
require_once __DIR__ . '/notify-lib.php';

editor_start_session();
editor_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
editor_verify_honeypot($body['website'] ?? null);
editor_verify_csrf($body['csrf'] ?? null);
editor_release_session();

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

try {
    notify_decision_event($decisionId, $record);
} catch (Throwable $notifyError) {
    error_log('notify_decision_event: ' . $notifyError->getMessage());
}

editor_log_activity('decision.save', ['decisionId' => $decisionId]);
respond_json(200, $record);
