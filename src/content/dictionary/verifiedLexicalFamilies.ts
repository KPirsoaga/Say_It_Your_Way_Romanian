import type { DictionaryAdjectiveFamily, DictionaryNounFamily } from './types';
import type { LexicalSourceRef } from '../validation/lexicalSafety';

export interface VerifiedNounEntry {
  family: DictionaryNounFamily;
  /** All four inflection slots individually verified on dexonline */
  complete: boolean;
  provenance: 'lexical-explicit' | 'lexical-cross-checked';
  sources: LexicalSourceRef[];
  verifiedForms: ('singular' | 'plural' | 'definiteSingular' | 'definitePlural')[];
}

export interface VerifiedAdjectiveEntry {
  family: DictionaryAdjectiveFamily;
  complete: boolean;
  provenance: 'lexical-explicit' | 'lexical-cross-checked';
  sources: LexicalSourceRef[];
  verifiedForms: ('masculineSingular' | 'feminineSingular' | 'masculinePlural' | 'femininePlural')[];
}

const DEX = 'DEX / DOOM via dexonline.ro';
const CHECKED = '2026-08-17';

function dexUrl(word: string): string {
  return `https://dexonline.ro/definitie/${encodeURIComponent(word)}`;
}

/**
 * Noun families verified individually on dexonline.ro (not pattern-derived).
 * Only forms explicitly shown in the lexical paradigm are listed.
 */
export const verifiedNounFamilies: Record<string, VerifiedNounEntry> = {
  câine: {
    family: {
      gender: 'masculine',
      singular: { ro: 'câine', en: 'dog' },
      plural: { ro: 'câini', en: 'dogs' },
      definiteSingular: { ro: 'câinele', en: 'the dog' },
      definitePlural: { ro: 'câinii', en: 'the dogs' },
      complete: true,
    },
    complete: true,
    provenance: 'lexical-explicit',
    sources: [{ url: dexUrl('câine'), dictionary: DEX, checkedAt: CHECKED }],
    verifiedForms: ['singular', 'plural', 'definiteSingular', 'definitePlural'],
  },
  mașină: {
    family: {
      gender: 'feminine',
      singular: { ro: 'mașină', en: 'car' },
      plural: { ro: 'mașini', en: 'cars' },
      definiteSingular: { ro: 'mașina', en: 'the car' },
      definitePlural: { ro: 'mașinile', en: 'the cars' },
      complete: true,
    },
    complete: true,
    provenance: 'lexical-explicit',
    sources: [{ url: dexUrl('mașină'), dictionary: DEX, checkedAt: CHECKED }],
    verifiedForms: ['singular', 'plural', 'definiteSingular', 'definitePlural'],
  },
  pâine: {
    family: {
      gender: 'feminine',
      singular: { ro: 'pâine', en: 'bread' },
      plural: { ro: 'pâini', en: 'loaves of bread' },
      definiteSingular: { ro: 'pâinea', en: 'the bread' },
      definitePlural: { ro: 'pâinile', en: 'the loaves' },
      complete: true,
    },
    complete: true,
    provenance: 'lexical-explicit',
    sources: [{ url: dexUrl('pâine'), dictionary: DEX, checkedAt: CHECKED }],
    verifiedForms: ['singular', 'plural', 'definiteSingular', 'definitePlural'],
  },
  bandă: {
    family: {
      gender: 'feminine',
      singular: { ro: 'bandă', en: 'lane' },
      plural: { ro: 'benzi', en: 'lanes' },
      definiteSingular: { ro: 'banda', en: 'the lane' },
      definitePlural: { ro: 'benzile', en: 'the lanes' },
      complete: true,
    },
    complete: true,
    provenance: 'lexical-explicit',
    sources: [{ url: dexUrl('bandă'), dictionary: DEX, checkedAt: CHECKED }],
    verifiedForms: ['singular', 'plural', 'definiteSingular', 'definitePlural'],
  },
  pod: {
    family: {
      gender: 'neuter',
      singular: { ro: 'pod', en: 'attic / bridge' },
      plural: { ro: 'poduri', en: 'attics / bridges' },
      definiteSingular: { ro: 'podul', en: 'the attic / bridge' },
      definitePlural: { ro: 'podurile', en: 'the attics / bridges' },
      articleNote: 'Context matters — in the cabin topic, pod means attic.',
      complete: true,
    },
    complete: true,
    provenance: 'lexical-explicit',
    sources: [{ url: dexUrl('pod'), dictionary: DEX, checkedAt: CHECKED }],
    verifiedForms: ['singular', 'plural', 'definiteSingular', 'definitePlural'],
  },
  râu: {
    family: {
      gender: 'neuter',
      singular: { ro: 'râu', en: 'river' },
      plural: { ro: 'râuri', en: 'rivers' },
      definiteSingular: { ro: 'râul', en: 'the river' },
      definitePlural: { ro: 'râurile', en: 'the rivers' },
      complete: true,
    },
    complete: true,
    provenance: 'lexical-explicit',
    sources: [{ url: dexUrl('râu'), dictionary: DEX, checkedAt: CHECKED }],
    verifiedForms: ['singular', 'plural', 'definiteSingular', 'definitePlural'],
  },
};

/** Adjective families verified individually on dexonline.ro */
export const verifiedAdjectiveFamilies: Record<string, VerifiedAdjectiveEntry> = {
  bun: {
    family: {
      masculineSingular: { ro: 'bun', en: 'good' },
      feminineSingular: { ro: 'bună', en: 'good' },
      masculinePlural: { ro: 'buni', en: 'good' },
      femininePlural: { ro: 'bune', en: 'good' },
      complete: true,
    },
    complete: true,
    provenance: 'lexical-explicit',
    sources: [{ url: dexUrl('bun'), dictionary: DEX, checkedAt: CHECKED }],
    verifiedForms: ['masculineSingular', 'feminineSingular', 'masculinePlural', 'femininePlural'],
  },
  mare: {
    family: {
      masculineSingular: { ro: 'mare', en: 'big / large' },
      feminineSingular: { ro: 'mare', en: 'big / large' },
      masculinePlural: { ro: 'mari', en: 'big / large' },
      femininePlural: { ro: 'mari', en: 'big / large' },
      complete: true,
    },
    complete: true,
    provenance: 'lexical-explicit',
    sources: [{ url: dexUrl('mare'), dictionary: DEX, checkedAt: CHECKED }],
    verifiedForms: ['masculineSingular', 'feminineSingular', 'masculinePlural', 'femininePlural'],
  },
};

export function getVerifiedNounFamily(headword: string): VerifiedNounEntry | undefined {
  return verifiedNounFamilies[headword.trim().toLowerCase()];
}

export function getVerifiedAdjectiveFamily(headword: string): VerifiedAdjectiveEntry | undefined {
  return verifiedAdjectiveFamilies[headword.trim().toLowerCase()];
}
