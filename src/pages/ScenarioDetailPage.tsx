import { PageHeader } from '../components/PageHeader';
import { PhraseCard } from '../components/PhraseCard';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useProgress } from '../context/ProgressContext';
import { colorMap, scenarios } from '../content';
import type { ScenarioId } from '../types';
import type { PageId } from '../App';

interface Props {
  scenarioId: ScenarioId;
  go: (page: PageId, arg?: string) => void;
}

export function ScenarioDetailPage({ scenarioId, go }: Props) {
  const scenario = scenarios.find((s) => s.id === scenarioId);
  const { markScenarioCompleted, progress } = useProgress();

  if (!scenario) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Scenario not found" onBack={() => go('scenarios')} />
        <div className="mx-auto max-w-md px-4 pb-32 pt-8 text-center space-y-4">
          <p className="text-ink-700 dark:text-ink-300 text-lg">We couldn’t find that scenario. Pick one from the list.</p>
          <Button variant="primary" size="lg" onClick={() => go('scenarios')}>
            <Icon name="LayoutGrid" className="h-5 w-5" />
            View scenarios
          </Button>
        </div>
      </div>
    );
  }

  const c = colorMap[scenario.color];
  const alreadyDone = progress.completedScenarios.includes(scenarioId);

  const finish = () => {
    markScenarioCompleted(scenarioId);
    go('home');
  };

  return (
    <div className="min-h-screen">
      <PageHeader title={scenario.title} onBack={() => go('scenarios')} />

      {/* Situation banner */}
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className={`rounded-3xl ${c.bgSoft} p-5 flex items-start gap-3`}>
          <div className={`h-12 w-12 rounded-2xl bg-white/70 dark:bg-white/10 flex items-center justify-center shrink-0`}>
            <Icon name={scenario.icon} className={`h-6 w-6 ${c.text}`} />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide font-bold text-ink-500 dark:text-ink-300">The situation</p>
            <p className="text-lg text-ink-900 dark:text-sand-100 font-bold leading-snug">{scenario.situation}</p>
          </div>
        </div>
      </div>

      {/* Phrases */}
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <p className="text-ink-500 dark:text-ink-300 text-base">
          Listen, repeat, and save the ones you want to keep. Take your time.
        </p>
        {scenario.lines.map((line, i) => (
          <PhraseCard key={i} phrase={line} favId={`${scenario.id}:${i}`} />
        ))}

        <Button variant="primary" size="lg" className="w-full mt-2" onClick={finish}>
          <Icon name="Check" className="h-5 w-5" />
          {alreadyDone ? 'Done — back to home' : 'I finished this scenario'}
        </Button>
      </div>
    </div>
  );
}
