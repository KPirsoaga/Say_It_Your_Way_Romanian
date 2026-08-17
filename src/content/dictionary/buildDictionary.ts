import { grammarVerbs, auditCanonicalVerbs } from '../verbs';
import { scenarios, realLifeCategories, survivalPhrases } from '../../content';
import { weeklyTopics } from '../weeklyTopics';
import { getVerifiedAdjectiveFamily, getVerifiedNounFamily } from './verifiedLexicalFamilies';
import { getLearnerSafeVerbForms, isVerbTenseLearnerSafe } from '../verbs/verifiedVerbForms';
import { runLexicalRepairAudit } from './lexicalAudit';
import { auditEssentialGrammar } from './essentialGrammarValidation';
import { verifiedVerbTenses } from '../verbs/verifiedVerbForms';
import { lookupGrammarVerbId } from './verbLinks';
import {
  adjectiveFamilyChain,
  extractPerfectParticiples,
  nounFamilyChain,
  nounHeadword,
  verbPresentChain,
} from './familyUtils';
import type {
  DictionaryEntry,
  DictionaryFormAlias,
  DictionaryLexicalType,
  DictionaryPhrase,
  DictionarySearchMatch,
  DictionarySense,
  DictionarySourceRef,
  DictionaryUsageExample,
  DictionaryVariant,
  DictionaryWordType,
} from './types';
import type { ContentReviewMeta, GrammarTense, WeeklyVocabItem } from '../../types';

function normalizeRo(ro: string): string {
  return ro
    .trim()
    .toLowerCase()
    .replace(/^a\s+/, '');
}

