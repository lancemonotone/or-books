#!/usr/bin/env node
/**
 * Set homepage rail category IDs for the target store.
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

const target = (process.argv[2] || '').toLowerCase();

function usage(exitCode = 1) {
  console.error('Usage: node scripts/apply-homepage-ids.js <staging|prod>');
  process.exit(exitCode);
}

function readConfigIds(config) {
  return {
    newId: String((config.settings && config.settings.new_category_id) || ''),
    saleId: String((config.settings && config.settings.sale_category_id) || ''),
  };
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

  const ids = JSON.parse(fs.readFileSync(stageIdsPath, 'utf8'));
  const newId = String(ids.new_category_id || '');
  const saleId = String(ids.sale_category_id || '');
  if (!newId || !saleId) {
    console.error('config.homepage-ids.stage.json needs new_category_id and sale_category_id');
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  config.settings.new_category_id = newId;
  config.settings.sale_category_id = saleId;

  const light = (config.variations || []).find((v) => v.name === 'Light');
  if (light && light.settings) {
    light.settings.new_category_id = newId;
    light.settings.sale_category_id = saleId;
  }

  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`Applied staging homepage IDs to config.json: new=${newId} sale=${saleId}`);
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
  const { newId, saleId } = readConfigIds(config);
  console.log(`Restored config.json to committed homepage IDs: new=${newId} sale=${saleId}`);
  if (newId !== PROD_NEW || saleId !== PROD_SALE) {
    console.error(`Expected prod IDs new=${PROD_NEW} sale=${PROD_SALE}. Do not push to prod.`);
    process.exit(1);
  }
}

if (target === 'staging') {
  applyStaging();
} else if (target === 'prod') {
  applyProd();
} else {
  usage(1);
}
