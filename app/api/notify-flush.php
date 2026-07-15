<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';
require_once __DIR__ . '/notify-lib.php';

$secret = trim((string) ($_GET['secret'] ?? ''));
if ($secret === '' && ($_SERVER['REQUEST_METHOD'] ?? '') === 'POST') {
    $body = read_request_json();
    $secret = trim((string) ($body['secret'] ?? ''));
}

$expected = notify_config()['flush_secret'];
if ($expected === '' || $secret === '' || !hash_equals($expected, $secret)) {
    respond_json(403, ['error' => 'Forbidden.']);
}

$result = notify_flush_due();
respond_json(200, [
    'ok' => true,
    'sent' => $result['sent'],
    'skipped' => $result['skipped'],
    'flushedAt' => gmdate('c'),
]);
