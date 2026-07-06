import { Button } from './Button';
import { Icon } from './Icon';

interface Props {
  title: string;
  message: string;
  onBackToTopic: () => void;
  onTryAgain?: () => void;
  extraAction?: { label: string; onClick: () => void };
}

export function ExerciseCompletion({ title, message, onBackToTopic, onTryAgain, extraAction }: Props) {
  return (
    <div className="card p-5 text-center animate-fade-in space-y-4" role="status" aria-live="polite">
      <Icon name="Check" className="h-12 w-12 text-sea-500 mx-auto" />
      <h2 className="text-xl font-bold text-ink-900 dark:text-sand-100">{title}</h2>
      <p className="text-ink-700 dark:text-ink-300">{message}</p>
      <div className="flex flex-col gap-2 pt-1">
        <Button variant="primary" size="lg" className="w-full" onClick={onBackToTopic}>
          <Icon name="ArrowLeft" className="h-5 w-5" />
          Back to topic
        </Button>
        {onTryAgain && (
          <Button variant="soft" size="lg" className="w-full" onClick={onTryAgain}>
            <Icon name="RotateCcw" className="h-5 w-5" />
            Try again
          </Button>
        )}
        {extraAction && (
          <Button variant="ghost" size="md" className="w-full" onClick={extraAction.onClick}>
            {extraAction.label}
            <Icon name="ChevronRight" className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}
