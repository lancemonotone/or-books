<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';
require_once __DIR__ . '/settings-lib.php';
require_once __DIR__ . '/comments-lib.php';

function notify_queue_path(): string
{
    return responses_dir() . '/notify-queue.json';
}

function notify_state_path(): string
{
    return responses_dir() . '/notify-state.json';
}

function notify_config(): array
{
    global $editorConfig;
    if (!isset($editorConfig) || !is_array($editorConfig)) {
        $configFile = __DIR__ . '/config.php';
        $editorConfig = file_exists($configFile) ? require $configFile : [];
    }
    $notify = is_array($editorConfig['notify'] ?? null) ? $editorConfig['notify'] : [];
    return [
        'enabled' => ($notify['enabled'] ?? true) !== false,
        'from' => trim((string) ($notify['from'] ?? '')),
        'flush_secret' => trim((string) ($notify['flush_secret'] ?? '')),
        'app_public_url' => rtrim(trim((string) ($editorConfig['app_public_url'] ?? '')), '/') . '/',
    ];
}

function notify_host_enabled(): bool
{
    return notify_config()['enabled'] === true;
}

function notify_author_team(string $author, array $settings): ?string
{
    $author = trim($author);
    if ($author === '') {
        return null;
    }
    foreach (['client', 'developer'] as $team) {
        $members = $settings['teams'][$team]['members'] ?? [];
        if (!is_array($members)) {
            continue;
        }
        foreach ($members as $member) {
            if (!is_array($member)) {
                continue;
            }
            if (authors_match((string) ($member['name'] ?? ''), $author)) {
                return $team;
            }
        }
    }
    return null;
}

function notify_other_team(string $team): ?string
{
    if ($team === 'client') {
        return 'developer';
    }
    if ($team === 'developer') {
        return 'client';
    }
    return null;
}

function notify_lookup_issue(string $issueKey): array
{
    $path = dirname(__DIR__) . '/data/issues.yaml';
    if (!is_file($path)) {
        return ['id' => '', 'title' => '', 'tags' => []];
    }
    $content = file_get_contents($path);
    if ($content === false) {
        return ['id' => '', 'title' => '', 'tags' => []];
    }
    $escaped = preg_quote($issueKey, '/');
    $parts = preg_split('/(?=^- key:)/m', $content);
    if ($parts === false) {
        return ['id' => '', 'title' => '', 'tags' => []];
    }
    foreach ($parts as $part) {
        if ($part === '' || !preg_match('/^- key:\s*' . $escaped . '\s*$/m', $part)) {
            continue;
        }
        $id = '';
        $title = '';
        if (preg_match('/^[ \t]*id:\s*[\'"]?([^\'"\n]+)[\'"]?\s*$/m', $part, $m)) {
            $id = trim($m[1]);
        }
        if (preg_match('/^[ \t]*title:\s*(.+)\s*$/m', $part, $m)) {
            $title = trim($m[1], " \t'\"");
        }
        $tags = [];
        if (preg_match('/^[ \t]*tags:\s*\n((?:[ \t]*-[ \t]*.+\n?)*)/m', $part, $m)) {
            preg_match_all('/^[ \t]*-[ \t]*(.+)$/m', $m[1], $tagMatches);
            foreach ($tagMatches[1] as $tag) {
                $tag = trim($tag, " \t'\"");
                if ($tag !== '') {
                    $tags[] = $tag;
                }
            }
        }
        return ['id' => $id, 'title' => $title, 'tags' => $tags];
    }
    return ['id' => '', 'title' => '', 'tags' => []];
}

function notify_lookup_decision(string $decisionKey): array
{
    $path = dirname(__DIR__) . '/data/decisions.yaml';
    if (!is_file($path)) {
        return ['title' => $decisionKey];
    }
    $content = file_get_contents($path);
    if ($content === false) {
        return ['title' => $decisionKey];
    }
    $escaped = preg_quote($decisionKey, '/');
    $parts = preg_split('/(?=^- key:)/m', $content);
    if ($parts === false) {
        return ['title' => $decisionKey];
    }
    foreach ($parts as $part) {
        if ($part === '' || !preg_match('/^- key:\s*' . $escaped . '\s*$/m', $part)) {
            continue;
        }
        if (preg_match('/^[ \t]*title:\s*(.+)\s*$/m', $part, $m)) {
            return ['title' => trim($m[1], " \t'\"")];
        }
        break;
    }
    return ['title' => $decisionKey];
}

