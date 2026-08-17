import { dictionaryEntries, collectAllPracticeItems, getCurrentWeeklyTopicId } from '../dictionary';
import { weeklyTopics } from '../weeklyTopics';
import { shuffledMcOptions } from '../../utils/shuffle';
import { GRAMMAR_TENSE_LABELS } from '../dictionary/types';
import { learnerPersonLabel } from '../dictionary/familyUtils';
import { formalGrammarLabel, getCanonicalVerb, getTenseSafetyTier } from '../lexical/canonical';
import { safetyTierLabel } from '../validation/lexicalSafety';
import type { DailyPracticeSession, DailyVariantExercise, DailyVariantExerciseType } from '../dictionary/types';
import type { GrammarTense } from '../../types';

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function seedFromDate(dateStr: string): number {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed = (seed * 31 + dateStr.charCodeAt(i)) % 100000;
  return seed;
}

function pickWeighted<T>(items: T[], rand: () => number): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(rand() * items.length)];
}

function distractorsFor(correct: string, pool: string[], count: number, rand: () => number): string[] {
  const unique = [...new Set(pool.filter((p) => p !== correct))];
  const out: string[] = [];
  while (out.length < count && unique.length > 0) {
    const i = Math.floor(rand() * unique.length);
    out.push(unique.splice(i, 1)[0]!);
  }
  while (out.length < count) out.push('—');
  return out;
}

type PracticeVariant = ReturnType<typeof collectAllPracticeItems>[0];

function variantKey(v: PracticeVariant): string {
  return `${v.entryId}:${v.formLabel}:${v.ro}:${v.tense ?? ''}`;
}

const PERSON_OPTIONS = ['eu / I', 'tu / you', 'el / ea / he / she', 'noi / we', 'voi / you (pl.)', 'ei / ele / they'];
const TENSE_OPTIONS = ['Present', 'Perfect compus', 'Imperfect', 'Future'];

function exerciseTypeForVariant(variant: PracticeVariant, rand: () => number): DailyVariantExerciseType {
  const suitable: DailyVariantExerciseType[] = ['ro-en', 'which-meaning', 'listen'];
  if (variant.formLabel === 'headword') {
    return suitable[Math.floor(rand() * suitable.length)] ?? 'ro-en';
  }
  if (variant.type === 'verb') {
    suitable.push('verb-person', 'which-person', 'which-tense', 'en-ro');
  }
  if (variant.formLabel === 'plural') suitable.push('singular-plural', 'which-form-class');
  if (variant.formLabel.includes('definite')) suitable.push('definite-form', 'which-form-class');
  if (variant.type === 'adjective' && variant.formLabel !== 'masculine singular') {
    suitable.push('adjective-form', 'which-form-class', 'en-ro');
  }
  if (variant.type === 'noun') suitable.push('en-ro', 'which-form-class');
  const unique = [...new Set(suitable)];
  return unique[Math.floor(rand() * unique.length)] ?? 'ro-en';
}

function formalGrammarForVariant(variant: PracticeVariant): string | undefined {
  if (variant.type === 'verb' && variant.grammarVerbId && variant.tense) {
    const canonical = getCanonicalVerb(variant.grammarVerbId);
    const tenseBlock = canonical?.tenses.find((t) => t.tense === variant.tense);
    const form = tenseBlock?.forms.find((f) => f.label === variant.formLabel);
    if (form?.terminology) return formalGrammarLabel(form.terminology);
  }
  if (variant.type === 'noun') {
    if (variant.formLabel === 'plural') return 'plural, indefinite (nominative-accusative)';
    if (variant.formLabel === 'singular') return 'singular, indefinite (nominative-accusative)';
    if (variant.formLabel === 'definite singular') return 'singular, definite (nominative-accusative)';
    if (variant.formLabel === 'definite plural') return 'plural, definite (nominative-accusative)';
  }
  if (variant.type === 'adjective') return variant.formLabel;
  return undefined;
}

