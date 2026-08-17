import type { GrammarTense, VerbForm } from '../../../types';
import type { LexicalSourceRef } from '../../validation/lexicalSafety';

/** How we know a form is learner-safe — never conflate attested with composed */
export type LexicalSafetyTier = 'lexical-attested' | 'lexical-composed' | 'teacher-validated' | 'unresolved';

export type EnStatus = 'curated' | 'systematic' | 'flagged' | 'unavailable';

export type PronStatus = 'verified' | 'audio-only' | 'unavailable';

export type CompositionRule =
  | 'perfect-compus'
  | 'future-periphrastic'
  | 'reflexive-clitic'
  | 'compound-phrase';

export interface FormComposition {
  rule: CompositionRule;
  attestedComponents: string[];
}

export interface CanonicalVerbForm extends VerbForm {
  enStatus: EnStatus;
  pronStatus: PronStatus;
  terminology?: FormTerminology;
}

export interface FormTerminology {
  personPlain: string;
  tensePlain: string;
  personFormal: string;
  tenseFormal: string;
  mood?: string;
}

export interface CanonicalVerbTense {
  tense: GrammarTense;
  forms: CanonicalVerbForm[];
  safetyTier: LexicalSafetyTier;
  composition?: FormComposition;
  sources: LexicalSourceRef[];
  provenanceNote?: string;
}

export interface CanonicalVerb {
  id: string;
  infinitive: string;
  en: string;
  tenses: CanonicalVerbTense[];
}

export type DictionaryEntryClass =
  | 'inflectable-noun'
  | 'plural-only-noun'
  | 'compound-noun'
  | 'sign'
  | 'fixed-expression'
  | 'loanword'
  | 'verb'
  | 'adjective'
  | 'other';

export interface CanonicalNounForm {
  ro: string;
  en: string;
  pron?: string;
  pronStatus: PronStatus;
  enStatus: EnStatus;
  safetyTier: LexicalSafetyTier;
  slot: 'singular' | 'plural' | 'definiteSingular' | 'definitePlural';
  terminology?: {
    numberPlain: string;
    definitenessPlain: string;
    caseFormal?: string;
  };
}

export interface CanonicalNoun {
  headword: string;
  en: string;
  gender?: 'masculine' | 'feminine' | 'neuter';
  forms: CanonicalNounForm[];
  complete: boolean;
  sources: LexicalSourceRef[];
  entryClass: DictionaryEntryClass;
}

export interface CanonicalAdjectiveForm {
  ro: string;
  en: string;
  pron?: string;
  pronStatus: PronStatus;
  enStatus: EnStatus;
  safetyTier: LexicalSafetyTier;
  slot: 'masculineSingular' | 'feminineSingular' | 'masculinePlural' | 'femininePlural';
  terminology?: {
    genderPlain: string;
    numberPlain: string;
    genderFormal: string;
    numberFormal: string;
  };
}

export interface CanonicalAdjective {
  headword: string;
  en: string;
  forms: CanonicalAdjectiveForm[];
  complete: boolean;
  sources: LexicalSourceRef[];
}
