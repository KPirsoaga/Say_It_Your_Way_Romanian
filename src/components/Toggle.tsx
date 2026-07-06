interface Props {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

export function Toggle({ label, checked, onChange }: Props) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full gap-4 py-2"
    >
      <span className="text-base font-bold text-ink-700 dark:text-ink-300">{label}</span>
      <span
        className={`relative h-8 w-14 shrink-0 rounded-full transition-colors ${checked ? 'bg-sea-500' : 'bg-sand-300 dark:bg-white/15'}`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-soft transition-all ${checked ? 'left-7' : 'left-1'}`}
        />
      </span>
    </button>
  );
}
