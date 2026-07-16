const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

/** @returns {number|null} */
export function parseHours(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    return null;
  }
  return value;
}

/** @returns {number|null} */
export function issueEstimateHours(issue) {
  return parseHours(issue?.hours);
}

/** @returns {number|null} */
export function issueActualHours(issue) {
  return parseHours(issue?.actual_hours);
}

/**
 * @param {number|null|undefined} hours
 * @param {number|null|undefined} rate
 * @returns {number|null}
 */
export function hoursToCost(hours, rate) {
  const parsedHours = parseHours(hours);
  const parsedRate = parseHours(rate);
  if (parsedHours === null || parsedRate === null) {
    return null;
  }
  return parsedHours * parsedRate;
}

export function issueEstimateCost(issue, rate) {
  return hoursToCost(issueEstimateHours(issue), rate);
}

export function issueActualCost(issue, rate) {
  return hoursToCost(issueActualHours(issue), rate);
}

/** @returns {'done'|'remaining'|'deferred'|'other'} */
export function issueQuoteBucket(issue) {
  const status = issue?.status;
  if (status === "complete") {
    return "done";
  }
  if (status === "planned" || status === "in_progress" || status === "blocked") {
    return "remaining";
  }
  if (status === "deferred") {
    return "deferred";
  }
  return "other";
}

/**
 * @typedef {object} BucketTotals
 * @property {number} estimateHours
 * @property {number} actualHours
 * @property {number|null} estimateCost
 * @property {number|null} actualCost
 * @property {number} count
 */

/**
 * @param {object[]} issues
 * @param {'done'|'remaining'|'deferred'|'other'} bucket
 * @param {number|null|undefined} rate
 * @returns {BucketTotals}
 */
function summarizeBucket(issues, bucket, rate) {
  const inBucket = issues.filter((issue) => issueQuoteBucket(issue) === bucket);
  let estimateHours = 0;
  let actualHours = 0;

  for (const issue of inBucket) {
    const estimate = issueEstimateHours(issue);
    const actual = issueActualHours(issue);
    if (estimate !== null) {
      estimateHours += estimate;
    }
    if (actual !== null) {
      actualHours += actual;
    }
  }

  const parsedRate = parseHours(rate);
  const estimateCost =
    parsedRate === null ? null : estimateHours * parsedRate;
  const actualCost = parsedRate === null ? null : actualHours * parsedRate;

  return {
    estimateHours,
    actualHours,
    estimateCost,
    actualCost,
    count: inBucket.length,
  };
}

/**
 * @param {BucketTotals} done
 * @param {BucketTotals} remaining
 * @param {number|null|undefined} rate
 * @returns {BucketTotals}
 */
function summarizeGrand(done, remaining, rate) {
  const estimateHours = done.estimateHours + remaining.estimateHours;
  const actualHours = done.actualHours + remaining.actualHours;
  const parsedRate = parseHours(rate);
  const estimateCost =
    parsedRate === null ? null : estimateHours * parsedRate;
  const actualCost = parsedRate === null ? null : actualHours * parsedRate;

  return {
    estimateHours,
    actualHours,
    estimateCost,
    actualCost,
    count: done.count + remaining.count,
  };
}

/**
 * @param {object[]} issues
 * @param {number|null|undefined} rate
 * @returns {{
 *   done: BucketTotals,
 *   remaining: BucketTotals,
 *   grand: BucketTotals,
 *   deferred: BucketTotals,
 *   estimateCompleteness: { set: number, total: number },
 *   actualCompleteness: { set: number, total: number },
 * }}
 */
export function summarizeEstimates(issues, rate) {
  const list = issues || [];
  const done = summarizeBucket(list, "done", rate);
  const remaining = summarizeBucket(list, "remaining", rate);
  const grand = summarizeGrand(done, remaining, rate);
  const deferred = summarizeBucket(list, "deferred", rate);

  const quoted = list.filter((issue) => {
    const bucket = issueQuoteBucket(issue);
    return bucket === "done" || bucket === "remaining";
  });

  let estimateSet = 0;
  let actualSet = 0;
  for (const issue of quoted) {
    if (issueEstimateHours(issue) !== null) {
      estimateSet += 1;
    }
    if (issueActualHours(issue) !== null) {
      actualSet += 1;
    }
  }

  return {
    done,
    remaining,
    grand,
    deferred,
    estimateCompleteness: { set: estimateSet, total: quoted.length },
    actualCompleteness: { set: actualSet, total: quoted.length },
  };
}

/**
 * @param {object[]} issues
 * @param {object[]} sprints audit.sprints
 * @param {number|null|undefined} rate
 * @returns {Array<{ sprintId: string, sprint: object|null, summary: ReturnType<typeof summarizeEstimates>, issues: object[] }>}
 */
export function summarizeEstimatesByPhase(issues, sprints, rate) {
  const list = issues || [];
  const auditSprints = sprints || [];
  const auditIds = auditSprints.map((sprint) => String(sprint.id));
  const groups = new Map();

  for (const issue of list) {
    const sprintId = String(issue.sprint ?? "");
    if (!groups.has(sprintId)) {
      groups.set(sprintId, []);
    }
    groups.get(sprintId).push(issue);
  }

  const orphanIds = [...groups.keys()]
    .filter((id) => !auditIds.includes(id))
    .sort((a, b) => {
      const numA = Number(a);
      const numB = Number(b);
      if (Number.isFinite(numA) && Number.isFinite(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });

  const orderedIds = [...auditIds, ...orphanIds];
  const seen = new Set();

  return orderedIds
    .filter((sprintId) => {
      if (seen.has(sprintId)) {
        return false;
      }
      seen.add(sprintId);
      return true;
    })
    .map((sprintId) => {
      const sprint =
        auditSprints.find((item) => String(item.id) === sprintId) ?? null;
      const phaseIssues = groups.get(sprintId) ?? [];
      return {
        sprintId,
        sprint,
        summary: summarizeEstimates(phaseIssues, rate),
        issues: phaseIssues,
      };
    });
}

/** USD display; null → null (caller shows Fail Fast / em dash) */
export function formatUsd(amount) {
  if (amount === null || amount === undefined) {
    return null;
  }
  if (typeof amount !== "number" || !Number.isFinite(amount)) {
    return null;
  }
  return usdFormatter.format(amount);
}

export function formatHours(hours) {
  if (hours === null || hours === undefined) {
    return null;
  }
  if (typeof hours !== "number" || !Number.isFinite(hours)) {
    return null;
  }
  return String(parseFloat(hours.toFixed(10)));
}
