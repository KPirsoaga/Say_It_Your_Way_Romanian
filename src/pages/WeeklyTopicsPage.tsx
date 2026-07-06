import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { NoShameBanner } from '../components/NoShameBanner';
import { WeeklyTopicProgressBar } from '../components/WeeklyTopicProgressBar';
import { useProgress } from '../context/ProgressContext';
import { colorMap } from '../content';
import { weeklyTopics, weeklyTopicPercent } from '../content/weeklyTopics';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
  onBack: () => void;
}

export function WeeklyTopicsPage({ go, onBack }: Props) {
  const { getWeeklyTopicProgress } = useProgress();

  return (
    <div className="min-h-screen">
      <PageHeader title="Weekly Topics" subtitle="Lesson support with Mihaela — vocabulary, reading, practice" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-sun-300 to-sun-400 text-ink-900 p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="BookOpen" className="h-5 w-5" />
            <p className="text-sm uppercase tracking-wide font-bold">This week&apos;s topic</p>
          </div>
          <h2 className="text-xl font-bold leading-tight">
            Vocabulary → Reading → Understanding → Practice
          </h2>
          <p className="mt-2 text-ink-800 text-base">
            Each topic follows the same calm path. No tests, no pressure — just communication.
          </p>
        </div>

        <NoShameBanner compact />

        <div className="space-y-3">
          {weeklyTopics.map((topic) => {
            const c = colorMap[topic.color];
            const tp = getWeeklyTopicProgress(topic.id);
            const pct = weeklyTopicPercent(tp);
            return (
              <Card key={topic.id} onClick={() => go('weekly-topic', topic.id)} className="flex flex-col gap-3 p-4">
                <div className="flex items-center gap-4">
                  <div className={`h-14 w-14 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0`}>
                    <Icon name={topic.icon} className={`h-7 w-7 ${c.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-lg leading-tight">{topic.title}</p>
                    <p className="tile-label text-sm text-ink-500 dark:text-ink-300 mt-0.5">{topic.description}</p>
                  </div>
                  <Icon name="ChevronRight" className="h-5 w-5 text-ink-300 dark:text-ink-500 shrink-0" />
                </div>
                <WeeklyTopicProgressBar progress={tp} />
                <p className="text-xs text-ink-500 dark:text-ink-300">{pct}% complete</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
