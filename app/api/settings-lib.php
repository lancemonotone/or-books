<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function settings_path(): string
{
    return responses_dir() . '/settings.json';
}

function default_settings(): array
{
    return [
        'clientName' => '',
        'notifyEnabled' => false,
        'teams' => [
            'client' => [
                'frequency' => 'immediate',
                'members' => [],
            ],
            'developer' => [
                'frequency' => 'immediate',
                'members' => [],
            ],
        ],
    ];
}

function normalize_frequency(string $value): string
{
    $value = strtolower(trim($value));
    if (in_array($value, ['immediate', 'hourly', 'daily'], true)) {
        return $value;
    }
    return 'immediate';
}

/**
 * @return list<array{name:string,email:string,frequency:string}>
 */
function normalize_team_members(array $team): array
{
    $members = [];

    if (is_array($team['members'] ?? null)) {
        foreach ($team['members'] as $row) {
            if (!is_array($row)) {
                continue;
            }
            $name = trim((string) ($row['name'] ?? ''));
            $email = trim((string) ($row['email'] ?? ''));
            if ($name === '' || $email === '') {
                continue;
            }
            if (mb_strlen($name) > 80) {
                $name = mb_substr($name, 0, 80);
            }
            if (mb_strlen($email) > 200) {
                $email = mb_substr($email, 0, 200);
            }
            $members[] = [
                'name' => $name,
                'email' => $email,
            ];
        }
    }

    // Migrate legacy parallel lists (pair by index).
    if ($members === [] && (isset($team['authors']) || isset($team['emails']))) {
        $authors = is_array($team['authors'] ?? null) ? $team['authors'] : [];
        $emails = is_array($team['emails'] ?? null) ? $team['emails'] : [];
        $count = max(count($authors), count($emails));
        for ($i = 0; $i < $count; $i++) {
            $name = trim((string) ($authors[$i] ?? ''));
            $email = trim((string) ($emails[$i] ?? ''));
            if ($name === '' || $email === '') {
                continue;
            }
            $members[] = [
                'name' => $name,
                'email' => $email,
            ];
        }
    }

    return $members;
}

function normalize_team(array $team): array
{
    $frequency = normalize_frequency((string) ($team['frequency'] ?? 'immediate'));

    // Migrate saved members that stored per-person frequency before team-level field.
    if (!array_key_exists('frequency', $team) && is_array($team['members'] ?? null)) {
        foreach ($team['members'] as $row) {
            if (!is_array($row) || !array_key_exists('frequency', $row)) {
                continue;
            }
            $frequency = normalize_frequency((string) $row['frequency']);
            break;
        }
    }

    return [
        'frequency' => $frequency,
        'members' => normalize_team_members($team),
    ];
}

function normalize_settings(array $raw): array
{
    $teamsIn = is_array($raw['teams'] ?? null) ? $raw['teams'] : [];

    return [
        'clientName' => sanitize_text((string) ($raw['clientName'] ?? ''), 120),
        'notifyEnabled' => !empty($raw['notifyEnabled']),
        'teams' => [
            'client' => normalize_team(is_array($teamsIn['client'] ?? null) ? $teamsIn['client'] : []),
            'developer' => normalize_team(is_array($teamsIn['developer'] ?? null) ? $teamsIn['developer'] : []),
        ],
    ];
}

function load_settings(): array
{
    $raw = read_json_file(settings_path());
    if ($raw === []) {
        return default_settings();
    }
    return normalize_settings($raw);
}

function save_settings(array $settings): void
{
    write_json_file(settings_path(), normalize_settings($settings));
}

/**
 * @return list<array{name:string,email:string}>
 */
function team_members(array $team): array
{
    return is_array($team['members'] ?? null) ? $team['members'] : [];
}

function team_frequency(array $team): string
{
    return normalize_frequency((string) ($team['frequency'] ?? 'immediate'));
}

/**
 * @return list<string>
 */
function team_all_emails(array $team): array
{
    $emails = [];
    foreach (team_members($team) as $member) {
        if (!is_array($member)) {
            continue;
        }
        $email = trim((string) ($member['email'] ?? ''));
        if ($email !== '' && !in_array($email, $emails, true)) {
            $emails[] = $email;
        }
    }
    return $emails;
}
