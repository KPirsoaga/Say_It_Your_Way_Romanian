import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { GrammarExamples } from '../components/GrammarExamples';
import { grammarPartsOfSpeech } from '../content/grammarPartsOfSpeech';
import { colorMap } from '../content';

interface Props {
  topicId: string;
  onBack: () => void;
}

export function GrammarTopicPage({ topicId, onBack }: Props) {
  const topic = grammarPartsOfSpeech.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Topic not found" onBack={onBack} />
      </div>
    );
  }

  const c = colorMap[topic.color];

  return (
    <div className="min-h-screen">
      <PageHeader title={topic.title} subtitle={topic.summary} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <div className={`rounded-3xl ${c.bgSoft} p-5`}>
          <p className="text-xs uppercase tracking-wide font-bold text-ink-500 dark:text-ink-300 mb-2">In one line</p>
          <p className="text-xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {topic.patternRo}
          </p>
          <p className="mt-2 text-ink-700 dark:text-ink-300">{topic.patternEn}</p>
        </div>

        <Card>
          <p className="text-base text-ink-700 dark:text-ink-300 leading-relaxed">{topic.tip}</p>
        </Card>

        <Card className="bg-sun-50 dark:bg-sun-300/10 p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-sun-500 dark:text-sun-300 mb-1">Example</p>
          <p className="text-lg font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {topic.simplerRo}
          </p>
          <p className="mt-1 text-ink-700 dark:text-ink-300">{topic.simplerEn}</p>
        </Card>

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">More examples</h2>
          <GrammarExamples examples={topic.examples} idPrefix={topic.id} />
        </section>
      </div>
    </div>
  );
}
