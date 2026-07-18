<?php

declare(strict_types=1);

require_once __DIR__ . '/editor-lib.php';
require_once __DIR__ . '/settings-lib.php';

const TASK_LOCK_TTL_SECONDS = 120;

function task_locks_path(): string
{
    return responses_dir() . '/task-locks.json';
}

/**
 * @return array{locks: array<string, array{email:string,sessionId:string,expiresAt:int}>}
 */
function task_locks_default(): array
{
    return ['locks' => []];
}

/**
 * @return array{locks: array<string, array{email:string,sessionId:string,expiresAt:int}>}
 */
function task_locks_normalize(array $raw): array
{
    $locks = [];
    $list = is_array($raw['locks'] ?? null) ? $raw['locks'] : [];
    $now = time();
    foreach ($list as $taskKey => $row) {
        if (!is_string($taskKey) || $taskKey === '' || !is_array($row)) {
            continue;
        }
        $email = editor_normalize_email((string) ($row['email'] ?? ''));
        $sessionId = trim((string) ($row['sessionId'] ?? ''));
        $expiresAt = (int) ($row['expiresAt'] ?? 0);
        if ($email === '' || $sessionId === '' || $expiresAt <= $now) {
            continue;
        }
        $locks[$taskKey] = [
            'email' => $email,
            'sessionId' => $sessionId,
            'expiresAt' => $expiresAt,
        ];
    }

    return ['locks' => $locks];
}

/**
 * @return array{locks: array<string, array{email:string,sessionId:string,expiresAt:int}>}
 */
function task_locks_load(): array
{
    return task_locks_normalize(read_json_file(task_locks_path()));
}

/**
 * @param array{locks: array<string, array{email:string,sessionId:string,expiresAt:int}>} $data
 */
function task_locks_save(array $data): void
{
    write_json_file(task_locks_path(), task_locks_normalize($data));
}

/**
 * @template T
 * @param callable(array{locks: array<string, array{email:string,sessionId:string,expiresAt:int}>}):T $fn
 * @return T
 */
function task_locks_with_lock(callable $fn)
{
    $path = task_locks_path();
    $dir = dirname($path);
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        respond_json(500, ['error' => 'Could not create lock storage.']);
    }

    $handle = fopen($path . '.lock', 'c+');
    if ($handle === false) {
        respond_json(500, ['error' => 'Could not lock task-locks file.']);
    }

    try {
        if (!flock($handle, LOCK_EX)) {
            respond_json(500, ['error' => 'Could not lock task-locks file.']);
        }
        $data = task_locks_load();
        // Pass by reference so claim/heartbeat mutations persist to disk.
        $result = $fn($data);
        task_locks_save($data);
        return $result;
    } finally {
        flock($handle, LOCK_UN);
        fclose($handle);
    }
}

function task_lock_display_name(string $email): string
{
    $email = editor_normalize_email($email);
    $settings = load_settings();
    foreach (['client', 'developer'] as $teamKey) {
        $members = $settings['teams'][$teamKey]['members'] ?? [];
        if (!is_array($members)) {
            continue;
        }
        foreach ($members as $member) {
            if (!is_array($member)) {
                continue;
            }
            if (editor_normalize_email((string) ($member['email'] ?? '')) !== $email) {
                continue;
            }
            $name = trim((string) ($member['name'] ?? ''));
            if ($name !== '') {
                return $name;
            }
        }
    }

    return $email;
}

/**
 * @param array{email:string,sessionId:string,expiresAt:int}|null $lock
 * @return array{taskKey:string,email:string,name:string,expiresAt:int,mine:bool}|null
 */
function task_lock_public(?array $lock, string $taskKey): ?array
{
    if ($lock === null) {
        return null;
    }

    return [
        'taskKey' => $taskKey,
        'email' => $lock['email'],
        'name' => task_lock_display_name($lock['email']),
        'expiresAt' => $lock['expiresAt'],
        'mine' => $lock['sessionId'] === session_id()
            && $lock['email'] === editor_session_email(),
    ];
}

/**
 * @return array{email:string,sessionId:string,expiresAt:int}|null
 */
function task_lock_get(string $taskKey): ?array
{
    $data = task_locks_load();
    return $data['locks'][$taskKey] ?? null;
}

/**
 * @return array<string, array{email:string,sessionId:string,expiresAt:int}>
 */
function task_locks_active_map(): array
{
    return task_locks_load()['locks'];
}

function task_lock_is_foreign(?array $lock): bool
{
    if ($lock === null) {
        return false;
    }
    return !($lock['sessionId'] === session_id()
        && $lock['email'] === editor_session_email());
}

/**
 * @return array{lock: array{taskKey:string,email:string,name:string,expiresAt:int,mine:bool}}
 */
function task_lock_claim(string $taskKey, bool $takeover): array
{
    $taskKey = trim($taskKey);
    if ($taskKey === '') {
        respond_json(422, ['error' => 'taskKey is required.']);
    }

    $email = editor_session_email();
    $sessionId = session_id();
    if ($email === '' || $sessionId === '') {
        respond_json(401, ['error' => 'Not signed in.']);
    }

    return task_locks_with_lock(static function (array &$data) use ($taskKey, $takeover, $email, $sessionId): array {
        $existing = $data['locks'][$taskKey] ?? null;
        if (is_array($existing) && task_lock_is_foreign($existing) && !$takeover) {
            respond_json(409, [
                'error' => task_lock_display_name($existing['email']) . ' is editing this task.',
                'lock' => task_lock_public($existing, $taskKey),
            ]);
        }

        $lock = [
            'email' => $email,
            'sessionId' => $sessionId,
            'expiresAt' => time() + TASK_LOCK_TTL_SECONDS,
        ];
        $data['locks'][$taskKey] = $lock;

        return ['lock' => task_lock_public($lock, $taskKey)];
    });
}

/**
 * @return array{lock: array{taskKey:string,email:string,name:string,expiresAt:int,mine:bool}}
 */
function task_lock_heartbeat(string $taskKey): array
{
    $taskKey = trim($taskKey);
    if ($taskKey === '') {
        respond_json(422, ['error' => 'taskKey is required.']);
    }

    return task_locks_with_lock(static function (array &$data) use ($taskKey): array {
        $existing = $data['locks'][$taskKey] ?? null;
        if (!is_array($existing) || task_lock_is_foreign($existing)) {
            respond_json(409, [
                'error' => 'You do not hold this task lock.',
                'lock' => is_array($existing) ? task_lock_public($existing, $taskKey) : null,
            ]);
        }

        $existing['expiresAt'] = time() + TASK_LOCK_TTL_SECONDS;
        $data['locks'][$taskKey] = $existing;

        return ['lock' => task_lock_public($existing, $taskKey)];
    });
}

/**
 * @return array{ok:bool}
 */
function task_lock_release(string $taskKey): array
{
    $taskKey = trim($taskKey);
    if ($taskKey === '') {
        respond_json(422, ['error' => 'taskKey is required.']);
    }

    return task_locks_with_lock(static function (array &$data) use ($taskKey): array {
        $existing = $data['locks'][$taskKey] ?? null;
        if (is_array($existing) && !task_lock_is_foreign($existing)) {
            unset($data['locks'][$taskKey]);
        }
        return ['ok' => true];
    });
}
