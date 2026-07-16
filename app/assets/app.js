import {
  loadContent,
  loadResponses,
  saveComment,
  saveDecision,
  saveIssuePriority,
  saveIssueTags,
  saveSettings,
  loadSettings,
  postCommentReply,
  editCommentMessage,
  fetchAuth,
  login,
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
  issueEstimateHours,
  issueActualHours,
  hoursToCost,
} from "./estimates.js";

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
  settingsLead: "Project name, appearance, and notification teams.",
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
  frequencyImmediate: "Immediate",
  frequencyHourly: "Hourly digest",
  frequencyDaily: "Daily digest",
  saveSettings: "Save settings",
  settingsSaved: "Settings saved.",
  phases: "Phases",
  phase: "Phase",
  screenshots: "Screenshots",
  yourInput: "Your input",
  summary: "Summary",
  viewAll: "View all",
  suggestions: "suggested changes",
  decisionsNeeded: "Questions for you",
  decisionsLead: (n) =>
    `${n} questions need answers before related work can continue.`,
  reviewDecisions: "Answer the questions",
  openAllPhases: "Open all",
  closeAllPhases: "Close all",
  evidenceNoUrl: "No page URL",
  evidenceGroupCount: (n) => `${n} ${n === 1 ? "item" : "items"}`,
  decisionCount: (n) => `${n} ${n === 1 ? "question" : "questions"}`,
  whatWeFound: "Issue Found",
  whatWeSuggest: "Suggested Fix",
  screenshotsHeading: "Screenshots",
  screenshotsGallery: "Screenshots and videos",
  screenshotsLead: "Screenshots and recordings, linked to the issues below.",
  yourFeedback: "Your feedback",
  postingAs: "Posting as",
  conversation: "Conversation",
  conversationLead: "Feedback and replies on this issue.",
  yourReply: "Your reply",
  firstNotePlaceholder: "Add a note (optional)…",
  replyPlaceholder: "Write a reply…",
  sendReply: "Send",
  editMessage: "Edit",
  saveEdit: "Save",
  cancelEdit: "Cancel",
  noMessagesYet: "No messages yet.",
  signIn: "Sign in",
  signOut: "Sign out",
  authLead: "Enter the review password to continue.",
  yourName: "Your name",
  namePlaceholder: "Select a name",
  nameClear: "Clear name",
  nameRequired: "Select your name from the list.",
  nameEmptyList: "Add people under Settings first.",
  doYouAgree: "Do you agree?",
  stanceNone: "No choice",
  agree: "Yes",
  disagree: "No",
  discuss: "Not sure yet",
  commentsOptional: "Comments (optional)",
  noteOptional: "Note (optional)",
  saveFeedback: "Save",
  saveDecision: "Save answer",
  commentOptional: "Comment (optional)",
  decisionsPageTitle: "Questions for you",
  decisionsPageLead: "Your answers determine how the marked items are handled.",
  ourSuggestion: "Suggested approach",
  summaryTitle: "Summary of replies",
  summaryLead:
    "Everything saved so far. You will also see your own answers on each form.",
  noScreenshotsLinked: "No screenshots linked yet.",
  noIssuesLinked: "No issues linked",
  lastSaved: "Saved",
  youChose: "You chose",
  noDecisionsYet: "No answers saved yet.",
  noFeedbackYet: "No feedback saved yet.",
  loadError: "Could not load review data",
  phaseNotFound: "Phase not found.",
  issueNotFound: "Issue not found.",
  previousIssue: "Previous issue",
  nextIssue: "Next issue",
  filterNotFound: "No issues match this filter.",
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
  estimatesDeferredCount: (n) => `${n} ${n === 1 ? "issue" : "issues"}`,
  estimatesDeferredNote: "Not included in totals",
  estimatesNoIssues: "No issues yet.",
  estimatesEstimateHours: "Estimate hours",
  estimatesEstimateCost: "Estimate cost",
  estimatesActualHours: "Actual hours",
  estimatesActualCost: "Actual cost",
  estimatesColId: "Issue",
  estimatesColTitle: "Title",
  estimatesColStatus: "Status",
  estimatesColEstimate: "Estimate",
  estimatesColActual: "Actual",
  estimatesCompletenessEstimate: (set, total) =>
    `Estimate hours set on ${set} of ${total} issues`,
  estimatesCompletenessActual: (set, total) =>
    `Actual hours set on ${set} of ${total} issues`,
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
  blocked: "Waiting on you",
  complete: "Complete",
  deferred: "Deferred",
};

const state = {
  audit: null,
  issues: [],
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
};

function applyHourlyRate(auth) {
  const raw = auth?.hourlyRate;
  state.hourlyRate =
    typeof raw === "number" && Number.isFinite(raw) && raw >= 0 ? raw : null;
}

function clientName() {
  return String(state.settings?.clientName || "").trim();
}

