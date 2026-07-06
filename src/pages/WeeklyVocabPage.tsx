import { useEffect, useMemo } from 'react';
import { PageHeader } from '../components/PageHeader';
import { WeeklyVocabCard } from '../components/WeeklyVocabCard';
import { useProgress } from '../context/ProgressContext';
import { getWeeklyTopic } from '../content/weeklyTopics';
import type { WeeklyVocabCategory, WeeklyVocabItem } from '../types';

const sectionOrder: WeeklyVocabCategory[] = ['noun', 'verb', 'adjective', 'phrase'];
const sectionTitles: Record<WeeklyVocabCategory, string> = {
  noun: 'Nouns',
  verb: 'Verbs',
  adjective: 'Adjectives',
  phrase: 'Useful Phrases',
};

interface Props {
  topicId: string;
  onBack: () => void;
}

export function WeeklyVocabPage({ topicId, onBack }: Props) {
  const topic = getWeeklyTopic(topicId);
  const { updateWeeklyTopicProgress } = useProgress();

  useEffect(() => {
    updateWeeklyTopicProgress(topicId, { vocabularyViewed: true });
  }, [topicId, updateWeeklyTopicProgress]);

  const grouped = useMemo(() => {
    if (!topic) return new Map<WeeklyVocabCategory, WeeklyVocabItem[]>();
    const map = new Map<WeeklyVocabCategory, WeeklyVocabItem[]>();
    for (const cat of sectionOrder) {
      map.set(
        cat,
        topic.vocabulary.filter((v) => v.category === cat)
      );
    }
    return map;
  }, [topic]);

  if (!topic) return null;

  return (
    <div className="min-h-screen">
      <PageHeader title="Vocabulary Bank" subtitle={topic.title} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-6">
        <p className="text-ink-500 dark:text-ink-300 text-base">
          Listen, read, and save words you want to keep. This vocabulary powers every exercise in this topic.
        </p>

        {sectionOrder.map((cat) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={cat}>
              <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">{sectionTitles[cat]}</h2>
              <div className="space-y-3">
                {items.map((item) => (
                  <WeeklyVocabCard key={item.id} item={item} topicId={topicId} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
