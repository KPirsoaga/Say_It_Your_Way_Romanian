import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import type { DictionaryWordType } from '../content/dictionary/types';
import { dictionaryLetterIndex, resolveDictionarySearch, searchDictionary } from '../content/dictionary';
import { useNavigation } from '../context/NavigationContext';
import type { PageId } from '../App';

interface Props {
  go: (page: PageId, arg?: string) => void;
  onBack: () => void;
}

const FILTERS: { id: DictionaryWordType | 'all' | 'lexical'; label: string }[] = [
  { id: 'all', label: 'All words' },
  { id: 'noun', label: 'Nouns' },
  { id: 'verb', label: 'Verbs' },
  { id: 'adjective', label: 'Adjectives' },
  { id: 'phrase', label: 'Phrases' },
];

function isPhraseItem(item: { headwordRo?: string; ro?: string }): item is { id: string; ro: string; en: string; letter: string } {
  return !('headwordRo' in item);
}

export function DictionaryPage({ go, onBack }: Props) {
  const { dictionaryState, setDictionaryState } = useNavigation();
  const [query, setQuery] = useState(dictionaryState.query);
  const [filter, setFilter] = useState<DictionaryWordType | 'all' | 'lexical'>(dictionaryState.filter as DictionaryWordType | 'all' | 'lexical');
  const showPhrases = filter === 'phrase';
  const letters = useMemo(() => dictionaryLetterIndex(showPhrases), [showPhrases]);
  const results = useMemo(() => searchDictionary(query, filter), [query, filter]);
  const searchMatches = useMemo(() => (query.trim() ? resolveDictionarySearch(query) : []), [query]);

  useEffect(() => {
    setDictionaryState({ query, filter });
  }, [query, filter, setDictionaryState]);

  useEffect(() => {
    if (dictionaryState.scrollY > 0) {
      requestAnimationFrame(() => window.scrollTo({ top: dictionaryState.scrollY, behavior: 'auto' }));
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setDictionaryState({ scrollY: window.scrollY });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [setDictionaryState]);

  const grouped = useMemo(() => {
    const map = new Map<string, typeof results>();
    results.forEach((entry) => {
      const letter = 'letter' in entry ? entry.letter : '#';
      const list = map.get(letter) ?? [];
      list.push(entry);
      map.set(letter, list);
    });
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [results]);

  const jumpTo = (letter: string) => {
    const el = document.getElementById(`dict-letter-${letter}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen">
      <PageHeader title="Dictionary" subtitle="Words you have met in the app" onBack={onBack} />
      <div className="mx-auto max-w-md px-4 pb-32 pt-4 space-y-4">
        <Card className="space-y-3">
          <label className="block">
            <span className="sr-only">Search Romanian or English</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Romanian or English…"
              className="w-full rounded-2xl border border-sand-200 dark:border-white/10 bg-white dark:bg-ink-800 px-4 py-3 text-base"
            />
          </label>
          {searchMatches.some((m) => m.alias) && (
            <p className="text-sm text-ink-600 dark:text-ink-300">
              Grammatical forms like <span lang="ro" className="font-bold">{query.trim()}</span> link to their base word.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`rounded-full px-3 py-1.5 text-sm font-bold ${
                  filter === f.id
                    ? 'bg-sea-600 text-white dark:bg-sea-400 dark:text-ink-900'
                    : 'bg-sand-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          {!query && (
            <div className="flex flex-wrap gap-1">
              {letters.map((letter) => (
                <button
                  key={letter}
                  type="button"
                  onClick={() => jumpTo(letter)}
                  className="h-8 w-8 rounded-lg text-sm font-bold bg-sand-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300"
                >
                  {letter}
                </button>
              ))}
            </div>
          )}
        </Card>

        <p className="text-sm text-ink-500 dark:text-ink-300">
          {results.length} {showPhrases ? 'phrases' : 'words'}
        </p>

        {grouped.map(([letter, entries]) => (
          <section key={letter} id={`dict-letter-${letter}`}>
            <h2 className="text-lg font-bold text-ink-900 dark:text-sand-100 mb-2">{letter}</h2>
            <div className="space-y-2">
              {entries.map((item) => {
                const phrase = isPhraseItem(item);
                const aliasMatch = searchMatches.find((m) => m.entry.id === item.id)?.alias;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go('dictionary-entry', item.id)}
                    className="w-full text-left card p-4 hover:ring-2 hover:ring-sea-400 transition"
                  >
                    <p className="text-lg font-bold text-ink-900 dark:text-sand-100" lang="ro">
                      {phrase ? item.ro : item.headwordRo}
                    </p>
                    <p className="text-sm text-ink-600 dark:text-ink-300 mt-1">
                      {phrase ? item.en : item.headwordEn}
                    </p>
                    {aliasMatch && (
                      <p className="text-xs text-sea-600 dark:text-sea-200 mt-1">
                        {aliasMatch.explanation}
                      </p>
                    )}
                    <p className="text-xs font-bold uppercase tracking-wide text-ink-400 mt-2 capitalize">
                      {phrase ? 'phrase' : item.type}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>
        ))}

        {results.length === 0 && (
          <Card className="text-center py-8">
            <Icon name="BookOpen" className="h-10 w-10 text-ink-300 mx-auto mb-2" />
            <p className="font-bold text-ink-700 dark:text-ink-300">No matches</p>
          </Card>
        )}
      </div>
    </div>
  );
}
