import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { ExerciseCompletion } from './ExerciseCompletion';
import { shuffledMcOptions } from '../utils/shuffle';
import type { WeeklyMcQuestion } from '../types';

interface Props {
  questions: WeeklyMcQuestion[];
  title: string;
  onComplete: () => void;
  onBackToTopic: () => void;
}

export function WeeklyMcExercise({ questions, title, onComplete, onBackToTopic }: Props) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [options, setOptions] = useState<string[]>([]);
  const [attempt, setAttempt] = useState(0);

  const q = questions[index];
  const isLast = index >= questions.length - 1;

  useEffect(() => {
    setOptions(shuffledMcOptions(q.options, q.correct));
    setPicked(null);
  }, [index, q.id, q.options, q.correct, attempt]);

  const choose = (i: number) => {
    if (picked !== null || finished) return;
    setPicked(i);
    const correct = options[i] === q.correct;
    if (correct) setCorrectCount((c) => c + 1);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      onComplete();
    } else {
      setIndex((i) => i + 1);
    }
  };

  const tryAgain = () => {
    setIndex(0);
    setPicked(null);
    setCorrectCount(0);
    setFinished(false);
    setAttempt((a) => a + 1);
  };

  if (finished) {
    return (
      <ExerciseCompletion
        title="Well done!"
        message={`You got ${correctCount} of ${questions.length} right. No pressure — you can try again anytime.`}
        onBackToTopic={onBackToTopic}
        onTryAgain={tryAgain}
      />
    );
  }

  return (
    <div className="card animate-fade-in">
      <p className="text-xs uppercase tracking-wide font-bold text-sea-600 dark:text-sea-200 mb-1">{title}</p>
      <p className="text-sm text-ink-500 dark:text-ink-300 mb-4">
        Question {index + 1} of {questions.length}
      </p>

      <p
        className="text-2xl font-bold text-ink-900 dark:text-sand-100 mb-4 leading-snug"
        lang={q.direction === 'ro-en' ? 'ro' : 'en'}
      >
        {q.prompt}
      </p>

      <div className="flex flex-col gap-2" role="radiogroup" aria-label="Choose an answer">
        {options.map((opt, i) => {
          const isCorrect = opt === q.correct;
          const isPicked = picked === i;
          let cls = 'btn-md bg-white ring-2 ring-sand-300 text-ink-700 dark:bg-ink-900 dark:ring-white/20 dark:text-ink-300';
          if (picked !== null) {
            if (isCorrect) cls = 'btn-md bg-sea-50 text-sea-600 ring-2 ring-sea-500 dark:bg-sea-600/20 dark:text-sea-200';
            else if (isPicked) cls = 'btn-md bg-coral-50 text-coral-500 ring-2 ring-coral-400 dark:bg-coral-400/20';
            else cls = 'btn-md bg-white ring-1 ring-sand-200 text-ink-500 opacity-70 dark:bg-ink-900';
          }
          return (
            <button
              key={`${q.id}-${opt}-${attempt}`}
              type="button"
              disabled={picked !== null}
              onClick={() => choose(i)}
              className={`${cls} w-full justify-between items-start text-left h-auto min-h-[48px]`}
              aria-pressed={isPicked}
            >
              <span className="tile-label flex-1 text-left pr-2" lang={q.direction === 'ro-en' ? 'en' : 'ro'}>
                {opt}
              </span>
              {picked !== null && isCorrect && <Icon name="Check" className="h-5 w-5 shrink-0" />}
              {isPicked && !isCorrect && <Icon name="X" className="h-5 w-5 shrink-0" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-4 space-y-3" role="status" aria-live="polite">
          {options[picked] === q.correct ? (
            <p className="text-sea-600 dark:text-sea-200 font-bold text-lg">Yes! That’s right.</p>
          ) : (
            <p className="text-coral-500 font-bold text-lg">
              Good try. The answer is: <span className="text-ink-700 dark:text-sand-100">{q.correct}</span>
            </p>
          )}
          <Button variant="primary" size="lg" className="w-full" onClick={next}>
            {isLast ? 'Finish' : 'Next'}
            <Icon name="ArrowRight" className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}
