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

function promptText(exercise: DailyVariantExercise): { title: string; showRo: boolean } {
  switch (exercise.type) {
    case 'en-ro':
      return { title: 'Which Romanian word matches this meaning?', showRo: false };
    case 'listen':
      return { title: 'Listen and choose the meaning', showRo: false };
    case 'verb-person':
      return { title: 'Who is speaking? What does this form mean?', showRo: true };
    case 'singular-plural':
      return { title: 'Singular or plural — what does this mean?', showRo: true };
    case 'definite-form':
      return { title: 'Definite form — what does this mean?', showRo: true };
    case 'adjective-form':
      return { title: 'Adjective form — what does this mean?', showRo: true };
    default:
      return { title: 'What does this mean?', showRo: true };
  }
}

export function DailyVariantExerciseCard({ exercise, index, total, onNext, onSeeVerb }: Props) {
  const { speak, stop, currentId, supported } = useSpeech();
  const [picked, setPicked] = useState<string | null>(null);
  const answered = picked !== null;
  const correct = picked === exercise.correct;
  const audioId = `daily-ex-${exercise.id}`;
  const { title, showRo } = promptText(exercise);
  const isListen = exercise.type === 'listen';
  const isEnRo = exercise.type === 'en-ro';

  const playAudio = () => {
    if (currentId === audioId) stop();
    else speak(exercise.type === 'en-ro' ? exercise.feedback.baseWord : exercise.promptRo, audioId);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-sm font-bold text-ink-500 dark:text-ink-300">
        Question {index + 1} of {total}
      </p>
      <Card className="space-y-4">
        <div>
          {isEnRo ? (
            <p className="text-2xl font-bold text-ink-900 dark:text-sand-100">{exercise.promptEn}</p>
          ) : showRo && !isListen ? (
            <p className="text-3xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
              {exercise.promptRo}
            </p>
          ) : isListen ? (
            <p className="text-lg font-bold text-ink-700 dark:text-ink-300">Tap Listen, then choose.</p>
          ) : null}
          {supported && (isListen || showRo) && (
            <Button variant="soft" size="md" className="mt-3" onClick={playAudio}>
              <Icon name={currentId === audioId ? 'Pause' : 'Volume2'} className="h-5 w-5" />
              Listen
            </Button>
          )}
        </div>
        <p className="text-sm text-ink-600 dark:text-ink-300">{title}</p>
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
                lang={isEnRo ? 'ro' : undefined}
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
            Base {exercise.feedback.grammarVerbId ? 'verb' : exercise.type === 'adjective-form' ? 'adjective' : 'noun'}:{' '}
            <span lang="ro">{exercise.feedback.baseWord}</span>
          </p>
          {exercise.feedback.tenseLabel && exercise.feedback.formLabel && (
            <p className="text-sm text-ink-500 dark:text-ink-400">
              {exercise.feedback.tenseLabel}: {exercise.feedback.formLabel}
            </p>
          )}
          {exercise.feedback.plainNote && (
            <p className="text-sm text-ink-500 dark:text-ink-400">{exercise.feedback.plainNote}</p>
          )}
          {exercise.feedback.wordFamily && exercise.feedback.wordFamily.length >= 2 && (
            <WordFamilyChain chain={exercise.feedback.wordFamily} />
          )}
          {exercise.feedback.grammarVerbId && onSeeVerb && (
            <Button variant="soft" size="md" className="w-full" onClick={() => onSeeVerb(exercise.feedback.grammarVerbId!)}>
              See full verb →
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
