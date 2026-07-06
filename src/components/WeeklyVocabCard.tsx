import { Button } from './Button';
import { Icon } from './Icon';
import { useSettings } from '../context/SettingsContext';
import { useProgress } from '../context/ProgressContext';
import { useSpeech } from '../hooks/useSpeech';
import type { WeeklyVocabItem } from '../types';

const categoryLabels: Record<string, string> = {
  noun: 'Nouns',
  verb: 'Verbs',
  adjective: 'Adjectives',
  phrase: 'Useful Phrases',
};

interface Props {
  item: WeeklyVocabItem;
  topicId: string;
}

export function WeeklyVocabCard({ item, topicId }: Props) {
  const { settings } = useSettings();
  const { toggleFavourite, isFavourite } = useProgress();
  const { supported, speak, stop, currentId } = useSpeech();
  const favId = `weekly:${topicId}:${item.id}`;
  const saved = isFavourite(favId);
  const playing = currentId === favId;

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs uppercase tracking-wide font-bold text-ink-300 dark:text-ink-500 mb-1">
            {categoryLabels[item.category]}
          </p>
          <p className="tile-label text-xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
            {item.ro}
          </p>
          <p className="mt-1 text-ink-700 dark:text-ink-300 text-base">{item.en}</p>
          {settings.pronunciationHelp && item.pron && (
            <p className="mt-1 text-sea-600 dark:text-sea-200 italic text-sm">{item.pron}</p>
          )}
          {item.teacherNote && (
            <p className="mt-2 text-sm text-sun-600 dark:text-sun-300 bg-sun-50 dark:bg-sun-300/10 rounded-xl p-2">
              <span className="font-bold">Teacher note:</span> {item.teacherNote}
            </p>
          )}
        </div>
        <button
          type="button"
          aria-label={saved ? 'Remove from favourites' : 'Save to favourites'}
          onClick={() => toggleFavourite(favId)}
          className={`tap-target shrink-0 rounded-2xl p-2 transition active:scale-90 ${
            saved ? 'text-coral-400' : 'text-ink-300 hover:text-coral-300 dark:text-ink-500'
          }`}
        >
          <Icon name={saved ? 'HeartFilled' : 'Heart'} className="h-7 w-7" />
        </button>
      </div>
      <Button
        variant={playing ? 'secondary' : 'primary'}
        size="md"
        className="mt-3"
        onClick={() => (playing ? stop() : speak(item.ro, favId))}
        disabled={!supported}
      >
        <Icon name={playing ? 'Pause' : 'Volume2'} className="h-5 w-5" />
        {playing ? 'Playing…' : 'Play'}
      </Button>
    </div>
  );
}
