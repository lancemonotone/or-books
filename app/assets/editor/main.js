import {
  dumpYaml,
  loadMediaList,
  loadYamlFile,
  requestJson,
  saveYamlFile,
  syncAuditStats,
  syncEvidenceIssueLinks,
} from './api.js';
import { cancelAutosave, flushAutosave, initAutosave, scheduleAutosave } from './autosave.js';
import { initPicker, setPickerFiles } from './picker.js';
import { initIssueComposer } from './issue-composer.js';
import { applyActiveForm, renderActiveView } from './views.js';

const loginPanel = document.getElementById('login-panel');
const workspacePanel = document.getElementById('workspace-panel');
const blockedPanel = document.getElementById('blocked-panel');
const loginForm = document.getElementById('login-form');
const loginStatus = document.getElementById('login-status');
const editorStatus = document.getElementById('editor-status');
const saveIndicator = document.getElementById('save-indicator');
const saveIndicatorText = document.getElementById('save-indicator-text');
const workspace = document.getElementById('workspace');
const reloadButton = document.getElementById('reload-button');
const logoutButton = document.getElementById('logout-button');
const saveHoneypot = document.getElementById('save-honeypot');
const tabButtons = document.querySelectorAll('[data-tab]');

const state = {
  csrf: null,
  activeTab: 'issues',
  data: {
    audit: null,
    issues: [],
    evidence: [],
    decisions: [],
  },
  dirty: {
    audit: false,
    issues: false,
    evidence: false,
    decisions: false,
  },
  ui: {
    selectedIssueId: null,
    selectedEvidenceIndex: 0,
    selectedDecisionId: null,
    issuePhaseFilter: 'all',
  },
};

function showPanel(panel) {
  [loginPanel, workspacePanel, blockedPanel].forEach((node) => {
    node.hidden = node !== panel;
  });
}

function setStatus(node, message, isError = false) {
  node.textContent = message;
  node.classList.toggle('is-error', isError);
}

function setSaveIndicator(mode, detail = '') {
  if (!saveIndicator || !saveIndicatorText) {
    return;
  }

  saveIndicator.classList.remove('is-pending', 'is-saving', 'is-saved', 'is-error');

  if (mode === 'pending') {
    saveIndicator.classList.add('is-pending');
    saveIndicatorText.textContent = 'Unsaved';
    return;
  }

  if (mode === 'saving') {
    saveIndicator.classList.add('is-saving');
    saveIndicatorText.textContent = 'Saving…';
    return;
  }

  if (mode === 'saved') {
    saveIndicator.classList.add('is-saved');
    saveIndicatorText.textContent = 'Saved';
    return;
  }

  if (mode === 'error') {
    saveIndicator.classList.add('is-error');
    saveIndicatorText.textContent = detail || 'Save failed';
    return;
  }

  saveIndicatorText.textContent = '\u00a0';
}

function markDirty(tab = state.activeTab) {
  state.dirty[tab] = true;
}

function clearDirty(tab) {
  state.dirty[tab] = false;
}

function isDirty() {
  return Object.values(state.dirty).some(Boolean);
}

function updateTabs() {
  tabButtons.forEach((button) => {
    button.classList.toggle('is-active', button.dataset.tab === state.activeTab);
    button.classList.toggle('has-changes', state.dirty[button.dataset.tab]);
  });
}

function onFormChange(...alsoDirty) {
  markDirty();
  for (const tab of alsoDirty) {
    if (tab && tab !== state.activeTab) {
      markDirty(tab);
    }
  }
  updateTabs();
  scheduleAutosave();
}

function renderWorkspace() {
  renderActiveView(state, workspace, onFormChange, navigateToIssue, navigateToEvidence);
  updateTabs();
}

function captureEditorFocus() {
  const el = document.activeElement;
  if (!el || !workspace.contains(el) || !el.name) {
    return null;
  }

  const snapshot = { name: el.name };
  if (typeof el.selectionStart === 'number') {
    snapshot.selectionStart = el.selectionStart;
    snapshot.selectionEnd = el.selectionEnd;
  }
  return snapshot;
}

function restoreEditorFocus(snapshot) {
  if (!snapshot?.name) {
    return;
  }

  const el = workspace.querySelector(`[name="${CSS.escape(snapshot.name)}"]`);
  if (!el) {
    return;
  }

  el.focus({ preventScroll: true });
  if (typeof snapshot.selectionStart === 'number' && typeof el.setSelectionRange === 'function') {
    try {
      el.setSelectionRange(snapshot.selectionStart, snapshot.selectionEnd);
    } catch {
      // Some input types do not support selection ranges.
    }
  }
}

let historyFromPopstate = false;

