import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { useSettings } from '../context/SettingsContext';
import { useSpeech } from '../hooks/useSpeech';
import { useProgress } from '../context/ProgressContext';
import type { ListenChooseItem } from '../types';

interface Props {
  item: ListenChooseItem;
  onDone?: (correct: boolean) => void;
}

export function ListenChoose({ item, onDone }: Props) {
  const { settings } = useSettings();
  const { supported, speak, currentId } = useSpeech();
  const { addListenCorrect } = useProgress();
  const [picked, setPicked] = useState<number | null>(null);
  const isPlaying = currentId === item.id;

  const choose = (idx: number) => {
    if (picked !== null) return;
    setPicked(idx);
    const correct = item.options[idx] === item.correct;
    if (correct) addListenCorrect();
    onDone?.(correct);
  };

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center gap-2 text-sea-600 dark:text-sea-200 mb-3">
        <Icon name="BookOpen" className="h-5 w-5" />
        <span className="font-bold uppercase tracking-wide text-sm">Listen &amp; Choose</span>
      </div>

      <p className="text-2xl font-bold text-ink-900 dark:text-sand-100 mb-1" lang="ro">
        {item.ro}
      </p>
      {settings.pronunciationHelp && item.pron && (
        <p className="text-sea-600 dark:text-sea-200 italic mb-3">{item.pron}</p>
      )}

      <Button
        variant={isPlaying ? 'secondary' : 'primary'}
        size="lg"
        className="mb-4"
        onClick={() => speak(item.ro, item.id)}
        disabled={!supported || isPlaying}
      >
        <Icon name={isPlaying ? 'Pause' : 'Volume2'} className="h-5 w-5" />
        {isPlaying ? 'Playing…' : 'Play audio'}
      </Button>

      <p className="text-ink-500 dark:text-ink-300 mb-2 text-base">What does it mean?</p>
      <div className="flex flex-col gap-2">
        {item.options.map((opt, i) => {
          const isCorrect = opt === item.correct;
          const isPicked = picked === i;
          let cls = 'btn-md bg-white ring-2 ring-sand-300 text-ink-700 dark:bg-ink-900 dark:ring-white/20 dark:text-ink-300';
          if (picked !== null) {
            if (isCorrect) cls = 'btn-md bg-sea-50 text-sea-600 ring-2 ring-sea-500 dark:bg-sea-600/20 dark:text-sea-200';
            else if (isPicked) cls = 'btn-md bg-coral-50 text-coral-500 ring-2 ring-coral-400 dark:bg-coral-400/20 dark:text-coral-200';
            else cls = 'btn-md bg-white ring-1 ring-sand-200 text-ink-500 opacity-70 dark:bg-ink-900 dark:ring-white/10';
          }
          return (
            <button key={i} disabled={picked !== null} onClick={() => choose(i)} className={`${cls} w-full justify-between`}>
              <span>{opt}</span>
              {picked !== null && isCorrect && <Icon name="Check" className="h-5 w-5" />}
              {isPicked && !isCorrect && <Icon name="X" className="h-5 w-5" />}
            </button>
          );
        })}
      </div>

      {picked !== null && (
        <div className="mt-4 animate-pop">
          {item.options[picked] === item.correct ? (
            <p className="text-sea-600 dark:text-sea-200 font-bold text-lg">Yes! That’s right.</p>
          ) : (
            <p className="text-coral-500 font-bold text-lg">
              Not quite. The answer is: <span className="text-ink-700 dark:text-sand-100">{item.correct}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
