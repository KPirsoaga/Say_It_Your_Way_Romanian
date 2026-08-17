import { grammarVerbs } from '../grammar';
import { scenarios, realLifeCategories, survivalPhrases } from '../../content';
import { weeklyTopics } from '../weeklyTopics';
import { curatedAdjectiveFamilies, curatedNounFamilies } from './curatedFamilies';
import { lookupGrammarVerbId } from './verbLinks';
import type {
  DictionaryEntry,
  DictionaryNounFamily,
  DictionarySense,
  DictionarySourceRef,
  DictionaryVariant,
  DictionaryWordType,
} from './types';
import type { ContentReviewMeta, WeeklyVocabItem } from '../../types';

function normalizeRo(ro: string): string {
  return ro
    .trim()
    .toLowerCase()
    .replace(/^a\s+/, '');
}

function sortKeyFor(ro: string, type: DictionaryWordType): string {
  const base = type === 'verb' ? ro.replace(/^a\s+/i, '') : ro;
  return base.trim().toLowerCase();
}

function letterBucket(sortKey: string): string {
  const ch = sortKey.charAt(0).toUpperCase();
  return /[A-ZĂÂÎȘȚ]/.test(ch) ? ch : '#';
}

function mergeReview(a?: ContentReviewMeta, b?: ContentReviewMeta): ContentReviewMeta | undefined {
  if (a?.needsReview) return a;
  if (b?.needsReview) return b;
  return a ?? b;
}

function mergeSources(existing: DictionarySourceRef[], next: DictionarySourceRef): DictionarySourceRef[] {
  const key = `${next.feature}:${next.featureId}`;
  if (existing.some((s) => `${s.feature}:${s.featureId}` === key)) return existing;
  return [...existing, next];
}

function nounHeadword(ro: string): string {
  return ro.split(' ')[0] ?? ro;
}

function buildNounFamily(ro: string, en: string): DictionaryNounFamily | undefined {
  const head = nounHeadword(ro);
  if (curatedNounFamilies[head]) return curatedNounFamilies[head];
  if (ro.includes(' ')) return undefined;
  return {
    singular: { ro, en },
    articleNote: 'More forms may be added after teacher review.',
  };
}

function buildAdjectiveFamily(ro: string, en: string) {
  const head = ro.trim();
  return curatedAdjectiveFamilies[head] ?? { masculineSingular: { ro, en } };
}

function buildVerbFamily(ro: string, en: string) {
  const grammarVerbId = lookupGrammarVerbId(ro);
  const grammarVerb = grammarVerbId ? grammarVerbs.find((v) => v.id === grammarVerbId) : undefined;
  return {
    infinitive: ro,
    en,
    grammarVerbId,
    present: grammarVerb?.present,
    perfectCompus: grammarVerb?.perfectCompus,
    imperfect: grammarVerb?.imperfect,
    future: grammarVerb?.future,
  };
}

function upsertEntry(
  map: Map<string, DictionaryEntry>,
  key: string,
  factory: () => DictionaryEntry,
  merge: (existing: DictionaryEntry) => DictionaryEntry
): void {
  const existing = map.get(key);
  if (!existing) {
    map.set(key, factory());
    return;
  }
  map.set(key, merge(existing));
}

function addWeeklyVocab(
  map: Map<string, DictionaryEntry>,
  topicId: string,
  topicTitle: string,
  item: WeeklyVocabItem
): void {
  const type = item.category as DictionaryWordType;
  const key = `${type}:${normalizeRo(item.ro)}`;
  const source: DictionarySourceRef = { feature: 'weekly-topic', featureId: topicId, label: topicTitle };

  upsertEntry(
    map,
    key,
    () => {
      const sortKey = sortKeyFor(item.ro, type);
      const entry: DictionaryEntry = {
        id: `dict-${topicId}-${item.id}`,
        type,
        headwordRo: item.ro,
        headwordEn: item.en,
        sortKey,
        letter: letterBucket(sortKey),
        pron: item.pron,
        teacherNote: item.teacherNote,
        review: item.review,
        sources: [source],
        weeklyVocabId: item.id,
        weeklyTopicId: topicId,
      };
      if (type === 'noun') entry.nounFamily = buildNounFamily(item.ro, item.en);
      if (type === 'verb') entry.verbFamily = buildVerbFamily(item.ro, item.en);
      if (type === 'adjective') entry.adjectiveFamily = buildAdjectiveFamily(item.ro, item.en);
      if (type === 'phrase') {
        entry.phraseRo = item.ro;
        entry.phraseEn = item.en;
      }
      return entry;
    },
    (existing) => ({
      ...existing,
      sources: mergeSources(existing.sources, source),
      pron: existing.pron ?? item.pron,
      teacherNote: existing.teacherNote ?? item.teacherNote,
      review: mergeReview(existing.review, item.review),
    })
  );
}

