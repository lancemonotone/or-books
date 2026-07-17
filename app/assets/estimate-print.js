import {
  summarizeEstimates,
  summarizeEstimatesByPhase,
  formatUsd,
  formatHours,
  issueEstimateHours,
  issueActualHours,
  hoursToCost,
  issueQuoteBucket,
} from "./estimates.js";

export const DEFAULT_ESTIMATE_PRINT_PROFILE = {
  includeActuals: false,
  includeDeferredAppendix: true,
  includeDone: false,
  includeRemaining: false,
  includeGrandTitle: false,
  includeCompleteness: false,
};

const EM_DASH = "—";
const PRINT_ROOT_ID = "estimate-print-root";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function mergeProfile(profile) {
  return { ...DEFAULT_ESTIMATE_PRINT_PROFILE, ...(profile || {}) };
}

/**
 * @param {number|null} hours
 * @returns {string}
 */
function hoursCell(hours) {
  const formatted = formatHours(hours);
  return formatted !== null ? `${escapeHtml(formatted)}h` : EM_DASH;
}

/**
 * @param {number|null} cost
 * @param {number|null|undefined} rate
 * @param {string} rateMissingCopy
 * @returns {string}
 */
function costCell(cost, rate, rateMissingCopy) {
  if (rate === null || rate === undefined) {
    return escapeHtml(rateMissingCopy);
  }
  const formatted = formatUsd(cost);
  return formatted !== null ? escapeHtml(formatted) : EM_DASH;
}

/**
 * @param {object} bucket
 * @param {string} label  Empty → omit title
 * @param {object} profile
 * @param {number|null|undefined} rate
 * @param {object} copy
 */
function renderSummaryBucket(bucket, label, profile, rate, copy) {
  const actualBlock = profile.includeActuals
    ? `
        <div class="estimate-print__metric">
          <dt>${escapeHtml(copy.estimatesActualHours)}</dt>
          <dd>${hoursCell(bucket.actualHours)}</dd>
        </div>
        <div class="estimate-print__metric">
          <dt>${escapeHtml(copy.estimatesActualCost)}</dt>
          <dd>${costCell(bucket.actualCost, rate, copy.hourlyRateMissing)}</dd>
        </div>`
    : "";
  const title = String(label || "").trim()
    ? `<h3 class="estimate-print__bucket-title">${escapeHtml(label)}</h3>`
    : "";

  return `
    <article class="estimate-print__bucket">
      ${title}
      <dl class="estimate-print__metrics">
        <div class="estimate-print__metric">
          <dt>${escapeHtml(copy.estimatesEstimateHours)}</dt>
          <dd>${hoursCell(bucket.estimateHours)}</dd>
        </div>
        <div class="estimate-print__metric">
          <dt>${escapeHtml(copy.estimatesEstimateCost)}</dt>
          <dd>${costCell(bucket.estimateCost, rate, copy.hourlyRateMissing)}</dd>
        </div>
        ${actualBlock}
      </dl>
    </article>`;
}

/**
 * @param {object} issue
 * @param {object} profile
 * @param {number|null|undefined} rate
 * @param {object} copy
 * @param {(status: string) => string} statusLabelFn
 */
function renderIssueRow(issue, profile, rate, copy, statusLabelFn) {
  const estimateHours = issueEstimateHours(issue);
  const estimateCost = hoursToCost(estimateHours, rate);
  const actualCells = profile.includeActuals
    ? (() => {
        const actualHours = issueActualHours(issue);
        const actualCost = hoursToCost(actualHours, rate);
        return `<td>${hoursCell(actualHours)}</td><td>${costCell(actualCost, rate, copy.hourlyRateMissing)}</td>`;
      })()
    : "";

  return `<tr>
    <td>${escapeHtml(issue.id)}</td>
    <td>${escapeHtml(issue.title)}</td>
    <td>${escapeHtml(statusLabelFn(issue.status))}</td>
    <td>${hoursCell(estimateHours)}</td>
    <td>${costCell(estimateCost, rate, copy.hourlyRateMissing)}</td>
    ${actualCells}
  </tr>`;
}

/**
 * Issues shown in a phase section (quoted + optional deferred).
 * @param {object[]} issues
 * @param {object} profile
 */
function filterPhaseIssues(issues, profile) {
  return (issues || []).filter((issue) => {
    const bucket = issueQuoteBucket(issue);
    if (bucket === "other") {
      return false;
    }
    if (bucket === "deferred") {
      return Boolean(profile.includeDeferredAppendix);
    }
    if (!profile.includeDone && bucket === "done") {
      return false;
    }
    return true;
  });
}

