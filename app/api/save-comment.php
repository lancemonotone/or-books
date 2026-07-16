<?php

declare(strict_types=1);

require __DIR__ . '/editor-lib.php';
require_once __DIR__ . '/comments-lib.php';
require_once __DIR__ . '/notify-lib.php';

editor_start_session();
editor_require_auth();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed.']);
}

$body = read_request_json();
editor_verify_honeypot($body['website'] ?? null);
editor_verify_csrf($body['csrf'] ?? null);
editor_release_session();

$issueId = trim((string) ($body['issueId'] ?? ''));
if ($issueId === '') {
    respond_json(422, ['error' => 'issueId is required.']);
}

$action = trim((string) ($body['action'] ?? 'stance'));

try {
    $all = load_comments();
    $existing = isset($all[$issueId]) && is_array($all[$issueId]) ? $all[$issueId] : [];
    $record = normalize_comment_record($existing);

    if ($action === 'stance') {
        $author = sanitize_author($body['author'] ?? '');
        $text = sanitize_text($body['text'] ?? '');

        if ($text === '') {
            respond_json(422, ['error' => 'Comment text is required.']);
        }

        $now = gmdate('c');
        $record['stance'] = '';
        $record['author'] = $author;
        $record['updatedAt'] = $now;

        $messages = $record['messages'];
        if ($messages === []) {
            $messages[] = make_message($author, $text, $now);
        } else {
            $last = $messages[array_key_last($messages)];
            if ($last && authors_match($last['author'], $author)) {
                $messages[array_key_last($messages)]['text'] = $text;
                $messages[array_key_last($messages)]['updatedAt'] = $now;
            } else {
                $messages[] = make_message($author, $text, $now);
            }
        }

        $record['messages'] = array_values($messages);
        $record['text'] = $messages !== []
            ? $messages[array_key_last($messages)]['text']
            : $text;

        $all[$issueId] = $record;
        save_comments($all);
        try {
            notify_comment_event($issueId, $author, $record);
        } catch (Throwable $notifyError) {
            error_log('notify_comment_event: ' . $notifyError->getMessage());
        }
        respond_json(200, $record);
    }

    if ($action === 'reply') {
        $author = sanitize_author($body['author'] ?? '');
        $text = sanitize_text($body['text'] ?? '');
        if ($text === '') {
            respond_json(422, ['error' => 'Reply text is required.']);
        }

        $now = gmdate('c');
        $record['messages'][] = make_message($author, $text, $now);
        $record['messages'] = array_values($record['messages']);
        $record['text'] = $text;
        $record['updatedAt'] = $now;
        if ($record['author'] === '') {
            $record['author'] = $author;
        }

        $all[$issueId] = $record;
        save_comments($all);
        try {
            notify_comment_event($issueId, $author, $record);
        } catch (Throwable $notifyError) {
            error_log('notify_comment_event: ' . $notifyError->getMessage());
        }
        respond_json(200, $record);
    }

    if ($action === 'edit') {
        $author = sanitize_author($body['author'] ?? '');
        $messageId = trim((string) ($body['messageId'] ?? ''));
        $text = sanitize_text($body['text'] ?? '');
        if ($messageId === '') {
            respond_json(422, ['error' => 'messageId is required.']);
        }

        $messages = $record['messages'];
        if ($messages === []) {
            respond_json(422, ['error' => 'No messages to edit.']);
        }

        $lastIndex = array_key_last($messages);
        $last = $messages[$lastIndex];
        if (($last['id'] ?? '') !== $messageId) {
            respond_json(403, ['error' => 'Only the latest message can be edited.']);
        }
        if (!authors_match($last['author'], $author)) {
            respond_json(403, ['error' => 'You can only edit your own message.']);
        }

        $now = gmdate('c');
        $isOpening = count($messages) === 1;

        if ($text === '') {
            if ($isOpening) {
                unset($all[$issueId]);
                save_comments($all);
                respond_json(200, [
                    'stance' => '',
                    'text' => '',
                    'author' => '',
                    'updatedAt' => $now,
                    'messages' => [],
                    'cleared' => true,
                ]);
            }
            respond_json(422, ['error' => 'Message text is required.']);
        }

        $messages[$lastIndex]['text'] = $text;
        $messages[$lastIndex]['updatedAt'] = $now;
        if ($isOpening) {
            $record['stance'] = '';
        }
        $record['messages'] = array_values($messages);
        $record['text'] = $text;
        $record['updatedAt'] = $now;

        $all[$issueId] = $record;
        save_comments($all);
        try {
            notify_comment_event($issueId, $author, $record);
        } catch (Throwable $notifyError) {
            error_log('notify_comment_event: ' . $notifyError->getMessage());
        }
        respond_json(200, $record);
    }

    respond_json(400, ['error' => 'Unknown action.']);
} catch (Throwable $e) {
    respond_json(500, ['error' => 'Could not save comment.']);
}
