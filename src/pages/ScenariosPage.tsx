import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { useProgress } from '../context/ProgressContext';
import { colorMap, scenarios } from '../content';
import { scenarioGroups } from '../content/scenarioGroups';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
  onBack: () => void;
}

const scenarioMap = new Map(scenarios.map((s) => [s.id, s]));

export function ScenariosPage({ go, onBack }: Props) {
  const { progress } = useProgress();

  return (
    <div className="min-h-screen">
      <PageHeader title="Scenarios" subtitle="Real-life conversations" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-6">
        {scenarioGroups.map((group) => (
          <section key={group.title}>
            <h2 className="text-base font-bold text-ink-900 dark:text-sand-100">{group.title}</h2>
            <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">{group.description}</p>
            <div className="space-y-3">
              {group.scenarioIds.map((id) => {
                const s = scenarioMap.get(id);
                if (!s) return null;
                const c = colorMap[s.color];
                const done = progress.completedScenarios.includes(s.id);
                return (
                  <Card key={s.id} onClick={() => go('scenario', s.id)} className="flex items-center gap-4 p-4">
                    <div className={`h-14 w-14 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0`}>
                      <Icon name={s.icon} className={`h-7 w-7 ${c.text}`} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-lg leading-tight">{s.title}</p>
                      <p className="text-sm text-ink-500 dark:text-ink-300 mt-0.5 line-clamp-2">{s.situation}</p>
                      <p className="text-xs text-ink-300 dark:text-ink-500 mt-1">{s.lines.length} phrases</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      {done && (
                        <span className="inline-flex items-center gap-1 text-sea-600 dark:text-sea-200 text-xs font-bold">
                          <Icon name="Check" className="h-4 w-4" /> Done
                        </span>
                      )}
                      <Icon name="ChevronRight" className="h-5 w-5 text-ink-300 dark:text-ink-500" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