/**
 * @param {object} phase
 * @param {object} profile
 * @param {number|null|undefined} rate
 * @param {object} copy
 * @param {(status: string) => string} statusLabelFn
 * @param {(sprintId: string, sprint: object|null) => string} phaseTitleFn
 */
function renderPhaseSection(
  phase,
  profile,
  rate,
  copy,
  statusLabelFn,
  phaseTitleFn,
) {
  const issues = filterPhaseIssues(phase.issues, profile);
  if (!issues.length) {
    return "";
  }

  const title = phaseTitleFn(phase.sprintId, phase.sprint);
  const actualHeaders = profile.includeActuals
    ? `<th>${escapeHtml(copy.estimatesActualHours)}</th><th>${escapeHtml(copy.estimatesActualCost)}</th>`
    : "";
  const rows = issues
    .map((issue) => renderIssueRow(issue, profile, rate, copy, statusLabelFn))
    .join("");

  return `
    <section class="estimate-print__phase">
      <h2 class="estimate-print__phase-title">${escapeHtml(title)}</h2>
      <table class="estimate-print__table">
        <thead>
          <tr>
            <th>${escapeHtml(copy.estimatesColId)}</th>
            <th>${escapeHtml(copy.estimatesColTitle)}</th>
            <th>${escapeHtml(copy.estimatesColStatus)}</th>
            <th>${escapeHtml(copy.estimatesEstimateHours)}</th>
            <th>${escapeHtml(copy.estimatesEstimateCost)}</th>
            ${actualHeaders}
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </section>`;
}

/**
 * @param {object|null|undefined} vendor
 * @returns {string}
 */
function renderVendorHeader(vendor) {
  const v = vendor && typeof vendor === "object" ? vendor : {};
  const business = String(v.business || "").trim();
  const name = String(v.name || "").trim();
  const address = String(v.address || "").trim();
  const email = String(v.email || "").trim();
  const phone = String(v.phone || "").trim();
  const logo = String(v.logo || "").trim();

  const lines = [];
  if (business) {
    lines.push(
      `<p class="estimate-print__vendor-business">${escapeHtml(business)}</p>`,
    );
  }
  if (name) {
    lines.push(`<p class="estimate-print__vendor-name">${escapeHtml(name)}</p>`);
  }
  if (address) {
    lines.push(
      `<p class="estimate-print__vendor-address">${escapeHtml(address)}</p>`,
    );
  }
  const contact = [email, phone].filter(Boolean);
  if (contact.length) {
    lines.push(
      `<p class="estimate-print__vendor-contact">${escapeHtml(contact.join(" · "))}</p>`,
    );
  }

  if (!logo && !lines.length) {
    return "";
  }

  const logoHtml = logo
    ? `<img class="estimate-print__logo" src="${escapeHtml(logo)}" alt="">`
    : "";
  const textHtml = lines.length
    ? `<div class="estimate-print__vendor-text">${lines.join("")}</div>`
    : "";

  return `<div class="estimate-print__vendor">${logoHtml}${textHtml}</div>`;
}

/**
 * @param {{
 *   issues: object[],
 *   sprints: object[],
 *   rate: number|null|undefined,
 *   clientName: string,
 *   vendor: object|null|undefined,
 *   generatedAt: Date|string|number,
 *   copy: object,
 *   statusLabel: (status: string) => string,
 *   phaseTitle: (sprintId: string, sprint: object|null) => string,
 * }} data
 * @param {object} [profile]
 * @returns {string}
 */
