#!/usr/bin/env node
/**
 * Patch local config.json home rail IDs for staging preview.
 * Does NOT commit. Before git commit or stencil push:
 *   git restore orbooks-theme/config.json
 *
 * Usage (from orbooks-theme/):
 *   node scripts/apply-homepage-ids-for-staging.js
 */
const fs = require('fs');
const path = require('path');

const themeRoot = path.join(__dirname, '..');
const configPath = path.join(themeRoot, 'config.json');
const stageIdsPath = path.join(themeRoot, 'config.homepage-ids.stage.json');
const examplePath = path.join(themeRoot, 'config.homepage-ids.stage.example.json');

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
console.log('Local only. Before commit or stencil push:');
console.log('  git restore orbooks-theme/config.json');
console.log('After stencil push to staging, re-set Theme Editor to those IDs.');
