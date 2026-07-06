import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { NoShameBanner } from '../components/NoShameBanner';
import { useProgress } from '../context/ProgressContext';
import { colorMap, getDailyContent, scenarios } from '../content';
import { todayStr } from '../context/ProgressContext';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

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

export function HomePage({ go }: Props) {
  const { progress } = useProgress();
  const today = todayStr();
  const daily = getDailyContent(today);
  const daysCount = progress.practisedDays.length;
  const favCount = progress.favourites.length;
  const completedCount = progress.completedScenarios.length;

  return (
    <div className="mx-auto max-w-md px-4 pb-6 pt-2 space-y-5">
      {/* Greeting hero */}
      <section className="rounded-3xl bg-gradient-to-br from-sea-400 to-sea-600 text-white p-6 shadow-soft-lg animate-fade-in">
        <p className="text-sm uppercase tracking-wide text-sea-100/90 font-bold">Bun venit!</p>
        <h1 className="text-3xl font-bold mt-1 leading-tight">Let’s practise Romanian today</h1>
        <p className="mt-2 text-sea-50/90 text-base">A few calm minutes a day. No tests, no pressure — just speaking and listening.</p>
        <div className="mt-4 flex flex-col gap-2">
          <Button variant="secondary" size="lg" className="w-full bg-coral-400 hover:bg-coral-500" onClick={() => go('daily')}>
            <Icon name="Sparkles" className="h-5 w-5" />
            Start today’s practice
          </Button>
          <Button
            size="md"
            className="w-full bg-white/15 text-white hover:bg-white/25 backdrop-blur"
            onClick={() => go('tiny')}
          >
            <Icon name="Zap" className="h-5 w-5" />
            Tiny Practice — just 3 minutes
          </Button>
          <Button
            size="md"
            className="w-full bg-white/15 text-white hover:bg-white/25 backdrop-blur"
            onClick={() => go('conversations')}
          >
            <Icon name="MessagesSquare" className="h-5 w-5" />
            Practise a real conversation
          </Button>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-3 tile-grid">
        <StatCard icon="Flame" value={daysCount} label="Days" color="text-coral-400" onClick={() => go('progress')} />
        <StatCard icon="HeartFilled" value={favCount} label="Favourites" color="text-rose-400" onClick={() => go('favourites')} />
        <StatCard icon="Trophy" value={completedCount} label="Done" color="text-sun-400" onClick={() => go('progress')} />
      </section>

      {/* No-shame encouragement */}
      <NoShameBanner compact />

      {/* I actually need this today */}
      <section>
        <SectionTitle title="I actually need this today" icon="LifeBuoy" />
        <p className="text-ink-500 dark:text-ink-300 text-sm mb-3">Tap what’s happening right now. Get the phrases you need, fast.</p>
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

      {/* Quick activities */}
      <section>
        <SectionTitle title="Ways to practise" icon="LayoutGrid" />
        <div className="grid grid-cols-2 gap-3 tile-grid">
          <Card onClick={() => go('survival')} className="home-tile bg-gradient-to-br from-coral-50 to-white dark:from-ink-900 dark:to-ink-900">
            <div className="h-11 w-11 rounded-2xl bg-coral-50 dark:bg-coral-400/20 flex items-center justify-center shrink-0">
              <Icon name="LifeBuoy" className="h-6 w-6 text-coral-400" />
            </div>
            <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm">Survival Romanian</p>
            <p className="tile-label text-xs text-ink-500 dark:text-ink-300">The most useful phrases, first</p>
          </Card>
          <Card onClick={() => go('reallife')} className="home-tile bg-gradient-to-br from-rose-50 to-white dark:from-ink-900 dark:to-ink-900">
            <div className="h-11 w-11 rounded-2xl bg-rose-50 dark:bg-rose-400/20 flex items-center justify-center shrink-0">
              <Icon name="HandHeart" className="h-6 w-6 text-rose-400" />
            </div>
            <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm">Real Life Mode</p>
            <p className="tile-label text-xs text-ink-500 dark:text-ink-300">Phrases for urgent situations</p>
          </Card>
          <Card onClick={() => go('builder')} className="home-tile bg-gradient-to-br from-sun-50 to-white dark:from-ink-900 dark:to-ink-900">
            <div className="h-11 w-11 rounded-2xl bg-sun-50 dark:bg-sun-300/20 flex items-center justify-center shrink-0">
              <Icon name="Sparkles" className="h-6 w-6 text-sun-400" />
            </div>
            <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm">Phrase Builder</p>
            <p className="tile-label text-xs text-ink-500 dark:text-ink-300">Build sentences by tapping</p>
          </Card>
          <Card onClick={() => go('conversations')} className="home-tile bg-gradient-to-br from-sea-50 to-white dark:from-ink-900 dark:to-ink-900">
            <div className="h-11 w-11 rounded-2xl bg-sea-50 dark:bg-sea-600/20 flex items-center justify-center shrink-0">
              <Icon name="MessagesSquare" className="h-6 w-6 text-sea-600" />
            </div>
            <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm">Mini Conversations</p>
            <p className="tile-label text-xs text-ink-500 dark:text-ink-300">Real-life guided exchanges</p>
          </Card>
          <Card onClick={() => go('grammar')} className="home-tile bg-gradient-to-br from-sun-50 to-white dark:from-ink-900 dark:to-ink-900">
            <div className="h-11 w-11 rounded-2xl bg-sun-50 dark:bg-sun-300/20 flex items-center justify-center shrink-0">
              <Icon name="BookOpen" className="h-6 w-6 text-sun-400" />
            </div>
            <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm">Grammar Help</p>
            <p className="tile-label text-xs text-ink-500 dark:text-ink-300">Simple patterns & verbs</p>
          </Card>
          <Card onClick={() => go('noshame')} className="home-tile bg-gradient-to-br from-rose-50 to-white dark:from-ink-900 dark:to-ink-900">
            <div className="h-11 w-11 rounded-2xl bg-rose-50 dark:bg-rose-400/20 flex items-center justify-center shrink-0">
              <Icon name="Heart" className="h-6 w-6 text-rose-400" />
            </div>
            <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm">No Shame Mode</p>
            <p className="tile-label text-xs text-ink-500 dark:text-ink-300">Gentle reminders when it’s hard</p>
          </Card>
        </div>
      </section>

      {/* Today’s phrase preview */}
      <section>
        <SectionTitle title="Today’s phrase" icon="Star" />
        <Card className="bg-gradient-to-br from-sun-50 to-white dark:from-ink-900 dark:to-ink-900">
          <p className="text-xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {daily.phrase.ro}
          </p>
          <p className="mt-2 text-ink-700 dark:text-ink-300">{daily.phrase.en}</p>
          <Button variant="soft" size="md" className="mt-3" onClick={() => go('daily')}>
            Open daily practice
            <Icon name="ChevronRight" className="h-5 w-5" />
          </Button>
        </Card>
      </section>

      {/* Scenarios quick grid */}
      <section>
        <SectionTitle title="Pick a scenario" icon="LayoutGrid" />
        <div className="grid grid-cols-2 gap-3 tile-grid">
          {scenarios.map((s) => {
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
    <div className="flex items-center gap-2 mb-3 mt-1">
      <Icon name={icon} className="h-5 w-5 text-sea-600 dark:text-sea-200" />
      <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">{title}</h2>
    </div>
  );
}
