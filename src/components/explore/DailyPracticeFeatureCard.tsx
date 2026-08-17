import { Button } from '../Button';
import { Icon } from '../Icon';
import { IllustrationPanel } from '../illustrations/IllustrationPanel';
import { ExploreScene } from '../illustrations/ExploreScenes';

interface Props {
  practisedToday: boolean;
  onStart: () => void;
}

export function DailyPracticeFeatureCard({ practisedToday, onStart }: Props) {
  return (
    <article className="rounded-3xl overflow-hidden border border-coral-200/60 dark:border-coral-800/30 bg-white dark:bg-forest-700 shadow-soft-lg">
      <IllustrationPanel tone="coral" aspect="wide" ruled className="!rounded-none !aspect-[21/9]">
        <ExploreScene destination="daily" className="h-full w-full max-h-[120px]" />
      </IllustrationPanel>

      <div className="p-5 space-y-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-coral dark:text-coral-300">
            Daily practice
          </p>
          <h2 className="font-display text-xl font-bold text-forest dark:text-linen-100 mt-1 leading-tight">
            Recognise word forms
          </h2>
          <p className="text-sm text-forest/65 dark:text-linen/65 mt-1.5 leading-relaxed">
            {practisedToday
              ? 'Done for today — well done! A short session from your current topic and dictionary.'
              : 'Five calm minutes with forms from your current topic and dictionary.'}
          </p>
        </div>

        <Button variant={practisedToday ? 'outline' : 'secondary'} size="lg" className="w-full" onClick={onStart}>
          {practisedToday ? 'Practise again' : 'Start daily practice'}
          <Icon name="ArrowRight" className="h-5 w-5" />
        </Button>
      </div>
    </article>
  );
}
