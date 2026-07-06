import { useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { Card } from '../components/Card';
import { useProgress } from '../context/ProgressContext';
import { useSpeech } from '../hooks/useSpeech';
import { useWeeklyTranslationNotes } from '../hooks/useWeeklyTranslationNotes';
import { getWeeklyTopic } from '../content/weeklyTopics';

interface Props {
  topicId: string;
  readingId: string;
  onBack: () => void;
}

export function WeeklyReadingPage({ topicId, readingId, onBack }: Props) {
  const topic = getWeeklyTopic(topicId);
  const reading = topic?.readings.find((r) => r.id === readingId);
  const { updateWeeklyTopicProgress } = useProgress();
  const { supported, speak, stop, currentId } = useSpeech();
  const { getNote, setNote } = useWeeklyTranslationNotes();
  const [revealed, setRevealed] = useState(false);
  const [note, setNoteLocal] = useState(() => getNote(topicId, readingId));

  if (!topic || !reading) return null;

  const playId = `weekly-reading-${topicId}-${readingId}`;
  const playing = currentId === playId;

  const markReadingDone = () => {
    const patch =
      reading.level === 1
        ? { reading1Done: true }
        : reading.level === 2
          ? { reading2Done: true }
          : { reading3Done: true };
    updateWeeklyTopicProgress(topicId, patch);
  };

  const finishTranslation = () => {
    setNote(topicId, readingId, note);
    updateWeeklyTopicProgress(topicId, { translationAttempted: true });
    markReadingDone();
    setRevealed(true);
  };

  const vocabItems = reading.vocabularyUsed
    .map((id) => topic.vocabulary.find((v) => v.id === id))
    .filter(Boolean);

  return (
    <div className="min-h-screen">
      <PageHeader title={reading.title} subtitle={topic.title} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card>
          <p className="text-xs uppercase tracking-wide font-bold text-sea-600 dark:text-sea-200 mb-2">Romanian</p>
          <p className="tile-label text-xl font-bold text-ink-900 dark:text-sand-100 leading-relaxed" lang="ro">
            {reading.ro}
          </p>
          <Button
            variant={playing ? 'secondary' : 'primary'}
            size="lg"
            className="mt-4 w-full"
            onClick={() => (playing ? stop() : speak(reading.ro, playId))}
            disabled={!supported}
          >
            <Icon name={playing ? 'Pause' : 'Volume2'} className="h-5 w-5" />
            {playing ? 'Playing…' : 'Play passage'}
          </Button>
        </Card>

        <Card>
          <p className="font-bold text-ink-900 dark:text-sand-100 mb-2">My English translation</p>
          <p className="text-sm text-ink-500 dark:text-ink-300 mb-3">
            Try to understand the Romanian first. Your translation is never marked — it&apos;s just for you.
          </p>
          <textarea
            value={note}
            onChange={(e) => setNoteLocal(e.target.value)}
            placeholder="Write what you think it means…"
            rows={5}
            className="w-full rounded-2xl border-2 border-sand-200 dark:border-white/10 bg-white dark:bg-ink-900 p-4 text-base text-ink-900 dark:text-sand-100 resize-y min-h-[120px] focus:outline-none focus:ring-4 focus:ring-sea-500/30"
            aria-label="My English translation"
          />
          <Button variant="primary" size="lg" className="mt-3 w-full" onClick={finishTranslation}>
            <Icon name="Check" className="h-5 w-5" />
            I&apos;ve finished
          </Button>
        </Card>

        {revealed && (
          <div className="space-y-4 animate-fade-in">
            <Card className="bg-sea-50 dark:bg-sea-600/10">
              <p className="text-xs uppercase tracking-wide font-bold text-sea-600 dark:text-sea-200 mb-2">
                Model translation
              </p>
              <p className="text-lg text-ink-900 dark:text-sand-100 leading-relaxed">{reading.modelEn}</p>
            </Card>

            {vocabItems.length > 0 && (
              <Card>
                <p className="font-bold text-ink-900 dark:text-sand-100 mb-2">Vocabulary used</p>
                <ul className="space-y-2">
                  {vocabItems.map((v) => (
                    <li key={v!.id} className="flex justify-between gap-2 text-base">
                      <span className="font-bold text-ink-900 dark:text-sand-100" lang="ro">
                        {v!.ro}
                      </span>
                      <span className="text-ink-600 dark:text-ink-300 text-right">{v!.en}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {reading.newWords.length > 0 && (
              <Card className="bg-sun-50 dark:bg-sun-300/10">
                <p className="font-bold text-sun-600 dark:text-sun-300 mb-2">New words</p>
                <ul className="space-y-2">
                  {reading.newWords.map((w) => (
                    <li key={w.ro} className="flex justify-between gap-2">
                      <span className="font-bold" lang="ro">
                        {w.ro}
                      </span>
                      <span className="text-ink-600 dark:text-ink-300">{w.en}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {reading.teacherNotes && (
              <Card>
                <p className="font-bold text-ink-900 dark:text-sand-100 mb-1">Teacher notes</p>
                <p className="text-ink-700 dark:text-ink-300">{reading.teacherNotes}</p>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
