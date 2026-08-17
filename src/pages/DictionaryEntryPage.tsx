import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { getDictionaryEntry, getDictionaryPhrase } from '../content/dictionary';
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
  const phrase = !entry ? getDictionaryPhrase(entryId) : undefined;
  const { speak, stop, currentId, supported } = useSpeech();
  const { markDictionaryWordSeen } = useProgress();
  const [tense, setTense] = useState<GrammarTense>('present');

  useEffect(() => {
    if (entry) markDictionaryWordSeen(entry.id);
  }, [entry, markDictionaryWordSeen]);

  if (!entry && !phrase) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Dictionary" onBack={onBack} />
        <div className="mx-auto max-w-md px-4 py-8">
          <Card className="text-center py-8">Entry not found.</Card>
        </div>
      </div>
    );
  }

  if (phrase) {
    const audioId = `dict-phrase-${phrase.id}`;
    return (
      <div className="min-h-screen">
        <PageHeader title="Dictionary" subtitle="phrase" onBack={onBack} />
        <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
          <Card className="space-y-3">
            <p className="text-2xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
              {phrase.ro}
            </p>
            <p className="text-lg text-ink-700 dark:text-ink-300">{phrase.en}</p>
            {phrase.pron && <p className="text-sm text-sea-600 dark:text-sea-200 italic">{phrase.pron}</p>}
            {supported && (
              <Button variant="soft" size="md" onClick={() => (currentId === audioId ? stop() : speak(phrase.ro, audioId))}>
                <Icon name={currentId === audioId ? 'Pause' : 'Volume2'} className="h-5 w-5" />
                Play
              </Button>
            )}
          </Card>

          {phrase.sources.length > 0 && (
            <Card>
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2">Used in</p>
              <ul className="space-y-1">
                {[...new Map(phrase.sources.map((s) => [s.label, s])).values()].map((s) => (
                  <li key={s.label} className="text-sm text-ink-700 dark:text-ink-300">
                    {s.label}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {phrase.linkedHeadwordIds.length > 0 && (
            <Card className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wide text-ink-500">Related words</p>
              {phrase.linkedHeadwordIds.map((id) => {
                const linked = getDictionaryEntry(id);
                if (!linked) return null;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => go('dictionary-entry', id)}
                    className="w-full text-left rounded-2xl bg-sand-50 dark:bg-ink-900 p-3 hover:ring-2 hover:ring-sea-300"
                  >
                    <p className="font-bold text-ink-900 dark:text-sand-100" lang="ro">{linked.headwordRo}</p>
                    <p className="text-sm text-ink-600 dark:text-ink-300">{linked.headwordEn}</p>
                  </button>
                );
              })}
            </Card>
          )}

          <DictionaryFlag entryId={phrase.id} ro={phrase.ro} en={phrase.en} contextLabel="Dictionary phrase" />
        </div>
      </div>
    );
  }

  const displayRo = entry!.headwordRo;
  const displayEn = entry!.headwordEn;
  const audioId = `dict-entry-${entry!.id}`;
  const showWordFamily =
    (entry!.type === 'noun' && entry!.nounFamily) ||
    (entry!.type === 'verb' && entry!.verbFamily?.present) ||
    (entry!.type === 'adjective' && entry!.adjectiveFamily);

  return (
    <div className="min-h-screen">
      <PageHeader title="Dictionary" subtitle={entry!.type} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card className="space-y-3">
          <p className="text-2xl font-bold text-ink-900 dark:text-sand-100" lang="ro">
            {displayRo}
          </p>
          <p className="text-lg text-ink-700 dark:text-ink-300">{displayEn}</p>
          {entry!.pron && <p className="text-sm text-sea-600 dark:text-sea-200 italic">{entry!.pron}</p>}
          {entry!.teacherNote && <p className="text-sm text-ink-500 dark:text-ink-400">{entry!.teacherNote}</p>}
          {entry!.senses && entry!.senses.length > 1 && (
            <div className="space-y-1">
              <p className="text-xs font-bold uppercase text-ink-500">Meanings</p>
              {entry!.senses.map((sense, i) => (
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

        {showWordFamily && (
          <Card className="space-y-3">
            <h2 className="font-bold text-ink-900 dark:text-sand-100">Word family</h2>
            <WordFamily
              nounFamily={entry!.nounFamily}
              verbFamily={entry!.verbFamily}
              adjectiveFamily={entry!.adjectiveFamily}
              familyComplete={entry!.familyComplete}
              selectedTense={tense}
              onTenseChange={setTense}
              onPlay={(ro, id) => (currentId === id ? stop() : speak(ro, id))}
              playingId={currentId}
            />
            {entry!.verbFamily?.grammarVerbId && (
              <Button variant="soft" size="lg" className="w-full" onClick={() => go('grammar-verb', entry!.verbFamily!.grammarVerbId!)}>
                Full conjugations →
                <Icon name="ChevronRight" className="h-5 w-5" />
              </Button>
            )}
          </Card>
        )}

        {entry!.usageExamples && entry!.usageExamples.length > 0 && (
          <Card className="space-y-3">
            <h2 className="font-bold text-ink-900 dark:text-sand-100">Examples in phrases</h2>
            {entry!.usageExamples.map((ex, i) => (
              <div key={i} className="rounded-2xl bg-sand-50 dark:bg-ink-900 p-3 space-y-1">
                <p className="text-base font-bold text-ink-900 dark:text-sand-100" lang="ro">{ex.ro}</p>
                <p className="text-sm text-ink-600 dark:text-ink-300">{ex.en}</p>
                {ex.sourceLabel && (
                  <p className="text-xs text-ink-400">{ex.sourceLabel}</p>
                )}
                {ex.phraseId && (
                  <button
                    type="button"
                    onClick={() => go('dictionary-entry', ex.phraseId!)}
                    className="text-xs font-bold text-sea-600 dark:text-sea-200"
                  >
                    Open phrase →
                  </button>
                )}
              </div>
            ))}
          </Card>
        )}

        {entry!.sources.length > 0 && (
          <Card>
            <p className="text-xs font-bold uppercase tracking-wide text-ink-500 mb-2">Used in</p>
            <ul className="space-y-1">
              {[...new Map(entry!.sources.map((s) => [s.label, s])).values()].map((s) => (
                <li key={s.label} className="text-sm text-ink-700 dark:text-ink-300">
                  {s.label}
                </li>
              ))}
            </ul>
          </Card>
        )}

        <DictionaryFlag entryId={entry!.id} ro={displayRo} en={displayEn} contextLabel="Dictionary" />
      </div>
    </div>
  );
}
