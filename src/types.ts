// Core domain types for the Romanian practice app

export type ScenarioId =
  | 'shop'
  | 'vet'
  | 'pharmacy'
  | 'neighbours'
  | 'coffee'
  | 'help'
  | 'appointment'
  | 'today'
  | 'problem'
  | 'smalltalk'
  | 'lesson'
  | 'doctor'
  | 'taxi'
  | 'accountant';

export interface PhraseLine {
  /** Romanian sentence */
  ro: string;
  /** Natural English translation */
  en: string;
  /** Optional literal word-by-word translation */
  literal?: string;
  /** Optional pronunciation hint in English-friendly spelling */
  pron?: string;
  /** A slower, simplified Romanian version for the "show slower version" button */
  slow?: string;
  /** Optional flag for Mihaela Review */
  review?: ContentReviewMeta;
}

export interface Scenario {
  id: ScenarioId;
  title: string;
  /** Short English situation description */
  situation: string;
  /** Lucide icon name */
  icon: string;
  /** Accent color key */
  color: ColorKey;
  /** Lines practised in this scenario */
  lines: PhraseLine[];
}

export type ColorKey = 'sea' | 'coral' | 'sun' | 'rose' | 'sand';

/** A grouped set of urgent phrases for Real Life Mode */
export interface RealLifeCategory {
  id: string;
  title: string;
  /** Short English hint about when to use these */
  when: string;
  icon: string;
  color: ColorKey;
  phrases: PhraseLine[];
}

/** Survival Romanian — the most useful phrases, ordered by importance */
export interface SurvivalPhrase extends PhraseLine {
  /** why this phrase matters */
  why: string;
}

/** No-Shame encouraging messages */
export interface NoShameMessage {
  id: string;
  text: string;
  icon: string;
}

/** Tiny Practice — a 3-minute low-focus routine */
export interface TinyPracticeContent {
  listen: ListenChooseItem;
  repeat: PhraseLine;
  phrase: PhraseLine;
}

export interface ListenChooseItem {
  id: string;
  ro: string;
  correct: string;
  options: string[];
  pron?: string;
  review?: ContentReviewMeta;
}

export interface PhraseChunk {
  /** chunk in Romanian */
  ro: string;
  /** chunk in English */
  en: string;
}

export interface PhraseBuilderItem {
  id: string;
  /** Correct order of chunk ids (index into chunks) */
  order: number[];
  chunks: PhraseChunk[];
  fullRo: string;
  fullEn: string;
  review?: ContentReviewMeta;
}

export interface MiniDialogue {
  speaker: 'A' | 'B';
  ro: string;
  en: string;
  pron?: string;
}

/** A single turn in a guided mini-conversation */
export interface ConversationTurn extends PhraseLine {
  /** Who says this line: 'you' = the learner, 'them' = the Romanian speaker */
  who: 'you' | 'them';
}

/** A guided mini-conversation with 3–5 turns */
export interface MiniConversation {
  id: string;
  title: string;
  /** Real-life situation in simple English */
  situation: string;
  icon: string;
  color: ColorKey;
  turns: ConversationTurn[];
}

export interface DailyContent {
  /** ISO date string YYYY-MM-DD */
  date: string;
  phrase: PhraseLine;
  dialogue: MiniDialogue[];
  listen: ListenChooseItem;
  speak: PhraseLine;
}

export type TextSize = 'normal' | 'large' | 'xlarge';

export interface Settings {
  textSize: TextSize;
  pronunciationHelp: boolean;
  literalTranslation: boolean;
  reduceAnimations: boolean;
  darkMode: boolean;
}

export interface ProgressState {
  /** Set of ISO date strings (YYYY-MM-DD) on which the user practised */
  practisedDays: string[];
  /** Favourite phrase identifiers: `${scenarioId}:${lineIndex}` or `daily:${date}` */
  favourites: string[];
  /** Set of scenario ids completed */
  completedScenarios: ScenarioId[];
  /** Set of mini-conversation ids completed */
  completedConversations: string[];
  /** Count of listen-and-choose answered correctly */
  listenCorrect: number;
  /** Count of speak-practice "I said it" taps */
  speakDone: number;
  /** Count of phrase-builder completions */
  builderDone: number;
  /** Grammar topic ids the user has practised */
  completedGrammarTopics: string[];
  /** Weekly topic progress keyed by topic id */
  weeklyTopics: Record<string, WeeklyTopicProgress>;
}

export interface GrammarExample {
  ro: string;
  en: string;
  pron?: string;
  slow?: string;
  review?: ContentReviewMeta;
}

