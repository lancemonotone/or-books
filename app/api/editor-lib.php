<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/settings-lib.php';

const EDITOR_FILES = ['audit', 'issues', 'evidence', 'decisions'];
const EDITOR_MAX_BYTES = 1_048_576;
const EDITOR_MAX_LOGIN_ATTEMPTS = 8;
const EDITOR_LOCKOUT_SECONDS = 900;
const EDITOR_MIN_PASSWORD_LENGTH = 8;
const EDITOR_AUDIT_LOG_MAX = 500;

function editor_password(): string {
    global $editorConfig;
    return trim((string) ($editorConfig['editor_password'] ?? ''));
}

function editor_admin_email(): string {
    global $editorConfig;
    return editor_normalize_email((string) ($editorConfig['admin_email'] ?? ''));
}

function editor_normalize_email(string $email): string {
    return strtolower(trim($email));
}

function editor_users_path(): string {
    return responses_dir() . '/users.json';
}

/**
 * @return array{users: list<array{email:string,passwordHash:string,mustChangePassword:bool}>}
 */
function editor_default_users(): array {
    return ['users' => []];
}

/**
 * @return array{users: list<array{email:string,passwordHash:string,mustChangePassword:bool}>}
 */
function editor_load_users(): array {
    $raw = read_json_file(editor_users_path());
    if ($raw === []) {
        return editor_default_users();
    }
    return editor_normalize_users($raw);
}

/**
 * @param array<string,mixed> $raw
 * @return array{users: list<array{email:string,passwordHash:string,mustChangePassword:bool}>}
 */
function editor_normalize_users(array $raw): array {
    $users = [];
    $list = is_array($raw['users'] ?? null) ? $raw['users'] : [];
    foreach ($list as $row) {
        if (!is_array($row)) {
            continue;
        }
        $email = editor_normalize_email((string) ($row['email'] ?? ''));
        $hash = trim((string) ($row['passwordHash'] ?? ''));
        if ($email === '' || $hash === '') {
            continue;
        }
        $users[$email] = [
            'email' => $email,
            'passwordHash' => $hash,
            'mustChangePassword' => !empty($row['mustChangePassword']),
        ];
    }
    return ['users' => array_values($users)];
}

/**
 * @param array{users: list<array{email:string,passwordHash:string,mustChangePassword:bool}>} $data
 */
function editor_save_users(array $data): void {
    write_json_file(editor_users_path(), editor_normalize_users($data));
}

/**
 * @return array{email:string,passwordHash:string,mustChangePassword:bool}|null
 */
function editor_find_user(string $email): ?array {
    $email = editor_normalize_email($email);
    if ($email === '') {
        return null;
    }
    foreach (editor_load_users()['users'] as $user) {
        if ($user['email'] === $email) {
            return $user;
        }
    }
    return null;
}

function editor_admin_has_password_hash(): bool {
    $admin = editor_admin_email();
    if ($admin === '') {
        return false;
    }
    $user = editor_find_user($admin);
    return $user !== null && $user['passwordHash'] !== '';
}

function editor_enabled(): bool {
    if (editor_admin_email() === '') {
        return false;
    }
    if (editor_admin_has_password_hash()) {
        return true;
    }
    return editor_password() !== '';
}

function editor_is_admin_email(string $email): bool {
    $admin = editor_admin_email();
    if ($admin === '') {
        return false;
    }
    return editor_normalize_email($email) === $admin;
}

/**
 * @return list<string>
 */
function editor_team_emails(): array {
    $settings = load_settings();
    $emails = [];
    foreach (['client', 'developer'] as $teamKey) {
        $team = is_array($settings['teams'][$teamKey] ?? null) ? $settings['teams'][$teamKey] : [];
        foreach (team_members($team) as $member) {
            $email = editor_normalize_email((string) ($member['email'] ?? ''));
            if ($email !== '' && !in_array($email, $emails, true)) {
                $emails[] = $email;
            }
        }
    }
    return $emails;
}

function editor_email_on_team(string $email): bool {
    $email = editor_normalize_email($email);
    return $email !== '' && in_array($email, editor_team_emails(), true);
}

/**
 * Configured hourly rate for estimate/actual $, or null if unset/invalid.
 */
function editor_hourly_rate(): ?float
{
    global $editorConfig;
    if (!array_key_exists('hourly_rate', $editorConfig)) {
        return null;
    }
    $raw = $editorConfig['hourly_rate'];
    if ($raw === null || $raw === '') {
        return null;
    }
    if (!is_numeric($raw)) {
        return null;
    }
    $rate = (float) $raw;
    if (!is_finite($rate) || $rate < 0) {
        return null;
    }
    return $rate;
}

