const AUTOSAVE_DELAY_MS = 1500;
const SAVED_FADE_MS = 2500;

let timer = null;
let inFlight = false;
let queued = false;
let saveHandler = null;
let setIndicator = null;
let savedFadeTimer = null;

export function initAutosave({ onSave, onIndicator }) {
  saveHandler = onSave;
  setIndicator = onIndicator;
}

export function scheduleAutosave() {
  if (!saveHandler) {
    return;
  }
  clearTimeout(timer);
  setIndicator?.('pending');
  timer = setTimeout(() => {
    timer = null;
    flushAutosave();
  }, AUTOSAVE_DELAY_MS);
}

export function cancelAutosave() {
  clearTimeout(timer);
  timer = null;
}

export async function flushAutosave() {
  if (!saveHandler) {
    return true;
  }
  cancelAutosave();
  if (inFlight) {
    queued = true;
    return false;
  }
  inFlight = true;
  setIndicator?.('saving');
  try {
    const saved = await saveHandler();
    if (saved) {
      setIndicator?.('saved');
      clearTimeout(savedFadeTimer);
      savedFadeTimer = setTimeout(() => {
        setIndicator?.('idle');
      }, SAVED_FADE_MS);
    } else {
      setIndicator?.('idle');
    }
    return saved;
  } catch (error) {
    setIndicator?.('error', error.message);
    return false;
  } finally {
    inFlight = false;
    if (queued) {
      queued = false;
      scheduleAutosave();
    }
  }
}
