import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { useProgress, toLocalDateStr } from '../context/ProgressContext';
import { scenarios, miniConversations, grammarTopics } from '../content';
import { weeklyTopics, weeklyTopicPercent } from '../content/weeklyTopics';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

export function ProgressPage({ go }: Props) {
  const { progress, resetProgress, getWeeklyTopicProgress } = useProgress();

  const daysCount = progress.practisedDays.length;
  const favCount = progress.favourites.length;
  const completedCount = progress.completedScenarios.length;
  const convCount = progress.completedConversations.length;
  const grammarCount = progress.completedGrammarTopics.length;

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
        <div className="grid grid-cols-2 gap-3 tile-grid">
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
            <CountRow icon="BookOpen" label="Grammar topics practised" value={grammarCount} color="text-sun-400" />
          </div>
        </Card>

        {/* Weekly Topics */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Weekly Topics</p>
          <div className="space-y-3">
            {weeklyTopics.map((topic) => {
              const tp = getWeeklyTopicProgress(topic.id);
              const pct = weeklyTopicPercent(tp);
              return (
                <div key={topic.id} className="space-y-2">
                  <div className="flex items-center justify-between gap-2 min-w-0">
                    <span className="tile-label text-ink-700 dark:text-ink-300 text-base flex-1 font-bold">{topic.title}</span>
                    <span className="text-sm text-sea-600 dark:text-sea-200 font-bold shrink-0">{pct}%</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-sm text-ink-600 dark:text-ink-300">
                    <WeeklyProgressRow label="Vocabulary" done={tp.vocabularyViewed} />
                    <WeeklyProgressRow label="Reading 1" done={tp.reading1Done} />
                    <WeeklyProgressRow label="Reading 2" done={tp.reading2Done} />
                    <WeeklyProgressRow label="Reading 3" done={tp.reading3Done} />
                    <WeeklyProgressRow label="Translation" done={tp.translationAttempted} />
                    <WeeklyProgressRow label="Ro → En" done={tp.roToEnDone} />
                    <WeeklyProgressRow label="En → Ro" done={tp.enToRoDone} />
                    <WeeklyProgressRow label="Matching" done={tp.matchingDone} />
                    <WeeklyProgressRow label="Sorting" done={tp.sortingDone} />
                  </div>
                  <Button variant="ghost" size="md" onClick={() => go('weekly-topic', topic.id)} className="text-sea-600 dark:text-sea-200 w-full">
                    Open topic
                    <Icon name="ChevronRight" className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Grammar topics */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Grammar Help</p>
          <div className="space-y-2">
            {grammarTopics.map((t) => {
              const done = progress.completedGrammarTopics.includes(t.id);
              return (
                <div key={t.id} className="flex items-center justify-between gap-2 min-w-0">
                  <span className="tile-label text-ink-700 dark:text-ink-300 text-base flex-1 min-w-0">{t.title}</span>
                  {done ? (
                    <span className="inline-flex items-center gap-1 text-sea-600 dark:text-sea-200 font-bold text-sm">
                      <Icon name="Check" className="h-4 w-4" /> Done
                    </span>
                  ) : (
                    <Button variant="ghost" size="md" onClick={() => go('grammar-topic', t.id)} className="text-sea-600 dark:text-sea-200">
                      Practise
                      <Icon name="ChevronRight" className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Scenarios completed */}
        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-3">Scenarios</p>
          <div className="space-y-2">
            {scenarios.map((s) => {
              const done = progress.completedScenarios.includes(s.id);
              return (
                <div key={s.id} className="flex items-center justify-between gap-2 min-w-0">
                  <span className="tile-label text-ink-700 dark:text-ink-300 text-base flex-1 min-w-0">{s.title}</span>
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
                <div key={conv.id} className="flex items-center justify-between gap-2 min-w-0">
                  <span className="tile-label text-ink-700 dark:text-ink-300 text-base flex-1 min-w-0">{conv.title}</span>
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
    <div className="card p-4 flex flex-col items-center gap-2 min-w-0">
      <div className={`h-10 w-10 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon name={icon} className={`h-6 w-6 ${color}`} />
      </div>
      <span className="text-3xl font-bold text-ink-900 dark:text-sand-100">{value}</span>
      <span className="tile-label text-xs text-ink-500 dark:text-ink-300 text-center">{label}</span>
    </div>
  );
}

function CountRow({ icon, label, value, color }: { icon: string; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Icon name={icon} className={`h-5 w-5 ${color} shrink-0`} />
      <span className="tile-label text-ink-700 dark:text-ink-300 text-base flex-1 min-w-0">{label}</span>
      <span className="font-bold text-ink-900 dark:text-sand-100 text-lg shrink-0">{value}</span>
    </div>
  );
}

function WeeklyProgressRow({ label, done }: { label: string; done: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1 ${done ? 'text-sea-600 dark:text-sea-200' : ''}`}>
      <Icon name={done ? 'Check' : 'Circle'} className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}
