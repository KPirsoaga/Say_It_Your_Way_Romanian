import { Card } from './Card';
import { Icon } from './Icon';
import { WeeklyStepBadge } from './WeeklyTopicProgressBar';

interface Props {
  title: string;
  subtitle: string;
  icon: string;
  done: boolean;
  onClick: () => void;
}

export function WeeklySectionCard({ title, subtitle, icon, done, onClick }: Props) {
  return (
    <Card onClick={onClick} className="flex items-center gap-4 !p-4">
      <div className="h-12 w-12 rounded-2xl bg-olive-50 dark:bg-olive-900/30 flex items-center justify-center shrink-0">
        <Icon name={icon} className="h-6 w-6 text-olive-600 dark:text-olive-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="tile-label font-semibold text-forest dark:text-linen-100 text-base leading-tight">{title}</p>
        <p className="tile-label text-sm text-forest/60 dark:text-linen/60 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <WeeklyStepBadge done={done} label={done ? 'Done' : 'Start'} />
        <Icon name="ChevronRight" className="h-5 w-5 text-clay-300" />
      </div>
    </Card>
  );
}