export function buildEstimatePrintHtml(data, profile) {
  const resolved = mergeProfile(profile);
  const {
    issues = [],
    sprints = [],
    rate = null,
    clientName = "",
    vendor = null,
    generatedAt = new Date(),
    copy,
    statusLabel: statusLabelFn,
    phaseTitle: phaseTitleFn,
  } = data;

  const summary = summarizeEstimates(issues, rate);
  const phases = summarizeEstimatesByPhase(issues, sprints, rate).filter(
    (phase) => filterPhaseIssues(phase.issues, resolved).length > 0,
  );

  const date =
    generatedAt instanceof Date ? generatedAt : new Date(generatedAt);
  const dateLabel = Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

  const name = String(clientName || "").trim();
  const nameLine = name
    ? `<p class="estimate-print__client">${escapeHtml(name)}</p>`
    : "";
  const dateLine = dateLabel
    ? `<p class="estimate-print__date">${escapeHtml(dateLabel)}</p>`
    : "";

  const rateLine =
    rate === null || rate === undefined
      ? `<p class="estimate-print__rate estimate-print__rate--missing" role="status">${escapeHtml(copy.hourlyRateMissing)}</p>`
      : `<p class="estimate-print__rate">${escapeHtml(copy.estimatePrintRate(formatUsd(rate)))}</p>`;

  const vendorBlock = renderVendorHeader(vendor);
  const summaryBuckets = [];
  if (resolved.includeDone) {
    summaryBuckets.push(
      renderSummaryBucket(
        summary.done,
        copy.estimatesDone,
        resolved,
        rate,
        copy,
      ),
    );
  }
  if (resolved.includeRemaining) {
    summaryBuckets.push(
      renderSummaryBucket(
        summary.remaining,
        copy.estimatesRemaining,
        resolved,
        rate,
        copy,
      ),
    );
  }
  summaryBuckets.push(
    renderSummaryBucket(
      summary.grand,
      resolved.includeGrandTitle ? copy.estimatesGrand : "",
      resolved,
      rate,
      copy,
    ),
  );

  const deferredNote = `<p class="estimate-print__deferred-note">Issues with <em>${escapeHtml(copy.estimatesDeferred)}</em> status are not included in the total.</p>`;

  const completeness = resolved.includeCompleteness
    ? `<p class="estimate-print__completeness">${escapeHtml(
        copy.estimatesCompletenessEstimate(
          summary.estimateCompleteness.set,
          summary.estimateCompleteness.total,
        ),
      )}${
        resolved.includeActuals
          ? ` · ${escapeHtml(
              copy.estimatesCompletenessActual(
                summary.actualCompleteness.set,
                summary.actualCompleteness.total,
              ),
            )}`
          : ""
      }</p>`
    : "";

  const phaseSections = phases
    .map((phase) =>
      renderPhaseSection(
        phase,
        resolved,
        rate,
        copy,
        statusLabelFn,
        phaseTitleFn,
      ),
    )
    .join("");

  const summaryClass =
    summaryBuckets.length === 1
      ? "estimate-print__summary estimate-print__summary--single"
      : "estimate-print__summary";

  return `
    <header class="estimate-print__header">
      ${vendorBlock}
      <div class="estimate-print__meta">
        ${nameLine}
        ${dateLine}
        ${rateLine}
      </div>
    </header>
    <div class="estimate-print__totals-row">
      <h1 class="estimate-print__title">${escapeHtml(copy.estimates)}</h1>
      <div class="estimate-print__totals">
        <div class="${summaryClass}">
          ${summaryBuckets.join("")}
        </div>
        ${deferredNote}
      </div>
    </div>
    ${completeness}
    <div class="estimate-print__phases">
      ${phaseSections}
    </div>`;
}

function teardownPrintRoot() {
  document.getElementById(PRINT_ROOT_ID)?.remove();
}

/**
 * Wait until print-root images are decoded (or failed), so print capture includes the logo.
 * @param {ParentNode} root
 * @returns {Promise<void>}
 */
function waitForPrintImages(root) {
  const images = [...root.querySelectorAll("img")];
  if (!images.length) {
    return Promise.resolve();
  }

  return Promise.all(
    images.map(
      (img) =>
        new Promise((resolve) => {
          let settled = false;
          const done = () => {
            if (settled) {
              return;
            }
            settled = true;
            resolve();
          };

          if (img.complete && img.naturalWidth > 0) {
            done();
            return;
          }

          img.addEventListener("load", done, { once: true });
          img.addEventListener("error", done, { once: true });

          if (typeof img.decode === "function") {
            img.decode().then(done).catch(done);
          }

          window.setTimeout(done, 4000);
        }),
    ),
  ).then(() => undefined);
}

/**
 * Mount print document, open print dialog, tear down after print.
 * @param {Parameters<typeof buildEstimatePrintHtml>[0]} data
 * @param {object} [profile]
 */
export async function printEstimate(data, profile) {
  if (!data?.issues?.length) {
    return;
  }

  teardownPrintRoot();

  const root = document.createElement("div");
  root.id = PRINT_ROOT_ID;
  root.className = "estimate-print";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML = buildEstimatePrintHtml(data, profile);
  document.body.appendChild(root);

  const previousTitle = document.title;
  document.title = " ";

  const cleanup = () => {
    window.removeEventListener("afterprint", cleanup);
    document.title = previousTitle;
    teardownPrintRoot();
  };

  try {
    await waitForPrintImages(root);
  } catch {
    /* still print — Fail Fast shows missing logo if it never loads */
  }

  window.addEventListener("afterprint", cleanup);
  window.print();

  // Some browsers skip afterprint when the dialog is cancelled quickly.
  window.setTimeout(() => {
    if (document.getElementById(PRINT_ROOT_ID)) {
      cleanup();
    }
  }, 60_000);
}
