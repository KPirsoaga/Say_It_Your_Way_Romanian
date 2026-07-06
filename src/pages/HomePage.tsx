import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../context/ProgressContext';
import { colorMap, scenarios } from '../content';
import { scenarioGroups } from '../content/scenarioGroups';
import { todayStr } from '../context/ProgressContext';
import { weeklyTopics, weeklyTopicPercent } from '../content/weeklyTopics';
import { getWeeklyLessonPhrase } from '../content/weeklyTopics/dailyPhrase';
import type { PageId } from '../App';
import type { WeeklyTopicProgress } from '../types';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

const CABIN_TOPIC_ID = 'building-cabin';

const practiceTiles: { label: string; sub: string; icon: string; page: PageId; color: string }[] = [
  { label: 'Weekly Topics', sub: 'This week’s lesson path', icon: 'BookOpen', page: 'weekly-topics', color: 'from-sun-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Daily Practice', sub: 'A calm few minutes each day', icon: 'CalendarDays', page: 'daily', color: 'from-coral-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Grammar Help', sub: 'Simple patterns & verbs', icon: 'BookOpen', page: 'grammar', color: 'from-sun-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Phrase Builder', sub: 'Build sentences by tapping', icon: 'Sparkles', page: 'builder', color: 'from-sea-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Mini Conversations', sub: 'Real-life guided exchanges', icon: 'MessagesSquare', page: 'conversations', color: 'from-sea-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Real Life Mode', sub: 'Phrases for urgent situations', icon: 'HandHeart', page: 'reallife', color: 'from-rose-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Survival Romanian', sub: 'The most useful phrases, first', icon: 'LifeBuoy', page: 'survival', color: 'from-coral-50 to-white dark:from-ink-900 dark:to-ink-900' },
];

const scenarioMap = new Map(scenarios.map((s) => [s.id, s]));