function notify_escape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function notify_app_link(string $hashPath): string
{
    $base = notify_config()['app_public_url'];
    if ($base === '/' || $base === '') {
        return '#' . ltrim($hashPath, '#');
    }
    return $base . '#' . ltrim($hashPath, '#');
}

function notify_render_chip(string $label): string
{
    $label = trim($label);
    if ($label === '') {
        return '';
    }
    return '<span style="display:inline-block;padding:2px 8px;border-radius:999px;background:#f3e8e8;color:#8b1e1e;font-size:12px;font-weight:600;margin:0 4px 4px 0;">'
        . notify_escape($label)
        . '</span>';
}

/**
 * @param list<array{author?:string,text?:string}> $messages
 */
function notify_render_conversation(array $messages): string
{
    if ($messages === []) {
        return '';
    }
    $html = '<div style="margin:16px 0 0;">';
    foreach ($messages as $message) {
        $author = trim((string) ($message['author'] ?? ''));
        $text = trim((string) ($message['text'] ?? ''));
        if ($author === '' && $text === '') {
            continue;
        }
        $html .= '<div style="margin:0 0 10px;padding:10px 12px;border-radius:8px;background:#f7f6f4;border:1px solid #ddd9d3;">';
        if ($author !== '') {
            $html .= '<div style="font-weight:650;font-size:13px;margin:0 0 4px;">' . notify_escape($author) . '</div>';
        }
        if ($text !== '') {
            $html .= '<div style="font-size:14px;line-height:1.45;white-space:pre-wrap;">' . nl2br(notify_escape($text)) . '</div>';
        }
        $html .= '</div>';
    }
    $html .= '</div>';
    return $html;
}

function notify_render_email(array $event, array $settings): array
{
    $clientName = trim((string) ($settings['clientName'] ?? ''));
    $prefix = $clientName !== '' ? $clientName : 'Review';
    $type = (string) ($event['type'] ?? '');

    if ($type === 'decision') {
        $title = (string) ($event['decisionTitle'] ?? 'Question');
        $subject = '[' . $prefix . '] Answer: ' . $title;
        $chips = notify_render_chip($title);
        $bodyInner = '<p style="margin:0 0 12px;font-size:14px;"><strong>'
            . notify_escape((string) ($event['author'] ?? ''))
            . '</strong> saved an answer'
            . ($event['choice'] ? ': <strong>' . notify_escape((string) $event['choice']) . '</strong>' : '')
            . '.</p>';
        if (!empty($event['text'])) {
            $bodyInner .= notify_render_conversation([[
                'author' => (string) ($event['author'] ?? ''),
                'text' => (string) $event['text'],
            ]]);
        }
        $link = notify_app_link('/decisions');
    } else {
        $issueId = (string) ($event['issueId'] ?? '');
        $issueTitle = (string) ($event['issueTitle'] ?? '');
        $label = trim($issueId . ($issueTitle !== '' ? ' — ' . $issueTitle : ''));
        $subject = '[' . $prefix . '] ' . ($label !== '' ? $label : 'Issue update');
        $chips = notify_render_chip($issueId) . notify_render_chip($issueTitle);
        foreach ($event['tags'] ?? [] as $tag) {
            $chips .= notify_render_chip((string) $tag);
        }
        $messages = is_array($event['messages'] ?? null) ? $event['messages'] : [];
        $bodyInner = '<p style="margin:0 0 12px;font-size:14px;"><strong>'
            . notify_escape((string) ($event['author'] ?? ''))
            . '</strong> posted on this issue.</p>';
        $bodyInner .= notify_render_conversation($messages);
        $link = notify_app_link('/issue/' . rawurlencode((string) ($event['issueKey'] ?? '')));
    }

    $body = ($chips !== '' ? '<div style="margin:0 0 12px;">' . $chips . '</div>' : '')
        . $bodyInner
        . '<p style="margin:20px 0 0;"><a href="' . notify_escape($link) . '" style="display:inline-block;padding:10px 14px;border-radius:6px;background:#8b1e1e;color:#ffffff;text-decoration:none;font-size:14px;font-weight:600;">Open in review app</a></p>';

    $html = '<!DOCTYPE html><html><body style="margin:0;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a;background:#ffffff;">'
        . '<div style="max-width:560px;margin:0 auto;">'
        . $body
        . '</div></body></html>';

    return ['subject' => $subject, 'html' => $html, 'body' => $body];
}

