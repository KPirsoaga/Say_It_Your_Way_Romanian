#!/usr/bin/env node
/**
 * Repository-level Romanian Language QA — orchestrates all mandatory language checks.
 * Run: npm run language:qa
 * See: docs/LANGUAGE_DATA_GOVERNANCE.md
 */
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const ROOT = dirname(fileURLToPath(import.meta.url));

const CHECKS = [
  { name: 'Pre-merge lexical safety', script: 'pre-merge-lexical-check.mjs' },
  { name: 'Language governance enforcement', script: 'language-governance-check.mjs' },
  { name: 'Acceptance matrix (11 cases)', script: 'acceptance-matrix.mjs' },
  { name: 'Language audit inventory', script: 'language-audit-inventory.mjs' },
  { name: 'Grammar Help examples', script: 'audit-grammar-examples.mjs' },
  { name: 'Daily Practice QA sample', script: 'audit-daily-practice-qa.mjs' },
  { name: 'MCQ distractor audit', script: 'audit-mcq-distractors.mjs' },
  { name: 'QR/share pass-through audit', script: 'audit-qr-share.mjs' },
];

console.log('=== Romanian Language QA ===\n');
console.log('Policy: docs/LANGUAGE_DATA_GOVERNANCE.md');
console.log('Note: Automated QA does not replace external verification for new Romanian prose.\n');

const results = [];

for (const check of CHECKS) {
  process.stdout.write(`▶ ${check.name}... `);
  const scriptPath = join(ROOT, check.script);
  const result = spawnSync('npx', ['tsx', scriptPath], {
    cwd: join(ROOT, '..'),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  if (result.status === 0) {
    console.log('PASS');
    results.push({ name: check.name, status: 'PASS' });
  } else {
    console.log('FAIL');
    if (result.stdout) process.stdout.write(result.stdout);
    if (result.stderr) process.stderr.write(result.stderr);
    results.push({ name: check.name, status: 'FAIL' });
  }
}

console.log('\n=== Language QA Summary ===');
for (const r of results) {
  console.log(`  ${r.status === 'PASS' ? '✓' : '✗'} ${r.name}: ${r.status}`);
}

const failed = results.filter((r) => r.status === 'FAIL');
if (failed.length) {
  console.error(`\n${failed.length} check(s) failed. Language QA: FAIL`);
  process.exit(1);
}

console.log('\nLanguage QA: PASS');
console.log('\nReminder: new authored Romanian sentences still require external/manual verification.');
