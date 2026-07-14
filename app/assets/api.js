const yaml = window.jsyaml;

let csrfToken = '';

export function setCsrfToken(token) {
  csrfToken = token || '';
}

export function getCsrfToken() {
  return csrfToken;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
    cache: 'no-store',
    ...options,
  });
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }
  return data;
}

export async function fetchAuth() {
  return requestJson('api/editor-auth.php');
}

export async function login(password, honeypot = '') {
  const data = await requestJson('api/editor-auth.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'login',
      password,
      website: honeypot,
    }),
  });
  setCsrfToken(data.csrf || '');
  return data;
}

export async function logout() {
  await requestJson('api/editor-auth.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'logout',
      csrf: csrfToken,
    }),
  });
  setCsrfToken('');
}

async function fetchYaml(name) {
  const data = await requestJson(
    `api/content.php?file=${encodeURIComponent(name)}`
  );
  return yaml.load(data.content);
}

export async function loadContent() {
  const [audit, issues, evidence, decisions] = await Promise.all([
    fetchYaml('audit'),
    fetchYaml('issues'),
    fetchYaml('evidence'),
    fetchYaml('decisions'),
  ]);

  return { audit, issues, evidence, decisions };
}

export async function loadResponses() {
  try {
    const data = await requestJson('api/responses.php');
    return {
      comments: data.comments || {},
      decisions: data.decisions || {},
    };
  } catch {
    return { comments: {}, decisions: {} };
  }
}

async function postJson(url, body) {
  return requestJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...body,
      csrf: csrfToken,
      website: '',
    }),
  });
}

export function saveComment(issueId, payload) {
  return postJson('api/save-comment.php', {
    issueId,
    action: 'stance',
    ...payload,
  });
}

export function postCommentReply(issueId, payload) {
  return postJson('api/save-comment.php', {
    issueId,
    action: 'reply',
    ...payload,
  });
}

export function editCommentMessage(issueId, payload) {
  return postJson('api/save-comment.php', {
    issueId,
    action: 'edit',
    ...payload,
  });
}

export function saveDecision(decisionId, payload) {
  return postJson('api/save-decision.php', { decisionId, ...payload });
}

export function mediaUrl(file) {
  return `media/${file}`;
}
