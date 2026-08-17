import type { ReactNode } from 'react';
import { IllustrationPanel } from '../illustrations/IllustrationPanel';
import { ExploreScene, type ExploreDestination } from '../illustrations/ExploreScenes';

interface Props {
  destination: ExploreDestination;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

const bannerTone = {
  topics: 'sky',
  dictionary: 'linen',
  grammar: 'clay',
  progress: 'olive',
  daily: 'coral',
} as const;

export function PageSceneBanner({ destination, title, subtitle, children }: Props) {
  return (
    <div className="rounded-3xl overflow-hidden border border-forest/8 dark:border-linen/10 bg-white dark:bg-forest-700 shadow-soft">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-2/5 shrink-0">
          <IllustrationPanel
            tone={bannerTone[destination]}
            aspect="banner"
            ruled={destination === 'dictionary' || destination === 'grammar' || destination === 'daily'}
            className="!rounded-none h-full min-h-[88px] lg:min-h-[160px]"
          >
            <ExploreScene destination={destination} className="h-full w-full lg:max-h-[150px]" />
          </IllustrationPanel>
        </div>
        <div className="p-4 sm:p-5 lg:p-6 flex flex-col justify-center min-w-0 flex-1">
          <h2 className="font-display text-lg font-bold text-forest dark:text-linen-100 leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-forest/60 dark:text-linen/60 mt-1 leading-relaxed">{subtitle}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
