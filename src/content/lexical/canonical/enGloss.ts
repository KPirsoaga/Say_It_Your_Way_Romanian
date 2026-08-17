import type { GrammarTense } from '../../../types';
import type { EnStatus } from './types';

const EN_WHO: Record<string, string> = {
  eu: 'I',
  tu: 'you',
  'el/ea': 'he/she',
  noi: 'we',
  voi: 'you (pl.)',
  'ei/ele': 'they',
};

/** Irregular 3sg present mappings where template would fail */
const IRREGULAR_3SG: Record<string, string> = {
  are: 'has',
  ești: 'are',
  este: 'is',
  poate: 'can',
  vrea: 'wants',
  doarme: 'sleeps',
  plouă: 'it rains',
};

function baseVerbEn(en: string): string {
  return en.replace(/^to\s+/, '').trim();
}

function thirdPersonEn(base: string, tense: GrammarTense): string {
  if (tense === 'present') {
    if (base === 'be') return 'is';
    if (base === 'have') return 'has';
    if (base.endsWith('y') && !/[aeiou]y$/i.test(base)) return `${base.slice(0, -1)}ies`;
    if (/(s|x|z|ch|sh)$/i.test(base)) return `${base}es`;
    return `${base}s`;
  }
  if (tense === 'imperfect') return `used to ${base}`;
  return base;
}

function pastParticipleEn(base: string): string {
  if (base.endsWith('e')) return `${base}d`;
  if (base.endsWith('y') && !/[aeiou]y$/i.test(base)) return `${base.slice(0, -1)}ied`;
  return `${base}ed`;
}

function haveFor(label: string): string {
  return label === 'el/ea' ? 'has' : 'have';
}

/**
 * Build English gloss for a verb form.
 * Systematic only where linguistically straightforward; otherwise flagged.
 */
export function buildVerbEnGloss(
  label: string,
  ro: string,
  tense: GrammarTense,
  verbEn: string,
  curated?: { en?: string }
): { en: string; enStatus: EnStatus } {
  if (curated?.en) {
    const badImperfect = /\bhe\/she \w+[^s]\b/.test(curated.en) && tense === 'imperfect';
    const badPerfect = /\b(I|you|we|they) has\b/i.test(curated.en) || /\bhas [a-z]{1,4}$/i.test(curated.en);
    if (
      !badImperfect &&
      !badPerfect &&
      !curated.en.includes('(ongoing / used to)') &&
      !curated.en.includes('(past)')
    ) {
      return { en: curated.en, enStatus: 'curated' };
    }
  }

  const who = EN_WHO[label] ?? label;
  const base = baseVerbEn(verbEn);

  if (tense === 'present') {
    if (label === 'el/ea' && IRREGULAR_3SG[ro]) {
      return { en: IRREGULAR_3SG[ro] === 'it rains' ? 'it rains' : `he/she ${IRREGULAR_3SG[ro]}`, enStatus: 'systematic' };
    }
    if (label === 'el/ea') {
      const v = thirdPersonEn(base, tense);
      return { en: v === 'it rains' ? v : `he/she ${v}`, enStatus: 'systematic' };
    }
    if (label === 'ei/ele') {
      const v = thirdPersonEn(base, tense);
      const theyForm = v === 'is' ? 'are' : v === 'has' ? 'have' : v.endsWith('s') ? v : `${v}s`;
      return { en: v === 'it rains' ? v : `they ${theyForm}`, enStatus: 'systematic' };
    }
    return { en: `${who} ${base}`, enStatus: 'systematic' };
  }

  if (tense === 'imperfect') {
    if (label === 'el/ea') return { en: `he/she used to ${base}`, enStatus: 'systematic' };
    if (label === 'ei/ele') return { en: `they used to ${base}`, enStatus: 'systematic' };
    return { en: `${who} used to ${base}`, enStatus: 'systematic' };
  }

  if (tense === 'perfect-compus') {
    const who = EN_WHO[label] ?? label;
    const partRo = ro.replace(/^(am|ai|a|ați|au)\s+/, '');
    const irregular: Record<string, string> = {
      fost: 'been',
      adus: 'brought',
      mers: 'gone',
      spus: 'said',
      făcut: 'done',
      văzut: 'seen',
      venit: 'come',
      putut: 'been able',
      vrut: 'wanted',
      băut: 'drunk',
      mâncat: 'eaten',
      dormit: 'slept',
      jucat: 'played',
    };
    const partEn = irregular[partRo] ?? pastParticipleEn(base);
    if (label === 'el/ea') return { en: `he/she has ${partEn}`, enStatus: irregular[partRo] ? 'systematic' : 'flagged' };
    return { en: `${who} ${haveFor(label)} ${partEn}`, enStatus: irregular[partRo] ? 'systematic' : 'flagged' };
  }

  if (tense === 'future') {
    const subj = ro.replace(/^o să\s+/, '');
    if (label === 'el/ea' && IRREGULAR_3SG[subj]) {
      return { en: `he/she will ${base}`, enStatus: 'systematic' };
    }
    return { en: `${who} will ${base}`, enStatus: 'systematic' };
  }

  return { en: `${who} ${base}`, enStatus: 'flagged' };
}

export function pronStatusForForm(curatedPron?: string, ro?: string): 'verified' | 'audio-only' | 'unavailable' {
  if (!curatedPron || !ro) return 'audio-only';
  if (curatedPron === ro) return 'audio-only';
  if (curatedPron.length < 3) return 'audio-only';
  return 'verified';
}
