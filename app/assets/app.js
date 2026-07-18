import {
  loadContent,
  loadResponses,
  saveDecision,
  saveTaskPriority,
  saveTaskStatus,
  saveTaskPhase,
  saveTaskTags,
  savePhaseOrder,
  saveSettings,
  loadSettings,
  loadAuditLog,
  postCommentReply,
  editCommentMessage,
  fetchAuth,
  login,
  changePassword,
  logout,
  setCsrfToken,
  mediaUrl,
} from "./api.js";
import { parseRoute, onRouteChange } from "./router.js";
import { motion } from "./motion.js";
import {
  summarizeEstimates,
  summarizeEstimatesByPhase,
  formatUsd,
  formatHours,
  taskEstimateHours,
  taskActualHours,
  hoursToCost,
} from "./estimates.js";
import {
  DEFAULT_ESTIMATE_PRINT_PROFILE,
  printEstimate,
} from "./estimate-print.js";
import {
  readStoredEditMode,
  applyEditModeClass,
  syncAuthorEditToggle,
  bindAuthorEditToggle,
  bindAuthorModeHandlers,
  initAuthorMediaPicker,
  takePendingDecisionScroll,
} from "./author-mode.js";
import {
  syncTaskAuthorLock,
  takeoverTaskLock,
  bindTaskLockLifecycle,
  taskAuthoringBlocked,
  renderTaskLockBanner,
} from "./task-lock.js";

const AUTHOR_KEYS = {
  comment: "or-audit-author",
  decision: "or-audit-author",
};

const THEME_KEY = "or-audit-theme";
const BOOT_ENTER_MS = 700;
const BOOT_LABEL_DELAY_MS = 500;
const BOOT_HOLD_MS = 1000;
const BOOT_EXIT_MS = 500;

const COPY = {
  overview: "Overview",
  settings: "Settings",
  settingsLead:
    "Project name, appearance, and notification teams. Temp passwords give other people a review login — not for the admin account.",
  settingsTabProject: "Project",
  settingsTabAppearance: "Appearance",
  settingsTabNotifications: "Users",
  settingsTabActivity: "Activity",
  activityLog: "Activity log",
  activityLogLead: "Recent sign-ins and changes. Admin only.",
  openActivityLog: "View activity log",
  activityLogEmpty: "No activity recorded yet.",
  activityLogColWhen: "When",
  activityLogColWho: "Who",
  activityLogColAction: "Action",
  activityLogColResult: "Result",
  activityLogOk: "OK",
  activityLogFail: "Failed",
  accountMenu: "Account",
  clientName: "Client / project name",
  appearance: "Appearance",
  themeLight: "Light",
  themeDark: "Dark",
  themeSystem: "System",
  notifications: "Notifications",
  notifyEnabled: "Send email notifications",
  clientTeam: "Client team",
  developerTeam: "Developer team",
  clientTeamShort: "Client",
  developerTeamShort: "Developer",
  teamMemberName: "Name in the app",
  teamMemberEmail: "Email",
  teamAddMember: "Add person",
  teamRemoveMember: "Remove person",
  teamFrequency: "Update frequency",
  frequencyNone: "None",
  frequencyImmediate: "Immediate",
  frequencyHourly: "Hourly digest",
  frequencyDaily: "Daily digest",
  saveSettings: "Save settings",
  settingsSaved: "Settings saved.",
  phases: "Phases",
  phase: "Phase",
  screenshots: "Media",
  yourInput: "Your input",
  summary: "Summary",
  viewAll: "View all",
  suggestions: "suggested changes",
  openAllPhases: "Open all",
  closeAllPhases: "Close all",
  reorderPhases: "Reorder phases",
  doneReorderingPhases: "Done",
  evidenceNoUrl: "No page URL",
  evidenceGroupCount: (n) => `${n} ${n === 1 ? "item" : "items"}`,
  decisionCount: (n) => `${n} ${n === 1 ? "question" : "questions"}`,
  whatWeFound: "Task Found",
  whatWeSuggest: "Suggested Fix",
  screenshotsHeading: "Media",
  screenshotsGallery: "Media",
  screenshotsLead:
    "Images and recordings linked to tasks. In Edit mode, click a thumbnail to edit.",
  yourFeedback: "Your feedback",
  postingAs: "Posting as",
  conversation: "Conversation",
  conversationLead: "Feedback and replies on this task.",
  yourReply: "Your reply",
  firstNotePlaceholder: "Add a note…",
  replyPlaceholder: "Write a reply…",
  sendReply: "Send",
  editMessage: "Edit",
  saveEdit: "Save",
  cancelEdit: "Cancel",
  noMessagesYet: "No messages yet.",
  signIn: "Sign in",
  signOut: "Sign out",
  authLead: "Enter your email and password to continue.",
  changePassword: "Change password",
  changePasswordLead: "Choose a new password for your account.",
  changePasswordForcedLead:
    "You must set a new password before continuing.",
  currentPassword: "Current password",
  newPassword: "New password",
  confirmPassword: "Confirm new password",
  savePassword: "Save password",
  passwordChanged: "Password updated.",
  teamTempPassword: "Temp password",
  teamLoginStatus: "Login",
  teamHasLogin: "Has login",
  teamMustChange: "Must change password",
  teamNoLogin: "No login yet",
  teamAdminLogin:
    "Admin account — change password with the lock icon in the header",
  cancel: "Cancel",
  yourName: "Your name",
  namePlaceholder: "Select a name",
  nameClear: "Clear name",
  nameRequired: "Select your name from the list.",
  nameEmptyList: "Add people under Settings first.",
  commentsOptional: "Comments (optional)",
  noteOptional: "Note (optional)",
  saveFeedback: "Save",
  saveDecision: "Save answer",
  commentOptional: "Comment (optional)",
  ourSuggestion: "Suggested approach",
  summaryTitle: "Summary of replies",
  summaryLead:
    "Every question and task in this review. Answers and comments appear when someone has saved them.",
  noScreenshotsLinked: "No media linked yet.",
  noTasksLinked: "No tasks linked",
  lastSaved: "Saved",
  youChose: "You chose",
  noDecisionsYet: "No questions in this review yet.",
  noFeedbackYet: "No tasks in this review yet.",
  noAnswerYet: "—",
  noCommentYet: "—",
  loadError: "Could not load review data",
  phaseNotFound: "Phase not found.",
  taskNotFound: "Task not found.",
  previousTask: "Previous task",
  nextTask: "Next task",
  filterNotFound: "No tasks match this filter.",
  priorityFilterTitle: (label) => `Priority: ${label}`,
  statusFilterTitle: (label) => `Status: ${label}`,
  tagFilterTitle: (label) => `Tag: ${label}`,
  addTag: "Add tag",
  removeTag: (tag) => `Remove tag ${tag}`,
  createTag: (tag) => `Create “${tag}”`,
  tagAlreadyAdded: "Already added",
  tagPlaceholder: "Find or create tag",
  tagEmptyList: "No tags yet — type to create one",
  replyCount: (n) => `${n} ${n === 1 ? "reply" : "replies"}`,
  estimates: "Estimate",
  hourlyRateMissing: "Hourly rate not configured",
  estimatesDone: "Done",
  estimatesRemaining: "Remaining",
  estimatesGrand: "Grand total",
  estimatesDeferred: "Deferred",
  estimatesDeferredCount: (n) => `${n} ${n === 1 ? "task" : "tasks"}`,
  estimatesDeferredNote: "Not included in totals",
  estimatesNoTasks: "No tasks yet.",
  estimatesEstimateHours: "Estimate hours",
  estimatesEstimateCost: "Estimate cost",
  estimatesActualHours: "Actual hours",
  estimatesActualCost: "Actual cost",
  estimatesColId: "Task",
  estimatesColTitle: "Title",
  estimatesColStatus: "Status",
  estimatesColEstimate: "Estimate",
  estimatesColActual: "Actual",
  estimatesCompletenessEstimate: (set, total) =>
    `Estimate hours set on ${set} of ${total} tasks`,
  estimatesCompletenessActual: (set, total) =>
    `Actual hours set on ${set} of ${total} tasks`,
  estimatesDownload: "Download estimate",
  estimatePrintRate: (formatted) => `Hourly rate: ${formatted}`,
  editMode: "Edit",
  doneEditing: "Done",
  addPhase: "Add phase",
  deletePhase: "Delete phase",
  addTask: "Add task",
  deleteTask: "Delete task",
  addMedia: "Add media",
  removeMedia: "Remove",
  addEvidenceRow: "Add media",
  deleteEvidenceRow: "Remove from index",
  editHours: "Hours (estimate)",
  editActualHours: "Actual hours",
  linkTasks: "Link tasks",
  addQuestion: "Add question",
  deleteQuestion: "Delete question",
  questionsHeading: "Questions",
  questionTitle: "Short title",
  questionText: "Question shown to client",
  questionRecommendation: "Suggested approach",
  questionLinkedTasks: "Linked tasks",
  questionAnswerChoices: "Answer choices",
  addOption: "Add option",
  removeOption: "Remove option",
  optionValue: "Value (saved answer)",
  optionLabel: "Button label",
  optionDescription: "Helper text",
  optionMedia: "Example media",
  addOptionMedia: "Add media",
  changeOptionMedia: "Change file",
  noOptionMedia: "No media for this option.",
  noAnswerChoices: "Add at least one answer choice.",
  noTasksYet: "No tasks yet.",
};

const PRIORITY_LABELS = {
  critical: "Most urgent",
  high: "Important",
  medium: "Moderate",
  low: "Minor",
};

const PRIORITY_OPTIONS = ["critical", "high", "medium", "low"];

const PRIORITY_SORT_RANK = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const STATUS_LABELS = {
  planned: "Planned",
  in_progress: "In progress",
  blocked: "Blocked",
  deferred: "Deferred",
  complete: "Complete",
};

const STATUS_OPTIONS = [
  "planned",
  "in_progress",
  "blocked",
  "deferred",
  "complete",
];

const STATUS_SORT_RANK = {
  planned: 0,
  in_progress: 1,
  blocked: 2,
  deferred: 3,
  complete: 4,
};

const state = {
  audit: null,
  tasks: [],
  evidence: [],
  decisions: [],
  responses: { comments: {}, decisions: {} },
  settings: {
    clientName: "",
    notifyEnabled: false,
    teams: {
      client: { members: [] },
      developer: { members: [] },
    },
  },
  route: parseRoute(),
  ready: false,
  hourlyRate: null,
  vendor: null,
  phaseReorderMode: false,
  editMode: readStoredEditMode(),
  taskLock: null,
  auth: {
    email: null,
    role: null,
    mustChangePassword: false,
  },
};

function applyHourlyRate(auth) {
  const raw = auth?.hourlyRate;
  state.hourlyRate =
    typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? raw : null;
}

function applyVendor(auth) {
  const raw = auth?.vendor;
  if (!raw || typeof raw !== "object") {
    state.vendor = null;
    return;
  }
  state.vendor = {
    name: String(raw.name || "").trim(),
    business: String(raw.business || "").trim(),
    address: String(raw.address || "").trim(),
    email: String(raw.email || "").trim(),
    phone: String(raw.phone || "").trim(),
    logo: String(raw.logo || "").trim(),
  };
}

function applyAuthSession(auth) {
  state.auth = {
    email: auth?.email ? String(auth.email) : null,
    role: auth?.role === "admin" ? "admin" : auth?.authenticated ? "user" : null,
    mustChangePassword: Boolean(auth?.mustChangePassword),
  };
  syncAdminNav();
}

function isAdmin() {
  return state.auth.role === "admin";
}

function syncAdminNav() {
  const show = isAdmin();
  const panel = document.getElementById("account-menu-panel");
  const logoutBtn = document.getElementById("logout-button");

  const editorLink = document.getElementById("nav-editor-link");
  if (editorLink) {
    editorLink.remove();
  }

  syncAuthorEditToggle(state, COPY);

  let settingsLink = document.getElementById("account-menu-settings");
  if (show) {
    if (!settingsLink && panel && logoutBtn) {
      settingsLink = document.createElement("a");
      settingsLink.id = "account-menu-settings";
      settingsLink.className = "account-menu__item";
      settingsLink.href = "#/settings";
      settingsLink.dataset.nav = "";
      settingsLink.setAttribute("role", "menuitem");
      settingsLink.textContent = COPY.settings;
      logoutBtn.before(settingsLink);
    }
  } else if (settingsLink) {
    settingsLink.remove();
  }

  const emailEl = document.getElementById("account-menu-email");
  if (emailEl) {
    if (state.auth.email) {
      emailEl.hidden = false;
      emailEl.textContent = state.auth.email;
    } else {
      emailEl.hidden = true;
      emailEl.textContent = "";
    }
  }
}

function clientName() {
  return String(state.settings?.clientName || "").trim();
}

function applyBrand() {
  const name = clientName();
  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = name;
  });
  document.title = name;
}

function getThemePref() {
  try {
    return localStorage.getItem(THEME_KEY) || "system";
  } catch {
    return "system";
  }
}

function resolvedTheme(pref = getThemePref()) {
  if (pref === "dark" || pref === "light") {
    return pref;
  }
  if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

function applyTheme(pref = getThemePref()) {
  const next = ["light", "dark", "system"].includes(pref) ? pref : "system";
  try {
    localStorage.setItem(THEME_KEY, next);
  } catch {
    /* ignore */
  }
  document.documentElement.dataset.themePref = next;
  document.documentElement.dataset.theme = resolvedTheme(next);
}

const main = document.getElementById("main");
const siteHeader = document.getElementById("site-header");
const bootSplash = document.getElementById("boot-splash");
const authPanel = document.getElementById("auth-panel");
const authBlocked = document.getElementById("auth-blocked");
const changePasswordPanel = document.getElementById("change-password-panel");
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");
const changePasswordForm = document.getElementById("change-password-form");
const changePasswordStatus = document.getElementById("change-password-status");
const changePasswordLede = document.getElementById("change-password-lede");
const changePasswordCancel = document.getElementById("change-password-cancel");
const changePasswordButton = document.getElementById("change-password-button");
const logoutButton = document.getElementById("logout-button");
const accountMenu = document.getElementById("account-menu");
const accountMenuToggle = document.getElementById("account-menu-toggle");
const accountMenuPanel = document.getElementById("account-menu-panel");
const auditDialog = document.getElementById("audit-dialog");
const auditDialogBody = document.getElementById("audit-dialog-body");
const auditDialogClose = document.getElementById("audit-dialog-close");
const bootStartedAt = performance.now();
let bootEnded = false;

const AUTH_SESSION_HINT = "or-audit-authed";

function markAuthedSession() {
  try {
    sessionStorage.setItem(AUTH_SESSION_HINT, "1");
  } catch {
    /* ignore */
  }
  document.documentElement.dataset.skipSplash = "1";
}

function clearAuthedSession() {
  state.hourlyRate = null;
  state.vendor = null;
  try {
    sessionStorage.removeItem(AUTH_SESSION_HINT);
  } catch {
    /* ignore */
  }
  delete document.documentElement.dataset.skipSplash;
}

function prefersReducedMotion() {
  return (
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true
  );
}

async function sleep(ms) {
  if (ms <= 0) {
    return;
  }
  await new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

/** Hide splash immediately — no branded enter/hold/exit (same idea as editor). */
function skipBootSplash() {
  bootEnded = true;
  if (bootSplash) {
    bootSplash.hidden = true;
    bootSplash.classList.remove("is-leaving");
    bootSplash.setAttribute("aria-busy", "false");
  }
  document.body.classList.remove("is-booting");
}

async function endBoot() {
  if (bootEnded) {
    return;
  }
  bootEnded = true;

  if (bootSplash && !bootSplash.hidden) {
    bootSplash.classList.add("is-leaving");
    const exitMs = prefersReducedMotion() ? 0 : BOOT_EXIT_MS;
    await sleep(exitMs);
    bootSplash.hidden = true;
    bootSplash.setAttribute("aria-busy", "false");
  }

  document.body.classList.remove("is-booting");
}

/** Wait until mark + title have finished entering, then hold settled splash. */
async function waitForSplashHold() {
  const enterMs = prefersReducedMotion()
    ? 0
    : BOOT_LABEL_DELAY_MS + BOOT_ENTER_MS;
  const untilEnterDone = Math.max(
    0,
    enterMs - (performance.now() - bootStartedAt),
  );
  await sleep(untilEnterDone);
  const holdMs = prefersReducedMotion() ? 0 : BOOT_HOLD_MS;
  await sleep(holdMs);
}
const lightbox = document.getElementById("lightbox");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxBody = document.getElementById("lightbox-body");
const lightboxFooter = document.getElementById("lightbox-footer");
const lightboxPrev = lightbox.querySelector("[data-lightbox-prev]");
const lightboxNext = lightbox.querySelector("[data-lightbox-next]");
const lightboxStage = lightbox.querySelector(".lightbox__stage");

const lightboxGallery = {
  files: [],
  index: -1,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function priorityLabel(priority) {
  return PRIORITY_LABELS[priority] || priority;
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

/** Compact date for Summary tables (full stamp on hover via title). */
function formatSummaryDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return { label: "", title: "", iso: "" };
  }
  return {
    label: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    }),
    title: date.toLocaleString(),
    iso: date.toISOString(),
  };
}

function renderSummaryDateCell(value) {
  const { label, title, iso } = formatSummaryDate(value);
  if (!label) {
    return "";
  }
  return `<time datetime="${escapeHtml(iso)}" title="${escapeHtml(title)}">${escapeHtml(label)}</time>`;
}

/** Cool hues only (no priority reds). Consecutive phases take opposite ends, then advance inward. */
function phaseColorVars(sprintId) {
  const parsed = Number(sprintId);
  const index = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  // Teal → cyan → azure → blue → indigo → green → sky → violet-blue
  const phaseHues = [165, 195, 225, 255, 140, 210, 240, 280];
  const len = phaseHues.length;
  const slot = (index - 1) % len;
  // 0 → start, 1 → end, 2 → start+1, 3 → end-1, …
  const hueIndex = slot % 2 === 0 ? slot / 2 : len - 1 - Math.floor(slot / 2);
  const hue = phaseHues[hueIndex];
  return {
    "--phase-fg": `hsl(${hue} 52% 34%)`,
    "--phase-bg": `hsl(${hue} 48% 92%)`,
    "--phase-fg-dark": `hsl(${hue} 70% 78%)`,
    "--phase-bg-dark": `hsl(${hue} 32% 18%)`,
    "--phase-accent": `hsl(${hue} 52% 42%)`,
    "--phase-accent-dark": `hsl(${hue} 65% 60%)`,
  };
}

function syncPillControlChrome(select, chromeClassName, styleCssText) {
  const control = select.closest(".pill-control");
  if (!control) {
    return;
  }
  control.className = `pill-control ${chromeClassName}`;
  if (styleCssText !== undefined) {
    control.style.cssText = styleCssText || "";
  }
}

function phaseStyleAttr(sprintId) {
  return Object.entries(phaseColorVars(sprintId))
    .map(([name, value]) => `${name}:${value}`)
    .join(";");
}