/**
 * @param list<array<string,mixed>> $events
 */
function notify_render_digest(array $events, array $settings): array
{
    $clientName = trim((string) ($settings['clientName'] ?? ''));
    $prefix = $clientName !== '' ? $clientName : 'Review';
    $count = count($events);
    $subject = '[' . $prefix . '] Digest — ' . $count . ' ' . ($count === 1 ? 'update' : 'updates');
    $parts = [];
    foreach ($events as $event) {
        $rendered = notify_render_email($event, $settings);
        $parts[] = '<div style="margin:0 0 28px;padding:0 0 20px;border-bottom:1px solid #ddd9d3;">' . $rendered['body'] . '</div>';
    }
    $html = '<!DOCTYPE html><html><body style="margin:0;padding:24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;color:#1a1a1a;background:#ffffff;">'
        . '<div style="max-width:560px;margin:0 auto;">'
        . '<h1 style="font-size:18px;margin:0 0 16px;">' . notify_escape((string) $count) . ' updates</h1>'
        . implode('', $parts)
        . '</div></body></html>';
    return ['subject' => $subject, 'html' => $html];
}

function notify_send_mail(array $emails, string $subject, string $html): bool
{
    $emails = array_values(array_filter(array_map('trim', $emails)));
    if ($emails === []) {
        return false;
    }
    $from = notify_config()['from'];
    $headers = [
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
    ];
    if ($from !== '') {
        $headers[] = 'From: ' . $from;
    }
    $to = implode(', ', $emails);
    $ok = @mail($to, $subject, $html, implode("\r\n", $headers));
    if (!$ok) {
        error_log('notify: mail() failed for ' . $to);
    }
    return $ok;
}

function notify_load_queue(): array
{
    $raw = read_json_file(notify_queue_path());
    return is_array($raw['events'] ?? null) ? array_values($raw['events']) : [];
}

function notify_save_queue(array $events): void
{
    write_json_file(notify_queue_path(), ['events' => array_values($events)]);
}

/**
 * Per-recipient last flush stamps: { "email@x.com": "ISO8601", ... }
 *
 * @return array<string,string>
 */
function notify_load_state(): array
{
    $raw = read_json_file(notify_state_path());
    $out = [];
    foreach ($raw as $email => $stamp) {
        if (!is_string($email) || !is_string($stamp)) {
            continue;
        }
        $email = trim($email);
        if ($email !== '') {
            $out[strtolower($email)] = $stamp;
        }
    }
    return $out;
}

/**
 * @param array<string,string> $state
 */
function notify_save_state(array $state): void
{
    write_json_file(notify_state_path(), $state);
}

/**
 * @param list<string> $pendingEmails
 */
function notify_enqueue(array $event, string $targetTeam, array $pendingEmails): void
{
    $pendingEmails = array_values(array_filter(array_map('trim', $pendingEmails)));
    if ($pendingEmails === []) {
        return;
    }
    $events = notify_load_queue();
    $event['id'] = bin2hex(random_bytes(8));
    $event['targetTeam'] = $targetTeam;
    $event['pendingEmails'] = $pendingEmails;
    $event['createdAt'] = gmdate('c');
    $events[] = $event;
    notify_save_queue($events);
}

function notify_record_event(array $event): void
{
    try {
        if (!notify_host_enabled()) {
            return;
        }
        $settings = load_settings();
        if (empty($settings['notifyEnabled'])) {
            return;
        }
        $author = trim((string) ($event['author'] ?? ''));
        $fromTeam = notify_author_team($author, $settings);
        if ($fromTeam === null) {
            return;
        }
        $targetTeam = notify_other_team($fromTeam);
        if ($targetTeam === null) {
            return;
        }
        $team = $settings['teams'][$targetTeam] ?? null;
        if (!is_array($team)) {
            return;
        }

        $immediate = team_member_emails_by_frequency($team, 'immediate');
        if ($immediate !== []) {
            $rendered = notify_render_email($event, $settings);
            notify_send_mail($immediate, $rendered['subject'], $rendered['html']);
        }

        $digestEmails = team_digest_emails($team);
        if ($digestEmails !== []) {
            notify_enqueue($event, $targetTeam, $digestEmails);
        }
    } catch (Throwable $e) {
        error_log('notify_record_event: ' . $e->getMessage());
    }
}