function sortKeyFor(ro: string, type: DictionaryLexicalType): string {
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

function buildNounFamily(ro: string, en: string) {
  const head = nounHeadword(ro);
  const verified = getVerifiedNounFamily(head);
  if (verified) {
    return {
      family: verified.family,
      complete: verified.complete,
      needsReview: false,
    };
  }
  if (ro.includes(' ')) {
    return { family: { singular: { ro, en } }, complete: false, needsReview: false };
  }
  return {
    family: { singular: { ro, en } },
    complete: false,
    needsReview: false,
  };
}

function buildAdjectiveFamily(ro: string, en: string) {
  const head = ro.trim();
  const verified = getVerifiedAdjectiveFamily(head);
  if (verified) {
    return {
      family: verified.family,
      complete: verified.complete,
      needsReview: false,
    };
  }
  return {
    family: { masculineSingular: { ro, en } },
    complete: false,
    needsReview: false,
  };
}

function buildVerbFamily(ro: string, en: string) {
  const grammarVerbId = lookupGrammarVerbId(ro);
  const present =
    grammarVerbId && isVerbTenseLearnerSafe(grammarVerbId, 'present')
      ? getLearnerSafeVerbForms(grammarVerbId, 'present')
      : undefined;
  const perfectCompus =
    grammarVerbId && isVerbTenseLearnerSafe(grammarVerbId, 'perfect-compus')
      ? getLearnerSafeVerbForms(grammarVerbId, 'perfect-compus')
      : undefined;
  const imperfect =
    grammarVerbId && isVerbTenseLearnerSafe(grammarVerbId, 'imperfect')
      ? getLearnerSafeVerbForms(grammarVerbId, 'imperfect')
      : undefined;
  const future =
    grammarVerbId && isVerbTenseLearnerSafe(grammarVerbId, 'future')
      ? getLearnerSafeVerbForms(grammarVerbId, 'future')
      : undefined;
  return {
    infinitive: ro,
    en,
    grammarVerbId,
    present,
    perfectCompus,
    imperfect,
    future,
  };
}

function learnerSafeVerbFamilyFromGrammar(verb: (typeof grammarVerbs)[0]) {
  const present = isVerbTenseLearnerSafe(verb.id, 'present')
    ? getLearnerSafeVerbForms(verb.id, 'present')
    : undefined;
  const perfectCompus = isVerbTenseLearnerSafe(verb.id, 'perfect-compus')
    ? getLearnerSafeVerbForms(verb.id, 'perfect-compus')
    : undefined;
  const imperfect = isVerbTenseLearnerSafe(verb.id, 'imperfect')
    ? getLearnerSafeVerbForms(verb.id, 'imperfect')
    : undefined;
  const future = isVerbTenseLearnerSafe(verb.id, 'future')
    ? getLearnerSafeVerbForms(verb.id, 'future')
    : undefined;
  return {
    infinitive: verb.infinitive,
    en: verb.en,
    grammarVerbId: verb.id,
    present,
    perfectCompus,
    imperfect,
    future,
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
  headwordMap: Map<string, DictionaryEntry>,
  topicId: string,
  topicTitle: string,
  item: WeeklyVocabItem
): void {
  if (item.category === 'phrase') return;

  const type = item.category as DictionaryLexicalType;
  const key = `${type}:${normalizeRo(item.ro)}`;
  const source: DictionarySourceRef = { feature: 'weekly-topic', featureId: topicId, label: topicTitle };

  upsertEntry(
    headwordMap,
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
        familyComplete: false,
        familyNeedsReview: false,
      };

      if (type === 'noun') {
        const { family, complete, needsReview } = buildNounFamily(item.ro, item.en);
        entry.nounFamily = family;
        entry.familyComplete = complete;
        entry.familyNeedsReview = needsReview;
        if (needsReview && item.review) entry.review = mergeReview(entry.review, item.review);
      }
      if (type === 'verb') {
        entry.verbFamily = buildVerbFamily(item.ro, item.en);
        entry.familyComplete = Boolean(entry.verbFamily.present && entry.verbFamily.present.length >= 6);
        entry.familyNeedsReview = !entry.familyComplete;
      }
      if (type === 'adjective') {
        const { family, complete, needsReview } = buildAdjectiveFamily(item.ro, item.en);
        entry.adjectiveFamily = family;
        entry.familyComplete = complete;
        entry.familyNeedsReview = needsReview;
        if (needsReview && item.review) entry.review = mergeReview(entry.review, item.review);
      }

      return entry;
    },
    (existing) => {
      let next = {
        ...existing,
        sources: mergeSources(existing.sources, source),
        pron: existing.pron ?? item.pron,
        teacherNote: existing.teacherNote ?? item.teacherNote,
        review: mergeReview(existing.review, item.review),
      };
      if (type === 'noun' && !existing.familyComplete) {
        const { family, complete, needsReview } = buildNounFamily(item.ro, item.en);
        next = {
          ...next,
          nounFamily: existing.nounFamily ?? family,
          familyComplete: existing.familyComplete || complete,
          familyNeedsReview: existing.familyNeedsReview && needsReview,
        };
      }
      return next;
    }
  );
}

function addPhrase(
  phraseMap: Map<string, DictionaryPhrase>,
  ro: string,
  en: string,
  source: DictionarySourceRef,
  extra?: { pron?: string; review?: ContentReviewMeta; id?: string }
): DictionaryPhrase {
  const key = `phrase:${normalizeRo(ro)}`;
  const existing = phraseMap.get(key);
  if (existing) {
    const merged: DictionaryPhrase = {
      ...existing,
      sources: mergeSources(existing.sources, source),
      review: mergeReview(existing.review, extra?.review),
    };
    phraseMap.set(key, merged);
    return merged;
  }
  const sortKey = sortKeyFor(ro, 'noun');
  const phrase: DictionaryPhrase = {
    id: extra?.id ?? `dict-phrase-${source.featureId}`,
    ro,
    en,
    sortKey,
    letter: letterBucket(sortKey),
    pron: extra?.pron,
    review: extra?.review,
    sources: [source],
    linkedHeadwordIds: [],
  };
  phraseMap.set(key, phrase);
  return phrase;
}

