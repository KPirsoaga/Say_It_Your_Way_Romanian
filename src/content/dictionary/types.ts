import type { ContentReviewMeta, GrammarTense, VerbForm } from '../../types';

export type DictionaryWordType = 'noun' | 'verb' | 'adjective' | 'phrase';

export interface DictionarySourceRef {
  feature: 'weekly-topic' | 'scenario' | 'real-life' | 'survival' | 'grammar' | 'phrase-builder';
  featureId: string;
  label: string;
}

export interface DictionaryForm {
  ro: string;
  en: string;
  pron?: string;
  review?: ContentReviewMeta;
}

export interface DictionaryNounFamily {
  gender?: 'masculine' | 'feminine' | 'neuter';
  singular: DictionaryForm;
  plural?: DictionaryForm;
  definiteSingular?: DictionaryForm;
  definitePlural?: DictionaryForm;
  articleNote?: string;
}

export interface DictionaryVerbFamily {
  infinitive: string;
  en: string;
  grammarVerbId?: string;
  present?: VerbForm[];
  perfectCompus?: VerbForm[];
  imperfect?: VerbForm[];
  future?: VerbForm[];
}

export interface DictionaryAdjectiveFamily {
  masculineSingular: DictionaryForm;
  feminineSingular?: DictionaryForm;
  masculinePlural?: DictionaryForm;
  femininePlural?: DictionaryForm;
}

export interface DictionarySense {
  en: string;
  note?: string;
  review?: ContentReviewMeta;
}

export interface DictionaryEntry {
  id: string;
  type: DictionaryWordType;
  headwordRo: string;
  headwordEn: string;
  /** Lowercase sort key without leading article/infinitive marker */
  sortKey: string;
  /** First letter bucket for A–Z jump (A–Z or #) */
  letter: string;
  pron?: string;
  teacherNote?: string;
  review?: ContentReviewMeta;
  sources: DictionarySourceRef[];
  senses?: DictionarySense[];
  nounFamily?: DictionaryNounFamily;
  verbFamily?: DictionaryVerbFamily;
  adjectiveFamily?: DictionaryAdjectiveFamily;
  /** Full phrase text when type === 'phrase' */
  phraseRo?: string;
  phraseEn?: string;
  /** Weekly topic vocab id when linked */
  weeklyVocabId?: string;
  weeklyTopicId?: string;
}

export interface DictionaryVariant {
  entryId: string;
  ro: string;
  en: string;
  pron?: string;
  formLabel: string;
  baseRo: string;
  baseEn: string;
  type: DictionaryWordType;
  grammarVerbId?: string;
  wordFamilyChain: string[];
  sourceWeight: 'current' | 'previous' | 'wider';
}

export type DailyVariantExerciseType =
  | 'which-meaning'
  | 'singular-plural'
  | 'definite-form'
  | 'adjective-form'
  | 'ro-en'
  | 'en-ro'
  | 'listen';

export interface DailyVariantExercise {
  id: string;
  type: DailyVariantExerciseType;
  promptRo: string;
  promptEn?: string;
  options: string[];
  correct: string;
  entryId: string;
  feedback: {
    meaning: string;
    baseWord: string;
    baseEn: string;
    formLabel?: string;
    wordFamily?: string[];
    grammarVerbId?: string;
    plainNote?: string;
  };
}

export interface DailyPracticeSession {
  date: string;
  currentTopicId: string;
  exercises: DailyVariantExercise[];
}

export const GRAMMAR_TENSE_ORDER: GrammarTense[] = ['present', 'perfect-compus', 'imperfect', 'future'];
