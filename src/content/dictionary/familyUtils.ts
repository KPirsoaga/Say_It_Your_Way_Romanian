import type {
  DictionaryAdjectiveFamily,
  DictionaryNounFamily,
  DictionaryVerbFamily,
} from './types';

export const ROMANIAN_ARTICLE_NOTE =
  "In Romanian, 'the' is often attached to the end of the noun.";

export const VERB_PERSON_LABELS = ['eu', 'tu', 'el/ea', 'noi', 'voi', 'ei/ele'] as const;

export function nounHeadword(ro: string): string {
  return ro.split(' ')[0]?.trim() ?? ro;
}

export function isNounFamilyComplete(family: DictionaryNounFamily): boolean {
  return Boolean(
    family.singular?.ro &&
      family.plural?.ro &&
      family.definiteSingular?.ro &&
      family.definitePlural?.ro
  );
}

export function isAdjectiveFamilyComplete(family: DictionaryAdjectiveFamily): boolean {
  return Boolean(
    family.masculineSingular?.ro &&
      family.feminineSingular?.ro &&
      family.masculinePlural?.ro &&
      family.femininePlural?.ro
  );
}

export function nounFamilyChain(family: DictionaryNounFamily): string[] {
  const forms = [
    family.singular?.ro,
    family.plural?.ro,
    family.definiteSingular?.ro,
    family.definitePlural?.ro,
  ].filter((ro): ro is string => Boolean(ro));
  return [...new Set(forms)];
}

export function adjectiveFamilyChain(family: DictionaryAdjectiveFamily): string[] {
  const forms = [
    family.masculineSingular?.ro,
    family.feminineSingular?.ro,
    family.masculinePlural?.ro,
    family.femininePlural?.ro,
  ].filter((ro): ro is string => Boolean(ro));
  return [...new Set(forms)];
}

export function verbPresentChain(family: DictionaryVerbFamily): string[] {
  const infinitive = family.infinitive;
  const present = family.present?.map((f) => f.ro) ?? [];
  if (present.length === 0) return infinitive ? [infinitive] : [];
  return [infinitive, ...present].filter(Boolean);
}

export function hasVerbTense(family: DictionaryVerbFamily, tense: 'present' | 'perfectCompus' | 'imperfect' | 'future'): boolean {
  const forms =
    tense === 'present'
      ? family.present
      : tense === 'perfectCompus'
        ? family.perfectCompus
        : tense === 'imperfect'
          ? family.imperfect
          : family.future;
  return Boolean(forms && forms.length >= 6);
}

export function verbHasAllSupportedTenses(family: DictionaryVerbFamily): boolean {
  return (
    hasVerbTense(family, 'present') &&
    hasVerbTense(family, 'perfectCompus') &&
    hasVerbTense(family, 'imperfect') &&
    hasVerbTense(family, 'future')
  );
}

/** Extract standalone participle tokens from perfect-compus rows like "am spus" → "spus" */
export function extractPerfectParticiples(forms: { ro: string }[]): string[] {
  const parts = new Set<string>();
  forms.forEach((form) => {
    const tokens = form.ro.trim().split(/\s+/);
    if (tokens.length >= 2) {
      const participle = tokens[tokens.length - 1];
      if (participle && participle.length > 1) parts.add(participle);
    }
  });
  return [...parts];
}

export function learnerPersonLabel(label: string): string {
  const map: Record<string, string> = {
    eu: 'eu / I',
    tu: 'tu / you',
    'el/ea': 'el / ea / he / she',
    noi: 'noi / we',
    voi: 'voi / you',
    'ei/ele': 'ei / ele / they',
  };
  return map[label] ?? label;
}
