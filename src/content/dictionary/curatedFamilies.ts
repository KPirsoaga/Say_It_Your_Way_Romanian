import type { DictionaryAdjectiveFamily, DictionaryNounFamily } from './types';
import {
  verifiedAdjectiveFamilies,
  verifiedNounFamilies,
} from './verifiedLexicalFamilies';

/** Learner-facing noun families — only lexically verified forms (dexonline) */
export const curatedNounFamilies: Record<string, DictionaryNounFamily> = Object.fromEntries(
  Object.entries(verifiedNounFamilies).map(([key, entry]) => [key, entry.family])
);

/** Learner-facing adjective families — only lexically verified forms */
export const curatedAdjectiveFamilies: Record<string, DictionaryAdjectiveFamily> = Object.fromEntries(
  Object.entries(verifiedAdjectiveFamilies).map(([key, entry]) => [key, entry.family])
);
