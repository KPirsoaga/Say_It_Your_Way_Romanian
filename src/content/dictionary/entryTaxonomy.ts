import type { DictionaryEntryClass } from '../lexical/canonical/types';

const SIGNS = new Set([
  'acces interzis',
  'cedează trecerea',
  'drum cu prioritate',
  'oprirea interzisă',
  'staționarea interzisă',
  'trecere de pietoni',
  'stop',
]);

const PLURAL_ONLY = new Set([
  'cârnați',
  'chibrituri',
  'insecte',
  'lemne',
  'mici',
  'musafiri',
  'prieteni',
  'scări',
  'vecini',
]);

const LOANWORDS = new Set(['camping', 'stop']);

/** Classify a dictionary noun headword for honest coverage reporting */
export function classifyNounHeadword(headwordRo: string): DictionaryEntryClass {
  const key = headwordRo.trim().toLowerCase();
  if (SIGNS.has(key)) return 'sign';
  if (LOANWORDS.has(key)) return 'loanword';
  if (PLURAL_ONLY.has(key)) return 'plural-only-noun';
  if (/\s/.test(headwordRo.trim())) {
    if (/interzis|cedează|prioritate|pietoni|stop/i.test(headwordRo)) return 'sign';
    return 'compound-noun';
  }
  return 'inflectable-noun';
}

export function isInflectableNounClass(c: DictionaryEntryClass): boolean {
  return c === 'inflectable-noun' || c === 'plural-only-noun';
}

export function expectsNounFamily(c: DictionaryEntryClass): boolean {
  return c === 'inflectable-noun' || c === 'plural-only-noun';
}

export const NOUN_TAXONOMY_LABELS: Record<DictionaryEntryClass, string> = {
  'inflectable-noun': 'Inflectable noun',
  'plural-only-noun': 'Plural-only noun',
  'compound-noun': 'Compound expression',
  sign: 'Sign / regulatory text',
  'fixed-expression': 'Fixed expression',
  loanword: 'Loanword',
  verb: 'Verb',
  adjective: 'Adjective',
  other: 'Other',
};