function addPhrase(
  map: Map<string, DictionaryEntry>,
  ro: string,
  en: string,
  source: DictionarySourceRef,
  extra?: { pron?: string; review?: ContentReviewMeta; id?: string }
): void {
  const key = `phrase:${normalizeRo(ro)}`;
  upsertEntry(
    map,
    key,
    () => {
      const sortKey = sortKeyFor(ro, 'phrase');
      return {
        id: extra?.id ?? `dict-phrase-${source.featureId}`,
        type: 'phrase',
        headwordRo: ro.length > 48 ? `${ro.slice(0, 45)}…` : ro,
        headwordEn: en,
        sortKey,
        letter: letterBucket(sortKey),
        pron: extra?.pron,
        review: extra?.review,
        sources: [source],
        phraseRo: ro,
        phraseEn: en,
      };
    },
    (existing) => ({
      ...existing,
      sources: mergeSources(existing.sources, source),
      review: mergeReview(existing.review, extra?.review),
    })
  );
}

function addGrammarVerbs(map: Map<string, DictionaryEntry>): void {
  grammarVerbs.forEach((verb) => {
    const key = `verb:${normalizeRo(verb.infinitive)}`;
    upsertEntry(
      map,
      key,
      () => ({
        id: `dict-${verb.id}`,
        type: 'verb',
        headwordRo: verb.infinitive,
        headwordEn: verb.en,
        sortKey: sortKeyFor(verb.infinitive, 'verb'),
        letter: letterBucket(sortKeyFor(verb.infinitive, 'verb')),
        review: verb.review,
        sources: [{ feature: 'grammar', featureId: verb.id, label: 'Grammar Help' }],
        verbFamily: {
          infinitive: verb.infinitive,
          en: verb.en,
          grammarVerbId: verb.id,
          present: verb.present,
          perfectCompus: verb.perfectCompus,
          imperfect: verb.imperfect,
          future: verb.future,
        },
      }),
      (existing) => ({
        ...existing,
        verbFamily: existing.verbFamily ?? {
          infinitive: verb.infinitive,
          en: verb.en,
          grammarVerbId: verb.id,
          present: verb.present,
          perfectCompus: verb.perfectCompus,
          imperfect: verb.imperfect,
          future: verb.future,
        },
        sources: mergeSources(existing.sources, { feature: 'grammar', featureId: verb.id, label: 'Grammar Help' }),
      })
    );
  });
}

/** Build deduplicated dictionary from all app vocabulary sources */
export function buildDictionary(): DictionaryEntry[] {
  const map = new Map<string, DictionaryEntry>();

  weeklyTopics.forEach((topic) => {
    topic.vocabulary.forEach((item) => addWeeklyVocab(map, topic.id, topic.title, item));
  });

  scenarios.forEach((scenario) => {
    scenario.lines.forEach((line, i) => {
      addPhrase(map, line.ro, line.en, {
        feature: 'scenario',
        featureId: `${scenario.id}:${i}`,
        label: scenario.title,
      }, {
        pron: line.pron,
        review: line.review,
        id: `dict-scenario-${scenario.id}-${i}`,
      });
    });
  });

  realLifeCategories.forEach((cat) => {
    cat.phrases.forEach((phrase, i) => {
      addPhrase(map, phrase.ro, phrase.en, {
        feature: 'real-life',
        featureId: `${cat.id}:${i}`,
        label: cat.title,
      }, { pron: phrase.pron, review: phrase.review, id: `dict-reallife-${cat.id}-${i}` });
    });
  });

  survivalPhrases.forEach((phrase, i) => {
    addPhrase(map, phrase.ro, phrase.en, {
      feature: 'survival',
      featureId: String(i),
      label: 'Survival Romanian',
    }, { pron: phrase.pron, review: phrase.review, id: `dict-survival-${i}` });
  });

  addGrammarVerbs(map);

  // Second sense for pod (bridge vs attic) when merged from weekly topic
  const podKey = `noun:${normalizeRo('pod')}`;
  const podEntry = map.get(podKey);
  if (podEntry) {
    const senses: DictionarySense[] = [
      { en: 'attic', note: 'In the Building a Cabin topic.' },
      { en: 'bridge', note: 'In other contexts.' },
    ];
    map.set(podKey, { ...podEntry, senses, review: mergeReview(podEntry.review, {
      needsReview: true,
      reviewReason: 'Multiple meanings — confirm with Mihaela.',
      suggestedBy: 'app author',
      contentArea: 'Vocabulary',
      reviewStatus: 'pending',
    }) });
  }

  return [...map.values()].sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'ro'));
}

