interface Props {
  value: number;
  max?: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, max = 100, label, className = '' }: Props) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between text-sm mb-1.5">
          <span className="font-semibold text-forest/80 dark:text-linen/80">{label}</span>
          <span className="text-forest/50 dark:text-linen/50 tabular-nums">{pct}%</span>
        </div>
      )}
      <div className="progress-track">
        <div
          className="progress-fill"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label ? `${label} ${pct} percent` : `Progress ${pct} percent`}
        />
      </div>
    </div>
  );
}
