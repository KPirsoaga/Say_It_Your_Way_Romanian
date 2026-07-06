import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'outline' | 'danger';
type Size = 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-sea-500 text-white hover:bg-sea-600 shadow-soft',
  secondary: 'bg-coral-400 text-white hover:bg-coral-500 shadow-soft',
  soft: 'bg-sea-50 text-sea-600 hover:bg-sea-100 dark:bg-sea-600/20 dark:text-sea-200 dark:hover:bg-sea-600/30',
  ghost: 'bg-transparent text-ink-700 hover:bg-sand-200/70 dark:text-ink-300 dark:hover:bg-white/10',
  outline: 'bg-transparent text-ink-700 ring-2 ring-sand-300 hover:ring-sea-400 dark:text-ink-300 dark:ring-white/20',
  danger: 'bg-coral-50 text-coral-500 hover:bg-coral-100 dark:bg-coral-400/20 dark:text-coral-200',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  const sizeCls = size === 'lg' ? 'btn-lg' : 'btn-md';
  return (
    <button className={`${sizeCls} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
