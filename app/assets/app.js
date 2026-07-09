import {
  loadContent,
  loadResponses,
  saveComment,
  saveDecision,
  mediaUrl,
} from "./api.js";
import { parseRoute, onRouteChange } from "./router.js";
import { motion } from "./motion.js";

const AUTHOR_KEYS = {
  comment: "or-audit-author-comment",
  decision: "or-audit-author-decision",
};

const COPY = {
  brand: "OR Books",
  overview: "Overview",
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
  yourName: "Your name",
  doYouAgree: "Do you agree?",
  agree: "Yes",
  disagree: "No",
  discuss: "Not sure yet",
  commentsOptional: "Comments (optional)",
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
  urgencyFilterTitle: (label) => `Urgency: ${label}`,
  statusFilterTitle: (label) => `Status: ${label}`,
};

const IMPACT_LABELS = {
  critical: "Most urgent",
  high: "Important",
  medium: "Moderate",
  low: "Minor",
};

const STATUS_LABELS = {
  planned: "Planned",
  in_progress: "In progress",
  blocked: "Waiting on you",
  complete: "Complete",
};

const state = {
  audit: null,
  issues: [],
  evidence: [],
  decisions: [],
  responses: { comments: {}, decisions: {} },
  route: parseRoute(),
};

const main = document.getElementById("main");
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

function impactLabel(impact) {
  return IMPACT_LABELS[impact] || impact;
}

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
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

function issuesByImpact(impact) {
  return state.issues.filter((item) => item.impact === impact);
}

function issuesByStatus(status) {
  return state.issues.filter((item) => item.status === status);
}

function getAuthor(kind) {
  const key = AUTHOR_KEYS[kind];
  if (!key) {
    return "";
  }
  return localStorage.getItem(key) || "";
}

function setAuthor(name, kind) {
  const key = AUTHOR_KEYS[kind];
  if (!key) {
    return;
  }
  const trimmed = name.trim();
  if (!trimmed) {
    return;
  }
  localStorage.setItem(key, trimmed);
}

const EDIT_ICON = `<svg class="edit-link__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;

const ISSUE_NAV_PREV_ICON = `<svg class="issue-nav__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;

const ISSUE_NAV_NEXT_ICON = `<svg class="issue-nav__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`;

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
    captionMode === "page"
      ? row.page || ""
      : evidenceThumbCaption(row);
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
      return `<a class="chip chip--issue" href="#/issue/${escapeHtml(issue.key)}">${escapeHtml(issue.id)}</a>`;
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

function renderMetaRow(issue) {
  return `
    <div class="meta-row">
      <a class="pill pill--${escapeHtml(issue.impact)}" href="#/issues/impact/${escapeHtml(issue.impact)}">${escapeHtml(impactLabel(issue.impact))}</a>
      <a class="pill pill--status pill--${escapeHtml(issue.status)}" href="#/issues/status/${escapeHtml(issue.status)}">${escapeHtml(statusLabel(issue.status))}</a>
    </div>`;
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

  return `
    <article class="issue-card">
      <div class="issue-card__content">
        <a class="issue-card__link" href="${issueHref}">
          <div class="issue-card__head">
            <span class="issue-card__id">${escapeHtml(issue.id)}</span>
            <h2 class="issue-card__title">${escapeHtml(issue.title)}</h2>
          </div>
        </a>
        ${renderMetaRow(issue)}
        <a class="issue-card__link issue-card__link--summary" href="${issueHref}">
          <p class="issue-card__summary">${escapeHtml(issue.problem?.trim().split("\n")[0] || "")}</p>
        </a>
      </div>
      ${evidenceItems.length ? `<div class="issue-card__evidence">${evidenceItems.map((e) => renderEvidenceThumb(e.file, galleryFiles)).join("")}</div>` : ""}
    </article>`;
}

