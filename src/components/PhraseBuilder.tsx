import { useMemo, useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { useSpeech } from '../hooks/useSpeech';
import { useProgress } from '../context/ProgressContext';
import { shuffleArray } from '../utils/shuffle';
import { FlagForTeacher } from './FlagForTeacher';
import { userFlagId } from '../content/review/reviewIds';
import type { PhraseBuilderItem } from '../types';

interface Props {
  item: PhraseBuilderItem;
  onDone?: () => void;
}

export function PhraseBuilder({ item, onDone }: Props) {
  const { supported, speak, stop, currentId } = useSpeech();
  const { addBuilderDone } = useProgress();
  const [placed, setPlaced] = useState<number[]>([]); // indexes into shuffled pool
  const [pool, setPool] = useState(() => shuffleArray(item.chunks.map((_, i) => i)));
  const [done, setDone] = useState(false);

  const correctOrder = item.order;

  const placedChunks = placed.map((p) => item.chunks[p]);
  const isComplete = placed.length === item.chunks.length;
  const isCorrect = useMemo(
    () => isComplete && placed.every((p, i) => item.chunks[p] === item.chunks[correctOrder[i]]),
    [placed, isComplete, correctOrder, item]
  );

  const tapPool = (poolIdx: number) => {
    if (done) return;
    setPlaced((p) => [...p, pool[poolIdx]]);
    setPool((p) => p.filter((_, i) => i !== poolIdx));
  };
  const tapPlaced = (placedIdx: number) => {
    if (done) return;
    const removed = placed[placedIdx];
    setPlaced((p) => p.filter((_, i) => i !== placedIdx));
    setPool((p) => [...p, removed]);
  };

  const finish = () => {
    setDone(true);
    if (isCorrect) {
      addBuilderDone();
      onDone?.();
    }
  };

  const reset = () => {
    setPlaced([]);
    setPool(shuffleArray(item.chunks.map((_, i) => i)));
    setDone(false);
  };

  const isPlaying = currentId === item.id;

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center gap-2 text-coral-400 mb-3">
        <Icon name="Sparkles" className="h-5 w-5" />
        <span className="font-bold uppercase tracking-wide text-sm">Phrase Builder</span>
      </div>
      <p className="text-ink-500 dark:text-ink-300 mb-4">Tap the chunks in the right order to build the sentence.</p>

      {/* Build area */}
      <div className="rounded-2xl bg-sand-100 dark:bg-ink-900 ring-1 ring-sand-200 dark:ring-white/10 p-3 min-h-[88px] flex flex-wrap gap-2 content-start">
        {placedChunks.length === 0 && (
          <span className="text-ink-300 dark:text-ink-500 self-center px-2">Tap chunks below to build the sentence…</span>
        )}
        {placedChunks.map((c, i) => {
          const chunkCorrect = done ? item.chunks[placed[i]]?.ro === item.chunks[correctOrder[i]]?.ro : null;
          let chunkCls = 'btn-md bg-sea-500 text-white animate-pop disabled:opacity-100';
          if (done && chunkCorrect === true) chunkCls = 'btn-md bg-sea-500 text-white ring-2 ring-sea-300';
          if (done && chunkCorrect === false) chunkCls = 'btn-md bg-coral-400 text-white ring-2 ring-coral-300';
          return (
            <button
              key={i}
              type="button"
              onClick={() => tapPlaced(i)}
              disabled={done}
              className={chunkCls}
            >
              <span className="tile-label">{c.ro}</span>
            </button>
          );
        })}
      </div>

      {/* English hint */}
      <p className="mt-3 text-ink-700 dark:text-ink-300 text-base">
        <span className="font-bold">English:</span> {item.fullEn}
      </p>

      {/* Pool */}
      <div className="mt-4 flex flex-wrap gap-2">
        {pool.map((chunkIdx, poolIdx) => (
          <button
            key={poolIdx}
            type="button"
            onClick={() => tapPool(poolIdx)}
            disabled={done}
            className="btn-md bg-white ring-2 ring-sand-300 text-ink-700 hover:ring-sea-400 dark:bg-ink-900 dark:ring-white/20 dark:text-ink-300"
          >
            <span className="tile-label">{item.chunks[chunkIdx].ro}</span>
          </button>
        ))}
        {pool.length === 0 && !done && (
          <span className="text-ink-300 dark:text-ink-500 self-center text-sm">All chunks placed.</span>
        )}
      </div>

      {isComplete && !done && (
        <Button variant="primary" size="lg" className="mt-4 w-full" onClick={finish}>
          <Icon name="Check" className="h-5 w-5" />
          Check my sentence
        </Button>
      )}


      {done && (
        <div className="mt-4 animate-fade-in" role="status" aria-live="polite">
          {isCorrect ? (
            <p className="text-sea-600 dark:text-sea-200 font-bold text-lg flex items-center gap-2">
              <Icon name="Check" className="h-6 w-6" /> Perfect! That’s the right order.
            </p>
          ) : (
            <p className="text-coral-500 font-bold text-lg">
              Good try! Here’s the right order:
              <br />
              <span className="text-ink-900 dark:text-sand-100 font-bold" lang="ro">
                {item.fullRo}
              </span>
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="soft" size="md" onClick={() => (isPlaying ? stop() : speak(item.fullRo, item.id))} disabled={!supported}>
              <Icon name={isPlaying ? 'Pause' : 'Volume2'} className="h-5 w-5" />
              Play
            </Button>
            <Button variant="ghost" size="md" onClick={reset}>
              <Icon name="RotateCcw" className="h-5 w-5" />
              Try again
            </Button>
          </div>
        </div>
      )}

      <FlagForTeacher
        className="mt-4"
        id={userFlagId(`builder:${item.id}`)}
        ro={item.fullRo}
        en={item.fullEn}
        contentArea="Phrase Builder"
        contextLabel="Phrase Builder sentence"
      />
    </div>
  );
}
