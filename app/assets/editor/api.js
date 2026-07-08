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
    payload = data.map((issue) => {
      const { key, id, sprint, ...rest } = issue;
      return {
        key: String(key),
        id: String(id),
        sprint: Number(sprint),
        ...rest,
      };
    });
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
      fileToIssues.get(item.file).add(String(issue.key));
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

export function phaseOrder(audit, issues) {
  const fromAudit = (audit?.sprints || []).map((sprint) => Number(sprint.id));
  const seen = new Set(fromAudit);
  const extras = [];

  for (const issue of issues) {
    const phaseId = Number(issue.sprint);
    if (!Number.isFinite(phaseId) || seen.has(phaseId)) {
      continue;
    }
    seen.add(phaseId);
    extras.push(phaseId);
  }

  return [...fromAudit, ...extras.sort((a, b) => a - b)];
}

export function issuesByPhase(issues, audit) {
  const buckets = new Map();

  for (const issue of issues) {
    const phaseId = Number(issue.sprint);
    const key = String(phaseId);
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key).push(issue);
  }

  return phaseOrder(audit, issues)
    .map((phaseId) => ({
      id: phaseId,
      issues: buckets.get(String(phaseId)) || [],
    }))
    .filter((group) => group.issues.length > 0);
}

export function compactIssueIds(issues, audit, phaseIds = null) {
  const phases = phaseIds ?? phaseOrder(audit, issues);

  for (const phaseId of phases) {
    let sequence = 1;
    for (const issue of issues) {
      if (Number(issue.sprint) === phaseId) {
        issue.id = `${phaseId}.${sequence}`;
        sequence += 1;
      }
    }
  }
}

export function flattenIssuesFromGroups(issues, audit, phaseGroups) {
  const byKey = new Map(issues.map((issue) => [String(issue.key), issue]));
  const result = [];
  const used = new Set();
  const touchedPhases = new Set();

  for (const group of phaseGroups) {
    const phaseId = Number(group.id);
    touchedPhases.add(phaseId);

    for (const key of group.keys) {
      const issue = byKey.get(String(key));
      if (!issue) {
        continue;
      }
      issue.sprint = phaseId;
      result.push(issue);
      used.add(String(key));
    }
  }

  for (const issue of issues) {
    if (!used.has(String(issue.key))) {
      result.push(issue);
      touchedPhases.add(Number(issue.sprint));
    }
  }

  compactIssueIds(result, audit, [...touchedPhases]);
  return result;
}

export function appendIssueToPhase(issues, audit, issue) {
  const phaseId = Number(issue.sprint);
  const rest = issues.filter((item) => item.key !== issue.key);
  const groups = issuesByPhase(rest, audit).map((group) => ({
    id: group.id,
    keys: group.issues.map((item) => item.key),
  }));

  let targetGroup = groups.find((group) => group.id === phaseId);
  if (!targetGroup) {
    targetGroup = { id: phaseId, keys: [] };
    groups.push(targetGroup);
    groups.sort((a, b) => phaseOrder(audit, issues).indexOf(a.id) - phaseOrder(audit, issues).indexOf(b.id));
  }

  targetGroup.keys.push(issue.key);
  return flattenIssuesFromGroups([...rest, issue], audit, groups);
}

export function moveIssueToPhaseEnd(issues, audit, issueKey, targetPhaseId) {
  const issue = issues.find((item) => item.key === issueKey);
  if (!issue) {
    return issues;
  }

  issue.sprint = Number(targetPhaseId);
  return appendIssueToPhase(issues, audit, issue);
}

export function reorderIssuesFromDrop(issues, audit, { draggedKey, targetPhaseId, insertBeforeKey = null }) {
  const groups = issuesByPhase(issues, audit).map((group) => ({
    id: group.id,
    keys: group.issues.map((issue) => issue.key),
  }));

  for (const group of groups) {
    group.keys = group.keys.filter((key) => key !== draggedKey);
  }

  let targetGroup = groups.find((group) => group.id === Number(targetPhaseId));
  if (!targetGroup) {
    targetGroup = { id: Number(targetPhaseId), keys: [] };
    groups.push(targetGroup);
  }

  if (insertBeforeKey) {
    const index = targetGroup.keys.indexOf(insertBeforeKey);
    targetGroup.keys.splice(index >= 0 ? index : targetGroup.keys.length, 0, draggedKey);
  } else {
    targetGroup.keys.push(draggedKey);
  }

  return flattenIssuesFromGroups(issues, audit, groups);
}

export function newIssueKey() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  throw new Error('crypto.randomUUID is required to create Issue keys.');
}