function parseOpenPhases(searchParams) {
  const raw = String(searchParams?.get("phases") || "").trim();
  if (!raw) {
    return [];
  }
  return [...new Set(raw.split(",").map((part) => part.trim()).filter(Boolean))];
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
        <details class="phases-accordion__item" data-phase-id="${escapeHtml(String(sprint.id))}"${isOpen ? " open" : ""}>
          <summary class="phases-accordion__summary">
            <span class="phases-accordion__heading">
              <span class="phases-accordion__title">${escapeHtml(COPY.phase)} ${sprint.id}: ${escapeHtml(sprint.title)}</span>
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
          <div class="phases-accordion__controls">
            <button type="button" class="phases-accordion__control" data-phases-open-all>${escapeHtml(COPY.openAllPhases)}</button>
            <span class="phases-accordion__control-sep" aria-hidden="true">·</span>
            <button type="button" class="phases-accordion__control" data-phases-close-all>${escapeHtml(COPY.closeAllPhases)}</button>
          </div>
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
  const issues =
    kind === "impact" ? issuesByImpact(value) : issuesByStatus(value);
  const label = kind === "impact" ? impactLabel(value) : statusLabel(value);
  const title =
    kind === "impact"
      ? COPY.urgencyFilterTitle(label)
      : COPY.statusFilterTitle(label);

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

function renderCommentForm(issue) {
  const saved = state.responses.comments[issue.key];
  return `
    <section class="feedback-panel" id="feedback">
      <h2>${escapeHtml(COPY.yourFeedback)}</h2>
      <form class="feedback-form" data-comment-form="${escapeHtml(issue.key)}">
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.yourName)}</span>
          <input type="text" name="author" value="${escapeHtml(saved?.author || getAuthor("comment"))}" required maxlength="80">
        </label>
        <fieldset class="stance-fieldset">
          <legend>${escapeHtml(COPY.doYouAgree)}</legend>
          <label><input type="radio" name="stance" value="agree" ${saved?.stance === "agree" ? "checked" : ""} required> ${escapeHtml(COPY.agree)}</label>
          <label><input type="radio" name="stance" value="disagree" ${saved?.stance === "disagree" ? "checked" : ""}> ${escapeHtml(COPY.disagree)}</label>
          <label><input type="radio" name="stance" value="discuss" ${saved?.stance === "discuss" ? "checked" : ""}> ${escapeHtml(COPY.discuss)}</label>
        </fieldset>
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.commentsOptional)}</span>
          <textarea name="text" rows="3" maxlength="2000">${escapeHtml(saved?.text || "")}</textarea>
        </label>
        <button type="submit" class="button">${escapeHtml(COPY.saveFeedback)}</button>
        ${saved ? `<p class="save-status is-visible">${escapeHtml(COPY.lastSaved)} ${escapeHtml(new Date(saved.updatedAt).toLocaleString())}</p>` : '<p class="save-status" role="status"></p>'}
      </form>
    </section>`;
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
      const footerHtml = footerParts ? `<figcaption>${footerParts}</figcaption>` : "";
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
            <p class="breadcrumb"><a href="${overviewHref([issue.sprint])}">${escapeHtml(COPY.phase)} ${issue.sprint}</a> / ${escapeHtml(issue.id)}</p>
            ${renderIssueNav(issueKey)}
          </div>
          <div class="page-header__row">
            <h1>${escapeHtml(issue.title)}</h1>
            ${renderEditLink({ tab: "issues", issue: issue.key, label: `Edit issue ${issue.id}` })}
          </div>
          ${renderMetaRow(issue)}
        </header>
        <section class="prose">
          <h2>${escapeHtml(COPY.whatWeFound)}</h2>
          <p>${escapeHtml(issue.problem?.trim() || "")}</p>
          <h2>${escapeHtml(COPY.whatWeSuggest)}</h2>
          <p>${escapeHtml(issue.recommendation?.trim() || "")}</p>
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
          <div class="phases-accordion__controls">
            <button type="button" class="phases-accordion__control" data-evidence-open-all>${escapeHtml(COPY.openAllPhases)}</button>
            <span class="phases-accordion__control-sep" aria-hidden="true">·</span>
            <button type="button" class="phases-accordion__control" data-evidence-close-all>${escapeHtml(COPY.closeAllPhases)}</button>
          </div>
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
        <form class="decision-form" data-decision-form="${escapeHtml(decisionKey)}">
          <fieldset class="decision-options">
            <legend class="visually-hidden">${escapeHtml(decision.question)}</legend>
            ${options}
          </fieldset>
          <label class="field">
            <span class="field__label">${escapeHtml(COPY.yourName)}</span>
            <input type="text" name="author" value="${escapeHtml(saved?.author || getAuthor("decision"))}" required maxlength="80">
          </label>
          <label class="field">
            <span class="field__label">${escapeHtml(COPY.commentOptional)}</span>
            <textarea name="text" rows="2" maxlength="2000">${escapeHtml(saved?.text || "")}</textarea>
          </label>
          <button type="submit" class="button">${escapeHtml(COPY.saveDecision)}</button>
          ${saved ? `<p class="save-status is-visible">${escapeHtml(COPY.youChose)} <strong>${escapeHtml(saved.choice)}</strong>, ${escapeHtml(new Date(saved.updatedAt).toLocaleString())}</p>` : '<p class="save-status" role="status"></p>'}
        </form>
      </div>
      ${evidenceHtml}
    </article>`;
}

function renderDecisions() {
  const groups = groupDecisionsByPhase();
  const accordion = groups
    .map(({ sprint, decisions }) => {
      return `
        <details class="phases-accordion__item decisions-accordion__item" data-decision-phase="${escapeHtml(String(sprint.id))}">
          <summary class="phases-accordion__summary">
            <span class="phases-accordion__heading">
              <span class="phases-accordion__title">${escapeHtml(COPY.phase)} ${sprint.id}: ${escapeHtml(sprint.title)}</span>
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
          <div class="phases-accordion__controls">
            <button type="button" class="phases-accordion__control" data-decisions-open-all>${escapeHtml(COPY.openAllPhases)}</button>
            <span class="phases-accordion__control-sep" aria-hidden="true">·</span>
            <button type="button" class="phases-accordion__control" data-decisions-close-all>${escapeHtml(COPY.closeAllPhases)}</button>
          </div>
        </div>
        <p class="lede">${escapeHtml(COPY.decisionsPageLead)}</p>
      </header>
      <div class="phases-accordion decisions-accordion">${accordion}</div>
    </div>`;
}

function renderResponses() {
  const decisionRows = Object.entries(state.responses.decisions)
    .map(([id, row]) => {
      const decision = state.decisions.find((d) => d.key === id);
      const label = renderSummaryItemLabel(
        decision?.blocks || [],
        decision?.title,
        id,
      );
      return `<tr><td>${label}</td><td><strong>${escapeHtml(row.choice)}</strong></td><td>${escapeHtml(row.author || "")}</td><td>${escapeHtml(row.text || "")}</td><td>${escapeHtml(new Date(row.updatedAt).toLocaleString())}</td></tr>`;
    })
    .join("");

  const STANCE_LABELS = {
    agree: "Yes",
    disagree: "No",
    discuss: "Not sure yet",
  };

  const commentRows = Object.entries(state.responses.comments)
    .map(([key, row]) => {
      const issue = issueByKey(key);
      const stance = STANCE_LABELS[row.stance] || row.stance;
      const label = renderSummaryItemLabel(
        issue ? [key] : [],
        issue?.title,
        key,
      );
      return `<tr><td>${label}</td><td>${escapeHtml(stance)}</td><td>${escapeHtml(row.text || "")}</td><td>${escapeHtml(row.author || "")}</td><td>${escapeHtml(new Date(row.updatedAt).toLocaleString())}</td></tr>`;
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
          <table>
            <thead><tr><th>Question</th><th>Answer</th><th>Name</th><th>Comment</th><th>Date</th></tr></thead>
            <tbody>${decisionRows || `<tr><td colspan="5">${escapeHtml(COPY.noDecisionsYet)}</td></tr>`}</tbody>
          </table>
        </div>
      </section>
      <section class="section">
        <h2>Feedback on issues</h2>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Issue</th><th>Reply</th><th>Comment</th><th>Name</th><th>Date</th></tr></thead>
            <tbody>${commentRows || `<tr><td colspan="5">${escapeHtml(COPY.noFeedbackYet)}</td></tr>`}</tbody>
          </table>
        </div>
      </section>
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
    case "issues-by-impact":
      return renderFilteredIssues("impact", params.impact);
    case "issues-by-status":
      return renderFilteredIssues("status", params.status);
    case "evidence":
      return renderEvidenceGallery();
    case "evidence-item":
      return renderEvidenceGallery(params.file);
    case "decisions":
      return renderDecisions();
    case "responses":
      return renderResponses();
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
  motion.viewTransition(() => {
    main.innerHTML = renderRoute();
    updateActiveNav();
    bindPageHandlers();
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
  root.querySelectorAll(".evidence-thumb--video video, .media-block__image--video video").forEach((video) => {
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

function bindPageHandlers() {
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
      const data = new FormData(form);
      const author = String(data.get("author") || "");
      setAuthor(author, "comment");
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector(".save-status");
      try {
        button.disabled = true;
        const result = await saveComment(issueId, {
          stance: data.get("stance"),
          text: data.get("text"),
          author,
        });
        state.responses.comments[issueId] = result;
        status.textContent = `${COPY.lastSaved} ${new Date(result.updatedAt).toLocaleString()}`;
        status.classList.add("is-visible");
        motion.pulseSaved(button);
      } catch (error) {
        status.textContent = error.message;
        status.classList.add("is-visible", "is-error");
      } finally {
        button.disabled = false;
      }
    });
  });

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
      const author = String(data.get("author") || "");
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
  document.title = COPY.brand;
  bindGlobalHandlers();

  try {
    const content = await loadContent();
    state.audit = content.audit;
    state.issues = content.issues;
    state.evidence = content.evidence;
    state.decisions = content.decisions;
    state.responses = await loadResponses();
  } catch (error) {
    main.innerHTML = `<div class="page"><h1>${escapeHtml(COPY.loadError)}</h1><p>${escapeHtml(error.message)}</p></div>`;
    return;
  }

  onRouteChange(() => {
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
}

init();
