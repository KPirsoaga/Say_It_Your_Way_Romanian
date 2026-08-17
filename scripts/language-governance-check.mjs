#!/usr/bin/env node
/**
 * Language governance enforcement — bypass detection, provenance rules, regression tests.
 * Run: npx tsx scripts/language-governance-check.mjs
 * See: docs/LANGUAGE_DATA_GOVERNANCE.md
 */
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dictionaryEntries, dictionaryFormAliases, resolveDictionarySearch, collectVariants } from '../src/content/dictionary/buildDictionary.ts';
import { grammarVerbs } from '../src/content/verbs/canonicalVerbs.ts';
import { getVerbFormsForTense } from '../src/content/verbs/canonicalVerbTenses.ts';
import { getLearnerSafeVerbForms, isVerbTenseLearnerSafe, verifiedVerbTenses } from '../src/content/verbs/verifiedVerbForms.ts';
import { verifiedNounFamilies } from '../src/content/dictionary/verifiedLexicalFamilies.ts';
import { generateDailyPracticeSession } from '../src/content/dailyPractice/generateSession.ts';
import { entryHasLearnerWordFamily } from '../src/content/dictionary/familyUtils.ts';
import { isLikelyGluedForm } from './lib/dexonline-parser.mjs';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const failures = [];

function ok(label) {
  console.log(`✓ ${label}`);
}

function fail(label, detail) {
  failures.push(`${label}: ${detail}`);
  console.log(`✗ ${label}: ${detail}`);
}

// --- 1. Forbidden imports in learner-facing code ---
const LEARNER_FACING_DIRS = [
  'src/pages',
  'src/components',
  'src/content/dailyPractice',
  'src/content/weeklyTopics',
];

const LEARNER_FACING_FILES = [
  'src/content.ts',
  'src/content/additions.ts',
  'src/content/grammar.ts',
  'src/content/grammarExtended.ts',
  'src/content/grammarCheatSheets.ts',
  'src/content/grammarTenseGuides.ts',
  'src/content/grammarSentencePatterns.ts',
  'src/content/grammarPartsOfSpeech.ts',
  'src/content/dictionary/buildDictionary.ts',
  'src/content/dictionary/familyUtils.ts',
  'src/content/lexical/canonical/api.ts',
];

const FORBIDDEN_IMPORT_PATTERNS = [
  /from\s+['"].*nounFamilyBuilder/,
  /nounFamilyCandidateRegistry/,
  /nounFamilyRegistry/,
  /weeklyVerbCandidateBuilders/,
  /buildNounFamilyRegistry/,
  /from\s+['"].*curatedFamilies/,
];

const ALLOWED_FORBIDDEN_PATHS = new Set([
  'src/content/dictionary/lexicalAudit.ts',
  'src/content/dictionary/essentialGrammarValidation.ts',
  'src/content/verbs/canonicalVerbs.ts',
]);

function collectTsFiles(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'node_modules' || name === 'dist') continue;
      out.push(...collectTsFiles(p));
    } else if (/\.(ts|tsx)$/.test(name)) {
      out.push(p);
    }
  }
  return out;
}

const scanFiles = [
  ...LEARNER_FACING_FILES.map((f) => join(ROOT, f)),
  ...LEARNER_FACING_DIRS.flatMap((d) => collectTsFiles(join(ROOT, d))),
];

let forbiddenImports = 0;
for (const file of scanFiles) {
  const rel = relative(ROOT, file);
  if (ALLOWED_FORBIDDEN_PATHS.has(rel)) continue;
  const src = readFileSync(file, 'utf8');
  for (const pat of FORBIDDEN_IMPORT_PATTERNS) {
    if (pat.test(src)) {
      fail(`forbidden import in ${rel}`, `matches ${pat}`);
      forbiddenImports++;
    }
  }
}
if (forbiddenImports === 0) ok('no forbidden pattern-generator imports in learner-facing code');

// --- 2. Composed tenses must not be labelled lexical-attested ---
let mislabelledComposed = 0;
for (const [verbId, tenses] of Object.entries(verifiedVerbTenses)) {
  for (const t of tenses) {
    if ((t.tense === 'perfect-compus' || t.tense === 'future') && t.safetyTier === 'lexical-attested') {
      fail(`provenance mislabel ${verbId} ${t.tense}`, 'composed tense labelled lexical-attested');
      mislabelledComposed++;
    }
    if (t.safetyTier === 'unresolved') {
      fail(`unresolved verb tense ${verbId} ${t.tense}`, 'unresolved in verified registry');
      mislabelledComposed++;
    }
  }
}
if (mislabelledComposed === 0) ok('composed tenses correctly labelled; no unresolved verb tenses in registry');

// --- 3. Verified noun families registry integrity ---
for (const [head] of Object.entries(verifiedNounFamilies)) {
  const fam = verifiedNounFamilies[head];
  if (!fam?.family?.singular?.ro) {
    fail(`verified noun ${head}`, 'missing singular form in verified registry');
  }
}
ok(`verified noun families registry intact (${Object.keys(verifiedNounFamilies).length} entries)`);

// --- 4. Grammar Help must not fall back to pattern-inferred present ---
let patternLeak = 0;
for (const verb of grammarVerbs) {
  if (!isVerbTenseLearnerSafe(verb.id, 'present')) continue;
  const verified = getLearnerSafeVerbForms(verb.id, 'present');
  const displayed = getVerbFormsForTense(verb, 'present');
  if (!verified?.length) {
    fail(`grammar ${verb.id}`, 'learner-safe present but no verified forms');
    patternLeak++;
    continue;
  }
  if (!displayed?.length) {
    fail(`grammar ${verb.id}`, 'getVerbFormsForTense returned empty for learner-safe present');
    patternLeak++;
    continue;
  }
  // First person form must match verified, not pattern stub
  const vEu = verified.find((f) => f.label === 'eu')?.ro;
  const dEu = displayed.find((f) => f.label === 'eu')?.ro;
  if (vEu && dEu && vEu !== dEu) {
    fail(`grammar ${verb.id}`, `present eu mismatch verified=${vEu} displayed=${dEu} (pattern leak?)`);
    patternLeak++;
  }
}
if (patternLeak === 0) ok('Grammar Help present tense uses verified forms only (no pattern fallback leak)');

