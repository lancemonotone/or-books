<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

editor_start_session();
editor_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'GET') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

editor_release_session();

$mediaDir = dirname(__DIR__) . '/media';
if (!is_dir($mediaDir)) {
    respond_json(200, ['files' => []]);
}

$allowed = ['png', 'jpg', 'jpeg', 'webp', 'mp4'];
$files = [];

foreach (scandir($mediaDir) ?: [] as $name) {
    if ($name === '.' || $name === '..' || $name === '.gitkeep') {
        continue;
    }

    $path = $mediaDir . '/' . $name;
    if (!is_file($path)) {
        continue;
    }

    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed, true)) {
        continue;
    }

    $type = $ext === 'mp4' ? 'video' : 'image';
    $files[] = [
        'name' => $name,
        'type' => $type,
        'mtime' => filemtime($path) ?: 0,
    ];
}

usort($files, static fn(array $a, array $b): int => $b['mtime'] <=> $a['mtime']);

respond_json(200, ['files' => $files]);
