import type { GrammarTense, VerbForm } from '../../types';
import type { LexicalSourceRef } from '../validation/lexicalSafety';

export interface VerifiedVerbTense {
  tense: GrammarTense;
  forms: VerbForm[];
  provenance: 'lexical-explicit' | 'lexical-cross-checked' | 'teacher-validated';
  sources: LexicalSourceRef[];
}

const DEX = 'DEX / DOOM via dexonline.ro';
const CHECKED = '2026-08-17';

function dexUrl(word: string): string {
  return `https://dexonline.ro/definitie/${encodeURIComponent(word)}`;
}

const LABELS = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'] as const;

function vf(rows: [string, string, string][]): VerbForm[] {
  return rows.map(([ro, en, pron], i) => ({
    label: LABELS[i] ?? `p${i}`,
    ro,
    en,
    pron: pron || ro,
  }));
}

/**
 * Verb tenses verified individually on dexonline.ro.
 * Unlisted verb IDs must not expose conjugation tables to learners.
 */
export const verifiedVerbTenses: Record<string, VerifiedVerbTense[]> = {
  'vb-fi': [
    {
      tense: 'present',
      forms: vf([
        ['sunt', 'I am', 'SOONT'],
        ['ești', 'you are', 'esht'],
        ['este', 'he/she is', 'YES-teh'],
        ['suntem', 'we are', 'SOON-tem'],
        ['sunteți', 'you are (pl.)', 'SOON-tets'],
        ['sunt', 'they are', 'SOONT'],
      ]),
      provenance: 'lexical-explicit',
      sources: [{ url: dexUrl('fi'), dictionary: DEX, checkedAt: CHECKED }],
    },
  ],
  'vb-gati': [
    {
      tense: 'present',
      forms: vf([
        ['gătesc', 'I cook', 'guh-TESK'],
        ['gătești', 'you cook', 'guh-TESHT'],
        ['gătește', 'he/she cooks', 'guh-TESHT'],
        ['gătim', 'we cook', 'guh-TEEM'],
        ['gătiți', 'you (pl.) cook', 'guh-TEETS'],
        ['gătesc', 'they cook', 'guh-TESK'],
      ]),
      provenance: 'lexical-explicit',
      sources: [{ url: dexUrl('găti'), dictionary: DEX, checkedAt: CHECKED }],
    },
  ],
  'vb-asculta': [
    {
      tense: 'present',
      forms: vf([
        ['ascult', 'I listen', 'ahs-KOOLT'],
        ['asculți', 'you listen', 'ahs-KOOLTS'],
        ['ascultă', 'he/she listens', 'ahs-KOOL-tuh'],
        ['ascultăm', 'we listen', 'ahs-kool-TUHM'],
        ['ascultați', 'you (pl.) listen', 'ahs-kool-TAHTS'],
        ['ascultă', 'they listen', 'ahs-KOOL-tuh'],
      ]),
      provenance: 'lexical-explicit',
      sources: [{ url: dexUrl('asculta'), dictionary: DEX, checkedAt: CHECKED }],
    },
  ],
};

export function getVerifiedTensesForVerb(verbId: string): VerifiedVerbTense[] {
  return verifiedVerbTenses[verbId] ?? [];
}

export function isVerbTenseLearnerSafe(verbId: string, tense: GrammarTense): boolean {
  return getVerifiedTensesForVerb(verbId).some((v) => v.tense === tense);
}

export function getLearnerSafeVerbForms(verbId: string, tense: GrammarTense): VerbForm[] | undefined {
  const match = getVerifiedTensesForVerb(verbId).find((v) => v.tense === tense);
  return match?.forms;
}
