import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { useSettings } from '../context/SettingsContext';
import { useSpeech } from '../hooks/useSpeech';
import { useProgress } from '../context/ProgressContext';
import { FlagForMihaela } from './FlagForMihaela';
import type { PhraseLine } from '../types';
import type { FlagReviewTarget } from '../content/review/reviewIds';

interface Props {
  phrase: PhraseLine;
  /** id used for speech tracking */
  speechId: string;
  onDone?: () => void;
  flag?: Omit<FlagReviewTarget, 'ro' | 'en'>;
}

export function SpeakPractice({ phrase, speechId, onDone, flag }: Props) {
  const { settings } = useSettings();
  const { supported, speak, stop, currentId } = useSpeech();
  const { addSpeakDone } = useProgress();
  const [showSimpler, setShowSimpler] = useState(false);
  const [result, setResult] = useState<null | 'said' | 'again'>(null);
  const isPlaying = currentId === speechId;

  const saidIt = () => {
    setResult('said');
    addSpeakDone();
    onDone?.();
  };

  const tryAgain = () => {
    setResult(null);
    speak(phrase.slow ?? phrase.ro, speechId);
  };

  const displayRo = showSimpler && phrase.slow ? phrase.slow : phrase.ro;

  return (
    <div className="card animate-fade-in">
      <div className="flex items-center gap-2 text-rose-400 mb-3">
        <Icon name="Mic" className="h-5 w-5" />
        <span className="font-bold uppercase tracking-wide text-sm">Speak Out Loud</span>
      </div>

      <p className="text-ink-500 dark:text-ink-300 mb-3">Read this sentence aloud. No scoring — just say it!</p>

      <div className="rounded-2xl bg-rose-50 dark:bg-rose-400/10 p-4 mb-4">
        <p className="text-2xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
          {displayRo}
        </p>
        <p className="mt-2 text-ink-700 dark:text-ink-300 text-base">{phrase.en}</p>
        {settings.pronunciationHelp && phrase.pron && (
          <p className="mt-2 text-sea-600 dark:text-sea-200 italic">{phrase.pron}</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="soft" size="lg" onClick={() => (isPlaying ? stop() : speak(displayRo, speechId))} disabled={!supported}>
          <Icon name={isPlaying ? 'Pause' : 'Volume2'} className="h-5 w-5" />
          Hear it
        </Button>
        {phrase.slow && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowSimpler((s) => !s)}
            aria-pressed={showSimpler}
          >
            <Icon name="Lightbulb" className="h-5 w-5" />
            {showSimpler ? 'Hide simpler version' : 'Show me a simpler version'}
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2">
        <Button variant="primary" size="lg" onClick={saidIt} disabled={result === 'said'}>
          <Icon name="Check" className="h-5 w-5" />
          I said it
        </Button>
        <Button variant="ghost" size="md" onClick={tryAgain}>
          <Icon name="RefreshCw" className="h-5 w-5" />
          Try again
        </Button>
      </div>

      {result === 'said' && (
        <p className="mt-4 text-sea-600 dark:text-sea-200 font-bold text-lg animate-pop flex items-center gap-2">
          <Icon name="Sparkles" className="h-6 w-6" /> Nice work! Every time you say it, it gets easier.
        </p>
      )}

      {flag && (
        <FlagForMihaela
          className="mt-4"
          id={flag.id}
          ro={phrase.ro}
          en={phrase.en}
          contentArea={flag.contentArea}
          contextLabel={flag.contextLabel}
        />
      )}
    </div>
  );
}
