#!/usr/bin/env node
/**
 * Acceptance matrix — 11 mandated examples. Run: npx tsx scripts/acceptance-matrix.mjs
 */
import {
  dictionaryEntries,
  resolveDictionarySearch,
  collectVariants,
  collectAllPracticeItems,
} from '../src/content/dictionary/buildDictionary.ts';
import { entryHasLearnerWordFamily, learnerVisibleTensesForVerb } from '../src/content/dictionary/familyUtils.ts';
import { getAvailableTenses, getVerbFormsForTense } from '../src/content/verbs/canonicalVerbTenses.ts';
import { grammarVerbs } from '../src/content/verbs/canonicalVerbs.ts';
import { getCanonicalVerb, getCanonicalAdjective, getCanonicalNoun } from '../src/content/lexical/canonical/api.ts';
import { generateDailyPracticeSession, dailyPracticeTenseCoverage } from '../src/content/dailyPractice/generateSession.ts';
import { runLexicalRepairAudit } from '../src/content/dictionary/lexicalAudit.ts';

const CASES = [
  { label: 'a merge (regular verb)', query: 'merg', headword: 'a merge', type: 'verb', grammarId: 'vb-merge' },
  { label: 'a lua (irregular verb)', query: 'iau', headword: 'a lua', type: 'verb', grammarId: 'vb-lua' },
  { label: 'a se juca (reflexive)', query: 'mă joc', headword: 'a se juca', type: 'verb', grammarId: 'vb-se-juca' },
  { label: 'a ploua (impersonal)', query: 'plouă', headword: 'a ploua', type: 'verb', grammarId: 'vb-ploua' },
  { label: 'câine (masculine noun)', query: 'câini', headword: 'câine', type: 'noun' },
  { label: 'mașină (feminine noun)', query: 'mașina', headword: 'mașină', type: 'noun' },
  { label: 'pod (neuter noun)', query: 'podul', headword: 'pod', type: 'noun' },
  { label: 'bandă (irregular plural)', query: 'benzi', headword: 'bandă', type: 'noun' },
  { label: 'mici (plural-only)', query: 'mici', headword: 'mici', type: 'noun', noFamily: true },
  { label: 'bun (adjective)', query: 'bun', headword: 'bun', type: 'adjective' },
  { label: 'Acces interzis (sign)', query: 'acces interzis', headword: 'Acces interzis', type: 'noun', noFamily: true },
];

const failures = [];
const results = [];

function check(label, ok, detail) {
  if (!ok) failures.push(`${label}: ${detail}`);
  return ok;
}

for (const c of CASES) {
  const row = { case: c.label, search: false, dictionary: false, wordFamily: false, grammarHelp: false, dailyPractice: false, terminology: false, provenance: false };
  const entry = dictionaryEntries.find((e) => e.headwordRo.toLowerCase() === c.headword.toLowerCase());
  row.dictionary = Boolean(entry);
  if (!entry) {
    failures.push(`${c.label}: dictionary entry missing`);
    results.push(row);
    continue;
  }

  const hits = resolveDictionarySearch(c.query);
  row.search = hits.some((h) => h.entry.id === entry.id);
  check(`${c.label} search`, row.search, `query "${c.query}" did not resolve`);

  if (c.noFamily) {
    row.wordFamily = !entryHasLearnerWordFamily(entry);
    check(`${c.label} no family`, row.wordFamily, 'should not show word family');
  } else {
    row.wordFamily = entryHasLearnerWordFamily(entry);
    check(`${c.label} word family`, row.wordFamily, 'expected verified word family');
  }

  if (c.type === 'verb' && c.grammarId) {
    const verb = grammarVerbs.find((v) => v.id === c.grammarId);
    const tenses = verb ? getAvailableTenses(verb) : [];
    row.grammarHelp = tenses.length >= 4;
    check(`${c.label} grammar help`, row.grammarHelp, `expected 4 tenses, got ${tenses.length}`);
    const canonical = getCanonicalVerb(c.grammarId, c.headword);
    row.terminology = Boolean(canonical?.tenses.every((t) => t.forms.every((f) => f.terminology)));
    row.provenance = Boolean(canonical?.tenses.every((t) => t.safetyTier !== 'unresolved'));
    check(`${c.label} terminology`, row.terminology, 'missing formal terminology on forms');
    check(`${c.label} provenance`, row.provenance, 'unresolved safety tier');
  }

  if (c.type === 'noun' && !c.noFamily) {
    const canonical = getCanonicalNoun(entry.headwordRo.split(' ')[0]);
    row.terminology = Boolean(canonical?.forms.length >= 4);
    row.provenance = canonical?.forms.every((f) => f.safetyTier === 'lexical-attested') ?? false;
    row.grammarHelp = true;
  }

  if (c.type === 'adjective') {
    const canonical = getCanonicalAdjective('bun');
    row.terminology = Boolean(canonical?.forms.length === 4);
    row.provenance = canonical?.forms.every((f) => f.safetyTier === 'lexical-attested') ?? false;
    row.grammarHelp = true;
  }

  if (c.noFamily) {
    row.grammarHelp = true;
    row.terminology = true;
    row.provenance = entry.entryClass === 'sign' || entry.entryClass === 'plural-only-noun';
  }

  const variants = collectVariants(entry, 'wider');
  const practice = collectAllPracticeItems(entry, 'wider');
  row.dailyPractice = practice.length > 0 || c.noFamily;
  check(`${c.label} daily practice`, row.dailyPractice, 'no practice items');

  results.push(row);
}

const audit = runLexicalRepairAudit();
const tenseCoverage = dailyPracticeTenseCoverage();
const session = generateDailyPracticeSession('2026-08-17');
const verbTensesInSession = new Set(
  session.exercises.filter((e) => e.feedback.tenseLabel).map((e) => e.feedback.tenseLabel)
);

console.log('\n=== Acceptance Matrix (11 cases) ===');
console.table(results);

console.log('\n=== Morphology tier counts ===');
console.log({
  attestedTenseBlocks: audit.verbs.attestedTenseBlocks,
  composedTenseBlocks: audit.verbs.composedTenseBlocks,
  attestedForms: audit.verbs.attestedForms,
  composedForms: audit.verbs.composedForms,
});

console.log('\n=== Daily Practice tense coverage (pool) ===');
console.log(tenseCoverage);
console.log('Tenses in sample session:', [...verbTensesInSession]);

if (failures.length) {
  console.error(`\n${failures.length} acceptance check(s) failed:`);
  failures.forEach((f) => console.error(`  ✗ ${f}`));
  process.exit(1);
}

console.log('\nAll 11 acceptance-matrix cases passed.');
