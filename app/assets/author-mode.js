import {
  saveYamlFile,
  loadMediaList,
  uploadMediaFile,
  syncEvidenceTaskLinks,
  syncTaskEvidenceFromGallery,
  compactTaskIds,
  appendTaskToPhase,
  reorderTasksFromDrop,
  newTaskKey,
  inferMediaType,
  mediaUrl,
} from "./author-api.js";

const EDIT_MODE_KEY = "or-audit-edit-mode";
const SAVE_DEBOUNCE_MS = 500;

let saveTimers = new Map();
let mediaPickerCallback = null;
let mediaPickerGalleryFiles = new Set();
let mediaPickerBlockedFiles = new Set();
let mediaPickerAllowGallery = true;
let mediaPickerFilterType = "all";
let mediaPickerFiles = [];
let mediaEditorFile = null;

export function readStoredEditMode() {
  try {
    return sessionStorage.getItem(EDIT_MODE_KEY) === "1";
  } catch {
    return false;
  }
}

export function persistEditMode(on) {
  try {
    sessionStorage.setItem(EDIT_MODE_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function applyEditModeClass(editMode) {
  document.body.classList.toggle("is-edit-mode", Boolean(editMode));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clearSaveTimers() {
  for (const timer of saveTimers.values()) {
    clearTimeout(timer);
  }
  saveTimers.clear();
}

function debounceSave(key, fn) {
  const existing = saveTimers.get(key);
  if (existing) {
    clearTimeout(existing);
  }
  const timer = setTimeout(async () => {
    saveTimers.delete(key);
    try {
      await fn();
    } catch (error) {
      window.alert(error.message || "Could not save.");
    }
  }, SAVE_DEBOUNCE_MS);
  saveTimers.set(key, timer);
}

export async function persistTasks(state) {
  syncEvidenceTaskLinks(state.tasks, state.evidence);
  await saveYamlFile("tasks", state.tasks);
  await saveYamlFile("evidence", state.evidence);
}

export async function persistAudit(state) {
  await saveYamlFile("audit", state.audit);
}

export async function persistEvidenceBundle(state) {
  syncTaskEvidenceFromGallery(state.tasks, state.evidence);
  syncEvidenceTaskLinks(state.tasks, state.evidence);
  await saveYamlFile("evidence", state.evidence);
  await saveYamlFile("tasks", state.tasks);
}

export async function persistDecisions(state) {
  await saveYamlFile("decisions", state.decisions);
}

export function createBlankDecision({ blocks = [] } = {}) {
  return {
    key: newTaskKey(),
    title: "New question",
    blocks: [...blocks],
    question: "",
    recommendation: "",
    options: [],
  };
}

export function createBlankTask(phaseId) {
  return {
    key: newTaskKey(),
    id: "0.0",
    sprint: Number(phaseId),
    title: "New task",
    priority: "medium",
    status: "planned",
    tags: [],
    problem: "",
    recommendation: "",
    evidence: [],
  };
}

export function nextPhaseId(audit) {
  const ids = (audit.sprints || []).map((s) => Number(s.id));
  return ids.length ? Math.max(...ids) + 1 : 1;
}

export function createBlankPhase(audit) {
  const id = nextPhaseId(audit);
  return {
    id,
    title: `Phase ${id}`,
    subtitle: "",
    description: "",
  };
}

/** Media library picker (#media-picker): search, disabled already-linked, upload. */
export function initAuthorMediaPicker() {
  const dialog = document.getElementById("media-picker");
  const grid = document.getElementById("picker-grid");
  const searchInput = document.getElementById("picker-search");
  const closeButton = document.getElementById("picker-close");
  const uploadInput = document.getElementById("picker-upload");
  const uploadStatus = document.getElementById("picker-upload-status");
  if (!dialog || !grid || !searchInput || !closeButton) {
    return;
  }

  const renderGrid = (query = "") => {
    const q = query.trim().toLowerCase();
    const filtered = mediaPickerFiles.filter((file) => {
      if (mediaPickerFilterType !== "all" && file.type !== mediaPickerFilterType) {
        return false;
      }
      if (q && !file.name.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
    if (!filtered.length) {
      grid.innerHTML =
        '<p class="media-picker__empty">No files match. Upload a file or add images/videos to the media folder.</p>';
      return;
    }
    grid.innerHTML = filtered
      .map((file) => {
        const inGallery = mediaPickerGalleryFiles.has(file.name);
        const isBlocked =
          inGallery || mediaPickerBlockedFiles.has(file.name);
        const isVideo = file.type === "video";
        const thumbClass = isVideo
          ? "media-picker__thumb media-picker__thumb--video"
          : "media-picker__thumb";
        const thumb = isVideo
          ? `<video preload="metadata" muted playsinline src="${escapeHtml(mediaUrl(file.name))}#t=0.1"></video><span class="media-picker__play" aria-hidden="true">▶</span>`
          : `<img src="${escapeHtml(mediaUrl(file.name))}" alt="" loading="lazy">`;
        const badge = inGallery
          ? '<span class="media-picker__badge" aria-hidden="true">✓</span>'
          : "";
        const title = inGallery
          ? ' title="Already linked here"'
          : mediaPickerBlockedFiles.has(file.name)
            ? ' title="Already in use"'
            : "";

        if (isBlocked) {
          return `
        <div class="media-picker__item media-picker__item--disabled" aria-disabled="true"${title}>
          <span class="${thumbClass}">${thumb}</span>
          ${badge}
          <span class="media-picker__name">${escapeHtml(file.name)}</span>
        </div>`;
        }

        return `
        <button type="button" class="media-picker__item" data-file="${escapeHtml(file.name)}">
          <span class="${thumbClass}">${thumb}</span>
          <span class="media-picker__name">${escapeHtml(file.name)}</span>
        </button>`;
      })
      .join("");

    grid.querySelectorAll("[data-file]").forEach((button) => {
      button.addEventListener("click", () => {
        const name = button.dataset.file;
        const cb = mediaPickerCallback;
        mediaPickerCallback = null;
        dialog.close();
        cb?.(name);
      });
    });
  };

  const setFiles = (list) => {
    mediaPickerFiles = [...list].sort(
      (a, b) => (b.mtime ?? 0) - (a.mtime ?? 0),
    );
  };

  searchInput.addEventListener("input", () => renderGrid(searchInput.value));
  closeButton.addEventListener("click", () => dialog.close());
  dialog.addEventListener("close", () => {
    mediaPickerCallback = null;
    searchInput.value = "";
    mediaPickerGalleryFiles = new Set();
    mediaPickerBlockedFiles = new Set();
    mediaPickerAllowGallery = true;
    mediaPickerFilterType = "all";
    if (uploadStatus) {
      uploadStatus.textContent = "";
    }
    if (uploadInput) {
      uploadInput.value = "";
    }
  });

  if (uploadInput) {
    uploadInput.addEventListener("change", async () => {
      const file = uploadInput.files?.[0];
      if (!file) {
        return;
      }
      if (uploadStatus) {
        uploadStatus.textContent = "Uploading…";
      }
      try {
        const uploaded = await uploadMediaFile(file);
        const list = await loadMediaList();
        setFiles(list);
        renderGrid(searchInput.value);
        if (uploadStatus) {
          uploadStatus.textContent = `Uploaded ${uploaded.name}`;
        }
        const cb = mediaPickerCallback;
        mediaPickerCallback = null;
        dialog.close();
        cb?.(uploaded.name);
      } catch (error) {
        if (uploadStatus) {
          uploadStatus.textContent = error.message || "Upload failed.";
        }
      } finally {
        uploadInput.value = "";
      }
    });
  }

  openAuthorMediaPicker._render = renderGrid;
  openAuthorMediaPicker._setFiles = setFiles;
}

/**
 * @param {object} opts
 * @param {(file: string) => void} [opts.callback]
 * @param {string} [opts.type] all|image|video
 * @param {string[]} [opts.galleryFiles] shown disabled with ✓ when allowGallery false
 * @param {string[]} [opts.blockedFiles] also disabled
 * @param {boolean} [opts.allowGallery] if false, galleryFiles are disabled
 */
export async function openAuthorMediaPicker({
  callback,
  type = "all",
  galleryFiles = [],
  blockedFiles = [],
  allowGallery = true,
} = {}) {
  const dialog = document.getElementById("media-picker");
  const grid = document.getElementById("picker-grid");
  const searchInput = document.getElementById("picker-search");
  if (!dialog || !grid) {
    window.alert("Media picker is not available.");
    return;
  }
  mediaPickerCallback = callback || null;
  mediaPickerFilterType = type;
  mediaPickerAllowGallery = allowGallery;
  mediaPickerGalleryFiles = allowGallery
    ? new Set()
    : new Set(galleryFiles);
  mediaPickerBlockedFiles = new Set(blockedFiles);
  grid.innerHTML = '<p class="media-picker__empty">Loading…</p>';
  dialog.showModal();
  try {
    const list = await loadMediaList();
    openAuthorMediaPicker._setFiles?.(list);
  } catch (error) {
    grid.innerHTML = `<p class="media-picker__empty">${escapeHtml(error.message || "Could not load media.")}</p>`;
    return;
  }
  openAuthorMediaPicker._render?.(searchInput?.value || "");
}

function updateEditToggleLabel(button, state, copy) {
  const label = state.editMode ? copy.doneEditing : copy.editMode;
  button.hidden = !state.auth?.email;
  button.setAttribute("aria-pressed", state.editMode ? "true" : "false");
  button.setAttribute("aria-label", label);
  button.title = label;
}

export function bindAuthorEditToggle(state, { onChange, copy }) {
  const button = document.getElementById("edit-mode-toggle");
  if (!button) {
    return;
  }
  updateEditToggleLabel(button, state, copy);
  button.onclick = () => {
    state.editMode = !state.editMode;
    persistEditMode(state.editMode);
    applyEditModeClass(state.editMode);
    if (!state.editMode) {
      clearSaveTimers();
    }
    updateEditToggleLabel(button, state, copy);
    onChange();
  };
}

export function syncAuthorEditToggle(state, copy) {
  const button = document.getElementById("edit-mode-toggle");
  if (!button) {
    return;
  }
  updateEditToggleLabel(button, state, copy);
  applyEditModeClass(state.editMode);
}

/**
 * Bind overview / task / evidence author controls when edit mode is on.
 * @param {object} ctx
 */
export function bindAuthorModeHandlers(ctx) {
  const { state, main, render, isAdmin } = ctx;

  if (!state.editMode || !main) {
    return;
  }

  // --- Overview intro (admin) ---
  const summary = main.querySelector("[data-author-summary]");
  if (summary && isAdmin()) {
    summary.addEventListener("input", () => {
      state.audit.summary = summary.value;
      debounceSave("audit-summary", () => persistAudit(state));
    });
  }

  // --- Phase fields ---
  main.querySelectorAll("[data-author-phase]").forEach((el) => {
    const phaseId = Number(el.dataset.authorPhase);
    const field = el.dataset.authorField;
    el.addEventListener("click", (event) => {
      event.stopPropagation();
    });
    el.addEventListener("keydown", (event) => {
      event.stopPropagation();
    });
    el.addEventListener("input", () => {
      const sprint = (state.audit.sprints || []).find(
        (s) => Number(s.id) === phaseId,
      );
      if (!sprint || !field) {
        return;
      }
      sprint[field] = el.value;
      debounceSave(`phase-${phaseId}-${field}`, () => persistAudit(state));
    });
  });

  main.querySelector("[data-author-add-phase]")?.addEventListener("click", async () => {
    const phase = createBlankPhase(state.audit);
    state.audit.sprints = [...(state.audit.sprints || []), phase];
    try {
      await persistAudit(state);
      render();
    } catch (error) {
      window.alert(error.message || "Could not add phase.");
    }
  });

  main.querySelectorAll("[data-author-delete-phase]").forEach((button) => {
    button.addEventListener("click", async () => {
      const phaseId = Number(button.dataset.authorDeletePhase);
      const tasksInPhase = state.tasks.filter(
        (t) => Number(t.sprint) === phaseId,
      );
      if (tasksInPhase.length) {
        window.alert(
          `Cannot delete phase ${phaseId}: move or delete its ${tasksInPhase.length} task(s) first.`,
        );
        return;
      }
      if (!window.confirm(`Delete phase ${phaseId}?`)) {
        return;
      }
      state.audit.sprints = (state.audit.sprints || []).filter(
        (s) => Number(s.id) !== phaseId,
      );
      try {
        await persistAudit(state);
        render();
      } catch (error) {
        window.alert(error.message || "Could not delete phase.");
      }
    });
  });

  main.querySelectorAll("[data-author-add-task]").forEach((button) => {
    button.addEventListener("click", async () => {
      const phaseId = Number(button.dataset.authorAddTask);
      const task = createBlankTask(phaseId);
      const ordered = appendTaskToPhase(state.tasks, state.audit, task);
      state.tasks.splice(0, state.tasks.length, ...ordered);
      try {
        await persistTasks(state);
        location.hash = `#/task/${task.key}`;
      } catch (error) {
        window.alert(error.message || "Could not add task.");
        render();
      }
    });
  });

  // --- Task detail prose ---
  main.querySelectorAll("[data-author-task-field]").forEach((el) => {
    const field = el.dataset.authorTaskField;
    const taskKey = el.dataset.taskKey;
    el.addEventListener("input", () => {
      const task = state.tasks.find((t) => t.key === taskKey);
      if (!task || !field) {
        return;
      }
      task[field] = el.value;
      debounceSave(`task-${taskKey}-${field}`, () => persistTasks(state));
    });
  });

  main.querySelectorAll("[data-author-task-hours]").forEach((el) => {
    if (!isAdmin()) {
      return;
    }
    const field = el.dataset.authorTaskHours;
    const taskKey = el.dataset.taskKey;
    el.addEventListener("change", () => {
      const task = state.tasks.find((t) => t.key === taskKey);
      if (!task || !field) {
        return;
      }
      const raw = el.value.trim();
      if (raw === "") {
        delete task[field];
      } else {
        const n = Number(raw);
        if (!Number.isFinite(n) || n < 0) {
          window.alert(`${field} must be a number ≥ 0.`);
          return;
        }
        task[field] = n;
      }
      debounceSave(`task-${taskKey}-${field}`, () => persistTasks(state));
    });
  });

  main
    .querySelector("[data-author-delete-task]")
    ?.addEventListener("click", async () => {
      const taskKey = main.querySelector("[data-author-delete-task]").dataset
        .authorDeleteTask;
      const task = state.tasks.find((t) => t.key === taskKey);
      if (!task) {
        return;
      }
      if (!window.confirm(`Delete task ${task.id}? This cannot be undone.`)) {
        return;
      }
      state.tasks = state.tasks.filter((t) => t.key !== taskKey);
      for (const row of state.evidence) {
        row.tasks = (row.tasks || []).filter((k) => k !== taskKey);
      }
      compactTaskIds(state.tasks, state.audit);
      try {
        await persistTasks(state);
        location.hash = "#/";
      } catch (error) {
        window.alert(error.message || "Could not delete task.");
        render();
      }
    });

  main
    .querySelector("[data-author-add-task-media]")
    ?.addEventListener("click", () => {
      const taskKey = main.querySelector("[data-author-add-task-media]").dataset
        .authorAddTaskMedia;
      const task = state.tasks.find((t) => t.key === taskKey);
      if (!task) {
        return;
      }
      openAuthorMediaPicker({
        allowGallery: false,
        galleryFiles: (task.evidence || [])
          .map((item) => item.file)
          .filter(Boolean),
        callback: async (file) => {
          task.evidence = task.evidence || [];
          if (task.evidence.some((item) => item.file === file)) {
            window.alert(`${file} is already linked to this task.`);
            return;
          }
          task.evidence.push({ file });
          // Keep Media index complete so catalog edits stay possible.
          if (!state.evidence.some((row) => row.file === file)) {
            state.evidence.push({
              file,
              page: "",
              url: "",
              type: inferMediaType(file),
              tasks: [],
            });
          }
          try {
            await persistTasks(state);
            render();
          } catch (error) {
            window.alert(error.message || "Could not attach media.");
          }
        },
      });
    });

  main.querySelectorAll("[data-author-remove-task-media]").forEach((button) => {
    button.addEventListener("click", async (event) => {
      event.stopPropagation();
      const taskKey = button.dataset.taskKey;
      const file = button.dataset.authorRemoveTaskMedia;
      const task = state.tasks.find((t) => t.key === taskKey);
      if (!task) {
        return;
      }
      task.evidence = (task.evidence || []).filter((item) => item.file !== file);
      try {
        await persistTasks(state);
        render();
      } catch (error) {
        window.alert(error.message || "Could not remove media.");
      }
    });
  });

  // --- Media library page ---
  main
    .querySelector("[data-author-add-evidence]")
    ?.addEventListener("click", () => {
      openAuthorMediaPicker({
        allowGallery: false,
        galleryFiles: state.evidence.map((row) => row.file).filter(Boolean),
        callback: async (file) => {
          if (state.evidence.some((row) => row.file === file)) {
            window.alert(`${file} is already in the media library.`);
            return;
          }
          state.evidence.push({
            file,
            page: "",
            url: "",
            type: inferMediaType(file),
            tasks: [],
          });
          try {
            await persistEvidenceBundle(state);
            render();
            openMediaEditor(state, file, { render });
          } catch (error) {
            window.alert(error.message || "Could not add media.");
            render();
          }
        },
      });
    });

  main.querySelectorAll("[data-author-edit-evidence]").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button, input, select, textarea, label")) {
        return;
      }
      const file = card.dataset.authorEditEvidence;
      if (file) {
        openMediaEditor(state, file, { render });
      }
    });
  });

  main.querySelectorAll("[data-author-open-evidence]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const file = button.dataset.authorOpenEvidence;
      if (file) {
        openMediaEditor(state, file, { render });
      }
    });
  });

  bindMediaEditorHandlers(ctx);
  bindDecisionAuthorHandlers(ctx);
  bindTaskReorderDrag(ctx);
}

