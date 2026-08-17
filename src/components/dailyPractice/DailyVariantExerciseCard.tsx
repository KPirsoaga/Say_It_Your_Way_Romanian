import { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { useSpeech } from '../../hooks/useSpeech';
import { WordFamilyChain } from '../dictionary/WordFamily';
import type { DailyVariantExercise } from '../../content/dictionary/types';

interface Props {
  exercise: DailyVariantExercise;
  index: number;
  total: number;
  onNext: () => void;
  onSeeVerb?: (grammarVerbId: string) => void;
}

export function DailyVariantExerciseCard({ exercise, index, total, onNext, onSeeVerb }: Props) {
  const { speak, stop, currentId, supported } = useSpeech();
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const correct = picked === exercise.correct;
  const audioId = `daily-ex-${exercise.id}`;

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm font-bold text-ink-500 dark:text-ink-300">
        Question {index + 1} of {total}
      </p>
      <Card className="space-y-4">
        <div>
          <p className="text-3xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {exercise.promptRo}
          </p>
          {supported && (
            <Button variant="soft" size="md" className="mt-3" onClick={() => (currentId === audioId ? stop() : speak(exercise.promptRo, audioId))}>
              <Icon name={currentId === audioId ? 'Pause' : 'Volume2'} className="h-5 w-5" />
              Listen
            </Button>
          )}
        </div>
        <p className="text-sm text-ink-600 dark:text-ink-300">What does this mean?</p>
        <div className="space-y-2">
          {exercise.options.map((opt) => {
            const isPicked = picked === opt;
            const showCorrect = answered && opt === exercise.correct;
            const showWrong = answered && isPicked && !correct;
            return (
              <button
                key={opt}
                type="button"
                disabled={answered}
                onClick={() => setPicked(opt)}
                className={`w-full text-left rounded-2xl px-4 py-3 font-bold transition ${
                  showCorrect
                    ? 'bg-sea-100 dark:bg-sea-600/30 ring-2 ring-sea-500'
                    : showWrong
                      ? 'bg-coral-50 dark:bg-coral-400/20 ring-2 ring-coral-400'
                      : 'bg-sand-100 dark:bg-ink-900 hover:ring-2 hover:ring-sea-300'
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </Card>

      {answered && (
        <Card className="space-y-2 bg-sea-50 dark:bg-sea-600/10">
          <p className="text-lg font-bold text-ink-900 dark:text-sand-100">
            {correct ? '✓' : '→'} {exercise.feedback.meaning}
          </p>
          <p className="text-sm text-ink-600 dark:text-ink-300">
            Base {exercise.feedback.grammarVerbId ? 'verb' : 'word'}: <span lang="ro">{exercise.feedback.baseWord}</span> — {exercise.feedback.baseEn}
          </p>
          {exercise.feedback.formLabel && (
            <p className="text-sm text-ink-500 dark:text-ink-400">Form: {exercise.feedback.formLabel}</p>
          )}
          {exercise.feedback.plainNote && (
            <p className="text-sm text-ink-500 dark:text-ink-400">{exercise.feedback.plainNote}</p>
          )}
          <WordFamilyChain chain={exercise.feedback.wordFamily ?? []} />
          {exercise.feedback.grammarVerbId && onSeeVerb && (
            <Button variant="soft" size="md" className="w-full" onClick={() => onSeeVerb(exercise.feedback.grammarVerbId!)}>
              See full verb
              <Icon name="ChevronRight" className="h-5 w-5" />
            </Button>
          )}
        </Card>
      )}

      {answered && (
        <Button variant="primary" size="lg" className="w-full" onClick={onNext}>
          {index + 1 >= total ? 'Finish' : 'Next'}
          <Icon name="ArrowRight" className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
