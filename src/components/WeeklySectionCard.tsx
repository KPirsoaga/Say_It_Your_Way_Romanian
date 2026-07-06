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
    <Card onClick={onClick} className="flex items-center gap-4 p-4">
      <div className="h-12 w-12 rounded-2xl bg-sea-50 dark:bg-sea-600/20 flex items-center justify-center shrink-0">
        <Icon name={icon} className="h-6 w-6 text-sea-600 dark:text-sea-200" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-base leading-tight">{title}</p>
        <p className="tile-label text-sm text-ink-500 dark:text-ink-300 mt-0.5">{subtitle}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <WeeklyStepBadge done={done} label={done ? 'Done' : 'Start'} />
        <Icon name="ChevronRight" className="h-5 w-5 text-ink-300 dark:text-ink-500" />
      </div>
    </Card>
  );
}
