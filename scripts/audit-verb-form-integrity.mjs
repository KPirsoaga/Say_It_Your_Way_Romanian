#!/usr/bin/env node
/**
 * Full lexical import integrity audit for verified verb forms.
 * Run: npx tsx scripts/audit-verb-form-integrity.mjs
 * Fix mode: npx tsx scripts/audit-verb-form-integrity.mjs --fix
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { verifiedVerbTenses } from '../src/content/verbs/verifiedVerbForms.ts';
import { canonicalGrammarVerbs } from '../src/content/verbs/canonicalVerbs.ts';
import { canonicalVerbBase } from '../src/content/verbs/canonicalVerbBase.ts';
import { verbTenseSupplement } from '../src/content/verbs/canonicalVerbTenses.ts';
import { cleanMergedForm, extractPrimaryVariant, isLikelyGluedForm } from './lib/dexonline-parser.mjs';

const FIX = process.argv.includes('--fix');
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Build curated ro lookup: verbId → tense → label → ro */
function buildCuratedIndex() {
  const idx = {};
  const add = (verbId, tense, forms) => {
    if (!forms?.length) return;
    if (!idx[verbId]) idx[verbId] = {};
    if (!idx[verbId][tense]) idx[verbId][tense] = {};
    for (const f of forms) {
      idx[verbId][tense][f.label] = f.ro;
    }
  };
  for (const v of canonicalGrammarVerbs) {
    add(v.id, 'present', v.present);
    add(v.id, 'imperfect', v.imperfect);
    add(v.id, 'perfect-compus', v.perfectCompus);
    add(v.id, 'future', v.future);
    const sup = verbTenseSupplement[v.id];
    if (sup) {
      add(v.id, 'present', sup.present);
      add(v.id, 'imperfect', sup.imperfect);
      add(v.id, 'perfect-compus', sup.perfectCompus);
      add(v.id, 'future', sup.future);
    }
  }
  for (const v of canonicalVerbBase) {
    add(v.id, 'present', v.present);
    add(v.id, 'imperfect', v.imperfect);
    const sup = verbTenseSupplement[v.id];
    if (sup) {
      add(v.id, 'present', sup.present);
      add(v.id, 'imperfect', sup.imperfect);
      add(v.id, 'perfect-compus', sup.perfectCompus);
      add(v.id, 'future', sup.future);
    }
  }
  return idx;
}

const curated = buildCuratedIndex();

const ISSUE = {
  HTML_ENTITY: 'html-entity',
  NB_HYPHEN: 'nb-hyphen-artifact',
  DUPLICATE_STEM: 'duplicate-stem',
  REPEATED_FULL: 'repeated-full-form',
  CONCAT_VARIANT: 'concatenated-variant',
  UNEXPECTED_PUNCT: 'unexpected-punctuation',
  WHITESPACE: 'whitespace-artifact',
  MERGED_VARIANT: 'merged-variants',
};

