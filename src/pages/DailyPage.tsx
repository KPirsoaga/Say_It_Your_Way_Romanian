import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { PhraseCard } from '../components/PhraseCard';
import { DailyVariantExerciseCard } from '../components/dailyPractice/DailyVariantExerciseCard';
import { useProgress, todayStr } from '../context/ProgressContext';
import { generateDailyPracticeSession } from '../content/dailyPractice/generateSession';
import { getWeeklyLessonPhrase } from '../content/weeklyTopics/dailyPhrase';
import { userFlagId } from '../content/review/reviewIds';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

export function DailyPage({ go }: Props) {
  const today = todayStr();
  const session = useMemo(() => generateDailyPracticeSession(today), [today]);
  const lessonPhrase = useMemo(() => getWeeklyLessonPhrase(today), [today]);
  const { markPractisedToday, markDictionaryWordSeen } = useProgress();
  const [step, setStep] = useState<'phrase' | 'variants' | 'done'>('phrase');
  const [variantIndex, setVariantIndex] = useState(0);

  const complete = () => {
    session.exercises.forEach((ex) => markDictionaryWordSeen(ex.entryId));
    markPractisedToday();
    setStep('done');
  };

  const onVariantNext = () => {
    const ex = session.exercises[variantIndex];
    if (ex) markDictionaryWordSeen(ex.entryId);
    if (variantIndex + 1 >= session.exercises.length) {
      complete();
    } else {
      setVariantIndex((i) => i + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Daily Practice"
        subtitle={new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      />

      <div className="mx-auto max-w-md px-4 pt-4">
        <div className="flex items-center gap-1.5 mb-4">
          {(['phrase', 'variants'] as const).map((s) => {
            const done = step === 'done' || (step === 'variants' && s === 'phrase');
            const active = step === s || step === 'done';
            return (
              <span
                key={s}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  done || active ? 'bg-sea-500' : 'bg-sand-200 dark:bg-white/15'
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-md px-4 pb-6 pt-0 space-y-4">
        {step === 'phrase' && (
          <div className="animate-fade-in space-y-4">
            <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100">1. Today&apos;s phrase</h2>
            <p className="text-sm text-ink-500 dark:text-ink-300">From this week&apos;s lesson</p>
            <PhraseCard
              phrase={lessonPhrase}
              favId={`daily:${today}:phrase`}
              hero
              flag={{
                id: userFlagId(`daily:${today}:phrase`),
                contentArea: 'Daily Practice',
                contextLabel: 'Daily phrase',
              }}
            />
            <Button variant="primary" size="lg" className="w-full" onClick={() => setStep('variants')}>
              Word recognition practice
              <Icon name="ArrowRight" className="h-5 w-5" />
            </Button>
          </div>
        )}

        {step === 'variants' && session.exercises[variantIndex] && (
          <div>
            <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-4">2. Recognise the form</h2>
            <p className="text-sm text-ink-500 dark:text-ink-300 mb-4">
              Current lesson first — then earlier topics and wider revision.
            </p>
            <DailyVariantExerciseCard
              key={session.exercises[variantIndex].id}
              exercise={session.exercises[variantIndex]}
              index={variantIndex}
              total={session.exercises.length}
              onNext={onVariantNext}
              onSeeVerb={(id) => go('grammar-verb', id)}
            />
          </div>
        )}

        {step === 'done' && (
          <div className="animate-fade-in text-center py-8">
            <div className="mx-auto h-24 w-24 rounded-full bg-sea-50 dark:bg-sea-600/20 flex items-center justify-center mb-4 animate-pop">
              <Icon name="Trophy" className="h-12 w-12 text-sun-400" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900 dark:text-sand-100">Great job today!</h2>
            <p className="mt-2 text-ink-700 dark:text-ink-300 text-lg">
              You practised today&apos;s phrase and {session.exercises.length} word forms.
            </p>
            <p className="mt-1 text-ink-500 dark:text-ink-300">These forms belong to words you already know.</p>
            <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto">
              <Button variant="primary" size="lg" onClick={() => go('home')}>
                <Icon name="Home" className="h-5 w-5" />
                Back to home
              </Button>
              <Button variant="soft" size="lg" onClick={() => go('dictionary')}>
                Open Dictionary
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
