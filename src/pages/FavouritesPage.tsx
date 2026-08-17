import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { useProgress } from '../context/ProgressContext';
import { useSpeech } from '../hooks/useSpeech';
import { useSettings } from '../context/SettingsContext';
import { scenarios, getDailyContent, survivalPhrases, realLifeCategories, grammarTopics } from '../content';
import { getWeeklyTopic } from '../content/weeklyTopics';
import type { PhraseLine } from '../types';

interface FavResolved {
  id: string;
  phrase: PhraseLine;
  label: string;
}

function resolveFavourite(id: string): FavResolved | null {
  // format: `${scenarioId}:${i}` | `daily:${date}:phrase|speak` | `survival:${i}` | `reallife:${catId}:${i}`
  // format: `${scenarioId}:${i}` | `daily:${date}:phrase|speak` | `survival:${i}` | `reallife:${catId}:${i}` | `grammar:${topicId}:${i}`
  // format: `weekly:${topicId}:${vocabId}`
  if (id.startsWith('weekly:')) {
    const parts = id.split(':');
    const topic = getWeeklyTopic(parts[1]);
    if (!topic) return null;
    const item = topic.vocabulary.find((v) => v.id === parts[2]);
    if (!item) return null;
    return {
      id,
      phrase: { ro: item.ro, en: item.en, pron: item.pron },
      label: `Weekly: ${topic.title}`,
    };
  }
  if (id.startsWith('grammar:')) {
    const parts = id.split(':');
    const topic = grammarTopics.find((t) => t.id === parts[1]);
    if (!topic) return null;
    const phrase = topic.examples[Number(parts[2])];
    if (!phrase) return null;
    return { id, phrase, label: `Grammar: ${topic.title}` };
  }
  if (id.startsWith('daily:')) {
    const parts = id.split(':');
    const date = parts[1];
    const kind = parts[2];
    const daily = getDailyContent(date);
    const phrase = kind === 'speak' ? daily.speak : daily.phrase;
    return { id, phrase, label: 'Daily practice' };
  }
  if (id.startsWith('survival:')) {
    const idx = Number(id.split(':')[1]);
    const phrase = survivalPhrases[idx];
    if (!phrase) return null;
    return { id, phrase, label: 'Survival Romanian' };
  }
  if (id.startsWith('reallife:')) {
    const parts = id.split(':');
    const cat = realLifeCategories.find((c) => c.id === parts[1]);
    if (!cat) return null;
    const phrase = cat.phrases[Number(parts[2])];
    if (!phrase) return null;
    return { id, phrase, label: cat.title };
  }
  const [sid, idxStr] = id.split(':');
  const scenario = scenarios.find((s) => s.id === sid);
  if (!scenario) return null;
  const idx = Number(idxStr);
  const phrase = scenario.lines[idx];
  if (!phrase) return null;
  return { id, phrase, label: scenario.title };
}

export function FavouritesPage() {
  const { progress, toggleFavourite } = useProgress();
  const { supported, speak, stop, currentId } = useSpeech();
  const { settings } = useSettings();

  const items = progress.favourites.map(resolveFavourite).filter((x): x is FavResolved => x !== null);

  return (
    <div className="min-h-screen">
      <PageHeader title="Saved" subtitle={`${items.length} saved phrases`} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        {items.length === 0 && (
          <div className="text-center py-12 animate-fade-in">
            <div className="mx-auto h-20 w-20 rounded-full bg-rose-50 dark:bg-rose-400/20 flex items-center justify-center mb-4">
              <Icon name="Heart" className="h-10 w-10 text-rose-300 dark:text-rose-200" />
            </div>
            <h2 className="text-xl font-bold text-ink-900 dark:text-sand-100">No saved phrases yet</h2>
            <p className="mt-2 text-ink-500 dark:text-ink-300">
              Tap the heart on any phrase to save it here for quick practice.
            </p>
          </div>
        )}

        {items.map(({ id, phrase, label }) => {
          const playing = currentId === id;
          return (
            <Card key={id} className="p-4">
              <p className="text-xs uppercase tracking-wide font-bold text-ink-300 dark:text-ink-500 mb-1">{label}</p>
              <p className="text-xl font-bold text-ink-900 dark:text-sand-100 leading-snug" lang="ro">
                {phrase.ro}
              </p>
              <p className="mt-1 text-ink-700 dark:text-ink-300">{phrase.en}</p>
              {settings.pronunciationHelp && phrase.pron && (
                <p className="mt-1 text-sea-600 dark:text-sea-200 italic text-sm">{phrase.pron}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="soft" size="md" onClick={() => (playing ? stop() : speak(phrase.ro, id))} disabled={!supported}>
                  <Icon name={playing ? 'Pause' : 'Volume2'} className="h-5 w-5" />
                  Play
                </Button>
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => toggleFavourite(id)}
                  className="text-coral-400 hover:bg-coral-50 dark:hover:bg-coral-400/20"
                >
                  <Icon name="X" className="h-5 w-5" />
                  Remove
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
