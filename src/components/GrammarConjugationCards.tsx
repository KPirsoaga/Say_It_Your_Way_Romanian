import { Button } from './Button';
import { Icon } from './Icon';
import { useSpeech } from '../hooks/useSpeech';
import type { VerbForm } from '../types';

interface Props {
  title: string;
  forms: VerbForm[];
  idPrefix: string;
}

/** Clean person/form rows for verb conjugation — brand-aligned, mobile-first */
export function GrammarConjugationCards({ title, forms, idPrefix }: Props) {
  const { supported, speak, stop, currentId } = useSpeech();

  return (
    <section>
      <h2 className="font-display text-lg font-bold text-forest dark:text-linen-100 mb-3">{title}</h2>
      <div className="rounded-2xl border border-forest/8 dark:border-linen/10 overflow-hidden divide-y divide-forest/8 dark:divide-linen/10">
        {forms.map((form, i) => {
          const playId = `${idPrefix}-conj-${i}`;
          const playing = currentId === playId;
          const highlighted = form.label === 'noi' || form.label === 'eu';
          return (
            <div
              key={`${form.label}-${i}`}
              className={`flex items-center gap-3 px-4 py-3 ${highlighted ? 'bg-olive-50 dark:bg-olive-900/20' : 'bg-white dark:bg-forest-800'}`}
            >
              <div className="w-16 shrink-0">
                <p className="text-sm font-semibold text-forest dark:text-linen-100" lang="ro">
                  {form.label}
                </p>
                <p className="text-xs text-forest/50 dark:text-linen/50">{form.en.split(' ')[0]}</p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="tile-label text-lg font-semibold text-forest dark:text-linen-100" lang="ro">
                  {form.ro}
                </p>
              </div>
              <Button
                variant="ghost"
                size="md"
                className="!min-h-[40px] !px-2"
                onClick={() => (playing ? stop() : speak(form.ro, playId))}
                disabled={!supported}
                aria-label={`Play ${form.ro}`}
              >
                <Icon name={playing ? 'Pause' : 'Volume2'} className="h-5 w-5" />
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