/**
 * Sanitize a relative logo path for the estimate PDF (no .., no scheme).
 */
function editor_vendor_logo_path(string $raw): string
{
    $path = str_replace('\\', '/', trim($raw));
    if ($path === '' || str_contains($path, '..') || preg_match('#^[a-z][a-z0-9+.-]*:#i', $path)) {
        return '';
    }
    $path = ltrim($path, '/');
    if ($path === '' || !preg_match('#^[A-Za-z0-9._/-]+$#', $path)) {
        return '';
    }
    return $path;
}

/**
 * Vendor block for estimate PDF header (authenticated clients only).
 * Blank fields omitted from the returned array values as empty strings — client skips empty.
 *
 * @return array{name: string, business: string, address: string, email: string, phone: string, logo: string}
 */
function editor_vendor(): array
{
    global $editorConfig;
    $raw = is_array($editorConfig['vendor'] ?? null) ? $editorConfig['vendor'] : [];

    return [
        'name' => trim((string) ($raw['name'] ?? '')),
        'business' => trim((string) ($raw['business'] ?? '')),
        'address' => trim((string) ($raw['address'] ?? '')),
        'email' => trim((string) ($raw['email'] ?? '')),
        'phone' => trim((string) ($raw['phone'] ?? '')),
        'logo' => editor_vendor_logo_path((string) ($raw['logo'] ?? '')),
    ];
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
        respond_json(503, ['error' => 'Auth is not configured. Set admin_email and editor_password in config.php (app root), or complete admin password setup.']);
    }
}

function editor_session_email(): string {
    editor_start_session();
    return editor_normalize_email((string) ($_SESSION['editor_email'] ?? ''));
}

function editor_session_role(): string {
    return editor_is_admin_email(editor_session_email()) ? 'admin' : 'user';
}

function editor_must_change_password(): bool {
    $user = editor_find_user(editor_session_email());
    return $user !== null && !empty($user['mustChangePassword']);
}

/**
 * @return array{authenticated:bool,email:?string,role:?string,mustChangePassword:bool}
 */
function editor_auth_status_payload(): array {
    $authenticated = editor_authenticated();
    if (!$authenticated) {
        return [
            'authenticated' => false,
            'email' => null,
            'role' => null,
            'mustChangePassword' => false,
        ];
    }
    return [
        'authenticated' => true,
        'email' => editor_session_email(),
        'role' => editor_session_role(),
        'mustChangePassword' => editor_must_change_password(),
    ];
}

function editor_require_auth(): void {
    editor_require_enabled();
    if (!editor_authenticated()) {
        respond_json(401, ['error' => 'Not signed in.']);
    }

    $email = editor_session_email();
    if ($email === '') {
        editor_logout();
        respond_json(401, ['error' => 'Not signed in.']);
    }

    if (editor_is_admin_email($email)) {
        return;
    }

    if (!editor_email_on_team($email) || editor_find_user($email) === null) {
        editor_logout();
        respond_json(401, ['error' => 'Not signed in.']);
    }
}

function editor_require_admin(): void {
    editor_require_auth();
    if (editor_session_role() !== 'admin') {
        respond_json(403, ['error' => 'Admin access required.']);
    }
}

function editor_validate_new_password(string $password): void {
    if (strlen($password) < EDITOR_MIN_PASSWORD_LENGTH) {
        respond_json(422, ['error' => 'Password must be at least ' . EDITOR_MIN_PASSWORD_LENGTH . ' characters.']);
    }
}

/**
 * Upsert a user password hash. Admin email allowed without team membership.
 *
 * @param bool $enforceMinLength When false (temp passwords), any non-empty string is allowed.
 */
function editor_set_user_password(
    string $email,
    string $password,
    bool $mustChangePassword,
    bool $enforceMinLength = true
): void {
    $email = editor_normalize_email($email);
    if ($email === '') {
        respond_json(422, ['error' => 'Email is required.']);
    }
    if ($password === '') {
        respond_json(422, ['error' => 'Password is required.']);
    }
    if ($enforceMinLength) {
        editor_validate_new_password($password);
    }

    $hash = password_hash($password, PASSWORD_DEFAULT);
    if ($hash === false) {
        respond_json(500, ['error' => 'Could not hash password.']);
    }

    $data = editor_load_users();
    $found = false;
    foreach ($data['users'] as $i => $user) {
        if ($user['email'] === $email) {
            $data['users'][$i]['passwordHash'] = $hash;
            $data['users'][$i]['mustChangePassword'] = $mustChangePassword;
            $found = true;
            break;
        }
    }
    if (!$found) {
        $data['users'][] = [
            'email' => $email,
            'passwordHash' => $hash,
            'mustChangePassword' => $mustChangePassword,
        ];
    }
    editor_save_users($data);
}

