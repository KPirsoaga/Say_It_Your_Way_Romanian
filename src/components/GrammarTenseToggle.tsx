import type { GrammarTense } from '../types';
import { GRAMMAR_TENSE_LABELS } from '../types';

interface Props {
  tenses: GrammarTense[];
  active: GrammarTense;
  onChange: (tense: GrammarTense) => void;
}

/** Segmented control — switch tense without leaving the verb page */
export function GrammarTenseToggle({ tenses, active, onChange }: Props) {
  return (
    <div
      role="tablist"
      aria-label="Verb tense"
      className="grid gap-1 p-1 rounded-2xl bg-clay-100/80 dark:bg-forest-800/80 border border-forest/8 dark:border-linen/10"
      style={{ gridTemplateColumns: `repeat(${tenses.length}, minmax(0, 1fr))` }}
    >
      {tenses.map((tense) => {
        const selected = tense === active;
        return (
          <button
            key={tense}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tense)}
            className={`tap-target rounded-xl px-1 py-2.5 text-[11px] sm:text-xs font-semibold leading-tight transition ${
              selected
                ? 'bg-white dark:bg-forest-700 text-forest dark:text-linen-100 shadow-soft'
                : 'text-forest/60 dark:text-linen/60'
            }`}
          >
            {GRAMMAR_TENSE_LABELS[tense]}
          </button>
        );
      })}
    </div>
  );
}
