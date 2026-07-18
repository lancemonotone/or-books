const yaml = window.jsyaml;

export function dumpYaml(data, file = "") {
  let payload = data;

  if (file === "tasks" && Array.isArray(data)) {
    payload = data.map((task) => {
      const { key, id, sprint, ...rest } = task;
      return {
        key: String(key),
        id: String(id),
        sprint: Number(sprint),
        ...rest,
      };
    });
  }

  if (file === "decisions" && Array.isArray(data)) {
    payload = data.map((decision) => {
      const { id, key, blocks, ...rest } = decision;
      return {
        key: String(key),
        ...rest,
        blocks: (blocks || []).map(String),
      };
    });
  }

  if (file === "audit" && payload && typeof payload === "object") {
    const { stats: _stats, slug: _slug, ...rest } = payload;
    payload = rest;
  }

  return yaml.dump(payload, { lineWidth: -1, noRefs: true });
}

export function parseYaml(text) {
  return yaml.load(text);
}

export function syncEvidenceTaskLinks(tasks, evidence) {
  const fileToTasks = new Map();

  for (const task of tasks) {
    for (const item of task.evidence || []) {
      if (!item?.file) {
        continue;
      }
      if (!fileToTasks.has(item.file)) {
        fileToTasks.set(item.file, new Set());
      }
      fileToTasks.get(item.file).add(String(task.key));
    }
  }

  for (const row of evidence) {
    const linked = fileToTasks.get(row.file);
    row.tasks = linked ? [...linked].sort() : [];
  }
}

export function syncTaskEvidenceFromGallery(tasks, evidence) {
  for (const row of evidence) {
    if (!row?.file) {
      continue;
    }

    const linkedKeys = new Set((row.tasks || []).map(String));

    for (const task of tasks) {
      const taskKey = String(task.key);
      const evidenceItems = task.evidence || [];
      const index = evidenceItems.findIndex((item) => item?.file === row.file);
      const isLinked = linkedKeys.has(taskKey);

      if (isLinked && index < 0) {
        task.evidence = [...evidenceItems, { file: row.file }];
      } else if (!isLinked && index >= 0) {
        task.evidence = evidenceItems.filter((item) => item?.file !== row.file);
      }
    }
  }
}

export function inferMediaType(filename) {
  return filename.toLowerCase().endsWith(".mp4") ? "video" : "image";
}

export function isValidHttpUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) {
    return false;
  }
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function suggestTaskId(phase, tasks) {
  const prefix = `${phase}.`;
  const numbers = tasks
    .filter((task) => String(task.id).startsWith(prefix))
    .map((task) => Number(String(task.id).split(".")[1]) || 0);
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `${phase}.${next}`;
}

export function phaseOrder(audit, tasks) {
  const fromAudit = (audit?.sprints || []).map((sprint) => Number(sprint.id));
  const seen = new Set(fromAudit);
  const extras = [];

  for (const task of tasks) {
    const phaseId = Number(task.sprint);
    if (!Number.isFinite(phaseId) || seen.has(phaseId)) {
      continue;
    }
    seen.add(phaseId);
    extras.push(phaseId);
  }

  return [...fromAudit, ...extras.sort((a, b) => a - b)];
}

export function tasksByPhase(tasks, audit) {
  const buckets = new Map();

  for (const task of tasks) {
    const phaseId = Number(task.sprint);
    const key = String(phaseId);
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key).push(task);
  }

  return phaseOrder(audit, tasks)
    .map((phaseId) => ({
      id: phaseId,
      tasks: buckets.get(String(phaseId)) || [],
    }))
    .filter((group) => group.tasks.length > 0);
}

export function compactTaskIds(tasks, audit, phaseIds = null) {
  const phases = phaseIds ?? phaseOrder(audit, tasks);

  for (const phaseId of phases) {
    let sequence = 1;
    for (const task of tasks) {
      if (Number(task.sprint) === Number(phaseId)) {
        task.id = `${phaseId}.${sequence}`;
        sequence += 1;
      }
    }
  }
}

function normalizePhaseId(value) {
  const phaseId = Number(value);
  return Number.isFinite(phaseId) ? phaseId : null;
}

