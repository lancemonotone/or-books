const yaml = window.jsyaml;

async function fetchYaml(name) {
  const response = await fetch(`data/${name}.yaml`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load data/${name}.yaml`);
  }
  return yaml.load(await response.text());
}

async function fetchJson(path) {
  const response = await fetch(path, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${path}`);
  }
  return response.json();
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
    const [comments, decisions] = await Promise.all([
      fetchJson('data/responses/comments.json'),
      fetchJson('data/responses/decisions.json'),
    ]);
    return { comments, decisions };
  } catch {
    return { comments: {}, decisions: {} };
  }
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Save failed');
  }
  return data;
}

export function saveComment(issueId, payload) {
  return postJson('api/save-comment.php', { issueId, ...payload });
}

export function saveDecision(decisionId, payload) {
  return postJson('api/save-decision.php', { decisionId, ...payload });
}

export function mediaUrl(file) {
  return `media/${file}`;
}