function phasePillLabel(sprintId) {
  const sprint = (state.audit?.sprints || []).find(
    (item) => String(item.id) === String(sprintId),
  );
  if (sprint?.title && /uncategorized/i.test(String(sprint.title))) {
    return sprint.title;
  }
  return `${COPY.phase} ${sprintId}`;
}

function renderPhasePill(sprintId, { linked = true } = {}) {
  const label = escapeHtml(phasePillLabel(sprintId));
  const style = phaseStyleAttr(sprintId);
  const className = "pill pill--phase";
  if (!linked) {
    return `<span class="${className}" style="${style}">${label}</span>`;
  }
  return `<a class="${className}" style="${style}" href="${overviewHref([sprintId])}">${label}</a>`;
}

function taskByKey(key) {
  return state.tasks.find((item) => item.key === key);
}

function evidenceByFile(file) {
  return state.evidence.find((item) => item.file === file);
}

function tasksForEvidence(file) {
  const row = evidenceByFile(file);
  if (!row?.tasks?.length) {
    return [];
  }
  return row.tasks.map(taskByKey).filter(Boolean);
}

function decisionsForTask(taskKey) {
  return state.decisions.filter((decision) =>
    (decision.blocks || []).includes(taskKey),
  );
}

function sprintTasks(sprintId) {
  return state.tasks.filter(
    (item) => String(item.sprint) === String(sprintId),
  );
}

function compareTaskIds(a, b) {
  const [aPhase = 0, aNum = 0] = String(a.id).split(".").map(Number);
  const [bPhase = 0, bNum = 0] = String(b.id).split(".").map(Number);
  if (aPhase !== bPhase) {
    return aPhase - bPhase;
  }
  return aNum - bNum;
}

function taskIdSortRank(issueLike) {
  if (!issueLike) {
    return Number.MAX_SAFE_INTEGER;
  }
  const [phase = 0, num = 0] = String(issueLike.id || "")
    .split(".")
    .map(Number);
  const phaseRank = Number.isFinite(phase) ? phase : 0;
  const numRank = Number.isFinite(num) ? num : 0;
  return phaseRank * 10000 + numRank;
}

function decisionTaskSortRank(decision) {
  const tasks = (decision?.blocks || [])
    .map(taskByKey)
    .filter(Boolean)
    .sort(compareTaskIds);
  if (!tasks.length) {
    return Number.MAX_SAFE_INTEGER;
  }
  return taskIdSortRank(tasks[0]);
}

function orderedSprintTasks(sprintId) {
  return [...sprintTasks(sprintId)].sort(compareTaskIds);
}

function taskNeighbors(taskKey) {
  const task = taskByKey(taskKey);
  if (!task) {
    return { prev: null, next: null };
  }

  const phaseTasks = orderedSprintTasks(task.sprint);
  const index = phaseTasks.findIndex((item) => item.key === taskKey);
  if (index < 0) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? phaseTasks[index - 1] : null,
    next: index < phaseTasks.length - 1 ? phaseTasks[index + 1] : null,
  };
}

function renderTaskNav(taskKey) {
  const { prev, next } = taskNeighbors(taskKey);
  const prevControl = prev
    ? `<a class="issue-nav__link" href="#/task/${escapeHtml(prev.key)}" aria-label="${escapeHtml(COPY.previousTask)}: ${escapeHtml(prev.id)} ${escapeHtml(prev.title)}">${TASK_NAV_PREV_ICON}</a>`
    : `<span class="issue-nav__link is-disabled" aria-hidden="true">${TASK_NAV_PREV_ICON}</span>`;
  const nextControl = next
    ? `<a class="issue-nav__link" href="#/task/${escapeHtml(next.key)}" aria-label="${escapeHtml(COPY.nextTask)}: ${escapeHtml(next.id)} ${escapeHtml(next.title)}">${TASK_NAV_NEXT_ICON}</a>`
    : `<span class="issue-nav__link is-disabled" aria-hidden="true">${TASK_NAV_NEXT_ICON}</span>`;

  return `<nav class="issue-nav" aria-label="Tasks in this phase">${prevControl}${nextControl}</nav>`;
}

function tasksByPriority(priority) {
  return state.tasks.filter((item) => item.priority === priority);
}

function tasksByStatus(status) {
  return state.tasks.filter((item) => item.status === status);
}

function tasksByTag(tag) {
  const needle = String(tag || "")
    .trim()
    .toLowerCase();
  if (!needle) {
    return [];
  }
  return state.tasks.filter((item) =>
    (item.tags || []).some(
      (entry) => String(entry).trim().toLowerCase() === needle,
    ),
  );
}

function normalizeTagLabel(tag) {
  return String(tag || "")
    .trim()
    .replace(/\s+/g, " ");
}

function tagsMatch(a, b) {
  return (
    normalizeTagLabel(a).toLowerCase() === normalizeTagLabel(b).toLowerCase()
  );
}

function collectKnownTags() {
  const seen = new Map();
  for (const task of state.tasks) {
    for (const entry of task.tags || []) {
      const tag = normalizeTagLabel(entry);
      if (!tag) {
        continue;
      }
      const key = tag.toLowerCase();
      if (!seen.has(key)) {
        seen.set(key, tag);
      }
    }
  }
  return [...seen.values()].sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" }),
  );
}

function canonicalizeTag(tag, catalog = collectKnownTags()) {
  const normalized = normalizeTagLabel(tag);
  if (!normalized) {
    return "";
  }
  const match = catalog.find((entry) => tagsMatch(entry, normalized));
  return match || normalized;
}

function getAuthor(kind) {
  const key = AUTHOR_KEYS[kind] || AUTHOR_KEYS.comment;
  return (
    localStorage.getItem(key) ||
    localStorage.getItem("or-audit-author-comment") ||
    localStorage.getItem("or-audit-author-decision") ||
    ""
  );
}

function setAuthor(name, kind = "comment") {
  const key = AUTHOR_KEYS[kind] || AUTHOR_KEYS.comment;
  const trimmed = name.trim();
  if (!trimmed) {
    return;
  }
  localStorage.setItem(key, trimmed);
}

function authorsMatch(a, b) {
  return (
    String(a || "")
      .trim()
      .toLowerCase() ===
    String(b || "")
      .trim()
      .toLowerCase()
  );
}

function normalizeCommentClient(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  const author = String(row.author || "").trim();
  const updatedAt = String(row.updatedAt || "");
  let messages = Array.isArray(row.messages)
    ? row.messages.filter(
        (message) => message && String(message.text || "").trim() !== "",
      )
    : [];

  const fallbackText = String(row.text || "").trim();
  if (messages.length === 0 && fallbackText) {
    messages = [
      {
        id: `legacy-text-${updatedAt || "opening"}`,
        author: author || "Unknown",
        text: fallbackText,
        createdAt: updatedAt,
        updatedAt,
      },
    ];
  }

  return {
    ...row,
    author,
    updatedAt,
    messages,
    text: messages.length ? messages[messages.length - 1].text : fallbackText,
  };
}

function commentRecord(taskKey) {
  return normalizeCommentClient(state.responses.comments[taskKey]);
}

function commentMessages(taskKey) {
  return commentRecord(taskKey)?.messages || [];
}

function canEditMessage(message, messages) {
  if (!message || messages.length === 0) {
    return false;
  }
  const last = messages[messages.length - 1];
  return last.id === message.id;
}

function collectAuthorsByTeam() {
  return ["client", "developer"].map((teamKey) => {
    const members = state.settings?.teams?.[teamKey]?.members;
    const names = [];
    if (Array.isArray(members)) {
      for (const member of members) {
        const name = String(member?.name || "").trim();
        if (name && !names.some((existing) => authorsMatch(existing, name))) {
          names.push(name);
        }
      }
    }
    names.sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: "base" }),
    );
    return {
      teamKey,
      label:
        teamKey === "client" ? COPY.clientTeamShort : COPY.developerTeamShort,
      names,
    };
  });
}

function collectKnownAuthors() {
  const names = [];
  for (const group of collectAuthorsByTeam()) {
    for (const name of group.names) {
      if (!names.some((existing) => authorsMatch(existing, name))) {
        names.push(name);
      }
    }
  }
  return names;
}

function resolveKnownAuthor(name) {
  const query = String(name || "").trim();
  if (!query) {
    return "";
  }
  const matched = collectKnownAuthors().find((known) =>
    authorsMatch(known, query),
  );
  return matched || "";
}

function renderAuthorPicker(selected = "", { id = "" } = {}) {
  const selectedName = resolveKnownAuthor(selected);
  const listId = id
    ? `author-list-${id}`
    : `author-list-${Math.random().toString(36).slice(2, 9)}`;
  const inputId = id ? `author-input-${id}` : "";
  const hasValue = Boolean(selectedName);

  return `
    <div class="combobox" data-author-picker>
      <label class="field" ${inputId ? `for="${escapeHtml(inputId)}"` : ""}>
        <span class="field__label">${escapeHtml(COPY.yourName)}</span>
        <div class="combobox__control">
          <input
            type="text"
            class="combobox__input"
            ${inputId ? `id="${escapeHtml(inputId)}"` : ""}
            role="combobox"
            aria-expanded="false"
            aria-controls="${escapeHtml(listId)}"
            aria-autocomplete="list"
            aria-haspopup="listbox"
            data-author-input
            value="${escapeHtml(selectedName)}"
            maxlength="80"
            autocomplete="off"
            spellcheck="false"
            placeholder="${escapeHtml(COPY.namePlaceholder)}"
          >
          <button
            type="button"
            class="combobox__clear"
            data-author-clear
            aria-label="${escapeHtml(COPY.nameClear)}"
            ${hasValue ? "" : "hidden"}
          >
            <span aria-hidden="true">×</span>
          </button>
          <ul
            class="combobox__list"
            id="${escapeHtml(listId)}"
            role="listbox"
            data-author-list
            hidden
          ></ul>
        </div>
      </label>
      <input type="hidden" name="author" data-author-value value="${escapeHtml(selectedName)}">
    </div>`;
}

function syncAuthorClearButton(picker) {
  const input = picker?.querySelector("[data-author-input]");
  const clear = picker?.querySelector("[data-author-clear]");
  if (!input || !clear) {
    return;
  }
  clear.hidden = !String(input.value || "").trim();
}

function syncAuthorPicker(picker) {
  if (!picker) {
    return "";
  }
  const input = picker.querySelector("[data-author-input]");
  const hidden = picker.querySelector("[data-author-value]");
  const name = resolveKnownAuthor(input?.value || hidden?.value || "");
  if (hidden) {
    hidden.value = name;
  }
  if (input) {
    input.value = name;
  }
  syncAuthorClearButton(picker);
  return name;
}

function closeAuthorCombobox(picker) {
  const input = picker?.querySelector("[data-author-input]");
  const list = picker?.querySelector("[data-author-list]");
  const hidden = picker?.querySelector("[data-author-value]");
  if (!input || !list) {
    return;
  }
  const name = resolveKnownAuthor(input.value || hidden?.value || "");
  input.value = name;
  if (hidden) {
    hidden.value = name;
  }
  list.hidden = true;
  list.innerHTML = "";
  input.setAttribute("aria-expanded", "false");
  input.removeAttribute("aria-activedescendant");
  picker._authorActiveIndex = -1;
  picker._authorOptions = [];
  picker._authorFiltering = false;
  syncAuthorClearButton(picker);
}

function bindAuthorPickers(root = main) {
  root.querySelectorAll("[data-author-picker]").forEach((picker) => {
    const input = picker.querySelector("[data-author-input]");
    const list = picker.querySelector("[data-author-list]");
    const hidden = picker.querySelector("[data-author-value]");
    const clear = picker.querySelector("[data-author-clear]");
    if (!input || !list || !hidden) {
      return;
    }

    picker._authorActiveIndex = -1;
    picker._authorOptions = [];
    picker._authorFiltering = false;

    const setActive = (index) => {
      picker._authorActiveIndex = index;
      [...list.querySelectorAll('[role="option"]')].forEach((option, i) => {
        const active = i === picker._authorActiveIndex;
        option.classList.toggle("is-active", active);
        option.setAttribute("aria-selected", active ? "true" : "false");
        if (active) {
          input.setAttribute("aria-activedescendant", option.id);
          option.scrollIntoView({ block: "nearest" });
        }
      });
      if (picker._authorActiveIndex < 0) {
        input.removeAttribute("aria-activedescendant");
      }
    };

    const choose = (value) => {
      const name = resolveKnownAuthor(value);
      input.value = name;
      hidden.value = name;
      picker._authorFiltering = false;
      closeAuthorCombobox(picker);
    };

    const renderOptions = () => {
      const query = String(input.value || "").trim();
      const groups = collectAuthorsByTeam();
      const known = collectKnownAuthors();
      const filtering = Boolean(picker._authorFiltering);
      const items = [];
      const parts = [];

      for (const group of groups) {
        const names =
          filtering && query
            ? group.names.filter((name) =>
                name.toLowerCase().includes(query.toLowerCase()),
              )
            : group.names;
        if (!names.length) {
          continue;
        }
        parts.push(
          `<li class="combobox__group" role="presentation">${escapeHtml(group.label)}</li>`,
        );
        for (const name of names) {
          const optionIndex = items.length;
          const optionId = `${list.id}-opt-${optionIndex}`;
          items.push({ value: name, label: name });
          parts.push(`<li
              id="${escapeHtml(optionId)}"
              class="combobox__option"
              role="option"
              data-value="${escapeHtml(name)}"
              aria-selected="false"
            >${escapeHtml(name)}</li>`);
        }
      }

      picker._authorOptions = items;
      if (!items.length) {
        const emptyCopy = known.length
          ? COPY.namePlaceholder
          : COPY.nameEmptyList;
        list.innerHTML = `<li class="combobox__empty" role="presentation">${escapeHtml(emptyCopy)}</li>`;
      } else {
        list.innerHTML = parts.join("");
      }

      list.hidden = false;
      input.setAttribute("aria-expanded", "true");
      const currentIndex = query
        ? items.findIndex((item) => authorsMatch(item.value, query))
        : -1;
      setActive(currentIndex >= 0 ? currentIndex : items.length ? 0 : -1);
    };

    input.addEventListener("focus", () => {
      picker._authorFiltering = false;
      renderOptions();
    });

    input.addEventListener("input", () => {
      hidden.value = String(input.value || "").trim();
      picker._authorFiltering = true;
      syncAuthorClearButton(picker);
      renderOptions();
    });

    input.addEventListener("keydown", (event) => {
      const options = picker._authorOptions || [];
      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (list.hidden) {
          picker._authorFiltering = false;
          renderOptions();
          return;
        }
        if (!options.length) {
          return;
        }
        setActive((picker._authorActiveIndex + 1) % options.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (list.hidden) {
          picker._authorFiltering = false;
          renderOptions();
          return;
        }
        if (!options.length) {
          return;
        }
        setActive(
          (picker._authorActiveIndex - 1 + options.length) % options.length,
        );
        return;
      }
      if (event.key === "Enter") {
        if (
          !list.hidden &&
          picker._authorActiveIndex >= 0 &&
          options[picker._authorActiveIndex]
        ) {
          event.preventDefault();
          choose(options[picker._authorActiveIndex].value);
        }
        return;
      }
      if (event.key === "Escape") {
        if (!list.hidden) {
          event.preventDefault();
          closeAuthorCombobox(picker);
        }
        return;
      }
      if (event.key === "Tab") {
        closeAuthorCombobox(picker);
      }
    });

    list.addEventListener("mousedown", (event) => {
      const option = event.target.closest("[data-value]");
      if (!option) {
        return;
      }
      event.preventDefault();
      choose(option.dataset.value);
    });

    if (clear) {
      clear.addEventListener("mousedown", (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      clear.addEventListener("click", (event) => {
        event.preventDefault();
        input.value = "";
        hidden.value = "";
        picker._authorFiltering = false;
        syncAuthorClearButton(picker);
        input.focus();
        renderOptions();
      });
    }

    syncAuthorClearButton(picker);
  });

  if (!document.documentElement.dataset.authorComboboxBound) {
    document.addEventListener("click", (event) => {
      document.querySelectorAll("[data-author-picker]").forEach((picker) => {
        if (!picker.contains(event.target)) {
          closeAuthorCombobox(picker);
        }
      });
    });
    document.documentElement.dataset.authorComboboxBound = "1";
  }
}

function buildReplyEditForm(message) {
  return `
    <form class="thread-msg__edit-form" data-edit-form="${escapeHtml(message.id)}">
      <label class="field">
        <span class="visually-hidden">${escapeHtml(COPY.yourReply)}</span>
        <textarea name="text" rows="2" maxlength="2000" required>${escapeHtml(message.text)}</textarea>
      </label>
      <input type="hidden" name="author" value="${escapeHtml(message.author)}">
      <div class="thread-msg__edit-actions">
        <button type="submit" class="button">${escapeHtml(COPY.saveEdit)}</button>
        <button type="button" class="button button--ghost" data-cancel-edit>${escapeHtml(COPY.cancelEdit)}</button>
      </div>
      <p class="save-status" role="status"></p>
    </form>`;
}

function renderThreadMessages(task) {
  const row = commentRecord(task.key);
  const messages = row?.messages || [];

  if (!messages.length) {
    return "";
  }

  return `
    <div class="thread__list">
      ${messages
        .map((message, index) => {
          const editable = canEditMessage(message, messages);
          const when = message.updatedAt || message.createdAt;
          return `
            <article class="thread-msg" data-message-id="${escapeHtml(message.id)}" data-opening="${index === 0 && messages.length === 1 ? "true" : "false"}">
              <header class="thread-msg__head">
                <span class="thread-msg__author">${escapeHtml(message.author)}</span>
                <time class="thread-msg__time" datetime="${escapeHtml(when || "")}">${escapeHtml(when ? new Date(when).toLocaleString() : "")}</time>
                ${
                  editable
                    ? `<button type="button" class="thread-msg__edit" data-edit-message="${escapeHtml(message.id)}">${escapeHtml(COPY.editMessage)}</button>`
                    : ""
                }
              </header>
              <div class="thread-msg__body" data-message-body>${escapeHtml(message.text)}</div>
              <div data-edit-slot></div>
            </article>`;
        })
        .join("")}
    </div>`;
}

function renderCommentForm(task) {
  const saved = commentRecord(task.key);
  const messages = saved?.messages || [];
  const isFirst = messages.length === 0;

  return `
    <section class="feedback-panel" id="feedback">
      <h2>${escapeHtml(COPY.yourFeedback)}</h2>
      ${renderThreadMessages(task)}
      <form class="feedback-form" data-comment-form="${escapeHtml(task.key)}" data-feedback-mode="${isFirst ? "first" : "reply"}">
        <div class="feedback-composer">
          ${renderAuthorPicker(getAuthor("comment"), { id: `task-${task.key}` })}
          <label class="field">
            <span class="visually-hidden">${escapeHtml(COPY.yourReply)}</span>
            <textarea name="text" rows="2" maxlength="2000" required placeholder="${escapeHtml(isFirst ? COPY.firstNotePlaceholder : COPY.replyPlaceholder)}"></textarea>
          </label>
          <div class="feedback-form__actions">
            <button type="submit" class="button">${escapeHtml(isFirst ? COPY.saveFeedback : COPY.sendReply)}</button>
            ${saved ? `<p class="save-status is-visible">${escapeHtml(COPY.lastSaved)} ${escapeHtml(new Date(saved.updatedAt).toLocaleString())}</p>` : '<p class="save-status" role="status"></p>'}
          </div>
        </div>
      </form>
    </section>`;
}

const TASK_NAV_PREV_ICON = `<svg class="issue-nav__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;

const TASK_NAV_NEXT_ICON = `<svg class="issue-nav__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;

const ACCORDION_OPEN_ALL_ICON = `<svg class="phases-accordion__control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>`;

const ACCORDION_CLOSE_ALL_ICON = `<svg class="phases-accordion__control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 11 5-5 5 5"/><path d="m7 18 5-5 5 5"/></svg>`;

const TRASH_ICON = `<svg class="media-block__remove-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>`;

function renderAccordionControls({ openAttr, closeAttr }) {
  return `
          <div class="phases-accordion__controls">
            <button type="button" class="phases-accordion__control" ${openAttr} aria-label="${escapeHtml(COPY.openAllPhases)}" title="${escapeHtml(COPY.openAllPhases)}">${ACCORDION_OPEN_ALL_ICON}</button>
            <button type="button" class="phases-accordion__control" ${closeAttr} aria-label="${escapeHtml(COPY.closeAllPhases)}" title="${escapeHtml(COPY.closeAllPhases)}">${ACCORDION_CLOSE_ALL_ICON}</button>
          </div>`;
}

function evidenceGalleryAttr(files) {
  if (!files || files.length <= 1) {
    return "";
  }
  return ` data-evidence-gallery="${escapeHtml(files.join(","))}"`;
}

function taskEvidenceFiles(task) {
  return (task.evidence || [])
    .map((item) => item.file)
    .filter((file) => evidenceByFile(file));
}

function normalizeEvidenceUrl(url) {
  return String(url || "").trim();
}

function isValidHttpUrl(value) {
  const raw = normalizeEvidenceUrl(value);
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

function evidencePageUrl(row) {
  const url = normalizeEvidenceUrl(row?.url);
  return url || null;
}

function evidenceGroupKey(row) {
  const url = evidencePageUrl(row);
  if (!url) {
    return "";
  }
  return url.replace(/\/+$/, "") || url;
}

function groupEvidenceByUrl(items) {
  const groups = new Map();

  for (const row of items) {
    const key = evidenceGroupKey(row);
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        label: key ? normalizeEvidenceUrl(row.url) : COPY.evidenceNoUrl,
        href: key || null,
        items: [],
      });
    }
    groups.get(key).items.push(row);
  }

  return [...groups.values()].sort((a, b) => {
    if (!a.key) {
      return 1;
    }
    if (!b.key) {
      return -1;
    }
    return a.label.localeCompare(b.label, undefined, { sensitivity: "base" });
  });
}

