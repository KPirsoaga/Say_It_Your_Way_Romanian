import { Icon } from './Icon';
import type { PageId } from '../App';

interface NavItem {
  id: PageId;
  icon: string;
  label: string;
  arg?: string;
  match?: PageId[];
}

interface Props {
  current: PageId;
  go: (page: PageId, arg?: string) => void;
}

const items: NavItem[] = [
  { id: 'home', icon: 'Home', label: 'Home' },
  {
    id: 'weekly-topics',
    icon: 'BookOpen',
    label: 'Topics',
    match: ['weekly-topics', 'weekly-topic', 'weekly-vocab', 'weekly-reading', 'weekly-exercise'],
  },
  { id: 'daily', icon: 'CalendarDays', label: 'Practice' },
  { id: 'dictionary', icon: 'BookMarked', label: 'Dictionary', match: ['dictionary', 'dictionary-entry'] },
  { id: 'more', icon: 'LayoutGrid', label: 'More', match: ['more', 'progress', 'favourites', 'grammar', 'settings'] },
];

export function BottomNav({ current, go }: Props) {
  return (
    <nav
      aria-label="Main navigation"
      className="fixed bottom-0 inset-x-0 z-20 border-t border-forest/8 bg-linen-50/95 dark:bg-forest-900/95 backdrop-blur-md dark:border-linen/10 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto max-w-md px-1 py-1.5 grid grid-cols-5 tile-grid">
        {items.map((it) => {
          const active = current === it.id || it.match?.includes(current);
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => go(it.id, it.arg)}
              className="flex flex-col items-center gap-0.5 py-1.5 tap-target justify-center transition min-w-0 w-full px-0.5"
              aria-label={it.label}
              aria-current={active ? 'page' : undefined}
            >
              <span
                aria-hidden="true"
                className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all ${
                  active
                    ? 'bg-olive-500 text-white dark:bg-olive-400 dark:text-forest-900'
                    : 'text-forest/50 dark:text-linen/50'
                }`}
              >
                <Icon name={it.icon} className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
              </span>
              <span
                aria-hidden="true"
                className={`tile-label text-[10px] sm:text-[11px] font-semibold text-center w-full ${
                  active ? 'text-olive-600 dark:text-olive-300' : 'text-forest/50 dark:text-linen/50'
                }`}
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
