import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { NoShameBanner } from '../components/NoShameBanner';
import { WeeklyTopicProgressBar } from '../components/WeeklyTopicProgressBar';
import { SectionHeading } from '../components/brand/SectionHeading';
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
      <PageHeader title="Weekly topics" subtitle="Vocabulary → reading → practice" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-5">
        <div className="rounded-3xl bg-forest text-linen-100 p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="BookOpen" className="h-5 w-5 text-olive-300" />
            <p className="text-sm uppercase tracking-wide font-semibold text-linen/80">Your lesson path</p>
          </div>
          <h2 className="font-display text-xl font-bold leading-tight">
            One calm path through each topic
          </h2>
          <p className="mt-2 text-linen/80 text-sm leading-relaxed">
            Vocabulary, reading, understanding, then practice — no tests, no pressure.
          </p>
        </div>

        <NoShameBanner compact />

        <SectionHeading title="All topics" />
        <div className="space-y-3">
          {weeklyTopics.map((topic) => {
            const c = colorMap[topic.color];
            const tp = getWeeklyTopicProgress(topic.id);
            const pct = weeklyTopicPercent(tp);
            const isActive = pct > 0 && pct < 100;
            return (
              <Card key={topic.id} onClick={() => go('weekly-topic', topic.id)} className="!p-4 space-y-3">
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0 border border-forest/5`}>
                    <Icon name={topic.icon} className={`h-6 w-6 ${c.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="tile-label font-display font-bold text-forest dark:text-linen-100 text-lg leading-tight">
                        {topic.title}
                      </p>
                      {isActive && (
                        <span className="shrink-0 rounded-full bg-olive-100 dark:bg-olive-900/40 text-olive-700 dark:text-olive-300 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5">
                          Current
                        </span>
                      )}
                      {pct >= 100 && (
                        <Icon name="Check" className="h-4 w-4 text-olive-600 shrink-0" aria-label="Complete" />
                      )}
                    </div>
                    <p className="tile-label text-sm text-forest/60 dark:text-linen/60 mt-0.5">{topic.description}</p>
                  </div>
                  <Icon name="ChevronRight" className="h-5 w-5 text-clay-300 shrink-0" />
                </div>
                <WeeklyTopicProgressBar progress={tp} />
                <p className="text-xs text-forest/50 dark:text-linen/50">{pct}% complete</p>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
