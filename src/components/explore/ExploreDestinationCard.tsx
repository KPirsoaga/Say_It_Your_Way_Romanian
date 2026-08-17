import type { ReactNode } from 'react';
import { IllustrationPanel } from '../illustrations/IllustrationPanel';
import { ExploreScene, type ExploreDestination } from '../illustrations/ExploreScenes';
import type { IllustrationTone } from '../illustrations/illustrationTokens';

const destinationMeta: Record<
  ExploreDestination,
  { tone: IllustrationTone; ruled?: boolean; tagline: string }
> = {
  topics: { tone: 'sky', tagline: 'Real-life Romanian situations' },
  dictionary: { tone: 'linen', ruled: true, tagline: 'Your Romanian words' },
  grammar: { tone: 'clay', ruled: true, tagline: 'How Romanian fits together' },
  progress: { tone: 'olive', tagline: 'Your journey so far' },
  daily: { tone: 'coral', ruled: true, tagline: '5 calm minutes' },
};

interface Props {
  destination: ExploreDestination;
  title: string;
  subtitle?: string;
  onClick: () => void;
  layout?: 'featured' | 'compact' | 'wide';
  footer?: ReactNode;
}

export function ExploreDestinationCard({
  destination,
  title,
  subtitle,
  onClick,
  layout = 'compact',
  footer,
}: Props) {
  const meta = destinationMeta[destination];

  if (layout === 'featured') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group w-full text-left rounded-3xl overflow-hidden border border-forest/8 dark:border-linen/10 bg-white dark:bg-forest-700 shadow-soft transition hover:shadow-soft-lg active:scale-[0.99] focus-visible:ring-4 focus-visible:ring-olive/30"
      >
        <IllustrationPanel tone={meta.tone} aspect="wide" ruled={meta.ruled} className="!rounded-none !aspect-[16/9]">
          <ExploreScene destination={destination} className="h-full w-full max-h-[140px] object-contain" />
        </IllustrationPanel>
        <div className="p-4 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-olive-600 dark:text-olive-300">
            {meta.tagline}
          </p>
          <p className="font-display text-xl font-bold text-forest dark:text-linen-100 leading-tight">{title}</p>
          {subtitle && <p className="text-sm text-forest/60 dark:text-linen/60">{subtitle}</p>}
          {footer}
        </div>
      </button>
    );
  }

  if (layout === 'wide') {
    return (
      <button
        type="button"
        onClick={onClick}
        className="group w-full text-left rounded-3xl overflow-hidden border border-forest/8 dark:border-linen/10 bg-white dark:bg-forest-700 shadow-soft transition hover:shadow-soft-lg active:scale-[0.99] focus-visible:ring-4 focus-visible:ring-olive/30 flex"
      >
        <div className="w-[42%] shrink-0">
          <IllustrationPanel tone={meta.tone} aspect="square" ruled={meta.ruled} className="!rounded-none h-full min-h-[100px]">
            <ExploreScene destination={destination} className="h-full w-full" />
          </IllustrationPanel>
        </div>
        <div className="flex flex-col justify-center p-4 min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-olive-600 dark:text-olive-300">
            {meta.tagline}
          </p>
          <p className="font-display text-lg font-bold text-forest dark:text-linen-100 leading-tight mt-0.5">{title}</p>
          {subtitle && <p className="text-sm text-forest/60 dark:text-linen/60 mt-0.5">{subtitle}</p>}
          {footer}
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left rounded-3xl overflow-hidden border border-forest/8 dark:border-linen/10 bg-white dark:bg-forest-700 shadow-soft transition hover:shadow-soft-lg active:scale-[0.99] focus-visible:ring-4 focus-visible:ring-olive/30"
    >
      <IllustrationPanel tone={meta.tone} aspect="wide" ruled={meta.ruled} className="!rounded-none !aspect-[2/1]">
        <ExploreScene destination={destination} className="h-full w-full max-h-[72px]" />
      </IllustrationPanel>
      <div className="px-3.5 py-3">
        <p className="font-display font-bold text-forest dark:text-linen-100 leading-tight">{title}</p>
        {subtitle && <p className="text-xs text-forest/55 dark:text-linen/55 mt-0.5">{subtitle}</p>}
        {footer}
      </div>
    </button>
  );
}
