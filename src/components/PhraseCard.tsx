import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeech } from '../hooks/useSpeech';
import { FlagForTeacher } from './FlagForTeacher';
import type { PhraseLine } from '../types';
import type { FlagReviewTarget } from '../content/review/reviewIds';

interface Props {
  phrase: PhraseLine;
  /** unique id used for favourites + speech tracking */
  favId: string;
  /** larger display for "hero" phrases */
  hero?: boolean;
  /** When set, shows “Flag for Teacher” */
  flag?: Omit<FlagReviewTarget, 'ro' | 'en'>;
}

/**
 * Break a Romanian sentence into short, speakable chunks for the
 * "Make it easier" button. Falls back to the slow version when no
 * slow form exists, and to a simple split when neither is available.
 */
function breakDown(phrase: PhraseLine): string[] {
  const base = phrase.slow ?? phrase.ro;
  // If slow version already has ellipses, split on those
  if (base.includes('...')) return base.split('...').map((s) => s.trim()).filter(Boolean);
  // Otherwise split on commas and common conjunctions
  const parts = base
    .replace(/,\s*/g, '|||')
    .replace(/\bși\b/gi, '|||și ')
    .replace(/\bdar\b/gi, '|||dar ')
    .split('|||')
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 1 ? parts : [base];
}

export function PhraseCard({ phrase, favId, hero = false, flag }: Props) {
  const { settings } = useSettings();
  const { toggleFavourite, isFavourite } = useProgress();
  const { supported, speak, speakSlow, stop, currentId } = useSpeech();
  const saved = isFavourite(favId);
  const myId = favId;
  const isPlaying = currentId === myId;
  const isSlowPlaying = currentId === `${myId}-slow`;
  const [easier, setEasier] = useState(false);

  const chunks = breakDown(phrase);
  const hasEasier = chunks.length > 1 || !!phrase.slow;

  return (
    <div className={`card ${hero ? 'p-6' : ''} animate-fade-in`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p
            className={`tile-label font-bold text-ink-900 dark:text-sand-100 ${hero ? 'text-2xl leading-snug' : 'text-xl leading-snug'}`}
            lang="ro"
          >
            {phrase.ro}
          </p>
          <p className={`mt-2 text-ink-700 dark:text-ink-300 ${hero ? 'text-lg' : 'text-base'}`}>{phrase.en}</p>

          {settings.pronunciationHelp && phrase.pron && (
            <p className="mt-2 text-sea-600 dark:text-sea-200 italic text-base" aria-label="Pronunciation guide (not read aloud)">
              {phrase.pron}
            </p>
          )}
          {settings.literalTranslation && phrase.literal && (
            <p className="mt-1 text-ink-500 dark:text-ink-300 text-sm">
              <span className="font-bold">Literal:</span> {phrase.literal}
            </p>
          )}
        </div>

        <button
          aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
          onClick={() => toggleFavourite(favId)}
          className={`tap-target shrink-0 rounded-2xl p-2 transition active:scale-90 ${
            saved ? 'text-coral-400' : 'text-ink-300 hover:text-coral-300 dark:text-ink-500'
          }`}
        >
          <Icon name={saved ? 'HeartFilled' : 'Heart'} className="h-7 w-7" />
        </button>
      </div>

      {/* "Make it easier" breakdown */}
      {easier && (
        <div className="mt-4 rounded-2xl bg-sun-50 dark:bg-sun-300/10 p-4 animate-fade-in">
          <p className="text-xs font-bold uppercase tracking-wide text-sun-400 mb-2">One piece at a time</p>
          <div className="flex flex-wrap gap-2">
            {chunks.map((chunk, i) => {
              const cid = `${myId}-chunk-${i}`;
              const playing = currentId === cid;
              return (
                <button
                  key={i}
                  onClick={() => (playing ? stop() : speak(chunk, cid))}
                  disabled={!supported}
                  className="btn-md bg-white text-ink-900 ring-2 ring-sun-200 hover:ring-sun-300 dark:bg-ink-900 dark:text-sand-100 dark:ring-sun-300/30"
                >
                  <Icon name={playing ? 'Pause' : 'Volume2'} className="h-4 w-4 shrink-0" />
                  <span className="tile-label">{chunk}</span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-ink-500 dark:text-ink-300">Tap each piece, hear it, then say it. No rush.</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant={isPlaying ? 'secondary' : 'primary'}
          size="lg"
          onClick={() => (isPlaying ? stop() : speak(phrase.ro, myId))}
          disabled={!supported}
          aria-label={isPlaying ? 'Stop audio' : 'Play audio'}
        >
          <Icon name={isPlaying ? 'Pause' : 'Volume2'} className="h-5 w-5" />
          {isPlaying ? 'Playing…' : 'Play'}
        </Button>

        <Button variant="soft" size="lg" onClick={() => speak(phrase.ro, myId)} disabled={!supported}>
          <Icon name="Repeat" className="h-5 w-5" />
          Repeat after me
        </Button>

        {phrase.slow && (
          <Button
            variant="outline"
            size="lg"
            onClick={() => (isSlowPlaying ? stop() : speakSlow(phrase.slow ?? phrase.ro, `${myId}-slow`))}
            disabled={!supported}
          >
            <Icon name="Gauge" className="h-5 w-5" />
            Slow audio
          </Button>
        )}

        {hasEasier && (
          <Button
            variant={easier ? 'soft' : 'outline'}
            size="lg"
            onClick={() => setEasier((e) => !e)}
            aria-pressed={easier}
          >
            <Icon name="Lightbulb" className="h-5 w-5" />
            Make it easier
          </Button>
        )}
      </div>

      {!supported && (
        <p className="mt-3 text-sm text-coral-500">
          Audio isn’t available on this browser, but you can still read each sentence out loud.
        </p>
      )}

      {flag && (
        <FlagForTeacher
          className="mt-3"
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