function buildEditorUrl() {
  const url = new URL(window.location.href);
  url.searchParams.set('tab', state.activeTab);

  if (state.activeTab === 'issues' && state.ui.selectedIssueId) {
    url.searchParams.set('issue', state.ui.selectedIssueId);
    url.searchParams.delete('file');
  } else if (state.activeTab === 'evidence') {
    const row = state.data.evidence[state.ui.selectedEvidenceIndex];
    if (row?.file) {
      url.searchParams.set('file', row.file);
    }
    url.searchParams.delete('issue');
  } else {
    url.searchParams.delete('issue');
    url.searchParams.delete('file');
  }

  return url;
}

function syncEditorUrl({ push = false } = {}) {
  const url = buildEditorUrl();
  const current = `${window.location.pathname}${window.location.search}`;
  const next = `${url.pathname}${url.search}`;

  if (current === next) {
    if (!window.history.state?.editor) {
      history.replaceState({ editor: true }, '', url);
    }
    return;
  }

  if (push && !historyFromPopstate) {
    history.pushState({ editor: true }, '', url);
  } else {
    history.replaceState({ editor: true }, '', url);
  }
}

async function restoreEditorFromUrl() {
  if (isDirty()) {
    await flushAutosave();
  }

  applyActiveForm(state);
  applyEditorDeepLink();
  renderWorkspace();
}

async function navigateToIssue(issueId) {
  if (!issueId || !state.data.issues.some((item) => item.id === issueId)) {
    return;
  }

  if (state.activeTab === 'issues' && state.ui.selectedIssueId === issueId) {
    return;
  }

  if (isDirty()) {
    await flushAutosave();
  }

  applyActiveForm(state);
  state.activeTab = 'issues';
  state.ui.selectedIssueId = issueId;
  syncEditorUrl({ push: true });
  renderWorkspace();
}

async function navigateToEvidence(file) {
  if (!file) {
    return;
  }

  const index = state.data.evidence.findIndex((row) => row.file === file);
  if (index < 0) {
    return;
  }

  if (state.activeTab === 'evidence' && state.data.evidence[state.ui.selectedEvidenceIndex]?.file === file) {
    return;
  }

  if (isDirty()) {
    await flushAutosave();
  }

  applyActiveForm(state);
  state.activeTab = 'evidence';
  state.ui.selectedEvidenceIndex = index;
  syncEditorUrl({ push: true });
  renderWorkspace();
}

function filesToPersist() {
  const tab = state.activeTab;
  const filesToSave = new Set([tab]);

  if (tab === 'evidence' || tab === 'decisions') {
    filesToSave.add('audit');
  }

  if (state.dirty.issues) {
    syncEvidenceIssueLinks(state.data.issues, state.data.evidence);
    filesToSave.add('issues');
    filesToSave.add('evidence');
  }

  if (tab === 'issues') {
    syncEvidenceIssueLinks(state.data.issues, state.data.evidence);
    filesToSave.add('evidence');
    filesToSave.add('audit');
  }

  return filesToSave;
}

async function persistDirty({ quiet = false } = {}) {
  if (!isDirty()) {
    return false;
  }

  applyActiveForm(state);
  syncAuditStats(state.data.audit, state.data.issues, state.data.evidence, state.data.decisions);

  const filesToSave = filesToPersist();

  if (!quiet) {
    setStatus(editorStatus, 'Saving…');
  }

  const focusSnapshot = quiet ? captureEditorFocus() : null;

  try {
    for (const file of filesToSave) {
      const content = dumpYaml(state.data[file], file);
      await saveYamlFile(file, content, state.csrf, saveHoneypot.value);
      clearDirty(file);
    }

    if (!quiet) {
      setStatus(editorStatus, `Saved ${[...filesToSave].join(', ')}.`);
    }
    updateTabs();
    renderWorkspace();
    if (focusSnapshot) {
      restoreEditorFocus(focusSnapshot);
    }
    return true;
  } catch (error) {
    if (!quiet) {
      setStatus(editorStatus, error.message, true);
    }
    throw error;
  }
}

async function loadAllData() {
  const [audit, issues, evidence, decisions, media] = await Promise.all([
    loadYamlFile('audit'),
    loadYamlFile('issues'),
    loadYamlFile('evidence'),
    loadYamlFile('decisions'),
    loadMediaList(),
  ]);

  state.data = {
    audit,
    issues: issues || [],
    evidence: evidence || [],
    decisions: decisions || [],
  };
  state.ui.selectedIssueId = state.data.issues[0]?.id ?? null;
  state.ui.selectedDecisionId = state.data.decisions[0]?.id ?? null;
  state.ui.selectedEvidenceIndex = 0;
  syncAuditStats(state.data.audit, state.data.issues, state.data.evidence, state.data.decisions);
  setPickerFiles(media);
  Object.keys(state.dirty).forEach(clearDirty);
  applyEditorDeepLink();
}

