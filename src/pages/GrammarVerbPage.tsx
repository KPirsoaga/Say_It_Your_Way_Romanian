import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { GrammarExamples } from '../components/GrammarExamples';
import { GrammarConjugationCards } from '../components/GrammarConjugationCards';
import { useSpeech } from '../hooks/useSpeech';
import { Icon } from '../components/Icon';
import { colorMap, grammarVerbs } from '../content';

interface Props {
  verbId: string;
  onBack: () => void;
}

export function GrammarVerbPage({ verbId, onBack }: Props) {
  const verb = grammarVerbs.find((v) => v.id === verbId);
  const { supported, speak, stop, currentId } = useSpeech();

  if (!verb) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Verb not found" onBack={onBack} />
        <div className="mx-auto max-w-md px-4 pb-32 pt-8 text-center">
          <p className="text-ink-700 dark:text-ink-300 text-lg">We couldn&apos;t find that verb.</p>
          <Button variant="primary" size="lg" className="mt-4" onClick={onBack}>
            Back to Grammar Help
          </Button>
        </div>
      </div>
    );
  }

  const c = colorMap[verb.color];

  return (
    <div className="min-h-screen">
      <PageHeader title={verb.infinitive} subtitle={verb.en} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <div className={`rounded-3xl ${c.bgSoft} p-5 text-center`}>
          <p className="text-3xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {verb.infinitive}
          </p>
          <p className="mt-1 text-lg text-ink-700 dark:text-ink-300">{verb.en}</p>
        </div>

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Present tense</h2>
          <div className="space-y-2">
            {verb.present.map((form, i) => {
              const playId = `${verb.id}-pres-${i}`;
              const playing = currentId === playId;
              return (
                <Card key={form.label} className="p-4 flex items-center gap-3">
                  <span className="w-14 shrink-0 text-sm font-bold uppercase text-ink-500 dark:text-ink-300">{form.label}</span>
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

        {verb.imperfect && verb.imperfect.length > 0 && (
          <GrammarConjugationCards
            title="Imperfect tense"
            forms={verb.imperfect}
            idPrefix={`${verb.id}-imp`}
          />
        )}

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Useful examples</h2>
          <GrammarExamples examples={verb.examples} idPrefix={verb.id} />
        </section>
      </div>
    </div>
  );
}
