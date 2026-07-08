import { loadContent, loadResponses, saveComment, saveDecision, mediaUrl } from './api.js';
import { parseRoute, onRouteChange } from './router.js';
import { motion } from './motion.js';

const AUTHOR_KEY = 'or-audit-author';

const COPY = {
  brand: 'OR Books · Mobile Review',
  overview: 'Overview',
  phases: 'Phases',
  phase: 'Phase',
  screenshots: 'Screenshots',
  yourInput: 'Your input',
  summary: 'Summary',
  viewAll: 'View all',
  suggestions: 'suggested changes',
  decisionsNeeded: 'Questions for you',
  decisionsLead: (n) =>
    `${n} questions need answers before related work can continue.`,
  reviewDecisions: 'Answer the questions',
  allPhases: 'All phases',
  openPhase: 'Open phase',
  whatWeFound: 'Issue Found',
  whatWeSuggest: 'Suggested Fix',
  screenshotsHeading: 'Screenshots',
  screenshotsGallery: 'Screenshots and videos',
  screenshotsLead: 'Screenshots and recordings, linked to the issues below.',
  yourFeedback: 'Your feedback',
  yourName: 'Your name',
  doYouAgree: 'Do you agree?',
  agree: 'Yes',
  disagree: 'No',
  discuss: 'Not sure yet',
  commentsOptional: 'Comments (optional)',
  saveFeedback: 'Save',
  saveDecision: 'Save answer',
  commentOptional: 'Comment (optional)',
  decisionsPageTitle: 'Questions for you',
  decisionsPageLead: 'Your answers determine how the marked items are handled.',
  ourSuggestion: 'Suggested approach',
  summaryTitle: 'Summary of replies',
  summaryLead: 'Everything saved so far. You will also see your own answers on each form.',
  noScreenshotsLinked: 'No screenshots linked yet.',
  noIssuesLinked: 'No issues linked',
  lastSaved: 'Saved',
  youChose: 'You chose',
  noDecisionsYet: 'No answers saved yet.',
  noFeedbackYet: 'No feedback saved yet.',
  loadError: 'Could not load review data',
  phaseNotFound: 'Phase not found.',
  issueNotFound: 'Issue not found.',
};

const IMPACT_LABELS = {
  critical: 'Most urgent',
  high: 'Important',
  medium: 'Moderate',
  low: 'Minor',
};

const STATUS_LABELS = {
  planned: 'Planned',
  blocked: 'Waiting on you',
  complete: 'Complete',
};

const state = {
  audit: null,
  issues: [],
  evidence: [],
  decisions: [],
  responses: { comments: {}, decisions: {} },
  route: parseRoute(),
};

const main = document.getElementById('main');
const lightbox = document.getElementById('lightbox');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxBody = document.getElementById('lightbox-body');
const lightboxFooter = document.getElementById('lightbox-footer');
const lightboxPrev = lightbox.querySelector('[data-lightbox-prev]');
const lightboxNext = lightbox.querySelector('[data-lightbox-next]');