export function HomePage({ go }: Props) {
  const { progress, getWeeklyTopicProgress } = useProgress();
  const today = todayStr();
  const lessonPhrase = getWeeklyLessonPhrase(today);
  const cabinTopic = weeklyTopics.find((t) => t.id === CABIN_TOPIC_ID) ?? weeklyTopics[0];
  const cabinProgress = getWeeklyTopicProgress(cabinTopic.id);
  const cabinPct = weeklyTopicPercent(cabinProgress);
  const lessonSummary = summariseLessonProgress(cabinProgress);

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-2 space-y-6">
      {/* Calm welcome — no competing actions */}
      <section className="rounded-3xl bg-gradient-to-br from-sea-400 to-sea-600 text-white p-6 shadow-soft-lg animate-fade-in">
        <p className="text-sm uppercase tracking-wide text-sea-100/90 font-bold">Bun venit!</p>
        <h1 className="text-3xl font-bold mt-1 leading-tight">What should you do next?</h1>
        <p className="mt-2 text-sea-50/90 text-base">Start with this week&apos;s lesson — a few calm minutes, no pressure.</p>
      </section>

      {/* Primary path: this week's lesson */}
      <section>
        <SectionTitle title="Continue this week's lesson" icon="BookOpen" />
        <Card className="p-5 bg-gradient-to-br from-sun-100 to-white dark:from-ink-900 dark:to-ink-900 ring-2 ring-sun-300 dark:ring-sun-300/30">
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-sun-50 dark:bg-sun-300/20 flex items-center justify-center shrink-0">
              <Icon name="Building2" className="h-7 w-7 text-sun-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-xl leading-tight">{cabinTopic.title}</p>
              <p className="tile-label text-sm text-ink-500 dark:text-ink-300 mt-1">{cabinTopic.description}</p>
              <p className="text-xs font-bold text-sun-500 dark:text-sun-300 mt-2">{cabinPct}% complete</p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <LessonProgressRow label="Vocabulary" done={cabinProgress.vocabularyViewed} detail={cabinProgress.vocabularyViewed ? 'Viewed' : 'Not started'} />
            <LessonProgressRow
              label="Reading"
              done={lessonSummary.readingsDone === 3}
              detail={`${lessonSummary.readingsDone} of 3`}
            />
            <LessonProgressRow
              label="Exercises"
              done={lessonSummary.exercisesDone === 4}
              detail={`${lessonSummary.exercisesDone} of 4`}
            />
            {cabinTopic.grammarFocus ? (
              <button
                type="button"
                onClick={() =>
                  go(cabinTopic.grammarFocus?.grammarTopicId ? 'grammar-topic' : 'grammar', cabinTopic.grammarFocus?.grammarTopicId)
                }
                className="w-full flex items-center justify-between gap-2 rounded-2xl p-3 ring-2 ring-sand-200 dark:ring-white/10 hover:ring-sea-400 transition text-left"
              >
                <span className="tile-label text-sm font-bold text-ink-700 dark:text-ink-300">Grammar focus</span>
                <span className="text-sm text-ink-500 dark:text-ink-400 text-right tile-label">
                  {cabinTopic.grammarFocus.hint}
                </span>
              </button>
            ) : null}
          </div>

          <Button variant="primary" size="lg" className="mt-4 w-full" onClick={() => go('weekly-topic', cabinTopic.id)}>
            <Icon name="BookOpen" className="h-5 w-5" />
            {cabinPct >= 100 ? 'Review lesson' : 'Continue'}
          </Button>
        </Card>
      </section>

      {/* Reinforcement from the weekly topic */}
      <section>
        <SectionTitle title="Today's phrase" icon="Star" />
        <p className="text-sm text-ink-500 dark:text-ink-300 mb-2">From {cabinTopic.title}</p>
        <Card className="bg-gradient-to-br from-sun-50 to-white dark:from-ink-900 dark:to-ink-900 p-4">
          <p className="text-xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {lessonPhrase.ro}
          </p>
          <p className="mt-2 text-ink-700 dark:text-ink-300">{lessonPhrase.en}</p>
        </Card>
      </section>

      {/* Learning engines */}
      <section>
        <SectionTitle title="Ways to practise" icon="LayoutGrid" />
        <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">Reinforce your lesson — pick what fits today.</p>
        <div className="grid grid-cols-2 gap-3 tile-grid">
          {practiceTiles.map((t) => (
            <Card key={t.label} onClick={() => go(t.page)} className={`home-tile bg-gradient-to-br ${t.color}`}>
              <div className="h-11 w-11 rounded-2xl bg-white/60 dark:bg-white/10 flex items-center justify-center shrink-0">
                <Icon name={t.icon} className="h-6 w-6 text-ink-700 dark:text-sand-100" />
              </div>
              <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm">{t.label}</p>
              <p className="tile-label text-xs text-ink-500 dark:text-ink-300">{t.sub}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Scenarios by group */}
      <section>
        <SectionTitle title="Scenarios" icon="LayoutGrid" />
        <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">Real-life conversations when you want extra practice.</p>
        <div className="space-y-5">
          {scenarioGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-bold text-ink-700 dark:text-ink-300 mb-0.5">{group.title}</h3>
              <p className="text-xs text-ink-500 dark:text-ink-400 mb-2">{group.description}</p>
              <div className="grid grid-cols-2 gap-3 tile-grid">
                {group.scenarioIds.map((id) => {
                  const s = scenarioMap.get(id);
                  if (!s) return null;
                  const c = colorMap[s.color];
                  const done = progress.completedScenarios.includes(s.id);
                  return (
                    <Card key={s.id} onClick={() => go('scenario', s.id)} className="home-tile">
                      <div className={`h-11 w-11 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0`}>
                        <Icon name={s.icon} className={`h-6 w-6 ${c.text}`} />
                      </div>
                      <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm">{s.title}</p>
                      <p className="tile-label text-xs text-ink-500 dark:text-ink-300">{s.lines.length} phrases</p>
                      {done && (
                        <span className="inline-flex items-center gap-1 text-sea-600 dark:text-sea-200 text-xs font-bold">
                          <Icon name="Check" className="h-4 w-4 shrink-0" /> Practised
                        </span>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="md" className="w-full mt-3" onClick={() => go('scenarios')}>
          See all scenarios
          <Icon name="ChevronRight" className="h-5 w-5" />
        </Button>
      </section>

      {/* Progress snapshot */}
      <section>
        <SectionTitle title="Progress" icon="BarChart3" />
        <div className="grid grid-cols-3 gap-3 tile-grid">
          <StatCard icon="Flame" value={progress.practisedDays.length} label="Days" color="text-coral-400" onClick={() => go('progress')} />
          <StatCard icon="HeartFilled" value={progress.favourites.length} label="Saved" color="text-rose-400" onClick={() => go('favourites')} />
          <StatCard icon="Trophy" value={progress.completedScenarios.length} label="Scenarios" color="text-sun-400" onClick={() => go('progress')} />
        </div>
        <Button variant="soft" size="md" className="w-full mt-3" onClick={() => go('progress')}>
          View full progress
          <Icon name="ChevronRight" className="h-5 w-5" />
        </Button>
      </section>
    </div>
  );
}

function summariseLessonProgress(p: WeeklyTopicProgress) {
  const readingsDone = [p.reading1Done, p.reading2Done, p.reading3Done].filter(Boolean).length;
  const exercisesDone = [p.roToEnDone, p.enToRoDone, p.matchingDone, p.sortingDone].filter(Boolean).length;
  return { readingsDone, exercisesDone };
}

function LessonProgressRow({ label, done, detail }: { label: string; done: boolean; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl p-3 bg-white/60 dark:bg-white/5">
      <span className="inline-flex items-center gap-2 min-w-0">
        <Icon name={done ? 'Check' : 'Circle'} className={`h-4 w-4 shrink-0 ${done ? 'text-sea-600 dark:text-sea-200' : 'text-ink-300 dark:text-ink-500'}`} />
        <span className="tile-label text-sm font-bold text-ink-900 dark:text-sand-100">{label}</span>
      </span>
      <span className="text-sm text-ink-500 dark:text-ink-400 shrink-0">{detail}</span>
    </div>
  );
}

function StatCard({ icon, value, label, color, onClick }: { icon: string; value: number; label: string; color: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}`}
      className="card !p-3 flex flex-col items-center gap-1 active:scale-[0.97] transition min-w-0 overflow-hidden"
    >
      <Icon name={icon} className={`h-6 w-6 ${color} shrink-0`} />
      <span className="text-2xl font-bold text-ink-900 dark:text-sand-100">{value}</span>
      <span className="tile-label text-xs text-ink-500 dark:text-ink-300 text-center">{label}</span>
    </button>
  );
}

function SectionTitle({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex items-center gap-2 mb-2 mt-1">
      <Icon name={icon} className="h-5 w-5 text-sea-600 dark:text-sea-200 shrink-0" />
      <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">{title}</h2>
    </div>
  );
}
