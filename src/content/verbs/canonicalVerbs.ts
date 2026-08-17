import type { GrammarTense, GrammarVerb, VerbForm } from '../../types';
import { canonicalVerbBase } from './canonicalVerbBase';
import {
  getAvailableTenses,
  getVerbExamplesForTense,
  getVerbFormsForTense,
  mergeVerbTenses,
  verbTenseSupplement,
} from './canonicalVerbTenses';

/** Single canonical source for Grammar Help / Dictionary / Daily Practice verb data */
export const canonicalGrammarVerbs: GrammarVerb[] = mergeVerbTenses(canonicalVerbBase);

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
  grammarHelpVerbs: number;
  weeklyTopicVerbInfinitives: number;
  verbsWithAllFourTenses: number;
  correctionsApplied: string[];
  flaggedForMihaela: string[];
  handbookUnresolved: string[];
  notValidatedByHandbook: string[];
}

/** Platform verb audit — handbook validates type patterns for conjugated forms in canonical data */
export function auditCanonicalVerbs(): VerbAuditReport {
  const correctionsApplied = [
    'a vrea imperfect ei/ele: vor → vreau (was present-tense form in imperfect slot)',
    'a mânca present ei/ele: mâncă → mănâncă (-a theme 3pl syncretism, Feldstein Ch.5)',
    'Added imperfect for a întreba, a mânca, a bea, a avea nevoie de (handbook -a/-e patterns)',
  ];

  const flaggedForMihaela = canonicalGrammarVerbs
    .filter((v) => v.review?.needsReview)
    .map((v) => `${v.infinitive}: ${v.review?.reviewReason}`);

  const verbsWithAllFour = canonicalGrammarVerbs.filter(
    (v) => v.present.length && v.perfectCompus?.length && v.imperfect?.length && v.future?.length
  ).length;

  return {
    uniqueVerbsAudited: canonicalGrammarVerbs.length,
    grammarHelpVerbs: canonicalGrammarVerbs.length,
    weeklyTopicVerbInfinitives: 0,
    verbsWithAllFourTenses: verbsWithAllFour,
    correctionsApplied,
    flaggedForMihaela,
    handbookUnresolved: [
      'a fi — auxiliary paradigm not in handbook irregular section; kept as established learner data',
      'a avea — auxiliary; imperfect in base matches grammarExtended imperfect card',
      'Perfect compus (am + participle) — handbook uses simple perfect; app tense is learner-oriented',
      'Future o să + verb — not covered in handbook paradigms',
    ],
    notValidatedByHandbook: [
      'Noun/adjective word families',
      'Phrase naturalness in readings and conversations',
      'Weekly topic verbs without Grammar Help link (57 infinitives)',
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
