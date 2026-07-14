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

/**
 * In-memory normalize. Does not rewrite disk.
 * Preserves stance/text/author/updatedAt; adds messages[] when missing.
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
