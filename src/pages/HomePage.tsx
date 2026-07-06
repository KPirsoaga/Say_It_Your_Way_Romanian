import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useProgress } from '../context/ProgressContext';
import { colorMap, scenarios } from '../content';
import { todayStr } from '../context/ProgressContext';
import { weeklyTopics, weeklyTopicPercent } from '../content/weeklyTopics';
import { getWeeklyLessonPhrase } from '../content/weeklyTopics/dailyPhrase';
import { WeeklyTopicProgressBar } from '../components/WeeklyTopicProgressBar';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

const CABIN_TOPIC_ID = 'building-cabin';

const needNowButtons: { label: string; icon: string; categoryId: string; color: string }[] = [
  { label: 'Vet', icon: 'PawPrint', categoryId: 'rl-doctor', color: 'text-coral-400 bg-coral-50 dark:bg-coral-400/20' },
  { label: 'Shop', icon: 'ShoppingBasket', categoryId: 'rl-shop', color: 'text-sun-400 bg-sun-50 dark:bg-sun-300/20' },
  { label: 'Neighbours', icon: 'DoorOpen', categoryId: 'rl-neighbours', color: 'text-sea-600 bg-sea-50 dark:bg-sea-600/20' },
  { label: 'Appointment', icon: 'CalendarClock', categoryId: 'rl-today', color: 'text-rose-400 bg-rose-50 dark:bg-rose-400/20' },
  { label: 'Help', icon: 'HandHeart', categoryId: 'rl-help', color: 'text-coral-400 bg-coral-50 dark:bg-coral-400/20' },
  { label: 'Pharmacy', icon: 'Pill', categoryId: 'rl-pharmacy', color: 'text-rose-400 bg-rose-50 dark:bg-rose-400/20' },
  { label: 'Café', icon: 'Coffee', categoryId: 'rl-cafe', color: 'text-coral-400 bg-coral-50 dark:bg-coral-400/20' },
  { label: 'Taxi', icon: 'Car', categoryId: 'rl-taxi', color: 'text-sun-400 bg-sun-50 dark:bg-sun-300/20' },
  { label: 'Lesson', icon: 'GraduationCap', categoryId: 'rl-lesson', color: 'text-sea-600 bg-sea-50 dark:bg-sea-600/20' },
  { label: 'Repeat please', icon: 'Repeat', categoryId: 'rl-repeat', color: 'text-sea-600 bg-sea-50 dark:bg-sea-600/20' },
  { label: 'Need time to think', icon: 'Brain', categoryId: 'rl-time', color: 'text-sun-400 bg-sun-50 dark:bg-sun-300/20' },
  { label: 'I don’t understand', icon: 'EarOff', categoryId: 'rl-understand', color: 'text-sea-600 bg-sea-50 dark:bg-sea-600/20' },
];