function renderMediaEditorBody(state, row) {
  const isVideo = row.type === "video" || String(row.file || "").endsWith(".mp4");
  const preview = isVideo
    ? `<video class="media-editor__preview-media" controls playsinline src="${escapeHtml(mediaUrl(row.file))}"></video>`
    : `<img class="media-editor__preview-media" src="${escapeHtml(mediaUrl(row.file))}" alt="">`;

  return `
    <div class="media-editor__layout">
      <div class="media-editor__preview">${preview}</div>
      <div class="media-editor__fields">
        <p class="media-editor__filename"><code>${escapeHtml(row.file)}</code></p>
        <label class="field">
          <span class="field__label">Page</span>
          <input class="author-field" type="text" data-media-editor-field="page" value="${escapeHtml(row.page || "")}">
        </label>
        <label class="field">
          <span class="field__label">URL</span>
          <input class="author-field" type="url" data-media-editor-field="url" value="${escapeHtml(row.url || "")}">
        </label>
        <label class="field">
          <span class="field__label">Type</span>
          <select class="author-field" data-media-editor-field="type">
            <option value="image"${row.type !== "video" ? " selected" : ""}>image</option>
            <option value="video"${row.type === "video" ? " selected" : ""}>video</option>
          </select>
        </label>
        <fieldset class="author-evidence-tasks">
          <legend>Link tasks</legend>
          ${state.tasks
            .map(
              (task) => `
            <label class="author-evidence-tasks__item">
              <input type="checkbox" data-media-editor-task="${escapeHtml(task.key)}"${(row.tasks || []).includes(task.key) ? " checked" : ""}>
              <span>${escapeHtml(task.id)} ${escapeHtml(task.title)}</span>
            </label>`,
            )
            .join("")}
        </fieldset>
        <button type="button" class="button button--ghost" data-media-editor-delete>Remove from index</button>
      </div>
    </div>`;
}

