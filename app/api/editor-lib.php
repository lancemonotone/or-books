<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

const EDITOR_FILES = ['audit', 'issues', 'evidence', 'decisions'];
const EDITOR_MAX_BYTES = 1_048_576;
const EDITOR_MAX_LOGIN_ATTEMPTS = 8;
const EDITOR_LOCKOUT_SECONDS = 900;

$configFile = __DIR__ . '/config.php';
$editorConfig = file_exists($configFile) ? require $configFile : [];

function editor_password(): string {
    global $editorConfig;
    return trim((string) ($editorConfig['editor_password'] ?? ''));
}

function editor_enabled(): bool {
    return editor_password() !== '';
}

function editor_session_lifetime(): int {
    global $editorConfig;
    $days = (int) ($editorConfig['editor_session_days'] ?? 30);
    if ($days < 1) {
        $days = 1;
    }
    if ($days > 365) {
        $days = 365;
    }
    return $days * 86_400;
}

function editor_start_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }

    session_set_cookie_params([
        'lifetime' => editor_session_lifetime(),
        'path' => '/',
        'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_name('or_audit_editor');
    session_start();
}

/** Release the session file lock so parallel editor API requests are not blocked. */
function editor_release_session(): void {
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_write_close();
    }
}

function editor_authenticated(): bool {
    editor_start_session();
    return !empty($_SESSION['editor_authenticated']);
}

function editor_csrf_token(): string {
    editor_start_session();
    if (empty($_SESSION['editor_csrf']) || !is_string($_SESSION['editor_csrf'])) {
        $_SESSION['editor_csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['editor_csrf'];
}

function editor_verify_csrf(?string $token): void {
    editor_start_session();
    $expected = $_SESSION['editor_csrf'] ?? '';
    if ($expected === '' || !is_string($token) || !hash_equals($expected, $token)) {
        respond_json(403, ['error' => 'Invalid session token. Reload and try again.']);
    }
}

function editor_verify_honeypot(?string $value): void {
    if (trim((string) $value) !== '') {
        respond_json(403, ['error' => 'Request rejected.']);
    }
}

function editor_require_enabled(): void {
    if (!editor_enabled()) {
        respond_json(503, ['error' => 'Editor is not configured. Set editor_password in api/config.php.']);
    }
}

function editor_require_auth(): void {
    editor_require_enabled();
    if (!editor_authenticated()) {
        respond_json(401, ['error' => 'Not signed in.']);
    }
}

function editor_login_locked(): bool {
    editor_start_session();
    $lockedUntil = (int) ($_SESSION['editor_locked_until'] ?? 0);
    return $lockedUntil > time();
}

function editor_register_failed_login(): void {
    editor_start_session();
    $attempts = (int) ($_SESSION['editor_login_attempts'] ?? 0) + 1;
    $_SESSION['editor_login_attempts'] = $attempts;
    if ($attempts >= EDITOR_MAX_LOGIN_ATTEMPTS) {
        $_SESSION['editor_locked_until'] = time() + EDITOR_LOCKOUT_SECONDS;
        $_SESSION['editor_login_attempts'] = 0;
    }
}

function editor_clear_login_attempts(): void {
    editor_start_session();
    unset($_SESSION['editor_login_attempts'], $_SESSION['editor_locked_until']);
}

function editor_attempt_login(string $password, ?string $honeypot = null): bool {
    editor_require_enabled();
    editor_start_session();

    if (editor_login_locked()) {
        respond_json(429, ['error' => 'Too many failed sign-in attempts. Try again later.']);
    }

    editor_verify_honeypot($honeypot);

    $expected = editor_password();
    if ($expected === '' || !hash_equals($expected, $password)) {
        editor_register_failed_login();
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['editor_authenticated'] = true;
    editor_clear_login_attempts();
    $_SESSION['editor_csrf'] = bin2hex(random_bytes(32));
    return true;
}

function editor_logout(): void {
    editor_start_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params['path'],
            $params['domain'] ?? '',
            (bool) $params['secure'],
            (bool) $params['httponly']
        );
    }
    session_destroy();
}

function editor_data_path(string $file): string {
    if (!in_array($file, EDITOR_FILES, true)) {
        respond_json(400, ['error' => 'Unknown data file.']);
    }

    return dirname(__DIR__) . '/data/' . $file . '.yaml';
}

function editor_read_yaml(string $file): string {
    $path = editor_data_path($file);
    if (!file_exists($path)) {
        respond_json(404, ['error' => 'Data file not found.']);
    }

    $content = file_get_contents($path);
    if ($content === false) {
        respond_json(500, ['error' => 'Could not read data file.']);
    }

    return $content;
}

function editor_validate_yaml(string $content): void {
    if (str_contains($content, "\0")) {
        respond_json(422, ['error' => 'Invalid file content.']);
    }

    if (strlen($content) > EDITOR_MAX_BYTES) {
        respond_json(413, ['error' => 'File is too large.']);
    }

    if (preg_match('/<\?(php|=)/i', $content)) {
        respond_json(422, ['error' => 'Invalid file content.']);
    }

    if (!function_exists('yaml_parse')) {
        return;
    }

    $parsed = @yaml_parse($content);
    if ($parsed === false && trim($content) !== '') {
        respond_json(422, ['error' => 'Invalid YAML. Fix syntax before saving.']);
    }
}

function editor_write_yaml(string $file, string $content): void {
    editor_validate_yaml($content);
    $path = editor_data_path($file);
    $dir = dirname($path);

    if (!is_dir($dir)) {
        respond_json(500, ['error' => 'Data directory missing.']);
    }

    if (!is_writable($dir)) {
        respond_json(500, ['error' => 'Data directory is not writable.']);
    }

    $tmp = $path . '.tmp';
    if (file_put_contents($tmp, $content, LOCK_EX) === false) {
        respond_json(500, ['error' => 'Could not write data file.']);
    }

    // Windows: rename() onto an existing path often fails with "Access is denied".
    // Replace via unlink + rename when the atomic overwrite fails.
    if (!@rename($tmp, $path)) {
        if (file_exists($path) && !@unlink($path)) {
            @unlink($tmp);
            respond_json(500, ['error' => 'Could not save data file.']);
        }
        if (!@rename($tmp, $path)) {
            @unlink($tmp);
            respond_json(500, ['error' => 'Could not save data file.']);
        }
    }
}
