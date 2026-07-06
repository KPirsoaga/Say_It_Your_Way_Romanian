import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { ListenChoose } from '../components/ListenChoose';
import { NoShameBanner } from '../components/NoShameBanner';
import { useSpeech } from '../hooks/useSpeech';
import { useProgress, todayStr } from '../context/ProgressContext';
import { getTinyPractice } from '../content';

interface Props {
  onBack: () => void;
  onHome: () => void;
}

export function TinyPracticePage({ onBack, onHome }: Props) {
  const today = todayStr();
  const content = useMemo(() => getTinyPractice(today), [today]);
  const { speak, currentId, supported } = useSpeech();
  const { markPractisedToday } = useProgress();
  const [step, setStep] = useState<'listen' | 'repeat' | 'phrase' | 'done'>('listen');
  const [repeatDone, setRepeatDone] = useState(false);

  const repeatId = 'tiny-repeat';
  const repeatPlaying = currentId === repeatId;
  const phraseId = 'tiny-phrase';
  const phrasePlaying = currentId === phraseId;

  const finish = () => {
    markPractisedToday();
    setStep('done');
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Tiny Practice" subtitle="Just 3 minutes" onBack={onBack} />

      <div className="mx-auto max-w-md px-4 pb-10 pt-4 space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-sea-400 to-sea-600 text-white p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="Zap" className="h-5 w-5" />
            <p className="text-sm uppercase tracking-wide font-bold text-sea-100/90">Low-focus day?</p>
          </div>
          <h2 className="text-xl font-bold leading-tight">Three small things. That’s all. No pressure.</h2>
        </div>

        {/* Mini stepper */}
        <div className="flex items-center gap-1.5">
          {(['listen', 'repeat', 'phrase', 'done'] as const).map((s, i) => {
            const order = ['listen', 'repeat', 'phrase', 'done'].indexOf(step);
            const active = i <= order;
            return (
              <span
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  active ? 'bg-sea-500' : 'bg-sand-200 dark:bg-white/15'
                }`}
              />
            );
          })}
        </div>

        {step === 'listen' && (
          <Step title="1. Listen and choose" next={() => setStep('repeat')} nextLabel="Next">
            <ListenChoose item={content.listen} />
          </Step>
        )}

        {step === 'repeat' && (
          <Step title="2. Repeat after me" next={() => setStep('phrase')} nextLabel="Next">
            <Card className="text-center">
              <p className="text-2xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
                {content.repeat.ro}
              </p>
              <p className="mt-2 text-ink-700 dark:text-ink-300 text-lg">{content.repeat.en}</p>
              {content.repeat.pron && (
                <p className="mt-1 text-sea-600 dark:text-sea-200 italic">{content.repeat.pron}</p>
              )}
              <div className="mt-4 flex flex-col gap-2 items-center">
                <Button
                  variant={repeatPlaying ? 'secondary' : 'primary'}
                  size="lg"
                  className="w-full"
                  onClick={() => speak(content.repeat.ro, repeatId)}
                  disabled={!supported || repeatPlaying}
                >
                  <Icon name={repeatPlaying ? 'Pause' : 'Volume2'} className="h-5 w-5" />
                  {repeatPlaying ? 'Playing…' : 'Hear it'}
                </Button>
                <Button
                  variant="soft"
                  size="lg"
                  className="w-full"
                  onClick={() => setRepeatDone(true)}
                  disabled={repeatDone}
                >
                  <Icon name="Check" className="h-5 w-5" />
                  {repeatDone ? 'Said it!' : 'I said it'}
                </Button>
              </div>
              {repeatDone && (
                <p className="mt-3 text-sea-600 dark:text-sea-200 font-bold animate-pop">Even one repetition counts.</p>
              )}
            </Card>
          </Step>
        )}

        {step === 'phrase' && (
          <Step title="3. One useful phrase" next={finish} nextLabel="Finish">
            <Card className="text-center">
              <p className="text-2xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
                {content.phrase.ro}
              </p>
              <p className="mt-2 text-ink-700 dark:text-ink-300 text-lg">{content.phrase.en}</p>
              {content.phrase.pron && (
                <p className="mt-1 text-sea-600 dark:text-sea-200 italic">{content.phrase.pron}</p>
              )}
              <Button
                variant={phrasePlaying ? 'secondary' : 'primary'}
                size="lg"
                className="mt-4 w-full"
                onClick={() => speak(content.phrase.ro, phraseId)}
                disabled={!supported || phrasePlaying}
              >
                <Icon name={phrasePlaying ? 'Pause' : 'Volume2'} className="h-5 w-5" />
                {phrasePlaying ? 'Playing…' : 'Hear it'}
              </Button>
              <p className="mt-3 text-sm text-ink-500 dark:text-ink-300">Read it, hear it, say it once. Done.</p>
            </Card>
          </Step>
        )}

        {step === 'done' && (
          <div className="animate-fade-in text-center py-10">
            <div className="mx-auto h-24 w-24 rounded-full bg-sea-50 dark:bg-sea-600/20 flex items-center justify-center mb-4 animate-pop">
              <Icon name="Check" className="h-12 w-12 text-sea-500" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-sand-100">That’s enough for today.</h2>
            <p className="mt-2 text-ink-700 dark:text-ink-300 text-lg">Three minutes counts as practice. See you tomorrow.</p>
            <NoShameBanner compact />
            <Button variant="primary" size="lg" className="mt-6 w-full max-w-xs mx-auto" onClick={onHome}>
              <Icon name="Home" className="h-5 w-5" />
              Back to home
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Step({
  title,
  children,
  next,
  nextLabel,
}: {
  title: string;
  children: React.ReactNode;
  next: () => void;
  nextLabel: string;
}) {
  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">{title}</h2>
      {children}
      <Button variant="primary" size="lg" className="w-full" onClick={next}>
        {nextLabel}
        <Icon name="ArrowRight" className="h-5 w-5" />
      </Button>
    </div>
  );
}
