import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft' | 'outline' | 'danger';
type Size = 'md' | 'lg';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary: 'bg-forest text-linen-100 hover:bg-forest-600 shadow-soft dark:bg-olive-600 dark:hover:bg-olive-500',
  secondary: 'bg-coral text-white hover:bg-coral-500 shadow-soft',
  soft: 'bg-olive-50 text-forest hover:bg-olive-100 dark:bg-olive-900/30 dark:text-linen-100 dark:hover:bg-olive-900/50',
  ghost: 'bg-transparent text-forest/80 hover:bg-clay-100 dark:text-linen/80 dark:hover:bg-forest-800',
  outline: 'bg-transparent text-forest ring-2 ring-clay-200 hover:ring-olive-400 dark:text-linen dark:ring-linen/15',
  danger: 'bg-coral-50 text-coral-600 hover:bg-coral-100 dark:bg-coral-900/20 dark:text-coral-300',
};

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: Props) {
  const sizeCls = size === 'lg' ? 'btn-lg' : 'btn-md';
  return (
    <button type="button" className={`${sizeCls} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  );
}
