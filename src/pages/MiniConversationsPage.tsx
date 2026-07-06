import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { NoShameBanner } from '../components/NoShameBanner';
import { useProgress } from '../context/ProgressContext';
import { colorMap, miniConversations } from '../content';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
  onBack: () => void;
}

export function MiniConversationsPage({ go, onBack }: Props) {
  const { progress } = useProgress();
  const doneCount = progress.completedConversations.length;

  return (
    <div className="min-h-screen">
      <PageHeader title="Mini Conversations" subtitle={`${doneCount} of ${miniConversations.length} done`} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <div className="rounded-3xl bg-gradient-to-br from-sea-400 to-sea-600 text-white p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="MessagesSquare" className="h-5 w-5" />
            <p className="text-sm uppercase tracking-wide font-bold text-sea-100/90">Real-life exchanges</p>
          </div>
          <h2 className="text-xl font-bold leading-tight">
            Practise short conversations. Listen, repeat, and say your lines out loud. No typing.
          </h2>
        </div>

        <NoShameBanner compact />

        <div className="space-y-3">
          {miniConversations.map((conv) => {
            const c = colorMap[conv.color];
            const done = progress.completedConversations.includes(conv.id);
            return (
              <Card key={conv.id} onClick={() => go('conversation', conv.id)} className="flex items-center gap-4 p-4">
                <div className={`h-14 w-14 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0`}>
                  <Icon name={conv.icon} className={`h-7 w-7 ${c.text}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="tile-label font-bold text-ink-900 dark:text-sand-100 text-lg leading-tight">{conv.title}</p>
                  <p className="text-sm text-ink-500 dark:text-ink-300 mt-0.5 line-clamp-2">{conv.situation}</p>
                  <p className="text-xs text-ink-300 dark:text-ink-500 mt-1">{conv.turns.length} turns</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {done && (
                    <span className="inline-flex items-center gap-1 text-sea-600 dark:text-sea-200 text-xs font-bold">
                      <Icon name="Check" className="h-4 w-4" /> Done
                    </span>
                  )}
                  <Icon name="ChevronRight" className="h-5 w-5 text-ink-300 dark:text-ink-500" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
