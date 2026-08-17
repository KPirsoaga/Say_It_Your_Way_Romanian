import type { ReactNode } from 'react';
import { Icon } from '../Icon';

interface Props {
  title: string;
  subtitle?: string;
  icon?: string;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({ title, subtitle, icon, action, className = '' }: Props) {
  return (
    <div className={`flex items-start justify-between gap-3 mb-3 ${className}`}>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {icon && <Icon name={icon} className="h-5 w-5 text-olive-600 dark:text-olive-300 shrink-0" />}
          <h2 className="font-display text-xl font-bold text-forest dark:text-linen-100">{title}</h2>
        </div>
        {subtitle && <p className="text-sm text-forest/60 dark:text-linen/60 mt-0.5 ml-7">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
