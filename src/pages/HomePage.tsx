import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { BrandLogo } from '../components/brand/BrandLogo';
import { SectionHeading } from '../components/brand/SectionHeading';
import { ProgressBar } from '../components/brand/ProgressBar';
import { useProgress } from '../context/ProgressContext';
import { todayStr } from '../context/ProgressContext';
import { weeklyTopics, weeklyTopicPercent } from '../content/weeklyTopics';
import { dictionaryStats } from '../content/dictionary';
import type { PageId } from '../App';
import type { WeeklyTopicProgress } from '../types';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

function findActiveTopic(getWeeklyTopicProgress: (id: string) => WeeklyTopicProgress) {
  const incomplete = weeklyTopics.find((t) => weeklyTopicPercent(getWeeklyTopicProgress(t.id)) < 100);
  return incomplete ?? weeklyTopics[0]!;
}

export function HomePage({ go }: Props) {
  const { progress, getWeeklyTopicProgress } = useProgress();
  const today = todayStr();
  const activeTopic = findActiveTopic(getWeeklyTopicProgress);
  const topicProgress = getWeeklyTopicProgress(activeTopic.id);
  const pct = weeklyTopicPercent(topicProgress);
  const lessonSummary = summariseLessonProgress(topicProgress);
  const dictStats = dictionaryStats();
  const practisedToday = progress.practisedDays.includes(today);

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-[max(0.5rem,env(safe-area-inset-top))] space-y-8">
      {/* Greeting */}
      <header className="animate-fade-in pt-10">
        <p className="font-script text-2xl text-coral leading-none">Bună!</p>
        <h1 className="font-display text-2xl font-bold text-forest dark:text-linen-100 mt-1 leading-tight">
          Your Romanian notebook
        </h1>
        <p className="text-sm text-forest/60 dark:text-linen/60 mt-1">
          Real language. Real life. Your pace.
        </p>
      </header>

      {/* Continue learning */}
      <section className="animate-fade-in">
        <SectionHeading title="Continue learning" subtitle={activeTopic.title} />
        <Card variant="accent" className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white/70 dark:bg-forest-800/50 flex items-center justify-center shrink-0">
              <Icon name={activeTopic.icon} className="h-6 w-6 text-olive-600 dark:text-olive-300" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg font-bold text-forest dark:text-linen-100 leading-tight">
                {activeTopic.title}
              </p>
              <p className="text-sm text-forest/70 dark:text-linen/70 mt-0.5">{activeTopic.description}</p>
            </div>
          </div>

          <ProgressBar value={pct} label="Lesson progress" />

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <MiniStat label="Vocab" done={topicProgress.vocabularyViewed} detail={topicProgress.vocabularyViewed ? '✓' : '—'} />
            <MiniStat label="Reading" done={lessonSummary.readingsDone === 3} detail={`${lessonSummary.readingsDone}/3`} />
            <MiniStat label="Practice" done={lessonSummary.exercisesDone === 4} detail={`${lessonSummary.exercisesDone}/4`} />
          </div>

          {activeTopic.grammarFocus && (
            <button
              type="button"
              onClick={() => {
                const f = activeTopic.grammarFocus;
                if (f?.grammarVerbId) go('grammar-verb', f.grammarVerbId);
                else if (f?.grammarTenseId) go('grammar-tense', f.grammarTenseId);
                else if (f?.grammarTopicId) go('grammar-topic', f.grammarTopicId);
                else go('grammar');
              }}
              className="w-full flex items-center justify-between gap-2 rounded-2xl px-3 py-2.5 bg-white/60 dark:bg-forest-800/40 text-left transition hover:ring-2 hover:ring-olive-300/50"
            >
              <span className="text-sm font-semibold text-forest/80 dark:text-linen/80">Grammar focus</span>
              <span className="text-sm text-forest/60 dark:text-linen/60 text-right">{activeTopic.grammarFocus.hint}</span>
            </button>
          )}

          <Button variant="primary" size="lg" className="w-full" onClick={() => go('weekly-topic', activeTopic.id)}>
            <Icon name="BookOpen" className="h-5 w-5" />
            {pct >= 100 ? 'Review lesson' : 'Continue lesson'}
          </Button>
        </Card>
      </section>

      {/* Daily practice */}
      <section className="animate-fade-in">
        <SectionHeading title="Daily practice" subtitle="5 calm minutes" />
        <Card className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-coral-50 dark:bg-coral-900/20 flex items-center justify-center shrink-0">
              <Icon name="CalendarDays" className="h-6 w-6 text-coral" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-forest dark:text-linen-100">Recognise word forms</p>
              <p className="text-sm text-forest/60 dark:text-linen/60">
                {practisedToday ? 'Done for today — well done!' : 'Short session from your current topic & dictionary'}
              </p>
            </div>
          </div>
          <Button variant={practisedToday ? 'outline' : 'secondary'} size="lg" className="w-full" onClick={() => go('daily')}>
            {practisedToday ? 'Practise again' : 'Start daily practice'}
            <Icon name="ArrowRight" className="h-5 w-5" />
          </Button>
        </Card>
      </section>

      {/* Quiet access */}
      <section className="animate-fade-in">
        <SectionHeading title="Explore" />
        <div className="grid grid-cols-2 gap-2">
          <QuietLink icon="BookOpen" label="Topics" onClick={() => go('weekly-topics')} />
          <QuietLink icon="BookMarked" label="Dictionary" sub={`${dictStats.total} words`} onClick={() => go('dictionary')} />
          <QuietLink icon="BookOpen" label="Grammar" onClick={() => go('grammar')} />
          <QuietLink icon="BarChart3" label="Progress" onClick={() => go('progress')} />
        </div>
      </section>

      <footer className="pt-4 pb-2 flex justify-center opacity-60">
        <BrandLogo variant="compact" />
      </footer>
    </div>
  );
}

function summariseLessonProgress(p: WeeklyTopicProgress) {
  const readingsDone = [p.reading1Done, p.reading2Done, p.reading3Done].filter(Boolean).length;
  const exercisesDone = [p.roToEnDone, p.enToRoDone, p.matchingDone, p.sortingDone].filter(Boolean).length;
  return { readingsDone, exercisesDone };
}

function MiniStat({ label, done, detail }: { label: string; done: boolean; detail: string }) {
  return (
    <div className="rounded-xl bg-white/50 dark:bg-forest-800/30 px-2 py-2">
      <p className="text-forest/50 dark:text-linen/50 font-semibold uppercase tracking-wide text-[10px]">{label}</p>
      <p className={`text-sm font-bold mt-0.5 ${done ? 'text-olive-600 dark:text-olive-300' : 'text-forest/70 dark:text-linen/70'}`}>
        {detail}
      </p>
    </div>
  );
}

function QuietLink({
  icon,
  label,
  sub,
  onClick,
}: {
  icon: string;
  label: string;
  sub?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-2xl border border-forest/8 dark:border-linen/10 bg-white/60 dark:bg-forest-800/30 px-4 py-3 text-left transition hover:border-olive-300/50 active:scale-[0.98]"
    >
      <Icon name={icon} className="h-5 w-5 text-olive-600 dark:text-olive-300 mb-2" />
      <p className="font-semibold text-sm text-forest dark:text-linen-100">{label}</p>
      {sub && <p className="text-xs text-forest/50 dark:text-linen/50 mt-0.5">{sub}</p>}
    </button>
  );
}
