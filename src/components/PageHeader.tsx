import { Icon } from './Icon';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: string;
  onRight?: () => void;
}

export function PageHeader({ title, subtitle, onBack, rightIcon, onRight }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-sand-100/85 backdrop-blur-md dark:bg-ink-900/85 border-b border-sand-200/60 dark:border-white/10">
      <div className="mx-auto max-w-md px-4 py-3 flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="tap-target -ml-2 rounded-2xl p-2 text-ink-700 hover:bg-sand-200 dark:text-ink-300 dark:hover:bg-white/10"
          >
            <Icon name="ArrowLeft" className="h-6 w-6" />
          </button>
        ) : (
          <span className="w-8" />
        )}
        <div className="min-w-0 flex-1 text-center">
          <h1 className="text-xl font-bold text-ink-900 dark:text-sand-100 truncate">{title}</h1>
          {subtitle && <p className="text-sm text-ink-500 dark:text-ink-300 truncate">{subtitle}</p>}
        </div>
        {rightIcon && onRight ? (
          <button
            type="button"
            onClick={onRight}
            aria-label={rightIcon}
            className="tap-target -mr-2 rounded-2xl p-2 text-ink-700 hover:bg-sand-200 dark:text-ink-300 dark:hover:bg-white/10"
          >
            <Icon name={rightIcon} className="h-6 w-6" />
          </button>
        ) : (
          <span className="w-8" />
        )}
      </div>
    </header>
  );
}
