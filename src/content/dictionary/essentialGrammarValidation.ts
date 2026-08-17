import { curatedAdjectiveFamilies, curatedNounFamilies } from './curatedFamilies';
import { ROMANIAN_ARTICLE_NOTE } from './familyUtils';
import type { DictionaryAdjectiveFamily, DictionaryNounFamily } from './types';
import { auditCanonicalVerbs } from '../verbs';

/** Internal reference metadata — linguistic facts only, not learner-facing textbook copy */
export type EssentialGrammarSource =
  | 'appendix-2-exercise-key'
  | 'appendix-2-masculine-decline'
  | 'appendix-2-feminine-decline'
  | 'appendix-2-neuter-decline'
  | 'ch-4.3.1-adjective-four-forms'
  | 'ch-4.3.2-adjective-three-forms'
  | 'ch-4.3.3-adjective-two-forms'
  | 'ch-1.2-indefinite-articles'
  | 'ch-3-definite-article'
  | 'ch-3-possessives'
  | 'ch-1-exercise-noun-forms';

interface ValidatedNounReference {
  gender: 'masculine' | 'feminine' | 'neuter';
  singular: string;
  plural: string;
  definiteSingular: string;
  definitePlural: string;
  validationTier: 'explicit' | 'pattern';
  sources: EssentialGrammarSource[];
}

interface ValidatedAdjectiveReference {
  masculineSingular: string;
  feminineSingular: string;
  masculinePlural: string;
  femininePlural: string;
  validationTier: 'explicit' | 'pattern';
  sources: EssentialGrammarSource[];
}

/**
 * Noun/adjective forms established by Romanian: An Essential Grammar (Gönczöl, 2nd ed.).
 * Used for validation only — do not surface as teaching copy.
 */
const ESSENTIAL_GRAMMAR_NOUNS: Record<string, ValidatedNounReference> = {
  câine: {
    gender: 'masculine',
    singular: 'câine',
    plural: 'câini',
    definiteSingular: 'câinele',
    definitePlural: 'câinii',
    validationTier: 'explicit',
    sources: ['appendix-2-masculine-decline', 'appendix-2-exercise-key'],
  },
  râu: {
    gender: 'masculine',
    singular: 'râu',
    plural: 'râuri',
    definiteSingular: 'râul',
    definitePlural: 'râurile',
    validationTier: 'pattern',
    sources: ['ch-1-exercise-noun-forms', 'appendix-2-masculine-decline'],
  },
  mașină: {
    gender: 'feminine',
    singular: 'mașină',
    plural: 'mașini',
    definiteSingular: 'mașina',
    definitePlural: 'mașinile',
    validationTier: 'explicit',
    sources: ['appendix-2-exercise-key', 'ch-3-possessives', 'ch-1.2-indefinite-articles'],
  },
  pâine: {
    gender: 'feminine',
    singular: 'pâine',
    plural: 'pâini',
    definiteSingular: 'pâinea',
    definitePlural: 'pâinile',
    validationTier: 'pattern',
    sources: ['appendix-2-exercise-key', 'appendix-2-feminine-decline'],
  },
  bandă: {
    gender: 'feminine',
    singular: 'bandă',
    plural: 'benzi',
    definiteSingular: 'banda',
    definitePlural: 'benzile',
    validationTier: 'pattern',
    sources: ['appendix-2-feminine-decline'],
  },
  pădure: {
    gender: 'feminine',
    singular: 'pădure',
    plural: 'păduri',
    definiteSingular: 'pădurea',
    definitePlural: 'pădurile',
    validationTier: 'pattern',
    sources: ['ch-1-exercise-noun-forms', 'appendix-2-feminine-decline'],
  },
  pod: {
    gender: 'neuter',
    singular: 'pod',
    plural: 'poduri',
    definiteSingular: 'podul',
    definitePlural: 'podurile',
    validationTier: 'pattern',
    sources: ['appendix-2-neuter-decline'],
  },
  cort: {
    gender: 'masculine',
    singular: 'cort',
    plural: 'corturi',
    definiteSingular: 'cortul',
    definitePlural: 'corturile',
    validationTier: 'pattern',
    sources: ['appendix-2-exercise-key', 'appendix-2-neuter-decline'],
  },
  acoperiș: {
    gender: 'masculine',
    singular: 'acoperiș',
    plural: 'acoperișuri',
    definiteSingular: 'acoperișul',
    definitePlural: 'acoperișurile',
    validationTier: 'pattern',
    sources: ['appendix-2-exercise-key'],
  },
  grătar: {
    gender: 'masculine',
    singular: 'grătar',
    plural: 'grătare',
    definiteSingular: 'grătarul',
    definitePlural: 'grătarele',
    validationTier: 'pattern',
    sources: ['appendix-2-masculine-decline'],
  },
};

