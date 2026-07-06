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
      className="grid gap-1 p-1 rounded-2xl bg-sand-200/80 dark:bg-white/10"
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
            className={`tap-target rounded-xl px-1 py-2.5 text-[11px] sm:text-xs font-bold leading-tight transition ${
              selected
                ? 'bg-white dark:bg-ink-800 text-sea-600 dark:text-sea-200 shadow-soft'
                : 'text-ink-600 dark:text-ink-300'
            }`}
          >
            {GRAMMAR_TENSE_LABELS[tense]}
          </button>
        );
      })}
    </div>
  );
}