function renderEvidencePageLink(row, className = "") {
  const url = evidencePageUrl(row);
  if (!url) {
    return "";
  }
  const extraClass = className ? ` ${escapeHtml(className)}` : "";
  if (!isValidHttpUrl(url)) {
    return `<span class="evidence-url-text${extraClass}">${escapeHtml(url)}</span>`;
  }
  return `<a class="evidence-page-link${extraClass}" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(url)}</a>`;
}

function isVideoEvidence(row) {
  if (!row) {
    return false;
  }
  return (
    row.type === "video" ||
    String(row.file || "")
      .toLowerCase()
      .endsWith(".mp4")
  );
}

function evidenceThumbCaption(row) {
  return evidencePageUrl(row) || row.page || "";
}

function renderVideoPreviewMarkup(file, alt = "") {
  const src = `${mediaUrl(file)}#t=0.1`;
  return `<video preload="metadata" muted playsinline src="${escapeHtml(src)}" aria-label="${escapeHtml(alt)}"></video>`;
}

function renderEvidenceThumb(file, galleryFiles = null, options = {}) {
  const row = evidenceByFile(file);
  if (!row) {
    return "";
  }
  const captionMode = options.captionMode || "url";
  const galleryAttr = evidenceGalleryAttr(galleryFiles);
  const label = row.page || file;
  const caption =
    captionMode === "page" ? row.page || "" : evidenceThumbCaption(row);
  const openAttr =
    options.openAttr || `data-open-evidence="${escapeHtml(file)}"`;
  if (isVideoEvidence(row)) {
    return `
      <button type="button" class="evidence-thumb evidence-thumb--video" ${openAttr}${galleryAttr} title="${escapeHtml(label)}">
        ${renderVideoPreviewMarkup(file, label)}
        <span class="evidence-thumb__play" aria-hidden="true">▶</span>
        ${caption ? `<span class="evidence-thumb__label">${escapeHtml(caption)}</span>` : ""}
      </button>`;
  }
  return `
    <button type="button" class="evidence-thumb" ${openAttr}${galleryAttr} title="${escapeHtml(label)}">
      <img src="${escapeHtml(mediaUrl(file))}" alt="${escapeHtml(label)}" loading="lazy">
      ${caption ? `<span class="evidence-thumb__label">${escapeHtml(caption)}</span>` : ""}
    </button>`;
}

function renderTaskChips(keys) {
  return keys
    .map((key) => {
      const task = taskByKey(key);
      if (!task) {
        return "";
      }
      const phaseId = task.sprint ?? String(task.id).split(".")[0];
      return `<a class="chip chip--issue chip--phase" style="${phaseStyleAttr(phaseId)}" href="#/task/${escapeHtml(task.key)}">${escapeHtml(task.id)}</a>`;
    })
    .join("");
}

function renderSummaryItemLabel(keys, title, fallback = "") {
  const chips = keys.length
    ? `<span class="summary-item__chips">${renderTaskChips(keys)}</span>`
    : "";
  const text = escapeHtml(title || fallback);
  return `<div class="summary-item__label">${chips}<span class="summary-item__title">${text}</span></div>`;
}

function renderTagChips(tags = [], { editable = false, taskKey = "" } = {}) {
  return (tags || [])
    .map((tag) => normalizeTagLabel(tag))
    .filter(Boolean)
    .map((tag) => {
      const href = `#/tasks/tag/${encodeURIComponent(tag)}`;
      const label = escapeHtml(tag);
      if (!editable) {
        return `<a class="chip chip--tag" href="${href}">${label}</a>`;
      }
      return `<span class="chip chip--tag chip--tag-edit">
        <a class="chip__label" href="${href}">${label}</a>
        <button
          type="button"
          class="chip__remove"
          data-tag-remove
          data-tag="${escapeHtml(tag)}"
          data-task-key="${escapeHtml(taskKey)}"
          aria-label="${escapeHtml(COPY.removeTag(tag))}"
        ><span aria-hidden="true">×</span></button>
      </span>`;
    })
    .join("");
}

function renderPriorityControl(task, { editable = false } = {}) {
  const priority = String(task.priority || "");
  if (!editable) {
    return `<a class="pill pill--${escapeHtml(priority)}" href="#/tasks/priority/${escapeHtml(priority)}">${escapeHtml(priorityLabel(priority))}</a>`;
  }

  const options = PRIORITY_OPTIONS.map((value) => {
    const selected = value === priority ? " selected" : "";
    return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(priorityLabel(value))}</option>`;
  }).join("");

  return `
    <label class="pill-control pill pill--${escapeHtml(priority)}">
      <span class="visually-hidden">Priority</span>
      <select
        class="pill-control__select"
        data-task-priority="${escapeHtml(task.key)}"
        aria-label="Priority"
      >${options}</select>
    </label>`;
}

function renderStatusControl(task, { editable = false } = {}) {
  const status = String(task.status || "");
  if (!editable) {
    return `<a class="pill pill--status pill--${escapeHtml(status)}" href="#/tasks/status/${escapeHtml(status)}">${escapeHtml(statusLabel(status))}</a>`;
  }

  const options = STATUS_OPTIONS.map((value) => {
    const selected = value === status ? " selected" : "";
    return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(statusLabel(value))}</option>`;
  }).join("");

  return `
    <label class="pill-control pill pill--status pill--${escapeHtml(status)}">
      <span class="visually-hidden">Status</span>
      <select
        class="pill-control__select"
        data-task-status="${escapeHtml(task.key)}"
        aria-label="Status"
      >${options}</select>
    </label>`;
}

