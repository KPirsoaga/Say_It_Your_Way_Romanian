import type { WeeklyTopic, WeeklyTopicProgress } from '../../types';
import { EMPTY_WEEKLY_TOPIC_PROGRESS } from '../../types';
import { buildingCabinTopic } from './buildingCabin';

export const weeklyTopics: WeeklyTopic[] = [buildingCabinTopic];

export function getWeeklyTopic(id: string): WeeklyTopic | undefined {
  return weeklyTopics.find((t) => t.id === id);
}

export function getWeeklyTopicProgress(
  progress: Record<string, WeeklyTopicProgress>,
  topicId: string
): WeeklyTopicProgress {
  return progress[topicId] ?? { ...EMPTY_WEEKLY_TOPIC_PROGRESS };
}

export function countWeeklyTopicStepsDone(p: WeeklyTopicProgress): number {
  return [
    p.vocabularyViewed,
    p.reading1Done,
    p.reading2Done,
    p.reading3Done,
    p.translationAttempted,
    p.roToEnDone,
    p.enToRoDone,
    p.matchingDone,
    p.sortingDone,
  ].filter(Boolean).length;
}

export const WEEKLY_TOPIC_STEP_COUNT = 9;

export function weeklyTopicPercent(p: WeeklyTopicProgress): number {
  return Math.round((countWeeklyTopicStepsDone(p) / WEEKLY_TOPIC_STEP_COUNT) * 100);
}
