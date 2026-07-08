import { mediaUrl } from './api.js';

let dialog;
let grid;
let searchInput;
let closeButton;
let files = [];
let filterType = 'all';
let onSelect = null;
let galleryFileSet = new Set();
let blockedFileSet = new Set();

function ensureElements() {
  dialog = document.getElementById('media-picker');
  grid = document.getElementById('picker-grid');
  searchInput = document.getElementById('picker-search');
  closeButton = document.getElementById('picker-close');
}

function renderGrid(query = '') {
  const q = query.trim().toLowerCase();
  const filtered = files.filter((file) => {
    if (filterType !== 'all' && file.type !== filterType) {
      return false;
    }
    if (q && !file.name.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });

  if (!filtered.length) {
    grid.innerHTML = '<p class="media-picker__empty">No files match. Add images or videos to the media folder.</p>';
    return;
  }

  grid.innerHTML = filtered
    .map((file) => {
      const inGallery = galleryFileSet.has(file.name);
      const isBlocked = inGallery || blockedFileSet.has(file.name);
      const thumb =
        file.type === 'video'
          ? `<span class="media-picker__video" aria-hidden="true">▶</span>`
          : `<img src="${mediaUrl(file.name)}" alt="" loading="lazy">`;
      const badge = inGallery
        ? '<span class="media-picker__badge" aria-hidden="true">✓</span>'
        : '';

      if (isBlocked) {
        return `
        <div class="media-picker__item media-picker__item--disabled" aria-disabled="true"${inGallery ? ' title="Already in gallery"' : ''}>
          <span class="media-picker__thumb">${thumb}</span>
          ${badge}
          <span class="media-picker__name">${escapeHtml(file.name)}</span>
        </div>`;
      }

      return `
        <button type="button" class="media-picker__item" data-file="${escapeAttr(file.name)}">
          <span class="media-picker__thumb">${thumb}</span>
          <span class="media-picker__name">${escapeHtml(file.name)}</span>
        </button>`;
    })
    .join('');

  grid.querySelectorAll('[data-file]').forEach((button) => {
    button.addEventListener('click', () => {
      const filename = button.dataset.file;
      if (onSelect) {
        onSelect(filename);
      }
      dialog.close();
    });
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeAttr(value) {
  return escapeHtml(value);
}

export function initPicker() {
  ensureElements();

  searchInput.addEventListener('input', () => {
    renderGrid(searchInput.value);
  });

  closeButton.addEventListener('click', () => {
    dialog.close();
  });

  dialog.addEventListener('close', () => {
    onSelect = null;
    searchInput.value = '';
    galleryFileSet = new Set();
    blockedFileSet = new Set();
  });
}

export function setPickerFiles(list) {
  files = list;
}

export function openMediaPicker({
  type = 'all',
  callback,
  galleryFiles = [],
  blockedFiles = [],
  allowGallery = false,
}) {
  ensureElements();
  filterType = type;
  onSelect = callback;
  galleryFileSet = allowGallery ? new Set() : new Set(galleryFiles);
  blockedFileSet = new Set(blockedFiles);
  searchInput.value = '';
  renderGrid();
  dialog.showModal();
}

/** Pick or replace a media file. Gallery entries stay selectable; pass blockedFiles to prevent duplicates. */
export function openMediaFilePicker({ type = 'all', blockedFiles = [], callback } = {}) {
  openMediaPicker({
    type,
    allowGallery: true,
    blockedFiles,
    callback,
  });
}

export function renderMediaChip(filename, caption = '') {
  if (!filename) {
    return '<span class="media-chip media-chip--empty">No file chosen</span>';
  }

  const isVideo = filename.toLowerCase().endsWith('.mp4');
  const thumb = isVideo
    ? '<span class="media-chip__video" aria-hidden="true">▶</span>'
    : `<img src="${mediaUrl(filename)}" alt="" loading="lazy">`;

  return `
    <span class="media-chip">
      <span class="media-chip__thumb">${thumb}</span>
      <span class="media-chip__meta">
        <strong>${escapeHtml(filename)}</strong>
        ${caption ? `<span>${escapeHtml(caption)}</span>` : ''}
      </span>
    </span>`;
}
