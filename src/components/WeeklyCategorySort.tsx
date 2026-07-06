import { useState } from 'react';
import { Icon } from './Icon';
import { shuffleArray } from '../utils/shuffle';
import type { WeeklySortCategory, WeeklySortItem } from '../types';

interface Props {
  categories: WeeklySortCategory[];
  items: WeeklySortItem[];
  onComplete: () => void;
}

export function WeeklyCategorySort({ categories, items, onComplete }: Props) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [sorted, setSorted] = useState<Record<string, string[]>>(() =>
    Object.fromEntries(categories.map((c) => [c.id, []]))
  );
  const [remaining, setRemaining] = useState(() => shuffleArray(items));
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const sortItem = (item: WeeklySortItem) => {
    if (!activeCategory || done) return;

    const correct = item.sortCategory === activeCategory;
    if (correct) {
      setSorted((s) => ({ ...s, [activeCategory]: [...s[activeCategory], item.id] }));
      setRemaining((r) => {
        const next = r.filter((i) => i.id !== item.id);
        if (next.length === 0) {
          setDone(true);
          onComplete();
        }
        return next;
      });
      setFeedback('Correct!');
      setTimeout(() => setFeedback(null), 800);
    } else {
      setFeedback(`Try another category for “${item.ro}”.`);
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  if (done) {
    return (
      <div className="card p-5 text-center animate-fade-in">
        <Icon name="Check" className="h-12 w-12 text-sea-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-ink-900 dark:text-sand-100">Sorted!</h2>
        <p className="mt-2 text-ink-700 dark:text-ink-300">You grouped all the vocabulary correctly.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <p className="text-ink-500 dark:text-ink-300 text-base">
        Tap a category below, then tap a word to place it. No dragging — just tap.
      </p>

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`btn-md ${
              activeCategory === cat.id
                ? 'bg-sea-500 text-white'
                : 'bg-white ring-2 ring-sand-300 text-ink-700 dark:bg-ink-900 dark:ring-white/20'
            }`}
            aria-pressed={activeCategory === cat.id}
          >
            {cat.label}
            {sorted[cat.id].length > 0 && (
              <span className="ml-1 opacity-80">({sorted[cat.id].length})</span>
            )}
          </button>
        ))}
      </div>

      {feedback && (
        <p className="text-center font-bold text-sea-600 dark:text-sea-200 animate-fade-in" role="status" aria-live="polite">
          {feedback}
        </p>
      )}

      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300 mb-2">
          Words to sort ({remaining.length} left)
        </p>
        <div className="flex flex-wrap gap-2">
          {remaining.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => sortItem(item)}
              disabled={!activeCategory}
              className="btn-md tile-label bg-white ring-2 ring-sun-200 text-ink-900 hover:ring-sun-300 dark:bg-ink-900 dark:ring-sun-300/30 disabled:opacity-50"
            >
              <span lang="ro">{item.ro}</span>
              <span className="text-xs font-normal text-ink-500 dark:text-ink-300 block">{item.en}</span>
            </button>
          ))}
        </div>
      </div>

      {!activeCategory && (
        <p className="text-sm text-ink-400 dark:text-ink-500 text-center">Choose a category first.</p>
      )}
    </div>
  );
}
