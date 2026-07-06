import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { GrammarExamples } from '../components/GrammarExamples';
import { useProgress } from '../context/ProgressContext';
import { colorMap, grammarTopics } from '../content';

interface Props {
  topicId: string;
  onBack: () => void;
}

export function GrammarTopicPage({ topicId, onBack }: Props) {
  const topic = grammarTopics.find((t) => t.id === topicId);
  const { markGrammarTopicCompleted, progress } = useProgress();

  if (!topic) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Topic not found" onBack={onBack} />
        <div className="mx-auto max-w-md px-4 pb-32 pt-8 text-center">
          <p className="text-ink-700 dark:text-ink-300 text-lg">We couldn&apos;t find that grammar topic.</p>
          <Button variant="primary" size="lg" className="mt-4" onClick={onBack}>
            Back to Grammar Help
          </Button>
        </div>
      </div>
    );
  }

  const c = colorMap[topic.color];
  const done = progress.completedGrammarTopics.includes(topic.id);

  const practise = () => {
    markGrammarTopicCompleted(topic.id);
  };

  return (
    <div className="min-h-screen">
      <PageHeader title={topic.title} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <div className={`rounded-3xl ${c.bgSoft} p-5`}>
          <p className="text-xs uppercase tracking-wide font-bold text-ink-500 dark:text-ink-300 mb-2">The pattern</p>
          <p className="text-2xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
            {topic.patternRo}
          </p>
          <p className="mt-2 text-lg text-ink-700 dark:text-ink-300">{topic.patternEn}</p>
        </div>

        <Card>
          <p className="text-base text-ink-700 dark:text-ink-300 leading-relaxed">{topic.tip}</p>
        </Card>

        <Card className="bg-sun-50 dark:bg-sun-300/10">
          <p className="text-xs font-bold uppercase tracking-wide text-sun-400 mb-2">Simpler version</p>
          <p className="text-xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {topic.simplerRo}
          </p>
          <p className="mt-1 text-ink-700 dark:text-ink-300">{topic.simplerEn}</p>
        </Card>

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Examples</h2>
          <GrammarExamples examples={topic.examples} idPrefix={topic.id} onPractise={practise} />
        </section>

        {done && (
          <p className="text-center text-sea-600 dark:text-sea-200 font-bold flex items-center justify-center gap-2">
            <Icon name="Check" className="h-5 w-5" /> You practised this pattern
          </p>
        )}
      </div>
    </div>
  );
}
