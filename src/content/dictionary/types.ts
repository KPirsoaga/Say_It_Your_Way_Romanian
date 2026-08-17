import type { ContentReviewMeta, GrammarTense, VerbForm } from '../../types';

export type DictionaryLexicalType = 'noun' | 'verb' | 'adjective';

/** Legacy alias — phrases are stored separately */
export type DictionaryWordType = DictionaryLexicalType | 'phrase';

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
  /** True when all four noun forms are verified */
  complete?: boolean;
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
  complete?: boolean;
}

export interface DictionarySense {
  en: string;
  note?: string;
  review?: ContentReviewMeta;
}

export interface DictionaryUsageExample {
  ro: string;
  en: string;
  sourceLabel?: string;
  phraseId?: string;
}

/** Canonical lexical headword — grammatical variants live inside families */
export interface DictionaryEntry {
  id: string;
  type: DictionaryLexicalType;
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
  /** Verified full family available for display and practice */
  familyComplete: boolean;
  /** Missing or unverified forms — needs teacher review */
  familyNeedsReview: boolean;
  usageExamples?: DictionaryUsageExample[];
  weeklyVocabId?: string;
  weeklyTopicId?: string;
}

export interface DictionaryPhrase {
  id: string;
  ro: string;
  en: string;
  sortKey: string;
  letter: string;
  pron?: string;
  review?: ContentReviewMeta;
  sources: DictionarySourceRef[];
  linkedHeadwordIds: string[];
}

export interface DictionaryFormAlias {
  ro: string;
  entryId: string;
  displayRo: string;
  en: string;
  explanation: string;
  formLabel: string;
  type: DictionaryLexicalType;
}

export interface DictionarySearchMatch {
  entry: DictionaryEntry;
  alias?: DictionaryFormAlias;
}

export interface DictionaryVariant {
  entryId: string;
  ro: string;
  en: string;
  pron?: string;
  formLabel: string;
  baseRo: string;
  baseEn: string;
  type: DictionaryLexicalType;
  grammarVerbId?: string;
  tense?: GrammarTense;
  wordFamilyChain: string[];
  sourceWeight: 'current' | 'previous' | 'wider';
}

export type DailyVariantExerciseType =
  | 'which-meaning'
  | 'singular-plural'
  | 'definite-form'
  | 'adjective-form'
  | 'verb-person'
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
    tenseLabel?: string;
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

export const GRAMMAR_TENSE_LABELS: Record<GrammarTense, string> = {
  present: 'Present',
  'perfect-compus': 'Perfect compus',
  imperfect: 'Imperfect',
  future: 'Future',
};
