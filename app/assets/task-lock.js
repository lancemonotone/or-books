import { getCsrfToken } from "./api.js";

const HEARTBEAT_MS = 40_000;

let heartbeatTimer = null;
let heldTaskKey = null;
let syncGeneration = 0;

async function requestLock(action, taskKey) {
  const response = await fetch("api/editor-task-lock.php", {
    method: "POST",
    credentials: "same-origin",
    cache: "no-store",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action,
      taskKey,
      csrf: getCsrfToken(),
      website: "",
    }),
  });
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    const error = new Error(data.error || "Lock request failed.");
    error.status = response.status;
    error.lock = data.lock || null;
    throw error;
  }
  return data;
}

async function fetchLockStatus(taskKey) {
  const response = await fetch(
    `api/editor-task-lock.php?taskKey=${encodeURIComponent(taskKey)}`,
    { credentials: "same-origin", cache: "no-store" },
  );
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    throw new Error(data.error || "Could not read lock status.");
  }
  return data.lock || null;
}

function stopHeartbeat() {
  if (heartbeatTimer) {
    clearInterval(heartbeatTimer);
    heartbeatTimer = null;
  }
}

async function releaseHeldLock() {
  const key = heldTaskKey;
  heldTaskKey = null;
  stopHeartbeat();
  if (!key) {
    return;
  }
  try {
    await requestLock("release", key);
  } catch {
    // Best-effort release.
  }
}

function startHeartbeat(taskKey) {
  stopHeartbeat();
  heartbeatTimer = setInterval(() => {
    requestLock("heartbeat", taskKey).catch(() => {
      // Next syncTaskAuthorLock will refresh UI if lock was stolen.
    });
  }, HEARTBEAT_MS);
}

/**
 * Claim or refresh lock when Edit mode is on a task page.
 * Sets state.taskLock for render. Returns whether author fields may edit.
 */
export async function syncTaskAuthorLock(state) {
  const generation = ++syncGeneration;
  const taskKey = String(state.route?.params?.taskKey || "");
  const onTask =
    Boolean(state.editMode) &&
    Boolean(state.auth?.email) &&
    state.route?.name === "task" &&
    taskKey !== "";

  if (!onTask) {
    if (heldTaskKey) {
      await releaseHeldLock();
    }
    state.taskLock = null;
    return true;
  }

  if (heldTaskKey && heldTaskKey !== taskKey) {
    await releaseHeldLock();
  }

  try {
    const data = await requestLock("claim", taskKey);
    if (generation !== syncGeneration) {
      return true;
    }
    heldTaskKey = taskKey;
    state.taskLock = data.lock;
    startHeartbeat(taskKey);
    return true;
  } catch (error) {
    if (generation !== syncGeneration) {
      return true;
    }
    if (error.status === 409 && error.lock) {
      heldTaskKey = null;
      stopHeartbeat();
      state.taskLock = error.lock;
      return false;
    }
    try {
      state.taskLock = await fetchLockStatus(taskKey);
    } catch {
      state.taskLock = null;
    }
    return !(state.taskLock && !state.taskLock.mine);
  }
}

export async function takeoverTaskLock(state, taskKey) {
  const data = await requestLock("takeover", taskKey);
  heldTaskKey = taskKey;
  state.taskLock = data.lock;
  startHeartbeat(taskKey);
  return data.lock;
}

export function bindTaskLockLifecycle(state, { onReleased } = {}) {
  const release = () => {
    if (!heldTaskKey) {
      return;
    }
    const key = heldTaskKey;
    heldTaskKey = null;
    stopHeartbeat();
    const body = JSON.stringify({
      action: "release",
      taskKey: key,
      csrf: getCsrfToken(),
      website: "",
    });
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("api/editor-task-lock.php", blob);
      return;
    }
    requestLock("release", key).catch(() => {});
  };

  window.addEventListener("pagehide", release);
  return () => {
    window.removeEventListener("pagehide", release);
    if (onReleased) {
      onReleased();
    }
  };
}

export function taskAuthoringBlocked(state, taskKey) {
  const lock = state.taskLock;
  if (!state.editMode || !lock || lock.mine) {
    return false;
  }
  return String(lock.taskKey) === String(taskKey);
}

export function renderTaskLockBanner(state, taskKey, { escapeHtml }) {
  const lock = state.taskLock;
  if (!lock || String(lock.taskKey) !== String(taskKey)) {
    return "";
  }
  if (lock.mine) {
    return "";
  }
  const who = lock.name || lock.email || "Someone";
  return `
    <div class="task-lock-banner" role="status">
      <p class="task-lock-banner__text"><strong>${escapeHtml(who)}</strong> is editing this task.</p>
      <button type="button" class="button button--ghost" data-task-lock-takeover="${escapeHtml(taskKey)}">Take over</button>
    </div>`;
}
