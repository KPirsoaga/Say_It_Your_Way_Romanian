import { useMemo, useState } from 'react';
import { ExerciseCompletion } from './ExerciseCompletion';
import { shuffleArray } from '../utils/shuffle';
import type { WeeklyMatchPair } from '../types';

interface Props {
  pairs: WeeklyMatchPair[];
  onComplete: () => void;
  onBackToTopic: () => void;
}

type Side = 'ro' | 'en';

export function WeeklyTapMatch({ pairs, onComplete, onBackToTopic }: Props) {
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<{ side: Side; id: string } | null>(null);
  const [wrong, setWrong] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const roItems = useMemo(() => shuffleArray(pairs.map((p) => ({ id: p.id, text: p.ro }))), [pairs, attempt]);
  const enItems = useMemo(() => shuffleArray(pairs.map((p) => ({ id: p.id, text: p.en }))), [pairs, attempt]);

  const tap = (side: Side, id: string) => {
    if (matched.has(id) || done) return;

    if (!selected) {
      setSelected({ side, id });
      setWrong(null);
      return;
    }

    if (selected.side === side) {
      setSelected({ side, id });
      setWrong(null);
      return;
    }

    const firstId = selected.id;
    const secondId = id;
    if (firstId === secondId) {
      const next = new Set(matched).add(firstId);
      setMatched(next);
      setSelected(null);
      setWrong(null);
      if (next.size === pairs.length) {
        setDone(true);
        onComplete();
      }
    } else {
      setWrong(secondId);
      setSelected(null);
      setTimeout(() => setWrong(null), 600);
    }
  };

  const tryAgain = () => {
    setMatched(new Set());
    setSelected(null);
    setWrong(null);
    setDone(false);
    setAttempt((a) => a + 1);
  };

  if (done) {
    return (
      <ExerciseCompletion
        title="All matched!"
        message="Nice work connecting Romanian and English."
        onBackToTopic={onBackToTopic}
        onTryAgain={tryAgain}
      />
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-ink-500 dark:text-ink-300 text-base">
        Tap a Romanian word, then tap its English meaning. Correct pairs stay matched.
      </p>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300 mb-2">Romanian</p>
        <div className="flex flex-wrap gap-2">
          {roItems.map((item) => {
            const isMatched = matched.has(item.id);
            const isSelected = selected?.id === item.id && selected.side === 'ro';
            return (
              <button
                key={item.id}
                type="button"
                disabled={isMatched}
                onClick={() => tap('ro', item.id)}
                className={`btn-md tile-label ${
                  isMatched
                    ? 'bg-sea-500 text-white opacity-80'
                    : isSelected
                      ? 'bg-sea-100 ring-2 ring-sea-500 text-sea-700 dark:bg-sea-600/30 dark:text-sea-100'
                      : wrong === item.id
                        ? 'bg-coral-50 ring-2 ring-coral-400 text-coral-500'
                        : 'bg-white ring-2 ring-sand-300 text-ink-700 dark:bg-ink-900 dark:ring-white/20'
                }`}
                aria-pressed={isSelected}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300 mb-2">English</p>
        <div className="flex flex-wrap gap-2">
          {enItems.map((item) => {
            const isMatched = matched.has(item.id);
            const isSelected = selected?.id === item.id && selected.side === 'en';
            return (
              <button
                key={item.id}
                type="button"
                disabled={isMatched}
                onClick={() => tap('en', item.id)}
                className={`btn-md tile-label ${
                  isMatched
                    ? 'bg-sea-500 text-white opacity-80'
                    : isSelected
                      ? 'bg-sea-100 ring-2 ring-sea-500 text-sea-700 dark:bg-sea-600/30 dark:text-sea-100'
                      : wrong === item.id
                        ? 'bg-coral-50 ring-2 ring-coral-400 text-coral-500'
                        : 'bg-white ring-2 ring-sand-300 text-ink-700 dark:bg-ink-900 dark:ring-white/20'
                }`}
                aria-pressed={isSelected}
              >
                {item.text}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-ink-500 dark:text-ink-300 text-center">
        {matched.size} of {pairs.length} matched
      </p>
    </div>
  );
}
