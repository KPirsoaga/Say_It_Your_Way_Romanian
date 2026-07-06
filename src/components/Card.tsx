import type { ReactNode } from 'react';

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag
      onClick={onClick}
      className={`card text-left w-full ${onClick ? 'active:scale-[0.99] transition focus-visible:ring-4 focus-visible:ring-sea-500/30' : ''} ${className}`}
    >
      {children}
    </Tag>
  );
}