function tokenIssues(token) {
  const issues = [];
  if (!token) return issues;
  if (/&#x|&#\d|&[a-z]+;/i.test(token)) issues.push(ISSUE.HTML_ENTITY);
  if (/\u2011/.test(token) || /&#x2011/i.test(token)) issues.push(ISSUE.NB_HYPHEN);
  if (isLikelyGluedForm(token)) issues.push(ISSUE.CONCAT_VARIANT);
  if (token.length >= 8) {
    for (let len = Math.floor(token.length / 2); len >= 4; len--) {
      const a = token.slice(0, len);
      const b = token.slice(len);
      if (a === b) {
        issues.push(ISSUE.DUPLICATE_STEM, ISSUE.REPEATED_FULL);
        break;
      }
    }
  }
  return issues;
}

function detectIssues(ro) {
  const issues = [];
  if (!ro) return issues;
  if (/&#x|&#\d|&[a-z]+;/i.test(ro)) issues.push(ISSUE.HTML_ENTITY);
  if (/\u2011/.test(ro) || /&#x2011/i.test(ro)) issues.push(ISSUE.NB_HYPHEN);
  if (/^\s|\s$/.test(ro)) issues.push(ISSUE.WHITESPACE);
  if (/\s{2,}/.test(ro)) issues.push(ISSUE.WHITESPACE);
  if (/[|<>]/.test(ro)) issues.push(ISSUE.UNEXPECTED_PUNCT);

  const primary = extractPrimaryVariant(ro);
  if (primary !== ro) issues.push(ISSUE.MERGED_VARIANT);

  for (const token of ro.split(/\s+/)) {
    issues.push(...tokenIssues(token));
  }

  return [...new Set(issues)];
}

function proposeFix(verbId, tense, label, ro) {
  const curatedRo = curated[verbId]?.[tense]?.[label];
  const cleaned = cleanMergedForm(ro);
  const primary = extractPrimaryVariant(ro);

  if (curatedRo && curatedRo === ro) return null;
  if (curatedRo && curatedRo !== ro) return curatedRo;
  if (cleaned && cleaned !== ro && !isLikelyGluedForm(cleaned)) return cleaned;
  if (primary && primary !== ro && primary.length < ro.length && !isLikelyGluedForm(primary)) return primary;
  return null;
}

const corrupted = [];
const suspicious = [];
let totalForms = 0;
const corrections = [];

for (const [verbId, tenses] of Object.entries(verifiedVerbTenses)) {
  for (const t of tenses) {
    for (const f of t.forms) {
      totalForms++;
      const issues = detectIssues(f.ro);
      const entry = {
        verbId,
        tense: t.tense,
        label: f.label,
        ro: f.ro,
        en: f.en,
        issues,
      };

      if (issues.length > 0) {
        const fix = proposeFix(verbId, t.tense, f.label, f.ro);
        if (fix && fix !== f.ro) {
          corrections.push({ ...entry, fixed: fix });
        } else if (issues.some((i) => [ISSUE.HTML_ENTITY, ISSUE.DUPLICATE_STEM, ISSUE.REPEATED_FULL, ISSUE.MERGED_VARIANT, ISSUE.CONCAT_VARIANT].includes(i))) {
          corrupted.push(entry);
        } else {
          suspicious.push(entry);
        }
      }
    }
  }
}

console.log('=== Verb Form Integrity Audit ===\n');
console.log(`Total verb forms checked: ${totalForms}`);
console.log(`Corrupted forms found: ${corrupted.length + corrections.length}`);
console.log(`Forms corrected (auto-fix available): ${corrections.length}`);
console.log(`Remaining suspicious (no safe auto-fix): ${suspicious.length + corrupted.length}`);
console.log('');

if (corrections.length) {
  console.log('Sample before/after corrections:');
  corrections.slice(0, 15).forEach((c) => {
    console.log(`  ${c.verbId} ${c.tense} ${c.label}:`);
    console.log(`    BEFORE: ${c.ro}`);
    console.log(`    AFTER:  ${c.fixed}`);
    console.log(`    ISSUES: ${c.issues.join(', ')}`);
  });
  if (corrections.length > 15) console.log(`  ... and ${corrections.length - 15} more`);
}

if (suspicious.length) {
  console.log('\nRemaining suspicious forms:');
  suspicious.slice(0, 10).forEach((s) => {
    console.log(`  ${s.verbId} ${s.tense} ${s.label}: "${s.ro}" [${s.issues.join(', ')}]`);
  });
}

if (corrupted.length) {
  console.log('\nCorrupted without safe fix:');
  corrupted.forEach((c) => {
    console.log(`  ${c.verbId} ${c.tense} ${c.label}: "${c.ro}" [${c.issues.join(', ')}]`);
  });
}

if (corrections.length === 0 && corrupted.length === 0 && suspicious.length === 0) {
  console.log('No integrity issues detected.');
}

if (FIX && (corrections.length > 0 || corrupted.length > 0)) {
  console.log('\nApplying fixes via cache sanitize + migrate...');
  const { execSync } = await import('node:child_process');
  execSync('npx tsx scripts/sanitize-dexonline-cache.mjs', { cwd: ROOT, stdio: 'inherit' });
  execSync('npx tsx scripts/migrate-canonical-from-cache.ts', { cwd: ROOT, stdio: 'inherit' });
  console.log('Regeneration complete. Re-run audit to verify.');
}

if (corrupted.length > 0) process.exit(1);
if (corrections.length > 0 && !FIX) {
  console.log('\nRun with --fix to apply corrections.');
  process.exit(1);
}
