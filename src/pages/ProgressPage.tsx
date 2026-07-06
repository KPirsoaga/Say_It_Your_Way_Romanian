import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { useProgress, toLocalDateStr } from '../context/ProgressContext';
import { scenarios, miniConversations } from '../content';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

export function ProgressPage({ go }: Props) {
  const { progress, resetProgress } = useProgress();

  const daysCount = progress.practisedDays.length;
  const favCount = progress.favourites.length;
  const completedCount = progress.completedScenarios.length;
  const convCount = progress.completedConversations.length;

  // Build a simple 4-week streak strip
  const last28 = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return toLocalDateStr(d);
  });
  const practicedSet = new Set(progress.practisedDays);

  return (
    <div className="min-h-screen">
      <PageHeader title="Progress" subtitle="Your calm, steady practice" />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        {/* Big numbers */}
        <div className="grid grid-cols-2 gap-3">
          <BigStat icon="Flame" value={daysCount} label="Days practised" color="text-coral-400" bg="bg-coral-50 dark:bg-coral-400/20" />
          <BigStat icon="HeartFilled" value={favCount} label="Saved phrases" color="text-rose-400" bg="bg-rose-50 dark:bg-rose-400/20" />
          <BigStat icon="Trophy" value={completedCount} label="Scenarios done" color="text-sun-400" bg="bg-sun-50 dark:bg-sun-300/20" />
          <BigStat icon="MessagesSquare" value={convCount} label="Conversations" color="text-sea-600" bg="bg-sea-50 dark:bg-sea-600/20" />
        </div>

        {/* Activity strip */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Last 4 weeks</p>
          <div className="grid grid-cols-7 gap-1.5">
            {last28.map((d, i) => {
              const did = practicedSet.has(d);
              return (
                <div
                  key={i}
                  title={d}
                  className={`aspect-square rounded-md ${
                    did ? 'bg-sea-500 animate-bar-grow origin-bottom' : 'bg-sand-200 dark:bg-white/10'
                  }`}
                />
              );
            })}
          </div>
          <p className="text-xs text-ink-500 dark:text-ink-300 mt-3">Each square is one day. Filled means you practised.</p>
        </Card>

        {/* Activity counts */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Activity counts</p>
          <div className="space-y-2">
            <CountRow icon="BookOpen" label="Listening answers correct" value={progress.listenCorrect} color="text-sea-600 dark:text-sea-200" />
            <CountRow icon="Mic" label="Sentences said out loud" value={progress.speakDone} color="text-rose-400" />
            <CountRow icon="Sparkles" label="Phrases built" value={progress.builderDone} color="text-coral-400" />
          </div>
        </Card>

        {/* Scenarios completed */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Scenarios</p>
          <div className="space-y-2">
            {scenarios.map((s) => {
              const done = progress.completedScenarios.includes(s.id);
              return (
                <div key={s.id} className="flex items-center justify-between gap-2">
                  <span className="text-ink-700 dark:text-ink-300 text-base">{s.title}</span>
                  {done ? (
                    <span className="inline-flex items-center gap-1 text-sea-600 dark:text-sea-200 font-bold text-sm">
                      <Icon name="Check" className="h-4 w-4" /> Done
                    </span>
                  ) : (
                    <Button variant="ghost" size="md" onClick={() => go('scenario', s.id)} className="text-sea-600 dark:text-sea-200">
                      Practise
                      <Icon name="ChevronRight" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Reset */}
        {/* Mini conversations completed */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Mini Conversations</p>
          <div className="space-y-2">
            {miniConversations.map((conv) => {
              const done = progress.completedConversations.includes(conv.id);
              return (
                <div key={conv.id} className="flex items-center justify-between gap-2">
                  <span className="text-ink-700 dark:text-ink-300 text-base">{conv.title}</span>
                  {done ? (
                    <span className="inline-flex items-center gap-1 text-sea-600 dark:text-sea-200 font-bold text-sm">
                      <Icon name="Check" className="h-4 w-4" /> Done
                    </span>
                  ) : (
                    <Button
                      variant="ghost"
                      size="md"
                      onClick={() => go('conversation', conv.id)}
                      className="text-sea-600 dark:text-sea-200"
                    >
                      Practise
                      <Icon name="ChevronRight" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Reset */}
        <Button
          variant="danger"
          size="md"
          className="w-full"
          onClick={() => {
            if (confirm('Reset all your progress and favourites? This cannot be undone.')) resetProgress();
          }}
        >
          <Icon name="RotateCcw" className="h-5 w-5" />
          Reset all progress
        </Button>
      </div>
    </div>
  );
}

function BigStat({ icon, value, label, color, bg }: { icon: string; value: number; label: string; color: string; bg: string }) {
  return (
    <div className="card p-4 flex flex-col items-center gap-2">
      <div className={`h-10 w-10 rounded-2xl ${bg} flex items-center justify-center`}>
        <Icon name={icon} className={`h-6 w-6 ${color}`} />
      </div>
      <span className="text-3xl font-bold text-ink-900 dark:text-sand-100">{value}</span>
      <span className="text-xs text-ink-500 dark:text-ink-300">{label}</span>
    </div>
  );
}

function CountRow({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <Icon name={icon} className={`h-5 w-5 ${color} shrink-0`} />
      <span className="text-ink-700 dark:text-ink-300 text-base flex-1">{label}</span>
      <span className="font-bold text-ink-900 dark:text-sand-100 text-lg">{value}</span>
    </div>
  );
}
