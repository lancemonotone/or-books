import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');

function readYaml(name) {
  return yaml.load(fs.readFileSync(path.join(dataDir, name), 'utf8'));
}

function writeYaml(name, data) {
  fs.writeFileSync(path.join(dataDir, name), yaml.dump(data, { lineWidth: -1, noRefs: true }), 'utf8');
}

function readJson(name) {
  const raw = fs.readFileSync(path.join(dataDir, name), 'utf8');
  return JSON.parse(raw);
}

function writeJson(name, data) {
  fs.writeFileSync(path.join(dataDir, name), `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function mapRef(value, idToKey, keySet, label) {
  const id = String(value);
  if (keySet.has(id)) {
    return id;
  }
  const key = idToKey.get(id);
  if (!key) {
    throw new Error(`Unknown Issue id ${id} while migrating ${label}.`);
  }
  return key;
}

const issues = readYaml('issues.yaml');
if (!Array.isArray(issues)) {
  throw new Error('issues.yaml must be an array.');
}

const idToKey = new Map();
const keySet = new Set();

for (const issue of issues) {
  if (!issue.key) {
    issue.key = crypto.randomUUID();
  }
  issue.key = String(issue.key);
  issue.id = String(issue.id);
  idToKey.set(String(issue.id), issue.key);
  keySet.add(issue.key);
}

const evidence = readYaml('evidence.yaml');
if (!Array.isArray(evidence)) {
  throw new Error('evidence.yaml must be an array.');
}

for (const row of evidence) {
  row.issues = (row.issues || []).map((id) => mapRef(id, idToKey, keySet, `evidence ${row.file}`));
}

const decisions = readYaml('decisions.yaml');
if (!Array.isArray(decisions)) {
  throw new Error('decisions.yaml must be an array.');
}

for (const decision of decisions) {
  decision.blocks = (decision.blocks || []).map((id) =>
    mapRef(id, idToKey, keySet, `decision ${decision.id} blocks`)
  );
}

const commentsPath = 'responses/comments.json';
const comments = readJson(commentsPath);
const nextComments = {};
for (const [id, record] of Object.entries(comments || {})) {
  nextComments[mapRef(id, idToKey, keySet, 'comments.json')] = record;
}

writeYaml(
  'issues.yaml',
  issues.map((issue) => {
    const { key, id, sprint, ...rest } = issue;
    return { key: String(key), id: String(id), sprint: Number(sprint), ...rest };
  })
);
writeYaml('evidence.yaml', evidence);
writeYaml('decisions.yaml', decisions);
writeJson(commentsPath, nextComments);

console.log(`Migrated ${issues.length} issues to stable keys.`);