function renderPhaseControl(task, { editable = false } = {}) {
  const sprintId = task.sprint;
  if (!editable) {
    return renderPhasePill(sprintId);
  }

  const sprints = state.audit?.sprints || [];
  const options = sprints
    .map((sprint) => {
      const value = String(sprint.id);
      const selected = String(sprintId) === value ? " selected" : "";
      const label = phasePillLabel(sprint.id);
      return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(label)}</option>`;
    })
    .join("");

  return `
    <label class="pill-control pill pill--phase" style="${phaseStyleAttr(sprintId)}">
      <span class="visually-hidden">${escapeHtml(COPY.phase)}</span>
      <select
        class="pill-control__select"
        data-task-phase="${escapeHtml(task.key)}"
        aria-label="${escapeHtml(COPY.phase)}"
      >${options}</select>
    </label>`;
}

function renderMetaRow(
  task,
  {
    editablePriority = false,
    editableStatus = false,
    editablePhase = false,
  } = {},
) {
  return `
    <div class="meta-row">
      ${renderPhaseControl(task, { editable: editablePhase })}
      ${renderPriorityControl(task, { editable: editablePriority })}
      ${renderStatusControl(task, { editable: editableStatus })}
      ${renderTaskEstimateMeta(task)}
    </div>`;
}

function renderTaskEstimateMetaSegment(prefix, hours) {
  const formattedHours = formatHours(hours);
  if (formattedHours === null) {
    return "";
  }
  let text = `${prefix} ${escapeHtml(formattedHours)}h`;
  if (state.hourlyRate !== null) {
    const formattedCost = formatUsd(hoursToCost(hours, state.hourlyRate));
    if (formattedCost !== null) {
      text += ` · ${escapeHtml(formattedCost)}`;
    }
  }
  return `<span class="issue-estimate-meta__chip">${text}</span>`;
}

function renderTaskEstimateMeta(task) {
  const estimateHours = taskEstimateHours(task);
  const actualHours = taskActualHours(task);
  if (estimateHours === null && actualHours === null) {
    return "";
  }
  const segments = [
    estimateHours !== null
      ? renderTaskEstimateMetaSegment("Est", estimateHours)
      : "",
    actualHours !== null
      ? renderTaskEstimateMetaSegment("Actual", actualHours)
      : "",
  ].filter(Boolean);
  return `<div class="issue-estimate-meta">${segments.join("")}</div>`;
}

function renderTaskTags(task, { editable = false } = {}) {
  const tagsHtml = renderTagChips(task.tags, {
    editable,
    taskKey: task.key,
  });
  if (!editable && !tagsHtml) {
    return "";
  }

  const addControl = editable
    ? `<div class="issue-tags__add" data-tag-add-wrap="${escapeHtml(task.key)}">
        <button
          type="button"
          class="chip chip--tag-add"
          data-tag-add-open
          data-task-key="${escapeHtml(task.key)}"
          aria-label="${escapeHtml(COPY.addTag)}"
        ><span aria-hidden="true">+</span></button>
      </div>`
    : "";

  return `<div
    class="chip-row issue-tags${editable ? " issue-tags--editable" : ""}"
    data-task-tags="${escapeHtml(task.key)}"
  >${tagsHtml}${addControl}</div>`;
}

function renderTaskCard(task) {
  const evidenceItems = task.evidence?.length
    ? task.evidence
    : state.evidence
        .filter((row) => row.tasks?.includes(task.key))
        .map((row) => ({ file: row.file }));
  const galleryFiles = evidenceItems
    .map((item) => item.file)
    .filter((file) => evidenceByFile(file));

  const taskHref = `#/task/${escapeHtml(task.key)}`;
  const phaseStyle = phaseStyleAttr(task.sprint);

  return `
    <article class="issue-card"${state.editMode ? ` data-author-task-drag="${escapeHtml(task.key)}"` : ""}>
      <div class="issue-card__content">
        <a class="issue-card__link" href="${taskHref}">
          <div class="issue-card__head">
            <span class="issue-card__id pill pill--phase" style="${phaseStyle}">${escapeHtml(task.id)}</span>
            <h2 class="issue-card__title">${escapeHtml(task.title)}</h2>
          </div>
        </a>
        ${renderMetaRow(task)}
        <a class="issue-card__link issue-card__link--summary" href="${taskHref}">
          <p class="issue-card__summary">${escapeHtml(task.problem?.trim().split("\n")[0] || "")}</p>
        </a>
        ${renderTaskTags(task)}
      </div>
      ${evidenceItems.length ? `<div class="issue-card__evidence">${evidenceItems.map((e) => renderEvidenceThumb(e.file, galleryFiles)).join("")}</div>` : ""}
    </article>`;
}

function parseOpenPhases(searchParams) {
  const raw = String(searchParams?.get("phases") || "").trim();
  if (!raw) {
    return [];
  }
  return [
    ...new Set(
      raw
        .split(",")
        .map((part) => part.trim())
        .filter(Boolean),
    ),
  ];
}

function overviewHref(openPhaseIds = []) {
  const ids = [...new Set(openPhaseIds.map(String))].filter(Boolean);
  if (!ids.length) {
    return "#/";
  }
  return `#/?phases=${encodeURIComponent(ids.join(","))}`;
}

function readOpenPhasesFromDom() {
  return [...main.querySelectorAll("details[data-phase-id][open]")]
    .map((item) => item.dataset.phaseId)
    .filter(Boolean);
}

function syncOverviewPhaseUrl() {
  if (state.route.name !== "overview") {
    return;
  }
  const target = overviewHref(readOpenPhasesFromDom());
  if (window.location.hash === target) {
    return;
  }
  history.replaceState(null, "", target);
  state.route = parseRoute();
}

function scrollToOpenPhase() {
  const ids = parseOpenPhases(state.route.searchParams);
  if (!ids.length) {
    return;
  }
  requestAnimationFrame(() => {
    const target = main.querySelector(`details[data-phase-id="${ids[0]}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });
}

function normalizeLegacyRoute(route) {
  const rawHash = window.location.hash.replace(/^#/, "") || "/";
  const queryIndex = rawHash.indexOf("?");
  const path = queryIndex >= 0 ? rawHash.slice(0, queryIndex) : rawHash;
  const query = queryIndex >= 0 ? rawHash.slice(queryIndex) : "";

  if (path.startsWith("/issue/") || path.startsWith("/issues/")) {
    const redirected = `#${path.replace(/^\/issues\//, "/tasks/").replace(/^\/issue\//, "/task/")}${query}`;
    history.replaceState(null, "", redirected);
    return parseRoute();
  }

  if (route.name === "sprints") {
    history.replaceState(null, "", "#/");
    return parseRoute();
  }
  if (route.name === "sprint") {
    const phaseId = route.params.sprintId;
    history.replaceState(null, "", overviewHref([phaseId]));
    return parseRoute();
  }
  return route;
}

function overviewStats() {
  return {
    screenshots: state.evidence.filter(
      (row) => row.type !== "video" && !String(row.file || "").endsWith(".mp4"),
    ).length,
    recordings: state.evidence.filter(
      (row) => row.type === "video" || String(row.file || "").endsWith(".mp4"),
    ).length,
    tasks: state.tasks.length,
    decisions: state.decisions.length,
  };
}

function renderPhasesAccordion(openPhaseIds) {
  const openSet = new Set(openPhaseIds.map(String));
  const reorderMode = Boolean(state.phaseReorderMode);
  const editMode = Boolean(state.editMode);
  const canReorder = (state.audit.sprints || []).length >= 2;
  const groups = state.audit.sprints
    .map((sprint) => {
      const tasks = sprintTasks(sprint.id);
      const isOpen = !reorderMode && openSet.has(String(sprint.id));
      const dragHandle = reorderMode
        ? `<button type="button" class="phases-accordion__drag" data-drag-handle draggable="true" aria-label="Drag to reorder">⠿</button>`
        : "";
      const phaseTitle = editMode
        ? `<input class="author-field author-field--inline" type="text" data-author-phase="${escapeHtml(String(sprint.id))}" data-author-field="title" value="${escapeHtml(sprint.title)}" aria-label="Phase title">`
        : `<span class="phases-accordion__title-text">${escapeHtml(sprint.title)}</span>`;
      const phaseSubtitle = editMode
        ? `<input class="author-field author-field--inline" type="text" data-author-phase="${escapeHtml(String(sprint.id))}" data-author-field="subtitle" value="${escapeHtml(sprint.subtitle || "")}" aria-label="Phase subtitle" placeholder="Subtitle">`
        : `<span class="phases-accordion__subtitle">${escapeHtml(sprint.subtitle)}</span>`;
      const phaseDesc = editMode
        ? `<textarea class="author-field" rows="2" data-author-phase="${escapeHtml(String(sprint.id))}" data-author-field="description" aria-label="Phase description">${escapeHtml(sprint.description.trim())}</textarea>`
        : `<p class="phases-accordion__desc">${escapeHtml(sprint.description.trim())}</p>`;
      const phaseActions = editMode
        ? `<div class="author-actions">
            <button type="button" class="button button--ghost button--small" data-author-add-task="${escapeHtml(String(sprint.id))}">${escapeHtml(COPY.addTask)}</button>
            <button type="button" class="button button--ghost button--small" data-author-delete-phase="${escapeHtml(String(sprint.id))}">${escapeHtml(COPY.deletePhase)}</button>
          </div>`
        : "";
      const taskCards = tasks.map(renderTaskCard).join("");
      return `
        <details class="phases-accordion__item" data-phase-id="${escapeHtml(String(sprint.id))}" style="${phaseStyleAttr(sprint.id)}"${isOpen ? " open" : ""}>
          <summary class="phases-accordion__summary">
            ${dragHandle}
            <span class="phases-accordion__heading">
              <span class="phases-accordion__title">${renderPhasePill(sprint.id, { linked: false })}${phaseTitle}</span>
              ${phaseSubtitle}
              ${phaseDesc}
            </span>
            <span class="phases-accordion__meta">${tasks.length} ${COPY.suggestions}</span>
            <span class="phases-accordion__chevron" aria-hidden="true">›</span>
          </summary>
          <div class="phases-accordion__panel">
            ${phaseActions}
            <div class="issue-list"${editMode ? ` data-author-task-list="${escapeHtml(String(sprint.id))}"` : ""}>${taskCards}</div>
          </div>
        </details>`;
    })
    .join("");

  const accordionControls = reorderMode
    ? `<div class="phases-accordion__controls"><button type="button" class="phases-accordion__reorder" data-phases-reorder>${escapeHtml(COPY.doneReorderingPhases)}</button></div>`
    : `<div class="phases-accordion__controls">${
        editMode
          ? `<button type="button" class="button button--ghost button--small" data-author-add-phase>${escapeHtml(COPY.addPhase)}</button>`
          : ""
      }${
        editMode && canReorder
          ? `<button type="button" class="phases-accordion__reorder" data-phases-reorder>${escapeHtml(COPY.reorderPhases)}</button>`
          : ""
      }${
        !editMode
          ? `<button type="button" class="phases-accordion__control" data-phases-open-all aria-label="${escapeHtml(COPY.openAllPhases)}" title="${escapeHtml(COPY.openAllPhases)}">${ACCORDION_OPEN_ALL_ICON}</button><button type="button" class="phases-accordion__control" data-phases-close-all aria-label="${escapeHtml(COPY.closeAllPhases)}" title="${escapeHtml(COPY.closeAllPhases)}">${ACCORDION_CLOSE_ALL_ICON}</button>`
          : ""
      }</div>`;

  return `
      <section class="section">
        <div class="section__head">
          <h2>${escapeHtml(COPY.phases)}</h2>
          ${accordionControls}
        </div>
        <div class="phases-accordion"${reorderMode ? " data-phase-reorder" : ""}>${groups}</div>
      </section>`;
}

function renderOverview() {
  const openPhases = parseOpenPhases(state.route.searchParams);
  const stats = overviewStats();
  const summaryHtml = state.editMode && isAdmin()
    ? `<textarea class="author-field author-field--summary" rows="4" data-author-summary aria-label="Overview intro">${escapeHtml(state.audit.summary.trim())}</textarea>`
    : `<p class="lede">${escapeHtml(state.audit.summary.trim())}</p>`;
  const addQuestionBtn = state.editMode
    ? `<button type="button" class="button button--ghost" data-author-add-decision>${escapeHtml(COPY.addQuestion)}</button>`
    : "";

  return `
    <div class="page page--overview">
      <header class="page-header page-header--split">
        <div class="page-header__intro">
          <h1>${escapeHtml(clientName())}</h1>
          ${summaryHtml}
          ${addQuestionBtn ? `<div class="author-actions">${addQuestionBtn}</div>` : ""}
        </div>
        <ul class="stat-list page-header__stats">
          <li><strong>${stats.screenshots}</strong> media images</li>
          <li><strong>${stats.recordings}</strong> recordings</li>
          <li><strong>${stats.tasks}</strong> tasks</li>
          <li><strong>${stats.decisions}</strong> questions</li>
        </ul>
      </header>
      ${renderPhasesAccordion(openPhases)}
    </div>`;
}

function renderFilteredTasks(kind, value) {
  let tasks = [];
  let title = "";
  if (kind === "priority") {
    tasks = tasksByPriority(value);
    title = COPY.priorityFilterTitle(priorityLabel(value));
  } else if (kind === "status") {
    tasks = tasksByStatus(value);
    title = COPY.statusFilterTitle(statusLabel(value));
  } else if (kind === "tag") {
    tasks = tasksByTag(value);
    title = COPY.tagFilterTitle(value);
  } else {
    title = COPY.filterNotFound;
  }

  return `
    <div class="page">
      <header class="page-header">
        <p class="breadcrumb"><a href="#/">${escapeHtml(COPY.overview)}</a></p>
        <h1>${escapeHtml(title)}</h1>
        <p class="lede">${tasks.length} ${COPY.suggestions}</p>
      </header>
      <div class="issue-list">${tasks.map(renderTaskCard).join("") || `<p>${escapeHtml(COPY.filterNotFound)}</p>`}</div>
    </div>`;
}

function renderTaskDetail(taskKey) {
  const task = taskByKey(taskKey);
  if (!task) {
    return `<div class="page"><p>${escapeHtml(COPY.taskNotFound)}</p></div>`;
  }

  const galleryFiles = taskEvidenceFiles(task);
  const galleryAttr = evidenceGalleryAttr(galleryFiles);
  const authorBlocked = taskAuthoringBlocked(state, taskKey);
  const editMode = Boolean(state.editMode) && !authorBlocked;

  const evidenceHtml = (task.evidence || [])
    .map((item) => {
      const row = evidenceByFile(item.file);
      const alt = task.title || item.file;
      const taskKeys = row?.tasks?.length
        ? row.tasks
        : tasksForEvidence(item.file).map((linked) => linked.key);
      const chipsHtml = taskKeys.length
        ? `<div class="chip-row media-block__chips">${renderTaskChips(taskKeys)}</div>`
        : "";
      const pageLink = renderEvidencePageLink(row, "media-block__page-link");
      const footerParts = [pageLink, chipsHtml].filter(Boolean).join("");
      const footerHtml = footerParts
        ? `<figcaption>${footerParts}</figcaption>`
        : "";
      const removeBtn = editMode
        ? `<button type="button" class="media-block__remove" data-author-remove-task-media="${escapeHtml(item.file)}" data-task-key="${escapeHtml(task.key)}" aria-label="${escapeHtml(COPY.removeMedia)}" title="${escapeHtml(COPY.removeMedia)}">${TRASH_ICON}</button>`
        : "";
      if (isVideoEvidence(row)) {
        return `
          <figure class="media-block">
            <div class="media-block__frame">
              <button type="button" class="media-block__image media-block__image--video" data-open-evidence="${escapeHtml(item.file)}"${galleryAttr}>
                ${renderVideoPreviewMarkup(item.file, alt)}
                <span class="media-block__play" aria-hidden="true">▶</span>
              </button>
              ${removeBtn}
            </div>
            ${footerHtml}
          </figure>`;
      }
      return `
        <figure class="media-block">
          <div class="media-block__frame">
            <button type="button" class="media-block__image" data-open-evidence="${escapeHtml(item.file)}"${galleryAttr}>
              <img src="${escapeHtml(mediaUrl(item.file))}" alt="${escapeHtml(alt)}" loading="lazy">
            </button>
            ${removeBtn}
          </div>
          ${footerHtml}
        </figure>`;
    })
    .join("");

  const linkedDecisionsHtml = decisionsForTask(taskKey)
    .map((decision) => renderDecisionCard(decision))
    .join("");

  const titleHtml = editMode
    ? `<input class="author-field author-field--title" type="text" data-author-task-field="title" data-task-key="${escapeHtml(task.key)}" value="${escapeHtml(task.title)}" aria-label="Task title">`
    : `<h1>${escapeHtml(task.title)}</h1>`;

  const problemHtml = editMode
    ? `<textarea class="author-field" rows="6" data-author-task-field="problem" data-task-key="${escapeHtml(task.key)}" aria-label="${escapeHtml(COPY.whatWeFound)}">${escapeHtml(task.problem?.trim() || "")}</textarea>`
    : `<p>${escapeHtml(task.problem?.trim() || "")}</p>`;

  const recommendationHtml = editMode
    ? `<textarea class="author-field" rows="6" data-author-task-field="recommendation" data-task-key="${escapeHtml(task.key)}" aria-label="${escapeHtml(COPY.whatWeSuggest)}">${escapeHtml(task.recommendation?.trim() || "")}</textarea>`
    : `<p>${escapeHtml(task.recommendation?.trim() || "")}</p>`;

  const hoursHtml =
    editMode && isAdmin()
      ? `<div class="author-hours">
          <label class="field">
            <span class="field__label">${escapeHtml(COPY.editHours)}</span>
            <input class="author-field" type="number" min="0" step="0.25" data-author-task-hours="hours" data-task-key="${escapeHtml(task.key)}" value="${task.hours == null ? "" : escapeHtml(String(task.hours))}">
          </label>
          <label class="field">
            <span class="field__label">${escapeHtml(COPY.editActualHours)}</span>
            <input class="author-field" type="number" min="0" step="0.25" data-author-task-hours="actual_hours" data-task-key="${escapeHtml(task.key)}" value="${task.actual_hours == null ? "" : escapeHtml(String(task.actual_hours))}">
          </label>
        </div>`
      : "";

  const authorTaskActions = editMode
    ? `<div class="author-actions">
        <button type="button" class="button button--ghost" data-author-add-task-media="${escapeHtml(task.key)}">${escapeHtml(COPY.addMedia)}</button>
        <button type="button" class="button button--ghost" data-author-add-decision="${escapeHtml(task.key)}">${escapeHtml(COPY.addQuestion)}</button>
        <button type="button" class="button button--ghost" data-author-delete-task="${escapeHtml(task.key)}">${escapeHtml(COPY.deleteTask)}</button>
      </div>`
    : "";

  return `
    <div class="page page--split">
      <div class="page__primary">
        <header class="page-header">
          <div class="page-header__top">
            <p class="breadcrumb">${renderPhasePill(task.sprint)} <span class="breadcrumb__sep" aria-hidden="true">/</span> <span class="pill pill--phase" style="${phaseStyleAttr(task.sprint)}">${escapeHtml(task.id)}</span></p>
            ${renderTaskNav(taskKey)}
          </div>
          ${renderTaskLockBanner(state, taskKey, { escapeHtml })}
          <div class="page-header__row">
            ${titleHtml}
          </div>
          ${renderMetaRow(task, {
            editablePriority: true,
            editableStatus: true,
            editablePhase: true,
          })}
          ${hoursHtml}
          ${authorTaskActions}
        </header>
        <section class="prose">
          <h2>${escapeHtml(COPY.whatWeFound)}</h2>
          ${problemHtml}
          <h2>${escapeHtml(COPY.whatWeSuggest)}</h2>
          ${recommendationHtml}
          ${renderTaskTags(task, { editable: true })}
        </section>
        ${linkedDecisionsHtml ? `<section class="issue-decisions">${linkedDecisionsHtml}</section>` : ""}
        ${renderCommentForm(task)}
      </div>
      <aside class="page__aside">
        <h2>${escapeHtml(COPY.screenshotsHeading)}</h2>
        <div class="evidence-stack">${evidenceHtml || `<p>${escapeHtml(COPY.noScreenshotsLinked)}</p>`}</div>
      </aside>
    </div>`;
}

function renderGalleryCard(row, { galleryFiles = null } = {}) {
  const files = galleryFiles || [row.file];
  const chips = renderTaskChips(row.tasks || []);
  const editMode = Boolean(state.editMode);
  const thumb = editMode
    ? renderEvidenceThumb(row.file, files, {
        captionMode: "url",
        openAttr: `data-author-open-evidence="${escapeHtml(row.file)}"`,
      })
    : renderEvidenceThumb(row.file, files, { captionMode: "url" });

  return `
    <article class="gallery-card${editMode ? " gallery-card--editable" : ""}"${editMode ? ` data-author-edit-evidence="${escapeHtml(row.file)}"` : ""}>
      ${thumb}
      <div class="gallery-card__body">
        <div class="gallery-card__head">
          <h2>${escapeHtml(row.page || row.file)}</h2>
        </div>
        <div class="chip-row">${chips || `<span class="muted">${escapeHtml(COPY.noTasksLinked)}</span>`}</div>
      </div>
    </article>`;
}

function renderEvidenceGallery(filterFile = null) {
  if (filterFile) {
    const row = state.evidence.find((item) => item.file === filterFile);
    if (!row) {
      return `<div class="page"><p>${escapeHtml(COPY.filterNotFound)}</p></div>`;
    }

    return `
      <div class="page">
        <header class="page-header">
          <div class="page-header__row">
            <h1>${escapeHtml(COPY.screenshotsGallery)}</h1>
          </div>
          <p class="lede">${escapeHtml(COPY.screenshotsLead)}</p>
        </header>
        <div class="gallery-grid">${renderGalleryCard(row)}</div>
      </div>`;
  }

  const groups = groupEvidenceByUrl(state.evidence);
  const accordion = groups
    .map((group) => {
      const galleryFiles = group.items.map((item) => item.file);
      const title = `<span class="evidence-accordion__url">${escapeHtml(group.label)}</span>`;

      return `
        <details class="phases-accordion__item evidence-accordion__item" data-evidence-group="${escapeHtml(group.key || "none")}">
          <summary class="phases-accordion__summary">
            <span class="phases-accordion__heading">
              <span class="phases-accordion__title evidence-accordion__heading">${title}</span>
            </span>
            <span class="phases-accordion__meta">${escapeHtml(COPY.evidenceGroupCount(group.items.length))}</span>
            <span class="phases-accordion__chevron" aria-hidden="true">›</span>
          </summary>
          <div class="phases-accordion__panel">
            <div class="gallery-grid">${group.items.map((row) => renderGalleryCard(row, { galleryFiles })).join("")}</div>
          </div>
        </details>`;
    })
    .join("");

  return `
    <div class="page page--evidence">
      <header class="page-header">
        <div class="page-header__row">
          <h1>${escapeHtml(COPY.screenshotsGallery)}</h1>
          ${
            state.editMode
              ? `<button type="button" class="button button--ghost" data-author-add-evidence>${escapeHtml(COPY.addEvidenceRow)}</button>`
              : renderAccordionControls({
                  openAttr: "data-evidence-open-all",
                  closeAttr: "data-evidence-close-all",
                })
          }
        </div>
        <p class="lede">${escapeHtml(COPY.screenshotsLead)}</p>
      </header>
      <div class="phases-accordion evidence-accordion">${accordion}</div>
    </div>`;
}

function decisionEvidenceFiles(decision) {
  const seen = new Set();
  const files = [];
  for (const option of decision.options || []) {
    for (const item of option.evidence || []) {
      if (item?.file && !seen.has(item.file)) {
        seen.add(item.file);
        files.push(item.file);
      }
    }
  }
  return files;
}

function renderDecisionBlocksEditor(decision) {
  const key = decision.key;
  const linked = new Set((decision.blocks || []).map(String));
  const groups = (state.audit.sprints || [])
    .map((sprint) => {
      const tasks = sprintTasks(sprint.id);
      if (!tasks.length) {
        return "";
      }
      const rows = tasks
        .map(
          (task) => `
          <label class="author-decision-block">
            <input type="checkbox" data-author-decision-block value="${escapeHtml(task.key)}" data-decision-key="${escapeHtml(key)}"${linked.has(String(task.key)) ? " checked" : ""}>
            <span class="author-decision-block__id">${escapeHtml(task.id)}</span>
            <span class="author-decision-block__title">${escapeHtml(task.title)}</span>
          </label>`,
        )
        .join("");
      return `
        <div class="author-decision-group">
          <p class="author-decision-group__title">${escapeHtml(sprint.title || `Phase ${sprint.id}`)}</p>
          <div class="author-decision-group__list">${rows}</div>
        </div>`;
    })
    .join("");

  return groups || `<p class="muted">${escapeHtml(COPY.noTasksYet)}</p>`;
}

function renderDecisionOptionEditor(decision, option, optionIndex) {
  const key = decision.key;
  const evidenceRows = (option.evidence || [])
    .map((item, evidenceIndex) => {
      const thumb = item.file
        ? `<span class="author-option-media__thumb">${
            String(item.file).toLowerCase().endsWith(".mp4")
              ? `<video preload="metadata" muted playsinline src="${escapeHtml(mediaUrl(item.file))}#t=0.1"></video>`
              : `<img src="${escapeHtml(mediaUrl(item.file))}" alt="" loading="lazy">`
          }</span>`
        : "";
      return `
        <div class="author-option-media" data-option-evidence-index="${evidenceIndex}">
          ${thumb}
          <div class="author-option-media__fields">
            <label class="field">
              <span class="field__label">Caption</span>
              <input class="author-field" type="text" data-author-option-caption data-decision-key="${escapeHtml(key)}" data-option-index="${optionIndex}" data-evidence-index="${evidenceIndex}" value="${escapeHtml(item.caption || "")}">
            </label>
            <div class="author-actions">
              <button type="button" class="button button--ghost button--small" data-author-change-option-media data-decision-key="${escapeHtml(key)}" data-option-index="${optionIndex}" data-evidence-index="${evidenceIndex}">${escapeHtml(COPY.changeOptionMedia)}</button>
              <button type="button" class="button button--ghost button--small" data-author-remove-option-media data-decision-key="${escapeHtml(key)}" data-option-index="${optionIndex}" data-evidence-index="${evidenceIndex}">${escapeHtml(COPY.removeMedia)}</button>
            </div>
          </div>
        </div>`;
    })
    .join("");

  return `
    <article class="author-option-card" data-option-index="${optionIndex}">
      <div class="author-option-card__grid">
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.optionValue)}</span>
          <input class="author-field" type="text" data-author-option-field="value" data-decision-key="${escapeHtml(key)}" data-option-index="${optionIndex}" value="${escapeHtml(option.value || "")}">
        </label>
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.optionLabel)}</span>
          <input class="author-field" type="text" data-author-option-field="label" data-decision-key="${escapeHtml(key)}" data-option-index="${optionIndex}" value="${escapeHtml(option.label || "")}">
        </label>
      </div>
      <label class="field">
        <span class="field__label">${escapeHtml(COPY.optionDescription)}</span>
        <textarea class="author-field" rows="2" data-author-option-field="description" data-decision-key="${escapeHtml(key)}" data-option-index="${optionIndex}">${escapeHtml(option.description || "")}</textarea>
      </label>
      <div class="author-option-card__media-head">
        <h4>${escapeHtml(COPY.optionMedia)}</h4>
        <button type="button" class="button button--ghost button--small" data-author-add-option-media data-decision-key="${escapeHtml(key)}" data-option-index="${optionIndex}">${escapeHtml(COPY.addOptionMedia)}</button>
      </div>
      <div class="author-option-card__media-list">${evidenceRows || `<p class="muted">${escapeHtml(COPY.noOptionMedia)}</p>`}</div>
      <button type="button" class="button button--ghost button--small" data-author-remove-option="${optionIndex}" data-decision-key="${escapeHtml(key)}">${escapeHtml(COPY.removeOption)}</button>
    </article>`;
}

function renderDecisionAuthorCard(decision) {
  const key = decision.key;
  const options = (decision.options || [])
    .map((option, index) => renderDecisionOptionEditor(decision, option, index))
    .join("");

  return `
    <article class="issue-card decision-card decision-card--author" id="decision-${escapeHtml(key)}" data-author-decision="${escapeHtml(key)}">
      <div class="issue-card__content">
        <div class="author-actions">
          <button type="button" class="button button--ghost button--small" data-author-delete-decision="${escapeHtml(key)}">${escapeHtml(COPY.deleteQuestion)}</button>
        </div>
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.questionTitle)}</span>
          <input class="author-field author-field--title" type="text" data-author-decision-field="title" data-decision-key="${escapeHtml(key)}" value="${escapeHtml(decision.title || "")}">
        </label>
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.questionText)}</span>
          <textarea class="author-field" rows="3" data-author-decision-field="question" data-decision-key="${escapeHtml(key)}">${escapeHtml(decision.question || "")}</textarea>
        </label>
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.questionRecommendation)}</span>
          <textarea class="author-field" rows="4" data-author-decision-field="recommendation" data-decision-key="${escapeHtml(key)}">${escapeHtml(decision.recommendation || "")}</textarea>
        </label>
        <section class="author-decision-section">
          <h3>${escapeHtml(COPY.questionLinkedTasks)}</h3>
          <div class="author-decision-groups">${renderDecisionBlocksEditor(decision)}</div>
        </section>
        <section class="author-decision-section">
          <div class="author-decision-section__head">
            <h3>${escapeHtml(COPY.questionAnswerChoices)}</h3>
            <button type="button" class="button button--ghost button--small" data-author-add-option="${escapeHtml(key)}">${escapeHtml(COPY.addOption)}</button>
          </div>
          <div class="author-option-list">${options || `<p class="muted">${escapeHtml(COPY.noAnswerChoices)}</p>`}</div>
        </section>
      </div>
    </article>`;
}

function renderDecisionCard(decision) {
  if (state.editMode) {
    return renderDecisionAuthorCard(decision);
  }

  const decisionKey = decision.key;
  const saved = state.responses.decisions[decisionKey];
  const evidenceFiles = decisionEvidenceFiles(decision);
  const options = (decision.options || [])
    .map((opt) => {
      return `
        <label class="decision-option">
          <input type="radio" name="choice-${escapeHtml(decisionKey)}" value="${escapeHtml(opt.value)}" ${saved?.choice === opt.value ? "checked" : ""}>
          <div class="decision-option__body">
            <strong>${escapeHtml(opt.label)}</strong>
            ${opt.description ? `<p>${escapeHtml(opt.description)}</p>` : ""}
          </div>
        </label>`;
    })
    .join("");

  const evidenceHtml = evidenceFiles.length
    ? `<div class="issue-card__evidence">${evidenceFiles.map((file) => renderEvidenceThumb(file, evidenceFiles)).join("")}</div>`
    : "";

  return `
    <article class="issue-card decision-card" id="decision-${escapeHtml(decisionKey)}">
      <div class="issue-card__content">
        <div class="issue-card__head">
          <h2 class="issue-card__title">${escapeHtml(decision.title)}</h2>
        </div>
        ${(decision.blocks || []).length ? `<div class="meta-row decision-card__blocks">${renderTaskChips(decision.blocks)}</div>` : ""}
        <p class="issue-card__summary">${escapeHtml(decision.question)}</p>
        ${decision.recommendation ? `<p class="decision-card__rec"><strong>${escapeHtml(COPY.ourSuggestion)}:</strong> ${escapeHtml(decision.recommendation.trim())}</p>` : ""}
      </div>
      ${evidenceHtml}
      <form class="decision-form" data-decision-form="${escapeHtml(decisionKey)}">
        <fieldset class="decision-options">
          <legend class="visually-hidden">${escapeHtml(decision.question)}</legend>
          ${options}
        </fieldset>
        <div class="feedback-composer">
          ${renderAuthorPicker(saved?.author || getAuthor("decision"), { id: `decision-${decisionKey}` })}
          <label class="field">
            <span class="field__label">${escapeHtml(COPY.commentOptional)}</span>
            <textarea name="text" rows="2" maxlength="2000">${escapeHtml(saved?.text || "")}</textarea>
          </label>
          <div class="feedback-form__actions">
            <button type="submit" class="button">${escapeHtml(COPY.saveDecision)}</button>
            ${saved ? `<p class="save-status is-visible">${escapeHtml(COPY.youChose)} <strong>${escapeHtml(saved.choice)}</strong>, ${escapeHtml(new Date(saved.updatedAt).toLocaleString())}</p>` : '<p class="save-status" role="status"></p>'}
          </div>
        </div>
      </form>
    </article>`;
}

function renderCommentSummaryCell(row) {
  const normalized = normalizeCommentClient(row) || row;
  const messages = Array.isArray(normalized.messages)
    ? normalized.messages
    : [];
  const firstText = String(messages[0]?.text || normalized.text || "").trim();

  if (messages.length <= 1) {
    return escapeHtml(firstText);
  }

  const preview = escapeHtml(firstText);
  const count = escapeHtml(COPY.replyCount(messages.length));
  const list = messages
    .map((message) => {
      const author = escapeHtml(
        String(message.author || "").trim() || "Unknown",
      );
      const text = escapeHtml(String(message.text || "").trim());
      return `<li class="summary-thread__item"><span class="summary-thread__author">${author}</span> ${text}</li>`;
    })
    .join("");

  return `
    <details class="summary-thread">
      <summary class="summary-thread__summary">
        <span class="summary-thread__preview">${preview}</span>
        <span class="muted summary-thread__count">(${count})</span>
        <span class="summary-thread__arrow" aria-hidden="true"></span>
      </summary>
      <ol class="summary-thread__list">${list}</ol>
    </details>`;
}

function renderSortableTh(key, label, initialSort = "none") {
  const ariaSort =
    initialSort === "ascending" || initialSort === "descending"
      ? initialSort
      : "none";
  return `<th data-sort-key="${escapeHtml(key)}" aria-sort="${ariaSort}"><button type="button" class="table-sort">${escapeHtml(label)}</button></th>`;
}

function renderPlainTh(label) {
  return `<th>${escapeHtml(label)}</th>`;
}

function sortCell(value, html) {
  return `<td data-sort-value="${escapeHtml(String(value ?? ""))}">${html}</td>`;
}

function compareSortValues(a, b) {
  const an = Number(a);
  const bn = Number(b);
  const aNumeric = a !== "" && Number.isFinite(an);
  const bNumeric = b !== "" && Number.isFinite(bn);
  if (aNumeric && bNumeric) {
    return an - bn;
  }
  return String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });
}

function sortTableByColumn(table, colIndex, direction) {
  const tbody = table.tBodies[0];
  if (!tbody) {
    return;
  }
  const rows = [...tbody.rows].filter(
    (row) => !(row.cells.length === 1 && row.cells[0].hasAttribute("colspan")),
  );
  const multiplier = direction === "ascending" ? 1 : -1;
  rows.sort((left, right) => {
    const a = left.cells[colIndex]?.dataset.sortValue ?? "";
    const b = right.cells[colIndex]?.dataset.sortValue ?? "";
    return compareSortValues(a, b) * multiplier;
  });
  rows.forEach((row) => tbody.appendChild(row));
}

function bindSortableTables(root = main) {
  root.querySelectorAll("table[data-sortable]").forEach((table) => {
    table
      .querySelectorAll("th[data-sort-key] .table-sort")
      .forEach((button) => {
        button.addEventListener("click", () => {
          const th = button.closest("th");
          if (!th) {
            return;
          }
          const headerRow = th.parentElement;
          const colIndex = [...headerRow.children].indexOf(th);
          const current = th.getAttribute("aria-sort");
          const nextDir = current === "ascending" ? "descending" : "ascending";
          headerRow.querySelectorAll("th[data-sort-key]").forEach((header) => {
            header.setAttribute("aria-sort", "none");
          });
          th.setAttribute("aria-sort", nextDir);
          sortTableByColumn(table, colIndex, nextDir);
        });
      });
  });
}

function renderResponses() {
  const decisionResponses = state.responses.decisions || {};
  const commentResponses = state.responses.comments || {};

  const decisionEntries = (state.decisions || []).map((decision) => ({
    id: decision.key,
    decision,
    row: decisionResponses[decision.key] || null,
    rank: decisionTaskSortRank(decision),
  }));

  const knownDecisionKeys = new Set(decisionEntries.map((entry) => entry.id));
  Object.entries(decisionResponses).forEach(([id, row]) => {
    if (knownDecisionKeys.has(id)) {
      return;
    }
    decisionEntries.push({
      id,
      decision: null,
      row,
      rank: Number.MAX_SAFE_INTEGER,
    });
  });

  const decisionRows = decisionEntries
    .sort((a, b) => a.rank - b.rank)
    .map(({ id, row, decision }) => {
      const label = renderSummaryItemLabel(
        decision?.blocks || [],
        decision?.title,
        id,
      );
      const author = String(row?.author || "").trim();
      const updatedAt = row?.updatedAt
        ? Number(new Date(row.updatedAt)) || 0
        : 0;
      const answer = row?.choice
        ? `<strong>${escapeHtml(row.choice)}</strong>`
        : `<span class="muted">${escapeHtml(COPY.noAnswerYet)}</span>`;
      const comment = row?.text
        ? escapeHtml(row.text)
        : `<span class="muted">${escapeHtml(COPY.noCommentYet)}</span>`;
      return `<tr>
        ${sortCell(decisionTaskSortRank(decision), label)}
        <td>${answer}</td>
        ${sortCell(author.toLowerCase(), escapeHtml(author))}
        <td>${comment}</td>
        ${sortCell(updatedAt, renderSummaryDateCell(row?.updatedAt))}
      </tr>`;
    })
    .join("");

  const taskEntries = (state.tasks || []).map((task) => ({
    key: task.key,
    task,
    row: commentResponses[task.key] || null,
    rank: taskIdSortRank(task),
  }));

  const knownTaskKeys = new Set(taskEntries.map((entry) => entry.key));
  Object.entries(commentResponses).forEach(([key, row]) => {
    if (knownTaskKeys.has(key)) {
      return;
    }
    taskEntries.push({
      key,
      task: null,
      row,
      rank: Number.MAX_SAFE_INTEGER,
    });
  });

  const commentRows = taskEntries
    .sort((a, b) => a.rank - b.rank)
    .map(({ key, row, task }) => {
      const normalized = row ? normalizeCommentClient(row) || row : null;
      const label = renderSummaryItemLabel(
        task ? [key] : [],
        task?.title,
        key,
      );
      const commentCell = normalized
        ? renderCommentSummaryCell(normalized)
        : `<span class="muted">${escapeHtml(COPY.noCommentYet)}</span>`;
      const author = String(
        normalized?.messages?.[0]?.author || normalized?.author || "",
      ).trim();
      const priority = String(task?.priority || "");
      const priorityRank =
        PRIORITY_SORT_RANK[priority] ?? PRIORITY_OPTIONS.length;
      const priorityCell = task
        ? renderPriorityControl(task, { editable: true })
        : "";
      const status = String(task?.status || "");
      const statusRank = STATUS_SORT_RANK[status] ?? STATUS_OPTIONS.length;
      const statusCell = task
        ? renderStatusControl(task, { editable: true })
        : "";
      const updatedAt = normalized?.updatedAt
        ? Number(new Date(normalized.updatedAt)) || 0
        : 0;
      const rowClasses = ["summary-row--phase"];
      if (status === "deferred") {
        rowClasses.push("summary-row--deferred");
      }
      const phaseStyle =
        task?.sprint != null ? phaseStyleAttr(task.sprint) : "";
      const styleAttr = phaseStyle ? ` style="${phaseStyle}"` : "";
      return `<tr class="${rowClasses.join(" ")}"${styleAttr}>
        ${sortCell(taskIdSortRank(task), label)}
        ${sortCell(priorityRank, priorityCell)}
        ${sortCell(statusRank, statusCell)}
        ${sortCell(author.toLowerCase(), escapeHtml(author))}
        <td>${commentCell}</td>
        ${sortCell(updatedAt, renderSummaryDateCell(normalized?.updatedAt))}
      </tr>`;
    })
    .join("");

  const answersSection = state.editMode
    ? `<section class="section">
        <div class="section__head">
          <h2>${escapeHtml(COPY.questionsHeading)}</h2>
          <button type="button" class="button button--ghost" data-author-add-decision>${escapeHtml(COPY.addQuestion)}</button>
        </div>
        <div class="issue-decisions issue-decisions--author">
          ${(state.decisions || []).map((decision) => renderDecisionCard(decision)).join("") || `<p class="muted">${escapeHtml(COPY.noDecisionsYet)}</p>`}
        </div>
      </section>`
    : `<section class="section">
        <h2>Answers</h2>
        <div class="table-wrap">
          <table class="summary-table summary-table--answers" data-sortable>
            <thead>
              <tr>
                ${renderSortableTh("question", "Question", "ascending")}
                ${renderPlainTh("Answer")}
                ${renderSortableTh("name", "Name")}
                ${renderPlainTh("Comment")}
                ${renderSortableTh("date", "Date")}
              </tr>
            </thead>
            <tbody>${decisionRows || `<tr><td colspan="5">${escapeHtml(COPY.noDecisionsYet)}</td></tr>`}</tbody>
          </table>
        </div>
      </section>`;

  return `
    <div class="page">
      <header class="page-header">
        <h1>${escapeHtml(COPY.summaryTitle)}</h1>
        <p class="lede">${escapeHtml(COPY.summaryLead)}</p>
      </header>
      ${answersSection}
      <section class="section">
        <h2>Feedback on tasks</h2>
        <div class="table-wrap">
          <table class="summary-table summary-table--feedback" data-sortable>
            <thead>
              <tr>
                ${renderSortableTh("task", "Task", "ascending")}
                ${renderSortableTh("priority", "Priority")}
                ${renderSortableTh("status", "Status")}
                ${renderSortableTh("name", "Name")}
                ${renderPlainTh("Comment")}
                ${renderSortableTh("date", "Date")}
              </tr>
            </thead>
            <tbody>${commentRows || `<tr><td colspan="6">${escapeHtml(COPY.noFeedbackYet)}</td></tr>`}</tbody>
          </table>
        </div>
      </section>
    </div>`;
}

function frequencyOptions(selected = "none") {
  const current = ["none", "immediate", "hourly", "daily"].includes(selected)
    ? selected
    : "none";
  return `
    <option value="none"${current === "none" ? " selected" : ""}>${escapeHtml(COPY.frequencyNone)}</option>
    <option value="immediate"${current === "immediate" ? " selected" : ""}>${escapeHtml(COPY.frequencyImmediate)}</option>
    <option value="hourly"${current === "hourly" ? " selected" : ""}>${escapeHtml(COPY.frequencyHourly)}</option>
    <option value="daily"${current === "daily" ? " selected" : ""}>${escapeHtml(COPY.frequencyDaily)}</option>`;
}

function emailsMatch(a, b) {
  return (
    String(a || "")
      .trim()
      .toLowerCase() ===
    String(b || "")
      .trim()
      .toLowerCase()
  );
}

function isAdminTeamMember(member) {
  return (
    isAdmin() &&
    state.auth.email &&
    emailsMatch(member?.email, state.auth.email)
  );
}

function renderTeamMemberRow(teamKey, member = {}, { showRemove = true } = {}) {
  const frequency = member.frequency || "none";
  const isAdminMember = isAdminTeamMember(member);
  const hasLogin = Boolean(member.hasLogin);
  const mustChange = Boolean(member.mustChangePassword);
  let loginStatus = COPY.teamNoLogin;
  if (isAdminMember) {
    loginStatus = COPY.teamAdminLogin;
  } else if (hasLogin && mustChange) {
    loginStatus = COPY.teamMustChange;
  } else if (hasLogin) {
    loginStatus = COPY.teamHasLogin;
  }
  const actionControl = showRemove
    ? `<button
        type="button"
        class="settings-member__remove"
        data-remove-member
        aria-label="${escapeHtml(COPY.teamRemoveMember)}"
        title="${escapeHtml(COPY.teamRemoveMember)}"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>`
    : `<span class="settings-member__action-empty" aria-hidden="true"></span>`;
  const loginCell = isAdminMember
    ? `<div class="settings-member__cell">
        <span class="field__label">${escapeHtml(COPY.teamLoginStatus)}</span>
        <p class="settings-member__login-status">${escapeHtml(loginStatus)}</p>
      </div>`
    : `<div class="settings-member__cell">
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.teamTempPassword)}</span>
          <input type="password" name="${escapeHtml(teamKey)}-tempPassword[]" autocomplete="new-password" placeholder="Leave blank to keep">
        </label>
        <p class="settings-member__login-status">${escapeHtml(loginStatus)}</p>
      </div>`;
  return `
    <div class="settings-member" data-member-row${isAdminMember ? ' data-admin-member="1"' : ""}>
      <div class="settings-member__cell">
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.teamMemberName)}</span>
          <input type="text" name="${escapeHtml(teamKey)}-name[]" maxlength="80" value="${escapeHtml(member.name || "")}" autocomplete="name">
        </label>
      </div>
      <div class="settings-member__cell">
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.teamMemberEmail)}</span>
          <input type="email" name="${escapeHtml(teamKey)}-email[]" maxlength="200" value="${escapeHtml(member.email || "")}" autocomplete="email">
        </label>
      </div>
      <div class="settings-member__cell">
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.teamFrequency)}</span>
          <select name="${escapeHtml(teamKey)}-frequency[]">${frequencyOptions(frequency)}</select>
        </label>
      </div>
      ${loginCell}
      <div class="settings-member__cell settings-member__cell--action">
        <span class="field__label" aria-hidden="true">&nbsp;</span>
        ${actionControl}
      </div>
    </div>`;
}

function renderTeamFields(teamKey, team) {
  const members =
    Array.isArray(team?.members) && team.members.length
      ? team.members
      : [{ name: "", email: "", frequency: "none" }];
  return `
    <fieldset class="settings-fieldset" data-team="${escapeHtml(teamKey)}">
      <legend>${escapeHtml(teamKey === "client" ? COPY.clientTeam : COPY.developerTeam)}</legend>
      <div class="settings-members" data-members="${escapeHtml(teamKey)}">
        ${members
          .map((member) =>
            renderTeamMemberRow(teamKey, member, { showRemove: true }),
          )
          .join("")}
      </div>
      <button type="button" class="settings-members__add" data-add-member="${escapeHtml(teamKey)}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
        <span>${escapeHtml(COPY.teamAddMember)}</span>
      </button>
    </fieldset>`;
}

function readTeamMembersFromForm(form, teamKey) {
  const rows = [...form.querySelectorAll(`[data-members="${teamKey}"] [data-member-row]`)];
  const members = [];
  for (const row of rows) {
    const name = row.querySelector(`input[name="${teamKey}-name[]"]`)?.value.trim() || "";
    const email = row.querySelector(`input[name="${teamKey}-email[]"]`)?.value.trim() || "";
    const frequency =
      row.querySelector(`select[name="${teamKey}-frequency[]"]`)?.value ||
      "none";
    const tempPassword =
      row.querySelector(`input[name="${teamKey}-tempPassword[]"]`)?.value || "";
    if (!name || !email) {
      continue;
    }
    const member = { name, email, frequency };
    if (tempPassword && !row.hasAttribute("data-admin-member")) {
      member.tempPassword = tempPassword;
    }
    members.push(member);
  }
  return members;
}

function bindTeamMemberRepeaters(root = main) {
  root.querySelectorAll("[data-add-member]").forEach((button) => {
    button.addEventListener("click", () => {
      const teamKey = button.dataset.addMember;
      const list = root.querySelector(`[data-members="${teamKey}"]`);
      if (!list) {
        return;
      }
      list.insertAdjacentHTML(
        "beforeend",
        renderTeamMemberRow(
          teamKey,
          { name: "", email: "", frequency: "none" },
          { showRemove: true },
        ),
      );
      const row = list.querySelector("[data-member-row]:last-child");
      row?.querySelector("input")?.focus();
    });
  });

  root.querySelectorAll("[data-members]").forEach((list) => {
    list.addEventListener("click", (event) => {
      const remove = event.target.closest("[data-remove-member]");
      if (!remove) {
        return;
      }
      const row = remove.closest("[data-member-row]");
      if (!row) {
        return;
      }
      const teamKey = list.getAttribute("data-members");
      row.remove();
      if (!list.querySelector("[data-member-row]") && teamKey) {
        list.insertAdjacentHTML(
          "beforeend",
          renderTeamMemberRow(
            teamKey,
            { name: "", email: "", frequency: "none" },
            { showRemove: true },
          ),
        );
      }
    });
  });
}

function renderSettings() {
  const settings = state.settings || {};
  const theme = getThemePref();
  return `
    <div class="page">
      <header class="page-header">
        <h1>${escapeHtml(COPY.settings)}</h1>
        <p class="lede">${escapeHtml(COPY.settingsLead)}</p>
      </header>
      <form class="settings-form" data-settings-form>
        <div class="settings-tabs" role="tablist" aria-label="${escapeHtml(COPY.settings)}">
          <button type="button" class="settings-tabs__btn is-active" role="tab" id="settings-tab-project" aria-selected="true" aria-controls="settings-panel-project" data-settings-tab="project">${escapeHtml(COPY.settingsTabProject)}</button>
          <button type="button" class="settings-tabs__btn" role="tab" id="settings-tab-appearance" aria-selected="false" aria-controls="settings-panel-appearance" data-settings-tab="appearance" tabindex="-1">${escapeHtml(COPY.settingsTabAppearance)}</button>
          <button type="button" class="settings-tabs__btn" role="tab" id="settings-tab-notifications" aria-selected="false" aria-controls="settings-panel-notifications" data-settings-tab="notifications" tabindex="-1">${escapeHtml(COPY.settingsTabNotifications)}</button>
          <button type="button" class="settings-tabs__btn" role="tab" id="settings-tab-activity" aria-selected="false" aria-controls="settings-panel-activity" data-settings-tab="activity" tabindex="-1">${escapeHtml(COPY.settingsTabActivity)}</button>
        </div>
        <section class="section settings-section settings-panel" role="tabpanel" id="settings-panel-project" aria-labelledby="settings-tab-project" data-settings-panel="project">
          <label class="field">
            <span class="field__label">${escapeHtml(COPY.clientName)}</span>
            <input type="text" name="clientName" maxlength="120" value="${escapeHtml(settings.clientName || "")}">
          </label>
        </section>
        <section class="section settings-section settings-panel" role="tabpanel" id="settings-panel-appearance" aria-labelledby="settings-tab-appearance" data-settings-panel="appearance" hidden>
          <fieldset class="settings-theme">
            <legend class="visually-hidden">${escapeHtml(COPY.appearance)}</legend>
            <label class="settings-theme__option"><input type="radio" name="theme" value="light"${theme === "light" ? " checked" : ""}> ${escapeHtml(COPY.themeLight)}</label>
            <label class="settings-theme__option"><input type="radio" name="theme" value="dark"${theme === "dark" ? " checked" : ""}> ${escapeHtml(COPY.themeDark)}</label>
            <label class="settings-theme__option"><input type="radio" name="theme" value="system"${theme === "system" ? " checked" : ""}> ${escapeHtml(COPY.themeSystem)}</label>
          </fieldset>
        </section>
        <section class="section settings-section settings-panel" role="tabpanel" id="settings-panel-notifications" aria-labelledby="settings-tab-notifications" data-settings-panel="notifications" hidden>
          <label class="settings-check">
            <input type="checkbox" name="notifyEnabled"${settings.notifyEnabled ? " checked" : ""}>
            <span>${escapeHtml(COPY.notifyEnabled)}</span>
          </label>
          ${renderTeamFields("client", settings.teams?.client)}
          ${renderTeamFields("developer", settings.teams?.developer)}
        </section>
        <section class="section settings-section settings-panel" role="tabpanel" id="settings-panel-activity" aria-labelledby="settings-tab-activity" data-settings-panel="activity" hidden>
          <p class="lede">${escapeHtml(COPY.activityLogLead)}</p>
          <button type="button" class="button button--ghost" data-open-audit-log>
            ${escapeHtml(COPY.openActivityLog)}
          </button>
        </section>
        <div class="feedback-form__actions">
          <button type="submit" class="button">${escapeHtml(COPY.saveSettings)}</button>
          <p class="save-status" role="status"></p>
        </div>
      </form>
    </div>`;
}

function bindSettingsTabs(root) {
  const tablist = root.querySelector(".settings-tabs");
  if (!tablist) {
    return;
  }
  const tabs = [...tablist.querySelectorAll("[data-settings-tab]")];
  const panels = [...root.querySelectorAll("[data-settings-panel]")];

  function activate(tabId) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.settingsTab === tabId;
      tab.classList.toggle("is-active", selected);
      tab.setAttribute("aria-selected", selected ? "true" : "false");
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.settingsPanel !== tabId;
    });
  }

  tablist.addEventListener("click", (event) => {
    const tab = event.target.closest("[data-settings-tab]");
    if (!tab || !tablist.contains(tab)) {
      return;
    }
    activate(tab.dataset.settingsTab);
  });

  tablist.addEventListener("keydown", (event) => {
    const current = event.target.closest("[data-settings-tab]");
    if (!current || !tablist.contains(current)) {
      return;
    }
    const index = tabs.indexOf(current);
    if (index < 0) {
      return;
    }
    let next = -1;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = (index + 1) % tabs.length;
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = (index - 1 + tabs.length) % tabs.length;
    } else if (event.key === "Home") {
      next = 0;
    } else if (event.key === "End") {
      next = tabs.length - 1;
    } else {
      return;
    }
    event.preventDefault();
    tabs[next].focus();
    activate(tabs[next].dataset.settingsTab);
  });
}

