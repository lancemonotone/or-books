#!/usr/bin/env node
/**
 * Set store-specific theme IDs for the target store (home rails + Featured Title).
 *
 * Usage (from orbooks-theme/):
 *   node scripts/apply-homepage-ids.js staging
 *   node scripts/apply-homepage-ids.js prod
 *
 * staging — patch local config.json from gitignored config.homepage-ids.stage.json
 * prod    — git restore config.json (committed file is prod IDs)
 *
 * Do not commit staging IDs. After a staging push, run prod before any prod push.
 */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const themeRoot = path.join(__dirname, '..');
const configPath = path.join(themeRoot, 'config.json');
const stageIdsPath = path.join(themeRoot, 'config.homepage-ids.stage.json');
const examplePath = path.join(themeRoot, 'config.homepage-ids.stage.example.json');
const PROD_NEW = '322';
const PROD_SALE = '323';
const PROD_SIDEBAR = '166';
const ID_KEYS = ['new_category_id', 'sale_category_id', 'sidebar_product_id'];

const target = (process.argv[2] || '').toLowerCase();

function usage() {
  console.error('Usage: node scripts/apply-homepage-ids.js <staging|prod>');
  process.exit(1);
}

function readConfigIds(config) {
  const settings = config.settings || {};
  return {
    newId: String(settings.new_category_id || ''),
    saleId: String(settings.sale_category_id || ''),
    sidebarId: String(settings.sidebar_product_id || ''),
  };
}

function writeIds(settings, ids) {
  ID_KEYS.forEach((key) => {
    settings[key] = ids[key];
  });
}

function applyStaging() {
  if (!fs.existsSync(stageIdsPath)) {
    console.error('Missing config.homepage-ids.stage.json');
    console.error('Copy from config.homepage-ids.stage.example.json first.');
    if (fs.existsSync(examplePath)) {
      console.error('  cp config.homepage-ids.stage.example.json config.homepage-ids.stage.json');
    }
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(stageIdsPath, 'utf8'));
  const ids = {};
  ID_KEYS.forEach((key) => {
    ids[key] = String(raw[key] || '');
  });
  if (ID_KEYS.some((key) => !ids[key])) {
    console.error('config.homepage-ids.stage.json needs new_category_id, sale_category_id, sidebar_product_id');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  writeIds(config.settings, ids);

  const light = (config.variations || []).find((v) => v.name === 'Light');
  if (light && light.settings) {
    writeIds(light.settings, ids);
  }

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(
    `Applied staging IDs to config.json: new=${ids.new_category_id} sale=${ids.sale_category_id} sidebar=${ids.sidebar_product_id}`
  );
  console.log('Local only. After staging push, or before prod push:');
  console.log('  node scripts/apply-homepage-ids.js prod');
}

function applyProd() {
  const result = spawnSync('git', ['restore', 'config.json'], {
    cwd: themeRoot,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || 'git restore failed').trim();
    console.error(detail);
    process.exit(result.status || 1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const { newId, saleId, sidebarId } = readConfigIds(config);
  console.log(
    `Restored config.json to committed IDs: new=${newId} sale=${saleId} sidebar=${sidebarId}`
  );
  if (newId !== PROD_NEW || saleId !== PROD_SALE || sidebarId !== PROD_SIDEBAR) {
    console.error(
      `Expected prod IDs new=${PROD_NEW} sale=${PROD_SALE} sidebar=${PROD_SIDEBAR}. Do not push to prod.`
    );
    process.exit(1);
  }
}

if (target === 'staging') {
  applyStaging();
} else if (target === 'prod') {
  applyProd();
} else {
  usage();
}
