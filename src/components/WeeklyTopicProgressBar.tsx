import { Icon } from './Icon';
import type { WeeklyTopicProgress } from '../types';
import { WEEKLY_TOPIC_STEP_COUNT } from '../content/weeklyTopics';
import { ProgressBar } from './brand/ProgressBar';

interface Props {
  progress: WeeklyTopicProgress;
  className?: string;
}

export function WeeklyTopicProgressBar({ progress, className = '' }: Props) {
  const done = [
    progress.vocabularyViewed,
    progress.reading1Done,
    progress.reading2Done,
    progress.reading3Done,
    progress.roToEnDone,
    progress.enToRoDone,
    progress.matchingDone,
    progress.sortingDone,
  ].filter(Boolean).length;

  return (
    <div className={className}>
      <ProgressBar value={done} max={WEEKLY_TOPIC_STEP_COUNT} />
      <p className="text-xs text-forest/50 dark:text-linen/50 mt-1">
        {done} of {WEEKLY_TOPIC_STEP_COUNT} steps
      </p>
    </div>
  );
}

interface StepProps {
  done: boolean;
  label: string;
}

export function WeeklyStepBadge({ done, label }: StepProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${
        done ? 'text-olive-600 dark:text-olive-300' : 'text-forest/30 dark:text-linen/30'
      }`}
    >
      <Icon name={done ? 'Check' : 'Circle'} className="h-4 w-4" />
      {label}
    </span>
  );
}
