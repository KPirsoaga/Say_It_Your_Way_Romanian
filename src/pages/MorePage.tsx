import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { SectionHeading } from '../components/brand/SectionHeading';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

interface LinkItem {
  label: string;
  subtitle: string;
  icon: string;
  page: PageId;
}

const learnLinks: LinkItem[] = [
  { label: 'Grammar Help', subtitle: 'Verbs, tenses & patterns', icon: 'BookOpen', page: 'grammar' },
  { label: 'Phrase Builder', subtitle: 'Build sentences by tapping', icon: 'Sparkles', page: 'builder' },
  { label: 'Mini Conversations', subtitle: 'Guided real-life exchanges', icon: 'MessagesSquare', page: 'conversations' },
  { label: 'Real Life Mode', subtitle: 'Phrases for urgent situations', icon: 'HandHeart', page: 'reallife' },
  { label: 'Survival Romanian', subtitle: 'The most useful phrases first', icon: 'LifeBuoy', page: 'survival' },
];

const accountLinks: LinkItem[] = [
  { label: 'Progress', subtitle: 'Your learning journey', icon: 'BarChart3', page: 'progress' },
  { label: 'Saved phrases', subtitle: 'Favourites from across the app', icon: 'Heart', page: 'favourites' },
  { label: 'Settings', subtitle: 'Accessibility & teacher tools', icon: 'Settings', page: 'settings' },
];

export function MorePage({ go }: Props) {
  return (
    <div className="min-h-screen">
      <PageHeader title="More" subtitle="Learning tools & settings" />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-6">
        <SectionHeading title="Learning tools" />
        <div className="space-y-2">
          {learnLinks.map((item) => (
            <LinkRow key={item.page} item={item} onClick={() => go(item.page)} />
          ))}
        </div>

        <SectionHeading title="Your account" />
        <div className="space-y-2">
          {accountLinks.map((item) => (
            <LinkRow key={item.page} item={item} onClick={() => go(item.page)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function LinkRow({ item, onClick }: { item: LinkItem; onClick: () => void }) {
  return (
    <Card onClick={onClick} className="!p-4 flex items-center gap-4">
      <div className="h-11 w-11 rounded-2xl bg-olive-50 dark:bg-olive-900/30 flex items-center justify-center shrink-0">
        <Icon name={item.icon} className="h-5 w-5 text-olive-600 dark:text-olive-300" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-forest dark:text-linen-100">{item.label}</p>
        <p className="text-sm text-forest/60 dark:text-linen/60">{item.subtitle}</p>
      </div>
      <Icon name="ChevronRight" className="h-5 w-5 text-clay-300 shrink-0" />
    </Card>
  );
}