function findPhaseGroup(groups, phaseId) {
  const target = normalizePhaseId(phaseId);
  if (target === null) {
    return null;
  }
  return groups.find((group) => normalizePhaseId(group.id) === target) || null;
}

function ensurePhaseGroup(groups, audit, tasks, phaseId) {
  const normalized = normalizePhaseId(phaseId);
  if (normalized === null) {
    return null;
  }

  let group = findPhaseGroup(groups, normalized);
  if (!group) {
    group = { id: normalized, keys: [] };
    groups.push(group);
    const order = phaseOrder(audit, tasks);
    groups.sort(
      (a, b) =>
        order.indexOf(normalizePhaseId(a.id)) -
        order.indexOf(normalizePhaseId(b.id)),
    );
  }
  return group;
}

export function flattenTasksFromGroups(tasks, audit, phaseGroups) {
  const byKey = new Map(tasks.map((task) => [String(task.key), task]));
  const result = [];
  const used = new Set();

  for (const group of phaseGroups) {
    const phaseId = normalizePhaseId(group.id);
    if (phaseId === null) {
      continue;
    }

    for (const key of group.keys) {
      const task = byKey.get(String(key));
      if (!task) {
        continue;
      }
      task.sprint = phaseId;
      result.push(task);
      used.add(String(key));
    }
  }

  for (const task of tasks) {
    if (!used.has(String(task.key))) {
      result.push(task);
    }
  }

  compactTaskIds(result, audit);
  return result;
}

export function appendTaskToPhase(tasks, audit, task) {
  const phaseId = Number(task.sprint);
  const rest = tasks.filter((item) => item.key !== task.key);
  const groups = tasksByPhase(rest, audit).map((group) => ({
    id: group.id,
    keys: group.tasks.map((item) => item.key),
  }));

  let targetGroup = groups.find((group) => group.id === phaseId);
  if (!targetGroup) {
    targetGroup = { id: phaseId, keys: [] };
    groups.push(targetGroup);
    groups.sort(
      (a, b) =>
        phaseOrder(audit, tasks).indexOf(a.id) -
        phaseOrder(audit, tasks).indexOf(b.id),
    );
  }

  targetGroup.keys.push(task.key);
  return flattenTasksFromGroups([...rest, task], audit, groups);
}

export function moveTaskToPhaseEnd(tasks, audit, taskKey, targetPhaseId) {
  const task = tasks.find((item) => item.key === taskKey);
  if (!task) {
    return tasks;
  }

  task.sprint = Number(targetPhaseId);
  return appendTaskToPhase(tasks, audit, task);
}

export function reorderTasksFromDrop(
  tasks,
  audit,
  { draggedKey, targetPhaseId, insertBeforeKey = null },
) {
  const normalizedTarget = normalizePhaseId(targetPhaseId);
  if (normalizedTarget === null) {
    return tasks;
  }

  const groups = tasksByPhase(tasks, audit).map((group) => ({
    id: normalizePhaseId(group.id),
    keys: group.tasks.map((task) => task.key),
  }));

  for (const group of groups) {
    group.keys = group.keys.filter((key) => key !== draggedKey);
  }

  const targetGroup = ensurePhaseGroup(groups, audit, tasks, normalizedTarget);
  if (!targetGroup) {
    return tasks;
  }

  if (insertBeforeKey) {
    const index = targetGroup.keys.indexOf(insertBeforeKey);
    targetGroup.keys.splice(
      index >= 0 ? index : targetGroup.keys.length,
      0,
      draggedKey,
    );
  } else {
    targetGroup.keys.push(draggedKey);
  }

  return flattenTasksFromGroups(tasks, audit, groups);
}

function uuidV4FromBytes(bytes) {
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function uuidV4FromMathRandom() {
  const bytes = new Uint8Array(16);
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] = Math.trunc(Math.random() * 256);
  }
  return uuidV4FromBytes(bytes);
}

export function newTaskKey() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.getRandomValues === "function"
  ) {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return uuidV4FromBytes(bytes);
  }
  return uuidV4FromMathRandom();
}