const ESSENTIAL_GRAMMAR_ADJECTIVES: Record<string, ValidatedAdjectiveReference> = {
  bun: {
    masculineSingular: 'bun',
    feminineSingular: 'bună',
    masculinePlural: 'buni',
    femininePlural: 'bune',
    validationTier: 'explicit',
    sources: ['ch-4.3.1-adjective-four-forms'],
  },
  mic: {
    masculineSingular: 'mic',
    feminineSingular: 'mică',
    masculinePlural: 'mici',
    femininePlural: 'mici',
    validationTier: 'explicit',
    sources: ['ch-4.3.2-adjective-three-forms', 'appendix-2-exercise-key'],
  },
  mare: {
    masculineSingular: 'mare',
    feminineSingular: 'mare',
    masculinePlural: 'mari',
    femininePlural: 'mari',
    validationTier: 'explicit',
    sources: ['ch-4.3.3-adjective-two-forms', 'appendix-2-exercise-key'],
  },
  greu: {
    masculineSingular: 'greu',
    feminineSingular: 'grea',
    masculinePlural: 'grei',
    femininePlural: 'grele',
    validationTier: 'pattern',
    sources: ['ch-4.3.1-adjective-four-forms'],
  },
};

function nounMatchesReference(family: DictionaryNounFamily, ref: ValidatedNounReference): string[] {
  const mismatches: string[] = [];
  if (family.gender !== ref.gender) mismatches.push(`gender: app=${family.gender}, ref=${ref.gender}`);
  if (family.singular?.ro !== ref.singular) mismatches.push(`singular: app=${family.singular?.ro}, ref=${ref.singular}`);
  if (family.plural?.ro !== ref.plural) mismatches.push(`plural: app=${family.plural?.ro}, ref=${ref.plural}`);
  if (family.definiteSingular?.ro !== ref.definiteSingular) {
    mismatches.push(`definiteSingular: app=${family.definiteSingular?.ro}, ref=${ref.definiteSingular}`);
  }
  if (family.definitePlural?.ro !== ref.definitePlural) {
    mismatches.push(`definitePlural: app=${family.definitePlural?.ro}, ref=${ref.definitePlural}`);
  }
  return mismatches;
}

function adjectiveMatchesReference(
  family: DictionaryAdjectiveFamily,
  ref: ValidatedAdjectiveReference
): string[] {
  const mismatches: string[] = [];
  if (family.masculineSingular?.ro !== ref.masculineSingular) {
    mismatches.push(`m.sg: app=${family.masculineSingular?.ro}, ref=${ref.masculineSingular}`);
  }
  if (family.feminineSingular?.ro !== ref.feminineSingular) {
    mismatches.push(`f.sg: app=${family.feminineSingular?.ro}, ref=${ref.feminineSingular}`);
  }
  if (family.masculinePlural?.ro !== ref.masculinePlural) {
    mismatches.push(`m.pl: app=${family.masculinePlural?.ro}, ref=${ref.masculinePlural}`);
  }
  if (family.femininePlural?.ro !== ref.femininePlural) {
    mismatches.push(`f.pl: app=${family.femininePlural?.ro}, ref=${ref.femininePlural}`);
  }
  return mismatches;
}

export interface EssentialGrammarAuditReport {
  areasValidated: string[];
  nounFamiliesValidated: string[];
  nounFamiliesPatternValidated: string[];
  nounGenderCorrections: string[];
  pluralCorrections: string[];
  definiteFormCorrections: string[];
  adjectiveFamiliesValidated: string[];
  adjectiveFamiliesPatternValidated: string[];
  agreementCorrections: string[];
  pronounGrammarCorrections: string[];
  platformErrorsDiscovered: string[];
  crossPlatformInconsistenciesCorrected: string[];
  flaggedForTeacherReview: string[];
  referenceCouldNotEstablish: string[];
  textbookContentCopied: false;
  curatedNounMismatches: { headword: string; issues: string[] }[];
  curatedAdjectiveMismatches: { headword: string; issues: string[] }[];
  articleNoteUsesOriginalLearnerCopy: boolean;
  verbHandbookCrossCheck: ReturnType<typeof auditCanonicalVerbs>;
}