function addGrammarVerbs(map: Map<string, DictionaryEntry>): void {
  grammarVerbs.forEach((verb) => {
    const key = `verb:${normalizeRo(verb.infinitive)}`;
    const safeFamily = learnerSafeVerbFamilyFromGrammar(verb);
    const hasLearnerTenses = Boolean(
      safeFamily.present?.length ||
        safeFamily.perfectCompus?.length ||
        safeFamily.imperfect?.length ||
        safeFamily.future?.length
    );
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
        verbFamily: safeFamily,
        familyComplete: Boolean(safeFamily.present && safeFamily.present.length >= 6),
        familyNeedsReview: !hasLearnerTenses,
      }),
      (existing) => ({
        ...existing,
        verbFamily: existing.verbFamily ?? safeFamily,
        familyComplete:
          existing.familyComplete || Boolean(safeFamily.present && safeFamily.present.length >= 6),
        familyNeedsReview: existing.familyNeedsReview && !hasLearnerTenses,
        sources: mergeSources(existing.sources, { feature: 'grammar', featureId: verb.id, label: 'Grammar Help' }),
      })
    );
  });
}

function tokenizeRo(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"'()]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function linkPhraseToHeadwords(
  phrase: DictionaryPhrase,
  headwords: DictionaryEntry[],
  aliasByRo: Map<string, DictionaryFormAlias[]>
): void {
  const tokens = tokenizeRo(phrase.ro);
  const linked = new Set<string>();

  tokens.forEach((token) => {
    headwords.forEach((entry) => {
      if (normalizeRo(entry.headwordRo) === token) linked.add(entry.id);
    });
    const aliases = aliasByRo.get(token);
    aliases?.forEach((a) => linked.add(a.entryId));
  });

  phrase.linkedHeadwordIds = [...linked];
}

function attachUsageExamples(phrases: DictionaryPhrase[], headwordMap: Map<string, DictionaryEntry>): void {
  phrases.forEach((phrase) => {
    phrase.linkedHeadwordIds.forEach((entryId) => {
      const entry = [...headwordMap.values()].find((e) => e.id === entryId);
      if (!entry) return;
      const example: DictionaryUsageExample = {
        ro: phrase.ro,
        en: phrase.en,
        sourceLabel: phrase.sources[0]?.label,
        phraseId: phrase.id,
      };
      const existing = entry.usageExamples ?? [];
      if (existing.some((e) => e.phraseId === phrase.id)) return;
      entry.usageExamples = [...existing, example];
    });
  });
}

