import { Icon } from './Icon';
import type { PageId } from '../App';

interface Props {
  current: PageId;
  go: (page: PageId) => void;
}

const items: { id: PageId; icon: string; label: string }[] = [
  { id: 'home', icon: 'Home', label: 'Home' },
  { id: 'daily', icon: 'CalendarDays', label: 'Daily' },
  { id: 'scenarios', icon: 'LayoutGrid', label: 'Scenarios' },
  { id: 'favourites', icon: 'Heart', label: 'Saved' },
  { id: 'progress', icon: 'BarChart3', label: 'Progress' },
];

export function BottomNav({ current, go }: Props) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 inset-x-0 z-20 border-t border-sand-200/80 bg-sand-100/90 backdrop-blur-md dark:bg-ink-900/90 dark:border-white/10 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-md px-1 py-1.5 grid grid-cols-5 tile-grid">
        {items.map((it) => {
          const active = current === it.id || (it.id === 'scenarios' && current === 'scenario');
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => go(it.id)}
              className="flex flex-col items-center gap-0.5 py-1.5 tap-target justify-center transition min-w-0 w-full px-0.5"
              aria-label={it.label}
              aria-current={active ? 'page' : undefined}
            >
              <span
                aria-hidden="true"
                className={`h-9 w-9 rounded-2xl flex items-center justify-center transition-all ${
                  active ? 'bg-sea-500 text-white scale-105 shadow-soft' : 'text-ink-500 dark:text-ink-300'
                }`}
              >
                <Icon name={it.icon} className="h-5 w-5" />
              </span>
              <span
                aria-hidden="true"
                className={`tile-label text-[10px] sm:text-[11px] font-bold text-center w-full ${active ? 'text-sea-600 dark:text-sea-200' : 'text-ink-500 dark:text-ink-300'}`}
              >
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