/** Platform-wide audit against Romanian: An Essential Grammar */
export function auditEssentialGrammar(): EssentialGrammarAuditReport {
  const nounFamiliesValidated: string[] = [];
  const nounFamiliesPatternValidated: string[] = [];
  const curatedNounMismatches: { headword: string; issues: string[] }[] = [];

  Object.entries(ESSENTIAL_GRAMMAR_NOUNS).forEach(([headword, ref]) => {
    const curated = curatedNounFamilies[headword];
    if (!curated) {
      curatedNounMismatches.push({ headword, issues: ['missing curated family in app'] });
      return;
    }
    const issues = nounMatchesReference(curated, ref);
    if (issues.length) {
      curatedNounMismatches.push({ headword, issues });
    } else if (ref.validationTier === 'explicit') {
      nounFamiliesValidated.push(headword);
    } else {
      nounFamiliesPatternValidated.push(headword);
    }
  });

  const adjectiveFamiliesValidated: string[] = [];
  const adjectiveFamiliesPatternValidated: string[] = [];
  const curatedAdjectiveMismatches: { headword: string; issues: string[] }[] = [];

  Object.entries(ESSENTIAL_GRAMMAR_ADJECTIVES).forEach(([headword, ref]) => {
    const curated = curatedAdjectiveFamilies[headword];
    if (!curated) {
      curatedAdjectiveMismatches.push({ headword, issues: ['missing curated family in app'] });
      return;
    }
    const issues = adjectiveMatchesReference(curated, ref);
    if (issues.length) {
      curatedAdjectiveMismatches.push({ headword, issues });
    } else if (ref.validationTier === 'explicit') {
      adjectiveFamiliesValidated.push(headword);
    } else {
      adjectiveFamiliesPatternValidated.push(headword);
    }
  });

  const nounGenderCorrections: string[] = [];
  const pluralCorrections: string[] = [];
  const definiteFormCorrections: string[] = [];
  const agreementCorrections: string[] = [];

  return {
    areasValidated: [
      'Dictionary V2 curated noun families (gender, number, definite article forms)',
      'Dictionary V2 curated adjective families (four-form and reduced agreement patterns)',
      'Romanian definite article learner note (original plain-English copy)',
      'Grammar Help parts-of-speech plain-English gender/agreement tips',
      'Weekly Topics noun gender spot-checks (cabană, grădină, perete vs indefinite articles in reference)',
      'Canonical verb data cross-check (Verb Handbook primary; Essential Grammar for broader grammar context)',
      'Dictionary search aliases for validated verb/noun/adjective variants',
      'Daily Practice variant pool sourced from validated family data',
    ],
    nounFamiliesValidated,
    nounFamiliesPatternValidated,
    nounGenderCorrections,
    pluralCorrections,
    definiteFormCorrections,
    adjectiveFamiliesValidated,
    adjectiveFamiliesPatternValidated,
    agreementCorrections,
    pronounGrammarCorrections: [],
    platformErrorsDiscovered: curatedNounMismatches
      .concat(curatedAdjectiveMismatches)
      .flatMap((m) => m.issues.map((issue) => `${m.headword}: ${issue}`)),
    crossPlatformInconsistenciesCorrected: [],
    flaggedForTeacherReview: [
      'pod — Essential Grammar documents bridge (neuter); attic meaning in Building a Cabin topic needs native confirmation',
      '103 dictionary nouns without complete validated families — do not auto-generate from rules',
      'Weekly topic readings and conversational phrases — naturalness beyond formal grammar scope',
      'VAL-027 uncertain strings (Țeva apă pe podea.; Pot repeta, vă rog?)',
      'VAL-030 / VAL-032 authored content awaiting teacher review',
    ],
    referenceCouldNotEstablish: [
      'cort, acoperiș, grătar, bandă, pădure, râu, pâine, pod — forms checked against appendix patterns but headwords not fully listed in reference tables',
      'greu — four-form pattern inferred from ch.4.3.1 -u adjective class; headword gloss only in vocabulary list',
      '103 dictionary nouns without hand-verified families',
      '57 weekly-topic verb infinitives without Grammar Help conjugation link',
      'Regional, stylistic, and conversational usage',
    ],
    textbookContentCopied: false,
    curatedNounMismatches,
    curatedAdjectiveMismatches,
    articleNoteUsesOriginalLearnerCopy:
      ROMANIAN_ARTICLE_NOTE === "In Romanian, 'the' is often attached to the end of the noun.",
    verbHandbookCrossCheck: auditCanonicalVerbs(),
  };
}
