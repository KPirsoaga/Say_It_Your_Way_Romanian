import { dictionaryEntries, collectVariants } from '../dictionary';
import { weeklyTopics } from '../weeklyTopics';
import { shuffledMcOptions } from '../../utils/shuffle';
import type { DailyPracticeSession, DailyVariantExercise, DailyVariantExerciseType } from '../dictionary/types';

const CURRENT_TOPIC_ID = 'building-cabin';

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

function distractorsFor(variantEn: string, pool: string[], count = 3): string[] {
  const unique = [...new Set(pool.filter((p) => p !== variantEn))];
  const out: string[] = [];
  while (out.length < count && unique.length > 0) {
    const i = Math.floor(Math.random() * unique.length);
    out.push(unique.splice(i, 1)[0]!);
  }
  while (out.length < count) out.push('—');
  return out;
}

function exerciseTypeForVariant(variant: ReturnType<typeof collectVariants>[0]): DailyVariantExerciseType {
  if (variant.type === 'verb') return 'which-meaning';
  if (variant.formLabel === 'plural') return 'singular-plural';
  if (variant.formLabel.includes('definite')) return 'definite-form';
  if (variant.type === 'adjective' && variant.formLabel !== 'masculine singular') return 'adjective-form';
  return 'which-meaning';
}

function buildExercise(
  variant: ReturnType<typeof collectVariants>[0],
  allVariants: ReturnType<typeof collectVariants>,
  index: number
): DailyVariantExercise {
  const type = exerciseTypeForVariant(variant);
  const meaningPool = allVariants.map((v) => v.en);
  const wrong = distractorsFor(variant.en, meaningPool);
  const options = shuffledMcOptions([variant.en, ...wrong], variant.en);

  const plainNote =
    variant.type === 'adjective'
      ? `Base word: ${variant.baseRo}. Form shown: ${variant.formLabel}.`
      : variant.type === 'verb'
        ? `Present: ${variant.formLabel} ${variant.ro}`
        : undefined;

  return {
    id: `daily-${index}-${variant.ro}`,
    type,
    promptRo: variant.ro,
    options,
    correct: variant.en,
    entryId: variant.entryId,
    feedback: {
      meaning: variant.en,
      baseWord: variant.baseRo,
      baseEn: variant.baseEn,
      formLabel: variant.formLabel,
      wordFamily: variant.wordFamilyChain,
      grammarVerbId: variant.grammarVerbId,
      plainNote,
    },
  };
}

/** Generate weighted daily variant recognition session */
export function generateDailyPracticeSession(dateStr: string, currentTopicId = CURRENT_TOPIC_ID): DailyPracticeSession {
  const rand = seededRandom(seedFromDate(dateStr));
  const currentIdx = weeklyTopics.findIndex((t) => t.id === currentTopicId);
  const previousTopicIds = weeklyTopics.slice(0, Math.max(0, currentIdx)).map((t) => t.id);

  const weightedVariants: ReturnType<typeof collectVariants> = [];

  dictionaryEntries.forEach((entry) => {
    const fromCurrent = entry.sources.some((s) => s.feature === 'weekly-topic' && s.featureId === currentTopicId);
    const fromPrevious = entry.sources.some((s) => s.feature === 'weekly-topic' && previousTopicIds.includes(s.featureId));
    const weight: 'current' | 'previous' | 'wider' = fromCurrent ? 'current' : fromPrevious ? 'previous' : 'wider';
    weightedVariants.push(...collectVariants(entry, weight));
  });

  const currentPool = weightedVariants.filter((v) => v.sourceWeight === 'current');
  const previousPool = weightedVariants.filter((v) => v.sourceWeight === 'previous');
  const widerPool = weightedVariants.filter((v) => v.sourceWeight === 'wider');

  const picked: ReturnType<typeof collectVariants> = [];
  const targets = [3, 1, 1]; // ~60/25/15 for 5 exercises
  const pools = [currentPool, previousPool, widerPool];

  pools.forEach((pool, i) => {
    for (let n = 0; n < targets[i]; n++) {
      const v = pickWeighted(pool.filter((p) => !picked.some((x) => x.ro === p.ro)), rand);
      if (v) picked.push(v);
    }
  });

  while (picked.length < 5) {
    const v = pickWeighted(weightedVariants.filter((p) => !picked.some((x) => x.ro === p.ro)), rand);
    if (!v) break;
    picked.push(v);
  }

  const exercises = picked.map((v, i) => buildExercise(v, weightedVariants, i));

  return { date: dateStr, currentTopicId, exercises };
}
