import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { Button } from '../components/Button';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeech } from '../hooks/useSpeech';
import { NoShameBanner } from '../components/NoShameBanner';
import { survivalPhrases } from '../content';

interface Props {
  onBack: () => void;
}

export function SurvivalPage({ onBack }: Props) {
  const { settings } = useSettings();
  const { toggleFavourite, isFavourite } = useProgress();
  const { supported, speak, speakSlow, currentId } = useSpeech();

  return (
    <div className="min-h-screen">
      <PageHeader title="Survival Romanian" subtitle="The most useful phrases first" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-coral-300 to-coral-500 text-white p-5 shadow-soft">
          <p className="text-sm uppercase tracking-wide font-bold text-coral-100/90">Start here</p>
          <h2 className="text-xl font-bold mt-1 leading-tight">
            If you only learn a few phrases, learn these. They work in almost any situation.
          </h2>
        </div>

        <NoShameBanner compact />

        <div className="space-y-4">
          {survivalPhrases.map((p, i) => {
            const favId = `survival:${i}`;
            const saved = isFavourite(favId);
            const isPlaying = currentId === favId;
            const isSlow = currentId === `${favId}-slow`;
            return (
              <Card key={i} className="p-5 animate-fade-in">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-7 w-7 rounded-full bg-coral-50 dark:bg-coral-400/20 text-coral-400 font-bold text-sm flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs font-bold uppercase tracking-wide text-ink-300 dark:text-ink-500">Phrase {i + 1}</p>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
                      {p.ro}
                    </p>
                    <p className="mt-2 text-ink-700 dark:text-ink-300 text-base">{p.en}</p>
                    {settings.pronunciationHelp && p.pron && (
                      <p className="mt-1 text-sea-600 dark:text-sea-200 italic">{p.pron}</p>
                    )}
                    {settings.literalTranslation && p.literal && (
                      <p className="mt-1 text-ink-500 dark:text-ink-300 text-sm">
                        <span className="font-bold">Literal:</span> {p.literal}
                      </p>
                    )}
                  </div>
                  <button
                    aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
                    onClick={() => toggleFavourite(favId)}
                    className={`tap-target shrink-0 rounded-2xl p-2 transition active:scale-90 ${
                      saved ? 'text-coral-400' : 'text-ink-300 hover:text-coral-300 dark:text-ink-500'
                    }`}
                  >
                    <Icon name={saved ? 'HeartFilled' : 'Heart'} className="h-7 w-7" />
                  </button>
                </div>

                {/* Why it matters */}
                <div className="mt-3 rounded-2xl bg-sun-50 dark:bg-sun-300/10 p-3 flex items-start gap-2">
                  <Icon name="Lightbulb" className="h-5 w-5 text-sun-400 shrink-0 mt-0.5" />
                  <p className="text-sm text-ink-700 dark:text-ink-300 leading-snug">{p.why}</p>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant={isPlaying ? 'secondary' : 'primary'}
                    size="lg"
                    onClick={() => speak(p.ro, favId)}
                    disabled={!supported || isPlaying}
                  >
                    <Icon name={isPlaying ? 'Pause' : 'Volume2'} className="h-5 w-5" />
                    Play
                  </Button>
                  {p.slow && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => speakSlow(p.slow ?? p.ro, `${favId}-slow`)}
                      disabled={!supported || isSlow}
                    >
                      <Icon name="Gauge" className="h-5 w-5" />
                      Slow
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
