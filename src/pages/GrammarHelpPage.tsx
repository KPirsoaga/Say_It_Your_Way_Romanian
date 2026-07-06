import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { NoShameBanner } from '../components/NoShameBanner';
import { useProgress } from '../context/ProgressContext';
import { colorMap, grammarTopics, grammarVerbs } from '../content';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
  onBack: () => void;
}

export function GrammarHelpPage({ go, onBack }: Props) {
  const { progress } = useProgress();
  const doneCount = progress.completedGrammarTopics.length;

  return (
    <div className="min-h-screen">
      <PageHeader title="Grammar Help" subtitle="Simple patterns — no textbook stress" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-5">
        <div className="rounded-3xl bg-gradient-to-br from-sun-300 to-sun-400 text-ink-900 p-5 shadow-soft">
          <div className="flex items-center gap-2 mb-1">
            <Icon name="BookOpen" className="h-5 w-5" />
            <p className="text-sm uppercase tracking-wide font-bold">For Mihaela&apos;s students</p>
          </div>
          <h2 className="text-xl font-bold leading-tight">
            See the pattern. Hear it. Say it. No long grammar lectures.
          </h2>
          <p className="mt-2 text-ink-800 dark:text-ink-900 text-base">{doneCount} of {grammarTopics.length} topics practised</p>
        </div>

        <NoShameBanner compact />

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Patterns</h2>
          <div className="space-y-3">
            {grammarTopics.map((topic) => {
              const c = colorMap[topic.color];
              const done = progress.completedGrammarTopics.includes(topic.id);
              return (
                <Card key={topic.id} onClick={() => go('grammar-topic', topic.id)} className="flex items-center gap-4 p-4">
                  <div className={`h-14 w-14 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0`}>
                    <Icon name={topic.icon} className={`h-7 w-7 ${c.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink-900 dark:text-sand-100 text-lg leading-tight">{topic.title}</p>
                    <p className="text-sm text-ink-500 dark:text-ink-300 mt-0.5 line-clamp-2">{topic.summary}</p>
                  </div>
                  {done && (
                    <span className="inline-flex items-center gap-1 text-sea-600 dark:text-sea-200 text-xs font-bold shrink-0">
                      <Icon name="Check" className="h-4 w-4" /> Done
                    </span>
                  )}
                  <Icon name="ChevronRight" className="h-5 w-5 text-ink-300 dark:text-ink-500 shrink-0" />
                </Card>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-3">Common verbs</h2>
          <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">Tap a verb to see how it changes and hear examples.</p>
          <div className="space-y-3">
            {grammarVerbs.map((verb) => {
              const c = colorMap[verb.color];
              return (
                <Card key={verb.id} onClick={() => go('grammar-verb', verb.id)} className="flex items-center gap-4 p-4">
                  <div className={`h-12 w-12 rounded-2xl ${c.bgSoft} flex items-center justify-center shrink-0`}>
                    <Icon name={verb.icon} className={`h-6 w-6 ${c.text}`} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-ink-900 dark:text-sand-100 text-lg" lang="ro">
                      {verb.infinitive}
                    </p>
                    <p className="text-sm text-ink-500 dark:text-ink-300">{verb.en}</p>
                  </div>
                  <Icon name="ChevronRight" className="h-5 w-5 text-ink-300 dark:text-ink-500 shrink-0" />
                </Card>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