const ESTIMATES_EM_DASH = "—";

function renderEstimatesHoursValue(hours) {
  const formatted = formatHours(hours);
  return formatted !== null ? `${escapeHtml(formatted)}h` : ESTIMATES_EM_DASH;
}

function renderEstimatesCostValue(cost) {
  if (state.hourlyRate === null) {
    return ESTIMATES_EM_DASH;
  }
  const formatted = formatUsd(cost);
  return formatted !== null ? escapeHtml(formatted) : ESTIMATES_EM_DASH;
}

function renderEstimatesHoursCostCell(hours, cost) {
  return `${renderEstimatesHoursValue(hours)} · ${renderEstimatesCostValue(cost)}`;
}

function renderEstimatesBucketCard(bucketKey, bucket, label) {
  return `
    <article class="estimates-bucket estimates-bucket--${escapeHtml(bucketKey)}">
      <h3 class="estimates-bucket__title">${escapeHtml(label)}</h3>
      <dl class="estimates-bucket__metrics">
        <div class="estimates-bucket__metric">
          <dt>${escapeHtml(COPY.estimatesEstimateHours)}</dt>
          <dd>${renderEstimatesHoursValue(bucket.estimateHours)}</dd>
        </div>
        <div class="estimates-bucket__metric">
          <dt>${escapeHtml(COPY.estimatesEstimateCost)}</dt>
          <dd>${renderEstimatesCostValue(bucket.estimateCost)}</dd>
        </div>
        <div class="estimates-bucket__metric">
          <dt>${escapeHtml(COPY.estimatesActualHours)}</dt>
          <dd>${renderEstimatesHoursValue(bucket.actualHours)}</dd>
        </div>
        <div class="estimates-bucket__metric">
          <dt>${escapeHtml(COPY.estimatesActualCost)}</dt>
          <dd>${renderEstimatesCostValue(bucket.actualCost)}</dd>
        </div>
      </dl>
    </article>`;
}

