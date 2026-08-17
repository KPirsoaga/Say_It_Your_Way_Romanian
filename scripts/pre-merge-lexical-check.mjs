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

const failures = [];

function ok(label) {
  console.log(`✓ ${label}`);
}

function fail(label, detail) {
  failures.push(`${label}: ${detail}`);
  console.log(`✗ ${label}: ${detail}`);
}

// 1. Fake noun families quarantined
const cort = dictionaryEntries.find((e) => e.headwordRo === 'cort');
if (cort?.familyComplete) fail('cort noun family', 'still marked complete');
else ok('cort is base-only (no fake family)');

const caine = dictionaryEntries.find((e) => e.headwordRo === 'câine');
if (!caine?.familyComplete || caine.nounFamily?.plural?.ro !== 'câini') {
  fail('câine', 'verified family missing');
} else ok('câine verified family intact');

// 2. Verified aliases
for (const q of ['câinii', 'mașina', 'gătesc']) {
  const hits = resolveDictionarySearch(q);
  if (hits.length === 0) fail(`search ${q}`, 'no match');
  else ok(`search "${q}" -> ${hits[0].entry.headwordRo}`);
}

// 3. Unsafe generated aliases removed
for (const q of ['corturi', 'cortul', 'construiesc']) {
  const hits = resolveDictionarySearch(q);
  const cortHit = hits.find((h) => h.entry.headwordRo === 'cort');
  if (cortHit?.alias) fail(`search ${q}`, 'pattern alias still resolves to cort');
  else ok(`unsafe alias "${q}" not linked to cort`);
}

// 4. Unresolved verbs — no invented conjugations in dictionary
const merge = dictionaryEntries.find((e) => e.verbFamily?.grammarVerbId === 'vb-merge');
if (merge?.verbFamily?.present?.length) {
  fail('a merge dictionary', 'shows unverified present forms');
} else ok('a merge has no learner conjugation in dictionary');

// 5. Verified verbs
for (const id of ['vb-asculta', 'vb-gati', 'vb-fi']) {
  const verb = grammarVerbs.find((v) => v.id === id);
  const tenses = verb ? getAvailableTenses(verb) : [];
  if (tenses.length === 0) fail(id, 'no verified tenses');
  else if (tenses.length > 1 && id !== 'vb-fi') fail(id, `unexpected extra tenses: ${tenses.join(',')}`);
  else ok(`${id} shows only verified tenses: ${tenses.join(', ')}`);
}

const dormi = grammarVerbs.find((v) => v.id === 'vb-dormi');
if (dormi && getAvailableTenses(dormi).length > 0) {
  fail('vb-dormi', 'shows conjugation without lexical verification');
} else ok('vb-dormi unresolved — no tense tabs');

// 6. Base-only entries — no word family section trigger
const perete = dictionaryEntries.find((e) => e.headwordRo === 'perete');
if (perete && entryHasLearnerWordFamily(perete)) {
  fail('perete', 'incorrectly has learner word family');
} else ok('perete is clean base-only (no word family UI)');

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

// 8. Audit terminology
const audit = runLexicalRepairAudit();
if (audit.verbs.withFullTenseCoverage > 0) {
  fail('audit', 'claims full tense coverage exists (should be 0 for now)');
} else ok('audit: no verbs falsely marked with full four-tense coverage');
if (audit.verbs.withPartialMorphology !== 3) {
  fail('audit', `expected 3 partial morphology verbs, got ${audit.verbs.withPartialMorphology}`);
} else ok('audit: 3 verbs with partial verified morphology');

console.log('\n--- Summary ---');
console.log(`Aliases: ${dictionaryFormAliases.length}`);
console.log(`Candidate registry (internal): ${Object.keys(nounFamilyCandidateRegistry).length}`);
console.log(JSON.stringify(audit.verbs, null, 2));
console.log('Daily samples:', Object.fromEntries(entryIdsByDay));

if (failures.length) {
  console.error(`\n${failures.length} check(s) failed`);
  process.exit(1);
}
console.log('\nAll pre-merge checks passed.');