const lightboxGallery = {
  files: [],
  index: -1,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
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

function sprintIssues(sprintId) {
  return state.issues.filter((item) => String(item.sprint) === String(sprintId));
}

function getAuthor() {
  return localStorage.getItem(AUTHOR_KEY) || '';
}

function setAuthor(name) {
  localStorage.setItem(AUTHOR_KEY, name.trim());
}

const EDIT_ICON = `<svg class="edit-link__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>`;

function editorUrl({ tab, issue, file } = {}) {
  const params = new URLSearchParams();
  if (tab) {
    params.set('tab', tab);
  }
  if (issue) {
    params.set('issue', issue);
  }
  if (file) {
    params.set('file', file);
  }
  const query = params.toString();
  return query ? `edit/?${query}` : 'edit/';
}

function renderEditLink({ tab, issue, file, label = 'Edit', className = '' }) {
  const href = editorUrl({ tab, issue, file });
  const classes = ['edit-link', className].filter(Boolean).join(' ');
  return `<a class="${escapeHtml(classes)}" href="${escapeHtml(href)}" aria-label="${escapeHtml(label)}" title="${escapeHtml(label)}">${EDIT_ICON}</a>`;
}

function evidenceGalleryAttr(files) {
  if (!files || files.length <= 1) {
    return '';
  }
  return ` data-evidence-gallery="${escapeHtml(files.join(','))}"`;
}

function issueEvidenceFiles(issue) {
  return (issue.evidence || [])
    .map((item) => item.file)
    .filter((file) => evidenceByFile(file));
}

function renderEvidenceThumb(file, galleryFiles = null) {
  const row = evidenceByFile(file);
  if (!row) {
    return '';
  }
  const galleryAttr = evidenceGalleryAttr(galleryFiles);
  const label = row.page || file;
  if (row.type === 'video') {
    const poster = row.poster ? mediaUrl(row.poster) : '';
    return `
      <button type="button" class="evidence-thumb evidence-thumb--video" data-open-evidence="${escapeHtml(file)}"${galleryAttr} title="${escapeHtml(label)}">
        ${poster ? `<img src="${escapeHtml(poster)}" alt="" loading="lazy">` : '<span class="evidence-thumb__placeholder"></span>'}
        <span class="evidence-thumb__play" aria-hidden="true">▶</span>
        <span class="evidence-thumb__label">${escapeHtml(file.replace(/\.(png|mp4)$/, ''))}</span>
      </button>`;
  }
  return `
    <button type="button" class="evidence-thumb" data-open-evidence="${escapeHtml(file)}"${galleryAttr} title="${escapeHtml(label)}">
      <img src="${escapeHtml(mediaUrl(file))}" alt="${escapeHtml(label)}" loading="lazy">
      <span class="evidence-thumb__label">${escapeHtml(file.replace('.png', ''))}</span>
    </button>`;
}

function renderIssueChips(keys) {
  return keys
    .map((key) => {
      const issue = issueByKey(key);
      if (!issue) {
        return '';
      }
      return `<a class="chip chip--issue" href="#/issue/${escapeHtml(issue.key)}">${escapeHtml(issue.id)}</a>`;
    })
    .join('');
}

function renderMetaRow(issue) {
  return `
    <div class="meta-row">
      <span class="pill pill--${escapeHtml(issue.impact)}">${escapeHtml(impactLabel(issue.impact))}</span>
      <span class="pill pill--status pill--${escapeHtml(issue.status)}">${escapeHtml(statusLabel(issue.status))}</span>
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

  return `
    <article class="issue-card">
      <a class="issue-card__link" href="#/issue/${escapeHtml(issue.key)}">
        <div class="issue-card__head">
          <span class="issue-card__id">${escapeHtml(issue.id)}</span>
          <h2 class="issue-card__title">${escapeHtml(issue.title)}</h2>
        </div>
        ${renderMetaRow(issue)}
        <p class="issue-card__summary">${escapeHtml(issue.problem?.trim().split('\n')[0] || '')}</p>
      </a>
      ${evidenceItems.length ? `<div class="issue-card__evidence">${evidenceItems.map((e) => renderEvidenceThumb(e.file, galleryFiles)).join('')}</div>` : ''}
    </article>`;
}

function overviewStats() {
  return {
    screenshots: state.evidence.filter(
      (row) => row.type !== 'video' && !String(row.file || '').endsWith('.mp4')
    ).length,
    recordings: state.evidence.filter(
      (row) => row.type === 'video' || String(row.file || '').endsWith('.mp4')
    ).length,
    issues: state.issues.length,
    decisions: state.decisions.length,
  };
}

function renderOverview() {
  const sprintCards = state.audit.sprints
    .map((sprint) => {
      const count = sprintIssues(sprint.id).length;
      return `
        <a class="sprint-card" href="#/sprint/${sprint.id}">
          <h2>${escapeHtml(COPY.phase)} ${sprint.id}</h2>
          <p class="sprint-card__subtitle">${escapeHtml(sprint.title)}</p>
          <p class="sprint-card__count">${count} ${COPY.suggestions}</p>
          <p class="sprint-card__desc">${escapeHtml(sprint.description.trim())}</p>
        </a>`;
    })
    .join('');

  const stats = overviewStats();
  const pendingDecisions = stats.decisions;

  return `
    <div class="page page--overview">
      <header class="page-header">
        <h1>${escapeHtml(state.audit.title)}</h1>
        <p class="lede">${escapeHtml(state.audit.summary.trim())}</p>
        <ul class="stat-list">
          <li><strong>${stats.screenshots}</strong> screenshots</li>
          <li><strong>${stats.recordings}</strong> recordings</li>
          <li><strong>${stats.issues}</strong> issues</li>
          <li><strong>${pendingDecisions}</strong> questions</li>
        </ul>
      </header>
      <section class="section">
        <div class="section__head">
          <h2>${escapeHtml(COPY.phases)}</h2>
          <a href="#/sprints">${escapeHtml(COPY.viewAll)}</a>
        </div>
        <div class="sprint-grid">${sprintCards}</div>
      </section>
      <section class="section section--callout">
        <h2>${escapeHtml(COPY.decisionsNeeded)}</h2>
        <p>${escapeHtml(COPY.decisionsLead(pendingDecisions))}</p>
        <a class="button" href="#/decisions">${escapeHtml(COPY.reviewDecisions)}</a>
      </section>
    </div>`;
}

function renderSprintsIndex() {
  const groups = state.audit.sprints
    .map((sprint) => {
      const issues = sprintIssues(sprint.id);
      return `
        <section class="section">
          <header class="section__head">
            <div>
              <h2>${escapeHtml(COPY.phase)} ${sprint.id}: ${escapeHtml(sprint.title)}</h2>
              <p class="section__subtitle">${escapeHtml(sprint.subtitle)}</p>
            </div>
            <a href="#/sprint/${sprint.id}">${escapeHtml(COPY.openPhase)}</a>
          </header>
          <div class="issue-list">${issues.map(renderIssueCard).join('')}</div>
        </section>`;
    })
    .join('');

  return `<div class="page"><header class="page-header"><h1>${escapeHtml(COPY.allPhases)}</h1></header>${groups}</div>`;
}

function renderSprint(sprintId) {
  const sprint = state.audit.sprints.find((s) => String(s.id) === String(sprintId));
  const issues = sprintIssues(sprintId);
  if (!sprint) {
    return `<div class="page"><p>${escapeHtml(COPY.phaseNotFound)}</p></div>`;
  }

  return `
    <div class="page">
      <header class="page-header">
        <p class="breadcrumb"><a href="#/sprints">${escapeHtml(COPY.phases)}</a> / ${escapeHtml(COPY.phase)} ${sprint.id}</p>
        <h1>${escapeHtml(COPY.phase)} ${sprint.id}: ${escapeHtml(sprint.title)}</h1>
        <p class="lede">${escapeHtml(sprint.description.trim())}</p>
      </header>
      <div class="issue-list">${issues.map(renderIssueCard).join('')}</div>
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
          <input type="text" name="author" value="${escapeHtml(saved?.author || getAuthor())}" required maxlength="80">
        </label>
        <fieldset class="stance-fieldset">
          <legend>${escapeHtml(COPY.doYouAgree)}</legend>
          <label><input type="radio" name="stance" value="agree" ${saved?.stance === 'agree' ? 'checked' : ''} required> ${escapeHtml(COPY.agree)}</label>
          <label><input type="radio" name="stance" value="disagree" ${saved?.stance === 'disagree' ? 'checked' : ''}> ${escapeHtml(COPY.disagree)}</label>
          <label><input type="radio" name="stance" value="discuss" ${saved?.stance === 'discuss' ? 'checked' : ''}> ${escapeHtml(COPY.discuss)}</label>
        </fieldset>
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.commentsOptional)}</span>
          <textarea name="text" rows="3" maxlength="2000">${escapeHtml(saved?.text || '')}</textarea>
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
      const issueKeys = row?.issues?.length ? row.issues : issuesForEvidence(item.file).map((linked) => linked.key);
      const chipsHtml = issueKeys.length
        ? `<div class="chip-row media-block__chips">${renderIssueChips(issueKeys)}</div>`
        : '';
      const footerHtml = chipsHtml ? `<figcaption>${chipsHtml}</figcaption>` : '';
      const editLink = renderEditLink({
        tab: 'evidence',
        file: item.file,
        label: `Edit screenshot ${item.file}`,
        className: 'edit-link--overlay',
      });
      if (row?.type === 'video') {
        return `
          <figure class="media-block">
            ${editLink}
            <video controls preload="metadata" ${row.poster ? `poster="${escapeHtml(mediaUrl(row.poster))}"` : ''} src="${escapeHtml(mediaUrl(item.file))}"></video>
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
    .join('');

  return `
    <div class="page page--split">
      <div class="page__primary">
        <header class="page-header">
          <p class="breadcrumb"><a href="#/sprint/${issue.sprint}">${escapeHtml(COPY.phase)} ${issue.sprint}</a> / ${escapeHtml(issue.id)}</p>
          <div class="page-header__row">
            <h1>${escapeHtml(issue.title)}</h1>
            ${renderEditLink({ tab: 'issues', issue: issue.key, label: `Edit issue ${issue.id}` })}
          </div>
          ${renderMetaRow(issue)}
        </header>
        <section class="prose">
          <h2>${escapeHtml(COPY.whatWeFound)}</h2>
          <p>${escapeHtml(issue.problem?.trim() || '')}</p>
          <h2>${escapeHtml(COPY.whatWeSuggest)}</h2>
          <p>${escapeHtml(issue.recommendation?.trim() || '')}</p>
        </section>
        ${renderCommentForm(issue)}
      </div>
      <aside class="page__aside">
        <h2>${escapeHtml(COPY.screenshotsHeading)}</h2>
        <div class="evidence-stack">${evidenceHtml || `<p>${escapeHtml(COPY.noScreenshotsLinked)}</p>`}</div>
      </aside>
    </div>`;
}

function renderEvidenceGallery(filterFile = null) {
  const items = filterFile
    ? state.evidence.filter((e) => e.file === filterFile)
    : state.evidence;

  const grid = items
    .map((row) => {
      const chips = renderIssueChips(row.issues || []);
      const thumb = renderEvidenceThumb(row.file);
      const editLink = renderEditLink({
        tab: 'evidence',
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
    })
    .join('');

  const headerEdit = filterFile
    ? renderEditLink({
        tab: 'evidence',
        file: filterFile,
        label: `Edit screenshot ${filterFile}`,
      })
    : '';

  return `
    <div class="page">
      <header class="page-header">
        <div class="page-header__row">
          <h1>${escapeHtml(COPY.screenshotsGallery)}</h1>
          ${headerEdit}
        </div>
        <p class="lede">${escapeHtml(COPY.screenshotsLead)}</p>
      </header>
      <div class="gallery-grid">${grid}</div>
    </div>`;
}

function renderDecisionCard(decision) {
  const saved = state.responses.decisions[decision.id];
  const options = decision.options
    .map((opt) => {
      const thumbs = (opt.evidence || []).map((e) => renderEvidenceThumb(e.file)).join('');
      return `
        <label class="decision-option">
          <input type="radio" name="choice-${escapeHtml(decision.id)}" value="${escapeHtml(opt.value)}" ${saved?.choice === opt.value ? 'checked' : ''}>
          <div class="decision-option__body">
            <strong>${escapeHtml(opt.label)}</strong>
            ${opt.description ? `<p>${escapeHtml(opt.description)}</p>` : ''}
            ${thumbs ? `<div class="decision-option__evidence">${thumbs}</div>` : ''}
          </div>
        </label>`;
    })
    .join('');

  return `
    <article class="decision-card" id="decision-${escapeHtml(decision.id)}">
      <header>
        <h2>${escapeHtml(decision.title)}</h2>
      </header>
      <p>${escapeHtml(decision.question)}</p>
      ${decision.recommendation ? `<p class="decision-card__rec"><strong>${escapeHtml(COPY.ourSuggestion)}:</strong> ${escapeHtml(decision.recommendation.trim())}</p>` : ''}
      <form class="decision-form" data-decision-form="${escapeHtml(decision.id)}">
        <fieldset>
          <legend class="visually-hidden">${escapeHtml(decision.question)}</legend>
          ${options}
        </fieldset>
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.yourName)}</span>
          <input type="text" name="author" value="${escapeHtml(saved?.author || getAuthor())}" required maxlength="80">
        </label>
        <label class="field">
          <span class="field__label">${escapeHtml(COPY.commentOptional)}</span>
          <textarea name="text" rows="2" maxlength="2000">${escapeHtml(saved?.text || '')}</textarea>
        </label>
        <button type="submit" class="button">${escapeHtml(COPY.saveDecision)}</button>
        ${saved ? `<p class="save-status is-visible">${escapeHtml(COPY.youChose)} <strong>${escapeHtml(saved.choice)}</strong>, ${escapeHtml(new Date(saved.updatedAt).toLocaleString())}</p>` : '<p class="save-status" role="status"></p>'}
      </form>
    </article>`;
}

function renderDecisions() {
  return `
    <div class="page">
      <header class="page-header">
        <h1>${escapeHtml(COPY.decisionsPageTitle)}</h1>
        <p class="lede">${escapeHtml(COPY.decisionsPageLead)}</p>
      </header>
      <div class="decision-list">${state.decisions.map(renderDecisionCard).join('')}</div>
    </div>`;
}

function renderResponses() {
  const decisionRows = Object.entries(state.responses.decisions)
    .map(([id, row]) => {
      const decision = state.decisions.find((d) => d.id === id);
      return `<tr><td>${escapeHtml(decision?.title || id)}</td><td><strong>${escapeHtml(row.choice)}</strong></td><td>${escapeHtml(row.author || '')}</td><td>${escapeHtml(row.text || '')}</td><td>${escapeHtml(new Date(row.updatedAt).toLocaleString())}</td></tr>`;
    })
    .join('');

  const STANCE_LABELS = { agree: 'Yes', disagree: 'No', discuss: 'Not sure yet' };

  const commentRows = Object.entries(state.responses.comments)
    .map(([key, row]) => {
      const issue = issueByKey(key);
      const stance = STANCE_LABELS[row.stance] || row.stance;
      const label = issue ? `${issue.id}: ${issue.title}` : key;
      return `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(stance)}</td><td>${escapeHtml(row.text || '')}</td><td>${escapeHtml(row.author || '')}</td><td>${escapeHtml(new Date(row.updatedAt).toLocaleString())}</td></tr>`;
    })
    .join('');

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
    case 'overview':
      return renderOverview();
    case 'sprints':
      return renderSprintsIndex();
    case 'sprint':
      return renderSprint(params.sprintId);
    case 'issue':
      return renderIssueDetail(params.issueKey);
    case 'evidence':
      return renderEvidenceGallery();
    case 'evidence-item':
      return renderEvidenceGallery(params.file);
    case 'decisions':
      return renderDecisions();
    case 'responses':
      return renderResponses();
    default:
      return renderOverview();
  }
}

function updateActiveNav() {
  const path = state.route.path;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    const href = link.getAttribute('href')?.replace('#', '') || '/';
    const active =
      href === path ||
      (href === '/' && (path === '/' || path === '/overview')) ||
      (href !== '/' && path.startsWith(href));
    link.classList.toggle('is-active', active);
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
    .split(',')
    .map((file) => file.trim())
    .filter((file) => evidenceByFile(file));
}

function resetLightboxGallery() {
  lightboxGallery.files = [];
  lightboxGallery.index = -1;
}

function updateLightboxNav() {
  const hasGallery = lightboxGallery.files.length > 1;
  lightboxPrev.hidden = !hasGallery;
  lightboxNext.hidden = !hasGallery;
  if (!hasGallery) {
    return;
  }
  lightboxPrev.disabled = lightboxGallery.index <= 0;
  lightboxNext.disabled = lightboxGallery.index >= lightboxGallery.files.length - 1;
}

function renderLightboxFile(file) {
  const row = evidenceByFile(file);
  if (!row) {
    return false;
  }
  lightboxTitle.textContent = row.page || file;
  if (row.type === 'video') {
    lightboxBody.innerHTML = `<video controls autoplay src="${escapeHtml(mediaUrl(file))}" ${row.poster ? `poster="${escapeHtml(mediaUrl(row.poster))}"` : ''}></video>`;
  } else {
    lightboxBody.innerHTML = `<img src="${escapeHtml(mediaUrl(file))}" alt="${escapeHtml(row.page || file)}">`;
  }
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
  lightboxFooter.innerHTML = '';
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
  lightboxBody.innerHTML = '';
  resetLightboxGallery();
  updateLightboxNav();
}

function bindPageHandlers() {
  main.querySelectorAll('[data-open-evidence]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const gallery = parseEvidenceGallery(btn);
      openLightbox(btn.dataset.openEvidence, gallery);
    });
  });

  main.querySelectorAll('[data-comment-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const issueId = form.dataset.commentForm;
      const data = new FormData(form);
      const author = String(data.get('author') || '');
      setAuthor(author);
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('.save-status');
      try {
        button.disabled = true;
        const result = await saveComment(issueId, {
          stance: data.get('stance'),
          text: data.get('text'),
          author,
        });
        state.responses.comments[issueId] = result;
        status.textContent = `${COPY.lastSaved} ${new Date(result.updatedAt).toLocaleString()}`;
        status.classList.add('is-visible');
        motion.pulseSaved(button);
      } catch (error) {
        status.textContent = error.message;
        status.classList.add('is-visible', 'is-error');
      } finally {
        button.disabled = false;
      }
    });
  });

  main.querySelectorAll('[data-decision-form]').forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      const decisionId = form.dataset.decisionForm;
      const data = new FormData(form);
      const choice = data.get(`choice-${decisionId}`);
      if (!choice) {
        return;
      }
      const author = String(data.get('author') || '');
      setAuthor(author);
      const button = form.querySelector('button[type="submit"]');
      const status = form.querySelector('.save-status');
      try {
        button.disabled = true;
        const result = await saveDecision(decisionId, {
          choice,
          text: data.get('text'),
          author,
        });
        state.responses.decisions[decisionId] = result;
        status.innerHTML = `${escapeHtml(COPY.youChose)} <strong>${escapeHtml(result.choice)}</strong>, ${escapeHtml(new Date(result.updatedAt).toLocaleString())}`;
        status.classList.add('is-visible');
        motion.pulseSaved(button);
      } catch (error) {
        status.textContent = error.message;
        status.classList.add('is-visible', 'is-error');
      } finally {
        button.disabled = false;
      }
    });
  });
}

function bindGlobalHandlers() {
  lightbox.querySelector('[data-lightbox-close]').addEventListener('click', closeLightbox);

  lightboxPrev.addEventListener('click', () => stepLightbox(-1));
  lightboxNext.addEventListener('click', () => stepLightbox(1));

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (!lightbox.open) {
      return;
    }
    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (lightboxGallery.files.length <= 1) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      stepLightbox(-1);
    }
    if (event.key === 'ArrowRight') {
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
    state.route = parseRoute();
    render();
    if (typeof main.focus === 'function') {
      try {
        main.focus({ preventScroll: true, focusVisible: false });
      } catch {
        main.focus({ preventScroll: true });
      }
    }
  });
}

init();
