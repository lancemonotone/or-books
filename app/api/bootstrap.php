<?php
declare(strict_types=1);

/**
 * Shared helpers for flat-file JSON responses.
 * Config lives at the repo root: copy config.example.php to config.php.
 */

$configFile = dirname(__DIR__, 2) . '/config.php';
$config = file_exists($configFile) ? require $configFile : [];

/** @var array $editorConfig Alias used by editor/notify helpers. */
$editorConfig = is_array($config) ? $config : [];

function respond_json(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function responses_dir(): string
{
    return dirname(__DIR__) . '/data/responses';
}

function read_json_file(string $path): array
{
    if (!file_exists($path)) {
        return [];
    }

    $raw = file_get_contents($path);
    if ($raw === false || trim($raw) === '') {
        return [];
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : [];
}

function write_json_file(string $path, array $data): void
{
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        throw new RuntimeException('Cannot create responses directory.');
    }

    $encoded = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    if ($encoded === false) {
        throw new RuntimeException('JSON encode failed.');
    }

    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $encoded, LOCK_EX) === false) {
        throw new RuntimeException('Cannot write response file.');
    }

    if (!rename($tmp, $path)) {
        @unlink($tmp);
        throw new RuntimeException('Cannot finalize response file.');
    }
}

function read_request_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        respond_json(400, ['error' => 'Empty request body.']);
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        respond_json(400, ['error' => 'Invalid JSON.']);
    }

    return $decoded;
}

function sanitize_text(?string $value, int $max = 2000): string
{
    $text = trim((string) $value);
    if (mb_strlen($text) > $max) {
        $text = mb_substr($text, 0, $max);
    }
    return $text;
}

function sanitize_author(?string $value): string
{
    $author = trim((string) $value);
    if ($author === '') {
        respond_json(422, ['error' => 'Author name is required.']);
    }
    if (mb_strlen($author) > 80) {
        $author = mb_substr($author, 0, 80);
    }
    return $author;
}
