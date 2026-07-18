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
export function taskEstimateHours(task) {
  return parseHours(task?.hours);
}

/** @returns {number|null} */
export function taskActualHours(task) {
  return parseHours(task?.actual_hours);
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

export function taskEstimateCost(task, rate) {
  return hoursToCost(taskEstimateHours(task), rate);
}

export function taskActualCost(task, rate) {
  return hoursToCost(taskActualHours(task), rate);
}

/** @returns {'done'|'remaining'|'deferred'|'other'} */
export function taskQuoteBucket(task) {
  const status = task?.status;
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
 * @param {object[]} tasks
 * @param {'done'|'remaining'|'deferred'|'other'} bucket
 * @param {number|null|undefined} rate
 * @returns {BucketTotals}
 */
function summarizeBucket(tasks, bucket, rate) {
  const inBucket = tasks.filter((task) => taskQuoteBucket(task) === bucket);
  let estimateHours = 0;
  let actualHours = 0;

  for (const task of inBucket) {
    const estimate = taskEstimateHours(task);
    const actual = taskActualHours(task);
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
 * @param {object[]} tasks
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
export function summarizeEstimates(tasks, rate) {
  const list = tasks || [];
  const done = summarizeBucket(list, "done", rate);
  const remaining = summarizeBucket(list, "remaining", rate);
  const grand = summarizeGrand(done, remaining, rate);
  const deferred = summarizeBucket(list, "deferred", rate);

  const quoted = list.filter((task) => {
    const bucket = taskQuoteBucket(task);
    return bucket === "done" || bucket === "remaining";
  });

  let estimateSet = 0;
  let actualSet = 0;
  for (const task of quoted) {
    if (taskEstimateHours(task) !== null) {
      estimateSet += 1;
    }
    if (taskActualHours(task) !== null) {
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
 * @param {object[]} tasks
 * @param {object[]} sprints audit.sprints
 * @param {number|null|undefined} rate
 * @returns {Array<{ sprintId: string, sprint: object|null, summary: ReturnType<typeof summarizeEstimates>, tasks: object[] }>}
 */
export function summarizeEstimatesByPhase(tasks, sprints, rate) {
  const list = tasks || [];
  const auditSprints = sprints || [];
  const auditIds = auditSprints.map((sprint) => String(sprint.id));
  const groups = new Map();

  for (const task of list) {
    const sprintId = String(task.sprint ?? "");
    if (!groups.has(sprintId)) {
      groups.set(sprintId, []);
    }
    groups.get(sprintId).push(task);
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
      const phaseTasks = groups.get(sprintId) ?? [];
      return {
        sprintId,
        sprint,
        summary: summarizeEstimates(phaseTasks, rate),
        tasks: phaseTasks,
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
