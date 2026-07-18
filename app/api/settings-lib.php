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
                'members' => [],
            ],
            'developer' => [
                'members' => [],
            ],
        ],
    ];
}

function normalize_frequency(string $value): string
{
    $value = strtolower(trim($value));
    if (in_array($value, ['none', 'immediate', 'hourly', 'daily'], true)) {
        return $value;
    }
    return 'none';
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
                'frequency' => normalize_frequency((string) ($row['frequency'] ?? 'none')),
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
                'frequency' => 'none',
            ];
        }
    }

    return $members;
}

function normalize_team(array $team): array
{
    return [
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
 * @return list<array{name:string,email:string,frequency:string}>
 */
function team_members(array $team): array
{
    return is_array($team['members'] ?? null) ? $team['members'] : [];
}

/**
 * @return list<string>
 */
function team_member_emails_by_frequency(array $team, string $frequency): array
{
    $frequency = normalize_frequency($frequency);
    $emails = [];
    foreach (team_members($team) as $member) {
        if (!is_array($member)) {
            continue;
        }
        if (normalize_frequency((string) ($member['frequency'] ?? 'none')) !== $frequency) {
            continue;
        }
        $email = trim((string) ($member['email'] ?? ''));
        if ($email !== '' && !in_array($email, $emails, true)) {
            $emails[] = $email;
        }
    }
    return $emails;
}

/**
 * @return list<string>
 */
function team_digest_emails(array $team): array
{
    $emails = [];
    foreach (team_members($team) as $member) {
        if (!is_array($member)) {
            continue;
        }
        $freq = normalize_frequency((string) ($member['frequency'] ?? 'none'));
        if ($freq === 'none' || $freq === 'immediate') {
            continue;
        }
        $email = trim((string) ($member['email'] ?? ''));
        if ($email !== '' && !in_array($email, $emails, true)) {
            $emails[] = $email;
        }
    }
    return $emails;
}
