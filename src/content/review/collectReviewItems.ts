import {
  scenarios,
  realLifeCategories,
  survivalPhrases,
  miniConversations,
  phraseBuilderItems,
  listenChooseItems,
  grammarTopics,
  grammarVerbs,
} from '../../content';
import { weeklyTopics } from '../weeklyTopics';
import type { ContentReviewMeta, ReviewCatalogItem, ReviewContentArea } from '../../types';
import { supplementalReviewItems } from './reviewRegistry';

function isReviewable(meta?: ContentReviewMeta): boolean {
  return meta?.needsReview === true || meta?.reviewStatus === 'pending';
}

function fromMeta(
  id: string,
  ro: string,
  en: string,
  contextLabel: string,
  meta: ContentReviewMeta,
  fallbackArea: ReviewContentArea
): ReviewCatalogItem | null {
  if (!isReviewable(meta)) return null;
  return {
    id,
    contentArea: meta.contentArea ?? fallbackArea,
    ro,
    en,
    reviewReason: meta.reviewReason ?? 'Needs teacher or native-speaker review.',
    suggestedBy: meta.suggestedBy,
    teacherNotes: meta.teacherNotes,
    contextLabel,
  };
}

function pushPhraseLines(
  items: ReviewCatalogItem[],
  lines: { ro: string; en: string; review?: ContentReviewMeta }[],
  prefix: string,
  context: string,
  area: ReviewContentArea
) {
  lines.forEach((line, i) => {
    const item = line.review
      ? fromMeta(`${prefix}:line:${i}`, line.ro, line.en, `${context} · line ${i + 1}`, line.review, area)
      : null;
    if (item) items.push(item);
  });
}

/** Collect every content item flagged for Mihaela Review. */
export function collectReviewItems(): ReviewCatalogItem[] {
  const items: ReviewCatalogItem[] = [];

  scenarios.forEach((s) => {
    pushPhraseLines(items, s.lines, `scenario:${s.id}`, s.title, 'Scenarios');
  });

  realLifeCategories.forEach((cat) => {
    pushPhraseLines(items, cat.phrases, `reallife:${cat.id}`, cat.title, 'Real Life Mode');
  });

  survivalPhrases.forEach((p, i) => {
    const item = p.review
      ? fromMeta(`survival:${i}`, p.ro, p.en, 'Survival Romanian', p.review, 'Survival Romanian')
      : null;
    if (item) items.push(item);
  });

  miniConversations.forEach((c) => {
    c.turns.forEach((turn, i) => {
      const item = turn.review
        ? fromMeta(`conversation:${c.id}:turn:${i}`, turn.ro, turn.en, c.title, turn.review, 'Mini Conversations')
        : null;
      if (item) items.push(item);
    });
  });

  phraseBuilderItems.forEach((b) => {
    const item = b.review
      ? fromMeta(`builder:${b.id}`, b.fullRo, b.fullEn, 'Phrase Builder', b.review, 'Phrase Builder')
      : null;
    if (item) items.push(item);
  });

  listenChooseItems.forEach((l) => {
    const item = l.review
      ? fromMeta(`listen:${l.id}`, l.ro, l.correct, 'Listen & Choose', l.review, 'Listen & Choose')
      : null;
    if (item) items.push(item);
  });

  grammarTopics.forEach((t) => {
    if (t.review) {
      const topicItem = fromMeta(
        `grammar-topic:${t.id}`,
        t.patternRo,
        t.patternEn,
        t.title,
        t.review,
        'Grammar Help'
      );
      if (topicItem) items.push(topicItem);
    }
    t.examples.forEach((ex, i) => {
      const item = ex.review
        ? fromMeta(`grammar-topic:${t.id}:ex:${i}`, ex.ro, ex.en, `${t.title} · example ${i + 1}`, ex.review, 'Grammar Help')
        : null;
      if (item) items.push(item);
    });
  });

  grammarVerbs.forEach((v) => {
    if (v.review) {
      const verbItem = fromMeta(
        `grammar-verb:${v.id}`,
        v.infinitive,
        v.en,
        v.infinitive,
        v.review,
        'Grammar Help'
      );
      if (verbItem) items.push(verbItem);
    }
    v.examples.forEach((ex, i) => {
      const item = ex.review
        ? fromMeta(`grammar-verb:${v.id}:ex:${i}`, ex.ro, ex.en, `${v.infinitive} · example ${i + 1}`, ex.review, 'Grammar Help')
        : null;
      if (item) items.push(item);
    });
  });

  weeklyTopics.forEach((topic) => {
    topic.vocabulary.forEach((v) => {
      const item = v.review
        ? fromMeta(`weekly-vocab:${topic.id}:${v.id}`, v.ro, v.en, `${topic.title} · vocabulary`, v.review, 'Vocabulary')
        : null;
      if (item) items.push(item);
    });
    topic.readings.forEach((r) => {
      const item = r.review
        ? fromMeta(
            `weekly-reading:${topic.id}:${r.id}`,
            r.ro,
            r.modelEn,
            `${topic.title} · ${r.title}`,
            r.review,
            'Reading passages'
          )
        : null;
      if (item) items.push(item);
    });
  });

  items.push(...supplementalReviewItems);

  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
