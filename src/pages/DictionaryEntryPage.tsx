import { useEffect, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { getDictionaryEntry, getDictionaryPhrase } from '../content/dictionary';
import { DictionaryFlag, WordFamily } from '../components/dictionary/WordFamily';
import { entryHasLearnerWordFamily, learnerVisibleTensesForVerb } from '../content/dictionary/familyUtils';
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
  const showWordFamily = entryHasLearnerWordFamily(entry!);
  const grammarVerbId = entry!.verbFamily?.grammarVerbId;
  const showGrammarLink = Boolean(
    grammarVerbId && learnerVisibleTensesForVerb(grammarVerbId).length > 0
  );

  return (
    <div className="min-h-screen">
      <PageHeader title={displayRo} subtitle={displayEn} onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-5">
        <header className="space-y-2">
          <p className="text-3xl font-semibold text-forest dark:text-linen-100" lang="ro">
            {displayRo}
          </p>
          <p className="text-lg text-forest/80 dark:text-linen/80">{displayEn}</p>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-clay-100 dark:bg-forest-800 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-forest/60 dark:text-linen/60 capitalize">
              {entry!.type}
            </span>
            {entry!.nounFamily?.gender && (
              <span className="rounded-full bg-olive-50 dark:bg-olive-900/30 px-3 py-1 text-xs font-semibold text-olive-700 dark:text-olive-300 capitalize">
                {entry!.nounFamily.gender}
              </span>
            )}
          </div>
          {entry!.pron && <p className="text-sm text-olive-600 dark:text-olive-300 italic">{entry!.pron}</p>}
          {entry!.teacherNote && <p className="text-sm text-forest/60 dark:text-linen/60">{entry!.teacherNote}</p>}
          {supported && (
            <Button variant="soft" size="md" onClick={() => (currentId === audioId ? stop() : speak(displayRo, audioId))}>
              <Icon name={currentId === audioId ? 'Pause' : 'Volume2'} className="h-5 w-5" />
              Play
            </Button>
          )}
        </header>

        {entry!.senses && entry!.senses.length > 1 && (
          <Card variant="quiet" className="space-y-1">
            <p className="text-xs font-semibold uppercase text-forest/50">Meanings</p>
            {entry!.senses.map((sense, i) => (
              <p key={i} className="text-sm text-forest/70 dark:text-linen/70">
                {sense.en}
                {sense.note ? ` — ${sense.note}` : ''}
              </p>
            ))}
          </Card>
        )}

        {showWordFamily && (
          <section className="space-y-3">
            <h2 className="font-display text-lg font-bold text-forest dark:text-linen-100">Word family</h2>
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
            {entry!.verbFamily?.grammarVerbId && showGrammarLink && (
              <Button variant="outline" size="lg" className="w-full" onClick={() => go('grammar-verb', entry!.verbFamily!.grammarVerbId!)}>
                Full grammar explanation →
                <Icon name="ChevronRight" className="h-5 w-5" />
              </Button>
            )}
          </section>
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
