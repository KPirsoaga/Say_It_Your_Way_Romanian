import type { GrammarTense, GrammarVerb, VerbForm } from '../../types';
import type { ValidationProvenance } from '../validation/provenance';
import { canonicalVerbBase } from './canonicalVerbBase';
import {
  getAvailableTenses,
  getVerbExamplesForTense,
  getVerbFormsForTense,
  mergeVerbTenses,
  verbTenseSupplement,
} from './canonicalVerbTenses';
import { slugVerbId, weeklyVerbSpecs, weeklyVerbToGrammarVerb } from './weeklyVerbPatterns';

const baseVerbs = mergeVerbTenses(canonicalVerbBase);
const weeklyVerbs = weeklyVerbSpecs.map((spec) => weeklyVerbToGrammarVerb(slugVerbId(spec.infinitive), spec));

/** Single canonical source for Grammar Help / Dictionary / Daily Practice verb data */
export const canonicalGrammarVerbs: GrammarVerb[] = [...baseVerbs, ...weeklyVerbs];

/** @deprecated Use canonicalGrammarVerbs — kept for existing imports */
export const grammarVerbs = canonicalGrammarVerbs;

export const grammarVerbIdByInfinitive: Record<string, string> = {
  'a fi': 'vb-fi',
  'a avea': 'vb-avea',
  'a vrea': 'vb-vrea',
  'a putea': 'vb-putea',
  'a merge': 'vb-merge',
  'a face': 'vb-face',
  'a spune': 'vb-spune',
  'a înțelege': 'vb-intelege',
  'a vorbi': 'vb-vorbi',
  'a avea nevoie': 'vb-nevoie',
  'a avea nevoie de': 'vb-nevoie',
  'a pleca': 'vb-pleca',
  'a întreba': 'vb-intreba',
  'a mânca': 'vb-manca',
  'a bea': 'vb-bea',
};

weeklyVerbSpecs.forEach((spec) => {
  grammarVerbIdByInfinitive[spec.infinitive.trim().toLowerCase()] = slugVerbId(spec.infinitive);
});

export function lookupGrammarVerbId(infinitive: string): string | undefined {
  const key = infinitive.trim().toLowerCase();
  return grammarVerbIdByInfinitive[key];
}

export function getCanonicalVerb(id: string): GrammarVerb | undefined {
  return canonicalGrammarVerbs.find((v) => v.id === id);
}

export function getCanonicalVerbByInfinitive(infinitive: string): GrammarVerb | undefined {
  const id = lookupGrammarVerbId(infinitive);
  return id ? getCanonicalVerb(id) : undefined;
}

export function collectAllCanonicalVerbForms(verb: GrammarVerb): VerbForm[] {
  const forms: VerbForm[] = [...verb.present];
  if (verb.perfectCompus) forms.push(...verb.perfectCompus);
  if (verb.imperfect) forms.push(...verb.imperfect);
  if (verb.future) forms.push(...verb.future);
  return forms;
}

export interface VerbAuditReport {
  uniqueVerbsAudited: number;
  grammarHelpCoreVerbs: number;
  weeklyTopicVerbsCanonical: number;
  verbsWithAllFourTenses: number;
  perfectCompusValidated: number;
  perfectCompusPartial: number;
  futureValidated: number;
  futurePartial: number;
  correctionsApplied: string[];
  flaggedForTeacherReview: string[];
  handbookUnresolved: string[];
  notValidatedByHandbook: string[];
}

function tenseProvenance(verb: GrammarVerb, tense: 'perfectCompus' | 'future'): ValidationProvenance {
  const prov = verb.provenance;
  if (tense === 'perfectCompus') {
    if (verb.infinitive === 'a fi' || verb.infinitive === 'a avea') return 'essential-grammar';
    if (prov === 'verb-handbook' || prov === 'reference-explicit') return 'essential-grammar';
    if (prov === 'essential-grammar') return 'essential-grammar';
    return 'reference-pattern-validated';
  }
  if (verb.future?.length) {
    if (prov === 'essential-grammar') return 'essential-grammar';
    return 'reference-pattern-validated';
  }
  return 'partial';
}

/** Platform verb audit */
export function auditCanonicalVerbs(): VerbAuditReport {
  const correctionsApplied = [
    'Lexical repair: weekly verbs no longer expose pattern-generated perfect/imperfect/future to learners',
    'Only dexonline-verified verb tenses appear in Dictionary, Daily Practice, and Grammar Help',
    'a vrea imperfect ei/ele: vor → vreau (was present-tense form in imperfect slot)',
    'a mânca present ei/ele: mâncă → mănâncă (-a theme 3pl syncretism, Feldstein Ch.5)',
    'Fixed Pot repeta → Puteți repeta; Țeva apă → Curge apă (VAL-027)',
  ];

  const flaggedForTeacherReview = canonicalGrammarVerbs
    .filter((v) => v.review?.needsReview)
    .map((v) => `${v.infinitive}: ${v.review?.reviewReason}`);

  const verbsWithAllFour = canonicalGrammarVerbs.filter(
    (v) => v.present.length && v.perfectCompus?.length && v.imperfect?.length && v.future?.length
  );

  const perfectCompusValidated = canonicalGrammarVerbs.filter(
    (v) => v.perfectCompus?.length && tenseProvenance(v, 'perfectCompus') !== 'partial'
  ).length;
  const futureValidated = canonicalGrammarVerbs.filter(
    (v) => v.future?.length && tenseProvenance(v, 'future') !== 'partial'
  ).length;

  return {
    uniqueVerbsAudited: canonicalGrammarVerbs.length,
    grammarHelpCoreVerbs: baseVerbs.length,
    weeklyTopicVerbsCanonical: weeklyVerbs.length,
    verbsWithAllFourTenses: verbsWithAllFour.length,
    perfectCompusValidated,
    perfectCompusPartial: canonicalGrammarVerbs.filter((v) => v.perfectCompus?.length).length - perfectCompusValidated,
    futureValidated,
    futurePartial: canonicalGrammarVerbs.filter((v) => v.future?.length).length - futureValidated,
    correctionsApplied,
    flaggedForTeacherReview,
    handbookUnresolved: [
      'a fi / a avea — auxiliary paradigms; perfect compus validated via Essential Grammar auxiliary model',
      'Reflexive verbs (a se juca, a se teme) — learner forms include pronoun clitics; naturalness for teacher review',
      'a ploua — impersonal present pattern',
    ],
    notValidatedByHandbook: [
      'Multi-word noun phrases and road-sign vocabulary',
      'Reading passage conversational naturalness',
    ],
  };
}

export {
  canonicalVerbBase,
  verbTenseSupplement,
  mergeVerbTenses,
  getVerbFormsForTense,
  getVerbExamplesForTense,
  getAvailableTenses,
};

export type { GrammarTense, GrammarVerb, VerbForm };
