import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { noShameMessages } from '../content';

/**
 * A calm, rotating encouragement banner. Shows one No-Shame message
 * at a time and gently rotates through them. Reduces pressure rather
 * than adding gamification stress.
 */
export function NoShameBanner({ compact = false }: { compact?: boolean }) {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * noShameMessages.length));

  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % noShameMessages.length);
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const msg = noShameMessages[idx];

  return (
    <div
      className={`rounded-2xl bg-gradient-to-br from-rose-50 to-sun-50 dark:from-rose-400/10 dark:to-sun-300/10 ring-1 ring-rose-100 dark:ring-rose-400/20 ${
        compact ? 'p-3' : 'p-4'
      } flex items-center gap-3 animate-fade-in`}
      key={msg.id}
    >
      <div className="h-10 w-10 rounded-2xl bg-white/70 dark:bg-white/10 flex items-center justify-center shrink-0">
        <Icon name={msg.icon} className="h-5 w-5 text-rose-400" />
      </div>
      <p className={`text-ink-700 dark:text-sand-100 font-bold leading-snug ${compact ? 'text-base' : 'text-lg'}`}>
        {msg.text}
      </p>
    </div>
  );
}

/** A full No-Shame page listing every message, for when the user needs a reminder. */
export function NoShamePage({ onBack }: { onBack: () => void }) {
  return (
    <div className="min-h-screen bg-sand-100 dark:bg-ink-900">
      <div className="mx-auto max-w-md px-4 pb-10 pt-6 space-y-5">
        <button
          onClick={onBack}
          className="tap-target -ml-2 rounded-2xl p-2 text-ink-700 hover:bg-sand-200 dark:text-ink-300 dark:hover:bg-white/10 inline-flex items-center gap-1"
        >
          <Icon name="ArrowLeft" className="h-6 w-6" />
          <span className="font-bold">Back</span>
        </button>

        <div className="text-center">
          <div className="mx-auto h-16 w-16 rounded-full bg-rose-50 dark:bg-rose-400/20 flex items-center justify-center mb-3">
            <Icon name="Heart" className="h-8 w-8 text-rose-400" />
          </div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-sand-100">No Shame Mode</h1>
          <p className="mt-2 text-ink-500 dark:text-ink-300 text-lg">
            Learning a language is hard. These reminders are here whenever you need them.
          </p>
        </div>

        <div className="space-y-3">
          {noShameMessages.map((m) => (
            <div
              key={m.id}
              className="card flex items-center gap-3 animate-fade-in"
            >
              <div className="h-10 w-10 rounded-2xl bg-rose-50 dark:bg-rose-400/20 flex items-center justify-center shrink-0">
                <Icon name={m.icon} className="h-5 w-5 text-rose-400" />
              </div>
              <p className="text-lg font-bold text-ink-900 dark:text-sand-100 leading-snug">{m.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
