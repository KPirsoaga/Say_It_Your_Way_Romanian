import type { SVGProps } from 'react';

type Variant = 'icon' | 'compact' | 'full';

interface Props extends SVGProps<SVGSVGElement> {
  variant?: Variant;
}

/** Approved mountain / path / sun mark */
export function BrandMark({ className = '', ...rest }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} aria-hidden {...rest}>
      <rect width="64" height="64" rx="14" fill="#1C2A23" />
      <path d="M8 48 L20 28 L32 38 L44 22 L56 36 L56 48 Z" fill="#2D3F34" />
      <path d="M14 48 L26 32 L38 40 L50 26 L50 48 Z" fill="#3A5043" opacity="0.85" />
      <path
        d="M10 50 C18 44 24 46 32 40 C40 34 46 36 54 30"
        stroke="#7A8B5A"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="48" cy="16" r="7" fill="#EB6A4A" />
      <path d="M6 50 L58 50" stroke="#24332A" strokeWidth="1.5" />
    </svg>
  );
}

export function BrandLogo({ variant = 'compact', className = '', ...rest }: Props) {
  if (variant === 'icon') {
    return <BrandMark className={className} {...rest} />;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        <BrandMark className="h-16 w-16 mb-3" />
        <p className="font-display text-2xl font-bold text-forest dark:text-linen-100 leading-tight">
          Say It <span className="font-script font-semibold text-coral">Your</span> Way
        </p>
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-coral mt-1">Romanian</p>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <BrandMark className="h-9 w-9 shrink-0" />
      <div className="min-w-0 text-left leading-tight">
        <p className="font-display text-base font-bold text-forest dark:text-linen-100 truncate">
          Say It <span className="font-script text-coral">Your</span> Way
        </p>
        <p className="text-[10px] font-semibold tracking-widest uppercase text-coral">Romanian</p>
      </div>
    </div>
  );
}