/**
 * Admin sets/resets a temporary password for a team member email.
 */
function editor_admin_set_temp_password(string $email, string $password): void {
    $email = editor_normalize_email($email);
    if ($email === '') {
        respond_json(422, ['error' => 'Email is required.']);
    }
    if (editor_is_admin_email($email)) {
        respond_json(422, ['error' => 'Admin password is changed from the account screen, not Settings.']);
    }
    if (!editor_email_on_team($email)) {
        respond_json(422, ['error' => 'Email must belong to a team member before a login password can be set.']);
    }
    editor_set_user_password($email, $password, true, false);
}

/**
 * Remove auth rows for emails no longer on any team. Keep admin hash row.
 *
 * @param list<string> $teamEmails
 */
function editor_prune_users_not_on_team(array $teamEmails): void {
    $allowed = [];
    foreach ($teamEmails as $email) {
        $normalized = editor_normalize_email((string) $email);
        if ($normalized !== '') {
            $allowed[$normalized] = true;
        }
    }
    $admin = editor_admin_email();
    if ($admin !== '') {
        $allowed[$admin] = true;
    }

    $data = editor_load_users();
    $kept = [];
    foreach ($data['users'] as $user) {
        if (isset($allowed[$user['email']])) {
            $kept[] = $user;
        }
    }
    if (count($kept) !== count($data['users'])) {
        editor_save_users(['users' => $kept]);
    }
}

/**
 * @param array<string,mixed> $settingsBody Raw settings POST (may include tempPassword on members)
 */
function editor_apply_settings_auth(array $settingsBody, array $normalizedSettings): void {
    $teamsIn = is_array($settingsBody['teams'] ?? null) ? $settingsBody['teams'] : [];
    foreach (['client', 'developer'] as $teamKey) {
        $team = is_array($teamsIn[$teamKey] ?? null) ? $teamsIn[$teamKey] : [];
        $members = is_array($team['members'] ?? null) ? $team['members'] : [];
        foreach ($members as $row) {
            if (!is_array($row)) {
                continue;
            }
            $temp = (string) ($row['tempPassword'] ?? '');
            if ($temp === '') {
                continue;
            }
            $email = editor_normalize_email((string) ($row['email'] ?? ''));
            editor_admin_set_temp_password($email, $temp);
        }
    }

    $emails = [];
    foreach (['client', 'developer'] as $teamKey) {
        $team = is_array($normalizedSettings['teams'][$teamKey] ?? null)
            ? $normalizedSettings['teams'][$teamKey]
            : [];
        foreach (team_members($team) as $member) {
            $emails[] = (string) ($member['email'] ?? '');
        }
    }
    editor_prune_users_not_on_team($emails);
}

/**
 * Attach non-secret login flags to team members for admin Settings UI.
 *
 * @param array<string,mixed> $settings
 * @return array<string,mixed>
 */
function editor_enrich_settings_auth_status(array $settings): array {
    $usersByEmail = [];
    foreach (editor_load_users()['users'] as $user) {
        $usersByEmail[$user['email']] = $user;
    }

    foreach (['client', 'developer'] as $teamKey) {
        $members = $settings['teams'][$teamKey]['members'] ?? [];
        if (!is_array($members)) {
            continue;
        }
        foreach ($members as $i => $member) {
            if (!is_array($member)) {
                continue;
            }
            $email = editor_normalize_email((string) ($member['email'] ?? ''));
            $user = $usersByEmail[$email] ?? null;
            $settings['teams'][$teamKey]['members'][$i]['hasLogin'] = $user !== null;
            $settings['teams'][$teamKey]['members'][$i]['mustChangePassword'] = $user !== null && !empty($user['mustChangePassword']);
        }
    }

    return $settings;
}

function editor_verify_current_password(string $email, string $password): bool {
    $email = editor_normalize_email($email);
    $user = editor_find_user($email);

    if (editor_is_admin_email($email)) {
        if ($user !== null && $user['passwordHash'] !== '') {
            return password_verify($password, $user['passwordHash']);
        }
        $expected = editor_password();
        return $expected !== '' && hash_equals($expected, $password);
    }

    if ($user === null || $user['passwordHash'] === '') {
        return false;
    }
    return password_verify($password, $user['passwordHash']);
}

