import { useState } from 'react';
import { Button } from './Button';
import { Icon } from './Icon';
import { useReview } from '../context/ReviewContext';
import { FLAG_REASON_PRESETS } from '../content/review/reviewIds';
import type { FlagReviewTarget } from '../content/review/reviewIds';

interface Props extends FlagReviewTarget {
  className?: string;
}

/** Subtle action to flag Romanian content for Mihaela Review */
export function FlagForMihaela({ id, ro, en, contentArea, contextLabel, className = '' }: Props) {
  const { flagForReview, isManuallyFlagged } = useReview();
  const [open, setOpen] = useState(false);
  const [customNote, setCustomNote] = useState('');
  const flagged = isManuallyFlagged(id);

  const submit = (reason: string) => {
    flagForReview({
      id,
      ro,
      en,
      contentArea,
      contextLabel,
      reviewReason: reason,
      userNote: customNote.trim() || undefined,
    });
    setOpen(false);
    setCustomNote('');
  };

  if (flagged && !open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1 text-xs font-bold text-sun-500 dark:text-sun-300 ${className}`}
        aria-label="Update flag for Mihaela"
      >
        <Icon name="Check" className="h-3.5 w-3.5" />
        Flagged for Mihaela
      </button>
    );
  }

  return (
    <div className={className}>
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 text-xs font-bold text-ink-400 dark:text-ink-500 hover:text-sun-500 dark:hover:text-sun-300 transition"
          aria-label="Flag for Mihaela review"
        >
          <Icon name="Lightbulb" className="h-3.5 w-3.5" />
          Flag for Mihaela
        </button>
      ) : (
        <div className="rounded-2xl bg-sand-100 dark:bg-ink-900 ring-1 ring-sand-200 dark:ring-white/10 p-3 space-y-2 animate-fade-in">
          <p className="text-xs font-bold text-ink-600 dark:text-ink-300">Why flag this?</p>
          <div className="flex flex-wrap gap-1.5">
            {FLAG_REASON_PRESETS.map((reason) => (
              <button
                key={reason}
                type="button"
                onClick={() => submit(reason)}
                className="rounded-full px-3 py-1.5 text-xs font-bold bg-white dark:bg-ink-800 text-ink-700 dark:text-ink-200 ring-1 ring-sand-200 dark:ring-white/10 hover:ring-sea-400 transition"
              >
                {reason}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
            placeholder="Optional note…"
            className="w-full rounded-xl border border-sand-200 dark:border-white/10 bg-white dark:bg-ink-800 px-3 py-2 text-sm text-ink-900 dark:text-sand-100"
            aria-label="Optional note for Mihaela"
          />
          <Button variant="ghost" size="md" className="w-full" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  );
}