function renderEstimatesBucketStrip(summary, { compact = false } = {}) {
  const compactClass = compact ? " estimates-summary--compact" : "";
  return `
    <div class="estimates-summary${compactClass}">
      ${renderEstimatesBucketCard("done", summary.done, COPY.estimatesDone)}
      ${renderEstimatesBucketCard("remaining", summary.remaining, COPY.estimatesRemaining)}
      ${renderEstimatesBucketCard("grand", summary.grand, COPY.estimatesGrand)}
    </div>`;
}

function renderEstimatesTaskRow(task) {
  const estimateHours = taskEstimateHours(task);
  const actualHours = taskActualHours(task);
  const estimateCost = hoursToCost(estimateHours, state.hourlyRate);
  const actualCost = hoursToCost(actualHours, state.hourlyRate);

  return `<tr>
    <td><a href="#/task/${escapeHtml(task.key)}">${escapeHtml(task.id)}</a></td>
    <td>${escapeHtml(task.title)}</td>
    <td>${renderStatusControl(task, { editable: true })}</td>
    <td>${renderEstimatesHoursCostCell(estimateHours, estimateCost)}</td>
    <td>${renderEstimatesHoursCostCell(actualHours, actualCost)}</td>
  </tr>`;
}

function renderEstimatesPhaseSection(phase) {
  const title = phase.sprint?.title
    ? String(phase.sprint.title).trim()
    : phasePillLabel(phase.sprintId);
  const issueRows = phase.tasks.map(renderEstimatesTaskRow).join("");

  return `
    <section class="estimates-phase" data-phase-id="${escapeHtml(phase.sprintId)}" style="${phaseStyleAttr(phase.sprintId)}">
      <header class="estimates-phase__header">
        <h2 class="estimates-phase__title">${renderPhasePill(phase.sprintId, { linked: false })} <span class="estimates-phase__title-text">${escapeHtml(title)}</span></h2>
      </header>
      ${renderEstimatesBucketStrip(phase.summary, { compact: true })}
      <div class="table-wrap">
        <table class="estimates-table">
          <thead>
            <tr>
              <th>${escapeHtml(COPY.estimatesColId)}</th>
              <th>${escapeHtml(COPY.estimatesColTitle)}</th>
              <th>${escapeHtml(COPY.estimatesColStatus)}</th>
              <th>${escapeHtml(COPY.estimatesColEstimate)}</th>
              <th>${escapeHtml(COPY.estimatesColActual)}</th>
            </tr>
          </thead>
          <tbody>${issueRows}</tbody>
        </table>
      </div>
    </section>`;
}

function estimatePrintPhaseTitle(sprintId, sprint) {
  if (sprint?.title) {
    return String(sprint.title).trim();
  }
  return phasePillLabel(sprintId);
}

function renderEstimatesDownloadButton(disabled = false) {
  return `<button type="button" class="button" data-download-estimate${disabled ? " disabled" : ""}>${escapeHtml(COPY.estimatesDownload)}</button>`;
}

function renderEstimatesPage() {
  if (!state.tasks.length) {
    return `
      <div class="page page--estimates">
        <header class="page-header">
          <div class="page-header__row">
            <h1>${escapeHtml(COPY.estimates)}</h1>
            ${renderEstimatesDownloadButton(true)}
          </div>
        </header>
        <p>${escapeHtml(COPY.estimatesNoTasks)}</p>
      </div>`;
  }

  const summary = summarizeEstimates(state.tasks, state.hourlyRate);
  const phases = summarizeEstimatesByPhase(
    state.tasks,
    state.audit?.sprints || [],
    state.hourlyRate,
  ).filter((phase) => phase.tasks.length > 0);
  const rateBanner =
    state.hourlyRate === null
      ? `<p class="estimates-rate-banner" role="status">${escapeHtml(COPY.hourlyRateMissing)}</p>`
      : "";
  const deferred = summary.deferred;
  const estimateCompleteness = summary.estimateCompleteness;
  const actualCompleteness = summary.actualCompleteness;

  return `
    <div class="page page--estimates">
      <header class="page-header">
        <div class="page-header__row">
          <h1>${escapeHtml(COPY.estimates)}</h1>
          ${renderEstimatesDownloadButton(false)}
        </div>
      </header>
      ${rateBanner}
      ${renderEstimatesBucketStrip(summary)}
      <aside class="estimates-deferred">
        <h2 class="estimates-deferred__title">${escapeHtml(COPY.estimatesDeferred)}</h2>
        <p class="estimates-deferred__note">${escapeHtml(COPY.estimatesDeferredCount(deferred.count))} · ${escapeHtml(COPY.estimatesDeferredNote)}</p>
        <dl class="estimates-deferred__metrics">
          <div class="estimates-deferred__metric">
            <dt>${escapeHtml(COPY.estimatesEstimateHours)}</dt>
            <dd>${renderEstimatesHoursValue(deferred.estimateHours)}</dd>
          </div>
          <div class="estimates-deferred__metric">
            <dt>${escapeHtml(COPY.estimatesEstimateCost)}</dt>
            <dd>${renderEstimatesCostValue(deferred.estimateCost)}</dd>
          </div>
          <div class="estimates-deferred__metric">
            <dt>${escapeHtml(COPY.estimatesActualHours)}</dt>
            <dd>${renderEstimatesHoursValue(deferred.actualHours)}</dd>
          </div>
          <div class="estimates-deferred__metric">
            <dt>${escapeHtml(COPY.estimatesActualCost)}</dt>
            <dd>${renderEstimatesCostValue(deferred.actualCost)}</dd>
          </div>
        </dl>
      </aside>
      <p class="estimates-completeness">
        ${escapeHtml(
          COPY.estimatesCompletenessEstimate(
            estimateCompleteness.set,
            estimateCompleteness.total,
          ),
        )}
        <span class="estimates-completeness__sep" aria-hidden="true">·</span>
        ${escapeHtml(
          COPY.estimatesCompletenessActual(
            actualCompleteness.set,
            actualCompleteness.total,
          ),
        )}
      </p>
      <div class="estimates-phases">
        ${phases.map(renderEstimatesPhaseSection).join("")}
      </div>
    </div>`;
}

function renderRoute() {
  const { name, params } = state.route;
  switch (name) {
    case "overview":
      return renderOverview();
    case "sprints":
    case "sprint":
      return renderOverview();
    case "task":
      return renderTaskDetail(params.taskKey);
    case "tasks-by-priority":
      return renderFilteredTasks("priority", params.priority);
    case "tasks-by-status":
      return renderFilteredTasks("status", params.status);
    case "tasks-by-tag":
      return renderFilteredTasks("tag", params.tag);
    case "evidence":
      return renderEvidenceGallery();
    case "evidence-item":
      return renderEvidenceGallery(params.file);
    case "estimates":
      return renderEstimatesPage();
    case "responses":
      return renderResponses();
    case "settings":
      if (!isAdmin()) {
        return renderOverview();
      }
      return renderSettings();
    default:
      return renderOverview();
  }
}

function updateActiveNav() {
  const path = state.route.path;
  document.querySelectorAll("[data-nav]").forEach((link) => {
    const href = link.getAttribute("href")?.replace("#", "") || "/";
    const active =
      href === path ||
      (href === "/" && (path === "/" || path === "/overview")) ||
      (href !== "/" && path.startsWith(href));
    link.classList.toggle("is-active", active);
  });
}

async function render() {
  if (!state.ready) {
    return;
  }
  if (state.route.name !== "overview") {
    state.phaseReorderMode = false;
  }
  await syncTaskAuthorLock(state);
  motion.viewTransition(() => {
    main.innerHTML = renderRoute();
    updateActiveNav();
    bindPageHandlers();
  });
}

async function showAuthPanel() {
  await endBoot();
  document.body.classList.add("is-locked");
  authPanel.hidden = false;
  authBlocked.hidden = true;
  if (changePasswordPanel) {
    changePasswordPanel.hidden = true;
  }
  siteHeader.hidden = true;
  main.hidden = true;
  state.ready = false;
}

async function showBlockedPanel() {
  await endBoot();
  document.body.classList.add("is-locked");
  authPanel.hidden = true;
  authBlocked.hidden = false;
  if (changePasswordPanel) {
    changePasswordPanel.hidden = true;
  }
  siteHeader.hidden = true;
  main.hidden = true;
  state.ready = false;
}

async function showChangePasswordPanel({ forced = false } = {}) {
  await endBoot();
  document.body.classList.add("is-locked");
  authPanel.hidden = true;
  authBlocked.hidden = true;
  if (changePasswordPanel) {
    changePasswordPanel.hidden = false;
  }
  siteHeader.hidden = true;
  main.hidden = true;
  if (changePasswordLede) {
    changePasswordLede.textContent = forced
      ? COPY.changePasswordForcedLead
      : COPY.changePasswordLead;
  }
  if (changePasswordCancel) {
    changePasswordCancel.hidden = forced;
  }
  if (changePasswordForm) {
    changePasswordForm.reset();
  }
  if (changePasswordStatus) {
    changePasswordStatus.textContent = "";
    changePasswordStatus.classList.remove("is-visible", "is-error");
  }
}

async function showAppShell() {
  await endBoot();
  document.body.classList.remove("is-locked");
  authPanel.hidden = true;
  authBlocked.hidden = true;
  if (changePasswordPanel) {
    changePasswordPanel.hidden = true;
  }
  siteHeader.hidden = false;
  main.hidden = false;
  syncAdminNav();
}

async function loadAppData() {
  const content = await loadContent();
  state.audit = content.audit;
  if (state.audit && typeof state.audit === "object") {
    delete state.audit.title;
  }
  state.tasks = content.tasks;
  state.evidence = content.evidence;
  state.decisions = content.decisions;
  state.responses = await loadResponses();
  try {
    state.settings = await loadSettings();
  } catch {
    state.settings = state.settings || {
      clientName: "",
      notifyEnabled: false,
      teams: {
        client: { members: [] },
        developer: { members: [] },
      },
    };
  }
  const normalizedComments = {};
  for (const [key, row] of Object.entries(state.responses.comments || {})) {
    normalizedComments[key] = normalizeCommentClient(row) || row;
  }
  state.responses.comments = normalizedComments;
  state.ready = true;
  applyBrand();
  applyTheme();
}

async function afterAuthenticated(auth) {
  applyAuthSession(auth);
  applyHourlyRate(auth);
  applyVendor(auth);
  markAuthedSession();
  skipBootSplash();
  if (state.auth.mustChangePassword) {
    await showChangePasswordPanel({ forced: true });
    return;
  }
  await loadAppData();
  await showAppShell();
  state.route = normalizeLegacyRoute(parseRoute());
  if (state.route.name === "settings" && !isAdmin()) {
    history.replaceState(null, "", "#/");
    state.route = normalizeLegacyRoute(parseRoute());
  }
  render();
}

function closeAccountMenu() {
  if (!accountMenuPanel || !accountMenuToggle) {
    return;
  }
  accountMenuPanel.hidden = true;
  accountMenuToggle.setAttribute("aria-expanded", "false");
}

function formatAuditWhen(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return String(iso || "");
  }
}

function formatAuditAction(entry) {
  const action = String(entry?.action || "");
  const target = entry?.target && typeof entry.target === "object" ? entry.target : {};
  const bits = [action];
  if (target.taskKey) {
    bits.push(String(target.taskKey));
  }
  if (target.decisionId) {
    bits.push(String(target.decisionId));
  }
  if (target.file) {
    bits.push(String(target.file));
  }
  if (target.priority) {
    bits.push(String(target.priority));
  }
  if (target.status) {
    bits.push(String(target.status));
  }
  return bits.join(" · ");
}