export const dictionaryEntries = buildDictionary();

export function getDictionaryEntry(id: string): DictionaryEntry | undefined {
  return dictionaryEntries.find((e) => e.id === id);
}

export function searchDictionary(query: string, typeFilter: DictionaryWordType | 'all'): DictionaryEntry[] {
  const q = query.trim().toLowerCase();
  return dictionaryEntries.filter((entry) => {
    if (typeFilter !== 'all' && entry.type !== typeFilter) return false;
    if (!q) return true;
    const hay = [
      entry.headwordRo,
      entry.headwordEn,
      entry.phraseRo,
      entry.phraseEn,
      entry.nounFamily?.plural?.ro,
      entry.nounFamily?.definiteSingular?.ro,
      entry.verbFamily?.present?.map((f) => f.ro).join(' '),
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q) || entry.headwordRo.toLowerCase().includes(q) || entry.headwordEn.toLowerCase().includes(q);
  });
}

export function dictionaryLetterIndex(): string[] {
  const letters = new Set(dictionaryEntries.map((e) => e.letter));
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').filter((l) => letters.has(l));
}

export function collectVariants(entry: DictionaryEntry, weight: DictionaryVariant['sourceWeight']): DictionaryVariant[] {
  const variants: DictionaryVariant[] = [];
  const baseRo = entry.type === 'verb' ? entry.verbFamily?.infinitive ?? entry.headwordRo : entry.headwordRo;
  const baseEn = entry.headwordEn;

  if (entry.nounFamily) {
    const chain = [entry.nounFamily.singular.ro];
    const push = (ro: string | undefined, en: string | undefined, label: string) => {
      if (!ro || !en) return;
      chain.push(ro);
      variants.push({
        entryId: entry.id,
        ro,
        en,
        formLabel: label,
        baseRo,
        baseEn,
        type: 'noun',
        wordFamilyChain: [...new Set(chain)],
        sourceWeight: weight,
      });
    };
    push(entry.nounFamily.plural?.ro, entry.nounFamily.plural?.en, 'plural');
    push(entry.nounFamily.definiteSingular?.ro, entry.nounFamily.definiteSingular?.en, 'definite singular');
    push(entry.nounFamily.definitePlural?.ro, entry.nounFamily.definitePlural?.en, 'definite plural');
  }

  if (entry.verbFamily?.present) {
    entry.verbFamily.present.forEach((form) => {
      variants.push({
        entryId: entry.id,
        ro: form.ro,
        en: form.en,
        pron: form.pron,
        formLabel: form.label,
        baseRo,
        baseEn,
        type: 'verb',
        grammarVerbId: entry.verbFamily?.grammarVerbId,
        wordFamilyChain: [baseRo, form.ro],
        sourceWeight: weight,
      });
    });
  }

  if (entry.adjectiveFamily) {
    const forms = [
      ['masculine singular', entry.adjectiveFamily.masculineSingular],
      ['feminine singular', entry.adjectiveFamily.feminineSingular],
      ['masculine plural', entry.adjectiveFamily.masculinePlural],
      ['feminine plural', entry.adjectiveFamily.femininePlural],
    ] as const;
    forms.forEach(([label, form]) => {
      if (!form) return;
      variants.push({
        entryId: entry.id,
        ro: form.ro,
        en: form.en,
        formLabel: label,
        baseRo,
        baseEn,
        type: 'adjective',
        wordFamilyChain: [entry.adjectiveFamily!.masculineSingular.ro, form.ro],
        sourceWeight: weight,
      });
    });
  }

  return variants;
}

export function dictionaryStats() {
  const nouns = dictionaryEntries.filter((e) => e.type === 'noun').length;
  const verbs = dictionaryEntries.filter((e) => e.type === 'verb').length;
  const adjectives = dictionaryEntries.filter((e) => e.type === 'adjective').length;
  const phrases = dictionaryEntries.filter((e) => e.type === 'phrase').length;
  return { total: dictionaryEntries.length, nouns, verbs, adjectives, phrases };
}