function safetyLabelForVariant(variant: PracticeVariant): string | undefined {
  if (variant.type === 'verb' && variant.grammarVerbId && variant.tense) {
    return safetyTierLabel(getTenseSafetyTier(variant.grammarVerbId, variant.tense));
  }
  if (variant.type === 'noun' || variant.type === 'adjective') {
    return safetyTierLabel('lexical-attested');
  }
  return undefined;
}

function buildExercise(
  variant: PracticeVariant,
  allVariants: PracticeVariant[],
  type: DailyVariantExerciseType,
  index: number,
  rand: () => number
): DailyVariantExercise {
  const meaningPool = allVariants.map((v) => v.en);
  const roPool = allVariants.map((v) => v.ro);

  let options: string[];
  let correct: string;
  let promptRo = variant.ro;
  let promptEn: string | undefined;

  switch (type) {
    case 'which-person': {
      correct = learnerPersonLabel(variant.formLabel);
      options = shuffledMcOptions(
        [correct, ...distractorsFor(correct, PERSON_OPTIONS, 3, rand)],
        correct
      );
      break;
    }
    case 'which-tense': {
      correct = variant.tense ? GRAMMAR_TENSE_LABELS[variant.tense] : 'Present';
      options = shuffledMcOptions(
        [correct, ...distractorsFor(correct, TENSE_OPTIONS, 3, rand)],
        correct
      );
      break;
    }
    case 'which-form-class': {
      if (variant.type === 'noun') {
        correct =
          variant.formLabel === 'plural' || variant.formLabel === 'definite plural'
            ? 'plural noun form'
            : variant.formLabel.includes('definite')
              ? 'definite noun form'
              : 'singular noun form';
        options = shuffledMcOptions(
          [correct, 'singular noun form', 'plural noun form', 'definite noun form'].filter(
            (v, i, a) => a.indexOf(v) === i
          ),
          correct
        );
      } else {
        correct = variant.formLabel;
        const adjPool = ['masculine singular', 'feminine singular', 'masculine plural', 'feminine plural'];
        options = shuffledMcOptions([correct, ...distractorsFor(correct, adjPool, 3, rand)], correct);
      }
      break;
    }
    case 'en-ro': {
      promptEn = variant.en;
      promptRo = variant.en;
      correct = variant.ro;
      options = shuffledMcOptions([variant.ro, ...distractorsFor(variant.ro, roPool, 3, rand)], variant.ro);
      break;
    }
    case 'listen': {
      correct = variant.en;
      options = shuffledMcOptions([variant.en, ...distractorsFor(variant.en, meaningPool, 3, rand)], variant.en);
      break;
    }
    case 'verb-person':
    case 'singular-plural':
    case 'definite-form':
    case 'adjective-form':
    case 'which-meaning':
    case 'ro-en':
    default: {
      correct = variant.en;
      options = shuffledMcOptions([variant.en, ...distractorsFor(variant.en, meaningPool, 3, rand)], variant.en);
      break;
    }
  }

  const tenseLabel = variant.tense ? GRAMMAR_TENSE_LABELS[variant.tense] : undefined;
  const plainNote =
    variant.formLabel === 'headword'
      ? `Word: ${variant.ro}`
      : variant.type === 'verb'
        ? `${tenseLabel ?? 'Present'}: ${learnerPersonLabel(variant.formLabel)} — ${variant.ro}`
        : variant.type === 'adjective'
          ? `Form: ${variant.formLabel}`
          : variant.type === 'noun'
            ? `Form: ${variant.formLabel}`
            : undefined;

  return {
    id: `daily-${index}-${variant.ro}-${type}`,
    type,
    promptRo,
    promptEn,
    options,
    correct,
    entryId: variant.entryId,
    feedback: {
      meaning: variant.en,
      baseWord: variant.baseRo,
      baseEn: variant.baseEn,
      formLabel: variant.formLabel,
      tenseLabel,
      formalGrammar: formalGrammarForVariant(variant),
      safetyTierLabel: safetyLabelForVariant(variant),
      wordFamily: variant.wordFamilyChain,
      grammarVerbId: variant.grammarVerbId,
      plainNote,
    },
  };
}

