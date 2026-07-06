import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { PhraseCard } from '../components/PhraseCard';
import { ListenChoose } from '../components/ListenChoose';
import { SpeakPractice } from '../components/SpeakPractice';
import { useProgress, todayStr } from '../context/ProgressContext';
import { getDailyContent } from '../content';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId) => void;
}

export function DailyPage({ go }: Props) {
  const today = todayStr();
  const daily = useMemo(() => getDailyContent(today), [today]);
  const { markPractisedToday } = useProgress();
  const [step, setStep] = useState<'phrase' | 'dialogue' | 'listen' | 'speak' | 'done'>('phrase');
  const [listened, setListened] = useState(false);
  const [spoken, setSpoken] = useState(false);

  const complete = () => {
    markPractisedToday();
    setStep('done');
  };

  const canFinish = listened && spoken;

  return (
    <div className="min-h-screen">
      <PageHeader title="Daily Practice" subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} />

      {/* Stepper */}
      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="flex items-center gap-1.5">
          {(['phrase', 'dialogue', 'listen', 'speak'] as const).map((s, i) => {
            const active = step === s || step === 'done';
            const order = ['phrase', 'dialogue', 'listen', 'speak', 'done'].indexOf(step);
            const done = i < order;
            return (
              <span
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  active ? 'bg-sea-500' : done ? 'bg-sea-300' : 'bg-sand-200 dark:bg-white/15'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 pb-6 pt-4 space-y-4">
        {step === 'phrase' && (
          <StepShell title="1. Today’s phrase" onNext={() => setStep('dialogue')} nextLabel="Next">
            <PhraseCard phrase={daily.phrase} favId={`daily:${today}:phrase`} hero />
          </StepShell>
        )}

        {step === 'dialogue' && (
          <StepShell title="2. Mini dialogue" onNext={() => setStep('listen')} nextLabel="Next">
            <Card>
              <div className="space-y-3">
                {daily.dialogue.map((d, i) => (
                  <div key={i} className={`flex ${d.speaker === 'A' ? 'justify-start' : 'justify-end'}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-3 ${
                        d.speaker === 'A'
                          ? 'bg-sea-50 dark:bg-sea-600/20 rounded-tl-sm'
                          : 'bg-coral-50 dark:bg-coral-400/20 rounded-tr-sm'
                      }`}
                    >
                      <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300 mb-1">
                        {d.speaker === 'A' ? 'You' : 'Them'}
                      </p>
                      <p className="font-bold text-ink-900 dark:text-sand-100 text-lg" lang="ro">
                        {d.ro}
                      </p>
                      <p className="text-sm text-ink-700 dark:text-ink-300 mt-1">{d.en}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </StepShell>
        )}

        {step === 'listen' && (
          <StepShell title="3. Listen & choose" onNext={() => setStep('speak')} nextLabel="Next">
            <ListenChoose item={daily.listen} onDone={() => setListened(true)} />
          </StepShell>
        )}

        {step === 'speak' && (
          <StepShell
            title="4. Speak out loud"
            onNext={complete}
            nextLabel={canFinish ? 'Finish' : 'Finish anyway'}
            disabled={false}
          >
            <SpeakPractice phrase={daily.speak} speechId={`daily:${today}:speak`} onDone={() => setSpoken(true)} />
          </StepShell>
        )}

        {step === 'done' && (
          <div className="animate-fade-in text-center py-8">
            <div className="mx-auto h-24 w-24 rounded-full bg-sea-50 dark:bg-sea-600/20 flex items-center justify-center mb-4 animate-pop">
              <Icon name="Trophy" className="h-12 w-12 text-sun-400" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-sand-100">Great job today!</h2>
            <p className="mt-2 text-ink-700 dark:text-ink-300 text-lg">
              You practised a phrase, a dialogue, a listening activity, and speaking out loud.
            </p>
            <p className="mt-1 text-ink-500 dark:text-ink-300">Come back tomorrow for a new set.</p>
            <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto">
              <Button variant="primary" size="lg" onClick={() => go('home')}>
                <Icon name="Home" className="h-5 w-5" />
                Back to home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepShell({
  title,
  children,
  onNext,
  nextLabel,
  disabled,
}: {
  title: string;
  children: React.ReactNode;
  onNext: () => void;
  nextLabel: string;
  disabled?: boolean;
}) {
  return (
    <div className="animate-fade-in space-y-4">
      <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">{title}</h2>
      {children}
      <Button variant="primary" size="lg" className="w-full" onClick={onNext} disabled={disabled}>
        {nextLabel}
        <Icon name="ArrowRight" className="h-5 w-5" />
      </Button>
    </div>
  );
}
