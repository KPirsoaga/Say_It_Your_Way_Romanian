/**
 * INTERNAL CANDIDATE GENERATOR — NOT LEARNER-FACING.
 * Pattern-built noun families may be used for author review only.
 * Learner views, Daily Practice, search aliases, and Grammar Help must use
 * `verifiedLexicalFamilies.ts` instead.
 */
import type { DictionaryNounFamily } from './types';
import { ROMANIAN_ARTICLE_NOTE } from './familyUtils';
import type { ValidationProvenance } from '../validation/provenance';

export interface NounFamilySpec {
  gender: 'masculine' | 'feminine' | 'neuter';
  singular: string;
  en: string;
  plural: string;
  pluralEn?: string;
  definiteSingular: string;
  definitePlural: string;
  definiteSingularEn?: string;
  definitePluralEn?: string;
  provenance: ValidationProvenance;
  articleNote?: string;
  /** When true, all four forms are shown; when false, partial family only */
  complete?: boolean;
}

function defSg(singular: string, gender: NounFamilySpec['gender']): string {
  if (gender === 'feminine') {
    if (singular.endsWith('ă')) return singular.slice(0, -1) + 'a';
    if (singular.endsWith('e')) return singular + 'a';
    return singular + 'a';
  }
  return singular + 'ul';
}

function defPl(plural: string, gender: NounFamilySpec['gender']): string {
  if (gender === 'feminine') {
    if (plural.endsWith('e')) return plural + 'le';
    if (plural.endsWith('i')) return plural.slice(0, -1) + 'ile';
    return plural + 'le';
  }
  if (plural.endsWith('uri')) return plural.slice(0, -1) + 'ile';
  if (plural.endsWith('i')) return plural + 'i';
  if (plural.endsWith('e')) return plural + 'le';
  return plural + 'ii';
}

/** Feminine -ă → -i plural (mașină pattern from Essential Grammar fabrică model uses -i) */
export function feminineAi(singular: string, en: string, plural?: string, provenance: ValidationProvenance = 'reference-pattern-validated'): NounFamilySpec {
  const pl = plural ?? singular.slice(0, -1) + 'i';
  const gender = 'feminine' as const;
  return {
    gender,
    singular,
    en,
    plural: pl,
    definiteSingular: defSg(singular, gender),
    definitePlural: defPl(pl, gender),
    provenance,
    complete: true,
  };
}

/** Feminine -ă → -e plural (greblă pattern) */
export function feminineAe(singular: string, en: string, plural?: string, provenance: ValidationProvenance = 'reference-pattern-validated'): NounFamilySpec {
  const pl = plural ?? singular.slice(0, -1) + 'e';
  const gender = 'feminine' as const;
  return {
    gender,
    singular,
    en,
    plural: pl,
    definiteSingular: defSg(singular, gender),
    definitePlural: defPl(pl, gender),
    provenance,
    complete: true,
  };
}

/** Feminine -e → -i (pădure, carte pattern) */
export function feminineEi(singular: string, en: string, plural?: string, provenance: ValidationProvenance = 'reference-pattern-validated'): NounFamilySpec {
  const pl = plural ?? singular.slice(0, -1) + 'i';
  const gender = 'feminine' as const;
  return {
    gender,
    singular,
    en,
    plural: pl,
    definiteSingular: defSg(singular, gender),
    definitePlural: defPl(pl, gender),
    provenance,
    complete: true,
  };
}

/** Feminine -ie → -ii (fundație pattern) */
export function feminineIie(singular: string, en: string, plural?: string, provenance: ValidationProvenance = 'reference-pattern-validated'): NounFamilySpec {
  const pl = plural ?? singular.slice(0, -2) + 'ii';
  const gender = 'feminine' as const;
  return {
    gender,
    singular,
    en,
    plural: pl,
    definiteSingular: defSg(singular, gender),
    definitePlural: defPl(pl, gender),
    provenance,
    complete: true,
  };
}