function applyEditorDeepLink() {
  const params = new URLSearchParams(window.location.search);
  const tab = params.get('tab');
  const issueId = params.get('issue');
  const file = params.get('file');

  if (file) {
    const index = state.data.evidence.findIndex((row) => row.file === file);
    if (index >= 0) {
      state.activeTab = 'evidence';
      state.ui.selectedEvidenceIndex = index;
    }
  }

  if (issueId && state.data.issues.some((item) => item.id === issueId)) {
    state.activeTab = 'issues';
    state.ui.selectedIssueId = issueId;
  }

  if (tab && Object.hasOwn(state.data, tab)) {
    state.activeTab = tab;
  }

  if (tab === 'decisions') {
    const decisionId = params.get('decision');
    if (decisionId && state.data.decisions.some((item) => item.id === decisionId)) {
      state.ui.selectedDecisionId = decisionId;
    }
  }
}

async function loadSession() {
  try {
    const data = await requestJson('../api/editor-auth.php');

    if (!data.authenticated) {
      showPanel(loginPanel);
      return;
    }

    state.csrf = data.csrf;
    initPicker();
    initIssueComposer();
    initAutosave({
      onSave: () => persistDirty({ quiet: true }),
      onIndicator: setSaveIndicator,
    });
    await loadAllData();
    showPanel(workspacePanel);
    renderWorkspace();
    syncEditorUrl({ push: false });
    setSaveIndicator('idle');
    setStatus(editorStatus, 'Loaded.');
  } catch (error) {
    if (error.message.includes('not configured')) {
      showPanel(blockedPanel);
      return;
    }
    showPanel(loginPanel);
    setStatus(loginStatus, error.message, true);
  }
}

async function switchTab(nextTab) {
  if (nextTab === state.activeTab) {
    return;
  }

  if (isDirty()) {
    const saved = await flushAutosave();
    if (!saved && isDirty()) {
      if (!window.confirm('Could not save your changes. Discard them and switch tabs?')) {
        return;
      }
      state.data[state.activeTab] = await loadYamlFile(state.activeTab);
      clearDirty(state.activeTab);
    }
  }

  applyActiveForm(state);
  state.activeTab = nextTab;
  renderWorkspace();
  syncEditorUrl({ push: true });
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  setStatus(loginStatus, 'Signing in…');

  try {
    const data = await requestJson('../api/editor-auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'login',
        password: formData.get('password'),
        website: formData.get('website'),
      }),
    });
    state.csrf = data.csrf;
    loginForm.reset();
    initPicker();
    initIssueComposer();
    initAutosave({
      onSave: () => persistDirty({ quiet: true }),
      onIndicator: setSaveIndicator,
    });
    await loadAllData();
    showPanel(workspacePanel);
    renderWorkspace();
    syncEditorUrl({ push: false });
    setSaveIndicator('idle');
    setStatus(loginStatus, '');
  } catch (error) {
    setStatus(loginStatus, error.message, true);
  }
});

tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    switchTab(button.dataset.tab);
  });
});

reloadButton.addEventListener('click', async () => {
  if (isDirty()) {
    const saved = await flushAutosave();
    if (!saved && isDirty() && !window.confirm('Could not save. Discard changes and reload?')) {
      return;
    }
  }
  cancelAutosave();
  setStatus(editorStatus, 'Reloading…');
  try {
    const media = await loadMediaList();
    setPickerFiles(media);
    await loadAllData();
    renderWorkspace();
    setSaveIndicator('idle');
    setStatus(editorStatus, 'Reloaded.');
  } catch (error) {
    setStatus(editorStatus, error.message, true);
  }
});

logoutButton.addEventListener('click', async () => {
  if (isDirty()) {
    await flushAutosave();
  }
  try {
    await requestJson('../api/editor-auth.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'logout',
        csrf: state.csrf,
      }),
    });
  } catch {
    // Session may already be gone.
  }
  state.csrf = null;
  cancelAutosave();
  showPanel(loginPanel);
  setStatus(editorStatus, '');
  setSaveIndicator('idle');
});

window.addEventListener('popstate', async () => {
  if (!workspacePanel.hidden) {
    historyFromPopstate = true;
    try {
      await restoreEditorFromUrl();
    } finally {
      historyFromPopstate = false;
    }
  }
});

window.addEventListener('beforeunload', (event) => {
  if (isDirty()) {
    event.preventDefault();
    event.returnValue = '';
  }
});

loadSession();
