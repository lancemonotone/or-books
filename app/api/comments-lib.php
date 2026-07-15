<?php

declare(strict_types=1);

require_once __DIR__ . '/bootstrap.php';

function new_message_id(): string
{
    return bin2hex(random_bytes(16));
}

function make_message(string $author, string $text, ?string $at = null): array
{
    $stamp = $at ?: gmdate('c');
    return [
        'id' => new_message_id(),
        'author' => $author,
        'text' => $text,
        'createdAt' => $stamp,
        'updatedAt' => $stamp,
    ];
}

function stance_label(string $stance): string
{
    return match ($stance) {
        'agree' => 'Yes',
        'disagree' => 'No',
        'discuss' => 'Not sure yet',
        default => $stance,
    };
}

/**
 * Opening message body: note text, or the agree choice when no note was written.
 */
function opening_message_text(string $stance, string $text): string
{
    if ($text !== '') {
        return $text;
    }
    if ($stance === '') {
        return '';
    }
    return stance_label($stance);
}

function parse_stance_value(mixed $value): string
{
    $stance = trim((string) $value);
    if ($stance === '') {
        return '';
    }
    if (!in_array($stance, ['agree', 'disagree', 'discuss'], true)) {
        respond_json(422, ['error' => 'Invalid stance.']);
    }
    return $stance;
}

/**
 * In-memory normalize. Does not rewrite disk.
 * Preserves stance/text/author/updatedAt; adds messages[] when missing.
 * Stance with no messages → opening comment is the agree choice.
 */
function normalize_comment_record(array $row): array
{
    $stance = trim((string) ($row['stance'] ?? ''));
    $text = sanitize_text($row['text'] ?? '', 2000);
    $author = trim((string) ($row['author'] ?? ''));
    $updatedAt = trim((string) ($row['updatedAt'] ?? ''));

    $messages = $row['messages'] ?? null;
    if (!is_array($messages)) {
        $messages = [];
        if ($text !== '') {
            $stamp = $updatedAt !== '' ? $updatedAt : gmdate('c');
            $messages[] = [
                'id' => 'legacy-' . substr(hash('sha256', $text . "\0" . $stamp), 0, 16),
                'author' => $author !== '' ? $author : 'Unknown',
                'text' => $text,
                'createdAt' => $stamp,
                'updatedAt' => $stamp,
            ];
        }
    } else {
        $normalized = [];
        foreach ($messages as $message) {
            if (!is_array($message)) {
                continue;
            }
            $msgText = sanitize_text($message['text'] ?? '', 2000);
            if ($msgText === '') {
                continue;
            }
            $msgAuthor = trim((string) ($message['author'] ?? ''));
            $createdAt = trim((string) ($message['createdAt'] ?? $message['updatedAt'] ?? $updatedAt));
            $msgUpdated = trim((string) ($message['updatedAt'] ?? $createdAt));
            $id = trim((string) ($message['id'] ?? ''));
            if ($id === '') {
                $id = 'legacy-' . substr(hash('sha256', $msgText . "\0" . $createdAt), 0, 16);
            }
            $normalized[] = [
                'id' => $id,
                'author' => $msgAuthor !== '' ? $msgAuthor : 'Unknown',
                'text' => $msgText,
                'createdAt' => $createdAt !== '' ? $createdAt : gmdate('c'),
                'updatedAt' => $msgUpdated !== '' ? $msgUpdated : gmdate('c'),
            ];
        }
        if ($normalized === [] && $text !== '') {
            $stamp = $updatedAt !== '' ? $updatedAt : gmdate('c');
            $normalized[] = [
                'id' => 'legacy-' . substr(hash('sha256', $text . "\0" . $stamp), 0, 16),
                'author' => $author !== '' ? $author : 'Unknown',
                'text' => $text,
                'createdAt' => $stamp,
                'updatedAt' => $stamp,
            ];
        }
        $messages = $normalized;
    }

    if ($messages === [] && $stance !== '') {
        $stamp = $updatedAt !== '' ? $updatedAt : gmdate('c');
        $opening = opening_message_text($stance, $text);
        $messages[] = [
            'id' => 'legacy-' . substr(hash('sha256', $stance . "\0" . $opening . "\0" . $stamp), 0, 16),
            'author' => $author !== '' ? $author : 'Unknown',
            'text' => $opening,
            'createdAt' => $stamp,
            'updatedAt' => $stamp,
        ];
        $text = $opening;
    }

    if ($messages !== []) {
        $last = $messages[array_key_last($messages)];
        $text = $last['text'];
    }

    return [
        'stance' => $stance,
        'text' => $text,
        'author' => $author,
        'updatedAt' => $updatedAt !== '' ? $updatedAt : gmdate('c'),
        'messages' => array_values($messages),
    ];
}

function comments_path(): string
{
    return responses_dir() . '/comments.json';
}

function load_comments(): array
{
    return read_json_file(comments_path());
}

function save_comments(array $all): void
{
    write_json_file(comments_path(), $all);
}

function authors_match(string $a, string $b): bool
{
    return hash_equals(mb_strtolower(trim($a)), mb_strtolower(trim($b)));
}