function pickFromPool(
  pool: PracticeVariant[],
  picked: PracticeVariant[],
  rand: () => number,
  preferMorphology: boolean
): PracticeVariant | undefined {
  const available = pool.filter((p) => {
    if (picked.some((x) => variantKey(x) === variantKey(p))) return false;
    if (picked.some((x) => x.entryId === p.entryId)) return false;
    if (preferMorphology && p.formLabel === 'headword') return false;
    if (!preferMorphology && p.formLabel !== 'headword') return false;
    return true;
  });
  let v = pickWeighted(available, rand);
  if (v) return v;
  const fallback = pool.filter(
    (p) => !picked.some((x) => variantKey(x) === variantKey(p)) && !picked.some((x) => x.entryId === p.entryId)
  );
  return pickWeighted(fallback, rand);
}

/** Generate weighted daily variant recognition session */
export function generateDailyPracticeSession(dateStr: string, currentTopicId?: string): DailyPracticeSession {
  const topicId = currentTopicId ?? getCurrentWeeklyTopicId(dateStr);
  const rand = seededRandom(seedFromDate(dateStr));
  const currentIdx = weeklyTopics.findIndex((t) => t.id === topicId);
  const previousTopicIds = weeklyTopics.slice(0, Math.max(0, currentIdx)).map((t) => t.id);

  const weightedVariants: PracticeVariant[] = [];

  dictionaryEntries.forEach((entry) => {
    const fromCurrent = entry.sources.some((s) => s.feature === 'weekly-topic' && s.featureId === topicId);
    const fromPrevious = entry.sources.some((s) => s.feature === 'weekly-topic' && previousTopicIds.includes(s.featureId));
    const weight: 'current' | 'previous' | 'wider' = fromCurrent ? 'current' : fromPrevious ? 'previous' : 'wider';
    weightedVariants.push(...collectAllPracticeItems(entry, weight));
  });

  const currentPool = weightedVariants.filter((v) => v.sourceWeight === 'current');
  const previousPool = weightedVariants.filter((v) => v.sourceWeight === 'previous');
  const widerPool = weightedVariants.filter((v) => v.sourceWeight === 'wider');

  const picked: PracticeVariant[] = [];
  const targets = [5, 2, 1];
  const pools = [currentPool, previousPool, widerPool];

  pools.forEach((pool, i) => {
    for (let n = 0; n < targets[i]!; n++) {
      const morph = pickFromPool(pool, picked, rand, true);
      if (morph) picked.push(morph);
      else {
        const head = pickFromPool(pool, picked, rand, false);
        if (head) picked.push(head);
      }
    }
  });

  while (picked.length < 8) {
    const preferMorph = picked.filter((p) => p.formLabel !== 'headword').length < 4;
    const v =
      pickFromPool(currentPool, picked, rand, preferMorph) ??
      pickFromPool(previousPool, picked, rand, preferMorph) ??
      pickFromPool(widerPool, picked, rand, preferMorph) ??
      pickWeighted(
        weightedVariants.filter((p) => !picked.some((x) => variantKey(x) === variantKey(p))),
        rand
      );
    if (!v) break;
    picked.push(v);
  }

  const exercises = picked.map((v, i) => {
    const type = exerciseTypeForVariant(v, rand);
    return buildExercise(v, weightedVariants, type, i, rand);
  });

  return { date: dateStr, currentTopicId: topicId, exercises };
}

/** Count practice pool coverage by tense for reporting */
export function dailyPracticeTenseCoverage(): Record<GrammarTense | 'headword' | 'noun' | 'adjective', number> {
  const counts: Record<string, number> = {
    present: 0,
    'perfect-compus': 0,
    imperfect: 0,
    future: 0,
    headword: 0,
    noun: 0,
    adjective: 0,
  };
  dictionaryEntries.forEach((entry) => {
    collectAllPracticeItems(entry, 'wider').forEach((v) => {
      if (v.formLabel === 'headword') counts.headword!++;
      else if (v.type === 'noun') counts.noun!++;
      else if (v.type === 'adjective') counts.adjective!++;
      else if (v.tense) counts[v.tense] = (counts[v.tense] ?? 0) + 1;
    });
  });
  return counts as Record<GrammarTense | 'headword' | 'noun' | 'adjective', number>;
}
