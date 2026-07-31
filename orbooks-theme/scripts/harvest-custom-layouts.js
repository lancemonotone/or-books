/**
 * Harvest production custom-template URL maps for local Stencil preview.
 *
 * Read-only against the public storefront (sitemap + HTML GET). No Management
 * API writes. No secrets required.
 *
 * Usage (from orbooks-theme/):
 *   node scripts/harvest-custom-layouts.js           # write customLayouts.from-api.json
 *   node scripts/harvest-custom-layouts.js --apply   # also overwrite config.stencil.json customLayouts
 *
 * Prefer --apply when refreshing local mappings. Do not hand-edit the bulk
 * single-author URL list in config.stencil.json — re-harvest instead.
 *
 * Docs: docs/agents/stencil-theme.md → "Refresh local customLayouts"
 */
const fs = require('fs');
const path = require('path');

const STOREFRONT = 'https://www.orbooks.com';
const UA = { 'User-Agent': 'orbooks-local-dev-mapping/1.0' };
const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const CONCURRENCY = 4;

/** Paths harvest often misses (rate-limit / not in sitemap) — unioned on --apply. */
const EXTRAS = {
  category: {
    'authors.html': ['/authors/h/'],
  },
  page: {
    'new-events.html': ['/events/'],
    'events.html': ['/past-events/'],
  },
};

function normalizePath(u) {
  if (!u) return null;
  let p = u.trim();
  if (p.startsWith('http')) {
    try {
      p = new URL(p).pathname;
    } catch {
      return null;
    }
  }
  if (!p.startsWith('/')) p = `/${p}`;
  return p;
}

function decodeLoc(s) {
  return s
    .trim()
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function extractTemplate(html) {
  const marker = 'stencilBootstrap(';
  const start = html.indexOf(marker);
  if (start < 0) return null;
  const after = html.slice(start + marker.length);
  const typeMatch = after.match(/^"([^"]+)",\s*"/);
  if (!typeMatch) return null;
  const pageType = typeMatch[1];
  let i = typeMatch[0].length;
  let raw = '';
  let escaped = false;
  for (; i < after.length; i++) {
    const ch = after[i];
    if (escaped) {
      raw += ch;
      escaped = false;
      continue;
    }
    if (ch === '\\') {
      raw += ch;
      escaped = true;
      continue;
    }
    if (ch === '"') break;
    raw += ch;
  }
  let data;
  try {
    data = JSON.parse(JSON.parse(`"${raw}"`));
  } catch {
    try {
      data = JSON.parse(raw.replace(/\\"/g, '"'));
    } catch {
      return { pageType, template: null, parseError: true };
    }
  }
  return { pageType, template: data.template || null };
}

async function sleep(ms) {
  await new Promise((r) => setTimeout(r, ms));
}

async function fetchText(url, attempt = 1) {
  const res = await fetch(url, { headers: UA, redirect: 'follow' });
  if ((res.status === 429 || res.status >= 500) && attempt < 6) {
    const wait = attempt * 1500;
    await sleep(wait);
    return fetchText(url, attempt + 1);
  }
  const text = await res.text();
  return { status: res.status, text, finalUrl: res.url };
}

async function harvestSitemapPaths() {
  const paths = new Set();
  const indexUrl = `${STOREFRONT}/xmlsitemap.php`;
  const { status, text } = await fetchText(indexUrl);
  if (status !== 200) throw new Error(`sitemap index HTTP ${status}`);
  const locs = [...text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) => decodeLoc(m[1]));
  console.log(`sitemap index locs: ${locs.length}`);
  for (const loc of locs) {
    if (/sitemap/i.test(loc) && (loc.includes('xmlsitemap') || loc.endsWith('.xml'))) {
      const nested = await fetchText(loc);
      if (nested.status !== 200) {
        console.log(`nested fail ${loc} ${nested.status}`);
        continue;
      }
      const nlocs = [...nested.text.matchAll(/<loc>([^<]+)<\/loc>/gi)].map((m) =>
        decodeLoc(m[1]),
      );
      console.log(`  nested ${loc} → ${nlocs.length}`);
      for (const n of nlocs) {
        const p = normalizePath(n);
        if (p) paths.add(p);
      }
    } else {
      const p = normalizePath(loc);
      if (p) paths.add(p);
    }
  }
  return [...paths].sort();
}

function templateToCustomLayoutsKey(template) {
  if (!template) return null;
  const m = template.match(/^pages\/custom\/(category|page|product|brand)\/([^/]+)$/);
  if (!m) return null;
  const file = m[2].endsWith('.html') ? m[2] : `${m[2]}.html`;
  return { type: m[1], file };
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let next = 0;
  async function run() {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await worker(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => run()));
  return results;
}

