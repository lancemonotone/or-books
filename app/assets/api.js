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

export async function login(email, password, honeypot = '') {
  const data = await requestJson('api/editor-auth.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'login',
      email,
      password,
      website: honeypot,
    }),
  });
  setCsrfToken(data.csrf || '');
  return data;
}

export async function changePassword(
  currentPassword,
  newPassword,
  confirmPassword,
  honeypot = ''
) {
  const data = await requestJson('api/editor-auth.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      action: 'change_password',
      currentPassword,
      newPassword,
      confirmPassword,
      website: honeypot,
      csrf: csrfToken,
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
  const [audit, tasks, evidence, decisions] = await Promise.all([
    fetchYaml('audit'),
    fetchYaml('tasks'),
    fetchYaml('evidence'),
    fetchYaml('decisions'),
  ]);

  return { audit, tasks, evidence, decisions };
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

export function saveComment(taskId, payload) {
  return postJson('api/save-comment.php', {
    taskId,
    action: 'comment',
    ...payload,
  });
}

export function postCommentReply(taskId, payload) {
  return postJson('api/save-comment.php', {
    taskId,
    action: 'reply',
    ...payload,
  });
}

export function editCommentMessage(taskId, payload) {
  return postJson('api/save-comment.php', {
    taskId,
    action: 'edit',
    ...payload,
  });
}

export function saveDecision(decisionId, payload) {
  return postJson('api/save-decision.php', { decisionId, ...payload });
}

export function saveTaskPriority(taskKey, priority) {
  return postJson('api/save-task-priority.php', { taskKey, priority });
}

export function saveTaskStatus(taskKey, status) {
  return postJson('api/save-task-status.php', { taskKey, status });
}

export function saveTaskPhase(taskKey, sprint) {
  return postJson('api/save-task-phase.php', { taskKey, sprint });
}

export function saveTaskTags(taskKey, tags) {
  return postJson('api/save-task-tags.php', { taskKey, tags });
}

export function savePhaseOrder(phaseIds) {
  return postJson('api/save-phase-order.php', { phaseIds });
}

export function loadSettings() {
  return requestJson('api/settings.php');
}

export function saveSettings(payload) {
  return postJson('api/settings.php', payload);
}

export function loadAuditLog() {
  return requestJson('api/audit-log.php');
}

export function mediaUrl(file) {
  return `media/${file}`;
}
