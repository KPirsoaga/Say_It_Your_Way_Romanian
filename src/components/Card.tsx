import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'quiet' | 'accent';
}

export function Card({ children, className = '', onClick, variant = 'default' }: Props) {
  const Tag = onClick ? 'button' : 'div';
  const base =
    variant === 'quiet'
      ? 'card-quiet text-left w-full'
      : variant === 'accent'
        ? 'rounded-3xl bg-olive-50 dark:bg-olive-900/20 border border-olive-200/50 dark:border-olive-700/30 p-5 min-w-0 text-left w-full'
        : 'card text-left w-full';

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`${base} ${onClick ? 'active:scale-[0.99] transition focus-visible:ring-4 focus-visible:ring-olive/30' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