/** Masculine with -i plural (câine, codru pattern) */
export function masculineI(singular: string, en: string, plural?: string, provenance: ValidationProvenance = 'reference-pattern-validated'): NounFamilySpec {
  const pl = plural ?? singular + 'i';
  const gender = 'masculine' as const;
  return {
    gender,
    singular,
    en,
    plural: pl,
    definiteSingular: defSg(singular, gender),
    definitePlural: defPl(pl, gender),
    provenance,
    complete: true,
  };
}

/** Masculine/neuter with -uri plural (cort, bloc pattern) */
export function uriPlural(singular: string, en: string, gender: 'masculine' | 'neuter', plural?: string, provenance: ValidationProvenance = 'reference-pattern-validated'): NounFamilySpec {
  const pl = plural ?? singular + 'uri';
  return {
    gender,
    singular,
    en,
    plural: pl,
    definiteSingular: defSg(singular, gender),
    definitePlural: defPl(pl, gender),
    provenance,
    complete: true,
  };
}

/** Masculine with -e plural (grătar pattern) */
export function masculineE(singular: string, en: string, plural?: string, provenance: ValidationProvenance = 'reference-pattern-validated'): NounFamilySpec {
  const pl = plural ?? singular + 'e';
  const gender = 'masculine' as const;
  return {
    gender,
    singular,
    en,
    plural: pl,
    definiteSingular: defSg(singular, gender),
    definitePlural: defPl(pl, gender),
    provenance,
    complete: true,
  };
}

export function specToFamily(spec: NounFamilySpec): DictionaryNounFamily {
  const en = spec.en;
  const plEn = spec.pluralEn ?? `${en}s`;
  return {
    gender: spec.gender,
    singular: { ro: spec.singular, en },
    plural: { ro: spec.plural, en: plEn },
    definiteSingular: { ro: spec.definiteSingular, en: spec.definiteSingularEn ?? `the ${en}` },
    definitePlural: { ro: spec.definitePlural, en: spec.definitePluralEn ?? `the ${plEn}` },
    articleNote: spec.articleNote ?? ROMANIAN_ARTICLE_NOTE,
    complete: spec.complete ?? true,
  };
}

/** Explicit irregular or reference-validated forms */
const EXPLICIT: Record<string, NounFamilySpec> = {
  câine: {
    gender: 'masculine',
    singular: 'câine',
    en: 'dog',
    plural: 'câini',
    definiteSingular: 'câinele',
    definitePlural: 'câinii',
    provenance: 'reference-explicit',
    complete: true,
  },
  mașină: {
    gender: 'feminine',
    singular: 'mașină',
    en: 'car',
    plural: 'mașini',
    definiteSingular: 'mașina',
    definitePlural: 'mașinile',
    provenance: 'reference-explicit',
    complete: true,
  },
  pâine: {
    gender: 'feminine',
    singular: 'pâine',
    en: 'bread',
    plural: 'pâini',
    definiteSingular: 'pâinea',
    definitePlural: 'pâinile',
    provenance: 'reference-explicit',
    complete: true,
  },
  bandă: {
    gender: 'feminine',
    singular: 'bandă',
    en: 'lane',
    plural: 'benzi',
    definiteSingular: 'banda',
    definitePlural: 'benzile',
    provenance: 'reference-explicit',
    complete: true,
  },
  pod: {
    gender: 'neuter',
    singular: 'pod',
    en: 'attic / bridge',
    plural: 'poduri',
    definiteSingular: 'podul',
    definitePlural: 'podurile',
    provenance: 'reference-explicit',
    articleNote: 'Context matters — in the cabin topic, pod means attic.',
    complete: true,
  },
};

