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
 * Light/dark preference only — not product palettes.
 * @return 'light'|'dark'|'system'|null
 */
function normalize_color_scheme(mixed $value): ?string
{
    $value = strtolower(trim((string) $value));
    if (in_array($value, ['light', 'dark', 'system'], true)) {
        return $value;
    }
    return null;
}

/** Opaque palette id (presets live in the client). Empty if missing/invalid. */
function normalize_palette_slug(mixed $value): string
{
    $value = trim((string) $value);
    if ($value === '' || mb_strlen($value) > 64) {
        return '';
    }
    if (!preg_match('/^[a-zA-Z0-9_-]+$/', $value)) {
        return '';
    }
    return $value;
}

function normalize_hex_color(string $value): ?string
{
    $value = trim($value);
    if ($value === '') {
        return null;
    }
    if ($value[0] !== '#') {
        $value = '#' . $value;
    }
    if (preg_match('/^#([0-9a-fA-F]{3})$/', $value, $m)) {
        $raw = $m[1];
        $value = sprintf('#%s%s%s%s%s%s', $raw[0], $raw[0], $raw[1], $raw[1], $raw[2], $raw[2]);
    }
    if (!preg_match('/^#[0-9a-fA-F]{6}$/', $value)) {
        return null;
    }
    return strtolower($value);
}

/** Opaque harmony slug — client interprets. */
function normalize_harmony_slug(mixed $value): string
{
    $value = strtolower(trim((string) $value));
    if ($value === '' || mb_strlen($value) > 32) {
        return '';
    }
    if (!preg_match('/^[a-z0-9_-]+$/', $value)) {
        return '';
    }
    return $value;
}

/**
 * @return list<array{id:string,name:string,hex:string,harmony:string}>
 */
function normalize_palette_customs(mixed $raw): array
{
    if (!is_array($raw)) {
        return [];
    }
    $out = [];
    foreach ($raw as $row) {
        if (!is_array($row) || count($out) >= 24) {
            continue;
        }
        $customId = normalize_palette_slug($row['id'] ?? '');
        if ($customId === '') {
            continue;
        }
        $hex = normalize_hex_color((string) ($row['hex'] ?? ''));
        if ($hex === null) {
            continue;
        }
        $name = trim((string) ($row['name'] ?? ''));
        if ($name === '') {
            $name = $hex;
        }
        if (mb_strlen($name) > 40) {
            $name = mb_substr($name, 0, 40);
        }
        $harmony = normalize_harmony_slug($row['harmony'] ?? '');
        if ($harmony === '') {
            continue;
        }
        $out[] = [
            'id' => $customId,
            'name' => $name,
            'hex' => $hex,
            'harmony' => $harmony,
        ];
    }
    return $out;
}

/**
 * Product palettes are defined in the client. Server only stores opaque appearance data.
 *
 * @return array{colorScheme:?string,palette:string,harmony:string,customs:list}|null
 */
function normalize_appearance(array $raw): ?array
{
    $source = is_array($raw['appearance'] ?? null) ? $raw['appearance'] : null;

    // One-read migrate of earlier flat keys (theme / palette / paletteCustoms).
    if ($source === null && (
        array_key_exists('theme', $raw)
        || array_key_exists('palette', $raw)
        || array_key_exists('paletteCustoms', $raw)
    )) {
        $source = [
            'colorScheme' => $raw['theme'] ?? null,
            'palette' => $raw['palette'] ?? '',
            'customs' => $raw['paletteCustoms'] ?? [],
        ];
    }

    if ($source === null) {
        return null;
    }

    $customsKey = array_key_exists('customs', $source) ? 'customs' : 'paletteCustoms';
    $schemeKey = array_key_exists('colorScheme', $source) ? 'colorScheme' : 'theme';

    return [
        'colorScheme' => normalize_color_scheme($source[$schemeKey] ?? null),
        'palette' => normalize_palette_slug($source['palette'] ?? ''),
        'harmony' => normalize_harmony_slug($source['harmony'] ?? ''),
        'customs' => normalize_palette_customs($source[$customsKey] ?? []),
    ];
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
    $settings = [
        'clientName' => sanitize_text((string) ($raw['clientName'] ?? ''), 120),
        'notifyEnabled' => !empty($raw['notifyEnabled']),
        'teams' => [
            'client' => normalize_team(is_array($teamsIn['client'] ?? null) ? $teamsIn['client'] : []),
            'developer' => normalize_team(is_array($teamsIn['developer'] ?? null) ? $teamsIn['developer'] : []),
        ],
    ];
    $appearance = normalize_appearance($raw);
    if ($appearance !== null) {
        $settings['appearance'] = $appearance;
    }
    return $settings;
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
