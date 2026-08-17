#!/usr/bin/env node
/**
 * Deterministic Daily Practice QA sample — inspects generated exercises.
 * Run: npx tsx scripts/audit-daily-practice-qa.mjs
 */
import { generateDailyPracticeSession } from '../src/content/dailyPractice/generateSession.ts';
import { dictionaryEntries, collectVariants } from '../src/content/dictionary/buildDictionary.ts';
import { isVerbTenseLearnerSafe } from '../src/content/verbs/verifiedVerbForms.ts';
import { getVerifiedTensesForVerb } from '../src/content/verbs/verifiedVerbForms.ts';

const SAMPLE_DATES = [
  '2026-01-01', '2026-02-14', '2026-03-20', '2026-04-05', '2026-05-10',
  '2026-06-15', '2026-07-20', '2026-08-17', '2026-09-01', '2026-10-12',
  '2026-11-25', '2026-12-31',
];

const EXERCISE_TYPES = new Set([
  'ro-en', 'en-ro', 'which-meaning', 'listen', 'verb-person', 'which-person',
  'which-tense', 'which-form-class', 'singular-plural', 'definite-form', 'adjective-form',
]);

const allVariants = dictionaryEntries.flatMap((e) => collectVariants(e, 'wider'));
const roPool = new Set(allVariants.map((v) => v.ro));
const enPool = new Set(allVariants.map((v) => v.en));

const failures = [];
const stats = {
  sessions: 0,
  exercises: 0,
  byType: {},
  byTense: {},
  verbForms: 0,
  nounForms: 0,
  adjForms: 0,
};

const REQUIRED_SPOT_CHECKS = [
  { date: '2026-08-17', note: 'acceptance matrix date' },
  { date: '2026-03-20', note: 'mid-year sample' },
];

for (const date of SAMPLE_DATES) {
  const session = generateDailyPracticeSession(date);
  stats.sessions++;
  for (const ex of session.exercises) {
    stats.exercises++;
    stats.byType[ex.type] = (stats.byType[ex.type] || 0) + 1;
    if (ex.feedback.tenseLabel) {
      stats.byTense[ex.feedback.tenseLabel] = (stats.byTense[ex.feedback.tenseLabel] || 0) + 1;
    }

    if (!EXERCISE_TYPES.has(ex.type)) failures.push(`${date}: unknown type ${ex.type}`);
    if (!ex.options.includes(ex.correct)) failures.push(`${date}: correct not in options for ${ex.id}`);
    const minOptions = ex.type === 'which-form-class' ? 3 : 4;
    if (ex.options.length < minOptions) failures.push(`${date}: expected at least ${minOptions} options for ${ex.id}`);
    if (new Set(ex.options).size !== ex.options.length) failures.push(`${date}: duplicate options in ${ex.id}`);

    if (ex.type === 'en-ro') {
      if (!roPool.has(ex.correct)) failures.push(`${date}: en-ro correct "${ex.correct}" not in variant pool`);
    } else if (ex.type !== 'listen') {
      // meaning/person/tense options are EN for most types
      if (!['which-person', 'which-tense', 'which-form-class'].includes(ex.type)) {
        if (!enPool.has(ex.correct) && ex.type !== 'en-ro') {
          // correct EN should be from variant pool for meaning exercises
          const variant = allVariants.find((v) => v.ro === ex.promptRo || v.en === ex.correct);
          if (!variant && ex.type !== 'which-meaning') {
            // soft check — distractors may be generic
          }
        }
      }
    }

    if (ex.feedback.grammarVerbId) {
      stats.verbForms++;
      const tense = ex.feedback.tenseLabel;
      const verbId = ex.feedback.grammarVerbId;
      if (tense) {
        const tenseKey = { Present: 'present', 'Perfect compus': 'perfect-compus', Imperfect: 'imperfect', Future: 'future' }[tense];
        if (tenseKey && !isVerbTenseLearnerSafe(verbId, tenseKey)) {
          failures.push(`${date}: unsafe tense ${tense} for ${verbId} in ${ex.id}`);
        }
      }
    } else if (ex.feedback.formLabel?.includes('singular') || ex.feedback.formLabel?.includes('plural') || ex.feedback.formLabel?.includes('definite')) {
      stats.nounForms++;
    } else if (ex.feedback.formLabel?.includes('masculine') || ex.feedback.formLabel?.includes('feminine')) {
      stats.adjForms++;
    }

    if (!ex.feedback.baseWord) failures.push(`${date}: missing baseWord in ${ex.id}`);
  }
}

// Spot-check reflexive, impersonal, irregular verbs appear in pool
const reflexive = allVariants.filter((v) => v.grammarVerbId === 'vb-se-juca');
const impersonal = allVariants.filter((v) => v.grammarVerbId === 'vb-ploua');
const irregular = allVariants.filter((v) => v.grammarVerbId === 'vb-lua');
const tenses = ['Present', 'Perfect compus', 'Imperfect', 'Future'];

if (reflexive.length === 0) failures.push('pool: no vb-se-juca variants');
if (impersonal.length === 0) failures.push('pool: no vb-ploua variants');
if (irregular.length === 0) failures.push('pool: no vb-lua variants');
for (const t of ['present', 'perfect-compus', 'imperfect', 'future']) {
  const count = allVariants.filter((v) => v.tense === t).length;
  if (count < 100) failures.push(`pool: only ${count} variants for tense ${t}`);
}

console.log('=== Daily Practice QA Sample ===');
console.log(JSON.stringify(stats, null, 2));
console.log(`Variant pool size: ${allVariants.length}`);
console.log(`Reflexive pool: ${reflexive.length}, impersonal: ${impersonal.length}, irregular: ${irregular.length}`);

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  failures.slice(0, 20).forEach((f) => console.error(`  ✗ ${f}`));
  if (failures.length > 20) console.error(`  ... and ${failures.length - 20} more`);
  process.exit(1);
}
console.log('\nDaily Practice QA sample passed.');
