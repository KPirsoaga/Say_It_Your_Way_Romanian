/**
 * ROMANIAN LANGUAGE DATA IS GOVERNED.
 * Do not infer or generate learner-facing morphology from patterns.
 * See: docs/LANGUAGE_DATA_GOVERNANCE.md
 *
 * Canonical lexical API — single source of linguistic truth for learner-facing features.
 */
import type { GrammarTense } from '../../../types';
import { getVerifiedTensesForVerb, verifiedVerbTenses } from '../../verbs/verifiedVerbForms';
import {
  getVerifiedAdjectiveFamily,
  getVerifiedNounFamily,
} from '../../dictionary/verifiedLexicalFamilies';
import { buildVerbEnGloss, pronStatusForForm } from './enGloss';
import { verbFormTerminology } from './terminology';
import type {
  CanonicalAdjective,
  CanonicalNoun,
  CanonicalVerb,
  CanonicalVerbForm,
  CanonicalVerbTense,
  CompositionRule,
  LexicalSafetyTier,
} from './types';

function tenseSafetyTier(tense: GrammarTense, reflexive: boolean): { tier: LexicalSafetyTier; composition?: CompositionRule } {
  switch (tense) {
    case 'present':
      return reflexive ? { tier: 'lexical-composed', composition: 'reflexive-clitic' } : { tier: 'lexical-attested' };
    case 'imperfect':
      return reflexive ? { tier: 'lexical-composed', composition: 'reflexive-clitic' } : { tier: 'lexical-attested' };
    case 'perfect-compus':
      return { tier: 'lexical-composed', composition: 'perfect-compus' };
    case 'future':
      return { tier: 'lexical-composed', composition: 'future-periphrastic' };
    default:
      return { tier: 'unresolved' };
  }
}

function toCanonicalVerbForm(
  f: { label: string; ro: string; en: string; pron?: string },
  tense: GrammarTense,
  verbEn: string
): CanonicalVerbForm {
  const { en, enStatus } = buildVerbEnGloss(f.label, f.ro, tense, verbEn, { en: f.en });
  const pronStatus = pronStatusForForm(f.pron, f.ro);
  return {
    label: f.label,
    ro: f.ro,
    en,
    pron: pronStatus === 'verified' ? f.pron : undefined,
    enStatus,
    pronStatus,
    terminology: verbFormTerminology(f.label, tense),
  };
}

export function getCanonicalVerb(verbId: string, infinitive?: string, en?: string): CanonicalVerb | undefined {
  const tenses = getVerifiedTensesForVerb(verbId);
  if (!tenses.length) return undefined;
  const reflexive = (infinitive ?? '').startsWith('a se ');
  return {
    id: verbId,
    infinitive: infinitive ?? verbId,
    en: en ?? '',
    tenses: tenses.map((t) => {
      const { tier, composition } = tenseSafetyTier(t.tense, reflexive && t.tense === 'present');
      const comp = composition
        ? {
            rule: composition,
            attestedComponents:
              t.tense === 'perfect-compus'
                ? t.forms.map((f) => f.ro.split(' ').pop() ?? f.ro).filter((v, i, a) => a.indexOf(v) === i)
                : t.tense === 'future'
                  ? t.forms.map((f) => f.ro.replace(/^o să\s+/, ''))
                  : [],
          }
        : undefined;
      return {
        tense: t.tense,
        safetyTier: t.safetyTier ?? tier,
        composition: t.composition ?? comp,
        sources: t.sources,
        provenanceNote:
          tier === 'lexical-composed'
            ? 'Built from individually attested components'
            : 'Directly attested on dexonline.ro',
        forms: t.forms.map((f) => toCanonicalVerbForm(f, t.tense, en ?? '')),
      } satisfies CanonicalVerbTense;
    }),
  };
}

export function getCanonicalNoun(headword: string): CanonicalNoun | undefined {
  const v = getVerifiedNounFamily(headword);
  if (!v) return undefined;
  const f = v.family;
  const forms: CanonicalNoun['forms'] = [];
  const push = (slot: CanonicalNoun['forms'][0]['slot'], form?: { ro: string; en: string; pron?: string }) => {
    if (!form) return;
    forms.push({
      ro: form.ro,
      en: form.en,
      pron: pronStatusForForm(form.pron, form.ro) === 'verified' ? form.pron : undefined,
      pronStatus: pronStatusForForm(form.pron, form.ro),
      enStatus: 'curated',
      safetyTier: 'lexical-attested',
      slot,
    });
  };
  push('singular', f.singular);
  push('plural', f.plural);
  push('definiteSingular', f.definiteSingular);
  push('definitePlural', f.definitePlural);
  return {
    headword,
    en: f.singular.en,
    gender: f.gender,
    forms,
    complete: v.complete,
    sources: v.sources,
    entryClass: 'inflectable-noun',
  };
}

export function getCanonicalAdjective(headword: string): CanonicalAdjective | undefined {
  const v = getVerifiedAdjectiveFamily(headword);
  if (!v) return undefined;
  const f = v.family;
  const forms: CanonicalAdjective['forms'] = [];
  const push = (
    slot: CanonicalAdjective['forms'][0]['slot'],
    form?: { ro: string; en: string; pron?: string }
  ) => {
    if (!form) return;
    forms.push({
      ro: form.ro,
      en: form.en,
      pron: pronStatusForForm(form.pron, form.ro) === 'verified' ? form.pron : undefined,
      pronStatus: pronStatusForForm(form.pron, form.ro),
      enStatus: 'curated',
      safetyTier: 'lexical-attested',
      slot,
    });
  };
  push('masculineSingular', f.masculineSingular);
  push('feminineSingular', f.feminineSingular);
  push('masculinePlural', f.masculinePlural);
  push('femininePlural', f.femininePlural);
  return { headword, en: f.masculineSingular.en, forms, complete: v.complete, sources: v.sources };
}

export function countMorphologyByTier(): {
  attestedTenseBlocks: number;
  composedTenseBlocks: number;
  attestedForms: number;
  composedForms: number;
} {
  let attestedTenseBlocks = 0;
  let composedTenseBlocks = 0;
  let attestedForms = 0;
  let composedForms = 0;
  for (const id of Object.keys(verifiedVerbTenses)) {
    const verb = getCanonicalVerb(id);
    if (!verb) continue;
    for (const t of verb.tenses) {
      if (t.safetyTier === 'lexical-attested') {
        attestedTenseBlocks++;
        attestedForms += t.forms.length;
      } else if (t.safetyTier === 'lexical-composed') {
        composedTenseBlocks++;
        composedForms += t.forms.length;
      }
    }
  }
  return { attestedTenseBlocks, composedTenseBlocks, attestedForms, composedForms };
}

export function getLearnerSafeVerbFormsCanonical(verbId: string, tense: GrammarTense, infinitive?: string, en?: string) {
  const v = getCanonicalVerb(verbId, infinitive, en);
  return v?.tenses.find((t) => t.tense === tense)?.forms;
}

export function getTenseSafetyTier(verbId: string, tense: GrammarTense, infinitive?: string): LexicalSafetyTier {
  const v = getCanonicalVerb(verbId, infinitive);
  return v?.tenses.find((t) => t.tense === tense)?.safetyTier ?? 'unresolved';
}

export function listCanonicalVerbIds(): string[] {
  return Object.keys(verifiedVerbTenses);
}
