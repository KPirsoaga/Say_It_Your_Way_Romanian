import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { NoShameBanner } from '../components/NoShameBanner';
import { WeeklySectionCard } from '../components/WeeklySectionCard';
import { WeeklyTopicProgressBar } from '../components/WeeklyTopicProgressBar';
import { TopicIllustrationPanel } from '../components/illustrations/TopicIllustrationPanel';
import { useProgress } from '../context/ProgressContext';
import { getWeeklyTopic, WEEKLY_TOPIC_STEP_COUNT, countWeeklyTopicStepsDone } from '../content/weeklyTopics';
import { Icon } from '../components/Icon';
import type { PageId } from '../App';

interface Props {
  topicId: string;
  go: (page: PageId, arg?: string) => void;
  onBack: () => void;
}

export function WeeklyTopicDetailPage({ topicId, go, onBack }: Props) {
  const topic = getWeeklyTopic(topicId);
  const { getWeeklyTopicProgress } = useProgress();

  if (!topic) {
    return null;
  }

  const p = getWeeklyTopicProgress(topicId);
  const stepsDone = countWeeklyTopicStepsDone(p);
  const complete = stepsDone >= WEEKLY_TOPIC_STEP_COUNT;

  return (
    <div className="min-h-screen">
      <PageHeader title={topic.title} subtitle={topic.description} onBack={onBack} />
      <div className="page-shell-body space-y-4">
        <div className="rounded-3xl overflow-hidden border border-forest/8 dark:border-linen/10 shadow-soft">
          <TopicIllustrationPanel topicId={topic.id} aspect="wide" className="rounded-none" />
          <div className="p-4 bg-white/80 dark:bg-forest-700/80">
            <p className="text-xs uppercase tracking-wide font-bold text-forest/50 dark:text-linen/50">This week&apos;s lesson</p>
            <p className="text-lg font-display font-bold text-forest dark:text-linen-100 leading-snug mt-1">
              Vocabulary → reading → practice
            </p>
          </div>
        </div>

        <WeeklyTopicProgressBar progress={p} />

        {complete && (
          <Card className="bg-sea-50 dark:bg-sea-600/10 p-5 text-center">
            <Icon name="Check" className="h-10 w-10 text-sea-600 dark:text-sea-200 mx-auto mb-2" />
            <p className="font-bold text-ink-900 dark:text-sand-100 text-lg">You&apos;ve worked through this topic!</p>
            <p className="text-sm text-ink-600 dark:text-ink-300 mt-1">
              Come back anytime to practise again, or check Grammar Help for patterns.
            </p>
            <Button variant="soft" size="md" className="mt-3" onClick={() => go('grammar')}>
              Open Grammar Help
            </Button>
          </Card>
        )}

        <NoShameBanner compact />

        <Button variant="ghost" size="md" className="w-full text-ink-500 dark:text-ink-400" onClick={() => go('teacher-review')}>
          <Icon name="Lightbulb" className="h-4 w-4" />
          Content flagged for Teacher Review
        </Button>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">Vocabulary</h2>
          <WeeklySectionCard
            title="Vocabulary Bank"
            subtitle="Nouns, verbs, adjectives and phrases — with audio"
            icon="BookOpen"
            done={p.vocabularyViewed}
            onClick={() => go('weekly-vocab', topicId)}
          />
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">Reading & understanding</h2>
          {topic.readings.map((reading) => {
            const doneKey =
              reading.level === 1 ? 'reading1Done' : reading.level === 2 ? 'reading2Done' : 'reading3Done';
            return (
              <WeeklySectionCard
                key={reading.id}
                title={reading.title}
                subtitle="Read in Romanian, then try your own translation"
                icon="Eye"
                done={p[doneKey]}
                onClick={() => go('weekly-reading', `${topicId}:${reading.id}`)}
              />
            );
          })}
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">Vocabulary review & exercises</h2>
          <WeeklySectionCard
            title="Vocabulary Review"
            subtitle="Tap Romanian, then tap English — match the pairs"
            icon="LayoutGrid"
            done={p.matchingDone}
            onClick={() => go('weekly-exercise', `${topicId}:match`)}
          />
          <WeeklySectionCard
            title="Romanian → English"
            subtitle="Multiple choice — tap the meaning"
            icon="ArrowRight"
            done={p.roToEnDone}
            onClick={() => go('weekly-exercise', `${topicId}:ro-en`)}
          />
          <WeeklySectionCard
            title="English → Romanian"
            subtitle="Multiple choice — tap the Romanian"
            icon="ArrowLeft"
            done={p.enToRoDone}
            onClick={() => go('weekly-exercise', `${topicId}:en-ro`)}
          />
          <WeeklySectionCard
            title="Category Sorting"
            subtitle="Tap a category, then tap each word"
            icon="LayoutGrid"
            done={p.sortingDone}
            onClick={() => go('weekly-exercise', `${topicId}:sort`)}
          />
        </section>
      </div>
    </div>
  );
}
