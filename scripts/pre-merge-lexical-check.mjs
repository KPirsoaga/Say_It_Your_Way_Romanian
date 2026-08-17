#!/usr/bin/env node
/**
 * Pre-merge lexical UX checks — run: npx tsx scripts/pre-merge-lexical-check.mjs
 */
import { dictionaryEntries, dictionaryFormAliases, resolveDictionarySearch } from '../src/content/dictionary/buildDictionary.ts';
import { nounFamilyCandidateRegistry } from '../src/content/dictionary/nounFamilyBuilder.ts';
import { entryHasLearnerWordFamily } from '../src/content/dictionary/familyUtils.ts';
import { generateDailyPracticeSession } from '../src/content/dailyPractice/generateSession.ts';
import { runLexicalRepairAudit } from '../src/content/dictionary/lexicalAudit.ts';
import { getAvailableTenses } from '../src/content/verbs/canonicalVerbTenses.ts';
import { grammarVerbs } from '../src/content/verbs/canonicalVerbs.ts';
import { verifiedVerbTenses } from '../src/content/verbs/verifiedVerbForms.ts';
import { verifiedNounFamilies } from '../src/content/dictionary/verifiedLexicalFamilies.ts';

const failures = [];

function ok(label) {
  console.log(`✓ ${label}`);
}

function fail(label, detail) {
  failures.push(`${label}: ${detail}`);
  console.log(`✗ ${label}: ${detail}`);
}

// 1. Fake noun families quarantined — pattern candidates must not appear as verified
const cort = dictionaryEntries.find((e) => e.headwordRo === 'cort');
if (cort?.familyComplete && !verifiedNounFamilies.cort) {
  fail('cort noun family', 'marked complete without dexonline verification');
} else if (verifiedNounFamilies.cort?.family.plural?.ro === 'corturi') {
  ok('cort verified family restored from dexonline');
} else {
  fail('cort', 'verified family missing or incomplete');
}

const caine = dictionaryEntries.find((e) => e.headwordRo === 'câine');
if (!caine?.familyComplete || caine.nounFamily?.plural?.ro !== 'câini') {
  fail('câine', 'verified family missing');
} else ok('câine verified family intact');

// 2. Verified aliases
for (const q of ['câinii', 'mașina', 'gătesc', 'dorm', 'merg']) {
  const hits = resolveDictionarySearch(q);
  if (hits.length === 0) fail(`search ${q}`, 'no match');
  else ok(`search "${q}" -> ${hits[0].entry.headwordRo}`);
}

// 3. Unsafe pattern-only aliases must not resolve incorrectly
for (const q of ['construiesc']) {
  const hits = resolveDictionarySearch(q);
  const construi = hits.find((h) => h.entry.headwordRo === 'a construi');
  if (construi?.alias) ok(`verified alias "${q}" -> a construi`);
  else fail(`search ${q}`, 'expected verified conjugation alias for a construi');
}

// 4. Restored verbs show dexonline-verified conjugations
const merge = dictionaryEntries.find((e) => e.verbFamily?.grammarVerbId === 'vb-merge');
if (!merge?.verbFamily?.present?.length) {
  fail('a merge dictionary', 'missing verified present forms');
} else ok('a merge shows verified present in dictionary');

const dormi = grammarVerbs.find((v) => v.id === 'vb-dormi');
const dormiTenses = dormi ? getAvailableTenses(dormi) : [];
if (dormiTenses.length < 3) {
  fail('vb-dormi', `expected multiple verified tenses, got: ${dormiTenses.join(', ') || 'none'}`);
} else ok(`vb-dormi restored: ${dormiTenses.join(', ')}`);

// 5. All grammar verbs should have at least present verified
const unresolvedVerbs = grammarVerbs.filter((v) => getAvailableTenses(v).length === 0);
if (unresolvedVerbs.length > 0) {
  fail('verb coverage', `${unresolvedVerbs.length} verbs still base-only: ${unresolvedVerbs.map((v) => v.id).join(', ')}`);
} else ok(`all ${grammarVerbs.length} verbs have verified morphology`);

// 6. Base-only entries — no word family section trigger
const perete = dictionaryEntries.find((e) => e.headwordRo === 'perete');
if (perete && !entryHasLearnerWordFamily(perete)) {
  fail('perete', 'should have verified word family after restoration');
} else ok('perete has verified word family');

const extensie = dictionaryEntries.find((e) => e.headwordRo === 'extensie');
if (extensie && entryHasLearnerWordFamily(extensie)) {
  fail('extensie', 'should remain base-only (dexonline lemma mismatch)');
} else ok('extensie correctly base-only (unresolved lemma on dexonline)');

// 7. Daily Practice — multiple days, no duplicate entryIds in session
const entryIdsByDay = new Map();
for (const day of ['2026-08-17', '2026-08-18', '2026-08-19', '2026-08-20', '2026-08-21']) {
  const session = generateDailyPracticeSession(day);
  const ids = session.exercises.map((e) => e.entryId);
  const unique = new Set(ids);
  if (unique.size < Math.min(6, ids.length)) {
    fail(`daily ${day}`, `heavy repetition — only ${unique.size} unique entries in ${ids.length} exercises`);
  }
  const morphOnly = session.exercises.filter((e) => e.feedback.formLabel !== 'headword');
  entryIdsByDay.set(day, { total: ids.length, unique: unique.size, morph: morphOnly.length });
}
ok('Daily Practice sessions spread across entry IDs (5 days checked)');

// 8. Audit — restoration coverage
const audit = runLexicalRepairAudit();
if (audit.verbs.morphologyUnresolved > 0) {
  fail('audit', `${audit.verbs.morphologyUnresolved} verbs still morphology-unresolved`);
} else ok(`audit: ${audit.verbs.withFullTenseCoverage} verbs with full tense coverage, ${audit.verbs.withPartialMorphology} partial`);

if (audit.nouns.fullyVerified < 50) {
  fail('audit', `expected substantial noun restoration, only ${audit.nouns.fullyVerified} fully verified`);
} else ok(`audit: ${audit.nouns.fullyVerified} nouns fully verified`);

console.log('\n--- Summary ---');
console.log(`Verified verbs: ${Object.keys(verifiedVerbTenses).length}`);
console.log(`Verified nouns: ${Object.keys(verifiedNounFamilies).length}`);
console.log(`Aliases: ${dictionaryFormAliases.length}`);
console.log(`Candidate registry (internal): ${Object.keys(nounFamilyCandidateRegistry).length}`);
console.log(JSON.stringify(audit.verbs, null, 2));
console.log('Daily samples:', Object.fromEntries(entryIdsByDay));

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll pre-merge checks passed.');