function renderAuditLogEntries(entries) {
  if (!Array.isArray(entries) || entries.length === 0) {
    return `<p class="audit-dialog__empty">${escapeHtml(COPY.activityLogEmpty)}</p>`;
  }
  const rows = entries
    .map((entry) => {
      const ok = entry?.ok !== false;
      const result = ok ? COPY.activityLogOk : COPY.activityLogFail;
      const reason =
        !ok && entry?.reason
          ? ` (${escapeHtml(String(entry.reason))})`
          : "";
      return `<tr>
        <td>${escapeHtml(formatAuditWhen(entry?.at))}</td>
        <td>${escapeHtml(String(entry?.email || "—"))}</td>
        <td>${escapeHtml(formatAuditAction(entry))}</td>
        <td class="${ok ? "audit-ok" : "audit-fail"}">${escapeHtml(result)}${reason}</td>
      </tr>`;
    })
    .join("");
  return `<table class="audit-table">
    <thead>
      <tr>
        <th>${escapeHtml(COPY.activityLogColWhen)}</th>
        <th>${escapeHtml(COPY.activityLogColWho)}</th>
        <th>${escapeHtml(COPY.activityLogColAction)}</th>
        <th>${escapeHtml(COPY.activityLogColResult)}</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>`;
}

async function openAuditLogDialog() {
  if (!auditDialog || !auditDialogBody) {
    return;
  }
  auditDialogBody.innerHTML = `<p class="audit-dialog__empty">Loading…</p>`;
  if (typeof auditDialog.showModal === "function") {
    auditDialog.showModal();
  } else {
    auditDialog.setAttribute("open", "");
  }
  try {
    const data = await loadAuditLog();
    auditDialogBody.innerHTML = renderAuditLogEntries(data.entries || []);
  } catch (error) {
    auditDialogBody.innerHTML = `<p class="audit-dialog__empty">${escapeHtml(error.message)}</p>`;
  }
}

function closeAuditLogDialog() {
  if (!auditDialog) {
    return;
  }
  if (typeof auditDialog.close === "function") {
    auditDialog.close();
  } else {
    auditDialog.removeAttribute("open");
  }
}

function bindAuthHandlers() {
  accountMenuToggle?.addEventListener("click", (event) => {
    event.stopPropagation();
    if (!accountMenuPanel) {
      return;
    }
    const open = accountMenuPanel.hidden;
    accountMenuPanel.hidden = !open;
    accountMenuToggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  document.addEventListener("click", (event) => {
    if (!accountMenu || accountMenu.contains(event.target)) {
      return;
    }
    closeAccountMenu();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeAccountMenu();
    }
  });

  accountMenuPanel?.addEventListener("click", () => {
    // Keep menu open until an item acts; settings nav will leave page.
    closeAccountMenu();
  });

  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const status = loginStatus;
    try {
      status.textContent = "Signing in…";
      status.classList.add("is-visible");
      status.classList.remove("is-error");
      const loginAuth = await login(
        String(data.get("email") || ""),
        String(data.get("password") || ""),
        String(data.get("website") || ""),
      );
      loginForm.reset();
      await afterAuthenticated(loginAuth);
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("is-visible", "is-error");
    }
  });

  changePasswordForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(changePasswordForm);
    const status = changePasswordStatus;
    const forced = state.auth.mustChangePassword;
    try {
      status.textContent = "Saving…";
      status.classList.add("is-visible");
      status.classList.remove("is-error");
      const result = await changePassword(
        String(data.get("currentPassword") || ""),
        String(data.get("newPassword") || ""),
        String(data.get("confirmPassword") || ""),
        String(data.get("website") || ""),
      );
      applyAuthSession(result);
      changePasswordForm.reset();
      status.textContent = COPY.passwordChanged;
      status.classList.add("is-visible");
      if (forced || !state.ready) {
        await loadAppData();
        await showAppShell();
        state.route = normalizeLegacyRoute(parseRoute());
        render();
      } else {
        await showAppShell();
      }
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("is-visible", "is-error");
    }
  });

  changePasswordCancel?.addEventListener("click", async () => {
    if (state.auth.mustChangePassword) {
      return;
    }
    await showAppShell();
    if (state.ready) {
      render();
    }
  });

  changePasswordButton?.addEventListener("click", async () => {
    closeAccountMenu();
    await showChangePasswordPanel({ forced: false });
  });

  logoutButton?.addEventListener("click", async () => {
    closeAccountMenu();
    try {
      await logout();
    } catch {
      /* still lock UI */
    }
    clearAuthedSession();
    state.auth = { email: null, role: null, mustChangePassword: false };
    syncAdminNav();
    await showAuthPanel();
    main.innerHTML = "";
  });

  auditDialogClose?.addEventListener("click", () => {
    closeAuditLogDialog();
  });

  auditDialog?.addEventListener("click", (event) => {
    if (event.target === auditDialog) {
      closeAuditLogDialog();
    }
  });
}

function parseEvidenceGallery(button) {
  const raw = button.dataset.evidenceGallery;
  if (!raw) {
    return null;
  }
  return raw
    .split(",")
    .map((file) => file.trim())
    .filter((file) => evidenceByFile(file));
}

function resetLightboxGallery() {
  lightboxGallery.files = [];
  lightboxGallery.index = -1;
}

function updateLightboxNav() {
  const hasGallery = lightboxGallery.files.length > 1;
  lightboxStage.classList.toggle("is-gallery", hasGallery);
  lightboxPrev.hidden = !hasGallery;
  lightboxNext.hidden = !hasGallery;
  if (!hasGallery) {
    return;
  }
  lightboxPrev.disabled = lightboxGallery.index <= 0;
  lightboxNext.disabled =
    lightboxGallery.index >= lightboxGallery.files.length - 1;
}

function renderLightboxFile(file) {
  const row = evidenceByFile(file);
  if (!row) {
    return false;
  }
  lightboxTitle.textContent = row.page || file;
  if (isVideoEvidence(row)) {
    lightboxBody.innerHTML = `<video controls autoplay src="${escapeHtml(mediaUrl(file))}"></video>`;
  } else {
    lightboxBody.innerHTML = `<img src="${escapeHtml(mediaUrl(file))}" alt="${escapeHtml(row.page || file)}">`;
  }
  const pageLink = renderEvidencePageLink(row, "lightbox__page-link");
  lightboxFooter.innerHTML = pageLink
    ? `<p class="lightbox__footer-link">${pageLink}</p>`
    : "";
  return true;
}

function openLightbox(file, galleryFiles = null) {
  const files = galleryFiles && galleryFiles.length > 1 ? galleryFiles : null;
  if (files) {
    const index = files.indexOf(file);
    if (index === -1) {
      resetLightboxGallery();
    } else {
      lightboxGallery.files = files;
      lightboxGallery.index = index;
    }
  } else {
    resetLightboxGallery();
  }
  if (!renderLightboxFile(file)) {
    resetLightboxGallery();
    return;
  }
  updateLightboxNav();
  motion.openLightbox(lightbox);
}

function stepLightbox(delta) {
  if (lightboxGallery.files.length <= 1) {
    return;
  }
  const nextIndex = lightboxGallery.index + delta;
  if (nextIndex < 0 || nextIndex >= lightboxGallery.files.length) {
    return;
  }
  lightboxGallery.index = nextIndex;
  renderLightboxFile(lightboxGallery.files[nextIndex]);
  updateLightboxNav();
}

function closeLightbox() {
  motion.closeLightbox(lightbox);
  lightboxBody.innerHTML = "";
  resetLightboxGallery();
  updateLightboxNav();
}

function primeVideoThumbs(root = main) {
  root
    .querySelectorAll(
      ".evidence-thumb--video video, .media-block__image--video video",
    )
    .forEach((video) => {
      const seekToFrame = () => {
        try {
          if (video.readyState >= 1) {
            video.currentTime = 0.1;
          }
        } catch {
          /* ignore seek errors on short clips */
        }
      };

      video.addEventListener("loadeddata", seekToFrame, { once: true });
      video.addEventListener("loadedmetadata", seekToFrame, { once: true });
      video.load();
    });
}

function refreshTaskTagsRow(taskKey) {
  const task = taskByKey(taskKey);
  const row = main.querySelector(`[data-task-tags="${CSS.escape(taskKey)}"]`);
  if (!task || !row) {
    return;
  }
  const html = renderTaskTags(task, { editable: true });
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const next = template.content.firstElementChild;
  if (!next) {
    return;
  }
  row.replaceWith(next);
  bindTaskTagsRow(next);
}

async function persistTaskTags(taskKey, nextTags, { rollbackTags } = {}) {
  const task = taskByKey(taskKey);
  const row = main.querySelector(`[data-task-tags="${CSS.escape(taskKey)}"]`);
  if (!task) {
    return;
  }
  const previous = Array.isArray(rollbackTags)
    ? [...rollbackTags]
    : [...(task.tags || [])];
  task.tags = [...nextTags];
  if (row) {
    row.setAttribute("aria-busy", "true");
    row.querySelectorAll("button, input").forEach((el) => {
      el.disabled = true;
    });
  }
  try {
    const result = await saveTaskTags(taskKey, nextTags);
    task.tags = Array.isArray(result.tags) ? result.tags : [...nextTags];
    refreshTaskTagsRow(taskKey);
  } catch (error) {
    task.tags = previous;
    refreshTaskTagsRow(taskKey);
    window.alert(error.message || "Could not save tags.");
  }
}

function closeTagCombobox(wrap) {
  const taskKey = wrap?.dataset?.tagAddWrap;
  if (!wrap || !taskKey) {
    return;
  }
  wrap.innerHTML = `<button
    type="button"
    class="chip chip--tag-add"
    data-tag-add-open
    data-task-key="${escapeHtml(taskKey)}"
    aria-label="${escapeHtml(COPY.addTag)}"
  ><span aria-hidden="true">+</span></button>`;
  const button = wrap.querySelector("[data-tag-add-open]");
  button?.addEventListener("click", () => openTagCombobox(wrap));
}

function openTagCombobox(wrap) {
  const taskKey = wrap.dataset.tagAddWrap;
  const task = taskByKey(taskKey);
  if (!task) {
    return;
  }

  const listId = `tag-list-${taskKey}`;
  wrap.innerHTML = `
    <div class="combobox combobox--tag" data-tag-picker>
      <label class="visually-hidden" for="tag-input-${escapeHtml(taskKey)}">${escapeHtml(COPY.addTag)}</label>
      <div class="combobox__control">
        <input
          type="text"
          id="tag-input-${escapeHtml(taskKey)}"
          class="combobox__input"
          role="combobox"
          aria-expanded="false"
          aria-controls="${escapeHtml(listId)}"
          aria-autocomplete="list"
          aria-haspopup="listbox"
          data-tag-input
          maxlength="40"
          autocomplete="off"
          spellcheck="false"
          placeholder="${escapeHtml(COPY.tagPlaceholder)}"
        >
        <ul
          class="combobox__list"
          id="${escapeHtml(listId)}"
          role="listbox"
          data-tag-list
          hidden
        ></ul>
      </div>
    </div>`;

  const picker = wrap.querySelector("[data-tag-picker]");
  const input = picker.querySelector("[data-tag-input]");
  const list = picker.querySelector("[data-tag-list]");
  picker._tagOptions = [];
  picker._tagActiveIndex = -1;

  const setActive = (index) => {
    const options = list.querySelectorAll("[role='option']");
    picker._tagActiveIndex = index;
    options.forEach((option, optionIndex) => {
      const active = optionIndex === index;
      option.classList.toggle("is-active", active);
      option.setAttribute("aria-selected", active ? "true" : "false");
      if (active) {
        input.setAttribute("aria-activedescendant", option.id);
        option.scrollIntoView({ block: "nearest" });
      }
    });
    if (index < 0) {
      input.removeAttribute("aria-activedescendant");
    }
  };

  const choose = async (value) => {
    picker._tagChoosing = true;
    const tag = canonicalizeTag(value);
    if (!tag) {
      closeTagCombobox(wrap);
      return;
    }
    const current = (task.tags || []).map(normalizeTagLabel).filter(Boolean);
    if (current.some((entry) => tagsMatch(entry, tag))) {
      closeTagCombobox(wrap);
      return;
    }
    const next = [...current, tag];
    await persistTaskTags(taskKey, next, { rollbackTags: current });
  };

  const renderOptions = () => {
    const query = normalizeTagLabel(input.value);
    const catalog = collectKnownTags();
    const current = task.tags || [];
    const items = [];

    for (const tag of catalog) {
      if (query && !tag.toLowerCase().includes(query.toLowerCase())) {
        continue;
      }
      const onTask = current.some((entry) => tagsMatch(entry, tag));
      items.push({
        value: tag,
        label: tag,
        create: false,
        disabled: onTask,
      });
    }

    const exactInCatalog =
      Boolean(query) && catalog.some((tag) => tagsMatch(tag, query));
    const exactOnTask =
      Boolean(query) && current.some((tag) => tagsMatch(tag, query));

    if (query && !exactInCatalog && !exactOnTask) {
      items.push({
        value: query,
        label: COPY.createTag(query),
        create: true,
        disabled: false,
      });
    }

    picker._tagOptions = items;
    if (!items.length) {
      const emptyCopy = catalog.length
        ? COPY.tagPlaceholder
        : COPY.tagEmptyList;
      list.innerHTML = `<li class="combobox__empty" role="presentation">${escapeHtml(emptyCopy)}</li>`;
    } else {
      list.innerHTML = items
        .map((item, index) => {
          const optionId = `${listId}-opt-${index}`;
          const createClass = item.create ? " is-create" : "";
          const disabledClass = item.disabled ? " is-disabled" : "";
          const disabledAttr = item.disabled ? ' aria-disabled="true"' : "";
          const ariaLabel = item.disabled
            ? ` aria-label="${escapeHtml(`${item.label}, ${COPY.tagAlreadyAdded}`)}"`
            : "";
          const mark = item.disabled
            ? `<span class="combobox__option-mark" aria-hidden="true">✓</span>`
            : "";
          return `<li
            id="${escapeHtml(optionId)}"
            class="combobox__option${createClass}${disabledClass}"
            role="option"
            data-value="${escapeHtml(item.value)}"
            data-create="${item.create ? "true" : "false"}"
            data-disabled="${item.disabled ? "true" : "false"}"
            aria-selected="false"${disabledAttr}${ariaLabel}
          ><span class="combobox__option-label">${escapeHtml(item.label)}</span>${mark}</li>`;
        })
        .join("");
    }

    list.hidden = false;
    input.setAttribute("aria-expanded", "true");
    const preferred = query
      ? items.findIndex(
          (item) =>
            !item.disabled && !item.create && tagsMatch(item.value, query),
        )
      : -1;
    const firstEnabled = items.findIndex((item) => !item.disabled);
    setActive(
      preferred >= 0 ? preferred : firstEnabled >= 0 ? firstEnabled : -1,
    );
  };

  input.addEventListener("focus", () => {
    renderOptions();
  });

  input.addEventListener("input", () => {
    renderOptions();
  });

  input.addEventListener("keydown", (event) => {
    const options = picker._tagOptions || [];
    const enabledIndexes = options
      .map((item, index) => (item.disabled ? -1 : index))
      .filter((index) => index >= 0);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (list.hidden) {
        renderOptions();
        return;
      }
      if (!enabledIndexes.length) {
        return;
      }
      const currentPos = enabledIndexes.indexOf(picker._tagActiveIndex);
      const nextPos =
        currentPos < 0 ? 0 : (currentPos + 1) % enabledIndexes.length;
      setActive(enabledIndexes[nextPos]);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (list.hidden) {
        renderOptions();
        return;
      }
      if (!enabledIndexes.length) {
        return;
      }
      const currentPos = enabledIndexes.indexOf(picker._tagActiveIndex);
      const nextPos =
        currentPos < 0
          ? enabledIndexes.length - 1
          : (currentPos - 1 + enabledIndexes.length) % enabledIndexes.length;
      setActive(enabledIndexes[nextPos]);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      if (
        !list.hidden &&
        picker._tagActiveIndex >= 0 &&
        options[picker._tagActiveIndex] &&
        !options[picker._tagActiveIndex].disabled
      ) {
        choose(options[picker._tagActiveIndex].value);
        return;
      }
      const query = normalizeTagLabel(input.value);
      if (query) {
        choose(query);
      }
      return;
    }
    if (event.key === "Escape") {
      event.preventDefault();
      closeTagCombobox(wrap);
      wrap.querySelector("[data-tag-add-open]")?.focus();
      return;
    }
    if (event.key === "Tab") {
      closeTagCombobox(wrap);
    }
  });

  list.addEventListener("mousedown", (event) => {
    const option = event.target.closest("[data-value]");
    if (!option || option.dataset.disabled === "true") {
      return;
    }
    event.preventDefault();
    choose(option.dataset.value);
  });

  input.addEventListener("blur", () => {
    window.setTimeout(() => {
      if (picker._tagChoosing) {
        return;
      }
      if (!wrap.contains(document.activeElement)) {
        closeTagCombobox(wrap);
      }
    }, 120);
  });

  input.focus();
  renderOptions();
}

function bindTaskTagsRow(row) {
  if (!row) {
    return;
  }
  const taskKey = row.dataset.taskTags;
  row.querySelectorAll("[data-tag-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      const task = taskByKey(taskKey);
      if (!task) {
        return;
      }
      const removeTag = button.dataset.tag || "";
      const previous = (task.tags || [])
        .map(normalizeTagLabel)
        .filter(Boolean);
      const next = previous.filter((tag) => !tagsMatch(tag, removeTag));
      await persistTaskTags(taskKey, next, { rollbackTags: previous });
    });
  });

  const wrap = row.querySelector("[data-tag-add-wrap]");
  const openButton = wrap?.querySelector("[data-tag-add-open]");
  openButton?.addEventListener("click", () => openTagCombobox(wrap));
}

function bindTaskTags(root = main) {
  root.querySelectorAll("[data-task-tags]").forEach((row) => {
    bindTaskTagsRow(row);
  });
}

