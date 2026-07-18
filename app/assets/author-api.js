import { getCsrfToken, mediaUrl as presentationMediaUrl } from "./api.js";
import {
  dumpYaml,
  syncEvidenceTaskLinks,
  syncTaskEvidenceFromGallery,
  compactTaskIds,
  appendTaskToPhase,
  reorderTasksFromDrop,
  newTaskKey,
  inferMediaType,
} from "./yaml-helpers.js";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    credentials: "same-origin",
    cache: "no-store",
    ...options,
  });
  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }
  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }
  return data;
}

/** Persist a YAML data file via editor-data.php (app-root relative). */
export async function saveYamlFile(file, data) {
  const content = dumpYaml(data, file);
  return requestJson("api/editor-data.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      file,
      content,
      csrf: getCsrfToken(),
      website: "",
    }),
  });
}

export async function loadMediaList() {
  const data = await requestJson("api/editor-media.php");
  return data.files || [];
}

/** Upload a file into app/media/. Returns { name, type, mtime }. */
export async function uploadMediaFile(file) {
  const body = new FormData();
  body.append("file", file);
  body.append("csrf", getCsrfToken());
  body.append("website", "");
  return requestJson("api/editor-media-upload.php", {
    method: "POST",
    body,
  }).then((data) => data.file);
}

export {
  dumpYaml,
  syncEvidenceTaskLinks,
  syncTaskEvidenceFromGallery,
  compactTaskIds,
  appendTaskToPhase,
  reorderTasksFromDrop,
  newTaskKey,
  inferMediaType,
  presentationMediaUrl as mediaUrl,
};