export interface GrammarTopic {
  id: string;
  title: string;
  /** One-line simple explanation */
  summary: string;
  icon: string;
  color: ColorKey;
  /** Optional section for Grammar Help grouping */
  group?: 'patterns' | 'parts-of-speech' | 'indicative' | 'imperfect' | 'auxiliary' | 'predicative';
  /** Romanian grammar label, e.g. "verbă" */
  roLabel?: string;
  /** When to use this tense or pattern */
  whenToUse?: string;
  /** The pattern in Romanian */
  patternRo: string;
  /** What it means in English */
  patternEn: string;
  /** Short dyslexia-friendly tip */
  tip: string;
  /** Simpler version of the pattern */
  simplerRo: string;
  simplerEn: string;
  examples: GrammarExample[];
  /** Optional conjugation table as stacked mobile cards */
  conjugation?: VerbForm[];
  review?: ContentReviewMeta;
}

export interface VerbForm {
  label: string;
  ro: string;
  en: string;
  pron?: string;
}

export interface GrammarVerb {
  id: string;
  infinitive: string;
  en: string;
  icon: string;
  color: ColorKey;
  present: VerbForm[];
  /** Optional imperfect tense forms */
  imperfect?: VerbForm[];
  examples: GrammarExample[];
  review?: ContentReviewMeta;
}

// ─── Weekly Topics learning engine ───────────────────────────────────────────

export type WeeklyVocabCategory = 'noun' | 'verb' | 'adjective' | 'phrase';

export interface WeeklyVocabItem {
  id: string;
  ro: string;
  en: string;
  category: WeeklyVocabCategory;
  /** Category for the sorting exercise (topic-specific labels) */
  sortCategory?: string;
  pron?: string;
  teacherNote?: string;
  review?: ContentReviewMeta;
}

export interface WeeklyNewWord {
  ro: string;
  en: string;
}

export interface WeeklyReading {
  id: string;
  level: 1 | 2 | 3;
  title: string;
  ro: string;
  modelEn: string;
  vocabularyUsed: string[];
  newWords: WeeklyNewWord[];
  teacherNotes?: string;
  review?: ContentReviewMeta;
}

export interface WeeklyMcQuestion {
  id: string;
  direction: 'ro-en' | 'en-ro';
  prompt: string;
  correct: string;
  options: string[];
  vocabId?: string;
}

export interface WeeklyMatchPair {
  id: string;
  ro: string;
  en: string;
}

export interface WeeklySortCategory {
  id: string;
  label: string;
}

export interface WeeklySortItem {
  id: string;
  vocabId: string;
  ro: string;
  en: string;
  sortCategory: string;
}

export interface WeeklyTopicExercises {
  roToEn: WeeklyMcQuestion[];
  enToRo: WeeklyMcQuestion[];
  matching: WeeklyMatchPair[];
  sortCategories: WeeklySortCategory[];
  sortItems: WeeklySortItem[];
}

export interface WeeklyTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: ColorKey;
  vocabulary: WeeklyVocabItem[];
  readings: WeeklyReading[];
  exercises: WeeklyTopicExercises;
}

export interface WeeklyTopicProgress {
  vocabularyViewed: boolean;
  reading1Done: boolean;
  reading2Done: boolean;
  reading3Done: boolean;
  translationAttempted: boolean;
  roToEnDone: boolean;
  enToRoDone: boolean;
  matchingDone: boolean;
  sortingDone: boolean;
}

export const EMPTY_WEEKLY_TOPIC_PROGRESS: WeeklyTopicProgress = {
  vocabularyViewed: false,
  reading1Done: false,
  reading2Done: false,
  reading3Done: false,
  translationAttempted: false,
  roToEnDone: false,
  enToRoDone: false,
  matchingDone: false,
  sortingDone: false,
};

export type WeeklyExerciseType = 'ro-en' | 'en-ro' | 'match' | 'sort';

// ─── Mihaela Review ──────────────────────────────────────────────────────────

export type ReviewContentArea =
  | 'Grammar Help'
  | 'Weekly Topics'
  | 'Reading passages'
  | 'Vocabulary'
  | 'Mini Conversations'
  | 'Survival Romanian'
  | 'Real Life Mode'
  | 'Phrase Builder'
  | 'Listen & Choose'
  | 'Scenarios'
  | 'Daily Practice';

export type ReviewStatus = 'pending' | 'approved' | 'needs-changes';

/** Optional review metadata on any content item */
export interface ContentReviewMeta {
  needsReview?: true;
  reviewReason?: string;
  suggestedBy?: string;
  contentArea?: ReviewContentArea;
  reviewStatus?: ReviewStatus;
  teacherNotes?: string;
}

/** Flattened item shown on the Mihaela Review page */
export interface ReviewCatalogItem {
  id: string;
  contentArea: ReviewContentArea;
  ro: string;
  en: string;
  reviewReason: string;
  suggestedBy?: string;
  teacherNotes?: string;
  contextLabel?: string;
}

export interface ReviewDecision {
  status: ReviewStatus;
  teacherNotes?: string;
  updatedAt: string;
}

export interface ReviewState {
  decisions: Record<string, ReviewDecision>;
}