export function openMediaEditor(state, file, { render } = {}) {
  const dialog = document.getElementById("media-editor");
  const body = document.getElementById("media-editor-body");
  const title = document.getElementById("media-editor-title");
  if (!dialog || !body) {
    return;
  }
  const row = state.evidence.find((item) => item.file === file);
  if (!row) {
    return;
  }
  mediaEditorFile = file;
  if (title) {
    title.textContent = row.page || row.file;
  }
  body.innerHTML = renderMediaEditorBody(state, row);
  dialog.showModal();
  bindMediaEditorHandlers({ state, render });
}

function bindMediaEditorHandlers(ctx) {
  const { state, render } = ctx;
  const dialog = document.getElementById("media-editor");
  const body = document.getElementById("media-editor-body");
  const closeBtn = document.getElementById("media-editor-close");
  if (!dialog || !body) {
    return;
  }

  if (closeBtn && !closeBtn.dataset.bound) {
    closeBtn.dataset.bound = "1";
    closeBtn.addEventListener("click", () => dialog.close());
  }
  if (!dialog.dataset.boundClose) {
    dialog.dataset.boundClose = "1";
    dialog.addEventListener("close", () => {
      mediaEditorFile = null;
      body.innerHTML = "";
    });
  }

  const file = mediaEditorFile;
  const row = state.evidence.find((item) => item.file === file);
  if (!row) {
    return;
  }

  body.querySelectorAll("[data-media-editor-field]").forEach((el) => {
    const field = el.dataset.mediaEditorField;
    const eventName = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(eventName, () => {
      row[field] = el.value;
      if (field === "type") {
        row.type = el.value === "video" ? "video" : "image";
      }
      const title = document.getElementById("media-editor-title");
      if (title && field === "page") {
        title.textContent = row.page || row.file;
      }
      debounceSave(`media-editor-${file}-${field}`, () =>
        persistEvidenceBundle(state).then(() => render?.()),
      );
    });
  });

  body.querySelectorAll("[data-media-editor-task]").forEach((input) => {
    input.addEventListener("change", () => {
      const set = new Set((row.tasks || []).map(String));
      const taskKey = input.dataset.mediaEditorTask;
      if (input.checked) {
        set.add(taskKey);
      } else {
        set.delete(taskKey);
      }
      row.tasks = [...set].sort();
      debounceSave(`media-editor-link-${file}`, () =>
        persistEvidenceBundle(state).then(() => render?.()),
      );
    });
  });

  body
    .querySelector("[data-media-editor-delete]")
    ?.addEventListener("click", async () => {
      if (!window.confirm(`Remove ${file} from the media index?`)) {
        return;
      }
      state.evidence = state.evidence.filter((item) => item.file !== file);
      for (const task of state.tasks) {
        task.evidence = (task.evidence || []).filter(
          (item) => item.file !== file,
        );
      }
      try {
        await persistEvidenceBundle(state);
        dialog.close();
        render?.();
      } catch (error) {
        window.alert(error.message || "Could not delete media.");
      }
    });
}

