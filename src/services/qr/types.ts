/** QR transfer schema — extend with new package types as needed */

export const QR_SCHEMA_VERSION = 1;
export const QR_PREFIX = 'rcd:';
export const APP_VERSION = '0.0.0';

export type QrPackageType = 'review-export' | 'review-response' | 'progress-export';

export interface QrChunkMeta {
  /** Batch id shared across chunks */
  bid: string;
  /** Zero-based chunk index */
  i: number;
  /** Total chunks in batch */
  n: number;
}

export interface QrEnvelope<T = unknown> {
  v: number;
  app: string;
  type: QrPackageType;
  at: string;
  chunk?: QrChunkMeta;
  payload: T;
}

// ─── Review packages (compact wire format) ─────────────────────────────────

export interface ReviewExportItem {
  id: string;
  area: string;
  ro: string;
  en: string;
  note?: string;
  status: 'pending' | 'approved' | 'needs-changes';
}

export interface ReviewExportPayload {
  items: ReviewExportItem[];
}

export interface ReviewResponseItem {
  id: string;
  status: 'pending' | 'approved' | 'needs-changes';
  cro?: string;
  cen?: string;
  note?: string;
  pron?: string;
}

export interface ReviewResponsePayload {
  items: ReviewResponseItem[];
}

// ─── Progress package ────────────────────────────────────────────────────────

export interface ProgressTenseStatus {
  label: string;
  practiced: boolean;
}

export interface ProgressFlaggedItem {
  ro: string;
  en: string;
  reason: string;
}

export interface ProgressExportPayload {
  learnerName: string;
  currentWeeklyTopic: { id: string; title: string };
  vocabularyPercent: number;
  readingPercent: number;
  exercisesPercent: number;
  grammarFocus?: string;
  grammarTenses: ProgressTenseStatus[];
  phraseBuilderDone: number;
  miniConversationsDone: number;
  difficultVerbs: string[];
  needsReviewCount: number;
  topFlaggedItems: ProgressFlaggedItem[];
  practiceDays: number;
  practiceStreak: number;
  lastPracticeDate?: string;
  recentActivities: string[];
  exportedAt: string;
}
