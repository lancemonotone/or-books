const yaml = window.jsyaml;

export async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: 'same-origin',
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

export function dumpYaml(data, file = '') {
  let payload = data;

  if (file === 'issues' && Array.isArray(data)) {
    payload = data.map((issue) => ({
      ...issue,
      id: String(issue.id),
      sprint: Number(issue.sprint),
    }));
  }

  if (file === 'decisions' && Array.isArray(data)) {
    payload = data.map((decision) => ({
      ...decision,
      blocks: (decision.blocks || []).map(String),
    }));
  }

  return yaml.dump(payload, { lineWidth: -1, noRefs: true });
}

export function parseYaml(text) {
  return yaml.load(text);
}

export async function loadYamlFile(file) {
  const data = await requestJson(`../api/editor-data.php?file=${encodeURIComponent(file)}`);
  return parseYaml(data.content);
}

export async function saveYamlFile(file, content, csrf, honeypot) {
  return requestJson('../api/editor-data.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ file, content, csrf, website: honeypot }),
  });
}

export async function loadMediaList() {
  const data = await requestJson('../api/editor-media.php');
  return data.files || [];
}

export function syncAuditStats(audit, issues, evidence, decisions) {
  audit.stats = {
    screenshots: evidence.filter(
      (row) => row.type !== 'video' && !String(row.file || '').endsWith('.mp4')
    ).length,
    recordings: evidence.filter(
      (row) => row.type === 'video' || String(row.file || '').endsWith('.mp4')
    ).length,
    issues: issues.length,
    decisions: decisions.length,
  };
}

export function syncEvidenceIssueLinks(issues, evidence) {
  const fileToIssues = new Map();

  for (const issue of issues) {
    for (const item of issue.evidence || []) {
      if (!item?.file) {
        continue;
      }
      if (!fileToIssues.has(item.file)) {
        fileToIssues.set(item.file, new Set());
      }
      fileToIssues.get(item.file).add(String(issue.id));
    }
  }

  for (const row of evidence) {
    const linked = fileToIssues.get(row.file);
    row.issues = linked ? [...linked].sort() : [];
  }
}

export function mediaUrl(name) {
  return `../media/${encodeURIComponent(name)}`;
}

export function inferMediaType(filename) {
  return filename.toLowerCase().endsWith('.mp4') ? 'video' : 'image';
}

export function suggestIssueId(phase, issues) {
  const prefix = `${phase}.`;
  const numbers = issues
    .filter((issue) => String(issue.id).startsWith(prefix))
    .map((issue) => Number(String(issue.id).split('.')[1]) || 0);
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `${phase}.${next}`;
}
