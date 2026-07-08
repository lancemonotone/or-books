import { inferMediaType, mediaUrl, suggestIssueId } from './api.js';

let dialog;
let form;
let closeButton;
let previewNode;
let linkedNode;
let statusNode;
let onCreate = null;
let issuesRef = [];
let mediaFile = '';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function sprintOptions(audit, selectedPhase) {
  return (audit.sprints || [])
    .map((sprint) => {
      const selected = Number(sprint.id) === Number(selectedPhase) ? ' selected' : '';
      return `<option value="${escapeHtml(String(sprint.id))}"${selected}>Phase ${escapeHtml(String(sprint.id))} — ${escapeHtml(sprint.title)}</option>`;
    })
    .join('');
}

function phaseTitle(audit, phaseId) {
  const sprint = (audit?.sprints || []).find((item) => String(item.id) === String(phaseId));
  if (sprint?.title) {
    return `Phase ${sprint.id} — ${sprint.title}`;
  }
  return `Phase ${phaseId}`;
}

function groupIssuesByPhase(issues, audit) {
  const groups = new Map();

  for (const issue of issues || []) {
    const phaseId = issue.sprint ?? '?';
    const key = String(phaseId);
    if (!groups.has(key)) {
      groups.set(key, {
        id: phaseId,
        title: phaseTitle(audit, phaseId),
        issues: [],
      });
    }
    groups.get(key).issues.push(issue);
  }

  const sprintOrder = (audit?.sprints || []).map((sprint) => String(sprint.id));
  return [...groups.values()].sort((a, b) => {
    const indexA = sprintOrder.indexOf(String(a.id));
    const indexB = sprintOrder.indexOf(String(b.id));
    if (indexA === -1 && indexB === -1) {
      return Number(a.id) - Number(b.id);
    }
    if (indexA === -1) {
      return 1;
    }
    if (indexB === -1) {
      return -1;
    }
    return indexA - indexB;
  });
}

function ensureElements() {
  dialog = document.getElementById('issue-composer');
  form = document.getElementById('issue-composer-form');
  closeButton = document.getElementById('issue-composer-close');
  linkedNode = document.getElementById('issue-composer-linked');
  previewNode = document.getElementById('issue-composer-preview');
  statusNode = document.getElementById('issue-composer-status');
}

function renderLinkedIssues(linkedIssueIds, allIssues, audit) {
  const linked = (linkedIssueIds || [])
    .map((id) => allIssues.find((issue) => String(issue.id) === String(id)))
    .filter(Boolean);

  if (!linked.length) {
    return `
      <p class="issue-composer__linked-label">Linked issues</p>
      <p class="issue-composer__linked-empty">None</p>`;
  }

  const groups = groupIssuesByPhase(linked, audit)
    .map((group) => {
      const items = group.issues
        .map(
          (issue) => `
          <li>
            <button type="button" class="issue-composer__linked-link" data-issue-id="${escapeHtml(issue.id)}">
              <span class="issue-composer__linked-id">${escapeHtml(issue.id)}</span>
              <span class="issue-composer__linked-title">${escapeHtml(issue.title)}</span>
            </button>
          </li>`
        )
        .join('');

      return `
        <div class="issue-composer__linked-group">
          <p class="issue-composer__linked-group-title">${escapeHtml(group.title)}</p>
          <ul class="issue-composer__linked-list">${items}</ul>
        </div>`;
    })
    .join('');

  return `
    <p class="issue-composer__linked-label">Linked issues</p>
    <p class="issue-composer__linked-hint">Click to edit in Issues</p>
    <div class="issue-composer__linked-groups">${groups}</div>`;
}

function bindLinkedIssueLinks(onOpenIssue) {
  if (!linkedNode || !onOpenIssue) {
    return;
  }

  linkedNode.querySelectorAll('[data-issue-id]').forEach((button) => {
    button.addEventListener('click', () => {
      const issueId = button.dataset.issueId;
      dialog?.close();
      onOpenIssue(issueId);
    });
  });
}

function setLinkedIssues(linkedIssueIds, allIssues, onOpenIssue, audit) {
  if (!linkedNode) {
    return;
  }
  linkedNode.innerHTML = renderLinkedIssues(linkedIssueIds, allIssues, audit);
  bindLinkedIssueLinks(onOpenIssue);
}

function setComposerStatus(message, isError = false) {
  if (!statusNode) {
    return;
  }
  statusNode.textContent = message;
  statusNode.classList.toggle('is-error', isError);
}

export function initIssueComposer() {
  ensureElements();
  if (!dialog || !form) {
    return;
  }

  closeButton?.addEventListener('click', () => {
    dialog.close();
  });

  form.querySelector('[data-action="cancel"]')?.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    onCreate = null;
    issuesRef = [];
    mediaFile = '';
    form.reset();
    setComposerStatus('');
    if (previewNode) {
      previewNode.innerHTML = '';
    }
    if (linkedNode) {
      linkedNode.innerHTML = '';
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!onCreate) {
      return;
    }

    const phase = Number(form.querySelector('[name="sprint"]')?.value || 1);
    const title = form.querySelector('[name="title"]')?.value?.trim() || '';
    const problem = form.querySelector('[name="problem"]')?.value?.trim() || '';
    const recommendation = form.querySelector('[name="recommendation"]')?.value?.trim() || '';
    const impact = form.querySelector('[name="impact"]')?.value || 'medium';

    if (!title) {
      setComposerStatus('Title is required.', true);
      return;
    }

    const issue = {
      id: suggestIssueId(phase, issuesRef),
      sprint: phase,
      title,
      impact,
      effort: 'low',
      status: 'planned',
      tags: [],
      problem,
      recommendation,
      acceptance: [],
      evidence: [{ file: mediaFile }],
    };

    onCreate(issue);
    dialog.close();
  });
}

export function openIssueComposer({
  audit,
  issues,
  file,
  linkedIssueIds = [],
  onOpenIssue,
  onCreate: createHandler,
}) {
  ensureElements();
  if (!dialog || !form) {
    return;
  }

  issuesRef = issues;
  mediaFile = file;
  onCreate = createHandler;

  const defaultPhase = audit.sprints?.[0]?.id ?? 1;
  const sprintSelect = form.querySelector('[name="sprint"]');
  if (sprintSelect) {
    sprintSelect.innerHTML = sprintOptions(audit, defaultPhase);
  }

  form.querySelector('[name="title"]').value = '';
  form.querySelector('[name="problem"]').value = '';
  form.querySelector('[name="recommendation"]').value = '';
  form.querySelector('[name="impact"]').value = 'medium';
  setLinkedIssues(linkedIssueIds, issues, onOpenIssue, audit);
  if (previewNode) {
    const isVideo = inferMediaType(file) === 'video';
    previewNode.innerHTML = isVideo
      ? `<video controls preload="metadata" src="${mediaUrl(file)}"></video>`
      : `<img src="${mediaUrl(file)}" alt="">`;
  }
  setComposerStatus('');

  dialog.showModal();
  form.querySelector('[name="title"]')?.focus();
}