let pendingDecisionScrollKey = null;

export function takePendingDecisionScroll() {
  const key = pendingDecisionScrollKey;
  pendingDecisionScrollKey = null;
  return key;
}

function findDecision(state, key) {
  return state.decisions.find((item) => item.key === key) || null;
}

async function addDecisionAndFocus(ctx, { blocks = [] } = {}) {
  const { state, render } = ctx;
  const decision = createBlankDecision({ blocks });
  state.decisions.push(decision);
  try {
    await persistDecisions(state);
    pendingDecisionScrollKey = decision.key;
    if (state.route?.name !== "responses") {
      location.hash = "#/responses";
      return;
    }
    render();
  } catch (error) {
    pendingDecisionScrollKey = null;
    state.decisions = state.decisions.filter((item) => item.key !== decision.key);
    window.alert(error.message || "Could not add question.");
    render();
  }
}

function bindDecisionAuthorHandlers(ctx) {
  const { state, main, render } = ctx;

  main.querySelectorAll("[data-author-add-decision]").forEach((button) => {
    button.addEventListener("click", () => {
      const taskKey = button.dataset.authorAddDecision || "";
      const blocks = taskKey ? [taskKey] : [];
      addDecisionAndFocus(ctx, { blocks });
    });
  });

  main.querySelectorAll("[data-author-delete-decision]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.authorDeleteDecision;
      const decision = findDecision(state, key);
      if (!decision) {
        return;
      }
      if (
        !window.confirm(
          `Delete question “${decision.title || "Untitled"}”? This cannot be undone.`,
        )
      ) {
        return;
      }
      state.decisions = state.decisions.filter((item) => item.key !== key);
      try {
        await persistDecisions(state);
        render();
      } catch (error) {
        window.alert(error.message || "Could not delete question.");
        render();
      }
    });
  });

  main.querySelectorAll("[data-author-decision-field]").forEach((el) => {
    const key = el.dataset.decisionKey;
    const field = el.dataset.authorDecisionField;
    el.addEventListener("input", () => {
      const decision = findDecision(state, key);
      if (!decision || !field) {
        return;
      }
      decision[field] = el.value;
      debounceSave(`decision-${key}-${field}`, () => persistDecisions(state));
    });
  });

  main.querySelectorAll("[data-author-decision-block]").forEach((input) => {
    input.addEventListener("change", () => {
      const key = input.dataset.decisionKey;
      const decision = findDecision(state, key);
      if (!decision) {
        return;
      }
      const card = input.closest("[data-author-decision]");
      decision.blocks = [
        ...card.querySelectorAll("[data-author-decision-block]:checked"),
      ].map((el) => el.value);
      debounceSave(`decision-${key}-blocks`, () => persistDecisions(state));
    });
  });

  main.querySelectorAll("[data-author-add-option]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.authorAddOption;
      const decision = findDecision(state, key);
      if (!decision) {
        return;
      }
      decision.options = decision.options || [];
      decision.options.push({
        value: "",
        label: "",
        description: "",
        evidence: [],
      });
      try {
        await persistDecisions(state);
        render();
      } catch (error) {
        window.alert(error.message || "Could not add option.");
        render();
      }
    });
  });

  main.querySelectorAll("[data-author-remove-option]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.decisionKey;
      const optionIndex = Number(button.dataset.authorRemoveOption);
      const decision = findDecision(state, key);
      if (!decision?.options?.[optionIndex]) {
        return;
      }
      decision.options.splice(optionIndex, 1);
      try {
        await persistDecisions(state);
        render();
      } catch (error) {
        window.alert(error.message || "Could not remove option.");
        render();
      }
    });
  });

  main.querySelectorAll("[data-author-option-field]").forEach((el) => {
    const key = el.dataset.decisionKey;
    const optionIndex = Number(el.dataset.optionIndex);
    const field = el.dataset.authorOptionField;
    el.addEventListener("input", () => {
      const decision = findDecision(state, key);
      const option = decision?.options?.[optionIndex];
      if (!option || !field) {
        return;
      }
      option[field] = el.value;
      debounceSave(
        `decision-${key}-opt-${optionIndex}-${field}`,
        () => persistDecisions(state),
      );
    });
  });

  main.querySelectorAll("[data-author-option-caption]").forEach((el) => {
    const key = el.dataset.decisionKey;
    const optionIndex = Number(el.dataset.optionIndex);
    const evidenceIndex = Number(el.dataset.evidenceIndex);
    el.addEventListener("input", () => {
      const decision = findDecision(state, key);
      const item = decision?.options?.[optionIndex]?.evidence?.[evidenceIndex];
      if (!item) {
        return;
      }
      item.caption = el.value;
      debounceSave(
        `decision-${key}-opt-${optionIndex}-cap-${evidenceIndex}`,
        () => persistDecisions(state),
      );
    });
  });

  main.querySelectorAll("[data-author-add-option-media]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.decisionKey;
      const optionIndex = Number(button.dataset.optionIndex);
      const decision = findDecision(state, key);
      const option = decision?.options?.[optionIndex];
      if (!option) {
        return;
      }
      const linked = (option.evidence || []).map((item) => item.file).filter(Boolean);
      openAuthorMediaPicker({
        allowGallery: false,
        galleryFiles: linked,
        callback: async (file) => {
          if (linked.includes(file)) {
            window.alert(`${file} is already linked to this answer.`);
            return;
          }
          option.evidence = option.evidence || [];
          option.evidence.push({ file, caption: "" });
          try {
            await persistDecisions(state);
            render();
          } catch (error) {
            window.alert(error.message || "Could not attach media.");
          }
        },
      });
    });
  });

  main.querySelectorAll("[data-author-change-option-media]").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.decisionKey;
      const optionIndex = Number(button.dataset.optionIndex);
      const evidenceIndex = Number(button.dataset.evidenceIndex);
      const decision = findDecision(state, key);
      const option = decision?.options?.[optionIndex];
      const item = option?.evidence?.[evidenceIndex];
      if (!item) {
        return;
      }
      const blocked = (option.evidence || [])
        .filter((_, index) => index !== evidenceIndex)
        .map((row) => row.file)
        .filter(Boolean);
      openAuthorMediaPicker({
        allowGallery: false,
        galleryFiles: blocked,
        callback: async (file) => {
          if (blocked.includes(file)) {
            window.alert(`${file} is already linked to this answer.`);
            return;
          }
          item.file = file;
          try {
            await persistDecisions(state);
            render();
          } catch (error) {
            window.alert(error.message || "Could not change media.");
          }
        },
      });
    });
  });

  main.querySelectorAll("[data-author-remove-option-media]").forEach((button) => {
    button.addEventListener("click", async () => {
      const key = button.dataset.decisionKey;
      const optionIndex = Number(button.dataset.optionIndex);
      const evidenceIndex = Number(button.dataset.evidenceIndex);
      const decision = findDecision(state, key);
      const option = decision?.options?.[optionIndex];
      if (!option?.evidence?.[evidenceIndex]) {
        return;
      }
      option.evidence.splice(evidenceIndex, 1);
      try {
        await persistDecisions(state);
        render();
      } catch (error) {
        window.alert(error.message || "Could not remove media.");
        render();
      }
    });
  });
}

