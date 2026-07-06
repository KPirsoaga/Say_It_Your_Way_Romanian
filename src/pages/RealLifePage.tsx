import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { PhraseCard } from '../components/PhraseCard';
import { NoShameBanner } from '../components/NoShameBanner';
import { colorMap, realLifeCategories } from '../content';

interface Props {
  onBack: () => void;
  /** when the user taps a "need this now" shortcut, we jump straight to a category */
  initialCategoryId?: string;
}

export function RealLifePage({ onBack, initialCategoryId }: Props) {
  const [open, setOpen] = useState<string | null>(initialCategoryId ?? null);

  return (
    <div className="min-h-screen">
      <PageHeader title="Real Life Mode" subtitle="Phrases for right now" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <p className="text-ink-500 dark:text-ink-300 text-base">
          Pick what’s happening today. Each group has short, urgent phrases you can use immediately.
        </p>

        <NoShameBanner compact />

        {realLifeCategories.map((cat) => {
          const c = colorMap[cat.color];
          const isOpen = open === cat.id;
          return (
            <div key={cat.id} className="space-y-3">
              <Card onClick={() => setOpen((o) => (o === cat.id ? null : cat.id))} className="flex items-center gap-4 p-4">
                <div className={`h-14 w-14 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0`}>
                  <Icon name={cat.icon} className={`h-7 w-7 ${c.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-lg leading-tight">{cat.title}</p>
                  <p className="text-sm text-ink-500 dark:text-ink-300 mt-0.5 line-clamp-2">{cat.when}</p>
                </div>
                <Icon
                  name={isOpen ? 'X' : 'ChevronRight'}
                  className={`h-5 w-5 text-ink-300 dark:text-ink-500 shrink-0 transition-transform ${isOpen ? '' : ''}`}
                />
              </Card>

              {isOpen && (
                <div className="space-y-3 animate-fade-in pl-1">
                  <div className={`rounded-2xl ${c.bgSoft} px-4 py-2`}>
                    <p className={`text-sm font-bold ${c.text}`}>{cat.when}</p>
                  </div>
                  {cat.phrases.map((p, i) => (
                    <PhraseCard key={i} phrase={p} favId={`reallife:${cat.id}:${i}`} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
