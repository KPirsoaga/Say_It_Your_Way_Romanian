import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { useSettings } from '../context/SettingsContext';
import { useSpeech } from '../hooks/useSpeech';
import { FlagForTeacher } from './FlagForTeacher';
import { userFlagId } from '../content/review/reviewIds';
import type { GrammarExample, ReviewContentArea } from '../types';

interface Props {
  examples: GrammarExample[];
  idPrefix: string;
  contentArea?: ReviewContentArea;
  contextLabel?: string;
  onPractise?: () => void;
}

export function GrammarExamples({ examples, idPrefix, contentArea = 'Grammar Help', contextLabel, onPractise }: Props) {
  const { settings } = useSettings();
  const { supported, speak, stop, currentId } = useSpeech();
  const [simpler, setSimpler] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button variant={simpler ? 'soft' : 'outline'} size="md" onClick={() => setSimpler((s) => !s)} aria-pressed={simpler}>
          <Icon name="Lightbulb" className="h-5 w-5" />
          {simpler ? 'Hide simpler' : 'Make it simpler'}
        </Button>
        {onPractise && (
          <Button variant="primary" size="md" onClick={onPractise}>
            <Icon name="Mic" className="h-5 w-5" />
            Practise this
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {examples.map((ex, i) => {
          const playId = `${idPrefix}-ex-${i}`;
          const playing = currentId === playId;
          const text = simpler && ex.slow ? ex.slow : ex.ro;
          return (
            <div key={i} className="rounded-2xl bg-sand-100 dark:bg-ink-900 ring-1 ring-sand-200 dark:ring-white/10 p-4">
              <p className="text-xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
                {text}
              </p>
              <p className="mt-1 text-ink-700 dark:text-ink-300">{ex.en}</p>
              {settings.pronunciationHelp && ex.pron && (
                <p className="mt-1 text-sea-600 dark:text-sea-200 italic text-sm">{ex.pron}</p>
              )}
              <Button
                variant="soft"
                size="md"
                className="mt-3"
                onClick={() => (playing ? stop() : speak(text, playId))}
                disabled={!supported}
              >
                <Icon name={playing ? 'Pause' : 'Volume2'} className="h-5 w-5" />
                {playing ? 'Playing…' : 'Play'}
              </Button>
              <FlagForTeacher
                className="mt-2"
                id={userFlagId(`${idPrefix}-ex-${i}`)}
                ro={ex.ro}
                en={ex.en}
                contentArea={contentArea}
                contextLabel={contextLabel}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