function bindPhaseReorderDrag(root = main) {
  const container = root.querySelector(".phases-accordion[data-phase-reorder]");
  if (!container) {
    return;
  }

  let draggedPhaseId = null;
  const items = () => [...container.querySelectorAll("details[data-phase-id]")];

  const clearDropState = () => {
    container
      .querySelectorAll(".is-dragging, .is-drop-before, .is-drop-after")
      .forEach((node) => {
        node.classList.remove("is-dragging", "is-drop-before", "is-drop-after");
      });
  };

  container.querySelectorAll("[data-drag-handle]").forEach((handle) => {
    handle.addEventListener("dragstart", (event) => {
      const item = handle.closest("details[data-phase-id]");
      draggedPhaseId = item?.dataset.phaseId || null;
      if (!draggedPhaseId) {
        return;
      }
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", draggedPhaseId);
      item?.classList.add("is-dragging");
    });
    handle.addEventListener("dragend", () => {
      draggedPhaseId = null;
      clearDropState();
    });
    handle.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  });

  container.addEventListener("dragover", (event) => {
    if (!draggedPhaseId) {
      return;
    }
    event.preventDefault();
    clearDropState();
    const item = event.target.closest("details[data-phase-id]");
    if (item && item.dataset.phaseId !== draggedPhaseId) {
      const rect = item.getBoundingClientRect();
      const before = event.clientY < rect.top + rect.height / 2;
      item.classList.add(before ? "is-drop-before" : "is-drop-after");
    }
  });

  container.addEventListener("drop", async (event) => {
    event.preventDefault();
    const fromId = event.dataTransfer.getData("text/plain") || draggedPhaseId;
    const target = event.target.closest("details[data-phase-id]");
    const rect = target?.getBoundingClientRect();
    const before =
      target && rect ? event.clientY < rect.top + rect.height / 2 : true;
    clearDropState();
    if (!fromId || !target || target.dataset.phaseId === fromId) {
      return;
    }

    const order = items().map((el) => el.dataset.phaseId);
    const fromIndex = order.indexOf(fromId);
    if (fromIndex < 0) {
      return;
    }
    order.splice(fromIndex, 1);
    const targetId = target.dataset.phaseId;
    let toIndex = order.indexOf(targetId);
    if (!before) {
      toIndex += 1;
    }
    order.splice(toIndex, 0, fromId);

    const byId = new Map(items().map((el) => [el.dataset.phaseId, el]));
    order.forEach((id) => {
      const el = byId.get(id);
      if (el) {
        container.appendChild(el);
      }
    });

    const previousSprints = structuredClone(state.audit.sprints);
    const previousTasks = state.tasks.map((task) => ({
      key: task.key,
      id: task.id,
      sprint: task.sprint,
    }));

    try {
      const result = await savePhaseOrder(order.map(Number));
      state.audit.sprints = result.sprints;
      const byKey = new Map((result.tasks || []).map((row) => [row.key, row]));
      for (const item of state.tasks) {
        const next = byKey.get(item.key);
        if (!next) {
          continue;
        }
        item.id = next.id;
        item.sprint = next.sprint;
      }
      state.phaseReorderMode = true;
      render();
    } catch (error) {
      state.audit.sprints = previousSprints;
      const prevByKey = new Map(previousTasks.map((row) => [row.key, row]));
      for (const item of state.tasks) {
        const prev = prevByKey.get(item.key);
        if (!prev) {
          continue;
        }
        item.id = prev.id;
        item.sprint = prev.sprint;
      }
      window.alert(error.message || "Could not save phase order.");
      render();
    }
  });
}

function bindPageHandlers() {
  bindSortableTables();

  main.querySelectorAll("[data-download-estimate]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!state.tasks.length) {
        return;
      }
      printEstimate(
        {
          tasks: state.tasks,
          sprints: state.audit?.sprints || [],
          rate: state.hourlyRate,
          clientName: clientName(),
          vendor: state.vendor,
          generatedAt: new Date(),
          copy: COPY,
          statusLabel,
          phaseTitle: estimatePrintPhaseTitle,
        },
        DEFAULT_ESTIMATE_PRINT_PROFILE,
      );
    });
  });

  main.querySelectorAll("[data-open-evidence]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const gallery = parseEvidenceGallery(btn);
      openLightbox(btn.dataset.openEvidence, gallery);
    });
  });

  main.querySelectorAll("[data-comment-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const taskId = form.dataset.commentForm;
      const picker = form.querySelector("[data-author-picker]");
      const author = syncAuthorPicker(picker);
      if (!author) {
        const status = form.querySelector(".save-status");
        status.textContent = COPY.nameRequired;
        status.classList.add("is-visible", "is-error");
        return;
      }
      setAuthor(author, "comment");
      const data = new FormData(form);
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector(".save-status");
      try {
        button.disabled = true;
        const result = await postCommentReply(taskId, {
          text: data.get("text"),
          author,
        });
        state.responses.comments[taskId] =
          normalizeCommentClient(result) || result;
        status.textContent = `${COPY.lastSaved} ${new Date(result.updatedAt).toLocaleString()}`;
        status.classList.add("is-visible");
        status.classList.remove("is-error");
        motion.pulseSaved(button);
        render();
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("is-visible", "is-error");
      } finally {
        button.disabled = false;
      }
    });
  });

  main.querySelectorAll("[data-edit-message]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.editMessage;
      const article = button.closest(".thread-msg");
      const slot = article?.querySelector("[data-edit-slot]");
      const body = article?.querySelector("[data-message-body]");
      if (!article || !slot) {
        return;
      }
      const message = {
        id,
        author: article.querySelector(".thread-msg__author")?.textContent || "",
        text: body?.textContent || "",
      };
      slot.innerHTML = buildReplyEditForm(message);
      button.hidden = true;
      if (body) {
        body.hidden = true;
      }
      bindEditForm(slot.querySelector("[data-edit-form]"));
    });
  });

  function closeEditSlot(article) {
    if (!article) {
      return;
    }
    const slot = article.querySelector("[data-edit-slot]");
    const editButton = article.querySelector("[data-edit-message]");
    const body = article.querySelector("[data-message-body]");
    if (slot) {
      slot.innerHTML = "";
    }
    if (editButton) {
      editButton.hidden = false;
    }
    if (body) {
      body.hidden = false;
    }
  }

  function bindEditForm(form) {
    if (!form) {
      return;
    }
    form.querySelector("[data-cancel-edit]")?.addEventListener("click", () => {
      closeEditSlot(form.closest(".thread-msg"));
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const messageId = form.dataset.editForm;
      const panel = form.closest(".feedback-panel");
      const commentForm = panel?.querySelector("[data-comment-form]");
      const taskId = commentForm?.dataset.commentForm;
      if (!taskId) {
        return;
      }
      const data = new FormData(form);
      const author = String(data.get("author") || "");
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector(".save-status");
      const payload = {
        messageId,
        text: data.get("text") || "",
        author,
      };
      try {
        button.disabled = true;
        const result = await editCommentMessage(taskId, payload);
        if (result.cleared) {
          delete state.responses.comments[taskId];
        } else {
          state.responses.comments[taskId] =
            normalizeCommentClient(result) || result;
        }
        render();
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("is-visible", "is-error");
      } finally {
        button.disabled = false;
      }
    });
  }

  bindAuthorPickers(main);

  const settingsForm = main.querySelector("[data-settings-form]");
  if (settingsForm) {
    bindSettingsTabs(settingsForm);
    bindTeamMemberRepeaters(settingsForm);
    settingsForm
      .querySelector("[data-open-audit-log]")
      ?.addEventListener("click", () => {
        openAuditLogDialog();
      });
    settingsForm.querySelectorAll('input[name="theme"]').forEach((input) => {
      input.addEventListener("change", () => {
        if (input.checked) {
          applyTheme(input.value);
        }
      });
    });
    settingsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = new FormData(settingsForm);
      const status = settingsForm.querySelector(".save-status");
      const button = settingsForm.querySelector('button[type="submit"]');
      const theme = String(data.get("theme") || "system");
      applyTheme(theme);
      const payload = {
        clientName: String(data.get("clientName") || "").trim(),
        notifyEnabled: data.get("notifyEnabled") === "on",
        teams: {
          client: {
            members: readTeamMembersFromForm(settingsForm, "client"),
          },
          developer: {
            members: readTeamMembersFromForm(settingsForm, "developer"),
          },
        },
      };
      try {
        button.disabled = true;
        status.textContent = "";
        status.classList.remove("is-error");
        state.settings = await saveSettings(payload);
        applyBrand();
        status.textContent = COPY.settingsSaved;
        status.classList.add("is-visible");
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("is-visible", "is-error");
      } finally {
        button.disabled = false;
      }
    });
  }

  main.querySelectorAll("[data-task-priority]").forEach((select) => {
    select.addEventListener("change", async () => {
      const taskKey = select.dataset.taskPriority;
      const priority = select.value;
      const previous = state.tasks.find(
        (item) => item.key === taskKey,
      )?.priority;
      const priorityRank =
        PRIORITY_SORT_RANK[priority] ?? PRIORITY_OPTIONS.length;
      syncPillControlChrome(select, `pill pill--${priority}`);
      select.disabled = true;
      try {
        await saveTaskPriority(taskKey, priority);
        const task = state.tasks.find((item) => item.key === taskKey);
        if (task) {
          task.priority = priority;
        }
        const sortCell = select.closest("td[data-sort-value]");
        if (sortCell) {
          sortCell.dataset.sortValue = String(priorityRank);
        }
      } catch (error) {
        if (previous) {
          select.value = previous;
          syncPillControlChrome(select, `pill pill--${previous}`);
          const sortCell = select.closest("td[data-sort-value]");
          if (sortCell) {
            const previousRank =
              PRIORITY_SORT_RANK[previous] ?? PRIORITY_OPTIONS.length;
            sortCell.dataset.sortValue = String(previousRank);
          }
        }
        window.alert(error.message || "Could not save priority.");
      } finally {
        select.disabled = false;
      }
    });
  });

  main.querySelectorAll("[data-task-status]").forEach((select) => {
    select.addEventListener("change", async () => {
      const taskKey = select.dataset.taskStatus;
      const status = select.value;
      const previous = state.tasks.find(
        (item) => item.key === taskKey,
      )?.status;
      const statusRank = STATUS_SORT_RANK[status] ?? STATUS_OPTIONS.length;
      syncPillControlChrome(select, `pill pill--status pill--${status}`);
      select.disabled = true;
      try {
        await saveTaskStatus(taskKey, status);
        const task = state.tasks.find((item) => item.key === taskKey);
        if (task) {
          task.status = status;
        }
        if (state.route.name === "estimates") {
          render();
          return;
        }
        const sortCellEl = select.closest("td[data-sort-value]");
        if (sortCellEl) {
          sortCellEl.dataset.sortValue = String(statusRank);
        }
        const row = select.closest("tr");
        if (row) {
          row.classList.toggle("summary-row--deferred", status === "deferred");
        }
      } catch (error) {
        if (previous) {
          select.value = previous;
          syncPillControlChrome(
            select,
            `pill pill--status pill--${previous}`,
          );
          const sortCellEl = select.closest("td[data-sort-value]");
          if (sortCellEl) {
            const previousRank =
              STATUS_SORT_RANK[previous] ?? STATUS_OPTIONS.length;
            sortCellEl.dataset.sortValue = String(previousRank);
          }
          const row = select.closest("tr");
          if (row) {
            row.classList.toggle(
              "summary-row--deferred",
              previous === "deferred",
            );
          }
        }
        window.alert(error.message || "Could not save status.");
      } finally {
        select.disabled = false;
      }
    });
  });

  main.querySelectorAll("[data-task-phase]").forEach((select) => {
    select.addEventListener("change", async () => {
      const taskKey = select.dataset.taskPhase;
      const sprint = Number(select.value);
      const task = state.tasks.find((item) => item.key === taskKey);
      const previousSprint = task?.sprint;
      const previousId = task?.id;
      syncPillControlChrome(
        select,
        "pill pill--phase",
        phaseStyleAttr(sprint),
      );
      select.disabled = true;
      try {
        const result = await saveTaskPhase(taskKey, sprint);
        const byKey = new Map(
          (result.tasks || []).map((row) => [row.key, row]),
        );
        for (const item of state.tasks) {
          const next = byKey.get(item.key);
          if (!next) {
            continue;
          }
          item.id = next.id;
          item.sprint = next.sprint;
        }
        const sortCellEl = select.closest("td[data-sort-value]");
        if (sortCellEl) {
          sortCellEl.dataset.sortValue = String(sprint);
        }
        // Detail breadcrumb / Estimate need a full redraw when ids move.
        if (state.route.name === "task" || state.route.name === "estimates") {
          render();
        } else if (state.route.name === "responses") {
          render();
        }
      } catch (error) {
        if (previousSprint != null) {
          select.value = String(previousSprint);
          syncPillControlChrome(
            select,
            "pill pill--phase",
            phaseStyleAttr(previousSprint),
          );
          const sortCellEl = select.closest("td[data-sort-value]");
          if (sortCellEl) {
            sortCellEl.dataset.sortValue = String(previousSprint);
          }
          if (task && previousId) {
            task.sprint = previousSprint;
            task.id = previousId;
          }
        }
        window.alert(error.message || "Could not save phase.");
      } finally {
        select.disabled = false;
      }
    });
  });

  bindTaskTags();

  const reorderBtn = main.querySelector("[data-phases-reorder]");
  if (reorderBtn) {
    reorderBtn.addEventListener("click", () => {
      if (state.phaseReorderMode) {
        state.phaseReorderMode = false;
        render();
        return;
      }
      state.phaseReorderMode = true;
      history.replaceState(null, "", overviewHref([]));
      state.route = parseRoute();
      render();
    });
  }

  const phasesOpenAll = main.querySelector("[data-phases-open-all]");
  const phasesCloseAll = main.querySelector("[data-phases-close-all]");
  if (phasesOpenAll) {
    phasesOpenAll.addEventListener("click", () => {
      main.querySelectorAll("details[data-phase-id]").forEach((item) => {
        item.open = true;
      });
      syncOverviewPhaseUrl();
    });
  }
  if (phasesCloseAll) {
    phasesCloseAll.addEventListener("click", () => {
      main.querySelectorAll("details[data-phase-id]").forEach((item) => {
        item.open = false;
      });
      syncOverviewPhaseUrl();
    });
  }

  const evidenceOpenAll = main.querySelector("[data-evidence-open-all]");
  const evidenceCloseAll = main.querySelector("[data-evidence-close-all]");
  if (evidenceOpenAll) {
    evidenceOpenAll.addEventListener("click", () => {
      main.querySelectorAll("details[data-evidence-group]").forEach((item) => {
        item.open = true;
      });
      primeVideoThumbs();
    });
  }
  if (evidenceCloseAll) {
    evidenceCloseAll.addEventListener("click", () => {
      main.querySelectorAll("details[data-evidence-group]").forEach((item) => {
        item.open = false;
      });
    });
  }

  main.querySelectorAll("details[data-phase-id]").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (state.phaseReorderMode) {
        item.open = false;
        return;
      }
      syncOverviewPhaseUrl();
      if (item.open) {
        primeVideoThumbs(item);
      }
    });
  });

  if (state.phaseReorderMode) {
    bindPhaseReorderDrag();
  }

  bindAuthorModeHandlers({
    state,
    main,
    render,
    isAdmin,
    escapeHtml,
  });

  main.querySelector("[data-task-lock-takeover]")?.addEventListener(
    "click",
    async (event) => {
      const button = event.currentTarget;
      const taskKey = button.dataset.taskLockTakeover;
      if (!taskKey) {
        return;
      }
      button.disabled = true;
      try {
        await takeoverTaskLock(state, taskKey);
        render();
      } catch (error) {
        window.alert(error.message || "Could not take over.");
        button.disabled = false;
      }
    },
  );

  const pendingDecisionScroll = takePendingDecisionScroll();
  if (pendingDecisionScroll) {
    requestAnimationFrame(() => {
      document
        .getElementById(`decision-${pendingDecisionScroll}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  main.querySelectorAll("details[data-evidence-group]").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        primeVideoThumbs(item);
      }
    });
  });

  main.querySelectorAll("details[data-decision-phase]").forEach((item) => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        primeVideoThumbs(item);
      }
    });
  });

  main.querySelectorAll("[data-decision-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const decisionId = form.dataset.decisionForm;
      const data = new FormData(form);
      const choice = data.get(`choice-${decisionId}`);
      if (!choice) {
        return;
      }
      const picker = form.querySelector("[data-author-picker]");
      const author = syncAuthorPicker(picker);
      if (!author) {
        const status = form.querySelector(".save-status");
        status.textContent = COPY.nameRequired;
        status.classList.add("is-visible", "is-error");
        return;
      }
      setAuthor(author, "decision");
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector(".save-status");
      try {
        button.disabled = true;
        const result = await saveDecision(decisionId, {
          choice,
          text: data.get("text"),
          author,
        });
        state.responses.decisions[decisionId] = result;
        status.innerHTML = `${escapeHtml(COPY.youChose)} <strong>${escapeHtml(result.choice)}</strong>, ${escapeHtml(new Date(result.updatedAt).toLocaleString())}`;
        status.classList.add("is-visible");
        status.classList.remove("is-error");
        motion.pulseSaved(button);
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("is-visible", "is-error");
      } finally {
        button.disabled = false;
      }
    });
  });

  primeVideoThumbs();
}

function bindGlobalHandlers() {
  lightbox
    .querySelector("[data-lightbox-close]")
    .addEventListener("click", closeLightbox);

  lightboxPrev.addEventListener("click", () => stepLightbox(-1));
  lightboxNext.addEventListener("click", () => stepLightbox(1));

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!lightbox.open) {
      return;
    }
    if (event.key === "Escape") {
      closeLightbox();
      return;
    }
    if (lightboxGallery.files.length <= 1) {
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepLightbox(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepLightbox(1);
    }
  });
}

async function init() {
  applyTheme();
  applyBrand();
  applyEditModeClass(state.editMode);
  initAuthorMediaPicker();
  bindTaskLockLifecycle(state);
  bindAuthorEditToggle(state, {
    copy: COPY,
    onChange: () => {
      syncAuthorEditToggle(state, COPY);
      render();
    },
  });
  bindGlobalHandlers();
  bindAuthHandlers();

  window
    .matchMedia?.("(prefers-color-scheme: dark)")
    ?.addEventListener?.("change", () => {
      if (getThemePref() === "system") {
        applyTheme("system");
      }
    });

  onRouteChange(() => {
    if (!state.ready) {
      return;
    }
    state.route = normalizeLegacyRoute(parseRoute());
    if (state.route.name === "settings" && !isAdmin()) {
      history.replaceState(null, "", "#/");
      state.route = normalizeLegacyRoute(parseRoute());
    }
    const shouldScrollPhases =
      state.route.name === "overview" &&
      parseOpenPhases(state.route.searchParams).length > 0;
    render();
    if (shouldScrollPhases) {
      scrollToOpenPhase();
    } else if (state.route.name === "task") {
      window.scrollTo(0, 0);
    }
    if (typeof main.focus === "function") {
      try {
        main.focus({ preventScroll: true, focusVisible: false });
      } catch {
        main.focus({ preventScroll: true });
      }
    }
  });

  try {
    const auth = await fetchAuth();
    if (auth.csrf) {
      setCsrfToken(auth.csrf);
    }
    if (!auth.authenticated) {
      clearAuthedSession();
      await waitForSplashHold();
      await showAuthPanel();
      return;
    }
    await afterAuthenticated(auth);
  } catch (error) {
    await waitForSplashHold();
    if (String(error.message || "").includes("not configured")) {
      await showBlockedPanel();
      return;
    }
    await showAuthPanel();
    if (loginStatus) {
      loginStatus.textContent = error.message;
      loginStatus.classList.add("is-visible", "is-error");
    }
  }
}

init();