function applyBrand() {
  const name = clientName();
  document.querySelectorAll("[data-brand]").forEach((el) => {
    el.textContent = name;
  });
  const auditTitle = state.audit?.title ? String(state.audit.title).trim() : "";
  if (name && auditTitle) {
    document.title = `${name}: ${auditTitle}`;
  } else if (auditTitle) {
    document.title = auditTitle;
  } else if (name) {
    document.title = name;
  } else {
    document.title = "Review";
  }
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
const loginForm = document.getElementById("login-form");
const loginStatus = document.getElementById("login-status");
const logoutButton = document.getElementById("logout-button");
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

/** Cool hues only (no priority reds). Consecutive phases take opposite ends, then advance inward. */
function phaseColorVars(sprintId) {
  const parsed = Number(sprintId);
  const index = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  // Teal → cyan → azure → blue → indigo → green → sky → violet-blue
  const phaseHues = [165, 195, 225, 255, 140, 210, 240, 280];
  const len = phaseHues.length;
  const slot = (index - 1) % len;
  // 0 → start, 1 → end, 2 → start+1, 3 → end-1, …
  const hueIndex =
    slot % 2 === 0 ? slot / 2 : len - 1 - Math.floor(slot / 2);
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

function issueByKey(key) {
  return state.issues.find((item) => item.key === key);
}

function evidenceByFile(file) {
  return state.evidence.find((item) => item.file === file);
}

function issuesForEvidence(file) {
  const row = evidenceByFile(file);
  if (!row?.issues?.length) {
    return [];
  }
  return row.issues.map(issueByKey).filter(Boolean);
}

function decisionsForIssue(issueKey) {
  return state.decisions.filter((decision) =>
    (decision.blocks || []).includes(issueKey),
  );
}

function sprintIssues(sprintId) {
  return state.issues.filter(
    (item) => String(item.sprint) === String(sprintId),
  );
}

function compareIssueIds(a, b) {
  const [aPhase = 0, aNum = 0] = String(a.id).split(".").map(Number);
  const [bPhase = 0, bNum = 0] = String(b.id).split(".").map(Number);
  if (aPhase !== bPhase) {
    return aPhase - bPhase;
  }
  return aNum - bNum;
}

function issueIdSortRank(issueLike) {
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

function decisionIssueSortRank(decision) {
  const issues = (decision?.blocks || [])
    .map(issueByKey)
    .filter(Boolean)
    .sort(compareIssueIds);
  if (!issues.length) {
    return Number.MAX_SAFE_INTEGER;
  }
  return issueIdSortRank(issues[0]);
}

function orderedSprintIssues(sprintId) {
  return [...sprintIssues(sprintId)].sort(compareIssueIds);
}

function issueNeighbors(issueKey) {
  const issue = issueByKey(issueKey);
  if (!issue) {
    return { prev: null, next: null };
  }

  const phaseIssues = orderedSprintIssues(issue.sprint);
  const index = phaseIssues.findIndex((item) => item.key === issueKey);
  if (index < 0) {
    return { prev: null, next: null };
  }

  return {
    prev: index > 0 ? phaseIssues[index - 1] : null,
    next: index < phaseIssues.length - 1 ? phaseIssues[index + 1] : null,
  };
}

function renderIssueNav(issueKey) {
  const { prev, next } = issueNeighbors(issueKey);
  const prevControl = prev
    ? `<a class="issue-nav__link" href="#/issue/${escapeHtml(prev.key)}" aria-label="${escapeHtml(COPY.previousIssue)}: ${escapeHtml(prev.id)} ${escapeHtml(prev.title)}">${ISSUE_NAV_PREV_ICON}</a>`
    : `<span class="issue-nav__link is-disabled" aria-hidden="true">${ISSUE_NAV_PREV_ICON}</span>`;
  const nextControl = next
    ? `<a class="issue-nav__link" href="#/issue/${escapeHtml(next.key)}" aria-label="${escapeHtml(COPY.nextIssue)}: ${escapeHtml(next.id)} ${escapeHtml(next.title)}">${ISSUE_NAV_NEXT_ICON}</a>`
    : `<span class="issue-nav__link is-disabled" aria-hidden="true">${ISSUE_NAV_NEXT_ICON}</span>`;

  return `<nav class="issue-nav" aria-label="Issues in this phase">${prevControl}${nextControl}</nav>`;
}

function issuesByPriority(priority) {
  return state.issues.filter((item) => item.priority === priority);
}

function issuesByStatus(status) {
  return state.issues.filter((item) => item.status === status);
}

function issuesByTag(tag) {
  const needle = String(tag || "")
    .trim()
    .toLowerCase();
  if (!needle) {
    return [];
  }
  return state.issues.filter((item) =>
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
  return normalizeTagLabel(a).toLowerCase() === normalizeTagLabel(b).toLowerCase();
}

function collectKnownTags() {
  const seen = new Map();
  for (const issue of state.issues) {
    for (const entry of issue.tags || []) {
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

const STANCE_LABELS = {
  agree: "Yes",
  disagree: "No",
  discuss: "Not sure yet",
};

function normalizeCommentClient(row) {
  if (!row || typeof row !== "object") {
    return null;
  }
  const stance = String(row.stance || "").trim();
  const stanceLabel = stance ? STANCE_LABELS[stance] || stance : "";
  const author = String(row.author || "").trim();
  const updatedAt = String(row.updatedAt || "");
  let messages = Array.isArray(row.messages)
    ? row.messages.filter(
        (message) => message && String(message.text || "").trim() !== "",
      )
    : [];

  if (messages.length === 0 && stance) {
    const text = String(row.text || "").trim() || stanceLabel;
    messages = [
      {
        id: `legacy-${stance}-${updatedAt || "opening"}`,
        author: author || "Unknown",
        text,
        createdAt: updatedAt,
        updatedAt,
      },
    ];
  }

  return {
    ...row,
    stance,
    author,
    updatedAt,
    messages,
    text: messages.length
      ? messages[messages.length - 1].text
      : String(row.text || ""),
  };
}

function commentRecord(issueKey) {
  return normalizeCommentClient(state.responses.comments[issueKey]);
}

function commentMessages(issueKey) {
  return commentRecord(issueKey)?.messages || [];
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

function renderStanceFieldset(selected = "", { name = "stance" } = {}) {
  const current = String(selected || "");
  const options = [
    { value: "", label: COPY.stanceNone },
    { value: "agree", label: COPY.agree },
    { value: "disagree", label: COPY.disagree },
    { value: "discuss", label: COPY.discuss },
  ];
  return `
    <fieldset class="stance-fieldset">
      <legend>${escapeHtml(COPY.doYouAgree)}</legend>
      ${options
        .map(
          (opt) =>
            `<label><input type="radio" name="${escapeHtml(name)}" value="${escapeHtml(opt.value)}" ${current === opt.value ? "checked" : ""}> ${escapeHtml(opt.label)}</label>`,
        )
        .join("")}
    </fieldset>`;
}

function noteTextForOpening(message, stanceLabel) {
  const text = String(message?.text || "").trim();
  if (!text) {
    return "";
  }
  if (stanceLabel && text === stanceLabel) {
    return "";
  }
  return text;
}

function buildOpeningEditForm(message, stance) {
  const stanceLabel = stance ? STANCE_LABELS[stance] || stance : "";
  const noteValue = noteTextForOpening(message, stanceLabel);
  return `
    <form class="thread-msg__edit-form" data-edit-form="${escapeHtml(message.id)}" data-edit-opening="true">
      ${renderStanceFieldset(stance || "")}
      <label class="field">
        <span class="field__label">${escapeHtml(COPY.noteOptional)}</span>
        <textarea name="text" rows="2" maxlength="2000" placeholder="${escapeHtml(COPY.firstNotePlaceholder)}">${escapeHtml(noteValue)}</textarea>
      </label>
      <input type="hidden" name="author" value="${escapeHtml(message.author)}">
      <div class="thread-msg__edit-actions">
        <button type="submit" class="button">${escapeHtml(COPY.saveEdit)}</button>
        <button type="button" class="button button--ghost" data-cancel-edit>${escapeHtml(COPY.cancelEdit)}</button>
      </div>
      <p class="save-status" role="status"></p>
    </form>`;
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

function renderThreadMessages(issue) {
  const row = commentRecord(issue.key);
  const messages = row?.messages || [];
  const stanceLabel = row?.stance
    ? STANCE_LABELS[row.stance] || row.stance
    : "";

  if (!messages.length) {
    return "";
  }

  return `
    <div class="thread__list">
      ${messages
        .map((message, index) => {
          const editable = canEditMessage(message, messages);
          const when = message.updatedAt || message.createdAt;
          const isStanceOnly =
            index === 0 &&
            stanceLabel &&
            String(message.text || "").trim() === stanceLabel;
          const stancePill =
            index === 0 && stanceLabel
              ? `<span class="thread-msg__stance">${escapeHtml(stanceLabel)}</span>`
              : "";
          return `
            <article class="thread-msg" data-message-id="${escapeHtml(message.id)}" data-opening="${index === 0 && messages.length === 1 ? "true" : "false"}" data-stance="${escapeHtml(row?.stance || "")}">
              <header class="thread-msg__head">
                <span class="thread-msg__author">${escapeHtml(message.author)}</span>
                ${stancePill}
                <time class="thread-msg__time" datetime="${escapeHtml(when || "")}">${escapeHtml(when ? new Date(when).toLocaleString() : "")}</time>
                ${
                  editable
                    ? `<button type="button" class="thread-msg__edit" data-edit-message="${escapeHtml(message.id)}">${escapeHtml(COPY.editMessage)}</button>`
                    : ""
                }
              </header>
              ${
                isStanceOnly
                  ? ""
                  : `<div class="thread-msg__body" data-message-body>${escapeHtml(message.text)}</div>`
              }
              <div data-edit-slot></div>
            </article>`;
        })
        .join("")}
    </div>`;
}

function renderCommentForm(issue) {
  const saved = commentRecord(issue.key);
  const messages = saved?.messages || [];
  const isFirst = messages.length === 0;

  const stanceBlock = isFirst ? renderStanceFieldset("") : "";

  return `
    <section class="feedback-panel" id="feedback">
      <h2>${escapeHtml(COPY.yourFeedback)}</h2>
      ${renderThreadMessages(issue)}
      <form class="feedback-form" data-comment-form="${escapeHtml(issue.key)}" data-feedback-mode="${isFirst ? "first" : "reply"}">
        ${stanceBlock}
        <div class="feedback-composer">
          ${renderAuthorPicker(getAuthor("comment"), { id: `issue-${issue.key}` })}
          <label class="field">
            <span class="visually-hidden">${escapeHtml(COPY.yourReply)}</span>
            <textarea name="text" rows="2" maxlength="2000" ${isFirst ? "" : "required"} placeholder="${escapeHtml(isFirst ? COPY.firstNotePlaceholder : COPY.replyPlaceholder)}"></textarea>
          </label>
          <div class="feedback-form__actions">
            <button type="submit" class="button">${escapeHtml(isFirst ? COPY.saveFeedback : COPY.sendReply)}</button>
            ${saved ? `<p class="save-status is-visible">${escapeHtml(COPY.lastSaved)} ${escapeHtml(new Date(saved.updatedAt).toLocaleString())}</p>` : '<p class="save-status" role="status"></p>'}
          </div>
        </div>
      </form>
    </section>`;
}

const EDIT_ICON = `<svg class="edit-link__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;

const ISSUE_NAV_PREV_ICON = `<svg class="issue-nav__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;

const ISSUE_NAV_NEXT_ICON = `<svg class="issue-nav__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;

const ACCORDION_OPEN_ALL_ICON = `<svg class="phases-accordion__control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 6 5 5 5-5"/><path d="m7 13 5 5 5-5"/></svg>`;

const ACCORDION_CLOSE_ALL_ICON = `<svg class="phases-accordion__control-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7 11 5-5 5 5"/><path d="m7 18 5-5 5 5"/></svg>`;

function renderAccordionControls({ openAttr, closeAttr }) {
  return `
          <div class="phases-accordion__controls">
            <button type="button" class="phases-accordion__control" ${openAttr} aria-label="${escapeHtml(COPY.openAllPhases)}" title="${escapeHtml(COPY.openAllPhases)}">${ACCORDION_OPEN_ALL_ICON}</button>
            <button type="button" class="phases-accordion__control" ${closeAttr} aria-label="${escapeHtml(COPY.closeAllPhases)}" title="${escapeHtml(COPY.closeAllPhases)}">${ACCORDION_CLOSE_ALL_ICON}</button>
          </div>`;
}

function editorUrl({ tab, issue, file } = {}) {
  const params = new URLSearchParams();
  if (tab) {
    params.set("tab", tab);
  }
  if (issue) {
    params.set("issue", issue);
  }
  if (file) {
    params.set("file", file);
  }
  const query = params.toString();
  return query ? `edit/?${query}` : "edit/";
}

function renderEditLink({ tab, issue, file, label = "Edit", className = "" }) {
  const href = editorUrl({ tab, issue, file });
  const classes = ["edit-link", className].filter(Boolean).join(" ");
  return `<a class="${escapeHtml(classes)}" href="${escapeHtml(href)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${EDIT_ICON}</a>`;
}

function evidenceGalleryAttr(files) {
  if (!files || files.length <= 1) {
    return "";
  }
  return ` data-evidence-gallery="${escapeHtml(files.join(","))}"`;
}

function issueEvidenceFiles(issue) {
  return (issue.evidence || [])
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
  if (isVideoEvidence(row)) {
    return `
      <button type="button" class="evidence-thumb evidence-thumb--video" data-open-evidence="${escapeHtml(file)}"${galleryAttr} title="${escapeHtml(label)}">
        ${renderVideoPreviewMarkup(file, label)}
        <span class="evidence-thumb__play" aria-hidden="true">▶</span>
        ${caption ? `<span class="evidence-thumb__label">${escapeHtml(caption)}</span>` : ""}
      </button>`;
  }
  return `
    <button type="button" class="evidence-thumb" data-open-evidence="${escapeHtml(file)}"${galleryAttr} title="${escapeHtml(label)}">
      <img src="${escapeHtml(mediaUrl(file))}" alt="${escapeHtml(label)}" loading="lazy">
      ${caption ? `<span class="evidence-thumb__label">${escapeHtml(caption)}</span>` : ""}
    </button>`;
}

function renderIssueChips(keys) {
  return keys
    .map((key) => {
      const issue = issueByKey(key);
      if (!issue) {
        return "";
      }
      const phaseId = issue.sprint ?? String(issue.id).split(".")[0];
      return `<a class="chip chip--issue chip--phase" style="${phaseStyleAttr(phaseId)}" href="#/issue/${escapeHtml(issue.key)}">${escapeHtml(issue.id)}</a>`;
    })
    .join("");
}

function renderSummaryItemLabel(keys, title, fallback = "") {
  const chips = keys.length
    ? `<span class="summary-item__chips">${renderIssueChips(keys)}</span>`
    : "";
  const text = escapeHtml(title || fallback);
  return `<div class="summary-item__label">${chips}<span class="summary-item__title">${text}</span></div>`;
}

function renderTagChips(tags = [], { editable = false, issueKey = "" } = {}) {
  return (tags || [])
    .map((tag) => normalizeTagLabel(tag))
    .filter(Boolean)
    .map((tag) => {
      const href = `#/issues/tag/${encodeURIComponent(tag)}`;
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
          data-issue-key="${escapeHtml(issueKey)}"
          aria-label="${escapeHtml(COPY.removeTag(tag))}"
        ><span aria-hidden="true">×</span></button>
      </span>`;
    })
    .join("");
}

function renderPriorityControl(issue, { editable = false } = {}) {
  const priority = String(issue.priority || "");
  if (!editable) {
    return `<a class="pill pill--${escapeHtml(priority)}" href="#/issues/priority/${escapeHtml(priority)}">${escapeHtml(priorityLabel(priority))}</a>`;
  }

  const options = PRIORITY_OPTIONS.map((value) => {
    const selected = value === priority ? " selected" : "";
    return `<option value="${escapeHtml(value)}"${selected}>${escapeHtml(priorityLabel(value))}</option>`;
  }).join("");

  return `
    <label class="priority-control">
      <span class="visually-hidden">Priority</span>
      <select
        class="priority-control__select pill pill--${escapeHtml(priority)}"
        data-issue-priority="${escapeHtml(issue.key)}"
        aria-label="Priority"
      >${options}</select>
    </label>`;
}

function renderMetaRow(issue, { editablePriority = false } = {}) {
  return `
    <div class="meta-row">
      ${renderPhasePill(issue.sprint)}
      ${renderPriorityControl(issue, { editable: editablePriority })}
      <a class="pill pill--status pill--${escapeHtml(issue.status)}" href="#/issues/status/${escapeHtml(issue.status)}">${escapeHtml(statusLabel(issue.status))}</a>
    </div>`;
}

function renderIssueEstimateMetaSegment(prefix, hours) {
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

function renderIssueEstimateMeta(issue) {
  const estimateHours = issueEstimateHours(issue);
  const actualHours = issueActualHours(issue);
  if (estimateHours === null && actualHours === null) {
    return "";
  }
  const segments = [
    estimateHours !== null
      ? renderIssueEstimateMetaSegment("Est", estimateHours)
      : "",
    actualHours !== null
      ? renderIssueEstimateMetaSegment("Actual", actualHours)
      : "",
  ].filter(Boolean);
  return `<div class="issue-estimate-meta">${segments.join("")}</div>`;
}

function renderIssueTags(issue, { editable = false } = {}) {
  const tagsHtml = renderTagChips(issue.tags, {
    editable,
    issueKey: issue.key,
  });
  if (!editable && !tagsHtml) {
    return "";
  }

  const addControl = editable
    ? `<div class="issue-tags__add" data-tag-add-wrap="${escapeHtml(issue.key)}">
        <button
          type="button"
          class="chip chip--tag-add"
          data-tag-add-open
          data-issue-key="${escapeHtml(issue.key)}"
          aria-label="${escapeHtml(COPY.addTag)}"
        ><span aria-hidden="true">+</span></button>
      </div>`
    : "";

  return `<div
    class="chip-row issue-tags${editable ? " issue-tags--editable" : ""}"
    data-issue-tags="${escapeHtml(issue.key)}"
  >${tagsHtml}${addControl}</div>`;
}

function renderIssueCard(issue) {
  const evidenceItems = issue.evidence?.length
    ? issue.evidence
    : state.evidence
        .filter((row) => row.issues?.includes(issue.key))
        .map((row) => ({ file: row.file }));
  const galleryFiles = evidenceItems
    .map((item) => item.file)
    .filter((file) => evidenceByFile(file));

  const issueHref = `#/issue/${escapeHtml(issue.key)}`;
  const phaseStyle = phaseStyleAttr(issue.sprint);

  return `
    <article class="issue-card">
      <div class="issue-card__content">
        <a class="issue-card__link" href="${issueHref}">
          <div class="issue-card__head">
            <span class="issue-card__id pill pill--phase" style="${phaseStyle}">${escapeHtml(issue.id)}</span>
            <h2 class="issue-card__title">${escapeHtml(issue.title)}</h2>
          </div>
        </a>
        ${renderMetaRow(issue)}
        ${renderIssueEstimateMeta(issue)}
        <a class="issue-card__link issue-card__link--summary" href="${issueHref}">
          <p class="issue-card__summary">${escapeHtml(issue.problem?.trim().split("\n")[0] || "")}</p>
        </a>
        ${renderIssueTags(issue)}
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
    issues: state.issues.length,
    decisions: state.decisions.length,
  };
}

function renderPhasesAccordion(openPhaseIds) {
  const openSet = new Set(openPhaseIds.map(String));
  const groups = state.audit.sprints
    .map((sprint) => {
      const issues = sprintIssues(sprint.id);
      const isOpen = openSet.has(String(sprint.id));
      return `
        <details class="phases-accordion__item" data-phase-id="${escapeHtml(String(sprint.id))}" style="${phaseStyleAttr(sprint.id)}"${isOpen ? " open" : ""}>
          <summary class="phases-accordion__summary">
            <span class="phases-accordion__heading">
              <span class="phases-accordion__title">${renderPhasePill(sprint.id, { linked: false })}<span class="phases-accordion__title-text">${escapeHtml(sprint.title)}</span></span>
              <span class="phases-accordion__subtitle">${escapeHtml(sprint.subtitle)}</span>
              <p class="phases-accordion__desc">${escapeHtml(sprint.description.trim())}</p>
            </span>
            <span class="phases-accordion__meta">${issues.length} ${COPY.suggestions}</span>
            <span class="phases-accordion__chevron" aria-hidden="true">›</span>
          </summary>
          <div class="phases-accordion__panel">
            <div class="issue-list">${issues.map(renderIssueCard).join("")}</div>
          </div>
        </details>`;
    })
    .join("");

  return `
      <section class="section">
        <div class="section__head">
          <h2>${escapeHtml(COPY.phases)}</h2>
          ${renderAccordionControls({
            openAttr: "data-phases-open-all",
            closeAttr: "data-phases-close-all",
          })}
        </div>
        <div class="phases-accordion">${groups}</div>
      </section>`;
}

function renderOverview() {
  const openPhases = parseOpenPhases(state.route.searchParams);
  const stats = overviewStats();
  const pendingDecisions = stats.decisions;

  return `
    <div class="page page--overview">
      <header class="page-header page-header--split">
        <div class="page-header__intro">
          <h1>${escapeHtml(state.audit.title)}</h1>
          <p class="lede">${escapeHtml(state.audit.summary.trim())}</p>
        </div>
        <ul class="stat-list page-header__stats">
          <li><strong>${stats.screenshots}</strong> screenshots</li>
          <li><strong>${stats.recordings}</strong> recordings</li>
          <li><strong>${stats.issues}</strong> issues</li>
          <li><strong>${pendingDecisions}</strong> questions</li>
        </ul>
      </header>
      ${renderPhasesAccordion(openPhases)}
      <section class="section section--callout">
        <h2>${escapeHtml(COPY.decisionsNeeded)}</h2>
        <p>${escapeHtml(COPY.decisionsLead(pendingDecisions))}</p>
        <a class="button" href="#/decisions">${escapeHtml(COPY.reviewDecisions)}</a>
      </section>
    </div>`;
}

function renderFilteredIssues(kind, value) {
  let issues = [];
  let title = "";
  if (kind === "priority") {
    issues = issuesByPriority(value);
    title = COPY.priorityFilterTitle(priorityLabel(value));
  } else if (kind === "status") {
    issues = issuesByStatus(value);
    title = COPY.statusFilterTitle(statusLabel(value));
  } else if (kind === "tag") {
    issues = issuesByTag(value);
    title = COPY.tagFilterTitle(value);
  } else {
    title = COPY.filterNotFound;
  }

  return `
    <div class="page">
      <header class="page-header">
        <p class="breadcrumb"><a href="#/">${escapeHtml(COPY.overview)}</a></p>
        <h1>${escapeHtml(title)}</h1>
        <p class="lede">${issues.length} ${COPY.suggestions}</p>
      </header>
      <div class="issue-list">${issues.map(renderIssueCard).join("") || `<p>${escapeHtml(COPY.filterNotFound)}</p>`}</div>
    </div>`;
}

function renderIssueDetail(issueKey) {
  const issue = issueByKey(issueKey);
  if (!issue) {
    return `<div class="page"><p>${escapeHtml(COPY.issueNotFound)}</p></div>`;
  }

  const galleryFiles = issueEvidenceFiles(issue);
  const galleryAttr = evidenceGalleryAttr(galleryFiles);

  const evidenceHtml = (issue.evidence || [])
    .map((item) => {
      const row = evidenceByFile(item.file);
      const alt = issue.title || item.file;
      const issueKeys = row?.issues?.length
        ? row.issues
        : issuesForEvidence(item.file).map((linked) => linked.key);
      const chipsHtml = issueKeys.length
        ? `<div class="chip-row media-block__chips">${renderIssueChips(issueKeys)}</div>`
        : "";
      const pageLink = renderEvidencePageLink(row, "media-block__page-link");
      const footerParts = [pageLink, chipsHtml].filter(Boolean).join("");
      const footerHtml = footerParts
        ? `<figcaption>${footerParts}</figcaption>`
        : "";
      const editLink = renderEditLink({
        tab: "evidence",
        file: item.file,
        label: `Edit screenshot ${item.file}`,
        className: "edit-link--overlay",
      });
      if (isVideoEvidence(row)) {
        return `
          <figure class="media-block">
            ${editLink}
            <button type="button" class="media-block__image media-block__image--video" data-open-evidence="${escapeHtml(item.file)}"${galleryAttr}>
              ${renderVideoPreviewMarkup(item.file, alt)}
              <span class="media-block__play" aria-hidden="true">▶</span>
            </button>
            ${footerHtml}
          </figure>`;
      }
      return `
        <figure class="media-block">
          ${editLink}
          <button type="button" class="media-block__image" data-open-evidence="${escapeHtml(item.file)}"${galleryAttr}>
            <img src="${escapeHtml(mediaUrl(item.file))}" alt="${escapeHtml(alt)}" loading="lazy">
          </button>
          ${footerHtml}
        </figure>`;
    })
    .join("");

  const linkedDecisionsHtml = decisionsForIssue(issueKey)
    .map((decision) => renderDecisionCard(decision))
    .join("");

  return `
    <div class="page page--split">
      <div class="page__primary">
        <header class="page-header">
          <div class="page-header__top">
            <p class="breadcrumb">${renderPhasePill(issue.sprint)} <span class="breadcrumb__sep" aria-hidden="true">/</span> <span class="pill pill--phase" style="${phaseStyleAttr(issue.sprint)}">${escapeHtml(issue.id)}</span></p>
            ${renderIssueNav(issueKey)}
          </div>
          <div class="page-header__row">
            <h1>${escapeHtml(issue.title)}</h1>
            ${renderEditLink({ tab: "issues", issue: issue.key, label: `Edit issue ${issue.id}` })}
          </div>
          ${renderMetaRow(issue, { editablePriority: true })}
          ${renderIssueEstimateMeta(issue)}
        </header>
        <section class="prose">
          <h2>${escapeHtml(COPY.whatWeFound)}</h2>
          <p>${escapeHtml(issue.problem?.trim() || "")}</p>
          <h2>${escapeHtml(COPY.whatWeSuggest)}</h2>
          <p>${escapeHtml(issue.recommendation?.trim() || "")}</p>
          ${renderIssueTags(issue, { editable: true })}
        </section>
        ${linkedDecisionsHtml ? `<section class="issue-decisions">${linkedDecisionsHtml}</section>` : ""}
        ${renderCommentForm(issue)}
      </div>
      <aside class="page__aside">
        <h2>${escapeHtml(COPY.screenshotsHeading)}</h2>
        <div class="evidence-stack">${evidenceHtml || `<p>${escapeHtml(COPY.noScreenshotsLinked)}</p>`}</div>
      </aside>
    </div>`;
}

function renderGalleryCard(row, { galleryFiles = null } = {}) {
  const files = galleryFiles || [row.file];
  const chips = renderIssueChips(row.issues || []);
  const thumb = renderEvidenceThumb(row.file, files, { captionMode: "url" });
  const editLink = renderEditLink({
    tab: "evidence",
    file: row.file,
    label: `Edit screenshot ${row.file}`,
  });

  return `
    <article class="gallery-card">
      ${thumb}
      <div class="gallery-card__body">
        <div class="gallery-card__head">
          <h2>${escapeHtml(row.page || row.file)}</h2>
          ${editLink}
        </div>
        <div class="chip-row">${chips || `<span class="muted">${escapeHtml(COPY.noIssuesLinked)}</span>`}</div>
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
            ${renderEditLink({
              tab: "evidence",
              file: filterFile,
              label: `Edit screenshot ${filterFile}`,
            })}
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
          ${renderAccordionControls({
            openAttr: "data-evidence-open-all",
            closeAttr: "data-evidence-close-all",
          })}
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

function groupDecisionsByPhase() {
  return (state.audit?.sprints || [])
    .map((sprint) => {
      const decisions = state.decisions.filter((decision) =>
        (decision.blocks || []).some((key) => {
          const issue = issueByKey(key);
          return issue && String(issue.sprint) === String(sprint.id);
        }),
      );
      return { sprint, decisions };
    })
    .filter((group) => group.decisions.length > 0);
}

function renderDecisionCard(decision) {
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
        ${(decision.blocks || []).length ? `<div class="meta-row decision-card__blocks">${renderIssueChips(decision.blocks)}</div>` : ""}
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

function renderDecisions() {
  const groups = groupDecisionsByPhase();
  const accordion = groups
    .map(({ sprint, decisions }) => {
      return `
        <details class="phases-accordion__item decisions-accordion__item" data-decision-phase="${escapeHtml(String(sprint.id))}" style="${phaseStyleAttr(sprint.id)}">
          <summary class="phases-accordion__summary">
            <span class="phases-accordion__heading">
              <span class="phases-accordion__title">${renderPhasePill(sprint.id, { linked: false })}<span class="phases-accordion__title-text">${escapeHtml(sprint.title)}</span></span>
              <span class="phases-accordion__subtitle">${escapeHtml(sprint.subtitle)}</span>
            </span>
            <span class="phases-accordion__meta">${escapeHtml(COPY.decisionCount(decisions.length))}</span>
            <span class="phases-accordion__chevron" aria-hidden="true">›</span>
          </summary>
          <div class="phases-accordion__panel">
            <div class="issue-list">${decisions.map(renderDecisionCard).join("")}</div>
          </div>
        </details>`;
    })
    .join("");

  return `
    <div class="page page--decisions">
      <header class="page-header">
        <div class="page-header__row">
          <h1>${escapeHtml(COPY.decisionsPageTitle)}</h1>
          ${renderAccordionControls({
            openAttr: "data-decisions-open-all",
            closeAttr: "data-decisions-close-all",
          })}
        </div>
        <p class="lede">${escapeHtml(COPY.decisionsPageLead)}</p>
      </header>
      <div class="phases-accordion decisions-accordion">${accordion}</div>
    </div>`;
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
  const decisionRows = Object.entries(state.responses.decisions)
    .map(([id, row]) => {
      const decision = state.decisions.find((d) => d.key === id);
      return { id, row, decision, rank: decisionIssueSortRank(decision) };
    })
    .sort((a, b) => a.rank - b.rank)
    .map(({ id, row, decision }) => {
      const label = renderSummaryItemLabel(
        decision?.blocks || [],
        decision?.title,
        id,
      );
      const author = String(row.author || "").trim();
      const updatedAt = Number(new Date(row.updatedAt)) || 0;
      return `<tr>
        ${sortCell(decisionIssueSortRank(decision), label)}
        <td><strong>${escapeHtml(row.choice)}</strong></td>
        ${sortCell(author.toLowerCase(), escapeHtml(author))}
        <td>${escapeHtml(row.text || "")}</td>
        ${sortCell(updatedAt, escapeHtml(new Date(row.updatedAt).toLocaleString()))}
      </tr>`;
    })
    .join("");

  const commentRows = Object.entries(state.responses.comments)
    .map(([key, row]) => {
      const issue = issueByKey(key);
      return { key, row, issue, rank: issueIdSortRank(issue) };
    })
    .sort((a, b) => a.rank - b.rank)
    .map(({ key, row, issue }) => {
      const normalized = normalizeCommentClient(row) || row;
      const stance = STANCE_LABELS[normalized.stance] || normalized.stance;
      const label = renderSummaryItemLabel(
        issue ? [key] : [],
        issue?.title,
        key,
      );
      const commentCell = renderCommentSummaryCell(normalized);
      const author = String(
        normalized.messages?.[0]?.author || normalized.author || "",
      ).trim();
      const priority = String(issue?.priority || "");
      const priorityRank =
        PRIORITY_SORT_RANK[priority] ?? PRIORITY_OPTIONS.length;
      const priorityCell = issue
        ? renderPriorityControl(issue, { editable: true })
        : "";
      const updatedAt = Number(new Date(normalized.updatedAt)) || 0;
      return `<tr>
        ${sortCell(issueIdSortRank(issue), label)}
        ${sortCell(priorityRank, priorityCell)}
        ${sortCell(String(stance).toLowerCase(), `<strong>${escapeHtml(stance)}</strong>`)}
        ${sortCell(author.toLowerCase(), escapeHtml(author))}
        <td>${commentCell}</td>
        ${sortCell(updatedAt, escapeHtml(new Date(normalized.updatedAt).toLocaleString()))}
      </tr>`;
    })
    .join("");

  return `
    <div class="page">
      <header class="page-header">
        <h1>${escapeHtml(COPY.summaryTitle)}</h1>
        <p class="lede">${escapeHtml(COPY.summaryLead)}</p>
      </header>
      <section class="section">
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
      </section>
      <section class="section">
        <h2>Feedback on issues</h2>
        <div class="table-wrap">
          <table class="summary-table summary-table--feedback" data-sortable>
            <thead>
              <tr>
                ${renderSortableTh("issue", "Issue", "ascending")}
                ${renderSortableTh("priority", "Priority")}
                ${renderSortableTh("reply", "Reply")}
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

function frequencyOptions(selected = "immediate") {
  const current = ["immediate", "hourly", "daily"].includes(selected)
    ? selected
    : "immediate";
  return `
    <option value="immediate"${current === "immediate" ? " selected" : ""}>${escapeHtml(COPY.frequencyImmediate)}</option>
    <option value="hourly"${current === "hourly" ? " selected" : ""}>${escapeHtml(COPY.frequencyHourly)}</option>
    <option value="daily"${current === "daily" ? " selected" : ""}>${escapeHtml(COPY.frequencyDaily)}</option>`;
}

function renderTeamMemberRow(teamKey, member = {}, { showRemove = true } = {}) {
  const frequency = member.frequency || "immediate";
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
  return `
    <div class="settings-member" data-member-row>
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
      : [{ name: "", email: "", frequency: "immediate" }];
  return `
    <fieldset class="settings-fieldset" data-team="${escapeHtml(teamKey)}">
      <legend>${escapeHtml(teamKey === "client" ? COPY.clientTeam : COPY.developerTeam)}</legend>
      <div class="settings-members" data-members="${escapeHtml(teamKey)}">
        ${members
          .map((member, index) =>
            renderTeamMemberRow(teamKey, member, { showRemove: index > 0 }),
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
  const names = [
    ...form.querySelectorAll(`input[name="${teamKey}-name[]"]`),
  ].map((el) => el.value.trim());
  const emails = [
    ...form.querySelectorAll(`input[name="${teamKey}-email[]"]`),
  ].map((el) => el.value.trim());
  const frequencies = [
    ...form.querySelectorAll(`select[name="${teamKey}-frequency[]"]`),
  ].map((el) => el.value);
  const members = [];
  const count = Math.max(names.length, emails.length, frequencies.length);
  for (let i = 0; i < count; i++) {
    const name = names[i] || "";
    const email = emails[i] || "";
    const frequency = frequencies[i] || "immediate";
    if (!name || !email) {
      continue;
    }
    members.push({ name, email, frequency });
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
          { name: "", email: "", frequency: "immediate" },
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
      if (!row || row === list.querySelector("[data-member-row]")) {
        return;
      }
      row.remove();
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
        <section class="section settings-section">
          <h2>Project</h2>
          <label class="field">
            <span class="field__label">${escapeHtml(COPY.clientName)}</span>
            <input type="text" name="clientName" maxlength="120" value="${escapeHtml(settings.clientName || "")}">
          </label>
        </section>
        <section class="section settings-section">
          <h2>${escapeHtml(COPY.appearance)}</h2>
          <fieldset class="settings-theme">
            <legend class="visually-hidden">${escapeHtml(COPY.appearance)}</legend>
            <label class="settings-theme__option"><input type="radio" name="theme" value="light"${theme === "light" ? " checked" : ""}> ${escapeHtml(COPY.themeLight)}</label>
            <label class="settings-theme__option"><input type="radio" name="theme" value="dark"${theme === "dark" ? " checked" : ""}> ${escapeHtml(COPY.themeDark)}</label>
            <label class="settings-theme__option"><input type="radio" name="theme" value="system"${theme === "system" ? " checked" : ""}> ${escapeHtml(COPY.themeSystem)}</label>
          </fieldset>
        </section>
        <section class="section settings-section">
          <h2>${escapeHtml(COPY.notifications)}</h2>
          <label class="settings-check">
            <input type="checkbox" name="notifyEnabled"${settings.notifyEnabled ? " checked" : ""}>
            <span>${escapeHtml(COPY.notifyEnabled)}</span>
          </label>
          ${renderTeamFields("client", settings.teams?.client)}
          ${renderTeamFields("developer", settings.teams?.developer)}
        </section>
        <div class="feedback-form__actions">
          <button type="submit" class="button">${escapeHtml(COPY.saveSettings)}</button>
          <p class="save-status" role="status"></p>
        </div>
      </form>
    </div>`;
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

function renderEstimatesIssueRow(issue) {
  const estimateHours = issueEstimateHours(issue);
  const actualHours = issueActualHours(issue);
  const estimateCost = hoursToCost(estimateHours, state.hourlyRate);
  const actualCost = hoursToCost(actualHours, state.hourlyRate);

  return `<tr>
    <td><a href="#/issue/${escapeHtml(issue.key)}">${escapeHtml(issue.id)}</a></td>
    <td>${escapeHtml(issue.title)}</td>
    <td>${escapeHtml(statusLabel(issue.status))}</td>
    <td>${renderEstimatesHoursCostCell(estimateHours, estimateCost)}</td>
    <td>${renderEstimatesHoursCostCell(actualHours, actualCost)}</td>
  </tr>`;
}

function renderEstimatesPhaseSection(phase) {
  const title = phase.sprint?.title
    ? String(phase.sprint.title).trim()
    : phasePillLabel(phase.sprintId);
  const issueRows = phase.issues.map(renderEstimatesIssueRow).join("");

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

function renderEstimatesPage() {
  if (!state.issues.length) {
    return `
      <div class="page page--estimates">
        <header class="page-header">
          <h1>${escapeHtml(COPY.estimates)}</h1>
        </header>
        <p>${escapeHtml(COPY.estimatesNoIssues)}</p>
      </div>`;
  }

  const summary = summarizeEstimates(state.issues, state.hourlyRate);
  const phases = summarizeEstimatesByPhase(
    state.issues,
    state.audit?.sprints || [],
    state.hourlyRate,
  ).filter((phase) => phase.issues.length > 0);
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
        <h1>${escapeHtml(COPY.estimates)}</h1>
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
    case "issue":
      return renderIssueDetail(params.issueKey);
    case "issues-by-priority":
      return renderFilteredIssues("priority", params.priority);
    case "issues-by-status":
      return renderFilteredIssues("status", params.status);
    case "issues-by-tag":
      return renderFilteredIssues("tag", params.tag);
    case "evidence":
      return renderEvidenceGallery();
    case "evidence-item":
      return renderEvidenceGallery(params.file);
    case "decisions":
      return renderDecisions();
    case "estimates":
      return renderEstimatesPage();
    case "responses":
      return renderResponses();
    case "settings":
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

function render() {
  if (!state.ready) {
    return;
  }
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
  siteHeader.hidden = true;
  main.hidden = true;
  state.ready = false;
}

async function showBlockedPanel() {
  await endBoot();
  document.body.classList.add("is-locked");
  authPanel.hidden = true;
  authBlocked.hidden = false;
  siteHeader.hidden = true;
  main.hidden = true;
  state.ready = false;
}

async function showAppShell() {
  await endBoot();
  document.body.classList.remove("is-locked");
  authPanel.hidden = true;
  authBlocked.hidden = true;
  siteHeader.hidden = false;
  main.hidden = false;
}

async function loadAppData() {
  const content = await loadContent();
  state.audit = content.audit;
  state.issues = content.issues;
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

function bindAuthHandlers() {
  loginForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(loginForm);
    const status = loginStatus;
    try {
      status.textContent = "Signing in…";
      status.classList.add("is-visible");
      status.classList.remove("is-error");
      const loginAuth = await login(
        String(data.get("password") || ""),
        String(data.get("website") || ""),
      );
      applyHourlyRate(loginAuth);
      markAuthedSession();
      skipBootSplash();
      loginForm.reset();
      await loadAppData();
      await showAppShell();
      state.route = normalizeLegacyRoute(parseRoute());
      render();
    } catch (error) {
      status.textContent = error.message;
      status.classList.add("is-visible", "is-error");
    }
  });

  logoutButton?.addEventListener("click", async () => {
    try {
      await logout();
    } catch {
      /* still lock UI */
    }
    clearAuthedSession();
    await showAuthPanel();
    main.innerHTML = "";
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

function refreshIssueTagsRow(issueKey) {
  const issue = issueByKey(issueKey);
  const row = main.querySelector(`[data-issue-tags="${CSS.escape(issueKey)}"]`);
  if (!issue || !row) {
    return;
  }
  const html = renderIssueTags(issue, { editable: true });
  const template = document.createElement("template");
  template.innerHTML = html.trim();
  const next = template.content.firstElementChild;
  if (!next) {
    return;
  }
  row.replaceWith(next);
  bindIssueTagsRow(next);
}

async function persistIssueTags(issueKey, nextTags, { rollbackTags } = {}) {
  const issue = issueByKey(issueKey);
  const row = main.querySelector(`[data-issue-tags="${CSS.escape(issueKey)}"]`);
  if (!issue) {
    return;
  }
  const previous = Array.isArray(rollbackTags)
    ? [...rollbackTags]
    : [...(issue.tags || [])];
  issue.tags = [...nextTags];
  if (row) {
    row.setAttribute("aria-busy", "true");
    row.querySelectorAll("button, input").forEach((el) => {
      el.disabled = true;
    });
  }
  try {
    const result = await saveIssueTags(issueKey, nextTags);
    issue.tags = Array.isArray(result.tags) ? result.tags : [...nextTags];
    refreshIssueTagsRow(issueKey);
  } catch (error) {
    issue.tags = previous;
    refreshIssueTagsRow(issueKey);
    window.alert(error.message || "Could not save tags.");
  }
}

function closeTagCombobox(wrap) {
  const issueKey = wrap?.dataset?.tagAddWrap;
  if (!wrap || !issueKey) {
    return;
  }
  wrap.innerHTML = `<button
    type="button"
    class="chip chip--tag-add"
    data-tag-add-open
    data-issue-key="${escapeHtml(issueKey)}"
    aria-label="${escapeHtml(COPY.addTag)}"
  ><span aria-hidden="true">+</span></button>`;
  const button = wrap.querySelector("[data-tag-add-open]");
  button?.addEventListener("click", () => openTagCombobox(wrap));
}

function openTagCombobox(wrap) {
  const issueKey = wrap.dataset.tagAddWrap;
  const issue = issueByKey(issueKey);
  if (!issue) {
    return;
  }

  const listId = `tag-list-${issueKey}`;
  wrap.innerHTML = `
    <div class="combobox combobox--tag" data-tag-picker>
      <label class="visually-hidden" for="tag-input-${escapeHtml(issueKey)}">${escapeHtml(COPY.addTag)}</label>
      <div class="combobox__control">
        <input
          type="text"
          id="tag-input-${escapeHtml(issueKey)}"
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
    const current = (issue.tags || []).map(normalizeTagLabel).filter(Boolean);
    if (current.some((entry) => tagsMatch(entry, tag))) {
      closeTagCombobox(wrap);
      return;
    }
    const next = [...current, tag];
    await persistIssueTags(issueKey, next, { rollbackTags: current });
  };

  const renderOptions = () => {
    const query = normalizeTagLabel(input.value);
    const catalog = collectKnownTags();
    const current = issue.tags || [];
    const items = [];

    for (const tag of catalog) {
      if (query && !tag.toLowerCase().includes(query.toLowerCase())) {
        continue;
      }
      const onIssue = current.some((entry) => tagsMatch(entry, tag));
      items.push({
        value: tag,
        label: tag,
        create: false,
        disabled: onIssue,
      });
    }

    const exactInCatalog = Boolean(query) && catalog.some((tag) => tagsMatch(tag, query));
    const exactOnIssue =
      Boolean(query) && current.some((tag) => tagsMatch(tag, query));

    if (query && !exactInCatalog && !exactOnIssue) {
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
      ? items.findIndex((item) => !item.disabled && !item.create && tagsMatch(item.value, query))
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

function bindIssueTagsRow(row) {
  if (!row) {
    return;
  }
  const issueKey = row.dataset.issueTags;
  row.querySelectorAll("[data-tag-remove]").forEach((button) => {
    button.addEventListener("click", async () => {
      const issue = issueByKey(issueKey);
      if (!issue) {
        return;
      }
      const removeTag = button.dataset.tag || "";
      const previous = (issue.tags || []).map(normalizeTagLabel).filter(Boolean);
      const next = previous.filter((tag) => !tagsMatch(tag, removeTag));
      await persistIssueTags(issueKey, next, { rollbackTags: previous });
    });
  });

  const wrap = row.querySelector("[data-tag-add-wrap]");
  const openButton = wrap?.querySelector("[data-tag-add-open]");
  openButton?.addEventListener("click", () => openTagCombobox(wrap));
}

function bindIssueTags(root = main) {
  root.querySelectorAll("[data-issue-tags]").forEach((row) => {
    bindIssueTagsRow(row);
  });
}

function bindPageHandlers() {
  bindSortableTables();

  main.querySelectorAll("[data-open-evidence]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const gallery = parseEvidenceGallery(btn);
      openLightbox(btn.dataset.openEvidence, gallery);
    });
  });

  main.querySelectorAll("[data-comment-form]").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const issueId = form.dataset.commentForm;
      const mode = form.dataset.feedbackMode || "first";
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
        let result;
        if (mode === "reply") {
          result = await postCommentReply(issueId, {
            text: data.get("text"),
            author,
          });
        } else {
          result = await saveComment(issueId, {
            stance: data.get("stance"),
            text: data.get("text"),
            author,
          });
        }
        state.responses.comments[issueId] =
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
        text: body?.textContent || article.dataset.stanceLabel || "",
      };
      const stance = article.dataset.stance || "";
      const stanceLabel = stance ? STANCE_LABELS[stance] || stance : "";
      if (!body && stanceLabel) {
        message.text = stanceLabel;
      }
      const isOpening = article.dataset.opening === "true";
      slot.innerHTML = isOpening
        ? buildOpeningEditForm(message, stance)
        : buildReplyEditForm({
            ...message,
            text: body?.textContent || message.text,
          });
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
      const issueId = commentForm?.dataset.commentForm;
      if (!issueId) {
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
      if (form.dataset.editOpening === "true") {
        payload.stance = data.has("stance")
          ? String(data.get("stance") || "")
          : "";
      }
      try {
        button.disabled = true;
        const result = await editCommentMessage(issueId, payload);
        if (result.cleared) {
          delete state.responses.comments[issueId];
        } else {
          state.responses.comments[issueId] =
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
    bindTeamMemberRepeaters(settingsForm);
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

  main.querySelectorAll("[data-issue-priority]").forEach((select) => {
    select.addEventListener("change", async () => {
      const issueKey = select.dataset.issuePriority;
      const priority = select.value;
      const previous = state.issues.find(
        (item) => item.key === issueKey,
      )?.priority;
      const priorityRank =
        PRIORITY_SORT_RANK[priority] ?? PRIORITY_OPTIONS.length;
      select.className = `priority-control__select pill pill--${priority}`;
      select.disabled = true;
      try {
        await saveIssuePriority(issueKey, priority);
        const issue = state.issues.find((item) => item.key === issueKey);
        if (issue) {
          issue.priority = priority;
        }
        const sortCell = select.closest("td[data-sort-value]");
        if (sortCell) {
          sortCell.dataset.sortValue = String(priorityRank);
        }
      } catch (error) {
        if (previous) {
          select.value = previous;
          select.className = `priority-control__select pill pill--${previous}`;
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

  bindIssueTags();

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

  const decisionsOpenAll = main.querySelector("[data-decisions-open-all]");
  const decisionsCloseAll = main.querySelector("[data-decisions-close-all]");
  if (decisionsOpenAll) {
    decisionsOpenAll.addEventListener("click", () => {
      main.querySelectorAll("details[data-decision-phase]").forEach((item) => {
        item.open = true;
      });
      primeVideoThumbs();
    });
  }
  if (decisionsCloseAll) {
    decisionsCloseAll.addEventListener("click", () => {
      main.querySelectorAll("details[data-decision-phase]").forEach((item) => {
        item.open = false;
      });
    });
  }

  main.querySelectorAll("details[data-phase-id]").forEach((item) => {
    item.addEventListener("toggle", () => {
      syncOverviewPhaseUrl();
      if (item.open) {
        primeVideoThumbs(item);
      }
    });
  });

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
  document.title = "Review";
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
    const shouldScrollPhases =
      state.route.name === "overview" &&
      parseOpenPhases(state.route.searchParams).length > 0;
    render();
    if (shouldScrollPhases) {
      scrollToOpenPhase();
    } else if (state.route.name === "issue") {
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
    applyHourlyRate(auth);
    markAuthedSession();
    skipBootSplash();
    await loadAppData();
    await showAppShell();
    render();
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
