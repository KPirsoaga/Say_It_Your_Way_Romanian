import { Icon } from './Icon';

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightIcon?: string;
  onRight?: () => void;
  editorial?: boolean;
}

export function PageHeader({ title, subtitle, onBack, rightIcon, onRight, editorial = true }: Props) {
  return (
    <header className="sticky top-0 z-10 bg-linen-50/90 dark:bg-forest-900/90 backdrop-blur-md border-b border-forest/8 dark:border-linen/10 pt-[env(safe-area-inset-top)]">
      <div className="page-shell py-3 flex items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="tap-target -ml-2 rounded-2xl p-2 text-forest/80 hover:bg-clay-100 dark:text-linen/80 dark:hover:bg-forest-800"
          >
            <Icon name="ArrowLeft" className="h-6 w-6" />
          </button>
        ) : (
          <span className="w-8" />
        )}
        <div className="min-w-0 flex-1 text-center">
          <h1
            className={`truncate ${editorial ? 'font-display text-xl font-bold' : 'text-lg font-semibold'} text-forest dark:text-linen-100`}
          >
            {title}
          </h1>
          {subtitle && <p className="text-sm text-forest/60 dark:text-linen/60 truncate">{subtitle}</p>}
        </div>
        {rightIcon && onRight ? (
          <button
            type="button"
            onClick={onRight}
            aria-label={rightIcon}
            className="tap-target -mr-2 rounded-2xl p-2 text-forest/80 hover:bg-clay-100 dark:text-linen/80 dark:hover:bg-forest-800"
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
