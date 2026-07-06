import { Card } from './Card';
import { Button } from './Button';
import { Icon } from './Icon';
import { useSpeech } from '../hooks/useSpeech';
import type { VerbForm } from '../types';

interface Props {
  title: string;
  forms: VerbForm[];
  idPrefix: string;
}

/** Stacked mobile cards for verb conjugation — no wide tables. */
export function GrammarConjugationCards({ title, forms, idPrefix }: Props) {
  const { supported, speak, stop, currentId } = useSpeech();

  return (
    <section>
      <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">{title}</h2>
      <div className="space-y-2">
        {forms.map((form, i) => {
          const playId = `${idPrefix}-conj-${i}`;
          const playing = currentId === playId;
          return (
            <Card key={`${form.label}-${i}`} className="p-4 flex items-center gap-3">
              <span className="w-14 shrink-0 text-sm font-bold uppercase text-ink-500 dark:text-ink-300">
                {form.label}
              </span>
              <div className="flex-1 min-w-0">
                <p className="tile-label text-xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
                  {form.ro}
                </p>
                <p className="text-sm text-ink-600 dark:text-ink-300">{form.en}</p>
              </div>
              <Button
                variant="soft"
                size="md"
                onClick={() => (playing ? stop() : speak(form.ro, playId))}
                disabled={!supported}
                aria-label={`Play ${form.ro}`}
              >
                <Icon name={playing ? 'Pause' : 'Volume2'} className="h-5 w-5" />
              </Button>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
