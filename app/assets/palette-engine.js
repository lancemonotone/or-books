/**
 * Build a full CSS custom-property palette from one primary hex + harmony mode.
 * Harmony:
 *  - ostwald: hue-veiled neutrals, complement danger, soft phase ring
 *  - classic: warm neutrals, danger = accent, vivid phase chips
 */

const SRGB_TO_LINEAR = (c) =>
  c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;

const LINEAR_TO_SRGB = (c) =>
  c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function clamp01(n) {
  return Math.min(1, Math.max(0, n));
}

function hexToRgb(hex) {
  const raw = String(hex || "")
    .trim()
    .replace(/^#/, "");
  const full =
    raw.length === 3
      ? raw
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : raw;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    return null;
  }
  return {
    r: Number.parseInt(full.slice(0, 2), 16) / 255,
    g: Number.parseInt(full.slice(2, 4), 16) / 255,
    b: Number.parseInt(full.slice(4, 6), 16) / 255,
  };
}

function rgbToHex({ r, g, b }) {
  const to = (x) =>
    Math.round(clamp01(x) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** sRGB 0–1 → OKLab */
function rgbToOklab({ r, g, b }) {
  const lr = SRGB_TO_LINEAR(r);
  const lg = SRGB_TO_LINEAR(g);
  const lb = SRGB_TO_LINEAR(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);
  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  };
}

function oklabToRgb({ L, a, b }) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;
  return {
    r: LINEAR_TO_SRGB(+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    g: LINEAR_TO_SRGB(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    b: LINEAR_TO_SRGB(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  };
}

function oklabToOklch({ L, a, b }) {
  const C = Math.sqrt(a * a + b * b);
  let h = (Math.atan2(b, a) * 180) / Math.PI;
  if (h < 0) {
    h += 360;
  }
  return { L, C, h };
}

function oklchToOklab({ L, C, h }) {
  const hr = (h * Math.PI) / 180;
  return { L, a: C * Math.cos(hr), b: C * Math.sin(hr) };
}

function hexToOklch(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return null;
  }
  return oklabToOklch(rgbToOklab(rgb));
}

function oklchToHex(oklch) {
  return rgbToHex(oklabToRgb(oklchToOklab(oklch)));
}

/** Relative luminance (sRGB). */
function luminance(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return 0;
  }
  const r = SRGB_TO_LINEAR(rgb.r);
  const g = SRGB_TO_LINEAR(rgb.g);
  const b = SRGB_TO_LINEAR(rgb.b);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hexA, hexB) {
  const a = luminance(hexA);
  const b = luminance(hexB);
  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);
  return (lighter + 0.05) / (darker + 0.05);
}

function withL(oklch, L) {
  return { ...oklch, L: clamp01(L) };
}

function withC(oklch, C) {
  return { ...oklch, C: Math.max(0, C) };
}

/** Adjust lightness until contrast vs bg meets minRatio; stay as close to seed L as possible. */
function ensureContrast(oklch, bgHex, minRatio) {
  const seedHex = oklchToHex(oklch);
  if (contrastRatio(seedHex, bgHex) >= minRatio) {
    return oklch;
  }
  const bgLum = luminance(bgHex);
  const needDarker = bgLum > 0.5;
  let lo = 0;
  let hi = 1;
  let best = withL(oklch, needDarker ? 0 : 1);
  for (let i = 0; i < 28; i += 1) {
    const mid = (lo + hi) / 2;
    const candidate = withL(oklch, mid);
    const ok = contrastRatio(oklchToHex(candidate), bgHex) >= minRatio;
    if (ok) {
      best = candidate;
      if (needDarker) {
        lo = mid;
      } else {
        hi = mid;
      }
    } else if (needDarker) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return best;
}

function rgbChannels(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return "0 0 0";
  }
  return `${Math.round(rgb.r * 255)} ${Math.round(rgb.g * 255)} ${Math.round(rgb.b * 255)}`;
}

function translucent(hex, alpha) {
  return `rgb(${rgbChannels(hex)} / ${alpha})`;
}