function bindTaskReorderDrag(ctx) {
  const { state, main, render } = ctx;
  const lists = main.querySelectorAll(".issue-list[data-author-task-list]");
  if (!lists.length) {
    return;
  }

  let draggedKey = null;

  lists.forEach((list) => {
    list.querySelectorAll("[data-author-task-drag]").forEach((card) => {
      card.setAttribute("draggable", "true");
      card.addEventListener("dragstart", (event) => {
        draggedKey = card.dataset.authorTaskDrag;
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", draggedKey);
        card.classList.add("is-dragging");
      });
      card.addEventListener("dragend", () => {
        draggedKey = null;
        main
          .querySelectorAll(".is-dragging, .is-drop-before, .is-drop-after")
          .forEach((node) => {
            node.classList.remove(
              "is-dragging",
              "is-drop-before",
              "is-drop-after",
            );
          });
      });
    });

    list.addEventListener("dragover", (event) => {
      if (!draggedKey) {
        return;
      }
      event.preventDefault();
      list
        .querySelectorAll(".is-drop-before, .is-drop-after")
        .forEach((node) => {
          node.classList.remove("is-drop-before", "is-drop-after");
        });
      const card = event.target.closest("[data-author-task-drag]");
      if (card && card.dataset.authorTaskDrag !== draggedKey) {
        const rect = card.getBoundingClientRect();
        const before = event.clientY < rect.top + rect.height / 2;
        card.classList.add(before ? "is-drop-before" : "is-drop-after");
      }
    });

    list.addEventListener("drop", async (event) => {
      event.preventDefault();
      const key =
        event.dataTransfer.getData("text/plain") || draggedKey;
      const phaseId = Number(list.dataset.authorTaskList);
      const target = event.target.closest("[data-author-task-drag]");
      let insertBeforeKey = null;
      if (target && target.dataset.authorTaskDrag !== key) {
        const rect = target.getBoundingClientRect();
        const before = event.clientY < rect.top + rect.height / 2;
        if (before) {
          insertBeforeKey = target.dataset.authorTaskDrag;
        } else {
          const cards = [...list.querySelectorAll("[data-author-task-drag]")];
          const idx = cards.indexOf(target);
          insertBeforeKey = cards[idx + 1]?.dataset.authorTaskDrag || null;
        }
      }
      if (!key || !Number.isFinite(phaseId)) {
        return;
      }
      const previous = state.tasks.slice();
      try {
        const next = reorderTasksFromDrop(state.tasks, state.audit, {
          draggedKey: key,
          targetPhaseId: phaseId,
          insertBeforeKey,
        });
        state.tasks.splice(0, state.tasks.length, ...next);
        await persistTasks(state);
        render();
      } catch (error) {
        state.tasks.splice(0, state.tasks.length, ...previous);
        window.alert(error.message || "Could not reorder tasks.");
        render();
      }
    });
  });
}
