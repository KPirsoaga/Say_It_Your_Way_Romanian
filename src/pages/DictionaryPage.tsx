import { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/PageHeader';
import { Card } from '../components/Card';
import { Icon } from '../components/Icon';
import { PageSceneBanner } from '../components/explore/PageSceneBanner';
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
      <PageHeader title="Dictionary" subtitle="Your personal Romanian reference" onBack={onBack} />
      <div className="page-shell-body space-y-4">
        <PageSceneBanner
          destination="dictionary"
          title="My Romanian words"
          subtitle="Search, explore families, and save the forms you meet in real life."
        />
        <div className="space-y-3">
          <label className="block">
            <span className="sr-only">Search Romanian or English</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Romanian or English…"
              className="input-field"
            />
          </label>
          {searchMatches.some((m) => m.alias) && (
            <p className="text-sm text-forest/70 dark:text-linen/70">
              Grammatical forms like <span lang="ro" className="font-semibold">{query.trim()}</span> link to their base word.
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFilter(f.id)}
                className={`filter-chip ${filter === f.id ? 'filter-chip-active' : 'filter-chip-inactive'}`}
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
                  className="h-8 w-8 rounded-lg text-sm font-semibold bg-clay-100 dark:bg-forest-800 text-forest/70 dark:text-linen/70 hover:bg-olive-100 dark:hover:bg-olive-900/30"
                >
                  {letter}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-sm text-forest/50 dark:text-linen/50">
          {results.length} {showPhrases ? 'phrases' : 'words'}
        </p>

        {grouped.map(([letter, entries]) => (
          <section key={letter} id={`dict-letter-${letter}`}>
            <h2 className="font-display text-lg font-bold text-forest dark:text-linen-100 mb-2">{letter}</h2>
            <div className="space-y-2">
              {entries.map((item) => {
                const phrase = isPhraseItem(item);
                const aliasMatch = searchMatches.find((m) => m.entry.id === item.id)?.alias;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => go('dictionary-entry', item.id)}
                    className="w-full text-left rounded-2xl border border-forest/8 dark:border-linen/10 bg-white dark:bg-forest-800 p-4 hover:border-olive-300/50 transition"
                  >
                    <p className="text-lg font-semibold text-forest dark:text-linen-100" lang="ro">
                      {phrase ? item.ro : item.headwordRo}
                    </p>
                    <p className="text-sm text-forest/70 dark:text-linen/70 mt-0.5">
                      {phrase ? item.en : item.headwordEn}
                    </p>
                    {aliasMatch && (
                      <p className="text-xs text-olive-600 dark:text-olive-300 mt-1">
                        {aliasMatch.explanation}
                      </p>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-wide text-forest/40 mt-2 capitalize">
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
            <Icon name="BookOpen" className="h-10 w-10 text-clay-300 mx-auto mb-2" />
            <p className="font-semibold text-forest/70 dark:text-linen/70">No matches</p>
          </Card>
        )}
      </div>
    </div>
  );
}
