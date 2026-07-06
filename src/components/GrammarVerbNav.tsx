import { grammarVerbs } from '../content';
import { getVerbNav } from '../content/grammarVerbNav';

interface Props {
  verbId: string;
  onSelect: (verbId: string) => void;
}

export function GrammarVerbNav({ verbId, onSelect }: Props) {
  const { prevId, nextId } = getVerbNav(verbId);
  const prev = prevId ? grammarVerbs.find((v) => v.id === prevId) : undefined;
  const next = nextId ? grammarVerbs.find((v) => v.id === nextId) : undefined;

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {prev ? (
          <button
            type="button"
            onClick={() => onSelect(prev.id)}
            className="flex-1 min-w-0 rounded-2xl p-3 ring-2 ring-sand-200 dark:ring-white/10 text-left hover:ring-sea-400 transition"
          >
            <span className="text-xs font-bold text-ink-500 dark:text-ink-400">← Previous</span>
            <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm mt-0.5" lang="ro">
              {prev.infinitive}
            </p>
          </button>
        ) : (
          <div className="flex-1" />
        )}
        {next ? (
          <button
            type="button"
            onClick={() => onSelect(next.id)}
            className="flex-1 min-w-0 rounded-2xl p-3 ring-2 ring-sand-200 dark:ring-white/10 text-right hover:ring-sea-400 transition"
          >
            <span className="text-xs font-bold text-ink-500 dark:text-ink-400">Next →</span>
            <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-sm mt-0.5" lang="ro">
              {next.infinitive}
            </p>
          </button>
        ) : (
          <div className="flex-1" />
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
        {grammarVerbs
          .filter((v) => getVerbNav(v.id).index >= 0)
          .sort((a, b) => getVerbNav(a.id).index - getVerbNav(b.id).index)
          .map((v) => {
            const active = v.id === verbId;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelect(v.id)}
                className={`shrink-0 rounded-full px-3 py-2 text-sm font-bold transition ${
                  active
                    ? 'bg-sea-500 text-white'
                    : 'bg-sand-100 text-ink-700 dark:bg-ink-900 dark:text-ink-300'
                }`}
                aria-current={active ? 'true' : undefined}
              >
                <span lang="ro">{v.infinitive.replace('a ', '')}</span>
              </button>
            );
          })}
      </div>
    </div>
  );
}
