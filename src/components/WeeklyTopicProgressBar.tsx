import { Icon } from './Icon';
import type { WeeklyTopicProgress } from '../types';
import { WEEKLY_TOPIC_STEP_COUNT } from '../content/weeklyTopics';

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
    progress.translationAttempted,
    progress.roToEnDone,
    progress.enToRoDone,
    progress.matchingDone,
    progress.sortingDone,
  ].filter(Boolean).length;
  const pct = Math.round((done / WEEKLY_TOPIC_STEP_COUNT) * 100);

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-sm mb-1.5">
        <span className="font-bold text-ink-700 dark:text-ink-300">Progress</span>
        <span className="text-ink-500 dark:text-ink-300">
          {done} of {WEEKLY_TOPIC_STEP_COUNT} · {pct}%
        </span>
      </div>
      <div className="h-3 rounded-full bg-sand-200 dark:bg-white/10 overflow-hidden">
        <div
          className="h-full bg-sea-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Topic progress ${pct} percent`}
        />
      </div>
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
      className={`inline-flex items-center gap-1 text-xs font-bold shrink-0 ${
        done ? 'text-sea-600 dark:text-sea-200' : 'text-ink-300 dark:text-ink-500'
      }`}
    >
      <Icon name={done ? 'Check' : 'Circle'} className="h-4 w-4" />
      {label}
    </span>
  );
}
