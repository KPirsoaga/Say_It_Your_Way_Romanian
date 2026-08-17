#!/usr/bin/env node
/**
 * Audit every static Romanian MCQ option/distractor in Weekly Topics.
 * Run: npx tsx scripts/audit-mcq-distractors.mjs
 */
import { weeklyTopics } from '../src/content/weeklyTopics/index.ts';
import { dictionaryEntries } from '../src/content/dictionary/buildDictionary.ts';

const headwords = new Set(dictionaryEntries.map((e) => e.headwordRo.toLowerCase()));
const aliases = new Set();
dictionaryEntries.forEach((e) => {
  headwords.add(e.headwordRo.toLowerCase());
  if (e.nounFamily?.plural?.ro) aliases.add(e.nounFamily.plural.ro.toLowerCase());
  if (e.nounFamily?.definiteSingular?.ro) aliases.add(e.nounFamily.definiteSingular.ro.toLowerCase());
  if (e.adjectiveFamily?.feminineSingular?.ro) aliases.add(e.adjectiveFamily.feminineSingular.ro.toLowerCase());
  e.verbFamily?.present?.forEach((f) => aliases.add(f.ro.toLowerCase()));
});

// Vocab from all topics
const vocabRo = new Set();
weeklyTopics.forEach((t) => {
  t.vocabulary.forEach((v) => vocabRo.add(v.ro.toLowerCase()));
  t.exercises.roToEn.forEach((q) => vocabRo.add(q.prompt.toLowerCase()));
  t.exercises.enToRo.forEach((q) => vocabRo.add(q.correct.toLowerCase()));
  t.exercises.matching.forEach((m) => vocabRo.add(m.ro.toLowerCase()));
  t.exercises.sortItems.forEach((s) => vocabRo.add(s.ro.toLowerCase()));
});

const distractors = [];
const failures = [];

weeklyTopics.forEach((topic) => {
  const addMcq = (q, kind) => {
    q.options.forEach((opt) => {
      distractors.push({
        topic: topic.title,
        kind,
        prompt: q.prompt,
        correct: q.correct,
        option: opt,
        isCorrect: opt === q.correct,
      });
    });
  };
  topic.exercises.roToEn.forEach((q) => addMcq(q, 'ro-en'));
  topic.exercises.enToRo.forEach((q) => addMcq(q, 'en-ro'));
});

// Romanian distractors are en-ro options only (ro-en options are English)
const roDistractors = distractors.filter((d) => d.kind === 'en-ro');

const invented = [];
const duplicateCorrect = [];

for (const d of roDistractors) {
  const opt = d.option.toLowerCase();
  const inVocab = vocabRo.has(opt);
  const inDict = headwords.has(opt) || aliases.has(opt);
  // Phrases and multi-word allowed if in vocab
  if (!inVocab && !inDict && !d.isCorrect) {
    // Check if it's a substring match in vocab (e.g. "a săpa" vs "săpa")
    const partial = [...vocabRo].some((v) => v.includes(opt) || opt.includes(v));
    if (!partial) invented.push(d);
  }
  // Wrong option must not equal correct for another question with same prompt class
}

// en-ro: all options should be in topic vocab
for (const d of roDistractors) {
  if (!vocabRo.has(d.option.toLowerCase()) && !headwords.has(d.option.toLowerCase())) {
    // Allow phrase-level options from vocab list
    const found = weeklyTopics
      .flatMap((t) => t.vocabulary)
      .some((v) => v.ro.toLowerCase() === d.option.toLowerCase());
    if (!found && !d.isCorrect) {
      failures.push(`${d.topic} en-ro "${d.prompt}" distractor "${d.option}" not in topic vocab`);
    }
  }
}

console.log(`MCQ distractors audited: ${distractors.length} total, ${roDistractors.length} Romanian options`);
console.log(`Romanian distractors checked: ${roDistractors.length}`);

if (invented.length) {
  console.log('Potentially invented (needs review):');
  invented.slice(0, 10).forEach((d) => console.log(`  ? ${d.topic}: "${d.option}" for "${d.prompt}"`));
}

if (failures.length) {
  console.error(`\n${failures.length} failure(s):`);
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  process.exit(1);
}
console.log('All MCQ Romanian distractors trace to topic vocabulary.');
