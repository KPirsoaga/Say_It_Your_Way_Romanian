import type { ReviewContentArea } from '../../types';

export const FLAG_REASON_PRESETS = [
  'Pronunciation sounds strange',
  'Translation may be wrong',
  'Romanian sounds unnatural',
  'Ask your teacher',
] as const;

/** Stable id for a user-flagged review item in localStorage */
export function userFlagId(key: string): string {
  return `user-flag:${key}`;
}

export interface FlagReviewTarget {
  id: string;
  ro: string;
  en: string;
  contentArea: ReviewContentArea;
  contextLabel?: string;
}
