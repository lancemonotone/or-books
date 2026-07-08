import {
  appendIssueToPhase,
  inferMediaType,
  mediaUrl,
  moveIssueToPhaseEnd,
  newIssueKey,
  reorderIssuesFromDrop,
} from './api.js';
import { openIssueComposer } from './issue-composer.js';
import { openMediaFilePicker, renderMediaChip } from './picker.js';

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function field(label, control) {
  return `<label class="editor-field">${label ? `<span class="editor-field__label">${escapeHtml(label)}</span>` : ''}${control}</label>`;
}

function input(name, value, type = 'text', extra = '') {
  return `<input class="editor-input" type="${type}" name="${escapeHtml(name)}" value="${escapeAttr(value)}" ${extra}>`;
}

function textarea(name, value, rows = 4) {
  return `<textarea class="editor-textarea editor-textarea--prose" name="${escapeHtml(name)}" rows="${rows}">${escapeHtml(value)}</textarea>`;
}

function select(name, value, options) {
  const opts = options
    .map((opt) => {
      const val = typeof opt === 'string' ? opt : opt.value;
      const label = typeof opt === 'string' ? opt : opt.label;
      const selected = String(val) === String(value) ? ' selected' : '';
      return `<option value="${escapeAttr(val)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join('');
  return `<select class="editor-select" name="${escapeHtml(name)}">${opts}</select>`;
}

function escapeAttr(value) {
  return escapeHtml(value);
}

function setEditorStatus(message, isError = false) {
  const node = document.getElementById('editor-status');
  if (!node) {
    return;
  }
  node.textContent = message;
  node.classList.toggle('is-error', isError);
}

function evidenceImageTitle(file, galleryEvidence) {
  const row = (galleryEvidence || []).find((item) => item.file === file);
  return row?.page || '';
}

function phaseTitle(audit, phaseId) {
  const sprint = (audit?.sprints || []).find((item) => String(item.id) === String(phaseId));
  if (sprint?.title) {
    return `Phase ${sprint.id} — ${sprint.title}`;
  }
  return `Phase ${phaseId}`;
}

function groupIssuesByPhase(issues, audit) {
  const sprintOrder = (audit?.sprints || []).map((sprint) => String(sprint.id));
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

function renderIssueListItem(issue, ui) {
  return `
    <li class="editor-list__item" data-issue-item data-issue-key="${escapeAttr(issue.key)}">
      <button type="button" class="editor-list__drag" data-drag-handle draggable="true" aria-label="Drag to reorder">⠿</button>
      <button type="button" class="editor-list__btn ${issue.key === ui.selectedIssueKey ? 'is-active' : ''}" data-issue-key="${escapeAttr(issue.key)}">
        <span class="editor-list__id">${escapeHtml(issue.id)}</span>
        <span class="editor-list__title">${escapeHtml(issue.title || 'Untitled')}</span>
      </button>
    </li>`;
}

function renderIssueSidebar(issues, audit, ui, phaseFilter) {
  const filtered = issues.filter((issue) => {
    if (phaseFilter === 'all') {
      return true;
    }
    return String(issue.sprint) === String(phaseFilter);
  });

  if (phaseFilter === 'all') {
    const groups = groupIssuesByPhase(filtered, audit);
    return `
      <div class="editor-issue-groups" data-issue-sidebar>
        ${groups
          .map(
            (group) => `
          <section class="editor-issue-group">
            <h3 class="editor-issue-group__title">${escapeHtml(group.title)}</h3>
            <ul class="editor-list editor-list--nested" data-phase-drop-zone="${escapeAttr(String(group.id))}">
              ${group.issues.map((issue) => renderIssueListItem(issue, ui)).join('')}
            </ul>
          </section>`
          )
          .join('')}
      </div>`;
  }

  return `
    <ul
      class="editor-list editor-list--nested"
      data-issue-sidebar
      data-single-phase="${escapeAttr(String(phaseFilter))}"
      data-phase-drop-zone="${escapeAttr(String(phaseFilter))}"
    >
      ${filtered.map((issue) => renderIssueListItem(issue, ui)).join('')}
    </ul>`;
}

function replaceIssuesArray(issues, nextIssues) {
  issues.splice(0, issues.length, ...nextIssues);
}

function bindIssueSidebarDnD(container, { issues, audit, phaseFilter, onReorder }) {
  if (!container) {
    return;
  }

  const allowCrossPhase = phaseFilter === 'all';
  let draggedKey = null;

  const clearDropState = () => {
    container.querySelectorAll('.is-dragging, .is-drop-before, .is-drop-after').forEach((node) => {
      node.classList.remove('is-dragging', 'is-drop-before', 'is-drop-after');
    });
  };

  const resolveDropTarget = (target) => {
    const item = target.closest('[data-issue-item]');
    if (item) {
      const zone = item.closest('[data-phase-drop-zone]');
      const phaseId = allowCrossPhase
        ? Number(zone?.dataset.phaseDropZone)
        : Number(container.dataset.singlePhase);
      return {
        targetPhaseId: phaseId,
        insertBeforeKey: item.dataset.issueKey,
      };
    }

    const zone = target.closest('[data-phase-drop-zone]');
    if (zone) {
      return {
        targetPhaseId: Number(zone.dataset.phaseDropZone),
        insertBeforeKey: null,
      };
    }

    return null;
  };

  container.querySelectorAll('[data-drag-handle]').forEach((handle) => {
    handle.addEventListener('dragstart', (event) => {
      const item = handle.closest('[data-issue-item]');
      draggedKey = item?.dataset.issueKey || null;
      if (!draggedKey) {
        return;
      }
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', draggedKey);
      item?.classList.add('is-dragging');
    });

    handle.addEventListener('dragend', () => {
      draggedKey = null;
      clearDropState();
    });
  });

  container.addEventListener('dragover', (event) => {
    if (!draggedKey) {
      return;
    }
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    clearDropState();
    const item = event.target.closest('[data-issue-item]');
    if (item && item.dataset.issueKey !== draggedKey) {
      item.classList.add('is-drop-before');
      return;
    }
    const zone = event.target.closest('[data-phase-drop-zone]');
    if (zone) {
      zone.classList.add('is-drop-after');
    }
  });

  container.addEventListener('dragleave', (event) => {
    const left = event.target.closest('[data-issue-item], [data-phase-drop-zone]');
    if (left && !left.contains(event.relatedTarget)) {
      left.classList.remove('is-drop-before', 'is-drop-after');
    }
  });

  container.addEventListener('drop', (event) => {
    event.preventDefault();
    clearDropState();
    const key = event.dataTransfer.getData('text/plain') || draggedKey;
    if (!key) {
      return;
    }

    const dropTargetInfo = resolveDropTarget(event.target);
    if (!dropTargetInfo || !Number.isFinite(dropTargetInfo.targetPhaseId)) {
      return;
    }

    if (dropTargetInfo.insertBeforeKey === key) {
      return;
    }

    if (!allowCrossPhase) {
      const dragged = issues.find((issue) => issue.key === key);
      if (!dragged || Number(dragged.sprint) !== dropTargetInfo.targetPhaseId) {
        return;
      }
    }

    const next = reorderIssuesFromDrop(issues, audit, {
      draggedKey: key,
      targetPhaseId: dropTargetInfo.targetPhaseId,
      insertBeforeKey: dropTargetInfo.insertBeforeKey,
    });
    onReorder(next);
  });
}

const ICON_EXTERNAL = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
const ICON_REPLACE = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>`;
const ICON_TRASH = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`;

function openEditorLightbox({ file, title = '', isVideo = false, poster = '' }) {
  const dialog = document.getElementById('editor-lightbox');
  const titleNode = document.getElementById('editor-lightbox-title');
  const bodyNode = document.getElementById('editor-lightbox-body');
  if (!dialog || !bodyNode) {
    return;
  }

  if (titleNode) {
    titleNode.textContent = title || file;
  }

  bodyNode.innerHTML = isVideo
    ? `<video controls autoplay src="${mediaUrl(file)}" ${poster ? `poster="${poster}"` : ''}></video>`
    : `<img src="${mediaUrl(file)}" alt="${escapeAttr(title || file)}">`;

  if (!dialog.dataset.bound) {
    dialog.dataset.bound = '1';
    dialog.querySelector('[data-lightbox-close]')?.addEventListener('click', () => {
      dialog.close();
      bodyNode.innerHTML = '';
    });
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) {
        dialog.close();
        bodyNode.innerHTML = '';
      }
    });
    dialog.addEventListener('close', () => {
      bodyNode.innerHTML = '';
    });
  }

  dialog.showModal();
}

function issueOptions(issues) {
  return issues.map((issue) => ({ value: issue.key, label: `${issue.id} — ${issue.title}` }));
}

const ISSUE_STATUS_OPTIONS = [
  { value: 'planned', label: 'Planned' },
  { value: 'blocked', label: 'Waiting on you' },
  { value: 'complete', label: 'Complete' },
];

export function renderAuditView(audit, root, onChange) {
  const sprints = audit.sprints || [];

  root.innerHTML = `
    <section class="editor-section">
      <h2>Overview page</h2>
      <div class="editor-grid editor-grid--2">
        ${field('Title', input('title', audit.title || ''))}
        ${field('Last updated', input('updated', audit.updated || '', 'date'))}
      </div>
      ${field('Introduction', textarea('summary', audit.summary || '', 6))}
      <h3>Phases</h3>
      <div class="editor-stack" id="sprints-list">
        ${sprints
          .map(
            (sprint, index) => `
          <article class="editor-card" data-sprint-index="${index}">
            <div class="editor-grid editor-grid--2">
              ${field('Phase number', input(`sprints.${index}.id`, sprint.id ?? '', 'number', 'min="1" step="1"'))}
              ${field('Short label', input(`sprints.${index}.subtitle`, sprint.subtitle || ''))}
            </div>
            ${field('Phase title', input(`sprints.${index}.title`, sprint.title || ''))}
            ${field('Description', textarea(`sprints.${index}.description`, sprint.description || '', 4))}
          </article>`
          )
          .join('')}
      </div>
      <button type="button" class="editor-button editor-button--ghost" data-action="add-sprint">Add phase</button>
    </section>
  `;

  root.querySelector('[data-action="add-sprint"]')?.addEventListener('click', () => {
    const nextId = sprints.length ? Math.max(...sprints.map((s) => Number(s.id) || 0)) + 1 : 1;
    sprints.push({ id: nextId, title: '', subtitle: '', description: '' });
    onChange();
    renderAuditView(audit, root, onChange);
  });

  root.querySelectorAll('input, textarea, select').forEach((el) => {
    el.addEventListener('input', () => {
      applyAuditForm(audit, root);
      onChange();
    });
    el.addEventListener('change', () => {
      applyAuditForm(audit, root);
      onChange();
    });
  });
}

function applyAuditForm(audit, root) {
  audit.title = root.querySelector('[name="title"]')?.value ?? '';
  audit.updated = root.querySelector('[name="updated"]')?.value ?? '';
  audit.summary = root.querySelector('[name="summary"]')?.value ?? '';
  audit.sprints = [...root.querySelectorAll('[data-sprint-index]')].map((card, index) => ({
    id: Number(card.querySelector(`[name="sprints.${index}.id"]`)?.value || index + 1),
    subtitle: card.querySelector(`[name="sprints.${index}.subtitle"]`)?.value ?? '',
    title: card.querySelector(`[name="sprints.${index}.title"]`)?.value ?? '',
    description: card.querySelector(`[name="sprints.${index}.description"]`)?.value ?? '',
  }));
}

export function renderIssuesView(
  issues,
  audit,
  ui,
  root,
  onChange,
  galleryEvidence = [],
  onNavigateToEvidence,
  onNavigateToIssue
) {
  const selected =
    issues.find((issue) => issue.key === ui.selectedIssueKey) || issues[0] || null;
  if (selected) {
    ui.selectedIssueKey = selected.key;
  }

  const phaseFilter = ui.issuePhaseFilter || 'all';

  root.innerHTML = `
    <div class="editor-split">
      <aside class="editor-sidebar">
        <div class="editor-sidebar__head">
          <h2>Issues</h2>
          <button type="button" class="editor-button editor-button--small" data-action="add-issue">Add issue</button>
        </div>
        ${field(
          'Phase filter',
          select(
            'phase-filter',
            phaseFilter,
            [{ value: 'all', label: 'All phases' }].concat(
              (audit.sprints || []).map((s) => ({ value: String(s.id), label: `Phase ${s.id}` }))
            )
          )
        )}
        ${renderIssueSidebar(issues, audit, ui, phaseFilter)}
      </aside>
      <div class="editor-detail" id="issue-detail">
        ${selected ? renderIssueForm(selected, audit, galleryEvidence) : '<p class="editor-lede">Add an issue to get started.</p>'}
      </div>
    </div>
  `;

  const rerender = () => {
    renderIssuesView(issues, audit, ui, root, onChange, galleryEvidence, onNavigateToEvidence, onNavigateToIssue);
  };

  const onReorder = (nextIssues) => {
    replaceIssuesArray(issues, nextIssues);
    onChange();
    rerender();
  };

  root.querySelector('[name="phase-filter"]')?.addEventListener('change', (event) => {
    ui.issuePhaseFilter = event.target.value;
    rerender();
  });

  bindIssueSidebarDnD(root.querySelector('[data-issue-sidebar]'), {
    issues,
    audit,
    phaseFilter,
    onReorder,
  });

  root.querySelectorAll('[data-issue-key]').forEach((button) => {
    if (button.matches('[data-drag-handle]')) {
      return;
    }
    button.addEventListener('click', () => {
      const issueKey = button.dataset.issueKey;
      if (issueKey === ui.selectedIssueKey) {
        return;
      }
      onNavigateToIssue?.(issueKey);
    });
  });

  root.querySelector('[data-action="add-issue"]')?.addEventListener('click', () => {
    const phase = phaseFilter === 'all' ? 1 : Number(phaseFilter);
    const issue = {
      key: newIssueKey(),
      id: '0.0',
      sprint: phase,
      title: 'New issue',
      impact: 'medium',
      effort: 'low',
      status: 'planned',
      tags: [],
      problem: '',
      recommendation: '',
      acceptance: [],
      evidence: [],
    };
    const ordered = appendIssueToPhase(issues, audit, issue);
    replaceIssuesArray(issues, ordered);
    onChange();
    onNavigateToIssue?.(issue.key);
  });

  if (!selected) {
    return;
  }

  bindIssueForm(selected, issues, audit, galleryEvidence, root, onChange, rerender, onNavigateToEvidence);
}

function renderIssueForm(issue, audit, galleryEvidence = []) {
  const evidenceCards = (issue.evidence || [])
    .map((item, index) => {
      const title = evidenceImageTitle(item.file, galleryEvidence);
      const galleryRow = (galleryEvidence || []).find((row) => row.file === item.file);
      const isVideo =
        galleryRow?.type === 'video' || String(item.file || '').toLowerCase().endsWith('.mp4');
      const poster = galleryRow?.poster ? mediaUrl(galleryRow.poster) : '';
      const preview = isVideo
        ? `<video preload="metadata" src="${mediaUrl(item.file)}" ${poster ? `poster="${poster}"` : ''} muted playsinline></video>`
        : `<img src="${mediaUrl(item.file)}" alt="${escapeAttr(title || item.file)}" loading="lazy">`;

      return `
      <article class="issue-media-card" data-evidence-index="${index}">
        <div class="issue-media-card__frame">
          <button
            type="button"
            class="issue-media-card__preview"
            data-action="preview-evidence"
            data-file="${escapeAttr(item.file)}"
            data-title="${escapeAttr(title || item.file)}"
            data-video="${isVideo ? '1' : '0'}"
            ${poster ? `data-poster="${escapeAttr(poster)}"` : ''}
            aria-label="Open ${escapeAttr(title || item.file)}"
          >${preview}</button>
          <div class="issue-media-card__actions">
            <button type="button" class="issue-media-icon" data-open-media="${escapeAttr(item.file)}" aria-label="Open in Media" title="Open in Media">${ICON_EXTERNAL}</button>
            <button type="button" class="issue-media-icon" data-action="pick-evidence" data-index="${index}" aria-label="Change file" title="Change file">${ICON_REPLACE}</button>
            <button type="button" class="issue-media-icon issue-media-icon--danger" data-action="remove-evidence" data-index="${index}" aria-label="Remove" title="Remove">${ICON_TRASH}</button>
          </div>
        </div>
        <div class="issue-media-card__meta">
          <p class="issue-media-card__file">${escapeHtml(item.file)}</p>
          ${title ? `<p class="issue-media-card__title">${escapeHtml(title)}</p>` : ''}
        </div>
      </article>`;
    })
    .join('');

  const acceptance = (issue.acceptance || [])
    .map(
      (line, index) => `
      <div class="list-row" data-acceptance-index="${index}">
        ${input(`acceptance.${index}`, line)}
        <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="remove-acceptance" data-index="${index}">Remove</button>
      </div>`
    )
    .join('');

  return `
    <form class="editor-detail-form issue-editor-layout" id="issue-form">
      <div class="issue-editor-layout__primary">
        <div class="editor-detail__head">
          <h2>${escapeHtml(issue.id)}: ${escapeHtml(issue.title || 'Untitled')}</h2>
        </div>
        <div class="editor-grid editor-grid--2">
          ${field('Phase', select('sprint', issue.sprint, (audit.sprints || []).map((s) => ({ value: s.id, label: `Phase ${s.id} — ${s.title}` }))))}
        </div>
        ${field('Title', input('title', issue.title || ''))}
        <div class="editor-grid editor-grid--3">
          ${field('Urgency', select('impact', issue.impact, ['critical', 'high', 'medium', 'low']))}
          ${field('Effort (internal)', select('effort', issue.effort, ['low', 'medium', 'high']))}
          ${field('Status', select('status', issue.status, ISSUE_STATUS_OPTIONS))}
        </div>
        ${field('Tags (comma separated)', input('tags', (issue.tags || []).join(', ')))}
        ${field('What we found', textarea('problem', issue.problem || '', 5))}
        ${field('What we suggest', textarea('recommendation', issue.recommendation || '', 5))}
        <section class="editor-subsection">
          <div class="editor-subsection__head">
            <h3>Done when (internal)</h3>
            <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="add-acceptance">Add line</button>
          </div>
          <div class="editor-stack">${acceptance || '<p class="editor-muted">No checklist lines yet.</p>'}</div>
        </section>
      </div>
      <aside class="issue-editor-layout__media">
        <div class="editor-subsection__head">
          <div class="editor-subsection__intro">
            <h3>Media</h3>
            <p class="editor-subsection__hint">Screenshots and videos for this issue.</p>
          </div>
          <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="add-evidence">Add media</button>
        </div>
        <div class="issue-media-stack">${evidenceCards || '<p class="editor-muted">No media linked yet.</p>'}</div>
      </aside>
    </form>
  `;
}

function bindIssueForm(issue, issues, audit, galleryEvidence, root, onChange, rerender, onNavigateToEvidence) {
  const detail = root.querySelector('#issue-detail');
  if (!detail) {
    return;
  }

  detail.querySelectorAll('input, textarea, select').forEach((el) => {
    el.addEventListener('input', () => {
      applyIssueForm(issue, root);
      onChange();
    });
    el.addEventListener('change', () => {
      if (el.name === 'sprint') {
        const previousPhase = issue.sprint;
        applyIssueForm(issue, root);
        if (Number(issue.sprint) !== Number(previousPhase)) {
          const ordered = moveIssueToPhaseEnd(issues, audit, issue.key, issue.sprint);
          replaceIssuesArray(issues, ordered);
        }
        onChange();
        rerender();
        return;
      }
      applyIssueForm(issue, root);
      onChange();
    });
  });

  detail.querySelector('[data-action="add-acceptance"]')?.addEventListener('click', () => {
    applyIssueForm(issue, root);
    issue.acceptance = issue.acceptance || [];
    issue.acceptance.push('');
    onChange();
    rerender();
  });

  detail.querySelectorAll('[data-action="remove-acceptance"]').forEach((button) => {
    button.addEventListener('click', () => {
      applyIssueForm(issue, root);
      issue.acceptance.splice(Number(button.dataset.index), 1);
      onChange();
      rerender();
    });
  });

  detail.querySelector('[data-action="add-evidence"]')?.addEventListener('click', () => {
    applyIssueForm(issue, root);
    const linkedFiles = (issue.evidence || []).map((item) => item.file).filter(Boolean);
    openMediaFilePicker({
      blockedFiles: linkedFiles,
      callback: (file) => {
        issue.evidence = issue.evidence || [];
        if (issue.evidence.some((item) => item.file === file)) {
          setEditorStatus(`${file} is already linked to this issue.`, true);
          return;
        }
        issue.evidence.push({ file });
        onChange();
        rerender();
      },
    });
  });

  detail.querySelectorAll('[data-action="pick-evidence"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      applyIssueForm(issue, root);
      const index = Number(button.dataset.index);
      openMediaFilePicker({
        blockedFiles: (issue.evidence || [])
          .filter((_, itemIndex) => itemIndex !== index)
          .map((item) => item.file)
          .filter(Boolean),
        callback: (file) => {
          issue.evidence[index].file = file;
          onChange();
          rerender();
        },
      });
    });
  });

  detail.querySelectorAll('[data-action="remove-evidence"]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      applyIssueForm(issue, root);
      issue.evidence.splice(Number(button.dataset.index), 1);
      onChange();
      rerender();
    });
  });

  detail.querySelectorAll('[data-open-media]').forEach((button) => {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      applyIssueForm(issue, root);
      onNavigateToEvidence?.(button.dataset.openMedia);
    });
  });

  detail.querySelectorAll('[data-action="preview-evidence"]').forEach((button) => {
    button.addEventListener('click', () => {
      openEditorLightbox({
        file: button.dataset.file,
        title: button.dataset.title || '',
        isVideo: button.dataset.video === '1',
        poster: button.dataset.poster || '',
      });
    });
  });
}

function applyIssueForm(issue, root) {
  const form = root.querySelector('#issue-form');
  if (!form) {
    return;
  }

  issue.sprint = Number(form.querySelector('[name="sprint"]')?.value || issue.sprint);
  issue.title = form.querySelector('[name="title"]')?.value ?? '';
  issue.impact = form.querySelector('[name="impact"]')?.value ?? 'medium';
  issue.effort = form.querySelector('[name="effort"]')?.value ?? 'low';
  issue.status = form.querySelector('[name="status"]')?.value ?? 'planned';
  issue.tags = (form.querySelector('[name="tags"]')?.value || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
  issue.problem = form.querySelector('[name="problem"]')?.value ?? '';
  issue.recommendation = form.querySelector('[name="recommendation"]')?.value ?? '';
  issue.acceptance = [...form.querySelectorAll('[data-acceptance-index] input')].map((el) => el.value);
  issue.evidence = [...form.querySelectorAll('.issue-media-card[data-evidence-index]')].map((row, index) => ({
    file: issue.evidence?.[index]?.file || '',
  }));
}

export function renderEvidenceView(
  evidence,
  issues,
  audit,
  ui,
  root,
  onChange,
  onNavigateToIssue,
  onNavigateToEvidence
) {
  const selectedIndex = ui.selectedEvidenceIndex ?? 0;
  const selected = evidence[selectedIndex] || null;

  root.innerHTML = `
    <div class="editor-split">
      <aside class="editor-sidebar">
        <div class="editor-sidebar__head">
          <h2>Media index</h2>
          <button type="button" class="editor-button editor-button--small" data-action="add-evidence-row">Add file</button>
        </div>
        <ul class="editor-list">
          ${evidence
            .map(
              (row, index) => `
            <li>
              <button type="button" class="editor-list__btn ${index === selectedIndex ? 'is-active' : ''}" data-evidence-index="${index}">
                <span class="editor-list__id">${escapeHtml(row.file)}</span>
                <span class="editor-list__title">${escapeHtml(row.page || 'No title')}</span>
              </button>
            </li>`
            )
            .join('')}
        </ul>
      </aside>
      <div class="editor-detail" id="evidence-detail">
        ${selected ? renderEvidenceForm(selected, issues, audit) : '<p class="editor-lede">Add a file from media.</p>'}
      </div>
    </div>
  `;

  root.querySelector('[data-action="add-evidence-row"]')?.addEventListener('click', () => {
    openMediaFilePicker({
      callback: (file) => {
        const existingIndex = evidence.findIndex((row) => row.file === file);
        if (existingIndex >= 0) {
          setEditorStatus(`${file} is already in the gallery — opened that entry.`);
          onNavigateToEvidence?.(file);
          return;
        }
        evidence.push({
          file,
          type: inferMediaType(file),
          page: '',
          issues: [],
        });
        onChange();
        onNavigateToEvidence?.(file);
      },
    });
  });

  root.querySelectorAll('[data-evidence-index]').forEach((button) => {
    button.addEventListener('click', () => {
      const index = Number(button.dataset.evidenceIndex);
      if (index === selectedIndex) {
        return;
      }
      const file = evidence[index]?.file;
      onNavigateToEvidence?.(file);
    });
  });

  if (!selected) {
    return;
  }

  bindEvidenceForm(selected, evidence, issues, audit, root, onChange, () => {
    renderEvidenceView(evidence, issues, audit, ui, root, onChange, onNavigateToIssue, onNavigateToEvidence);
  }, onNavigateToIssue);
}

function renderEvidenceForm(row, issues, audit) {
  const linkedGroups = groupIssuesByPhase(issues, audit)
    .map((group) => {
      const rows = group.issues
        .map(
          (issue) => `
          <div class="editor-linked-check">
            <label class="editor-check editor-check--solo">
              <input type="checkbox" name="issues" value="${escapeAttr(issue.key)}" ${(row.issues || []).includes(issue.key) ? 'checked' : ''} aria-label="Link issue ${escapeAttr(issue.id)}">
            </label>
            <button type="button" class="issue-composer__linked-link editor-linked-check__open" data-open-issue="${escapeAttr(issue.key)}">
              <span class="issue-composer__linked-id">${escapeHtml(issue.id)}</span>
              <span class="issue-composer__linked-title">${escapeHtml(issue.title)}</span>
            </button>
          </div>`
        )
        .join('');

      return `
        <div class="editor-linked-group">
          <p class="editor-linked-group__title">${escapeHtml(group.title)}</p>
          <div class="editor-linked-checks">${rows}</div>
        </div>`;
    })
    .join('');

  return `
    <form class="editor-detail-form" id="evidence-form">
      <div class="editor-detail__head">
        <h2>${escapeHtml(row.file)}</h2>
        <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="delete-evidence-row">Remove media</button>
      </div>
      <div class="evidence-editor-layout">
        <div class="evidence-editor-layout__preview">
          <div class="media-chip media-chip--large">
            ${
              row.type === 'video' || row.file.endsWith('.mp4')
                ? `<video controls preload="metadata" src="${mediaUrl(row.file)}" ${row.poster ? `poster="${mediaUrl(row.poster)}"` : ''}></video>`
                : `<img src="${mediaUrl(row.file)}" alt="">`
            }
          </div>
        </div>
        <div class="evidence-editor-layout__fields">
          <div class="editor-grid editor-grid--2">
            ${field('Filename', `<div class="editor-readonly">${escapeHtml(row.file)} <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="pick-file">Change file</button></div>`)}
            ${field('Type', select('type', row.type || inferMediaType(row.file), ['image', 'video']))}
          </div>
          ${field('Image title', input('page', row.page || ''))}
          ${
            row.type === 'video' || row.file.endsWith('.mp4')
              ? field(
                  'Poster image',
                  `<div class="poster-field">
                    ${row.poster ? renderMediaChip(row.poster) : '<span class="editor-muted">None</span>'}
                    <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="pick-poster">Choose poster</button>
                    ${row.poster ? '<button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="clear-poster">Clear</button>' : ''}
                  </div>`
                )
              : ''
          }
          <label class="editor-check">
            <input type="checkbox" name="reviewed" ${row.reviewed === false ? '' : 'checked'}>
            <span>Reviewed</span>
          </label>
          <section class="editor-subsection">
            <div class="editor-subsection__head">
              <h3>Linked issues</h3>
              <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="compose-issue">Add issue</button>
            </div>
            <p class="editor-subsection__hint">Check to link. Click a title to edit the issue.</p>
            <div class="editor-linked-groups">${linkedGroups || '<p class="editor-muted">No issues yet.</p>'}</div>
          </section>
        </div>
      </div>
    </form>
  `;
}

function bindEvidenceForm(row, evidence, issues, audit, root, onChange, rerender, onNavigateToIssue) {
  const detail = root.querySelector('#evidence-detail');
  if (!detail) {
    return;
  }

  detail.querySelectorAll('input, textarea, select').forEach((el) => {
    el.addEventListener('input', () => {
      applyEvidenceForm(row, root);
      onChange();
      if (el.name === 'type') {
        rerender();
      }
    });
    el.addEventListener('change', () => {
      applyEvidenceForm(row, root);
      onChange();
      if (el.name === 'type') {
        rerender();
      }
    });
  });

  detail.querySelector('[data-action="delete-evidence-row"]')?.addEventListener('click', () => {
    if (!window.confirm(`Remove ${row.file} from the gallery? The file stays in media/.`)) {
      return;
    }
    const index = evidence.indexOf(row);
    evidence.splice(index, 1);
    onChange();
    rerender();
  });

  detail.querySelector('[data-action="compose-issue"]')?.addEventListener('click', () => {
    applyEvidenceForm(row, root);
    openIssueComposer({
      audit,
      issues,
      file: row.file,
      linkedIssueKeys: row.issues || [],
      onOpenIssue: onNavigateToIssue,
      onCreate: (issue) => {
        const ordered = appendIssueToPhase(issues, audit, issue);
        replaceIssuesArray(issues, ordered);
        row.issues = row.issues || [];
        if (!row.issues.includes(issue.key)) {
          row.issues.push(issue.key);
        }
        onChange('issues');
        setEditorStatus(`Created issue ${issue.id} and linked this screenshot.`);
        rerender();
      },
    });
  });

  detail.querySelector('[data-action="pick-file"]')?.addEventListener('click', () => {
    openMediaFilePicker({
      blockedFiles: evidence.filter((item) => item !== row).map((item) => item.file).filter(Boolean),
      callback: (file) => {
        row.file = file;
        row.type = inferMediaType(file);
        onChange();
        rerender();
      },
    });
  });

  detail.querySelector('[data-action="pick-poster"]')?.addEventListener('click', () => {
    openMediaFilePicker({
      type: 'image',
      callback: (file) => {
        row.poster = file;
        onChange();
        rerender();
      },
    });
  });

  detail.querySelector('[data-action="clear-poster"]')?.addEventListener('click', () => {
    delete row.poster;
    onChange();
    rerender();
  });

  detail.querySelectorAll('[data-open-issue]').forEach((button) => {
    button.addEventListener('click', () => {
      applyEvidenceForm(row, root);
      onNavigateToIssue?.(button.dataset.openIssue);
    });
  });
}

function applyEvidenceForm(row, root) {
  const form = root.querySelector('#evidence-form');
  if (!form) {
    return;
  }

  row.type = form.querySelector('[name="type"]')?.value ?? inferMediaType(row.file);
  row.page = form.querySelector('[name="page"]')?.value ?? '';
  row.issues = [...form.querySelectorAll('[name="issues"]:checked')].map((el) => el.value);

  if (row.type === 'video' || row.file.endsWith('.mp4')) {
    row.reviewed = form.querySelector('[name="reviewed"]')?.checked ?? true;
  } else {
    delete row.reviewed;
  }
}

export function renderDecisionsView(decisions, issues, ui, root, onChange, galleryEvidence = []) {
  const selected =
    decisions.find((item) => item.id === ui.selectedDecisionId) || decisions[0] || null;
  if (selected) {
    ui.selectedDecisionId = selected.id;
  }

  root.innerHTML = `
    <div class="editor-split">
      <aside class="editor-sidebar">
        <div class="editor-sidebar__head">
          <h2>Questions</h2>
          <button type="button" class="editor-button editor-button--small" data-action="add-decision">Add question</button>
        </div>
        <ul class="editor-list">
          ${decisions
            .map(
              (item) => `
            <li>
              <button type="button" class="editor-list__btn ${item.id === ui.selectedDecisionId ? 'is-active' : ''}" data-decision-id="${escapeAttr(item.id)}">
                <span class="editor-list__title">${escapeHtml(item.title || item.id)}</span>
              </button>
            </li>`
            )
            .join('')}
        </ul>
      </aside>
      <div class="editor-detail" id="decision-detail">
        ${selected ? renderDecisionForm(selected, issues) : '<p class="editor-lede">Add a question to get started.</p>'}
      </div>
    </div>
  `;

  root.querySelectorAll('[data-decision-id]').forEach((button) => {
    button.addEventListener('click', () => {
      if (selected) {
        applyDecisionForm(selected, root);
      }
      ui.selectedDecisionId = button.dataset.decisionId;
      onChange();
      renderDecisionsView(decisions, issues, ui, root, onChange, galleryEvidence);
    });
  });

  root.querySelector('[data-action="add-decision"]')?.addEventListener('click', () => {
    const id = `question-${decisions.length + 1}`;
    decisions.push({
      id,
      title: 'New question',
      blocks: [],
      question: '',
      recommendation: '',
      options: [],
    });
    ui.selectedDecisionId = id;
    onChange();
    renderDecisionsView(decisions, issues, ui, root, onChange, galleryEvidence);
  });

  if (!selected) {
    return;
  }

  bindDecisionForm(selected, decisions, issues, galleryEvidence, root, onChange, () => {
    renderDecisionsView(decisions, issues, ui, root, onChange, galleryEvidence);
  });
}

function renderDecisionForm(decision, issues) {
  const blockChecks = issues
    .map(
      (issue) => `
      <label class="editor-check">
        <input type="checkbox" name="blocks" value="${escapeAttr(issue.key)}" ${(decision.blocks || []).includes(issue.key) ? 'checked' : ''}>
        <span>${escapeHtml(issue.id)} — ${escapeHtml(issue.title)}</span>
      </label>`
    )
    .join('');

  const options = (decision.options || [])
    .map((option, optionIndex) => {
      const evidenceRows = (option.evidence || [])
        .map(
          (item, evidenceIndex) => `
          <div class="evidence-row" data-option-index="${optionIndex}" data-option-evidence-index="${evidenceIndex}">
            ${renderMediaChip(item.file, item.caption)}
            <div class="evidence-row__fields">
              ${field('Caption', input(`options.${optionIndex}.evidence.${evidenceIndex}.caption`, item.caption || ''))}
              <div class="evidence-row__actions">
                <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="pick-option-evidence" data-option-index="${optionIndex}" data-evidence-index="${evidenceIndex}">Change file</button>
                <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="remove-option-evidence" data-option-index="${optionIndex}" data-evidence-index="${evidenceIndex}">Remove</button>
              </div>
            </div>
          </div>`
        )
        .join('');

      return `
        <article class="editor-card" data-option-index="${optionIndex}">
          <div class="editor-grid editor-grid--2">
            ${field('Value (saved answer)', input(`options.${optionIndex}.value`, option.value || ''))}
            ${field('Button label', input(`options.${optionIndex}.label`, option.label || ''))}
          </div>
          ${field('Helper text', textarea(`options.${optionIndex}.description`, option.description || '', 2))}
          <div class="editor-subsection__head">
            <h4>Example screenshots</h4>
            <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="add-option-evidence" data-option-index="${optionIndex}">Add media</button>
          </div>
          <div class="editor-stack">${evidenceRows || '<p class="editor-muted">No media for this option.</p>'}</div>
          <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="remove-option" data-option-index="${optionIndex}">Remove option</button>
        </article>`;
    })
    .join('');

  return `
    <form class="editor-detail-form" id="decision-form">
      <div class="editor-detail__head">
        <h2>${escapeHtml(decision.title || 'Question')}</h2>
        <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="delete-decision">Delete question</button>
      </div>
      <div class="editor-grid editor-grid--2">
        ${field('Question id', input('id', decision.id || ''))}
        ${field('Short title', input('title', decision.title || ''))}
      </div>
      ${field('Question shown to client', textarea('question', decision.question || '', 3))}
      ${field('Our suggestion', textarea('recommendation', decision.recommendation || '', 4))}
      <section class="editor-subsection">
        <h3>Waiting on these issues (internal)</h3>
        <div class="editor-checks">${blockChecks || '<p class="editor-muted">No issues yet.</p>'}</div>
      </section>
      <section class="editor-subsection">
        <div class="editor-subsection__head">
          <h3>Answer choices</h3>
          <button type="button" class="editor-button editor-button--ghost editor-button--small" data-action="add-option">Add option</button>
        </div>
        <div class="editor-stack">${options || '<p class="editor-muted">Add at least one answer choice.</p>'}</div>
      </section>
    </form>
  `;
}

function bindDecisionForm(decision, decisions, issues, galleryEvidence, root, onChange, rerender) {
  const detail = root.querySelector('#decision-detail');
  if (!detail) {
    return;
  }

  detail.querySelectorAll('input, textarea, select').forEach((el) => {
    el.addEventListener('input', () => {
      applyDecisionForm(decision, root);
      onChange();
    });
    el.addEventListener('change', () => {
      applyDecisionForm(decision, root);
      onChange();
    });
  });

  detail.querySelector('[data-action="delete-decision"]')?.addEventListener('click', () => {
    if (!window.confirm(`Delete question ${decision.id}?`)) {
      return;
    }
    const index = decisions.indexOf(decision);
    decisions.splice(index, 1);
    onChange();
    rerender();
  });

  detail.querySelector('[data-action="add-option"]')?.addEventListener('click', () => {
    applyDecisionForm(decision, root);
    decision.options = decision.options || [];
    decision.options.push({ value: '', label: '', description: '', evidence: [] });
    onChange();
    rerender();
  });

  detail.querySelectorAll('[data-action="remove-option"]').forEach((button) => {
    button.addEventListener('click', () => {
      applyDecisionForm(decision, root);
      decision.options.splice(Number(button.dataset.optionIndex), 1);
      onChange();
      rerender();
    });
  });

  detail.querySelectorAll('[data-action="add-option-evidence"]').forEach((button) => {
    button.addEventListener('click', () => {
      applyDecisionForm(decision, root);
      const optionIndex = Number(button.dataset.optionIndex);
      const option = decision.options[optionIndex];
      const linkedFiles = (option.evidence || []).map((item) => item.file).filter(Boolean);
      openMediaFilePicker({
        blockedFiles: linkedFiles,
        callback: (file) => {
          decision.options[optionIndex].evidence = decision.options[optionIndex].evidence || [];
          if (decision.options[optionIndex].evidence.some((item) => item.file === file)) {
            setEditorStatus(`${file} is already linked to this answer.`, true);
            return;
          }
          decision.options[optionIndex].evidence.push({ file, caption: '' });
          onChange();
          rerender();
        },
      });
    });
  });

  detail.querySelectorAll('[data-action="pick-option-evidence"]').forEach((button) => {
    button.addEventListener('click', () => {
      applyDecisionForm(decision, root);
      const optionIndex = Number(button.dataset.optionIndex);
      const evidenceIndex = Number(button.dataset.evidenceIndex);
      openMediaFilePicker({
        blockedFiles: (decision.options[optionIndex].evidence || [])
          .filter((_, itemIndex) => itemIndex !== evidenceIndex)
          .map((item) => item.file)
          .filter(Boolean),
        callback: (file) => {
          decision.options[optionIndex].evidence[evidenceIndex].file = file;
          onChange();
          rerender();
        },
      });
    });
  });

  detail.querySelectorAll('[data-action="remove-option-evidence"]').forEach((button) => {
    button.addEventListener('click', () => {
      applyDecisionForm(decision, root);
      const optionIndex = Number(button.dataset.optionIndex);
      const evidenceIndex = Number(button.dataset.evidenceIndex);
      decision.options[optionIndex].evidence.splice(evidenceIndex, 1);
      onChange();
      rerender();
    });
  });
}

function applyDecisionForm(decision, root) {
  const form = root.querySelector('#decision-form');
  if (!form) {
    return;
  }

  decision.id = form.querySelector('[name="id"]')?.value ?? decision.id;
  decision.title = form.querySelector('[name="title"]')?.value ?? '';
  decision.question = form.querySelector('[name="question"]')?.value ?? '';
  decision.recommendation = form.querySelector('[name="recommendation"]')?.value ?? '';
  decision.blocks = [...form.querySelectorAll('[name="blocks"]:checked')].map((el) => el.value);

  decision.options = [...form.querySelectorAll('[data-option-index].editor-card')].map((card, optionIndex) => {
    const existing = decision.options?.[optionIndex] || {};
    const evidence = [...card.querySelectorAll('[data-option-evidence-index]')].map((row, evidenceIndex) => ({
      file: existing.evidence?.[evidenceIndex]?.file || '',
      caption: row.querySelector(`[name="options.${optionIndex}.evidence.${evidenceIndex}.caption"]`)?.value ?? '',
    }));
    return {
      value: card.querySelector(`[name="options.${optionIndex}.value"]`)?.value ?? '',
      label: card.querySelector(`[name="options.${optionIndex}.label"]`)?.value ?? '',
      description: card.querySelector(`[name="options.${optionIndex}.description"]`)?.value ?? '',
      evidence,
    };
  });
}

export function applyActiveForm(state) {
  const root = document.getElementById('workspace');
  const tab = state.activeTab;

  if (tab === 'audit') {
    applyAuditForm(state.data.audit, root);
    return;
  }

  if (tab === 'issues') {
    const issue = state.data.issues.find((item) => item.key === state.ui.selectedIssueKey);
    if (issue) {
      applyIssueForm(issue, root);
    }
    return;
  }

  if (tab === 'evidence') {
    const row = state.data.evidence[state.ui.selectedEvidenceIndex];
    if (row) {
      applyEvidenceForm(row, root);
    }
    return;
  }

  if (tab === 'decisions') {
    const decision = state.data.decisions.find((item) => item.id === state.ui.selectedDecisionId);
    if (decision) {
      applyDecisionForm(decision, root);
    }
  }
}

export function renderActiveView(state, root, onChange, onNavigateToIssue, onNavigateToEvidence) {
  if (state.activeTab === 'audit') {
    renderAuditView(state.data.audit, root, onChange);
    return;
  }

  if (state.activeTab === 'issues') {
    renderIssuesView(
      state.data.issues,
      state.data.audit,
      state.ui,
      root,
      onChange,
      state.data.evidence,
      onNavigateToEvidence,
      onNavigateToIssue
    );
    return;
  }

  if (state.activeTab === 'evidence') {
    renderEvidenceView(
      state.data.evidence,
      state.data.issues,
      state.data.audit,
      state.ui,
      root,
      onChange,
      onNavigateToIssue,
      onNavigateToEvidence
    );
    return;
  }

  if (state.activeTab === 'decisions') {
    renderDecisionsView(state.data.decisions, state.data.issues, state.ui, root, onChange, state.data.evidence);
  }
}
