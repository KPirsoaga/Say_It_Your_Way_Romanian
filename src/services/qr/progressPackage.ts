import type { ProgressState, ReviewCatalogItem, ReviewStatus } from '../../types';
import { grammarVerbs } from '../../content';
import { weeklyTopics } from '../../content/weeklyTopics';
import { encodePackageToQrStrings } from './chunking';
import type { ProgressExportPayload } from './types';

const TENSE_GUIDE_IDS: { id: string; label: string }[] = [
  { id: 'tg-present', label: 'Present' },
  { id: 'tg-perfect-compus', label: 'Perfect compus' },
  { id: 'tg-imperfect', label: 'Imperfect' },
  { id: 'tg-future', label: 'Future' },
];

function readingPercent(p: { reading1Done: boolean; reading2Done: boolean; reading3Done: boolean }): number {
  const done = [p.reading1Done, p.reading2Done, p.reading3Done].filter(Boolean).length;
  return Math.round((done / 3) * 100);
}

function exercisesPercent(p: {
  roToEnDone: boolean;
  enToRoDone: boolean;
  matchingDone: boolean;
  sortingDone: boolean;
}): number {
  const done = [p.roToEnDone, p.enToRoDone, p.matchingDone, p.sortingDone].filter(Boolean).length;
  return Math.round((done / 4) * 100);
}

function practiceStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const sorted = [...days].sort();
  const last = sorted[sorted.length - 1]!;
  let streak = 1;
  let cursor = new Date(`${last}T12:00:00`);
  for (let i = sorted.length - 2; i >= 0; i -= 1) {
    cursor.setDate(cursor.getDate() - 1);
    const expected = cursor.toISOString().slice(0, 10);
    if (sorted[i] === expected) streak += 1;
    else break;
  }
  return streak;
}

function deriveDifficultVerbs(
  topicId: string,
  reviewItems: ReviewCatalogItem[],
  getStatus: (id: string) => ReviewStatus
): string[] {
  const topic = weeklyTopics.find((t) => t.id === topicId);
  const verbs = topic?.vocabulary.filter((v) => v.category === 'verb').map((v) => v.ro) ?? [];
  const scores = new Map<string, number>();

  verbs.forEach((v) => scores.set(v, 0));

  reviewItems.forEach((item) => {
    if (getStatus(item.id) !== 'pending' && getStatus(item.id) !== 'needs-changes') return;
    verbs.forEach((verb) => {
      if (item.ro.toLowerCase().includes(verb.replace(/^a /, '').toLowerCase()) || item.ro === verb) {
        scores.set(verb, (scores.get(verb) ?? 0) + 2);
      }
    });
  });

  grammarVerbs.slice(0, 8).forEach((v) => {
    if (!scores.has(v.infinitive)) scores.set(v.infinitive, 0);
    reviewItems.forEach((item) => {
      if (item.ro.includes(v.infinitive) || item.contextLabel?.includes(v.infinitive)) {
        scores.set(v.infinitive, (scores.get(v.infinitive) ?? 0) + 1);
      }
    });
  });

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .filter(([, score]) => score > 0)
    .slice(0, 5)
    .map(([verb]) => verb);
}

function recentActivities(progress: ProgressState, topicId: string): string[] {
  const activities: string[] = [];
  const tp = progress.weeklyTopics?.[topicId];
  if (tp?.vocabularyViewed) activities.push('Viewed vocabulary');
  if (tp?.reading3Done) activities.push('Finished reading 3');
  else if (tp?.reading2Done) activities.push('Finished reading 2');
  else if (tp?.reading1Done) activities.push('Finished reading 1');
  if (tp?.roToEnDone) activities.push('Romanian → English exercise');
  if (tp?.enToRoDone) activities.push('English → Romanian exercise');
  if (tp?.matchingDone) activities.push('Vocabulary matching');
  if (tp?.sortingDone) activities.push('Category sorting');
  if (progress.completedScenarios.length > 0) {
    activities.push(`Explored ${progress.dictionaryWordsSeen.length} dictionary word(s)`);
  }
  if (progress.completedConversations.length > 0) {
    activities.push(`Completed ${progress.completedConversations.length} conversation(s)`);
  }
  if (progress.builderDone > 0) activities.push(`Built ${progress.builderDone} phrase(s)`);
  return activities.slice(-6).reverse();
}

export function buildProgressExportPayload(
  progress: ProgressState,
  reviewItems: ReviewCatalogItem[],
  getStatus: (id: string) => ReviewStatus
): ProgressExportPayload {
  const currentTopic =
    weeklyTopics.find((t) => {
      const tp = progress.weeklyTopics?.[t.id];
      if (!tp) return t.id === 'building-cabin';
      const pct =
        [tp.vocabularyViewed, tp.reading1Done, tp.reading2Done, tp.reading3Done, tp.roToEnDone, tp.enToRoDone, tp.matchingDone, tp.sortingDone].filter(Boolean)
          .length / 8;
      return pct < 1;
    }) ?? weeklyTopics[0]!;

  const tp = progress.weeklyTopics?.[currentTopic.id] ?? {
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

  const activeReview = reviewItems.filter((item) => {
    const s = getStatus(item.id);
    return s === 'pending' || s === 'needs-changes';
  });

  const grammarFocus = currentTopic.grammarFocus?.label;
  const focusVerb = currentTopic.grammarFocus?.grammarVerbId
    ? grammarVerbs.find((v) => v.id === currentTopic.grammarFocus?.grammarVerbId)?.infinitive
    : undefined;

  const grammarTenses = TENSE_GUIDE_IDS.map((t) => ({
    label: t.label,
    practiced: progress.completedGrammarTopics.includes(t.id),
  }));

  const sortedDays = [...progress.practisedDays].sort();

  return {
    learnerName: 'Katie',
    currentWeeklyTopic: { id: currentTopic.id, title: currentTopic.title },
    vocabularyPercent: tp.vocabularyViewed ? 100 : 0,
    readingPercent: readingPercent(tp),
    exercisesPercent: exercisesPercent(tp),
    grammarFocus: focusVerb ? `${grammarFocus ?? 'Grammar'} (${focusVerb})` : grammarFocus,
    grammarTenses,
    phraseBuilderDone: progress.builderDone,
    miniConversationsDone: progress.completedConversations.length,
    difficultVerbs: deriveDifficultVerbs(currentTopic.id, reviewItems, getStatus),
    needsReviewCount: activeReview.length,
    topFlaggedItems: activeReview.slice(0, 5).map((item) => ({
      ro: item.ro,
      en: item.en,
      reason: item.reviewReason,
    })),
    practiceDays: progress.practisedDays.length,
    practiceStreak: practiceStreak(sortedDays),
    lastPracticeDate: sortedDays[sortedDays.length - 1],
    recentActivities: recentActivities(progress, currentTopic.id),
    exportedAt: new Date().toISOString(),
  };
}

export function encodeProgressExport(payload: ProgressExportPayload): string[] {
  return encodePackageToQrStrings('progress-export', { items: [payload] });
}

export function parseProgressExportPayload(items: unknown[]): ProgressExportPayload {
  return items[0] as ProgressExportPayload;
}