// --- 5. Search aliases resolve to verified entries ---
const GOLDEN_SEARCH = [
  { q: 'avem', head: 'a avea' },
  { q: 'câinii', head: 'câine' },
  { q: 'bună', head: 'bun' },
  { q: 'mici', head: 'mici' },
];
for (const { q, head } of GOLDEN_SEARCH) {
  const hits = resolveDictionarySearch(q);
  if (!hits.length) {
    fail(`search ${q}`, 'no match');
    continue;
  }
  if (hits[0].entry.headwordRo !== head) {
    fail(`search ${q}`, `expected ${head}, got ${hits[0].entry.headwordRo}`);
  } else {
    ok(`golden search "${q}" → ${head}`);
  }
}

// --- 6. Word Family preserved for golden entries ---
const caine = dictionaryEntries.find((e) => e.headwordRo === 'câine');
const avea = dictionaryEntries.find((e) => e.headwordRo === 'a avea');
const bun = dictionaryEntries.find((e) => e.headwordRo === 'bun');
if (!caine || !entryHasLearnerWordFamily(caine)) fail('word family', 'câine missing verified family');
else ok('câine Word Family present');
if (!avea?.verbFamily?.present?.length) fail('word family', 'a avea missing verified conjugations');
else ok('a avea Word Family present');
if (!bun || !bun.familyComplete) fail('word family', 'bun missing verified adjective family');
else ok('bun Word Family present');

// --- 7. Daily Practice includes morphology (not headword-only) ---
const session = generateDailyPracticeSession('2026-08-17');
const morphExercises = session.exercises.filter((e) => e.feedback.formLabel !== 'headword');
if (morphExercises.length < 4) {
  fail('daily practice', `only ${morphExercises.length} morphology exercises (headword-only regression?)`);
} else {
  ok(`Daily Practice morphology exercises: ${morphExercises.length}/${session.exercises.length}`);
}

// --- 8. Daily Practice variants trace to canonical pool ---
const pool = new Set(dictionaryEntries.flatMap((e) => collectVariants(e, 'wider')).map((v) => v.ro));
for (const ex of session.exercises) {
  if (ex.type === 'en-ro' && !pool.has(ex.correct)) {
    fail(`daily ${ex.id}`, `en-ro correct "${ex.correct}" outside canonical variant pool`);
  }
}
ok('Daily Practice en-ro answers trace to canonical variant pool');

// --- 9. Alias count sanity — all aliases point to entries with verified families or verbs ---
let badAliases = 0;
for (const alias of dictionaryFormAliases) {
  const entry = dictionaryEntries.find((e) => e.id === alias.entryId);
  if (!entry) {
    fail(`alias ${alias.ro}`, 'orphan alias');
    badAliases++;
    continue;
  }
  if (entry.type === 'verb' && !entry.verbFamily?.grammarVerbId) {
    fail(`alias ${alias.ro}`, 'verb alias without verified verb family');
    badAliases++;
  } else if (entry.type === 'noun' && !entry.familyComplete) {
    fail(`alias ${alias.ro}`, 'noun alias without complete verified family');
    badAliases++;
  } else if (entry.type === 'adjective' && !entry.familyComplete) {
    fail(`alias ${alias.ro}`, 'adjective alias without complete verified family');
    badAliases++;
  }
}
if (badAliases === 0) ok(`all ${dictionaryFormAliases.length} search aliases trace to verified morphology`);

// --- 10. No corrupted dexonline merge artifacts in verified verb forms ---
let corruptedForms = 0;
for (const [verbId, tenses] of Object.entries(verifiedVerbTenses)) {
  for (const t of tenses) {
    for (const f of t.forms) {
      if (/&#x|&#\d|&[a-z]+;/i.test(f.ro)) {
        fail(`corrupted form ${verbId} ${t.tense} ${f.label}`, f.ro);
        corruptedForms++;
      }
      for (const token of f.ro.split(/\s+/)) {
        if (isLikelyGluedForm(token)) {
          fail(`glued variant form ${verbId} ${t.tense} ${f.label}`, token);
          corruptedForms++;
        }
      }
    }
  }
}
if (corruptedForms === 0) ok('no corrupted merge artifacts in verified verb forms');

const fiPresent = verifiedVerbTenses['vb-fi']?.find((t) => t.tense === 'present')?.forms;
if (!fiPresent || fiPresent[0]?.ro !== 'sunt' || fiPresent[2]?.ro !== 'este') {
  fail('vb-fi present', `expected sunt/este, got ${fiPresent?.map((f) => f.ro).join(', ')}`);
} else {
  ok('vb-fi present: sunt, ești, este, suntem (no merge artifacts)');
}

// --- 11. Governance doc exists ---
const govPath = join(ROOT, 'docs/LANGUAGE_DATA_GOVERNANCE.md');
if (!readFileSync(govPath, 'utf8').includes('AI confidence is not verification')) {
  fail('governance doc', 'missing core principle');
} else {
  ok('docs/LANGUAGE_DATA_GOVERNANCE.md present');
}

console.log('\n--- Governance check summary ---');
if (failures.length) {
  console.error(`\n${failures.length} governance check(s) failed`);
  process.exit(1);
}
console.log('\nAll language governance checks passed.');