function buildFormAliases(headwords: DictionaryEntry[]): DictionaryFormAlias[] {
  const aliases: DictionaryFormAlias[] = [];

  const pushAlias = (alias: DictionaryFormAlias) => {
    const key = normalizeRo(alias.ro);
    if (key === normalizeRo(headwords.find((e) => e.id === alias.entryId)?.headwordRo ?? '')) return;
    aliases.push({ ...alias, ro: key });
  };

  headwords.forEach((entry) => {
    if (entry.nounFamily && entry.familyComplete) {
      const chain = nounFamilyChain(entry.nounFamily);
      const forms = [
        { form: entry.nounFamily.plural, label: 'plural' },
        { form: entry.nounFamily.definiteSingular, label: 'definite singular' },
        { form: entry.nounFamily.definitePlural, label: 'definite plural' },
      ];
      forms.forEach(({ form, label }) => {
        if (!form) return;
        pushAlias({
          ro: form.ro,
          entryId: entry.id,
          displayRo: form.ro,
          en: form.en,
          explanation: `${form.ro} = ${form.en}`,
          formLabel: label,
          type: 'noun',
        });
      });
      chain.forEach((ro) => {
        if (ro !== entry.nounFamily!.singular.ro) {
          const match = forms.find((f) => f.form?.ro === ro);
          if (match?.form) {
            pushAlias({
              ro,
              entryId: entry.id,
              displayRo: ro,
              en: match.form.en,
              explanation: `${ro} = ${match.form.en}`,
              formLabel: match.label,
              type: 'noun',
            });
          }
        }
      });
    }

    if (entry.verbFamily) {
      const tenses: { tense: GrammarTense; forms?: { label: string; ro: string; en: string }[]; label: string }[] = [
        { tense: 'present', forms: entry.verbFamily.present, label: 'Present' },
        { tense: 'perfect-compus', forms: entry.verbFamily.perfectCompus, label: 'Perfect compus' },
        { tense: 'imperfect', forms: entry.verbFamily.imperfect, label: 'Imperfect' },
        { tense: 'future', forms: entry.verbFamily.future, label: 'Future' },
      ];
      const grammarVerbId = entry.verbFamily.grammarVerbId;
      tenses.forEach(({ tense, forms, label }) => {
        if (!grammarVerbId || !isVerbTenseLearnerSafe(grammarVerbId, tense)) return;
        forms?.forEach((form) => {
          pushAlias({
            ro: form.ro,
            entryId: entry.id,
            displayRo: form.ro,
            en: form.en,
            explanation: `${form.ro} = ${form.en}`,
            formLabel: `${label}: ${form.label}`,
            type: 'verb',
          });
        });
      });
      if (entry.verbFamily.perfectCompus && entry.verbFamily.grammarVerbId &&
          isVerbTenseLearnerSafe(entry.verbFamily.grammarVerbId, 'perfect-compus')) {
        extractPerfectParticiples(entry.verbFamily.perfectCompus).forEach((participle) => {
          pushAlias({
            ro: participle,
            entryId: entry.id,
            displayRo: participle,
            en: `past participle of ${entry.verbFamily!.infinitive}`,
            explanation: `${participle} → ${entry.verbFamily!.infinitive}`,
            formLabel: 'past participle',
            type: 'verb',
          });
        });
      }
    }

    if (entry.adjectiveFamily && entry.familyComplete) {
      const forms = [
        { form: entry.adjectiveFamily.feminineSingular, label: 'feminine singular' },
        { form: entry.adjectiveFamily.masculinePlural, label: 'masculine plural' },
        { form: entry.adjectiveFamily.femininePlural, label: 'feminine plural' },
      ];
      forms.forEach(({ form, label }) => {
        if (!form) return;
        pushAlias({
          ro: form.ro,
          entryId: entry.id,
          displayRo: form.ro,
          en: form.en,
          explanation: `${form.ro} = ${form.en}`,
          formLabel: label,
          type: 'adjective',
        });
      });
    }
  });

  return aliases;
}

export interface BuiltDictionary {
  headwords: DictionaryEntry[];
  phrases: DictionaryPhrase[];
  aliases: DictionaryFormAlias[];
  aliasByRo: Map<string, DictionaryFormAlias[]>;
}