const practiceTiles: { label: string; sub: string; icon: string; page: PageId; color: string }[] = [
  { label: 'Survival Romanian', sub: 'The most useful phrases, first', icon: 'LifeBuoy', page: 'survival', color: 'from-coral-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Real Life Mode', sub: 'Phrases for urgent situations', icon: 'HandHeart', page: 'reallife', color: 'from-rose-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Phrase Builder', sub: 'Build sentences by tapping', icon: 'Sparkles', page: 'builder', color: 'from-sun-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Mini Conversations', sub: 'Real-life guided exchanges', icon: 'MessagesSquare', page: 'conversations', color: 'from-sea-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'Grammar Help', sub: 'Simple patterns & verbs', icon: 'BookOpen', page: 'grammar', color: 'from-sun-50 to-white dark:from-ink-900 dark:to-ink-900' },
  { label: 'No Shame Mode', sub: 'Gentle reminders when it’s hard', icon: 'Heart', page: 'noshame', color: 'from-rose-50 to-white dark:from-ink-900 dark:to-ink-900' },
];

export function HomePage({ go }: Props) {
  const { progress, getWeeklyTopicProgress } = useProgress();
  const today = todayStr();
  const lessonPhrase = getWeeklyLessonPhrase(today);
  const cabinTopic = weeklyTopics.find((t) => t.id === CABIN_TOPIC_ID) ?? weeklyTopics[0];
  const cabinProgress = getWeeklyTopicProgress(cabinTopic.id);
  const cabinPct = weeklyTopicPercent(cabinProgress);

  return (
    <div className="mx-auto max-w-md px-4 pb-8 pt-2 space-y-6">
      {/* Hero */}
      <section className="rounded-3xl bg-gradient-to-br from-sea-400 to-sea-600 text-white p-6 shadow-soft-lg animate-fade-in">
        <p className="text-sm uppercase tracking-wide text-sea-100/90 font-bold">Bun venit!</p>
        <h1 className="text-3xl font-bold mt-1 leading-tight">Let’s practise Romanian today</h1>
        <p className="mt-2 text-sea-50/90 text-base">A few calm minutes a day. No tests, no pressure.</p>
        <div className="mt-4 flex flex-col gap-2">
          {cabinPct < 100 ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full bg-sun-300 hover:bg-sun-400 text-ink-900"
              onClick={() => go('weekly-topic', cabinTopic.id)}
            >
              <Icon name="BookOpen" className="h-5 w-5" />
              Continue this week&apos;s lesson
            </Button>
          ) : null}
          <Button variant="secondary" size="lg" className="w-full bg-coral-400 hover:bg-coral-500" onClick={() => go('daily')}>
            <Icon name="Sparkles" className="h-5 w-5" />
            Start today&apos;s practice
          </Button>
          <Button
            size="md"
            className="w-full bg-white/15 text-white hover:bg-white/25 backdrop-blur"
            onClick={() => go('tiny')}
          >
            <Icon name="Zap" className="h-5 w-5" />
            Tiny Practice — 3 minutes
          </Button>
        </div>
      </section>

      {/* This week's lesson — primary path */}
      <section>
        <SectionTitle title="This week’s lesson" icon="BookOpen" />
        <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">
          Reinforce your lesson with Mihaela — vocabulary, reading, and practice.
        </p>
        <Card
          onClick={() => go('weekly-topic', cabinTopic.id)}
          className="p-5 bg-gradient-to-br from-sun-100 to-white dark:from-ink-900 dark:to-ink-900 ring-2 ring-sun-300 dark:ring-sun-300/30"
        >
          <div className="flex items-start gap-4">
            <div className="h-14 w-14 rounded-2xl bg-sun-50 dark:bg-sun-300/20 flex items-center justify-center shrink-0">
              <Icon name="Building2" className="h-7 w-7 text-sun-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-lg leading-tight">{cabinTopic.title}</p>
              <p className="tile-label text-sm text-ink-500 dark:text-ink-300 mt-1">{cabinTopic.description}</p>
              <p className="text-xs font-bold text-sun-500 dark:text-sun-300 mt-2">{cabinPct}% complete · tap to continue</p>
            </div>
            <Icon name="ChevronRight" className="h-6 w-6 text-ink-300 dark:text-ink-500 shrink-0 mt-1" />
          </div>
          <div className="mt-4">
            <WeeklyTopicProgressBar progress={cabinProgress} />
          </div>
        </Card>
        <button
          type="button"
          onClick={() => go('weekly-topics')}
          className="mt-2 w-full text-center text-sm font-bold text-sea-600 dark:text-sea-200 py-2"
        >
          View all weekly topics
        </button>
      </section>

      {/* Quick stats — below lesson */}
      <section className="grid grid-cols-3 gap-3 tile-grid">
        <StatCard icon="Flame" value={progress.practisedDays.length} label="Days" color="text-coral-400" onClick={() => go('progress')} />
        <StatCard icon="HeartFilled" value={progress.favourites.length} label="Saved" color="text-rose-400" onClick={() => go('favourites')} />
        <StatCard icon="Trophy" value={progress.completedScenarios.length} label="Practised" color="text-sun-400" onClick={() => go('progress')} />
      </section>

      {/* I actually need this today */}
      <section>
        <SectionTitle title="I actually need this today" icon="LifeBuoy" />
        <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">Tap what’s happening right now.</p>
        <div className="grid grid-cols-2 gap-3 tile-grid">
          {needNowButtons.map((b) => (
            <Card key={b.label} onClick={() => go('reallife', b.categoryId)} className="home-tile">
              <div className={`h-10 w-10 rounded-2xl ${b.color} flex items-center justify-center shrink-0`}>
                <Icon name={b.icon} className="h-5 w-5" />
              </div>
              <span className="tile-label font-bold text-ink-900 dark:text-sand-100 text-xs">{b.label}</span>
            </Card>
          ))}
        </div>
      </section>

      {/* Ways to practise */}
      <section>
        <SectionTitle title="Ways to practise" icon="LayoutGrid" />
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

      {/* Today’s phrase */}
      <section>
        <SectionTitle title="Today’s phrase" icon="Star" />
        <p className="text-sm text-ink-500 dark:text-ink-300 mb-2">From this week&apos;s lesson — Building a Cabin</p>
        <Card className="bg-gradient-to-br from-sun-50 to-white dark:from-ink-900 dark:to-ink-900">
          <p className="text-xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {lessonPhrase.ro}
          </p>
          <p className="mt-2 text-ink-700 dark:text-ink-300">{lessonPhrase.en}</p>
          <Button variant="soft" size="md" className="mt-3" onClick={() => go('weekly-topic', cabinTopic.id)}>
            Open this week&apos;s lesson
            <Icon name="ChevronRight" className="h-5 w-5" />
          </Button>
        </Card>
      </section>

      {/* Scenarios */}
      <section>
        <SectionTitle title="Scenarios" icon="LayoutGrid" />
        <div className="grid grid-cols-2 gap-3 tile-grid">
          {scenarios.slice(0, 6).map((s) => {
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
        <Button variant="ghost" size="md" className="w-full mt-3" onClick={() => go('scenarios')}>
          See all scenarios
          <Icon name="ChevronRight" className="h-5 w-5" />
        </Button>
      </section>
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