function mergeLayouts(...sources) {
  const out = { brand: {}, category: {}, page: {}, product: {} };
  for (const src of sources) {
    for (const type of Object.keys(out)) {
      const block = src?.[type] || {};
      for (const [file, urls] of Object.entries(block)) {
        const set = new Set([...(out[type][file] || []), ...(urls || [])]);
        out[type][file] = [...set].sort();
      }
    }
  }
  return out;
}

(async () => {
  console.log('Mode: public storefront read-only (sitemap + HTML). No store API writes.');
  if (APPLY) console.log('Flag --apply: will overwrite config.stencil.json customLayouts after harvest.');

  const paths = await harvestSitemapPaths();
  console.log(`unique paths: ${paths.length}`);

  const skipRe = /\.(jpg|jpeg|png|gif|webp|pdf|css|js|xml)$/i;
  const candidates = paths.filter((p) => !skipRe.test(p));
  console.log(`candidates to fetch: ${candidates.length} (concurrency ${CONCURRENCY})`);

  const layouts = { brand: {}, category: {}, page: {}, product: {} };
  const defaults = [];
  const errors = [];
  let done = 0;

  await mapPool(candidates, CONCURRENCY, async (p) => {
    try {
      const { status, text } = await fetchText(STOREFRONT + p);
      if (status !== 200) {
        errors.push({ path: p, status });
        return;
      }
      const info = extractTemplate(text);
      done += 1;
      if (done % 50 === 0) console.log(`… ${done}/${candidates.length}`);
      if (!info?.template) {
        errors.push({ path: p, status, reason: 'no-template' });
        return;
      }
      const key = templateToCustomLayoutsKey(info.template);
      if (!key) {
        defaults.push({ path: p, template: info.template, pageType: info.pageType });
        return;
      }
      (layouts[key.type][key.file] ||= []).push(p);
    } catch (e) {
      errors.push({ path: p, error: e.message });
    }
  });

  for (const type of Object.keys(layouts)) {
    for (const file of Object.keys(layouts[type])) {
      layouts[type][file] = [...new Set(layouts[type][file])].sort();
    }
  }

  const summary = {};
  for (const type of Object.keys(layouts)) {
    summary[type] = {};
    for (const [file, urls] of Object.entries(layouts[type])) {
      summary[type][file] = { count: urls.length, sample: urls.slice(0, 8) };
    }
  }

  const configPath = path.join(ROOT, 'config.stencil.json');
  const current = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const missing = {};
  for (const type of ['brand', 'category', 'page', 'product']) {
    missing[type] = {};
    for (const [file, urls] of Object.entries(layouts[type])) {
      const have = new Set(current.customLayouts?.[type]?.[file] || []);
      const notHave = urls.filter((u) => !have.has(u));
      if (notHave.length) {
        missing[type][file] = { missingCount: notHave.length, sample: notHave.slice(0, 8) };
      }
    }
  }

  const out = {
    generatedAt: new Date().toISOString(),
    note: 'Public storefront read-only harvest. Regenerable dump — do not hand-edit; re-run scripts/harvest-custom-layouts.js.',
    customLayouts: layouts,
    summary,
    missingVsCurrentConfig: missing,
    defaultTemplateCount: defaults.length,
    errorCount: errors.length,
    errors: errors.slice(0, 80),
  };

  const dumpPath = path.join(ROOT, 'customLayouts.from-api.json');
  fs.writeFileSync(dumpPath, JSON.stringify(out, null, 2));
  console.log('\n=== SUMMARY ===');
  console.log(JSON.stringify(summary, null, 2));
  console.log(`defaults (no customLayouts needed): ${defaults.length}`);
  console.log(`errors: ${errors.length}`);
  console.log(`Wrote ${path.relative(ROOT, dumpPath)}`);

  if (APPLY) {
    const customLayouts = mergeLayouts(layouts, EXTRAS);
    const next = {
      customLayouts,
      normalStoreUrl: current.normalStoreUrl,
      port: current.port,
      packageManager: current.packageManager,
    };
    fs.writeFileSync(configPath, `${JSON.stringify(next, null, 2)}\n`);
    console.log('Applied → config.stencil.json (harvest ∪ EXTRAS). Restart stencil start.');
  } else {
    console.log('Dry dump only. To update config.stencil.json: node scripts/harvest-custom-layouts.js --apply');
  }
})().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
