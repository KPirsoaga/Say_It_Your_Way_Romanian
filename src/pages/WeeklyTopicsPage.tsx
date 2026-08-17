import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { NoShameBanner } from '../components/NoShameBanner';
import { WeeklyTopicProgressBar } from '../components/WeeklyTopicProgressBar';
import { SectionHeading } from '../components/brand/SectionHeading';
import { TopicIllustrationPanel } from '../components/illustrations/TopicIllustrationPanel';
import { ExploreScene } from '../components/illustrations/ExploreScenes';
import { IllustrationPanel } from '../components/illustrations/IllustrationPanel';
import { useProgress } from '../context/ProgressContext';
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
      <div className="page-shell-body space-y-5">
        <div className="rounded-3xl overflow-hidden border border-forest/10 dark:border-linen/10 shadow-soft">
          <IllustrationPanel tone="sky" aspect="wide" className="!rounded-none !aspect-[21/9] lg:!aspect-[3/1]">
            <ExploreScene destination="topics" className="h-full w-full max-h-[100px] lg:max-h-[180px]" />
          </IllustrationPanel>
          <div className="bg-forest text-linen-100 p-5">
            <p className="text-sm uppercase tracking-wide font-semibold text-linen/80">Your lesson path</p>
            <h2 className="font-display text-xl font-bold leading-tight mt-1">
              One calm path through each topic
            </h2>
            <p className="mt-2 text-linen/80 text-sm leading-relaxed">
              Vocabulary, reading, understanding, then practice — no tests, no pressure.
            </p>
          </div>
        </div>

        <NoShameBanner compact />

        <SectionHeading title="All topics" />
        <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
          {weeklyTopics.map((topic) => {
            const tp = getWeeklyTopicProgress(topic.id);
            const pct = weeklyTopicPercent(tp);
            const isActive = pct > 0 && pct < 100;
            return (
              <Card key={topic.id} onClick={() => go('weekly-topic', topic.id)} className="!p-0 overflow-hidden space-y-0">
                <div className="flex gap-0">
                  <div className="w-[38%] shrink-0 lg:w-[42%]">
                    <TopicIllustrationPanel topicId={topic.id} aspect="square" className="h-full" />
                  </div>
                  <div className="flex-1 p-4 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="tile-label font-display font-bold text-forest dark:text-linen-100 text-base leading-tight">
                            {topic.title}
                          </p>
                          {isActive && (
                            <span className="shrink-0 rounded-full bg-olive-100 dark:bg-olive-900/40 text-olive-700 dark:text-olive-300 text-[10px] font-semibold uppercase tracking-wide px-2 py-0.5">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="tile-label text-sm text-forest/60 dark:text-linen/60 mt-1 leading-snug">{topic.description}</p>
                      </div>
                      <Icon name="ChevronRight" className="h-5 w-5 text-clay-300 shrink-0 mt-0.5" />
                    </div>
                    {pct >= 100 && (
                      <div className="flex items-center gap-1.5 text-olive-600 dark:text-olive-300">
                        <Icon name="Check" className="h-4 w-4" aria-hidden />
                        <span className="text-xs font-semibold">Complete</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="px-4 pb-4 space-y-1.5">
                  <WeeklyTopicProgressBar progress={tp} />
                  <p className="text-xs text-forest/50 dark:text-linen/50">{pct}% complete</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