function buildAll(): BuiltDictionary {
  const headwordMap = new Map<string, DictionaryEntry>();
  const phraseMap = new Map<string, DictionaryPhrase>();

  weeklyTopics.forEach((topic) => {
    topic.vocabulary.forEach((item) => {
      if (item.category === 'phrase') {
        addPhrase(phraseMap, item.ro, item.en, {
          feature: 'weekly-topic',
          featureId: `${topic.id}:${item.id}`,
          label: topic.title,
        }, { pron: item.pron, review: item.review, id: `dict-${topic.id}-phrase-${item.id}` });
      } else {
        addWeeklyVocab(headwordMap, topic.id, topic.title, item);
      }
    });
  });

  scenarios.forEach((scenario) => {
    scenario.lines.forEach((line, i) => {
      addPhrase(phraseMap, line.ro, line.en, {
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
      addPhrase(phraseMap, phrase.ro, phrase.en, {
        feature: 'real-life',
        featureId: `${cat.id}:${i}`,
        label: cat.title,
      }, { pron: phrase.pron, review: phrase.review, id: `dict-reallife-${cat.id}-${i}` });
    });
  });

  survivalPhrases.forEach((phrase, i) => {
    addPhrase(phraseMap, phrase.ro, phrase.en, {
      feature: 'survival',
      featureId: String(i),
      label: 'Survival Romanian',
    }, { pron: phrase.pron, review: phrase.review, id: `dict-survival-${i}` });
  });

  addGrammarVerbs(headwordMap);

  const podKey = `noun:${normalizeRo('pod')}`;
  const podEntry = headwordMap.get(podKey);
  if (podEntry) {
    const senses: DictionarySense[] = [
      { en: 'attic', note: 'In the Building a Cabin topic.' },
      { en: 'bridge', note: 'In other contexts.' },
    ];
    headwordMap.set(podKey, {
      ...podEntry,
      senses,
      review: mergeReview(podEntry.review, {
        needsReview: true,
        reviewReason: 'Multiple meanings — confirm with teacher.',
        suggestedBy: 'app author',
        contentArea: 'Vocabulary',
        reviewStatus: 'pending',
      }),
    });
  }

  const headwords = [...headwordMap.values()].sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'ro'));
  const phrases = [...phraseMap.values()].sort((a, b) => a.sortKey.localeCompare(b.sortKey, 'ro'));

  const aliases = buildFormAliases(headwords);
  const aliasByRo = new Map<string, DictionaryFormAlias[]>();
  aliases.forEach((alias) => {
    const list = aliasByRo.get(alias.ro) ?? [];
    list.push(alias);
    aliasByRo.set(alias.ro, list);
  });

  phrases.forEach((phrase) => linkPhraseToHeadwords(phrase, headwords, aliasByRo));
  attachUsageExamples(phrases, headwordMap);

  return { headwords, phrases, aliases, aliasByRo };
}

const built = buildAll();

/** Canonical lexical headwords only (nouns, verbs, adjectives) */
export const dictionaryEntries = built.headwords;

/** Phrases kept separately from the default alphabetical list */
export const dictionaryPhrases = built.phrases;

export const dictionaryFormAliases = built.aliases;

const aliasByRo = built.aliasByRo;

/** Build deduplicated dictionary from all app vocabulary sources */
export function buildDictionary(): DictionaryEntry[] {
  return dictionaryEntries;
}

export function getDictionaryEntry(id: string): DictionaryEntry | undefined {
  return dictionaryEntries.find((e) => e.id === id);
}

export function getDictionaryPhrase(id: string): DictionaryPhrase | undefined {
  return dictionaryPhrases.find((p) => p.id === id);
}