function notify_recipient_due(string $frequency, string $lastFlushIso): bool
{
    if ($lastFlushIso === '') {
        return true;
    }
    $last = strtotime($lastFlushIso);
    if ($last === false) {
        return true;
    }
    $elapsed = time() - $last;
    if ($frequency === 'hourly') {
        return $elapsed >= 3600;
    }
    if ($frequency === 'daily') {
        return $elapsed >= 86400;
    }
    return false;
}

/**
 * @return array{sent:int,skipped:int}
 */
function notify_flush_due(): array
{
    $sent = 0;
    $skipped = 0;
    if (!notify_host_enabled()) {
        return ['sent' => 0, 'skipped' => 0];
    }
    $settings = load_settings();
    if (empty($settings['notifyEnabled'])) {
        return ['sent' => 0, 'skipped' => 0];
    }

    $events = notify_load_queue();
    $state = notify_load_state();

    foreach (['client', 'developer'] as $teamKey) {
        $team = $settings['teams'][$teamKey] ?? null;
        if (!is_array($team)) {
            continue;
        }

        foreach (team_members($team) as $member) {
            if (!is_array($member)) {
                continue;
            }
            $email = trim((string) ($member['email'] ?? ''));
            $frequency = normalize_frequency((string) ($member['frequency'] ?? 'immediate'));
            if ($email === '' || $frequency === 'immediate') {
                continue;
            }
            $stateKey = strtolower($email);
            if (!notify_recipient_due($frequency, (string) ($state[$stateKey] ?? ''))) {
                continue;
            }

            $batch = [];
            foreach ($events as $event) {
                if (($event['targetTeam'] ?? '') !== $teamKey) {
                    continue;
                }
                $pending = is_array($event['pendingEmails'] ?? null) ? $event['pendingEmails'] : [];
                foreach ($pending as $pendingEmail) {
                    if (strcasecmp(trim((string) $pendingEmail), $email) === 0) {
                        $batch[] = $event;
                        break;
                    }
                }
            }

            if ($batch === []) {
                $state[$stateKey] = gmdate('c');
                continue;
            }

            $rendered = notify_render_digest($batch, $settings);
            if (notify_send_mail([$email], $rendered['subject'], $rendered['html'])) {
                $sent++;
                $state[$stateKey] = gmdate('c');
                foreach ($events as &$event) {
                    if (($event['targetTeam'] ?? '') !== $teamKey) {
                        continue;
                    }
                    $pending = is_array($event['pendingEmails'] ?? null) ? $event['pendingEmails'] : [];
                    $event['pendingEmails'] = array_values(array_filter(
                        $pending,
                        static fn ($pendingEmail) => strcasecmp(trim((string) $pendingEmail), $email) !== 0
                    ));
                }
                unset($event);
            } else {
                $skipped++;
            }
        }
    }

    $events = array_values(array_filter(
        $events,
        static fn ($event) => !empty($event['pendingEmails'])
    ));

    notify_save_queue($events);
    notify_save_state($state);

    return ['sent' => $sent, 'skipped' => $skipped];
}

function notify_comment_event(string $issueKey, string $author, array $record): void
{
    $meta = notify_lookup_issue($issueKey);
    $messages = is_array($record['messages'] ?? null) ? $record['messages'] : [];
    $slice = array_slice($messages, -3);
    $eventMessages = [];
    foreach ($slice as $message) {
        if (!is_array($message)) {
            continue;
        }
        $eventMessages[] = [
            'author' => (string) ($message['author'] ?? ''),
            'text' => (string) ($message['text'] ?? ''),
        ];
    }
    notify_record_event([
        'type' => 'comment',
        'issueKey' => $issueKey,
        'issueId' => $meta['id'],
        'issueTitle' => $meta['title'],
        'tags' => $meta['tags'],
        'author' => $author,
        'messages' => $eventMessages,
    ]);
}

function notify_decision_event(string $decisionKey, array $record): void
{
    $meta = notify_lookup_decision($decisionKey);
    notify_record_event([
        'type' => 'decision',
        'decisionKey' => $decisionKey,
        'decisionTitle' => $meta['title'],
        'author' => (string) ($record['author'] ?? ''),
        'choice' => (string) ($record['choice'] ?? ''),
        'text' => (string) ($record['text'] ?? ''),
    ]);
}
