import { Card } from './Card';
import { Button } from './Button';
import { Icon } from './Icon';
import { useSpeech } from '../hooks/useSpeech';
import type { GrammarCheatSheet } from '../types';

interface Props {
  sheet: GrammarCheatSheet;
}

/** Scannable two-column cheat sheet — no exercises */
export function GrammarCheatSheetView({ sheet }: Props) {
  const { supported, speak, stop, currentId } = useSpeech();

  return (
    <div className="space-y-2">
      {sheet.rows.map((row, i) => {
        const playId = `${sheet.id}-row-${i}`;
        const playing = currentId === playId;
        return (
          <Card key={i} className="p-4 flex items-center gap-3">
            <div className="flex-1 min-w-0 grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-3">
              <p className="tile-label text-lg font-bold text-ink-900 dark:text-sand-100" lang="ro">
                {row.ro}
              </p>
              <p className="text-base text-ink-600 dark:text-ink-300 sm:text-right">{row.en}</p>
              {row.note && <p className="text-xs text-ink-500 dark:text-ink-400 col-span-full">{row.note}</p>}
            </div>
            <Button
              variant="soft"
              size="md"
              onClick={() => (playing ? stop() : speak(row.ro.split('/')[0]?.trim() ?? row.ro, playId))}
              disabled={!supported}
              aria-label={`Play ${row.ro}`}
              className="shrink-0"
            >
              <Icon name={playing ? 'Pause' : 'Volume2'} className="h-5 w-5" />
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
