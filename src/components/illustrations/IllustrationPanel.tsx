import type { ReactNode } from 'react';
import { toneBackground, type IllustrationTone } from './illustrationTokens';

interface Props {
  tone: IllustrationTone;
  children: ReactNode;
  className?: string;
  aspect?: 'wide' | 'square' | 'banner';
  /** Decorative notebook ruled lines */
  ruled?: boolean;
}

const aspectClass = {
  wide: 'aspect-[5/3]',
  square: 'aspect-square',
  banner: 'aspect-[3/1]',
};

export function IllustrationPanel({ tone, children, className = '', aspect = 'wide', ruled = false }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${toneBackground[tone]} ${aspectClass[aspect]} ${className}`}
      aria-hidden
    >
      {ruled && (
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.08]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 11px, rgba(28,42,35,0.35) 11px, rgba(28,42,35,0.35) 12px)',
          }}
        />
      )}
      <div className="absolute inset-0 flex items-center justify-center p-2">{children}</div>
      {/* Soft vignette */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-forest/5 via-transparent to-white/10 dark:from-forest-900/30 dark:to-transparent" />
    </div>
  );
}
