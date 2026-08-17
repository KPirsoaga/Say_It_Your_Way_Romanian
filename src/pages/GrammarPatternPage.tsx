import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { getGrammarSentencePattern } from '../content/grammarSentencePatterns';
import { GrammarExamples } from '../components/GrammarExamples';
import { colorMap } from '../content';

interface Props {
  patternId: string;
  onBack: () => void;
}

export function GrammarPatternPage({ patternId, onBack }: Props) {
  const pattern = getGrammarSentencePattern(patternId);

  if (!pattern) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Pattern not found" onBack={onBack} />
      </div>
    );
  }

  const c = colorMap[pattern.color];

  return (
    <div className="min-h-screen">
      <PageHeader title={pattern.title} subtitle={pattern.summary} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <div className={`rounded-3xl ${c.bgSoft} p-5`}>
          <p className="text-xs uppercase tracking-wide font-bold text-ink-500 dark:text-ink-300 mb-2">The shape</p>
          <p className="text-2xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {pattern.patternRo}
          </p>
          <p className="mt-2 text-lg text-ink-700 dark:text-ink-300">{pattern.patternEn}</p>
        </div>

        <Card>
          <p className="text-base text-ink-700 dark:text-ink-300 leading-relaxed">{pattern.tip}</p>
        </Card>

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Examples</h2>
          <GrammarExamples examples={pattern.examples} idPrefix={pattern.id} />
        </section>
      </div>
    </div>
  );
}