/** Weekly-topic and dictionary nouns — pattern-built where not explicit */
export function buildNounFamilyRegistry(): Record<string, DictionaryNounFamily & { provenance?: ValidationProvenance }> {
  const specs: Record<string, NounFamilySpec> = { ...EXPLICIT };

  const add = (key: string, spec: NounFamilySpec) => {
    if (!specs[key]) specs[key] = spec;
  };

  // Already explicit + pattern from curated
  add('cort', uriPlural('cort', 'tent', 'masculine', undefined, 'reference-pattern-validated'));
  add('acoperiș', uriPlural('acoperiș', 'roof', 'masculine'));
  add('grătar', masculineE('grătar', 'barbecue / grill', 'grătare'));
  add('râu', uriPlural('râu', 'river', 'masculine', 'râuri', 'reference-explicit'));
  add('pădure', feminineEi('pădure', 'forest', 'păduri'));

  // Building a Cabin
  add('perete', uriPlural('perete', 'wall', 'masculine', 'pereți'));
  add('gard', uriPlural('gard', 'fence', 'masculine'));
  add('topor', masculineE('topor', 'axe', 'topore'));
  add('tavan', masculineE('tavan', 'ceiling', 'tavane'));
  add('șurub', uriPlural('șurub', 'screw', 'masculine', 'șuruburi'));
  add('podea', feminineAe('podea', 'floor', 'podele'));
  add('fundație', feminineIie('fundație', 'foundation'));
  add('extensie', feminineIie('extensie', 'extension'));
  add('izolație', feminineIie('izolație', 'insulation'));
  add('șurubelniță', feminineAe('șurubelniță', 'screwdriver', 'șurubelnițe'));
  add('încuietoare', feminineIie('încuietoare', 'lock', 'încuietori'));
  add('greblă', feminineAe('greblă', 'rake', 'greble'));

  // Camping
  add('saltea', feminineAe('saltea', 'mattress', 'saltele'));
  add('pătură', feminineAe('pătură', 'blanket', 'pături'));
  add('pernă', feminineAe('pernă', 'pillow', 'perne'));
  add('rucsac', uriPlural('rucsac', 'backpack', 'masculine', 'rucsacuri'));
  add('lanternă', feminineAe('lanternă', 'lantern', 'lanterne'));
  add('foc', uriPlural('foc', 'fire', 'masculine', 'focuri'));
  add('brichetă', feminineAe('brichetă', 'lighter', 'brichete'));
  add('ceaun', uriPlural('ceaun', 'cauldron / pot', 'masculine', 'ceainuri'));
  add('munte', uriPlural('munte', 'mountain', 'masculine', 'munți'));
  add('apă', feminineEi('apă', 'water', 'ape'));
  add('gunoi', uriPlural('gunoi', 'rubbish', 'masculine', 'gunoaie'));
  add('insecte', { gender: 'feminine', singular: 'insecte', en: 'insects', plural: 'insecte', definiteSingular: 'insectele', definitePlural: 'insectele', provenance: 'reference-pattern-validated', complete: true });

  // Dog walkers
  add('cățel', uriPlural('cățel', 'dog (small)', 'masculine', 'căței'));
  add('cățeluș', uriPlural('cățeluș', 'puppy', 'masculine', 'cățeluși'));
  add('rasă', feminineAe('rasă', 'breed', 'rase'));
  add('lesă', feminineAe('lesă', 'leash', 'lese'));
  add('zgardă', feminineAe('zgardă', 'collar', 'zgărzi'));
  add('ham', uriPlural('ham', 'harness', 'masculine', 'hamuri'));
  add('minge', feminineAe('minge', 'ball', 'mingi'));
  add('băț', uriPlural('băț', 'stick', 'masculine', 'bâte'));
  add('jucărie', feminineIie('jucărie', 'toy'));
  add('recompensă', feminineAe('recompensă', 'treat / reward', 'recompense'));
  add('mascul', uriPlural('mascul', 'male (animal)', 'masculine', 'masculi'));
  add('femelă', feminineAe('femelă', 'female (animal)', 'femele'));
  add('blană', feminineAe('blană', 'fur', 'blănuri'));
  add('coadă', feminineAe('coadă', 'tail', 'cozi'));
  add('labă', feminineAe('labă', 'paw', 'labe'));
  add('parc', uriPlural('parc', 'park', 'masculine', 'parcuri'));
  add('plimbare', feminineAe('plimbare', 'walk', 'plimbări'));
  add('stăpân', uriPlural('stăpân', 'owner', 'masculine', 'stăpâni'));
  add('veterinar', uriPlural('veterinar', 'vet', 'masculine', 'veterinari'));

  // Driving
  add('volan', uriPlural('volan', 'steering wheel', 'masculine', 'volane'));
  add('motor', uriPlural('motor', 'engine', 'masculine', 'motoare'));
  add('frână', feminineAe('frână', 'brake', 'frâne'));
  add('ambreiaj', uriPlural('ambreiaj', 'clutch', 'masculine', 'ambreiaje'));
  add('viteză', feminineAe('viteză', 'speed', 'viteze'));
  add('roată', feminineAe('roată', 'wheel', 'roți'));
  add('anvelopă', feminineAe('anvelopă', 'tyre', 'anvelope'));
  add('portbagaj', uriPlural('portbagaj', 'boot / trunk', 'masculine', 'portbagaje'));
  add('capotă', feminineAe('capotă', 'bonnet / hood', 'capote'));
  add('far', uriPlural('far', 'headlight', 'masculine', 'faruri'));
  add('oglindă', feminineAe('oglindă', 'mirror', 'oglinzi'));
  add('parbriz', uriPlural('parbriz', 'windscreen', 'masculine', 'parbrize'));
  add('benzină', feminineEi('benzină', 'petrol', 'benzine'));
  add('motorină', feminineAe('motorină', 'diesel', 'motorine'));
  add('benzinărie', feminineIie('benzinărie', 'petrol station'));
  add('drum', uriPlural('drum', 'road', 'masculine', 'drumuri'));
  add('stradă', feminineAe('stradă', 'street', 'străzi'));
  add('intersecție', feminineIie('intersecție', 'intersection'));
  add('parcare', feminineAe('parcare', 'parking', 'parcări'));
  add('autostradă', feminineAe('autostradă', 'motorway', 'autostrăzi'));
  add('curbă', feminineAe('curbă', 'bend / curve', 'curbe'));
  add('semafor', uriPlural('semafor', 'traffic light', 'masculine', 'semafoare'));

  // BBQ
  add('carne', feminineEi('carne', 'meat', 'cărni'));
  add('cârnați', masculineI('cârnați', 'sausages', 'cârnați'));
  add('mici', masculineI('mici', 'grilled minced-meat rolls', 'mici'));
  add('pui', uriPlural('pui', 'chicken', 'masculine', 'pui'));
  add('porc', uriPlural('porc', 'pork', 'masculine', 'porci'));
  add('salată', feminineAe('salată', 'salad', 'salate'));
  add('sos', uriPlural('sos', 'sauce', 'masculine', 'sosuri'));
  add('muștar', uriPlural('muștar', 'mustard', 'masculine', 'muștaruri'));
  add('farfurie', feminineIie('farfurie', 'plate'));
  add('pahar', uriPlural('pahar', 'glass', 'masculine', 'pahare'));
  add('furculiță', feminineAe('furculiță', 'fork', 'furculițe'));
  add('cuțit', uriPlural('cuțit', 'knife', 'masculine', 'cuțite'));
  add('șervețel', uriPlural('șervețel', 'napkin', 'masculine', 'șervețele'));
  add('masă', feminineAe('masă', 'table', 'mese'));
  add('scaun', uriPlural('scaun', 'chair', 'masculine', 'scaune'));

  const out: Record<string, DictionaryNounFamily & { provenance?: ValidationProvenance }> = {};
  Object.entries(specs).forEach(([key, spec]) => {
    out[key] = { ...specToFamily(spec), provenance: spec.provenance };
  });
  return out;
}

/** Pattern-built candidates — quarantined from learner paths */
export const nounFamilyCandidateRegistry = buildNounFamilyRegistry();

/** @deprecated Use nounFamilyCandidateRegistry — kept for audit imports */
export const nounFamilyRegistry = nounFamilyCandidateRegistry;
