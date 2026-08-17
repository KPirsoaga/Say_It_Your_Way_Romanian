import type { GrammarTense } from '../../../types';
import type { FormTerminology } from './types';

const PERSON_PLAIN: Record<string, string> = {
  eu: 'eu / I',
  tu: 'tu / you',
  'el/ea': 'el / ea / he / she',
  noi: 'noi / we',
  voi: 'voi / you (pl.)',
  'ei/ele': 'ei / ele / they',
};

const PERSON_FORMAL: Record<string, string> = {
  eu: 'first-person singular',
  tu: 'second-person singular',
  'el/ea': 'third-person singular',
  noi: 'first-person plural',
  voi: 'second-person plural',
  'ei/ele': 'third-person plural',
};

const TENSE_PLAIN: Record<GrammarTense, string> = {
  present: 'Present',
  'perfect-compus': 'Perfect compus',
  imperfect: 'Imperfect',
  future: 'Future',
};

const TENSE_FORMAL: Record<GrammarTense, string> = {
  present: 'present indicative',
  'perfect-compus': 'perfect compus',
  imperfect: 'imperfect indicative',
  future: 'future (o să + subjunctive)',
};

export function verbFormTerminology(label: string, tense: GrammarTense): FormTerminology {
  return {
    personPlain: PERSON_PLAIN[label] ?? label,
    tensePlain: TENSE_PLAIN[tense],
    personFormal: PERSON_FORMAL[label] ?? label,
    tenseFormal: TENSE_FORMAL[tense],
    mood: tense === 'future' ? 'indicative (periphrastic)' : 'indicative',
  };
}

export function nounFormTerminology(
  slot: 'singular' | 'plural' | 'definiteSingular' | 'definitePlural'
): { numberPlain: string; definitenessPlain: string; caseFormal: string } {
  switch (slot) {
    case 'singular':
      return { numberPlain: 'singular', definitenessPlain: 'indefinite', caseFormal: 'nominative-accusative' };
    case 'plural':
      return { numberPlain: 'plural', definitenessPlain: 'indefinite', caseFormal: 'nominative-accusative' };
    case 'definiteSingular':
      return { numberPlain: 'singular', definitenessPlain: 'definite', caseFormal: 'nominative-accusative' };
    case 'definitePlural':
      return { numberPlain: 'plural', definitenessPlain: 'definite', caseFormal: 'nominative-accusative' };
  }
}

export function adjectiveFormTerminology(
  slot: 'masculineSingular' | 'feminineSingular' | 'masculinePlural' | 'femininePlural'
): { genderPlain: string; numberPlain: string; genderFormal: string; numberFormal: string } {
  const map = {
    masculineSingular: { genderPlain: 'masculine', numberPlain: 'singular', genderFormal: 'masculine', numberFormal: 'singular' },
    feminineSingular: { genderPlain: 'feminine', numberPlain: 'singular', genderFormal: 'feminine', numberFormal: 'singular' },
    masculinePlural: { genderPlain: 'masculine', numberPlain: 'plural', genderFormal: 'masculine', numberFormal: 'plural' },
    femininePlural: { genderPlain: 'feminine', numberPlain: 'plural', genderFormal: 'feminine', numberFormal: 'plural' },
  } as const;
  return map[slot];
}

export function formalGrammarLabel(terminology: FormTerminology): string {
  return `${terminology.personFormal}, ${terminology.tenseFormal}`;
}
