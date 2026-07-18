<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';

editor_start_session();
editor_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$honeypot = $_POST['website'] ?? null;
editor_verify_honeypot(is_string($honeypot) ? $honeypot : null);
editor_verify_csrf(isset($_POST['csrf']) && is_string($_POST['csrf']) ? $_POST['csrf'] : null);
$role = editor_session_role();
editor_release_session();

if (!isset($_FILES['file']) || !is_array($_FILES['file'])) {
    respond_json(422, ['error' => 'file is required.']);
}

$upload = $_FILES['file'];
$error = (int) ($upload['error'] ?? UPLOAD_ERR_NO_FILE);
if ($error !== UPLOAD_ERR_OK) {
    respond_json(422, ['error' => 'Upload failed.']);
}

$original = (string) ($upload['name'] ?? '');
$tmp = (string) ($upload['tmp_name'] ?? '');
if ($tmp === '' || !is_uploaded_file($tmp)) {
    respond_json(422, ['error' => 'Invalid upload.']);
}

$ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
$allowed = ['png', 'jpg', 'jpeg', 'webp', 'mp4'];
if (!in_array($ext, $allowed, true)) {
    respond_json(422, ['error' => 'Only png, jpg, jpeg, webp, and mp4 are allowed.']);
}

$base = pathinfo($original, PATHINFO_FILENAME);
$base = preg_replace('/[^A-Za-z0-9._-]+/', '-', (string) $base) ?? 'upload';
$base = trim($base, '.-_');
if ($base === '') {
    $base = 'upload';
}

$mediaDir = dirname(__DIR__) . '/media';
if (!is_dir($mediaDir) && !mkdir($mediaDir, 0755, true) && !is_dir($mediaDir)) {
    respond_json(500, ['error' => 'Could not create media folder.']);
}

$name = $base . '.' . $ext;
$dest = $mediaDir . '/' . $name;
$n = 2;
while (is_file($dest)) {
    $name = $base . '-' . $n . '.' . $ext;
    $dest = $mediaDir . '/' . $name;
    $n++;
    if ($n > 999) {
        respond_json(500, ['error' => 'Could not choose a unique filename.']);
    }
}

if (!move_uploaded_file($tmp, $dest)) {
    respond_json(500, ['error' => 'Could not save uploaded file.']);
}

$type = $ext === 'mp4' ? 'video' : 'image';
editor_log_activity('media.upload', ['file' => $name, 'role' => $role]);

respond_json(200, [
    'ok' => true,
    'file' => [
        'name' => $name,
        'type' => $type,
        'mtime' => filemtime($dest) ?: time(),
    ],
]);
