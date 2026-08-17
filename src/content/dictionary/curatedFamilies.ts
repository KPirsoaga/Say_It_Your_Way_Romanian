import type { DictionaryAdjectiveFamily, DictionaryNounFamily } from './types';
import { nounFamilyRegistry } from './nounFamilyBuilder';

/** Noun families validated via Essential Grammar reference and pattern models */
export const curatedNounFamilies: Record<string, DictionaryNounFamily> = Object.fromEntries(
  Object.entries(nounFamilyRegistry).map(([key, family]) => {
    const { provenance: _p, ...rest } = family as DictionaryNounFamily & { provenance?: string };
    return [key, rest];
  })
);

export const curatedAdjectiveFamilies: Record<string, DictionaryAdjectiveFamily> = {
  bun: {
    masculineSingular: { ro: 'bun', en: 'good' },
    feminineSingular: { ro: 'bună', en: 'good' },
    masculinePlural: { ro: 'buni', en: 'good' },
    femininePlural: { ro: 'bune', en: 'good' },
    complete: true,
  },
  mare: {
    masculineSingular: { ro: 'mare', en: 'big / large' },
    feminineSingular: { ro: 'mare', en: 'big / large' },
    masculinePlural: { ro: 'mari', en: 'big / large' },
    femininePlural: { ro: 'mari', en: 'big / large' },
    complete: true,
  },
  mic: {
    masculineSingular: { ro: 'mic', en: 'small' },
    feminineSingular: { ro: 'mică', en: 'small' },
    masculinePlural: { ro: 'mici', en: 'small' },
    femininePlural: { ro: 'mici', en: 'small' },
    complete: true,
  },
  greu: {
    masculineSingular: { ro: 'greu', en: 'heavy' },
    feminineSingular: { ro: 'grea', en: 'heavy' },
    masculinePlural: { ro: 'grei', en: 'heavy' },
    femininePlural: { ro: 'grele', en: 'heavy' },
    complete: true,
  },
};
