import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { getGrammarTenseGuide } from '../content/grammarTenseGuides';
import { GrammarExamples } from '../components/GrammarExamples';

interface Props {
  guideId: string;
  onBack: () => void;
}

export function GrammarTenseGuidePage({ guideId, onBack }: Props) {
  const guide = getGrammarTenseGuide(guideId);

  if (!guide) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Guide not found" onBack={onBack} />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={guide.title} subtitle={guide.subtitle} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sea-600 dark:text-sea-200 mb-2">Imagine this</p>
          <p className="text-base text-ink-800 dark:text-sand-100 leading-relaxed">{guide.story}</p>
        </Card>

        <Card className="bg-sun-50 dark:bg-sun-300/10 p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sun-500 dark:text-sun-300 mb-2">When Romanians use it</p>
          <p className="text-base text-ink-800 dark:text-sand-100 leading-relaxed">{guide.whenToUse}</p>
        </Card>

        {guide.compareWith && (
          <Card className="p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500 dark:text-ink-300 mb-1">Compare</p>
            <p className="text-sm text-ink-700 dark:text-ink-300">{guide.compareWith}</p>
          </Card>
        )}

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Examples</h2>
          <GrammarExamples examples={guide.examples} idPrefix={guide.id} />
        </section>

        {guide.review?.needsReview && (
          <p className="text-xs text-sun-500 dark:text-sun-300 text-center">{guide.review.reviewReason}</p>
        )}
      </div>
    </div>
  );
}
