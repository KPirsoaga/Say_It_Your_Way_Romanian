import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { getDictionaryEntry } from '../content/dictionary';
import { DictionaryFlag, WordFamily } from '../components/dictionary/WordFamily';
import { useSpeech } from '../hooks/useSpeech';
import { useProgress } from '../context/ProgressContext';
import type { GrammarTense } from '../types';
import type { PageId } from '../App';

interface Props {
  entryId: string;
  go: (page: PageId, arg?: string) => void;
  onBack: () => void;
}

export function DictionaryEntryPage({ entryId, go, onBack }: Props) {
  const entry = getDictionaryEntry(entryId);
  const { speak, stop, currentId, supported } = useSpeech();
  const { markDictionaryWordSeen } = useProgress();
  const [tense, setTense] = useState<GrammarTense>('present');

  useEffect(() => {
    if (entry) markDictionaryWordSeen(entry.id);
  }, [entry, markDictionaryWordSeen]);

  if (!entry) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Dictionary" onBack={onBack} />
        <div className="mx-auto max-w-md px-4 py-8">
          <Card className="text-center py-8">Entry not found.</Card>
        </div>
      </div>
    );
  }

  const displayRo = entry.phraseRo ?? entry.headwordRo;
  const displayEn = entry.phraseEn ?? entry.headwordEn;
  const audioId = `dict-entry-${entry.id}`;

  return (
    <div className="min-h-screen">
      <PageHeader title="Dictionary" subtitle={entry.type} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card className="space-y-3">
          <p className="text-2xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {displayRo}
          </p>
          <p className="text-lg text-ink-700 dark:text-ink-300">{displayEn}</p>
          {entry.pron && <p className="text-sm text-sea-600 dark:text-sea-200 italic">{entry.pron}</p>}
          {entry.teacherNote && <p className="text-sm text-ink-500 dark:text-ink-400">{entry.teacherNote}</p>}
          {entry.senses && entry.senses.length > 1 && (
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-ink-500">Meanings</p>
              {entry.senses.map((sense, i) => (
                <p key={i} className="text-sm text-ink-600 dark:text-ink-300">
                  {sense.en}
                  {sense.note ? ` — ${sense.note}` : ''}
                </p>
              ))}
            </div>
          )}
          {supported && (
            <Button variant="soft" size="md" onClick={() => (currentId === audioId ? stop() : speak(displayRo, audioId))}>
              <Icon name={currentId === audioId ? 'Pause' : 'Volume2'} className="h-5 w-5" />
              Play
            </Button>
          )}
        </Card>

        {(entry.nounFamily || entry.verbFamily || entry.adjectiveFamily) && (
          <Card className="space-y-3">
            <h2 className="font-bold text-ink-900 dark:text-sand-100">Word family</h2>
            <WordFamily
              nounFamily={entry.nounFamily}
              verbFamily={entry.verbFamily}
              adjectiveFamily={entry.adjectiveFamily}
              selectedTense={tense}
              onTenseChange={setTense}
              onPlay={(ro, id) => (currentId === id ? stop() : speak(ro, id))}
              playingId={currentId}
            />
            {entry.verbFamily?.grammarVerbId && (
              <Button variant="soft" size="lg" className="w-full" onClick={() => go('grammar-verb', entry.verbFamily!.grammarVerbId!)}>
                Full conjugations in Grammar Help
                <Icon name="ChevronRight" className="h-5 w-5" />
              </Button>
            )}
          </Card>
        )}

        {entry.sources.length > 0 && (
          <Card>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2">Used in</p>
            <ul className="space-y-1">
              {[...new Map(entry.sources.map((s) => [s.label, s])).values()].map((s) => (
                <li key={s.label} className="text-sm text-ink-700 dark:text-ink-300">
                  {s.label}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <DictionaryFlag entryId={entry.id} ro={displayRo} en={displayEn} contextLabel="Dictionary" />
      </div>
    </div>
  );
}