/**
 * @param {string} primaryHex
 * @param {"ostwald"|"classic"} harmony
 * @param {"light"|"dark"} theme
 * @returns {Record<string, string>|null}
 */
export function buildPaletteVars(primaryHex, harmony, theme) {
  const seed = hexToOklch(primaryHex);
  if (!seed) {
    return null;
  }
  const mode = harmony === "classic" ? "classic" : "ostwald";
  const dark = theme === "dark";
  const hue = seed.h;
  const seedC = seed.C;

  const veil = (L, Cscale) =>
    oklchToHex(withC(withL(seed, L), seedC * Cscale));

  let bg;
  let surface;
  let mutedSurface;
  let codeBg;
  let disabledSurface;
  let text;
  let muted;
  let border;
  let accentBorder;

  if (mode === "ostwald") {
    if (dark) {
      bg = veil(0.14, 0.08);
      surface = veil(0.2, 0.1);
      mutedSurface = veil(0.26, 0.12);
      codeBg = mutedSurface;
      disabledSurface = veil(0.23, 0.1);
      text = veil(0.94, 0.06);
      muted = veil(0.72, 0.08);
      border = veil(0.38, 0.1);
      accentBorder = veil(0.4, 0.22);
    } else {
      bg = veil(0.97, 0.06);
      surface = veil(0.995, 0.03);
      mutedSurface = veil(0.93, 0.08);
      codeBg = veil(0.95, 0.07);
      disabledSurface = veil(0.96, 0.05);
      text = veil(0.2, 0.08);
      muted = veil(0.48, 0.08);
      border = veil(0.88, 0.08);
      accentBorder = veil(0.88, 0.2);
    }
  } else if (dark) {
    bg = "#141312";
    surface = "#1e1c1a";
    mutedSurface = "#2a2724";
    codeBg = "#2a2724";
    disabledSurface = "#242220";
    text = "#f3f1ee";
    muted = "#b0aaa3";
    border = "#3a3632";
    accentBorder = oklchToHex(withC(withL(seed, 0.42), seedC * 0.55));
  } else {
    bg = "#f7f6f4";
    surface = "#ffffff";
    mutedSurface = "#ece8e2";
    codeBg = "#eeeae4";
    disabledSurface = "#f3f1ee";
    text = "#1a1a1a";
    muted = "#5c5c5c";
    border = "#ddd9d3";
    accentBorder = oklchToHex(withC(withL(seed, 0.88), seedC * 0.35));
  }

  const brand = oklchToHex(seed);
  let accent;
  let accentHover;
  let accentSoft;
  let accentSoftStrong;
  let onAccent;
  let success;

  if (dark) {
    accent = oklchToHex(
      ensureContrast(withL(seed, Math.max(seed.L, 0.72)), surface, 4.5),
    );
    accentHover = oklchToHex(withL(hexToOklch(accent), Math.min(0.85, hexToOklch(accent).L + 0.06)));
    accentSoft = veil(0.26, 0.2);
    accentSoftStrong = veil(0.32, 0.28);
    onAccent = bg;
    success = accent;
  } else {
    const darkAccent = ensureContrast(
      withC(withL(seed, Math.min(seed.L, 0.48)), seedC * 0.95),
      "#ffffff",
      4.5,
    );
    accent = oklchToHex(darkAccent);
    accentHover = oklchToHex(withL(darkAccent, Math.max(0.22, darkAccent.L - 0.08)));
    accentSoft = oklchToHex(withC(withL(seed, 0.94), seedC * 0.35));
    accentSoftStrong = oklchToHex(withC(withL(seed, 0.88), seedC * 0.5));
    onAccent = "#ffffff";
    success =
      mode === "ostwald"
        ? accent
        : "#166534";
  }

  const complementHue = (hue + 180) % 360;
  const dangerSeed = { L: seed.L, C: Math.max(seedC, 0.1), h: complementHue };

  let error;
  let dangerText;
  let dangerBorder;
  let critical;
  let high;
  let medium;
  let low;
  let inProgress;
  let complete;
  let statusCriticalBg;
  let statusHighBg;
  let statusMediumBg;
  let statusLowBg;
  let statusInProgressBg;
  let statusCompleteBg;

  if (mode === "ostwald") {
    if (dark) {
      error = oklchToHex(withC(withL(dangerSeed, 0.78), 0.12));
      dangerText = error;
      dangerBorder = oklchToHex(withC(withL(dangerSeed, 0.4), 0.1));
      critical = error;
      high = oklchToHex({ L: 0.78, C: 0.14, h: 55 });
      medium = oklchToHex({ L: 0.82, C: 0.14, h: 90 });
      low = "#9ca3af";
      inProgress = oklchToHex({ L: 0.75, C: 0.12, h: 250 });
      complete = oklchToHex(withL(seed, 0.72));
      statusCriticalBg = oklchToHex(withC(withL(dangerSeed, 0.28), 0.06));
      statusHighBg = oklchToHex({ L: 0.3, C: 0.05, h: 55 });
      statusMediumBg = oklchToHex({ L: 0.32, C: 0.05, h: 90 });
      statusLowBg = "#2a2a2e";
      statusInProgressBg = oklchToHex({ L: 0.28, C: 0.05, h: 250 });
      statusCompleteBg = veil(0.28, 0.18);
    } else {
      error = oklchToHex(
        ensureContrast(withC(withL(dangerSeed, 0.45), 0.14), "#ffffff", 4.5),
      );
      dangerText = oklchToHex(withC(withL(dangerSeed, 0.42), 0.16));
      dangerBorder = oklchToHex(withC(withL(dangerSeed, 0.9), 0.08));
      critical = error;
      high = oklchToHex({ L: 0.5, C: 0.14, h: 50 });
      medium = oklchToHex({ L: 0.48, C: 0.12, h: 85 });
      low = oklchToHex({ L: 0.45, C: 0.06, h: 240 });
      inProgress = oklchToHex({ L: 0.45, C: 0.12, h: 245 });
      complete = brand;
      statusCriticalBg = oklchToHex(withC(withL(dangerSeed, 0.95), 0.05));
      statusHighBg = oklchToHex({ L: 0.94, C: 0.05, h: 50 });
      statusMediumBg = oklchToHex({ L: 0.94, C: 0.05, h: 90 });
      statusLowBg = oklchToHex({ L: 0.93, C: 0.02, h: 240 });
      statusInProgressBg = oklchToHex({ L: 0.94, C: 0.05, h: 245 });
      statusCompleteBg = oklchToHex(withC(withL(seed, 0.94), seedC * 0.35));
    }
  } else if (dark) {
    error = oklchToHex(withL(seed, 0.72));
    dangerText = error;
    dangerBorder = oklchToHex(withC(withL(seed, 0.4), seedC * 0.4));
    critical = error;
    high = "#fb923c";
    medium = "#fbbf24";
    low = "#9ca3af";
    inProgress = "#60a5fa";
    complete = "#88ba87";
    statusCriticalBg = oklchToHex(withC(withL(seed, 0.28), seedC * 0.25));
    statusHighBg = "#3a2a18";
    statusMediumBg = "#3a3418";
    statusLowBg = "#2a2a2e";
    statusInProgressBg = "#1a2740";
    statusCompleteBg = "#1a3328";
  } else {
    error = accent;
    dangerText = oklchToHex(withL(seed, Math.max(0.35, seed.L - 0.15)));
    dangerBorder = oklchToHex(withC(withL(seed, 0.9), seedC * 0.25));
    critical = accent;
    high = "#b45309";
    medium = "#92680a";
    low = "#4b5563";
    inProgress = "#1d4ed8";
    complete = "#8dbd91";
    statusCriticalBg = accentSoft;
    statusHighBg = "#ffedd5";
    statusMediumBg = "#fef3c7";
    statusLowBg = "#e5e7eb";
    statusInProgressBg = "#dbeafe";
    statusCompleteBg = "#d1fae5";
  }

  const phase =
    mode === "ostwald"
      ? {
          "--phase-hue-base": String(Math.round(hue)),
          "--phase-hue-step": "36",
          "--phase-s-fg": "24%",
          "--phase-l-fg": "34%",
          "--phase-s-bg": "14%",
          "--phase-l-bg": "92%",
          "--phase-s-fg-dark": "26%",
          "--phase-l-fg-dark": "70%",
          "--phase-s-bg-dark": "12%",
          "--phase-l-bg-dark": "18%",
          "--phase-s-accent": "26%",
          "--phase-l-accent": "40%",
          "--phase-s-accent-dark": "28%",
          "--phase-l-accent-dark": "55%",
        }
      : {
          "--phase-hue-base": String(Math.round(hue)),
          "--phase-hue-step": "0",
          "--phase-s-fg": "52%",
          "--phase-l-fg": "34%",
          "--phase-s-bg": "48%",
          "--phase-l-bg": "92%",
          "--phase-s-fg-dark": "70%",
          "--phase-l-fg-dark": "78%",
          "--phase-s-bg-dark": "32%",
          "--phase-l-bg-dark": "18%",
          "--phase-s-accent": "52%",
          "--phase-l-accent": "42%",
          "--phase-s-accent-dark": "65%",
          "--phase-l-accent-dark": "60%",
        };

  return {
    "--color-bg": bg,
    "--color-surface": surface,
    "--color-muted-surface": mutedSurface,
    "--color-code-bg": codeBg,
    "--color-disabled-surface": disabledSurface,
    "--color-surface-translucent": translucent(surface, dark ? "92%" : "90%"),
    "--color-text": text,
    "--color-muted": muted,
    "--color-border": border,
    "--color-accent-border": accentBorder,
    "--color-header": translucent(surface, dark ? "92%" : "92%"),
    "--color-overlay": dark ? "rgb(0 0 0 / 70%)" : "rgb(0 0 0 / 55%)",
    "--color-overlay-subtle": dark
      ? "rgb(255 255 255 / 4%)"
      : "rgb(0 0 0 / 4%)",
    "--color-brand": brand,
    "--color-accent": accent,
    "--color-accent-hover": accentHover,
    "--color-accent-soft": accentSoft,
    "--color-accent-soft-strong": accentSoftStrong,
    "--color-on-accent": onAccent,
    "--color-success": success,
    "--color-error": error,
    "--color-danger-text": dangerText,
    "--color-danger-border": dangerBorder,
    "--color-critical": critical,
    "--color-high": high,
    "--color-medium": medium,
    "--color-low": low,
    "--color-planned": medium,
    "--color-in-progress": inProgress,
    "--color-blocked": critical,
    "--color-complete": complete,
    "--color-deferred": low,
    "--color-status-critical-bg": statusCriticalBg,
    "--color-status-high-bg": statusHighBg,
    "--color-status-medium-bg": statusMediumBg,
    "--color-status-low-bg": statusLowBg,
    "--color-status-planned-bg": statusMediumBg,
    "--color-status-in-progress-bg": statusInProgressBg,
    "--color-status-blocked-bg": statusCriticalBg,
    "--color-status-complete-bg": statusCompleteBg,
    "--color-status-deferred-bg": statusLowBg,
    ...phase,
  };
}

export function normalizeHex(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) {
    return null;
  }
  return rgbToHex(rgb);
}

export const PALETTE_PRESETS = [
  {
    id: "ostwald-green",
    name: "Brand green",
    hex: "#98b797",
    harmony: "ostwald",
  },
  {
    id: "classic",
    name: "Classic",
    hex: "#8b1e1e",
    harmony: "classic",
  },
];

export const PALETTE_HARMONIES = ["ostwald", "classic"];

export function defaultPaletteId() {
  return PALETTE_PRESETS[0]?.id || "";
}

export function normalizeHarmony(value) {
  const next = String(value || "").trim().toLowerCase();
  return PALETTE_HARMONIES.includes(next) ? next : PALETTE_HARMONIES[0];
}