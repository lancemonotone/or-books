/**
 * Remap issue phases from theme buckets to P1/P2/P3/Uncategorized
 * using [Pn] markers in comments.json. Leaves comments and priority untouched.
 *
 * Usage: node scripts/migrate-phases-from-pn.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, '../data');

const PN_RE = /\[P([123])\]/g;

function readYaml(name) {
  return yaml.load(fs.readFileSync(path.join(dataDir, name), 'utf8'));
}

function writeYaml(name, data) {
  fs.writeFileSync(
    path.join(dataDir, name),
    yaml.dump(data, { lineWidth: -1, noRefs: true }),
    'utf8'
  );
}

function readJson(name) {
  return JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8'));
}

function compareIssueIds(a, b) {
  const [aPhase = 0, aNum = 0] = String(a.id).split('.').map(Number);
  const [bPhase = 0, bNum = 0] = String(b.id).split('.').map(Number);
  if (aPhase !== bPhase) return aPhase - bPhase;
  return aNum - bNum;
}

function extractPn(record) {
  if (!record) return null;
  const texts = [];
  if (record.text) texts.push(String(record.text));
  for (const message of record.messages || []) {
    if (message?.text) texts.push(String(message.text));
  }
  let last = null;
  for (const text of texts) {
    for (const match of text.matchAll(PN_RE)) {
      last = match[1];
    }
  }
  return last;
}

const issues = readYaml('issues.yaml');
if (!Array.isArray(issues)) {
  throw new Error('issues.yaml must be an array.');
}

const comments = readJson('responses/comments.json');
const buckets = new Map([
  [1, []],
  [2, []],
  [3, []],
  [4, []],
]);

for (const issue of issues) {
  const pn = extractPn(comments[issue.key]);
  const phaseId = pn ? Number(pn) : 4;
  buckets.get(phaseId).push(issue);
}

const nextIssues = [];
const remaps = [];

for (const phaseId of [1, 2, 3, 4]) {
  const group = buckets.get(phaseId).slice().sort(compareIssueIds);
  group.forEach((issue, index) => {
    const oldId = String(issue.id);
    const oldSprint = Number(issue.sprint);
    const newId = `${phaseId}.${index + 1}`;
    issue.sprint = phaseId;
    issue.id = newId;
    nextIssues.push(issue);
    remaps.push({
      key: issue.key,
      title: issue.title,
      oldId,
      oldSprint,
      newId,
      newSprint: phaseId,
      priority: issue.priority,
    });
  });
}

const audit = readYaml('audit.yaml');
audit.updated = new Date().toISOString().slice(0, 10);
audit.sprints = [
  {
    id: 1,
    title: 'First wave',
    subtitle: 'Delivery wave 1',
    description: 'Issues assigned to the first delivery wave.\n',
  },
  {
    id: 2,
    title: 'Second wave',
    subtitle: 'Delivery wave 2',
    description: 'Issues assigned to the second delivery wave.\n',
  },
  {
    id: 3,
    title: 'Third wave',
    subtitle: 'Delivery wave 3',
    description: 'Issues assigned to the third delivery wave.\n',
  },
  {
    id: 4,
    title: 'Uncategorized',
    subtitle: 'Needs a phase',
    description: 'Issues not yet assigned to Phase 1, 2, or 3.\n',
  },
];

writeYaml(
  'issues.yaml',
  nextIssues.map((issue) => {
    const { key, id, sprint, ...rest } = issue;
    return { key: String(key), id: String(id), sprint: Number(sprint), ...rest };
  })
);
writeYaml('audit.yaml', audit);

const counts = { 1: 0, 2: 0, 3: 0, 4: 0 };
for (const row of remaps) counts[row.newSprint] += 1;

console.log('Migrated phases from comment [Pn] markers.');
console.log(
  `Phase 1: ${counts[1]}, Phase 2: ${counts[2]}, Phase 3: ${counts[3]}, Uncategorized: ${counts[4]}`
);
console.log('Priority and comments left unchanged.');
for (const row of remaps) {
  const moved = row.oldSprint !== row.newSprint || row.oldId !== row.newId;
  if (moved) {
    console.log(
      `  ${row.oldId} (theme ${row.oldSprint}) -> ${row.newId}  [${row.priority}]  ${row.title}`
    );
  }
}