function editor_change_password(string $currentPassword, string $newPassword, string $confirmPassword): void {
    editor_require_auth();
    $email = editor_session_email();
    if ($newPassword !== $confirmPassword) {
        respond_json(422, ['error' => 'New password and confirmation do not match.']);
    }
    if (!editor_verify_current_password($email, $currentPassword)) {
        respond_json(401, ['error' => 'Current password is wrong.']);
    }
    editor_set_user_password($email, $newPassword, false);
    editor_log_activity('password.change');
}

function editor_client_ip(): string {
    return trim((string) ($_SERVER['REMOTE_ADDR'] ?? ''));
}

function editor_client_ua(): string {
    $ua = trim((string) ($_SERVER['HTTP_USER_AGENT'] ?? ''));
    if (mb_strlen($ua) > 240) {
        $ua = mb_substr($ua, 0, 240);
    }
    return $ua;
}

function editor_audit_log_path(): string {
    return responses_dir() . '/audit-log.json';
}

/**
 * @return array{entries: list<array<string,mixed>>}
 */
function editor_load_audit_log(): array {
    $raw = read_json_file(editor_audit_log_path());
    $entries = is_array($raw['entries'] ?? null) ? $raw['entries'] : [];
    $clean = [];
    foreach ($entries as $row) {
        if (is_array($row)) {
            $clean[] = $row;
        }
    }
    return ['entries' => $clean];
}

/**
 * @param array<string,mixed> $entry
 */
function editor_audit_append(array $entry): void {
    try {
        $data = editor_load_audit_log();
        array_unshift($data['entries'], $entry);
        if (count($data['entries']) > EDITOR_AUDIT_LOG_MAX) {
            $data['entries'] = array_slice($data['entries'], 0, EDITOR_AUDIT_LOG_MAX);
        }
        write_json_file(editor_audit_log_path(), $data);
    } catch (Throwable $e) {
        // Never break login or saves if the audit file cannot be written.
    }
}

function editor_log_login(string $email, bool $ok, ?string $reason = null): void {
    $email = editor_normalize_email($email);
    $role = null;
    if ($ok && $email !== '') {
        $role = editor_is_admin_email($email) ? 'admin' : 'user';
    }
    editor_audit_append([
        'at' => gmdate('c'),
        'kind' => 'login',
        'email' => $email,
        'role' => $role,
        'ok' => $ok,
        'reason' => $reason,
        'action' => $ok ? 'login.ok' : 'login.fail',
        'ip' => editor_client_ip(),
        'ua' => editor_client_ua(),
    ]);
}

/**
 * @param array<string,mixed> $target
 */
function editor_log_activity(string $action, array $target = []): void {
    try {
        if (!editor_authenticated()) {
            return;
        }
        $email = editor_session_email();
        if ($email === '') {
            return;
        }
        editor_audit_append([
            'at' => gmdate('c'),
            'kind' => 'activity',
            'email' => $email,
            'role' => editor_session_role(),
            'ok' => true,
            'reason' => null,
            'action' => $action,
            'target' => $target,
            'ip' => editor_client_ip(),
            'ua' => editor_client_ua(),
        ]);
    } catch (Throwable $e) {
        // Ignore audit failures.
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

function editor_attempt_login(string $email, string $password, ?string $honeypot = null): bool {
    editor_require_enabled();
    editor_start_session();

    if (editor_login_locked()) {
        respond_json(429, ['error' => 'Too many failed sign-in attempts. Try again later.']);
    }

    editor_verify_honeypot($honeypot);

    $email = editor_normalize_email($email);
    if ($email === '' || $password === '' || !editor_verify_login_credentials($email, $password)) {
        editor_register_failed_login();
        editor_log_login($email !== '' ? $email : '(empty)', false, 'bad_credentials');
        return false;
    }

    session_regenerate_id(true);
    $_SESSION['editor_authenticated'] = true;
    $_SESSION['editor_email'] = $email;
    editor_clear_login_attempts();
    $_SESSION['editor_csrf'] = bin2hex(random_bytes(32));
    editor_log_login($email, true);
    return true;
}

function editor_verify_login_credentials(string $email, string $password): bool {
    $email = editor_normalize_email($email);

    if (editor_is_admin_email($email)) {
        return editor_verify_current_password($email, $password);
    }

    if (!editor_email_on_team($email)) {
        return false;
    }

    $user = editor_find_user($email);
    if ($user === null || $user['passwordHash'] === '') {
        return false;
    }

    return password_verify($password, $user['passwordHash']);
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