export function resolveDictionarySearch(query: string): DictionarySearchMatch[] {
  const q = query.trim().toLowerCase();
  if (!q) return dictionaryEntries.map((entry) => ({ entry }));

  const exactAlias = aliasByRo.get(q);
  if (exactAlias && exactAlias.length > 0) {
    const seen = new Set<string>();
    const results: DictionarySearchMatch[] = [];
    exactAlias.forEach((alias) => {
      const entry = getDictionaryEntry(alias.entryId);
      if (!entry || seen.has(entry.id)) return;
      seen.add(entry.id);
      results.push({ entry, alias });
    });
    return results;
  }

  const matches: DictionarySearchMatch[] = [];
  const seen = new Set<string>();

  dictionaryEntries.forEach((entry) => {
    const hay = [
      entry.headwordRo,
      entry.headwordEn,
      entry.nounFamily?.plural?.ro,
      entry.nounFamily?.definiteSingular?.ro,
      entry.nounFamily?.definitePlural?.ro,
      entry.verbFamily?.present?.map((f) => f.ro).join(' '),
      entry.adjectiveFamily?.feminineSingular?.ro,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    if (hay.includes(q) || entry.headwordRo.toLowerCase().includes(q) || entry.headwordEn.toLowerCase().includes(q)) {
      if (!seen.has(entry.id)) {
        seen.add(entry.id);
        matches.push({ entry });
      }
    }
  });

  aliasesPartialSearch(q).forEach((match) => {
    if (!seen.has(match.entry.id)) {
      seen.add(match.entry.id);
      matches.push(match);
    }
  });

  return matches;
}

function aliasesPartialSearch(q: string): DictionarySearchMatch[] {
  const out: DictionarySearchMatch[] = [];
  const seen = new Set<string>();
  dictionaryFormAliases.forEach((alias) => {
    if (alias.ro.includes(q) || alias.displayRo.toLowerCase().includes(q)) {
      const entry = getDictionaryEntry(alias.entryId);
      if (!entry) return;
      const key = `${entry.id}:${alias.ro}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ entry, alias });
    }
  });
  return out;
}

export function searchDictionary(
  query: string,
  typeFilter: DictionaryWordType | 'all' | 'lexical'
): (DictionaryEntry | DictionaryPhrase)[] {
  const q = query.trim().toLowerCase();

  if (typeFilter === 'phrase') {
    return dictionaryPhrases.filter((phrase) => {
      if (!q) return true;
      return (
        phrase.ro.toLowerCase().includes(q) ||
        phrase.en.toLowerCase().includes(q)
      );
    });
  }

  const lexicalFilter = typeFilter === 'all' || typeFilter === 'lexical';
  const results: (DictionaryEntry | DictionaryPhrase)[] = [];
  const seen = new Set<string>();

  const pushResult = (item: DictionaryEntry | DictionaryPhrase) => {
    if (seen.has(item.id)) return;
    seen.add(item.id);
    results.push(item);
  };

  if (lexicalFilter || typeFilter === 'noun' || typeFilter === 'verb' || typeFilter === 'adjective') {
    if (q) {
      resolveDictionarySearch(query).forEach(({ entry }) => {
        if (typeFilter === 'all' || typeFilter === 'lexical' || entry.type === typeFilter) {
          pushResult(entry);
        }
      });
    } else {
      dictionaryEntries.forEach((entry) => {
        if (typeFilter === 'all' || typeFilter === 'lexical' || entry.type === typeFilter) {
          pushResult(entry);
        }
      });
    }
  }

  return results.sort((a, b) => {
    const aKey = 'sortKey' in a ? a.sortKey : '';
    const bKey = 'sortKey' in b ? b.sortKey : '';
    return aKey.localeCompare(bKey, 'ro');
  });
}

export function dictionaryLetterIndex(includePhrases = false): string[] {
  const letters = new Set(dictionaryEntries.map((e) => e.letter));
  if (includePhrases) dictionaryPhrases.forEach((p) => letters.add(p.letter));
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').filter((l) => letters.has(l));
}

export function collectVariants(entry: DictionaryEntry, weight: DictionaryVariant['sourceWeight']): DictionaryVariant[] {
  const variants: DictionaryVariant[] = [];
  const baseRo = entry.type === 'verb' ? entry.verbFamily?.infinitive ?? entry.headwordRo : entry.headwordRo;
  const baseEn = entry.headwordEn;

  if (entry.nounFamily && entry.familyComplete) {
    const chain = nounFamilyChain(entry.nounFamily);
    const push = (ro: string | undefined, en: string | undefined, label: string) => {
      if (!ro || !en) return;
      variants.push({
        entryId: entry.id,
        ro,
        en,
        formLabel: label,
        baseRo,
        baseEn,
        type: 'noun',
        wordFamilyChain: chain,
        sourceWeight: weight,
      });
    };
    push(entry.nounFamily.plural?.ro, entry.nounFamily.plural?.en, 'plural');
    push(entry.nounFamily.definiteSingular?.ro, entry.nounFamily.definiteSingular?.en, 'definite singular');
    push(entry.nounFamily.definitePlural?.ro, entry.nounFamily.definitePlural?.en, 'definite plural');
    push(entry.nounFamily.singular.ro, entry.nounFamily.singular.en, 'singular');
  }

  if (entry.verbFamily?.present && entry.verbFamily.grammarVerbId &&
      isVerbTenseLearnerSafe(entry.verbFamily.grammarVerbId, 'present')) {
    const chain = verbPresentChain(entry.verbFamily);
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
        tense: 'present',
        wordFamilyChain: chain,
        sourceWeight: weight,
      });
    });
  }

  if (entry.adjectiveFamily && entry.familyComplete) {
    const chain = adjectiveFamilyChain(entry.adjectiveFamily);
    const forms = [
      ['feminine singular', entry.adjectiveFamily.feminineSingular],
      ['masculine plural', entry.adjectiveFamily.masculinePlural],
      ['feminine plural', entry.adjectiveFamily.femininePlural],
      ['masculine singular', entry.adjectiveFamily.masculineSingular],
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
        wordFamilyChain: chain,
        sourceWeight: weight,
      });
    });
  }

  return variants;
}

export function getCurrentWeeklyTopicId(dateStr: string): string {
  let seed = 0;
  for (let i = 0; i < dateStr.length; i++) seed = (seed * 31 + dateStr.charCodeAt(i)) % 100000;
  const idx = seed % weeklyTopics.length;
  return weeklyTopics[idx]?.id ?? weeklyTopics[0]!.id;
}

export function dictionaryAuditReport() {
  const lexical = runLexicalRepairAudit('post-repair');
  const nouns = dictionaryEntries.filter((e) => e.type === 'noun');
  const verbs = dictionaryEntries.filter((e) => e.type === 'verb');
  const adjectives = dictionaryEntries.filter((e) => e.type === 'adjective');
  const variantPool = dictionaryEntries.flatMap((e) => collectVariants(e, 'wider'));

  const needsTeacherReview: string[] = lexical.teacherReviewRemaining;

  return {
    canonicalHeadwords: dictionaryEntries.length,
    nouns: nouns.length,
    verbs: verbs.length,
    adjectives: adjectives.length,
    phrases: dictionaryPhrases.length,
    nounsWithCompleteFamilies: lexical.nouns.fullyVerified,
    nounsWithPartialFamilies: lexical.nouns.partiallyVerified,
    nounsBaseOnly: lexical.nouns.baseOnly,
    nounsAwaitingReview: nouns.filter((e) => e.familyNeedsReview).length,
    verbsConnectedToGrammarHelp: Object.keys(verifiedVerbTenses).length,
    verbsWithPartialFamilies: lexical.verbs.partiallyVerified,
    verbsUnresolved: lexical.verbs.unresolved,
    verbsWithAllFourTenses: lexical.verbs.fullyVerified,
    adjectivesWithCompleteFamilies: lexical.adjectives.fullyVerified,
    searchableGrammaticalVariants: dictionaryFormAliases.length,
    dailyPracticeVariantPoolSize: variantPool.length,
    needsTeacherReview,
    nounFamilyCoveragePercent: nouns.length
      ? Math.round((lexical.nouns.fullyVerified / nouns.length) * 100)
      : 0,
    verbFamilyCoveragePercent: verbs.length
      ? Math.round((Object.keys(verifiedVerbTenses).length / verbs.length) * 100)
      : 0,
    lexicalRepair: lexical,
  };
}

export function platformGrammarAuditReport() {
  return {
    dictionary: dictionaryAuditReport(),
    essentialGrammar: auditEssentialGrammar(),
    verbs: auditCanonicalVerbs(),
  };
}

export function dictionaryStats() {
  const audit = dictionaryAuditReport();
  return {
    total: audit.canonicalHeadwords,
    nouns: audit.nouns,
    verbs: audit.verbs,
    adjectives: audit.adjectives,
    phrases: audit.phrases,
  };
}
