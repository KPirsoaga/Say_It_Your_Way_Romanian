import { PageHeader } from './PageHeader';
import { Button } from './Button';
import { Icon } from './Icon';

interface Props {
  title: string;
  message: string;
  onBack: () => void;
  backLabel: string;
  backIcon?: string;
}

/** Shown when a deep-linked page is opened without a valid ID. */
export function NavigationFallback({ title, message, onBack, backLabel, backIcon = 'ArrowLeft' }: Props) {
  return (
    <div className="min-h-screen">
      <PageHeader title={title} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-8 text-center space-y-4">
        <p className="text-ink-700 dark:text-ink-300 text-lg">{message}</p>
        <Button variant="primary" size="lg" onClick={onBack}>
          <Icon name={backIcon} className="h-5 w-5" />
          {backLabel}
        </Button>
      </div>
    </div>
  );
}
