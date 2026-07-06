import { useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { PhraseBuilder } from '../components/PhraseBuilder';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { phraseBuilderItems } from '../content';
import { cabinPhraseBuilderItems } from '../content/weeklyTopics/cabinPhraseBuilder';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
}

export function PhraseBuilderPage({ go }: Props) {
  const allItems = useMemo(() => [...cabinPhraseBuilderItems, ...phraseBuilderItems], []);
  const [idx, setIdx] = useState(0);
  const item = allItems[idx];
  const isLast = idx === allItems.length - 1;

  const next = () => {
    if (!isLast) setIdx((i) => i + 1);
    else go('home');
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Phrase Builder" subtitle={`Sentence ${idx + 1} of ${allItems.length}`} onBack={() => go('home')} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <PhraseBuilder key={item.id} item={item} onDone={next} />

        <div className="flex gap-2">
          <Button variant="ghost" size="md" className="flex-1" onClick={next}>
            {isLast ? 'Finish' : 'Skip'}
            <Icon name="ArrowRight" className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
